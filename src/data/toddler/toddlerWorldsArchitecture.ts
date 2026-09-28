import { StoryAdventure, STORY_ADVENTURES } from "./toddlerWorldsData";

export type ToddlerActivityType =
  | "clue-detective"    // Listen/look at environmental clues and identify without answer spoiler
  | "sound-detective"   // Hear audio sound cue and identify animal/object
  | "habitat-match"     // Connect creature/item to natural home
  | "counting"          // Count objects with auditory reward & replayability
  | "sorting"           // Sort items into two thematic drop zones
  | "story-adventure"   // Multi-scene branching story choice
  | "color-lab"         // Interactive color mixing
  | "piano-melody"      // Musical play
  | "pattern-match"     // Find what comes next in sequence
  | "feed-friend";      // Counting & feeding interaction

export interface ToddlerActivityOption {
  id: string;
  label: string;
  emoji: string;
  feedback: string;
  soundCue?: string;
  isCorrect: boolean;
}

export interface ToddlerActivity {
  id: string;
  worldId: string;
  areaId: string;
  title: string;
  type: ToddlerActivityType;
  learningObjective: string;
  difficulty: 1 | 2 | 3;
  clueType: "sound" | "tracks" | "habitat" | "sight" | "riddle" | "creative" | "counting";
  clueIcon: string;            // Environmental icon, e.g. 👂, 🐾, 🔍, 🎵 (NOT the answer!)
  cluePrompt: string;          // What the child is asked to do
  spokenPrompt: string;        // Read aloud by voice coordinator
  soundEffectText?: string;    // e.g. "Ooh-ooh aah-aah!", "Moooo!", "Whoosh!"
  options: ToddlerActivityOption[];
  rewardStars: number;
  rewardXP: number;
  replayable: boolean;
  storyAdventureId?: string;   // For story-adventure activities
}

export interface ToddlerMissionStep {
  stepNumber: number;
  title: string;
  instruction: string;
  activityId: string;
  rewardStars: number;
}

export interface ToddlerMission {
  id: string;
  worldId: string;
  areaId: string;
  title: string;
  tagline: string;
  badgeEmoji: string;
  badgeTitle: string;
  description: string;
  steps: ToddlerMissionStep[];
  rewardStars: number;
  rewardXP: number;
}

export interface ToddlerArea {
  id: string;
  worldId: string;
  title: string;
  emoji: string;
  tagline: string;
  environment: {
    bgGradient: string;
    cardBg: string;
    accentColor: string;
    sceneryEmojis: string[];
    ambientDescription: string;
  };
  requiredStarsToUnlock: number;
  unlockRequirementText?: string;
  activities: ToddlerActivity[];
  missions: ToddlerMission[];
}

export interface ToddlerWorld {
  id: string;
  title: string;
  tagline: string;
  emoji: string;
  gradient: string;
  borderColor: string;
  themeColor: string;
  learningGoals: string[];
  description: string;
  areas: ToddlerArea[];
  collectionRewards: {
    id: string;
    title: string;
    emoji: string;
    description: string;
    requiredStars: number;
  }[];
}

