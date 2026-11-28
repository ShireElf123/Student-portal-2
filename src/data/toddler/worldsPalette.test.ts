import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { TODDLER_DESTINATION_SHELL } from "./toddlerSpaceTabs";
import { ATLAS_CONTINENTS } from "./toddlerWorldAtlasLayout";

const root = path.resolve(__dirname, "../../..");

describe("Worlds meadow palette", () => {
  it("uses sky-to-meadow chrome instead of banana yellow plates", () => {
    const css = fs.readFileSync(path.join(root, "src/index.css"), "utf8");
    const worlds = css.slice(css.indexOf(".wonder-place-worlds"), css.indexOf(".wonder-place-books"));
    expect(worlds).toContain("#bae6fd");
    expect(worlds).toContain("#bbf7d0");
    expect(worlds).not.toContain("#fde68a");
    expect(worlds).not.toContain("253, 224, 71");
    expect(TODDLER_DESTINATION_SHELL.worlds.barClass).toContain("from-sky-300");
    expect(TODDLER_DESTINATION_SHELL.worlds.barClass).not.toContain("amber");
  });

  it("keeps Busy Town warm without a lemon continent band", () => {
    const town = ATLAS_CONTINENTS.find((continent) => continent.id === "town");
    expect(town?.band).not.toMatch(/amber|yellow/);
    expect(town?.band).toContain("sky");
  });

  it("does not restyle the Games or Playhouse destination meadows", () => {
    const css = fs.readFileSync(path.join(root, "src/index.css"), "utf8");
    expect(css).toContain(".wonder-place-games");
    expect(css).toContain(".wonder-place-playhouse");
    expect(css).toContain(".play-theme-safari");
  });
});
