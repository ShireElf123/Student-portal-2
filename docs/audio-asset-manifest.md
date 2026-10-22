# Toddler audio asset manifest (Safari kits)

**Animal Safari** (the in-app Safari section — Games tab plus each world’s Safari station) uses **one owner-selected Arena voice** (`voice-01`): explore welcome, per-station Worlds welcomes, detective stem, explore bios, and mouth-performed calls. Worlds does not also fire the device narrator on Safari stations. Chat still cannot play or receive MP3s — hear them in the app after a Vercel push. If a file 404s, duck/cow/bird fall back to short Web Audio cartoon calls; other friends stay quiet (no device narrator inside Safari).

Do **not** claim phone playback is verified until the owner listens on a device.

No runtime ElevenLabs (or other TTS) calls. No API keys in the client or this repository.

## Expected filenames

| Path | Clip id |
|---|---|
| `public/audio/voice/narrator-safari-explore-welcome.mp3` | `voice.narrator.safari-explore-welcome` |
| `public/audio/voice/narrator-safari-detective-stem.mp3` | `voice.narrator.safari-detective-stem` |
| `public/audio/voice/safari-welcome-pasture.mp3` | `voice.safari.welcome.pasture` |
| `public/audio/voice/safari-welcome-flower-bed.mp3` | `voice.safari.welcome.flower-bed` |
| `public/audio/voice/safari-welcome-barnyard-tale.mp3` | `voice.safari.welcome.barnyard-tale` |
| `public/audio/voice/safari-welcome-pond.mp3` | `voice.safari.welcome.pond` |
| `public/audio/voice/safari-welcome-night-walk.mp3` | `voice.safari.welcome.night-walk` |
| `public/audio/voice/safari-welcome-park.mp3` | `voice.safari.welcome.park` |
| `public/audio/voice/safari-welcome-ice-floe.mp3` | `voice.safari.welcome.ice-floe` |
| `public/audio/voice/safari-welcome-owl-wood.mp3` | `voice.safari.welcome.owl-wood` |
| `public/audio/voice/farm-area-welcome.mp3` | `voice.farm.area-welcome` |
| `public/audio/voice/farm-milk-station.mp3` | `voice.farm.milk-station` |
| `public/audio/voice/farm-milk-line.mp3` | `voice.farm.milk-line` |
| `public/audio/voice/farm-milk-done.mp3` | `voice.farm.milk-done` |
| `public/audio/voice/farm-letter-trace.mp3` | `voice.farm.letter-trace` |
| `public/audio/voice/farm-pen-count.mp3` | `voice.farm.pen-count` |
| `public/audio/voice/farm-quiz-cow.mp3` | `voice.farm.quiz-cow` |
| `public/audio/voice/farm-quiz-kitten.mp3` | `voice.farm.quiz-kitten` |
| `public/audio/voice/farm-quiz-chicks.mp3` | `voice.farm.quiz-chicks` |
| `public/audio/voice/farm-quiz-horse.mp3` | `voice.farm.quiz-horse` |
| `public/audio/voice/farm-fb-pig.mp3` | `voice.farm.fb.pig` |
| `public/audio/voice/farm-fb-cow.mp3` | `voice.farm.fb.cow` |
| `public/audio/voice/farm-fb-sheep.mp3` | `voice.farm.fb.sheep` |
| `public/audio/voice/farm-fb-rooster.mp3` | `voice.farm.fb.rooster` |
| `public/audio/voice/farm-fb-puppy.mp3` | `voice.farm.fb.puppy` |
| `public/audio/voice/farm-fb-kitten.mp3` | `voice.farm.fb.kitten` |
| `public/audio/voice/farm-fb-duckling.mp3` | `voice.farm.fb.duckling` |
| `public/audio/voice/farm-fb-piglet.mp3` | `voice.farm.fb.piglet` |
| `public/audio/voice/farm-fb-chicks-low.mp3` | `voice.farm.fb.chicks-low` |
| `public/audio/voice/farm-fb-chicks-yes.mp3` | `voice.farm.fb.chicks-yes` |
| `public/audio/voice/farm-fb-chicks-together.mp3` | `voice.farm.fb.chicks-together` |
| `public/audio/voice/farm-fb-carrot.mp3` | `voice.farm.fb.carrot` |
| `public/audio/voice/farm-fb-cupcake.mp3` | `voice.farm.fb.cupcake` |
| `public/audio/voice/farm-fb-pizza.mp3` | `voice.farm.fb.pizza` |
| `public/audio/voice/farm-count-chicks.mp3` | `voice.farm.count.chicks` |
| `public/audio/voice/farm-count-pigs.mp3` | `voice.farm.count.pigs` |
| `public/audio/voice/farm-count-sheep.mp3` | `voice.farm.count.sheep` |
| `public/audio/voice/farm-count-ducks.mp3` | `voice.farm.count.ducks` |
| `public/audio/voice/farm-count-hens.mp3` | `voice.farm.count.hens` |
| `public/audio/voice/farm-count-goats.mp3` | `voice.farm.count.goats` |
| `public/audio/voice/farm-count-cows.mp3` | `voice.farm.count.cows` |
| `public/audio/voice/farm-count-horses.mp3` | `voice.farm.count.horses` |
| `public/audio/voice/farm-count-geese.mp3` | `voice.farm.count.geese` |
| `public/audio/voice/farm-count-hens-row.mp3` | `voice.farm.count.hens-row` |
| `public/audio/voice/farm-count-rabbits.mp3` | `voice.farm.count.rabbits` |
| `public/audio/voice/farm-count-eggs.mp3` | `voice.farm.count.eggs` |
| `public/audio/voice/farm-count-calves.mp3` | `voice.farm.count.calves` |
| `public/audio/voice/farm-count-lambs.mp3` | `voice.farm.count.lambs` |
| `public/audio/voice/farm-count-bees.mp3` | `voice.farm.count.bees` |
| `public/audio/voice/farm-count-turkeys.mp3` | `voice.farm.count.turkeys` |
| `public/audio/voice/jungle-area-welcome.mp3` | `voice.jungle.area-welcome` |
| `public/audio/voice/jungle-memory-welcome.mp3` | `voice.jungle.memory-welcome` |
| `public/audio/voice/jungle-vine-station.mp3` | `voice.jungle.vine-station` |
| `public/audio/voice/jungle-vine-line.mp3` | `voice.jungle.vine-line` |
| `public/audio/voice/jungle-vine-done.mp3` | `voice.jungle.vine-done` |
| `public/audio/voice/jungle-quiz-monkey.mp3` | `voice.jungle.quiz-monkey` |
| `public/audio/voice/jungle-quiz-lion.mp3` | `voice.jungle.quiz-lion` |
| `public/audio/voice/jungle-quiz-parrot.mp3` | `voice.jungle.quiz-parrot` |
| `public/audio/voice/jungle-quiz-bananas.mp3` | `voice.jungle.quiz-bananas` |
| `public/audio/voice/jungle-fb-monkey.mp3` | `voice.jungle.fb.monkey` |
| `public/audio/voice/jungle-fb-frog.mp3` | `voice.jungle.fb.frog` |
| `public/audio/voice/jungle-fb-lion-sound.mp3` | `voice.jungle.fb.lion-sound` |
| `public/audio/voice/jungle-fb-elephant.mp3` | `voice.jungle.fb.elephant` |
| `public/audio/voice/jungle-fb-mouse.mp3` | `voice.jungle.fb.mouse` |
| `public/audio/voice/jungle-fb-lion-yes.mp3` | `voice.jungle.fb.lion-yes` |
| `public/audio/voice/jungle-fb-turtle.mp3` | `voice.jungle.fb.turtle` |
| `public/audio/voice/jungle-fb-ladybug.mp3` | `voice.jungle.fb.ladybug` |
| `public/audio/voice/jungle-fb-treetop.mp3` | `voice.jungle.fb.treetop` |
| `public/audio/voice/jungle-fb-ocean.mp3` | `voice.jungle.fb.ocean` |
| `public/audio/voice/jungle-fb-desert.mp3` | `voice.jungle.fb.desert` |
| `public/audio/voice/jungle-fb-bananas-low.mp3` | `voice.jungle.fb.bananas-low` |
| `public/audio/voice/jungle-fb-bananas-yes.mp3` | `voice.jungle.fb.bananas-yes` |
| `public/audio/voice/jungle-fb-bananas-together.mp3` | `voice.jungle.fb.bananas-together` |
| `public/audio/voice/ocean-area-welcome.mp3` | `voice.ocean.area-welcome` |
| `public/audio/voice/ocean-bubbles-welcome.mp3` | `voice.ocean.bubbles-welcome` |
| `public/audio/voice/ocean-feed-station.mp3` | `voice.ocean.feed-station` |
| `public/audio/voice/ocean-feed-line.mp3` | `voice.ocean.feed-line` |
| `public/audio/voice/ocean-feed-done.mp3` | `voice.ocean.feed-done` |
| `public/audio/voice/ocean-quiz-dolphin.mp3` | `voice.ocean.quiz-dolphin` |
| `public/audio/voice/ocean-quiz-jellyfish.mp3` | `voice.ocean.quiz-jellyfish` |
| `public/audio/voice/ocean-fb-dolphin.mp3` | `voice.ocean.fb.dolphin` |
| `public/audio/voice/ocean-fb-horse.mp3` | `voice.ocean.fb.horse` |
| `public/audio/voice/ocean-fb-camel.mp3` | `voice.ocean.fb.camel` |
| `public/audio/voice/ocean-fb-chicken.mp3` | `voice.ocean.fb.chicken` |
| `public/audio/voice/ocean-fb-jellyfish.mp3` | `voice.ocean.fb.jellyfish` |
| `public/audio/voice/ocean-fb-rock.mp3` | `voice.ocean.fb.rock` |
| `public/audio/voice/ocean-fb-boot.mp3` | `voice.ocean.fb.boot` |
| `public/audio/voice/ocean-sort-prompt.mp3` | `voice.ocean.sort-prompt` |
| `public/audio/voice/ocean-fb-whale.mp3` | `voice.ocean.fb.whale` |
| `public/audio/voice/ocean-fb-lion.mp3` | `voice.ocean.fb.lion` |
| `public/audio/voice/ocean-reef-sort-welcome.mp3` | `voice.ocean.reef-sort.welcome` |
| `public/audio/voice/ocean-reef-sort-fish.mp3` | `voice.ocean.reef-sort.fish` |
| `public/audio/voice/ocean-reef-sort-crab.mp3` | `voice.ocean.reef-sort.crab` |
| `public/audio/voice/ocean-reef-sort-gull.mp3` | `voice.ocean.reef-sort.gull` |
| `public/audio/voice/ocean-reef-sort-turtle.mp3` | `voice.ocean.reef-sort.turtle` |
| `public/audio/voice/ocean-reef-sort-cow.mp3` | `voice.ocean.reef-sort.cow` |
| `public/audio/voice/ocean-reef-sort-clownfish.mp3` | `voice.ocean.reef-sort.clownfish` |
| `public/audio/voice/ocean-reef-sort-seal.mp3` | `voice.ocean.reef-sort.seal` |
| `public/audio/voice/ocean-reef-sort-whale.mp3` | `voice.ocean.reef-sort.whale` |
| `public/audio/voice/ocean-reef-sort-heron.mp3` | `voice.ocean.reef-sort.heron` |
| `public/audio/voice/ocean-reef-sort-starfish.mp3` | `voice.ocean.reef-sort.starfish` |
| `public/audio/voice/ocean-reef-sort-octopus.mp3` | `voice.ocean.reef-sort.octopus` |
| `public/audio/voice/ocean-reef-sort-plane.mp3` | `voice.ocean.reef-sort.plane` |
| `public/audio/voice/dino-area-welcome.mp3` | `voice.dino.area-welcome` |
| `public/audio/voice/dino-memory-welcome.mp3` | `voice.dino.memory-welcome` |
| `public/audio/voice/dino-nest-station.mp3` | `voice.dino.nest-station` |
| `public/audio/voice/dino-nest-line.mp3` | `voice.dino.nest-line` |
| `public/audio/voice/dino-nest-done.mp3` | `voice.dino.nest-done` |
| `public/audio/voice/dino-quiz-neck.mp3` | `voice.dino.quiz-neck` |
| `public/audio/voice/dino-quiz-roar.mp3` | `voice.dino.quiz-roar` |
| `public/audio/voice/dino-fb-brachio.mp3` | `voice.dino.fb.brachio` |
| `public/audio/voice/dino-fb-crab.mp3` | `voice.dino.fb.crab` |
| `public/audio/voice/dino-fb-duck.mp3` | `voice.dino.fb.duck` |
| `public/audio/voice/dino-fb-trex.mp3` | `voice.dino.fb.trex` |
| `public/audio/voice/dino-fb-mouse.mp3` | `voice.dino.fb.mouse` |
| `public/audio/voice/dino-fb-turtle.mp3` | `voice.dino.fb.turtle` |
| `public/audio/voice/dino-tracks-welcome.mp3` | `voice.dino.tracks.welcome` |
| `public/audio/voice/dino-tracks-round.mp3` | `voice.dino.tracks.round` |
| `public/audio/voice/dino-tracks-toes.mp3` | `voice.dino.tracks.toes` |
| `public/audio/voice/dino-tracks-tiny.mp3` | `voice.dino.tracks.tiny` |
| `public/audio/voice/dino-tracks-tyre.mp3` | `voice.dino.tracks.tyre` |
| `public/audio/voice/dino-tracks-drag.mp3` | `voice.dino.tracks.drag` |
| `public/audio/voice/dino-tracks-river.mp3` | `voice.dino.tracks.river` |
| `public/audio/voice/dino-tracks-count.mp3` | `voice.dino.tracks.count` |
| `public/audio/voice/dino-tracks-eggs.mp3` | `voice.dino.tracks.eggs` |
| `public/audio/voice/dino-tracks-shake.mp3` | `voice.dino.tracks.shake` |
| `public/audio/voice/dino-tracks-ferns.mp3` | `voice.dino.tracks.ferns` |
| `public/audio/voice/dino-tracks-legs.mp3` | `voice.dino.tracks.legs` |
| `public/audio/voice/dino-tracks-bone.mp3` | `voice.dino.tracks.bone` |
| `public/audio/voice/forest-area-welcome.mp3` | `voice.forest.area-welcome` |
| `public/audio/voice/forest-balloons-welcome.mp3` | `voice.forest.balloons-welcome` |
| `public/audio/voice/forest-campfire-station.mp3` | `voice.forest.campfire-station` |
| `public/audio/voice/forest-campfire-line.mp3` | `voice.forest.campfire-line` |
| `public/audio/voice/forest-campfire-done.mp3` | `voice.forest.campfire-done` |
| `public/audio/voice/forest-letter-trace.mp3` | `voice.forest.letter-trace` |
| `public/audio/voice/forest-quiz-bird.mp3` | `voice.forest.quiz-bird` |
| `public/audio/voice/forest-quiz-pinecones.mp3` | `voice.forest.quiz-pinecones` |
| `public/audio/voice/forest-fb-bird.mp3` | `voice.forest.fb.bird` |
| `public/audio/voice/forest-fb-bear.mp3` | `voice.forest.fb.bear` |
| `public/audio/voice/forest-fb-snake.mp3` | `voice.forest.fb.snake` |
| `public/audio/voice/forest-fb-pinecones-low.mp3` | `voice.forest.fb.pinecones-low` |
| `public/audio/voice/forest-fb-pinecones-yes.mp3` | `voice.forest.fb.pinecones-yes` |
| `public/audio/voice/forest-fb-pinecones-again.mp3` | `voice.forest.fb.pinecones-again` |
| `public/audio/voice/weather-area-welcome.mp3` | `voice.weather.area-welcome` |
| `public/audio/voice/weather-porch-welcome.mp3` | `voice.weather.porch-welcome` |
| `public/audio/voice/weather-puddle-station.mp3` | `voice.weather.puddle-station` |
| `public/audio/voice/weather-puddle-line.mp3` | `voice.weather.puddle-line` |
| `public/audio/voice/weather-puddle-done.mp3` | `voice.weather.puddle-done` |
| `public/audio/voice/weather-quiz-rain.mp3` | `voice.weather.quiz-rain` |
| `public/audio/voice/weather-quiz-sun.mp3` | `voice.weather.quiz-sun` |
| `public/audio/voice/weather-fb-umbrella.mp3` | `voice.weather.fb.umbrella` |
| `public/audio/voice/weather-fb-sunglasses.mp3` | `voice.weather.fb.sunglasses` |
| `public/audio/voice/weather-fb-swimsuit.mp3` | `voice.weather.fb.swimsuit` |
| `public/audio/voice/weather-fb-sun.mp3` | `voice.weather.fb.sun` |
| `public/audio/voice/weather-fb-moon.mp3` | `voice.weather.fb.moon` |
| `public/audio/voice/weather-fb-cloud.mp3` | `voice.weather.fb.cloud` |
| `public/audio/voice/weather-porch-rain.mp3` | `voice.weather.porch-rain` |
| `public/audio/voice/weather-porch-sun.mp3` | `voice.weather.porch-sun` |
| `public/audio/voice/weather-porch-wind.mp3` | `voice.weather.porch-wind` |
| `public/audio/voice/weather-porch-snow.mp3` | `voice.weather.porch-snow` |
| `public/audio/voice/weather-porch-leaves.mp3` | `voice.weather.porch-leaves` |
| `public/audio/voice/weather-porch-fog.mp3` | `voice.weather.porch-fog` |
| `public/audio/voice/weather-porch-thunder.mp3` | `voice.weather.porch-thunder` |
| `public/audio/voice/weather-porch-spring.mp3` | `voice.weather.porch-spring` |
| `public/audio/voice/weather-porch-puddles.mp3` | `voice.weather.porch-puddles` |
| `public/audio/voice/weather-porch-night.mp3` | `voice.weather.porch-night` |
| `public/audio/voice/weather-porch-hail.mp3` | `voice.weather.porch-hail` |
| `public/audio/voice/weather-porch-rainbow.mp3` | `voice.weather.porch-rainbow` |
| `public/audio/voice/weather-porch-summer.mp3` | `voice.weather.porch-summer` |
| `public/audio/voice/weather-porch-dry.mp3` | `voice.weather.porch-dry` |
| `public/audio/voice/weather-porch-frost.mp3` | `voice.weather.porch-frost` |
| `public/audio/voice/weather-porch-dusk.mp3` | `voice.weather.porch-dusk` |
| `public/audio/voice/space-area-welcome.mp3` | `voice.space.area-welcome` |
| `public/audio/voice/space-picnic-welcome.mp3` | `voice.space.picnic-welcome` |
| `public/audio/voice/space-scoop-station.mp3` | `voice.space.scoop-station` |
| `public/audio/voice/space-scoop-line.mp3` | `voice.space.scoop-line` |
| `public/audio/voice/space-scoop-done.mp3` | `voice.space.scoop-done` |
| `public/audio/voice/space-quiz-launch.mp3` | `voice.space.quiz-launch` |
| `public/audio/voice/space-quiz-stars.mp3` | `voice.space.quiz-stars` |
| `public/audio/voice/space-story-welcome.mp3` | `voice.space.story-welcome` |
| `public/audio/voice/space-fb-launch.mp3` | `voice.space.fb.launch` |
| `public/audio/voice/space-fb-nap.mp3` | `voice.space.fb.nap` |
| `public/audio/voice/space-fb-stars-low.mp3` | `voice.space.fb.stars-low` |
| `public/audio/voice/space-fb-stars-yes.mp3` | `voice.space.fb.stars-yes` |
| `public/audio/voice/space-fb-stars-again.mp3` | `voice.space.fb.stars-again` |
| `public/audio/voice/space-fb-story-start.mp3` | `voice.space.fb.story-start` |
| `public/audio/voice/space-story-open.mp3` | `voice.space.story-open` |
| `public/audio/voice/space-story-stars.mp3` | `voice.space.story-stars` |
| `public/audio/voice/space-story-moon.mp3` | `voice.space.story-moon` |
| `public/audio/voice/space-story-fb-whoosh.mp3` | `voice.space.story-fb.whoosh` |
| `public/audio/voice/space-story-fb-alert.mp3` | `voice.space.story-fb.alert` |
| `public/audio/voice/space-story-fb-count.mp3` | `voice.space.story-fb.count` |
| `public/audio/voice/space-story-fb-four.mp3` | `voice.space.story-fb.four` |
| `public/audio/voice/space-story-fb-almost.mp3` | `voice.space.story-fb.almost` |
| `public/audio/voice/space-story-fb-alien.mp3` | `voice.space.story-fb.alien` |
| `public/audio/voice/space-story-fb-bounce.mp3` | `voice.space.story-fb.bounce` |
| `public/audio/voice/treasure-area-welcome.mp3` | `voice.treasure.area-welcome` |
| `public/audio/voice/treasure-bubbles-welcome.mp3` | `voice.treasure.bubbles-welcome` |
| `public/audio/voice/treasure-quiz-key.mp3` | `voice.treasure.quiz-key` |
| `public/audio/voice/treasure-fb-key.mp3` | `voice.treasure.fb.key` |
| `public/audio/voice/treasure-fb-spoon.mp3` | `voice.treasure.fb.spoon` |
| `public/audio/voice/treasure-fb-pencil.mp3` | `voice.treasure.fb.pencil` |
| `public/audio/voice/color-area-welcome.mp3` | `voice.color.area-welcome` |
| `public/audio/voice/color-balloons-welcome.mp3` | `voice.color.balloons-welcome` |
| `public/audio/voice/color-stamp-station.mp3` | `voice.color.stamp-station` |
| `public/audio/voice/color-stamp-line.mp3` | `voice.color.stamp-line` |
| `public/audio/voice/color-stamp-done.mp3` | `voice.color.stamp-done` |
| `public/audio/voice/color-letter-trace.mp3` | `voice.color.letter-trace` |
| `public/audio/voice/color-quiz-orange.mp3` | `voice.color.quiz-orange` |
| `public/audio/voice/color-quiz-green.mp3` | `voice.color.quiz-green` |
| `public/audio/voice/color-fb-orange.mp3` | `voice.color.fb.orange` |
| `public/audio/voice/color-fb-citrus.mp3` | `voice.color.fb.citrus` |
| `public/audio/voice/color-fb-warm.mp3` | `voice.color.fb.warm` |
| `public/audio/voice/color-fb-green.mp3` | `voice.color.fb.green` |
| `public/audio/voice/color-fb-leaves.mp3` | `voice.color.fb.leaves` |
| `public/audio/voice/color-fb-garden.mp3` | `voice.color.fb.garden` |
| `public/audio/voice/color-mix-atelier.mp3` | `voice.color.mix.atelier` |
| `public/audio/voice/color-mix-bead.mp3` | `voice.color.mix.bead` |
| `public/audio/voice/color-mix-ink.mp3` | `voice.color.mix.ink` |
| `public/audio/voice/color-mix-pink.mp3` | `voice.color.mix.pink` |
| `public/audio/voice/color-mix-pink-rev.mp3` | `voice.color.mix.pink-rev` |
| `public/audio/voice/color-mix-cream.mp3` | `voice.color.mix.cream` |
| `public/audio/voice/color-mix-cream-rev.mp3` | `voice.color.mix.cream-rev` |
| `public/audio/voice/color-mix-sky.mp3` | `voice.color.mix.sky` |
| `public/audio/voice/color-mix-sky-rev.mp3` | `voice.color.mix.sky-rev` |
| `public/audio/voice/music-area-welcome.mp3` | `voice.music.area-welcome` |
| `public/audio/voice/music-rhyme-welcome.mp3` | `voice.music.rhyme-welcome` |
| `public/audio/voice/music-drum-station.mp3` | `voice.music.drum-station` |
| `public/audio/voice/music-drum-line.mp3` | `voice.music.drum-line` |
| `public/audio/voice/music-drum-done.mp3` | `voice.music.drum-done` |
| `public/audio/voice/music-quiz-flute.mp3` | `voice.music.quiz-flute` |
| `public/audio/voice/music-fb-flute.mp3` | `voice.music.fb.flute` |
| `public/audio/voice/music-fb-tuba.mp3` | `voice.music.fb.tuba` |
| `public/audio/voice/music-rhyme-paint.mp3` | `voice.music.rhyme-paint` |
| `public/audio/voice/music-rhyme-bead.mp3` | `voice.music.rhyme-bead` |
| `public/audio/voice/music-rhyme-song.mp3` | `voice.music.rhyme-song` |
| `public/audio/voice/music-rhyme-glue.mp3` | `voice.music.rhyme-glue` |
| `public/audio/voice/music-rhyme-drum.mp3` | `voice.music.rhyme-drum` |
| `public/audio/voice/music-rhyme-art.mp3` | `voice.music.rhyme-art` |
| `public/audio/voice/music-rhyme-note.mp3` | `voice.music.rhyme-note` |
| `public/audio/voice/music-rhyme-star.mp3` | `voice.music.rhyme-star` |
| `public/audio/voice/music-rhyme-red.mp3` | `voice.music.rhyme-red` |
| `public/audio/voice/music-rhyme-blue.mp3` | `voice.music.rhyme-blue` |
| `public/audio/voice/music-rhyme-clay.mp3` | `voice.music.rhyme-clay` |
| `public/audio/voice/music-rhyme-mark.mp3` | `voice.music.rhyme-mark` |
| `public/audio/voice/music-rhyme-dot.mp3` | `voice.music.rhyme-dot` |
| `public/audio/voice/music-rhyme-tune.mp3` | `voice.music.rhyme-tune` |
| `public/audio/voice/music-rhyme-clip.mp3` | `voice.music.rhyme-clip` |
| `public/audio/voice/music-rhyme-fold.mp3` | `voice.music.rhyme-fold` |
| `public/audio/voice/pattern-area-welcome.mp3` | `voice.pattern.area-welcome` |
| `public/audio/voice/pattern-beads-welcome.mp3` | `voice.pattern.beads-welcome` |
| `public/audio/voice/pattern-quiz-fruit.mp3` | `voice.pattern.quiz-fruit` |
| `public/audio/voice/pattern-fb-apple.mp3` | `voice.pattern.fb.apple` |
| `public/audio/voice/pattern-fb-donut.mp3` | `voice.pattern.fb.donut` |
| `public/audio/voice/pattern-fb-grape.mp3` | `voice.pattern.fb.grape` |
| `public/audio/voice/sticker-area-welcome.mp3` | `voice.sticker.area-welcome` |
| `public/audio/voice/sticker-match-welcome.mp3` | `voice.sticker.match-welcome` |
| `public/audio/voice/sticker-quiz-crown.mp3` | `voice.sticker.quiz-crown` |
| `public/audio/voice/sticker-fb-crown.mp3` | `voice.sticker.fb.crown` |
| `public/audio/voice/sticker-fb-bucket.mp3` | `voice.sticker.fb.bucket` |
| `public/audio/voice/barn-area-welcome.mp3` | `voice.barn.area-welcome` |
| `public/audio/voice/barn-story-welcome.mp3` | `voice.barn.story-welcome` |
| `public/audio/voice/barn-fb-open.mp3` | `voice.barn.fb.open` |
| `public/audio/voice/barn-story-open.mp3` | `voice.barn.story-open` |
| `public/audio/voice/barn-stones-station.mp3` | `voice.barn.stones-station` |
| `public/audio/voice/barn-stones-line.mp3` | `voice.barn.stones-line` |
| `public/audio/voice/barn-stones-done.mp3` | `voice.barn.stones-done` |
| `public/audio/voice/barn-letter-trace.mp3` | `voice.barn.letter-trace` |
| `public/audio/voice/barn-pancake-welcome.mp3` | `voice.barn.pancake-welcome` |
| `public/audio/voice/barn-safari-welcome.mp3` | `voice.barn.safari-welcome` |
| `public/audio/voice/barn-story-chicks.mp3` | `voice.barn.story-chicks` |
| `public/audio/voice/barn-story-horse.mp3` | `voice.barn.story-horse` |
| `public/audio/voice/barn-story-tractor.mp3` | `voice.barn.story-tractor` |
| `public/audio/voice/barn-story-fb-cow.mp3` | `voice.barn.story-fb.cow` |
| `public/audio/voice/barn-story-fb-rooster.mp3` | `voice.barn.story-fb.rooster` |
| `public/audio/voice/barn-story-fb-pig.mp3` | `voice.barn.story-fb.pig` |
| `public/audio/voice/barn-story-fb-one.mp3` | `voice.barn.story-fb.one` |
| `public/audio/voice/barn-story-fb-three.mp3` | `voice.barn.story-fb.three` |
| `public/audio/voice/barn-story-fb-five.mp3` | `voice.barn.story-fb.five` |
| `public/audio/voice/barn-story-fb-apple.mp3` | `voice.barn.story-fb.apple` |
| `public/audio/voice/barn-story-fb-pizza.mp3` | `voice.barn.story-fb.pizza` |
| `public/audio/voice/barn-story-fb-carrot.mp3` | `voice.barn.story-fb.carrot` |
| `public/audio/voice/barn-story-fb-cheer.mp3` | `voice.barn.story-fb.cheer` |
| `public/audio/voice/barn-pancake-open.mp3` | `voice.barn.pancake-open` |
| `public/audio/voice/barn-pancake-stir.mp3` | `voice.barn.pancake-stir` |
| `public/audio/voice/barn-pancake-flip.mp3` | `voice.barn.pancake-flip` |
| `public/audio/voice/barn-pancake-count.mp3` | `voice.barn.pancake-count` |
| `public/audio/voice/barn-pancake-share.mp3` | `voice.barn.pancake-share` |
| `public/audio/voice/barn-pancake-syrup.mp3` | `voice.barn.pancake-syrup` |
| `public/audio/voice/barn-pancake-fb-eggs.mp3` | `voice.barn.pancake-fb.eggs` |
| `public/audio/voice/barn-pancake-fb-boots.mp3` | `voice.barn.pancake-fb.boots` |
| `public/audio/voice/barn-pancake-fb-circle.mp3` | `voice.barn.pancake-fb.circle` |
| `public/audio/voice/barn-pancake-fb-square.mp3` | `voice.barn.pancake-fb.square` |
| `public/audio/voice/barn-pancake-fb-clap.mp3` | `voice.barn.pancake-fb.clap` |
| `public/audio/voice/barn-pancake-fb-whisper.mp3` | `voice.barn.pancake-fb.whisper` |
| `public/audio/voice/barn-pancake-fb-five.mp3` | `voice.barn.pancake-fb.five` |
| `public/audio/voice/barn-pancake-fb-two.mp3` | `voice.barn.pancake-fb.two` |
| `public/audio/voice/barn-pancake-fb-thanks.mp3` | `voice.barn.pancake-fb.thanks` |
| `public/audio/voice/barn-pancake-fb-mine.mp3` | `voice.barn.pancake-fb.mine` |
| `public/audio/voice/barn-pancake-fb-highfive.mp3` | `voice.barn.pancake-fb.highfive` |
| `public/audio/voice/starlight-area-welcome.mp3` | `voice.starlight.area-welcome` |
| `public/audio/voice/starlight-story-welcome.mp3` | `voice.starlight.story-welcome` |
| `public/audio/voice/starlight-fb-open.mp3` | `voice.starlight.fb.open` |
| `public/audio/voice/starlight-balloons-welcome.mp3` | `voice.starlight.balloons-welcome` |
| `public/audio/voice/starlight-rocket-station.mp3` | `voice.starlight.rocket-station` |
| `public/audio/voice/starlight-rocket-line.mp3` | `voice.starlight.rocket-line` |
| `public/audio/voice/starlight-rocket-done.mp3` | `voice.starlight.rocket-done` |
| `public/audio/voice/starlight-snow-welcome.mp3` | `voice.starlight.snow-welcome` |
| `public/audio/voice/starlight-snow-open.mp3` | `voice.starlight.snow-open` |
| `public/audio/voice/starlight-snow-fb-mittens.mp3` | `voice.starlight.snow-fb.mittens` |
| `public/audio/voice/starlight-snow-fb-goggles.mp3` | `voice.starlight.snow-fb.goggles` |
| `public/audio/voice/starlight-snow-mailbox.mp3` | `voice.starlight.snow-mailbox` |
| `public/audio/voice/starlight-snow-fb-hat.mp3` | `voice.starlight.snow-fb.hat` |
| `public/audio/voice/starlight-snow-fb-boat.mp3` | `voice.starlight.snow-fb.boat` |
| `public/audio/voice/starlight-snow-balls.mp3` | `voice.starlight.snow-balls` |
| `public/audio/voice/starlight-snow-fb-three.mp3` | `voice.starlight.snow-fb.three` |
| `public/audio/voice/starlight-snow-fb-eight.mp3` | `voice.starlight.snow-fb.eight` |
| `public/audio/voice/starlight-snow-plow.mp3` | `voice.starlight.snow-plow` |
| `public/audio/voice/starlight-snow-fb-wave.mp3` | `voice.starlight.snow-fb.wave` |
| `public/audio/voice/starlight-snow-fb-hide.mp3` | `voice.starlight.snow-fb.hide` |
| `public/audio/voice/starlight-snow-cocoa.mp3` | `voice.starlight.snow-cocoa` |
| `public/audio/voice/starlight-snow-fb-cocoa.mp3` | `voice.starlight.snow-fb.cocoa` |
| `public/audio/voice/starlight-snow-fb-soup.mp3` | `voice.starlight.snow-fb.soup` |
| `public/audio/voice/starlight-snow-lamps.mp3` | `voice.starlight.snow-lamps` |
| `public/audio/voice/starlight-snow-fb-night.mp3` | `voice.starlight.snow-fb.night` |
| `public/audio/voice/sea-area-welcome.mp3` | `voice.sea.area-welcome` |
| `public/audio/voice/sea-story-welcome.mp3` | `voice.sea.story-welcome` |
| `public/audio/voice/sea-fb-open.mp3` | `voice.sea.fb.open` |
| `public/audio/voice/sea-bubbles-welcome.mp3` | `voice.sea.bubbles-welcome` |
| `public/audio/voice/sea-rhyme-welcome.mp3` | `voice.sea.rhyme-welcome` |
| `public/audio/voice/sea-dive.mp3` | `voice.sea.dive` |
| `public/audio/voice/sea-fb-turtle.mp3` | `voice.sea.fb.turtle` |
| `public/audio/voice/sea-fb-crab.mp3` | `voice.sea.fb.crab` |
| `public/audio/voice/sea-fb-octopus.mp3` | `voice.sea.fb.octopus` |
| `public/audio/voice/sea-jelly.mp3` | `voice.sea.jelly` |
| `public/audio/voice/sea-fb-pink.mp3` | `voice.sea.fb.pink` |
| `public/audio/voice/sea-fb-rock.mp3` | `voice.sea.fb.rock` |
| `public/audio/voice/sea-treasure.mp3` | `voice.sea.treasure` |
| `public/audio/voice/sea-fb-done.mp3` | `voice.sea.fb.done` |
| `public/audio/voice/sea-q-turtle.mp3` | `voice.sea.q.turtle` |
| `public/audio/voice/sea-q-jelly.mp3` | `voice.sea.q.jelly` |
| `public/audio/voice/sea-q-stars.mp3` | `voice.sea.q.stars` |
| `public/audio/voice/phonics-area-welcome.mp3` | `voice.phonics.area-welcome` |
| `public/audio/voice/phonics-b-welcome.mp3` | `voice.phonics.b-welcome` |
| `public/audio/voice/phonics-fb-bear.mp3` | `voice.phonics.fb.bear` |
| `public/audio/voice/phonics-fb-apple.mp3` | `voice.phonics.fb.apple` |
| `public/audio/voice/phonics-fb-cat.mp3` | `voice.phonics.fb.cat` |
| `public/audio/voice/phonics-s-welcome.mp3` | `voice.phonics.s-welcome` |
| `public/audio/voice/phonics-fb-star.mp3` | `voice.phonics.fb.star` |
| `public/audio/voice/phonics-rhyme-welcome.mp3` | `voice.phonics.rhyme-welcome` |
| `public/audio/voice/phonics-cue-buh.mp3` | `voice.phonics.cue.buh` |
| `public/audio/voice/phonics-cue-sss.mp3` | `voice.phonics.cue.sss` |
| `public/audio/voice/phonics-fb-elephant.mp3` | `voice.phonics.fb.elephant` |
| `public/audio/voice/phonics-fb-lion.mp3` | `voice.phonics.fb.lion` |
| `public/audio/voice/phonics-blend-welcome.mp3` | `voice.phonics.blend-welcome` |
| `public/audio/voice/phonics-trace-welcome.mp3` | `voice.phonics.trace-welcome` |
| `public/audio/voice/phonics-pebbles-welcome.mp3` | `voice.phonics.pebbles-welcome` |
| `public/audio/voice/phonics-pebbles-line.mp3` | `voice.phonics.pebbles-line` |
| `public/audio/voice/phonics-pebbles-done.mp3` | `voice.phonics.pebbles-done` |
| `public/audio/voice/phonics-clue-b.mp3` | `voice.phonics.clue.b` |
| `public/audio/voice/phonics-clue-s.mp3` | `voice.phonics.clue.s` |
| `public/audio/voice/grove-area-welcome.mp3` | `voice.grove.area-welcome` |
| `public/audio/voice/grove-stars-welcome.mp3` | `voice.grove.stars-welcome` |
| `public/audio/voice/grove-fb-four.mp3` | `voice.grove.fb.four` |
| `public/audio/voice/grove-fb-one.mp3` | `voice.grove.fb.one` |
| `public/audio/voice/grove-cue-tada.mp3` | `voice.grove.cue.tada` |
| `public/audio/voice/grove-clue-stars.mp3` | `voice.grove.clue.stars` |
| `public/audio/voice/grove-taxi-welcome.mp3` | `voice.grove.taxi-welcome` |
| `public/audio/voice/grove-frame-welcome.mp3` | `voice.grove.frame-welcome` |
| `public/audio/voice/grove-dots-line.mp3` | `voice.grove.dots-line` |
| `public/audio/voice/grove-dots-done.mp3` | `voice.grove.dots-done` |
| `public/audio/voice/shapes-area-welcome.mp3` | `voice.shapes.area-welcome` |
| `public/audio/voice/shapes-circle-welcome.mp3` | `voice.shapes.circle-welcome` |
| `public/audio/voice/shapes-fb-circle.mp3` | `voice.shapes.fb.circle` |
| `public/audio/voice/shapes-fb-square.mp3` | `voice.shapes.fb.square` |
| `public/audio/voice/shapes-fb-triangle.mp3` | `voice.shapes.fb.triangle` |
| `public/audio/voice/shapes-cue-boing.mp3` | `voice.shapes.cue.boing` |
| `public/audio/voice/shapes-clue-circle.mp3` | `voice.shapes.clue.circle` |
| `public/audio/voice/shapes-balloons-welcome.mp3` | `voice.shapes.balloons-welcome` |
| `public/audio/voice/shapes-cups-welcome.mp3` | `voice.shapes.cups-welcome` |
| `public/audio/voice/shapes-cups-line.mp3` | `voice.shapes.cups-line` |
| `public/audio/voice/shapes-cups-done.mp3` | `voice.shapes.cups-done` |
| `public/audio/voice/feelings-area-welcome.mp3` | `voice.feelings.area-welcome` |
| `public/audio/voice/feelings-happy-welcome.mp3` | `voice.feelings.happy-welcome` |
| `public/audio/voice/feelings-fb-happy.mp3` | `voice.feelings.fb.happy` |
| `public/audio/voice/feelings-fb-sleepy.mp3` | `voice.feelings.fb.sleepy` |
| `public/audio/voice/feelings-fb-sad.mp3` | `voice.feelings.fb.sad` |
| `public/audio/voice/feelings-cue-yay.mp3` | `voice.feelings.cue.yay` |
| `public/audio/voice/feelings-clue-happy.mp3` | `voice.feelings.clue.happy` |
| `public/audio/voice/feelings-memory-welcome.mp3` | `voice.feelings.memory-welcome` |
| `public/audio/voice/feelings-face-welcome.mp3` | `voice.feelings.face-welcome` |
| `public/audio/voice/feelings-face-line.mp3` | `voice.feelings.face-line` |
| `public/audio/voice/feelings-face-done.mp3` | `voice.feelings.face-done` |
| `public/audio/voice/habits-area-welcome.mp3` | `voice.habits.area-welcome` |
| `public/audio/voice/habits-brush-welcome.mp3` | `voice.habits.brush-welcome` |
| `public/audio/voice/habits-fb-brush.mp3` | `voice.habits.fb.brush` |
| `public/audio/voice/habits-fb-pillow.mp3` | `voice.habits.fb.pillow` |
| `public/audio/voice/habits-fb-crayon.mp3` | `voice.habits.fb.crayon` |
| `public/audio/voice/habits-sfx-brush.mp3` | `voice.habits.sfx.brush` |
| `public/audio/voice/habits-cue-brush.mp3` | `voice.habits.cue.brush` |
| `public/audio/voice/habits-clue-brush.mp3` | `voice.habits.clue.brush` |
| `public/audio/voice/habits-clue-ears.mp3` | `voice.habits.clue.ears` |
| `public/audio/voice/habits-ears-welcome.mp3` | `voice.habits.ears-welcome` |
| `public/audio/voice/habits-fb-ears.mp3` | `voice.habits.fb.ears` |
| `public/audio/voice/habits-cue-listen.mp3` | `voice.habits.cue.listen` |
| `public/audio/voice/habits-fb-eyes.mp3` | `voice.habits.fb.eyes` |
| `public/audio/voice/habits-fb-nose.mp3` | `voice.habits.fb.nose` |
| `public/audio/voice/habits-piano-welcome.mp3` | `voice.habits.piano-welcome` |
| `public/audio/voice/habits-brush-station.mp3` | `voice.habits.brush-station` |
| `public/audio/voice/habits-brush-line.mp3` | `voice.habits.brush-line` |
| `public/audio/voice/habits-brush-done.mp3` | `voice.habits.brush-done` |
| `public/audio/voice/family-area-welcome.mp3` | `voice.family.area-welcome` |
| `public/audio/voice/family-baby-welcome.mp3` | `voice.family.baby-welcome` |
| `public/audio/voice/family-clue-baby.mp3` | `voice.family.clue.baby` |
| `public/audio/voice/family-fb-baby.mp3` | `voice.family.fb.baby` |
| `public/audio/voice/family-cue-giggle.mp3` | `voice.family.cue.giggle` |
| `public/audio/voice/family-fb-grandpa.mp3` | `voice.family.fb.grandpa` |
| `public/audio/voice/family-fb-puppy.mp3` | `voice.family.fb.puppy` |
| `public/audio/voice/family-rhyme-welcome.mp3` | `voice.family.rhyme-welcome` |
| `public/audio/voice/family-table-welcome.mp3` | `voice.family.table-welcome` |
| `public/audio/voice/family-wash-welcome.mp3` | `voice.family.wash-welcome` |
| `public/audio/voice/family-trace-welcome.mp3` | `voice.family.trace-welcome` |
| `public/audio/voice/family-pour-welcome.mp3` | `voice.family.pour-welcome` |
| `public/audio/voice/family-socks-welcome.mp3` | `voice.family.socks-welcome` |
| `public/audio/voice/family-comb-welcome.mp3` | `voice.family.comb-welcome` |
| `public/audio/voice/family-table-line.mp3` | `voice.family.table-line` |
| `public/audio/voice/family-table-done.mp3` | `voice.family.table-done` |
| `public/audio/voice/family-wash-line.mp3` | `voice.family.wash-line` |
| `public/audio/voice/family-wash-done.mp3` | `voice.family.wash-done` |
| `public/audio/voice/garage-area-welcome.mp3` | `voice.garage.area-welcome` |
| `public/audio/voice/garage-bus-welcome.mp3` | `voice.garage.bus-welcome` |
| `public/audio/voice/garage-fb-bus.mp3` | `voice.garage.fb.bus` |
| `public/audio/voice/garage-fb-fish.mp3` | `voice.garage.fb.fish` |
| `public/audio/voice/garage-fb-cloud.mp3` | `voice.garage.fb.cloud` |
| `public/audio/voice/garage-clue-bus.mp3` | `voice.garage.clue.bus` |
| `public/audio/voice/garage-tyres-welcome.mp3` | `voice.garage.tyres-welcome` |
| `public/audio/voice/garage-fb-four.mp3` | `voice.garage.fb.four` |
| `public/audio/voice/garage-fb-two.mp3` | `voice.garage.fb.two` |
| `public/audio/voice/garage-fb-eight.mp3` | `voice.garage.fb.eight` |
| `public/audio/voice/garage-clue-tyres.mp3` | `voice.garage.clue.tyres` |
| `public/audio/voice/garage-clue-tools.mp3` | `voice.garage.clue.tools` |
| `public/audio/voice/garage-tools-welcome.mp3` | `voice.garage.tools-welcome` |
| `public/audio/voice/garage-fb-wrench.mp3` | `voice.garage.fb.wrench` |
| `public/audio/voice/garage-fb-banana.mp3` | `voice.garage.fb.banana` |
| `public/audio/voice/garage-fb-duck.mp3` | `voice.garage.fb.duck` |
| `public/audio/voice/garage-clue-colour.mp3` | `voice.garage.clue.colour` |
| `public/audio/voice/garage-colour-welcome.mp3` | `voice.garage.colour-welcome` |
| `public/audio/voice/garage-fb-yellow.mp3` | `voice.garage.fb.yellow` |
| `public/audio/voice/garage-fb-notbus.mp3` | `voice.garage.fb.notbus` |
| `public/audio/voice/garage-clue-letter.mp3` | `voice.garage.clue.letter` |
| `public/audio/voice/garage-letter-welcome.mp3` | `voice.garage.letter-welcome` |
| `public/audio/voice/garage-fb-letter-b.mp3` | `voice.garage.fb.letter-b` |
| `public/audio/voice/garage-fb-letter-s.mp3` | `voice.garage.fb.letter-s` |
| `public/audio/voice/garage-fb-letter-m.mp3` | `voice.garage.fb.letter-m` |
| `public/audio/voice/garage-clue-lights.mp3` | `voice.garage.clue.lights` |
| `public/audio/voice/garage-lights-welcome.mp3` | `voice.garage.lights-welcome` |
| `public/audio/voice/garage-fb-blue.mp3` | `voice.garage.fb.blue` |
| `public/audio/voice/garage-fb-green.mp3` | `voice.garage.fb.green` |
| `public/audio/voice/garage-fb-red.mp3` | `voice.garage.fb.red` |
| `public/audio/voice/garage-clue-bolts.mp3` | `voice.garage.clue.bolts` |
| `public/audio/voice/garage-bolts-welcome.mp3` | `voice.garage.bolts-welcome` |
| `public/audio/voice/garage-fb-five.mp3` | `voice.garage.fb.five` |
| `public/audio/voice/garage-fb-add.mp3` | `voice.garage.fb.add` |
| `public/audio/voice/garage-fb-count.mp3` | `voice.garage.fb.count` |
| `public/audio/voice/garage-clue-wheel.mp3` | `voice.garage.clue.wheel` |
| `public/audio/voice/garage-wheel-welcome.mp3` | `voice.garage.wheel-welcome` |
| `public/audio/voice/garage-fb-circle.mp3` | `voice.garage.fb.circle` |
| `public/audio/voice/garage-fb-square.mp3` | `voice.garage.fb.square` |
| `public/audio/voice/garage-fb-triangle.mp3` | `voice.garage.fb.triangle` |
| `public/audio/voice/garage-bead-welcome.mp3` | `voice.garage.bead-welcome` |
| `public/audio/voice/garage-truck-welcome.mp3` | `voice.garage.truck-welcome` |
| `public/audio/voice/garage-truck-line.mp3` | `voice.garage.truck-line` |
| `public/audio/voice/garage-truck-done.mp3` | `voice.garage.truck-done` |
| `public/audio/voice/street-area-welcome.mp3` | `voice.street.area-welcome` |
| `public/audio/voice/street-light-welcome.mp3` | `voice.street.light-welcome` |
| `public/audio/voice/street-fb-stop.mp3` | `voice.street.fb.stop` |
| `public/audio/voice/street-fb-wait.mp3` | `voice.street.fb.wait` |
| `public/audio/voice/street-fb-watch.mp3` | `voice.street.fb.watch` |
| `public/audio/voice/street-clue-light.mp3` | `voice.street.clue.light` |
| `public/audio/voice/street-fire-welcome.mp3` | `voice.street.fire-welcome` |
| `public/audio/voice/street-clue-fire.mp3` | `voice.street.clue.fire` |
| `public/audio/voice/street-fb-fire.mp3` | `voice.street.fb.fire` |
| `public/audio/voice/street-cue-neenaw.mp3` | `voice.street.cue.neenaw` |
| `public/audio/voice/street-fb-baker.mp3` | `voice.street.fb.baker` |
| `public/audio/voice/street-fb-duck.mp3` | `voice.street.fb.duck` |
| `public/audio/voice/street-clue-sky.mp3` | `voice.street.clue.sky` |
| `public/audio/voice/street-sky-welcome.mp3` | `voice.street.sky-welcome` |
| `public/audio/voice/street-fb-plane.mp3` | `voice.street.fb.plane` |
| `public/audio/voice/street-fb-bus.mp3` | `voice.street.fb.bus` |
| `public/audio/voice/street-fb-boat.mp3` | `voice.street.fb.boat` |
| `public/audio/voice/street-clue-cones.mp3` | `voice.street.clue.cones` |
| `public/audio/voice/street-cones-welcome.mp3` | `voice.street.cones-welcome` |
| `public/audio/voice/street-fb-six.mp3` | `voice.street.fb.six` |
| `public/audio/voice/street-fb-count.mp3` | `voice.street.fb.count` |
| `public/audio/voice/street-fb-nine.mp3` | `voice.street.fb.nine` |
| `public/audio/voice/street-clue-cross.mp3` | `voice.street.clue.cross` |
| `public/audio/voice/street-cross-welcome.mp3` | `voice.street.cross-welcome` |
| `public/audio/voice/street-fb-look.mp3` | `voice.street.fb.look` |
| `public/audio/voice/street-fb-looking.mp3` | `voice.street.fb.looking` |
| `public/audio/voice/street-fb-rule.mp3` | `voice.street.fb.rule` |
| `public/audio/voice/street-clue-truck.mp3` | `voice.street.clue.truck` |
| `public/audio/voice/street-letter-welcome.mp3` | `voice.street.letter-welcome` |
| `public/audio/voice/street-fb-t.mp3` | `voice.street.fb.t` |
| `public/audio/voice/street-fb-b.mp3` | `voice.street.fb.b` |
| `public/audio/voice/street-fb-p.mp3` | `voice.street.fb.p` |
| `public/audio/voice/street-sign-welcome.mp3` | `voice.street.sign-welcome` |
| `public/audio/voice/street-fb-sign.mp3` | `voice.street.fb.sign` |
| `public/audio/voice/street-fb-heart.mp3` | `voice.street.fb.heart` |
| `public/audio/voice/street-fb-moon.mp3` | `voice.street.fb.moon` |
| `public/audio/voice/street-lights-welcome.mp3` | `voice.street.lights-welcome` |
| `public/audio/voice/street-fb-green.mp3` | `voice.street.fb.green` |
| `public/audio/voice/street-fb-purple.mp3` | `voice.street.fb.purple` |
| `public/audio/voice/street-fb-red-already.mp3` | `voice.street.fb.red-already` |
| `public/audio/voice/street-balloon-welcome.mp3` | `voice.street.balloon-welcome` |
| `public/audio/voice/street-trace-welcome.mp3` | `voice.street.trace-welcome` |
| `public/audio/voice/street-wash-welcome.mp3` | `voice.street.wash-welcome` |
| `public/audio/voice/street-wash-line.mp3` | `voice.street.wash-line` |
| `public/audio/voice/street-wash-done.mp3` | `voice.street.wash-done` |
| `public/audio/voice/street-drive-welcome.mp3` | `voice.street.drive-welcome` |
| `public/audio/voice/street-busstop-welcome.mp3` | `voice.street.busstop-welcome` |
| `public/audio/voice/runway-area-welcome.mp3` | `voice.runway.area-welcome` |
| `public/audio/voice/runway-whoosh-welcome.mp3` | `voice.runway.whoosh-welcome` |
| `public/audio/voice/runway-clue-whoosh.mp3` | `voice.runway.clue.whoosh` |
| `public/audio/voice/runway-fb-plane.mp3` | `voice.runway.fb.plane` |
| `public/audio/voice/runway-fb-cow.mp3` | `voice.runway.fb.cow` |
| `public/audio/voice/runway-fb-sub.mp3` | `voice.runway.fb.sub` |
| `public/audio/voice/runway-planes-welcome.mp3` | `voice.runway.planes-welcome` |
| `public/audio/voice/runway-clue-planes.mp3` | `voice.runway.clue.planes` |
| `public/audio/voice/runway-fb-five.mp3` | `voice.runway.fb.five` |
| `public/audio/voice/runway-fb-apron.mp3` | `voice.runway.fb.apron` |
| `public/audio/voice/runway-fb-eight.mp3` | `voice.runway.fb.eight` |
| `public/audio/voice/runway-clue-belt.mp3` | `voice.runway.clue.belt` |
| `public/audio/voice/runway-belt-welcome.mp3` | `voice.runway.belt-welcome` |
| `public/audio/voice/runway-fb-bags.mp3` | `voice.runway.fb.bags` |
| `public/audio/voice/runway-fb-penguin.mp3` | `voice.runway.fb.penguin` |
| `public/audio/voice/runway-fb-tree.mp3` | `voice.runway.fb.tree` |
| `public/audio/voice/runway-clue-pilot.mp3` | `voice.runway.clue.pilot` |
| `public/audio/voice/runway-pilot-welcome.mp3` | `voice.runway.pilot-welcome` |
| `public/audio/voice/runway-fb-cockpit.mp3` | `voice.runway.fb.cockpit` |
| `public/audio/voice/runway-fb-hold.mp3` | `voice.runway.fb.hold` |
| `public/audio/voice/runway-fb-runway.mp3` | `voice.runway.fb.runway` |
| `public/audio/voice/runway-clue-letter.mp3` | `voice.runway.clue.letter` |
| `public/audio/voice/runway-letter-welcome.mp3` | `voice.runway.letter-welcome` |
| `public/audio/voice/runway-fb-p.mp3` | `voice.runway.fb.p` |
| `public/audio/voice/runway-clue-seats.mp3` | `voice.runway.clue.seats` |
| `public/audio/voice/runway-seats-welcome.mp3` | `voice.runway.seats-welcome` |
| `public/audio/voice/runway-fb-seven.mp3` | `voice.runway.fb.seven` |
| `public/audio/voice/runway-fb-rows.mp3` | `voice.runway.fb.rows` |
| `public/audio/voice/runway-clue-window.mp3` | `voice.runway.clue.window` |
| `public/audio/voice/runway-window-welcome.mp3` | `voice.runway.window-welcome` |
| `public/audio/voice/runway-fb-oval.mp3` | `voice.runway.fb.oval` |
| `public/audio/voice/runway-fb-stars.mp3` | `voice.runway.fb.stars` |
| `public/audio/voice/runway-fb-cabin.mp3` | `voice.runway.fb.cabin` |
| `public/audio/voice/runway-clue-blink.mp3` | `voice.runway.clue.blink` |
| `public/audio/voice/runway-blink-welcome.mp3` | `voice.runway.blink-welcome` |
| `public/audio/voice/runway-fb-rest.mp3` | `voice.runway.fb.rest` |
| `public/audio/voice/runway-fb-blinks.mp3` | `voice.runway.fb.blinks` |
| `public/audio/voice/runway-fb-blink.mp3` | `voice.runway.fb.blink` |
| `public/audio/voice/runway-balloon-welcome.mp3` | `voice.runway.balloon-welcome` |
| `public/audio/voice/runway-pack-welcome.mp3` | `voice.runway.pack-welcome` |
| `public/audio/voice/runway-pack-line.mp3` | `voice.runway.pack-line` |
| `public/audio/voice/runway-pack-done.mp3` | `voice.runway.pack-done` |
| `public/audio/voice/harbour-area-welcome.mp3` | `voice.harbour.area-welcome` |
| `public/audio/voice/harbour-horn-welcome.mp3` | `voice.harbour.horn-welcome` |
| `public/audio/voice/harbour-clue-horn.mp3` | `voice.harbour.clue.horn` |
| `public/audio/voice/harbour-fb-ferry.mp3` | `voice.harbour.fb.ferry` |
| `public/audio/voice/harbour-cue-horn.mp3` | `voice.harbour.cue.horn` |
| `public/audio/voice/harbour-fb-bike.mp3` | `voice.harbour.fb.bike` |
| `public/audio/voice/harbour-fb-hen.mp3` | `voice.harbour.fb.hen` |
| `public/audio/voice/harbour-water-welcome.mp3` | `voice.harbour.water-welcome` |
| `public/audio/voice/harbour-clue-water.mp3` | `voice.harbour.clue.water` |
| `public/audio/voice/harbour-fb-boat.mp3` | `voice.harbour.fb.boat` |
| `public/audio/voice/harbour-fb-bus.mp3` | `voice.harbour.fb.bus` |
| `public/audio/voice/harbour-fb-plane.mp3` | `voice.harbour.fb.plane` |
| `public/audio/voice/harbour-clue-buoys.mp3` | `voice.harbour.clue.buoys` |
| `public/audio/voice/harbour-buoys-welcome.mp3` | `voice.harbour.buoys-welcome` |
| `public/audio/voice/harbour-fb-seven.mp3` | `voice.harbour.fb.seven` |
| `public/audio/voice/harbour-fb-ten.mp3` | `voice.harbour.fb.ten` |
| `public/audio/voice/harbour-clue-crane.mp3` | `voice.harbour.clue.crane` |
| `public/audio/voice/harbour-crane-welcome.mp3` | `voice.harbour.crane-welcome` |
| `public/audio/voice/harbour-fb-crane.mp3` | `voice.harbour.fb.crane` |
| `public/audio/voice/harbour-fb-kitten.mp3` | `voice.harbour.fb.kitten` |
| `public/audio/voice/harbour-fb-spoon.mp3` | `voice.harbour.fb.spoon` |
| `public/audio/voice/harbour-letter-welcome.mp3` | `voice.harbour.letter-welcome` |
| `public/audio/voice/harbour-fb-s.mp3` | `voice.harbour.fb.s` |
| `public/audio/voice/harbour-fb-h.mp3` | `voice.harbour.fb.h` |
| `public/audio/voice/harbour-fb-b-ship.mp3` | `voice.harbour.fb.b-ship` |
| `public/audio/voice/harbour-rhyme-welcome.mp3` | `voice.harbour.rhyme-welcome` |
| `public/audio/voice/harbour-clue-rhyme.mp3` | `voice.harbour.clue.rhyme` |
| `public/audio/voice/harbour-fb-coat.mp3` | `voice.harbour.fb.coat` |
| `public/audio/voice/harbour-fb-ship-rhyme.mp3` | `voice.harbour.fb.ship-rhyme` |
| `public/audio/voice/harbour-fb-dock-rhyme.mp3` | `voice.harbour.fb.dock-rhyme` |
| `public/audio/voice/harbour-clue-crates.mp3` | `voice.harbour.clue.crates` |
| `public/audio/voice/harbour-crates-welcome.mp3` | `voice.harbour.crates-welcome` |
| `public/audio/voice/harbour-fb-two-five.mp3` | `voice.harbour.fb.two-five` |
| `public/audio/voice/harbour-fb-stacks.mp3` | `voice.harbour.fb.stacks` |
| `public/audio/voice/harbour-clue-anchor.mp3` | `voice.harbour.clue.anchor` |
| `public/audio/voice/harbour-anchor-welcome.mp3` | `voice.harbour.anchor-welcome` |
| `public/audio/voice/harbour-fb-bed.mp3` | `voice.harbour.fb.bed` |
| `public/audio/voice/harbour-fb-bakery.mp3` | `voice.harbour.fb.bakery` |
| `public/audio/voice/safari-bio-lion.mp3` | `voice.safari.bio.lion` |
| `public/audio/voice/safari-bio-elephant.mp3` | `voice.safari.bio.elephant` |
| `public/audio/voice/safari-bio-monkey.mp3` | `voice.safari.bio.monkey` |
| `public/audio/voice/safari-bio-duck.mp3` | `voice.safari.bio.duck` |
| `public/audio/voice/safari-bio-frog.mp3` | `voice.safari.bio.frog` |
| `public/audio/voice/safari-bio-cow.mp3` | `voice.safari.bio.cow` |
| `public/audio/voice/safari-bio-giraffe.mp3` | `voice.safari.bio.giraffe` |
| `public/audio/voice/safari-bio-zebra.mp3` | `voice.safari.bio.zebra` |
| `public/audio/voice/safari-bio-pig.mp3` | `voice.safari.bio.pig` |
| `public/audio/voice/safari-bio-horse.mp3` | `voice.safari.bio.horse` |
| `public/audio/voice/safari-bio-farm-cow.mp3` | `voice.safari.bio.farm-cow` |
| `public/audio/voice/safari-bio-hen.mp3` | `voice.safari.bio.hen` |
| `public/audio/voice/safari-bio-sheep.mp3` | `voice.safari.bio.sheep` |
| `public/audio/voice/safari-bio-farm-duck.mp3` | `voice.safari.bio.farm-duck` |
| `public/audio/voice/safari-bio-goat.mp3` | `voice.safari.bio.goat` |
| `public/audio/voice/safari-bio-chick.mp3` | `voice.safari.bio.chick` |
| `public/audio/voice/safari-bio-parrot.mp3` | `voice.safari.bio.parrot` |
| `public/audio/voice/safari-bio-tiger.mp3` | `voice.safari.bio.tiger` |
| `public/audio/voice/safari-bio-snake.mp3` | `voice.safari.bio.snake` |
| `public/audio/voice/safari-bio-gorilla.mp3` | `voice.safari.bio.gorilla` |
| `public/audio/voice/safari-bio-jungle-monkey.mp3` | `voice.safari.bio.jungle-monkey` |
| `public/audio/voice/safari-bio-jungle-frog.mp3` | `voice.safari.bio.jungle-frog` |
| `public/audio/voice/safari-bio-sloth.mp3` | `voice.safari.bio.sloth` |
| `public/audio/voice/safari-bio-leopard.mp3` | `voice.safari.bio.leopard` |
| `public/audio/voice/safari-bio-penguin.mp3` | `voice.safari.bio.penguin` |
| `public/audio/voice/safari-bio-seal.mp3` | `voice.safari.bio.seal` |
| `public/audio/voice/safari-bio-bear.mp3` | `voice.safari.bio.bear` |
| `public/audio/voice/safari-bio-whale.mp3` | `voice.safari.bio.whale` |
| `public/audio/voice/safari-bio-fox.mp3` | `voice.safari.bio.fox` |
| `public/audio/voice/safari-bio-owl.mp3` | `voice.safari.bio.owl` |
| `public/audio/voice/safari-bio-flake.mp3` | `voice.safari.bio.flake` |
| `public/audio/voice/safari-bio-igloo.mp3` | `voice.safari.bio.igloo` |
| `public/audio/voice/safari-bio-bee.mp3` | `voice.safari.bio.bee` |
| `public/audio/voice/safari-bio-butterfly.mp3` | `voice.safari.bio.butterfly` |
| `public/audio/voice/safari-bio-beetle.mp3` | `voice.safari.bio.beetle` |
| `public/audio/voice/safari-bio-cricket.mp3` | `voice.safari.bio.cricket` |
| `public/audio/voice/safari-bio-ladybug.mp3` | `voice.safari.bio.ladybug` |
| `public/audio/voice/safari-bio-snail.mp3` | `voice.safari.bio.snail` |
| `public/audio/voice/safari-bio-ant.mp3` | `voice.safari.bio.ant` |
| `public/audio/voice/safari-bio-worm.mp3` | `voice.safari.bio.worm` |
| `public/audio/voice/safari-bio-pond-frog.mp3` | `voice.safari.bio.pond-frog` |
| `public/audio/voice/safari-bio-pond-duck.mp3` | `voice.safari.bio.pond-duck` |
| `public/audio/voice/safari-bio-fish.mp3` | `voice.safari.bio.fish` |
| `public/audio/voice/safari-bio-turtle.mp3` | `voice.safari.bio.turtle` |
| `public/audio/voice/safari-bio-dragonfly.mp3` | `voice.safari.bio.dragonfly` |
| `public/audio/voice/safari-bio-pond-snail.mp3` | `voice.safari.bio.pond-snail` |
| `public/audio/voice/safari-bio-lily.mp3` | `voice.safari.bio.lily` |
| `public/audio/voice/safari-bio-reed.mp3` | `voice.safari.bio.reed` |
| `public/audio/voice/safari-bio-bat.mp3` | `voice.safari.bio.bat` |
| `public/audio/voice/safari-bio-moth.mp3` | `voice.safari.bio.moth` |
| `public/audio/voice/safari-bio-night-owl.mp3` | `voice.safari.bio.night-owl` |
| `public/audio/voice/safari-bio-night-cat.mp3` | `voice.safari.bio.night-cat` |
| `public/audio/voice/safari-bio-night-fox.mp3` | `voice.safari.bio.night-fox` |
| `public/audio/voice/safari-bio-mouse.mp3` | `voice.safari.bio.mouse` |
| `public/audio/voice/safari-bio-star.mp3` | `voice.safari.bio.star` |
| `public/audio/voice/safari-bio-moon.mp3` | `voice.safari.bio.moon` |
| `public/audio/voice/safari-bio-bird.mp3` | `voice.safari.bio.bird` |
| `public/audio/voice/safari-bio-squirrel.mp3` | `voice.safari.bio.squirrel` |
| `public/audio/voice/safari-bio-dog.mp3` | `voice.safari.bio.dog` |
| `public/audio/voice/safari-bio-bunny.mp3` | `voice.safari.bio.bunny` |
| `public/audio/voice/safari-bio-park-duck.mp3` | `voice.safari.bio.park-duck` |
| `public/audio/voice/safari-bio-park-bee.mp3` | `voice.safari.bio.park-bee` |
| `public/audio/voice/safari-bio-bench.mp3` | `voice.safari.bio.bench` |
| `public/audio/voice/safari-bio-fountain.mp3` | `voice.safari.bio.fountain` |
| `public/audio/voice/safari-bio-pot.mp3` | `voice.safari.bio.pot` |
| `public/audio/voice/safari-bio-bread.mp3` | `voice.safari.bio.bread` |
| `public/audio/voice/safari-bio-apple.mp3` | `voice.safari.bio.apple` |
| `public/audio/voice/safari-bio-spoon.mp3` | `voice.safari.bio.spoon` |
| `public/audio/voice/safari-bio-milk.mp3` | `voice.safari.bio.milk` |
| `public/audio/voice/safari-bio-jam.mp3` | `voice.safari.bio.jam` |
| `public/audio/voice/safari-bio-kitchen-cat.mp3` | `voice.safari.bio.kitchen-cat` |
| `public/audio/voice/safari-bio-oven.mp3` | `voice.safari.bio.oven` |
| `public/audio/voice/safari-bio-bus.mp3` | `voice.safari.bio.bus` |
| `public/audio/voice/safari-bio-car.mp3` | `voice.safari.bio.car` |
| `public/audio/voice/safari-bio-plane.mp3` | `voice.safari.bio.plane` |
| `public/audio/voice/safari-bio-train.mp3` | `voice.safari.bio.train` |
| `public/audio/voice/safari-bio-bike.mp3` | `voice.safari.bio.bike` |
| `public/audio/voice/safari-bio-boat.mp3` | `voice.safari.bio.boat` |
| `public/audio/voice/safari-bio-heli.mp3` | `voice.safari.bio.heli` |
| `public/audio/voice/safari-bio-lights.mp3` | `voice.safari.bio.lights` |
| `public/audio/voice/safari-bio-paint.mp3` | `voice.safari.bio.paint` |
| `public/audio/voice/safari-bio-drum.mp3` | `voice.safari.bio.drum` |
| `public/audio/voice/safari-bio-bead.mp3` | `voice.safari.bio.bead` |
| `public/audio/voice/safari-bio-brush.mp3` | `voice.safari.bio.brush` |
| `public/audio/voice/safari-bio-note.mp3` | `voice.safari.bio.note` |
| `public/audio/voice/safari-bio-sticker.mp3` | `voice.safari.bio.sticker` |
| `public/audio/voice/safari-bio-crayon.mp3` | `voice.safari.bio.crayon` |
| `public/audio/voice/safari-bio-scissors.mp3` | `voice.safari.bio.scissors` |
| `public/audio/voice/safari-bio-ay.mp3` | `voice.safari.bio.ay` |
| `public/audio/voice/safari-bio-bee-letter.mp3` | `voice.safari.bio.bee-letter` |
| `public/audio/voice/safari-bio-ten.mp3` | `voice.safari.bio.ten` |
| `public/audio/voice/safari-bio-book.mp3` | `voice.safari.bio.book` |
| `public/audio/voice/safari-bio-pen.mp3` | `voice.safari.bio.pen` |
| `public/audio/voice/safari-bio-dot.mp3` | `voice.safari.bio.dot` |
| `public/audio/voice/safari-bio-ess.mp3` | `voice.safari.bio.ess` |
| `public/audio/voice/safari-bio-map.mp3` | `voice.safari.bio.map` |
| `public/audio/voice/safari-bio-house.mp3` | `voice.safari.bio.house` |
| `public/audio/voice/safari-bio-home-brush.mp3` | `voice.safari.bio.home-brush` |
| `public/audio/voice/safari-bio-cup.mp3` | `voice.safari.bio.cup` |
| `public/audio/voice/safari-bio-heart.mp3` | `voice.safari.bio.heart` |
| `public/audio/voice/safari-bio-bed.mp3` | `voice.safari.bio.bed` |
| `public/audio/voice/safari-bio-smile.mp3` | `voice.safari.bio.smile` |
| `public/audio/voice/safari-bio-soap.mp3` | `voice.safari.bio.soap` |
| `public/audio/voice/safari-bio-towel.mp3` | `voice.safari.bio.towel` |
| `public/audio/voice/safari-bio-compost-worm.mp3` | `voice.safari.bio.compost-worm` |
| `public/audio/voice/safari-bio-compost-beetle.mp3` | `voice.safari.bio.compost-beetle` |
| `public/audio/voice/safari-bio-mushroom.mp3` | `voice.safari.bio.mushroom` |
| `public/audio/voice/safari-bio-spider.mp3` | `voice.safari.bio.spider` |
| `public/audio/voice/safari-bio-slug.mp3` | `voice.safari.bio.slug` |
| `public/audio/voice/safari-bio-compost-ant.mp3` | `voice.safari.bio.compost-ant` |
| `public/audio/voice/safari-bio-leaf.mp3` | `voice.safari.bio.leaf` |
| `public/audio/voice/safari-bio-sowbug.mp3` | `voice.safari.bio.sowbug` |
| `public/audio/voice/safari-bio-tale-hen.mp3` | `voice.safari.bio.tale-hen` |
| `public/audio/voice/safari-bio-tale-book.mp3` | `voice.safari.bio.tale-book` |
| `public/audio/voice/safari-bio-crown.mp3` | `voice.safari.bio.crown` |
| `public/audio/voice/safari-bio-king.mp3` | `voice.safari.bio.king` |
| `public/audio/voice/safari-bio-dragon.mp3` | `voice.safari.bio.dragon` |
| `public/audio/voice/safari-bio-tale-boat.mp3` | `voice.safari.bio.tale-boat` |
| `public/audio/voice/safari-bio-tale-star.mp3` | `voice.safari.bio.tale-star` |
| `public/audio/voice/safari-bio-castle.mp3` | `voice.safari.bio.castle` |
| `public/audio/voice/safari-bio-pine.mp3` | `voice.safari.bio.pine` |
| `public/audio/voice/safari-bio-trail-owl.mp3` | `voice.safari.bio.trail-owl` |
| `public/audio/voice/safari-bio-boot.mp3` | `voice.safari.bio.boot` |
| `public/audio/voice/safari-bio-gem.mp3` | `voice.safari.bio.gem` |
| `public/audio/voice/safari-bio-trail-map.mp3` | `voice.safari.bio.trail-map` |
| `public/audio/voice/safari-bio-trail-fox.mp3` | `voice.safari.bio.trail-fox` |
| `public/audio/voice/safari-bio-cave.mp3` | `voice.safari.bio.cave` |
| `public/audio/voice/safari-bio-rain.mp3` | `voice.safari.bio.rain` |
| `public/audio/voice/safari-bio-bedroom-bed.mp3` | `voice.safari.bio.bedroom-bed` |
| `public/audio/voice/safari-bio-lamp.mp3` | `voice.safari.bio.lamp` |
| `public/audio/voice/safari-bio-teddy.mp3` | `voice.safari.bio.teddy` |
| `public/audio/voice/safari-bio-bedroom-cat.mp3` | `voice.safari.bio.bedroom-cat` |
| `public/audio/voice/safari-bio-bedroom-book.mp3` | `voice.safari.bio.bedroom-book` |
| `public/audio/voice/safari-bio-bedroom-moon.mp3` | `voice.safari.bio.bedroom-moon` |
| `public/audio/voice/safari-bio-sock.mp3` | `voice.safari.bio.sock` |
| `public/audio/voice/safari-bio-bedroom-mouse.mp3` | `voice.safari.bio.bedroom-mouse` |
| `public/audio/sfx/animal-lion.mp3` | `sfx.animal.lion` |
| `public/audio/sfx/animal-elephant.mp3` | `sfx.animal.elephant` |
| `public/audio/sfx/animal-monkey.mp3` | `sfx.animal.monkey` |
| `public/audio/sfx/animal-duck.mp3` | `sfx.animal.duck` |
| `public/audio/sfx/animal-frog.mp3` | `sfx.animal.frog` |
| `public/audio/sfx/animal-cow.mp3` | `sfx.animal.cow` |
| `public/audio/sfx/animal-giraffe.mp3` | `sfx.animal.giraffe` |
| `public/audio/sfx/animal-zebra.mp3` | `sfx.animal.zebra` |
| `public/audio/sfx/animal-pig.mp3` | `sfx.animal.pig` |
| `public/audio/sfx/animal-horse.mp3` | `sfx.animal.horse` |
| `public/audio/sfx/animal-hen.mp3` | `sfx.animal.hen` |
| `public/audio/sfx/animal-sheep.mp3` | `sfx.animal.sheep` |
| `public/audio/sfx/animal-goat.mp3` | `sfx.animal.goat` |
| `public/audio/sfx/animal-chick.mp3` | `sfx.animal.chick` |
| `public/audio/sfx/animal-parrot.mp3` | `sfx.animal.parrot` |
| `public/audio/sfx/animal-tiger.mp3` | `sfx.animal.tiger` |
| `public/audio/sfx/animal-snake.mp3` | `sfx.animal.snake` |
| `public/audio/sfx/animal-gorilla.mp3` | `sfx.animal.gorilla` |
| `public/audio/sfx/animal-sloth.mp3` | `sfx.animal.sloth` |
| `public/audio/sfx/animal-leopard.mp3` | `sfx.animal.leopard` |
| `public/audio/sfx/animal-penguin.mp3` | `sfx.animal.penguin` |
| `public/audio/sfx/animal-seal.mp3` | `sfx.animal.seal` |
| `public/audio/sfx/animal-bear.mp3` | `sfx.animal.bear` |
| `public/audio/sfx/animal-whale.mp3` | `sfx.animal.whale` |
| `public/audio/sfx/animal-fox.mp3` | `sfx.animal.fox` |
| `public/audio/sfx/animal-owl.mp3` | `sfx.animal.owl` |
| `public/audio/sfx/animal-flake.mp3` | `sfx.animal.flake` |
| `public/audio/sfx/animal-igloo.mp3` | `sfx.animal.igloo` |
| `public/audio/sfx/animal-bee.mp3` | `sfx.animal.bee` |
| `public/audio/sfx/animal-butterfly.mp3` | `sfx.animal.butterfly` |
| `public/audio/sfx/animal-beetle.mp3` | `sfx.animal.beetle` |
| `public/audio/sfx/animal-cricket.mp3` | `sfx.animal.cricket` |
| `public/audio/sfx/animal-ladybug.mp3` | `sfx.animal.ladybug` |
| `public/audio/sfx/animal-snail.mp3` | `sfx.animal.snail` |
| `public/audio/sfx/animal-ant.mp3` | `sfx.animal.ant` |
| `public/audio/sfx/animal-worm.mp3` | `sfx.animal.worm` |
| `public/audio/sfx/animal-fish.mp3` | `sfx.animal.fish` |
| `public/audio/sfx/animal-turtle.mp3` | `sfx.animal.turtle` |
| `public/audio/sfx/animal-dragonfly.mp3` | `sfx.animal.dragonfly` |
| `public/audio/sfx/animal-lily.mp3` | `sfx.animal.lily` |
| `public/audio/sfx/animal-reed.mp3` | `sfx.animal.reed` |
| `public/audio/sfx/animal-bat.mp3` | `sfx.animal.bat` |
| `public/audio/sfx/animal-moth.mp3` | `sfx.animal.moth` |
| `public/audio/sfx/animal-cat.mp3` | `sfx.animal.cat` |
| `public/audio/sfx/animal-mouse.mp3` | `sfx.animal.mouse` |
| `public/audio/sfx/animal-star.mp3` | `sfx.animal.star` |
| `public/audio/sfx/animal-moon.mp3` | `sfx.animal.moon` |
| `public/audio/sfx/animal-squirrel.mp3` | `sfx.animal.squirrel` |
| `public/audio/sfx/animal-dog.mp3` | `sfx.animal.dog` |
| `public/audio/sfx/animal-bunny.mp3` | `sfx.animal.bunny` |
| `public/audio/sfx/animal-bench.mp3` | `sfx.animal.bench` |
| `public/audio/sfx/animal-fountain.mp3` | `sfx.animal.fountain` |
| `public/audio/sfx/animal-pot.mp3` | `sfx.animal.pot` |
| `public/audio/sfx/animal-bread.mp3` | `sfx.animal.bread` |
| `public/audio/sfx/animal-apple.mp3` | `sfx.animal.apple` |
| `public/audio/sfx/animal-spoon.mp3` | `sfx.animal.spoon` |
| `public/audio/sfx/animal-milk.mp3` | `sfx.animal.milk` |
| `public/audio/sfx/animal-jam.mp3` | `sfx.animal.jam` |
| `public/audio/sfx/animal-oven.mp3` | `sfx.animal.oven` |
| `public/audio/sfx/animal-bus.mp3` | `sfx.animal.bus` |
| `public/audio/sfx/animal-car.mp3` | `sfx.animal.car` |
| `public/audio/sfx/animal-plane.mp3` | `sfx.animal.plane` |
| `public/audio/sfx/animal-train.mp3` | `sfx.animal.train` |
| `public/audio/sfx/animal-bike.mp3` | `sfx.animal.bike` |
| `public/audio/sfx/animal-boat.mp3` | `sfx.animal.boat` |
| `public/audio/sfx/animal-heli.mp3` | `sfx.animal.heli` |
| `public/audio/sfx/animal-lights.mp3` | `sfx.animal.lights` |
| `public/audio/sfx/animal-paint.mp3` | `sfx.animal.paint` |
| `public/audio/sfx/animal-drum.mp3` | `sfx.animal.drum` |
| `public/audio/sfx/animal-bead.mp3` | `sfx.animal.bead` |
| `public/audio/sfx/animal-brush.mp3` | `sfx.animal.brush` |
| `public/audio/sfx/animal-note.mp3` | `sfx.animal.note` |
| `public/audio/sfx/animal-sticker.mp3` | `sfx.animal.sticker` |
| `public/audio/sfx/animal-crayon.mp3` | `sfx.animal.crayon` |
| `public/audio/sfx/animal-scissors.mp3` | `sfx.animal.scissors` |
| `public/audio/sfx/animal-ay.mp3` | `sfx.animal.ay` |
| `public/audio/sfx/animal-bee-letter.mp3` | `sfx.animal.bee-letter` |
| `public/audio/sfx/animal-ten.mp3` | `sfx.animal.ten` |
| `public/audio/sfx/animal-book.mp3` | `sfx.animal.book` |
| `public/audio/sfx/animal-pen.mp3` | `sfx.animal.pen` |
| `public/audio/sfx/animal-dot.mp3` | `sfx.animal.dot` |
| `public/audio/sfx/animal-ess.mp3` | `sfx.animal.ess` |
| `public/audio/sfx/animal-map.mp3` | `sfx.animal.map` |
| `public/audio/sfx/animal-house.mp3` | `sfx.animal.house` |
| `public/audio/sfx/animal-cup.mp3` | `sfx.animal.cup` |
| `public/audio/sfx/animal-heart.mp3` | `sfx.animal.heart` |
| `public/audio/sfx/animal-bed.mp3` | `sfx.animal.bed` |
| `public/audio/sfx/animal-smile.mp3` | `sfx.animal.smile` |
| `public/audio/sfx/animal-soap.mp3` | `sfx.animal.soap` |
| `public/audio/sfx/animal-towel.mp3` | `sfx.animal.towel` |
| `public/audio/sfx/animal-mushroom.mp3` | `sfx.animal.mushroom` |
| `public/audio/sfx/animal-spider.mp3` | `sfx.animal.spider` |
| `public/audio/sfx/animal-slug.mp3` | `sfx.animal.slug` |
| `public/audio/sfx/animal-leaf.mp3` | `sfx.animal.leaf` |
| `public/audio/sfx/animal-sowbug.mp3` | `sfx.animal.sowbug` |
| `public/audio/sfx/animal-crown.mp3` | `sfx.animal.crown` |
| `public/audio/sfx/animal-king.mp3` | `sfx.animal.king` |
| `public/audio/sfx/animal-dragon.mp3` | `sfx.animal.dragon` |
| `public/audio/sfx/animal-castle.mp3` | `sfx.animal.castle` |
| `public/audio/sfx/animal-pine.mp3` | `sfx.animal.pine` |
| `public/audio/sfx/animal-boot.mp3` | `sfx.animal.boot` |
| `public/audio/sfx/animal-gem.mp3` | `sfx.animal.gem` |
| `public/audio/sfx/animal-cave.mp3` | `sfx.animal.cave` |
| `public/audio/sfx/animal-rain.mp3` | `sfx.animal.rain` |
| `public/audio/sfx/animal-lamp.mp3` | `sfx.animal.lamp` |
| `public/audio/sfx/animal-teddy.mp3` | `sfx.animal.teddy` |
| `public/audio/sfx/animal-sock.mp3` | `sfx.animal.sock` |
| `public/audio/sfx/animal-bird.mp3` | `sfx.animal.bird` |

