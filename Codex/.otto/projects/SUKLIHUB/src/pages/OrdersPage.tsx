import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search, MoreVertical, Eye, Printer, Truck, X, Tag,
  CheckCircle, Clock, XCircle, Package,
} from "lucide-react";
import { orders } from "@/data/mockData";
import type { Order } from "@/types";

const statusConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  completed: { label: "Completed", color: "bg-success/10 text-success border-success/20", icon: <CheckCircle className="h-3 w-3" /> },
  pending: { label: "Pending", color: "bg-warning/10 text-warning border-warning/20", icon: <Clock className="h-3 w-3" /> },
  voided: { label: "Voided", color: "bg-destructive/10 text-destructive border-destructive/20", icon: <XCircle className="h-3 w-3" /> },
  delivery: { label: "Delivery", color: "bg-info/10 text-info border-info/20", icon: <Truck className="h-3 w-3" /> },
};

const paymentConfig: Record<string, string> = {
  paid: "bg-success/10 text-success border-success/20",
  unpaid: "bg-destructive/10 text-destructive border-destructive/20",
  partial: "bg-warning/10 text-warning border-warning/20",
};

const filterTabs = [
  { value: "all", label: "All Orders" },
  { value: "completed", label: "Completed" },
  { value: "pending", label: "Pending" },
  { value: "delivery", label: "Delivery" },
  { value: "voided", label: "Voided" },
];

