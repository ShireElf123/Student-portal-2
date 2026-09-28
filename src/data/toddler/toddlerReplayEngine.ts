/**
 * Replayability Engine for Toddler Wonderland.
 * Generates dynamic, randomized, age-appropriate variations of activities,
 * counting sessions, sorting challenges, and matching games so that every session
 * is fresh, exciting, and prevents repetitive exhaustion!
 */

export interface DynamicCountingScenario {
  id: string;
  targetCount: number;
  itemName: string;
  itemEmoji: string;
  soundEffect: string;
  bgGradient: string;
  textColor: string;
  question: string;
  spokenPrompt: string;
  distractorCounts: number[];
}

export interface DynamicSortingChallenge {
  id: string;
  title: string;
  instruction: string;
  spokenPrompt: string;
  categoryA: { id: string; label: string; emoji: string; dropZoneColor: string };
  categoryB: { id: string; label: string; emoji: string; dropZoneColor: string };
  items: {
    id: string;
    label: string;
    emoji: string;
    correctCategory: "A" | "B";
    soundFeedback: string;
  }[];
}

const COUNTING_OBJECT_TEMPLATES = [
  { name: "Shiny Stars", emoji: "⭐", sound: "Twinkle twinkle!", bg: "from-purple-900 to-indigo-900", text: "text-amber-300" },
  { name: "Crunchy Carrots", emoji: "🥕", sound: "Crunch crunch!", bg: "from-emerald-900 to-teal-900", text: "text-orange-300" },
  { name: "Sweet Strawberries", emoji: "🍓", sound: "Yummy berry!", bg: "from-rose-900 to-pink-900", text: "text-rose-200" },
  { name: "Fluttering Butterflies", emoji: "🦋", sound: "Flap flap flutter!", bg: "from-sky-900 to-blue-900", text: "text-sky-200" },
  { name: "Rubber Duckies", emoji: "🦆", sound: "Quack quack splash!", bg: "from-cyan-900 to-blue-900", text: "text-yellow-300" },
  { name: "Toy Rockets", emoji: "🚀", sound: "Whoosh zoom!", bg: "from-slate-900 to-indigo-950", text: "text-cyan-300" },
  { name: "Sweet Apples", emoji: "🍎", sound: "Crisp and juicy!", bg: "from-amber-900 to-red-900", text: "text-red-300" },
  { name: "Playful Puppies", emoji: "🐶", sound: "Woof woof wag!", bg: "from-orange-900 to-amber-900", text: "text-amber-200" },
  { name: "Fluffy Kittens", emoji: "🐱", sound: "Purr meow cuddle!", bg: "from-pink-900 to-rose-950", text: "text-pink-200" },
  { name: "Golden Honeybees", emoji: "🐝", sound: "Buzz buzz buzz!", bg: "from-yellow-900 to-amber-950", text: "text-yellow-300" },
  { name: "Rainbow Balloons", emoji: "🎈", sound: "Pop float up!", bg: "from-violet-900 to-purple-950", text: "text-purple-200" },
  { name: "Swimming Goldfish", emoji: "🐠", sound: "Bubble bubble swish!", bg: "from-teal-900 to-cyan-950", text: "text-cyan-200" },
  { name: "Little Acorns", emoji: "🌰", sound: "Tap tap drop!", bg: "from-stone-900 to-amber-950", text: "text-amber-200" },
  { name: "Red Tulips", emoji: "🌷", sound: "Bloom in sun!", bg: "from-rose-900 to-emerald-950", text: "text-rose-300" },
  { name: "Sea Shells", emoji: "🐚", sound: "Ocean whisper!", bg: "from-indigo-900 to-cyan-950", text: "text-teal-200" },
  { name: "Spotted Ladybugs", emoji: "🐞", sound: "Crawl on leaf!", bg: "from-red-900 to-slate-950", text: "text-red-300" },
];

export function generateCountingScenario(level: number = 1): DynamicCountingScenario {
  const maxNumber = level <= 1 ? 5 : level === 2 ? 8 : 10;
  const count = Math.floor(Math.random() * maxNumber) + 1;
  const template = COUNTING_OBJECT_TEMPLATES[Math.floor(Math.random() * COUNTING_OBJECT_TEMPLATES.length)];

  // Create 2 distractors
  const distractors: number[] = [];
  while (distractors.length < 2) {
    const candidate = Math.floor(Math.random() * maxNumber) + 1;
    if (candidate !== count && !distractors.includes(candidate)) {
      distractors.push(candidate);
    }
  }

  const options = [count, ...distractors].sort(() => Math.random() - 0.5);

  return {
    id: `count-${Date.now()}-${count}`,
    targetCount: count,
    itemName: template.name,
    itemEmoji: template.emoji,
    soundEffect: template.sound,
    bgGradient: template.bg,
    textColor: template.text,
    question: `How many ${template.name} can you count?`,
    spokenPrompt: `Look at the screen! Can you count the ${template.name}? How many do you see?`,
    distractorCounts: options,
  };
}

