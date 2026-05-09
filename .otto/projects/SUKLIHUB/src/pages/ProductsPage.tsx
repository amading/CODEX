import { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Search, LayoutGrid, List, ShoppingCart, Check, Minus, Plus,
  ChevronRight, Receipt, CreditCard,
} from "lucide-react";
import { products as mockProducts, categories } from "@/data/mockData";
import type { Product } from "@/types";

interface CartItem { product: Product; qty: number; }

const VALID_COUPON = "ENDYEARSALE";
const TAX_RATE = 0.12;
const DISCOUNT_RATE = 0.10;

export function ProductsPage() {
  const inventoryApiUrl = (import.meta.env.VITE_INVENTORY_PRODUCTS_URL as string | undefined)?.trim();
  const inventoryStoreKey = (import.meta.env.VITE_STORE_KEY as string | undefined)?.trim() || "default";

  const [productList, setProductList] = useState<Product[]>(mockProducts);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [view, setView] = useState<"card" | "list">("card");
  const [selectedCat, setSelectedCat] = useState("All Categories");
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [couponCode, setCouponCode] = useState("ENDYEARSALE");
  const [couponApplied, setCouponApplied] = useState(true);
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  useEffect(() => {
    if (!inventoryApiUrl) return;
    const ac = new AbortController();

    const loadInventoryProducts = async () => {
      setLoadingProducts(true);
      try {
        const url = new URL(inventoryApiUrl);
        if (!url.searchParams.get("store_key")) {
          url.searchParams.set("store_key", inventoryStoreKey);
        }
        const res = await fetch(url.toString(), { signal: ac.signal });
        if (!res.ok) return;
        const body = (await res.json()) as { ok?: boolean; rows?: unknown[] };
        if (!body?.ok || !Array.isArray(body.rows)) return;

        const rows = body.rows
          .filter((v): v is Record<string, unknown> => !!v && typeof v === "object")
          .map((r, i): Product => {
            const qty = Number(r.quantity ?? 0);
            const min = Number(r.minStock ?? 0);
            const statusRaw = String(r.status ?? "");
            const status: Product["status"] =
              statusRaw === "out_of_stock" || statusRaw === "low_stock" || statusRaw === "in_stock"
                ? statusRaw
                : qty <= 0
                  ? "out_of_stock"
                  : qty <= min
                    ? "low_stock"
                    : "in_stock";

            return {
              id: String(r.id ?? `inv-${i}`),
              name: String(r.name ?? "Unnamed Product"),
              barcode: String(r.barcode ?? ""),
              qrCode: String(r.qrCode ?? ""),
              category: String(r.category ?? "Others"),
              brand: String(r.brand ?? ""),
              unit: String(r.unit ?? "pc"),
              quantity: Number.isFinite(qty) ? qty : 0,
              costPrice: Number(r.costPrice ?? 0),
              sellingPrice: Number(r.sellingPrice ?? 0),
              supplier: String(r.supplier ?? ""),
              expirationDate: r.expirationDate ? String(r.expirationDate) : undefined,
              stockLocation: String(r.stockLocation ?? ""),
              minStock: Number.isFinite(min) ? min : 0,
              isDeliveryItem: Boolean(r.isDeliveryItem),
              isBIRItem: Boolean(r.isBirItem ?? r.isBIRItem),
              notes: r.notes ? String(r.notes) : undefined,
              image: String(r.imageUrl ?? ""),
              status,
              lastUpdated: String(r.updatedAt ?? new Date().toISOString()),
            };
          });

        if (rows.length > 0) {
          setProductList(rows);
        }
      } catch {
        // Keep mock products as fallback.
      } finally {
        setLoadingProducts(false);
      }
    };

    void loadInventoryProducts();
    return () => ac.abort();
  }, [inventoryApiUrl, inventoryStoreKey]);

  const categoryOptions = useMemo(() => {
    const fromProducts = Array.from(new Set(productList.map(p => p.category).filter(Boolean)));
    const merged = Array.from(new Set([...fromProducts, ...categories.filter(c => c !== "All")]));
    return ["All Categories", ...merged.sort((a, b) => a.localeCompare(b))];
  }, [productList]);

  const filtered = productList.filter(p => {
    const matchCat = selectedCat === "All Categories" || p.category === selectedCat;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.barcode.includes(search);
    return matchCat && matchSearch;
  });

  const addToCart = (product: Product) => {
    if (product.status === "out_of_stock") return;
    setCart(prev => {
      const existing = prev.find(c => c.product.id === product.id);
      if (existing) return prev.map(c => c.product.id === product.id ? { ...c, qty: c.qty + 1 } : c);
      return [...prev, { product, qty: 1 }];
    });
  };

  const updateQty = (id: string, delta: number) => {
    setCart(prev =>
      prev
        .map(c => c.product.id === id ? { ...c, qty: Math.max(0, c.qty + delta) } : c)
        .filter(c => c.qty > 0)
    );
  };

  const isInCart = (id: string) => cart.some(c => c.product.id === id);

  const subtotal = cart.reduce((s, c) => s + c.qty * c.product.sellingPrice, 0);
  const tax = subtotal * TAX_RATE;
  const discount = couponApplied && subtotal > 0 ? subtotal * DISCOUNT_RATE : 0;
  const total = subtotal + tax - discount;

  const fmt = (n: number) => `$${Math.abs(n).toFixed(1)}`;

  const applyCoupon = () => {
    if (couponCode.toUpperCase() === VALID_COUPON) setCouponApplied(true);
  };

  return (
    <div className="flex min-h-0 flex-col gap-4 lg:h-[calc(100dvh-7.25rem)] lg:max-h-[calc(100dvh-7.25rem)] lg:flex-row lg:gap-5 lg:overflow-hidden">

      {/* ── Products Section ─────────────────────────────── */}
      <div className="flex flex-1 min-h-0 min-w-0 flex-col overflow-hidden">

        {/* Page title + subtitle */}
        <div className="mb-3">
          <h1 className="text-xl font-bold tracking-tight">Products</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {loadingProducts ? "Syncing latest inventory... " : ""}
            {filtered.length} Items found for{" "}
            <span className="text-primary font-medium">{selectedCat}</span>
          </p>
        </div>

        {/* Filter bar */}
        <div className="mb-2.5 flex min-w-0 flex-wrap items-center gap-2">
          {/* Category dropdown */}
          <Select value={selectedCat} onValueChange={v => v && setSelectedCat(v)}>
            <SelectTrigger className="h-9 w-full min-w-0 shrink-0 text-sm sm:w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categoryOptions.map(c => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Search */}
          <div className="relative min-w-[8rem] flex-1 sm:max-w-xs">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search..."
              className="pl-9 h-9 text-sm"
            />
          </div>

          {/* Sort + View toggle — pushed right */}
          <div className="flex w-full shrink-0 flex-wrap items-center justify-end gap-2 sm:ml-auto sm:w-auto sm:justify-start">
            <div className="hidden sm:flex items-center gap-1 text-sm text-muted-foreground cursor-pointer hover:text-foreground transition-colors select-none">
              <span>Sort by</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </div>
            {/* View toggle */}
            <div className="flex items-center gap-0.5 border rounded-lg p-0.5">
              <button
                onClick={() => setView("card")}
                aria-label="Grid view"
                className={`p-1.5 rounded-md transition-colors ${
                  view === "card"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setView("list")}
                aria-label="List view"
                className={`p-1.5 rounded-md transition-colors ${
                  view === "list"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Grid / List */}
        <ScrollArea className="-mr-1 min-h-0 flex-1">
          {view === "card" ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 pr-2 pb-2">
              {filtered.map(product => {
                const inCart = isInCart(product.id);
                const disabled = product.status === "out_of_stock";
                return (
                  <div
                    key={product.id}
                    role="button"
                    tabIndex={disabled ? -1 : 0}
                    onClick={() => !disabled && addToCart(product)}
                    onKeyDown={e => e.key === "Enter" && !disabled && addToCart(product)}
                    aria-label={`Add ${product.name} to cart`}
                    className={[
                      "relative bg-card rounded-xl overflow-hidden transition-all select-none",
                      "border-2 cursor-pointer",
                      inCart
                        ? "border-primary shadow-sm shadow-primary/20"
                        : "border-border hover:border-primary/40 hover:shadow-md",
                      disabled ? "opacity-40 cursor-not-allowed" : "active:scale-[0.98]",
                    ].join(" ")}
                  >
                    {/* Orange checkmark badge when in cart */}
                    {inCart && (
                      <div className="absolute top-2 right-2 z-10 h-6 w-6 rounded-full bg-primary flex items-center justify-center shadow-sm">
                        <Check className="h-3.5 w-3.5 text-primary-foreground stroke-[3]" />
                      </div>
                    )}

                    {/* Product image */}
                    <div className="aspect-[4/3] bg-white flex items-center justify-center p-3">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-contain"
                        loading="lazy"
                      />
                    </div>

                    {/* Info */}
                    <div className="p-2.5 space-y-1">
                      <p className="text-xs font-medium text-foreground leading-snug line-clamp-2 min-h-[2.5em]">
                        {product.name}
                      </p>
                      <p className="text-sm font-bold text-primary">
                        ₱{product.sellingPrice.toFixed(2)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="pr-2">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                    <TableHead className="text-right">Stock</TableHead>
                    <TableHead className="w-8" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map(product => {
                    const inCart = isInCart(product.id);
                    return (
                      <TableRow
                        key={product.id}
                        className={`cursor-pointer transition-colors ${inCart ? "bg-primary/5 hover:bg-primary/10" : "hover:bg-muted/50"}`}
                        onClick={() => addToCart(product)}
                      >
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <img src={product.image} alt={product.name} className="h-8 w-8 rounded-lg object-contain bg-white p-0.5" />
                            <div>
                              <p className="text-sm font-medium line-clamp-1">{product.name}</p>
                              <p className="text-xs text-muted-foreground font-mono">{product.barcode}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">{product.category}</TableCell>
                        <TableCell className="text-right text-sm font-semibold text-primary">₱{product.sellingPrice}</TableCell>
                        <TableCell className="text-right text-sm">{product.quantity}</TableCell>
                        <TableCell>
                          {inCart && (
                            <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center mx-auto">
                              <Check className="h-3 w-3 text-primary-foreground stroke-[3]" />
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </ScrollArea>
      </div>

      {/* ── Shopping Cart Panel ───────────────────────────── */}
      <aside className="flex w-full max-h-[min(22rem,calc(100dvh-18rem))] min-h-[13rem] shrink-0 flex-col overflow-hidden rounded-2xl border bg-card shadow-sm lg:max-h-none lg:h-auto lg:w-72 xl:w-80">

        {/* Cart header */}
        <div className="flex items-start justify-between px-4 pt-4 pb-3">
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-primary shrink-0" />
            <h2 className="text-base font-bold">Shopping Cart</h2>
          </div>
          <div className="text-right shrink-0">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Order Number</p>
            <p className="text-sm font-bold">#121822</p>
          </div>
        </div>

        {/* Column headers */}
        <div className="grid grid-cols-[1fr_auto] px-4 py-1.5 border-y bg-muted/30 gap-4">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Product</span>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">QTY</span>
        </div>

        {/* Items */}
        <ScrollArea className="min-h-0 flex-1">
          <div className="px-4 py-3 space-y-3">
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
                <ShoppingCart className="h-10 w-10 mb-2 opacity-20" />
                <p className="text-xs">Tap a product to add</p>
              </div>
            ) : (
              cart.map(item => (
                <div key={item.product.id} className="flex items-center gap-3">
                  {/* Thumbnail */}
                  <div className="h-11 w-11 rounded-lg bg-white border shrink-0 flex items-center justify-center p-1 overflow-hidden">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-full h-full object-contain"
                    />
                  </div>

                  {/* Name + price */}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold leading-snug line-clamp-2">{item.product.name}</p>
                    <p className="text-xs font-bold text-primary mt-0.5">
                      ₱{item.product.sellingPrice.toFixed(2)}
                    </p>
                  </div>

                  {/* Qty controls */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => updateQty(item.product.id, -1)}
                      aria-label="Decrease quantity"
                      className="h-6 w-6 rounded-full bg-muted hover:bg-muted/70 border flex items-center justify-center transition-colors"
                    >
                      <Minus className="h-3 w-3 text-foreground" />
                    </button>
                    <span className="text-sm font-bold w-4 text-center tabular-nums">{item.qty}</span>
                    <button
                      onClick={() => updateQty(item.product.id, 1)}
                      aria-label="Increase quantity"
                      className="h-6 w-6 rounded-full bg-primary hover:bg-primary/90 flex items-center justify-center transition-colors"
                    >
                      <Plus className="h-3 w-3 text-primary-foreground" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>

        {/* Footer: coupon + breakdown + submit */}
        <div className="px-4 pb-4 pt-3 border-t space-y-3">

          {/* Coupon row */}
          <div className="flex items-center gap-2">
            <Receipt className="h-4 w-4 text-primary shrink-0" />
            <span className="text-sm font-medium shrink-0">Coupon</span>
            <div className="flex-1 flex gap-1.5">
              <Input
                value={couponCode}
                onChange={e => { setCouponCode(e.target.value); setCouponApplied(false); }}
                placeholder="Enter code"
                className="h-8 text-xs flex-1 font-mono uppercase"
              />
              <button
                onClick={applyCoupon}
                aria-label="Apply coupon"
                className="h-8 w-8 rounded-full bg-primary hover:bg-primary/90 flex items-center justify-center shrink-0 transition-colors"
              >
                <ChevronRight className="h-4 w-4 text-primary-foreground" />
              </button>
            </div>
          </div>

          {/* Price breakdown */}
          <div className="space-y-1.5 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal</span>
              <span>{fmt(subtotal)}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Tax</span>
              <span>{fmt(tax)}</span>
            </div>
            {couponApplied && discount > 0 && (
              <div className="flex justify-between text-destructive font-medium">
                <span>Discount</span>
                <span>-{fmt(discount)}</span>
              </div>
            )}
          </div>

          <Separator />

          {/* Total */}
          <div className="flex justify-between items-center font-bold text-base">
            <span>Total</span>
            <span>{fmt(total)}</span>
          </div>

          {/* Submit Order */}
          <button
            disabled={cart.length === 0}
            onClick={() => cart.length > 0 && setCheckoutOpen(true)}
            className={[
              "w-full h-11 rounded-xl text-sm font-semibold text-white transition-all",
              "flex items-center justify-center gap-2",
              cart.length === 0
                ? "opacity-50 cursor-not-allowed bg-primary"
                : "hover:opacity-90 active:scale-[0.98]",
            ].join(" ")}
            style={{
              background: cart.length > 0
                ? "linear-gradient(to right, var(--color-primary), oklch(from var(--color-primary) calc(l + 0.08) c h))"
                : undefined,
            }}
          >
            Submit Order
          </button>
        </div>
      </aside>

      {/* Checkout Dialog */}
      <Dialog open={checkoutOpen} onOpenChange={setCheckoutOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Process Payment</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div className="bg-muted rounded-xl p-3 space-y-2">
              {cart.map(item => (
                <div key={item.product.id} className="flex justify-between text-sm">
                  <span className="text-muted-foreground truncate mr-2">{item.product.name} ×{item.qty}</span>
                  <span className="font-medium shrink-0">₱{(item.qty * item.product.sellingPrice).toFixed(2)}</span>
                </div>
              ))}
              {couponApplied && discount > 0 && (
                <div className="flex justify-between text-sm text-destructive">
                  <span>Discount (ENDYEARSALE)</span>
                  <span>-₱{discount.toFixed(2)}</span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between font-bold text-primary">
                <span>TOTAL</span>
                <span>₱{total.toFixed(2)}</span>
              </div>
            </div>
            <Select>
              <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="Payment method" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="cash">Cash</SelectItem>
                <SelectItem value="gcash">GCash</SelectItem>
                <SelectItem value="card">Credit/Debit Card</SelectItem>
              </SelectContent>
            </Select>
            <Input placeholder="Amount tendered" className="h-9 text-sm" type="number" />
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setCheckoutOpen(false)}>Cancel</Button>
            <Button
              className="flex-1 gap-2"
              onClick={() => { setCheckoutOpen(false); setCart([]); setCouponApplied(false); }}
            >
              <CreditCard className="h-4 w-4" /> Process Payment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
