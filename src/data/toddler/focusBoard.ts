/** Focus tab — move, heavy work, breathe, then settle. Built for busy bodies, not a 3-beat demo. */

export type BodyKind = "zoomies" | "wiggles" | "loud" | "floppy" | "ready";

export interface BodyCheck {
  id: BodyKind;
  emoji: string;
  label: string;
  spoken: string;
  suggest: "move" | "push" | "quiet" | "breathe" | "slow";
}

export const BODY_CHECKS: BodyCheck[] = [
  {
    id: "zoomies",
    emoji: "⚡",
    label: "Zoomies",
    spoken: "Lots of go. Let's push and squeeze, then we can sit.",
    suggest: "push",
  },
  {
    id: "wiggles",
    emoji: "🐛",
    label: "Wiggles",
    spoken: "Wiggly hands. Slow finger on the gold path. If you hit the red edge it buzzes.",
    suggest: "slow",
  },
  {
    id: "loud",
    emoji: "🔊",
    label: "Too much",
    spoken: "The room feels big and loud. Quiet corner with Teddy.",
    suggest: "quiet",
  },
  {
    id: "floppy",
    emoji: "😴",
    label: "Floppy",
    spoken: "The body feels slow. A few big moves can wake it up.",
    suggest: "move",
  },
  {
    id: "ready",
    emoji: "🙂",
    label: "Just right",
    spoken: "Just right. Three slow breaths, then we can learn.",
    suggest: "breathe",
  },
];

export interface MoveRound {
  id: string;
  emoji: string;
  title: string;
  spoken: string;
  seconds: number;
  taps: number;
  kind: "cardio" | "stretch";
}

export const MOVE_ROUNDS: MoveRound[] = [
  { id: "mv-stomp", emoji: "🦶", title: "Stomp 8", spoken: "Stomp eight times. Tap each stomp.", seconds: 20, taps: 8, kind: "cardio" },
  { id: "mv-jump", emoji: "🦘", title: "Jump 6", spoken: "Six small jumps. Tap each jump.", seconds: 18, taps: 6, kind: "cardio" },
  { id: "mv-march", emoji: "🚶", title: "March 10", spoken: "March ten steps. Tap each step.", seconds: 22, taps: 10, kind: "cardio" },
  { id: "mv-clap", emoji: "👏", title: "Clap 8", spoken: "Eight claps. Tap each clap.", seconds: 20, taps: 8, kind: "cardio" },
  { id: "mv-shake", emoji: "🫧", title: "Shake 6", spoken: "Shake six times. Tap each shake.", seconds: 16, taps: 6, kind: "cardio" },
  { id: "mv-hop", emoji: "🐰", title: "Hop 5", spoken: "Five hops. Tap each hop.", seconds: 16, taps: 5, kind: "cardio" },
  { id: "mv-wiggle", emoji: "🐟", title: "Wiggle 8", spoken: "Wiggle eight times. Then still.", seconds: 16, taps: 8, kind: "cardio" },
  { id: "mv-star", emoji: "⭐", title: "Star 4", spoken: "Arms out like a star. Four slow holds. Tap each.", seconds: 18, taps: 4, kind: "stretch" },
  { id: "mv-reach", emoji: "🌅", title: "Reach 6", spoken: "Reach up, down. Six times. Tap each.", seconds: 20, taps: 6, kind: "stretch" },
  { id: "mv-roll", emoji: "🔄", title: "Roll 6", spoken: "Shoulder rolls. Six. Tap each.", seconds: 18, taps: 6, kind: "stretch" },
  { id: "mv-twist", emoji: "🥨", title: "Twist 6", spoken: "Twist left and right. Six. Tap each.", seconds: 18, taps: 6, kind: "stretch" },
  { id: "mv-toe", emoji: "🧦", title: "Toe taps 8", spoken: "Tap toes eight times. Soft.", seconds: 16, taps: 8, kind: "stretch" },
];

export interface HeavyRound {
  id: string;
  emoji: string;
  title: string;
  spoken: string;
  seconds: number;
  hold: number;
}

export const HEAVY_ROUNDS: HeavyRound[] = [
  { id: "hv-wall", emoji: "🧱", title: "Wall push", spoken: "Hands on the wall. Hold this button while you push.", seconds: 20, hold: 8 },
  { id: "hv-squeeze", emoji: "🧸", title: "Squeeze Teddy", spoken: "Hug Teddy. Hold this while you squeeze.", seconds: 16, hold: 6 },
  { id: "hv-palms", emoji: "🤲", title: "Palm press", spoken: "Press palms. Hold this.", seconds: 16, hold: 6 },
  { id: "hv-carry", emoji: "🧺", title: "Carry Teddy", spoken: "Carry Teddy. Hold this the whole way.", seconds: 22, hold: 8 },
  { id: "hv-chair", emoji: "🪑", title: "Seat push", spoken: "Push the seat. Hold this.", seconds: 18, hold: 7 },
  { id: "hv-stomp", emoji: "🐘", title: "Heavy stomp", spoken: "Slow heavy stomps. Hold this.", seconds: 20, hold: 7 },
  { id: "hv-pull", emoji: "🪢", title: "Pretend pull", spoken: "Pull a heavy rope. Hold this.", seconds: 18, hold: 7 },
  { id: "hv-curl", emoji: "💪", title: "Curl in", spoken: "Curl in. Hold this. Then open.", seconds: 18, hold: 6 },
  { id: "hv-floor", emoji: "🪵", title: "Floor press", spoken: "Hands on the floor. Hold this.", seconds: 18, hold: 7 },
  { id: "hv-book", emoji: "📚", title: "Heavy book", spoken: "Hold a heavy book with two hands. Hold this too.", seconds: 16, hold: 6 },
];