// ==========================================================================
// WORLD 1: ANIMAL WORLD
// ==========================================================================
export const ANIMAL_WORLD: ToddlerWorld = {
  id: "animal-world",
  title: "Animal World",
  tagline: "Farm, Jungle, Ocean & Dino Discoveries",
  emoji: "🦁",
  gradient: "from-emerald-500 via-teal-500 to-green-600",
  borderColor: "border-emerald-400",
  themeColor: "emerald",
  learningGoals: [
    "Identify animal sounds without visual spoilers",
    "Match animal mothers with babies",
    "Discover natural habitats & footprints",
    "Count creatures in their native environments",
  ],
  description: "Step into lively habitats to listen for animal calls, follow mysterious footprints, and help Buddy on real safari expeditions!",
  collectionRewards: [
    { id: "col-safari-hat", title: "Jungle Explorer Hat", emoji: "🤠", description: "Awarded for completing all Farm & Jungle discoveries!", requiredStars: 4 },
    { id: "col-dino-fossil", title: "Golden Dino Tooth", emoji: "🦖", description: "Found by digging deep in Dino Discovery!", requiredStars: 8 },
  ],
  areas: [
    // Area 1: Farm Valley
    {
      id: "farm-valley",
      worldId: "animal-world",
      title: "Farm Valley",
      emoji: "🚜",
      tagline: "Sunny Barn, Fluffy Chicks & Grassy Pastures",
      environment: {
        bgGradient: "from-amber-200 via-yellow-100 to-emerald-200 text-amber-950",
        cardBg: "bg-amber-50/90 border-amber-300",
        accentColor: "emerald",
        sceneryEmojis: ["🚜", "🌾", "🌻", "🏡", "🪵"],
        ambientDescription: "Roosters crowing in the morning sunshine while cows graze near the big red barn.",
      },
      requiredStarsToUnlock: 0,
      activities: [
        {
          id: "act-farm-sound-cow",
          worldId: "animal-world",
          areaId: "farm-valley",
          title: "The Grassy Pasture Sound",
          type: "sound-detective",
          learningObjective: "Auditory recognition of domestic farm animal sounds",
          difficulty: 1,
          clueType: "sound",
          clueIcon: "👂",
          cluePrompt: "Listen closely! Someone is chewing sweet green clover and says 'Moooo!'",
          spokenPrompt: "Listen with your ears! Who is chewing sweet clover in the meadow and says Moooo?",
          soundEffectText: "Moooo! Moooo!",
          options: [
            { id: "pig", label: "Pink Piggy", emoji: "🐷", feedback: "Oink oink! That is piggy rolling in cooling mud.", isCorrect: false },
            { id: "cow", label: "Spotted Cow", emoji: "🐮", feedback: "Moooo! Yes, friendly dairy cow gives fresh milk!", soundCue: "Moooo!", isCorrect: true },
            { id: "sheep", label: "Fluffy Sheep", emoji: "🐑", feedback: "Baa baa! That is fluffy sheep with warm wool.", isCorrect: false },
            { id: "rooster", label: "Rooster", emoji: "🐓", feedback: "Cock a doodle doo! That's the morning rooster.", isCorrect: false },
          ],
          rewardStars: 1,
          rewardXP: 25,
          replayable: true,
        },
        {
          id: "act-farm-kitten-mom",
          worldId: "animal-world",
          areaId: "farm-valley",
          title: "Mother Cat's Tiny Baby",
          type: "clue-detective",
          learningObjective: "Matching animals to their biological offspring",
          difficulty: 1,
          clueType: "riddle",
          clueIcon: "🔍",
          cluePrompt: "Mother Cat is gently calling 'Meow, meow!' Who is her cuddly little baby?",
          spokenPrompt: "Mother Cat says meow meow! Can you find her tiny baby kitten?",
          soundEffectText: "Meow! Purrr!",
          options: [
            { id: "puppy", label: "Puppy", emoji: "🐶", feedback: "Puppies are baby dogs who say woof!", isCorrect: false },
            { id: "kitten", label: "Baby Kitten", emoji: "🐱", feedback: "Mew mew! The soft baby kitten snuggles close to Mother Cat!", soundCue: "Mew mew!", isCorrect: true },
            { id: "duckling", label: "Duckling", emoji: "🐥", feedback: "Ducklings are baby ducks swimming in the pond.", isCorrect: false },
            { id: "piglet", label: "Piglet", emoji: "🐷", feedback: "Piglets are baby pigs playing in the barn.", isCorrect: false },
          ],
          rewardStars: 1,
          rewardXP: 25,
          replayable: true,
        },
        {
          id: "act-farm-count-chicks",
          worldId: "animal-world",
          areaId: "farm-valley",
          title: "Count the Yellow Chicks",
          type: "counting",
          learningObjective: "1-to-1 numerical counting from visual grouping",
          difficulty: 1,
          clueType: "counting",
          clueIcon: "🔢",
          cluePrompt: "Mother Hen wants to make sure all 3 of her fluffy yellow chicks are in the hay!",
          spokenPrompt: "Look at the cozy hay! Count the fluffy yellow chicks: one, two, three!",
          soundEffectText: "Peep peep peep!",
          options: [
            { id: "1", label: "1 Chick", emoji: "1️⃣", feedback: "Count carefully, there are more than one!", isCorrect: false },
            { id: "3", label: "3 Yellow Chicks", emoji: "3️⃣", feedback: "Yes! One, two, three fluffy chicks peeping happily!", soundCue: "Peep peep!", isCorrect: true },
            { id: "5", label: "5 Chicks", emoji: "5️⃣", feedback: "Let's count together: one, two, three!", isCorrect: false },
          ],
          rewardStars: 1,
          rewardXP: 25,
          replayable: true,
        },
        {
          id: "act-farm-horse-snack",
          worldId: "animal-world",
          areaId: "farm-valley",
          title: "Snack for Barnaby the Horse",
          type: "clue-detective",
          learningObjective: "Understanding animal diets and healthy farm nutrition",
          difficulty: 1,
          clueType: "sight",
          clueIcon: "🐴",
          cluePrompt: "Barnaby the brown horse poked his head over the fence. What does he love to crunch?",
          spokenPrompt: "Barnaby the brown horse is hungry! What sweet crunchy treat does he love to eat?",
          options: [
            { id: "carrot", label: "Sweet Crunchy Carrot", emoji: "🥕", feedback: "Munch crunch! Barnaby neighs with joy as he crunches the carrot!", soundCue: "Neigh!", isCorrect: true },
            { id: "cupcake", label: "Sweet Cupcake", emoji: "🧁", feedback: "Silly Buddy! Horses don't eat cupcakes! They love carrots and apples.", isCorrect: false },
            { id: "pizza", label: "Cheesy Pizza", emoji: "🍕", feedback: "Horses eat fresh garden snacks like carrots, not pizza!", isCorrect: false },
          ],
          rewardStars: 1,
          rewardXP: 25,
          replayable: true,
        },
      ],
      missions: [
        {
          id: "msn-farm-helper",
          worldId: "animal-world",
          areaId: "farm-valley",
          title: "Barnyard Morning Helper",
          tagline: "Wake the animals and feed Barnaby",
          badgeEmoji: "🚜",
          badgeTitle: "Farm Helper Hero",
          description: "Help Buddy greet the cow, reunite the kitten, count the baby chicks, and feed the horse a healthy carrot!",
          steps: [
            { stepNumber: 1, title: "Listen for the Cow", instruction: "Find the friendly animal saying Moooo", activityId: "act-farm-sound-cow", rewardStars: 1 },
            { stepNumber: 2, title: "Find the Kitten", instruction: "Reunite Mother Cat with her baby kitten", activityId: "act-farm-kitten-mom", rewardStars: 1 },
            { stepNumber: 3, title: "Count the Chicks", instruction: "Help Mother Hen count 3 yellow chicks", activityId: "act-farm-count-chicks", rewardStars: 1 },
            { stepNumber: 4, title: "Feed Barnaby", instruction: "Offer a delicious crunchy carrot", activityId: "act-farm-horse-snack", rewardStars: 1 },
          ],
          rewardStars: 3,
          rewardXP: 60,
        },
      ],
    },

    // Area 2: Jungle Canopy (Unlocks after earning 2 stars)
    {
      id: "jungle-canopy",
      worldId: "animal-world",
      title: "Jungle Canopy",
      emoji: "🌴",
      tagline: "Tall Treetops, Green Vines & Mysterious Calls",
      environment: {
        bgGradient: "from-emerald-300 via-teal-200 to-green-300 text-teal-950",
        cardBg: "bg-emerald-50/90 border-emerald-300",
        accentColor: "teal",
        sceneryEmojis: ["🌴", "🐒", "🦜", "🌺", "🌿"],
        ambientDescription: "Misty jungle trees draped in climbing vines where colorful parrots and monkeys chatter.",
      },
      requiredStarsToUnlock: 2,
      unlockRequirementText: "Earn 2 Stars in Farm Valley to unlock the Jungle!",
      activities: [
        {
          id: "act-jungle-sound-monkey",
          worldId: "animal-world",
          areaId: "jungle-canopy",
          title: "Vines Swinging Sound",
          type: "sound-detective",
          learningObjective: "Discerning exotic jungle vocalizations from environmental clues",
          difficulty: 2,
          clueType: "sound",
          clueIcon: "👂",
          cluePrompt: "Listen high up in the green vines! Someone is shouting: 'Ooh-ooh aah-aah!'",
          spokenPrompt: "Listen to the treetop chatter! Who is swinging on the vines shouting ooh ooh aah aah?",
          soundEffectText: "Ooh-ooh aah-aah!",
          options: [
            { id: "monkey", label: "Cheeky Monkey", emoji: "🐵", feedback: "Ooh-ooh aah-aah! The monkey swings with its curly tail!", soundCue: "Ooh-ooh aah-aah!", isCorrect: true },
            { id: "frog", label: "Tree Frog", emoji: "🐸", feedback: "Ribbit ribbit! That is a green frog on a leaf.", isCorrect: false },
            { id: "lion", label: "Golden Lion", emoji: "🦁", feedback: "Roaaar! Lion roars on the sunny savanna grass.", isCorrect: false },
            { id: "elephant", label: "Elephant", emoji: "🐘", feedback: "Pawoooo! Elephant trumpets near the waterhole.", isCorrect: false },
          ],
          rewardStars: 1,
          rewardXP: 25,
          replayable: true,
        },
        {
          id: "act-jungle-tracks-lion",
          worldId: "animal-world",
          areaId: "jungle-canopy",
          title: "Mysterious Big Paw Prints",
          type: "clue-detective",
          learningObjective: "Observing tracks & footprints to deduce animal species",
          difficulty: 2,
          clueType: "tracks",
          clueIcon: "🐾",
          cluePrompt: "Look down at the soft jungle path! Giant round paw prints with soft pads and a golden hair strand!",
          spokenPrompt: "Look at these giant paw prints in the dirt! Who has a magnificent furry mane and padded paws?",
          options: [
            { id: "mouse", label: "Tiny Mouse", emoji: "🐭", feedback: "Tiny mouse leaves teeny tiny footprints!", isCorrect: false },
            { id: "lion", label: "Brave Lion", emoji: "🦁", feedback: "Yes! Giant padded paws belong to the majestic lion!", soundCue: "Rrrroaaar!", isCorrect: true },
            { id: "turtle", label: "Slow Turtle", emoji: "🐢", feedback: "Turtles have scaly webbed feet and a heavy shell.", isCorrect: false },
            { id: "ladybug", label: "Little Ladybug", emoji: "🐞", feedback: "Ladybugs have tiny walking legs and wings!", isCorrect: false },
          ],
          rewardStars: 1,
          rewardXP: 25,
          replayable: true,
        },
        {
          id: "act-jungle-habitat-parrot",
          worldId: "animal-world",
          areaId: "jungle-canopy",
          title: "Where Does the Parrot Live?",
          type: "habitat-match",
          learningObjective: "Associating animals with natural habitats",
          difficulty: 2,
          clueType: "habitat",
          clueIcon: "🗺️",
          cluePrompt: "The rainbow parrot has colorful feathers and wings. Where is its natural home?",
          spokenPrompt: "Where does the beautiful tropical parrot make its cozy home?",
          options: [
            { id: "treetop", label: "Tall Jungle Treetops", emoji: "🌴", feedback: "Yes! High up in sunny jungle branches among tropical flowers!", isCorrect: true },
            { id: "ocean", label: "Deep Blue Ocean", emoji: "🌊", feedback: "The ocean is home to fish and dolphins, not parrots!", isCorrect: false },
            { id: "desert", label: "Dry Sand Dunes", emoji: "🏜️", feedback: "Parrots love lush green trees with fresh tropical berries!", isCorrect: false },
          ],
          rewardStars: 1,
          rewardXP: 25,
          replayable: true,
        },
        {
          id: "act-jungle-count-bananas",
          worldId: "animal-world",
          areaId: "jungle-canopy",
          title: "Count Jungle Bananas for Buddy",
          type: "counting",
          learningObjective: "Counting fruit clusters in natural setting",
          difficulty: 2,
          clueType: "counting",
          clueIcon: "🍌",
          cluePrompt: "Look at the palm tree! How many sweet yellow bananas are hanging in a bunch?",
          spokenPrompt: "Count the sweet ripe bananas hanging in the cluster: one, two, three, four!",
          soundEffectText: "Munch munch!",
          options: [
            { id: "2", label: "2 Bananas", emoji: "2️⃣", feedback: "Look closer! There are more bananas up there.", isCorrect: false },
            { id: "4", label: "4 Sweet Bananas", emoji: "4️⃣", feedback: "Super counting! Exactly 4 yellow bananas ready to pick!", soundCue: "Yum yum!", isCorrect: true },
            { id: "6", label: "6 Bananas", emoji: "6️⃣", feedback: "Let's count together: one, two, three, four!", isCorrect: false },
          ],
          rewardStars: 1,
          rewardXP: 25,
          replayable: true,
        },
      ],
      missions: [
        {
          id: "msn-jungle-expedition",
          worldId: "animal-world",
          areaId: "jungle-canopy",
          title: "Great Jungle Expedition",
          tagline: "Follow Buddy deep into the tropical rainforest",
          badgeEmoji: "🌴",
          badgeTitle: "Jungle Master Scout",
          description: "Follow sounds, identify paw prints, find the parrot's home, and count sweet bananas with Buddy!",
          steps: [
            { stepNumber: 1, title: "Listen for the Swinging Monkey", instruction: "Disclose who makes the ooh ooh aah aah sound", activityId: "act-jungle-sound-monkey", rewardStars: 1 },
            { stepNumber: 2, title: "Examine Giant Paw Prints", instruction: "Identify the animal with padded paws", activityId: "act-jungle-tracks-lion", rewardStars: 1 },
            { stepNumber: 3, title: "Find the Parrot's Home", instruction: "Locate the tall jungle treetops", activityId: "act-jungle-habitat-parrot", rewardStars: 1 },
            { stepNumber: 4, title: "Count 4 Ripe Bananas", instruction: "Pick 4 yellow bananas for Buddy", activityId: "act-jungle-count-bananas", rewardStars: 1 },
          ],
          rewardStars: 3,
          rewardXP: 75,
        },
      ],
    },

    // Area 3: Ocean Reef (Unlocks after earning 4 stars)
    {
      id: "ocean-reef",
      worldId: "animal-world",
      title: "Ocean Reef",
      emoji: "🌊",
      tagline: "Turquoise Waves, Coral Gardens & Swimming Friends",
      environment: {
        bgGradient: "from-cyan-300 via-blue-200 to-indigo-300 text-blue-950",
        cardBg: "bg-cyan-50/90 border-cyan-300",
        accentColor: "cyan",
        sceneryEmojis: ["🌊", "🐬", "🪼", "🐚", "🪸"],
        ambientDescription: "Sunbeams dancing through crystal clear blue water as dolphins leap and turtles glide.",
      },
      requiredStarsToUnlock: 4,
      unlockRequirementText: "Earn 4 Stars in Animal World to dive into the Ocean Reef!",
      activities: [
        {
          id: "act-ocean-sound-dolphin",
          worldId: "animal-world",
          areaId: "ocean-reef",
          title: "Click-Click Splash Leaper",
          type: "sound-detective",
          learningObjective: "Identifying marine life from auditory echolocation clues",
          difficulty: 2,
          clueType: "sound",
          clueIcon: "👂",
          cluePrompt: "Listen under the blue waves! Someone is clicking playfully and leaping high: 'Click-click splash!'",
          spokenPrompt: "Listen to the sparkling water! Who clicks happily and leaps high out of ocean waves?",
          soundEffectText: "Click-click splash!",
          options: [
            { id: "dolphin", label: "Playful Dolphin", emoji: "🐬", feedback: "Click click splash! The dolphin leaps high and smiles!", soundCue: "Splash!", isCorrect: true },
            { id: "horse", label: "Brown Horse", emoji: "🐴", feedback: "Horses run across green grassy fields!", isCorrect: false },
            { id: "camel", label: "Desert Camel", emoji: "🐪", feedback: "Camels walk across warm desert dunes.", isCorrect: false },
            { id: "chicken", label: "Farm Chicken", emoji: "🐔", feedback: "Chickens peck seeds on the farm coop.", isCorrect: false },
          ],
          rewardStars: 1,
          rewardXP: 25,
          replayable: true,
        },
        {
          id: "act-ocean-glowing-jellyfish",
          worldId: "animal-world",
          areaId: "ocean-reef",
          title: "The Glowing Deep-Sea Friend",
          type: "clue-detective",
          learningObjective: "Visual observation of marine bioluminescence",
          difficulty: 2,
          clueType: "sight",
          clueIcon: "✨",
          cluePrompt: "In the deeper coral cove, who pulses with gentle pink light like a floating underwater lantern?",
          spokenPrompt: "Who floats like a magical lantern glowing softly in the deep water?",
          options: [
            { id: "jellyfish", label: "Pink Jellyfish", emoji: "🪼", feedback: "Blink blink! The glowing jellyfish pulses like starlight!", soundCue: "Blink blink!", isCorrect: true },
            { id: "rock", label: "Gray Sea Rock", emoji: "🪨", feedback: "That is a solid ocean stone on the seabed.", isCorrect: false },
            { id: "boot", label: "Lost Boot", emoji: "🥾", feedback: "An old rubber boot doesn't glow or swim!", isCorrect: false },
          ],
          rewardStars: 1,
          rewardXP: 25,
          replayable: true,
        },
        {
          id: "act-ocean-sorting-land-water",
          worldId: "animal-world",
          areaId: "ocean-reef",
          title: "Land Explorers vs. Ocean Swimmers",
          type: "sorting",
          learningObjective: "Categorization of land mammals vs aquatic life",
          difficulty: 2,
          clueType: "riddle",
          clueIcon: "🧩",
          cluePrompt: "Sort the animal friends: who walks on green land, and who swims in the blue ocean?",
          spokenPrompt: "Can you sort our animal friends? Put land walkers on the left and ocean swimmers on the right!",
          options: [
            { id: "whale", label: "Giant Whale", emoji: "🐳", feedback: "Whales swim gracefully in deep blue oceans!", isCorrect: true },
            { id: "lion", label: "Savanna Lion", emoji: "🦁", feedback: "Lions walk on grassy savanna soil!", isCorrect: true },
          ],
          rewardStars: 1,
          rewardXP: 30,
          replayable: true,
        },
      ],
      missions: [
        {
          id: "msn-ocean-voyage",
          worldId: "animal-world",
          areaId: "ocean-reef",
          title: "Coral Reef Submarine Voyage",
          tagline: "Dive with Captain Turtle and meet glowing friends",
          badgeEmoji: "🐬",
          badgeTitle: "Deep Sea Navigator",
          description: "Listen for the playful dolphin, spot the glowing jellyfish, and sort land and sea creatures!",
          steps: [
            { stepNumber: 1, title: "Find the Leaping Dolphin", instruction: "Listen for click-click splash", activityId: "act-ocean-sound-dolphin", rewardStars: 1 },
            { stepNumber: 2, title: "Spot the Glowing Jellyfish", instruction: "Find the pulsing lantern in the canyon", activityId: "act-ocean-glowing-jellyfish", rewardStars: 1 },
            { stepNumber: 3, title: "Sort Land vs Sea", instruction: "Categorize creatures by their natural home", activityId: "act-ocean-sorting-land-water", rewardStars: 1 },
          ],
          rewardStars: 3,
          rewardXP: 60,
        },
      ],
    },

    // Area 4: Dino Valley (Unlocks after earning 6 stars)
    {
      id: "dino-valley",
      worldId: "animal-world",
      title: "Dino Valley",
      emoji: "🦖",
      tagline: "Prehistoric Jungles, Giant Footprints & Friendly Giants",
      environment: {
        bgGradient: "from-amber-300 via-orange-200 to-emerald-300 text-amber-950",
        cardBg: "bg-amber-50/90 border-amber-400",
        accentColor: "amber",
        sceneryEmojis: ["🦖", "🦕", "🌋", "🌿", "🪨"],
        ambientDescription: "Towering ancient ferns under warm volcanic skies where friendly giants leave enormous footprints.",
      },
      requiredStarsToUnlock: 6,
      unlockRequirementText: "Earn 6 Stars across Animal World to unlock Dino Valley!",
      activities: [
        {
          id: "act-dino-long-neck",
          worldId: "animal-world",
          areaId: "dino-valley",
          title: "Treetop Leaf Eater",
          type: "clue-detective",
          learningObjective: "Observing dinosaur physical traits and herbivore diets",
          difficulty: 2,
          clueType: "riddle",
          clueIcon: "🌴",
          cluePrompt: "Who had the super long neck that reached all the way to the top of tallest ancient palm trees?",
          spokenPrompt: "Who had the magnificent extra-long neck to reach sweet green leaves in the highest treetops?",
          options: [
            { id: "brachio", label: "Long-Neck Brachiosaurus", emoji: "🦕", feedback: "Munch munch! The gentle giant reaches right into the highest branches!", soundCue: "Munch munch!", isCorrect: true },
            { id: "crab", label: "Beach Crab", emoji: "🦀", feedback: "Beach crabs crawl sideways on ocean sand!", isCorrect: false },
            { id: "duck", label: "Pond Duck", emoji: "🦆", feedback: "Ducks swim in farm ponds and say quack!", isCorrect: false },
          ],
          rewardStars: 1,
          rewardXP: 30,
          replayable: true,
        },
        {
          id: "act-dino-mighty-roar",
          worldId: "animal-world",
          areaId: "dino-valley",
          title: "Thundering Giant Footsteps",
          type: "sound-detective",
          learningObjective: "Auditory recognition of mighty roaring dinosaurs",
          difficulty: 3,
          clueType: "sound",
          clueIcon: "👂",
          cluePrompt: "BOOM! BOOM! The ground trembles as a mighty prehistoric king lets out a giant 'ROOOAAR!'",
          spokenPrompt: "Listen to the heavy footsteps: Boom! Boom! Who lets out a mighty dinosaur roar?",
          soundEffectText: "ROOOAAAR!",
          options: [
            { id: "trex", label: "Mighty T-Rex", emoji: "🦖", feedback: "ROOOOAR! Giant T-Rex takes big stomping steps across Dino Valley!", soundCue: "ROOOAR!", isCorrect: true },
            { id: "mouse", label: "Little Mouse", emoji: "🐭", feedback: "Squeak squeak! Tiny mouse scurries through the grass.", isCorrect: false },
            { id: "turtle", label: "Small Turtle", emoji: "🐢", feedback: "Slow and steady turtle crawls softly.", isCorrect: false },
          ],
          rewardStars: 1,
          rewardXP: 30,
          replayable: true,
        },
      ],
      missions: [
        {
          id: "msn-dino-excavation",
          worldId: "animal-world",
          areaId: "dino-valley",
          title: "Prehistoric Fossil Expedition",
          tagline: "Uncover gentle long-necks and the mighty T-Rex",
          badgeEmoji: "🦖",
          badgeTitle: "Dino Master Paleontologist",
          description: "Explore the ancient prehistoric valley with Buddy to discover who ate treetops and who roared across the valley!",
          steps: [
            { stepNumber: 1, title: "Find the Long-Neck Giant", instruction: "Spot the dinosaur reaching highest treetop leaves", activityId: "act-dino-long-neck", rewardStars: 1 },
            { stepNumber: 2, title: "Hear the Mighty Roar", instruction: "Listen for the thundering footsteps of T-Rex", activityId: "act-dino-mighty-roar", rewardStars: 1 },
          ],
          rewardStars: 3,
          rewardXP: 75,
        },
      ],
    },
  ],
};

