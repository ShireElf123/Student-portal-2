/**
 * Play uniqueness per land. Same engines, different friends — ice is not the savanna.
 */
export interface SafariFriend {
  id: string;
  name: string;
  emoji: string;
  soundText: string;
  call: string;
  funFact: string;
  habitat: string;
  bgGradient: string;
}

export interface MemoryPair {
  pairId: string;
  emoji: string;
  name: string;
  color: string;
}

export interface WorldPlayTheme {
  safariTitle: string;
  safari: SafariFriend[];
  memory: MemoryPair[];
  balloonTitle: string;
  balloonLetters: string[];
}

const savanna: SafariFriend[] = [
  { id: "lion", name: "Brave Lion", emoji: "🦁", soundText: "ROAAAR!", call: "Rrrroaaar! Roar! I am the brave golden Lion with a fuzzy mane!", funFact: "Lions live in families called prides and love resting under big acacia trees!", habitat: "Sunny Savanna", bgGradient: "from-amber-400 to-orange-500" },
  { id: "elephant", name: "Gentle Elephant", emoji: "🐘", soundText: "PAWOOO!", call: "Pawoooo! I am the big gentle Elephant! I spray water with my long trunk!", funFact: "Elephants have gigantic floppy ears that help keep them cool in the sunshine!", habitat: "Waterhole", bgGradient: "from-slate-400 to-sky-500" },
  { id: "monkey", name: "Cheeky Monkey", emoji: "🐵", soundText: "OOH-OOH AAH-AAH!", call: "Ooh ooh aah aah! I am a playful Monkey swinging through the green jungle vines!", funFact: "Monkeys have long tails that act like an extra hand to hold onto tree branches!", habitat: "Tall Treetops", bgGradient: "from-emerald-400 to-teal-500" },
  { id: "duck", name: "Happy Duck", emoji: "🦆", soundText: "QUACK QUACK!", call: "Quack quack! Splish splash! I am a cheerful Duck swimming in the blue pond!", funFact: "Duck feathers are waterproof, keeping them warm and dry while swimming!", habitat: "Lily Pad Pond", bgGradient: "from-sky-400 to-cyan-500" },
  { id: "frog", name: "Bouncy Frog", emoji: "🐸", soundText: "RIBBIT RIBBIT!", call: "Ribbit ribbit! Hop hop! I am a green tree frog catching bugs with my long tongue!", funFact: "Frogs can breathe through their skin and take giant leaping jumps!", habitat: "River Stream", bgGradient: "from-lime-400 to-emerald-600" },
  { id: "cow", name: "Friendly Cow", emoji: "🐄", soundText: "MOOO MOOO!", call: "Moooo moooo! I am the spotted dairy Cow munching on delicious green clover!", funFact: "Cows have excellent senses of smell and enjoy making friends in grassy pastures!", habitat: "Green Meadow", bgGradient: "from-rose-400 to-pink-500" },
];

const farm: SafariFriend[] = [
  { id: "cow", name: "Spotted Cow", emoji: "🐄", soundText: "MOOO MOOO!", call: "Moooo! I am the pasture cow. Come walk the grass with me!", funFact: "Cows chew clover and like a slow, sunny walk.", habitat: "Green Pasture", bgGradient: "from-lime-400 to-emerald-500" },
  { id: "pig", name: "Muddy Pig", emoji: "🐷", soundText: "OINK OINK!", call: "Oink oink! I am a happy pig in the cool mud!", funFact: "Pigs stay cool by rolling in mud on hot days.", habitat: "Mud Wallow", bgGradient: "from-rose-400 to-pink-500" },
  { id: "horse", name: "Barn Horse", emoji: "🐴", soundText: "NEIGH NEIGH!", call: "Neigh! I am the tall horse. Want a gentle ride?", funFact: "Horses sleep standing up in the barn.", habitat: "Red Barn", bgGradient: "from-amber-500 to-orange-500" },
  { id: "hen", name: "Mother Hen", emoji: "🐔", soundText: "CLUCK CLUCK!", call: "Cluck cluck! I am counting my fluffy chicks!", funFact: "Hens talk to their chicks even before they hatch.", habitat: "Hay Nest", bgGradient: "from-yellow-400 to-amber-500" },
  { id: "sheep", name: "Woolly Sheep", emoji: "🐑", soundText: "BAAA BAAA!", call: "Baaa! My wool is warm like a cloud coat!", funFact: "Sheep wool can be spun into a soft jumper.", habitat: "Hill Field", bgGradient: "from-slate-300 to-sky-400" },
  { id: "duck", name: "Pond Duck", emoji: "🦆", soundText: "QUACK QUACK!", call: "Quack! I splash in the farm pond!", funFact: "Duck feet are like paddles for swimming.", habitat: "Farm Pond", bgGradient: "from-sky-400 to-cyan-500" },
];

