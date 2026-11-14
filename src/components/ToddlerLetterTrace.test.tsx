import { describe, expect, it } from "vitest";
import { LETTER_STROKE_COUNTS, strokesForLetter } from "../data/toddler/toddlerLetterStrokes";
import {
  advanceAlongStroke,
  isClosedStroke,
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
  const end = samples[samples.length - 1];
  return {
    along,
    total: samples.length,
    travel: pathLength(samples),
    pathLength: pathLength(samples),
    startedAtStart: true,
    endDistance: end ? Math.hypot(wobble, wobble) : Number.POSITIVE_INFINITY,
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

  it("still finishes a toddler wobble along the line, not a scribble", () => {
    const sample = walkStroke("A", 0, 3);
    expect(isStrokePathComplete(sample)).toBe(true);
    const scribble = walkStroke("A", 0, 40);
    expect(isStrokePathComplete(scribble)).toBe(false);
  });

  it("still finishes B when the finger is a little beside the end", () => {
    const sample = walkStroke("B", 1, 0);
    expect(isStrokePathComplete({ ...sample, endDistance: 5 })).toBe(true);
  });

  it("keeps progress on the pointer instead of jumping to the tip", () => {
    const samples = resampleStroke(strokesForLetter("B")[0]);
    const midIndex = Math.floor((samples.length - 1) * 0.5);
    const along = advanceAlongStroke(samples, midIndex, samples[midIndex], STROKE_HIT_RADIUS);
    expect(along).toBeLessThan(samples.length - 4);
    expect(strokeProgress(along, samples.length)).toBeLessThan(0.7);
  });

  it("does not finish until the finger is at the end of the line", () => {
    const stroke = strokesForLetter("B")[0];
    const samples = resampleStroke(stroke);
    const cutoff = Math.floor((samples.length - 1) * 0.85);
    let along = 0;
    for (const point of samples.slice(0, cutoff + 1)) {
      along = advanceAlongStroke(samples, along, point, STROKE_HIT_RADIUS);
    }
    const finger = samples[along] ?? samples[cutoff];
    const end = samples[samples.length - 1];
    expect(strokeProgress(along, samples.length)).toBeLessThan(STROKE_END);
    expect(
      isStrokePathComplete({
        along,
        total: samples.length,
        travel: pathLength(samples) * 0.85,
        pathLength: pathLength(samples),
        startedAtStart: true,
        endDistance: Math.hypot(finger.x - end.x, finger.y - end.y),
      }),
    ).toBe(false);
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
        endDistance: 40,
      }),
    ).toBe(false);
    expect(
      isStrokePathComplete({
        along: samples.length - 1,
        total: samples.length,
        travel: 4,
        pathLength: 80,
        startedAtStart: true,
        endDistance: 0,
      }),
    ).toBe(false);
    expect(
      isStrokePathComplete({
        along: samples.length - 1,
        total: samples.length,
        travel: 50,
        pathLength: 80,
        startedAtStart: false,
        endDistance: 0,
      }),
    ).toBe(false);
  });

  it("does not finish O just by sitting on the start, which is also the end", () => {
    const stroke = strokesForLetter("O")[0];
    expect(isClosedStroke(stroke)).toBe(true);
    const samples = resampleStroke(stroke);
    expect(
      isStrokePathComplete({
        along: 0,
        total: samples.length,
        travel: 0,
        pathLength: pathLength(samples),
        startedAtStart: true,
        endDistance: 0,
      }),
    ).toBe(false);
  });

  it("does not finish a line drawn the wrong way from the start", () => {
    const samples = resampleStroke(strokesForLetter("A")[0]);
    let along = 0;
    for (let i = 0; i < 8; i += 1) along = advanceAlongStroke(samples, along, samples[0], STROKE_HIT_RADIUS);
    expect(strokeProgress(along, samples.length)).toBeLessThan(0.2);
    const end = samples[samples.length - 1];
    expect(
      isStrokePathComplete({
        along,
        total: samples.length,
        travel: 20,
        pathLength: pathLength(samples),
        startedAtStart: true,
        endDistance: Math.hypot(samples[0].x - end.x, samples[0].y - end.y),
      }),
    ).toBe(false);
  });
});
