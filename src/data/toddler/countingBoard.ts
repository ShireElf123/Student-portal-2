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
