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
  it("lists the Savanna closed-kit files plus the earlier park bird clip", () => {
    expect(EXPECTED_AUDIO_FILES).toEqual([
      "/audio/voice/narrator-safari-explore-welcome.mp3",
      "/audio/voice/narrator-safari-detective-stem.mp3",
      "/audio/sfx/animal-lion.mp3",
      "/audio/sfx/animal-elephant.mp3",
      "/audio/sfx/animal-monkey.mp3",
      "/audio/sfx/animal-duck.mp3",
      "/audio/sfx/animal-frog.mp3",
      "/audio/sfx/animal-cow.mp3",
      "/audio/sfx/animal-giraffe.mp3",
      "/audio/sfx/animal-zebra.mp3",
      "/audio/sfx/animal-pig.mp3",
      "/audio/sfx/animal-horse.mp3",
      "/audio/sfx/animal-hen.mp3",
      "/audio/sfx/animal-sheep.mp3",
      "/audio/sfx/animal-goat.mp3",
      "/audio/sfx/animal-chick.mp3",
      "/audio/sfx/animal-parrot.mp3",
      "/audio/sfx/animal-tiger.mp3",
      "/audio/sfx/animal-snake.mp3",
      "/audio/sfx/animal-gorilla.mp3",
      "/audio/sfx/animal-sloth.mp3",
      "/audio/sfx/animal-leopard.mp3",
      "/audio/sfx/animal-penguin.mp3",
      "/audio/sfx/animal-seal.mp3",
      "/audio/sfx/animal-bear.mp3",
      "/audio/sfx/animal-whale.mp3",
      "/audio/sfx/animal-fox.mp3",
      "/audio/sfx/animal-owl.mp3",
      "/audio/sfx/animal-flake.mp3",
      "/audio/sfx/animal-igloo.mp3",
      "/audio/sfx/animal-bird.mp3",
    ]);
    expect(new Set(AUDIO_ASSETS.map((asset) => asset.id)).size).toBe(AUDIO_ASSETS.length);
    expect(AUDIO_ASSETS.every((asset) => asset.fileStatus === "present")).toBe(true);
    expect(getAudioAsset("voice.narrator.safari-explore-welcome")?.author).toContain("voice-01");
    expect(getAudioAsset("voice.narrator.safari-detective-stem")?.promptText).toBe(
      "Who makes this sound? Tap the right animal!",
    );
  });

  it("maps the existing Savanna explore welcome line to the narrator clip", () => {
    const clip = narrationClipForText(SAFARI_EXPLORE_WELCOME_PROMPT);
    expect(clip?.id).toBe("voice.narrator.safari-explore-welcome");
    expect(narrationClipForText("some other prompt")).toBeUndefined();
  });

  it("maps savanna friend ids plus the park bird clip", () => {
    expect(animalClipForFriendId("duck")?.src).toBe("/audio/sfx/animal-duck.mp3");
    expect(animalClipForFriendId("cow")?.src).toBe("/audio/sfx/animal-cow.mp3");
    expect(animalClipForFriendId("lion")?.src).toBe("/audio/sfx/animal-lion.mp3");
    expect(animalClipForFriendId("zebra")?.src).toBe("/audio/sfx/animal-zebra.mp3");
    expect(animalClipForFriendId("pig")?.src).toBe("/audio/sfx/animal-pig.mp3");
    expect(animalClipForFriendId("gorilla")?.src).toBe("/audio/sfx/animal-gorilla.mp3");
    expect(animalClipForFriendId("penguin")?.src).toBe("/audio/sfx/animal-penguin.mp3");
    expect(animalClipForFriendId("igloo")?.src).toBe("/audio/sfx/animal-igloo.mp3");
    expect(animalClipForFriendId("bird")?.src).toBe("/audio/sfx/animal-bird.mp3");
    expect(animalClipForFriendId("bee")).toBeUndefined();
    expect(getAudioAsset("sfx.animal.duck")?.animalId).toBe("duck");
  });
});
