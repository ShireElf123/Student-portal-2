import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const root = path.resolve(__dirname, "../..");

describe("Phase 2 destination polish", () => {
  it("puts quiz, shapes, bubbles, and bunny on cream play boards", () => {
    const games = fs.readFileSync(path.join(root, "src/components/ToddlerQuizzesAndGames.tsx"), "utf8");
    expect(games).toContain('data-testid="play-board-quiz"');
    expect(games).toContain('data-testid="play-board-shapes"');
    expect(games).toContain('data-testid="play-board-bubbles"');
    expect(games).toContain('data-testid="play-board-bunny"');
    expect(games).not.toContain("bg-[#141524]");
    expect(games).not.toContain("bg-[#151326]");
    expect(games).not.toContain("bg-[#121320]");
    expect(games).not.toContain("bg-[#131722]");
  });

  it("keeps My Buddy as a paper studio, not a dark generator", () => {
    const buddy = fs.readFileSync(path.join(root, "src/components/BuddyAvatarStudio.tsx"), "utf8");
    expect(buddy).toContain('data-testid="buddy-studio"');
    expect(buddy).toContain("dest-buddy");
    expect(buddy).not.toContain("bg-[#14121f]");
    expect(buddy).toContain("ARCHETYPES");
    expect(buddy).toContain("handleSaveBuddy");
  });

  it("reads world hub titles on a paper plate over the cover", () => {
    const worlds = fs.readFileSync(path.join(root, "src/components/ToddlerWorldsNavigator.tsx"), "utf8");
    expect(worlds).toContain("world-hub-titleplate");
    expect(worlds).toContain("world-hub-scrim");
    expect(worlds).not.toContain("bg-slate-950/28");
  });
});
