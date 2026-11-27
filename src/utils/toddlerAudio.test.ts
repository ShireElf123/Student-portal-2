// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { SAFARI_DETECTIVE_STEM_PROMPT, SAFARI_EXPLORE_WELCOME_PROMPT } from "../data/toddler/audioRegistry";
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
    expect(toddlerAudio.playSafariAnimalSfx("unicorn")).toBe(false);
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

  it("plays who-makes-this-sound before the cow call, not stacked", async () => {
    installFactory();
    expect(toddlerAudio.playSafariDetectiveMystery("cow")).toBe(true);
    await Promise.resolve();
    expect(created).toHaveLength(1);
    expect(created[0].src).toContain("narrator-safari-detective-stem");
    created[0].onended?.call(created[0]);
    await Promise.resolve();
    expect(created).toHaveLength(2);
    expect(created[1].src).toContain("animal-cow");
    expect(created[0].pauseCalls).toBeGreaterThanOrEqual(0);
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

describe("toddlerAudio ColorLab mix-again and bus beep", () => {
  const mixOrangePurple = "That made Orange. We need Purple. Mix again!";
  const busBeep = "Beep beep!";

  it("plays ColorLab wrong-mix and bus beep clips, including repeats", async () => {
    installFactory();
    expect(toddlerAudio.tryNarrationClip(mixOrangePurple)).toBe(true);
    await Promise.resolve();
    expect(created[0].src).toContain("color-need-orange-purple.mp3");
    expect(created[0].playCalls).toBe(1);

    expect(toddlerAudio.tryNarrationClip(mixOrangePurple)).toBe(true);
    expect(created[0].pauseCalls).toBeGreaterThanOrEqual(1);
    expect(created[1].src).toContain("color-need-orange-purple.mp3");
    expect(created[1].playCalls).toBe(1);

    expect(toddlerAudio.tryNarrationClip(busBeep)).toBe(true);
    expect(created[2].src).toContain("open-play-beep.mp3");
    expect(toddlerAudio.tryNarrationClip(busBeep)).toBe(true);
    expect(created[2].pauseCalls).toBeGreaterThanOrEqual(1);
    expect(created[3].src).toContain("open-play-beep.mp3");
    expect(created[3].playCalls).toBe(1);
    expect(toddlerAudio.getLastVoiceIdForTests()).toBe("voice.open.beep");
  });

  it("does not play ColorLab or bus clips while a parent recording is playing", () => {
    installFactory();
    toddlerAudio.beginParentPlayback();
    expect(toddlerAudio.tryNarrationClip(mixOrangePurple)).toBe(false);
    expect(toddlerAudio.tryNarrationClip(busBeep)).toBe(false);
    expect(created).toHaveLength(0);
  });

  it("plays Cream/Sky mix-again, mix-until, and book-finish clips, including repeats", async () => {
    installFactory();
    const cream = "That made Cream. We need Orange. Mix again!";
    const until = "Mix two colours until you make Purple!";
    const book =
      "Hooray! You finished reading Animal Phonics Safari! You earned three golden stars!";
    expect(toddlerAudio.tryNarrationClip(cream)).toBe(true);
    expect(toddlerAudio.tryNarrationClip(cream)).toBe(true);
    expect(created[0].pauseCalls).toBeGreaterThanOrEqual(1);
    expect(created[1].src).toContain("color-need-cream-orange.mp3");
    expect(toddlerAudio.tryNarrationClip(until)).toBe(true);
    expect(created[2].src).toContain("color-mix-until-purple.mp3");
    expect(toddlerAudio.tryNarrationClip(book)).toBe(true);
    expect(toddlerAudio.tryNarrationClip(book)).toBe(true);
    expect(created[3].pauseCalls).toBeGreaterThanOrEqual(1);
    expect(created[4].src).toContain("book-finish-animal-phonics-safari.mp3");
    expect(toddlerAudio.getLastVoiceIdForTests()).toBe("voice.book.finish-animal-phonics-safari");
  });

  it("plays studio book-finish clips, including repeats, and yields to parent audio", async () => {
    installFactory();
    const watermelon =
      "Hooray! You finished reading The Stoop Watermelon! You earned three golden stars!";
    const redBus = "Hooray! You finished reading The Red Bus! You earned three golden stars!";
    expect(toddlerAudio.tryNarrationClip(watermelon)).toBe(true);
    expect(toddlerAudio.tryNarrationClip(watermelon)).toBe(true);
    expect(created[0].pauseCalls).toBeGreaterThanOrEqual(1);
    expect(created[1].src).toContain("book-finish-stoop-watermelon.mp3");
    expect(toddlerAudio.tryNarrationClip(redBus)).toBe(true);
    expect(created[2].src).toContain("book-finish-the-red-bus.mp3");
    expect(toddlerAudio.getLastVoiceIdForTests()).toBe("voice.book.finish-the-red-bus");

    toddlerAudio.beginParentPlayback();
    expect(toddlerAudio.tryNarrationClip(watermelon)).toBe(false);
  });

  it("plays The Hot Pot finish clip on repeat and blocks it for parent audio", async () => {
    installFactory();
    const line = "Hooray! You finished reading The Hot Pot! You earned three golden stars!";
    expect(toddlerAudio.tryNarrationClip(line)).toBe(true);
    expect(toddlerAudio.tryNarrationClip(line)).toBe(true);
    expect(created[0].pauseCalls).toBeGreaterThanOrEqual(1);
    expect(created[1].src).toContain("book-finish-hot-pot-sip.mp3");
    toddlerAudio.beginParentPlayback();
    expect(toddlerAudio.tryNarrationClip(line)).toBe(false);
  });

  it("plays Nana’s Porch Swing finish with a real apostrophe, including repeats", async () => {
    installFactory();
    const line = "Hooray! You finished reading Nana’s Porch Swing! You earned three golden stars!";
    expect(toddlerAudio.tryNarrationClip(line)).toBe(true);
    expect(toddlerAudio.tryNarrationClip(line)).toBe(true);
    expect(created[0].pauseCalls).toBeGreaterThanOrEqual(1);
    expect(created[1].src).toContain("book-finish-nana-porch-swing.mp3");
    toddlerAudio.beginParentPlayback();
    expect(toddlerAudio.tryNarrationClip(line)).toBe(false);
  });

  it("plays The Corner Store Bell finish clip on repeat and blocks it for parent audio", async () => {
    installFactory();
    const line = "Hooray! You finished reading The Corner Store Bell! You earned three golden stars!";
    expect(toddlerAudio.tryNarrationClip(line)).toBe(true);
    expect(toddlerAudio.tryNarrationClip(line)).toBe(true);
    expect(created[0].pauseCalls).toBeGreaterThanOrEqual(1);
    expect(created[1].src).toContain("book-finish-corner-store-bell.mp3");
    toddlerAudio.beginParentPlayback();
    expect(toddlerAudio.tryNarrationClip(line)).toBe(false);
  });
});
