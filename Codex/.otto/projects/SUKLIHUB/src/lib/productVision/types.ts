export type VisionConfidence = "high" | "medium" | "low";

/** Normalized structured guess from Gemini (or compatible) vision */
export type ProductVisionGuess = {
  productName: string | null;
  brand: string | null;
  barcode: string | null;
  variantOrFlavor: string | null;
  netWeightOrSize: string | null;
  categoryGuess: string | null;
  /** Retail price printed on pack in PHP — null if not visible */
  suggestedRetailPricePhp: number | null;
  confidence: VisionConfidence;
  /** Short caveat, e.g. glare, blurry, multilingual label */
  caveats: string | null;
};
