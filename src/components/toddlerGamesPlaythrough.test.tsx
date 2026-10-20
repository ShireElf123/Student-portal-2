// @vitest-environment jsdom
/**
 * Toddler games play-through suite.
 *
 * Companion to the Animal Safari / Animal World regression tests: those pinned
 * the games that stuck because progress waited on a speech callback. These
 * drive the remaining toddler games the way a child does — play them to a
 * finish and start again — under the harshest speech condition (an engine that
 * is muted or never reports the end of an utterance), so no game can silently
 * become a dead end.
 */
import React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render, fireEvent, cleanup, act } from "@testing-library/react";

const speech = vi.hoisted(() => ({ spoken: [] as string[], reportEnd: { value: false } }));

vi.mock("../utils/speechUtils", () => ({
  speakText: (text: string, options?: { onEnd?: () => void }) => {
    speech.spoken.push(text);
    if (speech.reportEnd.value && options?.onEnd) setTimeout(() => options.onEnd?.(), 0);
    return true;
  },
  stopSpeaking: () => {},
  isVoiceMuted: () => false,
  setVoiceMuted: () => {},
  speechCoordinator: { subscribe: () => () => {} },
}));
vi.mock("canvas-confetti", () => ({ default: () => {} }));

// jsdom has no animation engine: framer-motion leaves popped elements in the DOM
// mid exit-fade under fake timers. Rendering the same elements as plain DOM keeps
// what the child sees (which elements exist) honest.
vi.mock("motion/react", async () => {
  const React = await import("react");
  const animationOnly = new Set([
    "initial", "animate", "exit", "transition", "variants", "whileHover", "whileTap",
    "whileInView", "whileFocus", "whileDrag", "layout", "layoutId", "viewport",
    "drag", "dragConstraints", "onAnimationComplete", "custom", "onHoverStart", "onHoverEnd",
  ]);
  const clean = (props: Record<string, unknown>) =>
    Object.fromEntries(Object.entries(props).filter(([key]) => !animationOnly.has(key)));
  // One component type per tag: handing React a fresh type on every access
  // would remount the whole subtree on each render and reset game state.
  const types = new Map<string, React.ComponentType<Record<string, unknown>>>();
  const motion = new Proxy(
    {},
    {
      get: (_target, tag: string) => {
        if (!types.has(tag)) {
          types.set(
            tag,
            React.forwardRef((props: Record<string, unknown>, ref) =>
              React.createElement(tag, { ...clean(props), ref })
            )
          );
        }
        return types.get(tag);
      },
    }
  );
  return {
    motion,
    AnimatePresence: ({ children }: { children: React.ReactNode }) =>
      React.createElement(React.Fragment, null, children),
  };
});
vi.mock("../utils/learnerBrain", () => ({
  getActiveLearnerId: () => "test-learner",
  recordLearningEvent: () => {},
}));

import { ToddlerMemoryGame } from "./ToddlerMemoryGame";
import { ToddlerRhymeGame } from "./ToddlerRhymeGame";
import { ToddlerBalloonSky } from "./ToddlerBalloonSky";
import { ToddlerQuizzesAndGames } from "./ToddlerQuizzesAndGames";
import { ToddlerColorLab } from "./ToddlerColorLab";
import { ToddlerMusicPiano } from "./ToddlerMusicPiano";
import { ToddlerBubblePopGame } from "./ToddlerBubblePopGame";
import { ToddlerK1Studio } from "./ToddlerK1Studio";

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

const buttonsWith = (container: HTMLElement, needle: string) =>
  Array.from(container.querySelectorAll("button")).filter((button) =>
    button.textContent?.includes(needle)
  ) as HTMLButtonElement[];

