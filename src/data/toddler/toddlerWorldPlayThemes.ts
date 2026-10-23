/**
 * Play uniqueness per land. Same engines, different friends — ice is not the savanna.
 */
export interface SafariFriend {
  id: string;
  name: string;
  emoji: string;
  /** Painted portrait when the emoji card is not enough (Tale Safari). */
  artSrc?: string;
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

export interface ThemedRhyme {
  id: string;
  targetWord: string;
  targetEmoji: string;
  spokenPrompt: string;
  correctWord: string;
  options: { word: string; emoji: string; isCorrect: boolean }[];
}

export interface BubbleWord {
  letter: string;
  word: string;
  emoji: string;
  sound: string;
}

export interface ThemedCountItem {
  name: string;
  emoji: string;
  sound: string;
  bg: string;
  text: string;
}

export interface ThemedSort {
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

export interface MixFlavor {
  orange: { title: string; emoji: string; phrase: string };
  green: { title: string; emoji: string; phrase: string };
  purple: { title: string; emoji: string; phrase: string };
}

export interface WorldPlayTheme {
  safariTitle: string;
  safari: SafariFriend[];
  memory: MemoryPair[];
  balloonTitle: string;
  balloonLetters: string[];
  rhymes: ThemedRhyme[];
  bubbles: BubbleWord[];
  songIds: string[];
  mix: MixFlavor;
  counting: ThemedCountItem[];
  sorting: ThemedSort;
}

const savanna: SafariFriend[] = [
  { id: "lion", name: "Brave Lion", emoji: "🦁", soundText: "ROAAAR!", call: "Rrrroaaar! Roar! I am the brave golden Lion with a fuzzy mane!", funFact: "Lions live in families called prides and love resting under big acacia trees!", habitat: "Sunny Savanna", bgGradient: "from-amber-400 to-orange-500" },
  { id: "elephant", name: "Gentle Elephant", emoji: "🐘", soundText: "PAWOOO!", call: "Pawoooo! I am the big gentle Elephant! I spray water with my long trunk!", funFact: "Elephants have gigantic floppy ears that help keep them cool in the sunshine!", habitat: "Waterhole", bgGradient: "from-slate-400 to-sky-500" },
  { id: "monkey", name: "Cheeky Monkey", emoji: "🐵", soundText: "OOH-OOH AAH-AAH!", call: "Ooh ooh aah aah! I am a playful Monkey swinging through the green jungle vines!", funFact: "Monkeys have long tails that act like an extra hand to hold onto tree branches!", habitat: "Tall Treetops", bgGradient: "from-emerald-400 to-teal-500" },
  { id: "duck", name: "Happy Duck", emoji: "🦆", soundText: "QUACK QUACK!", call: "Quack quack! Splish splash! I am a cheerful Duck swimming in the blue pond!", funFact: "Duck feathers are waterproof, keeping them warm and dry while swimming!", habitat: "Lily Pad Pond", bgGradient: "from-sky-400 to-cyan-500" },
  { id: "frog", name: "Bouncy Frog", emoji: "🐸", soundText: "RIBBIT RIBBIT!", call: "Ribbit ribbit! Hop hop! I am a green tree frog catching bugs with my long tongue!", funFact: "Frogs can breathe through their skin and take giant leaping jumps!", habitat: "River Stream", bgGradient: "from-lime-400 to-emerald-600" },
  { id: "cow", name: "Friendly Cow", emoji: "🐄", soundText: "MOOO MOOO!", call: "Moooo moooo! I am the spotted dairy Cow munching on delicious green clover!", funFact: "Cows have excellent senses of smell and enjoy making friends in grassy pastures!", habitat: "Green Meadow", bgGradient: "from-rose-400 to-pink-500" },
  { id: "giraffe", name: "Tall Giraffe", emoji: "🦒", soundText: "HMMM!", call: "I stretch my long neck to the highest leaves!", funFact: "Giraffes sleep standing up for short naps.", habitat: "Acacia Shade", bgGradient: "from-amber-300 to-orange-400" },
  { id: "zebra", name: "Stripe Zebra", emoji: "🦓", soundText: "WHINNY!", call: "Gallop with my black and white stripes!", funFact: "Every zebra's stripes are a different pattern.", habitat: "Open Grass", bgGradient: "from-stone-200 to-slate-700" },
];

const farm: SafariFriend[] = [
  { id: "cow", name: "Spotted Cow", emoji: "🐄", soundText: "MOOO MOOO!", call: "Moooo! I am the pasture cow. Come walk the grass with me!", funFact: "Cows chew clover and like a slow, sunny walk.", habitat: "Green Pasture", bgGradient: "from-lime-400 to-emerald-500" },
  { id: "pig", name: "Muddy Pig", emoji: "🐷", soundText: "OINK OINK!", call: "Oink oink! I am a happy pig in the cool mud!", funFact: "Pigs stay cool by rolling in mud on hot days.", habitat: "Mud Wallow", bgGradient: "from-rose-400 to-pink-500" },
  { id: "horse", name: "Barn Horse", emoji: "🐴", soundText: "NEIGH NEIGH!", call: "Neigh! I am the tall horse. Want a gentle ride?", funFact: "Horses sleep standing up in the barn.", habitat: "Red Barn", bgGradient: "from-amber-500 to-orange-500" },
  { id: "hen", name: "Mother Hen", emoji: "🐔", soundText: "CLUCK CLUCK!", call: "Cluck cluck! I am counting my fluffy chicks!", funFact: "Hens talk to their chicks even before they hatch.", habitat: "Hay Nest", bgGradient: "from-yellow-400 to-amber-500" },
  { id: "sheep", name: "Woolly Sheep", emoji: "🐑", soundText: "BAAA BAAA!", call: "Baaa! My wool is warm like a cloud coat!", funFact: "Sheep wool can be spun into a soft jumper.", habitat: "Hill Field", bgGradient: "from-slate-300 to-sky-400" },
  { id: "duck", name: "Pond Duck", emoji: "🦆", soundText: "QUACK QUACK!", call: "Quack! I splash in the farm pond!", funFact: "Duck feet are like paddles for swimming.", habitat: "Farm Pond", bgGradient: "from-sky-400 to-cyan-500" },
  { id: "goat", name: "Hill Goat", emoji: "🐐", soundText: "MAAA!", call: "Maaa! I nibble the hillside grass!", funFact: "Goats can climb rocks other friends cannot.", habitat: "Hill Field", bgGradient: "from-stone-400 to-amber-500" },
  { id: "chick", name: "Fluffy Chick", emoji: "🐥", soundText: "CHEEP CHEEP!", call: "Cheep! I follow mother hen!", funFact: "Chicks know mum's voice from the egg.", habitat: "Hay Nest", bgGradient: "from-yellow-300 to-amber-400" },
];

const jungle: SafariFriend[] = [
  { id: "monkey", name: "Canopy Monkey", emoji: "🐵", soundText: "OOH-OOH AAH-AAH!", call: "Ooh ooh! I swing from leaf to leaf!", funFact: "Monkeys use their tails like a fifth hand.", habitat: "High Canopy", bgGradient: "from-emerald-400 to-teal-500" },
  { id: "parrot", name: "Rainbow Parrot", emoji: "🦜", soundText: "SQUAWK SQUAWK!", call: "Squawk! I copy the jungle songs!", funFact: "Parrots can learn words they hear often.", habitat: "Fruit Tree", bgGradient: "from-lime-400 to-green-500" },
  { id: "tiger", name: "Stripe Tiger", emoji: "🐯", soundText: "GRRR GROWL!", call: "Grrr! I pad quietly on big soft paws!", funFact: "Every tiger's stripes are a different pattern.", habitat: "Jungle Path", bgGradient: "from-orange-500 to-amber-600" },
  { id: "frog", name: "Leaf Frog", emoji: "🐸", soundText: "RIBBIT RIBBIT!", call: "Ribbit! I hide on a shiny leaf!", funFact: "Tree frogs have sticky toes for climbing.", habitat: "Wet Leaf", bgGradient: "from-lime-400 to-emerald-600" },
  { id: "snake", name: "Gentle Snake", emoji: "🐍", soundText: "HISSSS!", call: "Hiss! I slide along the warm branch!", funFact: "Snakes smell with their tongues.", habitat: "Sun Branch", bgGradient: "from-emerald-500 to-teal-600" },
  { id: "gorilla", name: "Gentle Gorilla", emoji: "🦍", soundText: "HOOT HOOT!", call: "Hoot! I drum softly on my chest!", funFact: "Gorillas live in quiet family groups.", habitat: "Forest Floor", bgGradient: "from-stone-500 to-emerald-700" },
  { id: "sloth", name: "Slow Sloth", emoji: "🐨", soundText: "YAWN!", call: "Yawn… I hang upside down and smile!", funFact: "Sloths move slowly so leaves hide them.", habitat: "Canopy Branch", bgGradient: "from-lime-600 to-emerald-800" },
  { id: "leopard", name: "Spot Leopard", emoji: "🐆", soundText: "GRRR!", call: "I pad quietly with my golden spots!", funFact: "Leopard spots help them hide in dappled light.", habitat: "Jungle Path", bgGradient: "from-amber-500 to-stone-700" },
];

// toucan emoji is toucan - I used the word by mistake. Fix to toucan
const ice: SafariFriend[] = [
  { id: "penguin", name: "Waddle Penguin", emoji: "🐧", soundText: "HONK HONK!", call: "Honk! I slide on my tummy across the ice!", funFact: "Penguins keep each other warm in a huddle.", habitat: "Penguin Floe", bgGradient: "from-sky-300 to-indigo-400" },
  { id: "seal", name: "Spotty Seal", emoji: "🐬", soundText: "ARF ARF!", call: "Arf arf! I clap my flippers on the shore!", funFact: "Seals can hold their breath for a long underwater swim.", habitat: "Seal Shore", bgGradient: "from-slate-400 to-cyan-500" },
  { id: "bear", name: "Snow Bear", emoji: "🐻", soundText: "GROOOWL!", call: "Groowl! I nap in a quiet snow den!", funFact: "Polar bears have black skin under white fur.", habitat: "Snow Den", bgGradient: "from-slate-200 to-sky-400" },
  { id: "whale", name: "Blue Whale", emoji: "🐋", soundText: "WHOOOOOM!", call: "Whooom! My song travels far under the ice!", funFact: "Blue whales are the biggest animals on Earth.", habitat: "Cold Sea", bgGradient: "from-indigo-500 to-blue-600" },
  { id: "fox", name: "Arctic Fox", emoji: "🦊", soundText: "YIP YIP!", call: "Yip! My white coat hides me in the snow!", funFact: "Arctic foxes grow a thicker coat in winter.", habitat: "Snow Field", bgGradient: "from-orange-300 to-slate-300" },
  { id: "owl", name: "Snow Owl", emoji: "🦉", soundText: "HOO HOO!", call: "Hoo hoo! I watch the lights in the quiet sky!", funFact: "Snowy owls hunt in the bright arctic day.", habitat: "Light Sky", bgGradient: "from-violet-400 to-indigo-500" },
  { id: "flake", name: "Soft Snowflake", emoji: "❄️", soundText: "SHHH!", call: "I drift down, never two the same!", funFact: "Every snowflake has a different pattern.", habitat: "Falling Sky", bgGradient: "from-cyan-200 to-sky-400" },
  { id: "igloo", name: "Ice House", emoji: "❄️", soundText: "CLINK!", call: "Clink! Come into my quiet ice house!", funFact: "Snow houses stay warm inside.", habitat: "Snow Den", bgGradient: "from-cyan-300 to-blue-400" },
];

const bugs: SafariFriend[] = [
  { id: "bee", name: "Busy Bee", emoji: "🐝", soundText: "BZZZ BZZZ!", call: "Bzzz! I visit every flower for a sip!", funFact: "Bees dance to tell friends where the flowers are.", habitat: "Flower Bed", bgGradient: "from-amber-400 to-yellow-500" },
  { id: "butterfly", name: "Soft Butterfly", emoji: "🦋", soundText: "FLUTTER!", call: "Flutter flutter! My wings are like tiny stained glass!", funFact: "Butterflies taste with their feet.", habitat: "Sunny Petal", bgGradient: "from-violet-400 to-fuchsia-500" },
  { id: "beetle", name: "Shiny Beetle", emoji: "🐛", soundText: "CLICK CLICK!", call: "Click! I wear a hard shiny coat!", funFact: "Beetles are the largest group of insects.", habitat: "Warm Compost", bgGradient: "from-emerald-600 to-lime-500" },
  { id: "cricket", name: "Night Cricket", emoji: "🦗", soundText: "CHIRP CHIRP!", call: "Chirp! I sing when the garden gets dark!", funFact: "Crickets rub their wings to make music.", habitat: "Night Jar", bgGradient: "from-lime-500 to-emerald-700" },
  { id: "ladybug", name: "Spot Ladybug", emoji: "🐞", soundText: "TAP TAP!", call: "Tap! Count my little black spots!", funFact: "Ladybugs help plants by eating tiny bugs.", habitat: "Leaf Top", bgGradient: "from-rose-500 to-red-500" },
  { id: "snail", name: "Garden Snail", emoji: "🐌", soundText: "SLIIIDE!", call: "Slide… I carry my house on my back!", funFact: "Snails make a shiny trail to slide on.", habitat: "Damp Stone", bgGradient: "from-amber-200 to-lime-300" },
  { id: "ant", name: "Marching Ant", emoji: "🐜", soundText: "TAP TAP!", call: "I march in a long busy line!", funFact: "Ants carry food bigger than themselves.", habitat: "Garden Path", bgGradient: "from-stone-500 to-amber-700" },
  { id: "worm", name: "Garden Worm", emoji: "🐛", soundText: "WIGGLE!", call: "Wiggle wiggle under the soil!", funFact: "Worms make the earth soft for plants.", habitat: "Damp Soil", bgGradient: "from-rose-300 to-amber-400" },
];

const pond: SafariFriend[] = [
  { id: "frog", name: "Pond Frog", emoji: "🐸", soundText: "RIBBIT RIBBIT!", call: "Ribbit! I hop from lily to lily!", funFact: "Frogs start life as wriggly tadpoles.", habitat: "Lily Pad", bgGradient: "from-lime-400 to-emerald-600" },
  { id: "duck", name: "Pond Duck", emoji: "🦆", soundText: "QUACK QUACK!", call: "Quack! I paddle with my webbed feet!", funFact: "Ducklings follow the first friend they see.", habitat: "Garden Pond", bgGradient: "from-sky-400 to-cyan-500" },
  { id: "fish", name: "Silver Fish", emoji: "🐟", soundText: "BLUB BLUB!", call: "Blub! I wink from under the water!", funFact: "Fish breathe with gills, not noses.", habitat: "Clear Water", bgGradient: "from-cyan-400 to-blue-500" },
  { id: "turtle", name: "Slow Turtle", emoji: "🐢", soundText: "MUNCH MUNCH!", call: "Munch! I nibble a water leaf!", funFact: "Turtles can live both in water and on the bank.", habitat: "Sunny Log", bgGradient: "from-emerald-500 to-teal-600" },
  { id: "dragonfly", name: "Blue Dragonfly", emoji: "🐝", soundText: "WHIRR!", call: "Whirr! I hover like a tiny helicopter!", funFact: "Dragonflies can fly in every direction.", habitat: "Reed Edge", bgGradient: "from-sky-500 to-indigo-500" },
  { id: "snail", name: "Pond Snail", emoji: "🐌", soundText: "SLIIIDE!", call: "Slide on the wet stone…", funFact: "Pond snails keep the water clean.", habitat: "Damp Stone", bgGradient: "from-slate-400 to-lime-400" },
  { id: "lily", name: "Lily Pad", emoji: "🌸", soundText: "REST!", call: "Rest on my round green pad!", funFact: "Frogs like a lily pad as a sitting chair.", habitat: "Pond Surface", bgGradient: "from-emerald-400 to-pink-300" },
  { id: "reed", name: "Whisper Reed", emoji: "🌾", soundText: "SWISH!", call: "Swish in the pond wind!", funFact: "Reeds hide ducklings from the rain.", habitat: "Reed Edge", bgGradient: "from-lime-500 to-amber-400" },
];

const night: SafariFriend[] = [
  { id: "owl", name: "Night Owl", emoji: "🦉", soundText: "HOO HOO!", call: "Hoo hoo! I watch the quiet wood!", funFact: "Owls can turn their heads almost all the way round.", habitat: "Owl Wood", bgGradient: "from-indigo-500 to-slate-700" },
  { id: "bat", name: "Soft Bat", emoji: "🦇", soundText: "SQUEAK!", call: "Squeak! I fly with my hands!", funFact: "Bats find their way with tiny echoes.", habitat: "Porch Eaves", bgGradient: "from-violet-700 to-slate-800" },
  { id: "moth", name: "Moon Moth", emoji: "🦋", soundText: "FLUTTER!", call: "Flutter to the warm porch light!", funFact: "Moths like lamps because they steer by the moon.", habitat: "Porch Light", bgGradient: "from-amber-300 to-yellow-500" },
  { id: "cat", name: "Night Cat", emoji: "🐱", soundText: "MEOW MEOW!", call: "Meow! I pad softly past the lamp!", funFact: "Cats see well in dim light.", habitat: "Bed Lamp", bgGradient: "from-orange-400 to-amber-600" },
  { id: "fox", name: "Quiet Fox", emoji: "🦊", soundText: "YIP YIP!", call: "Yip! I trot under the stars!", funFact: "Foxes walk on their toes.", habitat: "Star Path", bgGradient: "from-orange-500 to-rose-500" },
  { id: "mouse", name: "Tiny Mouse", emoji: "🐭", soundText: "SQUEAK SQUEAK!", call: "Squeak! I nibble a quiet crumb!", funFact: "Mice twitch their whiskers to feel the dark.", habitat: "Skirting Board", bgGradient: "from-slate-400 to-amber-300" },
  { id: "star", name: "Night Star", emoji: "⭐", soundText: "TWINKLE!", call: "Twinkle from the balcony sky!", funFact: "Stars look small because they are far.", habitat: "Star Balcony", bgGradient: "from-yellow-300 to-amber-500" },
  { id: "moon", name: "Quiet Moon", emoji: "🌙", soundText: "GLOW!", call: "I glow so bedtime feels safe!", funFact: "The moon does not make its own light — it shines the sun back.", habitat: "Night Sky", bgGradient: "from-indigo-300 to-violet-400" },
];

const kitchen: SafariFriend[] = [
  { id: "pot", name: "Soup Pot", emoji: "🍲", soundText: "BUBBLE BUBBLE!", call: "Bubble! Stir Nana's warm soup!", funFact: "A lid keeps the soup steam in.", habitat: "Stove", bgGradient: "from-orange-400 to-amber-600" },
  { id: "bread", name: "Warm Bun", emoji: "🍞", soundText: "CRACKLE!", call: "Crackle! I just came out of the oven!", funFact: "Yeast makes bread puff up.", habitat: "Bakery Shelf", bgGradient: "from-amber-300 to-yellow-500" },
  { id: "apple", name: "Crunch Apple", emoji: "🍎", soundText: "CRUNCH!", call: "Crunch! Pick me from the fruit stall!", funFact: "Apples float in a washing bowl.", habitat: "Fruit Stall", bgGradient: "from-rose-400 to-red-500" },
  { id: "spoon", name: "Stir Spoon", emoji: "🥄", soundText: "CLINK CLINK!", call: "Clink! Round and round in the pot!", funFact: "A wooden spoon does not scratch the pot.", habitat: "Drawer", bgGradient: "from-amber-200 to-orange-400" },
  { id: "milk", name: "Milk Jug", emoji: "🥛", soundText: "POUR!", call: "Pour a cup for breakfast!", funFact: "Milk likes a cold shelf.", habitat: "Family Table", bgGradient: "from-slate-100 to-sky-300" },
  { id: "cat", name: "Kitchen Cat", emoji: "🐱", soundText: "MEOW!", call: "Meow! I watch the warm oven!", funFact: "Kitchen cats like a sunny windowsill.", habitat: "Window", bgGradient: "from-orange-400 to-amber-500" },
  { id: "jam", name: "Berry Jam", emoji: "🍓", soundText: "POP!", call: "Pop the lid — sweet berry jam!", funFact: "Jam is fruit cooked until it is sticky.", habitat: "Pantry", bgGradient: "from-pink-400 to-rose-600" },
  { id: "oven", name: "Warm Oven", emoji: "🔥", soundText: "WHOOSH!", call: "Whoosh — the oven is ready to bake!", funFact: "Ovens cook with still hot air, not a flame you stir.", habitat: "Bakery", bgGradient: "from-orange-500 to-red-600" },
];

const vehicles: SafariFriend[] = [
  { id: "bus", name: "Town Bus", emoji: "🚌", soundText: "BEEP BEEP!", call: "Beep beep! Hop on the high street!", funFact: "Buses stop when you wave at the stop.", habitat: "High Street", bgGradient: "from-yellow-400 to-amber-500" },
  { id: "car", name: "Little Car", emoji: "🚗", soundText: "VROOM!", call: "Vroom! Seatbelt click!", funFact: "Cars have lights for night roads.", habitat: "Town Road", bgGradient: "from-sky-400 to-blue-500" },
  { id: "plane", name: "Sky Plane", emoji: "✈️", soundText: "WHOOSH!", call: "Whoosh over the runway!", funFact: "Planes lift because air moves over the wings.", habitat: "Airport", bgGradient: "from-cyan-300 to-sky-500" },
  { id: "train", name: "Choo Train", emoji: "🚂", soundText: "CHOO CHOO!", call: "Choo choo along the track!", funFact: "Trains follow the rails.", habitat: "Station", bgGradient: "from-rose-400 to-red-500" },
  { id: "bike", name: "City Bike", emoji: "🚲", soundText: "RING RING!", call: "Ring! Pedal past the park!", funFact: "Helmets keep heads safe.", habitat: "Cycle Path", bgGradient: "from-lime-400 to-emerald-500" },
  { id: "boat", name: "Harbour Boat", emoji: "🚢", soundText: "TOOT TOOT!", call: "Toot at the dock!", funFact: "Boats float because they push water away.", habitat: "Harbour", bgGradient: "from-indigo-400 to-blue-600" },
  { id: "heli", name: "Sky Chopper", emoji: "🚁", soundText: "CHOP CHOP!", call: "Chop chop over the town!", funFact: "Helicopters can hover in one place.", habitat: "Helipad", bgGradient: "from-sky-300 to-slate-500" },
  { id: "lights", name: "Traffic Light", emoji: "🚦", soundText: "CLICK!", call: "Red stop, green go!", funFact: "Red is on top so everyone can see stop.", habitat: "Crossing", bgGradient: "from-red-400 to-emerald-400" },
];

const studio: SafariFriend[] = [
  { id: "paint", name: "Paint Pot", emoji: "🎨", soundText: "SPLASH!", call: "Splash a colour on the paper!", funFact: "Red and yellow make orange.", habitat: "Atelier", bgGradient: "from-pink-400 to-violet-500" },
  { id: "drum", name: "Studio Drum", emoji: "🥁", soundText: "BOOM TAP!", call: "Boom tap a beat!", funFact: "Drums make sound when the skin wiggles.", habitat: "Music Garden", bgGradient: "from-amber-500 to-rose-500" },
  { id: "bead", name: "Colour Bead", emoji: "💜", soundText: "CLICK!", call: "Click onto the string!", funFact: "Beads make patterns you can count.", habitat: "Bead Table", bgGradient: "from-violet-400 to-fuchsia-500" },
  { id: "brush", name: "Paint Brush", emoji: "🖌️", soundText: "SWISH!", call: "Swish a big stroke!", funFact: "A wet brush makes a softer line.", habitat: "Easel", bgGradient: "from-sky-400 to-indigo-400" },
  { id: "note", name: "Singing Note", emoji: "🎵", soundText: "LA LA!", call: "La la in the garden!", funFact: "Notes go up and down like steps.", habitat: "Music Garden", bgGradient: "from-violet-400 to-indigo-500" },
  { id: "sticker", name: "Gold Sticker", emoji: "🌟", soundText: "STICK!", call: "Stick me on the page!", funFact: "Stickers like a dry page.", habitat: "Art Table", bgGradient: "from-yellow-300 to-orange-400" },
  { id: "crayon", name: "Chunky Crayon", emoji: "🖍️", soundText: "SCRIBBLE!", call: "Scribble a thick bright line!", funFact: "Crayons are coloured wax.", habitat: "Art Table", bgGradient: "from-sky-400 to-fuchsia-400" },
  { id: "scissors", name: "Safe Scissors", emoji: "✂️", soundText: "SNIP!", call: "Snip snip — round tips, grown-up nearby!", funFact: "Toddler scissors have round ends.", habitat: "Craft Tray", bgGradient: "from-slate-300 to-rose-400" },
];

const letters: SafariFriend[] = [
  { id: "ay", name: "Letter A", emoji: "🅰️", soundText: "A!", call: "A says a like apple!", funFact: "A is the first letter of the alphabet.", habitat: "Phonics Meadow", bgGradient: "from-rose-400 to-red-500" },
  { id: "bee-letter", name: "Letter B", emoji: "🅱️", soundText: "B!", call: "B says buh like book!", funFact: "B has two bumps.", habitat: "Letter Lane", bgGradient: "from-sky-400 to-blue-500" },
  { id: "ten", name: "Number Ten", emoji: "🔟", soundText: "TEN!", call: "Ten fills a whole ten-frame!", funFact: "Ten is two hands of fingers.", habitat: "Counting Grove", bgGradient: "from-amber-400 to-yellow-500" },
  { id: "book", name: "Little Book", emoji: "📘", soundText: "FLIP!", call: "Flip a page and listen!", funFact: "Books have a beginning, middle and end.", habitat: "Story Nook", bgGradient: "from-indigo-400 to-blue-600" },
  { id: "pen", name: "Pencil", emoji: "✏️", soundText: "SCRIBBLE!", call: "Trace a big letter!", funFact: "Pencils can be rubbed out.", habitat: "Writing Desk", bgGradient: "from-yellow-300 to-amber-500" },
  { id: "dot", name: "Counting Dot", emoji: "🔵", soundText: "TAP!", call: "Tap each dot once!", funFact: "One tap for one thing is how we count.", habitat: "Dot Tray", bgGradient: "from-cyan-400 to-sky-500" },
  { id: "ess", name: "Letter S", emoji: "🐍", soundText: "S!", call: "S says sss like snake and sun!", funFact: "S looks a little like a snake.", habitat: "Phonics Meadow", bgGradient: "from-lime-400 to-emerald-600" },
  { id: "map", name: "Picture Map", emoji: "🗺️", soundText: "LOOK!", call: "Find the path on the picture map!", funFact: "Maps show where things are, smaller.", habitat: "Counting Grove", bgGradient: "from-emerald-400 to-sky-500" },
];

const home: SafariFriend[] = [
  { id: "house", name: "Family Home", emoji: "🏠", soundText: "KNOCK KNOCK!", call: "Knock! Come in, you are home!", funFact: "Homes keep us warm and dry.", habitat: "Family Home", bgGradient: "from-rose-300 to-amber-300" },
  { id: "brush", name: "Toothbrush", emoji: "😁", soundText: "BRUSH BRUSH!", call: "Brush in little circles!", funFact: "Two minutes is a good brush.", habitat: "Bathroom", bgGradient: "from-cyan-400 to-teal-500" },
  { id: "cup", name: "Sip Cup", emoji: "🥛", soundText: "SIP SIP!", call: "Pour and sip!", funFact: "A cup has a bottom so the drink stays in.", habitat: "Table", bgGradient: "from-sky-200 to-white" },
  { id: "heart", name: "Kind Heart", emoji: "❤️", soundText: "BEAT BEAT!", call: "A kind heart shares a hug!", funFact: "Kind words make hearts feel big.", habitat: "Living Room", bgGradient: "from-rose-400 to-red-500" },
  { id: "bed", name: "Soft Bed", emoji: "🛏️", soundText: "YAWN!", call: "Yawn… time for a quiet story!", funFact: "Sleep helps bodies grow.", habitat: "Bedroom", bgGradient: "from-indigo-300 to-violet-400" },
  { id: "smile", name: "Family Smile", emoji: "😊", soundText: "GIGGLE!", call: "Giggle! We are glad you are here!", funFact: "Smiles can be catching.", habitat: "Kitchen Table", bgGradient: "from-amber-300 to-yellow-400" },
  { id: "soap", name: "Bubble Soap", emoji: "🛁", soundText: "SCRUB!", call: "Scrub until the bubbles sing!", funFact: "Soap lifts dirt so water can wash it away.", habitat: "Sink", bgGradient: "from-pink-300 to-cyan-300" },
  { id: "towel", name: "Soft Towel", emoji: "📄", soundText: "PAT PAT!", call: "Pat dry, then hang me up!", funFact: "Towels soak water because they are thirsty cloth.", habitat: "Bathroom", bgGradient: "from-sky-200 to-slate-300" },
];

const park: SafariFriend[] = [
  { id: "bird", name: "Park Bird", emoji: "🐦", soundText: "TWEET TWEET!", call: "Tweet! I sing from the town tree!", funFact: "Birds sing to say hello to their friends.", habitat: "Town Park", bgGradient: "from-sky-400 to-emerald-400" },
  { id: "squirrel", name: "Busy Squirrel", emoji: "🐿️", soundText: "CHK CHK!", call: "Chk chk! I hide an acorn for later!", funFact: "Squirrels forget some acorns, and trees grow.", habitat: "Oak Shade", bgGradient: "from-amber-500 to-orange-600" },
  { id: "dog", name: "Park Puppy", emoji: "🐶", soundText: "WOOF WOOF!", call: "Woof! I wag on the green!", funFact: "Dogs smile with their tails.", habitat: "Grass Path", bgGradient: "from-yellow-400 to-amber-500" },
  { id: "duck", name: "Park Duck", emoji: "🦆", soundText: "QUACK QUACK!", call: "Quack at the park pond!", funFact: "Park ducks like a nibble of oats, not bread.", habitat: "Park Pond", bgGradient: "from-cyan-400 to-sky-500" },
  { id: "bee", name: "Clover Bee", emoji: "🐝", soundText: "BZZZ BZZZ!", call: "Bzzz in the clover!", funFact: "Bees love purple clover.", habitat: "Clover Patch", bgGradient: "from-amber-400 to-lime-400" },
  { id: "bunny", name: "Soft Bunny", emoji: "🐰", soundText: "SNIFF SNIFF!", call: "Sniff! I hop through the daisies!", funFact: "Rabbits hop to see over the grass.", habitat: "Daisy Lawn", bgGradient: "from-pink-300 to-rose-400" },
  { id: "bench", name: "Park Bench", emoji: "🌳", soundText: "SIT!", call: "Sit and watch the town trees!", funFact: "Benches are for resting, not running.", habitat: "Park Path", bgGradient: "from-amber-600 to-yellow-500" },
  { id: "fountain", name: "Park Fountain", emoji: "⛲", soundText: "SPLASH!", call: "Splash splash — toss no coins, just watch!", funFact: "Fountains push water up, then it falls down.", habitat: "Town Square", bgGradient: "from-cyan-400 to-sky-600" },
];

const compost: SafariFriend[] = [
  { id: "worm", name: "Compost Worm", emoji: "🐛", soundText: "WIGGLE!", call: "Wiggle through the warm heap!", funFact: "Worms turn scraps into rich soil.", habitat: "Compost Heap", bgGradient: "from-rose-400 to-amber-700" },
  { id: "beetle", name: "Heap Beetle", emoji: "🐛", soundText: "CLICK!", call: "Click under a leaf in the heap!", funFact: "Beetles help break old plants.", habitat: "Warm Compost", bgGradient: "from-emerald-600 to-lime-500" },
  { id: "mushroom", name: "Soft Mushroom", emoji: "🍄", soundText: "POP!", call: "I pop up after rain!", funFact: "Mushrooms recycle old wood.", habitat: "Damp Log", bgGradient: "from-rose-300 to-stone-500" },
  { id: "spider", name: "Garden Spider", emoji: "🕷️", soundText: "SPIN!", call: "I spin a tiny silk path!", funFact: "Most garden spiders help by catching flies.", habitat: "Leaf Web", bgGradient: "from-stone-500 to-slate-700" },
  { id: "slug", name: "Shiny Slug", emoji: "🐌", soundText: "SLIDE!", call: "I leave a silver trail!", funFact: "Slugs like damp, not hot sun.", habitat: "Damp Stone", bgGradient: "from-slate-400 to-lime-400" },
  { id: "ant", name: "Heap Ant", emoji: "🐜", soundText: "MARCH!", call: "March, march with a crumb!", funFact: "Ants farm little gardens of their own.", habitat: "Soil Path", bgGradient: "from-amber-700 to-stone-800" },
  { id: "leaf", name: "Brown Leaf", emoji: "🍂", soundText: "CRACKLE!", call: "Crackle — I am food for the heap!", funFact: "Old leaves become new soil.", habitat: "Leaf Pile", bgGradient: "from-orange-500 to-amber-700" },
  { id: "sowbug", name: "Tiny Woodlouse", emoji: "🐛", soundText: "CURL!", call: "I curl into a little ball!", funFact: "Woodlice like dark damp wood.", habitat: "Under Bark", bgGradient: "from-stone-400 to-emerald-700" },
];

const tales: SafariFriend[] = [
  { id: "hen", name: "Story Hen", emoji: "🐔", artSrc: "/safari/hen.jpg", soundText: "CLUCK!", call: "Cluck! Once upon a barnyard…", funFact: "Hens star in many first tales.", habitat: "Barnyard Tale", bgGradient: "from-orange-400 to-amber-500" },
  { id: "book", name: "Story Book", emoji: "📖", artSrc: "/safari/book.jpg", soundText: "FLIP!", call: "Flip — every page is a new door!", funFact: "Stories have a start, a middle, and an end.", habitat: "Story Nook", bgGradient: "from-violet-400 to-purple-500" },
  { id: "crown", name: "Tale Crown", emoji: "👑", artSrc: "/safari/crown.jpg", soundText: "SHINE!", call: "Shine for the kind king!", funFact: "Crowns in tales mean a job: be fair.", habitat: "Castle Page", bgGradient: "from-yellow-400 to-amber-500" },
  { id: "king", name: "Kind King", emoji: "🦁", artSrc: "/safari/king.jpg", soundText: "HELLO!", call: "Hello, little reader!", funFact: "Kind kings share, they do not shout.", habitat: "Castle Page", bgGradient: "from-violet-400 to-amber-400" },
  { id: "dragon", name: "Gentle Dragon", emoji: "🐉", artSrc: "/safari/dragon.jpg", soundText: "WHOOSH!", call: "Whoosh — I puff warm air, not trouble!", funFact: "Story dragons can be friends.", habitat: "Cave Chapter", bgGradient: "from-emerald-500 to-lime-600" },
  { id: "boat", name: "Tale Boat", emoji: "⛵", artSrc: "/safari/boat.jpg", soundText: "SAIL!", call: "Sail across the page!", funFact: "Boats in stories go farther than real harbours.", habitat: "Sea Chapter", bgGradient: "from-sky-400 to-cyan-500" },
  { id: "star", name: "Wish Star", emoji: "⭐", artSrc: "/safari/star.jpg", soundText: "TWINKLE!", call: "Twinkle a wish on the last page!", funFact: "Many tales end under a star.", habitat: "Night Chapter", bgGradient: "from-amber-300 to-yellow-400" },
  { id: "castle", name: "Page Castle", emoji: "🏰", artSrc: "/safari/castle.jpg", soundText: "ECHO!", call: "Echo in the tall stone hall!", funFact: "Castles keep the story people together.", habitat: "Castle Page", bgGradient: "from-slate-400 to-violet-500" },
];

const trail: SafariFriend[] = [
  { id: "pine", name: "Trail Pine", emoji: "🌲", soundText: "SWISH!", call: "Swish in the forest wind!", funFact: "Pines keep their needles in winter.", habitat: "Forest Trail", bgGradient: "from-emerald-500 to-green-700" },
  { id: "owl", name: "Trail Owl", emoji: "🦉", soundText: "HOO!", call: "Hoo — I watch the path!", funFact: "Owls hear better than they see in the dark.", habitat: "Pine Branch", bgGradient: "from-indigo-500 to-slate-700" },
  { id: "boot", name: "Hiking Boot", emoji: "👢", soundText: "THUD!", call: "Thud thud along the stones!", funFact: "Boots grip mud so feet stay dry.", habitat: "Forest Path", bgGradient: "from-amber-700 to-stone-600" },
  { id: "gem", name: "Cave Gem", emoji: "💎", soundText: "SPARKLE!", call: "Sparkle in the dark cave!", funFact: "Gems are rocks that grew slowly.", habitat: "Gem Cave", bgGradient: "from-teal-400 to-cyan-500" },
  { id: "map", name: "Trail Map", emoji: "🗺️", soundText: "FOLD!", call: "Fold me — X marks the picnic!", funFact: "Maps help you not get lost.", habitat: "Lookout", bgGradient: "from-amber-400 to-orange-500" },
  { id: "fox", name: "Forest Fox", emoji: "🦊", soundText: "YIP!", call: "Yip! I trot between the pines!", funFact: "Foxes walk on their toes.", habitat: "Pine Shade", bgGradient: "from-orange-400 to-rose-500" },
  { id: "cave", name: "Quiet Cave", emoji: "🕳️", soundText: "DRIP!", call: "Drip drip — echo, echo!", funFact: "Caves stay cool even on hot days.", habitat: "Cave Mouth", bgGradient: "from-stone-600 to-slate-800" },
  { id: "rain", name: "Trail Rain", emoji: "☔", soundText: "PITTER!", call: "Pitter patter on the leaves!", funFact: "Rain feeds the forest.", habitat: "Canopy", bgGradient: "from-cyan-400 to-blue-500" },
];

const bedroom: SafariFriend[] = [
  { id: "bed", name: "Soft Bed", emoji: "🛏️", soundText: "YAWN!", call: "Yawn — pillows ready!", funFact: "Sleep helps bodies grow.", habitat: "Bedroom", bgGradient: "from-sky-300 to-indigo-400" },
  { id: "lamp", name: "Bed Lamp", emoji: "💡", soundText: "CLICK!", call: "Click — a small glow, not the sun!", funFact: "Night lamps should be dim and warm.", habitat: "Bedside", bgGradient: "from-amber-300 to-yellow-400" },
  { id: "teddy", name: "Night Teddy", emoji: "🧸", soundText: "SQUEEZE!", call: "Squeeze me for a brave hug!", funFact: "Teddies keep secrets and hands busy.", habitat: "Pillow", bgGradient: "from-amber-400 to-orange-400" },
  { id: "cat", name: "Lap Cat", emoji: "🐱", soundText: "PURR!", call: "Purr on the quilt!", funFact: "Cats purr when they feel safe.", habitat: "Quilt", bgGradient: "from-orange-400 to-amber-600" },
  { id: "book", name: "Bedtime Book", emoji: "📖", soundText: "WHISPER!", call: "One more page, then lights low…", funFact: "Quiet stories help brains slow down.", habitat: "Bedside", bgGradient: "from-indigo-400 to-violet-500" },
  { id: "moon", name: "Window Moon", emoji: "🌙", soundText: "GLOW!", call: "I watch through the curtain!", funFact: "The moon is a good night-light.", habitat: "Window", bgGradient: "from-indigo-300 to-violet-400" },
  { id: "sock", name: "Lost Sock", emoji: "👟", soundText: "FLOP!", call: "Find my pair under the bed!", funFact: "Socks like to hide in pairs.", habitat: "Under Bed", bgGradient: "from-sky-400 to-rose-400" },
  { id: "mouse", name: "Quiet Mouse", emoji: "🐭", soundText: "SQUEAK!", call: "A tiny squeak, then hush!", funFact: "Night mice nibble crumbs, then rest.", habitat: "Skirting", bgGradient: "from-slate-400 to-amber-300" },
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
    { pairId: "bone", emoji: "🍖", name: "Bone", color: "from-stone-300 to-amber-200" },
    { pairId: "pig", emoji: "🐷", name: "Pig", color: "from-rose-400 to-pink-500" },
    { pairId: "horse", emoji: "🐴", name: "Horse", color: "from-amber-500 to-orange-600" },
  ],
  "bug-world": [
    { pairId: "bee", emoji: "🐝", name: "Bee", color: "from-amber-400 to-yellow-500" },
    { pairId: "bug", emoji: "🐛", name: "Beetle", color: "from-lime-500 to-emerald-600" },
    { pairId: "leaf", emoji: "🍃", name: "Leaf", color: "from-emerald-400 to-green-500" },
    { pairId: "flower", emoji: "🌼", name: "Flower", color: "from-pink-400 to-rose-500" },
    { pairId: "lady", emoji: "🐞", name: "Ladybug", color: "from-rose-500 to-red-500" },
    { pairId: "snail", emoji: "🐌", name: "Snail", color: "from-amber-200 to-lime-400" },
    { pairId: "worm", emoji: "🐛", name: "Worm", color: "from-rose-300 to-amber-400" },
    { pairId: "web", emoji: "🕸️", name: "Web", color: "from-slate-300 to-sky-400" },
  ],
  "arctic-world": [
    { pairId: "penguin", emoji: "🐧", name: "Penguin", color: "from-sky-300 to-indigo-400" },
    { pairId: "flake", emoji: "❄️", name: "Snowflake", color: "from-cyan-200 to-sky-400" },
    { pairId: "seal", emoji: "🐬", name: "Seal", color: "from-slate-300 to-cyan-400" },
    { pairId: "bear", emoji: "🐻", name: "Snow bear", color: "from-white to-sky-300" },
    { pairId: "igloo", emoji: "❄️", name: "Ice", color: "from-cyan-300 to-blue-400" },
    { pairId: "light", emoji: "🌌", name: "Lights", color: "from-violet-400 to-indigo-600" },
    { pairId: "whale", emoji: "🐋", name: "Whale", color: "from-indigo-400 to-blue-600" },
    { pairId: "fox", emoji: "🦊", name: "Fox", color: "from-orange-300 to-slate-300" },
  ],
  "vehicle-world": [
    { pairId: "bus", emoji: "🚌", name: "Bus", color: "from-yellow-400 to-amber-500" },
    { pairId: "car", emoji: "🚗", name: "Car", color: "from-sky-400 to-blue-500" },
    { pairId: "plane", emoji: "✈️", name: "Plane", color: "from-cyan-300 to-sky-500" },
    { pairId: "boat", emoji: "🚢", name: "Boat", color: "from-indigo-400 to-blue-600" },
    { pairId: "train", emoji: "🚂", name: "Train", color: "from-rose-400 to-red-500" },
    { pairId: "bike", emoji: "🚲", name: "Bike", color: "from-lime-400 to-emerald-500" },
    { pairId: "heli", emoji: "🚁", name: "Chopper", color: "from-sky-300 to-slate-500" },
    { pairId: "light", emoji: "🚦", name: "Lights", color: "from-red-400 to-emerald-400" },
  ],
  "kitchen-world": [
    { pairId: "apple", emoji: "🍎", name: "Apple", color: "from-rose-400 to-red-500" },
    { pairId: "bread", emoji: "🍞", name: "Bun", color: "from-amber-300 to-orange-400" },
    { pairId: "soup", emoji: "🍲", name: "Soup", color: "from-orange-400 to-amber-500" },
    { pairId: "berry", emoji: "🍓", name: "Berry", color: "from-pink-400 to-rose-500" },
    { pairId: "corn", emoji: "🌽", name: "Corn", color: "from-yellow-300 to-lime-400" },
    { pairId: "pot", emoji: "🥘", name: "Pot", color: "from-amber-500 to-rose-400" },
    { pairId: "milk", emoji: "🥛", name: "Milk", color: "from-slate-100 to-sky-300" },
    { pairId: "spoon", emoji: "🥄", name: "Spoon", color: "from-amber-200 to-orange-400" },
  ],
  "city-world": [
    { pairId: "book", emoji: "📖", name: "Book", color: "from-amber-400 to-orange-500" },
    { pairId: "fire", emoji: "🚒", name: "Engine", color: "from-rose-500 to-red-600" },
    { pairId: "tree", emoji: "🌳", name: "Park tree", color: "from-emerald-400 to-green-600" },
    { pairId: "bag", emoji: "🛍️", name: "Market bag", color: "from-pink-400 to-fuchsia-500" },
    { pairId: "lamp", emoji: "🏮", name: "Lamp", color: "from-orange-400 to-amber-500" },
    { pairId: "bench", emoji: "🌳", name: "Bench", color: "from-amber-600 to-yellow-500" },
    { pairId: "bell", emoji: "🔔", name: "Bell", color: "from-amber-400 to-yellow-500" },
    { pairId: "clock", emoji: "🕰️", name: "Clock", color: "from-stone-400 to-amber-500" },
  ],
  "night-world": [
    { pairId: "star", emoji: "⭐", name: "Star", color: "from-yellow-300 to-amber-500" },
    { pairId: "moon", emoji: "🌙", name: "Moon", color: "from-indigo-300 to-violet-400" },
    { pairId: "owl", emoji: "🦉", name: "Owl", color: "from-indigo-500 to-slate-600" },
    { pairId: "lamp", emoji: "💡", name: "Lamp", color: "from-amber-300 to-yellow-400" },
    { pairId: "bed", emoji: "🛏️", name: "Bed", color: "from-sky-300 to-indigo-400" },
    { pairId: "moth", emoji: "🦋", name: "Moth", color: "from-violet-300 to-fuchsia-400" },
    { pairId: "fox", emoji: "🦊", name: "Fox", color: "from-orange-400 to-rose-500" },
    { pairId: "bat", emoji: "🦇", name: "Bat", color: "from-violet-700 to-slate-800" },
  ],
  "creative-world": [
    { pairId: "paint", emoji: "🎨", name: "Paint", color: "from-pink-400 to-violet-500" },
    { pairId: "note", emoji: "🎵", name: "Note", color: "from-violet-400 to-indigo-500" },
    { pairId: "bead", emoji: "💜", name: "Bead", color: "from-amber-400 to-rose-400" },
    { pairId: "star", emoji: "🌟", name: "Sticker", color: "from-yellow-300 to-orange-400" },
    { pairId: "brush", emoji: "🖌️", name: "Brush", color: "from-sky-400 to-indigo-400" },
    { pairId: "heart", emoji: "💖", name: "Heart", color: "from-rose-400 to-pink-500" },
    { pairId: "drum", emoji: "🥁", name: "Drum", color: "from-amber-500 to-rose-500" },
    { pairId: "crayon", emoji: "🖍️", name: "Crayon", color: "from-sky-400 to-fuchsia-400" },
  ],
  "learning-world": [
    { pairId: "a", emoji: "🅰️", name: "Letter A", color: "from-rose-400 to-red-500" },
    { pairId: "one", emoji: "1️⃣", name: "One", color: "from-sky-400 to-blue-500" },
    { pairId: "circle", emoji: "🔵", name: "Circle", color: "from-cyan-400 to-sky-500" },
    { pairId: "star", emoji: "⭐", name: "Star", color: "from-amber-300 to-yellow-400" },
    { pairId: "book", emoji: "📘", name: "Book", color: "from-indigo-400 to-blue-600" },
    { pairId: "pencil", emoji: "✏️", name: "Pencil", color: "from-yellow-300 to-amber-500" },
    { pairId: "ten", emoji: "🔟", name: "Ten", color: "from-amber-400 to-yellow-500" },
    { pairId: "map", emoji: "🗺️", name: "Map", color: "from-emerald-400 to-sky-500" },
  ],
  "my-world": [
    { pairId: "smile", emoji: "😊", name: "Smile", color: "from-amber-300 to-yellow-400" },
    { pairId: "heart", emoji: "❤️", name: "Heart", color: "from-rose-400 to-red-500" },
    { pairId: "home", emoji: "🏠", name: "Home", color: "from-sky-400 to-indigo-400" },
    { pairId: "brush", emoji: "😁", name: "Brush", color: "from-cyan-400 to-teal-500" },
    { pairId: "hug", emoji: "🤗", name: "Hug", color: "from-pink-400 to-rose-400" },
    { pairId: "bed", emoji: "🛏️", name: "Bed", color: "from-indigo-300 to-violet-400" },
    { pairId: "cup", emoji: "🥛", name: "Cup", color: "from-sky-200 to-white" },
    { pairId: "soap", emoji: "🛁", name: "Soap", color: "from-pink-300 to-cyan-300" },
  ],
  "adventure-world": [
    { pairId: "tree", emoji: "🌲", name: "Pine", color: "from-emerald-500 to-green-700" },
    { pairId: "rocket", emoji: "🚀", name: "Rocket", color: "from-sky-400 to-indigo-500" },
    { pairId: "rain", emoji: "☔", name: "Rain", color: "from-cyan-400 to-blue-500" },
    { pairId: "map", emoji: "🗺️", name: "Map", color: "from-amber-400 to-orange-500" },
    { pairId: "gem", emoji: "💎", name: "Gem", color: "from-teal-400 to-cyan-500" },
    { pairId: "moon", emoji: "🌕", name: "Moon", color: "from-yellow-200 to-amber-300" },
    { pairId: "boot", emoji: "👢", name: "Boot", color: "from-amber-700 to-stone-600" },
    { pairId: "cave", emoji: "🕳️", name: "Cave", color: "from-stone-600 to-slate-800" },
  ],
  "story-world": [
    { pairId: "book", emoji: "📖", name: "Story", color: "from-violet-400 to-purple-500" },
    { pairId: "star", emoji: "⭐", name: "Star", color: "from-amber-300 to-yellow-400" },
    { pairId: "boat", emoji: "⛵", name: "Boat", color: "from-sky-400 to-cyan-500" },
    { pairId: "hen", emoji: "🐔", name: "Hen", color: "from-orange-400 to-amber-500" },
    { pairId: "shell", emoji: "🐚", name: "Shell", color: "from-rose-200 to-pink-400" },
    { pairId: "crown", emoji: "👑", name: "Crown", color: "from-yellow-400 to-amber-500" },
    { pairId: "page", emoji: "📄", name: "Page", color: "from-slate-200 to-amber-100" },
    { pairId: "king", emoji: "🤴", name: "King", color: "from-violet-400 to-amber-400" },
  ],
};

const SAFARI_BY_AREA: Record<string, { title: string; safari: SafariFriend[] }> = {
  "animal-world/farm-valley": { title: "Pasture Safari", safari: farm },
  "animal-world/jungle-canopy": { title: "Canopy Safari", safari: jungle },
  "bug-world/flower-bed": { title: "Flower Bed Safari", safari: bugs },
  "bug-world/pond-edge": { title: "Pond Safari", safari: pond },
  "bug-world/night-jar": { title: "Night Jar Safari", safari: night },
  "bug-world/compost-heap": { title: "Compost Safari", safari: compost },
  "arctic-world/ice-floe": { title: "Floe Safari", safari: ice },
  "arctic-world/polar-den": { title: "Snow Den Safari", safari: ice },
  "arctic-world/seal-shore": { title: "Seal Shore Safari", safari: ice },
  "arctic-world/northern-lights": { title: "Light Sky Safari", safari: ice },
  "night-world/owl-wood": { title: "Owl Wood Safari", safari: night },
  "night-world/porch-moths": { title: "Porch Safari", safari: night },
  "night-world/star-balcony": { title: "Balcony Safari", safari: night },
  "night-world/bedroom-lamp": { title: "Lamp Safari", safari: bedroom },
  "city-world/park-green": { title: "Park Safari", safari: park },
  "story-world/barnyard-tales": { title: "Tale Safari", safari: tales },
};

const SAFARI_BY_WORLD: Record<string, { title: string; safari: SafariFriend[] }> = {
  "animal-world": { title: "Animal Safari", safari: savanna },
  "bug-world": { title: "Bug Safari", safari: bugs },
  "arctic-world": { title: "Ice Safari", safari: ice },
  "night-world": { title: "Night Safari", safari: night },
  "city-world": { title: "Town Safari", safari: park },
  "adventure-world": { title: "Forest Safari", safari: trail },
  "kitchen-world": { title: "Kitchen Safari", safari: kitchen },
  "vehicle-world": { title: "Street Safari", safari: vehicles },
  "creative-world": { title: "Studio Safari", safari: studio },
  "learning-world": { title: "Letter Safari", safari: letters },
  "my-world": { title: "Home Safari", safari: home },
  "story-world": { title: "Tale Safari", safari: tales },
};

const LETTERS_BY_WORLD: Record<string, string[]> = {
  "learning-world": ["A", "B", "C", "D", "S", "T", "M", "P", "6", "8", "10", "N"],
  "arctic-world": ["I", "C", "E", "S", "N", "O", "W", "P", "F", "L", "B", "H"],
  "night-world": ["N", "O", "M", "S", "L", "B", "W", "T", "Q", "H", "D", "Y"],
  "vehicle-world": ["B", "C", "P", "T", "R", "A", "V", "S", "H", "W", "G", "L"],
  "kitchen-world": ["A", "B", "S", "P", "M", "C", "T", "O", "J", "K", "F", "N"],
  "animal-world": ["C", "P", "H", "D", "L", "M", "F", "S", "G", "W", "B", "R"],
  "bug-world": ["B", "A", "L", "W", "S", "C", "F", "M", "G", "D", "H", "P"],
  "city-world": ["P", "B", "T", "L", "M", "S", "F", "C", "K", "H", "R", "N"],
  "creative-world": ["P", "B", "S", "C", "H", "D", "N", "A", "G", "R", "E", "I"],
  "story-world": ["B", "T", "S", "H", "C", "K", "P", "R", "G", "L", "N", "D"],
  "my-world": ["H", "B", "S", "M", "T", "F", "C", "L", "D", "P", "K", "N"],
  "adventure-world": ["M", "T", "R", "P", "G", "C", "S", "F", "B", "L", "H", "K"],
};

const defaultRhymes: ThemedRhyme[] = [
  { id: "r-cat", targetWord: "Cat", targetEmoji: "🐱", spokenPrompt: "What rhymes with Cat? Listen for the at sound!", correctWord: "Hat", options: [{ word: "Hat", emoji: "🎩", isCorrect: true }, { word: "Dog", emoji: "🐶", isCorrect: false }, { word: "Sun", emoji: "☀️", isCorrect: false }] },
  { id: "r-star", targetWord: "Star", targetEmoji: "⭐", spokenPrompt: "What rhymes with Star? Listen for the ar sound!", correctWord: "Car", options: [{ word: "Car", emoji: "🚗", isCorrect: true }, { word: "Moon", emoji: "🌙", isCorrect: false }, { word: "Ball", emoji: "⚽", isCorrect: false }] },
  { id: "r-frog", targetWord: "Frog", targetEmoji: "🐸", spokenPrompt: "What rhymes with Frog? Listen for the og sound!", correctWord: "Dog", options: [{ word: "Dog", emoji: "🐶", isCorrect: true }, { word: "Fish", emoji: "🐠", isCorrect: false }, { word: "Tree", emoji: "🌳", isCorrect: false }] },
  { id: "r-bee", targetWord: "Bee", targetEmoji: "🐝", spokenPrompt: "What rhymes with Bee? Listen for the ee sound!", correctWord: "Tree", options: [{ word: "Tree", emoji: "🌳", isCorrect: true }, { word: "Cup", emoji: "☕", isCorrect: false }, { word: "Book", emoji: "📘", isCorrect: false }] },
  { id: "r-sun", targetWord: "Sun", targetEmoji: "☀️", spokenPrompt: "What rhymes with Sun? Listen for the un sound!", correctWord: "Bun", options: [{ word: "Bun", emoji: "🍞", isCorrect: true }, { word: "Moon", emoji: "🌙", isCorrect: false }, { word: "Bee", emoji: "🐝", isCorrect: false }] },
  { id: "r-fox", targetWord: "Fox", targetEmoji: "🦊", spokenPrompt: "What rhymes with Fox? Listen for the ox sound!", correctWord: "Box", options: [{ word: "Box", emoji: "📦", isCorrect: true }, { word: "Cat", emoji: "🐱", isCorrect: false }, { word: "Star", emoji: "⭐", isCorrect: false }] },
  { id: "r-cake", targetWord: "Cake", targetEmoji: "🍰", spokenPrompt: "What rhymes with Cake? Listen for the ake sound!", correctWord: "Lake", options: [{ word: "Lake", emoji: "🏞️", isCorrect: true }, { word: "Pie", emoji: "🥧", isCorrect: false }, { word: "Hat", emoji: "🎩", isCorrect: false }] },
  { id: "r-bell", targetWord: "Bell", targetEmoji: "🔔", spokenPrompt: "What rhymes with Bell? Listen for the ell sound!", correctWord: "Shell", options: [{ word: "Shell", emoji: "🐚", isCorrect: true }, { word: "Drum", emoji: "🥁", isCorrect: false }, { word: "Sun", emoji: "☀️", isCorrect: false }] },
];

const RHYMES_BY_WORLD: Record<string, ThemedRhyme[]> = {
  "kitchen-world": [
    { id: "k-pan", targetWord: "Pan", targetEmoji: "🍳", spokenPrompt: "What rhymes with Pan in the kitchen?", correctWord: "Can", options: [{ word: "Can", emoji: "🥫", isCorrect: true }, { word: "Soup", emoji: "🍲", isCorrect: false }, { word: "Bread", emoji: "🍞", isCorrect: false }] },
    { id: "k-pot", targetWord: "Pot", targetEmoji: "🥘", spokenPrompt: "What rhymes with Pot?", correctWord: "Hot", options: [{ word: "Hot", emoji: "🔥", isCorrect: true }, { word: "Milk", emoji: "🥛", isCorrect: false }, { word: "Pear", emoji: "🍐", isCorrect: false }] },
    { id: "k-bun", targetWord: "Bun", targetEmoji: "🍞", spokenPrompt: "What rhymes with Bun on the bakery shelf?", correctWord: "Sun", options: [{ word: "Sun", emoji: "☀️", isCorrect: true }, { word: "Jam", emoji: "🍓", isCorrect: false }, { word: "Egg", emoji: "🥚", isCorrect: false }] },
    { id: "k-cake", targetWord: "Cake", targetEmoji: "🍰", spokenPrompt: "What rhymes with Cake?", correctWord: "Bake", options: [{ word: "Bake", emoji: "👩‍🍳", isCorrect: true }, { word: "Fish", emoji: "🐟", isCorrect: false }, { word: "Bus", emoji: "🚌", isCorrect: false }] },
    { id: "k-jam", targetWord: "Jam", targetEmoji: "🍓", spokenPrompt: "What rhymes with Jam on the pantry shelf?", correctWord: "Ham", options: [{ word: "Ham", emoji: "🍖", isCorrect: true }, { word: "Soup", emoji: "🍲", isCorrect: false }, { word: "Spoon", emoji: "🥄", isCorrect: false }] },
    { id: "k-pie", targetWord: "Pie", targetEmoji: "🥧", spokenPrompt: "What rhymes with Pie from the oven?", correctWord: "Sky", options: [{ word: "Sky", emoji: "🌤️", isCorrect: true }, { word: "Milk", emoji: "🥛", isCorrect: false }, { word: "Pot", emoji: "🥘", isCorrect: false }] },
    { id: "k-stew", targetWord: "Stew", targetEmoji: "🍲", spokenPrompt: "What rhymes with Stew bubbling on the stove?", correctWord: "Blue", options: [{ word: "Blue", emoji: "🔵", isCorrect: true }, { word: "Bread", emoji: "🍞", isCorrect: false }, { word: "Pan", emoji: "🍳", isCorrect: false }] },
    { id: "k-mill", targetWord: "Mill", targetEmoji: "🌾", spokenPrompt: "What rhymes with Mill that grinds the flour?", correctWord: "Hill", options: [{ word: "Hill", emoji: "⛰️", isCorrect: true }, { word: "Jam", emoji: "🍓", isCorrect: false }, { word: "Cup", emoji: "🥤", isCorrect: false }] },

    { id: "k-rice", targetWord: "Rice", targetEmoji: "🍚", spokenPrompt: "What rhymes with Rice in the pot?", correctWord: "Nice", options: [{ word: "Nice", emoji: "😊", isCorrect: true }, { word: "Fork", emoji: "🍴", isCorrect: false }, { word: "Pan", emoji: "🍳", isCorrect: false }] },
    { id: "k-bean", targetWord: "Bean", targetEmoji: "🌰", spokenPrompt: "What rhymes with Bean on the counter?", correctWord: "Green", options: [{ word: "Green", emoji: "💚", isCorrect: true }, { word: "Soup", emoji: "🍲", isCorrect: false }, { word: "Egg", emoji: "🥚", isCorrect: false }] },
    { id: "k-pear", targetWord: "Pear", targetEmoji: "🍐", spokenPrompt: "What rhymes with Pear in the bowl?", correctWord: "Chair", options: [{ word: "Chair", emoji: "💺", isCorrect: true }, { word: "Jam", emoji: "🍓", isCorrect: false }, { word: "Pot", emoji: "🥘", isCorrect: false }] },
    { id: "k-mug", targetWord: "Mug", targetEmoji: "☕", spokenPrompt: "What rhymes with Mug by the kettle?", correctWord: "Hug", options: [{ word: "Hug", emoji: "🤗", isCorrect: true }, { word: "Tea", emoji: "🍵", isCorrect: false }, { word: "Bun", emoji: "🍞", isCorrect: false }] },
    { id: "k-toast", targetWord: "Toast", targetEmoji: "🍞", spokenPrompt: "What rhymes with Toast from the grill?", correctWord: "Coast", options: [{ word: "Coast", emoji: "🏖️", isCorrect: true }, { word: "Jam", emoji: "🍓", isCorrect: false }, { word: "Milk", emoji: "🥛", isCorrect: false }] },
    { id: "k-spoon", targetWord: "Spoon", targetEmoji: "🥄", spokenPrompt: "What rhymes with Spoon in the drawer?", correctWord: "Moon", options: [{ word: "Moon", emoji: "🌙", isCorrect: true }, { word: "Fork", emoji: "🍴", isCorrect: false }, { word: "Pot", emoji: "🥘", isCorrect: false }] },
    { id: "k-grill", targetWord: "Grill", targetEmoji: "🔥", spokenPrompt: "What rhymes with Grill in the kitchen?", correctWord: "Hill", options: [{ word: "Hill", emoji: "⛰️", isCorrect: true }, { word: "Pan", emoji: "🍳", isCorrect: false }, { word: "Soup", emoji: "🍲", isCorrect: false }] },
    { id: "k-dough", targetWord: "Dough", targetEmoji: "🥖", spokenPrompt: "What rhymes with Dough on the board?", correctWord: "Grow", options: [{ word: "Grow", emoji: "🌱", isCorrect: true }, { word: "Flour", emoji: "🌾", isCorrect: false }, { word: "Egg", emoji: "🥚", isCorrect: false }] },
  ],
  "night-world": [
    { id: "n-star", targetWord: "Star", targetEmoji: "⭐", spokenPrompt: "What rhymes with Star in the night sky?", correctWord: "Far", options: [{ word: "Far", emoji: "🔭", isCorrect: true }, { word: "Bed", emoji: "🛏️", isCorrect: false }, { word: "Owl", emoji: "🦉", isCorrect: false }] },
    { id: "n-light", targetWord: "Light", targetEmoji: "💡", spokenPrompt: "What rhymes with Light?", correctWord: "Night", options: [{ word: "Night", emoji: "🌙", isCorrect: true }, { word: "Moth", emoji: "🦋", isCorrect: false }, { word: "Sock", emoji: "👟", isCorrect: false }] },
    { id: "n-bed", targetWord: "Bed", targetEmoji: "🛏️", spokenPrompt: "What rhymes with Bed?", correctWord: "Red", options: [{ word: "Red", emoji: "🔴", isCorrect: true }, { word: "Moon", emoji: "🌕", isCorrect: false }, { word: "Fox", emoji: "🦊", isCorrect: false }] },
    { id: "n-moon", targetWord: "Moon", targetEmoji: "🌙", spokenPrompt: "What rhymes with Moon?", correctWord: "Spoon", options: [{ word: "Spoon", emoji: "🥄", isCorrect: true }, { word: "Star", emoji: "⭐", isCorrect: false }, { word: "Tree", emoji: "🌲", isCorrect: false }] },
    { id: "n-dark", targetWord: "Dark", targetEmoji: "🌑", spokenPrompt: "What rhymes with Dark after the lamp clicks off?", correctWord: "Park", options: [{ word: "Park", emoji: "🌳", isCorrect: true }, { word: "Owl", emoji: "🦉", isCorrect: false }, { word: "Bed", emoji: "🛏️", isCorrect: false }] },
    { id: "n-hoot", targetWord: "Hoot", targetEmoji: "🦉", spokenPrompt: "What rhymes with Hoot in the owl wood?", correctWord: "Boot", options: [{ word: "Boot", emoji: "👢", isCorrect: true }, { word: "Moon", emoji: "🌙", isCorrect: false }, { word: "Fox", emoji: "🦊", isCorrect: false }] },
    { id: "n-dream", targetWord: "Dream", targetEmoji: "💭", spokenPrompt: "What rhymes with Dream at bedtime?", correctWord: "Cream", options: [{ word: "Cream", emoji: "🍦", isCorrect: true }, { word: "Lamp", emoji: "💡", isCorrect: false }, { word: "Star", emoji: "⭐", isCorrect: false }] },
    { id: "n-sock", targetWord: "Sock", targetEmoji: "👟", spokenPrompt: "What rhymes with Sock under the bed?", correctWord: "Clock", options: [{ word: "Clock", emoji: "🕰️", isCorrect: true }, { word: "Cat", emoji: "🐱", isCorrect: false }, { word: "Moon", emoji: "🌕", isCorrect: false }] },

    { id: "n-yawn", targetWord: "Yawn", targetEmoji: "🥱", spokenPrompt: "What rhymes with Yawn at bedtime?", correctWord: "Dawn", options: [{ word: "Dawn", emoji: "🌅", isCorrect: true }, { word: "Bed", emoji: "🛏️", isCorrect: false }, { word: "Owl", emoji: "🦉", isCorrect: false }] },
    { id: "n-sleep", targetWord: "Sleep", targetEmoji: "😴", spokenPrompt: "What rhymes with Sleep?", correctWord: "Sheep", options: [{ word: "Sheep", emoji: "🐑", isCorrect: true }, { word: "Moon", emoji: "🌙", isCorrect: false }, { word: "Lamp", emoji: "💡", isCorrect: false }] },
    { id: "n-rest", targetWord: "Rest", targetEmoji: "🛌", spokenPrompt: "What rhymes with Rest on the pillow?", correctWord: "Nest", options: [{ word: "Nest", emoji: "🐦", isCorrect: true }, { word: "Star", emoji: "⭐", isCorrect: false }, { word: "Fox", emoji: "🦊", isCorrect: false }] },
    { id: "n-shade", targetWord: "Shade", targetEmoji: "🌑", spokenPrompt: "What rhymes with Shade in the room?", correctWord: "Made", options: [{ word: "Made", emoji: "🛠️", isCorrect: true }, { word: "Owl", emoji: "🦉", isCorrect: false }, { word: "Bed", emoji: "🛏️", isCorrect: false }] },
    { id: "n-quiet", targetWord: "Quiet", targetEmoji: "🤫", spokenPrompt: "What rhymes with Quiet after lights out?", correctWord: "Diet", options: [{ word: "Diet", emoji: "🥗", isCorrect: true }, { word: "Moon", emoji: "🌙", isCorrect: false }, { word: "Moth", emoji: "🦋", isCorrect: false }] },
    { id: "n-glow", targetWord: "Glow", targetEmoji: "✨", spokenPrompt: "What rhymes with Glow on the balcony?", correctWord: "Slow", options: [{ word: "Slow", emoji: "🐢", isCorrect: true }, { word: "Star", emoji: "⭐", isCorrect: false }, { word: "Bed", emoji: "🛏️", isCorrect: false }] },
    { id: "n-night2", targetWord: "Night", targetEmoji: "🌃", spokenPrompt: "What rhymes with Night besides light?", correctWord: "Kite", options: [{ word: "Kite", emoji: "🎈", isCorrect: true }, { word: "Owl", emoji: "🦉", isCorrect: false }, { word: "Sock", emoji: "👟", isCorrect: false }] },
    { id: "n-dream2", targetWord: "Beam", targetEmoji: "🔦", spokenPrompt: "What rhymes with Beam from the lamp?", correctWord: "Team", options: [{ word: "Team", emoji: "👥", isCorrect: true }, { word: "Moon", emoji: "🌙", isCorrect: false }, { word: "Fox", emoji: "🦊", isCorrect: false }] },
  ],
  "vehicle-world": [
    { id: "v-bus", targetWord: "Bus", targetEmoji: "🚌", spokenPrompt: "What rhymes with Bus on the high street?", correctWord: "Us", options: [{ word: "Us", emoji: "👧", isCorrect: true }, { word: "Car", emoji: "🚗", isCorrect: false }, { word: "Boat", emoji: "🚢", isCorrect: false }] },
    { id: "v-car", targetWord: "Car", targetEmoji: "🚗", spokenPrompt: "What rhymes with Car?", correctWord: "Star", options: [{ word: "Star", emoji: "⭐", isCorrect: true }, { word: "Train", emoji: "🚂", isCorrect: false }, { word: "Bike", emoji: "🚲", isCorrect: false }] },
    { id: "v-van", targetWord: "Van", targetEmoji: "🚐", spokenPrompt: "What rhymes with Van?", correctWord: "Can", options: [{ word: "Can", emoji: "🥫", isCorrect: true }, { word: "Plane", emoji: "✈️", isCorrect: false }, { word: "Road", emoji: "🛣️", isCorrect: false }] },
    { id: "v-train", targetWord: "Train", targetEmoji: "🚂", spokenPrompt: "What rhymes with Train?", correctWord: "Rain", options: [{ word: "Rain", emoji: "🌧️", isCorrect: true }, { word: "Bus", emoji: "🚌", isCorrect: false }, { word: "Dock", emoji: "⚓", isCorrect: false }] },
    { id: "v-bike", targetWord: "Bike", targetEmoji: "🚲", spokenPrompt: "What rhymes with Bike on the cycle path?", correctWord: "Hike", options: [{ word: "Hike", emoji: "👢", isCorrect: true }, { word: "Car", emoji: "🚗", isCorrect: false }, { word: "Boat", emoji: "🚢", isCorrect: false }] },
    { id: "v-road", targetWord: "Road", targetEmoji: "🛣️", spokenPrompt: "What rhymes with Road?", correctWord: "Toad", options: [{ word: "Toad", emoji: "🐸", isCorrect: true }, { word: "Bus", emoji: "🚌", isCorrect: false }, { word: "Plane", emoji: "✈️", isCorrect: false }] },
    { id: "v-beep", targetWord: "Beep", targetEmoji: "🚌", spokenPrompt: "What rhymes with Beep from the town bus?", correctWord: "Sheep", options: [{ word: "Sheep", emoji: "🐑", isCorrect: true }, { word: "Train", emoji: "🚂", isCorrect: false }, { word: "Van", emoji: "🚐", isCorrect: false }] },
    { id: "v-dock", targetWord: "Dock", targetEmoji: "⚓", spokenPrompt: "What rhymes with Dock at the harbour?", correctWord: "Sock", options: [{ word: "Sock", emoji: "👟", isCorrect: true }, { word: "Ship", emoji: "🚢", isCorrect: false }, { word: "Bike", emoji: "🚲", isCorrect: false }] },

    { id: "v-ship", targetWord: "Ship", targetEmoji: "🚢", spokenPrompt: "What rhymes with Ship at the harbour?", correctWord: "Dip", options: [{ word: "Dip", emoji: "🏊", isCorrect: true }, { word: "Bus", emoji: "🚌", isCorrect: false }, { word: "Van", emoji: "🚐", isCorrect: false }] },
    { id: "v-wheel", targetWord: "Wheel", targetEmoji: "🚗", spokenPrompt: "What rhymes with Wheel in the garage?", correctWord: "Feel", options: [{ word: "Feel", emoji: "💗", isCorrect: true }, { word: "Car", emoji: "🚗", isCorrect: false }, { word: "Road", emoji: "🛣️", isCorrect: false }] },
    { id: "v-horn", targetWord: "Horn", targetEmoji: "📯", spokenPrompt: "What rhymes with Horn on the bus?", correctWord: "Corn", options: [{ word: "Corn", emoji: "🌽", isCorrect: true }, { word: "Bike", emoji: "🚲", isCorrect: false }, { word: "Dock", emoji: "⚓", isCorrect: false }] },
    { id: "v-go", targetWord: "Go", targetEmoji: "💚", spokenPrompt: "What rhymes with Go at the lights?", correctWord: "Slow", options: [{ word: "Slow", emoji: "🐢", isCorrect: true }, { word: "Stop", emoji: "🛑", isCorrect: false }, { word: "Bus", emoji: "🚌", isCorrect: false }] },
    { id: "v-park", targetWord: "Park", targetEmoji: "🅿️", spokenPrompt: "What rhymes with Park the van?", correctWord: "Dark", options: [{ word: "Dark", emoji: "🌑", isCorrect: true }, { word: "Plane", emoji: "✈️", isCorrect: false }, { word: "Road", emoji: "🛣️", isCorrect: false }] },
    { id: "v-track", targetWord: "Track", targetEmoji: "🛤️", spokenPrompt: "What rhymes with Track for the train?", correctWord: "Back", options: [{ word: "Back", emoji: "🔙", isCorrect: true }, { word: "Bus", emoji: "🚌", isCorrect: false }, { word: "Ship", emoji: "🚢", isCorrect: false }] },
    { id: "v-plane", targetWord: "Plane", targetEmoji: "✈️", spokenPrompt: "What rhymes with Plane on the runway?", correctWord: "Rain", options: [{ word: "Rain", emoji: "🌧️", isCorrect: true }, { word: "Van", emoji: "🚐", isCorrect: false }, { word: "Dock", emoji: "⚓", isCorrect: false }] },
    { id: "v-ferry", targetWord: "Ferry", targetEmoji: "⛴️", spokenPrompt: "What rhymes with Ferry at the dock?", correctWord: "Berry", options: [{ word: "Berry", emoji: "🍇", isCorrect: true }, { word: "Car", emoji: "🚗", isCorrect: false }, { word: "Horn", emoji: "📯", isCorrect: false }] },
  ],
  "learning-world": [
    { id: "l-cat", targetWord: "Cat", targetEmoji: "🐱", spokenPrompt: "What rhymes with Cat in the meadow?", correctWord: "Hat", options: [{ word: "Hat", emoji: "🎩", isCorrect: true }, { word: "Pen", emoji: "✏️", isCorrect: false }, { word: "Ten", emoji: "🔟", isCorrect: false }] },
    { id: "l-ten", targetWord: "Ten", targetEmoji: "🔟", spokenPrompt: "What rhymes with Ten?", correctWord: "Pen", options: [{ word: "Pen", emoji: "✏️", isCorrect: true }, { word: "Six", emoji: "6️⃣", isCorrect: false }, { word: "Book", emoji: "📘", isCorrect: false }] },
    { id: "l-bee", targetWord: "Bee", targetEmoji: "🐝", spokenPrompt: "What rhymes with Bee?", correctWord: "Tree", options: [{ word: "Tree", emoji: "🌳", isCorrect: true }, { word: "Map", emoji: "🗺️", isCorrect: false }, { word: "Cup", emoji: "☕", isCorrect: false }] },
    { id: "l-fox", targetWord: "Fox", targetEmoji: "🦊", spokenPrompt: "What rhymes with Fox?", correctWord: "Box", options: [{ word: "Box", emoji: "📦", isCorrect: true }, { word: "Hat", emoji: "🎩", isCorrect: false }, { word: "Sun", emoji: "☀️", isCorrect: false }] },
    { id: "l-map", targetWord: "Map", targetEmoji: "🗺️", spokenPrompt: "What rhymes with Map in the counting grove?", correctWord: "Tap", options: [{ word: "Tap", emoji: "👆", isCorrect: true }, { word: "Book", emoji: "📘", isCorrect: false }, { word: "Ten", emoji: "🔟", isCorrect: false }] },
    { id: "l-book", targetWord: "Book", targetEmoji: "📘", spokenPrompt: "What rhymes with Book?", correctWord: "Look", options: [{ word: "Look", emoji: "👀", isCorrect: true }, { word: "Pen", emoji: "✏️", isCorrect: false }, { word: "Six", emoji: "6️⃣", isCorrect: false }] },
    { id: "l-six", targetWord: "Six", targetEmoji: "6️⃣", spokenPrompt: "What rhymes with Six?", correctWord: "Mix", options: [{ word: "Mix", emoji: "🎨", isCorrect: true }, { word: "Ten", emoji: "🔟", isCorrect: false }, { word: "Cat", emoji: "🐱", isCorrect: false }] },
    { id: "l-shape", targetWord: "Shape", targetEmoji: "🔷", spokenPrompt: "What rhymes with Shape?", correctWord: "Cape", options: [{ word: "Cape", emoji: "⭐", isCorrect: true }, { word: "Dot", emoji: "🔵", isCorrect: false }, { word: "Map", emoji: "🗺️", isCorrect: false }] },

    { id: "l-pen", targetWord: "Pen", targetEmoji: "🖊️", spokenPrompt: "What rhymes with Pen in the grove?", correctWord: "Hen", options: [{ word: "Hen", emoji: "🐔", isCorrect: true }, { word: "Ten", emoji: "🔟", isCorrect: false }, { word: "Map", emoji: "🗺️", isCorrect: false }] },
    { id: "l-read", targetWord: "Read", targetEmoji: "📖", spokenPrompt: "What rhymes with Read on the porch?", correctWord: "Seed", options: [{ word: "Seed", emoji: "🌱", isCorrect: true }, { word: "Book", emoji: "📘", isCorrect: false }, { word: "Six", emoji: "6️⃣", isCorrect: false }] },
    { id: "l-count", targetWord: "Count", targetEmoji: "🔢", spokenPrompt: "What rhymes with Count?", correctWord: "Mount", options: [{ word: "Mount", emoji: "⛰️", isCorrect: true }, { word: "Cat", emoji: "🐱", isCorrect: false }, { word: "Pen", emoji: "✏️", isCorrect: false }] },
    { id: "l-spell", targetWord: "Spell", targetEmoji: "🔤", spokenPrompt: "What rhymes with Spell in the meadow?", correctWord: "Bell", options: [{ word: "Bell", emoji: "🔔", isCorrect: true }, { word: "Map", emoji: "🗺️", isCorrect: false }, { word: "Ten", emoji: "🔟", isCorrect: false }] },
    { id: "l-line", targetWord: "Line", targetEmoji: "📏", spokenPrompt: "What rhymes with Line on the page?", correctWord: "Fine", options: [{ word: "Fine", emoji: "👌", isCorrect: true }, { word: "Book", emoji: "📘", isCorrect: false }, { word: "Fox", emoji: "🦊", isCorrect: false }] },
    { id: "l-dot", targetWord: "Dot", targetEmoji: "🔘", spokenPrompt: "What rhymes with Dot in the ten-frame?", correctWord: "Pot", options: [{ word: "Pot", emoji: "🥘", isCorrect: true }, { word: "Six", emoji: "6️⃣", isCorrect: false }, { word: "Cat", emoji: "🐱", isCorrect: false }] },
    { id: "l-page", targetWord: "Page", targetEmoji: "📄", spokenPrompt: "What rhymes with Page?", correctWord: "Cage", options: [{ word: "Cage", emoji: "🦜", isCorrect: true }, { word: "Pen", emoji: "✏️", isCorrect: false }, { word: "Ten", emoji: "🔟", isCorrect: false }] },
    { id: "l-quiz", targetWord: "Quiz", targetEmoji: "❓", spokenPrompt: "What rhymes with Quiz?", correctWord: "Is", options: [{ word: "Is", emoji: "✅", isCorrect: true }, { word: "Map", emoji: "🗺️", isCorrect: false }, { word: "Bee", emoji: "🐝", isCorrect: false }] },
  ],
  "animal-world": [
    { id: "a-pig", targetWord: "Pig", targetEmoji: "🐷", spokenPrompt: "What rhymes with Pig in the muddy pen?", correctWord: "Dig", options: [{ word: "Dig", emoji: "🕳️", isCorrect: true }, { word: "Cow", emoji: "🐄", isCorrect: false }, { word: "Hen", emoji: "🐔", isCorrect: false }] },
    { id: "a-hen", targetWord: "Hen", targetEmoji: "🐔", spokenPrompt: "What rhymes with Hen?", correctWord: "Pen", options: [{ word: "Pen", emoji: "✏️", isCorrect: true }, { word: "Egg", emoji: "🥚", isCorrect: false }, { word: "Hay", emoji: "🌾", isCorrect: false }] },
    { id: "a-sheep", targetWord: "Sheep", targetEmoji: "🐑", spokenPrompt: "What rhymes with Sheep?", correctWord: "Sleep", options: [{ word: "Sleep", emoji: "😴", isCorrect: true }, { word: "Wool", emoji: "🎀", isCorrect: false }, { word: "Barn", emoji: "🏚️", isCorrect: false }] },
    { id: "a-cat", targetWord: "Cat", targetEmoji: "🐱", spokenPrompt: "What rhymes with Cat in the barn?", correctWord: "Hat", options: [{ word: "Hat", emoji: "🎩", isCorrect: true }, { word: "Milk", emoji: "🥛", isCorrect: false }, { word: "Hay", emoji: "🌾", isCorrect: false }] },
    { id: "a-cow", targetWord: "Cow", targetEmoji: "🐄", spokenPrompt: "What rhymes with Cow in the pasture?", correctWord: "Now", options: [{ word: "Now", emoji: "⏰", isCorrect: true }, { word: "Pig", emoji: "🐷", isCorrect: false }, { word: "Egg", emoji: "🥚", isCorrect: false }] },
    { id: "a-duck", targetWord: "Duck", targetEmoji: "🦆", spokenPrompt: "What rhymes with Duck on the farm pond?", correctWord: "Truck", options: [{ word: "Truck", emoji: "🚚", isCorrect: true }, { word: "Hen", emoji: "🐔", isCorrect: false }, { word: "Hay", emoji: "🌾", isCorrect: false }] },
    { id: "a-dog", targetWord: "Dog", targetEmoji: "🐶", spokenPrompt: "What rhymes with Dog in the yard?", correctWord: "Frog", options: [{ word: "Frog", emoji: "🐸", isCorrect: true }, { word: "Cow", emoji: "🐄", isCorrect: false }, { word: "Wool", emoji: "🎀", isCorrect: false }] },
    { id: "a-goat", targetWord: "Goat", targetEmoji: "🐐", spokenPrompt: "What rhymes with Goat on the hill?", correctWord: "Boat", options: [{ word: "Boat", emoji: "⛵", isCorrect: true }, { word: "Horse", emoji: "🐴", isCorrect: false }, { word: "Barn", emoji: "🏚️", isCorrect: false }] },

    { id: "a-roar", targetWord: "Roar", targetEmoji: "🦁", spokenPrompt: "What rhymes with Roar in the valley?", correctWord: "Door", options: [{ word: "Door", emoji: "🚪", isCorrect: true }, { word: "Cow", emoji: "🐮", isCorrect: false }, { word: "Hen", emoji: "🐔", isCorrect: false }] },
    { id: "a-tail", targetWord: "Tail", targetEmoji: "🐖", spokenPrompt: "What rhymes with Tail in the stall?", correctWord: "Sail", options: [{ word: "Sail", emoji: "⛵", isCorrect: true }, { word: "Pig", emoji: "🐷", isCorrect: false }, { word: "Duck", emoji: "🦆", isCorrect: false }] },
    { id: "a-nest", targetWord: "Nest", targetEmoji: "🐦", spokenPrompt: "What rhymes with Nest in the barn?", correctWord: "Rest", options: [{ word: "Rest", emoji: "🛌", isCorrect: true }, { word: "Goat", emoji: "🐐", isCorrect: false }, { word: "Dog", emoji: "🐶", isCorrect: false }] },
    { id: "a-moo", targetWord: "Moo", targetEmoji: "🐮", spokenPrompt: "What rhymes with Moo from the cow?", correctWord: "Blue", options: [{ word: "Blue", emoji: "🔵", isCorrect: true }, { word: "Hen", emoji: "🐔", isCorrect: false }, { word: "Cat", emoji: "🐱", isCorrect: false }] },
    { id: "a-chirp", targetWord: "Chirp", targetEmoji: "🐤", spokenPrompt: "What rhymes with Chirp from the chick?", correctWord: "Slurp", options: [{ word: "Slurp", emoji: "🥤", isCorrect: true }, { word: "Duck", emoji: "🦆", isCorrect: false }, { word: "Sheep", emoji: "🐑", isCorrect: false }] },
    { id: "a-wool", targetWord: "Wool", targetEmoji: "🐑", spokenPrompt: "What rhymes with Wool on the sheep?", correctWord: "Pull", options: [{ word: "Pull", emoji: "⚓", isCorrect: true }, { word: "Pig", emoji: "🐷", isCorrect: false }, { word: "Cow", emoji: "🐮", isCorrect: false }] },
    { id: "a-snout", targetWord: "Snout", targetEmoji: "🐖", spokenPrompt: "What rhymes with Snout in the mud?", correctWord: "Out", options: [{ word: "Out", emoji: "🚪", isCorrect: true }, { word: "Hen", emoji: "🐔", isCorrect: false }, { word: "Dog", emoji: "🐶", isCorrect: false }] },
    { id: "a-herd", targetWord: "Herd", targetEmoji: "🐄", spokenPrompt: "What rhymes with Herd in the pasture?", correctWord: "Bird", options: [{ word: "Bird", emoji: "🐦", isCorrect: true }, { word: "Goat", emoji: "🐐", isCorrect: false }, { word: "Cat", emoji: "🐱", isCorrect: false }] },
  ],
  "bug-world": [
    { id: "b-bee", targetWord: "Bee", targetEmoji: "🐝", spokenPrompt: "What rhymes with Bee on the flower?", correctWord: "Tree", options: [{ word: "Tree", emoji: "🌳", isCorrect: true }, { word: "Ant", emoji: "🐜", isCorrect: false }, { word: "Mud", emoji: "📦", isCorrect: false }] },
    { id: "b-bug", targetWord: "Bug", targetEmoji: "🐞", spokenPrompt: "What rhymes with Bug?", correctWord: "Hug", options: [{ word: "Hug", emoji: "🤗", isCorrect: true }, { word: "Leaf", emoji: "🍃", isCorrect: false }, { word: "Web", emoji: "🕸️", isCorrect: false }] },
    { id: "b-ant", targetWord: "Ant", targetEmoji: "🐜", spokenPrompt: "What rhymes with Ant?", correctWord: "Plant", options: [{ word: "Plant", emoji: "🌱", isCorrect: true }, { word: "Bee", emoji: "🐝", isCorrect: false }, { word: "Rock", emoji: "⛰️", isCorrect: false }] },
    { id: "b-snail", targetWord: "Snail", targetEmoji: "🐌", spokenPrompt: "What rhymes with Snail?", correctWord: "Trail", options: [{ word: "Trail", emoji: "🛤️", isCorrect: true }, { word: "Shell", emoji: "🐚", isCorrect: false }, { word: "Dew", emoji: "💧", isCorrect: false }] },
    { id: "b-web", targetWord: "Web", targetEmoji: "🕸️", spokenPrompt: "What rhymes with Web on the leaf?", correctWord: "Bed", options: [{ word: "Bed", emoji: "🛏️", isCorrect: true }, { word: "Ant", emoji: "🐜", isCorrect: false }, { word: "Bee", emoji: "🐝", isCorrect: false }] },
    { id: "b-fly", targetWord: "Fly", targetEmoji: "🐝", spokenPrompt: "What rhymes with Fly over the pond?", correctWord: "Sky", options: [{ word: "Sky", emoji: "🌤️", isCorrect: true }, { word: "Worm", emoji: "🐛", isCorrect: false }, { word: "Mud", emoji: "📦", isCorrect: false }] },
    { id: "b-hop", targetWord: "Hop", targetEmoji: "🐸", spokenPrompt: "What rhymes with Hop on the lily pad?", correctWord: "Top", options: [{ word: "Top", emoji: "🔝", isCorrect: true }, { word: "Leaf", emoji: "🍃", isCorrect: false }, { word: "Web", emoji: "🕸️", isCorrect: false }] },
    { id: "b-flower", targetWord: "Flower", targetEmoji: "🌸", spokenPrompt: "What rhymes with Flower in the bed?", correctWord: "Shower", options: [{ word: "Shower", emoji: "🚿", isCorrect: true }, { word: "Bee", emoji: "🐝", isCorrect: false }, { word: "Rock", emoji: "⛰️", isCorrect: false }] },

    { id: "b-wing", targetWord: "Wing", targetEmoji: "🦋", spokenPrompt: "What rhymes with Wing on the bloom?", correctWord: "Sing", options: [{ word: "Sing", emoji: "🎤", isCorrect: true }, { word: "Ant", emoji: "🐜", isCorrect: false }, { word: "Web", emoji: "🕸️", isCorrect: false }] },
    { id: "b-crawl", targetWord: "Crawl", targetEmoji: "🐛", spokenPrompt: "What rhymes with Crawl under the leaf?", correctWord: "Ball", options: [{ word: "Ball", emoji: "⚽", isCorrect: true }, { word: "Bee", emoji: "🐝", isCorrect: false }, { word: "Fly", emoji: "🐝", isCorrect: false }] },
    { id: "b-dew", targetWord: "Dew", targetEmoji: "💧", spokenPrompt: "What rhymes with Dew on the web?", correctWord: "New", options: [{ word: "New", emoji: "✨", isCorrect: true }, { word: "Snail", emoji: "🐌", isCorrect: false }, { word: "Bug", emoji: "🐞", isCorrect: false }] },
    { id: "b-pond", targetWord: "Pond", targetEmoji: "🐸", spokenPrompt: "What rhymes with Pond at the edge?", correctWord: "Wand", options: [{ word: "Wand", emoji: "✨", isCorrect: true }, { word: "Ant", emoji: "🐜", isCorrect: false }, { word: "Hop", emoji: "🐰", isCorrect: false }] },
    { id: "b-spot", targetWord: "Spot", targetEmoji: "🐞", spokenPrompt: "What rhymes with Spot on the ladybird?", correctWord: "Dot", options: [{ word: "Dot", emoji: "🔘", isCorrect: true }, { word: "Bee", emoji: "🐝", isCorrect: false }, { word: "Web", emoji: "🕸️", isCorrect: false }] },
    { id: "b-buzz", targetWord: "Buzz", targetEmoji: "🐝", spokenPrompt: "What rhymes with Buzz in the bed?", correctWord: "Fuzz", options: [{ word: "Fuzz", emoji: "🧸", isCorrect: true }, { word: "Fly", emoji: "🐝", isCorrect: false }, { word: "Snail", emoji: "🐌", isCorrect: false }] },
    { id: "b-leaf", targetWord: "Leaf", targetEmoji: "🍃", spokenPrompt: "What rhymes with Leaf in the compost?", correctWord: "Reef", options: [{ word: "Reef", emoji: "🌊", isCorrect: true }, { word: "Bug", emoji: "🐞", isCorrect: false }, { word: "Ant", emoji: "🐜", isCorrect: false }] },
    { id: "b-hive", targetWord: "Hive", targetEmoji: "🍯", spokenPrompt: "What rhymes with Hive?", correctWord: "Five", options: [{ word: "Five", emoji: "5️⃣", isCorrect: true }, { word: "Bee", emoji: "🐝", isCorrect: false }, { word: "Web", emoji: "🕸️", isCorrect: false }] },
  ],
  "arctic-world": [
    { id: "i-ice", targetWord: "Ice", targetEmoji: "❄️", spokenPrompt: "What rhymes with Ice on the floe?", correctWord: "Nice", options: [{ word: "Nice", emoji: "😊", isCorrect: true }, { word: "Seal", emoji: "🐬", isCorrect: false }, { word: "Snow", emoji: "❄️", isCorrect: false }] },
    { id: "i-seal", targetWord: "Seal", targetEmoji: "🐬", spokenPrompt: "What rhymes with Seal?", correctWord: "Wheel", options: [{ word: "Wheel", emoji: "🚗", isCorrect: true }, { word: "Ice", emoji: "❄️", isCorrect: false }, { word: "Bear", emoji: "🐻", isCorrect: false }] },
    { id: "i-snow", targetWord: "Snow", targetEmoji: "❄️", spokenPrompt: "What rhymes with Snow?", correctWord: "Go", options: [{ word: "Go", emoji: "🚶", isCorrect: true }, { word: "Floe", emoji: "❄️", isCorrect: false }, { word: "Fur", emoji: "🧸", isCorrect: false }] },
    { id: "i-whale", targetWord: "Whale", targetEmoji: "🐋", spokenPrompt: "What rhymes with Whale?", correctWord: "Sail", options: [{ word: "Sail", emoji: "⛵", isCorrect: true }, { word: "Ice", emoji: "❄️", isCorrect: false }, { word: "Fish", emoji: "🐟", isCorrect: false }] },
    { id: "i-fox", targetWord: "Fox", targetEmoji: "🦊", spokenPrompt: "What rhymes with Fox in the snow field?", correctWord: "Box", options: [{ word: "Box", emoji: "📦", isCorrect: true }, { word: "Seal", emoji: "🐬", isCorrect: false }, { word: "Ice", emoji: "❄️", isCorrect: false }] },
    { id: "i-cold", targetWord: "Cold", targetEmoji: "🥶", spokenPrompt: "What rhymes with Cold on the floe?", correctWord: "Gold", options: [{ word: "Gold", emoji: "🥇", isCorrect: true }, { word: "Bear", emoji: "🐻", isCorrect: false }, { word: "Snow", emoji: "❄️", isCorrect: false }] },
    { id: "i-den", targetWord: "Den", targetEmoji: "🏠", spokenPrompt: "What rhymes with Den where the snow bear naps?", correctWord: "Hen", options: [{ word: "Hen", emoji: "🐔", isCorrect: true }, { word: "Whale", emoji: "🐋", isCorrect: false }, { word: "Fur", emoji: "🧸", isCorrect: false }] },
    { id: "i-flake", targetWord: "Flake", targetEmoji: "❄️", spokenPrompt: "What rhymes with Flake falling from the sky?", correctWord: "Cake", options: [{ word: "Cake", emoji: "🍰", isCorrect: true }, { word: "Owl", emoji: "🦉", isCorrect: false }, { word: "Ice", emoji: "❄️", isCorrect: false }] },

    { id: "ar-floe", targetWord: "Floe", targetEmoji: "❄️", spokenPrompt: "What rhymes with Floe on the ice?", correctWord: "Glow", options: [{ word: "Glow", emoji: "✨", isCorrect: true }, { word: "Seal", emoji: "🐬", isCorrect: false }, { word: "Den", emoji: "🏠", isCorrect: false }] },
    { id: "ar-puff", targetWord: "Puff", targetEmoji: "🐧", spokenPrompt: "What rhymes with Puff from the penguin?", correctWord: "Fluff", options: [{ word: "Fluff", emoji: "🧸", isCorrect: true }, { word: "Snow", emoji: "❄️", isCorrect: false }, { word: "Fox", emoji: "🦊", isCorrect: false }] },
    { id: "ar-slide", targetWord: "Slide", targetEmoji: "🐧", spokenPrompt: "What rhymes with Slide on the ice?", correctWord: "Hide", options: [{ word: "Hide", emoji: "🙈", isCorrect: true }, { word: "Whale", emoji: "🐋", isCorrect: false }, { word: "Cold", emoji: "❄️", isCorrect: false }] },
    { id: "ar-fur", targetWord: "Fur", targetEmoji: "🐻", spokenPrompt: "What rhymes with Fur on the cub?", correctWord: "Purr", options: [{ word: "Purr", emoji: "🐱", isCorrect: true }, { word: "Ice", emoji: "❄️", isCorrect: false }, { word: "Den", emoji: "🏠", isCorrect: false }] },
    { id: "ar-bay", targetWord: "Bay", targetEmoji: "🐬", spokenPrompt: "What rhymes with Bay where seals rest?", correctWord: "Day", options: [{ word: "Day", emoji: "☀️", isCorrect: true }, { word: "Snow", emoji: "❄️", isCorrect: false }, { word: "Fox", emoji: "🦊", isCorrect: false }] },
    { id: "ar-wind", targetWord: "Wind", targetEmoji: "💨", spokenPrompt: "What rhymes with Wind on the floe?", correctWord: "Pinned", options: [{ word: "Pinned", emoji: "📌", isCorrect: true }, { word: "Seal", emoji: "🐬", isCorrect: false }, { word: "Ice", emoji: "❄️", isCorrect: false }] },
    { id: "ar-huddle", targetWord: "Huddle", targetEmoji: "🐧", spokenPrompt: "What rhymes with Huddle in the cold?", correctWord: "Puddle", options: [{ word: "Puddle", emoji: "💦", isCorrect: true }, { word: "Whale", emoji: "🐋", isCorrect: false }, { word: "Den", emoji: "🏠", isCorrect: false }] },
    { id: "ar-light", targetWord: "Light", targetEmoji: "🌌", spokenPrompt: "What rhymes with Light in the sky curtains?", correctWord: "Bright", options: [{ word: "Bright", emoji: "🌟", isCorrect: true }, { word: "Snow", emoji: "❄️", isCorrect: false }, { word: "Fox", emoji: "🦊", isCorrect: false }] },
  ],
  "city-world": [
    { id: "c-park", targetWord: "Park", targetEmoji: "🌳", spokenPrompt: "What rhymes with Park in town?", correctWord: "Dark", options: [{ word: "Dark", emoji: "🌑", isCorrect: true }, { word: "Bus", emoji: "🚌", isCorrect: false }, { word: "Shop", emoji: "🛍️", isCorrect: false }] },
    { id: "c-bell", targetWord: "Bell", targetEmoji: "🔔", spokenPrompt: "What rhymes with Bell?", correctWord: "Shell", options: [{ word: "Shell", emoji: "🐚", isCorrect: true }, { word: "Lamp", emoji: "🏮", isCorrect: false }, { word: "Road", emoji: "🛣️", isCorrect: false }] },
    { id: "c-tree", targetWord: "Tree", targetEmoji: "🌳", spokenPrompt: "What rhymes with Tree in the park?", correctWord: "Bee", options: [{ word: "Bee", emoji: "🐝", isCorrect: true }, { word: "Bench", emoji: "🌳", isCorrect: false }, { word: "Bag", emoji: "🛍️", isCorrect: false }] },
    { id: "c-shop", targetWord: "Shop", targetEmoji: "🏪", spokenPrompt: "What rhymes with Shop?", correctWord: "Stop", options: [{ word: "Stop", emoji: "🛑", isCorrect: true }, { word: "Park", emoji: "🌳", isCorrect: false }, { word: "Book", emoji: "📖", isCorrect: false }] },
    { id: "c-bag", targetWord: "Bag", targetEmoji: "🛍️", spokenPrompt: "What rhymes with Bag at the market?", correctWord: "Tag", options: [{ word: "Tag", emoji: "🏷️", isCorrect: true }, { word: "Bell", emoji: "🔔", isCorrect: false }, { word: "Tree", emoji: "🌳", isCorrect: false }] },
    { id: "c-clock", targetWord: "Clock", targetEmoji: "🕰️", spokenPrompt: "What rhymes with Clock in the square?", correctWord: "Sock", options: [{ word: "Sock", emoji: "👟", isCorrect: true }, { word: "Lamp", emoji: "🏮", isCorrect: false }, { word: "Bus", emoji: "🚌", isCorrect: false }] },
    { id: "c-street", targetWord: "Street", targetEmoji: "🛣️", spokenPrompt: "What rhymes with Street in town?", correctWord: "Feet", options: [{ word: "Feet", emoji: "👟", isCorrect: true }, { word: "Shop", emoji: "🏪", isCorrect: false }, { word: "Park", emoji: "🌳", isCorrect: false }] },
    { id: "c-lamp", targetWord: "Lamp", targetEmoji: "🏮", spokenPrompt: "What rhymes with Lamp on the green?", correctWord: "Stamp", options: [{ word: "Stamp", emoji: "📮", isCorrect: true }, { word: "Duck", emoji: "🦆", isCorrect: false }, { word: "Bag", emoji: "🛍️", isCorrect: false }] },

    { id: "c-bus", targetWord: "Bus", targetEmoji: "🚌", spokenPrompt: "What rhymes with Bus on the street?", correctWord: "Plus", options: [{ word: "Plus", emoji: "➕", isCorrect: true }, { word: "Park", emoji: "🌳", isCorrect: false }, { word: "Bell", emoji: "🔔", isCorrect: false }] },
    { id: "c-shop", targetWord: "Stop", targetEmoji: "🛑", spokenPrompt: "What rhymes with Stop at the corner?", correctWord: "Hop", options: [{ word: "Hop", emoji: "🐰", isCorrect: true }, { word: "Bag", emoji: "🛍️", isCorrect: false }, { word: "Tree", emoji: "🌳", isCorrect: false }] },
    { id: "c-van", targetWord: "Van", targetEmoji: "🚐", spokenPrompt: "What rhymes with Van at the market?", correctWord: "Can", options: [{ word: "Can", emoji: "🥫", isCorrect: true }, { word: "Clock", emoji: "🕰️", isCorrect: false }, { word: "Lamp", emoji: "💡", isCorrect: false }] },
    { id: "c-crowd", targetWord: "Crowd", targetEmoji: "👥", spokenPrompt: "What rhymes with Crowd on the green?", correctWord: "Loud", options: [{ word: "Loud", emoji: "📢", isCorrect: true }, { word: "Shop", emoji: "🏪", isCorrect: false }, { word: "Park", emoji: "🌳", isCorrect: false }] },
    { id: "c-gate", targetWord: "Gate", targetEmoji: "🚪", spokenPrompt: "What rhymes with Gate at the park?", correctWord: "Late", options: [{ word: "Late", emoji: "⏰", isCorrect: true }, { word: "Bell", emoji: "🔔", isCorrect: false }, { word: "Bag", emoji: "🛍️", isCorrect: false }] },
    { id: "c-bench", targetWord: "Bench", targetEmoji: "💺", spokenPrompt: "What rhymes with Bench under the tree?", correctWord: "Wrench", options: [{ word: "Wrench", emoji: "🔧", isCorrect: true }, { word: "Lamp", emoji: "💡", isCorrect: false }, { word: "Street", emoji: "🛣️", isCorrect: false }] },
    { id: "c-sign", targetWord: "Sign", targetEmoji: "📌", spokenPrompt: "What rhymes with Sign on the corner?", correctWord: "Line", options: [{ word: "Line", emoji: "📏", isCorrect: true }, { word: "Bus", emoji: "🚌", isCorrect: false }, { word: "Park", emoji: "🌳", isCorrect: false }] },
    { id: "c-square", targetWord: "Square", targetEmoji: "◻️", spokenPrompt: "What rhymes with Square in town?", correctWord: "Bear", options: [{ word: "Bear", emoji: "🐻", isCorrect: true }, { word: "Shop", emoji: "🏪", isCorrect: false }, { word: "Clock", emoji: "🕰️", isCorrect: false }] },
  ],
  "creative-world": [
    { id: "cr-paint", targetWord: "Paint", targetEmoji: "🎨", spokenPrompt: "What rhymes with Paint at the atelier?", correctWord: "Wait", options: [{ word: "Wait", emoji: "⏳", isCorrect: true }, { word: "Brush", emoji: "🖌️", isCorrect: false }, { word: "Bead", emoji: "💜", isCorrect: false }] },
    { id: "cr-bead", targetWord: "Bead", targetEmoji: "💜", spokenPrompt: "What rhymes with Bead?", correctWord: "Read", options: [{ word: "Read", emoji: "📖", isCorrect: true }, { word: "Glue", emoji: "🛁", isCorrect: false }, { word: "Song", emoji: "🎵", isCorrect: false }] },
    { id: "cr-song", targetWord: "Song", targetEmoji: "🎵", spokenPrompt: "What rhymes with Song?", correctWord: "Long", options: [{ word: "Long", emoji: "📏", isCorrect: true }, { word: "Drum", emoji: "🥁", isCorrect: false }, { word: "Star", emoji: "🌟", isCorrect: false }] },
    { id: "cr-glue", targetWord: "Glue", targetEmoji: "🛁", spokenPrompt: "What rhymes with Glue?", correctWord: "Blue", options: [{ word: "Blue", emoji: "🔵", isCorrect: true }, { word: "Paint", emoji: "🎨", isCorrect: false }, { word: "Cut", emoji: "✂️", isCorrect: false }] },
    { id: "cr-drum", targetWord: "Drum", targetEmoji: "🥁", spokenPrompt: "What rhymes with Drum in the music garden?", correctWord: "Hum", options: [{ word: "Hum", emoji: "🎶", isCorrect: true }, { word: "Brush", emoji: "🖌️", isCorrect: false }, { word: "Bead", emoji: "💜", isCorrect: false }] },
    { id: "cr-art", targetWord: "Art", targetEmoji: "🖼️", spokenPrompt: "What rhymes with Art at the easel?", correctWord: "Cart", options: [{ word: "Cart", emoji: "🛒", isCorrect: true }, { word: "Glue", emoji: "🛁", isCorrect: false }, { word: "Star", emoji: "🌟", isCorrect: false }] },
    { id: "cr-note", targetWord: "Note", targetEmoji: "🎵", spokenPrompt: "What rhymes with Note?", correctWord: "Boat", options: [{ word: "Boat", emoji: "⛵", isCorrect: true }, { word: "Drum", emoji: "🥁", isCorrect: false }, { word: "Paint", emoji: "🎨", isCorrect: false }] },
    { id: "cr-star", targetWord: "Star", targetEmoji: "🌟", spokenPrompt: "What rhymes with Star sticker?", correctWord: "Car", options: [{ word: "Car", emoji: "🚗", isCorrect: true }, { word: "Bead", emoji: "💜", isCorrect: false }, { word: "Song", emoji: "🎵", isCorrect: false }] },

    { id: "cr-red", targetWord: "Red", targetEmoji: "🔴", spokenPrompt: "What rhymes with Red on the palette?", correctWord: "Bed", options: [{ word: "Bed", emoji: "🛏️", isCorrect: true }, { word: "Paint", emoji: "🎨", isCorrect: false }, { word: "Bead", emoji: "📿", isCorrect: false }] },
    { id: "cr-glue2", targetWord: "Blue", targetEmoji: "🔵", spokenPrompt: "What rhymes with Blue in the studio?", correctWord: "Glue", options: [{ word: "Glue", emoji: "🛁", isCorrect: true }, { word: "Song", emoji: "🎵", isCorrect: false }, { word: "Drum", emoji: "🥁", isCorrect: false }] },
    { id: "cr-clay", targetWord: "Clay", targetEmoji: "🏠", spokenPrompt: "What rhymes with Clay on the bench?", correctWord: "Play", options: [{ word: "Play", emoji: "🎮", isCorrect: true }, { word: "Art", emoji: "🎨", isCorrect: false }, { word: "Note", emoji: "🎵", isCorrect: false }] },
    { id: "cr-mark", targetWord: "Mark", targetEmoji: "🖍️", spokenPrompt: "What rhymes with Mark from the crayon?", correctWord: "Park", options: [{ word: "Park", emoji: "🌳", isCorrect: true }, { word: "Star", emoji: "⭐", isCorrect: false }, { word: "Bead", emoji: "📿", isCorrect: false }] },
    { id: "cr-dot", targetWord: "Dot", targetEmoji: "💜", spokenPrompt: "What rhymes with Dot of paint?", correctWord: "Spot", options: [{ word: "Spot", emoji: "🐞", isCorrect: true }, { word: "Drum", emoji: "🥁", isCorrect: false }, { word: "Glue", emoji: "🛁", isCorrect: false }] },
    { id: "cr-tune", targetWord: "Tune", targetEmoji: "🎶", spokenPrompt: "What rhymes with Tune in the garden?", correctWord: "Moon", options: [{ word: "Moon", emoji: "🌙", isCorrect: true }, { word: "Paint", emoji: "🎨", isCorrect: false }, { word: "Art", emoji: "🖼️", isCorrect: false }] },
    { id: "cr-clip", targetWord: "Clip", targetEmoji: "📎", spokenPrompt: "What rhymes with Clip on the paper?", correctWord: "Ship", options: [{ word: "Ship", emoji: "🚢", isCorrect: true }, { word: "Song", emoji: "🎵", isCorrect: false }, { word: "Bead", emoji: "📿", isCorrect: false }] },
    { id: "cr-fold", targetWord: "Fold", targetEmoji: "📄", spokenPrompt: "What rhymes with Fold in the atelier?", correctWord: "Gold", options: [{ word: "Gold", emoji: "🥇", isCorrect: true }, { word: "Note", emoji: "🎵", isCorrect: false }, { word: "Star", emoji: "⭐", isCorrect: false }] },
  ],
  "story-world": [
    { id: "s-book", targetWord: "Book", targetEmoji: "📖", spokenPrompt: "What rhymes with Book in the tale?", correctWord: "Look", options: [{ word: "Look", emoji: "👀", isCorrect: true }, { word: "Hen", emoji: "🐔", isCorrect: false }, { word: "Crown", emoji: "👑", isCorrect: false }] },
    { id: "s-tale", targetWord: "Tale", targetEmoji: "📜", spokenPrompt: "What rhymes with Tale?", correctWord: "Sail", options: [{ word: "Sail", emoji: "⛵", isCorrect: true }, { word: "King", emoji: "👑", isCorrect: false }, { word: "Page", emoji: "📄", isCorrect: false }] },
    { id: "s-king", targetWord: "King", targetEmoji: "👑", spokenPrompt: "What rhymes with King?", correctWord: "Ring", options: [{ word: "Ring", emoji: "💍", isCorrect: true }, { word: "Book", emoji: "📘", isCorrect: false }, { word: "Boat", emoji: "⛵", isCorrect: false }] },
    { id: "s-hen", targetWord: "Hen", targetEmoji: "🐔", spokenPrompt: "What rhymes with Hen in the barnyard tale?", correctWord: "Pen", options: [{ word: "Pen", emoji: "✏️", isCorrect: true }, { word: "Egg", emoji: "🥚", isCorrect: false }, { word: "Crown", emoji: "👑", isCorrect: false }] },
    { id: "s-page", targetWord: "Page", targetEmoji: "📄", spokenPrompt: "What rhymes with Page in the story book?", correctWord: "Cage", options: [{ word: "Cage", emoji: "🐦", isCorrect: true }, { word: "King", emoji: "👑", isCorrect: false }, { word: "Boat", emoji: "⛵", isCorrect: false }] },
    { id: "s-boat", targetWord: "Boat", targetEmoji: "⛵", spokenPrompt: "What rhymes with Boat in the sea chapter?", correctWord: "Coat", options: [{ word: "Coat", emoji: "👕", isCorrect: true }, { word: "Hen", emoji: "🐔", isCorrect: false }, { word: "Star", emoji: "⭐", isCorrect: false }] },
    { id: "s-crown", targetWord: "Crown", targetEmoji: "👑", spokenPrompt: "What rhymes with Crown?", correctWord: "Down", options: [{ word: "Down", emoji: "⬇️", isCorrect: true }, { word: "Book", emoji: "📖", isCorrect: false }, { word: "Dragon", emoji: "🐉", isCorrect: false }] },
    { id: "s-star", targetWord: "Star", targetEmoji: "⭐", spokenPrompt: "What rhymes with Star on the last page?", correctWord: "Far", options: [{ word: "Far", emoji: "🔭", isCorrect: true }, { word: "Castle", emoji: "🏰", isCorrect: false }, { word: "Hen", emoji: "🐔", isCorrect: false }] },

    { id: "s-once", targetWord: "Once", targetEmoji: "1️⃣", spokenPrompt: "What rhymes with Once at the start?", correctWord: "Dunce", options: [{ word: "Dunce", emoji: "🎓", isCorrect: true }, { word: "Hen", emoji: "🐔", isCorrect: false }, { word: "King", emoji: "👑", isCorrect: false }] },
    { id: "s-end", targetWord: "End", targetEmoji: "🏁", spokenPrompt: "What rhymes with End of the tale?", correctWord: "Friend", options: [{ word: "Friend", emoji: "🤝", isCorrect: true }, { word: "Book", emoji: "📘", isCorrect: false }, { word: "Boat", emoji: "⛵", isCorrect: false }] },
    { id: "s-fox", targetWord: "Fox", targetEmoji: "🦊", spokenPrompt: "What rhymes with Fox in the tale barn?", correctWord: "Box", options: [{ word: "Box", emoji: "📦", isCorrect: true }, { word: "Crown", emoji: "👑", isCorrect: false }, { word: "Page", emoji: "📄", isCorrect: false }] },
    { id: "s-moon", targetWord: "Moon", targetEmoji: "🌙", spokenPrompt: "What rhymes with Moon in the space tale?", correctWord: "Spoon", options: [{ word: "Spoon", emoji: "🥄", isCorrect: true }, { word: "Star", emoji: "⭐", isCorrect: false }, { word: "King", emoji: "👑", isCorrect: false }] },
    { id: "s-wave", targetWord: "Wave", targetEmoji: "🌊", spokenPrompt: "What rhymes with Wave in the deep sea?", correctWord: "Cave", options: [{ word: "Cave", emoji: "🕳️", isCorrect: true }, { word: "Boat", emoji: "⛵", isCorrect: false }, { word: "Hen", emoji: "🐔", isCorrect: false }] },
    { id: "s-knight", targetWord: "Knight", targetEmoji: "🛡️", spokenPrompt: "What rhymes with Knight in the story?", correctWord: "Night", options: [{ word: "Night", emoji: "🌃", isCorrect: true }, { word: "Book", emoji: "📘", isCorrect: false }, { word: "Tale", emoji: "📖", isCorrect: false }] },
    { id: "s-wish", targetWord: "Wish", targetEmoji: "🌟", spokenPrompt: "What rhymes with Wish on the porch?", correctWord: "Fish", options: [{ word: "Fish", emoji: "🐟", isCorrect: true }, { word: "Page", emoji: "📄", isCorrect: false }, { word: "Crown", emoji: "👑", isCorrect: false }] },
    { id: "s-told", targetWord: "Told", targetEmoji: "🗣️", spokenPrompt: "What rhymes with Told at the end?", correctWord: "Gold", options: [{ word: "Gold", emoji: "🥇", isCorrect: true }, { word: "Star", emoji: "⭐", isCorrect: false }, { word: "Hen", emoji: "🐔", isCorrect: false }] },
  ],
  "my-world": [
    { id: "m-hug", targetWord: "Hug", targetEmoji: "🤗", spokenPrompt: "What rhymes with Hug at home?", correctWord: "Bug", options: [{ word: "Bug", emoji: "🐞", isCorrect: true }, { word: "Home", emoji: "🏠", isCorrect: false }, { word: "Soap", emoji: "🛁", isCorrect: false }] },
    { id: "m-bed", targetWord: "Bed", targetEmoji: "🛏️", spokenPrompt: "What rhymes with Bed?", correctWord: "Red", options: [{ word: "Red", emoji: "🔴", isCorrect: true }, { word: "Brush", emoji: "😁", isCorrect: false }, { word: "Hug", emoji: "🤗", isCorrect: false }] },
    { id: "m-home", targetWord: "Home", targetEmoji: "🏠", spokenPrompt: "What rhymes with Home?", correctWord: "Comb", options: [{ word: "Comb", emoji: "💇", isCorrect: true }, { word: "Door", emoji: "🚪", isCorrect: false }, { word: "Smile", emoji: "😊", isCorrect: false }] },
    { id: "m-heart", targetWord: "Heart", targetEmoji: "❤️", spokenPrompt: "What rhymes with Heart?", correctWord: "Start", options: [{ word: "Start", emoji: "🚦", isCorrect: true }, { word: "Hug", emoji: "🤗", isCorrect: false }, { word: "Cup", emoji: "🥤", isCorrect: false }] },
    { id: "m-soap", targetWord: "Soap", targetEmoji: "🛁", spokenPrompt: "What rhymes with Soap at the sink?", correctWord: "Rope", options: [{ word: "Rope", emoji: "➰", isCorrect: true }, { word: "Brush", emoji: "😁", isCorrect: false }, { word: "Bed", emoji: "🛏️", isCorrect: false }] },
    { id: "m-cup", targetWord: "Cup", targetEmoji: "🥛", spokenPrompt: "What rhymes with Cup on the table?", correctWord: "Up", options: [{ word: "Up", emoji: "⬆️", isCorrect: true }, { word: "Soap", emoji: "🛁", isCorrect: false }, { word: "Home", emoji: "🏠", isCorrect: false }] },
    { id: "m-brush", targetWord: "Brush", targetEmoji: "😁", spokenPrompt: "What rhymes with Brush for teeth?", correctWord: "Hush", options: [{ word: "Hush", emoji: "🤫", isCorrect: true }, { word: "Smile", emoji: "😊", isCorrect: false }, { word: "Door", emoji: "🚪", isCorrect: false }] },
    { id: "m-door", targetWord: "Door", targetEmoji: "🚪", spokenPrompt: "What rhymes with Door at home?", correctWord: "Four", options: [{ word: "Four", emoji: "4️⃣", isCorrect: true }, { word: "Cup", emoji: "🥤", isCorrect: false }, { word: "Hug", emoji: "🤗", isCorrect: false }] },

    { id: "m-hand", targetWord: "Hand", targetEmoji: "✋", spokenPrompt: "What rhymes with Hand for a hug?", correctWord: "Sand", options: [{ word: "Sand", emoji: "🏖️", isCorrect: true }, { word: "Bed", emoji: "🛏️", isCorrect: false }, { word: "Cup", emoji: "🥤", isCorrect: false }] },
    { id: "m-wash", targetWord: "Wash", targetEmoji: "🛁", spokenPrompt: "What rhymes with Wash at the sink?", correctWord: "Squash", options: [{ word: "Squash", emoji: "🎃", isCorrect: true }, { word: "Soap", emoji: "🛁", isCorrect: false }, { word: "Door", emoji: "🚪", isCorrect: false }] },
    { id: "m-tooth", targetWord: "Tooth", targetEmoji: "😁", spokenPrompt: "What rhymes with Tooth at brush time?", correctWord: "Booth", options: [{ word: "Booth", emoji: "📞", isCorrect: true }, { word: "Brush", emoji: "😁", isCorrect: false }, { word: "Home", emoji: "🏠", isCorrect: false }] },
    { id: "m-kind", targetWord: "Kind", targetEmoji: "💗", spokenPrompt: "What rhymes with Kind at the table?", correctWord: "Find", options: [{ word: "Find", emoji: "🔍", isCorrect: true }, { word: "Heart", emoji: "❤️", isCorrect: false }, { word: "Hug", emoji: "🤗", isCorrect: false }] },
    { id: "m-share", targetWord: "Share", targetEmoji: "🍪", spokenPrompt: "What rhymes with Share with a friend?", correctWord: "Care", options: [{ word: "Care", emoji: "💝", isCorrect: true }, { word: "Cup", emoji: "🥤", isCorrect: false }, { word: "Soap", emoji: "🛁", isCorrect: false }] },
    { id: "m-rest", targetWord: "Rest", targetEmoji: "😴", spokenPrompt: "What rhymes with Rest after play?", correctWord: "Best", options: [{ word: "Best", emoji: "🥇", isCorrect: true }, { word: "Bed", emoji: "🛏️", isCorrect: false }, { word: "Door", emoji: "🚪", isCorrect: false }] },
    { id: "m-name", targetWord: "Name", targetEmoji: "🏷️", spokenPrompt: "What rhymes with Name of a feeling?", correctWord: "Same", options: [{ word: "Same", emoji: "🔁", isCorrect: true }, { word: "Hug", emoji: "🤗", isCorrect: false }, { word: "Brush", emoji: "😁", isCorrect: false }] },
    { id: "m-play", targetWord: "Play", targetEmoji: "🎲", spokenPrompt: "What rhymes with Play at home?", correctWord: "Day", options: [{ word: "Day", emoji: "☀️", isCorrect: true }, { word: "Home", emoji: "🏠", isCorrect: false }, { word: "Soap", emoji: "🛁", isCorrect: false }] },
  ],
  "adventure-world": [
    { id: "ad-map", targetWord: "Map", targetEmoji: "🗺️", spokenPrompt: "What rhymes with Map on the trail?", correctWord: "Tap", options: [{ word: "Tap", emoji: "👆", isCorrect: true }, { word: "Pine", emoji: "🌲", isCorrect: false }, { word: "Gem", emoji: "💎", isCorrect: false }] },
    { id: "ad-rain", targetWord: "Rain", targetEmoji: "☔", spokenPrompt: "What rhymes with Rain?", correctWord: "Train", options: [{ word: "Train", emoji: "🚂", isCorrect: true }, { word: "Tree", emoji: "🌲", isCorrect: false }, { word: "Mud", emoji: "📦", isCorrect: false }] },
    { id: "ad-tree", targetWord: "Tree", targetEmoji: "🌲", spokenPrompt: "What rhymes with Tree in the forest?", correctWord: "Bee", options: [{ word: "Bee", emoji: "🐝", isCorrect: true }, { word: "Map", emoji: "🗺️", isCorrect: false }, { word: "Rock", emoji: "⛰️", isCorrect: false }] },
    { id: "ad-cave", targetWord: "Cave", targetEmoji: "🕳️", spokenPrompt: "What rhymes with Cave?", correctWord: "Wave", options: [{ word: "Wave", emoji: "🌊", isCorrect: true }, { word: "Gem", emoji: "💎", isCorrect: false }, { word: "Path", emoji: "🛤️", isCorrect: false }] },
    { id: "ad-boot", targetWord: "Boot", targetEmoji: "👢", spokenPrompt: "What rhymes with Boot on the trail?", correctWord: "Hoot", options: [{ word: "Hoot", emoji: "🦉", isCorrect: true }, { word: "Pine", emoji: "🌲", isCorrect: false }, { word: "Map", emoji: "🗺️", isCorrect: false }] },
    { id: "ad-gem", targetWord: "Gem", targetEmoji: "💎", spokenPrompt: "What rhymes with Gem in the cave?", correctWord: "Stem", options: [{ word: "Stem", emoji: "🌱", isCorrect: true }, { word: "Rock", emoji: "⛰️", isCorrect: false }, { word: "Rain", emoji: "☔", isCorrect: false }] },
    { id: "ad-path", targetWord: "Path", targetEmoji: "🛤️", spokenPrompt: "What rhymes with Path between the pines?", correctWord: "Bath", options: [{ word: "Bath", emoji: "🛁", isCorrect: true }, { word: "Fox", emoji: "🦊", isCorrect: false }, { word: "Cave", emoji: "🕳️", isCorrect: false }] },
    { id: "ad-rock", targetWord: "Rock", targetEmoji: "⛰️", spokenPrompt: "What rhymes with Rock on the trail?", correctWord: "Sock", options: [{ word: "Sock", emoji: "👟", isCorrect: true }, { word: "Tree", emoji: "🌲", isCorrect: false }, { word: "Gem", emoji: "💎", isCorrect: false }] },

    { id: "ad-hill", targetWord: "Hill", targetEmoji: "⛰️", spokenPrompt: "What rhymes with Hill on the trail?", correctWord: "Still", options: [{ word: "Still", emoji: "😌", isCorrect: true }, { word: "Map", emoji: "🗺️", isCorrect: false }, { word: "Gem", emoji: "💎", isCorrect: false }] },
    { id: "ad-pack", targetWord: "Pack", targetEmoji: "🎒", spokenPrompt: "What rhymes with Pack for the quest?", correctWord: "Track", options: [{ word: "Track", emoji: "🐾", isCorrect: true }, { word: "Rain", emoji: "🌧️", isCorrect: false }, { word: "Cave", emoji: "🕳️", isCorrect: false }] },
    { id: "ad-star", targetWord: "Star", targetEmoji: "⭐", spokenPrompt: "What rhymes with Star on the blast?", correctWord: "Far", options: [{ word: "Far", emoji: "🔭", isCorrect: true }, { word: "Tree", emoji: "🌲", isCorrect: false }, { word: "Gem", emoji: "💎", isCorrect: false }] },
    { id: "ad-moon", targetWord: "Moon", targetEmoji: "🌕", spokenPrompt: "What rhymes with Moon at blastoff?", correctWord: "Soon", options: [{ word: "Soon", emoji: "⏳", isCorrect: true }, { word: "Map", emoji: "🗺️", isCorrect: false }, { word: "Boot", emoji: "👢", isCorrect: false }] },
    { id: "ad-quest", targetWord: "Quest", targetEmoji: "🗺️", spokenPrompt: "What rhymes with Quest for treasure?", correctWord: "Nest", options: [{ word: "Nest", emoji: "🐦", isCorrect: true }, { word: "Gem", emoji: "💎", isCorrect: false }, { word: "Path", emoji: "🛤️", isCorrect: false }] },
    { id: "ad-storm", targetWord: "Storm", targetEmoji: "⛈️", spokenPrompt: "What rhymes with Storm on the hill?", correctWord: "Warm", options: [{ word: "Warm", emoji: "🔥", isCorrect: true }, { word: "Rain", emoji: "🌧️", isCorrect: false }, { word: "Tree", emoji: "🌲", isCorrect: false }] },
    { id: "ad-rope", targetWord: "Rope", targetEmoji: "➰", spokenPrompt: "What rhymes with Rope on the trail?", correctWord: "Hope", options: [{ word: "Hope", emoji: "🌟", isCorrect: true }, { word: "Cave", emoji: "🕳️", isCorrect: false }, { word: "Rock", emoji: "⛰️", isCorrect: false }] },
    { id: "ad-flag", targetWord: "Flag", targetEmoji: "🚩", spokenPrompt: "What rhymes with Flag on the peak?", correctWord: "Bag", options: [{ word: "Bag", emoji: "👜", isCorrect: true }, { word: "Map", emoji: "🗺️", isCorrect: false }, { word: "Gem", emoji: "💎", isCorrect: false }] },
  ],
};

const defaultBubbles: BubbleWord[] = [
  { letter: "A", word: "Apple", emoji: "🍎", sound: "A says /æ/! Apple!" },
  { letter: "B", word: "Bear", emoji: "🐻", sound: "B says /b/! Bear!" },
  { letter: "C", word: "Cat", emoji: "🐱", sound: "C says /k/! Cat!" },
  { letter: "D", word: "Dolphin", emoji: "🐬", sound: "D says /d/! Dolphin!" },
  { letter: "M", word: "Moon", emoji: "🌙", sound: "M says /m/! Moon!" },
  { letter: "S", word: "Sun", emoji: "☀️", sound: "S says /s/! Sun!" },
  { letter: "T", word: "Tiger", emoji: "🐯", sound: "T says /t/! Tiger!" },
  { letter: "P", word: "Puppy", emoji: "🐶", sound: "P says /p/! Puppy!" },
  { letter: "F", word: "Fish", emoji: "🐟", sound: "F says /f/! Fish!" },
  { letter: "H", word: "Hat", emoji: "🎩", sound: "H says /h/! Hat!" },
  { letter: "N", word: "Nest", emoji: "🐦", sound: "N says /n/! Nest!" },
  { letter: "R", word: "Rain", emoji: "🌧️", sound: "R says /r/! Rain!" },
];

const BUBBLES_BY_WORLD: Record<string, BubbleWord[]> = {
  "arctic-world": [
    { letter: "I", word: "Ice", emoji: "❄️", sound: "I says /i/! Ice!" },
    { letter: "P", word: "Penguin", emoji: "🐧", sound: "P says /p/! Penguin!" },
    { letter: "S", word: "Seal", emoji: "🐬", sound: "S says /s/! Seal!" },
    { letter: "N", word: "North", emoji: "🗺️", sound: "N says /n/! North!" },
    { letter: "W", word: "Whale", emoji: "🐋", sound: "W says /w/! Whale!" },
    { letter: "F", word: "Fox", emoji: "🦊", sound: "F says /f/! Fox!" },
    { letter: "O", word: "Owl", emoji: "🦉", sound: "O says /o/! Owl!" },
    { letter: "C", word: "Cold", emoji: "❄️", sound: "C says /k/! Cold!" },
    { letter: "B", word: "Bear", emoji: "🐻", sound: "B says /b/! Bear!" },
    { letter: "L", word: "Lights", emoji: "🌌", sound: "L says /l/! Lights!" },
    { letter: "H", word: "Huddle", emoji: "🐧", sound: "H says /h/! Huddle!" },
    { letter: "D", word: "Den", emoji: "🏠", sound: "D says /d/! Den!" },
  ],
  "kitchen-world": [
    { letter: "A", word: "Apple", emoji: "🍎", sound: "A says /æ/! Apple!" },
    { letter: "B", word: "Bread", emoji: "🍞", sound: "B says /b/! Bread!" },
    { letter: "S", word: "Soup", emoji: "🍲", sound: "S says /s/! Soup!" },
    { letter: "M", word: "Milk", emoji: "🥛", sound: "M says /m/! Milk!" },
    { letter: "P", word: "Pear", emoji: "🍐", sound: "P says /p/! Pear!" },
    { letter: "C", word: "Corn", emoji: "🌽", sound: "C says /k/! Corn!" },
    { letter: "T", word: "Tea", emoji: "🍵", sound: "T says /t/! Tea!" },
    { letter: "J", word: "Jam", emoji: "🍯", sound: "J says /j/! Jam!" },
    { letter: "O", word: "Oven", emoji: "🔥", sound: "O says /ɒ/! Oven!" },
    { letter: "K", word: "Kettle", emoji: "☕", sound: "K says /k/! Kettle!" },
    { letter: "F", word: "Flour", emoji: "🌾", sound: "F says /f/! Flour!" },
    { letter: "N", word: "Noodle", emoji: "🍜", sound: "N says /n/! Noodle!" },
  ],
  "vehicle-world": [
    { letter: "B", word: "Bus", emoji: "🚌", sound: "B says /b/! Bus!" },
    { letter: "C", word: "Car", emoji: "🚗", sound: "C says /k/! Car!" },
    { letter: "P", word: "Plane", emoji: "✈️", sound: "P says /p/! Plane!" },
    { letter: "T", word: "Train", emoji: "🚂", sound: "T says /t/! Train!" },
    { letter: "V", word: "Van", emoji: "🚐", sound: "V says /v/! Van!" },
    { letter: "S", word: "Ship", emoji: "🚢", sound: "S says /s/! Ship!" },
    { letter: "R", word: "Road", emoji: "🛣️", sound: "R says /r/! Road!" },
    { letter: "A", word: "Airport", emoji: "🛫", sound: "A says /æ/! Airport!" },
    { letter: "H", word: "Horn", emoji: "📯", sound: "H says /h/! Horn!" },
    { letter: "W", word: "Wheel", emoji: "🚗", sound: "W says /w/! Wheel!" },
    { letter: "G", word: "Go", emoji: "💚", sound: "G says /g/! Go!" },
    { letter: "L", word: "Lights", emoji: "🚦", sound: "L says /l/! Lights!" },
  ],
  "night-world": [
    { letter: "N", word: "Night", emoji: "🌃", sound: "N says /n/! Night!" },
    { letter: "M", word: "Moon", emoji: "🌙", sound: "M says /m/! Moon!" },
    { letter: "S", word: "Star", emoji: "⭐", sound: "S says /s/! Star!" },
    { letter: "O", word: "Owl", emoji: "🦉", sound: "O says /o/! Owl!" },
    { letter: "L", word: "Lamp", emoji: "💡", sound: "L says /l/! Lamp!" },
    { letter: "B", word: "Bed", emoji: "🛏️", sound: "B says /b/! Bed!" },
    { letter: "W", word: "Wood", emoji: "🌲", sound: "W says /w/! Wood!" },
    { letter: "T", word: "Quiet", emoji: "🤫", sound: "Tiptoe time!" },
    { letter: "Q", word: "Quilt", emoji: "🛏️", sound: "Q says /kw/! Quilt!" },
    { letter: "H", word: "Hush", emoji: "🤫", sound: "H says /h/! Hush!" },
    { letter: "D", word: "Dream", emoji: "💭", sound: "D says /d/! Dream!" },
    { letter: "Y", word: "Yawn", emoji: "🥱", sound: "Y says /j/! Yawn!" },
  ],
  "animal-world": [
    { letter: "C", word: "Cow", emoji: "🐄", sound: "C says /k/! Cow!" },
    { letter: "P", word: "Pig", emoji: "🐷", sound: "P says /p/! Pig!" },
    { letter: "H", word: "Horse", emoji: "🐴", sound: "H says /h/! Horse!" },
    { letter: "D", word: "Duck", emoji: "🦆", sound: "D says /d/! Duck!" },
    { letter: "L", word: "Lion", emoji: "🦁", sound: "L says /l/! Lion!" },
    { letter: "M", word: "Monkey", emoji: "🐵", sound: "M says /m/! Monkey!" },
    { letter: "S", word: "Sheep", emoji: "🐑", sound: "S says /s/! Sheep!" },
    { letter: "F", word: "Frog", emoji: "🐸", sound: "F says /f/! Frog!" },
    { letter: "G", word: "Goat", emoji: "🐐", sound: "G says /g/! Goat!" },
    { letter: "W", word: "Wool", emoji: "🎀", sound: "W says /w/! Wool!" },
    { letter: "B", word: "Barn", emoji: "🏚️", sound: "B says /b/! Barn!" },
    { letter: "R", word: "Rooster", emoji: "🐓", sound: "R says /r/! Rooster!" },
  ],
  "bug-world": [
    { letter: "B", word: "Bee", emoji: "🐝", sound: "B says /b/! Bee!" },
    { letter: "A", word: "Ant", emoji: "🐜", sound: "A says /æ/! Ant!" },
    { letter: "L", word: "Ladybug", emoji: "🐞", sound: "L says /l/! Ladybug!" },
    { letter: "W", word: "Worm", emoji: "🐛", sound: "W says /w/! Worm!" },
    { letter: "S", word: "Snail", emoji: "🐌", sound: "S says /s/! Snail!" },
    { letter: "C", word: "Caterpillar", emoji: "🐛", sound: "C says /k/! Caterpillar!" },
    { letter: "F", word: "Fly", emoji: "🐝", sound: "F says /f/! Fly!" },
    { letter: "M", word: "Moth", emoji: "🦋", sound: "M says /m/! Moth!" },
    { letter: "G", word: "Grass", emoji: "🌱", sound: "G says /g/! Grass!" },
    { letter: "D", word: "Dew", emoji: "💧", sound: "D says /d/! Dew!" },
    { letter: "H", word: "Hive", emoji: "🍯", sound: "H says /h/! Hive!" },
    { letter: "P", word: "Pollen", emoji: "🌼", sound: "P says /p/! Pollen!" },
  ],
  "city-world": [
    { letter: "P", word: "Park", emoji: "🌳", sound: "P says /p/! Park!" },
    { letter: "B", word: "Bus", emoji: "🚌", sound: "B says /b/! Bus!" },
    { letter: "T", word: "Town", emoji: "🏘️", sound: "T says /t/! Town!" },
    { letter: "L", word: "Lamp", emoji: "🏮", sound: "L says /l/! Lamp!" },
    { letter: "M", word: "Market", emoji: "🛍️", sound: "M says /m/! Market!" },
    { letter: "S", word: "Shop", emoji: "🏪", sound: "S says /s/! Shop!" },
    { letter: "F", word: "Fire", emoji: "🚒", sound: "F says /f/! Fire engine!" },
    { letter: "C", word: "Clock", emoji: "🕰️", sound: "C says /k/! Clock!" },
    { letter: "K", word: "Kiosk", emoji: "🏪", sound: "K says /k/! Kiosk!" },
    { letter: "H", word: "Horn", emoji: "📯", sound: "H says /h/! Horn!" },
    { letter: "R", word: "Road", emoji: "🛣️", sound: "R says /r/! Road!" },
    { letter: "N", word: "News", emoji: "📰", sound: "N says /n/! News!" },
  ],
  "creative-world": [
    { letter: "P", word: "Paint", emoji: "🎨", sound: "P says /p/! Paint!" },
    { letter: "B", word: "Bead", emoji: "💜", sound: "B says /b/! Bead!" },
    { letter: "S", word: "Song", emoji: "🎵", sound: "S says /s/! Song!" },
    { letter: "C", word: "Color", emoji: "🌈", sound: "C says /k/! Color!" },
    { letter: "H", word: "Heart", emoji: "💖", sound: "H says /h/! Heart!" },
    { letter: "D", word: "Drum", emoji: "🥁", sound: "D says /d/! Drum!" },
    { letter: "N", word: "Note", emoji: "🎶", sound: "N says /n/! Note!" },
    { letter: "A", word: "Art", emoji: "🖼️", sound: "A says /ɑ/! Art!" },
    { letter: "G", word: "Glue", emoji: "🛁", sound: "G says /g/! Glue!" },
    { letter: "R", word: "Red", emoji: "🔴", sound: "R says /r/! Red!" },
    { letter: "E", word: "Easel", emoji: "🖼️", sound: "E says /iː/! Easel!" },
    { letter: "I", word: "Ink", emoji: "🖋️", sound: "I says /ɪ/! Ink!" },
  ],
  "story-world": [
    { letter: "B", word: "Book", emoji: "📖", sound: "B says /b/! Book!" },
    { letter: "T", word: "Tale", emoji: "📜", sound: "T says /t/! Tale!" },
    { letter: "S", word: "Story", emoji: "📚", sound: "S says /s/! Story!" },
    { letter: "H", word: "Hen", emoji: "🐔", sound: "H says /h/! Hen!" },
    { letter: "C", word: "Crown", emoji: "👑", sound: "C says /k/! Crown!" },
    { letter: "K", word: "King", emoji: "🤴", sound: "K says /k/! King!" },
    { letter: "P", word: "Page", emoji: "📄", sound: "P says /p/! Page!" },
    { letter: "R", word: "Read", emoji: "👀", sound: "R says /r/! Read!" },
    { letter: "G", word: "Dragon", emoji: "🐉", sound: "G says /g/! Dragon!" },
    { letter: "L", word: "Look", emoji: "👀", sound: "L says /l/! Look!" },
    { letter: "N", word: "Nest", emoji: "🐦", sound: "N says /n/! Nest!" },
    { letter: "D", word: "Castle", emoji: "🏰", sound: "D is for a grand old castle door!" },
  ],
  "my-world": [
    { letter: "H", word: "Home", emoji: "🏠", sound: "H says /h/! Home!" },
    { letter: "B", word: "Brush", emoji: "😁", sound: "B says /b/! Brush!" },
    { letter: "S", word: "Smile", emoji: "😊", sound: "S says /s/! Smile!" },
    { letter: "M", word: "Mum", emoji: "👩", sound: "M says /m/! Mum!" },
    { letter: "T", word: "Teeth", emoji: "😁", sound: "T says /t/! Teeth!" },
    { letter: "F", word: "Family", emoji: "👨‍👩‍👧", sound: "F says /f/! Family!" },
    { letter: "C", word: "Cup", emoji: "🥤", sound: "C says /k/! Cup!" },
    { letter: "L", word: "Love", emoji: "❤️", sound: "L says /l/! Love!" },
    { letter: "D", word: "Door", emoji: "🚪", sound: "D says /d/! Door!" },
    { letter: "P", word: "Pillow", emoji: "🛏️", sound: "P says /p/! Pillow!" },
    { letter: "K", word: "Kiss", emoji: "😘", sound: "K says /k/! Kiss!" },
    { letter: "N", word: "Nap", emoji: "😴", sound: "N says /n/! Nap!" },
  ],
  "adventure-world": [
    { letter: "M", word: "Map", emoji: "🗺️", sound: "M says /m/! Map!" },
    { letter: "T", word: "Trail", emoji: "👢", sound: "T says /t/! Trail!" },
    { letter: "R", word: "Rocket", emoji: "🚀", sound: "R says /r/! Rocket!" },
    { letter: "P", word: "Pine", emoji: "🌲", sound: "P says /p/! Pine!" },
    { letter: "G", word: "Gem", emoji: "💎", sound: "G says /g/! Gem!" },
    { letter: "C", word: "Cave", emoji: "🕳️", sound: "C says /k/! Cave!" },
    { letter: "S", word: "Star", emoji: "⭐", sound: "S says /s/! Star!" },
    { letter: "F", word: "Forest", emoji: "🌳", sound: "F says /f/! Forest!" },
    { letter: "B", word: "Boot", emoji: "👢", sound: "B says /b/! Boot!" },
    { letter: "L", word: "Leaf", emoji: "🍃", sound: "L says /l/! Leaf!" },
    { letter: "H", word: "Hill", emoji: "⛰️", sound: "H says /h/! Hill!" },
    { letter: "K", word: "Key", emoji: "🔑", sound: "K says /k/! Key!" },
  ],
  "learning-world": [
    { letter: "A", word: "A", emoji: "🅰️", sound: "A says /æ/! Letter A!" },
    { letter: "B", word: "Book", emoji: "📘", sound: "B says /b/! Book!" },
    { letter: "C", word: "Count", emoji: "🔢", sound: "C says /k/! Count!" },
    { letter: "D", word: "Dot", emoji: "🔵", sound: "D says /d/! Dot!" },
    { letter: "S", word: "Shape", emoji: "🔷", sound: "S says /s/! Shape!" },
    { letter: "T", word: "Trace", emoji: "✏️", sound: "T says /t/! Trace!" },
    { letter: "M", word: "Map", emoji: "🗺️", sound: "M says /m/! Map!" },
    { letter: "P", word: "Pen", emoji: "✏️", sound: "P says /p/! Pen!" },
    { letter: "N", word: "Nine", emoji: "9️⃣", sound: "N says /n/! Nine!" },
    { letter: "6", word: "Six", emoji: "6️⃣", sound: "Six is a number we can count!" },
    { letter: "8", word: "Eight", emoji: "8️⃣", sound: "Eight is two hands almost full!" },
    { letter: "10", word: "Ten", emoji: "🔟", sound: "Ten fills a ten-frame!" },
  ],
};

const defaultSongs = ["twinkle", "mary", "row"];

const SONGS_BY_WORLD: Record<string, string[]> = {
  "night-world": ["twinkle", "jingle"],
  "vehicle-world": ["wheels", "london", "row"],
  "animal-world": ["old-mac", "baa", "mary"],
  "kitchen-world": ["baa", "mary"],
  "arctic-world": ["jingle", "twinkle"],
  "city-world": ["london", "wheels"],
  "bug-world": ["twinkle", "mary"],
  "creative-world": ["twinkle", "row"],
  "story-world": ["baa", "mary"],
  "my-world": ["twinkle", "baa"],
  "adventure-world": ["row", "london"],
  "learning-world": ["twinkle", "mary", "baa"],
};

const defaultMix: MixFlavor = {
  orange: { title: "Magical Orange!", emoji: "🍊", phrase: "Red plus Yellow creates sparkling sweet Orange!" },
  green: { title: "Emerald Green!", emoji: "🌱", phrase: "Blue plus Yellow magically mixes into fresh Green!" },
  purple: { title: "Royal Purple!", emoji: "🍇", phrase: "Red plus Blue creates deep royal Purple!" },
};

const MIX_BY_WORLD: Record<string, MixFlavor> = {
  "kitchen-world": {
    orange: { title: "Soup Orange!", emoji: "🥕", phrase: "Red plus Yellow makes carrot soup Orange!" },
    green: { title: "Pea Green!", emoji: "🌽", phrase: "Blue plus Yellow makes garden pea Green!" },
    purple: { title: "Berry Purple!", emoji: "🍇", phrase: "Red plus Blue makes jam-jar Purple!" },
  },
  "night-world": {
    orange: { title: "Lamp Orange!", emoji: "🏮", phrase: "Red plus Yellow makes a warm night lamp!" },
    green: { title: "Firefly Green!", emoji: "✨", phrase: "Blue plus Yellow makes a firefly glow!" },
    purple: { title: "Dusk Purple!", emoji: "🌌", phrase: "Red plus Blue makes the sleepy dusk sky!" },
  },
  "arctic-world": {
    orange: { title: "Sunset Orange!", emoji: "🌅", phrase: "Red plus Yellow paints the ice sunset!" },
    green: { title: "Light Green!", emoji: "🌌", phrase: "Blue plus Yellow makes the northern lights!" },
    purple: { title: "Twilight Purple!", emoji: "💜", phrase: "Red plus Blue paints the polar dusk!" },
  },
  "vehicle-world": {
    orange: { title: "Cone Orange!", emoji: "🚧", phrase: "Red plus Yellow makes a road cone!" },
    green: { title: "Go Green!", emoji: "💚", phrase: "Blue plus Yellow means go at the lights!" },
    purple: { title: "Night Bus Purple!", emoji: "🚌", phrase: "Red plus Blue paints the evening bus!" },
  },
  "bug-world": {
    orange: { title: "Ladybug Orange!", emoji: "🐞", phrase: "Red plus Yellow paints a sunny wing!" },
    green: { title: "Leaf Green!", emoji: "🍃", phrase: "Blue plus Yellow makes a juicy leaf!" },
    purple: { title: "Flower Purple!", emoji: "💜", phrase: "Red plus Blue makes a clover bloom!" },
  },
  "creative-world": {
    orange: { title: "Paint Orange!", emoji: "🎨", phrase: "Red plus Yellow on the atelier paper!" },
    green: { title: "Bead Green!", emoji: "💚", phrase: "Blue plus Yellow strings a green bead!" },
    purple: { title: "Ink Purple!", emoji: "💜", phrase: "Red plus Blue makes royal studio ink!" },
  },
  "animal-world": {
    orange: { title: "Mane Orange!", emoji: "🦁", phrase: "Red plus Yellow paints a lion mane!" },
    green: { title: "Pasture Green!", emoji: "🐄", phrase: "Blue plus Yellow grows clover for the cow!" },
    purple: { title: "Berry Purple!", emoji: "🍇", phrase: "Red plus Blue makes a jungle berry!" },
  },
  "city-world": {
    orange: { title: "Brick Orange!", emoji: "🏠", phrase: "Red plus Yellow paints a warm brick!" },
    green: { title: "Park Green!", emoji: "🌳", phrase: "Blue plus Yellow grows the town park!" },
    purple: { title: "Dusk Purple!", emoji: "🌆", phrase: "Red plus Blue paints the evening square!" },
  },
  "story-world": {
    orange: { title: "Crown Orange!", emoji: "👑", phrase: "Red plus Yellow gilds the tale crown!" },
    green: { title: "Page Green!", emoji: "📗", phrase: "Blue plus Yellow binds a garden chapter!" },
    purple: { title: "Ink Purple!", emoji: "💜", phrase: "Red plus Blue writes the night chapter!" },
  },
  "my-world": {
    orange: { title: "Soap Orange!", emoji: "🛁", phrase: "Red plus Yellow makes a peachy wash!" },
    green: { title: "Tooth Green!", emoji: "😁", phrase: "Blue plus Yellow is minty brush foam!" },
    purple: { title: "Hug Purple!", emoji: "💜", phrase: "Red plus Blue is a bedtime hug!" },
  },
  "adventure-world": {
    orange: { title: "Camp Orange!", emoji: "🔥", phrase: "Red plus Yellow lights a trail fire!" },
    green: { title: "Pine Green!", emoji: "🌲", phrase: "Blue plus Yellow paints the forest!" },
    purple: { title: "Cave Purple!", emoji: "💜", phrase: "Red plus Blue colours the gem cave!" },
  },
  "learning-world": {
    orange: { title: "Pencil Orange!", emoji: "✏️", phrase: "Red plus Yellow sharpens a sunset pencil!" },
    green: { title: "Tick Green!", emoji: "✅", phrase: "Blue plus Yellow ticks a correct count!" },
    purple: { title: "Ink Purple!", emoji: "💜", phrase: "Red plus Blue writes a royal letter!" },
  },
};

const defaultCounting: ThemedCountItem[] = [
  { name: "Shiny Stars", emoji: "⭐", sound: "Twinkle twinkle!", bg: "from-purple-900 to-indigo-900", text: "text-amber-300" },
  { name: "Sweet Apples", emoji: "🍎", sound: "Crisp and juicy!", bg: "from-amber-900 to-red-900", text: "text-red-300" },
  { name: "Rainbow Balloons", emoji: "🎈", sound: "Pop float up!", bg: "from-violet-900 to-purple-950", text: "text-purple-200" },
  { name: "Little Dots", emoji: "🔵", sound: "Tap tap!", bg: "from-sky-900 to-blue-950", text: "text-sky-200" },
  { name: "Warm Hearts", emoji: "❤️", sound: "Beat beat!", bg: "from-rose-900 to-pink-950", text: "text-rose-200" },
];

const COUNTING_BY_WORLD: Record<string, ThemedCountItem[]> = {
  "kitchen-world": [
    { name: "Red Apples", emoji: "🍎", sound: "Crunch!", bg: "from-rose-900 to-orange-900", text: "text-rose-200" },
    { name: "Warm Buns", emoji: "🍞", sound: "Mmm bread!", bg: "from-amber-900 to-yellow-900", text: "text-amber-200" },
    { name: "Soup Spoons", emoji: "🥄", sound: "Stir stir!", bg: "from-orange-900 to-rose-900", text: "text-orange-200" },
    { name: "Milk Cups", emoji: "🥛", sound: "Sip sip!", bg: "from-slate-800 to-sky-900", text: "text-sky-100" },
    { name: "Berry Jars", emoji: "🍓", sound: "Pop the lid!", bg: "from-rose-900 to-pink-950", text: "text-rose-200" },
  ],
  "arctic-world": [
    { name: "Snowflakes", emoji: "❄️", sound: "Soft snow!", bg: "from-sky-900 to-indigo-950", text: "text-cyan-200" },
    { name: "Penguins", emoji: "🐧", sound: "Honk honk!", bg: "from-slate-900 to-sky-950", text: "text-sky-200" },
    { name: "Ice Cubes", emoji: "❄️", sound: "Clink!", bg: "from-cyan-900 to-blue-950", text: "text-cyan-100" },
    { name: "Seal Pups", emoji: "🐬", sound: "Arf arf!", bg: "from-slate-800 to-cyan-950", text: "text-cyan-100" },
    { name: "Fox Tracks", emoji: "🦊", sound: "Yip yip!", bg: "from-orange-900 to-slate-900", text: "text-orange-200" },
  ],
  "vehicle-world": [
    { name: "Yellow Buses", emoji: "🚌", sound: "Beep beep!", bg: "from-amber-900 to-yellow-900", text: "text-yellow-200" },
    { name: "Little Cars", emoji: "🚗", sound: "Vroom!", bg: "from-sky-900 to-blue-950", text: "text-sky-200" },
    { name: "Toy Planes", emoji: "✈️", sound: "Whoosh!", bg: "from-cyan-900 to-indigo-950", text: "text-cyan-200" },
    { name: "Train Cars", emoji: "🚂", sound: "Choo choo!", bg: "from-rose-900 to-red-950", text: "text-rose-200" },
    { name: "Bike Bells", emoji: "🚲", sound: "Ring ring!", bg: "from-lime-900 to-emerald-950", text: "text-lime-200" },
  ],
  "night-world": [
    { name: "Twinkle Stars", emoji: "⭐", sound: "Twinkle!", bg: "from-indigo-950 to-slate-950", text: "text-amber-200" },
    { name: "Sleepy Owls", emoji: "🦉", sound: "Hoot!", bg: "from-violet-950 to-indigo-950", text: "text-violet-200" },
    { name: "Night Lamps", emoji: "💡", sound: "Click!", bg: "from-amber-950 to-indigo-950", text: "text-yellow-200" },
    { name: "Quiet Moons", emoji: "🌙", sound: "Glow!", bg: "from-indigo-950 to-violet-950", text: "text-indigo-200" },
    { name: "Soft Socks", emoji: "👟", sound: "Flop!", bg: "from-sky-950 to-rose-950", text: "text-sky-200" },
  ],
  "bug-world": [
    { name: "Busy Bees", emoji: "🐝", sound: "Buzz!", bg: "from-yellow-900 to-lime-950", text: "text-yellow-200" },
    { name: "Ladybugs", emoji: "🐞", sound: "Crawl!", bg: "from-rose-900 to-red-950", text: "text-rose-200" },
    { name: "Garden Ants", emoji: "🐜", sound: "Tiny steps!", bg: "from-stone-900 to-lime-950", text: "text-lime-200" },
    { name: "Garden Snails", emoji: "🐌", sound: "Slide!", bg: "from-amber-900 to-lime-950", text: "text-amber-200" },
    { name: "Dew Drops", emoji: "💧", sound: "Drip!", bg: "from-cyan-900 to-emerald-950", text: "text-cyan-200" },
  ],
  "animal-world": [
    { name: "Farm Chicks", emoji: "🐤", sound: "Cheep!", bg: "from-yellow-900 to-amber-950", text: "text-yellow-200" },
    { name: "Pond Ducks", emoji: "🦆", sound: "Quack!", bg: "from-sky-900 to-cyan-950", text: "text-yellow-200" },
    { name: "Woolly Sheep", emoji: "🐑", sound: "Baaa!", bg: "from-slate-800 to-emerald-950", text: "text-slate-100" },
    { name: "Muddy Pigs", emoji: "🐷", sound: "Oink!", bg: "from-rose-900 to-pink-950", text: "text-rose-200" },
    { name: "Barn Eggs", emoji: "🥚", sound: "Cluck!", bg: "from-yellow-900 to-amber-950", text: "text-yellow-200" },
  ],
  "city-world": [
    { name: "Park Trees", emoji: "🌳", sound: "Rustle!", bg: "from-emerald-900 to-green-950", text: "text-lime-200" },
    { name: "Market Bags", emoji: "🛍️", sound: "Rustle rustle!", bg: "from-pink-900 to-fuchsia-950", text: "text-pink-200" },
    { name: "Town Bells", emoji: "🔔", sound: "Ding!", bg: "from-amber-900 to-yellow-950", text: "text-amber-200" },
    { name: "Park Benches", emoji: "🌳", sound: "Sit!", bg: "from-amber-900 to-stone-950", text: "text-amber-200" },
    { name: "Market Coins", emoji: "💰", sound: "Clink!", bg: "from-yellow-900 to-amber-950", text: "text-yellow-200" },
  ],
  "learning-world": [
    { name: "Letter Cards", emoji: "🅰️", sound: "A says /æ/!", bg: "from-rose-900 to-red-950", text: "text-rose-200" },
    { name: "Counting Dots", emoji: "🔵", sound: "Tap tap!", bg: "from-sky-900 to-blue-950", text: "text-sky-200" },
    { name: "Little Books", emoji: "📘", sound: "Flip!", bg: "from-indigo-900 to-blue-950", text: "text-indigo-200" },
    { name: "Pencils", emoji: "✏️", sound: "Scribble!", bg: "from-yellow-900 to-amber-950", text: "text-yellow-200" },
    { name: "Ten-Frames", emoji: "🔟", sound: "Ten!", bg: "from-amber-900 to-yellow-950", text: "text-amber-200" },
  ],
  "creative-world": [
    { name: "Paint Drops", emoji: "🎨", sound: "Splash colour!", bg: "from-pink-900 to-violet-950", text: "text-pink-200" },
    { name: "Stickers", emoji: "🌟", sound: "Stick!", bg: "from-amber-900 to-yellow-950", text: "text-amber-200" },
    { name: "Crayons", emoji: "🖍️", sound: "Scribble!", bg: "from-sky-900 to-indigo-950", text: "text-sky-200" },
    { name: "Studio Drums", emoji: "🥁", sound: "Boom tap!", bg: "from-amber-900 to-rose-950", text: "text-amber-200" },
    { name: "Colour Beads", emoji: "💜", sound: "Click!", bg: "from-violet-900 to-fuchsia-950", text: "text-violet-200" },
  ],
  "story-world": [
    { name: "Story Books", emoji: "📖", sound: "Once upon!", bg: "from-amber-900 to-orange-950", text: "text-amber-200" },
    { name: "Tale Stars", emoji: "✨", sound: "Sparkle!", bg: "from-violet-900 to-indigo-950", text: "text-violet-200" },
    { name: "Barn Eggs", emoji: "🥚", sound: "Crack!", bg: "from-yellow-900 to-lime-950", text: "text-yellow-200" },
    { name: "Tale Crowns", emoji: "👑", sound: "Shine!", bg: "from-yellow-900 to-violet-950", text: "text-yellow-200" },
    { name: "Story Boats", emoji: "⛵", sound: "Sail!", bg: "from-sky-900 to-cyan-950", text: "text-sky-200" },
  ],
  "my-world": [
    { name: "Family Cups", emoji: "🥛", sound: "Sip sip!", bg: "from-rose-900 to-amber-950", text: "text-rose-200" },
    { name: "Home Hearts", emoji: "❤️", sound: "Love you!", bg: "from-pink-900 to-red-950", text: "text-pink-200" },
    { name: "Toothbrushes", emoji: "😁", sound: "Brush brush!", bg: "from-cyan-900 to-sky-950", text: "text-cyan-200" },
    { name: "Soap Bars", emoji: "🛁", sound: "Scrub!", bg: "from-pink-900 to-cyan-950", text: "text-pink-200" },
    { name: "Soft Pillows", emoji: "🛏️", sound: "Yawn!", bg: "from-indigo-900 to-violet-950", text: "text-indigo-200" },
  ],
  "adventure-world": [
    { name: "Trail Stones", emoji: "⛰️", sound: "Clack!", bg: "from-stone-900 to-emerald-950", text: "text-stone-200" },
    { name: "Forest Leaves", emoji: "🍃", sound: "Rustle!", bg: "from-lime-900 to-green-950", text: "text-lime-200" },
    { name: "Treasure Coins", emoji: "💰", sound: "Clink!", bg: "from-amber-900 to-yellow-950", text: "text-amber-200" },
    { name: "Trail Boots", emoji: "👢", sound: "Thud!", bg: "from-amber-900 to-stone-950", text: "text-amber-200" },
    { name: "Cave Gems", emoji: "💎", sound: "Sparkle!", bg: "from-teal-900 to-cyan-950", text: "text-teal-200" },
  ],
};

const defaultSorting: ThemedSort = {
  title: "Land Animals vs. Ocean Swimmers",
  instruction: "Sort the animals: Who walks on land, and who swims in the water?",
  spokenPrompt: "Let's sort our animal friends! Who lives on grassy land, and who swims in the sea?",
  categoryA: { id: "land", label: "Land Animals", emoji: "🌳", dropZoneColor: "border-emerald-400 bg-emerald-950/40 text-emerald-300" },
  categoryB: { id: "ocean", label: "Ocean Swimmers", emoji: "🌊", dropZoneColor: "border-cyan-400 bg-cyan-950/40 text-cyan-300" },
  items: [
    { id: "lion", label: "Lion", emoji: "🦁", correctCategory: "A", soundFeedback: "Lions roar on the sunny savanna!" },
    { id: "whale", label: "Whale", emoji: "🐳", correctCategory: "B", soundFeedback: "Whales swim deep in the blue ocean!" },
    { id: "monkey", label: "Monkey", emoji: "🐵", correctCategory: "A", soundFeedback: "Monkeys climb tall jungle trees!" },
    { id: "dolphin", label: "Dolphin", emoji: "🐬", correctCategory: "B", soundFeedback: "Dolphins leap through ocean waves!" },
    { id: "elephant", label: "Elephant", emoji: "🐘", correctCategory: "A", soundFeedback: "Elephants walk the warm grass!" },
    { id: "fish", label: "Fish", emoji: "🐟", correctCategory: "B", soundFeedback: "Fish wink under the water!" },
    { id: "cow", label: "Cow", emoji: "🐄", correctCategory: "A", soundFeedback: "Cows munch on land clover!" },
    { id: "octopus", label: "Octopus", emoji: "🐙", correctCategory: "B", soundFeedback: "Octopus hides in the sea!" },
  ],
};

const SORTING_BY_WORLD: Record<string, ThemedSort> = {
  "kitchen-world": {
    title: "Fruit vs Kitchen Tools",
    instruction: "Put fruit in the basket. Put tools by the stove.",
    spokenPrompt: "Is it a fruit for eating, or a tool for cooking?",
    categoryA: { id: "fruit", label: "Fruit Basket", emoji: "👜", dropZoneColor: "border-rose-400 bg-rose-950/40 text-rose-300" },
    categoryB: { id: "tool", label: "Kitchen Tools", emoji: "🥄", dropZoneColor: "border-amber-400 bg-amber-950/40 text-amber-300" },
    items: [
      { id: "apple", label: "Apple", emoji: "🍎", correctCategory: "A", soundFeedback: "Apple goes in the fruit basket!" },
      { id: "spoon", label: "Spoon", emoji: "🥄", correctCategory: "B", soundFeedback: "Spoon stirs the soup!" },
      { id: "pear", label: "Pear", emoji: "🍐", correctCategory: "A", soundFeedback: "Pear is a fruit!" },
      { id: "pot", label: "Pot", emoji: "🥘", correctCategory: "B", soundFeedback: "Pot sits on the stove!" },
      { id: "berry", label: "Berry", emoji: "🍓", correctCategory: "A", soundFeedback: "Berry is a juicy fruit!" },
      { id: "whisk", label: "Whisk", emoji: "💧", correctCategory: "B", soundFeedback: "Whisk beats the batter!" },
      { id: "banana", label: "Banana", emoji: "🍌", correctCategory: "A", soundFeedback: "Banana peels for a snack!" },
      { id: "cup", label: "Measuring Cup", emoji: "🥤", correctCategory: "B", soundFeedback: "The cup measures the milk!" },
      { id: "orange", label: "Orange", emoji: "🍊", correctCategory: "A", soundFeedback: "Orange is a juicy fruit!" },
      { id: "oven", label: "Oven Mitt", emoji: "👋", correctCategory: "B", soundFeedback: "The mitt keeps hands safe!" },
      { id: "grape", label: "Grapes", emoji: "🍇", correctCategory: "A", soundFeedback: "Grapes grow in a bunch!" },
      { id: "bowl", label: "Mixing Bowl", emoji: "🥣", correctCategory: "B", soundFeedback: "The bowl holds the batter!" },
    ],
  },
  "vehicle-world": {
    title: "Sky vs Street",
    instruction: "Who flies, and who rolls on the road?",
    spokenPrompt: "Does it fly in the sky, or roll on the street?",
    categoryA: { id: "sky", label: "Sky", emoji: "✈️", dropZoneColor: "border-sky-400 bg-sky-950/40 text-sky-300" },
    categoryB: { id: "street", label: "Street", emoji: "🛣️", dropZoneColor: "border-amber-400 bg-amber-950/40 text-amber-300" },
    items: [
      { id: "plane", label: "Plane", emoji: "✈️", correctCategory: "A", soundFeedback: "The plane lifts over the town!" },
      { id: "bus", label: "Bus", emoji: "🚌", correctCategory: "B", soundFeedback: "The bus beeps on the high street!" },
      { id: "heli", label: "Helicopter", emoji: "🚁", correctCategory: "A", soundFeedback: "Chop chop in the clouds!" },
      { id: "car", label: "Car", emoji: "🚗", correctCategory: "B", soundFeedback: "The car rolls on wheels!" },
      { id: "rocket", label: "Rocket", emoji: "🚀", correctCategory: "A", soundFeedback: "Rocket climbs past the clouds!" },
      { id: "bike", label: "Bike", emoji: "🚲", correctCategory: "B", soundFeedback: "The bike pedals on the path!" },
      { id: "kite", label: "Kite", emoji: "🎈", correctCategory: "A", soundFeedback: "The kite tugs in the wind!" },
      { id: "train", label: "Train", emoji: "🚂", correctCategory: "B", soundFeedback: "The train follows the rails!" },
      { id: "cloud", label: "Cloud", emoji: "☁️", correctCategory: "A", soundFeedback: "Clouds float in the sky!" },
      { id: "truck", label: "Truck", emoji: "🚚", correctCategory: "B", soundFeedback: "The truck rolls on the street!" },
      { id: "balloon", label: "Balloon", emoji: "🎈", correctCategory: "A", soundFeedback: "The balloon floats up!" },
      { id: "scooter", label: "Scooter", emoji: "🛴", correctCategory: "B", soundFeedback: "The scooter rolls on the path!" },
    ],
  },
  "arctic-world": {
    title: "Ice Neighbours vs Warm Friends",
    instruction: "Who lives on the ice, and who likes the warm grass?",
    spokenPrompt: "Ice neighbour, or warm-grass friend?",
    categoryA: { id: "ice", label: "On the Ice", emoji: "❄️", dropZoneColor: "border-cyan-400 bg-cyan-950/40 text-cyan-300" },
    categoryB: { id: "warm", label: "Warm Grass", emoji: "🌳", dropZoneColor: "border-emerald-400 bg-emerald-950/40 text-emerald-300" },
    items: [
      { id: "penguin", label: "Penguin", emoji: "🐧", correctCategory: "A", soundFeedback: "Penguins huddle on the floe!" },
      { id: "lion", label: "Lion", emoji: "🦁", correctCategory: "B", soundFeedback: "Lions nap on warm grass!" },
      { id: "seal", label: "Seal", emoji: "🐬", correctCategory: "A", soundFeedback: "Seals clap on the cold shore!" },
      { id: "cow", label: "Cow", emoji: "🐄", correctCategory: "B", soundFeedback: "Cows munch clover in the meadow!" },
      { id: "bear", label: "Snow Bear", emoji: "🐻", correctCategory: "A", soundFeedback: "The snow bear naps in a den!" },
      { id: "hen", label: "Hen", emoji: "🐔", correctCategory: "B", soundFeedback: "The hen pecks warm hay!" },
      { id: "whale", label: "Whale", emoji: "🐋", correctCategory: "A", soundFeedback: "The whale sings under the ice!" },
      { id: "pig", label: "Pig", emoji: "🐷", correctCategory: "B", soundFeedback: "The pig rolls in warm mud!" },
      { id: "seal2", label: "Seal pup", emoji: "🐬", correctCategory: "A", soundFeedback: "Seal pups clap on ice!" },
      { id: "horse", label: "Horse", emoji: "🐴", correctCategory: "B", soundFeedback: "Horses gallop on warm grass!" },
      { id: "flake", label: "Snowflake", emoji: "❄️", correctCategory: "A", soundFeedback: "Snowflakes fall on the ice!" },
      { id: "chick", label: "Chick", emoji: "🐥", correctCategory: "B", soundFeedback: "Chicks peck warm hay!" },
    ],
  },
  "night-world": {
    title: "Day Sky vs Night Sky",
    instruction: "What belongs to daytime, and what belongs to night?",
    spokenPrompt: "Daytime friend, or night-time friend?",
    categoryA: { id: "day", label: "Daytime", emoji: "☀️", dropZoneColor: "border-amber-400 bg-amber-950/40 text-amber-300" },
    categoryB: { id: "night", label: "Night", emoji: "🌙", dropZoneColor: "border-indigo-400 bg-indigo-950/40 text-indigo-300" },
    items: [
      { id: "sun", label: "Sun", emoji: "☀️", correctCategory: "A", soundFeedback: "The sun warms the morning!" },
      { id: "moon", label: "Moon", emoji: "🌙", correctCategory: "B", soundFeedback: "The moon watches bedtime!" },
      { id: "kite", label: "Kite", emoji: "🎈", correctCategory: "A", soundFeedback: "Kites fly in the day breeze!" },
      { id: "owl", label: "Owl", emoji: "🦉", correctCategory: "B", soundFeedback: "Owls hoot after dark!" },
      { id: "bee", label: "Bee", emoji: "🐝", correctCategory: "A", soundFeedback: "Bees work in the daylight!" },
      { id: "bat", label: "Bat", emoji: "🦇", correctCategory: "B", soundFeedback: "Bats fly when the lamp is on!" },
      { id: "rooster", label: "Rooster", emoji: "🐓", correctCategory: "A", soundFeedback: "The rooster calls the morning!" },
      { id: "star", label: "Star", emoji: "⭐", correctCategory: "B", soundFeedback: "Stars wink in the night!" },
      { id: "sunflower", label: "Sunflower", emoji: "🌻", correctCategory: "A", soundFeedback: "Sunflowers face the day!" },
      { id: "lamp", label: "Lamp", emoji: "💡", correctCategory: "B", soundFeedback: "Lamps glow after dark!" },
      { id: "cloud", label: "Day cloud", emoji: "☁️", correctCategory: "A", soundFeedback: "Clouds drift in the day sky!" },
      { id: "teddy", label: "Night teddy", emoji: "🧸", correctCategory: "B", soundFeedback: "Teddy waits for bedtime!" },
    ],
  },
  "bug-world": {
    title: "Bugs vs Flowers",
    instruction: "Put crawly bugs with bugs. Put blooms with flowers.",
    spokenPrompt: "Is it a bug, or a flower?",
    categoryA: { id: "bug", label: "Bugs", emoji: "🐞", dropZoneColor: "border-lime-400 bg-lime-950/40 text-lime-300" },
    categoryB: { id: "flower", label: "Flowers", emoji: "🌸", dropZoneColor: "border-pink-400 bg-pink-950/40 text-pink-300" },
    items: [
      { id: "bee", label: "Bee", emoji: "🐝", correctCategory: "A", soundFeedback: "Bee is a busy bug!" },
      { id: "bloom", label: "Bloom", emoji: "🌸", correctCategory: "B", soundFeedback: "The bloom stays in the flower bed!" },
      { id: "ant", label: "Ant", emoji: "🐜", correctCategory: "A", soundFeedback: "Ant marches with the bugs!" },
      { id: "tulip", label: "Tulip", emoji: "🌷", correctCategory: "B", soundFeedback: "Tulip is a garden flower!" },
      { id: "beetle", label: "Beetle", emoji: "🐛", correctCategory: "A", soundFeedback: "Beetle wears a shiny coat!" },
      { id: "rose", label: "Rose", emoji: "🌹", correctCategory: "B", soundFeedback: "Rose is a garden flower!" },
      { id: "snail", label: "Snail", emoji: "🐌", correctCategory: "A", soundFeedback: "Snail slides with the bugs!" },
      { id: "sunflower", label: "Sunflower", emoji: "🌻", correctCategory: "B", soundFeedback: "Sunflower turns to the light!" },
      { id: "worm", label: "Worm", emoji: "🐛", correctCategory: "A", soundFeedback: "Worms wiggle with the bugs!" },
      { id: "daisy", label: "Daisy", emoji: "🌼", correctCategory: "B", soundFeedback: "Daisy is a garden flower!" },
      { id: "cricket", label: "Cricket", emoji: "🦗", correctCategory: "A", soundFeedback: "Crickets chirp with the bugs!" },
      { id: "blossom", label: "Blossom", emoji: "🌺", correctCategory: "B", soundFeedback: "Blossom is a garden flower!" },
    ],
  },
  "animal-world": {
    title: "Farm vs Jungle",
    instruction: "Barn friends here. Jungle friends there.",
    spokenPrompt: "Does this friend live on the farm, or in the jungle?",
    categoryA: { id: "farm", label: "Farm", emoji: "🐄", dropZoneColor: "border-lime-400 bg-lime-950/40 text-lime-300" },
    categoryB: { id: "jungle", label: "Jungle", emoji: "🌴", dropZoneColor: "border-emerald-400 bg-emerald-950/40 text-emerald-300" },
    items: [
      { id: "cow", label: "Cow", emoji: "🐄", correctCategory: "A", soundFeedback: "Cow lives in the pasture!" },
      { id: "monkey", label: "Monkey", emoji: "🐵", correctCategory: "B", soundFeedback: "Monkey swings in the canopy!" },
      { id: "hen", label: "Hen", emoji: "🐔", correctCategory: "A", soundFeedback: "Hen nests in the barn!" },
      { id: "tiger", label: "Tiger", emoji: "🐯", correctCategory: "B", soundFeedback: "Tiger pads the jungle path!" },
      { id: "pig", label: "Pig", emoji: "🐷", correctCategory: "A", soundFeedback: "Pig cools in the farm mud!" },
      { id: "parrot", label: "Parrot", emoji: "🦜", correctCategory: "B", soundFeedback: "Parrot copies jungle songs!" },
      { id: "sheep", label: "Sheep", emoji: "🐑", correctCategory: "A", soundFeedback: "Sheep wears a wool coat!" },
      { id: "frog", label: "Leaf Frog", emoji: "🐸", correctCategory: "B", soundFeedback: "Frog hides on a jungle leaf!" },
      { id: "goat", label: "Goat", emoji: "🐐", correctCategory: "A", soundFeedback: "Goats climb the farm hill!" },
      { id: "snake", label: "Snake", emoji: "🐍", correctCategory: "B", soundFeedback: "Snakes slide the jungle branch!" },
      { id: "horse", label: "Horse", emoji: "🐴", correctCategory: "A", soundFeedback: "Horses live in the barn!" },
      { id: "sloth", label: "Sloth", emoji: "🐨", correctCategory: "B", soundFeedback: "Sloths hang in the canopy!" },
    ],
  },
  "city-world": {
    title: "Park vs Market",
    instruction: "Park things on the green. Market things at the stall.",
    spokenPrompt: "Does it belong in the park, or at the market?",
    categoryA: { id: "park", label: "Park", emoji: "🌳", dropZoneColor: "border-emerald-400 bg-emerald-950/40 text-emerald-300" },
    categoryB: { id: "market", label: "Market", emoji: "🛍️", dropZoneColor: "border-pink-400 bg-pink-950/40 text-pink-300" },
    items: [
      { id: "tree", label: "Tree", emoji: "🌳", correctCategory: "A", soundFeedback: "Trees grow on the green!" },
      { id: "bag", label: "Market bag", emoji: "🛍️", correctCategory: "B", soundFeedback: "Bags go to the stall!" },
      { id: "duck", label: "Park duck", emoji: "🦆", correctCategory: "A", soundFeedback: "Ducks paddle the park pond!" },
      { id: "bread", label: "Loaf", emoji: "🍞", correctCategory: "B", soundFeedback: "The loaf sits on the stall!" },
      { id: "bench", label: "Bench", emoji: "🌳", correctCategory: "A", soundFeedback: "Sit on the park bench!" },
      { id: "tomato", label: "Tomato", emoji: "🍅", correctCategory: "B", soundFeedback: "Tomatoes pile at the market!" },
      { id: "bird", label: "Park bird", emoji: "🐦", correctCategory: "A", soundFeedback: "Birds sing in the town tree!" },
      { id: "coin", label: "Coin", emoji: "💰", correctCategory: "B", soundFeedback: "Coins pay at the stall!" },
      { id: "ball", label: "Park ball", emoji: "⚽", correctCategory: "A", soundFeedback: "Balls roll on the green!" },
      { id: "fish", label: "Market fish", emoji: "🐟", correctCategory: "B", soundFeedback: "Fish sit on ice at the stall!" },
      { id: "swing", label: "Swing", emoji: "🎠", correctCategory: "A", soundFeedback: "Swings belong in the park!" },
      { id: "cheese", label: "Cheese", emoji: "🧀", correctCategory: "B", soundFeedback: "Cheese sits on the stall!" },
    ],
  },
  "creative-world": {
    title: "Paint vs Music",
    instruction: "Art tools with paint. Sound tools with music.",
    spokenPrompt: "Is it for painting, or for making a sound?",
    categoryA: { id: "paint", label: "Paint", emoji: "🎨", dropZoneColor: "border-pink-400 bg-pink-950/40 text-pink-300" },
    categoryB: { id: "music", label: "Music", emoji: "🎵", dropZoneColor: "border-violet-400 bg-violet-950/40 text-violet-300" },
    items: [
      { id: "brush", label: "Brush", emoji: "🖌️", correctCategory: "A", soundFeedback: "The brush paints a stroke!" },
      { id: "drum", label: "Drum", emoji: "🥁", correctCategory: "B", soundFeedback: "The drum makes a beat!" },
      { id: "palette", label: "Palette", emoji: "🎨", correctCategory: "A", soundFeedback: "Colours live on the palette!" },
      { id: "note", label: "Note", emoji: "🎵", correctCategory: "B", soundFeedback: "Notes go up and down!" },
      { id: "crayon", label: "Crayon", emoji: "🖍️", correctCategory: "A", soundFeedback: "Crayon scribbles on paper!" },
      { id: "guitar", label: "Guitar", emoji: "🎸", correctCategory: "B", soundFeedback: "Guitar strings sing!" },
      { id: "easel", label: "Easel", emoji: "🖼️", correctCategory: "A", soundFeedback: "The easel holds the picture!" },
      { id: "bell", label: "Bell", emoji: "🔔", correctCategory: "B", soundFeedback: "The bell rings a note!" },
      { id: "paint", label: "Paint pot", emoji: "🎨", correctCategory: "A", soundFeedback: "Paint pots live with art!" },
      { id: "piano", label: "Piano", emoji: "🎹", correctCategory: "B", soundFeedback: "Piano keys make music!" },
      { id: "scissors", label: "Scissors", emoji: "✂️", correctCategory: "A", soundFeedback: "Scissors snip paper, not songs!" },
      { id: "flute", label: "Flute", emoji: "🎵", correctCategory: "B", soundFeedback: "The flute sings a note!" },
    ],
  },
  "story-world": {
    title: "Tale vs Real Farm",
    instruction: "Story magic here. Real barn friends there.",
    spokenPrompt: "Is it from a tale, or from the real barn?",
    categoryA: { id: "tale", label: "Tale", emoji: "👑", dropZoneColor: "border-violet-400 bg-violet-950/40 text-violet-300" },
    categoryB: { id: "barn", label: "Barn", emoji: "🐔", dropZoneColor: "border-amber-400 bg-amber-950/40 text-amber-300" },
    items: [
      { id: "crown", label: "Crown", emoji: "👑", correctCategory: "A", soundFeedback: "Crowns live in tales!" },
      { id: "hen", label: "Hen", emoji: "🐔", correctCategory: "B", soundFeedback: "Hens nest in the real barn!" },
      { id: "dragon", label: "Dragon", emoji: "🐉", correctCategory: "A", soundFeedback: "Dragons belong in stories!" },
      { id: "egg", label: "Egg", emoji: "🥚", correctCategory: "B", soundFeedback: "Eggs wait in the barn nest!" },
      { id: "wand", label: "Wand", emoji: "✨", correctCategory: "A", soundFeedback: "Wands sparkle in tales!" },
      { id: "hay", label: "Hay", emoji: "🌾", correctCategory: "B", soundFeedback: "Hay is for the real stall!" },
      { id: "castle", label: "Castle", emoji: "🏰", correctCategory: "A", soundFeedback: "Castles stand in stories!" },
      { id: "cow", label: "Cow", emoji: "🐄", correctCategory: "B", soundFeedback: "Cows live in the real pasture!" },
      { id: "star", label: "Wish star", emoji: "⭐", correctCategory: "A", soundFeedback: "Wish stars live in tales!" },
      { id: "pig", label: "Pig", emoji: "🐷", correctCategory: "B", soundFeedback: "Pigs live in the real pen!" },
      { id: "book", label: "Story book", emoji: "📖", correctCategory: "A", soundFeedback: "Books hold the tales!" },
      { id: "sheep", label: "Sheep", emoji: "🐑", correctCategory: "B", soundFeedback: "Sheep live in the real field!" },
    ],
  },
  "my-world": {
    title: "Wash vs Rest",
    instruction: "Wash things by the sink. Rest things by the bed.",
    spokenPrompt: "Do we wash with it, or rest with it?",
    categoryA: { id: "wash", label: "Wash", emoji: "🛁", dropZoneColor: "border-cyan-400 bg-cyan-950/40 text-cyan-300" },
    categoryB: { id: "rest", label: "Rest", emoji: "🛏️", dropZoneColor: "border-indigo-400 bg-indigo-950/40 text-indigo-300" },
    items: [
      { id: "soap", label: "Soap", emoji: "🛁", correctCategory: "A", soundFeedback: "Soap makes bubbles at the sink!" },
      { id: "pillow", label: "Pillow", emoji: "🛏️", correctCategory: "B", soundFeedback: "Pillows wait on the bed!" },
      { id: "brush", label: "Toothbrush", emoji: "😁", correctCategory: "A", soundFeedback: "Brush circles on teeth!" },
      { id: "book", label: "Bedtime book", emoji: "📖", correctCategory: "B", soundFeedback: "A quiet book for rest!" },
      { id: "towel", label: "Towel", emoji: "📄", correctCategory: "A", soundFeedback: "Towels dry wet hands!" },
      { id: "moon", label: "Night lamp", emoji: "💡", correctCategory: "B", soundFeedback: "The lamp glows at rest time!" },
      { id: "tap", label: "Tap", emoji: "🚰", correctCategory: "A", soundFeedback: "The tap runs for washing!" },
      { id: "teddy", label: "Teddy", emoji: "🧸", correctCategory: "B", soundFeedback: "Teddy snuggles at rest!" },
      { id: "soap2", label: "Flannel", emoji: "🛁", correctCategory: "A", soundFeedback: "Flannels wash at the sink!" },
      { id: "quilt", label: "Quilt", emoji: "🛏️", correctCategory: "B", soundFeedback: "Quilts keep rest warm!" },
      { id: "comb", label: "Comb", emoji: "💇", correctCategory: "A", soundFeedback: "Combs tidy after a wash!" },
      { id: "story", label: "Night story", emoji: "📚", correctCategory: "B", soundFeedback: "Night stories belong at rest!" },
    ],
  },
  "adventure-world": {
    title: "Forest vs Treasure",
    instruction: "Forest path things here. Treasure things there.",
    spokenPrompt: "Is it from the forest trail, or from the treasure?",
    categoryA: { id: "forest", label: "Forest", emoji: "🌲", dropZoneColor: "border-emerald-400 bg-emerald-950/40 text-emerald-300" },
    categoryB: { id: "treasure", label: "Treasure", emoji: "💎", dropZoneColor: "border-amber-400 bg-amber-950/40 text-amber-300" },
    items: [
      { id: "pine", label: "Pine", emoji: "🌲", correctCategory: "A", soundFeedback: "Pines stand on the trail!" },
      { id: "gem", label: "Gem", emoji: "💎", correctCategory: "B", soundFeedback: "Gems sparkle in the chest!" },
      { id: "leaf", label: "Leaf", emoji: "🍃", correctCategory: "A", soundFeedback: "Leaves rustle on the path!" },
      { id: "coin", label: "Coin", emoji: "💰", correctCategory: "B", soundFeedback: "Coins clink in the treasure!" },
      { id: "boot", label: "Boot", emoji: "👢", correctCategory: "A", soundFeedback: "Boots walk the forest!" },
      { id: "map", label: "Map", emoji: "🗺️", correctCategory: "B", soundFeedback: "The map marks the treasure!" },
      { id: "owl", label: "Trail owl", emoji: "🦉", correctCategory: "A", soundFeedback: "Owls watch the pines!" },
      { id: "key", label: "Key", emoji: "🔑", correctCategory: "B", soundFeedback: "The key opens the chest!" },
      { id: "rock", label: "Trail rock", emoji: "⛰️", correctCategory: "A", soundFeedback: "Rocks sit on the forest path!" },
      { id: "chest", label: "Chest", emoji: "🔧", correctCategory: "B", soundFeedback: "The chest holds treasure!" },
      { id: "mushroom", label: "Mushroom", emoji: "🍄", correctCategory: "A", soundFeedback: "Mushrooms grow on the trail!" },
      { id: "crown", label: "Gem crown", emoji: "👑", correctCategory: "B", soundFeedback: "The crown is treasure!" },
    ],
  },
  "learning-world": {
    title: "Letters vs Numbers",
    instruction: "Letters in the meadow. Numbers in the grove.",
    spokenPrompt: "Is it a letter, or a number?",
    categoryA: { id: "letter", label: "Letters", emoji: "🅰️", dropZoneColor: "border-rose-400 bg-rose-950/40 text-rose-300" },
    categoryB: { id: "number", label: "Numbers", emoji: "🔢", dropZoneColor: "border-sky-400 bg-sky-950/40 text-sky-300" },
    items: [
      { id: "a", label: "A", emoji: "🅰️", correctCategory: "A", soundFeedback: "A is a letter!" },
      { id: "one", label: "One", emoji: "1️⃣", correctCategory: "B", soundFeedback: "One is a number!" },
      { id: "s", label: "S", emoji: "S", correctCategory: "A", soundFeedback: "S is a letter!" },
      { id: "ten", label: "Ten", emoji: "🔟", correctCategory: "B", soundFeedback: "Ten fills a ten-frame!" },
      { id: "m", label: "M", emoji: "M", correctCategory: "A", soundFeedback: "M is a letter!" },
      { id: "six", label: "Six", emoji: "6️⃣", correctCategory: "B", soundFeedback: "Six is a number!" },
      { id: "p", label: "P", emoji: "P", correctCategory: "A", soundFeedback: "P is a letter!" },
      { id: "eight", label: "Eight", emoji: "8️⃣", correctCategory: "B", soundFeedback: "Eight is a number!" },
      { id: "b", label: "B", emoji: "🅱️", correctCategory: "A", soundFeedback: "B is a letter!" },
      { id: "three", label: "Three", emoji: "3️⃣", correctCategory: "B", soundFeedback: "Three is a number!" },
      { id: "s2", label: "T", emoji: "T", correctCategory: "A", soundFeedback: "T is a letter!" },
      { id: "two", label: "Two", emoji: "2️⃣", correctCategory: "B", soundFeedback: "Two is a number!" },
    ],
  },
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
    rhymes: RHYMES_BY_WORLD[worldId] ?? defaultRhymes,
    bubbles: BUBBLES_BY_WORLD[worldId] ?? defaultBubbles,
    songIds: SONGS_BY_WORLD[worldId] ?? defaultSongs,
    mix: MIX_BY_WORLD[worldId] ?? defaultMix,
    counting: COUNTING_BY_WORLD[worldId] ?? defaultCounting,
    sorting: SORTING_BY_WORLD[worldId] ?? defaultSorting,
  };
}
