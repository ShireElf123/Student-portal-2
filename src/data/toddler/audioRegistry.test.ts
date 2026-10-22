import { describe, expect, it } from "vitest";
import {
  AUDIO_ASSETS,
  EXPECTED_AUDIO_FILES,
  SAFARI_EXPLORE_WELCOME_PROMPT,
  animalClipForFriendId,
  getAudioAsset,
  narrationClipForText,
  safariFriendBioText,
} from "./audioRegistry";

describe("audio registry", () => {
  it("lists the Safari closed-kit voice lines and every friend mouth-call", () => {
    expect(EXPECTED_AUDIO_FILES).toEqual([
      "/audio/voice/narrator-safari-explore-welcome.mp3",
      "/audio/voice/narrator-safari-detective-stem.mp3",
      "/audio/voice/safari-welcome-pasture.mp3",
      "/audio/voice/safari-welcome-flower-bed.mp3",
      "/audio/voice/safari-welcome-barnyard-tale.mp3",
      "/audio/voice/safari-welcome-pond.mp3",
      "/audio/voice/safari-welcome-night-walk.mp3",
      "/audio/voice/safari-welcome-park.mp3",
      "/audio/voice/safari-welcome-ice-floe.mp3",
      "/audio/voice/safari-welcome-owl-wood.mp3",
      "/audio/voice/farm-area-welcome.mp3",
      "/audio/voice/farm-milk-station.mp3",
      "/audio/voice/farm-milk-line.mp3",
      "/audio/voice/farm-milk-done.mp3",
      "/audio/voice/farm-letter-trace.mp3",
      "/audio/voice/farm-pen-count.mp3",
      "/audio/voice/farm-quiz-cow.mp3",
      "/audio/voice/farm-quiz-kitten.mp3",
      "/audio/voice/farm-quiz-chicks.mp3",
      "/audio/voice/farm-quiz-horse.mp3",
      "/audio/voice/safari-bio-lion.mp3",
      "/audio/voice/safari-bio-elephant.mp3",
      "/audio/voice/safari-bio-monkey.mp3",
      "/audio/voice/safari-bio-duck.mp3",
      "/audio/voice/safari-bio-frog.mp3",
      "/audio/voice/safari-bio-cow.mp3",
      "/audio/voice/safari-bio-giraffe.mp3",
      "/audio/voice/safari-bio-zebra.mp3",
      "/audio/voice/safari-bio-pig.mp3",
      "/audio/voice/safari-bio-horse.mp3",
      "/audio/voice/safari-bio-farm-cow.mp3",
      "/audio/voice/safari-bio-hen.mp3",
      "/audio/voice/safari-bio-sheep.mp3",
      "/audio/voice/safari-bio-farm-duck.mp3",
      "/audio/voice/safari-bio-goat.mp3",
      "/audio/voice/safari-bio-chick.mp3",
      "/audio/voice/safari-bio-parrot.mp3",
      "/audio/voice/safari-bio-tiger.mp3",
      "/audio/voice/safari-bio-snake.mp3",
      "/audio/voice/safari-bio-gorilla.mp3",
      "/audio/voice/safari-bio-jungle-monkey.mp3",
      "/audio/voice/safari-bio-jungle-frog.mp3",
      "/audio/voice/safari-bio-sloth.mp3",
      "/audio/voice/safari-bio-leopard.mp3",
      "/audio/voice/safari-bio-penguin.mp3",
      "/audio/voice/safari-bio-seal.mp3",
      "/audio/voice/safari-bio-bear.mp3",
      "/audio/voice/safari-bio-whale.mp3",
      "/audio/voice/safari-bio-fox.mp3",
      "/audio/voice/safari-bio-owl.mp3",
      "/audio/voice/safari-bio-flake.mp3",
      "/audio/voice/safari-bio-igloo.mp3",
      "/audio/voice/safari-bio-bee.mp3",
      "/audio/voice/safari-bio-butterfly.mp3",
      "/audio/voice/safari-bio-beetle.mp3",
      "/audio/voice/safari-bio-cricket.mp3",
      "/audio/voice/safari-bio-ladybug.mp3",
      "/audio/voice/safari-bio-snail.mp3",
      "/audio/voice/safari-bio-ant.mp3",
      "/audio/voice/safari-bio-worm.mp3",
      "/audio/voice/safari-bio-pond-frog.mp3",
      "/audio/voice/safari-bio-pond-duck.mp3",
      "/audio/voice/safari-bio-fish.mp3",
      "/audio/voice/safari-bio-turtle.mp3",
      "/audio/voice/safari-bio-dragonfly.mp3",
      "/audio/voice/safari-bio-pond-snail.mp3",
      "/audio/voice/safari-bio-lily.mp3",
      "/audio/voice/safari-bio-reed.mp3",
      "/audio/voice/safari-bio-bat.mp3",
      "/audio/voice/safari-bio-moth.mp3",
      "/audio/voice/safari-bio-night-owl.mp3",
      "/audio/voice/safari-bio-night-cat.mp3",
      "/audio/voice/safari-bio-night-fox.mp3",
      "/audio/voice/safari-bio-mouse.mp3",
      "/audio/voice/safari-bio-star.mp3",
      "/audio/voice/safari-bio-moon.mp3",
      "/audio/voice/safari-bio-bird.mp3",
      "/audio/voice/safari-bio-squirrel.mp3",
      "/audio/voice/safari-bio-dog.mp3",
      "/audio/voice/safari-bio-bunny.mp3",
      "/audio/voice/safari-bio-park-duck.mp3",
      "/audio/voice/safari-bio-park-bee.mp3",
      "/audio/voice/safari-bio-bench.mp3",
      "/audio/voice/safari-bio-fountain.mp3",
      "/audio/voice/safari-bio-pot.mp3",
      "/audio/voice/safari-bio-bread.mp3",
      "/audio/voice/safari-bio-apple.mp3",
      "/audio/voice/safari-bio-spoon.mp3",
      "/audio/voice/safari-bio-milk.mp3",
      "/audio/voice/safari-bio-jam.mp3",
      "/audio/voice/safari-bio-kitchen-cat.mp3",
      "/audio/voice/safari-bio-oven.mp3",
      "/audio/voice/safari-bio-bus.mp3",
      "/audio/voice/safari-bio-car.mp3",
      "/audio/voice/safari-bio-plane.mp3",
      "/audio/voice/safari-bio-train.mp3",
      "/audio/voice/safari-bio-bike.mp3",
      "/audio/voice/safari-bio-boat.mp3",
      "/audio/voice/safari-bio-heli.mp3",
      "/audio/voice/safari-bio-lights.mp3",
      "/audio/voice/safari-bio-paint.mp3",
      "/audio/voice/safari-bio-drum.mp3",
      "/audio/voice/safari-bio-bead.mp3",
      "/audio/voice/safari-bio-brush.mp3",
      "/audio/voice/safari-bio-note.mp3",
      "/audio/voice/safari-bio-sticker.mp3",
      "/audio/voice/safari-bio-crayon.mp3",
      "/audio/voice/safari-bio-scissors.mp3",
      "/audio/voice/safari-bio-ay.mp3",
      "/audio/voice/safari-bio-bee-letter.mp3",
      "/audio/voice/safari-bio-ten.mp3",
      "/audio/voice/safari-bio-book.mp3",
      "/audio/voice/safari-bio-pen.mp3",
      "/audio/voice/safari-bio-dot.mp3",
      "/audio/voice/safari-bio-ess.mp3",
      "/audio/voice/safari-bio-map.mp3",
      "/audio/voice/safari-bio-house.mp3",
      "/audio/voice/safari-bio-home-brush.mp3",
      "/audio/voice/safari-bio-cup.mp3",
      "/audio/voice/safari-bio-heart.mp3",
      "/audio/voice/safari-bio-bed.mp3",
      "/audio/voice/safari-bio-smile.mp3",
      "/audio/voice/safari-bio-soap.mp3",
      "/audio/voice/safari-bio-towel.mp3",
      "/audio/voice/safari-bio-compost-worm.mp3",
      "/audio/voice/safari-bio-compost-beetle.mp3",
      "/audio/voice/safari-bio-mushroom.mp3",
      "/audio/voice/safari-bio-spider.mp3",
      "/audio/voice/safari-bio-slug.mp3",
      "/audio/voice/safari-bio-compost-ant.mp3",
      "/audio/voice/safari-bio-leaf.mp3",
      "/audio/voice/safari-bio-sowbug.mp3",
      "/audio/voice/safari-bio-tale-hen.mp3",
      "/audio/voice/safari-bio-tale-book.mp3",
      "/audio/voice/safari-bio-crown.mp3",
      "/audio/voice/safari-bio-king.mp3",
      "/audio/voice/safari-bio-dragon.mp3",
      "/audio/voice/safari-bio-tale-boat.mp3",
      "/audio/voice/safari-bio-tale-star.mp3",
      "/audio/voice/safari-bio-castle.mp3",
      "/audio/voice/safari-bio-pine.mp3",
      "/audio/voice/safari-bio-trail-owl.mp3",
      "/audio/voice/safari-bio-boot.mp3",
      "/audio/voice/safari-bio-gem.mp3",
      "/audio/voice/safari-bio-trail-map.mp3",
      "/audio/voice/safari-bio-trail-fox.mp3",
      "/audio/voice/safari-bio-cave.mp3",
      "/audio/voice/safari-bio-rain.mp3",
      "/audio/voice/safari-bio-bedroom-bed.mp3",
      "/audio/voice/safari-bio-lamp.mp3",
      "/audio/voice/safari-bio-teddy.mp3",
      "/audio/voice/safari-bio-bedroom-cat.mp3",
      "/audio/voice/safari-bio-bedroom-book.mp3",
      "/audio/voice/safari-bio-bedroom-moon.mp3",
      "/audio/voice/safari-bio-sock.mp3",
      "/audio/voice/safari-bio-bedroom-mouse.mp3",
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
      "/audio/sfx/animal-castle.mp3",
      "/audio/sfx/animal-pine.mp3",
      "/audio/sfx/animal-boot.mp3",
      "/audio/sfx/animal-gem.mp3",
      "/audio/sfx/animal-cave.mp3",
      "/audio/sfx/animal-rain.mp3",
      "/audio/sfx/animal-lamp.mp3",
      "/audio/sfx/animal-teddy.mp3",
      "/audio/sfx/animal-sock.mp3",
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

  it("maps savanna lion explore bio to the voice clip", () => {
    const bio = safariFriendBioText({
      call: "Rrrroaaar! Roar! I am the brave golden Lion with a fuzzy mane!",
      funFact: "Lions live in families called prides and love resting under big acacia trees!",
    });
    expect(narrationClipForText(bio)?.id).toBe("voice.safari.bio.lion");
  });

  it("maps farm cow explore bio separately from savanna cow", () => {
    const bio = safariFriendBioText({
      call: "Moooo! I am the pasture cow. Come walk the grass with me!",
      funFact: "Cows chew clover and like a slow, sunny walk.",
    });
    expect(narrationClipForText(bio)?.id).toBe("voice.safari.bio.farm-cow");
  });

  it("maps pasture safari station welcome to voice-01", () => {
    expect(
      narrationClipForText("Let's walk the pasture safari and listen for animal friends!")?.id,
    ).toBe("voice.safari.welcome.pasture");
  });

  it("maps Farm Valley closed-kit lines to voice-01", () => {
    expect(
      narrationClipForText("Farm Valley! Sunny Barn, Fluffy Chicks & Grassy Pastures. Let's explore together!")?.id,
    ).toBe("voice.farm.area-welcome");
    expect(
      narrationClipForText("Listen with your ears! Who is chewing sweet clover in the meadow and says Moooo?")?.id,
    ).toBe("voice.farm.quiz-cow");
    expect(narrationClipForText("Hold the pail. Fill it to the top.")?.id).toBe("voice.farm.milk-line");
  });

  it("maps letter A explore bio to A says a like apple", () => {
    const bio = safariFriendBioText({
      call: "A says a like apple!",
      funFact: "A is the first letter of the alphabet.",
    });
    expect(narrationClipForText(bio)?.id).toBe("voice.safari.bio.ay");
  });

  it("maps safari friend ids including the park bird clip", () => {
    expect(animalClipForFriendId("ay")?.src).toBe("/audio/sfx/animal-ay.mp3");
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
    expect(animalClipForFriendId("castle")?.src).toBe("/audio/sfx/animal-castle.mp3");
    expect(animalClipForFriendId("teddy")?.src).toBe("/audio/sfx/animal-teddy.mp3");
    expect(animalClipForFriendId("bird")?.src).toBe("/audio/sfx/animal-bird.mp3");
    expect(getAudioAsset("sfx.animal.bird")?.author).toContain("voice-01");
    expect(animalClipForFriendId("unicorn")).toBeUndefined();
    expect(getAudioAsset("sfx.animal.duck")?.animalId).toBe("duck");
  });
});
