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
  getActiveLearnerId: () => "test-learner",
  recordLearningEvent: () => {},
}));
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

import { SECRET_ZONES, ToddlerSecretZonePlay, secretZoneIsFound } from "./ToddlerSecretZones";
import { ToddlerWorldsNavigator } from "./ToddlerWorldsNavigator";

const flush = async () => {
  await act(async () => {
    await Promise.resolve();
  });
};

beforeEach(() => {
  cleanup();
  localStorage.clear();
});

afterEach(() => {
  cleanup();
});

describe("secret rooms", () => {
  it("lets a child brush every fossil in the dino cave and pays once", async () => {
    const stars: number[] = [];
    const zone = SECRET_ZONES[0];
    const { container } = render(
      <ToddlerSecretZonePlay zone={zone} onAddStar={(count) => stars.push(count)} onLeave={() => {}} />
    );
    await flush();
    expect(container.textContent).toContain("Dino Excavation Cave");
    expect(container.textContent).toContain("Fossils 0 of 5");

    const patches = Array.from(container.querySelectorAll("button")).filter((button) =>
      (button.getAttribute("aria-label") ?? "").includes("sand")
    );
    expect(patches.length).toBe(12);
    for (const patch of patches) {
      fireEvent.click(patch);
    }
    await flush();
    expect(container.textContent).toContain("Golden Triceratops Horn");
    expect(stars).toEqual([3]);
    expect(secretZoneIsFound(zone.id)).toBe(true);

    fireEvent.click(patches[0]);
    expect(stars).toEqual([3]);
  });

  it("opens Dino Excavation Cave as a dig room, not a speech-only card", async () => {
    const { container } = render(<ToddlerWorldsNavigator onAddStar={() => {}} starsCount={40} />);
    await flush();
    const chip = Array.from(container.querySelectorAll("button")).find((button) =>
      button.textContent?.includes("Dino Excavation Cave")
    );
    expect(chip).toBeTruthy();
    fireEvent.click(chip as HTMLButtonElement);
    await flush();
    expect(container.textContent).toContain("brush every sandy patch");
    expect(container.textContent).not.toContain("Explorer XP Awarded");
  });
});
