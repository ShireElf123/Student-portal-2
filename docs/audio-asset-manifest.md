# Toddler audio asset manifest (Safari kits)

**Animal Safari** (the in-app Safari section — Games tab plus each world’s Safari station) uses **one owner-selected Arena voice** (`voice-01`): explore welcome, detective stem, and mouth-performed calls. Chat still cannot play or receive MP3s — hear them in the app after a Vercel push. If a file 404s, duck/cow/bird fall back to short Web Audio cartoon calls; other friends stay quiet (no device narrator inside Safari).

Do **not** claim phone playback is verified until the owner listens on a device.

No runtime ElevenLabs (or other TTS) calls. No API keys in the client or this repository.

## Expected filenames

| Path | Clip id |
|---|---|
| `public/audio/voice/narrator-safari-explore-welcome.mp3` | `voice.narrator.safari-explore-welcome` |
| `public/audio/voice/narrator-safari-detective-stem.mp3` | `voice.narrator.safari-detective-stem` |
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

Existing `soundEffects.ts` pops, chimes, boing, fanfare, xylophone, and buzz are **unchanged**. Savanna and Farm explore bios (plus jungle parrot/tiger/snake/gorilla) play as voice-01 MP3s. Other worlds still show fun-facts on screen until their bio clips exist. Detective praise stays visual + mouth-call. Letter A explore/detective plays `animal-ay.mp3` (“A says a like apple!”).

## Mute keys (unchanged)

- Voice / narrator clip: `localStorage app_voice_muted` (`speechCoordinator`)
- Taps / animal SFX: `localStorage app_sfx_muted` (`soundEffects`)
