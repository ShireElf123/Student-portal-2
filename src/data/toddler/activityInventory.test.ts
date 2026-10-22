/**
 * Living inventory of toddler-facing activities. This is source coverage of
 * IDs, types, and wiring — not a claim that every activity was play-tested.
 */
import { describe, expect, it } from "vitest";
import { LEARNING_ACTIVITY_DEFINITIONS } from "../activitySkillRegistry";
import { PICTURE_BOOKS } from "../pictureBooksData";
import { GUIDED_ASSESSMENTS } from "../assessmentTemplates";
import { ALL_TODDLER_WORLDS } from "./toddlerWorldsArchitecture";
import { PLAYHOUSE_SHOWS } from "./playhouseShows";
import { K1_STUDIO_GAMES } from "./k1StudioGames";
import { SECRET_ZONES } from "../../components/ToddlerSecretZones";
import {
  ACTIVITY_ENGINE,
  MECHANIC_FAMILY,
  activityHasCorrectOption,
  listWorldActivities,
  patternPromptIsHonest,
  quizTapHint,
} from "./activityQuality";

describe("activity inventory (source coverage)", () => {
  const worldActivities = listWorldActivities();

  it("reconciles unique world activity IDs and registers them", () => {
    const ids = worldActivities.map((activity) => activity.id);
    expect(new Set(ids).size).toBe(ids.length);
    const registeredWorld = LEARNING_ACTIVITY_DEFINITIONS.filter(
      (definition) => definition.experienceType === "toddler-world" || definition.launch.targetId.startsWith("world:"),
    );
    expect(registeredWorld).toHaveLength(worldActivities.length);
  });

  it("classifies every world activity type into a mechanic family", () => {
    const unknown = [...new Set(worldActivities.map((activity) => activity.type))].filter((type) => !MECHANIC_FAMILY[type]);
    expect(unknown).toEqual([]);
  });

  it("does not ship story-adventure rows without a story id, or land rooms without a play id", () => {
    expect(
      worldActivities.filter((activity) => activity.type === "story-adventure" && !activity.storyAdventureId).map((activity) => activity.id),
    ).toEqual([]);
    expect(
      worldActivities.filter((activity) => activity.type === "land-play" && !activity.landPlayId).map((activity) => activity.id),
    ).toEqual([]);
    expect(
      worldActivities.filter((activity) => activity.type === "open-play" && !activity.openPlayId).map((activity) => activity.id),
    ).toEqual([]);
    expect(
      worldActivities.filter((activity) => activity.type === "k1-studio" && !activity.studioGameId).map((activity) => activity.id),
    ).toEqual([]);
  });

  it("reports catalogue sizes so future work cannot silently shrink or invent counts", () => {
    const byType = worldActivities.reduce<Record<string, number>>((counts, activity) => {
      counts[activity.type] = (counts[activity.type] ?? 0) + 1;
      return counts;
    }, {});
    expect({
      worlds: ALL_TODDLER_WORLDS.length,
      worldActivities: worldActivities.length,
      byType,
      registry: LEARNING_ACTIVITY_DEFINITIONS.length,
      pictureBooks: PICTURE_BOOKS.length,
      playhouseShows: PLAYHOUSE_SHOWS.length,
      k1StudioGames: K1_STUDIO_GAMES.length,
      secretZones: SECRET_ZONES.length,
      guidedAssessments: GUIDED_ASSESSMENTS.length,
    }).toMatchObject({
      worlds: expect.any(Number),
      worldActivities: expect.any(Number),
      registry: expect.any(Number),
    });
    expect(worldActivities.length).toBe(510);
    expect(LEARNING_ACTIVITY_DEFINITIONS.length).toBeGreaterThanOrEqual(worldActivities.length);
    expect(PICTURE_BOOKS.length).toBeGreaterThanOrEqual(80);
    expect(worldActivities.filter((activity) => !activityHasCorrectOption(activity)).map((activity) => activity.id)).toEqual([]);
    expect(worldActivities.filter((activity) => !patternPromptIsHonest(activity)).map((activity) => activity.id)).toEqual([]);
    expect(worldActivities.filter((activity) => !ACTIVITY_ENGINE[activity.type]).map((activity) => activity.id)).toEqual([]);
    expect(quizTapHint("pattern-match")).toBe("Tap what comes next");
    expect(quizTapHint("sound-detective")).toBe("Tap who made the sound");
    // Visible in vitest logs so the quality report can cite exact source counts.
    // eslint-disable-next-line no-console
    console.log("ACTIVITY_INVENTORY", {
      worlds: ALL_TODDLER_WORLDS.length,
      worldActivities: worldActivities.length,
      byType,
      registry: LEARNING_ACTIVITY_DEFINITIONS.length,
      pictureBooks: PICTURE_BOOKS.length,
      playhouseShows: PLAYHOUSE_SHOWS.length,
      k1StudioGames: K1_STUDIO_GAMES.length,
      secretZones: SECRET_ZONES.length,
      guidedAssessments: GUIDED_ASSESSMENTS.length,
    });
  });
});
