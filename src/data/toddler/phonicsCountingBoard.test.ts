import { describe, expect, it } from "vitest";
import { COUNTING_CARDS } from "./countingBoard";
import { PHONICS_TILES, WORD_FAMILIES } from "./phonicsBoard";

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
});
