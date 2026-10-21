/** Phonics tab deck — neighborhood words, not a generic A–Z poster. */
export interface PhonicsTile {
  letter: string;
  word: string;
  emoji: string;
  sound: string;
  examples: { word: string; emoji: string }[];
}

export interface WordFamily {
  rime: string;
  emoji: string;
  sound: string;
  words: { word: string; emoji: string }[];
}

export const PHONICS_TILES: PhonicsTile[] = [
  { letter: "A", word: "Attic", emoji: "🧳", sound: "A says /æ/. Attic. Apple. Ant.", examples: [{ word: "Attic", emoji: "🧳" }, { word: "Apple", emoji: "🍎" }, { word: "Ant", emoji: "🐜" }] },
  { letter: "B", word: "Bus", emoji: "🚌", sound: "B says /b/. Bus. Bun. Bell.", examples: [{ word: "Bus", emoji: "🚌" }, { word: "Bun", emoji: "🥯" }, { word: "Bell", emoji: "🔔" }] },
  { letter: "C", word: "Cat", emoji: "🐱", sound: "C says /k/. Cat. Cup. Coin.", examples: [{ word: "Cat", emoji: "🐱" }, { word: "Cup", emoji: "🥤" }, { word: "Coin", emoji: "🪙" }] },
  { letter: "D", word: "Dock", emoji: "⚓", sound: "D says /d/. Dock. Door. Dot.", examples: [{ word: "Dock", emoji: "⚓" }, { word: "Door", emoji: "🚪" }, { word: "Dot", emoji: "🐭" }] },
  { letter: "E", word: "Egg", emoji: "🥚", sound: "E says /ɛ/. Egg. Exit. End.", examples: [{ word: "Egg", emoji: "🥚" }, { word: "Exit", emoji: "🚶" }, { word: "End", emoji: "📖" }] },
  { letter: "F", word: "Ferry", emoji: "⛴️", sound: "F says /f/. Ferry. Fog. Fish.", examples: [{ word: "Ferry", emoji: "⛴️" }, { word: "Fog", emoji: "🌫️" }, { word: "Fish", emoji: "🐟" }] },
  { letter: "G", word: "Gull", emoji: "🐦", sound: "G says /g/. Gull. Gate. Gum.", examples: [{ word: "Gull", emoji: "🐦" }, { word: "Gate", emoji: "🚪" }, { word: "Gum", emoji: "🍬" }] },
  { letter: "H", word: "Hat", emoji: "🎩", sound: "H says /h/. Hat. Home. Hop.", examples: [{ word: "Hat", emoji: "🎩" }, { word: "Home", emoji: "🏡" }, { word: "Hop", emoji: "🐰" }] },
  { letter: "I", word: "Ink", emoji: "🖋️", sound: "I says /ɪ/. Ink. In. Igloo.", examples: [{ word: "Ink", emoji: "🖋️" }, { word: "In", emoji: "📥" }, { word: "Igloo", emoji: "🧊" }] },
  { letter: "J", word: "Jam", emoji: "🍓", sound: "J says /j/. Jam. Jar. Jump.", examples: [{ word: "Jam", emoji: "🍓" }, { word: "Jar", emoji: "🫙" }, { word: "Jump", emoji: "👟" }] },
  { letter: "K", word: "Key", emoji: "🔑", sound: "K says /k/. Key. Kite. Knob.", examples: [{ word: "Key", emoji: "🔑" }, { word: "Kite", emoji: "🪁" }, { word: "Knob", emoji: "🔘" }] },
  { letter: "L", word: "Loaf", emoji: "🍞", sound: "L says /l/. Loaf. Lamp. Line.", examples: [{ word: "Loaf", emoji: "🍞" }, { word: "Lamp", emoji: "💡" }, { word: "Line", emoji: "🧵" }] },
  { letter: "M", word: "Mat", emoji: "🟫", sound: "M says /m/. Mat. Moon. Milk.", examples: [{ word: "Mat", emoji: "🟫" }, { word: "Moon", emoji: "🌙" }, { word: "Milk", emoji: "🥛" }] },
  { letter: "N", word: "Nest", emoji: "🪺", sound: "N says /n/. Nest. Nap. Nana.", examples: [{ word: "Nest", emoji: "🪺" }, { word: "Nap", emoji: "😴" }, { word: "Nana", emoji: "🧶" }] },
  { letter: "O", word: "Orange", emoji: "🍊", sound: "O says /ɒ/. Orange. On. Otter.", examples: [{ word: "Orange", emoji: "🍊" }, { word: "On", emoji: "💡" }, { word: "Otter", emoji: "🦦" }] },
  { letter: "P", word: "Porch", emoji: "🏡", sound: "P says /p/. Porch. Pan. Peg.", examples: [{ word: "Porch", emoji: "🏡" }, { word: "Pan", emoji: "🍳" }, { word: "Peg", emoji: "📌" }] },
  { letter: "Q", word: "Quilt", emoji: "🧵", sound: "Q says /kw/. Quilt. Quiet. Queen.", examples: [{ word: "Quilt", emoji: "🧵" }, { word: "Quiet", emoji: "🤫" }, { word: "Queen", emoji: "👑" }] },
  { letter: "R", word: "Rain", emoji: "🌧️", sound: "R says /r/. Rain. Rope. Red.", examples: [{ word: "Rain", emoji: "🌧️" }, { word: "Rope", emoji: "🪢" }, { word: "Red", emoji: "🔴" }] },
  { letter: "S", word: "Stoop", emoji: "🪜", sound: "S says /s/. Stoop. Sun. Sock.", examples: [{ word: "Stoop", emoji: "🪜" }, { word: "Sun", emoji: "☀️" }, { word: "Sock", emoji: "🧦" }] },
  { letter: "T", word: "Taxi", emoji: "🚕", sound: "T says /t/. Taxi. Toast. Token.", examples: [{ word: "Taxi", emoji: "🚕" }, { word: "Toast", emoji: "🍞" }, { word: "Token", emoji: "🪙" }] },
  { letter: "U", word: "Umbrella", emoji: "☂️", sound: "U says /ʌ/. Umbrella. Up. Under.", examples: [{ word: "Umbrella", emoji: "☂️" }, { word: "Up", emoji: "⬆️" }, { word: "Under", emoji: "🟫" }] },
  { letter: "V", word: "Van", emoji: "🚐", sound: "V says /v/. Van. Vine. Vest.", examples: [{ word: "Van", emoji: "🚐" }, { word: "Vine", emoji: "🌿" }, { word: "Vest", emoji: "🦺" }] },
  { letter: "W", word: "Wash", emoji: "👕", sound: "W says /w/. Wash. Window. Wagon.", examples: [{ word: "Wash", emoji: "👕" }, { word: "Window", emoji: "🪟" }, { word: "Wagon", emoji: "🛒" }] },
  { letter: "X", word: "Box", emoji: "📦", sound: "X says /ks/. Box. Fox. Six.", examples: [{ word: "Box", emoji: "📦" }, { word: "Fox", emoji: "🦊" }, { word: "Six", emoji: "6️⃣" }] },
  { letter: "Y", word: "Yellow", emoji: "💛", sound: "Y says /y/. Yellow. Yarn. Yard.", examples: [{ word: "Yellow", emoji: "💛" }, { word: "Yarn", emoji: "🧶" }, { word: "Yard", emoji: "🌳" }] },
  { letter: "Z", word: "Zip", emoji: "🧥", sound: "Z says /z/. Zip. Zigzag. Zoo.", examples: [{ word: "Zip", emoji: "🧥" }, { word: "Zigzag", emoji: "⚡" }, { word: "Zoo", emoji: "🦁" }] },
];

