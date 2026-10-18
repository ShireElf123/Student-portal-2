import { describe, expect, it } from "vitest";
import { ALL_TODDLER_WORLDS } from "./toddlerWorldsArchitecture";
import { TOY_ACTIVITY_TYPES } from "./toddlerWorldAtlasLayout";

const PLAY_TOYS = new Set(
  [...TOY_ACTIVITY_TYPES].filter((type) => type !== "counting" && type !== "sorting")
);

describe("in-world play toys", () => {
  it("plants a real play toy on every area road", () => {
    const bare = ALL_TODDLER_WORLDS.flatMap((world) =>
      world.areas
        .filter((area) => !area.activities.some((activity) => PLAY_TOYS.has(activity.type)))
        .map((area) => `${world.id}/${area.id}`)
    );
    expect(bare).toEqual([]);
  });
});
