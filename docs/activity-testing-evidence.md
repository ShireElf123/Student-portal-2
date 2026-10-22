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
| unit-tested | Z page, timer pause/resume, memory replay, secret JSON, letter wobble, nav, stamp tests re-run |
| automated-browser-tested | none (no Playwright runner in this repo) |
| device-tested | none |