export const WORD_FAMILIES: WordFamily[] = [
  { rime: "at", emoji: "🐱", sound: "A-T says at.", words: [{ word: "cat", emoji: "🐱" }, { word: "hat", emoji: "🎩" }, { word: "mat", emoji: "🟫" }] },
  { rime: "an", emoji: "🍳", sound: "A-N says an.", words: [{ word: "can", emoji: "🥫" }, { word: "man", emoji: "🧢" }, { word: "pan", emoji: "🍳" }] },
  { rime: "ap", emoji: "🧢", sound: "A-P says ap.", words: [{ word: "cap", emoji: "🧢" }, { word: "map", emoji: "🗺️" }, { word: "tap", emoji: "🚰" }] },
  { rime: "ag", emoji: "👜", sound: "A-G says ag.", words: [{ word: "bag", emoji: "👜" }, { word: "tag", emoji: "🏷️" }, { word: "wag", emoji: "🐶" }] },
  { rime: "en", emoji: "🖊️", sound: "E-N says en.", words: [{ word: "pen", emoji: "🖊️" }, { word: "hen", emoji: "🐔" }, { word: "ten", emoji: "🔟" }] },
  { rime: "et", emoji: "🥅", sound: "E-T says et.", words: [{ word: "net", emoji: "🥅" }, { word: "pet", emoji: "🐾" }, { word: "wet", emoji: "💧" }] },
  { rime: "ed", emoji: "🛏️", sound: "E-D says ed.", words: [{ word: "bed", emoji: "🛏️" }, { word: "red", emoji: "🔴" }, { word: "fed", emoji: "🥣" }] },
  { rime: "in", emoji: "📌", sound: "I-N says in.", words: [{ word: "pin", emoji: "📌" }, { word: "win", emoji: "🏆" }, { word: "tin", emoji: "🥫" }] },
  { rime: "ig", emoji: "🐷", sound: "I-G says ig.", words: [{ word: "pig", emoji: "🐷" }, { word: "dig", emoji: "🪣" }, { word: "wig", emoji: "💇" }] },
  { rime: "ip", emoji: "🚢", sound: "I-P says ip.", words: [{ word: "sip", emoji: "🥤" }, { word: "lip", emoji: "👄" }, { word: "dip", emoji: "🥣" }] },
  { rime: "op", emoji: "🧹", sound: "O-P says op.", words: [{ word: "hop", emoji: "🐰" }, { word: "mop", emoji: "🧹" }, { word: "top", emoji: "🔝" }] },
  { rime: "ot", emoji: "🍲", sound: "O-T says ot.", words: [{ word: "pot", emoji: "🍲" }, { word: "dot", emoji: "🔵" }, { word: "hot", emoji: "🔥" }] },
  { rime: "og", emoji: "🐕", sound: "O-G says og.", words: [{ word: "dog", emoji: "🐕" }, { word: "log", emoji: "🪵" }, { word: "fog", emoji: "🌫️" }] },
  { rime: "ug", emoji: "🐞", sound: "U-G says ug.", words: [{ word: "bug", emoji: "🐞" }, { word: "hug", emoji: "🤗" }, { word: "mug", emoji: "☕" }] },
  { rime: "un", emoji: "☀️", sound: "U-N says un.", words: [{ word: "sun", emoji: "☀️" }, { word: "run", emoji: "🏃" }, { word: "bun", emoji: "🥯" }] },
  { rime: "ut", emoji: "🥜", sound: "U-T says ut.", words: [{ word: "nut", emoji: "🥜" }, { word: "cut", emoji: "✂️" }, { word: "hut", emoji: "🛖" }] },
];

