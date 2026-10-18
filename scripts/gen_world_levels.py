#!/usr/bin/env python3
"""Emit src/data/toddler/toddlerWorldLevelPacks.ts — unique world levels, not quiz clones."""
from pathlib import Path

def o(i, label, emoji, fb, ok, cue=None):
    return dict(i=i, label=label, emoji=emoji, fb=fb, ok=ok, cue=cue)

def A(id, title, icon, prompt, spoken, options, skill, objective, typ="clue-detective", diff=1, clue="sight", sound=None):
    return dict(id=id, title=title, icon=icon, prompt=prompt, spoken=spoken, options=options, skill=skill,
                objective=objective, typ=typ, diff=diff, clue=clue, sound=sound)

AREAS = {}

def add(key, *acts):
    AREAS.setdefault(key, []).extend(acts)

add("animal-world/farm-valley",
    A("act-farm-rooster-dawn","Dawn Rooster","🌅","A tall bird shouts from the fence at sunrise. Who woke the valley?",
      "Who is shouting from the fence at sunrise?", [
        o("rooster","Rooster","🐓","Cock-a-doodle-doo! The rooster starts the farm day.", True, "Cock-a-doodle-doo!"),
        o("owl","Night Owl","🦉","Owls call at night, not at sunrise.", False),
        o("frog","Pond Frog","🐸","Frogs croak down by the water.", False),
      ], "sci-k1-habitats", "Match a dawn call to the farm animal", "sound-detective", 1, "sound"),
    A("act-farm-count-eggs","Nest of Six","🪺","Mama hen left a nest. Count the warm eggs to six.",
      "How many eggs are in the nest?", [
        o("6","6 eggs","6️⃣","Six eggs tucked in straw.", True, "Peep!"),
        o("2","2 eggs","2️⃣","There are more than two.", False),
        o("9","9 eggs","9️⃣","Not that many this morning.", False),
      ], "math-k1-counting", "Count a six-egg nest", "counting", 2, "counting"),
    A("act-farm-pig-mud","Cool Mud Wallow","🐷","Who rolls in cool mud on a hot day?",
      "Who rolls in the cool mud?", [
        o("pig","Mud-loving Pig","🐷","Oink! Pigs use mud like sunscreen.", True, "Oink!"),
        o("cat","Barn Cat","🐱","Cats keep their fur dry.", False),
        o("goose","Goose","🪿","Geese splash in the pond, not the wallow.", False),
      ], "sci-k1-habitats", "Habitat: mud wallow", "habitat-match", 1, "habitat"),
    A("act-farm-sheep-wool","Warm Wool","🧶","Who grows a thick wool coat we can spin?",
      "Who grows the warm wool coat?", [
        o("sheep","Woolly Sheep","🐑","Baa! Soft wool for winter jumpers.", True, "Baa!"),
        o("duck","Pond Duck","🦆","Ducks have feathers, not wool.", False),
        o("goat","Nibble Goat","🐐","Goats have hair, not fluffy wool coats.", False),
      ], "sci-k1-habitats", "Farm product from the right animal", "clue-detective", 1, "riddle"),
    A("act-farm-owl-night","Barn Loft Night","🌙","After dark, quiet wings watch the loft. Who?",
      "Who watches the barn loft after dark?", [
        o("owl","Barn Owl","🦉","Hoo hoo! Night hunter in the rafters.", True, "Hoo!"),
        o("rooster","Rooster","🐓","Roosters shout at dawn.", False),
        o("lamb","Sleepy Lamb","🐑","Lambs sleep in the straw.", False),
      ], "sci-k1-habitats", "Nocturnal barn animal", "sound-detective", 2, "sound"),
    A("act-farm-sort-feed","Hay or Water","🪣","The trough is for drinking. What belongs there?",
      "What belongs in the water trough?", [
        o("water","Fresh Water","💧","Yes — animals drink clean water.", True),
        o("hay","Dry Hay","🌾","Hay goes in the hay rack.", False),
        o("boot","Muddy Boot","🥾","Boots do not belong in the trough.", False),
      ], "logic-k1-sorting", "Sort feed vs water", "sorting", 1, "sight"),
)

add("animal-world/jungle-canopy",
    A("act-jungle-snake-hiss","Vine Hiss","🌿","Sss from the thick vines. Who is tasting the air?",
      "Who is hissing in the vines?", [
        o("snake","Jungle Snake","🐍","The snake slides along the branch.", True, "Sss!"),
        o("parrot","Parrot","🦜","Parrots squawk, they do not hiss.", False),
        o("sloth","Sloth","🦥","Sloths move quietly and slowly.", False),
      ], "sci-k1-habitats", "Identify a vine animal by sound", "sound-detective", 1, "sound"),
    A("act-jungle-count-frogs","Five Leaf Frogs","🍃","Tiny frogs on five round leaves. Count them.",
      "How many frogs are on the leaves?", [
        o("5","5 frogs","5️⃣","Five frogs, five leaves.", True, "Ribbit!"),
        o("3","3 frogs","3️⃣","Count every leaf.", False),
        o("8","8 frogs","8️⃣","Not that many tonight.", False),
      ], "math-k1-counting", "Count frogs to five", "counting", 2, "counting"),
    A("act-jungle-tiger-stripes","Stripe Tracks","🐾","Huge padded prints in the ferns. Who passed?",
      "Who left the huge padded tracks?", [
        o("tiger","Tiger","🐯","A tiger moved through the ferns.", True, "Growl!"),
        o("rabbit","Rabbit","🐰","Rabbit tracks are tiny hops.", False),
        o("deer","Deer","🦌","Deer leave hoof prints.", False),
      ], "sci-k1-habitats", "Track a big cat", "clue-detective", 2, "tracks"),
    A("act-jungle-toucan-fruit","Beak Breakfast","🥭","A rainbow beak wants fruit, not fish. What does the toucan eat?",
      "What does the toucan eat in the canopy?", [
        o("fruit","Jungle Fruit","🥭","Bright fruit for a bright beak.", True),
        o("fish","River Fish","🐟","Toucans are not diving for fish.", False),
        o("hay","Farm Hay","🌾","Hay is for farm horses.", False),
      ], "sci-k1-habitats", "Diet in the canopy", "habitat-match", 1, "habitat"),
    A("act-jungle-jaguar-eyes","Night Eyes","✨","Two gold eyes in the dark understory. Who is watching?",
      "Who has gold eyes in the dark jungle?", [
        o("jaguar","Jaguar","🐆","Quiet jaguar in the understory.", True),
        o("penguin","Penguin","🐧","Penguins live on ice.", False),
        o("camel","Camel","🐪","Camels live in dry dunes.", False),
      ], "sci-k1-habitats", "Nocturnal jungle cat", "clue-detective", 2, "sight"),
    A("act-jungle-sort-river","Vine or River","🌊","The river is for swimmers. Who belongs in the river?",
      "Who belongs in the jungle river?", [
        o("caiman","Caiman","🐊","A river reptile.", True),
        o("monkey","Monkey","🐵","Monkeys keep to the vines.", False),
        o("macaw","Macaw","🦜","Macaws nest in tree holes.", False),
      ], "logic-k1-sorting", "Sort canopy vs river", "sorting", 2, "habitat"),
)

add("animal-world/ocean-reef",
    A("act-ocean-count-shells","Tide of Seven","🐚","The tide left seven shiny shells. How many?",
      "How many shells did the tide leave?", [
        o("7","7 shells","7️⃣","Seven shells in a sandy line.", True),
        o("4","4 shells","4️⃣","Count the whole line.", False),
        o("11","11 shells","1️⃣1️⃣","Not that many this tide.", False),
      ], "math-k1-counting", "Count seven shells", "counting", 2, "counting"),
    A("act-ocean-crab-sideways","Sideways Walker","🦀","Who walks sideways across the wet sand?",
      "Who walks sideways on the sand?", [
        o("crab","Shore Crab","🦀","Sideways scuttle!", True),
        o("dolphin","Dolphin","🐬","Dolphins swim, they do not scuttle.", False),
        o("gull","Gull","🐦","Gulls hop and fly.", False),
      ], "sci-k1-habitats", "Shore movement", "clue-detective", 1, "sight"),
    A("act-ocean-turtle-home","Nesting Beach","🏖️","A huge shell comes ashore at night. Where does she belong?",
      "Where does the sea turtle belong?", [
        o("sea-beach","Sea and beach","🌊","She swims the sea and nests on sand.", True),
        o("desert","Hot desert","🏜️","Too dry for a sea turtle.", False),
        o("attic","Barn attic","🏚️","That is owl country.", False),
      ], "sci-k1-habitats", "Sea turtle habitat", "habitat-match", 2, "habitat"),
    A("act-ocean-whale-blow","Blowhole Spray","💨","A fountain of mist far out. Who is breathing?",
      "Who blows mist at the surface?", [
        o("whale","Whale","🐋","A whale breathing through a blowhole.", True, "Psssh!"),
        o("shark","Shark","🦈","Sharks do not blow a fountain.", False),
        o("seal","Seal","🦭","Seals pop up but do not fountain like that.", False),
      ], "sci-k1-habitats", "Identify a whale blow", "sound-detective", 2, "sight"),
    A("act-ocean-sort-reef","Reef or Beach","🪸","The living reef is underwater. What belongs on the reef?",
      "What belongs on the living reef?", [
        o("coral","Coral","🪸","Living coral builds the reef.", True),
        o("towel","Beach towel","🏖️","Towels stay on the sand.", False),
        o("tractor","Farm tractor","🚜","Tractors belong on land fields.", False),
      ], "logic-k1-sorting", "Sort reef vs beach kit", "sorting", 1, "habitat"),
    A("act-ocean-plus-fish","Two Schools","🐠","3 yellow fish meet 2 blue fish. How many swimming together?",
      "Three yellow and two blue. How many fish in all?", [
        o("5","5 fish","5️⃣","Three and two make five.", True),
        o("32","32 fish","😵","Add the groups — do not glue the digits.", False),
        o("2","2 fish","2️⃣","Count both colours.", False),
      ], "math-k1-addition-subtraction", "Add two small schools", "counting", 2, "counting"),
)

