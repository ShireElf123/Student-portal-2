// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { SAFARI_EXPLORE_WELCOME_PROMPT } from "../data/toddler/audioRegistry";
import { soundEffects } from "./soundEffects";
import {
  resetToddlerAudioForTests,
  setAudioFactoryForTests,
  toddlerAudio,
  type AudioLike,
} from "./toddlerAudio";

class FakeClip implements AudioLike {
  src: string;
  volume = 1;
  playCalls = 0;
  pauseCalls = 0;
  failPlay = false;
  onended: AudioLike["onended"] = null;
  onerror: AudioLike["onerror"] = null;

  constructor(src: string, failPlay = false) {
    this.src = src;
    this.failPlay = failPlay;
  }

  play() {
    this.playCalls += 1;
    if (this.failPlay) return Promise.reject(new Error("missing-file"));
    return Promise.resolve();
  }

  pause() {
    this.pauseCalls += 1;
  }
}

const created: FakeClip[] = [];

function installFactory(failPlay = false) {
  created.length = 0;
  setAudioFactoryForTests((src) => {
    const node = new FakeClip(src, failPlay);
    created.push(node);
    return node;
  });
}

beforeEach(() => {
  localStorage.clear();
  soundEffects.setMuted(false);
  resetToddlerAudioForTests();
});

afterEach(() => {
  resetToddlerAudioForTests();
  soundEffects.setMuted(false);
  localStorage.clear();
});

describe("toddlerAudio mute", () => {
  it("does not play animal sfx when taps are muted", () => {
    installFactory();
    soundEffects.setMuted(true);
    expect(toddlerAudio.playSafariAnimalSfx("duck")).toBe(false);
    expect(created).toHaveLength(0);
  });

  it("does not play the narrator clip when voice is muted", () => {
    installFactory();
    localStorage.setItem("app_voice_muted", "true");
    expect(toddlerAudio.tryNarrationClip(SAFARI_EXPLORE_WELCOME_PROMPT)).toBe(false);
    expect(created).toHaveLength(0);
  });
});

describe("toddlerAudio missing files", () => {
  it("does not throw when the animal mp3 cannot start (synth fallback)", () => {
    setAudioFactoryForTests(() => {
      throw new Error("no element");
    });
    expect(() => toddlerAudio.playSafariAnimalSfx("duck")).not.toThrow();
    expect(toddlerAudio.tryNarrationClip(SAFARI_EXPLORE_WELCOME_PROMPT)).toBe(false);
  });

  it("reports onFail when play() rejects (missing or blocked file)", async () => {
    installFactory(true);
    let failed = false;
    const started = toddlerAudio.playAsset("sfx.animal.cow", { onFail: () => { failed = true; } });
    expect(started).toBe(true);
    await Promise.resolve();
    await Promise.resolve();
    expect(failed).toBe(true);
  });

  it("leaves unknown safari friends on the synth/speech path", () => {
    installFactory();
    expect(toddlerAudio.playSafariAnimalSfx("penguin")).toBe(false);
    expect(created).toHaveLength(0);
  });
});

describe("toddlerAudio overlapping speech and effects", () => {
  it("stops the previous narrator clip when a new voice clip starts", async () => {
    installFactory();
    expect(toddlerAudio.tryNarrationClip(SAFARI_EXPLORE_WELCOME_PROMPT)).toBe(true);
    await Promise.resolve();
    const first = created[0];
    expect(first.playCalls).toBe(1);

    expect(toddlerAudio.tryNarrationClip(SAFARI_EXPLORE_WELCOME_PROMPT)).toBe(true);
    expect(first.pauseCalls).toBeGreaterThanOrEqual(1);
    expect(created).toHaveLength(2);
    expect(created[1].playCalls).toBe(1);
  });

  it("lets a second animal sfx overlap instead of cutting the first", async () => {
    installFactory();
    expect(toddlerAudio.playSafariAnimalSfx("duck")).toBe(true);
    expect(toddlerAudio.playSafariAnimalSfx("cow")).toBe(true);
    expect(toddlerAudio.playSafariAnimalSfx("lion")).toBe(true);
    await Promise.resolve();
    expect(created).toHaveLength(3);
    expect(created[0].pauseCalls).toBe(0);
    expect(created[0].playCalls).toBe(1);
    expect(created[1].playCalls).toBe(1);
    expect(created[2].src).toContain("animal-lion");
  });

  it("does not stop animal sfx when a voice clip starts", async () => {
    installFactory();
    expect(toddlerAudio.playSafariAnimalSfx("bird")).toBe(true);
    expect(toddlerAudio.tryNarrationClip(SAFARI_EXPLORE_WELCOME_PROMPT)).toBe(true);
    await Promise.resolve();
    const sfx = created[0];
    expect(sfx.src).toContain("animal-bird");
    expect(sfx.pauseCalls).toBe(0);
  });
});

describe("toddlerAudio parent-recording priority", () => {
  it("blocks narrator clips while a parent recording is playing", async () => {
    installFactory();
    toddlerAudio.beginParentPlayback();
    expect(toddlerAudio.isParentPlaying()).toBe(true);
    expect(toddlerAudio.tryNarrationClip(SAFARI_EXPLORE_WELCOME_PROMPT)).toBe(false);
    expect(created).toHaveLength(0);

    toddlerAudio.endParentPlayback();
    expect(toddlerAudio.tryNarrationClip(SAFARI_EXPLORE_WELCOME_PROMPT)).toBe(true);
    expect(created).toHaveLength(1);
  });

  it("stops an in-flight narrator clip when parent playback begins", async () => {
    installFactory();
    expect(toddlerAudio.tryNarrationClip(SAFARI_EXPLORE_WELCOME_PROMPT)).toBe(true);
    const clip = created[0];
    toddlerAudio.beginParentPlayback();
    expect(clip.pauseCalls).toBeGreaterThanOrEqual(1);
    expect(toddlerAudio.getLastVoiceIdForTests()).toBeNull();
  });
});
