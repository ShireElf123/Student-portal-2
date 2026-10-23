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
        illustration: "🚀 🚀 ✨",
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
        illustration: "🐙 ✨ 🌊",
        bgGradient: "from-blue-950 to-indigo-950 text-white",
        challengeType: "choice",
        question: "Which jellyfish glows pink like a flower?",
        options: [
          { id: "pink", label: "Pink Jellyfish 🌸", emoji: "🐙", isCorrect: true, feedback: "Blink blink! The pink jellyfish glows softly to say hello!" },
          { id: "rock", label: "Gray Ocean Rock", emoji: "⛰️", isCorrect: false, feedback: "That's a solid ocean stone!" },
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
  {
    id: "pancake-saturday-tale",
    title: "Pancake Saturday",
    coverEmoji: "🥞",
    coverGradient: "from-amber-400 to-rose-400",
    tagline: "Mix, flip, and share a tall breakfast stack with Nana.",
    steps: [
      {
        stepNumber: 1,
        sceneTitle: "The Yellow Bowl",
        storyText: "Saturday sun on the table. Nana taps the mixing bowl. Teddy ties a tiny apron.",
        spokenNarration: "Saturday! Nana taps the bowl. What do we crack into breakfast?",
        illustration: "🥣 🧸 ☀️",
        bgGradient: "from-amber-100 to-yellow-200 text-amber-950",
        challengeType: "choice",
        question: "What goes in the pancake bowl first?",
        options: [
          { id: "eggs", label: "Three eggs", emoji: "🥚", isCorrect: true, feedback: "Crack crack crack! Three eggs plop in." },
          { id: "boots", label: "Rain boots", emoji: "👢", isCorrect: true, feedback: "Silly! Boots stay by the door. Let's crack eggs instead — and we still giggle." },
        ],
      },
      {
        stepNumber: 2,
        sceneTitle: "Stir Circles",
        storyText: "Milk makes a white river. Teddy stirs slow circles. The batter looks like a pale moon.",
        spokenNarration: "Stir slow circles. What shape is the mixing bowl?",
        illustration: "🥛 🥄 🌕",
        bgGradient: "from-slate-50 to-amber-100 text-slate-900",
        challengeType: "choice",
        question: "What shape is Nana's mixing bowl?",
        options: [
          { id: "circle", label: "A circle", emoji: "⭕", isCorrect: true, feedback: "Yes! A round bowl for round pancakes." },
          { id: "square", label: "A square box", emoji: "📦", isCorrect: true, feedback: "Boxes are square. This bowl is a circle — still a good looking." },
        ],
      },
      {
        stepNumber: 3,
        sceneTitle: "The Flip",
        storyText: "The pan sings. Flip! A pancake turns like a little sun. Teddy claps.",
        spokenNarration: "Flip time! How should we cheer the pancake?",
        illustration: "🥞 ✨ 🍳",
        bgGradient: "from-orange-100 to-amber-200 text-orange-950",
        challengeType: "choice",
        question: "Cheer the flip!",
        options: [
          { id: "clap", label: "Clap clap!", emoji: "👏", isCorrect: true, feedback: "Clap clap! A golden sun pancake." },
          { id: "whisper", label: "A proud whisper", emoji: "🤫", isCorrect: true, feedback: "A proud whisper. The pancake still heard you." },
        ],
      },
      {
        stepNumber: 4,
        sceneTitle: "Five in a Tower",
        storyText: "One, two, three, four, five. The stack is a breakfast tower. Berries sit on top like jewels.",
        spokenNarration: "Count the stack with me.",
        illustration: "🥞🥞🥞 🍓",
        bgGradient: "from-rose-100 to-amber-100 text-rose-950",
        challengeType: "count",
        question: "How many pancakes in the tower?",
        options: [
          { id: "five", label: "Five", emoji: "5️⃣", isCorrect: true, feedback: "Five! A tall, kind tower." },
          { id: "two", label: "Two", emoji: "2️⃣", isCorrect: true, feedback: "Look again — it is a five-pancake tower, and counting helps." },
        ],
      },
      {
        stepNumber: 5,
        sceneTitle: "We Share",
        storyText: "Teddy cuts a tiny triangle. Nana gets a circle. Both say thank you.",
        spokenNarration: "Sharing time. What kind words do we say?",
        illustration: "🍴 💛 🧸",
        bgGradient: "from-lime-100 to-amber-100 text-lime-950",
        challengeType: "choice",
        question: "What do we say when we share?",
        options: [
          { id: "thanks", label: "Thank you", emoji: "🙏", isCorrect: true, feedback: "Thank you tastes like honey." },
          { id: "mine", label: "All mine", emoji: "🙈", isCorrect: true, feedback: "We try again: thank you. Saturday is for sharing." },
        ],
      },
      {
        stepNumber: 6,
        sceneTitle: "Sticky Kisses",
        storyText: "Syrup dots on noses. The kitchen smells like a hug. Saturday is full.",
        spokenNarration: "Syrup noses! What a Saturday. High five the cook!",
        illustration: "🍯 😊 🏡",
        bgGradient: "from-amber-200 to-rose-200 text-amber-950",
        challengeType: "choice",
        question: "High five Nana!",
        options: [
          { id: "highfive", label: "High five!", emoji: "🖐️", isCorrect: true, feedback: "High five! Pancake Saturday is done." },
        ],
      },
    ],
  },
  {
    id: "firehouse-friday-tale",
    title: "Firehouse Friday",
    coverEmoji: "🚒",
    coverGradient: "from-red-500 to-amber-400",
    tagline: "Ride with Rosie the truck and help a cat in an oak tree.",
    steps: [
      {
        stepNumber: 1,
        sceneTitle: "Sleepy Garage",
        storyText: "Rosie the fire truck naps. A bell waits on the wall like a bright cherry.",
        spokenNarration: "Rosie is napping. What wakes a fire truck?",
        illustration: "🚒 😴 🔔",
        bgGradient: "from-red-100 to-orange-200 text-red-950",
        challengeType: "sound",
        question: "What should we tap?",
        options: [
          { id: "bell", label: "The bell", emoji: "🔔", isCorrect: true, feedback: "CLANG CLANG! Lights blink. The door lifts." },
          { id: "pillow", label: "A pillow", emoji: "🛏️", isCorrect: true, feedback: "Pillows are for later. The bell is singing — clang!" },
        ],
      },
      {
        stepNumber: 2,
        sceneTitle: "Maple Street",
        storyText: "Rosie rolls past bakery steam and a blue mailbox. Cars make a polite path.",
        spokenNarration: "Down Maple Street! How do we ride?",
        illustration: "🚒 🍞 📫",
        bgGradient: "from-sky-100 to-red-100 text-sky-950",
        challengeType: "choice",
        question: "How does Rosie go?",
        options: [
          { id: "roll", label: "Roll and wee-ooo", emoji: "🚨", isCorrect: true, feedback: "Wee-ooo! A polite, careful roll." },
          { id: "fly", label: "Fly like a kite", emoji: "🎈", isCorrect: true, feedback: "Trucks stay on the road. Rosie rolls, and that is plenty brave." },
        ],
      },
      {
        stepNumber: 3,
        sceneTitle: "Pepper in the Oak",
        storyText: "Not a fire. A cat named Pepper is stuck in the oak. Rosie understands.",
        spokenNarration: "Who needs help in the oak tree?",
        illustration: "🐱 🌳 🚒",
        bgGradient: "from-emerald-100 to-lime-200 text-emerald-950",
        challengeType: "find",
        question: "Who is stuck?",
        options: [
          { id: "cat", label: "Pepper the cat", emoji: "🐱", isCorrect: true, feedback: "Mew! Helpers help, even when it is not a fire." },
          { id: "cloud", label: "A cloud", emoji: "☁️", isCorrect: true, feedback: "Clouds float fine. Look — a cat in the oak." },
        ],
      },
      {
        stepNumber: 4,
        sceneTitle: "Ladder Beanstalk",
        storyText: "The ladder grows. Step. Step. Step. Safe arms wait at the top.",
        spokenNarration: "Climb with care. How many steps do we count?",
        illustration: "🏡 👷 🌳",
        bgGradient: "from-orange-100 to-amber-200 text-orange-950",
        challengeType: "count",
        question: "Count the steps: 1, 2, 3.",
        options: [
          { id: "three", label: "Three steps", emoji: "3️⃣", isCorrect: true, feedback: "Three careful steps. Pepper is close." },
          { id: "twenty", label: "Twenty steps", emoji: "2️⃣", isCorrect: true, feedback: "It feels long! Today we count three brave steps." },
        ],
      },
      {
        stepNumber: 5,
        sceneTitle: "Rainbow Spray",
        storyText: "Pepper is safe. A soft spray makes a tiny rainbow. Only sparkle today.",
        spokenNarration: "Safe cat! A tiny rainbow. How do we feel?",
        illustration: "💦 🌈 🐱",
        bgGradient: "from-cyan-100 to-sky-200 text-cyan-950",
        challengeType: "choice",
        question: "How do we celebrate?",
        options: [
          { id: "purr", label: "Purr and wave", emoji: "👋", isCorrect: true, feedback: "Purr. Wave. Sparkle." },
          { id: "dance", label: "Boot dance", emoji: "💃", isCorrect: true, feedback: "A careful boot dance beside the truck!" },
        ],
      },
      {
        stepNumber: 6,
        sceneTitle: "Garage Blanket",
        storyText: "Rosie rolls home. The garage is a blanket. The bell sleeps, ready again.",
        spokenNarration: "Home to the garage. Park Rosie.",
        illustration: "🚒 🏠 🌙",
        bgGradient: "from-indigo-100 to-red-100 text-indigo-950",
        challengeType: "choice",
        question: "Park the truck.",
        options: [
          { id: "park", label: "Park and rest", emoji: "🅿️", isCorrect: true, feedback: "Parked. Helpers rest. Ready again tomorrow." },
        ],
      },
    ],
  },
  {
    id: "snow-maple-tale",
    title: "Snow Day on Maple Street",
    coverEmoji: "❄️",
    coverGradient: "from-sky-400 to-indigo-500",
    tagline: "Build a snow pal, wave to the plow, and sip cocoa steam.",
    steps: [
      {
        stepNumber: 1,
        sceneTitle: "White Coat Street",
        storyText: "Maple Street wears a white coat. Momo the mouse presses his nose to the glass.",
        spokenNarration: "Snow day! What do we put on first?",
        illustration: "🐭 🏠 ❄️",
        bgGradient: "from-sky-100 to-slate-200 text-sky-950",
        challengeType: "choice",
        question: "What do we put on?",
        options: [
          { id: "mittens", label: "A mitten pair", emoji: "👋", isCorrect: true, feedback: "Red mitten, blue mitten. A pair like two friends." },
          { id: "swim", label: "Swim goggles", emoji: "👓", isCorrect: true, feedback: "Goggles are for pools. Mittens today — and we still smile." },
        ],
      },
      {
        stepNumber: 2,
        sceneTitle: "Crunch Letters",
        storyText: "Crunch crunch. Each step writes a mouse letter. The mailbox wears a hat.",
        spokenNarration: "Crunch a path. What is on the mailbox?",
        illustration: "🐾 📫 ⛄",
        bgGradient: "from-slate-100 to-sky-200 text-slate-900",
        challengeType: "find",
        question: "What is on the mailbox?",
        options: [
          { id: "hat", label: "A snow hat", emoji: "🎩", isCorrect: true, feedback: "A snow hat! The mailbox looks proud." },
          { id: "boat", label: "A sailboat", emoji: "⛵", isCorrect: true, feedback: "No lake here. A snow hat it is." },
        ],
      },
      {
        stepNumber: 3,
        sceneTitle: "Three Balls",
        storyText: "Small, middle, big. Stack. Carrot nose. Pebble eyes.",
        spokenNarration: "How many snowballs make the pal?",
        illustration: "⚪ ⚪ ⚪ 🥕",
        bgGradient: "from-white to-sky-200 text-sky-950",
        challengeType: "count",
        question: "Count the snowballs.",
        options: [
          { id: "three", label: "Three", emoji: "3️⃣", isCorrect: true, feedback: "Three! Small, middle, big." },
          { id: "eight", label: "Eight", emoji: "8️⃣", isCorrect: true, feedback: "Let's count again: one, two, three." },
        ],
      },
      {
        stepNumber: 4,
        sceneTitle: "Yellow Plow",
        storyText: "A yellow plow hums. Two neat roads. Momo waves. Lights wave back.",
        spokenNarration: "The plow! How do we say hello?",
        illustration: "🚜 🛣️ ✨",
        bgGradient: "from-yellow-100 to-sky-200 text-yellow-950",
        challengeType: "choice",
        question: "Say hello to the plow.",
        options: [
          { id: "wave", label: "Wave both mittens", emoji: "👋", isCorrect: true, feedback: "Wave! The lights wink back." },
          { id: "hide", label: "Hide behind the pal", emoji: "⛄", isCorrect: true, feedback: "Peek-a-boo, then a wave. The plow likes waves." },
        ],
      },
      {
        stepNumber: 5,
        sceneTitle: "Cocoa Cloud",
        storyText: "Cocoa steam. Marshmallows like tiny snowmen. Warm toes.",
        spokenNarration: "Sip. What makes the steam?",
        illustration: "☕ ☁️ 👟",
        bgGradient: "from-amber-100 to-orange-100 text-amber-950",
        challengeType: "choice",
        question: "What are we sipping?",
        options: [
          { id: "cocoa", label: "Warm cocoa", emoji: "☕", isCorrect: true, feedback: "Sip. Warm toes. Marshmallow snowmen." },
          { id: "snow", label: "A snowball soup", emoji: "❄️", isCorrect: true, feedback: "Too cold! Cocoa instead. Ahh." },
        ],
      },
      {
        stepNumber: 6,
        sceneTitle: "Lamps On",
        storyText: "Lamps blink. The snow pal keeps watch. Maple Street is a quiet story.",
        spokenNarration: "Lamps on. Goodnight, snow pal.",
        illustration: "🏮 ⛄ 🌙",
        bgGradient: "from-indigo-200 to-slate-300 text-indigo-950",
        challengeType: "choice",
        question: "Tuck the street in.",
        options: [
          { id: "night", label: "Goodnight, snow", emoji: "🌙", isCorrect: true, feedback: "Goodnight Maple Street. The pal keeps watch." },
        ],
      },
    ],
  },
  {
    id: "library-mouse-tale",
    title: "Dot and the Quiet Lion",
    coverEmoji: "📚",
    coverGradient: "from-amber-500 to-indigo-600",
    tagline: "Whisper in the library, stamp a card, and ride home with a lion book.",
    steps: [
      {
        stepNumber: 1,
        sceneTitle: "Golden Ticket",
        storyText: "Dot the mouse holds a library card. Doors whoosh like a page.",
        spokenNarration: "Show your library card. What kind of voice do we use inside?",
        illustration: "🐭 🎫 🚪",
        bgGradient: "from-amber-100 to-orange-100 text-amber-950",
        challengeType: "choice",
        question: "Library voice?",
        options: [
          { id: "whisper", label: "A feather whisper", emoji: "🤫", isCorrect: true, feedback: "Hello, whispered. The librarian whispers hello back." },
          { id: "shout", label: "A playground shout", emoji: "📣", isCorrect: true, feedback: "Outside voice stays outside. Inside we whisper. Hello…" },
        ],
      },
      {
        stepNumber: 2,
        sceneTitle: "Low Sunny Row",
        storyText: "Shelves are streets of stories. Picture books live on the low sunny row.",
        spokenNarration: "Where do the picture books live?",
        illustration: "📚 🌞 🧸",
        bgGradient: "from-orange-100 to-rose-100 text-orange-950",
        challengeType: "find",
        question: "Find the picture-book row.",
        options: [
          { id: "low", label: "The low sunny row", emoji: "📗", isCorrect: true, feedback: "Yes — the low row, just right for little paws." },
          { id: "roof", label: "The roof tiles", emoji: "🏠", isCorrect: true, feedback: "Roof is for rain. Books live on the low sunny row." },
        ],
      },
      {
        stepNumber: 3,
        sceneTitle: "Quiet Lion",
        storyText: "A cover lion listens, not scares. Dot sits on the story rug.",
        spokenNarration: "Sit on the rug. Who is on the cover?",
        illustration: "🦁 📗 🧸",
        bgGradient: "from-yellow-100 to-amber-200 text-amber-950",
        challengeType: "choice",
        question: "Who is on the book?",
        options: [
          { id: "lion", label: "A quiet lion", emoji: "🦁", isCorrect: true, feedback: "A listening roar. Sit criss-cross." },
          { id: "sub", label: "A submarine", emoji: "🚤", isCorrect: true, feedback: "Not today. Today a quiet lion." },
        ],
      },
      {
        stepNumber: 4,
        sceneTitle: "Stamp Kiss",
        storyText: "A stamp kisses the card. Due in two weeks. The ticket is magic again.",
        spokenNarration: "Stamp the card. How many weeks until it visits home again?",
        illustration: "📮 ⭐ 🎫",
        bgGradient: "from-rose-100 to-indigo-100 text-rose-950",
        challengeType: "count",
        question: "Due in how many weeks?",
        options: [
          { id: "two", label: "Two weeks", emoji: "2️⃣", isCorrect: true, feedback: "Two weeks. Magic ticket." },
          { id: "ten", label: "Ten years", emoji: "🔟", isCorrect: true, feedback: "That is a long nap. Two weeks is the library clock." },
        ],
      },
      {
        stepNumber: 5,
        sceneTitle: "Bus Pages",
        storyText: "On the bus, Dot looks. No shouting the story. The lion looks back from the page.",
        spokenNarration: "How do we read on the bus?",
        illustration: "🚌 📗 🏠",
        bgGradient: "from-sky-100 to-violet-100 text-sky-950",
        challengeType: "choice",
        question: "Reading on the ride.",
        options: [
          { id: "look", label: "Eyes on the page", emoji: "👀", isCorrect: true, feedback: "Eyes on the page. The lion looks back." },
          { id: "toss", label: "Toss the book", emoji: "🤾", isCorrect: true, feedback: "Books stay in laps. Eyes on the page." },
        ],
      },
      {
        stepNumber: 6,
        sceneTitle: "Bed Lamp Moon",
        storyText: "The lamp is a small moon. One more page. Lion sleeps. Dot sleeps.",
        spokenNarration: "Click the lamp. Goodnight, lion.",
        illustration: "💡 🦁 🌙",
        bgGradient: "from-indigo-200 to-violet-300 text-indigo-950",
        challengeType: "choice",
        question: "End of the tale.",
        options: [
          { id: "click", label: "Click. Goodnight.", emoji: "🌙", isCorrect: true, feedback: "Click. The lion sleeps. Dot sleeps." },
        ],
      },
    ],
  },
  {
    id: "kindness-wagon-tale",
    title: "The Kindness Wagon",
    coverEmoji: "🛒",
    coverGradient: "from-lime-400 to-rose-400",
    tagline: "Load a wagon with notes, fruit, and one extra smile for the block.",
    steps: [
      {
        stepNumber: 1,
        sceneTitle: "Empty Wagon",
        storyText: "The wagon is a red rectangle with kind wheels. It wants a job.",
        spokenNarration: "The wagon is empty. What shall we load first?",
        illustration: "🛒 ❤️ 🏡",
        bgGradient: "from-rose-100 to-amber-100 text-rose-950",
        challengeType: "choice",
        question: "First load?",
        options: [
          { id: "notes", label: "Kind notes", emoji: "💌", isCorrect: true, feedback: "Notes that say hi. The wagon likes paper hugs." },
          { id: "rocks", label: "Heavy rocks", emoji: "⛰️", isCorrect: true, feedback: "Too heavy for little wheels. Notes first!" },
        ],
      },
      {
        stepNumber: 2,
        sceneTitle: "Three Pears",
        storyText: "A neighbor adds three pears. They knock together like shy bells.",
        spokenNarration: "Count the pears.",
        illustration: "🍐 🍐 🍐",
        bgGradient: "from-lime-100 to-yellow-100 text-lime-950",
        challengeType: "count",
        question: "How many pears?",
        options: [
          { id: "three", label: "Three pears", emoji: "3️⃣", isCorrect: true, feedback: "Three shy bells of fruit." },
          { id: "one", label: "One pear", emoji: "1️⃣", isCorrect: true, feedback: "Look: one, two, three." },
        ],
      },
      {
        stepNumber: 3,
        sceneTitle: "The First Stoop",
        storyText: "At the first stoop, a tired gardener. We leave a note and one pear. The wagon feels lighter and bigger.",
        spokenNarration: "Who gets the first pear?",
        illustration: "🌱 💌 🍐",
        bgGradient: "from-emerald-100 to-lime-200 text-emerald-950",
        challengeType: "choice",
        question: "Share with?",
        options: [
          { id: "gardener", label: "The gardener", emoji: "🌱", isCorrect: true, feedback: "A note and a pear. The wagon feels bigger." },
          { id: "moon", label: "The moon", emoji: "🌙", isCorrect: true, feedback: "The moon has plenty of glow. The gardener needed this pear." },
        ],
      },
      {
        stepNumber: 4,
        sceneTitle: "Mail Pup",
        storyText: "Stamp the mail pup gets a water bowl stop. Kindness is a rest.",
        spokenNarration: "What does a helper pup need?",
        illustration: "🐶 🥣 💧",
        bgGradient: "from-sky-100 to-blue-100 text-sky-950",
        challengeType: "choice",
        question: "Help the pup.",
        options: [
          { id: "water", label: "A water bowl", emoji: "🥣", isCorrect: true, feedback: "Lick lick. Kindness is a rest stop." },
          { id: "hat", label: "A tiny top hat", emoji: "🎩", isCorrect: true, feedback: "Cute! And also a drink. Water first." },
        ],
      },
      {
        stepNumber: 5,
        sceneTitle: "Last Note",
        storyText: "One note left. It says YOU. We leave it on Nana's railing.",
        spokenNarration: "The last note is for Nana. How do we deliver it?",
        illustration: "💌 🧸 🌟",
        bgGradient: "from-violet-100 to-amber-100 text-violet-950",
        challengeType: "choice",
        question: "Deliver the last note.",
        options: [
          { id: "hands", label: "Two careful paws", emoji: "🐾", isCorrect: true, feedback: "Two paws. For you, Nana." },
          { id: "toss", label: "Toss it in the wind", emoji: "🌬️", isCorrect: true, feedback: "Wind is wild. Two careful paws instead." },
        ],
      },
      {
        stepNumber: 6,
        sceneTitle: "Wagon Nap",
        storyText: "Empty wagon. Full block. The wheels nap in the shade.",
        spokenNarration: "The wagon naps. You were the kindness today.",
        illustration: "🛒 😴 🌳",
        bgGradient: "from-amber-200 to-lime-200 text-amber-950",
        challengeType: "choice",
        question: "Park the wagon.",
        options: [
          { id: "nap", label: "Shade nap", emoji: "🌳", isCorrect: true, feedback: "Parked. The block feels lighter. You did it." },
        ],
      },
    ],
  },
];
