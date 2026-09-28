export interface ActivityChallenge {
  id: string;
  category: "my-world" | "animal-world" | "adventure-world" | "creative-world" | "learning-world";
  subtopic: string;
  title: string;
  instruction: string;
  spokenPrompt: string;
  badgeEmoji: string;
  correctId: string;
  options: {
    id: string;
    label: string;
    emoji: string;
    soundCue?: string;
    detail?: string;
  }[];
}

// MY WORLD CHALLENGES (Family, Body, Feelings, Food, Daily Routines)
export const MY_WORLD_CHALLENGES: ActivityChallenge[] = [
  {
    id: "mw-feelings-1",
    category: "my-world",
    subtopic: "feelings",
    title: "Happy & Smiling Face",
    instruction: "Who is feeling super HAPPY and smiling brightly today?",
    spokenPrompt: "Can you tap the friend who is feeling super happy and wearing a big bright smile?",
    badgeEmoji: "😊",
    correctId: "happy",
    options: [
      { id: "sleepy", label: "Sleepy Yawn", emoji: "🥱", soundCue: "Yaaawn! Ready for bed!" },
      { id: "happy", label: "Happy Smile", emoji: "😄", soundCue: "Yay! Big happy smile!" },
      { id: "crying", label: "Sad Tear", emoji: "😢", soundCue: "Aww, feeling a little sad." },
      { id: "surprised", label: "Surprised", emoji: "😮", soundCue: "Whoa! Big surprise!" },
    ],
  },
  {
    id: "mw-body-1",
    category: "my-world",
    subtopic: "body",
    title: "Listening Ears",
    instruction: "Which part of our body do we use to listen to birds singing?",
    spokenPrompt: "Which part of our body do we use to listen to music and singing birds?",
    badgeEmoji: "👂",
    correctId: "ear",
    options: [
      { id: "eye", label: "Eyes", emoji: "👀", soundCue: "Eyes are for looking and seeing!" },
      { id: "ear", label: "Ears", emoji: "👂", soundCue: "Yes! Two ears listen to sweet music!" },
      { id: "nose", label: "Nose", emoji: "👃", soundCue: "Nose is for smelling flowers!" },
      { id: "hand", label: "Hands", emoji: "✋", soundCue: "Hands are for clapping and hugging!" },
    ],
  },
  {
    id: "mw-food-1",
    category: "my-world",
    subtopic: "food",
    title: "Healthy Crunchy Fruit",
    instruction: "Which sweet fruit grows on trees and is red and crunchy?",
    spokenPrompt: "Which healthy sweet snack grows on an apple tree and crunches when we bite it?",
    badgeEmoji: "🍎",
    correctId: "apple",
    options: [
      { id: "apple", label: "Red Apple", emoji: "🍎", soundCue: "Crunch crunch! Delicious and healthy!" },
      { id: "donut", label: "Sweet Donut", emoji: "🍩", soundCue: "Mmm, tasty sweet treat!" },
      { id: "cheese", label: "Yellow Cheese", emoji: "🧀", soundCue: "Cheesy slice!" },
      { id: "candy", label: "Lollipop", emoji: "🍭", soundCue: "Sugary candy!" },
    ],
  },
  {
    id: "mw-family-1",
    category: "my-world",
    subtopic: "family",
    title: "Sweet Baby Sibling",
    instruction: "Find the tiny baby in the family who drinks milk from a bottle!",
    spokenPrompt: "Can you spot the little baby brother or sister who loves warm cuddles?",
    badgeEmoji: "👶",
    correctId: "baby",
    options: [
      { id: "grandpa", label: "Grandpa", emoji: "👴", soundCue: "Kind grandpa tells fun stories!" },
      { id: "baby", label: "Cute Baby", emoji: "👶", soundCue: "Goo goo gaga! Sweet little baby!" },
      { id: "sister", label: "Big Sister", emoji: "👧", soundCue: "Big sister plays with us!" },
      { id: "dog", label: "Family Puppy", emoji: "🐶", soundCue: "Woof woof! Friendly puppy!" },
    ],
  },
  {
    id: "mw-routines-1",
    category: "my-world",
    subtopic: "routines",
    title: "Brushing Our Teeth",
    instruction: "What do we use before bedtime to keep our teeth clean and shiny?",
    spokenPrompt: "What do we use morning and night with foamy bubbles to brush our teeth?",
    badgeEmoji: "🪥",
    correctId: "toothbrush",
    options: [
      { id: "toothbrush", label: "Toothbrush", emoji: "🪥", soundCue: "Brush brush brush! Sparkly clean teeth!" },
      { id: "pillow", label: "Soft Pillow", emoji: "枕", soundCue: "Pillow is for resting our head!" },
      { id: "spoon", label: "Soup Spoon", emoji: "🥄", soundCue: "Spoon is for yummy breakfast!" },
      { id: "crayon", label: "Crayon", emoji: "🖍️", soundCue: "Crayon is for drawing pictures!" },
    ],
  },
];