export function generateSortingChallenge(): DynamicSortingChallenge {
  const themes = [
    {
      title: "Land Animals vs. Ocean Swimmers",
      instruction: "Sort the animals: Who walks on land, and who swims in the water?",
      spokenPrompt: "Let's sort our animal friends! Who lives on grassy land, and who swims in the sea?",
      catA: { id: "land", label: "Land Animals", emoji: "🌳", dropZoneColor: "border-emerald-400 bg-emerald-950/40 text-emerald-300" },
      catB: { id: "ocean", label: "Ocean Swimmers", emoji: "🌊", dropZoneColor: "border-cyan-400 bg-cyan-950/40 text-cyan-300" },
      items: [
        { id: "lion", label: "Lion", emoji: "🦁", correctCategory: "A" as const, soundFeedback: "Lions roar on the sunny savanna!" },
        { id: "whale", label: "Whale", emoji: "🐳", correctCategory: "B" as const, soundFeedback: "Whales swim deep in the blue ocean!" },
        { id: "monkey", label: "Monkey", emoji: "🐵", correctCategory: "A" as const, soundFeedback: "Monkeys climb tall jungle trees!" },
        { id: "dolphin", label: "Dolphin", emoji: "🐬", correctCategory: "B" as const, soundFeedback: "Dolphins leap through ocean waves!" },
        { id: "cow", label: "Cow", emoji: "🐮", correctCategory: "A" as const, soundFeedback: "Cows graze in green grassy fields!" },
        { id: "octopus", label: "Octopus", emoji: "🐙", correctCategory: "B" as const, soundFeedback: "Octopuses have eight swimming arms!" },
      ],
    },
    {
      title: "Healthy Fruits vs. Sweet Treats",
      instruction: "Sort the food: Put crunchy fruits here, and sweet party treats there!",
      spokenPrompt: "Can you sort the snacks? Which ones are fresh fruits from trees, and which are sweet party treats?",
      catA: { id: "fruit", label: "Fresh Fruits", emoji: "🍎", dropZoneColor: "border-rose-400 bg-rose-950/40 text-rose-300" },
      catB: { id: "treat", label: "Sweet Treats", emoji: "🧁", dropZoneColor: "border-amber-400 bg-amber-950/40 text-amber-300" },
      items: [
        { id: "apple", label: "Apple", emoji: "🍎", correctCategory: "A" as const, soundFeedback: "Crisp red apple is full of vitamins!" },
        { id: "cupcake", label: "Cupcake", emoji: "🧁", correctCategory: "B" as const, soundFeedback: "Yummy birthday cupcake with frosting!" },
        { id: "banana", label: "Banana", emoji: "🍌", correctCategory: "A" as const, soundFeedback: "Sweet yellow banana from the tree!" },
        { id: "lollipop", label: "Lollipop", emoji: "🍭", correctCategory: "B" as const, soundFeedback: "Rainbow swirl candy treat!" },
        { id: "strawberry", label: "Strawberry", emoji: "🍓", correctCategory: "A" as const, soundFeedback: "Juicy red garden strawberry!" },
        { id: "donut", label: "Donut", emoji: "🍩", correctCategory: "B" as const, soundFeedback: "Glazed donut with colorful sprinkles!" },
      ],
    },
    {
      title: "Warm Sun Clothes vs. Cold Winter Clothes",
      instruction: "Sort the clothing: What do we wear for sunny beach days vs. chilly snow?",
      spokenPrompt: "What should we wear? Put sunny summer clothes on the left, and warm cozy winter clothes on the right!",
      catA: { id: "summer", label: "Sunny Summer", emoji: "☀️", dropZoneColor: "border-yellow-400 bg-yellow-950/40 text-yellow-300" },
      catB: { id: "winter", label: "Cozy Winter", emoji: "❄️", dropZoneColor: "border-sky-400 bg-sky-950/40 text-sky-300" },
      items: [
        { id: "sunglasses", label: "Sunglasses", emoji: "🕶️", correctCategory: "A" as const, soundFeedback: "Cool shades for bright sunny beach days!" },
        { id: "muffler", label: "Wool Scarf", emoji: "🧣", correctCategory: "B" as const, soundFeedback: "Warm fluffy scarf keeps our neck cozy!" },
        { id: "swimsuit", label: "Swimsuit", emoji: "🩱", correctCategory: "A" as const, soundFeedback: "Ready for splashing in the summer pool!" },
        { id: "mittens", label: "Winter Mittens", emoji: "🧤", correctCategory: "B" as const, soundFeedback: "Warm knit mittens keep our hands toasty in the snow!" },
      ],
    },
    {
      title: "Sky Flyers vs. Ground Vehicles",
      instruction: "Sort the transport: Which ones soar through the clouds, and which roll on wheels?",
      spokenPrompt: "Let's sort our vehicles! Who flies way up high in the clouds, and who drives on the ground?",
      catA: { id: "sky", label: "Sky Flyers", emoji: "✈️", dropZoneColor: "border-sky-400 bg-sky-950/40 text-sky-300" },
      catB: { id: "ground", label: "Ground Vehicles", emoji: "🚗", dropZoneColor: "border-amber-400 bg-amber-950/40 text-amber-300" },
      items: [
        { id: "airplane", label: "Airplane", emoji: "✈️", correctCategory: "A" as const, soundFeedback: "Airplanes soar across the sky!" },
        { id: "car", label: "Family Car", emoji: "🚗", correctCategory: "B" as const, soundFeedback: "Cars drive along the street!" },
        { id: "helicopter", label: "Helicopter", emoji: "🚁", correctCategory: "A" as const, soundFeedback: "Helicopters chop through the air!" },
        { id: "train", label: "Choo-Choo Train", emoji: "🚂", correctCategory: "B" as const, soundFeedback: "Trains roll along the railroad track!" },
        { id: "rocket", label: "Space Rocket", emoji: "🚀", correctCategory: "A" as const, soundFeedback: "Rockets blast up into the stars!" },
        { id: "bicycle", label: "Bicycle", emoji: "🚲", correctCategory: "B" as const, soundFeedback: "Bicycles pedal along the sidewalk!" },
      ],
    },
    {
      title: "Daytime Sunshine vs. Nighttime Stars",
      instruction: "Sort the sky wonders: What do we see in bright daytime vs. cozy night?",
      spokenPrompt: "What do we see in the sky? Put daytime friends on the left, and starry night friends on the right!",
      catA: { id: "day", label: "Daytime Sky", emoji: "☀️", dropZoneColor: "border-amber-400 bg-amber-950/40 text-amber-300" },
      catB: { id: "night", label: "Nighttime Sky", emoji: "🌙", dropZoneColor: "border-indigo-400 bg-indigo-950/40 text-indigo-300" },
      items: [
        { id: "sun", label: "Bright Sun", emoji: "☀️", correctCategory: "A" as const, soundFeedback: "The sun warms up the morning day!" },
        { id: "moon", label: "Glowing Moon", emoji: "🌙", correctCategory: "B" as const, soundFeedback: "The moon shines when we go to sleep!" },
        { id: "kite", label: "Flying Kite", emoji: "🪁", correctCategory: "A" as const, soundFeedback: "Kites dance in the sunny breeze!" },
        { id: "star", label: "Twinkling Star", emoji: "⭐", correctCategory: "B" as const, soundFeedback: "Stars sparkle in the velvet night!" },
        { id: "rainbow", label: "Rainbow", emoji: "🌈", correctCategory: "A" as const, soundFeedback: "Rainbows appear after daytime showers!" },
        { id: "owl", label: "Night Owl", emoji: "🦉", soundFeedback: "Owls wake up when night falls!", correctCategory: "B" as const },
      ],
    },
  ];

  const selectedTheme = themes[Math.floor(Math.random() * themes.length)];

  // Shuffle items
  const shuffledItems = [...selectedTheme.items].sort(() => Math.random() - 0.5);

  return {
    id: `sort-${Date.now()}`,
    title: selectedTheme.title,
    instruction: selectedTheme.instruction,
    spokenPrompt: selectedTheme.spokenPrompt,
    categoryA: selectedTheme.catA,
    categoryB: selectedTheme.catB,
    items: shuffledItems,
  };
}
