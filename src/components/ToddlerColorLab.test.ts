import { describe, expect, it } from "vitest";
import { narrationClipForText } from "../data/toddler/audioRegistry";
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

  it("maps ColorLab wrong-mix lines to voice-01 clips", () => {
    const mixAgain = (made: string, need: string) => `That made ${made}. We need ${need}. Mix again!`;
    expect(narrationClipForText(mixAgain("Orange", "Purple"))?.src).toBe(
      "/audio/voice/color-need-orange-purple.mp3",
    );
    expect(narrationClipForText(mixAgain("Orange", "Green"))?.src).toBe(
      "/audio/voice/color-need-orange-green.mp3",
    );
    expect(narrationClipForText(mixAgain("Green", "Orange"))?.src).toBe(
      "/audio/voice/color-need-green-orange.mp3",
    );
    expect(narrationClipForText(mixAgain("Green", "Purple"))?.src).toBe(
      "/audio/voice/color-need-green-purple.mp3",
    );
    expect(narrationClipForText(mixAgain("Purple", "Orange"))?.src).toBe(
      "/audio/voice/color-need-purple-orange.mp3",
    );
    expect(narrationClipForText(mixAgain("Purple", "Green"))?.src).toBe(
      "/audio/voice/color-need-purple-green.mp3",
    );
    expect(narrationClipForText(mixAgain("Pink", "Orange"))?.src).toBe(
      "/audio/voice/color-need-pink-orange.mp3",
    );
    expect(narrationClipForText(mixAgain("Pink", "Purple"))?.src).toBe(
      "/audio/voice/color-need-pink-purple.mp3",
    );
    expect(narrationClipForText(mixAgain("Pink", "Green"))?.src).toBe(
      "/audio/voice/color-need-pink-green.mp3",
    );
    expect(narrationClipForText(mixAgain("Orange", "Purple"))?.author).toContain("voice-01");
  });
});