const jungle: SafariFriend[] = [
  { id: "monkey", name: "Canopy Monkey", emoji: "🐵", soundText: "OOH-OOH AAH-AAH!", call: "Ooh ooh! I swing from leaf to leaf!", funFact: "Monkeys use their tails like a fifth hand.", habitat: "High Canopy", bgGradient: "from-emerald-400 to-teal-500" },
  { id: "parrot", name: "Rainbow Parrot", emoji: "🦜", soundText: "SQUAWK SQUAWK!", call: "Squawk! I copy the jungle songs!", funFact: "Parrots can learn words they hear often.", habitat: "Fruit Tree", bgGradient: "from-lime-400 to-green-500" },
  { id: "tiger", name: "Stripe Tiger", emoji: "🐯", soundText: "GRRR GROWL!", call: "Grrr! I pad quietly on big soft paws!", funFact: "Every tiger's stripes are a different pattern.", habitat: "Jungle Path", bgGradient: "from-orange-500 to-amber-600" },
  { id: "frog", name: "Leaf Frog", emoji: "🐸", soundText: "RIBBIT RIBBIT!", call: "Ribbit! I hide on a shiny leaf!", funFact: "Tree frogs have sticky toes for climbing.", habitat: "Wet Leaf", bgGradient: "from-lime-400 to-emerald-600" },
  { id: "snake", name: "Gentle Snake", emoji: "🐍", soundText: "HISSSS!", call: "Hiss! I slide along the warm branch!", funFact: "Snakes smell with their tongues.", habitat: "Sun Branch", bgGradient: "from-emerald-500 to-teal-600" },
  { id: "gorilla", name: "Gentle Gorilla", emoji: "🦍", soundText: "HOOT HOOT!", call: "Hoot! I drum softly on my chest!", funFact: "Gorillas live in quiet family groups.", habitat: "Forest Floor", bgGradient: "from-stone-500 to-emerald-700" },
];

// toucan emoji is toucan - I used the word by mistake. Fix to toucan
const ice: SafariFriend[] = [
  { id: "penguin", name: "Waddle Penguin", emoji: "🐧", soundText: "HONK HONK!", call: "Honk! I slide on my tummy across the ice!", funFact: "Penguins keep each other warm in a huddle.", habitat: "Penguin Floe", bgGradient: "from-sky-300 to-indigo-400" },
  { id: "seal", name: "Spotty Seal", emoji: "🦭", soundText: "ARF ARF!", call: "Arf arf! I clap my flippers on the shore!", funFact: "Seals can hold their breath for a long underwater swim.", habitat: "Seal Shore", bgGradient: "from-slate-400 to-cyan-500" },
  { id: "bear", name: "Snow Bear", emoji: "🐻‍❄️", soundText: "GROOOWL!", call: "Groowl! I nap in a quiet snow den!", funFact: "Polar bears have black skin under white fur.", habitat: "Snow Den", bgGradient: "from-slate-200 to-sky-400" },
  { id: "whale", name: "Blue Whale", emoji: "🐋", soundText: "WHOOOOOM!", call: "Whooom! My song travels far under the ice!", funFact: "Blue whales are the biggest animals on Earth.", habitat: "Cold Sea", bgGradient: "from-indigo-500 to-blue-600" },
  { id: "fox", name: "Arctic Fox", emoji: "🦊", soundText: "YIP YIP!", call: "Yip! My white coat hides me in the snow!", funFact: "Arctic foxes grow a thicker coat in winter.", habitat: "Snow Field", bgGradient: "from-orange-300 to-slate-300" },
  { id: "owl", name: "Snow Owl", emoji: "🦉", soundText: "HOO HOO!", call: "Hoo hoo! I watch the lights in the quiet sky!", funFact: "Snowy owls hunt in the bright arctic day.", habitat: "Light Sky", bgGradient: "from-violet-400 to-indigo-500" },
];