export interface BreathRound {
  id: string;
  emoji: string;
  title: string;
  spoken: string;
  inCount: number;
  outCount: number;
}

export const BREATH_ROUNDS: BreathRound[] = [
  { id: "br-flower", emoji: "🌸", title: "Flower and candle", spoken: "Smell the flower. Blow the candle. Again.", inCount: 3, outCount: 3 },
  { id: "br-teddy", emoji: "🧸", title: "Teddy belly", spoken: "Teddy on your belly. Up. Down. Three times.", inCount: 3, outCount: 3 },
  { id: "br-rainbow", emoji: "🌈", title: "Rainbow arms", spoken: "Arms make a rainbow. Breathe in up. Out down.", inCount: 4, outCount: 4 },
  { id: "br-snake", emoji: "🐍", title: "Snake breath", spoken: "In through the nose. Out sss like a snake.", inCount: 3, outCount: 4 },
  { id: "br-cocoa", emoji: "☕", title: "Warm cup", spoken: "Smell the warm cup. Blow to cool it.", inCount: 3, outCount: 3 },
  { id: "br-star", emoji: "⭐", title: "Five fingers", spoken: "Trace one star hand. In up a finger. Out down.", inCount: 5, outCount: 5 },
  { id: "br-cloud", emoji: "☁️", title: "Cloud breath", spoken: "Breathe in a cloud. Blow it far away.", inCount: 3, outCount: 4 },
  { id: "br-bubble", emoji: "🫧", title: "Quiet bubbles", spoken: "Blow five quiet pretend bubbles. Slow.", inCount: 2, outCount: 4 },
];

export interface LookRound {
  id: string;
  emoji: string;
  title: string;
  spoken: string;
  prompt: string;
  need: number;
  field: { emoji: string; hit: boolean }[];
}

export const LOOK_ROUNDS: LookRound[] = [
  {
    id: "lk-yellow",
    emoji: "💛",
    title: "Find yellow",
    spoken: "Tap every yellow thing.",
    prompt: "yellow",
    need: 3,
    field: [
      { emoji: "⭐", hit: true },
      { emoji: "🧸", hit: false },
      { emoji: "🍋", hit: true },
      { emoji: "🪟", hit: false },
      { emoji: "🍌", hit: true },
      { emoji: "🧦", hit: false },
      { emoji: "🧱", hit: false },
      { emoji: "🌸", hit: false },
      { emoji: "📘", hit: false },
    ],
  },
  {
    id: "lk-round",
    emoji: "🟠",
    title: "Something round",
    spoken: "Tap the round things.",
    prompt: "round",
    need: 3,
    field: [
      { emoji: "🟠", hit: true },
      { emoji: "⬛", hit: false },
      { emoji: "⚽", hit: true },
      { emoji: "🪵", hit: false },
      { emoji: "🍪", hit: true },
      { emoji: "🔺", hit: false },
      { emoji: "🧸", hit: false },
      { emoji: "🪟", hit: false },
      { emoji: "📚", hit: false },
    ],
  },
  {
    id: "lk-soft",
    emoji: "🧸",
    title: "Something soft",
    spoken: "Tap the soft things.",
    prompt: "soft",
    need: 3,
    field: [
      { emoji: "🧸", hit: true },
      { emoji: "🧱", hit: false },
      { emoji: "🧦", hit: true },
      { emoji: "🔑", hit: false },
      { emoji: "☁️", hit: true },
      { emoji: "🪨", hit: false },
      { emoji: "🪑", hit: false },
      { emoji: "🍋", hit: false },
      { emoji: "📘", hit: false },
    ],
  },
  {
    id: "lk-green",
    emoji: "🟢",
    title: "Find green",
    spoken: "Tap every green thing.",
    prompt: "green",
    need: 3,
    field: [
      { emoji: "🐸", hit: true },
      { emoji: "🍋", hit: false },
      { emoji: "🌿", hit: true },
      { emoji: "🧸", hit: false },
      { emoji: "🍏", hit: true },
      { emoji: "🧱", hit: false },
      { emoji: "⭐", hit: false },
      { emoji: "🧦", hit: false },
      { emoji: "📘", hit: false },
    ],
  },
  {
    id: "lk-hands",
    emoji: "✋",
    title: "Find hands",
    spoken: "Tap every hand.",
    prompt: "hands",
    need: 3,
    field: [
      { emoji: "✋", hit: true },
      { emoji: "🦶", hit: false },
      { emoji: "🤚", hit: true },
      { emoji: "👀", hit: false },
      { emoji: "🖐️", hit: true },
      { emoji: "🧸", hit: false },
      { emoji: "🍋", hit: false },
      { emoji: "🧱", hit: false },
      { emoji: "⭐", hit: false },
    ],
  },
  {
    id: "lk-quiet",
    emoji: "🤫",
    title: "Quiet things",
    spoken: "Tap the quiet things.",
    prompt: "quiet",
    need: 3,
    field: [
      { emoji: "📖", hit: true },
      { emoji: "📣", hit: false },
      { emoji: "🧸", hit: true },
      { emoji: "🥁", hit: false },
      { emoji: "🌙", hit: true },
      { emoji: "🔔", hit: false },
      { emoji: "🚗", hit: false },
      { emoji: "🍋", hit: false },
      { emoji: "🧱", hit: false },
    ],
  },
  {
    id: "lk-sky",
    emoji: "🌤️",
    title: "Up in the sky",
    spoken: "Tap things that belong in the sky.",
    prompt: "sky",
    need: 3,
    field: [
      { emoji: "☁️", hit: true },
      { emoji: "🧦", hit: false },
      { emoji: "🌙", hit: true },
      { emoji: "🪑", hit: false },
      { emoji: "⭐", hit: true },
      { emoji: "🍞", hit: false },
      { emoji: "🧸", hit: false },
      { emoji: "🧱", hit: false },
      { emoji: "🍋", hit: false },
    ],
  },
  {
    id: "lk-square",
    emoji: "⬛",
    title: "Find squares",
    spoken: "Tap the squares.",
    prompt: "square",
    need: 3,
    field: [
      { emoji: "⬛", hit: true },
      { emoji: "🟠", hit: false },
      { emoji: "🟦", hit: true },
      { emoji: "🔺", hit: false },
      { emoji: "🟥", hit: true },
      { emoji: "⭐", hit: false },
      { emoji: "🧸", hit: false },
      { emoji: "🌙", hit: false },
      { emoji: "🍋", hit: false },
    ],
  },
];

