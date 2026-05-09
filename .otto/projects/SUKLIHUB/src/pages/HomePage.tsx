import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent,
} from "@/components/ui/chart";
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer,
} from "recharts";
import {
  TrendingUp, TrendingDown, Package, ShoppingCart, Truck, AlertTriangle,
  ArrowRight, Calendar, Users, Clock, PackageCheck, PackageMinus,
} from "lucide-react";
import {
  dailySummary, salesChartData, topProductsData, stockMovementChartData,
  deliveryTomorrow, lowStockAlerts, expiringProducts, recentActivity,
} from "@/data/mockData";

const salesConfig = {
  sales: { label: "Sales (₱)", color: "var(--color-chart-1)" },
  orders: { label: "Orders", color: "var(--color-chart-2)" },
};
const stockConfig = {
  in: { label: "Stock In", color: "var(--color-chart-2)" },
  out: { label: "Stock Out", color: "var(--color-chart-5)" },
};

const activityIconMap: Record<string, React.ReactNode> = {
  sale: <ShoppingCart className="h-3.5 w-3.5" />,
  stock: <Package className="h-3.5 w-3.5" />,
  void: <PackageMinus className="h-3.5 w-3.5" />,
  delivery: <Truck className="h-3.5 w-3.5" />,
  alert: <AlertTriangle className="h-3.5 w-3.5" />,
  customer: <Users className="h-3.5 w-3.5" />,
};

const activityColorMap: Record<string, string> = {
  sale: "bg-primary/10 text-primary",
  stock: "bg-success/10 text-success",
  void: "bg-destructive/10 text-destructive",
  delivery: "bg-info/10 text-info",
  alert: "bg-warning/10 text-warning",
  customer: "bg-purple-500/10 text-purple-500",
};

export function HomePage() {
  const fmt = (n: number) =>
    new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP", maximumFractionDigits: 0 }).format(n);

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Good afternoon, Clara 👋</h1>
          <p className="text-sm text-muted-foreground">Wednesday, May 7, 2026 — Here's your store overview</p>
        </div>
        <Button className="gap-2 self-start sm:self-auto">
          <Calendar className="h-4 w-4" /> Tomorrow's Prep List
        </Button>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { label: "Daily Sales", value: fmt(dailySummary.totalSales), icon: TrendingUp, color: "text-primary", change: "+12.4%" },
          { label: "Total Orders", value: dailySummary.totalOrders, icon: ShoppingCart, color: "text-success", change: "+8.2%" },
          { label: "Items Sold", value: dailySummary.totalItemsSold, icon: PackageCheck, color: "text-info", change: "+5.1%" },
          { label: "Pending Delivery", value: dailySummary.pendingDelivery, icon: Truck, color: "text-warning", change: "2 tomorrow" },
          { label: "Stock Out", value: dailySummary.outgoingStock, icon: PackageMinus, color: "text-destructive", change: "-3.2%" },
          { label: "Stock In", value: dailySummary.incomingStock, icon: Package, color: "text-purple-500", change: "Today" },
        ].map((stat) => (
          <Card key={stat.label} className="relative overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">{stat.label}</span>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
              <p className="text-xl font-bold tracking-tight">{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Sales Chart */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">Weekly Sales</CardTitle>
                <CardDescription>Sales & order trend this week</CardDescription>
              </div>
              <Badge variant="secondary" className="text-xs">This Week</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <ChartContainer config={salesConfig} className="h-52 w-full">
              <BarChart data={salesChartData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `₱${(v / 1000).toFixed(0)}k`} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar dataKey="sales" fill="var(--color-chart-1)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Tomorrow Delivery Card */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Truck className="h-4 w-4 text-primary" />
              <CardTitle className="text-base">Tomorrow's Deliveries</CardTitle>
            </div>
            <CardDescription>May 8, 2026</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {deliveryTomorrow.map((d, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold shrink-0">
                  {d.customer.split(" ").map(n => n[0]).join("")}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{d.customer}</p>
                  <p className="text-xs text-muted-foreground truncate">{d.address}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-xs h-5">{d.items} items</Badge>
                    <span className="text-xs font-medium text-primary">{fmt(d.total)}</span>
                  </div>
                </div>
              </div>
            ))}
            <Button variant="outline" className="w-full gap-2 text-sm" size="sm">
              View All Deliveries <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Second row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Stock Movement Chart */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">Stock Movement</CardTitle>
                <CardDescription>Incoming vs outgoing inventory</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ChartContainer config={stockConfig} className="h-48 w-full">
              <LineChart data={stockMovementChartData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Line type="monotone" dataKey="in" stroke="var(--color-chart-2)" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="out" stroke="var(--color-chart-5)" strokeWidth={2} dot={false} />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              <CardTitle className="text-base">Recent Activity</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[min(13rem,calc(100svh-18rem))] sm:h-52">
              <div className="px-4 space-y-1 pb-4">
                {recentActivity.map((act) => (
                  <div key={act.id} className="flex items-start gap-3 py-2">
                    <div className={`h-7 w-7 rounded-full flex items-center justify-center shrink-0 ${activityColorMap[act.type]}`}>
                      {activityIconMap[act.type]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs leading-snug">{act.message}</p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">{act.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Third row: Top Products + Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Top Products */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Top Selling Products Today</CardTitle>
            <CardDescription>By units sold</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {topProductsData.map((p, i) => (
              <div key={p.name} className="flex items-center gap-3">
                <span className="text-sm font-bold text-muted-foreground w-5 shrink-0">#{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium truncate">{p.name}</span>
                    <span className="text-xs text-muted-foreground shrink-0 ml-2">{p.sold} sold</span>
                  </div>
                  <Progress value={(p.sold / 210) * 100} className="h-1.5" />
                </div>
                <span className="text-sm font-semibold text-primary shrink-0">{fmt(p.revenue)}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Alerts Panel */}
        <div className="space-y-3">
          {/* Low Stock */}
          <Card className="border-destructive/20">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-destructive" />
                <CardTitle className="text-sm text-destructive">Low Stock Alerts</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {lowStockAlerts.map((p) => (
                <div key={p.id} className="flex items-center justify-between gap-2">
                  <span className="text-xs truncate flex-1">{p.name}</span>
                  <Badge variant={p.status === "out_of_stock" ? "destructive" : "secondary"} className="text-[10px] shrink-0">
                    {p.status === "out_of_stock" ? "OUT" : `${p.quantity} left`}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Expiring Products */}
          <Card className="border-warning/20">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-warning" />
                <CardTitle className="text-sm text-warning">Expiring Soon</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {expiringProducts.slice(0, 3).map((p) => (
                <div key={p.id} className="flex items-center justify-between gap-2">
                  <span className="text-xs truncate flex-1">{p.name}</span>
                  <span className="text-[10px] text-warning font-medium shrink-0">{p.expirationDate}</span>
                </div>
              ))}
              {expiringProducts.length === 0 && (
                <p className="text-xs text-muted-foreground">No expiring products</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
