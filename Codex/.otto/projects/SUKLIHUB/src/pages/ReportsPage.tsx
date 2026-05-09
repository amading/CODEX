import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import {
  ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent,
} from "@/components/ui/chart";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  PieChart, Pie, Cell,
} from "recharts";
import {
  TrendingUp, TrendingDown, Download, Printer, BarChart2,
  Package, Truck, AlertTriangle, DollarSign, FileText,
} from "lucide-react";
import {
  dailySummary, salesChartData, topProductsData, stockMovementChartData, products,
} from "@/data/mockData";
import { useState } from "react";
import { BirBooksDialog } from "@/components/reports/BirBooksPanel";

const salesConfig = { sales: { label: "Sales (₱)", color: "var(--color-chart-1)" } };
const stockConfig = {
  in: { label: "Stock In", color: "var(--color-chart-2)" },
  out: { label: "Stock Out", color: "var(--color-chart-5)" },
};
const pieConfig = {
  inStock: { label: "In Stock", color: "var(--color-chart-2)" },
  lowStock: { label: "Low Stock", color: "var(--color-chart-3)" },
  outOfStock: { label: "Out of Stock", color: "var(--color-chart-5)" },
};

const pieData = [
  { name: "inStock", value: products.filter(p => p.status === "in_stock").length },
  { name: "lowStock", value: products.filter(p => p.status === "low_stock").length },
  { name: "outOfStock", value: products.filter(p => p.status === "out_of_stock").length },
];

const fmt = (n: number) =>
  new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP", maximumFractionDigits: 0 }).format(n);

