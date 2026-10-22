/**
 * Shared local-file audio manager.
 *
 * UI taps/chimes stay on the existing Web Audio synth. This module only plays
 * registered MP3s (narrator clip, animal calls) and coordinates mute, parent
 * recordings, overlap, and missing-file fallback. No network TTS.
 */

import { soundEffects } from "./soundEffects";
import {
  animalClipForFriendId,
  AUDIO_MASTER_GAIN,
  getAudioAsset,
  narrationClipForText,
  type AudioAsset,
} from "../data/toddler/audioRegistry";

const VOICE_MUTE_KEY = "app_voice_muted";
const MAX_SFX = 3;

export interface AudioLike {
  src: string;
  volume: number;
  play: () => Promise<void>;
  pause: () => void;
  onended: ((this: AudioLike, ev?: Event) => void) | null;
  onerror: ((this: AudioLike, ev?: Event) => void) | null;
}

export type AudioFactory = (src: string) => AudioLike;

export interface ClipPlayOptions {
  onStart?: () => void;
  onEnd?: () => void;
  onFail?: () => void;
}

function isVoiceMutedStored(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(VOICE_MUTE_KEY) === "true";
  } catch {
    return false;
  }
}

function defaultFactory(src: string): AudioLike | null {
  if (typeof window === "undefined" || typeof Audio === "undefined") return null;
  try {
    return new Audio(src) as unknown as AudioLike;
  } catch {
    return null;
  }
}

class ToddlerAudioManager {
  private audioFactory: AudioFactory | null = null;
  private parentPlaying = false;
  private voice: AudioLike | null = null;
  private voiceGeneration = 0;
  private sfx: AudioLike[] = [];
  private lastVoiceId: string | null = null;

  setAudioFactoryForTests(factory: AudioFactory | null) {
    this.audioFactory = factory;
  }

  resetForTests() {
    this.stopVoice();
    this.stopSfx();
    this.parentPlaying = false;
    this.audioFactory = null;
    this.lastVoiceId = null;
    this.voiceGeneration = 0;
  }

  isParentPlaying() {
    return this.parentPlaying;
  }

  /** Parent blob playback (IndexedDB) outranks narrator clips and Web Speech. */
  beginParentPlayback() {
    this.parentPlaying = true;
    this.stopVoice();
  }

  endParentPlayback() {
    this.parentPlaying = false;
  }

  stopVoice() {
    this.voiceGeneration += 1;
    if (this.voice) {
      try {
        this.voice.onended = null;
        this.voice.onerror = null;
        this.voice.pause();
      } catch {
        // ignore
      }
    }
    this.voice = null;
    this.lastVoiceId = null;
  }

  stopSfx() {
    this.sfx.forEach((node) => {
      try {
        node.onended = null;
        node.onerror = null;
        node.pause();
      } catch {
        // ignore
      }
    });
    this.sfx = [];
  }

  stopAll() {
    this.stopVoice();
    this.stopSfx();
  }

  getLastVoiceIdForTests() {
    return this.lastVoiceId;
  }

  playAsset(id: string, options?: ClipPlayOptions): boolean {
    const asset = getAudioAsset(id);
    if (!asset) return false;
    if (asset.channel === "voice") return this.playVoiceAsset(asset, options);
    return this.playSfxAsset(asset, options);
  }

  /**
   * Try the registered narrator MP3 for this exact spoken line.
   * Returns true if a clip attempt started (success or async fail via onFail).
   * Returns false if there is no clip — caller should use Web Speech.
   */
  tryNarrationClip(text: string, options?: ClipPlayOptions): boolean {
    const asset = narrationClipForText(text);
    if (!asset) return false;
    return this.playVoiceAsset(asset, options);
  }

  playSafariAnimalSfx(animalId: string): boolean {
    const asset = animalClipForFriendId(animalId);
    if (!asset) return soundEffects.playAnimalCall(animalId);
    if (soundEffects.isMuted()) return false;
    const started = this.playSfxAsset(asset, {
      onFail: () => {
        soundEffects.playAnimalCall(animalId);
      },
    });
    if (started) return true;
    return soundEffects.playAnimalCall(animalId);
  }

  /**
   * Safari island: play a registered narrator clip only.
   * Never fall through to Web Speech — missing files stay quiet.
   */
  playSafariVoiceLine(text: string, options?: ClipPlayOptions): boolean {
    return this.tryNarrationClip(text, options);
  }

  private playVoiceAsset(asset: AudioAsset, options?: ClipPlayOptions): boolean {
    if (this.parentPlaying) return false;
    if (isVoiceMutedStored()) return false;

    this.stopVoice();
    const generation = this.voiceGeneration;
    const node = this.createNode(asset);
    if (!node) return false;

    this.voice = node;
    this.lastVoiceId = asset.id;

    const fail = () => {
      if (generation !== this.voiceGeneration) return;
      if (this.voice === node) this.voice = null;
      this.lastVoiceId = null;
      options?.onFail?.();
    };

    const end = () => {
      if (generation !== this.voiceGeneration) return;
      if (this.voice === node) this.voice = null;
      this.lastVoiceId = null;
      options?.onEnd?.();
    };

    node.onended = end;
    node.onerror = fail;

    try {
      const played = node.play();
      if (played && typeof played.then === "function") {
        played
          .then(() => {
            if (generation !== this.voiceGeneration) return;
            options?.onStart?.();
          })
          .catch(() => fail());
      } else {
        options?.onStart?.();
      }
    } catch {
      fail();
      return false;
    }
    return true;
  }

  private playSfxAsset(asset: AudioAsset, options?: ClipPlayOptions): boolean {
    if (soundEffects.isMuted()) return false;

    soundEffects.unlock();
    const node = this.createNode(asset);
    if (!node) return false;

    while (this.sfx.length >= MAX_SFX) {
      const oldest = this.sfx.shift();
      if (oldest) {
        try {
          oldest.onended = null;
          oldest.onerror = null;
          oldest.pause();
        } catch {
          // ignore
        }
      }
    }

    this.sfx.push(node);
    const drop = () => {
      this.sfx = this.sfx.filter((item) => item !== node);
    };

    node.onended = () => {
      drop();
      options?.onEnd?.();
    };
    node.onerror = () => {
      drop();
      options?.onFail?.();
    };

    try {
      const played = node.play();
      if (played && typeof played.then === "function") {
        played
          .then(() => options?.onStart?.())
          .catch(() => {
            drop();
            options?.onFail?.();
          });
      } else {
        options?.onStart?.();
      }
    } catch {
      drop();
      options?.onFail?.();
      return false;
    }
    return true;
  }

  private createNode(asset: AudioAsset): AudioLike | null {
    const factory = this.audioFactory ?? ((src: string) => defaultFactory(src) as AudioLike);
    try {
      const node = factory(asset.src);
      if (!node) return null;
      node.volume = Math.max(0, Math.min(1, asset.volume * AUDIO_MASTER_GAIN));
      return node;
    } catch {
      return null;
    }
  }
}

export const toddlerAudio = new ToddlerAudioManager();

export function playSafariAnimalSfx(animalId: string): boolean {
  return toddlerAudio.playSafariAnimalSfx(animalId);
}

export function playSafariVoiceLine(text: string): boolean {
  return toddlerAudio.playSafariVoiceLine(text);
}

export function setAudioFactoryForTests(factory: AudioFactory | null) {
  toddlerAudio.setAudioFactoryForTests(factory);
}

export function resetToddlerAudioForTests() {
  toddlerAudio.resetForTests();
}
