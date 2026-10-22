# Toddler audio asset manifest (Safari kits)

**Animal Safari** (the in-app Safari section — Games tab plus each world’s Safari station) uses **one owner-selected Arena voice** (`voice-01`): explore welcome, detective stem, and mouth-performed calls. Chat still cannot play or receive MP3s — hear them in the app after a Vercel push. If a file 404s, duck/cow/bird fall back to short Web Audio cartoon calls; other friends stay quiet (no device narrator inside Safari).

Do **not** claim phone playback is verified until the owner listens on a device.

No runtime ElevenLabs (or other TTS) calls. No API keys in the client or this repository.

## Expected filenames

| Path | Clip id |
|---|---|
| `public/audio/voice/narrator-safari-explore-welcome.mp3` | `voice.narrator.safari-explore-welcome` |
| `public/audio/voice/narrator-safari-detective-stem.mp3` | `voice.narrator.safari-detective-stem` |
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
| `public/audio/sfx/animal-bird.mp3` | `sfx.animal.bird` (park roster; previous voice-00 until a park batch) |

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
| bird | `Chirp chirp!` |

## What stays synthesised

Existing `soundEffects.ts` pops, chimes, boing, fanfare, xylophone, and buzz are **unchanged**. Fun-facts and “Yes! Correct!” lines are on-screen this batch (call+fact MP3s are the next Safari turn).

## Mute keys (unchanged)

- Voice / narrator clip: `localStorage app_voice_muted` (`speechCoordinator`)
- Taps / animal SFX: `localStorage app_sfx_muted` (`soundEffects`)
