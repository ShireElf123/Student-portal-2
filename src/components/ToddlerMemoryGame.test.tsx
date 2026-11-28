// @vitest-environment jsdom
import React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render } from "@testing-library/react";

vi.mock("../utils/speechUtils", () => ({
  speakText: () => true,
  stopSpeaking: () => {},
}));
vi.mock("canvas-confetti", () => ({ default: () => {} }));
vi.mock("../utils/learnerBrain", () => ({
  getActiveLearnerId: () => "test-learner",
  recordLearningEvent: () => {},
}));
vi.mock("../utils/gamification", () => ({
  awardXP: () => ({ leveledUp: false, newLevel: 1 }),
  awardStars: () => {},
  triggerCelebrationConfetti: () => {},
}));
vi.mock("../utils/soundEffects", () => ({
  soundEffects: {
    playPop: () => {},
    playFanfare: () => {},
    playSuccessChime: () => {},
    playGentleBoing: () => {},
  },
}));

import { ToddlerMemoryGame } from "./ToddlerMemoryGame";

const pairs = [
  { pairId: "cat", emoji: "🐱", name: "Kitten", color: "from-amber-400 to-orange-400" },
  { pairId: "dog", emoji: "🐶", name: "Puppy", color: "from-blue-400 to-indigo-400" },
  { pairId: "star", emoji: "⭐", name: "Star", color: "from-yellow-300 to-amber-500" },
  { pairId: "apple", emoji: "🍎", name: "Apple", color: "from-rose-400 to-red-500" },
];

const flush = async (ms = 0) => {
  await act(async () => {
    await Promise.resolve();
    if (ms) vi.advanceTimersByTime(ms);
  });
};

async function clearCozyBoard(container: HTMLElement) {
  const cozy = Array.from(container.querySelectorAll("button")).find((button) => button.textContent?.includes("Cozy"));
  fireEvent.click(cozy as HTMLButtonElement);
  await flush();
  const ids = ["cat", "dog", "star", "apple"];
  for (const pairId of ids) {
    const buttons = Array.from(container.querySelectorAll(`[data-testid^="memory-card-${pairId}-"]`));
    expect(buttons.length).toBe(2);
    fireEvent.click(buttons[0]);
    fireEvent.click(buttons[1]);
    await flush(1000);
  }
}

beforeEach(() => {
  cleanup();
  vi.useFakeTimers();
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe("memory rewards", () => {
  it("pays stars on the first clear, then Play Again does not farm", async () => {
    const stars: number[] = [];
    const completes: number[] = [];
    const { container } = render(
      <ToddlerMemoryGame
        pairs={pairs}
        onAddStar={(amount) => stars.push(amount ?? 1)}
        onComplete={() => completes.push(1)}
      />,
    );
    await clearCozyBoard(container);
    expect(container.textContent).toContain("Super Memory Champion");
    expect(stars).toEqual([1, 1, 1, 1, 3]);
    expect(completes).toEqual([1]);

    const again = Array.from(container.querySelectorAll("button")).find((button) => button.textContent?.includes("Play Again"));
    fireEvent.click(again as HTMLButtonElement);
    await flush();
    await clearCozyBoard(container);
    expect(stars).toEqual([1, 1, 1, 1, 3]);
    expect(completes).toEqual([1]);
  });
});
