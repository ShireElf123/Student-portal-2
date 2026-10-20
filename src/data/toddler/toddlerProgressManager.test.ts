// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../../utils/learnerBrain", async () => {
  const actual = await vi.importActual<typeof import("../../utils/learnerBrain")>("../../utils/learnerBrain");
  return {
    ...actual,
    recordLearningEvent: () => {},
  };
});

import { setActiveLearnerId } from "../../utils/learnerBrain";
import { ALL_TODDLER_WORLDS } from "./toddlerWorldsArchitecture";
import {
  getInitialToddlerProgress,
  isAreaUnlocked,
  recordActivityCompletion,
  saveToddlerProgress,
} from "./toddlerProgressManager";

const animal = ALL_TODDLER_WORLDS.find((world) => world.id === "animal-world")!;
const farm = animal.areas.find((area) => area.id === "farm-valley")!;
const jungle = animal.areas.find((area) => area.id === "jungle-canopy")!;

beforeEach(() => {
  localStorage.clear();
  setActiveLearnerId(`progress-test-${Math.random().toString(16).slice(2)}`);
  saveToddlerProgress(getInitialToddlerProgress());
});

describe("toddler area doors", () => {
  it("opens the next neighbourhood after one finished stop, not six stars", () => {
    expect(isAreaUnlocked(farm)).toBe(true);
    expect(isAreaUnlocked(jungle)).toBe(false);

    recordActivityCompletion("animal-world", "farm-valley", farm.activities[0].id, 1);

    expect(isAreaUnlocked(jungle)).toBe(true);
  });
});
