#!/usr/bin/env python3
"""Emit src/data/toddler/toddlerWorldAtlasLands.ts — extra worlds so the atlas is vast."""
from pathlib import Path


def o(i, label, emoji, fb, ok, cue=None):
    return dict(i=i, label=label, emoji=emoji, fb=fb, ok=ok, cue=cue)


def A(id, title, icon, prompt, spoken, options, skill, objective, typ="clue-detective", diff=1, clue="sight"):
    return dict(
        id=id, title=title, icon=icon, prompt=prompt, spoken=spoken, options=options,
        skill=skill, objective=objective, typ=typ, diff=diff, clue=clue,
    )


def area(id, title, emoji, tagline, ambient, scenery, unlock, gradient, acts):
    return dict(
        id=id, title=title, emoji=emoji, tagline=tagline, ambient=ambient,
        scenery=scenery, unlock=unlock, gradient=gradient, acts=acts,
    )


def world(id, title, tagline, emoji, gradient, border, theme, goals, desc, rewards, areas):
    return dict(
        id=id, title=title, tagline=tagline, emoji=emoji, gradient=gradient,
        border=border, theme=theme, goals=goals, desc=desc, rewards=rewards, areas=areas,
    )


WORLDS = []

# ---------------------------------------------------------------------------
# Busy Roads
# ---------------------------------------------------------------------------
WORLDS.append(world(
    "vehicle-world", "Busy Roads", "Garages, runways, harbours & town traffic",
    "🚗", "from-amber-500 via-orange-500 to-yellow-500", "border-amber-400", "amber",
    ["Name land, air and water vehicles", "Count wheels and carriages", "Sort road vs sky vs sea"],
    "Pip’s town is full of engines — garage bays, a runway, a harbour and a busy high street.",
    [
        ("col-wheel-badge", "Shiny Hubcap", "🛞", "Earned after garage discoveries", 4),
        ("col-captain-hat", "Harbour Cap", "🧢", "Earned at the dock", 8),
    ],
    [
        area("garage-bay", "Sunny Garage", "🔧", "Tools, tyres and a sleepy bus",
             "Oil-scented bays, a red toolbox, and a bus waiting for its wheels.",
             ["🚗", "🚌", "🛞", "🔧", "🪣"], 0, "from-amber-200 via-yellow-100 to-orange-200 text-amber-950", [
            A("act-garage-who-bus", "Who Needs Wheels", "🚌", "A long yellow friend is missing round wheels. Who?",
              "Who is waiting for wheels in the garage?", [
                o("bus", "The school bus", "🚌", "The bus needs its round wheels.", True),
                o("fish", "A fish", "🐟", "Fish do not wait in garages.", False),
                o("cloud", "A cloud", "☁️", "Clouds float, they do not take wheels.", False),
              ], "sci-k1-habitats", "Match a garage vehicle", "clue-detective", 1, "sight"),
            A("act-garage-count-tyres", "Four Tyres", "🛞", "The car is up on the jack. Count the tyres.",
              "How many tyres does the car need?", [
                o("4", "4 tyres", "4️⃣", "Cars stand on four tyres.", True),
                o("2", "2 tyres", "2️⃣", "Bikes have two. Cars have more.", False),
                o("8", "8 tyres", "8️⃣", "Not this family car.", False),
              ], "math-k1-counting", "Count car tyres", "counting", 1, "counting"),
            A("act-garage-sort-tools", "Toolbox Tray", "🧰", "The toolbox is for tools. Which belongs?",
              "Which belongs in the toolbox?", [
                o("wrench", "Wrench", "🔧", "A wrench is a tool.", True),
                o("banana", "Banana", "🍌", "Snacks stay in the lunch tin.", False),
                o("duck", "Duck", "🦆", "Ducks do not live in toolboxes.", False),
              ], "logic-k1-sorting", "Sort tools vs snacks", "sorting", 1, "sight"),
            A("act-garage-colour-bus", "Bus Colour", "🟡", "The school bus is sunny yellow, not ocean blue. Which?",
              "What colour is the school bus?", [
                o("yellow", "Yellow", "🟡", "Sunny yellow bus.", True),
                o("blue", "Blue", "🔵", "Not this bus.", False),
                o("pink", "Pink", "🩷", "Not this bus.", False),
              ], "read-k1-listening-comprehension", "Bus colour detail", "clue-detective", 1, "riddle"),
            A("act-garage-letter-b", "B for Bus", "B", "Bus starts with buh. Which letter?",
              "Which letter starts bus?", [
                o("b", "B", "B", "Bus starts with B.", True),
                o("s", "S", "S", "S starts sun.", False),
                o("m", "M", "M", "M starts moon.", False),
              ], "read-k1-alphabet-letters", "Letter B", "clue-detective", 1, "riddle"),
            A("act-garage-pattern-bay", "Bay Lights", "💡", "Red bay, blue bay, red bay, blue bay, red. Next?",
              "Red, blue, red, blue, red. Next?", [
                o("blue", "Blue bay", "🔵", "AB continues with blue.", True),
                o("green", "Green bay", "🟢", "Green is not in this row.", False),
                o("red", "Red bay", "🔴", "Red just happened.", False),
              ], "logic-k1-patterns", "Garage AB lights", "pattern-match", 2, "riddle"),
            A("act-garage-plus-bolts", "Bolt Tins", "🔩", "3 bolts in this tin, 2 in that tin. How many?",
              "Three and two bolts. How many in all?", [
                o("5", "5 bolts", "5️⃣", "Three and two make five.", True),
                o("32", "32 bolts", "😵", "Add the groups.", False),
                o("2", "2 bolts", "2️⃣", "Count both tins.", False),
              ], "math-k1-addition-subtraction", "Add bolt tins", "counting", 2, "counting"),
            A("act-garage-shape-wheel", "Round Wheel", "⭕", "A wheel rolls because it is round. What shape?",
              "What shape is a wheel?", [
                o("circle", "Circle", "⚪", "Wheels are circles.", True),
                o("square", "Square", "⬜", "Squares do not roll well.", False),
                o("triangle", "Triangle", "🔺", "Triangles have corners.", False),
              ], "math-k1-shapes", "Wheel is a circle", "clue-detective", 1, "sight"),
        ]),
        area("town-road", "High Street", "🚦", "Lights, crossings and a fire truck",
             "A zebra crossing, a red light, and a fire truck humming at the corner.",
             ["🚦", "🚒", "🚸", "🚌", "🚓"], 2, "from-red-200 via-orange-100 to-amber-200 text-red-950", [
            A("act-road-red-light", "Stop Light", "🔴", "The top light is red. What do we do?",
              "The light is red. What do we do?", [
                o("stop", "Stop", "🛑", "Red means stop.", True),
                o("run", "Run across", "🏃", "We wait on red.", False),
                o("close-eyes", "Close our eyes", "🙈", "We watch the light.", False),
              ], "read-k1-listening-comprehension", "Red means stop", "clue-detective", 1, "riddle"),
            A("act-road-who-helps", "Who Helps Fires", "🚒", "A siren and a long red truck. Who is coming?",
              "Who rides the long red truck?", [
                o("fire", "Firefighters", "🚒", "Firefighters ride the red truck.", True, "Nee-naw!"),
                o("baker", "The baker", "🥖", "Bakers ride bakery vans.", False),
                o("duck", "A duck", "🦆", "Ducks do not drive trucks.", False),
              ], "sci-k1-habitats", "Name a helper vehicle", "sound-detective", 1, "sound"),
            A("act-road-sort-sky", "Sky or Street", "✈️", "The sky is for flyers. Which belongs in the sky?",
              "Which belongs in the sky?", [
                o("plane", "Aeroplane", "✈️", "Planes fly the sky.", True),
                o("bus", "Bus", "🚌", "Buses stay on the street.", False),
                o("boat", "Boat", "🚤", "Boats stay on water.", False),
              ], "logic-k1-sorting", "Sort sky vs street", "sorting", 1, "habitat"),
            A("act-road-count-cones", "Six Cones", "🚧", "Six safety cones along the works. How many?",
              "How many cones?", [
                o("6", "6 cones", "6️⃣", "Six cones in a line.", True),
                o("3", "3 cones", "3️⃣", "Count the whole line.", False),
                o("9", "9 cones", "9️⃣", "Not nine today.", False),
              ], "math-k1-counting", "Count road cones", "counting", 2, "counting"),
            A("act-road-cross-listen", "Look Then Cross", "👂", "Nana said: look both ways, then cross. What first?",
              "Look both ways, then cross. What first?", [
                o("look", "Look both ways", "👀", "Look first.", True),
                o("run", "Run first", "🏃", "Looking comes first.", False),
                o("hop", "Hop on one foot", "🦶", "Not this rule.", False),
              ], "read-k1-listening-comprehension", "Sequence a safety rule", "clue-detective", 2, "riddle"),
            A("act-road-letter-t", "T for Truck", "T", "Truck starts with tuh. Which letter?",
              "Which letter starts truck?", [
                o("t", "T", "T", "Truck starts with T.", True),
                o("b", "B", "B", "B starts bus.", False),
                o("p", "P", "P", "P starts Pip.", False),
              ], "read-k1-alphabet-letters", "Letter T", "clue-detective", 1, "riddle"),
            A("act-road-shape-sign", "Stop Sign Shape", "🛑", "The stop sign is not a circle. It has eight sides. Wait — toddler: it looks like a red octagon. Simpler: it is not a circle. Which is the stop sign?",
              "Which sign says stop?", [
                o("stop", "Red stop sign", "🛑", "The red stop sign.", True),
                o("heart", "A heart", "❤️", "Hearts are for stickers.", False),
                o("moon", "A moon", "🌙", "The moon is not a road sign.", False),
              ], "math-k1-shapes", "Identify the stop sign", "clue-detective", 1, "sight"),
            A("act-road-pattern-lights", "Light Pattern", "🚦", "Red, wait, green, red, wait. Next?",
              "Red, wait, green, red, wait. Next?", [
                o("green", "Green", "🟢", "The cycle continues with green.", True),
                o("purple", "Purple", "🟣", "Traffic lights are not purple.", False),
                o("red", "Red", "🔴", "Red already just happened two steps ago.", False),
              ], "logic-k1-patterns", "Traffic light cycle", "pattern-match", 2, "riddle"),
        ]),
        area("airport-runway", "Windy Runway", "✈️", "Planes, hangars and a control tower",
             "A long runway, a spinning beacon, and a plane ready to whoosh.",
             ["✈️", "🛫", "🗼", "🧳", "☁️"], 4, "from-sky-200 via-blue-100 to-cyan-200 text-sky-950", [
            A("act-air-whoosh", "Who Whooshes", "🛫", "A huge whoosh down the runway. Who is taking off?",
              "Who whooshes down the runway?", [
                o("plane", "Aeroplane", "✈️", "The plane takes off.", True, "Whoosh!"),
                o("cow", "A cow", "🐮", "Cows stay in fields.", False),
                o("sub", "A submarine", "潜艇".join([]) or "🚤", "Subs stay under water.", False),
              ], "sci-k1-habitats", "Identify a takeoff", "sound-detective", 1, "sound"),
            A("act-air-count-planes", "Five Planes", "🛩️", "Five little planes on the apron. How many?",
              "How many planes?", [
                o("5", "5 planes", "5️⃣", "Five planes.", True),
                o("2", "2 planes", "2️⃣", "Count the whole apron.", False),
                o("8", "8 planes", "8️⃣", "Not eight this morning.", False),
              ], "math-k1-counting", "Count planes", "counting", 1, "counting"),
            A("act-air-sort-bags", "Bag Belt", "🧳", "The belt is for bags. Which belongs?",
              "Which belongs on the bag belt?", [
                o("bag", "Suitcase", "🧳", "Bags ride the belt.", True),
                o("penguin", "Penguin", "🐧", "Penguins do not ride belts.", False),
                o("tree", "A tree", "🌳", "Trees stay in the ground.", False),
              ], "logic-k1-sorting", "Sort bags vs not", "sorting", 1, "sight"),
            A("act-air-where-pilot", "Where the Pilot Sits", "🧑‍✈️", "The pilot sits in the cockpit up front, not the cargo hold. Where?",
              "Where does the pilot sit?", [
                o("cockpit", "Cockpit", "🪟", "Up front in the cockpit.", True),
                o("hold", "Cargo hold", "📦", "Bags go in the hold.", False),
                o("pond", "The pond", "🐸", "Not this runway.", False),
              ], "read-k1-listening-comprehension", "Where in the plane", "clue-detective", 2, "riddle"),
            A("act-air-letter-p", "P for Plane", "P", "Plane starts with puh. Which letter?",
              "Which letter starts plane?", [
                o("p", "P", "P", "Plane starts with P.", True),
                o("b", "B", "B", "B starts bus.", False),
                o("s", "S", "S", "S starts sun.", False),
              ], "read-k1-alphabet-letters", "Letter P", "clue-detective", 1, "riddle"),
            A("act-air-plus-seats", "Two Rows", "💺", "4 seats in this row, 3 in that row. How many?",
              "Four and three seats. How many?", [
                o("7", "7 seats", "7️⃣", "Four and three make seven.", True),
                o("43", "43 seats", "😵", "Add the groups.", False),
                o("3", "3 seats", "3️⃣", "Count both rows.", False),
              ], "math-k1-addition-subtraction", "Add seat rows", "counting", 2, "counting"),
            A("act-air-shape-window", "Round Window", "🪟", "Cabin windows are round ovals. Which is most like a window?",
              "Which shape is most like a cabin window?", [
                o("oval", "Oval", "⬭", "Cabin windows are oval.", True),
                o("star", "Star", "⭐", "Stars are for night stickers.", False),
                o("triangle", "Triangle", "🔺", "Not this cabin.", False),
              ], "math-k1-shapes", "Window shape", "clue-detective", 2, "sight"),
            A("act-air-pattern-beacons", "Beacon Blink", "💡", "Blink rest blink rest blink. Next?",
              "Blink, rest, blink, rest, blink. Next?", [
                o("rest", "A rest", "😴", "AB continues with rest.", True),
                o("song", "A song", "🎵", "This pattern is blinks.", False),
                o("blink", "A blink", "💡", "Blink just happened.", False),
              ], "logic-k1-patterns", "Beacon AB", "pattern-match", 1, "riddle"),
        ]),
        area("harbour-dock", "Busy Harbour", "⚓", "Boats, cranes and a ferry horn",
             "Salt air, a red crane, and a ferry sounding a low horn.",
             ["⚓", "🚢", "🛶", "🦀", "🪝"], 6, "from-cyan-200 via-teal-100 to-blue-200 text-cyan-950", [
            A("act-dock-horn", "Ferry Horn", "🚢", "A low hoooorn across the water. Who is leaving the dock?",
              "Who sounds the low horn?", [
                o("ferry", "The ferry", "⛴️", "The ferry is leaving.", True, "Hooorn!"),
                o("bike", "A bicycle", "🚲", "Bikes ring bells, they do not horn like that.", False),
                o("hen", "A hen", "🐔", "Hens cluck on farms.", False),
              ], "sci-k1-habitats", "Identify a ferry horn", "sound-detective", 1, "sound"),
            A("act-dock-sort-water", "Water Lane", "🌊", "The harbour lane is for boats. Which belongs on the water?",
              "Which belongs on the water?", [
                o("boat", "Boat", "🚤", "Boats belong on the water.", True),
                o("bus", "Bus", "🚌", "Buses stay on roads.", False),
                o("plane", "Plane", "✈️", "Planes use the sky.", False),
              ], "logic-k1-sorting", "Sort water vehicles", "sorting", 1, "habitat"),
            A("act-dock-count-buoys", "Seven Buoys", "🔴", "Seven round buoys bob in a line. How many?",
              "How many buoys?", [
                o("7", "7 buoys", "7️⃣", "Seven buoys.", True),
                o("4", "4 buoys", "4️⃣", "Count the whole line.", False),
                o("10", "10 buoys", "🔟", "Not ten this tide.", False),
              ], "math-k1-counting", "Count buoys", "counting", 2, "counting"),
            A("act-dock-who-crane", "Who Lifts Crates", "🏗️", "A tall arm lifts a crate. What is working?",
              "What lifts the crate?", [
                o("crane", "Harbour crane", "🏗️", "The crane lifts crates.", True),
                o("kitten", "Kitten", "🐱", "Kittens do not lift crates.", False),
                o("spoon", "A spoon", "🥄", "Spoons stir soup.", False),
              ], "sci-k1-habitats", "Name a crane", "clue-detective", 1, "sight"),
            A("act-dock-letter-s", "S for Ship", "S", "Ship starts with shh. Wait — ssship. Which letter?",
              "Which letter starts ship?", [
                o("s", "S", "S", "Ship starts with S.", True),
                o("h", "H", "H", "H starts hat.", False),
                o("b", "B", "B", "B starts boat too — but this word is ship.", False),
              ], "read-k1-alphabet-letters", "Letter S", "clue-detective", 1, "riddle"),
            A("act-dock-rhyme-boat", "Boat Rhyme", "🛶", "Boat. What rhymes with boat?",
              "What rhymes with boat?", [
                o("coat", "Coat", "🧥", "Boat and coat rhyme.", True),
                o("ship", "Ship", "🚢", "Ship does not rhyme with boat.", False),
                o("dock", "Dock", "⚓", "Dock does not rhyme with boat.", False),
              ], "read-k1-phonemic-awareness", "Rhyme boat", "clue-detective", 1, "riddle"),
            A("act-dock-plus-crates", "Crate Stack", "📦", "2 crates here, 5 crates there. How many?",
              "Two and five crates. How many?", [
                o("7", "7 crates", "7️⃣", "Two and five make seven.", True),
                o("25", "25 crates", "😵", "Add the groups.", False),
                o("5", "5 crates", "5️⃣", "Count both stacks.", False),
              ], "math-k1-addition-subtraction", "Add crates", "counting", 2, "counting"),
            A("act-dock-where-anchor", "Where the Anchor Rests", "⚓", "The anchor rests on the harbour bed, not the bakery. Where?",
              "Where does the anchor rest?", [
                o("bed", "Harbour bed", "🌊", "On the harbour bed.", True),
                o("bakery", "The bakery", "🥐", "Not the bakery.", False),
                o("attic", "The attic", "🏠", "Not the attic.", False),
              ], "read-k1-listening-comprehension", "Where", "clue-detective", 2, "riddle"),
        ]),
    ],
))