export interface FreezeRound {
  id: string;
  emoji: string;
  title: string;
  spoken: string;
  wiggle: number;
}

export const FREEZE_ROUNDS: FreezeRound[] = [
  { id: "fr-wiggle", emoji: "🧊", title: "Wiggle freeze", spoken: "Wiggle until freeze. Do not tap early.", wiggle: 5 },
  { id: "fr-dance", emoji: "🕺", title: "Dance freeze", spoken: "Dance in place. Freeze when it says freeze.", wiggle: 6 },
  { id: "fr-hop", emoji: "🐰", title: "Hop freeze", spoken: "Tiny hops. Freeze when it says freeze.", wiggle: 5 },
  { id: "fr-shake", emoji: "🫧", title: "Shake freeze", spoken: "Shake. Then statue.", wiggle: 4 },
  { id: "fr-march", emoji: "🚶", title: "March freeze", spoken: "March. Then freeze.", wiggle: 6 },
  { id: "fr-silly", emoji: "🤪", title: "Silly freeze", spoken: "Silly face. Then still face.", wiggle: 5 },
  { id: "fr-reach", emoji: "🙆", title: "Reach freeze", spoken: "Reach up. Freeze at the top.", wiggle: 4 },
  { id: "fr-spin", emoji: "💫", title: "Slow spin freeze", spoken: "Slow turn. Freeze.", wiggle: 5 },
];

export interface QuietRound {
  id: string;
  emoji: string;
  title: string;
  spoken: string;
  seconds: number;
}

export const QUIET_ROUNDS: QuietRound[] = [
  { id: "qt-jar", emoji: "🫙", title: "Shake and watch", spoken: "Pretend shake a jar. Watch it settle. Stay until the bar is done.", seconds: 30 },
  { id: "qt-hug", emoji: "🧸", title: "Teddy hug", spoken: "Hug Teddy. Quiet mouth. Stay until the bar is done.", seconds: 35 },
  { id: "qt-blanket", emoji: "🧺", title: "Cozy wrap", spoken: "Wrap up. Soft shoulders. Stay until the bar is done.", seconds: 40 },
  { id: "qt-window", emoji: "🌤️", title: "Window sit", spoken: "Sit. Look at one still thing. Stay until the bar is done.", seconds: 30 },
  { id: "qt-hands", emoji: "🤲", title: "Quiet hands", spoken: "Hands in your lap. Soft. Stay until the bar is done.", seconds: 28 },
  { id: "qt-breath", emoji: "🌸", title: "Two flowers", spoken: "Two flower breaths. Then still. Stay until the bar is done.", seconds: 32 },
  { id: "qt-toes", emoji: "🧦", title: "Heavy toes", spoken: "Press toes into the floor. Quiet. Stay until the bar is done.", seconds: 30 },
  { id: "qt-ready", emoji: "🚪", title: "Ready door", spoken: "When the bar ends, we can go learn. Stay until then.", seconds: 25 },
];
