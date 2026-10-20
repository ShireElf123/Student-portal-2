/** Continent roads for the Wonderland Atlas — toddlers navigate by place, not a card grid. */
export const ATLAS_CONTINENTS = [
  {
    id: "wilds",
    title: "The Wilds",
    blurb: "Beasts, bugs and ice",
    emoji: "🌿",
    band: "from-sky-300 via-emerald-200 to-lime-300",
    worldIds: ["animal-world", "bug-world", "arctic-world"],
  },
  {
    id: "town",
    title: "Busy Town",
    blurb: "Roads, square and market",
    emoji: "🏘️",
    band: "from-amber-200 via-orange-100 to-rose-200",
    worldIds: ["vehicle-world", "city-world", "kitchen-world"],
  },
  {
    id: "studio",
    title: "Make & Tell",
    blurb: "Paint, stories and letters",
    emoji: "🎨",
    band: "from-pink-200 via-violet-100 to-indigo-200",
    worldIds: ["creative-world", "story-world", "learning-world"],
  },
  {
    id: "sky-home",
    title: "Sky & Home",
    blurb: "Forest, feelings and night",
    emoji: "🌙",
    band: "from-indigo-200 via-sky-100 to-slate-200",
    worldIds: ["adventure-world", "my-world", "night-world"],
  },
] as const;

export const TOY_ACTIVITY_TYPES = new Set([
  "color-lab",
  "piano-melody",
  "memory-match",
  "balloon-sky",
  "animal-safari",
  "rhyme-garden",
  "bubble-pop",
  "k1-studio",
  "letter-trace",
  "open-play",
  "land-play",
  "counting",
  "sorting",
]);