// ANIMAL WORLD ADVANCED CHALLENGES (Sounds, Homes, Babies, Habitats)
export const ANIMAL_WORLD_CHALLENGES: ActivityChallenge[] = [
  {
    id: "aw-habitat-1",
    category: "animal-world",
    subtopic: "habitats",
    title: "Who Lives in the Ocean?",
    instruction: "Which animal swims deep under the salty blue ocean waves?",
    spokenPrompt: "Which animal loves to swim deep under the blue ocean water with flippers?",
    badgeEmoji: "🐬",
    correctId: "dolphin",
    options: [
      { id: "horse", label: "Brown Horse", emoji: "🐴", soundCue: "Horses run in green pastures!" },
      { id: "dolphin", label: "Playful Dolphin", emoji: "🐬", soundCue: "Click click splash! Dolphins leap out of waves!" },
      { id: "chicken", label: "Chicken", emoji: "🐔", soundCue: "Chickens stay on the farm coop!" },
      { id: "camel", label: "Desert Camel", emoji: "🐪", soundCue: "Camels walk on sunny sand dunes!" },
    ],
  },
  {
    id: "aw-babies-1",
    category: "animal-world",
    subtopic: "babies",
    title: "Match the Baby Kitten!",
    instruction: "Mother Cat is calling for her sweet baby! Who is her baby?",
    spokenPrompt: "Mother Cat says meow! Can you find her tiny baby kitten?",
    badgeEmoji: "🐱",
    correctId: "kitten",
    options: [
      { id: "puppy", label: "Puppy", emoji: "🐶", soundCue: "Puppies are baby dogs! Woof!" },
      { id: "kitten", label: "Kitten", emoji: "🐱", soundCue: "Mew mew! Tiny baby kitten cuddles mom!" },
      { id: "duckling", label: "Duckling", emoji: "🐥", soundCue: "Ducklings are baby ducks!" },
      { id: "piglet", label: "Piglet", emoji: "🐷", soundCue: "Piglets are baby pigs!" },
    ],
  },
  {
    id: "aw-sounds-1",
    category: "animal-world",
    subtopic: "sounds",
    title: "Who Goes Oink Oink?",
    instruction: "Who loves rolling in cooling mud and says 'Oink Oink'?",
    spokenPrompt: "Can you find the curly-tailed friend who grunts oink oink oink?",
    badgeEmoji: "🐷",
    correctId: "pig",
    options: [
      { id: "sheep", label: "Fluffy Sheep", emoji: "🐑", soundCue: "Baa baa says the sheep!" },
      { id: "cow", label: "Spotted Cow", emoji: "🐮", soundCue: "Moooo says the cow!" },
      { id: "pig", label: "Pink Piggy", emoji: "🐷", soundCue: "Oink oink oink! Happy piggy!" },
      { id: "rooster", label: "Rooster", emoji: "🐓", soundCue: "Cock a doodle doo!" },
    ],
  },
  {
    id: "aw-footprints-1",
    category: "animal-world",
    subtopic: "safari",
    title: "Giant Dinosaur Roar",
    instruction: "Find the giant dinosaur with huge claws and a mighty roar!",
    spokenPrompt: "Can you spot the mighty T-Rex dinosaur who lived long ago?",
    badgeEmoji: "🦖",
    correctId: "dino",
    options: [
      { id: "mouse", label: "Little Mouse", emoji: "🐭", soundCue: "Squeak squeak! Tiny mouse!" },
      { id: "dino", label: "Mighty T-Rex", emoji: "🦖", soundCue: "ROOOOAR! Giant dinosaur steps!" },
      { id: "turtle", label: "Small Turtle", emoji: "🐢", soundCue: "Slow and steady turtle!" },
      { id: "ladybug", label: "Tiny Ladybug", emoji: "🐞", soundCue: "Buzz buzz tiny bug!" },
    ],
  },
];

