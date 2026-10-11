/**
 * Client-side preparation of homework-photo attachments before they are sent
 * to the AI chat endpoints.
 *
 * Why this exists: requests travel as JSON (base64-encoded image data), and the
 * server accepts at most 2 MB per chat request. Raw phone photos are typically
 * 2-8 MB (2.7-10.7 MB once base64-encoded), which the old pass-through upload
 * could never deliver — Express rejected them with HTTP 413 before any AI saw
 * them. We therefore downscale + re-compress in the browser first, keeping
 * enough resolution to read handwriting and printed problems.
 */

export interface PreparedImageAttachment {
  name: string;
  mimeType: string;
  /** Raw base64 image data (no data-URL prefix). */
  data: string;
  /** Data URL for the in-chat thumbnail preview. */
  previewUrl: string;
}

/** MIME types the tutor accepts. Matches the file picker's validation message. */
export const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

/** Hard cap on the *original* file a user may select (before compression). */
export const MAX_SOURCE_FILE_BYTES = 12 * 1024 * 1024; // 12 MB

/**
 * Cap on the prepared base64 payload. base64 inflates binary by ~4/3 and the
 * JSON envelope adds a little more, so 1.5 MB of base64 keeps the whole
 * request comfortably under the server's 2 MB chat-route limit.
 */
export const MAX_PREPARED_BASE64_CHARS = 1_500_000;

/** Largest rendered dimension for the first encoding pass. */
export const MAX_RENDER_DIMENSION = 1280;

/** Fallback render size if the first pass still exceeds the payload budget. */
export const FALLBACK_RENDER_DIMENSION = 1024;

export function validateImageFile(file: { type: string; size: number }): string | null {
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
    return "Please choose a JPEG, PNG, or WebP image of the homework problem.";
  }
  if (file.size > MAX_SOURCE_FILE_BYTES) {
    return "That image is larger than 12 MB. Please choose a smaller photo, or crop it closer to the problem.";
  }
  return null;
}

/**
 * Pick encoding quality for a render pass. Handwriting stays legible at these
 * settings; the two-pass structure only exists to honour the payload budget.
 */
export function encodingSettingsForPass(pass: 1 | 2): { dimension: number; quality: number } {
  return pass === 1
    ? { dimension: MAX_RENDER_DIMENSION, quality: 0.85 }
    : { dimension: FALLBACK_RENDER_DIMENSION, quality: 0.7 };
}

/** Split a data URL into raw base64 data + mime type. */
export function splitDataUrl(dataUrl: string): { data: string; mimeType: string } {
  const match = /^data:([^;]+);base64,(.*)$/s.exec(dataUrl);
  if (!match) {
    throw new Error("The image could not be processed by this browser. Please try a different photo.");
  }
  return { mimeType: match[1], data: match[2] };
}

function loadImageElement(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("That image file appears to be corrupted. Please take the photo again."));
    };
    img.src = objectUrl;
  });
}

function renderToDataUrl(img: HTMLImageElement, dimension: number, quality: number): string {
  const scale = Math.min(1, dimension / Math.max(img.naturalWidth, img.naturalHeight));
  const width = Math.max(1, Math.round(img.naturalWidth * scale));
  const height = Math.max(1, Math.round(img.naturalHeight * scale));
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("This browser cannot resize images. Please try a smaller photo.");
  }
  // Flatten transparency onto white so JPEG re-encoding stays clean.
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, width, height);
  ctx.drawImage(img, 0, 0, width, height);
  return canvas.toDataURL("image/jpeg", quality);
}

/**
 * Validate, downscale, and compress an image file into a chat-ready attachment.
 * Throws an Error whose message is safe to show directly to the learner.
 */
export async function prepareImageAttachment(file: File): Promise<PreparedImageAttachment> {
  const validationError = validateImageFile(file);
  if (validationError) {
    throw new Error(validationError);
  }

  const img = await loadImageElement(file);

  for (const pass of [1, 2] as const) {
    const { dimension, quality } = encodingSettingsForPass(pass);
    const dataUrl = renderToDataUrl(img, dimension, quality);
    const { data, mimeType } = splitDataUrl(dataUrl);
    if (data.length <= MAX_PREPARED_BASE64_CHARS || pass === 2) {
      return {
        name: file.name.replace(/\.[a-z0-9]+$/i, "") + ".jpg",
        mimeType,
        data,
        previewUrl: dataUrl,
      };
    }
  }

  // Unreachable (pass 2 always returns), kept for exhaustiveness.
  throw new Error("The image could not be prepared. Please try a different photo.");
}
