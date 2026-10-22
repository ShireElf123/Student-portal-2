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
      "/audio/sfx/animal-bee.mp3",
      "/audio/sfx/animal-butterfly.mp3",
      "/audio/sfx/animal-beetle.mp3",
      "/audio/sfx/animal-cricket.mp3",
      "/audio/sfx/animal-ladybug.mp3",
      "/audio/sfx/animal-snail.mp3",
      "/audio/sfx/animal-ant.mp3",
      "/audio/sfx/animal-worm.mp3",
      "/audio/sfx/animal-fish.mp3",
      "/audio/sfx/animal-turtle.mp3",
      "/audio/sfx/animal-dragonfly.mp3",
      "/audio/sfx/animal-lily.mp3",
      "/audio/sfx/animal-reed.mp3",
      "/audio/sfx/animal-bat.mp3",
      "/audio/sfx/animal-moth.mp3",
      "/audio/sfx/animal-cat.mp3",
      "/audio/sfx/animal-mouse.mp3",
      "/audio/sfx/animal-star.mp3",
      "/audio/sfx/animal-moon.mp3",
      "/audio/sfx/animal-squirrel.mp3",
      "/audio/sfx/animal-dog.mp3",
      "/audio/sfx/animal-bunny.mp3",
      "/audio/sfx/animal-bench.mp3",
      "/audio/sfx/animal-fountain.mp3",
      "/audio/sfx/animal-pot.mp3",
      "/audio/sfx/animal-bread.mp3",
      "/audio/sfx/animal-apple.mp3",
      "/audio/sfx/animal-spoon.mp3",
      "/audio/sfx/animal-milk.mp3",
      "/audio/sfx/animal-jam.mp3",
      "/audio/sfx/animal-oven.mp3",
      "/audio/sfx/animal-bus.mp3",
      "/audio/sfx/animal-car.mp3",
      "/audio/sfx/animal-plane.mp3",
      "/audio/sfx/animal-train.mp3",
      "/audio/sfx/animal-bike.mp3",
      "/audio/sfx/animal-boat.mp3",
      "/audio/sfx/animal-heli.mp3",
      "/audio/sfx/animal-lights.mp3",
      "/audio/sfx/animal-paint.mp3",
      "/audio/sfx/animal-drum.mp3",
      "/audio/sfx/animal-bead.mp3",
      "/audio/sfx/animal-brush.mp3",
      "/audio/sfx/animal-note.mp3",
      "/audio/sfx/animal-sticker.mp3",
      "/audio/sfx/animal-crayon.mp3",
      "/audio/sfx/animal-scissors.mp3",
      "/audio/sfx/animal-ay.mp3",
      "/audio/sfx/animal-bee-letter.mp3",
      "/audio/sfx/animal-ten.mp3",
      "/audio/sfx/animal-book.mp3",
      "/audio/sfx/animal-pen.mp3",
      "/audio/sfx/animal-dot.mp3",
      "/audio/sfx/animal-ess.mp3",
      "/audio/sfx/animal-map.mp3",
      "/audio/sfx/animal-house.mp3",
      "/audio/sfx/animal-cup.mp3",
      "/audio/sfx/animal-heart.mp3",
      "/audio/sfx/animal-bed.mp3",
      "/audio/sfx/animal-smile.mp3",
      "/audio/sfx/animal-soap.mp3",
      "/audio/sfx/animal-towel.mp3",
      "/audio/sfx/animal-mushroom.mp3",
      "/audio/sfx/animal-spider.mp3",
      "/audio/sfx/animal-slug.mp3",
      "/audio/sfx/animal-leaf.mp3",
      "/audio/sfx/animal-sowbug.mp3",
      "/audio/sfx/animal-crown.mp3",
      "/audio/sfx/animal-king.mp3",
      "/audio/sfx/animal-dragon.mp3",
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
    expect(animalClipForFriendId("bee")?.src).toBe("/audio/sfx/animal-bee.mp3");
    expect(animalClipForFriendId("turtle")?.src).toBe("/audio/sfx/animal-turtle.mp3");
    expect(animalClipForFriendId("dragonfly")?.src).toBe("/audio/sfx/animal-dragonfly.mp3");
    expect(animalClipForFriendId("squirrel")?.src).toBe("/audio/sfx/animal-squirrel.mp3");
    expect(animalClipForFriendId("dog")?.src).toBe("/audio/sfx/animal-dog.mp3");
    expect(animalClipForFriendId("jam")?.src).toBe("/audio/sfx/animal-jam.mp3");
    expect(animalClipForFriendId("oven")?.src).toBe("/audio/sfx/animal-oven.mp3");
    expect(animalClipForFriendId("paint")?.src).toBe("/audio/sfx/animal-paint.mp3");
    expect(animalClipForFriendId("drum")?.src).toBe("/audio/sfx/animal-drum.mp3");
    expect(animalClipForFriendId("ten")?.src).toBe("/audio/sfx/animal-ten.mp3");
    expect(animalClipForFriendId("book")?.src).toBe("/audio/sfx/animal-book.mp3");
    expect(animalClipForFriendId("smile")?.src).toBe("/audio/sfx/animal-smile.mp3");
    expect(animalClipForFriendId("soap")?.src).toBe("/audio/sfx/animal-soap.mp3");
    expect(animalClipForFriendId("dragon")?.src).toBe("/audio/sfx/animal-dragon.mp3");
    expect(animalClipForFriendId("bird")?.src).toBe("/audio/sfx/animal-bird.mp3");
    expect(animalClipForFriendId("castle")).toBeUndefined();
    expect(getAudioAsset("sfx.animal.duck")?.animalId).toBe("duck");
  });
});