// ADVENTURE WORLD CHALLENGES (Space, Dinosaurs, Construction, Weather)
export const ADVENTURE_WORLD_CHALLENGES: ActivityChallenge[] = [
  {
    id: "adv-space-1",
    category: "adventure-world",
    subtopic: "space",
    title: "The Bright Yellow Sun",
    instruction: "Which giant glowing star gives our planet warmth and light every day?",
    spokenPrompt: "Which giant glowing ball of warmth in space shines down on us as the sun?",
    badgeEmoji: "☀️",
    correctId: "sun",
    options: [
      { id: "sun", label: "Smiling Sun", emoji: "☀️", soundCue: "Warm and bright sunny sunshine!" },
      { id: "moon", label: "Crescent Moon", emoji: "🌙", soundCue: "The moon smiles in the night sky!" },
      { id: "rocket", label: "Space Rocket", emoji: "🚀", soundCue: "Zooming through the stars!" },
      { id: "cloud", label: "Raincloud", emoji: "🌧️", soundCue: "Pitter patter rainfall!" },
    ],
  },
  {
    id: "adv-weather-1",
    category: "adventure-world",
    subtopic: "weather",
    title: "Rainy Day Protection",
    instruction: "It's raining outside! What do we open to stay dry?",
    spokenPrompt: "Pitter patter rain is falling! What do we hold up high to stay dry?",
    badgeEmoji: "☂️",
    correctId: "umbrella",
    options: [
      { id: "sunglasses", label: "Sunglasses", emoji: "🕶️", soundCue: "Sunglasses are for bright sunny days!" },
      { id: "umbrella", label: "Bright Umbrella", emoji: "☂️", soundCue: "Pop! The umbrella keeps our head completely dry!" },
      { id: "swimsuit", label: "Swimsuit", emoji: "🩱", soundCue: "Swimsuit is for swimming in the pool!" },
      { id: "fan", label: "Paper Fan", emoji: "🪭", soundCue: "Fan is for cooling down in hot weather!" },
    ],
  },
  {
    id: "adv-construction-1",
    category: "adventure-world",
    subtopic: "construction",
    title: "Big Digging Excavator",
    instruction: "Which big yellow machine has a giant scooper to dig earth?",
    spokenPrompt: "Which powerful construction machine digs deep holes with its giant metal arm?",
    badgeEmoji: "🚜",
    correctId: "excavator",
    options: [
      { id: "bicycle", label: "Bicycle", emoji: "🚲", soundCue: "Ring ring! Pedal down the sidewalk!" },
      { id: "excavator", label: "Yellow Excavator", emoji: "🚜", soundCue: "Vroom chugga scoop! Digging up rocks!" },
      { id: "canoe", label: "Wooden Canoe", emoji: "🛶", soundCue: "Row row row your boat!" },
      { id: "skateboard", label: "Skateboard", emoji: "🛹", soundCue: "Rolling on wheels!" },
    ],
  },
  {
    id: "adv-dino-1",
    category: "adventure-world",
    subtopic: "dinosaurs",
    title: "Long Neck Dinosaur",
    instruction: "Which dinosaur had an extra long neck to eat leaves from tallest trees?",
    spokenPrompt: "Can you find the friendly giant dinosaur with the super long neck reaching for treetop leaves?",
    badgeEmoji: "🦕",
    correctId: "brachio",
    options: [
      { id: "brachio", label: "Long Neck Brachio", emoji: "🦕", soundCue: "Munch munch! Reaching high into the treetops!" },
      { id: "crab", label: "Beach Crab", emoji: "🦀", soundCue: "Crab pinches softly on the shore!" },
      { id: "duck", label: "Pond Duck", emoji: "🦆", soundCue: "Quack quack!" },
      { id: "parrot", label: "Jungle Parrot", emoji: "🦜", soundCue: "Squawk! Colorful feathers!" },
    ],
  },
];

