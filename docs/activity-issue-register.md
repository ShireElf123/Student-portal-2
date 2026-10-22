# Activity issue register (Phase 1.2)

Labels: **severity** (child cannot complete the promised play), **suspected** (source-only, needs device), **design** (intentional).

Verification: `source` | `unit` | `preview` | `device`.

## Inventory (source)

| Surface | Count | Notes |
|---|---|---|
| Worlds | 12 | `ALL_TODDLER_WORLDS` |
| World activities | **510** unique IDs | All registered as `toddler-world` |
| Registry | 567 | Worlds plus books/games/assessments |
| Picture books | 85 | Stories tab |
| Playhouse shows | 20 | Playhouse tab |
| K1 studio games | 16 | Worlds `k1-studio` rows |
| Secret zones | 3 | Worlds extras |
| Guided assessments | 12 | Parent/teacher, not toddler catalogue |

World activity types: clue-detective 163, counting 85, sorting 44, land-play 41, pattern-match 30, sound-detective 24, k1-studio 16, letter-trace 15, habitat-match 13, memory-match 12, balloon-sky 12, color-lab 9, rhyme-garden 9, story-adventure 9, animal-safari 8, piano-melody 7, open-play 7, bubble-pop 6.

This is **source coverage**, not 510 device plays.

## Fixed this phase

| ID | Severity | Activity | Verification |
|---|---|---|---|
| ISS-STAMP-2 | severity | Stamp Mural (`stamp-mural`) | `unit` — wall-local pointer; preview follows path; print at release %. Not `device`. |

Root cause of the remaining jump after 1.1: tray drag + 48px hit pad + 6–88 / 8–78 clamp + fallback `12 + n*12` path. Land crate drag was left on `bindFollowDrag` (drop-on-up). Color Lab mix is still tap-droplets; paint uses canvas-local coords.

## Open / not claimed done

| ID | Class | Notes | Verification |
|---|---|---|---|
| ISS-05 | suspected | Safari extra missions / Games pay gate beyond 3-hit station | source + unit 1.1 |
| ISS-06 | suspected | Playhouse leftover emoji interiors | source |
| ISS-quiet | design | Quiet Corner has no pause control | source |
| ISS-pattern | design | `pattern-match` reuses quiz option UI | source |
| ISS-nav | design | 8 tabs wrap on small screens; Worlds and Games share engines | source |
| ISS-books-alt | suspected | some book images `alt=""` | source |
| ISS-emoji | suspected | tofu leftover outside Focus | source; not re-audited 1.2 |
| ISS-trace | suspected | letter-trace accuracy not 100% | unit earlier |

## Navigation (smallest coherent proposal)

Keep the eight tabs (Worlds, Stories, Playhouse, Phonics, Counting, Focus, Games, My Buddy). Do **not** add a ninth tab or hide Worlds toys.

Smallest next change, if any: on a 4-column phone, the second row of tabs is easy to miss — pin Worlds + Stories + Games + Focus as the first row by reordering, not by redesigning the Worlds map. Trail-next already exists for auto-trail types. Do not implement that reorder in 1.2 without a product go-ahead.

## Representative validation plan

| Sample | Why | Done |
|---|---|---|
| Stamp Mural | freeform vs path | unit (jsdom pointer events) |
| Crate truck | drop-on-up drag | unit (1.1, still green) |
| Safari / Balloon / Bubble | 3-hit station complete | unit (1.1) |
| Clue-detective | quiz integrity | unit (Phase 1) |
| Color Lab | tap-mix not stamp | source |
| One picture book | page turn | **not** this phase |
| Focus path game | gold lane | unit earlier |
| Device finger pass | smoothness | **not run** — agent cannot drive LIVE PREVIEW |
