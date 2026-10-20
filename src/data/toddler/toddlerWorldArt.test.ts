import { describe, expect, it } from "vitest";
import { CAST, TOY_STILL, WORLD_COVER } from "./toddlerWorldArt";

describe("toddler world art", () => {
  it("paints Pip and Nana as storybook portraits", () => {
    expect(CAST.pip).toBe("/cast/pip.jpg");
    expect(CAST.nana).toBe("/cast/nana.jpg");
  });

  it("covers every open-play toy with a still", () => {
    expect(TOY_STILL).toEqual(
      expect.objectContaining({
        stir: "/toys/stir.jpg",
        drive: "/toys/drive.jpg",
        pour: "/toys/pour.jpg",
        trace: "/toys/trace.jpg",
        scoop: "/toys/scoop.jpg",
        pet: "/toys/pet.jpg",
        plant: "/toys/plant.jpg",
        comb: "/toys/comb.jpg",
      })
    );
  });

  it("keeps painted island covers for every atlas land", () => {
    expect(Object.keys(WORLD_COVER).length).toBeGreaterThanOrEqual(12);
  });
});
