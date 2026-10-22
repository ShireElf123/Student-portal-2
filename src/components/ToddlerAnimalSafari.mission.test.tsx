// @vitest-environment jsdom
import React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render } from "@testing-library/react";

const pay = vi.fn();

vi.mock("../utils/speechUtils", () => ({
  speakText: (_text: string, options?: { onEnd?: () => void }) => {
    if (options?.onEnd) setTimeout(() => options.onEnd?.(), 0);
    return true;
  },
  stopSpeaking: () => {},
  isVoiceMuted: () => false,
  setVoiceMuted: () => {},
  speechCoordinator: { subscribe: () => () => {} },
}));
vi.mock("canvas-confetti", () => ({ default: () => {} }));
vi.mock("../utils/learnerBrain", () => ({
  getActiveLearnerId: () => "safari-mission-learner",
  recordLearningEvent: () => {},
}));
vi.mock("../utils/gamification", () => ({
  awardXP: () => ({ leveledUp: false, newLevel: 1 }),
  triggerCelebrationConfetti: () => {},
  awardStars: () => {},
}));
vi.mock("../data/toddler/toddlerDailyAdventure", async () => {
  const actual = await vi.importActual<typeof import("../data/toddler/toddlerDailyAdventure")>(
    "../data/toddler/toddlerDailyAdventure",
  );
  return {
    ...actual,
    payDailyMissionIfMatches: (...args: unknown[]) => pay(...args),
  };
});

import { ToddlerAnimalSafari } from "./ToddlerAnimalSafari";

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

const card = (container: HTMLElement, emoji: string) =>
  Array.from(container.querySelectorAll("button")).find(
    (button) => button.querySelector('div[class*="text-6xl"]') !== null && button.textContent?.includes(emoji),
  ) as HTMLButtonElement;

const flush = async () => {
  await act(async () => {
    await Promise.resolve();
  });
};

const settle = async (ms: number) => {
  await act(async () => {
    vi.advanceTimersByTime(ms);
    await Promise.resolve();
  });
};

const solveCurrentMystery = async (container: HTMLElement) => {
  const emoji = EMOJI_FOR_SOUND[mystery(container)];
  if (!emoji) throw new Error(`unknown mystery sound: ${mystery(container)}`);
  fireEvent.click(card(container, emoji));
  await flush();
};

beforeEach(() => {
  cleanup();
  pay.mockReset();
  localStorage.clear();
  vi.useFakeTimers();
  vi.spyOn(Math, "random").mockReturnValue(0);
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe("Animal Safari mission surface", () => {
  it("does not pay a Games mission when Worlds asked it not to", async () => {
    const { container } = render(<ToddlerAnimalSafari missionSurface="off" />);
    await settle(300);
    for (let i = 0; i < 3; i += 1) {
      await solveCurrentMystery(container);
      if (i < 2) {
        const next = Array.from(container.querySelectorAll("button")).find((button) =>
          button.textContent?.includes("Next Mystery"),
        ) as HTMLButtonElement;
        fireEvent.click(next);
        await flush();
      }
    }
    expect(pay).not.toHaveBeenCalled();
  });

  it("pays the Games safari mission from the Games tab after three daily solves", async () => {
    const { container } = render(<ToddlerAnimalSafari />);
    await settle(300);
    for (let i = 0; i < 3; i += 1) {
      await solveCurrentMystery(container);
      if (i < 2) {
        const next = Array.from(container.querySelectorAll("button")).find((button) =>
          button.textContent?.includes("Next Mystery"),
        ) as HTMLButtonElement;
        fireEvent.click(next);
        await flush();
      }
    }
    expect(pay).toHaveBeenCalledWith("games", "animal-safari");
  });
});