// ==========================================================================
// WORLD 2: ADVENTURE WORLD
// ==========================================================================
export const ADVENTURE_WORLD: ToddlerWorld = {
  id: "adventure-world",
  title: "Adventure World",
  tagline: "Forest Trails, Weather, Space & Treasure Quests",
  emoji: "🚀",
  gradient: "from-sky-500 via-indigo-500 to-blue-600",
  borderColor: "border-sky-400",
  themeColor: "sky",
  learningGoals: [
    "Navigate weather changes & appropriate clothing",
    "Blast off into space & count starlight constellations",
    "Solve forest trails through observation",
    "Discover treasures using navigational maps",
  ],
  description: "Put on your astronaut helmet or rainboots! Journey from enchanted woodland trails all the way into outer space with Rocket Pip!",
  collectionRewards: [
    { id: "col-space-helmet", title: "Astronaut Bubble Helmet", emoji: "🧑‍🚀", description: "Earned by touching down on the silver moon!", requiredStars: 5 },
    { id: "col-treasure-gem", title: "Sparkling Sea Emerald", emoji: "💎", description: "Discovered inside the coral reef chest!", requiredStars: 9 },
  ],
  areas: [
    // Area 1: Forest Trail
    {
      id: "forest-trail",
      worldId: "adventure-world",
      title: "Forest Trail",
      emoji: "🌲",
      tagline: "Pinecones, Singing Birds & Mossy Pathways",
      environment: {
        bgGradient: "from-emerald-200 via-teal-100 to-green-200 text-emerald-950",
        cardBg: "bg-emerald-50/90 border-emerald-300",
        accentColor: "emerald",
        sceneryEmojis: ["🌲", "🐿️", "🍄", "🪵", "🦋"],
        ambientDescription: "Gentle pine breeze rustling through tall evergreens while chipmunks hide crunchy acorns.",
      },
      requiredStarsToUnlock: 0,
      activities: [
        {
          id: "act-forest-bird-song",
          worldId: "adventure-world",
          areaId: "forest-trail",
          title: "Morning Forest Singer",
          type: "sound-detective",
          learningObjective: "Recognizing woodland birds and small critters",
          difficulty: 1,
          clueType: "sound",
          clueIcon: "👂",
          cluePrompt: "Listen high in the pine branches: 'Chirp chirp tweedle-dee!' Who is singing?",
          spokenPrompt: "Listen to the sweet forest song! Who sings chirp chirp tweedle dee high in the trees?",
          soundEffectText: "Chirp chirp tweedle-dee!",
          options: [
            { id: "bird", label: "Singing Bluebird", emoji: "🐦", feedback: "Sweet melody! The bluebird flutters its wings and sings!", soundCue: "Chirp chirp!", isCorrect: true },
            { id: "bear", label: "Sleepy Bear", emoji: "🐻", feedback: "Bears growl softly and nap in cozy caves!", isCorrect: false },
            { id: "snake", label: "Forest Snake", emoji: "🐍", feedback: "Snakes slither through leaves and say sss sss.", isCorrect: false },
          ],
          rewardStars: 1,
          rewardXP: 25,
          replayable: true,
        },
        {
          id: "act-forest-pinecone-count",
          worldId: "adventure-world",
          areaId: "forest-trail",
          title: "Pinecones on the Path",
          type: "counting",
          learningObjective: "Counting natural trail items",
          difficulty: 1,
          clueType: "counting",
          clueIcon: "🪵",
          cluePrompt: "Buddy spotted brown pinecones dropped by friendly squirrels. How many are on the trail?",
          spokenPrompt: "Count the brown pinecones on the mossy path: one, two, three!",
          options: [
            { id: "1", label: "1 Pinecone", emoji: "1️⃣", feedback: "There are more than one pinecone here!", isCorrect: false },
            { id: "3", label: "3 Pinecones", emoji: "3️⃣", feedback: "Hooray! 1, 2, 3 pinecones collected for craft time!", isCorrect: true },
            { id: "5", label: "5 Pinecones", emoji: "5️⃣", feedback: "Count again carefully with your finger!", isCorrect: false },
          ],
          rewardStars: 1,
          rewardXP: 25,
          replayable: true,
        },
      ],
      missions: [],
    },

    // Area 2: Weather & Seasons (Unlocks with 2 stars)
    {
      id: "weather-adventure",
      worldId: "adventure-world",
      title: "Weather Adventure",
      emoji: "🌦️",
      tagline: "Raindrops, Sunbeams & Dressing for the Day",
      environment: {
        bgGradient: "from-sky-200 via-amber-100 to-indigo-200 text-sky-950",
        cardBg: "bg-sky-50/90 border-sky-300",
        accentColor: "sky",
        sceneryEmojis: ["🌦️", "🌈", "☀️", "🌧️", "❄️"],
        ambientDescription: "Pitter-patter raindrops tapping on windowpanes followed by a brilliant seven-color rainbow.",
      },
      requiredStarsToUnlock: 2,
      unlockRequirementText: "Earn 2 Stars to unlock Weather Adventure!",
      activities: [
        {
          id: "act-weather-rain-protection",
          worldId: "adventure-world",
          areaId: "weather-adventure",
          title: "Rainy Day Stay-Dry Helper",
          type: "clue-detective",
          learningObjective: "Connecting weather conditions with daily protective items",
          difficulty: 1,
          clueType: "riddle",
          clueIcon: "🌧️",
          cluePrompt: "Pitter patter! Raindrops are falling from gray clouds. What do we open high to stay completely dry?",
          spokenPrompt: "Pitter patter rain is falling! What do we pop open to keep our head dry?",
          soundEffectText: "Pitter patter splash!",
          options: [
            { id: "umbrella", label: "Bright Umbrella", emoji: "☂️", feedback: "Pop! The umbrella shields us from every cool raindrop!", soundCue: "Pop!", isCorrect: true },
            { id: "sunglasses", label: "Sunglasses", emoji: "🕶️", feedback: "Sunglasses protect our eyes from bright sunshine!", isCorrect: false },
            { id: "swimsuit", label: "Swimsuit", emoji: "🩱", feedback: "Swimsuits are for splashing in the swimming pool!", isCorrect: false },
          ],
          rewardStars: 1,
          rewardXP: 25,
          replayable: true,
        },
        {
          id: "act-weather-sun-warmth",
          worldId: "adventure-world",
          areaId: "weather-adventure",
          title: "Bright Morning Sunshine",
          type: "clue-detective",
          learningObjective: "Recognizing the sun as the source of light and day warmth",
          difficulty: 1,
          clueType: "sight",
          clueIcon: "🌤️",
          cluePrompt: "Which giant glowing star shines in the daytime sky, warming the flowers and waking the day?",
          spokenPrompt: "Which glowing star warms the earth and shines bright yellow sunshine every morning?",
          options: [
            { id: "sun", label: "Smiling Sun", emoji: "☀️", feedback: "Warm and bright! The sunshine brings daylight to our world!", isCorrect: true },
            { id: "moon", label: "Crescent Moon", emoji: "🌙", feedback: "The moon glows peacefully during nighttime sleep.", isCorrect: false },
            { id: "cloud", label: "Rainy Cloud", emoji: "🌧️", feedback: "Rain clouds bring water for trees and flowers.", isCorrect: false },
          ],
          rewardStars: 1,
          rewardXP: 25,
          replayable: true,
        },
      ],
      missions: [],
    },

    // Area 3: Space Blast-Off (Unlocks with 4 stars)
    {
      id: "space-blastoff",
      worldId: "adventure-world",
      title: "Space Blast-Off",
      emoji: "🚀",
      tagline: "Countdown 3-2-1, Twinkling Constellations & Moon Bounce",
      environment: {
        bgGradient: "from-slate-900 via-indigo-950 to-purple-900 text-white",
        cardBg: "bg-indigo-950/80 border-indigo-500",
        accentColor: "indigo",
        sceneryEmojis: ["🚀", "🧑‍🚀", "⭐", "🌕", "🛸"],
        ambientDescription: "Glittering star-filled galaxies where silver rockets cruise past friendly planets.",
      },
      requiredStarsToUnlock: 4,
      unlockRequirementText: "Earn 4 Stars to launch into Outer Space!",
      activities: [
        {
          id: "act-space-countdown-button",
          worldId: "adventure-world",
          areaId: "space-blastoff",
          title: "The Big Red Launch Button",
          type: "clue-detective",
          learningObjective: "Sequencing and launch initiation",
          difficulty: 2,
          clueType: "sight",
          clueIcon: "🚀",
          cluePrompt: "Pip is buckled into the silver rocket! The countdown is 3... 2... 1... What initiates blast-off?",
          spokenPrompt: "Pip is ready! Countdown: 3, 2, 1! Tap the glowing launch button to blast off!",
          soundEffectText: "Whooooosh!",
          options: [
            { id: "launch", label: "Blast Off! 🚀", emoji: "🔴", feedback: "WHOOOOSH! Flames roar and the rocket zooms into the starlight!", soundCue: "Whoosh!", isCorrect: true },
            { id: "nap", label: "Take a Nap", emoji: "💤", feedback: "No napping on the launch pad! Tap blast off!", isCorrect: false },
          ],
          rewardStars: 1,
          rewardXP: 30,
          replayable: true,
        },
        {
          id: "act-space-count-stars",
          worldId: "adventure-world",
          areaId: "space-blastoff",
          title: "Twinkling Starlight Count",
          type: "counting",
          learningObjective: "Counting spatial objects against high contrast backdrop",
          difficulty: 2,
          clueType: "counting",
          clueIcon: "⭐",
          cluePrompt: "Look out the rocket window! How many golden stars are twinkling brightly outside?",
          spokenPrompt: "Look at the glowing stars outside the rocket! Can you count 4 shiny stars?",
          soundEffectText: "Twinkle sparkle!",
          options: [
            { id: "2", label: "2 Stars", emoji: "2️⃣", feedback: "Look again, there are more stars shining!", isCorrect: false },
            { id: "4", label: "4 Twinkling Stars", emoji: "4️⃣", feedback: "Sparkle sparkle! Exactly 4 golden stars lighting the galaxy!", soundCue: "Twinkle!", isCorrect: true },
            { id: "6", label: "6 Stars", emoji: "6️⃣", feedback: "Let's count: one, two, three, four!", isCorrect: false },
          ],
          rewardStars: 1,
          rewardXP: 30,
          replayable: true,
        },
        {
          id: "act-space-moon-story",
          worldId: "adventure-world",
          areaId: "space-blastoff",
          title: "Rocket Pip Goes to the Moon",
          type: "story-adventure",
          learningObjective: "Narrative comprehension and branching decisions",
          difficulty: 2,
          clueType: "sight",
          clueIcon: "📚",
          cluePrompt: "Join Astronaut Pip on his journey all the way to the silver moon!",
          spokenPrompt: "Let's read Rocket Pip Goes to the Moon together! Tap to begin the adventure!",
          storyAdventureId: "space-rocket-explorer",
          options: [
            { id: "read", label: "Blast Off to Moon Tale", emoji: "🌕", feedback: "Here we go into outer space!", isCorrect: true },
          ],
          rewardStars: 3,
          rewardXP: 50,
          replayable: true,
        },
      ],
      missions: [
        {
          id: "msn-moon-voyager",
          worldId: "adventure-world",
          areaId: "space-blastoff",
          title: "Lunar Landing Mission",
          tagline: "Blast off and explore the moon with Pip",
          badgeEmoji: "🚀",
          badgeTitle: "Space Cadet Commander",
          description: "Press the launch button, count outer-space stars, and touch down softly on the moon!",
          steps: [
            { stepNumber: 1, title: "Launch Pip's Rocket", instruction: "Hit the glowing launch control", activityId: "act-space-countdown-button", rewardStars: 1 },
            { stepNumber: 2, title: "Count 4 Twinkling Stars", instruction: "Identify the group of 4 stars", activityId: "act-space-count-stars", rewardStars: 1 },
          ],
          rewardStars: 3,
          rewardXP: 60,
        },
      ],
    },

    // Area 4: Treasure Quest (Unlocks with 6 stars)
    {
      id: "treasure-quest",
      worldId: "adventure-world",
      title: "Treasure Quest",
      emoji: "🗺️",
      tagline: "Mysterious Island Maps & Golden Chests",
      environment: {
        bgGradient: "from-amber-200 via-yellow-100 to-sky-200 text-amber-950",
        cardBg: "bg-yellow-50/90 border-amber-300",
        accentColor: "amber",
        sceneryEmojis: ["🗺️", "💎", "🧭", "🏝️", "🗝️"],
        ambientDescription: "A secret sandy cove marked with an X where golden doubloons and shells shimmer.",
      },
      requiredStarsToUnlock: 6,
      unlockRequirementText: "Earn 6 Stars to unlock the Treasure Quest!",
      activities: [
        {
          id: "act-treasure-chest-key",
          worldId: "adventure-world",
          areaId: "treasure-quest",
          title: "The Golden Chest Key",
          type: "clue-detective",
          learningObjective: "Matching tool function to lock mechanism",
          difficulty: 2,
          clueType: "riddle",
          clueIcon: "🔒",
          cluePrompt: "The wooden treasure chest is locked tight! What shiny tool turns the lock to open it?",
          spokenPrompt: "The treasure chest is locked! What shiny golden item turns the keyhole to open it?",
          options: [
            { id: "key", label: "Golden Key", emoji: "🗝️", feedback: "Click clack! The golden key fits right into the lock!", soundCue: "Click!", isCorrect: true },
            { id: "spoon", label: "Soup Spoon", emoji: "🥄", feedback: "Spoons are for delicious soup, not locks!", isCorrect: false },
            { id: "pencil", label: "Color Pencil", emoji: "✏️", feedback: "Pencils are for drawing pictures!", isCorrect: false },
          ],
          rewardStars: 1,
          rewardXP: 30,
          replayable: true,
        },
      ],
      missions: [],
    },
  ],
};