# ---------------------------------------------------------------------------
# Bug Garden
# ---------------------------------------------------------------------------
WORLDS.append(world(
    "bug-world", "Bug Garden", "Beds, ponds, night jars & compost friends",
    "🐞", "from-lime-500 via-green-500 to-emerald-600", "border-lime-400", "lime",
    ["Name garden bugs by look and sound", "Count spots and legs", "Sort land bugs vs water bugs"],
    "A walled garden where ladybirds nap on leaves and crickets sing after dusk.",
    [
        ("col-leaf-badge", "Dewy Leaf", "🍃", "Earned in the flower bed", 4),
        ("col-jar-lantern", "Bug Lantern", "🏮", "Earned on a night walk", 8),
    ],
    [
        area("flower-bed", "Sunny Flower Bed", "🌼", "Bees, ladybirds and petal paths",
             "Warm petals, a watering can, and a ladybird on a leaf.",
             ["🌼", "🐝", "🐞", "🦋", "🌱"], 0, "from-lime-200 via-yellow-100 to-green-200 text-green-950", [
            A("act-bug-who-spots", "Spotty Friend", "🐞", "Tiny and round with black spots on red. Who?",
              "Who has black spots on a red back?", [
                o("lady", "Ladybird", "🐞", "A ladybird on the leaf.", True),
                o("whale", "Whale", "🐋", "Whales live in the sea.", False),
                o("bus", "Bus", "🚌", "Buses are on the road.", False),
              ], "sci-k1-habitats", "Identify a ladybird", "clue-detective", 1, "sight"),
            A("act-bug-bee-buzz", "Who Buzzes", "🐝", "Bzz from the yellow flower. Who is gathering?",
              "Who is buzzing in the flower?", [
                o("bee", "Honey bee", "🐝", "A bee gathering.", True, "Bzz!"),
                o("frog", "Frog", "🐸", "Frogs croak at the pond.", False),
                o("owl", "Owl", "🦉", "Owls call at night.", False),
              ], "sci-k1-habitats", "Bee by sound", "sound-detective", 1, "sound"),
            A("act-bug-count-spots", "Six Spots", "🔘", "This ladybird has six spots. How many?",
              "How many spots?", [
                o("6", "6 spots", "6️⃣", "Six spots.", True),
                o("2", "2 spots", "2️⃣", "Count every spot.", False),
                o("9", "9 spots", "9️⃣", "Not nine on this back.", False),
              ], "math-k1-counting", "Count spots", "counting", 2, "counting"),
            A("act-bug-sort-petal", "Petal or Pond", "🌸", "The flower bed is for petal visitors. Who belongs here?",
              "Who belongs on the flower?", [
                o("bee", "Bee", "🐝", "Bees visit flowers.", True),
                o("shark", "Shark", "🦈", "Sharks stay in the sea.", False),
                o("crane", "Crane", "🏗️", "Cranes lift harbour crates.", False),
              ], "logic-k1-sorting", "Sort flower visitors", "sorting", 1, "habitat"),
            A("act-bug-letter-b", "B for Bee", "B", "Bee starts with buh. Which letter?",
              "Which letter starts bee?", [
                o("b", "B", "B", "Bee starts with B.", True),
                o("d", "D", "D", "D starts dog.", False),
                o("s", "S", "S", "S starts sun.", False),
              ], "read-k1-alphabet-letters", "Letter B", "clue-detective", 1, "riddle"),
            A("act-bug-pattern-petals", "Petal Row", "🌸", "Yellow, pink, yellow, pink, yellow. Next?",
              "Yellow, pink, yellow, pink, yellow. Next?", [
                o("pink", "Pink", "🩷", "AB continues with pink.", True),
                o("blue", "Blue", "🔵", "Blue is not in this row.", False),
                o("yellow", "Yellow", "🟡", "Yellow just happened.", False),
              ], "logic-k1-patterns", "Petal AB", "pattern-match", 1, "riddle"),
            A("act-bug-rhyme-bee", "Bee Rhyme", "🐝", "Bee. What rhymes with bee?",
              "What rhymes with bee?", [
                o("tree", "Tree", "🌳", "Bee and tree rhyme.", True),
                o("bug", "Bug", "🐛", "Bug does not rhyme with bee.", False),
                o("leaf", "Leaf", "🍃", "Leaf does not rhyme with bee.", False),
              ], "read-k1-phonemic-awareness", "Rhyme bee", "clue-detective", 1, "riddle"),
            A("act-bug-plus-bees", "Two Blooms", "🌻", "3 bees on this bloom, 2 on that bloom. How many?",
              "Three and two bees. How many?", [
                o("5", "5 bees", "5️⃣", "Three and two make five.", True),
                o("32", "32 bees", "😵", "Add the groups.", False),
                o("2", "2 bees", "2️⃣", "Count both blooms.", False),
              ], "math-k1-addition-subtraction", "Add bees", "counting", 2, "counting"),
        ]),
        area("pond-edge", "Garden Pond", "🐸", "Skaters, dragonflies and lily pads",
             "A still pond, lily pads, and a dragonfly over the reeds.",
             ["🐸", "🐉", "🪷", "🦟", "💧"], 2, "from-teal-200 via-cyan-100 to-green-200 text-teal-950", [
            A("act-pond-dragonfly", "Who Skims", "🪰", "Long body, four bright wings skimming the pond. Who?",
              "Who skims the pond with four wings?", [
                o("dragon", "Dragonfly", "🪰", "A dragonfly over the reeds.", True),
                o("hen", "Hen", "🐔", "Hens stay in the yard.", False),
                o("truck", "Truck", "🚚", "Trucks stay on roads.", False),
              ], "sci-k1-habitats", "Identify a dragonfly", "clue-detective", 1, "sight"),
            A("act-pond-sort-water", "Pond or Path", "🪷", "The pond is for water bugs. Who belongs in the pond?",
              "Who belongs in the pond?", [
                o("skater", "Pond skater", "💧", "Skaters live on the pond skin.", True),
                o("lady", "Ladybird", "🐞", "Ladybirds stay on leaves.", False),
                o("bee", "Bee", "🐝", "Bees visit flowers.", False),
              ], "logic-k1-sorting", "Sort pond vs bed", "sorting", 2, "habitat"),
            A("act-pond-count-pads", "Eight Pads", "🪷", "Eight lily pads in a ring. How many?",
              "How many lily pads?", [
                o("8", "8 pads", "8️⃣", "Eight pads.", True),
                o("4", "4 pads", "4️⃣", "Count the whole ring.", False),
                o("11", "11 pads", "1️⃣1️⃣", "Not eleven.", False),
              ], "math-k1-counting", "Count lily pads", "counting", 2, "counting"),
            A("act-pond-frog-home", "Frog Home", "🐸", "The frog belongs by wet reeds, not the bakery. Where?",
              "Where does the frog belong?", [
                o("reeds", "Wet reeds", "🌾", "By the wet reeds.", True),
                o("bakery", "Bakery", "🥐", "Too dry and floury.", False),
                o("runway", "Runway", "🛫", "Planes, not frogs.", False),
              ], "sci-k1-habitats", "Frog habitat", "habitat-match", 1, "habitat"),
            A("act-pond-listen-plop", "Who Plopped", "👂", "A plop, then rings on the water. Who landed?",
              "Who made the plop?", [
                o("frog", "Frog", "🐸", "A frog hopped in.", True, "Plop!"),
                o("plane", "Plane", "✈️", "Planes whoosh, they do not plop here.", False),
                o("bell", "A bell", "🔔", "Bells ring, they do not plop.", False),
              ], "sci-k1-habitats", "Pond sound", "sound-detective", 2, "sound"),
            A("act-pond-letter-p", "P for Pond", "P", "Pond starts with puh. Which letter?",
              "Which letter starts pond?", [
                o("p", "P", "P", "Pond starts with P.", True),
                o("b", "B", "B", "B starts bug.", False),
                o("d", "D", "D", "D starts dog.", False),
              ], "read-k1-alphabet-letters", "Letter P", "clue-detective", 1, "riddle"),
            A("act-pond-shape-pad", "Round Pad", "⭕", "A lily pad is round and flat. What shape?",
              "What shape is the lily pad?", [
                o("circle", "Circle", "⚪", "A round pad.", True),
                o("star", "Star", "⭐", "Stars are pointy.", False),
                o("square", "Square", "⬜", "This pad is round.", False),
              ], "math-k1-shapes", "Pad is a circle", "clue-detective", 1, "sight"),
            A("act-pond-plus-frogs", "Two Banks", "🐸", "2 frogs on this bank, 4 on that bank. How many?",
              "Two and four frogs. How many?", [
                o("6", "6 frogs", "6️⃣", "Two and four make six.", True),
                o("24", "24 frogs", "😵", "Add the groups.", False),
                o("4", "4 frogs", "4️⃣", "Count both banks.", False),
              ], "math-k1-addition-subtraction", "Add frogs", "counting", 2, "counting"),
        ]),
        area("night-jar", "Night Jar Walk", "🌙", "Crickets, moths and a lantern",
             "A dark path, a warm lantern, and crickets in the grass.",
             ["🌙", "🦗", "🦋", "🏮", "⭐"], 4, "from-indigo-300 via-violet-200 to-slate-300 text-indigo-950", [
            A("act-night-cricket", "Who Sings Grass", "🦗", "Chirp chirp from the dark grass. Who?",
              "Who is chirping in the grass?", [
                o("cricket", "Cricket", "🦗", "A cricket in the grass.", True, "Chirp!"),
                o("cow", "Cow", "🐮", "Cows moo in the day field.", False),
                o("plane", "Plane", "✈️", "Planes whoosh the sky.", False),
              ], "sci-k1-habitats", "Cricket by sound", "sound-detective", 1, "sound"),
            A("act-night-moth", "Who Loves Lamps", "🦋", "Soft wings at the lantern, not a stinger. Who?",
              "Who comes to the lantern?", [
                o("moth", "Moth", "🦋", "A moth at the lamp.", True),
                o("shark", "Shark", "🦈", "Sharks stay in the sea.", False),
                o("bus", "Bus", "🚌", "Buses stay on roads.", False),
              ], "sci-k1-habitats", "Moth at a lamp", "clue-detective", 1, "sight"),
            A("act-night-sort-day", "Day or Night", "☀️", "The night walk is for night singers. Who belongs at night?",
              "Who belongs on the night walk?", [
                o("cricket", "Cricket", "🦗", "Crickets sing at night.", True),
                o("bee", "Bee", "🐝", "Bees work in the day flowers.", False),
                o("rooster", "Rooster", "🐓", "Roosters shout at dawn.", False),
              ], "logic-k1-sorting", "Sort day vs night bugs", "sorting", 2, "habitat"),
            A("act-night-count-moths", "Four Moths", "🦋", "Four moths on the lantern glass. How many?",
              "How many moths?", [
                o("4", "4 moths", "4️⃣", "Four moths.", True),
                o("1", "1 moth", "1️⃣", "Count the whole glass.", False),
                o("7", "7 moths", "7️⃣", "Not seven tonight.", False),
              ], "math-k1-counting", "Count moths", "counting", 1, "counting"),
            A("act-night-piano", "Lantern Lullaby", "🎹", "The lantern wants a quiet low note, not a crash. Play the quiet garden piano.",
              "Play a quiet lullaby for the lantern moths.", [
                o("soft", "Soft notes", "🫶", "Quiet notes for night.", True),
                o("crash", "Crash", "🥁", "Too loud for moths.", False),
                o("shout", "Shout", "📢", "We play, we do not shout.", False),
              ], None, "Night piano play", "piano-melody", 1, "sound"),
            A("act-night-letter-m", "M for Moth", "M", "Moth starts with mmm. Which letter?",
              "Which letter starts moth?", [
                o("m", "M", "M", "Moth starts with M.", True),
                o("n", "N", "N", "N starts nest.", False),
                o("s", "S", "S", "S starts sun.", False),
              ], "read-k1-alphabet-letters", "Letter M", "clue-detective", 1, "riddle"),
            A("act-night-listen-who", "Who Spoke Last", "👂", "Pip whispered, then Nana whispered lower. Who spoke last?",
              "Pip whispered, then Nana. Who spoke last?", [
                o("nana", "Nana", "👵", "Nana spoke last.", True),
                o("pip", "Pip", "🧒", "Pip spoke first.", False),
                o("dog", "The dog", "🐶", "No dog in this whisper.", False),
              ], "read-k1-listening-comprehension", "Who last", "clue-detective", 2, "sound"),
            A("act-night-pattern-lamp", "Lamp Blink", "🏮", "Glow, dim, glow, dim, glow. Next?",
              "Glow, dim, glow, dim, glow. Next?", [
                o("dim", "Dim", "🌑", "AB continues with dim.", True),
                o("crash", "Crash", "💥", "This pattern is glows.", False),
                o("glow", "Glow", "✨", "Glow just happened.", False),
              ], "logic-k1-patterns", "Lantern AB", "pattern-match", 1, "riddle"),
        ]),
        area("compost-heap", "Warm Compost", "🍂", "Worms, millipedes and leaf piles",
             "Warm leaves, a wooden bin, and a worm in the dark soil.",
             ["🍂", "🪱", "🪲", "🪵", "🌱"], 6, "from-amber-200 via-lime-100 to-yellow-200 text-amber-950", [
            A("act-compost-worm", "Who Digs Dark", "🪱", "Long, pink, and quiet in the soil. Who?",
              "Who digs in the dark soil?", [
                o("worm", "Worm", "🪱", "A worm in the compost.", True),
                o("dolphin", "Dolphin", "🐬", "Dolphins swim seas.", False),
                o("plane", "Plane", "✈️", "Planes fly runways.", False),
              ], "sci-k1-habitats", "Identify a worm", "clue-detective", 1, "sight"),
            A("act-compost-home", "Worm Home", "🪵", "Worms belong in damp soil, not the fridge. Where?",
              "Where does the worm belong?", [
                o("soil", "Damp soil", "🌱", "Damp soil is home.", True),
                o("fridge", "Fridge", "🧊", "Too cold and closed.", False),
                o("sky", "The sky", "☁️", "Worms do not fly.", False),
              ], "sci-k1-habitats", "Worm habitat", "habitat-match", 1, "habitat"),
            A("act-compost-sort-food", "Heap or Bin", "🍃", "The compost is for leaves and peels. Which belongs?",
              "Which belongs in the compost?", [
                o("peel", "Apple peel", "🍎", "Peels can compost.", True),
                o("boot", "A boot", "🥾", "Boots are not compost.", False),
                o("key", "A key", "🔑", "Keys stay on a hook.", False),
              ], "logic-k1-sorting", "Sort compost vs not", "sorting", 2, "sight"),
            A("act-compost-count-worms", "Five Worms", "🪱", "Five worms after the rain. How many?",
              "How many worms?", [
                o("5", "5 worms", "5️⃣", "Five worms.", True),
                o("2", "2 worms", "2️⃣", "Count every worm.", False),
                o("8", "8 worms", "8️⃣", "Not eight this rain.", False),
              ], "math-k1-counting", "Count worms", "counting", 1, "counting"),
            A("act-compost-letter-w", "W for Worm", "W", "Worm starts with wuh. Which letter?",
              "Which letter starts worm?", [
                o("w", "W", "W", "Worm starts with W.", True),
                o("m", "M", "M", "M starts moth.", False),
                o("v", "V", "V", "V starts van.", False),
              ], "read-k1-alphabet-letters", "Letter W", "clue-detective", 2, "riddle"),
            A("act-compost-plus-leaves", "Two Piles", "🍂", "4 leaves here, 4 leaves there. How many?",
              "Four and four leaves. How many?", [
                o("8", "8 leaves", "8️⃣", "Four and four make eight.", True),
                o("44", "44 leaves", "😵", "Add the groups.", False),
                o("4", "4 leaves", "4️⃣", "Count both piles.", False),
              ], "math-k1-addition-subtraction", "Add leaves", "counting", 2, "counting"),
            A("act-compost-rhyme-log", "Log Rhyme", "🪵", "Log. What rhymes with log?",
              "What rhymes with log?", [
                o("dog", "Dog", "🐶", "Log and dog rhyme.", True),
                o("leaf", "Leaf", "🍃", "Leaf does not rhyme with log.", False),
                o("worm", "Worm", "🪱", "Worm does not rhyme with log.", False),
              ], "read-k1-phonemic-awareness", "Rhyme log", "clue-detective", 1, "riddle"),
            A("act-compost-why-damp", "Why Damp", "💧", "The heap stays damp so worms can slide. Why damp?",
              "Why is the heap kept damp?", [
                o("slide", "So worms can slide", "🪱", "Damp soil helps worms move.", True),
                o("boats", "So boats can park", "🚤", "No boats in the heap.", False),
                o("fire", "To start a fire", "🔥", "We do not burn the heap.", False),
              ], "read-k1-listening-comprehension", "Why", "clue-detective", 2, "riddle"),
        ]),
    ],
))