add("animal-world/dino-valley",
    A("act-dino-count-prints","Four Prints","👣","Four giant prints in the clay. How many?",
      "How many giant prints?", [
        o("4","4 prints","4️⃣","Four stomps in a row.", True),
        o("2","2 prints","2️⃣","Look at the whole trail.", False),
        o("6","6 prints","6️⃣","Count only the clay prints you see.", False),
      ], "math-k1-counting", "Count dino prints", "counting", 1, "counting"),
    A("act-dino-spikes-back","Plate Back","🪨","Who has tall bony plates along the back?",
      "Who has plates along the back?", [
        o("stego","Stegosaurus","🦕","Plates like a ridge of stones.", True),
        o("fish","River fish","🐟","Fish have scales, not back plates.", False),
        o("bat","Cave bat","🦇","Bats have wings, not plates.", False),
      ], "sci-k1-habitats", "Identify a plated dinosaur", "clue-detective", 2, "sight"),
    A("act-dino-flyer","Cliff Glider","🪂","Leathery wings from the cliff. Who glides the valley wind?",
      "Who glides on leathery wings?", [
        o("ptero","Pterosaur","🦖","A gliding flyer of Dino Valley.", True),
        o("hen","Farm hen","🐔","Hens flutter farmyards, not dino cliffs.", False),
        o("penguin","Penguin","🐧","Penguins swim icy water.", False),
      ], "sci-k1-habitats", "Flying reptile of the valley", "habitat-match", 2, "habitat"),
    A("act-dino-eggs-sort","Nest or River","🥚","Dino eggs stay in the nest mound. What belongs there?",
      "What belongs in the nest mound?", [
        o("eggs","Warm eggs","🥚","Eggs stay buried in the mound.", True),
        o("fish","River fish","🐟","Fish belong in the river.", False),
        o("truck","Toy truck","🚚","Trucks are not nest treasures.", False),
      ], "logic-k1-sorting", "Sort nest vs river", "sorting", 1, "habitat"),
    A("act-dino-tiny-compy","Quick Little Hunter","⚡","A tiny fast hunter at your ankle, not a giant roarer. Who?",
      "Who is the tiny fast hunter?", [
        o("compy","Little Compsognathus","🦎","A small quick dinosaur.", True),
        o("trex","Giant T-Rex","🦖","T-Rex is huge, not ankle-high.", False),
        o("whale","Whale","🐋","Whales are ocean giants.", False),
      ], "sci-k1-habitats", "Size contrast in dino valley", "clue-detective", 2, "riddle"),
    A("act-dino-pattern-stomp","Stomp Pattern","🥁","Stomp stomp pause, stomp stomp pause, stomp. What comes next?",
      "Stomp stomp pause. What comes next?", [
        o("stomp","Another stomp","👣","The pattern continues: stomp.", True),
        o("roar","A roar","😮","Listen to the feet, not a roar.", False),
        o("splash","A splash","💦","No water in this pattern.", False),
      ], "logic-k1-patterns", "Stomp pattern", "pattern-match", 2, "riddle"),
)

add("adventure-world/forest-trail",
    A("act-forest-owl-hoot","Dusk Hoot","🌇","Hoo from the oak hollow at dusk. Who?",
      "Who hoots from the oak at dusk?", [
        o("owl","Forest Owl","🦉","Hoo from the hollow.", True, "Hoo!"),
        o("fox","Fox","🦊","Foxes yap, they do not hoot.", False),
        o("bee","Bee","🐝","Bees buzz in daylight flowers.", False),
      ], "sci-k1-habitats", "Dusk forest sound", "sound-detective", 1, "sound"),
    A("act-forest-count-mushrooms","Seven Caps","🍄","Seven mushroom caps by the log. Count them.",
      "How many mushroom caps?", [
        o("7","7 caps","7️⃣","Seven caps in the moss.", True),
        o("3","3 caps","3️⃣","Count the whole log.", False),
        o("10","10 caps","🔟","Not a full ten.", False),
      ], "math-k1-counting", "Count forest mushrooms", "counting", 2, "counting"),
    A("act-forest-deer-tracks","Split Hooves","🦌","Two-toed prints in the mud. Who walked the trail?",
      "Who left the two-toed prints?", [
        o("deer","Deer","🦌","Split hooves of a deer.", True),
        o("bear","Bear","🐻","Bears leave big padded paws.", False),
        o("duck","Duck","🦆","Ducks leave webbed prints by water.", False),
      ], "sci-k1-habitats", "Identify hoof tracks", "clue-detective", 2, "tracks"),
    A("act-forest-squirrel-home","Oak Store","🌰","Who hides acorns in the oak for winter?",
      "Who hides acorns in the oak?", [
        o("squirrel","Squirrel","🐿️","Acorns for winter in the oak.", True),
        o("whale","Whale","🐋","Whales do not store acorns.", False),
        o("hen","Hen","🐔","Hens scratch farmyards.", False),
      ], "sci-k1-habitats", "Forest food store", "habitat-match", 1, "habitat"),
    A("act-forest-sort-path","Path or Stream","🪵","The stepping logs are for walkers. What belongs on the path?",
      "What belongs on the walking path?", [
        o("boot","Walking boot","🥾","Boots belong on the path.", True),
        o("trout","Trout","🐟","Trout belong in the stream.", False),
        o("kite","Kite","🪁","Kites belong in open sky, not the path.", False),
      ], "logic-k1-sorting", "Sort path vs stream", "sorting", 1, "sight"),
    A("act-forest-minus-nuts","Jay Takes Two","🌰","8 acorns. A jay takes 2. How many left?",
      "Eight acorns, jay takes two. How many left?", [
        o("6","6 acorns","6️⃣","Eight take away two is six.", True),
        o("10","10 acorns","🔟","The jay took some away.", False),
        o("2","2 acorns","2️⃣","That is what the jay took, not what is left.", False),
      ], "math-k1-addition-subtraction", "Subtract forest acorns", "counting", 2, "counting"),
)

