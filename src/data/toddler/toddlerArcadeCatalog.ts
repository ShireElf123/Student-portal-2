import { K1_STUDIO_GAMES, type K1StudioGameId } from "./k1StudioGames";

export type ToddlerArcadeGameId =
  | "rainbow-piano"
  | "animal-safari"
  | "balloon-sky"
  | "animal-quiz"
  | "shape-match"
  | "memory-match"
  | "rhyme-time"
  | "color-magic"
  | "bubble-pop"
  | "bubble-pop-phonics"
  | "feed-animal";

export interface ToddlerArcadeGame {
  id: ToddlerArcadeGameId;
  title: string;
  art: string;
  accent: string;
  rim: string;
}

/** Presentation-only. IDs and handlers stay in ToddlerQuizzesAndGames. */
export const TODDLER_ARCADE_GAMES: ToddlerArcadeGame[] = [
  { id: "rainbow-piano", title: "Xylophone", art: "/games/arcade-xylophone.jpg", accent: "from-pink-400 to-rose-500", rim: "border-rose-600" },
  { id: "animal-safari", title: "Safari", art: "/games/arcade-safari.jpg", accent: "from-emerald-400 to-teal-600", rim: "border-teal-700" },
  { id: "balloon-sky", title: "Balloons", art: "/games/arcade-balloons.jpg", accent: "from-sky-400 to-blue-500", rim: "border-blue-600" },
  { id: "animal-quiz", title: "Animal Quiz", art: "/games/arcade-animal-quiz.jpg", accent: "from-amber-400 to-orange-500", rim: "border-orange-700" },
  { id: "shape-match", title: "Shapes", art: "/games/arcade-shapes.jpg", accent: "from-violet-400 to-indigo-500", rim: "border-indigo-700" },
  { id: "memory-match", title: "Memory", art: "/games/arcade-memory.jpg", accent: "from-cyan-400 to-blue-500", rim: "border-cyan-700" },
  { id: "rhyme-time", title: "Rhymes", art: "/games/arcade-rhymes.jpg", accent: "from-rose-400 to-pink-500", rim: "border-rose-700" },
  { id: "color-magic", title: "Color Lab", art: "/games/arcade-color-lab.jpg", accent: "from-lime-400 to-emerald-500", rim: "border-emerald-700" },
  { id: "bubble-pop", title: "Bubbles", art: "/games/arcade-bubbles.jpg", accent: "from-fuchsia-400 to-violet-500", rim: "border-fuchsia-700" },
  { id: "bubble-pop-phonics", title: "Phonics Pop", art: "/games/arcade-phonics-pop.jpg", accent: "from-sky-400 to-indigo-500", rim: "border-indigo-700" },
  { id: "feed-animal", title: "Feed Bunny", art: "/games/arcade-feed-bunny.jpg", accent: "from-orange-400 to-amber-500", rim: "border-amber-700" },
];

/** Unique arcade art for Skill Studio, keyed by the real game id. */
export const K1_STUDIO_ART: Record<K1StudioGameId, string> = {
  "ten-frame-taxi": "/games/arcade-ten-frame-taxi.jpg",
  "blend-kitchen": "/games/arcade-blend-kitchen.jpg",
  "bead-train": "/games/arcade-bead-train.jpg",
  "picnic-plus": "/games/arcade-picnic-plus.jpg",
  "weather-porch": "/games/arcade-weather-porch.jpg",
  "laundry-sort": "/games/arcade-laundry-sort.jpg",
  "story-porch": "/games/arcade-story-porch.jpg",
  "sock-drawer": "/games/arcade-sock-drawer.jpg",
  "farm-count": "/games/arcade-farm-count.jpg",
  "reef-sort": "/games/arcade-reef-sort.jpg",
  "shape-bakery": "/games/arcade-shape-bakery.jpg",
  "bus-stop": "/games/arcade-bus-stop.jpg",
  "shadow-lantern": "/games/arcade-shadow-lantern.jpg",
  "dino-tracks": "/games/arcade-dino-tracks.jpg",
  "ice-pack": "/games/arcade-ice-pack.jpg",
  "bug-sort": "/games/arcade-bug-sort.jpg",
};

export function studioAccent(id: K1StudioGameId): string {
  return K1_STUDIO_GAMES.find((game) => game.id === id)?.accent ?? "from-emerald-400 to-teal-500";
}
