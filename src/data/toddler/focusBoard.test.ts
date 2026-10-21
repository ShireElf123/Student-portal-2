import { describe, expect, it } from "vitest";
import {
  BODY_CHECKS,
  BREATH_ROUNDS,
  HEAVY_ROUNDS,
  LOOK_ROUNDS,
  MOVE_ROUNDS,
  QUIET_ROUNDS,
} from "./focusBoard";

describe("focus board", () => {
  it("keeps a full body-check, not a three-beat demo", () => {
    expect(BODY_CHECKS.map((item) => item.id)).toEqual(["zoomies", "wiggles", "loud", "floppy", "ready"]);
    expect(new Set(BODY_CHECKS.map((item) => item.suggest)).size).toBeGreaterThanOrEqual(4);
  });

  it("schedules short finite move, heavy work, breathe, look, and quiet rounds", () => {
    expect(MOVE_ROUNDS.length).toBeGreaterThanOrEqual(8);
    expect(HEAVY_ROUNDS.length).toBeGreaterThanOrEqual(8);
    expect(BREATH_ROUNDS.length).toBeGreaterThanOrEqual(8);
    expect(LOOK_ROUNDS.length).toBeGreaterThanOrEqual(8);
    expect(QUIET_ROUNDS.length).toBeGreaterThanOrEqual(8);
    expect(MOVE_ROUNDS.every((round) => round.seconds >= 12 && round.seconds <= 30)).toBe(true);
    expect(HEAVY_ROUNDS.every((round) => round.seconds >= 12 && round.seconds <= 30)).toBe(true);
    expect(QUIET_ROUNDS.every((round) => round.seconds >= 20 && round.seconds <= 45)).toBe(true);
    expect(MOVE_ROUNDS.some((round) => round.kind === "cardio")).toBe(true);
    expect(MOVE_ROUNDS.some((round) => round.kind === "stretch")).toBe(true);
  });
});
