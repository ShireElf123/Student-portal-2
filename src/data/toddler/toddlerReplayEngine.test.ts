import { describe, expect, it } from "vitest";
import { countingBand, countingLevelForPlace, generateCountingScenario } from "./toddlerReplayEngine";

describe("counting growth bands", () => {
  it("keeps the first road at 1–5, then 6–10, then 11–20", () => {
    expect(countingBand(countingLevelForPlace(0, 1))).toEqual({ min: 1, max: 5, label: "1 to 5" });
    expect(countingBand(countingLevelForPlace(1, 1))).toEqual({ min: 6, max: 10, label: "6 to 10" });
    expect(countingBand(countingLevelForPlace(2, 1))).toEqual({ min: 11, max: 20, label: "11 to 20" });
    expect(countingLevelForPlace(0, 3)).toBe(3);
  });

  it("never rolls a demo-sized 1–5 group on a later land", () => {
    for (let i = 0; i < 20; i++) {
      const mid = generateCountingScenario(2);
      expect(mid.targetCount).toBeGreaterThanOrEqual(6);
      expect(mid.targetCount).toBeLessThanOrEqual(10);
      const deep = generateCountingScenario(3);
      expect(deep.targetCount).toBeGreaterThanOrEqual(11);
      expect(deep.targetCount).toBeLessThanOrEqual(20);
    }
  });
});
