// @vitest-environment jsdom
/**
 * Speech coordinator contract tests.
 *
 * Every game that advances after spoken feedback (the "yes, that's the duck"
 * praise, celebration reveals, story steps) hangs when a callback the caller
 * waits on is silently dropped. These tests pin the delivery guarantees and
 * the watchdog that releases a stalled utterance, using a fake browser speech
 * engine with Chrome-like cancel behaviour.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

interface FakeUtterance {
  text: string;
  onstart?: () => void;
  onend?: () => void;
  onerror?: (event: { error: string }) => void;
}

interface FakeEngineOptions {
  /** Browser reports onend after this delay; `null` = the utterance stalls. */
  endAfterMs: number | null;
  /** Delay before a cancelled utterance reports its error, like real browsers. */
  cancelErrorDelayMs: number;
}

const engineLog: string[] = [];

function installFakeSpeechEngine(options: FakeEngineOptions) {
  const state: { current: FakeUtterance | null; endTimer: ReturnType<typeof setTimeout> | null } = {
    current: null,
    endTimer: null,
  };

  class FakeSpeechSynthesisUtterance implements FakeUtterance {
    text: string;
    onstart?: () => void;
    onend?: () => void;
    onerror?: (event: { error: string }) => void;
    voice: unknown;
    lang = "";
    pitch = 1;
    rate = 1;
    volume = 1;
    constructor(text: string) {
      this.text = text;
    }
  }
  (window as unknown as Record<string, unknown>).SpeechSynthesisUtterance = FakeSpeechSynthesisUtterance;

  const synth = {
    speaking: false,
    paused: false,
    pending: false,
    getVoices: () => [{ name: "Test Voice", lang: "en-US", default: true, voiceURI: "test" }],
    speak(utterance: FakeUtterance) {
      state.current = utterance;
      synth.speaking = true;
      engineLog.push(`speak:${utterance.text}`);
      setTimeout(() => utterance.onstart?.(), 0);
      if (options.endAfterMs !== null) {
        state.endTimer = setTimeout(() => {
          if (state.current === utterance) {
            state.current = null;
            synth.speaking = false;
          }
          utterance.onend?.();
        }, options.endAfterMs);
      }
    },
    cancel() {
      const active = state.current;
      if (state.endTimer) clearTimeout(state.endTimer);
      state.endTimer = null;
      state.current = null;
      synth.speaking = false;
      if (active) {
        engineLog.push(`cancel:${active.text}`);
        setTimeout(() => active.onerror?.({ error: "canceled" }), options.cancelErrorDelayMs);
      }
    },
    resume() {},
    pause() {},
  };

  Object.defineProperty(window, "speechSynthesis", { value: synth, configurable: true });
  return synth;
}

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/** Fresh coordinator per test: the singleton keeps per-instance voice state. */
async function loadCoordinator() {
  vi.resetModules();
  return import("../utils/speechUtils");
}

