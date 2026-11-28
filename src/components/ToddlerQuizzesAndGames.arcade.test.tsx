// @vitest-environment jsdom
import React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render } from "@testing-library/react";
import { K1_STUDIO_GAMES } from "../data/toddler/k1StudioGames";
import { K1_STUDIO_ART, TODDLER_ARCADE_GAMES } from "../data/toddler/toddlerArcadeCatalog";

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

import { ToddlerQuizzesAndGames } from "./ToddlerQuizzesAndGames";

afterEach(() => cleanup());

describe("Games arcade selection", () => {
  it("shows illustrated arcade cards and does not open a game automatically", () => {
    const { getByTestId, getByText, queryByTestId, queryByText } = render(
      <ToddlerQuizzesAndGames starsCount={0} onAddStar={() => undefined} isMeadow hideChrome />,
    );
    expect(getByTestId("wonder-arcade-board")).toBeTruthy();
    for (const game of TODDLER_ARCADE_GAMES) {
      expect(getByTestId(`arcade-game-${game.id}`)).toBeTruthy();
      expect(getByText(game.title)).toBeTruthy();
    }
    expect(getByText("Skill studio")).toBeTruthy();
    expect(getByText(K1_STUDIO_GAMES[0].title)).toBeTruthy();
    expect(queryByTestId("arcade-more-games")).toBeNull();
    expect(queryByText("Song Progress")).toBeNull();
    expect(queryByText("Tap to Feed a Carrot")).toBeNull();
  });

  it("opens a selected game and returns to the arcade", () => {
    const { getByTestId, queryByTestId, getByText } = render(
      <ToddlerQuizzesAndGames starsCount={0} onAddStar={() => undefined} isMeadow hideChrome />,
    );
    fireEvent.click(getByTestId("arcade-game-rainbow-piano"));
    expect(queryByTestId("wonder-arcade-board")).toBeNull();
    expect(getByTestId("arcade-more-games")).toBeTruthy();
    expect(getByText("Rainbow Music Chimes")).toBeTruthy();
    fireEvent.click(getByTestId("arcade-more-games"));
    expect(getByTestId("wonder-arcade-board")).toBeTruthy();
    expect(getByTestId("arcade-game-animal-safari")).toBeTruthy();
  });

  it("keeps every arcade and studio id selectable", () => {
    const { getByTestId } = render(
      <ToddlerQuizzesAndGames starsCount={0} onAddStar={() => undefined} isMeadow hideChrome />,
    );
    expect(TODDLER_ARCADE_GAMES.map((game) => game.id)).toEqual([
      "rainbow-piano",
      "animal-safari",
      "balloon-sky",
      "animal-quiz",
      "shape-match",
      "memory-match",
      "rhyme-time",
      "color-magic",
      "bubble-pop",
      "bubble-pop-phonics",
      "feed-animal",
    ]);
    for (const game of K1_STUDIO_GAMES) {
      expect(getByTestId(`arcade-game-${game.id}`)).toBeTruthy();
    }
  });

  it("uses unique /games arcade art, not Worlds or Stories covers", () => {
    for (const game of TODDLER_ARCADE_GAMES) {
      expect(game.art.startsWith("/games/arcade-")).toBe(true);
    }
    const uniqueStudio = [
      "ten-frame-taxi",
      "blend-kitchen",
      "bead-train",
      "picnic-plus",
      "weather-porch",
      "laundry-sort",
      "story-porch",
      "sock-drawer",
      "farm-count",
    ];
    for (const id of uniqueStudio) {
      expect(K1_STUDIO_ART[id as keyof typeof K1_STUDIO_ART].startsWith("/games/arcade-")).toBe(true);
    }
  });

  it("opens a deep-linked game without showing the arcade first", () => {
    const { queryByTestId, getByTestId } = render(
      <ToddlerQuizzesAndGames
        starsCount={0}
        onAddStar={() => undefined}
        targetActivity="feed-animal"
        isMeadow
        hideChrome
      />,
    );
    expect(queryByTestId("wonder-arcade-board")).toBeNull();
    expect(getByTestId("arcade-more-games")).toBeTruthy();
  });
});
