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

const kitchen: SafariFriend[] = [
  { id: "pot", name: "Soup Pot", emoji: "🍲", soundText: "BUBBLE BUBBLE!", call: "Bubble! Stir Nana's warm soup!", funFact: "A lid keeps the soup steam in.", habitat: "Stove", bgGradient: "from-orange-400 to-amber-600" },
  { id: "bread", name: "Warm Bun", emoji: "🍞", soundText: "CRACKLE!", call: "Crackle! I just came out of the oven!", funFact: "Yeast makes bread puff up.", habitat: "Bakery Shelf", bgGradient: "from-amber-300 to-yellow-500" },
  { id: "apple", name: "Crunch Apple", emoji: "🍎", soundText: "CRUNCH!", call: "Crunch! Pick me from the fruit stall!", funFact: "Apples float in a washing bowl.", habitat: "Fruit Stall", bgGradient: "from-rose-400 to-red-500" },
  { id: "spoon", name: "Stir Spoon", emoji: "🥄", soundText: "CLINK CLINK!", call: "Clink! Round and round in the pot!", funFact: "A wooden spoon does not scratch the pot.", habitat: "Drawer", bgGradient: "from-amber-200 to-orange-400" },
  { id: "milk", name: "Milk Jug", emoji: "🥛", soundText: "POUR!", call: "Pour a cup for breakfast!", funFact: "Milk likes a cold shelf.", habitat: "Family Table", bgGradient: "from-slate-100 to-sky-300" },
  { id: "cat", name: "Kitchen Cat", emoji: "🐱", soundText: "MEOW!", call: "Meow! I watch the warm oven!", funFact: "Kitchen cats like a sunny windowsill.", habitat: "Window", bgGradient: "from-orange-400 to-amber-500" },
];

const vehicles: SafariFriend[] = [
  { id: "bus", name: "Town Bus", emoji: "🚌", soundText: "BEEP BEEP!", call: "Beep beep! Hop on the high street!", funFact: "Buses stop when you wave at the stop.", habitat: "High Street", bgGradient: "from-yellow-400 to-amber-500" },
  { id: "car", name: "Little Car", emoji: "🚗", soundText: "VROOM!", call: "Vroom! Seatbelt click!", funFact: "Cars have lights for night roads.", habitat: "Town Road", bgGradient: "from-sky-400 to-blue-500" },
  { id: "plane", name: "Sky Plane", emoji: "✈️", soundText: "WHOOSH!", call: "Whoosh over the runway!", funFact: "Planes lift because air moves over the wings.", habitat: "Airport", bgGradient: "from-cyan-300 to-sky-500" },
  { id: "train", name: "Choo Train", emoji: "🚂", soundText: "CHOO CHOO!", call: "Choo choo along the track!", funFact: "Trains follow the rails.", habitat: "Station", bgGradient: "from-rose-400 to-red-500" },
  { id: "bike", name: "City Bike", emoji: "🚲", soundText: "RING RING!", call: "Ring! Pedal past the park!", funFact: "Helmets keep heads safe.", habitat: "Cycle Path", bgGradient: "from-lime-400 to-emerald-500" },
  { id: "boat", name: "Harbour Boat", emoji: "🚢", soundText: "TOOT TOOT!", call: "Toot at the dock!", funFact: "Boats float because they push water away.", habitat: "Harbour", bgGradient: "from-indigo-400 to-blue-600" },
];

const studio: SafariFriend[] = [
  { id: "paint", name: "Paint Pot", emoji: "🎨", soundText: "SPLASH!", call: "Splash a colour on the paper!", funFact: "Red and yellow make orange.", habitat: "Atelier", bgGradient: "from-pink-400 to-violet-500" },
  { id: "drum", name: "Studio Drum", emoji: "🥁", soundText: "BOOM TAP!", call: "Boom tap a beat!", funFact: "Drums make sound when the skin wiggles.", habitat: "Music Garden", bgGradient: "from-amber-500 to-rose-500" },
  { id: "bead", name: "Colour Bead", emoji: "🟣", soundText: "CLICK!", call: "Click onto the string!", funFact: "Beads make patterns you can count.", habitat: "Bead Table", bgGradient: "from-violet-400 to-fuchsia-500" },
  { id: "brush", name: "Paint Brush", emoji: "🖌️", soundText: "SWISH!", call: "Swish a big stroke!", funFact: "A wet brush makes a softer line.", habitat: "Easel", bgGradient: "from-sky-400 to-indigo-400" },
  { id: "note", name: "Singing Note", emoji: "🎵", soundText: "LA LA!", call: "La la in the garden!", funFact: "Notes go up and down like steps.", habitat: "Music Garden", bgGradient: "from-violet-400 to-indigo-500" },
  { id: "sticker", name: "Gold Sticker", emoji: "🌟", soundText: "STICK!", call: "Stick me on the page!", funFact: "Stickers like a dry page.", habitat: "Art Table", bgGradient: "from-yellow-300 to-orange-400" },
];

const letters: SafariFriend[] = [
  { id: "ay", name: "Letter A", emoji: "🅰️", soundText: "A /æ/!", call: "A says /æ/ like apple!", funFact: "A is the first letter of the alphabet.", habitat: "Phonics Meadow", bgGradient: "from-rose-400 to-red-500" },
  { id: "bee-letter", name: "Letter B", emoji: "🅱️", soundText: "B /b/!", call: "B says /b/ like book!", funFact: "B has two bumps.", habitat: "Letter Lane", bgGradient: "from-sky-400 to-blue-500" },
  { id: "ten", name: "Number Ten", emoji: "🔟", soundText: "TEN!", call: "Ten fills a whole ten-frame!", funFact: "Ten is two hands of fingers.", habitat: "Counting Grove", bgGradient: "from-amber-400 to-yellow-500" },
  { id: "book", name: "Little Book", emoji: "📘", soundText: "FLIP!", call: "Flip a page and listen!", funFact: "Books have a beginning, middle and end.", habitat: "Story Nook", bgGradient: "from-indigo-400 to-blue-600" },
  { id: "pen", name: "Pencil", emoji: "✏️", soundText: "SCRIBBLE!", call: "Trace a big letter!", funFact: "Pencils can be rubbed out.", habitat: "Writing Desk", bgGradient: "from-yellow-300 to-amber-500" },
  { id: "dot", name: "Counting Dot", emoji: "🔵", soundText: "TAP!", call: "Tap each dot once!", funFact: "One tap for one thing is how we count.", habitat: "Dot Tray", bgGradient: "from-cyan-400 to-sky-500" },
];

