import type { ProductVisionGuess } from "./types";

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}

/**
 * When you sell/host for others, point the SPA at your API so Gemini keys stay on the server.
 * Set `VITE_PRODUCT_IDENTIFY_URL` (e.g. https://api.yourcompany.com) and optionally `VITE_PRODUCT_IDENTIFY_SECRET`.
 */
export async function identifyPackagingViaBackend(
  baseUrl: string,
  imageBlob: Blob,
  signal?: AbortSignal
): Promise<ProductVisionGuess> {
  const url = `${baseUrl.replace(/\/$/, "")}/v1/identify-packaging`;
  const fd = new FormData();
  const ext = imageBlob.type?.includes("png") ? "png" : "jpg";
  fd.append("image", imageBlob, `pack.${ext}`);

  const headers: HeadersInit = {};
  const secret = import.meta.env.VITE_PRODUCT_IDENTIFY_SECRET?.trim();
  if (secret) headers["X-API-Key"] = secret;

  const res = await fetch(url, { method: "POST", body: fd, signal, headers });
  const text = await res.text();
  let body: unknown;
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    throw new Error(`Identify API returned non-JSON (${res.status}): ${text.slice(0, 200)}`);
  }

  if (!res.ok) {
    const msg =
      isRecord(body) && typeof body.error === "string" ? body.error : text.slice(0, 200);
    throw new Error(msg || `Identify API error (${res.status})`);
  }

  if (!isRecord(body)) throw new Error("Identify API returned empty body.");

  return body as ProductVisionGuess;
}