add("adventure-world/weather-adventure",
    A("act-weather-wind-chimes","Wild Chimes","🎐","The porch chimes crash together. What is the sky doing?",
      "What is making the chimes crash?", [
        o("wind","Strong wind","💨","Wind rings the chimes.", True),
        o("snow","Deep snow","❄️","Snow falls quietly.", False),
        o("night","Only night","🌙","Night is not a weather.", False),
      ], "sci-k1-weather-seasons", "Wind evidence", "clue-detective", 1, "sight"),
    A("act-weather-puddle-count","Five Puddles","💦","After rain, five puddles on the path. How many?",
      "How many puddles on the path?", [
        o("5","5 puddles","5️⃣","Five rain mirrors.", True),
        o("1","1 puddle","1️⃣","Count every puddle.", False),
        o("8","8 puddles","8️⃣","Not that many this shower.", False),
      ], "math-k1-counting", "Count rain puddles", "counting", 1, "counting"),
    A("act-weather-frost-morning","Silver Grass","🧊","The grass is silver and crunchy at dawn. What happened overnight?",
      "Why is the grass silver and crunchy?", [
        o("frost","Frost","❄️","A cold night left frost.", True),
        o("jam","Jam","🍓","Jam is not on the lawn.", False),
        o("sand","Warm sand","🏖️","Sand is not silver and crunchy here.", False),
      ], "sci-k1-weather-seasons", "Frost as weather", "clue-detective", 2, "sight"),
    A("act-weather-cloud-shade","Moving Shade","☁️","A cool moving shade slides over the yard. What made it?",
      "What made the moving shade?", [
        o("cloud","A cloud","☁️","A cloud blocked the sun.", True),
        o("lamp","A lamp","💡","Lamps do not slide over the whole yard.", False),
        o("fish","A fish","🐟","Fish do not make yard shade.", False),
      ], "sci-k1-weather-seasons", "Clouds and shade", "habitat-match", 1, "sight"),
    A("act-weather-season-nests","Quiet Nests","🪺","Birds sit on eggs in spring. Which season is nest time?",
      "Which season is nest time?", [
        o("spring","Spring","🌸","Spring is nest-building time.", True),
        o("deep-winter","Deep winter","⛄","Nests wait out deep winter.", False),
        o("dry-drawer","Sock drawer","🧦","That is not a season.", False),
      ], "sci-k1-weather-seasons", "Season for nesting", "clue-detective", 2, "riddle"),
    A("act-weather-sort-kit","Storm Kit","🌂","A storm is coming. What belongs in the storm kit?",
      "What belongs in the storm kit?", [
        o("umbrella","Umbrella","☂️","Keeps the rain off.", True),
        o("sledge","Snow sledge","🛷","A sledge is for snow days.", False),
        o("fan","Fan","🪭","A fan is for hot still air.", False),
      ], "logic-k1-sorting", "Sort weather kit", "sorting", 1, "sight"),
)

add("adventure-world/space-blastoff",
    A("act-space-count-windows","Eight Portholes","🪟","The rocket has eight round windows. How many?",
      "How many portholes on the rocket?", [
        o("8","8 windows","8️⃣","Eight round portholes.", True),
        o("3","3 windows","3️⃣","Count all the way around.", False),
        o("12","12 windows","1️⃣2️⃣","Not a dozen this ship.", False),
      ], "math-k1-counting", "Count rocket windows", "counting", 2, "counting"),
    A("act-space-sort-cabin","Cabin or Ground","🧳","The cabin is for flight. What belongs in the cabin?",
      "What belongs in the rocket cabin?", [
        o("helmet","Helmet","🧑‍🚀","Helmets fly with the crew.", True),
        o("tree","Garden tree","🌳","Trees stay on the ground.", False),
        o("cow","Farm cow","🐮","Cows stay in the pasture.", False),
      ], "logic-k1-sorting", "Sort cabin vs ground", "sorting", 1, "sight"),
    A("act-space-pattern-beep","Radio Beeps","📻","Beep beep pause, beep beep pause, beep. What comes next?",
      "Beep beep pause. What comes next?", [
        o("beep","A beep","📡","The pattern continues with a beep.", True),
        o("moo","A moo","🐮","That is a farm sound.", False),
        o("splash","A splash","🌊","No ocean in this radio.", False),
      ], "logic-k1-patterns", "Radio beep pattern", "pattern-match", 2, "riddle"),
    A("act-space-crater-home","Moon Dust","🌑","Who leaves boot prints in grey moon dust?",
      "Who leaves prints in moon dust?", [
        o("astronaut","Astronaut","🧑‍🚀","Boot prints on the moon.", True),
        o("duck","Duck","🦆","Ducks leave prints in pond mud.", False),
        o("crab","Crab","🦀","Crabs scuttle on beaches.", False),
      ], "read-k1-listening-comprehension", "Moon walker", "clue-detective", 1, "riddle"),
    A("act-space-minus-fuel","Fuel Used","⛽","10 fuel cells. The burn uses 3. How many left?",
      "Ten cells, burn uses three. How many left?", [
        o("7","7 cells","7️⃣","Ten take away three is seven.", True),
        o("13","13 cells","1️⃣3️⃣","Fuel was used, not added.", False),
        o("3","3 cells","3️⃣","That is what was used.", False),
      ], "math-k1-addition-subtraction", "Subtract fuel cells", "counting", 2, "counting"),
    A("act-space-constellation","Three-Star Line","✨","Three bright dots make a tiny line. What are you looking at?",
      "What are the three bright dots?", [
        o("stars","Stars","⭐","A little line of stars.", True),
        o("bees","Bees","🐝","Bees do not hang in a still line in space.", False),
        o("buttons","Coat buttons","🔘","Buttons stay on a coat.", False),
      ], "sci-k1-habitats", "Night sky stars", "clue-detective", 1, "sight"),
)

add("adventure-world/treasure-quest",
    A("act-treasure-count-coins","Nine Coins","🪙","Nine coins in the sand. How many?",
      "How many coins in the sand?", [
        o("9","9 coins","9️⃣","Nine coins glinting.", True),
        o("4","4 coins","4️⃣","Count the whole scatter.", False),
        o("12","12 coins","1️⃣2️⃣","Not a dozen this chest.", False),
      ], "math-k1-counting", "Count coins", "counting", 2, "counting"),
    A("act-treasure-map-x","X Marks","🗺️","The map shows a red X by the crooked palm. Where do we dig?",
      "Where does the map tell us to dig?", [
        o("palm","By the crooked palm","🌴","X marks the palm.", True),
        o("kitchen","The kitchen","🍳","The map is of the island, not a kitchen.", False),
        o("moon","The moon","🌕","No X on the moon tonight.", False),
      ], "read-k1-listening-comprehension", "Follow a map clue", "clue-detective", 1, "riddle"),
    A("act-treasure-sort-chest","Chest or Tide","📦","The chest keeps dry goods. What belongs in the chest?",
      "What belongs in the dry chest?", [
        o("map","The map","🗺️","Keep the map dry.", True),
        o("wave","A wave","🌊","Waves stay in the tide.", False),
        o("crab","A live crab","🦀","Crabs belong on the shore.", False),
      ], "logic-k1-sorting", "Sort chest vs tide", "sorting", 1, "sight"),
    A("act-treasure-key-shape","Round Keyhole","🔑","The lock is a round hole. Which key fits?",
      "Which key fits the round hole?", [
        o("round","Round key","🔵","Round key, round hole.", True),
        o("star","Star key","⭐","A star key does not match a round hole.", False),
        o("triangle","Triangle key","🔺","That shape will jam.", False),
      ], "math-k1-shapes", "Match key shape", "clue-detective", 1, "sight"),
    A("act-treasure-plus-gems","Two Pouches","💎","4 blue gems and 3 green gems. How many gems?",
      "Four blue and three green. How many gems?", [
        o("7","7 gems","7️⃣","Four and three make seven.", True),
        o("43","43 gems","😵","Add the groups.", False),
        o("3","3 gems","3️⃣","Count both pouches.", False),
      ], "math-k1-addition-subtraction", "Add gem pouches", "counting", 2, "counting"),
    A("act-treasure-parrot-clue","Mast Watch","🦜","The pirate parrot shouts from the mast, not the kitchen. Where is the parrot?",
      "Where is the parrot shouting from?", [
        o("mast","The mast","⛵","High on the mast.", True),
        o("oven","The oven","🔥","Parrots do not shout from ovens.", False),
        o("cave-only","A closed cave","🕳️","Listen — the shout is from the ship.", False),
      ], "read-k1-listening-comprehension", "Listen for location", "clue-detective", 2, "riddle"),
    A("act-treasure-pattern-flag","Flag Code","🏴‍☠️","Red flag, black flag, red flag, black flag, red. What comes next?",
      "Red, black, red, black, red. What comes next?", [
        o("black","Black flag","⬛","The pattern continues black.", True),
        o("green","Green flag","🟩","Green is not in this code.", False),
        o("red","Red flag","🟥","Red just happened. Next is black.", False),
      ], "logic-k1-patterns", "AB flag pattern", "pattern-match", 2, "riddle"),
)

