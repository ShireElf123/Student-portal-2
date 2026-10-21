/** Counting tab — real ten-frames to twenty, neighborhood things. */
export interface CountingCard {
  num: number;
  word: string;
  item: string;
  emoji: string;
  scene: string;
}

export const COUNTING_CARDS: CountingCard[] = [
  { num: 1, word: "One", item: "porch sun", emoji: "☀️", scene: "One sun on the stoop." },
  { num: 2, word: "Two", item: "rain boots", emoji: "👢", scene: "Two boots by the mat." },
  { num: 3, word: "Three", item: "lemons", emoji: "🍋", scene: "Three lemons in the icebox." },
  { num: 4, word: "Four", item: "pegs", emoji: "📌", scene: "Four pegs for the wash line." },
  { num: 5, word: "Five", item: "coins", emoji: "🪙", scene: "Five coins that stay in the pocket." },
  { num: 6, word: "Six", item: "cups", emoji: "🥤", scene: "Six cups for the porch table." },
  { num: 7, word: "Seven", item: "crumbs", emoji: "🍞", scene: "Seven crumbs for the pigeons." },
  { num: 8, word: "Eight", item: "books", emoji: "📗", scene: "Eight books on the nook shelf." },
  { num: 9, word: "Nine", item: "stars", emoji: "⭐", scene: "Nine stars on the balcony." },
  { num: 10, word: "Ten", item: "eggs", emoji: "🥚", scene: "Ten eggs. A full ten-frame." },
  { num: 11, word: "Eleven", item: "buttons", emoji: "🔘", scene: "Ten buttons and one spare." },
  { num: 12, word: "Twelve", item: "eggs in a carton", emoji: "🥚", scene: "A dozen. Ten and two more." },
  { num: 13, word: "Thirteen", item: "chalk suns", emoji: "🖍️", scene: "Ten chalk marks and three more." },
  { num: 14, word: "Fourteen", item: "letters", emoji: "✉️", scene: "Ten letters and four waiting." },
  { num: 15, word: "Fifteen", item: "bounces", emoji: "🏀", scene: "Ten bounces and five more on the stoop." },
  { num: 16, word: "Sixteen", item: "crayons", emoji: "🖍️", scene: "Ten crayons and a row of six." },
  { num: 17, word: "Seventeen", item: "rain taps", emoji: "🌧️", scene: "Ten taps and seven on the glass." },
  { num: 18, word: "Eighteen", item: "cookies", emoji: "🍪", scene: "Ten cookies and eight on the rack." },
  { num: 19, word: "Nineteen", item: "moon steps", emoji: "🌙", scene: "Ten steps and nine. Almost twenty." },
  { num: 20, word: "Twenty", item: "two ten-frames", emoji: "🔢", scene: "Two full ten-frames. Twenty." },
];

export interface MoreLessRound {
  id: string;
  left: number;
  right: number;
  emoji: string;
  spoken: string;
}

export const MORE_LESS_ROUNDS: MoreLessRound[] = [
  { id: "ml-1", left: 2, right: 5, emoji: "🍋", spoken: "Which pile has more lemons?" },
  { id: "ml-2", left: 6, right: 3, emoji: "🪙", spoken: "Which pile has more coins?" },
  { id: "ml-3", left: 4, right: 4, emoji: "📌", spoken: "Are the pegs the same, or does one have more?" },
  { id: "ml-4", left: 1, right: 7, emoji: "🥚", spoken: "Which pile has more eggs?" },
  { id: "ml-5", left: 8, right: 5, emoji: "📗", spoken: "Which pile has more books?" },
  { id: "ml-6", left: 3, right: 9, emoji: "⭐", spoken: "Which pile has more stars?" },
  { id: "ml-7", left: 10, right: 6, emoji: "🍪", spoken: "Which pile has more cookies?" },
  { id: "ml-8", left: 2, right: 8, emoji: "🔘", spoken: "Which pile has more buttons?" },
];

export interface MakeTenRound {
  have: number;
  emoji: string;
  spoken: string;
}

export const MAKE_TEN_ROUNDS: MakeTenRound[] = [
  { have: 7, emoji: "🪙", spoken: "Seven coins. Tap until the ten-frame is full." },
  { have: 3, emoji: "🥚", spoken: "Three eggs. Fill the rest of ten." },
  { have: 9, emoji: "📌", spoken: "Nine pegs. One more makes ten." },
  { have: 5, emoji: "🍋", spoken: "Five lemons. Fill to ten." },
  { have: 1, emoji: "☀️", spoken: "One sun. Fill the rest of ten." },
  { have: 8, emoji: "📗", spoken: "Eight books. Two more make ten." },
  { have: 4, emoji: "🧦", spoken: "Four socks. Fill to ten." },
  { have: 6, emoji: "⭐", spoken: "Six stars. Fill to ten." },
];

export interface SubitizeRound {
  n: number;
  emoji: string;
}

