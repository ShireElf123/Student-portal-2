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
      "/audio/voice/barn-story-fb-pizza.mp3",
      "/audio/voice/barn-story-fb-carrot.mp3",
      "/audio/voice/barn-story-fb-cheer.mp3",
      "/audio/voice/barn-pancake-open.mp3",
      "/audio/voice/barn-pancake-stir.mp3",
      "/audio/voice/barn-pancake-flip.mp3",
      "/audio/voice/barn-pancake-count.mp3",
      "/audio/voice/barn-pancake-share.mp3",
      "/audio/voice/barn-pancake-syrup.mp3",
      "/audio/voice/barn-pancake-fb-eggs.mp3",
      "/audio/voice/barn-pancake-fb-boots.mp3",
      "/audio/voice/barn-pancake-fb-circle.mp3",
      "/audio/voice/barn-pancake-fb-square.mp3",
      "/audio/voice/barn-pancake-fb-clap.mp3",
      "/audio/voice/barn-pancake-fb-whisper.mp3",
      "/audio/voice/barn-pancake-fb-five.mp3",
      "/audio/voice/barn-pancake-fb-two.mp3",
      "/audio/voice/barn-pancake-fb-thanks.mp3",
      "/audio/voice/barn-pancake-fb-mine.mp3",
      "/audio/voice/barn-pancake-fb-highfive.mp3",
      "/audio/voice/starlight-area-welcome.mp3",
      "/audio/voice/starlight-story-welcome.mp3",
      "/audio/voice/starlight-fb-open.mp3",
      "/audio/voice/starlight-balloons-welcome.mp3",
      "/audio/voice/starlight-rocket-station.mp3",
      "/audio/voice/starlight-rocket-line.mp3",
      "/audio/voice/starlight-rocket-done.mp3",
      "/audio/voice/starlight-snow-welcome.mp3",
      "/audio/voice/starlight-snow-open.mp3",
      "/audio/voice/starlight-snow-fb-mittens.mp3",
      "/audio/voice/starlight-snow-fb-goggles.mp3",
      "/audio/voice/starlight-snow-mailbox.mp3",
      "/audio/voice/starlight-snow-fb-hat.mp3",
      "/audio/voice/starlight-snow-fb-boat.mp3",
      "/audio/voice/starlight-snow-balls.mp3",
      "/audio/voice/starlight-snow-fb-three.mp3",
      "/audio/voice/starlight-snow-fb-eight.mp3",
      "/audio/voice/starlight-snow-plow.mp3",
      "/audio/voice/starlight-snow-fb-wave.mp3",
      "/audio/voice/starlight-snow-fb-hide.mp3",
      "/audio/voice/starlight-snow-cocoa.mp3",
      "/audio/voice/starlight-snow-fb-cocoa.mp3",
      "/audio/voice/starlight-snow-fb-soup.mp3",
      "/audio/voice/starlight-snow-lamps.mp3",
      "/audio/voice/starlight-snow-fb-night.mp3",
      "/audio/voice/sea-area-welcome.mp3",
      "/audio/voice/sea-story-welcome.mp3",
      "/audio/voice/sea-fb-open.mp3",
      "/audio/voice/sea-bubbles-welcome.mp3",
      "/audio/voice/sea-rhyme-welcome.mp3",
      "/audio/voice/sea-dive.mp3",
      "/audio/voice/sea-fb-turtle.mp3",
      "/audio/voice/sea-fb-crab.mp3",
      "/audio/voice/sea-fb-octopus.mp3",
      "/audio/voice/sea-jelly.mp3",
      "/audio/voice/sea-fb-pink.mp3",
      "/audio/voice/sea-fb-rock.mp3",
      "/audio/voice/sea-treasure.mp3",
      "/audio/voice/sea-fb-done.mp3",
      "/audio/voice/sea-q-turtle.mp3",
      "/audio/voice/sea-q-jelly.mp3",
      "/audio/voice/sea-q-stars.mp3",
      "/audio/voice/phonics-area-welcome.mp3",
      "/audio/voice/phonics-b-welcome.mp3",
      "/audio/voice/phonics-fb-bear.mp3",
      "/audio/voice/phonics-fb-apple.mp3",
      "/audio/voice/phonics-fb-cat.mp3",
      "/audio/voice/phonics-s-welcome.mp3",
      "/audio/voice/phonics-fb-star.mp3",
      "/audio/voice/phonics-rhyme-welcome.mp3",
      "/audio/voice/phonics-cue-buh.mp3",
      "/audio/voice/phonics-cue-sss.mp3",
      "/audio/voice/phonics-fb-elephant.mp3",
      "/audio/voice/phonics-fb-lion.mp3",
      "/audio/voice/phonics-blend-welcome.mp3",
      "/audio/voice/phonics-trace-welcome.mp3",
      "/audio/voice/phonics-pebbles-welcome.mp3",
      "/audio/voice/phonics-pebbles-line.mp3",
      "/audio/voice/phonics-pebbles-done.mp3",
      "/audio/voice/phonics-clue-b.mp3",
      "/audio/voice/phonics-clue-s.mp3",
      "/audio/voice/grove-area-welcome.mp3",
      "/audio/voice/grove-stars-welcome.mp3",
      "/audio/voice/grove-fb-four.mp3",
      "/audio/voice/grove-fb-one.mp3",
      "/audio/voice/grove-cue-tada.mp3",
      "/audio/voice/grove-clue-stars.mp3",
      "/audio/voice/grove-taxi-welcome.mp3",
      "/audio/voice/grove-frame-welcome.mp3",
      "/audio/voice/grove-dots-line.mp3",
      "/audio/voice/grove-dots-done.mp3",
      "/audio/voice/shapes-area-welcome.mp3",
      "/audio/voice/shapes-circle-welcome.mp3",
      "/audio/voice/shapes-fb-circle.mp3",
      "/audio/voice/shapes-fb-square.mp3",
      "/audio/voice/shapes-fb-triangle.mp3",
      "/audio/voice/shapes-cue-boing.mp3",
      "/audio/voice/shapes-clue-circle.mp3",
      "/audio/voice/shapes-balloons-welcome.mp3",
      "/audio/voice/shapes-cups-welcome.mp3",
      "/audio/voice/shapes-cups-line.mp3",
      "/audio/voice/shapes-cups-done.mp3",
      "/audio/voice/feelings-area-welcome.mp3",
      "/audio/voice/feelings-happy-welcome.mp3",
      "/audio/voice/feelings-fb-happy.mp3",
      "/audio/voice/feelings-fb-sleepy.mp3",
      "/audio/voice/feelings-fb-sad.mp3",
      "/audio/voice/feelings-cue-yay.mp3",
      "/audio/voice/feelings-clue-happy.mp3",
      "/audio/voice/feelings-memory-welcome.mp3",
      "/audio/voice/feelings-face-welcome.mp3",
      "/audio/voice/feelings-face-line.mp3",
      "/audio/voice/feelings-face-done.mp3",
      "/audio/voice/habits-area-welcome.mp3",
      "/audio/voice/habits-brush-welcome.mp3",
      "/audio/voice/habits-fb-brush.mp3",
      "/audio/voice/habits-fb-pillow.mp3",
      "/audio/voice/habits-fb-crayon.mp3",
      "/audio/voice/habits-sfx-brush.mp3",
      "/audio/voice/habits-cue-brush.mp3",
      "/audio/voice/habits-clue-brush.mp3",
      "/audio/voice/habits-clue-ears.mp3",
      "/audio/voice/habits-ears-welcome.mp3",
      "/audio/voice/habits-fb-ears.mp3",
      "/audio/voice/habits-cue-listen.mp3",
      "/audio/voice/habits-fb-eyes.mp3",
      "/audio/voice/habits-fb-nose.mp3",
      "/audio/voice/habits-piano-welcome.mp3",
      "/audio/voice/habits-brush-station.mp3",
      "/audio/voice/habits-brush-line.mp3",
      "/audio/voice/habits-brush-done.mp3",
      "/audio/voice/family-area-welcome.mp3",
      "/audio/voice/family-baby-welcome.mp3",
      "/audio/voice/family-clue-baby.mp3",
      "/audio/voice/family-fb-baby.mp3",
      "/audio/voice/family-cue-giggle.mp3",
      "/audio/voice/family-fb-grandpa.mp3",
      "/audio/voice/family-fb-puppy.mp3",
      "/audio/voice/family-rhyme-welcome.mp3",
      "/audio/voice/family-table-welcome.mp3",
      "/audio/voice/family-wash-welcome.mp3",
      "/audio/voice/family-trace-welcome.mp3",
      "/audio/voice/family-pour-welcome.mp3",
      "/audio/voice/family-socks-welcome.mp3",
      "/audio/voice/family-comb-welcome.mp3",
      "/audio/voice/family-table-line.mp3",
      "/audio/voice/family-table-done.mp3",
      "/audio/voice/family-wash-line.mp3",
      "/audio/voice/family-wash-done.mp3",
      "/audio/voice/garage-area-welcome.mp3",
      "/audio/voice/garage-bus-welcome.mp3",
      "/audio/voice/garage-fb-bus.mp3",
      "/audio/voice/garage-fb-fish.mp3",
      "/audio/voice/garage-fb-cloud.mp3",
      "/audio/voice/garage-clue-bus.mp3",
      "/audio/voice/garage-tyres-welcome.mp3",
      "/audio/voice/garage-fb-four.mp3",
      "/audio/voice/garage-fb-two.mp3",
      "/audio/voice/garage-fb-eight.mp3",
      "/audio/voice/garage-clue-tyres.mp3",
      "/audio/voice/garage-clue-tools.mp3",
      "/audio/voice/garage-tools-welcome.mp3",
      "/audio/voice/garage-fb-wrench.mp3",
      "/audio/voice/garage-fb-banana.mp3",
      "/audio/voice/garage-fb-duck.mp3",
      "/audio/voice/garage-clue-colour.mp3",
      "/audio/voice/garage-colour-welcome.mp3",
      "/audio/voice/garage-fb-yellow.mp3",
      "/audio/voice/garage-fb-notbus.mp3",
      "/audio/voice/garage-clue-letter.mp3",
      "/audio/voice/garage-letter-welcome.mp3",
      "/audio/voice/garage-fb-letter-b.mp3",
      "/audio/voice/garage-fb-letter-s.mp3",
      "/audio/voice/garage-fb-letter-m.mp3",
      "/audio/voice/garage-clue-lights.mp3",
      "/audio/voice/garage-lights-welcome.mp3",
      "/audio/voice/garage-fb-blue.mp3",
      "/audio/voice/garage-fb-green.mp3",
      "/audio/voice/garage-fb-red.mp3",
      "/audio/voice/garage-clue-bolts.mp3",
      "/audio/voice/garage-bolts-welcome.mp3",
      "/audio/voice/garage-fb-five.mp3",
      "/audio/voice/garage-fb-add.mp3",
      "/audio/voice/garage-fb-count.mp3",
      "/audio/voice/garage-clue-wheel.mp3",
      "/audio/voice/garage-wheel-welcome.mp3",
      "/audio/voice/garage-fb-circle.mp3",
      "/audio/voice/garage-fb-square.mp3",
      "/audio/voice/garage-fb-triangle.mp3",
      "/audio/voice/garage-bead-welcome.mp3",
      "/audio/voice/garage-truck-welcome.mp3",
      "/audio/voice/garage-truck-line.mp3",
      "/audio/voice/garage-truck-done.mp3",
      "/audio/voice/street-area-welcome.mp3",
      "/audio/voice/street-light-welcome.mp3",
      "/audio/voice/street-fb-stop.mp3",
      "/audio/voice/street-fb-wait.mp3",
      "/audio/voice/street-fb-watch.mp3",
      "/audio/voice/street-clue-light.mp3",
      "/audio/voice/street-fire-welcome.mp3",
      "/audio/voice/street-clue-fire.mp3",
      "/audio/voice/street-fb-fire.mp3",
      "/audio/voice/street-cue-neenaw.mp3",
      "/audio/voice/street-fb-baker.mp3",
      "/audio/voice/street-fb-duck.mp3",
      "/audio/voice/street-clue-sky.mp3",
      "/audio/voice/street-sky-welcome.mp3",
      "/audio/voice/street-fb-plane.mp3",
      "/audio/voice/street-fb-bus.mp3",
      "/audio/voice/street-fb-boat.mp3",
      "/audio/voice/street-clue-cones.mp3",
      "/audio/voice/street-cones-welcome.mp3",
      "/audio/voice/street-fb-six.mp3",
      "/audio/voice/street-fb-count.mp3",
      "/audio/voice/street-fb-nine.mp3",
      "/audio/voice/street-clue-cross.mp3",
      "/audio/voice/street-cross-welcome.mp3",
      "/audio/voice/street-fb-look.mp3",
      "/audio/voice/street-fb-looking.mp3",
      "/audio/voice/street-fb-rule.mp3",
      "/audio/voice/street-clue-truck.mp3",
      "/audio/voice/street-letter-welcome.mp3",
      "/audio/voice/street-fb-t.mp3",
      "/audio/voice/street-fb-b.mp3",
      "/audio/voice/street-fb-p.mp3",
      "/audio/voice/street-sign-welcome.mp3",
      "/audio/voice/street-fb-sign.mp3",
      "/audio/voice/street-fb-heart.mp3",
      "/audio/voice/street-fb-moon.mp3",
      "/audio/voice/street-lights-welcome.mp3",
      "/audio/voice/street-fb-green.mp3",
      "/audio/voice/street-fb-purple.mp3",
      "/audio/voice/street-fb-red-already.mp3",
      "/audio/voice/street-balloon-welcome.mp3",
      "/audio/voice/street-trace-welcome.mp3",
      "/audio/voice/street-wash-welcome.mp3",
      "/audio/voice/street-wash-line.mp3",
      "/audio/voice/street-wash-done.mp3",
      "/audio/voice/street-drive-welcome.mp3",
      "/audio/voice/street-busstop-welcome.mp3",
      "/audio/voice/runway-area-welcome.mp3",
      "/audio/voice/runway-whoosh-welcome.mp3",
      "/audio/voice/runway-clue-whoosh.mp3",
      "/audio/voice/runway-fb-plane.mp3",
      "/audio/voice/runway-fb-cow.mp3",
      "/audio/voice/runway-fb-sub.mp3",
      "/audio/voice/runway-planes-welcome.mp3",
      "/audio/voice/runway-clue-planes.mp3",
      "/audio/voice/runway-fb-five.mp3",
      "/audio/voice/runway-fb-apron.mp3",
      "/audio/voice/runway-fb-eight.mp3",
      "/audio/voice/runway-clue-belt.mp3",
      "/audio/voice/runway-belt-welcome.mp3",
      "/audio/voice/runway-fb-bags.mp3",
      "/audio/voice/runway-fb-penguin.mp3",
      "/audio/voice/runway-fb-tree.mp3",
      "/audio/voice/runway-clue-pilot.mp3",
      "/audio/voice/runway-pilot-welcome.mp3",
      "/audio/voice/runway-fb-cockpit.mp3",
      "/audio/voice/runway-fb-hold.mp3",
      "/audio/voice/runway-fb-runway.mp3",
      "/audio/voice/runway-clue-letter.mp3",
      "/audio/voice/runway-letter-welcome.mp3",
      "/audio/voice/runway-fb-p.mp3",
      "/audio/voice/runway-clue-seats.mp3",
      "/audio/voice/runway-seats-welcome.mp3",
      "/audio/voice/runway-fb-seven.mp3",
      "/audio/voice/runway-fb-rows.mp3",
      "/audio/voice/runway-clue-window.mp3",
      "/audio/voice/runway-window-welcome.mp3",
      "/audio/voice/runway-fb-oval.mp3",
      "/audio/voice/runway-fb-stars.mp3",
      "/audio/voice/runway-fb-cabin.mp3",
      "/audio/voice/runway-clue-blink.mp3",
      "/audio/voice/runway-blink-welcome.mp3",
      "/audio/voice/runway-fb-rest.mp3",
      "/audio/voice/runway-fb-blinks.mp3",
      "/audio/voice/runway-fb-blink.mp3",
      "/audio/voice/runway-balloon-welcome.mp3",
      "/audio/voice/runway-pack-welcome.mp3",
      "/audio/voice/runway-pack-line.mp3",
      "/audio/voice/runway-pack-done.mp3",
      "/audio/voice/harbour-area-welcome.mp3",
      "/audio/voice/harbour-horn-welcome.mp3",
      "/audio/voice/harbour-clue-horn.mp3",
      "/audio/voice/harbour-fb-ferry.mp3",
      "/audio/voice/harbour-cue-horn.mp3",
      "/audio/voice/harbour-fb-bike.mp3",
      "/audio/voice/harbour-fb-hen.mp3",
      "/audio/voice/harbour-water-welcome.mp3",
      "/audio/voice/harbour-clue-water.mp3",
      "/audio/voice/harbour-fb-boat.mp3",
      "/audio/voice/harbour-fb-bus.mp3",
      "/audio/voice/harbour-fb-plane.mp3",
      "/audio/voice/harbour-clue-buoys.mp3",
      "/audio/voice/harbour-buoys-welcome.mp3",
      "/audio/voice/harbour-fb-seven.mp3",
      "/audio/voice/harbour-fb-ten.mp3",
      "/audio/voice/harbour-clue-crane.mp3",
      "/audio/voice/harbour-crane-welcome.mp3",
      "/audio/voice/harbour-fb-crane.mp3",
      "/audio/voice/harbour-fb-kitten.mp3",
      "/audio/voice/harbour-fb-spoon.mp3",
      "/audio/voice/harbour-letter-welcome.mp3",
      "/audio/voice/harbour-fb-s.mp3",
      "/audio/voice/harbour-fb-h.mp3",
      "/audio/voice/harbour-fb-b-ship.mp3",
      "/audio/voice/harbour-rhyme-welcome.mp3",
      "/audio/voice/harbour-clue-rhyme.mp3",
      "/audio/voice/harbour-fb-coat.mp3",
      "/audio/voice/harbour-fb-ship-rhyme.mp3",
      "/audio/voice/harbour-fb-dock-rhyme.mp3",
      "/audio/voice/harbour-clue-crates.mp3",
      "/audio/voice/harbour-crates-welcome.mp3",
      "/audio/voice/harbour-fb-two-five.mp3",
      "/audio/voice/harbour-fb-stacks.mp3",
      "/audio/voice/harbour-clue-anchor.mp3",
      "/audio/voice/harbour-anchor-welcome.mp3",
      "/audio/voice/harbour-fb-bed.mp3",
      "/audio/voice/harbour-fb-bakery.mp3",
      "/audio/voice/harbour-fb-attic.mp3",
      "/audio/voice/harbour-bubble-welcome.mp3",
      "/audio/voice/harbour-coil-welcome.mp3",
      "/audio/voice/harbour-coil-line.mp3",
      "/audio/voice/harbour-coil-done.mp3",
      "/audio/voice/harbour-scoop-welcome.mp3",
      "/audio/voice/flower-area-welcome.mp3",
      "/audio/voice/flower-spots-welcome.mp3",
      "/audio/voice/flower-clue-spots.mp3",
      "/audio/voice/flower-fb-ladybird.mp3",
      "/audio/voice/flower-firefly-station.mp3",
      "/audio/voice/flower-firefly-line.mp3",
      "/audio/voice/flower-firefly-done.mp3",
      "/audio/voice/flower-letter-trace.mp3",
      "/audio/voice/flower-fb-whale.mp3",
      "/audio/voice/flower-fb-bus.mp3",
      "/audio/voice/flower-buzz-welcome.mp3",
      "/audio/voice/flower-fb-bee.mp3",
      "/audio/voice/flower-fb-frog.mp3",
      "/audio/voice/flower-fb-owl.mp3",
      "/audio/voice/flower-clue-buzz.mp3",
      "/audio/voice/flower-six-welcome.mp3",
      "/audio/voice/flower-clue-six.mp3",
      "/audio/voice/flower-fb-six.mp3",
      "/audio/voice/flower-fb-two-spots.mp3",
      "/audio/voice/flower-fb-nine.mp3",
      "/audio/voice/flower-petal-welcome.mp3",
      "/audio/voice/flower-clue-petal.mp3",
      "/audio/voice/flower-fb-petal-bee.mp3",
      "/audio/voice/flower-fb-shark.mp3",
      "/audio/voice/flower-fb-crane.mp3",
      "/audio/voice/flower-letter-welcome.mp3",
      "/audio/voice/flower-clue-letter.mp3",
      "/audio/voice/flower-fb-b-bee.mp3",
      "/audio/voice/flower-fb-d.mp3",
      "/audio/voice/flower-fb-s.mp3",
      "/audio/voice/flower-row-welcome.mp3",
      "/audio/voice/flower-fb-pink.mp3",
      "/audio/voice/flower-fb-blue.mp3",
      "/audio/voice/flower-fb-yellow.mp3",
      "/audio/voice/flower-rhyme-welcome.mp3",
      "/audio/voice/flower-clue-rhyme.mp3",
      "/audio/voice/flower-fb-tree.mp3",
      "/audio/voice/flower-fb-bug.mp3",
      "/audio/voice/flower-fb-leaf.mp3",
      "/audio/voice/flower-blooms-welcome.mp3",
      "/audio/voice/flower-clue-blooms.mp3",
      "/audio/voice/flower-fb-five.mp3",
      "/audio/voice/flower-fb-groups.mp3",
      "/audio/voice/flower-fb-both-blooms.mp3",
      "/audio/voice/pond-area-welcome.mp3",
      "/audio/voice/pond-skims-welcome.mp3",
      "/audio/voice/pond-clue-skims.mp3",
      "/audio/voice/pond-fb-dragonfly.mp3",
      "/audio/voice/pond-fb-hen.mp3",
      "/audio/voice/pond-fb-truck.mp3",
      "/audio/voice/pond-dew-station.mp3",
      "/audio/voice/pond-dew-line.mp3",
      "/audio/voice/pond-dew-done.mp3",
      "/audio/voice/pond-plant-welcome.mp3",
      "/audio/voice/pond-path-welcome.mp3",
      "/audio/voice/pond-clue-path.mp3",
      "/audio/voice/pond-fb-skater.mp3",
      "/audio/voice/pond-fb-ladybird.mp3",
      "/audio/voice/pond-pads-welcome.mp3",
      "/audio/voice/pond-clue-pads.mp3",
      "/audio/voice/pond-fb-eight.mp3",
      "/audio/voice/pond-fb-ring.mp3",
      "/audio/voice/pond-fb-eleven.mp3",
      "/audio/voice/pond-frog-welcome.mp3",
      "/audio/voice/pond-clue-frog.mp3",
      "/audio/voice/pond-fb-reeds.mp3",
      "/audio/voice/pond-fb-bakery.mp3",
      "/audio/voice/pond-fb-runway.mp3",
      "/audio/voice/pond-plop-welcome.mp3",
      "/audio/voice/pond-clue-plop.mp3",
      "/audio/voice/pond-fb-plop-frog.mp3",
      "/audio/voice/pond-fb-plane.mp3",
      "/audio/voice/pond-fb-bell.mp3",
      "/audio/voice/pond-letter-welcome.mp3",
      "/audio/voice/pond-clue-letter.mp3",
      "/audio/voice/pond-fb-p.mp3",
      "/audio/voice/pond-fb-b.mp3",
      "/audio/voice/pond-shape-welcome.mp3",
      "/audio/voice/pond-clue-shape.mp3",
      "/audio/voice/pond-fb-circle.mp3",
      "/audio/voice/pond-fb-star.mp3",
      "/audio/voice/pond-fb-square.mp3",
      "/audio/voice/pond-banks-welcome.mp3",
      "/audio/voice/pond-clue-banks.mp3",
      "/audio/voice/pond-fb-six-frogs.mp3",
      "/audio/voice/pond-fb-both-banks.mp3",
      "/audio/voice/night-area-welcome.mp3",
      "/audio/voice/night-chirp-welcome.mp3",
      "/audio/voice/night-clue-chirp.mp3",
      "/audio/voice/night-fb-cricket.mp3",
      "/audio/voice/night-fb-cow.mp3",
      "/audio/voice/night-fb-plane.mp3",
      "/audio/voice/night-lamp-welcome.mp3",
      "/audio/voice/night-clue-lamp.mp3",
      "/audio/voice/night-fb-moth.mp3",
      "/audio/voice/night-fb-bus.mp3",
      "/audio/voice/night-day-welcome.mp3",
      "/audio/voice/night-clue-day.mp3",
      "/audio/voice/night-fb-night-cricket.mp3",
      "/audio/voice/night-fb-day-bee.mp3",
      "/audio/voice/night-fb-rooster.mp3",
      "/audio/voice/night-moths-welcome.mp3",
      "/audio/voice/night-clue-moths.mp3",
      "/audio/voice/night-fb-four.mp3",
      "/audio/voice/night-fb-one-moth.mp3",
      "/audio/voice/night-fb-seven.mp3",
      "/audio/voice/night-lullaby-welcome.mp3",
      "/audio/voice/night-clue-lullaby.mp3",
      "/audio/voice/night-fb-soft.mp3",
      "/audio/voice/night-fb-crash.mp3",
      "/audio/voice/night-fb-shout.mp3",
      "/audio/voice/night-letter-welcome.mp3",
      "/audio/voice/night-clue-letter.mp3",
      "/audio/voice/night-fb-m.mp3",
      "/audio/voice/night-fb-n.mp3",
      "/audio/voice/night-who-welcome.mp3",
      "/audio/voice/night-clue-who.mp3",
      "/audio/voice/night-fb-nana.mp3",
      "/audio/voice/night-fb-pip.mp3",
      "/audio/voice/night-fb-dog.mp3",
      "/audio/voice/night-blink-welcome.mp3",
      "/audio/voice/night-fb-dim.mp3",
      "/audio/voice/night-fb-crash-pattern.mp3",
      "/audio/voice/night-fb-glow.mp3",
      "/audio/voice/compost-area-welcome.mp3",
      "/audio/voice/compost-digs-welcome.mp3",
      "/audio/voice/compost-clue-digs.mp3",
      "/audio/voice/compost-fb-worm.mp3",
      "/audio/voice/compost-fb-dolphin.mp3",
      "/audio/voice/compost-fb-plane.mp3",
      "/audio/voice/compost-water-station.mp3",
      "/audio/voice/compost-water-line.mp3",
      "/audio/voice/compost-water-done.mp3",
      "/audio/voice/compost-memory-welcome.mp3",
      "/audio/voice/compost-home-welcome.mp3",
      "/audio/voice/compost-clue-home.mp3",
      "/audio/voice/compost-fb-soil.mp3",
      "/audio/voice/compost-fb-fridge.mp3",
      "/audio/voice/compost-fb-sky.mp3",
      "/audio/voice/compost-heap-welcome.mp3",
      "/audio/voice/compost-clue-heap.mp3",
      "/audio/voice/compost-fb-peel.mp3",
      "/audio/voice/compost-fb-boot.mp3",
      "/audio/voice/compost-fb-key.mp3",
      "/audio/voice/compost-worms-welcome.mp3",
      "/audio/voice/compost-clue-worms.mp3",
      "/audio/voice/compost-fb-five.mp3",
      "/audio/voice/compost-fb-two-worms.mp3",
      "/audio/voice/compost-fb-eight-worms.mp3",
      "/audio/voice/compost-letter-welcome.mp3",
      "/audio/voice/compost-clue-letter.mp3",
      "/audio/voice/compost-fb-w.mp3",
      "/audio/voice/compost-fb-m.mp3",
      "/audio/voice/compost-fb-v.mp3",
      "/audio/voice/compost-piles-welcome.mp3",
      "/audio/voice/compost-clue-piles.mp3",
      "/audio/voice/compost-fb-eight-leaves.mp3",
      "/audio/voice/compost-fb-both-piles.mp3",
      "/audio/voice/compost-rhyme-welcome.mp3",
      "/audio/voice/compost-clue-rhyme.mp3",
      "/audio/voice/compost-fb-dog.mp3",
      "/audio/voice/compost-fb-leaf.mp3",
      "/audio/voice/compost-fb-worm-rhyme.mp3",
      "/audio/voice/compost-damp-welcome.mp3",
      "/audio/voice/compost-clue-damp.mp3",
      "/audio/voice/compost-fb-slide.mp3",
      "/audio/voice/compost-fb-boats.mp3",
      "/audio/voice/compost-fb-fire.mp3",
      "/audio/voice/compost-sort-welcome.mp3",
      "/audio/voice/compost-clue-sort.mp3",
      "/audio/voice/fruit-area-welcome.mp3",
      "/audio/voice/fruit-orange-welcome.mp3",
      "/audio/voice/fruit-clue-orange.mp3",
      "/audio/voice/fruit-fb-orange.mp3",
      "/audio/voice/fruit-fb-pea.mp3",
      "/audio/voice/fruit-fb-loaf.mp3",
      "/audio/voice/fruit-apples-welcome.mp3",
      "/audio/voice/fruit-clue-apples.mp3",
      "/audio/voice/fruit-fb-five.mp3",
      "/audio/voice/fruit-fb-two-apples.mp3",
      "/audio/voice/fruit-fb-eight-apples.mp3",
      "/audio/voice/fruit-veg-welcome.mp3",
      "/audio/voice/fruit-clue-veg.mp3",
      "/audio/voice/fruit-fb-carrot.mp3",
      "/audio/voice/fruit-fb-banana.mp3",
      "/audio/voice/fruit-fb-cake.mp3",
      "/audio/voice/fruit-jam-welcome.mp3",
      "/audio/voice/fruit-clue-jam.mp3",
      "/audio/voice/fruit-fb-orange-jam.mp3",
      "/audio/voice/fruit-fb-blue-jam.mp3",
      "/audio/voice/fruit-fb-black-jam.mp3",
      "/audio/voice/fruit-letter-welcome.mp3",
      "/audio/voice/fruit-clue-letter.mp3",
      "/audio/voice/fruit-fb-a.mp3",
      "/audio/voice/fruit-fb-b.mp3",
      "/audio/voice/fruit-fb-p.mp3",
      "/audio/voice/fruit-row-welcome.mp3",
      "/audio/voice/fruit-fb-pear.mp3",
      "/audio/voice/fruit-fb-melon.mp3",
      "/audio/voice/fruit-fb-apple-row.mp3",
      "/audio/voice/fruit-bags-welcome.mp3",
      "/audio/voice/fruit-clue-bags.mp3",
      "/audio/voice/fruit-fb-six-pears.mp3",
      "/audio/voice/fruit-fb-both-bags.mp3",
      "/audio/voice/fruit-rhyme-welcome.mp3",
      "/audio/voice/fruit-clue-rhyme.mp3",
      "/audio/voice/fruit-fb-bear.mp3",
      "/audio/voice/fruit-fb-apple-rhyme.mp3",
      "/audio/voice/fruit-fb-plum.mp3",
      "/audio/voice/fruit-stack-station.mp3",
      "/audio/voice/fruit-stack-line.mp3",
      "/audio/voice/fruit-stack-done.mp3",
      "/audio/voice/fruit-mix-welcome.mp3",
      "/audio/voice/fruit-clue-mix.mp3",
      "/audio/voice/bakery-area-welcome.mp3",
      "/audio/voice/bakery-bakes-welcome.mp3",
      "/audio/voice/bakery-clue-bakes.mp3",
      "/audio/voice/bakery-fb-baker.mp3",
      "/audio/voice/bakery-fb-pilot.mp3",
      "/audio/voice/bakery-fb-frog.mp3",
      "/audio/voice/bakery-knead-station.mp3",
      "/audio/voice/bakery-knead-line.mp3",
      "/audio/voice/bakery-knead-done.mp3",
      "/audio/voice/bakery-letter-trace.mp3",
      "/audio/voice/bakery-buns-welcome.mp3",
      "/audio/voice/bakery-clue-buns.mp3",
      "/audio/voice/bakery-fb-six.mp3",
      "/audio/voice/bakery-fb-tray.mp3",
      "/audio/voice/bakery-fb-nine.mp3",
      "/audio/voice/bakery-oven-welcome.mp3",
      "/audio/voice/bakery-clue-oven.mp3",
      "/audio/voice/bakery-fb-loaf.mp3",
      "/audio/voice/bakery-fb-milk.mp3",
      "/audio/voice/bakery-fb-ice.mp3",
      "/audio/voice/bakery-letter-welcome.mp3",
      "/audio/voice/bakery-clue-letter.mp3",
      "/audio/voice/bakery-fb-b.mp3",
      "/audio/voice/bakery-fb-d.mp3",
      "/audio/voice/bakery-fb-p.mp3",
      "/audio/voice/bakery-blend-welcome.mp3",
      "/audio/voice/bakery-clue-blend.mp3",
      "/audio/voice/bakery-fb-br.mp3",
      "/audio/voice/bakery-fb-st.mp3",
      "/audio/voice/bakery-fb-fl.mp3",
      "/audio/voice/bakery-pattern-welcome.mp3",
      "/audio/voice/bakery-fb-ab-loaf.mp3",
      "/audio/voice/bakery-fb-fish.mp3",
      "/audio/voice/bakery-fb-happened.mp3",
      "/audio/voice/bakery-where-welcome.mp3",
      "/audio/voice/bakery-clue-where.mp3",
      "/audio/voice/bakery-fb-window.mp3",
      "/audio/voice/bakery-fb-not-oven.mp3",
      "/audio/voice/bakery-fb-kitchen.mp3",
      "/audio/voice/bakery-tin-welcome.mp3",
      "/audio/voice/bakery-clue-tin.mp3",
      "/audio/voice/bakery-fb-round.mp3",
      "/audio/voice/bakery-fb-square.mp3",
      "/audio/voice/bakery-fb-star.mp3",
      "/audio/voice/bakery-memory-welcome.mp3",
      "/audio/voice/bakery-clue-memory.mp3",
      "/audio/voice/bakery-shape-welcome.mp3",
      "/audio/voice/bakery-clue-shape.mp3",
      "/audio/voice/bakery-clue-letter-trace.mp3",
      "/audio/voice/bakery-clue-knead.mp3",
      "/audio/voice/soup-area-welcome.mp3",
      "/audio/voice/soup-stirs-welcome.mp3",
      "/audio/voice/soup-clue-stirs.mp3",
      "/audio/voice/soup-fb-spoon.mp3",
      "/audio/voice/soup-fb-key.mp3",
      "/audio/voice/soup-fb-shoe.mp3",
      "/audio/voice/soup-carrots-welcome.mp3",
      "/audio/voice/soup-clue-carrots.mp3",
      "/audio/voice/soup-fb-four.mp3",
      "/audio/voice/soup-fb-count.mp3",
      "/audio/voice/soup-fb-seven.mp3",
      "/audio/voice/soup-hot-welcome.mp3",
      "/audio/voice/soup-clue-hot.mp3",
      "/audio/voice/soup-fb-wait.mp3",
      "/audio/voice/soup-fb-touch.mp3",
      "/audio/voice/soup-fb-floor.mp3",
      "/audio/voice/soup-sort-welcome.mp3",
      "/audio/voice/soup-clue-sort.mp3",
      "/audio/voice/soup-fb-onion.mp3",
      "/audio/voice/soup-fb-sock.mp3",
      "/audio/voice/soup-fb-crayon.mp3",
      "/audio/voice/soup-letter-welcome.mp3",
      "/audio/voice/soup-clue-letter.mp3",
      "/audio/voice/soup-fb-s.mp3",
      "/audio/voice/soup-fb-z.mp3",
      "/audio/voice/soup-fb-c.mp3",
      "/audio/voice/soup-spoons-welcome.mp3",
      "/audio/voice/soup-clue-spoons.mp3",
      "/audio/voice/soup-fb-five.mp3",
      "/audio/voice/soup-fb-lots.mp3",
      "/audio/voice/soup-who-welcome.mp3",
      "/audio/voice/soup-clue-who.mp3",
      "/audio/voice/soup-fb-nana.mp3",
      "/audio/voice/soup-fb-pip.mp3",
      "/audio/voice/soup-fb-cat.mp3",
      "/audio/voice/soup-chop-welcome.mp3",
      "/audio/voice/soup-clue-chop.mp3",
      "/audio/voice/soup-fb-chop.mp3",
      "/audio/voice/soup-fb-nap.mp3",
      "/audio/voice/soup-fb-rest.mp3",
      "/audio/voice/soup-mix-welcome.mp3",
      "/audio/voice/soup-clue-mix.mp3",
      "/audio/voice/soup-stir-welcome.mp3",
      "/audio/voice/soup-clue-stir.mp3",
      "/audio/voice/picnic-area-welcome.mp3",
      "/audio/voice/picnic-pack-welcome.mp3",
      "/audio/voice/picnic-clue-pack.mp3",
      "/audio/voice/picnic-fb-sandwich.mp3",
      "/audio/voice/picnic-fb-hammer.mp3",
      "/audio/voice/picnic-fb-tyre.mp3",
      "/audio/voice/picnic-cups-welcome.mp3",
      "/audio/voice/picnic-clue-cups.mp3",
      "/audio/voice/picnic-fb-four.mp3",
      "/audio/voice/picnic-fb-every.mp3",
      "/audio/voice/picnic-fb-seven.mp3",
      "/audio/voice/picnic-sarnies-welcome.mp3",
      "/audio/voice/picnic-clue-sarnies.mp3",
      "/audio/voice/picnic-fb-packs.mp3",
      "/audio/voice/picnic-who-welcome.mp3",
      "/audio/voice/picnic-clue-who.mp3",
      "/audio/voice/picnic-fb-ant.mp3",
      "/audio/voice/picnic-fb-whale.mp3",
      "/audio/voice/picnic-letter-welcome.mp3",
      "/audio/voice/picnic-clue-letter.mp3",
      "/audio/voice/picnic-fb-p.mp3",
      "/audio/voice/picnic-fb-b.mp3",
      "/audio/voice/picnic-fb-n.mp3",
      "/audio/voice/picnic-cloth-welcome.mp3",
      "/audio/voice/picnic-clue-cloth.mp3",
      "/audio/voice/picnic-fb-square.mp3",
      "/audio/voice/picnic-fb-corners.mp3",
      "/audio/voice/picnic-fb-sides.mp3",
      "/audio/voice/picnic-where-welcome.mp3",
      "/audio/voice/picnic-clue-where.mp3",
      "/audio/voice/picnic-fb-cloth.mp3",
      "/audio/voice/picnic-fb-trail.mp3",
      "/audio/voice/picnic-fb-road.mp3",
      "/audio/voice/picnic-clue-row.mp3",
      "/audio/voice/picnic-sort-welcome.mp3",
      "/audio/voice/picnic-clue-sort.mp3",
      "/audio/voice/picnic-pancake-welcome.mp3",
      "/audio/voice/picnic-clue-pancake.mp3",
      "/audio/voice/picnic-pancake-done.mp3",
      "/audio/voice/fire-area-welcome.mp3",
      "/audio/voice/fire-clue-truck.mp3",
      "/audio/voice/fire-fb-crew.mp3",
      "/audio/voice/fire-fb-penguin.mp3",
      "/audio/voice/fire-helmets-welcome.mp3",
      "/audio/voice/fire-clue-helmets.mp3",
      "/audio/voice/fire-fb-three.mp3",
      "/audio/voice/fire-fb-peg.mp3",
      "/audio/voice/fire-fb-six.mp3",
      "/audio/voice/fire-rack-welcome.mp3",
      "/audio/voice/fire-clue-rack.mp3",
      "/audio/voice/fire-fb-hose.mp3",
      "/audio/voice/fire-fb-book.mp3",
      "/audio/voice/fire-letter-welcome.mp3",
      "/audio/voice/fire-clue-letter.mp3",
      "/audio/voice/fire-fb-f.mp3",
      "/audio/voice/fire-fb-s.mp3",
      "/audio/voice/fire-who-welcome.mp3",
      "/audio/voice/fire-clue-who.mp3",
      "/audio/voice/fire-fb-bell.mp3",
      "/audio/voice/fire-fb-ran.mp3",
      "/audio/voice/fire-fb-nap.mp3",
      "/audio/voice/fire-badge-welcome.mp3",
      "/audio/voice/fire-clue-badge.mp3",
      "/audio/voice/fire-fb-circle.mp3",
      "/audio/voice/fire-fb-square.mp3",
      "/audio/voice/fire-fb-star.mp3",
      "/audio/voice/fire-boots-welcome.mp3",
      "/audio/voice/fire-clue-boots.mp3",
      "/audio/voice/fire-fb-four.mp3",
      "/audio/voice/fire-fb-lockers.mp3",
      "/audio/voice/fire-dog-welcome.mp3",
      "/audio/voice/fire-clue-dog.mp3",
      "/audio/voice/fire-fb-dal.mp3",
      "/audio/voice/fire-fb-owl.mp3",
      "/audio/voice/fire-balloons-welcome.mp3",
      "/audio/voice/fire-clue-balloons.mp3",
      "/audio/voice/fire-hose-welcome.mp3",
      "/audio/voice/fire-clue-hose.mp3",
      "/audio/voice/fire-hose-line.mp3",
      "/audio/voice/fire-hose-done.mp3",
      "/audio/voice/park-area-welcome.mp3",
      "/audio/voice/park-ducks-welcome.mp3",
      "/audio/voice/park-clue-ducks.mp3",
      "/audio/voice/park-fb-five.mp3",
      "/audio/voice/park-fb-pond.mp3",
      "/audio/voice/park-play-welcome.mp3",
      "/audio/voice/park-clue-play.mp3",
      "/audio/voice/park-fb-swing.mp3",
      "/audio/voice/park-fb-lorry.mp3",
      "/audio/voice/park-fb-oven.mp3",
      "/audio/voice/park-quack-welcome.mp3",
      "/audio/voice/park-clue-quack.mp3",
      "/audio/voice/park-fb-duck.mp3",
      "/audio/voice/park-cue-quack.mp3",
      "/audio/voice/park-fb-lion.mp3",
      "/audio/voice/park-fb-truck.mp3",
      "/audio/voice/park-letter-welcome.mp3",
      "/audio/voice/park-clue-letter.mp3",
      "/audio/voice/park-fb-d.mp3",
      "/audio/voice/park-fb-b.mp3",
      "/audio/voice/park-fb-g.mp3",
      "/audio/voice/park-pond-welcome.mp3",
      "/audio/voice/park-clue-pond.mp3",
      "/audio/voice/park-fb-circle.mp3",
      "/audio/voice/park-fb-square.mp3",
      "/audio/voice/park-fb-triangle.mp3",
      "/audio/voice/park-balls-welcome.mp3",
      "/audio/voice/park-clue-balls.mp3",
      "/audio/voice/park-swing-welcome.mp3",
      "/audio/voice/park-fb-nana.mp3",
      "/audio/voice/park-fb-dog.mp3",
      "/audio/voice/park-fb-pip.mp3",
      "/audio/voice/park-where-welcome.mp3",
      "/audio/voice/park-clue-where.mp3",
      "/audio/voice/park-fb-bench.mp3",
      "/audio/voice/park-fb-not-pond.mp3",
      "/audio/voice/park-fb-not-park.mp3",
      "/audio/voice/park-clue-safari.mp3",
      "/audio/voice/park-pigeon-welcome.mp3",
      "/audio/voice/park-clue-pigeon.mp3",
      "/audio/voice/park-pigeon-line.mp3",
      "/audio/voice/park-pigeon-done.mp3",
      "/audio/voice/park-trace-welcome.mp3",
      "/audio/voice/park-clue-trace.mp3",
      "/audio/voice/nook-area-welcome.mp3",
      "/audio/voice/nook-books-welcome.mp3",
      "/audio/voice/nook-clue-books.mp3",
      "/audio/voice/nook-fb-shelf.mp3",
      "/audio/voice/nook-fb-fridge.mp3",
      "/audio/voice/nook-letter-welcome.mp3",
      "/audio/voice/nook-clue-letter.mp3",
      "/audio/voice/nook-fb-l.mp3",
      "/audio/voice/nook-fb-r.mp3",
      "/audio/voice/nook-fb-b.mp3",
      "/audio/voice/nook-count-welcome.mp3",
      "/audio/voice/nook-clue-count.mp3",
      "/audio/voice/nook-fb-seven.mp3",
      "/audio/voice/nook-fb-box.mp3",
      "/audio/voice/nook-fb-ten.mp3",
      "/audio/voice/nook-quiet-welcome.mp3",
      "/audio/voice/nook-clue-quiet.mp3",
      "/audio/voice/nook-fb-whisper.mp3",
      "/audio/voice/nook-fb-drum.mp3",
      "/audio/voice/nook-fb-siren.mp3",
      "/audio/voice/nook-who-welcome.mp3",
      "/audio/voice/nook-clue-who.mp3",
      "/audio/voice/nook-fb-nana.mp3",
      "/audio/voice/nook-fb-pip.mp3",
      "/audio/voice/nook-fb-duck.mp3",
      "/audio/voice/nook-rhyme-welcome.mp3",
      "/audio/voice/nook-clue-rhyme.mp3",
      "/audio/voice/nook-fb-hook.mp3",
      "/audio/voice/nook-fb-rhyme-shelf.mp3",
      "/audio/voice/nook-fb-page.mp3",
      "/audio/voice/nook-fb-gold.mp3",
      "/audio/voice/nook-stacks-welcome.mp3",
      "/audio/voice/nook-clue-stacks.mp3",
      "/audio/voice/nook-fb-six.mp3",
      "/audio/voice/nook-story-welcome.mp3",
      "/audio/voice/nook-clue-story.mp3",
      "/audio/voice/nook-land-welcome.mp3",
      "/audio/voice/nook-clue-land.mp3",
      "/audio/voice/market-area-welcome.mp3",
      "/audio/voice/market-bell-welcome.mp3",
      "/audio/voice/market-clue-bell.mp3",
      "/audio/voice/market-fb-seller.mp3",
      "/audio/voice/market-fb-owl.mp3",
      "/audio/voice/market-kites-welcome.mp3",
      "/audio/voice/market-clue-kites.mp3",
      "/audio/voice/market-fb-four.mp3",
      "/audio/voice/market-fb-every.mp3",
      "/audio/voice/market-fb-seven.mp3",
      "/audio/voice/market-sign-welcome.mp3",
      "/audio/voice/market-clue-sign.mp3",
      "/audio/voice/market-fb-square.mp3",
      "/audio/voice/market-fb-corners.mp3",
      "/audio/voice/market-fb-heart.mp3",
      "/audio/voice/market-hat-welcome.mp3",
      "/audio/voice/market-clue-hat.mp3",
      "/audio/voice/market-fb-cap.mp3",
      "/audio/voice/market-fb-fish.mp3",
      "/audio/voice/market-fb-hose.mp3",
      "/audio/voice/market-letter-welcome.mp3",
      "/audio/voice/market-clue-letter.mp3",
      "/audio/voice/market-fb-m.mp3",
      "/audio/voice/market-fb-n.mp3",
      "/audio/voice/market-fb-k.mp3",
      "/audio/voice/market-coins-welcome.mp3",
      "/audio/voice/market-clue-coins.mp3",
      "/audio/voice/market-fb-purses.mp3",
      "/audio/voice/market-nana-welcome.mp3",
      "/audio/voice/market-clue-nana.mp3",
      "/audio/voice/market-fb-redcap.mp3",
      "/audio/voice/market-fb-kite.mp3",
      "/audio/voice/market-fb-stall.mp3",
      "/audio/voice/market-awning-welcome.mp3",
      "/audio/voice/market-fb-white.mp3",
      "/audio/voice/market-fb-green.mp3",
      "/audio/voice/market-color-welcome.mp3",
      "/audio/voice/market-clue-color.mp3",
      "/audio/voice/market-bag-welcome.mp3",
      "/audio/voice/market-clue-bag.mp3",
      "/audio/voice/market-rhyme-welcome.mp3",
      "/audio/voice/market-clue-rhyme.mp3",
      "/audio/voice/ice-area-welcome.mp3",
      "/audio/voice/ice-hop-welcome.mp3",
      "/audio/voice/ice-clue-hop.mp3",
      "/audio/voice/ice-fb-penguin.mp3",
      "/audio/voice/ice-fb-camel.mp3",
      "/audio/voice/ice-fish-welcome.mp3",
      "/audio/voice/ice-clue-fish.mp3",
      "/audio/voice/ice-fb-six.mp3",
      "/audio/voice/ice-fb-gift.mp3",
      "/audio/voice/ice-fb-nine.mp3",
      "/audio/voice/ice-home-welcome.mp3",
      "/audio/voice/ice-clue-home.mp3",
      "/audio/voice/ice-fb-ice.mp3",
      "/audio/voice/ice-fb-warm.mp3",
      "/audio/voice/ice-fb-desert.mp3",
      "/audio/voice/ice-sort-welcome.mp3",
      "/audio/voice/ice-clue-sort.mp3",
      "/audio/voice/ice-fb-hop.mp3",
      "/audio/voice/ice-fb-horse.mp3",
      "/audio/voice/ice-letter-welcome.mp3",
      "/audio/voice/ice-clue-letter.mp3",
      "/audio/voice/ice-fb-p.mp3",
      "/audio/voice/ice-fb-b.mp3",
      "/audio/voice/ice-fb-g.mp3",
      "/audio/voice/ice-huddle-welcome.mp3",
      "/audio/voice/ice-clue-huddle.mp3",
      "/audio/voice/ice-fb-huddles.mp3",
      "/audio/voice/ice-rhyme-welcome.mp3",
      "/audio/voice/ice-clue-rhyme.mp3",
      "/audio/voice/ice-fb-go.mp3",
      "/audio/voice/ice-fb-norhyme-ice.mp3",
      "/audio/voice/ice-fb-norhyme-fish.mp3",
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
    expect(
      narrationClipForText("High five! You finished Buddy's Farm Adventure and earned 3 stars!")?.id,
    ).toBe("voice.barn.story-fb.cheer");
    expect(
      narrationClipForText("Pancake Saturday. Saturday! Nana taps the bowl. What do we crack into breakfast?")?.id,
    ).toBe("voice.barn.pancake-open");
    expect(narrationClipForText("High five! Pancake Saturday is done.")?.id).toBe(
      "voice.barn.pancake-fb.highfive",
    );
  });

  it("maps Starlight Tales closed-kit lines to voice-01", () => {
    expect(
      narrationClipForText("Starlight Tales! Rocket Pip Goes to the Moon. Let's explore together!")?.id,
    ).toBe("voice.starlight.area-welcome");
    expect(
      narrationClipForText("Snow Day on Maple Street. Snow day! What do we put on first?")?.id,
    ).toBe("voice.starlight.snow-open");
    expect(narrationClipForText("Drag five stars onto the rocket, then hold to launch.")?.id).toBe(
      "voice.starlight.rocket-line",
    );
    expect(narrationClipForText("How many snowballs make the pal?")?.id).toBe("voice.starlight.snow-balls");
    expect(narrationClipForText("Peek-a-boo, then a wave. The plow likes waves.")?.id).toBe(
      "voice.starlight.snow-fb.hide",
    );
    expect(narrationClipForText("Goodnight Maple Street. The pal keeps watch.")?.id).toBe(
      "voice.starlight.snow-fb.night",
    );
  });

  it("maps Deep Sea Tales closed-kit lines to voice-01", () => {
    expect(
      narrationClipForText(
        "Deep Sea Tales! Deep Sea Submarine Journey & Captain Turtle. Let's explore together!",
      )?.id,
    ).toBe("voice.sea.area-welcome");
    expect(
      narrationClipForText("Glug glug glug! Climb aboard the yellow submarine for an ocean journey!")?.id,
    ).toBe("voice.sea.story-welcome");
    expect(narrationClipForText("Pop the deep-sea story bubbles!")?.id).toBe("voice.sea.bubbles-welcome");
    expect(
      narrationClipForText(
        "Glug glug glug! Down goes our yellow submarine! Can you spot the ocean creature with a hard shell?",
      )?.id,
    ).toBe("voice.sea.dive");
    expect(narrationClipForText("Splish splash! You completed the submarine dive!")?.id).toBe(
      "voice.sea.fb.done",
    );
    expect(narrationClipForText("Claim your explorer ocean stars!")?.id).toBe("voice.sea.q.stars");
  });

  it("maps Phonics Meadow closed-kit lines to voice-01", () => {
    expect(
      narrationClipForText(
        "Phonics Meadow! Letter Sounds, Beginning Words & Singing Letters. Let's explore together!",
      )?.id,
    ).toBe("voice.phonics.area-welcome");
    expect(
      narrationClipForText("B says buh! Which item starts with the buh buh sound of letter B?")?.id,
    ).toBe("voice.phonics.b-welcome");
    expect(narrationClipForText("Yes! B is for Bear! Buh buh Bear!")?.id).toBe("voice.phonics.fb.bear");
    expect(narrationClipForText("Find the rhyming friends in the meadow garden!")?.id).toBe(
      "voice.phonics.rhyme-welcome",
    );
    expect(narrationClipForText("Buh buh!")?.id).toBe("voice.phonics.cue.buh");
    expect(narrationClipForText("The meadow counted with you!")?.id).toBe("voice.phonics.pebbles-done");
    expect(
      narrationClipForText(
        "S says /s/! Can you find what sparkles in the night sky with the /s/ /s/ sound?",
      )?.id,
    ).toBe("voice.phonics.clue.s");
  });

  it("maps Counting Grove closed-kit lines to voice-01", () => {
    expect(
      narrationClipForText(
        "Counting Grove! Carrots, Strawberries & More vs. Less Comparisons. Let's explore together!",
      )?.id,
    ).toBe("voice.grove.area-welcome");
    expect(
      narrationClipForText("Look at both groups: which one has MORE shiny golden stars?")?.id,
    ).toBe("voice.grove.stars-welcome");
    expect(narrationClipForText("Fill the ten-frame taxi in the counting grove!")?.id).toBe(
      "voice.grove.taxi-welcome",
    );
    expect(narrationClipForText("Ten. A full frame!")?.id).toBe("voice.grove.dots-done");
  });

  it("maps Shapes & Patterns closed-kit lines to voice-01", () => {
    expect(
      narrationClipForText(
        "Shapes & Patterns! Circles, Squares, Triangles & Star Bridges. Let's explore together!",
      )?.id,
    ).toBe("voice.shapes.area-welcome");
    expect(
      narrationClipForText(
        "I have no sharp corners and roll round and round like a ball! Which shape am I?",
      )?.id,
    ).toBe("voice.shapes.circle-welcome");
    expect(narrationClipForText("Tap the shape-sky balloons!")?.id).toBe("voice.shapes.balloons-welcome");
    expect(narrationClipForText("A wobbly tower!")?.id).toBe("voice.shapes.cups-done");
  });

  it("maps Feelings & Emotions closed-kit lines to voice-01", () => {
    expect(
      narrationClipForText(
        "Feelings & Emotions! Big Smiles, Gentle Breaths & Kind Hearts. Let's explore together!",
      )?.id,
    ).toBe("voice.feelings.area-welcome");
    expect(
      narrationClipForText(
        "Can you tap the friend who is feeling super happy and wearing a big bright smile?",
      )?.id,
    ).toBe("voice.feelings.happy-welcome");
    expect(narrationClipForText("Flip the feeling faces and find the match!")?.id).toBe(
      "voice.feelings.memory-welcome",
    );
    expect(narrationClipForText("That face has a feeling!")?.id).toBe("voice.feelings.face-done");
  });

  it("maps Healthy Habits closed-kit lines to voice-01", () => {
    expect(
      narrationClipForText(
        "Healthy Habits & Body! Sparkly Clean Teeth, Crunchy Apples & Listening Ears. Let's explore together!",
      )?.id,
    ).toBe("voice.habits.area-welcome");
    expect(
      narrationClipForText(
        "What do we use morning and night with foamy bubbles to brush our teeth sparkly clean?",
      )?.id,
    ).toBe("voice.habits.brush-welcome");
    expect(narrationClipForText("Brush brush!")?.id).toBe("voice.habits.cue.brush");
    expect(
      narrationClipForText("Which part of our body do we use to listen to music and singing birds?")?.id,
    ).toBe("voice.habits.ears-welcome");
    expect(narrationClipForText("Play a brush-time song on the piano!")?.id).toBe(
      "voice.habits.piano-welcome",
    );
    expect(narrationClipForText("Clean shiny teeth.")?.id).toBe("voice.habits.brush-done");
  });

  it("maps Family & Cozy Home closed-kit lines to voice-01", () => {
    expect(
      narrationClipForText(
        "Family & Cozy Home! Baby Siblings, Kind Grandparents & Cozy Bedtime. Let's explore together!",
      )?.id,
    ).toBe("voice.family.area-welcome");
    expect(
      narrationClipForText(
        "Can you spot the little baby brother or sister who loves warm gentle cuddles?",
      )?.id,
    ).toBe("voice.family.baby-welcome");
    expect(narrationClipForText("Find the rhyming friends at home!")?.id).toBe(
      "voice.family.rhyme-welcome",
    );
    expect(narrationClipForText("Pegged. The wind can work.")?.id).toBe("voice.family.wash-done");
  });

  it("maps Sunny Garage closed-kit lines to voice-01", () => {
    expect(
      narrationClipForText("Sunny Garage! Tools, tyres and a sleepy bus. Let's explore together!")?.id,
    ).toBe("voice.garage.area-welcome");
    expect(narrationClipForText("Who is waiting for wheels in the garage?")?.id).toBe(
      "voice.garage.bus-welcome",
    );
    expect(narrationClipForText("How many tyres does the car need?")?.id).toBe(
      "voice.garage.tyres-welcome",
    );
    expect(narrationClipForText("Which belongs in the toolbox?")?.id).toBe("voice.garage.tools-welcome");
    expect(narrationClipForText("What colour is the school bus?")?.id).toBe("voice.garage.colour-welcome");
    expect(narrationClipForText("Which letter starts bus?")?.id).toBe("voice.garage.letter-welcome");
    expect(narrationClipForText("Red, blue, red, blue, red. Next?")?.id).toBe("voice.garage.lights-welcome");
    expect(narrationClipForText("What shape is a wheel?")?.id).toBe("voice.garage.wheel-welcome");
    expect(narrationClipForText("What bead comes next on the garage train?")?.id).toBe(
      "voice.garage.bead-welcome",
    );
    expect(narrationClipForText("All loaded. Ready to roll!")?.id).toBe("voice.garage.truck-done");
  });

  it("maps High Street closed-kit lines to voice-01", () => {
    expect(
      narrationClipForText(
        "High Street! Lights, crossings and a fire truck. Let's explore together!",
      )?.id,
    ).toBe("voice.street.area-welcome");
    expect(narrationClipForText("The light is red. What do we do?")?.id).toBe("voice.street.light-welcome");
    expect(narrationClipForText("Who rides the long red truck?")?.id).toBe("voice.street.fire-welcome");
    expect(narrationClipForText("Firefighters ride the red truck.")?.id).toBe("voice.street.fb.fire");
    expect(narrationClipForText("Which belongs in the sky?")?.id).toBe("voice.street.sky-welcome");
    expect(narrationClipForText("How many cones?")?.id).toBe("voice.street.cones-welcome");
    expect(narrationClipForText("Look both ways, then cross. What first?")?.id).toBe(
      "voice.street.cross-welcome",
    );
    expect(narrationClipForText("Which letter starts truck?")?.id).toBe("voice.street.letter-welcome");
    expect(narrationClipForText("Which sign says stop?")?.id).toBe("voice.street.sign-welcome");
    expect(narrationClipForText("Red, wait, green, red, wait. Next?")?.id).toBe(
      "voice.street.lights-welcome",
    );
    expect(narrationClipForText("Shiny bus. Beep beep!")?.id).toBe("voice.street.wash-done");
    expect(narrationClipForText("Drive the bus down the high street!")?.id).toBe(
      "voice.street.drive-welcome",
    );
  });

  it("maps Windy Runway closed-kit lines to voice-01", () => {
    expect(
      narrationClipForText(
        "Windy Runway! Planes, hangars and a control tower. Let's explore together!",
      )?.id,
    ).toBe("voice.runway.area-welcome");
    expect(narrationClipForText("Who whooshes down the runway?")?.id).toBe(
      "voice.runway.whoosh-welcome",
    );
    expect(narrationClipForText("How many planes?")?.id).toBe("voice.runway.planes-welcome");
    expect(narrationClipForText("Which belongs on the bag belt?")?.id).toBe("voice.runway.belt-welcome");
    expect(narrationClipForText("Where does the pilot sit?")?.id).toBe("voice.runway.pilot-welcome");
    expect(narrationClipForText("Which letter starts plane?")?.id).toBe("voice.runway.letter-welcome");
    expect(narrationClipForText("Four and three seats. How many?")?.id).toBe("voice.runway.seats-welcome");
    expect(narrationClipForText("Which shape is most like a cabin window?")?.id).toBe(
      "voice.runway.window-welcome",
    );
    expect(narrationClipForText("Blink, rest, blink, rest, blink. Next?")?.id).toBe(
      "voice.runway.blink-welcome",
    );
    expect(narrationClipForText("Pack the bag for the trip!")?.id).toBe("voice.runway.pack-welcome");
    expect(narrationClipForText("Packed. Ready to go!")?.id).toBe("voice.runway.pack-done");
  });

  it("maps Busy Harbour closed-kit lines to voice-01", () => {
    expect(
      narrationClipForText(
        "Busy Harbour! Boats, cranes and a ferry horn. Let's explore together!",
      )?.id,
    ).toBe("voice.harbour.area-welcome");
    expect(narrationClipForText("Who sounds the low horn?")?.id).toBe("voice.harbour.horn-welcome");
    expect(narrationClipForText("Which belongs on the water?")?.id).toBe("voice.harbour.water-welcome");
    expect(narrationClipForText("How many buoys?")?.id).toBe("voice.harbour.buoys-welcome");
    expect(narrationClipForText("What lifts the crate?")?.id).toBe("voice.harbour.crane-welcome");
    expect(narrationClipForText("Which letter starts ship?")?.id).toBe("voice.harbour.letter-welcome");
    expect(narrationClipForText("What rhymes with boat?")?.id).toBe("voice.harbour.rhyme-welcome");
    expect(narrationClipForText("Two and five crates. How many?")?.id).toBe("voice.harbour.crates-welcome");
    expect(narrationClipForText("Where does the anchor rest?")?.id).toBe("voice.harbour.anchor-welcome");
    expect(narrationClipForText("The dock is tidy.")?.id).toBe("voice.harbour.coil-done");
  });

  it("maps Sunny Flower Bed closed-kit lines to voice-01", () => {
    expect(
      narrationClipForText(
        "Sunny Flower Bed! Bees, ladybirds and petal paths. Let's explore together!",
      )?.id,
    ).toBe("voice.flower.area-welcome");
    expect(narrationClipForText("Who has black spots on a red back?")?.id).toBe(
      "voice.flower.spots-welcome",
    );
    expect(narrationClipForText("Catch the fireflies in the flower bed!")?.id).toBe(
      "voice.flower.firefly-station",
    );
    expect(narrationClipForText("Tap six glow-bugs into the jar.")?.id).toBe(
      "voice.flower.firefly-line",
    );
    expect(narrationClipForText("A lantern of tiny stars!")?.id).toBe("voice.flower.firefly-done");
    expect(narrationClipForText("Trace the garden letter with your finger!")?.id).toBe(
      "voice.flower.letter-trace",
    );
    expect(narrationClipForText("Who is buzzing in the flower?")?.id).toBe(
      "voice.flower.buzz-welcome",
    );
    expect(narrationClipForText("Bzz from the yellow flower. Who is gathering?")?.id).toBe(
      "voice.flower.clue.buzz",
    );
    expect(narrationClipForText("How many spots?")?.id).toBe("voice.flower.six-welcome");
    expect(narrationClipForText("This ladybird has six spots. How many?")?.id).toBe(
      "voice.flower.clue.six",
    );
    expect(narrationClipForText("Who belongs on the flower?")?.id).toBe(
      "voice.flower.petal-welcome",
    );
    expect(narrationClipForText("Cranes lift harbour crates.")?.id).toBe("voice.flower.fb.crane");
    expect(narrationClipForText("Which letter starts bee?")?.id).toBe("voice.flower.letter-welcome");
    expect(narrationClipForText("Yellow, pink, yellow, pink, yellow. Next?")?.id).toBe(
      "voice.flower.row-welcome",
    );
    expect(narrationClipForText("What rhymes with bee?")?.id).toBe("voice.flower.rhyme-welcome");
    expect(narrationClipForText("Bee. What rhymes with bee?")?.id).toBe("voice.flower.clue.rhyme");
    expect(narrationClipForText("Three and two bees. How many?")?.id).toBe(
      "voice.flower.blooms-welcome",
    );
    expect(narrationClipForText("3 bees on this bloom, 2 on that bloom. How many?")?.id).toBe(
      "voice.flower.clue.blooms",
    );
  });

  it("maps Garden Pond closed-kit lines to voice-01", () => {
    expect(
      narrationClipForText(
        "Garden Pond! Skaters, dragonflies and lily pads. Let's explore together!",
      )?.id,
    ).toBe("voice.pond.area-welcome");
    expect(narrationClipForText("Who skims the pond with four wings?")?.id).toBe(
      "voice.pond.skims-welcome",
    );
    expect(narrationClipForText("Long body, four bright wings skimming the pond. Who?")?.id).toBe(
      "voice.pond.clue.skims",
    );
    expect(narrationClipForText("Tap the dew on the web!")?.id).toBe("voice.pond.dew-station");
    expect(narrationClipForText("Drag the drops along the web.")?.id).toBe("voice.pond.dew-line");
    expect(narrationClipForText("The web sparkles.")?.id).toBe("voice.pond.dew-done");
    expect(narrationClipForText("Water the plant. There is no wrong way!")?.id).toBe(
      "voice.pond.plant-welcome",
    );
    expect(narrationClipForText("Who belongs in the pond?")?.id).toBe("voice.pond.path-welcome");
    expect(narrationClipForText("The pond is for water bugs. Who belongs in the pond?")?.id).toBe(
      "voice.pond.clue.path",
    );
    expect(narrationClipForText("How many lily pads?")?.id).toBe("voice.pond.pads-welcome");
    expect(narrationClipForText("Where does the frog belong?")?.id).toBe("voice.pond.frog-welcome");
    expect(narrationClipForText("The frog belongs by wet reeds, not the bakery. Where?")?.id).toBe(
      "voice.pond.clue.frog",
    );
    expect(narrationClipForText("Who made the plop?")?.id).toBe("voice.pond.plop-welcome");
    expect(narrationClipForText("A plop, then rings on the water. Who landed?")?.id).toBe(
      "voice.pond.clue.plop",
    );
    expect(narrationClipForText("Which letter starts pond?")?.id).toBe("voice.pond.letter-welcome");
    expect(narrationClipForText("Pond starts with puh. Which letter?")?.id).toBe(
      "voice.pond.clue.letter",
    );
    expect(narrationClipForText("What shape is the lily pad?")?.id).toBe("voice.pond.shape-welcome");
    expect(narrationClipForText("A lily pad is round and flat. What shape?")?.id).toBe(
      "voice.pond.clue.shape",
    );
    expect(narrationClipForText("Two and four frogs. How many?")?.id).toBe(
      "voice.pond.banks-welcome",
    );
    expect(narrationClipForText("Two and four make six.")?.id).toBe("voice.pond.fb.six-frogs");
    expect(narrationClipForText("Count both banks.")?.id).toBe("voice.pond.fb.both-banks");
  });

  it("maps Night Jar Walk closed-kit lines to voice-01", () => {
    expect(
      narrationClipForText(
        "Night Jar Walk! Crickets, moths and a lantern. Let's explore together!",
      )?.id,
    ).toBe("voice.night.area-welcome");
    expect(narrationClipForText("Who is chirping in the grass?")?.id).toBe(
      "voice.night.chirp-welcome",
    );
    expect(narrationClipForText("Chirp chirp from the dark grass. Who?")?.id).toBe(
      "voice.night.clue.chirp",
    );
    expect(narrationClipForText("Who comes to the lantern?")?.id).toBe("voice.night.lamp-welcome");
    expect(narrationClipForText("Soft wings at the lantern, not a stinger. Who?")?.id).toBe(
      "voice.night.clue.lamp",
    );
    expect(narrationClipForText("A moth at the lamp.")?.id).toBe("voice.night.fb.moth");
    expect(narrationClipForText("Who belongs on the night walk?")?.id).toBe(
      "voice.night.day-welcome",
    );
    expect(narrationClipForText("How many moths?")?.id).toBe("voice.night.moths-welcome");
    expect(narrationClipForText("Four moths on the lantern glass. How many?")?.id).toBe(
      "voice.night.clue.moths",
    );
    expect(narrationClipForText("Count the whole glass.")?.id).toBe("voice.night.fb.one-moth");
    expect(narrationClipForText("Play a quiet lullaby for the lantern moths.")?.id).toBe(
      "voice.night.lullaby-welcome",
    );
    expect(narrationClipForText("Which letter starts moth?")?.id).toBe("voice.night.letter-welcome");
    expect(narrationClipForText("Moth starts with mmm. Which letter?")?.id).toBe(
      "voice.night.clue.letter",
    );
    expect(narrationClipForText("N starts nest.")?.id).toBe("voice.night.fb.n");
    expect(narrationClipForText("Pip whispered, then Nana. Who spoke last?")?.id).toBe(
      "voice.night.who-welcome",
    );
    expect(
      narrationClipForText("Pip whispered, then Nana whispered lower. Who spoke last?")?.id,
    ).toBe("voice.night.clue.who");
    expect(narrationClipForText("Glow, dim, glow, dim, glow. Next?")?.id).toBe(
      "voice.night.blink-welcome",
    );
  });

  it("maps Warm Compost closed-kit lines to voice-01", () => {
    expect(
      narrationClipForText(
        "Warm Compost! Worms, millipedes and leaf piles. Let's explore together!",
      )?.id,
    ).toBe("voice.compost.area-welcome");
    expect(narrationClipForText("Who digs in the dark soil?")?.id).toBe(
      "voice.compost.digs-welcome",
    );
    expect(narrationClipForText("Long, pink, and quiet in the soil. Who?")?.id).toBe(
      "voice.compost.clue.digs",
    );
    expect(narrationClipForText("Water every thirsty plant!")?.id).toBe(
      "voice.compost.water-station",
    );
    expect(narrationClipForText("Drag the can onto every thirsty plant.")?.id).toBe(
      "voice.compost.water-line",
    );
    expect(narrationClipForText("The garden drinks!")?.id).toBe("voice.compost.water-done");
    expect(narrationClipForText("Flip the compost leaves and find the matching bugs!")?.id).toBe(
      "voice.compost.memory-welcome",
    );
    expect(narrationClipForText("Where does the worm belong?")?.id).toBe(
      "voice.compost.home-welcome",
    );
    expect(narrationClipForText("Worms belong in damp soil, not the fridge. Where?")?.id).toBe(
      "voice.compost.clue.home",
    );
    expect(narrationClipForText("Which belongs in the compost?")?.id).toBe(
      "voice.compost.heap-welcome",
    );
    expect(narrationClipForText("The compost is for leaves and peels. Which belongs?")?.id).toBe(
      "voice.compost.clue.heap",
    );
    expect(narrationClipForText("How many worms?")?.id).toBe("voice.compost.worms-welcome");
    expect(narrationClipForText("Five worms after the rain. How many?")?.id).toBe(
      "voice.compost.clue.worms",
    );
    expect(narrationClipForText("Which letter starts worm?")?.id).toBe(
      "voice.compost.letter-welcome",
    );
    expect(narrationClipForText("Worm starts with wuh. Which letter?")?.id).toBe(
      "voice.compost.clue.letter",
    );
    expect(narrationClipForText("Four and four leaves. How many?")?.id).toBe(
      "voice.compost.piles-welcome",
    );
    expect(narrationClipForText("4 leaves here, 4 leaves there. How many?")?.id).toBe(
      "voice.compost.clue.piles",
    );
    expect(narrationClipForText("What rhymes with log?")?.id).toBe("voice.compost.rhyme-welcome");
    expect(narrationClipForText("Log. What rhymes with log?")?.id).toBe("voice.compost.clue.rhyme");
    expect(narrationClipForText("Why is the heap kept damp?")?.id).toBe(
      "voice.compost.damp-welcome",
    );
    expect(narrationClipForText("The heap stays damp so worms can slide. Why damp?")?.id).toBe(
      "voice.compost.clue.damp",
    );
    expect(narrationClipForText("Is this friend a flyer, a crawler, or a pond bug?")?.id).toBe(
      "voice.compost.sort-welcome",
    );
    expect(narrationClipForText("Flyer, crawler, or pond?")?.id).toBe("voice.compost.clue.sort");
  });

  it("maps Fruit Stall closed-kit lines to voice-01", () => {
    expect(
      narrationClipForText(
        "Fruit Stall! Citrus pyramids and a hanging scale. Let's explore together!",
      )?.id,
    ).toBe("voice.fruit.area-welcome");
    expect(narrationClipForText("Which fruit is round and orange?")?.id).toBe(
      "voice.fruit.orange-welcome",
    );
    expect(narrationClipForText("Round, bright, and citrus-smelling. Which fruit?")?.id).toBe(
      "voice.fruit.clue.orange",
    );
    expect(narrationClipForText("A sweet orange.")?.id).toBe("voice.fruit.fb.orange");
    expect(narrationClipForText("Peas are small and green.")?.id).toBe("voice.fruit.fb.pea");
    expect(narrationClipForText("How many apples?")?.id).toBe("voice.fruit.apples-welcome");
    expect(narrationClipForText("Five red apples in the crate. How many?")?.id).toBe(
      "voice.fruit.clue.apples",
    );
    expect(narrationClipForText("Which belongs in the veg crate?")?.id).toBe(
      "voice.fruit.veg-welcome",
    );
    expect(narrationClipForText("Bananas are fruit.")?.id).toBe("voice.fruit.fb.banana");
    expect(narrationClipForText("Red and yellow jam. What colour blooms?")?.id).toBe(
      "voice.fruit.jam-welcome",
    );
    expect(narrationClipForText("Which letter starts apple?")?.id).toBe(
      "voice.fruit.letter-welcome",
    );
    expect(narrationClipForText("Apple starts with a. Which letter?")?.id).toBe(
      "voice.fruit.clue.letter",
    );
    expect(narrationClipForText("B starts banana.")?.id).toBe("voice.fruit.fb.b");
    expect(narrationClipForText("P starts pear.")?.id).toBe("voice.fruit.fb.p");
    expect(narrationClipForText("Apple, pear, apple, pear, apple. Next?")?.id).toBe(
      "voice.fruit.row-welcome",
    );
    expect(narrationClipForText("Three and three pears. How many?")?.id).toBe(
      "voice.fruit.bags-welcome",
    );
    expect(narrationClipForText("What rhymes with pear?")?.id).toBe("voice.fruit.rhyme-welcome");
    expect(narrationClipForText("Pear. What rhymes with pear?")?.id).toBe("voice.fruit.clue.rhyme");
    expect(narrationClipForText("Stack fruit at the stall!")?.id).toBe("voice.fruit.stack-station");
    expect(narrationClipForText("A market tower!")?.id).toBe("voice.fruit.stack-done");
    expect(narrationClipForText("Mix colours at the fruit stall!")?.id).toBe(
      "voice.fruit.mix-welcome",
    );
  });

  it("maps Warm Bakery closed-kit lines to voice-01", () => {
    expect(
      narrationClipForText(
        "Warm Bakery! Trays, buns and a flour cloud. Let's explore together!",
      )?.id,
    ).toBe("voice.bakery.area-welcome");
    expect(narrationClipForText("Who is baking the loaves?")?.id).toBe("voice.bakery.bakes-welcome");
    expect(narrationClipForText("A tall hat and a tray of loaves. Who is working?")?.id).toBe(
      "voice.bakery.clue.bakes",
    );
    expect(narrationClipForText("Knead the bakery dough!")?.id).toBe("voice.bakery.knead-station");
    expect(narrationClipForText("Hold to press the dough.")?.id).toBe("voice.bakery.knead-line");
    expect(narrationClipForText("Soft bread ready.")?.id).toBe("voice.bakery.knead-done");
    expect(narrationClipForText("Trace the bakery letter in the flour!")?.id).toBe(
      "voice.bakery.letter-trace",
    );
    expect(narrationClipForText("How many buns?")?.id).toBe("voice.bakery.buns-welcome");
    expect(narrationClipForText("Six buns on the tray. How many?")?.id).toBe(
      "voice.bakery.clue.buns",
    );
    expect(narrationClipForText("What belongs in the oven?")?.id).toBe("voice.bakery.oven-welcome");
    expect(narrationClipForText("The oven is for baking. What belongs in the oven?")?.id).toBe(
      "voice.bakery.clue.oven",
    );
    expect(narrationClipForText("Which letter starts bread?")?.id).toBe(
      "voice.bakery.letter-welcome",
    );
    expect(narrationClipForText("Bread starts with br. Which letter starts bread?")?.id).toBe(
      "voice.bakery.clue.letter",
    );
    expect(narrationClipForText("Which blend starts bread?")?.id).toBe("voice.bakery.blend-welcome");
    expect(narrationClipForText("Bread starts with br. Which blend?")?.id).toBe(
      "voice.bakery.clue.blend",
    );
    expect(narrationClipForText("Bun, loaf, bun, loaf, bun. Next?")?.id).toBe(
      "voice.bakery.pattern-welcome",
    );
    expect(narrationClipForText("Where does the pie cool?")?.id).toBe("voice.bakery.where-welcome");
    expect(
      narrationClipForText("Nana said the pie cools on the window, not the oven. Where?")?.id,
    ).toBe("voice.bakery.clue.where");
    expect(narrationClipForText("What shape is the pie tin?")?.id).toBe("voice.bakery.tin-welcome");
    expect(narrationClipForText("The pie tin is round. What shape?")?.id).toBe("voice.bakery.clue.tin");
    expect(narrationClipForText("Flip the bakery buns and find the match!")?.id).toBe(
      "voice.bakery.memory-welcome",
    );
    expect(narrationClipForText("Flip two buns. Find the matching treats.")?.id).toBe(
      "voice.bakery.clue.memory",
    );
    expect(narrationClipForText("Name the shape on the bakery tray!")?.id).toBe(
      "voice.bakery.shape-welcome",
    );
    expect(narrationClipForText("Name the shape on the bakery tray.")?.id).toBe(
      "voice.bakery.clue.shape",
    );
    expect(narrationClipForText("Trace A for Apple in the flour.")?.id).toBe(
      "voice.bakery.clue.letter-trace",
    );
    expect(narrationClipForText("Press the dough eight times.")?.id).toBe("voice.bakery.clue.knead");
  });

  it("maps Nana's Soup Pot closed-kit lines to voice-01", () => {
    expect(
      narrationClipForText(
        "Nana\u2019s Soup Pot! Steam, spoons and a bubbling lid. Let's explore together!",
      )?.id,
    ).toBe("voice.soup.area-welcome");
    expect(narrationClipForText("What stirs the soup?")?.id).toBe("voice.soup.stirs-welcome");
    expect(narrationClipForText("Long handle, round bowl. What stirs the soup?")?.id).toBe(
      "voice.soup.clue.stirs",
    );
    expect(narrationClipForText("How many carrots?")?.id).toBe("voice.soup.carrots-welcome");
    expect(narrationClipForText("Four carrots waiting for the pot. How many?")?.id).toBe(
      "voice.soup.clue.carrots",
    );
    expect(narrationClipForText("The pot is steaming. What do we do?")?.id).toBe(
      "voice.soup.hot-welcome",
    );
    expect(narrationClipForText("Steam means the pot is hot. What do we do?")?.id).toBe(
      "voice.soup.clue.hot",
    );
    expect(narrationClipForText("Which belongs in the soup pot?")?.id).toBe("voice.soup.sort-welcome");
    expect(narrationClipForText("The pot is for soup things. Which belongs?")?.id).toBe(
      "voice.soup.clue.sort",
    );
    expect(narrationClipForText("Which letter starts soup?")?.id).toBe("voice.soup.letter-welcome");
    expect(narrationClipForText("Soup starts with sss. Which letter?")?.id).toBe(
      "voice.soup.clue.letter",
    );
    expect(narrationClipForText("Two and three spoons. How many?")?.id).toBe(
      "voice.soup.spoons-welcome",
    );
    expect(narrationClipForText("2 spoons out, 3 more from the drawer. How many?")?.id).toBe(
      "voice.soup.clue.spoons",
    );
    expect(narrationClipForText("Pip tasted, then Nana. Who last?")?.id).toBe(
      "voice.soup.who-welcome",
    );
    expect(narrationClipForText("Pip tasted, then Nana tasted. Who tasted last?")?.id).toBe(
      "voice.soup.clue.who",
    );
    expect(narrationClipForText("Chop chop rest. Next?")?.id).toBe("voice.soup.chop-welcome");
    expect(narrationClipForText("Chop chop rest, chop chop rest, chop. Next?")?.id).toBe(
      "voice.soup.clue.chop",
    );
    expect(narrationClipForText("Mix colours in Nana's soup pot!")?.id).toBe("voice.soup.mix-welcome");
    expect(narrationClipForText("Blend droplets into the bubbling soup.")?.id).toBe(
      "voice.soup.clue.mix",
    );
    expect(narrationClipForText("Stir Nana's soup. Round and round!")?.id).toBe(
      "voice.soup.stir-welcome",
    );
    expect(narrationClipForText("Drag round and round. There is no wrong way.")?.id).toBe(
      "voice.soup.clue.stir",
    );
  });

  it("maps Picnic Basket closed-kit lines to voice-01", () => {
    expect(
      narrationClipForText(
        "Picnic Basket! Cloth, cups and a shady tree. Let's explore together!",
      )?.id,
    ).toBe("voice.picnic.area-welcome");
    expect(narrationClipForText("What belongs in the picnic basket?")?.id).toBe(
      "voice.picnic.pack-welcome",
    );
    expect(narrationClipForText("Soft bread with a filling. What goes in the basket?")?.id).toBe(
      "voice.picnic.clue.pack",
    );
    expect(narrationClipForText("How many cups?")?.id).toBe("voice.picnic.cups-welcome");
    expect(narrationClipForText("Four juice cups on the cloth. How many?")?.id).toBe(
      "voice.picnic.clue.cups",
    );
    expect(narrationClipForText("Three and two sandwiches. How many?")?.id).toBe(
      "voice.picnic.sarnies-welcome",
    );
    expect(narrationClipForText("3 sandwiches here, 2 there. How many?")?.id).toBe(
      "voice.picnic.clue.sarnies",
    );
    expect(narrationClipForText("Who is marching to the crumb?")?.id).toBe("voice.picnic.who-welcome");
    expect(narrationClipForText("Tiny marchers toward a crumb. Who?")?.id).toBe(
      "voice.picnic.clue.who",
    );
    expect(narrationClipForText("Which letter starts picnic?")?.id).toBe(
      "voice.picnic.letter-welcome",
    );
    expect(narrationClipForText("Picnic starts with puh. Which letter?")?.id).toBe(
      "voice.picnic.clue.letter",
    );
    expect(narrationClipForText("What shape is the cloth?")?.id).toBe("voice.picnic.cloth-welcome");
    expect(narrationClipForText("The picnic cloth has four equal sides. What shape?")?.id).toBe(
      "voice.picnic.clue.cloth",
    );
    expect(narrationClipForText("Where do we sit?")?.id).toBe("voice.picnic.where-welcome");
    expect(
      narrationClipForText("Nana said sit on the cloth, not the ant trail. Where?")?.id,
    ).toBe("voice.picnic.clue.where");
    expect(narrationClipForText("Red cup, blue cup, red cup, blue cup, red. Next?")?.id).toBe(
      "voice.picnic.clue.row",
    );
    expect(narrationClipForText("Sort the picnic cloths!")?.id).toBe("voice.picnic.sort-welcome");
    expect(narrationClipForText("Sort the picnic cloths onto the right piles.")?.id).toBe(
      "voice.picnic.clue.sort",
    );
    expect(narrationClipForText("Flip the Saturday pancakes!")?.id).toBe(
      "voice.picnic.pancake-welcome",
    );
    expect(narrationClipForText("Pour. Wait until gold. Flip four onto the plate.")?.id).toBe(
      "voice.picnic.clue.pancake",
    );
    expect(narrationClipForText("A Saturday stack!")?.id).toBe("voice.picnic.pancake-done");
  });

  it("maps Fire House closed-kit lines to voice-01", () => {
    expect(
      narrationClipForText(
        "Fire House! Hoses, helmets and a spotted dog. Let's explore together!",
      )?.id,
    ).toBe("voice.fire.area-welcome");
    expect(narrationClipForText("Long, red, and loud with a ladder. Who rides it?")?.id).toBe(
      "voice.fire.clue.truck",
    );
    expect(narrationClipForText("How many helmets?")?.id).toBe("voice.fire.helmets-welcome");
    expect(narrationClipForText("Three helmets on the pegs. How many?")?.id).toBe(
      "voice.fire.clue.helmets",
    );
    expect(narrationClipForText("Which belongs on the hose rack?")?.id).toBe(
      "voice.fire.rack-welcome",
    );
    expect(narrationClipForText("The rack is for fire kit. Which belongs?")?.id).toBe(
      "voice.fire.clue.rack",
    );
    expect(narrationClipForText("Which letter starts fire?")?.id).toBe("voice.fire.letter-welcome");
    expect(narrationClipForText("Fire starts with fff. Which letter?")?.id).toBe(
      "voice.fire.clue.letter",
    );
    expect(narrationClipForText("The bell rang, then the crew ran. What first?")?.id).toBe(
      "voice.fire.who-welcome",
    );
    expect(narrationClipForText("The bell rang, then the crew ran. What happened first?")?.id).toBe(
      "voice.fire.clue.who",
    );
    expect(narrationClipForText("What shape is the badge?")?.id).toBe("voice.fire.badge-welcome");
    expect(narrationClipForText("The badge is round. What shape?")?.id).toBe("voice.fire.clue.badge");
    expect(narrationClipForText("Two and two boots. How many?")?.id).toBe("voice.fire.boots-welcome");
    expect(narrationClipForText("2 boots by this locker, 2 by that locker. How many?")?.id).toBe(
      "voice.fire.clue.boots",
    );
    expect(narrationClipForText("Who waits on the fire-house step?")?.id).toBe(
      "voice.fire.dog-welcome",
    );
    expect(narrationClipForText("A spotted dog waits on the step. Who?")?.id).toBe(
      "voice.fire.clue.dog",
    );
    expect(narrationClipForText("Tap the fire-house balloons!")?.id).toBe(
      "voice.fire.balloons-welcome",
    );
    expect(narrationClipForText("Tap the balloons drifting past the engines.")?.id).toBe(
      "voice.fire.clue.balloons",
    );
    expect(narrationClipForText("Help the fire house put the water on!")?.id).toBe(
      "voice.fire.hose-welcome",
    );
    expect(narrationClipForText("Tap each flame to put the water on it.")?.id).toBe(
      "voice.fire.clue.hose",
    );
    expect(narrationClipForText("Hold the hose. Drag water onto each flame.")?.id).toBe(
      "voice.fire.hose-line",
    );
    expect(narrationClipForText("The fire house is calm.")?.id).toBe("voice.fire.hose-done");
  });

  it("maps Town Park closed-kit lines to voice-01", () => {
    expect(
      narrationClipForText(
        "Town Park! Ducks, swings and a round pond. Let's explore together!",
      )?.id,
    ).toBe("voice.park.area-welcome");
    expect(narrationClipForText("How many ducks?")?.id).toBe("voice.park.ducks-welcome");
    expect(narrationClipForText("Five ducks on the round pond. How many?")?.id).toBe(
      "voice.park.clue.ducks",
    );
    expect(narrationClipForText("Which belongs in the park?")?.id).toBe("voice.park.play-welcome");
    expect(narrationClipForText("The park is for play. Which belongs here?")?.id).toBe(
      "voice.park.clue.play",
    );
    expect(narrationClipForText("Who is quacking?")?.id).toBe("voice.park.quack-welcome");
    expect(narrationClipForText("Quack from the round pond. Who?")?.id).toBe("voice.park.clue.quack");
    expect(narrationClipForText("Which letter starts duck?")?.id).toBe("voice.park.letter-welcome");
    expect(narrationClipForText("Duck starts with duh. Which letter?")?.id).toBe(
      "voice.park.clue.letter",
    );
    expect(narrationClipForText("What shape is the pond?")?.id).toBe("voice.park.pond-welcome");
    expect(narrationClipForText("The pond is round. What shape?")?.id).toBe("voice.park.clue.pond");
    expect(narrationClipForText("Two and three balls. How many?")?.id).toBe("voice.park.balls-welcome");
    expect(narrationClipForText("2 balls out, 3 still in the bag. How many?")?.id).toBe(
      "voice.park.clue.balls",
    );
    expect(narrationClipForText("Pip, Nana, Pip, Nana, Pip. Next?")?.id).toBe(
      "voice.park.swing-welcome",
    );
    expect(narrationClipForText("Where is the ball?")?.id).toBe("voice.park.where-welcome");
    expect(
      narrationClipForText("The ball rolled under the bench, not the pond. Where?")?.id,
    ).toBe("voice.park.clue.where");
    expect(narrationClipForText("Who is visiting the town park?")?.id).toBe("voice.park.clue.safari");
    expect(narrationClipForText("Feed the park pigeons!")?.id).toBe("voice.park.pigeon-welcome");
    expect(narrationClipForText("Trace the park letter with your finger!")?.id).toBe(
      "voice.park.trace-welcome",
    );
  });

  it("maps Quiet Nook closed-kit lines to voice-01", () => {
    expect(
      narrationClipForText(
        "Quiet Nook! Shelves, whispers and a story chair. Let's explore together!",
      )?.id,
    ).toBe("voice.nook.area-welcome");
    expect(narrationClipForText("Where do the books live?")?.id).toBe("voice.nook.books-welcome");
    expect(narrationClipForText("Books live on the shelf, not the fridge. Where?")?.id).toBe(
      "voice.nook.clue.books",
    );
    expect(narrationClipForText("Which letter starts library?")?.id).toBe("voice.nook.letter-welcome");
    expect(narrationClipForText("Library starts with lll. Which letter?")?.id).toBe(
      "voice.nook.clue.letter",
    );
    expect(narrationClipForText("How many books?")?.id).toBe("voice.nook.count-welcome");
    expect(narrationClipForText("Seven picture books in the return box. How many?")?.id).toBe(
      "voice.nook.clue.count",
    );
    expect(narrationClipForText("Which belongs in the quiet nook?")?.id).toBe(
      "voice.nook.quiet-welcome",
    );
    expect(narrationClipForText("The nook is for quiet. Which belongs here?")?.id).toBe(
      "voice.nook.clue.quiet",
    );
    expect(narrationClipForText("Who read last?")?.id).toBe("voice.nook.who-welcome");
    expect(narrationClipForText("Pip read, then Nana read the last page. Who read last?")?.id).toBe(
      "voice.nook.clue.who",
    );
    expect(narrationClipForText("What rhymes with book?")?.id).toBe("voice.nook.rhyme-welcome");
    expect(narrationClipForText("Book. What rhymes with book?")?.id).toBe("voice.nook.clue.rhyme");
    expect(narrationClipForText("Four and two books. How many?")?.id).toBe(
      "voice.nook.stacks-welcome",
    );
    expect(
      narrationClipForText("4 books in this stack, 2 in that stack. How many?")?.id,
    ).toBe("voice.nook.clue.stacks");
    expect(narrationClipForText("Listen to the story on the library porch!")?.id).toBe(
      "voice.nook.story-welcome",
    );
    expect(narrationClipForText("Put the books on the shelf!")?.id).toBe("voice.nook.land-welcome");
  });

  it("maps Saturday Market closed-kit lines to voice-01", () => {
    expect(
      narrationClipForText(
        "Saturday Market! Stalls, bells and painted signs. Let's explore together!",
      )?.id,
    ).toBe("voice.market.area-welcome");
    expect(narrationClipForText("Who rings the stall bell?")?.id).toBe("voice.market.bell-welcome");
    expect(narrationClipForText("A stall bell dings. Who is calling a customer?")?.id).toBe(
      "voice.market.clue.bell",
    );
    expect(narrationClipForText("How many kites?")?.id).toBe("voice.market.kites-welcome");
    expect(narrationClipForText("Four kites tied to a stall. How many?")?.id).toBe(
      "voice.market.clue.kites",
    );
    expect(narrationClipForText("What shape is the stall sign?")?.id).toBe(
      "voice.market.sign-welcome",
    );
    expect(narrationClipForText("The stall sign is a square. What shape?")?.id).toBe(
      "voice.market.clue.sign",
    );
    expect(narrationClipForText("Which belongs on the hat stall?")?.id).toBe(
      "voice.market.hat-welcome",
    );
    expect(narrationClipForText("This stall sells hats. Which belongs?")?.id).toBe(
      "voice.market.clue.hat",
    );
    expect(narrationClipForText("Which letter starts market?")?.id).toBe(
      "voice.market.letter-welcome",
    );
    expect(narrationClipForText("Market starts with mmm. Which letter?")?.id).toBe(
      "voice.market.clue.letter",
    );
    expect(narrationClipForText("Three and two coins. How many?")?.id).toBe(
      "voice.market.coins-welcome",
    );
    expect(narrationClipForText("3 coins here, 2 coins there. How many?")?.id).toBe(
      "voice.market.clue.coins",
    );
    expect(narrationClipForText("What did Nana ask for?")?.id).toBe("voice.market.nana-welcome");
    expect(narrationClipForText("Nana asked for a red cap, not a blue kite. What?")?.id).toBe(
      "voice.market.clue.nana",
    );
    expect(narrationClipForText("Red, white, red, white, red. Next?")?.id).toBe(
      "voice.market.awning-welcome",
    );
    expect(narrationClipForText("Mix colours at the Saturday market!")?.id).toBe(
      "voice.market.color-welcome",
    );
    expect(narrationClipForText("Fill the market bag!")?.id).toBe("voice.market.bag-welcome");
    expect(narrationClipForText("Find the rhyming friends at the market stall!")?.id).toBe(
      "voice.market.rhyme-welcome",
    );
  });

  it("maps Penguin Floe closed-kit lines to voice-01", () => {
    expect(
      narrationClipForText(
        "Penguin Floe! Hops, huddles and fish gifts. Let's explore together!",
      )?.id,
    ).toBe("voice.ice.area-welcome");
    expect(narrationClipForText("Who hops the ice floe?")?.id).toBe("voice.ice.hop-welcome");
    expect(narrationClipForText("Black and white, hopping the floe. Who?")?.id).toBe(
      "voice.ice.clue.hop",
    );
    expect(narrationClipForText("How many fish?")?.id).toBe("voice.ice.fish-welcome");
    expect(narrationClipForText("Six silver fish by the hole. How many?")?.id).toBe(
      "voice.ice.clue.fish",
    );
    expect(narrationClipForText("Where does the penguin belong?")?.id).toBe("voice.ice.home-welcome");
    expect(narrationClipForText("Penguins belong on cold ice, not the bakery. Where?")?.id).toBe(
      "voice.ice.clue.home",
    );
    expect(narrationClipForText("Who belongs on the floe?")?.id).toBe("voice.ice.sort-welcome");
    expect(narrationClipForText("The floe is for ice walkers. Who belongs?")?.id).toBe(
      "voice.ice.clue.sort",
    );
    expect(narrationClipForText("Which letter starts penguin?")?.id).toBe("voice.ice.letter-welcome");
    expect(narrationClipForText("Penguin starts with puh. Which letter?")?.id).toBe(
      "voice.ice.clue.letter",
    );
    expect(narrationClipForText("Four and two penguins. How many?")?.id).toBe(
      "voice.ice.huddle-welcome",
    );
    expect(narrationClipForText("4 penguins here, 2 there. How many?")?.id).toBe(
      "voice.ice.clue.huddle",
    );
    expect(narrationClipForText("What rhymes with snow?")?.id).toBe("voice.ice.rhyme-welcome");
    expect(narrationClipForText("Snow. What rhymes with snow?")?.id).toBe("voice.ice.clue.rhyme");
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
