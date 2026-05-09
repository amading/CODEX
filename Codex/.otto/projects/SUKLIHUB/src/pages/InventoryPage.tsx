import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger,
} from "@/components/ui/dialog";
import {
  Camera, Upload, ScanLine, Plus, Package, TrendingUp, TrendingDown,
  Zap, AlertTriangle, Search, Edit, Trash2, ArrowUpCircle, ArrowDownCircle,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import type { Product } from "@/types";
import { products, stockMovements, categories } from "@/data/mockData";
import {
  lookupProductByBarcode,
  barcodeCatalogHints,
  normalizeBarcodeInput,
} from "@/lib/catalog/lookupProductByBarcode";
import {
  fetchGlobalCatalogByBarcode,
  getProductsCatalogPhpUrl,
  globalCatalogProductToInventoryShape,
  upsertGlobalCatalogProduct,
} from "@/lib/catalog/globalCatalogApi";
import { compressProductImage } from "@/lib/compressProductImage";
import type { ProductVisionGuess } from "@/lib/productVision/types";
import { recognizeProductFromImage } from "@/lib/productVision/recognizeProductFromImage";

const movementTypeColor: Record<string, string> = {
  stock_in: "text-success",
  stock_out: "text-destructive",
  adjustment: "text-info",
  damaged: "text-warning",
  expired: "text-destructive",
  returned: "text-success",
  transfer: "text-purple-500",
  delivery_prep: "text-primary",
};

const movementTypeLabel: Record<string, string> = {
  stock_in: "Stock In",
  stock_out: "Stock Out",
  adjustment: "Adjustment",
  damaged: "Damaged",
  expired: "Expired",
  returned: "Returned",
  transfer: "Transfer",
  delivery_prep: "Delivery Prep",
};

type AddProductForm = {
  productName: string;
  barcode: string;
  qrCode: string;
  category: string;
  brand: string;
  unit: string;
  quantity: string;
  costPrice: string;
  sellingPrice: string;
  supplier: string;
  expiry: string;
  location: string;
  minStock: string;
  notes: string;
  deliveryItem: boolean;
  birItem: boolean;
};

const SELECT_NONE = "__none__";

function todayIsoDate(): string {
  return new Date().toISOString().slice(0, 10);
}

function createEmptyAddProduct(): AddProductForm {
  return {
    productName: "",
    barcode: "",
    qrCode: "",
    category: "",
    brand: "",
    unit: "",
    quantity: "",
    costPrice: "",
    sellingPrice: "",
    supplier: "",
    expiry: todayIsoDate(),
    location: "",
    minStock: "",
    notes: "",
    deliveryItem: false,
    birItem: false,
  };
}

const SAMPLE_BARCODE_ROWS = barcodeCatalogHints(products, 20);

function matchCatalogCategory(guess: string | null, catalog: string[]): string {
  if (!guess) return "";
  const g = guess.toLowerCase().trim();
  for (const c of catalog) {
    if (c === "All") continue;
    const cl = c.toLowerCase();
    if (g === cl || g.includes(cl) || cl.includes(g)) return c;
  }
  return "";
}

export function InventoryPage() {
  const [search, setSearch] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [aiPreview, setAiPreview] = useState(false);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [productImageBlob, setProductImageBlob] = useState<Blob | null>(null);
  const [imageCompressing, setImageCompressing] = useState(false);

  const [addForm, setAddForm] = useState<AddProductForm>(createEmptyAddProduct);
  const [visionGuess, setVisionGuess] = useState<ProductVisionGuess | null>(null);
  const [visionBusy, setVisionBusy] = useState(false);
  const [visionErr, setVisionErr] = useState<string | null>(null);
  const [barcodeCatalogMatch, setBarcodeCatalogMatch] = useState<Product | null>(null);
  const [catalogMatchOrigin, setCatalogMatchOrigin] = useState<"store" | "global" | null>(null);
  const [barcodeLookupBusy, setBarcodeLookupBusy] = useState(false);

  const galleryInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const barcodeInputRef = useRef<HTMLInputElement>(null);
  const visionAbortRef = useRef<AbortController | null>(null);

  const hasGeminiKey = Boolean(import.meta.env.VITE_GEMINI_API_KEY?.trim());
  const hasBackendIdentify = Boolean(import.meta.env.VITE_PRODUCT_IDENTIFY_URL?.trim());
  const visionCanAnalyze = hasGeminiKey || hasBackendIdentify;
  const productsCatalogPhpUrl = getProductsCatalogPhpUrl();

  useEffect(() => {
    return () => {
      if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl);
    };
  }, [imagePreviewUrl]);

  const handleAddDialogOpenChange = (open: boolean) => {
    setAddOpen(open);
    if (!open) {
      visionAbortRef.current?.abort();
      visionAbortRef.current = null;
      setAiPreview(false);
      setProductImageBlob(null);
      setVisionGuess(null);
      setVisionErr(null);
      setVisionBusy(false);
      setBarcodeCatalogMatch(null);
      setCatalogMatchOrigin(null);
      setAddForm(createEmptyAddProduct());
      setImagePreviewUrl(prev => {
        if (prev) URL.revokeObjectURL(prev);
        return null;
      });
    }
  };

  const assignImageFile = async (file: File | undefined) => {
    if (!file || !file.type.startsWith("image/")) return;
    setImageCompressing(true);
    try {
      const processed = await compressProductImage(file);
      setProductImageBlob(processed);
      setVisionGuess(null);
      setVisionErr(null);
      setImagePreviewUrl(prev => {
        if (prev) URL.revokeObjectURL(prev);
        return URL.createObjectURL(processed);
      });
      setAiPreview(true);
    } finally {
      setImageCompressing(false);
    }
  };

  const runProductVision = async () => {
    if (!productImageBlob) {
      toast.error("Add a photo first.");
      return;
    }
    if (!visionCanAnalyze) {
      toast.error(
        "Set VITE_PRODUCT_IDENTIFY_URL or VITE_GEMINI_API_KEY in .env, then restart npm run dev.",
      );
      return;
    }
    visionAbortRef.current?.abort();
    const ac = new AbortController();
    visionAbortRef.current = ac;
    setVisionBusy(true);
    setVisionErr(null);
    try {
      const guess = await recognizeProductFromImage(productImageBlob, ac.signal);
      let mergedGuess = guess;

      // Backend research fallback: try to enrich when product name is missing.
      if (!guess.productName && hasBackendIdentify) {
        const base = import.meta.env.VITE_PRODUCT_IDENTIFY_URL as string;
        const lookupUrl = new URL("/v1/research-product", base);
        if (guess.barcode) lookupUrl.searchParams.set("barcode", guess.barcode);
        else if (guess.brand) lookupUrl.searchParams.set("q", guess.brand);
        const lr = await fetch(lookupUrl.toString(), { signal: ac.signal });
        if (lr.ok) {
          const lj = await lr.json();
          const hintedName =
            (lj?.hint?.productName as string | undefined)?.trim() ||
            (lj?.web?.title as string | undefined)?.trim() ||
            "";
          const hintedBrand = (lj?.hint?.brand as string | undefined)?.trim() || "";
          if (hintedName || hintedBrand) {
            mergedGuess = {
              ...guess,
              productName: hintedName || guess.productName,
              brand: hintedBrand || guess.brand,
              caveats: guess.caveats ?? "Enriched using backend product research.",
            };
          }
        }
      }

      setVisionGuess(mergedGuess);
      setAddForm(prev => ({
        ...prev,
        productName: mergedGuess.productName?.trim() || prev.productName,
      }));
      toast.success("Photo analyzed. Product name auto-filled.");
    } catch (e) {
      if (e instanceof DOMException && e.name === "AbortError") return;
      const msg = e instanceof Error ? e.message : "Could not analyze the photo.";
      setVisionErr(msg);
      toast.error(msg);
    } finally {
      setVisionBusy(false);
    }
  };

  const applyVisionToForm = () => {
    if (!visionGuess) return;
    setAddForm(prev => {
      const cat =
        matchCatalogCategory(visionGuess.categoryGuess, categories) ||
        (visionGuess.categoryGuess?.trim() ?? "") ||
        prev.category;
      return {
        ...prev,
        productName: visionGuess.productName?.trim() || prev.productName,
        brand: visionGuess.brand?.trim() || prev.brand,
        barcode: visionGuess.barcode?.trim() || prev.barcode,
        sellingPrice:
          visionGuess.suggestedRetailPricePhp != null
            ? String(visionGuess.suggestedRetailPricePhp)
            : prev.sellingPrice,
        category: cat,
      };
    });
    toast.message("Suggestions copied into the form — verify before Save.");
  };

  const applyCatalogProductToForm = (p: Product) => {
    setAddForm(prev => ({
      ...prev,
      productName: p.name,
      barcode: p.barcode,
      qrCode: p.qrCode,
      category: p.category,
      brand: p.brand,
      unit: p.unit,
      costPrice: String(p.costPrice),
      sellingPrice: String(p.sellingPrice),
      supplier: p.supplier,
      expiry: p.expirationDate ?? "",
      location: p.stockLocation,
      minStock: String(p.minStock),
      notes: p.notes ?? "",
      deliveryItem: p.isDeliveryItem,
      birItem: p.isBIRItem,
    }));
    toast.success(`Form filled from catalog: ${p.name}`);
  };

  const lookupBarcodeInCatalog = async () => {
    const digits = normalizeBarcodeInput(addForm.barcode);
    if (!digits) {
      toast.error("Enter or scan a barcode first.");
      setBarcodeCatalogMatch(null);
      setCatalogMatchOrigin(null);
      return;
    }

    const found = lookupProductByBarcode(products, addForm.barcode);
    if (found) {
      setBarcodeCatalogMatch(found);
      setCatalogMatchOrigin("store");
      setAddForm(f => ({ ...f, barcode: found.barcode }));
      toast.success(`Matched in your store: ${found.name}`);
      return;
    }

    if (productsCatalogPhpUrl) {
      setBarcodeLookupBusy(true);
      try {
        const row = await fetchGlobalCatalogByBarcode(productsCatalogPhpUrl, addForm.barcode);
        if (row) {
          setBarcodeCatalogMatch(globalCatalogProductToInventoryShape(row));
          setCatalogMatchOrigin("global");
          setAddForm(f => ({ ...f, barcode: row.barcodeNormalized }));
          toast.success(`Shared catalog: ${row.name}`);
          return;
        }
      } catch (e) {
        const msg =
          e instanceof TypeError ? "Cannot reach shared catalog URL (browser / CORS / server)."
            : e instanceof Error ? e.message
            : "Shared catalog lookup failed.";
        toast.error(msg);
      } finally {
        setBarcodeLookupBusy(false);
      }
    }

    setBarcodeCatalogMatch(null);
    setCatalogMatchOrigin(null);
    if (productsCatalogPhpUrl) {
      toast.error("No product with that barcode (store or shared catalog).");
    } else {
      toast.error("No product with that barcode in this store. Set VITE_PRODUCTS_CATALOG_URL to use shared catalog.");
    }
  };

  const fillFromBarcodeMatch = () => {
    if (barcodeCatalogMatch) applyCatalogProductToForm(barcodeCatalogMatch);
  };

  const handleSaveNewProduct = async () => {
    if (!addForm.productName.trim()) {
      toast.error("Product name is required.");
      return;
    }
    const digits = normalizeBarcodeInput(addForm.barcode);
    if (!digits) {
      toast.error("Add a barcode so the shared catalog can match scans across stores.");
      return;
    }

    if (productsCatalogPhpUrl) {
      try {
        const sug = Number.parseFloat(addForm.sellingPrice);
        const img =
          barcodeCatalogMatch?.image && barcodeCatalogMatch.image.trim() !== ""
            ? barcodeCatalogMatch.image.trim()
            : null;
        await upsertGlobalCatalogProduct(productsCatalogPhpUrl, {
          barcode: addForm.barcode,
          name: addForm.productName.trim(),
          brand: addForm.brand,
          category: addForm.category,
          unit: addForm.unit || "pc",
          imageUrl: img,
          suggestedPrice: Number.isFinite(sug) ? sug : null,
          notes: addForm.notes?.trim() || null,
        });
        toast.success("Shared catalog updated — other stores can reuse this barcode and image URL.");
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Could not save shared catalog.");
        return;
      }
    }

    handleAddDialogOpenChange(false);
  };

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.barcode.includes(search)
  );

  const totalValue = products.reduce((s, p) => s + p.quantity * p.costPrice, 0);
  const lowStockCount = products.filter(p => p.status === "low_stock" || p.status === "out_of_stock").length;

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Inventory</h1>
          <p className="text-sm text-muted-foreground">Product management & stock tracking</p>
        </div>
        <div className="flex gap-2 self-start sm:self-auto">
          <Dialog open={addOpen} onOpenChange={handleAddDialogOpenChange}>
          <DialogTrigger render={<Button className="gap-2" />}>
              <Plus className="h-4 w-4" /> Add Product
            </DialogTrigger>
            <DialogContent className="flex max-h-[90vh] max-w-4xl flex-col gap-0 overflow-hidden p-0 sm:max-w-4xl">
              <div className="shrink-0 border-b px-4 py-4 sm:px-6">
                <DialogHeader className="space-y-0">
                  <DialogTitle>Add New Product</DialogTitle>
                </DialogHeader>
              </div>

              <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
                  {/* Left: image upload & AI preview */}
                  <div className="flex flex-col gap-4">
                    <div>
                      <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-2 flex items-center gap-1">
                        <Zap className="h-3 w-3" /> Product image
                      </p>
                      <input
                        ref={galleryInputRef}
                        type="file"
                        accept="image/*"
                        className="sr-only"
                        onChange={e => {
                          void assignImageFile(e.target.files?.[0]);
                          e.target.value = "";
                        }}
                      />
                      <input
                        ref={cameraInputRef}
                        type="file"
                        accept="image/*"
                        capture="environment"
                        className="sr-only"
                        onChange={e => {
                          void assignImageFile(e.target.files?.[0]);
                          e.target.value = "";
                        }}
                      />
                      <div
                        role="button"
                        tabIndex={0}
                        onClick={() => galleryInputRef.current?.click()}
                        onKeyDown={e => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            galleryInputRef.current?.click();
                          }
                        }}
                        onDragOver={e => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                        onDrop={e => {
                          e.preventDefault();
                          e.stopPropagation();
                          void assignImageFile(e.dataTransfer.files?.[0]);
                        }}
                        aria-busy={imageCompressing}
                        className={[
                          "group/preview relative flex w-full cursor-pointer flex-col overflow-hidden rounded-xl border-2 border-dashed outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                          "aspect-[4/3] min-h-[12rem] max-h-[min(42vh,22.5rem)]",
                          imagePreviewUrl
                            ? "border-primary/40 bg-muted/30"
                            : "border-primary/30 bg-primary/5 p-6 hover:border-primary/50 hover:bg-primary/10",
                          imageCompressing ? "opacity-80" : "",
                        ].join(" ")}
                      >
                        {imagePreviewUrl ? (
                          <div className="absolute inset-0 flex items-center justify-center p-3 min-h-0">
                            <img
                              src={imagePreviewUrl}
                              alt=""
                              decoding="async"
                              className="max-h-full max-w-full rounded-lg object-contain object-center"
                            />
                          </div>
                        ) : (
                          <div className="relative z-0 flex h-full min-h-[12rem] flex-col items-center justify-center px-4 py-6 text-center">
                            <Upload className="h-10 w-10 text-muted-foreground/70 mb-2" />
                            <p className="text-sm font-medium">Drop an image here</p>
                            <p className="text-xs text-muted-foreground mt-1">or click to browse</p>
                            <p className="text-[10px] text-muted-foreground mt-2 max-w-[14rem]">
                              Large photos are resized automatically to load faster.
                            </p>
                          </div>
                        )}
                        {imageCompressing && (
                          <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/60 text-xs font-medium backdrop-blur-[1px]">
                            Optimizing image…
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        className="gap-1.5 text-[11px] h-9 px-1"
                        onClick={() => cameraInputRef.current?.click()}
                      >
                        <Camera className="h-3.5 w-3.5 shrink-0" /> Photo
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        className="gap-1.5 text-[11px] h-9 px-1"
                        onClick={() => galleryInputRef.current?.click()}
                      >
                        <Upload className="h-3.5 w-3.5 shrink-0" /> Upload
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        className="gap-1.5 text-[11px] h-9 px-1"
                        onClick={() => barcodeInputRef.current?.focus()}
                      >
                        <ScanLine className="h-3.5 w-3.5 shrink-0" /> Scan
                      </Button>
                    </div>

                    {aiPreview && (
                      <div className="space-y-3 rounded-xl border border-dashed border-muted-foreground/25 bg-muted/15 p-3">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                            Pack intelligence
                          </p>
                          {!visionCanAnalyze ? (
                            <Badge variant="outline" className="shrink-0 text-[10px]">
                              Setup needed
                            </Badge>
                          ) : null}
                        </div>
                        <p className="text-[11px] leading-snug text-muted-foreground">
                          Detects visible text from packaging and suggests product details
                          (product name, brand, barcode, category, and SRP if visible).
                        </p>

                        {!visionCanAnalyze ? (
                          <p className="text-[11px] leading-relaxed text-muted-foreground">
                            Set{" "}
                            <code className="rounded bg-background px-1 font-mono text-[10px]">VITE_PRODUCT_IDENTIFY_URL</code>{" "}
                            (recommended) or{" "}
                            <code className="rounded bg-background px-1 font-mono text-[10px]">VITE_GEMINI_API_KEY</code> in{" "}
                            <code className="rounded bg-background px-1 font-mono text-[10px]">.env</code>, then restart{" "}
                            <code className="rounded bg-background px-1 font-mono text-[10px]">npm run dev</code>.
                          </p>
                        ) : null}

                        <Button
                          type="button"
                          variant="secondary"
                          className="h-9 w-full gap-2 text-xs"
                          disabled={!productImageBlob || visionBusy || !visionCanAnalyze}
                          onClick={() => void runProductVision()}
                        >
                          {visionBusy ? (
                            <Loader2 className="size-4 shrink-0 animate-spin" aria-hidden />
                          ) : (
                            <Zap className="size-3.5 shrink-0" aria-hidden />
                          )}
                          {visionBusy
                            ? "Analyzing photo…"
                            : "Analyze packaging"}
                        </Button>

                        {visionErr ? (
                          <p className="text-[11px] leading-snug text-destructive">{visionErr}</p>
                        ) : null}

                        {visionGuess ? (
                          <div className="space-y-2 rounded-lg border bg-background p-2.5 text-xs shadow-sm">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="font-semibold text-foreground">Recognition result</span>
                              <Badge
                                variant="outline"
                                className={`text-[10px] capitalize ${
                                  visionGuess.confidence === "high"
                                    ? "border-success/30 bg-success/10 text-success"
                                    : visionGuess.confidence === "medium"
                                      ? "border-warning/30 bg-warning/10 text-warning"
                                      : "border-muted-foreground/40 text-muted-foreground"
                                }`}
                              >
                                {visionGuess.confidence} confidence
                              </Badge>
                            </div>
                            <dl className="grid gap-2 sm:grid-cols-2">
                              {(
                                [
                                  ["Product", visionGuess.productName],
                                  ["Brand", visionGuess.brand],
                                  ["Variant / flavor", visionGuess.variantOrFlavor],
                                  ["Net size", visionGuess.netWeightOrSize],
                                  ["Barcode", visionGuess.barcode],
                                  ["Category guess", visionGuess.categoryGuess],
                                  [
                                    "SRP ₱",
                                    visionGuess.suggestedRetailPricePhp != null
                                      ? visionGuess.suggestedRetailPricePhp.toFixed(2)
                                      : null,
                                  ],
                                  ["Notes", visionGuess.caveats],
                                ] as const
                              ).map(([label, value]) =>
                                value ? (
                                  <div key={label} className="min-w-0">
                                    <dt className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                                      {label}
                                    </dt>
                                    <dd className="mt-0.5 break-words font-medium leading-snug">{value}</dd>
                                  </div>
                                ) : null
                              )}
                            </dl>
                            <Button type="button" size="sm" className="h-9 w-full gap-2 text-xs" onClick={applyVisionToForm}>
                              <Plus className="size-3.5" /> Apply suggestions to form
                            </Button>
                          </div>
                        ) : null}
                      </div>
                    )}
                  </div>

                  {/* Right: product form */}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <Label className="text-xs font-semibold">Product Name *</Label>
                      <Input
                        placeholder="e.g. Piattos Roast Beef 85g"
                        className="mt-1.5 h-9"
                        value={addForm.productName}
                        onChange={e => setAddForm(f => ({ ...f, productName: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label className="text-xs font-semibold">Barcode</Label>
                      <div className="mt-1.5 flex gap-1.5">
                        <Input
                          ref={barcodeInputRef}
                          placeholder="Scan or type, then Lookup"
                          className="h-9 min-w-0 flex-1 font-mono text-sm"
                          value={addForm.barcode}
                          onChange={e => {
                            setBarcodeCatalogMatch(null);
                            setCatalogMatchOrigin(null);
                            setAddForm(f => ({ ...f, barcode: e.target.value }));
                          }}
                          onKeyDown={e => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              void lookupBarcodeInCatalog();
                            }
                          }}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          className="h-9 shrink-0 gap-1.5 px-2.5 text-xs"
                          disabled={barcodeLookupBusy}
                          onClick={() => void lookupBarcodeInCatalog()}
                        >
                          {barcodeLookupBusy ? (
                            <Loader2 className="size-3.5 animate-spin" />
                          ) : (
                            <Search className="size-3.5" />
                          )}
                          Lookup
                        </Button>
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs font-semibold">QR Code</Label>
                      <Input
                        placeholder="QR code value"
                        className="mt-1.5 h-9 font-mono"
                        value={addForm.qrCode}
                        onChange={e => setAddForm(f => ({ ...f, qrCode: e.target.value }))}
                      />
                    </div>

                    {barcodeCatalogMatch ? (
                      <div className="rounded-lg border border-primary/25 bg-primary/5 p-3 sm:col-span-2">
                        <p className="text-[10px] font-semibold uppercase tracking-wide text-primary">
                          {catalogMatchOrigin === "global" ? "Shared catalog (all stores)" : "Your store inventory"}
                        </p>
                        <p className="mt-1 text-sm font-semibold leading-tight">{barcodeCatalogMatch.name}</p>
                        <p className="mt-0.5 text-[11px] text-muted-foreground">
                          {barcodeCatalogMatch.category} · ₱{barcodeCatalogMatch.sellingPrice} ·{" "}
                          {barcodeCatalogMatch.status.replaceAll("_", " ")}
                        </p>
                        <Button
                          type="button"
                          size="sm"
                          className="mt-2 h-8 w-full text-xs sm:w-auto"
                          onClick={fillFromBarcodeMatch}
                        >
                          Fill form from this product
                        </Button>
                      </div>
                    ) : null}

                    <details className="rounded-lg border bg-muted/30 px-3 py-2 sm:col-span-2">
                      <summary className="cursor-pointer text-xs font-medium text-foreground">
                        Try sample barcodes (store list)
                      </summary>
                      <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">
                        Lookup checks <span className="font-medium text-foreground">your in-app products</span> first,
                        then the PHP shared catalog when{" "}
                        <span className="font-mono text-[10px]">VITE_PRODUCTS_CATALOG_URL</span> is set (same image URL
                        is reused everywhere).
                      </p>
                      <ul className="mt-2 grid max-h-40 gap-1 overflow-y-auto text-[11px] sm:grid-cols-2">
                        {SAMPLE_BARCODE_ROWS.map(row => (
                          <li key={row.barcode}>
                            <button
                              type="button"
                              className="w-full rounded-md px-1 py-0.5 text-left font-mono text-foreground hover:bg-background"
                              onClick={() => {
                                const found = lookupProductByBarcode(products, row.barcode);
                                setAddForm(f => ({ ...f, barcode: row.barcode }));
                                setBarcodeCatalogMatch(found);
                                if (found) {
                                  toast.success(`Matched: ${found.name}`);
                                } else {
                                  toast.error("Unexpected: barcode not in catalog.");
                                }
                              }}
                            >
                              <span className="text-primary">{row.barcode}</span>
                              <span className="ml-1 font-sans text-muted-foreground">{row.name}</span>
                            </button>
                          </li>
                        ))}
                      </ul>
                    </details>

                    <div>
                      <Label className="text-xs font-semibold">Category</Label>
                      <Select
                        value={addForm.category || SELECT_NONE}
                        onValueChange={v => {
                          const next = (v ?? "") as string;
                          setAddForm(f => ({ ...f, category: next === SELECT_NONE ? "" : next }));
                        }}
                      >
                        <SelectTrigger className="mt-1.5 h-9 text-sm">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={SELECT_NONE}>Select category</SelectItem>
                          {categories.filter(c => c !== "All").map(c => (
                            <SelectItem key={c} value={c}>
                              {c}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-xs font-semibold">Brand</Label>
                      <Input
                        placeholder="e.g. Universal Robina, Jack 'n Jill"
                        className="mt-1.5 h-9"
                        value={addForm.brand}
                        onChange={e => setAddForm(f => ({ ...f, brand: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label className="text-xs font-semibold">Unit</Label>
                      <Select
                        value={addForm.unit || SELECT_NONE}
                        onValueChange={v => {
                          const next = (v ?? "") as string;
                          setAddForm(f => ({ ...f, unit: next === SELECT_NONE ? "" : next }));
                        }}
                      >
                        <SelectTrigger className="mt-1.5 h-9 text-sm">
                          <SelectValue placeholder="Unit" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={SELECT_NONE}>Unit</SelectItem>
                          {["piece", "pack", "bottle", "can", "box", "bag", "sachet", "kg"].map(u => (
                            <SelectItem key={u} value={u}>
                              {u}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-xs font-semibold">Initial Quantity</Label>
                      <Input
                        type="number"
                        placeholder="0"
                        className="mt-1.5 h-9"
                        value={addForm.quantity}
                        onChange={e => setAddForm(f => ({ ...f, quantity: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label className="text-xs font-semibold">Cost Price (₱)</Label>
                      <Input
                        type="number"
                        placeholder="0.00"
                        className="mt-1.5 h-9"
                        value={addForm.costPrice}
                        onChange={e => setAddForm(f => ({ ...f, costPrice: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label className="text-xs font-semibold">Selling Price (₱)</Label>
                      <Input
                        type="number"
                        placeholder="0.00"
                        className="mt-1.5 h-9"
                        value={addForm.sellingPrice}
                        onChange={e => setAddForm(f => ({ ...f, sellingPrice: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label className="text-xs font-semibold">Supplier</Label>
                      <Input
                        placeholder="Supplier name"
                        className="mt-1.5 h-9"
                        value={addForm.supplier}
                        onChange={e => setAddForm(f => ({ ...f, supplier: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label className="text-xs font-semibold">Expiration Date</Label>
                      <Input
                        type="date"
                        className="mt-1.5 h-9"
                        value={addForm.expiry}
                        onChange={e => setAddForm(f => ({ ...f, expiry: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label className="text-xs font-semibold">Stock Location</Label>
                      <Input
                        placeholder="e.g. Aisle 1, Storage"
                        className="mt-1.5 h-9"
                        value={addForm.location}
                        onChange={e => setAddForm(f => ({ ...f, location: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label className="text-xs font-semibold">Minimum Stock</Label>
                      <Input
                        type="number"
                        placeholder="e.g. 10"
                        className="mt-1.5 h-9"
                        value={addForm.minStock}
                        onChange={e => setAddForm(f => ({ ...f, minStock: e.target.value }))}
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <Label className="text-xs font-semibold">Notes</Label>
                      <Textarea
                        placeholder="Additional notes…"
                        className="mt-1.5 resize-none text-sm"
                        rows={2}
                        value={addForm.notes}
                        onChange={e => setAddForm(f => ({ ...f, notes: e.target.value }))}
                      />
                    </div>
                    <div className="flex gap-6 sm:col-span-2">
                      <label className="flex cursor-pointer items-center gap-2 text-sm">
                        <Checkbox
                          checked={addForm.deliveryItem}
                          onCheckedChange={checked =>
                            setAddForm(f => ({ ...f, deliveryItem: !!checked }))
                          }
                        />
                        Delivery Item
                      </label>
                      <label className="flex cursor-pointer items-center gap-2 text-sm">
                        <Checkbox
                          checked={addForm.birItem}
                          onCheckedChange={checked =>
                            setAddForm(f => ({ ...f, birItem: !!checked }))
                          }
                        />
                        BIR Item
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="shrink-0 border-t px-4 py-3 sm:px-6">
                <DialogFooter className="gap-2 sm:justify-end">
                  <Button type="button" variant="outline" onClick={() => handleAddDialogOpenChange(false)}>
                    Cancel
                  </Button>
                  <Button type="button" className="gap-2" onClick={() => void handleSaveNewProduct()}>
                    <Plus className="h-4 w-4" /> Save Product
                  </Button>
                </DialogFooter>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total Products", value: products.length, icon: Package, color: "text-primary" },
          { label: "Inventory Value", value: `₱${(totalValue / 1000).toFixed(1)}k`, icon: TrendingUp, color: "text-success" },
          { label: "Low / Out of Stock", value: lowStockCount, icon: AlertTriangle, color: "text-warning" },
          { label: "Stock Movements Today", value: stockMovements.length, icon: ArrowUpCircle, color: "text-info" },
        ].map(s => (
          <Card key={s.label}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-muted-foreground uppercase tracking-wide">{s.label}</span>
                <s.icon className={`h-4 w-4 ${s.color}`} />
              </div>
              <p className="text-xl font-bold">{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="products">
        <TabsList>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="movements">Stock Movements</TabsTrigger>
          <TabsTrigger value="adjust">Quick Adjust</TabsTrigger>
        </TabsList>

        {/* Products Table */}
        <TabsContent value="products" className="mt-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <div className="relative flex-1 max-w-xs">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                  <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products…" className="pl-8 h-9 text-sm" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[min(24rem,calc(100svh-20rem))] md:h-[min(24rem,70vh)] xl:h-96">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead className="text-right">Cost</TableHead>
                      <TableHead className="text-right">Price</TableHead>
                      <TableHead className="text-right">Qty</TableHead>
                      <TableHead className="text-right">Value</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Tags</TableHead>
                      <TableHead />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.map(p => (
                      <TableRow key={p.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <img src={p.image} alt={p.name} className="h-9 w-9 rounded-lg object-cover" />
                            <div>
                              <p className="text-sm font-medium">{p.name}</p>
                              <p className="text-xs font-mono text-muted-foreground">{p.barcode}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">{p.category}</TableCell>
                        <TableCell className="text-right text-sm">₱{p.costPrice}</TableCell>
                        <TableCell className="text-right text-sm font-semibold text-primary">₱{p.sellingPrice}</TableCell>
                        <TableCell className="text-right text-sm">{p.quantity}</TableCell>
                        <TableCell className="text-right text-sm text-muted-foreground">₱{(p.quantity * p.costPrice).toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge className={`text-[10px] ${
                            p.status === "in_stock" ? "bg-success/10 text-success border-success/20" :
                            p.status === "low_stock" ? "bg-warning/10 text-warning border-warning/20" :
                            "bg-destructive/10 text-destructive border-destructive/20"
                          } border`} variant="outline">
                            {p.status === "in_stock" ? "In Stock" : p.status === "low_stock" ? "Low" : "Out"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            {p.isDeliveryItem && <Badge variant="secondary" className="text-[10px] h-4 px-1">Delivery</Badge>}
                            {p.isBIRItem && <Badge variant="secondary" className="text-[10px] h-4 px-1">BIR</Badge>}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="icon" className="h-7 w-7"><Edit className="h-3.5 w-3.5" /></Button>
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive"><Trash2 className="h-3.5 w-3.5" /></Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Stock Movements */}
        <TabsContent value="movements" className="mt-4">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right">Qty</TableHead>
                    <TableHead className="text-right">Before</TableHead>
                    <TableHead className="text-right">After</TableHead>
                    <TableHead>Note</TableHead>
                    <TableHead>Employee</TableHead>
                    <TableHead>Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stockMovements.map(m => (
                    <TableRow key={m.id}>
                      <TableCell className="text-sm font-medium">{m.productName}</TableCell>
                      <TableCell>
                        <div className={`flex items-center gap-1 text-xs font-medium ${movementTypeColor[m.type]}`}>
                          {["stock_in", "returned"].includes(m.type) ? <ArrowUpCircle className="h-3.5 w-3.5" /> : <ArrowDownCircle className="h-3.5 w-3.5" />}
                          {movementTypeLabel[m.type]}
                        </div>
                      </TableCell>
                      <TableCell className={`text-right text-sm font-bold ${movementTypeColor[m.type]}`}>
                        {["stock_in", "returned"].includes(m.type) ? "+" : "-"}{m.quantity}
                      </TableCell>
                      <TableCell className="text-right text-sm text-muted-foreground">{m.before}</TableCell>
                      <TableCell className="text-right text-sm">{m.after}</TableCell>
                      <TableCell className="text-xs text-muted-foreground max-w-[150px] truncate">{m.note || "—"}</TableCell>
                      <TableCell className="text-sm">{m.employeeName}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{m.createdAt.split(" ")[1]}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Quick Adjust */}
        <TabsContent value="adjust" className="mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {["Stock In", "Stock Out", "Adjustment", "Damaged / Expired"].map(type => (
              <Card key={type}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    {type === "Stock In" || type === "Adjustment" ?
                      <ArrowUpCircle className="h-4 w-4 text-success" /> :
                      <ArrowDownCircle className="h-4 w-4 text-destructive" />}
                    {type}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <Label className="text-xs">Product</Label>
                    <Select>
                      <SelectTrigger className="mt-1 h-9 text-sm"><SelectValue placeholder="Select product" /></SelectTrigger>
                      <SelectContent>
                        {products.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-xs">Quantity</Label>
                    <Input type="number" placeholder="0" className="mt-1 h-9" />
                  </div>
                  <div>
                    <Label className="text-xs">Note / Reason</Label>
                    <Input placeholder="Optional note" className="mt-1 h-9" />
                  </div>
                  <Button className="w-full gap-2 text-sm" size="sm">
                    <Package className="h-4 w-4" /> Record {type}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
