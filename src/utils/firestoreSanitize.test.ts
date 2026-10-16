import { describe, expect, it } from "vitest";
import { sanitizeFirestoreValue } from "./firestoreSanitize";

describe("sanitizeFirestoreValue", () => {
  it("removes undefined object properties at every nesting level", () => {
    expect(sanitizeFirestoreValue({
      learnerId: "learner-1",
      optional: undefined,
      mastery: { masteredTimestamp: undefined, tier: "novice" },
      recentEvents: [{ score: 100, metadata: { optional: undefined } }],
    })).toEqual({
      learnerId: "learner-1",
      mastery: { tier: "novice" },
      recentEvents: [{ score: 100, metadata: {} }],
    });
  });

  it("preserves array positions by converting undefined entries to null", () => {
    expect(sanitizeFirestoreValue([1, undefined, { optional: undefined }])).toEqual([1, null, {}]);
  });

  it("preserves dates and other non-plain objects", () => {
    const date = new Date("2026-01-01T00:00:00.000Z");
    expect(sanitizeFirestoreValue({ date }).date).toBe(date);
  });

  it("leaves ordinary defined values unchanged", () => {
    expect(sanitizeFirestoreValue({ score: 0, enabled: false, note: null })).toEqual({
      score: 0,
      enabled: false,
      note: null,
    });
  });
});
