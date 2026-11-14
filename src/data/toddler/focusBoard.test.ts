import { describe, expect, it } from "vitest";
import {
  BODY_CHECKS,
  BREATH_ROUNDS,
  FREEZE_ROUNDS,
  HEAVY_ROUNDS,
  LOOK_ROUNDS,
  MOVE_ROUNDS,
  QUIET_ROUNDS,
} from "./focusBoard";
import { resamplePath, STEADY_TRACKS, stepSteadyLane } from "./focusSteady";

describe("focus board", () => {
  it("routes wiggly bodies to the slow path, not a timer demo", () => {
    expect(BODY_CHECKS.find((item) => item.id === "wiggles")?.suggest).toBe("slow");
    expect(new Set(BODY_CHECKS.map((item) => item.suggest)).size).toBeGreaterThanOrEqual(4);
  });

  it("keeps full decks for move, push, freeze, breathe, look, quiet", () => {
    expect(MOVE_ROUNDS.length).toBeGreaterThanOrEqual(10);
    expect(HEAVY_ROUNDS.length).toBeGreaterThanOrEqual(8);
    expect(FREEZE_ROUNDS.length).toBeGreaterThanOrEqual(8);
    expect(BREATH_ROUNDS.length).toBeGreaterThanOrEqual(8);
    expect(LOOK_ROUNDS.length).toBeGreaterThanOrEqual(8);
    expect(QUIET_ROUNDS.length).toBeGreaterThanOrEqual(8);
    expect(MOVE_ROUNDS.every((round) => round.taps >= 4)).toBe(true);
    expect(HEAVY_ROUNDS.every((round) => round.hold >= 5)).toBe(true);
    expect(LOOK_ROUNDS.every((round) => round.field.filter((cell) => cell.hit).length >= round.need)).toBe(true);
  });
});

describe("steady gold lane", () => {
  const line = resamplePath([
    { x: 0, y: 50 },
    { x: 100, y: 50 },
  ]);

  it("offers many unique paths with a finite gold lane", () => {
    expect(STEADY_TRACKS.length).toBeGreaterThanOrEqual(12);
    expect(new Set(STEADY_TRACKS.map((track) => track.id)).size).toBe(STEADY_TRACKS.length);
    expect(STEADY_TRACKS.every((track) => track.points.length >= 5 && track.lane >= 6 && track.lane <= 16)).toBe(true);
  });

  it("buzzes off the red edge, buzzes if you skip, and wins at the star", () => {
    const start = stepSteadyLane({
      samples: line,
      along: 0,
      finger: { x: 0, y: 50 },
      started: false,
      lane: 10,
      lookahead: 8,
      lastFinger: null,
      dtMs: 16,
      maxSpeed: 0.25,
    });
    expect(start.result).toBe("ok");

    const off = stepSteadyLane({
      samples: line,
      along: 4,
      finger: { x: 8, y: 90 },
      started: true,
      lane: 10,
      lookahead: 8,
      lastFinger: null,
      dtMs: 16,
      maxSpeed: 0.25,
    });
    expect(off.result).toBe("off");

    const skip = stepSteadyLane({
      samples: line,
      along: 0,
      finger: { x: 90, y: 50 },
      started: true,
      lane: 12,
      lookahead: 8,
      lastFinger: { x: 0, y: 50 },
      dtMs: 80,
      maxSpeed: 2,
    });
    expect(skip.result).toBe("skip");

    const fast = stepSteadyLane({
      samples: line,
      along: 4,
      finger: { x: 20, y: 50 },
      started: true,
      lane: 12,
      lookahead: 20,
      lastFinger: { x: 0, y: 50 },
      dtMs: 16,
      maxSpeed: 0.2,
    });
    expect(fast.result).toBe("fast");

    const win = stepSteadyLane({
      samples: line,
      along: line.length - 4,
      finger: { x: 100, y: 50 },
      started: true,
      lane: 12,
      lookahead: 8,
      lastFinger: { x: 96, y: 50 },
      dtMs: 40,
      maxSpeed: 0.3,
    });
    expect(win.result).toBe("win");
  });
});
