import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const root = path.resolve(__dirname, "../..");

describe("multi-digit counter spacing", () => {
  it("defines a shared count-num style that tightens digits only", () => {
    const css = fs.readFileSync(path.join(root, "src/index.css"), "utf8");
    expect(css).toMatch(/\.count-num\s*\{[^}]*letter-spacing:\s*-0\.06em/s);
    expect(css).toMatch(/\.count-num\s*\{[^}]*font-variant-numeric:\s*lining-nums tabular-nums/s);
  });

  it("wraps Learning Champion star and sticker figures without inserting digit spaces", () => {
    const view = fs.readFileSync(path.join(root, "src/components/ToddlerWorldView.tsx"), "utf8");
    expect(view).toContain('data-testid="hud-star-count"');
    expect(view).toContain('data-testid="hud-sticker-count"');
    expect(view).toMatch(/className="count-num"[^>]*>\{starsCount\}/);
    const counting = fs.readFileSync(path.join(root, "src/components/ToddlerCountingBoard.tsx"), "utf8");
    expect(counting).toMatch(/count-num">\{n\}/);
    expect(counting).toMatch(/count-num">\{item\.num\}/);
    expect(view).toMatch(/hud-sticker-count"[\s\S]{0,80}\{unlockedStickersCount\}\/\{TODDLER_STICKERS\.length\}/);
    expect(view).not.toMatch(/\{starsCount\.toString\(\)\.split/);
    expect(view).not.toMatch(/\{String\(starsCount\)\.split/);
  });
});
