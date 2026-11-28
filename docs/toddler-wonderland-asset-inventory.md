# Toddler Wonderland asset inventory

Starting HEAD for this phase: `97ff4abb7c11e1b27a26233eb7f80f853728ffb6`.

## Preserve (already at target quality)

| Asset | Path | Note |
|-------|------|------|
| Brand teddy | `public/art/home/teddy.png` | Greeting clay teddy, keep |
| Sun / cloud | `public/art/home/sun.png`, `cloud.png` | Clay overlays, keep |
| Eight launcher icons | `public/art/icons/*.png` | Clay objects; keep family, do not swap for emoji |
| Playhouse / Phonics / Counting / Buddy rooms | `public/art/places/{playhouse,phonics,counting,buddy}.jpg` | Kept this pass (image-generation cap) |
| Worlds atlas covers, arcade stills, Playhouse posters, book art | `public/worlds`, arcade, covers | Do not replace |
| Pip | SVG in `BuddyCompanionBadge.tsx` | Not a fox |

## Upgraded this pass (integrated)

| Asset | Path | Purpose |
|-------|------|---------|
| Meadow | `public/art/home/meadow.jpg` | Deeper clay hills, open grass for cards |
| Sky | `public/art/home/sky.jpg` | Clay blue sky plate |
| Tree | `public/art/home/tree.png` | Left-side world layer, transparent |
| Butterfly | `public/art/home/butterfly.png` | One idle flyer, transparent |
| Worlds room | `public/art/places/worlds.jpg` | Forest window, empty floor |
| Stories room | `public/art/places/stories.jpg` | Amber nook, empty floor |
| Games room | `public/art/places/games.jpg` | Teal arcade room, empty floor |
| Focus room | `public/art/places/focus.jpg` | Quiet pond window |

## Missing / still needed (image generation capped this turn)

- Transparent foreground flower strip (generated file baked a checkerboard; discarded).
- Playhouse, Phonics, Counting, My Buddy room upgrades to match Worlds/Stories/Games depth.
- Icon family re-export without baked gray floor ovals.
- Extra Pip poses as SVG states only — do not generate a new species.

Do not treat CSS as a substitute for those remaining illustrations.
