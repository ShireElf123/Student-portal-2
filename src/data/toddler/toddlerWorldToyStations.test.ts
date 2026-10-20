import { describe, expect, it } from "vitest";
import { ALL_TODDLER_WORLDS } from "./toddlerWorldsArchitecture";
import { TOY_ACTIVITY_TYPES } from "./toddlerWorldAtlasLayout";

const PLAY_TOYS = new Set(
  [...TOY_ACTIVITY_TYPES].filter((type) => type !== "counting" && type !== "sorting")
);

describe("in-world play toys", () => {
  it("plants letter-trace on every land", () => {
    const ids = ALL_TODDLER_WORLDS.flatMap((world) =>
      world.areas.flatMap((area) => area.activities.filter((activity) => activity.type === "letter-trace").map((activity) => activity.id))
    );
    expect(ids.sort()).toEqual([
      "act-bakery-letter-trace",
      "act-barn-letter-trace",
      "act-bed-letter-trace",
      "act-farm-letter-trace",
      "act-floe-letter-trace",
      "act-forest-letter-trace",
      "act-home-letter-trace",
      "act-meadow-letter-trace",
      "act-owl-letter-trace",
      "act-park-letter-trace",
      "act-street-letter-trace",
      "act-studio-letter-trace",
    ]);
    expect(new Set(ALL_TODDLER_WORLDS.filter((world) => world.areas.some((area) => area.activities.some((activity) => activity.type === "letter-trace"))).map((world) => world.id)).size).toBe(12);
  });

  it("plants no-fail stir, drive, and pour beside the quizzes", () => {
    const ids = ALL_TODDLER_WORLDS.flatMap((world) =>
      world.areas.flatMap((area) => area.activities.filter((activity) => activity.type === "open-play").map((activity) => activity.id))
    );
    expect(ids.sort()).toEqual(["act-home-pour", "act-soup-stir", "act-street-drive"]);
  });

  it("plants a real play toy on every area road", () => {
    const bare = ALL_TODDLER_WORLDS.flatMap((world) =>
      world.areas
        .filter((area) => !area.activities.some((activity) => PLAY_TOYS.has(activity.type)))
        .map((area) => `${world.id}/${area.id}`)
    );
    expect(bare).toEqual([]);
  });
});
