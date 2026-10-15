# PR #5 review — "Add validated generated content and authenticated AI gateway"

Review only: nothing in this document has been merged, rebased, or pushed to PR #5's
branch. All figures come from `git`/`gh` in this repository plus a throwaway
worktree of the branch that was deleted again after the checks below.

## Verdict

**Hold — rebase onto `main`, resolve three files, then merge. Do not close it, and
do not merge it as-is.**

* Do not merge as-is: it conflicts with `main` (GitHub reports `CONFLICTING` /
  `DIRTY`; `git merge-tree` reproduces it).
* Do not close: 32 of its 68 files do not exist in `main` at all, and its suite is
  green. Closing would throw away working, tested code.
* It does **not** depend on, block, or overlap this branch's Safari/toddler fixes
  (see "Conflict with this branch" below).

## What the PR is

| | |
|---|---|
| Branch | `arena/01a10c6b-student-portal-2` = `9c49ebc` |
| Size | 68 files, +8,989 / −834, 9 commits |
| Base | `c2568a9` (merge of PR #4); `main` has since taken PR #8 |
| Adds | validated generated content (content engine + pool), an authenticated AI gateway with quota/validation, adaptive-learning evidence, storybook comprehension flow, Firestore rules + emulator config, `docs/ai-gateway.md`, a CI workflow, and 14 test files |
| BuildAI | **0 files** — the PR does not touch the user's separate BuildAI site (verified with `git diff --name-only <base> origin/pr5 \| grep -ci buildai` → `0`) |

## Conflicts

`git merge-tree --write-tree` against each side:

| Target | Conflicting files |
|---|---|
| `main` (today) | `package.json`, `server.ts`, `src/components/ChatInterface.tsx` |
| **this branch (PR #9)** | `package-lock.json`, `package.json`, `server.ts`, `src/components/ChatInterface.tsx` |

**File overlap with this branch is only the dependency list.** The intersection of
`git diff --name-only main...HEAD` and `git diff --name-only main...origin/pr5` is
exactly `package.json` + `package-lock.json`. No component, test, or data file is
shared — so PR #5 cannot revert the Safari / Animal World / toddler-game fixes, and
this branch cannot break PR #5's source.

### Nature of each conflict

* **`package.json`** — both sides append to the `scripts` block and the dependency
  lists: `main` added `dev:buildai` / `dev:student-portal`, PR #5 added
  `test:firestore-rules` plus `firebase-admin`, `@firebase/rules-unit-testing`, and
  the `overrides` block. Resolution is to keep both sets. After this branch lands,
  also keep its `jsdom` / `@testing-library/*` devDependencies.
* **`package-lock.json`** (this branch only) — mechanical: combine `package.json`,
  then regenerate with `npm install` and commit the new lock.
* **`server.ts`** — the real work. PR #5 removes ~279 lines from the monolith and
  moves those routes into `server/*` modules (`aiApi`, `aiGateway`, `aiQuota`,
  `aiValidation`, `contentApi`, `contentPersistence`, `adminFirestore`), while
  `main` added ~102 lines of new routes inline. Someone has to re-add `main`'s
  routes inside PR #5's module structure, then re-run `server/__tests__/*`.
* **`src/components/ChatInterface.tsx`** — both sides rewrote parts of the same
  screen; needs a hand merge and one visual check.

### Auto-merged but worth a human read

`server/contentAuth.ts` was changed by **both** sides and merges cleanly. This is
security-relevant code (content authorization), and the two versions were written
independently — read the merged file rather than trusting the clean merge.

## Independent verification of the branch itself

Run in a scratch worktree of `origin/pr5` (`/tmp`, removed afterwards):

| Check | Result |
|---|---|
| `npm ci` | ok |
| `npx vitest run` | **17 files / 104 passed, 9 skipped** |
| `npx tsc --noEmit` (its `lint`) | clean |

The 9 skipped tests are all in `server/__tests__/firestoreRules.test.ts` — they need
the Firestore emulator, which the PR's own CI workflow starts. That suite was not
exercised here.

## Risk notes

* PR #5 rewrites `src/utils/learnerBrain.ts` (−185 lines) and
  `src/utils/dailyLearningRoute.ts` (254 / −92) — files the toddler games report
  through. After PR #5 lands, re-run this branch's play-through suites
  (`toddlerGamesPlaythrough.test.tsx`, `ToddlerAnimalSafari.test.tsx`,
  `ToddlerWorldsNavigator.test.tsx`, `toddlerDailyAdventure.test.ts`) as the
  regression net for stars/XP/daily counters.
* The branch has sat since 2026-10-11 while `main` moved 13 commits; the longer it
  waits, the more `server.ts` will drift.

## Recommended sequence

1. Merge `main` into `arena/01a10c6b-student-portal-2` (a merge, not a force-push).
2. Resolve the three files as described above.
3. On that branch: `npm ci && npx tsc --noEmit && npx vitest run`, and let CI start
   the emulator for the Firestore-rules suite.
4. Merge PR #5.
5. Merge / land this branch (PR #9) separately — it is independent — then re-run
   the toddler suites listed under "Risk notes".

Do **not** merge PR #9 into PR #5 to settle the dependency conflict: the two are
unrelated in scope, and mixing them loses the ability to tell which change caused
a regression.
