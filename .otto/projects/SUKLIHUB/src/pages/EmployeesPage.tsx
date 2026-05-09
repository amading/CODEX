import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle,
} from "@/components/ui/sheet";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  UserCheck, Clock, ShoppingCart, Package, X, Truck,
  TrendingUp, Plus, Printer, Download, LogIn, LogOut,
  Search,
} from "lucide-react";
import { employees } from "@/data/mockData";
import type { Employee } from "@/types";

const roleColor: Record<string, string> = {
  cashier: "bg-primary/10 text-primary border-primary/20",
  inventory: "bg-success/10 text-success border-success/20",
  manager: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  admin: "bg-destructive/10 text-destructive border-destructive/20",
  delivery: "bg-info/10 text-info border-info/20",
};

const activityTimeline = [
  { time: "09:15", action: "Processed Order #ORD-2026-0501", type: "sale" },
  { time: "11:00", action: "Processed Order #ORD-2026-0503", type: "sale" },
  { time: "11:45", action: "Voided Order #ORD-2026-0504 — approved by manager", type: "void" },
  { time: "13:00", action: "Processed Order #ORD-2026-0505", type: "sale" },
];

export function EmployeesPage() {
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = employees.filter(e =>
    e.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Employees</h1>
          <p className="text-sm text-muted-foreground">Attendance, activity & performance tracking</p>
        </div>
        <Button className="gap-2 self-start sm:self-auto"><Plus className="h-4 w-4" /> Add Employee</Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total Staff", value: employees.length, icon: UserCheck, color: "text-primary" },
          { label: "Clocked In Today", value: employees.filter(e => e.checkIn && !e.checkOut).length, icon: Clock, color: "text-success" },
          { label: "Total Orders Today", value: employees.reduce((s, e) => s + e.ordersProcessed, 0), icon: ShoppingCart, color: "text-info" },
          { label: "Products Added", value: employees.reduce((s, e) => s + e.productsAdded, 0), icon: Package, color: "text-warning" },
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

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        {/* Overview */}
        <TabsContent value="overview" className="mt-4">
          <div className="mb-3">
            <div className="relative max-w-xs">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search employees…" className="pl-8 h-9 text-sm" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filtered.map(emp => (
              <Card
                key={emp.id}
                className="cursor-pointer hover:shadow-md hover:border-primary/40 transition-all"
                onClick={() => { setSelectedEmployee(emp); setSheetOpen(true); }}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="relative">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={emp.avatar} />
                        <AvatarFallback className="font-bold">
                          {emp.name.split(" ").map(n => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-card ${emp.isActive ? "bg-success" : "bg-muted"}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm truncate">{emp.name}</p>
                      <Badge className={`text-[10px] border ${roleColor[emp.role]} capitalize`} variant="outline">
                        {emp.role}
                      </Badge>
                    </div>
                  </div>

                  {/* DTR */}
                  <div className="flex items-center justify-between text-xs bg-muted/50 rounded-lg p-2 mb-3">
                    <div className="flex items-center gap-1.5 text-success">
                      <LogIn className="h-3.5 w-3.5" />
                      <span>{emp.checkIn || "Not yet"}</span>
                    </div>
                    <span className="text-muted-foreground">→</span>
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <LogOut className="h-3.5 w-3.5" />
                      <span>{emp.checkOut || "Active"}</span>
                    </div>
                  </div>

                  {/* Mini Stats */}
                  <div className="grid grid-cols-2 gap-1.5 text-center">
                    <div className="bg-muted/50 rounded p-1.5">
                      <p className="text-xs font-bold text-primary">{emp.ordersProcessed}</p>
                      <p className="text-[10px] text-muted-foreground">Orders</p>
                    </div>
                    <div className="bg-muted/50 rounded p-1.5">
                      <p className="text-xs font-bold text-success">
                        {emp.totalSales > 0 ? `₱${(emp.totalSales / 1000).toFixed(1)}k` : emp.productsAdded + " added"}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        {emp.totalSales > 0 ? "Sales" : "Products"}
                      </p>
                    </div>
                  </div>

                  {emp.voidsMade > 0 && (
                    <div className="mt-2 flex items-center gap-1.5 text-xs text-warning">
                      <X className="h-3 w-3" />
                      <span>{emp.voidsMade} void{emp.voidsMade > 1 ? "s" : ""} today</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Attendance */}
        <TabsContent value="attendance" className="mt-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Daily Time Record — May 7, 2026</CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="gap-2 text-xs"><Printer className="h-3.5 w-3.5" /> Print DTR</Button>
                  <Button variant="outline" size="sm" className="gap-2 text-xs"><Download className="h-3.5 w-3.5" /> Export</Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Check In</TableHead>
                    <TableHead>Check Out</TableHead>
                    <TableHead>Total Hours</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {employees.map(emp => {
                    const hours = emp.checkIn ? (emp.checkOut ? "8.5 hrs" : `${Math.floor((13 - 8) + (0 - 0))} hrs (active)`) : "—";
                    return (
                      <TableRow key={emp.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-7 w-7">
                              <AvatarImage src={emp.avatar} />
                              <AvatarFallback className="text-xs">{emp.name[0]}</AvatarFallback>
                            </Avatar>
                            <span className="text-sm font-medium">{emp.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={`text-[10px] border capitalize ${roleColor[emp.role]}`} variant="outline">{emp.role}</Badge>
                        </TableCell>
                        <TableCell className="text-sm text-success font-medium">{emp.checkIn || "—"}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{emp.checkOut || "Active"}</TableCell>
                        <TableCell className="text-sm">{hours}</TableCell>
                        <TableCell>
                          <Badge variant={emp.isActive ? "default" : "secondary"} className="text-[10px]">
                            {emp.isActive ? "Present" : "Absent"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button variant="outline" size="sm" className="h-7 gap-1 text-xs text-success border-success/30">
                              <LogIn className="h-3 w-3" /> In
                            </Button>
                            <Button variant="outline" size="sm" className="h-7 gap-1 text-xs text-destructive border-destructive/30">
                              <LogOut className="h-3 w-3" /> Out
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Performance */}
        <TabsContent value="performance" className="mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {employees.map(emp => (
              <Card key={emp.id}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-4">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={emp.avatar} />
                      <AvatarFallback className="font-bold text-sm">{emp.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-sm">{emp.name}</p>
                      <Badge className={`text-[10px] border capitalize ${roleColor[emp.role]}`} variant="outline">{emp.role}</Badge>
                    </div>
                    <div className="ml-auto text-right">
                      {emp.totalSales > 0 && (
                        <p className="text-sm font-bold text-primary">₱{emp.totalSales.toLocaleString()}</p>
                      )}
                      <p className="text-xs text-muted-foreground">Today</p>
                    </div>
                  </div>
                  <div className="space-y-2.5">
                    {[
                      { label: "Orders Processed", value: emp.ordersProcessed, max: 100, color: "text-primary" },
                      { label: "Products Added", value: emp.productsAdded, max: 50, color: "text-success" },
                      { label: "Voids Made", value: emp.voidsMade, max: 10, color: "text-warning" },
                    ].map(m => (
                      <div key={m.label}>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-muted-foreground">{m.label}</span>
                          <span className={`font-bold ${m.color}`}>{m.value}</span>
                        </div>
                        <Progress value={(m.value / m.max) * 100} className="h-1.5" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Employee Detail Sheet */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="w-full sm:w-[480px] overflow-y-auto">
          {selectedEmployee && (
            <>
              <SheetHeader className="mb-4">
                <SheetTitle>Employee Profile</SheetTitle>
              </SheetHeader>
              <div className="space-y-5">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={selectedEmployee.avatar} />
                    <AvatarFallback className="text-xl font-bold">
                      {selectedEmployee.name.split(" ").map(n => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="text-lg font-bold">{selectedEmployee.name}</h2>
                    <Badge className={`border capitalize ${roleColor[selectedEmployee.role]}`} variant="outline">
                      {selectedEmployee.role}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: "Orders", value: selectedEmployee.ordersProcessed, icon: ShoppingCart },
                    { label: "Products", value: selectedEmployee.productsAdded, icon: Package },
                    { label: "Voids", value: selectedEmployee.voidsMade, icon: X },
                  ].map(s => (
                    <div key={s.label} className="text-center p-3 rounded-xl bg-muted/50">
                      <s.icon className="h-4 w-4 mx-auto mb-1 text-primary" />
                      <p className="text-sm font-bold">{s.value}</p>
                      <p className="text-[10px] text-muted-foreground">{s.label}</p>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <Button className="flex-1 gap-2 text-sm" size="sm"><LogIn className="h-4 w-4" /> Check In</Button>
                  <Button variant="outline" className="flex-1 gap-2 text-sm" size="sm"><LogOut className="h-4 w-4" /> Check Out</Button>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1 gap-2 text-sm" size="sm"><Printer className="h-4 w-4" /> Print DTR</Button>
                  <Button variant="outline" className="flex-1 gap-2 text-sm" size="sm"><Download className="h-4 w-4" /> Export Report</Button>
                </div>

                <Separator />

                {/* Activity Timeline */}
                <div>
                  <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-primary" /> Activity Timeline Today
                  </h3>
                  <div className="space-y-3 relative pl-4">
                    <div className="absolute left-0 top-2 bottom-2 w-0.5 bg-border" />
                    {activityTimeline.map((a, i) => (
                      <div key={i} className="relative">
                        <div className={`absolute -left-4 top-1 h-2 w-2 rounded-full ${
                          a.type === "void" ? "bg-destructive" : a.type === "sale" ? "bg-success" : "bg-primary"
                        }`} />
                        <div>
                          <p className="text-xs font-mono text-muted-foreground">{a.time}</p>
                          <p className="text-sm">{a.action}</p>
                        </div>
                      </div>
                    ))}
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
