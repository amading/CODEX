import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger,
} from "@/components/ui/dialog";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle,
} from "@/components/ui/sheet";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Search, Plus, Phone, MapPin, ShoppingCart, Star, Truck,
  QrCode, Printer, Clock, CreditCard, Calendar,
} from "lucide-react";
import { customers, orders } from "@/data/mockData";
import type { Customer } from "@/types";

export function CustomersPage() {
  const [search, setSearch] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);

  const filtered = customers.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.contact.includes(search)
  );

  const customerOrders = selectedCustomer
    ? orders.filter(o => o.customerId === selectedCustomer.id)
    : [];

  const fmt = (n: number) => `₱${n.toLocaleString("en-PH")}`;

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Customers</h1>
          <p className="text-sm text-muted-foreground">Manage customer profiles and delivery orders</p>
        </div>
        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogTrigger render={<Button className="gap-2 self-start sm:self-auto" />}>
            <Plus className="h-4 w-4" /> Add Customer
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader><DialogTitle>New Customer</DialogTitle></DialogHeader>
            <div className="space-y-3">
              {[
                { label: "Full Name", placeholder: "e.g. Maria Santos" },
                { label: "Contact Number", placeholder: "e.g. 09171234567" },
                { label: "Email", placeholder: "email@example.com" },
                { label: "Delivery Address", placeholder: "Full address" },
                { label: "Delivery Notes", placeholder: "e.g. Call before delivery" },
              ].map(f => (
                <div key={f.label}>
                  <Label className="text-xs">{f.label}</Label>
                  <Input placeholder={f.placeholder} className="mt-1 h-9 text-sm" />
                </div>
              ))}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setAddOpen(false)}>Cancel</Button>
              <Button onClick={() => setAddOpen(false)} className="gap-2"><Plus className="h-4 w-4" /> Add Customer</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total Customers", value: customers.length },
          { label: "Active This Month", value: 3 },
          { label: "Total Credit Balance", value: fmt(customers.reduce((s, c) => s + c.creditBalance, 0)) },
          { label: "Total Loyalty Points", value: customers.reduce((s, c) => s + c.loyaltyPoints, 0) + " pts" },
        ].map(s => (
          <Card key={s.label}>
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">{s.label}</p>
              <p className="text-xl font-bold">{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
        <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search customers…" className="pl-8 h-9 text-sm" />
      </div>

      {/* Customer Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map(customer => (
          <Card
            key={customer.id}
            className="cursor-pointer hover:shadow-md hover:border-primary/40 transition-all"
            onClick={() => { setSelectedCustomer(customer); setSheetOpen(true); }}
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-3 mb-3">
                <Avatar className="h-11 w-11 shrink-0">
                  <AvatarImage src={`https://i.pravatar.cc/100?u=${customer.name}`} />
                  <AvatarFallback className="text-sm font-bold">
                    {customer.name.split(" ").map(n => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate">{customer.name}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Phone className="h-3 w-3" /> {customer.contact}
                  </p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground flex items-start gap-1 mb-3 line-clamp-1">
                <MapPin className="h-3 w-3 shrink-0 mt-0.5" /> {customer.address}
              </p>
              <div className="grid grid-cols-3 gap-2 text-center border-t pt-3">
                <div>
                  <p className="text-xs font-bold text-primary">{customer.totalOrders}</p>
                  <p className="text-[10px] text-muted-foreground">Orders</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-success">{fmt(customer.totalSpending)}</p>
                  <p className="text-[10px] text-muted-foreground">Spent</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-warning">{customer.loyaltyPoints}</p>
                  <p className="text-[10px] text-muted-foreground">Points</p>
                </div>
              </div>
              {customer.creditBalance > 0 && (
                <Badge variant="destructive" className="mt-2 text-[10px] w-full justify-center">
                  Credit: {fmt(customer.creditBalance)}
                </Badge>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Customer Detail Sheet */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="w-full sm:w-[480px] overflow-y-auto">
          {selectedCustomer && (
            <>
              <SheetHeader className="mb-4">
                <SheetTitle>Customer Profile</SheetTitle>
              </SheetHeader>
              <div className="space-y-5">
                {/* Profile Header */}
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={`https://i.pravatar.cc/100?u=${selectedCustomer.name}`} />
                    <AvatarFallback className="text-lg font-bold">
                      {selectedCustomer.name.split(" ").map(n => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="text-lg font-bold">{selectedCustomer.name}</h2>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Phone className="h-3.5 w-3.5" /> {selectedCustomer.contact}
                    </p>
                    <p className="text-xs text-muted-foreground flex items-start gap-1 mt-0.5">
                      <MapPin className="h-3.5 w-3.5 shrink-0" /> {selectedCustomer.address}
                    </p>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: "Orders", value: selectedCustomer.totalOrders, icon: ShoppingCart },
                    { label: "Total Spent", value: fmt(selectedCustomer.totalSpending), icon: CreditCard },
                    { label: "Loyalty Pts", value: selectedCustomer.loyaltyPoints, icon: Star },
                  ].map(s => (
                    <div key={s.label} className="text-center p-3 rounded-xl bg-muted/50">
                      <s.icon className="h-4 w-4 mx-auto mb-1 text-primary" />
                      <p className="text-sm font-bold">{s.value}</p>
                      <p className="text-[10px] text-muted-foreground">{s.label}</p>
                    </div>
                  ))}
                </div>

                {/* Loyalty Progress */}
                <div>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-muted-foreground">Loyalty Level</span>
                    <span className="font-medium">{selectedCustomer.loyaltyPoints} / 500 pts</span>
                  </div>
                  <Progress value={(selectedCustomer.loyaltyPoints / 500) * 100} className="h-2" />
                  <p className="text-[10px] text-muted-foreground mt-1">{500 - selectedCustomer.loyaltyPoints} pts to next reward</p>
                </div>

                {selectedCustomer.creditBalance > 0 && (
                  <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20">
                    <p className="text-sm font-semibold text-destructive">Outstanding Credit: {fmt(selectedCustomer.creditBalance)}</p>
                  </div>
                )}

                {selectedCustomer.deliveryNotes && (
                  <div className="p-3 rounded-xl bg-muted/50">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Delivery Notes</p>
                    <p className="text-sm">{selectedCustomer.deliveryNotes}</p>
                  </div>
                )}

                <Separator />

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" className="gap-2 text-sm"><ShoppingCart className="h-4 w-4" /> New Order</Button>
                  <Button variant="outline" className="gap-2 text-sm"><Truck className="h-4 w-4" /> Schedule Delivery</Button>
                  <Button variant="outline" className="gap-2 text-sm"><QrCode className="h-4 w-4" /> Print QR</Button>
                  <Button variant="outline" className="gap-2 text-sm"><Printer className="h-4 w-4" /> Send Reminder</Button>
                </div>

                <Separator />

                {/* Order History */}
                <div>
                  <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                    <Clock className="h-4 w-4 text-primary" /> Order History
                  </h3>
                  {customerOrders.length > 0 ? (
                    <div className="space-y-2">
                      {customerOrders.map(o => (
                        <div key={o.id} className="flex items-center justify-between p-2.5 rounded-lg bg-muted/50">
                          <div>
                            <p className="text-xs font-mono font-medium">{o.orderNumber}</p>
                            <p className="text-[11px] text-muted-foreground">{o.createdAt}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-bold text-primary">{fmt(o.totalAmount)}</p>
                            <Badge variant="secondary" className="text-[10px]">{o.orderStatus}</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No orders found</p>
                  )}
                </div>

                {/* Scheduled Orders */}
                <div>
                  <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary" /> Scheduled Deliveries
                  </h3>
                  <div className="p-3 rounded-xl bg-info/10 border border-info/20 text-sm">
                    <p className="font-medium">May 8, 2026</p>
                    <p className="text-xs text-muted-foreground mt-0.5">3 items scheduled for delivery</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