export interface SoundHunt {
  word: string;
  emoji: string;
  letter: string;
  decoys: [string, string];
  spoken: string;
}

export const SOUND_HUNTS: SoundHunt[] = [
  { word: "bus", emoji: "🚌", letter: "B", decoys: ["M", "S"], spoken: "Bus. What letter starts bus?" },
  { word: "cat", emoji: "🐱", letter: "C", decoys: ["K", "T"], spoken: "Cat. What letter starts cat?" },
  { word: "dock", emoji: "⚓", letter: "D", decoys: ["B", "P"], spoken: "Dock. What letter starts dock?" },
  { word: "ferry", emoji: "⛴️", letter: "F", decoys: ["V", "S"], spoken: "Ferry. What letter starts ferry?" },
  { word: "hat", emoji: "🎩", letter: "H", decoys: ["N", "A"], spoken: "Hat. What letter starts hat?" },
  { word: "jam", emoji: "🍓", letter: "J", decoys: ["G", "Y"], spoken: "Jam. What letter starts jam?" },
  { word: "key", emoji: "🔑", letter: "K", decoys: ["C", "Q"], spoken: "Key. What letter starts key?" },
  { word: "loaf", emoji: "🍞", letter: "L", decoys: ["B", "F"], spoken: "Loaf. What letter starts loaf?" },
  { word: "mat", emoji: "🟫", letter: "M", decoys: ["N", "W"], spoken: "Mat. What letter starts mat?" },
  { word: "nest", emoji: "🪺", letter: "N", decoys: ["M", "S"], spoken: "Nest. What letter starts nest?" },
  { word: "porch", emoji: "🏡", letter: "P", decoys: ["B", "T"], spoken: "Porch. What letter starts porch?" },
  { word: "quilt", emoji: "🧵", letter: "Q", decoys: ["K", "G"], spoken: "Quilt. What letter starts quilt?" },
  { word: "rain", emoji: "🌧️", letter: "R", decoys: ["W", "L"], spoken: "Rain. What letter starts rain?" },
  { word: "stoop", emoji: "🪜", letter: "S", decoys: ["T", "C"], spoken: "Stoop. What letter starts stoop?" },
  { word: "taxi", emoji: "🚕", letter: "T", decoys: ["D", "X"], spoken: "Taxi. What letter starts taxi?" },
  { word: "wash", emoji: "👕", letter: "W", decoys: ["R", "V"], spoken: "Wash. What letter starts wash?" },
];

