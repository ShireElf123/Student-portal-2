import { describe, expect, it } from "vitest";
import {
  AUDIO_ASSETS,
  EXPECTED_AUDIO_FILES,
  SAFARI_EXPLORE_WELCOME_PROMPT,
  animalClipForFriendId,
  getAudioAsset,
  narrationClipForText,
} from "./audioRegistry";

describe("audio registry", () => {
  it("lists the four sample-pack files the owner must provide", () => {
    expect(EXPECTED_AUDIO_FILES).toEqual([
      "/audio/voice/narrator-safari-explore-welcome.mp3",
      "/audio/sfx/animal-duck.mp3",
      "/audio/sfx/animal-cow.mp3",
      "/audio/sfx/animal-bird.mp3",
    ]);
    expect(new Set(AUDIO_ASSETS.map((asset) => asset.id)).size).toBe(AUDIO_ASSETS.length);
    expect(getAudioAsset("voice.narrator.safari-explore-welcome")?.fileStatus).toBe("present");
    expect(AUDIO_ASSETS.filter((asset) => asset.channel === "sfx").every((asset) => asset.fileStatus === "awaiting-user-file")).toBe(true);
  });

  it("maps the existing Savanna explore welcome line to the narrator clip", () => {
    const clip = narrationClipForText(SAFARI_EXPLORE_WELCOME_PROMPT);
    expect(clip?.id).toBe("voice.narrator.safari-explore-welcome");
    expect(narrationClipForText("some other prompt")).toBeUndefined();
  });

  it("maps safari friend ids duck, cow, and bird", () => {
    expect(animalClipForFriendId("duck")?.src).toBe("/audio/sfx/animal-duck.mp3");
    expect(animalClipForFriendId("cow")?.src).toBe("/audio/sfx/animal-cow.mp3");
    expect(animalClipForFriendId("bird")?.src).toBe("/audio/sfx/animal-bird.mp3");
    expect(animalClipForFriendId("lion")).toBeUndefined();
    expect(getAudioAsset("sfx.animal.duck")?.animalId).toBe("duck");
  });
});
