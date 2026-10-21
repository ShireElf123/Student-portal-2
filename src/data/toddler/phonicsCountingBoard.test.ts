import { describe, expect, it } from "vitest";
import { COUNTING_CARDS, MAKE_TEN_ROUNDS, MORE_LESS_ROUNDS, PATTERN_ROUNDS, SHAPE_ROUNDS, SUBITIZE_ROUNDS } from "./countingBoard";
import { BLEND_WORDS, PHONICS_TILES, SIGHT_WORDS, SOUND_HUNTS, WORD_FAMILIES } from "./phonicsBoard";

describe("phonics and counting boards", () => {
  it("keeps twenty-six unique letters with three neighborhood words each", () => {
    const letters = PHONICS_TILES.map((tile) => tile.letter);
    expect(letters.join("")).toBe("ABCDEFGHIJKLMNOPQRSTUVWXYZ");
    expect(new Set(letters).size).toBe(26);
    expect(PHONICS_TILES.every((tile) => tile.examples.length === 3)).toBe(true);
  });

  it("keeps sixteen word families with three spoken words each", () => {
    expect(WORD_FAMILIES.length).toBeGreaterThanOrEqual(16);
    expect(new Set(WORD_FAMILIES.map((family) => family.rime)).size).toBe(WORD_FAMILIES.length);
    expect(WORD_FAMILIES.every((family) => family.words.length === 3)).toBe(true);
  });

  it("counts one through twenty on ten-frames, not a single emoji for teens", () => {
    const nums = COUNTING_CARDS.map((card) => card.num);
    expect(nums).toEqual(Array.from({ length: 20 }, (_, index) => index + 1));
    expect(COUNTING_CARDS.every((card) => card.scene.length > 8)).toBe(true);
  });

  it("adds first-sound hunts, CVC blends, more/less, make-ten, peek, and stoop shapes", () => {
    expect(SOUND_HUNTS.length).toBeGreaterThanOrEqual(16);
    expect(BLEND_WORDS.every((word) => word.letters.length === 3)).toBe(true);
    expect(MORE_LESS_ROUNDS.length).toBeGreaterThanOrEqual(8);
    expect(MAKE_TEN_ROUNDS.every((round) => round.have >= 1 && round.have < 10)).toBe(true);
    expect(SUBITIZE_ROUNDS.every((round) => round.n >= 1 && round.n <= 5)).toBe(true);
    expect(SHAPE_ROUNDS.every((round) => round.options.includes(round.name))).toBe(true);
  });

  it("adds stoop sight words and what-comes-next patterns", () => {
    expect(SIGHT_WORDS.length).toBeGreaterThanOrEqual(12);
    expect(SIGHT_WORDS.every((round) => round.sentence.toLowerCase().includes(round.word.toLowerCase()))).toBe(true);
    expect(PATTERN_ROUNDS.length).toBeGreaterThanOrEqual(8);
    expect(PATTERN_ROUNDS.every((round) => round.options.includes(round.answer))).toBe(true);
  });
});
