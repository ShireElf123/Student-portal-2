import type { ToddlerSpaceTabId } from "./toddlerSpaceTabs";

/** Illustrated launcher family — clay/storybook objects, not emoji. Missing keys fall back to emoji. */
export const DESTINATION_ICON: Partial<Record<ToddlerSpaceTabId, string>> = {
  worlds: "/art/icons/worlds.png",
  books: "/art/icons/stories.png",
  games: "/art/icons/games.png",
  focus: "/art/icons/focus.png",
  playhouse: "/art/icons/playhouse.png",
};

export const HOME_ART = {
  sky: "/art/home/sky.jpg",
  meadow: "/art/home/meadow.jpg",
  teddy: "/art/home/teddy.png",
  sun: "/art/home/sun.png",
  cloud: "/art/home/cloud.png",
} as const;
