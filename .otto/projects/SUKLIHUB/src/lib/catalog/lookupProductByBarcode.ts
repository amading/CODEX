import type { Product } from "@/types";

/** Keep digits only — works for scanned input with whitespace or separators. */
export function normalizeBarcodeInput(raw: string): string {
  return raw.replace(/\D/g, "");
}

/** Find first product whose barcode equals normalized input. */
export function lookupProductByBarcode(catalog: Product[], rawInput: string): Product | null {
  const key = normalizeBarcodeInput(rawInput);
  if (!key) return null;
  return catalog.find(p => normalizeBarcodeInput(p.barcode) === key) ?? null;
}

/** Sample rows for “try these” UI (from your mock catalog). */
export function barcodeCatalogHints(
  catalog: Product[],
  limit = 12
): { barcode: string; name: string }[] {
  return catalog
    .filter(p => p.barcode.trim() !== "")
    .slice(0, limit)
    .map(p => ({ barcode: p.barcode, name: p.name }));
}
