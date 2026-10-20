/** Proven Games-tab toys planted on world roads — same engines, world scene IDs. */
import type { ToddlerActivity, ToddlerWorld } from "./toddlerWorldsArchitecture";

interface ToyStation extends Omit<ToddlerActivity, "worldId" | "areaId"> {
  skillId?: string;
}

const PLAY: ToddlerActivity["options"] = [
  { id: "play", label: "Let's play", emoji: "🎮", feedback: "Time to play!", isCorrect: true },
];

function toy(
  partial: Omit<ToyStation, "options" | "rewardStars" | "rewardXP" | "replayable" | "difficulty" | "clueType"> & {
    skillId?: string;
    type: ToyStation["type"];
  }
): ToyStation {
  return {
    difficulty: 1,
    clueType: "creative",
    options: PLAY,
    rewardStars: 1,
    rewardXP: 0,
    replayable: true,
    ...partial,
  };
}

const TOYS: Record<string, ToyStation[]> = {
  "animal-world/farm-valley": [
    toy({
      id: "act-farm-safari-walk",
      title: "Pasture Safari",
      type: "animal-safari",
      learningObjective: "Listen for farm and wild friends on a walk",
      clueIcon: "🦁",
      cluePrompt: "Walk the pasture and find who is calling.",
      spokenPrompt: "Let's walk the pasture safari and listen for animal friends!",
      skillId: "sci-k1-habitats",
    }),
  ],
  "animal-world/jungle-canopy": [
    toy({
      id: "act-jungle-memory-leaves",
      title: "Canopy Memory",
      type: "memory-match",
      learningObjective: "Match pairs hiding in the jungle leaves",
      clueIcon: "🃏",
      cluePrompt: "Flip two leaves. Find the matching friends.",
      spokenPrompt: "Flip the jungle leaves and find the matching friends!",
    }),
  ],
  "animal-world/ocean-reef": [
    toy({
      id: "act-ocean-letter-bubbles",
      title: "Reef Bubbles",
      type: "bubble-pop",
      learningObjective: "Pop letter bubbles on the reef",
      clueIcon: "🫧",
      cluePrompt: "Pop the letter bubbles floating over the coral.",
      spokenPrompt: "Pop the letter bubbles over the reef!",
      skillId: "read-k1-alphabet-letters",
    }),
  ],
  "adventure-world/forest-trail": [
    toy({
      id: "act-forest-sky-balloons",
      title: "Forest Sky Balloons",
      type: "balloon-sky",
      learningObjective: "Catch letters and numbers in the forest sky",
      clueIcon: "🎈",
      cluePrompt: "Tap the balloons drifting over the pines.",
      spokenPrompt: "Tap the forest sky balloons!",
      skillId: "read-k1-alphabet-letters",
    }),
  ],
  "learning-world/phonics-meadow": [
    toy({
      id: "act-meadow-rhyme-garden",
      title: "Meadow Rhyme Garden",
      type: "rhyme-garden",
      learningObjective: "Match rhyming words in the meadow",
      clueIcon: "🌸",
      cluePrompt: "Find the word that rhymes in the meadow.",
      spokenPrompt: "Find the rhyming friends in the meadow garden!",
      skillId: "read-k1-phonemic-awareness",
    }),
    toy({
      id: "act-meadow-blend-kitchen",
      title: "Meadow Blend Kitchen",
      type: "k1-studio",
      studioGameId: "blend-kitchen",
      learningObjective: "Hear consonant blends in a kitchen scene",
      clueIcon: "🥣",
      cluePrompt: "Cook the blend that starts the word.",
      spokenPrompt: "Let's cook blends in the meadow kitchen!",
      skillId: "read-k1-consonant-blends",
    }),
    toy({
      id: "act-meadow-letter-trace",
      title: "Meadow Letter Trace",
      type: "letter-trace",
      learningObjective: "Finger-trace meadow letters",
      clueIcon: "✍️",
      cluePrompt: "Trace the big letter with your finger.",
      spokenPrompt: "Trace the meadow letter with your finger!",
      skillId: "read-k1-alphabet-letters",
    }),
  ],
  "learning-world/counting-grove": [
    toy({
      id: "act-grove-ten-frame",
      title: "Grove Ten-Frame Taxi",
      type: "k1-studio",
      studioGameId: "ten-frame-taxi",
      learningObjective: "Fill a ten-frame with grove passengers",
      clueIcon: "🚕",
      cluePrompt: "Fill the taxi ten-frame under the trees.",
      spokenPrompt: "Fill the ten-frame taxi in the counting grove!",
      skillId: "math-k1-place-value",
    }),
  ],
  "adventure-world/space-blastoff": [
    toy({
      id: "act-space-picnic-plus",
      title: "Moon Picnic Plus",
      type: "k1-studio",
      studioGameId: "picnic-plus",
      learningObjective: "Add small groups on a moon picnic",
      clueIcon: "🧺",
      cluePrompt: "Add the picnic treats on the moon cloth.",
      spokenPrompt: "Add the moon picnic treats!",
      skillId: "math-k1-addition-subtraction",
    }),
  ],
  "adventure-world/weather-adventure": [
    toy({
      id: "act-hill-weather-porch",
      title: "Hill Weather Porch",
      type: "k1-studio",
      studioGameId: "weather-porch",
      learningObjective: "Match weather on the hill porch",
      clueIcon: "☔",
      cluePrompt: "What is the weather doing on the hill?",
      spokenPrompt: "Look at the weather on the hill porch!",
      skillId: "sci-k1-weather-seasons",
    }),
  ],
  "vehicle-world/garage-bay": [
    toy({
      id: "act-garage-bead-train",
      title: "Garage Bead Train",
      type: "k1-studio",
      studioGameId: "bead-train",
      learningObjective: "Continue a colour pattern on the workbench",
      clueIcon: "🚂",
      cluePrompt: "What bead comes next on the garage train?",
      spokenPrompt: "What bead comes next on the garage train?",
      skillId: "logic-k1-patterns",
    }),
  ],
  "kitchen-world/picnic-basket": [
    toy({
      id: "act-picnic-laundry-sort",
      title: "Picnic Cloth Sort",
      type: "k1-studio",
      studioGameId: "laundry-sort",
      learningObjective: "Sort picnic cloths by colour and kind",
      clueIcon: "👕",
      cluePrompt: "Sort the picnic cloths onto the right piles.",
      spokenPrompt: "Sort the picnic cloths!",
      skillId: "logic-k1-sorting",
    }),
  ],
  "city-world/library-nook": [
    toy({
      id: "act-lib-story-porch",
      title: "Nook Story Porch",
      type: "k1-studio",
      studioGameId: "story-porch",
      learningObjective: "Listen and answer a tiny story",
      clueIcon: "📖",
      cluePrompt: "Listen to the nook story. Who did what?",
      spokenPrompt: "Listen to the story on the library porch!",
      skillId: "read-k1-listening-comprehension",
    }),
  ],
  "bug-world/flower-bed": [
    toy({
      id: "act-bed-bug-safari",
      title: "Flower Bed Safari",
      type: "animal-safari",
      learningObjective: "Listen for garden visitors",
      clueIcon: "🐝",
      cluePrompt: "Who is visiting the flower bed?",
      spokenPrompt: "Listen for who is visiting the flower bed!",
      skillId: "sci-k1-habitats",
    }),
  ],
  "night-world/star-balcony": [
    toy({
      id: "act-balcony-memory-stars",
      title: "Star Memory",
      type: "memory-match",
      learningObjective: "Match pairs on the night balcony",
      clueIcon: "⭐",
      cluePrompt: "Flip two stars. Find the match.",
      spokenPrompt: "Flip the balcony stars and find the match!",
    }),
  ],
  "animal-world/dino-valley": [
    toy({
      id: "act-dino-memory-bones",
      title: "Bone Memory",
      type: "memory-match",
      learningObjective: "Match fossil pairs in the valley",
      clueIcon: "🦴",
      cluePrompt: "Flip two bones. Find the matching fossil friends.",
      spokenPrompt: "Flip the dinosaur bones and find the matching fossils!",
    }),
  ],
  "adventure-world/treasure-quest": [
    toy({
      id: "act-treasure-letter-bubbles",
      title: "Treasure Bubbles",
      type: "bubble-pop",
      learningObjective: "Pop letter bubbles over the treasure map",
      clueIcon: "🫧",
      cluePrompt: "Pop the letter bubbles floating over the gold.",
      spokenPrompt: "Pop the treasure letter bubbles!",
      skillId: "read-k1-alphabet-letters",
    }),
  ],
  "creative-world/color-studio": [
    toy({
      id: "act-studio-sky-balloons",
      title: "Paint Sky Balloons",
      type: "balloon-sky",
      learningObjective: "Catch letters drifting over the studio",
      clueIcon: "🎈",
      cluePrompt: "Tap the paint balloons in the studio sky.",
      spokenPrompt: "Tap the paint sky balloons!",
      skillId: "read-k1-alphabet-letters",
    }),
  ],
  "creative-world/music-garden": [
    toy({
      id: "act-garden-rhyme-duet",
      title: "Garden Rhyme Duet",
      type: "rhyme-garden",
      learningObjective: "Match rhyming words among the flowers",
      clueIcon: "🌸",
      cluePrompt: "Find the word that rhymes in the music garden.",
      spokenPrompt: "Find the rhyming friends in the music garden!",
      skillId: "read-k1-phonemic-awareness",
    }),
  ],
  "creative-world/pattern-workshop": [
    toy({
      id: "act-workshop-memory-beads",
      title: "Bead Memory",
      type: "memory-match",
      learningObjective: "Match bead pairs on the workbench",
      clueIcon: "🃏",
      cluePrompt: "Flip two beads. Find the matching colours.",
      spokenPrompt: "Flip the workshop beads and find the match!",
    }),
  ],
  "creative-world/sticker-atelier": [
    toy({
      id: "act-atelier-sticker-match",
      title: "Sticker Match",
      type: "memory-match",
      learningObjective: "Match sticker pairs on the art table",
      clueIcon: "🌟",
      cluePrompt: "Flip two stickers. Find the twin.",
      spokenPrompt: "Flip the stickers and find the twin!",
    }),
  ],
  "story-world/barnyard-tales": [
    toy({
      id: "act-barn-tale-safari",
      title: "Tale Safari",
      type: "animal-safari",
      learningObjective: "Listen for story-time animals",
      clueIcon: "🐔",
      cluePrompt: "Who is calling from the barnyard tale?",
      spokenPrompt: "Listen for who is calling in the barnyard tale!",
      skillId: "sci-k1-habitats",
    }),
  ],
  "story-world/space-tales": [
    toy({
      id: "act-starlight-sky-balloons",
      title: "Starlight Balloons",
      type: "balloon-sky",
      learningObjective: "Catch letters in the story sky",
      clueIcon: "🎈",
      cluePrompt: "Tap the balloons drifting past the stars.",
      spokenPrompt: "Tap the starlight story balloons!",
      skillId: "read-k1-alphabet-letters",
    }),
  ],
  "story-world/deep-sea-tales": [
    toy({
      id: "act-sea-tale-bubbles",
      title: "Sea Tale Bubbles",
      type: "bubble-pop",
      learningObjective: "Pop letter bubbles in the deep-sea story",
      clueIcon: "🫧",
      cluePrompt: "Pop the letter bubbles in the sea tale.",
      spokenPrompt: "Pop the deep-sea story bubbles!",
      skillId: "read-k1-alphabet-letters",
    }),
  ],
  "learning-world/shapes-patterns": [
    toy({
      id: "act-shapes-sky-balloons",
      title: "Shape Sky Balloons",
      type: "balloon-sky",
      learningObjective: "Catch letters over the shape grove",
      clueIcon: "🎈",
      cluePrompt: "Tap the balloons drifting over the shapes.",
      spokenPrompt: "Tap the shape-sky balloons!",
      skillId: "read-k1-alphabet-letters",
    }),
  ],
  "my-world/feelings-emotions": [
    toy({
      id: "act-feelings-face-memory",
      title: "Feeling Faces",
      type: "memory-match",
      learningObjective: "Match pairs of feeling faces",
      clueIcon: "😊",
      cluePrompt: "Flip two faces. Find the matching feeling.",
      spokenPrompt: "Flip the feeling faces and find the match!",
    }),
  ],
  "my-world/healthy-habits": [
    toy({
      id: "act-habits-brush-piano",
      title: "Brush-Time Piano",
      type: "piano-melody",
      learningObjective: "Play a short tune while we practise a healthy habit",
      clueIcon: "🪥",
      cluePrompt: "Tap the keys. Make a brush-time song.",
      spokenPrompt: "Play a brush-time song on the piano!",
    }),
  ],
  "my-world/family-home": [
    toy({
      id: "act-home-rhyme-hug",
      title: "Home Rhyme Hug",
      type: "rhyme-garden",
      learningObjective: "Match rhyming words at home",
      clueIcon: "🏠",
      cluePrompt: "Find the word that rhymes at home.",
      spokenPrompt: "Find the rhyming friends at home!",
      skillId: "read-k1-phonemic-awareness",
    }),
  ],
  "vehicle-world/town-road": [
    toy({
      id: "act-street-sky-balloons",
      title: "High Street Balloons",
      type: "balloon-sky",
      learningObjective: "Catch letters over the high street",
      clueIcon: "🎈",
      cluePrompt: "Tap the balloons drifting over the buses.",
      spokenPrompt: "Tap the high street balloons!",
      skillId: "read-k1-alphabet-letters",
    }),
    toy({
      id: "act-street-letter-trace",
      title: "Street Letter Trace",
      type: "letter-trace",
      learningObjective: "Finger-trace bus and car letters",
      clueIcon: "✍️",
      cluePrompt: "Trace B for Bus on the high street.",
      spokenPrompt: "Trace the high street letter with your finger!",
      skillId: "read-k1-alphabet-letters",
    }),
  ],
  "vehicle-world/airport-runway": [
    toy({
      id: "act-runway-sky-balloons",
      title: "Runway Balloons",
      type: "balloon-sky",
      learningObjective: "Catch letters over the runway",
      clueIcon: "🎈",
      cluePrompt: "Tap the balloons drifting past the planes.",
      spokenPrompt: "Tap the runway sky balloons!",
      skillId: "read-k1-alphabet-letters",
    }),
  ],
  "vehicle-world/harbour-dock": [
    toy({
      id: "act-harbour-letter-bubbles",
      title: "Harbour Bubbles",
      type: "bubble-pop",
      learningObjective: "Pop letter bubbles at the dock",
      clueIcon: "🫧",
      cluePrompt: "Pop the letter bubbles by the boats.",
      spokenPrompt: "Pop the harbour letter bubbles!",
      skillId: "read-k1-alphabet-letters",
    }),
  ],
  "bug-world/pond-edge": [
    toy({
      id: "act-pond-frog-safari",
      title: "Pond Safari",
      type: "animal-safari",
      learningObjective: "Listen for pond visitors",
      clueIcon: "🐸",
      cluePrompt: "Who is visiting the garden pond?",
      spokenPrompt: "Listen for who is visiting the pond!",
      skillId: "sci-k1-habitats",
    }),
  ],
  "bug-world/night-jar": [
    toy({
      id: "act-jar-night-safari",
      title: "Night Jar Safari",
      type: "animal-safari",
      learningObjective: "Listen for night garden visitors",
      clueIcon: "🦉",
      cluePrompt: "Who is calling on the night jar walk?",
      spokenPrompt: "Listen for who is calling on the night walk!",
      skillId: "sci-k1-habitats",
    }),
  ],
  "bug-world/compost-heap": [
    toy({
      id: "act-heap-bug-memory",
      title: "Compost Memory",
      type: "memory-match",
      learningObjective: "Match bug pairs in the warm heap",
      clueIcon: "🪲",
      cluePrompt: "Flip two leaves. Find the matching bugs.",
      spokenPrompt: "Flip the compost leaves and find the matching bugs!",
    }),
  ],
  "kitchen-world/fruit-stall": [
    toy({
      id: "act-stall-color-lab",
      title: "Fruit Colour Mix",
      type: "color-lab",
      learningObjective: "Mix colours at the fruit stall",
      clueIcon: "🎨",
      cluePrompt: "Blend droplets to make fruit-stall colours.",
      spokenPrompt: "Mix colours at the fruit stall!",
    }),
  ],
  "kitchen-world/bakery-shelf": [
    toy({
      id: "act-bakery-memory-buns",
      title: "Bun Memory",
      type: "memory-match",
      learningObjective: "Match bun pairs on the warm shelf",
      clueIcon: "🍞",
      cluePrompt: "Flip two buns. Find the matching treats.",
      spokenPrompt: "Flip the bakery buns and find the match!",
    }),
    toy({
      id: "act-bakery-letter-trace",
      title: "Flour Letter Trace",
      type: "letter-trace",
      learningObjective: "Finger-trace bakery letters in flour",
      clueIcon: "✍️",
      cluePrompt: "Trace A for Apple in the flour.",
      spokenPrompt: "Trace the bakery letter in the flour!",
      skillId: "read-k1-alphabet-letters",
    }),
  ],
  "kitchen-world/soup-pot": [
    toy({
      id: "act-soup-color-lab",
      title: "Soup Colour Mix",
      type: "color-lab",
      learningObjective: "Mix colours in Nana’s soup pot",
      clueIcon: "🍲",
      cluePrompt: "Blend droplets into the bubbling soup.",
      spokenPrompt: "Mix colours in Nana's soup pot!",
    }),
  ],
  "city-world/fire-house": [
    toy({
      id: "act-fire-sky-balloons",
      title: "Fire-House Balloons",
      type: "balloon-sky",
      learningObjective: "Catch letters over the fire house",
      clueIcon: "🎈",
      cluePrompt: "Tap the balloons drifting past the engines.",
      spokenPrompt: "Tap the fire-house balloons!",
      skillId: "read-k1-alphabet-letters",
    }),
  ],
  "city-world/park-green": [
    toy({
      id: "act-park-bird-safari",
      title: "Park Safari",
      type: "animal-safari",
      learningObjective: "Listen for park visitors",
      clueIcon: "🐦",
      cluePrompt: "Who is visiting the town park?",
      spokenPrompt: "Listen for who is visiting the park!",
      skillId: "sci-k1-habitats",
    }),
  ],
  "city-world/market-street": [
    toy({
      id: "act-market-color-lab",
      title: "Market Colour Mix",
      type: "color-lab",
      learningObjective: "Mix colours at the Saturday market",
      clueIcon: "🎨",
      cluePrompt: "Blend droplets into market colours.",
      spokenPrompt: "Mix colours at the Saturday market!",
    }),
  ],
  "arctic-world/ice-floe": [
    toy({
      id: "act-floe-ice-safari",
      title: "Floe Safari",
      type: "animal-safari",
      learningObjective: "Listen for ice neighbours",
      clueIcon: "🐧",
      cluePrompt: "Who is calling on the penguin floe?",
      spokenPrompt: "Listen for who is calling on the ice floe!",
      skillId: "sci-k1-habitats",
    }),
    toy({
      id: "act-floe-letter-trace",
      title: "Ice Letter Trace",
      type: "letter-trace",
      learningObjective: "Finger-trace ice letters",
      clueIcon: "✍️",
      cluePrompt: "Trace P for Penguin in the snow.",
      spokenPrompt: "Trace the ice letter in the snow!",
      skillId: "read-k1-alphabet-letters",
    }),
  ],
  "arctic-world/polar-den": [
    toy({
      id: "act-den-snow-memory",
      title: "Snow Memory",
      type: "memory-match",
      learningObjective: "Match pairs in the snow den",
      clueIcon: "❄️",
      cluePrompt: "Flip two snowflakes. Find the match.",
      spokenPrompt: "Flip the snowflakes and find the match!",
    }),
  ],
  "arctic-world/northern-lights": [
    toy({
      id: "act-lights-sky-balloons",
      title: "Light-Sky Balloons",
      type: "balloon-sky",
      learningObjective: "Catch letters under the northern lights",
      clueIcon: "🎈",
      cluePrompt: "Tap the balloons drifting through the lights.",
      spokenPrompt: "Tap the northern-light balloons!",
      skillId: "read-k1-alphabet-letters",
    }),
  ],
  "arctic-world/seal-shore": [
    toy({
      id: "act-shore-seal-bubbles",
      title: "Seal Shore Bubbles",
      type: "bubble-pop",
      learningObjective: "Pop letter bubbles on the seal shore",
      clueIcon: "🫧",
      cluePrompt: "Pop the letter bubbles by the seals.",
      spokenPrompt: "Pop the seal-shore bubbles!",
      skillId: "read-k1-alphabet-letters",
    }),
  ],
  "night-world/bedroom-lamp": [
    toy({
      id: "act-lamp-star-memory",
      title: "Lamp Memory",
      type: "memory-match",
      learningObjective: "Match pairs by the bed lamp",
      clueIcon: "💡",
      cluePrompt: "Flip two lamps. Find the matching glow.",
      spokenPrompt: "Flip the bed lamps and find the match!",
    }),
  ],
  "night-world/owl-wood": [
    toy({
      id: "act-owl-wood-safari",
      title: "Owl Wood Safari",
      type: "animal-safari",
      learningObjective: "Listen for night-wood visitors",
      clueIcon: "🦉",
      cluePrompt: "Who is calling in the owl wood?",
      spokenPrompt: "Listen for who is calling in the owl wood!",
      skillId: "sci-k1-habitats",
    }),
  ],
  "night-world/porch-moths": [
    toy({
      id: "act-moth-sky-balloons",
      title: "Porch Balloons",
      type: "balloon-sky",
      learningObjective: "Catch letters around the porch light",
      clueIcon: "🎈",
      cluePrompt: "Tap the balloons drifting past the moths.",
      spokenPrompt: "Tap the porch-light balloons!",
      skillId: "read-k1-alphabet-letters",
    }),
  ],
};

export const WORLD_TOY_STATION_SKILLS: Record<string, string | undefined> = {};
for (const stations of Object.values(TOYS)) {
  for (const station of stations) {
    WORLD_TOY_STATION_SKILLS[station.id] = station.skillId;
  }
}

export function attachWorldToyStations(world: ToddlerWorld): ToddlerWorld {
  return {
    ...world,
    areas: world.areas.map((area) => {
      const extra = TOYS[`${world.id}/${area.id}`] ?? [];
      if (!extra.length) return area;
      return {
        ...area,
        activities: [
          ...area.activities,
          ...extra.map((packed) => {
            const { skillId, ...activity } = packed;
            void skillId;
            return { ...activity, worldId: world.id, areaId: area.id };
          }),
        ],
      };
    }),
  };
}
