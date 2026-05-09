import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import multer from "multer";
import { createWorker } from "tesseract.js";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, ".env") });

const DEFAULT_MODEL = "gemini-2.0-flash";
const PORT = Number.parseInt(process.env.PORT ?? "8787", 10);

function parseConfidence(v) {
  if (v === "high" || v === "medium" || v === "low") return v;
  return "low";
}

function normalizeGuess(raw) {
  const num = raw.suggestedRetailPricePhp;
  let price = null;
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

function readCorsOrigin() {
  const raw = process.env.CORS_ORIGIN?.trim();
  if (!raw) return true;
  return raw.split(",").map((s) => s.trim()).filter(Boolean);
}

function authMiddleware(req, res, next) {
  const secret = process.env.IDENTIFY_API_SECRET?.trim();
  if (!secret) return next();
  const key = req.get("x-api-key");
  if (key !== secret) {
    res.status(401).json({ error: "Invalid or missing X-API-Key." });
    return;
  }
  next();
}

function normalizeText(v) {
  return typeof v === "string" ? v.trim() : "";
}

async function lookupOpenFoodFactsByBarcode(barcode) {
  const url = `https://world.openfoodfacts.org/api/v0/product/${encodeURIComponent(barcode)}.json`;
  const r = await fetch(url, { headers: { Accept: "application/json" } });
  if (!r.ok) return null;
  const j = await r.json();
  if (!j || j.status !== 1 || !j.product) return null;
  const p = j.product;
  return {
    source: "openfoodfacts",
    productName: normalizeText(p.product_name_en || p.product_name || ""),
    brand: normalizeText(p.brands || ""),
    barcode: normalizeText(barcode),
    categoryGuess: normalizeText(
      Array.isArray(p.categories_tags) && p.categories_tags.length > 0
        ? String(p.categories_tags[0]).replace(/^en:/, "")
        : p.categories || ""
    ),
    netWeightOrSize: normalizeText(p.quantity || ""),
    suggestedRetailPricePhp: null,
    confidence: "medium",
  };
}

async function lookupGoogleCse(query) {
  const apiKey = process.env.GOOGLE_CSE_API_KEY?.trim();
  const cx = process.env.GOOGLE_CSE_CX?.trim();
  if (!apiKey || !cx || !query) return null;
  const url = new URL("https://www.googleapis.com/customsearch/v1");
  url.searchParams.set("key", apiKey);
  url.searchParams.set("cx", cx);
  url.searchParams.set("q", query);
  url.searchParams.set("num", "3");
  const r = await fetch(url, { headers: { Accept: "application/json" } });
  if (!r.ok) return null;
  const j = await r.json();
  const first = Array.isArray(j.items) && j.items.length ? j.items[0] : null;
  if (!first) return null;
  return {
    source: "google-cse",
    title: normalizeText(first.title || ""),
    snippet: normalizeText(first.snippet || ""),
    link: normalizeText(first.link || ""),
  };
}

async function identifyWithGemini(buffer, mimeType, signal) {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) {
    const err = new Error("GEMINI_API_KEY is not set on the server.");
    err.statusCode = 500;
    throw err;
  }
  const modelName = process.env.GEMINI_MODEL?.trim() || DEFAULT_MODEL;
  const base64 = Buffer.from(buffer).toString("base64");

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
        format: "enum",
        enum: ["high", "medium", "low"],
      },
      caveats: { type: SchemaType.STRING, nullable: true },
    },
    required: ["confidence"],
  };

  const prompt = [
    "You identify retail FMCG packaging (Philippines / international).",
    "Read visible text carefully: brand, variant/flavor, net weight, barcode if printed, and any SRP/₱/PHP price.",
    "If something is unclear, use null — do not invent barcodes or prices.",
    "Answer in English. confidence reflects how readable the pack is.",
  ].join(" ");

  const genAI = new GoogleGenerativeAI(apiKey);
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
          parts: [
            { inlineData: { mimeType, data: base64 } },
            { text: prompt },
          ],
        },
      ],
    },
    signal ? { signal } : undefined
  );

  const text = result.response.text();
  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch {
    const err = new Error("Could not parse model response as JSON.");
    err.statusCode = 502;
    throw err;
  }
  if (!parsed || typeof parsed !== "object") {
    const err = new Error("Empty model response.");
    err.statusCode = 502;
    throw err;
  }
  return normalizeGuess(parsed);
}

