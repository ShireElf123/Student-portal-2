# Activity quality standard

Use this before adding any new **activity** toward a larger catalogue, and when reviewing the existing 510 world activities. An activity is a game, exercise, story, creative tool, simulation, or other interactive learning experience.

Passing TypeScript, a registry row, or a smoke render is **not** done.

## Intended experience

Every activity must declare, in data:

- a stable **activity ID** (never recycled)
- a human **name** that matches the play
- a **learning objective**
- a **mechanic family** and **engine** (`src/data/toddler/activityQuality.ts`)
- start, success, miss/retry, completion, reward, replay, and exit

The activity must **behave like what it claims to be**. A stamp is placed freely on a canvas. A crate is dragged onto a truck. A quiz asks and answers. A pattern asks what comes next. Do not fake a mechanic with a teleport or a hidden path.

## Acceptance checklist (gate)

An activity is ready only when **all** of the following are true for its engine, plus representative content:

1. **Honest instructions** — Copy names the real control (tap vs drag vs hold vs trace) and the real goal.
2. **Purpose** — A child can tell what they are practising or playing.
3. **Mechanic match** — Interaction matches the title and instructions.
4. **Touch** — Pointer coordinates map to what the child sees. Targets ≥44px. No unexplained snap except documented drop zones.
5. **Rules** — Success, miss, retry, cancel, and next-step are coherent and recoverable.
6. **Rewards** — Does not complete on launch or on the first incidental tap of an endless toy. In-game stars stay separate from Worlds station completion. Missions pay only on the surface that mounted the activity. Secret finds are per learner.
7. **Presentation** — Readable type, no leftover tofu in chrome, shape/colour cues look like the named shape/colour.
8. **Mobile** — Usable on a 4-column phone; Worlds / Stories / Games / Focus stay on the first tab row.
9. **IDs** — Existing IDs and learner progress keys stay compatible.
10. **Tests** — Engine rules + one representative activity + regressions for other dependents of that engine.
11. **Verification record** — Label every claim: `source-inspected`, `unit-tested`, `browser-tested`, or `device-tested`. Never call jsdom a device test.

Future rows of an existing type inherit the engine checklist. A new mechanic needs a primitive and tests **before** ten content rows.

## Shared engines

| Promise | Engine | Do not use for |
|---|---|---|
| Place a print anywhere on a canvas | `StampMural` wall-local pointer | Crate/truck drops |
| Drag item onto a target | `DragBits` / `bindFollowDrag` | Freeform stamping |
| Paint strokes | `PaintCanvas` in Color Lab | Stamp prints |
| Trace a letter | `ToddlerLetterTrace` | Matching games |
| Endless pop | Balloon / Bubble + `onComplete` after 3 hits | Finite quizzes |
| Pattern “what comes next” | Worlds quiz + `quizTapHint("pattern-match")` | Animal “who is it” copy |
| Secret zone find | `toddler-secret-zone-finds:{learnerId}` | A global device key |

## Inventory and gate tests

- `src/data/toddler/activityInventory.test.ts` — 510 unique IDs, wiring, mechanic family, quiz correctness, pattern-prompt honesty.
- `src/data/toddler/toddlerSpaceTabs.test.ts` — eight tabs; mobile first row is Worlds / Stories / Games / Focus.
- `src/data/toddler/activityQuality.ts` — engine map, `quizTapHint`, helpers. Update the map when you add a **type**.

## Verification labels

| Label | Means |
|---|---|
| `source-inspected` | Data + component mapping read |
| `unit-tested` | vitest / jsdom |
| `browser-tested` | In-sandbox or hosted browser |
| `device-tested` | Real finger on a phone |

Unlabeled activities are **not** runtime-verified. Catalogue quality is the sum of these labels, not the ID count.
