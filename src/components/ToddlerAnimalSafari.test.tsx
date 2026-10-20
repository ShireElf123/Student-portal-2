// @vitest-environment jsdom
/**
 * Animal Safari (Savanna Animal Detective) gameplay regression tests.
 *
 * The reported defect: a child taps the correct animal and the game stays on
 * the same screen — no spoken confirmation and no move to the next mystery —
 * until the game is left and re-opened. These tests pin the whole loop:
 * ask → tap the right animal → hear/see the confirmation → the next mystery
 * arrives on its own, repeatable without any other control.
 */
import React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render, fireEvent, cleanup, act } from "@testing-library/react";

// Speech is mocked so the tests can decide whether the engine reports the end
// of an utterance (browsers are allowed not to — see speechUtils tests).
const speech = vi.hoisted(() => ({
  spoken: [] as string[],
  reportEnd: { value: true },
}));

vi.mock("../utils/speechUtils", () => ({
  speakText: (text: string, options?: { onEnd?: () => void }) => {
    speech.spoken.push(text);
    if (speech.reportEnd.value && options?.onEnd) {
      setTimeout(() => options.onEnd?.(), 0);
    }
    return true;
  },
  stopSpeaking: () => {},
  isVoiceMuted: () => false,
  setVoiceMuted: () => {},
  speechCoordinator: { subscribe: () => () => {} },
}));

vi.mock("canvas-confetti", () => ({ default: () => {} }));
vi.mock("../utils/learnerBrain", () => ({
  getActiveLearnerId: () => "test-learner",
  recordLearningEvent: () => {},
}));

import { ToddlerAnimalSafari } from "./ToddlerAnimalSafari";
import { ToddlerQuizzesAndGames } from "./ToddlerQuizzesAndGames";

const EMOJI_FOR_SOUND: Record<string, string> = {
  "ROAAAR!": "🦁",
  "PAWOOO!": "🐘",
  "OOH-OOH AAH-AAH!": "🐵",
  "QUACK QUACK!": "🦆",
  "RIBBIT RIBBIT!": "🐸",
  "MOOO MOOO!": "🐄",
};

