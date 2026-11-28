# Activity issue register (Phase 1.4)

Verification labels: **source-inspected** | **unit-tested** | **browser-tested** | **device-tested**.

These six checks do **not** prove every world activity or every device. Playwright is not a runner in this repo (only an unused Vitest peer). Automated-browser-tested remains **none**.

User physical-phone checks recorded **2026-10-22** (reporter: product owner, this conversation). Scope: the six items below, not the full 510-ID catalogue.

## Inventory (source-inspected + unit-tested)

World activities **510** unique IDs (unchanged). Registry 567. Picture books 85. Safari alphabet is 26 pages A–Z.

Final verification run on `457291e`: `./node_modules/.bin/tsc --noEmit` 0; vitest **310 passed / 9 skipped**; `npm run build` ok (chunk-size warnings only).

## Phase 1.4 status

| ID | Status | Evidence |
|---|---|---|
| ISS-safari-z | **Fixed and user-verified on a physical phone** | Painted `/spreads/safari-alphabet-26.jpg` (~289 KB JPEG q85, same band as A–Y). Page “Z is for Zebra”. unit: `pictureBooksLibrary.test.ts`. Phone 2026-10-22: opened the alphabet story and confirmed the Zebra/Z page. Does **not** certify every letter page. N-on-tree and X-in-Fox remain letter-in-word by design. First fetch of a ~300 KB spread can still stall on a cold cache / weak cell; the reader loads one page at a time, so Z does not download the other 25. |
| ISS-06 | **Fixed and user-verified on a physical phone** (cover-as-interior). Unique per-scene paintings still **blocked**. | Scenes use `show.coverImage ?? PLAYHOUSE_COVERS[id] ?? /covers/playhouse-curtain.jpg`. Emoji is a chip, not the interior. unit: `ToddlerPlayhouse.test.tsx`. Phone 2026-10-22: scene interiors and painted artwork. Still no unique interior painting per scene (too many images). |
| ISS-quiet | **Fixed and user-verified on a physical phone** | Pause keeps remaining seconds. Resume, Start over (`resetToken`), unmount-safe timeout, `motion-reduce` on the bar. unit: `ToddlerFocusBoard.test.tsx`. Phone 2026-10-22: Start, Pause, Resume, Start over. |
| ISS-trace | **Investigated; tightened tests, no engine rewrite** | Scribbles and reverse taps still fail. A toddler wobble of 3 units still completes. Did not restore max-index advance or a 14-unit end gate. unit: `ToddlerLetterTrace.test.tsx`. **Not** in the 2026-10-22 phone set. Accuracy is not 100% and is not claimed. |
| ISS-memory-farm | **Fixed and user-verified on a physical phone** | First cozy-board clear pays match stars + board bonus + `onComplete`. Play Again does not pay again. unit: `ToddlerMemoryGame.test.tsx`. Phone 2026-10-22: completed a round and used Play Again for replay / rewards. |
| ISS-emoji | **Partial fix + source sweep. Not device-verified.** | No 🫀🫙🪟… in toddler chrome. Counter ghost 🟡 → 💛. Color-emoji fonts before `Segoe UI`. unit: `toddlerChrome.test.ts`. Phone checks did not include a font/tofu pass. Other OS/fonts untested. |
| ISS-secret-mix | **Fixed + hardened, not browser/device verified** | Legacy key migrates once onto the active learner. Malformed JSON / non-arrays do not crash or leak. unit: `ToddlerSecretZones.test.tsx`. Two-learner isolation was **not** in the phone set. |
| ISS-nav | **Fixed and user-verified on a physical phone** | unit: `toddlerSpaceTabs.test.ts` / `ToddlerSpaceNav.test.tsx` (1.3). Phone 2026-10-22: Worlds, Stories, Games, Focus on the first row; all eight tabs retained. |
| ISS-pattern | **Fixed and automated-tested** (1.3). Not in the phone set. | Pattern quizzes say what comes next. unit still green this run. |
| ISS-shape-square | **Fixed and automated-tested** (1.3). Not in the phone set. | Shape match draws a real square, not a book glyph. unit still green this run. |
| ISS-STAMP-2 | **Fixed and user-verified on a physical phone** | Freeform mural: wall-local pointer, print at release. Land crate drag unchanged. unit: `ToddlerLandRooms.test.tsx`. Phone 2026-10-22: stamping activity succeeded. Does not certify every stamp world or every phone. |
| ISS-books-alt | **No change needed** | Empty `alt` inside named buttons avoids double-speaking. source-inspected; not a phone item. |
| ISS-05 | **No change this phase** | 3-hit station pay gate still unit-green. Extra Safari Games missions still need a product pass. Not in the phone set. |

## Still open / limited

- Letter-trace: wobble-vs-scribble unit only; no phone pass; no engine rewrite.
- Emoji/tofu: source + font-stack unit only.
- Secret-zone: per-learner + malformed JSON unit only; two real learners not phone-tested.
- Playhouse: one painted cover per show, not a unique interior per scene.
- Storybook: 85 books / Safari A–Z mapping unit-tested; phone confirmed **Z** only, not every spread.
- No Playwright / in-browser runner. Chunk-size build warnings (`ToddlerWorldView` ~971 kB) are unchanged and not a test failure.
- Catalogue of 510 IDs is **not** playtested end-to-end.