# ---------------------------------------------------------------------------
# Market Kitchen
# ---------------------------------------------------------------------------
WORLDS.append(world(
    "kitchen-world", "Market Kitchen", "Stalls, bakery, soup pot & picnic basket",
    "🍎", "from-rose-500 via-orange-500 to-red-500", "border-rose-400", "rose",
    ["Sort fruit and veg", "Count bakers’ dozens in tiny groups", "Follow kitchen listen-and-do"],
    "A covered market that smells of bread, oranges, and Nana’s soup.",
    [
        ("col-wooden-spoon", "Wooden Spoon", "🥄", "Earned at the soup pot", 4),
        ("col-picnic-cloth", "Picnic Cloth", "🧺", "Earned packing the basket", 8),
    ],
    [
        area("fruit-stall", "Fruit Stall", "🍊", "Citrus pyramids and a hanging scale",
             "Bright oranges in pyramids and a brass scale that clinks.",
             ["🍊", "🍎", "🍌", "⚖️", "🧺"], 0, "from-orange-200 via-yellow-100 to-rose-200 text-orange-950", [
            A("act-fruit-who-orange", "Round and Orange", "🍊", "Round, bright, and citrus-smelling. Which fruit?",
              "Which fruit is round and orange?", [
                o("orange", "Orange", "🍊", "A sweet orange.", True),
                o("pea", "Pea", "🟢", "Peas are small and green.", False),
                o("loaf", "Loaf", "🍞", "Bread is for the bakery.", False),
              ], "sci-k1-habitats", "Name an orange", "clue-detective", 1, "sight"),
            A("act-fruit-count-apples", "Five Apples", "🍎", "Five red apples in the crate. How many?",
              "How many apples?", [
                o("5", "5 apples", "5️⃣", "Five apples.", True),
                o("2", "2 apples", "2️⃣", "Count the whole crate.", False),
                o("8", "8 apples", "8️⃣", "Not eight this crate.", False),
              ], "math-k1-counting", "Count apples", "counting", 1, "counting"),
            A("act-fruit-sort-veg", "Fruit or Veg", "🥕", "This crate is for crunchy veg. Which belongs?",
              "Which belongs in the veg crate?", [
                o("carrot", "Carrot", "🥕", "A carrot is a veg.", True),
                o("banana", "Banana", "🍌", "Bananas are fruit.", False),
                o("cake", "Cake", "🍰", "Cake is for the bakery.", False),
              ], "logic-k1-sorting", "Sort fruit vs veg", "sorting", 1, "sight"),
            A("act-fruit-colour-mix", "Jam Mix", "🎨", "Drop strawberry red into lemon yellow. What jam colour blooms?",
              "Red and yellow jam. What colour blooms?", [
                o("orange", "Orange jam", "🟠", "Red and yellow make orange.", True),
                o("blue", "Blue jam", "🔵", "No blue in this mix.", False),
                o("black", "Black jam", "⚫", "The mix stays warm and bright.", False),
              ], None, "Mix stall colours", "color-lab", 1, "creative"),
            A("act-fruit-letter-a", "A for Apple", "A", "Apple starts with a. Which letter?",
              "Which letter starts apple?", [
                o("a", "A", "A", "Apple starts with A.", True),
                o("b", "B", "B", "B starts banana.", False),
                o("p", "P", "P", "P starts pear.", False),
              ], "read-k1-alphabet-letters", "Letter A", "clue-detective", 1, "riddle"),
            A("act-fruit-pattern-crate", "Crate Row", "📦", "Apple, pear, apple, pear, apple. Next?",
              "Apple, pear, apple, pear, apple. Next?", [
                o("pear", "Pear", "🍐", "AB continues with pear.", True),
                o("melon", "Melon", "🍈", "Melon is not in this row.", False),
                o("apple", "Apple", "🍎", "Apple just happened.", False),
              ], "logic-k1-patterns", "Fruit AB", "pattern-match", 1, "riddle"),
            A("act-fruit-plus-pears", "Two Bags", "🛍️", "3 pears in this bag, 3 in that bag. How many?",
              "Three and three pears. How many?", [
                o("6", "6 pears", "6️⃣", "Three and three make six.", True),
                o("33", "33 pears", "😵", "Add the groups.", False),
                o("3", "3 pears", "3️⃣", "Count both bags.", False),
              ], "math-k1-addition-subtraction", "Add pears", "counting", 2, "counting"),
            A("act-fruit-rhyme-pear", "Pear Rhyme", "🍐", "Pear. What rhymes with pear?",
              "What rhymes with pear?", [
                o("bear", "Bear", "🐻", "Pear and bear rhyme.", True),
                o("apple", "Apple", "🍎", "Apple does not rhyme with pear.", False),
                o("plum", "Plum", "🟣", "Plum does not rhyme with pear.", False),
              ], "read-k1-phonemic-awareness", "Rhyme pear", "clue-detective", 1, "riddle"),
        ]),
        area("bakery-shelf", "Warm Bakery", "🥐", "Trays, buns and a flour cloud",
             "Warm air, a wooden peel, and buns in neat rows.",
             ["🥐", "🍞", "🥖", "🧁", "🌾"], 2, "from-yellow-200 via-orange-100 to-amber-200 text-amber-950", [
            A("act-bake-who-loaf", "Who Bakes", "👩‍🍳", "A tall hat and a tray of loaves. Who is working?",
              "Who is baking the loaves?", [
                o("baker", "Baker", "👩‍🍳", "The baker at the oven.", True),
                o("pilot", "Pilot", "🧑‍✈️", "Pilots fly planes.", False),
                o("frog", "Frog", "🐸", "Frogs stay by ponds.", False),
              ], "sci-k1-habitats", "Name a baker", "clue-detective", 1, "sight"),
            A("act-bake-count-buns", "Six Buns", "🧁", "Six buns on the tray. How many?",
              "How many buns?", [
                o("6", "6 buns", "6️⃣", "Six buns.", True),
                o("3", "3 buns", "3️⃣", "Count the whole tray.", False),
                o("9", "9 buns", "9️⃣", "Not nine this bake.", False),
              ], "math-k1-counting", "Count buns", "counting", 1, "counting"),
            A("act-bake-sort-oven", "Oven or Fridge", "🔥", "The oven is for baking. What belongs in the oven?",
              "What belongs in the oven?", [
                o("loaf", "A loaf", "🍞", "Loaves bake in the oven.", True),
                o("milk", "Milk", "🥛", "Milk stays cool.", False),
                o("ice", "Ice", "🧊", "Ice would melt.", False),
              ], "logic-k1-sorting", "Sort hot vs cold", "sorting", 1, "sight"),
            A("act-bake-letter-b", "B for Bread", "B", "Bread starts with br. Which letter starts bread?",
              "Which letter starts bread?", [
                o("b", "B", "B", "Bread starts with B.", True),
                o("d", "D", "D", "D starts dough — close, but this word is bread.", False),
                o("p", "P", "P", "P starts pie.", False),
              ], "read-k1-alphabet-letters", "Letter B", "clue-detective", 1, "riddle"),
            A("act-bake-blend-br", "Br in Bread", "🍞", "Bread starts with br. Which blend?",
              "Which blend starts bread?", [
                o("br", "br", "br", "Bread starts with br.", True),
                o("st", "st", "st", "St starts stem.", False),
                o("fl", "fl", "fl", "Fl starts flour — not this word.", False),
              ], "read-k1-consonant-blends", "Blend br", "clue-detective", 2, "riddle"),
            A("act-bake-pattern-tray", "Tray Pattern", "🥖", "Bun, loaf, bun, loaf, bun. Next?",
              "Bun, loaf, bun, loaf, bun. Next?", [
                o("loaf", "Loaf", "🍞", "AB continues with loaf.", True),
                o("fish", "Fish", "🐟", "Fish is not on this tray.", False),
                o("bun", "Bun", "🧁", "Bun just happened.", False),
              ], "logic-k1-patterns", "Bakery AB", "pattern-match", 1, "riddle"),
            A("act-bake-listen-where", "Where the Pie Cools", "👂", "Nana said the pie cools on the window, not the oven. Where?",
              "Where does the pie cool?", [
                o("window", "The window", "🪟", "On the window.", True),
                o("oven", "The oven", "🔥", "Nana said not the oven.", False),
                o("pond", "The pond", "🐸", "Not this kitchen.", False),
              ], "read-k1-listening-comprehension", "Where", "clue-detective", 2, "riddle"),
            A("act-bake-shape-tin", "Round Tin", "⭕", "The pie tin is round. What shape?",
              "What shape is the pie tin?", [
                o("circle", "Circle", "⚪", "A round tin.", True),
                o("square", "Square", "⬜", "This tin is round.", False),
                o("star", "Star", "⭐", "Not a star tin today.", False),
              ], "math-k1-shapes", "Tin is a circle", "clue-detective", 1, "sight"),
        ]),
        area("soup-pot", "Nana’s Soup Pot", "🍲", "Steam, spoons and a bubbling lid",
             "A deep pot, a wooden spoon, and steam that fogs the window.",
             ["🍲", "🥄", "🥕", "🧅", "🔥"], 4, "from-red-200 via-orange-100 to-yellow-200 text-red-950", [
            A("act-soup-what-stirs", "What Stirs", "🥄", "Long handle, round bowl. What stirs the soup?",
              "What stirs the soup?", [
                o("spoon", "Wooden spoon", "🥄", "The wooden spoon.", True),
                o("key", "A key", "🔑", "Keys open doors.", False),
                o("shoe", "A shoe", "👟", "Shoes stay by the door.", False),
              ], "sci-k1-habitats", "Name a spoon", "clue-detective", 1, "sight"),
            A("act-soup-count-carrots", "Four Carrots", "🥕", "Four carrots waiting for the pot. How many?",
              "How many carrots?", [
                o("4", "4 carrots", "4️⃣", "Four carrots.", True),
                o("1", "1 carrot", "1️⃣", "Count all of them.", False),
                o("7", "7 carrots", "7️⃣", "Not seven this pot.", False),
              ], "math-k1-counting", "Count carrots", "counting", 1, "counting"),
            A("act-soup-hot-cold", "Hot Pot", "♨️", "Steam means the pot is hot. What do we do?",
              "The pot is steaming. What do we do?", [
                o("wait", "Wait for a grown-up", "👵", "A grown-up lifts hot pots.", True),
                o("touch", "Touch the lid", "✋", "Hot lids burn.", False),
                o("pour-floor", "Pour on the floor", "🪵", "Soup stays in the pot.", False),
              ], "read-k1-listening-comprehension", "Hot safety", "clue-detective", 1, "riddle"),
            A("act-soup-sort-pot", "In the Pot", "🧅", "The pot is for soup things. Which belongs?",
              "Which belongs in the soup pot?", [
                o("onion", "Onion", "🧅", "Onions can go in soup.", True),
                o("sock", "A sock", "🧦", "Socks are not soup.", False),
                o("crayon", "A crayon", "🖍️", "Crayons are for paper.", False),
              ], "logic-k1-sorting", "Sort soup vs not", "sorting", 1, "sight"),
            A("act-soup-letter-s", "S for Soup", "S", "Soup starts with sss. Which letter?",
              "Which letter starts soup?", [
                o("s", "S", "S", "Soup starts with S.", True),
                o("z", "Z", "Z", "Z starts zip.", False),
                o("c", "C", "C", "C starts cup.", False),
              ], "read-k1-alphabet-letters", "Letter S", "clue-detective", 1, "riddle"),
            A("act-soup-plus-spoons", "Set Spoons", "🥄", "2 spoons out, 3 more from the drawer. How many?",
              "Two and three spoons. How many?", [
                o("5", "5 spoons", "5️⃣", "Two and three make five.", True),
                o("23", "23 spoons", "😵", "Add the groups.", False),
                o("3", "3 spoons", "3️⃣", "Count both lots.", False),
              ], "math-k1-addition-subtraction", "Add spoons", "counting", 2, "counting"),
            A("act-soup-listen-who", "Who Tasted Last", "👂", "Pip tasted, then Nana tasted. Who tasted last?",
              "Pip tasted, then Nana. Who last?", [
                o("nana", "Nana", "👵", "Nana tasted last.", True),
                o("pip", "Pip", "🧒", "Pip tasted first.", False),
                o("cat", "The cat", "🐱", "No cat at this pot.", False),
              ], "read-k1-listening-comprehension", "Who last", "clue-detective", 2, "riddle"),
            A("act-soup-pattern-chop", "Chop Rest", "🔪", "Chop chop rest, chop chop rest, chop. Next?",
              "Chop chop rest. Next?", [
                o("chop", "A chop", "🥕", "The pattern continues with a chop.", True),
                o("nap", "A nap", "😴", "Stay with the chopping pattern.", False),
                o("rest", "A rest", "🤚", "Rest already just happened.", False),
              ], "logic-k1-patterns", "Chop pattern", "pattern-match", 2, "riddle"),
        ]),
        area("picnic-basket", "Picnic Basket", "🧺", "Cloth, cups and a shady tree",
             "A checked cloth under a tree and a basket with clinking cups.",
             ["🧺", "🥪", "🧃", "🌳", "🐜"], 6, "from-green-200 via-yellow-100 to-lime-200 text-green-950", [
            A("act-picnic-what-pack", "What We Pack", "🥪", "Soft bread with a filling. What goes in the basket?",
              "What belongs in the picnic basket?", [
                o("sandwich", "Sandwich", "🥪", "Sandwiches go in the basket.", True),
                o("hammer", "Hammer", "🔨", "Hammers stay in the toolbox.", False),
                o("tyre", "A tyre", "🛞", "Tyres stay on cars.", False),
              ], "logic-k1-sorting", "Pack a picnic", "sorting", 1, "sight"),
            A("act-picnic-count-cups", "Four Cups", "🧃", "Four juice cups on the cloth. How many?",
              "How many cups?", [
                o("4", "4 cups", "4️⃣", "Four cups.", True),
                o("2", "2 cups", "2️⃣", "Count every cup.", False),
                o("7", "7 cups", "7️⃣", "Not seven this picnic.", False),
              ], "math-k1-counting", "Count cups", "counting", 1, "counting"),
            A("act-picnic-plus-sarnies", "Two Packs", "🥪", "3 sandwiches here, 2 there. How many?",
              "Three and two sandwiches. How many?", [
                o("5", "5 sandwiches", "5️⃣", "Three and two make five.", True),
                o("32", "32 sandwiches", "😵", "Add the groups.", False),
                o("2", "2 sandwiches", "2️⃣", "Count both packs.", False),
              ], "math-k1-addition-subtraction", "Add sandwiches", "counting", 2, "counting"),
            A("act-picnic-ant-who", "Who Marches", "🐜", "Tiny marchers toward a crumb. Who?",
              "Who is marching to the crumb?", [
                o("ant", "Ants", "🐜", "Ants found the crumb.", True),
                o("whale", "Whale", "🐋", "Whales are in the sea.", False),
                o("bus", "Bus", "🚌", "Buses are on the road.", False),
              ], "sci-k1-habitats", "Identify ants", "clue-detective", 1, "sight"),
            A("act-picnic-letter-p", "P for Picnic", "P", "Picnic starts with puh. Which letter?",
              "Which letter starts picnic?", [
                o("p", "P", "P", "Picnic starts with P.", True),
                o("b", "B", "B", "B starts basket — close, but this word is picnic.", False),
                o("n", "N", "N", "N starts napkin.", False),
              ], "read-k1-alphabet-letters", "Letter P", "clue-detective", 1, "riddle"),
            A("act-picnic-shape-cloth", "Square Cloth", "⬜", "The picnic cloth has four equal sides. What shape?",
              "What shape is the cloth?", [
                o("square", "Square", "⬜", "A square cloth.", True),
                o("circle", "Circle", "⚪", "This cloth has corners.", False),
                o("triangle", "Triangle", "🔺", "This cloth has four sides.", False),
              ], "math-k1-shapes", "Cloth is a square", "clue-detective", 1, "sight"),
            A("act-picnic-listen-where", "Where We Sit", "👂", "Nana said sit on the cloth, not the ant trail. Where?",
              "Where do we sit?", [
                o("cloth", "On the cloth", "🧺", "On the cloth.", True),
                o("trail", "On the ant trail", "🐜", "Nana said not the trail.", False),
                o("road", "In the road", "🚗", "Not the road.", False),
              ], "read-k1-listening-comprehension", "Where", "clue-detective", 2, "riddle"),
            A("act-picnic-pattern-cups", "Cup Row", "🥤", "Red cup, blue cup, red cup, blue cup, red. Next?",
              "Red, blue, red, blue, red. Next?", [
                o("blue", "Blue cup", "🔵", "AB continues with blue.", True),
                o("green", "Green cup", "🟢", "Green is not in this row.", False),
                o("red", "Red cup", "🔴", "Red just happened.", False),
              ], "logic-k1-patterns", "Cup AB", "pattern-match", 1, "riddle"),
        ]),
    ],
))