// ==========================================================================
// WORLD 3: CREATIVE WORLD
// ==========================================================================
export const CREATIVE_WORLD: ToddlerWorld = {
  id: "creative-world",
  title: "Creative World",
  tagline: "Magic Color Mixing, Rainbow Piano & Art Atelier",
  emoji: "🎨",
  gradient: "from-pink-500 via-purple-500 to-rose-500",
  borderColor: "border-pink-400",
  themeColor: "pink",
  learningGoals: [
    "Experiment with primary colors to create secondary blends",
    "Explore musical pitch, tempo and rainbow melodies",
    "Complete rhythmic patterns and symmetric art",
    "Express personal creativity through sticker collages",
  ],
  description: "A magical studio where puddles of paint sparkle, piano keys play rainbow notes, and children become budding artists!",
  collectionRewards: [
    { id: "col-rainbow-paintbrush", title: "Magical Paintbrush", emoji: "🖌️", description: "Earned by blending every primary paint recipe!", requiredStars: 4 },
    { id: "col-music-note", title: "Golden Treble Clef", emoji: "🎵", description: "Played a flawless rainbow piano melody!", requiredStars: 8 },
  ],
  areas: [
    // Area 1: Color Studio
    {
      id: "color-studio",
      worldId: "creative-world",
      title: "Color Magic Studio",
      emoji: "🎨",
      tagline: "Red, Yellow & Blue Droplets Creating New Wonders",
      environment: {
        bgGradient: "from-rose-200 via-pink-100 to-purple-200 text-pink-950",
        cardBg: "bg-pink-50/90 border-pink-300",
        accentColor: "pink",
        sceneryEmojis: ["🎨", "🔴", "🟡", "🔵", "🌈"],
        ambientDescription: "Jars of glowing magical paints ready to be swirled together onto clean white paper.",
      },
      requiredStarsToUnlock: 0,
      activities: [
        {
          id: "act-color-mix-orange",
          worldId: "creative-world",
          areaId: "color-studio",
          title: "Mix Red and Yellow Paint",
          type: "color-lab",
          learningObjective: "Predicting and mixing secondary colors (Orange)",
          difficulty: 1,
          clueType: "creative",
          clueIcon: "🎨",
          cluePrompt: "Drop bright Red into Sunny Yellow! What sparkling sweet fruit color appears?",
          spokenPrompt: "When we mix ruby Red with sunny Yellow paint, what magical color appears?",
          options: [
            { id: "orange", label: "Sparkling Orange 🍊", emoji: "🍊", feedback: "Hooray! Red plus Yellow creates juicy sweet Orange!", soundCue: "Ta-da!", isCorrect: true },
            { id: "blue", label: "Dark Blue", emoji: "🔵", feedback: "Look again: red and yellow make a warm citrus color!", isCorrect: false },
            { id: "black", label: "Black", emoji: "⚫", feedback: "Red and yellow stay bright and warm!", isCorrect: false },
          ],
          rewardStars: 1,
          rewardXP: 30,
          replayable: true,
        },
        {
          id: "act-color-mix-green",
          worldId: "creative-world",
          areaId: "color-studio",
          title: "Mix Ocean Blue and Sunny Yellow",
          type: "color-lab",
          learningObjective: "Predicting and mixing secondary colors (Green)",
          difficulty: 1,
          clueType: "creative",
          clueIcon: "🎨",
          cluePrompt: "Drop Ocean Blue into Sunny Yellow! What fresh grass color magically appears?",
          spokenPrompt: "When we mix ocean Blue with sunny Yellow paint, what fresh nature color appears?",
          options: [
            { id: "green", label: "Emerald Green 🌱", emoji: "🌱", feedback: "Yes! Blue plus Yellow magically transforms into fresh grass Green!", soundCue: "Ta-da!", isCorrect: true },
            { id: "red", label: "Ruby Red", emoji: "🔴", feedback: "Blue and yellow blend into the color of green leaves!", isCorrect: false },
            { id: "white", label: "Snow White", emoji: "⚪", feedback: "Blue and yellow make a rich garden green!", isCorrect: false },
          ],
          rewardStars: 1,
          rewardXP: 30,
          replayable: true,
        },
      ],
      missions: [
        {
          id: "msn-color-wizard",
          worldId: "creative-world",
          areaId: "color-studio",
          title: "Apprentice Color Wizard",
          tagline: "Blend primary drops to unlock the rainbow",
          badgeEmoji: "🎨",
          badgeTitle: "Master Color Chemist",
          description: "Mix red and yellow to make orange, then mix blue and yellow to brew emerald green!",
          steps: [
            { stepNumber: 1, title: "Brew Sweet Orange", instruction: "Mix ruby Red with sunny Yellow", activityId: "act-color-mix-orange", rewardStars: 1 },
            { stepNumber: 2, title: "Brew Emerald Green", instruction: "Mix ocean Blue with sunny Yellow", activityId: "act-color-mix-green", rewardStars: 1 },
          ],
          rewardStars: 3,
          rewardXP: 60,
        },
      ],
    },

    // Area 2: Music Garden (Unlocks with 2 stars)
    {
      id: "music-garden",
      worldId: "creative-world",
      title: "Music Garden",
      emoji: "🎹",
      tagline: "Rainbow Piano, High Notes & Joyful Rhythm",
      environment: {
        bgGradient: "from-purple-200 via-indigo-100 to-pink-200 text-purple-950",
        cardBg: "bg-purple-50/90 border-purple-300",
        accentColor: "purple",
        sceneryEmojis: ["🎹", "🎵", "🔔", "🥁", "🪈"],
        ambientDescription: "Musical blossoms chime melodious notes whenever a gentle breeze brushes their petals.",
      },
      requiredStarsToUnlock: 2,
      unlockRequirementText: "Earn 2 Stars to unlock the Music Garden!",
      activities: [
        {
          id: "act-music-high-low",
          worldId: "creative-world",
          areaId: "music-garden",
          title: "High Bird vs. Low Trombone",
          type: "piano-melody",
          learningObjective: "Distinguishing high pitch vs low pitch frequencies",
          difficulty: 1,
          clueType: "sound",
          clueIcon: "🎵",
          cluePrompt: "Listen to the notes! Which musical friend sings with a high sweet pitch like a flute?",
          spokenPrompt: "Listen to the notes! Who sings high up in the sky like a sweet flute?",
          soundEffectText: "Tweedle-dee!",
          options: [
            { id: "flute", label: "High Singing Flute", emoji: "🪈", feedback: "Tweedle dee! Sweet high notes sparkle in the air!", soundCue: "Ding!", isCorrect: true },
            { id: "tuba", label: "Deep Low Tuba", emoji: "🎺", feedback: "Oom-pah! Tuba plays deep, low booming notes!", isCorrect: false },
          ],
          rewardStars: 1,
          rewardXP: 25,
          replayable: true,
        },
      ],
      missions: [],
    },

    // Area 3: Pattern Workshop (Unlocks with 4 stars)
    {
      id: "pattern-workshop",
      worldId: "creative-world",
      title: "Pattern Workshop",
      emoji: "🧩",
      tagline: "AB Patterns, Rhythm Chains & Matching Shapes",
      environment: {
        bgGradient: "from-amber-200 via-pink-100 to-sky-200 text-amber-950",
        cardBg: "bg-pink-50/90 border-pink-300",
        accentColor: "pink",
        sceneryEmojis: ["🧩", "🔴", "🔷", "⭐", "🔶"],
        ambientDescription: "A cheerful crafting table with geometric stamps, beads, and pattern chains.",
      },
      requiredStarsToUnlock: 4,
      unlockRequirementText: "Earn 4 Stars to unlock the Pattern Workshop!",
      activities: [
        {
          id: "act-pattern-fruit-chain",
          worldId: "creative-world",
          areaId: "pattern-workshop",
          title: "Complete the Fruit Pattern",
          type: "pattern-match",
          learningObjective: "Identifying and extending ABAB sequences",
          difficulty: 2,
          clueType: "riddle",
          clueIcon: "🔄",
          cluePrompt: "Say the pattern out loud: Apple, Banana, Apple, Banana... What comes next?",
          spokenPrompt: "Apple, Banana, Apple, Banana... What sweet fruit comes next in the pattern?",
          options: [
            { id: "apple", label: "Apple 🍎", emoji: "🍎", feedback: "Hooray! Apple comes next! A-B-A-B pattern complete!", soundCue: "Ta-da!", isCorrect: true },
            { id: "donut", label: "Donut 🍩", emoji: "🍩", feedback: "Look at the rhythm: Apple, Banana, Apple, Banana... what fruit is next?", isCorrect: false },
            { id: "grape", label: "Grape 🍇", emoji: "🍇", feedback: "Repeat the rhythm: Apple, Banana, Apple, Banana, Apple!", isCorrect: false },
          ],
          rewardStars: 1,
          rewardXP: 30,
          replayable: true,
        },
      ],
      missions: [],
    },

    // Area 4: Sticker Atelier (Unlocks with 6 stars)
    {
      id: "sticker-atelier",
      worldId: "creative-world",
      title: "Sticker Atelier",
      emoji: "✨",
      tagline: "Personal Collections, Badges & Album Glitters",
      environment: {
        bgGradient: "from-violet-200 via-purple-100 to-pink-200 text-violet-950",
        cardBg: "bg-purple-50/90 border-purple-300",
        accentColor: "purple",
        sceneryEmojis: ["✨", "🧸", "🎀", "👑", "🌟"],
        ambientDescription: "A glittering sticker album station where children admire collected stars and customize Buddy.",
      },
      requiredStarsToUnlock: 6,
      unlockRequirementText: "Earn 6 Stars to unlock the Sticker Atelier!",
      activities: [
        {
          id: "act-sticker-crown-pick",
          worldId: "creative-world",
          areaId: "sticker-atelier",
          title: "Crown for Learning Royalty",
          type: "clue-detective",
          learningObjective: "Self-expression and reward celebration",
          difficulty: 1,
          clueType: "creative",
          clueIcon: "✨",
          cluePrompt: "Buddy has worked hard learning new things. Which golden headpiece marks true learning royalty?",
          spokenPrompt: "Buddy worked so hard! Which shiny golden crown marks learning royalty?",
          options: [
            { id: "crown", label: "Golden Royal Crown", emoji: "👑", feedback: "Sparkle! Buddy beams with pride wearing the learning crown!", soundCue: "Ta-da!", isCorrect: true },
            { id: "bucket", label: "Sand Bucket", emoji: "🪣", feedback: "Sand buckets are for building beach castles!", isCorrect: false },
          ],
          rewardStars: 1,
          rewardXP: 25,
          replayable: true,
        },
      ],
      missions: [],
    },
  ],
};

