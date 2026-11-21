import { describe, expect, it } from "vitest";
import { mixTargetFromActivity } from "./ToddlerColorLab";

describe("Color Magic mix target", () => {
  it("asks for orange on the red-and-yellow studio mission", () => {
    expect(
      mixTargetFromActivity({
        id: "act-color-mix-orange",
        title: "Mix Red and Yellow Paint",
        learningObjective: "Predicting and mixing secondary colors (Orange)",
        cluePrompt: "Drop bright Red into Sunny Yellow!",
      }),
    ).toBe("Orange");
  });

  it("asks for green on the blue-and-yellow studio mission", () => {
    expect(
      mixTargetFromActivity({
        id: "act-color-mix-green",
        learningObjective: "Predicting and mixing secondary colors (Green)",
        cluePrompt: "Drop Ocean Blue into Sunny Yellow!",
      }),
    ).toBe("Green");
  });

  it("asks for purple on red-plus-blue jam", () => {
    expect(
      mixTargetFromActivity({
        cluePrompt: "Red jam plus blue jam on the plate. What colour appears?",
        learningObjective: "Mix red and blue",
      }),
    ).toBe("Purple");
  });

  it("lets fruit-stall free mix skip a named target", () => {
    expect(
      mixTargetFromActivity({
        id: "act-market-color-lab",
        title: "Market Mix",
        cluePrompt: "Blend droplets into market colours.",
      }),
    ).toBeUndefined();
  });
});
