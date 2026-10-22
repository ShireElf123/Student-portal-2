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
  "Welcome to Savanna Animal Detective! Tap any animal friend to hear their call and fun secrets!";

export const AUDIO_ASSETS: AudioAsset[] = [
  {
    id: "voice.narrator.safari-explore-welcome",
    src: "/audio/voice/narrator-safari-explore-welcome.mp3",
    channel: "voice",
    volume: 0.7,
    title: "Safari explore welcome",
    promptText: SAFARI_EXPLORE_WELCOME_PROMPT,
    fileStatus: "present",
    source: "Arena generate_speech (offline clip in repo; not ElevenLabs, not a runtime API)",
    licence: "App-owned generated speech. Swap this file if you later want a licensed ElevenLabs voice.",
    sourceUrl: "",
    author: "Arena Agent Mode voice-00 (owner-selected)",
    notes:
      "Replaces the default Savanna explore-mode welcome only. Other scene titles keep Web Speech. Parent page recordings still win.",
  },
  {
    id: "sfx.animal.duck",
    src: "/audio/sfx/animal-duck.mp3",
    channel: "sfx",
    volume: 0.8,
    title: "Duck quack",
    animalId: "duck",
    fileStatus: "present",
    source: "Arena generate_speech — same owner-selected voice as the Safari welcome (mouth-performed quack, not a field recording)",
    licence: "App-owned generated speech. Synth cartoon quack still used if the file is missing.",
    sourceUrl: "",
    author: "Arena Agent Mode voice-00 (owner-selected)",
    notes: "Line spoken: “Quack quack!” Safari explore tap and Hear Sound Again when friend id is duck.",
  },
  {
    id: "sfx.animal.cow",
    src: "/audio/sfx/animal-cow.mp3",
    channel: "sfx",
    volume: 0.8,
    title: "Cow moo",
    animalId: "cow",
    fileStatus: "present",
    source: "Arena generate_speech — same owner-selected voice as the Safari welcome (mouth-performed moo, not a field recording)",
    licence: "App-owned generated speech. Synth cartoon moo still used if the file is missing.",
    sourceUrl: "",
    author: "Arena Agent Mode voice-00 (owner-selected)",
    notes: "Line spoken: “Mooo mooo!” Safari explore tap and Hear Sound Again when friend id is cow.",
  },
  {
    id: "sfx.animal.bird",
    src: "/audio/sfx/animal-bird.mp3",
    channel: "sfx",
    volume: 0.8,
    title: "Bird chirp",
    animalId: "bird",
    fileStatus: "present",
    source: "Arena generate_speech — same owner-selected voice as the Safari welcome (mouth-performed chirp, not a field recording)",
    licence: "App-owned generated speech. Synth cartoon chirp still used if the file is missing.",
    sourceUrl: "",
    author: "Arena Agent Mode voice-00 (owner-selected)",
    notes:
      "Line spoken: “Chirp chirp!” Safari explore tap and Hear Sound Again when friend id is bird (park roster; savanna default has duck and cow).",
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
