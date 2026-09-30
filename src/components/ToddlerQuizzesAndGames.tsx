import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Sparkles,
  Volume2,
  VolumeX,
  Star,
  RotateCcw,
  Trophy,
  CheckCircle2,
  Heart,
  Music,
  ArrowRight,
  PartyPopper,
  Shapes,
} from "lucide-react";
import {
  speakText,
  stopSpeaking,
  isVoiceMuted,
  setVoiceMuted,
  speechCoordinator,
} from "../utils/speechUtils";
import { soundEffects } from "../utils/soundEffects";
import { recordLearningEvent, getActiveLearnerId } from "../utils/learnerBrain";
import { ToddlerMemoryGame } from "./ToddlerMemoryGame";
import { ToddlerRhymeGame } from "./ToddlerRhymeGame";
import { ToddlerColorLab } from "./ToddlerColorLab";
import { ToddlerMusicPiano } from "./ToddlerMusicPiano";
import { ToddlerAnimalSafari } from "./ToddlerAnimalSafari";
import { ToddlerBalloonSky } from "./ToddlerBalloonSky";

interface ToddlerQuizzesAndGamesProps {
  starsCount: number;
  onAddStar: (amount?: number) => void;
  onBackToBooks?: () => void;
}

type ToddlerActivity =
  | "rainbow-piano"
  | "animal-safari"
  | "balloon-sky"
  | "animal-quiz"
  | "shape-match"
  | "memory-match"
  | "rhyme-time"
  | "color-magic"
  | "bubble-pop"
  | "feed-animal";

interface QuizQuestion {
  id: string;
  prompt: string;
  spokenPrompt: string;
  soundCue?: string;
  correctId: string;
  options: {
    id: string;
    label: string;
    emoji: string;
    soundText?: string;
  }[];
}

const shuffleChoices = (questions: QuizQuestion[]) => questions
  .map((question) => ({ ...question, options: [...question.options].sort(() => Math.random() - 0.5) }))
  .sort(() => Math.random() - 0.5);

const BONUS_EXPLORER_QUESTIONS: QuizQuestion[] = [
  { id: "q15", prompt: "Which animal has a shell and moves very slowly?", spokenPrompt: "Can you find the slow little friend who carries a shell on its back?", correctId: "turtle", soundCue: "Slow and steady!", options: [{ id: "turtle", label: "Turtle", emoji: "🐢", soundText: "I carry my home wherever I go!" }, { id: "rabbit", label: "Rabbit", emoji: "🐰", soundText: "Hop hop!" }, { id: "fish", label: "Fish", emoji: "🐠", soundText: "Splash splash!" }, { id: "bird", label: "Bird", emoji: "🐦", soundText: "Tweet tweet!" }] },
  { id: "q16", prompt: "Which tiny helper makes sweet honey?", spokenPrompt: "Which little buzzing friend visits flowers and helps make honey?", correctId: "bee", soundCue: "Bzzzz!", options: [{ id: "bee", label: "Busy Bee", emoji: "🐝", soundText: "Buzz buzz! I love flowers!" }, { id: "frog", label: "Frog", emoji: "🐸", soundText: "Ribbit ribbit!" }, { id: "duck", label: "Duck", emoji: "🦆", soundText: "Quack quack!" }, { id: "cat", label: "Kitten", emoji: "🐱", soundText: "Meow!" }] },
  { id: "q17", prompt: "Which animal lives in a cold, icy place and waddles?", spokenPrompt: "Who wears a black and white coat and waddles across the chilly ice?", correctId: "penguin", soundCue: "Waddle waddle!", options: [{ id: "penguin", label: "Penguin", emoji: "🐧", soundText: "Waddle, slide, splash!" }, { id: "camel", label: "Camel", emoji: "🐫", soundText: "I walk in the warm desert!" }, { id: "monkey", label: "Monkey", emoji: "🐵", soundText: "Ooh ooh aah aah!" }, { id: "cow", label: "Cow", emoji: "🐮", soundText: "Moo!" }] },
  { id: "q18", prompt: "What do plants need from the sky to help them grow?", spokenPrompt: "Plants drink rain and reach toward the warm sunshine. What shines in the daytime sky?", correctId: "sun", soundCue: "Shine bright!", options: [{ id: "sun", label: "Sunny Sun", emoji: "☀️", soundText: "Warm sunshine helps plants grow!" }, { id: "moon", label: "Moon", emoji: "🌙", soundText: "The moon glows at night!" }, { id: "snow", label: "Snowflake", emoji: "❄️", soundText: "Snow is cold and fluffy!" }, { id: "star", label: "Star", emoji: "⭐", soundText: "Stars twinkle at night!" }] },
  { id: "q19", prompt: "Which shape has three straight sides?", spokenPrompt: "Let's count the sides together. One, two, three. Which shape has three sides?", correctId: "triangle", soundCue: "One, two, three!", options: [{ id: "triangle", label: "Triangle", emoji: "🔺", soundText: "Three sides make a triangle!" }, { id: "circle", label: "Circle", emoji: "🟠", soundText: "A circle is round!" }, { id: "square", label: "Square", emoji: "🟩", soundText: "A square has four sides!" }, { id: "star", label: "Star", emoji: "⭐", soundText: "A star has pointy tips!" }] },
  { id: "q20", prompt: "Which one is the number three?", spokenPrompt: "Listen carefully. Which number comes after two: one, two, three?", correctId: "three", soundCue: "1, 2, 3!", options: [{ id: "one", label: "One", emoji: "1️⃣", soundText: "One little sun!" }, { id: "three", label: "Three", emoji: "3️⃣", soundText: "One, two, three!" }, { id: "five", label: "Five", emoji: "5️⃣", soundText: "Five little stars!" }, { id: "two", label: "Two", emoji: "2️⃣", soundText: "One, two!" }] },
  { id: "q21", prompt: "Which fruit is yellow and monkeys love to eat?", spokenPrompt: "Peel it, take a bite, and say yum! Which yellow fruit do monkeys love?", correctId: "banana", soundCue: "Yummy banana!", options: [{ id: "banana", label: "Banana", emoji: "🍌", soundText: "A tasty yellow banana!" }, { id: "apple", label: "Apple", emoji: "🍎", soundText: "Crunchy red apple!" }, { id: "grapes", label: "Grapes", emoji: "🍇", soundText: "Juicy grapes!" }, { id: "lemon", label: "Lemon", emoji: "🍋", soundText: "A sour yellow lemon!" }] },
  { id: "q22", prompt: "What should you do before crossing a road?", spokenPrompt: "We keep safe near roads. Before crossing with a grown-up, what should we do?", correctId: "stop", soundCue: "Stop, look, listen!", options: [{ id: "stop", label: "Stop and Look", emoji: "🛑", soundText: "Hold a grown-up's hand and look both ways!" }, { id: "run", label: "Run fast", emoji: "🏃", soundText: "Let's stay safe and walk with a grown-up!" }, { id: "play", label: "Play ball", emoji: "⚽", soundText: "Roads are not a place to play!" }, { id: "hide", label: "Hide", emoji: "🙈", soundText: "We need to see and listen carefully!" }] },
  { id: "q23", prompt: "Which animal is the tallest and has a very long neck?", spokenPrompt: "Who reaches the highest leaves with a long spotted neck?", correctId: "giraffe", soundCue: "Reach up high!", options: [{ id: "giraffe", label: "Giraffe", emoji: "🦒", soundText: "I reach the tallest leaves!" }, { id: "zebra", label: "Zebra", emoji: "🦓", soundText: "I have black and white stripes!" }, { id: "lion", label: "Lion", emoji: "🦁", soundText: "Roaaar!" }, { id: "hippo", label: "Hippo", emoji: "🦛", soundText: "Splash!" }] },
  { id: "q24", prompt: "Which weather means we might need an umbrella?", spokenPrompt: "Drip drop! What falls from clouds and makes puddles?", correctId: "rain", soundCue: "Drip drop!", options: [{ id: "rain", label: "Rain", emoji: "🌧️", soundText: "Take an umbrella in the rain!" }, { id: "sun", label: "Sunshine", emoji: "☀️", soundText: "Bright sunny day!" }, { id: "wind", label: "Wind", emoji: "💨", soundText: "Whoosh goes the wind!" }, { id: "rainbow", label: "Rainbow", emoji: "🌈", soundText: "A rainbow can appear after rain!" }] },
  { id: "q25", prompt: "Which one belongs in the ocean?", spokenPrompt: "Splash into the blue ocean. Which friendly creature swims in the sea?", correctId: "dolphin", soundCue: "Splash!", options: [{ id: "dolphin", label: "Dolphin", emoji: "🐬", soundText: "I swim and leap in the ocean!" }, { id: "chicken", label: "Chicken", emoji: "🐔", soundText: "Cluck cluck on the farm!" }, { id: "camel", label: "Camel", emoji: "🐫", soundText: "I walk in the desert!" }, { id: "sheep", label: "Sheep", emoji: "🐑", soundText: "Baa baa in the meadow!" }] },
  { id: "q26", prompt: "What comes next: red, blue, red, blue...?", spokenPrompt: "Let's spot the repeating colors. Red, blue, red, blue. What comes next?", correctId: "red", soundCue: "Red, blue, red, blue!", options: [{ id: "red", label: "Red", emoji: "🔴", soundText: "The pattern starts again with red!" }, { id: "blue", label: "Blue", emoji: "🔵", soundText: "Blue was just before. What starts again?" }, { id: "green", label: "Green", emoji: "🟢", soundText: "Green is a lovely color, but not in this pattern!" }, { id: "yellow", label: "Yellow", emoji: "🟡", soundText: "Look at the repeating colors again!" }] },
];

