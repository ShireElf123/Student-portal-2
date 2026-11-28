import { describe, expect, it } from "vitest";
import { WONDERLAND_HISTORY_KEY } from "./toddlerSpaceTabs";
import {
  readWonderlandPlace,
  worldRouteFromPlace,
  wonderlandPlacesEqual,
} from "./wonderlandPlace";

describe("wonderland place history", () => {
  it("reads a legacy tab string and a nested place object", () => {
    expect(readWonderlandPlace({ [WONDERLAND_HISTORY_KEY]: "games" }).tab).toBe("games");
    expect(
      readWonderlandPlace({
        [WONDERLAND_HISTORY_KEY]: { tab: "playhouse", show: "teddy-loose-button" },
      }).show,
    ).toBe("teddy-loose-button");
  });

  it("builds a worlds trail route from nested ids", () => {
    expect(worldRouteFromPlace({ tab: "worlds", world: "farm" })).toBe("farm");
    expect(worldRouteFromPlace({ tab: "worlds", world: "farm", area: "barn" })).toBe("world:farm:barn");
    expect(
      worldRouteFromPlace({ tab: "worlds", world: "farm", area: "barn", activity: "chicks" }),
    ).toBe("world:farm:barn:chicks");
    expect(worldRouteFromPlace({ tab: "games", world: "farm" })).toBeNull();
  });

  it("compares inner screens, not just the destination tab", () => {
    expect(
      wonderlandPlacesEqual(
        { tab: "games", game: "rainbow-piano" },
        { tab: "games", game: "rainbow-piano" },
      ),
    ).toBe(true);
    expect(
      wonderlandPlacesEqual({ tab: "games", game: "rainbow-piano" }, { tab: "games" }),
    ).toBe(false);
  });
});