add("creative-world/color-studio",
    A("act-color-mix-purple","Berry Mix","🍇","Red jam plus blue jam on the plate. What colour appears?",
      "Red and blue jam. What colour?", [
        o("purple","Purple","🟣","Red and blue make purple.", True),
        o("yellow","Yellow","🟡","Yellow needs different paints.", False),
        o("brown-toast","Toast brown","🟤","That is toasted bread, not this mix.", False),
      ], None, "Mix red and blue", "color-lab", 1, "creative"),
    A("act-color-mix-green-leaf","Leaf Mix","🍃","Yellow sun paint plus blue water paint. What colour is the leaf?",
      "Yellow plus blue. What colour?", [
        o("green","Green","🟢","Yellow and blue make green.", True),
        o("red","Red","🔴","Red is not this mix.", False),
        o("white","White","⚪","White is not mixed here.", False),
      ], None, "Mix yellow and blue", "color-lab", 1, "creative"),
    A("act-color-sort-warm","Warm Basket","🔥","Warm colours feel like fire. Which is warm?",
      "Which colour is warm like fire?", [
        o("orange","Orange","🟠","Orange is a warm colour.", True),
        o("ice-blue","Ice blue","🔵","Ice blue feels cool.", False),
        o("leaf-green","Leaf green","🟢","Leaf green is cooler, like shade.", False),
      ], "logic-k1-sorting", "Sort warm vs cool", "sorting", 2, "sight"),
    A("act-color-count-pots","Six Pots","🎨","Six paint pots on the bench. How many?",
      "How many paint pots?", [
        o("6","6 pots","6️⃣","Six pots in a row.", True),
        o("2","2 pots","2️⃣","Count the whole bench.", False),
        o("9","9 pots","9️⃣","Not nine today.", False),
      ], "math-k1-counting", "Count paint pots", "counting", 1, "counting"),
    A("act-color-shadow","Darker Same","🌑","The same red, but in the shade. Is it a new colour or darker red?",
      "Is shady red a new colour, or darker red?", [
        o("darker","Darker red","🟥","Shade makes it darker, still red.", True),
        o("new-blue","It became blue","🔵","Shade does not switch to blue.", False),
        o("gone","The colour vanished","🚫","It is still there, just darker.", False),
      ], None, "Shade vs hue", "clue-detective", 2, "sight"),
    A("act-color-pattern-dots","Dot Pattern","🔘","Red dot, yellow dot, red dot, yellow dot, red. Next?",
      "Red, yellow, red, yellow, red. What comes next?", [
        o("yellow","Yellow dot","🟡","The pattern continues yellow.", True),
        o("blue","Blue dot","🔵","Blue is not in this pattern.", False),
        o("red","Red dot","🔴","Red just happened.", False),
      ], "logic-k1-patterns", "Colour AB pattern", "pattern-match", 1, "riddle"),
)

add("creative-world/music-garden",
    A("act-music-count-bells","Five Bells","🔔","Five garden bells in a row. How many?",
      "How many garden bells?", [
        o("5","5 bells","5️⃣","Five bells to tap.", True),
        o("2","2 bells","2️⃣","Count the whole row.", False),
        o("8","8 bells","8️⃣","Not eight this garden.", False),
      ], "math-k1-counting", "Count bells", "counting", 1, "counting"),
    A("act-music-loud-soft","Quiet Bird","🤫","The bird song is tiny. Should we crash the drum or tap softly?",
      "The bird is quiet. Loud drum or soft tap?", [
        o("soft","Soft tap","🫶","Match the quiet bird.", True),
        o("crash","Crash the drum","🥁","That would hide the bird.", False),
        o("shout","Shout","📢","Shouting covers the song.", False),
      ], None, "Dynamics: loud vs soft", "piano-melody", 1, "sound"),
    A("act-music-pattern-clap","Clap Rest","👏","Clap clap rest, clap clap rest, clap. Next?",
      "Clap clap rest. What comes next?", [
        o("clap","A clap","👏","The pattern continues with a clap.", True),
        o("stomp","A stomp","🦶","This pattern is claps, not stomps.", False),
        o("bell","A cowbell","Cowbell".join([]) or "🔔", "Stay with clap-clap-rest.", False),
      ], "logic-k1-patterns", "Clap rest pattern", "pattern-match", 2, "riddle"),
    A("act-music-high-bird","High Branch Note","🐦","The high branch bird sings a high note. Which bar is high?",
      "Which bar plays the high bird note?", [
        o("high","High bar","⬆️","High like the branch.", True),
        o("low","Low bar","⬇️","Low is the frog pond note.", False),
        o("drum-only","Only a drum","🥁","The bird is a high note, not a drum.", False),
      ], None, "High vs low pitch", "piano-melody", 1, "sound"),
    A("act-music-sort-keep","Keep or Rest","🎼","The melody is playing. Do we keep the beat or toss the stick?",
      "While the song plays, what do we do?", [
        o("keep","Keep the beat","🖐️","Keep time with the song.", True),
        o("toss","Toss the stick","🪀","We do not throw the instrument.", False),
        o("leave","Leave the garden","🚪","Stay and play the phrase.", False),
      ], "logic-k1-sorting", "Sort playing vs stopping", "sorting", 1, "riddle"),
    A("act-music-listen-who","Who Sang Last","👂","Pip hummed, then Nana hummed lower. Who sang last?",
      "Pip hummed, then Nana hummed lower. Who sang last?", [
        o("nana","Nana","👵","Nana sang last, lower.", True),
        o("pip","Pip","🧒","Pip sang first.", False),
        o("dog","The dog","🐶","No dog in this phrase.", False),
      ], "read-k1-listening-comprehension", "Listen for who", "clue-detective", 2, "sound"),
    A("act-music-frog-drum","Pond Drum","🥁","The frog pond wants a low boom, not a tiny tinkle. Which instrument?",
      "The frog pond wants a low boom. Which instrument?", [
        o("drum","Drum","🥁","A low boom for the frogs.", True, "Boom!"),
        o("bell","Tiny bell","🔔","Bells tinkle high.", False),
        o("whistle","Whistle","🎵","Whistles are thin and high.", False),
      ], None, "Match a low pond sound", "piano-melody", 1, "sound"),
)

add("creative-world/pattern-workshop",
    A("act-pattern-beads-abc","Bead ABC","📿","Red, blue, green, red, blue. Next?",
      "Red, blue, green, red, blue. What comes next?", [
        o("green","Green bead","🟢","ABC continues with green.", True),
        o("yellow","Yellow bead","🟡","Yellow is not in this chain.", False),
        o("red","Red bead","🔴","Red starts the next set after green.", False),
      ], "logic-k1-patterns", "ABC bead pattern", "pattern-match", 2, "riddle"),
    A("act-pattern-size-grow","Growing Blocks","🧱","Small, medium, big, small, medium. Next?",
      "Small, medium, big, small, medium. Next?", [
        o("big","Big block","🟦","The grow pattern continues big.", True),
        o("tiny","Tiny speck","·","Tiny is smaller than the start.", False),
        o("small","Small block","▫️","Small already just appeared two steps ago.", False),
      ], "logic-k1-patterns", "Size pattern", "pattern-match", 2, "riddle"),
    A("act-pattern-count-pegs","Eight Pegs","📍","Eight pegs on the board. How many?",
      "How many pegs on the board?", [
        o("8","8 pegs","8️⃣","Eight pegs.", True),
        o("5","5 pegs","5️⃣","Count every peg.", False),
        o("11","11 pegs","1️⃣1️⃣","Not eleven.", False),
      ], "math-k1-counting", "Count pegs", "counting", 1, "counting"),
    A("act-pattern-sort-shape","Circles Tray","⚪","Only circles on this tray. Which belongs?",
      "Which belongs on the circles tray?", [
        o("circle","Circle","⚪","A circle belongs here.", True),
        o("square","Square","⬜","Squares have corners.", False),
        o("triangle","Triangle","🔺","Triangles have three sides.", False),
      ], "math-k1-shapes", "Sort by shape", "sorting", 1, "sight"),
    A("act-pattern-same-diff","Odd Bead","🔍","Red, red, red, blue. Which bead does not belong?",
      "Red, red, red, blue. Which does not belong?", [
        o("blue","The blue bead","🔵","Blue breaks the red set.", True),
        o("all-red","All the reds","🔴","The reds match each other.", False),
        o("board","The board","🪵","The question is about beads.", False),
      ], "logic-k1-sorting", "Find the odd one", "sorting", 2, "sight"),
    A("act-pattern-repeat-stamp","Stamp Repeat"," Stamp".replace(" Stamp","🖨️"), "Star stamp, moon stamp, star stamp, moon stamp, star. Next?",
      "Star, moon, star, moon, star. Next?", [
        o("moon","Moon stamp","🌙","AB continues with moon.", True),
        o("sun","Sun stamp","☀️","Sun is not in this stamp set.", False),
        o("star","Star stamp","⭐","Star just happened.", False),
      ], "logic-k1-patterns", "Stamp AB pattern", "pattern-match", 1, "riddle"),
    A("act-pattern-workshop-plus","Two Peg Rows","🧮","4 pegs on the top row, 3 on the bottom. How many pegs?",
      "Four pegs and three pegs. How many in all?", [
        o("7","7 pegs","7️⃣","Four and three make seven.", True),
        o("43","43 pegs","😵","Add the groups — do not glue the digits.", False),
        o("3","3 pegs","3️⃣","Count both rows.", False),
      ], "math-k1-addition-subtraction", "Add two peg rows", "counting", 2, "counting"),
)

