/**
 * Unit tests for the pure parts of the homework-image preparation pipeline.
 *
 * The canvas resize/encode path needs a DOM and is exercised manually /
 * via E2E (see audit notes); these tests cover the validation and encoding
 * policy that guard it.
 */
import { describe, expect, it } from "vitest";
import {
  ACCEPTED_IMAGE_TYPES,
  MAX_PREPARED_BASE64_CHARS,
  encodingSettingsForPass,
  splitDataUrl,
  validateImageFile,
} from "./imageAttachment";

describe("validateImageFile", () => {
  it("accepts JPEG, PNG, and WebP homework photos", () => {
    for (const type of ACCEPTED_IMAGE_TYPES) {
      expect(validateImageFile({ type, size: 1024 })).toBeNull();
    }
  });

  it("rejects unsupported types with a learner-friendly message", () => {
    const error = validateImageFile({ type: "image/gif", size: 1024 });
    expect(error).toMatch(/JPEG, PNG, or WebP/);
  });

  it("rejects non-image files", () => {
    expect(validateImageFile({ type: "application/pdf", size: 1024 })).toBeTruthy();
  });

  it("rejects source files above 12 MB", () => {
    const error = validateImageFile({ type: "image/jpeg", size: 13 * 1024 * 1024 });
    expect(error).toMatch(/12 MB/);
  });

  it("accepts files up to the 12 MB source cap", () => {
    expect(validateImageFile({ type: "image/png", size: 12 * 1024 * 1024 })).toBeNull();
  });
});

describe("encodingSettingsForPass", () => {
  it("first pass renders at 1280px / quality 0.85 (legible homework detail)", () => {
    expect(encodingSettingsForPass(1)).toEqual({ dimension: 1280, quality: 0.85 });
  });

  it("fallback pass shrinks further to stay inside the upload budget", () => {
    const fallback = encodingSettingsForPass(2);
    expect(fallback.dimension).toBeLessThan(1280);
    expect(fallback.quality).toBeLessThan(0.85);
  });
});

describe("splitDataUrl", () => {
  it("extracts mime type and raw base64 data", () => {
    const { data, mimeType } = splitDataUrl("data:image/jpeg;base64,QUJD");
    expect(mimeType).toBe("image/jpeg");
    expect(data).toBe("QUJD");
  });

  it("throws a friendly error on malformed data URLs", () => {
    expect(() => splitDataUrl("not-a-data-url")).toThrow(/could not be processed/);
  });
});

describe("server budget alignment", () => {
  it("the prepared-payload cap fits the server's 2 MB chat-route limit with base64 expansion accounted for", () => {
    // 1.5M base64 chars + JSON envelope stays well under 2 MB total.
    expect(MAX_PREPARED_BASE64_CHARS + 100_000).toBeLessThan(2_000_000);
  });
});
