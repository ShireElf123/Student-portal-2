# Toddler audio asset manifest (Phase 1 sample pack)

All four sample clips are in the repo, spoken by the **same owner-selected Arena voice** (welcome + mouth-performed quack / moo / chirp). Chat still cannot play or receive MP3s — hear them in the app after a Vercel push. If a file 404s, duck/cow/bird fall back to the short Web Audio cartoon calls.

Do **not** claim phone playback is verified until the owner listens on a device.

No runtime ElevenLabs (or other TTS) calls. No API keys in the client or this repository.

## Expected filenames

Place these four files (MPEG Layer III, keep each short — under ~5s for SFX, under ~8s for the welcome):

| Path | Clip id |
|---|---|
| `public/audio/voice/narrator-safari-explore-welcome.mp3` | `voice.narrator.safari-explore-welcome` |
| `public/audio/sfx/animal-duck.mp3` | `sfx.animal.duck` |
| `public/audio/sfx/animal-cow.mp3` | `sfx.animal.cow` |
| `public/audio/sfx/animal-bird.mp3` | `sfx.animal.bird` |

## Registry (source / licence)

Source of truth: `src/data/toddler/audioRegistry.ts`.

| id | Channel | Exact spoken line (if any) | Source | Licence | URL | Author | Notes |
|---|---|---|---|---|---|---|---|
| `voice.narrator.safari-explore-welcome` | voice | `Welcome to Savanna Animal Detective! Tap any animal friend to hear their call and fun secrets!` | Arena `generate_speech` (file in repo, ~29 KB) | App-owned generated speech. Swap later if you want ElevenLabs. | — | Arena voice-00 (owner-selected) | Only this default Savanna explore welcome. Other titles stay on Web Speech. Parent recordings still win. |
| `sfx.animal.duck` | sfx | `Quack quack!` | Arena `generate_speech` (same voice-00) | App-owned generated speech | — | Arena voice-00 | Safari friend id `duck`. Mouth sound, not a farm recording. |
| `sfx.animal.cow` | sfx | `Mooo mooo!` | Arena `generate_speech` (same voice-00) | App-owned generated speech | — | Arena voice-00 | Safari friend id `cow` |
| `sfx.animal.bird` | sfx | `Chirp chirp!` | Arena `generate_speech` (same voice-00) | App-owned generated speech | — | Arena voice-00 | Safari friend id `bird` (park roster) |

## What stays synthesised

Existing `soundEffects.ts` pops, chimes, boing, fanfare, xylophone, and buzz are **unchanged**. They are not replaced by files.

## Mute keys (unchanged)

- Voice / narrator clip: `localStorage app_voice_muted` (`speechCoordinator`)
- Taps / animal SFX: `localStorage app_sfx_muted` (`soundEffects`)