const home: SafariFriend[] = [
  { id: "house", name: "Family Home", emoji: "🏠", soundText: "KNOCK KNOCK!", call: "Knock! Come in, you are home!", funFact: "Homes keep us warm and dry.", habitat: "Family Home", bgGradient: "from-rose-300 to-amber-300" },
  { id: "brush", name: "Toothbrush", emoji: "🪥", soundText: "BRUSH BRUSH!", call: "Brush in little circles!", funFact: "Two minutes is a good brush.", habitat: "Bathroom", bgGradient: "from-cyan-400 to-teal-500" },
  { id: "cup", name: "Sip Cup", emoji: "🥛", soundText: "SIP SIP!", call: "Pour and sip!", funFact: "A cup has a bottom so the drink stays in.", habitat: "Table", bgGradient: "from-sky-200 to-white" },
  { id: "heart", name: "Kind Heart", emoji: "❤️", soundText: "BEAT BEAT!", call: "A kind heart shares a hug!", funFact: "Kind words make hearts feel big.", habitat: "Living Room", bgGradient: "from-rose-400 to-red-500" },
  { id: "bed", name: "Soft Bed", emoji: "🛏️", soundText: "YAWN!", call: "Yawn… time for a quiet story!", funFact: "Sleep helps bodies grow.", habitat: "Bedroom", bgGradient: "from-indigo-300 to-violet-400" },
  { id: "smile", name: "Family Smile", emoji: "😊", soundText: "GIGGLE!", call: "Giggle! We are glad you are here!", funFact: "Smiles can be catching.", habitat: "Kitchen Table", bgGradient: "from-amber-300 to-yellow-400" },
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
    { pairId: "pig", emoji: "🐷", name: "Pig", color: "from-rose-400 to-pink-500" },
    { pairId: "horse", emoji: "🐴", name: "Horse", color: "from-amber-500 to-orange-600" },
  ],
  "bug-world": [
    { pairId: "bee", emoji: "🐝", name: "Bee", color: "from-amber-400 to-yellow-500" },
    { pairId: "bug", emoji: "🪲", name: "Beetle", color: "from-lime-500 to-emerald-600" },
    { pairId: "leaf", emoji: "🍃", name: "Leaf", color: "from-emerald-400 to-green-500" },
    { pairId: "flower", emoji: "🌼", name: "Flower", color: "from-pink-400 to-rose-500" },
    { pairId: "lady", emoji: "🐞", name: "Ladybug", color: "from-rose-500 to-red-500" },
    { pairId: "snail", emoji: "🐌", name: "Snail", color: "from-amber-200 to-lime-400" },
    { pairId: "worm", emoji: "🪱", name: "Worm", color: "from-rose-300 to-amber-400" },
    { pairId: "web", emoji: "🕸️", name: "Web", color: "from-slate-300 to-sky-400" },
  ],
  "arctic-world": [
    { pairId: "penguin", emoji: "🐧", name: "Penguin", color: "from-sky-300 to-indigo-400" },
    { pairId: "flake", emoji: "❄️", name: "Snowflake", color: "from-cyan-200 to-sky-400" },
    { pairId: "seal", emoji: "🦭", name: "Seal", color: "from-slate-300 to-cyan-400" },
    { pairId: "bear", emoji: "🐻‍❄️", name: "Snow bear", color: "from-white to-sky-300" },
    { pairId: "igloo", emoji: "🧊", name: "Ice", color: "from-cyan-300 to-blue-400" },
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
    { pairId: "bench", emoji: "🪵", name: "Bench", color: "from-amber-600 to-yellow-500" },
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
    { pairId: "bead", emoji: "🟣", name: "Bead", color: "from-amber-400 to-rose-400" },
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
    { pairId: "brush", emoji: "🪥", name: "Brush", color: "from-cyan-400 to-teal-500" },
    { pairId: "hug", emoji: "🤗", name: "Hug", color: "from-pink-400 to-rose-400" },
    { pairId: "bed", emoji: "🛏️", name: "Bed", color: "from-indigo-300 to-violet-400" },
    { pairId: "cup", emoji: "🥛", name: "Cup", color: "from-sky-200 to-white" },
    { pairId: "soap", emoji: "🧼", name: "Soap", color: "from-pink-300 to-cyan-300" },
  ],
  "adventure-world": [
    { pairId: "tree", emoji: "🌲", name: "Pine", color: "from-emerald-500 to-green-700" },
    { pairId: "rocket", emoji: "🚀", name: "Rocket", color: "from-sky-400 to-indigo-500" },
    { pairId: "rain", emoji: "☔", name: "Rain", color: "from-cyan-400 to-blue-500" },
    { pairId: "map", emoji: "🗺️", name: "Map", color: "from-amber-400 to-orange-500" },
    { pairId: "gem", emoji: "💎", name: "Gem", color: "from-teal-400 to-cyan-500" },
    { pairId: "moon", emoji: "🌕", name: "Moon", color: "from-yellow-200 to-amber-300" },
    { pairId: "boot", emoji: "🥾", name: "Boot", color: "from-amber-700 to-stone-600" },
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
  "kitchen-world": { title: "Kitchen Safari", safari: kitchen },
  "vehicle-world": { title: "Street Safari", safari: vehicles },
  "creative-world": { title: "Studio Safari", safari: studio },
  "learning-world": { title: "Letter Safari", safari: letters },
  "my-world": { title: "Home Safari", safari: home },
  "story-world": { title: "Tale Safari", safari: farm },
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
];