## Spoken lines

| id | Exact spoken line |
|---|---|
| explore welcome | `Tap any animal friend to hear their call and fun secrets!` |
| detective stem | `Who makes this sound? Tap the right animal!` |
| lion | `Rrrroaaar!` |
| elephant | `Pawoooo!` |
| monkey | `Ooh ooh aah aah!` |
| duck | `Quack quack!` |
| frog | `Ribbit ribbit!` |
| cow | `Mooo mooo!` |
| giraffe | `Hmmm!` |
| zebra | `Whinny!` |
| pig | `Oink oink!` |
| horse | `Neigh neigh!` |
| hen | `Cluck cluck!` |
| sheep | `Baaa baaa!` |
| goat | `Maaa!` |
| chick | `Cheep cheep!` |
| parrot | `Squawk squawk!` |
| tiger | `Grrr!` |
| snake | `Hisss!` |
| gorilla | `Hoot hoot!` |
| sloth | `Yawn!` |
| leopard | `Grrr!` |
| penguin | `Honk honk!` |
| seal | `Arf arf!` |
| bear | `Groowl!` |
| whale | `Whooom!` |
| fox | `Yip yip!` |
| owl | `Hoo hoo!` |
| flake | `Shhh!` |
| igloo | `Clink!` |
| bee | `Bzzz bzzz!` |
| butterfly | `Flutter flutter!` |
| beetle | `Click click!` |
| cricket | `Chirp chirp!` |
| ladybug | `Tap tap!` |
| snail | `Slide!` |
| ant | `Tap tap!` |
| worm | `Wiggle wiggle!` |
| fish | `Blub blub!` |
| turtle | `Munch munch!` |
| dragonfly | `Whirr!` |
| lily | `Rest!` |
| reed | `Swish!` |
| bat | `Squeak!` |
| moth | `Flutter!` |
| cat | `Meow meow!` |
| mouse | `Squeak squeak!` |
| star | `Twinkle!` |
| moon | `Glow!` |
| squirrel | `Chk chk!` |
| dog | `Woof woof!` |
| bunny | `Sniff sniff!` |
| bench | `Sit!` |
| fountain | `Splash splash!` |
| pot | `Bubble bubble!` |
| bread | `Crackle!` |
| apple | `Crunch!` |
| spoon | `Clink clink!` |
| milk | `Pour!` |
| jam | `Pop!` |
| oven | `Whoosh!` |
| bus | `Beep beep!` |
| car | `Vroom!` |
| plane | `Whoosh!` |
| train | `Choo choo!` |
| bike | `Ring ring!` |
| boat | `Toot toot!` |
| heli | `Chop chop!` |
| lights | `Click!` |
| paint | `Splash!` |
| drum | `Boom tap!` |
| bead | `Click!` |
| brush | `Swish!` |
| note | `La la!` |
| sticker | `Stick!` |
| crayon | `Scribble!` |
| scissors | `Snip snip!` |
| ay | `A says a like apple!` |
| bee-letter | `B says buh like book!` |
| ten | `Ten!` |
| book | `Flip!` |
| pen | `Scribble!` |
| dot | `Tap!` |
| ess | `S says sss like snake and sun!` |
| map | `Look!` |
| house | `Knock knock!` |
| cup | `Sip sip!` |
| heart | `Beat beat!` |
| bed | `Yawn!` |
| smile | `Giggle!` |
| soap | `Scrub!` |
| towel | `Pat pat!` |
| mushroom | `Pop!` |
| spider | `Spin!` |
| slug | `Slide!` |
| leaf | `Crackle!` |
| sowbug | `Curl!` |
| crown | `Shine!` |
| king | `Hello!` |
| dragon | `Whoosh!` |
| castle | `Echo!` |
| pine | `Swish!` |
| boot | `Thud thud!` |
| gem | `Sparkle!` |
| cave | `Drip drip!` |
| rain | `Pitter patter!` |
| lamp | `Click!` |
| teddy | `Squeeze!` |
| sock | `Flop!` |
| bird | `Tweet tweet!` |