// ==========================================================================
// WORLD 4: STORY WORLD
// ==========================================================================
export const STORY_WORLD: ToddlerWorld = {
  id: "story-world",
  title: "Story World",
  tagline: "Interactive Read-Aloud Tales with Choices",
  emoji: "📚",
  gradient: "from-violet-500 via-purple-500 to-indigo-600",
  borderColor: "border-violet-400",
  themeColor: "violet",
  learningGoals: [
    "Develop narrative listening comprehension",
    "Make participatory choices for story characters",
    "Build early vocabulary through contextual cues",
    "Foster a lifelong love of books and storytelling",
  ],
  description: "Turn illustrated pages with spoken narration, make choices for character heroes, and explore interactive branching tales!",
  collectionRewards: [
    { id: "col-story-scroll", title: "Golden Storybook Quill", emoji: "🪶", description: "Earned by completing three full story adventures!", requiredStars: 6 },
  ],
  areas: [
    {
      id: "barnyard-tales",
      worldId: "story-world",
      title: "Barnyard Tales",
      emoji: "🚜",
      tagline: "Buddy's Sunny Farm Day & Animal Friends",
      environment: {
        bgGradient: "from-amber-200 via-yellow-100 to-emerald-200 text-amber-950",
        cardBg: "bg-amber-50/90 border-amber-300",
        accentColor: "emerald",
        sceneryEmojis: ["🚜", "🐓", "🐣", "🐴", "🌾"],
        ambientDescription: "Morning sunshine illuminating the farm as Buddy's boots crunch across the barnyard.",
      },
      requiredStarsToUnlock: 0,
      activities: [
        {
          id: "act-story-farm-full",
          worldId: "story-world",
          areaId: "barnyard-tales",
          title: "Buddy's Sunny Farm Day",
          type: "story-adventure",
          learningObjective: "Multi-step narrative comprehension and choice making",
          difficulty: 1,
          clueType: "sight",
          clueIcon: "🚜",
          cluePrompt: "Join Buddy in the barn, count fluffy baby chicks, and feed Barnaby the horse!",
          spokenPrompt: "Help Buddy explore the farm, count baby chicks, and make happy farm friends!",
          storyAdventureId: "buddy-farm-adventure",
          options: [
            { id: "start", label: "Open Buddy's Farm Book", emoji: "📖", feedback: "Opening the farm book!", isCorrect: true },
          ],
          rewardStars: 3,
          rewardXP: 60,
          replayable: true,
        },
      ],
      missions: [],
    },
    {
      id: "space-tales",
      worldId: "story-world",
      title: "Starlight Tales",
      emoji: "🚀",
      tagline: "Rocket Pip Goes to the Moon",
      environment: {
        bgGradient: "from-slate-900 via-indigo-950 to-purple-950 text-white",
        cardBg: "bg-indigo-950/80 border-indigo-400",
        accentColor: "indigo",
        sceneryEmojis: ["🚀", "🧑‍🚀", "✨", "🌕", "👽"],
        ambientDescription: "Quiet starry space where astronauts dance on the dusty moon surface.",
      },
      requiredStarsToUnlock: 2,
      unlockRequirementText: "Earn 2 Stars to unlock Starlight Tales!",
      activities: [
        {
          id: "act-story-space-full",
          worldId: "story-world",
          areaId: "space-tales",
          title: "Rocket Pip Goes to the Moon",
          type: "story-adventure",
          learningObjective: "Interactive space voyage comprehension",
          difficulty: 2,
          clueType: "sight",
          clueIcon: "🚀",
          cluePrompt: "Blast off past twinkling stars and meet a friendly moon alien!",
          spokenPrompt: "Put on your astronaut helmet and blast off with Pip into outer space!",
          storyAdventureId: "space-rocket-explorer",
          options: [
            { id: "start", label: "Open Space Tale", emoji: "📖", feedback: "Blast off into the story!", isCorrect: true },
          ],
          rewardStars: 3,
          rewardXP: 60,
          replayable: true,
        },
      ],
      missions: [],
    },
    {
      id: "deep-sea-tales",
      worldId: "story-world",
      title: "Deep Sea Tales",
      emoji: "🌊",
      tagline: "Deep Sea Submarine Journey & Captain Turtle",
      environment: {
        bgGradient: "from-cyan-900 via-blue-950 to-slate-900 text-white",
        cardBg: "bg-blue-950/80 border-cyan-400",
        accentColor: "cyan",
        sceneryEmojis: ["🌊", "🤿", "🐢", "🪼", "💎"],
        ambientDescription: "Bubbles floating past the yellow submarine viewport into turquoise coral reefs.",
      },
      requiredStarsToUnlock: 4,
      unlockRequirementText: "Earn 4 Stars to unlock Deep Sea Tales!",
      activities: [
        {
          id: "act-story-ocean-full",
          worldId: "story-world",
          areaId: "deep-sea-tales",
          title: "Deep Sea Submarine Journey",
          type: "story-adventure",
          learningObjective: "Undersea marine exploration and narrative observation",
          difficulty: 2,
          clueType: "sight",
          clueIcon: "🌊",
          cluePrompt: "Dive with Captain Turtle, spot glowing jellyfish, and find hidden coral treasures!",
          spokenPrompt: "Glug glug glug! Climb aboard the yellow submarine for an ocean journey!",
          storyAdventureId: "ocean-submarine-secrets",
          options: [
            { id: "start", label: "Open Submarine Tale", emoji: "📖", feedback: "Diving under the waves!", isCorrect: true },
          ],
          rewardStars: 3,
          rewardXP: 60,
          replayable: true,
        },
      ],
      missions: [],
    },
  ],
};

