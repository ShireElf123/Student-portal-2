import { PictureBook } from "../../types";

export interface ToddlerWorldInfo {
  id: string;
  title: string;
  tagline: string;
  emoji: string;
  gradient: string;
  borderColor: string;
  themeColor: string;
  destinationCount: number;
  description: string;
}

export const TODDLER_WORLDS: ToddlerWorldInfo[] = [
  {
    id: "my-world",
    title: "My World",
    tagline: "Family, Feelings & Daily Routines",
    emoji: "🏡",
    gradient: "from-amber-400 to-orange-400",
    borderColor: "border-amber-300",
    themeColor: "amber",
    destinationCount: 5,
    description: "Explore familiar people, my home, happy feelings, yummy snacks, and helping hands!",
  },
  {
    id: "animal-world",
    title: "Animal World",
    tagline: "Safari, Farm, Ocean & Dino Friends",
    emoji: "🦁",
    gradient: "from-emerald-400 to-teal-500",
    borderColor: "border-emerald-300",
    themeColor: "emerald",
    destinationCount: 6,
    description: "Listen to real animal calls, match babies to moms, feed animals, and explore habitats!",
  },
  {
    id: "adventure-world",
    title: "Adventure World",
    tagline: "Space, Oceans & Dino Excavation",
    emoji: "🚀",
    gradient: "from-sky-400 to-indigo-500",
    borderColor: "border-sky-300",
    themeColor: "sky",
    destinationCount: 4,
    description: "Launch starry rockets, dive underwater with friendly dolphins, and dig for dinosaur fossils!",
  },
  {
    id: "creative-world",
    title: "Creative World",
    tagline: "Music, Colors & Sticker Studio",
    emoji: "🎨",
    gradient: "from-pink-400 to-purple-500",
    borderColor: "border-pink-300",
    themeColor: "pink",
    destinationCount: 4,
    description: "Play rainbow piano melodies, mix bright colors, and design your personal Learning Buddy!",
  },
  {
    id: "story-world",
    title: "Story World",
    tagline: "Interactive Read-Aloud Tales",
    emoji: "📚",
    gradient: "from-violet-400 to-purple-600",
    borderColor: "border-violet-300",
    themeColor: "violet",
    destinationCount: 6,
    description: "Turn pages with spoken narration, solve mini story challenges, and make choices for Buddy!",
  },
  {
    id: "learning-world",
    title: "Learning World",
    tagline: "Phonics, Counting & Shape Patterns",
    emoji: "🔤",
    gradient: "from-yellow-400 to-amber-500",
    borderColor: "border-yellow-300",
    themeColor: "yellow",
    destinationCount: 5,
    description: "Hear phonics letter sounds, count crunchy carrots, spot shapes, and complete colorful patterns!",
  },
];

// Interactive Branching Story Adventures
export interface StoryAdventureStep {
  stepNumber: number;
  sceneTitle: string;
  storyText: string;
  spokenNarration: string;
  illustration: string;
  bgGradient: string;
  challengeType: "choice" | "find" | "count" | "sound";
  question: string;
  options: {
    id: string;
    label: string;
    emoji: string;
    isCorrect?: boolean;
    feedback: string;
  }[];
}

export interface StoryAdventure {
  id: string;
  title: string;
  coverEmoji: string;
  coverGradient: string;
  tagline: string;
  steps: StoryAdventureStep[];
}

