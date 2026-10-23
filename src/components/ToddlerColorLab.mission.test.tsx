// @vitest-environment jsdom
import React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render } from "@testing-library/react";

const pay = vi.fn();

vi.mock("../utils/speechUtils", () => ({
  speakText: () => true,
  stopSpeaking: () => {},
  isVoiceMuted: () => false,
  setVoiceMuted: () => {},
  speechCoordinator: { subscribe: () => () => {} },
}));
vi.mock("canvas-confetti", () => ({ default: () => {} }));
vi.mock("../utils/gamification", () => ({
  awardXP: () => ({ leveledUp: false, newLevel: 1 }),
  triggerCelebrationConfetti: () => {},
  awardStars: () => {},
}));
vi.mock("../utils/soundEffects", () => ({
  soundEffects: {
    unlock: () => {},
    playPop: () => {},
    playFanfare: () => {},
    playSuccessChime: () => {},
    playGentleBoing: () => {},
    isMuted: () => false,
    setMuted: () => {},
  },
}));
vi.mock("../data/toddler/toddlerDailyAdventure", () => ({
  payDailyMissionIfMatches: (...args: unknown[]) => pay(...args),
}));
vi.mock("../utils/learnerBrain", () => ({
  getActiveLearnerId: () => "test-learner",
  recordLearningEvent: () => {},
}));

import { ToddlerColorLab } from "./ToddlerColorLab";

const flush = async (ms: number) => {
  await act(async () => {
    await Promise.resolve();
    if (ms) vi.advanceTimersByTime(ms);
  });
};

const named = (container: HTMLElement, label: string) =>
  Array.from(container.querySelectorAll("button")).find((button) => button.textContent?.includes(label)) as HTMLButtonElement;

beforeEach(() => {
  cleanup();
  pay.mockReset();
  vi.stubGlobal(
    "ResizeObserver",
    class {
      observe() {}
      unobserve() {}
      disconnect() {}
    },
  );
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(null as never);
  vi.useFakeTimers();
});
afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

describe("Color Lab mission surface", () => {
  it("does not pay a Games mission when Worlds asked it not to", async () => {
    const { container } = render(<ToddlerColorLab missionSurface="off" />);
    fireEvent.click(named(container, "Ruby Red"));
    fireEvent.click(named(container, "Sunny Yellow"));
    await flush(3000);
    expect(container.textContent).toContain("Magical Orange");
    expect(pay).not.toHaveBeenCalled();
  });

  it("pays the Games color-magic mission from the Games tab", async () => {
    const { container } = render(<ToddlerColorLab />);
    fireEvent.click(named(container, "Ruby Red"));
    fireEvent.click(named(container, "Sunny Yellow"));
    await flush(3000);
    expect(pay).toHaveBeenCalledWith("games", "color-magic");
  });
});