// ==========================================================================
// WORLD 5: LEARNING WORLD
// ==========================================================================
export const LEARNING_WORLD: ToddlerWorld = {
  id: "learning-world",
  title: "Learning World",
  tagline: "Phonics Sounds, Counting Grove & Shapes",
  emoji: "🔤",
  gradient: "from-amber-400 via-orange-400 to-yellow-500",
  borderColor: "border-amber-300",
  themeColor: "amber",
  learningGoals: [
    "Hear and match early phonics sounds (A, B, S, M)",
    "Compare quantity groups (More vs Less)",
    "Identify geometric shapes in everyday environments",
    "Sharpen early reasoning & memory recall",
  ],
  description: "A sunny orchard where alphabet flowers blossom with letter sounds, crunchy carrots teach counting, and shapes form colorful bridges!",
  collectionRewards: [
    { id: "col-alphabet-trophy", title: "Golden ABC Medal", emoji: "🏅", description: "Mastered all phonics sound challenges!", requiredStars: 5 },
  ],
  areas: [
    // Area 1: Phonics Meadow
    {
      id: "phonics-meadow",
      worldId: "learning-world",
      title: "Phonics Meadow",
      emoji: "🔤",
      tagline: "Letter Sounds, Beginning Words & Singing Letters",
      environment: {
        bgGradient: "from-yellow-200 via-amber-100 to-emerald-200 text-amber-950",
        cardBg: "bg-yellow-50/90 border-amber-300",
        accentColor: "amber",
        sceneryEmojis: ["🔤", "🐻", "⭐", "🍎", "🐱"],
        ambientDescription: "Alphabet trees where ripe letter fruit speaks its own unique beginning sound.",
      },
      requiredStarsToUnlock: 0,
      activities: [
        {
          id: "act-phonics-letter-b",
          worldId: "learning-world",
          areaId: "phonics-meadow",
          title: "Who Starts with Letter B (/b/)?",
          type: "sound-detective",
          learningObjective: "Associating letter sound /b/ with beginning consonants",
          difficulty: 1,
          clueType: "sound",
          clueIcon: "👂",
          cluePrompt: "B says /b/! Can you find the cuddly woodland friend that begins with the /b/ /b/ sound?",
          spokenPrompt: "B says buh! Which item starts with the buh buh sound of letter B?",
          soundEffectText: "Buh buh!",
          options: [
            { id: "bear", label: "Brown Bear", emoji: "🐻", feedback: "Yes! B is for Bear! Buh buh Bear!", soundCue: "Buh buh!", isCorrect: true },
            { id: "apple", label: "Red Apple", emoji: "🍎", feedback: "Apple starts with letter A! /æ/ /æ/ Apple!", isCorrect: false },
            { id: "cat", label: "Cat", emoji: "🐱", feedback: "Cat starts with letter C! /k/ /k/ Cat!", isCorrect: false },
          ],
          rewardStars: 1,
          rewardXP: 25,
          replayable: true,
        },
        {
          id: "act-phonics-letter-s",
          worldId: "learning-world",
          areaId: "phonics-meadow",
          title: "Who Starts with Letter S (/s/)?",
          type: "sound-detective",
          learningObjective: "Associating letter sound /s/ with beginning consonants",
          difficulty: 1,
          clueType: "sound",
          clueIcon: "👂",
          cluePrompt: "S says /s/! Can you find what sparkles in the night sky with the /s/ /s/ sound?",
          spokenPrompt: "S says sss! Which item starts with the sss sss sound of letter S?",
          soundEffectText: "Sss sss!",
          options: [
            { id: "star", label: "Twinkling Star", emoji: "⭐", feedback: "Yes! S is for Star! Sss sss Star!", soundCue: "Sss sss!", isCorrect: true },
            { id: "elephant", label: "Elephant", emoji: "🐘", feedback: "Elephant starts with letter E! /e/ Elephant!", isCorrect: false },
            { id: "lion", label: "Lion", emoji: "🦁", feedback: "Lion starts with letter L! /l/ Lion!", isCorrect: false },
          ],
          rewardStars: 1,
          rewardXP: 25,
          replayable: true,
        },
      ],
      missions: [
        {
          id: "msn-phonics-detective",
          worldId: "learning-world",
          areaId: "phonics-meadow",
          title: "Alphabet Sound Detective",
          tagline: "Track down letter sounds with Buddy",
          badgeEmoji: "🔤",
          badgeTitle: "Phonics Scout Master",
          description: "Listen for the /b/ sound in Bear, and track the /s/ sound in Star!",
          steps: [
            { stepNumber: 1, title: "Find the /b/ sound", instruction: "Identify the friend who begins with B", activityId: "act-phonics-letter-b", rewardStars: 1 },
            { stepNumber: 2, title: "Find the /s/ sound", instruction: "Spot what sparkles with S", activityId: "act-phonics-letter-s", rewardStars: 1 },
          ],
          rewardStars: 3,
          rewardXP: 60,
        },
      ],
    },

    // Area 2: Counting Grove (Unlocks with 2 stars)
    {
      id: "counting-grove",
      worldId: "learning-world",
      title: "Counting Grove",
      emoji: "🔢",
      tagline: "Carrots, Strawberries & More vs. Less Comparisons",
      environment: {
        bgGradient: "from-emerald-200 via-teal-100 to-amber-200 text-emerald-950",
        cardBg: "bg-emerald-50/90 border-emerald-300",
        accentColor: "emerald",
        sceneryEmojis: ["🔢", "🥕", "🍓", "🎈", "⭐"],
        ambientDescription: "A fruitful garden where counting things makes them grow bigger and brighter.",
      },
      requiredStarsToUnlock: 2,
      unlockRequirementText: "Earn 2 Stars to unlock the Counting Grove!",
      activities: [
        {
          id: "act-counting-more-stars",
          worldId: "learning-world",
          areaId: "counting-grove",
          title: "Which Box Has MORE Stars?",
          type: "clue-detective",
          learningObjective: "Quantity comparison (More vs Fewer)",
          difficulty: 1,
          clueType: "counting",
          clueIcon: "🌟",
          cluePrompt: "Look at both groups of stars: which one has MORE stars to collect?",
          spokenPrompt: "Look at both groups: which one has MORE shiny golden stars?",
          options: [
            { id: "four", label: "Four Stars (⭐⭐⭐⭐)", emoji: "⭐⭐⭐⭐", feedback: "Yes! Four stars is MORE than one star! Brilliant job!", soundCue: "Ta-da!", isCorrect: true },
            { id: "one", label: "One Star (⭐)", emoji: "⭐", feedback: "This is just one single star! Find the group with MORE stars.", isCorrect: false },
          ],
          rewardStars: 1,
          rewardXP: 25,
          replayable: true,
        },
      ],
      missions: [],
    },

    // Area 3: Shapes & Patterns (Unlocks with 4 stars)
    {
      id: "shapes-patterns",
      worldId: "learning-world",
      title: "Shapes & Patterns",
      emoji: "🔷",
      tagline: "Circles, Squares, Triangles & Star Bridges",
      environment: {
        bgGradient: "from-sky-200 via-indigo-100 to-pink-200 text-sky-950",
        cardBg: "bg-sky-50/90 border-sky-300",
        accentColor: "sky",
        sceneryEmojis: ["🔷", "⭕", "🔺", "⭐", "🟩"],
        ambientDescription: "Colorful geometric stepping stones paving paths across rolling green meadows.",
      },
      requiredStarsToUnlock: 4,
      unlockRequirementText: "Earn 4 Stars to unlock Shapes & Patterns!",
      activities: [
        {
          id: "act-shapes-circle-round",
          worldId: "learning-world",
          areaId: "shapes-patterns",
          title: "Find the Round Circle",
          type: "clue-detective",
          learningObjective: "Identifying circles by continuous curved geometry",
          difficulty: 1,
          clueType: "riddle",
          clueIcon: "⭕",
          cluePrompt: "I have no sharp corners and roll smoothly like a rubber ball! Which shape am I?",
          spokenPrompt: "I have no sharp corners and roll round and round like a ball! Which shape am I?",
          options: [
            { id: "circle", label: "Round Red Circle", emoji: "🔴", feedback: "Yes! A circle is perfectly round with zero sharp corners!", soundCue: "Boing!", isCorrect: true },
            { id: "square", label: "Blue Square", emoji: "🟦", feedback: "A square has four straight sides and four corners!", isCorrect: false },
            { id: "triangle", label: "Yellow Triangle", emoji: "🔺", feedback: "A triangle has three pointy corners!", isCorrect: false },
          ],
          rewardStars: 1,
          rewardXP: 25,
          replayable: true,
        },
      ],
      missions: [],
    },
  ],
};

