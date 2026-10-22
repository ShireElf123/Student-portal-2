# Toddler audio asset manifest (Safari Savanna kit)

Savanna Animal Detective uses **one owner-selected Arena voice** (`voice-01`): explore welcome, detective stem, and mouth-performed calls for the eight default friends. Chat still cannot play or receive MP3s — hear them in the app after a Vercel push. If a file 404s, duck/cow/bird fall back to short Web Audio cartoon calls; other friends stay quiet (no device narrator inside Safari).

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
| bird | `Chirp chirp!` |

## What stays synthesised

Existing `soundEffects.ts` pops, chimes, boing, fanfare, xylophone, and buzz are **unchanged**. Fun-facts and “Yes! Correct!” lines are on-screen this batch (call+fact MP3s are the next Safari turn).

## Mute keys (unchanged)

- Voice / narrator clip: `localStorage app_voice_muted` (`speechCoordinator`)
- Taps / animal SFX: `localStorage app_sfx_muted` (`soundEffects`)
