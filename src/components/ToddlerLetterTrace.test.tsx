import { describe, expect, it } from "vitest";
import {
  isTraceStrokeComplete,
  letterFromPrompt,
  pickTraceDeck,
  sampleLetterCoverage,
  TRACE_MIN_COVERAGE,
  TRACE_MIN_INK,
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

describe("letter trace completion", () => {
  it("does not finish a short scribble or a top-only stroke", () => {
    expect(
      isTraceStrokeComplete({
        coverage: 0.32,
        topCoverage: 0.9,
        bottomCoverage: 0.9,
        inkDistance: 90,
      }),
    ).toBe(false);
    expect(
      isTraceStrokeComplete({
        coverage: 0.8,
        topCoverage: 0.9,
        bottomCoverage: 0.05,
        inkDistance: 400,
      }),
    ).toBe(false);
    expect(
      isTraceStrokeComplete({
        coverage: TRACE_MIN_COVERAGE,
        topCoverage: 0.4,
        bottomCoverage: 0.4,
        inkDistance: TRACE_MIN_INK,
      }),
    ).toBe(true);
  });

  it("scores ink against the letter mask, not empty paper", () => {
    const width = 8;
    const height = 8;
    const mask = new Uint8ClampedArray(width * height * 4);
    const ink = new Uint8ClampedArray(width * height * 4);
    for (let y = 1; y <= 6; y += 1) {
      const i = (y * width + 3) * 4 + 3;
      mask[i] = 255;
      if (y <= 2) ink[i] = 255;
    }
    const sample = sampleLetterCoverage(mask, ink, width, height);
    expect(sample.coverage).toBeLessThan(0.5);
    expect(sample.topCoverage).toBeGreaterThan(0.5);
    expect(sample.bottomCoverage).toBeLessThan(0.3);
    expect(
      isTraceStrokeComplete({ ...sample, inkDistance: 400 }),
    ).toBe(false);
  });
});
