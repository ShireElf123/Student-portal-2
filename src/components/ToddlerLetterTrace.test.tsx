import { describe, expect, it } from "vitest";
import { LETTER_STROKE_COUNTS, strokesForLetter } from "../data/toddler/toddlerLetterStrokes";
import {
  advanceAlongStroke,
  isStrokePathComplete,
  letterFromPrompt,
  pathLength,
  pickTraceDeck,
  resampleStroke,
  STROKE_END,
  STROKE_HIT_RADIUS,
  strokeProgress,
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

function walkStroke(letter: string, strokeIndex: number, wobble = 0) {
  const stroke = strokesForLetter(letter)[strokeIndex];
  const samples = resampleStroke(stroke);
  let along = 0;
  for (const point of samples) {
    along = advanceAlongStroke(samples, along, { x: point.x + wobble, y: point.y + wobble }, STROKE_HIT_RADIUS);
  }
  return {
    along,
    total: samples.length,
    travel: pathLength(samples),
    pathLength: pathLength(samples),
    startedAtStart: true,
    progress: strokeProgress(along, samples.length),
  };
}

describe("letter strokes", () => {
  it("uses one writing line at a time for every capital", () => {
    for (const letter of Object.keys(LETTER_STROKE_COUNTS)) {
      expect(strokesForLetter(letter), letter).toHaveLength(LETTER_STROKE_COUNTS[letter]);
    }
    expect(strokesForLetter("B")).toHaveLength(3);
    expect(strokesForLetter("W")).toHaveLength(1);
  });
});

describe("letter trace completion", () => {
  it("finishes every letter stroke after one pass along that line", () => {
    for (const letter of Object.keys(LETTER_STROKE_COUNTS)) {
      const strokes = strokesForLetter(letter);
      strokes.forEach((_, strokeIndex) => {
        const sample = walkStroke(letter, strokeIndex);
        expect(sample.progress, `${letter} line ${strokeIndex + 1}`).toBeGreaterThanOrEqual(STROKE_END);
        expect(isStrokePathComplete(sample), `${letter} line ${strokeIndex + 1}`).toBe(true);
      });
    }
  });

  it("still finishes B when the finger is a little beside the line", () => {
    const sample = walkStroke("B", 1, 8);
    expect(isStrokePathComplete(sample)).toBe(true);
  });

  it("does not finish a scribble off the line or a tap with no travel", () => {
    const stroke = strokesForLetter("B")[1];
    const samples = resampleStroke(stroke);
    let along = 0;
    along = advanceAlongStroke(samples, along, { x: 90, y: 20 }, STROKE_HIT_RADIUS);
    expect(
      isStrokePathComplete({
        along,
        total: samples.length,
        travel: 4,
        pathLength: pathLength(samples),
        startedAtStart: true,
      }),
    ).toBe(false);
    expect(
      isStrokePathComplete({
        along: samples.length - 1,
        total: samples.length,
        travel: 4,
        pathLength: 80,
        startedAtStart: true,
      }),
    ).toBe(false);
    expect(
      isStrokePathComplete({
        along: samples.length - 1,
        total: samples.length,
        travel: 50,
        pathLength: 80,
        startedAtStart: false,
      }),
    ).toBe(false);
  });
});