add("creative-world/sticker-atelier",
    A("act-sticker-count-stars","Ten Stickers","⭐","Ten star stickers on the page. How many?",
      "How many star stickers?", [
        o("10","10 stars","🔟","Ten stars on the page.", True),
        o("4","4 stars","4️⃣","Count the whole page.", False),
        o("7","7 stars","7️⃣","Keep counting to ten.", False),
      ], "math-k1-counting", "Count ten stickers", "counting", 2, "counting"),
    A("act-sticker-sort-page","Sky Page","🌌","The sky page is for sky things. Which sticker belongs?",
      "Which sticker belongs on the sky page?", [
        o("moon","Moon sticker","🌙","Moon belongs on the sky page.", True),
        o("boot","Boot sticker","🥾","Boots belong on the clothes page.", False),
        o("soup","Soup sticker","🍲","Soup belongs on the kitchen page.", False),
      ], "logic-k1-sorting", "Sort stickers by page", "sorting", 1, "sight"),
    A("act-sticker-shape-crown","Crown Points","👑","The crown sticker has pointy triangles. What shape are the points?",
      "What shape are the crown points?", [
        o("triangle","Triangles","🔺","Pointy triangles.", True),
        o("circle","Circles","⚪","Circles are round, not pointy.", False),
        o("square","Squares","⬜","Squares have flat tops.", False),
      ], "math-k1-shapes", "Crown points are triangles", "clue-detective", 1, "sight"),
    A("act-sticker-pattern-row","Sticker Row","🎀","Heart, star, heart, star, heart. Next?",
      "Heart, star, heart, star, heart. Next?", [
        o("star","Star","⭐","AB continues with star.", True),
        o("tree","Tree","🌳","Tree is not in this row.", False),
        o("heart","Heart","❤️","Heart just happened.", False),
      ], "logic-k1-patterns", "Sticker AB row", "pattern-match", 1, "riddle"),
    A("act-sticker-listen-place","Where It Goes","👂","Nana said: put the fish sticker on the pond page, not the sky. Where?",
      "Nana said the fish goes on the pond page. Where?", [
        o("pond","Pond page","🐟","Fish on the pond page.", True),
        o("sky","Sky page","☁️","Nana said not the sky.", False),
        o("floor","The floor","🪵","Keep it in the book.", False),
      ], "read-k1-listening-comprehension", "Follow a placement instruction", "clue-detective", 2, "riddle"),
    A("act-sticker-plus-sheets","Two Sheets","📄","5 stickers on this sheet, 2 on that sheet. How many?",
      "Five and two stickers. How many in all?", [
        o("7","7 stickers","7️⃣","Five and two make seven.", True),
        o("52","52 stickers","😵","Add the groups.", False),
        o("2","2 stickers","2️⃣","Count both sheets.", False),
      ], "math-k1-addition-subtraction", "Add sticker sheets", "counting", 2, "counting"),
    A("act-sticker-letter-s","S for Star","S","The star sticker starts with sss. Which letter?",
      "Which letter starts star?", [
        o("s","S","S","Star starts with S.", True),
        o("t","T","T","T starts tree.", False),
        o("b","B","B","B starts balloon.", False),
      ], "read-k1-alphabet-letters", "Letter S on a star sticker", "clue-detective", 1, "riddle"),
)

add("story-world/barnyard-tales",
    A("act-story-farm-who-gate","Who Opened the Gate","🚪","Pip opened the gate, then the lamb trotted out. Who opened it?",
      "Pip opened the gate, then the lamb trotted out. Who opened the gate?", [
        o("pip","Pip","🧒","Pip opened it.", True),
        o("lamb","The lamb","🐑","The lamb trotted after.", False),
        o("owl","The owl","🦉","No owl in this beat.", False),
      ], "read-k1-listening-comprehension", "Who in the farm story", "story-adventure", 1, "riddle"),
    A("act-story-farm-where-egg","Where the Egg Went","🥚","Nana tucked the egg in the basket, not the boot. Where is the egg?",
      "Nana tucked the egg in the basket. Where is it?", [
        o("basket","In the basket","🧺","In the basket.", True),
        o("boot","In the boot","🥾","Not the boot.", False),
        o("pond","In the pond","🐸","Not the pond.", False),
      ], "read-k1-listening-comprehension", "Where in the farm story", "story-adventure", 1, "riddle"),
    A("act-story-farm-count-pigs","Three Piglets","🐷","The story names three piglets in the stall. How many?",
      "How many piglets in the stall?", [
        o("3","3 piglets","3️⃣","Three piglets.", True),
        o("1","1 piglet","1️⃣","The story named three.", False),
        o("6","6 piglets","6️⃣","Not six in this stall.", False),
      ], "math-k1-counting", "Count story piglets", "counting", 1, "counting"),
    A("act-story-farm-next-beat","What Happened Next","📖","First the cock crowed. Then Pip stretched. What happened first?",
      "The cock crowed, then Pip stretched. What happened first?", [
        o("crow","The cock crowed","🐓","First the crow.", True),
        o("stretch","Pip stretched","🧒","That was second.", False),
        o("moon","The moon fell","🌙","Not in this story.", False),
      ], "read-k1-listening-comprehension", "Sequence", "story-adventure", 2, "riddle"),
    A("act-story-farm-sort-true","True on the Farm","✅","In this tale the cow gives milk. Which is true here?",
      "Which is true in this farm tale?", [
        o("milk","The cow gives milk","🥛","True in this tale.", True),
        o("wings","The cow has wings","🪽","Not in this tale.", False),
        o("ocean","The cow swims the ocean","🌊","Not this farm.", False),
      ], "read-k1-listening-comprehension", "Story truth", "clue-detective", 2, "riddle"),
    A("act-story-farm-rhyme","Hen Pen","📝","The hen is in the pen. What rhymes with hen?",
      "What rhymes with hen?", [
        o("pen","Pen","🖊️","Hen and pen rhyme.", True),
        o("cow","Cow","🐮","Cow does not rhyme with hen.", False),
        o("barn","Barn","🏠","Barn does not rhyme with hen.", False),
      ], "read-k1-phonemic-awareness", "Rhyme in the tale", "clue-detective", 1, "riddle"),
    A("act-story-farm-why-gate","Why the Gate","❓","Pip opened the gate so the lamb could reach the clover. Why?",
      "Why did Pip open the gate?", [
        o("clover","So the lamb could reach the clover","🌿","Yes — the lamb needed clover.", True),
        o("moon","To chase the moon","🌙","Not in this tale.", False),
        o("hide","To hide the lamb forever","🙈","The gate was for clover, not hiding.", False),
      ], "read-k1-listening-comprehension", "Why in the farm tale", "story-adventure", 2, "riddle"),
)

add("story-world/space-tales",
    A("act-story-space-who-waved","Who Waved","👋","The moon waved, then Pip waved back. Who waved first?",
      "The moon waved, then Pip waved back. Who waved first?", [
        o("moon","The moon","🌕","The moon waved first.", True),
        o("pip","Pip","🧒","Pip waved back.", False),
        o("cow","A cow","🐮","No cow on this moon.", False),
      ], "read-k1-listening-comprehension", "Who first", "story-adventure", 1, "riddle"),
    A("act-story-space-where-sock","Lost Sock","🧦","Pip’s red sock floated by the antenna, not the crater. Where?",
      "Where is the red sock?", [
        o("antenna","By the antenna","📡","By the antenna.", True),
        o("crater","In the crater","🌑","Not the crater.", False),
        o("kitchen","In the kitchen","🍳","Not this tale.", False),
      ], "read-k1-listening-comprehension", "Where", "story-adventure", 1, "riddle"),
    A("act-story-space-count-beeps","Four Beeps","📟","The radio made four beeps. How many?",
      "How many beeps?", [
        o("4","4 beeps","4️⃣","Four beeps.", True),
        o("1","1 beep","1️⃣","The tale said four.", False),
        o("9","9 beeps","9️⃣","Not nine.", False),
      ], "math-k1-counting", "Count story beeps", "counting", 1, "counting"),
    A("act-story-space-colour","Helmet Colour","🪖","Pip’s helmet was silver, not green. What colour?",
      "What colour was the helmet?", [
        o("silver","Silver","⚪","Silver helmet.", True),
        o("green","Green","🟢","Not green.", False),
        o("pink","Pink","🩷","Not pink in this tale.", False),
      ], "read-k1-listening-comprehension", "Detail colour", "story-adventure", 2, "riddle"),
    A("act-story-space-pattern","Blink Code","💡","Blink blink rest, blink blink rest, blink. Next?",
      "Blink blink rest. Next?", [
        o("blink","A blink","💡","The code continues with a blink.", True),
        o("song","A song","🎵","This code is blinks.", False),
        o("nap","A nap","😴","Stay with the code.", False),
      ], "logic-k1-patterns", "Blink pattern in the tale", "pattern-match", 2, "riddle"),
    A("act-story-space-home","Where They Sleep","🛏️","At the end they sleep in the cabin, not the crater. Where?",
      "Where do they sleep?", [
        o("cabin","The cabin","🚀","In the cabin.", True),
        o("crater","The crater","🌑","Not the crater.", False),
        o("pond","The pond","🐸","Not this tale.", False),
      ], "read-k1-listening-comprehension", "Ending place", "story-adventure", 1, "riddle"),
    A("act-story-space-why-cabin","Why the Cabin","🚀","They sleep in the cabin because the crater wind is cold. Why the cabin?",
      "Why do they sleep in the cabin?", [
        o("cold","The crater wind is cold","🌬️","The cabin keeps them warm.", True),
        o("party","There is a farm party","🎉","Not in this space tale.", False),
        o("fish","To feed the fish","🐟","No fish in this crater.", False),
      ], "read-k1-listening-comprehension", "Why in the space tale", "story-adventure", 2, "riddle"),
)