const ANIMAL_QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: "q1",
    prompt: "Who says 'Moo'? Tap the animal!",
    spokenPrompt: "Who says 'Moo'? Can you tap the animal?",
    soundCue: "Moooo!",
    correctId: "cow",
    options: [
      { id: "dog", label: "Dog", emoji: "🐶", soundText: "Woof woof!" },
      { id: "cow", label: "Cow", emoji: "🐮", soundText: "Moooo!" },
      { id: "cat", label: "Cat", emoji: "🐱", soundText: "Meow meow!" },
      { id: "duck", label: "Duck", emoji: "🦆", soundText: "Quack quack!" },
    ],
  },
  {
    id: "q2",
    prompt: "Find the King of the Jungle who roars!",
    spokenPrompt: "Find the brave golden Lion who roars! Raaawr!",
    soundCue: "Raaawr!",
    correctId: "lion",
    options: [
      { id: "rabbit", label: "Bunny", emoji: "🐰", soundText: "Hop hop!" },
      { id: "frog", label: "Frog", emoji: "🐸", soundText: "Ribbit ribbit!" },
      { id: "lion", label: "Lion", emoji: "🦁", soundText: "Raaawr!" },
      { id: "pig", label: "Piggy", emoji: "🐷", soundText: "Oink oink!" },
    ],
  },
  {
    id: "q3",
    prompt: "Which one is sweet, crunchy red Apple? (Letter A)",
    spokenPrompt: "Which one is the delicious red Apple? Letter A!",
    soundCue: "Crunch crunch!",
    correctId: "apple",
    options: [
      { id: "banana", label: "Banana", emoji: "🍌", soundText: "Yummy banana!" },
      { id: "apple", label: "Apple", emoji: "🍎", soundText: "A says Ah, Apple!" },
      { id: "carrot", label: "Carrot", emoji: "🥕", soundText: "Crunchy carrot!" },
      { id: "grape", label: "Grapes", emoji: "🍇", soundText: "Juicy grapes!" },
    ],
  },
  {
    id: "q4",
    prompt: "Who swims in the blue ocean and splashes?",
    spokenPrompt: "Who swims in the deep blue ocean and splashes water?",
    soundCue: "Splash splash!",
    correctId: "whale",
    options: [
      { id: "whale", label: "Whale", emoji: "🐳", soundText: "Giant friendly whale!" },
      { id: "horse", label: "Horse", emoji: "🐴", soundText: "Neigh neigh!" },
      { id: "bird", label: "Bird", emoji: "🐦", soundText: "Tweet tweet!" },
      { id: "bear", label: "Bear", emoji: "🐻", soundText: "Grrr bear!" },
    ],
  },
  {
    id: "q5",
    prompt: "Which little friend hops, hops, hops and loves carrots?",
    spokenPrompt: "Which little friend hops and loves crunchy carrots?",
    soundCue: "Hop hop!",
    correctId: "bunny",
    options: [
      { id: "elephant", label: "Elephant", emoji: "🐘", soundText: "Big elephant!" },
      { id: "turtle", label: "Turtle", emoji: "🐢", soundText: "Slow turtle!" },
      { id: "bunny", label: "Bunny", emoji: "🐰", soundText: "Boing boing bunny!" },
      { id: "sheep", label: "Sheep", emoji: "🐑", soundText: "Baa baa sheep!" },
    ],
  },
  {
    id: "q6",
    prompt: "Who wags their happy tail and says 'Woof woof'?",
    spokenPrompt: "Who wags their playful tail and barks woof woof?",
    soundCue: "Woof woof!",
    correctId: "dog",
    options: [
      { id: "dog", label: "Puppy Dog", emoji: "🐶", soundText: "Woof woof! Friendly pup!" },
      { id: "cat", label: "Cat", emoji: "🐱", soundText: "Meow meow!" },
      { id: "chicken", label: "Chicken", emoji: "🐔", soundText: "Cluck cluck!" },
      { id: "mouse", label: "Mouse", emoji: "🐭", soundText: "Squeak squeak!" },
    ],
  },
  {
    id: "q7",
    prompt: "Who paddles in the pond and quacks?",
    spokenPrompt: "Who paddles in the cool pond water and says quack quack?",
    soundCue: "Quack quack!",
    correctId: "duck",
    options: [
      { id: "frog", label: "Frog", emoji: "🐸", soundText: "Ribbit!" },
      { id: "duck", label: "Yellow Duck", emoji: "🦆", soundText: "Quack quack! Splash!" },
      { id: "cow", label: "Cow", emoji: "🐮", soundText: "Moooo!" },
      { id: "fox", label: "Fox", emoji: "🦊", soundText: "Yip yip!" },
    ],
  },
  {
    id: "q8",
    prompt: "Who swings high up in jungle trees and loves yellow bananas?",
    spokenPrompt: "Who swings from vines in the jungle and loves sweet yellow bananas?",
    soundCue: "Ooh ooh aah aah!",
    correctId: "monkey",
    options: [
      { id: "bear", label: "Bear", emoji: "🐻", soundText: "Growl bear!" },
      { id: "lion", label: "Lion", emoji: "🦁", soundText: "Roaaar!" },
      { id: "monkey", label: "Cheeky Monkey", emoji: "🐵", soundText: "Ooh ooh aah aah!" },
      { id: "turtle", label: "Turtle", emoji: "🐢", soundText: "Slow poke!" },
    ],
  },
  {
    id: "q9",
    prompt: "Who has a long grey trunk that sprays cool water?",
    spokenPrompt: "Who is the giant friendly friend with big floppy ears and a water-spraying trunk?",
    soundCue: "Pawoooot!",
    correctId: "elephant",
    options: [
      { id: "elephant", label: "Gentle Elephant", emoji: "🐘", soundText: "Pawoooot! Big trumpeting elephant!" },
      { id: "giraffe", label: "Giraffe", emoji: "🦒", soundText: "Tall leafy reach!" },
      { id: "rhino", label: "Rhino", emoji: "🦏", soundText: "Stomp stomp!" },
      { id: "zebra", label: "Zebra", emoji: "🦓", soundText: "Striped gallop!" },
    ],
  },
  {
    id: "q10",
    prompt: "Who has soft fluffy white wool and says 'Baa baa'?",
    spokenPrompt: "Who gives us soft warm wool for cozy sweaters and says baa baa?",
    soundCue: "Baa baa!",
    correctId: "sheep",
    options: [
      { id: "goat", label: "Goat", emoji: "🐐", soundText: "Maa maa!" },
      { id: "sheep", label: "Fluffy Sheep", emoji: "🐑", soundText: "Baa baa! Soft wool!" },
      { id: "horse", label: "Horse", emoji: "🐴", soundText: "Neigh neigh!" },
      { id: "pig", label: "Piggy", emoji: "🐷", soundText: "Oink oink!" },
    ],
  },
  {
    id: "q11",
    prompt: "Who wakes up the sunny farm with 'Cock-a-doodle-doo'?",
    spokenPrompt: "Who perches on the fence and crows cock-a-doodle-doo when morning arrives?",
    soundCue: "Cock a doodle doo!",
    correctId: "rooster",
    options: [
      { id: "rooster", label: "Morning Rooster", emoji: "🐓", soundText: "Cock a doodle doo! Good morning!" },
      { id: "owl", label: "Night Owl", emoji: "🦉", soundText: "Hoo hoo!" },
      { id: "parrot", label: "Parrot", emoji: "🦜", soundText: "Squawk squawk!" },
      { id: "duck", label: "Duck", emoji: "🦆", soundText: "Quack quack!" },
    ],
  },
  {
    id: "q12",
    prompt: "Who flies through the night sky with big round eyes and says 'Hoo hoo'?",
    spokenPrompt: "Who is the wise bird flying under the moon that calls hoo hoo?",
    soundCue: "Hoo hoo!",
    correctId: "owl",
    options: [
      { id: "bat", label: "Bat", emoji: "🦇", soundText: "Flap flutter!" },
      { id: "owl", label: "Wise Owl", emoji: "🦉", soundText: "Hoo hoo! Starry night!" },
      { id: "bird", label: "Bluebird", emoji: "🐦", soundText: "Tweet chirp!" },
      { id: "bee", label: "Honeybee", emoji: "🐝", soundText: "Buzzzz!" },
    ],
  },
  {
    id: "q13",
    prompt: "Who gallops fast across the green meadow and says 'Neigh'?",
    spokenPrompt: "Who has shiny hooves, a flowing mane, and says neigh neigh?",
    soundCue: "Neigh neigh!",
    correctId: "horse",
    options: [
      { id: "horse", label: "Galloping Horse", emoji: "🐴", soundText: "Neigh neigh! Clippity clop!" },
      { id: "cow", label: "Cow", emoji: "🐮", soundText: "Moooo!" },
      { id: "deer", label: "Spotted Deer", emoji: "🦌", soundText: "Prance prance!" },
      { id: "dog", label: "Dog", emoji: "🐶", soundText: "Woof woof!" },
    ],
  },
  {
    id: "q14",
    prompt: "Who rolls in cooling mud puddles and says 'Oink oink'?",
    spokenPrompt: "Who is the happy pink friend with a curly tail that says oink oink?",
    soundCue: "Oink oink!",
    correctId: "pig",
    options: [
      { id: "pig", label: "Happy Piggy", emoji: "🐷", soundText: "Oink oink! Splish in mud!" },
      { id: "hippo", label: "Hippo", emoji: "🦛", soundText: "Yawn splash!" },
      { id: "bunny", label: "Bunny", emoji: "🐰", soundText: "Hop hop!" },
      { id: "cat", label: "Kitten", emoji: "🐱", soundText: "Purr meow!" },
    ],
  },
  ...BONUS_EXPLORER_QUESTIONS,
];

