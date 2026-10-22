# Toddler audio asset manifest (Phase 1 sample pack)

The Safari explore welcome MP3 is in the repo (Arena spoken clip). Chat cannot accept MP3 uploads. Duck / cow / bird play a short Web Audio cartoon call until Pixabay files are added via GitHub (`public/audio/sfx/`). Missing files fail closed for voice clips and fall back to synth for those three animals.

Do **not** claim animal-SFX phone playback is verified until those three files are supplied and tested on a device.

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
| `sfx.animal.duck` | sfx | — | Pixabay SFX, **manual** download | [Pixabay Content License](https://pixabay.com/service/license-summary/) — free commercial use; no standalone redistribution; attribution optional | https://pixabay.com/sound-effects/ | Pending (contributor) | Safari friend id `duck` |
| `sfx.animal.cow` | sfx | — | Pixabay SFX, manual download | Pixabay Content License | https://pixabay.com/sound-effects/ | Pending (contributor) | Safari friend id `cow` |
| `sfx.animal.bird` | sfx | — | Pixabay SFX, manual download | Pixabay Content License | https://pixabay.com/sound-effects/ | Pending (contributor) | Safari friend id `bird` (park roster) |

The [official Pixabay API](https://pixabay.com/api/docs/) documents **images and videos only**. Do not use it to fetch these sounds.

## What stays synthesised

Existing `soundEffects.ts` pops, chimes, boing, fanfare, xylophone, and buzz are **unchanged**. They are not replaced by files.

## Mute keys (unchanged)

- Voice / narrator clip: `localStorage app_voice_muted` (`speechCoordinator`)
- Taps / animal SFX: `localStorage app_sfx_muted` (`soundEffects`)