export const STORY_ADVENTURES: StoryAdventure[] = [
  {
    id: "buddy-farm-adventure",
    title: "Buddy's Sunny Farm Day",
    coverEmoji: "🚜",
    coverGradient: "from-emerald-400 to-amber-400",
    tagline: "Help Buddy explore the barn, count baby chicks, and feed the horse!",
    steps: [
      {
        stepNumber: 1,
        sceneTitle: "Morning at the Red Barn",
        storyText: "Cock-a-doodle-doo! The rooster crows as the warm sun rises over the farm. Buddy arrives wearing his boots!",
        spokenNarration: "Cock a doodle doo! The bright sun is rising over the farm. Who is waking up in the barn?",
        illustration: "🚜 🐓 🌾",
        bgGradient: "from-amber-100 to-yellow-200 text-amber-950",
        challengeType: "sound",
        question: "Can you tap the animal that says 'Moo' and gives milk?",
        options: [
          { id: "cow", label: "Friendly Cow", emoji: "🐮", isCorrect: true, feedback: "Moooo! The cow smiles and wags her tail!" },
          { id: "rooster", label: "Rooster", emoji: "🐓", isCorrect: false, feedback: "That's the rooster saying cock-a-doodle-doo! Let's find the cow!" },
          { id: "pig", label: "Piggy", emoji: "🐷", isCorrect: false, feedback: "That's the piggy saying oink oink! Let's find the cow!" },
        ],
      },
      {
        stepNumber: 2,
        sceneTitle: "Counting Little Fluffy Chicks",
        storyText: "Peep peep peep! Mother Hen has lost count of her fuzzy yellow baby chicks playing in the hay.",
        spokenNarration: "Peep peep peep! Can you help Mother Hen count her sweet baby chicks?",
        illustration: "🐣 🐣 🐣",
        bgGradient: "from-yellow-100 to-amber-200 text-amber-950",
        challengeType: "count",
        question: "How many yellow chicks are peeping in the hay?",
        options: [
          { id: "1", label: "One", emoji: "1️⃣", isCorrect: false, feedback: "Look closely, there are more than one!" },
          { id: "3", label: "Three Chicks", emoji: "3️⃣", isCorrect: true, feedback: "Yes! 1, 2, 3 fluffy yellow chicks! Good counting!" },
          { id: "5", label: "Five Chicks", emoji: "5️⃣", isCorrect: false, feedback: "Let's count together: one, two, three!" },
        ],
      },
      {
        stepNumber: 3,
        sceneTitle: "Snack for Barnaby the Horse",
        storyText: "Neigh! Barnaby the brown horse poked his head over the wooden fence. He is ready for a healthy farm snack!",
        spokenNarration: "Neigh! Barnaby the horse is hungry. What delicious treat should we feed him?",
        illustration: "🐴 🍎 🥕",
        bgGradient: "from-emerald-100 to-teal-200 text-teal-950",
        challengeType: "choice",
        question: "What does Barnaby the horse love to crunch?",
        options: [
          { id: "apple", label: "Crisp Red Apple", emoji: "🍎", isCorrect: true, feedback: "Crunch crunch! Barnaby loves sweet crunchy apples!" },
          { id: "pizza", label: "Slice of Pizza", emoji: "🍕", isCorrect: false, feedback: "Silly Buddy! Horses don't eat pizza! They love apples or carrots!" },
          { id: "carrot", label: "Sweet Orange Carrot", emoji: "🥕", isCorrect: true, feedback: "Munch munch! Barnaby neighs with happiness!" },
        ],
      },
      {
        stepNumber: 4,
        sceneTitle: "Tractor Ride Sunset",
        storyText: "Chugga-chugga-vroom! Farmer Jack gives Buddy a ride in the big green tractor as the evening stars appear.",
        spokenNarration: "Chugga chugga vroom! What a wonderful farm adventure! High five, farm champion!",
        illustration: "🚜 ⭐ 🌙",
        bgGradient: "from-indigo-100 to-purple-200 text-indigo-950",
        challengeType: "choice",
        question: "Give Buddy a giant celebration cheer!",
        options: [
          { id: "cheer", label: "High Five Buddy! ⭐", emoji: "🖐️", isCorrect: true, feedback: "High five! You finished Buddy's Farm Adventure and earned 3 stars!" },
        ],
      },
    ],
  },
  {
    id: "space-rocket-explorer",
    title: "Rocket Pip Goes to the Moon",
    coverEmoji: "🚀",
    coverGradient: "from-indigo-500 to-sky-400",
    tagline: "Blast off into space, count twinkling stars, and meet a friendly moon alien!",
    steps: [
      {
        stepNumber: 1,
        sceneTitle: "The Launchpad Countdown",
        storyText: "Pip puts on his shiny white astronaut helmet. The silver rocket is ready on the launch pad! 3... 2... 1...",
        spokenNarration: "Pip puts on his space helmet! The rocket is ready to blast off. What button launches the rocket?",
        illustration: "🚀 🧑‍🚀 ✨",
        bgGradient: "from-slate-900 to-indigo-950 text-white",
        challengeType: "choice",
        question: "Tap the big glowing button to launch the rocket!",
        options: [
          { id: "launch", label: "Blast Off! 🚀", emoji: "🔴", isCorrect: true, feedback: "Whoooosh! The rocket zooms high into the starlit sky!" },
          { id: "sleep", label: "Take a Nap", emoji: "💤", isCorrect: false, feedback: "Astronauts stay alert for launch! Tap the launch button!" },
        ],
      },
      {
        stepNumber: 2,
        sceneTitle: "Counting Twinkling Stars",
        storyText: "Out the rocket window, beautiful stars sparkle in shades of gold and blue. Let's count them together!",
        spokenNarration: "Look at the gorgeous stars glowing in space! Can you count the stars?",
        illustration: "⭐ ⭐ ⭐ ⭐",
        bgGradient: "from-indigo-950 to-purple-950 text-white",
        challengeType: "count",
        question: "How many stars are shining outside?",
        options: [
          { id: "2", label: "Two Stars", emoji: "2️⃣", isCorrect: false, feedback: "Count again with your finger!" },
          { id: "4", label: "Four Shiny Stars", emoji: "4️⃣", isCorrect: true, feedback: "Sparkle sparkle! Exactly 4 golden stars!" },
          { id: "6", label: "Six Stars", emoji: "6️⃣", isCorrect: false, feedback: "Almost! There are 4 stars here." },
        ],
      },
      {
        stepNumber: 3,
        sceneTitle: "Landing on the Moon",
        storyText: "Thump! The lunar legs touch down gently on the soft moon dust. A little friendly space alien waves hello!",
        spokenNarration: "Touchdown on the moon! A friendly little alien greets Pip with a cheerful wave!",
        illustration: "🌕 🛸 👽",
        bgGradient: "from-purple-950 to-slate-950 text-white",
        challengeType: "choice",
        question: "How should Pip say hello to the moon friend?",
        options: [
          { id: "wave", label: "Friendly Space Wave 👋", emoji: "👋", isCorrect: true, feedback: "The alien bobs happily and shares moon glow crystals!" },
          { id: "dance", label: "Zero Gravity Moon Dance 🕺", emoji: "🕺", isCorrect: true, feedback: "Wheee! Bouncing high in low moon gravity!" },
        ],
      },
    ],
  },
  {
    id: "ocean-submarine-secrets",
    title: "Deep Sea Submarine Journey",
    coverEmoji: "🌊",
    coverGradient: "from-cyan-500 to-blue-600",
    tagline: "Dive deep with Captain Turtle, spot glowing jellyfish, and find hidden shells!",
    steps: [
      {
        stepNumber: 1,
        sceneTitle: "Into the Clear Blue Water",
        storyText: "Glug glug glug! The yellow submarine dives into the turquoise ocean waves. Bright fish swim past the glass.",
        spokenNarration: "Glug glug glug! Down goes our yellow submarine! Can you spot the ocean creature with a hard shell?",
        illustration: "🌊 🤿 🐢",
        bgGradient: "from-cyan-900 to-blue-950 text-white",
        challengeType: "find",
        question: "Tap the swimming Sea Turtle!",
        options: [
          { id: "turtle", label: "Sea Turtle", emoji: "🐢", isCorrect: true, feedback: "Yes! The sea turtle glides gracefully through the water!" },
          { id: "crab", label: "Pinching Crab", emoji: "🦀", isCorrect: false, feedback: "That's a crab walking sideways on the sand!" },
          { id: "octopus", label: "Octopus", emoji: "🐙", isCorrect: false, feedback: "That's an eight-armed octopus!" },
        ],
      },
      {
        stepNumber: 2,
        sceneTitle: "Glowing Jellyfish Cove",
        storyText: "In the deeper canyon, magical jellyfish pulse with pink and purple light! They look like floating lanterns.",
        spokenNarration: "Look at the glowing jellyfish! What color is the brightest jellyfish?",
        illustration: "🪼 ✨ 🪸",
        bgGradient: "from-blue-950 to-indigo-950 text-white",
        challengeType: "choice",
        question: "Which jellyfish glows pink like a flower?",
        options: [
          { id: "pink", label: "Pink Jellyfish 🌸", emoji: "🪼", isCorrect: true, feedback: "Blink blink! The pink jellyfish glows softly to say hello!" },
          { id: "rock", label: "Gray Ocean Rock", emoji: "🪨", isCorrect: false, feedback: "That's a solid ocean stone!" },
        ],
      },
      {
        stepNumber: 3,
        sceneTitle: "Golden Ocean Treasure",
        storyText: "Tucked inside an ancient coral reef, Captain Turtle discovers a treasure chest overflowing with golden sea stars!",
        spokenNarration: "Hooray! Look at the shiny golden sea stars in the treasure chest!",
        illustration: "🐚 💎 ⭐",
        bgGradient: "from-teal-950 to-cyan-900 text-white",
        challengeType: "choice",
        question: "Claim your explorer ocean stars!",
        options: [
          { id: "stars", label: "Collect 3 Ocean Stars ⭐⭐⭐", emoji: "⭐", isCorrect: true, feedback: "Splish splash! You completed the submarine dive!" },
        ],
      },
    ],
  },
];