function OrderDetailDialog({ order, open, onClose }: { order: Order | null; open: boolean; onClose: () => void }) {
  if (!order) return null;
  const fmt = (n: number) => `₱${n.toLocaleString("en-PH", { minimumFractionDigits: 2 })}`;
  const sc = statusConfig[order.orderStatus];
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {order.orderNumber}
            <Badge className={`text-xs border ${sc.color} flex items-center gap-1`} variant="outline">
              {sc.icon}{sc.label}
            </Badge>
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div><p className="text-muted-foreground text-xs">Customer</p><p className="font-medium">{order.customerName}</p></div>
            <div><p className="text-muted-foreground text-xs">Cashier</p><p className="font-medium">{order.cashierName}</p></div>
            <div><p className="text-muted-foreground text-xs">Date & Time</p><p className="font-medium">{order.createdAt}</p></div>
            <div><p className="text-muted-foreground text-xs">Payment</p>
              <Badge className={`text-xs border ${paymentConfig[order.paymentStatus]}`} variant="outline">
                {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
              </Badge>
            </div>
          </div>
          <Separator />
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Items</p>
            {order.items.map((item, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span className="text-muted-foreground">{item.productName} × {item.quantity}</span>
                <span className="font-medium">{fmt(item.total)}</span>
              </div>
            ))}
            <Separator />
            <div className="flex justify-between font-bold text-primary">
              <span>Total</span><span>{fmt(order.totalAmount)}</span>
            </div>
          </div>
          {order.deliveryDate && (
            <div className="flex items-center gap-2 p-2.5 bg-info/10 rounded-lg text-sm">
              <Truck className="h-4 w-4 text-info shrink-0" />
              <span>Delivery scheduled: <strong>{order.deliveryDate}</strong></span>
            </div>
          )}
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1 gap-2 text-sm" size="sm">
              <Printer className="h-4 w-4" /> Reprint Receipt
            </Button>
            {order.orderStatus !== "voided" && (
              <Button variant="outline" className="flex-1 gap-2 text-sm text-destructive border-destructive/30 hover:bg-destructive/10" size="sm">
                <X className="h-4 w-4" /> Void Order
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function OrdersPage() {
  const [tab, setTab] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const fmt = (n: number) => `₱${n.toLocaleString("en-PH", { minimumFractionDigits: 2 })}`;

  const filtered = orders.filter(o => {
    const matchTab = tab === "all" || o.orderStatus === tab;
    const matchSearch = o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      o.customerName.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  const stats = {
    total: orders.length,
    completed: orders.filter(o => o.orderStatus === "completed").length,
    pending: orders.filter(o => o.orderStatus === "pending").length,
    delivery: orders.filter(o => o.orderStatus === "delivery").length,
    totalRevenue: orders.filter(o => o.paymentStatus === "paid").reduce((s, o) => s + o.totalAmount, 0),
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Orders</h1>
          <p className="text-sm text-muted-foreground">Daily order management — May 7, 2026</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total Orders", value: stats.total, icon: Package, color: "text-primary" },
          { label: "Completed", value: stats.completed, icon: CheckCircle, color: "text-success" },
          { label: "Pending / Delivery", value: stats.pending + stats.delivery, icon: Clock, color: "text-warning" },
          { label: "Revenue (Paid)", value: fmt(stats.totalRevenue), icon: Tag, color: "text-info" },
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

      {/* Filters & Table */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative max-w-full flex-1 sm:max-w-xs">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search orders…" className="pl-8 h-9 text-sm" />
            </div>
            <div className="flex flex-wrap gap-1.5">
              {["Today", "Yesterday", "This Week", "This Month", "BIR Only"].map(f => (
                <Button key={f} variant="outline" size="sm" className="h-9 text-xs">{f}</Button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Tabs value={tab} onValueChange={setTab}>
            <div className="border-b px-4">
              <div className="scrollbar-thin -mx-4 overflow-x-auto px-4">
                <TabsList className="inline-flex h-9 min-w-max bg-transparent gap-4 p-0">
                {filterTabs.map(t => (
                  <TabsTrigger key={t.value} value={t.value} className="text-sm h-9 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0">
                    {t.label}
                  </TabsTrigger>
                ))}
                </TabsList>
              </div>
            </div>
            {filterTabs.map(t => (
              <TabsContent key={t.value} value={t.value} className="m-0">
                <ScrollArea className="h-[min(420px,calc(100svh-15rem))] sm:h-[420px]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order #</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead className="hidden md:table-cell">Items</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Payment</TableHead>
                        <TableHead className="hidden lg:table-cell">BIR</TableHead>
                        <TableHead className="hidden lg:table-cell">Cashier</TableHead>
                        <TableHead className="hidden md:table-cell">Time</TableHead>
                        <TableHead />
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filtered.map(order => {
                        const sc = statusConfig[order.orderStatus];
                        return (
                          <TableRow key={order.id} className="cursor-pointer" onClick={() => { setSelectedOrder(order); setDetailOpen(true); }}>
                            <TableCell className="font-mono text-xs font-medium">{order.orderNumber}</TableCell>
                            <TableCell className="text-sm">{order.customerName}</TableCell>
                            <TableCell className="hidden md:table-cell text-sm text-muted-foreground">{order.items.length} items</TableCell>
                            <TableCell className="text-sm font-semibold text-primary">{fmt(order.totalAmount)}</TableCell>
                            <TableCell>
                              <Badge className={`text-[10px] border flex items-center gap-1 w-fit ${sc.color}`} variant="outline">
                                {sc.icon}{sc.label}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge className={`text-[10px] border ${paymentConfig[order.paymentStatus]}`} variant="outline">
                                {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                              </Badge>
                            </TableCell>
                            <TableCell className="hidden lg:table-cell">
                              <Badge variant={order.isBIR ? "default" : "secondary"} className="text-[10px]">
                                {order.isBIR ? "BIR" : "Non-BIR"}
                              </Badge>
                            </TableCell>
                            <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">{order.cashierName}</TableCell>
                            <TableCell className="hidden md:table-cell text-xs text-muted-foreground">{order.createdAt.split(" ")[1]}</TableCell>
                            <TableCell onClick={e => e.stopPropagation()}>
                              <DropdownMenu>
                            <DropdownMenuTrigger className="flex items-center justify-center h-7 w-7 rounded-md hover:bg-accent transition-colors outline-none">
                                  <MoreVertical className="h-3.5 w-3.5" />
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => { setSelectedOrder(order); setDetailOpen(true); }}>
                                    <Eye className="mr-2 h-4 w-4" /> View Order
                                  </DropdownMenuItem>
                                  <DropdownMenuItem><Printer className="mr-2 h-4 w-4" /> Reprint Receipt</DropdownMenuItem>
                                  <DropdownMenuItem><Tag className="mr-2 h-4 w-4" /> {order.isBIR ? "Remove BIR" : "Mark as BIR"}</DropdownMenuItem>
                                  {order.orderStatus === "delivery" && (
                                    <DropdownMenuItem><Truck className="mr-2 h-4 w-4" /> Print Delivery Slip</DropdownMenuItem>
                                  )}
                                  <DropdownMenuItem className="text-destructive">
                                    <X className="mr-2 h-4 w-4" /> Void Order
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      <OrderDetailDialog order={selectedOrder} open={detailOpen} onClose={() => setDetailOpen(false)} />
    </div>
  );
}
