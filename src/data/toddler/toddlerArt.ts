import type { ToddlerSpaceTabId } from "./toddlerSpaceTabs";

/** Illustrated launcher family — clay/storybook objects, not emoji. Missing keys fall back to emoji. */
export const DESTINATION_ICON: Partial<Record<ToddlerSpaceTabId, string>> = {
  worlds: "/art/icons/worlds.png",
  books: "/art/icons/stories.png",
  games: "/art/icons/games.png",
  focus: "/art/icons/focus.png",
  playhouse: "/art/icons/playhouse.png",
  phonics: "/art/icons/phonics.png",
  counting: "/art/icons/counting.png",
  "avatar-studio": "/art/icons/buddy.png",
};

/** Polymer-clay playroom interiors for each destination shell. */
export const PLACE_ART: Partial<Record<ToddlerSpaceTabId, string>> = {
  worlds: "/art/places/worlds.jpg",
  books: "/art/places/stories.jpg",
  games: "/art/places/games.jpg",
  focus: "/art/places/focus.jpg",
  playhouse: "/art/places/playhouse.jpg",
  phonics: "/art/places/phonics.jpg",
  counting: "/art/places/counting.jpg",
  "avatar-studio": "/art/places/buddy.jpg",
};

export const HOME_ART = {
  sky: "/art/home/sky.jpg",
  meadow: "/art/home/meadow.jpg",
  teddy: "/art/home/teddy.png",
  sun: "/art/home/sun.png",
  cloud: "/art/home/cloud.png",
} as const;
