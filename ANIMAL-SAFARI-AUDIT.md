# Animal Safari — "gets stuck after tapping the duck" audit

Branch: `arena/635ad565-student-portal-2` · Commits: `db088e5` (fix) and `155d99d` (hub-entry test)
Scope reviewed: every branch on the remote (`main`, `arena/70beb8f0`, `arena/01a1087b`, `arena/01a10c6b` / PR #5) and the full history of the Safari, the games hub, the speech layer and the Animal World activities.

---

## 1. Verdict

The freeze is real and reproducible, and it is **not** a crash. Two defects combine:

| # | Defect | Where | Effect |
|---|--------|-------|--------|
| 1 | The Savanna Animal Detective round **never advanced by itself**. Solving only highlighted the animal and waited for the small "Next Mystery Animal →" button; the reward-honesty change `8b762c7` added `if (showCelebration) return;`, so **every animal tap after a solve became a silent no-op** (only a "pop" sound). | `src/components/ToddlerAnimalSafari.tsx` | Child/user taps the correct animal, then taps it again (and again) — the screen stays on the same question with the same sound and the same score. The only escapes were spotting the small Next button, or leaving and re-opening the game (which remounts and starts a fresh round). Matches the report exactly. |
| 2 | Speech callbacks could be **silently dropped**, and the safety watchdog was **shared state**. A `speakText(..., { onEnd })` superseded inside the coordinator's 100 ms scheduling window never fires `onEnd`, and a late cancel-error from a *previous* utterance cleared the *current* utterance's watchdog. | `src/utils/speechUtils.ts` | Any flow that reveals/advances only from `onEnd` froze permanently: the Animal World "Safari Sound Detective" activities (answer cards stay `disabled` forever) and story steps. |

Also checked and **not** affected: the Animal Quiz (auto-advances correctly via `onEnd` → 650 ms, with its own 7.5 s fallback — verified end-to-end), star/evidence recording, daily caps, unlock logic, navigation and the deep-link routes.

### Why it looked like a regression

* Provenance of defect 1: the initial commit `bd523c0` already required the manual "Next Mystery Animal →" press, and `8b762c7` ("Toddler missions pay on real completion…", the newest change to game logic) added the silent `if (showCelebration) return;` guard. From that commit on, taps after a solve produce nothing at all, so the screen reads as frozen.
* `a2c8f92` only added evidence fields to the same handler; `da574a3` ("UI updates") changed quiz star gating + voice personas, not the advance logic. No branch contains a differently-implemented Animal Safari (no `quack-quack` string exists in any branch — the audible line is "Who makes this sound? QUACK QUACK!! Tap the right animal!").

---

## 2. Files changed

| File | Change |
|------|--------|
| `src/components/ToddlerAnimalSafari.tsx` | Correct answer now praises the animal **and then advances on its own**: praise speech → 900 ms celebration pause → next mystery (timers in a ref, cancellable). The manual "Next Mystery Animal →" button remains an immediate shortcut, taps during the celebration still cannot farm stars, and a timer-based release plus mode/unmount cleanup guarantee progress when the engine never reports the end. |
| `src/utils/speechUtils.ts` | Watchdog is now owned by the utterance token (`activeWatchdog` + `clearActiveWatchdog(token?)`). A late cancel event from a superseded utterance can no longer disarm the live utterance's watchdog; `stop()` still clears the active one. The documented contract ("a superseded line fires no callbacks") is now spelled out at the scheduling site. |
| `src/components/ToddlerWorldsNavigator.tsx` | New `speakThenRun(feedback, pauseMs, onSpokenEnd)` helper: guarantees the celebration reveal / story advance exactly once (speech end **or** timer fallback), with timers cleared on activity start, back-navigation and unmount. |
| `src/components/ToddlerAnimalSafari.test.tsx` (new) | 8 gameplay regression tests. |
| `src/utils/speechUtils.test.ts` (new) | 5 speech-contract tests with a fake Chrome-like engine. |
| `src/components/ToddlerWorldsNavigator.test.tsx` (new) | 3 Animal World detective tests. |
| `package.json` / `package-lock.json` | Dev-only test tooling: `jsdom`, `@testing-library/react`, `@testing-library/dom` (no runtime dependency added). |

---

## 3. Tests performed and results

```
npx tsc --noEmit                    → clean
npx vitest run                      → 13 files, 103 tests passed (baseline before this work: 10 files, 87 tests)
npm run build                       → vite build + server bundle OK
dev server (npm run dev)            → /api/health 200, app shell 200, all touched modules transform with no errors
```

Pre-fix vs post-fix (each new suite was executed against the original files to prove it catches the reported behaviour):

| Suite | Original code | Fixed code |
|-------|---------------|------------|
| `ToddlerAnimalSafari.test.tsx` (8) | **4 failed** — `expected 'ROAAAR!' to be 'PAWOOO!'` (still on the same question after solving), `expected 1 to be 4` (only one round possible), `expected 'ROAAAR!' not to be 'ROAAAR!'` (no release when speech never ends), hub entry point stuck | 8 passed |
| `ToddlerWorldsNavigator.test.tsx` (3) | **1 failed** — after 20 s of simulated play the celebration never appeared; answer cards stayed disabled | 3 passed |
| `speechUtils.test.ts` (5) | **1 failed** — current utterance lost its watchdog to a stale cancel event → `onEnd` never fired | 5 passed |

The Safari suite covers the exact reported flow and its boundaries:
tap the duck/lion → spoken confirmation → **automatic** next question (repeated 4 rounds from taps alone); progress even when the engine never reports the end (muted voice / stalled utterance); one star payment per mystery (no farming); manual Next still works and cannot double-advance; wrong animal → gentle coaching, no advance; free-play explorer mode unchanged (first-tap star per animal per day).

---

## 4. What could not be verified here

* No real browser/audio device is available in this environment, so the audible quality of the voice and the OS-level speech engine were simulated with a Chrome-semantics fake (including late cancel events and stalled utterances). The component/game logic, state transitions and timers were exercised for real.
* The live dev server is running for a manual click-through: Games → 🌿 Safari → tap the mystery animal; it now confirms and moves on by itself. Telling the difference between "auto-advance" and the old "dead screen" only needs one tap.

## 5. Follow-up audit (same failure class, after the fix shipped)

The Safari flow was confirmed working by the user. Sweeping every other place that
gates progress on speech (`onEnd` call sites) found one more hidden freeze:

| Site | Status |
|------|--------|
| Safari detective | fixed (auto-advance + timer release) |
| Animal World clue activity + story steps | fixed (`speakThenRun`) |
| Animal Quiz + Shapes quiz | safe — already had their own 7–7.5 s fallback timers |
| Phonics tiles | safe — `onEnd` is an empty callback |
| Sorting / Color Lab reveals | safe — timer/callback driven, not speech-gated |
| **Counting activity ("Count the Yellow Chicks" etc.)** | **was still freeze-prone** — the number buttons lock with `disabled={countingAnswered}` and the celebration was revealed only from `onEnd` |

`src/components/ToddlerWorldsNavigator.tsx` now routes the counting victory
through `speakThenRun` as well, with two regression tests (the second fails on
the pre-fix code with the activity stuck on screen).

### Deleted test coverage

Commit `da574a3` deleted `src/data/__tests__/toddlerDailyAdventure.test.ts`
(246 lines) and `curriculumProfiles.test.ts` (94 lines), leaving the daily
counter/set/mission engine — the rules every toddler game pays through — with no
coverage. The recovered files were checked against today's code and are stale
(they assert a removed API: `__resetAccountScopeForTests`, `startDailyMission`,
`getMissionById`, `{ isNew, size }`, mission rewards paid up-front). Rather than
assert obsolete behaviour, `src/data/toddler/toddlerDailyAdventure.test.ts` was
rewritten for the current contract: per-learner per-day counters, one reward per
distinct member, completion exactly once per matching tab/subactivity, the
all-three boundary, and stale-day resets (10 tests).

`curriculumProfiles.test.ts` was rewritten the same way (11 tests): the four
frameworks, the `us-ccss` default, remembering a choice in localStorage,
listener/event fan-out, ignoring an unknown or retired profile id, and the rule
that an unverified framework never shows a standard code while still showing the
learning goal.

### Play-through coverage for the remaining toddler games

`src/components/toddlerGamesPlaythrough.test.tsx` (7 tests) drives every other
toddler game to a finish and starts it again, with speech mocked as a **muted
engine that never reports the end of an utterance** — the harshest condition for
this failure class:

| Game | Property pinned |
|------|-----------------|
| Memory Card Match | a child can turn cards over after every wrong pair and still reach "Super Memory Champion!" (4 pairs + 3 win stars), then replay |
| Rhyme Time | all 16 questions answerable from taps alone, completion screen, replay |
| Balloon Sky Carnival | spawns, pops the target, refills the sky, keeps a daily target counter |
| Feed Benny Bunny | five carrots then celebration, and no extra stars for over-feeding |
| Color Magic Mixing Lab | two drops always resolve to a mixed colour on a timer, then "Mix Another Color" |
| Rainbow Piano | a guided song is played to "Completed!" from the highlighted keys alone |
| Bubble Pop Phonics | a child who pops the whole wave is auto-refilled and can keep playing |

jsdom has no animation engine, so the suite renders `motion/react` elements as
plain DOM (one component type per tag) and stubs `ResizeObserver` + canvas
`getContext`; everything else — state, timers, speech gating — is the real code.

## 6. Suggested follow-up (not changed on purpose)

* ~~The Safari's first question is always the lion~~ — done: the opening mystery is now drawn at random from the six animals (`ToddlerAnimalSafari.tsx`), with a test that fails on the old `SAFARI_ANIMALS[0]` behaviour.
* Other `onEnd`-gated calls that already carry their own fallback (the Animal Quiz) were left untouched.