beforeEach(() => {
  engineLog.length = 0;
  localStorage.clear();
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("speakText callback delivery", () => {
  it("calls onEnd once the utterance finishes", async () => {
    installFakeSpeechEngine({ endAfterMs: 20, cancelErrorDelayMs: 0 });
    const { speakText } = await loadCoordinator();

    const endings: number[] = [];
    speakText("hello little explorer", { onEnd: () => endings.push(Date.now()) });
    await wait(150);

    expect(endings).toHaveLength(1);
    expect(engineLog).toContain("speak:hello little explorer");
  });

  it("still calls onEnd when the engine stalls and never reports an end", async () => {
    installFakeSpeechEngine({ endAfterMs: null, cancelErrorDelayMs: 0 });
    const { speakText } = await loadCoordinator();

    let ended = false;
    speakText("stalled utterance", { onEnd: () => (ended = true), timeoutFallbackMs: 80 });
    await wait(250);

    expect(ended).toBe(true);
  });

  it("keeps the current utterance's watchdog when a superseded line reports its cancel late", async () => {
    // Real browsers deliver the cancellation error of the previous utterance
    // asynchronously — sometimes after the next utterance has started. That
    // late event must not disarm the new utterance's watchdog, otherwise a
    // stalled utterance leaves the caller (and the game) waiting forever.
    installFakeSpeechEngine({ endAfterMs: null, cancelErrorDelayMs: 400 });
    const { speakText } = await loadCoordinator();

    speakText("first line", {});
    await wait(150); // first line is now playing
    let secondEnded = false;
    // The second line keeps its watchdog beyond the late cancel error below.
    speakText("second line callers wait on", {
      onEnd: () => (secondEnded = true),
      timeoutFallbackMs: 800,
    });

    await wait(2000);
    expect(engineLog).toContain("cancel:first line");
    expect(secondEnded).toBe(true);
  });

  it("never fires a superseded line's onEnd, so callers cannot advance on stale speech", async () => {
    installFakeSpeechEngine({ endAfterMs: 30, cancelErrorDelayMs: 0 });
    const { speakText } = await loadCoordinator();

    let supersededEnded = false;
    speakText("superseded line", { onEnd: () => (supersededEnded = true) });
    await wait(20); // still inside the coordinator's scheduling window
    speakText("the line that actually plays", {});

    await wait(200);
    expect(supersededEnded).toBe(false);
    expect(engineLog).toContain("speak:the line that actually plays");
  });

  it("resolves callers immediately while the voice is muted", async () => {
    installFakeSpeechEngine({ endAfterMs: 30, cancelErrorDelayMs: 0 });
    const { speakText, setVoiceMuted } = await loadCoordinator();

    setVoiceMuted(true);
    let ended = false;
    const spoken = speakText("muted line", { onEnd: () => (ended = true) });

    expect(spoken).toBe(false);
    expect(ended).toBe(true);
    setVoiceMuted(false);
  });
});

describe("prepareSpeechText and spokenPageText", () => {
  it("turns IPA slashes into toddler-friendly sounds", async () => {
    const { prepareSpeechText } = await loadCoordinator();
    expect(prepareSpeechText("A says /æ/. Apple.")).toBe("A says a. Apple.");
    expect(prepareSpeechText("B says /b/. Bus.")).toBe("B says buh. Bus.");
    expect(prepareSpeechText("J says /dʒ/. Jam.")).toBe("J says juh. Jam.");
    expect(prepareSpeechText("Y says /j/. Yellow.")).toBe("Y says yuh. Yellow.");
    expect(prepareSpeechText("S plus H makes /ʃ/.")).toBe("S plus H makes shh.");
    expect(prepareSpeechText("C plus H makes /tʃ/.")).toBe("C plus H makes ch.");
  });

  it("reads the printed page, not a hidden phonics overlay", async () => {
    const { spokenPageText } = await loadCoordinator();
    expect(
      spokenPageText({
        text: "Pip unfolds a map. The pine path is this way.",
        narration: "M says /m/. Map for the pine trail.",
      }),
    ).toBe("Pip unfolds a map. The pine path is this way.");
  });

  it("maps a spoken character to the current word for read-along", async () => {
    const { wordIndexFromCharIndex } = await loadCoordinator();
    expect(wordIndexFromCharIndex("A says a. Apple.", 0)).toBe(0);
    expect(wordIndexFromCharIndex("A says a. Apple.", 7)).toBe(2);
  });

  it("sends the cleaned line to the speech engine", async () => {
    installFakeSpeechEngine({ endAfterMs: 20, cancelErrorDelayMs: 0 });
    const { speakText } = await loadCoordinator();
    speakText("A says /æ/. Apple.");
    await wait(150);
    expect(engineLog).toContain("speak:A says a. Apple.");
  });

  it("looks up clips with IPA slashes intact so games do not fall back to device TTS", async () => {
    const { narrationClipLookups, prepareSpeechText } = await loadCoordinator();
    const line = "Trace the letter R. Start on the blue dot. One line. R says /r/! Rocket!";
    expect(narrationClipLookups(line)[0]).toBe(line);
    expect(prepareSpeechText(line)).toBe(
      "Trace the letter R. Start on the blue dot. One line. R says rrr! Rocket!",
    );
  });
});

describe("narrator clip and parent priority", () => {
  it("plays the registered welcome clip instead of Web Speech when the file works", async () => {
    installFakeSpeechEngine({ endAfterMs: 20, cancelErrorDelayMs: 0 });
    vi.resetModules();
    const audio = await import("./toddlerAudio");
    const { SAFARI_EXPLORE_WELCOME_PROMPT } = await import("../data/toddler/audioRegistry");
    const played: string[] = [];
    audio.setAudioFactoryForTests((src) => ({
      src,
      volume: 1,
      play: () => {
        played.push(src);
        return Promise.resolve();
      },
      pause: () => {},
      onended: null,
      onerror: null,
    }));
    const { speakText } = await import("./speechUtils");
    let ended = false;
    speakText(SAFARI_EXPLORE_WELCOME_PROMPT, { onEnd: () => { ended = true; } });
    await wait(50);
    expect(played).toEqual(["/audio/voice/narrator-safari-explore-welcome.mp3"]);
    expect(engineLog.some((line) => line.startsWith("speak:Tap any animal friend"))).toBe(false);

    // Clip end should still release callers.
    // Fake clip never fires onended here; not required for "used clip instead of speech".
    expect(ended).toBe(false);
  });

  it("falls back to Web Speech when the narrator file cannot play", async () => {
    installFakeSpeechEngine({ endAfterMs: 20, cancelErrorDelayMs: 0 });
    vi.resetModules();
    const audio = await import("./toddlerAudio");
    const { SAFARI_EXPLORE_WELCOME_PROMPT } = await import("../data/toddler/audioRegistry");
    audio.setAudioFactoryForTests((src) => ({
      src,
      volume: 1,
      play: () => Promise.reject(new Error("404")),
      pause: () => {},
      onended: null,
      onerror: null,
    }));
    const { speakText } = await import("./speechUtils");
    speakText(SAFARI_EXPLORE_WELCOME_PROMPT);
    await wait(200);
    expect(engineLog.some((line) => line.includes("Tap any animal friend to hear their call"))).toBe(true);
  });

  it("plays an IPA game clip instead of rewriting the line into device TTS", async () => {
    installFakeSpeechEngine({ endAfterMs: 20, cancelErrorDelayMs: 0 });
    vi.resetModules();
    const audio = await import("./toddlerAudio");
    const played: string[] = [];
    audio.setAudioFactoryForTests((src) => ({
      src,
      volume: 1,
      play: () => {
        played.push(src);
        return Promise.resolve();
      },
      pause: () => {},
      onended: null,
      onerror: null,
    }));
    const { speakText } = await import("./speechUtils");
    speakText("Trace the letter R. Start on the blue dot. One line. R says /r/! Rocket!");
    await wait(50);
    expect(played).toEqual(["/audio/voice/trace-rocket.mp3"]);
    expect(engineLog.some((line) => line.startsWith("speak:"))).toBe(false);
  });

  it("closedKit plays an IPA game clip and stays quiet without Web Speech", async () => {
    installFakeSpeechEngine({ endAfterMs: 20, cancelErrorDelayMs: 0 });
    vi.resetModules();
    const audio = await import("./toddlerAudio");
    const played: string[] = [];
    audio.setAudioFactoryForTests((src) => ({
      src,
      volume: 1,
      play: () => {
        played.push(src);
        return Promise.resolve();
      },
      pause: () => {},
      onended: null,
      onerror: null,
    }));
    const { speakText } = await import("./speechUtils");
    speakText("Yes! R says /r/! Rocket!", { closedKit: true });
    await wait(50);
    expect(played).toEqual(["/audio/voice/trace-yes-rocket.mp3"]);
    expect(engineLog.some((line) => line.startsWith("speak:"))).toBe(false);
  });

  it("closedKit plays a matching clip and never starts Web Speech on a miss", async () => {
    installFakeSpeechEngine({ endAfterMs: 20, cancelErrorDelayMs: 0 });
    vi.resetModules();
    const audio = await import("./toddlerAudio");
    audio.setAudioFactoryForTests((src) => ({
      src,
      volume: 1,
      play: () => Promise.resolve(),
      pause: () => {},
      onended: null,
      onerror: null,
    }));
    const { speakText } = await import("./speechUtils");
    speakText("Hold the pail. Fill it to the top.", { closedKit: true });
    await wait(80);
    expect(engineLog.some((line) => line.startsWith("speak:"))).toBe(false);

    speakText("a farm line with no clip yet", { closedKit: true });
    await wait(80);
    expect(engineLog.some((line) => line.includes("a farm line with no clip yet"))).toBe(false);
  });

  it("does not start Web Speech or a narrator clip while parent audio is playing", async () => {
    installFakeSpeechEngine({ endAfterMs: 20, cancelErrorDelayMs: 0 });
    vi.resetModules();
    const audio = await import("./toddlerAudio");
    const { SAFARI_EXPLORE_WELCOME_PROMPT } = await import("../data/toddler/audioRegistry");
    audio.setAudioFactoryForTests((src) => ({
      src,
      volume: 1,
      play: () => Promise.resolve(),
      pause: () => {},
      onended: null,
      onerror: null,
    }));
    audio.toddlerAudio.beginParentPlayback();
    const { speakText } = await import("./speechUtils");
    let ended = false;
    const spoken = speakText(SAFARI_EXPLORE_WELCOME_PROMPT, { onEnd: () => { ended = true; } });
    await wait(150);
    expect(spoken).toBe(false);
    expect(ended).toBe(true);
    expect(engineLog).toHaveLength(0);
    audio.toddlerAudio.endParentPlayback();
  });

  it("plays ColorLab closedKit mix-again and open-play Beep beep clips instead of Web Speech", async () => {
    installFakeSpeechEngine({ endAfterMs: 20, cancelErrorDelayMs: 0 });
    vi.resetModules();
    const audio = await import("./toddlerAudio");
    const played: string[] = [];
    audio.setAudioFactoryForTests((src) => ({
      src,
      volume: 1,
      play: () => {
        played.push(src);
        return Promise.resolve();
      },
      pause: () => {},
      onended: null,
      onerror: null,
    }));
    const { speakText, narrationClipLookups } = await import("./speechUtils");
    const mix = "That made Pink. We need Green. Mix again!";
    expect(narrationClipLookups(mix)).toEqual([mix]);
    expect(narrationClipLookups("Beep beep!")).toEqual(["Beep beep!"]);

    speakText(mix, { closedKit: true });
    await wait(50);
    speakText("Beep beep!");
    await wait(50);
    speakText("Beep beep!");
    await wait(50);
    expect(played).toEqual([
      "/audio/voice/color-need-pink-green.mp3",
      "/audio/voice/open-play-beep.mp3",
      "/audio/voice/open-play-beep.mp3",
    ]);
    expect(engineLog.some((line) => line.startsWith("speak:"))).toBe(false);
  });

  it("plays Cream mix-again, mix-until, and book-finish clips instead of Web Speech", async () => {
    installFakeSpeechEngine({ endAfterMs: 20, cancelErrorDelayMs: 0 });
    vi.resetModules();
    const audio = await import("./toddlerAudio");
    const played: string[] = [];
    audio.setAudioFactoryForTests((src) => ({
      src,
      volume: 1,
      play: () => {
        played.push(src);
        return Promise.resolve();
      },
      pause: () => {},
      onended: null,
      onerror: null,
    }));
    const { speakText } = await import("./speechUtils");
    speakText("That made Sky. We need Green. Mix again!", { closedKit: true });
    await wait(50);
    speakText("Mix two colours until you make Orange!", { closedKit: true });
    await wait(50);
    speakText("Hooray! You finished reading Animal Phonics Safari! You earned three golden stars!");
    await wait(50);
    expect(played).toEqual([
      "/audio/voice/color-need-sky-green.mp3",
      "/audio/voice/color-mix-until-orange.mp3",
      "/audio/voice/book-finish-animal-phonics-safari.mp3",
    ]);
    expect(engineLog.some((line) => line.startsWith("speak:"))).toBe(false);
  });

  it("plays studio book-finish clips instead of Web Speech, including a repeat tap", async () => {
    installFakeSpeechEngine({ endAfterMs: 20, cancelErrorDelayMs: 0 });
    vi.resetModules();
    const audio = await import("./toddlerAudio");
    const played: string[] = [];
    audio.setAudioFactoryForTests((src) => ({
      src,
      volume: 1,
      play: () => {
        played.push(src);
        return Promise.resolve();
      },
      pause: () => {},
      onended: null,
      onerror: null,
    }));
    const { speakText, narrationClipLookups } = await import("./speechUtils");
    const line =
      "Hooray! You finished reading How a Ferry Floats! You earned three golden stars!";
    expect(narrationClipLookups(line)).toEqual([line]);
    speakText(line);
    await wait(50);
    speakText(line);
    await wait(50);
    expect(played).toEqual([
      "/audio/voice/book-finish-how-a-ferry-floats.mp3",
      "/audio/voice/book-finish-how-a-ferry-floats.mp3",
    ]);
    expect(engineLog.some((line) => line.startsWith("speak:"))).toBe(false);
  });

  it("plays Pancake Saturday finish instead of Web Speech", async () => {
    installFakeSpeechEngine({ endAfterMs: 20, cancelErrorDelayMs: 0 });
    vi.resetModules();
    const audio = await import("./toddlerAudio");
    const played: string[] = [];
    audio.setAudioFactoryForTests((src) => ({
      src,
      volume: 1,
      play: () => {
        played.push(src);
        return Promise.resolve();
      },
      pause: () => {},
      onended: null,
      onerror: null,
    }));
    const { speakText } = await import("./speechUtils");
    const line = "Hooray! You finished reading Pancake Saturday! You earned three golden stars!";
    speakText(line);
    await wait(50);
    speakText(line);
    await wait(50);
    expect(played).toEqual([
      "/audio/voice/book-finish-pancake-saturday.mp3",
      "/audio/voice/book-finish-pancake-saturday.mp3",
    ]);
    expect(engineLog.some((row) => row.startsWith("speak:"))).toBe(false);
  });

  it("plays Snow Day on Maple Street finish instead of Web Speech", async () => {
    installFakeSpeechEngine({ endAfterMs: 20, cancelErrorDelayMs: 0 });
    vi.resetModules();
    const audio = await import("./toddlerAudio");
    const played: string[] = [];
    audio.setAudioFactoryForTests((src) => ({
      src,
      volume: 1,
      play: () => {
        played.push(src);
        return Promise.resolve();
      },
      pause: () => {},
      onended: null,
      onerror: null,
    }));
    const { speakText } = await import("./speechUtils");
    const line =
      "Hooray! You finished reading Snow Day on Maple Street! You earned three golden stars!";
    speakText(line);
    await wait(50);
    speakText(line);
    await wait(50);
    expect(played).toEqual([
      "/audio/voice/book-finish-snow-maple-street.mp3",
      "/audio/voice/book-finish-snow-maple-street.mp3",
    ]);
    expect(engineLog.some((row) => row.startsWith("speak:"))).toBe(false);
  });

  it("plays The Corner Store Bell finish instead of Web Speech", async () => {
    installFakeSpeechEngine({ endAfterMs: 20, cancelErrorDelayMs: 0 });
    vi.resetModules();
    const audio = await import("./toddlerAudio");
    const played: string[] = [];
    audio.setAudioFactoryForTests((src) => ({
      src,
      volume: 1,
      play: () => {
        played.push(src);
        return Promise.resolve();
      },
      pause: () => {},
      onended: null,
      onerror: null,
    }));
    const { speakText } = await import("./speechUtils");
    const line =
      "Hooray! You finished reading The Corner Store Bell! You earned three golden stars!";
    speakText(line);
    await wait(50);
    speakText(line);
    await wait(50);
    expect(played).toEqual([
      "/audio/voice/book-finish-corner-store-bell.mp3",
      "/audio/voice/book-finish-corner-store-bell.mp3",
    ]);
    expect(engineLog.some((row) => row.startsWith("speak:"))).toBe(false);
  });

  it("plays Hardware Drawer of Knobs finish instead of Web Speech", async () => {
    installFakeSpeechEngine({ endAfterMs: 20, cancelErrorDelayMs: 0 });
    vi.resetModules();
    const audio = await import("./toddlerAudio");
    const played: string[] = [];
    audio.setAudioFactoryForTests((src) => ({
      src,
      volume: 1,
      play: () => {
        played.push(src);
        return Promise.resolve();
      },
      pause: () => {},
      onended: null,
      onerror: null,
    }));
    const { speakText } = await import("./speechUtils");
    const line =
      "Hooray! You finished reading Hardware Drawer of Knobs! You earned three golden stars!";
    speakText(line);
    await wait(50);
    speakText(line);
    await wait(50);
    expect(played).toEqual([
      "/audio/voice/book-finish-hardware-drawer-knobs.mp3",
      "/audio/voice/book-finish-hardware-drawer-knobs.mp3",
    ]);
    expect(engineLog.some((row) => row.startsWith("speak:"))).toBe(false);
  });

  it("plays Snowplow Dawn finish instead of Web Speech", async () => {
    installFakeSpeechEngine({ endAfterMs: 20, cancelErrorDelayMs: 0 });
    vi.resetModules();
    const audio = await import("./toddlerAudio");
    const played: string[] = [];
    audio.setAudioFactoryForTests((src) => ({
      src,
      volume: 1,
      play: () => {
        played.push(src);
        return Promise.resolve();
      },
      pause: () => {},
      onended: null,
      onerror: null,
    }));
    const { speakText } = await import("./speechUtils");
    const line = "Hooray! You finished reading Snowplow Dawn! You earned three golden stars!";
    speakText(line);
    await wait(50);
    speakText(line);
    await wait(50);
    expect(played).toEqual([
      "/audio/voice/book-finish-snow-plow-dawn.mp3",
      "/audio/voice/book-finish-snow-plow-dawn.mp3",
    ]);
    expect(engineLog.some((row) => row.startsWith("speak:"))).toBe(false);
  });

  it("plays Deep Ocean Wonders finish instead of Web Speech", async () => {
    installFakeSpeechEngine({ endAfterMs: 20, cancelErrorDelayMs: 0 });
    vi.resetModules();
    const audio = await import("./toddlerAudio");
    const played: string[] = [];
    audio.setAudioFactoryForTests((src) => ({
      src,
      volume: 1,
      play: () => {
        played.push(src);
        return Promise.resolve();
      },
      pause: () => {},
      onended: null,
      onerror: null,
    }));
    const { speakText } = await import("./speechUtils");
    const line = "Hooray! You finished reading Deep Ocean Wonders! You earned three golden stars!";
    speakText(line);
    await wait(50);
    speakText(line);
    await wait(50);
    expect(played).toEqual([
      "/audio/voice/book-finish-deep-ocean-wonders.mp3",
      "/audio/voice/book-finish-deep-ocean-wonders.mp3",
    ]);
    expect(engineLog.some((row) => row.startsWith("speak:"))).toBe(false);
  });

  it("plays The Helpful Little Tugboat finish instead of Web Speech", async () => {
    installFakeSpeechEngine({ endAfterMs: 20, cancelErrorDelayMs: 0 });
    vi.resetModules();
    const audio = await import("./toddlerAudio");
    const played: string[] = [];
    audio.setAudioFactoryForTests((src) => ({
      src,
      volume: 1,
      play: () => {
        played.push(src);
        return Promise.resolve();
      },
      pause: () => {},
      onended: null,
      onerror: null,
    }));
    const { speakText } = await import("./speechUtils");
    const line =
      "Hooray! You finished reading The Helpful Little Tugboat! You earned three golden stars!";
    speakText(line);
    await wait(50);
    speakText(line);
    await wait(50);
    expect(played).toEqual([
      "/audio/voice/book-finish-the-helpful-little-tugboat.mp3",
      "/audio/voice/book-finish-the-helpful-little-tugboat.mp3",
    ]);
    expect(engineLog.some((row) => row.startsWith("speak:"))).toBe(false);
  });

  it("plays Home Kind Morning finish instead of Web Speech", async () => {
    installFakeSpeechEngine({ endAfterMs: 20, cancelErrorDelayMs: 0 });
    vi.resetModules();
    const audio = await import("./toddlerAudio");
    const played: string[] = [];
    audio.setAudioFactoryForTests((src) => ({
      src,
      volume: 1,
      play: () => {
        played.push(src);
        return Promise.resolve();
      },
      pause: () => {},
      onended: null,
      onerror: null,
    }));
    const { speakText } = await import("./speechUtils");
    const line = "Hooray! You finished reading Home Kind Morning! You earned three golden stars!";
    speakText(line);
    await wait(50);
    speakText(line);
    await wait(50);
    expect(played).toEqual([
      "/audio/voice/book-finish-home-kind-morning.mp3",
      "/audio/voice/book-finish-home-kind-morning.mp3",
    ]);
    expect(engineLog.some((row) => row.startsWith("speak:"))).toBe(false);
  });

  it("plays Farm Helper mission start instead of Web Speech", async () => {
    installFakeSpeechEngine({ endAfterMs: 20, cancelErrorDelayMs: 0 });
    vi.resetModules();
    const audio = await import("./toddlerAudio");
    const played: string[] = [];
    audio.setAudioFactoryForTests((src) => ({
      src,
      volume: 1,
      play: () => {
        played.push(src);
        return Promise.resolve();
      },
      pause: () => {},
      onended: null,
      onerror: null,
    }));
    const { speakText } = await import("./speechUtils");
    const line =
      "Mission started: Barnyard Morning Helper! Step 1: Listen for the Cow. Listen with your ears! Who is chewing sweet clover in the meadow and says Moooo?";
    speakText(line);
    await wait(50);
    speakText(line);
    await wait(50);
    expect(played).toEqual([
      "/audio/voice/mission-farm-helper-start.mp3",
      "/audio/voice/mission-farm-helper-start.mp3",
    ]);
    expect(engineLog.some((row) => row.startsWith("speak:"))).toBe(false);
  });

  it("plays Coral Reef Submarine Voyage complete instead of Web Speech", async () => {
    installFakeSpeechEngine({ endAfterMs: 20, cancelErrorDelayMs: 0 });
    vi.resetModules();
    const audio = await import("./toddlerAudio");
    const played: string[] = [];
    audio.setAudioFactoryForTests((src) => ({
      src,
      volume: 1,
      play: () => {
        played.push(src);
        return Promise.resolve();
      },
      pause: () => {},
      onended: null,
      onerror: null,
    }));
    const { speakText } = await import("./speechUtils");
    const line =
      "Congratulations! You completed the entire mission: Coral Reef Submarine Voyage! You earned the Deep Sea Navigator badge!";
    speakText(line);
    await wait(50);
    speakText(line);
    await wait(50);
    expect(played).toEqual([
      "/audio/voice/mission-ocean-voyage-complete.mp3",
      "/audio/voice/mission-ocean-voyage-complete.mp3",
    ]);
    expect(engineLog.some((row) => row.startsWith("speak:"))).toBe(false);
  });
});

describe("mission wrap clip and TTS completion callbacks", () => {
  it("fires onEnd from a generated clip before a follow-up line", async () => {
    installFakeSpeechEngine({ endAfterMs: 20, cancelErrorDelayMs: 0 });
    vi.resetModules();
    const audio = await import("./toddlerAudio");
    const { SAFARI_EXPLORE_WELCOME_PROMPT } = await import("../data/toddler/audioRegistry");
    const played: string[] = [];
    audio.setAudioFactoryForTests((src) => {
      const node = {
        src,
        volume: 1,
        play: () => {
          played.push(src);
          queueMicrotask(() => node.onended?.());
          return Promise.resolve();
        },
        pause: () => {},
        onended: null as ((this: unknown, ev?: Event) => void) | null,
        onerror: null as ((this: unknown, ev?: Event) => void) | null,
      };
      return node;
    });
    const { speakText } = await import("./speechUtils");
    const order: string[] = [];
    speakText(SAFARI_EXPLORE_WELCOME_PROMPT, {
      closedKit: false,
      onEnd: () => {
        order.push("wrap-end");
        speakText("Mission follow-up activity line", {
          onEnd: () => order.push("follow-up-end"),
        });
      },
    });
    await wait(200);
    expect(order).toEqual(["wrap-end", "follow-up-end"]);
    expect(played[0]).toContain("safari");
    expect(engineLog.some((row) => row.includes("Mission follow-up activity line"))).toBe(true);
  });

  it("fires onEnd from Web Speech fallback before a follow-up line", async () => {
    installFakeSpeechEngine({ endAfterMs: 20, cancelErrorDelayMs: 0 });
    vi.resetModules();
    const { speakText } = await import("./speechUtils");
    const order: string[] = [];
    speakText("ZZZ mission wrap line with no clip 111", {
      closedKit: false,
      onEnd: () => {
        order.push("wrap-end");
        speakText("ZZZ activity prompt line with no clip 222", {
          onEnd: () => order.push("follow-up-end"),
        });
      },
    });
    await wait(400);
    expect(order).toEqual(["wrap-end", "follow-up-end"]);
    expect(engineLog.some((row) => row.includes("ZZZ mission wrap line with no clip 111"))).toBe(true);
    expect(engineLog.some((row) => row.includes("ZZZ activity prompt line with no clip 222"))).toBe(true);
  });
});

