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
