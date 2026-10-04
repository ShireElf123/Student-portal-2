import { getActiveLearnerId } from "../../utils/learnerBrain";

export interface DailyMission {
  id: string;
  title: string;
  tagline: string;
  emoji: string;
  targetTab: "books" | "phonics" | "counting" | "games" | "worlds" | "avatar-studio";
  targetSubactivity?: string;
  starsReward: number;
  xpReward: number;
}

export interface DailySchedule {
  dayName: string;
  themeTitle: string;
  themeBannerEmoji: string;
  missions: DailyMission[];
}

export interface CollectibleSticker {
  id: string;
  name: string;
  emoji: string;
  category: "animal" | "space" | "ocean" | "learning" | "buddy";
  requiredStars: number;
  description: string;
}

export const TODDLER_STICKERS: CollectibleSticker[] = [
  { id: "stk-safari-king", name: "Safari King", emoji: "🦁", category: "animal", requiredStars: 5, description: "Discovered all friendly savanna animals!" },
  { id: "stk-space-rocket", name: "Moon Rocket", emoji: "🚀", category: "space", requiredStars: 10, description: "Blasted off past the moon with Pip!" },
  { id: "stk-ocean-diver", name: "Ocean Diver", emoji: "🐬", category: "ocean", requiredStars: 15, description: "Swam with dolphins in the turquoise sea!" },
  { id: "stk-dino-rex", name: "Dino Master", emoji: "🦖", category: "animal", requiredStars: 20, description: "Uncovered prehistoric giant footprints!" },
  { id: "stk-bunny-feeder", name: "Bunny Feeder", emoji: "🥕", category: "animal", requiredStars: 25, description: "Fed Benny Bunny 5 crunchy orange carrots!" },
  { id: "stk-twinkle-star", name: "Twinkle Star", emoji: "⭐", category: "space", requiredStars: 30, description: "Filled the golden Star Jar with bright starlight!" },
  { id: "stk-color-wizard", name: "Color Wizard", emoji: "🎨", category: "learning", requiredStars: 35, description: "Mixed bright magical paints in the Color Lab!" },
  { id: "stk-melody-maestro", name: "Melody Maestro", emoji: "🎹", category: "learning", requiredStars: 40, description: "Played rainbow piano notes without missing a beat!" },
  { id: "stk-phonics-champ", name: "Phonics Champ", emoji: "🔤", category: "learning", requiredStars: 45, description: "Mastered all 26 letter sounds from A to Z!" },
  { id: "stk-farm-hero", name: "Farm Hero", emoji: "🚜", category: "animal", requiredStars: 50, description: "Helped Mother Hen count her fluffy yellow chicks!" },
  { id: "stk-bubble-pop", name: "Bubble Popper", emoji: "🎈", category: "learning", requiredStars: 55, description: "Popped 10 floating rainbow bubbles in the sky!" },
  { id: "stk-sunshine-sprout", name: "Sunshine Sprout", emoji: "☀️", category: "learning", requiredStars: 60, description: "Greeted the morning sun with a cheerful smile!" },
  { id: "stk-puzzle-whiz", name: "Puzzle Whiz", emoji: "🧩", category: "learning", requiredStars: 65, description: "Matched every shape, circle, and star perfectly!" },
  { id: "stk-story-reader", name: "Story Reader", emoji: "📚", category: "buddy", requiredStars: 70, description: "Turned pages and read aloud illustrated tales!" },
  { id: "stk-buddy-bestie", name: "Buddy Bestie", emoji: "🧸", category: "buddy", requiredStars: 75, description: "Customized Pip with hats, capes, and bowties!" },
  { id: "stk-sweet-explorer", name: "Fruit Picker", emoji: "🍓", category: "learning", requiredStars: 80, description: "Sorted delicious fruits and healthy snacks!" },
  { id: "stk-butterfly-friend", name: "Butterfly Pal", emoji: "🦋", category: "animal", requiredStars: 90, description: "Danced through the sunny meadow with butterflies!" },
  { id: "stk-wonder-legend", name: "Wonder Legend", emoji: "👑", category: "buddy", requiredStars: 100, description: "Became a Master Learning Champion of Toddler World!" },
];

