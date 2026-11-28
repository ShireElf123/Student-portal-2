import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { DESTINATION_ICON, HOME_ART } from "./toddlerArt";
import { TODDLER_SPACE_TABS } from "./toddlerSpaceTabs";

const root = path.resolve(__dirname, "../../..");

describe("Toddler Wonderland illustrated art", () => {
  it("ships painted home layers and the clay teddy mark", () => {
    for (const rel of Object.values(HOME_ART)) {
      expect(fs.existsSync(path.join(root, "public", rel.replace(/^\//, ""))), rel).toBe(true);
    }
  });

  it("gives the first five destinations matching clay icons", () => {
    expect(TODDLER_SPACE_TABS.map((tab) => tab.id).slice(0, 5)).toEqual([
      "worlds",
      "books",
      "games",
      "focus",
      "playhouse",
    ]);
    for (const id of ["worlds", "books", "games", "focus", "playhouse"] as const) {
      const rel = DESTINATION_ICON[id];
      expect(rel).toBeTruthy();
      expect(fs.existsSync(path.join(root, "public", rel!.replace(/^\//, ""))), rel).toBe(true);
    }
  });
});