function normalizeOcrText(text) {
  return (text || "")
    .replace(/\r/g, "\n")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
}

function pickBestProductLine(lines) {
  const stop = new Set(["NEW", "ORIGINAL", "PACK", "POWDERED", "DRINK", "MILK", "CHOCO"]);
  const scored = lines
    .map((line) => {
      const cleaned = line.replace(/[^\w\s&-]/g, " ").replace(/\s+/g, " ").trim();
      const words = cleaned.split(" ").filter(Boolean);
      const alphaWords = words.filter((w) => /[A-Za-z]/.test(w));
      const strongWords = alphaWords.filter((w) => w.length >= 3 && !stop.has(w.toUpperCase()));
      return { line: cleaned, score: strongWords.length * 3 + alphaWords.length };
    })
    .filter((x) => x.line.length >= 4)
    .sort((a, b) => b.score - a.score);
  return scored[0]?.line || null;
}

async function identifyWithOcr(buffer) {
  const worker = await createWorker("eng");
  try {
    const {
      data: { text, confidence },
    } = await worker.recognize(buffer);
    const lines = normalizeOcrText(text).slice(0, 20);
    const best = pickBestProductLine(lines);
    const upper = lines.map((s) => s.toUpperCase()).join(" ");
    const brand = /NESCAFE|NESTLE|MILO|NIDO/.exec(upper)?.[0] || null;
    const productName = best || brand || null;
    return normalizeGuess({
      productName,
      brand,
      barcode: null,
      variantOrFlavor: null,
      netWeightOrSize: null,
      categoryGuess: "Beverages",
      suggestedRetailPricePhp: null,
      confidence: confidence >= 75 ? "medium" : "low",
      caveats: "OCR fallback used because Gemini was unavailable/quota-limited.",
    });
  } finally {
    await worker.terminate();
  }
}

const app = express();
app.use(cors({ origin: readCorsOrigin() }));
app.use(express.json({ limit: "64kb" }));

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 6 * 1024 * 1024 },
});

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.post("/v1/identify-packaging", authMiddleware, upload.single("image"), async (req, res) => {
  const file = req.file;
  if (!file?.buffer) {
    res.status(400).json({ error: "Missing multipart field `image`." });
    return;
  }
  const mimeType =
    file.mimetype && file.mimetype.startsWith("image/") ? file.mimetype : "image/jpeg";
  const ac = new AbortController();
  const onClose = () => ac.abort();
  res.on("close", onClose);
  try {
    const guess = await identifyWithGemini(file.buffer, mimeType, ac.signal);
    res.json(guess);
  } catch (e) {
    try {
      const fallback = await identifyWithOcr(file.buffer);
      res.json(fallback);
    } catch (ocrErr) {
      const status = e.statusCode ?? 500;
      const message = e instanceof Error ? e.message : "Unknown error";
      const ocrMessage = ocrErr instanceof Error ? ocrErr.message : "OCR fallback failed";
      res.status(status).json({ error: `${message} | ${ocrMessage}` });
    }
  } finally {
    res.off("close", onClose);
  }
});

app.get("/v1/research-product", authMiddleware, async (req, res) => {
  try {
    const barcode = normalizeText(req.query.barcode);
    const query = normalizeText(req.query.q);

    if (!barcode && !query) {
      res.status(400).json({ error: "Provide barcode or q query string." });
      return;
    }

    let hint = null;
    if (barcode) hint = await lookupOpenFoodFactsByBarcode(barcode);

    // Optional Google programmable search (when configured on server)
    const google = await lookupGoogleCse(query || barcode || hint?.productName || "");

    res.json({
      ok: true,
      hint,
      web: google,
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Lookup failed";
    res.status(500).json({ ok: false, error: message });
  }
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`SukliHub identify API http://127.0.0.1:${PORT} (POST /v1/identify-packaging)`);
});