## What stays synthesised

Existing `soundEffects.ts` pops, chimes, boing, fanfare, xylophone, and buzz are **unchanged**. Every Safari explore call+fun-fact now has a voice-01 MP3. The eight Worlds Safari stations play their own welcome clip instead of the generic Games welcome. Detective praise stays visual + mouth-call. Letter A explore plays the A bio (“A says a like apple…”).

**Farm Valley** is a closed kit on the same voice-01: area welcome, milk-cow hold/done, letter-trace and pen-count station prompts, four quiz spokenPrompts, all quiz option feedbacks, and every Pen Farm Count round line. Missing Farm lines stay quiet. Generic studio “Yes!” is not registered (would leak her voice onto other islands). Dynamic counting taps still wait.

**Jungle Canopy** unique spoken lines are complete on voice-01.

**Ocean Reef** unique spoken lines are complete on voice-01 (Reef Sort through plane).

**Dino Valley** unique spoken lines are complete on voice-01 (Dino Tracks through the cliff bone).

**Forest Trail** unique spoken lines are complete on voice-01.

**Weather Adventure** unique spoken lines are complete on voice-01.

**Space Blast-Off** unique spoken lines are complete on voice-01.

**Treasure Quest** unique spoken lines are complete on voice-01.

**Color Magic Studio** unique spoken mix phrases are complete on voice-01. Drop names stay quiet.

