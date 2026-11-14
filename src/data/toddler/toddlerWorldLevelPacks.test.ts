import { describe, expect, it } from "vitest";
import { ALL_TODDLER_WORLDS } from "./toddlerWorldsArchitecture";
import { WORLD_LEVEL_PACK_SKILLS } from "./toddlerWorldLevelPacks";
import { validateLearningActivityRegistry } from "../activitySkillRegistry";

describe("toddler world level trails", () => {
  it("gives every area a real trail of stations, not a two-item demo", () => {
    const thin = ALL_TODDLER_WORLDS.flatMap((world) =>
      world.areas
        .filter((area) => area.activities.length < 8)
        .map((area) => `${world.id}/${area.id} (${area.activities.length})`)
    );
    expect(thin).toEqual([]);
    const total = ALL_TODDLER_WORLDS.reduce(
      (sum, world) => sum + world.areas.reduce((areaSum, area) => areaSum + area.activities.length, 0),
      0
    );
    expect(ALL_TODDLER_WORLDS.length).toBeGreaterThanOrEqual(12);
    expect(total).toBeGreaterThanOrEqual(300);
  });

  it("does not ship quiz-shaped story-adventure rows without a story id", () => {
    const orphanQuizzes = ALL_TODDLER_WORLDS.flatMap((world) =>
      world.areas.flatMap((area) =>
        area.activities
          .filter((activity) => activity.type === "story-adventure" && !activity.storyAdventureId)
          .map((activity) => activity.id),
      ),
    );
    expect(orphanQuizzes).toEqual([]);
    expect(ALL_TODDLER_WORLDS.flatMap((world) => world.areas.flatMap((area) => area.activities)).some((activity) => activity.id === "act-story-farm-who-gate" && activity.type === "clue-detective")).toBe(true);
  });

  it("keeps every packed level id unique and skill-mapped or honestly unmapped", () => {
    const ids = ALL_TODDLER_WORLDS.flatMap((world) => world.areas.flatMap((area) => area.activities.map((activity) => activity.id)));
    expect(new Set(ids).size).toBe(ids.length);
    expect(validateLearningActivityRegistry()).toEqual([]);
    expect(Object.keys(WORLD_LEVEL_PACK_SKILLS).length).toBeGreaterThan(100);
  });
});
