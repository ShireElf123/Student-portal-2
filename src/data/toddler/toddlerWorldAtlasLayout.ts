/** Continent roads for the Wonderland Atlas — toddlers navigate by place, not a card grid. */
export const ATLAS_CONTINENTS = [
  {
    id: "wilds",
    title: "The Wilds",
    blurb: "Beasts, bugs and ice",
    emoji: "🌿",
    band: "from-emerald-400/40 via-lime-300/30 to-cyan-400/30",
    worldIds: ["animal-world", "bug-world", "arctic-world"],
  },
  {
    id: "town",
    title: "Busy Town",
    blurb: "Roads, square and market",
    emoji: "🏘️",
    band: "from-amber-400/40 via-orange-300/30 to-rose-400/30",
    worldIds: ["vehicle-world", "city-world", "kitchen-world"],
  },
  {
    id: "studio",
    title: "Make & Tell",
    blurb: "Paint, stories and letters",
    emoji: "🎨",
    band: "from-pink-400/40 via-violet-300/30 to-indigo-400/30",
    worldIds: ["creative-world", "story-world", "learning-world"],
  },
  {
    id: "sky-home",
    title: "Sky & Home",
    blurb: "Forest, feelings and night",
    emoji: "🌙",
    band: "from-sky-400/40 via-indigo-400/30 to-slate-500/30",
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
  "counting",
  "sorting",
]);