const bugs: SafariFriend[] = [
  { id: "bee", name: "Busy Bee", emoji: "🐝", soundText: "BZZZ BZZZ!", call: "Bzzz! I visit every flower for a sip!", funFact: "Bees dance to tell friends where the flowers are.", habitat: "Flower Bed", bgGradient: "from-amber-400 to-yellow-500" },
  { id: "butterfly", name: "Soft Butterfly", emoji: "🦋", soundText: "FLUTTER!", call: "Flutter flutter! My wings are like tiny stained glass!", funFact: "Butterflies taste with their feet.", habitat: "Sunny Petal", bgGradient: "from-violet-400 to-fuchsia-500" },
  { id: "beetle", name: "Shiny Beetle", emoji: "🪲", soundText: "CLICK CLICK!", call: "Click! I wear a hard shiny coat!", funFact: "Beetles are the largest group of insects.", habitat: "Warm Compost", bgGradient: "from-emerald-600 to-lime-500" },
  { id: "cricket", name: "Night Cricket", emoji: "🦗", soundText: "CHIRP CHIRP!", call: "Chirp! I sing when the garden gets dark!", funFact: "Crickets rub their wings to make music.", habitat: "Night Jar", bgGradient: "from-lime-500 to-emerald-700" },
  { id: "ladybug", name: "Spot Ladybug", emoji: "🐞", soundText: "TAP TAP!", call: "Tap! Count my little black spots!", funFact: "Ladybugs help plants by eating tiny bugs.", habitat: "Leaf Top", bgGradient: "from-rose-500 to-red-500" },
  { id: "snail", name: "Garden Snail", emoji: "🐌", soundText: "SLIIIDE!", call: "Slide… I carry my house on my back!", funFact: "Snails make a shiny trail to slide on.", habitat: "Damp Stone", bgGradient: "from-amber-200 to-lime-300" },
];

const pond: SafariFriend[] = [
  { id: "frog", name: "Pond Frog", emoji: "🐸", soundText: "RIBBIT RIBBIT!", call: "Ribbit! I hop from lily to lily!", funFact: "Frogs start life as wriggly tadpoles.", habitat: "Lily Pad", bgGradient: "from-lime-400 to-emerald-600" },
  { id: "duck", name: "Pond Duck", emoji: "🦆", soundText: "QUACK QUACK!", call: "Quack! I paddle with my webbed feet!", funFact: "Ducklings follow the first friend they see.", habitat: "Garden Pond", bgGradient: "from-sky-400 to-cyan-500" },
  { id: "fish", name: "Silver Fish", emoji: "🐟", soundText: "BLUB BLUB!", call: "Blub! I wink from under the water!", funFact: "Fish breathe with gills, not noses.", habitat: "Clear Water", bgGradient: "from-cyan-400 to-blue-500" },
  { id: "turtle", name: "Slow Turtle", emoji: "🐢", soundText: "MUNCH MUNCH!", call: "Munch! I nibble a water leaf!", funFact: "Turtles can live both in water and on the bank.", habitat: "Sunny Log", bgGradient: "from-emerald-500 to-teal-600" },
  { id: "dragonfly", name: "Blue Dragonfly", emoji: "🪰", soundText: "WHIRR!", call: "Whirr! I hover like a tiny helicopter!", funFact: "Dragonflies can fly in every direction.", habitat: "Reed Edge", bgGradient: "from-sky-500 to-indigo-500" },
  { id: "snail", name: "Pond Snail", emoji: "🐌", soundText: "SLIIIDE!", call: "Slide on the wet stone…", funFact: "Pond snails keep the water clean.", habitat: "Damp Stone", bgGradient: "from-slate-400 to-lime-400" },
];

