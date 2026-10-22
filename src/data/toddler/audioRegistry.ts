/**
 * Local audio asset registry for the toddler app.
 *
 * Missing files fail closed and fall back to Web Audio / Web Speech.
 * Do not call ElevenLabs (or any TTS API) from the browser.
 */

export type AudioChannel = "sfx" | "voice";

export type AudioFileStatus = "awaiting-user-file" | "present";

export interface AudioAsset {
  id: string;
  /** Site-root path. Must match the filename the owner will provide. */
  src: string;
  channel: AudioChannel;
  /** 0–1, applied after the child-safe master gain. */
  volume: number;
  title: string;
  /** Exact spoken line this clip may replace. Voice clips only. */
  promptText?: string;
  /** Safari friend id this clip belongs to. */
  animalId?: string;
  fileStatus: AudioFileStatus;
  source: string;
  licence: string;
  sourceUrl: string;
  author: string;
  notes: string;
}

/** Child-safe default for file playback. Synth peaks stay as they are. */
export const AUDIO_MASTER_GAIN = 0.65;

export const SAFARI_EXPLORE_WELCOME_PROMPT =
  "Tap any animal friend to hear their call and fun secrets!";

export const SAFARI_DETECTIVE_STEM_PROMPT =
  "Who makes this sound? Tap the right animal!";

const VOICE_01_SOURCE =
  "Arena generate_speech (offline clip in repo; not ElevenLabs, not a runtime API)";
const VOICE_01_LICENCE =
  "App-owned generated speech. Swap this file if you later want a licensed ElevenLabs voice.";
const VOICE_01_AUTHOR = "Arena Agent Mode voice-01 (owner-selected Safari narrator)";

function voiceClip(
  id: string,
  src: string,
  title: string,
  promptText: string,
  notes: string,
): AudioAsset {
  return {
    id,
    src,
    channel: "voice",
    volume: 0.7,
    title,
    promptText,
    fileStatus: "present",
    source: VOICE_01_SOURCE,
    licence: VOICE_01_LICENCE,
    sourceUrl: "",
    author: VOICE_01_AUTHOR,
    notes,
  };
}

function animalClip(
  animalId: string,
  title: string,
  spoken: string,
  notes: string,
): AudioAsset {
  return {
    id: `sfx.animal.${animalId}`,
    src: `/audio/sfx/animal-${animalId}.mp3`,
    channel: "sfx",
    volume: 0.8,
    title,
    animalId,
    fileStatus: "present",
    source: `${VOICE_01_SOURCE} — mouth-performed call, not a field recording`,
    licence: "App-owned generated speech. Synth cartoon still used if the file is missing.",
    sourceUrl: "",
    author: VOICE_01_AUTHOR,
    notes: `Line spoken: “${spoken}” ${notes}`,
  };
}

