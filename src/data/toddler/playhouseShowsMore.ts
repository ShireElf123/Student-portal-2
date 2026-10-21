import type { PlayhouseScene, PlayhouseShow } from "./playhouseShows";

function show(meta: Omit<PlayhouseShow, "minutes" | "scenes">, scenes: PlayhouseScene[]): PlayhouseShow {
  return { ...meta, minutes: Math.max(3, Math.ceil(scenes.length / 2)), scenes };
}

/** Extra spoken plays — same cast, new rooms. Not songs. */
export const MORE_PLAYHOUSE_SHOWS: PlayhouseShow[] = [
  show(
    {
      id: "mailbox-blue-flag",
      title: "The Blue Mail Flag",
      tagline: "Dot writes. The flag stands up. The letter waits kindly.",
      coverEmoji: "📫",
      coverGradient: "from-sky-500 to-indigo-800",
    },
    [
      {
        id: "mb-1",
        title: "A Square of Paper",
        setting: "Kitchen table",
        illustration: "✉️ 🧸 🖍️",
        bgGradient: "from-sky-100 to-amber-100 text-sky-950",
        lines: [
          { speaker: "Teddy", emoji: "🧸", line: "Dot, the paper is a square that wants to become a letter." },
          { speaker: "Dot", emoji: "🐭", line: "Letters are just talking that learned to sit still." },
        ],
      },
      {
        id: "mb-2",
        title: "The Stamp",
        setting: "Stamp tin",
        illustration: "💌 📫 🧸",
        bgGradient: "from-rose-100 to-sky-100 text-rose-950",
        lines: [
          { speaker: "Nana", emoji: "🧶", line: "A stamp is a tiny ticket. Press it like a kiss that paid." },
          { speaker: "Teddy", emoji: "🧸", line: "I will not eat the stamp. I thought about it. I will not." },
        ],
      },
      {
        id: "mb-3",
        title: "The Slot",
        setting: "Blue mailbox",
        illustration: "📫 ✉️ 🌤️",
        bgGradient: "from-blue-100 to-slate-200 text-blue-950",
        lines: [
          { speaker: "Dot", emoji: "🐭", line: "The slot is a mouth that only swallows paper. That is manners." },
          { speaker: "Mailbox", emoji: "📫", line: "Thank you. I keep things until the route comes." },
        ],
      },
      {
        id: "mb-4",
        title: "Flag Up",
        setting: "Flag",
        illustration: "🚩 📫 ☀️",
        bgGradient: "from-amber-100 to-sky-200 text-amber-950",
        lines: [
          { speaker: "Nana", emoji: "🧶", line: "Flag up means we have news. Flag down means the news already left." },
          { speaker: "Teddy", emoji: "🧸", line: "I like news that waits. Waiting is a kind of hug." },
        ],
      },
      {
        id: "mb-5",
        title: "The Route",
        setting: "Sidewalk",
        illustration: "🚶 📬 🐦",
        bgGradient: "from-lime-100 to-sky-100 text-lime-950",
        lines: [
          { speaker: "Rosie", emoji: "🚒", line: "I do not deliver letters. I deliver water. Different route. Same block." },
          { speaker: "Dot", emoji: "🐭", line: "Different jobs. Same hello." },
        ],
      },
      {
        id: "mb-6",
        title: "Flag Down",
        setting: "Later",
        illustration: "📪 💛 🏡",
        bgGradient: "from-orange-100 to-indigo-100 text-orange-950",
        lines: [
          { speaker: "Mailbox", emoji: "📪", line: "Empty now. The talking went walking." },
          { speaker: "Teddy", emoji: "🧸", line: "Good. Paper can be brave without us watching." },
        ],
      },
    ],
  ),
  show(
    {
      id: "soup-steam-secret",
      title: "Soup Steam Secret",
      tagline: "Nana stirs. Teddy guesses. The secret is carrots and time.",
      coverEmoji: "🍲",
      coverGradient: "from-orange-500 to-rose-800",
    },
    [
      {
        id: "ss-1",
        title: "Lid On",
        setting: "Kitchen",
        illustration: "🍲 🪵 🧸",
        bgGradient: "from-orange-100 to-amber-200 text-orange-950",
        lines: [
          { speaker: "Teddy", emoji: "🧸", line: "The pot is wearing a hat. I respect hats." },
          { speaker: "Nana", emoji: "🧶", line: "The hat keeps the secret in. Secrets in soup are called steam." },
        ],
      },
      {
        id: "ss-2",
        title: "Round and Round",
        setting: "Spoon",
        illustration: "🥄 🍲 🌀",
        bgGradient: "from-yellow-100 to-orange-100 text-yellow-950",
        lines: [
          { speaker: "Nana", emoji: "🧶", line: "Round is the only direction soup believes." },
          { speaker: "Teddy", emoji: "🧸", line: "I can do round. Watch my paw. Almost round." },
        ],
      },
      {
        id: "ss-3",
        title: "Carrot Coins",
        setting: "Cutting board",
        illustration: "🥕 ⭕ 🪵",
        bgGradient: "from-orange-200 to-lime-100 text-orange-950",
        lines: [
          { speaker: "Dot", emoji: "🐭", line: "Carrots become coins if you are a knife. I am not a knife. I am a guest." },
          { speaker: "Nana", emoji: "🧶", line: "Guests may sniff. Guests may not steal coins." },
        ],
      },
      {
        id: "ss-4",
        title: "Taste",
        setting: "Wooden spoon",
        illustration: "🥄 😋 🍲",
        bgGradient: "from-rose-100 to-amber-100 text-rose-950",
        lines: [
          { speaker: "Nana", emoji: "🧶", line: "Blow. Then taste. Heat is not a race." },
          { speaker: "Teddy", emoji: "🧸", line: "I blew. It still told my tongue a loud story. I will wait." },
        ],
      },
      {
        id: "ss-5",
        title: "Bowls",
        setting: "Table",
        illustration: "🥣 🥣 🍞",
        bgGradient: "from-amber-100 to-stone-100 text-amber-950",
        lines: [
          { speaker: "Teddy", emoji: "🧸", line: "Two bowls. One for Nana. One for the guest who did not steal carrots." },
          { speaker: "Dot", emoji: "🐭", line: "I accept the title of Guest." },
        ],
      },
      {
        id: "ss-6",
        title: "Empty Hats",
        setting: "Sink",
        illustration: "🥣 💧 💛",
        bgGradient: "from-sky-100 to-orange-100 text-sky-950",
        lines: [
          { speaker: "Nana", emoji: "🧶", line: "Empty bowls are hats that finished their job." },
          { speaker: "Teddy", emoji: "🧸", line: "Thank you, soup. Thank you, time. Thank you, secret." },
        ],
      },
    ],
  ),
  show(
    {
      id: "lost-mitten-bench",
      title: "The Mitten on the Bench",
      tagline: "Snow. A bench. One mitten waiting like a small red house.",
      coverEmoji: "🧤",
      coverGradient: "from-rose-400 to-slate-700",
    },
    [
      {
        id: "lm-1",
        title: "Quiet Snow",
        setting: "Park path",
        illustration: "❄️ 🧤 🪑",
        bgGradient: "from-sky-100 to-slate-200 text-slate-900",
        lines: [
          { speaker: "Teddy", emoji: "🧸", line: "The snow is writing with no pencil. I like that kind of writing." },
          { speaker: "Dot", emoji: "🐭", line: "And the bench is holding a mitten like a secret." },
        ],
      },
      {
        id: "lm-2",
        title: "Do Not Pocket",
        setting: "Bench",
        illustration: "🧤 🧸 ✋",
        bgGradient: "from-rose-100 to-sky-100 text-rose-950",
        lines: [
          { speaker: "Nana", emoji: "🧶", line: "We do not pocket lost things. We make them easy to find." },
          { speaker: "Teddy", emoji: "🧸", line: "I will sit beside it. Sitting is a kind of sign." },
        ],
      },
      {
        id: "lm-3",
        title: "A Bird Opinion",
        setting: "Branch",
        illustration: "🐦 🧤 ❄️",
        bgGradient: "from-lime-100 to-sky-100 text-lime-950",
        lines: [
          { speaker: "Sparrow", emoji: "🐦", line: "I do not wear mittens. I wear weather." },
          { speaker: "Dot", emoji: "🐭", line: "The mitten is not for you. It is for a hand that is missing it." },
        ],
      },
      {
        id: "lm-4",
        title: "The Other Hand",
        setting: "Path",
        illustration: "🧤 👢 ❄️",
        bgGradient: "from-amber-100 to-rose-100 text-amber-950",
        lines: [
          { speaker: "Rosie", emoji: "🚒", line: "I saw a small boot print going in circles. Circles mean looking." },
          { speaker: "Teddy", emoji: "🧸", line: "Then we stay. Looking people come back to benches." },
        ],
      },
      {
        id: "lm-5",
        title: "Found",
        setting: "Bench",
        illustration: "🧤 💛 🪑",
        bgGradient: "from-yellow-100 to-sky-200 text-yellow-950",
        lines: [
          { speaker: "Nana", emoji: "🧶", line: "Here is a hand that matches. Hello, pair." },
          { speaker: "Teddy", emoji: "🧸", line: "The bench did a good job. Benches do not get thanked enough." },
        ],
      },
      {
        id: "lm-6",
        title: "Two Warm",
        setting: "Home path",
        illustration: "🧤🧤 🏡 ❄️",
        bgGradient: "from-orange-100 to-indigo-100 text-orange-950",
        lines: [
          { speaker: "Dot", emoji: "🐭", line: "Two mittens. One story. Snow keeps writing." },
          { speaker: "Teddy", emoji: "🧸", line: "We can go. The bench is empty on purpose now." },
        ],
      },
    ],
  ),
  show(
    {
      id: "ferry-ticket-please",
      title: "Ferry Ticket Please",
      tagline: "A round token, a low horn, and Gully who never pays.",
      coverEmoji: "⛴️",
      coverGradient: "from-cyan-400 to-slate-800",
    },
    [
      {
        id: "ft-1",
        title: "The Window",
        setting: "Ticket booth",
        illustration: "🎫 🪟 🧸",
        bgGradient: "from-yellow-100 to-sky-100 text-yellow-950",
        lines: [
          { speaker: "Teddy", emoji: "🧸", line: "Please. Two tickets. One for a bear. One for a Nana." },
          { speaker: "Booth", emoji: "🪟", line: "Please is a good coin. Here are two moons of paper." },
        ],
      },
      {
        id: "ft-2",
        title: "Gully Free",
        setting: "Rail",
        illustration: "🐦 ⛴️ 💨",
        bgGradient: "from-cyan-100 to-slate-200 text-cyan-950",
        lines: [
          { speaker: "Gully", emoji: "🐦", line: "I do not buy tickets. I buy wind." },
          { speaker: "Dot", emoji: "🐭", line: "That is a different economy. I respect it." },
        ],
      },
      {
        id: "ft-3",
        title: "Horn",
        setting: "Deck",
        illustration: "📯 🌊 🧸",
        bgGradient: "from-sky-100 to-blue-200 text-sky-950",
        lines: [
          { speaker: "Horn", emoji: "📯", line: "Ready. I have one word and I use it well." },
          { speaker: "Teddy", emoji: "🧸", line: "I covered one ear. I still heard ready. Good." },
        ],
      },
      {
        id: "ft-4",
        title: "Middle",
        setting: "Water",
        illustration: "🌊 ⛴️ ☀️",
        bgGradient: "from-blue-100 to-cyan-100 text-blue-950",
        lines: [
          { speaker: "Nana", emoji: "🧶", line: "In the middle there is only boat. That is enough plot for a morning." },
          { speaker: "Teddy", emoji: "🧸", line: "I am a passenger. Passengers may sway." },
        ],
      },
      {
        id: "ft-5",
        title: "Other Dock",
        setting: "Ramp",
        illustration: "⚓ 🚶 🚢",
        bgGradient: "from-amber-100 to-cyan-100 text-amber-950",
        lines: [
          { speaker: "Rosie", emoji: "🚒", line: "Walk. Do not run. Ramps have opinions about running." },
          { speaker: "Teddy", emoji: "🧸", line: "I walk. My ticket is a memory now." },
        ],
      },
      {
        id: "ft-6",
        title: "Horn Behind",
        setting: "Street",
        illustration: "📯 🏙️ 💛",
        bgGradient: "from-orange-100 to-sky-200 text-orange-950",
        lines: [
          { speaker: "Gully", emoji: "🐦", line: "I will take the next wind. You took this boat." },
          { speaker: "Teddy", emoji: "🧸", line: "We had this morning. That is the whole ticket." },
        ],
      },
    ],
  ),
];
