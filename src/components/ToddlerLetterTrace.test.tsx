import { describe, expect, it } from "vitest";
import { strokesForLetter } from "../data/toddler/toddlerLetterStrokes";
import {
  isStrokePathComplete,
  letterFromPrompt,
  markStrokeHits,
  pathLength,
  pickTraceDeck,
  resampleStroke,
  STROKE_COMPLETE,
  STROKE_HIT_RADIUS,
  strokeCoverage,
} from "./ToddlerLetterTrace";

describe("letter trace deck", () => {
  it("locks a land prompt to the named letter instead of a six-letter skip deck", () => {
    const deck = pickTraceDeck(
      [
        { letter: "B", word: "Bear", emoji: "🐻", sound: "B!" },
        { letter: "P", word: "Puppet", emoji: "🎭", sound: "P!" },
        { letter: "S", word: "Sun", emoji: "☀️", sound: "S!" },
      ],
      { prompt: "Trace P for Puppet." },
    );
    expect(letterFromPrompt("Trace P for Puppet.")).toBe("P");
    expect(deck).toEqual([{ letter: "P", word: "Puppet", emoji: "🎭", sound: "P!" }]);
  });

  it("keeps a short lane of unique letters when there is no named letter", () => {
    const deck = pickTraceDeck([
      { letter: "A", word: "Apple", emoji: "🍎", sound: "A!" },
      { letter: "A", word: "Ant", emoji: "🐜", sound: "A!" },
      { letter: "B", word: "Bus", emoji: "🚌", sound: "B!" },
      { letter: "S", word: "Sun", emoji: "☀️", sound: "S!" },
    ]);
    expect(deck.map((item) => item.letter)).toEqual(["A", "B", "S"]);
  });
});

describe("letter strokes", () => {
  it("gives A three writing lines and S one", () => {
    expect(strokesForLetter("A")).toHaveLength(3);
    expect(strokesForLetter("S")).toHaveLength(1);
    expect(strokesForLetter("T")).toHaveLength(2);
  });
});

describe("letter trace completion", () => {
  it("finishes after one pass along the line", () => {
    const stroke = strokesForLetter("A")[0];
    const samples = resampleStroke(stroke);
    const hits = samples.map(() => false);
    for (const point of samples) markStrokeHits(samples, hits, point, STROKE_HIT_RADIUS);
    const coverage = strokeCoverage(hits);
    expect(coverage).toBeGreaterThanOrEqual(STROKE_COMPLETE);
    expect(
      isStrokePathComplete({
        coverage,
        travel: pathLength(samples),
        pathLength: pathLength(samples),
        startedAtStart: true,
      }),
    ).toBe(true);
  });

  it("does not finish a scribble off the line or a tap with no travel", () => {
    const stroke = strokesForLetter("A")[0];
    const samples = resampleStroke(stroke);
    const hits = samples.map(() => false);
    markStrokeHits(samples, hits, { x: 90, y: 20 }, STROKE_HIT_RADIUS);
    expect(
      isStrokePathComplete({
        coverage: strokeCoverage(hits),
        travel: 4,
        pathLength: pathLength(samples),
        startedAtStart: true,
      }),
    ).toBe(false);
    expect(
      isStrokePathComplete({
        coverage: 0.95,
        travel: 4,
        pathLength: 80,
        startedAtStart: true,
      }),
    ).toBe(false);
    expect(
      isStrokePathComplete({
        coverage: 0.95,
        travel: 50,
        pathLength: 80,
        startedAtStart: false,
      }),
    ).toBe(false);
  });
});
