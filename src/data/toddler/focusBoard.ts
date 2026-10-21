/** Focus tab — move, heavy work, breathe, then settle. Built for busy bodies, not a 3-beat demo. */

export type BodyKind = "zoomies" | "wiggles" | "loud" | "floppy" | "ready";

export interface BodyCheck {
  id: BodyKind;
  emoji: string;
  label: string;
  spoken: string;
  suggest: "move" | "push" | "quiet" | "breathe";
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
    spoken: "Wiggly legs. Let's move for a short count, then settle.",
    suggest: "move",
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
  kind: "cardio" | "stretch";
}

export const MOVE_ROUNDS: MoveRound[] = [
  { id: "mv-stomp", emoji: "🦶", title: "Stomp 8", spoken: "Stomp eight times. Hard feet. Then freeze.", seconds: 20, kind: "cardio" },
  { id: "mv-jump", emoji: "🦘", title: "Jump 6", spoken: "Six small jumps. Then hands on knees.", seconds: 18, kind: "cardio" },
  { id: "mv-march", emoji: "🚶", title: "March", spoken: "March in place. Knees up. Stop when the bar is done.", seconds: 22, kind: "cardio" },
  { id: "mv-clap", emoji: "👏", title: "Clap run", spoken: "Clap and step. Fast, then slow, then stop.", seconds: 20, kind: "cardio" },
  { id: "mv-shake", emoji: "🫧", title: "Shake off", spoken: "Shake hands. Shake feet. Shake stop.", seconds: 16, kind: "cardio" },
  { id: "mv-star", emoji: "⭐", title: "Star stretch", spoken: "Arms out like a star. Hold. Soft knees.", seconds: 18, kind: "stretch" },
  { id: "mv-reach", emoji: "🌅", title: "Reach sky", spoken: "Reach up. Reach down. Slow.", seconds: 20, kind: "stretch" },
  { id: "mv-roll", emoji: "🔄", title: "Shoulder rolls", spoken: "Roll shoulders back. Two slow circles.", seconds: 18, kind: "stretch" },
  { id: "mv-twist", emoji: "🥨", title: "Gentle twist", spoken: "Twist left. Twist right. Feet stay.", seconds: 18, kind: "stretch" },
  { id: "mv-toe", emoji: "🧦", title: "Toe taps", spoken: "Tap toes. Left. Right. Soft.", seconds: 16, kind: "stretch" },
];

export interface HeavyRound {
  id: string;
  emoji: string;
  title: string;
  spoken: string;
  seconds: number;
}

export const HEAVY_ROUNDS: HeavyRound[] = [
  { id: "hv-wall", emoji: "🧱", title: "Wall push", spoken: "Hands on the wall. Push. Count to eight.", seconds: 20 },
  { id: "hv-squeeze", emoji: "🧸", title: "Squeeze Teddy", spoken: "Hug Teddy tight. Squeeze. Let go.", seconds: 16 },
  { id: "hv-palms", emoji: "🤲", title: "Palm press", spoken: "Press palms together. Hard. Soft.", seconds: 16 },
  { id: "hv-carry", emoji: "🧺", title: "Carry Teddy", spoken: "Carry Teddy across the room. Slow feet.", seconds: 22 },
  { id: "hv-chair", emoji: "🪑", title: "Seat push", spoken: "Hands on the seat. Push down. One, two, three.", seconds: 18 },
  { id: "hv-stomp", emoji: "🐘", title: "Heavy stomp", spoken: "Slow heavy stomps. Like a quiet elephant.", seconds: 20 },
  { id: "hv-pull", emoji: "🪢", title: "Pretend pull", spoken: "Pull a heavy rope. Lean back. Stop.", seconds: 18 },
  { id: "hv-curl", emoji: "💪", title: "Curl in", spoken: "Curl into a ball. Squeeze. Open like a flower.", seconds: 18 },
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
}

export const LOOK_ROUNDS: LookRound[] = [
  { id: "lk-yellow", emoji: "💛", title: "Find yellow", spoken: "Look around. Find three yellow things. Tap done.", prompt: "I found 3 yellow" },
  { id: "lk-round", emoji: "🟠", title: "Something round", spoken: "Find one round thing. Point. Tap done.", prompt: "I found round" },
  { id: "lk-soft", emoji: "🧸", title: "Something soft", spoken: "Find something soft. Touch it gently. Tap done.", prompt: "I found soft" },
  { id: "lk-window", emoji: "🪟", title: "Look far", spoken: "Look far, then near. Two looks. Tap done.", prompt: "Far and near" },
  { id: "lk-quiet", emoji: "👂", title: "One sound", spoken: "Ears open. Name one quiet sound. Tap done.", prompt: "I heard one" },
  { id: "lk-hands", emoji: "✋", title: "My hands", spoken: "Look at your hands. Wiggle. Still. Tap done.", prompt: "Hands still" },
  { id: "lk-color", emoji: "🟢", title: "One green", spoken: "Find one green thing. Point. Tap done.", prompt: "I found green" },
  { id: "lk-square", emoji: "⬛", title: "Air square", spoken: "Draw a square in the air. Slow. Tap done.", prompt: "I drew a square" },
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
