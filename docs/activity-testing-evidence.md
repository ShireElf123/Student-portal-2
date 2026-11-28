# Phase 1.4 testing evidence

Do not treat this as 510 playtests. Playwright is only a Vitest optional peer here; this phase did not add a browser-test framework.

## External notes that shaped the fixes

- [MDN `prefers-reduced-motion`](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion) — Quiet timer bar uses `motion-reduce:transition-none` so the countdown bar does not keep sliding when the OS asks for less motion.
- [MDN `setTimeout` / cleanup](https://developer.mozilla.org/en-US/docs/Web/API/Window/setTimeout) — Timer intervals must clear on pause and unmount; pause must not reset remaining time.
- WCAG 2.2 target size / Apple HIG 44pt — Quiet Pause/Resume controls stay `min-h-12`. Letter-trace still uses a 16-unit on-path radius (about toddler-finger sized on a phone canvas) and still rejects off-path scribbles.

Other projects’ tests were not copied. They only suggested failure modes (pause resetting, replay paying twice, malformed JSON).

## Labels used

| Label | This phase |
|---|---|
| source-inspected | Safari A–Z mapping, Playhouse covers, tofu scan |
| unit-tested | Z page, timer pause/resume, memory replay, secret JSON, letter wobble, nav, stamp tests re-run. Final run on `457291e`: **310 passed / 9 skipped**. |
| automated-browser-tested | none (no Playwright runner in this repo) |
| device-tested | **Six user checks on a physical phone, 2026-10-22.** Not every activity, not every device. |

## Physical phone (user, 2026-10-22)

The product owner reported all six succeeded:

1. Safari Alphabet — opened the story; Zebra/Z page present.
2. Quiet Corner — Start, Pause, Resume, Start over.
3. Playhouse — scene interiors and painted artwork.
4. Memory Match — completed a round; Play Again replay/rewards.
5. Stamp Mural — stamping succeeded.
6. Mobile nav — Worlds, Stories, Games, Focus on the first row; eight tabs kept.

## Automated final verification (`457291e`)

- `./node_modules/.bin/tsc --noEmit` — exit 0
- `./node_modules/.bin/vitest run` — 310 passed, 9 skipped (firestore rules without emulator)
- `npm run build` — ok; Vite chunk-size warnings (`ToddlerWorldView` ~971 kB gzip 244 kB, plus other >500 kB vendor chunks)
- Inventory — 510 unique world activity IDs, registry 567, 85 picture books