export const EXPLORER_RANKS = [
  { level: 1, title: "Little Explorer", emoji: "🐾", minStars: 0, maxStars: 19, color: "text-amber-500", badgeBg: "bg-amber-100 border-amber-300", description: "Taking first magical steps in learning and discovery!" },
  { level: 2, title: "Curious Explorer", emoji: "🔍", minStars: 20, maxStars: 44, color: "text-emerald-500", badgeBg: "bg-emerald-100 border-emerald-300", description: "Asking questions, discovering sounds, and collecting stars!" },
  { level: 3, title: "Super Explorer", emoji: "🚀", minStars: 45, maxStars: 74, color: "text-sky-500", badgeBg: "bg-sky-100 border-sky-300", description: "Mastering challenges, solving puzzles, and reading books!" },
  { level: 4, title: "Wonder Explorer", emoji: "🌟", minStars: 75, maxStars: 119, color: "text-purple-500", badgeBg: "bg-purple-100 border-purple-300", description: "Shining bright with curiosity, creativity, and kindness!" },
  { level: 5, title: "Learning Champion", emoji: "👑", minStars: 120, maxStars: 9999, color: "text-pink-500", badgeBg: "bg-pink-100 border-pink-300", description: "True champion of learning, stories, and daily wonder!" },
];

export function getExplorerRank(stars: number) {
  for (let i = EXPLORER_RANKS.length - 1; i >= 0; i--) {
    if (stars >= EXPLORER_RANKS[i].minStars) {
      return EXPLORER_RANKS[i];
    }
  }
  return EXPLORER_RANKS[0];
}

