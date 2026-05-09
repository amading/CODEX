import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import type { Schema } from "@google/generative-ai";
import { identifyPackagingViaBackend } from "./identifyViaBackend";
import type { ProductVisionGuess, VisionConfidence } from "./types";

const DEFAULT_MODEL = "gemini-2.0-flash";

export function readGeminiApiKey(): string {
  const k = import.meta.env.VITE_GEMINI_API_KEY?.trim();
  if (!k) throw new VisionConfigError("Set VITE_GEMINI_API_KEY in your .env (see .env.example).");
  return k;
}

export function readGeminiModel(): string {
  return import.meta.env.VITE_GEMINI_MODEL?.trim() || DEFAULT_MODEL;
}

export class VisionConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "VisionConfigError";
  }
}

function parseConfidence(v: unknown): VisionConfidence {
  if (v === "high" || v === "medium" || v === "low") return v;
  return "low";
}

function normalizeGuess(raw: Record<string, unknown>): ProductVisionGuess {
  const num = raw.suggestedRetailPricePhp;
  let price: number | null = null;
  if (typeof num === "number" && Number.isFinite(num)) price = num;
  else if (typeof num === "string" && num.trim() !== "") {
    const p = Number.parseFloat(num.replace(/[^\d.]/g, ""));
    if (Number.isFinite(p)) price = p;
  }

  return {
    productName: typeof raw.productName === "string" ? raw.productName || null : null,
    brand: typeof raw.brand === "string" ? raw.brand || null : null,
    barcode: typeof raw.barcode === "string" ? raw.barcode.replace(/\s/g, "") || null : null,
    variantOrFlavor: typeof raw.variantOrFlavor === "string" ? raw.variantOrFlavor || null : null,
    netWeightOrSize: typeof raw.netWeightOrSize === "string" ? raw.netWeightOrSize || null : null,
    categoryGuess: typeof raw.categoryGuess === "string" ? raw.categoryGuess || null : null,
    suggestedRetailPricePhp: price,
    confidence: parseConfidence(raw.confidence),
    caveats: typeof raw.caveats === "string" ? raw.caveats || null : null,
  };
}

/** Uses backend identify API first; falls back to direct Gemini only when backend URL is not set. */
export async function recognizeProductFromImage(
  imageBlob: Blob,
  signal?: AbortSignal
): Promise<ProductVisionGuess> {
  const backendBase = import.meta.env.VITE_PRODUCT_IDENTIFY_URL?.trim();
  if (backendBase) {
    return identifyPackagingViaBackend(backendBase, imageBlob, signal);
  }

  const apiKey = import.meta.env.VITE_GEMINI_API_KEY?.trim();
  if (!apiKey) {
    throw new VisionConfigError(
      "No identifier configured. Set VITE_PRODUCT_IDENTIFY_URL (recommended) or VITE_GEMINI_API_KEY."
    );
  }

  const modelName = readGeminiModel();
  const mimeType = imageBlob.type && imageBlob.type.startsWith("image/") ? imageBlob.type : "image/jpeg";
  const buffer = await imageBlob.arrayBuffer();
  const base64 = btoa(new Uint8Array(buffer).reduce((acc, b) => acc + String.fromCharCode(b), ""));

  const genAI = new GoogleGenerativeAI(apiKey);
  const responseSchema = {
    type: SchemaType.OBJECT,
    properties: {
      productName: { type: SchemaType.STRING, nullable: true, description: "Full product name on pack" },
      brand: { type: SchemaType.STRING, nullable: true },
      barcode: { type: SchemaType.STRING, nullable: true, description: "GTIN/EAN digits if clearly visible" },
      variantOrFlavor: { type: SchemaType.STRING, nullable: true },
      netWeightOrSize: { type: SchemaType.STRING, nullable: true },
      categoryGuess: {
        type: SchemaType.STRING,
        nullable: true,
        description: "One short grocery category e.g. Snacks, Beverages, Household",
      },
      suggestedRetailPricePhp: {
        type: SchemaType.NUMBER,
        nullable: true,
        description: "Printed SRP in PHP only if visible on packaging",
      },
      confidence: {
        type: SchemaType.STRING,
        format: "enum" as const,
        enum: ["high", "medium", "low"],
      },
      caveats: { type: SchemaType.STRING, nullable: true },
    },
    required: ["confidence"],
  } as Schema;

  const prompt = [
    "You identify retail FMCG packaging (Philippines / international).",
    "Read visible text carefully: brand, variant/flavor, net weight, barcode if printed, and any SRP/PHP price.",
    "If something is unclear, use null; do not invent barcodes or prices.",
    "Answer in English. confidence reflects how readable the pack is.",
  ].join(" ");

  const model = genAI.getGenerativeModel({
    model: modelName,
    generationConfig: {
      temperature: 0.2,
      responseMimeType: "application/json",
      responseSchema,
    },
  });

  const result = await model.generateContent(
    {
      contents: [
        {
          role: "user",
          parts: [{ inlineData: { mimeType, data: base64 } }, { text: prompt }],
        },
      ],
    },
    { signal }
  );

  const text = result.response.text();
  let parsed: unknown;
  try {
    parsed = JSON.parse(text) as unknown;
  } catch {
    throw new Error("Could not parse model response as JSON.");
  }

  if (!parsed || typeof parsed !== "object") {
    throw new Error("Empty model response.");
  }

  return normalizeGuess(parsed as Record<string, unknown>);
}
