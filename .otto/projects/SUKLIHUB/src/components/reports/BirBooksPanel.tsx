import { useCallback, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { orders } from "@/data/mockData";
import type { Order } from "@/types";
import { Plus, RefreshCw, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

/** Table-style list: looks like plain text until focused */
const cellInput = cn(
  "w-full min-w-0 border-0 bg-transparent px-1 py-0.5 text-sm leading-normal text-foreground shadow-none rounded-none outline-none",
  "placeholder:text-muted-foreground/45 focus-visible:bg-muted/35 focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-0"
);

const tabActiveTone: Record<"book1" | "book2" | "book3", string> = {
  book1:
    "data-active:border-b-primary data-active:bg-primary/20 data-active:text-primary data-active:shadow-none dark:data-active:bg-primary/26 [&_span:last-child]:data-active:text-primary/80",
  book2:
    "data-active:border-b-blue-500 data-active:bg-blue-500/18 data-active:text-blue-800 data-active:shadow-none dark:data-active:bg-blue-500/24 dark:data-active:text-blue-50 [&_span:last-child]:data-active:text-blue-700/90 dark:[&_span:last-child]:data-active:text-blue-200/90",
  book3:
    "data-active:border-b-emerald-600 data-active:bg-emerald-500/18 data-active:text-emerald-900 data-active:shadow-none dark:data-active:bg-emerald-500/22 dark:data-active:text-emerald-50 [&_span:last-child]:data-active:text-emerald-800/90 dark:[&_span:last-child]:data-active:text-emerald-200/90",
};

const fmt = (n: number) =>
  new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    maximumFractionDigits: 0,
  }).format(n);

function newRowId(prefix: string) {
  return `${prefix}-${crypto.randomUUID().slice(0, 8)}`;
}

/** BIR-flagged orders, excluding voided — used to seed Book 1 */
function birOrdersForReports(): Order[] {
  return orders.filter((o) => o.isBIR && o.orderStatus !== "voided");
}

function seedOfficialReceiptLines() {
  return birOrdersForReports().map((o, i) => ({
    id: o.id,
    date: o.createdAt.split(" ")[0] ?? "",
    orNo: `OR-${String(i + 1).padStart(3, "0")}`,
    orderRef: o.orderNumber,
    customer: o.customerName,
    cashier: o.cashierName,
    amount: String(o.totalAmount),
    vat: String(Math.round(o.totalAmount * 0.12 * 100) / 100),
    remarks: "",
  }));
}

function seedPurchaseLines() {
  return [
    {
      id: newRowId("pv"),
      date: "2026-05-06",
      invoice: "SI-88421",
      supplier: "San Miguel Distributors",
      particulars: "Stock-in · beverages",
      amount: "11520",
      vat: "1382.40",
    },
    {
      id: newRowId("pv"),
      date: "2026-05-05",
      invoice: "SI-10234",
      supplier: "Century Pacific",
      particulars: "Canned goods",
      amount: "8640",
      vat: "1036.80",
    },
    {
      id: newRowId("pv"),
      date: "2026-05-05",
      invoice: "SI-77301",
      supplier: "Monde Nissin Co.",
      particulars: "Noodles & mixes",
      amount: "4320",
      vat: "518.40",
    },
  ];
}

function buildSummarySeedFromReceipts(
  receiptLines: { amount: string; vat: string }[]
): { id: string; label: string; value: string; hint?: string }[] {
  const gross = receiptLines.reduce((s, l) => s + (Number.parseFloat(l.amount) || 0), 0);
  const vat = receiptLines.reduce((s, l) => s + (Number.parseFloat(l.vat) || 0), 0);
  const vatable = Math.max(gross - vat, 0);
  const n = receiptLines.length;
  return [
    {
      id: "s1",
      label: "Total BIR receipts (count)",
      value: String(n),
      hint: "Auto from Book 1 — edit if needed",
    },
    {
      id: "s2",
      label: "Total VATable sales",
      value: String(Math.round(vatable)),
      hint: "Gross − VAT columns (approx.)",
    },
    {
      id: "s3",
      label: "VAT amount (12%)",
      value: String(Math.round(vat * 100) / 100),
      hint: "Rounded from Book 1 VAT column",
    },
    {
      id: "s4",
      label: "VAT-exempt sales",
      value: "0",
      hint: "Manual if you split exempt lines",
    },
    {
      id: "s5",
      label: "Gross sales (BIR)",
      value: String(Math.round(gross)),
      hint: "Sum of OR amounts",
    },
  ];
}

