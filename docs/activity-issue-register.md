# Activity issue register (Phase 1.4)

Verification labels: **source-inspected** | **unit-tested** | **browser-tested** | **device-tested**.

Stamp Mural remains **unit-tested**, not device-tested.

## Inventory (source-inspected)

World activities **510** unique IDs (unchanged). Registry 567. Picture books 85. Safari alphabet is now 26 pages A–Z.

## Phase 1.4 status

| ID | Status | Evidence |
|---|---|---|
| ISS-safari-z | **Fixed, not browser/device verified** | Painted `/spreads/safari-alphabet-26.jpg`. Page “Z is for Zebra”, subtitle A through Z. unit: `pictureBooksLibrary.test.ts`. N-on-tree and X-in-Fox are letter-in-word pages, left as designed. |
| ISS-06 | **Fixed, not browser/device verified** | Playhouse scenes use the show’s painted cover (curtain fallback). Emoji stays as a small chip, not the whole interior. unit: `ToddlerPlayhouse.test.tsx`. Per-scene unique paintings still blocked (too many images). |
| ISS-quiet | **Fixed, not browser/device verified** | Pause no longer resets remaining time. Resume, Start over, unmount-safe timeout, `motion-reduce` on the bar. unit: `ToddlerFocusBoard.test.tsx`. |
| ISS-trace | **Investigated; tightened tests, no engine rewrite** | Scribbles and reverse taps still fail. A toddler wobble of 3 units still completes. Did not restore max-index advance. unit: `ToddlerLetterTrace.test.tsx`. |
| ISS-memory-farm | **Fixed, not browser/device verified** | First cozy-board clear pays match stars + board bonus + `onComplete`. Play Again does not pay again. unit: `ToddlerMemoryGame.test.tsx`. |
| ISS-emoji | **Partial fix + source sweep** | No 🫀🫙🪟… in toddler chrome. Counter ghost 🟡 → 💛. Color-emoji fonts stay before `Segoe UI`. unit: `toddlerChrome.test.ts`. Not a device font check. |
| ISS-secret-mix | **Fixed + hardened, not browser/device verified** | Legacy key migrates once onto the active learner. Malformed JSON / non-arrays do not crash or leak. unit: `ToddlerSecretZones.test.tsx`. |
| ISS-nav | Fixed in 1.3 | unit still green |
| ISS-pattern | Fixed in 1.3 | unit still green |
| ISS-shape-square | Fixed in 1.3 | unit still green |
| ISS-STAMP-2 | unit-tested prior | LandRooms tests re-run this phase |
| ISS-books-alt | Investigated; no change | Empty `alt` inside named buttons avoids double-speaking |
| ISS-05 | Investigated; no change this phase | 3-hit station pay gate still unit-green; extra Safari Games missions need a product pass |

## Still needs a physical phone

Stamp mural smoothness, Quiet pause, Playhouse painted scenes, Safari Z page, Memory replay, first-row tabs.