interface ShapeQuestion {
  id: string;
  prompt: string;
  spokenPrompt: string;
  correctId: string;
  options: {
    id: string;
    label: string;
    emoji: string;
    color: string;
  }[];
}

const SHAPE_QUESTIONS: ShapeQuestion[] = [
  {
    id: "s1",
    prompt: "Tap the Sparkling Golden Star!",
    spokenPrompt: "Can you find the sparkling golden star? Look up in the sky!",
    correctId: "star",
    options: [
      { id: "circle", label: "Blue Circle", emoji: "🔵", color: "from-blue-500 to-cyan-400" },
      { id: "star", label: "Golden Star", emoji: "⭐", color: "from-amber-400 to-yellow-300" },
      { id: "square", label: "Green Square", emoji: "🟩", color: "from-emerald-500 to-teal-400" },
      { id: "heart", label: "Pink Heart", emoji: "💖", color: "from-pink-500 to-rose-400" },
    ],
  },
  {
    id: "s2",
    prompt: "Where is the Lovely Warm Heart?",
    spokenPrompt: "Where is the sweet pink heart? Give it a gentle tap!",
    correctId: "heart",
    options: [
      { id: "diamond", label: "Purple Diamond", emoji: "💎", color: "from-purple-500 to-indigo-400" },
      { id: "circle", label: "Red Circle", emoji: "🔴", color: "from-rose-500 to-red-400" },
      { id: "heart", label: "Warm Heart", emoji: "💖", color: "from-pink-500 to-rose-400" },
      { id: "sun", label: "Yellow Sun", emoji: "☀️", color: "from-amber-400 to-orange-400" },
    ],
  },
  {
    id: "s3",
    prompt: "Find the Round Blue Circle!",
    spokenPrompt: "Can you tap the round blue circle like the ocean?",
    correctId: "circle",
    options: [
      { id: "triangle", label: "Orange Triangle", emoji: "🔺", color: "from-orange-500 to-amber-400" },
      { id: "square", label: "Green Square", emoji: "🟩", color: "from-emerald-500 to-teal-400" },
      { id: "star", label: "Golden Star", emoji: "⭐", color: "from-amber-400 to-yellow-300" },
      { id: "circle", label: "Blue Circle", emoji: "🔵", color: "from-blue-500 to-cyan-400" },
    ],
  },
  {
    id: "s4",
    prompt: "Find the Bright Sunshine!",
    spokenPrompt: "Where is the bright happy sunshine warming up the day?",
    correctId: "sun",
    options: [
      { id: "sun", label: "Bright Sun", emoji: "☀️", color: "from-amber-400 to-orange-400" },
      { id: "moon", label: "Sleepy Moon", emoji: "🌙", color: "from-indigo-400 to-blue-300" },
      { id: "cloud", label: "Fluffy Cloud", emoji: "☁️", color: "from-slate-400 to-cyan-200" },
      { id: "rainbow", label: "Rainbow", emoji: "🌈", color: "from-pink-400 to-amber-300" },
    ],
  },
  {
    id: "s5",
    prompt: "Find the Green Square with 4 equal sides!",
    spokenPrompt: "Can you find the green square? It has four equal straight sides!",
    correctId: "square",
    options: [
      { id: "circle", label: "Orange Circle", emoji: "🟠", color: "from-orange-500 to-amber-400" },
      { id: "triangle", label: "Yellow Triangle", emoji: "🔺", color: "from-amber-400 to-yellow-300" },
      { id: "square", label: "Green Square", emoji: "🟩", color: "from-emerald-500 to-teal-400" },
      { id: "star", label: "Star", emoji: "⭐", color: "from-amber-400 to-yellow-300" },
    ],
  },
  {
    id: "s6",
    prompt: "Find the Pointy Orange Triangle! (3 Corners)",
    spokenPrompt: "Where is the orange triangle with three pointy corners?",
    correctId: "triangle",
    options: [
      { id: "triangle", label: "Orange Triangle", emoji: "🔺", color: "from-orange-500 to-amber-400" },
      { id: "circle", label: "Blue Circle", emoji: "🔵", color: "from-blue-500 to-cyan-400" },
      { id: "heart", label: "Pink Heart", emoji: "💖", color: "from-pink-500 to-rose-400" },
      { id: "square", label: "Purple Square", emoji: "🟪", color: "from-purple-500 to-indigo-400" },
    ],
  },
  {
    id: "s7",
    prompt: "Find the Sparkling Purple Diamond Gem!",
    spokenPrompt: "Can you spot the shiny purple diamond sparkling like a jewel?",
    correctId: "diamond",
    options: [
      { id: "circle", label: "Circle", emoji: "🔴", color: "from-rose-500 to-red-400" },
      { id: "diamond", label: "Purple Diamond", emoji: "💎", color: "from-purple-500 to-indigo-400" },
      { id: "sun", label: "Sun", emoji: "☀️", color: "from-amber-400 to-orange-400" },
      { id: "cloud", label: "Cloud", emoji: "☁️", color: "from-slate-400 to-cyan-200" },
    ],
  },
  {
    id: "s8",
    prompt: "Find the Sleepy Crescent Moon in the night sky!",
    spokenPrompt: "Where is the sleepy crescent moon shining in the peaceful night?",
    correctId: "moon",
    options: [
      { id: "sun", label: "Daytime Sun", emoji: "☀️", color: "from-amber-400 to-orange-400" },
      { id: "moon", label: "Crescent Moon", emoji: "🌙", color: "from-indigo-400 to-blue-300" },
      { id: "heart", label: "Pink Heart", emoji: "💖", color: "from-pink-500 to-rose-400" },
      { id: "star", label: "Golden Star", emoji: "⭐", color: "from-amber-400 to-yellow-300" },
    ],
  },
  {
    id: "s9",
    prompt: "Find the Colorful Rainbow Arc in the sky!",
    spokenPrompt: "Look at the sky! Where is the magical curved rainbow?",
    correctId: "rainbow",
    options: [
      { id: "rainbow", label: "Rainbow Arc", emoji: "🌈", color: "from-pink-400 to-amber-300" },
      { id: "cloud", label: "Raincloud", emoji: "🌧️", color: "from-slate-400 to-blue-300" },
      { id: "circle", label: "Blue Circle", emoji: "🔵", color: "from-blue-500 to-cyan-400" },
      { id: "square", label: "Green Square", emoji: "🟩", color: "from-emerald-500 to-teal-400" },
    ],
  },
  {
    id: "s10",
    prompt: "Find the Soft White Cloud floating by!",
    spokenPrompt: "Can you find the fluffy soft cloud floating through the blue sky?",
    correctId: "cloud",
    options: [
      { id: "star", label: "Star", emoji: "⭐", color: "from-amber-400 to-yellow-300" },
      { id: "sun", label: "Sun", emoji: "☀️", color: "from-amber-400 to-orange-400" },
      { id: "cloud", label: "Fluffy Cloud", emoji: "☁️", color: "from-slate-300 to-cyan-200" },
      { id: "heart", label: "Heart", emoji: "💖", color: "from-pink-500 to-rose-400" },
    ],
  },
  {
    id: "s11",
    prompt: "Find the Golden Bell that rings Ding-Dong!",
    spokenPrompt: "Where is the shiny golden bell ready to ring?",
    correctId: "bell",
    options: [
      { id: "bell", label: "Golden Bell", emoji: "🔔", color: "from-amber-400 to-yellow-300" },
      { id: "square", label: "Blue Square", emoji: "🟦", color: "from-blue-500 to-indigo-400" },
      { id: "circle", label: "Green Circle", emoji: "🟢", color: "from-emerald-500 to-teal-400" },
      { id: "diamond", label: "Diamond", emoji: "💎", color: "from-purple-500 to-indigo-400" },
    ],
  },
  {
    id: "s12",
    prompt: "Find the Sweet Red Berry Heart!",
    spokenPrompt: "Where is the sweet red berry heart delicious and ripe?",
    correctId: "berry",
    options: [
      { id: "circle", label: "Yellow Circle", emoji: "🟡", color: "from-amber-400 to-yellow-300" },
      { id: "triangle", label: "Blue Triangle", emoji: "🔺", color: "from-blue-500 to-cyan-400" },
      { id: "berry", label: "Red Berry", emoji: "🍓", color: "from-rose-500 to-red-400" },
      { id: "square", label: "Green Square", emoji: "🟩", color: "from-emerald-500 to-teal-400" },
    ],
  },
];