# ---------------------------------------------------------------------------
# Town Square
# ---------------------------------------------------------------------------
WORLDS.append(world(
    "city-world", "Town Square", "Fire house, park, library & market street",
    "🏘️", "from-sky-500 via-indigo-500 to-blue-600", "border-sky-400", "sky",
    ["Name town helpers", "Follow listen-and-do in a busy square", "Count park things"],
    "A square with a clock tower, a red fire house, a quiet library and a Saturday market.",
    [
        ("col-town-key", "Square Key", "🔑", "Earned helping around town", 4),
        ("col-library-card", "First Library Card", "📚", "Earned in the quiet nook", 8),
    ],
    [
        area("fire-house", "Fire House", "🚒", "Hoses, helmets and a spotted dog",
             "A red door, a hanging hose, and a dalmatian on the step.",
             ["🚒", "🐕", "🧯", "🔔", "⛑️"], 0, "from-red-200 via-orange-100 to-rose-200 text-red-950", [
            A("act-fire-who-truck", "Red Helper Truck", "🚒", "Long, red, and loud with a ladder. Who rides it?",
              "Who rides the long red truck?", [
                o("crew", "Firefighters", "🚒", "Firefighters ride it.", True, "Nee-naw!"),
                o("baker", "Baker", "👩‍🍳", "Bakers ride bakery vans.", False),
                o("penguin", "Penguin", "🐧", "Penguins live on ice.", False),
              ], "sci-k1-habitats", "Name firefighters", "sound-detective", 1, "sound"),
            A("act-fire-count-helmets", "Three Helmets", "⛑️", "Three helmets on the pegs. How many?",
              "How many helmets?", [
                o("3", "3 helmets", "3️⃣", "Three helmets.", True),
                o("1", "1 helmet", "1️⃣", "Count every peg.", False),
                o("6", "6 helmets", "6️⃣", "Not six this rack.", False),
              ], "math-k1-counting", "Count helmets", "counting", 1, "counting"),
            A("act-fire-sort-kit", "Hose Rack", "🧯", "The rack is for fire kit. Which belongs?",
              "Which belongs on the hose rack?", [
                o("hose", "Hose", "🧯", "Hoses belong here.", True),
                o("cake", "Cake", "🍰", "Cake is for the bakery.", False),
                o("book", "A book", "📘", "Books live in the library.", False),
              ], "logic-k1-sorting", "Sort fire kit", "sorting", 1, "sight"),
            A("act-fire-letter-f", "F for Fire", "F", "Fire starts with fff. Which letter?",
              "Which letter starts fire?", [
                o("f", "F", "F", "Fire starts with F.", True),
                o("v", "V", "V", "V starts van.", False),
                o("s", "S", "S", "S starts siren.", False),
              ], "read-k1-alphabet-letters", "Letter F", "clue-detective", 1, "riddle"),
            A("act-fire-listen-bell", "Who Rang", "🔔", "The bell rang, then the crew ran. What happened first?",
              "The bell rang, then the crew ran. What first?", [
                o("bell", "The bell rang", "🔔", "The bell first.", True),
                o("ran", "The crew ran", "🏃", "That was second.", False),
                o("nap", "A nap", "😴", "Not this beat.", False),
              ], "read-k1-listening-comprehension", "Sequence", "clue-detective", 2, "riddle"),
            A("act-fire-shape-badge", "Round Badge", "⭕", "The badge is round. What shape?",
              "What shape is the badge?", [
                o("circle", "Circle", "⚪", "A round badge.", True),
                o("square", "Square", "⬜", "This badge is round.", False),
                o("star", "Star", "⭐", "Not this badge.", False),
              ], "math-k1-shapes", "Badge is a circle", "clue-detective", 1, "sight"),
            A("act-fire-plus-boots", "Boot Pair", "🥾", "2 boots by this locker, 2 by that locker. How many?",
              "Two and two boots. How many?", [
                o("4", "4 boots", "4️⃣", "Two and two make four.", True),
                o("22", "22 boots", "😵", "Add the groups.", False),
                o("2", "2 boots", "2️⃣", "Count both lockers.", False),
              ], "math-k1-addition-subtraction", "Add boots", "counting", 2, "counting"),
            A("act-fire-dog-who", "Spotted Friend", "🐕", "A spotted dog waits on the step. Who?",
              "Who waits on the fire-house step?", [
                o("dal", "Dalmatian", "🐕", "The station dog.", True),
                o("shark", "Shark", "🦈", "Sharks stay in the sea.", False),
                o("owl", "Owl", "🦉", "Owls stay in woods.", False),
              ], "sci-k1-habitats", "Station dog", "clue-detective", 1, "sight"),
        ]),
        area("park-green", "Town Park", "🌳", "Ducks, swings and a round pond",
             "A green lawn, a duck pond, and swings that creak.",
             ["🌳", "🦆", "🛝", "⚽", "🌼"], 2, "from-green-200 via-lime-100 to-emerald-200 text-green-950", [
            A("act-park-count-ducks", "Five Ducks", "🦆", "Five ducks on the round pond. How many?",
              "How many ducks?", [
                o("5", "5 ducks", "5️⃣", "Five ducks.", True),
                o("2", "2 ducks", "2️⃣", "Count the whole pond.", False),
                o("8", "8 ducks", "8️⃣", "Not eight this morning.", False),
              ], "math-k1-counting", "Count ducks", "counting", 1, "counting"),
            A("act-park-sort-play", "Play or Road", "🛝", "The park is for play. Which belongs here?",
              "Which belongs in the park?", [
                o("swing", "A swing", "🛝", "Swings belong in the park.", True),
                o("lorry", "A lorry", "🚚", "Lorries stay on the road.", False),
                o("oven", "An oven", "🔥", "Ovens stay in kitchens.", False),
              ], "logic-k1-sorting", "Sort park vs road", "sorting", 1, "habitat"),
            A("act-park-who-quack", "Who Quacks", "🦆", "Quack from the round pond. Who?",
              "Who is quacking?", [
                o("duck", "Duck", "🦆", "A duck on the pond.", True, "Quack!"),
                o("lion", "Lion", "🦁", "Lions roar on grass plains.", False),
                o("truck", "Truck", "🚚", "Trucks rumble roads.", False),
              ], "sci-k1-habitats", "Duck by sound", "sound-detective", 1, "sound"),
            A("act-park-letter-d", "D for Duck", "D", "Duck starts with duh. Which letter?",
              "Which letter starts duck?", [
                o("d", "D", "D", "Duck starts with D.", True),
                o("b", "B", "B", "B starts ball.", False),
                o("g", "G", "G", "G starts grass.", False),
              ], "read-k1-alphabet-letters", "Letter D", "clue-detective", 1, "riddle"),
            A("act-park-shape-pond", "Round Pond", "⭕", "The pond is round. What shape?",
              "What shape is the pond?", [
                o("circle", "Circle", "⚪", "A round pond.", True),
                o("square", "Square", "⬜", "This pond is round.", False),
                o("triangle", "Triangle", "🔺", "Not three-sided.", False),
              ], "math-k1-shapes", "Pond is a circle", "clue-detective", 1, "sight"),
            A("act-park-plus-balls", "Ball Bag", "⚽", "2 balls out, 3 still in the bag. How many?",
              "Two and three balls. How many?", [
                o("5", "5 balls", "5️⃣", "Two and three make five.", True),
                o("23", "23 balls", "😵", "Add the groups.", False),
                o("3", "3 balls", "3️⃣", "Count both lots.", False),
              ], "math-k1-addition-subtraction", "Add balls", "counting", 2, "counting"),
            A("act-park-pattern-swings", "Swing Turns", "🔄", "Pip, Nana, Pip, Nana, Pip. Next?",
              "Pip, Nana, Pip, Nana, Pip. Next?", [
                o("nana", "Nana", "👵", "AB continues with Nana.", True),
                o("dog", "The dog", "🐶", "The dog is not in this turn pattern.", False),
                o("pip", "Pip", "🧒", "Pip just had a turn.", False),
              ], "logic-k1-patterns", "Turn-taking AB", "pattern-match", 2, "riddle"),
            A("act-park-listen-where", "Where the Ball Went", "👂", "The ball rolled under the bench, not the pond. Where?",
              "Where is the ball?", [
                o("bench", "Under the bench", "🪑", "Under the bench.", True),
                o("pond", "In the pond", "🦆", "Not the pond.", False),
                o("oven", "In the oven", "🔥", "Not this park.", False),
              ], "read-k1-listening-comprehension", "Where", "clue-detective", 2, "riddle"),
        ]),
        area("library-nook", "Quiet Nook", "📚", "Shelves, whispers and a story chair",
             "Tall shelves, a soft chair, and a whisper rule on the wall.",
             ["📚", "🤫", "🪑", "🔤", "🌙"], 4, "from-violet-200 via-indigo-100 to-purple-200 text-indigo-950", [
            A("act-lib-where-books", "Where Books Live", "📚", "Books live on the shelf, not the fridge. Where?",
              "Where do the books live?", [
                o("shelf", "On the shelf", "📚", "On the shelf.", True),
                o("fridge", "In the fridge", "🧊", "Not the fridge.", False),
                o("pond", "In the pond", "🐸", "Not the pond.", False),
              ], "read-k1-listening-comprehension", "Where books live", "clue-detective", 1, "riddle"),
            A("act-lib-letter-l", "L for Library", "L", "Library starts with lll. Which letter?",
              "Which letter starts library?", [
                o("l", "L", "L", "Library starts with L.", True),
                o("r", "R", "R", "R starts read.", False),
                o("b", "B", "B", "B starts book.", False),
              ], "read-k1-alphabet-letters", "Letter L", "clue-detective", 1, "riddle"),
            A("act-lib-count-books", "Seven Books", "📘", "Seven picture books in the return box. How many?",
              "How many books?", [
                o("7", "7 books", "7️⃣", "Seven books.", True),
                o("3", "3 books", "3️⃣", "Count the whole box.", False),
                o("10", "10 books", "🔟", "Not ten this box.", False),
              ], "math-k1-counting", "Count books", "counting", 2, "counting"),
            A("act-lib-sort-quiet", "Quiet or Loud", "🤫", "The nook is for quiet. Which belongs here?",
              "Which belongs in the quiet nook?", [
                o("whisper", "A whisper", "🤫", "Whispers belong here.", True),
                o("drum", "A drum kit", "🥁", "Drums are too loud here.", False),
                o("siren", "A siren", "🚨", "Sirens stay at the fire house.", False),
              ], "logic-k1-sorting", "Sort quiet vs loud", "sorting", 1, "riddle"),
            A("act-lib-who-reads", "Who Reads Last", "👂", "Pip read, then Nana read the last page. Who read last?",
              "Who read last?", [
                o("nana", "Nana", "👵", "Nana read last.", True),
                o("pip", "Pip", "🧒", "Pip read first.", False),
                o("duck", "A duck", "🦆", "No duck in this nook.", False),
              ], "read-k1-listening-comprehension", "Who last", "clue-detective", 2, "riddle"),
            A("act-lib-rhyme-book", "Book Rhyme", "📘", "Book. What rhymes with book?",
              "What rhymes with book?", [
                o("hook", "Hook", "🪝", "Book and hook rhyme.", True),
                o("shelf", "Shelf", "📚", "Shelf does not rhyme with book.", False),
                o("page", "Page", "📄", "Page does not rhyme with book.", False),
              ], "read-k1-phonemic-awareness", "Rhyme book", "clue-detective", 1, "riddle"),
            A("act-lib-pattern-spines", "Spine Row", "📗", "Red, blue, red, blue, red. Next?",
              "Red, blue, red, blue, red. Next?", [
                o("blue", "Blue spine", "🔵", "AB continues with blue.", True),
                o("gold", "Gold spine", "🟡", "Gold is not in this row.", False),
                o("red", "Red spine", "🔴", "Red just happened.", False),
              ], "logic-k1-patterns", "Spine AB", "pattern-match", 1, "riddle"),
            A("act-lib-plus-pages", "Two Stacks", "📄", "4 books in this stack, 2 in that stack. How many?",
              "Four and two books. How many?", [
                o("6", "6 books", "6️⃣", "Four and two make six.", True),
                o("42", "42 books", "😵", "Add the groups.", False),
                o("2", "2 books", "2️⃣", "Count both stacks.", False),
              ], "math-k1-addition-subtraction", "Add book stacks", "counting", 2, "counting"),
        ]),
        area("market-street", "Saturday Market", "🛎️", "Stalls, bells and painted signs",
             "Striped awnings, a hand bell, and painted stall signs.",
             ["🛎️", "🪁", "🧢", "🪙", "🪧"], 6, "from-amber-200 via-rose-100 to-orange-200 text-amber-950", [
            A("act-market-who-bell", "Who Rings", "🛎️", "A stall bell dings. Who is calling a customer?",
              "Who rings the stall bell?", [
                o("seller", "The stall keeper", "🧑", "The stall keeper rings it.", True, "Ding!"),
                o("owl", "An owl", "🦉", "Owls do not keep stalls.", False),
                o("sub", "A submarine", "🚤", "Subs stay under water.", False),
              ], "sci-k1-habitats", "Market bell", "sound-detective", 1, "sound"),
            A("act-market-count-kites", "Four Kites", "🪁", "Four kites tied to a stall. How many?",
              "How many kites?", [
                o("4", "4 kites", "4️⃣", "Four kites.", True),
                o("1", "1 kite", "1️⃣", "Count every kite.", False),
                o("7", "7 kites", "7️⃣", "Not seven this stall.", False),
              ], "math-k1-counting", "Count kites", "counting", 1, "counting"),
            A("act-market-shape-sign", "Square Sign", "⬜", "The stall sign is a square. What shape?",
              "What shape is the stall sign?", [
                o("square", "Square", "⬜", "A square sign.", True),
                o("circle", "Circle", "⚪", "This sign has corners.", False),
                o("heart", "Heart", "❤️", "Not this sign.", False),
              ], "math-k1-shapes", "Sign is a square", "clue-detective", 1, "sight"),
            A("act-market-sort-buy", "Food Stall", "🧢", "This stall sells hats. Which belongs?",
              "Which belongs on the hat stall?", [
                o("cap", "A cap", "🧢", "Caps belong here.", True),
                o("fish", "A fish", "🐟", "Fish belong at the fish stall.", False),
                o("hose", "A hose", "🧯", "Hoses stay at the fire house.", False),
              ], "logic-k1-sorting", "Sort stall goods", "sorting", 1, "sight"),
            A("act-market-letter-m", "M for Market", "M", "Market starts with mmm. Which letter?",
              "Which letter starts market?", [
                o("m", "M", "M", "Market starts with M.", True),
                o("n", "N", "N", "N starts nook.", False),
                o("k", "K", "K", "K starts kite.", False),
              ], "read-k1-alphabet-letters", "Letter M", "clue-detective", 1, "riddle"),
            A("act-market-plus-coins", "Two Purses", "🪙", "3 coins here, 2 coins there. How many?",
              "Three and two coins. How many?", [
                o("5", "5 coins", "5️⃣", "Three and two make five.", True),
                o("32", "32 coins", "😵", "Add the groups.", False),
                o("2", "2 coins", "2️⃣", "Count both purses.", False),
              ], "math-k1-addition-subtraction", "Add coins", "counting", 2, "counting"),
            A("act-market-listen-what", "What Nana Asked", "👂", "Nana asked for a red cap, not a blue kite. What?",
              "What did Nana ask for?", [
                o("cap", "A red cap", "🧢", "A red cap.", True),
                o("kite", "A blue kite", "🪁", "Nana said not the kite.", False),
                o("hose", "A hose", "🧯", "Not this stall.", False),
              ], "read-k1-listening-comprehension", "What", "clue-detective", 2, "riddle"),
            A("act-market-pattern-awnings", "Awning Stripe", "🎪", "Red, white, red, white, red. Next?",
              "Red, white, red, white, red. Next?", [
                o("white", "White", "⚪", "AB continues with white.", True),
                o("green", "Green", "🟢", "Green is not in this stripe.", False),
                o("red", "Red", "🔴", "Red just happened.", False),
              ], "logic-k1-patterns", "Awning AB", "pattern-match", 1, "riddle"),
        ]),
    ],
))

