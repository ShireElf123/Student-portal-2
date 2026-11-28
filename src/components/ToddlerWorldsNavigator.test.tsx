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
  autoEnd: { value: true },
  pendingEnds: [] as Array<() => void>,
}));

vi.mock("../utils/speechUtils", () => ({
  speakText: (text: string, options?: { onEnd?: () => void }) => {
    speech.spoken.push(text);
    const finish = () => options?.onEnd?.();
    if (!speech.reportEnd.value) return true;
    if (speech.autoEnd.value) {
      setTimeout(finish, 0);
    } else {
      speech.pendingEnds.push(finish);
    }
    return true;
  },
  speakQueuedNarration: (lines: string[], options?: { onEnd?: () => void }) => {
    speech.spoken.push(...lines);
    const finish = () => options?.onEnd?.();
    if (!speech.reportEnd.value) return true;
    if (speech.autoEnd.value) {
      setTimeout(finish, 0);
    } else {
      speech.pendingEnds.push(finish);
    }
    return true;
  },
  stopSpeaking: () => {
    speech.pendingEnds.length = 0;
  },
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

/** Catch the celebration as soon as it appears so trail auto-roll cannot snatch it. */
const waitForText = async (container: HTMLElement, needle: string, step = 400, max = 16000) => {
  for (let elapsed = 0; elapsed < max; elapsed += step) {
    if (container.textContent?.includes(needle)) return;
    await flush(step);
  }
  throw new Error(`never saw "${needle}"`);
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
  expect(utils.container.textContent).toContain("Tap who made the sound");
  expect(utils.container.textContent).not.toContain("Beginner");
  return utils;
};

const releaseSpeechEnds = async () => {
  const ends = speech.pendingEnds.splice(0);
  await act(async () => {
    ends.forEach((end) => end());
    await Promise.resolve();
  });
};

const openAreaHub = async (route: string, backLabel: string) => {
  const utils = render(
    <ToddlerWorldsNavigator onAddStar={() => {}} starsCount={0} initialWorldId={route} />,
  );
  await flush(500);
  const back = Array.from(utils.container.querySelectorAll("button")).find((button) =>
    button.textContent?.includes(backLabel),
  ) as HTMLButtonElement;
  fireEvent.click(back);
  await flush(200);
  return utils;
};

beforeEach(() => {
  cleanup();
  vi.useFakeTimers();
  speech.spoken.length = 0;
  speech.reportEnd.value = true;
  speech.autoEnd.value = true;
  speech.pendingEnds.length = 0;
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
    await waitForText(container, "You did it!");

    // And the child can carry on playing. Next is a skip; auto-roll is later.
    fireEvent.click(container.querySelector("[data-testid=trail-next]") as HTMLButtonElement);
    await flush(200);
    expect(container.textContent).toContain("Farm Valley");
    expect(container.textContent).not.toContain("You did it!");
  });

  it("coaches a wrong answer without locking the activity", async () => {
    const { container } = await startActivity();

    fireEvent.click(optionButton(container, "Pink Piggy"));
    await flush(2000);

    expect(speech.spoken.at(-1)?.toLowerCase()).toContain("piggy");
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

  it("speaks Farm Chicks victory as four finished thoughts before celebrating", async () => {
    const { container } = render(
      <ToddlerWorldsNavigator onAddStar={() => {}} starsCount={0} initialWorldId={FARM_COUNT_ROUTE} />
    );
    await flush(500);
    expect(speech.spoken.some((line) => line.includes("fluffy yellow chicks"))).toBe(true);

    await answerCorrectly(container);
    const hoorayAt = speech.spoken.indexOf("Hooray! That's right!");
    expect(hoorayAt).toBeGreaterThanOrEqual(0);
    expect(speech.spoken.slice(hoorayAt, hoorayAt + 4)).toEqual([
      "Hooray! That's right!",
      expect.stringMatching(/^[1-5]!$/),
      "Farm Chicks!",
      "Cheep!",
    ]);
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

    await waitForText(container, "You did it!");
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

  it("opens a farm story clue as a tap quiz, not an unwired adventure", async () => {
    const { container } = render(
      <ToddlerWorldsNavigator
        onAddStar={() => {}}
        starsCount={0}
        initialWorldId="world:story-world:barnyard-tales:act-story-farm-who-gate"
      />,
    );
    await flush(500);
    expect(container.textContent).toContain("Who Opened the Gate");
    expect(container.textContent).not.toContain("Step 1 of");
    fireEvent.click(optionButton(container, "Pip"));
    await flush(2000);
    expect(container.textContent).toContain("You did it!");
  });

  it("asks the child to tap a sorting home, not put items by dragging", async () => {
    const { container } = render(
      <ToddlerWorldsNavigator
        onAddStar={() => {}}
        starsCount={0}
        initialWorldId="world:animal-world:farm-valley:act-farm-sort-feed"
      />,
    );
    await flush(500);
    expect(container.textContent).toContain("Tap a home for this friend");
    expect(container.textContent).not.toContain("Put matching friends here");
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

describe("worlds mission narration sequencing", () => {
  const FARM_START =
    "Mission started: Barnyard Morning Helper! Step 1: Listen for the Cow. Listen with your ears! Who is chewing sweet clover in the meadow and says Moooo?";
  const FARM_NEXT_KITTEN =
    "Next Mission Step: Find the Kitten! Mother Cat says meow meow! Can you find her tiny baby kitten?";
  const HAPPY_START =
    "Mission started: Warm Heart Explorer! Step 1: Find the Big Happy Smile. Can you tap the friend who is feeling super happy and wearing a big bright smile?";
  const HAPPY_COMPLETE =
    "Congratulations! You completed the entire mission: Warm Heart Explorer! You earned the Sunshine Sprout badge!";

  it("finishes the mission introduction before the first activity narration", async () => {
    const { container } = await openAreaHub(FARM_SOUND_ROUTE, "Back to Farm Valley");
    expect(container.textContent).toContain("Barnyard Morning Helper");

    speech.spoken.length = 0;
    speech.autoEnd.value = false;
    fireEvent.click(optionButton(container, "Barnyard Morning Helper"));
    await flush(50);

    expect(speech.spoken).toEqual([FARM_START]);
    expect(container.textContent).toContain("Barnyard Morning Helper");
    expect(container.textContent).toContain("Back to Animal World Map");
    expect(container.textContent).not.toContain("Tap who made the sound");
    expect(container.textContent).not.toContain("Mission Step");

    speech.autoEnd.value = true;
    await releaseSpeechEnds();
    await flush(400);

    expect(container.textContent).toContain("The Grassy Pasture Sound");
    expect(container.textContent).toContain("Tap who made the sound");
    expect(container.textContent).toContain("Mission Step 1 of");
    expect(speech.spoken[0]).toBe(FARM_START);
    expect(speech.spoken.slice(1).some((line) => line.includes("Listen with your ears"))).toBe(true);
  });

  it("finishes the next-step introduction before the next activity narration", async () => {
    const { container } = await openAreaHub(FARM_SOUND_ROUTE, "Back to Farm Valley");
    fireEvent.click(optionButton(container, "Barnyard Morning Helper"));
    await flush(400);
    expect(container.textContent).toContain("The Grassy Pasture Sound");

    fireEvent.click(optionButton(container, "Spotted Cow"));
    await flush(2000);
    expect(container.textContent).toContain("You did it!");

    speech.spoken.length = 0;
    speech.autoEnd.value = false;
    fireEvent.click(container.querySelector("[data-testid=trail-next]") as HTMLButtonElement);
    await flush(50);

    expect(speech.spoken).toEqual([FARM_NEXT_KITTEN]);
    expect(container.textContent).toContain("You did it!");
    expect(container.textContent).not.toContain("Mother Cat's Tiny Baby");

    speech.autoEnd.value = true;
    await releaseSpeechEnds();
    await flush(400);

    expect(container.textContent).toContain("Mother Cat's Tiny Baby");
    expect(speech.spoken[0]).toBe(FARM_NEXT_KITTEN);
    expect(speech.spoken.slice(1).some((line) => line.includes("tiny baby kitten"))).toBe(true);
  });

  it("finishes the completion announcement before returning to the area hub", async () => {
    const { container } = await openAreaHub(
      "world:my-world:feelings-emotions:act-feelings-happy-smile",
      "Back to Feelings & Emotions",
    );
    fireEvent.click(optionButton(container, "Warm Heart Explorer"));
    await flush(400);
    expect(container.textContent).toContain("Happy & Smiling Face");

    fireEvent.click(optionButton(container, "Happy Smile"));
    await flush(2000);
    expect(container.textContent).toContain("You did it!");

    speech.spoken.length = 0;
    speech.autoEnd.value = false;
    fireEvent.click(container.querySelector("[data-testid=trail-next]") as HTMLButtonElement);
    await flush(50);

    expect(speech.spoken).toEqual([HAPPY_COMPLETE]);
    expect(container.textContent).toContain("You did it!");
    expect(container.textContent).toContain("Happy & Smiling Face");
    expect(container.textContent).not.toContain("Replay Warm Heart Explorer");

    speech.autoEnd.value = true;
    await releaseSpeechEnds();
    await flush(400);

    expect(container.textContent).toContain("Feelings & Emotions");
    expect(container.textContent).toContain("Replay Warm Heart Explorer");
    expect(container.textContent).not.toContain("You did it!");
    expect(container.textContent).not.toContain("Tap who made the sound");
  });

  it("still starts the first activity if the wrap callback never arrives", async () => {
    const { container } = await openAreaHub(FARM_SOUND_ROUTE, "Back to Farm Valley");
    speech.spoken.length = 0;
    speech.reportEnd.value = false;
    fireEvent.click(optionButton(container, "Barnyard Morning Helper"));
    await flush(200);
    expect(container.textContent).not.toContain("Tap who made the sound");

    await flush(20000);
    expect(container.textContent).toContain("Tap who made the sound");
    expect(container.textContent).toContain("The Grassy Pasture Sound");
  });
});
