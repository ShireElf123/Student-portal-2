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
});
