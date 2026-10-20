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
  expect(utils.container.textContent).toContain("Tap who it is");
  expect(utils.container.textContent).not.toContain("Beginner");
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
    expect(container.textContent).toContain("You did it!");
    expect(container.textContent).not.toContain("Beginner");
    expect(container.textContent).not.toContain("Observe the clues");
  });

  it("still celebrates a correct answer when the engine never reports the end", async () => {
    speech.reportEnd.value = false;
    const { container } = await startActivity();

    fireEvent.click(optionButton(container, "Spotted Cow"));
    await flush(200);

    // The freeze: answer accepted, cards locked, no way forward yet.
    expect(optionButton(container, "Spotted Cow").disabled).toBe(true);
    expect(container.textContent).not.toContain("You did it!");

    // The watchdog releases the reveal without any further tap.
    await flush(20000);
    expect(container.textContent).toContain("You did it!");

    // And the child can carry on playing.
    fireEvent.click(container.querySelector("[data-testid=trail-next]") as HTMLButtonElement);
    await flush(200);
    expect(container.textContent).toContain("Farm Valley");
    expect(container.textContent).not.toContain("You did it!");
  });

  it("coaches a wrong answer without locking the activity", async () => {
    const { container } = await startActivity();

    fireEvent.click(optionButton(container, "Pink Piggy"));
    await flush(2000);

    expect(speech.spoken.at(-1)).toContain("That is Pink Piggy!");
    expect(container.textContent).not.toContain("You did it!");
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
    expect(container.textContent).toContain("Count 1 to 5");

    await answerCorrectly(container);
    await flush(2000);

    expect(container.textContent).toContain("You did it!");
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
    expect(container.textContent).not.toContain("You did it!");

    await flush(20000);
    expect(container.textContent).toContain("You did it!");
  });
});

/** Packed extra on the Farm Valley trail — not one of the original four demo cards. */
const FARM_DAWN_ROUTE = "world:animal-world:farm-valley:act-farm-rooster-dawn";

describe("wonderland atlas", () => {
  it("opens as a map of many lands, not six demo cards", async () => {
    const { container } = render(
      <ToddlerWorldsNavigator onAddStar={() => {}} starsCount={0} />
    );
    await flush(200);
    expect(container.textContent).toContain("Wonderland Atlas");
    expect(container.textContent).toContain("The Wilds");
    expect(container.textContent).toContain("Busy Town");
    expect(container.textContent).toContain("Busy Roads");
    expect(container.textContent).toContain("Bug Garden");
    expect(container.textContent).toContain("Market Kitchen");
    expect(container.textContent).toContain("Town Square");
    expect(container.textContent).toContain("Ice Neighbours");
    expect(container.textContent).toContain("Night Neighbourhood");
    expect(container.textContent).toContain("Animal World");
  });
});

describe("world level trail stations", () => {
  it("plays a packed farm station on the same detective contract", async () => {
    const { container } = render(
      <ToddlerWorldsNavigator onAddStar={() => {}} starsCount={0} initialWorldId={FARM_DAWN_ROUTE} />
    );
    await flush(500);
    expect(container.textContent).toContain("Dawn Rooster");

    fireEvent.click(optionButton(container, "Rooster"));
    await flush(2000);
    expect(container.textContent).toContain("You did it!");

    fireEvent.click(container.querySelector("[data-testid=trail-next]") as HTMLButtonElement);
    await flush(200);
    expect(container.textContent).toContain("Farm Valley");
  });

  it("plays a planted toy without the quiz overlay", async () => {
    const { container } = render(
      <ToddlerWorldsNavigator
        onAddStar={() => {}}
        starsCount={0}
        initialWorldId="world:animal-world:farm-valley:act-farm-safari-walk"
      />
    );
    await flush(500);
    expect(container.textContent).toContain("Pasture Safari");
    expect(container.textContent).not.toContain("Let's play");
    expect(container.textContent).not.toContain("Observe the clues");
  });

  it("plays a planted toy on an atlas ice land", async () => {
    const { container } = render(
      <ToddlerWorldsNavigator
        onAddStar={() => {}}
        starsCount={0}
        initialWorldId="world:arctic-world:ice-floe:act-floe-ice-safari"
      />
    );
    await flush(500);
    expect(container.textContent).toContain("Floe Safari");
    expect(container.textContent).toContain("🐧");
    expect(container.textContent).not.toContain("🦁");
    expect(container.textContent).not.toContain("Let's play");
    expect(container.textContent).not.toContain("Observe the clues");
  });

  it("plays a game on a new atlas land", async () => {
    const { container } = render(
      <ToddlerWorldsNavigator
        onAddStar={() => {}}
        starsCount={0}
        initialWorldId="world:vehicle-world:garage-bay:act-garage-who-bus"
      />
    );
    await flush(500);
    expect(container.textContent).toContain("Who Needs Wheels");
    fireEvent.click(optionButton(container, "The school bus"));
    await flush(2000);
    expect(container.textContent).toContain("You did it!");
  });
});

describe("trail ease", () => {
  it("moves a finished land room onto the next stop after a short beat", async () => {
    const { container, getByTestId } = render(
      <ToddlerWorldsNavigator
        onAddStar={() => {}}
        starsCount={0}
        initialWorldId="world:animal-world:farm-valley:act-land-milk-cow"
      />
    );
    await flush(500);
    expect(container.textContent).toContain("Milk the cow");
    fireEvent.pointerDown(getByTestId("milk-hold"));
    await flush(2500);
    expect(container.textContent).toContain("You did it!");
    expect(container.textContent).toContain("Next:");
    await flush(4000);
    expect(container.textContent).toContain("Pasture Safari");
    expect(container.textContent).not.toContain("You did it!");
  });
});