const WEEKLY_SCHEDULES: Record<number, DailySchedule> = {
  // 0 = Sunday
  0: {
    dayName: "Sunday",
    themeTitle: "Galaxy Starlight Special",
    themeBannerEmoji: "✨",
    missions: [
      { id: "sun-1", title: "Star Constellation Count", tagline: "Count the shiny twinkling stars", emoji: "⭐", targetTab: "counting", starsReward: 2, xpReward: 30 },
      { id: "sun-2", title: "Space Submarine Journey", tagline: "Explore the deep sea or outer space", emoji: "🚀", targetTab: "worlds", targetSubactivity: "adventure-world", starsReward: 3, xpReward: 40 },
      { id: "sun-3", title: "Goodnight Little Bear", tagline: "Read the peaceful bedtime story", emoji: "🌙", targetTab: "books", starsReward: 3, xpReward: 50 },
    ],
  },
  // 1 = Monday
  1: {
    dayName: "Monday",
    themeTitle: "Safari Animals & Phonics",
    themeBannerEmoji: "🦁",
    missions: [
      { id: "mon-1", title: "Safari Sound Detective", tagline: "Who says Roaaar and Moooo?", emoji: "🦁", targetTab: "games", targetSubactivity: "animal-safari", starsReward: 2, xpReward: 30 },
      { id: "mon-2", title: "Tap Letter Sounds (A, B, C)", tagline: "Hear letter names and sounds", emoji: "🔤", targetTab: "phonics", starsReward: 2, xpReward: 30 },
      { id: "mon-3", title: "Buddy's Farm Adventure", tagline: "Help Buddy feed the horse!", emoji: "🚜", targetTab: "worlds", targetSubactivity: "story-world", starsReward: 3, xpReward: 50 },
    ],
  },
  // 2 = Tuesday
  2: {
    dayName: "Tuesday",
    themeTitle: "Space Blast-Off & Piano",
    themeBannerEmoji: "🚀",
    missions: [
      { id: "tue-1", title: "Count 1 to 5 Objects", tagline: "Count balloons, strawberries & cars", emoji: "🔢", targetTab: "counting", starsReward: 2, xpReward: 30 },
      { id: "tue-2", title: "Rainbow Piano Melody", tagline: "Play cheerful colorful tunes", emoji: "🎹", targetTab: "games", targetSubactivity: "rainbow-piano", starsReward: 2, xpReward: 30 },
      { id: "tue-3", title: "Rocket Pip Goes to the Moon", tagline: "Blast off into the starry sky!", emoji: "🚀", targetTab: "worlds", targetSubactivity: "story-world", starsReward: 3, xpReward: 50 },
    ],
  },
  // 3 = Wednesday
  3: {
    dayName: "Wednesday",
    themeTitle: "Ocean Secrets & Shapes",
    themeBannerEmoji: "🌊",
    missions: [
      { id: "wed-1", title: "Ocean Deep Dive", tagline: "Spot turtles and glowing jellyfish", emoji: "🐬", targetTab: "worlds", targetSubactivity: "adventure-world", starsReward: 2, xpReward: 30 },
      { id: "wed-2", title: "Colors & Shapes Parade", tagline: "Find red circles and blue squares", emoji: "🔷", targetTab: "games", targetSubactivity: "shape-match", starsReward: 2, xpReward: 30 },
      { id: "wed-3", title: "The Colors & Shapes Book", tagline: "Read the bright circus story", emoji: "🎪", targetTab: "books", starsReward: 3, xpReward: 50 },
    ],
  },
  // 4 = Thursday
  4: {
    dayName: "Thursday",
    themeTitle: "Dino Dig & Rhyme Time",
    themeBannerEmoji: "🦖",
    missions: [
      { id: "thu-1", title: "Dinosaur Excavation", tagline: "Uncover giant footprints and fossils", emoji: "🦖", targetTab: "worlds", targetSubactivity: "adventure-world", starsReward: 2, xpReward: 30 },
      { id: "thu-2", title: "Rhyme Time Playground", tagline: "Find words that sound alike!", emoji: "🎵", targetTab: "games", targetSubactivity: "rhyme-time", starsReward: 2, xpReward: 30 },
      { id: "thu-3", title: "Color Magic Lab", tagline: "Mix bright red, yellow & blue!", emoji: "🎨", targetTab: "games", targetSubactivity: "color-magic", starsReward: 3, xpReward: 50 },
    ],
  },
  // 5 = Friday
  5: {
    dayName: "Friday",
    themeTitle: "Farm & Food Sorting",
    themeBannerEmoji: "🥕",
    missions: [
      { id: "fri-1", title: "Feed Benny Bunny", tagline: "Tap 5 crunchy orange carrots", emoji: "🐰", targetTab: "games", targetSubactivity: "feed-animal", starsReward: 2, xpReward: 30 },
      { id: "fri-2", title: "My World: Feelings & Family", tagline: "Who has a big happy smile?", emoji: "😊", targetTab: "worlds", targetSubactivity: "my-world", starsReward: 2, xpReward: 30 },
      { id: "fri-3", title: "Counting Sunshine Garden", tagline: "Count bees and butterflies!", emoji: "🌻", targetTab: "books", starsReward: 3, xpReward: 50 },
    ],
  },
  // 6 = Saturday
  6: {
    dayName: "Saturday",
    themeTitle: "Rainbow Bubbles & Memory",
    themeBannerEmoji: "🎈",
    missions: [
      { id: "sat-1", title: "Pop Floating Bubbles", tagline: "Tap bubbles before they float away", emoji: "🎈", targetTab: "games", targetSubactivity: "bubble-pop", starsReward: 2, xpReward: 30 },
      { id: "sat-2", title: "Memory Card Match", tagline: "Flip and find cute matching friends", emoji: "🃏", targetTab: "games", targetSubactivity: "memory-match", starsReward: 2, xpReward: 30 },
      { id: "sat-3", title: "Style Your Learning Buddy", tagline: "Put on astronaut helmets or capes!", emoji: "🐾", targetTab: "avatar-studio", starsReward: 3, xpReward: 50 },
    ],
  },
};

export function getTodayAdventure(): DailySchedule {
  const dayIndex = new Date().getDay();
  return WEEKLY_SCHEDULES[dayIndex] || WEEKLY_SCHEDULES[1];
}

const MISSIONS_STORAGE_KEY = "toddler_daily_missions_completed_v1";

function scopedDailyKey(key: string): string {
  return `${key}_${getActiveLearnerId()}`;
}

