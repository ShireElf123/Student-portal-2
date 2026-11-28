// @vitest-environment jsdom
import React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render } from "@testing-library/react";

vi.mock("../utils/speechUtils", () => ({
  speakText: () => true,
  stopSpeaking: () => {},
  isVoiceMuted: () => false,
  setVoiceMuted: () => {},
  speechCoordinator: { subscribe: () => () => {} },
}));
vi.mock("canvas-confetti", () => ({ default: () => {} }));
vi.mock("../utils/learnerBrain", () => ({
  getActiveLearnerId: () => "balloon-station-learner",
  recordLearningEvent: () => {},
}));
vi.mock("../utils/gamification", () => ({
  awardXP: () => ({ leveledUp: false, newLevel: 1 }),
  triggerCelebrationConfetti: () => {},
  awardStars: () => {},
}));

import { ToddlerBalloonSky } from "./ToddlerBalloonSky";

const flush = async (ms = 0) => {
  await act(async () => {
    await Promise.resolve();
    if (ms) vi.advanceTimersByTime(ms);
  });
};

const balloons = (container: HTMLElement) =>
  Array.from(container.querySelectorAll("button")).filter((button) =>
    /^[A-Z0-9]$/.test(button.textContent?.trim() ?? ""),
  ) as HTMLButtonElement[];

beforeEach(() => {
  cleanup();
  localStorage.clear();
  vi.useFakeTimers();
});
afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

describe("Balloon Sky station completion", () => {
  it("keeps paying target stars and only completes the station on the third hit", async () => {
    const stars: number[] = [];
    const completed = vi.fn();
    const { container } = render(
      <ToddlerBalloonSky onAddStar={(amount) => stars.push(amount ?? 1)} onComplete={completed} />,
    );
    await flush(2500);

    for (let hit = 0; hit < 3; hit += 1) {
      const target = container.textContent?.match(/Target Balloon:\s*(\w)/)?.[1];
      const targetBalloon = balloons(container).find((balloon) => balloon.textContent?.trim() === target);
      expect(targetBalloon).toBeTruthy();
      fireEvent.click(targetBalloon as HTMLButtonElement);
      await flush(500);
      if (hit < 2) expect(completed).not.toHaveBeenCalled();
    }

    expect(completed).toHaveBeenCalledTimes(1);
    expect(stars).toEqual([1, 1, 1]);
  });
});