// ==========================================================================
// WORLD 6: MY WORLD
// ==========================================================================
export const MY_WORLD: ToddlerWorld = {
  id: "my-world",
  title: "My World",
  tagline: "Family, Feelings, Daily Routines & My Buddy",
  emoji: "🏡",
  gradient: "from-amber-400 via-orange-400 to-rose-400",
  borderColor: "border-amber-300",
  themeColor: "amber",
  learningGoals: [
    "Identify emotional expressions & self-calming strategies",
    "Recognize bodily senses (eyes, ears, hands)",
    "Practice healthy habits (brushing teeth, washing hands)",
    "Celebrate family helpers and beloved pets",
  ],
  description: "Explore the comfort of home, happy family feelings, healthy snacks, bedtime routines, and growing up with your personal Buddy!",
  collectionRewards: [
    { id: "col-buddy-hug", title: "Golden Heart Hug Badge", emoji: "💖", description: "Awarded for exploring all feelings and healthy habits!", requiredStars: 4 },
  ],
  areas: [
    // Area 1: Feelings & Emotions
    {
      id: "feelings-emotions",
      worldId: "my-world",
      title: "Feelings & Emotions",
      emoji: "😊",
      tagline: "Big Smiles, Gentle Breaths & Kind Hearts",
      environment: {
        bgGradient: "from-amber-200 via-rose-100 to-pink-200 text-amber-950",
        cardBg: "bg-amber-50/90 border-amber-300",
        accentColor: "rose",
        sceneryEmojis: ["😊", "💖", "🤗", "✨", "🎈"],
        ambientDescription: "A cozy sunlit room filled with soft cushions, warm smiles, and comforting hugs.",
      },
      requiredStarsToUnlock: 0,
      activities: [
        {
          id: "act-feelings-happy-smile",
          worldId: "my-world",
          areaId: "feelings-emotions",
          title: "Happy & Smiling Face",
          type: "clue-detective",
          learningObjective: "Recognizing facial expressions of happiness and joy",
          difficulty: 1,
          clueType: "riddle",
          clueIcon: "😊",
          cluePrompt: "Who is feeling super HAPPY, full of joy and smiling brightly today?",
          spokenPrompt: "Can you tap the friend who is feeling super happy and wearing a big bright smile?",
          options: [
            { id: "happy", label: "Happy Smile", emoji: "😄", feedback: "Yay! Big happy smile fills our heart with sunshine!", soundCue: "Yay!", isCorrect: true },
            { id: "sleepy", label: "Sleepy Yawn", emoji: "🥱", feedback: "Yaaawn! That friend is getting ready for a cozy nap.", isCorrect: false },
            { id: "crying", label: "Sad Tear", emoji: "😢", feedback: "Aww, feeling a little sad. A gentle hug helps us feel better.", isCorrect: false },
          ],
          rewardStars: 1,
          rewardXP: 25,
          replayable: true,
        },
      ],
      missions: [
        {
          id: "msn-happy-helper",
          worldId: "my-world",
          areaId: "feelings-emotions",
          title: "Warm Heart Explorer",
          tagline: "Discover how our body and feelings express joy",
          badgeEmoji: "😊",
          badgeTitle: "Sunshine Sprout",
          description: "Identify the big happy smile and explore healthy habits with Buddy!",
          steps: [
            { stepNumber: 1, title: "Find the Big Happy Smile", instruction: "Identify the cheerful friend", activityId: "act-feelings-happy-smile", rewardStars: 1 },
          ],
          rewardStars: 3,
          rewardXP: 50,
        },
      ],
    },

    // Area 2: Healthy Habits & Body (Unlocks with 2 stars)
    {
      id: "healthy-habits",
      worldId: "my-world",
      title: "Healthy Habits & Body",
      emoji: "🪥",
      tagline: "Sparkly Clean Teeth, Crunchy Apples & Listening Ears",
      environment: {
        bgGradient: "from-sky-200 via-teal-100 to-emerald-200 text-sky-950",
        cardBg: "bg-sky-50/90 border-sky-300",
        accentColor: "sky",
        sceneryEmojis: ["🪥", "🍎", "🧼", "👂", "👀"],
        ambientDescription: "A bright bathroom and kitchen where soap bubbles float and crunchy fruits await.",
      },
      requiredStarsToUnlock: 2,
      unlockRequirementText: "Earn 2 Stars to unlock Healthy Habits!",
      activities: [
        {
          id: "act-habits-toothbrush",
          worldId: "my-world",
          areaId: "healthy-habits",
          title: "Brushing Our Teeth Clean",
          type: "clue-detective",
          learningObjective: "Understanding personal hygiene and tooth care routines",
          difficulty: 1,
          clueType: "riddle",
          clueIcon: "🫧",
          cluePrompt: "What do we use morning and night with foamy bubbles to keep our teeth clean and sparkly?",
          spokenPrompt: "What do we use morning and night with foamy bubbles to brush our teeth sparkly clean?",
          soundEffectText: "Brush brush brush!",
          options: [
            { id: "toothbrush", label: "Sparkly Toothbrush", emoji: "🪥", feedback: "Brush brush brush! Sparkly clean teeth ready for a bright smile!", soundCue: "Brush brush!", isCorrect: true },
            { id: "pillow", label: "Soft Pillow", emoji: "🛋️", feedback: "Pillows are for resting our head at bedtime!", isCorrect: false },
            { id: "crayon", label: "Color Crayon", emoji: "🖍️", feedback: "Crayons are for drawing colorful pictures!", isCorrect: false },
          ],
          rewardStars: 1,
          rewardXP: 25,
          replayable: true,
        },
        {
          id: "act-habits-listening-ears",
          worldId: "my-world",
          areaId: "healthy-habits",
          title: "Our Wonderful Listening Ears",
          type: "clue-detective",
          learningObjective: "Sensory body awareness (Hearing)",
          difficulty: 1,
          clueType: "riddle",
          clueIcon: "🎶",
          cluePrompt: "Which part of our body do we use to hear singing birds, bedtime stories, and sweet music?",
          spokenPrompt: "Which part of our body do we use to listen to music and singing birds?",
          options: [
            { id: "ear", label: "Two Listening Ears", emoji: "👂", feedback: "Yes! Two ears listen to sweet music, stories and laughter!", soundCue: "Listen!", isCorrect: true },
            { id: "eye", label: "Eyes", emoji: "👀", feedback: "Eyes are for looking and seeing bright colors!", isCorrect: false },
            { id: "nose", label: "Nose", emoji: "👃", feedback: "Our nose is for smelling garden flowers and fresh bread!", isCorrect: false },
          ],
          rewardStars: 1,
          rewardXP: 25,
          replayable: true,
        },
      ],
      missions: [],
    },

    // Area 3: Family & Home (Unlocks with 4 stars)
    {
      id: "family-home",
      worldId: "my-world",
      title: "Family & Cozy Home",
      emoji: "🏡",
      tagline: "Baby Siblings, Kind Grandparents & Cozy Bedtime",
      environment: {
        bgGradient: "from-amber-200 via-yellow-100 to-orange-200 text-amber-950",
        cardBg: "bg-amber-50/90 border-amber-300",
        accentColor: "amber",
        sceneryEmojis: ["🏡", "👶", "👴", "🐶", "🛏️"],
        ambientDescription: "A warm family living room with storybooks, soft rugs, and family laughter.",
      },
      requiredStarsToUnlock: 4,
      unlockRequirementText: "Earn 4 Stars to unlock Family & Home!",
      activities: [
        {
          id: "act-family-sweet-baby",
          worldId: "my-world",
          areaId: "family-home",
          title: "Sweet Baby Sibling",
          type: "clue-detective",
          learningObjective: "Family relationships and caregiving",
          difficulty: 1,
          clueType: "riddle",
          clueIcon: "🍼",
          cluePrompt: "Find the tiny baby in the family who drinks warm milk from a bottle and loves soft cuddles!",
          spokenPrompt: "Can you spot the little baby brother or sister who loves warm gentle cuddles?",
          options: [
            { id: "baby", label: "Cute Baby", emoji: "👶", feedback: "Goo goo gaga! Sweet little baby smiles and claps tiny hands!", soundCue: "Giggle!", isCorrect: true },
            { id: "grandpa", label: "Grandpa", emoji: "👴", feedback: "Kind grandpa tells wonderful bedtime stories!", isCorrect: false },
            { id: "dog", label: "Family Puppy", emoji: "🐶", feedback: "Woof woof! Friendly puppy wags his tail!", isCorrect: false },
          ],
          rewardStars: 1,
          rewardXP: 25,
          replayable: true,
        },
      ],
      missions: [],
    },
  ],
};

// Array of all 6 Master Learning Worlds
export const ALL_TODDLER_WORLDS: ToddlerWorld[] = [
  ANIMAL_WORLD,
  ADVENTURE_WORLD,
  CREATIVE_WORLD,
  STORY_WORLD,
  LEARNING_WORLD,
  MY_WORLD,
];
