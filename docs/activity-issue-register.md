# Activity issue register (Phase 1.3)

Verification labels: **source-inspected** | **unit-tested** | **browser-tested** | **device-tested**.

Classes: **confirmed-source** | **confirmed-test** | **suspected** | **design** | **verified-working**.

Stamp Mural is **unit-tested**, not device-tested. This conversation did not confirm a finger pass.

## Inventory (source-inspected)

| Surface | Count | Notes |
|---|---|---|
| Worlds | 12 | `ALL_TODDLER_WORLDS` |
| World activities | **510** unique IDs | All registered; `listWorldActivities()` |
| Registry | 567 | Worlds plus books/games/assessments |
| Picture books | 85 | Stories tab |
| Playhouse shows | 20 | Playhouse tab |
| K1 studio games | 16 | Worlds `k1-studio` rows |
| Secret zones | 3 | Worlds extras |
| Guided assessments | 12 | Not toddler catalogue |

World types (engine in `activityQuality.ts`): clue-detective 163, counting 85, sorting 44, land-play 41, pattern-match 30, sound-detective 24, k1-studio 16, letter-trace 15, habitat-match 13, memory-match 12, balloon-sky 12, color-lab 9, rhyme-garden 9, story-adventure 9, animal-safari 8, piano-melody 7, open-play 7, bubble-pop 6.

**510/510 source-accounted.** Not 510 device plays.

## Engine audit (source-inspected, sample unit-tested)

| Engine | IDs | Mechanic | Notes |
|---|---|---|---|
| WorldsNavigator.quiz | clue 163 + sound 24 + habitat 13 + pattern 30 | tap-quiz | Pattern now uses “Tap what comes next”. Not device-tested. |
| WorldsNavigator.counting | 85 | tap-count | |
| WorldsNavigator.sorting | 44 | tap-sort | |
| ToddlerLandRooms | 41 | hold/drag | Stamp mural unit-tested; crate drop-on-up unit-tested |
| ToddlerK1Studio | 16 | tap rounds | |
| ToddlerLetterTrace | 15 | freeform-trace | Accuracy not 100% |
| ToddlerMemoryGame | 12 | tap-memory | Per-match stars + station complete — suspected farming on replay |
| ToddlerBalloonSky | 12 | 3-hit station | unit 1.1 |
| ToddlerColorLab | 9 | tap-mix + paint | Mix is tap, not stamp |
| ToddlerRhymeGame | 9 | tap-quiz | |
| WorldsNavigator.story | 9 | multi-step | |
| ToddlerAnimalSafari | 8 | tap explore | Games surface `missionSurface` 1.1 |
| ToddlerMusicPiano | 7 | tap keys | |
| ToddlerOpenPlay | 7 | hold | |
| ToddlerBubblePopGame | 6 | 3-hit station | unit 1.1 |
| unmounted `feed-friend` | 0 | — | Type exists; no rows |

## Fixed this phase (1.3)

| ID | Class | Fix | Verification |
|---|---|---|---|
| ISS-nav | confirmed-source | Phone first row is Worlds, Stories, Games, Focus. All eight tabs remain. | unit-tested (`toddlerSpaceTabs`, `ToddlerSpaceNav`) |
| ISS-pattern | confirmed-source | Pattern activities no longer say “Tap who it is”. Badge + `quizTapHint`. | unit-tested (farm sound still “Tap who made the sound”) |
| ISS-secret-mix | confirmed-source | Secret finds key is `toddler-secret-zone-finds:{learnerId}`. Legacy global key migrates once. | unit-tested |
| ISS-shape-square | confirmed-source | Shape match draws CSS square/circle/triangle; explorer square option is a box, not a book. | source-inspected + unit suite |

## Still open

| ID | Class | Severity | Why open |
|---|---|---|---|
| ISS-STAMP-2 | verified-working at unit | — | Wall-local stamp. **Not device-tested** this phase. |
| ISS-safari-z | confirmed-source | content gap | Safari alphabet is A–Y (25 pages); subtitle already says Z comes next. Adding Z needs a painted page — not this phase (no catalogue/art expansion). |
| ISS-06 | suspected | presentation | Playhouse scene interiors are still emoji (`scene.illustration`). Covers can be images. Needs art, not a mechanic rewrite. |
| ISS-quiet | design | low | Quiet Corner is a short finite body timer. Pause would turn it into a stay-on-screen control. Left as designed. |
| ISS-books-alt | design | a11y | Many `alt=""` sit inside buttons that already name the work. Empty alt avoids double-speaking. |
| ISS-emoji | suspected | presentation | Full-app tofu not re-swept this phase. Prefer Unicode 6–9 in new chrome. |
| ISS-trace | suspected | feedback | Letter-trace accuracy is not 100%. Do not restore max-index advance. |
| ISS-memory-farm | suspected | rewards | Memory pays a star per match and again on board clear; replay can farm. Needs a product rule before changing delight stars. |
| ISS-05 | suspected | missions | Safari extras / Games pay gate beyond 3-hit station. 1.1 unit still green. |

## Navigation before / after

**Before:** 4-column phone row 1 = Worlds, Stories, Playhouse, Phonics. Games and Focus sat on row 2.

**After:** row 1 = Worlds, Stories, Games, Focus. Row 2 = Playhouse, Phonics, Counting, My Buddy. Same eight destinations, same colours, tighter mobile padding.

## Representative validation

| Sample | Label | Result |
|---|---|---|
| 510 IDs + quiz correctness + pattern prompts | source + unit | inventory test |
| Space tabs first row | unit | pass |
| Secret finds isolated per learner | unit | pass |
| Farm sound detective copy | unit | “Tap who made the sound” |
| Stamp mural path | unit (prior) | not device |
| Safari Z page | source | missing, not added |
| Live preview / device | — | **not run** |
