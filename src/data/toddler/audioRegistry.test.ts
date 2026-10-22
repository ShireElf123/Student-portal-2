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
      "/audio/voice/farm-fb-pig.mp3",
      "/audio/voice/farm-fb-cow.mp3",
      "/audio/voice/farm-fb-sheep.mp3",
      "/audio/voice/farm-fb-rooster.mp3",
      "/audio/voice/farm-fb-puppy.mp3",
      "/audio/voice/farm-fb-kitten.mp3",
      "/audio/voice/farm-fb-duckling.mp3",
      "/audio/voice/farm-fb-piglet.mp3",
      "/audio/voice/farm-fb-chicks-low.mp3",
      "/audio/voice/farm-fb-chicks-yes.mp3",
      "/audio/voice/farm-fb-chicks-together.mp3",
      "/audio/voice/farm-fb-carrot.mp3",
      "/audio/voice/farm-fb-cupcake.mp3",
      "/audio/voice/farm-fb-pizza.mp3",
      "/audio/voice/farm-count-chicks.mp3",
      "/audio/voice/farm-count-pigs.mp3",
      "/audio/voice/farm-count-sheep.mp3",
      "/audio/voice/farm-count-ducks.mp3",
      "/audio/voice/farm-count-hens.mp3",
      "/audio/voice/farm-count-goats.mp3",
      "/audio/voice/farm-count-cows.mp3",
      "/audio/voice/farm-count-horses.mp3",
      "/audio/voice/farm-count-geese.mp3",
      "/audio/voice/farm-count-hens-row.mp3",
      "/audio/voice/farm-count-rabbits.mp3",
      "/audio/voice/farm-count-eggs.mp3",
      "/audio/voice/farm-count-calves.mp3",
      "/audio/voice/farm-count-lambs.mp3",
      "/audio/voice/farm-count-bees.mp3",
      "/audio/voice/farm-count-turkeys.mp3",
      "/audio/voice/jungle-area-welcome.mp3",
      "/audio/voice/jungle-memory-welcome.mp3",
      "/audio/voice/jungle-vine-station.mp3",
      "/audio/voice/jungle-vine-line.mp3",
      "/audio/voice/jungle-vine-done.mp3",
      "/audio/voice/jungle-quiz-monkey.mp3",
      "/audio/voice/jungle-quiz-lion.mp3",
      "/audio/voice/jungle-quiz-parrot.mp3",
      "/audio/voice/jungle-quiz-bananas.mp3",
      "/audio/voice/jungle-fb-monkey.mp3",
      "/audio/voice/jungle-fb-frog.mp3",
      "/audio/voice/jungle-fb-lion-sound.mp3",
      "/audio/voice/jungle-fb-elephant.mp3",
      "/audio/voice/jungle-fb-mouse.mp3",
      "/audio/voice/jungle-fb-lion-yes.mp3",
      "/audio/voice/jungle-fb-turtle.mp3",
      "/audio/voice/jungle-fb-ladybug.mp3",
      "/audio/voice/jungle-fb-treetop.mp3",
      "/audio/voice/jungle-fb-ocean.mp3",
      "/audio/voice/jungle-fb-desert.mp3",
      "/audio/voice/jungle-fb-bananas-low.mp3",
      "/audio/voice/jungle-fb-bananas-yes.mp3",
      "/audio/voice/jungle-fb-bananas-together.mp3",
      "/audio/voice/ocean-area-welcome.mp3",
      "/audio/voice/ocean-bubbles-welcome.mp3",
      "/audio/voice/ocean-feed-station.mp3",
      "/audio/voice/ocean-feed-line.mp3",
      "/audio/voice/ocean-feed-done.mp3",
      "/audio/voice/ocean-quiz-dolphin.mp3",
      "/audio/voice/ocean-quiz-jellyfish.mp3",
      "/audio/voice/ocean-fb-dolphin.mp3",
      "/audio/voice/ocean-fb-horse.mp3",
      "/audio/voice/ocean-fb-camel.mp3",
      "/audio/voice/ocean-fb-chicken.mp3",
      "/audio/voice/ocean-fb-jellyfish.mp3",
      "/audio/voice/ocean-fb-rock.mp3",
      "/audio/voice/ocean-fb-boot.mp3",
      "/audio/voice/ocean-sort-prompt.mp3",
      "/audio/voice/ocean-fb-whale.mp3",
      "/audio/voice/ocean-fb-lion.mp3",
      "/audio/voice/ocean-reef-sort-welcome.mp3",
      "/audio/voice/ocean-reef-sort-fish.mp3",
      "/audio/voice/ocean-reef-sort-crab.mp3",
      "/audio/voice/ocean-reef-sort-gull.mp3",
      "/audio/voice/ocean-reef-sort-turtle.mp3",
      "/audio/voice/ocean-reef-sort-cow.mp3",
      "/audio/voice/ocean-reef-sort-clownfish.mp3",
      "/audio/voice/ocean-reef-sort-seal.mp3",
      "/audio/voice/ocean-reef-sort-whale.mp3",
      "/audio/voice/ocean-reef-sort-heron.mp3",
      "/audio/voice/ocean-reef-sort-starfish.mp3",
      "/audio/voice/ocean-reef-sort-octopus.mp3",
      "/audio/voice/ocean-reef-sort-plane.mp3",
      "/audio/voice/dino-area-welcome.mp3",
      "/audio/voice/dino-memory-welcome.mp3",
      "/audio/voice/dino-nest-station.mp3",
      "/audio/voice/dino-nest-line.mp3",
      "/audio/voice/dino-nest-done.mp3",
      "/audio/voice/dino-quiz-neck.mp3",
      "/audio/voice/dino-quiz-roar.mp3",
      "/audio/voice/dino-fb-brachio.mp3",
      "/audio/voice/dino-fb-crab.mp3",
      "/audio/voice/dino-fb-duck.mp3",
      "/audio/voice/dino-fb-trex.mp3",
      "/audio/voice/dino-fb-mouse.mp3",
      "/audio/voice/dino-fb-turtle.mp3",
      "/audio/voice/dino-tracks-welcome.mp3",
      "/audio/voice/dino-tracks-round.mp3",
      "/audio/voice/dino-tracks-toes.mp3",
      "/audio/voice/dino-tracks-tiny.mp3",
      "/audio/voice/dino-tracks-tyre.mp3",
      "/audio/voice/dino-tracks-drag.mp3",
      "/audio/voice/dino-tracks-river.mp3",
      "/audio/voice/dino-tracks-count.mp3",
      "/audio/voice/dino-tracks-eggs.mp3",
      "/audio/voice/dino-tracks-shake.mp3",
      "/audio/voice/dino-tracks-ferns.mp3",
      "/audio/voice/dino-tracks-legs.mp3",
      "/audio/voice/dino-tracks-bone.mp3",
      "/audio/voice/forest-area-welcome.mp3",
      "/audio/voice/forest-balloons-welcome.mp3",
      "/audio/voice/forest-campfire-station.mp3",
      "/audio/voice/forest-campfire-line.mp3",
      "/audio/voice/forest-campfire-done.mp3",
      "/audio/voice/forest-letter-trace.mp3",
      "/audio/voice/forest-quiz-bird.mp3",
      "/audio/voice/forest-quiz-pinecones.mp3",
      "/audio/voice/forest-fb-bird.mp3",
      "/audio/voice/forest-fb-bear.mp3",
      "/audio/voice/forest-fb-snake.mp3",
      "/audio/voice/forest-fb-pinecones-low.mp3",
      "/audio/voice/forest-fb-pinecones-yes.mp3",
      "/audio/voice/forest-fb-pinecones-again.mp3",
      "/audio/voice/weather-area-welcome.mp3",
      "/audio/voice/weather-porch-welcome.mp3",
      "/audio/voice/weather-puddle-station.mp3",
      "/audio/voice/weather-puddle-line.mp3",
      "/audio/voice/weather-puddle-done.mp3",
      "/audio/voice/weather-quiz-rain.mp3",
      "/audio/voice/weather-quiz-sun.mp3",
      "/audio/voice/weather-fb-umbrella.mp3",
      "/audio/voice/weather-fb-sunglasses.mp3",
      "/audio/voice/weather-fb-swimsuit.mp3",
      "/audio/voice/weather-fb-sun.mp3",
      "/audio/voice/weather-fb-moon.mp3",
      "/audio/voice/weather-fb-cloud.mp3",
      "/audio/voice/weather-porch-rain.mp3",
      "/audio/voice/weather-porch-sun.mp3",
      "/audio/voice/weather-porch-wind.mp3",
      "/audio/voice/weather-porch-snow.mp3",
      "/audio/voice/weather-porch-leaves.mp3",
      "/audio/voice/weather-porch-fog.mp3",
      "/audio/voice/weather-porch-thunder.mp3",
      "/audio/voice/weather-porch-spring.mp3",
      "/audio/voice/weather-porch-puddles.mp3",
      "/audio/voice/weather-porch-night.mp3",
      "/audio/voice/weather-porch-hail.mp3",
      "/audio/voice/weather-porch-rainbow.mp3",
      "/audio/voice/weather-porch-summer.mp3",
      "/audio/voice/weather-porch-dry.mp3",
      "/audio/voice/weather-porch-frost.mp3",
      "/audio/voice/weather-porch-dusk.mp3",
      "/audio/voice/space-area-welcome.mp3",
      "/audio/voice/space-picnic-welcome.mp3",
      "/audio/voice/space-scoop-station.mp3",
      "/audio/voice/space-scoop-line.mp3",
      "/audio/voice/space-scoop-done.mp3",
      "/audio/voice/space-quiz-launch.mp3",
      "/audio/voice/space-quiz-stars.mp3",
      "/audio/voice/space-story-welcome.mp3",
      "/audio/voice/space-fb-launch.mp3",
      "/audio/voice/space-fb-nap.mp3",
      "/audio/voice/space-fb-stars-low.mp3",
      "/audio/voice/space-fb-stars-yes.mp3",
      "/audio/voice/space-fb-stars-again.mp3",
      "/audio/voice/space-fb-story-start.mp3",
      "/audio/voice/space-story-open.mp3",
      "/audio/voice/space-story-stars.mp3",
      "/audio/voice/space-story-moon.mp3",
      "/audio/voice/space-story-fb-whoosh.mp3",
      "/audio/voice/space-story-fb-alert.mp3",
      "/audio/voice/space-story-fb-count.mp3",
      "/audio/voice/space-story-fb-four.mp3",
      "/audio/voice/space-story-fb-almost.mp3",
      "/audio/voice/space-story-fb-alien.mp3",
      "/audio/voice/space-story-fb-bounce.mp3",
      "/audio/voice/treasure-area-welcome.mp3",
      "/audio/voice/treasure-bubbles-welcome.mp3",
      "/audio/voice/treasure-quiz-key.mp3",
      "/audio/voice/treasure-fb-key.mp3",
      "/audio/voice/treasure-fb-spoon.mp3",
      "/audio/voice/treasure-fb-pencil.mp3",
      "/audio/voice/color-area-welcome.mp3",
      "/audio/voice/color-balloons-welcome.mp3",
      "/audio/voice/color-stamp-station.mp3",
      "/audio/voice/color-stamp-line.mp3",
      "/audio/voice/color-stamp-done.mp3",
      "/audio/voice/color-letter-trace.mp3",
      "/audio/voice/color-quiz-orange.mp3",
      "/audio/voice/color-quiz-green.mp3",
      "/audio/voice/color-fb-orange.mp3",
      "/audio/voice/color-fb-citrus.mp3",
      "/audio/voice/color-fb-warm.mp3",
      "/audio/voice/color-fb-green.mp3",
      "/audio/voice/color-fb-leaves.mp3",
      "/audio/voice/color-fb-garden.mp3",
      "/audio/voice/color-mix-atelier.mp3",
      "/audio/voice/color-mix-bead.mp3",
      "/audio/voice/color-mix-ink.mp3",
      "/audio/voice/color-mix-pink.mp3",
      "/audio/voice/color-mix-pink-rev.mp3",
      "/audio/voice/color-mix-cream.mp3",
      "/audio/voice/color-mix-cream-rev.mp3",
      "/audio/voice/color-mix-sky.mp3",
      "/audio/voice/color-mix-sky-rev.mp3",
      "/audio/voice/music-area-welcome.mp3",
      "/audio/voice/music-rhyme-welcome.mp3",
      "/audio/voice/music-drum-station.mp3",
      "/audio/voice/music-drum-line.mp3",
      "/audio/voice/music-drum-done.mp3",
      "/audio/voice/music-quiz-flute.mp3",
      "/audio/voice/music-fb-flute.mp3",
      "/audio/voice/music-fb-tuba.mp3",
      "/audio/voice/music-rhyme-paint.mp3",
      "/audio/voice/music-rhyme-bead.mp3",
      "/audio/voice/music-rhyme-song.mp3",
      "/audio/voice/music-rhyme-glue.mp3",
      "/audio/voice/music-rhyme-drum.mp3",
      "/audio/voice/music-rhyme-art.mp3",
      "/audio/voice/music-rhyme-note.mp3",
      "/audio/voice/music-rhyme-star.mp3",
      "/audio/voice/music-rhyme-red.mp3",
      "/audio/voice/music-rhyme-blue.mp3",
      "/audio/voice/music-rhyme-clay.mp3",
      "/audio/voice/music-rhyme-mark.mp3",
      "/audio/voice/music-rhyme-dot.mp3",
      "/audio/voice/music-rhyme-tune.mp3",
      "/audio/voice/music-rhyme-clip.mp3",
      "/audio/voice/music-rhyme-fold.mp3",
      "/audio/voice/pattern-area-welcome.mp3",
      "/audio/voice/pattern-beads-welcome.mp3",
      "/audio/voice/pattern-quiz-fruit.mp3",
      "/audio/voice/pattern-fb-apple.mp3",
      "/audio/voice/pattern-fb-donut.mp3",
      "/audio/voice/pattern-fb-grape.mp3",
      "/audio/voice/sticker-area-welcome.mp3",
      "/audio/voice/sticker-match-welcome.mp3",
      "/audio/voice/sticker-quiz-crown.mp3",
      "/audio/voice/sticker-fb-crown.mp3",
      "/audio/voice/sticker-fb-bucket.mp3",
      "/audio/voice/barn-area-welcome.mp3",
      "/audio/voice/barn-story-welcome.mp3",
      "/audio/voice/barn-fb-open.mp3",
      "/audio/voice/barn-story-open.mp3",
      "/audio/voice/barn-stones-station.mp3",
      "/audio/voice/barn-stones-line.mp3",
      "/audio/voice/barn-stones-done.mp3",
      "/audio/voice/barn-letter-trace.mp3",
      "/audio/voice/barn-pancake-welcome.mp3",
      "/audio/voice/barn-safari-welcome.mp3",
      "/audio/voice/barn-story-chicks.mp3",
      "/audio/voice/barn-story-horse.mp3",
      "/audio/voice/barn-story-tractor.mp3",
      "/audio/voice/barn-story-fb-cow.mp3",
      "/audio/voice/barn-story-fb-rooster.mp3",
      "/audio/voice/barn-story-fb-pig.mp3",
      "/audio/voice/barn-story-fb-one.mp3",
      "/audio/voice/barn-story-fb-three.mp3",
      "/audio/voice/barn-story-fb-five.mp3",
      "/audio/voice/barn-story-fb-apple.mp3",
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
    expect(narrationClipForText("Moooo! Yes, friendly dairy cow gives fresh milk!")?.id).toBe("voice.farm.fb.cow");
    expect(narrationClipForText("Cock a doodle doo! That's the morning rooster.")?.id).toBe("voice.farm.fb.rooster");
    expect(narrationClipForText("Munch crunch! Barnaby neighs with joy as he crunches the carrot!")?.id).toBe("voice.farm.fb.carrot");
    expect(narrationClipForText("Count the chicks. How many?")?.id).toBe("voice.farm.count.chicks");
    expect(narrationClipForText("A baker's dozen in the nest. How many eggs?")?.id).toBe("voice.farm.count.eggs");
    expect(narrationClipForText("Nine turkeys. Four go in. How many still in the yard?")?.id).toBe("voice.farm.count.turkeys");
  });

  it("maps Jungle Canopy closed-kit lines to voice-01", () => {
    expect(
      narrationClipForText("Jungle Canopy! Tall Treetops, Green Vines & Mysterious Calls. Let's explore together!")?.id,
    ).toBe("voice.jungle.area-welcome");
    expect(
      narrationClipForText("Listen to the treetop chatter! Who is swinging on the vines shouting ooh ooh aah aah?")?.id,
    ).toBe("voice.jungle.quiz-monkey");
    expect(narrationClipForText("Hold the vine. Swing across.")?.id).toBe("voice.jungle.vine-line");
    expect(narrationClipForText("Yes! Giant padded paws belong to the majestic lion!")?.id).toBe("voice.jungle.fb.lion-yes");
    expect(narrationClipForText("The ocean is home to fish and dolphins, not parrots!")?.id).toBe("voice.jungle.fb.ocean");
    expect(narrationClipForText("Look closer! There are more bananas up there.")?.id).toBe("voice.jungle.fb.bananas-low");
  });

  it("maps Ocean Reef closed-kit lines to voice-01", () => {
    expect(
      narrationClipForText("Ocean Reef! Turquoise Waves, Coral Gardens & Swimming Friends. Let's explore together!")?.id,
    ).toBe("voice.ocean.area-welcome");
    expect(
      narrationClipForText("Listen to the sparkling water! Who clicks happily and leaps high out of ocean waves?")?.id,
    ).toBe("voice.ocean.quiz-dolphin");
    expect(narrationClipForText("Drag flakes onto every fish.")?.id).toBe("voice.ocean.feed-line");
    expect(narrationClipForText("Click click splash! The dolphin leaps high and smiles!")?.id).toBe("voice.ocean.fb.dolphin");
    expect(narrationClipForText("An old rubber boot doesn't glow or swim!")?.id).toBe("voice.ocean.fb.boot");
    expect(narrationClipForText("Where does this reef friend live?")?.id).toBe("voice.ocean.reef-sort.welcome");
    expect(narrationClipForText("A fish by the coral. Where does it live?")?.id).toBe("voice.ocean.reef-sort.fish");
    expect(narrationClipForText("A plane over the reef. Is it a reef animal?")?.id).toBe("voice.ocean.reef-sort.plane");
  });

  it("maps Dino Valley closed-kit lines to voice-01", () => {
    expect(
      narrationClipForText(
        "Dino Valley! Prehistoric Jungles, Giant Footprints & Friendly Giants. Let's explore together!",
      )?.id,
    ).toBe("voice.dino.area-welcome");
    expect(
      narrationClipForText(
        "Who had the magnificent extra-long neck to reach sweet green leaves in the highest treetops?",
      )?.id,
    ).toBe("voice.dino.quiz-neck");
    expect(narrationClipForText("Drag four eggs into the nest.")?.id).toBe("voice.dino.nest-line");
    expect(narrationClipForText("ROOOOAR! Giant T-Rex takes big stomping steps across Dino Valley!")?.id).toBe(
      "voice.dino.fb.trex",
    );
    expect(narrationClipForText("Who walked in the valley?")?.id).toBe("voice.dino.tracks.welcome");
    expect(narrationClipForText("A stone bone in the cliff. Is the dinosaur here now?")?.id).toBe(
      "voice.dino.tracks.bone",
    );
  });

  it("maps Forest Trail closed-kit welcome to voice-01", () => {
    expect(
      narrationClipForText("Forest Trail! Pinecones, Singing Birds & Mossy Pathways. Let's explore together!")?.id,
    ).toBe("voice.forest.area-welcome");
    expect(narrationClipForText("Tap the forest sky balloons!")?.id).toBe("voice.forest.balloons-welcome");
    expect(
      narrationClipForText("Listen to the sweet forest song! Who sings chirp chirp tweedle dee high in the trees?")?.id,
    ).toBe("voice.forest.quiz-bird");
    expect(narrationClipForText("Hooray! 1, 2, 3 pinecones collected for craft time!")?.id).toBe(
      "voice.forest.fb.pinecones-yes",
    );
  });

  it("maps Weather Adventure closed-kit lines to voice-01", () => {
    expect(
      narrationClipForText(
        "Weather Adventure! Raindrops, Sunbeams & Dressing for the Day. Let's explore together!",
      )?.id,
    ).toBe("voice.weather.area-welcome");
    expect(
      narrationClipForText("Pitter patter rain is falling! What do we pop open to keep our head dry?")?.id,
    ).toBe("voice.weather.quiz-rain");
    expect(narrationClipForText("Drag the boot through the puddles.")?.id).toBe("voice.weather.puddle-line");
    expect(narrationClipForText("Pop! The umbrella shields us from every cool raindrop!")?.id).toBe(
      "voice.weather.fb.umbrella",
    );
    expect(narrationClipForText("It is raining on the porch. What should Pip wear?")?.id).toBe(
      "voice.weather.porch-rain",
    );
    expect(narrationClipForText("Orange leaves falling. Which season is it?")?.id).toBe("voice.weather.porch-leaves");
    expect(narrationClipForText("The rain stopped. A coloured arc is in the sky. What is it?")?.id).toBe(
      "voice.weather.porch-rainbow",
    );
    expect(narrationClipForText("White crunchy grass at dawn. What is on it?")?.id).toBe("voice.weather.porch-frost");
    expect(narrationClipForText("The lamp clicked on. The sky is peach. What time is it?")?.id).toBe(
      "voice.weather.porch-dusk",
    );
  });

  it("maps Space Blast-Off closed-kit lines to voice-01", () => {
    expect(
      narrationClipForText(
        "Space Blast-Off! Countdown 3-2-1, Twinkling Constellations & Moon Bounce. Let's explore together!",
      )?.id,
    ).toBe("voice.space.area-welcome");
    expect(
      narrationClipForText("Pip is ready! Countdown: 3, 2, 1! Tap the glowing launch button to blast off!")?.id,
    ).toBe("voice.space.quiz-launch");
    expect(narrationClipForText("Drag four scoops into the tin.")?.id).toBe("voice.space.scoop-line");
    expect(
      narrationClipForText("WHOOOOSH! Flames roar and the rocket zooms into the starlight!")?.id,
    ).toBe("voice.space.fb.launch");
    expect(
      narrationClipForText(
        "Rocket Pip Goes to the Moon. Pip puts on his space helmet! The rocket is ready to blast off. What button launches the rocket?",
      )?.id,
    ).toBe("voice.space.story-open");
    expect(narrationClipForText("Wheee! Bouncing high in low moon gravity!")?.id).toBe(
      "voice.space.story-fb.bounce",
    );
  });

  it("maps Treasure Quest closed-kit lines to voice-01", () => {
    expect(
      narrationClipForText(
        "Treasure Quest! Mysterious Island Maps & Golden Chests. Let's explore together!",
      )?.id,
    ).toBe("voice.treasure.area-welcome");
    expect(
      narrationClipForText(
        "The treasure chest is locked! What shiny golden item turns the keyhole to open it?",
      )?.id,
    ).toBe("voice.treasure.quiz-key");
    expect(narrationClipForText("Click clack! The golden key fits right into the lock!")?.id).toBe(
      "voice.treasure.fb.key",
    );
    expect(narrationClipForText("Spoons are for delicious soup, not locks!")?.id).toBe("voice.treasure.fb.spoon");
  });

  it("maps Color Magic Studio closed-kit lines to voice-01", () => {
    expect(
      narrationClipForText(
        "Color Magic Studio! Red, Yellow & Blue Droplets Creating New Wonders. Let's explore together!",
      )?.id,
    ).toBe("voice.color.area-welcome");
    expect(
      narrationClipForText("When we mix ruby Red with sunny Yellow paint, what magical color appears?")?.id,
    ).toBe("voice.color.quiz-orange");
    expect(narrationClipForText("Drag a stamp onto the wall. Six prints.")?.id).toBe("voice.color.stamp-line");
    expect(narrationClipForText("Hooray! Red plus Yellow creates juicy sweet Orange!")?.id).toBe(
      "voice.color.fb.orange",
    );
    expect(narrationClipForText("Red plus Yellow on the atelier paper!")?.id).toBe("voice.color.mix.atelier");
    expect(narrationClipForText("White plus Blue opens into Sky Blue!")?.id).toBe("voice.color.mix.sky-rev");
  });

  it("maps Music Garden closed-kit lines to voice-01", () => {
    expect(
      narrationClipForText(
        "Music Garden! Rainbow Piano, High Notes & Joyful Rhythm. Let's explore together!",
      )?.id,
    ).toBe("voice.music.area-welcome");
    expect(narrationClipForText("Find the rhyming friends in the music garden!")?.id).toBe(
      "voice.music.rhyme-welcome",
    );
    expect(narrationClipForText("Tap the drums from 1 to 8.")?.id).toBe("voice.music.drum-line");
    expect(
      narrationClipForText("Listen to the notes! Who sings high up in the sky like a sweet flute?")?.id,
    ).toBe("voice.music.quiz-flute");
    expect(narrationClipForText("What rhymes with Drum in the music garden?")?.id).toBe("voice.music.rhyme-drum");
    expect(narrationClipForText("What rhymes with Fold in the atelier?")?.id).toBe("voice.music.rhyme-fold");
  });

  it("maps Pattern Workshop closed-kit lines to voice-01", () => {
    expect(
      narrationClipForText(
        "Pattern Workshop! AB Patterns, Rhythm Chains & Matching Shapes. Let's explore together!",
      )?.id,
    ).toBe("voice.pattern.area-welcome");
    expect(narrationClipForText("Flip the workshop beads and find the match!")?.id).toBe(
      "voice.pattern.beads-welcome",
    );
    expect(narrationClipForText("Hooray! Apple comes next! A-B-A-B pattern complete!")?.id).toBe(
      "voice.pattern.fb.apple",
    );
  });

  it("maps Sticker Atelier closed-kit lines to voice-01", () => {
    expect(
      narrationClipForText(
        "Sticker Atelier! Personal Collections, Badges & Album Glitters. Let's explore together!",
      )?.id,
    ).toBe("voice.sticker.area-welcome");
    expect(
      narrationClipForText("Buddy worked so hard! Which shiny golden crown marks learning royalty?")?.id,
    ).toBe("voice.sticker.quiz-crown");
    expect(narrationClipForText("Flip the stickers and find the twin!")?.id).toBe("voice.sticker.match-welcome");
  });

  it("maps Barnyard Tales closed-kit lines to voice-01", () => {
    expect(
      narrationClipForText(
        "Barnyard Tales! Buddy's Sunny Farm Day & Animal Friends. Let's explore together!",
      )?.id,
    ).toBe("voice.barn.area-welcome");
    expect(
      narrationClipForText(
        "Buddy's Sunny Farm Day. Cock a doodle doo! The bright sun is rising over the farm. Who is waking up in the barn?",
      )?.id,
    ).toBe("voice.barn.story-open");
    expect(narrationClipForText("Tell the tale. Tap each stone in order.")?.id).toBe("voice.barn.stones-line");
    expect(
      narrationClipForText("Peep peep peep! Can you help Mother Hen count her sweet baby chicks?")?.id,
    ).toBe("voice.barn.story-chicks");
    expect(narrationClipForText("Yes! 1, 2, 3 fluffy yellow chicks! Good counting!")?.id).toBe(
      "voice.barn.story-fb.three",
    );
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