interface BubbleItem {
  id: number;
  emoji: string;
  name: string;
  color: string;
  type: "star" | "heart" | "balloon" | "sun" | "berry";
  x: number;
  y: number;
  size: number;
}

export function ToddlerQuizzesAndGames({
  starsCount,
  onAddStar,
}: ToddlerQuizzesAndGamesProps) {
  const [currentActivity, setCurrentActivity] = useState<ToddlerActivity>("animal-quiz");

  // Voice status & mute state
  const [isVoiceActive, setIsVoiceActive] = useState<boolean>(false);
  const [voiceMuted, setVoiceMutedState] = useState<boolean>(() => isVoiceMuted());

  // Animal Quiz State
  // Keep each playthrough fresh: a shuffled full-length round means familiar skills
  // get revisited in a different order instead of feeling like a short fixed demo.
  const [questionDeck, setQuestionDeck] = useState<QuizQuestion[]>(() => shuffleChoices(ANIMAL_QUIZ_QUESTIONS));
  const [questionIndex, setQuestionIndex] = useState<number>(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [quizScore, setQuizScore] = useState<number>(0);
  const [isQuestionAnswered, setIsQuestionAnswered] = useState<boolean>(false);
  const [isQuizCompleted, setIsQuizCompleted] = useState<boolean>(false);
  const [wrongShakeId, setWrongShakeId] = useState<string | null>(null);

  // Shapes & Colors State
  const [shapeIndex, setShapeIndex] = useState<number>(0);
  const [selectedShapeId, setSelectedShapeId] = useState<string | null>(null);
  const [isShapeAnswered, setIsShapeAnswered] = useState<boolean>(false);
  const [isShapeCompleted, setIsShapeCompleted] = useState<boolean>(false);
  const [wrongShapeShakeId, setWrongShapeShakeId] = useState<string | null>(null);

  // Bubble Pop Game State
  const [bubbles, setBubbles] = useState<BubbleItem[]>([]);
  const [bubblesPoppedCount, setBubblesPoppedCount] = useState<number>(0);

  // Feed the Animal State
  const [carrotsFed, setCarrotsFed] = useState<number>(0);
  const targetCarrots = 5;

  // Timers refs to ensure seamless synchronization and eliminate any overlap
  const advanceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const promptTimerRef = useRef<NodeJS.Timeout | null>(null);

  const currentQuiz = questionDeck[questionIndex];
  const currentShape = SHAPE_QUESTIONS[shapeIndex];

  // Subscribe to speech activity to display speaking badge
  useEffect(() => {
    const unsub = speechCoordinator.subscribe((speaking) => {
      setIsVoiceActive(speaking);
    });
    return unsub;
  }, []);

  const toggleVoiceMute = () => {
    const next = !voiceMuted;
    setVoiceMutedState(next);
    setVoiceMuted(next);
    if (next) {
      stopSpeaking();
    } else {
      speakText("Voice enabled!", { pitch: 1.2 });
    }
  };

  // Clean up timers and audio on activity change or unmount
  useEffect(() => {
    stopSpeaking();
    if (advanceTimerRef.current) {
      clearTimeout(advanceTimerRef.current);
      advanceTimerRef.current = null;
    }
    if (promptTimerRef.current) {
      clearTimeout(promptTimerRef.current);
      promptTimerRef.current = null;
    }

    if (currentActivity === "bubble-pop") {
      spawnBubbles();
      setTimeout(() => {
        speakText("Welcome to Bubble Pop! Pop all the shiny floating bubbles to collect golden stars!", { pitch: 1.25 });
      }, 150);
    }

    if (currentActivity === "feed-animal") {
      setTimeout(() => {
        speakText("Benny Bunny is hungry! Tap the crunchy orange carrots to feed bunny!", { pitch: 1.25 });
      }, 150);
    }

    return () => {
      stopSpeaking();
      if (advanceTimerRef.current) {
        clearTimeout(advanceTimerRef.current);
        advanceTimerRef.current = null;
      }
      if (promptTimerRef.current) {
        clearTimeout(promptTimerRef.current);
        promptTimerRef.current = null;
      }
    };
  }, [currentActivity]);

  // Read Animal Quiz prompt smoothly when question changes
  useEffect(() => {
    if (currentActivity === "animal-quiz" && currentQuiz && !isQuizCompleted && !isQuestionAnswered) {
      if (promptTimerRef.current) {
        clearTimeout(promptTimerRef.current);
      }
      // Gentle 600ms pause after card renders before reading prompt to ensure previous audio is completely finished
      promptTimerRef.current = setTimeout(() => {
        stopSpeaking();
        speakText(currentQuiz.spokenPrompt, { pitch: 1.2, rate: 0.88 });
      }, 600);

      return () => {
        if (promptTimerRef.current) {
          clearTimeout(promptTimerRef.current);
          promptTimerRef.current = null;
        }
      };
    }
  }, [questionIndex, currentActivity, isQuizCompleted, isQuestionAnswered]);

  // Read Shape Quiz prompt smoothly
  useEffect(() => {
    if (currentActivity === "shape-match" && currentShape && !isShapeCompleted && !isShapeAnswered) {
      if (promptTimerRef.current) {
        clearTimeout(promptTimerRef.current);
      }
      promptTimerRef.current = setTimeout(() => {
        stopSpeaking();
        speakText(currentShape.spokenPrompt, { pitch: 1.2, rate: 0.88 });
      }, 600);

      return () => {
        if (promptTimerRef.current) {
          clearTimeout(promptTimerRef.current);
          promptTimerRef.current = null;
        }
      };
    }
  }, [shapeIndex, currentActivity, isShapeCompleted, isShapeAnswered]);

  // ==================== ANIMAL QUIZ HANDLER ====================
  const handleSelectQuizOption = (optionId: string) => {
    if (isQuestionAnswered) return;

    // Clear any previous advance timers
    if (advanceTimerRef.current) {
      clearTimeout(advanceTimerRef.current);
      advanceTimerRef.current = null;
    }

    setSelectedOptionId(optionId);
    const chosen = currentQuiz.options.find((o) => o.id === optionId);

    if (optionId === currentQuiz.correctId) {
      // Correct!
      setIsQuestionAnswered(true);
      soundEffects.playSuccessChime();
      soundEffects.playStarSparkle();
      onAddStar(1);
      setQuizScore((prev) => prev + 1);

      const isLast = questionIndex >= questionDeck.length - 1;

      // Telemetry into unified learner brain
      try {
        recordLearningEvent({
          learnerId: getActiveLearnerId(),
          activityId: "toddler-animal-quiz",
          activityType: "toddler-quiz",
          activityTitle: `Animal Safari Quiz: Found ${chosen?.label || "Animal"}`,
          skillId: "sci-k1-habitats",
          domain: "science",
          gradeBand: "toddler",
          result: isLast ? "mastered" : "success",
          score: 100,
          difficulty: "easy",
          attempts: 1,
          hintsUsed: 0,
        });
      } catch {}

      // Perfectly synchronized transition: Wait for voice to finish, then advance smoothly!
      let hasCompleted = false;

      const triggerAdvance = () => {
        if (hasCompleted) return;
        hasCompleted = true;

        if (advanceTimerRef.current) {
          clearTimeout(advanceTimerRef.current);
          advanceTimerRef.current = null;
        }

        // Cleanly stop any lingering audio before transitioning state
        stopSpeaking();

        if (!isLast) {
          setQuestionIndex((prev) => prev + 1);
          setSelectedOptionId(null);
          setIsQuestionAnswered(false);
        } else {
          setIsQuizCompleted(true);
          soundEffects.playFanfare();
          onAddStar(3);
          setTimeout(() => {
            speakText("Hooray! You finished the Little Explorer Quiz! You are an amazing animal champion!", {
              pitch: 1.2,
            });
          }, 350);
        }
      };

      const feedbackPhrase = `Yes! That is the ${chosen?.label}! ${chosen?.soundText || ""} Super star!`;
      const fallbackMs = Math.max(7500, Math.ceil((feedbackPhrase.length / 8) * 1000) + 2000);

      // Speak warm feedback text
      speakText(feedbackPhrase, {
        pitch: 1.24,
        rate: 0.9,
        onEnd: () => {
          // After speech cleanly concludes, give a gentle 650ms visual celebration pause before transitioning
          advanceTimerRef.current = setTimeout(() => {
            triggerAdvance();
          }, 650);
        },
      });

      // Safety fallback timer: fires only if browser speech engine is muted or stalls
      advanceTimerRef.current = setTimeout(() => {
        triggerAdvance();
      }, fallbackMs);
    } else {
      // Wrong option: warm, non-punitive gentle bounce
      soundEffects.playGentleBoing();
      setWrongShakeId(optionId);
      const answerLabel = currentQuiz.options.find((option) => option.id === currentQuiz.correctId)?.label ?? "right answer";
      speakText(`That's the ${chosen?.label}! Let's try to find ${answerLabel}!`, {
        pitch: 1.15,
        rate: 0.9,
      });
      setTimeout(() => {
        setWrongShakeId(null);
        setSelectedOptionId(null);
      }, 1400);
    }
  };

  const handleRestartQuiz = () => {
    stopSpeaking();
    if (advanceTimerRef.current) {
      clearTimeout(advanceTimerRef.current);
      advanceTimerRef.current = null;
    }
    setQuestionDeck((previous) => {
      const next = shuffleChoices(ANIMAL_QUIZ_QUESTIONS);
      // Avoid starting two consecutive rounds with the same first question.
      if (next.length > 1 && next[0]?.id === previous[0]?.id) [next[0], next[1]] = [next[1], next[0]];
      return next;
    });
    setQuestionIndex(0);
    setSelectedOptionId(null);
    setIsQuestionAnswered(false);
    setIsQuizCompleted(false);
    setQuizScore(0);
  };

  // ==================== SHAPE & COLOR MATCH HANDLER ====================
  const handleSelectShapeOption = (optionId: string) => {
    if (isShapeAnswered) return;

    if (advanceTimerRef.current) {
      clearTimeout(advanceTimerRef.current);
      advanceTimerRef.current = null;
    }

    setSelectedShapeId(optionId);
    const chosen = currentShape.options.find((o) => o.id === optionId);

    if (optionId === currentShape.correctId) {
      setIsShapeAnswered(true);
      soundEffects.playSuccessChime();
      soundEffects.playStarSparkle();
      onAddStar(1);

      const isLast = shapeIndex >= SHAPE_QUESTIONS.length - 1;

      // Telemetry into unified learner brain
      try {
        recordLearningEvent({
          learnerId: getActiveLearnerId(),
          activityId: "toddler-shape-quiz",
          activityType: "toddler-quiz",
          activityTitle: `Shape & Color Quiz: Identified ${chosen?.label || "Shape"}`,
          skillId: "logic-k1-sorting",
          domain: "logic",
          gradeBand: "toddler",
          result: isLast ? "mastered" : "success",
          score: 100,
          difficulty: "easy",
          attempts: 1,
          hintsUsed: 0,
        });
      } catch {}
      let hasCompleted = false;

      const triggerAdvance = () => {
        if (hasCompleted) return;
        hasCompleted = true;

        if (advanceTimerRef.current) {
          clearTimeout(advanceTimerRef.current);
          advanceTimerRef.current = null;
        }

        // Cleanly stop any lingering audio before transitioning state
        stopSpeaking();

        if (!isLast) {
          setShapeIndex((prev) => prev + 1);
          setSelectedShapeId(null);
          setIsShapeAnswered(false);
        } else {
          setIsShapeCompleted(true);
          soundEffects.playFanfare();
          onAddStar(3);
          setTimeout(() => {
            speakText("Hooray! You found all the beautiful shapes and colors! You are so smart!", {
              pitch: 1.25,
            });
          }, 350);
        }
      };

      const feedbackPhrase = `Wonderful! That is the ${chosen?.label}! You found it!`;
      const fallbackMs = Math.max(7000, Math.ceil((feedbackPhrase.length / 8) * 1000) + 2000);

      speakText(feedbackPhrase, {
        pitch: 1.25,
        rate: 0.9,
        onEnd: () => {
          advanceTimerRef.current = setTimeout(() => {
            triggerAdvance();
          }, 650);
        },
      });

      advanceTimerRef.current = setTimeout(() => {
        triggerAdvance();
      }, fallbackMs);
    } else {
      soundEffects.playGentleBoing();
      setWrongShapeShakeId(optionId);
      speakText(`That's the ${chosen?.label}! Let's find ${currentShape.correctId}!`, {
        pitch: 1.15,
        rate: 0.9,
      });
      setTimeout(() => {
        setWrongShapeShakeId(null);
        setSelectedShapeId(null);
      }, 1400);
    }
  };

  const handleRestartShapes = () => {
    stopSpeaking();
    if (advanceTimerRef.current) {
      clearTimeout(advanceTimerRef.current);
      advanceTimerRef.current = null;
    }
    setShapeIndex(0);
    setSelectedShapeId(null);
    setIsShapeAnswered(false);
    setIsShapeCompleted(false);
  };

  // ==================== BUBBLE POP GAME ====================
  const spawnBubbles = () => {
    const types: BubbleItem["type"][] = ["star", "heart", "sun", "balloon", "berry"];
    const emojis: Record<BubbleItem["type"], string> = {
      star: "⭐",
      heart: "💖",
      sun: "☀️",
      balloon: "🎈",
      berry: "🍓",
    };
    const colors: Record<BubbleItem["type"], string> = {
      star: "from-amber-400/80 to-yellow-300/80",
      heart: "from-rose-400/80 to-pink-300/80",
      sun: "from-orange-400/80 to-amber-300/80",
      balloon: "from-blue-400/80 to-cyan-300/80",
      berry: "from-purple-400/80 to-pink-400/80",
    };

    const newBubbles: BubbleItem[] = Array.from({ length: 8 }, (_, i) => {
      const type = types[i % types.length];
      return {
        id: Date.now() + i,
        type,
        emoji: emojis[type],
        name: type,
        color: colors[type],
        x: 12 + ((i * 18) % 76) + Math.random() * 8,
        y: 15 + Math.floor(i / 2) * 20 + Math.random() * 8,
        size: 72 + Math.floor(Math.random() * 20),
      };
    });

    setBubbles(newBubbles);
    soundEffects.playPop();
  };

  const handlePopBubble = (bubble: BubbleItem) => {
    soundEffects.playPop();
    soundEffects.playStarSparkle();
    setBubbles((prev) => prev.filter((b) => b.id !== bubble.id));
    setBubblesPoppedCount((prev) => prev + 1);
    onAddStar(1);

    // Speak cheerful short sound
    const shortPhrases = ["Pop!", "Super!", "Yay!", "Sparkle!", "Wheee!"];
    const phrase = shortPhrases[Math.floor(Math.random() * shortPhrases.length)];
    speakText(phrase, { pitch: 1.35, rate: 1.1 });
  };

  // ==================== FEED THE BUNNY ====================
  const handleFeedCarrot = () => {
    if (carrotsFed >= targetCarrots) return;

    soundEffects.playPop();
    const nextCount = carrotsFed + 1;
    setCarrotsFed(nextCount);
    onAddStar(1);

    if (nextCount < targetCarrots) {
      speakText(`${nextCount}! Munch munch munch! Yummy!`, { pitch: 1.3, rate: 0.95 });
    } else {
      soundEffects.playFanfare();
      onAddStar(3);
      speakText("Thank you so much! Benny Bunny is so full and happy! You earned three golden stars!", {
        pitch: 1.25,
      });

      try {
        recordLearningEvent({
          learnerId: getActiveLearnerId(),
          activityId: "toddler-feed-animal",
          activityType: "toddler-counting",
          activityTitle: `Feed Benny Bunny: Counted ${targetCarrots} Carrots`,
          skillId: "math-k1-counting",
          domain: "math",
          gradeBand: "toddler",
          result: "mastered",
          score: 100,
          difficulty: "easy",
          attempts: 1,
          hintsUsed: 0,
        });
      } catch {}
    }
  };

  const handleResetBunny = () => {
    setCarrotsFed(0);
    speakText("Bunny is ready to eat again! Tap the crunchy carrots to feed bunny!", { pitch: 1.2 });
  };

  return (
    <div className="space-y-6">
      {/* Top Controls: Voice Status & Audio Mute Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-white/[0.03] border border-white/10 max-w-3xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-400/15 border border-amber-400/30 text-amber-300 font-extrabold text-xs">
            <Sparkles size={13} />
            <span>Toddler Play Zone</span>
          </div>

          {/* Real-time speaking wave indicator */}
          {isVoiceActive && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-bold"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>AI Voice Speaking...</span>
            </motion.div>
          )}
        </div>

        {/* Child & Parent Voice Mute Button */}
        <button
          onClick={toggleVoiceMute}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs border transition-all cursor-pointer ${
            voiceMuted
              ? "bg-rose-500/20 border-rose-400/40 text-rose-300 hover:bg-rose-500/30"
              : "bg-white/10 border-white/15 text-white/80 hover:text-white hover:bg-white/20"
          }`}
          title={voiceMuted ? "Voice narration is muted. Click to turn on." : "Voice narration is active."}
        >
          {voiceMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
          <span>{voiceMuted ? "Voice Muted" : "Voice Sound On"}</span>
        </button>
      </div>

      {/* Game Selector Bar (Big, Touchable, Colorful - 10 Interactive Wonderland Games) */}
      <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-1.5 p-1.5 rounded-3xl bg-white/[0.04] border border-white/10 max-w-6xl mx-auto">
        <button
          onClick={() => {
            setCurrentActivity("rainbow-piano");
            soundEffects.playPop();
          }}
          className={`flex flex-col items-center justify-center gap-1 py-2 px-1 rounded-2xl font-black text-[11px] transition-all cursor-pointer border-b-4 ${
            currentActivity === "rainbow-piano"
              ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white border-rose-700 shadow-md scale-102 ring-2 ring-pink-300/40"
              : "bg-white/5 border-white/10 text-white/60 hover:text-white hover:bg-white/10"
          }`}
        >
          <span className="text-base sm:text-lg">🎹</span>
          <span className="truncate">Xylophone</span>
        </button>

        <button
          onClick={() => {
            setCurrentActivity("animal-safari");
            soundEffects.playPop();
          }}
          className={`flex flex-col items-center justify-center gap-1 py-2 px-1 rounded-2xl font-black text-[11px] transition-all cursor-pointer border-b-4 ${
            currentActivity === "animal-safari"
              ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-teal-700 shadow-md scale-102 ring-2 ring-emerald-300/40"
              : "bg-white/5 border-white/10 text-white/60 hover:text-white hover:bg-white/10"
          }`}
        >
          <span className="text-base sm:text-lg">🌿</span>
          <span className="truncate">Safari</span>
        </button>

        <button
          onClick={() => {
            setCurrentActivity("balloon-sky");
            soundEffects.playPop();
          }}
          className={`flex flex-col items-center justify-center gap-1 py-2 px-1 rounded-2xl font-black text-[11px] transition-all cursor-pointer border-b-4 ${
            currentActivity === "balloon-sky"
              ? "bg-gradient-to-r from-sky-400 to-blue-500 text-white border-blue-700 shadow-md scale-102 ring-2 ring-sky-300/40"
              : "bg-white/5 border-white/10 text-white/60 hover:text-white hover:bg-white/10"
          }`}
        >
          <span className="text-base sm:text-lg">🎈</span>
          <span className="truncate">Balloons</span>
        </button>

        <button
          onClick={() => {
            setCurrentActivity("animal-quiz");
            handleRestartQuiz();
          }}
          className={`flex flex-col items-center justify-center gap-1 py-2 px-1 rounded-2xl font-black text-[11px] transition-all cursor-pointer border-b-4 ${
            currentActivity === "animal-quiz"
              ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white border-orange-700 shadow-md scale-102 ring-2 ring-amber-300/40"
              : "bg-white/5 border-white/10 text-white/60 hover:text-white hover:bg-white/10"
          }`}
        >
          <span className="text-base sm:text-lg">🦁</span>
          <span className="truncate">Animal Quiz</span>
        </button>

        <button
          onClick={() => {
            setCurrentActivity("shape-match");
            handleRestartShapes();
          }}
          className={`flex flex-col items-center justify-center gap-1 py-2 px-1 rounded-2xl font-black text-[11px] transition-all cursor-pointer border-b-4 ${
            currentActivity === "shape-match"
              ? "bg-gradient-to-r from-purple-500 to-indigo-500 text-white border-indigo-700 shadow-md scale-102 ring-2 ring-purple-300/40"
              : "bg-white/5 border-white/10 text-white/60 hover:text-white hover:bg-white/10"
          }`}
        >
          <span className="text-base sm:text-lg">⭐</span>
          <span className="truncate">Shapes</span>
        </button>

        <button
          onClick={() => {
            setCurrentActivity("memory-match");
            soundEffects.playPop();
          }}
          className={`flex flex-col items-center justify-center gap-1 py-2 px-1 rounded-2xl font-black text-[11px] transition-all cursor-pointer border-b-4 ${
            currentActivity === "memory-match"
              ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-cyan-700 shadow-md scale-102 ring-2 ring-cyan-300/40"
              : "bg-white/5 border-white/10 text-white/60 hover:text-white hover:bg-white/10"
          }`}
        >
          <span className="text-base sm:text-lg">🧩</span>
          <span className="truncate">Memory</span>
        </button>

        <button
          onClick={() => {
            setCurrentActivity("rhyme-time");
            soundEffects.playPop();
          }}
          className={`flex flex-col items-center justify-center gap-1 py-2 px-1 rounded-2xl font-black text-[11px] transition-all cursor-pointer border-b-4 ${
            currentActivity === "rhyme-time"
              ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white border-rose-700 shadow-md scale-102 ring-2 ring-pink-300/40"
              : "bg-white/5 border-white/10 text-white/60 hover:text-white hover:bg-white/10"
          }`}
        >
          <span className="text-base sm:text-lg">🎵</span>
          <span className="truncate">Rhymes</span>
        </button>

        <button
          onClick={() => {
            setCurrentActivity("color-magic");
            soundEffects.playPop();
          }}
          className={`flex flex-col items-center justify-center gap-1 py-2 px-1 rounded-2xl font-black text-[11px] transition-all cursor-pointer border-b-4 ${
            currentActivity === "color-magic"
              ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-teal-700 shadow-md scale-102 ring-2 ring-emerald-300/40"
              : "bg-white/5 border-white/10 text-white/60 hover:text-white hover:bg-white/10"
          }`}
        >
          <span className="text-base sm:text-lg">🎨</span>
          <span className="truncate">Color Lab</span>
        </button>

        <button
          onClick={() => {
            setCurrentActivity("bubble-pop");
            spawnBubbles();
          }}
          className={`flex flex-col items-center justify-center gap-1 py-2 px-1 rounded-2xl font-black text-[11px] transition-all cursor-pointer border-b-4 ${
            currentActivity === "bubble-pop"
              ? "bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white border-fuchsia-700 shadow-md scale-102 ring-2 ring-fuchsia-300/40"
              : "bg-white/5 border-white/10 text-white/60 hover:text-white hover:bg-white/10"
          }`}
        >
          <span className="text-base sm:text-lg">🫧</span>
          <span className="truncate">Bubbles</span>
        </button>

        <button
          onClick={() => {
            setCurrentActivity("feed-animal");
            handleResetBunny();
          }}
          className={`flex flex-col items-center justify-center gap-1 py-2 px-1 rounded-2xl font-black text-[11px] transition-all cursor-pointer border-b-4 ${
            currentActivity === "feed-animal"
              ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white border-amber-700 shadow-md scale-102 ring-2 ring-amber-300/40"
              : "bg-white/5 border-white/10 text-white/60 hover:text-white hover:bg-white/10"
          }`}
        >
          <span className="text-base sm:text-lg">🐰</span>
          <span className="truncate">Feed Bunny</span>
        </button>
      </div>

      {/* ACTIVITY 0: RAINBOW XYLOPHONE */}
      {currentActivity === "rainbow-piano" && (
        <ToddlerMusicPiano onAddStar={onAddStar} />
      )}

      {/* ACTIVITY 0B: ANIMAL SAFARI SOUNDS */}
      {currentActivity === "animal-safari" && (
        <ToddlerAnimalSafari onAddStar={onAddStar} />
      )}

      {/* ACTIVITY 0C: BALLOON SKY POPPING */}
      {currentActivity === "balloon-sky" && (
        <ToddlerBalloonSky onAddStar={onAddStar} />
      )}

      {/* ACTIVITY 1: ANIMAL SOUND & PICTURE QUIZ */}
      {currentActivity === "animal-quiz" && (
        <div className="max-w-3xl mx-auto">
          {!isQuizCompleted ? (
            <div className="p-6 sm:p-8 rounded-3xl bg-[#141524] border-2 border-amber-400/30 shadow-2xl relative overflow-hidden">
              {/* Header with Question Progress & Speaker */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 font-extrabold text-xs">
                    Question {questionIndex + 1} of {questionDeck.length}
                  </span>
                  <div className="hidden sm:block w-24 h-2 overflow-hidden rounded-full bg-white/10" aria-label={`${questionIndex} of ${questionDeck.length} questions complete`}>
                    <div className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-400 transition-all duration-500" style={{ width: `${(questionIndex / questionDeck.length) * 100}%` }} />
                  </div>
                </div>

                <button
                  onClick={() => speakText(currentQuiz.spokenPrompt, { pitch: 1.2, rate: 0.88 })}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold text-xs border border-amber-400/30 transition-all cursor-pointer"
                >
                  <Volume2 size={15} />
                  <span>Hear Again</span>
                </button>
              </div>

              {/* Big Question Prompt */}
              <div className="text-center mb-8">
                <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-white mb-2 leading-tight">
                  {currentQuiz.prompt}
                </h3>
                {currentQuiz.soundCue && (
                  <span className="inline-block px-4 py-1 rounded-full bg-orange-500/20 text-orange-300 text-sm font-black border border-orange-400/30 animate-bounce">
                    🔊 {currentQuiz.soundCue}
                  </span>
                )}
              </div>

              {/* Big 4-Choice Touch Cards */}
              <div className="grid grid-cols-2 gap-4 sm:gap-6">
                {currentQuiz.options.map((option) => {
                  const isSelected = selectedOptionId === option.id;
                  const isCorrect = isSelected && option.id === currentQuiz.correctId;
                  const isShaking = wrongShakeId === option.id;

                  return (
                    <motion.button
                      key={option.id}
                      whileHover={{ scale: 1.04, y: -4 }}
                      whileTap={{ scale: 0.95 }}
                      animate={
                        isShaking
                          ? { x: [-10, 10, -8, 8, 0] }
                          : isCorrect
                          ? { scale: [1, 1.1, 1.05] }
                          : {}
                      }
                      transition={{ duration: 0.3 }}
                      onClick={() => handleSelectQuizOption(option.id)}
                      className={`relative p-5 sm:p-7 rounded-3xl border-3 flex flex-col items-center justify-center transition-all cursor-pointer shadow-xl ${
                        isCorrect
                          ? "bg-emerald-500/30 border-emerald-400 ring-4 ring-emerald-400/40 text-white"
                          : isShaking
                          ? "bg-rose-500/30 border-rose-400 ring-4 ring-rose-400/40 text-white"
                          : "bg-white/[0.04] border-white/15 hover:border-amber-400/60 hover:bg-white/[0.08] text-white"
                      }`}
                    >
                      <span className="text-5xl sm:text-7xl mb-2 filter drop-shadow-md">
                        {option.emoji}
                      </span>
                      <span className="text-lg sm:text-xl font-black text-white">
                        {option.label}
                      </span>
                      {option.soundText && (
                        <span className="text-xs font-semibold text-white/50 mt-0.5">
                          {option.soundText}
                        </span>
                      )}

                      {isCorrect && (
                        <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-emerald-400 text-black flex items-center justify-center font-bold shadow-md">
                          ✓
                        </div>
                      )}
                    </motion.button>
                  );
                })}
              </div>

              {/* Bottom Guidance for Toddler / Parent */}
              <div className="mt-8 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-white/60">
                <span className="flex items-center gap-1.5 text-amber-300 font-bold">
                  <span>✨</span> Correct taps add golden stars to the Star Jar!
                </span>
                <span className="text-white/40">Tap any picture to answer</span>
              </div>
            </div>
          ) : (
            /* Quiz Completion Celebration Card */
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-amber-500/20 via-[#141524] to-[#141524] border-2 border-amber-400/40 shadow-2xl text-center space-y-5"
            >
              <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-5xl shadow-xl shadow-orange-500/40 animate-bounce">
                🏆
              </div>

              <h3 className="text-3xl font-black text-white">
                Super Job, Little Explorer!
              </h3>
              <p className="text-amber-200 text-sm max-w-md mx-auto">
                You recognized all the animal sounds and words! You earned{" "}
                <span className="font-extrabold text-white text-base">+3 Extra Golden Stars ⭐</span>!
              </p>

              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-amber-400/20 border border-amber-400/40 text-amber-300 font-black text-base">
                <Star className="w-6 h-6 fill-amber-400 text-amber-400" />
                <span>Your Total Stars: {starsCount}</span>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
                <button
                  onClick={handleRestartQuiz}
                  className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-black text-sm shadow-lg shadow-orange-500/30 transition-all hover:scale-105 active:scale-95 cursor-pointer"
                >
                  <RotateCcw size={16} />
                  <span>Play Quiz Again</span>
                </button>

                <button
                  onClick={() => {
                    setCurrentActivity("shape-match");
                    handleRestartShapes();
                  }}
                  className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-black text-sm transition-all cursor-pointer"
                >
                  <span>Next: Shapes & Colors! ⭐</span>
                </button>
              </div>
            </motion.div>
          )}
        </div>
      )}

      {/* ACTIVITY 2: SHAPES & COLORS MATCH DISCOVERY */}
      {currentActivity === "shape-match" && (
        <div className="max-w-3xl mx-auto">
          {!isShapeCompleted ? (
            <div className="p-6 sm:p-8 rounded-3xl bg-[#151326] border-2 border-purple-400/30 shadow-2xl relative overflow-hidden">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-purple-400/20 text-purple-300 font-extrabold text-xs">
                    Shape {shapeIndex + 1} of {SHAPE_QUESTIONS.length}
                  </span>
                  <div className="flex items-center gap-1">
                    {SHAPE_QUESTIONS.map((_, idx) => (
                      <Star
                        key={idx}
                        size={16}
                        className={
                          idx < shapeIndex
                            ? "fill-purple-400 text-purple-400"
                            : idx === shapeIndex
                            ? "fill-purple-400/40 text-purple-300 animate-pulse"
                            : "text-white/20"
                        }
                      />
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => speakText(currentShape.spokenPrompt, { pitch: 1.2, rate: 0.88 })}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 font-bold text-xs border border-purple-400/30 transition-all cursor-pointer"
                >
                  <Volume2 size={15} />
                  <span>Hear Again</span>
                </button>
              </div>

              <div className="text-center mb-8">
                <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-white mb-2 leading-tight">
                  {currentShape.prompt}
                </h3>
                <span className="inline-block px-4 py-1 rounded-full bg-purple-500/20 text-purple-300 text-sm font-bold border border-purple-400/30">
                  ✨ Color & Shape Identification
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 sm:gap-6">
                {currentShape.options.map((option) => {
                  const isSelected = selectedShapeId === option.id;
                  const isCorrect = isSelected && option.id === currentShape.correctId;
                  const isShaking = wrongShapeShakeId === option.id;

                  return (
                    <motion.button
                      key={option.id}
                      whileHover={{ scale: 1.04, y: -4 }}
                      whileTap={{ scale: 0.95 }}
                      animate={
                        isShaking
                          ? { x: [-10, 10, -8, 8, 0] }
                          : isCorrect
                          ? { scale: [1, 1.1, 1.05] }
                          : {}
                      }
                      transition={{ duration: 0.3 }}
                      onClick={() => handleSelectShapeOption(option.id)}
                      className={`relative p-6 sm:p-8 rounded-3xl border-3 flex flex-col items-center justify-center transition-all cursor-pointer shadow-xl ${
                        isCorrect
                          ? "bg-emerald-500/30 border-emerald-400 ring-4 ring-emerald-400/40 text-white"
                          : isShaking
                          ? "bg-rose-500/30 border-rose-400 ring-4 ring-rose-400/40 text-white"
                          : "bg-white/[0.04] border-white/15 hover:border-purple-400/60 hover:bg-white/[0.08] text-white"
                      }`}
                    >
                      <span className="text-6xl sm:text-7xl mb-2 filter drop-shadow-md">
                        {option.emoji}
                      </span>
                      <span className="text-lg sm:text-xl font-black text-white">
                        {option.label}
                      </span>

                      {isCorrect && (
                        <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-emerald-400 text-black flex items-center justify-center font-bold shadow-md">
                          ✓
                        </div>
                      )}
                    </motion.button>
                  );
                })}
              </div>

              <div className="mt-8 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-white/60">
                <span className="flex items-center gap-1.5 text-purple-300 font-bold">
                  <span>🎨</span> Great for visual discrimination and color recognition!
                </span>
                <span className="text-white/40">Tap any shape to answer</span>
              </div>
            </div>
          ) : (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-purple-500/20 via-[#151326] to-[#151326] border-2 border-purple-400/40 shadow-2xl text-center space-y-5"
            >
              <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br from-purple-400 to-indigo-500 flex items-center justify-center text-5xl shadow-xl shadow-purple-500/40 animate-bounce">
                🌟
              </div>

              <h3 className="text-3xl font-black text-white">
                You Mastered the Shapes & Colors!
              </h3>
              <p className="text-purple-200 text-sm max-w-md mx-auto">
                You found every star, heart, circle, and bright sun! You earned{" "}
                <span className="font-extrabold text-white text-base">+3 Extra Golden Stars ⭐</span>!
              </p>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
                <button
                  onClick={handleRestartShapes}
                  className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-400 hover:to-indigo-400 text-white font-black text-sm shadow-lg shadow-purple-500/30 transition-all hover:scale-105 active:scale-95 cursor-pointer"
                >
                  <RotateCcw size={16} />
                  <span>Play Shapes Again</span>
                </button>

                <button
                  onClick={() => {
                    setCurrentActivity("bubble-pop");
                    spawnBubbles();
                  }}
                  className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-black text-sm transition-all cursor-pointer"
                >
                  <span>Next: Pop Bubbles! 🎈</span>
                </button>
              </div>
            </motion.div>
          )}
        </div>
      )}

      {/* ACTIVITY 3: RAINBOW BUBBLE POP GAME */}
      {currentActivity === "bubble-pop" && (
        <div className="max-w-4xl mx-auto">
          <div className="p-4 sm:p-6 rounded-3xl bg-[#121320] border-2 border-pink-400/30 shadow-2xl relative overflow-hidden">
            {/* Top Bar for Bubble Pop */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
                  <span>🎈</span> Rainbow Bubble Popper
                </h3>
                <p className="text-white/60 text-xs">
                  Tap any floating bubble to pop it and collect stars!
                </p>
              </div>

              <div className="flex items-center gap-2">
                <div className="px-3 py-1.5 rounded-xl bg-pink-500/20 text-pink-300 border border-pink-400/30 font-black text-xs">
                  Popped: {bubblesPoppedCount} 🎈
                </div>
                <button
                  onClick={spawnBubbles}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer text-xs font-bold flex items-center gap-1"
                >
                  <RotateCcw size={14} /> Respawn
                </button>
              </div>
            </div>

            {/* Bubble Play Surface */}
            <div className="relative w-full h-[380px] sm:h-[440px] rounded-2xl bg-gradient-to-b from-indigo-950/40 via-purple-950/30 to-black/60 border border-white/10 overflow-hidden select-none">
              <AnimatePresence>
                {bubbles.map((bubble) => (
                  <motion.button
                    key={bubble.id}
                    initial={{ scale: 0, opacity: 0, y: 30 }}
                    animate={{
                      scale: 1,
                      opacity: 1,
                      y: [0, -12, 0],
                      x: [0, 8, 0],
                    }}
                    exit={{ scale: 1.4, opacity: 0 }}
                    transition={{
                      scale: { duration: 0.3 },
                      y: { repeat: Infinity, duration: 3 + (bubble.id % 3), ease: "easeInOut" },
                      x: { repeat: Infinity, duration: 4 + (bubble.id % 2), ease: "easeInOut" },
                    }}
                    onClick={() => handlePopBubble(bubble)}
                    style={{
                      left: `${bubble.x}%`,
                      top: `${bubble.y}%`,
                      width: `${bubble.size}px`,
                      height: `${bubble.size}px`,
                    }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-tr ${bubble.color} p-1 shadow-lg shadow-pink-500/20 flex items-center justify-center cursor-pointer border-2 border-white/60 hover:scale-110 active:scale-90 transition-transform`}
                  >
                    <span className="text-3xl sm:text-4xl filter drop-shadow">
                      {bubble.emoji}
                    </span>
                  </motion.button>
                ))}
              </AnimatePresence>

              {bubbles.length === 0 && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 space-y-3">
                  <span className="text-6xl animate-bounce">🌟</span>
                  <h4 className="text-xl font-black text-white">All Bubbles Popped!</h4>
                  <p className="text-xs text-pink-300">You're super quick!</p>
                  <button
                    onClick={spawnBubbles}
                    className="px-5 py-2.5 rounded-2xl bg-pink-500 hover:bg-pink-400 text-white font-black text-xs shadow-lg shadow-pink-500/40 cursor-pointer"
                  >
                    More Bubbles! 🎈
                  </button>
                </div>
              )}
            </div>

            <div className="mt-3 text-center text-xs text-white/40">
              💡 Parents: Encourages hand-eye coordination and fine motor touch tracking!
            </div>
          </div>
        </div>
      )}

      {/* ACTIVITY 4: FEED THE BUNNY (COUNTING GAME) */}
      {currentActivity === "feed-animal" && (
        <div className="max-w-2xl mx-auto">
          <div className="p-6 sm:p-8 rounded-3xl bg-[#131722] border-2 border-emerald-400/30 shadow-2xl text-center space-y-6">
            <div>
              <span className="px-3 py-1 rounded-full bg-emerald-400/20 text-emerald-300 text-xs font-bold border border-emerald-400/30">
                🥕 1-2-3 Counting Safari Game
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-white mt-2">
                Feed Hungry Benny Bunny!
              </h3>
              <p className="text-white/60 text-xs sm:text-sm mt-1">
                Tap the crunchy orange carrots below to feed Benny 5 delicious snacks!
              </p>
            </div>

            {/* Benny Bunny Visual Character */}
            <motion.div
              animate={
                carrotsFed === targetCarrots
                  ? { scale: [1, 1.15, 1], rotate: [0, 5, -5, 0] }
                  : { y: [0, -6, 0] }
              }
              transition={{ repeat: Infinity, duration: 2.5 }}
              className="w-40 h-40 mx-auto rounded-full bg-gradient-to-b from-emerald-500/20 to-teal-500/10 border-4 border-emerald-400/40 flex flex-col items-center justify-center shadow-inner relative"
            >
              <span className="text-7xl">🐰</span>
              {carrotsFed === targetCarrots && (
                <span className="absolute -top-3 right-0 text-3xl animate-spin">
                  👑
                </span>
              )}
            </motion.div>

            {/* Belly meter */}
            <div className="max-w-xs mx-auto space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold text-white">
                <span>Bunny's Full Tummy:</span>
                <span className="text-emerald-300">{carrotsFed} of {targetCarrots} Carrots</span>
              </div>
              <div className="h-4 rounded-full bg-white/10 overflow-hidden p-0.5 border border-white/15">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-teal-300 transition-all duration-300"
                  style={{ width: `${(carrotsFed / targetCarrots) * 100}%` }}
                />
              </div>
            </div>

            {/* Interactive Carrot Feed Button */}
            {carrotsFed < targetCarrots ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.92 }}
                onClick={handleFeedCarrot}
                className="px-8 py-5 rounded-3xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-white font-black text-lg shadow-xl shadow-orange-500/40 border-2 border-orange-300 transition-all cursor-pointer inline-flex items-center gap-3"
              >
                <span className="text-3xl animate-bounce">🥕</span>
                <span>Tap to Feed a Carrot! (+1 ⭐)</span>
              </motion.button>
            ) : (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-200 font-bold text-sm">
                  🎉 Benny Bunny is so full and happy! You finished counting to 5!
                </div>
                <button
                  onClick={handleResetBunny}
                  className="px-6 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-black text-xs transition-all cursor-pointer"
                >
                  Feed Bunny Again 🥕
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ACTIVITY 5: MEMORY CARD MATCH */}
      {currentActivity === "memory-match" && (
        <ToddlerMemoryGame onAddStar={onAddStar} />
      )}

      {/* ACTIVITY 6: RHYME TIME PLAYGROUND */}
      {currentActivity === "rhyme-time" && (
        <ToddlerRhymeGame onAddStar={onAddStar} />
      )}

      {/* ACTIVITY 7: COLOR MAGIC LAB */}
      {currentActivity === "color-magic" && (
        <ToddlerColorLab onAddStar={onAddStar} />
      )}
    </div>
  );
}