const RHYMES_BY_WORLD: Record<string, ThemedRhyme[]> = {
  "kitchen-world": [
    { id: "k-pan", targetWord: "Pan", targetEmoji: "🍳", spokenPrompt: "What rhymes with Pan in the kitchen?", correctWord: "Can", options: [{ word: "Can", emoji: "🥫", isCorrect: true }, { word: "Soup", emoji: "🍲", isCorrect: false }, { word: "Bread", emoji: "🍞", isCorrect: false }] },
    { id: "k-pot", targetWord: "Pot", targetEmoji: "🥘", spokenPrompt: "What rhymes with Pot?", correctWord: "Hot", options: [{ word: "Hot", emoji: "🔥", isCorrect: true }, { word: "Milk", emoji: "🥛", isCorrect: false }, { word: "Pear", emoji: "🍐", isCorrect: false }] },
    { id: "k-bun", targetWord: "Bun", targetEmoji: "🍞", spokenPrompt: "What rhymes with Bun on the bakery shelf?", correctWord: "Sun", options: [{ word: "Sun", emoji: "☀️", isCorrect: true }, { word: "Jam", emoji: "🍓", isCorrect: false }, { word: "Egg", emoji: "🥚", isCorrect: false }] },
    { id: "k-cake", targetWord: "Cake", targetEmoji: "🍰", spokenPrompt: "What rhymes with Cake?", correctWord: "Bake", options: [{ word: "Bake", emoji: "👩‍🍳", isCorrect: true }, { word: "Fish", emoji: "🐟", isCorrect: false }, { word: "Bus", emoji: "🚌", isCorrect: false }] },
  ],
  "night-world": [
    { id: "n-star", targetWord: "Star", targetEmoji: "⭐", spokenPrompt: "What rhymes with Star in the night sky?", correctWord: "Far", options: [{ word: "Far", emoji: "🔭", isCorrect: true }, { word: "Bed", emoji: "🛏️", isCorrect: false }, { word: "Owl", emoji: "🦉", isCorrect: false }] },
    { id: "n-light", targetWord: "Light", targetEmoji: "💡", spokenPrompt: "What rhymes with Light?", correctWord: "Night", options: [{ word: "Night", emoji: "🌙", isCorrect: true }, { word: "Moth", emoji: "🦋", isCorrect: false }, { word: "Sock", emoji: "🧦", isCorrect: false }] },
    { id: "n-bed", targetWord: "Bed", targetEmoji: "🛏️", spokenPrompt: "What rhymes with Bed?", correctWord: "Red", options: [{ word: "Red", emoji: "🔴", isCorrect: true }, { word: "Moon", emoji: "🌕", isCorrect: false }, { word: "Fox", emoji: "🦊", isCorrect: false }] },
    { id: "n-moon", targetWord: "Moon", targetEmoji: "🌙", spokenPrompt: "What rhymes with Moon?", correctWord: "Spoon", options: [{ word: "Spoon", emoji: "🥄", isCorrect: true }, { word: "Star", emoji: "⭐", isCorrect: false }, { word: "Tree", emoji: "🌲", isCorrect: false }] },
  ],
  "vehicle-world": [
    { id: "v-bus", targetWord: "Bus", targetEmoji: "🚌", spokenPrompt: "What rhymes with Bus on the high street?", correctWord: "Us", options: [{ word: "Us", emoji: "🧒", isCorrect: true }, { word: "Car", emoji: "🚗", isCorrect: false }, { word: "Boat", emoji: "🚢", isCorrect: false }] },
    { id: "v-car", targetWord: "Car", targetEmoji: "🚗", spokenPrompt: "What rhymes with Car?", correctWord: "Star", options: [{ word: "Star", emoji: "⭐", isCorrect: true }, { word: "Train", emoji: "🚂", isCorrect: false }, { word: "Bike", emoji: "🚲", isCorrect: false }] },
    { id: "v-van", targetWord: "Van", targetEmoji: "🚐", spokenPrompt: "What rhymes with Van?", correctWord: "Can", options: [{ word: "Can", emoji: "🥫", isCorrect: true }, { word: "Plane", emoji: "✈️", isCorrect: false }, { word: "Road", emoji: "🛣️", isCorrect: false }] },
    { id: "v-train", targetWord: "Train", targetEmoji: "🚂", spokenPrompt: "What rhymes with Train?", correctWord: "Rain", options: [{ word: "Rain", emoji: "🌧️", isCorrect: true }, { word: "Bus", emoji: "🚌", isCorrect: false }, { word: "Dock", emoji: "⚓", isCorrect: false }] },
  ],
  "learning-world": [
    { id: "l-cat", targetWord: "Cat", targetEmoji: "🐱", spokenPrompt: "What rhymes with Cat in the meadow?", correctWord: "Hat", options: [{ word: "Hat", emoji: "🎩", isCorrect: true }, { word: "Pen", emoji: "✏️", isCorrect: false }, { word: "Ten", emoji: "🔟", isCorrect: false }] },
    { id: "l-ten", targetWord: "Ten", targetEmoji: "🔟", spokenPrompt: "What rhymes with Ten?", correctWord: "Pen", options: [{ word: "Pen", emoji: "✏️", isCorrect: true }, { word: "Six", emoji: "6️⃣", isCorrect: false }, { word: "Book", emoji: "📘", isCorrect: false }] },
    { id: "l-bee", targetWord: "Bee", targetEmoji: "🐝", spokenPrompt: "What rhymes with Bee?", correctWord: "Tree", options: [{ word: "Tree", emoji: "🌳", isCorrect: true }, { word: "Map", emoji: "🗺️", isCorrect: false }, { word: "Cup", emoji: "☕", isCorrect: false }] },
    { id: "l-fox", targetWord: "Fox", targetEmoji: "🦊", spokenPrompt: "What rhymes with Fox?", correctWord: "Box", options: [{ word: "Box", emoji: "📦", isCorrect: true }, { word: "Hat", emoji: "🎩", isCorrect: false }, { word: "Sun", emoji: "☀️", isCorrect: false }] },
  ],
  "animal-world": [
    { id: "a-pig", targetWord: "Pig", targetEmoji: "🐷", spokenPrompt: "What rhymes with Pig in the muddy pen?", correctWord: "Dig", options: [{ word: "Dig", emoji: "🕳️", isCorrect: true }, { word: "Cow", emoji: "🐄", isCorrect: false }, { word: "Hen", emoji: "🐔", isCorrect: false }] },
    { id: "a-hen", targetWord: "Hen", targetEmoji: "🐔", spokenPrompt: "What rhymes with Hen?", correctWord: "Pen", options: [{ word: "Pen", emoji: "✏️", isCorrect: true }, { word: "Egg", emoji: "🥚", isCorrect: false }, { word: "Hay", emoji: "🌾", isCorrect: false }] },
    { id: "a-sheep", targetWord: "Sheep", targetEmoji: "🐑", spokenPrompt: "What rhymes with Sheep?", correctWord: "Sleep", options: [{ word: "Sleep", emoji: "😴", isCorrect: true }, { word: "Wool", emoji: "🧶", isCorrect: false }, { word: "Barn", emoji: "🏚️", isCorrect: false }] },
    { id: "a-cat", targetWord: "Cat", targetEmoji: "🐱", spokenPrompt: "What rhymes with Cat in the barn?", correctWord: "Hat", options: [{ word: "Hat", emoji: "🎩", isCorrect: true }, { word: "Milk", emoji: "🥛", isCorrect: false }, { word: "Hay", emoji: "🌾", isCorrect: false }] },
  ],
  "bug-world": [
    { id: "b-bee", targetWord: "Bee", targetEmoji: "🐝", spokenPrompt: "What rhymes with Bee on the flower?", correctWord: "Tree", options: [{ word: "Tree", emoji: "🌳", isCorrect: true }, { word: "Ant", emoji: "🐜", isCorrect: false }, { word: "Mud", emoji: "🟤", isCorrect: false }] },
    { id: "b-bug", targetWord: "Bug", targetEmoji: "🐞", spokenPrompt: "What rhymes with Bug?", correctWord: "Hug", options: [{ word: "Hug", emoji: "🤗", isCorrect: true }, { word: "Leaf", emoji: "🍃", isCorrect: false }, { word: "Web", emoji: "🕸️", isCorrect: false }] },
    { id: "b-ant", targetWord: "Ant", targetEmoji: "🐜", spokenPrompt: "What rhymes with Ant?", correctWord: "Plant", options: [{ word: "Plant", emoji: "🌱", isCorrect: true }, { word: "Bee", emoji: "🐝", isCorrect: false }, { word: "Rock", emoji: "🪨", isCorrect: false }] },
    { id: "b-snail", targetWord: "Snail", targetEmoji: "🐌", spokenPrompt: "What rhymes with Snail?", correctWord: "Trail", options: [{ word: "Trail", emoji: "🛤️", isCorrect: true }, { word: "Shell", emoji: "🐚", isCorrect: false }, { word: "Dew", emoji: "💧", isCorrect: false }] },
  ],
  "arctic-world": [
    { id: "i-ice", targetWord: "Ice", targetEmoji: "🧊", spokenPrompt: "What rhymes with Ice on the floe?", correctWord: "Nice", options: [{ word: "Nice", emoji: "😊", isCorrect: true }, { word: "Seal", emoji: "🦭", isCorrect: false }, { word: "Snow", emoji: "❄️", isCorrect: false }] },
    { id: "i-seal", targetWord: "Seal", targetEmoji: "🦭", spokenPrompt: "What rhymes with Seal?", correctWord: "Wheel", options: [{ word: "Wheel", emoji: "🛞", isCorrect: true }, { word: "Ice", emoji: "🧊", isCorrect: false }, { word: "Bear", emoji: "🐻‍❄️", isCorrect: false }] },
    { id: "i-snow", targetWord: "Snow", targetEmoji: "❄️", spokenPrompt: "What rhymes with Snow?", correctWord: "Go", options: [{ word: "Go", emoji: "🚶", isCorrect: true }, { word: "Floe", emoji: "🧊", isCorrect: false }, { word: "Fur", emoji: "🧸", isCorrect: false }] },
    { id: "i-whale", targetWord: "Whale", targetEmoji: "🐋", spokenPrompt: "What rhymes with Whale?", correctWord: "Sail", options: [{ word: "Sail", emoji: "⛵", isCorrect: true }, { word: "Ice", emoji: "🧊", isCorrect: false }, { word: "Fish", emoji: "🐟", isCorrect: false }] },
  ],
  "city-world": [
    { id: "c-park", targetWord: "Park", targetEmoji: "🌳", spokenPrompt: "What rhymes with Park in town?", correctWord: "Dark", options: [{ word: "Dark", emoji: "🌑", isCorrect: true }, { word: "Bus", emoji: "🚌", isCorrect: false }, { word: "Shop", emoji: "🛍️", isCorrect: false }] },
    { id: "c-bell", targetWord: "Bell", targetEmoji: "🔔", spokenPrompt: "What rhymes with Bell?", correctWord: "Shell", options: [{ word: "Shell", emoji: "🐚", isCorrect: true }, { word: "Lamp", emoji: "🏮", isCorrect: false }, { word: "Road", emoji: "🛣️", isCorrect: false }] },
    { id: "c-tree", targetWord: "Tree", targetEmoji: "🌳", spokenPrompt: "What rhymes with Tree in the park?", correctWord: "Bee", options: [{ word: "Bee", emoji: "🐝", isCorrect: true }, { word: "Bench", emoji: "🪵", isCorrect: false }, { word: "Bag", emoji: "🛍️", isCorrect: false }] },
    { id: "c-shop", targetWord: "Shop", targetEmoji: "🏪", spokenPrompt: "What rhymes with Shop?", correctWord: "Stop", options: [{ word: "Stop", emoji: "🛑", isCorrect: true }, { word: "Park", emoji: "🌳", isCorrect: false }, { word: "Book", emoji: "📖", isCorrect: false }] },
  ],
  "creative-world": [
    { id: "cr-paint", targetWord: "Paint", targetEmoji: "🎨", spokenPrompt: "What rhymes with Paint at the atelier?", correctWord: "Wait", options: [{ word: "Wait", emoji: "⏳", isCorrect: true }, { word: "Brush", emoji: "🖌️", isCorrect: false }, { word: "Bead", emoji: "🟣", isCorrect: false }] },
    { id: "cr-bead", targetWord: "Bead", targetEmoji: "🟣", spokenPrompt: "What rhymes with Bead?", correctWord: "Read", options: [{ word: "Read", emoji: "📖", isCorrect: true }, { word: "Glue", emoji: "🧴", isCorrect: false }, { word: "Song", emoji: "🎵", isCorrect: false }] },
    { id: "cr-song", targetWord: "Song", targetEmoji: "🎵", spokenPrompt: "What rhymes with Song?", correctWord: "Long", options: [{ word: "Long", emoji: "📏", isCorrect: true }, { word: "Drum", emoji: "🥁", isCorrect: false }, { word: "Star", emoji: "🌟", isCorrect: false }] },
    { id: "cr-glue", targetWord: "Glue", targetEmoji: "🧴", spokenPrompt: "What rhymes with Glue?", correctWord: "Blue", options: [{ word: "Blue", emoji: "🔵", isCorrect: true }, { word: "Paint", emoji: "🎨", isCorrect: false }, { word: "Cut", emoji: "✂️", isCorrect: false }] },
  ],
  "story-world": [
    { id: "s-book", targetWord: "Book", targetEmoji: "📖", spokenPrompt: "What rhymes with Book in the tale?", correctWord: "Look", options: [{ word: "Look", emoji: "👀", isCorrect: true }, { word: "Hen", emoji: "🐔", isCorrect: false }, { word: "Crown", emoji: "👑", isCorrect: false }] },
    { id: "s-tale", targetWord: "Tale", targetEmoji: "📜", spokenPrompt: "What rhymes with Tale?", correctWord: "Sail", options: [{ word: "Sail", emoji: "⛵", isCorrect: true }, { word: "King", emoji: "👑", isCorrect: false }, { word: "Page", emoji: "📄", isCorrect: false }] },
    { id: "s-king", targetWord: "King", targetEmoji: "👑", spokenPrompt: "What rhymes with King?", correctWord: "Ring", options: [{ word: "Ring", emoji: "💍", isCorrect: true }, { word: "Book", emoji: "📘", isCorrect: false }, { word: "Boat", emoji: "⛵", isCorrect: false }] },
    { id: "s-hen", targetWord: "Hen", targetEmoji: "🐔", spokenPrompt: "What rhymes with Hen in the barnyard tale?", correctWord: "Pen", options: [{ word: "Pen", emoji: "✏️", isCorrect: true }, { word: "Egg", emoji: "🥚", isCorrect: false }, { word: "Crown", emoji: "👑", isCorrect: false }] },
  ],
  "my-world": [
    { id: "m-hug", targetWord: "Hug", targetEmoji: "🤗", spokenPrompt: "What rhymes with Hug at home?", correctWord: "Bug", options: [{ word: "Bug", emoji: "🐞", isCorrect: true }, { word: "Home", emoji: "🏠", isCorrect: false }, { word: "Soap", emoji: "🧼", isCorrect: false }] },
    { id: "m-bed", targetWord: "Bed", targetEmoji: "🛏️", spokenPrompt: "What rhymes with Bed?", correctWord: "Red", options: [{ word: "Red", emoji: "🔴", isCorrect: true }, { word: "Brush", emoji: "🪥", isCorrect: false }, { word: "Hug", emoji: "🤗", isCorrect: false }] },
    { id: "m-home", targetWord: "Home", targetEmoji: "🏠", spokenPrompt: "What rhymes with Home?", correctWord: "Comb", options: [{ word: "Comb", emoji: "🪮", isCorrect: true }, { word: "Door", emoji: "🚪", isCorrect: false }, { word: "Smile", emoji: "😊", isCorrect: false }] },
    { id: "m-heart", targetWord: "Heart", targetEmoji: "❤️", spokenPrompt: "What rhymes with Heart?", correctWord: "Start", options: [{ word: "Start", emoji: "🚦", isCorrect: true }, { word: "Hug", emoji: "🤗", isCorrect: false }, { word: "Cup", emoji: "🥤", isCorrect: false }] },
  ],
  "adventure-world": [
    { id: "ad-map", targetWord: "Map", targetEmoji: "🗺️", spokenPrompt: "What rhymes with Map on the trail?", correctWord: "Tap", options: [{ word: "Tap", emoji: "👆", isCorrect: true }, { word: "Pine", emoji: "🌲", isCorrect: false }, { word: "Gem", emoji: "💎", isCorrect: false }] },
    { id: "ad-rain", targetWord: "Rain", targetEmoji: "☔", spokenPrompt: "What rhymes with Rain?", correctWord: "Train", options: [{ word: "Train", emoji: "🚂", isCorrect: true }, { word: "Tree", emoji: "🌲", isCorrect: false }, { word: "Mud", emoji: "🟤", isCorrect: false }] },
    { id: "ad-tree", targetWord: "Tree", targetEmoji: "🌲", spokenPrompt: "What rhymes with Tree in the forest?", correctWord: "Bee", options: [{ word: "Bee", emoji: "🐝", isCorrect: true }, { word: "Map", emoji: "🗺️", isCorrect: false }, { word: "Rock", emoji: "🪨", isCorrect: false }] },
    { id: "ad-cave", targetWord: "Cave", targetEmoji: "🕳️", spokenPrompt: "What rhymes with Cave?", correctWord: "Wave", options: [{ word: "Wave", emoji: "🌊", isCorrect: true }, { word: "Gem", emoji: "💎", isCorrect: false }, { word: "Path", emoji: "🛤️", isCorrect: false }] },
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
];

const BUBBLES_BY_WORLD: Record<string, BubbleWord[]> = {
  "arctic-world": [
    { letter: "I", word: "Ice", emoji: "🧊", sound: "I says /i/! Ice!" },
    { letter: "P", word: "Penguin", emoji: "🐧", sound: "P says /p/! Penguin!" },
    { letter: "S", word: "Seal", emoji: "🦭", sound: "S says /s/! Seal!" },
    { letter: "N", word: "North", emoji: "🧭", sound: "N says /n/! North!" },
    { letter: "W", word: "Whale", emoji: "🐋", sound: "W says /w/! Whale!" },
    { letter: "F", word: "Fox", emoji: "🦊", sound: "F says /f/! Fox!" },
    { letter: "O", word: "Owl", emoji: "🦉", sound: "O says /o/! Owl!" },
    { letter: "C", word: "Cold", emoji: "❄️", sound: "C says /k/! Cold!" },
  ],
  "kitchen-world": [
    { letter: "A", word: "Apple", emoji: "🍎", sound: "A says /æ/! Apple!" },
    { letter: "B", word: "Bread", emoji: "🍞", sound: "B says /b/! Bread!" },
    { letter: "S", word: "Soup", emoji: "🍲", sound: "S says /s/! Soup!" },
    { letter: "M", word: "Milk", emoji: "🥛", sound: "M says /m/! Milk!" },
    { letter: "P", word: "Pear", emoji: "🍐", sound: "P says /p/! Pear!" },
    { letter: "C", word: "Corn", emoji: "🌽", sound: "C says /k/! Corn!" },
    { letter: "T", word: "Tea", emoji: "🍵", sound: "T says /t/! Tea!" },
    { letter: "J", word: "Jam", emoji: "🍓", sound: "J says /j/! Jam!" },
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
  ],
  "bug-world": [
    { letter: "B", word: "Bee", emoji: "🐝", sound: "B says /b/! Bee!" },
    { letter: "A", word: "Ant", emoji: "🐜", sound: "A says /æ/! Ant!" },
    { letter: "L", word: "Ladybug", emoji: "🐞", sound: "L says /l/! Ladybug!" },
    { letter: "W", word: "Worm", emoji: "🪱", sound: "W says /w/! Worm!" },
    { letter: "S", word: "Snail", emoji: "🐌", sound: "S says /s/! Snail!" },
    { letter: "C", word: "Caterpillar", emoji: "🐛", sound: "C says /k/! Caterpillar!" },
    { letter: "F", word: "Fly", emoji: "🪰", sound: "F says /f/! Fly!" },
    { letter: "M", word: "Moth", emoji: "🦋", sound: "M says /m/! Moth!" },
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
  ],
  "creative-world": [
    { letter: "P", word: "Paint", emoji: "🎨", sound: "P says /p/! Paint!" },
    { letter: "B", word: "Bead", emoji: "🟣", sound: "B says /b/! Bead!" },
    { letter: "S", word: "Song", emoji: "🎵", sound: "S says /s/! Song!" },
    { letter: "C", word: "Color", emoji: "🌈", sound: "C says /k/! Color!" },
    { letter: "H", word: "Heart", emoji: "💖", sound: "H says /h/! Heart!" },
    { letter: "D", word: "Drum", emoji: "🥁", sound: "D says /d/! Drum!" },
    { letter: "N", word: "Note", emoji: "🎶", sound: "N says /n/! Note!" },
    { letter: "A", word: "Art", emoji: "🖼️", sound: "A says /ɑ/! Art!" },
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
  ],
  "my-world": [
    { letter: "H", word: "Home", emoji: "🏠", sound: "H says /h/! Home!" },
    { letter: "B", word: "Brush", emoji: "🪥", sound: "B says /b/! Brush!" },
    { letter: "S", word: "Smile", emoji: "😊", sound: "S says /s/! Smile!" },
    { letter: "M", word: "Mum", emoji: "👩", sound: "M says /m/! Mum!" },
    { letter: "T", word: "Teeth", emoji: "🦷", sound: "T says /t/! Teeth!" },
    { letter: "F", word: "Family", emoji: "👨‍👩‍👧", sound: "F says /f/! Family!" },
    { letter: "C", word: "Cup", emoji: "🥤", sound: "C says /k/! Cup!" },
    { letter: "L", word: "Love", emoji: "❤️", sound: "L says /l/! Love!" },
  ],
  "adventure-world": [
    { letter: "M", word: "Map", emoji: "🗺️", sound: "M says /m/! Map!" },
    { letter: "T", word: "Trail", emoji: "🥾", sound: "T says /t/! Trail!" },
    { letter: "R", word: "Rocket", emoji: "🚀", sound: "R says /r/! Rocket!" },
    { letter: "P", word: "Pine", emoji: "🌲", sound: "P says /p/! Pine!" },
    { letter: "G", word: "Gem", emoji: "💎", sound: "G says /g/! Gem!" },
    { letter: "C", word: "Cave", emoji: "🕳️", sound: "C says /k/! Cave!" },
    { letter: "S", word: "Star", emoji: "⭐", sound: "S says /s/! Star!" },
    { letter: "F", word: "Forest", emoji: "🌳", sound: "F says /f/! Forest!" },
  ],
  "learning-world": [
    { letter: "A", word: "A", emoji: "🅰️", sound: "A says /æ/! Letter A!" },
    { letter: "B", word: "Book", emoji: "📘", sound: "B says /b/! Book!" },
    { letter: "C", word: "Count", emoji: "🔢", sound: "C says /k/! Count!" },
    { letter: "D", word: "Dot", emoji: "🔵", sound: "D says /d/! Dot!" },
    { letter: "S", word: "Shape", emoji: "🔷", sound: "S says /s/! Shape!" },
    { letter: "T", word: "Ten", emoji: "🔟", sound: "T says /t/! Ten!" },
    { letter: "M", word: "Map", emoji: "🗺️", sound: "M says /m/! Map!" },
    { letter: "P", word: "Pen", emoji: "✏️", sound: "P says /p/! Pen!" },
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
    green: { title: "Pea Green!", emoji: "🫛", phrase: "Blue plus Yellow makes garden pea Green!" },
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
    green: { title: "Go Green!", emoji: "🟢", phrase: "Blue plus Yellow means go at the lights!" },
    purple: { title: "Night Bus Purple!", emoji: "🚌", phrase: "Red plus Blue paints the evening bus!" },
  },
  "bug-world": {
    orange: { title: "Ladybug Orange!", emoji: "🐞", phrase: "Red plus Yellow paints a sunny wing!" },
    green: { title: "Leaf Green!", emoji: "🍃", phrase: "Blue plus Yellow makes a juicy leaf!" },
    purple: { title: "Flower Purple!", emoji: "💜", phrase: "Red plus Blue makes a clover bloom!" },
  },
  "creative-world": {
    orange: { title: "Paint Orange!", emoji: "🎨", phrase: "Red plus Yellow on the atelier paper!" },
    green: { title: "Bead Green!", emoji: "🟢", phrase: "Blue plus Yellow strings a green bead!" },
    purple: { title: "Ink Purple!", emoji: "🟣", phrase: "Red plus Blue makes royal studio ink!" },
  },
  "animal-world": {
    orange: { title: "Mane Orange!", emoji: "🦁", phrase: "Red plus Yellow paints a lion mane!" },
    green: { title: "Pasture Green!", emoji: "🐄", phrase: "Blue plus Yellow grows clover for the cow!" },
    purple: { title: "Berry Purple!", emoji: "🍇", phrase: "Red plus Blue makes a jungle berry!" },
  },
  "city-world": {
    orange: { title: "Brick Orange!", emoji: "🧱", phrase: "Red plus Yellow paints a warm brick!" },
    green: { title: "Park Green!", emoji: "🌳", phrase: "Blue plus Yellow grows the town park!" },
    purple: { title: "Dusk Purple!", emoji: "🌆", phrase: "Red plus Blue paints the evening square!" },
  },
  "story-world": {
    orange: { title: "Crown Orange!", emoji: "👑", phrase: "Red plus Yellow gilds the tale crown!" },
    green: { title: "Page Green!", emoji: "📗", phrase: "Blue plus Yellow binds a garden chapter!" },
    purple: { title: "Ink Purple!", emoji: "🟣", phrase: "Red plus Blue writes the night chapter!" },
  },
  "my-world": {
    orange: { title: "Soap Orange!", emoji: "🧼", phrase: "Red plus Yellow makes a peachy wash!" },
    green: { title: "Tooth Green!", emoji: "🪥", phrase: "Blue plus Yellow is minty brush foam!" },
    purple: { title: "Hug Purple!", emoji: "💜", phrase: "Red plus Blue is a bedtime hug!" },
  },
  "adventure-world": {
    orange: { title: "Camp Orange!", emoji: "🔥", phrase: "Red plus Yellow lights a trail fire!" },
    green: { title: "Pine Green!", emoji: "🌲", phrase: "Blue plus Yellow paints the forest!" },
    purple: { title: "Cave Purple!", emoji: "🟣", phrase: "Red plus Blue colours the gem cave!" },
  },
  "learning-world": {
    orange: { title: "Pencil Orange!", emoji: "✏️", phrase: "Red plus Yellow sharpens a sunset pencil!" },
    green: { title: "Tick Green!", emoji: "✅", phrase: "Blue plus Yellow ticks a correct count!" },
    purple: { title: "Ink Purple!", emoji: "🟣", phrase: "Red plus Blue writes a royal letter!" },
  },
};

const defaultCounting: ThemedCountItem[] = [
  { name: "Shiny Stars", emoji: "⭐", sound: "Twinkle twinkle!", bg: "from-purple-900 to-indigo-900", text: "text-amber-300" },
  { name: "Sweet Apples", emoji: "🍎", sound: "Crisp and juicy!", bg: "from-amber-900 to-red-900", text: "text-red-300" },
  { name: "Rainbow Balloons", emoji: "🎈", sound: "Pop float up!", bg: "from-violet-900 to-purple-950", text: "text-purple-200" },
];

const COUNTING_BY_WORLD: Record<string, ThemedCountItem[]> = {
  "kitchen-world": [
    { name: "Red Apples", emoji: "🍎", sound: "Crunch!", bg: "from-rose-900 to-orange-900", text: "text-rose-200" },
    { name: "Warm Buns", emoji: "🍞", sound: "Mmm bread!", bg: "from-amber-900 to-yellow-900", text: "text-amber-200" },
    { name: "Soup Spoons", emoji: "🥄", sound: "Stir stir!", bg: "from-orange-900 to-rose-900", text: "text-orange-200" },
  ],
  "arctic-world": [
    { name: "Snowflakes", emoji: "❄️", sound: "Soft snow!", bg: "from-sky-900 to-indigo-950", text: "text-cyan-200" },
    { name: "Penguins", emoji: "🐧", sound: "Honk honk!", bg: "from-slate-900 to-sky-950", text: "text-sky-200" },
    { name: "Ice Cubes", emoji: "🧊", sound: "Clink!", bg: "from-cyan-900 to-blue-950", text: "text-cyan-100" },
  ],
  "vehicle-world": [
    { name: "Yellow Buses", emoji: "🚌", sound: "Beep beep!", bg: "from-amber-900 to-yellow-900", text: "text-yellow-200" },
    { name: "Little Cars", emoji: "🚗", sound: "Vroom!", bg: "from-sky-900 to-blue-950", text: "text-sky-200" },
    { name: "Toy Planes", emoji: "✈️", sound: "Whoosh!", bg: "from-cyan-900 to-indigo-950", text: "text-cyan-200" },
  ],
  "night-world": [
    { name: "Twinkle Stars", emoji: "⭐", sound: "Twinkle!", bg: "from-indigo-950 to-slate-950", text: "text-amber-200" },
    { name: "Sleepy Owls", emoji: "🦉", sound: "Hoot!", bg: "from-violet-950 to-indigo-950", text: "text-violet-200" },
    { name: "Night Lamps", emoji: "💡", sound: "Click!", bg: "from-amber-950 to-indigo-950", text: "text-yellow-200" },
  ],
  "bug-world": [
    { name: "Busy Bees", emoji: "🐝", sound: "Buzz!", bg: "from-yellow-900 to-lime-950", text: "text-yellow-200" },
    { name: "Ladybugs", emoji: "🐞", sound: "Crawl!", bg: "from-rose-900 to-red-950", text: "text-rose-200" },
    { name: "Garden Ants", emoji: "🐜", sound: "Tiny steps!", bg: "from-stone-900 to-lime-950", text: "text-lime-200" },
  ],
  "animal-world": [
    { name: "Farm Chicks", emoji: "🐤", sound: "Cheep!", bg: "from-yellow-900 to-amber-950", text: "text-yellow-200" },
    { name: "Pond Ducks", emoji: "🦆", sound: "Quack!", bg: "from-sky-900 to-cyan-950", text: "text-yellow-200" },
    { name: "Woolly Sheep", emoji: "🐑", sound: "Baaa!", bg: "from-slate-800 to-emerald-950", text: "text-slate-100" },
  ],
  "city-world": [
    { name: "Park Trees", emoji: "🌳", sound: "Rustle!", bg: "from-emerald-900 to-green-950", text: "text-lime-200" },
    { name: "Market Bags", emoji: "🛍️", sound: "Rustle rustle!", bg: "from-pink-900 to-fuchsia-950", text: "text-pink-200" },
    { name: "Town Bells", emoji: "🔔", sound: "Ding!", bg: "from-amber-900 to-yellow-950", text: "text-amber-200" },
  ],
  "learning-world": [
    { name: "Letter Cards", emoji: "🅰️", sound: "A says /æ/!", bg: "from-rose-900 to-red-950", text: "text-rose-200" },
    { name: "Counting Dots", emoji: "🔵", sound: "Tap tap!", bg: "from-sky-900 to-blue-950", text: "text-sky-200" },
    { name: "Little Books", emoji: "📘", sound: "Flip!", bg: "from-indigo-900 to-blue-950", text: "text-indigo-200" },
  ],
  "creative-world": [
    { name: "Paint Drops", emoji: "🎨", sound: "Splash colour!", bg: "from-pink-900 to-violet-950", text: "text-pink-200" },
    { name: "Stickers", emoji: "🌟", sound: "Stick!", bg: "from-amber-900 to-yellow-950", text: "text-amber-200" },
    { name: "Crayons", emoji: "🖍️", sound: "Scribble!", bg: "from-sky-900 to-indigo-950", text: "text-sky-200" },
  ],
  "story-world": [
    { name: "Story Books", emoji: "📖", sound: "Once upon!", bg: "from-amber-900 to-orange-950", text: "text-amber-200" },
    { name: "Tale Stars", emoji: "✨", sound: "Sparkle!", bg: "from-violet-900 to-indigo-950", text: "text-violet-200" },
    { name: "Barn Eggs", emoji: "🥚", sound: "Crack!", bg: "from-yellow-900 to-lime-950", text: "text-yellow-200" },
  ],
  "my-world": [
    { name: "Family Cups", emoji: "🥛", sound: "Sip sip!", bg: "from-rose-900 to-amber-950", text: "text-rose-200" },
    { name: "Home Hearts", emoji: "❤️", sound: "Love you!", bg: "from-pink-900 to-red-950", text: "text-pink-200" },
    { name: "Toothbrushes", emoji: "🪥", sound: "Brush brush!", bg: "from-cyan-900 to-sky-950", text: "text-cyan-200" },
  ],
  "adventure-world": [
    { name: "Trail Stones", emoji: "🪨", sound: "Clack!", bg: "from-stone-900 to-emerald-950", text: "text-stone-200" },
    { name: "Forest Leaves", emoji: "🍃", sound: "Rustle!", bg: "from-lime-900 to-green-950", text: "text-lime-200" },
    { name: "Treasure Coins", emoji: "🪙", sound: "Clink!", bg: "from-amber-900 to-yellow-950", text: "text-amber-200" },
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
  ],
};

const SORTING_BY_WORLD: Record<string, ThemedSort> = {
  "kitchen-world": {
    title: "Fruit vs Kitchen Tools",
    instruction: "Put fruit in the basket. Put tools by the stove.",
    spokenPrompt: "Is it a fruit for eating, or a tool for cooking?",
    categoryA: { id: "fruit", label: "Fruit Basket", emoji: "🧺", dropZoneColor: "border-rose-400 bg-rose-950/40 text-rose-300" },
    categoryB: { id: "tool", label: "Kitchen Tools", emoji: "🥄", dropZoneColor: "border-amber-400 bg-amber-950/40 text-amber-300" },
    items: [
      { id: "apple", label: "Apple", emoji: "🍎", correctCategory: "A", soundFeedback: "Apple goes in the fruit basket!" },
      { id: "spoon", label: "Spoon", emoji: "🥄", correctCategory: "B", soundFeedback: "Spoon stirs the soup!" },
      { id: "pear", label: "Pear", emoji: "🍐", correctCategory: "A", soundFeedback: "Pear is a fruit!" },
      { id: "pot", label: "Pot", emoji: "🥘", correctCategory: "B", soundFeedback: "Pot sits on the stove!" },
      { id: "berry", label: "Berry", emoji: "🍓", correctCategory: "A", soundFeedback: "Berry is a juicy fruit!" },
      { id: "whisk", label: "Whisk", emoji: "🫧", correctCategory: "B", soundFeedback: "Whisk beats the batter!" },
      { id: "banana", label: "Banana", emoji: "🍌", correctCategory: "A", soundFeedback: "Banana peels for a snack!" },
      { id: "cup", label: "Measuring Cup", emoji: "🥤", correctCategory: "B", soundFeedback: "The cup measures the milk!" },
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
      { id: "kite", label: "Kite", emoji: "🪁", correctCategory: "A", soundFeedback: "The kite tugs in the wind!" },
      { id: "train", label: "Train", emoji: "🚂", correctCategory: "B", soundFeedback: "The train follows the rails!" },
    ],
  },
  "arctic-world": {
    title: "Ice Neighbours vs Warm Friends",
    instruction: "Who lives on the ice, and who likes the warm grass?",
    spokenPrompt: "Ice neighbour, or warm-grass friend?",
    categoryA: { id: "ice", label: "On the Ice", emoji: "🧊", dropZoneColor: "border-cyan-400 bg-cyan-950/40 text-cyan-300" },
    categoryB: { id: "warm", label: "Warm Grass", emoji: "🌳", dropZoneColor: "border-emerald-400 bg-emerald-950/40 text-emerald-300" },
    items: [
      { id: "penguin", label: "Penguin", emoji: "🐧", correctCategory: "A", soundFeedback: "Penguins huddle on the floe!" },
      { id: "lion", label: "Lion", emoji: "🦁", correctCategory: "B", soundFeedback: "Lions nap on warm grass!" },
      { id: "seal", label: "Seal", emoji: "🦭", correctCategory: "A", soundFeedback: "Seals clap on the cold shore!" },
      { id: "cow", label: "Cow", emoji: "🐄", correctCategory: "B", soundFeedback: "Cows munch clover in the meadow!" },
      { id: "bear", label: "Snow Bear", emoji: "🐻‍❄️", correctCategory: "A", soundFeedback: "The snow bear naps in a den!" },
      { id: "hen", label: "Hen", emoji: "🐔", correctCategory: "B", soundFeedback: "The hen pecks warm hay!" },
      { id: "whale", label: "Whale", emoji: "🐋", correctCategory: "A", soundFeedback: "The whale sings under the ice!" },
      { id: "pig", label: "Pig", emoji: "🐷", correctCategory: "B", soundFeedback: "The pig rolls in warm mud!" },
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
      { id: "kite", label: "Kite", emoji: "🪁", correctCategory: "A", soundFeedback: "Kites fly in the day breeze!" },
      { id: "owl", label: "Owl", emoji: "🦉", correctCategory: "B", soundFeedback: "Owls hoot after dark!" },
      { id: "bee", label: "Bee", emoji: "🐝", correctCategory: "A", soundFeedback: "Bees work in the daylight!" },
      { id: "bat", label: "Bat", emoji: "🦇", correctCategory: "B", soundFeedback: "Bats fly when the lamp is on!" },
      { id: "rooster", label: "Rooster", emoji: "🐓", correctCategory: "A", soundFeedback: "The rooster calls the morning!" },
      { id: "star", label: "Star", emoji: "⭐", correctCategory: "B", soundFeedback: "Stars wink in the night!" },
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
      { id: "beetle", label: "Beetle", emoji: "🪲", correctCategory: "A", soundFeedback: "Beetle wears a shiny coat!" },
      { id: "rose", label: "Rose", emoji: "🌹", correctCategory: "B", soundFeedback: "Rose is a garden flower!" },
      { id: "snail", label: "Snail", emoji: "🐌", correctCategory: "A", soundFeedback: "Snail slides with the bugs!" },
      { id: "sunflower", label: "Sunflower", emoji: "🌻", correctCategory: "B", soundFeedback: "Sunflower turns to the light!" },
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
      { id: "bench", label: "Bench", emoji: "🪵", correctCategory: "A", soundFeedback: "Sit on the park bench!" },
      { id: "tomato", label: "Tomato", emoji: "🍅", correctCategory: "B", soundFeedback: "Tomatoes pile at the market!" },
      { id: "bird", label: "Park bird", emoji: "🐦", correctCategory: "A", soundFeedback: "Birds sing in the town tree!" },
      { id: "coin", label: "Coin", emoji: "🪙", correctCategory: "B", soundFeedback: "Coins pay at the stall!" },
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
      { id: "wand", label: "Wand", emoji: "🪄", correctCategory: "A", soundFeedback: "Wands sparkle in tales!" },
      { id: "hay", label: "Hay", emoji: "🌾", correctCategory: "B", soundFeedback: "Hay is for the real stall!" },
      { id: "castle", label: "Castle", emoji: "🏰", correctCategory: "A", soundFeedback: "Castles stand in stories!" },
      { id: "cow", label: "Cow", emoji: "🐄", correctCategory: "B", soundFeedback: "Cows live in the real pasture!" },
    ],
  },
  "my-world": {
    title: "Wash vs Rest",
    instruction: "Wash things by the sink. Rest things by the bed.",
    spokenPrompt: "Do we wash with it, or rest with it?",
    categoryA: { id: "wash", label: "Wash", emoji: "🧼", dropZoneColor: "border-cyan-400 bg-cyan-950/40 text-cyan-300" },
    categoryB: { id: "rest", label: "Rest", emoji: "🛏️", dropZoneColor: "border-indigo-400 bg-indigo-950/40 text-indigo-300" },
    items: [
      { id: "soap", label: "Soap", emoji: "🧼", correctCategory: "A", soundFeedback: "Soap makes bubbles at the sink!" },
      { id: "pillow", label: "Pillow", emoji: "🛏️", correctCategory: "B", soundFeedback: "Pillows wait on the bed!" },
      { id: "brush", label: "Toothbrush", emoji: "🪥", correctCategory: "A", soundFeedback: "Brush circles on teeth!" },
      { id: "book", label: "Bedtime book", emoji: "📖", correctCategory: "B", soundFeedback: "A quiet book for rest!" },
      { id: "towel", label: "Towel", emoji: "🧻", correctCategory: "A", soundFeedback: "Towels dry wet hands!" },
      { id: "moon", label: "Night lamp", emoji: "💡", correctCategory: "B", soundFeedback: "The lamp glows at rest time!" },
      { id: "tap", label: "Tap", emoji: "🚰", correctCategory: "A", soundFeedback: "The tap runs for washing!" },
      { id: "teddy", label: "Teddy", emoji: "🧸", correctCategory: "B", soundFeedback: "Teddy snuggles at rest!" },
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
      { id: "coin", label: "Coin", emoji: "🪙", correctCategory: "B", soundFeedback: "Coins clink in the treasure!" },
      { id: "boot", label: "Boot", emoji: "🥾", correctCategory: "A", soundFeedback: "Boots walk the forest!" },
      { id: "map", label: "Map", emoji: "🗺️", correctCategory: "B", soundFeedback: "The map marks the treasure!" },
      { id: "owl", label: "Trail owl", emoji: "🦉", correctCategory: "A", soundFeedback: "Owls watch the pines!" },
      { id: "key", label: "Key", emoji: "🔑", correctCategory: "B", soundFeedback: "The key opens the chest!" },
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