const night: SafariFriend[] = [
  { id: "owl", name: "Night Owl", emoji: "🦉", soundText: "HOO HOO!", call: "Hoo hoo! I watch the quiet wood!", funFact: "Owls can turn their heads almost all the way round.", habitat: "Owl Wood", bgGradient: "from-indigo-500 to-slate-700" },
  { id: "bat", name: "Soft Bat", emoji: "🦇", soundText: "SQUEAK!", call: "Squeak! I fly with my hands!", funFact: "Bats find their way with tiny echoes.", habitat: "Porch Eaves", bgGradient: "from-violet-700 to-slate-800" },
  { id: "moth", name: "Moon Moth", emoji: "🦋", soundText: "FLUTTER!", call: "Flutter to the warm porch light!", funFact: "Moths like lamps because they steer by the moon.", habitat: "Porch Light", bgGradient: "from-amber-300 to-yellow-500" },
  { id: "cat", name: "Night Cat", emoji: "🐱", soundText: "MEOW MEOW!", call: "Meow! I pad softly past the lamp!", funFact: "Cats see well in dim light.", habitat: "Bed Lamp", bgGradient: "from-orange-400 to-amber-600" },
  { id: "fox", name: "Quiet Fox", emoji: "🦊", soundText: "YIP YIP!", call: "Yip! I trot under the stars!", funFact: "Foxes walk on their toes.", habitat: "Star Path", bgGradient: "from-orange-500 to-rose-500" },
  { id: "mouse", name: "Tiny Mouse", emoji: "🐭", soundText: "SQUEAK SQUEAK!", call: "Squeak! I nibble a quiet crumb!", funFact: "Mice twitch their whiskers to feel the dark.", habitat: "Skirting Board", bgGradient: "from-slate-400 to-amber-300" },
];

const park: SafariFriend[] = [
  { id: "bird", name: "Park Bird", emoji: "🐦", soundText: "TWEET TWEET!", call: "Tweet! I sing from the town tree!", funFact: "Birds sing to say hello to their friends.", habitat: "Town Park", bgGradient: "from-sky-400 to-emerald-400" },
  { id: "squirrel", name: "Busy Squirrel", emoji: "🐿️", soundText: "CHK CHK!", call: "Chk chk! I hide an acorn for later!", funFact: "Squirrels forget some acorns, and trees grow.", habitat: "Oak Shade", bgGradient: "from-amber-500 to-orange-600" },
  { id: "dog", name: "Park Puppy", emoji: "🐶", soundText: "WOOF WOOF!", call: "Woof! I wag on the green!", funFact: "Dogs smile with their tails.", habitat: "Grass Path", bgGradient: "from-yellow-400 to-amber-500" },
  { id: "duck", name: "Park Duck", emoji: "🦆", soundText: "QUACK QUACK!", call: "Quack at the park pond!", funFact: "Park ducks like a nibble of oats, not bread.", habitat: "Park Pond", bgGradient: "from-cyan-400 to-sky-500" },
  { id: "bee", name: "Clover Bee", emoji: "🐝", soundText: "BZZZ BZZZ!", call: "Bzzz in the clover!", funFact: "Bees love purple clover.", habitat: "Clover Patch", bgGradient: "from-amber-400 to-lime-400" },
  { id: "bunny", name: "Soft Bunny", emoji: "🐰", soundText: "SNIFF SNIFF!", call: "Sniff! I hop through the daisies!", funFact: "Rabbits hop to see over the grass.", habitat: "Daisy Lawn", bgGradient: "from-pink-300 to-rose-400" },
];

const defaultMemory: MemoryPair[] = [
  { pairId: "cat", emoji: "🐱", name: "Kitten", color: "from-amber-400 to-orange-400" },
  { pairId: "dog", emoji: "🐶", name: "Puppy", color: "from-blue-400 to-indigo-400" },
  { pairId: "star", emoji: "⭐", name: "Star", color: "from-yellow-300 to-amber-500" },
  { pairId: "apple", emoji: "🍎", name: "Apple", color: "from-rose-400 to-red-500" },
  { pairId: "bear", emoji: "🐻", name: "Teddy", color: "from-emerald-400 to-teal-500" },
  { pairId: "sun", emoji: "☀️", name: "Sunny", color: "from-amber-300 to-yellow-400" },
];

