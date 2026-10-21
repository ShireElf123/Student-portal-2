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