def pack_area(name, title, emoji, tagline, ambient, scenery, unlock, gradient, acts):
    return area(name, title, emoji, tagline, ambient, scenery, unlock, gradient, acts)


def eight(prefix, scene, extras):
    """Build 8 acts from a list of A() already."""
    assert len(extras) == 8, (prefix, len(extras))
    return extras


WORLDS.append(world(
    "arctic-world", "Ice Neighbours", "Floes, dens, lights and a seal shore",
    "🐧", "from-cyan-400 via-sky-500 to-indigo-500", "border-cyan-300", "cyan",
    ["Name ice animals and homes", "Count fish and floes", "Sort ice vs open water"],
    "A bright cold bay where penguins hop floes and the sky sometimes paints itself.",
    [("col-ice-pebble", "Nest Pebble", "🪨", "Earned on the floe", 4), ("col-aurora-ribbon", "Light Ribbon", "🌌", "Earned under the lights", 8)],
    [
        pack_area("ice-floe", "Penguin Floe", "🐧", "Hops, huddles and fish gifts",
            "Blue ice, a huddle, and a fish on the snow.",
            ["🐧", "❄️", "🐟", "🧊", "🌨️"], 0, "from-cyan-200 via-white to-sky-200 text-sky-950", eight("floe", "ice", [
            A("act-ice-who-hop", "Who Hops Ice", "🐧", "Black and white, hopping the floe. Who?",
              "Who hops the ice floe?", [
                o("penguin", "Penguin", "🐧", "A penguin on the floe.", True),
                o("camel", "Camel", "🐪", "Camels live in hot dunes.", False),
                o("bus", "Bus", "🚌", "Buses stay on roads.", False),
              ], "sci-k1-habitats", "Identify a penguin", "clue-detective", 1, "sight"),
            A("act-ice-count-fish", "Six Fish", "🐟", "Six silver fish by the hole. How many?",
              "How many fish?", [
                o("6", "6 fish", "6️⃣", "Six fish.", True), o("3", "3 fish", "3️⃣", "Count the whole gift.", False), o("9", "9 fish", "9️⃣", "Not nine this hole.", False),
              ], "math-k1-counting", "Count fish", "counting", 1, "counting"),
            A("act-ice-home", "Penguin Home", "🧊", "Penguins belong on cold ice, not the bakery. Where?",
              "Where does the penguin belong?", [
                o("ice", "Cold ice", "🧊", "On the cold ice.", True), o("bakery", "Bakery", "🥐", "Too warm.", False), o("desert", "Hot desert", "🏜️", "Too dry and hot.", False),
              ], "sci-k1-habitats", "Penguin habitat", "habitat-match", 1, "habitat"),
            A("act-ice-sort-cold", "Ice or Road", "❄️", "The floe is for ice walkers. Who belongs?",
              "Who belongs on the floe?", [
                o("penguin", "Penguin", "🐧", "Penguins hop floes.", True), o("horse", "Horse", "🐴", "Horses stay in fields.", False), o("truck", "Truck", "🚚", "Trucks stay on roads.", False),
              ], "logic-k1-sorting", "Sort ice animals", "sorting", 1, "habitat"),
            A("act-ice-letter-p", "P for Penguin", "P", "Penguin starts with puh. Which letter?",
              "Which letter starts penguin?", [
                o("p", "P", "P", "Penguin starts with P.", True), o("b", "B", "B", "B starts bear.", False), o("g", "G", "G", "G starts gift.", False),
              ], "read-k1-alphabet-letters", "Letter P", "clue-detective", 1, "riddle"),
            A("act-ice-plus-huddle", "Two Huddles", "🐧", "4 penguins here, 2 there. How many?",
              "Four and two penguins. How many?", [
                o("6", "6 penguins", "6️⃣", "Four and two make six.", True), o("42", "42 penguins", "😵", "Add the groups.", False), o("2", "2 penguins", "2️⃣", "Count both huddles.", False),
              ], "math-k1-addition-subtraction", "Add huddles", "counting", 2, "counting"),
            A("act-ice-rhyme-snow", "Snow Rhyme", "❄️", "Snow. What rhymes with snow?",
              "What rhymes with snow?", [
                o("go", "Go", "🚶", "Snow and go rhyme.", True), o("ice", "Ice", "🧊", "Ice does not rhyme with snow.", False), o("fish", "Fish", "🐟", "Fish does not rhyme with snow.", False),
              ], "read-k1-phonemic-awareness", "Rhyme snow", "clue-detective", 1, "riddle"),
            A("act-ice-pattern-hops", "Hop Rest", "🦶", "Hop hop rest, hop hop rest, hop. Next?",
              "Hop hop rest. Next?", [
                o("hop", "A hop", "🐧", "The pattern continues with a hop.", True), o("swim", "A long swim", "🏊", "This pattern is hops.", False), o("rest", "A rest", "😴", "Rest just happened.", False),
              ], "logic-k1-patterns", "Hop pattern", "pattern-match", 2, "riddle"),
        ])),
        pack_area("polar-den", "Snow Den", "🐻‍❄️", "Soft snow walls and a quiet cub",
            "A scooped den, warm breath in the cold, and a white cub.",
            ["🐻‍❄️", "🌨️", "🕳️", "🐾", "🌙"], 2, "from-slate-200 via-cyan-100 to-white text-slate-900", eight("den", "ice", [
            A("act-den-who-white", "White Coat", "🐻‍❄️", "Huge, white, and padded for snow. Who?",
              "Who has a huge white coat on the snow?", [
                o("bear", "Polar bear", "🐻‍❄️", "A polar bear.", True), o("parrot", "Parrot", "🦜", "Parrots live in jungles.", False), o("bus", "Bus", "🚌", "Buses stay on roads.", False),
              ], "sci-k1-habitats", "Identify a polar bear", "clue-detective", 1, "sight"),
            A("act-den-home", "Bear Home", "🕳️", "The cub belongs in the snow den, not the harbour. Where?",
              "Where does the cub belong?", [
                o("den", "Snow den", "🕳️", "In the snow den.", True), o("harbour", "Harbour", "⚓", "Too wet and busy.", False), o("bakery", "Bakery", "🥐", "Too warm.", False),
              ], "sci-k1-habitats", "Bear den", "habitat-match", 1, "habitat"),
            A("act-den-count-paws", "Four Paws", "🐾", "Four giant paws in the snow. How many?",
              "How many paws?", [
                o("4", "4 paws", "4️⃣", "Four paws.", True), o("2", "2 paws", "2️⃣", "Count every print.", False), o("6", "6 paws", "6️⃣", "Bears have four.", False),
              ], "math-k1-counting", "Count paws", "counting", 1, "counting"),
            A("act-den-sort-snow", "Snow or Jungle", "❄️", "The den is for snow coats. Who belongs?",
              "Who belongs in the snow den?", [
                o("bear", "Polar bear", "🐻‍❄️", "Snow-coat bear.", True), o("monkey", "Monkey", "🐵", "Monkeys stay in jungle vines.", False), o("bee", "Bee", "🐝", "Bees visit flowers.", False),
              ], "logic-k1-sorting", "Sort snow vs jungle", "sorting", 2, "habitat"),
            A("act-den-letter-c", "C for Cub", "C", "Cub starts with cuh. Which letter?",
              "Which letter starts cub?", [
                o("c", "C", "C", "Cub starts with C.", True), o("k", "K", "K", "K starts kite.", False), o("b", "B", "B", "B starts bear.", False),
              ], "read-k1-alphabet-letters", "Letter C", "clue-detective", 1, "riddle"),
            A("act-den-listen-who", "Who Slept Last", "👂", "The cub napped, then the grown bear napped. Who slept last?",
              "Who slept last?", [
                o("grown", "The grown bear", "🐻‍❄️", "The grown bear slept last.", True), o("cub", "The cub", "🧸", "The cub napped first.", False), o("ferry", "The ferry", "⛴️", "No ferry in this den.", False),
              ], "read-k1-listening-comprehension", "Who last", "clue-detective", 2, "riddle"),
            A("act-den-plus-prints", "Print Trail", "🐾", "3 prints here, 3 prints there. How many?",
              "Three and three prints. How many?", [
                o("6", "6 prints", "6️⃣", "Three and three make six.", True), o("33", "33 prints", "😵", "Add the groups.", False), o("3", "3 prints", "3️⃣", "Count both trails.", False),
              ], "math-k1-addition-subtraction", "Add prints", "counting", 2, "counting"),
            A("act-den-shape-den", "Round Door", "⭕", "The den door is a round hole. What shape?",
              "What shape is the den door?", [
                o("circle", "Circle", "⚪", "A round door.", True), o("star", "Star", "⭐", "Not a star door.", False), o("triangle", "Triangle", "🔺", "This door is round.", False),
              ], "math-k1-shapes", "Den door circle", "clue-detective", 1, "sight"),
        ])),
        pack_area("northern-lights", "Light Sky", "🌌", "Green ribbons over the ice",
            "A dark sky, green ribbons, and a quiet watching hill.",
            ["🌌", "💚", "✨", "🌙", "🔭"], 4, "from-indigo-300 via-emerald-200 to-violet-300 text-indigo-950", eight("lights", "ice", [
            A("act-light-colour", "Ribbon Colour", "💚", "The sky ribbon is garden green, not bakery brown. Which?",
              "What colour is the sky ribbon?", [
                o("green", "Green", "🟢", "A green ribbon.", True), o("brown", "Brown", "🟤", "Not bakery brown.", False), o("grey", "Grey", "⚪", "The ribbon glows green.", False),
              ], "read-k1-listening-comprehension", "Colour detail", "clue-detective", 1, "riddle"),
            A("act-light-mix", "Sky Mix", "🎨", "Mix ice blue into leaf yellow. What sky colour blooms?",
              "Blue and yellow. What colour blooms?", [
                o("green", "Green", "🟢", "Blue and yellow make green.", True), o("red", "Red", "🔴", "No red in this mix.", False), o("black", "Black", "⚫", "The mix stays bright.", False),
              ], None, "Mix aurora colours", "color-lab", 1, "creative"),
            A("act-light-count-stars", "Eight Stars", "⭐", "Eight hard stars beside the ribbon. How many?",
              "How many stars?", [
                o("8", "8 stars", "8️⃣", "Eight stars.", True), o("4", "4 stars", "4️⃣", "Count the whole band.", False), o("11", "11 stars", "1️⃣1️⃣", "Not eleven.", False),
              ], "math-k1-counting", "Count stars", "counting", 2, "counting"),
            A("act-light-pattern", "Ribbon Pulse", "✨", "Glow, fade, glow, fade, glow. Next?",
              "Glow, fade, glow, fade, glow. Next?", [
                o("fade", "Fade", "🌑", "AB continues with fade.", True), o("drum", "A drum", "🥁", "This pattern is glows.", False), o("glow", "Glow", "✨", "Glow just happened.", False),
              ], "logic-k1-patterns", "Ribbon AB", "pattern-match", 1, "riddle"),
            A("act-light-letter-s", "S for Star", "S", "Star starts with sss. Which letter?",
              "Which letter starts star?", [
                o("s", "S", "S", "Star starts with S.", True), o("t", "T", "T", "T starts telescope.", False), o("r", "R", "R", "R starts ribbon.", False),
              ], "read-k1-alphabet-letters", "Letter S", "clue-detective", 1, "riddle"),
            A("act-light-sort-sky", "Sky or Sea", "🌌", "The light show is in the sky. What belongs in the sky?",
              "What belongs in the sky?", [
                o("ribbon", "The light ribbon", "🌌", "The ribbon is in the sky.", True), o("seal", "A seal", "🦭", "Seals stay in the water.", False), o("bus", "A bus", "🚌", "Buses stay on roads.", False),
              ], "logic-k1-sorting", "Sort sky vs sea", "sorting", 2, "habitat"),
            A("act-light-plus-sparks", "Two Bands", "✨", "3 sparks here, 4 sparks there. How many?",
              "Three and four sparks. How many?", [
                o("7", "7 sparks", "7️⃣", "Three and four make seven.", True), o("34", "34 sparks", "😵", "Add the groups.", False), o("4", "4 sparks", "4️⃣", "Count both bands.", False),
              ], "math-k1-addition-subtraction", "Add sparks", "counting", 2, "counting"),
            A("act-light-listen-where", "Where We Watch", "👂", "Nana said watch from the hill, not the thin ice. Where?",
              "Where do we watch?", [
                o("hill", "The hill", "⛰️", "From the hill.", True), o("thin", "The thin ice", "🧊", "Nana said not the thin ice.", False), o("oven", "The oven", "🔥", "Not this sky.", False),
              ], "read-k1-listening-comprehension", "Where", "clue-detective", 2, "riddle"),
        ])),
        pack_area("seal-shore", "Seal Shore", "🦭", "Wet rocks, whiskers and a tide pool",
            "Black rocks, a whiskered face, and a tide that slaps.",
            ["🦭", "🌊", "🪨", "🐟", "🐚"], 6, "from-slate-300 via-cyan-100 to-blue-200 text-slate-900", eight("seal", "ice", [
            A("act-seal-who", "Who Claps Flippers", "🦭", "Whiskers and flippers on a wet rock. Who?",
              "Who claps flippers on the rock?", [
                o("seal", "Seal", "🦭", "A seal on the rock.", True), o("hen", "Hen", "🐔", "Hens stay in yards.", False), o("crane", "Crane", "🏗️", "Cranes lift crates.", False),
              ], "sci-k1-habitats", "Identify a seal", "clue-detective", 1, "sight"),
            A("act-seal-sound", "Who Barks Wet", "🦭", "A short bark from the wet rock. Who?",
              "Who is barking on the wet rock?", [
                o("seal", "Seal", "🦭", "A seal barking.", True, "Arf!"), o("dog", "Yard dog", "🐶", "Yard dogs stay by houses.", False), o("owl", "Owl", "🦉", "Owls hoot in woods.", False),
              ], "sci-k1-habitats", "Seal by sound", "sound-detective", 1, "sound"),
            A("act-seal-sort-water", "Rock or Road", "🌊", "The shore is for sea resters. Who belongs?",
              "Who belongs on the seal shore?", [
                o("seal", "Seal", "🦭", "Seals rest on wet rocks.", True), o("bus", "Bus", "🚌", "Buses stay on roads.", False), o("bee", "Bee", "🐝", "Bees visit flowers.", False),
              ], "logic-k1-sorting", "Sort shore animals", "sorting", 1, "habitat"),
            A("act-seal-count-shells", "Five Shells", "🐚", "Five shells in the tide line. How many?",
              "How many shells?", [
                o("5", "5 shells", "5️⃣", "Five shells.", True), o("2", "2 shells", "2️⃣", "Count the whole line.", False), o("8", "8 shells", "8️⃣", "Not eight this tide.", False),
              ], "math-k1-counting", "Count shells", "counting", 1, "counting"),
            A("act-seal-letter-s", "S for Seal", "S", "Seal starts with sss. Which letter?",
              "Which letter starts seal?", [
                o("s", "S", "S", "Seal starts with S.", True), o("c", "C", "C", "C starts cub.", False), o("t", "T", "T", "T starts tide.", False),
              ], "read-k1-alphabet-letters", "Letter S", "clue-detective", 1, "riddle"),
            A("act-seal-plus-rocks", "Two Rocks", "🪨", "2 seals on this rock, 3 on that rock. How many?",
              "Two and three seals. How many?", [
                o("5", "5 seals", "5️⃣", "Two and three make five.", True), o("23", "23 seals", "😵", "Add the groups.", False), o("3", "3 seals", "3️⃣", "Count both rocks.", False),
              ], "math-k1-addition-subtraction", "Add seals", "counting", 2, "counting"),
            A("act-seal-home", "Seal Home", "🌊", "Seals belong in cold sea and on wet rocks, not the attic. Where?",
              "Where does the seal belong?", [
                o("sea", "Cold sea and rocks", "🌊", "Sea and wet rocks.", True), o("attic", "Attic", "🏠", "Too dry and high.", False), o("desert", "Desert", "🏜️", "Too hot.", False),
              ], "sci-k1-habitats", "Seal habitat", "habitat-match", 2, "habitat"),
            A("act-seal-rhyme-rock", "Rock Rhyme", "🪨", "Rock. What rhymes with rock?",
              "What rhymes with rock?", [
                o("sock", "Sock", "🧦", "Rock and sock rhyme.", True), o("seal", "Seal", "🦭", "Seal does not rhyme with rock.", False), o("fish", "Fish", "🐟", "Fish does not rhyme with rock.", False),
              ], "read-k1-phonemic-awareness", "Rhyme rock", "clue-detective", 1, "riddle"),
        ])),
    ],
))

