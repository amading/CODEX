import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
  Camera, ScanLine, Upload, CheckCircle, AlertCircle, RefreshCw,
  Package, Edit, Plus, ImagePlus, Zap, Wifi, Clock,
} from "lucide-react";
import { products } from "@/data/mockData";

type ScanState = "idle" | "scanning" | "found" | "new";

export function MobileQRPage() {
  const [scanState, setScanState] = useState<ScanState>("idle");
  const [foundProduct, setFoundProduct] = useState(products[0]);

  const simulateScan = (type: "found" | "new") => {
    setScanState("scanning");
    setTimeout(() => {
      setFoundProduct(products[0]);
      setScanState(type);
    }, 1500);
  };

  return (
    <div className="max-w-sm mx-auto space-y-4">
      {/* Mobile Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-1">
          <Zap className="h-5 w-5 text-primary" />
          <h1 className="text-xl font-bold">Mobile QR Scanner</h1>
        </div>
        <p className="text-sm text-muted-foreground">Quick product data entry via scan</p>
      </div>

      {/* Employee Info */}
      <div className="flex items-center justify-between p-3 rounded-xl bg-card border">
        <div className="flex items-center gap-2.5">
          <img src="https://i.pravatar.cc/40?u=ben-cruz" alt="Ben" className="h-8 w-8 rounded-full" />
          <div>
            <p className="text-sm font-semibold">Ben Cruz</p>
            <p className="text-xs text-muted-foreground">Inventory Staff</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-xs text-success">
            <Wifi className="h-3 w-3" /> Synced
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" /> 13:24
          </div>
        </div>
      </div>

      {/* Camera / Scan Preview */}
      <Card className="overflow-hidden">
        <div className="relative bg-gray-900 aspect-square flex items-center justify-center">
          {scanState === "idle" && (
            <div className="text-center text-white/60 space-y-3">
              <Camera className="h-14 w-14 mx-auto opacity-40" />
              <p className="text-sm">Camera preview will appear here</p>
            </div>
          )}
          {scanState === "scanning" && (
            <div className="text-center text-white/80 space-y-3">
              <div className="animate-pulse">
                <ScanLine className="h-14 w-14 mx-auto text-primary" />
              </div>
              <p className="text-sm">Scanning…</p>
            </div>
          )}
          {(scanState === "found" || scanState === "new") && (
            <div className="w-full h-full">
              <img src={foundProduct.image} alt="Product" className="w-full h-full object-cover" />
              <div className={`absolute inset-0 flex items-end p-4 ${scanState === "found" ? "bg-success/20" : "bg-warning/20"}`}>
                <div className={`w-full rounded-lg p-2.5 text-white text-sm font-medium flex items-center gap-2 ${scanState === "found" ? "bg-success" : "bg-warning"}`}>
                  {scanState === "found" ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                  {scanState === "found" ? "Product Found!" : "New Product Detected"}
                </div>
              </div>
            </div>
          )}

          {/* Viewfinder overlay */}
          {scanState === "scanning" && (
            <div className="absolute inset-8 border-2 border-primary/60 rounded-xl" />
          )}
        </div>

        {/* Scan Controls */}
        <CardContent className="p-3 space-y-2">
          <div className="grid grid-cols-3 gap-2">
            <Button
              className="gap-1.5 text-xs h-10 flex-col items-center py-2"
              onClick={() => simulateScan("found")}
            >
              <ScanLine className="h-4 w-4" />
              <span>Scan QR</span>
            </Button>
            <Button
              variant="outline"
              className="gap-1.5 text-xs h-10 flex-col items-center py-2"
              onClick={() => simulateScan("found")}
            >
              <Camera className="h-4 w-4" />
              <span>Photo</span>
            </Button>
            <Button
              variant="outline"
              className="gap-1.5 text-xs h-10 flex-col items-center py-2"
              onClick={() => simulateScan("new")}
            >
              <Upload className="h-4 w-4" />
              <span>Upload</span>
            </Button>
          </div>
          {scanState !== "idle" && (
            <Button
              variant="ghost"
              className="w-full text-xs gap-2"
              size="sm"
              onClick={() => setScanState("idle")}
            >
              <RefreshCw className="h-3.5 w-3.5" /> Reset Scanner
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Found Product Panel */}
      {scanState === "found" && (
        <Card className="border-success/30 bg-success/5">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-success" />
              <CardTitle className="text-sm text-success">Product Found in Database</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3">
              <img src={foundProduct.image} alt={foundProduct.name} className="h-16 w-16 rounded-xl object-cover" />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm">{foundProduct.name}</p>
                <p className="text-xs font-mono text-muted-foreground">{foundProduct.barcode}</p>
                <div className="flex gap-2 mt-1">
                  <Badge variant="secondary" className="text-[10px]">{foundProduct.category}</Badge>
                  <Badge className={`text-[10px] ${foundProduct.status === "in_stock" ? "bg-success/10 text-success border-success/20" : "bg-warning/10 text-warning border-warning/20"} border`} variant="outline">
                    {foundProduct.quantity} in stock
                  </Badge>
                </div>
              </div>
            </div>
            <Separator />
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="p-2 bg-background rounded-lg">
                <p className="text-[10px] text-muted-foreground">Cost Price</p>
                <p className="font-semibold">₱{foundProduct.costPrice}</p>
              </div>
              <div className="p-2 bg-background rounded-lg">
                <p className="text-[10px] text-muted-foreground">Selling Price</p>
                <p className="font-semibold text-primary">₱{foundProduct.sellingPrice}</p>
              </div>
            </div>

            {/* Quick Update */}
            <div>
              <Label className="text-xs font-semibold">Quick Update Quantity</Label>
              <div className="flex gap-2 mt-1.5">
                <Input type="number" placeholder="Add quantity" className="h-9 text-sm flex-1" defaultValue="24" />
                <Button className="gap-1.5 text-sm h-9 shrink-0">
                  <Plus className="h-4 w-4" /> Add Stock
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <Button variant="outline" className="gap-1.5 text-xs h-9" size="sm">
                <Edit className="h-3.5 w-3.5" /> Update
              </Button>
              <Button variant="outline" className="gap-1.5 text-xs h-9" size="sm">
                <Package className="h-3.5 w-3.5" /> Price
              </Button>
              <Button variant="outline" className="gap-1.5 text-xs h-9" size="sm">
                <ImagePlus className="h-3.5 w-3.5" /> Photo
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* New Product Panel */}
      {scanState === "new" && (
        <Card className="border-warning/30 bg-warning/5">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-warning" />
              <CardTitle className="text-sm text-warning">New Product — Fill Details</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {/* Image / scan — no vision API in this demo */}
            <div className="rounded-lg border border-dashed border-warning/30 bg-background/80 p-3">
              <div className="mb-2 flex items-center gap-2">
                <Zap className="h-3.5 w-3.5 text-warning" />
                <span className="text-xs font-semibold text-warning">Manual entry — not from AI</span>
              </div>
              <p className="text-[11px] leading-relaxed text-muted-foreground">
                This flow does not read the camera image. Enter name, price, and barcode from the real package (or wire a
                barcode / vision API later).
              </p>
            </div>

            {/* Mini Form */}
            <div className="space-y-2">
              <div>
                <Label className="text-xs">Product Name *</Label>
                <Input placeholder="From packaging" className="mt-1 h-9 text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-xs">Quantity</Label>
                  <Input type="number" placeholder="0" className="mt-1 h-9 text-sm" />
                </div>
                <div>
                  <Label className="text-xs">Selling Price</Label>
                  <Input type="number" placeholder="0" className="mt-1 h-9 text-sm" />
                </div>
              </div>
              <div>
                <Label className="text-xs">Store Location</Label>
                <Input placeholder="e.g. Aisle 4" className="mt-1 h-9 text-sm" />
              </div>
            </div>

            <Button className="w-full gap-2">
              <Plus className="h-4 w-4" /> Create New Product
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Sync Status */}
      <Card>
        <CardContent className="p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold">Sync Status</span>
            <Badge variant="secondary" className="text-[10px]">Auto Sync ON</Badge>
          </div>
          <Progress value={100} className="h-1.5 mb-1.5" />
          <p className="text-[11px] text-muted-foreground">Last synced: just now · 247 products in database</p>
        </CardContent>
      </Card>
    </div>
  );
}
