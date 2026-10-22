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
const learner = vi.hoisted(() => ({ id: "test-learner" }));

vi.mock("../utils/learnerBrain", () => ({
  getActiveLearnerId: () => learner.id,
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

function brushCanvas(canvas: HTMLCanvasElement) {
  fireEvent.pointerDown(canvas, { clientX: 10, clientY: 10, pointerId: 1 });
  for (let i = 0; i < 12; i += 1) {
    fireEvent.pointerMove(canvas, { clientX: 12 + i, clientY: 12 + i, pointerId: 1 });
  }
  fireEvent.pointerUp(canvas, { pointerId: 1 });
}

beforeEach(() => {
  cleanup();
  learner.id = "test-learner";
  localStorage.clear();
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(null);
});

afterEach(() => {
  cleanup();
});

describe("secret rooms", () => {
  it("makes the child brush sand off five named fossils and pays once", async () => {
    const stars: number[] = [];
    const zone = SECRET_ZONES[0];
    const { container } = render(
      <ToddlerSecretZonePlay zone={zone} onAddStar={(count) => stars.push(count)} onLeave={() => {}} />
    );
    await flush();
    expect(container.textContent).toContain("Dino Excavation Cave");
    expect(container.textContent).toContain("Field journal");
    expect(container.textContent).toContain("0 of 5 fossils");

    const pits = Array.from(container.querySelectorAll("canvas"));
    expect(pits.length).toBe(5);
    for (const pit of pits) {
      brushCanvas(pit);
    }
    await flush();
    expect(container.textContent).toContain("Golden Triceratops Horn");
    expect(container.textContent).toContain("✔ Golden Triceratops horn");
    expect(stars).toEqual([3]);
    expect(secretZoneIsFound(zone.id)).toBe(true);

    brushCanvas(pits[0]);
    expect(stars).toEqual([3]);
  });

  it("opens Dino Excavation Cave as a dig floor, not a speech-only card", async () => {
    const { container } = render(<ToddlerWorldsNavigator onAddStar={() => {}} starsCount={40} />);
    await flush();
    expect(container.textContent).toContain("Hidden doors");
    const chip = Array.from(container.querySelectorAll("button")).find((button) =>
      button.textContent?.includes("Dino Excavation Cave")
    );
    expect(chip).toBeTruthy();
    fireEvent.click(chip as HTMLButtonElement);
    await flush();
    expect(container.querySelectorAll("canvas").length).toBe(5);
    expect(container.textContent).toContain("Hold and brush");
    expect(container.textContent).not.toContain("Explorer XP Awarded");
  });

  it("traces Little Bear in order and ignores spare twinkles", async () => {
    const stars: number[] = [];
    const { container } = render(
      <ToddlerSecretZonePlay zone={SECRET_ZONES[1]} onAddStar={(count) => stars.push(count)} onLeave={() => {}} />
    );
    await flush();
    const spare = container.querySelector('[aria-label="Spare twinkle"]');
    expect(spare).toBeTruthy();
    fireEvent.click(spare as Element);
    await flush();
    expect(stars).toEqual([]);
    expect(container.textContent).toContain("Star 1 of 7");

    for (let i = 1; i <= 7; i += 1) {
      const labels = ["bowl", "bowl", "bowl", "bowl", "handle", "handle", "North Star"];
      const next = container.querySelector(`[aria-label="Next Little Bear star, ${labels[i - 1]}"]`);
      expect(next).toBeTruthy();
      fireEvent.click(next as Element);
      await flush();
    }
    expect(container.textContent).toContain("North Star");
    expect(stars).toEqual([3]);
  });

  it("collects three reef pearls into the pouch, not a tap-the-emoji grid", async () => {
    const stars: number[] = [];
    const { container } = render(
      <ToddlerSecretZonePlay zone={SECRET_ZONES[2]} onAddStar={(count) => stars.push(count)} onLeave={() => {}} />
    );
    await flush();
    expect(container.textContent).toContain("Pearl pouch");
    const clams = Array.from(container.querySelectorAll("button")).filter(
      (button) => button.getAttribute("aria-label") === "Closed clam"
    );
    expect(clams.length).toBe(6);
    for (const clam of clams) {
      fireEvent.click(clam);
    }
    await flush();
    expect(container.textContent).toContain("Royal Pearl");
    expect(stars).toEqual([3]);
  });

  it("does not mix secret-zone finds between learners", async () => {
    const zone = SECRET_ZONES[2];
    learner.id = "learner-a";
    const first = render(
      <ToddlerSecretZonePlay zone={zone} onAddStar={() => {}} onLeave={() => {}} />,
    );
    const clams = Array.from(first.container.querySelectorAll("button")).filter(
      (button) => button.getAttribute("aria-label") === "Closed clam",
    );
    for (const clam of clams) fireEvent.click(clam);
    await flush();
    expect(secretZoneIsFound(zone.id)).toBe(true);
    cleanup();

    learner.id = "learner-b";
    expect(secretZoneIsFound(zone.id)).toBe(false);
    const second = render(
      <ToddlerSecretZonePlay zone={zone} onAddStar={() => {}} onLeave={() => {}} />,
    );
    expect(second.container.textContent).toContain("Pearl pouch");
    expect(second.container.textContent).not.toContain("Royal Pearl");
  });
});