WORLDS.append(world(
    "night-world", "Night Neighbourhood", "Lamps, owls, stars and porch moths",
    "🌙", "from-indigo-700 via-violet-600 to-slate-800", "border-indigo-400", "indigo",
    ["Name night sounds and helpers", "Count stars and moths", "Follow quiet listen-and-do"],
    "After supper the street lamps click on, an owl calls, and moths write circles at the porch.",
    [("col-bed-lamp", "Bed Lamp", "💡", "Earned in the quiet bedroom", 4), ("col-owl-feather", "Soft Feather", "🪶", "Earned in owl wood", 8)],
    [
        pack_area("bedroom-lamp", "Bed Lamp", "🛏️", "A small lamp and a slow body",
            "A low lamp, a window moon, and a quilt.",
            ["🛏️", "💡", "🌙", "🧸", "📖"], 0, "from-indigo-200 via-violet-100 to-slate-200 text-indigo-950", eight("bed", "night", [
            A("act-bed-what-next", "Dark Sky Next", "🌙", "The sky is dark and the body is slow. What is next?",
              "Dark sky, slow body. What is next?", [
                o("sleep", "Sleep", "😴", "Time to sleep.", True), o("run", "A long run", "🏃", "The body is asking for rest.", False), o("drums", "Loud drums", "🥁", "Quiet helps sleep.", False),
              ], None, "Sleep cue", "clue-detective", 1, "riddle"),
            A("act-bed-count-bears", "Three Bears", "🧸", "Three teddies on the quilt. How many?",
              "How many teddies?", [
                o("3", "3 teddies", "3️⃣", "Three teddies.", True), o("1", "1 teddy", "1️⃣", "Count the whole quilt.", False), o("6", "6 teddies", "6️⃣", "Not six tonight.", False),
              ], "math-k1-counting", "Count teddies", "counting", 1, "counting"),
            A("act-bed-sort-quiet", "Quiet Shelf", "📖", "The shelf is for bedtime. Which belongs?",
              "Which belongs on the bedtime shelf?", [
                o("book", "A picture book", "📖", "Books belong at bedtime.", True), o("trumpet", "A trumpet", "🎺", "Trumpets are loud.", False), o("siren", "A siren", "🚨", "Sirens stay at the fire house.", False),
              ], "logic-k1-sorting", "Sort bedtime vs loud", "sorting", 1, "riddle"),
            A("act-bed-letter-b", "B for Bed", "B", "Bed starts with buh. Which letter?",
              "Which letter starts bed?", [
                o("b", "B", "B", "Bed starts with B.", True), o("d", "D", "D", "D starts dark.", False), o("p", "P", "P", "P starts pillow.", False),
              ], "read-k1-alphabet-letters", "Letter B", "clue-detective", 1, "riddle"),
            A("act-bed-piano", "Quilt Lullaby", "🎹", "The quilt wants a soft low tune. Play the quiet night piano.",
              "Play a soft lullaby for the quilt.", [
                o("soft", "Soft notes", "🫶", "Soft notes for sleep.", True), o("crash", "Crash", "🥁", "Too loud for bed.", False), o("shout", "Shout", "📢", "We play, we do not shout.", False),
              ], None, "Bedtime piano", "piano-melody", 1, "sound"),
            A("act-bed-listen-who", "Who Said Night-Night", "👂", "Pip said night-night, then Nana said night-night. Who last?",
              "Who said night-night last?", [
                o("nana", "Nana", "👵", "Nana said it last.", True), o("pip", "Pip", "🧒", "Pip said it first.", False), o("owl", "The owl", "🦉", "The owl is outside.", False),
              ], "read-k1-listening-comprehension", "Who last", "clue-detective", 2, "riddle"),
            A("act-bed-pattern-lamp", "Lamp Dim", "💡", "Bright, dim, bright, dim, bright. Next?",
              "Bright, dim, bright, dim, bright. Next?", [
                o("dim", "Dim", "🌑", "AB continues with dim.", True), o("flash", "A camera flash", "📸", "This pattern is the lamp.", False), o("bright", "Bright", "💡", "Bright just happened.", False),
              ], "logic-k1-patterns", "Lamp AB", "pattern-match", 1, "riddle"),
            A("act-bed-shape-window", "Moon Window", "⬜", "The bedroom window is a rectangle. What shape?",
              "What shape is the window?", [
                o("rect", "Rectangle", "▭", "A rectangle window.", True), o("circle", "Circle", "⚪", "This window has long sides.", False), o("star", "Star", "⭐", "Not a star window.", False),
              ], "math-k1-shapes", "Window rectangle", "clue-detective", 2, "sight"),
        ])),
        pack_area("owl-wood", "Owl Wood", "🦉", "Quiet trees and gold eyes",
            "Tall pines, a round moon, and gold eyes in a hole.",
            ["🦉", "🌲", "🌕", "👁️", "🪶"], 2, "from-emerald-300 via-indigo-200 to-slate-300 text-emerald-950", eight("owl", "night", [
            A("act-owl-who", "Who Calls Hoo", "🦉", "Hoo from a tree hole. Who?",
              "Who is calling hoo?", [
                o("owl", "Owl", "🦉", "An owl in the hole.", True, "Hoo!"), o("duck", "Duck", "🦆", "Ducks quack on ponds.", False), o("bus", "Bus", "🚌", "Buses rumble roads.", False),
              ], "sci-k1-habitats", "Owl by sound", "sound-detective", 1, "sound"),
            A("act-owl-home", "Owl Home", "🌲", "Owls belong in tree holes at night, not the fridge. Where?",
              "Where does the owl belong?", [
                o("tree", "A tree hole", "🌲", "In a tree hole.", True), o("fridge", "Fridge", "🧊", "Too closed and cold.", False), o("harbour", "Harbour", "⚓", "Too wet and busy.", False),
              ], "sci-k1-habitats", "Owl habitat", "habitat-match", 1, "habitat"),
            A("act-owl-count-eyes", "Two Eyes", "✨", "Two gold eyes in the hole. How many?",
              "How many gold eyes?", [
                o("2", "2 eyes", "2️⃣", "Two eyes.", True), o("1", "1 eye", "1️⃣", "Owls have two.", False), o("5", "5 eyes", "5️⃣", "Not five.", False),
              ], "math-k1-counting", "Count owl eyes", "counting", 1, "counting"),
            A("act-owl-sort-night", "Night or Day", "🌙", "The wood at night is for night hunters. Who belongs?",
              "Who belongs in the night wood?", [
                o("owl", "Owl", "🦉", "Owls hunt at night.", True), o("rooster", "Rooster", "🐓", "Roosters shout at dawn.", False), o("bee", "Bee", "🐝", "Bees work in day flowers.", False),
              ], "logic-k1-sorting", "Sort night vs day", "sorting", 2, "habitat"),
            A("act-owl-letter-o", "O for Owl", "O", "Owl starts with ow. Which letter?",
              "Which letter starts owl?", [
                o("o", "O", "O", "Owl starts with O.", True), o("a", "A", "A", "A starts ant.", False), o("u", "U", "U", "U starts under.", False),
              ], "read-k1-alphabet-letters", "Letter O", "clue-detective", 1, "riddle"),
            A("act-owl-listen-who", "Who Called Last", "👂", "A small owl called, then a deep owl called. Who last?",
              "Who called last?", [
                o("deep", "The deep owl", "🦉", "The deep owl called last.", True), o("small", "The small owl", "🐣", "The small owl called first.", False), o("ferry", "The ferry", "⛴️", "No ferry in this wood.", False),
              ], "read-k1-listening-comprehension", "Who last", "clue-detective", 2, "riddle"),
            A("act-owl-plus-pines", "Two Rows", "🌲", "3 pines here, 3 pines there. How many?",
              "Three and three pines. How many?", [
                o("6", "6 pines", "6️⃣", "Three and three make six.", True), o("33", "33 pines", "😵", "Add the groups.", False), o("3", "3 pines", "3️⃣", "Count both rows.", False),
              ], "math-k1-addition-subtraction", "Add pines", "counting", 2, "counting"),
            A("act-owl-rhyme-tree", "Tree Rhyme", "🌲", "Tree. What rhymes with tree?",
              "What rhymes with tree?", [
                o("bee", "Bee", "🐝", "Tree and bee rhyme.", True), o("owl", "Owl", "🦉", "Owl does not rhyme with tree.", False), o("wood", "Wood", "🪵", "Wood does not rhyme with tree.", False),
              ], "read-k1-phonemic-awareness", "Rhyme tree", "clue-detective", 1, "riddle"),
        ])),
        pack_area("star-balcony", "Star Balcony", "⭐", "A rail, a moon and a counting sky",
            "A wooden rail, a fat moon, and a sky you can count.",
            ["⭐", "🌙", "🔭", "🌌", "🛏️"], 4, "from-indigo-300 via-blue-200 to-violet-200 text-indigo-950", eight("star", "night", [
            A("act-star-count", "Nine Stars", "⭐", "Nine hard stars above the rail. How many?",
              "How many stars?", [
                o("9", "9 stars", "9️⃣", "Nine stars.", True), o("4", "4 stars", "4️⃣", "Count the whole rail-sky.", False), o("12", "12 stars", "1️⃣2️⃣", "Not twelve this night.", False),
              ], "math-k1-counting", "Count balcony stars", "counting", 2, "counting"),
            A("act-star-moon", "Who Glows Round", "🌕", "A round pale lamp in the sky. Who?",
              "What is the round pale lamp?", [
                o("moon", "The moon", "🌕", "The moon.", True), o("bus", "A bus", "🚌", "Buses stay on roads.", False), o("orange", "An orange", "🍊", "Oranges stay at the stall.", False),
              ], "sci-k1-habitats", "Identify the moon", "clue-detective", 1, "sight"),
            A("act-star-letter-s", "S for Star", "S", "Star starts with sss. Which letter?",
              "Which letter starts star?", [
                o("s", "S", "S", "Star starts with S.", True), o("t", "T", "T", "T starts telescope.", False), o("m", "M", "M", "M starts moon.", False),
              ], "read-k1-alphabet-letters", "Letter S", "clue-detective", 1, "riddle"),
            A("act-star-shape-moon", "Round Moon", "⭕", "The moon looks round tonight. What shape?",
              "What shape is the moon tonight?", [
                o("circle", "Circle", "⚪", "A round moon.", True), o("square", "Square", "⬜", "The moon is not square.", False), o("triangle", "Triangle", "🔺", "Not three-sided.", False),
              ], "math-k1-shapes", "Moon is a circle", "clue-detective", 1, "sight"),
            A("act-star-plus", "Two Clusters", "✨", "4 stars here, 5 stars there. How many?",
              "Four and five stars. How many?", [
                o("9", "9 stars", "9️⃣", "Four and five make nine.", True), o("45", "45 stars", "😵", "Add the groups.", False), o("5", "5 stars", "5️⃣", "Count both clusters.", False),
              ], "math-k1-addition-subtraction", "Add star clusters", "counting", 2, "counting"),
            A("act-star-pattern", "Twinkle Rest", "✨", "Twinkle rest twinkle rest twinkle. Next?",
              "Twinkle, rest, twinkle, rest, twinkle. Next?", [
                o("rest", "A rest", "🌑", "AB continues with rest.", True), o("drum", "A drum", "🥁", "This pattern is twinkles.", False), o("twinkle", "A twinkle", "✨", "Twinkle just happened.", False),
              ], "logic-k1-patterns", "Twinkle AB", "pattern-match", 1, "riddle"),
            A("act-star-listen-where", "Where the Moon Sits", "👂", "Nana said the moon sits above the rail, not in the kettle. Where?",
              "Where does the moon sit?", [
                o("rail", "Above the rail", "⭐", "Above the rail.", True), o("kettle", "In the kettle", "🫖", "Not the kettle.", False), o("shoe", "In a shoe", "👟", "Not a shoe.", False),
              ], "read-k1-listening-comprehension", "Where", "clue-detective", 2, "riddle"),
            A("act-star-sort-sky", "Sky or Street", "🌌", "The balcony sky is for sky things. What belongs?",
              "What belongs in the balcony sky?", [
                o("star", "A star", "⭐", "Stars belong in the sky.", True), o("bus", "A bus", "🚌", "Buses stay on the street.", False), o("spoon", "A spoon", "🥄", "Spoons stay in the kitchen.", False),
              ], "logic-k1-sorting", "Sort sky vs street", "sorting", 1, "habitat"),
        ])),
        pack_area("porch-moths", "Porch Moths", "🦋", "A warm bulb and circling wings",
            "A porch bulb, circling moths, and a quiet step.",
            ["🦋", "💡", "🏡", "🌙", "🪑"], 6, "from-amber-200 via-indigo-100 to-yellow-100 text-amber-950", eight("porch", "night", [
            A("act-porch-who", "Who Circles the Bulb", "🦋", "Soft wings writing circles at the bulb. Who?",
              "Who circles the porch bulb?", [
                o("moth", "Moth", "🦋", "A moth at the bulb.", True), o("shark", "Shark", "🦈", "Sharks stay in the sea.", False), o("truck", "Truck", "🚚", "Trucks stay on roads.", False),
              ], "sci-k1-habitats", "Identify a moth", "clue-detective", 1, "sight"),
            A("act-porch-count", "Five Moths", "🦋", "Five moths on the glass. How many?",
              "How many moths?", [
                o("5", "5 moths", "5️⃣", "Five moths.", True), o("2", "2 moths", "2️⃣", "Count the whole glass.", False), o("8", "8 moths", "8️⃣", "Not eight tonight.", False),
              ], "math-k1-counting", "Count porch moths", "counting", 1, "counting"),
            A("act-porch-sort", "Bulb or Bed", "💡", "The porch bulb is for night flyers. Who belongs?",
              "Who belongs at the porch bulb?", [
                o("moth", "Moth", "🦋", "Moths come to bulbs.", True), o("penguin", "Penguin", "🐧", "Penguins stay on ice.", False), o("loaf", "A loaf", "🍞", "Loaves stay in the bakery.", False),
              ], "logic-k1-sorting", "Sort porch visitors", "sorting", 1, "habitat"),
            A("act-porch-letter-m", "M for Moth", "M", "Moth starts with mmm. Which letter?",
              "Which letter starts moth?", [
                o("m", "M", "M", "Moth starts with M.", True), o("n", "N", "N", "N starts night.", False), o("p", "P", "P", "P starts porch.", False),
              ], "read-k1-alphabet-letters", "Letter M", "clue-detective", 1, "riddle"),
            A("act-porch-plus", "Two Panes", "🪟", "3 moths on this pane, 2 on that pane. How many?",
              "Three and two moths. How many?", [
                o("5", "5 moths", "5️⃣", "Three and two make five.", True), o("32", "32 moths", "😵", "Add the groups.", False), o("2", "2 moths", "2️⃣", "Count both panes.", False),
              ], "math-k1-addition-subtraction", "Add moths", "counting", 2, "counting"),
            A("act-porch-listen", "What Nana Said", "👂", "Nana said watch the moths, do not catch them. What?",
              "What did Nana say?", [
                o("watch", "Watch, do not catch", "👀", "Watch the moths.", True), o("catch", "Catch them all", "🕸️", "Nana said not to catch.", False), o("shout", "Shout at them", "📢", "We stay quiet.", False),
              ], "read-k1-listening-comprehension", "What", "clue-detective", 2, "riddle"),
            A("act-porch-pattern", "Circle Rest", "🔄", "Circle rest circle rest circle. Next?",
              "Circle, rest, circle, rest, circle. Next?", [
                o("rest", "A rest", "🪑", "AB continues with rest.", True), o("drum", "A drum", "🥁", "This pattern is circles.", False), o("circle", "A circle", "🔄", "Circle just happened.", False),
              ], "logic-k1-patterns", "Moth AB", "pattern-match", 1, "riddle"),
            A("act-porch-rhyme-light", "Light Rhyme", "💡", "Light. What rhymes with light?",
              "What rhymes with light?", [
                o("night", "Night", "🌙", "Light and night rhyme.", True), o("moth", "Moth", "🦋", "Moth does not rhyme with light.", False), o("porch", "Porch", "🏡", "Porch does not rhyme with light.", False),
              ], "read-k1-phonemic-awareness", "Rhyme light", "clue-detective", 1, "riddle"),
        ])),
    ],
))


