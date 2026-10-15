// @vitest-environment jsdom
/**
 * Animal World detective activities (the "Safari Sound Detective" missions).
 *
 * A correct answer used to unlock the celebration only from the speech
 * engine's end-of-utterance callback. When that callback never arrives the
 * activity stayed on screen with its answer cards disabled, so the child had
 * to leave and re-enter the activity. These tests drive the real activity and
 * require the celebration to arrive either way.
 */
import React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render, fireEvent, cleanup, act } from "@testing-library/react";

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

import { ToddlerWorldsNavigator } from "./ToddlerWorldsNavigator";

/** Farm Valley → "The Grassy Pasture Sound" (sound-detective, correct = cow). */
const FARM_SOUND_ROUTE = "world:animal-world:farm-valley:act-farm-sound-cow";

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

const optionButton = (container: HTMLElement, label: string) =>
  Array.from(container.querySelectorAll("button")).find((button) =>
    button.textContent?.includes(label)
  ) as HTMLButtonElement;

const startActivity = async () => {
  const utils = render(
    <ToddlerWorldsNavigator onAddStar={() => {}} starsCount={0} initialWorldId={FARM_SOUND_ROUTE} />
  );
  await flush(500);
  expect(utils.container.textContent).toContain("The Grassy Pasture Sound");
  return utils;
};

beforeEach(() => {
  cleanup();
  vi.useFakeTimers();
  speech.spoken.length = 0;
  speech.reportEnd.value = true;
  localStorage.clear();
});

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe("Animal World detective activity", () => {
  it("celebrates a correct answer when the speech engine reports the end", async () => {
    const { container } = await startActivity();

    fireEvent.click(optionButton(container, "Spotted Cow"));
    await flush(2000);

    expect(speech.spoken.some((line) => line.includes("friendly dairy cow"))).toBe(true);
    expect(container.textContent).toContain("Discovery Mastered!");
  });

  it("still celebrates a correct answer when the engine never reports the end", async () => {
    speech.reportEnd.value = false;
    const { container } = await startActivity();

    fireEvent.click(optionButton(container, "Spotted Cow"));
    await flush(200);

    // The freeze: answer accepted, cards locked, no way forward yet.
    expect(optionButton(container, "Spotted Cow").disabled).toBe(true);
    expect(container.textContent).not.toContain("Discovery Mastered!");

    // The watchdog releases the reveal without any further tap.
    await flush(20000);
    expect(container.textContent).toContain("Discovery Mastered!");

    // And the child can carry on playing.
    fireEvent.click(optionButton(container, "Continue Journey"));
    await flush(200);
    expect(container.textContent).toContain("Farm Valley");
    expect(container.textContent).not.toContain("Discovery Mastered!");
  });

  it("coaches a wrong answer without locking the activity", async () => {
    const { container } = await startActivity();

    fireEvent.click(optionButton(container, "Pink Piggy"));
    await flush(2000);

    expect(speech.spoken.at(-1)).toContain("That is Pink Piggy!");
    expect(container.textContent).not.toContain("Discovery Mastered!");
    expect(optionButton(container, "Spotted Cow").disabled).toBe(false);
  });
});

/** Farm Valley → "Count the Yellow Chicks" (counting, answer paid on success). */
const FARM_COUNT_ROUTE = "world:animal-world:farm-valley:act-farm-count-chicks";

describe("Animal World counting activity", () => {
  /** Number answer buttons are labelled like "3🦆 Rubber". */
  const numberButtons = (container: HTMLElement) =>
    Array.from(container.querySelectorAll("button")).filter((button) =>
      /^\d/.test(button.textContent?.trim() ?? "")
    );

  /** Taps the number buttons (re-querying each time) until one is accepted. */
  const answerCorrectly = async (container: HTMLElement) => {
    // Wrong taps are non-punitive and simply reset, so trying each number in
    // turn is safe and removes any dependency on the randomised scenario.
    for (let attempt = 0; attempt < 4; attempt++) {
      const buttons = numberButtons(container);
      if (buttons.length === 0) break;
      fireEvent.click(buttons[attempt % buttons.length]);
      await flush(50);
      if (speech.spoken.some((line) => line.startsWith("Hooray! That's right"))) return;
      await flush(1500);
    }
    throw new Error("no counting answer was accepted");
  };

  it("reveals the celebration when the engine reports the end", async () => {
    const { container } = render(
      <ToddlerWorldsNavigator onAddStar={() => {}} starsCount={0} initialWorldId={FARM_COUNT_ROUTE} />
    );
    await flush(500);
    expect(container.textContent).toContain("Counting Quest");

    await answerCorrectly(container);
    await flush(2000);

    expect(container.textContent).toContain("Discovery Mastered!");
  });

  it("still reveals the celebration when the engine never reports the end", async () => {
    // The freeze class fixed in Animal Safari: the answer is accepted, the
    // number buttons lock, and nothing else happens until the child leaves.
    speech.reportEnd.value = false;
    const { container } = render(
      <ToddlerWorldsNavigator onAddStar={() => {}} starsCount={0} initialWorldId={FARM_COUNT_ROUTE} />
    );
    await flush(500);

    await answerCorrectly(container);
    await flush(200);
    expect(container.textContent).not.toContain("Discovery Mastered!");

    await flush(20000);
    expect(container.textContent).toContain("Discovery Mastered!");
  });
});
