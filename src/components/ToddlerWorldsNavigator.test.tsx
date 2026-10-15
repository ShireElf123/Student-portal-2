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
