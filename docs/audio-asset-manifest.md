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

**Ocean Reef** is the next closed island: area welcome, reef bubbles station, feed-the-reef hold/done, and dolphin/jellyfish quiz prompts. Missing Ocean lines stay quiet. Quiz feedbacks, land-vs-sea sorting, and reef-sort studio rounds still wait.

## Mute keys (unchanged)

- Voice / narrator clip: `localStorage app_voice_muted` (`speechCoordinator`)
- Taps / animal SFX: `localStorage app_sfx_muted` (`soundEffects`)
