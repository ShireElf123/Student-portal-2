/**
 * Curated K–1 skill studio. These rounds are playable with the content
 * generator off. Each game is a named scene mapped to one curriculum skill —
 * not a generic quiz skin.
 */
import type { CurriculumDomain } from "../curriculumUniverse";

export type K1StudioGameId =
  | "ten-frame-taxi"
  | "blend-kitchen"
  | "bead-train"
  | "picnic-plus"
  | "weather-porch"
  | "laundry-sort"
  | "story-porch";

export interface K1StudioChoice {
  id: string;
  label: string;
  emoji: string;
  correct: boolean;
}

export interface K1StudioRound {
  id: string;
  prompt: string;
  spoken: string;
  scene: string;
  choices: K1StudioChoice[];
}

export interface K1StudioGame {
  id: K1StudioGameId;
  activityId: string;
  experienceId: string;
  skillId: string;
  domain: CurriculumDomain;
  title: string;
  tagline: string;
  emoji: string;
  accent: string;
  rounds: K1StudioRound[];
}

export const K1_STUDIO_GAMES: K1StudioGame[] = [
  {
    id: "ten-frame-taxi",
    activityId: "toddler-ten-frame-taxi",
    experienceId: "ten-frame-taxi",
    skillId: "math-k1-place-value",
    domain: "math",
    title: "Ten-Frame Taxi",
    tagline: "Fill a row of ten seats, then count the leftover riders.",
    emoji: "🚕",
    accent: "from-amber-500 to-yellow-400",
    rounds: [
      {
        id: "taxi-14",
        prompt: "14 riders pile into Pip’s night taxi. One ten-frame is full. How many leftover seats?",
        spoken: "Fourteen friends get in the taxi. One row of ten is full. How many leftover riders?",
        scene: "██████████ ██░░  14",
        choices: [
          { id: "4", label: "4 leftover", emoji: "4️⃣", correct: true },
          { id: "1", label: "1 leftover", emoji: "1️⃣", correct: false },
          { id: "10", label: "10 leftover", emoji: "🔟", correct: false },
        ],
      },
      {
        id: "taxi-10",
        prompt: "Exactly 10 riders. Is there a leftover, or a perfect ten?",
        spoken: "Ten friends. Is that a leftover, or a perfect ten?",
        scene: "██████████  10",
        choices: [
          { id: "perfect", label: "Perfect ten", emoji: "🔟", correct: true },
          { id: "two", label: "2 leftover", emoji: "2️⃣", correct: false },
          { id: "none-empty", label: "Empty taxi", emoji: "🚫", correct: false },
        ],
      },
      {
        id: "taxi-7",
        prompt: "7 riders. No ten yet. How many ones are sitting?",
        spoken: "Seven friends. No full ten yet. How many ones?",
        scene: "███████░░░  7",
        choices: [
          { id: "7", label: "7 ones", emoji: "7️⃣", correct: true },
          { id: "17", label: "17 ones", emoji: "🚌", correct: false },
          { id: "0", label: "0 ones", emoji: "0️⃣", correct: false },
        ],
      },
      {
        id: "taxi-15",
        prompt: "15 riders. How many tens did Pip fill?",
        spoken: "Fifteen friends. How many tens did Pip fill?",
        scene: "██████████ █████  15",
        choices: [
          { id: "1-ten", label: "1 ten", emoji: "1️⃣", correct: true },
          { id: "5-tens", label: "5 tens", emoji: "5️⃣", correct: false },
          { id: "15-tens", label: "15 tens", emoji: "🚕", correct: false },
        ],
      },
      {
        id: "taxi-20",
        prompt: "20 riders — two full taxis. How many tens?",
        spoken: "Twenty friends fill two taxis. How many tens?",
        scene: "██████████ ██████████  20",
        choices: [
          { id: "2-tens", label: "2 tens", emoji: "2️⃣", correct: true },
          { id: "0-tens", label: "0 tens", emoji: "0️⃣", correct: false },
          { id: "20-ones-only", label: "Only ones", emoji: "✨", correct: false },
        ],
      },
    ],
  },
  {
    id: "blend-kitchen",
    activityId: "toddler-blend-kitchen",
    experienceId: "blend-kitchen",
    skillId: "read-k1-consonant-blends",
    domain: "reading",
    title: "Blend Kitchen",
    tagline: "Slide two letter tiles. Serve the food that starts with that blend.",
    emoji: "👩‍🍳",
    accent: "from-rose-500 to-orange-400",
    rounds: [
      {
        id: "st-strawberry",
        prompt: "Chef Lila slides S + T. What starts with st?",
        spoken: "S and T slide together. St. What food starts with st?",
        scene: "S + T → st",
        choices: [
          { id: "strawberry", label: "Strawberry", emoji: "🍓", correct: true },
          { id: "apple", label: "Apple", emoji: "🍎", correct: false },
          { id: "banana", label: "Banana", emoji: "🍌", correct: false },
        ],
      },
      {
        id: "br-bread",
        prompt: "B + R. What starts with br?",
        spoken: "B and R. Br. What starts with br?",
        scene: "B + R → br",
        choices: [
          { id: "bread", label: "Bread", emoji: "🍞", correct: true },
          { id: "milk", label: "Milk", emoji: "🥛", correct: false },
          { id: "egg", label: "Egg", emoji: "🥚", correct: false },
        ],
      },
      {
        id: "gr-grapes",
        prompt: "G + R. What starts with gr?",
        spoken: "G and R. Gr. What starts with gr?",
        scene: "G + R → gr",
        choices: [
          { id: "grapes", label: "Grapes", emoji: "🍇", correct: true },
          { id: "pear", label: "Pear", emoji: "🍐", correct: false },
          { id: "soup", label: "Soup", emoji: "🍲", correct: false },
        ],
      },
      {
        id: "cl-cloves",
        prompt: "C + L. What starts with cl?",
        spoken: "C and L. Cl. What starts with cl?",
        scene: "C + L → cl",
        choices: [
          { id: "cloves", label: "Cloves", emoji: "🌿", correct: true },
          { id: "rice", label: "Rice", emoji: "🍚", correct: false },
          { id: "tea", label: "Tea", emoji: "🍵", correct: false },
        ],
      },
      {
        id: "tr-tray",
        prompt: "T + R. What starts with tr?",
        spoken: "T and R. Tr. What starts with tr?",
        scene: "T + R → tr",
        choices: [
          { id: "tray", label: "Tray", emoji: "🍽️", correct: true },
          { id: "fork", label: "Fork", emoji: "🍴", correct: false },
          { id: "cup", label: "Cup", emoji: "🥤", correct: false },
        ],
      },
    ],
  },
  {
    id: "bead-train",
    activityId: "toddler-bead-train",
    experienceId: "bead-train",
    skillId: "logic-k1-patterns",
    domain: "logic",
    title: "Bead Train",
    tagline: "Read the necklace. Tap the bead that comes next.",
    emoji: "📿",
    accent: "from-fuchsia-500 to-violet-500",
    rounds: [
      {
        id: "abab-red-blue",
        prompt: "🔴 🔵 🔴 🔵 🔴 ?",
        spoken: "Red, blue, red, blue, red. What bead comes next?",
        scene: "ABAB necklace",
        choices: [
          { id: "blue", label: "Blue bead", emoji: "🔵", correct: true },
          { id: "red", label: "Red bead", emoji: "🔴", correct: false },
          { id: "yellow", label: "Yellow bead", emoji: "🟡", correct: false },
        ],
      },
      {
        id: "aab-sun",
        prompt: "☀️ ☀️ 🌙 ☀️ ☀️ 🌙 ☀️ ?",
        spoken: "Sun sun moon, sun sun moon, sun. What comes next?",
        scene: "AAB night train",
        choices: [
          { id: "sun", label: "Sun", emoji: "☀️", correct: true },
          { id: "moon", label: "Moon", emoji: "🌙", correct: false },
          { id: "star", label: "Star", emoji: "⭐", correct: false },
        ],
      },
      {
        id: "abc-fruit",
        prompt: "🍎 🍌 🍇 🍎 🍌 ?",
        spoken: "Apple, banana, grapes, apple, banana. What comes next?",
        scene: "ABC fruit chain",
        choices: [
          { id: "grapes", label: "Grapes", emoji: "🍇", correct: true },
          { id: "apple", label: "Apple", emoji: "🍎", correct: false },
          { id: "pear", label: "Pear", emoji: "🍐", correct: false },
        ],
      },
      {
        id: "grow-size",
        prompt: "🌱 🌿 🌳 🌱 🌿 ?",
        spoken: "Sprout, bush, tree, sprout, bush. What comes next?",
        scene: "Growing pattern",
        choices: [
          { id: "tree", label: "Tree", emoji: "🌳", correct: true },
          { id: "sprout", label: "Sprout", emoji: "🌱", correct: false },
          { id: "flower", label: "Flower", emoji: "🌸", correct: false },
        ],
      },
      {
        id: "clap-stomp",
        prompt: "👏 👏 🦶 👏 👏 ?",
        spoken: "Clap clap stomp, clap clap. What comes next?",
        scene: "Body percussion",
        choices: [
          { id: "stomp", label: "Stomp", emoji: "🦶", correct: true },
          { id: "clap", label: "Clap", emoji: "👏", correct: false },
          { id: "wave", label: "Wave", emoji: "👋", correct: false },
        ],
      },
    ],
  },
  {
    id: "picnic-plus",
    activityId: "toddler-picnic-plus",
    experienceId: "picnic-plus",
    skillId: "math-k1-addition-subtraction",
    domain: "math",
    title: "Picnic Plus",
    tagline: "Two plates on a blanket. Put together, or take away.",
    emoji: "🧺",
    accent: "from-lime-500 to-emerald-500",
    rounds: [
      {
        id: "3-plus-2",
        prompt: "Pip’s plate has 3 berries. Nana adds 2. How many berries?",
        spoken: "Three berries, plus two more. How many in all?",
        scene: "🍓🍓🍓 + 🍓🍓",
        choices: [
          { id: "5", label: "5 berries", emoji: "5️⃣", correct: true },
          { id: "32", label: "32 berries", emoji: "🤯", correct: false },
          { id: "1", label: "1 berry", emoji: "1️⃣", correct: false },
        ],
      },
      {
        id: "4-plus-4",
        prompt: "4 pretzels and 4 pretzels. How many?",
        spoken: "Four pretzels and four pretzels. How many?",
        scene: "🥨🥨🥨🥨 + 🥨🥨🥨🥨",
        choices: [
          { id: "8", label: "8 pretzels", emoji: "8️⃣", correct: true },
          { id: "44", label: "44 pretzels", emoji: "😵", correct: false },
          { id: "4", label: "4 pretzels", emoji: "4️⃣", correct: false },
        ],
      },
      {
        id: "6-minus-2",
        prompt: "6 grapes. A bird steals 2. How many left?",
        spoken: "Six grapes. A bird takes two. How many left?",
        scene: "🍇🍇🍇🍇🍇🍇 − 🐦🐦",
        choices: [
          { id: "4", label: "4 grapes", emoji: "4️⃣", correct: true },
          { id: "8", label: "8 grapes", emoji: "8️⃣", correct: false },
          { id: "2", label: "2 grapes", emoji: "2️⃣", correct: false },
        ],
      },
      {
        id: "5-minus-5",
        prompt: "5 cookies. The ants take all 5. How many left?",
        spoken: "Five cookies. Ants take all five. How many left?",
        scene: "🍪🍪🍪🍪🍪 − 🐜🐜🐜🐜🐜",
        choices: [
          { id: "0", label: "0 cookies", emoji: "0️⃣", correct: true },
          { id: "5", label: "5 cookies", emoji: "5️⃣", correct: false },
          { id: "10", label: "10 cookies", emoji: "🔟", correct: false },
        ],
      },
      {
        id: "1-plus-6",
        prompt: "1 sandwich, then 6 more from the basket. How many?",
        spoken: "One sandwich, plus six more. How many?",
        scene: "🥪 + 🥪🥪🥪🥪🥪🥪",
        choices: [
          { id: "7", label: "7 sandwiches", emoji: "7️⃣", correct: true },
          { id: "16", label: "16 sandwiches", emoji: "📦", correct: false },
          { id: "6", label: "6 sandwiches", emoji: "6️⃣", correct: false },
        ],
      },
    ],
  },
  {
    id: "weather-porch",
    activityId: "toddler-weather-porch",
    experienceId: "weather-porch",
    skillId: "sci-k1-weather-seasons",
    domain: "science",
    title: "Weather Porch",
    tagline: "Look out Pip’s window. Dress for what the sky is doing.",
    emoji: "☔",
    accent: "from-sky-500 to-indigo-500",
    rounds: [
      {
        id: "rain",
        prompt: "The porch is drumming with rain. What does Pip put on?",
        spoken: "It is raining on the porch. What should Pip wear?",
        scene: "🌧️ window",
        choices: [
          { id: "raincoat", label: "Raincoat", emoji: "🧥", correct: true },
          { id: "sunglasses", label: "Sunglasses", emoji: "🕶️", correct: false },
          { id: "swim-cap", label: "Swim cap", emoji: "🏊", correct: false },
        ],
      },
      {
        id: "sun",
        prompt: "Hard noon sun on the steps. What helps Pip?",
        spoken: "The sun is hot and bright. What helps Pip?",
        scene: "☀️ window",
        choices: [
          { id: "hat", label: "Sun hat", emoji: "👒", correct: true },
          { id: "snow-boots", label: "Snow boots", emoji: "🥾", correct: false },
          { id: "scarf", label: "Wool scarf", emoji: "🧣", correct: false },
        ],
      },
      {
        id: "wind",
        prompt: "The chimes are wild. Papers fly. What should stay on the porch?",
        spoken: "It is very windy. What should stay on the porch so it does not blow away?",
        scene: "💨 chimes",
        choices: [
          { id: "paperweight", label: "Heavy stone", emoji: "🪨", correct: true },
          { id: "kite-only", label: "Loose kite", emoji: "🪁", correct: false },
          { id: "feather", label: "Feather", emoji: "🪶", correct: false },
        ],
      },
      {
        id: "snow",
        prompt: "The rail is white and quiet. What does Pip need?",
        spoken: "Snow on the porch. What does Pip need?",
        scene: "❄️ rail",
        choices: [
          { id: "mittens", label: "Mittens", emoji: "🧤", correct: true },
          { id: "flipflops", label: "Flip-flops", emoji: "🩴", correct: false },
          { id: "fan", label: "Fan", emoji: "🪭", correct: false },
        ],
      },
      {
        id: "season-leaves",
        prompt: "The maple is dropping orange leaves. Which season?",
        spoken: "Orange leaves falling. Which season is it?",
        scene: "🍁 yard",
        choices: [
          { id: "autumn", label: "Autumn", emoji: "🍂", correct: true },
          { id: "midsummer", label: "Midsummer", emoji: "🌻", correct: false },
          { id: "deep-winter", label: "Deep winter", emoji: "⛄", correct: false },
        ],
      },
    ],
  },
  {
    id: "laundry-sort",
    activityId: "toddler-laundry-sort",
    experienceId: "laundry-sort",
    skillId: "logic-k1-sorting",
    domain: "logic",
    title: "Laundry Sort",
    tagline: "Nana’s baskets: socks, shirts, or toys. Sort by what it is.",
    emoji: "🧺",
    accent: "from-teal-500 to-cyan-400",
    rounds: [
      {
        id: "sock",
        prompt: "A wet striped sock. Which basket?",
        spoken: "A wet sock. Which basket?",
        scene: "🧦",
        choices: [
          { id: "socks", label: "Socks basket", emoji: "🧦", correct: true },
          { id: "shirts", label: "Shirts basket", emoji: "👕", correct: false },
          { id: "toys", label: "Toys basket", emoji: "🧸", correct: false },
        ],
      },
      {
        id: "teddy",
        prompt: "A teddy that snuck in the wash. Which basket?",
        spoken: "A teddy bear in the wash. Which basket?",
        scene: "🧸",
        choices: [
          { id: "toys", label: "Toys basket", emoji: "🧸", correct: true },
          { id: "socks", label: "Socks basket", emoji: "🧦", correct: false },
          { id: "shirts", label: "Shirts basket", emoji: "👕", correct: false },
        ],
      },
      {
        id: "shirt",
        prompt: "Pip’s yellow T-shirt. Which basket?",
        spoken: "A yellow shirt. Which basket?",
        scene: "👕",
        choices: [
          { id: "shirts", label: "Shirts basket", emoji: "👕", correct: true },
          { id: "socks", label: "Socks basket", emoji: "🧦", correct: false },
          { id: "toys", label: "Toys basket", emoji: "🧸", correct: false },
        ],
      },
      {
        id: "pair-socks",
        prompt: "Two tiny socks that match. Same basket or split them?",
        spoken: "Two socks that match. Keep them together?",
        scene: "🧦🧦",
        choices: [
          { id: "together", label: "Keep the pair", emoji: "🤝", correct: true },
          { id: "split", label: "Split the pair", emoji: "✂️", correct: false },
          { id: "toys", label: "Toys basket", emoji: "🧸", correct: false },
        ],
      },
      {
        id: "block",
        prompt: "A wooden block in the pocket. Clothes or not clothes?",
        spoken: "A wooden block in a pocket. Is it clothes?",
        scene: "🧱",
        choices: [
          { id: "not-clothes", label: "Not clothes — toys", emoji: "🧸", correct: true },
          { id: "shirt-ish", label: "Shirts basket", emoji: "👕", correct: false },
          { id: "sock-ish", label: "Socks basket", emoji: "🧦", correct: false },
        ],
      },
    ],
  },
  {
    id: "story-porch",
    activityId: "toddler-story-porch",
    experienceId: "story-porch",
    skillId: "read-k1-listening-comprehension",
    domain: "reading",
    title: "Story Porch",
    tagline: "Hear a three-beat porch story. Tap what you actually heard.",
    emoji: "📖",
    accent: "from-amber-600 to-rose-500",
    rounds: [
      {
        id: "who-hid",
        prompt: "Pip hid a red apple under the blue hat. Who hid it?",
        spoken: "Listen. Pip hid a red apple under the blue hat. Who hid it?",
        scene: "Porch: hat + apple",
        choices: [
          { id: "pip", label: "Pip", emoji: "🧒", correct: true },
          { id: "nana", label: "Nana", emoji: "👵", correct: false },
          { id: "cat", label: "The cat", emoji: "🐱", correct: false },
        ],
      },
      {
        id: "where-apple",
        prompt: "Same story. Where is the apple?",
        spoken: "Pip hid a red apple under the blue hat. Where is the apple?",
        scene: "Porch: hat + apple",
        choices: [
          { id: "hat", label: "Under the hat", emoji: "🎩", correct: true },
          { id: "bag", label: "In the bag", emoji: "👜", correct: false },
          { id: "tree", label: "In the tree", emoji: "🌳", correct: false },
        ],
      },
      {
        id: "color-apple",
        prompt: "What color was the apple Pip hid?",
        spoken: "Pip hid a red apple under the blue hat. What color was the apple?",
        scene: "Porch: hat + apple",
        choices: [
          { id: "red", label: "Red", emoji: "🔴", correct: true },
          { id: "blue", label: "Blue", emoji: "🔵", correct: false },
          { id: "green", label: "Green", emoji: "🟢", correct: false },
        ],
      },
      {
        id: "rain-bucket",
        prompt: "Nana set a tin bucket out for the rain. What did she set out?",
        spoken: "Nana set a tin bucket out for the rain. What did she set out?",
        scene: "Rain barrel porch",
        choices: [
          { id: "bucket", label: "A tin bucket", emoji: "🪣", correct: true },
          { id: "kite", label: "A kite", emoji: "🪁", correct: false },
          { id: "cake", label: "A cake", emoji: "🎂", correct: false },
        ],
      },
      {
        id: "who-hummed",
        prompt: "The cat hummed on the rail while Pip swept. Who hummed?",
        spoken: "The cat hummed on the rail while Pip swept. Who hummed?",
        scene: "Evening rail",
        choices: [
          { id: "cat", label: "The cat", emoji: "🐱", correct: true },
          { id: "pip", label: "Pip", emoji: "🧒", correct: false },
          { id: "nana", label: "Nana", emoji: "👵", correct: false },
        ],
      },
    ],
  },
];

export function getK1StudioGame(id: string): K1StudioGame | undefined {
  return K1_STUDIO_GAMES.find((game) => game.id === id);
}

export const K1_STUDIO_GAME_IDS = K1_STUDIO_GAMES.map((game) => game.id);