export function getCompletedDailyMissionIds(): string[] {
  try {
    const key = scopedDailyKey(MISSIONS_STORAGE_KEY);
    let raw = localStorage.getItem(key);
    if (!raw && getActiveLearnerId() === "scholar-primary-1") {
      raw = localStorage.getItem(MISSIONS_STORAGE_KEY);
      if (raw) {
        localStorage.setItem(key, raw);
        localStorage.removeItem(MISSIONS_STORAGE_KEY);
      }
    }
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    const today = new Date().toISOString().split("T")[0];
    if (parsed.date === today && Array.isArray(parsed.ids)) {
      return parsed.ids;
    }
    return [];
  } catch {
    return [];
  }
}

export function markDailyMissionCompleted(missionId: string): { isFirstComplete: boolean; allCompleted: boolean } {
  try {
    const today = new Date().toISOString().split("T")[0];
    const existing = getCompletedDailyMissionIds();
    if (existing.includes(missionId)) {
      return { isFirstComplete: false, allCompleted: existing.length >= 3 };
    }
    const updated = [...existing, missionId];
    localStorage.setItem(scopedDailyKey(MISSIONS_STORAGE_KEY), JSON.stringify({ date: today, ids: updated }));
    return { isFirstComplete: true, allCompleted: updated.length >= 3 };
  } catch {
    return { isFirstComplete: false, allCompleted: false };
  }
}

export function getDailyCount(counterKey: string): number {
  if (typeof window === "undefined") return 0;
  try {
    const today = new Date().toISOString().split("T")[0];
    const raw = localStorage.getItem(scopedDailyKey(`toddler_daily_count_${counterKey}_${today}`));
    return raw ? parseInt(raw, 10) || 0 : 0;
  } catch {
    return 0;
  }
}

export function recordDailyCount(counterKey: string): number {
  if (typeof window === "undefined") return 1;
  try {
    const today = new Date().toISOString().split("T")[0];
    const key = scopedDailyKey(`toddler_daily_count_${counterKey}_${today}`);
    const current = getDailyCount(counterKey);
    const next = current + 1;
    localStorage.setItem(key, String(next));
    return next;
  } catch {
    return 1;
  }
}

export function recordDailySetMember(
  bucket: string,
  memberId: string
): { isNew: boolean; count: number } {
  if (typeof window === "undefined") return { isNew: true, count: 1 };
  try {
    const today = new Date().toISOString().split("T")[0];
    const key = scopedDailyKey(`toddler_daily_set_${bucket}_${today}`);
    const raw = localStorage.getItem(key);
    const set: string[] = raw ? JSON.parse(raw) : [];

    if (set.includes(memberId)) {
      return { isNew: false, count: set.length };
    }

    const updated = [...set, memberId];
    localStorage.setItem(key, JSON.stringify(updated));
    return { isNew: true, count: updated.length };
  } catch {
    return { isNew: true, count: 1 };
  }
}

export function completeActiveMissionIfMatches(
  targetTab: string,
  targetSubactivity?: string
): { completed: boolean; mission?: DailyMission } {
  try {
    const adventure = getTodayAdventure();
    const completedIds = getCompletedDailyMissionIds();

    const matched = adventure.missions.find((m) => {
      if (completedIds.includes(m.id)) return false;
      if (m.targetTab !== targetTab) return false;
      if (targetSubactivity && m.targetSubactivity && m.targetSubactivity !== targetSubactivity) {
        return false;
      }
      return true;
    });

    if (matched) {
      markDailyMissionCompleted(matched.id);
      return { completed: true, mission: matched };
    }

    return { completed: false };
  } catch {
    return { completed: false };
  }
}

export function recordPhonicsLetterTapped(letter: string): void {
  const result = recordDailySetMember("phonics-letters", letter);
  if (result.count >= 3) {
    completeActiveMissionIfMatches("phonics");
  }
}

export function recordCountingCardTapped(num: number): void {
  const result = recordDailySetMember("counting-cards", String(num));
  if (result.count >= 3) {
    completeActiveMissionIfMatches("counting");
  }
}