export interface BlendWord {
  word: string;
  emoji: string;
  letters: [string, string, string];
  spoken: string;
}

export interface SightWordRound {
  word: string;
  sentence: string;
  emoji: string;
  spoken: string;
}

/** High-frequency words in stoop sentences — Duolingo ABC sight-word beat, our street. */
export const SIGHT_WORDS: SightWordRound[] = [
  { word: "the", sentence: "The cat sat on the mat.", emoji: "🐱", spoken: "Find the word the." },
  { word: "a", sentence: "Nana cut a slice.", emoji: "🍉", spoken: "Find the word a." },
  { word: "I", sentence: "I hop on the bus.", emoji: "🚌", spoken: "Find the word I." },
  { word: "to", sentence: "We go to the stoop.", emoji: "🏡", spoken: "Find the word to." },
  { word: "you", sentence: "Nana sees you.", emoji: "🧶", spoken: "Find the word you." },
  { word: "is", sentence: "The pot is hot.", emoji: "🍲", spoken: "Find the word is." },
  { word: "it", sentence: "Pat it on the mat.", emoji: "🟫", spoken: "Find the word it." },
  { word: "we", sentence: "We sip and nap.", emoji: "🥤", spoken: "Find the word we." },
  { word: "my", sentence: "My hat is on the peg.", emoji: "🎩", spoken: "Find the word my." },
  { word: "on", sentence: "The cat is on the mat.", emoji: "🐱", spoken: "Find the word on." },
  { word: "and", sentence: "Nana and Teddy sit.", emoji: "🧸", spoken: "Find the word and." },
  { word: "look", sentence: "Look at the red bus.", emoji: "🚌", spoken: "Find the word look." },
  { word: "see", sentence: "I see the ferry.", emoji: "⛴️", spoken: "Find the word see." },
  { word: "like", sentence: "I like the warm bun.", emoji: "🥯", spoken: "Find the word like." },
  { word: "here", sentence: "Come here to the stoop.", emoji: "🪜", spoken: "Find the word here." },
  { word: "come", sentence: "Come to the door.", emoji: "🚪", spoken: "Find the word come." },
];

export const BLEND_WORDS: BlendWord[] = [
  { word: "cat", emoji: "🐱", letters: ["C", "A", "T"], spoken: "C. A. T. Cat." },
  { word: "hat", emoji: "🎩", letters: ["H", "A", "T"], spoken: "H. A. T. Hat." },
  { word: "mat", emoji: "🟫", letters: ["M", "A", "T"], spoken: "M. A. T. Mat." },
  { word: "bus", emoji: "🚌", letters: ["B", "U", "S"], spoken: "B. U. S. Bus." },
  { word: "sun", emoji: "☀️", letters: ["S", "U", "N"], spoken: "S. U. N. Sun." },
  { word: "bun", emoji: "🥯", letters: ["B", "U", "N"], spoken: "B. U. N. Bun." },
  { word: "pan", emoji: "🍳", letters: ["P", "A", "N"], spoken: "P. A. N. Pan." },
  { word: "pot", emoji: "🍲", letters: ["P", "O", "T"], spoken: "P. O. T. Pot." },
  { word: "dog", emoji: "🐕", letters: ["D", "O", "G"], spoken: "D. O. G. Dog." },
  { word: "pig", emoji: "🐷", letters: ["P", "I", "G"], spoken: "P. I. G. Pig." },
  { word: "hop", emoji: "🐰", letters: ["H", "O", "P"], spoken: "H. O. P. Hop." },
  { word: "red", emoji: "🔴", letters: ["R", "E", "D"], spoken: "R. E. D. Red." },
];