export const AUDIO_ASSETS: AudioAsset[] = [
  voiceClip(
    "voice.narrator.safari-explore-welcome",
    "/audio/voice/narrator-safari-explore-welcome.mp3",
    "Safari explore welcome",
    SAFARI_EXPLORE_WELCOME_PROMPT,
    "Closed Safari kit: same explore welcome on every scene. Title stays on screen. Parent recordings still win.",
  ),
  voiceClip(
    "voice.narrator.safari-detective-stem",
    "/audio/voice/narrator-safari-detective-stem.mp3",
    "Safari detective stem",
    SAFARI_DETECTIVE_STEM_PROMPT,
    "Closed Safari kit: mystery prompt, then the friend mouth-sound. Does not speak the animal's name.",
  ),
  animalClip("lion", "Lion roar", "Rrrroaaar!", "Savanna friend id lion."),
  animalClip("elephant", "Elephant trumpet", "Pawoooo!", "Savanna friend id elephant."),
  animalClip("monkey", "Monkey call", "Ooh ooh aah aah!", "Savanna friend id monkey."),
  animalClip("duck", "Duck quack", "Quack quack!", "Savanna / farm / pond friend id duck."),
  animalClip("frog", "Frog ribbit", "Ribbit ribbit!", "Savanna / jungle / pond friend id frog."),
  animalClip("cow", "Cow moo", "Mooo mooo!", "Savanna / farm friend id cow."),
  animalClip("giraffe", "Giraffe hum", "Hmmm!", "Savanna friend id giraffe."),
  animalClip("zebra", "Zebra whinny", "Whinny!", "Savanna friend id zebra."),
  animalClip("pig", "Pig oink", "Oink oink!", "Farm friend id pig."),
  animalClip("horse", "Horse neigh", "Neigh neigh!", "Farm friend id horse."),
  animalClip("hen", "Hen cluck", "Cluck cluck!", "Farm friend id hen."),
  animalClip("sheep", "Sheep baa", "Baaa baaa!", "Farm friend id sheep."),
  animalClip("goat", "Goat maa", "Maaa!", "Farm friend id goat."),
  animalClip("chick", "Chick cheep", "Cheep cheep!", "Farm friend id chick."),
  animalClip("parrot", "Parrot squawk", "Squawk squawk!", "Jungle friend id parrot."),
  animalClip("tiger", "Tiger growl", "Grrr!", "Jungle friend id tiger."),
  animalClip("snake", "Snake hiss", "Hisss!", "Jungle friend id snake."),
  animalClip("gorilla", "Gorilla hoot", "Hoot hoot!", "Jungle friend id gorilla."),
  animalClip("sloth", "Sloth yawn", "Yawn!", "Jungle friend id sloth."),
  animalClip("leopard", "Leopard growl", "Grrr!", "Jungle friend id leopard."),
  animalClip("penguin", "Penguin honk", "Honk honk!", "Ice friend id penguin."),
  animalClip("seal", "Seal arf", "Arf arf!", "Ice friend id seal."),
  animalClip("bear", "Bear growl", "Groowl!", "Ice friend id bear."),
  animalClip("whale", "Whale song", "Whooom!", "Ice friend id whale."),
  animalClip("fox", "Fox yip", "Yip yip!", "Ice / night / trail friend id fox."),
  animalClip("owl", "Owl hoot", "Hoo hoo!", "Ice / night / trail friend id owl."),
  animalClip("flake", "Snowflake hush", "Shhh!", "Ice friend id flake."),
  animalClip("igloo", "Ice house clink", "Clink!", "Ice friend id igloo."),
  {
    id: "sfx.animal.bird",
    src: "/audio/sfx/animal-bird.mp3",
    channel: "sfx",
    volume: 0.8,
    title: "Bird chirp",
    animalId: "bird",
    fileStatus: "present",
    source: "Arena generate_speech — previous owner-selected voice-00 (park roster; not this Savanna batch)",
    licence: "App-owned generated speech. Synth cartoon chirp still used if the file is missing.",
    sourceUrl: "",
    author: "Arena Agent Mode voice-00 (owner-selected, earlier session)",
    notes: "Line spoken: “Chirp chirp!” Park friend id bird. Still the previous voice until the park batch.",
  },
];

const BY_ID = new Map(AUDIO_ASSETS.map((asset) => [asset.id, asset]));

export function getAudioAsset(id: string): AudioAsset | undefined {
  return BY_ID.get(id);
}

export function narrationClipForText(text: string): AudioAsset | undefined {
  const clean = (text || "").replace(/\s+/g, " ").trim();
  if (!clean) return undefined;
  return AUDIO_ASSETS.find((asset) => asset.channel === "voice" && asset.promptText === clean);
}

export function animalClipForFriendId(animalId: string): AudioAsset | undefined {
  if (!animalId) return undefined;
  return AUDIO_ASSETS.find((asset) => asset.animalId === animalId);
}

export const EXPECTED_AUDIO_FILES = AUDIO_ASSETS.map((asset) => asset.src);