export const SUBITIZE_ROUNDS: SubitizeRound[] = [
  { n: 1, emoji: "☀️" },
  { n: 2, emoji: "👢" },
  { n: 3, emoji: "🍋" },
  { n: 4, emoji: "📌" },
  { n: 5, emoji: "🪙" },
  { n: 3, emoji: "⭐" },
  { n: 4, emoji: "🥚" },
  { n: 2, emoji: "🧦" },
  { n: 5, emoji: "🍪" },
  { n: 1, emoji: "🌙" },
];

export interface ShapeRound {
  id: string;
  name: string;
  emoji: string;
  spoken: string;
  options: [string, string, string];
}

export interface PatternRound {
  id: string;
  shown: string[];
  options: [string, string];
  answer: string;
  spoken: string;
}

export const PATTERN_ROUNDS: PatternRound[] = [
  { id: "pat-sun-moon", shown: ["☀️", "🌙", "☀️", "🌙", "?"], options: ["☀️", "🍋"], answer: "☀️", spoken: "Sun, moon, sun, moon. What comes next?" },
  { id: "pat-boot", shown: ["👢", "👢", "🪙", "👢", "👢", "?"], options: ["🪙", "🍉"], answer: "🪙", spoken: "Boot boot coin. Boot boot…?" },
  { id: "pat-bus", shown: ["🚌", "🛑", "🚌", "🛑", "?"], options: ["🚌", "🐱"], answer: "🚌", spoken: "Bus, stop, bus, stop. What comes next?" },
  { id: "pat-plate", shown: ["🍽️", "🍽️", "🍋", "🍽️", "🍽️", "?"], options: ["🍋", "⛴️"], answer: "🍋", spoken: "Plate plate lemon. Plate plate…?" },
  { id: "pat-seed", shown: ["🌱", "🍅", "🌱", "🍅", "?"], options: ["🌱", "🚕"], answer: "🌱", spoken: "Seed, tomato, seed, tomato. Next?" },
  { id: "pat-drop", shown: ["💧", "💧", "⭕", "💧", "💧", "?"], options: ["⭕", "🍞"], answer: "⭕", spoken: "Drop drop ripple. Drop drop…?" },
  { id: "pat-peg", shown: ["📌", "👕", "📌", "👕", "?"], options: ["📌", "🐧"], answer: "📌", spoken: "Peg, shirt, peg, shirt. Next?" },
  { id: "pat-loaf", shown: ["🥣", "🍞", "🥣", "🍞", "?"], options: ["🥣", "🚌"], answer: "🥣", spoken: "Bowl, loaf, bowl, loaf. What comes next?" },
];

export interface NextNumberRound {
  n: number;
  answer: number;
  options: [number, number, number];
  spoken: string;
}

export const NEXT_NUMBER_ROUNDS: NextNumberRound[] = [
  { n: 1, answer: 2, options: [2, 5, 9], spoken: "One. What number comes next?" },
  { n: 3, answer: 4, options: [4, 2, 8], spoken: "Three. What number comes next?" },
  { n: 4, answer: 5, options: [5, 1, 7], spoken: "Four. What number comes next?" },
  { n: 6, answer: 7, options: [7, 9, 2], spoken: "Six. What number comes next?" },
  { n: 9, answer: 10, options: [10, 8, 3], spoken: "Nine. What number comes next?" },
  { n: 10, answer: 11, options: [11, 20, 8], spoken: "Ten. What number comes next?" },
  { n: 14, answer: 15, options: [15, 13, 4], spoken: "Fourteen. What number comes next?" },
  { n: 19, answer: 20, options: [20, 18, 10], spoken: "Nineteen. What number comes next?" },
];

export const SHAPE_ROUNDS: ShapeRound[] = [
  { id: "sh-sun", name: "Circle", emoji: "☀️", spoken: "The chalk sun. What shape?", options: ["Circle", "Square", "Triangle"] },
  { id: "sh-mat", name: "Square", emoji: "🟫", spoken: "The welcome mat. What shape?", options: ["Square", "Circle", "Triangle"] },
  { id: "sh-sail", name: "Triangle", emoji: "⛵", spoken: "The boat sail. What shape?", options: ["Triangle", "Square", "Circle"] },
  { id: "sh-door", name: "Rectangle", emoji: "🚪", spoken: "The door. What shape?", options: ["Rectangle", "Circle", "Triangle"] },
  { id: "sh-coin", name: "Circle", emoji: "🪙", spoken: "A coin. What shape?", options: ["Circle", "Square", "Rectangle"] },
  { id: "sh-window", name: "Square", emoji: "🪟", spoken: "The snow window. What shape?", options: ["Square", "Triangle", "Circle"] },
  { id: "sh-knob", name: "Circle", emoji: "🔘", spoken: "A door knob. What shape?", options: ["Circle", "Triangle", "Rectangle"] },
  { id: "sh-roof", name: "Triangle", emoji: "🏠", spoken: "The little roof. What shape?", options: ["Triangle", "Circle", "Square"] },
];