export function ReportsPage() {
  const [reportTab, setReportTab] = useState<string>("sales");
  const [birBooksOpen, setBirBooksOpen] = useState(false);

  const openBirBooks = () => setBirBooksOpen(true);

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Reports</h1>
          <p className="text-sm text-muted-foreground">Analytics & inventory insights — May 7, 2026</p>
        </div>
        <div className="flex gap-2 self-start sm:self-auto">
          <Button variant="outline" className="gap-2 text-sm" size="sm">
            <Printer className="h-4 w-4" /> Print
          </Button>
          <Button className="gap-2 text-sm" size="sm">
            <Download className="h-4 w-4" /> Export
          </Button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {[
          { label: "Total Sales", value: fmt(dailySummary.totalSales), icon: DollarSign, color: "text-primary", trend: "+12.4%" },
          { label: "Inventory Value", value: fmt(products.reduce((s, p) => s + p.quantity * p.costPrice, 0)), icon: Package, color: "text-success", trend: "+2.1%" },
          { label: "Total Outgoing", value: `${dailySummary.outgoingStock} units`, icon: TrendingDown, color: "text-destructive", trend: "Today" },
          { label: "Total Incoming", value: `${dailySummary.incomingStock} units`, icon: TrendingUp, color: "text-info", trend: "Today" },
          { label: "Delivery Items", value: `${dailySummary.pendingDelivery}`, icon: Truck, color: "text-warning", trend: "Pending" },
          { label: "Low Stock", value: `${products.filter(p => p.status === "low_stock").length} products`, icon: AlertTriangle, color: "text-warning", trend: "Action needed" },
          { label: "Price Changes", value: "3 items", icon: BarChart2, color: "text-purple-500", trend: "This week" },
          { label: "BIR Orders", value: "82 orders", icon: FileText, color: "text-primary", trend: "Today" },
        ].map(s => (
          <Card key={s.label}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs text-muted-foreground uppercase tracking-wide">{s.label}</span>
                <s.icon className={`h-4 w-4 ${s.color}`} />
              </div>
              <p className="text-lg font-bold leading-tight">{s.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{s.trend}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Report Tabs */}
      <Tabs value={reportTab} onValueChange={setReportTab}>
        <TabsList className="flex-wrap h-auto gap-1">
          {["sales", "inventory", "products", "bir", "delivery"].map(t => (
            <TabsTrigger key={t} value={t} className="capitalize">{t}</TabsTrigger>
          ))}
        </TabsList>

        {/* Sales Report */}
        <TabsContent value="sales" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Daily Sales Chart</CardTitle>
                <CardDescription>Revenue for the past 7 days</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={salesConfig} className="h-52 w-full">
                  <AreaChart data={salesChartData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                    <defs>
                      <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--color-chart-1)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="var(--color-chart-1)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" vertical={false} />
                    <XAxis dataKey="day" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `₱${(v / 1000).toFixed(0)}k`} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Area type="monotone" dataKey="sales" stroke="var(--color-chart-1)" fill="url(#salesGrad)" strokeWidth={2} />
                  </AreaChart>
                </ChartContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">BIR Book Summary</CardTitle>
                <CardDescription>Official receipts for May 7, 2026</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { label: "Total BIR Receipts", value: "82" },
                  { label: "Total VATable Sales", value: fmt(48000) },
                  { label: "VAT Amount (12%)", value: fmt(5760) },
                  { label: "VAT-Exempt Sales", value: fmt(10745) },
                  { label: "Gross Sales", value: fmt(dailySummary.totalSales) },
                ].map(row => (
                  <div key={row.label} className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">{row.label}</span>
                    <span className="font-semibold">{row.value}</span>
                  </div>
                ))}
                <Separator />
                <Button
                  type="button"
                  variant="outline"
                  className="w-full gap-2 text-sm"
                  size="sm"
                  onClick={openBirBooks}
                >
                  <FileText className="h-4 w-4" /> View BIR Book
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Inventory Report */}
        <TabsContent value="inventory" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Stock Status</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={pieConfig} className="h-48 w-full">
                  <PieChart>
                    <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} label={({ name, value }) => `${value}`}>
                      <Cell fill="var(--color-chart-2)" />
                      <Cell fill="var(--color-chart-3)" />
                      <Cell fill="var(--color-chart-5)" />
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ChartContainer>
                <div className="flex justify-around mt-2">
                  {[
                    { label: "In Stock", color: "bg-success", value: pieData[0].value },
                    { label: "Low", color: "bg-warning", value: pieData[1].value },
                    { label: "Out", color: "bg-destructive", value: pieData[2].value },
                  ].map(l => (
                    <div key={l.label} className="flex items-center gap-1.5">
                      <div className={`h-2.5 w-2.5 rounded-full ${l.color}`} />
                      <span className="text-xs text-muted-foreground">{l.label}: {l.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card className="lg:col-span-2">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Stock Movement (7 Days)</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={stockConfig} className="h-52 w-full">
                  <BarChart data={stockMovementChartData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" vertical={false} />
                    <XAxis dataKey="date" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <ChartLegend content={<ChartLegendContent />} />
                    <Bar dataKey="in" fill="var(--color-chart-2)" radius={[3, 3, 0, 0]} />
                    <Bar dataKey="out" fill="var(--color-chart-5)" radius={[3, 3, 0, 0]} />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Products Report */}
        <TabsContent value="products" className="mt-4">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Product Ranking by Sales</CardTitle>
                <Button variant="outline" size="sm" className="gap-2 text-xs"><Download className="h-3.5 w-3.5" /> Export</Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {topProductsData.map((p, i) => (
                <div key={p.name} className="flex items-center gap-3">
                  <span className="text-sm font-bold text-muted-foreground w-5 shrink-0">#{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium truncate">{p.name}</span>
                      <span className="text-muted-foreground shrink-0 ml-2">{p.sold} units</span>
                    </div>
                    <Progress value={(p.sold / 210) * 100} className="h-2" />
                  </div>
                  <span className="text-sm font-bold text-primary shrink-0 w-20 text-right">{fmt(p.revenue)}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* BIR — open centered dialog with tabbed booklets */}
        <TabsContent value="bir" className="mt-4 space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">BIR books</CardTitle>
              <CardDescription>
                Open the workbook in a centered window. One row at the top switches Book 1–3; no sidebar.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="list-inside list-disc space-y-1.5 text-sm text-muted-foreground">
                <li>
                  <span className="text-foreground font-medium">Book 1</span> — Manual of Official Receipts (from BIR orders)
                </li>
                <li>
                  <span className="text-foreground font-medium">Book 2</span> — Manual of Purchases
                </li>
                <li>
                  <span className="text-foreground font-medium">Book 3</span> — VAT &amp; sales summary
                </li>
              </ul>
              <Button type="button" className="gap-2" onClick={openBirBooks}>
                <FileText className="h-4 w-4" /> Open BIR books
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Delivery Report */}
        <TabsContent value="delivery" className="mt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Delivery Report</CardTitle>
              <CardDescription>All deliveries scheduled and completed</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    { customer: "Maria Santos", items: 3, date: "May 7, 2026", status: "delivered", total: 455 },
                    { customer: "Jose Dela Cruz", items: 2, date: "May 8, 2026", status: "preparing", total: 610 },
                    { customer: "Maria Santos", items: 3, date: "May 8, 2026", status: "pending", total: 1694 },
                  ].map((d, i) => (
                    <TableRow key={i}>
                      <TableCell className="text-sm font-medium">{d.customer}</TableCell>
                      <TableCell className="text-sm">{d.items}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{d.date}</TableCell>
                      <TableCell>
                        <Badge variant={d.status === "delivered" ? "default" : "secondary"} className="text-xs capitalize">
                          {d.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right text-sm font-semibold text-primary">{fmt(d.total)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <BirBooksDialog open={birBooksOpen} onOpenChange={setBirBooksOpen} />
    </div>
  );
}
