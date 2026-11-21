import { describe, expect, it } from "vitest";
import { TODDLER_SPACE_MOBILE_FIRST_ROW, TODDLER_SPACE_TABS } from "./toddlerSpaceTabs";

describe("toddler space tabs", () => {
  it("keeps all eight destinations", () => {
    expect(TODDLER_SPACE_TABS.map((tab) => tab.id)).toEqual([
      "worlds",
      "books",
      "games",
      "focus",
      "playhouse",
      "phonics",
      "counting",
      "avatar-studio",
    ]);
    expect(new Set(TODDLER_SPACE_TABS.map((tab) => tab.label)).size).toBe(8);
  });

  it("puts Worlds, Stories, Games, and Focus on the phone first row", () => {
    expect(TODDLER_SPACE_MOBILE_FIRST_ROW).toEqual(["worlds", "books", "games", "focus"]);
    expect(TODDLER_SPACE_TABS.slice(0, 4).map((tab) => tab.label)).toEqual(["Worlds", "Stories", "Games", "Focus"]);
  });
});