def ts_str(s):
    return '"' + str(s).replace("\\\\", "\\\\\\\\").replace('"', '\\\\"') + '"'


def emit_option(opt):
    extra = f', soundCue: {ts_str(opt["cue"])}' if opt.get("cue") else ""
    return (
        f'          {{ id: {ts_str(opt["i"])}, label: {ts_str(opt["label"])}, emoji: {ts_str(opt["emoji"])}, '
        f'feedback: {ts_str(opt["fb"])}, isCorrect: {"true" if opt["ok"] else "false"}{extra} }}'
    )


def emit_act(world_id, area_id, a):
    opts = ",\n".join(emit_option(opt) for opt in a["options"])
    return f'''        {{
          id: {ts_str(a["id"])},
          worldId: {ts_str(world_id)},
          areaId: {ts_str(area_id)},
          title: {ts_str(a["title"])},
          type: {ts_str(a["typ"])},
          learningObjective: {ts_str(a["objective"])},
          difficulty: {a["diff"]},
          clueType: {ts_str(a["clue"])},
          clueIcon: {ts_str(a["icon"])},
          cluePrompt: {ts_str(a["prompt"])},
          spokenPrompt: {ts_str(a["spoken"])},
          options: [
{opts},
          ],
          rewardStars: 1,
          rewardXP: 0,
          replayable: true,
        }}'''