**Music Garden** unique spoken lines are complete on voice-01.

**Pattern Workshop** unique spoken lines are complete on voice-01.

**Sticker Atelier** unique spoken lines are complete on voice-01.

**Barnyard Tales** unique spoken lines are complete on voice-01.

**Starlight Tales** unique spoken lines are complete on voice-01. Rocket Pip step lines reuse the Space Blast-Off kit.

**Deep Sea Tales** unique spoken lines are complete on voice-01.

**Phonics Meadow** unique spoken lines are complete on voice-01.

**Counting Grove** unique spoken lines are complete on voice-01.

**Shapes & Patterns** unique spoken lines are complete on voice-01.

**Feelings & Emotions** unique spoken lines are complete on voice-01.

**Healthy Habits** unique spoken lines are complete on voice-01.

**Family & Cozy Home** unique spoken lines are complete on voice-01.

**Sunny Garage** unique spoken lines are complete on voice-01.

**Windy Runway** unique spoken lines are complete on voice-01.

**Busy Harbour** is a closed island: ferry horn through crate stacks and harbour-bed. Remaining attic, coil-rope, bubbles, and scoop still wait. The ship-letter draft clue stays silent. Do not register generic `Yes!`.

## Mute keys (unchanged)

- Voice / narrator clip: `localStorage app_voice_muted` (`speechCoordinator`)
- Taps / animal SFX: `localStorage app_sfx_muted` (`soundEffects`)
