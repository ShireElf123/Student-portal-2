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
      "/audio/voice/world-welcome-my.mp3",
      "/audio/voice/world-welcome-animal.mp3",
      "/audio/voice/world-welcome-adventure.mp3",
      "/audio/voice/world-welcome-creative.mp3",
      "/audio/voice/world-welcome-story.mp3",
      "/audio/voice/world-welcome-learning.mp3",
      "/audio/voice/world-welcome-roads.mp3",
      "/audio/voice/world-welcome-bugs.mp3",
      "/audio/voice/world-welcome-square.mp3",
      "/audio/voice/world-welcome-kitchen.mp3",
      "/audio/voice/world-welcome-night.mp3",
      "/audio/voice/world-welcome-ice.mp3",
      "/audio/voice/toy-bow-welcome.mp3",
      "/audio/voice/toy-clap-welcome.mp3",
      "/audio/voice/toy-boots-welcome.mp3",
      "/audio/voice/toy-library-welcome.mp3",
      "/audio/voice/toy-wagon-welcome.mp3",
      "/audio/voice/toy-rosie-welcome.mp3",
      "/audio/voice/games-turtle-welcome.mp3",
      "/audio/voice/games-bee-welcome.mp3",
      "/audio/voice/games-penguin-welcome.mp3",
      "/audio/voice/games-sun-welcome.mp3",
      "/audio/voice/games-triangle-welcome.mp3",
      "/audio/voice/games-three-welcome.mp3",
      "/audio/voice/games-banana-welcome.mp3",
      "/audio/voice/games-stop-welcome.mp3",
      "/audio/voice/games-giraffe-welcome.mp3",
      "/audio/voice/games-rain-welcome.mp3",
      "/audio/voice/games-dolphin-welcome.mp3",
      "/audio/voice/games-redblue-welcome.mp3",
      "/audio/voice/games-six-welcome.mp3",
      "/audio/voice/games-eight-welcome.mp3",
      "/audio/voice/games-ten-welcome.mp3",
      "/audio/voice/games-abcd-welcome.mp3",
      "/audio/voice/games-lmno-welcome.mp3",
      "/audio/voice/games-fox-welcome.mp3",
      "/audio/voice/games-nine-welcome.mp3",
      "/audio/voice/games-moo-welcome.mp3",
      "/audio/voice/games-lion-welcome.mp3",
      "/audio/voice/games-apple-welcome.mp3",
      "/audio/voice/games-splash-welcome.mp3",
      "/audio/voice/games-rabbit-welcome.mp3",
      "/audio/voice/games-dog-welcome.mp3",
      "/audio/voice/games-duck-welcome.mp3",
      "/audio/voice/games-monkey-welcome.mp3",
      "/audio/voice/games-elephant-welcome.mp3",
      "/audio/voice/games-sheep-welcome.mp3",
      "/audio/voice/games-owl-welcome.mp3",
      "/audio/voice/games-horse-welcome.mp3",
      "/audio/voice/games-pig-welcome.mp3",
      "/audio/voice/games-star-welcome.mp3",
      "/audio/voice/games-heart-welcome.mp3",
      "/audio/voice/games-circle-welcome.mp3",
      "/audio/voice/games-sunwarm-welcome.mp3",
      "/audio/voice/games-square-welcome.mp3",
      "/audio/voice/games-orange-welcome.mp3",
      "/audio/voice/games-rooster-welcome.mp3",
      "/audio/voice/games-diamond-welcome.mp3",
      "/audio/voice/games-moon-welcome.mp3",
      "/audio/voice/games-rainbow-welcome.mp3",
      "/audio/voice/games-cloud-welcome.mp3",
      "/audio/voice/games-bell-welcome.mp3",
      "/audio/voice/games-berry-welcome.mp3",
      "/audio/voice/games-pizza-welcome.mp3",
      "/audio/voice/games-window-welcome.mp3",
      "/audio/voice/games-clock-welcome.mp3",
      "/audio/voice/story-space-helmet.mp3",
      "/audio/voice/story-ocean-open.mp3",
      "/audio/voice/story-pancake-bowl.mp3",
      "/audio/voice/story-fire-open.mp3",
      "/audio/voice/story-fire-wake.mp3",
      "/audio/voice/story-fire-ride.mp3",
      "/audio/voice/story-fire-oak.mp3",
      "/audio/voice/story-fire-steps.mp3",
      "/audio/voice/story-fire-cat.mp3",
      "/audio/voice/story-fire-park.mp3",
      "/audio/voice/story-snow-first.mp3",
      "/audio/voice/story-library-open.mp3",
      "/audio/voice/story-library-card.mp3",
      "/audio/voice/story-library-books.mp3",
      "/audio/voice/story-library-rug.mp3",
      "/audio/voice/story-library-stamp.mp3",
      "/audio/voice/story-library-bus.mp3",
      "/audio/voice/story-library-lamp.mp3",
      "/audio/voice/story-wagon-open.mp3",
      "/audio/voice/story-wagon-empty.mp3",
      "/audio/voice/story-farm-sunrise.mp3",
      "/audio/voice/story-wagon-pears.mp3",
      "/audio/voice/story-wagon-firstpear.mp3",
      "/audio/voice/story-wagon-pup.mp3",
      "/audio/voice/story-wagon-note.mp3",
      "/audio/voice/story-wagon-naps.mp3",
      "/audio/voice/toy-clue-pond.mp3",
      "/audio/voice/toy-clue-nightjar.mp3",
      "/audio/voice/toy-clue-bugs.mp3",
      "/audio/voice/toy-clue-fruit.mp3",
      "/audio/voice/toy-clue-drops.mp3",
      "/audio/voice/toy-clue-bow.mp3",
      "/audio/voice/toy-clue-clap.mp3",
      "/audio/voice/toy-clue-puddles.mp3",
      "/audio/voice/toy-clue-can.mp3",
      "/audio/voice/toy-clue-whisper.mp3",
      "/audio/voice/toy-clue-wagon.mp3",
      "/audio/voice/toy-clue-rosie.mp3",
      "/audio/voice/toy-clue-rainhold.mp3",
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
      "/audio/voice/farm-rooster-welcome.mp3",
      "/audio/voice/farm-nest-welcome.mp3",
      "/audio/voice/farm-mud-welcome.mp3",
      "/audio/voice/farm-wool-welcome.mp3",
      "/audio/voice/farm-loft-welcome.mp3",
      "/audio/voice/farm-trough-welcome.mp3",
      "/audio/voice/farm-x-rooster-clue.mp3",
      "/audio/voice/farm-x-rooster-fb-yes.mp3",
      "/audio/voice/farm-x-rooster-fb-owl.mp3",
      "/audio/voice/farm-x-rooster-fb-frog.mp3",
      "/audio/voice/farm-x-eggs-clue.mp3",
      "/audio/voice/farm-x-eggs-fb-yes.mp3",
      "/audio/voice/farm-x-eggs-fb-two.mp3",
      "/audio/voice/farm-x-eggs-fb-nine.mp3",
      "/audio/voice/farm-x-mud-clue.mp3",
      "/audio/voice/farm-x-mud-fb-yes.mp3",
      "/audio/voice/farm-x-mud-fb-cat.mp3",
      "/audio/voice/farm-x-mud-fb-goose.mp3",
      "/audio/voice/farm-x-wool-clue.mp3",
      "/audio/voice/farm-x-wool-fb-yes.mp3",
      "/audio/voice/farm-x-wool-fb-duck.mp3",
      "/audio/voice/farm-x-wool-fb-goat.mp3",
      "/audio/voice/farm-x-loft-clue.mp3",
      "/audio/voice/farm-x-loft-fb-yes.mp3",
      "/audio/voice/farm-x-loft-fb-lamb.mp3",
      "/audio/voice/farm-x-trough-clue.mp3",
      "/audio/voice/farm-x-trough-fb-yes.mp3",
      "/audio/voice/farm-x-trough-fb-hay.mp3",
      "/audio/voice/farm-x-trough-fb-boot.mp3",
      "/audio/voice/jungle-x-snake-clue.mp3",
      "/audio/voice/jungle-x-snake-fb-yes.mp3",
      "/audio/voice/jungle-x-snake-fb-parrot.mp3",
      "/audio/voice/jungle-x-snake-fb-sloth.mp3",
      "/audio/voice/jungle-x-frogs-clue.mp3",
      "/audio/voice/jungle-x-frogs-fb-yes.mp3",
      "/audio/voice/jungle-x-frogs-fb-leaf.mp3",
      "/audio/voice/jungle-x-frogs-fb-nine.mp3",
      "/audio/voice/jungle-x-tiger-clue.mp3",
      "/audio/voice/jungle-x-tiger-fb-yes.mp3",
      "/audio/voice/jungle-x-tiger-fb-rabbit.mp3",
      "/audio/voice/jungle-x-tiger-fb-deer.mp3",
      "/audio/voice/jungle-x-toucan-clue.mp3",
      "/audio/voice/jungle-x-toucan-fb-yes.mp3",
      "/audio/voice/jungle-x-toucan-fb-fish.mp3",
      "/audio/voice/jungle-x-toucan-fb-hay.mp3",
      "/audio/voice/jungle-x-jaguar-clue.mp3",
      "/audio/voice/jungle-x-jaguar-fb-yes.mp3",
      "/audio/voice/jungle-x-jaguar-fb-camel.mp3",
      "/audio/voice/jungle-x-river-clue.mp3",
      "/audio/voice/jungle-x-river-fb-yes.mp3",
      "/audio/voice/jungle-x-river-fb-monkey.mp3",
      "/audio/voice/jungle-x-river-fb-macaw.mp3",
      "/audio/voice/ocean-x-shells-clue.mp3",
      "/audio/voice/ocean-x-shells-fb-yes.mp3",
      "/audio/voice/ocean-x-shells-fb-tide.mp3",
      "/audio/voice/ocean-x-crab-clue.mp3",
      "/audio/voice/ocean-x-crab-fb-yes.mp3",
      "/audio/voice/ocean-x-crab-fb-dolphin.mp3",
      "/audio/voice/ocean-x-crab-fb-gull.mp3",
      "/audio/voice/ocean-x-turtle-clue.mp3",
      "/audio/voice/ocean-x-turtle-fb-yes.mp3",
      "/audio/voice/ocean-x-turtle-fb-dry.mp3",
      "/audio/voice/ocean-x-turtle-fb-owl.mp3",
      "/audio/voice/ocean-x-whale-clue.mp3",
      "/audio/voice/ocean-x-whale-fb-yes.mp3",
      "/audio/voice/ocean-x-whale-fb-shark.mp3",
      "/audio/voice/ocean-x-whale-fb-seal.mp3",
      "/audio/voice/ocean-x-reef-clue.mp3",
      "/audio/voice/ocean-x-reef-fb-yes.mp3",
      "/audio/voice/ocean-x-reef-fb-towel.mp3",
      "/audio/voice/ocean-x-reef-fb-tractor.mp3",
      "/audio/voice/ocean-x-fish-clue.mp3",
      "/audio/voice/ocean-x-fish-fb-yes.mp3",
      "/audio/voice/dino-x-prints-clue.mp3",
      "/audio/voice/dino-x-prints-fb-yes.mp3",
      "/audio/voice/dino-x-prints-fb-trail.mp3",
      "/audio/voice/dino-x-prints-fb-clay.mp3",
      "/audio/voice/dino-x-plates-clue.mp3",
      "/audio/voice/dino-x-plates-fb-yes.mp3",
      "/audio/voice/dino-x-plates-fb-fish.mp3",
      "/audio/voice/dino-x-plates-fb-bats.mp3",
      "/audio/voice/dino-x-flyer-clue.mp3",
      "/audio/voice/dino-x-flyer-fb-yes.mp3",
      "/audio/voice/dino-x-flyer-fb-hens.mp3",
      "/audio/voice/dino-x-flyer-fb-penguins.mp3",
      "/audio/voice/dino-x-eggs-clue.mp3",
      "/audio/voice/dino-x-eggs-fb-yes.mp3",
      "/audio/voice/dino-x-eggs-fb-fish.mp3",
      "/audio/voice/dino-x-eggs-fb-truck.mp3",
      "/audio/voice/dino-x-hunter-clue.mp3",
      "/audio/voice/dino-x-hunter-fb-yes.mp3",
      "/audio/voice/dino-x-hunter-fb-trex.mp3",
      "/audio/voice/dino-x-hunter-fb-whale.mp3",
      "/audio/voice/dino-x-stomp-clue.mp3",
      "/audio/voice/dino-x-stomp-fb-yes.mp3",
      "/audio/voice/dino-x-stomp-fb-roar.mp3",
      "/audio/voice/dino-x-stomp-fb-splash.mp3",
      "/audio/voice/playhouse-tb-1-teddy.mp3",
      "/audio/voice/playhouse-tb-1-nana.mp3",
      "/audio/voice/playhouse-tb-2-nana.mp3",
      "/audio/voice/playhouse-tb-2-teddy.mp3",
      "/audio/voice/playhouse-tb-3-nana.mp3",
      "/audio/voice/playhouse-tb-3-teddy.mp3",
      "/audio/voice/playhouse-tb-4-nana.mp3",
      "/audio/voice/playhouse-tb-4-teddy.mp3",
      "/audio/voice/playhouse-tb-5-teddy.mp3",
      "/audio/voice/playhouse-tb-5-nana.mp3",
      "/audio/voice/playhouse-tb-6-teddy.mp3",
      "/audio/voice/playhouse-tb-6-nana.mp3",
      "/audio/voice/playhouse-rq-1-pepper.mp3",
      "/audio/voice/playhouse-rq-1-rosie.mp3",
      "/audio/voice/playhouse-rq-2-bell.mp3",
      "/audio/voice/playhouse-rq-2-rosie.mp3",
      "/audio/voice/playhouse-rq-3-rosie.mp3",
      "/audio/voice/playhouse-rq-3-mailbox.mp3",
      "/audio/voice/playhouse-rq-4-rosie.mp3",
      "/audio/voice/playhouse-rq-4-pepper.mp3",
      "/audio/voice/playhouse-rq-5-rosie.mp3",
      "/audio/voice/playhouse-rq-5-pepper.mp3",
      "/audio/voice/playhouse-rq-6-bell.mp3",
      "/audio/voice/playhouse-rq-6-rosie.mp3",
      "/audio/voice/playhouse-df-1-dot.mp3",
      "/audio/voice/playhouse-df-1-owl.mp3",
      "/audio/voice/playhouse-df-2-dot.mp3",
      "/audio/voice/playhouse-df-2-owl.mp3",
      "/audio/voice/playhouse-df-3-dot.mp3",
      "/audio/voice/playhouse-df-3-lion.mp3",
      "/audio/voice/playhouse-df-4-owl.mp3",
      "/audio/voice/playhouse-df-4-dot.mp3",
      "/audio/voice/playhouse-df-5-beep.mp3",
      "/audio/voice/playhouse-df-5-dot.mp3",
      "/audio/voice/playhouse-df-6-dot.mp3",
      "/audio/voice/playhouse-df-6-lion.mp3",
      "/audio/voice/playhouse-ms-1-momo.mp3",
      "/audio/voice/playhouse-ms-1-mitten.mp3",
      "/audio/voice/playhouse-ms-2-momo.mp3",
      "/audio/voice/playhouse-ms-2-mailbox.mp3",
      "/audio/voice/playhouse-ms-3-momo.mp3",
      "/audio/voice/playhouse-ms-3-snowpal.mp3",
      "/audio/voice/playhouse-ms-4-plow.mp3",
      "/audio/voice/playhouse-ms-4-momo.mp3",
      "/audio/voice/playhouse-ms-5-momo.mp3",
      "/audio/voice/playhouse-ms-5-mitten.mp3",
      "/audio/voice/playhouse-ms-6-snowpal.mp3",
      "/audio/voice/playhouse-ms-6-momo.mp3",
      "/audio/voice/playhouse-bl-1-beep.mp3",
      "/audio/voice/playhouse-bl-1-backpack.mp3",
      "/audio/voice/playhouse-bl-2-beep.mp3",
      "/audio/voice/playhouse-bl-2-backpack.mp3",
      "/audio/voice/playhouse-bl-3-beep.mp3",
      "/audio/voice/playhouse-bl-3-backpack.mp3",
      "/audio/voice/playhouse-bl-4-beep.mp3",
      "/audio/voice/playhouse-bl-4-backpack.mp3",
      "/audio/voice/playhouse-bl-5-beep.mp3",
      "/audio/voice/playhouse-bl-5-backpack.mp3",
      "/audio/voice/playhouse-bl-6-beep.mp3",
      "/audio/voice/playhouse-bl-6-moon.mp3",
      "/audio/voice/playhouse-sr-1-stamp.mp3",
      "/audio/voice/playhouse-sr-1-truck.mp3",
      "/audio/voice/playhouse-sr-2-truck.mp3",
      "/audio/voice/playhouse-sr-2-stamp.mp3",
      "/audio/voice/playhouse-sr-3-stamp.mp3",
      "/audio/voice/playhouse-sr-3-truck.mp3",
      "/audio/voice/playhouse-sr-4-stamp.mp3",
      "/audio/voice/playhouse-sr-4-letter.mp3",
      "/audio/voice/playhouse-sr-5-stamp.mp3",
      "/audio/voice/playhouse-sr-5-truck.mp3",
      "/audio/voice/playhouse-sr-6-truck.mp3",
      "/audio/voice/playhouse-sr-6-stamp.mp3",
      "/audio/voice/playhouse-gc-1-gully.mp3",
      "/audio/voice/playhouse-gc-1-water.mp3",
      "/audio/voice/playhouse-gc-2-tug.mp3",
      "/audio/voice/playhouse-gc-2-gully.mp3",
      "/audio/voice/playhouse-gc-3-captaincat.mp3",
      "/audio/voice/playhouse-gc-3-gully.mp3",
      "/audio/voice/playhouse-gc-4-lighthouse.mp3",
      "/audio/voice/playhouse-gc-4-gully.mp3",
      "/audio/voice/playhouse-gc-5-captaincat.mp3",
      "/audio/voice/playhouse-gc-5-gully.mp3",
      "/audio/voice/playhouse-gc-6-tug.mp3",
      "/audio/voice/playhouse-gc-6-gully.mp3",
      "/audio/voice/playhouse-kw-1-wagon.mp3",
      "/audio/voice/playhouse-kw-1-benny.mp3",
      "/audio/voice/playhouse-kw-2-benny.mp3",
      "/audio/voice/playhouse-kw-2-wagon.mp3",
      "/audio/voice/playhouse-kw-3-benny.mp3",
      "/audio/voice/playhouse-kw-3-wagon.mp3",
      "/audio/voice/playhouse-kw-4-stamp.mp3",
      "/audio/voice/playhouse-kw-4-benny.mp3",
      "/audio/voice/playhouse-kw-5-benny.mp3",
      "/audio/voice/playhouse-kw-5-snail.mp3",
      "/audio/voice/playhouse-kw-6-wagon.mp3",
      "/audio/voice/playhouse-kw-6-benny.mp3",
      "/audio/voice/playhouse-mb-1-teddy.mp3",
      "/audio/voice/playhouse-mb-1-dot.mp3",
      "/audio/voice/playhouse-mb-2-nana.mp3",
      "/audio/voice/playhouse-mb-2-teddy.mp3",
      "/audio/voice/playhouse-mb-3-dot.mp3",
      "/audio/voice/playhouse-mb-3-mailbox.mp3",
      "/audio/voice/playhouse-mb-4-nana.mp3",
      "/audio/voice/playhouse-mb-4-teddy.mp3",
      "/audio/voice/playhouse-mb-5-rosie.mp3",
      "/audio/voice/playhouse-mb-5-dot.mp3",
      "/audio/voice/playhouse-mb-6-mailbox.mp3",
      "/audio/voice/playhouse-mb-6-teddy.mp3",
      "/audio/voice/playhouse-ss-1-teddy.mp3",
      "/audio/voice/playhouse-ss-1-nana.mp3",
      "/audio/voice/playhouse-ss-2-nana.mp3",
      "/audio/voice/playhouse-ss-2-teddy.mp3",
      "/audio/voice/playhouse-ss-3-dot.mp3",
      "/audio/voice/playhouse-ss-3-nana.mp3",
      "/audio/voice/playhouse-ss-4-nana.mp3",
      "/audio/voice/playhouse-ss-4-teddy.mp3",
      "/audio/voice/playhouse-ss-5-teddy.mp3",
      "/audio/voice/playhouse-ss-5-dot.mp3",
      "/audio/voice/playhouse-ss-6-nana.mp3",
      "/audio/voice/playhouse-ss-6-teddy.mp3",
      "/audio/voice/playhouse-lm-1-teddy.mp3",
      "/audio/voice/playhouse-lm-1-dot.mp3",
      "/audio/voice/playhouse-lm-2-nana.mp3",
      "/audio/voice/playhouse-lm-2-teddy.mp3",
      "/audio/voice/playhouse-lm-3-sparrow.mp3",
      "/audio/voice/playhouse-lm-3-dot.mp3",
      "/audio/voice/playhouse-lm-4-rosie.mp3",
      "/audio/voice/playhouse-lm-4-teddy.mp3",
      "/audio/voice/playhouse-lm-5-nana.mp3",
      "/audio/voice/playhouse-lm-5-teddy.mp3",
      "/audio/voice/playhouse-lm-6-dot.mp3",
      "/audio/voice/playhouse-lm-6-teddy.mp3",
      "/audio/voice/playhouse-ft-1-teddy.mp3",
      "/audio/voice/playhouse-ft-1-booth.mp3",
      "/audio/voice/playhouse-ft-2-gully.mp3",
      "/audio/voice/playhouse-ft-2-dot.mp3",
      "/audio/voice/playhouse-ft-3-horn.mp3",
      "/audio/voice/playhouse-ft-3-teddy.mp3",
      "/audio/voice/playhouse-ft-4-nana.mp3",
      "/audio/voice/playhouse-ft-4-teddy.mp3",
      "/audio/voice/playhouse-ft-5-rosie.mp3",
      "/audio/voice/playhouse-ft-5-teddy.mp3",
      "/audio/voice/playhouse-ft-6-gully.mp3",
      "/audio/voice/playhouse-ft-6-teddy.mp3",
      "/audio/voice/playhouse-tt-1-teddy.mp3",
      "/audio/voice/playhouse-tt-1-nana.mp3",
      "/audio/voice/playhouse-tt-2-dot.mp3",
      "/audio/voice/playhouse-tt-2-teddy.mp3",
      "/audio/voice/playhouse-tt-3-toaster.mp3",
      "/audio/voice/playhouse-tt-3-teddy.mp3",
      "/audio/voice/playhouse-tt-4-nana.mp3",
      "/audio/voice/playhouse-tt-4-dot.mp3",
      "/audio/voice/playhouse-tt-5-teddy.mp3",
      "/audio/voice/playhouse-tt-5-dot.mp3",
      "/audio/voice/playhouse-tt-6-nana.mp3",
      "/audio/voice/playhouse-tt-6-teddy.mp3",
      "/audio/voice/playhouse-el-1-teddy.mp3",
      "/audio/voice/playhouse-el-1-nana.mp3",
      "/audio/voice/playhouse-el-2-dot.mp3",
      "/audio/voice/playhouse-el-2-teddy.mp3",
      "/audio/voice/playhouse-el-3-elevator.mp3",
      "/audio/voice/playhouse-el-3-rosie.mp3",
      "/audio/voice/playhouse-el-4-teddy.mp3",
      "/audio/voice/playhouse-el-4-nana.mp3",
      "/audio/voice/playhouse-el-5-dot.mp3",
      "/audio/voice/playhouse-el-5-teddy.mp3",
      "/audio/voice/playhouse-el-6-elevator.mp3",
      "/audio/voice/playhouse-el-6-teddy.mp3",
      "/audio/voice/playhouse-ll-1-teddy.mp3",
      "/audio/voice/playhouse-ll-1-dot.mp3",
      "/audio/voice/playhouse-ll-2-nana.mp3",
      "/audio/voice/playhouse-ll-2-teddy.mp3",
      "/audio/voice/playhouse-ll-3-dot.mp3",
      "/audio/voice/playhouse-ll-3-teddy.mp3",
      "/audio/voice/playhouse-ll-4-stamp.mp3",
      "/audio/voice/playhouse-ll-4-nana.mp3",
      "/audio/voice/playhouse-ll-5-teddy.mp3",
      "/audio/voice/playhouse-ll-5-dot.mp3",
      "/audio/voice/playhouse-ll-6-lion.mp3",
      "/audio/voice/playhouse-ll-6-teddy.mp3",
      "/audio/voice/playhouse-ln-1-teddy.mp3",
      "/audio/voice/playhouse-ln-1-nana.mp3",
      "/audio/voice/playhouse-ln-2-line.mp3",
      "/audio/voice/playhouse-ln-2-dot.mp3",
      "/audio/voice/playhouse-ln-3-nana.mp3",
      "/audio/voice/playhouse-ln-3-teddy.mp3",
      "/audio/voice/playhouse-ln-4-shirt.mp3",
      "/audio/voice/playhouse-ln-4-teddy.mp3",
      "/audio/voice/playhouse-ln-5-dot.mp3",
      "/audio/voice/playhouse-ln-5-nana.mp3",
      "/audio/voice/playhouse-ln-6-wind.mp3",
      "/audio/voice/playhouse-ln-6-teddy.mp3",
      "/audio/voice/playhouse-wm-1-teddy.mp3",
      "/audio/voice/playhouse-wm-1-nana.mp3",
      "/audio/voice/playhouse-wm-2-dot.mp3",
      "/audio/voice/playhouse-wm-2-teddy.mp3",
      "/audio/voice/playhouse-wm-3-nana.mp3",
      "/audio/voice/playhouse-wm-3-teddy.mp3",
      "/audio/voice/playhouse-wm-4-pigeon.mp3",
      "/audio/voice/playhouse-wm-4-nana.mp3",
      "/audio/voice/playhouse-wm-5-teddy.mp3",
      "/audio/voice/playhouse-wm-5-nana.mp3",
      "/audio/voice/playhouse-wm-6-teddy.mp3",
      "/audio/voice/playhouse-wm-6-nana.mp3",
      "/audio/voice/playhouse-gb-1-nana.mp3",
      "/audio/voice/playhouse-gb-1-teddy.mp3",
      "/audio/voice/playhouse-gb-2-teddy.mp3",
      "/audio/voice/playhouse-gb-2-dot.mp3",
      "/audio/voice/playhouse-gb-3-teddy.mp3",
      "/audio/voice/playhouse-gb-3-nana.mp3",
      "/audio/voice/playhouse-gb-4-nana.mp3",
      "/audio/voice/playhouse-gb-4-teddy.mp3",
      "/audio/voice/playhouse-gb-5-dot.mp3",
      "/audio/voice/playhouse-gb-5-teddy.mp3",
      "/audio/voice/playhouse-gb-6-nana.mp3",
      "/audio/voice/playhouse-gb-6-teddy.mp3",
      "/audio/voice/playhouse-tp-1-teddy.mp3",
      "/audio/voice/playhouse-tp-1-nana.mp3",
      "/audio/voice/playhouse-tp-2-dot.mp3",
      "/audio/voice/playhouse-tp-2-nana.mp3",
      "/audio/voice/playhouse-tp-3-teddy.mp3",
      "/audio/voice/playhouse-tp-3-nana.mp3",
      "/audio/voice/playhouse-tp-4-teddy.mp3",
      "/audio/voice/playhouse-tp-4-nana.mp3",
      "/audio/voice/playhouse-tp-5-dot.mp3",
      "/audio/voice/playhouse-tp-5-teddy.mp3",
      "/audio/voice/playhouse-tp-6-nana.mp3",
      "/audio/voice/playhouse-tp-6-teddy.mp3",
      "/audio/voice/playhouse-tw-1-teddy.mp3",
      "/audio/voice/playhouse-tw-1-nana.mp3",
      "/audio/voice/playhouse-tw-2-dot.mp3",
      "/audio/voice/playhouse-tw-2-nana.mp3",
      "/audio/voice/playhouse-tw-3-teddy.mp3",
      "/audio/voice/playhouse-tw-3-nana.mp3",
      "/audio/voice/playhouse-tw-4-teddy.mp3",
      "/audio/voice/playhouse-tw-4-potatoes.mp3",
      "/audio/voice/playhouse-tw-5-rosie.mp3",
      "/audio/voice/playhouse-tw-5-nana.mp3",
      "/audio/voice/playhouse-tw-6-teddy.mp3",
      "/audio/voice/playhouse-tw-6-nana.mp3",
      "/audio/voice/playhouse-curtain.mp3",
      "/audio/voice/book-stoop-watermelon-1.mp3",
      "/audio/voice/book-stoop-watermelon-2.mp3",
      "/audio/voice/book-stoop-watermelon-3.mp3",
      "/audio/voice/book-stoop-watermelon-4.mp3",
      "/audio/voice/book-stoop-watermelon-5.mp3",
      "/audio/voice/book-stoop-watermelon-6.mp3",
      "/audio/voice/book-stoop-watermelon-7.mp3",
      "/audio/voice/book-stoop-watermelon-8.mp3",
      "/audio/voice/book-stoop-watermelon-9.mp3",
      "/audio/voice/book-stoop-watermelon-10.mp3",
      "/audio/voice/book-stoop-watermelon-11.mp3",
      "/audio/voice/book-stoop-watermelon-12.mp3",
      "/audio/voice/book-paper-gutter-boat-1.mp3",
      "/audio/voice/book-paper-gutter-boat-2.mp3",
      "/audio/voice/book-paper-gutter-boat-3.mp3",
      "/audio/voice/book-paper-gutter-boat-4.mp3",
      "/audio/voice/book-paper-gutter-boat-5.mp3",
      "/audio/voice/book-paper-gutter-boat-6.mp3",
      "/audio/voice/book-paper-gutter-boat-7.mp3",
      "/audio/voice/book-paper-gutter-boat-8.mp3",
      "/audio/voice/book-paper-gutter-boat-9.mp3",
      "/audio/voice/book-paper-gutter-boat-10.mp3",
      "/audio/voice/book-paper-gutter-boat-11.mp3",
      "/audio/voice/book-paper-gutter-boat-12.mp3",
      "/audio/voice/book-window-box-tomatoes-1.mp3",
      "/audio/voice/book-window-box-tomatoes-2.mp3",
      "/audio/voice/book-window-box-tomatoes-3.mp3",
      "/audio/voice/book-window-box-tomatoes-4.mp3",
      "/audio/voice/book-window-box-tomatoes-5.mp3",
      "/audio/voice/book-window-box-tomatoes-6.mp3",
      "/audio/voice/book-window-box-tomatoes-7.mp3",
      "/audio/voice/book-window-box-tomatoes-8.mp3",
      "/audio/voice/book-window-box-tomatoes-9.mp3",
      "/audio/voice/book-window-box-tomatoes-10.mp3",
      "/audio/voice/book-window-box-tomatoes-11.mp3",
      "/audio/voice/book-window-box-tomatoes-12.mp3",
      "/audio/voice/book-block-table-feast-1.mp3",
      "/audio/voice/book-block-table-feast-2.mp3",
      "/audio/voice/book-block-table-feast-3.mp3",
      "/audio/voice/book-block-table-feast-4.mp3",
      "/audio/voice/book-block-table-feast-5.mp3",
      "/audio/voice/book-block-table-feast-6.mp3",
      "/audio/voice/book-block-table-feast-7.mp3",
      "/audio/voice/book-block-table-feast-8.mp3",
      "/audio/voice/book-block-table-feast-9.mp3",
      "/audio/voice/book-block-table-feast-10.mp3",
      "/audio/voice/book-block-table-feast-11.mp3",
      "/audio/voice/book-block-table-feast-12.mp3",
      "/audio/voice/book-how-mail-travels-1.mp3",
      "/audio/voice/book-how-mail-travels-2.mp3",
      "/audio/voice/book-how-mail-travels-3.mp3",
      "/audio/voice/book-how-mail-travels-4.mp3",
      "/audio/voice/book-how-mail-travels-5.mp3",
      "/audio/voice/book-how-mail-travels-6.mp3",
      "/audio/voice/book-how-mail-travels-7.mp3",
      "/audio/voice/book-how-mail-travels-8.mp3",
      "/audio/voice/book-how-mail-travels-9.mp3",
      "/audio/voice/book-how-mail-travels-10.mp3",
      "/audio/voice/book-how-bread-rises-1.mp3",
      "/audio/voice/book-how-bread-rises-2.mp3",
      "/audio/voice/book-how-bread-rises-3.mp3",
      "/audio/voice/book-how-bread-rises-4.mp3",
      "/audio/voice/book-how-bread-rises-5.mp3",
      "/audio/voice/book-how-bread-rises-6.mp3",
      "/audio/voice/book-how-bread-rises-7.mp3",
      "/audio/voice/book-how-bread-rises-8.mp3",
      "/audio/voice/book-how-bread-rises-9.mp3",
      "/audio/voice/book-how-bread-rises-10.mp3",
      "/audio/voice/book-what-rain-does-1.mp3",
      "/audio/voice/book-what-rain-does-2.mp3",
      "/audio/voice/book-what-rain-does-3.mp3",
      "/audio/voice/book-what-rain-does-4.mp3",
      "/audio/voice/book-what-rain-does-5.mp3",
      "/audio/voice/book-what-rain-does-6.mp3",
      "/audio/voice/book-what-rain-does-7.mp3",
      "/audio/voice/book-what-rain-does-8.mp3",
      "/audio/voice/book-what-rain-does-9.mp3",
      "/audio/voice/book-what-rain-does-10.mp3",
      "/audio/voice/book-how-a-ferry-floats-1.mp3",
      "/audio/voice/book-how-a-ferry-floats-2.mp3",
      "/audio/voice/book-how-a-ferry-floats-3.mp3",
      "/audio/voice/book-how-a-ferry-floats-4.mp3",
      "/audio/voice/book-how-a-ferry-floats-5.mp3",
      "/audio/voice/book-how-a-ferry-floats-6.mp3",
      "/audio/voice/book-how-a-ferry-floats-7.mp3",
      "/audio/voice/book-how-a-ferry-floats-8.mp3",
      "/audio/voice/book-how-a-ferry-floats-9.mp3",
      "/audio/voice/book-how-a-ferry-floats-10.mp3",
      "/audio/voice/book-cat-on-mat-1.mp3",
      "/audio/voice/book-cat-on-mat-2.mp3",
      "/audio/voice/book-cat-on-mat-3.mp3",
      "/audio/voice/book-cat-on-mat-4.mp3",
      "/audio/voice/book-cat-on-mat-5.mp3",
      "/audio/voice/book-cat-on-mat-6.mp3",
      "/audio/voice/book-cat-on-mat-7.mp3",
      "/audio/voice/book-cat-on-mat-8.mp3",
      "/audio/voice/book-red-bus-run-1.mp3",
      "/audio/voice/book-red-bus-run-2.mp3",
      "/audio/voice/book-red-bus-run-3.mp3",
      "/audio/voice/book-red-bus-run-4.mp3",
      "/audio/voice/book-red-bus-run-5.mp3",
      "/audio/voice/book-red-bus-run-6.mp3",
      "/audio/voice/book-red-bus-run-7.mp3",
      "/audio/voice/book-red-bus-run-8.mp3",
      "/audio/voice/book-hot-pot-sip-1.mp3",
      "/audio/voice/book-hot-pot-sip-2.mp3",
      "/audio/voice/book-hot-pot-sip-3.mp3",
      "/audio/voice/book-hot-pot-sip-4.mp3",
      "/audio/voice/book-hot-pot-sip-5.mp3",
      "/audio/voice/book-hot-pot-sip-6.mp3",
      "/audio/voice/book-hot-pot-sip-7.mp3",
      "/audio/voice/book-hot-pot-sip-8.mp3",
      "/audio/voice/book-big-hug-bed-1.mp3",
      "/audio/voice/book-big-hug-bed-2.mp3",
      "/audio/voice/book-big-hug-bed-3.mp3",
      "/audio/voice/book-big-hug-bed-4.mp3",
      "/audio/voice/book-big-hug-bed-5.mp3",
      "/audio/voice/book-big-hug-bed-6.mp3",
      "/audio/voice/book-big-hug-bed-7.mp3",
      "/audio/voice/book-big-hug-bed-8.mp3",
      "/audio/voice/book-pig-in-mud-1.mp3",
      "/audio/voice/book-pig-in-mud-2.mp3",
      "/audio/voice/book-pig-in-mud-3.mp3",
      "/audio/voice/book-pig-in-mud-4.mp3",
      "/audio/voice/book-pig-in-mud-5.mp3",
      "/audio/voice/book-pig-in-mud-6.mp3",
      "/audio/voice/book-pig-in-mud-7.mp3",
      "/audio/voice/book-pig-in-mud-8.mp3",
      "/audio/voice/book-fox-in-box-1.mp3",
      "/audio/voice/book-fox-in-box-2.mp3",
      "/audio/voice/book-fox-in-box-3.mp3",
      "/audio/voice/book-fox-in-box-4.mp3",
      "/audio/voice/book-fox-in-box-5.mp3",
      "/audio/voice/book-fox-in-box-6.mp3",
      "/audio/voice/book-fox-in-box-7.mp3",
      "/audio/voice/book-fox-in-box-8.mp3",
      "/audio/voice/book-dog-on-log-1.mp3",
      "/audio/voice/book-dog-on-log-2.mp3",
      "/audio/voice/book-dog-on-log-3.mp3",
      "/audio/voice/book-dog-on-log-4.mp3",
      "/audio/voice/book-dog-on-log-5.mp3",
      "/audio/voice/book-dog-on-log-6.mp3",
      "/audio/voice/book-dog-on-log-7.mp3",
      "/audio/voice/book-dog-on-log-8.mp3",
      "/audio/voice/book-hen-in-pen-1.mp3",
      "/audio/voice/book-hen-in-pen-2.mp3",
      "/audio/voice/book-hen-in-pen-3.mp3",
      "/audio/voice/book-hen-in-pen-4.mp3",
      "/audio/voice/book-hen-in-pen-5.mp3",
      "/audio/voice/book-hen-in-pen-6.mp3",
      "/audio/voice/book-hen-in-pen-7.mp3",
      "/audio/voice/book-hen-in-pen-8.mp3",
      "/audio/voice/book-bug-in-mug-1.mp3",
      "/audio/voice/book-bug-in-mug-2.mp3",
      "/audio/voice/book-bug-in-mug-3.mp3",
      "/audio/voice/book-bug-in-mug-4.mp3",
      "/audio/voice/book-bug-in-mug-5.mp3",
      "/audio/voice/book-bug-in-mug-6.mp3",
      "/audio/voice/book-bug-in-mug-7.mp3",
      "/audio/voice/book-bug-in-mug-8.mp3",
      "/audio/voice/book-hop-on-top-1.mp3",
      "/audio/voice/book-hop-on-top-2.mp3",
      "/audio/voice/book-hop-on-top-3.mp3",
      "/audio/voice/book-hop-on-top-4.mp3",
      "/audio/voice/book-hop-on-top-5.mp3",
      "/audio/voice/book-hop-on-top-6.mp3",
      "/audio/voice/book-hop-on-top-7.mp3",
      "/audio/voice/book-hop-on-top-8.mp3",
      "/audio/voice/book-pancake-saturday-1.mp3",
      "/audio/voice/book-pancake-saturday-2.mp3",
      "/audio/voice/book-pancake-saturday-3.mp3",
      "/audio/voice/book-pancake-saturday-4.mp3",
      "/audio/voice/book-pancake-saturday-5.mp3",
      "/audio/voice/book-pancake-saturday-6.mp3",
      "/audio/voice/book-pancake-saturday-7.mp3",
      "/audio/voice/book-pancake-saturday-8.mp3",
      "/audio/voice/book-little-red-fire-truck-1.mp3",
      "/audio/voice/book-little-red-fire-truck-2.mp3",
      "/audio/voice/book-little-red-fire-truck-3.mp3",
      "/audio/voice/book-little-red-fire-truck-4.mp3",
      "/audio/voice/book-little-red-fire-truck-5.mp3",
      "/audio/voice/book-little-red-fire-truck-6.mp3",
      "/audio/voice/book-little-red-fire-truck-7.mp3",
      "/audio/voice/book-little-red-fire-truck-8.mp3",
      "/audio/voice/book-snow-maple-street-1.mp3",
      "/audio/voice/book-snow-maple-street-2.mp3",
      "/audio/voice/book-snow-maple-street-3.mp3",
      "/audio/voice/book-snow-maple-street-4.mp3",
      "/audio/voice/book-snow-maple-street-5.mp3",
      "/audio/voice/book-snow-maple-street-6.mp3",
      "/audio/voice/book-snow-maple-street-7.mp3",
      "/audio/voice/book-snow-maple-street-8.mp3",
      "/audio/voice/book-dot-library-mouse-1.mp3",
      "/audio/voice/book-dot-library-mouse-2.mp3",
      "/audio/voice/book-dot-library-mouse-3.mp3",
      "/audio/voice/book-dot-library-mouse-4.mp3",
      "/audio/voice/book-dot-library-mouse-5.mp3",
      "/audio/voice/book-dot-library-mouse-6.mp3",
      "/audio/voice/book-dot-library-mouse-7.mp3",
      "/audio/voice/book-dot-library-mouse-8.mp3",
      "/audio/voice/book-lemonade-stoop-1.mp3",
      "/audio/voice/book-lemonade-stoop-2.mp3",
      "/audio/voice/book-lemonade-stoop-3.mp3",
      "/audio/voice/book-lemonade-stoop-4.mp3",
      "/audio/voice/book-lemonade-stoop-5.mp3",
      "/audio/voice/book-lemonade-stoop-6.mp3",
      "/audio/voice/book-lemonade-stoop-7.mp3",
      "/audio/voice/book-lemonade-stoop-8.mp3",
      "/audio/voice/book-night-bus-home-1.mp3",
      "/audio/voice/book-night-bus-home-2.mp3",
      "/audio/voice/book-night-bus-home-3.mp3",
      "/audio/voice/book-night-bus-home-4.mp3",
      "/audio/voice/book-night-bus-home-5.mp3",
      "/audio/voice/book-night-bus-home-6.mp3",
      "/audio/voice/book-night-bus-home-7.mp3",
      "/audio/voice/book-night-bus-home-8.mp3",
      "/audio/voice/book-lost-red-mitten-1.mp3",
      "/audio/voice/book-lost-red-mitten-2.mp3",
      "/audio/voice/book-lost-red-mitten-3.mp3",
      "/audio/voice/book-lost-red-mitten-4.mp3",
      "/audio/voice/book-lost-red-mitten-5.mp3",
      "/audio/voice/book-lost-red-mitten-6.mp3",
      "/audio/voice/book-lost-red-mitten-7.mp3",
      "/audio/voice/book-lost-red-mitten-8.mp3",
      "/audio/voice/book-nana-porch-swing-1.mp3",
      "/audio/voice/book-nana-porch-swing-2.mp3",
      "/audio/voice/book-nana-porch-swing-3.mp3",
      "/audio/voice/book-nana-porch-swing-4.mp3",
      "/audio/voice/book-nana-porch-swing-5.mp3",
      "/audio/voice/book-nana-porch-swing-6.mp3",
      "/audio/voice/book-nana-porch-swing-7.mp3",
      "/audio/voice/book-nana-porch-swing-8.mp3",
      "/audio/voice/book-kind-mail-truck-1.mp3",
      "/audio/voice/book-kind-mail-truck-2.mp3",
      "/audio/voice/book-kind-mail-truck-3.mp3",
      "/audio/voice/book-kind-mail-truck-4.mp3",
      "/audio/voice/book-kind-mail-truck-5.mp3",
      "/audio/voice/book-kind-mail-truck-6.mp3",
      "/audio/voice/book-kind-mail-truck-7.mp3",
      "/audio/voice/book-kind-mail-truck-8.mp3",
      "/audio/voice/book-gully-harbor-morning-1.mp3",
      "/audio/voice/book-gully-harbor-morning-2.mp3",
      "/audio/voice/book-gully-harbor-morning-3.mp3",
      "/audio/voice/book-gully-harbor-morning-4.mp3",
      "/audio/voice/book-gully-harbor-morning-5.mp3",
      "/audio/voice/book-gully-harbor-morning-6.mp3",
      "/audio/voice/book-gully-harbor-morning-7.mp3",
      "/audio/voice/book-gully-harbor-morning-8.mp3",
      "/audio/voice/book-diner-booth-two-1.mp3",
      "/audio/voice/book-diner-booth-two-2.mp3",
      "/audio/voice/book-diner-booth-two-3.mp3",
      "/audio/voice/book-diner-booth-two-4.mp3",
      "/audio/voice/book-diner-booth-two-5.mp3",
      "/audio/voice/book-diner-booth-two-6.mp3",
      "/audio/voice/book-diner-booth-two-7.mp3",
      "/audio/voice/book-diner-booth-two-8.mp3",
      "/audio/voice/book-first-day-yellow-bus-1.mp3",
      "/audio/voice/book-first-day-yellow-bus-2.mp3",
      "/audio/voice/book-first-day-yellow-bus-3.mp3",
      "/audio/voice/book-first-day-yellow-bus-4.mp3",
      "/audio/voice/book-first-day-yellow-bus-5.mp3",
      "/audio/voice/book-first-day-yellow-bus-6.mp3",
      "/audio/voice/book-first-day-yellow-bus-7.mp3",
      "/audio/voice/book-first-day-yellow-bus-8.mp3",
      "/audio/voice/book-corner-store-bell-1.mp3",
      "/audio/voice/book-corner-store-bell-2.mp3",
      "/audio/voice/book-corner-store-bell-3.mp3",
      "/audio/voice/book-corner-store-bell-4.mp3",
      "/audio/voice/book-corner-store-bell-5.mp3",
      "/audio/voice/book-corner-store-bell-6.mp3",
      "/audio/voice/book-corner-store-bell-7.mp3",
      "/audio/voice/book-corner-store-bell-8.mp3",
      "/audio/voice/book-laundromat-rain-1.mp3",
      "/audio/voice/book-laundromat-rain-2.mp3",
      "/audio/voice/book-laundromat-rain-3.mp3",
      "/audio/voice/book-laundromat-rain-4.mp3",
      "/audio/voice/book-laundromat-rain-5.mp3",
      "/audio/voice/book-laundromat-rain-6.mp3",
      "/audio/voice/book-laundromat-rain-7.mp3",
      "/audio/voice/book-laundromat-rain-8.mp3",
      "/audio/voice/book-backyard-sprinkler-1.mp3",
      "/audio/voice/book-backyard-sprinkler-2.mp3",
      "/audio/voice/book-backyard-sprinkler-3.mp3",
      "/audio/voice/book-backyard-sprinkler-4.mp3",
      "/audio/voice/book-backyard-sprinkler-5.mp3",
      "/audio/voice/book-backyard-sprinkler-6.mp3",
      "/audio/voice/book-backyard-sprinkler-7.mp3",
      "/audio/voice/book-backyard-sprinkler-8.mp3",
      "/audio/voice/book-red-wagon-hill-1.mp3",
      "/audio/voice/book-red-wagon-hill-2.mp3",
      "/audio/voice/book-red-wagon-hill-3.mp3",
      "/audio/voice/book-red-wagon-hill-4.mp3",
      "/audio/voice/book-red-wagon-hill-5.mp3",
      "/audio/voice/book-red-wagon-hill-6.mp3",
      "/audio/voice/book-red-wagon-hill-7.mp3",
      "/audio/voice/book-red-wagon-hill-8.mp3",
      "/audio/voice/book-market-saturday-berries-1.mp3",
      "/audio/voice/book-market-saturday-berries-2.mp3",
      "/audio/voice/book-market-saturday-berries-3.mp3",
      "/audio/voice/book-market-saturday-berries-4.mp3",
      "/audio/voice/book-market-saturday-berries-5.mp3",
      "/audio/voice/book-market-saturday-berries-6.mp3",
      "/audio/voice/book-market-saturday-berries-7.mp3",
      "/audio/voice/book-market-saturday-berries-8.mp3",
      "/audio/voice/book-elevator-buttons-1.mp3",
      "/audio/voice/book-elevator-buttons-2.mp3",
      "/audio/voice/book-elevator-buttons-3.mp3",
      "/audio/voice/book-elevator-buttons-4.mp3",
      "/audio/voice/book-elevator-buttons-5.mp3",
      "/audio/voice/book-elevator-buttons-6.mp3",
      "/audio/voice/book-elevator-buttons-7.mp3",
      "/audio/voice/book-elevator-buttons-8.mp3",
      "/audio/voice/book-attic-rain-trunk-1.mp3",
      "/audio/voice/book-attic-rain-trunk-2.mp3",
      "/audio/voice/book-attic-rain-trunk-3.mp3",
      "/audio/voice/book-attic-rain-trunk-4.mp3",
      "/audio/voice/book-attic-rain-trunk-5.mp3",
      "/audio/voice/book-attic-rain-trunk-6.mp3",
      "/audio/voice/book-attic-rain-trunk-7.mp3",
      "/audio/voice/book-attic-rain-trunk-8.mp3",
      "/audio/voice/book-ferry-horn-morning-1.mp3",
      "/audio/voice/book-ferry-horn-morning-2.mp3",
      "/audio/voice/book-ferry-horn-morning-3.mp3",
      "/audio/voice/book-ferry-horn-morning-4.mp3",
      "/audio/voice/book-ferry-horn-morning-5.mp3",
      "/audio/voice/book-ferry-horn-morning-6.mp3",
      "/audio/voice/book-ferry-horn-morning-7.mp3",
      "/audio/voice/book-ferry-horn-morning-8.mp3",
      "/audio/voice/book-sidewalk-chalk-sun-1.mp3",
      "/audio/voice/book-sidewalk-chalk-sun-2.mp3",
      "/audio/voice/book-sidewalk-chalk-sun-3.mp3",
      "/audio/voice/book-sidewalk-chalk-sun-4.mp3",
      "/audio/voice/book-sidewalk-chalk-sun-5.mp3",
      "/audio/voice/book-sidewalk-chalk-sun-6.mp3",
      "/audio/voice/book-sidewalk-chalk-sun-7.mp3",
      "/audio/voice/book-sidewalk-chalk-sun-8.mp3",
      "/audio/voice/book-bakery-window-fog-1.mp3",
      "/audio/voice/book-bakery-window-fog-2.mp3",
      "/audio/voice/book-bakery-window-fog-3.mp3",
      "/audio/voice/book-bakery-window-fog-4.mp3",
      "/audio/voice/book-bakery-window-fog-5.mp3",
      "/audio/voice/book-bakery-window-fog-6.mp3",
      "/audio/voice/book-bakery-window-fog-7.mp3",
      "/audio/voice/book-bakery-window-fog-8.mp3",
      "/audio/voice/book-hardware-drawer-knobs-1.mp3",
      "/audio/voice/book-hardware-drawer-knobs-2.mp3",
      "/audio/voice/book-hardware-drawer-knobs-3.mp3",
      "/audio/voice/book-hardware-drawer-knobs-4.mp3",
      "/audio/voice/book-hardware-drawer-knobs-5.mp3",
      "/audio/voice/book-hardware-drawer-knobs-6.mp3",
      "/audio/voice/book-hardware-drawer-knobs-7.mp3",
      "/audio/voice/book-hardware-drawer-knobs-8.mp3",
      "/audio/voice/book-park-bandstand-pigeons-1.mp3",
      "/audio/voice/book-park-bandstand-pigeons-2.mp3",
      "/audio/voice/book-park-bandstand-pigeons-3.mp3",
      "/audio/voice/book-park-bandstand-pigeons-4.mp3",
      "/audio/voice/book-park-bandstand-pigeons-5.mp3",
      "/audio/voice/book-park-bandstand-pigeons-6.mp3",
      "/audio/voice/book-park-bandstand-pigeons-7.mp3",
      "/audio/voice/book-park-bandstand-pigeons-8.mp3",
      "/audio/voice/book-subway-token-mouse-1.mp3",
      "/audio/voice/book-subway-token-mouse-2.mp3",
      "/audio/voice/book-subway-token-mouse-3.mp3",
      "/audio/voice/book-subway-token-mouse-4.mp3",
      "/audio/voice/book-subway-token-mouse-5.mp3",
      "/audio/voice/book-subway-token-mouse-6.mp3",
      "/audio/voice/book-subway-token-mouse-7.mp3",
      "/audio/voice/book-subway-token-mouse-8.mp3",
      "/audio/voice/book-porch-dusk-jar-1.mp3",
      "/audio/voice/book-porch-dusk-jar-2.mp3",
      "/audio/voice/book-porch-dusk-jar-3.mp3",
      "/audio/voice/book-porch-dusk-jar-4.mp3",
      "/audio/voice/book-porch-dusk-jar-5.mp3",
      "/audio/voice/book-porch-dusk-jar-6.mp3",
      "/audio/voice/book-porch-dusk-jar-7.mp3",
      "/audio/voice/book-porch-dusk-jar-8.mp3",
      "/audio/voice/book-lighthouse-blink-1.mp3",
      "/audio/voice/book-lighthouse-blink-2.mp3",
      "/audio/voice/book-lighthouse-blink-3.mp3",
      "/audio/voice/book-lighthouse-blink-4.mp3",
      "/audio/voice/book-lighthouse-blink-5.mp3",
      "/audio/voice/book-lighthouse-blink-6.mp3",
      "/audio/voice/book-lighthouse-blink-7.mp3",
      "/audio/voice/book-lighthouse-blink-8.mp3",
      "/audio/voice/book-corner-shop-ding-1.mp3",
      "/audio/voice/book-corner-shop-ding-2.mp3",
      "/audio/voice/book-corner-shop-ding-3.mp3",
      "/audio/voice/book-corner-shop-ding-4.mp3",
      "/audio/voice/book-corner-shop-ding-5.mp3",
      "/audio/voice/book-corner-shop-ding-6.mp3",
      "/audio/voice/book-corner-shop-ding-7.mp3",
      "/audio/voice/book-corner-shop-ding-8.mp3",
      "/audio/voice/book-fountain-three-coins-1.mp3",
      "/audio/voice/book-fountain-three-coins-2.mp3",
      "/audio/voice/book-fountain-three-coins-3.mp3",
      "/audio/voice/book-fountain-three-coins-4.mp3",
      "/audio/voice/book-fountain-three-coins-5.mp3",
      "/audio/voice/book-fountain-three-coins-6.mp3",
      "/audio/voice/book-fountain-three-coins-7.mp3",
      "/audio/voice/book-fountain-three-coins-8.mp3",
      "/audio/voice/book-yellow-taxi-puddle-1.mp3",
      "/audio/voice/book-yellow-taxi-puddle-2.mp3",
      "/audio/voice/book-yellow-taxi-puddle-3.mp3",
      "/audio/voice/book-yellow-taxi-puddle-4.mp3",
      "/audio/voice/book-yellow-taxi-puddle-5.mp3",
      "/audio/voice/book-yellow-taxi-puddle-6.mp3",
      "/audio/voice/book-yellow-taxi-puddle-7.mp3",
      "/audio/voice/book-yellow-taxi-puddle-8.mp3",
      "/audio/voice/book-lost-key-mat-1.mp3",
      "/audio/voice/book-lost-key-mat-2.mp3",
      "/audio/voice/book-lost-key-mat-3.mp3",
      "/audio/voice/book-lost-key-mat-4.mp3",
      "/audio/voice/book-lost-key-mat-5.mp3",
      "/audio/voice/book-lost-key-mat-6.mp3",
      "/audio/voice/book-lost-key-mat-7.mp3",
      "/audio/voice/book-lost-key-mat-8.mp3",
      "/audio/voice/book-quilt-square-moon-1.mp3",
      "/audio/voice/book-quilt-square-moon-2.mp3",
      "/audio/voice/book-quilt-square-moon-3.mp3",
      "/audio/voice/book-quilt-square-moon-4.mp3",
      "/audio/voice/book-quilt-square-moon-5.mp3",
      "/audio/voice/book-quilt-square-moon-6.mp3",
      "/audio/voice/book-quilt-square-moon-7.mp3",
      "/audio/voice/book-quilt-square-moon-8.mp3",
      "/audio/voice/book-snow-plow-dawn-1.mp3",
      "/audio/voice/book-snow-plow-dawn-2.mp3",
      "/audio/voice/book-snow-plow-dawn-3.mp3",
      "/audio/voice/book-snow-plow-dawn-4.mp3",
      "/audio/voice/book-snow-plow-dawn-5.mp3",
      "/audio/voice/book-snow-plow-dawn-6.mp3",
      "/audio/voice/book-snow-plow-dawn-7.mp3",
      "/audio/voice/book-snow-plow-dawn-8.mp3",
      "/audio/voice/book-icebox-lemonade-1.mp3",
      "/audio/voice/book-icebox-lemonade-2.mp3",
      "/audio/voice/book-icebox-lemonade-3.mp3",
      "/audio/voice/book-icebox-lemonade-4.mp3",
      "/audio/voice/book-icebox-lemonade-5.mp3",
      "/audio/voice/book-icebox-lemonade-6.mp3",
      "/audio/voice/book-icebox-lemonade-7.mp3",
      "/audio/voice/book-icebox-lemonade-8.mp3",
      "/audio/voice/book-safari-alphabet-1.mp3",
      "/audio/voice/book-safari-alphabet-2.mp3",
      "/audio/voice/book-safari-alphabet-3.mp3",
      "/audio/voice/book-safari-alphabet-4.mp3",
      "/audio/voice/book-safari-alphabet-5.mp3",
      "/audio/voice/book-safari-alphabet-6.mp3",
      "/audio/voice/book-safari-alphabet-7.mp3",
      "/audio/voice/book-safari-alphabet-8.mp3",
      "/audio/voice/book-safari-alphabet-9.mp3",
      "/audio/voice/book-safari-alphabet-10.mp3",
      "/audio/voice/book-safari-alphabet-11.mp3",
      "/audio/voice/book-safari-alphabet-12.mp3",
      "/audio/voice/book-safari-alphabet-13.mp3",
      "/audio/voice/book-safari-alphabet-14.mp3",
      "/audio/voice/book-safari-alphabet-15.mp3",
      "/audio/voice/book-safari-alphabet-16.mp3",
      "/audio/voice/book-safari-alphabet-17.mp3",
      "/audio/voice/book-safari-alphabet-18.mp3",
      "/audio/voice/book-safari-alphabet-19.mp3",
      "/audio/voice/book-safari-alphabet-20.mp3",
      "/audio/voice/book-safari-alphabet-21.mp3",
      "/audio/voice/book-safari-alphabet-22.mp3",
      "/audio/voice/book-safari-alphabet-23.mp3",
      "/audio/voice/book-safari-alphabet-24.mp3",
      "/audio/voice/book-safari-alphabet-25.mp3",
      "/audio/voice/book-safari-alphabet-26.mp3",
      "/audio/voice/book-garden-counting-1.mp3",
      "/audio/voice/book-garden-counting-2.mp3",
      "/audio/voice/book-garden-counting-3.mp3",
      "/audio/voice/book-garden-counting-4.mp3",
      "/audio/voice/book-garden-counting-5.mp3",
      "/audio/voice/book-colors-shapes-circus-1.mp3",
      "/audio/voice/book-colors-shapes-circus-2.mp3",
      "/audio/voice/book-colors-shapes-circus-3.mp3",
      "/audio/voice/book-little-bear-bedtime-1.mp3",
      "/audio/voice/book-little-bear-bedtime-2.mp3",
      "/audio/voice/book-little-bear-bedtime-3.mp3",
      "/audio/voice/book-little-bear-bedtime-4.mp3",
      "/audio/voice/book-little-bear-bedtime-5.mp3",
      "/audio/voice/book-little-bear-bedtime-6.mp3",
      "/audio/voice/book-little-bear-bedtime-7.mp3",
      "/audio/voice/book-little-bear-bedtime-8.mp3",
      "/audio/voice/book-buddy-farm-tale-1.mp3",
      "/audio/voice/book-buddy-farm-tale-2.mp3",
      "/audio/voice/book-buddy-farm-tale-3.mp3",
      "/audio/voice/book-rocket-space-trip-1.mp3",
      "/audio/voice/book-rocket-space-trip-2.mp3",
      "/audio/voice/book-rocket-space-trip-3.mp3",
      "/audio/voice/book-ocean-friends-dive-1.mp3",
      "/audio/voice/book-ocean-friends-dive-2.mp3",
      "/audio/voice/book-ocean-friends-dive-3.mp3",
      "/audio/voice/book-feelings-with-leo-1.mp3",
      "/audio/voice/book-feelings-with-leo-2.mp3",
      "/audio/voice/book-feelings-with-leo-3.mp3",
      "/audio/voice/book-cosmic-rocket-journey-1.mp3",
      "/audio/voice/book-cosmic-rocket-journey-2.mp3",
      "/audio/voice/book-cosmic-rocket-journey-3.mp3",
      "/audio/voice/book-cosmic-rocket-journey-4.mp3",
      "/audio/voice/book-deep-ocean-wonders-1.mp3",
      "/audio/voice/book-deep-ocean-wonders-2.mp3",
      "/audio/voice/book-deep-ocean-wonders-3.mp3",
      "/audio/voice/book-deep-ocean-wonders-4.mp3",
      "/audio/voice/book-tiny-seed-grows-1.mp3",
      "/audio/voice/book-tiny-seed-grows-2.mp3",
      "/audio/voice/book-tiny-seed-grows-3.mp3",
      "/audio/voice/book-tiny-seed-grows-4.mp3",
      "/audio/voice/book-bedtime-starlight-lullaby-1.mp3",
      "/audio/voice/book-bedtime-starlight-lullaby-2.mp3",
      "/audio/voice/book-bedtime-starlight-lullaby-3.mp3",
      "/audio/voice/book-bedtime-starlight-lullaby-4.mp3",
      "/audio/voice/book-magic-manners-tea-party-1.mp3",
      "/audio/voice/book-magic-manners-tea-party-2.mp3",
      "/audio/voice/book-magic-manners-tea-party-3.mp3",
      "/audio/voice/book-magic-manners-tea-party-4.mp3",
      "/audio/voice/book-the-noisy-farm-chorus-1.mp3",
      "/audio/voice/book-the-noisy-farm-chorus-2.mp3",
      "/audio/voice/book-the-noisy-farm-chorus-3.mp3",
      "/audio/voice/book-the-noisy-farm-chorus-4.mp3",
      "/audio/voice/book-dino-footprint-detective-1.mp3",
      "/audio/voice/book-dino-footprint-detective-2.mp3",
      "/audio/voice/book-dino-footprint-detective-3.mp3",
      "/audio/voice/book-dino-footprint-detective-4.mp3",
      "/audio/voice/book-rainy-day-rainbow-builder-1.mp3",
      "/audio/voice/book-rainy-day-rainbow-builder-2.mp3",
      "/audio/voice/book-rainy-day-rainbow-builder-3.mp3",
      "/audio/voice/book-rainy-day-rainbow-builder-4.mp3",
      "/audio/voice/book-the-brave-little-firefly-1.mp3",
      "/audio/voice/book-the-brave-little-firefly-2.mp3",
      "/audio/voice/book-the-brave-little-firefly-3.mp3",
      "/audio/voice/book-the-brave-little-firefly-4.mp3",
      "/audio/voice/book-busy-beehive-architects-1.mp3",
      "/audio/voice/book-busy-beehive-architects-2.mp3",
      "/audio/voice/book-busy-beehive-architects-3.mp3",
      "/audio/voice/book-busy-beehive-architects-4.mp3",
      "/audio/voice/book-the-curious-caterpillar-1.mp3",
      "/audio/voice/book-the-curious-caterpillar-2.mp3",
      "/audio/voice/book-the-curious-caterpillar-3.mp3",
      "/audio/voice/book-the-curious-caterpillar-4.mp3",
      "/audio/voice/book-the-helpful-little-tugboat-1.mp3",
      "/audio/voice/book-the-helpful-little-tugboat-2.mp3",
      "/audio/voice/book-the-helpful-little-tugboat-3.mp3",
      "/audio/voice/book-the-helpful-little-tugboat-4.mp3",
      "/audio/voice/book-superhero-phonics-squad-1.mp3",
      "/audio/voice/book-superhero-phonics-squad-2.mp3",
      "/audio/voice/book-superhero-phonics-squad-3.mp3",
      "/audio/voice/book-superhero-phonics-squad-4.mp3",
      "/audio/voice/book-the-clock-tower-chimes-1.mp3",
      "/audio/voice/book-the-clock-tower-chimes-2.mp3",
      "/audio/voice/book-the-clock-tower-chimes-3.mp3",
      "/audio/voice/book-the-clock-tower-chimes-4.mp3",
      "/audio/voice/book-little-bear-lost-button-1.mp3",
      "/audio/voice/book-little-bear-lost-button-2.mp3",
      "/audio/voice/book-little-bear-lost-button-3.mp3",
      "/audio/voice/book-little-bear-lost-button-4.mp3",
      "/audio/voice/book-penguin-floe-night-1.mp3",
      "/audio/voice/book-penguin-floe-night-2.mp3",
      "/audio/voice/book-penguin-floe-night-3.mp3",
      "/audio/voice/book-penguin-floe-night-4.mp3",
      "/audio/voice/book-owl-wood-lullaby-1.mp3",
      "/audio/voice/book-owl-wood-lullaby-2.mp3",
      "/audio/voice/book-owl-wood-lullaby-3.mp3",
      "/audio/voice/book-owl-wood-lullaby-4.mp3",
      "/audio/voice/book-high-street-bus-1.mp3",
      "/audio/voice/book-high-street-bus-2.mp3",
      "/audio/voice/book-high-street-bus-3.mp3",
      "/audio/voice/book-high-street-bus-4.mp3",
      "/audio/voice/book-nana-soup-pot-1.mp3",
      "/audio/voice/book-nana-soup-pot-2.mp3",
      "/audio/voice/book-nana-soup-pot-3.mp3",
      "/audio/voice/book-nana-soup-pot-4.mp3",
      "/audio/voice/book-pond-edge-bugs-1.mp3",
      "/audio/voice/book-pond-edge-bugs-2.mp3",
      "/audio/voice/book-pond-edge-bugs-3.mp3",
      "/audio/voice/book-pond-edge-bugs-4.mp3",
      "/audio/voice/book-park-green-picnic-1.mp3",
      "/audio/voice/book-park-green-picnic-2.mp3",
      "/audio/voice/book-park-green-picnic-3.mp3",
      "/audio/voice/book-park-green-picnic-4.mp3",
      "/audio/voice/book-atelier-paint-day-1.mp3",
      "/audio/voice/book-atelier-paint-day-2.mp3",
      "/audio/voice/book-atelier-paint-day-3.mp3",
      "/audio/voice/book-atelier-paint-day-4.mp3",
      "/audio/voice/book-letter-meadow-abc-1.mp3",
      "/audio/voice/book-letter-meadow-abc-2.mp3",
      "/audio/voice/book-letter-meadow-abc-3.mp3",
      "/audio/voice/book-letter-meadow-abc-4.mp3",
      "/audio/voice/book-pine-trail-map-1.mp3",
      "/audio/voice/book-pine-trail-map-2.mp3",
      "/audio/voice/book-pine-trail-map-3.mp3",
      "/audio/voice/book-pine-trail-map-4.mp3",
      "/audio/voice/book-home-kind-morning-1.mp3",
      "/audio/voice/book-home-kind-morning-2.mp3",
      "/audio/voice/book-home-kind-morning-3.mp3",
      "/audio/voice/book-home-kind-morning-4.mp3",
      "/audio/voice/shared-yes-rhyme.mp3",
      "/audio/voice/shared-match-friend.mp3",
      "/audio/voice/shared-finished-game.mp3",
      "/audio/voice/shared-yes.mp3",
      "/audio/voice/shared-try-another.mp3",
      "/audio/voice/shared-look-again.mp3",
      "/audio/voice/shared-rhyme-hooray.mp3",
      "/audio/voice/shared-memory-hooray.mp3",
      "/audio/voice/shared-balloon-next.mp3",
      "/audio/voice/shared-trace-done.mp3",
      "/audio/voice/games-rhyme-r1.mp3",
      "/audio/voice/games-rhyme-r2.mp3",
      "/audio/voice/games-rhyme-r3.mp3",
      "/audio/voice/games-rhyme-r4.mp3",
      "/audio/voice/games-rhyme-r5.mp3",
      "/audio/voice/games-rhyme-r6.mp3",
      "/audio/voice/games-rhyme-r7.mp3",
      "/audio/voice/games-rhyme-r8.mp3",
      "/audio/voice/games-rhyme-r9.mp3",
      "/audio/voice/games-rhyme-r10.mp3",
      "/audio/voice/games-rhyme-r11.mp3",
      "/audio/voice/games-rhyme-r12.mp3",
      "/audio/voice/games-rhyme-r13.mp3",
      "/audio/voice/games-rhyme-r14.mp3",
      "/audio/voice/games-rhyme-r15.mp3",
      "/audio/voice/games-rhyme-r16.mp3",
      "/audio/voice/games-rhyme-welcome.mp3",
      "/audio/voice/games-memory-welcome.mp3",
      "/audio/voice/games-memory-find.mp3",
      "/audio/voice/games-bubble-welcome.mp3",
      "/audio/voice/world-rhyme-r-cat.mp3",
      "/audio/voice/world-rhyme-r-star.mp3",
      "/audio/voice/world-rhyme-r-frog.mp3",
      "/audio/voice/world-rhyme-r-bee.mp3",
      "/audio/voice/world-rhyme-r-sun.mp3",
      "/audio/voice/world-rhyme-r-fox.mp3",
      "/audio/voice/world-rhyme-r-cake.mp3",
      "/audio/voice/world-rhyme-r-bell.mp3",
      "/audio/voice/world-rhyme-k-pan.mp3",
      "/audio/voice/world-rhyme-k-pot.mp3",
      "/audio/voice/world-rhyme-k-bun.mp3",
      "/audio/voice/world-rhyme-k-cake.mp3",
      "/audio/voice/world-rhyme-k-jam.mp3",
      "/audio/voice/world-rhyme-k-pie.mp3",
      "/audio/voice/world-rhyme-k-stew.mp3",
      "/audio/voice/world-rhyme-k-mill.mp3",
      "/audio/voice/world-rhyme-k-rice.mp3",
      "/audio/voice/world-rhyme-k-bean.mp3",
      "/audio/voice/world-rhyme-k-pear.mp3",
      "/audio/voice/world-rhyme-k-mug.mp3",
      "/audio/voice/world-rhyme-k-toast.mp3",
      "/audio/voice/world-rhyme-k-spoon.mp3",
      "/audio/voice/world-rhyme-k-grill.mp3",
      "/audio/voice/world-rhyme-k-dough.mp3",
      "/audio/voice/world-rhyme-n-star.mp3",
      "/audio/voice/world-rhyme-n-light.mp3",
      "/audio/voice/world-rhyme-n-bed.mp3",
      "/audio/voice/world-rhyme-n-moon.mp3",
      "/audio/voice/world-rhyme-n-dark.mp3",
      "/audio/voice/world-rhyme-n-dream.mp3",
      "/audio/voice/world-rhyme-n-sock.mp3",
      "/audio/voice/world-rhyme-n-yawn.mp3",
      "/audio/voice/world-rhyme-n-sleep.mp3",
      "/audio/voice/world-rhyme-n-rest.mp3",
      "/audio/voice/world-rhyme-n-shade.mp3",
      "/audio/voice/world-rhyme-n-quiet.mp3",
      "/audio/voice/world-rhyme-n-glow.mp3",
      "/audio/voice/world-rhyme-n-night2.mp3",
      "/audio/voice/world-rhyme-n-dream2.mp3",
      "/audio/voice/world-rhyme-v-bus.mp3",
      "/audio/voice/world-rhyme-v-car.mp3",
      "/audio/voice/world-rhyme-v-van.mp3",
      "/audio/voice/world-rhyme-v-train.mp3",
      "/audio/voice/world-rhyme-v-bike.mp3",
      "/audio/voice/world-rhyme-v-road.mp3",
      "/audio/voice/world-rhyme-v-beep.mp3",
      "/audio/voice/world-rhyme-v-dock.mp3",
      "/audio/voice/world-rhyme-v-ship.mp3",
      "/audio/voice/world-rhyme-v-wheel.mp3",
      "/audio/voice/world-rhyme-v-horn.mp3",
      "/audio/voice/world-rhyme-v-go.mp3",
      "/audio/voice/world-rhyme-v-park.mp3",
      "/audio/voice/world-rhyme-v-track.mp3",
      "/audio/voice/world-rhyme-v-plane.mp3",
      "/audio/voice/world-rhyme-v-ferry.mp3",
      "/audio/voice/world-rhyme-l-cat.mp3",
      "/audio/voice/world-rhyme-l-ten.mp3",
      "/audio/voice/world-rhyme-l-bee.mp3",
      "/audio/voice/world-rhyme-l-fox.mp3",
      "/audio/voice/world-rhyme-l-map.mp3",
      "/audio/voice/world-rhyme-l-book.mp3",
      "/audio/voice/world-rhyme-l-six.mp3",
      "/audio/voice/world-rhyme-l-shape.mp3",
      "/audio/voice/world-rhyme-l-pen.mp3",
      "/audio/voice/world-rhyme-l-read.mp3",
      "/audio/voice/world-rhyme-l-count.mp3",
      "/audio/voice/world-rhyme-l-spell.mp3",
      "/audio/voice/world-rhyme-l-line.mp3",
      "/audio/voice/world-rhyme-l-dot.mp3",
      "/audio/voice/world-rhyme-l-page.mp3",
      "/audio/voice/world-rhyme-l-quiz.mp3",
      "/audio/voice/world-rhyme-a-pig.mp3",
      "/audio/voice/world-rhyme-a-hen.mp3",
      "/audio/voice/world-rhyme-a-sheep.mp3",
      "/audio/voice/world-rhyme-a-cat.mp3",
      "/audio/voice/world-rhyme-a-cow.mp3",
      "/audio/voice/world-rhyme-a-duck.mp3",
      "/audio/voice/world-rhyme-a-dog.mp3",
      "/audio/voice/world-rhyme-a-goat.mp3",
      "/audio/voice/world-rhyme-a-roar.mp3",
      "/audio/voice/world-rhyme-a-tail.mp3",
      "/audio/voice/world-rhyme-a-nest.mp3",
      "/audio/voice/world-rhyme-a-moo.mp3",
      "/audio/voice/world-rhyme-a-chirp.mp3",
      "/audio/voice/world-rhyme-a-wool.mp3",
      "/audio/voice/world-rhyme-a-snout.mp3",
      "/audio/voice/world-rhyme-a-herd.mp3",
      "/audio/voice/world-rhyme-b-bee.mp3",
      "/audio/voice/world-rhyme-b-bug.mp3",
      "/audio/voice/world-rhyme-b-ant.mp3",
      "/audio/voice/world-rhyme-b-snail.mp3",
      "/audio/voice/world-rhyme-b-web.mp3",
      "/audio/voice/world-rhyme-b-fly.mp3",
      "/audio/voice/world-rhyme-b-hop.mp3",
      "/audio/voice/world-rhyme-b-flower.mp3",
      "/audio/voice/world-rhyme-b-wing.mp3",
      "/audio/voice/world-rhyme-b-crawl.mp3",
      "/audio/voice/world-rhyme-b-dew.mp3",
      "/audio/voice/world-rhyme-b-pond.mp3",
      "/audio/voice/world-rhyme-b-spot.mp3",
      "/audio/voice/world-rhyme-b-buzz.mp3",
      "/audio/voice/world-rhyme-b-leaf.mp3",
      "/audio/voice/world-rhyme-b-hive.mp3",
      "/audio/voice/world-rhyme-i-ice.mp3",
      "/audio/voice/world-rhyme-i-seal.mp3",
      "/audio/voice/world-rhyme-i-snow.mp3",
      "/audio/voice/world-rhyme-i-whale.mp3",
      "/audio/voice/world-rhyme-i-fox.mp3",
      "/audio/voice/world-rhyme-i-cold.mp3",
      "/audio/voice/world-rhyme-i-den.mp3",
      "/audio/voice/world-rhyme-i-flake.mp3",
      "/audio/voice/world-rhyme-ar-floe.mp3",
      "/audio/voice/world-rhyme-ar-puff.mp3",
      "/audio/voice/world-rhyme-ar-slide.mp3",
      "/audio/voice/world-rhyme-ar-fur.mp3",
      "/audio/voice/world-rhyme-ar-bay.mp3",
      "/audio/voice/world-rhyme-ar-wind.mp3",
      "/audio/voice/world-rhyme-ar-huddle.mp3",
      "/audio/voice/world-rhyme-ar-light.mp3",
      "/audio/voice/world-rhyme-c-park.mp3",
      "/audio/voice/world-rhyme-c-bell.mp3",
      "/audio/voice/world-rhyme-c-tree.mp3",
      "/audio/voice/world-rhyme-c-shop.mp3",
      "/audio/voice/world-rhyme-c-bag.mp3",
      "/audio/voice/world-rhyme-c-clock.mp3",
      "/audio/voice/world-rhyme-c-street.mp3",
      "/audio/voice/world-rhyme-c-lamp.mp3",
      "/audio/voice/world-rhyme-c-bus.mp3",
      "/audio/voice/world-rhyme-c-stop.mp3",
      "/audio/voice/world-rhyme-c-van.mp3",
      "/audio/voice/world-rhyme-c-crowd.mp3",
      "/audio/voice/world-rhyme-c-gate.mp3",
      "/audio/voice/world-rhyme-c-bench.mp3",
      "/audio/voice/world-rhyme-c-sign.mp3",
      "/audio/voice/world-rhyme-c-square.mp3",
      "/audio/voice/world-rhyme-s-book.mp3",
      "/audio/voice/world-rhyme-s-tale.mp3",
      "/audio/voice/world-rhyme-s-king.mp3",
      "/audio/voice/world-rhyme-s-hen.mp3",
      "/audio/voice/world-rhyme-s-page.mp3",
      "/audio/voice/world-rhyme-s-boat.mp3",
      "/audio/voice/world-rhyme-s-crown.mp3",
      "/audio/voice/world-rhyme-s-star.mp3",
      "/audio/voice/world-rhyme-s-once.mp3",
      "/audio/voice/world-rhyme-s-end.mp3",
      "/audio/voice/world-rhyme-s-fox.mp3",
      "/audio/voice/world-rhyme-s-moon.mp3",
      "/audio/voice/world-rhyme-s-wave.mp3",
      "/audio/voice/world-rhyme-s-knight.mp3",
      "/audio/voice/world-rhyme-s-wish.mp3",
      "/audio/voice/world-rhyme-s-told.mp3",
      "/audio/voice/world-rhyme-m-hug.mp3",
      "/audio/voice/world-rhyme-m-home.mp3",
      "/audio/voice/world-rhyme-m-heart.mp3",
      "/audio/voice/world-rhyme-m-soap.mp3",
      "/audio/voice/world-rhyme-m-cup.mp3",
      "/audio/voice/world-rhyme-m-brush.mp3",
      "/audio/voice/world-rhyme-m-door.mp3",
      "/audio/voice/world-rhyme-m-hand.mp3",
      "/audio/voice/world-rhyme-m-wash.mp3",
      "/audio/voice/world-rhyme-m-tooth.mp3",
      "/audio/voice/world-rhyme-m-kind.mp3",
      "/audio/voice/world-rhyme-m-share.mp3",
      "/audio/voice/world-rhyme-m-rest.mp3",
      "/audio/voice/world-rhyme-m-name.mp3",
      "/audio/voice/world-rhyme-m-play.mp3",
      "/audio/voice/world-rhyme-ad-map.mp3",
      "/audio/voice/world-rhyme-ad-rain.mp3",
      "/audio/voice/world-rhyme-ad-tree.mp3",
      "/audio/voice/world-rhyme-ad-cave.mp3",
      "/audio/voice/world-rhyme-ad-boot.mp3",
      "/audio/voice/world-rhyme-ad-gem.mp3",
      "/audio/voice/world-rhyme-ad-path.mp3",
      "/audio/voice/world-rhyme-ad-rock.mp3",
      "/audio/voice/world-rhyme-ad-hill.mp3",
      "/audio/voice/world-rhyme-ad-pack.mp3",
      "/audio/voice/world-rhyme-ad-star.mp3",
      "/audio/voice/world-rhyme-ad-moon.mp3",
      "/audio/voice/world-rhyme-ad-quest.mp3",
      "/audio/voice/world-rhyme-ad-storm.mp3",
      "/audio/voice/world-rhyme-ad-rope.mp3",
      "/audio/voice/world-rhyme-ad-flag.mp3",
      "/audio/voice/bubble-begins-a-apple.mp3",
      "/audio/voice/bubble-begins-b-bear.mp3",
      "/audio/voice/bubble-begins-c-cat.mp3",
      "/audio/voice/bubble-begins-d-dolphin.mp3",
      "/audio/voice/bubble-begins-m-moon.mp3",
      "/audio/voice/bubble-begins-s-sun.mp3",
      "/audio/voice/bubble-begins-t-tiger.mp3",
      "/audio/voice/bubble-begins-p-puppy.mp3",
      "/audio/voice/bubble-begins-f-fish.mp3",
      "/audio/voice/bubble-begins-h-hat.mp3",
      "/audio/voice/bubble-begins-n-nest.mp3",
      "/audio/voice/bubble-begins-r-rain.mp3",
      "/audio/voice/bubble-begins-i-ice.mp3",
      "/audio/voice/bubble-begins-p-penguin.mp3",
      "/audio/voice/bubble-begins-s-seal.mp3",
      "/audio/voice/bubble-begins-n-north.mp3",
      "/audio/voice/bubble-begins-w-whale.mp3",
      "/audio/voice/bubble-begins-f-fox.mp3",
      "/audio/voice/bubble-begins-o-owl.mp3",
      "/audio/voice/bubble-begins-c-cold.mp3",
      "/audio/voice/bubble-begins-l-lights.mp3",
      "/audio/voice/bubble-begins-h-huddle.mp3",
      "/audio/voice/bubble-begins-d-den.mp3",
      "/audio/voice/bubble-begins-b-bread.mp3",
      "/audio/voice/bubble-begins-s-soup.mp3",
      "/audio/voice/bubble-begins-m-milk.mp3",
      "/audio/voice/bubble-begins-p-pear.mp3",
      "/audio/voice/bubble-begins-c-corn.mp3",
      "/audio/voice/bubble-begins-t-tea.mp3",
      "/audio/voice/bubble-begins-j-jam.mp3",
      "/audio/voice/bubble-begins-o-oven.mp3",
      "/audio/voice/bubble-begins-k-kettle.mp3",
      "/audio/voice/bubble-begins-f-flour.mp3",
      "/audio/voice/bubble-begins-n-noodle.mp3",
      "/audio/voice/bubble-begins-b-bus.mp3",
      "/audio/voice/bubble-begins-c-car.mp3",
      "/audio/voice/bubble-begins-p-plane.mp3",
      "/audio/voice/bubble-begins-t-train.mp3",
      "/audio/voice/bubble-begins-v-van.mp3",
      "/audio/voice/bubble-begins-s-ship.mp3",
      "/audio/voice/bubble-begins-r-road.mp3",
      "/audio/voice/bubble-begins-a-airport.mp3",
      "/audio/voice/bubble-begins-h-horn.mp3",
      "/audio/voice/bubble-begins-w-wheel.mp3",
      "/audio/voice/bubble-begins-g-go.mp3",
      "/audio/voice/bubble-begins-n-night.mp3",
      "/audio/voice/bubble-begins-s-star.mp3",
      "/audio/voice/bubble-begins-l-lamp.mp3",
      "/audio/voice/bubble-begins-b-bed.mp3",
      "/audio/voice/bubble-begins-w-wood.mp3",
      "/audio/voice/bubble-begins-t-quiet.mp3",
      "/audio/voice/bubble-begins-q-quilt.mp3",
      "/audio/voice/bubble-begins-h-hush.mp3",
      "/audio/voice/bubble-begins-d-dream.mp3",
      "/audio/voice/bubble-begins-y-yawn.mp3",
      "/audio/voice/bubble-begins-c-cow.mp3",
      "/audio/voice/bubble-begins-p-pig.mp3",
      "/audio/voice/bubble-begins-h-horse.mp3",
      "/audio/voice/bubble-begins-d-duck.mp3",
      "/audio/voice/bubble-begins-l-lion.mp3",
      "/audio/voice/bubble-begins-m-monkey.mp3",
      "/audio/voice/bubble-begins-s-sheep.mp3",
      "/audio/voice/bubble-begins-f-frog.mp3",
      "/audio/voice/bubble-begins-g-goat.mp3",
      "/audio/voice/bubble-begins-w-wool.mp3",
      "/audio/voice/bubble-begins-b-barn.mp3",
      "/audio/voice/bubble-begins-r-rooster.mp3",
      "/audio/voice/bubble-begins-b-bee.mp3",
      "/audio/voice/bubble-begins-a-ant.mp3",
      "/audio/voice/bubble-begins-l-ladybug.mp3",
      "/audio/voice/bubble-begins-w-worm.mp3",
      "/audio/voice/bubble-begins-s-snail.mp3",
      "/audio/voice/bubble-begins-c-caterpillar.mp3",
      "/audio/voice/bubble-begins-f-fly.mp3",
      "/audio/voice/bubble-begins-m-moth.mp3",
      "/audio/voice/bubble-begins-g-grass.mp3",
      "/audio/voice/bubble-begins-d-dew.mp3",
      "/audio/voice/bubble-begins-h-hive.mp3",
      "/audio/voice/bubble-begins-p-pollen.mp3",
      "/audio/voice/bubble-begins-p-park.mp3",
      "/audio/voice/bubble-begins-t-town.mp3",
      "/audio/voice/bubble-begins-m-market.mp3",
      "/audio/voice/bubble-begins-s-shop.mp3",
      "/audio/voice/bubble-begins-f-fire.mp3",
      "/audio/voice/bubble-begins-c-clock.mp3",
      "/audio/voice/bubble-begins-k-kiosk.mp3",
      "/audio/voice/bubble-begins-n-news.mp3",
      "/audio/voice/bubble-begins-p-paint.mp3",
      "/audio/voice/bubble-begins-b-bead.mp3",
      "/audio/voice/bubble-begins-s-song.mp3",
      "/audio/voice/bubble-begins-c-color.mp3",
      "/audio/voice/bubble-begins-h-heart.mp3",
      "/audio/voice/bubble-begins-d-drum.mp3",
      "/audio/voice/bubble-begins-n-note.mp3",
      "/audio/voice/bubble-begins-a-art.mp3",
      "/audio/voice/bubble-begins-g-glue.mp3",
      "/audio/voice/bubble-begins-r-red.mp3",
      "/audio/voice/bubble-begins-e-easel.mp3",
      "/audio/voice/bubble-begins-i-ink.mp3",
      "/audio/voice/bubble-begins-b-book.mp3",
      "/audio/voice/bubble-begins-t-tale.mp3",
      "/audio/voice/bubble-begins-s-story.mp3",
      "/audio/voice/bubble-begins-h-hen.mp3",
      "/audio/voice/bubble-begins-c-crown.mp3",
      "/audio/voice/bubble-begins-k-king.mp3",
      "/audio/voice/bubble-begins-p-page.mp3",
      "/audio/voice/bubble-begins-r-read.mp3",
      "/audio/voice/bubble-begins-g-dragon.mp3",
      "/audio/voice/bubble-begins-l-look.mp3",
      "/audio/voice/bubble-begins-d-castle.mp3",
      "/audio/voice/bubble-begins-h-home.mp3",
      "/audio/voice/bubble-begins-b-brush.mp3",
      "/audio/voice/bubble-begins-s-smile.mp3",
      "/audio/voice/bubble-begins-m-mum.mp3",
      "/audio/voice/bubble-begins-t-teeth.mp3",
      "/audio/voice/bubble-begins-f-family.mp3",
      "/audio/voice/bubble-begins-c-cup.mp3",
      "/audio/voice/bubble-begins-l-love.mp3",
      "/audio/voice/bubble-begins-d-door.mp3",
      "/audio/voice/bubble-begins-p-pillow.mp3",
      "/audio/voice/bubble-begins-k-kiss.mp3",
      "/audio/voice/bubble-begins-n-nap.mp3",
      "/audio/voice/bubble-begins-m-map.mp3",
      "/audio/voice/bubble-begins-t-trail.mp3",
      "/audio/voice/bubble-begins-r-rocket.mp3",
      "/audio/voice/bubble-begins-p-pine.mp3",
      "/audio/voice/bubble-begins-g-gem.mp3",
      "/audio/voice/bubble-begins-c-cave.mp3",
      "/audio/voice/bubble-begins-f-forest.mp3",
      "/audio/voice/bubble-begins-b-boot.mp3",
      "/audio/voice/bubble-begins-l-leaf.mp3",
      "/audio/voice/bubble-begins-h-hill.mp3",
      "/audio/voice/bubble-begins-k-key.mp3",
      "/audio/voice/bubble-begins-a-a.mp3",
      "/audio/voice/bubble-begins-c-count.mp3",
      "/audio/voice/bubble-begins-d-dot.mp3",
      "/audio/voice/bubble-begins-s-shape.mp3",
      "/audio/voice/bubble-begins-t-trace.mp3",
      "/audio/voice/bubble-begins-p-pen.mp3",
      "/audio/voice/bubble-begins-n-nine.mp3",
      "/audio/voice/bubble-begins-6-six.mp3",
      "/audio/voice/bubble-begins-8-eight.mp3",
      "/audio/voice/bubble-begins-10-ten.mp3",
      "/audio/voice/k1-taxi-14.mp3",
      "/audio/voice/k1-taxi-10.mp3",
      "/audio/voice/k1-taxi-7.mp3",
      "/audio/voice/k1-taxi-15.mp3",
      "/audio/voice/k1-taxi-20.mp3",
      "/audio/voice/k1-taxi-11.mp3",
      "/audio/voice/k1-taxi-16.mp3",
      "/audio/voice/k1-taxi-18.mp3",
      "/audio/voice/k1-taxi-9.mp3",
      "/audio/voice/k1-taxi-13.mp3",
      "/audio/voice/k1-taxi-12.mp3",
      "/audio/voice/k1-taxi-17.mp3",
      "/audio/voice/k1-taxi-19.mp3",
      "/audio/voice/k1-taxi-8.mp3",
      "/audio/voice/k1-taxi-6.mp3",
      "/audio/voice/k1-taxi-22.mp3",
      "/audio/voice/k1-st-strawberry.mp3",
      "/audio/voice/k1-br-bread.mp3",
      "/audio/voice/k1-gr-grapes.mp3",
      "/audio/voice/k1-cl-cloves.mp3",
      "/audio/voice/k1-tr-tray.mp3",
      "/audio/voice/k1-fl-flour.mp3",
      "/audio/voice/k1-cr-cream.mp3",
      "/audio/voice/k1-sm-smoothie.mp3",
      "/audio/voice/k1-pl-plum.mp3",
      "/audio/voice/k1-dr-drink.mp3",
      "/audio/voice/k1-sl-slice.mp3",
      "/audio/voice/k1-pr-pretzel.mp3",
      "/audio/voice/k1-sw-sweet.mp3",
      "/audio/voice/k1-gl-glaze.mp3",
      "/audio/voice/k1-sn-snap.mp3",
      "/audio/voice/k1-sk-skewer.mp3",
      "/audio/voice/k1-abab-red-blue.mp3",
      "/audio/voice/k1-aab-sun.mp3",
      "/audio/voice/k1-abc-fruit.mp3",
      "/audio/voice/k1-grow-size.mp3",
      "/audio/voice/k1-clap-stomp.mp3",
      "/audio/voice/k1-abab-green-yellow.mp3",
      "/audio/voice/k1-abb-car.mp3",
      "/audio/voice/k1-abc-weather.mp3",
      "/audio/voice/k1-grow-bug.mp3",
      "/audio/voice/k1-two-one.mp3",
      "/audio/voice/k1-abab-orange.mp3",
      "/audio/voice/k1-aab-drum.mp3",
      "/audio/voice/k1-abc-ride.mp3",
      "/audio/voice/k1-grow-wave.mp3",
      "/audio/voice/k1-abab-day.mp3",
      "/audio/voice/k1-abb-sheep.mp3",
      "/audio/voice/k1-3-plus-2.mp3",
      "/audio/voice/k1-4-plus-4.mp3",
      "/audio/voice/k1-6-minus-2.mp3",
      "/audio/voice/k1-5-minus-5.mp3",
      "/audio/voice/k1-1-plus-6.mp3",
      "/audio/voice/k1-2-plus-3.mp3",
      "/audio/voice/k1-9-minus-1.mp3",
      "/audio/voice/k1-3-plus-3.mp3",
      "/audio/voice/k1-8-minus-3.mp3",
      "/audio/voice/k1-5-plus-5.mp3",
      "/audio/voice/k1-4-plus-2.mp3",
      "/audio/voice/k1-7-minus-2.mp3",
      "/audio/voice/k1-3-plus-6.mp3",
      "/audio/voice/k1-2-plus-6.mp3",
      "/audio/voice/k1-6-plus-4.mp3",
      "/audio/voice/k1-9-minus-2.mp3",
      "/audio/voice/k1-laundry-sock.mp3",
      "/audio/voice/k1-laundry-teddy.mp3",
      "/audio/voice/k1-laundry-shirt.mp3",
      "/audio/voice/k1-laundry-pair-socks.mp3",
      "/audio/voice/k1-laundry-block.mp3",
      "/audio/voice/k1-laundry-hat.mp3",
      "/audio/voice/k1-laundry-pants.mp3",
      "/audio/voice/k1-laundry-crayon.mp3",
      "/audio/voice/k1-laundry-towel.mp3",
      "/audio/voice/k1-laundry-gloves.mp3",
      "/audio/voice/k1-laundry-scarf.mp3",
      "/audio/voice/k1-laundry-shorts.mp3",
      "/audio/voice/k1-laundry-puzzle.mp3",
      "/audio/voice/k1-laundry-pillow.mp3",
      "/audio/voice/k1-laundry-boot.mp3",
      "/audio/voice/k1-laundry-band.mp3",
      "/audio/voice/k1-story-who-hid.mp3",
      "/audio/voice/k1-story-where-apple.mp3",
      "/audio/voice/k1-story-color-apple.mp3",
      "/audio/voice/k1-story-rain-bucket.mp3",
      "/audio/voice/k1-story-who-hummed.mp3",
      "/audio/voice/k1-story-who-baked.mp3",
      "/audio/voice/k1-story-what-baked.mp3",
      "/audio/voice/k1-story-where-waited.mp3",
      "/audio/voice/k1-story-frog-who.mp3",
      "/audio/voice/k1-story-frog-where.mp3",
      "/audio/voice/k1-story-who-fox.mp3",
      "/audio/voice/k1-story-what-stole.mp3",
      "/audio/voice/k1-story-where-ran.mp3",
      "/audio/voice/k1-story-who-woke.mp3",
      "/audio/voice/k1-story-when-woke.mp3",
      "/audio/voice/k1-story-what-heard.mp3",
      "/audio/voice/k1-sock-match-red.mp3",
      "/audio/voice/k1-sock-odd-spot.mp3",
      "/audio/voice/k1-sock-tiny-big.mp3",
      "/audio/voice/k1-sock-two-left.mp3",
      "/audio/voice/k1-sock-color-sort.mp3",
      "/audio/voice/k1-sock-lost-mate.mp3",
      "/audio/voice/k1-sock-long-short.mp3",
      "/audio/voice/k1-sock-three-pairs.mp3",
      "/audio/voice/k1-sock-match-dots.mp3",
      "/audio/voice/k1-sock-odd-colour.mp3",
      "/audio/voice/k1-sock-pair-count.mp3",
      "/audio/voice/k1-sock-fold.mp3",
      "/audio/voice/k1-sock-wet-dry.mp3",
      "/audio/voice/k1-sock-stripe-spot.mp3",
      "/audio/voice/k1-sock-one-missing.mp3",
      "/audio/voice/k1-sock-both-right.mp3",
      "/audio/voice/k1-shape-wheel-bun.mp3",
      "/audio/voice/k1-shape-sandwich.mp3",
      "/audio/voice/k1-shape-tin.mp3",
      "/audio/voice/k1-shape-window.mp3",
      "/audio/voice/k1-shape-cookie-star.mp3",
      "/audio/voice/k1-shape-donut-hole.mp3",
      "/audio/voice/k1-shape-pizza-slice.mp3",
      "/audio/voice/k1-shape-cracker.mp3",
      "/audio/voice/k1-shape-roll-not.mp3",
      "/audio/voice/k1-shape-tray.mp3",
      "/audio/voice/k1-shape-cookie-heart.mp3",
      "/audio/voice/k1-shape-hex-honey.mp3",
      "/audio/voice/k1-bus-six-stop.mp3",
      "/audio/voice/k1-bus-eight-queue.mp3",
      "/audio/voice/k1-bus-one-more.mp3",
      "/audio/voice/k1-bus-one-off.mp3",
      "/audio/voice/k1-bus-two-full.mp3",
      "/audio/voice/k1-bus-empty.mp3",
      "/audio/voice/k1-bus-fourteen.mp3",
      "/audio/voice/k1-bus-seven-plus-seven.mp3",
      "/audio/voice/k1-bus-three-off.mp3",
      "/audio/voice/k1-bus-sixteen.mp3",
      "/audio/voice/k1-bus-two-plus-nine.mp3",
      "/audio/voice/k1-bus-twenty.mp3",
      "/audio/voice/k1-shadow-cat.mp3",
      "/audio/voice/k1-shadow-owl.mp3",
      "/audio/voice/k1-shadow-moth.mp3",
      "/audio/voice/k1-shadow-not-sun.mp3",
      "/audio/voice/k1-shadow-long.mp3",
      "/audio/voice/k1-shadow-still.mp3",
      "/audio/voice/k1-shadow-two.mp3",
      "/audio/voice/k1-shadow-bat.mp3",
      "/audio/voice/k1-shadow-none.mp3",
      "/audio/voice/k1-shadow-match.mp3",
      "/audio/voice/k1-shadow-hand.mp3",
      "/audio/voice/k1-shadow-behind.mp3",
      "/audio/voice/k1-ice-coat.mp3",
      "/audio/voice/k1-ice-boots.mp3",
      "/audio/voice/k1-ice-den.mp3",
      "/audio/voice/k1-ice-not-swim-cap.mp3",
      "/audio/voice/k1-ice-night-light.mp3",
      "/audio/voice/k1-ice-season.mp3",
      "/audio/voice/k1-ice-seal.mp3",
      "/audio/voice/k1-ice-melt.mp3",
      "/audio/voice/k1-ice-goggles.mp3",
      "/audio/voice/k1-ice-penguin.mp3",
      "/audio/voice/k1-ice-thin-ice.mp3",
      "/audio/voice/k1-ice-home.mp3",
      "/audio/voice/k1-bug-wings.mp3",
      "/audio/voice/k1-bug-crawl.mp3",
      "/audio/voice/k1-bug-pond.mp3",
      "/audio/voice/k1-bug-ant.mp3",
      "/audio/voice/k1-bug-moth-night.mp3",
      "/audio/voice/k1-bug-not-leaf.mp3",
      "/audio/voice/k1-bug-wings-count.mp3",
      "/audio/voice/k1-bug-snail.mp3",
      "/audio/voice/k1-bug-lady.mp3",
      "/audio/voice/k1-bug-spider.mp3",
      "/audio/voice/k1-bug-both.mp3",
      "/audio/voice/k1-bug-sort.mp3",
      "/audio/voice/count-ml-1.mp3",
      "/audio/voice/count-ml-2.mp3",
      "/audio/voice/count-ml-3.mp3",
      "/audio/voice/count-ml-4.mp3",
      "/audio/voice/count-ml-5.mp3",
      "/audio/voice/count-ml-6.mp3",
      "/audio/voice/count-ml-7.mp3",
      "/audio/voice/count-ml-8.mp3",
      "/audio/voice/count-ten-seven.mp3",
      "/audio/voice/count-ten-three.mp3",
      "/audio/voice/count-ten-nine.mp3",
      "/audio/voice/count-ten-five.mp3",
      "/audio/voice/count-ten-one.mp3",
      "/audio/voice/count-ten-eight.mp3",
      "/audio/voice/count-ten-four.mp3",
      "/audio/voice/count-ten-six.mp3",
      "/audio/voice/count-pat-sun-moon.mp3",
      "/audio/voice/count-pat-boot.mp3",
      "/audio/voice/count-pat-bus.mp3",
      "/audio/voice/count-pat-plate.mp3",
      "/audio/voice/count-pat-seed.mp3",
      "/audio/voice/count-pat-drop.mp3",
      "/audio/voice/count-pat-peg.mp3",
      "/audio/voice/count-pat-loaf.mp3",
      "/audio/voice/count-next-one.mp3",
      "/audio/voice/count-next-three.mp3",
      "/audio/voice/count-next-four.mp3",
      "/audio/voice/count-next-six.mp3",
      "/audio/voice/count-next-ten.mp3",
      "/audio/voice/count-next-fourteen.mp3",
      "/audio/voice/count-next-nineteen.mp3",
      "/audio/voice/count-sh-sun.mp3",
      "/audio/voice/count-sh-mat.mp3",
      "/audio/voice/count-sh-sail.mp3",
      "/audio/voice/count-sh-door.mp3",
      "/audio/voice/count-sh-coin.mp3",
      "/audio/voice/count-sh-window.mp3",
      "/audio/voice/count-sh-knob.mp3",
      "/audio/voice/count-sh-roof.mp3",
      "/audio/voice/phonics-hunt-bus.mp3",
      "/audio/voice/phonics-hunt-cat.mp3",
      "/audio/voice/phonics-hunt-dock.mp3",
      "/audio/voice/phonics-hunt-ferry.mp3",
      "/audio/voice/phonics-hunt-hat.mp3",
      "/audio/voice/phonics-hunt-jam.mp3",
      "/audio/voice/phonics-hunt-key.mp3",
      "/audio/voice/phonics-hunt-loaf.mp3",
      "/audio/voice/phonics-hunt-mat.mp3",
      "/audio/voice/phonics-hunt-nest.mp3",
      "/audio/voice/phonics-hunt-porch.mp3",
      "/audio/voice/phonics-hunt-quilt.mp3",
      "/audio/voice/phonics-hunt-rain.mp3",
      "/audio/voice/phonics-hunt-stoop.mp3",
      "/audio/voice/phonics-hunt-taxi.mp3",
      "/audio/voice/phonics-hunt-wash.mp3",
      "/audio/voice/phonics-hunt-yes-bus.mp3",
      "/audio/voice/phonics-hunt-yes-cat.mp3",
      "/audio/voice/phonics-hunt-yes-dock.mp3",
      "/audio/voice/phonics-hunt-yes-ferry.mp3",
      "/audio/voice/phonics-hunt-yes-hat.mp3",
      "/audio/voice/phonics-hunt-yes-jam.mp3",
      "/audio/voice/phonics-hunt-yes-key.mp3",
      "/audio/voice/phonics-hunt-yes-loaf.mp3",
      "/audio/voice/phonics-hunt-yes-mat.mp3",
      "/audio/voice/phonics-hunt-yes-nest.mp3",
      "/audio/voice/phonics-hunt-yes-porch.mp3",
      "/audio/voice/phonics-hunt-yes-quilt.mp3",
      "/audio/voice/phonics-hunt-yes-rain.mp3",
      "/audio/voice/phonics-hunt-yes-stoop.mp3",
      "/audio/voice/phonics-hunt-yes-taxi.mp3",
      "/audio/voice/phonics-hunt-yes-wash.mp3",
      "/audio/voice/phonics-sight-the.mp3",
      "/audio/voice/phonics-sight-a.mp3",
      "/audio/voice/phonics-sight-i.mp3",
      "/audio/voice/phonics-sight-to.mp3",
      "/audio/voice/phonics-sight-you.mp3",
      "/audio/voice/phonics-sight-is.mp3",
      "/audio/voice/phonics-sight-it.mp3",
      "/audio/voice/phonics-sight-we.mp3",
      "/audio/voice/phonics-sight-my.mp3",
      "/audio/voice/phonics-sight-on.mp3",
      "/audio/voice/phonics-sight-and.mp3",
      "/audio/voice/phonics-sight-look.mp3",
      "/audio/voice/phonics-sight-see.mp3",
      "/audio/voice/phonics-sight-like.mp3",
      "/audio/voice/phonics-sight-here.mp3",
      "/audio/voice/phonics-sight-come.mp3",
      "/audio/voice/phonics-sight-the-a.mp3",
      "/audio/voice/phonics-sight-a-i.mp3",
      "/audio/voice/phonics-sight-i-to.mp3",
      "/audio/voice/phonics-sight-to-you.mp3",
      "/audio/voice/phonics-sight-you-is.mp3",
      "/audio/voice/phonics-sight-is-it.mp3",
      "/audio/voice/phonics-sight-it-we.mp3",
      "/audio/voice/phonics-sight-we-my.mp3",
      "/audio/voice/phonics-sight-my-on.mp3",
      "/audio/voice/phonics-sight-on-and.mp3",
      "/audio/voice/phonics-sight-and-look.mp3",
      "/audio/voice/phonics-sight-look-see.mp3",
      "/audio/voice/phonics-sight-see-like.mp3",
      "/audio/voice/phonics-sight-like-here.mp3",
      "/audio/voice/phonics-sight-here-come.mp3",
      "/audio/voice/phonics-sight-come-the.mp3",
      "/audio/voice/phonics-blend-cat.mp3",
      "/audio/voice/phonics-blend-hat.mp3",
      "/audio/voice/phonics-blend-mat.mp3",
      "/audio/voice/phonics-blend-bus.mp3",
      "/audio/voice/phonics-blend-sun.mp3",
      "/audio/voice/phonics-blend-bun.mp3",
      "/audio/voice/phonics-blend-pan.mp3",
      "/audio/voice/phonics-blend-pot.mp3",
      "/audio/voice/phonics-blend-dog.mp3",
      "/audio/voice/phonics-blend-pig.mp3",
      "/audio/voice/phonics-blend-hop.mp3",
      "/audio/voice/phonics-blend-red.mp3",
      "/audio/voice/phonics-blend-fox.mp3",
      "/audio/voice/phonics-blend-log.mp3",
      "/audio/voice/phonics-blend-ten.mp3",
      "/audio/voice/phonics-blend-map.mp3",
      "/audio/voice/phonics-next-def.mp3",
      "/audio/voice/phonics-next-hij.mp3",
      "/audio/voice/phonics-next-pqr.mp3",
      "/audio/voice/phonics-next-stu.mp3",
      "/audio/voice/phonics-next-vwx.mp3",
      "/audio/voice/phonics-next-wxy.mp3",
      "/audio/voice/phonics-next-yes-d.mp3",
      "/audio/voice/phonics-next-yes-g.mp3",
      "/audio/voice/phonics-next-yes-k.mp3",
      "/audio/voice/phonics-next-yes-o.mp3",
      "/audio/voice/phonics-next-yes-s.mp3",
      "/audio/voice/phonics-next-yes-v.mp3",
      "/audio/voice/phonics-next-yes-y.mp3",
      "/audio/voice/phonics-next-yes-z.mp3",
      "/audio/voice/phonics-in-a-attic.mp3",
      "/audio/voice/phonics-in-a-apple.mp3",
      "/audio/voice/phonics-in-a-ant.mp3",
      "/audio/voice/phonics-in-b-bus.mp3",
      "/audio/voice/phonics-in-b-bun.mp3",
      "/audio/voice/phonics-in-b-bell.mp3",
      "/audio/voice/phonics-in-c-cat.mp3",
      "/audio/voice/phonics-in-c-cup.mp3",
      "/audio/voice/phonics-in-c-coin.mp3",
      "/audio/voice/phonics-in-d-dock.mp3",
      "/audio/voice/phonics-in-d-door.mp3",
      "/audio/voice/phonics-in-d-dot.mp3",
      "/audio/voice/phonics-in-e-egg.mp3",
      "/audio/voice/phonics-in-e-exit.mp3",
      "/audio/voice/phonics-in-e-end.mp3",
      "/audio/voice/phonics-in-f-ferry.mp3",
      "/audio/voice/phonics-in-f-fog.mp3",
      "/audio/voice/phonics-in-f-fish.mp3",
      "/audio/voice/phonics-in-g-gull.mp3",
      "/audio/voice/phonics-in-g-gate.mp3",
      "/audio/voice/phonics-in-g-gum.mp3",
      "/audio/voice/phonics-in-h-hat.mp3",
      "/audio/voice/phonics-in-h-home.mp3",
      "/audio/voice/phonics-in-h-hop.mp3",
      "/audio/voice/phonics-in-i-ink.mp3",
      "/audio/voice/phonics-in-i-in.mp3",
      "/audio/voice/phonics-in-i-igloo.mp3",
      "/audio/voice/phonics-in-j-jam.mp3",
      "/audio/voice/phonics-in-j-jar.mp3",
      "/audio/voice/phonics-in-j-jump.mp3",
      "/audio/voice/phonics-in-k-key.mp3",
      "/audio/voice/phonics-in-k-kite.mp3",
      "/audio/voice/phonics-in-k-king.mp3",
      "/audio/voice/phonics-in-l-loaf.mp3",
      "/audio/voice/phonics-in-l-lamp.mp3",
      "/audio/voice/phonics-in-l-line.mp3",
      "/audio/voice/phonics-in-m-mat.mp3",
      "/audio/voice/phonics-in-m-moon.mp3",
      "/audio/voice/phonics-in-m-milk.mp3",
      "/audio/voice/phonics-in-n-nest.mp3",
      "/audio/voice/phonics-in-n-nap.mp3",
      "/audio/voice/phonics-in-n-nana.mp3",
      "/audio/voice/phonics-in-o-orange.mp3",
      "/audio/voice/phonics-in-o-on.mp3",
      "/audio/voice/phonics-in-o-otter.mp3",
      "/audio/voice/phonics-in-p-porch.mp3",
      "/audio/voice/phonics-in-p-pan.mp3",
      "/audio/voice/phonics-in-p-peg.mp3",
      "/audio/voice/phonics-in-q-quilt.mp3",
      "/audio/voice/phonics-in-q-quiet.mp3",
      "/audio/voice/phonics-in-q-queen.mp3",
      "/audio/voice/phonics-in-r-rain.mp3",
      "/audio/voice/phonics-in-r-rope.mp3",
      "/audio/voice/phonics-in-r-red.mp3",
      "/audio/voice/phonics-in-s-stoop.mp3",
      "/audio/voice/phonics-in-s-sun.mp3",
      "/audio/voice/phonics-in-s-sock.mp3",
      "/audio/voice/phonics-in-t-taxi.mp3",
      "/audio/voice/phonics-in-t-toast.mp3",
      "/audio/voice/phonics-in-t-token.mp3",
      "/audio/voice/phonics-in-u-umbrella.mp3",
      "/audio/voice/phonics-in-u-up.mp3",
      "/audio/voice/phonics-in-u-under.mp3",
      "/audio/voice/phonics-in-v-van.mp3",
      "/audio/voice/phonics-in-v-vine.mp3",
      "/audio/voice/phonics-in-v-vest.mp3",
      "/audio/voice/phonics-in-w-wash.mp3",
      "/audio/voice/phonics-in-w-window.mp3",
      "/audio/voice/phonics-in-w-wagon.mp3",
      "/audio/voice/phonics-in-x-box.mp3",
      "/audio/voice/phonics-in-x-fox.mp3",
      "/audio/voice/phonics-in-x-six.mp3",
      "/audio/voice/phonics-in-y-yellow.mp3",
      "/audio/voice/phonics-in-y-yarn.mp3",
      "/audio/voice/phonics-in-y-yard.mp3",
      "/audio/voice/phonics-in-z-zip.mp3",
      "/audio/voice/phonics-in-z-zigzag.mp3",
      "/audio/voice/phonics-in-z-zoo.mp3",
      "/audio/voice/phonics-says-a.mp3",
      "/audio/voice/phonics-says-b.mp3",
      "/audio/voice/phonics-says-c.mp3",
      "/audio/voice/phonics-says-d.mp3",
      "/audio/voice/phonics-says-e.mp3",
      "/audio/voice/phonics-says-f.mp3",
      "/audio/voice/phonics-says-g.mp3",
      "/audio/voice/phonics-says-h.mp3",
      "/audio/voice/phonics-says-i.mp3",
      "/audio/voice/phonics-says-j.mp3",
      "/audio/voice/phonics-says-k.mp3",
      "/audio/voice/phonics-says-l.mp3",
      "/audio/voice/phonics-says-m.mp3",
      "/audio/voice/phonics-says-n.mp3",
      "/audio/voice/phonics-says-o.mp3",
      "/audio/voice/phonics-says-p.mp3",
      "/audio/voice/phonics-says-q.mp3",
      "/audio/voice/phonics-says-r.mp3",
      "/audio/voice/phonics-says-s.mp3",
      "/audio/voice/phonics-says-t.mp3",
      "/audio/voice/phonics-says-u.mp3",
      "/audio/voice/phonics-says-v.mp3",
      "/audio/voice/phonics-says-w.mp3",
      "/audio/voice/phonics-says-x.mp3",
      "/audio/voice/phonics-says-y.mp3",
      "/audio/voice/phonics-says-z.mp3",
      "/audio/voice/phonics-family-at.mp3",
      "/audio/voice/phonics-family-an.mp3",
      "/audio/voice/phonics-family-ap.mp3",
      "/audio/voice/phonics-family-ag.mp3",
      "/audio/voice/phonics-family-en.mp3",
      "/audio/voice/phonics-family-et.mp3",
      "/audio/voice/phonics-family-ed.mp3",
      "/audio/voice/phonics-family-in.mp3",
      "/audio/voice/phonics-family-ig.mp3",
      "/audio/voice/phonics-family-ip.mp3",
      "/audio/voice/phonics-family-op.mp3",
      "/audio/voice/phonics-family-ot.mp3",
      "/audio/voice/phonics-family-og.mp3",
      "/audio/voice/phonics-family-ug.mp3",
      "/audio/voice/phonics-family-un.mp3",
      "/audio/voice/phonics-family-ut.mp3",
      "/audio/voice/phonics-family-cat.mp3",
      "/audio/voice/phonics-family-hat.mp3",
      "/audio/voice/phonics-family-mat.mp3",
      "/audio/voice/phonics-family-can.mp3",
      "/audio/voice/phonics-family-man.mp3",
      "/audio/voice/phonics-family-pan.mp3",
      "/audio/voice/phonics-family-cap.mp3",
      "/audio/voice/phonics-family-map.mp3",
      "/audio/voice/phonics-family-tap.mp3",
      "/audio/voice/phonics-family-bag.mp3",
      "/audio/voice/phonics-family-tag.mp3",
      "/audio/voice/phonics-family-wag.mp3",
      "/audio/voice/phonics-family-pen.mp3",
      "/audio/voice/phonics-family-hen.mp3",
      "/audio/voice/phonics-family-ten.mp3",
      "/audio/voice/phonics-family-net.mp3",
      "/audio/voice/phonics-family-pet.mp3",
      "/audio/voice/phonics-family-wet.mp3",
      "/audio/voice/phonics-family-bed.mp3",
      "/audio/voice/phonics-family-red.mp3",
      "/audio/voice/phonics-family-fed.mp3",
      "/audio/voice/phonics-family-pin.mp3",
      "/audio/voice/phonics-family-win.mp3",
      "/audio/voice/phonics-family-tin.mp3",
      "/audio/voice/phonics-family-pig.mp3",
      "/audio/voice/phonics-family-dig.mp3",
      "/audio/voice/phonics-family-wig.mp3",
      "/audio/voice/phonics-family-sip.mp3",
      "/audio/voice/phonics-family-lip.mp3",
      "/audio/voice/phonics-family-dip.mp3",
      "/audio/voice/phonics-family-hop.mp3",
      "/audio/voice/phonics-family-mop.mp3",
      "/audio/voice/phonics-family-top.mp3",
      "/audio/voice/phonics-family-pot.mp3",
      "/audio/voice/phonics-family-dot.mp3",
      "/audio/voice/phonics-family-hot.mp3",
      "/audio/voice/phonics-family-dog.mp3",
      "/audio/voice/phonics-family-log.mp3",
      "/audio/voice/phonics-family-fog.mp3",
      "/audio/voice/phonics-family-bug.mp3",
      "/audio/voice/phonics-family-hug.mp3",
      "/audio/voice/phonics-family-mug.mp3",
      "/audio/voice/phonics-family-sun.mp3",
      "/audio/voice/phonics-family-run.mp3",
      "/audio/voice/phonics-family-bun.mp3",
      "/audio/voice/phonics-family-nut.mp3",
      "/audio/voice/phonics-family-cut.mp3",
      "/audio/voice/phonics-family-hut.mp3",
      "/audio/voice/color-drop-ruby-red.mp3",
      "/audio/voice/color-drop-sunny-yellow.mp3",
      "/audio/voice/color-drop-ocean-blue.mp3",
      "/audio/voice/color-drop-cloud-white.mp3",
      "/audio/voice/color-magic-welcome.mp3",
      "/audio/voice/count-tap-1.mp3",
      "/audio/voice/count-tap-2.mp3",
      "/audio/voice/count-tap-3.mp3",
      "/audio/voice/count-tap-4.mp3",
      "/audio/voice/count-tap-5.mp3",
      "/audio/voice/count-tap-6.mp3",
      "/audio/voice/count-tap-7.mp3",
      "/audio/voice/count-tap-8.mp3",
      "/audio/voice/count-tap-9.mp3",
      "/audio/voice/count-tap-10.mp3",
      "/audio/voice/count-tap-11.mp3",
      "/audio/voice/count-tap-12.mp3",
      "/audio/voice/count-tap-13.mp3",
      "/audio/voice/count-tap-14.mp3",
      "/audio/voice/count-tap-15.mp3",
      "/audio/voice/count-tap-16.mp3",
      "/audio/voice/count-tap-17.mp3",
      "/audio/voice/count-tap-18.mp3",
      "/audio/voice/count-tap-19.mp3",
      "/audio/voice/count-tap-20.mp3",
      "/audio/voice/count-peek-1.mp3",
      "/audio/voice/count-peek-2.mp3",
      "/audio/voice/count-peek-3.mp3",
      "/audio/voice/count-peek-4.mp3",
      "/audio/voice/count-peek-5.mp3",
      "/audio/voice/count-peek-6.mp3",
      "/audio/voice/count-peek-7.mp3",
      "/audio/voice/count-peek-8.mp3",
      "/audio/voice/count-peek-9.mp3",
      "/audio/voice/count-peek-10.mp3",
      "/audio/voice/count-peek-11.mp3",
      "/audio/voice/count-peek-12.mp3",
      "/audio/voice/count-peek-13.mp3",
      "/audio/voice/count-peek-14.mp3",
      "/audio/voice/count-peek-15.mp3",
      "/audio/voice/count-peek-16.mp3",
      "/audio/voice/count-peek-17.mp3",
      "/audio/voice/count-peek-18.mp3",
      "/audio/voice/count-peek-19.mp3",
      "/audio/voice/count-peek-20.mp3",
      "/audio/voice/primary-welcome-math.mp3",
      "/audio/voice/primary-welcome-fraction.mp3",
      "/audio/voice/primary-welcome-word.mp3",
      "/audio/voice/primary-welcome-balance.mp3",
      "/audio/voice/primary-welcome-solar.mp3",
      "/audio/voice/primary-welcome-tangram.mp3",
      "/audio/voice/primary-welcome-rover.mp3",
      "/audio/voice/primary-welcome-times.mp3",
      "/audio/voice/primary-welcome-solar-lab.mp3",
      "/audio/voice/primary-word-reset.mp3",
      "/audio/voice/primary-rover-memory.mp3",
      "/audio/voice/primary-rover-done.mp3",
      "/audio/voice/primary-solar-congrats.mp3",
      "/audio/voice/primary-planet-mercury.mp3",
      "/audio/voice/primary-planet-venus.mp3",
      "/audio/voice/primary-planet-earth.mp3",
      "/audio/voice/primary-planet-mars.mp3",
      "/audio/voice/primary-planet-jupiter.mp3",
      "/audio/voice/primary-planet-saturn.mp3",
      "/audio/voice/primary-planet-uranus.mp3",
      "/audio/voice/primary-planet-neptune.mp3",
      "/audio/voice/primary-quiz-yes-saturn.mp3",
      "/audio/voice/primary-quiz-yes-jupiter.mp3",
      "/audio/voice/primary-quiz-yes-mars.mp3",
      "/audio/voice/primary-quiz-yes-venus.mp3",
      "/audio/voice/primary-quiz-yes-mercury.mp3",
      "/audio/voice/primary-quiz-yes-uranus.mp3",
      "/audio/voice/primary-quiz-yes-neptune.mp3",
      "/audio/voice/primary-quiz-yes-earth.mp3",
      "/audio/voice/primary-quiz-oops-saturn.mp3",
      "/audio/voice/primary-quiz-oops-jupiter.mp3",
      "/audio/voice/primary-quiz-oops-mars.mp3",
      "/audio/voice/primary-quiz-oops-venus.mp3",
      "/audio/voice/primary-quiz-oops-mercury.mp3",
      "/audio/voice/primary-quiz-oops-uranus.mp3",
      "/audio/voice/primary-quiz-oops-neptune.mp3",
      "/audio/voice/primary-quiz-oops-earth.mp3",
      "/audio/voice/primary-frac-yes-half.mp3",
      "/audio/voice/primary-frac-yes-three-fourths.mp3",
      "/audio/voice/primary-frac-new-two-thirds.mp3",
      "/audio/voice/primary-frac-mode-five-eighths.mp3",
      "/audio/voice/primary-word-yes-planet.mp3",
      "/audio/voice/primary-shape-triangle.mp3",
      "/audio/voice/primary-shape-square.mp3",
      "/audio/voice/primary-arch-rocket.mp3",
      "/audio/voice/primary-frac-yes-two-thirds.mp3",
      "/audio/voice/primary-frac-yes-five-eighths.mp3",
      "/audio/voice/primary-frac-yes-four-sixths.mp3",
      "/audio/voice/primary-frac-yes-seven-tenths.mp3",
      "/audio/voice/primary-frac-yes-three-sixths.mp3",
      "/audio/voice/primary-frac-yes-five-sixths.mp3",
      "/audio/voice/primary-shape-rhombus.mp3",
      "/audio/voice/primary-shape-hexagon.mp3",
      "/audio/voice/primary-shape-trapezoid.mp3",
      "/audio/voice/primary-arch-sailboat.mp3",
      "/audio/voice/primary-frac-new-half.mp3",
      "/audio/voice/primary-frac-mode-half.mp3",
      "/audio/voice/primary-frac-new-three-fourths.mp3",
      "/audio/voice/primary-frac-mode-three-fourths.mp3",
      "/audio/voice/primary-frac-mode-two-thirds.mp3",
      "/audio/voice/primary-frac-new-five-eighths.mp3",
      "/audio/voice/primary-frac-new-four-sixths.mp3",
      "/audio/voice/primary-frac-mode-four-sixths.mp3",
      "/audio/voice/primary-frac-new-seven-tenths.mp3",
      "/audio/voice/primary-frac-mode-seven-tenths.mp3",
      "/audio/voice/primary-frac-new-three-sixths.mp3",
      "/audio/voice/primary-frac-mode-three-sixths.mp3",
      "/audio/voice/primary-frac-new-five-sixths.mp3",
      "/audio/voice/primary-frac-mode-five-sixths.mp3",
      "/audio/voice/primary-word-yes-energy.mp3",
      "/audio/voice/primary-word-yes-galaxy.mp3",
      "/audio/voice/primary-word-yes-oxygen.mp3",
      "/audio/voice/primary-word-yes-gravity.mp3",
      "/audio/voice/primary-word-yes-magnet.mp3",
      "/audio/voice/primary-word-yes-fossil.mp3",
      "/audio/voice/primary-word-yes-comet.mp3",
      "/audio/voice/primary-word-yes-prism.mp3",
      "/audio/voice/primary-word-yes-nucleus.mp3",
      "/audio/voice/primary-word-yes-volcano.mp3",
      "/audio/voice/primary-word-yes-circuit.mp3",
      "/audio/voice/primary-word-yes-climate.mp3",
      "/audio/voice/primary-word-yes-habitat.mp3",
      "/audio/voice/primary-word-yes-crater.mp3",
      "/audio/voice/primary-word-yes-nebula.mp3",
      "/audio/voice/primary-word-yes-robot.mp3",
      "/audio/voice/primary-word-yes-species.mp3",
      "/audio/voice/primary-word-yes-glacier.mp3",
      "/audio/voice/primary-word-yes-velocity.mp3",
      "/audio/voice/primary-word-yes-aurora.mp3",
      "/audio/voice/primary-word-yes-crystal.mp3",
      "/audio/voice/primary-word-yes-telescope.mp3",
      "/audio/voice/primary-word-yes-ecosystem.mp3",
      "/audio/voice/primary-slot-triangle.mp3",
      "/audio/voice/primary-slot-square.mp3",
      "/audio/voice/primary-slot-rhombus.mp3",
      "/audio/voice/primary-slot-hexagon.mp3",
      "/audio/voice/primary-slot-trapezoid.mp3",
      "/audio/voice/primary-arch-fox.mp3",
      "/audio/voice/primary-arch-crown.mp3",
      "/audio/voice/primary-hw-task-done.mp3",
      "/audio/voice/primary-hw-signature.mp3",
      "/audio/voice/primary-hw-turned-in.mp3",
      "/audio/voice/nav-balloon-a.mp3",
      "/audio/voice/nav-balloon-b.mp3",
      "/audio/voice/nav-balloon-c.mp3",
      "/audio/voice/nav-balloon-d.mp3",
      "/audio/voice/nav-balloon-e.mp3",
      "/audio/voice/nav-balloon-s.mp3",
      "/audio/voice/nav-balloon-t.mp3",
      "/audio/voice/nav-balloon-m.mp3",
      "/audio/voice/nav-balloon-1.mp3",
      "/audio/voice/nav-balloon-2.mp3",
      "/audio/voice/nav-balloon-3.mp3",
      "/audio/voice/nav-balloon-4.mp3",
      "/audio/voice/nav-balloon-5.mp3",
      "/audio/voice/count-cheer-1.mp3",
      "/audio/voice/count-cheer-2.mp3",
      "/audio/voice/count-cheer-3.mp3",
      "/audio/voice/count-cheer-4.mp3",
      "/audio/voice/count-cheer-5.mp3",
      "/audio/voice/count-cheer-6.mp3",
      "/audio/voice/count-cheer-7.mp3",
      "/audio/voice/count-cheer-8.mp3",
      "/audio/voice/count-cheer-9.mp3",
      "/audio/voice/count-cheer-10.mp3",
      "/audio/voice/count-cheer-11.mp3",
      "/audio/voice/count-cheer-12.mp3",
      "/audio/voice/count-cheer-13.mp3",
      "/audio/voice/count-cheer-14.mp3",
      "/audio/voice/count-cheer-15.mp3",
      "/audio/voice/count-cheer-16.mp3",
      "/audio/voice/count-cheer-17.mp3",
      "/audio/voice/count-cheer-18.mp3",
      "/audio/voice/count-cheer-19.mp3",
      "/audio/voice/count-cheer-20.mp3",
      "/audio/voice/nav-pop-a.mp3",
      "/audio/voice/nav-pop-b.mp3",
      "/audio/voice/nav-pop-c.mp3",
      "/audio/voice/nav-pop-d.mp3",
      "/audio/voice/nav-pop-e.mp3",
      "/audio/voice/nav-pop-s.mp3",
      "/audio/voice/nav-pop-t.mp3",
      "/audio/voice/nav-pop-m.mp3",
      "/audio/voice/nav-pop-f.mp3",
      "/audio/voice/nav-pop-g.mp3",
      "/audio/voice/nav-pop-h.mp3",
      "/audio/voice/nav-pop-i.mp3",
      "/audio/voice/nav-pop-j.mp3",
      "/audio/voice/nav-pop-k.mp3",
      "/audio/voice/nav-pop-l.mp3",
      "/audio/voice/nav-pop-n.mp3",
      "/audio/voice/nav-pop-o.mp3",
      "/audio/voice/nav-pop-p.mp3",
      "/audio/voice/nav-pop-q.mp3",
      "/audio/voice/nav-pop-r.mp3",
      "/audio/voice/nav-pop-u.mp3",
      "/audio/voice/nav-pop-v.mp3",
      "/audio/voice/nav-pop-w.mp3",
      "/audio/voice/nav-pop-x.mp3",
      "/audio/voice/nav-pop-y.mp3",
      "/audio/voice/nav-pop-z.mp3",
      "/audio/voice/ui-steady-too-fast.mp3",
      "/audio/voice/ui-steady-buzz.mp3",
      "/audio/voice/focus-body-in.mp3",
      "/audio/voice/focus-body-out.mp3",
      "/audio/voice/nav-zone-dino.mp3",
      "/audio/voice/nav-zone-starlight.mp3",
      "/audio/voice/nav-zone-coral.mp3",
      "/audio/voice/nav-zone-dino-locked.mp3",
      "/audio/voice/nav-zone-starlight-locked.mp3",
      "/audio/voice/nav-zone-coral-locked.mp3",
      "/audio/voice/nav-zone-dino-in.mp3",
      "/audio/voice/nav-zone-starlight-in.mp3",
      "/audio/voice/nav-zone-coral-in.mp3",
      "/audio/voice/nav-zone-dino-found.mp3",
      "/audio/voice/nav-zone-starlight-found.mp3",
      "/audio/voice/nav-zone-coral-found.mp3",
      "/audio/voice/nav-zone-fossil-rib.mp3",
      "/audio/voice/nav-zone-fossil-print.mp3",
      "/audio/voice/nav-zone-fossil-tooth.mp3",
      "/audio/voice/nav-zone-fossil-egg.mp3",
      "/audio/voice/nav-zone-fossil-horn.mp3",
      "/audio/voice/nav-zone-clam-shell.mp3",
      "/audio/voice/nav-zone-clam-moon.mp3",
      "/audio/voice/nav-zone-clam-crab.mp3",
      "/audio/voice/nav-zone-clam-rose.mp3",
      "/audio/voice/nav-zone-clam-royal.mp3",
      "/audio/voice/nav-zone-clam-sprig.mp3",
      "/audio/voice/nav-zone-star-1.mp3",
      "/audio/voice/nav-zone-star-2.mp3",
      "/audio/voice/nav-zone-star-3.mp3",
      "/audio/voice/nav-zone-star-4.mp3",
      "/audio/voice/nav-zone-star-5.mp3",
      "/audio/voice/nav-zone-star-6.mp3",
      "/audio/voice/ui-rooms-quiet-house.mp3",
      "/audio/voice/ui-rooms-puppet-bow.mp3",
      "/audio/voice/ui-rooms-nook-claps.mp3",
      "/audio/voice/ui-rooms-nook-tidy.mp3",
      "/audio/voice/ui-rooms-ba-na-na-hold.mp3",
      "/audio/voice/ui-rooms-clap-seal.mp3",
      "/audio/voice/ui-rooms-hoot-hold.mp3",
      "/audio/voice/ui-rooms-ba-na-na-done.mp3",
      "/audio/voice/ui-rooms-splash-home.mp3",
      "/audio/voice/ui-rooms-balcony-glows.mp3",
      "/audio/voice/ui-rooms-catch-seal.mp3",
      "/audio/voice/ui-rooms-shopping-home.mp3",
      "/audio/voice/ui-rooms-another-play.mp3",
      "/audio/voice/ui-rooms-all-done.mp3",
      "/audio/voice/ui-rooms-den-light.mp3",
      "/audio/voice/ui-rooms-moon-hill.mp3",
      "/audio/voice/ui-rooms-pine-path.mp3",
      "/audio/voice/ui-rooms-fox-berry.mp3",
      "/audio/voice/ui-rooms-split-berry.mp3",
      "/audio/voice/ui-rooms-owl-asked.mp3",
      "/audio/voice/ui-rooms-blanket-sea.mp3",
      "/audio/voice/ui-rooms-den-end.mp3",
      "/audio/voice/ui-rooms-fish-lunch.mp3",
      "/audio/voice/nav-mission-sun-1.mp3",
      "/audio/voice/nav-mission-sun-2.mp3",
      "/audio/voice/nav-mission-sun-3.mp3",
      "/audio/voice/nav-mission-mon-1.mp3",
      "/audio/voice/nav-mission-mon-2.mp3",
      "/audio/voice/nav-mission-mon-3.mp3",
      "/audio/voice/nav-mission-tue-1.mp3",
      "/audio/voice/nav-mission-tue-2.mp3",
      "/audio/voice/nav-mission-tue-3.mp3",
      "/audio/voice/nav-mission-wed-1.mp3",
      "/audio/voice/nav-mission-wed-2.mp3",
      "/audio/voice/nav-mission-wed-3.mp3",
      "/audio/voice/nav-mission-thu-1.mp3",
      "/audio/voice/nav-mission-thu-2.mp3",
      "/audio/voice/nav-mission-thu-3.mp3",
      "/audio/voice/nav-mission-fri-1.mp3",
      "/audio/voice/nav-mission-fri-2.mp3",
      "/audio/voice/nav-mission-fri-3.mp3",
      "/audio/voice/nav-mission-sat-1.mp3",
      "/audio/voice/nav-mission-sat-2.mp3",
      "/audio/voice/nav-mission-sat-3.mp3",
      "/audio/voice/ui-rooms-clap-done.mp3",
      "/audio/voice/ui-rooms-hoot-done.mp3",
      "/audio/voice/sort-yes-lion.mp3",
      "/audio/voice/sort-yes-whale.mp3",
      "/audio/voice/sort-yes-monkey.mp3",
      "/audio/voice/sort-yes-dolphin.mp3",
      "/audio/voice/sort-yes-elephant.mp3",
      "/audio/voice/sort-yes-fish.mp3",
      "/audio/voice/sort-yes-cow.mp3",
      "/audio/voice/sort-yes-octopus.mp3",
      "/audio/voice/sort-yes-apple.mp3",
      "/audio/voice/sort-yes-spoon.mp3",
      "/audio/voice/sort-yes-pear.mp3",
      "/audio/voice/sort-yes-pot.mp3",
      "/audio/voice/sort-yes-berry.mp3",
      "/audio/voice/sort-yes-whisk.mp3",
      "/audio/voice/sort-yes-banana.mp3",
      "/audio/voice/sort-yes-cup.mp3",
      "/audio/voice/sort-yes-orange.mp3",
      "/audio/voice/sort-yes-mitt.mp3",
      "/audio/voice/sort-yes-grape.mp3",
      "/audio/voice/sort-yes-bowl.mp3",
      "/audio/voice/sort-yes-plane.mp3",
      "/audio/voice/sort-yes-bus.mp3",
      "/audio/voice/sort-yes-heli.mp3",
      "/audio/voice/sort-yes-car.mp3",
      "/audio/voice/sort-yes-rocket.mp3",
      "/audio/voice/sort-yes-bike.mp3",
      "/audio/voice/sort-yes-kite.mp3",
      "/audio/voice/sort-yes-train.mp3",
      "/audio/voice/sort-yes-cloud.mp3",
      "/audio/voice/sort-yes-truck.mp3",
      "/audio/voice/sort-yes-balloon.mp3",
      "/audio/voice/sort-yes-scooter.mp3",
      "/audio/voice/sort-yes-penguin.mp3",
      "/audio/voice/sort-yes-lion-nap.mp3",
      "/audio/voice/sort-yes-seal.mp3",
      "/audio/voice/sort-yes-cow-meadow.mp3",
      "/audio/voice/sort-yes-snow-bear.mp3",
      "/audio/voice/sort-yes-hen.mp3",
      "/audio/voice/sort-yes-ice-whale.mp3",
      "/audio/voice/sort-yes-pig.mp3",
      "/audio/voice/sort-yes-seal-pup.mp3",
      "/audio/voice/sort-yes-horse.mp3",
      "/audio/voice/sort-yes-flake.mp3",
      "/audio/voice/sort-yes-chick.mp3",
      "/audio/voice/sort-yes-sun.mp3",
      "/audio/voice/sort-yes-moon.mp3",
      "/audio/voice/sort-yes-kite-day.mp3",
      "/audio/voice/sort-yes-owl.mp3",
      "/audio/voice/sort-yes-bee-day.mp3",
      "/audio/voice/sort-yes-bat.mp3",
      "/audio/voice/sort-yes-rooster.mp3",
      "/audio/voice/sort-yes-star.mp3",
      "/audio/voice/sort-yes-sunflower.mp3",
      "/audio/voice/sort-yes-lamp.mp3",
      "/audio/voice/sort-yes-day-cloud.mp3",
      "/audio/voice/sort-yes-teddy.mp3",
      "/audio/voice/sort-yes-busy-bee.mp3",
      "/audio/voice/sort-yes-bloom.mp3",
      "/audio/voice/sort-yes-ant.mp3",
      "/audio/voice/sort-yes-tulip.mp3",
      "/audio/voice/sort-yes-beetle.mp3",
      "/audio/voice/sort-yes-rose.mp3",
      "/audio/voice/sort-yes-snail.mp3",
      "/audio/voice/sort-yes-sunflower-turn.mp3",
      "/audio/voice/sort-yes-worm.mp3",
      "/audio/voice/sort-yes-daisy.mp3",
      "/audio/voice/sort-yes-cricket.mp3",
      "/audio/voice/sort-yes-blossom.mp3",
      "/audio/voice/sort-yes-pasture-cow.mp3",
      "/audio/voice/sort-yes-canopy-monkey.mp3",
      "/audio/voice/sort-yes-barn-hen.mp3",
      "/audio/voice/sort-yes-tiger.mp3",
      "/audio/voice/sort-yes-farm-pig.mp3",
      "/audio/voice/sort-yes-parrot.mp3",
      "/audio/voice/sort-yes-sheep.mp3",
      "/audio/voice/sort-yes-frog.mp3",
      "/audio/voice/sort-yes-goat.mp3",
      "/audio/voice/sort-yes-snake.mp3",
      "/audio/voice/sort-yes-barn-horse.mp3",
      "/audio/voice/sort-yes-sloth.mp3",
      "/audio/voice/sort-yes-tree.mp3",
      "/audio/voice/sort-yes-bag.mp3",
      "/audio/voice/sort-yes-duck.mp3",
      "/audio/voice/sort-yes-loaf.mp3",
      "/audio/voice/sort-yes-bench.mp3",
      "/audio/voice/sort-yes-tomato.mp3",
      "/audio/voice/sort-yes-bird.mp3",
      "/audio/voice/sort-yes-coin.mp3",
      "/audio/voice/sort-yes-ball.mp3",
      "/audio/voice/sort-yes-market-fish.mp3",
      "/audio/voice/sort-yes-swing.mp3",
      "/audio/voice/sort-yes-cheese.mp3",
      "/audio/voice/sort-yes-brush.mp3",
      "/audio/voice/sort-yes-drum.mp3",
      "/audio/voice/sort-yes-palette.mp3",
      "/audio/voice/sort-yes-note.mp3",
      "/audio/voice/sort-yes-crayon.mp3",
      "/audio/voice/sort-yes-guitar.mp3",
      "/audio/voice/sort-yes-easel.mp3",
      "/audio/voice/sort-yes-bell.mp3",
      "/audio/voice/sort-yes-paint-pot.mp3",
      "/audio/voice/sort-yes-piano.mp3",
      "/audio/voice/sort-yes-scissors.mp3",
      "/audio/voice/sort-yes-flute.mp3",
      "/audio/voice/sort-yes-crown.mp3",
      "/audio/voice/sort-yes-real-hen.mp3",
      "/audio/voice/sort-yes-dragon.mp3",
      "/audio/voice/sort-yes-egg.mp3",
      "/audio/voice/sort-yes-wand.mp3",
      "/audio/voice/sort-yes-hay.mp3",
      "/audio/voice/sort-yes-castle.mp3",
      "/audio/voice/sort-yes-real-cow.mp3",
      "/audio/voice/sort-yes-wish-star.mp3",
      "/audio/voice/sort-yes-real-pig.mp3",
      "/audio/voice/sort-yes-book.mp3",
      "/audio/voice/sort-yes-real-sheep.mp3",
      "/audio/voice/sort-yes-soap.mp3",
      "/audio/voice/sort-yes-pillow.mp3",
      "/audio/voice/sort-yes-tooth-brush.mp3",
      "/audio/voice/sort-yes-quiet-book.mp3",
      "/audio/voice/sort-yes-towel.mp3",
      "/audio/voice/sort-yes-rest-lamp.mp3",
      "/audio/voice/sort-yes-tap.mp3",
      "/audio/voice/sort-yes-rest-teddy.mp3",
      "/audio/voice/sort-yes-flannel.mp3",
      "/audio/voice/sort-yes-quilt.mp3",
      "/audio/voice/sort-yes-comb.mp3",
      "/audio/voice/sort-yes-night-story.mp3",
      "/audio/voice/sort-yes-pine.mp3",
      "/audio/voice/sort-yes-gem.mp3",
      "/audio/voice/sort-yes-leaf.mp3",
      "/audio/voice/sort-yes-treasure-coin.mp3",
      "/audio/voice/sort-yes-boot.mp3",
      "/audio/voice/sort-yes-map.mp3",
      "/audio/voice/sort-yes-trail-owl.mp3",
      "/audio/voice/sort-yes-key.mp3",
      "/audio/voice/sort-yes-rock.mp3",
      "/audio/voice/sort-yes-chest.mp3",
      "/audio/voice/sort-yes-mushroom.mp3",
      "/audio/voice/sort-yes-gem-crown.mp3",
      "/audio/voice/sort-yes-letter-a.mp3",
      "/audio/voice/sort-yes-num-one.mp3",
      "/audio/voice/sort-yes-letter-s.mp3",
      "/audio/voice/sort-yes-letter-m.mp3",
      "/audio/voice/sort-yes-num-six.mp3",
      "/audio/voice/sort-yes-letter-p.mp3",
      "/audio/voice/sort-yes-num-eight.mp3",
      "/audio/voice/sort-yes-letter-b.mp3",
      "/audio/voice/sort-yes-num-three.mp3",
      "/audio/voice/sort-yes-letter-t.mp3",
      "/audio/voice/sort-yes-num-two.mp3",
      "/audio/voice/sort-oops-lion.mp3",
      "/audio/voice/sort-oops-whale.mp3",
      "/audio/voice/sort-oops-monkey.mp3",
      "/audio/voice/sort-oops-dolphin.mp3",
      "/audio/voice/sort-oops-elephant.mp3",
      "/audio/voice/sort-oops-fish.mp3",
      "/audio/voice/sort-oops-cow.mp3",
      "/audio/voice/sort-oops-octopus.mp3",
      "/audio/voice/sort-oops-apple.mp3",
      "/audio/voice/sort-oops-spoon.mp3",
      "/audio/voice/sort-oops-pear.mp3",
      "/audio/voice/sort-oops-pot.mp3",
      "/audio/voice/sort-oops-berry.mp3",
      "/audio/voice/sort-oops-whisk.mp3",
      "/audio/voice/sort-oops-banana.mp3",
      "/audio/voice/sort-oops-measuring-cup.mp3",
      "/audio/voice/sort-oops-orange.mp3",
      "/audio/voice/sort-oops-oven-mitt.mp3",
      "/audio/voice/sort-oops-grapes.mp3",
      "/audio/voice/sort-oops-mixing-bowl.mp3",
      "/audio/voice/sort-oops-plane.mp3",
      "/audio/voice/sort-oops-bus.mp3",
      "/audio/voice/sort-oops-helicopter.mp3",
      "/audio/voice/sort-oops-car.mp3",
      "/audio/voice/sort-oops-rocket.mp3",
      "/audio/voice/sort-oops-bike.mp3",
      "/audio/voice/sort-oops-kite.mp3",
      "/audio/voice/sort-oops-train.mp3",
      "/audio/voice/sort-oops-cloud.mp3",
      "/audio/voice/sort-oops-truck.mp3",
      "/audio/voice/sort-oops-balloon.mp3",
      "/audio/voice/sort-oops-scooter.mp3",
      "/audio/voice/sort-oops-penguin.mp3",
      "/audio/voice/sort-oops-lion-warm.mp3",
      "/audio/voice/sort-oops-seal.mp3",
      "/audio/voice/sort-oops-cow-warm.mp3",
      "/audio/voice/sort-oops-snow-bear.mp3",
      "/audio/voice/sort-oops-hen-warm.mp3",
      "/audio/voice/sort-oops-whale-ice.mp3",
      "/audio/voice/sort-oops-pig-warm.mp3",
      "/audio/voice/sort-oops-seal-pup.mp3",
      "/audio/voice/sort-oops-horse-warm.mp3",
      "/audio/voice/sort-oops-snowflake.mp3",
      "/audio/voice/sort-oops-chick.mp3",
      "/audio/voice/sort-oops-sun.mp3",
      "/audio/voice/sort-oops-moon.mp3",
      "/audio/voice/sort-oops-kite-day.mp3",
      "/audio/voice/sort-oops-owl.mp3",
      "/audio/voice/sort-oops-bee-day.mp3",
      "/audio/voice/sort-oops-bat.mp3",
      "/audio/voice/sort-oops-rooster.mp3",
      "/audio/voice/sort-oops-star.mp3",
      "/audio/voice/sort-oops-sunflower.mp3",
      "/audio/voice/sort-oops-lamp.mp3",
      "/audio/voice/sort-oops-day-cloud.mp3",
      "/audio/voice/sort-oops-teddy.mp3",
      "/audio/voice/sort-oops-busy-bee.mp3",
      "/audio/voice/sort-oops-bloom.mp3",
      "/audio/voice/sort-oops-ant.mp3",
      "/audio/voice/sort-oops-tulip.mp3",
      "/audio/voice/sort-oops-beetle.mp3",
      "/audio/voice/sort-oops-rose.mp3",
      "/audio/voice/sort-oops-snail.mp3",
      "/audio/voice/sort-oops-sunflower-turn.mp3",
      "/audio/voice/sort-oops-worm.mp3",
      "/audio/voice/sort-oops-daisy.mp3",
      "/audio/voice/sort-oops-cricket.mp3",
      "/audio/voice/sort-oops-blossom.mp3",
      "/audio/voice/sort-oops-pasture-cow.mp3",
      "/audio/voice/sort-oops-canopy-monkey.mp3",
      "/audio/voice/sort-oops-barn-hen.mp3",
      "/audio/voice/sort-oops-tiger.mp3",
      "/audio/voice/sort-oops-farm-pig.mp3",
      "/audio/voice/sort-oops-parrot.mp3",
      "/audio/voice/sort-oops-sheep.mp3",
      "/audio/voice/sort-oops-frog.mp3",
      "/audio/voice/sort-oops-goat.mp3",
      "/audio/voice/sort-oops-snake.mp3",
      "/audio/voice/sort-oops-barn-horse.mp3",
      "/audio/voice/sort-oops-sloth.mp3",
      "/audio/voice/sort-oops-tree.mp3",
      "/audio/voice/sort-oops-bag.mp3",
      "/audio/voice/sort-oops-duck.mp3",
      "/audio/voice/sort-oops-loaf.mp3",
      "/audio/voice/sort-oops-bench.mp3",
      "/audio/voice/sort-oops-tomato.mp3",
      "/audio/voice/sort-oops-bird.mp3",
      "/audio/voice/sort-oops-coin.mp3",
      "/audio/voice/sort-oops-ball.mp3",
      "/audio/voice/sort-oops-market-fish.mp3",
      "/audio/voice/sort-oops-swing.mp3",
      "/audio/voice/sort-oops-cheese.mp3",
      "/audio/voice/sort-oops-brush.mp3",
      "/audio/voice/sort-oops-drum.mp3",
      "/audio/voice/sort-oops-palette.mp3",
      "/audio/voice/sort-oops-note.mp3",
      "/audio/voice/sort-oops-crayon.mp3",
      "/audio/voice/sort-oops-guitar.mp3",
      "/audio/voice/sort-oops-easel.mp3",
      "/audio/voice/sort-oops-bell.mp3",
      "/audio/voice/sort-oops-paint-pot.mp3",
      "/audio/voice/sort-oops-piano.mp3",
      "/audio/voice/sort-oops-scissors.mp3",
      "/audio/voice/sort-oops-flute.mp3",
      "/audio/voice/sort-oops-crown.mp3",
      "/audio/voice/sort-oops-real-hen.mp3",
      "/audio/voice/sort-oops-dragon.mp3",
      "/audio/voice/sort-oops-egg.mp3",
      "/audio/voice/sort-oops-wand.mp3",
      "/audio/voice/sort-oops-hay.mp3",
      "/audio/voice/sort-oops-castle.mp3",
      "/audio/voice/sort-oops-real-cow.mp3",
      "/audio/voice/sort-oops-wish-star.mp3",
      "/audio/voice/sort-oops-real-pig.mp3",
      "/audio/voice/sort-oops-book.mp3",
      "/audio/voice/sort-oops-real-sheep.mp3",
      "/audio/voice/sort-oops-soap.mp3",
      "/audio/voice/sort-oops-pillow.mp3",
      "/audio/voice/sort-oops-tooth-brush.mp3",
      "/audio/voice/sort-oops-quiet-book.mp3",
      "/audio/voice/sort-oops-towel.mp3",
      "/audio/voice/sort-oops-rest-lamp.mp3",
      "/audio/voice/sort-oops-tap.mp3",
      "/audio/voice/sort-oops-rest-teddy.mp3",
      "/audio/voice/sort-oops-flannel.mp3",
      "/audio/voice/sort-oops-quilt.mp3",
      "/audio/voice/sort-oops-comb.mp3",
      "/audio/voice/sort-oops-night-story.mp3",
      "/audio/voice/sort-oops-pine.mp3",
      "/audio/voice/sort-oops-gem.mp3",
      "/audio/voice/sort-oops-leaf.mp3",
      "/audio/voice/sort-oops-treasure-coin.mp3",
      "/audio/voice/sort-oops-boot.mp3",
      "/audio/voice/sort-oops-map.mp3",
      "/audio/voice/sort-oops-trail-owl.mp3",
      "/audio/voice/sort-oops-key.mp3",
      "/audio/voice/sort-oops-rock.mp3",
      "/audio/voice/sort-oops-chest.mp3",
      "/audio/voice/sort-oops-mushroom.mp3",
      "/audio/voice/sort-oops-gem-crown.mp3",
      "/audio/voice/sort-oops-letter-a.mp3",
      "/audio/voice/sort-oops-num-one.mp3",
      "/audio/voice/sort-oops-letter-s.mp3",
      "/audio/voice/sort-oops-num-ten.mp3",
      "/audio/voice/sort-oops-letter-m.mp3",
      "/audio/voice/sort-oops-num-six.mp3",
      "/audio/voice/sort-oops-letter-p.mp3",
      "/audio/voice/sort-oops-num-eight.mp3",
      "/audio/voice/sort-oops-letter-b.mp3",
      "/audio/voice/sort-oops-num-three.mp3",
      "/audio/voice/sort-oops-letter-t.mp3",
      "/audio/voice/sort-oops-num-two.mp3",
      "/audio/voice/sort-yes-cow-graze.mp3",
      "/audio/voice/sort-yes-octopus-arms.mp3",
      "/audio/voice/sort-yes-crisp-apple.mp3",
      "/audio/voice/sort-yes-cupcake.mp3",
      "/audio/voice/sort-yes-tree-banana.mp3",
      "/audio/voice/sort-yes-lollipop.mp3",
      "/audio/voice/sort-yes-strawberry.mp3",
      "/audio/voice/sort-yes-donut.mp3",
      "/audio/voice/sort-yes-sunglasses.mp3",
      "/audio/voice/sort-yes-wool-scarf.mp3",
      "/audio/voice/sort-yes-swimsuit.mp3",
      "/audio/voice/sort-yes-mittens.mp3",
      "/audio/voice/sort-yes-airplane.mp3",
      "/audio/voice/sort-yes-family-car.mp3",
      "/audio/voice/sort-yes-heli-air.mp3",
      "/audio/voice/sort-yes-choo-train.mp3",
      "/audio/voice/sort-yes-space-rocket.mp3",
      "/audio/voice/sort-yes-bicycle.mp3",
      "/audio/voice/sort-yes-bright-sun.mp3",
      "/audio/voice/sort-yes-glowing-moon.mp3",
      "/audio/voice/sort-yes-kite-breeze.mp3",
      "/audio/voice/sort-yes-twinkling-star.mp3",
      "/audio/voice/sort-yes-rainbow.mp3",
      "/audio/voice/sort-yes-night-owl.mp3",
      "/audio/voice/sort-oops-fresh-apple.mp3",
      "/audio/voice/sort-oops-cupcake.mp3",
      "/audio/voice/sort-oops-fresh-banana.mp3",
      "/audio/voice/sort-oops-lollipop.mp3",
      "/audio/voice/sort-oops-strawberry.mp3",
      "/audio/voice/sort-oops-donut.mp3",
      "/audio/voice/sort-oops-sunglasses.mp3",
      "/audio/voice/sort-oops-wool-scarf.mp3",
      "/audio/voice/sort-oops-swimsuit.mp3",
      "/audio/voice/sort-oops-mittens.mp3",
      "/audio/voice/sort-oops-airplane.mp3",
      "/audio/voice/sort-oops-family-car.mp3",
      "/audio/voice/sort-oops-sky-helicopter.mp3",
      "/audio/voice/sort-oops-choo-train.mp3",
      "/audio/voice/sort-oops-space-rocket.mp3",
      "/audio/voice/sort-oops-bicycle.mp3",
      "/audio/voice/sort-oops-bright-sun.mp3",
      "/audio/voice/sort-oops-glowing-moon.mp3",
      "/audio/voice/sort-oops-kite-breeze.mp3",
      "/audio/voice/sort-oops-twinkling-star.mp3",
      "/audio/voice/sort-oops-rainbow.mp3",
      "/audio/voice/sort-oops-night-owl.mp3",
      "/audio/voice/phonics-tap-and.mp3",
      "/audio/voice/phonics-tap-at.mp3",
      "/audio/voice/phonics-tap-bun.mp3",
      "/audio/voice/phonics-tap-bus.mp3",
      "/audio/voice/phonics-tap-cat.mp3",
      "/audio/voice/phonics-tap-come.mp3",
      "/audio/voice/phonics-tap-cut.mp3",
      "/audio/voice/phonics-tap-door.mp3",
      "/audio/voice/phonics-tap-ferry.mp3",
      "/audio/voice/phonics-tap-go.mp3",
      "/audio/voice/phonics-tap-hat.mp3",
      "/audio/voice/phonics-tap-hop.mp3",
      "/audio/voice/phonics-tap-hot.mp3",
      "/audio/voice/phonics-tap-is.mp3",
      "/audio/voice/phonics-tap-mat.mp3",
      "/audio/voice/phonics-tap-nana.mp3",
      "/audio/voice/phonics-tap-nap.mp3",
      "/audio/voice/phonics-tap-on.mp3",
      "/audio/voice/phonics-tap-pat.mp3",
      "/audio/voice/phonics-tap-peg.mp3",
      "/audio/voice/phonics-tap-pot.mp3",
      "/audio/voice/phonics-tap-red.mp3",
      "/audio/voice/phonics-tap-sat.mp3",
      "/audio/voice/phonics-tap-sees.mp3",
      "/audio/voice/phonics-tap-sip.mp3",
      "/audio/voice/phonics-tap-sit.mp3",
      "/audio/voice/phonics-tap-slice.mp3",
      "/audio/voice/phonics-tap-stoop.mp3",
      "/audio/voice/phonics-tap-teddy.mp3",
      "/audio/voice/phonics-tap-the-cap.mp3",
      "/audio/voice/phonics-tap-the.mp3",
      "/audio/voice/phonics-tap-to.mp3",
      "/audio/voice/phonics-tap-warm.mp3",
      "/audio/voice/phonics-tap-we.mp3",
      "/audio/voice/color-mix-red-yellow.mp3",
      "/audio/voice/color-mix-yellow-red.mp3",
      "/audio/voice/color-mix-blue-yellow.mp3",
      "/audio/voice/color-mix-yellow-blue.mp3",
      "/audio/voice/color-mix-red-blue.mp3",
      "/audio/voice/color-mix-blue-red.mp3",
      "/audio/voice/color-two-ruby-red.mp3",
      "/audio/voice/color-two-sunny-yellow.mp3",
      "/audio/voice/color-two-ocean-blue.mp3",
      "/audio/voice/color-two-cloud-white.mp3",
      "/audio/voice/piano-welcome.mp3",
      "/audio/voice/piano-play-twinkle.mp3",
      "/audio/voice/piano-play-mary.mp3",
      "/audio/voice/piano-play-row.mp3",
      "/audio/voice/piano-play-old-mac.mp3",
      "/audio/voice/piano-play-wheels.mp3",
      "/audio/voice/piano-play-london.mp3",
      "/audio/voice/piano-play-baa.mp3",
      "/audio/voice/piano-play-jingle.mp3",
      "/audio/voice/piano-bravo-twinkle.mp3",
      "/audio/voice/piano-bravo-mary.mp3",
      "/audio/voice/piano-bravo-row.mp3",
      "/audio/voice/piano-bravo-old-mac.mp3",
      "/audio/voice/piano-bravo-wheels.mp3",
      "/audio/voice/piano-bravo-london.mp3",
      "/audio/voice/piano-bravo-baa.mp3",
      "/audio/voice/piano-bravo-jingle.mp3",
      "/audio/voice/trace-rocket.mp3",
      "/audio/voice/trace-yes-rocket.mp3",
      "/audio/voice/trace-letter-a.mp3",
      "/audio/voice/trace-yes-letter-a.mp3",
      "/audio/voice/trace-count.mp3",
      "/audio/voice/trace-yes-count.mp3",
      "/audio/voice/trace-c.mp3",
      "/audio/voice/trace-yes-c.mp3",
      "/audio/voice/trace-d.mp3",
      "/audio/voice/trace-yes-d.mp3",
      "/audio/voice/trace-e.mp3",
      "/audio/voice/trace-yes-e.mp3",
      "/audio/voice/trace-f.mp3",
      "/audio/voice/trace-yes-f.mp3",
      "/audio/voice/trace-g.mp3",
      "/audio/voice/trace-yes-g.mp3",
      "/audio/voice/trace-h.mp3",
      "/audio/voice/trace-yes-h.mp3",
      "/audio/voice/trace-i.mp3",
      "/audio/voice/trace-yes-i.mp3",
      "/audio/voice/trace-j.mp3",
      "/audio/voice/trace-yes-j.mp3",
      "/audio/voice/trace-k.mp3",
      "/audio/voice/trace-yes-k.mp3",
      "/audio/voice/trace-l.mp3",
      "/audio/voice/trace-yes-l.mp3",
      "/audio/voice/trace-n.mp3",
      "/audio/voice/trace-yes-n.mp3",
      "/audio/voice/trace-o.mp3",
      "/audio/voice/trace-yes-o.mp3",
      "/audio/voice/trace-p.mp3",
      "/audio/voice/trace-yes-p.mp3",
      "/audio/voice/trace-q.mp3",
      "/audio/voice/trace-yes-q.mp3",
      "/audio/voice/trace-r.mp3",
      "/audio/voice/trace-yes-r.mp3",
      "/audio/voice/trace-t.mp3",
      "/audio/voice/trace-yes-t.mp3",
      "/audio/voice/trace-u.mp3",
      "/audio/voice/trace-yes-u.mp3",
      "/audio/voice/trace-v.mp3",
      "/audio/voice/trace-yes-v.mp3",
      "/audio/voice/trace-w.mp3",
      "/audio/voice/trace-yes-w.mp3",
      "/audio/voice/trace-x.mp3",
      "/audio/voice/trace-yes-x.mp3",
      "/audio/voice/trace-y.mp3",
      "/audio/voice/trace-yes-y.mp3",
      "/audio/voice/trace-z.mp3",
      "/audio/voice/trace-yes-z.mp3",
      "/audio/voice/trace-apple.mp3",
      "/audio/voice/trace-yes-apple.mp3",
      "/audio/voice/trace-bus.mp3",
      "/audio/voice/trace-yes-bus.mp3",
      "/audio/voice/trace-sun.mp3",
      "/audio/voice/trace-yes-sun.mp3",
      "/audio/voice/trace-moon.mp3",
      "/audio/voice/trace-yes-moon.mp3",
      "/audio/voice/trace-line-2-of-2.mp3",
      "/audio/voice/trace-line-2-of-3.mp3",
      "/audio/voice/trace-line-3-of-3.mp3",
      "/audio/voice/trace-line-2-of-4.mp3",
      "/audio/voice/trace-line-3-of-4.mp3",
      "/audio/voice/trace-line-4-of-4.mp3",
      "/audio/voice/trace-bear.mp3",
      "/audio/voice/trace-yes-bear.mp3",
      "/audio/voice/trace-cat.mp3",
      "/audio/voice/trace-yes-cat.mp3",
      "/audio/voice/trace-dolphin.mp3",
      "/audio/voice/trace-yes-dolphin.mp3",
      "/audio/voice/trace-tiger.mp3",
      "/audio/voice/trace-yes-tiger.mp3",
      "/audio/voice/trace-puppy.mp3",
      "/audio/voice/trace-yes-puppy.mp3",
      "/audio/voice/trace-fish.mp3",
      "/audio/voice/trace-yes-fish.mp3",
      "/audio/voice/trace-hat.mp3",
      "/audio/voice/trace-yes-hat.mp3",
      "/audio/voice/trace-nest.mp3",
      "/audio/voice/trace-yes-nest.mp3",
      "/audio/voice/trace-rain.mp3",
      "/audio/voice/trace-yes-rain.mp3",
      "/audio/voice/trace-bread.mp3",
      "/audio/voice/trace-yes-bread.mp3",
      "/audio/voice/trace-soup.mp3",
      "/audio/voice/trace-yes-soup.mp3",
      "/audio/voice/trace-milk.mp3",
      "/audio/voice/trace-yes-milk.mp3",
      "/audio/voice/trace-pear.mp3",
      "/audio/voice/trace-yes-pear.mp3",
      "/audio/voice/trace-corn.mp3",
      "/audio/voice/trace-yes-corn.mp3",
      "/audio/voice/trace-tea.mp3",
      "/audio/voice/trace-yes-tea.mp3",
      "/audio/voice/trace-jam.mp3",
      "/audio/voice/trace-yes-jam.mp3",
      "/audio/voice/trace-oven.mp3",
      "/audio/voice/trace-yes-oven.mp3",
      "/audio/voice/trace-kettle.mp3",
      "/audio/voice/trace-yes-kettle.mp3",
      "/audio/voice/trace-flour.mp3",
      "/audio/voice/trace-yes-flour.mp3",
      "/audio/voice/trace-noodle.mp3",
      "/audio/voice/trace-yes-noodle.mp3",
      "/audio/voice/trace-car.mp3",
      "/audio/voice/trace-yes-car.mp3",
      "/audio/voice/trace-plane.mp3",
      "/audio/voice/trace-yes-plane.mp3",
      "/audio/voice/trace-train.mp3",
      "/audio/voice/trace-yes-train.mp3",
      "/audio/voice/trace-van.mp3",
      "/audio/voice/trace-yes-van.mp3",
      "/audio/voice/trace-ship.mp3",
      "/audio/voice/trace-yes-ship.mp3",
      "/audio/voice/trace-road.mp3",
      "/audio/voice/trace-yes-road.mp3",
      "/audio/voice/trace-airport.mp3",
      "/audio/voice/trace-yes-airport.mp3",
      "/audio/voice/trace-horn.mp3",
      "/audio/voice/trace-yes-horn.mp3",
      "/audio/voice/trace-wheel.mp3",
      "/audio/voice/trace-yes-wheel.mp3",
      "/audio/voice/trace-go.mp3",
      "/audio/voice/trace-yes-go.mp3",
      "/audio/voice/trace-lights.mp3",
      "/audio/voice/trace-yes-lights.mp3",
      "/audio/voice/trace-ice.mp3",
      "/audio/voice/trace-yes-ice.mp3",
      "/audio/voice/trace-penguin.mp3",
      "/audio/voice/trace-yes-penguin.mp3",
      "/audio/voice/trace-seal.mp3",
      "/audio/voice/trace-yes-seal.mp3",
      "/audio/voice/trace-north.mp3",
      "/audio/voice/trace-yes-north.mp3",
      "/audio/voice/trace-whale.mp3",
      "/audio/voice/trace-yes-whale.mp3",
      "/audio/voice/trace-fox.mp3",
      "/audio/voice/trace-yes-fox.mp3",
      "/audio/voice/trace-owl.mp3",
      "/audio/voice/trace-yes-owl.mp3",
      "/audio/voice/trace-cold.mp3",
      "/audio/voice/trace-yes-cold.mp3",
      "/audio/voice/trace-huddle.mp3",
      "/audio/voice/trace-yes-huddle.mp3",
      "/audio/voice/trace-den.mp3",
      "/audio/voice/trace-yes-den.mp3",
      "/audio/voice/trace-night.mp3",
      "/audio/voice/trace-yes-night.mp3",
      "/audio/voice/trace-star.mp3",
      "/audio/voice/trace-yes-star.mp3",
      "/audio/voice/trace-lamp.mp3",
      "/audio/voice/trace-yes-lamp.mp3",
      "/audio/voice/trace-bed.mp3",
      "/audio/voice/trace-yes-bed.mp3",
      "/audio/voice/trace-wood.mp3",
      "/audio/voice/trace-yes-wood.mp3",
      "/audio/voice/trace-quilt.mp3",
      "/audio/voice/trace-yes-quilt.mp3",
      "/audio/voice/trace-hush.mp3",
      "/audio/voice/trace-yes-hush.mp3",
      "/audio/voice/trace-dream.mp3",
      "/audio/voice/trace-yes-dream.mp3",
      "/audio/voice/trace-yawn.mp3",
      "/audio/voice/trace-yes-yawn.mp3",
      "/audio/voice/trace-cow.mp3",
      "/audio/voice/trace-yes-cow.mp3",
      "/audio/voice/trace-pig.mp3",
      "/audio/voice/trace-yes-pig.mp3",
      "/audio/voice/trace-horse.mp3",
      "/audio/voice/trace-yes-horse.mp3",
      "/audio/voice/trace-duck.mp3",
      "/audio/voice/trace-yes-duck.mp3",
      "/audio/voice/trace-lion.mp3",
      "/audio/voice/trace-yes-lion.mp3",
      "/audio/voice/trace-monkey.mp3",
      "/audio/voice/trace-yes-monkey.mp3",
      "/audio/voice/trace-sheep.mp3",
      "/audio/voice/trace-yes-sheep.mp3",
      "/audio/voice/trace-frog.mp3",
      "/audio/voice/trace-yes-frog.mp3",
      "/audio/voice/trace-goat.mp3",
      "/audio/voice/trace-yes-goat.mp3",
      "/audio/voice/trace-wool.mp3",
      "/audio/voice/trace-yes-wool.mp3",
      "/audio/voice/trace-barn.mp3",
      "/audio/voice/trace-yes-barn.mp3",
      "/audio/voice/trace-rooster.mp3",
      "/audio/voice/trace-yes-rooster.mp3",
      "/audio/voice/trace-quiet.mp3",
      "/audio/voice/trace-yes-quiet.mp3",
      "/audio/voice/trace-bee.mp3",
      "/audio/voice/trace-yes-bee.mp3",
      "/audio/voice/trace-ant.mp3",
      "/audio/voice/trace-yes-ant.mp3",
      "/audio/voice/trace-ladybug.mp3",
      "/audio/voice/trace-yes-ladybug.mp3",
      "/audio/voice/trace-worm.mp3",
      "/audio/voice/trace-yes-worm.mp3",
      "/audio/voice/trace-snail.mp3",
      "/audio/voice/trace-yes-snail.mp3",
      "/audio/voice/trace-caterpillar.mp3",
      "/audio/voice/trace-yes-caterpillar.mp3",
      "/audio/voice/trace-fly.mp3",
      "/audio/voice/trace-yes-fly.mp3",
      "/audio/voice/trace-moth.mp3",
      "/audio/voice/trace-yes-moth.mp3",
      "/audio/voice/trace-grass.mp3",
      "/audio/voice/trace-yes-grass.mp3",
      "/audio/voice/trace-dew.mp3",
      "/audio/voice/trace-yes-dew.mp3",
      "/audio/voice/trace-hive.mp3",
      "/audio/voice/trace-yes-hive.mp3",
      "/audio/voice/trace-pollen.mp3",
      "/audio/voice/trace-yes-pollen.mp3",
      "/audio/voice/trace-park.mp3",
      "/audio/voice/trace-yes-park.mp3",
      "/audio/voice/trace-town.mp3",
      "/audio/voice/trace-yes-town.mp3",
      "/audio/voice/trace-market.mp3",
      "/audio/voice/trace-yes-market.mp3",
      "/audio/voice/trace-shop.mp3",
      "/audio/voice/trace-yes-shop.mp3",
      "/audio/voice/trace-fire.mp3",
      "/audio/voice/trace-yes-fire.mp3",
      "/audio/voice/trace-clock.mp3",
      "/audio/voice/trace-yes-clock.mp3",
      "/audio/voice/trace-kiosk.mp3",
      "/audio/voice/trace-yes-kiosk.mp3",
      "/audio/voice/trace-news.mp3",
      "/audio/voice/trace-yes-news.mp3",
      "/audio/voice/trace-paint.mp3",
      "/audio/voice/trace-yes-paint.mp3",
      "/audio/voice/trace-bead.mp3",
      "/audio/voice/trace-yes-bead.mp3",
      "/audio/voice/trace-song.mp3",
      "/audio/voice/trace-yes-song.mp3",
      "/audio/voice/trace-color.mp3",
      "/audio/voice/trace-yes-color.mp3",
      "/audio/voice/trace-heart.mp3",
      "/audio/voice/trace-yes-heart.mp3",
      "/audio/voice/trace-drum.mp3",
      "/audio/voice/trace-yes-drum.mp3",
      "/audio/voice/trace-note.mp3",
      "/audio/voice/trace-yes-note.mp3",
      "/audio/voice/trace-art.mp3",
      "/audio/voice/trace-yes-art.mp3",
      "/audio/voice/trace-glue.mp3",
      "/audio/voice/trace-yes-glue.mp3",
      "/audio/voice/trace-red.mp3",
      "/audio/voice/trace-yes-red.mp3",
      "/audio/voice/trace-easel.mp3",
      "/audio/voice/trace-yes-easel.mp3",
      "/audio/voice/trace-ink.mp3",
      "/audio/voice/trace-yes-ink.mp3",
      "/audio/voice/trace-book.mp3",
      "/audio/voice/trace-yes-book.mp3",
      "/audio/voice/trace-tale.mp3",
      "/audio/voice/trace-yes-tale.mp3",
      "/audio/voice/trace-story.mp3",
      "/audio/voice/trace-yes-story.mp3",
      "/audio/voice/trace-hen.mp3",
      "/audio/voice/trace-yes-hen.mp3",
      "/audio/voice/trace-crown.mp3",
      "/audio/voice/trace-yes-crown.mp3",
      "/audio/voice/trace-king.mp3",
      "/audio/voice/trace-yes-king.mp3",
      "/audio/voice/trace-page.mp3",
      "/audio/voice/trace-yes-page.mp3",
      "/audio/voice/trace-read.mp3",
      "/audio/voice/trace-yes-read.mp3",
      "/audio/voice/trace-dragon.mp3",
      "/audio/voice/trace-yes-dragon.mp3",
      "/audio/voice/trace-look.mp3",
      "/audio/voice/trace-yes-look.mp3",
      "/audio/voice/trace-castle.mp3",
      "/audio/voice/trace-yes-castle.mp3",
      "/audio/voice/trace-home.mp3",
      "/audio/voice/trace-yes-home.mp3",
      "/audio/voice/trace-brush.mp3",
      "/audio/voice/trace-yes-brush.mp3",
      "/audio/voice/trace-smile.mp3",
      "/audio/voice/trace-yes-smile.mp3",
      "/audio/voice/trace-mum.mp3",
      "/audio/voice/trace-yes-mum.mp3",
      "/audio/voice/trace-teeth.mp3",
      "/audio/voice/trace-yes-teeth.mp3",
      "/audio/voice/trace-family.mp3",
      "/audio/voice/trace-yes-family.mp3",
      "/audio/voice/trace-cup.mp3",
      "/audio/voice/trace-yes-cup.mp3",
      "/audio/voice/trace-love.mp3",
      "/audio/voice/trace-yes-love.mp3",
      "/audio/voice/trace-door.mp3",
      "/audio/voice/trace-yes-door.mp3",
      "/audio/voice/trace-pillow.mp3",
      "/audio/voice/trace-yes-pillow.mp3",
      "/audio/voice/trace-kiss.mp3",
      "/audio/voice/trace-yes-kiss.mp3",
      "/audio/voice/trace-nap.mp3",
      "/audio/voice/trace-yes-nap.mp3",
      "/audio/voice/trace-map.mp3",
      "/audio/voice/trace-yes-map.mp3",
      "/audio/voice/trace-trail.mp3",
      "/audio/voice/trace-yes-trail.mp3",
      "/audio/voice/trace-pine.mp3",
      "/audio/voice/trace-yes-pine.mp3",
      "/audio/voice/trace-gem.mp3",
      "/audio/voice/trace-yes-gem.mp3",
      "/audio/voice/trace-cave.mp3",
      "/audio/voice/trace-yes-cave.mp3",
      "/audio/voice/trace-forest.mp3",
      "/audio/voice/trace-yes-forest.mp3",
      "/audio/voice/trace-boot.mp3",
      "/audio/voice/trace-yes-boot.mp3",
      "/audio/voice/trace-leaf.mp3",
      "/audio/voice/trace-yes-leaf.mp3",
      "/audio/voice/trace-hill.mp3",
      "/audio/voice/trace-yes-hill.mp3",
      "/audio/voice/trace-key.mp3",
      "/audio/voice/trace-yes-key.mp3",
      "/audio/voice/trace-dot.mp3",
      "/audio/voice/trace-yes-dot.mp3",
      "/audio/voice/trace-shape.mp3",
      "/audio/voice/trace-yes-shape.mp3",
      "/audio/voice/trace-trace.mp3",
      "/audio/voice/trace-yes-trace.mp3",
      "/audio/voice/trace-pen.mp3",
      "/audio/voice/trace-yes-pen.mp3",
      "/audio/voice/trace-nine.mp3",
      "/audio/voice/trace-yes-nine.mp3",
      "/audio/voice/trace-six.mp3",
      "/audio/voice/trace-yes-six.mp3",
      "/audio/voice/trace-eight.mp3",
      "/audio/voice/trace-yes-eight.mp3",
      "/audio/voice/trace-ten.mp3",
      "/audio/voice/trace-yes-ten.mp3",
      "/audio/voice/focus-body-zoomies.mp3",
      "/audio/voice/focus-body-wiggles.mp3",
      "/audio/voice/focus-body-loud.mp3",
      "/audio/voice/focus-body-floppy.mp3",
      "/audio/voice/focus-body-ready.mp3",
      "/audio/voice/focus-mv-stomp.mp3",
      "/audio/voice/focus-mv-jump.mp3",
      "/audio/voice/focus-mv-march.mp3",
      "/audio/voice/focus-mv-clap.mp3",
      "/audio/voice/focus-mv-shake.mp3",
      "/audio/voice/focus-mv-hop.mp3",
      "/audio/voice/focus-mv-wiggle.mp3",
      "/audio/voice/focus-mv-star.mp3",
      "/audio/voice/focus-mv-reach.mp3",
      "/audio/voice/focus-mv-roll.mp3",
      "/audio/voice/focus-mv-twist.mp3",
      "/audio/voice/focus-mv-toe.mp3",
      "/audio/voice/focus-hv-wall.mp3",
      "/audio/voice/focus-hv-squeeze.mp3",
      "/audio/voice/focus-hv-palms.mp3",
      "/audio/voice/focus-hv-carry.mp3",
      "/audio/voice/focus-hv-chair.mp3",
      "/audio/voice/focus-hv-stomp.mp3",
      "/audio/voice/focus-hv-pull.mp3",
      "/audio/voice/focus-hv-curl.mp3",
      "/audio/voice/focus-hv-floor.mp3",
      "/audio/voice/focus-hv-book.mp3",
      "/audio/voice/focus-br-flower.mp3",
      "/audio/voice/focus-br-teddy.mp3",
      "/audio/voice/focus-br-rainbow.mp3",
      "/audio/voice/focus-br-snake.mp3",
      "/audio/voice/focus-br-cocoa.mp3",
      "/audio/voice/focus-br-star.mp3",
      "/audio/voice/focus-br-cloud.mp3",
      "/audio/voice/focus-br-bubble.mp3",
      "/audio/voice/focus-lk-yellow.mp3",
      "/audio/voice/focus-lk-round.mp3",
      "/audio/voice/focus-lk-soft.mp3",
      "/audio/voice/focus-lk-green.mp3",
      "/audio/voice/focus-lk-hands.mp3",
      "/audio/voice/focus-lk-quiet.mp3",
      "/audio/voice/focus-lk-sky.mp3",
      "/audio/voice/focus-lk-square.mp3",
      "/audio/voice/focus-fr-wiggle.mp3",
      "/audio/voice/focus-fr-dance.mp3",
      "/audio/voice/focus-fr-hop.mp3",
      "/audio/voice/focus-fr-shake.mp3",
      "/audio/voice/focus-fr-march.mp3",
      "/audio/voice/focus-fr-silly.mp3",
      "/audio/voice/focus-fr-reach.mp3",
      "/audio/voice/focus-fr-spin.mp3",
      "/audio/voice/focus-qt-jar.mp3",
      "/audio/voice/focus-qt-hug.mp3",
      "/audio/voice/focus-qt-blanket.mp3",
      "/audio/voice/focus-qt-window.mp3",
      "/audio/voice/focus-qt-hands.mp3",
      "/audio/voice/focus-qt-breath.mp3",
      "/audio/voice/focus-qt-toes.mp3",
      "/audio/voice/focus-qt-ready.mp3",
      "/audio/voice/focus-steady-hill.mp3",
      "/audio/voice/focus-steady-river.mp3",
      "/audio/voice/focus-steady-snail.mp3",
      "/audio/voice/focus-steady-rainbow.mp3",
      "/audio/voice/focus-steady-bridge.mp3",
      "/audio/voice/focus-steady-zigzag.mp3",
      "/audio/voice/focus-steady-vine.mp3",
      "/audio/voice/focus-steady-heart.mp3",
      "/audio/voice/focus-steady-loop.mp3",
      "/audio/voice/focus-steady-u-turns.mp3",
      "/audio/voice/focus-steady-knot.mp3",
      "/audio/voice/focus-steady-star-path.mp3",
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
      "/audio/voice/jungle-hiss-welcome.mp3",
      "/audio/voice/jungle-frogs-welcome.mp3",
      "/audio/voice/jungle-tracks-welcome.mp3",
      "/audio/voice/jungle-toucan-welcome.mp3",
      "/audio/voice/jungle-eyes-welcome.mp3",
      "/audio/voice/jungle-river-welcome.mp3",
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
      "/audio/voice/ocean-shells-welcome.mp3",
      "/audio/voice/ocean-crab-welcome.mp3",
      "/audio/voice/ocean-turtle-welcome.mp3",
      "/audio/voice/ocean-whale-welcome.mp3",
      "/audio/voice/ocean-livingreef-welcome.mp3",
      "/audio/voice/ocean-schools-welcome.mp3",
      "/audio/voice/dino-prints-welcome.mp3",
      "/audio/voice/dino-plates-welcome.mp3",
      "/audio/voice/dino-glider-welcome.mp3",
      "/audio/voice/dino-mound-welcome.mp3",
      "/audio/voice/dino-hunter-welcome.mp3",
      "/audio/voice/dino-stomp-welcome.mp3",
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
      "/audio/voice/ice-hoprest-welcome.mp3",
      "/audio/voice/ice-clue-hoprest.mp3",
      "/audio/voice/ice-fb-pattern-hop.mp3",
      "/audio/voice/ice-fb-swim.mp3",
      "/audio/voice/ice-fb-rest.mp3",
      "/audio/voice/ice-clue-safari.mp3",
      "/audio/voice/ice-trace-welcome.mp3",
      "/audio/voice/ice-clue-trace.mp3",
      "/audio/voice/ice-slide-welcome.mp3",
      "/audio/voice/ice-clue-slide.mp3",
      "/audio/voice/ice-pack-welcome.mp3",
      "/audio/voice/ice-clue-pack.mp3",
      "/audio/voice/den-area-welcome.mp3",
      "/audio/voice/den-coat-welcome.mp3",
      "/audio/voice/den-clue-coat.mp3",
      "/audio/voice/den-fb-bear.mp3",
      "/audio/voice/den-fb-parrot.mp3",
      "/audio/voice/den-home-welcome.mp3",
      "/audio/voice/den-clue-home.mp3",
      "/audio/voice/den-fb-den.mp3",
      "/audio/voice/den-fb-harbour.mp3",
      "/audio/voice/den-paws-welcome.mp3",
      "/audio/voice/den-clue-paws.mp3",
      "/audio/voice/den-fb-four.mp3",
      "/audio/voice/den-fb-print.mp3",
      "/audio/voice/den-fb-six.mp3",
      "/audio/voice/den-sort-welcome.mp3",
      "/audio/voice/den-clue-sort.mp3",
      "/audio/voice/den-fb-snowcoat.mp3",
      "/audio/voice/den-fb-monkey.mp3",
      "/audio/voice/den-letter-welcome.mp3",
      "/audio/voice/den-clue-letter.mp3",
      "/audio/voice/den-fb-c.mp3",
      "/audio/voice/den-who-welcome.mp3",
      "/audio/voice/den-clue-who.mp3",
      "/audio/voice/den-fb-grown.mp3",
      "/audio/voice/den-fb-cub.mp3",
      "/audio/voice/den-fb-ferry.mp3",
      "/audio/voice/den-prints-welcome.mp3",
      "/audio/voice/den-clue-prints.mp3",
      "/audio/voice/den-fb-trails.mp3",
      "/audio/voice/den-door-welcome.mp3",
      "/audio/voice/den-clue-door.mp3",
      "/audio/voice/den-fb-circle.mp3",
      "/audio/voice/den-fb-star.mp3",
      "/audio/voice/den-fb-triangle.mp3",
      "/audio/voice/den-memory-welcome.mp3",
      "/audio/voice/den-clue-memory.mp3",
      "/audio/voice/den-clap-welcome.mp3",
      "/audio/voice/den-clue-clap.mp3",
      "/audio/voice/den-pet-welcome.mp3",
      "/audio/voice/den-clue-pet.mp3",
      "/audio/voice/light-area-welcome.mp3",
      "/audio/voice/light-ribbon-welcome.mp3",
      "/audio/voice/light-clue-ribbon.mp3",
      "/audio/voice/light-fb-green.mp3",
      "/audio/voice/light-fb-brown.mp3",
      "/audio/voice/light-fb-grey.mp3",
      "/audio/voice/light-mix-welcome.mp3",
      "/audio/voice/light-clue-mix.mp3",
      "/audio/voice/light-fb-mixgreen.mp3",
      "/audio/voice/light-fb-red.mp3",
      "/audio/voice/light-fb-black.mp3",
      "/audio/voice/light-stars-welcome.mp3",
      "/audio/voice/light-clue-stars.mp3",
      "/audio/voice/light-fb-eight.mp3",
      "/audio/voice/light-fb-band.mp3",
      "/audio/voice/light-pulse-welcome.mp3",
      "/audio/voice/light-fb-fade.mp3",
      "/audio/voice/light-letter-welcome.mp3",
      "/audio/voice/light-clue-letter.mp3",
      "/audio/voice/light-fb-s.mp3",
      "/audio/voice/light-fb-t.mp3",
      "/audio/voice/light-fb-r.mp3",
      "/audio/voice/light-sky-welcome.mp3",
      "/audio/voice/light-clue-sky.mp3",
      "/audio/voice/light-fb-ribbon.mp3",
      "/audio/voice/light-fb-seal.mp3",
      "/audio/voice/light-sparks-welcome.mp3",
      "/audio/voice/light-clue-sparks.mp3",
      "/audio/voice/light-fb-seven.mp3",
      "/audio/voice/light-fb-bands.mp3",
      "/audio/voice/light-watch-welcome.mp3",
      "/audio/voice/light-clue-watch.mp3",
      "/audio/voice/light-fb-hill.mp3",
      "/audio/voice/light-fb-thin.mp3",
      "/audio/voice/light-fb-oven.mp3",
      "/audio/voice/light-balloon-welcome.mp3",
      "/audio/voice/light-clue-balloon.mp3",
      "/audio/voice/light-rhyme-welcome.mp3",
      "/audio/voice/light-clue-rhyme.mp3",
      "/audio/voice/seal-area-welcome.mp3",
      "/audio/voice/seal-clap-welcome.mp3",
      "/audio/voice/seal-clue-clap.mp3",
      "/audio/voice/seal-fb-seal.mp3",
      "/audio/voice/seal-fb-hen.mp3",
      "/audio/voice/seal-fb-crane.mp3",
      "/audio/voice/seal-bark-welcome.mp3",
      "/audio/voice/seal-clue-bark.mp3",
      "/audio/voice/seal-fb-bark.mp3",
      "/audio/voice/seal-fb-dog.mp3",
      "/audio/voice/seal-fb-owl.mp3",
      "/audio/voice/seal-sort-welcome.mp3",
      "/audio/voice/seal-clue-sort.mp3",
      "/audio/voice/seal-fb-rest.mp3",
      "/audio/voice/seal-shells-welcome.mp3",
      "/audio/voice/seal-clue-shells.mp3",
      "/audio/voice/seal-fb-five.mp3",
      "/audio/voice/seal-fb-eight.mp3",
      "/audio/voice/seal-letter-welcome.mp3",
      "/audio/voice/seal-clue-letter.mp3",
      "/audio/voice/seal-fb-s.mp3",
      "/audio/voice/seal-fb-c.mp3",
      "/audio/voice/seal-fb-t.mp3",
      "/audio/voice/seal-rocks-welcome.mp3",
      "/audio/voice/seal-clue-rocks.mp3",
      "/audio/voice/seal-fb-rocks.mp3",
      "/audio/voice/seal-home-welcome.mp3",
      "/audio/voice/seal-clue-home.mp3",
      "/audio/voice/seal-fb-sea.mp3",
      "/audio/voice/seal-fb-attic.mp3",
      "/audio/voice/seal-fb-desert.mp3",
      "/audio/voice/seal-rhyme-welcome.mp3",
      "/audio/voice/seal-clue-rhyme.mp3",
      "/audio/voice/seal-fb-sock.mp3",
      "/audio/voice/seal-fb-norhyme-seal.mp3",
      "/audio/voice/seal-fb-norhyme-fish.mp3",
      "/audio/voice/seal-bubble-welcome.mp3",
      "/audio/voice/seal-clue-bubble.mp3",
      "/audio/voice/seal-toss-welcome.mp3",
      "/audio/voice/seal-clue-toss.mp3",
      "/audio/voice/bed-area-welcome.mp3",
      "/audio/voice/bed-sleep-welcome.mp3",
      "/audio/voice/bed-clue-sleep.mp3",
      "/audio/voice/bed-fb-sleep.mp3",
      "/audio/voice/bed-fb-run.mp3",
      "/audio/voice/bed-fb-drums.mp3",
      "/audio/voice/bed-teddies-welcome.mp3",
      "/audio/voice/bed-clue-teddies.mp3",
      "/audio/voice/bed-fb-three.mp3",
      "/audio/voice/bed-fb-quilt.mp3",
      "/audio/voice/bed-fb-six.mp3",
      "/audio/voice/bed-shelf-welcome.mp3",
      "/audio/voice/bed-clue-shelf.mp3",
      "/audio/voice/bed-fb-book.mp3",
      "/audio/voice/bed-fb-trumpet.mp3",
      "/audio/voice/bed-letter-welcome.mp3",
      "/audio/voice/bed-clue-letter.mp3",
      "/audio/voice/bed-fb-b.mp3",
      "/audio/voice/bed-fb-d.mp3",
      "/audio/voice/bed-fb-p.mp3",
      "/audio/voice/bed-lullaby-welcome.mp3",
      "/audio/voice/bed-clue-lullaby.mp3",
      "/audio/voice/bed-fb-soft.mp3",
      "/audio/voice/bed-fb-crash.mp3",
      "/audio/voice/bed-who-welcome.mp3",
      "/audio/voice/bed-clue-who.mp3",
      "/audio/voice/bed-fb-nana.mp3",
      "/audio/voice/bed-fb-pip.mp3",
      "/audio/voice/bed-fb-owl.mp3",
      "/audio/voice/bed-dim-welcome.mp3",
      "/audio/voice/bed-fb-flash.mp3",
      "/audio/voice/bed-fb-bright.mp3",
      "/audio/voice/bed-window-welcome.mp3",
      "/audio/voice/bed-clue-window.mp3",
      "/audio/voice/bed-fb-rect.mp3",
      "/audio/voice/bed-fb-circle.mp3",
      "/audio/voice/bed-fb-star.mp3",
      "/audio/voice/bed-memory-welcome.mp3",
      "/audio/voice/bed-clue-memory.mp3",
      "/audio/voice/bed-tuck-welcome.mp3",
      "/audio/voice/bed-clue-tuck.mp3",
      "/audio/voice/owl-area-welcome.mp3",
      "/audio/voice/star-area-welcome.mp3",
      "/audio/voice/porch-area-welcome.mp3",
      "/audio/voice/owl-who-welcome.mp3",
      "/audio/voice/owl-clue-who.mp3",
      "/audio/voice/owl-fb-owl.mp3",
      "/audio/voice/owl-fb-duck.mp3",
      "/audio/voice/owl-fb-bus.mp3",
      "/audio/voice/owl-home-welcome.mp3",
      "/audio/voice/owl-clue-home.mp3",
      "/audio/voice/owl-fb-tree.mp3",
      "/audio/voice/owl-fb-fridge.mp3",
      "/audio/voice/owl-eyes-welcome.mp3",
      "/audio/voice/owl-clue-eyes.mp3",
      "/audio/voice/owl-fb-two.mp3",
      "/audio/voice/owl-fb-one.mp3",
      "/audio/voice/owl-fb-five.mp3",
      "/audio/voice/owl-night-welcome.mp3",
      "/audio/voice/owl-clue-night.mp3",
      "/audio/voice/owl-fb-hunt.mp3",
      "/audio/voice/owl-fb-bee.mp3",
      "/audio/voice/owl-letter-welcome.mp3",
      "/audio/voice/owl-clue-letter.mp3",
      "/audio/voice/owl-fb-o.mp3",
      "/audio/voice/owl-fb-a.mp3",
      "/audio/voice/owl-fb-u.mp3",
      "/audio/voice/owl-last-welcome.mp3",
      "/audio/voice/owl-clue-last.mp3",
      "/audio/voice/owl-fb-deep.mp3",
      "/audio/voice/owl-fb-small.mp3",
      "/audio/voice/owl-fb-ferry.mp3",
      "/audio/voice/owl-pines-welcome.mp3",
      "/audio/voice/owl-clue-pines.mp3",
      "/audio/voice/owl-rhyme-welcome.mp3",
      "/audio/voice/owl-clue-rhyme.mp3",
      "/audio/voice/owl-fb-rhyme.mp3",
      "/audio/voice/owl-fb-owl-rhyme.mp3",
      "/audio/voice/owl-fb-wood.mp3",
      "/audio/voice/owl-clue-safari.mp3",
      "/audio/voice/owl-hoot-welcome.mp3",
      "/audio/voice/owl-clue-hoot.mp3",
      "/audio/voice/owl-trace-welcome.mp3",
      "/audio/voice/owl-clue-trace.mp3",
      "/audio/voice/owl-rhyme-hoot.mp3",
      "/audio/voice/star-clue-nine.mp3",
      "/audio/voice/star-fb-nine.mp3",
      "/audio/voice/star-fb-four.mp3",
      "/audio/voice/star-fb-twelve.mp3",
      "/audio/voice/star-moon-welcome.mp3",
      "/audio/voice/star-clue-moon.mp3",
      "/audio/voice/star-fb-moon.mp3",
      "/audio/voice/star-fb-orange.mp3",
      "/audio/voice/star-shape-welcome.mp3",
      "/audio/voice/star-clue-shape.mp3",
      "/audio/voice/star-fb-circle.mp3",
      "/audio/voice/star-fb-square.mp3",
      "/audio/voice/star-plus-welcome.mp3",
      "/audio/voice/star-clue-plus.mp3",
      "/audio/voice/star-fb-plus.mp3",
      "/audio/voice/star-fb-five.mp3",
      "/audio/voice/star-twinkle-welcome.mp3",
      "/audio/voice/star-clue-twinkle.mp3",
      "/audio/voice/star-fb-drum.mp3",
      "/audio/voice/star-fb-twinkle.mp3",
      "/audio/voice/star-sit-welcome.mp3",
      "/audio/voice/star-clue-sit.mp3",
      "/audio/voice/star-fb-rail.mp3",
      "/audio/voice/star-fb-kettle.mp3",
      "/audio/voice/star-fb-shoe.mp3",
      "/audio/voice/star-sky-welcome.mp3",
      "/audio/voice/star-clue-sky.mp3",
      "/audio/voice/star-fb-star.mp3",
      "/audio/voice/star-fb-spoon.mp3",
      "/audio/voice/star-memory-welcome.mp3",
      "/audio/voice/star-clue-memory.mp3",
      "/audio/voice/star-hang-welcome.mp3",
      "/audio/voice/star-clue-hang.mp3",
      "/audio/voice/star-shadow-welcome.mp3",
      "/audio/voice/star-clue-shadow.mp3",
      "/audio/voice/porch-who-welcome.mp3",
      "/audio/voice/porch-clue-who.mp3",
      "/audio/voice/porch-fb-moth.mp3",
      "/audio/voice/porch-clue-count.mp3",
      "/audio/voice/porch-fb-five.mp3",
      "/audio/voice/porch-fb-eight.mp3",
      "/audio/voice/porch-sort-welcome.mp3",
      "/audio/voice/porch-clue-sort.mp3",
      "/audio/voice/porch-fb-sortmoth.mp3",
      "/audio/voice/porch-fb-penguin.mp3",
      "/audio/voice/porch-fb-loaf.mp3",
      "/audio/voice/porch-fb-n.mp3",
      "/audio/voice/porch-fb-p.mp3",
      "/audio/voice/porch-plus-welcome.mp3",
      "/audio/voice/porch-clue-plus.mp3",
      "/audio/voice/porch-fb-two.mp3",
      "/audio/voice/porch-nana-welcome.mp3",
      "/audio/voice/porch-clue-nana.mp3",
      "/audio/voice/porch-fb-watch.mp3",
      "/audio/voice/porch-fb-catch.mp3",
      "/audio/voice/porch-fb-shout.mp3",
      "/audio/voice/porch-circle-welcome.mp3",
      "/audio/voice/porch-clue-circle.mp3",
      "/audio/voice/porch-fb-drum.mp3",
      "/audio/voice/porch-fb-circle.mp3",
      "/audio/voice/porch-rhyme-welcome.mp3",
      "/audio/voice/porch-clue-rhyme.mp3",
      "/audio/voice/porch-fb-night.mp3",
      "/audio/voice/porch-fb-moth-rhyme.mp3",
      "/audio/voice/porch-fb-porch.mp3",
      "/audio/voice/porch-balloon-welcome.mp3",
      "/audio/voice/porch-clue-balloon.mp3",
      "/audio/voice/forest-clue-bird.mp3",
      "/audio/voice/forest-clue-pinecones.mp3",
      "/audio/voice/forest-clue-balloons.mp3",
      "/audio/voice/forest-clue-campfire.mp3",
      "/audio/voice/forest-clue-trace.mp3",
      "/audio/voice/forest-hoot-welcome.mp3",
      "/audio/voice/forest-clue-hoot.mp3",
      "/audio/voice/forest-fb-hoot.mp3",
      "/audio/voice/forest-fb-fox.mp3",
      "/audio/voice/forest-fb-bee.mp3",
      "/audio/voice/forest-caps-welcome.mp3",
      "/audio/voice/forest-clue-caps.mp3",
      "/audio/voice/forest-fb-seven.mp3",
      "/audio/voice/forest-fb-three.mp3",
      "/audio/voice/forest-fb-ten.mp3",
      "/audio/voice/forest-hooves-welcome.mp3",
      "/audio/voice/forest-clue-hooves.mp3",
      "/audio/voice/forest-fb-deer.mp3",
      "/audio/voice/forest-fb-paws.mp3",
      "/audio/voice/forest-fb-web.mp3",
      "/audio/voice/forest-oak-welcome.mp3",
      "/audio/voice/forest-clue-oak.mp3",
      "/audio/voice/forest-fb-squirrel.mp3",
      "/audio/voice/forest-fb-whale.mp3",
      "/audio/voice/forest-fb-hen.mp3",
      "/audio/voice/forest-path-welcome.mp3",
      "/audio/voice/forest-clue-path.mp3",
      "/audio/voice/forest-fb-boot.mp3",
      "/audio/voice/forest-fb-trout.mp3",
      "/audio/voice/forest-fb-kite.mp3",
      "/audio/voice/forest-jay-welcome.mp3",
      "/audio/voice/forest-clue-jay.mp3",
      "/audio/voice/forest-fb-six.mp3",
      "/audio/voice/forest-fb-away.mp3",
      "/audio/voice/forest-fb-jaytwo.mp3",
      "/audio/voice/weather-clue-rain.mp3",
      "/audio/voice/weather-clue-sun.mp3",
      "/audio/voice/weather-clue-porch.mp3",
      "/audio/voice/weather-clue-puddle.mp3",
      "/audio/voice/weather-chimes-welcome.mp3",
      "/audio/voice/weather-clue-chimes.mp3",
      "/audio/voice/weather-fb-wind.mp3",
      "/audio/voice/weather-fb-snow.mp3",
      "/audio/voice/weather-fb-night.mp3",
      "/audio/voice/weather-puddles-welcome.mp3",
      "/audio/voice/weather-clue-count.mp3",
      "/audio/voice/weather-fb-five.mp3",
      "/audio/voice/weather-fb-one.mp3",
      "/audio/voice/weather-fb-eight.mp3",
      "/audio/voice/weather-frost-welcome.mp3",
      "/audio/voice/weather-clue-frost.mp3",
      "/audio/voice/weather-fb-frost.mp3",
      "/audio/voice/weather-fb-jam.mp3",
      "/audio/voice/weather-fb-sand.mp3",
      "/audio/voice/weather-shade-welcome.mp3",
      "/audio/voice/weather-clue-shade.mp3",
      "/audio/voice/weather-fb-shade.mp3",
      "/audio/voice/weather-fb-lamp.mp3",
      "/audio/voice/weather-fb-fish.mp3",
      "/audio/voice/weather-nests-welcome.mp3",
      "/audio/voice/weather-clue-nests.mp3",
      "/audio/voice/weather-fb-spring.mp3",
      "/audio/voice/weather-fb-winter.mp3",
      "/audio/voice/weather-fb-drawer.mp3",
      "/audio/voice/weather-storm-welcome.mp3",
      "/audio/voice/weather-clue-storm.mp3",
      "/audio/voice/weather-fb-kit.mp3",
      "/audio/voice/weather-fb-sledge.mp3",
      "/audio/voice/weather-fb-fan.mp3",
      "/audio/voice/space-clue-launch.mp3",
      "/audio/voice/space-clue-stars.mp3",
      "/audio/voice/space-clue-story.mp3",
      "/audio/voice/space-clue-picnic.mp3",
      "/audio/voice/space-ports-welcome.mp3",
      "/audio/voice/space-clue-ports.mp3",
      "/audio/voice/space-fb-eight.mp3",
      "/audio/voice/space-fb-three.mp3",
      "/audio/voice/space-fb-twelve.mp3",
      "/audio/voice/space-cabin-welcome.mp3",
      "/audio/voice/space-clue-cabin.mp3",
      "/audio/voice/space-fb-helmet.mp3",
      "/audio/voice/space-fb-tree.mp3",
      "/audio/voice/space-fb-cow.mp3",
      "/audio/voice/space-beep-welcome.mp3",
      "/audio/voice/space-clue-beep.mp3",
      "/audio/voice/space-fb-beep.mp3",
      "/audio/voice/space-fb-moo.mp3",
      "/audio/voice/space-fb-splash.mp3",
      "/audio/voice/space-dust-welcome.mp3",
      "/audio/voice/space-clue-dust.mp3",
      "/audio/voice/space-fb-astronaut.mp3",
      "/audio/voice/space-fb-duck.mp3",
      "/audio/voice/space-fb-crab.mp3",
      "/audio/voice/space-fuel-welcome.mp3",
      "/audio/voice/space-clue-fuel.mp3",
      "/audio/voice/space-fb-seven.mp3",
      "/audio/voice/space-fb-thirteen.mp3",
      "/audio/voice/space-fb-used.mp3",
      "/audio/voice/space-dots-welcome.mp3",
      "/audio/voice/space-clue-dots.mp3",
      "/audio/voice/space-fb-starsline.mp3",
      "/audio/voice/space-fb-bees.mp3",
      "/audio/voice/space-fb-buttons.mp3",
      "/audio/voice/treasure-clue-key.mp3",
      "/audio/voice/treasure-clue-bubbles.mp3",
      "/audio/voice/treasure-coins-welcome.mp3",
      "/audio/voice/treasure-clue-coins.mp3",
      "/audio/voice/treasure-fb-nine.mp3",
      "/audio/voice/treasure-fb-four.mp3",
      "/audio/voice/treasure-fb-twelve.mp3",
      "/audio/voice/treasure-x-welcome.mp3",
      "/audio/voice/treasure-clue-x.mp3",
      "/audio/voice/treasure-fb-palm.mp3",
      "/audio/voice/treasure-fb-kitchen.mp3",
      "/audio/voice/treasure-fb-moonx.mp3",
      "/audio/voice/treasure-chest-welcome.mp3",
      "/audio/voice/treasure-clue-chest.mp3",
      "/audio/voice/treasure-fb-mapdry.mp3",
      "/audio/voice/treasure-fb-waves.mp3",
      "/audio/voice/treasure-fb-crabs.mp3",
      "/audio/voice/treasure-keyhole-welcome.mp3",
      "/audio/voice/treasure-clue-keyhole.mp3",
      "/audio/voice/treasure-fb-roundkey.mp3",
      "/audio/voice/treasure-fb-starkey.mp3",
      "/audio/voice/treasure-fb-jam.mp3",
      "/audio/voice/treasure-gems-welcome.mp3",
      "/audio/voice/treasure-clue-gems.mp3",
      "/audio/voice/treasure-fb-pouches.mp3",
      "/audio/voice/treasure-parrot-welcome.mp3",
      "/audio/voice/treasure-clue-parrot.mp3",
      "/audio/voice/treasure-fb-mast.mp3",
      "/audio/voice/treasure-fb-ovens.mp3",
      "/audio/voice/treasure-fb-shipshout.mp3",
      "/audio/voice/treasure-flag-welcome.mp3",
      "/audio/voice/treasure-clue-flag.mp3",
      "/audio/voice/treasure-fb-black.mp3",
      "/audio/voice/treasure-fb-green.mp3",
      "/audio/voice/treasure-fb-redjust.mp3",
      "/audio/voice/color-berry-welcome.mp3",
      "/audio/voice/color-clue-berry.mp3",
      "/audio/voice/color-fb-purple.mp3",
      "/audio/voice/color-fb-yellowpaints.mp3",
      "/audio/voice/color-fb-toast.mp3",
      "/audio/voice/color-leaf-welcome.mp3",
      "/audio/voice/color-clue-leaf.mp3",
      "/audio/voice/color-fb-leafgreen.mp3",
      "/audio/voice/color-fb-redmix.mp3",
      "/audio/voice/color-fb-white.mp3",
      "/audio/voice/color-warm-welcome.mp3",
      "/audio/voice/color-clue-warm.mp3",
      "/audio/voice/color-fb-orangewarm.mp3",
      "/audio/voice/color-fb-iceblue.mp3",
      "/audio/voice/color-fb-leafshade.mp3",
      "/audio/voice/color-pots-welcome.mp3",
      "/audio/voice/color-clue-pots.mp3",
      "/audio/voice/color-fb-sixpots.mp3",
      "/audio/voice/color-fb-bench.mp3",
      "/audio/voice/color-shadow-welcome.mp3",
      "/audio/voice/color-clue-shadow.mp3",
      "/audio/voice/color-fb-darker.mp3",
      "/audio/voice/color-fb-notblue.mp3",
      "/audio/voice/color-fb-stillthere.mp3",
      "/audio/voice/color-dots-welcome.mp3",
      "/audio/voice/color-clue-dots.mp3",
      "/audio/voice/color-fb-yellowdot.mp3",
      "/audio/voice/color-fb-bluedot.mp3",
      "/audio/voice/music-bells-welcome.mp3",
      "/audio/voice/music-clue-bells.mp3",
      "/audio/voice/music-fb-fivebells.mp3",
      "/audio/voice/music-fb-wholerow.mp3",
      "/audio/voice/music-fb-noteight.mp3",
      "/audio/voice/music-quiet-welcome.mp3",
      "/audio/voice/music-clue-quiet.mp3",
      "/audio/voice/music-fb-matchquiet.mp3",
      "/audio/voice/music-fb-hidebird.mp3",
      "/audio/voice/music-fb-shouting.mp3",
      "/audio/voice/music-clap-welcome.mp3",
      "/audio/voice/music-clue-clap.mp3",
      "/audio/voice/music-fb-clapnext.mp3",
      "/audio/voice/music-fb-notstomps.mp3",
      "/audio/voice/music-fb-claprest.mp3",
      "/audio/voice/music-high-welcome.mp3",
      "/audio/voice/music-clue-high.mp3",
      "/audio/voice/music-fb-highbranch.mp3",
      "/audio/voice/music-fb-frogpond.mp3",
      "/audio/voice/music-fb-notdrum.mp3",
      "/audio/voice/music-keep-welcome.mp3",
      "/audio/voice/music-clue-keep.mp3",
      "/audio/voice/music-fb-keeptime.mp3",
      "/audio/voice/music-fb-nothrow.mp3",
      "/audio/voice/music-fb-stayplay.mp3",
      "/audio/voice/music-who-welcome.mp3",
      "/audio/voice/music-fb-nanalast.mp3",
      "/audio/voice/music-fb-pipfirst.mp3",
      "/audio/voice/music-fb-nodog.mp3",
      "/audio/voice/music-pond-welcome.mp3",
      "/audio/voice/music-clue-pond.mp3",
      "/audio/voice/music-fb-lowboom.mp3",
      "/audio/voice/music-fb-bellstinkle.mp3",
      "/audio/voice/music-fb-whistles.mp3",
      "/audio/voice/pattern-abc-welcome.mp3",
      "/audio/voice/pattern-clue-abc.mp3",
      "/audio/voice/pattern-fb-abcgreen.mp3",
      "/audio/voice/pattern-fb-yellowchain.mp3",
      "/audio/voice/pattern-fb-redset.mp3",
      "/audio/voice/pattern-grow-welcome.mp3",
      "/audio/voice/pattern-fb-growbig.mp3",
      "/audio/voice/pattern-fb-tiny.mp3",
      "/audio/voice/pattern-fb-smallago.mp3",
      "/audio/voice/pattern-pegs-welcome.mp3",
      "/audio/voice/pattern-clue-pegs.mp3",
      "/audio/voice/pattern-fb-eightpegs.mp3",
      "/audio/voice/pattern-circles-welcome.mp3",
      "/audio/voice/pattern-clue-circles.mp3",
      "/audio/voice/pattern-fb-circle.mp3",
      "/audio/voice/pattern-fb-squares.mp3",
      "/audio/voice/pattern-fb-triangles.mp3",
      "/audio/voice/pattern-odd-welcome.mp3",
      "/audio/voice/pattern-clue-odd.mp3",
      "/audio/voice/pattern-fb-bluebreaks.mp3",
      "/audio/voice/pattern-fb-redsmatch.mp3",
      "/audio/voice/pattern-fb-aboutbeads.mp3",
      "/audio/voice/pattern-stamp-welcome.mp3",
      "/audio/voice/pattern-clue-stamp.mp3",
      "/audio/voice/pattern-fb-moonab.mp3",
      "/audio/voice/pattern-fb-sunstamp.mp3",
      "/audio/voice/pattern-fb-starjust.mp3",
      "/audio/voice/pattern-pegtwo-welcome.mp3",
      "/audio/voice/pattern-clue-pegtwo.mp3",
      "/audio/voice/pattern-fb-addgroups.mp3",
      "/audio/voice/sticker-stars-welcome.mp3",
      "/audio/voice/sticker-clue-stars.mp3",
      "/audio/voice/sticker-fb-tenstars.mp3",
      "/audio/voice/sticker-fb-wholepage.mp3",
      "/audio/voice/sticker-fb-toten.mp3",
      "/audio/voice/sticker-sky-welcome.mp3",
      "/audio/voice/sticker-clue-sky.mp3",
      "/audio/voice/sticker-fb-moon.mp3",
      "/audio/voice/sticker-fb-boots.mp3",
      "/audio/voice/sticker-fb-soup.mp3",
      "/audio/voice/sticker-points-welcome.mp3",
      "/audio/voice/sticker-clue-points.mp3",
      "/audio/voice/sticker-fb-triangles.mp3",
      "/audio/voice/sticker-fb-round.mp3",
      "/audio/voice/sticker-fb-flattops.mp3",
      "/audio/voice/sticker-row-welcome.mp3",
      "/audio/voice/sticker-fb-abstar.mp3",
      "/audio/voice/sticker-fb-tree.mp3",
      "/audio/voice/sticker-fb-heartjust.mp3",
      "/audio/voice/sticker-place-welcome.mp3",
      "/audio/voice/sticker-clue-place.mp3",
      "/audio/voice/sticker-fb-fishpond.mp3",
      "/audio/voice/sticker-fb-notsky.mp3",
      "/audio/voice/sticker-fb-inthebook.mp3",
      "/audio/voice/sticker-sheets-welcome.mp3",
      "/audio/voice/sticker-clue-sheets.mp3",
      "/audio/voice/sticker-fb-seven.mp3",
      "/audio/voice/sticker-fb-bothsheets.mp3",
      "/audio/voice/sticker-clue-sss.mp3",
      "/audio/voice/sticker-fb-treet.mp3",
      "/audio/voice/sticker-fb-balloon.mp3",
      "/audio/voice/barn-gate-welcome.mp3",
      "/audio/voice/barn-clue-gate.mp3",
      "/audio/voice/barn-fb-pipopened.mp3",
      "/audio/voice/barn-fb-lambtrot.mp3",
      "/audio/voice/barn-fb-noowl.mp3",
      "/audio/voice/barn-egg-welcome.mp3",
      "/audio/voice/barn-clue-egg.mp3",
      "/audio/voice/barn-fb-basket.mp3",
      "/audio/voice/barn-fb-notboot.mp3",
      "/audio/voice/barn-piglets-welcome.mp3",
      "/audio/voice/barn-clue-piglets.mp3",
      "/audio/voice/barn-fb-threepiglets.mp3",
      "/audio/voice/barn-fb-namedthree.mp3",
      "/audio/voice/barn-fb-notsix.mp3",
      "/audio/voice/barn-fb-firstcrow.mp3",
      "/audio/voice/barn-fb-notstory.mp3",
      "/audio/voice/barn-true-welcome.mp3",
      "/audio/voice/barn-next-welcome.mp3",
      "/audio/voice/barn-clue-next.mp3",
      "/audio/voice/barn-clue-true.mp3",
      "/audio/voice/barn-fb-trueintale.mp3",
      "/audio/voice/barn-fb-notintale.mp3",
      "/audio/voice/barn-fb-notthisfarm.mp3",
      "/audio/voice/barn-hen-welcome.mp3",
      "/audio/voice/barn-clue-hen.mp3",
      "/audio/voice/barn-fb-henpen.mp3",
      "/audio/voice/barn-fb-cowrhyme.mp3",
      "/audio/voice/barn-fb-barnrhyme.mp3",
      "/audio/voice/barn-why-welcome.mp3",
      "/audio/voice/barn-clue-why.mp3",
      "/audio/voice/barn-fb-clover.mp3",
      "/audio/voice/barn-fb-nothiding.mp3",
      "/audio/voice/space-waved-welcome.mp3",
      "/audio/voice/space-fb-moonfirst.mp3",
      "/audio/voice/space-fb-pipback.mp3",
      "/audio/voice/space-fb-nocow.mp3",
      "/audio/voice/space-sock-welcome.mp3",
      "/audio/voice/space-clue-sock.mp3",
      "/audio/voice/space-fb-antenna.mp3",
      "/audio/voice/space-fb-notcrater.mp3",
      "/audio/voice/space-fb-notthistale.mp3",
      "/audio/voice/space-fourbeeps-welcome.mp3",
      "/audio/voice/space-clue-fourbeeps.mp3",
      "/audio/voice/space-fb-fourbeeps.mp3",
      "/audio/voice/space-fb-saidfour.mp3",
      "/audio/voice/space-fb-notnine.mp3",
      "/audio/voice/space-helmet-welcome.mp3",
      "/audio/voice/space-clue-helmet.mp3",
      "/audio/voice/space-fb-silver.mp3",
      "/audio/voice/space-fb-notgreen.mp3",
      "/audio/voice/space-fb-notpink.mp3",
      "/audio/voice/space-blink-welcome.mp3",
      "/audio/voice/space-clue-blink.mp3",
      "/audio/voice/space-fb-blink.mp3",
      "/audio/voice/space-fb-blinks.mp3",
      "/audio/voice/space-fb-staycode.mp3",
      "/audio/voice/space-sleep-welcome.mp3",
      "/audio/voice/space-clue-sleep.mp3",
      "/audio/voice/space-fb-incabin.mp3",
      "/audio/voice/space-why-welcome.mp3",
      "/audio/voice/space-clue-why.mp3",
      "/audio/voice/space-fb-warm.mp3",
      "/audio/voice/space-fb-notspacetale.mp3",
      "/audio/voice/space-fb-nofish.mp3",
      "/audio/voice/ocean-lamp-welcome.mp3",
      "/audio/voice/ocean-clue-lamp.mp3",
      "/audio/voice/ocean-fb-angler.mp3",
      "/audio/voice/ocean-fb-crabclapped.mp3",
      "/audio/voice/ocean-fb-nohen.mp3",
      "/audio/voice/ocean-pearl-welcome.mp3",
      "/audio/voice/ocean-clue-pearl.mp3",
      "/audio/voice/ocean-fb-pinkshell.mp3",
      "/audio/voice/ocean-fb-notseale.mp3",
      "/audio/voice/ocean-sixbubbles-welcome.mp3",
      "/audio/voice/ocean-clue-sixbubbles.mp3",
      "/audio/voice/ocean-fb-sixbubbles.mp3",
      "/audio/voice/ocean-fb-saidsix.mp3",
      "/audio/voice/ocean-fishleave-welcome.mp3",
      "/audio/voice/ocean-clue-fishleave.mp3",
      "/audio/voice/ocean-fb-fiveonefour.mp3",
      "/audio/voice/ocean-fb-oneleft.mp3",
      "/audio/voice/ocean-fb-wholeft.mp3",
      "/audio/voice/ocean-why-welcome.mp3",
      "/audio/voice/ocean-clue-why.mp3",
      "/audio/voice/ocean-fb-lampdark.mp3",
      "/audio/voice/ocean-fb-notreason.mp3",
      "/audio/voice/ocean-shell-welcome.mp3",
      "/audio/voice/ocean-clue-shell.mp3",
      "/audio/voice/ocean-fb-shellwell.mp3",
      "/audio/voice/ocean-fb-fishrhyme.mp3",
      "/audio/voice/ocean-fb-waverhyme.mp3",
      "/audio/voice/ocean-whyshell-welcome.mp3",
      "/audio/voice/ocean-clue-whyshell.mp3",
      "/audio/voice/ocean-fb-shellsafe.mp3",
      "/audio/voice/ocean-fb-notsunbath.mp3",
      "/audio/voice/phonics-m-welcome.mp3",
      "/audio/voice/phonics-clue-m.mp3",
      "/audio/voice/phonics-fb-moonm.mp3",
      "/audio/voice/phonics-fb-ssun.mp3",
      "/audio/voice/phonics-p-welcome.mp3",
      "/audio/voice/phonics-clue-p.mp3",
      "/audio/voice/phonics-fb-pipp.mp3",
      "/audio/voice/phonics-fb-bcousin.mp3",
      "/audio/voice/phonics-st-welcome.mp3",
      "/audio/voice/phonics-clue-st.mp3",
      "/audio/voice/phonics-fb-stemst.mp3",
      "/audio/voice/phonics-fb-brbread.mp3",
      "/audio/voice/phonics-fb-flflag.mp3",
      "/audio/voice/phonics-bug-welcome.mp3",
      "/audio/voice/phonics-clue-bug.mp3",
      "/audio/voice/phonics-fb-bugrug.mp3",
      "/audio/voice/phonics-fb-beerhyme.mp3",
      "/audio/voice/phonics-fb-leafrhyme.mp3",
      "/audio/voice/phonics-sun-welcome.mp3",
      "/audio/voice/phonics-clue-sun.mp3",
      "/audio/voice/phonics-fb-sunsss.mp3",
      "/audio/voice/phonics-fb-nlast.mp3",
      "/audio/voice/phonics-fb-umiddle.mp3",
      "/audio/voice/phonics-sunletters-welcome.mp3",
      "/audio/voice/phonics-clue-sunletters.mp3",
      "/audio/voice/phonics-fb-sunspell.mp3",
      "/audio/voice/phonics-fb-therearethree.mp3",
      "/audio/voice/grove-eight-welcome.mp3",
      "/audio/voice/grove-clue-eight.mp3",
      "/audio/voice/grove-fb-eightpebbles.mp3",
      "/audio/voice/grove-fb-countdish.mp3",
      "/audio/voice/grove-fullten-welcome.mp3",
      "/audio/voice/grove-clue-fullten.mp3",
      "/audio/voice/grove-fb-fullten.mp3",
      "/audio/voice/grove-fb-wholeframe.mp3",
      "/audio/voice/grove-fb-fivehalf.mp3",
      "/audio/voice/grove-leftover-welcome.mp3",
      "/audio/voice/grove-clue-leftover.mp3",
      "/audio/voice/grove-fb-onetenfour.mp3",
      "/audio/voice/grove-fb-fourteenwhole.mp3",
      "/audio/voice/grove-fb-afterten.mp3",
      "/audio/voice/grove-twodishes-welcome.mp3",
      "/audio/voice/grove-clue-twodishes.mp3",
      "/audio/voice/grove-fb-sixone.mp3",
      "/audio/voice/grove-fb-addedone.mp3",
      "/audio/voice/grove-squirrel-welcome.mp3",
      "/audio/voice/grove-clue-squirrel.mp3",
      "/audio/voice/grove-fb-ninetake4.mp3",
      "/audio/voice/grove-fb-taken.mp3",
      "/audio/voice/grove-fb-whattaken.mp3",
      "/audio/voice/grove-more-welcome.mp3",
      "/audio/voice/grove-clue-more.mp3",
      "/audio/voice/grove-fb-sevenmore.mp3",
      "/audio/voice/grove-fb-threefewer.mp3",
      "/audio/voice/grove-fb-notsame.mp3",
      "/audio/voice/grove-pairs-welcome.mp3",
      "/audio/voice/grove-clue-pairs.mp3",
      "/audio/voice/grove-fb-twopairs.mp3",
      "/audio/voice/grove-fb-foursocks.mp3",
      "/audio/voice/grove-fb-toomany.mp3",
      "/audio/voice/shapes-square-welcome.mp3",
      "/audio/voice/shapes-clue-square.mp3",
      "/audio/voice/shapes-fb-squarewindow.mp3",
      "/audio/voice/shapes-fb-nocorners.mp3",
      "/audio/voice/shapes-roof-welcome.mp3",
      "/audio/voice/shapes-clue-roof.mp3",
      "/audio/voice/shapes-fb-triangleroof.mp3",
      "/audio/voice/shapes-fb-foursides.mp3",
      "/audio/voice/shapes-fb-circlesround.mp3",
      "/audio/voice/shapes-well-welcome.mp3",
      "/audio/voice/shapes-clue-well.mp3",
      "/audio/voice/shapes-fb-acircle.mp3",
      "/audio/voice/shapes-fb-rectlong.mp3",
      "/audio/voice/shapes-corners-welcome.mp3",
      "/audio/voice/shapes-fb-fourcorners.mp3",
      "/audio/voice/shapes-fb-ringround.mp3",
      "/audio/voice/shapes-train-welcome.mp3",
      "/audio/voice/shapes-fb-absquare.mp3",
      "/audio/voice/shapes-fb-notriangle.mp3",
      "/audio/voice/shapes-sides-welcome.mp3",
      "/audio/voice/shapes-clue-sides.mp3",
      "/audio/voice/shapes-fb-threesides.mp3",
      "/audio/voice/shapes-fb-thatissquare.mp3",
      "/audio/voice/shapes-fb-trianglehasthree.mp3",
      "/audio/voice/shapes-door-welcome.mp3",
      "/audio/voice/shapes-clue-door.mp3",
      "/audio/voice/shapes-fb-rectdoor.mp3",
      "/audio/voice/shapes-fb-notround.mp3",
      "/audio/voice/shapes-fb-notthreesided.mp3",
      "/audio/voice/feelings-sad-welcome.mp3",
      "/audio/voice/feelings-clue-sad.mp3",
      "/audio/voice/feelings-fb-hug.mp3",
      "/audio/voice/feelings-fb-noshout.mp3",
      "/audio/voice/feelings-fb-sittogether.mp3",
      "/audio/voice/feelings-mad-welcome.mp3",
      "/audio/voice/feelings-clue-mad.mp3",
      "/audio/voice/feelings-fb-breathe.mp3",
      "/audio/voice/feelings-fb-nothrow.mp3",
      "/audio/voice/feelings-fb-nobite.mp3",
      "/audio/voice/feelings-scared-welcome.mp3",
      "/audio/voice/feelings-clue-scared.mp3",
      "/audio/voice/feelings-fb-light.mp3",
      "/audio/voice/feelings-fb-stayinside.mp3",
      "/audio/voice/feelings-fb-findgrownup.mp3",
      "/audio/voice/feelings-proud-welcome.mp3",
      "/audio/voice/feelings-clue-proud.mp3",
      "/audio/voice/feelings-fb-proudpuzzle.mp3",
      "/audio/voice/feelings-fb-maybelater.mp3",
      "/audio/voice/feelings-fb-notlost.mp3",
      "/audio/voice/feelings-share-welcome.mp3",
      "/audio/voice/feelings-fb-turns.mp3",
      "/audio/voice/feelings-fb-grabbing.mp3",
      "/audio/voice/feelings-fb-hiding.mp3",
      "/audio/voice/feelings-listen-welcome.mp3",
      "/audio/voice/feelings-fb-waitturn.mp3",
      "/audio/voice/feelings-fb-noshoutover.mp3",
      "/audio/voice/feelings-fb-staylisten.mp3",
      "/audio/voice/feelings-happyface-welcome.mp3",
      "/audio/voice/feelings-clue-happyface.mp3",
      "/audio/voice/feelings-fb-thathappy.mp3",
      "/audio/voice/feelings-fb-madtight.mp3",
      "/audio/voice/feelings-fb-sleepyslow.mp3",
      "/audio/voice/habits-soap-welcome.mp3",
      "/audio/voice/habits-clue-soap.mp3",
      "/audio/voice/habits-fb-soapwater.mp3",
      "/audio/voice/habits-fb-mud.mp3",
      "/audio/voice/habits-fb-paint.mp3",
      "/audio/voice/habits-water-welcome.mp3",
      "/audio/voice/habits-clue-water.mp3",
      "/audio/voice/habits-fb-drink.mp3",
      "/audio/voice/habits-fb-dust.mp3",
      "/audio/voice/habits-fb-needswater.mp3",
      "/audio/voice/habits-sneeze-welcome.mp3",
      "/audio/voice/habits-clue-sneeze.mp3",
      "/audio/voice/habits-fb-elbow.mp3",
      "/audio/voice/habits-fb-notfriend.mp3",
      "/audio/voice/habits-fb-notfood.mp3",
      "/audio/voice/habits-brushes-welcome.mp3",
      "/audio/voice/habits-clue-brushes.mp3",
      "/audio/voice/habits-fb-tenslow.mp3",
      "/audio/voice/habits-fb-toten.mp3",
      "/audio/voice/habits-fb-roundten.mp3",
      "/audio/voice/habits-bath-welcome.mp3",
      "/audio/voice/habits-clue-bath.mp3",
      "/audio/voice/habits-fb-soapbath.mp3",
      "/audio/voice/habits-fb-booksdry.mp3",
      "/audio/voice/habits-fb-toast.mp3",
      "/audio/voice/family-reads-welcome.mp3",
      "/audio/voice/family-clue-reads.mp3",
      "/audio/voice/family-fb-grandpareads.mp3",
      "/audio/voice/family-fb-kettles.mp3",
      "/audio/voice/family-fb-boots.mp3",
      "/audio/voice/family-cup-welcome.mp3",
      "/audio/voice/family-clue-cup.mp3",
      "/audio/voice/family-fb-lowshelf.mp3",
      "/audio/voice/family-fb-notroof.mp3",
      "/audio/voice/family-toys-welcome.mp3",
      "/audio/voice/family-clue-toys.mp3",
      "/audio/voice/family-fb-blocks.mp3",
      "/audio/voice/family-fb-forks.mp3",
      "/audio/voice/family-fb-soapbath.mp3",
      "/audio/voice/family-cushions-welcome.mp3",
      "/audio/voice/family-clue-cushions.mp3",
      "/audio/voice/family-fb-fourcushions.mp3",
      "/audio/voice/family-fb-wholesofa.mp3",
      "/audio/voice/family-kind-welcome.mp3",
      "/audio/voice/family-clue-kind.mp3",
      "/audio/voice/family-fb-quiet.mp3",
      "/audio/voice/family-fb-banging.mp3",
      "/audio/voice/family-fb-shouting.mp3",
      "/audio/voice/family-chore-welcome.mp3",
      "/audio/voice/family-fb-abrinse.mp3",
      "/audio/voice/family-fb-notchore.mp3",
      "/audio/voice/family-fb-sweepjust.mp3",
      "/audio/voice/family-plates-welcome.mp3",
      "/audio/voice/family-clue-plates.mp3",
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
      "/audio/voice/sort-sky-street.mp3",
      "/audio/voice/sort-land-ocean.mp3",
      "/audio/voice/sort-fruit-tool.mp3",
      "/audio/voice/sort-ice-warm.mp3",
      "/audio/voice/sort-day-night.mp3",
      "/audio/voice/sort-bug-flower.mp3",
      "/audio/voice/sort-farm-jungle.mp3",
      "/audio/voice/sort-park-market.mp3",
      "/audio/voice/sort-paint-music.mp3",
      "/audio/voice/sort-tale-barn.mp3",
      "/audio/voice/sort-wash-rest.mp3",
      "/audio/voice/sort-forest-treasure.mp3",
      "/audio/voice/sort-letter-number.mp3",
      "/audio/voice/activity-mw-food-1.mp3",
      "/audio/voice/activity-mw-family-1.mp3",
      "/audio/voice/activity-mw-routines-1.mp3",
      "/audio/voice/activity-aw-habitat-1.mp3",
      "/audio/voice/activity-aw-babies-1.mp3",
      "/audio/voice/activity-aw-sounds-1.mp3",
      "/audio/voice/activity-aw-footprints-1.mp3",
      "/audio/voice/activity-adv-space-1.mp3",
      "/audio/voice/activity-adv-weather-1.mp3",
      "/audio/voice/activity-adv-construction-1.mp3",
      "/audio/voice/activity-adv-dino-1.mp3",
      "/audio/voice/activity-lw-patterns-1.mp3",
      "/audio/voice/activity-lw-math-more.mp3",
      "/audio/voice/sort-fruit-treat.mp3",
      "/audio/voice/sort-summer-winter.mp3",
      "/audio/voice/sort-sky-ground.mp3",
      "/audio/voice/sort-daytime-nighttime.mp3",
      "/audio/voice/district-act-puppet-who-talks.mp3",
      "/audio/voice/district-act-puppet-count-crowd.mp3",
      "/audio/voice/district-act-puppet-sort-stage.mp3",
      "/audio/voice/district-act-puppet-letter-p.mp3",
      "/audio/voice/district-act-puppet-memory-cast.mp3",
      "/audio/voice/district-act-puppet-sky-balloons.mp3",
      "/audio/voice/district-act-puppet-rhyme-bow.mp3",
      "/audio/voice/district-act-stream-who-mmm.mp3",
      "/audio/voice/district-act-stream-count-fish.mp3",
      "/audio/voice/district-act-stream-sort-sound.mp3",
      "/audio/voice/district-act-stream-letter-m.mp3",
      "/audio/voice/district-act-stream-bubbles.mp3",
      "/audio/voice/district-act-stream-sky-balloons.mp3",
      "/audio/voice/district-act-stream-rhyme-swim.mp3",
      "/audio/voice/district-act-rain-who-boots.mp3",
      "/audio/voice/district-act-rain-count-drops.mp3",
      "/audio/voice/district-act-rain-sort-wet.mp3",
      "/audio/voice/district-act-rain-letter-r.mp3",
      "/audio/voice/district-act-rain-memory-drops.mp3",
      "/audio/voice/district-act-rain-sky-balloons.mp3",
      "/audio/voice/district-act-rain-rhyme-boot.mp3",
      "/audio/voice/district-clue-act-puppet-who-talks.mp3",
      "/audio/voice/district-clue-act-puppet-count-crowd.mp3",
      "/audio/voice/district-clue-act-puppet-sort-stage.mp3",
      "/audio/voice/district-clue-act-puppet-letter-p.mp3",
      "/audio/voice/district-clue-act-puppet-memory-cast.mp3",
      "/audio/voice/district-clue-act-puppet-sky-balloons.mp3",
      "/audio/voice/district-clue-act-puppet-rhyme-bow.mp3",
      "/audio/voice/district-clue-act-stream-who-mmm.mp3",
      "/audio/voice/district-clue-act-stream-count-fish.mp3",
      "/audio/voice/district-clue-act-stream-sort-sound.mp3",
      "/audio/voice/district-clue-act-stream-letter-m.mp3",
      "/audio/voice/district-clue-act-stream-bubbles.mp3",
      "/audio/voice/district-clue-act-stream-sky-balloons.mp3",
      "/audio/voice/district-clue-act-stream-rhyme-swim.mp3",
      "/audio/voice/district-clue-act-rain-who-boots.mp3",
      "/audio/voice/district-clue-act-rain-count-drops.mp3",
      "/audio/voice/district-clue-act-rain-sort-wet.mp3",
      "/audio/voice/district-clue-act-rain-letter-r.mp3",
      "/audio/voice/district-clue-act-rain-memory-drops.mp3",
      "/audio/voice/district-clue-act-rain-sky-balloons.mp3",
      "/audio/voice/atlas-clue-act-road-shape-sign.mp3",
      "/audio/voice/atlas-clue-act-dock-letter-s.mp3",
      "/audio/voice/toy-clue-act-farm-safari-walk.mp3",
      "/audio/voice/toy-clue-act-jungle-memory-leaves.mp3",
      "/audio/voice/toy-clue-act-ocean-letter-bubbles.mp3",
      "/audio/voice/toy-clue-act-meadow-rhyme-garden.mp3",
      "/audio/voice/toy-clue-act-meadow-blend-kitchen.mp3",
      "/audio/voice/toy-clue-act-meadow-letter-trace.mp3",
      "/audio/voice/toy-clue-act-grove-ten-frame.mp3",
      "/audio/voice/toy-clue-act-bed-bug-safari.mp3",
      "/audio/voice/toy-clue-act-dino-memory-bones.mp3",
      "/audio/voice/toy-clue-act-studio-sky-balloons.mp3",
      "/audio/voice/toy-clue-act-garden-rhyme-duet.mp3",
      "/audio/voice/toy-clue-act-workshop-memory-beads.mp3",
      "/audio/voice/toy-clue-act-atelier-sticker-match.mp3",
      "/audio/voice/toy-clue-act-barn-tale-safari.mp3",
      "/audio/voice/toy-clue-act-starlight-sky-balloons.mp3",
      "/audio/voice/toy-clue-act-sea-tale-bubbles.mp3",
      "/audio/voice/toy-clue-act-shapes-sky-balloons.mp3",
      "/audio/voice/toy-clue-act-feelings-face-memory.mp3",
      "/audio/voice/toy-clue-act-habits-brush-piano.mp3",
      "/audio/voice/toy-clue-act-home-rhyme-hug.mp3",
      "/audio/voice/toy-clue-act-street-sky-balloons.mp3",
      "/audio/voice/toy-clue-act-street-letter-trace.mp3",
      "/audio/voice/toy-clue-act-runway-sky-balloons.mp3",
      "/audio/voice/toy-clue-act-harbour-letter-bubbles.mp3",
      "/audio/voice/toy-clue-act-land-load-truck.mp3",
      "/audio/voice/toy-clue-act-land-stamp-mural.mp3",
      "/audio/voice/toy-clue-act-land-story-stones.mp3",
      "/audio/voice/toy-clue-act-land-number-pebbles.mp3",
      "/audio/voice/toy-clue-act-land-vine-swing.mp3",
      "/audio/voice/toy-clue-act-land-wash-bus.mp3",
      "/audio/voice/toy-clue-act-land-drum-boom.mp3",
      "/audio/voice/toy-clue-act-land-rocket-stars.mp3",
      "/audio/voice/toy-clue-act-land-ten-dots.mp3",
      "/audio/voice/toy-clue-act-land-brush-teeth.mp3",
      "/audio/voice/toy-clue-act-land-pack-bag.mp3",
      "/audio/voice/toy-clue-act-farm-letter-trace.mp3",
      "/audio/voice/toy-clue-act-farm-pen-count.mp3",
      "/audio/voice/toy-clue-act-bed-letter-trace.mp3",
      "/audio/voice/toy-clue-act-studio-letter-trace.mp3",
      "/audio/voice/toy-clue-act-barn-letter-trace.mp3",
      "/audio/voice/toy-clue-act-story-pancake-full.mp3",
      "/audio/voice/toy-clue-act-story-snow-full.mp3",
      "/audio/voice/toy-clue-act-home-letter-trace.mp3",
      "/audio/voice/toy-clue-act-home-pour.mp3",
      "/audio/voice/toy-clue-act-home-sock-drawer.mp3",
      "/audio/voice/toy-clue-act-home-comb.mp3",
      "/audio/voice/toy-clue-act-street-drive.mp3",
      "/audio/voice/toy-clue-act-road-bus-stop.mp3",
      "/audio/voice/toy-clue-act-dino-track-who.mp3",
      "/audio/voice/toy-clue-act-dock-scoop.mp3",
      "/audio/voice/toy-clue-act-sea-rhyme-tide.mp3",
      "/audio/voice/arch-clue-act-farm-sound-cow.mp3",
      "/audio/voice/arch-clue-act-farm-kitten-mom.mp3",
      "/audio/voice/arch-clue-act-farm-count-chicks.mp3",
      "/audio/voice/arch-clue-act-farm-horse-snack.mp3",
      "/audio/voice/arch-clue-act-jungle-sound-monkey.mp3",
      "/audio/voice/arch-clue-act-jungle-tracks-lion.mp3",
      "/audio/voice/arch-clue-act-jungle-habitat-parrot.mp3",
      "/audio/voice/arch-clue-act-jungle-count-bananas.mp3",
      "/audio/voice/arch-clue-act-ocean-sound-dolphin.mp3",
      "/audio/voice/arch-clue-act-ocean-glowing-jellyfish.mp3",
      "/audio/voice/arch-clue-act-ocean-sorting-land-water.mp3",
      "/audio/voice/arch-clue-act-dino-long-neck.mp3",
      "/audio/voice/arch-clue-act-dino-mighty-roar.mp3",
      "/audio/voice/arch-clue-act-color-mix-orange.mp3",
      "/audio/voice/arch-clue-act-color-mix-green.mp3",
      "/audio/voice/arch-clue-act-music-high-low.mp3",
      "/audio/voice/arch-clue-act-pattern-fruit-chain.mp3",
      "/audio/voice/arch-clue-act-sticker-crown-pick.mp3",
      "/audio/voice/arch-clue-act-story-farm-full.mp3",
      "/audio/voice/arch-clue-act-story-space-full.mp3",
      "/audio/voice/arch-clue-act-story-ocean-full.mp3",
      "/audio/voice/arch-clue-act-phonics-letter-b.mp3",
      "/audio/voice/arch-clue-act-phonics-letter-s.mp3",
      "/audio/voice/nav-gated-door.mp3",
      "/audio/voice/nav-rainbow-piano-welcome.mp3",
      "/audio/voice/nav-sort-hooray.mp3",
      "/audio/voice/nav-story-hooray.mp3",
      "/audio/voice/nav-letter-lane.mp3",
      "/audio/voice/nav-focus-body.mp3",
      "/audio/voice/nav-wonderland.mp3",
      "/audio/voice/ui-count-ten-frame.mp3",
      "/audio/voice/ui-focus-let-go.mp3",
      "/audio/voice/ui-focus-freeze.mp3",
      "/audio/voice/ui-focus-path-gold.mp3",
      "/audio/voice/ui-focus-how-feel.mp3",
      "/audio/voice/ui-focus-freeze-knees.mp3",
      "/audio/voice/ui-focus-wait.mp3",
      "/audio/voice/ui-focus-statue.mp3",
      "/audio/voice/ui-focus-nice-slow.mp3",
      "/audio/voice/ui-focus-found-them.mp3",
      "/audio/voice/ui-focus-quieter.mp3",
      "/audio/voice/ui-focus-go-learn.mp3",
      "/audio/voice/ui-rooms-logs.mp3",
      "/audio/voice/ui-rooms-shutters.mp3",
      "/audio/voice/ui-rooms-stars.mp3",
      "/audio/voice/ui-open-kind-play.mp3",
      "/audio/voice/ui-phonics-tap-order.mp3",
      "/audio/voice/ui-voice-enabled.mp3",
      "/audio/voice/ui-bubble-pop.mp3",
      "/audio/voice/ui-benny-hungry.mp3",
      "/audio/voice/ui-explorer-quiz.mp3",
      "/audio/voice/ui-shapes-colors.mp3",
      "/audio/voice/ui-benny-full.mp3",
      "/audio/voice/ui-north-star.mp3",
      "/audio/voice/ui-little-bear-ladle.mp3",
      "/audio/voice/ui-spare-twinkle.mp3",
      "/audio/voice/ui-steady-yes.mp3",
      "/audio/voice/ui-start-green-dot.mp3",
      "/audio/voice/ui-again-green-dot.mp3",
      "/audio/voice/count-tap-one.mp3",
      "/audio/voice/count-tap-two.mp3",
      "/audio/voice/count-tap-three.mp3",
      "/audio/voice/count-tap-four.mp3",
      "/audio/voice/count-tap-five.mp3",
      "/audio/voice/count-tap-six.mp3",
      "/audio/voice/count-tap-seven.mp3",
      "/audio/voice/count-tap-eight.mp3",
      "/audio/voice/count-tap-nine.mp3",
      "/audio/voice/count-tap-ten.mp3",
      "/audio/voice/count-tap-eleven.mp3",
      "/audio/voice/count-tap-twelve.mp3",
      "/audio/voice/count-tap-thirteen.mp3",
      "/audio/voice/count-tap-fourteen.mp3",
      "/audio/voice/count-tap-fifteen.mp3",
      "/audio/voice/count-tap-sixteen.mp3",
      "/audio/voice/count-tap-seventeen.mp3",
      "/audio/voice/count-tap-eighteen.mp3",
      "/audio/voice/count-tap-nineteen.mp3",
      "/audio/voice/count-tap-twenty.mp3",
      "/audio/voice/count-bang-one.mp3",
      "/audio/voice/count-bang-two.mp3",
      "/audio/voice/count-bang-three.mp3",
      "/audio/voice/count-bang-four.mp3",
      "/audio/voice/count-bang-five.mp3",
      "/audio/voice/count-bang-six.mp3",
      "/audio/voice/count-bang-seven.mp3",
      "/audio/voice/count-bang-eight.mp3",
      "/audio/voice/count-bang-nine.mp3",
      "/audio/voice/count-bang-ten.mp3",
      "/audio/voice/count-bang-eleven.mp3",
      "/audio/voice/count-bang-twelve.mp3",
      "/audio/voice/count-bang-thirteen.mp3",
      "/audio/voice/count-bang-fourteen.mp3",
      "/audio/voice/count-bang-fifteen.mp3",
      "/audio/voice/count-bang-sixteen.mp3",
      "/audio/voice/count-bang-seventeen.mp3",
      "/audio/voice/count-bang-eighteen.mp3",
      "/audio/voice/count-bang-nineteen.mp3",
      "/audio/voice/count-bang-twenty.mp3",
      "/audio/voice/count-say-one.mp3",
      "/audio/voice/count-say-two.mp3",
      "/audio/voice/count-say-three.mp3",
      "/audio/voice/count-say-four.mp3",
      "/audio/voice/count-say-five.mp3",
      "/audio/voice/count-say-six.mp3",
      "/audio/voice/count-say-seven.mp3",
      "/audio/voice/count-say-eight.mp3",
      "/audio/voice/count-say-nine.mp3",
      "/audio/voice/count-say-ten.mp3",
      "/audio/voice/count-say-eleven.mp3",
      "/audio/voice/count-say-twelve.mp3",
      "/audio/voice/count-say-thirteen.mp3",
      "/audio/voice/count-say-fourteen.mp3",
      "/audio/voice/count-say-fifteen.mp3",
      "/audio/voice/count-say-sixteen.mp3",
      "/audio/voice/count-say-seventeen.mp3",
      "/audio/voice/count-say-eighteen.mp3",
      "/audio/voice/count-say-nineteen.mp3",
      "/audio/voice/count-say-twenty.mp3",
      "/audio/voice/count-yes-ml-1.mp3",
      "/audio/voice/count-yes-ml-2.mp3",
      "/audio/voice/count-yes-ml-3.mp3",
      "/audio/voice/count-yes-ml-4.mp3",
      "/audio/voice/count-yes-ml-5.mp3",
      "/audio/voice/count-yes-ml-6.mp3",
      "/audio/voice/count-yes-ml-7.mp3",
      "/audio/voice/count-yes-ml-8.mp3",
      "/audio/voice/count-yes-pat-sun-moon.mp3",
      "/audio/voice/count-yes-pat-boot.mp3",
      "/audio/voice/count-yes-pat-bus.mp3",
      "/audio/voice/count-yes-pat-plate.mp3",
      "/audio/voice/count-yes-pat-seed.mp3",
      "/audio/voice/count-yes-pat-drop.mp3",
      "/audio/voice/count-yes-pat-peg.mp3",
      "/audio/voice/count-yes-pat-loaf.mp3",
      "/audio/voice/count-shape-circle-mat.mp3",
      "/audio/voice/count-shape-square-sail.mp3",
      "/audio/voice/count-shape-triangle-door.mp3",
      "/audio/voice/count-shape-rectangle-coin.mp3",
      "/audio/voice/count-shape-circle-window.mp3",
      "/audio/voice/count-shape-square-knob.mp3",
      "/audio/voice/count-shape-circle-roof.mp3",
      "/audio/voice/count-shape-triangle-sun.mp3",
      "/audio/voice/count-yes-after-2.mp3",
      "/audio/voice/count-yes-after-4.mp3",
      "/audio/voice/count-yes-after-5.mp3",
      "/audio/voice/count-yes-after-7.mp3",
      "/audio/voice/count-yes-after-10.mp3",
      "/audio/voice/count-yes-after-11.mp3",
      "/audio/voice/count-yes-after-15.mp3",
      "/audio/voice/count-yes-after-20.mp3",
      "/audio/voice/count-train-cars.mp3",
      "/audio/voice/games-yes-cow.mp3",
      "/audio/voice/games-yes-lion.mp3",
      "/audio/voice/games-yes-apple.mp3",
      "/audio/voice/games-yes-whale.mp3",
      "/audio/voice/games-yes-bunny.mp3",
      "/audio/voice/games-yes-star.mp3",
      "/audio/voice/games-yes-heart.mp3",
      "/audio/voice/games-yes-circle.mp3",
      "/audio/voice/games-yes-sun.mp3",
      "/audio/voice/games-yes-square.mp3",
      "/audio/voice/games-yes-puppy.mp3",
      "/audio/voice/games-yes-duck.mp3",
      "/audio/voice/games-yes-monkey.mp3",
      "/audio/voice/games-yes-elephant.mp3",
      "/audio/voice/games-yes-sheep.mp3",
      "/audio/voice/games-yes-triangle.mp3",
      "/audio/voice/games-yes-diamond.mp3",
      "/audio/voice/games-yes-moon.mp3",
      "/audio/voice/games-yes-rainbow.mp3",
      "/audio/voice/games-yes-cloud.mp3",
      "/audio/voice/games-yes-rooster.mp3",
      "/audio/voice/games-yes-owl.mp3",
      "/audio/voice/games-yes-horse.mp3",
      "/audio/voice/games-yes-piggy.mp3",
      "/audio/voice/games-yes-turtle.mp3",
      "/audio/voice/games-yes-bell.mp3",
      "/audio/voice/games-yes-berry.mp3",
      "/audio/voice/games-yes-pizza.mp3",
      "/audio/voice/games-yes-window.mp3",
      "/audio/voice/games-yes-clock.mp3",
      "/audio/voice/games-yes-bee.mp3",
      "/audio/voice/games-yes-penguin.mp3",
      "/audio/voice/games-yes-sunnysun.mp3",
      "/audio/voice/games-yes-threesides.mp3",
      "/audio/voice/games-yes-three.mp3",
      "/audio/voice/games-yes-banana.mp3",
      "/audio/voice/games-yes-stop.mp3",
      "/audio/voice/games-yes-giraffe.mp3",
      "/audio/voice/games-yes-rain.mp3",
      "/audio/voice/games-yes-dolphin.mp3",
      "/audio/voice/games-yes-red.mp3",
      "/audio/voice/games-yes-six.mp3",
      "/audio/voice/games-yes-eight.mp3",
      "/audio/voice/games-yes-tenstars.mp3",
      "/audio/voice/games-yes-letter-d.mp3",
      "/audio/voice/games-yes-letter-o.mp3",
      "/audio/voice/games-yes-letter-f.mp3",
      "/audio/voice/games-yes-ten-after-nine.mp3",
      "/audio/voice/games-no-dog-cow.mp3",
      "/audio/voice/games-no-cat-cow.mp3",
      "/audio/voice/games-no-duck-cow.mp3",
      "/audio/voice/games-no-bunny-lion.mp3",
      "/audio/voice/games-no-frog-lion.mp3",
      "/audio/voice/games-no-piggy-lion.mp3",
      "/audio/voice/games-no-banana-apple.mp3",
      "/audio/voice/games-no-carrot-apple.mp3",
      "/audio/voice/games-no-grapes-apple.mp3",
      "/audio/voice/games-no-horse-whale.mp3",
      "/audio/voice/games-no-bird-whale.mp3",
      "/audio/voice/games-no-bear-whale.mp3",
      "/audio/voice/games-no-elephant-bunny.mp3",
      "/audio/voice/games-no-turtle-bunny.mp3",
      "/audio/voice/games-no-sheep-bunny.mp3",
      "/audio/voice/games-no-cat-dog.mp3",
      "/audio/voice/games-no-chicken-dog.mp3",
      "/audio/voice/games-no-mouse-dog.mp3",
      "/audio/voice/games-no-frog-duck.mp3",
      "/audio/voice/games-no-cow-duck.mp3",
      "/audio/voice/games-no-fox-duck.mp3",
      "/audio/voice/games-no-bear-monkey.mp3",
      "/audio/voice/games-no-lion-monkey.mp3",
      "/audio/voice/games-no-turtle-monkey.mp3",
      "/audio/voice/games-no-giraffe-elephant.mp3",
      "/audio/voice/games-no-rhino-elephant.mp3",
      "/audio/voice/games-no-zebra-elephant.mp3",
      "/audio/voice/games-no-goat-sheep.mp3",
      "/audio/voice/games-no-horse-sheep.mp3",
      "/audio/voice/games-no-pig-sheep.mp3",
      "/audio/voice/games-no-owl-rooster.mp3",
      "/audio/voice/games-no-parrot-rooster.mp3",
      "/audio/voice/games-no-duck-rooster.mp3",
      "/audio/voice/games-no-bat-owl.mp3",
      "/audio/voice/games-no-bird-owl.mp3",
      "/audio/voice/games-no-bee-owl.mp3",
      "/audio/voice/games-no-cow-horse.mp3",
      "/audio/voice/games-no-deer-horse.mp3",
      "/audio/voice/games-no-dog-horse.mp3",
      "/audio/voice/games-no-hippo-pig.mp3",
      "/audio/voice/games-no-bunny-pig.mp3",
      "/audio/voice/games-no-cat-pig.mp3",
      "/audio/voice/games-no-rabbit-turtle.mp3",
      "/audio/voice/games-no-fish-turtle.mp3",
      "/audio/voice/games-no-bird-turtle.mp3",
      "/audio/voice/games-no-frog-bee.mp3",
      "/audio/voice/games-no-duck-bee.mp3",
      "/audio/voice/games-no-cat-bee.mp3",
      "/audio/voice/games-no-camel-penguin.mp3",
      "/audio/voice/games-no-monkey-penguin.mp3",
      "/audio/voice/games-no-cow-penguin.mp3",
      "/audio/voice/games-no-moon-sun.mp3",
      "/audio/voice/games-no-snow-sun.mp3",
      "/audio/voice/games-no-star-sun.mp3",
      "/audio/voice/games-no-circle-triangle.mp3",
      "/audio/voice/games-no-square-triangle.mp3",
      "/audio/voice/games-no-star-triangle.mp3",
      "/audio/voice/games-no-one-three.mp3",
      "/audio/voice/games-no-five-three.mp3",
      "/audio/voice/games-no-two-three.mp3",
      "/audio/voice/games-no-apple-banana.mp3",
      "/audio/voice/games-no-grapes-banana.mp3",
      "/audio/voice/games-no-lemon-banana.mp3",
      "/audio/voice/games-no-run-stop.mp3",
      "/audio/voice/games-no-play-stop.mp3",
      "/audio/voice/games-no-hide-stop.mp3",
      "/audio/voice/games-no-zebra-giraffe.mp3",
      "/audio/voice/games-no-lion-giraffe.mp3",
      "/audio/voice/games-no-hippo-giraffe.mp3",
      "/audio/voice/games-no-sun-rain.mp3",
      "/audio/voice/games-no-wind-rain.mp3",
      "/audio/voice/games-no-rainbow-rain.mp3",
      "/audio/voice/phonics-trace-a.mp3",
      "/audio/voice/phonics-trace-b.mp3",
      "/audio/voice/phonics-trace-c.mp3",
      "/audio/voice/phonics-trace-d.mp3",
      "/audio/voice/phonics-trace-e.mp3",
      "/audio/voice/phonics-trace-f.mp3",
      "/audio/voice/phonics-trace-g.mp3",
      "/audio/voice/phonics-trace-h.mp3",
      "/audio/voice/phonics-trace-i.mp3",
      "/audio/voice/phonics-trace-j.mp3",
      "/audio/voice/phonics-yes-a.mp3",
      "/audio/voice/phonics-yes-b.mp3",
      "/audio/voice/phonics-yes-c.mp3",
      "/audio/voice/phonics-yes-d.mp3",
      "/audio/voice/phonics-yes-e.mp3",
      "/audio/voice/phonics-yes-f.mp3",
      "/audio/voice/phonics-yes-g.mp3",
      "/audio/voice/phonics-yes-h.mp3",
      "/audio/voice/phonics-yes-i.mp3",
      "/audio/voice/phonics-yes-j.mp3",
      "/audio/voice/phonics-trace-k.mp3",
      "/audio/voice/phonics-trace-l.mp3",
      "/audio/voice/phonics-trace-m.mp3",
      "/audio/voice/phonics-trace-n.mp3",
      "/audio/voice/phonics-trace-o.mp3",
      "/audio/voice/phonics-trace-p.mp3",
      "/audio/voice/phonics-trace-q.mp3",
      "/audio/voice/phonics-trace-r.mp3",
      "/audio/voice/phonics-trace-s.mp3",
      "/audio/voice/phonics-trace-t.mp3",
      "/audio/voice/phonics-yes-k.mp3",
      "/audio/voice/phonics-yes-l.mp3",
      "/audio/voice/phonics-yes-m.mp3",
      "/audio/voice/phonics-yes-n.mp3",
      "/audio/voice/phonics-yes-o.mp3",
      "/audio/voice/phonics-yes-p.mp3",
      "/audio/voice/phonics-yes-q.mp3",
      "/audio/voice/phonics-yes-r.mp3",
      "/audio/voice/phonics-yes-s.mp3",
      "/audio/voice/phonics-yes-t.mp3",
      "/audio/voice/phonics-trace-u.mp3",
      "/audio/voice/phonics-trace-v.mp3",
      "/audio/voice/phonics-trace-w.mp3",
      "/audio/voice/phonics-trace-x.mp3",
      "/audio/voice/phonics-trace-y.mp3",
      "/audio/voice/phonics-trace-z.mp3",
      "/audio/voice/phonics-yes-u.mp3",
      "/audio/voice/phonics-yes-v.mp3",
      "/audio/voice/phonics-yes-w.mp3",
      "/audio/voice/phonics-yes-x.mp3",
      "/audio/voice/phonics-yes-y.mp3",
      "/audio/voice/phonics-yes-z.mp3",
      "/audio/voice/games-no-chicken-dolphin.mp3",
      "/audio/voice/games-no-camel-dolphin.mp3",
      "/audio/voice/games-no-sheep-dolphin.mp3",
      "/audio/voice/games-no-blue-red.mp3",
      "/audio/voice/games-no-green-red.mp3",
      "/audio/voice/games-no-yellow-red.mp3",
      "/audio/voice/games-no-four-six.mp3",
      "/audio/voice/games-no-two-six.mp3",
      "/audio/voice/games-no-nine-six.mp3",
      "/audio/voice/games-no-three-eight.mp3",
      "/audio/voice/games-no-five-eight.mp3",
      "/audio/voice/games-no-one-eight.mp3",
      "/audio/voice/games-no-seven-ten.mp3",
      "/audio/voice/games-no-two-ten.mp3",
      "/audio/voice/games-no-four-ten.mp3",
      "/audio/voice/games-no-m-d.mp3",
      "/audio/voice/games-no-s-d.mp3",
      "/audio/voice/games-no-z-d.mp3",
      "/audio/voice/games-no-a-o.mp3",
      "/audio/voice/games-no-t-o.mp3",
      "/audio/voice/games-no-k-o.mp3",
      "/audio/voice/games-no-s-f.mp3",
      "/audio/voice/games-no-b-f.mp3",
      "/audio/voice/games-no-m-f.mp3",
      "/audio/voice/games-no-eight-ten.mp3",
      "/audio/voice/games-no-five-ten.mp3",
      "/audio/voice/games-no-circle-star.mp3",
      "/audio/voice/games-no-square-star.mp3",
      "/audio/voice/games-no-heart-star.mp3",
      "/audio/voice/games-no-diamond-heart.mp3",
      "/audio/voice/games-no-circle-heart.mp3",
      "/audio/voice/games-no-sun-heart.mp3",
      "/audio/voice/games-no-triangle-circle.mp3",
      "/audio/voice/games-no-square-circle.mp3",
      "/audio/voice/games-no-star-circle.mp3",
      "/audio/voice/games-no-sleepy-moon-sun.mp3",
      "/audio/voice/games-no-cloud-sun.mp3",
      "/audio/voice/games-no-rainbow-sun.mp3",
      "/audio/voice/games-no-circle-square.mp3",
      "/audio/voice/games-no-triangle-square.mp3",
      "/audio/voice/games-no-star-square.mp3",
      "/audio/voice/games-no-blue-circle-triangle.mp3",
      "/audio/voice/games-no-heart-triangle.mp3",
      "/audio/voice/games-no-purple-square-triangle.mp3",
      "/audio/voice/games-no-circle-diamond.mp3",
      "/audio/voice/games-no-sun-diamond.mp3",
      "/audio/voice/games-no-cloud-diamond.mp3",
      "/audio/voice/games-no-sun-moon.mp3",
      "/audio/voice/games-no-heart-moon.mp3",
      "/audio/voice/games-no-star-moon.mp3",
      "/audio/voice/games-no-cloud-rainbow.mp3",
      "/audio/voice/games-no-circle-rainbow.mp3",
      "/audio/voice/games-no-square-rainbow.mp3",
      "/audio/voice/games-no-star-cloud.mp3",
      "/audio/voice/games-no-sun-cloud.mp3",
      "/audio/voice/games-no-heart-cloud.mp3",
      "/audio/voice/games-no-square-bell.mp3",
      "/audio/voice/games-no-circle-bell.mp3",
      "/audio/voice/games-no-diamond-bell.mp3",
      "/audio/voice/games-no-circle-berry.mp3",
      "/audio/voice/games-no-triangle-berry.mp3",
      "/audio/voice/games-no-square-berry.mp3",
      "/audio/voice/games-no-plate-pizza.mp3",
      "/audio/voice/games-no-window-pizza.mp3",
      "/audio/voice/games-no-clock-pizza.mp3",
      "/audio/voice/games-no-ball-window.mp3",
      "/audio/voice/games-no-slice-window.mp3",
      "/audio/voice/games-no-moon-window.mp3",
      "/audio/voice/games-no-door-clock.mp3",
      "/audio/voice/games-no-slice-clock.mp3",
      "/audio/voice/games-no-book-clock.mp3",
      "/audio/voice/games-benny-munch-1.mp3",
      "/audio/voice/games-benny-munch-2.mp3",
      "/audio/voice/games-benny-munch-3.mp3",
      "/audio/voice/games-benny-munch-4.mp3",
      "/audio/voice/games-benny-munch-5.mp3",
      "/audio/voice/games-benny-munch-6.mp3",
      "/audio/voice/games-benny-munch-7.mp3",
      "/audio/voice/games-benny-munch-8.mp3",
      "/audio/voice/games-benny-munch-9.mp3",
      "/audio/voice/games-benny-hungrier-8.mp3",
      "/audio/voice/games-benny-hungrier-10.mp3",
      "/audio/voice/games-benny-ready.mp3",
      "/audio/voice/games-bubble-short-pop.mp3",
      "/audio/voice/games-bubble-super.mp3",
      "/audio/voice/games-bubble-sparkle.mp3",
      "/audio/voice/games-bubble-wheee.mp3",
      "/audio/voice/world-yes-pond-dragon.mp3",
      "/audio/voice/world-no-pond-hen.mp3",
      "/audio/voice/world-no-pond-truck.mp3",
      "/audio/voice/world-yes-pond-skater.mp3",
      "/audio/voice/world-no-pond-lady.mp3",
      "/audio/voice/world-no-pond-bee.mp3",
      "/audio/voice/world-yes-pond-8.mp3",
      "/audio/voice/world-no-pond-4.mp3",
      "/audio/voice/world-no-pond-11.mp3",
      "/audio/voice/world-yes-pond-reeds.mp3",
      "/audio/voice/world-no-pond-bakery.mp3",
      "/audio/voice/world-no-pond-runway.mp3",
      "/audio/voice/world-yes-pond-frog.mp3",
      "/audio/voice/world-no-pond-plane.mp3",
      "/audio/voice/world-no-pond-bell.mp3",
      "/audio/voice/world-yes-pond-p.mp3",
      "/audio/voice/world-no-pond-b.mp3",
      "/audio/voice/world-no-pond-d.mp3",
      "/audio/voice/world-yes-pond-circle.mp3",
      "/audio/voice/world-no-pond-star.mp3",
      "/audio/voice/world-no-pond-square.mp3",
      "/audio/voice/world-yes-pond-6.mp3",
      "/audio/voice/world-no-pond-24.mp3",
      "/audio/voice/world-no-pond-4-frogs.mp3",
      "/audio/voice/world-yes-night-cricket.mp3",
      "/audio/voice/world-no-night-cow.mp3",
      "/audio/voice/world-no-night-plane.mp3",
      "/audio/voice/world-yes-night-moth.mp3",
      "/audio/voice/world-no-night-shark.mp3",
      "/audio/voice/world-no-night-bus.mp3",
      "/audio/voice/world-yes-night-cricket-sing.mp3",
      "/audio/voice/world-no-night-bee.mp3",
      "/audio/voice/world-no-night-rooster.mp3",
      "/audio/voice/world-yes-night-4.mp3",
      "/audio/voice/world-no-night-1.mp3",
      "/audio/voice/world-no-night-7.mp3",
      "/audio/voice/world-yes-night-soft.mp3",
      "/audio/voice/world-no-night-crash.mp3",
      "/audio/voice/world-no-night-shout.mp3",
      "/audio/voice/world-yes-night-m.mp3",
      "/audio/voice/world-no-night-n.mp3",
      "/audio/voice/world-no-night-s.mp3",
      "/audio/voice/world-yes-night-nana.mp3",
      "/audio/voice/world-no-night-pip.mp3",
      "/audio/voice/world-no-night-dog.mp3",
      "/audio/voice/world-yes-night-dim.mp3",
      "/audio/voice/world-no-night-crash-pattern.mp3",
      "/audio/voice/world-no-night-glow.mp3",
      "/audio/voice/world-yes-compost-worm.mp3",
      "/audio/voice/world-no-compost-dolphin.mp3",
      "/audio/voice/world-no-compost-plane.mp3",
      "/audio/voice/world-yes-compost-soil.mp3",
      "/audio/voice/world-no-compost-fridge.mp3",
      "/audio/voice/world-no-compost-sky.mp3",
      "/audio/voice/world-yes-compost-peel.mp3",
      "/audio/voice/world-no-compost-boot.mp3",
      "/audio/voice/world-no-compost-key.mp3",
      "/audio/voice/world-yes-compost-5.mp3",
      "/audio/voice/world-no-compost-2.mp3",
      "/audio/voice/world-no-compost-8.mp3",
      "/audio/voice/world-yes-compost-w.mp3",
      "/audio/voice/world-no-compost-m.mp3",
      "/audio/voice/world-no-compost-v.mp3",
      "/audio/voice/world-yes-compost-8.mp3",
      "/audio/voice/world-no-compost-44.mp3",
      "/audio/voice/world-no-compost-4.mp3",
      "/audio/voice/world-yes-compost-dog.mp3",
      "/audio/voice/world-no-compost-leaf.mp3",
      "/audio/voice/world-no-compost-worm.mp3",
      "/audio/voice/world-yes-compost-slide.mp3",
      "/audio/voice/world-no-compost-boats.mp3",
      "/audio/voice/world-no-compost-fire.mp3",
      "/audio/voice/world-yes-fruit-orange.mp3",
      "/audio/voice/world-no-fruit-pea.mp3",
      "/audio/voice/world-no-fruit-loaf.mp3",
      "/audio/voice/world-yes-fruit-5.mp3",
      "/audio/voice/world-no-fruit-2.mp3",
      "/audio/voice/world-no-fruit-8.mp3",
      "/audio/voice/world-yes-fruit-carrot.mp3",
      "/audio/voice/world-no-fruit-banana.mp3",
      "/audio/voice/world-no-fruit-cake.mp3",
      "/audio/voice/world-yes-fruit-orange-jam.mp3",
      "/audio/voice/world-no-fruit-blue.mp3",
      "/audio/voice/world-no-fruit-black.mp3",
      "/audio/voice/world-yes-fruit-a.mp3",
      "/audio/voice/world-no-fruit-b.mp3",
      "/audio/voice/world-no-fruit-p.mp3",
      "/audio/voice/world-yes-fruit-pear.mp3",
      "/audio/voice/world-no-fruit-melon.mp3",
      "/audio/voice/world-no-fruit-apple.mp3",
      "/audio/voice/world-yes-fruit-6.mp3",
      "/audio/voice/world-no-fruit-33.mp3",
      "/audio/voice/world-no-fruit-3.mp3",
      "/audio/voice/world-yes-fruit-bear.mp3",
      "/audio/voice/world-no-fruit-apple-rhyme.mp3",
      "/audio/voice/world-no-fruit-plum.mp3",
      "/audio/voice/world-yes-bakery-baker.mp3",
      "/audio/voice/world-no-bakery-pilot.mp3",
      "/audio/voice/world-no-bakery-frog.mp3",
      "/audio/voice/world-yes-bakery-6.mp3",
      "/audio/voice/world-no-bakery-3.mp3",
      "/audio/voice/world-no-bakery-9.mp3",
      "/audio/voice/world-yes-bakery-loaf.mp3",
      "/audio/voice/world-no-bakery-milk.mp3",
      "/audio/voice/world-no-bakery-ice.mp3",
      "/audio/voice/world-yes-bakery-b.mp3",
      "/audio/voice/world-no-bakery-d.mp3",
      "/audio/voice/world-no-bakery-p.mp3",
      "/audio/voice/world-yes-bakery-br.mp3",
      "/audio/voice/world-no-bakery-st.mp3",
      "/audio/voice/world-no-bakery-fl.mp3",
      "/audio/voice/world-yes-bakery-loaf-pattern.mp3",
      "/audio/voice/world-no-bakery-fish.mp3",
      "/audio/voice/world-no-bakery-bun.mp3",
      "/audio/voice/world-yes-bakery-window.mp3",
      "/audio/voice/world-no-bakery-oven.mp3",
      "/audio/voice/world-no-bakery-pond.mp3",
      "/audio/voice/world-yes-bakery-circle.mp3",
      "/audio/voice/world-no-bakery-square.mp3",
      "/audio/voice/world-no-bakery-star.mp3",
      "/audio/voice/world-yes-soup-spoon.mp3",
      "/audio/voice/world-no-soup-key.mp3",
      "/audio/voice/world-no-soup-shoe.mp3",
      "/audio/voice/world-yes-soup-4.mp3",
      "/audio/voice/world-no-soup-1.mp3",
      "/audio/voice/world-no-soup-7.mp3",
      "/audio/voice/world-yes-soup-wait.mp3",
      "/audio/voice/world-no-soup-touch.mp3",
      "/audio/voice/world-no-soup-pour-floor.mp3",
      "/audio/voice/world-yes-soup-onion.mp3",
      "/audio/voice/world-no-soup-sock.mp3",
      "/audio/voice/world-no-soup-crayon.mp3",
      "/audio/voice/world-yes-soup-s.mp3",
      "/audio/voice/world-no-soup-z.mp3",
      "/audio/voice/world-no-soup-c.mp3",
      "/audio/voice/world-yes-soup-5.mp3",
      "/audio/voice/world-no-soup-23.mp3",
      "/audio/voice/world-no-soup-3.mp3",
      "/audio/voice/world-yes-soup-nana.mp3",
      "/audio/voice/world-no-soup-pip.mp3",
      "/audio/voice/world-no-soup-cat.mp3",
      "/audio/voice/world-yes-soup-chop.mp3",
      "/audio/voice/world-no-soup-nap.mp3",
      "/audio/voice/world-no-soup-rest.mp3",
      "/audio/voice/world-yes-picnic-sandwich.mp3",
      "/audio/voice/world-no-picnic-hammer.mp3",
      "/audio/voice/world-no-picnic-tyre.mp3",
      "/audio/voice/world-yes-picnic-4.mp3",
      "/audio/voice/world-no-picnic-2.mp3",
      "/audio/voice/world-no-picnic-7.mp3",
      "/audio/voice/world-yes-picnic-5.mp3",
      "/audio/voice/world-no-picnic-32.mp3",
      "/audio/voice/world-no-picnic-2-sandwiches.mp3",
      "/audio/voice/world-yes-picnic-ant.mp3",
      "/audio/voice/world-no-picnic-whale.mp3",
      "/audio/voice/world-no-picnic-bus.mp3",
      "/audio/voice/world-yes-picnic-p.mp3",
      "/audio/voice/world-no-picnic-b.mp3",
      "/audio/voice/world-no-picnic-n.mp3",
      "/audio/voice/world-yes-picnic-square.mp3",
      "/audio/voice/world-no-picnic-circle.mp3",
      "/audio/voice/world-no-picnic-triangle.mp3",
      "/audio/voice/world-yes-picnic-cloth.mp3",
      "/audio/voice/world-no-picnic-trail.mp3",
      "/audio/voice/world-no-picnic-road.mp3",
      "/audio/voice/world-yes-picnic-blue.mp3",
      "/audio/voice/world-no-picnic-green.mp3",
      "/audio/voice/world-no-picnic-red.mp3",
      "/audio/voice/world-yes-fire-crew.mp3",
      "/audio/voice/world-no-fire-baker.mp3",
      "/audio/voice/world-no-fire-penguin.mp3",
      "/audio/voice/world-yes-fire-3.mp3",
      "/audio/voice/world-no-fire-1.mp3",
      "/audio/voice/world-no-fire-6.mp3",
      "/audio/voice/world-yes-fire-hose.mp3",
      "/audio/voice/world-no-fire-book.mp3",
      "/audio/voice/world-yes-fire-f.mp3",
      "/audio/voice/world-no-fire-s.mp3",
      "/audio/voice/world-yes-fire-bell.mp3",
      "/audio/voice/world-no-fire-ran.mp3",
      "/audio/voice/world-no-fire-nap.mp3",
      "/audio/voice/world-yes-fire-circle.mp3",
      "/audio/voice/world-no-fire-square.mp3",
      "/audio/voice/world-no-fire-star.mp3",
      "/audio/voice/world-yes-fire-4.mp3",
      "/audio/voice/world-no-fire-22.mp3",
      "/audio/voice/world-no-fire-2.mp3",
      "/audio/voice/world-yes-fire-dal.mp3",
      "/audio/voice/world-no-fire-owl.mp3",
      "/audio/voice/world-yes-park-5.mp3",
      "/audio/voice/world-no-park-2.mp3",
      "/audio/voice/world-no-park-8.mp3",
      "/audio/voice/world-yes-park-swing.mp3",
      "/audio/voice/world-no-park-lorry.mp3",
      "/audio/voice/world-no-park-oven.mp3",
      "/audio/voice/world-yes-park-duck.mp3",
      "/audio/voice/world-no-park-lion.mp3",
      "/audio/voice/world-no-park-truck.mp3",
      "/audio/voice/world-yes-park-d.mp3",
      "/audio/voice/world-no-park-b.mp3",
      "/audio/voice/world-no-park-g.mp3",
      "/audio/voice/world-yes-park-circle.mp3",
      "/audio/voice/world-no-park-square.mp3",
      "/audio/voice/world-no-park-triangle.mp3",
      "/audio/voice/world-yes-park-5-balls.mp3",
      "/audio/voice/world-no-park-23.mp3",
      "/audio/voice/world-no-park-3.mp3",
      "/audio/voice/world-yes-park-nana.mp3",
      "/audio/voice/world-no-park-dog.mp3",
      "/audio/voice/world-no-park-pip.mp3",
      "/audio/voice/world-yes-park-bench.mp3",
      "/audio/voice/world-no-park-pond.mp3",
      "/audio/voice/world-no-park-in-oven.mp3",
      "/audio/voice/world-yes-library-shelf.mp3",
      "/audio/voice/world-no-library-fridge.mp3",
      "/audio/voice/world-yes-library-l.mp3",
      "/audio/voice/world-no-library-r.mp3",
      "/audio/voice/world-no-library-b.mp3",
      "/audio/voice/world-yes-library-7.mp3",
      "/audio/voice/world-no-library-3.mp3",
      "/audio/voice/world-no-library-10.mp3",
      "/audio/voice/world-yes-library-whisper.mp3",
      "/audio/voice/world-no-library-drum.mp3",
      "/audio/voice/world-no-library-siren.mp3",
      "/audio/voice/world-yes-library-nana.mp3",
      "/audio/voice/world-no-library-pip.mp3",
      "/audio/voice/world-no-library-duck.mp3",
      "/audio/voice/world-yes-library-hook.mp3",
      "/audio/voice/world-no-library-shelf.mp3",
      "/audio/voice/world-no-library-page.mp3",
      "/audio/voice/world-yes-library-blue.mp3",
      "/audio/voice/world-no-library-gold.mp3",
      "/audio/voice/world-no-library-red.mp3",
      "/audio/voice/world-yes-library-6.mp3",
      "/audio/voice/world-no-library-42.mp3",
      "/audio/voice/world-no-library-2.mp3",
      "/audio/voice/world-yes-market-seller.mp3",
      "/audio/voice/world-no-market-owl.mp3",
      "/audio/voice/world-no-market-sub.mp3",
      "/audio/voice/world-yes-market-4.mp3",
      "/audio/voice/world-no-market-1.mp3",
      "/audio/voice/world-no-market-7.mp3",
      "/audio/voice/world-yes-market-square.mp3",
      "/audio/voice/world-no-market-circle.mp3",
      "/audio/voice/world-no-market-heart.mp3",
      "/audio/voice/world-yes-market-cap.mp3",
      "/audio/voice/world-no-market-fish.mp3",
      "/audio/voice/world-no-market-hose.mp3",
      "/audio/voice/world-yes-market-m.mp3",
      "/audio/voice/world-no-market-n.mp3",
      "/audio/voice/world-no-market-k.mp3",
      "/audio/voice/world-yes-market-5.mp3",
      "/audio/voice/world-no-market-32.mp3",
      "/audio/voice/world-no-market-2.mp3",
      "/audio/voice/world-yes-market-red-cap.mp3",
      "/audio/voice/world-no-market-kite.mp3",
      "/audio/voice/world-no-market-hose-stall.mp3",
      "/audio/voice/world-yes-market-white.mp3",
      "/audio/voice/world-no-market-green.mp3",
      "/audio/voice/world-no-market-red.mp3",
      "/audio/voice/world-yes-ice-penguin.mp3",
      "/audio/voice/world-no-ice-camel.mp3",
      "/audio/voice/world-yes-ice-6.mp3",
      "/audio/voice/world-no-ice-3.mp3",
      "/audio/voice/world-no-ice-9.mp3",
      "/audio/voice/world-yes-ice-ice.mp3",
      "/audio/voice/world-no-ice-bakery.mp3",
      "/audio/voice/world-no-ice-desert.mp3",
      "/audio/voice/world-yes-ice-penguin-hop.mp3",
      "/audio/voice/world-no-ice-horse.mp3",
      "/audio/voice/world-yes-ice-p.mp3",
      "/audio/voice/world-no-ice-b.mp3",
      "/audio/voice/world-no-ice-g.mp3",
      "/audio/voice/world-yes-ice-6-penguins.mp3",
      "/audio/voice/world-no-ice-42.mp3",
      "/audio/voice/world-no-ice-2.mp3",
      "/audio/voice/world-yes-ice-go.mp3",
      "/audio/voice/world-no-ice-ice.mp3",
      "/audio/voice/world-no-ice-fish.mp3",
      "/audio/voice/world-yes-ice-hop.mp3",
      "/audio/voice/world-no-ice-swim.mp3",
      "/audio/voice/world-no-ice-rest.mp3",
      "/audio/voice/world-yes-polar-bear.mp3",
      "/audio/voice/world-no-polar-parrot.mp3",
      "/audio/voice/world-yes-polar-den.mp3",
      "/audio/voice/world-no-polar-harbour.mp3",
      "/audio/voice/world-yes-polar-4.mp3",
      "/audio/voice/world-no-polar-2.mp3",
      "/audio/voice/world-no-polar-6.mp3",
      "/audio/voice/world-yes-polar-bear-coat.mp3",
      "/audio/voice/world-no-polar-monkey.mp3",
      "/audio/voice/world-yes-polar-c.mp3",
      "/audio/voice/world-yes-polar-grown.mp3",
      "/audio/voice/world-no-polar-cub.mp3",
      "/audio/voice/world-no-polar-ferry.mp3",
      "/audio/voice/world-yes-polar-6.mp3",
      "/audio/voice/world-no-polar-33.mp3",
      "/audio/voice/world-no-polar-3.mp3",
      "/audio/voice/world-yes-polar-circle.mp3",
      "/audio/voice/world-no-polar-star.mp3",
      "/audio/voice/world-no-polar-triangle.mp3",
      "/audio/voice/world-yes-northern-green.mp3",
      "/audio/voice/world-no-northern-brown.mp3",
      "/audio/voice/world-no-northern-grey.mp3",
      "/audio/voice/world-yes-northern-green-mix.mp3",
      "/audio/voice/world-no-northern-red.mp3",
      "/audio/voice/world-no-northern-black.mp3",
      "/audio/voice/world-yes-northern-8.mp3",
      "/audio/voice/world-no-northern-4.mp3",
      "/audio/voice/world-no-northern-11.mp3",
      "/audio/voice/world-yes-northern-fade.mp3",
      "/audio/voice/world-no-northern-drum.mp3",
      "/audio/voice/world-yes-northern-s.mp3",
      "/audio/voice/world-no-northern-t.mp3",
      "/audio/voice/world-no-northern-r.mp3",
      "/audio/voice/world-yes-northern-ribbon.mp3",
      "/audio/voice/world-no-northern-seal.mp3",
      "/audio/voice/world-no-northern-bus.mp3",
      "/audio/voice/world-yes-northern-7.mp3",
      "/audio/voice/world-no-northern-34.mp3",
      "/audio/voice/world-no-northern-4-sparks.mp3",
      "/audio/voice/world-yes-northern-hill.mp3",
      "/audio/voice/world-no-northern-thin.mp3",
      "/audio/voice/world-no-northern-oven.mp3",
      "/audio/voice/world-yes-seal-seal.mp3",
      "/audio/voice/world-no-seal-hen.mp3",
      "/audio/voice/world-no-seal-crane.mp3",
      "/audio/voice/world-yes-seal-bark.mp3",
      "/audio/voice/world-no-seal-dog.mp3",
      "/audio/voice/world-no-seal-owl.mp3",
      "/audio/voice/world-yes-seal-rest.mp3",
      "/audio/voice/world-yes-seal-5.mp3",
      "/audio/voice/world-no-seal-2.mp3",
      "/audio/voice/world-no-seal-8.mp3",
      "/audio/voice/world-yes-seal-s.mp3",
      "/audio/voice/world-no-seal-c.mp3",
      "/audio/voice/world-no-seal-t.mp3",
      "/audio/voice/world-yes-seal-5-seals.mp3",
      "/audio/voice/world-no-seal-23.mp3",
      "/audio/voice/world-no-seal-3.mp3",
      "/audio/voice/world-yes-seal-sea.mp3",
      "/audio/voice/world-no-seal-attic.mp3",
      "/audio/voice/world-no-seal-desert.mp3",
      "/audio/voice/world-yes-seal-sock.mp3",
      "/audio/voice/world-no-seal-seal.mp3",
      "/audio/voice/world-no-seal-fish.mp3",
      "/audio/voice/world-yes-bedroom-sleep.mp3",
      "/audio/voice/world-no-bedroom-run.mp3",
      "/audio/voice/world-no-bedroom-drums.mp3",
      "/audio/voice/world-yes-bedroom-3.mp3",
      "/audio/voice/world-no-bedroom-1.mp3",
      "/audio/voice/world-no-bedroom-6.mp3",
      "/audio/voice/world-yes-bedroom-book.mp3",
      "/audio/voice/world-no-bedroom-trumpet.mp3",
      "/audio/voice/world-yes-bedroom-b.mp3",
      "/audio/voice/world-no-bedroom-d.mp3",
      "/audio/voice/world-no-bedroom-p.mp3",
      "/audio/voice/world-yes-bedroom-soft.mp3",
      "/audio/voice/world-no-bedroom-crash.mp3",
      "/audio/voice/world-yes-bedroom-nana.mp3",
      "/audio/voice/world-no-bedroom-pip.mp3",
      "/audio/voice/world-no-bedroom-owl.mp3",
      "/audio/voice/world-no-bedroom-flash.mp3",
      "/audio/voice/world-no-bedroom-bright.mp3",
      "/audio/voice/world-yes-bedroom-rect.mp3",
      "/audio/voice/world-no-bedroom-circle.mp3",
      "/audio/voice/world-no-bedroom-star.mp3",
      "/audio/voice/world-yes-owl-owl.mp3",
      "/audio/voice/world-no-owl-duck.mp3",
      "/audio/voice/world-no-owl-bus.mp3",
      "/audio/voice/world-yes-owl-tree.mp3",
      "/audio/voice/world-no-owl-fridge.mp3",
      "/audio/voice/world-yes-owl-2.mp3",
      "/audio/voice/world-no-owl-1.mp3",
      "/audio/voice/world-no-owl-5.mp3",
      "/audio/voice/world-yes-owl-hunt.mp3",
      "/audio/voice/world-no-owl-bee.mp3",
      "/audio/voice/world-yes-owl-o.mp3",
      "/audio/voice/world-no-owl-a.mp3",
      "/audio/voice/world-no-owl-u.mp3",
      "/audio/voice/world-yes-owl-deep.mp3",
      "/audio/voice/world-no-owl-small.mp3",
      "/audio/voice/world-no-owl-ferry.mp3",
      "/audio/voice/world-yes-owl-6.mp3",
      "/audio/voice/world-no-owl-33.mp3",
      "/audio/voice/world-no-owl-3.mp3",
      "/audio/voice/world-yes-owl-bee.mp3",
      "/audio/voice/world-no-owl-owl.mp3",
      "/audio/voice/world-no-owl-wood.mp3",
      "/audio/voice/world-yes-star-9.mp3",
      "/audio/voice/world-no-star-4.mp3",
      "/audio/voice/world-no-star-12.mp3",
      "/audio/voice/world-yes-star-moon.mp3",
      "/audio/voice/world-no-star-orange.mp3",
      "/audio/voice/world-no-star-m.mp3",
      "/audio/voice/world-yes-star-circle.mp3",
      "/audio/voice/world-no-star-square.mp3",
      "/audio/voice/world-yes-star-9-add.mp3",
      "/audio/voice/world-no-star-45.mp3",
      "/audio/voice/world-no-star-5.mp3",
      "/audio/voice/world-yes-star-rest.mp3",
      "/audio/voice/world-no-star-drum.mp3",
      "/audio/voice/world-no-star-twinkle.mp3",
      "/audio/voice/world-yes-star-rail.mp3",
      "/audio/voice/world-no-star-kettle.mp3",
      "/audio/voice/world-no-star-shoe.mp3",
      "/audio/voice/world-yes-star-star.mp3",
      "/audio/voice/world-no-star-bus.mp3",
      "/audio/voice/world-no-star-spoon.mp3",
      "/audio/voice/world-yes-porch-moth.mp3",
      "/audio/voice/world-yes-porch-5.mp3",
      "/audio/voice/world-no-porch-2.mp3",
      "/audio/voice/world-no-porch-8.mp3",
      "/audio/voice/world-yes-porch-bulbs.mp3",
      "/audio/voice/world-no-porch-penguin.mp3",
      "/audio/voice/world-no-porch-loaf.mp3",
      "/audio/voice/world-no-porch-n.mp3",
      "/audio/voice/world-no-porch-p.mp3",
      "/audio/voice/world-yes-porch-5-add.mp3",
      "/audio/voice/world-no-porch-32.mp3",
      "/audio/voice/world-no-porch-2-panes.mp3",
      "/audio/voice/world-yes-porch-watch.mp3",
      "/audio/voice/world-no-porch-catch.mp3",
      "/audio/voice/world-no-porch-shout.mp3",
      "/audio/voice/world-no-porch-drum.mp3",
      "/audio/voice/world-no-porch-circle.mp3",
      "/audio/voice/world-yes-porch-night.mp3",
      "/audio/voice/world-no-porch-moth.mp3",
      "/audio/voice/world-no-porch-porch.mp3",
      "/audio/voice/world-yes-play.mp3",
      "/audio/voice/world-yes-puppet-puppet.mp3",
      "/audio/voice/world-no-puppet-rock.mp3",
      "/audio/voice/world-no-puppet-spoon.mp3",
      "/audio/voice/world-yes-word-moon.mp3",
      "/audio/voice/world-no-word-sun.mp3",
      "/audio/voice/world-no-word-fish.mp3",
      "/audio/voice/world-yes-rainy-boots.mp3",
      "/audio/voice/world-no-rainy-socks.mp3",
      "/audio/voice/world-no-rainy-hat.mp3",
      "/audio/voice/color-need-orange-purple.mp3",
      "/audio/voice/color-need-orange-green.mp3",
      "/audio/voice/color-need-green-orange.mp3",
      "/audio/voice/color-need-green-purple.mp3",
      "/audio/voice/color-need-purple-orange.mp3",
      "/audio/voice/color-need-purple-green.mp3",
      "/audio/voice/open-play-beep.mp3",
      "/audio/voice/color-need-pink-orange.mp3",
      "/audio/voice/color-need-pink-purple.mp3",
      "/audio/voice/color-need-pink-green.mp3",
      "/audio/voice/color-need-cream-orange.mp3",
      "/audio/voice/color-need-cream-purple.mp3",
      "/audio/voice/color-need-cream-green.mp3",
      "/audio/voice/color-need-sky-orange.mp3",
      "/audio/voice/color-need-sky-purple.mp3",
      "/audio/voice/color-need-sky-green.mp3",
      "/audio/voice/color-mix-until-orange.mp3",
      "/audio/voice/color-mix-until-purple.mp3",
      "/audio/voice/color-mix-until-green.mp3",
      "/audio/voice/book-finish-animal-phonics-safari.mp3",
      "/audio/voice/book-finish-stoop-watermelon.mp3",
      "/audio/voice/book-finish-paper-gutter-boat.mp3",
      "/audio/voice/book-finish-window-box-tomatoes.mp3",
      "/audio/voice/book-finish-folding-table-feast.mp3",
      "/audio/voice/book-finish-how-mail-travels.mp3",
      "/audio/voice/book-finish-how-bread-rises.mp3",
      "/audio/voice/book-finish-what-rain-does.mp3",
      "/audio/voice/book-finish-how-a-ferry-floats.mp3",
      "/audio/voice/book-finish-cat-on-mat.mp3",
      "/audio/voice/book-finish-the-red-bus.mp3",
      "/audio/voice/book-finish-hot-pot-sip.mp3",
      "/audio/voice/book-finish-big-hug-bed.mp3",
      "/audio/voice/book-finish-pig-in-mud.mp3",
      "/audio/voice/book-finish-fox-in-box.mp3",
      "/audio/voice/book-finish-dog-on-log.mp3",
      "/audio/voice/book-finish-hen-in-pen.mp3",
      "/audio/voice/book-finish-bug-in-mug.mp3",
      "/audio/voice/book-finish-hop-on-top.mp3",
      "/audio/voice/book-finish-pancake-saturday.mp3",
      "/audio/voice/book-finish-little-red-fire-truck.mp3",
      "/audio/voice/book-finish-snow-maple-street.mp3",
      "/audio/voice/book-finish-dot-library-mouse.mp3",
      "/audio/voice/book-finish-lemonade-stoop.mp3",
      "/audio/voice/book-finish-night-bus-home.mp3",
      "/audio/voice/book-finish-lost-red-mitten.mp3",
      "/audio/voice/book-finish-nana-porch-swing.mp3",
      "/audio/voice/book-finish-kind-mail-truck.mp3",
      "/audio/voice/book-finish-gully-harbor-morning.mp3",
      "/audio/voice/book-finish-diner-booth-two.mp3",
      "/audio/voice/book-finish-first-day-yellow-bus.mp3",
      "/audio/voice/book-finish-corner-store-bell.mp3",
      "/audio/voice/book-finish-laundromat-rain.mp3",
      "/audio/voice/book-finish-backyard-sprinkler.mp3",
      "/audio/voice/book-finish-red-wagon-hill.mp3",
      "/audio/voice/book-finish-market-saturday-berries.mp3",
      "/audio/voice/book-finish-elevator-buttons.mp3",
      "/audio/voice/book-finish-attic-rain-trunk.mp3",
      "/audio/voice/book-finish-ferry-horn-morning.mp3",
      "/audio/voice/book-finish-sidewalk-chalk-sun.mp3",
      "/audio/voice/book-finish-bakery-window-fog.mp3",
      "/audio/voice/book-finish-hardware-drawer-knobs.mp3",
      "/audio/voice/book-finish-park-bandstand-pigeons.mp3",
      "/audio/voice/book-finish-subway-token-mouse.mp3",
      "/audio/voice/book-finish-porch-dusk-jar.mp3",
      "/audio/voice/book-finish-lighthouse-blink.mp3",
      "/audio/voice/book-finish-corner-shop-ding.mp3",
      "/audio/voice/book-finish-fountain-three-coins.mp3",
      "/audio/voice/book-finish-yellow-taxi-puddle.mp3",
      "/audio/voice/book-finish-lost-key-mat.mp3",
      "/audio/voice/book-finish-quilt-square-moon.mp3",
      "/audio/voice/book-finish-snow-plow-dawn.mp3",
      "/audio/voice/book-finish-icebox-lemonade.mp3",
      "/audio/voice/book-finish-garden-counting.mp3",
      "/audio/voice/book-finish-colors-shapes-circus.mp3",
      "/audio/voice/book-finish-little-bear-bedtime.mp3",
      "/audio/voice/book-finish-buddy-farm-tale.mp3",
      "/audio/voice/book-finish-rocket-space-trip.mp3",
      "/audio/voice/book-finish-ocean-friends-dive.mp3",
      "/audio/voice/book-finish-feelings-with-leo.mp3",
      "/audio/voice/book-finish-cosmic-rocket-journey.mp3",
      "/audio/voice/book-finish-deep-ocean-wonders.mp3",
      "/audio/voice/book-finish-tiny-seed-grows.mp3",
      "/audio/voice/book-finish-bedtime-starlight-lullaby.mp3",
      "/audio/voice/book-finish-magic-manners-tea-party.mp3",
      "/audio/voice/book-finish-the-noisy-farm-chorus.mp3",
      "/audio/voice/book-finish-dino-footprint-detective.mp3",
      "/audio/voice/book-finish-rainy-day-rainbow-builder.mp3",
      "/audio/voice/book-finish-the-brave-little-firefly.mp3",
      "/audio/voice/book-finish-busy-beehive-architects.mp3",
      "/audio/voice/book-finish-the-curious-caterpillar.mp3",
      "/audio/voice/book-finish-the-helpful-little-tugboat.mp3",
      "/audio/voice/book-finish-superhero-phonics-squad.mp3",
      "/audio/voice/book-finish-the-clock-tower-chimes.mp3",
      "/audio/voice/book-finish-little-bear-lost-button.mp3",
      "/audio/voice/book-finish-penguin-floe-night.mp3",
      "/audio/voice/book-finish-owl-wood-lullaby.mp3",
      "/audio/voice/book-finish-high-street-bus.mp3",
      "/audio/voice/book-finish-nana-soup-pot.mp3",
      "/audio/voice/book-finish-pond-edge-bugs.mp3",
      "/audio/voice/book-finish-park-green-picnic.mp3",
      "/audio/voice/book-finish-atelier-paint-day.mp3",
      "/audio/voice/book-finish-letter-meadow-abc.mp3",
      "/audio/voice/book-finish-pine-trail-map.mp3",
      "/audio/voice/book-finish-home-kind-morning.mp3",
      "/audio/voice/mission-farm-helper-start.mp3",
      "/audio/voice/mission-farm-helper-next-kitten.mp3",
      "/audio/voice/mission-farm-helper-next-chicks.mp3",
      "/audio/voice/mission-farm-helper-next-barnaby.mp3",
      "/audio/voice/mission-farm-helper-complete.mp3",
      "/audio/voice/mission-jungle-expedition-start.mp3",
      "/audio/voice/mission-jungle-expedition-next-paws.mp3",
      "/audio/voice/mission-jungle-expedition-next-parrot.mp3",
      "/audio/voice/mission-jungle-expedition-next-bananas.mp3",
      "/audio/voice/mission-jungle-expedition-complete.mp3",
      "/audio/voice/mission-ocean-voyage-start.mp3",
      "/audio/voice/mission-ocean-voyage-next-jellyfish.mp3",
      "/audio/voice/mission-ocean-voyage-next-sort.mp3",
      "/audio/voice/mission-ocean-voyage-complete.mp3",
      "/audio/voice/mission-dino-excavation-start.mp3",
      "/audio/voice/mission-dino-excavation-next-roar.mp3",
      "/audio/voice/mission-dino-excavation-complete.mp3",
      "/audio/voice/mission-moon-voyager-start.mp3",
      "/audio/voice/mission-moon-voyager-next-stars.mp3",
      "/audio/voice/mission-moon-voyager-complete.mp3",
      "/audio/voice/mission-color-wizard-start.mp3",
      "/audio/voice/mission-color-wizard-next-green.mp3",
      "/audio/voice/mission-color-wizard-complete.mp3",
      "/audio/voice/mission-phonics-detective-start.mp3",
      "/audio/voice/mission-phonics-detective-next-s.mp3",
      "/audio/voice/mission-phonics-detective-complete.mp3",
      "/audio/voice/mission-happy-helper-start.mp3",
      "/audio/voice/mission-happy-helper-complete.mp3",
      "/audio/voice/district-puppet-nook-welcome.mp3",
      "/audio/voice/district-word-stream-welcome.mp3",
      "/audio/voice/district-rainy-window-welcome.mp3",
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

  it("maps Sky vs Street and Train Cars hear-again lines", () => {
    expect(narrationClipForText("Does it fly in the sky, or roll on the street?")?.id).toBe(
      "voice.sort.sky-street",
    );
    expect(
      narrationClipForText(
        "Let's sort our animal friends! Who lives on grassy land, and who swims in the sea?",
      )?.id,
    ).toBe("voice.sort.land-ocean");
    expect(narrationClipForText("Look! Count the Train Cars. How many do you see?")?.id).toBe(
      "voice.count.train-cars",
    );
  });

  it("maps Games hub Animals and Shapes correct-answer lines", () => {
    expect(narrationClipForText("Yes! That is the Cow! Moooo! Super star!")?.id).toBe(
      "voice.games.yes-cow",
    );
    expect(narrationClipForText("Yes! That is the Lion! Raaawr! Super star!")?.id).toBe(
      "voice.games.yes-lion",
    );
    expect(narrationClipForText("Yes! That is the Apple! A says Ah, Apple! Super star!")?.id).toBe(
      "voice.games.yes-apple",
    );
    expect(narrationClipForText("Yes! That is the Whale! Giant friendly whale! Super star!")?.id).toBe(
      "voice.games.yes-whale",
    );
    expect(narrationClipForText("Yes! That is the Bunny! Boing boing bunny! Super star!")?.id).toBe(
      "voice.games.yes-bunny",
    );
    expect(narrationClipForText("Wonderful! That is the Golden Star! You found it!")?.id).toBe(
      "voice.games.yes-star",
    );
    expect(narrationClipForText("Wonderful! That is the Warm Heart! You found it!")?.id).toBe(
      "voice.games.yes-heart",
    );
    expect(narrationClipForText("Wonderful! That is the Blue Circle! You found it!")?.id).toBe(
      "voice.games.yes-circle",
    );
    expect(narrationClipForText("Wonderful! That is the Bright Sun! You found it!")?.id).toBe(
      "voice.games.yes-sun",
    );
    expect(narrationClipForText("Wonderful! That is the Green Square! You found it!")?.id).toBe(
      "voice.games.yes-square",
    );
    expect(
      narrationClipForText("Yes! That is the Puppy Dog! Woof woof! Friendly pup! Super star!")?.id,
    ).toBe("voice.games.yes-puppy");
    expect(
      narrationClipForText("Yes! That is the Yellow Duck! Quack quack! Splash! Super star!")?.id,
    ).toBe("voice.games.yes-duck");
    expect(
      narrationClipForText("Yes! That is the Cheeky Monkey! Ooh ooh aah aah! Super star!")?.id,
    ).toBe("voice.games.yes-monkey");
    expect(
      narrationClipForText(
        "Yes! That is the Gentle Elephant! Pawoooot! Big trumpeting elephant! Super star!",
      )?.id,
    ).toBe("voice.games.yes-elephant");
    expect(
      narrationClipForText("Yes! That is the Fluffy Sheep! Baa baa! Soft wool! Super star!")?.id,
    ).toBe("voice.games.yes-sheep");
    expect(narrationClipForText("Wonderful! That is the Orange Triangle! You found it!")?.id).toBe(
      "voice.games.yes-triangle",
    );
    expect(narrationClipForText("Wonderful! That is the Purple Diamond! You found it!")?.id).toBe(
      "voice.games.yes-diamond",
    );
    expect(narrationClipForText("Wonderful! That is the Crescent Moon! You found it!")?.id).toBe(
      "voice.games.yes-moon",
    );
    expect(narrationClipForText("Wonderful! That is the Rainbow Arc! You found it!")?.id).toBe(
      "voice.games.yes-rainbow",
    );
    expect(narrationClipForText("Wonderful! That is the Fluffy Cloud! You found it!")?.id).toBe(
      "voice.games.yes-cloud",
    );
    expect(
      narrationClipForText(
        "Yes! That is the Morning Rooster! Cock a doodle doo! Good morning! Super star!",
      )?.id,
    ).toBe("voice.games.yes-rooster");
    expect(
      narrationClipForText("Yes! That is the Wise Owl! Hoo hoo! Starry night! Super star!")?.id,
    ).toBe("voice.games.yes-owl");
    expect(
      narrationClipForText(
        "Yes! That is the Galloping Horse! Neigh neigh! Clippity clop! Super star!",
      )?.id,
    ).toBe("voice.games.yes-horse");
    expect(
      narrationClipForText("Yes! That is the Happy Piggy! Oink oink! Splish in mud! Super star!")
        ?.id,
    ).toBe("voice.games.yes-piggy");
    expect(
      narrationClipForText("Yes! That is the Turtle! I carry my home wherever I go! Super star!")
        ?.id,
    ).toBe("voice.games.yes-turtle");
    expect(narrationClipForText("Wonderful! That is the Golden Bell! You found it!")?.id).toBe(
      "voice.games.yes-bell",
    );
    expect(narrationClipForText("Wonderful! That is the Red Berry! You found it!")?.id).toBe(
      "voice.games.yes-berry",
    );
    expect(narrationClipForText("Wonderful! That is the Pizza slice! You found it!")?.id).toBe(
      "voice.games.yes-pizza",
    );
    expect(narrationClipForText("Wonderful! That is the Square window! You found it!")?.id).toBe(
      "voice.games.yes-window",
    );
    expect(narrationClipForText("Wonderful! That is the Town clock! You found it!")?.id).toBe(
      "voice.games.yes-clock",
    );
    expect(
      narrationClipForText("Yes! That is the Busy Bee! Buzz buzz! I love flowers! Super star!")
        ?.id,
    ).toBe("voice.games.yes-bee");
    expect(
      narrationClipForText("Yes! That is the Penguin! Waddle, slide, splash! Super star!")?.id,
    ).toBe("voice.games.yes-penguin");
    expect(
      narrationClipForText(
        "Yes! That is the Sunny Sun! Warm sunshine helps plants grow! Super star!",
      )?.id,
    ).toBe("voice.games.yes-sunnysun");
    expect(
      narrationClipForText("Yes! That is the Triangle! Three sides make a triangle! Super star!")
        ?.id,
    ).toBe("voice.games.yes-threesides");
    expect(
      narrationClipForText("Yes! That is the Three! One, two, three! Super star!")?.id,
    ).toBe("voice.games.yes-three");
    expect(
      narrationClipForText("Yes! That is the Banana! A tasty yellow banana! Super star!")?.id,
    ).toBe("voice.games.yes-banana");
    expect(
      narrationClipForText(
        "Yes! That is the Stop and Look! Hold a grown-up's hand and look both ways! Super star!",
      )?.id,
    ).toBe("voice.games.yes-stop");
    expect(
      narrationClipForText("Yes! That is the Giraffe! I reach the tallest leaves! Super star!")
        ?.id,
    ).toBe("voice.games.yes-giraffe");
    expect(
      narrationClipForText("Yes! That is the Rain! Take an umbrella in the rain! Super star!")
        ?.id,
    ).toBe("voice.games.yes-rain");
    expect(
      narrationClipForText("Yes! That is the Dolphin! I swim and leap in the ocean! Super star!")
        ?.id,
    ).toBe("voice.games.yes-dolphin");
    expect(
      narrationClipForText("Yes! That is the Red! The pattern starts again with red! Super star!")
        ?.id,
    ).toBe("voice.games.yes-red");
    expect(narrationClipForText("Yes! That is the Six! Six little bees! Super star!")?.id).toBe(
      "voice.games.yes-six",
    );
    expect(narrationClipForText("Yes! That is the Eight! Eight apples! Super star!")?.id).toBe(
      "voice.games.yes-eight",
    );
    expect(narrationClipForText("Yes! That is the Ten! Ten stars! Super star!")?.id).toBe(
      "voice.games.yes-tenstars",
    );
    expect(narrationClipForText("Yes! That is the D! D comes after C! Super star!")?.id).toBe(
      "voice.games.yes-letter-d",
    );
    expect(narrationClipForText("Yes! That is the O! O comes after N! Super star!")?.id).toBe(
      "voice.games.yes-letter-o",
    );
    expect(narrationClipForText("Yes! That is the F! F says fff, fox! Super star!")?.id).toBe(
      "voice.games.yes-letter-f",
    );
    expect(narrationClipForText("Yes! That is the Ten! After nine comes ten! Super star!")?.id).toBe(
      "voice.games.yes-ten-after-nine",
    );
    expect(narrationClipForText("That's the Dog! Let's try to find Cow!")?.id).toBe(
      "voice.games.no-dog-cow",
    );
    expect(narrationClipForText("That's the Cat! Let's try to find Cow!")?.id).toBe(
      "voice.games.no-cat-cow",
    );
    expect(narrationClipForText("That's the Duck! Let's try to find Cow!")?.id).toBe(
      "voice.games.no-duck-cow",
    );
    expect(narrationClipForText("That's the Bunny! Let's try to find Lion!")?.id).toBe(
      "voice.games.no-bunny-lion",
    );
    expect(narrationClipForText("That's the Frog! Let's try to find Lion!")?.id).toBe(
      "voice.games.no-frog-lion",
    );
    expect(narrationClipForText("That's the Piggy! Let's try to find Lion!")?.id).toBe(
      "voice.games.no-piggy-lion",
    );
    expect(narrationClipForText("That's the Banana! Let's try to find Apple!")?.id).toBe(
      "voice.games.no-banana-apple",
    );
    expect(narrationClipForText("That's the Carrot! Let's try to find Apple!")?.id).toBe(
      "voice.games.no-carrot-apple",
    );
    expect(narrationClipForText("That's the Grapes! Let's try to find Apple!")?.id).toBe(
      "voice.games.no-grapes-apple",
    );
    expect(narrationClipForText("That's the Horse! Let's try to find Whale!")?.id).toBe(
      "voice.games.no-horse-whale",
    );
    expect(narrationClipForText("That's the Bird! Let's try to find Whale!")?.id).toBe(
      "voice.games.no-bird-whale",
    );
    expect(narrationClipForText("That's the Bear! Let's try to find Whale!")?.id).toBe(
      "voice.games.no-bear-whale",
    );
    expect(narrationClipForText("That's the Elephant! Let's try to find Bunny!")?.id).toBe(
      "voice.games.no-elephant-bunny",
    );
    expect(narrationClipForText("That's the Turtle! Let's try to find Bunny!")?.id).toBe(
      "voice.games.no-turtle-bunny",
    );
    expect(narrationClipForText("That's the Sheep! Let's try to find Bunny!")?.id).toBe(
      "voice.games.no-sheep-bunny",
    );
    expect(narrationClipForText("That's the Cat! Let's try to find Puppy Dog!")?.id).toBe(
      "voice.games.no-cat-dog",
    );
    expect(narrationClipForText("That's the Chicken! Let's try to find Puppy Dog!")?.id).toBe(
      "voice.games.no-chicken-dog",
    );
    expect(narrationClipForText("That's the Mouse! Let's try to find Puppy Dog!")?.id).toBe(
      "voice.games.no-mouse-dog",
    );
    expect(narrationClipForText("That's the Frog! Let's try to find Yellow Duck!")?.id).toBe(
      "voice.games.no-frog-duck",
    );
    expect(narrationClipForText("That's the Cow! Let's try to find Yellow Duck!")?.id).toBe(
      "voice.games.no-cow-duck",
    );
    expect(narrationClipForText("That's the Fox! Let's try to find Yellow Duck!")?.id).toBe(
      "voice.games.no-fox-duck",
    );
    expect(narrationClipForText("That's the Bear! Let's try to find Cheeky Monkey!")?.id).toBe(
      "voice.games.no-bear-monkey",
    );
    expect(narrationClipForText("That's the Lion! Let's try to find Cheeky Monkey!")?.id).toBe(
      "voice.games.no-lion-monkey",
    );
    expect(narrationClipForText("That's the Turtle! Let's try to find Cheeky Monkey!")?.id).toBe(
      "voice.games.no-turtle-monkey",
    );
    expect(narrationClipForText("That's the Giraffe! Let's try to find Gentle Elephant!")?.id).toBe(
      "voice.games.no-giraffe-elephant",
    );
    expect(narrationClipForText("That's the Rhino! Let's try to find Gentle Elephant!")?.id).toBe(
      "voice.games.no-rhino-elephant",
    );
    expect(narrationClipForText("That's the Zebra! Let's try to find Gentle Elephant!")?.id).toBe(
      "voice.games.no-zebra-elephant",
    );
    expect(narrationClipForText("That's the Goat! Let's try to find Fluffy Sheep!")?.id).toBe(
      "voice.games.no-goat-sheep",
    );
    expect(narrationClipForText("That's the Horse! Let's try to find Fluffy Sheep!")?.id).toBe(
      "voice.games.no-horse-sheep",
    );
    expect(narrationClipForText("That's the Piggy! Let's try to find Fluffy Sheep!")?.id).toBe(
      "voice.games.no-pig-sheep",
    );
    expect(narrationClipForText("That's the Night Owl! Let's try to find Morning Rooster!")?.id).toBe(
      "voice.games.no-owl-rooster",
    );
    expect(narrationClipForText("That's the Parrot! Let's try to find Morning Rooster!")?.id).toBe(
      "voice.games.no-parrot-rooster",
    );
    expect(narrationClipForText("That's the Duck! Let's try to find Morning Rooster!")?.id).toBe(
      "voice.games.no-duck-rooster",
    );
    expect(narrationClipForText("That's the Bat! Let's try to find Wise Owl!")?.id).toBe(
      "voice.games.no-bat-owl",
    );
    expect(narrationClipForText("That's the Bluebird! Let's try to find Wise Owl!")?.id).toBe(
      "voice.games.no-bird-owl",
    );
    expect(narrationClipForText("That's the Honeybee! Let's try to find Wise Owl!")?.id).toBe(
      "voice.games.no-bee-owl",
    );
    expect(narrationClipForText("That's the Cow! Let's try to find Galloping Horse!")?.id).toBe(
      "voice.games.no-cow-horse",
    );
    expect(narrationClipForText("That's the Spotted Deer! Let's try to find Galloping Horse!")?.id).toBe(
      "voice.games.no-deer-horse",
    );
    expect(narrationClipForText("That's the Dog! Let's try to find Galloping Horse!")?.id).toBe(
      "voice.games.no-dog-horse",
    );
    expect(narrationClipForText("That's the Hippo! Let's try to find Happy Piggy!")?.id).toBe(
      "voice.games.no-hippo-pig",
    );
    expect(narrationClipForText("That's the Bunny! Let's try to find Happy Piggy!")?.id).toBe(
      "voice.games.no-bunny-pig",
    );
    expect(narrationClipForText("That's the Kitten! Let's try to find Happy Piggy!")?.id).toBe(
      "voice.games.no-cat-pig",
    );
    expect(narrationClipForText("That's the Rabbit! Let's try to find Turtle!")?.id).toBe(
      "voice.games.no-rabbit-turtle",
    );
    expect(narrationClipForText("That's the Fish! Let's try to find Turtle!")?.id).toBe(
      "voice.games.no-fish-turtle",
    );
    expect(narrationClipForText("That's the Bird! Let's try to find Turtle!")?.id).toBe(
      "voice.games.no-bird-turtle",
    );
    expect(narrationClipForText("That's the Frog! Let's try to find Busy Bee!")?.id).toBe(
      "voice.games.no-frog-bee",
    );
    expect(narrationClipForText("That's the Duck! Let's try to find Busy Bee!")?.id).toBe(
      "voice.games.no-duck-bee",
    );
    expect(narrationClipForText("That's the Kitten! Let's try to find Busy Bee!")?.id).toBe(
      "voice.games.no-cat-bee",
    );
    expect(narrationClipForText("That's the Camel! Let's try to find Penguin!")?.id).toBe(
      "voice.games.no-camel-penguin",
    );
    expect(narrationClipForText("That's the Monkey! Let's try to find Penguin!")?.id).toBe(
      "voice.games.no-monkey-penguin",
    );
    expect(narrationClipForText("That's the Cow! Let's try to find Penguin!")?.id).toBe(
      "voice.games.no-cow-penguin",
    );
    expect(narrationClipForText("That's the Moon! Let's try to find Sunny Sun!")?.id).toBe(
      "voice.games.no-moon-sun",
    );
    expect(narrationClipForText("That's the Snowflake! Let's try to find Sunny Sun!")?.id).toBe(
      "voice.games.no-snow-sun",
    );
    expect(narrationClipForText("That's the Star! Let's try to find Sunny Sun!")?.id).toBe(
      "voice.games.no-star-sun",
    );
    expect(narrationClipForText("That's the Circle! Let's try to find Triangle!")?.id).toBe(
      "voice.games.no-circle-triangle",
    );
    expect(narrationClipForText("That's the Square! Let's try to find Triangle!")?.id).toBe(
      "voice.games.no-square-triangle",
    );
    expect(narrationClipForText("That's the Star! Let's try to find Triangle!")?.id).toBe(
      "voice.games.no-star-triangle",
    );
    expect(narrationClipForText("That's the One! Let's try to find Three!")?.id).toBe(
      "voice.games.no-one-three",
    );
    expect(narrationClipForText("That's the Five! Let's try to find Three!")?.id).toBe(
      "voice.games.no-five-three",
    );
    expect(narrationClipForText("That's the Two! Let's try to find Three!")?.id).toBe(
      "voice.games.no-two-three",
    );
    expect(narrationClipForText("That's the Apple! Let's try to find Banana!")?.id).toBe(
      "voice.games.no-apple-banana",
    );
    expect(narrationClipForText("That's the Grapes! Let's try to find Banana!")?.id).toBe(
      "voice.games.no-grapes-banana",
    );
    expect(narrationClipForText("That's the Lemon! Let's try to find Banana!")?.id).toBe(
      "voice.games.no-lemon-banana",
    );
    expect(narrationClipForText("That's the Run fast! Let's try to find Stop and Look!")?.id).toBe(
      "voice.games.no-run-stop",
    );
    expect(narrationClipForText("That's the Play ball! Let's try to find Stop and Look!")?.id).toBe(
      "voice.games.no-play-stop",
    );
    expect(narrationClipForText("That's the Hide! Let's try to find Stop and Look!")?.id).toBe(
      "voice.games.no-hide-stop",
    );
    expect(narrationClipForText("That's the Zebra! Let's try to find Giraffe!")?.id).toBe(
      "voice.games.no-zebra-giraffe",
    );
    expect(narrationClipForText("That's the Lion! Let's try to find Giraffe!")?.id).toBe(
      "voice.games.no-lion-giraffe",
    );
    expect(narrationClipForText("That's the Hippo! Let's try to find Giraffe!")?.id).toBe(
      "voice.games.no-hippo-giraffe",
    );
    expect(narrationClipForText("That's the Sunshine! Let's try to find Rain!")?.id).toBe(
      "voice.games.no-sun-rain",
    );
    expect(narrationClipForText("That's the Wind! Let's try to find Rain!")?.id).toBe(
      "voice.games.no-wind-rain",
    );
    expect(narrationClipForText("That's the Rainbow! Let's try to find Rain!")?.id).toBe(
      "voice.games.no-rainbow-rain",
    );
    expect(
      narrationClipForText(
        "Trace the letter A. Start on the blue dot. One line. Letter A says a. Attic. Apple. Ant.",
      )?.id,
    ).toBe("voice.phonics.trace-a");
    expect(
      narrationClipForText(
        "Trace the letter B. Start on the blue dot. One line. Letter B says buh. Bus. Bun. Bell.",
      )?.id,
    ).toBe("voice.phonics.trace-b");
    expect(
      narrationClipForText(
        "Trace the letter C. Start on the blue dot. One line. Letter C says kuh. Cat. Cup. Coin.",
      )?.id,
    ).toBe("voice.phonics.trace-c");
    expect(
      narrationClipForText(
        "Trace the letter D. Start on the blue dot. One line. Letter D says duh. Dock. Door. Dot.",
      )?.id,
    ).toBe("voice.phonics.trace-d");
    expect(
      narrationClipForText(
        "Trace the letter E. Start on the blue dot. One line. Letter E says eh. Egg. Exit. End.",
      )?.id,
    ).toBe("voice.phonics.trace-e");
    expect(
      narrationClipForText(
        "Trace the letter F. Start on the blue dot. One line. Letter F says fff. Ferry. Fog. Fish.",
      )?.id,
    ).toBe("voice.phonics.trace-f");
    expect(
      narrationClipForText(
        "Trace the letter G. Start on the blue dot. One line. Letter G says guh. Gull. Gate. Gum.",
      )?.id,
    ).toBe("voice.phonics.trace-g");
    expect(
      narrationClipForText(
        "Trace the letter H. Start on the blue dot. One line. Letter H says huh. Hat. Home. Hop.",
      )?.id,
    ).toBe("voice.phonics.trace-h");
    expect(
      narrationClipForText(
        "Trace the letter I. Start on the blue dot. One line. Letter I says ih. Ink. In. Igloo.",
      )?.id,
    ).toBe("voice.phonics.trace-i");
    expect(
      narrationClipForText(
        "Trace the letter J. Start on the blue dot. One line. Letter J says juh. Jam. Jar. Jump.",
      )?.id,
    ).toBe("voice.phonics.trace-j");
    expect(narrationClipForText("Yes! Letter A says a. Attic. Apple. Ant.")?.id).toBe(
      "voice.phonics.yes-a",
    );
    expect(narrationClipForText("Yes! Letter B says buh. Bus. Bun. Bell.")?.id).toBe(
      "voice.phonics.yes-b",
    );
    expect(narrationClipForText("Yes! Letter C says kuh. Cat. Cup. Coin.")?.id).toBe(
      "voice.phonics.yes-c",
    );
    expect(narrationClipForText("Yes! Letter D says duh. Dock. Door. Dot.")?.id).toBe(
      "voice.phonics.yes-d",
    );
    expect(narrationClipForText("Yes! Letter E says eh. Egg. Exit. End.")?.id).toBe(
      "voice.phonics.yes-e",
    );
    expect(narrationClipForText("Yes! Letter F says fff. Ferry. Fog. Fish.")?.id).toBe(
      "voice.phonics.yes-f",
    );
    expect(narrationClipForText("Yes! Letter G says guh. Gull. Gate. Gum.")?.id).toBe(
      "voice.phonics.yes-g",
    );
    expect(narrationClipForText("Yes! Letter H says huh. Hat. Home. Hop.")?.id).toBe(
      "voice.phonics.yes-h",
    );
    expect(narrationClipForText("Yes! Letter I says ih. Ink. In. Igloo.")?.id).toBe(
      "voice.phonics.yes-i",
    );
    expect(narrationClipForText("Yes! Letter J says juh. Jam. Jar. Jump.")?.id).toBe(
      "voice.phonics.yes-j",
    );
    expect(
      narrationClipForText(
        "Trace the letter K. Start on the blue dot. One line. Letter K says kuh. Key. Kite. King.",
      )?.id,
    ).toBe("voice.phonics.trace-k");
    expect(
      narrationClipForText(
        "Trace the letter L. Start on the blue dot. One line. Letter L says lll. Loaf. Lamp. Line.",
      )?.id,
    ).toBe("voice.phonics.trace-l");
    expect(
      narrationClipForText(
        "Trace the letter M. Start on the blue dot. One line. Letter M says mmm. Mat. Moon. Milk.",
      )?.id,
    ).toBe("voice.phonics.trace-m");
    expect(
      narrationClipForText(
        "Trace the letter N. Start on the blue dot. One line. Letter N says nnn. Nest. Nap. Nana.",
      )?.id,
    ).toBe("voice.phonics.trace-n");
    expect(
      narrationClipForText(
        "Trace the letter O. Start on the blue dot. One line. Letter O says o. Orange. On. Otter.",
      )?.id,
    ).toBe("voice.phonics.trace-o");
    expect(
      narrationClipForText(
        "Trace the letter P. Start on the blue dot. One line. Letter P says puh. Porch. Pan. Peg.",
      )?.id,
    ).toBe("voice.phonics.trace-p");
    expect(
      narrationClipForText(
        "Trace the letter Q. Start on the blue dot. One line. Letter Q says kwuh. Quilt. Quiet. Queen.",
      )?.id,
    ).toBe("voice.phonics.trace-q");
    expect(
      narrationClipForText(
        "Trace the letter R. Start on the blue dot. One line. Letter R says rrr. Rain. Rope. Red.",
      )?.id,
    ).toBe("voice.phonics.trace-r");
    expect(
      narrationClipForText(
        "Trace the letter S. Start on the blue dot. One line. Letter S says sss. Stoop. Sun. Sock.",
      )?.id,
    ).toBe("voice.phonics.trace-s");
    expect(
      narrationClipForText(
        "Trace the letter T. Start on the blue dot. One line. Letter T says tuh. Taxi. Toast. Token.",
      )?.id,
    ).toBe("voice.phonics.trace-t");
    expect(narrationClipForText("Yes! Letter K says kuh. Key. Kite. King.")?.id).toBe(
      "voice.phonics.yes-k",
    );
    expect(narrationClipForText("Yes! Letter L says lll. Loaf. Lamp. Line.")?.id).toBe(
      "voice.phonics.yes-l",
    );
    expect(narrationClipForText("Yes! Letter M says mmm. Mat. Moon. Milk.")?.id).toBe(
      "voice.phonics.yes-m",
    );
    expect(narrationClipForText("Yes! Letter N says nnn. Nest. Nap. Nana.")?.id).toBe(
      "voice.phonics.yes-n",
    );
    expect(narrationClipForText("Yes! Letter O says o. Orange. On. Otter.")?.id).toBe(
      "voice.phonics.yes-o",
    );
    expect(narrationClipForText("Yes! Letter P says puh. Porch. Pan. Peg.")?.id).toBe(
      "voice.phonics.yes-p",
    );
    expect(narrationClipForText("Yes! Letter Q says kwuh. Quilt. Quiet. Queen.")?.id).toBe(
      "voice.phonics.yes-q",
    );
    expect(narrationClipForText("Yes! Letter R says rrr. Rain. Rope. Red.")?.id).toBe(
      "voice.phonics.yes-r",
    );
    expect(narrationClipForText("Yes! Letter S says sss. Stoop. Sun. Sock.")?.id).toBe(
      "voice.phonics.yes-s",
    );
    expect(narrationClipForText("Yes! Letter T says tuh. Taxi. Toast. Token.")?.id).toBe(
      "voice.phonics.yes-t",
    );
    expect(
      narrationClipForText(
        "Trace the letter U. Start on the blue dot. One line. Letter U says uh. Umbrella. Up. Under.",
      )?.id,
    ).toBe("voice.phonics.trace-u");
    expect(
      narrationClipForText(
        "Trace the letter V. Start on the blue dot. One line. Letter V says vvv. Van. Vine. Vest.",
      )?.id,
    ).toBe("voice.phonics.trace-v");
    expect(
      narrationClipForText(
        "Trace the letter W. Start on the blue dot. One line. Letter W says wuh. Wash. Window. Wagon.",
      )?.id,
    ).toBe("voice.phonics.trace-w");
    expect(
      narrationClipForText(
        "Trace the letter X. Start on the blue dot. One line. Letter X says ks. Box. Fox. Six.",
      )?.id,
    ).toBe("voice.phonics.trace-x");
    expect(
      narrationClipForText(
        "Trace the letter Y. Start on the blue dot. One line. Letter Y says yuh. Yellow. Yarn. Yard.",
      )?.id,
    ).toBe("voice.phonics.trace-y");
    expect(
      narrationClipForText(
        "Trace the letter Z. Start on the blue dot. One line. Letter Z says zzz. Zip. Zigzag. Zoo.",
      )?.id,
    ).toBe("voice.phonics.trace-z");
    expect(narrationClipForText("Yes! Letter U says uh. Umbrella. Up. Under.")?.id).toBe(
      "voice.phonics.yes-u",
    );
    expect(narrationClipForText("Yes! Letter V says vvv. Van. Vine. Vest.")?.id).toBe(
      "voice.phonics.yes-v",
    );
    expect(narrationClipForText("Yes! Letter W says wuh. Wash. Window. Wagon.")?.id).toBe(
      "voice.phonics.yes-w",
    );
    expect(narrationClipForText("Yes! Letter X says ks. Box. Fox. Six.")?.id).toBe(
      "voice.phonics.yes-x",
    );
    expect(narrationClipForText("Yes! Letter Y says yuh. Yellow. Yarn. Yard.")?.id).toBe(
      "voice.phonics.yes-y",
    );
    expect(narrationClipForText("Yes! Letter Z says zzz. Zip. Zigzag. Zoo.")?.id).toBe(
      "voice.phonics.yes-z",
    );
    expect(narrationClipForText("That's the Chicken! Let's try to find Dolphin!")?.id).toBe(
      "voice.games.no-chicken-dolphin",
    );
    expect(narrationClipForText("That's the Camel! Let's try to find Dolphin!")?.id).toBe(
      "voice.games.no-camel-dolphin",
    );
    expect(narrationClipForText("That's the Sheep! Let's try to find Dolphin!")?.id).toBe(
      "voice.games.no-sheep-dolphin",
    );
    expect(narrationClipForText("That's the Blue! Let's try to find Red!")?.id).toBe(
      "voice.games.no-blue-red",
    );
    expect(narrationClipForText("That's the Green! Let's try to find Red!")?.id).toBe(
      "voice.games.no-green-red",
    );
    expect(narrationClipForText("That's the Yellow! Let's try to find Red!")?.id).toBe(
      "voice.games.no-yellow-red",
    );
    expect(narrationClipForText("That's the Four! Let's try to find Six!")?.id).toBe(
      "voice.games.no-four-six",
    );
    expect(narrationClipForText("That's the Two! Let's try to find Six!")?.id).toBe(
      "voice.games.no-two-six",
    );
    expect(narrationClipForText("That's the Nine! Let's try to find Six!")?.id).toBe(
      "voice.games.no-nine-six",
    );
    expect(narrationClipForText("That's the Three! Let's try to find Eight!")?.id).toBe(
      "voice.games.no-three-eight",
    );
    expect(narrationClipForText("That's the Five! Let's try to find Eight!")?.id).toBe(
      "voice.games.no-five-eight",
    );
    expect(narrationClipForText("That's the One! Let's try to find Eight!")?.id).toBe(
      "voice.games.no-one-eight",
    );
    expect(narrationClipForText("That's the Seven! Let's try to find Ten!")?.id).toBe(
      "voice.games.no-seven-ten",
    );
    expect(narrationClipForText("That's the Two! Let's try to find Ten!")?.id).toBe(
      "voice.games.no-two-ten",
    );
    expect(narrationClipForText("That's the Four! Let's try to find Ten!")?.id).toBe(
      "voice.games.no-four-ten",
    );
    expect(narrationClipForText("That's the M! Let's try to find D!")?.id).toBe(
      "voice.games.no-m-d",
    );
    expect(narrationClipForText("That's the S! Let's try to find D!")?.id).toBe(
      "voice.games.no-s-d",
    );
    expect(narrationClipForText("That's the Z! Let's try to find D!")?.id).toBe(
      "voice.games.no-z-d",
    );
    expect(narrationClipForText("That's the A! Let's try to find O!")?.id).toBe(
      "voice.games.no-a-o",
    );
    expect(narrationClipForText("That's the T! Let's try to find O!")?.id).toBe(
      "voice.games.no-t-o",
    );
    expect(narrationClipForText("That's the K! Let's try to find O!")?.id).toBe(
      "voice.games.no-k-o",
    );
    expect(narrationClipForText("That's the S! Let's try to find F!")?.id).toBe(
      "voice.games.no-s-f",
    );
    expect(narrationClipForText("That's the B! Let's try to find F!")?.id).toBe(
      "voice.games.no-b-f",
    );
    expect(narrationClipForText("That's the M! Let's try to find F!")?.id).toBe(
      "voice.games.no-m-f",
    );
    expect(narrationClipForText("That's the Eight! Let's try to find Ten!")?.id).toBe(
      "voice.games.no-eight-ten",
    );
    expect(narrationClipForText("That's the Five! Let's try to find Ten!")?.id).toBe(
      "voice.games.no-five-ten",
    );
    expect(narrationClipForText("That's the Blue Circle! Let's find Golden Star!")?.id).toBe(
      "voice.games.no-circle-star",
    );
    expect(narrationClipForText("That's the Green Square! Let's find Golden Star!")?.id).toBe(
      "voice.games.no-square-star",
    );
    expect(narrationClipForText("That's the Pink Heart! Let's find Golden Star!")?.id).toBe(
      "voice.games.no-heart-star",
    );
    expect(narrationClipForText("That's the Purple Diamond! Let's find Warm Heart!")?.id).toBe(
      "voice.games.no-diamond-heart",
    );
    expect(narrationClipForText("That's the Red Circle! Let's find Warm Heart!")?.id).toBe(
      "voice.games.no-circle-heart",
    );
    expect(narrationClipForText("That's the Yellow Sun! Let's find Warm Heart!")?.id).toBe(
      "voice.games.no-sun-heart",
    );
    expect(narrationClipForText("That's the Orange Triangle! Let's find Blue Circle!")?.id).toBe(
      "voice.games.no-triangle-circle",
    );
    expect(narrationClipForText("That's the Green Square! Let's find Blue Circle!")?.id).toBe(
      "voice.games.no-square-circle",
    );
    expect(narrationClipForText("That's the Golden Star! Let's find Blue Circle!")?.id).toBe(
      "voice.games.no-star-circle",
    );
    expect(narrationClipForText("That's the Sleepy Moon! Let's find Bright Sun!")?.id).toBe(
      "voice.games.no-sleepy-moon-sun",
    );
    expect(narrationClipForText("That's the Fluffy Cloud! Let's find Bright Sun!")?.id).toBe(
      "voice.games.no-cloud-sun",
    );
    expect(narrationClipForText("That's the Rainbow! Let's find Bright Sun!")?.id).toBe(
      "voice.games.no-rainbow-sun",
    );
    expect(narrationClipForText("That's the Orange Circle! Let's find Green Square!")?.id).toBe(
      "voice.games.no-circle-square",
    );
    expect(narrationClipForText("That's the Yellow Triangle! Let's find Green Square!")?.id).toBe(
      "voice.games.no-triangle-square",
    );
    expect(narrationClipForText("That's the Star! Let's find Green Square!")?.id).toBe(
      "voice.games.no-star-square",
    );
    expect(narrationClipForText("That's the Blue Circle! Let's find Orange Triangle!")?.id).toBe(
      "voice.games.no-blue-circle-triangle",
    );
    expect(narrationClipForText("That's the Pink Heart! Let's find Orange Triangle!")?.id).toBe(
      "voice.games.no-heart-triangle",
    );
    expect(narrationClipForText("That's the Purple Square! Let's find Orange Triangle!")?.id).toBe(
      "voice.games.no-purple-square-triangle",
    );
    expect(narrationClipForText("That's the Circle! Let's find Purple Diamond!")?.id).toBe(
      "voice.games.no-circle-diamond",
    );
    expect(narrationClipForText("That's the Sun! Let's find Purple Diamond!")?.id).toBe(
      "voice.games.no-sun-diamond",
    );
    expect(narrationClipForText("That's the Cloud! Let's find Purple Diamond!")?.id).toBe(
      "voice.games.no-cloud-diamond",
    );
    expect(narrationClipForText("That's the Daytime Sun! Let's find Crescent Moon!")?.id).toBe(
      "voice.games.no-sun-moon",
    );
    expect(narrationClipForText("That's the Pink Heart! Let's find Crescent Moon!")?.id).toBe(
      "voice.games.no-heart-moon",
    );
    expect(narrationClipForText("That's the Golden Star! Let's find Crescent Moon!")?.id).toBe(
      "voice.games.no-star-moon",
    );
    expect(narrationClipForText("That's the Raincloud! Let's find Rainbow Arc!")?.id).toBe(
      "voice.games.no-cloud-rainbow",
    );
    expect(narrationClipForText("That's the Blue Circle! Let's find Rainbow Arc!")?.id).toBe(
      "voice.games.no-circle-rainbow",
    );
    expect(narrationClipForText("That's the Green Square! Let's find Rainbow Arc!")?.id).toBe(
      "voice.games.no-square-rainbow",
    );
    expect(narrationClipForText("That's the Star! Let's find Fluffy Cloud!")?.id).toBe(
      "voice.games.no-star-cloud",
    );
    expect(narrationClipForText("That's the Sun! Let's find Fluffy Cloud!")?.id).toBe(
      "voice.games.no-sun-cloud",
    );
    expect(narrationClipForText("That's the Heart! Let's find Fluffy Cloud!")?.id).toBe(
      "voice.games.no-heart-cloud",
    );
    expect(narrationClipForText("That's the Blue Square! Let's find Golden Bell!")?.id).toBe(
      "voice.games.no-square-bell",
    );
    expect(narrationClipForText("That's the Green Circle! Let's find Golden Bell!")?.id).toBe(
      "voice.games.no-circle-bell",
    );
    expect(narrationClipForText("That's the Diamond! Let's find Golden Bell!")?.id).toBe(
      "voice.games.no-diamond-bell",
    );
    expect(narrationClipForText("That's the Yellow Circle! Let's find Red Berry!")?.id).toBe(
      "voice.games.no-circle-berry",
    );
    expect(narrationClipForText("That's the Blue Triangle! Let's find Red Berry!")?.id).toBe(
      "voice.games.no-triangle-berry",
    );
    expect(narrationClipForText("That's the Green Square! Let's find Red Berry!")?.id).toBe(
      "voice.games.no-square-berry",
    );
    expect(narrationClipForText("That's the Round plate! Let's find Pizza slice!")?.id).toBe(
      "voice.games.no-plate-pizza",
    );
    expect(narrationClipForText("That's the Window! Let's find Pizza slice!")?.id).toBe(
      "voice.games.no-window-pizza",
    );
    expect(narrationClipForText("That's the Clock! Let's find Pizza slice!")?.id).toBe(
      "voice.games.no-clock-pizza",
    );
    expect(narrationClipForText("That's the Ball! Let's find Square window!")?.id).toBe(
      "voice.games.no-ball-window",
    );
    expect(narrationClipForText("That's the Pizza! Let's find Square window!")?.id).toBe(
      "voice.games.no-slice-window",
    );
    expect(narrationClipForText("That's the Moon! Let's find Square window!")?.id).toBe(
      "voice.games.no-moon-window",
    );
    expect(narrationClipForText("That's the Door! Let's find Town clock!")?.id).toBe(
      "voice.games.no-door-clock",
    );
    expect(narrationClipForText("That's the Pizza! Let's find Town clock!")?.id).toBe(
      "voice.games.no-slice-clock",
    );
    expect(narrationClipForText("That's the Book! Let's find Town clock!")?.id).toBe(
      "voice.games.no-book-clock",
    );
    expect(narrationClipForText("1! Munch munch munch! Yummy!")?.id).toBe(
      "voice.games.benny-munch-1",
    );
    expect(narrationClipForText("2! Munch munch munch! Yummy!")?.id).toBe(
      "voice.games.benny-munch-2",
    );
    expect(narrationClipForText("3! Munch munch munch! Yummy!")?.id).toBe(
      "voice.games.benny-munch-3",
    );
    expect(narrationClipForText("4! Munch munch munch! Yummy!")?.id).toBe(
      "voice.games.benny-munch-4",
    );
    expect(narrationClipForText("5! Munch munch munch! Yummy!")?.id).toBe(
      "voice.games.benny-munch-5",
    );
    expect(narrationClipForText("6! Munch munch munch! Yummy!")?.id).toBe(
      "voice.games.benny-munch-6",
    );
    expect(narrationClipForText("7! Munch munch munch! Yummy!")?.id).toBe(
      "voice.games.benny-munch-7",
    );
    expect(narrationClipForText("8! Munch munch munch! Yummy!")?.id).toBe(
      "voice.games.benny-munch-8",
    );
    expect(narrationClipForText("9! Munch munch munch! Yummy!")?.id).toBe(
      "voice.games.benny-munch-9",
    );
    expect(narrationClipForText("Bunny is hungrier! This time count to 8!")?.id).toBe(
      "voice.games.benny-hungrier-8",
    );
    expect(narrationClipForText("Bunny is hungrier! This time count to 10!")?.id).toBe(
      "voice.games.benny-hungrier-10",
    );
    expect(narrationClipForText("Bunny is ready to eat again! Tap the crunchy carrots!")?.id).toBe(
      "voice.games.benny-ready",
    );
    expect(narrationClipForText("Pop!")?.id).toBe("voice.games.bubble-short-pop");
    expect(narrationClipForText("Super!")?.id).toBe("voice.games.bubble-super");
    expect(narrationClipForText("Sparkle!")?.id).toBe("voice.games.bubble-sparkle");
    expect(narrationClipForText("Wheee!")?.id).toBe("voice.games.bubble-wheee");
    expect(narrationClipForText("Hooray! Dragonfly! A dragonfly over the reeds.")?.id).toBe(
      "voice.world.yes-pond-dragon",
    );
    expect(narrationClipForText("That is Hen! Hens stay in the yard. Let's try again!")?.id).toBe(
      "voice.world.no-pond-hen",
    );
    expect(narrationClipForText("That is Truck! Trucks stay on roads. Let's try again!")?.id).toBe(
      "voice.world.no-pond-truck",
    );
    expect(narrationClipForText("Hooray! Pond skater! Skaters live on the pond skin.")?.id).toBe(
      "voice.world.yes-pond-skater",
    );
    expect(narrationClipForText("That is Ladybird! Ladybirds stay on leaves. Let's try again!")?.id).toBe(
      "voice.world.no-pond-lady",
    );
    expect(narrationClipForText("That is Bee! Bees visit flowers. Let's try again!")?.id).toBe(
      "voice.world.no-pond-bee",
    );
    expect(narrationClipForText("Hooray! 8 pads! Eight pads.")?.id).toBe("voice.world.yes-pond-8");
    expect(narrationClipForText("That is 4 pads! Count the whole ring. Let's try again!")?.id).toBe(
      "voice.world.no-pond-4",
    );
    expect(narrationClipForText("That is 11 pads! Not eleven. Let's try again!")?.id).toBe(
      "voice.world.no-pond-11",
    );
    expect(narrationClipForText("Hooray! Wet reeds! By the wet reeds.")?.id).toBe(
      "voice.world.yes-pond-reeds",
    );
    expect(narrationClipForText("That is Bakery! Too dry and floury. Let's try again!")?.id).toBe(
      "voice.world.no-pond-bakery",
    );
    expect(narrationClipForText("That is Runway! Planes, not frogs. Let's try again!")?.id).toBe(
      "voice.world.no-pond-runway",
    );
    expect(narrationClipForText("Hooray! Frog! A frog hopped in.")?.id).toBe(
      "voice.world.yes-pond-frog",
    );
    expect(
      narrationClipForText("That is Plane! Planes whoosh, they do not plop here. Let's try again!")
        ?.id,
    ).toBe("voice.world.no-pond-plane");
    expect(
      narrationClipForText("That is A bell! Bells ring, they do not plop. Let's try again!")?.id,
    ).toBe("voice.world.no-pond-bell");
    expect(narrationClipForText("Hooray! P! Pond starts with P.")?.id).toBe("voice.world.yes-pond-p");
    expect(narrationClipForText("That is B! B starts bug. Let's try again!")?.id).toBe(
      "voice.world.no-pond-b",
    );
    expect(narrationClipForText("That is D! D starts dog. Let's try again!")?.id).toBe(
      "voice.world.no-pond-d",
    );
    expect(narrationClipForText("Hooray! Circle! A round pad.")?.id).toBe(
      "voice.world.yes-pond-circle",
    );
    expect(narrationClipForText("That is Star! Stars are pointy. Let's try again!")?.id).toBe(
      "voice.world.no-pond-star",
    );
    expect(narrationClipForText("That is Square! This pad is round. Let's try again!")?.id).toBe(
      "voice.world.no-pond-square",
    );
    expect(narrationClipForText("Hooray! 6 frogs! Two and four make six.")?.id).toBe(
      "voice.world.yes-pond-6",
    );
    expect(narrationClipForText("That is 24 frogs! Add the groups. Let's try again!")?.id).toBe(
      "voice.world.no-pond-24",
    );
    expect(narrationClipForText("That is 4 frogs! Count both banks. Let's try again!")?.id).toBe(
      "voice.world.no-pond-4-frogs",
    );
    expect(narrationClipForText("Hooray! Cricket! A cricket in the grass.")?.id).toBe(
      "voice.world.yes-night-cricket",
    );
    expect(narrationClipForText("That is Cow! Cows moo in the day field. Let's try again!")?.id).toBe(
      "voice.world.no-night-cow",
    );
    expect(narrationClipForText("That is Plane! Planes whoosh the sky. Let's try again!")?.id).toBe(
      "voice.world.no-night-plane",
    );
    expect(narrationClipForText("Hooray! Moth! A moth at the lamp.")?.id).toBe(
      "voice.world.yes-night-moth",
    );
    expect(narrationClipForText("That is Shark! Sharks stay in the sea. Let's try again!")?.id).toBe(
      "voice.world.no-night-shark",
    );
    expect(narrationClipForText("That is Bus! Buses stay on roads. Let's try again!")?.id).toBe(
      "voice.world.no-night-bus",
    );
    expect(narrationClipForText("Hooray! Cricket! Crickets sing at night.")?.id).toBe(
      "voice.world.yes-night-cricket-sing",
    );
    expect(
      narrationClipForText("That is Bee! Bees work in the day flowers. Let's try again!")?.id,
    ).toBe("voice.world.no-night-bee");
    expect(narrationClipForText("That is Rooster! Roosters shout at dawn. Let's try again!")?.id).toBe(
      "voice.world.no-night-rooster",
    );
    expect(narrationClipForText("Hooray! 4 moths! Four moths.")?.id).toBe("voice.world.yes-night-4");
    expect(narrationClipForText("That is 1 moth! Count the whole glass. Let's try again!")?.id).toBe(
      "voice.world.no-night-1",
    );
    expect(narrationClipForText("That is 7 moths! Not seven tonight. Let's try again!")?.id).toBe(
      "voice.world.no-night-7",
    );
    expect(narrationClipForText("Hooray! Soft notes! Quiet notes for night.")?.id).toBe(
      "voice.world.yes-night-soft",
    );
    expect(narrationClipForText("That is Crash! Too loud for moths. Let's try again!")?.id).toBe(
      "voice.world.no-night-crash",
    );
    expect(narrationClipForText("That is Shout! We play, we do not shout. Let's try again!")?.id).toBe(
      "voice.world.no-night-shout",
    );
    expect(narrationClipForText("Hooray! M! Moth starts with M.")?.id).toBe("voice.world.yes-night-m");
    expect(narrationClipForText("That is N! N starts nest. Let's try again!")?.id).toBe(
      "voice.world.no-night-n",
    );
    expect(narrationClipForText("That is S! S starts sun. Let's try again!")?.id).toBe(
      "voice.world.no-night-s",
    );
    expect(narrationClipForText("Hooray! Nana! Nana spoke last.")?.id).toBe("voice.world.yes-night-nana");
    expect(narrationClipForText("That is Pip! Pip spoke first. Let's try again!")?.id).toBe(
      "voice.world.no-night-pip",
    );
    expect(narrationClipForText("That is The dog! No dog in this whisper. Let's try again!")?.id).toBe(
      "voice.world.no-night-dog",
    );
    expect(narrationClipForText("Hooray! Dim! AB continues with dim.")?.id).toBe(
      "voice.world.yes-night-dim",
    );
    expect(narrationClipForText("That is Crash! This pattern is glows. Let's try again!")?.id).toBe(
      "voice.world.no-night-crash-pattern",
    );
    expect(narrationClipForText("That is Glow! Glow just happened. Let's try again!")?.id).toBe(
      "voice.world.no-night-glow",
    );
    expect(narrationClipForText("Hooray! Worm! A worm in the compost.")?.id).toBe(
      "voice.world.yes-compost-worm",
    );
    expect(narrationClipForText("That is Dolphin! Dolphins swim seas. Let's try again!")?.id).toBe(
      "voice.world.no-compost-dolphin",
    );
    expect(narrationClipForText("That is Plane! Planes fly runways. Let's try again!")?.id).toBe(
      "voice.world.no-compost-plane",
    );
    expect(narrationClipForText("Hooray! Damp soil! Damp soil is home.")?.id).toBe(
      "voice.world.yes-compost-soil",
    );
    expect(narrationClipForText("That is Fridge! Too cold and closed. Let's try again!")?.id).toBe(
      "voice.world.no-compost-fridge",
    );
    expect(narrationClipForText("That is The sky! Worms do not fly. Let's try again!")?.id).toBe(
      "voice.world.no-compost-sky",
    );
    expect(narrationClipForText("Hooray! Apple peel! Peels can compost.")?.id).toBe(
      "voice.world.yes-compost-peel",
    );
    expect(narrationClipForText("That is A boot! Boots are not compost. Let's try again!")?.id).toBe(
      "voice.world.no-compost-boot",
    );
    expect(narrationClipForText("That is A key! Keys stay on a hook. Let's try again!")?.id).toBe(
      "voice.world.no-compost-key",
    );
    expect(narrationClipForText("Hooray! 5 worms! Five worms.")?.id).toBe("voice.world.yes-compost-5");
    expect(narrationClipForText("That is 2 worms! Count every worm. Let's try again!")?.id).toBe(
      "voice.world.no-compost-2",
    );
    expect(narrationClipForText("That is 8 worms! Not eight this rain. Let's try again!")?.id).toBe(
      "voice.world.no-compost-8",
    );
    expect(narrationClipForText("Hooray! W! Worm starts with W.")?.id).toBe("voice.world.yes-compost-w");
    expect(narrationClipForText("That is M! M starts moth. Let's try again!")?.id).toBe(
      "voice.world.no-compost-m",
    );
    expect(narrationClipForText("That is V! V starts van. Let's try again!")?.id).toBe(
      "voice.world.no-compost-v",
    );
    expect(narrationClipForText("Hooray! 8 leaves! Four and four make eight.")?.id).toBe(
      "voice.world.yes-compost-8",
    );
    expect(narrationClipForText("That is 44 leaves! Add the groups. Let's try again!")?.id).toBe(
      "voice.world.no-compost-44",
    );
    expect(narrationClipForText("That is 4 leaves! Count both piles. Let's try again!")?.id).toBe(
      "voice.world.no-compost-4",
    );
    expect(narrationClipForText("Hooray! Dog! Log and dog rhyme.")?.id).toBe(
      "voice.world.yes-compost-dog",
    );
    expect(
      narrationClipForText("That is Leaf! Leaf does not rhyme with log. Let's try again!")?.id,
    ).toBe("voice.world.no-compost-leaf");
    expect(
      narrationClipForText("That is Worm! Worm does not rhyme with log. Let's try again!")?.id,
    ).toBe("voice.world.no-compost-worm");
    expect(narrationClipForText("Hooray! So worms can slide! Damp soil helps worms move.")?.id).toBe(
      "voice.world.yes-compost-slide",
    );
    expect(
      narrationClipForText("That is So boats can park! No boats in the heap. Let's try again!")?.id,
    ).toBe("voice.world.no-compost-boats");
    expect(
      narrationClipForText("That is To start a fire! We do not burn the heap. Let's try again!")?.id,
    ).toBe("voice.world.no-compost-fire");
    expect(narrationClipForText("Hooray! Orange! A sweet orange.")?.id).toBe(
      "voice.world.yes-fruit-orange",
    );
    expect(narrationClipForText("That is Pea! Peas are small and green. Let's try again!")?.id).toBe(
      "voice.world.no-fruit-pea",
    );
    expect(narrationClipForText("That is Loaf! Bread is for the bakery. Let's try again!")?.id).toBe(
      "voice.world.no-fruit-loaf",
    );
    expect(narrationClipForText("Hooray! 5 apples! Five apples.")?.id).toBe("voice.world.yes-fruit-5");
    expect(narrationClipForText("That is 2 apples! Count the whole crate. Let's try again!")?.id).toBe(
      "voice.world.no-fruit-2",
    );
    expect(narrationClipForText("That is 8 apples! Not eight this crate. Let's try again!")?.id).toBe(
      "voice.world.no-fruit-8",
    );
    expect(narrationClipForText("Hooray! Carrot! A carrot is a veg.")?.id).toBe(
      "voice.world.yes-fruit-carrot",
    );
    expect(narrationClipForText("That is Banana! Bananas are fruit. Let's try again!")?.id).toBe(
      "voice.world.no-fruit-banana",
    );
    expect(narrationClipForText("That is Cake! Cake is for the bakery. Let's try again!")?.id).toBe(
      "voice.world.no-fruit-cake",
    );
    expect(narrationClipForText("Hooray! Orange jam! Red and yellow make orange.")?.id).toBe(
      "voice.world.yes-fruit-orange-jam",
    );
    expect(narrationClipForText("That is Blue jam! No blue in this mix. Let's try again!")?.id).toBe(
      "voice.world.no-fruit-blue",
    );
    expect(
      narrationClipForText("That is Black jam! The mix stays warm and bright. Let's try again!")?.id,
    ).toBe("voice.world.no-fruit-black");
    expect(narrationClipForText("Hooray! A! Apple starts with A.")?.id).toBe("voice.world.yes-fruit-a");
    expect(narrationClipForText("That is B! B starts banana. Let's try again!")?.id).toBe(
      "voice.world.no-fruit-b",
    );
    expect(narrationClipForText("That is P! P starts pear. Let's try again!")?.id).toBe(
      "voice.world.no-fruit-p",
    );
    expect(narrationClipForText("Hooray! Pear! AB continues with pear.")?.id).toBe(
      "voice.world.yes-fruit-pear",
    );
    expect(narrationClipForText("That is Melon! Melon is not in this row. Let's try again!")?.id).toBe(
      "voice.world.no-fruit-melon",
    );
    expect(narrationClipForText("That is Apple! Apple just happened. Let's try again!")?.id).toBe(
      "voice.world.no-fruit-apple",
    );
    expect(narrationClipForText("Hooray! 6 pears! Three and three make six.")?.id).toBe(
      "voice.world.yes-fruit-6",
    );
    expect(narrationClipForText("That is 33 pears! Add the groups. Let's try again!")?.id).toBe(
      "voice.world.no-fruit-33",
    );
    expect(narrationClipForText("That is 3 pears! Count both bags. Let's try again!")?.id).toBe(
      "voice.world.no-fruit-3",
    );
    expect(narrationClipForText("Hooray! Bear! Pear and bear rhyme.")?.id).toBe(
      "voice.world.yes-fruit-bear",
    );
    expect(
      narrationClipForText("That is Apple! Apple does not rhyme with pear. Let's try again!")?.id,
    ).toBe("voice.world.no-fruit-apple-rhyme");
    expect(
      narrationClipForText("That is Plum! Plum does not rhyme with pear. Let's try again!")?.id,
    ).toBe("voice.world.no-fruit-plum");
    expect(narrationClipForText("Hooray! Baker! The baker at the oven.")?.id).toBe(
      "voice.world.yes-bakery-baker",
    );
    expect(narrationClipForText("That is Pilot! Pilots fly planes. Let's try again!")?.id).toBe(
      "voice.world.no-bakery-pilot",
    );
    expect(narrationClipForText("That is Frog! Frogs stay by ponds. Let's try again!")?.id).toBe(
      "voice.world.no-bakery-frog",
    );
    expect(narrationClipForText("Hooray! 6 buns! Six buns.")?.id).toBe("voice.world.yes-bakery-6");
    expect(narrationClipForText("That is 3 buns! Count the whole tray. Let's try again!")?.id).toBe(
      "voice.world.no-bakery-3",
    );
    expect(narrationClipForText("That is 9 buns! Not nine this bake. Let's try again!")?.id).toBe(
      "voice.world.no-bakery-9",
    );
    expect(narrationClipForText("Hooray! A loaf! Loaves bake in the oven.")?.id).toBe(
      "voice.world.yes-bakery-loaf",
    );
    expect(narrationClipForText("That is Milk! Milk stays cool. Let's try again!")?.id).toBe(
      "voice.world.no-bakery-milk",
    );
    expect(narrationClipForText("That is Ice! Ice would melt. Let's try again!")?.id).toBe(
      "voice.world.no-bakery-ice",
    );
    expect(narrationClipForText("Hooray! B! Bread starts with B.")?.id).toBe("voice.world.yes-bakery-b");
    expect(
      narrationClipForText(
        "That is D! D starts dough — close, but this word is bread. Let's try again!",
      )?.id,
    ).toBe("voice.world.no-bakery-d");
    expect(narrationClipForText("That is P! P starts pie. Let's try again!")?.id).toBe(
      "voice.world.no-bakery-p",
    );
    expect(narrationClipForText("Hooray! br! Bread starts with br.")?.id).toBe(
      "voice.world.yes-bakery-br",
    );
    expect(narrationClipForText("That is st! St starts stem. Let's try again!")?.id).toBe(
      "voice.world.no-bakery-st",
    );
    expect(
      narrationClipForText("That is fl! Fl starts flour — not this word. Let's try again!")?.id,
    ).toBe("voice.world.no-bakery-fl");
    expect(narrationClipForText("Hooray! Loaf! AB continues with loaf.")?.id).toBe(
      "voice.world.yes-bakery-loaf-pattern",
    );
    expect(narrationClipForText("That is Fish! Fish is not on this tray. Let's try again!")?.id).toBe(
      "voice.world.no-bakery-fish",
    );
    expect(narrationClipForText("That is Bun! Bun just happened. Let's try again!")?.id).toBe(
      "voice.world.no-bakery-bun",
    );
    expect(narrationClipForText("Hooray! The window! On the window.")?.id).toBe(
      "voice.world.yes-bakery-window",
    );
    expect(narrationClipForText("That is The oven! Nana said not the oven. Let's try again!")?.id).toBe(
      "voice.world.no-bakery-oven",
    );
    expect(narrationClipForText("That is The pond! Not this kitchen. Let's try again!")?.id).toBe(
      "voice.world.no-bakery-pond",
    );
    expect(narrationClipForText("Hooray! Circle! A round tin.")?.id).toBe(
      "voice.world.yes-bakery-circle",
    );
    expect(narrationClipForText("That is Square! This tin is round. Let's try again!")?.id).toBe(
      "voice.world.no-bakery-square",
    );
    expect(narrationClipForText("That is Star! Not a star tin today. Let's try again!")?.id).toBe(
      "voice.world.no-bakery-star",
    );
    expect(narrationClipForText("Hooray! Wooden spoon! The wooden spoon.")?.id).toBe(
      "voice.world.yes-soup-spoon",
    );
    expect(narrationClipForText("That is A key! Keys open doors. Let's try again!")?.id).toBe(
      "voice.world.no-soup-key",
    );
    expect(narrationClipForText("That is A shoe! Shoes stay by the door. Let's try again!")?.id).toBe(
      "voice.world.no-soup-shoe",
    );
    expect(narrationClipForText("Hooray! 4 carrots! Four carrots.")?.id).toBe("voice.world.yes-soup-4");
    expect(narrationClipForText("That is 1 carrot! Count all of them. Let's try again!")?.id).toBe(
      "voice.world.no-soup-1",
    );
    expect(narrationClipForText("That is 7 carrots! Not seven this pot. Let's try again!")?.id).toBe(
      "voice.world.no-soup-7",
    );
    expect(narrationClipForText("Hooray! Wait for a grown-up! A grown-up lifts hot pots.")?.id).toBe(
      "voice.world.yes-soup-wait",
    );
    expect(narrationClipForText("That is Touch the lid! Hot lids burn. Let's try again!")?.id).toBe(
      "voice.world.no-soup-touch",
    );
    expect(
      narrationClipForText("That is Pour on the floor! Soup stays in the pot. Let's try again!")?.id,
    ).toBe("voice.world.no-soup-pour-floor");
    expect(narrationClipForText("Hooray! Onion! Onions can go in soup.")?.id).toBe(
      "voice.world.yes-soup-onion",
    );
    expect(narrationClipForText("That is A sock! Socks are not soup. Let's try again!")?.id).toBe(
      "voice.world.no-soup-sock",
    );
    expect(narrationClipForText("That is A crayon! Crayons are for paper. Let's try again!")?.id).toBe(
      "voice.world.no-soup-crayon",
    );
    expect(narrationClipForText("Hooray! S! Soup starts with S.")?.id).toBe("voice.world.yes-soup-s");
    expect(narrationClipForText("That is Z! Z starts zip. Let's try again!")?.id).toBe(
      "voice.world.no-soup-z",
    );
    expect(narrationClipForText("That is C! C starts cup. Let's try again!")?.id).toBe(
      "voice.world.no-soup-c",
    );
    expect(narrationClipForText("Hooray! 5 spoons! Two and three make five.")?.id).toBe(
      "voice.world.yes-soup-5",
    );
    expect(narrationClipForText("That is 23 spoons! Add the groups. Let's try again!")?.id).toBe(
      "voice.world.no-soup-23",
    );
    expect(narrationClipForText("That is 3 spoons! Count both lots. Let's try again!")?.id).toBe(
      "voice.world.no-soup-3",
    );
    expect(narrationClipForText("Hooray! Nana! Nana tasted last.")?.id).toBe(
      "voice.world.yes-soup-nana",
    );
    expect(narrationClipForText("That is Pip! Pip tasted first. Let's try again!")?.id).toBe(
      "voice.world.no-soup-pip",
    );
    expect(narrationClipForText("That is The cat! No cat at this pot. Let's try again!")?.id).toBe(
      "voice.world.no-soup-cat",
    );
    expect(narrationClipForText("Hooray! A chop! The pattern continues with a chop.")?.id).toBe(
      "voice.world.yes-soup-chop",
    );
    expect(
      narrationClipForText("That is A nap! Stay with the chopping pattern. Let's try again!")?.id,
    ).toBe("voice.world.no-soup-nap");
    expect(
      narrationClipForText("That is A rest! Rest already just happened. Let's try again!")?.id,
    ).toBe("voice.world.no-soup-rest");
    expect(narrationClipForText("Hooray! Sandwich! Sandwiches go in the basket.")?.id).toBe(
      "voice.world.yes-picnic-sandwich",
    );
    expect(narrationClipForText("That is Hammer! Hammers stay in the toolbox. Let's try again!")?.id).toBe(
      "voice.world.no-picnic-hammer",
    );
    expect(narrationClipForText("That is A tyre! Tyres stay on cars. Let's try again!")?.id).toBe(
      "voice.world.no-picnic-tyre",
    );
    expect(narrationClipForText("Hooray! 4 cups! Four cups.")?.id).toBe("voice.world.yes-picnic-4");
    expect(narrationClipForText("That is 2 cups! Count every cup. Let's try again!")?.id).toBe(
      "voice.world.no-picnic-2",
    );
    expect(narrationClipForText("That is 7 cups! Not seven this picnic. Let's try again!")?.id).toBe(
      "voice.world.no-picnic-7",
    );
    expect(narrationClipForText("Hooray! 5 sandwiches! Three and two make five.")?.id).toBe(
      "voice.world.yes-picnic-5",
    );
    expect(narrationClipForText("That is 32 sandwiches! Add the groups. Let's try again!")?.id).toBe(
      "voice.world.no-picnic-32",
    );
    expect(narrationClipForText("That is 2 sandwiches! Count both packs. Let's try again!")?.id).toBe(
      "voice.world.no-picnic-2-sandwiches",
    );
    expect(narrationClipForText("Hooray! Ants! Ants found the crumb.")?.id).toBe(
      "voice.world.yes-picnic-ant",
    );
    expect(narrationClipForText("That is Whale! Whales are in the sea. Let's try again!")?.id).toBe(
      "voice.world.no-picnic-whale",
    );
    expect(narrationClipForText("That is Bus! Buses are on the road. Let's try again!")?.id).toBe(
      "voice.world.no-picnic-bus",
    );
    expect(narrationClipForText("Hooray! P! Picnic starts with P.")?.id).toBe("voice.world.yes-picnic-p");
    expect(
      narrationClipForText(
        "That is B! B starts basket — close, but this word is picnic. Let's try again!",
      )?.id,
    ).toBe("voice.world.no-picnic-b");
    expect(narrationClipForText("That is N! N starts napkin. Let's try again!")?.id).toBe(
      "voice.world.no-picnic-n",
    );
    expect(narrationClipForText("Hooray! Square! A square cloth.")?.id).toBe(
      "voice.world.yes-picnic-square",
    );
    expect(narrationClipForText("That is Circle! This cloth has corners. Let's try again!")?.id).toBe(
      "voice.world.no-picnic-circle",
    );
    expect(
      narrationClipForText("That is Triangle! This cloth has four sides. Let's try again!")?.id,
    ).toBe("voice.world.no-picnic-triangle");
    expect(narrationClipForText("Hooray! On the cloth! On the cloth.")?.id).toBe(
      "voice.world.yes-picnic-cloth",
    );
    expect(
      narrationClipForText("That is On the ant trail! Nana said not the trail. Let's try again!")?.id,
    ).toBe("voice.world.no-picnic-trail");
    expect(narrationClipForText("That is In the road! Not the road. Let's try again!")?.id).toBe(
      "voice.world.no-picnic-road",
    );
    expect(narrationClipForText("Hooray! Blue cup! AB continues with blue.")?.id).toBe(
      "voice.world.yes-picnic-blue",
    );
    expect(
      narrationClipForText("That is Green cup! Green is not in this row. Let's try again!")?.id,
    ).toBe("voice.world.no-picnic-green");
    expect(narrationClipForText("That is Red cup! Red just happened. Let's try again!")?.id).toBe(
      "voice.world.no-picnic-red",
    );
    expect(narrationClipForText("Hooray! Firefighters! Firefighters ride it.")?.id).toBe(
      "voice.world.yes-fire-crew",
    );
    expect(narrationClipForText("That is Baker! Bakers ride bakery vans. Let's try again!")?.id).toBe(
      "voice.world.no-fire-baker",
    );
    expect(narrationClipForText("That is Penguin! Penguins live on ice. Let's try again!")?.id).toBe(
      "voice.world.no-fire-penguin",
    );
    expect(narrationClipForText("Hooray! 3 helmets! Three helmets.")?.id).toBe(
      "voice.world.yes-fire-3",
    );
    expect(narrationClipForText("That is 1 helmet! Count every peg. Let's try again!")?.id).toBe(
      "voice.world.no-fire-1",
    );
    expect(narrationClipForText("That is 6 helmets! Not six this rack. Let's try again!")?.id).toBe(
      "voice.world.no-fire-6",
    );
    expect(narrationClipForText("Hooray! Hose! Hoses belong here.")?.id).toBe(
      "voice.world.yes-fire-hose",
    );
    expect(narrationClipForText("That is A book! Books live in the library. Let's try again!")?.id).toBe(
      "voice.world.no-fire-book",
    );
    expect(narrationClipForText("Hooray! F! Fire starts with F.")?.id).toBe("voice.world.yes-fire-f");
    expect(narrationClipForText("That is S! S starts siren. Let's try again!")?.id).toBe(
      "voice.world.no-fire-s",
    );
    expect(narrationClipForText("Hooray! The bell rang! The bell first.")?.id).toBe(
      "voice.world.yes-fire-bell",
    );
    expect(narrationClipForText("That is The crew ran! That was second. Let's try again!")?.id).toBe(
      "voice.world.no-fire-ran",
    );
    expect(narrationClipForText("That is A nap! Not this beat. Let's try again!")?.id).toBe(
      "voice.world.no-fire-nap",
    );
    expect(narrationClipForText("Hooray! Circle! A round badge.")?.id).toBe(
      "voice.world.yes-fire-circle",
    );
    expect(narrationClipForText("That is Square! This badge is round. Let's try again!")?.id).toBe(
      "voice.world.no-fire-square",
    );
    expect(narrationClipForText("That is Star! Not this badge. Let's try again!")?.id).toBe(
      "voice.world.no-fire-star",
    );
    expect(narrationClipForText("Hooray! 4 boots! Two and two make four.")?.id).toBe(
      "voice.world.yes-fire-4",
    );
    expect(narrationClipForText("That is 22 boots! Add the groups. Let's try again!")?.id).toBe(
      "voice.world.no-fire-22",
    );
    expect(narrationClipForText("That is 2 boots! Count both lockers. Let's try again!")?.id).toBe(
      "voice.world.no-fire-2",
    );
    expect(narrationClipForText("Hooray! Dalmatian! The station dog.")?.id).toBe(
      "voice.world.yes-fire-dal",
    );
    expect(narrationClipForText("That is Owl! Owls stay in woods. Let's try again!")?.id).toBe(
      "voice.world.no-fire-owl",
    );
    expect(narrationClipForText("Hooray! 5 ducks! Five ducks.")?.id).toBe("voice.world.yes-park-5");
    expect(narrationClipForText("That is 2 ducks! Count the whole pond. Let's try again!")?.id).toBe(
      "voice.world.no-park-2",
    );
    expect(narrationClipForText("That is 8 ducks! Not eight this morning. Let's try again!")?.id).toBe(
      "voice.world.no-park-8",
    );
    expect(narrationClipForText("Hooray! A swing! Swings belong in the park.")?.id).toBe(
      "voice.world.yes-park-swing",
    );
    expect(narrationClipForText("That is A lorry! Lorries stay on the road. Let's try again!")?.id).toBe(
      "voice.world.no-park-lorry",
    );
    expect(narrationClipForText("That is An oven! Ovens stay in kitchens. Let's try again!")?.id).toBe(
      "voice.world.no-park-oven",
    );
    expect(narrationClipForText("Hooray! Duck! A duck on the pond.")?.id).toBe("voice.world.yes-park-duck");
    expect(narrationClipForText("That is Lion! Lions roar on grass plains. Let's try again!")?.id).toBe(
      "voice.world.no-park-lion",
    );
    expect(narrationClipForText("That is Truck! Trucks rumble roads. Let's try again!")?.id).toBe(
      "voice.world.no-park-truck",
    );
    expect(narrationClipForText("Hooray! D! Duck starts with D.")?.id).toBe("voice.world.yes-park-d");
    expect(narrationClipForText("That is B! B starts ball. Let's try again!")?.id).toBe(
      "voice.world.no-park-b",
    );
    expect(narrationClipForText("That is G! G starts grass. Let's try again!")?.id).toBe(
      "voice.world.no-park-g",
    );
    expect(narrationClipForText("Hooray! Circle! A round pond.")?.id).toBe(
      "voice.world.yes-park-circle",
    );
    expect(narrationClipForText("That is Square! This pond is round. Let's try again!")?.id).toBe(
      "voice.world.no-park-square",
    );
    expect(narrationClipForText("That is Triangle! Not three-sided. Let's try again!")?.id).toBe(
      "voice.world.no-park-triangle",
    );
    expect(narrationClipForText("Hooray! 5 balls! Two and three make five.")?.id).toBe(
      "voice.world.yes-park-5-balls",
    );
    expect(narrationClipForText("That is 23 balls! Add the groups. Let's try again!")?.id).toBe(
      "voice.world.no-park-23",
    );
    expect(narrationClipForText("That is 3 balls! Count both lots. Let's try again!")?.id).toBe(
      "voice.world.no-park-3",
    );
    expect(narrationClipForText("Hooray! Nana! AB continues with Nana.")?.id).toBe(
      "voice.world.yes-park-nana",
    );
    expect(
      narrationClipForText("That is The dog! The dog is not in this turn pattern. Let's try again!")
        ?.id,
    ).toBe("voice.world.no-park-dog");
    expect(narrationClipForText("That is Pip! Pip just had a turn. Let's try again!")?.id).toBe(
      "voice.world.no-park-pip",
    );
    expect(narrationClipForText("Hooray! Under the bench! Under the bench.")?.id).toBe(
      "voice.world.yes-park-bench",
    );
    expect(narrationClipForText("That is In the pond! Not the pond. Let's try again!")?.id).toBe(
      "voice.world.no-park-pond",
    );
    expect(narrationClipForText("That is In the oven! Not this park. Let's try again!")?.id).toBe(
      "voice.world.no-park-in-oven",
    );
    expect(narrationClipForText("Hooray! On the shelf! On the shelf.")?.id).toBe(
      "voice.world.yes-library-shelf",
    );
    expect(narrationClipForText("That is In the fridge! Not the fridge. Let's try again!")?.id).toBe(
      "voice.world.no-library-fridge",
    );
    expect(narrationClipForText("Hooray! L! Library starts with L.")?.id).toBe("voice.world.yes-library-l");
    expect(narrationClipForText("That is R! R starts read. Let's try again!")?.id).toBe(
      "voice.world.no-library-r",
    );
    expect(narrationClipForText("That is B! B starts book. Let's try again!")?.id).toBe(
      "voice.world.no-library-b",
    );
    expect(narrationClipForText("Hooray! 7 books! Seven books.")?.id).toBe("voice.world.yes-library-7");
    expect(narrationClipForText("That is 3 books! Count the whole box. Let's try again!")?.id).toBe(
      "voice.world.no-library-3",
    );
    expect(narrationClipForText("That is 10 books! Not ten this box. Let's try again!")?.id).toBe(
      "voice.world.no-library-10",
    );
    expect(narrationClipForText("Hooray! A whisper! Whispers belong here.")?.id).toBe(
      "voice.world.yes-library-whisper",
    );
    expect(narrationClipForText("That is A drum kit! Drums are too loud here. Let's try again!")?.id).toBe(
      "voice.world.no-library-drum",
    );
    expect(
      narrationClipForText("That is A siren! Sirens stay at the fire house. Let's try again!")?.id,
    ).toBe("voice.world.no-library-siren");
    expect(narrationClipForText("Hooray! Nana! Nana read last.")?.id).toBe(
      "voice.world.yes-library-nana",
    );
    expect(narrationClipForText("That is Pip! Pip read first. Let's try again!")?.id).toBe(
      "voice.world.no-library-pip",
    );
    expect(narrationClipForText("That is A duck! No duck in this nook. Let's try again!")?.id).toBe(
      "voice.world.no-library-duck",
    );
    expect(narrationClipForText("Hooray! Hook! Book and hook rhyme.")?.id).toBe(
      "voice.world.yes-library-hook",
    );
    expect(
      narrationClipForText("That is Shelf! Shelf does not rhyme with book. Let's try again!")?.id,
    ).toBe("voice.world.no-library-shelf");
    expect(
      narrationClipForText("That is Page! Page does not rhyme with book. Let's try again!")?.id,
    ).toBe("voice.world.no-library-page");
    expect(narrationClipForText("Hooray! Blue spine! AB continues with blue.")?.id).toBe(
      "voice.world.yes-library-blue",
    );
    expect(
      narrationClipForText("That is Gold spine! Gold is not in this row. Let's try again!")?.id,
    ).toBe("voice.world.no-library-gold");
    expect(narrationClipForText("That is Red spine! Red just happened. Let's try again!")?.id).toBe(
      "voice.world.no-library-red",
    );
    expect(narrationClipForText("Hooray! 6 books! Four and two make six.")?.id).toBe(
      "voice.world.yes-library-6",
    );
    expect(narrationClipForText("That is 42 books! Add the groups. Let's try again!")?.id).toBe(
      "voice.world.no-library-42",
    );
    expect(narrationClipForText("That is 2 books! Count both stacks. Let's try again!")?.id).toBe(
      "voice.world.no-library-2",
    );
    expect(narrationClipForText("Hooray! The stall keeper! The stall keeper rings it.")?.id).toBe(
      "voice.world.yes-market-seller",
    );
    expect(narrationClipForText("That is An owl! Owls do not keep stalls. Let's try again!")?.id).toBe(
      "voice.world.no-market-owl",
    );
    expect(
      narrationClipForText("That is A submarine! Subs stay under water. Let's try again!")?.id,
    ).toBe("voice.world.no-market-sub");
    expect(narrationClipForText("Hooray! 4 kites! Four kites.")?.id).toBe("voice.world.yes-market-4");
    expect(narrationClipForText("That is 1 kite! Count every kite. Let's try again!")?.id).toBe(
      "voice.world.no-market-1",
    );
    expect(narrationClipForText("That is 7 kites! Not seven this stall. Let's try again!")?.id).toBe(
      "voice.world.no-market-7",
    );
    expect(narrationClipForText("Hooray! Square! A square sign.")?.id).toBe(
      "voice.world.yes-market-square",
    );
    expect(narrationClipForText("That is Circle! This sign has corners. Let's try again!")?.id).toBe(
      "voice.world.no-market-circle",
    );
    expect(narrationClipForText("That is Heart! Not this sign. Let's try again!")?.id).toBe(
      "voice.world.no-market-heart",
    );
    expect(narrationClipForText("Hooray! A cap! Caps belong here.")?.id).toBe(
      "voice.world.yes-market-cap",
    );
    expect(
      narrationClipForText("That is A fish! Fish belong at the fish stall. Let's try again!")?.id,
    ).toBe("voice.world.no-market-fish");
    expect(
      narrationClipForText("That is A hose! Hoses stay at the fire house. Let's try again!")?.id,
    ).toBe("voice.world.no-market-hose");
    expect(narrationClipForText("Hooray! M! Market starts with M.")?.id).toBe("voice.world.yes-market-m");
    expect(narrationClipForText("That is N! N starts nook. Let's try again!")?.id).toBe(
      "voice.world.no-market-n",
    );
    expect(narrationClipForText("That is K! K starts kite. Let's try again!")?.id).toBe(
      "voice.world.no-market-k",
    );
    expect(narrationClipForText("Hooray! 5 coins! Three and two make five.")?.id).toBe(
      "voice.world.yes-market-5",
    );
    expect(narrationClipForText("That is 32 coins! Add the groups. Let's try again!")?.id).toBe(
      "voice.world.no-market-32",
    );
    expect(narrationClipForText("That is 2 coins! Count both purses. Let's try again!")?.id).toBe(
      "voice.world.no-market-2",
    );
    expect(narrationClipForText("Hooray! A red cap! A red cap.")?.id).toBe(
      "voice.world.yes-market-red-cap",
    );
    expect(
      narrationClipForText("That is A blue kite! Nana said not the kite. Let's try again!")?.id,
    ).toBe("voice.world.no-market-kite");
    expect(narrationClipForText("That is A hose! Not this stall. Let's try again!")?.id).toBe(
      "voice.world.no-market-hose-stall",
    );
    expect(narrationClipForText("Hooray! White! AB continues with white.")?.id).toBe(
      "voice.world.yes-market-white",
    );
    expect(
      narrationClipForText("That is Green! Green is not in this stripe. Let's try again!")?.id,
    ).toBe("voice.world.no-market-green");
    expect(narrationClipForText("That is Red! Red just happened. Let's try again!")?.id).toBe(
      "voice.world.no-market-red",
    );
    expect(narrationClipForText("Hooray! Penguin! A penguin on the floe.")?.id).toBe(
      "voice.world.yes-ice-penguin",
    );
    expect(narrationClipForText("That is Camel! Camels live in hot dunes. Let's try again!")?.id).toBe(
      "voice.world.no-ice-camel",
    );
    expect(narrationClipForText("Hooray! 6 fish! Six fish.")?.id).toBe("voice.world.yes-ice-6");
    expect(narrationClipForText("That is 3 fish! Count the whole gift. Let's try again!")?.id).toBe(
      "voice.world.no-ice-3",
    );
    expect(narrationClipForText("That is 9 fish! Not nine this hole. Let's try again!")?.id).toBe(
      "voice.world.no-ice-9",
    );
    expect(narrationClipForText("Hooray! Cold ice! On the cold ice.")?.id).toBe("voice.world.yes-ice-ice");
    expect(narrationClipForText("That is Bakery! Too warm. Let's try again!")?.id).toBe(
      "voice.world.no-ice-bakery",
    );
    expect(narrationClipForText("That is Hot desert! Too dry and hot. Let's try again!")?.id).toBe(
      "voice.world.no-ice-desert",
    );
    expect(narrationClipForText("Hooray! Penguin! Penguins hop floes.")?.id).toBe(
      "voice.world.yes-ice-penguin-hop",
    );
    expect(narrationClipForText("That is Horse! Horses stay in fields. Let's try again!")?.id).toBe(
      "voice.world.no-ice-horse",
    );
    expect(narrationClipForText("Hooray! P! Penguin starts with P.")?.id).toBe("voice.world.yes-ice-p");
    expect(narrationClipForText("That is B! B starts bear. Let's try again!")?.id).toBe(
      "voice.world.no-ice-b",
    );
    expect(narrationClipForText("That is G! G starts gift. Let's try again!")?.id).toBe(
      "voice.world.no-ice-g",
    );
    expect(narrationClipForText("Hooray! 6 penguins! Four and two make six.")?.id).toBe(
      "voice.world.yes-ice-6-penguins",
    );
    expect(narrationClipForText("That is 42 penguins! Add the groups. Let's try again!")?.id).toBe(
      "voice.world.no-ice-42",
    );
    expect(narrationClipForText("That is 2 penguins! Count both huddles. Let's try again!")?.id).toBe(
      "voice.world.no-ice-2",
    );
    expect(narrationClipForText("Hooray! Go! Snow and go rhyme.")?.id).toBe("voice.world.yes-ice-go");
    expect(
      narrationClipForText("That is Ice! Ice does not rhyme with snow. Let's try again!")?.id,
    ).toBe("voice.world.no-ice-ice");
    expect(
      narrationClipForText("That is Fish! Fish does not rhyme with snow. Let's try again!")?.id,
    ).toBe("voice.world.no-ice-fish");
    expect(narrationClipForText("Hooray! A hop! The pattern continues with a hop.")?.id).toBe(
      "voice.world.yes-ice-hop",
    );
    expect(
      narrationClipForText("That is A long swim! This pattern is hops. Let's try again!")?.id,
    ).toBe("voice.world.no-ice-swim");
    expect(narrationClipForText("That is A rest! Rest just happened. Let's try again!")?.id).toBe(
      "voice.world.no-ice-rest",
    );
    expect(narrationClipForText("Hooray! Polar bear! A polar bear.")?.id).toBe(
      "voice.world.yes-polar-bear",
    );
    expect(narrationClipForText("That is Parrot! Parrots live in jungles. Let's try again!")?.id).toBe(
      "voice.world.no-polar-parrot",
    );
    expect(narrationClipForText("Hooray! Snow den! In the snow den.")?.id).toBe(
      "voice.world.yes-polar-den",
    );
    expect(narrationClipForText("That is Harbour! Too wet and busy. Let's try again!")?.id).toBe(
      "voice.world.no-polar-harbour",
    );
    expect(narrationClipForText("Hooray! 4 paws! Four paws.")?.id).toBe("voice.world.yes-polar-4");
    expect(narrationClipForText("That is 2 paws! Count every print. Let's try again!")?.id).toBe(
      "voice.world.no-polar-2",
    );
    expect(narrationClipForText("That is 6 paws! Bears have four. Let's try again!")?.id).toBe(
      "voice.world.no-polar-6",
    );
    expect(narrationClipForText("Hooray! Polar bear! Snow-coat bear.")?.id).toBe(
      "voice.world.yes-polar-bear-coat",
    );
    expect(
      narrationClipForText("That is Monkey! Monkeys stay in jungle vines. Let's try again!")?.id,
    ).toBe("voice.world.no-polar-monkey");
    expect(narrationClipForText("Hooray! C! Cub starts with C.")?.id).toBe("voice.world.yes-polar-c");
    expect(narrationClipForText("Hooray! The grown bear! The grown bear slept last.")?.id).toBe(
      "voice.world.yes-polar-grown",
    );
    expect(narrationClipForText("That is The cub! The cub napped first. Let's try again!")?.id).toBe(
      "voice.world.no-polar-cub",
    );
    expect(narrationClipForText("That is The ferry! No ferry in this den. Let's try again!")?.id).toBe(
      "voice.world.no-polar-ferry",
    );
    expect(narrationClipForText("Hooray! 6 prints! Three and three make six.")?.id).toBe(
      "voice.world.yes-polar-6",
    );
    expect(narrationClipForText("That is 33 prints! Add the groups. Let's try again!")?.id).toBe(
      "voice.world.no-polar-33",
    );
    expect(narrationClipForText("That is 3 prints! Count both trails. Let's try again!")?.id).toBe(
      "voice.world.no-polar-3",
    );
    expect(narrationClipForText("Hooray! Circle! A round door.")?.id).toBe(
      "voice.world.yes-polar-circle",
    );
    expect(narrationClipForText("That is Star! Not a star door. Let's try again!")?.id).toBe(
      "voice.world.no-polar-star",
    );
    expect(narrationClipForText("That is Triangle! This door is round. Let's try again!")?.id).toBe(
      "voice.world.no-polar-triangle",
    );
    expect(narrationClipForText("Hooray! Green! A green ribbon.")?.id).toBe(
      "voice.world.yes-northern-green",
    );
    expect(narrationClipForText("That is Brown! Not bakery brown. Let's try again!")?.id).toBe(
      "voice.world.no-northern-brown",
    );
    expect(narrationClipForText("That is Grey! The ribbon glows green. Let's try again!")?.id).toBe(
      "voice.world.no-northern-grey",
    );
    expect(narrationClipForText("Hooray! Green! Blue and yellow make green.")?.id).toBe(
      "voice.world.yes-northern-green-mix",
    );
    expect(narrationClipForText("That is Red! No red in this mix. Let's try again!")?.id).toBe(
      "voice.world.no-northern-red",
    );
    expect(narrationClipForText("That is Black! The mix stays bright. Let's try again!")?.id).toBe(
      "voice.world.no-northern-black",
    );
    expect(narrationClipForText("Hooray! 8 stars! Eight stars.")?.id).toBe("voice.world.yes-northern-8");
    expect(narrationClipForText("That is 4 stars! Count the whole band. Let's try again!")?.id).toBe(
      "voice.world.no-northern-4",
    );
    expect(narrationClipForText("That is 11 stars! Not eleven. Let's try again!")?.id).toBe(
      "voice.world.no-northern-11",
    );
    expect(narrationClipForText("Hooray! Fade! AB continues with fade.")?.id).toBe(
      "voice.world.yes-northern-fade",
    );
    expect(narrationClipForText("That is A drum! This pattern is glows. Let's try again!")?.id).toBe(
      "voice.world.no-northern-drum",
    );
    expect(narrationClipForText("Hooray! S! Star starts with S.")?.id).toBe("voice.world.yes-northern-s");
    expect(narrationClipForText("That is T! T starts telescope. Let's try again!")?.id).toBe(
      "voice.world.no-northern-t",
    );
    expect(narrationClipForText("That is R! R starts ribbon. Let's try again!")?.id).toBe(
      "voice.world.no-northern-r",
    );
    expect(narrationClipForText("Hooray! The light ribbon! The ribbon is in the sky.")?.id).toBe(
      "voice.world.yes-northern-ribbon",
    );
    expect(narrationClipForText("That is A seal! Seals stay in the water. Let's try again!")?.id).toBe(
      "voice.world.no-northern-seal",
    );
    expect(narrationClipForText("That is A bus! Buses stay on roads. Let's try again!")?.id).toBe(
      "voice.world.no-northern-bus",
    );
    expect(narrationClipForText("Hooray! 7 sparks! Three and four make seven.")?.id).toBe(
      "voice.world.yes-northern-7",
    );
    expect(narrationClipForText("That is 34 sparks! Add the groups. Let's try again!")?.id).toBe(
      "voice.world.no-northern-34",
    );
    expect(narrationClipForText("That is 4 sparks! Count both bands. Let's try again!")?.id).toBe(
      "voice.world.no-northern-4-sparks",
    );
    expect(narrationClipForText("Hooray! The hill! From the hill.")?.id).toBe(
      "voice.world.yes-northern-hill",
    );
    expect(
      narrationClipForText("That is The thin ice! Nana said not the thin ice. Let's try again!")?.id,
    ).toBe("voice.world.no-northern-thin");
    expect(narrationClipForText("That is The oven! Not this sky. Let's try again!")?.id).toBe(
      "voice.world.no-northern-oven",
    );
    expect(narrationClipForText("Hooray! Seal! A seal on the rock.")?.id).toBe("voice.world.yes-seal-seal");
    expect(narrationClipForText("That is Hen! Hens stay in yards. Let's try again!")?.id).toBe(
      "voice.world.no-seal-hen",
    );
    expect(narrationClipForText("That is Crane! Cranes lift crates. Let's try again!")?.id).toBe(
      "voice.world.no-seal-crane",
    );
    expect(narrationClipForText("Hooray! Seal! A seal barking.")?.id).toBe("voice.world.yes-seal-bark");
    expect(
      narrationClipForText("That is Yard dog! Yard dogs stay by houses. Let's try again!")?.id,
    ).toBe("voice.world.no-seal-dog");
    expect(narrationClipForText("That is Owl! Owls hoot in woods. Let's try again!")?.id).toBe(
      "voice.world.no-seal-owl",
    );
    expect(narrationClipForText("Hooray! Seal! Seals rest on wet rocks.")?.id).toBe(
      "voice.world.yes-seal-rest",
    );
    expect(narrationClipForText("Hooray! 5 shells! Five shells.")?.id).toBe("voice.world.yes-seal-5");
    expect(narrationClipForText("That is 2 shells! Count the whole line. Let's try again!")?.id).toBe(
      "voice.world.no-seal-2",
    );
    expect(narrationClipForText("That is 8 shells! Not eight this tide. Let's try again!")?.id).toBe(
      "voice.world.no-seal-8",
    );
    expect(narrationClipForText("Hooray! S! Seal starts with S.")?.id).toBe("voice.world.yes-seal-s");
    expect(narrationClipForText("That is C! C starts cub. Let's try again!")?.id).toBe(
      "voice.world.no-seal-c",
    );
    expect(narrationClipForText("That is T! T starts tide. Let's try again!")?.id).toBe(
      "voice.world.no-seal-t",
    );
    expect(narrationClipForText("Hooray! 5 seals! Two and three make five.")?.id).toBe(
      "voice.world.yes-seal-5-seals",
    );
    expect(narrationClipForText("That is 23 seals! Add the groups. Let's try again!")?.id).toBe(
      "voice.world.no-seal-23",
    );
    expect(narrationClipForText("That is 3 seals! Count both rocks. Let's try again!")?.id).toBe(
      "voice.world.no-seal-3",
    );
    expect(narrationClipForText("Hooray! Cold sea and rocks! Sea and wet rocks.")?.id).toBe(
      "voice.world.yes-seal-sea",
    );
    expect(narrationClipForText("That is Attic! Too dry and high. Let's try again!")?.id).toBe(
      "voice.world.no-seal-attic",
    );
    expect(narrationClipForText("That is Desert! Too hot. Let's try again!")?.id).toBe(
      "voice.world.no-seal-desert",
    );
    expect(narrationClipForText("Hooray! Sock! Rock and sock rhyme.")?.id).toBe("voice.world.yes-seal-sock");
    expect(
      narrationClipForText("That is Seal! Seal does not rhyme with rock. Let's try again!")?.id,
    ).toBe("voice.world.no-seal-seal");
    expect(
      narrationClipForText("That is Fish! Fish does not rhyme with rock. Let's try again!")?.id,
    ).toBe("voice.world.no-seal-fish");
    expect(narrationClipForText("Hooray! Sleep! Time to sleep.")?.id).toBe("voice.world.yes-bedroom-sleep");
    expect(
      narrationClipForText("That is A long run! The body is asking for rest. Let's try again!")?.id,
    ).toBe("voice.world.no-bedroom-run");
    expect(narrationClipForText("That is Loud drums! Quiet helps sleep. Let's try again!")?.id).toBe(
      "voice.world.no-bedroom-drums",
    );
    expect(narrationClipForText("Hooray! 3 teddies! Three teddies.")?.id).toBe("voice.world.yes-bedroom-3");
    expect(narrationClipForText("That is 1 teddy! Count the whole quilt. Let's try again!")?.id).toBe(
      "voice.world.no-bedroom-1",
    );
    expect(narrationClipForText("That is 6 teddies! Not six tonight. Let's try again!")?.id).toBe(
      "voice.world.no-bedroom-6",
    );
    expect(narrationClipForText("Hooray! A picture book! Books belong at bedtime.")?.id).toBe(
      "voice.world.yes-bedroom-book",
    );
    expect(narrationClipForText("That is A trumpet! Trumpets are loud. Let's try again!")?.id).toBe(
      "voice.world.no-bedroom-trumpet",
    );
    expect(narrationClipForText("Hooray! B! Bed starts with B.")?.id).toBe("voice.world.yes-bedroom-b");
    expect(narrationClipForText("That is D! D starts dark. Let's try again!")?.id).toBe(
      "voice.world.no-bedroom-d",
    );
    expect(narrationClipForText("That is P! P starts pillow. Let's try again!")?.id).toBe(
      "voice.world.no-bedroom-p",
    );
    expect(narrationClipForText("Hooray! Soft notes! Soft notes for sleep.")?.id).toBe(
      "voice.world.yes-bedroom-soft",
    );
    expect(narrationClipForText("That is Crash! Too loud for bed. Let's try again!")?.id).toBe(
      "voice.world.no-bedroom-crash",
    );
    expect(narrationClipForText("Hooray! Nana! Nana said it last.")?.id).toBe("voice.world.yes-bedroom-nana");
    expect(narrationClipForText("That is Pip! Pip said it first. Let's try again!")?.id).toBe(
      "voice.world.no-bedroom-pip",
    );
    expect(narrationClipForText("That is The owl! The owl is outside. Let's try again!")?.id).toBe(
      "voice.world.no-bedroom-owl",
    );
    expect(
      narrationClipForText("That is A camera flash! This pattern is the lamp. Let's try again!")?.id,
    ).toBe("voice.world.no-bedroom-flash");
    expect(narrationClipForText("That is Bright! Bright just happened. Let's try again!")?.id).toBe(
      "voice.world.no-bedroom-bright",
    );
    expect(narrationClipForText("Hooray! Rectangle! A rectangle window.")?.id).toBe(
      "voice.world.yes-bedroom-rect",
    );
    expect(
      narrationClipForText("That is Circle! This window has long sides. Let's try again!")?.id,
    ).toBe("voice.world.no-bedroom-circle");
    expect(narrationClipForText("That is Star! Not a star window. Let's try again!")?.id).toBe(
      "voice.world.no-bedroom-star",
    );
    expect(narrationClipForText("Hooray! Owl! An owl in the hole.")?.id).toBe("voice.world.yes-owl-owl");
    expect(narrationClipForText("That is Duck! Ducks quack on ponds. Let's try again!")?.id).toBe(
      "voice.world.no-owl-duck",
    );
    expect(narrationClipForText("That is Bus! Buses rumble roads. Let's try again!")?.id).toBe(
      "voice.world.no-owl-bus",
    );
    expect(narrationClipForText("Hooray! A tree hole! In a tree hole.")?.id).toBe("voice.world.yes-owl-tree");
    expect(narrationClipForText("That is Fridge! Too closed and cold. Let's try again!")?.id).toBe(
      "voice.world.no-owl-fridge",
    );
    expect(narrationClipForText("Hooray! 2 eyes! Two eyes.")?.id).toBe("voice.world.yes-owl-2");
    expect(narrationClipForText("That is 1 eye! Owls have two. Let's try again!")?.id).toBe(
      "voice.world.no-owl-1",
    );
    expect(narrationClipForText("That is 5 eyes! Not five. Let's try again!")?.id).toBe(
      "voice.world.no-owl-5",
    );
    expect(narrationClipForText("Hooray! Owl! Owls hunt at night.")?.id).toBe("voice.world.yes-owl-hunt");
    expect(narrationClipForText("That is Bee! Bees work in day flowers. Let's try again!")?.id).toBe(
      "voice.world.no-owl-bee",
    );
    expect(narrationClipForText("Hooray! O! Owl starts with O.")?.id).toBe("voice.world.yes-owl-o");
    expect(narrationClipForText("That is A! A starts ant. Let's try again!")?.id).toBe("voice.world.no-owl-a");
    expect(narrationClipForText("That is U! U starts under. Let's try again!")?.id).toBe(
      "voice.world.no-owl-u",
    );
    expect(narrationClipForText("Hooray! The deep owl! The deep owl called last.")?.id).toBe(
      "voice.world.yes-owl-deep",
    );
    expect(
      narrationClipForText("That is The small owl! The small owl called first. Let's try again!")?.id,
    ).toBe("voice.world.no-owl-small");
    expect(narrationClipForText("That is The ferry! No ferry in this wood. Let's try again!")?.id).toBe(
      "voice.world.no-owl-ferry",
    );
    expect(narrationClipForText("Hooray! 6 pines! Three and three make six.")?.id).toBe(
      "voice.world.yes-owl-6",
    );
    expect(narrationClipForText("That is 33 pines! Add the groups. Let's try again!")?.id).toBe(
      "voice.world.no-owl-33",
    );
    expect(narrationClipForText("That is 3 pines! Count both rows. Let's try again!")?.id).toBe(
      "voice.world.no-owl-3",
    );
    expect(narrationClipForText("Hooray! Bee! Tree and bee rhyme.")?.id).toBe("voice.world.yes-owl-bee");
    expect(
      narrationClipForText("That is Owl! Owl does not rhyme with tree. Let's try again!")?.id,
    ).toBe("voice.world.no-owl-owl");
    expect(
      narrationClipForText("That is Wood! Wood does not rhyme with tree. Let's try again!")?.id,
    ).toBe("voice.world.no-owl-wood");
    expect(narrationClipForText("Hooray! 9 stars! Nine stars.")?.id).toBe("voice.world.yes-star-9");
    expect(narrationClipForText("That is 4 stars! Count the whole rail-sky. Let's try again!")?.id).toBe(
      "voice.world.no-star-4",
    );
    expect(narrationClipForText("That is 12 stars! Not twelve this night. Let's try again!")?.id).toBe(
      "voice.world.no-star-12",
    );
    expect(narrationClipForText("Hooray! The moon! The moon.")?.id).toBe("voice.world.yes-star-moon");
    expect(
      narrationClipForText("That is An orange! Oranges stay at the stall. Let's try again!")?.id,
    ).toBe("voice.world.no-star-orange");
    expect(narrationClipForText("That is M! M starts moon. Let's try again!")?.id).toBe(
      "voice.world.no-star-m",
    );
    expect(narrationClipForText("Hooray! Circle! A round moon.")?.id).toBe("voice.world.yes-star-circle");
    expect(narrationClipForText("That is Square! The moon is not square. Let's try again!")?.id).toBe(
      "voice.world.no-star-square",
    );
    expect(narrationClipForText("Hooray! 9 stars! Four and five make nine.")?.id).toBe(
      "voice.world.yes-star-9-add",
    );
    expect(narrationClipForText("That is 45 stars! Add the groups. Let's try again!")?.id).toBe(
      "voice.world.no-star-45",
    );
    expect(narrationClipForText("That is 5 stars! Count both clusters. Let's try again!")?.id).toBe(
      "voice.world.no-star-5",
    );
    expect(narrationClipForText("Hooray! A rest! AB continues with rest.")?.id).toBe(
      "voice.world.yes-star-rest",
    );
    expect(narrationClipForText("That is A drum! This pattern is twinkles. Let's try again!")?.id).toBe(
      "voice.world.no-star-drum",
    );
    expect(narrationClipForText("That is A twinkle! Twinkle just happened. Let's try again!")?.id).toBe(
      "voice.world.no-star-twinkle",
    );
    expect(narrationClipForText("Hooray! Above the rail! Above the rail.")?.id).toBe(
      "voice.world.yes-star-rail",
    );
    expect(narrationClipForText("That is In the kettle! Not the kettle. Let's try again!")?.id).toBe(
      "voice.world.no-star-kettle",
    );
    expect(narrationClipForText("That is In a shoe! Not a shoe. Let's try again!")?.id).toBe(
      "voice.world.no-star-shoe",
    );
    expect(narrationClipForText("Hooray! A star! Stars belong in the sky.")?.id).toBe(
      "voice.world.yes-star-star",
    );
    expect(narrationClipForText("That is A bus! Buses stay on the street. Let's try again!")?.id).toBe(
      "voice.world.no-star-bus",
    );
    expect(
      narrationClipForText("That is A spoon! Spoons stay in the kitchen. Let's try again!")?.id,
    ).toBe("voice.world.no-star-spoon");
    expect(narrationClipForText("Hooray! Moth! A moth at the bulb.")?.id).toBe("voice.world.yes-porch-moth");
    expect(narrationClipForText("Hooray! 5 moths! Five moths.")?.id).toBe("voice.world.yes-porch-5");
    expect(narrationClipForText("That is 2 moths! Count the whole glass. Let's try again!")?.id).toBe(
      "voice.world.no-porch-2",
    );
    expect(narrationClipForText("That is 8 moths! Not eight tonight. Let's try again!")?.id).toBe(
      "voice.world.no-porch-8",
    );
    expect(narrationClipForText("Hooray! Moth! Moths come to bulbs.")?.id).toBe("voice.world.yes-porch-bulbs");
    expect(narrationClipForText("That is Penguin! Penguins stay on ice. Let's try again!")?.id).toBe(
      "voice.world.no-porch-penguin",
    );
    expect(narrationClipForText("That is A loaf! Loaves stay in the bakery. Let's try again!")?.id).toBe(
      "voice.world.no-porch-loaf",
    );
    expect(narrationClipForText("That is N! N starts night. Let's try again!")?.id).toBe(
      "voice.world.no-porch-n",
    );
    expect(narrationClipForText("That is P! P starts porch. Let's try again!")?.id).toBe(
      "voice.world.no-porch-p",
    );
    expect(narrationClipForText("Hooray! 5 moths! Three and two make five.")?.id).toBe(
      "voice.world.yes-porch-5-add",
    );
    expect(narrationClipForText("That is 32 moths! Add the groups. Let's try again!")?.id).toBe(
      "voice.world.no-porch-32",
    );
    expect(narrationClipForText("That is 2 moths! Count both panes. Let's try again!")?.id).toBe(
      "voice.world.no-porch-2-panes",
    );
    expect(narrationClipForText("Hooray! Watch, do not catch! Watch the moths.")?.id).toBe(
      "voice.world.yes-porch-watch",
    );
    expect(
      narrationClipForText("That is Catch them all! Nana said not to catch. Let's try again!")?.id,
    ).toBe("voice.world.no-porch-catch");
    expect(narrationClipForText("That is Shout at them! We stay quiet. Let's try again!")?.id).toBe(
      "voice.world.no-porch-shout",
    );
    expect(narrationClipForText("That is A drum! This pattern is circles. Let's try again!")?.id).toBe(
      "voice.world.no-porch-drum",
    );
    expect(narrationClipForText("That is A circle! Circle just happened. Let's try again!")?.id).toBe(
      "voice.world.no-porch-circle",
    );
    expect(narrationClipForText("Hooray! Night! Light and night rhyme.")?.id).toBe(
      "voice.world.yes-porch-night",
    );
    expect(
      narrationClipForText("That is Moth! Moth does not rhyme with light. Let's try again!")?.id,
    ).toBe("voice.world.no-porch-moth");
    expect(
      narrationClipForText("That is Porch! Porch does not rhyme with light. Let's try again!")?.id,
    ).toBe("voice.world.no-porch-porch");
    expect(narrationClipForText("Hooray! Let's play! Time to play!")?.id).toBe("voice.world.yes-play");
    expect(
      narrationClipForText("Hooray! Hand puppet! The puppet talks when a hand is inside!")?.id,
    ).toBe("voice.world.yes-puppet-puppet");
    expect(narrationClipForText("That is Quiet rock! Rocks do not tell tales. Let's try again!")?.id).toBe(
      "voice.world.no-puppet-rock",
    );
    expect(
      narrationClipForText("That is Soup spoon! Spoons belong in the kitchen. Let's try again!")?.id,
    ).toBe("voice.world.no-puppet-spoon");
    expect(narrationClipForText("Hooray! Moon! Moon starts with mmm!")?.id).toBe("voice.world.yes-word-moon");
    expect(narrationClipForText("That is Sun! Sun starts with sss. Let's try again!")?.id).toBe(
      "voice.world.no-word-sun",
    );
    expect(narrationClipForText("That is Fish! Fish starts with fff. Let's try again!")?.id).toBe(
      "voice.world.no-word-fish",
    );
    expect(narrationClipForText("Hooray! Rain boots! Boots splash and stay dry inside!")?.id).toBe(
      "voice.world.yes-rainy-boots",
    );
    expect(
      narrationClipForText("That is Soft socks! Socks get soggy in puddles. Let's try again!")?.id,
    ).toBe("voice.world.no-rainy-socks");
    expect(
      narrationClipForText("That is Sun hat! A sun hat is for bright days. Let's try again!")?.id,
    ).toBe("voice.world.no-rainy-hat");
    expect(narrationClipForText("That made Orange. We need Purple. Mix again!")?.id).toBe(
      "voice.color.need-orange-purple",
    );
    expect(narrationClipForText("That made Orange. We need Green. Mix again!")?.id).toBe(
      "voice.color.need-orange-green",
    );
    expect(narrationClipForText("That made Green. We need Orange. Mix again!")?.id).toBe(
      "voice.color.need-green-orange",
    );
    expect(narrationClipForText("That made Green. We need Purple. Mix again!")?.id).toBe(
      "voice.color.need-green-purple",
    );
    expect(narrationClipForText("That made Purple. We need Orange. Mix again!")?.id).toBe(
      "voice.color.need-purple-orange",
    );
    expect(narrationClipForText("That made Purple. We need Green. Mix again!")?.id).toBe(
      "voice.color.need-purple-green",
    );
    expect(narrationClipForText("Beep beep!")?.id).toBe("voice.open.beep");
    expect(narrationClipForText("That made Pink. We need Orange. Mix again!")?.id).toBe(
      "voice.color.need-pink-orange",
    );
    expect(narrationClipForText("That made Pink. We need Purple. Mix again!")?.id).toBe(
      "voice.color.need-pink-purple",
    );
    expect(narrationClipForText("That made Pink. We need Green. Mix again!")?.id).toBe(
      "voice.color.need-pink-green",
    );
    expect(narrationClipForText("That made Cream. We need Orange. Mix again!")?.id).toBe(
      "voice.color.need-cream-orange",
    );
    expect(narrationClipForText("That made Cream. We need Purple. Mix again!")?.id).toBe(
      "voice.color.need-cream-purple",
    );
    expect(narrationClipForText("That made Cream. We need Green. Mix again!")?.id).toBe(
      "voice.color.need-cream-green",
    );
    expect(narrationClipForText("That made Sky. We need Orange. Mix again!")?.id).toBe(
      "voice.color.need-sky-orange",
    );
    expect(narrationClipForText("That made Sky. We need Purple. Mix again!")?.id).toBe(
      "voice.color.need-sky-purple",
    );
    expect(narrationClipForText("That made Sky. We need Green. Mix again!")?.id).toBe(
      "voice.color.need-sky-green",
    );
    expect(narrationClipForText("Mix two colours until you make Orange!")?.id).toBe(
      "voice.color.mix-until-orange",
    );
    expect(narrationClipForText("Mix two colours until you make Purple!")?.id).toBe(
      "voice.color.mix-until-purple",
    );
    expect(narrationClipForText("Mix two colours until you make Green!")?.id).toBe(
      "voice.color.mix-until-green",
    );
    expect(
      narrationClipForText(
        "Hooray! You finished reading Animal Phonics Safari! You earned three golden stars!",
      )?.id,
    ).toBe("voice.book.finish-animal-phonics-safari");
    expect(
      narrationClipForText(
        "Hooray! You finished reading The Stoop Watermelon! You earned three golden stars!",
      )?.id,
    ).toBe("voice.book.finish-stoop-watermelon");
    expect(
      narrationClipForText(
        "Hooray! You finished reading Paper Boat in the Gutter! You earned three golden stars!",
      )?.id,
    ).toBe("voice.book.finish-paper-gutter-boat");
    expect(
      narrationClipForText(
        "Hooray! You finished reading Window Box Tomatoes! You earned three golden stars!",
      )?.id,
    ).toBe("voice.book.finish-window-box-tomatoes");
    expect(
      narrationClipForText(
        "Hooray! You finished reading The Folding Table Feast! You earned three golden stars!",
      )?.id,
    ).toBe("voice.book.finish-folding-table-feast");
    expect(
      narrationClipForText(
        "Hooray! You finished reading How Mail Travels! You earned three golden stars!",
      )?.id,
    ).toBe("voice.book.finish-how-mail-travels");
    expect(
      narrationClipForText(
        "Hooray! You finished reading How Bread Rises! You earned three golden stars!",
      )?.id,
    ).toBe("voice.book.finish-how-bread-rises");
    expect(
      narrationClipForText(
        "Hooray! You finished reading What Rain Does! You earned three golden stars!",
      )?.id,
    ).toBe("voice.book.finish-what-rain-does");
    expect(
      narrationClipForText(
        "Hooray! You finished reading How a Ferry Floats! You earned three golden stars!",
      )?.id,
    ).toBe("voice.book.finish-how-a-ferry-floats");
    expect(
      narrationClipForText(
        "Hooray! You finished reading The Cat on the Mat! You earned three golden stars!",
      )?.id,
    ).toBe("voice.book.finish-cat-on-mat");
    expect(
      narrationClipForText(
        "Hooray! You finished reading The Red Bus! You earned three golden stars!",
      )?.id,
    ).toBe("voice.book.finish-the-red-bus");
    expect(
      narrationClipForText(
        "Hooray! You finished reading The Hot Pot! You earned three golden stars!",
      )?.id,
    ).toBe("voice.book.finish-hot-pot-sip");
    expect(
      narrationClipForText(
        "Hooray! You finished reading A Big Hug in Bed! You earned three golden stars!",
      )?.id,
    ).toBe("voice.book.finish-big-hug-bed");
    expect(
      narrationClipForText(
        "Hooray! You finished reading A Pig in the Mud! You earned three golden stars!",
      )?.id,
    ).toBe("voice.book.finish-pig-in-mud");
    expect(
      narrationClipForText(
        "Hooray! You finished reading The Fox in the Box! You earned three golden stars!",
      )?.id,
    ).toBe("voice.book.finish-fox-in-box");
    expect(
      narrationClipForText(
        "Hooray! You finished reading The Dog on the Log! You earned three golden stars!",
      )?.id,
    ).toBe("voice.book.finish-dog-on-log");
    expect(
      narrationClipForText(
        "Hooray! You finished reading The Hen in the Pen! You earned three golden stars!",
      )?.id,
    ).toBe("voice.book.finish-hen-in-pen");
    expect(
      narrationClipForText(
        "Hooray! You finished reading The Bug in the Mug! You earned three golden stars!",
      )?.id,
    ).toBe("voice.book.finish-bug-in-mug");
    expect(
      narrationClipForText(
        "Hooray! You finished reading Hop on Top! You earned three golden stars!",
      )?.id,
    ).toBe("voice.book.finish-hop-on-top");
    expect(
      narrationClipForText(
        "Hooray! You finished reading Pancake Saturday! You earned three golden stars!",
      )?.id,
    ).toBe("voice.book.finish-pancake-saturday");
    expect(
      narrationClipForText(
        "Hooray! You finished reading The Little Red Fire Truck! You earned three golden stars!",
      )?.id,
    ).toBe("voice.book.finish-little-red-fire-truck");
    expect(
      narrationClipForText(
        "Hooray! You finished reading Snow Day on Maple Street! You earned three golden stars!",
      )?.id,
    ).toBe("voice.book.finish-snow-maple-street");
    expect(
      narrationClipForText(
        "Hooray! You finished reading Dot and the Quiet Lion! You earned three golden stars!",
      )?.id,
    ).toBe("voice.book.finish-dot-library-mouse");
    expect(
      narrationClipForText(
        "Hooray! You finished reading Lemonade on the Stoop! You earned three golden stars!",
      )?.id,
    ).toBe("voice.book.finish-lemonade-stoop");
    expect(
      narrationClipForText(
        "Hooray! You finished reading The Night Bus Home! You earned three golden stars!",
      )?.id,
    ).toBe("voice.book.finish-night-bus-home");
    expect(
      narrationClipForText(
        "Hooray! You finished reading The Lost Red Mitten! You earned three golden stars!",
      )?.id,
    ).toBe("voice.book.finish-lost-red-mitten");
    expect(
      narrationClipForText(
        "Hooray! You finished reading Nana’s Porch Swing! You earned three golden stars!",
      )?.id,
    ).toBe("voice.book.finish-nana-porch-swing");
    expect(
      narrationClipForText(
        "Hooray! You finished reading The Kind Mail Truck! You earned three golden stars!",
      )?.id,
    ).toBe("voice.book.finish-kind-mail-truck");
    expect(
      narrationClipForText(
        "Hooray! You finished reading Gully’s Harbor Morning! You earned three golden stars!",
      )?.id,
    ).toBe("voice.book.finish-gully-harbor-morning");
    expect(
      narrationClipForText(
        "Hooray! You finished reading Diner Booth for Two! You earned three golden stars!",
      )?.id,
    ).toBe("voice.book.finish-diner-booth-two");
    expect(
      narrationClipForText(
        "Hooray! You finished reading The First Day Yellow Bus! You earned three golden stars!",
      )?.id,
    ).toBe("voice.book.finish-first-day-yellow-bus");
    expect(
      narrationClipForText(
        "Hooray! You finished reading The Corner Store Bell! You earned three golden stars!",
      )?.id,
    ).toBe("voice.book.finish-corner-store-bell");
    expect(
      narrationClipForText(
        "Hooray! You finished reading Laundromat Rain! You earned three golden stars!",
      )?.id,
    ).toBe("voice.book.finish-laundromat-rain");
    expect(
      narrationClipForText(
        "Hooray! You finished reading Backyard Sprinkler! You earned three golden stars!",
      )?.id,
    ).toBe("voice.book.finish-backyard-sprinkler");
    expect(
      narrationClipForText(
        "Hooray! You finished reading The Red Wagon Hill! You earned three golden stars!",
      )?.id,
    ).toBe("voice.book.finish-red-wagon-hill");
    expect(
      narrationClipForText(
        "Hooray! You finished reading Market Saturday Berries! You earned three golden stars!",
      )?.id,
    ).toBe("voice.book.finish-market-saturday-berries");
    expect(
      narrationClipForText(
        "Hooray! You finished reading Elevator Buttons! You earned three golden stars!",
      )?.id,
    ).toBe("voice.book.finish-elevator-buttons");
    expect(
      narrationClipForText(
        "Hooray! You finished reading The Rainy Attic Trunk! You earned three golden stars!",
      )?.id,
    ).toBe("voice.book.finish-attic-rain-trunk");
    expect(
      narrationClipForText(
        "Hooray! You finished reading Ferry Horn Morning! You earned three golden stars!",
      )?.id,
    ).toBe("voice.book.finish-ferry-horn-morning");
    expect(
      narrationClipForText(
        "Hooray! You finished reading Sidewalk Chalk Sun! You earned three golden stars!",
      )?.id,
    ).toBe("voice.book.finish-sidewalk-chalk-sun");
    expect(
      narrationClipForText(
        "Hooray! You finished reading Bakery Window Fog! You earned three golden stars!",
      )?.id,
    ).toBe("voice.book.finish-bakery-window-fog");
    expect(
      narrationClipForText(
        "Hooray! You finished reading Hardware Drawer of Knobs! You earned three golden stars!",
      )?.id,
    ).toBe("voice.book.finish-hardware-drawer-knobs");
    expect(
      narrationClipForText(
        "Hooray! You finished reading Bandstand Pigeons! You earned three golden stars!",
      )?.id,
    ).toBe("voice.book.finish-park-bandstand-pigeons");
    expect(
      narrationClipForText(
        "Hooray! You finished reading The Token and the Tunnel! You earned three golden stars!",
      )?.id,
    ).toBe("voice.book.finish-subway-token-mouse");
    expect(
      narrationClipForText(
        "Hooray! You finished reading Dusk in a Jar! You earned three golden stars!",
      )?.id,
    ).toBe("voice.book.finish-porch-dusk-jar");
    expect(
      narrationClipForText(
        "Hooray! You finished reading The Lighthouse Blink! You earned three golden stars!",
      )?.id,
    ).toBe("voice.book.finish-lighthouse-blink");
    expect(
      narrationClipForText(
        "Hooray! You finished reading Corner Shop Ding! You earned three golden stars!",
      )?.id,
    ).toBe("voice.book.finish-corner-shop-ding");
    expect(
      narrationClipForText(
        "Hooray! You finished reading Three Coins in the Fountain! You earned three golden stars!",
      )?.id,
    ).toBe("voice.book.finish-fountain-three-coins");
    expect(
      narrationClipForText(
        "Hooray! You finished reading Yellow Taxi Puddle! You earned three golden stars!",
      )?.id,
    ).toBe("voice.book.finish-yellow-taxi-puddle");
    expect(
      narrationClipForText(
        "Hooray! You finished reading The Key Under the Mat! You earned three golden stars!",
      )?.id,
    ).toBe("voice.book.finish-lost-key-mat");
    expect(
      narrationClipForText(
        "Hooray! You finished reading Quilt Square Moon! You earned three golden stars!",
      )?.id,
    ).toBe("voice.book.finish-quilt-square-moon");
    expect(
      narrationClipForText(
        "Hooray! You finished reading Snowplow Dawn! You earned three golden stars!",
      )?.id,
    ).toBe("voice.book.finish-snow-plow-dawn");
    expect(
      narrationClipForText(
        "Hooray! You finished reading Icebox Lemonade! You earned three golden stars!",
      )?.id,
    ).toBe("voice.book.finish-icebox-lemonade");
    expect(
      narrationClipForText(
        "Hooray! You finished reading Counting in the Sunshine Garden! You earned three golden stars!",
      )?.id,
    ).toBe("voice.book.finish-garden-counting");
    expect(
      narrationClipForText(
        "Hooray! You finished reading The Colors & Shapes Parade! You earned three golden stars!",
      )?.id,
    ).toBe("voice.book.finish-colors-shapes-circus");
    expect(
      narrationClipForText(
        "Hooray! You finished reading Goodnight, Little Bear! You earned three golden stars!",
      )?.id,
    ).toBe("voice.book.finish-little-bear-bedtime");
    expect(
      narrationClipForText(
        "Hooray! You finished reading Buddy's Busy Day on the Farm! You earned three golden stars!",
      )?.id,
    ).toBe("voice.book.finish-buddy-farm-tale");
    expect(
      narrationClipForText(
        "Hooray! You finished reading The Little Silver Rocket! You earned three golden stars!",
      )?.id,
    ).toBe("voice.book.finish-rocket-space-trip");
    expect(
      narrationClipForText(
        "Hooray! You finished reading Splish Splash Ocean Parade! You earned three golden stars!",
      )?.id,
    ).toBe("voice.book.finish-ocean-friends-dive");
    expect(
      narrationClipForText(
        "Hooray! You finished reading How Leo Feels Today! You earned three golden stars!",
      )?.id,
    ).toBe("voice.book.finish-feelings-with-leo");
    expect(
      narrationClipForText(
        "Hooray! You finished reading Cosmic Rocket Journey to the Stars! You earned three golden stars!",
      )?.id,
    ).toBe("voice.book.finish-cosmic-rocket-journey");
    expect(
      narrationClipForText(
        "Hooray! You finished reading Deep Ocean Wonders! You earned three golden stars!",
      )?.id,
    ).toBe("voice.book.finish-deep-ocean-wonders");
    expect(
      narrationClipForText(
        "Hooray! You finished reading How the Tiny Seed Grows! You earned three golden stars!",
      )?.id,
    ).toBe("voice.book.finish-tiny-seed-grows");
    expect(
      narrationClipForText(
        "Hooray! You finished reading Bedtime Starlight Lullaby! You earned three golden stars!",
      )?.id,
    ).toBe("voice.book.finish-bedtime-starlight-lullaby");
    expect(
      narrationClipForText(
        "Hooray! You finished reading Magic Manners Tea Party! You earned three golden stars!",
      )?.id,
    ).toBe("voice.book.finish-magic-manners-tea-party");
    expect(
      narrationClipForText(
        "Hooray! You finished reading The Noisy Farm Chorus! You earned three golden stars!",
      )?.id,
    ).toBe("voice.book.finish-the-noisy-farm-chorus");
    expect(
      narrationClipForText(
        "Hooray! You finished reading Dino Footprint Detective! You earned three golden stars!",
      )?.id,
    ).toBe("voice.book.finish-dino-footprint-detective");
    expect(
      narrationClipForText(
        "Hooray! You finished reading Rainy Day Rainbow Builder! You earned three golden stars!",
      )?.id,
    ).toBe("voice.book.finish-rainy-day-rainbow-builder");
    expect(
      narrationClipForText(
        "Hooray! You finished reading The Brave Little Firefly! You earned three golden stars!",
      )?.id,
    ).toBe("voice.book.finish-the-brave-little-firefly");
    expect(
      narrationClipForText(
        "Hooray! You finished reading Busy Beehive Architects! You earned three golden stars!",
      )?.id,
    ).toBe("voice.book.finish-busy-beehive-architects");
    expect(
      narrationClipForText(
        "Hooray! You finished reading The Curious Caterpillar's Big Change! You earned three golden stars!",
      )?.id,
    ).toBe("voice.book.finish-the-curious-caterpillar");
    expect(
      narrationClipForText(
        "Hooray! You finished reading The Helpful Little Tugboat! You earned three golden stars!",
      )?.id,
    ).toBe("voice.book.finish-the-helpful-little-tugboat");
    expect(
      narrationClipForText(
        "Hooray! You finished reading Superhero Phonics Squad! You earned three golden stars!",
      )?.id,
    ).toBe("voice.book.finish-superhero-phonics-squad");
    expect(
      narrationClipForText(
        "Hooray! You finished reading The Clock Tower Chimes! You earned three golden stars!",
      )?.id,
    ).toBe("voice.book.finish-the-clock-tower-chimes");
    expect(
      narrationClipForText(
        "Hooray! You finished reading Little Bear's Lost Button! You earned three golden stars!",
      )?.id,
    ).toBe("voice.book.finish-little-bear-lost-button");
    expect(
      narrationClipForText(
        "Hooray! You finished reading Penguins on the Floe! You earned three golden stars!",
      )?.id,
    ).toBe("voice.book.finish-penguin-floe-night");
    expect(
      narrationClipForText(
        "Hooray! You finished reading Owl Wood Lullaby! You earned three golden stars!",
      )?.id,
    ).toBe("voice.book.finish-owl-wood-lullaby");
    expect(
      narrationClipForText(
        "Hooray! You finished reading The High Street Bus! You earned three golden stars!",
      )?.id,
    ).toBe("voice.book.finish-high-street-bus");
    expect(
      narrationClipForText(
        "Hooray! You finished reading Nana's Soup Pot! You earned three golden stars!",
      )?.id,
    ).toBe("voice.book.finish-nana-soup-pot");
    expect(
      narrationClipForText(
        "Hooray! You finished reading Pond Edge Bugs! You earned three golden stars!",
      )?.id,
    ).toBe("voice.book.finish-pond-edge-bugs");
    expect(
      narrationClipForText(
        "Hooray! You finished reading Park Green Picnic! You earned three golden stars!",
      )?.id,
    ).toBe("voice.book.finish-park-green-picnic");
    expect(
      narrationClipForText(
        "Hooray! You finished reading Atelier Paint Day! You earned three golden stars!",
      )?.id,
    ).toBe("voice.book.finish-atelier-paint-day");
    expect(
      narrationClipForText(
        "Hooray! You finished reading Letter Meadow ABC! You earned three golden stars!",
      )?.id,
    ).toBe("voice.book.finish-letter-meadow-abc");
    expect(
      narrationClipForText(
        "Hooray! You finished reading Pine Trail Map! You earned three golden stars!",
      )?.id,
    ).toBe("voice.book.finish-pine-trail-map");
    expect(
      narrationClipForText(
        "Hooray! You finished reading Home Kind Morning! You earned three golden stars!",
      )?.id,
    ).toBe("voice.book.finish-home-kind-morning");
    expect(
      narrationClipForText(
        "Mission started: Barnyard Morning Helper! Step 1: Listen for the Cow. Listen with your ears! Who is chewing sweet clover in the meadow and says Moooo?",
      )?.id,
    ).toBe("voice.mission.farm-helper-start");
    expect(
      narrationClipForText(
        "Next Mission Step: Find the Kitten! Mother Cat says meow meow! Can you find her tiny baby kitten?",
      )?.id,
    ).toBe("voice.mission.farm-helper-next-kitten");
    expect(
      narrationClipForText(
        "Next Mission Step: Count the Chicks! Look at the cozy hay! Count the fluffy yellow chicks: one, two, three!",
      )?.id,
    ).toBe("voice.mission.farm-helper-next-chicks");
    expect(
      narrationClipForText(
        "Next Mission Step: Feed Barnaby! Barnaby the brown horse is hungry! What sweet crunchy treat does he love to eat?",
      )?.id,
    ).toBe("voice.mission.farm-helper-next-barnaby");
    expect(
      narrationClipForText(
        "Congratulations! You completed the entire mission: Barnyard Morning Helper! You earned the Farm Helper Hero badge!",
      )?.id,
    ).toBe("voice.mission.farm-helper-complete");
    expect(
      narrationClipForText(
        "Mission started: Great Jungle Expedition! Step 1: Listen for the Swinging Monkey. Listen to the treetop chatter! Who is swinging on the vines shouting ooh ooh aah aah?",
      )?.id,
    ).toBe("voice.mission.jungle-expedition-start");
    expect(
      narrationClipForText(
        "Next Mission Step: Examine Giant Paw Prints! Look at these giant paw prints in the dirt! Who has a magnificent furry mane and padded paws?",
      )?.id,
    ).toBe("voice.mission.jungle-expedition-next-paws");
    expect(
      narrationClipForText(
        "Next Mission Step: Find the Parrot's Home! Where does the beautiful tropical parrot make its cozy home?",
      )?.id,
    ).toBe("voice.mission.jungle-expedition-next-parrot");
    expect(
      narrationClipForText(
        "Next Mission Step: Count 4 Ripe Bananas! Count the sweet ripe bananas hanging in the cluster: one, two, three, four!",
      )?.id,
    ).toBe("voice.mission.jungle-expedition-next-bananas");
    expect(
      narrationClipForText(
        "Congratulations! You completed the entire mission: Great Jungle Expedition! You earned the Jungle Master Scout badge!",
      )?.id,
    ).toBe("voice.mission.jungle-expedition-complete");
    expect(
      narrationClipForText(
        "Mission started: Coral Reef Submarine Voyage! Step 1: Find the Leaping Dolphin. Listen to the sparkling water! Who clicks happily and leaps high out of ocean waves?",
      )?.id,
    ).toBe("voice.mission.ocean-voyage-start");
    expect(
      narrationClipForText(
        "Next Mission Step: Spot the Glowing Jellyfish! Who floats like a magical lantern glowing softly in the deep water?",
      )?.id,
    ).toBe("voice.mission.ocean-voyage-next-jellyfish");
    expect(
      narrationClipForText(
        "Next Mission Step: Sort Land vs Sea! Can you sort our animal friends? Put land walkers on the left and ocean swimmers on the right!",
      )?.id,
    ).toBe("voice.mission.ocean-voyage-next-sort");
    expect(
      narrationClipForText(
        "Congratulations! You completed the entire mission: Coral Reef Submarine Voyage! You earned the Deep Sea Navigator badge!",
      )?.id,
    ).toBe("voice.mission.ocean-voyage-complete");
    expect(
      narrationClipForText(
        "Mission started: Prehistoric Fossil Expedition! Step 1: Find the Long-Neck Giant. Who had the magnificent extra-long neck to reach sweet green leaves in the highest treetops?",
      )?.id,
    ).toBe("voice.mission.dino-excavation-start");
    expect(
      narrationClipForText(
        "Next Mission Step: Hear the Mighty Roar! Listen to the heavy footsteps: Boom! Boom! Who lets out a mighty dinosaur roar?",
      )?.id,
    ).toBe("voice.mission.dino-excavation-next-roar");
    expect(
      narrationClipForText(
        "Congratulations! You completed the entire mission: Prehistoric Fossil Expedition! You earned the Dino Master Paleontologist badge!",
      )?.id,
    ).toBe("voice.mission.dino-excavation-complete");
    expect(
      narrationClipForText(
        "Mission started: Lunar Landing Mission! Step 1: Launch Pip's Rocket. Pip is ready! Countdown: 3, 2, 1! Tap the glowing launch button to blast off!",
      )?.id,
    ).toBe("voice.mission.moon-voyager-start");
    expect(
      narrationClipForText(
        "Next Mission Step: Count 4 Twinkling Stars! Look at the glowing stars outside the rocket! Can you count 4 shiny stars?",
      )?.id,
    ).toBe("voice.mission.moon-voyager-next-stars");
    expect(
      narrationClipForText(
        "Congratulations! You completed the entire mission: Lunar Landing Mission! You earned the Space Cadet Commander badge!",
      )?.id,
    ).toBe("voice.mission.moon-voyager-complete");
    expect(
      narrationClipForText(
        "Mission started: Apprentice Color Wizard! Step 1: Brew Sweet Orange. When we mix ruby Red with sunny Yellow paint, what magical color appears?",
      )?.id,
    ).toBe("voice.mission.color-wizard-start");
    expect(
      narrationClipForText(
        "Next Mission Step: Brew Emerald Green! When we mix ocean Blue with sunny Yellow paint, what fresh nature color appears?",
      )?.id,
    ).toBe("voice.mission.color-wizard-next-green");
    expect(
      narrationClipForText(
        "Congratulations! You completed the entire mission: Apprentice Color Wizard! You earned the Master Color Chemist badge!",
      )?.id,
    ).toBe("voice.mission.color-wizard-complete");
    expect(
      narrationClipForText(
        "Mission started: Alphabet Sound Detective! Step 1: Find the B sound. B says buh! Which item starts with the buh buh sound of letter B?",
      )?.id,
    ).toBe("voice.mission.phonics-detective-start");
    expect(
      narrationClipForText(
        "Next Mission Step: Find the S sound! S says sss! Which item starts with the sss sss sound of letter S?",
      )?.id,
    ).toBe("voice.mission.phonics-detective-next-s");
    expect(
      narrationClipForText(
        "Congratulations! You completed the entire mission: Alphabet Sound Detective! You earned the Phonics Scout Master badge!",
      )?.id,
    ).toBe("voice.mission.phonics-detective-complete");
    expect(
      narrationClipForText(
        "Mission started: Warm Heart Explorer! Step 1: Find the Big Happy Smile. Can you tap the friend who is feeling super happy and wearing a big bright smile?",
      )?.id,
    ).toBe("voice.mission.happy-helper-start");
    expect(
      narrationClipForText(
        "Congratulations! You completed the entire mission: Warm Heart Explorer! You earned the Sunshine Sprout badge!",
      )?.id,
    ).toBe("voice.mission.happy-helper-complete");
    expect(
      narrationClipForText("Puppet Nook! Tiny stage, big voices. Let's explore together!")?.id,
    ).toBe("voice.district.puppet-nook-welcome");
    expect(
      narrationClipForText("Word Stream! Sounds that swim. Let's explore together!")?.id,
    ).toBe("voice.district.word-stream-welcome");
    expect(
      narrationClipForText("Rainy Window! Boots, drops and cocoa. Let's explore together!")?.id,
    ).toBe("voice.district.rainy-window-welcome");
  });

  it("maps extra farm clue and quiz-feedback lines", () => {
    expect(
      narrationClipForText("A tall bird shouts from the fence at sunrise. Who woke the valley?")?.id,
    ).toBe("voice.farm.x.rooster-clue");
    expect(narrationClipForText("The rooster starts the farm day.")?.id).toBe(
      "voice.farm.x.rooster-fb-yes",
    );
    expect(narrationClipForText("Oink! Pigs use mud like sunscreen.")?.id).toBe(
      "voice.farm.x.mud-fb-yes",
    );
    expect(narrationClipForText("Who grows a thick wool coat we can spin?")?.id).toBe(
      "voice.farm.x.wool-clue",
    );
    expect(narrationClipForText("The trough is for drinking. What belongs there?")?.id).toBe(
      "voice.farm.x.trough-clue",
    );
    expect(narrationClipForText("Yes — animals drink clean water.")?.id).toBe(
      "voice.farm.x.trough-fb-yes",
    );
    expect(
      narrationClipForText("Sss from the thick vines. Who is tasting the air?")?.id,
    ).toBe("voice.jungle.x.snake-clue");
    expect(narrationClipForText("Huge padded prints in the ferns. Who passed?")?.id).toBe(
      "voice.jungle.x.tiger-clue",
    );
    expect(
      narrationClipForText("Two gold eyes in the dark understory. Who is watching?")?.id,
    ).toBe("voice.jungle.x.jaguar-clue");
    expect(narrationClipForText("The river is for swimmers. Who belongs in the river?")?.id).toBe(
      "voice.jungle.x.river-clue",
    );
    expect(narrationClipForText("Who walks sideways across the wet sand?")?.id).toBe(
      "voice.ocean.x.crab-clue",
    );
    expect(
      narrationClipForText("A huge shell comes ashore at night. Where does she belong?")?.id,
    ).toBe("voice.ocean.x.turtle-clue");
    expect(narrationClipForText("A fountain of mist far out. Who is breathing?")?.id).toBe(
      "voice.ocean.x.whale-clue",
    );
    expect(
      narrationClipForText("The living reef is underwater. What belongs on the reef?")?.id,
    ).toBe("voice.ocean.x.reef-clue");
    expect(narrationClipForText("Four giant prints in the clay. How many?")?.id).toBe(
      "voice.dino.x.prints-clue",
    );
    expect(narrationClipForText("Who has tall bony plates along the back?")?.id).toBe(
      "voice.dino.x.plates-clue",
    );
    expect(
      narrationClipForText("Dino eggs stay in the nest mound. What belongs there?")?.id,
    ).toBe("voice.dino.x.eggs-clue");
    expect(
      narrationClipForText("A tiny fast hunter at your ankle, not a giant roarer. Who?")?.id,
    ).toBe("voice.dino.x.hunter-clue");
    expect(
      narrationClipForText("Stomp stomp pause, stomp stomp pause, stomp. What comes next?")?.id,
    ).toBe("voice.dino.x.stomp-clue");
    expect(narrationClipForText("No water in this pattern.")?.id).toBe(
      "voice.dino.x.stomp-fb-splash",
    );
    expect(
      narrationClipForText(
        "Teddy says: Nana, my belly button of the coat is doing a little dance.",
      )?.id,
    ).toBe("voice.playhouse.tb-1-teddy");
    expect(
      narrationClipForText("Nana says: And Nana takes the sewing tin back to sleep.")?.id,
    ).toBe("voice.playhouse.tb-6-nana");
    expect(
      narrationClipForText("Pepper says: I am not stuck. I am practicing horizontal.")?.id,
    ).toBe("voice.playhouse.rq-1-pepper");
    expect(narrationClipForText("Rosie says: Good. Rest is a kind of ready.")?.id).toBe(
      "voice.playhouse.rq-6-rosie",
    );
    expect(narrationClipForText("Dot says: HELLO LIBRARY I HAVE A CARD—")?.id).toBe(
      "voice.playhouse.df-1-dot",
    );
    expect(narrationClipForText("Lion says: Click. Even paper moons get to rest.")?.id).toBe(
      "voice.playhouse.df-6-lion",
    );
    expect(
      narrationClipForText(
        "Momo says: The street put on a white coat. I will call the plow on my mitten.",
      )?.id,
    ).toBe("voice.playhouse.ms-1-momo");
    expect(narrationClipForText("Momo says: Goodnight, route. Goodnight, thumbs.")?.id).toBe(
      "voice.playhouse.ms-6-momo",
    );
    expect(
      narrationClipForText(
        "Beep says: Doors like arms. Come in. The city is a standing picture book.",
      )?.id,
    ).toBe("voice.playhouse.bl-1-beep");
    expect(
      narrationClipForText("Beep says: Sleep is the last stop. I keep the route for the moon.")?.id,
    ).toBe("voice.playhouse.bl-6-beep");
    expect(narrationClipForText("Moon says: I keep the route for you.")?.id).toBe(
      "voice.playhouse.bl-6-moon",
    );
    expect(
      narrationClipForText(
        "Stamp says: Letters smell like far-away kitchens. I will sniff. I will not chew.",
      )?.id,
    ).toBe("voice.playhouse.sr-1-stamp");
    expect(
      narrationClipForText("Stamp says: Tomorrow the paper weather returns. I will still not chew.")
        ?.id,
    ).toBe("voice.playhouse.sr-6-stamp");
    expect(
      narrationClipForText(
        "Gully says: The harbor wore a fog hat. I am a comma on a piling.",
      )?.id,
    ).toBe("voice.playhouse.gc-1-gully");
    expect(narrationClipForText("Gully says: I land. I fold. Fog hat thinner.")?.id).toBe(
      "voice.playhouse.gc-6-gully",
    );
    expect(
      narrationClipForText("Wagon says: I am a red rectangle with kind wheels. I would like a job.")
        ?.id,
    ).toBe("voice.playhouse.kw-1-wagon");
    expect(narrationClipForText("Benny says: You were the kindness today. Wheels, rest.")?.id).toBe(
      "voice.playhouse.kw-6-benny",
    );
    expect(
      narrationClipForText(
        "Teddy says: Dot, the paper is a square that wants to become a letter.",
      )?.id,
    ).toBe("voice.playhouse.mb-1-teddy");
    expect(
      narrationClipForText("Teddy says: Good. Paper can be brave without us watching.")?.id,
    ).toBe("voice.playhouse.mb-6-teddy");
    expect(narrationClipForText("Teddy says: The pot is wearing a hat. I respect hats.")?.id).toBe(
      "voice.playhouse.ss-1-teddy",
    );
    expect(
      narrationClipForText("Nana says: Empty bowls are hats that finished their job.")?.id,
    ).toBe("voice.playhouse.ss-6-nana");
    expect(
      narrationClipForText("Teddy says: Thank you, soup. Thank you, time. Thank you, secret.")?.id,
    ).toBe("voice.playhouse.ss-6-teddy");
    expect(
      narrationClipForText(
        "Teddy says: The snow is writing with no pencil. I like that kind of writing.",
      )?.id,
    ).toBe("voice.playhouse.lm-1-teddy");
    expect(
      narrationClipForText("Teddy says: We can go. The bench is empty on purpose now.")?.id,
    ).toBe("voice.playhouse.lm-6-teddy");
    expect(
      narrationClipForText("Teddy says: Please. Two tickets. One for a bear. One for a Nana.")?.id,
    ).toBe("voice.playhouse.ft-1-teddy");
    expect(
      narrationClipForText("Teddy says: We had this morning. That is the whole ticket.")?.id,
    ).toBe("voice.playhouse.ft-6-teddy");
    expect(
      narrationClipForText("Teddy says: The toaster has two mouths. I respect mouths that wait.")
        ?.id,
    ).toBe("voice.playhouse.tt-1-teddy");
    expect(
      narrationClipForText("Teddy says: Thank you, loud machine. Breakfast still happened.")?.id,
    ).toBe("voice.playhouse.tt-6-teddy");
    expect(
      narrationClipForText("Teddy says: The button is a circle that calls a room.")?.id,
    ).toBe("voice.playhouse.el-1-teddy");
    expect(
      narrationClipForText("Teddy says: Thank you, traveling closet. We had this ride.")?.id,
    ).toBe("voice.playhouse.el-6-teddy");
    expect(
      narrationClipForText("Teddy says: The lion is a statue. Statues nap with their eyes open.")
        ?.id,
    ).toBe("voice.playhouse.ll-1-teddy");
    expect(narrationClipForText("Lion says: I nap. You borrowed. Both jobs are good.")?.id).toBe(
      "voice.playhouse.ll-6-lion",
    );
    expect(
      narrationClipForText("Teddy says: Thank you, stone nap. We will bring the paper lion back.")
        ?.id,
    ).toBe("voice.playhouse.ll-6-teddy");
    expect(narrationClipForText("Dot says: Two socks. They should stay cousins.")?.id).toBe(
      "voice.playhouse.ln-5-dot",
    );
    expect(
      narrationClipForText("Teddy says: Thank you, working weather. We hung. You dry.")?.id,
    ).toBe("voice.playhouse.ln-6-teddy");
    expect(narrationClipForText("Pigeon says: We have a union about seeds.")?.id).toBe(
      "voice.playhouse.wm-4-pigeon",
    );
    expect(
      narrationClipForText("Nana says: Then the drum can rest. The stoop will remember pink.")?.id,
    ).toBe("voice.playhouse.wm-6-nana");
    expect(narrationClipForText("Teddy says: Nana the river is late for something!")?.id).toBe(
      "voice.playhouse.gb-3-teddy",
    );
    expect(
      narrationClipForText("Teddy says: Good night, boat. Do not sail without me.")?.id,
    ).toBe("voice.playhouse.gb-6-teddy");
    expect(
      narrationClipForText("Dot says: I have watched for one whole minute. Nothing. I resign.")?.id,
    ).toBe("voice.playhouse.tp-2-dot");
    expect(
      narrationClipForText(
        "Teddy says: Thank you, Tiny. Thank you, Also Tiny. Thank you, Show-off.",
      )?.id,
    ).toBe("voice.playhouse.tp-6-teddy");
    expect(
      narrationClipForText(
        "Teddy says: The table was a suitcase. Now it is a meadow. I am impressed.",
      )?.id,
    ).toBe("voice.playhouse.tw-1-teddy");
    expect(narrationClipForText("Potatoes says: We do not speak. We still heard you.")?.id).toBe(
      "voice.playhouse.tw-4-potatoes",
    );
    expect(
      narrationClipForText("Teddy says: Meadow, be a suitcase. My belly is already a drum.")?.id,
    ).toBe("voice.playhouse.tw-6-teddy");
    expect(
      narrationClipForText("Nana says: Fold. The sidewalk will remember the legs.")?.id,
    ).toBe("voice.playhouse.tw-6-nana");
    expect(narrationClipForText("The curtain closes. You watched the whole play!")?.id).toBe(
      "voice.playhouse.curtain",
    );
    expect(
      narrationClipForText(
        "The stoop is a warm lap. Brick holds the sun and does not complain.",
      )?.id,
    ).toBe("voice.book.stoop-watermelon-1");
    expect(
      narrationClipForText("Two plates. One for Nana. One for Teddy. Sharing is a kind of math.")
        ?.id,
    ).toBe("voice.book.stoop-watermelon-8");
    expect(
      narrationClipForText("Evening. The stoop remembers pink. Teddy remembers being full.")?.id,
    ).toBe("voice.book.stoop-watermelon-12");
    expect(
      narrationClipForText("Teddy sets the boat down. It wobbles. Boats are allowed.")?.id,
    ).toBe("voice.book.paper-gutter-boat-4");
    expect(
      narrationClipForText("A stick is a crane. The boat comes home wet and proud.")?.id,
    ).toBe("voice.book.paper-gutter-boat-9");
    expect(
      narrationClipForText("Nothing happens. That is something. Roots are busy being shy.")?.id,
    ).toBe("voice.book.window-box-tomatoes-4");
    expect(
      narrationClipForText(
        "Teddy saves two seeds on a napkin. The box can begin again. Boxes like sequels.",
      )?.id,
    ).toBe("voice.book.window-box-tomatoes-12");
    expect(
      narrationClipForText("One leg is a dancer. Nana folds a napkin under it. The dancer sits.")?.id,
    ).toBe("voice.book.block-table-feast-2");
    expect(
      narrationClipForText(
        "Pizza is a circle that becomes triangles. Sharing is cutting with a plan.",
      )?.id,
    ).toBe("voice.book.block-table-feast-8");
    expect(
      narrationClipForText("Teddy’s belly is a drum. The stoop is quiet and used. That is a good party.")
        ?.id,
    ).toBe("voice.book.block-table-feast-12");
    expect(
      narrationClipForText(
        "The mailbox is a blue mouth on the corner. It swallows kindly.",
      )?.id,
    ).toBe("voice.book.how-mail-travels-4");
    expect(
      narrationClipForText("Teddy draws a stoop. The hello can travel the other way too.")?.id,
    ).toBe("voice.book.how-mail-travels-10");
    expect(
      narrationClipForText("The kitchen smells like a hug you can eat later.")?.id,
    ).toBe("voice.book.how-bread-rises-7");
    expect(
      narrationClipForText("Steam writes a letter in the air and disappears. Bread does not mind.")?.id,
    ).toBe("voice.book.how-bread-rises-10");
    expect(
      narrationClipForText("Wet brick smells like the city washing its face.")?.id,
    ).toBe("voice.book.what-rain-does-9");
    expect(
      narrationClipForText("Rain will come again. Clouds keep libraries. We keep boots.")?.id,
    ).toBe("voice.book.what-rain-does-10");
    expect(
      narrationClipForText("Gulls ride the wind for free. They already know the route.")?.id,
    ).toBe("voice.book.how-a-ferry-floats-6");
    expect(
      narrationClipForText(
        "Teddy looks back. The water kept us. That is the whole trick, and it is not a small one.",
      )?.id,
    ).toBe("voice.book.how-a-ferry-floats-10");
    expect(narrationClipForText("A cat. A fat cat.")?.id).toBe("voice.book.cat-on-mat-1");
    expect(
      narrationClipForText("The cat sat. The cat napped. The mat did its job.")?.id,
    ).toBe("voice.book.cat-on-mat-8");
    expect(narrationClipForText("The bus is red.")?.id).toBe("voice.book.red-bus-run-2");
    expect(
      narrationClipForText("The red bus ran. It had a nap at the stop.")?.id,
    ).toBe("voice.book.red-bus-run-8");
    expect(narrationClipForText("Sip. Sip. Not a big sip.")?.id).toBe("voice.book.hot-pot-sip-4");
    expect(narrationClipForText("Hot pot. Sip. Nap. The end.")?.id).toBe("voice.book.hot-pot-sip-8");
    expect(narrationClipForText("Teddy in bed. Nana in bed.")?.id).toBe("voice.book.big-hug-bed-5");
    expect(narrationClipForText("Sun up. Hug. Bed. The end.")?.id).toBe("voice.book.big-hug-bed-8");
    expect(
      narrationClipForText("The pig sat. The pig dug. The mud did its job.")?.id,
    ).toBe("voice.book.pig-in-mud-8");
    expect(narrationClipForText("In. Out. The box did its job.")?.id).toBe("voice.book.fox-in-box-8");
    expect(narrationClipForText("A log. A big log.")?.id).toBe("voice.book.dog-on-log-2");
    expect(
      narrationClipForText("The dog sat. The log did its job.")?.id,
    ).toBe("voice.book.dog-on-log-8");
    expect(narrationClipForText("An egg. A tan egg.")?.id).toBe("voice.book.hen-in-pen-4");
    expect(
      narrationClipForText("The hen sat. The pen did its job.")?.id,
    ).toBe("voice.book.hen-in-pen-8");
    expect(narrationClipForText("No hug for a bug. A wave.")?.id).toBe(
      "voice.book.bug-in-mug-6",
    );
    expect(
      narrationClipForText("In. Out. The mug did its job.")?.id,
    ).toBe("voice.book.bug-in-mug-8");
    expect(
      narrationClipForText("Hop. Stop. The top did its job.")?.id,
    ).toBe("voice.book.hop-on-top-8");
    expect(
      narrationClipForText(
        "Syrup dots on noses. Giggle. The kitchen smells like a hug. Saturday is done, and full.",
      )?.id,
    ).toBe("voice.book.pancake-saturday-8");
    expect(
      narrationClipForText(
        "CLANG CLANG! The bell is a bright shout. Rosie’s lights blink. The big door lifts like a yawn.",
      )?.id,
    ).toBe("voice.book.little-red-fire-truck-2");
    expect(
      narrationClipForText(
        "Rosie rolls home. The garage door is a blanket. The bell sleeps. Helpers rest, ready again.",
      )?.id,
    ).toBe("voice.book.little-red-fire-truck-8");
    expect(
      narrationClipForText(
        "A small ball. A middle ball. A big ball. Stack. The snow pal has a carrot nose and pebble eyes.",
      )?.id,
    ).toBe("voice.book.snow-maple-street-4");
    expect(
      narrationClipForText(
        "Lamps blink on. The snow pal keeps watch. Maple Street is a quiet story under a blanket.",
      )?.id,
    ).toBe("voice.book.snow-maple-street-8");
    expect(
      narrationClipForText(
        "At the desk, a stamp kisses the card. Due in two weeks. Dot’s ticket is magic again.",
      )?.id,
    ).toBe("voice.book.dot-library-mouse-6");
    expect(
      narrationClipForText(
        "At home the lamp is a small moon. One more page. Then the lion sleeps, and Dot does too.",
      )?.id,
    ).toBe("voice.book.dot-library-mouse-8");
    expect(
      narrationClipForText(
        "Two coins in a jar. Not a fortune. A jingle of we-did-it. Benny rinses the pitcher. The stoop glows.",
      )?.id,
    ).toBe("voice.book.lemonade-stoop-8");
    expect(
      narrationClipForText(
        "Beep’s lamps shrink down the block. The moon keeps the route. Sleep is the last stop.",
      )?.id,
    ).toBe("voice.book.night-bus-home-8");
    expect(
      narrationClipForText(
        "A blue jay points with a wing. Red flashed by the stump. Fox thanks the jay. Manners are a map.",
      )?.id,
    ).toBe("voice.book.lost-red-mitten-2");
    expect(
      narrationClipForText(
        "Den light. Soup steam. Fox hangs both mittens to dry. Tomorrow they will go out as a team.",
      )?.id,
    ).toBe("voice.book.lost-red-mitten-8");
    expect(
      narrationClipForText(
        "Soon there are five. They do not make a straight line. They make a wandering sentence.",
      )?.id,
    ).toBe("voice.book.nana-porch-swing-4");
    expect(
      narrationClipForText(
        "From the window the empty swing still sways a little. Goodnight, porch. Goodnight, wandering lights.",
      )?.id,
    ).toBe("voice.book.nana-porch-swing-8");
    expect(
      narrationClipForText(
        "A neighbor leaves a bowl of water. Stamp drinks. Kindness is a rest stop.",
      )?.id,
    ).toBe("voice.book.kind-mail-truck-6");
    expect(
      narrationClipForText(
        "The tray is empty as a finished book. The truck hums home. Tomorrow the paper weather returns.",
      )?.id,
    ).toBe("voice.book.kind-mail-truck-8");
    expect(
      narrationClipForText(
        "Back to the piling. Fog hat thinner. The tug is a red period at the end of morning.",
      )?.id,
    ).toBe("voice.book.gully-harbor-morning-8");
    expect(
      narrationClipForText(
        "A tiny paper ribbon. Nana tucks it. Teddy’s paws are syrup maps. Home is one block of sidewalk.",
      )?.id,
    ).toBe("voice.book.diner-booth-two-8");
    expect(
      narrationClipForText(
        "The bus is a yellow hill with windows. Doors fold like a book. Beep is not here — this is Day Bus.",
      )?.id,
    ).toBe("voice.book.first-day-yellow-bus-2");
    expect(
      narrationClipForText(
        "The bus again. Nana is a postage stamp that grows. The stoop is still the stoop. Brave work is done.",
      )?.id,
    ).toBe("voice.book.first-day-yellow-bus-8");
    expect(
      narrationClipForText(
        "The fridge door is winter for a second. Teddy’s nose gets a surprise. Close it kind.",
      )?.id,
    ).toBe("voice.book.corner-store-bell-4");
    expect(
      narrationClipForText(
        "Milk in. Bananas in a bowl like a small sun pile. The bell is still at the store, doing its job.",
      )?.id,
    ).toBe("voice.book.corner-store-bell-8");
    expect(
      narrationClipForText(
        "Rain keeps writing. Other families hum. The room is a quiet party of warm.",
      )?.id,
    ).toBe("voice.book.laundromat-rain-6");
    expect(
      narrationClipForText(
        "The bag is lighter because dry things are fluffy. Rain still writes. We are done writing with clothes.",
      )?.id,
    ).toBe("voice.book.laundromat-rain-8");
    expect(
      narrationClipForText(
        "Lemon ice on the porch. Drips allowed. The sprinkler already told the whole story.",
      )?.id,
    ).toBe("voice.book.backyard-sprinkler-8");
    expect(
      narrationClipForText(
        "Teddy looks at the hill. The hill looks back. Maybe one more slow up. Maybe lemonade. Both are brave.",
      )?.id,
    ).toBe("voice.book.red-wagon-hill-8");
    expect(
      narrationClipForText(
        "A scale is a seesaw for fruit. Nana adds berries. The needle nods.",
      )?.id,
    ).toBe("voice.book.market-saturday-berries-2");
    expect(
      narrationClipForText(
        "Red fingers after. Proof of Saturday. Nana laughs. Teddy laughs. The canopy is still at the market, working.",
      )?.id,
    ).toBe("voice.book.market-saturday-berries-8");
    expect(
      narrationClipForText(
        "Sometimes ears pop like tiny bubbles. That is the building stretching. Teddy holds Nana’s coat button — the sewn one.",
      )?.id,
    ).toBe("voice.book.elevator-buttons-4");
    expect(
      narrationClipForText(
        "Later we will press lobby. For now lemon ice. The traveling room can wait. It is good at waiting.",
      )?.id,
    ).toBe("voice.book.elevator-buttons-8");
    expect(
      narrationClipForText(
        "A quilt of squares. Circle of a moon patch in one corner. Teddy finds it with a paw.",
      )?.id,
    ).toBe("voice.book.attic-rain-trunk-6");
    expect(
      narrationClipForText(
        "Hats back to sleep. Trunk closed. Stairs down. Rain still writing. The house keeps us.",
      )?.id,
    ).toBe("voice.book.attic-rain-trunk-8");
    expect(
      narrationClipForText(
        "The horn behind us is for the next morning. We had this one.",
      )?.id,
    ).toBe("voice.book.ferry-horn-morning-8");
    expect(
      narrationClipForText(
        "We leave the sun for the block. Tomorrow it may be paler. Today it is loud and kind.",
      )?.id,
    ).toBe("voice.book.sidewalk-chalk-sun-8");
    expect(
      narrationClipForText(
        "The bakery bell is cousin to the diner bell. Shorter. Flour in the air like quiet snow.",
      )?.id,
    ).toBe("voice.book.bakery-window-fog-2");
    expect(
      narrationClipForText(
        "Crumbs are not a mess yet. They are a map of breakfast. The window fog is already gone.",
      )?.id,
    ).toBe("voice.book.bakery-window-fog-8");
    expect(
      narrationClipForText(
        "This bell is tougher. It still means hello. A dog under the counter thumps a hello back.",
      )?.id,
    ).toBe("voice.book.hardware-drawer-knobs-4");
    expect(
      narrationClipForText(
        "Nana crosses three lines. The paper looks proud. Teddy is proud of the washer window.",
      )?.id,
    ).toBe("voice.book.hardware-drawer-knobs-8");
    expect(
      narrationClipForText(
        "The roof is a hat for the whole bandstand. We sit in the brim. Pigeons take the crown.",
      )?.id,
    ).toBe("voice.book.park-bandstand-pigeons-6");
    expect(
      narrationClipForText(
        "The path home is chalk-pale. The sun we drew is still yelling kindly from the stoop.",
      )?.id,
    ).toBe("voice.book.park-bandstand-pigeons-8");
    expect(
      narrationClipForText(
        "The token is gone and also still round in the story. That is how paying for a ride works.",
      )?.id,
    ).toBe("voice.book.subway-token-mouse-8");
    expect(
      narrationClipForText(
        "The porch swing creaks the floorboard song. Dusk is a purple blanket being pulled across the yard.",
      )?.id,
    ).toBe("voice.book.porch-dusk-jar-1");
    expect(
      narrationClipForText(
        "Inside now. The swing slows. The yard keeps the wandering lights without us.",
      )?.id,
    ).toBe("voice.book.porch-dusk-jar-8");
    expect(
      narrationClipForText(
        "The lamp is a giant jar of light. It does not hurry. Night is its job.",
      )?.id,
    ).toBe("voice.book.lighthouse-blink-2");
    expect(
      narrationClipForText(
        "Dawn takes the job. The lamp rests. Boats are already home.",
      )?.id,
    ).toBe("voice.book.lighthouse-blink-8");
    expect(
      narrationClipForText(
        "The bell is shorter than the bakery’s. It still means hello. Teddy practices a quiet ding.",
      )?.id,
    ).toBe("voice.book.corner-shop-ding-1");
    expect(
      narrationClipForText(
        "Please is a coin that does not jingle. The counter still hears it.",
      )?.id,
    ).toBe("voice.book.corner-shop-ding-4");
    expect(
      narrationClipForText(
        "The bell behind us is for the next hello. We had this one.",
      )?.id,
    ).toBe("voice.book.corner-shop-ding-8");
    expect(
      narrationClipForText(
        "Two pigeons drink. They have a union about fountains. We do not argue.",
      )?.id,
    ).toBe("voice.book.fountain-three-coins-6");
    expect(
      narrationClipForText(
        "The coins stay in Nana’s pocket. The wish still happened. Looking counts.",
      )?.id,
    ).toBe("voice.book.fountain-three-coins-7");
    expect(
      narrationClipForText(
        "The taxi leaves. Yellow stays in the story like a coin you already spent.",
      )?.id,
    ).toBe("voice.book.yellow-taxi-puddle-8");
    expect(
      narrationClipForText(
        "Nana’s pocket has no jingle. The key went walking without us.",
      )?.id,
    ).toBe("voice.book.lost-key-mat-2");
    expect(
      narrationClipForText(
        "The key sits in a little dish like a sleeping fish. Tomorrow it can walk again.",
      )?.id,
    ).toBe("voice.book.lost-key-mat-8");
    expect(
      narrationClipForText(
        "The quilt is squares that agreed to be a blanket. Four in a row by Teddy’s chin.",
      )?.id,
    ).toBe("voice.book.quilt-square-moon-2");
    expect(
      narrationClipForText(
        "Teddy is docked. The house keeps the weather. Goodnight squares. Goodnight circle.",
      )?.id,
    ).toBe("voice.book.quilt-square-moon-8");
    expect(
      narrationClipForText(
        "The bench wears a white hat. No lost mitten today. The bench is off duty.",
      )?.id,
    ).toBe("voice.book.snow-plow-dawn-4");
    expect(
      narrationClipForText(
        "The plow horn is low, like the ferry’s cousin. Ready, not angry.",
      )?.id,
    ).toBe("voice.book.snow-plow-dawn-5");
    expect(
      narrationClipForText(
        "Boots drip a little map on the mat. The square mat does not mind. It is used to weather.",
      )?.id,
    ).toBe("voice.book.snow-plow-dawn-8");
    expect(
      narrationClipForText(
        "Sour is a hello that pinches. Then sweet comes. Two feelings in one cup.",
      )?.id,
    ).toBe("voice.book.icebox-lemonade-6");
    expect(
      narrationClipForText(
        "The pitcher is an empty lake. The ice is gone and also still cold in the story.",
      )?.id,
    ).toBe("voice.book.icebox-lemonade-8");
    expect(
      narrationClipForText(
        "H says huh! A happy Hippo peeks from the river.",
      )?.id,
    ).toBe("voice.book.safari-alphabet-8");
    expect(
      narrationClipForText(
        "I says ih! An Impala leaps across the grass.",
      )?.id,
    ).toBe("voice.book.safari-alphabet-9");
    expect(
      narrationClipForText(
        "R says rrr! A Rhino stands by the water.",
      )?.id,
    ).toBe("voice.book.safari-alphabet-18");
    expect(
      narrationClipForText(
        "Z says zzz! A Zebra stands in the sunny grass with Teddy.",
      )?.id,
    ).toBe("voice.book.safari-alphabet-26");
    expect(
      narrationClipForText(
        "Chirp chirp! Here are 2 singing bluebirds building a cozy nest together.",
      )?.id,
    ).toBe("voice.book.garden-counting-2");
    expect(
      narrationClipForText(
        "Twinkle twinkle! The five-pointed Yellow Star shines like a trophy for super learners!",
      )?.id,
    ).toBe("voice.book.colors-shapes-circus-3");
    expect(
      narrationClipForText(
        "Little Bear brushes his fluffy teeth, puts on starry pajamas, and tucks under a warm blanket.",
      )?.id,
    ).toBe("voice.book.little-bear-bedtime-4");
    expect(
      narrationClipForText(
        "Mama’s voice is a slow river. No drums. Just the names of things that stayed: hill, moon, bear.",
      )?.id,
    ).toBe("voice.book.little-bear-bedtime-6");
    expect(
      narrationClipForText(
        "Pip steps out onto the soft grey moon. Zero gravity! He bounces high into the air like a balloon!",
      )?.id,
    ).toBe("voice.book.rocket-space-trip-3");
    expect(
      narrationClipForText(
        "With a hug from family and a gentle roar, Leo is ready to try new things and explore the world!",
      )?.id,
    ).toBe("voice.book.feelings-with-leo-3");
    expect(
      narrationClipForText(
        "Through the spaceship window, Earth sparkles like a blue and green marble wrapped in clouds.",
      )?.id,
    ).toBe("voice.book.cosmic-rocket-journey-4");
    expect(
      narrationClipForText(
        "POW! Big golden petals burst open! Bees buzz with joy, sipping nectar from the giant sunflower.",
      )?.id,
    ).toBe("voice.book.tiny-seed-grows-4");
    expect(
      narrationClipForText(
        "Mother Deer tucks her fawn into soft moss. Little Robin tucks his beak beneath his warm feather wing.",
      )?.id,
    ).toBe("voice.book.bedtime-starlight-lullaby-2");
    expect(
      narrationClipForText(
        "Bunny hands Fox the biggest strawberry. 'Thank you, Bunny!' Fox says with two thumbs up!",
      )?.id,
    ).toBe("voice.book.magic-manners-tea-party-3");
    expect(
      narrationClipForText(
        "Roosters, cows, sheep, pigs, and ducks quack together in harmony! Good morning happy farm!",
      )?.id,
    ).toBe("voice.book.the-noisy-farm-chorus-4");
    expect(
      narrationClipForText(
        "Rex the green Tyrannosaurus leaps out! He doesn't bite—he gives a friendly dinosaur high-five!",
      )?.id,
    ).toBe("voice.book.dino-footprint-detective-4");
    expect(
      narrationClipForText(
        "Mama Firefly gives Pip a tender hug. 'Close your eyes, Pip. Breathe in. Your courage is inside you!'",
      )?.id,
    ).toBe("voice.book.the-brave-little-firefly-2");
    expect(
      narrationClipForText(
        "Look at the wax walls—each cell has 6 equal straight sides! Hexagons make the strongest rooms.",
      )?.id,
    ).toBe("voice.book.busy-beehive-architects-3");
    expect(
      narrationClipForText(
        "The chrysalis splits open! Out steps a magnificent orange and black Monarch butterfly drying her wings!",
      )?.id,
    ).toBe("voice.book.the-curious-caterpillar-4");
    expect(
      narrationClipForText(
        "Blow air like a breeze: wuh! A giant white whale whistles through ocean waves.",
      )?.id,
    ).toBe("voice.book.superhero-phonics-squad-4");
    expect(
      narrationClipForText(
        "BONG BONG! The little hand and big hand both point straight up to 12. Delicious apple slices and story time!",
      )?.id,
    ).toBe("voice.book.the-clock-tower-chimes-2");
    expect(
      narrationClipForText(
        "Barnaby checks under the sofa—no button. He checks the garden path—no button. He checks the sandbox...",
      )?.id,
    ).toBe("voice.book.little-bear-lost-button-3");
    expect(
      narrationClipForText(
        "The penguin tucks its beak. Pip waves. Tomorrow they will waddle again.",
      )?.id,
    ).toBe("voice.book.penguin-floe-night-4");
    expect(
      narrationClipForText(
        "Owl, moth, and Pip close their eyes. The wood keeps the lullaby.",
      )?.id,
    ).toBe("voice.book.owl-wood-lullaby-4");
    expect(
      narrationClipForText(
        "The bakery smells like buns. Pip waits. Steam curls up.",
      )?.id,
    ).toBe("voice.book.nana-soup-pot-2");
    expect(
      narrationClipForText(
        "The bugs rest. The pond is quiet. We will visit again.",
      )?.id,
    ).toBe("voice.book.pond-edge-bugs-4");
    expect(
      narrationClipForText(
        "The bag is light. The path leads home. Wave to the tree.",
      )?.id,
    ).toBe("voice.book.park-green-picnic-4");
    expect(
      narrationClipForText(
        "The paper rests. Colours stay. Tomorrow we paint again.",
      )?.id,
    ).toBe("voice.book.atelier-paint-day-4");
    expect(
      narrationClipForText(
        "Rain taps the pines. Pip puts up a hood. Drip drop.",
      )?.id,
    ).toBe("voice.book.pine-trail-map-2");
    expect(
      narrationClipForText(
        "Home is downhill. The map still shows the way. The pines wave.",
      )?.id,
    ).toBe("voice.book.pine-trail-map-4");
    expect(
      narrationClipForText(
        "Shoes on. Smile. The house waves. We can come home later.",
      )?.id,
    ).toBe("voice.book.home-kind-morning-4");
    expect(narrationClipForText("Yes! Those two rhyme!")?.id).toBe("voice.shared.yes-rhyme");
    expect(narrationClipForText("Match! You found a friend!")?.id).toBe("voice.shared.match-friend");
    expect(narrationClipForText("You finished this game.")?.id).toBe("voice.shared.finished-game");
    expect(narrationClipForText("Try another one.")?.id).toBe("voice.shared.try-another");
    expect(narrationClipForText("Look again.")?.id).toBe("voice.shared.look-again");
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

  it("maps world-map and open-toy spoken to voice-01", () => {
    expect(
      narrationClipForText(
        "Welcome to My World! Explore familiar people, my home, happy feelings, yummy snacks, and helping hands!",
      )?.id,
    ).toBe("voice.world.welcome.my");
    expect(
      narrationClipForText(
        "Welcome to Animal World! Listen to real animal calls, match babies to moms, feed animals, and explore habitats!",
      )?.id,
    ).toBe("voice.world.welcome.animal");
    expect(
      narrationClipForText(
        "Welcome to Bug Garden! A walled garden where ladybirds nap on leaves and crickets sing after dusk.",
      )?.id,
    ).toBe("voice.world.welcome.bugs");
    expect(
      narrationClipForText(
        "Welcome to Ice Neighbours! A bright cold bay where penguins hop floes and the sky sometimes paints itself.",
      )?.id,
    ).toBe("voice.world.welcome.ice");
    expect(narrationClipForText("Let the puppets take a bow!")?.id).toBe("voice.toy.bow-welcome");
    expect(narrationClipForText("Whisper in the library with Dot the mouse!")?.id).toBe(
      "voice.toy.library-welcome",
    );
    expect(narrationClipForText("Load the kindness wagon and visit the block!")?.id).toBe(
      "voice.toy.wagon-welcome",
    );
    expect(narrationClipForText("Clang clang! Ride with Rosie the fire truck!")?.id).toBe(
      "voice.toy.rosie-welcome",
    );
    expect(
      narrationClipForText("Can you find the slow little friend who carries a shell on its back?")?.id,
    ).toBe("voice.games.turtle-welcome");
    expect(
      narrationClipForText("We keep safe near roads. Before crossing with a grown-up, what should we do?")?.id,
    ).toBe("voice.games.stop-welcome");
    expect(narrationClipForText("Who reaches the highest leaves with a long spotted neck?")?.id).toBe(
      "voice.games.giraffe-welcome",
    );
    expect(narrationClipForText("Fox. Fff. Which letter starts fox?")?.id).toBe("voice.games.fox-welcome");
    expect(narrationClipForText("Nine. What number comes next?")?.id).toBe("voice.games.nine-welcome");
    expect(narrationClipForText("Who says 'Moo'? Can you tap the animal?")?.id).toBe("voice.games.moo-welcome");
    expect(
      narrationClipForText("Who is the giant friendly friend with big floppy ears and a water-spraying trunk?")?.id,
    ).toBe("voice.games.elephant-welcome");
    expect(
      narrationClipForText("Who gives us soft warm wool for cozy sweaters and says baa baa?")?.id,
    ).toBe("voice.games.sheep-welcome");
    expect(
      narrationClipForText("Where is the orange triangle with three pointy corners?")?.id,
    ).toBe("voice.games.orange-welcome");
    expect(
      narrationClipForText("Who perches on the fence and crows like a rooster when morning arrives?")?.id,
    ).toBe("voice.games.rooster-welcome");
    expect(narrationClipForText("Find the round town clock. A circle has no corners!")?.id).toBe(
      "voice.games.clock-welcome",
    );
    expect(
      narrationClipForText(
        "Firehouse Friday. Rosie is napping. What wakes a fire truck?",
      )?.id,
    ).toBe("voice.story.fire-open");
    expect(narrationClipForText("Home to the garage. Park Rosie.")?.id).toBe("voice.story.fire-park");
    expect(narrationClipForText("Snow day! What do we put on first?")?.id).toBe("voice.story.snow-first");
    expect(
      narrationClipForText("Dot and the Quiet Lion. Show your library card. What kind of voice do we use inside?")?.id,
    ).toBe("voice.story.library-open");
    expect(narrationClipForText("The wagon is empty. What shall we load first?")?.id).toBe(
      "voice.story.wagon-empty",
    );
    expect(
      narrationClipForText(
        "Cock a doodle doo! The bright sun is rising over the farm. Who is waking up in the barn?",
      )?.id,
    ).toBe("voice.story.farm-sunrise");
    expect(narrationClipForText("The wagon naps. You were the kindness today.")?.id).toBe(
      "voice.story.wagon-naps",
    );
    expect(narrationClipForText("Who is visiting the garden pond?")?.id).toBe("voice.toy.clue.pond");
    expect(narrationClipForText("Whisper, stamp a card, and ride home with a book.")?.id).toBe(
      "voice.toy.clue.whisper",
    );
    expect(narrationClipForText("Load the wagon with notes, pears, and care.")?.id).toBe(
      "voice.toy.clue.wagon",
    );
    expect(narrationClipForText("Ride with Rosie and help Pepper the cat.")?.id).toBe(
      "voice.toy.clue.rosie",
    );
    expect(narrationClipForText("Hold to rain. The leaves drink.")?.id).toBe("voice.toy.clue.rainhold");
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
    expect(narrationClipForText("Who is shouting from the fence at sunrise?")?.id).toBe("voice.farm.rooster-welcome");
    expect(narrationClipForText("How many eggs are in the nest?")?.id).toBe("voice.farm.nest-welcome");
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
    expect(narrationClipForText("Who is hissing in the vines?")?.id).toBe("voice.jungle.hiss-welcome");
    expect(narrationClipForText("What does the toucan eat in the canopy?")?.id).toBe("voice.jungle.toucan-welcome");
    expect(narrationClipForText("Who has gold eyes in the dark jungle?")?.id).toBe("voice.jungle.eyes-welcome");
    expect(narrationClipForText("Who belongs in the jungle river?")?.id).toBe("voice.jungle.river-welcome");
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
    expect(narrationClipForText("How many shells did the tide leave?")?.id).toBe("voice.ocean.shells-welcome");
    expect(narrationClipForText("Three yellow and two blue. How many fish in all?")?.id).toBe(
      "voice.ocean.schools-welcome",
    );
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
    expect(narrationClipForText("How many giant prints?")?.id).toBe("voice.dino.prints-welcome");
    expect(narrationClipForText("Who has plates along the back?")?.id).toBe("voice.dino.plates-welcome");
    expect(narrationClipForText("Who glides on leathery wings?")?.id).toBe("voice.dino.glider-welcome");
    expect(narrationClipForText("What belongs in the nest mound?")?.id).toBe("voice.dino.mound-welcome");
    expect(narrationClipForText("Who is the tiny fast hunter?")?.id).toBe("voice.dino.hunter-welcome");
    expect(narrationClipForText("Stomp stomp pause. What comes next?")?.id).toBe("voice.dino.stomp-welcome");
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
    expect(
      narrationClipForText("Owl Wood! Quiet trees and gold eyes. Let's explore together!")?.id,
    ).toBe("voice.owl.area-welcome");
    expect(
      narrationClipForText(
        "Star Balcony! A rail, a moon and a counting sky. Let's explore together!",
      )?.id,
    ).toBe("voice.star.area-welcome");
    expect(
      narrationClipForText(
        "Porch Moths! A warm bulb and circling wings. Let's explore together!",
      )?.id,
    ).toBe("voice.porch.area-welcome");
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
    expect(narrationClipForText("Hop hop rest. Next?")?.id).toBe("voice.ice.hoprest-welcome");
    expect(narrationClipForText("Hop hop rest, hop hop rest, hop. Next?")?.id).toBe(
      "voice.ice.clue.hoprest",
    );
    expect(narrationClipForText("Who is calling on the penguin floe?")?.id).toBe(
      "voice.ice.clue.safari",
    );
    expect(narrationClipForText("Trace the ice letter in the snow!")?.id).toBe(
      "voice.ice.trace-welcome",
    );
    expect(narrationClipForText("Slide the penguin down the ice!")?.id).toBe(
      "voice.ice.slide-welcome",
    );
    expect(narrationClipForText("The ice is sharp. What does Pip need?")?.id).toBe(
      "voice.ice.pack-welcome",
    );
  });

  it("maps Snow Den closed-kit lines to voice-01", () => {
    expect(
      narrationClipForText(
        "Snow Den! Soft snow walls and a quiet cub. Let's explore together!",
      )?.id,
    ).toBe("voice.den.area-welcome");
    expect(narrationClipForText("Who has a huge white coat on the snow?")?.id).toBe(
      "voice.den.coat-welcome",
    );
    expect(narrationClipForText("Huge, white, and padded for snow. Who?")?.id).toBe(
      "voice.den.clue.coat",
    );
    expect(narrationClipForText("Where does the cub belong?")?.id).toBe("voice.den.home-welcome");
    expect(
      narrationClipForText("The cub belongs in the snow den, not the harbour. Where?")?.id,
    ).toBe("voice.den.clue.home");
    expect(narrationClipForText("How many paws?")?.id).toBe("voice.den.paws-welcome");
    expect(narrationClipForText("Four giant paws in the snow. How many?")?.id).toBe(
      "voice.den.clue.paws",
    );
    expect(narrationClipForText("Who belongs in the snow den?")?.id).toBe("voice.den.sort-welcome");
    expect(narrationClipForText("The den is for snow coats. Who belongs?")?.id).toBe(
      "voice.den.clue.sort",
    );
    expect(narrationClipForText("Which letter starts cub?")?.id).toBe("voice.den.letter-welcome");
    expect(narrationClipForText("Cub starts with cuh. Which letter?")?.id).toBe(
      "voice.den.clue.letter",
    );
    expect(narrationClipForText("Who slept last?")?.id).toBe("voice.den.who-welcome");
    expect(
      narrationClipForText("The cub napped, then the grown bear napped. Who slept last?")?.id,
    ).toBe("voice.den.clue.who");
    expect(narrationClipForText("Three and three prints. How many?")?.id).toBe(
      "voice.den.prints-welcome",
    );
    expect(narrationClipForText("What shape is the den door?")?.id).toBe("voice.den.door-welcome");
    expect(narrationClipForText("The den door is a round hole. What shape?")?.id).toBe(
      "voice.den.clue.door",
    );
    expect(narrationClipForText("Flip the snowflakes and find the match!")?.id).toBe(
      "voice.den.memory-welcome",
    );
    expect(narrationClipForText("Clap with the seal!")?.id).toBe("voice.den.clap-welcome");
    expect(narrationClipForText("Pet the cub. Kind and slow!")?.id).toBe("voice.den.pet-welcome");
  });

  it("maps Light Sky closed-kit lines to voice-01", () => {
    expect(
      narrationClipForText(
        "Light Sky! Green ribbons over the ice. Let's explore together!",
      )?.id,
    ).toBe("voice.light.area-welcome");
    expect(narrationClipForText("What colour is the sky ribbon?")?.id).toBe(
      "voice.light.ribbon-welcome",
    );
    expect(
      narrationClipForText("The sky ribbon is garden green, not bakery brown. Which?")?.id,
    ).toBe("voice.light.clue.ribbon");
    expect(narrationClipForText("Blue and yellow. What colour blooms?")?.id).toBe(
      "voice.light.mix-welcome",
    );
    expect(
      narrationClipForText("Mix ice blue into leaf yellow. What sky colour blooms?")?.id,
    ).toBe("voice.light.clue.mix");
    expect(narrationClipForText("How many stars?")?.id).toBe("voice.light.stars-welcome");
    expect(narrationClipForText("Eight hard stars beside the ribbon. How many?")?.id).toBe(
      "voice.light.clue.stars",
    );
    expect(narrationClipForText("Glow, fade, glow, fade, glow. Next?")?.id).toBe(
      "voice.light.pulse-welcome",
    );
    expect(narrationClipForText("Which letter starts star?")?.id).toBe("voice.light.letter-welcome");
    expect(narrationClipForText("Star starts with sss. Which letter?")?.id).toBe(
      "voice.light.clue.letter",
    );
    expect(narrationClipForText("What belongs in the sky?")?.id).toBe("voice.light.sky-welcome");
    expect(narrationClipForText("The light show is in the sky. What belongs in the sky?")?.id).toBe(
      "voice.light.clue.sky",
    );
    expect(narrationClipForText("Three and four sparks. How many?")?.id).toBe(
      "voice.light.sparks-welcome",
    );
    expect(narrationClipForText("3 sparks here, 4 sparks there. How many?")?.id).toBe(
      "voice.light.clue.sparks",
    );
    expect(narrationClipForText("Where do we watch?")?.id).toBe("voice.light.watch-welcome");
    expect(
      narrationClipForText("Nana said watch from the hill, not the thin ice. Where?")?.id,
    ).toBe("voice.light.clue.watch");
    expect(narrationClipForText("Tap the northern-light balloons!")?.id).toBe(
      "voice.light.balloon-welcome",
    );
    expect(narrationClipForText("Find the rhyming friends under the lights!")?.id).toBe(
      "voice.light.rhyme-welcome",
    );
    expect(narrationClipForText("Find the word that rhymes in the lights.")?.id).toBe(
      "voice.light.clue.rhyme",
    );
  });

  it("maps Seal Shore closed-kit lines to voice-01", () => {
    expect(
      narrationClipForText(
        "Seal Shore! Wet rocks, whiskers and a tide pool. Let's explore together!",
      )?.id,
    ).toBe("voice.seal.area-welcome");
    expect(narrationClipForText("Who claps flippers on the rock?")?.id).toBe(
      "voice.seal.clap-welcome",
    );
    expect(narrationClipForText("Whiskers and flippers on a wet rock. Who?")?.id).toBe(
      "voice.seal.clue.clap",
    );
    expect(narrationClipForText("Who is barking on the wet rock?")?.id).toBe(
      "voice.seal.bark-welcome",
    );
    expect(narrationClipForText("A short bark from the wet rock. Who?")?.id).toBe(
      "voice.seal.clue.bark",
    );
    expect(narrationClipForText("Who belongs on the seal shore?")?.id).toBe(
      "voice.seal.sort-welcome",
    );
    expect(narrationClipForText("The shore is for sea resters. Who belongs?")?.id).toBe(
      "voice.seal.clue.sort",
    );
    expect(narrationClipForText("How many shells?")?.id).toBe("voice.seal.shells-welcome");
    expect(narrationClipForText("Five shells in the tide line. How many?")?.id).toBe(
      "voice.seal.clue.shells",
    );
    expect(narrationClipForText("Which letter starts seal?")?.id).toBe("voice.seal.letter-welcome");
    expect(narrationClipForText("Seal starts with sss. Which letter?")?.id).toBe(
      "voice.seal.clue.letter",
    );
    expect(narrationClipForText("Two and three seals. How many?")?.id).toBe(
      "voice.seal.rocks-welcome",
    );
    expect(narrationClipForText("2 seals on this rock, 3 on that rock. How many?")?.id).toBe(
      "voice.seal.clue.rocks",
    );
    expect(narrationClipForText("Where does the seal belong?")?.id).toBe("voice.seal.home-welcome");
    expect(
      narrationClipForText("Seals belong in cold sea and on wet rocks, not the attic. Where?")?.id,
    ).toBe("voice.seal.clue.home");
    expect(narrationClipForText("What rhymes with rock?")?.id).toBe("voice.seal.rhyme-welcome");
    expect(narrationClipForText("Rock. What rhymes with rock?")?.id).toBe("voice.seal.clue.rhyme");
    expect(narrationClipForText("Pop the seal-shore bubbles!")?.id).toBe(
      "voice.seal.bubble-welcome",
    );
    expect(narrationClipForText("Toss the fish to the seal!")?.id).toBe("voice.seal.toss-welcome");
  });

  it("maps Bed Lamp closed-kit lines to voice-01", () => {
    expect(
      narrationClipForText(
        "Bed Lamp! A small lamp and a slow body. Let's explore together!",
      )?.id,
    ).toBe("voice.bed.area-welcome");
    expect(narrationClipForText("Dark sky, slow body. What is next?")?.id).toBe(
      "voice.bed.sleep-welcome",
    );
    expect(narrationClipForText("The sky is dark and the body is slow. What is next?")?.id).toBe(
      "voice.bed.clue.sleep",
    );
    expect(narrationClipForText("How many teddies?")?.id).toBe("voice.bed.teddies-welcome");
    expect(narrationClipForText("Three teddies on the quilt. How many?")?.id).toBe(
      "voice.bed.clue.teddies",
    );
    expect(narrationClipForText("Which belongs on the bedtime shelf?")?.id).toBe(
      "voice.bed.shelf-welcome",
    );
    expect(narrationClipForText("The shelf is for bedtime. Which belongs?")?.id).toBe(
      "voice.bed.clue.shelf",
    );
    expect(narrationClipForText("Which letter starts bed?")?.id).toBe("voice.bed.letter-welcome");
    expect(narrationClipForText("Bed starts with buh. Which letter?")?.id).toBe(
      "voice.bed.clue.letter",
    );
    expect(narrationClipForText("Play a soft lullaby for the quilt.")?.id).toBe(
      "voice.bed.lullaby-welcome",
    );
    expect(
      narrationClipForText("The quilt wants a soft low tune. Play the quiet night piano.")?.id,
    ).toBe("voice.bed.clue.lullaby");
    expect(narrationClipForText("Who said night-night last?")?.id).toBe("voice.bed.who-welcome");
    expect(
      narrationClipForText("Pip said night-night, then Nana said night-night. Who last?")?.id,
    ).toBe("voice.bed.clue.who");
    expect(narrationClipForText("Bright, dim, bright, dim, bright. Next?")?.id).toBe(
      "voice.bed.dim-welcome",
    );
    expect(narrationClipForText("What shape is the window?")?.id).toBe("voice.bed.window-welcome");
    expect(narrationClipForText("The bedroom window is a rectangle. What shape?")?.id).toBe(
      "voice.bed.clue.window",
    );
    expect(narrationClipForText("Flip the bed lamps and find the match!")?.id).toBe(
      "voice.bed.memory-welcome",
    );
    expect(narrationClipForText("Close the shutters and tuck teddy in!")?.id).toBe(
      "voice.bed.tuck-welcome",
    );
    expect(narrationClipForText("Who is calling hoo?")?.id).toBe("voice.owl.who-welcome");
    expect(narrationClipForText("Hoo from a tree hole. Who?")?.id).toBe("voice.owl.clue.who");
    expect(narrationClipForText("Where does the owl belong?")?.id).toBe("voice.owl.home-welcome");
    expect(narrationClipForText("How many gold eyes?")?.id).toBe("voice.owl.eyes-welcome");
    expect(narrationClipForText("Two gold eyes in the hole. How many?")?.id).toBe(
      "voice.owl.clue.eyes",
    );
    expect(narrationClipForText("Who belongs in the night wood?")?.id).toBe(
      "voice.owl.night-welcome",
    );
    expect(narrationClipForText("Which letter starts owl?")?.id).toBe("voice.owl.letter-welcome");
    expect(narrationClipForText("Owl starts with ow. Which letter?")?.id).toBe(
      "voice.owl.clue.letter",
    );
    expect(narrationClipForText("Who called last?")?.id).toBe("voice.owl.last-welcome");
    expect(
      narrationClipForText("A small owl called, then a deep owl called. Who last?")?.id,
    ).toBe("voice.owl.clue.last");
    expect(narrationClipForText("Three and three pines. How many?")?.id).toBe(
      "voice.owl.pines-welcome",
    );
    expect(narrationClipForText("What rhymes with tree?")?.id).toBe("voice.owl.rhyme-welcome");
    expect(narrationClipForText("Hoot with the owl!")?.id).toBe("voice.owl.hoot-welcome");
    expect(narrationClipForText("Trace the night letter with your finger!")?.id).toBe(
      "voice.owl.trace-welcome",
    );
    expect(narrationClipForText("What rhymes with Hoot in the owl wood?")?.id).toBe(
      "voice.owl.rhyme-hoot",
    );
    expect(narrationClipForText("What is the round pale lamp?")?.id).toBe("voice.star.moon-welcome");
    expect(narrationClipForText("What shape is the moon tonight?")?.id).toBe(
      "voice.star.shape-welcome",
    );
    expect(narrationClipForText("Four and five stars. How many?")?.id).toBe(
      "voice.star.plus-welcome",
    );
    expect(narrationClipForText("Twinkle, rest, twinkle, rest, twinkle. Next?")?.id).toBe(
      "voice.star.twinkle-welcome",
    );
    expect(narrationClipForText("Where does the moon sit?")?.id).toBe("voice.star.sit-welcome");
    expect(narrationClipForText("What belongs in the balcony sky?")?.id).toBe(
      "voice.star.sky-welcome",
    );
    expect(narrationClipForText("Flip the balcony stars and find the match!")?.id).toBe(
      "voice.star.memory-welcome",
    );
    expect(narrationClipForText("Hang the stars on the balcony!")?.id).toBe(
      "voice.star.hang-welcome",
    );
    expect(narrationClipForText("Who circles the porch bulb?")?.id).toBe("voice.porch.who-welcome");
    expect(narrationClipForText("Five moths on the glass. How many?")?.id).toBe(
      "voice.porch.clue.count",
    );
    expect(narrationClipForText("Who belongs at the porch bulb?")?.id).toBe(
      "voice.porch.sort-welcome",
    );
    expect(narrationClipForText("Three and two moths. How many?")?.id).toBe(
      "voice.porch.plus-welcome",
    );
    expect(narrationClipForText("What did Nana say?")?.id).toBe("voice.porch.nana-welcome");
    expect(narrationClipForText("Circle, rest, circle, rest, circle. Next?")?.id).toBe(
      "voice.porch.circle-welcome",
    );
    expect(narrationClipForText("What rhymes with light?")?.id).toBe("voice.porch.rhyme-welcome");
    expect(narrationClipForText("Tap the porch-light balloons!")?.id).toBe(
      "voice.porch.balloon-welcome",
    );
    expect(narrationClipForText("Who hoots from the oak at dusk?")?.id).toBe(
      "voice.forest.hoot-welcome",
    );
    expect(narrationClipForText("Hoo from the oak hollow at dusk. Who?")?.id).toBe(
      "voice.forest.clue.hoot",
    );
    expect(narrationClipForText("How many mushroom caps?")?.id).toBe("voice.forest.caps-welcome");
    expect(narrationClipForText("Who left the two-toed prints?")?.id).toBe(
      "voice.forest.hooves-welcome",
    );
    expect(narrationClipForText("Who hides acorns in the oak?")?.id).toBe("voice.forest.oak-welcome");
    expect(narrationClipForText("What belongs on the walking path?")?.id).toBe(
      "voice.forest.path-welcome",
    );
    expect(narrationClipForText("Eight acorns, jay takes two. How many left?")?.id).toBe(
      "voice.forest.jay-welcome",
    );
    expect(narrationClipForText("What is making the chimes crash?")?.id).toBe(
      "voice.weather.chimes-welcome",
    );
    expect(narrationClipForText("How many puddles on the path?")?.id).toBe(
      "voice.weather.puddles-welcome",
    );
    expect(narrationClipForText("Why is the grass silver and crunchy?")?.id).toBe(
      "voice.weather.frost-welcome",
    );
    expect(narrationClipForText("What made the moving shade?")?.id).toBe(
      "voice.weather.shade-welcome",
    );
    expect(narrationClipForText("Which season is nest time?")?.id).toBe(
      "voice.weather.nests-welcome",
    );
    expect(narrationClipForText("What belongs in the storm kit?")?.id).toBe(
      "voice.weather.storm-welcome",
    );
    expect(
      narrationClipForText(
        "Pip is buckled into the silver rocket! The countdown is 3... 2... 1... What initiates blast-off?",
      )?.id,
    ).toBe("voice.space.clue.launch");
    expect(narrationClipForText("How many portholes on the rocket?")?.id).toBe(
      "voice.space.ports-welcome",
    );
    expect(narrationClipForText("What belongs in the rocket cabin?")?.id).toBe(
      "voice.space.cabin-welcome",
    );
    expect(narrationClipForText("Beep beep pause. What comes next?")?.id).toBe(
      "voice.space.beep-welcome",
    );
    expect(narrationClipForText("Who leaves prints in moon dust?")?.id).toBe(
      "voice.space.dust-welcome",
    );
    expect(narrationClipForText("Ten cells, burn uses three. How many left?")?.id).toBe(
      "voice.space.fuel-welcome",
    );
    expect(narrationClipForText("What are the three bright dots?")?.id).toBe(
      "voice.space.dots-welcome",
    );
    expect(narrationClipForText("How many coins in the sand?")?.id).toBe(
      "voice.treasure.coins-welcome",
    );
    expect(narrationClipForText("Where does the map tell us to dig?")?.id).toBe(
      "voice.treasure.x-welcome",
    );
    expect(narrationClipForText("What belongs in the dry chest?")?.id).toBe(
      "voice.treasure.chest-welcome",
    );
    expect(narrationClipForText("Which key fits the round hole?")?.id).toBe(
      "voice.treasure.keyhole-welcome",
    );
    expect(narrationClipForText("Four blue and three green. How many gems?")?.id).toBe(
      "voice.treasure.gems-welcome",
    );
    expect(narrationClipForText("Where is the parrot shouting from?")?.id).toBe(
      "voice.treasure.parrot-welcome",
    );
    expect(narrationClipForText("Red, black, red, black, red. What comes next?")?.id).toBe(
      "voice.treasure.flag-welcome",
    );
    expect(narrationClipForText("Red and blue jam. What colour?")?.id).toBe(
      "voice.color.berry-welcome",
    );
    expect(narrationClipForText("Yellow plus blue. What colour?")?.id).toBe(
      "voice.color.leaf-welcome",
    );
    expect(narrationClipForText("Which colour is warm like fire?")?.id).toBe(
      "voice.color.warm-welcome",
    );
    expect(narrationClipForText("How many paint pots?")?.id).toBe(
      "voice.color.pots-welcome",
    );
    expect(narrationClipForText("Is shady red a new colour, or darker red?")?.id).toBe(
      "voice.color.shadow-welcome",
    );
    expect(narrationClipForText("Red, yellow, red, yellow, red. What comes next?")?.id).toBe(
      "voice.color.dots-welcome",
    );
    expect(narrationClipForText("How many garden bells?")?.id).toBe(
      "voice.music.bells-welcome",
    );
    expect(narrationClipForText("The bird is quiet. Loud drum or soft tap?")?.id).toBe(
      "voice.music.quiet-welcome",
    );
    expect(narrationClipForText("Clap clap rest. What comes next?")?.id).toBe(
      "voice.music.clap-welcome",
    );
    expect(narrationClipForText("Which bar plays the high bird note?")?.id).toBe(
      "voice.music.high-welcome",
    );
    expect(narrationClipForText("While the song plays, what do we do?")?.id).toBe(
      "voice.music.keep-welcome",
    );
    expect(narrationClipForText("Pip hummed, then Nana hummed lower. Who sang last?")?.id).toBe(
      "voice.music.who-welcome",
    );
    expect(narrationClipForText("The frog pond wants a low boom. Which instrument?")?.id).toBe(
      "voice.music.pond-welcome",
    );
    expect(narrationClipForText("Red, blue, green, red, blue. What comes next?")?.id).toBe(
      "voice.pattern.abc-welcome",
    );
    expect(narrationClipForText("Small, medium, big, small, medium. Next?")?.id).toBe(
      "voice.pattern.grow-welcome",
    );
    expect(narrationClipForText("How many pegs on the board?")?.id).toBe(
      "voice.pattern.pegs-welcome",
    );
    expect(narrationClipForText("Which belongs on the circles tray?")?.id).toBe(
      "voice.pattern.circles-welcome",
    );
    expect(narrationClipForText("Red, red, red, blue. Which does not belong?")?.id).toBe(
      "voice.pattern.odd-welcome",
    );
    expect(narrationClipForText("Star, moon, star, moon, star. Next?")?.id).toBe(
      "voice.pattern.stamp-welcome",
    );
    expect(narrationClipForText("Four pegs and three pegs. How many in all?")?.id).toBe(
      "voice.pattern.pegtwo-welcome",
    );
    expect(narrationClipForText("How many star stickers?")?.id).toBe(
      "voice.sticker.stars-welcome",
    );
    expect(narrationClipForText("Which sticker belongs on the sky page?")?.id).toBe(
      "voice.sticker.sky-welcome",
    );
    expect(narrationClipForText("What shape are the crown points?")?.id).toBe(
      "voice.sticker.points-welcome",
    );
    expect(narrationClipForText("Heart, star, heart, star, heart. Next?")?.id).toBe(
      "voice.sticker.row-welcome",
    );
    expect(narrationClipForText("Nana said the fish goes on the pond page. Where?")?.id).toBe(
      "voice.sticker.place-welcome",
    );
    expect(narrationClipForText("Five and two stickers. How many in all?")?.id).toBe(
      "voice.sticker.sheets-welcome",
    );
    expect(
      narrationClipForText(
        "Pip opened the gate, then the lamb trotted out. Who opened the gate?",
      )?.id,
    ).toBe("voice.barn.gate-welcome");
    expect(narrationClipForText("Nana tucked the egg in the basket. Where is it?")?.id).toBe(
      "voice.barn.egg-welcome",
    );
    expect(narrationClipForText("How many piglets in the stall?")?.id).toBe(
      "voice.barn.piglets-welcome",
    );
    expect(narrationClipForText("Which is true in this farm tale?")?.id).toBe(
      "voice.barn.true-welcome",
    );
    expect(
      narrationClipForText(
        "The rooster crowed, then Pip stretched. What happened first?",
      )?.id,
    ).toBe("voice.barn.next-welcome");
    expect(narrationClipForText("What rhymes with hen?")?.id).toBe("voice.barn.hen-welcome");
    expect(narrationClipForText("Why did Pip open the gate?")?.id).toBe("voice.barn.why-welcome");
    expect(
      narrationClipForText("The moon waved, then Pip waved back. Who waved first?")?.id,
    ).toBe("voice.space.waved-welcome");
    expect(narrationClipForText("Where is the red sock?")?.id).toBe("voice.space.sock-welcome");
    expect(narrationClipForText("How many beeps?")?.id).toBe("voice.space.fourbeeps-welcome");
    expect(narrationClipForText("What colour was the helmet?")?.id).toBe(
      "voice.space.helmet-welcome",
    );
    expect(narrationClipForText("Blink blink rest. Next?")?.id).toBe("voice.space.blink-welcome");
    expect(narrationClipForText("Where do they sleep?")?.id).toBe("voice.space.sleep-welcome");
    expect(narrationClipForText("Who held the lamp?")?.id).toBe("voice.ocean.lamp-welcome");
    expect(narrationClipForText("Where is the pearl?")?.id).toBe("voice.ocean.pearl-welcome");
    expect(narrationClipForText("How many bubbles?")?.id).toBe("voice.ocean.sixbubbles-welcome");
    expect(narrationClipForText("Five fish, one swims out. How many stay?")?.id).toBe(
      "voice.ocean.fishleave-welcome",
    );
    expect(narrationClipForText("What rhymes with shell?")?.id).toBe("voice.ocean.shell-welcome");
    expect(narrationClipForText("Why did the pearl hide under the shell?")?.id).toBe(
      "voice.ocean.whyshell-welcome",
    );
    expect(narrationClipForText("Which letter starts moon?")?.id).toBe("voice.phonics.m-welcome");
    expect(narrationClipForText("Which letter starts Pip?")?.id).toBe("voice.phonics.p-welcome");
    expect(narrationClipForText("Which blend starts stem?")?.id).toBe("voice.phonics.st-welcome");
    expect(narrationClipForText("What rhymes with bug?")?.id).toBe("voice.phonics.bug-welcome");
    expect(narrationClipForText("What is the first sound in sun?")?.id).toBe(
      "voice.phonics.sun-welcome",
    );
    expect(narrationClipForText("How many letters in sun?")?.id).toBe(
      "voice.phonics.sunletters-welcome",
    );
    expect(narrationClipForText("How many pebbles?")?.id).toBe("voice.grove.eight-welcome");
    expect(narrationClipForText("A full ten-frame. How many?")?.id).toBe(
      "voice.grove.fullten-welcome",
    );
    expect(narrationClipForText("Six and one. How many berries?")?.id).toBe(
      "voice.grove.twodishes-welcome",
    );
    expect(narrationClipForText("Nine nuts, squirrel takes four. Left?")?.id).toBe(
      "voice.grove.squirrel-welcome",
    );
    expect(narrationClipForText("Three versus seven. Which has more?")?.id).toBe(
      "voice.grove.more-welcome",
    );
    expect(narrationClipForText("Four socks in pairs of two. How many pairs?")?.id).toBe(
      "voice.grove.pairs-welcome",
    );
    expect(narrationClipForText("Four equal sides. What shape is the window?")?.id).toBe(
      "voice.shapes.square-welcome",
    );
    expect(narrationClipForText("Three sides on the roof. What shape?")?.id).toBe(
      "voice.shapes.roof-welcome",
    );
    expect(narrationClipForText("A perfectly round cover. What shape?")?.id).toBe(
      "voice.shapes.well-welcome",
    );
    expect(narrationClipForText("Which shape has corners?")?.id).toBe(
      "voice.shapes.corners-welcome",
    );
    expect(narrationClipForText("How many sides on a triangle?")?.id).toBe(
      "voice.shapes.sides-welcome",
    );
    expect(narrationClipForText("Long, four corners. What shape is the door?")?.id).toBe(
      "voice.shapes.door-welcome",
    );
    expect(narrationClipForText("Pip looks sad. What helps?")?.id).toBe(
      "voice.feelings.sad-welcome",
    );
    expect(narrationClipForText("Pip looks mad. What first?")?.id).toBe(
      "voice.feelings.mad-welcome",
    );
    expect(narrationClipForText("A bump in the dark. What helps?")?.id).toBe(
      "voice.feelings.scared-welcome",
    );
    expect(narrationClipForText("Pip finished the puzzle. Which feeling?")?.id).toBe(
      "voice.feelings.proud-welcome",
    );
    expect(narrationClipForText("One truck, two friends. What is kind?")?.id).toBe(
      "voice.feelings.share-welcome",
    );
    expect(narrationClipForText("Nana is still talking. What do we do?")?.id).toBe(
      "voice.feelings.listen-welcome",
    );
    expect(narrationClipForText("Bright eyes and a wide mouth. Which feeling?")?.id).toBe(
      "voice.feelings.happyface-welcome",
    );
    expect(narrationClipForText("Before fruit, what do we use on our hands?")?.id).toBe(
      "voice.habits.soap-welcome",
    );
    expect(narrationClipForText("Dry mouth after running. What helps?")?.id).toBe(
      "voice.habits.water-welcome",
    );
    expect(narrationClipForText("A sneeze is coming. Where?")?.id).toBe(
      "voice.habits.sneeze-welcome",
    );
    expect(narrationClipForText("How many slow brushes?")?.id).toBe("voice.habits.brushes-welcome");
    expect(narrationClipForText("What belongs in the bath?")?.id).toBe("voice.habits.bath-welcome");
    expect(narrationClipForText("Who reads the bedtime page?")?.id).toBe(
      "voice.family.reads-welcome",
    );
    expect(narrationClipForText("Where does Pip’s cup live?")?.id).toBe("voice.family.cup-welcome");
    expect(narrationClipForText("How many cushions?")?.id).toBe("voice.family.cushions-welcome");
    expect(narrationClipForText("Baby is sleeping. What do kind hands do?")?.id).toBe(
      "voice.family.kind-welcome",
    );
    expect(narrationClipForText("Sweep, rinse, sweep, rinse, sweep. Next?")?.id).toBe(
      "voice.family.chore-welcome",
    );
    expect(narrationClipForText("Three plates and three more. How many?")?.id).toBe(
      "voice.family.plates-welcome",
    );
    expect(
      narrationClipForText(
        "What rhymes with Cat? Listen for the at sound! Can you tap the word that rhymes with Cat?",
      )?.id,
    ).toBe("voice.games.rhyme-r1");
    expect(
      narrationClipForText(
        "Tiny quiet Mouse! Squeak squeak! Listen for the ouse sound! What rhymes with Mouse?",
      )?.id,
    ).toBe("voice.games.rhyme-r10");
    expect(
      narrationClipForText("Oink oink goes little Pig! Listen for the ig sound! What rhymes with Pig?")?.id,
    ).toBe("voice.games.rhyme-r16");
    expect(
      narrationClipForText(
        "Welcome to Rhyme Time! What rhymes with Cat? Listen for the at sound! Can you tap the word that rhymes with Cat?",
      )?.id,
    ).toBe("voice.games.rhyme-welcome");
    expect(
      narrationClipForText(
        "Welcome to Memory Match! Can you find the matching friends? Tap two cards to turn them over!",
      )?.id,
    ).toBe("voice.games.memory-welcome");
    expect(
      narrationClipForText("Find the matching friends! Tap two cards to turn them over!")?.id,
    ).toBe("voice.games.memory-find");
    expect(
      narrationClipForText(
        "Welcome to Bubble Pop Phonics! Tap the floating bubbles to hear their letter sounds!",
      )?.id,
    ).toBe("voice.games.bubble-welcome");
    expect(narrationClipForText("What rhymes with Cat? Listen for the at sound!")?.id).toBe(
      "voice.world.rhyme-r-cat",
    );
    expect(narrationClipForText("What rhymes with Pot?")?.id).toBe("voice.world.rhyme-k-pot");
    expect(narrationClipForText("What rhymes with Bun on the bakery shelf?")?.id).toBe(
      "voice.world.rhyme-k-bun",
    );
    expect(narrationClipForText("What rhymes with Mug by the kettle?")?.id).toBe(
      "voice.world.rhyme-k-mug",
    );
    expect(narrationClipForText("What rhymes with Toast from the grill?")?.id).toBe(
      "voice.world.rhyme-k-toast",
    );
    expect(narrationClipForText("What rhymes with Dream at bedtime?")?.id).toBe(
      "voice.world.rhyme-n-dream",
    );
    expect(narrationClipForText("What rhymes with Sock under the bed?")?.id).toBe(
      "voice.world.rhyme-n-sock",
    );
    expect(narrationClipForText("What rhymes with Beam from the lamp?")?.id).toBe(
      "voice.world.rhyme-n-dream2",
    );
    expect(narrationClipForText("What rhymes with Bus on the high street?")?.id).toBe(
      "voice.world.rhyme-v-bus",
    );
    expect(narrationClipForText("What rhymes with Wheel in the garage?")?.id).toBe(
      "voice.world.rhyme-v-wheel",
    );
    expect(narrationClipForText("What rhymes with Horn on the bus?")?.id).toBe(
      "voice.world.rhyme-v-horn",
    );
    expect(narrationClipForText("What rhymes with Fox?")?.id).toBe("voice.world.rhyme-l-fox");
    expect(narrationClipForText("What rhymes with Map in the counting grove?")?.id).toBe(
      "voice.world.rhyme-l-map",
    );
    expect(narrationClipForText("What rhymes with Dot in the ten-frame?")?.id).toBe(
      "voice.world.rhyme-l-dot",
    );
    expect(narrationClipForText("What rhymes with Page?")?.id).toBe("voice.world.rhyme-l-page");
    expect(narrationClipForText("What rhymes with Goat on the hill?")?.id).toBe(
      "voice.world.rhyme-a-goat",
    );
    expect(narrationClipForText("What rhymes with Roar in the valley?")?.id).toBe(
      "voice.world.rhyme-a-roar",
    );
    expect(narrationClipForText("What rhymes with Bug?")?.id).toBe("voice.world.rhyme-b-bug");
    expect(narrationClipForText("What rhymes with Ant?")?.id).toBe("voice.world.rhyme-b-ant");
    expect(narrationClipForText("What rhymes with Pond at the edge?")?.id).toBe(
      "voice.world.rhyme-b-pond",
    );
    expect(narrationClipForText("What rhymes with Spot on the ladybird?")?.id).toBe(
      "voice.world.rhyme-b-spot",
    );
    expect(narrationClipForText("What rhymes with Cold on the floe?")?.id).toBe(
      "voice.world.rhyme-i-cold",
    );
    expect(narrationClipForText("What rhymes with Den where the snow bear naps?")?.id).toBe(
      "voice.world.rhyme-i-den",
    );
    expect(narrationClipForText("What rhymes with Light in the sky curtains?")?.id).toBe(
      "voice.world.rhyme-ar-light",
    );
    expect(narrationClipForText("What rhymes with Park in town?")?.id).toBe(
      "voice.world.rhyme-c-park",
    );
    expect(narrationClipForText("What rhymes with Stop at the corner?")?.id).toBe(
      "voice.world.rhyme-c-stop",
    );
    expect(narrationClipForText("What rhymes with Van at the market?")?.id).toBe(
      "voice.world.rhyme-c-van",
    );
    expect(narrationClipForText("What rhymes with Hen in the barnyard tale?")?.id).toBe(
      "voice.world.rhyme-s-hen",
    );
    expect(narrationClipForText("What rhymes with Page in the story book?")?.id).toBe(
      "voice.world.rhyme-s-page",
    );
    expect(narrationClipForText("What rhymes with Knight in the story?")?.id).toBe(
      "voice.world.rhyme-s-knight",
    );
    expect(narrationClipForText("What rhymes with Wish on the porch?")?.id).toBe(
      "voice.world.rhyme-s-wish",
    );
    expect(narrationClipForText("What rhymes with Hand for a hug?")?.id).toBe(
      "voice.world.rhyme-m-hand",
    );
    expect(narrationClipForText("What rhymes with Wash at the sink?")?.id).toBe(
      "voice.world.rhyme-m-wash",
    );
    expect(narrationClipForText("What rhymes with Tree in the forest?")?.id).toBe(
      "voice.world.rhyme-ad-tree",
    );
    expect(narrationClipForText("What rhymes with Cave?")?.id).toBe(
      "voice.world.rhyme-ad-cave",
    );
    expect(narrationClipForText("What rhymes with Quest for treasure?")?.id).toBe(
      "voice.world.rhyme-ad-quest",
    );
    expect(narrationClipForText("What rhymes with Flag on the peak?")?.id).toBe(
      "voice.world.rhyme-ad-flag",
    );
    expect(narrationClipForText("A begins Apple.")?.id).toBe("voice.bubble.begins-a-apple");
    expect(narrationClipForText("T begins Tiger.")?.id).toBe("voice.bubble.begins-t-tiger");
    expect(narrationClipForText("P begins Puppy.")?.id).toBe("voice.bubble.begins-p-puppy");
    expect(narrationClipForText("W begins Whale.")?.id).toBe("voice.bubble.begins-w-whale");
    expect(narrationClipForText("F begins Fox.")?.id).toBe("voice.bubble.begins-f-fox");
    expect(narrationClipForText("P begins Pear.")?.id).toBe("voice.bubble.begins-p-pear");
    expect(narrationClipForText("C begins Corn.")?.id).toBe("voice.bubble.begins-c-corn");
    expect(narrationClipForText("P begins Plane.")?.id).toBe("voice.bubble.begins-p-plane");
    expect(narrationClipForText("T begins Train.")?.id).toBe("voice.bubble.begins-t-train");
    expect(narrationClipForText("S begins Star.")?.id).toBe("voice.bubble.begins-s-star");
    expect(narrationClipForText("L begins Lamp.")?.id).toBe("voice.bubble.begins-l-lamp");
    expect(narrationClipForText("P begins Pig.")?.id).toBe("voice.bubble.begins-p-pig");
    expect(narrationClipForText("H begins Horse.")?.id).toBe("voice.bubble.begins-h-horse");
    expect(narrationClipForText("R begins Rooster.")?.id).toBe("voice.bubble.begins-r-rooster");
    expect(narrationClipForText("B begins Bee.")?.id).toBe("voice.bubble.begins-b-bee");
    expect(narrationClipForText("D begins Dew.")?.id).toBe("voice.bubble.begins-d-dew");
    expect(narrationClipForText("H begins Hive.")?.id).toBe("voice.bubble.begins-h-hive");
    expect(narrationClipForText("N begins News.")?.id).toBe("voice.bubble.begins-n-news");
    expect(narrationClipForText("P begins Paint.")?.id).toBe("voice.bubble.begins-p-paint");
    expect(narrationClipForText("R begins Red.")?.id).toBe("voice.bubble.begins-r-red");
    expect(narrationClipForText("E begins Easel.")?.id).toBe("voice.bubble.begins-e-easel");
    expect(narrationClipForText("R begins Read.")?.id).toBe("voice.bubble.begins-r-read");
    expect(narrationClipForText("G begins Dragon.")?.id).toBe("voice.bubble.begins-g-dragon");
    expect(narrationClipForText("C begins Cup.")?.id).toBe("voice.bubble.begins-c-cup");
    expect(narrationClipForText("L begins Love.")?.id).toBe("voice.bubble.begins-l-love");
    expect(narrationClipForText("G begins Gem.")?.id).toBe("voice.bubble.begins-g-gem");
    expect(narrationClipForText("C begins Cave.")?.id).toBe("voice.bubble.begins-c-cave");
    expect(narrationClipForText("S begins Shape.")?.id).toBe("voice.bubble.begins-s-shape");
    expect(narrationClipForText("T begins Trace.")?.id).toBe("voice.bubble.begins-t-trace");
    expect(narrationClipForText("10 begins Ten.")?.id).toBe("voice.bubble.begins-10-ten");
    expect(
      narrationClipForText("Fourteen friends get in the taxi. One row of ten is full. How many leftover riders?")?.id,
    ).toBe("voice.k1.taxi-14");
    expect(narrationClipForText("Thirteen friends. How many leftover after one ten?")?.id).toBe("voice.k1.taxi-13");
    expect(narrationClipForText("Twelve friends. One row of ten is full. How many leftover?")?.id).toBe("voice.k1.taxi-12");
    expect(narrationClipForText("C and L. Cl. What starts with cl?")?.id).toBe("voice.k1.cl-cloves");
    expect(narrationClipForText("T and R. Tr. What starts with tr?")?.id).toBe("voice.k1.tr-tray");
    expect(narrationClipForText("G and L. Gl. What starts with gl?")?.id).toBe("voice.k1.gl-glaze");
    expect(narrationClipForText("S and N. Sn. What starts with sn?")?.id).toBe("voice.k1.sn-snap");
    expect(narrationClipForText("Sun, rain, snow, sun, rain. What comes next?")?.id).toBe("voice.k1.abc-weather");
    expect(
      narrationClipForText("Egg, caterpillar, butterfly, egg, caterpillar. What comes next?")?.id,
    ).toBe("voice.k1.grow-bug");
    expect(narrationClipForText("Four pretzels and four pretzels. How many?")?.id).toBe("voice.k1.4-plus-4");
    expect(
      narrationClipForText("Six grapes. A bird takes two. How many left?")?.id,
    ).toBe("voice.k1.6-minus-2");
    expect(narrationClipForText("Seven pears. A fox takes two. How many left?")?.id).toBe(
      "voice.k1.7-minus-2",
    );
    expect(narrationClipForText("Three peaches and six peaches. How many?")?.id).toBe(
      "voice.k1.3-plus-6",
    );
    expect(narrationClipForText("A sun hat. Which basket?")?.id).toBe("voice.k1.laundry-hat");
    expect(narrationClipForText("Blue pants. Which basket?")?.id).toBe("voice.k1.laundry-pants");
    expect(narrationClipForText("A hairband in the dryer. Keep with clothes?")?.id).toBe(
      "voice.k1.laundry-band",
    );
    expect(
      narrationClipForText("Listen. Pip hid a red apple under the blue hat. Who hid it?")?.id,
    ).toBe("voice.k1.story-who-hid");
    expect(narrationClipForText("A frog hopped onto the rail and sang. Where did it hop?")?.id).toBe(
      "voice.k1.story-frog-where",
    );
    expect(
      narrationClipForText("A fox stole a bun from the step and ran. Who stole it?")?.id,
    ).toBe("voice.k1.story-who-fox");
    expect(narrationClipForText("Two left-foot socks. Is that a pair you can wear?")?.id).toBe(
      "voice.k1.sock-two-left",
    );
    expect(
      narrationClipForText("Yellow, yellow, green. What goes in the yellow pile?")?.id,
    ).toBe("voice.k1.sock-color-sort");
    expect(narrationClipForText("A stripe sock and a spot sock. Are they a pair?")?.id).toBe(
      "voice.k1.sock-stripe-spot",
    );
    expect(narrationClipForText("Five socks. How many complete pairs?")?.id).toBe(
      "voice.k1.sock-one-missing",
    );
    expect(narrationClipForText("A square cracker. How many corners?")?.id).toBe(
      "voice.k1.shape-cracker",
    );
    expect(narrationClipForText("A long baguette. Is it a perfect circle?")?.id).toBe(
      "voice.k1.shape-roll-not",
    );
    expect(narrationClipForText("The night bus is empty. How many riders?")?.id).toBe(
      "voice.k1.bus-empty",
    );
    expect(narrationClipForText("Fourteen school friends. How many?")?.id).toBe(
      "voice.k1.bus-fourteen",
    );
    expect(narrationClipForText("It is dark. Is the sun making this shadow?")?.id).toBe(
      "voice.k1.shadow-not-sun",
    );
    expect(narrationClipForText("The lamp is low. Why is the shadow long?")?.id).toBe(
      "voice.k1.shadow-long",
    );
    expect(narrationClipForText("The ice is slick. What helps feet?")?.id).toBe("voice.k1.ice-boots");
    expect(narrationClipForText("The hut stove glows. What does Pip do?")?.id).toBe(
      "voice.k1.ice-home",
    );
    expect(narrationClipForText("A dew web at dawn. Who built it?")?.id).toBe("voice.k1.bug-spider");
    expect(narrationClipForText("Bee, beetle, strider. Who goes in the pond dish?")?.id).toBe(
      "voice.k1.bug-sort",
    );
    expect(narrationClipForText("Three eggs. Fill the rest of ten.")?.id).toBe(
      "voice.count.ten-three",
    );
    expect(narrationClipForText("Plate plate lemon. Plate plate…?")?.id).toBe(
      "voice.count.pat-plate",
    );
    expect(narrationClipForText("Fourteen. What number comes next?")?.id).toBe(
      "voice.count.next-fourteen",
    );
    expect(narrationClipForText("The little roof. What shape?")?.id).toBe("voice.count.sh-roof");
    expect(narrationClipForText("Nest. What letter starts nest?")?.id).toBe(
      "voice.phonics.hunt-nest",
    );
    expect(narrationClipForText("Find the word to.")?.id).toBe("voice.phonics.sight-to");
    expect(narrationClipForText("Find the word like.")?.id).toBe("voice.phonics.sight-like");
    expect(narrationClipForText("P. O. T. Pot.")?.id).toBe("voice.phonics.blend-pot");
    expect(narrationClipForText("H, I, J. What letter comes next?")?.id).toBe(
      "voice.phonics.next-hij",
    );
    expect(narrationClipForText("W, X, Y. What letter comes next?")?.id).toBe(
      "voice.phonics.next-wxy",
    );
    expect(narrationClipForText("Shake six times. Tap each shake.")?.id).toBe(
      "voice.focus.mv-shake",
    );
    expect(narrationClipForText("Press palms. Hold this.")?.id).toBe("voice.focus.hv-palms");
    expect(narrationClipForText("Arms make a rainbow. Breathe in up. Out down.")?.id).toBe(
      "voice.focus.br-rainbow",
    );
    expect(narrationClipForText("Tap every hand.")?.id).toBe("voice.focus.lk-hands");
    expect(narrationClipForText("Reach up. Freeze at the top.")?.id).toBe(
      "voice.focus.fr-reach",
    );
    expect(
      narrationClipForText("When the bar ends, we can go learn. Stay until then.")?.id,
    ).toBe("voice.focus.qt-ready");
    expect(narrationClipForText("Turn, wait, turn. Slow on the corners.")?.id).toBe(
      "voice.focus.steady-u-turns",
    );
    expect(narrationClipForText("Five points. Pause at each tip.")?.id).toBe(
      "voice.focus.steady-star-path",
    );
    expect(narrationClipForText("Do we wash with it, or rest with it?")?.id).toBe(
      "voice.sort.wash-rest",
    );
    expect(
      narrationClipForText(
        "Which giant glowing ball of warmth in space shines down on us as the sun?",
      )?.id,
    ).toBe("voice.activity.adv-space-1");
    expect(narrationClipForText("Who talks with hands on the tiny stage?")?.id).toBe(
      "voice.district.act-puppet-who-talks",
    );
    expect(narrationClipForText("Trace the letter M with your finger!")?.id).toBe(
      "voice.district.act-stream-letter-m",
    );
    expect(narrationClipForText("Which word rhymes with boot?")?.id).toBe(
      "voice.district.act-rain-rhyme-boot",
    );
    expect(narrationClipForText("Letter sounds here. Water sounds there.")?.id).toBe(
      "voice.district.clue-act-stream-sort-sound",
    );
    expect(narrationClipForText("Tap the balloons in the rain clouds.")?.id).toBe(
      "voice.district.clue-act-rain-sky-balloons",
    );
    expect(
      narrationClipForText("The stop sign is not a circle. Which is the stop sign?")?.id,
    ).toBe("voice.atlas.clue-act-road-shape-sign");
    expect(narrationClipForText("Who is visiting the flower bed?")?.id).toBe(
      "voice.toy.clue-act-bed-bug-safari",
    );
    expect(
      narrationClipForText("Flip two bones. Find the matching fossil friends.")?.id,
    ).toBe("voice.toy.clue-act-dino-memory-bones");
    expect(narrationClipForText("Flip two faces. Find the matching feeling.")?.id).toBe(
      "voice.toy.clue-act-feelings-face-memory",
    );
    expect(narrationClipForText("Tap the keys. Make a brush-time song.")?.id).toBe(
      "voice.toy.clue-act-habits-brush-piano",
    );
    expect(narrationClipForText("Tap the pebbles from 1 to 5.")?.id).toBe(
      "voice.toy.clue-act-land-number-pebbles",
    );
    expect(narrationClipForText("Tap the vine. Swing five times.")?.id).toBe(
      "voice.toy.clue-act-land-vine-swing",
    );
    expect(narrationClipForText("Trace B for Bee in the flower bed.")?.id).toBe(
      "voice.toy.clue-act-bed-letter-trace",
    );
    expect(narrationClipForText("Trace A for Art in the studio.")?.id).toBe(
      "voice.toy.clue-act-studio-letter-trace",
    );
    expect(narrationClipForText("Count who climbs on at the stop.")?.id).toBe(
      "voice.toy.clue-act-road-bus-stop",
    );
    expect(narrationClipForText("Who walked here?")?.id).toBe(
      "voice.toy.clue-act-dino-track-who",
    );
    expect(
      narrationClipForText(
        "The rainbow parrot has colorful feathers and wings. Where is its natural home?",
      )?.id,
    ).toBe("voice.arch.clue-act-jungle-habitat-parrot");
    expect(
      narrationClipForText(
        "Look at the palm tree! How many sweet yellow bananas are hanging in a bunch?",
      )?.id,
    ).toBe("voice.arch.clue-act-jungle-count-bananas");
    expect(
      narrationClipForText(
        "Say the pattern out loud: Apple, Banana, Apple, Banana... What comes next?",
      )?.id,
    ).toBe("voice.arch.clue-act-pattern-fruit-chain");
    expect(
      narrationClipForText(
        "Buddy has worked hard learning new things. Which golden headpiece marks true learning royalty?",
      )?.id,
    ).toBe("voice.arch.clue-act-sticker-crown-pick");
    expect(
      narrationClipForText("Play one game in the last place first, then this door opens!")?.id,
    ).toBe("voice.nav.gated-door");
    expect(
      narrationClipForText("Letter Lane. Three letters. About five minutes. No streak.")?.id,
    ).toBe("voice.nav.letter-lane");
    expect(narrationClipForText("Freeze!")?.id).toBe("voice.ui.focus-freeze");
    expect(narrationClipForText("Statue. Soft.")?.id).toBe("voice.ui.focus-statue");
    expect(narrationClipForText("Tap the letters in order.")?.id).toBe(
      "voice.ui.phonics-tap-order",
    );
    expect(narrationClipForText("Voice enabled!")?.id).toBe("voice.ui.voice-enabled");
    expect(narrationClipForText("Yes. Slow and steady.")?.id).toBe("voice.ui.steady-yes");
    expect(narrationClipForText("Start on the green dot.")?.id).toBe(
      "voice.ui.start-green-dot",
    );
    expect(narrationClipForText("Again. Green dot. Slow.")?.id).toBe(
      "voice.ui.again-green-dot",
    );
    expect(
      narrationClipForText("One. One sun on the stoop. Tap the dots, one by one.")?.id,
    ).toBe("voice.count.tap-one");
    expect(
      narrationClipForText(
        "Ten. Ten eggs. A full ten-frame. Tap the dots, one by one.",
      )?.id,
    ).toBe("voice.count.tap-ten");
    expect(
      narrationClipForText(
        "Eleven. Ten buttons and one spare. Tap the dots, one by one.",
      )?.id,
    ).toBe("voice.count.tap-eleven");
    expect(
      narrationClipForText(
        "Twenty. Two full ten-frames. Twenty. Tap the dots, one by one.",
      )?.id,
    ).toBe("voice.count.tap-twenty");
    expect(narrationClipForText("One! One sun on the stoop.")?.id).toBe(
      "voice.count.bang-one",
    );
    expect(narrationClipForText("Ten! Ten eggs. A full ten-frame.")?.id).toBe(
      "voice.count.bang-ten",
    );
    expect(narrationClipForText("Eleven! Ten buttons and one spare.")?.id).toBe(
      "voice.count.bang-eleven",
    );
    expect(narrationClipForText("Twenty! Two full ten-frames. Twenty.")?.id).toBe(
      "voice.count.bang-twenty",
    );
    expect(narrationClipForText("One. One sun on the stoop.")?.id).toBe(
      "voice.count.say-one",
    );
    expect(narrationClipForText("Ten. Ten eggs. A full ten-frame.")?.id).toBe(
      "voice.count.say-ten",
    );
    expect(narrationClipForText("Eleven. Ten buttons and one spare.")?.id).toBe(
      "voice.count.say-eleven",
    );
    expect(narrationClipForText("Twenty. Two full ten-frames. Twenty.")?.id).toBe(
      "voice.count.say-twenty",
    );
    expect(narrationClipForText("Yes. Which pile has more lemons?")?.id).toBe(
      "voice.count.yes-ml-1",
    );
    expect(narrationClipForText("Yes. Boot boot coin. Boot boot…?")?.id).toBe(
      "voice.count.yes-pat-boot",
    );
    expect(
      narrationClipForText("Yes. Bowl, loaf, bowl, loaf. What comes next?")?.id,
    ).toBe("voice.count.yes-pat-loaf");
    expect(narrationClipForText("Circle. The welcome mat. What shape?")?.id).toBe(
      "voice.count.shape-circle-mat",
    );
    expect(
      narrationClipForText("Triangle. The chalk sun. What shape?")?.id,
    ).toBe("voice.count.shape-triangle-sun");
    expect(
      narrationClipForText("Yes. 11. Fourteen. What number comes next?")?.id,
    ).toBe("voice.count.yes-after-11");
    expect(
      narrationClipForText("Yes. 20. One. What number comes next?")?.id,
    ).toBe("voice.count.yes-after-20");
    expect(
      narrationClipForText("Yes. loaf starts with L. Mat. What letter starts mat?")?.id,
    ).toBe("voice.phonics.hunt-yes-loaf");
    expect(
      narrationClipForText("Yes. wash starts with W. Bus. What letter starts bus?")?.id,
    ).toBe("voice.phonics.hunt-yes-wash");
    expect(narrationClipForText("the. Find the word a.")?.id).toBe(
      "voice.phonics.sight-the-a",
    );
    expect(narrationClipForText("look. Find the word see.")?.id).toBe(
      "voice.phonics.sight-look-see",
    );
    expect(narrationClipForText("come. Find the word the.")?.id).toBe(
      "voice.phonics.sight-come-the",
    );
    expect(
      narrationClipForText("Yes. V. V, W, X. What letter comes next?")?.id,
    ).toBe("voice.phonics.next-yes-v");
    expect(
      narrationClipForText("Yes. Z. A, B, C. What letter comes next?")?.id,
    ).toBe("voice.phonics.next-yes-z");
    expect(narrationClipForText("C in Cup.")?.id).toBe("voice.phonics.in-c-cup");
    expect(narrationClipForText("F in Fish.")?.id).toBe("voice.phonics.in-f-fish");
    expect(narrationClipForText("J in Jam.")?.id).toBe("voice.phonics.in-j-jam");
    expect(narrationClipForText("M in Moon.")?.id).toBe("voice.phonics.in-m-moon");
    expect(narrationClipForText("P in Peg.")?.id).toBe("voice.phonics.in-p-peg");
    expect(narrationClipForText("T in Taxi.")?.id).toBe("voice.phonics.in-t-taxi");
    expect(narrationClipForText("W in Window.")?.id).toBe("voice.phonics.in-w-window");
    expect(narrationClipForText("Z in Zoo.")?.id).toBe("voice.phonics.in-z-zoo");
    expect(narrationClipForText("Letter B says buh. Bus. Bun. Bell.")?.id).toBe(
      "voice.phonics.says-b",
    );
    expect(narrationClipForText("Letter M says mmm. Mat. Moon. Milk.")?.id).toBe(
      "voice.phonics.says-m",
    );
    expect(narrationClipForText("Letter A says a. Attic. Apple. Ant.")?.id).toBe(
      "voice.phonics.says-a",
    );
    expect(narrationClipForText("Letter J says juh. Jam. Jar. Jump.")?.id).toBe(
      "voice.phonics.says-j",
    );
    expect(narrationClipForText("Letter T says tuh. Taxi. Toast. Token.")?.id).toBe(
      "voice.phonics.says-t",
    );
    expect(narrationClipForText("Letter Z says zzz. Zip. Zigzag. Zoo.")?.id).toBe(
      "voice.phonics.says-z",
    );
    expect(narrationClipForText("Letter U says uh. Umbrella. Up. Under.")?.id).toBe(
      "voice.phonics.says-u",
    );
    expect(narrationClipForText("K in King.")?.id).toBe("voice.phonics.in-k-king");
    expect(narrationClipForText("A-G says ag. bag, tag, wag.")?.id).toBe(
      "voice.phonics.family-ag",
    );
    expect(narrationClipForText("U-G says ug. bug, hug, mug.")?.id).toBe(
      "voice.phonics.family-ug",
    );
    expect(narrationClipForText("U-T says ut. nut, cut, hut.")?.id).toBe(
      "voice.phonics.family-ut",
    );
    expect(narrationClipForText("cat. /at/.")?.id).toBe("voice.phonics.family-cat");
    expect(narrationClipForText("hat. /at/.")?.id).toBe("voice.phonics.family-hat");
    expect(narrationClipForText("bag. /ag/.")?.id).toBe("voice.phonics.family-bag");
    expect(narrationClipForText("tag. /ag/.")?.id).toBe("voice.phonics.family-tag");
    expect(narrationClipForText("ten. /en/.")?.id).toBe("voice.phonics.family-ten");
    expect(narrationClipForText("red. /ed/.")?.id).toBe("voice.phonics.family-red");
    expect(narrationClipForText("fed. /ed/.")?.id).toBe("voice.phonics.family-fed");
    expect(narrationClipForText("pin. /in/.")?.id).toBe("voice.phonics.family-pin");
    expect(narrationClipForText("dip. /ip/.")?.id).toBe("voice.phonics.family-dip");
    expect(narrationClipForText("hop. /op/.")?.id).toBe("voice.phonics.family-hop");
    expect(narrationClipForText("dog. /og/.")?.id).toBe("voice.phonics.family-dog");
    expect(narrationClipForText("bug. /ug/.")?.id).toBe("voice.phonics.family-bug");
    expect(narrationClipForText("hug. /ug/.")?.id).toBe("voice.phonics.family-hug");
    expect(narrationClipForText("hut. /ut/.")?.id).toBe("voice.phonics.family-hut");
    expect(narrationClipForText("Ruby Red")?.id).toBe("voice.color.drop-ruby-red");
    expect(narrationClipForText("Sunny Yellow")?.id).toBe("voice.color.drop-sunny-yellow");
    expect(
      narrationClipForText(
        "Welcome to Color Magic! Tap two primary color droplets to blend a magical new color!",
      )?.id,
    ).toBe("voice.color.magic-welcome");
    expect(narrationClipForText("1")?.id).toBe("voice.count.tap-1");
    expect(narrationClipForText("2")?.id).toBe("voice.count.tap-2");
    expect(narrationClipForText("5")?.id).toBe("voice.count.tap-5");
    expect(narrationClipForText("6")?.id).toBe("voice.count.tap-6");
    expect(narrationClipForText("10")?.id).toBe("voice.count.tap-10");
    expect(narrationClipForText("15")?.id).toBe("voice.count.tap-15");
    expect(narrationClipForText("16")?.id).toBe("voice.count.tap-16");
    expect(narrationClipForText("20")?.id).toBe("voice.count.tap-20");
    expect(narrationClipForText("1.")?.id).toBe("voice.count.peek-1");
    expect(narrationClipForText("5.")?.id).toBe("voice.count.peek-5");
    expect(narrationClipForText("6.")?.id).toBe("voice.count.peek-6");
    expect(narrationClipForText("15.")?.id).toBe("voice.count.peek-15");
    expect(
      narrationClipForText("Welcome to Balloon Sky! Can you find and pop balloon A?")?.id,
    ).toBe("voice.nav.balloon-a");
    expect(
      narrationClipForText("Welcome to Balloon Sky! Can you find and pop balloon T?")?.id,
    ).toBe("voice.nav.balloon-t");
    expect(
      narrationClipForText("Welcome to Balloon Sky! Can you find and pop balloon M?")?.id,
    ).toBe("voice.nav.balloon-m");
    expect(
      narrationClipForText("Welcome to Balloon Sky! Can you find and pop balloon 1?")?.id,
    ).toBe("voice.nav.balloon-1");
    expect(narrationClipForText("1!")?.id).toBe("voice.count.cheer-1");
    expect(narrationClipForText("5!")?.id).toBe("voice.count.cheer-5");
    expect(narrationClipForText("10!")?.id).toBe("voice.count.cheer-10");
    expect(narrationClipForText("14!")?.id).toBe("voice.count.cheer-14");
    expect(narrationClipForText("20!")?.id).toBe("voice.count.cheer-20");
    expect(narrationClipForText("A")?.id).toBe("voice.nav.pop-a");
    expect(narrationClipForText("E")?.id).toBe("voice.nav.pop-e");
    expect(narrationClipForText("M")?.id).toBe("voice.nav.pop-m");
    expect(narrationClipForText("K")?.id).toBe("voice.nav.pop-k");
    expect(narrationClipForText("L")?.id).toBe("voice.nav.pop-l");
    expect(narrationClipForText("X")?.id).toBe("voice.nav.pop-x");
    expect(narrationClipForText("Y")?.id).toBe("voice.nav.pop-y");
    expect(narrationClipForText("Z")?.id).toBe("voice.nav.pop-z");
    expect(narrationClipForText("In.")?.id).toBe("voice.focus.body-in");
    expect(
      narrationClipForText(
        "Welcome to Dino Excavation Cave. Hold and brush. Sand hides five real fossils.",
      )?.id,
    ).toBe("voice.nav.zone-dino");
    expect(
      narrationClipForText("The Starlight Sky Observatory is locked! You need 20 stars.")?.id,
    ).toBe("voice.nav.zone-starlight-locked");
    expect(
      narrationClipForText("You found the Royal Pearl in the rainbow clam!")?.id,
    ).toBe("voice.nav.zone-coral-found");
    expect(narrationClipForText("The golden Triceratops horn!")?.id).toBe(
      "voice.nav.zone-fossil-horn",
    );
    expect(narrationClipForText("The royal rainbow pearl!")?.id).toBe(
      "voice.nav.zone-clam-royal",
    );
    expect(narrationClipForText("Yes. That is star 6 of Little Bear.")?.id).toBe(
      "voice.nav.zone-star-6",
    );
    expect(narrationClipForText("Quiet house. Sweet sleep.")?.id).toBe(
      "voice.ui.rooms-quiet-house",
    );
    expect(narrationClipForText("Hold. Clap with the seal.")?.id).toBe(
      "voice.ui.rooms-clap-seal",
    );
    expect(narrationClipForText("Once upon a time, a den light came on.")?.id).toBe(
      "voice.ui.rooms-den-light",
    );
    expect(narrationClipForText("The end. The den kept watch until morning.")?.id).toBe(
      "voice.ui.rooms-den-end",
    );
    expect(
      narrationClipForText("Let's play: Star Constellation Count! Count the shiny twinkling stars")?.id,
    ).toBe("voice.nav.mission-sun-1");
    expect(
      narrationClipForText("Let's play: Goodnight Little Bear! Read the peaceful bedtime story")?.id,
    ).toBe("voice.nav.mission-sun-3");
    expect(
      narrationClipForText(
        "Let's play: Colors & Shapes Parade! Find red circles and blue squares",
      )?.id,
    ).toBe("voice.nav.mission-wed-2");
    expect(
      narrationClipForText(
        "Let's play: Feed Benny Bunny! Count carrots — 5, then 8, then 10",
      )?.id,
    ).toBe("voice.nav.mission-fri-1");
    expect(
      narrationClipForText(
        "Let's play: Style Your Learning Buddy! Put on astronaut helmets or capes!",
      )?.id,
    ).toBe("voice.nav.mission-sat-3");
    expect(narrationClipForText("Clap clap clap!")?.id).toBe("voice.ui.rooms-clap-done");
    expect(narrationClipForText("Hoo hoo hoo.")?.id).toBe("voice.ui.rooms-hoot-done");
    expect(narrationClipForText("Yes! Lions roar on the sunny savanna!")?.id).toBe(
      "voice.sort.yes-lion",
    );
    expect(narrationClipForText("Yes! Apple goes in the fruit basket!")?.id).toBe(
      "voice.sort.yes-apple",
    );
    expect(narrationClipForText("Yes! The mitt keeps hands safe!")?.id).toBe("voice.sort.yes-mitt");
    expect(narrationClipForText("Yes! Grapes grow in a bunch!")?.id).toBe("voice.sort.yes-grape");
    expect(narrationClipForText("Yes! The train follows the rails!")?.id).toBe(
      "voice.sort.yes-train",
    );
    expect(narrationClipForText("Yes! Clouds float in the sky!")?.id).toBe("voice.sort.yes-cloud");
    expect(narrationClipForText("Yes! The hen pecks warm hay!")?.id).toBe("voice.sort.yes-hen");
    expect(narrationClipForText("Yes! The whale sings under the ice!")?.id).toBe(
      "voice.sort.yes-ice-whale",
    );
    expect(narrationClipForText("Yes! Owls hoot after dark!")?.id).toBe("voice.sort.yes-owl");
    expect(narrationClipForText("Yes! Teddy waits for bedtime!")?.id).toBe("voice.sort.yes-teddy");
    expect(narrationClipForText("Yes! Bee is a busy bug!")?.id).toBe("voice.sort.yes-busy-bee");
    expect(narrationClipForText("Yes! Ant marches with the bugs!")?.id).toBe("voice.sort.yes-ant");
    expect(narrationClipForText("Yes! Blossom is a garden flower!")?.id).toBe(
      "voice.sort.yes-blossom",
    );
    expect(narrationClipForText("Yes! Cow lives in the pasture!")?.id).toBe(
      "voice.sort.yes-pasture-cow",
    );
    expect(narrationClipForText("Yes! Snakes slide the jungle branch!")?.id).toBe(
      "voice.sort.yes-snake",
    );
    expect(narrationClipForText("Yes! Horses live in the barn!")?.id).toBe(
      "voice.sort.yes-barn-horse",
    );
    expect(narrationClipForText("Yes! Coins pay at the stall!")?.id).toBe("voice.sort.yes-coin");
    expect(narrationClipForText("Yes! Cheese sits on the stall!")?.id).toBe("voice.sort.yes-cheese");
    expect(narrationClipForText("Yes! Guitar strings sing!")?.id).toBe("voice.sort.yes-guitar");
    expect(narrationClipForText("Yes! The flute sings a note!")?.id).toBe("voice.sort.yes-flute");
    expect(narrationClipForText("Yes! Eggs wait in the barn nest!")?.id).toBe("voice.sort.yes-egg");
    expect(narrationClipForText("Yes! Sheep live in the real field!")?.id).toBe(
      "voice.sort.yes-real-sheep",
    );
    expect(narrationClipForText("Yes! Pillows wait on the bed!")?.id).toBe("voice.sort.yes-pillow");
    expect(narrationClipForText("Yes! Brush circles on teeth!")?.id).toBe(
      "voice.sort.yes-tooth-brush",
    );
    expect(narrationClipForText("Yes! Night stories belong at rest!")?.id).toBe(
      "voice.sort.yes-night-story",
    );
    expect(narrationClipForText("Yes! Pines stand on the trail!")?.id).toBe("voice.sort.yes-pine");
    expect(narrationClipForText("Yes! The chest holds treasure!")?.id).toBe("voice.sort.yes-chest");
    expect(narrationClipForText("Yes! A is a letter!")?.id).toBe("voice.sort.yes-letter-a");
    expect(narrationClipForText("Yes! Eight is a number!")?.id).toBe("voice.sort.yes-num-eight");
    expect(narrationClipForText("Yes! B is a letter!")?.id).toBe("voice.sort.yes-letter-b");
    expect(
      narrationClipForText("Oops! Lion belongs in Land Animals! Let's try putting it there!")?.id,
    ).toBe("voice.sort.oops-lion");
    expect(
      narrationClipForText("Oops! Cow belongs in Land Animals! Let's try putting it there!")?.id,
    ).toBe("voice.sort.oops-cow");
    expect(
      narrationClipForText(
        "Oops! Measuring Cup belongs in Kitchen Tools! Let's try putting it there!",
      )?.id,
    ).toBe("voice.sort.oops-measuring-cup");
    expect(
      narrationClipForText("Oops! Grapes belongs in Fruit Basket! Let's try putting it there!")?.id,
    ).toBe("voice.sort.oops-grapes");
    expect(
      narrationClipForText("Oops! Bike belongs in Street! Let's try putting it there!")?.id,
    ).toBe("voice.sort.oops-bike");
    expect(
      narrationClipForText("Oops! Scooter belongs in Street! Let's try putting it there!")?.id,
    ).toBe("voice.sort.oops-scooter");
    expect(
      narrationClipForText("Oops! Penguin belongs in On the Ice! Let's try putting it there!")?.id,
    ).toBe("voice.sort.oops-penguin");
    expect(
      narrationClipForText("Oops! Chick belongs in Warm Grass! Let's try putting it there!")?.id,
    ).toBe("voice.sort.oops-chick");
    expect(
      narrationClipForText("Oops! Moon belongs in Night! Let's try putting it there!")?.id,
    ).toBe("voice.sort.oops-moon");
    expect(
      narrationClipForText("Oops! Kite belongs in Daytime! Let's try putting it there!")?.id,
    ).toBe("voice.sort.oops-kite-day");
    expect(
      narrationClipForText("Oops! Night teddy belongs in Night! Let's try putting it there!")?.id,
    ).toBe("voice.sort.oops-teddy");
    expect(
      narrationClipForText("Oops! Bee belongs in Bugs! Let's try putting it there!")?.id,
    ).toBe("voice.sort.oops-busy-bee");
    expect(
      narrationClipForText("Oops! Daisy belongs in Flowers! Let's try putting it there!")?.id,
    ).toBe("voice.sort.oops-daisy");
    expect(
      narrationClipForText("Oops! Cricket belongs in Bugs! Let's try putting it there!")?.id,
    ).toBe("voice.sort.oops-cricket");
    expect(
      narrationClipForText("Oops! Leaf Frog belongs in Jungle! Let's try putting it there!")?.id,
    ).toBe("voice.sort.oops-frog");
    expect(
      narrationClipForText("Oops! Goat belongs in Farm! Let's try putting it there!")?.id,
    ).toBe("voice.sort.oops-goat");
    expect(
      narrationClipForText("Oops! Tomato belongs in Market! Let's try putting it there!")?.id,
    ).toBe("voice.sort.oops-tomato");
    expect(
      narrationClipForText("Oops! Park bird belongs in Park! Let's try putting it there!")?.id,
    ).toBe("voice.sort.oops-bird");
    expect(
      narrationClipForText("Oops! Note belongs in Music! Let's try putting it there!")?.id,
    ).toBe("voice.sort.oops-note");
    expect(
      narrationClipForText("Oops! Crayon belongs in Paint! Let's try putting it there!")?.id,
    ).toBe("voice.sort.oops-crayon");
    expect(
      narrationClipForText("Oops! Hen belongs in Barn! Let's try putting it there!")?.id,
    ).toBe("voice.sort.oops-real-hen");
    expect(
      narrationClipForText("Oops! Dragon belongs in Tale! Let's try putting it there!")?.id,
    ).toBe("voice.sort.oops-dragon");
    expect(
      narrationClipForText("Oops! Sheep belongs in Barn! Let's try putting it there!")?.id,
    ).toBe("voice.sort.oops-real-sheep");
    expect(
      narrationClipForText("Oops! Soap belongs in Wash! Let's try putting it there!")?.id,
    ).toBe("voice.sort.oops-soap");
    expect(
      narrationClipForText("Oops! Quilt belongs in Rest! Let's try putting it there!")?.id,
    ).toBe("voice.sort.oops-quilt");
    expect(
      narrationClipForText("Oops! Comb belongs in Wash! Let's try putting it there!")?.id,
    ).toBe("voice.sort.oops-comb");
    expect(
      narrationClipForText("Oops! Key belongs in Treasure! Let's try putting it there!")?.id,
    ).toBe("voice.sort.oops-key");
    expect(
      narrationClipForText("Oops! Trail rock belongs in Forest! Let's try putting it there!")?.id,
    ).toBe("voice.sort.oops-rock");
    expect(
      narrationClipForText("Oops! A belongs in Letters! Let's try putting it there!")?.id,
    ).toBe("voice.sort.oops-letter-a");
    expect(
      narrationClipForText("Oops! Six belongs in Numbers! Let's try putting it there!")?.id,
    ).toBe("voice.sort.oops-num-six");
    expect(
      narrationClipForText("Oops! P belongs in Letters! Let's try putting it there!")?.id,
    ).toBe("voice.sort.oops-letter-p");
    expect(
      narrationClipForText("Oops! Two belongs in Numbers! Let's try putting it there!")?.id,
    ).toBe("voice.sort.oops-num-two");
    expect(
      narrationClipForText("Yes! Cows graze in green grassy fields!")?.id,
    ).toBe("voice.sort.yes-cow-graze");
    expect(
      narrationClipForText("Yes! Warm fluffy scarf keeps our neck cozy!")?.id,
    ).toBe("voice.sort.yes-wool-scarf");
    expect(
      narrationClipForText("Yes! Ready for splashing in the summer pool!")?.id,
    ).toBe("voice.sort.yes-swimsuit");
    expect(
      narrationClipForText("Yes! The moon shines when we go to sleep!")?.id,
    ).toBe("voice.sort.yes-glowing-moon");
    expect(
      narrationClipForText("Yes! Kites dance in the sunny breeze!")?.id,
    ).toBe("voice.sort.yes-kite-breeze");
    expect(
      narrationClipForText("Oops! Donut belongs in Sweet Treats! Let's try putting it there!")?.id,
    ).toBe("voice.sort.oops-donut");
    expect(
      narrationClipForText("Oops! Sunglasses belongs in Sunny Summer! Let's try putting it there!")?.id,
    ).toBe("voice.sort.oops-sunglasses");
    expect(
      narrationClipForText("Oops! Winter Mittens belongs in Cozy Winter! Let's try putting it there!")?.id,
    ).toBe("voice.sort.oops-mittens");
    expect(
      narrationClipForText("Oops! Airplane belongs in Sky Flyers! Let's try putting it there!")?.id,
    ).toBe("voice.sort.oops-airplane");
    expect(
      narrationClipForText("Oops! Twinkling Star belongs in Nighttime Sky! Let's try putting it there!")?.id,
    ).toBe("voice.sort.oops-twinkling-star");
    expect(
      narrationClipForText("Oops! Night Owl belongs in Nighttime Sky! Let's try putting it there!")?.id,
    ).toBe("voice.sort.oops-night-owl");
    expect(narrationClipForText("cat")?.id).toBe("voice.phonics.tap-cat");
    expect(narrationClipForText("Come")?.id).toBe("voice.phonics.tap-come");
    expect(narrationClipForText("Nana")?.id).toBe("voice.phonics.tap-nana");
    expect(narrationClipForText("on")?.id).toBe("voice.phonics.tap-on");
    expect(narrationClipForText("Pat")?.id).toBe("voice.phonics.tap-pat");
    expect(narrationClipForText("stoop")?.id).toBe("voice.phonics.tap-stoop");
    expect(narrationClipForText("Teddy")?.id).toBe("voice.phonics.tap-teddy");
    expect(narrationClipForText("The")?.id).toBe("voice.phonics.tap-the-cap");
    expect(narrationClipForText("the")?.id).toBe("voice.phonics.tap-the");
    expect(narrationClipForText("We")?.id).toBe("voice.phonics.tap-we");
    expect(narrationClipForText("16.")?.id).toBe("voice.count.peek-16");
    expect(narrationClipForText("20.")?.id).toBe("voice.count.peek-20");
    expect(
      narrationClipForText(
        "Welcome to Cosmic Astronomy! Tap any planet to explore its orbit, atmosphere, and space secrets!",
      )?.id,
    ).toBe("voice.primary.welcome-solar");
    expect(
      narrationClipForText(
        "Welcome to Tangram Geometry! Combine shapes and rotate polygons to architect geometric creations!",
      )?.id,
    ).toBe("voice.primary.welcome-tangram");
    expect(
      narrationClipForText("Congratulations! You completed the Cosmic Astronomy Challenge!")?.id,
    ).toBe("voice.primary.solar-congrats");
    expect(
      narrationClipForText(
        "Earth! The Blue Oasis. Earth is our home planet and the only world in the solar system with liquid oceans, breathable air, and life!",
      )?.id,
    ).toBe("voice.primary.planet-earth");
    expect(
      narrationClipForText(
        "Excellent! That is correct! Saturn has seven main rings made of billions of glistening chunks of ice and rock!",
      )?.id,
    ).toBe("voice.primary.quiz-yes-saturn");
    expect(
      narrationClipForText(
        "Excellent! That is correct! Earth sits in the habitable Goldilocks Zone, where temperatures allow stable liquid water oceans and thriving life!",
      )?.id,
    ).toBe("voice.primary.quiz-yes-earth");
    expect(
      narrationClipForText(
        "Good try! The correct answer is Saturn. Saturn has seven main rings made of billions of glistening chunks of ice and rock!",
      )?.id,
    ).toBe("voice.primary.quiz-oops-saturn");
    expect(
      narrationClipForText(
        "Good try! The correct answer is Earth. Earth sits in the habitable Goldilocks Zone, where temperatures allow stable liquid water oceans and thriving life!",
      )?.id,
    ).toBe("voice.primary.quiz-oops-earth");
    expect(narrationClipForText("Correct! PLANET!")?.id).toBe("voice.primary.word-yes-planet");
    expect(
      narrationClipForText("Hooray! You built Five Sixths (5/6)! Excellent fraction mastery!")?.id,
    ).toBe("voice.primary.frac-yes-five-sixths");
    expect(
      narrationClipForText("Magnificent architecture! You assembled the Ocean Breeze Sailboat!")?.id,
    ).toBe("voice.primary.arch-sailboat");
    expect(
      narrationClipForText("New Challenge! Can you build One Half (1/2)? Adjust the slices!")?.id,
    ).toBe("voice.primary.frac-new-half");
    expect(
      narrationClipForText("Challenge mode active! Can you build Seven Tenths (7/10)?")?.id,
    ).toBe("voice.primary.frac-mode-seven-tenths");
    expect(
      narrationClipForText("Challenge mode active! Can you build Five Sixths (5/6)?")?.id,
    ).toBe("voice.primary.frac-mode-five-sixths");
    expect(narrationClipForText("Correct! FOSSIL!")?.id).toBe("voice.primary.word-yes-fossil");
    expect(narrationClipForText("Correct! ROBOT!")?.id).toBe("voice.primary.word-yes-robot");
    expect(narrationClipForText("Correct! ECOSYSTEM!")?.id).toBe("voice.primary.word-yes-ecosystem");
    expect(
      narrationClipForText("That slot needs a Square! Try selecting that shape.")?.id,
    ).toBe("voice.primary.slot-square");
    expect(
      narrationClipForText("Magnificent architecture! You assembled the Royal Stellar Crown!")?.id,
    ).toBe("voice.primary.arch-crown");
    expect(
      narrationClipForText("Awesome work! One more task completed!")?.id,
    ).toBe("voice.primary.hw-task-done");
    expect(
      narrationClipForText("Great job! Your assignment has been turned in to your teacher!")?.id,
    ).toBe("voice.primary.hw-turned-in");
    expect(
      narrationClipForText("Red plus Yellow creates sparkling sweet Orange!")?.id,
    ).toBe("voice.color.mix-red-yellow");
    expect(
      narrationClipForText("Blue plus Red creates deep royal Purple!")?.id,
    ).toBe("voice.color.mix-blue-red");
    expect(
      narrationClipForText("Two Ruby Reds! Pick a different color to mix magic!")?.id,
    ).toBe("voice.color.two-ruby-red");
    expect(
      narrationClipForText(
        "Let's play Baa Baa Black Sheep! Tap the glowing rainbow keys!",
      )?.id,
    ).toBe("voice.piano.play-baa");
    expect(
      narrationClipForText(
        "Let's play Jingle Bells Melody! Tap the glowing rainbow keys!",
      )?.id,
    ).toBe("voice.piano.play-jingle");
    expect(
      narrationClipForText(
        "Bravo! You played Jingle Bells Melody! What a wonderful musician!",
      )?.id,
    ).toBe("voice.piano.bravo-jingle");
    expect(
      narrationClipForText(
        "Trace the letter R. Start on the blue dot. One line. R says /r/! Rocket!",
      )?.id,
    ).toBe("voice.trace.rocket");
    expect(narrationClipForText("Yes! D!")?.id).toBe("voice.trace.yes-d");
    expect(
      narrationClipForText(
        "Trace the letter E. Start on the blue dot. One line. E!",
      )?.id,
    ).toBe("voice.trace.e");
    expect(narrationClipForText("Yes! I!")?.id).toBe("voice.trace.yes-i");
    expect(
      narrationClipForText(
        "Trace the letter J. Start on the blue dot. One line. J!",
      )?.id,
    ).toBe("voice.trace.j");
    expect(narrationClipForText("Yes! O!")?.id).toBe("voice.trace.yes-o");
    expect(
      narrationClipForText(
        "Trace the letter P. Start on the blue dot. One line. P!",
      )?.id,
    ).toBe("voice.trace.p");
    expect(narrationClipForText("Yes! U!")?.id).toBe("voice.trace.yes-u");
    expect(
      narrationClipForText(
        "Trace the letter V. Start on the blue dot. One line. V!",
      )?.id,
    ).toBe("voice.trace.v");
    expect(narrationClipForText("Yes! Z!")?.id).toBe("voice.trace.yes-z");
    expect(
      narrationClipForText(
        "Trace the letter A. Start on the blue dot. One line. A says /æ/! Apple!",
      )?.id,
    ).toBe("voice.trace.apple");
    expect(narrationClipForText("Yes! B says /b/! Bus!")?.id).toBe(
      "voice.trace.yes-bus",
    );
    expect(
      narrationClipForText("Line 2 of 2. Start on the blue dot.")?.id,
    ).toBe("voice.trace.line-2-of-2");
    expect(
      narrationClipForText("Line 4 of 4. Start on the blue dot.")?.id,
    ).toBe("voice.trace.line-4-of-4");
    expect(narrationClipForText("Yes! B says /b/! Bear!")?.id).toBe(
      "voice.trace.yes-bear",
    );
    expect(
      narrationClipForText(
        "Trace the letter T. Start on the blue dot. One line. T says /t/! Tiger!",
      )?.id,
    ).toBe("voice.trace.tiger");
    expect(narrationClipForText("Yes! N says /n/! Nest!")?.id).toBe(
      "voice.trace.yes-nest",
    );
    expect(
      narrationClipForText(
        "Trace the letter R. Start on the blue dot. One line. R says /r/! Rain!",
      )?.id,
    ).toBe("voice.trace.rain");
    expect(narrationClipForText("Yes! P says /p/! Pear!")?.id).toBe(
      "voice.trace.yes-pear",
    );
    expect(
      narrationClipForText(
        "Trace the letter C. Start on the blue dot. One line. C says /k/! Corn!",
      )?.id,
    ).toBe("voice.trace.corn");
    expect(narrationClipForText("Yes! K says /k/! Kettle!")?.id).toBe(
      "voice.trace.yes-kettle",
    );
    expect(
      narrationClipForText(
        "Trace the letter F. Start on the blue dot. One line. F says /f/! Flour!",
      )?.id,
    ).toBe("voice.trace.flour");
    expect(narrationClipForText("Yes! T says /t/! Train!")?.id).toBe(
      "voice.trace.yes-train",
    );
    expect(
      narrationClipForText(
        "Trace the letter V. Start on the blue dot. One line. V says /v/! Van!",
      )?.id,
    ).toBe("voice.trace.van");
    expect(narrationClipForText("Yes! H says /h/! Horn!")?.id).toBe(
      "voice.trace.yes-horn",
    );
    expect(
      narrationClipForText(
        "Trace the letter W. Start on the blue dot. One line. W says /w/! Wheel!",
      )?.id,
    ).toBe("voice.trace.wheel");
    expect(narrationClipForText("Yes! P says /p/! Penguin!")?.id).toBe(
      "voice.trace.yes-penguin",
    );
    expect(
      narrationClipForText(
        "Trace the letter S. Start on the blue dot. One line. S says /s/! Seal!",
      )?.id,
    ).toBe("voice.trace.seal");
    expect(narrationClipForText("Yes! O says /o/! Owl!")?.id).toBe(
      "voice.trace.yes-owl",
    );
    expect(
      narrationClipForText(
        "Trace the letter C. Start on the blue dot. One line. C says /k/! Cold!",
      )?.id,
    ).toBe("voice.trace.cold");
    expect(narrationClipForText("Yes! S says /s/! Star!")?.id).toBe(
      "voice.trace.yes-star",
    );
    expect(
      narrationClipForText(
        "Trace the letter L. Start on the blue dot. One line. L says /l/! Lamp!",
      )?.id,
    ).toBe("voice.trace.lamp");
    expect(narrationClipForText("Yes! H says /h/! Hush!")?.id).toBe(
      "voice.trace.yes-hush",
    );
    expect(
      narrationClipForText(
        "Trace the letter D. Start on the blue dot. One line. D says /d/! Dream!",
      )?.id,
    ).toBe("voice.trace.dream");
    expect(narrationClipForText("Yes! H says /h/! Horse!")?.id).toBe(
      "voice.trace.yes-horse",
    );
    expect(
      narrationClipForText(
        "Trace the letter D. Start on the blue dot. One line. D says /d/! Duck!",
      )?.id,
    ).toBe("voice.trace.duck");
    expect(narrationClipForText("Yes! F says /f/! Frog!")?.id).toBe(
      "voice.trace.yes-frog",
    );
    expect(
      narrationClipForText(
        "Trace the letter G. Start on the blue dot. One line. G says /g/! Goat!",
      )?.id,
    ).toBe("voice.trace.goat");
    expect(narrationClipForText("Yes! Tiptoe time!")?.id).toBe(
      "voice.trace.yes-quiet",
    );
    expect(
      narrationClipForText(
        "Trace the letter B. Start on the blue dot. One line. B says /b/! Bee!",
      )?.id,
    ).toBe("voice.trace.bee");
    expect(narrationClipForText("Yes! S says /s/! Snail!")?.id).toBe(
      "voice.trace.yes-snail",
    );
    expect(
      narrationClipForText(
        "Trace the letter C. Start on the blue dot. One line. C says /k/! Caterpillar!",
      )?.id,
    ).toBe("voice.trace.caterpillar");
    expect(narrationClipForText("Yes! D says /d/! Dew!")?.id).toBe(
      "voice.trace.yes-dew",
    );
    expect(
      narrationClipForText(
        "Trace the letter H. Start on the blue dot. One line. H says /h/! Hive!",
      )?.id,
    ).toBe("voice.trace.hive");
    expect(narrationClipForText("Yes! M says /m/! Market!")?.id).toBe(
      "voice.trace.yes-market",
    );
    expect(
      narrationClipForText(
        "Trace the letter S. Start on the blue dot. One line. S says /s/! Shop!",
      )?.id,
    ).toBe("voice.trace.shop");
    expect(narrationClipForText("Yes! N says /n/! News!")?.id).toBe(
      "voice.trace.yes-news",
    );
    expect(
      narrationClipForText(
        "Trace the letter P. Start on the blue dot. One line. P says /p/! Paint!",
      )?.id,
    ).toBe("voice.trace.paint");
    expect(narrationClipForText("Yes! H says /h/! Heart!")?.id).toBe(
      "voice.trace.yes-heart",
    );
    expect(
      narrationClipForText(
        "Trace the letter D. Start on the blue dot. One line. D says /d/! Drum!",
      )?.id,
    ).toBe("voice.trace.drum");
    expect(narrationClipForText("Yes! R says /r/! Red!")?.id).toBe(
      "voice.trace.yes-red",
    );
    expect(
      narrationClipForText(
        "Trace the letter E. Start on the blue dot. One line. E says /iː/! Easel!",
      )?.id,
    ).toBe("voice.trace.easel");
    expect(narrationClipForText("Yes! S says /s/! Story!")?.id).toBe(
      "voice.trace.yes-story",
    );
    expect(
      narrationClipForText(
        "Trace the letter H. Start on the blue dot. One line. H says /h/! Hen!",
      )?.id,
    ).toBe("voice.trace.hen");
    expect(narrationClipForText("Yes! R says /r/! Read!")?.id).toBe(
      "voice.trace.yes-read",
    );
    expect(
      narrationClipForText(
        "Trace the letter G. Start on the blue dot. One line. G says /g/! Dragon!",
      )?.id,
    ).toBe("voice.trace.dragon");
    expect(narrationClipForText("Yes! B says /b/! Brush!")?.id).toBe(
      "voice.trace.yes-brush",
    );
    expect(
      narrationClipForText(
        "Trace the letter S. Start on the blue dot. One line. S says /s/! Smile!",
      )?.id,
    ).toBe("voice.trace.smile");
    expect(narrationClipForText("Yes! C says /k/! Cup!")?.id).toBe(
      "voice.trace.yes-cup",
    );
    expect(
      narrationClipForText(
        "Trace the letter L. Start on the blue dot. One line. L says /l/! Love!",
      )?.id,
    ).toBe("voice.trace.love");
    expect(narrationClipForText("Yes! N says /n/! Nap!")?.id).toBe(
      "voice.trace.yes-nap",
    );
    expect(
      narrationClipForText(
        "Trace the letter M. Start on the blue dot. One line. M says /m/! Map!",
      )?.id,
    ).toBe("voice.trace.map");
    expect(narrationClipForText("Yes! C says /k/! Cave!")?.id).toBe(
      "voice.trace.yes-cave",
    );
    expect(
      narrationClipForText(
        "Trace the letter F. Start on the blue dot. One line. F says /f/! Forest!",
      )?.id,
    ).toBe("voice.trace.forest");
    expect(narrationClipForText("Yes! K says /k/! Key!")?.id).toBe(
      "voice.trace.yes-key",
    );
    expect(
      narrationClipForText(
        "Trace the letter D. Start on the blue dot. One line. D says /d/! Dot!",
      )?.id,
    ).toBe("voice.trace.dot");
    expect(narrationClipForText("Yes! N says /n/! Nine!")?.id).toBe(
      "voice.trace.yes-nine",
    );
    expect(
      narrationClipForText(
        "Trace the letter 6. Start on the blue dot. One line. Six is a number we can count!",
      )?.id,
    ).toBe("voice.trace.six");
    expect(narrationClipForText("Yes! Ten fills a ten-frame!")?.id).toBe(
      "voice.trace.yes-ten",
    );
  });

  it("maps letter A explore bio to A says a like apple", () => {
    const bio = safariFriendBioText({
      call: "A says a like apple!",
      funFact: "A is the first letter of the alphabet.",
    });
    expect(narrationClipForText(bio)?.id).toBe("voice.safari.bio.ay");
  });

  it("maps Nana soup area tap using a real apostrophe, not a unicode escape", () => {
    expect(
      narrationClipForText(
        "Nana’s Soup Pot! Steam, spoons and a bubbling lid. Let's explore together!",
      )?.id,
    ).toBe("voice.soup.area-welcome");
    for (const asset of AUDIO_ASSETS) {
      if (asset.channel !== "voice" || !asset.promptText) continue;
      expect(asset.promptText.includes("\\u")).toBe(false);
    }
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
