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

import { ToddlerLandRooms } from "./ToddlerLandRooms";
import { ALL_TODDLER_WORLDS } from "../data/toddler/toddlerWorldsArchitecture";

const flush = async () => {
  await act(async () => {
    await Promise.resolve();
  });
};

beforeEach(() => {
  cleanup();
  vi.useRealTimers();
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

describe("land rooms", () => {
  it("plants one unique land-play room on every world", () => {
    const rooms = ALL_TODDLER_WORLDS.flatMap((world) =>
      world.areas.flatMap((area) =>
        area.activities
          .filter((activity) => activity.type === "land-play")
          .map((activity) => ({ worldId: world.id, playId: activity.landPlayId, id: activity.id }))
      )
    );
    expect(rooms).toHaveLength(12);
    expect(new Set(rooms.map((room) => room.worldId)).size).toBe(12);
    expect(new Set(rooms.map((room) => room.playId)).size).toBe(12);
    expect(new Set(rooms.map((room) => room.id)).size).toBe(12);
    expect(rooms.every((room) => room.playId)).toBe(true);
  });

  it("fills the farm pail when the child holds to milk", async () => {
    vi.useFakeTimers();
    const stars: number[] = [];
    const { getByTestId, container } = render(
      <ToddlerLandRooms playId="milk-cow" onAddStar={() => stars.push(1)} />
    );
    fireEvent.pointerDown(getByTestId("milk-hold"));
    await act(async () => {
      vi.advanceTimersByTime(2500);
    });
    expect(stars).toEqual([1]);
    expect(container.textContent).toContain("Warm milk");
    fireEvent.pointerDown(getByTestId("milk-hold"));
    await act(async () => {
      vi.advanceTimersByTime(2500);
    });
    expect(stars).toHaveLength(1);
  });

  it("catches six fireflies into the jar once", async () => {
    const stars: number[] = [];
    const { getByTestId, container } = render(
      <ToddlerLandRooms playId="firefly-jar" onAddStar={() => stars.push(1)} />
    );
    for (const id of ["a", "b", "c", "d", "e", "f"]) {
      fireEvent.click(getByTestId(`firefly-${id}`));
    }
    await flush();
    expect(stars).toEqual([1]);
    expect(container.textContent).toContain("tiny stars");
  });

  it("slides the penguin to the fish hole", async () => {
    const stars: number[] = [];
    const { getByTestId } = render(
      <ToddlerLandRooms playId="penguin-slide" onAddStar={() => stars.push(1)} />
    );
    const slope = getByTestId("penguin-slope");
    slope.getBoundingClientRect = () =>
      ({ top: 0, left: 0, bottom: 100, right: 100, width: 100, height: 100, x: 0, y: 0, toJSON: () => {} }) as DOMRect;
    fireEvent.pointerDown(slope, { clientY: 10, pointerId: 1 });
    fireEvent.pointerMove(slope, { clientY: 80, pointerId: 1, buttons: 1 });
    await flush();
    expect(stars).toEqual([1]);
  });

  it("loads four crates, puts out three flames, and stacks five fruits", async () => {
    const stars: number[] = [];
    const truck = render(<ToddlerLandRooms playId="load-truck" onAddStar={() => stars.push(1)} />);
    for (const n of [0, 1, 2, 3]) fireEvent.click(truck.getByTestId(`crate-${n}`));
    await flush();
    truck.unmount();

    const hose = render(<ToddlerLandRooms playId="fire-hose" onAddStar={() => stars.push(1)} />);
    for (const n of [0, 1, 2]) fireEvent.click(hose.getByTestId(`flame-${n}`));
    await flush();
    hose.unmount();

    const stall = render(<ToddlerLandRooms playId="fruit-stack" onAddStar={() => stars.push(1)} />);
    for (const fruit of ["🍎", "🍊", "🍌", "🍇", "🍐"]) fireEvent.click(stall.getByTestId(`fruit-${fruit}`));
    await flush();
    expect(stars).toEqual([1, 1, 1]);
  });

  it("stamps a mural, tells stones in order, and counts pebbles 1 to 5", async () => {
    const stars: number[] = [];
    const mural = render(<ToddlerLandRooms playId="stamp-mural" onAddStar={() => stars.push(1)} />);
    const wall = mural.getByTestId("mural-wall");
    for (let i = 0; i < 6; i += 1) fireEvent.click(wall);
    await flush();
    mural.unmount();

    const stones = render(<ToddlerLandRooms playId="story-stones" onAddStar={() => stars.push(1)} />);
    fireEvent.click(stones.getByTestId("stone-once"));
    fireEvent.click(stones.getByTestId("stone-then"));
    fireEvent.click(stones.getByTestId("stone-end"));
    await flush();
    stones.unmount();

    const pebbles = render(<ToddlerLandRooms playId="number-pebbles" onAddStar={() => stars.push(1)} />);
    fireEvent.click(pebbles.getByTestId("pebble-1"));
    fireEvent.click(pebbles.getByTestId("pebble-2"));
    fireEvent.click(pebbles.getByTestId("pebble-3"));
    fireEvent.click(pebbles.getByTestId("pebble-4"));
    fireEvent.click(pebbles.getByTestId("pebble-5"));
    await flush();
    expect(stars).toEqual([1, 1, 1]);
  });

  it("builds a campfire, makes a feeling, and tucks in at night", async () => {
    const stars: number[] = [];
    const fire = render(<ToddlerLandRooms playId="campfire" onAddStar={() => stars.push(1)} />);
    fireEvent.click(fire.getByTestId("spark"));
    expect(stars).toEqual([]);
    for (let i = 0; i < 4; i += 1) fireEvent.click(fire.getByTestId("add-log"));
    fireEvent.click(fire.getByTestId("spark"));
    await flush();
    fire.unmount();

    const face = render(<ToddlerLandRooms playId="feeling-face" onAddStar={() => stars.push(1)} />);
    fireEvent.click(face.getByTestId("eyes-😊"));
    fireEvent.click(face.getByTestId("mouth-😄"));
    await flush();
    face.unmount();

    const night = render(<ToddlerLandRooms playId="night-tuck" onAddStar={() => stars.push(1)} />);
    fireEvent.click(night.getByTestId("teddy"));
    expect(stars).toHaveLength(2);
    fireEvent.click(night.getByTestId("shutter-0"));
    fireEvent.click(night.getByTestId("shutter-1"));
    fireEvent.click(night.getByTestId("shutter-2"));
    fireEvent.click(night.getByTestId("teddy"));
    await flush();
    expect(stars).toEqual([1, 1, 1]);
  });
});