const mystery = (container: HTMLElement) =>
  (container.querySelector(".tracking-wide")?.textContent ?? "").replace(/[“”"]/g, "").trim();

const solved = (container: HTMLElement) =>
  Number(container.textContent?.match(/Solved: (\d+)/)?.[1] ?? 0);

/** Animal card buttons only — the games hub has its own emoji tab buttons. */
const card = (container: HTMLElement, emoji: string) =>
  Array.from(container.querySelectorAll("button")).find(
    (button) =>
      button.querySelector('div[class*="text-6xl"]') !== null &&
      button.textContent?.includes(emoji)
  ) as HTMLButtonElement;

const nextButton = (container: HTMLElement) =>
  Array.from(container.querySelectorAll("button")).find((button) =>
    button.textContent?.includes("Next Mystery")
  ) as HTMLButtonElement | undefined;

/** Taps the animal that matches the mystery sound currently on screen. */
const solveCurrentMystery = async (container: HTMLElement) => {
  const emoji = EMOJI_FOR_SOUND[mystery(container)];
  if (!emoji) throw new Error(`unknown mystery sound: ${mystery(container)}`);
  fireEvent.click(card(container, emoji));
  await flush();
};

const flush = async (ms = 0) => {
  await act(async () => {
    await Promise.resolve();
  });
  if (ms > 0) {
    await act(async () => {
      vi.advanceTimersByTime(ms);
    });
  }
};

/** Lets the welcome speech and any pending round transition settle. */
const settle = (ms = 1500) => flush(ms);

beforeEach(() => {
  cleanup();
  vi.useFakeTimers();
  speech.spoken.length = 0;
  speech.reportEnd.value = true;
  localStorage.clear();
  // Deterministic "next mystery": always takes the first other animal, so the
  // round order is lion → elephant → lion → …
  vi.spyOn(Math, "random").mockReturnValue(0);
});

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe("Animal Safari detective loop", () => {
  it("confirms the correct animal out loud and then advances on its own", async () => {
    const stars: number[] = [];
    const { container } = render(<ToddlerAnimalSafari onAddStar={(amount) => stars.push(amount ?? 1)} />);
    await settle(300);

    expect(mystery(container)).toBe("ROAAAR!");

    await solveCurrentMystery(container);

    // Step 3 of the reported flow: feedback for the animal that was tapped.
    expect(speech.spoken.some((line) => line.startsWith("Yes! Correct! It's the Brave Lion!"))).toBe(true);
    expect(solved(container)).toBe(1);
    expect(card(container, "🦁").className).toContain("ring-4");

    // Step 4: the next mystery arrives without any further tap.
    await settle(1200);
    expect(mystery(container)).toBe("PAWOOO!");
    expect(solved(container)).toBe(1);

    // …and the new mystery is answerable.
    await solveCurrentMystery(container);
    expect(solved(container)).toBe(2);
    expect(stars).toEqual([2, 2]);
  });

  it("keeps playing round after round from taps alone, without ever getting stuck", async () => {
    const { container } = render(<ToddlerAnimalSafari onAddStar={() => {}} />);
    await settle(300);

    const soundsSeen: string[] = [mystery(container)];
    for (let round = 0; round < 4; round++) {
      await solveCurrentMystery(container);
      await settle(1200);
      soundsSeen.push(mystery(container));
    }

    expect(solved(container)).toBe(4);
    expect(new Set(soundsSeen).size).toBeGreaterThan(1);
  });

  it("advances even when the speech engine never reports the end of the praise", async () => {
    // Muted voices and stalled utterances never call onEnd — the round must
    // still be released instead of leaving a screen that ignores every tap.
    speech.reportEnd.value = false;
    const { container } = render(<ToddlerAnimalSafari onAddStar={() => {}} />);
    await settle(300);

    await solveCurrentMystery(container);
    expect(solved(container)).toBe(1);

    await settle(20000);
    expect(mystery(container)).not.toBe("ROAAAR!");
    expect(solved(container)).toBe(1);
  });

  it("pays a solved mystery once — extra taps during the celebration cannot farm stars", async () => {
    const stars: number[] = [];
    const { container } = render(<ToddlerAnimalSafari onAddStar={(amount) => stars.push(amount ?? 1)} />);
    await settle(300);

    await solveCurrentMystery(container);
    const lion = card(container, "🦁");
    fireEvent.click(lion);
    fireEvent.click(lion);
    fireEvent.click(lion);
    await flush();

    expect(stars).toEqual([2]);
    expect(solved(container)).toBe(1);
  });

  it("keeps the manual Next button as an immediate shortcut", async () => {
    const { container } = render(<ToddlerAnimalSafari onAddStar={() => {}} />);
    await settle(300);

    await solveCurrentMystery(container);
    const next = nextButton(container);
    expect(next).toBeTruthy();

    fireEvent.click(next as HTMLButtonElement);
    await flush();

    expect(mystery(container)).toBe("PAWOOO!");
    expect(solved(container)).toBe(1);

    // The manual shortcut must not double-advance later.
    await settle(2000);
    expect(mystery(container)).toBe("PAWOOO!");
  });

  it("opens on a random mystery instead of always the same animal", async () => {
    vi.spyOn(Math, "random").mockReturnValue(0.99); // last animal in the list
    const { container } = render(<ToddlerAnimalSafari onAddStar={() => {}} />);
    await settle(300);

    // Not the lion (which the game used to show every single time)…
    expect(mystery(container)).toBe("WHINNY!");
    // …and the welcome announcement matches what is on screen.
    expect(speech.spoken[0]).toContain("WHINNY!");
    expect(solved(container)).toBe(0);
  });

  it("coaches a wrong tap without advancing or paying", async () => {
    const stars: number[] = [];
    const { container } = render(<ToddlerAnimalSafari onAddStar={(amount) => stars.push(amount ?? 1)} />);
    await settle(300);

    fireEvent.click(card(container, "🦆"));
    await flush();

    expect(speech.spoken.at(-1)).toContain("That's the Happy Duck!");
    expect(solved(container)).toBe(0);
    expect(stars).toEqual([]);

    await settle(20000);
    expect(mystery(container)).toBe("ROAAAR!");
  });

  it("plays the same loop when Animal Safari is opened from the games hub", async () => {
    // Same flow as the app: Games → Safari tab → tap the animal → next question.
    const { container } = render(
      <ToddlerQuizzesAndGames starsCount={0} onAddStar={() => {}} targetActivity="animal-safari" />
    );
    await settle(500);

    expect(container.textContent).toContain("Savanna Animal Detective");
    expect(mystery(container)).toBe("ROAAAR!");

    await solveCurrentMystery(container);
    await settle(1200);

    expect(solved(container)).toBe(1);
    expect(mystery(container)).toBe("PAWOOO!");

    await solveCurrentMystery(container);
    await settle(1200);
    expect(solved(container)).toBe(2);
  });

  it("leaves free-play explorer mode unchanged", async () => {
    const stars: number[] = [];
    const { container } = render(<ToddlerAnimalSafari onAddStar={(amount) => stars.push(amount ?? 1)} />);
    await settle(300);

    fireEvent.click(container.querySelectorAll("button")[1]); // Free Safari Explorer
    await flush();

    fireEvent.click(card(container, "🐸"));
    await flush();
    expect(speech.spoken.at(-1)).toContain("Ribbit ribbit!");
    expect(stars).toEqual([1]);

    fireEvent.click(card(container, "🐸"));
    await flush();
    // Same animal again the same day is free play — discovery pays once.
    expect(stars).toEqual([1]);

    // No detective round may hijack free play.
    await settle(20000);
    expect(container.textContent).toContain("Lily Pad Pond");
  });
});
