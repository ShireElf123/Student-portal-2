# Activity quality standard

Use this before adding any new **activity** toward the 1,000–1,005 catalogue. An activity is a game, exercise, story, creative tool, simulation, or other interactive learning experience. Passing TypeScript or a smoke test is not done.

## Intended experience

Every activity must declare, in data:

- a stable **activity ID** (never recycled)
- a human **name** that matches the play
- a **learning objective**
- a **mechanic family** (see `activityInventory.test.ts`)
- start, success, miss/retry, completion, reward, replay, and exit

The activity must **behave like what it claims to be**. A stamp is placed freely on a canvas. A crate is dragged onto a truck. A quiz asks and answers. Do not fake a mechanic with a teleport or a hidden path.

## Definition of done

1. **Mechanic authenticity** — Interaction matches the name and instructions (continuous drag where promised; tap where promised).
2. **Input accuracy** — Pointer/touch coordinates map to what the child sees. No unexplained snapping except documented drop-zone hits.
3. **Learning integrity** — Prompts, options, correct answers, and feedback agree. Instructions describe the real control (tap vs drag).
4. **Feedback and recovery** — Misses can be retried without restarting unless the design is a single finite round.
5. **Completion and rewards** — Does not complete on launch or on the first incidental tap of an endless toy. In-game stars stay separate from Worlds station completion. Missions pay only on the surface that mounted the activity.
6. **Presentation** — Toddler-sized targets (≥44px), readable copy, no leftover tofu emoji in chrome.
7. **Navigation** — Reachable from a named world/area or Games/Stories/Focus row; Back, replay, and trail-next are consistent with siblings.
8. **Tests** — Core rules of the shared engine; at least one representative activity; regression for other dependents of that engine.
9. **Verification record** — State whether checks were source, unit, browser preview, or a real touch device. Never call jsdom a device test.

## Shared engines (do not copy-paste a new interaction)

| Promise | Engine | Do not use for |
|---|---|---|
| Place a print anywhere on a canvas | `StampMural` wall-local pointer | Crate/truck drops |
| Drag item onto a target | `DragBits` / `bindFollowDrag` | Freeform stamping |
| Paint strokes | `PaintCanvas` in Color Lab | Stamp prints |
| Trace a letter | `ToddlerLetterTrace` | Matching games |
| Endless pop | Balloon / Bubble + `onComplete` after 3 hits | Finite quizzes |

New activities should pick an engine and configure content IDs. If no engine fits, add a primitive with tests before adding ten content rows.

## Inventory check

`src/data/toddler/activityInventory.test.ts` must stay green. It counts world activities, rejects unwired story/land/studio rows, and classifies types. Update it when you add a **type**, not when you add a row of an existing type.

## Verification labels

- `source` — data + component mapping inspected
- `unit` — vitest/jsdom
- `preview` — in-sandbox browser
- `device` — real finger on a phone

Catalogue quality is the sum of these labels. Unlabeled activities are **not** runtime-verified.
