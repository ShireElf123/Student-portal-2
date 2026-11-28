import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { DESTINATION_ICON, HOME_ART, PLACE_ART } from "./toddlerArt";
import { TODDLER_SPACE_TABS } from "./toddlerSpaceTabs";

const root = path.resolve(__dirname, "../../..");

function publicPath(rel: string) {
  return path.join(root, "public", rel.replace(/^\//, ""));
}

describe("Toddler Wonderland illustrated art", () => {
  it("ships painted home layers and the clay teddy mark", () => {
    for (const rel of Object.values(HOME_ART)) {
      expect(fs.existsSync(publicPath(rel)), rel).toBe(true);
    }
  });

  it("gives every launcher destination a matching clay icon file", () => {
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
    for (const tab of TODDLER_SPACE_TABS) {
      const rel = DESTINATION_ICON[tab.id];
      expect(rel, tab.id).toBeTruthy();
      expect(fs.existsSync(publicPath(rel!)), rel).toBe(true);
    }
  });

  it("paints every destination shell, including Playhouse", () => {
    for (const tab of TODDLER_SPACE_TABS) {
      const rel = PLACE_ART[tab.id];
      expect(rel, tab.id).toBeTruthy();
      expect(fs.existsSync(publicPath(rel!)), rel).toBe(true);
    }
  });
});
