import { normalizeBarcodeInput } from "@/lib/catalog/lookupProductByBarcode";
import type { Product } from "@/types";

export type GlobalCatalogProduct = {
  id: number;
  barcodeNormalized: string;
  name: string;
  brand: string;
  category: string;
  unit: string;
  imageUrl: string | null;
  suggestedPrice: number | null;
  notes: string | null;
};

/** Full URL of products_catalog.php (e.g. http://localhost/suklihub-bir/api/products_catalog.php) */
export function getProductsCatalogPhpUrl(): string | undefined {
  const raw = import.meta.env.VITE_PRODUCTS_CATALOG_URL?.trim();
  return raw ? raw.replace(/\/?$/, "") : undefined;
}

function lookupUrl(endpointUrl: string, barcodeRaw: string): string {
  const sep = endpointUrl.includes("?") ? "&" : "?";
  return `${endpointUrl}${sep}barcode=${encodeURIComponent(barcodeRaw.trim())}`;
}

export async function fetchGlobalCatalogByBarcode(
  endpointUrl: string,
  barcodeRaw: string,
): Promise<GlobalCatalogProduct | null> {
  const key = normalizeBarcodeInput(barcodeRaw);
  if (!key) return null;
  const res = await fetch(lookupUrl(endpointUrl, barcodeRaw), { credentials: "omit" });
  if (!res.ok) throw new Error(`Catalog HTTP ${res.status}`);
  const raw: unknown = await res.json();
  const data = asRecord(raw);
  if (!data || data.ok !== true || data.found !== true) return null;
  return parseGlobalCatalogProduct(data.product);
}

export async function upsertGlobalCatalogProduct(
  endpointUrl: string,
  product: {
    barcode: string;
    name: string;
    brand: string;
    category: string;
    unit: string;
    imageUrl?: string | null;
    suggestedPrice?: number | null;
    notes?: string | null;
  },
): Promise<GlobalCatalogProduct | null> {
  const res = await fetch(endpointUrl.split("?")[0], {
    method: "POST",
    credentials: "omit",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ product }),
  });
  const raw: unknown = await res.json().catch(() => null);
  const data = raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};
  if (!res.ok || data.ok !== true) {
    const err = typeof data.error === "string" ? data.error : `Catalog save HTTP ${res.status}`;
    throw new Error(err);
  }
  return parseGlobalCatalogProduct(data.product);
}

function asRecord(v: unknown): Record<string, unknown> | null {
  return typeof v === "object" && v !== null ? (v as Record<string, unknown>) : null;
}

function parseGlobalCatalogProduct(v: unknown): GlobalCatalogProduct | null {
  if (typeof v !== "object" || v === null) return null;
  const o = v as Record<string, unknown>;
  const idRaw = o.id;
  const id = typeof idRaw === "number" ? idRaw : typeof idRaw === "string" ? Number(idRaw) : Number.NaN;
  if (!Number.isFinite(id)) return null;
  if (typeof o.barcodeNormalized !== "string" || typeof o.name !== "string") return null;
  const sp = o.suggestedPrice;
  let suggestedPrice: number | null = null;
  if (sp !== null && sp !== undefined && sp !== "") {
    const n = typeof sp === "number" ? sp : Number(sp);
    suggestedPrice = Number.isFinite(n) ? n : null;
  }

  return {
    id,
    barcodeNormalized: o.barcodeNormalized,
    name: o.name,
    brand: typeof o.brand === "string" ? o.brand : "",
    category: typeof o.category === "string" ? o.category : "",
    unit: typeof o.unit === "string" ? o.unit : "",
    imageUrl:
      o.imageUrl === null || o.imageUrl === undefined
        ? null
        : typeof o.imageUrl === "string"
          ? o.imageUrl
          : String(o.imageUrl),
    suggestedPrice,
    notes:
      o.notes === null || o.notes === undefined
        ? null
        : typeof o.notes === "string"
          ? o.notes
          : String(o.notes),
  };
}

/** Fits local `Product` shape for Add-product helpers. Not persisted store inventory quantities. */
export function globalCatalogProductToInventoryShape(row: GlobalCatalogProduct): Product {
  const price = row.suggestedPrice ?? 0;
  return {
    id: `globcat-${row.id}`,
    name: row.name,
    barcode: row.barcodeNormalized,
    qrCode: "",
    category: row.category,
    brand: row.brand,
    unit: row.unit || "pc",
    quantity: 0,
    costPrice: 0,
    sellingPrice: price,
    supplier: "",
    expirationDate: undefined,
    stockLocation: "",
    minStock: 0,
    isDeliveryItem: false,
    isBIRItem: true,
    notes: row.notes ?? undefined,
    image: row.imageUrl ?? "",
    status: "in_stock",
    lastUpdated: new Date().toISOString().slice(0, 10),
  };
}
