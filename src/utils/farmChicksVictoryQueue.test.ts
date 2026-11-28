// @vitest-environment jsdom
/**
 * Farm Valley counting PoC: Farm Chicks correct-answer victory chain.
 * Runtime resolution (lookups → registry → playback order), not MP3 existence alone.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { narrationClipForText } from "../data/toddler/audioRegistry";
import { farmChicksVictoryLines } from "../data/toddler/toddlerReplayEngine";
import { narrationClipLookups } from "./speechUtils";
import { type AudioLike } from "./toddlerAudio";

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

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function clipSrc(text: string): string {
  for (const lookup of narrationClipLookups(text)) {
    const asset = narrationClipForText(lookup);
    if (asset) return asset.src;
  }
  throw new Error(`no clip for ${text}`);
}

async function loadQueue() {
  vi.resetModules();
  const audio = await import("./toddlerAudio");
  const created: FakeClip[] = [];
  const played: string[] = [];
  audio.resetToddlerAudioForTests();
  audio.setAudioFactoryForTests((src) => {
    const node = new FakeClip(src);
    created.push(node);
    const originalPlay = node.play.bind(node);
    node.play = () => {
      played.push(src);
      return originalPlay();
    };
    return node;
  });
  const speech = await import("./speechUtils");
  const endLatest = () => {
    created[created.length - 1]?.onended?.(new Event("ended"));
  };
  return { audio, speech, created, played, endLatest };
}

beforeEach(() => {
  localStorage.clear();
});

afterEach(() => {
  vi.restoreAllMocks();
  localStorage.clear();
});

describe("Farm Chicks victory clip resolution", () => {
  it("registers the three new beats and reuses tap number clips 1!–5!", () => {
    expect(clipSrc("Hooray! That's right!")).toBe("/audio/voice/count-farm-chicks-hooray.mp3");
    expect(clipSrc("Farm Chicks!")).toBe("/audio/voice/count-farm-chicks-item.mp3");
    expect(clipSrc("Cheep!")).toBe("/audio/voice/count-farm-chicks-cheep.mp3");
    for (const n of [1, 2, 3, 4, 5]) {
      expect(clipSrc(`${n}!`)).toBe(`/audio/voice/count-cheer-${n}.mp3`);
    }
  });

  it("does not change authored chick prompt lookup", () => {
    const prompt = "Look at the cozy hay! Count the fluffy yellow chicks: one, two, three!";
    expect(narrationClipForText(prompt)?.promptText).toBe(prompt);
  });
});

describe("Farm Chicks speakQueuedNarration", () => {
  it.each([1, 2, 3, 4, 5])("plays four beats in order for count %i", async (count) => {
    const { speech, played, endLatest } = await loadQueue();
    const lines = farmChicksVictoryLines(count)!;
    let ended = 0;
    const started = speech.speakQueuedNarration(lines, {
      closedKit: true,
      requireClips: true,
      gapMs: 15,
      onEnd: () => {
        ended += 1;
      },
    });
    expect(started).toBe(true);
    expect(played).toEqual(["/audio/voice/count-farm-chicks-hooray.mp3"]);

    endLatest();
    await wait(25);
    expect(played).toEqual([
      "/audio/voice/count-farm-chicks-hooray.mp3",
      `/audio/voice/count-cheer-${count}.mp3`,
    ]);

    endLatest();
    await wait(25);
    expect(played.at(-1)).toBe("/audio/voice/count-farm-chicks-item.mp3");

    endLatest();
    await wait(25);
    expect(played.at(-1)).toBe("/audio/voice/count-farm-chicks-cheep.mp3");
    expect(ended).toBe(0);

    endLatest();
    expect(ended).toBe(1);
    expect(played).toEqual([
      "/audio/voice/count-farm-chicks-hooray.mp3",
      `/audio/voice/count-cheer-${count}.mp3`,
      "/audio/voice/count-farm-chicks-item.mp3",
      "/audio/voice/count-farm-chicks-cheep.mp3",
    ]);
  });

  it("does not overlap clips and fires onEnd only after the final beat", async () => {
    const { speech, played, endLatest } = await loadQueue();
    let ended = 0;
    speech.speakQueuedNarration(farmChicksVictoryLines(3)!, {
      closedKit: true,
      requireClips: true,
      gapMs: 15,
      onEnd: () => {
        ended += 1;
      },
    });
    expect(played).toHaveLength(1);
    endLatest();
    expect(played).toHaveLength(1);
    expect(ended).toBe(0);
    await wait(25);
    expect(played).toHaveLength(2);
    endLatest();
    await wait(25);
    endLatest();
    await wait(25);
    expect(ended).toBe(0);
    endLatest();
    expect(ended).toBe(1);
    endLatest();
    expect(ended).toBe(1);
  });

  it("restarts the full sequence on a second speakQueued call", async () => {
    const { speech, played, endLatest } = await loadQueue();
    const playAll = async () => {
      speech.speakQueuedNarration(farmChicksVictoryLines(2)!, {
        closedKit: true,
        requireClips: true,
        gapMs: 10,
      });
      for (let i = 0; i < 4; i++) {
        endLatest();
        await wait(15);
      }
    };
    await playAll();
    const first = [...played];
    expect(first).toEqual([
      "/audio/voice/count-farm-chicks-hooray.mp3",
      "/audio/voice/count-cheer-2.mp3",
      "/audio/voice/count-farm-chicks-item.mp3",
      "/audio/voice/count-farm-chicks-cheep.mp3",
    ]);
    await playAll();
    expect(played).toEqual([...first, ...first]);
  });

  it("cancels remaining segments on stopSpeaking and ignores a late onEnd", async () => {
    const { speech, played, created } = await loadQueue();
    let ended = 0;
    speech.speakQueuedNarration(farmChicksVictoryLines(4)!, {
      closedKit: true,
      requireClips: true,
      gapMs: 15,
      onEnd: () => {
        ended += 1;
      },
    });
    const first = created[0];
    speech.stopSpeaking();
    first?.onended?.(new Event("ended"));
    await wait(40);
    expect(played).toEqual(["/audio/voice/count-farm-chicks-hooray.mp3"]);
    expect(ended).toBe(0);
  });

  it("blocks the queue while a parent recording is playing", async () => {
    const { speech, audio, played } = await loadQueue();
    audio.toddlerAudio.beginParentPlayback();
    let ended = 0;
    const started = speech.speakQueuedNarration(farmChicksVictoryLines(1)!, {
      closedKit: true,
      requireClips: true,
      onEnd: () => {
        ended += 1;
      },
    });
    expect(started).toBe(false);
    expect(played).toEqual([]);
    expect(ended).toBe(0);
    audio.toddlerAudio.endParentPlayback();
  });

  it("does not start later beats if parent playback begins mid-sequence", async () => {
    const { speech, audio, played, endLatest } = await loadQueue();
    let ended = 0;
    speech.speakQueuedNarration(farmChicksVictoryLines(5)!, {
      closedKit: true,
      requireClips: true,
      gapMs: 15,
      onEnd: () => {
        ended += 1;
      },
    });
    expect(played).toHaveLength(1);
    audio.toddlerAudio.beginParentPlayback();
    endLatest();
    await wait(40);
    expect(played).toHaveLength(1);
    expect(ended).toBe(0);
    audio.toddlerAudio.endParentPlayback();
  });

  it("does not play a partial sentence when a required clip is missing", async () => {
    const { speech, played } = await loadQueue();
    let ended = 0;
    const started = speech.speakQueuedNarration(
      ["Hooray! That's right!", "3!", "Missing Farm Goats!", "Cheep!"],
      {
        closedKit: true,
        requireClips: true,
        onEnd: () => {
          ended += 1;
        },
      },
    );
    expect(started).toBe(false);
    expect(played).toEqual([]);
    expect(ended).toBe(0);
  });

  it("does not fall through to Web Speech on a closed-kit missing segment", async () => {
    const { speech } = await loadQueue();
    const engineLog: string[] = [];
    const synth = {
      speaking: false,
      paused: false,
      pending: false,
      getVoices: () => [],
      speak: (utterance: { text: string }) => {
        engineLog.push(utterance.text);
      },
      cancel: () => {},
      resume: () => {},
      pause: () => {},
    };
    Object.defineProperty(window, "speechSynthesis", { value: synth, configurable: true });
    speech.speakQueuedNarration(["Hooray! That's right!", "no-such-farm-clip"], {
      closedKit: true,
      requireClips: true,
    });
    await wait(30);
    expect(engineLog).toEqual([]);
  });
});