const MEMORY_BY_WORLD: Record<string, MemoryPair[]> = {
  "animal-world": [
    { pairId: "lion", emoji: "🦁", name: "Lion", color: "from-amber-400 to-orange-500" },
    { pairId: "cow", emoji: "🐄", name: "Cow", color: "from-lime-400 to-emerald-500" },
    { pairId: "fish", emoji: "🐠", name: "Fish", color: "from-cyan-400 to-blue-500" },
    { pairId: "dino", emoji: "🦕", name: "Dino", color: "from-emerald-500 to-lime-600" },
    { pairId: "chick", emoji: "🐥", name: "Chick", color: "from-yellow-300 to-amber-400" },
    { pairId: "bone", emoji: "🦴", name: "Bone", color: "from-stone-300 to-amber-200" },
  ],
  "bug-world": [
    { pairId: "bee", emoji: "🐝", name: "Bee", color: "from-amber-400 to-yellow-500" },
    { pairId: "bug", emoji: "🪲", name: "Beetle", color: "from-lime-500 to-emerald-600" },
    { pairId: "leaf", emoji: "🍃", name: "Leaf", color: "from-emerald-400 to-green-500" },
    { pairId: "flower", emoji: "🌼", name: "Flower", color: "from-pink-400 to-rose-500" },
    { pairId: "lady", emoji: "🐞", name: "Ladybug", color: "from-rose-500 to-red-500" },
    { pairId: "snail", emoji: "🐌", name: "Snail", color: "from-amber-200 to-lime-400" },
  ],
  "arctic-world": [
    { pairId: "penguin", emoji: "🐧", name: "Penguin", color: "from-sky-300 to-indigo-400" },
    { pairId: "flake", emoji: "❄️", name: "Snowflake", color: "from-cyan-200 to-sky-400" },
    { pairId: "seal", emoji: "🦭", name: "Seal", color: "from-slate-300 to-cyan-400" },
    { pairId: "bear", emoji: "🐻‍❄️", name: "Snow bear", color: "from-white to-sky-300" },
    { pairId: "igloo", emoji: "🧊", name: "Ice", color: "from-cyan-300 to-blue-400" },
    { pairId: "light", emoji: "🌌", name: "Lights", color: "from-violet-400 to-indigo-600" },
  ],
  "vehicle-world": [
    { pairId: "bus", emoji: "🚌", name: "Bus", color: "from-yellow-400 to-amber-500" },
    { pairId: "car", emoji: "🚗", name: "Car", color: "from-sky-400 to-blue-500" },
    { pairId: "plane", emoji: "✈️", name: "Plane", color: "from-cyan-300 to-sky-500" },
    { pairId: "boat", emoji: "🚢", name: "Boat", color: "from-indigo-400 to-blue-600" },
    { pairId: "train", emoji: "🚂", name: "Train", color: "from-rose-400 to-red-500" },
    { pairId: "bike", emoji: "🚲", name: "Bike", color: "from-lime-400 to-emerald-500" },
  ],
  "kitchen-world": [
    { pairId: "apple", emoji: "🍎", name: "Apple", color: "from-rose-400 to-red-500" },
    { pairId: "bread", emoji: "🍞", name: "Bun", color: "from-amber-300 to-orange-400" },
    { pairId: "soup", emoji: "🍲", name: "Soup", color: "from-orange-400 to-amber-500" },
    { pairId: "berry", emoji: "🍓", name: "Berry", color: "from-pink-400 to-rose-500" },
    { pairId: "corn", emoji: "🌽", name: "Corn", color: "from-yellow-300 to-lime-400" },
    { pairId: "pot", emoji: "🥘", name: "Pot", color: "from-amber-500 to-rose-400" },
  ],
  "city-world": [
    { pairId: "book", emoji: "📖", name: "Book", color: "from-amber-400 to-orange-500" },
    { pairId: "fire", emoji: "🚒", name: "Engine", color: "from-rose-500 to-red-600" },
    { pairId: "tree", emoji: "🌳", name: "Park tree", color: "from-emerald-400 to-green-600" },
    { pairId: "bag", emoji: "🛍️", name: "Market bag", color: "from-pink-400 to-fuchsia-500" },
    { pairId: "lamp", emoji: "🏮", name: "Lamp", color: "from-orange-400 to-amber-500" },
    { pairId: "bench", emoji: "🪵", name: "Bench", color: "from-amber-600 to-yellow-500" },
  ],
  "night-world": [
    { pairId: "star", emoji: "⭐", name: "Star", color: "from-yellow-300 to-amber-500" },
    { pairId: "moon", emoji: "🌙", name: "Moon", color: "from-indigo-300 to-violet-400" },
    { pairId: "owl", emoji: "🦉", name: "Owl", color: "from-indigo-500 to-slate-600" },
    { pairId: "lamp", emoji: "💡", name: "Lamp", color: "from-amber-300 to-yellow-400" },
    { pairId: "bed", emoji: "🛏️", name: "Bed", color: "from-sky-300 to-indigo-400" },
    { pairId: "moth", emoji: "🦋", name: "Moth", color: "from-violet-300 to-fuchsia-400" },
  ],
  "creative-world": [
    { pairId: "paint", emoji: "🎨", name: "Paint", color: "from-pink-400 to-violet-500" },
    { pairId: "note", emoji: "🎵", name: "Note", color: "from-violet-400 to-indigo-500" },
    { pairId: "bead", emoji: "🟣", name: "Bead", color: "from-amber-400 to-rose-400" },
    { pairId: "star", emoji: "🌟", name: "Sticker", color: "from-yellow-300 to-orange-400" },
    { pairId: "brush", emoji: "🖌️", name: "Brush", color: "from-sky-400 to-indigo-400" },
    { pairId: "heart", emoji: "💖", name: "Heart", color: "from-rose-400 to-pink-500" },
  ],
  "learning-world": [
    { pairId: "a", emoji: "🅰️", name: "Letter A", color: "from-rose-400 to-red-500" },
    { pairId: "one", emoji: "1️⃣", name: "One", color: "from-sky-400 to-blue-500" },
    { pairId: "circle", emoji: "🔵", name: "Circle", color: "from-cyan-400 to-sky-500" },
    { pairId: "star", emoji: "⭐", name: "Star", color: "from-amber-300 to-yellow-400" },
    { pairId: "book", emoji: "📘", name: "Book", color: "from-indigo-400 to-blue-600" },
    { pairId: "pencil", emoji: "✏️", name: "Pencil", color: "from-yellow-300 to-amber-500" },
  ],
  "my-world": [
    { pairId: "smile", emoji: "😊", name: "Smile", color: "from-amber-300 to-yellow-400" },
    { pairId: "heart", emoji: "❤️", name: "Heart", color: "from-rose-400 to-red-500" },
    { pairId: "home", emoji: "🏠", name: "Home", color: "from-sky-400 to-indigo-400" },
    { pairId: "brush", emoji: "🪥", name: "Brush", color: "from-cyan-400 to-teal-500" },
    { pairId: "hug", emoji: "🤗", name: "Hug", color: "from-pink-400 to-rose-400" },
    { pairId: "bed", emoji: "🛏️", name: "Bed", color: "from-indigo-300 to-violet-400" },
  ],
  "adventure-world": [
    { pairId: "tree", emoji: "🌲", name: "Pine", color: "from-emerald-500 to-green-700" },
    { pairId: "rocket", emoji: "🚀", name: "Rocket", color: "from-sky-400 to-indigo-500" },
    { pairId: "rain", emoji: "☔", name: "Rain", color: "from-cyan-400 to-blue-500" },
    { pairId: "map", emoji: "🗺️", name: "Map", color: "from-amber-400 to-orange-500" },
    { pairId: "gem", emoji: "💎", name: "Gem", color: "from-teal-400 to-cyan-500" },
    { pairId: "moon", emoji: "🌕", name: "Moon", color: "from-yellow-200 to-amber-300" },
  ],
  "story-world": [
    { pairId: "book", emoji: "📖", name: "Story", color: "from-violet-400 to-purple-500" },
    { pairId: "star", emoji: "⭐", name: "Star", color: "from-amber-300 to-yellow-400" },
    { pairId: "boat", emoji: "⛵", name: "Boat", color: "from-sky-400 to-cyan-500" },
    { pairId: "hen", emoji: "🐔", name: "Hen", color: "from-orange-400 to-amber-500" },
    { pairId: "shell", emoji: "🐚", name: "Shell", color: "from-rose-200 to-pink-400" },
    { pairId: "crown", emoji: "👑", name: "Crown", color: "from-yellow-400 to-amber-500" },
  ],
};