beforeEach(() => {
  // jsdom has no canvas painting or ResizeObserver; the games only draw.
  vi.stubGlobal(
    "ResizeObserver",
    class {
      observe() {}
      unobserve() {}
      disconnect() {}
    }
  );
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(null as never);
  vi.useFakeTimers();
  speech.spoken.length = 0;
  speech.reportEnd.value = false; // muted voice / stalled utterance
  localStorage.clear();
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe("Memory Match", () => {
  const cards = (container: HTMLElement) =>
    Array.from(container.querySelectorAll("button")).filter((button) =>
      button.className.includes("aspect-square")
    ) as HTMLButtonElement[];

  it("matches pairs, wins, and can be replayed", async () => {
    const stars: number[] = [];
    const { container } = render(<ToddlerMemoryGame onAddStar={(amount) => stars.push(amount ?? 1)} />);
    await flush(400);

    const counter = () => Number(container.textContent?.match(/(\d+)\/6 Pairs/)?.[1] ?? -1);
    const faceUp = (card: HTMLButtonElement) => !card.textContent?.includes("Tap");

    // Turn cards over the way a child does: hold one card up, then try partners
    // one at a time. Every card must be clickable again after a wrong turn, so a
    // child cannot get stuck — that is the property under test.
    for (let pair = 0; pair < 6; pair++) {
      const open = () => cards(container).filter((card) => !card.disabled);
      const before = counter();
      const first = open()[0];
      fireEvent.click(first);
      await flush(50);
      expect(faceUp(first)).toBe(true);

      for (const candidate of open().slice(1)) {
        if (!faceUp(first)) {
          // the previous wrong turn already flipped it back
          fireEvent.click(first);
          await flush(50);
        }
        fireEvent.click(candidate);
        await flush(1300);
        if (counter() > before) break;
      }
      expect(counter()).toBe(before + 1);
    }
    await flush(2500);

    expect(container.textContent).toContain("Super Memory Champion");
    // 1 star per pair + 3 for the win.
    expect(stars.reduce((total, value) => total + value, 0)).toBe(6 + 3);

    const playAgain = buttonsWith(container, "Play Again")[0];
    fireEvent.click(playAgain);
    await flush(600);
    expect(container.textContent).toContain("0/6 Pairs");
  });
});

describe("Rhyme Time", () => {
  it("finishes every question and can be replayed", async () => {
    const stars: number[] = [];
    const { container } = render(<ToddlerRhymeGame onAddStar={(amount) => stars.push(amount ?? 1)} />);
    await flush(400);

    // Answer each question by trying its options in turn; a wrong tap only
    // bounces back and stays on the same question, so a child always has a way
    // forward. 16 questions, then the celebration screen.
    let answered = 0;
    for (let question = 0; question < 25; question++) {
      if (container.textContent?.includes("Play Again")) break;
      const before = container.textContent?.match(/Which friend below rhymes with (\w+)/)?.[1];
      expect(before).toBeTruthy();
      const options = Array.from(container.querySelectorAll("button")).filter(
        (button) => !/Listen|Restart|Sound|Mute|Back/i.test(button.textContent ?? "")
      );
      expect(options.length).toBeGreaterThan(1);
      for (const option of options) {
        fireEvent.click(option);
        await flush(1700);
        const after = container.textContent?.match(/Which friend below rhymes with (\w+)/)?.[1];
        if (after !== before || container.textContent?.includes("Play Again")) break;
      }
      if (container.textContent?.includes("Play Again")) break;
      expect(container.textContent?.match(/Which friend below rhymes with (\w+)/)?.[1]).not.toBe(before);
      answered++;
    }

    expect(answered).toBeGreaterThanOrEqual(15);
    expect(container.textContent).toContain("You completed all rhyming challenges");

    fireEvent.click(buttonsWith(container, "Play Again")[0]);
    await flush(400);
    expect(container.textContent).not.toContain("You completed all rhyming challenges");
    expect(stars.length).toBeGreaterThan(0);
  });
});

describe("Balloon Sky Carnival", () => {
  it("spawns balloons, pops the target and keeps refilling the sky", async () => {
    const stars: number[] = [];
    const { container } = render(<ToddlerBalloonSky onAddStar={(amount) => stars.push(amount ?? 1)} />);
    await flush(2500);

    const balloons = () =>
      Array.from(container.querySelectorAll("button")).filter((button) =>
        /^[A-Z0-9]$/.test(button.textContent?.trim() ?? "")
      ) as HTMLButtonElement[];

    expect(balloons().length).toBeGreaterThan(0);
    const target = container.textContent?.match(/Target Balloon:\s*(\w)/)?.[1];
    expect(target).toBeTruthy();

    const targetBalloon = balloons().find((balloon) => balloon.textContent?.trim() === target);
    expect(targetBalloon).toBeTruthy();
    fireEvent.click(targetBalloon as HTMLButtonElement);
    await flush(500);

    expect(container.textContent).toMatch(/Target pops today: 1\/10/);
    expect(stars).toContain(1);

    // The sky keeps refilling, so a child can always carry on playing.
    await flush(9000);
    expect(balloons().length).toBeGreaterThan(0);
  });
});

describe("Feed Benny Bunny", () => {
  it("counts five carrots, celebrates, and cannot be overfed for extra stars", async () => {
    const stars: number[] = [];
    const { container } = render(
      <ToddlerQuizzesAndGames starsCount={0} onAddStar={(amount) => stars.push(amount ?? 1)} targetActivity="feed-animal" />
    );
    await flush(400);

    const carrotButton = () => buttonsWith(container, "Tap to Feed a Carrot")[0];
    for (let carrot = 0; carrot < 5; carrot++) {
      const button = carrotButton();
      expect(button).toBeTruthy();
      fireEvent.click(button);
      await flush(300);
    }
    await flush(600);

    expect(container.textContent).toContain("5 of 5 Carrots");
    expect(container.textContent).toContain("Feed Bunny Again");
    // 1 star per carrot + 3 for finishing.
    expect(stars.reduce((total, value) => total + value, 0)).toBe(8);

    // The feeding button is gone, so the reward cannot be farmed.
    expect(carrotButton()).toBeUndefined();

    fireEvent.click(buttonsWith(container, "Feed Bunny Again")[0]);
    await flush(300);
    expect(container.textContent).toContain("0 of 8 Carrots");
    expect(carrotButton()).toBeTruthy();
  });
});

describe("Open-ended toddler games", () => {
  const poppable = (container: HTMLElement) =>
    Array.from(container.querySelectorAll("button")).filter(
      (button) => button.className.includes("rounded-full") && /[A-Z]/.test(button.textContent ?? "")
    ) as HTMLButtonElement[];

  // The HUD prints "Popped:" and the number in separate spans, with no space.
  const popped = (container: HTMLElement) =>
    Number(container.textContent?.match(/Popped:\s*(\d+)/)?.[1] ?? -1);

  const pianoKeys = (container: HTMLElement) =>
    Array.from(container.querySelectorAll("button")).filter(
      (button) => button.className.includes("flex-1") && button.className.includes("rounded-2xl")
    ) as HTMLButtonElement[];

  it("Color Lab always reaches a finished mix and can start the next one", async () => {
    const stars: number[] = [];
    const { container } = render(<ToddlerColorLab onAddStar={(amount) => stars.push(amount ?? 1)} />);
    await flush(200);

    expect(container.textContent).toContain("Tap your first colour below");
    fireEvent.click(buttonsWith(container, "Ruby Red")[0]);
    await flush(50);
    expect(container.textContent).toContain("Now tap a second colour to mix!");

    fireEvent.click(buttonsWith(container, "Sunny Yellow")[0]);
    // The mix resolves on a timer, not on a speech callback.
    await flush(3000);
    expect(container.textContent).toContain("Magical Orange!");
    expect(stars.reduce((total, value) => total + value, 0)).toBe(1);

    fireEvent.click(buttonsWith(container, "Mix Another Color")[0]);
    await flush(200);
    expect(container.textContent).toContain("Tap your first colour below");
  });

  it("Music Piano plays a whole guided song from the glowing keys", async () => {
    const stars: number[] = [];
    const { container } = render(<ToddlerMusicPiano onAddStar={(amount) => stars.push(amount ?? 1)} />);
    await flush(300);

    fireEvent.click(buttonsWith(container, "Mary Had a Little Lamb")[0]);
    await flush(100);
    expect(container.textContent).toContain("Song Progress: Note 1 of 7");

    // The next note is always highlighted, so a child is never left guessing.
    for (let note = 0; note < 7; note++) {
      const glowing = pianoKeys(container).find((key) => key.className.includes("ring-4"));
      expect(glowing).toBeTruthy();
      fireEvent.click(glowing as HTMLButtonElement);
      await flush(300);
    }

    expect(container.textContent).toContain("Song Progress: Completed!");
    expect(stars.reduce((total, value) => total + value, 0)).toBe(2);

    // A wrong key does not undo progress, and another song can be started.
    fireEvent.click(buttonsWith(container, "Row Row Row Your Boat")[0]);
    await flush(100);
    expect(container.textContent).toContain("Song Progress: Note 1 of 20");
  });

  it("Bubble Pop pops the whole wave and refills the sky by itself", async () => {
    const { container } = render(<ToddlerBubblePopGame />);
    await flush(300);

    expect(container.textContent).toContain("Bubble Pop Phonics");
    expect(popped(container)).toBe(0);
    expect(poppable(container).length).toBe(6);

    fireEvent.click(poppable(container)[0]);
    await flush(50);
    expect(popped(container)).toBe(1);
    expect(poppable(container).length).toBe(5);

    // A child who pops every bubble must never be left staring at an empty sky:
    // the game refills the wave on its own, with no tap needed.
    while (poppable(container).length > 0) {
      fireEvent.click(poppable(container)[0]);
      await flush(50);
    }
    expect(popped(container)).toBe(6);

    await flush(600);
    expect(poppable(container).length).toBe(6);

    // …and the fresh wave is playable.
    fireEvent.click(poppable(container)[0]);
    await flush(50);
    expect(popped(container)).toBe(7);
  });
});

describe("K–1 skill studio (curated, AI off)", () => {
  it("Picnic Plus scores five put-together/take-away rounds and can replay", async () => {
    const { container, getByText } = render(<ToddlerK1Studio gameId="picnic-plus" />);
    await flush(250);

    expect(container.textContent).toContain("Picnic Plus");

    const playCorrect = async (label: string) => {
      fireEvent.click(getByText(label));
      await flush(800);
    };

    await playCorrect("5 berries");
    await playCorrect("8 pretzels");
    await playCorrect("4 grapes");
    await playCorrect("0 cookies");
    await playCorrect("7 sandwiches");
    await playCorrect("5 apples");
    await playCorrect("8 muffins");
    await playCorrect("6 cups");
    await playCorrect("5 plums");
    await playCorrect("10 crackers");

    expect(container.textContent).toContain("You did it!");
    fireEvent.click(getByText("Play Picnic Plus again"));
    await flush(250);
    expect(container.textContent).toContain("3 berries");
  });

  it("Bead Train asks for the next bead, not a random quiz", async () => {
    const { container, getByText } = render(<ToddlerK1Studio gameId="bead-train" />);
    await flush(250);
    expect(container.textContent).toContain("Bead Train");
    expect(container.textContent).toContain("🔴 🔵 🔴 🔵 🔴");
    fireEvent.click(getByText("Blue bead"));
    await flush(800);
    expect(container.textContent).toContain("☀️ ☀️ 🌙");
  });
});
