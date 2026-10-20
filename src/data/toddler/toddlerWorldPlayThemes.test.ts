import { describe, expect, it } from "vitest";
import { DEFAULT_SAFARI_FRIENDS, getWorldPlayTheme } from "./toddlerWorldPlayThemes";

describe("world play themes", () => {
  it("keeps the games-hub safari on savanna friends", () => {
    expect(DEFAULT_SAFARI_FRIENDS.map((friend) => friend.soundText)).toEqual(
      expect.arrayContaining(["ROAAAR!", "MOOO MOOO!"])
    );
  });

  it("puts ice neighbours on the floe, not lions", () => {
    const theme = getWorldPlayTheme("arctic-world", "ice-floe");
    const emojis = theme.safari.map((friend) => friend.emoji);
    expect(emojis).toContain("🐧");
    expect(emojis).not.toContain("🦁");
    expect(theme.safariTitle).toBe("Floe Safari");
    expect(theme.memory.some((pair) => pair.emoji === "❄️" || pair.emoji === "🐧")).toBe(true);
  });

  it("gives kitchen memory food, not savanna cats", () => {
    const theme = getWorldPlayTheme("kitchen-world", "bakery-shelf");
    expect(theme.memory.map((pair) => pair.emoji)).toEqual(
      expect.arrayContaining(["🍞", "🍎"])
    );
  });

  it("rhymes and bubbles follow the land", () => {
    const kitchen = getWorldPlayTheme("kitchen-world", "soup-pot");
    expect(kitchen.rhymes.some((item) => item.targetWord === "Pot")).toBe(true);
    expect(kitchen.bubbles.some((item) => item.word === "Soup")).toBe(true);
    const ice = getWorldPlayTheme("arctic-world", "seal-shore");
    expect(ice.bubbles.some((item) => item.emoji === "🐧")).toBe(true);
  });

  it("does not fall back to cat/hat on bug or farm lands", () => {
    const bugs = getWorldPlayTheme("bug-world", "pond-edge");
    expect(bugs.rhymes.some((item) => item.targetWord === "Snail")).toBe(true);
    expect(bugs.bubbles.some((item) => item.word === "Bee")).toBe(true);
    const farm = getWorldPlayTheme("animal-world", "farm-valley");
    expect(farm.rhymes.some((item) => item.targetWord === "Pig")).toBe(true);
    expect(farm.bubbles.some((item) => item.word === "Cow")).toBe(true);
  });

  it("gives kitchen count, mix, songs, and sorting their own deck", () => {
    const kitchen = getWorldPlayTheme("kitchen-world", "bakery-shelf");
    expect(kitchen.counting.map((item) => item.emoji)).toEqual(expect.arrayContaining(["🍎", "🍞"]));
    expect(kitchen.mix.orange.emoji).toBe("🥕");
    expect(kitchen.sorting.title).toMatch(/Fruit/);
    const vehicles = getWorldPlayTheme("vehicle-world", "high-street");
    expect(vehicles.songIds).toContain("wheels");
    expect(vehicles.songIds).not.toContain("old-mac");
  });
});
