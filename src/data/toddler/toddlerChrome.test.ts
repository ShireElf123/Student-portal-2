import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("toddler chrome fonts", () => {
  it("puts color-emoji fonts before Segoe UI so Windows does not paint .notdef boxes", () => {
    const css = readFileSync("src/index.css", "utf8");
    const body = css.slice(css.indexOf("body {"), css.indexOf("h1, h2"));
    const segoe = body.indexOf("'Segoe UI'");
    const apple = body.indexOf("'Apple Color Emoji'");
    const noto = body.indexOf("'Noto Color Emoji'");
    expect(apple).toBeGreaterThan(0);
    expect(noto).toBeGreaterThan(apple);
    expect(segoe).toBeGreaterThan(noto);
  });
});