def emit_area(world_id, ar):
    acts = ",\n".join(emit_act(world_id, ar["id"], a) for a in ar["acts"])
    scenery = ", ".join(ts_str(s) for s in ar["scenery"])
    unlock_line = f'      requiredStarsToUnlock: {ar["unlock"]},\n'
    if ar["unlock"]:
        need = ar["unlock"]
        title = ar["title"]
        unlock_line += f'      unlockRequirementText: {ts_str("Earn " + str(need) + " stars on this atlas to open " + title + ".")},\n'
    return f'''    {{
      id: {ts_str(ar["id"])},
      worldId: {ts_str(world_id)},
      title: {ts_str(ar["title"])},
      emoji: {ts_str(ar["emoji"])},
      tagline: {ts_str(ar["tagline"])},
      environment: {{
        bgGradient: {ts_str(ar["gradient"])},
        cardBg: "bg-white/80",
        accentColor: "amber",
        sceneryEmojis: [{scenery}],
        ambientDescription: {ts_str(ar["ambient"])},
      }},
{unlock_line}      activities: [
{acts},
      ],
      missions: [],
    }}'''


def emit_world(w):
    goals = ",\n    ".join(ts_str(g) for g in w["goals"])
    rewards = ",\n    ".join(
        f'    {{ id: {ts_str(r[0])}, title: {ts_str(r[1])}, emoji: {ts_str(r[2])}, description: {ts_str(r[3])}, requiredStars: {r[4]} }}'
        for r in w["rewards"]
    )
    areas = ",\n".join(emit_area(w["id"], ar) for ar in w["areas"])
    return f'''export const {w["id"].replace("-", "_").upper()}: ToddlerWorld = {{
  id: {ts_str(w["id"])},
  title: {ts_str(w["title"])},
  tagline: {ts_str(w["tagline"])},
  emoji: {ts_str(w["emoji"])},
  gradient: {ts_str(w["gradient"])},
  borderColor: {ts_str(w["border"])},
  themeColor: {ts_str(w["theme"])},
  learningGoals: [
    {goals},
  ],
  description: {ts_str(w["desc"])},
  collectionRewards: [
{rewards},
  ],
  areas: [
{areas},
  ],
}};'''


ids = set()
skills = {}
for w in WORLDS:
    for ar in w["areas"]:
        if len(ar["acts"]) < 8:
            raise SystemExit(f'thin {w["id"]}/{ar["id"]} {len(ar["acts"])}')
        for a in ar["acts"]:
            if a["id"] in ids:
                raise SystemExit(f'dupe {a["id"]}')
            ids.add(a["id"])
            skills[a["id"]] = a["skill"]

lines = []
lines.append("/** Extra atlas lands so Worlds is a map of many places, not six demo cards. */")
lines.append('import type { ToddlerWorld } from "./toddlerWorldsArchitecture";')
lines.append("")
for w in WORLDS:
    lines.append(emit_world(w))
    lines.append("")
lines.append("export const ATLAS_LANDS: ToddlerWorld[] = [")
for w in WORLDS:
    lines.append(f'  {w["id"].replace("-", "_").upper()},')
lines.append("];")
lines.append("")
lines.append("export const ATLAS_WORLD_SKILLS: Record<string, string | undefined> = {")
for k, v in skills.items():
    skill_ts = "undefined" if v is None else ts_str(v)
    lines.append(f"  {ts_str(k)}: {skill_ts},")
lines.append("};")
lines.append("")

out = Path("/home/user/Student-portal-2/src/data/toddler/toddlerWorldAtlasLands.ts")
out.write_text("\n".join(lines) + "\n")
print("worlds", len(WORLDS), "acts", len(ids), "skills", sum(1 for v in skills.values() if v), "bytes", out.stat().st_size)
