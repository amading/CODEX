/** Longest side cap — keeps uploads light while staying sharp on screen */
const MAX_EDGE_PX = 1280;
const JPEG_QUALITY = 0.82;

/**
 * Decode with createImageBitmap, downscale if needed, re-encode as JPEG.
 * Falls back to the original file if decoding or encoding fails.
 */
export async function compressProductImage(file: File): Promise<Blob> {
  if (!file.type.startsWith("image/")) return file;

  /** SVG stays vector; GIF keeps animation client-side — pass through */
  if (file.type === "image/svg+xml" || file.type === "image/gif") {
    return file;
  }

  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file);
  } catch {
    return file;
  }

  try {
    const iw = bitmap.width;
    const ih = bitmap.height;
    const maxEdge = Math.max(iw, ih);
    const scale = maxEdge <= MAX_EDGE_PX ? 1 : MAX_EDGE_PX / maxEdge;
    const tw = Math.max(1, Math.round(iw * scale));
    const th = Math.max(1, Math.round(ih * scale));

    const canvas = document.createElement("canvas");
    canvas.width = tw;
    canvas.height = th;
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;

    if (file.type === "image/png" || file.type === "image/webp") {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, tw, th);
    }
    ctx.drawImage(bitmap, 0, 0, tw, th);

    const blob: Blob | null = await new Promise(res =>
      canvas.toBlob(res, "image/jpeg", JPEG_QUALITY)
    );
    if (!blob || blob.size === 0) return file;
    /** Prefer compressed when smaller, or when we resized */
    if (scale < 1) return blob;
    return blob.size < file.size ? blob : file;
  } finally {
    bitmap.close();
  }
}
