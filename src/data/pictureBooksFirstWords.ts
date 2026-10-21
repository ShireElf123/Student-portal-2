import type { PictureBook, PictureBookPage } from "../types";

type PageDraft = Omit<PictureBookPage, "pageNumber">;

function book(meta: Omit<PictureBook, "pages">, pages: PageDraft[]): PictureBook {
  return {
    ...meta,
    readTimeMinutes: Math.max(meta.readTimeMinutes, Math.ceil(pages.length / 2)),
    pages: pages.map((page, index) => ({ ...page, pageNumber: index + 1 })),
  };
}

function p(
  title: string,
  text: string,
  illustration: string,
  bgGradient: string,
  narration: string,
  wordHighlights: string[],
  interactivePrompt: string,
  soundEffectText: string,
  extra: Partial<PictureBookPage> = {},
): PageDraft {
  return { title, text, illustration, bgGradient, narration, wordHighlights, interactivePrompt, soundEffectText, ...extra };
}

/** More CVC first readers — Bob-books short, stoop voice. */
export const FIRST_WORD_PICTURE_BOOKS: PictureBook[] = [
  book(
    {
      id: "pig-in-mud",
      title: "A Pig in the Mud",
      subtitle: "A first-word tale. Pig. Mud. Sit. Dig.",
      ageRange: "Ages 2-4",
      category: "phonics",
      series: "first-words",
      coverEmoji: "🐷",
      coverGradient: "from-rose-400 to-amber-800",
      author: "First Words Stoop",
      readTimeMinutes: 4,
    },
    [
      p("Pig", "A pig. A big pig.", "🐷", "from-rose-100 to-pink-100 text-rose-950", "A pig. A big pig.", ["pig", "big"], "Say pig.", "Pig.", { letterHighlight: "P", learningInteraction: { id: "cvc-pig-letter", prompt: "What letter starts pig?", options: ["P", "M", "D"], correctOptionIndex: 0, skillId: "read-k1-alphabet-letters" } }),
      p("Mud", "Mud. Wet mud.", "📦", "from-amber-100 to-stone-300 text-amber-950", "Mud. Wet mud.", ["mud", "wet"], "Say mud.", "Mud.", { letterHighlight: "M" }),
      p("In", "The pig is in the mud.", "🐷 📦", "from-rose-50 to-amber-100 text-rose-950", "The pig is in the mud.", ["pig", "in", "mud"], "Put the pig in the mud.", "In."),
      p("Sit", "The pig sat in the mud.", "🐷 📦 🧸", "from-pink-50 to-amber-100 text-pink-950", "The pig sat in the mud.", ["sat", "pig", "mud"], "Sit like a pig.", "Sit.", { learningInteraction: { id: "cvc-pig-sat", prompt: "Where did the pig sit?", options: ["In the mud", "On the bus", "In a hat"], correctOptionIndex: 0, skillId: "read-k1-listening-comprehension" } }),
      p("Dig", "The pig can dig.", "🐷 🕳️", "from-amber-200 to-rose-100 text-amber-950", "The pig can dig.", ["pig", "dig"], "Dig with your hands.", "Dig.", { letterHighlight: "D" }),
      p("Wet", "The pig is wet.", "🐷 💧", "from-cyan-50 to-rose-100 text-cyan-950", "The pig is wet.", ["pig", "wet"], "Shake off mud.", "Shake."),
      p("Tub", "A tub. The pig in the tub.", "🛁 🐷", "from-sky-50 to-rose-50 text-sky-950", "The pig in the tub.", ["tub", "pig"], "Scrub the pig.", "Scrub."),
      p("The End", "The pig sat. The pig dug. The mud did its job.", "🐷 📦 🏡", "from-rose-100 to-lime-50 text-rose-950", "The pig sat and dug. The mud did its job.", ["sat", "dug", "mud"], "Wave bye, pig.", "Bye."),
    ],
  ),
  book(
    {
      id: "fox-in-box",
      title: "The Fox in the Box",
      subtitle: "A first-word tale. Fox. Box. In. Out.",
      ageRange: "Ages 2-4",
      category: "phonics",
      series: "first-words",
      coverEmoji: "🦊",
      coverGradient: "from-orange-500 to-stone-800",
      author: "First Words Stoop",
      readTimeMinutes: 4,
    },
    [
      p("Fox", "A fox. A red fox.", "🦊", "from-orange-100 to-amber-100 text-orange-950", "A fox. A red fox.", ["fox", "red"], "Say fox.", "Fox.", { letterHighlight: "F", learningInteraction: { id: "cvc-fox-letter", prompt: "What letter starts fox?", options: ["F", "B", "X"], correctOptionIndex: 0, skillId: "read-k1-alphabet-letters" } }),
      p("Box", "A box. A big box.", "📦", "from-amber-100 to-stone-200 text-amber-950", "A box. A big box.", ["box", "big"], "Say box.", "Box.", { letterHighlight: "B" }),
      p("In", "The fox is in the box.", "🦊 📦", "from-orange-50 to-amber-100 text-orange-950", "The fox is in the box.", ["fox", "in", "box"], "Hide the fox in the box.", "In."),
      p("Peek", "The fox can peek.", "🦊 👀", "from-yellow-50 to-orange-100 text-yellow-950", "The fox can peek.", ["fox", "peek"], "Peek with two paws.", "Peek."),
      p("Out", "The fox is out.", "🦊 📦 ✨", "from-lime-50 to-orange-50 text-lime-950", "The fox is out.", ["fox", "out"], "Jump out.", "Out.", { learningInteraction: { id: "cvc-fox-out", prompt: "Is the fox in or out?", options: ["Out", "In a pot", "On the moon"], correctOptionIndex: 0, skillId: "read-k1-listening-comprehension" } }),
      p("Lid", "A lid on the box.", "📦 ⬜", "from-stone-100 to-orange-50 text-stone-950", "A lid on the box.", ["lid", "box"], "Put a lid on.", "Clap.", { learningInteraction: { id: "cvc-box-lid-shape", prompt: "What shape is the box lid?", options: ["Square", "Circle", "Melon"], correctOptionIndex: 0, skillId: "math-k1-shapes" } }),
      p("Nap", "The fox had a nap in the box.", "🦊 😴 📦", "from-violet-50 to-orange-50 text-violet-950", "The fox had a nap in the box.", ["nap", "fox", "box"], "Quiet nap.", "Zzz."),
      p("The End", "In. Out. The box did its job.", "📦 🦊 🏡", "from-orange-100 to-lime-50 text-orange-950", "In. Out. The box did its job.", ["in", "out", "box"], "Wave bye, fox.", "Bye."),
    ],
  ),
  book(
    {
      id: "dog-on-log",
      title: "The Dog on the Log",
      subtitle: "A first-word tale. Dog. Log. On. Hop.",
      ageRange: "Ages 2-4",
      category: "phonics",
      series: "first-words",
      coverEmoji: "🐕",
      coverGradient: "from-amber-500 to-lime-900",
      author: "First Words Stoop",
      readTimeMinutes: 4,
    },
    [
      p("Dog", "A dog. A tan dog.", "🐕", "from-amber-100 to-orange-100 text-amber-950", "A dog. A tan dog.", ["dog", "tan"], "Say dog.", "Dog.", { letterHighlight: "D", learningInteraction: { id: "cvc-dog-letter", prompt: "What letter starts dog?", options: ["D", "L", "G"], correctOptionIndex: 0, skillId: "read-k1-alphabet-letters" } }),
      p("Log", "A log. A big log.", "🌳", "from-stone-100 to-amber-200 text-stone-950", "A log. A big log.", ["log", "big"], "Say log.", "Log.", { letterHighlight: "L" }),
      p("On", "The dog is on the log.", "🐕 🌳", "from-lime-50 to-amber-100 text-lime-950", "The dog is on the log.", ["dog", "on", "log"], "Put the dog on the log.", "On."),
      p("Hop", "The dog can hop.", "🐕 ⬆️", "from-yellow-50 to-lime-100 text-yellow-950", "The dog can hop.", ["dog", "hop"], "Hop once.", "Hop."),
      p("Fog", "Fog on the log.", "🌫️ 🌳", "from-slate-100 to-lime-50 text-slate-950", "Fog on the log.", ["fog", "log"], "Blow fog.", "Hoo."),
      p("Sit", "Sit, dog. Sit on the log.", "🐕 🌳 🧸", "from-amber-50 to-lime-50 text-amber-950", "Sit, dog. Sit on the log.", ["sit", "dog", "log"], "Sit tall.", "Sit.", { learningInteraction: { id: "cvc-dog-sit", prompt: "Where does the dog sit?", options: ["On the log", "In the pot", "On the bus"], correctOptionIndex: 0, skillId: "read-k1-listening-comprehension" } }),
      p("Wag", "The dog can wag.", "🐕 〰️", "from-orange-50 to-amber-50 text-orange-950", "The dog can wag.", ["dog", "wag"], "Wag a tail.", "Wag."),
      p("The End", "The dog sat. The log did its job.", "🐕 🌳 🏡", "from-lime-100 to-amber-50 text-lime-950", "The dog sat. The log did its job.", ["sat", "log", "job"], "Wave bye, dog.", "Bye."),
    ],
  ),
  book(
    {
      id: "hen-in-pen",
      title: "The Hen in the Pen",
      subtitle: "A first-word tale. Hen. Pen. Ten. Egg.",
      ageRange: "Ages 2-4",
      category: "phonics",
      series: "first-words",
      coverEmoji: "🐔",
      coverGradient: "from-red-400 to-amber-800",
      author: "First Words Stoop",
      readTimeMinutes: 4,
    },
    [
      p("Hen", "A hen. A red hen.", "🐔", "from-red-100 to-amber-100 text-red-950", "A hen. A red hen.", ["hen", "red"], "Say hen.", "Hen.", { letterHighlight: "H", learningInteraction: { id: "cvc-hen-letter", prompt: "What letter starts hen?", options: ["H", "P", "N"], correctOptionIndex: 0, skillId: "read-k1-alphabet-letters" } }),
      p("Pen", "A pen. A hen pen.", "🏡 🐔", "from-lime-100 to-amber-100 text-lime-950", "A pen. A hen pen.", ["pen", "hen"], "Say pen.", "Pen.", { letterHighlight: "P" }),
      p("In", "The hen is in the pen.", "🐔 🏡", "from-yellow-50 to-lime-100 text-yellow-950", "The hen is in the pen.", ["hen", "in", "pen"], "Put the hen in.", "In."),
      p("Egg", "An egg. A tan egg.", "🥚", "from-amber-50 to-yellow-100 text-amber-950", "An egg. A tan egg.", ["egg", "tan"], "Say egg.", "Egg."),
      p("Ten", "Ten eggs? No. One egg.", "🥚 1️⃣", "from-yellow-100 to-lime-50 text-yellow-950", "Not ten. One egg.", ["ten", "one", "egg"], "Hold up one.", "One.", { letterHighlight: "1", learningInteraction: { id: "cvc-hen-one-egg", prompt: "How many eggs?", options: ["One", "Ten", "Zero"], correctOptionIndex: 0, skillId: "math-k1-counting" } }),
      p("Peck", "The hen can peck.", "🐔 ⬇️", "from-orange-50 to-red-50 text-orange-950", "The hen can peck.", ["hen", "peck"], "Peck once.", "Peck."),
      p("Nap", "The hen had a nap in the pen.", "🐔 😴 🏡", "from-violet-50 to-amber-50 text-violet-950", "The hen had a nap in the pen.", ["nap", "hen", "pen"], "Quiet nap.", "Zzz."),
      p("The End", "The hen sat. The pen did its job.", "🐔 🏡 🥚", "from-red-50 to-lime-50 text-red-950", "The hen sat. The pen did its job.", ["sat", "pen", "job"], "Wave bye, hen.", "Bye."),
    ],
  ),
  book(
    {
      id: "bug-in-mug",
      title: "The Bug in the Mug",
      subtitle: "A first-word tale. Bug. Mug. In. Out.",
      ageRange: "Ages 2-4",
      category: "phonics",
      series: "first-words",
      coverEmoji: "🐞",
      coverGradient: "from-red-500 to-stone-800",
      author: "First Words Stoop",
      readTimeMinutes: 4,
    },
    [
      p("Bug", "A bug. A red bug.", "🐞", "from-red-100 to-rose-100 text-red-950", "A bug. A red bug.", ["bug", "red"], "Say bug.", "Bug.", { letterHighlight: "B", learningInteraction: { id: "cvc-bug-letter", prompt: "What letter starts bug?", options: ["B", "M", "G"], correctOptionIndex: 0, skillId: "read-k1-alphabet-letters" } }),
      p("Mug", "A mug. A big mug.", "☕", "from-amber-100 to-stone-200 text-amber-950", "A mug. A big mug.", ["mug", "big"], "Say mug.", "Mug.", { letterHighlight: "M" }),
      p("In", "The bug is in the mug.", "🐞 ☕", "from-rose-50 to-amber-100 text-rose-950", "The bug is in the mug.", ["bug", "in", "mug"], "Drop the bug in (kindly).", "In."),
      p("Look", "Look in the mug.", "👀 ☕", "from-yellow-50 to-red-50 text-yellow-950", "Look in the mug.", ["look", "mug"], "Peek in.", "Look."),
      p("Out", "The bug is out.", "🐞 ✨", "from-lime-50 to-red-50 text-lime-950", "The bug is out.", ["bug", "out"], "Let the bug out.", "Out.", { learningInteraction: { id: "cvc-bug-out", prompt: "What do we do for the bug?", options: ["Let it out", "Drink it", "Hide the sun"], correctOptionIndex: 0, skillId: "read-k1-listening-comprehension" } }),
      p("Hug", "No hug for a bug. A wave.", "🐞 👋 🧸", "from-amber-50 to-rose-50 text-amber-950", "No hug for a bug. A wave.", ["hug", "bug", "wave"], "Wave at the bug.", "Wave."),
      p("Run", "The bug can run.", "🐞 💨", "from-orange-50 to-red-50 text-orange-950", "The bug can run.", ["bug", "run"], "Run fingers.", "Run."),
      p("The End", "In. Out. The mug did its job.", "☕ 🐞 🏡", "from-red-50 to-lime-50 text-red-950", "In. Out. The mug did its job.", ["in", "out", "mug"], "Wave bye, bug.", "Bye."),
    ],
  ),
  book(
    {
      id: "hop-on-top",
      title: "Hop on Top",
      subtitle: "A first-word tale. Hop. Top. Pop. Stop.",
      ageRange: "Ages 2-4",
      category: "phonics",
      series: "first-words",
      coverEmoji: "🐰",
      coverGradient: "from-lime-400 to-sky-800",
      author: "First Words Stoop",
      readTimeMinutes: 4,
    },
    [
      p("Hop", "Hop. Hop. Hop.", "🐰", "from-lime-100 to-emerald-100 text-lime-950", "Hop. Hop. Hop.", ["hop"], "Hop three times.", "Hop.", { letterHighlight: "H", learningInteraction: { id: "cvc-hop-letter", prompt: "What letter starts hop?", options: ["H", "T", "P"], correctOptionIndex: 0, skillId: "read-k1-alphabet-letters" } }),
      p("Top", "The top of the stoop.", "🏡 🏡", "from-amber-100 to-lime-100 text-amber-950", "The top of the stoop.", ["top", "stoop"], "Point to the top.", "Top.", { letterHighlight: "T" }),
      p("On Top", "Hop on top.", "🐰 🏡", "from-yellow-50 to-lime-100 text-yellow-950", "Hop on top.", ["hop", "on", "top"], "Hop onto a step.", "Hop."),
      p("Stop", "Stop on top.", "✋ 🐰", "from-rose-50 to-amber-50 text-rose-950", "Stop on top.", ["stop", "top"], "Stop hand.", "Stop."),
      p("Pop", "Pop! A bubble on top.", "💧 🐰", "from-cyan-50 to-lime-50 text-cyan-950", "Pop. A bubble on top.", ["pop", "top"], "Pop a bubble.", "Pop."),
      p("Teddy", "Teddy can hop. Teddy on top.", "🧸 🏡", "from-amber-50 to-orange-50 text-amber-950", "Teddy can hop. Teddy on top.", ["Teddy", "hop", "top"], "Hop like Teddy.", "Hop.", { learningInteraction: { id: "cvc-teddy-top", prompt: "Who hops on top?", options: ["Teddy", "A ferry", "A loaf"], correctOptionIndex: 0, skillId: "read-k1-listening-comprehension" } }),
      p("Sit", "Sit on top.", "🧸 🏡 🏡", "from-violet-50 to-lime-50 text-violet-950", "Sit on top.", ["sit", "top"], "Sit on the top step.", "Sit."),
      p("The End", "Hop. Stop. The top did its job.", "🐰 🏡 🏡", "from-lime-100 to-sky-50 text-lime-950", "Hop. Stop. The top did its job.", ["hop", "stop", "top"], "Wave from the top.", "Bye."),
    ],
  ),
];
