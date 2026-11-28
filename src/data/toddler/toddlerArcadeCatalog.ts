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
  { id: "feed-animal", title: "Feed Bunny", art: "/covers/buddy-farm-tale.jpg", accent: "from-orange-400 to-amber-500", rim: "border-amber-700" },
];

/** Existing illustrated worlds/covers for Skill Studio, keyed by the real game id. */
export const K1_STUDIO_ART: Record<K1StudioGameId, string> = {
  "ten-frame-taxi": "/worlds/vehicle-world.jpg",
  "blend-kitchen": "/worlds/kitchen-world.jpg",
  "bead-train": "/worlds/creative-world.jpg",
  "picnic-plus": "/covers/block-table-feast.jpg",
  "weather-porch": "/covers/attic-rain-trunk.jpg",
  "laundry-sort": "/worlds/my-world.jpg",
  "story-porch": "/worlds/story-world.jpg",
  "sock-drawer": "/covers/big-hug-bed.jpg",
  "farm-count": "/worlds/animal-world.jpg",
  "reef-sort": "/worlds/secret-coral.jpg",
  "shape-bakery": "/covers/bakery-window-fog.jpg",
  "bus-stop": "/worlds/city-world.jpg",
  "shadow-lantern": "/worlds/night-world.jpg",
  "dino-tracks": "/worlds/secret-dino-cave.jpg",
  "ice-pack": "/worlds/arctic-world.jpg",
  "bug-sort": "/worlds/bug-world.jpg",
};

export function studioAccent(id: K1StudioGameId): string {
  return K1_STUDIO_GAMES.find((game) => game.id === id)?.accent ?? "from-emerald-400 to-teal-500";
}