// LEARNING WORLD CHALLENGES (Phonics beginning sounds, pattern completion, counting comparisons)
export const LEARNING_WORLD_CHALLENGES: ActivityChallenge[] = [
  {
    id: "lw-phonics-b",
    category: "learning-world",
    subtopic: "phonics",
    title: "What Starts with Letter B?",
    instruction: "B says /b/! Can you find something that begins with letter B?",
    spokenPrompt: "B says buh! Which item starts with the buh buh sound of letter B?",
    badgeEmoji: "🐻",
    correctId: "bear",
    options: [
      { id: "bear", label: "Brown Bear", emoji: "🐻", soundCue: "Yes! B is for Bear! Buh buh Bear!" },
      { id: "apple", label: "Red Apple", emoji: "🍎", soundCue: "Apple starts with letter A!" },
      { id: "cat", label: "Cat", emoji: "🐱", soundCue: "Cat starts with letter C!" },
      { id: "duck", label: "Duck", emoji: "🦆", soundCue: "Duck starts with letter D!" },
    ],
  },
  {
    id: "lw-phonics-s",
    category: "learning-world",
    subtopic: "phonics",
    title: "What Starts with Letter S?",
    instruction: "S says /s/! Can you find something that begins with letter S?",
    spokenPrompt: "S says sss! Which item starts with the sss sss sound of letter S?",
    badgeEmoji: "⭐",
    correctId: "star",
    options: [
      { id: "star", label: "Twinkling Star", emoji: "⭐", soundCue: "Yes! S is for Star! Sss sss Star!" },
      { id: "elephant", label: "Elephant", emoji: "🐘", soundCue: "Elephant starts with letter E!" },
      { id: "lion", label: "Lion", emoji: "🦁", soundCue: "Lion starts with letter L!" },
      { id: "monkey", label: "Monkey", emoji: "🐵", soundCue: "Monkey starts with letter M!" },
    ],
  },
  {
    id: "lw-patterns-1",
    category: "learning-world",
    subtopic: "patterns",
    title: "Complete the Fruit Pattern",
    instruction: "Look at the pattern: 🍎 🍌 🍎 🍌 ... What comes next?",
    spokenPrompt: "Apple, Banana, Apple, Banana... What tasty fruit comes next in the pattern?",
    badgeEmoji: "🍎",
    correctId: "apple",
    options: [
      { id: "apple", label: "Apple 🍎", emoji: "🍎", soundCue: "Hooray! Apple comes next! A-B-A-B pattern!" },
      { id: "donut", label: "Donut 🍩", emoji: "🍩", soundCue: "Look at the fruits: Apple, Banana, Apple... what fruit comes next?" },
      { id: "grape", label: "Grape 🍇", emoji: "🍇", soundCue: "Let's repeat: Apple, Banana, Apple, Banana, Apple!" },
    ],
  },
  {
    id: "lw-math-more",
    category: "learning-world",
    subtopic: "math",
    title: "Find MORE Stars!",
    instruction: "Which box has MORE stars to collect?",
    spokenPrompt: "Look at both groups: which one has MORE shiny stars?",
    badgeEmoji: "🌟",
    correctId: "four",
    options: [
      { id: "one", label: "One Star (⭐)", emoji: "⭐", soundCue: "This is just one little star!" },
      { id: "four", label: "Four Stars (⭐⭐⭐⭐)", emoji: "⭐⭐⭐⭐", soundCue: "Yes! Four stars is MORE than one star! Great job!" },
    ],
  },
];
