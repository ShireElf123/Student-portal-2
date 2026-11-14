export type ToddlerSpaceTabId =
  | "worlds"
  | "books"
  | "games"
  | "focus"
  | "playhouse"
  | "phonics"
  | "counting"
  | "avatar-studio";

export interface ToddlerSpaceTab {
  id: ToddlerSpaceTabId;
  label: string;
  emoji: string;
  activeClass: string;
}

/**
 * Phone layout is 4 columns, so the first four tabs are the first row.
 * Worlds / Stories / Games / Focus stay on that first row.
 */
export const TODDLER_SPACE_TABS: ToddlerSpaceTab[] = [
  { id: "worlds", label: "Worlds", emoji: "🗺️", activeClass: "bg-gradient-to-b from-amber-400 to-orange-500 text-white border-b-4 border-orange-700 shadow-lg scale-102" },
  { id: "books", label: "Stories", emoji: "📚", activeClass: "bg-gradient-to-b from-amber-400 to-amber-500 text-amber-950 border-b-4 border-amber-700 shadow-lg scale-102" },
  { id: "games", label: "Games", emoji: "🎮", activeClass: "bg-gradient-to-b from-emerald-400 to-teal-500 text-white border-b-4 border-emerald-800 shadow-lg scale-102" },
  { id: "focus", label: "Focus", emoji: "🎯", activeClass: "bg-gradient-to-b from-teal-400 to-cyan-600 text-white border-b-4 border-teal-800 shadow-lg scale-102" },
  { id: "playhouse", label: "Playhouse", emoji: "🎭", activeClass: "bg-gradient-to-b from-violet-400 to-fuchsia-500 text-white border-b-4 border-fuchsia-800 shadow-lg scale-102" },
  { id: "phonics", label: "Phonics", emoji: "🔤", activeClass: "bg-gradient-to-b from-rose-400 to-pink-500 text-white border-b-4 border-pink-700 shadow-lg scale-102" },
  { id: "counting", label: "Counting", emoji: "🔢", activeClass: "bg-gradient-to-b from-indigo-400 to-indigo-600 text-white border-b-4 border-indigo-800 shadow-lg scale-102" },
  { id: "avatar-studio", label: "My Buddy", emoji: "🐾", activeClass: "bg-gradient-to-b from-pink-400 to-purple-500 text-white border-b-4 border-purple-800 shadow-lg scale-102" },
];

export const TODDLER_SPACE_MOBILE_FIRST_ROW = TODDLER_SPACE_TABS.slice(0, 4).map((tab) => tab.id);