add("story-world/deep-sea-tales",
    A("act-story-ocean-who-lamp","Who Held the Lamp","🏮","The angler held the lamp, then the crab clapped. Who held the lamp?",
      "Who held the lamp?", [
        o("angler","The angler fish","🐠","The angler held it.", True),
        o("crab","The crab","🦀","The crab clapped after.", False),
        o("hen","The hen","🐔","No hen in this sea tale.", False),
      ], "read-k1-listening-comprehension", "Who", "story-adventure", 1, "riddle"),
    A("act-story-ocean-where-pearl","Pearl Place","Pearl".join([]) or "🤍", "The pearl hid under the pink shell, not the boot. Where?",
      "Where is the pearl?", [
        o("shell","Under the pink shell","🐚","Under the pink shell.", True),
        o("boot","In the boot","🥾","Not the boot.", False),
        o("cloud","In a cloud","☁️","Not this sea tale.", False),
      ], "read-k1-listening-comprehension", "Where", "story-adventure", 1, "riddle"),
    A("act-story-ocean-count-bubbles","Six Bubbles","🫧","Six bubbles rose past the kelp. How many?",
      "How many bubbles?", [
        o("6","6 bubbles","6️⃣","Six bubbles.", True),
        o("2","2 bubbles","2️⃣","The tale said six.", False),
        o("9","9 bubbles","9️⃣","Not nine.", False),
      ], "math-k1-counting", "Count story bubbles", "counting", 1, "counting"),
    A("act-story-ocean-minus","Fish Leave","🐟","5 fish in the cave. 1 swims out. How many stay?",
      "Five fish, one swims out. How many stay?", [
        o("4","4 fish","4️⃣","Five take away one is four.", True),
        o("6","6 fish","6️⃣","One left, not arrived.", False),
        o("1","1 fish","1️⃣","That is who left.", False),
      ], "math-k1-addition-subtraction", "Subtract in the tale", "counting", 2, "counting"),
    A("act-story-ocean-dark","Why the Lamp","🌑","The cave was dark, so the lamp mattered. Why the lamp?",
      "Why did they need the lamp?", [
        o("dark","The cave was dark","🌘","The lamp for the dark.", True),
        o("hungry","They were baking","🍞","Not this reason.", False),
        o("dance","For a dance contest","💃","Not this tale.", False),
      ], "read-k1-listening-comprehension", "Why", "story-adventure", 2, "riddle"),
    A("act-story-ocean-rhyme","Shell Well","🐚","The shell sat in the well of the rock. What rhymes with shell?",
      "What rhymes with shell?", [
        o("well","Well","🪨","Shell and well rhyme.", True),
        o("fish","Fish","🐟","Fish does not rhyme with shell.", False),
        o("wave","Wave","🌊","Wave does not rhyme with shell.", False),
      ], "read-k1-phonemic-awareness", "Rhyme", "clue-detective", 1, "riddle"),
    A("act-story-ocean-why-shell","Why the Shell","🐚","The pearl hid under the pink shell so the current would not take it. Why?",
      "Why did the pearl hide under the shell?", [
        o("current","So the current would not take it","🌊","The shell keeps it safe.", True),
        o("sun","To get more sun","☀️","This is the deep, not a sunbath.", False),
        o("farm","To visit the farm","🚜","Not this sea tale.", False),
      ], "read-k1-listening-comprehension", "Why in the sea tale", "story-adventure", 2, "riddle"),
)

add("learning-world/phonics-meadow",
    A("act-phonics-letter-m","Letter M","m", "Mmm moon. Which letter starts moon?",
      "Which letter starts moon?", [
        o("m","M","M","Moon starts with M.", True),
        o("s","S","S","S starts sun, not moon.", False),
        o("t","T","T","T starts tree.", False),
      ], "read-k1-alphabet-letters", "Letter M", "clue-detective", 1, "riddle"),
    A("act-phonics-letter-p","Letter P","p", "Puh Pip. Which letter starts Pip?",
      "Which letter starts Pip?", [
        o("p","P","P","Pip starts with P.", True),
        o("b","B","B","B is a close cousin, not this name.", False),
        o("d","D","D","D starts dog.", False),
      ], "read-k1-alphabet-letters", "Letter P", "clue-detective", 1, "riddle"),
    A("act-phonics-blend-st","St in Stem","🌱","The flower stem starts with st. Which blend?",
      "Which blend starts stem?", [
        o("st","st","st","Stem starts with st.", True),
        o("br","br","br","Br starts bread.", False),
        o("fl","fl","fl","Fl starts flag.", False),
      ], "read-k1-consonant-blends", "Blend st", "clue-detective", 2, "riddle"),
    A("act-phonics-rhyme-bug","Bug Rug","🐛","Bug. Which rhymes with bug?",
      "What rhymes with bug?", [
        o("rug","Rug","🧶","Bug and rug rhyme.", True),
        o("bee","Bee","🐝","Bee does not rhyme with bug.", False),
        o("leaf","Leaf","🍃","Leaf does not rhyme with bug.", False),
      ], "read-k1-phonemic-awareness", "Rhyme bug", "clue-detective", 1, "riddle"),
    A("act-phonics-first-sound","First Sound Sun","☀️","Sssun. What is the first sound?",
      "What is the first sound in sun?", [
        o("s","sss","S","Sun starts with sss.", True),
        o("n","nnn","N","N is the last sound.", False),
        o("u","uh","U","U is in the middle.", False),
      ], "read-k1-phonemic-awareness", "Initial sound", "clue-detective", 2, "sound"),
    A("act-phonics-count-letters","Three Letters","🔤","The word sun has three letters. How many?",
      "How many letters in sun?", [
        o("3","3 letters","3️⃣","S-U-N.", True),
        o("1","1 letter","1️⃣","There are three.", False),
        o("5","5 letters","5️⃣","Not five.", False),
      ], "math-k1-counting", "Count letters in a word", "counting", 1, "counting"),
)

add("learning-world/counting-grove",
    A("act-counting-eight-pebbles","Eight Pebbles","🪨","Eight pebbles in the grove dish. How many?",
      "How many pebbles?", [
        o("8","8 pebbles","8️⃣","Eight pebbles.", True),
        o("3","3 pebbles","3️⃣","Count the dish.", False),
        o("11","11 pebbles","1️⃣1️⃣","Not eleven.", False),
      ], "math-k1-counting", "Count eight", "counting", 2, "counting"),
    A("act-counting-ten-frame","Full Ten","🔟","The ten-frame is full. How many counters?",
      "A full ten-frame. How many?", [
        o("10","10","🔟","A full ten.", True),
        o("1","1","1️⃣","The whole frame is full.", False),
        o("5","5","5️⃣","Five would be half.", False),
      ], "math-k1-place-value", "Full ten-frame", "counting", 2, "counting"),
    A("act-counting-leftover","Fourteen Leftover","🚕","14 counters. One ten is full. How many leftover?",
      "Fourteen. One ten is full. How many leftover?", [
        o("4","4 leftover","4️⃣","Fourteen is one ten and four.", True),
        o("14","14 leftover","1️⃣4️⃣","Fourteen is the whole, not the leftover.", False),
        o("0","0 leftover","0️⃣","There are leftovers after ten.", False),
      ], "math-k1-place-value", "Tens and ones", "counting", 3, "counting"),
    A("act-counting-plus","Two Dishes","🍽️","6 berries and 1 berry. How many?",
      "Six and one. How many berries?", [
        o("7","7 berries","7️⃣","Six and one make seven.", True),
        o("61","61 berries","😵","Add the groups.", False),
        o("5","5 berries","5️⃣","We added one, not took one.", False),
      ], "math-k1-addition-subtraction", "Add grove berries", "counting", 2, "counting"),
    A("act-counting-minus","Squirrel Takes","🐿️","9 nuts. Squirrel takes 4. How many left?",
      "Nine nuts, squirrel takes four. Left?", [
        o("5","5 nuts","5️⃣","Nine take away four is five.", True),
        o("13","13 nuts","1️⃣3️⃣","Nuts were taken, not added.", False),
        o("4","4 nuts","4️⃣","That is what was taken.", False),
      ], "math-k1-addition-subtraction", "Subtract grove nuts", "counting", 2, "counting"),
    A("act-counting-more","Which Plate More","⚖️","Plate A has 3. Plate B has 7. Which has more?",
      "Three versus seven. Which has more?", [
        o("b","Plate B","7️⃣","Seven is more than three.", True),
        o("a","Plate A","3️⃣","Three is fewer.", False),
        o("same","The same","🤝","They are not the same.", False),
      ], "math-k1-counting", "Compare quantities", "counting", 1, "sight"),
    A("act-counting-pair","Pairs of Two","🧦","Four socks make pairs of two. How many pairs?",
      "Four socks in pairs of two. How many pairs?", [
        o("2","2 pairs","2️⃣","Two pairs.", True),
        o("4","4 pairs","4️⃣","Four is the socks, not the pairs.", False),
        o("8","8 pairs","8️⃣","Too many.", False),
      ], "math-k1-counting", "Count pairs", "counting", 2, "counting"),
)

