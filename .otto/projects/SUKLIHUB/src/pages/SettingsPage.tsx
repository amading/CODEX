import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Palette, Monitor, ShoppingCart, Upload, Check,
  Sun, Moon, Laptop, Smartphone, Tablet, Type, Zap,
} from "lucide-react";

const colorOptions = [
  { label: "Ocean Blue", value: "#2563EB" },
  { label: "Emerald", value: "#10B981" },
  { label: "Violet", value: "#7C3AED" },
  { label: "Rose", value: "#E11D48" },
  { label: "Amber", value: "#D97706" },
  { label: "Slate", value: "#475569" },
];

const fontOptions = ["Geist", "Inter", "Plus Jakarta Sans", "Manrope", "Satoshi"];

export function SettingsPage() {
  const [selectedColor, setSelectedColor] = useState("#2563EB");
  const [autoprint, setAutoprint] = useState(false);
  const [askPrint, setAskPrint] = useState(true);
  const [birEnabled, setBirEnabled] = useState(true);
  const [deliveryEnabled, setDeliveryEnabled] = useState(true);
  const [qrScan, setQrScan] = useState(true);
  const [barcodeScan, setBarcodeScan] = useState(true);
  const [keyboardShortcuts, setKeyboardShortcuts] = useState(true);
  const [touchMode, setTouchMode] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [compactMode, setCompactMode] = useState(false);

  return (
    <div className="max-w-3xl space-y-5">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground">Customize your SMART STORE POS AI system</p>
      </div>

      <Tabs defaultValue="branding">
        <TabsList className="flex-wrap h-auto gap-1">
          {["branding", "appearance", "pos", "system"].map(t => (
            <TabsTrigger key={t} value={t} className="capitalize">{t}</TabsTrigger>
          ))}
        </TabsList>

        {/* Branding */}
        <TabsContent value="branding" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Palette className="h-4 w-4 text-primary" /> Store Branding
              </CardTitle>
              <CardDescription>Customize your store's identity</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs font-semibold">System Title</Label>
                  <Input defaultValue="SMART STORE POS AI" className="mt-1.5 h-9" />
                </div>
                <div>
                  <Label className="text-xs font-semibold">Store Name</Label>
                  <Input defaultValue="Smart Store — Main Branch" className="mt-1.5 h-9" />
                </div>
              </div>

              <div>
                <Label className="text-xs font-semibold">Receipt Header</Label>
                <Textarea defaultValue="SMART STORE\n123 Main Street, Manila\nTel: 02-123-4567\nVAT Reg: 123-456-789" className="mt-1.5 text-sm resize-none font-mono" rows={4} />
              </div>

              {/* Logo Upload */}
              <div>
                <Label className="text-xs font-semibold">Store Logo</Label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-1.5">
                  {["Large Logo", "Medium Logo", "Small Logo", "Transparent"].map(size => (
                    <div key={size} className="border-2 border-dashed border-border rounded-xl p-4 text-center cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-colors">
                      <Upload className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-[10px] text-muted-foreground">{size}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Primary Color */}
              <div>
                <Label className="text-xs font-semibold">Primary Color</Label>
                <div className="flex gap-2 mt-1.5 flex-wrap">
                  {colorOptions.map(c => (
                    <button
                      key={c.value}
                      onClick={() => setSelectedColor(c.value)}
                      className="relative h-9 w-9 rounded-lg border-2 transition-all hover:scale-110"
                      style={{ backgroundColor: c.value, borderColor: selectedColor === c.value ? c.value : "transparent" }}
                      title={c.label}
                    >
                      {selectedColor === c.value && (
                        <Check className="h-4 w-4 text-white absolute inset-0 m-auto" />
                      )}
                    </button>
                  ))}
                  <div className="flex items-center gap-2">
                    <Input
                      type="color"
                      value={selectedColor}
                      onChange={e => setSelectedColor(e.target.value)}
                      className="h-9 w-9 p-0.5 rounded-lg cursor-pointer"
                    />
                    <span className="text-xs font-mono text-muted-foreground">{selectedColor}</span>
                  </div>
                </div>
              </div>

              {/* Additional Colors */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  { label: "Secondary Color", defaultValue: "#F1F5F9" },
                  { label: "Background Color", defaultValue: "#F8FAFC" },
                  { label: "Sidebar Color", defaultValue: "#1E2139" },
                  { label: "Button Color", defaultValue: "#2563EB" },
                ].map(c => (
                  <div key={c.label}>
                    <Label className="text-xs">{c.label}</Label>
                    <div className="flex gap-1.5 mt-1">
                      <input type="color" defaultValue={c.defaultValue} className="h-9 w-9 rounded border cursor-pointer p-0.5" />
                      <Input defaultValue={c.defaultValue} className="h-9 text-xs font-mono flex-1" />
                    </div>
                  </div>
                ))}
              </div>

              {/* Typography */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <Label className="text-xs">Font Family</Label>
                  <Select defaultValue="Geist">
                    <SelectTrigger className="mt-1 h-9 text-sm"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {fontOptions.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs">Font Size</Label>
                  <Select defaultValue="medium">
                    <SelectTrigger className="mt-1 h-9 text-sm"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">Small (14px)</SelectItem>
                      <SelectItem value="medium">Medium (16px)</SelectItem>
                      <SelectItem value="large">Large (18px)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs">Border Radius</Label>
                  <Select defaultValue="medium">
                    <SelectTrigger className="mt-1 h-9 text-sm"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None (0px)</SelectItem>
                      <SelectItem value="small">Small (4px)</SelectItem>
                      <SelectItem value="medium">Medium (8px)</SelectItem>
                      <SelectItem value="large">Large (16px)</SelectItem>
                      <SelectItem value="full">Full (rounded)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button className="gap-2">
                <Palette className="h-4 w-4" /> Save Branding
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appearance */}
        <TabsContent value="appearance" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Monitor className="h-4 w-4 text-primary" /> Display & Theme
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Theme Mode */}
              <div>
                <Label className="text-xs font-semibold mb-2 block">Theme Mode</Label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: "Light", icon: Sun, value: false },
                    { label: "Dark", icon: Moon, value: true },
                    { label: "System", icon: Laptop, value: null },
                  ].map(m => (
                    <button
                      key={m.label}
                      onClick={() => m.value !== null && setDarkMode(m.value)}
                      className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                        (m.value === true && darkMode) || (m.value === false && !darkMode)
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/40"
                      }`}
                    >
                      <m.icon className={`h-5 w-5 ${
                        (m.value === true && darkMode) || (m.value === false && !darkMode) ? "text-primary" : "text-muted-foreground"
                      }`} />
                      <span className="text-sm font-medium">{m.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Layout Mode */}
              <div>
                <Label className="text-xs font-semibold mb-2 block">Layout Mode</Label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: "Desktop", icon: Monitor },
                    { label: "Tablet", icon: Tablet },
                    { label: "Mobile", icon: Smartphone },
                  ].map(m => (
                    <button
                      key={m.label}
                      className="flex flex-col items-center gap-2 p-4 rounded-xl border-2 border-border hover:border-primary/40 transition-all"
                    >
                      <m.icon className="h-5 w-5 text-muted-foreground" />
                      <span className="text-sm">{m.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Toggle Settings */}
              <div className="space-y-4">
                {[
                  { label: "Dark Mode", description: "Switch to dark theme", value: darkMode, onChange: setDarkMode },
                  { label: "Compact Mode", description: "Smaller spacing and denser UI", value: compactMode, onChange: setCompactMode },
                  { label: "Large Font Mode", description: "Increase text size for readability", value: false, onChange: () => {} },
                  { label: "Touchscreen Mode", description: "Larger touch targets for POS terminals", value: touchMode, onChange: setTouchMode },
                ].map(s => (
                  <div key={s.label} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{s.label}</p>
                      <p className="text-xs text-muted-foreground">{s.description}</p>
                    </div>
                    <Switch checked={s.value} onCheckedChange={s.onChange} />
                  </div>
                ))}
              </div>

              <Button className="gap-2">Save Appearance</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* POS Settings */}
        <TabsContent value="pos" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <ShoppingCart className="h-4 w-4 text-primary" /> POS Configuration
              </CardTitle>
              <CardDescription>Configure point-of-sale behavior</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              {/* Print Settings */}
              <div>
                <p className="text-sm font-semibold mb-3">Receipt Printing</p>
                <div className="space-y-3">
                  {[
                    { label: "Auto Print", description: "Automatically print receipt after payment", value: autoprint, onChange: setAutoprint },
                    { label: "Ask Before Print", description: "Ask cashier to confirm before printing", value: askPrint, onChange: setAskPrint },
                    { label: "No Print", description: "Never print receipts automatically", value: false, onChange: () => {} },
                  ].map(s => (
                    <div key={s.label} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <div>
                        <p className="text-sm font-medium">{s.label}</p>
                        <p className="text-xs text-muted-foreground">{s.description}</p>
                      </div>
                      <Switch checked={s.value} onCheckedChange={s.onChange} />
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Feature Toggles */}
              <div>
                <p className="text-sm font-semibold mb-3">Feature Settings</p>
                <div className="space-y-3">
                  {[
                    { label: "BIR Receipt Option", description: "Enable BIR official receipt toggle per order", value: birEnabled, onChange: setBirEnabled },
                    { label: "Delivery Option", description: "Allow orders to be flagged for delivery", value: deliveryEnabled, onChange: setDeliveryEnabled },
                    { label: "QR Code Scanning", description: "Enable QR code scanning on POS", value: qrScan, onChange: setQrScan },
                    { label: "Barcode Scanning", description: "Enable barcode scanning on POS", value: barcodeScan, onChange: setBarcodeScan },
                    { label: "Keyboard Shortcuts", description: "Enable F1–F7 shortcut keys for cashiers", value: keyboardShortcuts, onChange: setKeyboardShortcuts },
                  ].map(s => (
                    <div key={s.label} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <div>
                        <p className="text-sm font-medium">{s.label}</p>
                        <p className="text-xs text-muted-foreground">{s.description}</p>
                      </div>
                      <Switch checked={s.value} onCheckedChange={s.onChange} />
                    </div>
                  ))}
                </div>
              </div>

              {keyboardShortcuts && (
                <div className="rounded-xl bg-primary/5 border border-primary/20 p-4">
                  <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-3">
                    <Zap className="inline h-3 w-3 mr-1" /> Active Keyboard Shortcuts
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {[["F1", "Search Products"], ["F2", "Scan Mode"], ["F3", "Hold Order"],
                      ["F4", "Void Item"], ["F5", "Cancel"], ["F6", "Save Order"],
                      ["F7", "Checkout"], ["Esc", "Close Modal"]].map(([k, v]) => (
                      <div key={k} className="flex items-center gap-2">
                        <kbd className="text-xs bg-background border rounded px-2 py-0.5 font-mono">{k}</kbd>
                        <span className="text-xs text-muted-foreground">{v}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <Button className="gap-2">Save POS Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* System */}
        <TabsContent value="system" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Zap className="h-4 w-4 text-primary" /> System Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { label: "System Version", value: "SMART STORE POS AI v2.1.0" },
                { label: "Database", value: "SQLite (Local) + Cloud Sync" },
                { label: "Last Backup", value: "May 7, 2026 — 12:00 PM" },
                { label: "Products in DB", value: "247 products" },
                { label: "Total Customers", value: "4 registered" },
                { label: "License", value: "Premium — 1 Device" },
              ].map(s => (
                <div key={s.label} className="flex justify-between items-center py-2 border-b last:border-0">
                  <span className="text-sm text-muted-foreground">{s.label}</span>
                  <span className="text-sm font-medium">{s.value}</span>
                </div>
              ))}
              <div className="flex gap-2 pt-2">
                <Button variant="outline" className="flex-1 text-sm">Backup Data</Button>
                <Button variant="outline" className="flex-1 text-sm">Clear Cache</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