type OfficialReceiptRow = ReturnType<typeof seedOfficialReceiptLines>[number];
type PurchaseRow = ReturnType<typeof seedPurchaseLines>[number];

type BookId = "book1" | "book2" | "book3";

const REGISTER_ROWS: { id: BookId; title: string; caption: string }[] = [
  { id: "book1", title: "Book 1", caption: "Official receipts" },
  { id: "book2", title: "Book 2", caption: "Purchases" },
  { id: "book3", title: "Book 3", caption: "VAT summary" },
];

type BirBooksDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function BirBooksDialog({ open, onOpenChange }: BirBooksDialogProps) {
  const [selectedBook, setSelectedBook] = useState<BookId>("book1");
  const [orLines, setOrLines] = useState(seedOfficialReceiptLines);
  const [purchaseLines, setPurchaseLines] = useState(seedPurchaseLines);
  const initialSummary = useMemo(() => buildSummarySeedFromReceipts(seedOfficialReceiptLines()), []);
  const [summaryRows, setSummaryRows] = useState(initialSummary);

  const refreshSummaryFromBook1 = useCallback(() => {
    setSummaryRows(buildSummarySeedFromReceipts(orLines));
  }, [orLines]);

  const resetBook1FromOrders = useCallback(() => {
    setOrLines(seedOfficialReceiptLines());
  }, []);

  const updateOr = (id: string, patch: Partial<OfficialReceiptRow>) => {
    setOrLines((rows) => rows.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  };

  const updatePv = (id: string, patch: Partial<PurchaseRow>) => {
    setPurchaseLines((rows) => rows.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  };

  const updateSummary = (id: string, value: string) => {
    setSummaryRows((rows) => rows.map((r) => (r.id === id ? { ...r, value } : r)));
  };

  const orTotals = useMemo(() => {
    const gross = orLines.reduce((s, l) => s + (Number.parseFloat(l.amount) || 0), 0);
    const vatTot = orLines.reduce((s, l) => s + (Number.parseFloat(l.vat) || 0), 0);
    return { gross, vatTot };
  }, [orLines]);

  const pvTotals = useMemo(() => {
    const gross = purchaseLines.reduce((s, l) => s + (Number.parseFloat(l.amount) || 0), 0);
    const vatTot = purchaseLines.reduce((s, l) => s + (Number.parseFloat(l.vat) || 0), 0);
    return { gross, vatTot };
  }, [purchaseLines]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton
        className="flex max-h-[min(92vh,860px)] w-[min(96vw,52rem)] max-w-none flex-col gap-0 overflow-hidden border-border bg-popover p-0 sm:w-[min(94vw,60rem)] sm:max-w-none lg:w-[min(94vw,72rem)] xl:w-[min(92vw,80rem)]"
      >
        <DialogHeader className="shrink-0 space-y-1 border-b px-5 py-4 text-left">
          <DialogTitle>BIR books</DialogTitle>
          <DialogDescription className="text-pretty">
            The active tab is highlighted. Registers use a clean list (row lines only).
          </DialogDescription>
        </DialogHeader>

        <Tabs
          value={selectedBook}
          onValueChange={(v) => setSelectedBook(v as BookId)}
          className="flex min-h-0 flex-1 flex-col gap-0"
        >
          <TabsList
            variant="line"
            className="isolate z-10 h-auto min-h-0 w-full shrink-0 justify-stretch gap-px rounded-none border-b border-border bg-muted/40 px-0 py-0"
          >
            {REGISTER_ROWS.map((row) => (
              <TabsTrigger
                key={row.id}
                value={row.id}
                className={cn(
                  "grow basis-0 rounded-none border-0 border-b-2 border-b-transparent px-3 py-3 text-center text-xs transition-colors sm:px-4 sm:text-sm flex-col gap-0.5 h-auto font-medium text-muted-foreground",
                  "after:hidden",
                  "-mb-px hover:bg-muted/55 hover:text-foreground",
                  "data-active:z-[1] data-active:rounded-none data-active:pb-3 data-active:font-semibold",
                  tabActiveTone[row.id],
                )}
              >
                <span>{row.title}</span>
                <span className="text-[11px] font-normal text-muted-foreground">{row.caption}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-5">
            <TabsContent value="book1" className="mt-0 outline-none">
              <Card className="border-border shadow-sm">
                <CardContent className="space-y-4 px-4 pb-6 pt-5 sm:px-5">
                  <div className="overflow-x-auto rounded-lg border border-border bg-card">
                    <div className="min-w-[48rem]">
                      <div className="grid grid-cols-[1.2fr_0.55fr_0.85fr_0.95fr_0.75fr_5.75rem_5.75rem_1fr_auto] gap-x-4 border-b border-border bg-muted/25 px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                        <span>Customer</span>
                        <span>OR #</span>
                        <span>Date</span>
                        <span>Order</span>
                        <span>Cashier</span>
                        <span className="text-right">Amount</span>
                        <span className="text-right">VAT</span>
                        <span>Remarks</span>
                        <span className="sr-only">Remove</span>
                      </div>
                      {orLines.map((r) => (
                        <div
                          key={r.id}
                          className="grid grid-cols-[1.2fr_0.55fr_0.85fr_0.95fr_0.75fr_5.75rem_5.75rem_1fr_auto] gap-x-4 items-center border-b border-border px-4 py-4 text-sm text-foreground last:border-b-0"
                        >
                          <Input
                            value={r.customer}
                            aria-label="Customer"
                            className={cn(cellInput, "font-medium")}
                            onChange={(e) => updateOr(r.id, { customer: e.target.value })}
                          />
                          <Input
                            value={r.orNo}
                            aria-label="OR number"
                            className={cn(cellInput, "font-mono")}
                            onChange={(e) => updateOr(r.id, { orNo: e.target.value })}
                          />
                          <Input
                            value={r.date}
                            aria-label="Date"
                            className={cn(cellInput, "font-mono text-[13px]")}
                            onChange={(e) => updateOr(r.id, { date: e.target.value })}
                          />
                          <Input
                            value={r.orderRef}
                            aria-label="Order"
                            className={cn(cellInput, "font-mono text-[13px]")}
                            onChange={(e) => updateOr(r.id, { orderRef: e.target.value })}
                          />
                          <Input
                            value={r.cashier}
                            aria-label="Cashier"
                            className={cellInput}
                            onChange={(e) => updateOr(r.id, { cashier: e.target.value })}
                          />
                          <Input
                            value={r.amount}
                            inputMode="decimal"
                            aria-label="Amount"
                            className={cn(cellInput, "tabular-nums text-right font-mono")}
                            onChange={(e) => updateOr(r.id, { amount: e.target.value })}
                          />
                          <Input
                            value={r.vat}
                            inputMode="decimal"
                            aria-label="VAT"
                            className={cn(cellInput, "tabular-nums text-right font-mono")}
                            onChange={(e) => updateOr(r.id, { vat: e.target.value })}
                          />
                          <Input
                            value={r.remarks}
                            placeholder="—"
                            aria-label="Remarks"
                            className={cn(cellInput, "text-muted-foreground")}
                            onChange={(e) => updateOr(r.id, { remarks: e.target.value })}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon-sm"
                            className="justify-self-end text-muted-foreground hover:text-destructive"
                            onClick={() => setOrLines((rows) => rows.filter((row) => row.id !== r.id))}
                            aria-label="Remove row"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                    <div className="flex flex-wrap gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="gap-1.5"
                        onClick={() =>
                          setOrLines((rows) => [
                            ...rows,
                            {
                              id: newRowId("or"),
                              date: "2026-05-07",
                              orNo: `OR-${String(rows.length + 1).padStart(3, "0")}`,
                              orderRef: "",
                              customer: "",
                              cashier: "",
                              amount: "0",
                              vat: "0",
                              remarks: "",
                            },
                          ])
                        }
                      >
                        <Plus className="h-3.5 w-3.5" /> Add receipt row
                      </Button>
                      <Button type="button" variant="outline" size="sm" className="gap-1.5" onClick={resetBook1FromOrders}>
                        <RefreshCw className="h-3.5 w-3.5" /> Reset from orders
                      </Button>
                    </div>
                    <span className="text-muted-foreground">
                      Footer: Gross <span className="font-semibold text-foreground">{fmt(orTotals.gross)}</span>
                      {" · "}
                      VAT column sum <span className="font-semibold text-foreground">{fmt(orTotals.vatTot)}</span>
                    </span>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="book2" className="mt-0 outline-none">
              <Card className="border-border shadow-sm">
                <CardContent className="space-y-4 px-4 pb-6 pt-5 sm:px-5">
                  <div className="overflow-x-auto rounded-lg border border-border bg-card">
                    <div className="min-w-[40rem]">
                      <div className="grid grid-cols-[1.35fr_0.72fr_0.72fr_1.25fr_5.85rem_5.85rem_auto] gap-x-4 border-b border-border bg-muted/25 px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                        <span>Supplier</span>
                        <span>Invoice #</span>
                        <span>Date</span>
                        <span>Particulars</span>
                        <span className="text-right">Amount</span>
                        <span className="text-right">VAT</span>
                        <span className="sr-only">Remove</span>
                      </div>
                      {purchaseLines.map((r) => (
                        <div
                          key={r.id}
                          className="grid grid-cols-[1.35fr_0.72fr_0.72fr_1.25fr_5.85rem_5.85rem_auto] gap-x-4 items-center border-b border-border px-4 py-4 text-sm last:border-b-0"
                        >
                          <Input
                            value={r.supplier}
                            aria-label="Supplier"
                            className={cn(cellInput, "font-medium")}
                            onChange={(e) => updatePv(r.id, { supplier: e.target.value })}
                          />
                          <Input
                            value={r.invoice}
                            aria-label="Invoice number"
                            className={cn(cellInput, "font-mono text-[13px]")}
                            onChange={(e) => updatePv(r.id, { invoice: e.target.value })}
                          />
                          <Input
                            value={r.date}
                            aria-label="Date"
                            className={cn(cellInput, "font-mono text-[13px]")}
                            onChange={(e) => updatePv(r.id, { date: e.target.value })}
                          />
                          <Input
                            value={r.particulars}
                            aria-label="Particulars"
                            className={cn(cellInput, "text-muted-foreground")}
                            onChange={(e) => updatePv(r.id, { particulars: e.target.value })}
                          />
                          <Input
                            value={r.amount}
                            inputMode="decimal"
                            aria-label="Amount"
                            className={cn(cellInput, "text-right font-mono tabular-nums")}
                            onChange={(e) => updatePv(r.id, { amount: e.target.value })}
                          />
                          <Input
                            value={r.vat}
                            inputMode="decimal"
                            aria-label="VAT"
                            className={cn(cellInput, "text-right font-mono tabular-nums")}
                            onChange={(e) => updatePv(r.id, { vat: e.target.value })}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon-sm"
                            className="justify-self-end text-muted-foreground hover:text-destructive"
                            onClick={() => setPurchaseLines((rows) => rows.filter((row) => row.id !== r.id))}
                            aria-label="Remove row"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="gap-1.5"
                      onClick={() =>
                        setPurchaseLines((rows) => [
                          ...rows,
                          {
                            id: newRowId("pv"),
                            date: "2026-05-07",
                            invoice: "",
                            supplier: "",
                            particulars: "",
                            amount: "0",
                            vat: "0",
                          },
                        ])
                      }
                    >
                      <Plus className="h-3.5 w-3.5" /> Add purchase row
                    </Button>
                    <span className="text-muted-foreground">
                      Totals: <span className="font-semibold text-foreground">{fmt(pvTotals.gross)}</span>
                      {" · "}
                      VAT <span className="font-semibold text-foreground">{fmt(pvTotals.vatTot)}</span>
                    </span>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="book3" className="mt-0 outline-none">
              <Card className="border-border shadow-sm">
                <CardHeader className="border-b bg-muted/30 px-4 py-3 sm:px-5">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0 space-y-1">
                      <CardTitle className="text-base">VAT &amp; sales summary sheet</CardTitle>
                      <CardDescription className="text-xs">
                        Aligned to Book 1 on first load. Adjust values before filing with BIR.
                      </CardDescription>
                    </div>
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      className="shrink-0 gap-1.5"
                      onClick={refreshSummaryFromBook1}
                    >
                      <RefreshCw className="h-3.5 w-3.5" /> Refresh from Book 1
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 px-4 pb-6 pt-4 sm:px-5">
                  {summaryRows.map((row) => (
                    <div key={row.id} className="space-y-1">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <label className="shrink-0 text-sm text-muted-foreground" htmlFor={`sum-${row.id}`}>
                          {row.label}
                        </label>
                        <Input
                          id={`sum-${row.id}`}
                          value={row.value}
                          className={cn(cellInput, "h-9 max-w-full font-semibold tabular-nums sm:max-w-[14rem]")}
                          inputMode="decimal"
                          onChange={(e) => updateSummary(row.id, e.target.value)}
                        />
                      </div>
                      {row.hint ? <p className="text-xs text-muted-foreground sm:max-w-xl">{row.hint}</p> : null}
                      <Separator className="mt-3" />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
