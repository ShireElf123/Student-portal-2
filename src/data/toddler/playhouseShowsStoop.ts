import type { PlayhouseScene, PlayhouseShow } from "./playhouseShows";

function show(meta: Omit<PlayhouseShow, "minutes" | "scenes">, scenes: PlayhouseScene[]): PlayhouseShow {
  return { ...meta, minutes: Math.max(3, Math.ceil(scenes.length / 2)), scenes };
}

export const STOOP_PLAYHOUSE_SHOWS: PlayhouseShow[] = [
  show(
    {
      id: "toast-too-loud",
      title: "Toast Too Loud",
      tagline: "The toaster pops. Teddy jumps. Breakfast still happens.",
      coverEmoji: "🍞",
      coverGradient: "from-amber-400 to-rose-700",
    },
    [
      {
        id: "tt-1",
        title: "The Slots",
        setting: "Kitchen",
        illustration: "🍞 🔧 🧸",
        bgGradient: "from-amber-100 to-orange-200 text-amber-950",
        lines: [
          { speaker: "Teddy", emoji: "🧸", line: "The toaster has two mouths. I respect mouths that wait." },
          { speaker: "Nana", emoji: "🎀", line: "Bread goes in. Patience comes out. Sometimes loudly." },
        ],
      },
      {
        id: "tt-2",
        title: "The Wait",
        setting: "Counter",
        illustration: "⏳ 🍞 👀",
        bgGradient: "from-yellow-100 to-amber-100 text-yellow-950",
        lines: [
          { speaker: "Dot", emoji: "🐭", line: "I am watching the slots. Watching is a job." },
          { speaker: "Teddy", emoji: "🧸", line: "I am also watching. I am worse at it." },
        ],
      },
      {
        id: "tt-3",
        title: "Pop",
        setting: "Air",
        illustration: "🍞 💥 🧸",
        bgGradient: "from-rose-100 to-amber-200 text-rose-950",
        lines: [
          { speaker: "Toaster", emoji: "🔧", line: "Pop. That is my whole word." },
          { speaker: "Teddy", emoji: "🧸", line: "I jumped. Jumping is allowed. The toast is not chasing us." },
        ],
      },
      {
        id: "tt-4",
        title: "Butter Lake",
        setting: "Plate",
        illustration: "🍞 🍞 🍽️",
        bgGradient: "from-yellow-100 to-lime-100 text-yellow-950",
        lines: [
          { speaker: "Nana", emoji: "🎀", line: "Butter is a yellow lake. Spread. Do not swim." },
          { speaker: "Dot", emoji: "🐭", line: "I will not swim. I am a guest of toast." },
        ],
      },
      {
        id: "tt-5",
        title: "Jam Dot",
        setting: "Jar",
        illustration: "🍓 🍞 🥄",
        bgGradient: "from-rose-100 to-yellow-100 text-rose-950",
        lines: [
          { speaker: "Teddy", emoji: "🧸", line: "A red moon of jam. I name it Dot, which may be confusing." },
          { speaker: "Dot", emoji: "🐭", line: "I allow it. There is room in the world for two Dots." },
        ],
      },
      {
        id: "tt-6",
        title: "Quiet Plate",
        setting: "Table",
        illustration: "🍽️ 🍞 💛",
        bgGradient: "from-orange-100 to-amber-100 text-orange-950",
        lines: [
          { speaker: "Nana", emoji: "🎀", line: "The toaster is done talking. We may chew." },
          { speaker: "Teddy", emoji: "🧸", line: "Thank you, loud machine. Breakfast still happened." },
        ],
      },
    ],
  ),
  show(
    {
      id: "elevator-please",
      title: "Elevator Please",
      tagline: "A button, a wait, a ding, and doors that have manners.",
      coverEmoji: "🏢",
      coverGradient: "from-slate-400 to-indigo-800",
    },
    [
      {
        id: "el-1",
        title: "The Button",
        setting: "Lobby",
        illustration: "🔘 🏢 🧸",
        bgGradient: "from-slate-100 to-yellow-100 text-slate-900",
        lines: [
          { speaker: "Teddy", emoji: "🧸", line: "The button is a circle that calls a room." },
          { speaker: "Nana", emoji: "🎀", line: "Press once. Twice does not make it kinder." },
        ],
      },
      {
        id: "el-2",
        title: "The Wait",
        setting: "Doors",
        illustration: "🚪 ⏳ 👀",
        bgGradient: "from-amber-100 to-slate-200 text-amber-950",
        lines: [
          { speaker: "Dot", emoji: "🐭", line: "Waiting is a hallway sport. I am good at it." },
          { speaker: "Teddy", emoji: "🧸", line: "I am practicing. My paws want to press again. They will not." },
        ],
      },
      {
        id: "el-3",
        title: "Ding",
        setting: "Arrival",
        illustration: "🔔 🚪 ✨",
        bgGradient: "from-yellow-100 to-sky-100 text-yellow-950",
        lines: [
          { speaker: "Elevator", emoji: "🏢", line: "Ding. I have arrived. Please do not run." },
          { speaker: "Rosie", emoji: "🚒", line: "Walk. Doors have opinions about running. I respect doors." },
        ],
      },
      {
        id: "el-4",
        title: "Inside Box",
        setting: "Cabin",
        illustration: "📦 🧸 🔘",
        bgGradient: "from-sky-100 to-slate-200 text-sky-950",
        lines: [
          { speaker: "Teddy", emoji: "🧸", line: "We are in a traveling closet. I like closets that move." },
          { speaker: "Nana", emoji: "🎀", line: "Hold the rail. The closet leans like a ferry that decided to be a room." },
        ],
      },
      {
        id: "el-5",
        title: "Three",
        setting: "Buttons",
        illustration: "3️⃣ 🔘 🏢",
        bgGradient: "from-lime-100 to-yellow-100 text-lime-950",
        lines: [
          { speaker: "Dot", emoji: "🐭", line: "Three is our floor. Numbers are addresses for air." },
          { speaker: "Teddy", emoji: "🧸", line: "I pressed three. Once. I am proud of once." },
        ],
      },
      {
        id: "el-6",
        title: "Doors Open",
        setting: "Hall",
        illustration: "🚪 🏡 💛",
        bgGradient: "from-orange-100 to-slate-100 text-orange-950",
        lines: [
          { speaker: "Elevator", emoji: "🏢", line: "Your stop is a name. I stay and collect other mornings." },
          { speaker: "Teddy", emoji: "🧸", line: "Thank you, traveling closet. We had this ride." },
        ],
      },
    ],
  ),
  show(
    {
      id: "library-lion-nap",
      title: "Library Lion Nap",
      tagline: "Stone paws, a quiet room, and Dot who already knows the rules.",
      coverEmoji: "🦁",
      coverGradient: "from-amber-500 to-stone-800",
    },
    [
      {
        id: "ll-1",
        title: "Stone Paws",
        setting: "Steps",
        illustration: "🦁 🏡 📚",
        bgGradient: "from-amber-100 to-stone-200 text-amber-950",
        lines: [
          { speaker: "Teddy", emoji: "🧸", line: "The lion is a statue. Statues nap with their eyes open." },
          { speaker: "Dot", emoji: "🐭", line: "I have a cousin who lives in the stacks. Different nap." },
        ],
      },
      {
        id: "ll-2",
        title: "Whoosh Doors",
        setting: "Entrance",
        illustration: "🚪 🌬️ 🤫",
        bgGradient: "from-sky-100 to-amber-100 text-sky-950",
        lines: [
          { speaker: "Nana", emoji: "🎀", line: "The doors whoosh. Then we borrow the quiet." },
          { speaker: "Teddy", emoji: "🧸", line: "I can be quiet. Watch my paws. They are almost quiet." },
        ],
      },
      {
        id: "ll-3",
        title: "The Whisper",
        setting: "Desk",
        illustration: "🤫 📚 🧸",
        bgGradient: "from-yellow-100 to-lime-100 text-yellow-950",
        lines: [
          { speaker: "Dot", emoji: "🐭", line: "Whisper is a voice that sits down." },
          { speaker: "Teddy", emoji: "🧸", line: "Hello, sitting voice. I am looking for the thin attic book’s cousins." },
        ],
      },
      {
        id: "ll-4",
        title: "Stamp Kiss",
        setting: "Date stamp",
        illustration: "📮 📗 💋",
        bgGradient: "from-rose-100 to-amber-100 text-rose-950",
        lines: [
          { speaker: "Stamp", emoji: "📮", line: "I am a kiss that paid. Due date is a promise." },
          { speaker: "Nana", emoji: "🎀", line: "We keep promises. Books like coming home twice." },
        ],
      },
      {
        id: "ll-5",
        title: "Lion Cover",
        setting: "Picture books",
        illustration: "📗 🦁 🧸",
        bgGradient: "from-orange-100 to-yellow-100 text-orange-950",
        lines: [
          { speaker: "Teddy", emoji: "🧸", line: "This lion is listening. Same as the attic. I trust listening lions." },
          { speaker: "Dot", emoji: "🐭", line: "Take it. Leave the stone one. He has a shift." },
        ],
      },
      {
        id: "ll-6",
        title: "Steps Down",
        setting: "Outside",
        illustration: "🦁 📚 ☀️",
        bgGradient: "from-amber-200 to-sky-100 text-amber-950",
        lines: [
          { speaker: "Lion", emoji: "🦁", line: "I nap. You borrowed. Both jobs are good." },
          { speaker: "Teddy", emoji: "🧸", line: "Thank you, stone nap. We will bring the paper lion back." },
        ],
      },
    ],
  ),
  show(
    {
      id: "laundry-line-talk",
      title: "Laundry Line Talk",
      tagline: "Pegs, a shirt like a flag, and wind that does the work.",
      coverEmoji: "👕",
      coverGradient: "from-sky-400 to-amber-600",
    },
    [
      {
        id: "ln-1",
        title: "The Basket",
        setting: "Yard",
        illustration: "👜 👕 🧸",
        bgGradient: "from-sky-100 to-amber-100 text-sky-950",
        lines: [
          { speaker: "Teddy", emoji: "🧸", line: "The basket is a boat of wet flags." },
          { speaker: "Nana", emoji: "🎀", line: "Not flags yet. They become flags on the line." },
        ],
      },
      {
        id: "ln-2",
        title: "The Line",
        setting: "Backyard",
        illustration: "🎀 🌤️ 🏡",
        bgGradient: "from-lime-100 to-sky-200 text-lime-950",
        lines: [
          { speaker: "Line", emoji: "🎀", line: "I am a road in the air. Hang things. I will hold." },
          { speaker: "Dot", emoji: "🐭", line: "I cannot hang. I am a guest of gravity." },
        ],
      },
      {
        id: "ln-3",
        title: "Pegs",
        setting: "Bag",
        illustration: "📌 👕 ✋",
        bgGradient: "from-yellow-100 to-rose-100 text-yellow-950",
        lines: [
          { speaker: "Nana", emoji: "🎀", line: "A peg is a little mouth that bites cloth, not fingers." },
          { speaker: "Teddy", emoji: "🧸", line: "I will not feed it my paw. I thought about it. I will not." },
        ],
      },
      {
        id: "ln-4",
        title: "Shirt Flag",
        setting: "Line",
        illustration: "👕 🌬️ ☀️",
        bgGradient: "from-orange-100 to-sky-100 text-orange-950",
        lines: [
          { speaker: "Shirt", emoji: "👕", line: "I am a flag now. I do not mean anything. I mean dry." },
          { speaker: "Teddy", emoji: "🧸", line: "Dry is a good meaning." },
        ],
      },
      {
        id: "ln-5",
        title: "Sock Pair",
        setting: "Line",
        illustration: "👟👟 🎀 💛",
        bgGradient: "from-rose-100 to-lime-100 text-rose-950",
        lines: [
          { speaker: "Dot", emoji: "🐭", line: "Two socks. They should stay cousins." },
          { speaker: "Nana", emoji: "🎀", line: "Peg them together. Families can share a clip." },
        ],
      },
      {
        id: "ln-6",
        title: "Wind Work",
        setting: "Afternoon",
        illustration: "🌬️ 👜 🏡",
        bgGradient: "from-sky-200 to-amber-100 text-sky-950",
        lines: [
          { speaker: "Wind", emoji: "🌬️", line: "I work. You may sit. Sitting is allowed." },
          { speaker: "Teddy", emoji: "🧸", line: "Thank you, working weather. We hung. You dry." },
        ],
      },
    ],
  ),
];
