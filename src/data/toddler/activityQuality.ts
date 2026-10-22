import type { ToddlerActivity, ToddlerActivityType } from "./toddlerWorldsArchitecture";
import { ALL_TODDLER_WORLDS } from "./toddlerWorldsArchitecture";

/** Shared engine a world activity type mounts. One engine, many activity IDs. */
export const ACTIVITY_ENGINE: Record<ToddlerActivityType, string> = {
  "sound-detective": "WorldsNavigator.quiz",
  "clue-detective": "WorldsNavigator.quiz",
  "habitat-match": "WorldsNavigator.quiz",
  "pattern-match": "WorldsNavigator.quiz",
  counting: "WorldsNavigator.counting",
  sorting: "WorldsNavigator.sorting",
  "color-lab": "ToddlerColorLab",
  "piano-melody": "ToddlerMusicPiano",
  "memory-match": "ToddlerMemoryGame",
  "balloon-sky": "ToddlerBalloonSky",
  "animal-safari": "ToddlerAnimalSafari",
  "rhyme-garden": "ToddlerRhymeGame",
  "bubble-pop": "ToddlerBubblePopGame",
  "letter-trace": "ToddlerLetterTrace",
  "open-play": "ToddlerOpenPlay",
  "land-play": "ToddlerLandRooms",
  "k1-studio": "ToddlerK1Studio",
  "story-adventure": "WorldsNavigator.story",
  "feed-friend": "unmounted",
};

export const MECHANIC_FAMILY: Record<ToddlerActivityType, string> = {
  "sound-detective": "tap-quiz",
  "clue-detective": "tap-quiz",
  counting: "tap-count-or-quiz",
  sorting: "tap-sort",
  "habitat-match": "tap-quiz",
  "color-lab": "tap-mix-plus-paint-canvas",
  "piano-melody": "tap-keys",
  "memory-match": "tap-memory",
  "balloon-sky": "tap-moving-targets",
  "animal-safari": "tap-explore-or-detective",
  "rhyme-garden": "tap-quiz",
  "bubble-pop": "tap-moving-targets",
  "letter-trace": "freeform-trace",
  "open-play": "hold-or-drag-room",
  "land-play": "hold-or-drag-room",
  "k1-studio": "tap-quiz-rounds",
  "story-adventure": "multi-step-story",
  "pattern-match": "tap-pattern",
  "feed-friend": "unmounted",
};

const QUIZ_TYPES: ToddlerActivityType[] = ["clue-detective", "sound-detective", "habitat-match", "pattern-match"];

export function quizTapHint(type: ToddlerActivityType): string {
  if (type === "pattern-match") return "Tap what comes next";
  if (type === "sound-detective") return "Tap who made the sound";
  if (type === "habitat-match") return "Tap their home";
  if (type === "counting") return "Tap how many";
  return "Tap who it is";
}

export function listWorldActivities(): ToddlerActivity[] {
  return ALL_TODDLER_WORLDS.flatMap((world) => world.areas.flatMap((area) => area.activities));
}

export function activityHasCorrectOption(activity: ToddlerActivity): boolean {
  if (!QUIZ_TYPES.includes(activity.type)) return true;
  return activity.options.some((option) => option.isCorrect);
}

export function patternPromptIsHonest(activity: ToddlerActivity): boolean {
  if (activity.type !== "pattern-match") return true;
  return /next|pattern|comes/i.test(`${activity.cluePrompt} ${activity.spokenPrompt} ${activity.title}`);
}