add("learning-world/shapes-patterns",
    A("act-shapes-square-window","Square Window","🪟","The window has four equal sides. What shape?",
      "Four equal sides. What shape is the window?", [
        o("square","Square","⬜","A square window.", True),
        o("circle","Circle","⚪","Circles have no corners.", False),
        o("triangle","Triangle","🔺","Triangles have three sides.", False),
      ], "math-k1-shapes", "Square", "clue-detective", 1, "sight"),
    A("act-shapes-triangle-roof","Roof Points","🏠","The roof has three sides. What shape?",
      "Three sides on the roof. What shape?", [
        o("triangle","Triangle","🔺","A triangle roof.", True),
        o("square","Square","⬜","Squares have four sides.", False),
        o("circle","Circle","⚪","Circles are round.", False),
      ], "math-k1-shapes", "Triangle", "clue-detective", 1, "sight"),
    A("act-shapes-circle-well","Round Well","⭕","The well cover is perfectly round. What shape?",
      "A perfectly round cover. What shape?", [
        o("circle","Circle","⚪","A circle.", True),
        o("square","Square","⬜","Squares have corners.", False),
        o("rect","Long rectangle","▭","Rectangles have long sides and corners.", False),
      ], "math-k1-shapes", "Circle", "clue-detective", 1, "sight"),
    A("act-shapes-sort-corners","Has Corners","📐","Which shape has corners?",
      "Which shape has corners?", [
        o("square","Square","⬜","Squares have four corners.", True),
        o("circle","Circle","⚪","Circles have no corners.", False),
        o("ring","Ring","💍","A ring is round.", False),
      ], "math-k1-shapes", "Corners vs round", "sorting", 1, "sight"),
    A("act-shapes-pattern","Shape Train","🚂","Circle, square, circle, square, circle. Next?",
      "Circle, square, circle, square, circle. Next?", [
        o("square","Square","⬜","AB continues with square.", True),
        o("tri","Triangle","🔺","Triangle is not in this train.", False),
        o("circle","Circle","⚪","Circle just happened.", False),
      ], "logic-k1-patterns", "Shape AB pattern", "pattern-match", 1, "riddle"),
    A("act-shapes-count-sides","Count Sides","🔺","A triangle’s sides. How many?",
      "How many sides on a triangle?", [
        o("3","3 sides","3️⃣","Three sides.", True),
        o("4","4 sides","4️⃣","That is a square.", False),
        o("1","1 side","1️⃣","A triangle has three.", False),
      ], "math-k1-shapes", "Count triangle sides", "counting", 1, "counting"),
    A("act-shapes-rect-door","Tall Door","🚪","The door is long and has four corners, two long sides. What shape?",
      "Long, four corners. What shape is the door?", [
        o("rect","Rectangle","▭","A rectangle door.", True),
        o("circle","Circle","⚪","Doors are not round here.", False),
        o("tri","Triangle","🔺","This door is not three-sided.", False),
      ], "math-k1-shapes", "Rectangle", "clue-detective", 2, "sight"),
)

add("my-world/feelings-emotions",
    A("act-feel-sad-hug","Sad Needs","🤗","Pip’s face is wet and quiet. What helps?",
      "Pip looks sad. What helps?", [
        o("hug","A gentle hug","🤗","A hug can help sad feelings.", True),
        o("shout","A shout","📢","Shouting at sad is not help.", False),
        o("hide-forever","Hide forever","🙈","We can sit together instead.", False),
      ], None, "Respond to sad", "clue-detective", 1, "riddle"),
    A("act-feel-mad-breath","Mad Cloud","😤","Pip’s fists are tight. What first?",
      "Pip looks mad. What first?", [
        o("breath","A slow breath","🌬️","Breathe before we talk.", True),
        o("throw","Throw a cup","🥤","We do not throw.", False),
        o("bite","Bite","😬","We do not bite.", False),
      ], None, "Mad: breath first", "clue-detective", 1, "riddle"),
    A("act-feel-scared-light","Night Scare","🌙","A bump in the dark. What helps a scared body?",
      "A bump in the dark. What helps?", [
        o("light","Turn on a light","💡","Light and a grown-up help.", True),
        o("run-road","Run into the road","🚗","Stay inside and get help.", False),
        o("hide-alone","Hide alone forever","🕳️","Find a grown-up.", False),
      ], None, "Scared: light and help", "clue-detective", 2, "riddle"),
    A("act-feel-proud","Proud Chest","🏅","Pip finished the puzzle. Which face matches proud?",
      "Pip finished the puzzle. Which feeling?", [
        o("proud","Proud","😊","Proud of the finished puzzle.", True),
        o("sleepy-only","Only sleepy","😴","Maybe later — this is proud.", False),
        o("lost","Lost","🧭","The puzzle is finished, not lost.", False),
      ], None, "Name proud", "clue-detective", 1, "riddle"),
    A("act-feel-share","Two Trucks","🚚","One truck, two friends. What is kind?",
      "One truck, two friends. What is kind?", [
        o("turn","Take turns","🔄","Turns are kind.", True),
        o("grab","Grab and run","🏃","Grabbing hurts the other friend.", False),
        o("hide-toy","Hide the truck","📦","Hiding ends the play.", False),
      ], None, "Sharing", "clue-detective", 1, "riddle"),
    A("act-feel-listen","Wait to Talk","👂","Nana is still talking. What do we do?",
      "Nana is still talking. What do we do?", [
        o("wait","Wait, then talk","👂","Wait, then it is our turn.", True),
        o("shout-over","Shout over her","📢","We do not shout over.", False),
        o("leave-mid","Leave mid-sentence","🚪","Stay and listen.", False),
      ], None, "Listening turn-taking", "clue-detective", 2, "riddle"),
    A("act-feel-name-happy","Happy Face","😄","Pip’s eyes are bright and the mouth is wide. Which feeling?",
      "Bright eyes and a wide mouth. Which feeling?", [
        o("happy","Happy","😄","That face is happy.", True),
        o("mad","Mad","😠","Mad is tight, not bright and wide.", False),
        o("sleepy","Sleepy","😴","Sleepy eyes are slow, not bright.", False),
      ], None, "Name happy", "clue-detective", 1, "riddle"),
)

