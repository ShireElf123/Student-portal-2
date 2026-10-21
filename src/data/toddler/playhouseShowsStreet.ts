import type { PlayhouseScene, PlayhouseShow } from "./playhouseShows";

function show(meta: Omit<PlayhouseShow, "minutes" | "scenes">, scenes: PlayhouseScene[]): PlayhouseShow {
  return { ...meta, minutes: Math.max(3, Math.ceil(scenes.length / 2)), scenes };
}

/** Street-stoop plays — spoken, not songs, not quizzes. */
export const STREET_PLAYHOUSE_SHOWS: PlayhouseShow[] = [
  show(
    {
      id: "watermelon-too-pink",
      title: "Watermelon Too Pink",
      tagline: "Teddy’s chin is a crime scene. Nana has napkins.",
      coverEmoji: "🍉",
      coverGradient: "from-rose-500 to-lime-700",
    },
    [
      {
        id: "wm-1",
        title: "The Moon",
        setting: "Stoop",
        illustration: "🍉 🏡 🧸",
        bgGradient: "from-lime-100 to-rose-100 text-lime-950",
        lines: [
          { speaker: "Teddy", emoji: "🧸", line: "Nana, this melon is a planet. Planets should be lighter." },
          { speaker: "Nana", emoji: "🧶", line: "It is a Tuesday planet. Sit. We do not drop Tuesday planets." },
        ],
      },
      {
        id: "wm-2",
        title: "The Crack",
        setting: "Napkin",
        illustration: "🍉 💗 ✨",
        bgGradient: "from-rose-100 to-pink-200 text-rose-950",
        lines: [
          { speaker: "Dot", emoji: "🐭", line: "Pink! It was hiding. I respect a good hide." },
          { speaker: "Teddy", emoji: "🧸", line: "I knew. I was being polite about knowing." },
        ],
      },
      {
        id: "wm-3",
        title: "Seeds",
        setting: "Plate",
        illustration: "🖤🖤🖤",
        bgGradient: "from-stone-100 to-rose-100 text-stone-950",
        lines: [
          { speaker: "Nana", emoji: "🧶", line: "Five boats. Count them. Then eat around them like a harbor." },
          { speaker: "Teddy", emoji: "🧸", line: "One two three four five. The harbor is my face." },
        ],
      },
      {
        id: "wm-4",
        title: "Pigeons",
        setting: "Rail",
        illustration: "🐦🐦 🍉",
        bgGradient: "from-stone-200 to-lime-100 text-stone-950",
        lines: [
          { speaker: "Pigeon", emoji: "🐦", line: "We have a union about seeds." },
          { speaker: "Nana", emoji: "🧶", line: "The union can wait. Chins first." },
        ],
      },
      {
        id: "wm-5",
        title: "Napkin",
        setting: "Chin",
        illustration: "🧻 🧸 💗",
        bgGradient: "from-amber-100 to-rose-100 text-amber-950",
        lines: [
          { speaker: "Teddy", emoji: "🧸", line: "I am decorated. This is art." },
          { speaker: "Nana", emoji: "🧶", line: "It is juice. Art goes on paper. Juice goes on napkins." },
        ],
      },
      {
        id: "wm-6",
        title: "Full",
        setting: "Evening stoop",
        illustration: "🏡 🌙 🧸",
        bgGradient: "from-violet-100 to-rose-100 text-violet-950",
        lines: [
          { speaker: "Teddy", emoji: "🧸", line: "My belly is a drum that learned watermelon." },
          { speaker: "Nana", emoji: "🧶", line: "Then the drum can rest. The stoop will remember pink." },
        ],
      },
    ],
  ),
  show(
    {
      id: "gutter-paper-boat",
      title: "Gutter Paper Boat",
      tagline: "Rain makes a river. Teddy makes a captain face.",
      coverEmoji: "⛵",
      coverGradient: "from-sky-500 to-slate-800",
    },
    [
      {
        id: "gb-1",
        title: "Fold",
        setting: "Kitchen table",
        illustration: "📄 ⛵ 🧶",
        bgGradient: "from-amber-50 to-sky-100 text-amber-950",
        lines: [
          { speaker: "Nana", emoji: "🧶", line: "Corner to corner. A roof. Paper used to be a tree, so it already knows water." },
          { speaker: "Teddy", emoji: "🧸", line: "I will be captain of a tree that remembers." },
        ],
      },
      {
        id: "gb-2",
        title: "Launch",
        setting: "Gutter",
        illustration: "⛵ 🌧️ 🧱",
        bgGradient: "from-cyan-100 to-slate-200 text-cyan-950",
        lines: [
          { speaker: "Teddy", emoji: "🧸", line: "It wobbles. Captains wobble. It is in the job." },
          { speaker: "Dot", emoji: "🐭", line: "I will not ride. I am a land mouse with principles." },
        ],
      },
      {
        id: "gb-3",
        title: "Too Fast",
        setting: "Curb",
        illustration: "⛵ 💨 👢",
        bgGradient: "from-indigo-100 to-sky-100 text-indigo-950",
        lines: [
          { speaker: "Teddy", emoji: "🧸", line: "Nana the river is late for something!" },
          { speaker: "Nana", emoji: "🧶", line: "Rivers are always late. My boot is a harbor." },
        ],
      },
      {
        id: "gb-4",
        title: "Rescue",
        setting: "Boot harbor",
        illustration: "👢 ⛵ 🪵",
        bgGradient: "from-amber-100 to-cyan-100 text-amber-950",
        lines: [
          { speaker: "Nana", emoji: "🧶", line: "Stick crane. Come home, wet hero." },
          { speaker: "Teddy", emoji: "🧸", line: "You are soggy and employed. I am proud." },
        ],
      },
      {
        id: "gb-5",
        title: "Sill",
        setting: "Window",
        illustration: "🪟 ⛵ ☀️",
        bgGradient: "from-yellow-50 to-sky-100 text-yellow-950",
        lines: [
          { speaker: "Dot", emoji: "🐭", line: "It is on vacation. Vacations should be dry." },
          { speaker: "Teddy", emoji: "🧸", line: "Tomorrow we will be late rivers again." },
        ],
      },
      {
        id: "gb-6",
        title: "Press",
        setting: "Book",
        illustration: "📖 ⛵ 🌙",
        bgGradient: "from-violet-100 to-sky-100 text-violet-950",
        lines: [
          { speaker: "Nana", emoji: "🧶", line: "Adventures can wait between pages. Pages are patient." },
          { speaker: "Teddy", emoji: "🧸", line: "Good night, boat. Do not sail without me." },
        ],
      },
    ],
  ),
  show(
    {
      id: "tomato-patience",
      title: "Tomato Patience",
      tagline: "Green moons. Then red. Waiting is a flavor.",
      coverEmoji: "🍅",
      coverGradient: "from-red-500 to-lime-800",
    },
    [
      {
        id: "tp-1",
        title: "Dirt",
        setting: "Window box",
        illustration: "🪴 🪟 🧸",
        bgGradient: "from-amber-100 to-lime-100 text-amber-950",
        lines: [
          { speaker: "Teddy", emoji: "🧸", line: "This dirt used to live somewhere else. Now it is ours. Hello, dirt." },
          { speaker: "Nana", emoji: "🧶", line: "Hello is correct. Seeds like manners." },
        ],
      },
      {
        id: "tp-2",
        title: "Nothing",
        setting: "Sill",
        illustration: "⏳ 🌱 👀",
        bgGradient: "from-yellow-100 to-emerald-100 text-yellow-950",
        lines: [
          { speaker: "Dot", emoji: "🐭", line: "I have watched for one whole minute. Nothing. I resign." },
          { speaker: "Nana", emoji: "🧶", line: "Roots are shy. Shy things need more than a minute." },
        ],
      },
      {
        id: "tp-3",
        title: "Thread",
        setting: "Box",
        illustration: "🌱🌱 🧸",
        bgGradient: "from-lime-100 to-emerald-200 text-lime-950",
        lines: [
          { speaker: "Teddy", emoji: "🧸", line: "Tiny. Also Tiny. I have named the children." },
          { speaker: "Nana", emoji: "🧶", line: "Good. Named plants try harder." },
        ],
      },
      {
        id: "tp-4",
        title: "Still Green",
        setting: "August-ish",
        illustration: "🟢 🍅 🪟",
        bgGradient: "from-lime-200 to-yellow-100 text-lime-950",
        lines: [
          { speaker: "Teddy", emoji: "🧸", line: "They are moons that forgot pink." },
          { speaker: "Nana", emoji: "🧶", line: "Wait is a flavor. You will like it later." },
        ],
      },
      {
        id: "tp-5",
        title: "Blush",
        setting: "Morning",
        illustration: "🍅 ❤️ ☀️",
        bgGradient: "from-rose-100 to-red-200 text-rose-950",
        lines: [
          { speaker: "Dot", emoji: "🐭", line: "One of them learned overnight. Show-off." },
          { speaker: "Teddy", emoji: "🧸", line: "I will clap quietly so the others are not embarrassed." },
        ],
      },
      {
        id: "tp-6",
        title: "Salt",
        setting: "Kitchen",
        illustration: "🧂 🍅 🧶",
        bgGradient: "from-orange-100 to-rose-100 text-orange-950",
        lines: [
          { speaker: "Nana", emoji: "🧶", line: "Warm from the window. A pinch. Tuesday tastes like August." },
          { speaker: "Teddy", emoji: "🧸", line: "Thank you, Tiny. Thank you, Also Tiny. Thank you, Show-off." },
        ],
      },
    ],
  ),
  show(
    {
      id: "folding-table-wiggle",
      title: "Folding Table Wiggle",
      tagline: "One leg dances. A napkin makes it sit. Then the block eats.",
      coverEmoji: "🪑",
      coverGradient: "from-amber-400 to-rose-800",
    },
    [
      {
        id: "ft-1",
        title: "Unfold",
        setting: "Sidewalk",
        illustration: "📦 🪑 🧸",
        bgGradient: "from-amber-100 to-stone-200 text-amber-950",
        lines: [
          { speaker: "Teddy", emoji: "🧸", line: "The table was a suitcase. Now it is a meadow. I am impressed." },
          { speaker: "Nana", emoji: "🧶", line: "Legs out. Click. Meadows should not pinch fingers." },
        ],
      },
      {
        id: "ft-2",
        title: "Dancer",
        setting: "One leg",
        illustration: "🦵 🧻 🪑",
        bgGradient: "from-yellow-100 to-rose-100 text-yellow-950",
        lines: [
          { speaker: "Dot", emoji: "🐭", line: "That leg has ambitions." },
          { speaker: "Nana", emoji: "🧶", line: "A napkin under a dancer. Sit, dear." },
        ],
      },
      {
        id: "ft-3",
        title: "Plates",
        setting: "Tabletop",
        illustration: "🍽️🍽️ 🍽️🍽️",
        bgGradient: "from-stone-50 to-amber-100 text-stone-950",
        lines: [
          { speaker: "Teddy", emoji: "🧸", line: "Four moons. They are paper so they will not last. I still like them." },
          { speaker: "Nana", emoji: "🧶", line: "Enough is a kind of lasting." },
        ],
      },
      {
        id: "ft-4",
        title: "Please",
        setting: "Potatoes",
        illustration: "🥔 🙏 🧸",
        bgGradient: "from-orange-100 to-amber-100 text-orange-950",
        lines: [
          { speaker: "Teddy", emoji: "🧸", line: "Please, potatoes." },
          { speaker: "Potatoes", emoji: "🥔", line: "We do not speak. We still heard you." },
        ],
      },
      {
        id: "ft-5",
        title: "Clink",
        setting: "Block",
        illustration: "🥤 🏡 ✨",
        bgGradient: "from-sky-100 to-rose-100 text-sky-950",
        lines: [
          { speaker: "Rosie", emoji: "🚒", line: "I parked like a guest. Guests do not block hydrants even in plays." },
          { speaker: "Nana", emoji: "🧶", line: "The block is a long family for one hour. Clink." },
        ],
      },
      {
        id: "ft-6",
        title: "Suitcase",
        setting: "Dusk",
        illustration: "📦 🌙 🧸",
        bgGradient: "from-indigo-100 to-amber-100 text-indigo-950",
        lines: [
          { speaker: "Teddy", emoji: "🧸", line: "Meadow, be a suitcase. My belly is already a drum." },
          { speaker: "Nana", emoji: "🧶", line: "Fold. The sidewalk will remember the legs." },
        ],
      },
    ],
  ),
];
