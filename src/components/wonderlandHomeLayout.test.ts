import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { TODDLER_SPACE_TABS } from "../data/toddler/toddlerSpaceTabs";

const root = path.resolve(__dirname, "../..");

describe("Toddler Wonderland home composition", () => {
  const view = fs.readFileSync(path.join(root, "src/components/ToddlerWorldView.tsx"), "utf8");
  const nav = fs.readFileSync(path.join(root, "src/components/ToddlerSpaceNav.tsx"), "utf8");
  const css = fs.readFileSync(path.join(root, "src/index.css"), "utf8");

  it("keeps the eight-category launcher in two rows of four on phones", () => {
    expect(TODDLER_SPACE_TABS.map((tab) => tab.label)).toEqual([
      "Worlds",
      "Stories",
      "Games",
      "Focus",
      "Playhouse",
      "Phonics",
      "Counting",
      "My Buddy",
    ]);
    expect(nav).toContain("grid-cols-4 lg:grid-cols-8");
    expect(nav).toContain('data-testid="toddler-space-nav"');
    expect(nav).toContain("DESTINATION_ICON");
    expect(nav).toContain("wonder-launch-icon");
    expect(view).toContain("HOME_ART.teddy");
    expect(css).toContain(".wonder-home-sky");
    expect(css).toContain(".wonder-home-meadow");
    expect(css).toContain("/art/places/worlds.jpg");
    expect(css).toContain("/art/places/phonics.jpg");
    expect(css).not.toContain("/art/places/playhouse");
    expect(nav).not.toMatch(/games-dock|Games dock|worlds tabs/i);
  });

  it("groups rewards in a treasure tray and utilities in a dedicated rail", () => {
    expect(css).toContain(".wonder-treasure-tray");
    expect(css).toContain(".wonder-clay");
    expect(css).toContain(".wonder-brand-title");
    expect(css).toContain(".wonder-companion-band");
    expect(css).toContain(".play-board");
    expect(css).toContain(".play-theme-safari");
    expect(css).toContain(".play-theme-quiz");
    expect(css).toContain(".dest-buddy");
    expect(css).toContain(".world-hub-titleplate");
    expect(css).toContain(".wonder-home-teddy");
    expect(view).toContain('data-testid="wonder-treasure-tray"');
    expect(view).toContain('data-testid="wonder-companion-band"');
    expect(view).toContain('data-testid="wonder-utility-rail"');
    expect(view).toContain('data-testid="wonder-buddy-stage"');
    expect(view).toContain('data-testid="hud-champion-chip"');
    expect(view).toContain('data-testid="hud-star-count"');
    expect(view).toContain('data-testid="hud-sticker-count"');
    expect(view).toContain("wonder-brand-title");
  });

  it("keeps star digits on .count-num and does not hide rewards", () => {
    expect(view).toMatch(/className="count-num"[^>]*>\{starsCount\}/);
    expect(view).toMatch(/hud-sticker-count"[\s\S]{0,80}\{unlockedStickersCount\}\/\{TODDLER_STICKERS\.length\}/);
    expect(view).toContain("Star jar");
    expect(view).toContain("Stickers");
    expect(view).toContain("Quests");
    expect(view).toContain("{currentRank.title}");
  });
});
