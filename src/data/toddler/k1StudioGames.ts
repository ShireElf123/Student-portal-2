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
  | "story-porch"
  | "sock-drawer"
  | "farm-count";

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
      {
        id: "taxi-11",
        prompt: "11 riders pile in. One ten-frame is full. How many leftover?",
        spoken: "Eleven friends. One row of ten is full. How many leftover?",
        scene: "██████████ █  11",
        choices: [
          { id: "1", label: "1 leftover", emoji: "1️⃣", correct: true },
          { id: "11", label: "11 leftover", emoji: "🚌", correct: false },
          { id: "10", label: "10 leftover", emoji: "🔟", correct: false },
        ],
      },
      {
        id: "taxi-16",
        prompt: "16 riders. How many leftover after one full ten?",
        spoken: "Sixteen friends. How many leftover after a full ten?",
        scene: "██████████ ██████  16",
        choices: [
          { id: "6", label: "6 leftover", emoji: "6️⃣", correct: true },
          { id: "1", label: "1 leftover", emoji: "1️⃣", correct: false },
          { id: "16", label: "16 leftover", emoji: "🚕", correct: false },
        ],
      },
      {
        id: "taxi-18",
        prompt: "18 riders. How many leftover after one ten?",
        spoken: "Eighteen friends. How many leftover after one ten?",
        scene: "██████████ ████████  18",
        choices: [
          { id: "8", label: "8 leftover", emoji: "8️⃣", correct: true },
          { id: "2", label: "2 leftover", emoji: "2️⃣", correct: false },
          { id: "10", label: "10 leftover", emoji: "🔟", correct: false },
        ],
      },
      {
        id: "taxi-9",
        prompt: "9 riders. No ten yet. How many ones are sitting?",
        spoken: "Nine friends. No full ten yet. How many ones?",
        scene: "█████████░  9",
        choices: [
          { id: "9", label: "9 ones", emoji: "9️⃣", correct: true },
          { id: "1-ten", label: "1 ten", emoji: "1️⃣", correct: false },
          { id: "0", label: "0 ones", emoji: "0️⃣", correct: false },
        ],
      },
      {
        id: "taxi-13",
        prompt: "13 riders. How many leftover after one ten?",
        spoken: "Thirteen friends. How many leftover after one ten?",
        scene: "██████████ ███  13",
        choices: [
          { id: "3", label: "3 leftover", emoji: "3️⃣", correct: true },
          { id: "13", label: "13 leftover", emoji: "🚕", correct: false },
          { id: "10", label: "10 leftover", emoji: "🔟", correct: false },
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
      {
        id: "fl-flour",
        prompt: "F + L. What starts with fl?",
        spoken: "F and L. Fl. What starts with fl?",
        scene: "F + L → fl",
        choices: [
          { id: "flour", label: "Flour", emoji: "🌾", correct: true },
          { id: "salt", label: "Salt", emoji: "🧂", correct: false },
          { id: "oil", label: "Oil", emoji: "🫒", correct: false },
        ],
      },
      {
        id: "cr-cream",
        prompt: "C + R. What starts with cr?",
        spoken: "C and R. Cr. What starts with cr?",
        scene: "C + R → cr",
        choices: [
          { id: "cream", label: "Cream", emoji: "🥛", correct: true },
          { id: "jam", label: "Jam", emoji: "🍓", correct: false },
          { id: "toast", label: "Toast", emoji: "🍞", correct: false },
        ],
      },
      {
        id: "sm-smoothie",
        prompt: "S + M. What starts with sm?",
        spoken: "S and M. Sm. What starts with sm?",
        scene: "S + M → sm",
        choices: [
          { id: "smoothie", label: "Smoothie", emoji: "🥤", correct: true },
          { id: "carrot", label: "Carrot", emoji: "🥕", correct: false },
          { id: "pea", label: "Pea", emoji: "🟢", correct: false },
        ],
      },
      {
        id: "pl-plum",
        prompt: "P + L. What starts with pl?",
        spoken: "P and L. Pl. What starts with pl?",
        scene: "P + L → pl",
        choices: [
          { id: "plum", label: "Plum", emoji: "🟣", correct: true },
          { id: "kiwi", label: "Kiwi", emoji: "🥝", correct: false },
          { id: "lime", label: "Lime", emoji: "🍋", correct: false },
        ],
      },
      {
        id: "dr-drink",
        prompt: "D + R. What starts with dr?",
        spoken: "D and R. Dr. What starts with dr?",
        scene: "D + R → dr",
        choices: [
          { id: "drink", label: "Drink", emoji: "🧃", correct: true },
          { id: "napkin", label: "Napkin", emoji: "🧻", correct: false },
          { id: "spoon", label: "Spoon", emoji: "🥄", correct: false },
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
      {
        id: "abab-green-yellow",
        prompt: "🟢 🟡 🟢 🟡 🟢 ?",
        spoken: "Green, yellow, green, yellow, green. What bead comes next?",
        scene: "ABAB paint beads",
        choices: [
          { id: "yellow", label: "Yellow bead", emoji: "🟡", correct: true },
          { id: "green", label: "Green bead", emoji: "🟢", correct: false },
          { id: "blue", label: "Blue bead", emoji: "🔵", correct: false },
        ],
      },
      {
        id: "abb-car",
        prompt: "🚗 🚌 🚌 🚗 🚌 ?",
        spoken: "Car, bus, bus, car, bus. What comes next?",
        scene: "ABB garage train",
        choices: [
          { id: "bus", label: "Bus", emoji: "🚌", correct: true },
          { id: "car", label: "Car", emoji: "🚗", correct: false },
          { id: "bike", label: "Bike", emoji: "🚲", correct: false },
        ],
      },
      {
        id: "abc-weather",
        prompt: "☀️ 🌧️ ❄️ ☀️ 🌧️ ?",
        spoken: "Sun, rain, snow, sun, rain. What comes next?",
        scene: "ABC sky chain",
        choices: [
          { id: "snow", label: "Snow", emoji: "❄️", correct: true },
          { id: "sun", label: "Sun", emoji: "☀️", correct: false },
          { id: "cloud", label: "Cloud", emoji: "☁️", correct: false },
        ],
      },
      {
        id: "grow-bug",
        prompt: "🥚 🐛 🦋 🥚 🐛 ?",
        spoken: "Egg, caterpillar, butterfly, egg, caterpillar. What comes next?",
        scene: "Bug life train",
        choices: [
          { id: "butterfly", label: "Butterfly", emoji: "🦋", correct: true },
          { id: "egg", label: "Egg", emoji: "🥚", correct: false },
          { id: "leaf", label: "Leaf", emoji: "🍃", correct: false },
        ],
      },
      {
        id: "two-one",
        prompt: "⭐ ⭐ 🌙 ⭐ ⭐ ?",
        spoken: "Star star moon, star star. What comes next?",
        scene: "AAB night beads",
        choices: [
          { id: "moon", label: "Moon", emoji: "🌙", correct: true },
          { id: "star", label: "Star", emoji: "⭐", correct: false },
          { id: "sun", label: "Sun", emoji: "☀️", correct: false },
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
      {
        id: "2-plus-3",
        prompt: "2 apples, then 3 more. How many apples?",
        spoken: "Two apples, plus three more. How many?",
        scene: "🍎🍎 + 🍎🍎🍎",
        choices: [
          { id: "5", label: "5 apples", emoji: "5️⃣", correct: true },
          { id: "23", label: "23 apples", emoji: "🤯", correct: false },
          { id: "2", label: "2 apples", emoji: "2️⃣", correct: false },
        ],
      },
      {
        id: "9-minus-1",
        prompt: "9 muffins. Pip eats 1. How many left?",
        spoken: "Nine muffins. Pip eats one. How many left?",
        scene: "🧁🧁🧁🧁🧁🧁🧁🧁🧁 − 1",
        choices: [
          { id: "8", label: "8 muffins", emoji: "8️⃣", correct: true },
          { id: "10", label: "10 muffins", emoji: "🔟", correct: false },
          { id: "1", label: "1 muffin", emoji: "1️⃣", correct: false },
        ],
      },
      {
        id: "3-plus-3",
        prompt: "3 cups and 3 cups. How many?",
        spoken: "Three cups and three cups. How many?",
        scene: "🥤🥤🥤 + 🥤🥤🥤",
        choices: [
          { id: "6", label: "6 cups", emoji: "6️⃣", correct: true },
          { id: "33", label: "33 cups", emoji: "😵", correct: false },
          { id: "3", label: "3 cups", emoji: "3️⃣", correct: false },
        ],
      },
      {
        id: "8-minus-3",
        prompt: "8 plums. Nana takes 3 for later. How many left?",
        spoken: "Eight plums. Nana takes three. How many left?",
        scene: "🟣🟣🟣🟣🟣🟣🟣🟣 − 3",
        choices: [
          { id: "5", label: "5 plums", emoji: "5️⃣", correct: true },
          { id: "11", label: "11 plums", emoji: "📦", correct: false },
          { id: "3", label: "3 plums", emoji: "3️⃣", correct: false },
        ],
      },
      {
        id: "5-plus-5",
        prompt: "5 crackers and 5 crackers. How many?",
        spoken: "Five crackers and five crackers. How many?",
        scene: "🍘🍘🍘🍘🍘 + 🍘🍘🍘🍘🍘",
        choices: [
          { id: "10", label: "10 crackers", emoji: "🔟", correct: true },
          { id: "55", label: "55 crackers", emoji: "😵", correct: false },
          { id: "5", label: "5 crackers", emoji: "5️⃣", correct: false },
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
      {
        id: "fog",
        prompt: "The yard is a white soup. You can barely see the gate. What is it?",
        spoken: "The yard is white and hard to see. What is the weather?",
        scene: "🌫️ yard",
        choices: [
          { id: "fog", label: "Fog", emoji: "🌫️", correct: true },
          { id: "snow-storm", label: "A snowman", emoji: "⛄", correct: false },
          { id: "night", label: "Night only", emoji: "🌙", correct: false },
        ],
      },
      {
        id: "thunder",
        prompt: "A boom after a flash. What should Pip do?",
        spoken: "Thunder after lightning. What should Pip do?",
        scene: "⚡ porch",
        choices: [
          { id: "inside", label: "Come inside", emoji: "🏠", correct: true },
          { id: "kite", label: "Fly a kite", emoji: "🪁", correct: false },
          { id: "tree", label: "Stand under a tall tree", emoji: "🌳", correct: false },
        ],
      },
      {
        id: "spring",
        prompt: "Buds on the plum. Birds back. Which season?",
        spoken: "Buds on the plum tree. Birds are back. Which season?",
        scene: "🌸 yard",
        choices: [
          { id: "spring", label: "Spring", emoji: "🌷", correct: true },
          { id: "autumn", label: "Autumn", emoji: "🍂", correct: false },
          { id: "winter", label: "Winter", emoji: "❄️", correct: false },
        ],
      },
      {
        id: "puddle",
        prompt: "The rain just stopped. Shiny pools on the path. What is left?",
        spoken: "The rain stopped. What is left on the path?",
        scene: "💧 path",
        choices: [
          { id: "puddles", label: "Puddles", emoji: "💦", correct: true },
          { id: "snow", label: "Snow", emoji: "❄️", correct: false },
          { id: "sand", label: "Dry sand", emoji: "🏖️", correct: false },
        ],
      },
      {
        id: "night-cool",
        prompt: "The porch is dark and the air is cool. What does Pip fetch?",
        spoken: "Night on the porch and the air is cool. What does Pip fetch?",
        scene: "🌙 porch",
        choices: [
          { id: "sweater", label: "A sweater", emoji: "🧥", correct: true },
          { id: "swimsuit", label: "A swimsuit", emoji: "🩱", correct: false },
          { id: "fan", label: "A fan", emoji: "🪭", correct: false },
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
      {
        id: "hat",
        prompt: "Nana's sun hat. Clothes or not clothes?",
        spoken: "A sun hat. Which basket?",
        scene: "👒",
        choices: [
          { id: "clothes", label: "Clothes — hats with shirts", emoji: "👕", correct: true },
          { id: "toys", label: "Toys basket", emoji: "🧸", correct: false },
          { id: "socks", label: "Socks basket", emoji: "🧦", correct: false },
        ],
      },
      {
        id: "pants",
        prompt: "Pip's blue pants. Which basket?",
        spoken: "Blue pants. Which basket?",
        scene: "👖",
        choices: [
          { id: "shirts", label: "Clothes basket", emoji: "👕", correct: true },
          { id: "socks", label: "Socks basket", emoji: "🧦", correct: false },
          { id: "toys", label: "Toys basket", emoji: "🧸", correct: false },
        ],
      },
      {
        id: "crayon",
        prompt: "A crayon melted in the dryer. Clothes or not?",
        spoken: "A crayon in the dryer. Is it clothes?",
        scene: "🖍️",
        choices: [
          { id: "not-clothes", label: "Not clothes — toys", emoji: "🧸", correct: true },
          { id: "shirt-ish", label: "Shirts basket", emoji: "👕", correct: false },
          { id: "sock-ish", label: "Socks basket", emoji: "🧦", correct: false },
        ],
      },
      {
        id: "towel",
        prompt: "A wet bath towel. Which basket?",
        spoken: "A wet towel. Which basket?",
        scene: "🛁",
        choices: [
          { id: "clothes", label: "Clothes basket", emoji: "👕", correct: true },
          { id: "toys", label: "Toys basket", emoji: "🧸", correct: false },
          { id: "split", label: "Throw it away", emoji: "🗑️", correct: false },
        ],
      },
      {
        id: "gloves",
        prompt: "Two mittens that match. Keep them together?",
        spoken: "Two mittens that match. Keep them together?",
        scene: "🧤🧤",
        choices: [
          { id: "together", label: "Keep the pair", emoji: "🤝", correct: true },
          { id: "split", label: "Split the pair", emoji: "✂️", correct: false },
          { id: "toys", label: "Toys basket", emoji: "🧸", correct: false },
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
      {
        id: "who-baked",
        prompt: "Nana baked a warm bun and Pip waited on the step. Who baked?",
        spoken: "Nana baked a warm bun and Pip waited on the step. Who baked?",
        scene: "Porch: oven smell",
        choices: [
          { id: "nana", label: "Nana", emoji: "👵", correct: true },
          { id: "pip", label: "Pip", emoji: "🧒", correct: false },
          { id: "cat", label: "The cat", emoji: "🐱", correct: false },
        ],
      },
      {
        id: "what-baked",
        prompt: "Same story. What did Nana bake?",
        spoken: "Nana baked a warm bun and Pip waited on the step. What did she bake?",
        scene: "Porch: oven smell",
        choices: [
          { id: "bun", label: "A warm bun", emoji: "🍞", correct: true },
          { id: "soup", label: "Soup", emoji: "🍲", correct: false },
          { id: "pie", label: "A pie", emoji: "🥧", correct: false },
        ],
      },
      {
        id: "where-waited",
        prompt: "Where did Pip wait?",
        spoken: "Nana baked a warm bun and Pip waited on the step. Where did Pip wait?",
        scene: "Porch: oven smell",
        choices: [
          { id: "step", label: "On the step", emoji: "🪜", correct: true },
          { id: "bed", label: "In bed", emoji: "🛏️", correct: false },
          { id: "barn", label: "In the barn", emoji: "🏚️", correct: false },
        ],
      },
      {
        id: "frog-who",
        prompt: "A frog hopped onto the rail and sang. Who sang?",
        spoken: "A frog hopped onto the rail and sang. Who sang?",
        scene: "Evening rail",
        choices: [
          { id: "frog", label: "The frog", emoji: "🐸", correct: true },
          { id: "owl", label: "An owl", emoji: "🦉", correct: false },
          { id: "pip", label: "Pip", emoji: "🧒", correct: false },
        ],
      },
      {
        id: "frog-where",
        prompt: "Where did the frog hop?",
        spoken: "A frog hopped onto the rail and sang. Where did it hop?",
        scene: "Evening rail",
        choices: [
          { id: "rail", label: "Onto the rail", emoji: "🪵", correct: true },
          { id: "pond", label: "Into the pond", emoji: "💧", correct: false },
          { id: "hat", label: "Into a hat", emoji: "🎩", correct: false },
        ],
      },
    ],
  },
  {
    id: "sock-drawer",
    activityId: "toddler-sock-drawer",
    experienceId: "sock-drawer",
    skillId: "logic-k1-sorting",
    domain: "logic",
    title: "Sock Drawer",
    tagline: "Open Nana's drawer. Keep the pair. Spot the odd sock.",
    emoji: "🧦",
    accent: "from-rose-400 to-fuchsia-500",
    rounds: [
      {
        id: "match-red",
        prompt: "Two red stripe socks and one blue. Which is the pair?",
        spoken: "Two red stripe socks and one blue sock. Which is the pair?",
        scene: "🧦🔴 🧦🔴 🧦🔵",
        choices: [
          { id: "reds", label: "The two red socks", emoji: "🔴", correct: true },
          { id: "blue", label: "The blue sock", emoji: "🔵", correct: false },
          { id: "all", label: "All three together", emoji: "🧺", correct: false },
        ],
      },
      {
        id: "odd-spot",
        prompt: "Three socks: spot, spot, stripe. Which is the odd one?",
        spoken: "Spot, spot, stripe. Which sock does not match?",
        scene: "🧦 🧦 🦓",
        choices: [
          { id: "stripe", label: "The stripe sock", emoji: "🦓", correct: true },
          { id: "spots", label: "A spot sock", emoji: "🧦", correct: false },
          { id: "drawer", label: "The whole drawer", emoji: "📦", correct: false },
        ],
      },
      {
        id: "tiny-big",
        prompt: "A tiny sock and a giant sock. Same pair?",
        spoken: "A tiny sock and a giant sock. Are they a pair?",
        scene: "🧦 🧦",
        choices: [
          { id: "no", label: "No — different sizes", emoji: "🚫", correct: true },
          { id: "yes", label: "Yes — both socks", emoji: "✅", correct: false },
          { id: "toys", label: "Put them with toys", emoji: "🧸", correct: false },
        ],
      },
      {
        id: "two-left",
        prompt: "Two left-foot socks. Is that a walking pair?",
        spoken: "Two left-foot socks. Is that a pair you can wear?",
        scene: "⬅️ ⬅️",
        choices: [
          { id: "no", label: "No — need a right too", emoji: "➡️", correct: true },
          { id: "yes", label: "Yes — two is a pair", emoji: "✅", correct: false },
          { id: "hat", label: "Wear them as a hat", emoji: "🎩", correct: false },
        ],
      },
      {
        id: "color-sort",
        prompt: "Yellow sock, yellow sock, green sock. What goes in the yellow pile?",
        spoken: "Yellow, yellow, green. What goes in the yellow pile?",
        scene: "🟡 🟡 🟢",
        choices: [
          { id: "yellows", label: "The two yellow socks", emoji: "🟡", correct: true },
          { id: "green", label: "The green sock", emoji: "🟢", correct: false },
          { id: "all", label: "All of them", emoji: "🌈", correct: false },
        ],
      },
      {
        id: "lost-mate",
        prompt: "Pip has one dotted sock. What is missing?",
        spoken: "Pip has one dotted sock. What is missing?",
        scene: "🧦 · · ·",
        choices: [
          { id: "mate", label: "Its matching sock", emoji: "🧦", correct: true },
          { id: "shirt", label: "A shirt", emoji: "👕", correct: false },
          { id: "shoe", label: "A shoe", emoji: "👟", correct: false },
        ],
      },
      {
        id: "long-short",
        prompt: "A long sock and a short sock, same colour. Pair or not?",
        spoken: "A long sock and a short sock, same colour. Are they a pair?",
        scene: "🧦 🩳",
        choices: [
          { id: "not", label: "Not a pair — different length", emoji: "🚫", correct: true },
          { id: "yes", label: "Yes — same colour", emoji: "✅", correct: false },
          { id: "wash", label: "Throw both away", emoji: "🗑️", correct: false },
        ],
      },
      {
        id: "three-pairs",
        prompt: "The drawer has 3 red pairs. How many red socks is that?",
        spoken: "Three red pairs. How many red socks?",
        scene: "🧦🧦 🧦🧦 🧦🧦",
        choices: [
          { id: "6", label: "6 socks", emoji: "6️⃣", correct: true },
          { id: "3", label: "3 socks", emoji: "3️⃣", correct: false },
          { id: "2", label: "2 socks", emoji: "2️⃣", correct: false },
        ],
      },
    ],
  },
  {
    id: "farm-count",
    activityId: "toddler-farm-count",
    experienceId: "farm-count",
    skillId: "math-k1-counting",
    domain: "math",
    title: "Farm Count",
    tagline: "Count the animals in the stall. Past five, up the lane.",
    emoji: "🐄",
    accent: "from-lime-500 to-amber-400",
    rounds: [
      {
        id: "six-cows",
        prompt: "🐄🐄🐄🐄🐄🐄 How many cows in the stall?",
        spoken: "Count the cows in the stall. How many?",
        scene: "stall of cows",
        choices: [
          { id: "6", label: "6 cows", emoji: "6️⃣", correct: true },
          { id: "5", label: "5 cows", emoji: "5️⃣", correct: false },
          { id: "8", label: "8 cows", emoji: "8️⃣", correct: false },
        ],
      },
      {
        id: "eight-chicks",
        prompt: "🐤🐤🐤🐤🐤🐤🐤🐤 How many chicks?",
        spoken: "Count the chicks. How many?",
        scene: "chick run",
        choices: [
          { id: "8", label: "8 chicks", emoji: "8️⃣", correct: true },
          { id: "6", label: "6 chicks", emoji: "6️⃣", correct: false },
          { id: "10", label: "10 chicks", emoji: "🔟", correct: false },
        ],
      },
      {
        id: "seven-pigs",
        prompt: "🐖🐖🐖🐖🐖🐖🐖 How many pigs in the mud?",
        spoken: "Count the pigs. How many?",
        scene: "mud pen",
        choices: [
          { id: "7", label: "7 pigs", emoji: "7️⃣", correct: true },
          { id: "4", label: "4 pigs", emoji: "4️⃣", correct: false },
          { id: "9", label: "9 pigs", emoji: "9️⃣", correct: false },
        ],
      },
      {
        id: "ten-sheep",
        prompt: "🐑🐑🐑🐑🐑 🐑🐑🐑🐑🐑 A full ten. How many sheep?",
        spoken: "A full row of ten sheep. How many?",
        scene: "sheep lane",
        choices: [
          { id: "10", label: "10 sheep", emoji: "🔟", correct: true },
          { id: "5", label: "5 sheep", emoji: "5️⃣", correct: false },
          { id: "2", label: "2 sheep", emoji: "2️⃣", correct: false },
        ],
      },
      {
        id: "nine-ducks",
        prompt: "🦆🦆🦆🦆🦆🦆🦆🦆🦆 How many ducks on the pond?",
        spoken: "Count the ducks on the pond. How many?",
        scene: "pond",
        choices: [
          { id: "9", label: "9 ducks", emoji: "9️⃣", correct: true },
          { id: "8", label: "8 ducks", emoji: "8️⃣", correct: false },
          { id: "11", label: "11 ducks", emoji: "🚌", correct: false },
        ],
      },
      {
        id: "twelve-hens",
        prompt: "Two nests of 6 hens. How many hens in all?",
        spoken: "Two nests of six hens. How many hens in all?",
        scene: "🐔🐔🐔🐔🐔🐔 + 🐔🐔🐔🐔🐔🐔",
        choices: [
          { id: "12", label: "12 hens", emoji: "📦", correct: true },
          { id: "6", label: "6 hens", emoji: "6️⃣", correct: false },
          { id: "2", label: "2 hens", emoji: "2️⃣", correct: false },
        ],
      },
      {
        id: "one-more",
        prompt: "The stall had 7 goats. One more trots in. How many now?",
        spoken: "Seven goats, then one more. How many now?",
        scene: "🐐🐐🐐🐐🐐🐐🐐 + 1",
        choices: [
          { id: "8", label: "8 goats", emoji: "8️⃣", correct: true },
          { id: "7", label: "7 goats", emoji: "7️⃣", correct: false },
          { id: "6", label: "6 goats", emoji: "6️⃣", correct: false },
        ],
      },
      {
        id: "one-less",
        prompt: "11 horses. One leaves the barn. How many left?",
        spoken: "Eleven horses. One leaves. How many left?",
        scene: "🐴 × 11 − 1",
        choices: [
          { id: "10", label: "10 horses", emoji: "🔟", correct: true },
          { id: "11", label: "11 horses", emoji: "🐴", correct: false },
          { id: "12", label: "12 horses", emoji: "📦", correct: false },
        ],
      },
    ],
  },
];

export function getK1StudioGame(id: string): K1StudioGame | undefined {
  return K1_STUDIO_GAMES.find((game) => game.id === id);
}

export const K1_STUDIO_GAME_IDS = K1_STUDIO_GAMES.map((game) => game.id);
