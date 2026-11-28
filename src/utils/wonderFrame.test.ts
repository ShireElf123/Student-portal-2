import { describe, expect, it } from "vitest";
import { readWonderFrame, type WonderViewportSnapshot } from "./wonderFrame";

function snap(partial: Partial<WonderViewportSnapshot>): WonderViewportSnapshot {
  return {
    innerWidth: 390,
    innerHeight: 844,
    screenWidth: 390,
    screenHeight: 844,
    orientation: "portrait",
    hoverFine: false,
    ...partial,
  };
}

describe("readWonderFrame", () => {
  it("keeps a native phone in pocket portrait", () => {
    expect(readWonderFrame(snap({}))).toEqual({ frame: "pocket", orientation: "portrait" });
  });

  it("keeps Chrome desktop-site on a phone in pocket so tiles stay large", () => {
    expect(
      readWonderFrame(
        snap({
          innerWidth: 980,
          innerHeight: 2156,
          screenWidth: 390,
          screenHeight: 844,
          orientation: "portrait",
          hoverFine: false,
        }),
      ),
    ).toEqual({ frame: "pocket", orientation: "portrait" });
  });

  it("treats a real tablet portrait as tablet", () => {
    expect(
      readWonderFrame(
        snap({
          innerWidth: 768,
          innerHeight: 1024,
          screenWidth: 768,
          screenHeight: 1024,
          orientation: "portrait",
        }),
      ),
    ).toEqual({ frame: "tablet", orientation: "portrait" });
  });

  it("treats a fine-pointer desktop as wide", () => {
    expect(
      readWonderFrame(
        snap({
          innerWidth: 1440,
          innerHeight: 900,
          screenWidth: 1440,
          screenHeight: 900,
          orientation: "landscape",
          hoverFine: true,
        }),
      ),
    ).toEqual({ frame: "wide", orientation: "landscape" });
  });

  it("spreads a landscape phone as pocket landscape, not a fake desktop", () => {
    expect(
      readWonderFrame(
        snap({
          innerWidth: 844,
          innerHeight: 390,
          screenWidth: 390,
          screenHeight: 844,
          orientation: "landscape",
        }),
      ),
    ).toEqual({ frame: "pocket", orientation: "landscape" });
  });
});
