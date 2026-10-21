import { MORE_PLAYHOUSE_SHOWS } from "./playhouseShowsMore";
import { STOOP_PLAYHOUSE_SHOWS } from "./playhouseShowsStoop";

export interface PlayhouseLine {
  speaker: string;
  emoji: string;
  line: string;
}

export interface PlayhouseScene {
  id: string;
  title: string;
  setting: string;
  illustration: string;
  bgGradient: string;
  lines: PlayhouseLine[];
}

export interface PlayhouseShow {
  id: string;
  title: string;
  tagline: string;
  coverEmoji: string;
  coverImage?: string;
  coverGradient: string;
  minutes: number;
  scenes: PlayhouseScene[];
}

export function show(meta: Omit<PlayhouseShow, "minutes" | "scenes">, scenes: PlayhouseScene[]): PlayhouseShow {
  return { ...meta, minutes: Math.max(3, Math.ceil(scenes.length / 2)), scenes };
}

/** Spoken plays with a recurring cast — not quizzes, not songs. */
export const PLAYHOUSE_SHOWS: PlayhouseShow[] = [
  show(
    {
      id: "teddy-loose-button",
      title: "Teddy’s Loose Button",
      tagline: "Nana sews. Teddy holds still. The button stays.",
      coverEmoji: "🧸",
      coverGradient: "from-amber-400 to-rose-500",
    },
    [
      {
        id: "tb-1",
        title: "A Wiggle",
        setting: "Kitchen chair",
        illustration: "🧸 🔘 🪑",
        bgGradient: "from-amber-100 to-orange-200 text-amber-950",
        lines: [
          { speaker: "Teddy", emoji: "🧸", line: "Nana, my belly button of the coat is doing a little dance." },
          { speaker: "Nana", emoji: "🧶", line: "That is a coat button, dear. Sit. We do not chase dancing buttons down the stairs." },
        ],
      },
      {
        id: "tb-2",
        title: "The Tin",
        setting: "Sewing tin",
        illustration: "🧵 📦 🔘",
        bgGradient: "from-rose-100 to-amber-100 text-rose-950",
        lines: [
          { speaker: "Nana", emoji: "🧶", line: "Red thread. The cousin of this button. Hold the coat like a quiet hill." },
          { speaker: "Teddy", emoji: "🧸", line: "I am a hill. Hills do not wiggle. Hills almost do not wiggle." },
        ],
      },
      {
        id: "tb-3",
        title: "In and Out",
        setting: "Needle song",
        illustration: "🪡 🧥 ✨",
        bgGradient: "from-yellow-100 to-lime-100 text-yellow-950",
        lines: [
          { speaker: "Nana", emoji: "🧶", line: "In. Out. In. The needle writes a tiny road." },
          { speaker: "Teddy", emoji: "🧸", line: "The button is listening. I can feel it deciding to stay." },
        ],
      },
      {
        id: "tb-4",
        title: "A Knot Like a Hug",
        setting: "Last stitch",
        illustration: "🪢 💛 🧸",
        bgGradient: "from-orange-100 to-rose-200 text-orange-950",
        lines: [
          { speaker: "Nana", emoji: "🧶", line: "A knot is a hug that does not let go." },
          { speaker: "Teddy", emoji: "🧸", line: "Thank you, hug. Thank you, Nana. Coat, you may go outside again." },
        ],
      },
      {
        id: "tb-5",
        title: "The Test",
        setting: "Porch",
        illustration: "🚪 🌬️ 🧸",
        bgGradient: "from-sky-100 to-amber-100 text-sky-950",
        lines: [
          { speaker: "Teddy", emoji: "🧸", line: "Wind, you may try. Button is home." },
          { speaker: "Nana", emoji: "🧶", line: "Home is a stitch and a sitting-still. Come sip lemon ice." },
        ],
      },
      {
        id: "tb-6",
        title: "Bow",
        setting: "Curtain",
        illustration: "🎭 🧸 🧶",
        bgGradient: "from-violet-100 to-amber-200 text-violet-950",
        lines: [
          { speaker: "Teddy", emoji: "🧸", line: "The coat takes a bow. The button takes a smaller bow." },
          { speaker: "Nana", emoji: "🧶", line: "And Nana takes the sewing tin back to sleep." },
        ],
      },
    ],
  ),
  show(
    {
      id: "rosie-quiet-bell",
      title: "Rosie’s Quiet Bell",
      tagline: "The firehouse practices a whisper alarm for a sleeping cat.",
      coverEmoji: "🚒",
      coverGradient: "from-red-500 to-amber-400",
    },
    [
      {
        id: "rq-1",
        title: "Nap on the Hose",
        setting: "Garage",
        illustration: "🐱 🚒 😴",
        bgGradient: "from-red-100 to-orange-100 text-red-950",
        lines: [
          { speaker: "Pepper", emoji: "🐱", line: "I am not stuck. I am practicing horizontal." },
          { speaker: "Rosie", emoji: "🚒", line: "Practice on the hose, little captain. The bell is on vacation until you wake." },
        ],
      },
      {
        id: "rq-2",
        title: "A Maybe Call",
        setting: "Wall bell",
        illustration: "🔔 🤫 🚒",
        bgGradient: "from-amber-100 to-red-100 text-amber-950",
        lines: [
          { speaker: "Bell", emoji: "🔔", line: "I could clang. I am excellent at clang." },
          { speaker: "Rosie", emoji: "🚒", line: "Today we try a quiet bell. A blink. A hush. Pepper is in rehearsal." },
        ],
      },
      {
        id: "rq-3",
        title: "Lights Only",
        setting: "Maple Street",
        illustration: "🚨 🌙 📫",
        bgGradient: "from-indigo-100 to-red-100 text-indigo-950",
        lines: [
          { speaker: "Rosie", emoji: "🚒", line: "Lights like fireflies. No shout. The bakery can keep sleeping." },
          { speaker: "Mailbox", emoji: "📫", line: "I wore a snow hat in winter. I can wear quiet now." },
        ],
      },
      {
        id: "rq-4",
        title: "False Alarm Kindness",
        setting: "Oak",
        illustration: "🌳 🐱 🚒",
        bgGradient: "from-emerald-100 to-lime-100 text-emerald-950",
        lines: [
          { speaker: "Rosie", emoji: "🚒", line: "Nobody is stuck. We came to check. Checking is also helping." },
          { speaker: "Pepper", emoji: "🐱", line: "I stretched. I am un-horizontal. Thank you for not clanging my ears." },
        ],
      },
      {
        id: "rq-5",
        title: "Rainbow Anyway",
        setting: "Yard",
        illustration: "💦 🌈 🐱",
        bgGradient: "from-cyan-100 to-sky-200 text-cyan-950",
        lines: [
          { speaker: "Rosie", emoji: "🚒", line: "A soft spray. Not a fire. A thank-you rainbow." },
          { speaker: "Pepper", emoji: "🐱", line: "I do not like baths. I like sparkle beside baths." },
        ],
      },
      {
        id: "rq-6",
        title: "Garage Blanket",
        setting: "Home bay",
        illustration: "🚒 🛏️ 🔔",
        bgGradient: "from-slate-200 to-red-100 text-slate-900",
        lines: [
          { speaker: "Bell", emoji: "🔔", line: "I saved my clang for a true day." },
          { speaker: "Rosie", emoji: "🚒", line: "Good. Rest is a kind of ready." },
        ],
      },
    ],
  ),
  show(
    {
      id: "dot-first-whisper",
      title: "Dot’s First Whisper",
      tagline: "A library mouse learns the feather voice.",
      coverEmoji: "📚",
      coverGradient: "from-amber-500 to-indigo-600",
    },
    [
      {
        id: "df-1",
        title: "Whoosh Doors",
        setting: "Library",
        illustration: "🐭 🚪 📖",
        bgGradient: "from-amber-100 to-orange-100 text-amber-950",
        lines: [
          { speaker: "Dot", emoji: "🐭", line: "HELLO LIBRARY I HAVE A CARD—" },
          { speaker: "Owl", emoji: "🦉", line: "Inside voices are feathers, Dot. Try again, smaller." },
        ],
      },
      {
        id: "df-2",
        title: "Feather Take Two",
        setting: "Desk",
        illustration: "🤫 🪪 🦉",
        bgGradient: "from-violet-100 to-amber-100 text-violet-950",
        lines: [
          { speaker: "Dot", emoji: "🐭", line: "Hello, library. I have a card." },
          { speaker: "Owl", emoji: "🦉", line: "Hello, Dot. The low sunny row is waiting." },
        ],
      },
      {
        id: "df-3",
        title: "Lion Cover",
        setting: "Story rug",
        illustration: "🦁 📗 🧸",
        bgGradient: "from-yellow-100 to-amber-200 text-amber-950",
        lines: [
          { speaker: "Dot", emoji: "🐭", line: "This lion looks like listening, not chasing." },
          { speaker: "Lion", emoji: "🦁", line: "I roar on pages. On rugs I sit. Sit with me." },
        ],
      },
      {
        id: "df-4",
        title: "Stamp Kiss",
        setting: "Counter",
        illustration: "📮 ⭐ 🐭",
        bgGradient: "from-rose-100 to-indigo-100 text-rose-950",
        lines: [
          { speaker: "Owl", emoji: "🦉", line: "Stamp. Two weeks. The ticket is magic again." },
          { speaker: "Dot", emoji: "🐭", line: "I will not shout the story on the bus. I will look." },
        ],
      },
      {
        id: "df-5",
        title: "Bus Lap",
        setting: "Night bus",
        illustration: "🚌 📗 🪟",
        bgGradient: "from-sky-100 to-indigo-200 text-sky-950",
        lines: [
          { speaker: "Beep", emoji: "🚌", line: "Hold the book like a sleepy puppy. I know every corner." },
          { speaker: "Dot", emoji: "🐭", line: "The lion looked back. I looked back. Nobody shouted." },
        ],
      },
      {
        id: "df-6",
        title: "Lamp Moon",
        setting: "Home",
        illustration: "💡 🦁 🌙",
        bgGradient: "from-indigo-200 to-violet-300 text-indigo-950",
        lines: [
          { speaker: "Dot", emoji: "🐭", line: "One more page. Then the lion sleeps." },
          { speaker: "Lion", emoji: "🦁", line: "Click. Even paper moons get to rest." },
        ],
      },
    ],
  ),
  show(
    {
      id: "momo-snow-phone",
      title: "Momo’s Snow Phone",
      tagline: "A mitten is not a telephone. The plow still says hello.",
      coverEmoji: "🧤",
      coverGradient: "from-sky-400 to-indigo-600",
    },
    [
      {
        id: "ms-1",
        title: "Glass Nose",
        setting: "Maple Street window",
        illustration: "🐭 🪟 ❄️",
        bgGradient: "from-sky-100 to-slate-200 text-sky-950",
        lines: [
          { speaker: "Momo", emoji: "🐭", line: "The street put on a white coat. I will call the plow on my mitten." },
          { speaker: "Mitten", emoji: "🧤", line: "I am wool. I do not have numbers. I have thumbs." },
        ],
      },
      {
        id: "ms-2",
        title: "Crunch",
        setting: "Path",
        illustration: "🐾 📫 ⛄",
        bgGradient: "from-slate-100 to-sky-200 text-slate-900",
        lines: [
          { speaker: "Momo", emoji: "🐭", line: "Crunch is my ringtone." },
          { speaker: "Mailbox", emoji: "📫", line: "I am wearing a hat. I accept crunch mail." },
        ],
      },
      {
        id: "ms-3",
        title: "Three Balls",
        setting: "Yard",
        illustration: "⚪⚪⚪ 🥕",
        bgGradient: "from-white to-sky-200 text-sky-950",
        lines: [
          { speaker: "Momo", emoji: "🐭", line: "Small, middle, big. You are a pal. Pal, hold my mitten-phone." },
          { speaker: "Snow pal", emoji: "⛄", line: "I have pebble ears. I hear the plow without buttons." },
        ],
      },
      {
        id: "ms-4",
        title: "Yellow Hello",
        setting: "Road",
        illustration: "🚜 👋 ✨",
        bgGradient: "from-yellow-100 to-sky-200 text-yellow-950",
        lines: [
          { speaker: "Plow", emoji: "🚜", line: "I do not need a call. I have a route. Wave." },
          { speaker: "Momo", emoji: "🐭", line: "Wave is a better phone. Two mittens. One hello." },
        ],
      },
      {
        id: "ms-5",
        title: "Cocoa Steam",
        setting: "Kitchen",
        illustration: "☕ ☁️ 🧦",
        bgGradient: "from-amber-100 to-orange-100 text-amber-950",
        lines: [
          { speaker: "Momo", emoji: "🐭", line: "The mitten-phone is drying. It smells like snow and cocoa." },
          { speaker: "Mitten", emoji: "🧤", line: "I told you. Wool. Not numbers. Warm thumbs." },
        ],
      },
      {
        id: "ms-6",
        title: "Lamps",
        setting: "Evening",
        illustration: "🏮 ⛄ 🌙",
        bgGradient: "from-indigo-200 to-slate-300 text-indigo-950",
        lines: [
          { speaker: "Snow pal", emoji: "⛄", line: "I will keep watch. You may sleep without calling anyone." },
          { speaker: "Momo", emoji: "🐭", line: "Goodnight, route. Goodnight, thumbs." },
        ],
      },
    ],
  ),
  show(
    {
      id: "beep-last-seat",
      title: "Beep’s Last Seat",
      tagline: "The night bus saves one snug hill for a sleepy backpack.",
      coverEmoji: "🚌",
      coverGradient: "from-indigo-600 to-amber-400",
    },
    [
      {
        id: "bl-1",
        title: "Pssh",
        setting: "Stop",
        illustration: "🚌 🚏 🌃",
        bgGradient: "from-indigo-900 to-slate-900 text-indigo-50",
        lines: [
          { speaker: "Beep", emoji: "🚌", line: "Doors like arms. Come in. The city is a standing picture book." },
          { speaker: "Backpack", emoji: "🎒", line: "I am not a puppy. I am a backpack. I would like a seat anyway." },
        ],
      },
      {
        id: "bl-2",
        title: "Blue Hills",
        setting: "Aisle",
        illustration: "💺 🎒 🌙",
        bgGradient: "from-blue-900 to-indigo-950 text-blue-50",
        lines: [
          { speaker: "Beep", emoji: "🚌", line: "Seats are blue hills. Sit snug. I wait." },
          { speaker: "Backpack", emoji: "🎒", line: "Snug. The zippers promise to be quiet." },
        ],
      },
      {
        id: "bl-3",
        title: "Three Dings",
        setting: "Route",
        illustration: "🔔 🍐 1️⃣2️⃣3️⃣",
        bgGradient: "from-amber-900 to-indigo-950 text-amber-50",
        lines: [
          { speaker: "Beep", emoji: "🚌", line: "Ding. Ding. Ding. Pears got off. You stay." },
          { speaker: "Backpack", emoji: "🎒", line: "I am not pears. I am going to the tree stop." },
        ],
      },
      {
        id: "bl-4",
        title: "River Ribbon",
        setting: "Bridge",
        illustration: "🌉 🌙 💧",
        bgGradient: "from-slate-900 to-blue-950 text-slate-50",
        lines: [
          { speaker: "Beep", emoji: "🚌", line: "Moon copies itself in the water. We copy nothing. We just cross." },
          { speaker: "Backpack", emoji: "🎒", line: "I looked. I did not shout. Dot would be proud." },
        ],
      },
      {
        id: "bl-5",
        title: "Your Tree",
        setting: "Stoop",
        illustration: "🌳 🚪 🚌",
        bgGradient: "from-emerald-950 to-indigo-950 text-emerald-50",
        lines: [
          { speaker: "Beep", emoji: "🚌", line: "Ding. Your tree. Night air is a cool washcloth." },
          { speaker: "Backpack", emoji: "🎒", line: "Thank you for the last seat. I will be a backpack on a hook now." },
        ],
      },
      {
        id: "bl-6",
        title: "Lamps Shrink",
        setting: "Block",
        illustration: "🚌 🌙 💤",
        bgGradient: "from-indigo-950 to-black text-indigo-50",
        lines: [
          { speaker: "Beep", emoji: "🚌", line: "Sleep is the last stop. I keep the route for the moon." },
          { speaker: "Moon", emoji: "🌙", line: "I keep the route for you." },
        ],
      },
    ],
  ),
  show(
    {
      id: "stamp-rain-letter",
      title: "Stamp and the Rain Letter",
      tagline: "A wet name, a flower sticker, house three.",
      coverEmoji: "🚚",
      coverGradient: "from-blue-500 to-amber-400",
    },
    [
      {
        id: "sr-1",
        title: "No Chewing",
        setting: "Tray",
        illustration: "✉️ 🐶 📮",
        bgGradient: "from-sky-100 to-amber-100 text-sky-950",
        lines: [
          { speaker: "Stamp", emoji: "🐶", line: "Letters smell like far-away kitchens. I will sniff. I will not chew." },
          { speaker: "Truck", emoji: "🚚", line: "That is the mail rule. Buckle. Yellow door first." },
        ],
      },
      {
        id: "sr-2",
        title: "Slot Hello",
        setting: "Yellow door",
        illustration: "📬 💛 ✉️",
        bgGradient: "from-amber-100 to-lime-100 text-amber-950",
        lines: [
          { speaker: "Truck", emoji: "🚚", line: "It fits like a hello. Wag." },
          { speaker: "Stamp", emoji: "🐶", line: "Wag. The door does not need to open yet." },
        ],
      },
      {
        id: "sr-3",
        title: "Rain on a Name",
        setting: "Street",
        illustration: "🌧️ ✉️ 🌸",
        bgGradient: "from-slate-100 to-rose-100 text-slate-900",
        lines: [
          { speaker: "Stamp", emoji: "🐶", line: "This name melted. I can still smell a flower sticker." },
          { speaker: "Truck", emoji: "🚚", line: "House three has that sticker. Match. Do not rush the steps." },
        ],
      },
      {
        id: "sr-4",
        title: "House Three",
        setting: "Stoop",
        illustration: "🏠 3️⃣ 🌸",
        bgGradient: "from-rose-100 to-orange-100 text-rose-950",
        lines: [
          { speaker: "Stamp", emoji: "🐶", line: "Found you, letter. You were only rainy, not lost." },
          { speaker: "Letter", emoji: "✉️", line: "I am thin and proud again." },
        ],
      },
      {
        id: "sr-5",
        title: "Water Bowl",
        setting: "Neighbor",
        illustration: "🥣 💧 ❤️",
        bgGradient: "from-cyan-100 to-blue-100 text-cyan-950",
        lines: [
          { speaker: "Stamp", emoji: "🐶", line: "Kindness is a rest stop. Lick lick." },
          { speaker: "Truck", emoji: "🚚", line: "Then the last letter. Nana. Sit extra straight." },
        ],
      },
      {
        id: "sr-6",
        title: "Empty Tray",
        setting: "Sunset",
        illustration: "📭 🚚 🌅",
        bgGradient: "from-orange-200 to-sky-200 text-orange-950",
        lines: [
          { speaker: "Truck", emoji: "🚚", line: "Empty as a finished book. Hum home." },
          { speaker: "Stamp", emoji: "🐶", line: "Tomorrow the paper weather returns. I will still not chew." },
        ],
      },
    ],
  ),
  show(
    {
      id: "gully-captain-cat",
      title: "Gully and the Captain Cat",
      tagline: "A gull waits. A cat keeps the crate. The lighthouse blinks anyway.",
      coverEmoji: "⚓",
      coverGradient: "from-cyan-400 to-slate-600",
    },
    [
      {
        id: "gc-1",
        title: "Fog Hat",
        setting: "Piling",
        illustration: "🐦 🪵 🌫️",
        bgGradient: "from-slate-200 to-cyan-200 text-slate-900",
        lines: [
          { speaker: "Gully", emoji: "🐦", line: "The harbor wore a fog hat. I am a comma on a piling." },
          { speaker: "Water", emoji: "💧", line: "Tick. Tick. I keep time on the wood." },
        ],
      },
      {
        id: "gc-2",
        title: "Red Tug",
        setting: "Channel",
        illustration: "🚢 🟥 📦",
        bgGradient: "from-red-100 to-cyan-100 text-red-950",
        lines: [
          { speaker: "Tug", emoji: "🚢", line: "My job is push with patience. Follow if you can wait." },
          { speaker: "Gully", emoji: "🐦", line: "Waiting is a harbor skill. I am enrolled." },
        ],
      },
      {
        id: "gc-3",
        title: "The Crate",
        setting: "Market dock",
        illustration: "🍋 🐱 🪢",
        bgGradient: "from-amber-100 to-cyan-100 text-amber-950",
        lines: [
          { speaker: "Captain Cat", emoji: "🐱", line: "This crate is my ship. Lemons are cargo. You may salute." },
          { speaker: "Gully", emoji: "🐦", line: "Salute. I will not steal lemons. I would like a crust later." },
        ],
      },
      {
        id: "gc-4",
        title: "Lighthouse Practice",
        setting: "Morning",
        illustration: "🗼 💡 🚢",
        bgGradient: "from-yellow-100 to-indigo-200 text-indigo-950",
        lines: [
          { speaker: "Lighthouse", emoji: "🗼", line: "On. Off. On. I practice even when the fog is only a rumor." },
          { speaker: "Gully", emoji: "🐦", line: "Ships like a steady friend. I like that too." },
        ],
      },
      {
        id: "gc-5",
        title: "Crust",
        setting: "Dock",
        illustration: "🍞 🐦 💛",
        bgGradient: "from-orange-100 to-rose-100 text-orange-950",
        lines: [
          { speaker: "Captain Cat", emoji: "🐱", line: "A crust is not a feast. It is enough. Gravel thank-you accepted." },
          { speaker: "Gully", emoji: "🐦", line: "Kaa. Enough is a harbor word." },
        ],
      },
      {
        id: "gc-6",
        title: "Red Period",
        setting: "Piling again",
        illustration: "🪵 🚢 ☀️",
        bgGradient: "from-cyan-100 to-amber-100 text-cyan-950",
        lines: [
          { speaker: "Tug", emoji: "🚢", line: "I am a red period at the end of morning." },
          { speaker: "Gully", emoji: "🐦", line: "I land. I fold. Fog hat thinner." },
        ],
      },
    ],
  ),
  show(
    {
      id: "kindness-wagon-play",
      title: "The Kindness Wagon Play",
      tagline: "Notes, pears, a snail in the shade.",
      coverEmoji: "🛒",
      coverGradient: "from-lime-400 to-rose-400",
    },
    [
      {
        id: "kw-1",
        title: "Empty Rectangle",
        setting: "Stoop",
        illustration: "🛒 ❤️ 🏡",
        bgGradient: "from-rose-100 to-amber-100 text-rose-950",
        lines: [
          { speaker: "Wagon", emoji: "🛒", line: "I am a red rectangle with kind wheels. I would like a job." },
          { speaker: "Benny", emoji: "🐻", line: "Notes first. Paper hugs. Not rocks." },
        ],
      },
      {
        id: "kw-2",
        title: "Three Pears",
        setting: "Bowl",
        illustration: "🍐 🍐 🍐",
        bgGradient: "from-lime-100 to-yellow-100 text-lime-950",
        lines: [
          { speaker: "Benny", emoji: "🐻", line: "One, two, three. Shy bells of fruit." },
          { speaker: "Wagon", emoji: "🛒", line: "I will not eat them. I will carry them like secrets." },
        ],
      },
      {
        id: "kw-3",
        title: "Gardener",
        setting: "First stoop",
        illustration: "🪴 💌 🍐",
        bgGradient: "from-emerald-100 to-lime-200 text-emerald-950",
        lines: [
          { speaker: "Benny", emoji: "🐻", line: "A note and a pear. You look tired in a proud way." },
          { speaker: "Wagon", emoji: "🛒", line: "I feel lighter and bigger. That is a wagon mystery." },
        ],
      },
      {
        id: "kw-4",
        title: "Mail Pup",
        setting: "Corner",
        illustration: "🐶 🥣 💧",
        bgGradient: "from-sky-100 to-blue-100 text-sky-950",
        lines: [
          { speaker: "Stamp", emoji: "🐶", line: "Water first. Hats later." },
          { speaker: "Benny", emoji: "🐻", line: "Kindness is a rest stop. We learned that from you." },
        ],
      },
      {
        id: "kw-5",
        title: "Last Cup Shade",
        setting: "Heat",
        illustration: "🐌 🥤 🌳",
        bgGradient: "from-emerald-100 to-amber-100 text-emerald-950",
        lines: [
          { speaker: "Benny", emoji: "🐻", line: "Snail, the last lemonade lives in the shade." },
          { speaker: "Snail", emoji: "🐌", line: "I am slow on purpose. Thank you for matching my speed." },
        ],
      },
      {
        id: "kw-6",
        title: "Shade Nap",
        setting: "Tree",
        illustration: "🛒 😴 🌳",
        bgGradient: "from-amber-200 to-lime-200 text-amber-950",
        lines: [
          { speaker: "Wagon", emoji: "🛒", line: "Empty wagon. Full block. I nap." },
          { speaker: "Benny", emoji: "🐻", line: "You were the kindness today. Wheels, rest." },
        ],
      },
    ],
  ),
  ...MORE_PLAYHOUSE_SHOWS,
  ...STOOP_PLAYHOUSE_SHOWS,
];
