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

const box = () =>
  ({ top: 0, left: 0, bottom: 100, right: 100, width: 100, height: 100, x: 0, y: 0, toJSON: () => {} }) as DOMRect;

const dragOnto = (from: HTMLElement, target: HTMLElement) => {
  target.getBoundingClientRect = box;
  fireEvent.pointerDown(from, { clientX: 10, clientY: 10, pointerId: 1 });
  fireEvent.pointerMove(from, { clientX: 50, clientY: 50, pointerId: 1, buttons: 1 });
  fireEvent.pointerUp(from, { clientX: 50, clientY: 50, pointerId: 1 });
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
  it("plants unique land-play rooms on every world, and extra districts on thin lands", () => {
    const rooms = ALL_TODDLER_WORLDS.flatMap((world) =>
      world.areas.flatMap((area) =>
        area.activities
          .filter((activity) => activity.type === "land-play")
          .map((activity) => ({ worldId: world.id, playId: activity.landPlayId, id: activity.id }))
      )
    );
    expect(rooms.length).toBeGreaterThanOrEqual(24);
    expect(new Set(rooms.map((room) => room.worldId)).size).toBe(12);
    expect(new Set(rooms.map((room) => room.playId)).size).toBe(rooms.length);
    expect(new Set(rooms.map((room) => room.id)).size).toBe(rooms.length);
    expect(rooms.every((room) => room.playId)).toBe(true);
    for (const worldId of ["story-world", "learning-world", "my-world"]) {
      const world = ALL_TODDLER_WORLDS.find((item) => item.id === worldId);
      expect(world?.areas.length).toBeGreaterThanOrEqual(4);
      expect(world?.areas.every((area) => area.activities.length >= 8)).toBe(true);
    }
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
    const bed = truck.getByTestId("truck-bed");
    for (const n of [0, 1, 2, 3]) dragOnto(truck.getByTestId(`crate-${n}`), bed);
    await flush();
    truck.unmount();

    const hose = render(<ToddlerLandRooms playId="fire-hose" onAddStar={() => stars.push(1)} />);
    for (const n of [0, 1, 2]) hose.getByTestId(`flame-${n}`).getBoundingClientRect = box;
    const nozzle = hose.getByTestId("hose");
    fireEvent.pointerDown(nozzle, { clientX: 50, clientY: 50, pointerId: 1 });
    fireEvent.pointerMove(nozzle, { clientX: 50, clientY: 50, pointerId: 1, buttons: 1 });
    fireEvent.pointerUp(nozzle, { clientX: 50, clientY: 50, pointerId: 1 });
    await flush();
    hose.unmount();

    const stall = render(<ToddlerLandRooms playId="fruit-stack" onAddStar={() => stars.push(1)} />);
    const plate = stall.getByTestId("fruit-plate");
    for (const fruit of ["🍎", "🍊", "🍌", "🍇", "🍐"]) dragOnto(stall.getByTestId(`fruit-${fruit}`), plate);
    await flush();
    expect(stars).toEqual([1, 1, 1]);
  });

  it("stamps a mural, tells stones in order, and counts pebbles 1 to 10", async () => {
    const stars: number[] = [];
    const mural = render(<ToddlerLandRooms playId="stamp-mural" onAddStar={() => stars.push(1)} />);
    const wall = mural.getByTestId("mural-wall");
    const stamp = mural.getByTestId("stamp-sun");
    for (let i = 0; i < 6; i += 1) dragOnto(stamp, wall);
    await flush();
    mural.unmount();

    const stones = render(<ToddlerLandRooms playId="story-stones" onAddStar={() => stars.push(1)} />);
    for (const id of ["once", "then", "end", "friend", "gift", "owl", "blanket", "sleep"]) {
      fireEvent.click(stones.getByTestId(`stone-${id}`));
    }
    await flush();
    stones.unmount();

    const pebbles = render(<ToddlerLandRooms playId="number-pebbles" onAddStar={() => stars.push(1)} />);
    for (let n = 1; n <= 10; n += 1) fireEvent.click(pebbles.getByTestId(`pebble-${n}`));
    await flush();
    expect(stars).toEqual([1, 1, 1]);
  });

  it("builds a campfire, makes a feeling, and tucks in at night", async () => {
    const stars: number[] = [];
    const fire = render(<ToddlerLandRooms playId="campfire" onAddStar={() => stars.push(1)} />);
    fireEvent.click(fire.getByTestId("spark"));
    expect(stars).toEqual([]);
    const pit = fire.getByTestId("fire-pit");
    for (let i = 0; i < 4; i += 1) dragOnto(fire.getByTestId(`log-${i}`), pit);
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

  it("swings the vine, fills ten dots, and bows three puppets", async () => {
    const stars: number[] = [];
    vi.useFakeTimers();
    const vine = render(<ToddlerLandRooms playId="vine-swing" onAddStar={() => stars.push(1)} />);
    fireEvent.pointerDown(vine.getByTestId("vine"));
    await act(async () => {
      vi.advanceTimersByTime(2500);
    });
    vine.unmount();
    vi.useRealTimers();

    const dots = render(<ToddlerLandRooms playId="ten-dots" onAddStar={() => stars.push(1)} />);
    const frame = dots.getByTestId("ten-frame");
    for (let i = 0; i < 10; i += 1) dragOnto(dots.getByTestId(`counter-${i}`), frame);
    await flush();
    dots.unmount();

    const puppets = render(<ToddlerLandRooms playId="puppet-bow" onAddStar={() => stars.push(1)} />);
    for (const n of [0, 1, 2]) {
      const puppet = puppets.getByTestId(`puppet-${n}`);
      fireEvent.pointerDown(puppet, { clientY: 10, pointerId: 1 });
      fireEvent.pointerMove(puppet, { clientY: 80, pointerId: 1, buttons: 1 });
    }
    await flush();
    expect(stars).toEqual([1, 1, 1]);
  });

  it("stars the rocket by dragging, then holds to launch", async () => {
    vi.useFakeTimers();
    const stars: number[] = [];
    const { getByTestId } = render(<ToddlerLandRooms playId="rocket-stars" onAddStar={() => stars.push(1)} />);
    const rocket = getByTestId("rocket");
    for (const n of [0, 1, 2, 3, 4]) dragOnto(getByTestId(`star-${n}`), rocket);
    fireEvent.pointerDown(getByTestId("launch"));
    await act(async () => {
      vi.advanceTimersByTime(2500);
    });
    expect(stars).toEqual([1]);
    vi.useRealTimers();
  });

  it("scrubs dirt off the bus by dragging, not tapping", async () => {
    const stars: number[] = [];
    const { getByTestId } = render(<ToddlerLandRooms playId="wash-bus" onAddStar={() => stars.push(1)} />);
    const stage = getByTestId("wash-bus-scrub");
    const dragOver = (id: string) => {
      const spot = getByTestId(`spot-${id}`);
      spot.getBoundingClientRect = () =>
        ({ top: 40, left: 40, bottom: 80, right: 80, width: 40, height: 40, x: 40, y: 40, toJSON: () => {} }) as DOMRect;
      fireEvent.pointerDown(stage, { clientX: 10, clientY: 10, pointerId: 1 });
      fireEvent.pointerMove(stage, { clientX: 60, clientY: 60, pointerId: 1, buttons: 1 });
    };
    for (const id of ["a", "b", "c", "d", "e"]) dragOver(id);
    await flush();
    expect(stars).toEqual([1]);
  });

  it("flips four gold pancakes onto the plate and waits if they are still pale", async () => {
    vi.useFakeTimers();
    const stars: number[] = [];
    const { getByTestId, container } = render(
      <ToddlerLandRooms playId="pancake-flip" onAddStar={() => stars.push(1)} />
    );
    for (let i = 0; i < 4; i += 1) {
      fireEvent.click(getByTestId("pancake-pour"));
      fireEvent.click(getByTestId("pancake-flip"));
      expect(stars).toHaveLength(0);
      await act(async () => {
        vi.advanceTimersByTime(950);
      });
      fireEvent.click(getByTestId("pancake-flip"));
    }
    expect(stars).toEqual([1]);
    expect(container.textContent).toContain("Saturday stack");
  });

  it("hangs four clothes on the backyard line", async () => {
    const stars: number[] = [];
    const { getByTestId, container } = render(
      <ToddlerLandRooms playId="hang-wash" onAddStar={() => stars.push(1)} />
    );
    const line = getByTestId("wash-line");
    for (const id of ["shirt", "sock", "towel", "dress"]) dragOnto(getByTestId(`wash-${id}`), line);
    await flush();
    expect(stars).toEqual([1]);
    expect(container.textContent).toContain("wind can work");
  });

  it("follows the crate with a ghost and does not credit a miss", async () => {
    const stars: number[] = [];
    const { getByTestId, queryByTestId } = render(
      <ToddlerLandRooms playId="load-truck" onAddStar={() => stars.push(1)} />,
    );
    const crate = getByTestId("crate-0");
    fireEvent.pointerDown(crate, { clientX: 10, clientY: 10, pointerId: 1 });
    fireEvent.pointerMove(crate, { clientX: 400, clientY: 400, pointerId: 1, buttons: 1 });
    expect(getByTestId("drag-ghost").textContent).toContain("📦");
    fireEvent.pointerUp(crate, { clientX: 400, clientY: 400, pointerId: 1 });
    expect(queryByTestId("drag-ghost")).toBeNull();
    expect(stars).toEqual([]);
    expect(getByTestId("crate-0")).toBeTruthy();
  });

  it("packs a trip bag by dragging, not tapping", async () => {
    const stars: number[] = [];
    const { getByTestId } = render(<ToddlerLandRooms playId="pack-bag" onAddStar={() => stars.push(1)} />);
    const bag = getByTestId("trip-bag");
    for (const id of ["shirt", "book", "apple", "sock"]) dragOnto(getByTestId(`bit-${id}`), bag);
    await flush();
    expect(stars).toEqual([1]);
  });
});