const SAFARI_BY_AREA: Record<string, { title: string; safari: SafariFriend[] }> = {
  "animal-world/farm-valley": { title: "Pasture Safari", safari: farm },
  "animal-world/jungle-canopy": { title: "Canopy Safari", safari: jungle },
  "bug-world/flower-bed": { title: "Flower Bed Safari", safari: bugs },
  "bug-world/pond-edge": { title: "Pond Safari", safari: pond },
  "bug-world/night-jar": { title: "Night Jar Safari", safari: bugs },
  "bug-world/compost-heap": { title: "Compost Safari", safari: bugs },
  "arctic-world/ice-floe": { title: "Floe Safari", safari: ice },
  "arctic-world/polar-den": { title: "Snow Den Safari", safari: ice },
  "arctic-world/seal-shore": { title: "Seal Shore Safari", safari: ice },
  "arctic-world/northern-lights": { title: "Light Sky Safari", safari: ice },
  "night-world/owl-wood": { title: "Owl Wood Safari", safari: night },
  "night-world/porch-moths": { title: "Porch Safari", safari: night },
  "night-world/star-balcony": { title: "Balcony Safari", safari: night },
  "night-world/bedroom-lamp": { title: "Lamp Safari", safari: night },
  "city-world/park-green": { title: "Park Safari", safari: park },
  "story-world/barnyard-tales": { title: "Tale Safari", safari: farm },
};