add("my-world/healthy-habits",
    A("act-habits-soap","Before Fruit","🧼","Hands before fruit. What do we use?",
      "Before fruit, what do we use on our hands?", [
        o("soap","Soap and water","🧼","Soap and water.", True),
        o("mud","Mud","🟤","Mud makes hands dirtier.", False),
        o("paint","Paint","🎨","Paint is for paper.", False),
      ], None, "Handwashing", "clue-detective", 1, "riddle"),
    A("act-habits-sleep","Bed Lamp","🛏️","The sky is dark and the body is slow. What is next?",
      "Dark sky, slow body. What is next?", [
        o("sleep","Sleep","😴","Time to sleep.", True),
        o("run","A long run","🏃","The body is asking for rest.", False),
        o("loud","Loud drums","🥁","Quiet helps sleep.", False),
      ], None, "Sleep cue", "clue-detective", 1, "riddle"),
    A("act-habits-water","Thirsty Play","💧","After running, the mouth is dry. What helps?",
      "Dry mouth after running. What helps?", [
        o("water","Water","💧","A drink of water.", True),
        o("dust","Dust","🌫️","Dust does not help thirst.", False),
        o("skip","Skip drinks all day","🚫","Bodies need water.", False),
      ], None, "Drink water", "clue-detective", 1, "riddle"),
    A("act-habits-nose","Sneeze","🤧","A sneeze is coming. Where does it go?",
      "A sneeze is coming. Where?", [
        o("elbow","Into the elbow","💪","Sneeze into the elbow.", True),
        o("friend","At a friend","🧒","Not at a friend.", False),
        o("food","Into the food","🍲","Not into food.", False),
      ], None, "Sneeze hygiene", "clue-detective", 2, "riddle"),
    A("act-habits-count-brushes","Ten Brushes","🪥","Ten slow brushes on the teeth. How many?",
      "How many slow brushes?", [
        o("10","10 brushes","🔟","Ten slow brushes.", True),
        o("2","2 brushes","2️⃣","Keep going to ten.", False),
        o("20","20 brushes","2️⃣0️⃣","This round is ten.", False),
      ], "math-k1-counting", "Count brush strokes", "counting", 1, "counting"),
    A("act-habits-sort-bath","Bath or Play","🛁","The bath is for washing. What belongs in the bath?",
      "What belongs in the bath?", [
        o("soap","Soap","🧼","Soap belongs in the bath.", True),
        o("book","Story book","📖","Books stay dry.", False),
        o("toast","Toast","🍞","Toast is for the table.", False),
      ], "logic-k1-sorting", "Sort bath vs play", "sorting", 1, "sight"),
)

add("my-world/family-home",
    A("act-family-who-story","Who Reads","📚","Grandpa reads the bedtime page. Who reads it?",
      "Who reads the bedtime page?", [
        o("grandpa","Grandpa","👴","Grandpa reads it.", True),
        o("kettle","The kettle","🫖","Kettles do not read.", False),
        o("boot","The boot","🥾","Boots do not read.", False),
      ], "read-k1-listening-comprehension", "Who in the family", "clue-detective", 1, "riddle"),
    A("act-family-where-cup","Pip’s Cup","🥤","Pip’s cup lives on the low shelf, not the roof. Where?",
      "Where does Pip’s cup live?", [
        o("shelf","Low shelf","🗄️","On the low shelf.", True),
        o("roof","The roof","🏠","Not the roof.", False),
        o("pond","The pond","🐸","Not the pond.", False),
      ], "read-k1-listening-comprehension", "Where at home", "clue-detective", 1, "riddle"),
    A("act-family-sort-toys","Toy Basket","🧸","Toys go in the toy basket. Which belongs there?",
      "Which belongs in the toy basket?", [
        o("block","Wooden block","🧱","Blocks are toys.", True),
        o("fork","Dinner fork","🍴","Forks go with the dishes.", False),
        o("soap","Bath soap","🧼","Soap stays in the bath.", False),
      ], "logic-k1-sorting", "Sort toys vs dishes", "sorting", 1, "sight"),
    A("act-family-count-cushions","Four Cushions","🛋️","Four cushions on the sofa. How many?",
      "How many cushions?", [
        o("4","4 cushions","4️⃣","Four cushions.", True),
        o("1","1 cushion","1️⃣","Count the whole sofa.", False),
        o("8","8 cushions","8️⃣","Not eight tonight.", False),
      ], "math-k1-counting", "Count cushions", "counting", 1, "counting"),
    A("act-family-kind","Kind Hands","🤲","Baby is sleeping. What kind hands do?",
      "Baby is sleeping. What do kind hands do?", [
        o("quiet","Move quietly","🤫","Quiet for the sleeper.", True),
        o("bang","Bang pots","🍲","Banging wakes the baby.", False),
        o("shout","Shout names","📢","Shouting wakes the baby.", False),
      ], None, "Kindness at home", "clue-detective", 1, "riddle"),
    A("act-family-pattern-chore","Chore Pattern","🧹","Sweep, rinse, sweep, rinse, sweep. Next?",
      "Sweep, rinse, sweep, rinse, sweep. Next?", [
        o("rinse","Rinse","💧","AB continues with rinse.", True),
        o("nap","Nap","😴","Not in this chore pattern.", False),
        o("sweep","Sweep","🧹","Sweep just happened.", False),
      ], "logic-k1-patterns", "Chore AB pattern", "pattern-match", 2, "riddle"),
    A("act-family-plus-plates","Set the Table","🍽️","3 plates and 3 more. How many plates?",
      "Three plates and three more. How many?", [
        o("6","6 plates","6️⃣","Three and three make six.", True),
        o("33","33 plates","😵","Add the groups.", False),
        o("3","3 plates","3️⃣","Count both stacks.", False),
      ], "math-k1-addition-subtraction", "Add plates", "counting", 2, "counting"),
)

# Fix a few broken emoji/title mistakes from generation
for acts in AREAS.values():
    for a in acts:
        a["title"] = a["title"].replace(" Stamp", "").strip()
        if a["icon"] in (" Stamp",):
            a["icon"] = "🖨️"
        if a["id"] == "act-pattern-repeat-stamp":
            a["icon"] = "🖨️"
        if a["id"] == "act-story-ocean-where-pearl":
            a["icon"] = "🤍"
        if a["id"] == "act-music-pattern-clap":
            # fix cowbell option emoji
            for opt in a["options"]:
                if opt["i"] == "bell":
                    opt["emoji"] = "🔔"

def ts_str(s):
    return '"' + s.replace("\\", "\\\\").replace('"', '\\"') + '"'

def emit_option(opt):
    extra = f', soundCue: {ts_str(opt["cue"])}' if opt.get("cue") else ""
    return (
        f'        {{ id: {ts_str(opt["i"])}, label: {ts_str(opt["label"])}, emoji: {ts_str(opt["emoji"])}, '
        f'feedback: {ts_str(opt["fb"])}, isCorrect: {"true" if opt["ok"] else "false"}{extra} }}'
    )

def emit_act(a):
    skill = "undefined" if a["skill"] is None else ts_str(a["skill"])
    opts = ",\n".join(emit_option(opt) for opt in a["options"])
    sound = f',\n      soundEffectText: {ts_str(a["sound"])}' if a.get("sound") else ""
    return f'''  {{
      id: {ts_str(a["id"])},
      title: {ts_str(a["title"])},
      type: {ts_str(a["typ"])},
      learningObjective: {ts_str(a["objective"])},
      difficulty: {a["diff"]},
      clueType: {ts_str(a["clue"])},
      clueIcon: {ts_str(a["icon"])},
      cluePrompt: {ts_str(a["prompt"])},
      spokenPrompt: {ts_str(a["spoken"])}{sound},
      options: [
{opts},
      ],
      rewardStars: 1,
      rewardXP: 0,
      replayable: true,
      skillId: {skill},
    }}'''

lines = []
lines.append('/** Extra world levels. Attached to existing areas so worlds feel like a trail, not a demo. */')
lines.append('import type { ToddlerActivity, ToddlerWorld } from "./toddlerWorldsArchitecture";')
lines.append('')
lines.append('interface PackedActivity extends Omit<ToddlerActivity, "worldId" | "areaId"> {')
lines.append('  skillId?: string;')
lines.append('}')
lines.append('')
lines.append('const PACKS: Record<string, PackedActivity[]> = {')

skills = {}
ids = set()
for key, acts in AREAS.items():
    world, area = key.split("/")
    lines.append(f'  {ts_str(key)}: [')
    for a in acts:
        if a["id"] in ids:
            raise SystemExit(f'dupe {a["id"]}')
        ids.add(a["id"])
        skills[a["id"]] = a["skill"]
        # inject world/area when attaching
        body = emit_act(a)
        lines.append(body + ",")
    lines.append("  ],")
lines.append("};")
lines.append("")
lines.append("export const WORLD_LEVEL_PACK_SKILLS: Record<string, string | undefined> = {")
for k, v in skills.items():
    skill_ts = "undefined" if v is None else ts_str(v)
    lines.append(f"  {ts_str(k)}: {skill_ts},")
lines.append("};")
lines.append("")
lines.append("""export function attachWorldLevelPacks(world: ToddlerWorld): ToddlerWorld {
  return {
    ...world,
    areas: world.areas.map((area) => {
      const extra = PACKS[`${world.id}/${area.id}`] ?? [];
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
""")

out = Path("/home/user/Student-portal-2/src/data/toddler/toddlerWorldLevelPacks.ts")
out.write_text("\n".join(lines) + "\n")
print("areas", len(AREAS), "new activities", len(ids), "with skills", len(skills))
print("wrote", out, "bytes", out.stat().st_size)
