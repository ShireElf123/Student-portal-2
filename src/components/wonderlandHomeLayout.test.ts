import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { TODDLER_SPACE_TABS } from "../data/toddler/toddlerSpaceTabs";

const root = path.resolve(__dirname, "../..");

describe("Toddler Wonderland home composition", () => {
  const view = fs.readFileSync(path.join(root, "src/components/ToddlerWorldView.tsx"), "utf8");
  const nav = fs.readFileSync(path.join(root, "src/components/ToddlerSpaceNav.tsx"), "utf8");
  const css = fs.readFileSync(path.join(root, "src/index.css"), "utf8");

  it("keeps eight scattered toys on the meadow", () => {
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
    expect(nav).toContain('data-testid="toddler-space-nav"');
    expect(nav).toContain("DESTINATION_ICON");
    expect(nav).toContain("wonder-launch-icon--hero");
    expect(nav).toContain("wonder-picture-card");
    expect(nav).toContain("flex flex-col");
    expect(nav).not.toContain("speakText");
    expect(nav).not.toContain("is-named");
    expect(nav).toContain("is-opening");
    expect(css).toContain("wonderToyOpen");
    expect(css).toContain("border: 4px solid #fde68a");
    expect(css).toContain(".wonder-place-mark");
    expect(css).toContain(".wonder-home-stage");
    expect(css).toContain(".wonder-launcher--playroom");
    expect(css).toContain("--toy-rot");
    expect(css).toContain(".wonder-launch-icon--hero");
    expect(css).toContain("data-wonder-orientation");
    expect(css).toContain("data-wonder-frame");
    expect(css).toContain("grid-template-columns: repeat(4");
    expect(css).toContain("repeat(8");
    expect(view).toContain("data-wonder-frame");
    expect(view).toContain("wonder-home-chrome");
    expect(view).not.toContain("sm:flex-row sm:items-center sm:justify-between");
    expect(view).toContain("HOME_ART.teddy");
    expect(view).toContain("HOME_ART.tree");
    expect(view).toContain("HOME_ART.butterfly");
    expect(view).toContain("min-h-dvh");
    expect(css).toContain(".wonder-home-sky");
    expect(css).toContain(".wonder-home-meadow");
    expect(css).toContain("100dvh");
    expect(css).toContain("rotate: var(--toy-rot");
    expect(css).toContain("/art/places/worlds.jpg");
    expect(css).toContain("/art/places/phonics.jpg");
    expect(css).toContain("/art/places/playhouse.jpg");
    expect(nav).not.toMatch(/games-dock|Games dock|worlds tabs/i);
    const app = fs.readFileSync(path.join(root, "src/App.tsx"), "utf8");
    expect(app).toContain("wonderland_boot_v1");
    expect(app).toContain("h-dvh");
    expect(app).toContain('return "toddler"');
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
    expect(view).toContain("wonder-home-playroom");
    expect(view).toContain("wonder-home-stage");
    expect(view).toContain('data-testid="wonder-home-tip"');
    expect(view.indexOf("wonder-home-playroom")).toBeLessThan(view.indexOf('data-testid="wonder-companion-band"'));
    expect(view.indexOf("wonder-home-playroom")).toBeLessThan(view.indexOf("HOME_ART.tree"));
    expect(view).not.toContain("flex-1 flex items-end");
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