const SAFARI_BY_WORLD: Record<string, { title: string; safari: SafariFriend[] }> = {
  "animal-world": { title: "Animal Safari", safari: savanna },
  "bug-world": { title: "Bug Safari", safari: bugs },
  "arctic-world": { title: "Ice Safari", safari: ice },
  "night-world": { title: "Night Safari", safari: night },
  "city-world": { title: "Town Safari", safari: park },
  "adventure-world": { title: "Forest Safari", safari: jungle },
};

const LETTERS_BY_WORLD: Record<string, string[]> = {
  "learning-world": ["A", "B", "C", "D", "S", "T", "M", "P"],
  "arctic-world": ["I", "C", "E", "S", "N", "O", "W", "P"],
  "night-world": ["N", "O", "M", "S", "L", "B", "W", "T"],
  "vehicle-world": ["B", "C", "P", "T", "R", "A", "V", "S"],
  "kitchen-world": ["A", "B", "S", "P", "M", "C", "T", "O"],
};

export const DEFAULT_SAFARI_FRIENDS = savanna;

export function getWorldPlayTheme(worldId: string, areaId?: string | null): WorldPlayTheme {
  const key = areaId ? `${worldId}/${areaId}` : "";
  const safari =
    (key && SAFARI_BY_AREA[key]) ||
    SAFARI_BY_WORLD[worldId] ||
    { title: "Animal Safari", safari: savanna };
  return {
    safariTitle: safari.title,
    safari: safari.safari,
    memory: MEMORY_BY_WORLD[worldId] ?? defaultMemory,
    balloonTitle: "Sky Balloons",
    balloonLetters: LETTERS_BY_WORLD[worldId] ?? ["A", "B", "C", "D", "E", "S", "T", "M"],
  };
}
