import { AcademicMode, Notebook } from "../types";

export interface ModeConfig {
  id: AcademicMode;
  name: string;
  tagline: string;
  description: string;
  badgeColor: string;
  chips: string[];
}

export const ACADEMIC_MODES: Record<AcademicMode, ModeConfig> = {
  socratic: {
    id: "socratic",
    name: "Socratic Buddy",
    tagline: "Guides step-by-step with hints & questions",
    description: "Helps you think through math word problems and reading questions independently.",
    badgeColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    chips: [
      "Help me solve this fraction pizza problem",
      "Give me a hint on my 7 times table",
      "Why do plants need sunlight and water?",
      "Help me find the main idea of this story"
    ],
  },
  stem: {
    id: "stem",
    name: "STEM & Science Explorer",
    tagline: "Planets, animals, simple machines & math",
    description: "Explores solar system facts, animal life cycles, and step-by-step math breakdowns.",
    badgeColor: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    chips: [
      "Why is Mars called the Red Planet?",
      "Step-by-step 3-digit addition with carrying",
      "How do caterpillars become butterflies?",
      "Explain how a balance scale works"
    ],
  },
  writing: {
    id: "writing",
    name: "Reading & Story Coach",
    tagline: "Spelling, vocabulary & creative writing",
    description: "Builds descriptive sentences, fixes spelling, and sparks imaginative stories.",
    badgeColor: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    chips: [
      "Help me write a creative ending for my animal adventure",
      "Check my spelling and punctuation in this sentence",
      "Give me 3 exciting adjectives to describe a stormy castle",
      "Help me write a poem about friendship"
    ],
  },
  flashcards: {
    id: "flashcards",
    name: "Active Recall & Drills",
    tagline: "Quick quizzes, sight words & math drills",
    description: "Creates fun flashcards and 5-question quizzes for weekly spelling and math tests.",
    badgeColor: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    chips: [
      "Quiz me on 3rd grade sight words",
      "5 quick multiplication sprint questions",
      "Memory drill: parts of a plant",
      "Quiz me on animal habitats (desert vs ocean)"
    ],
  },
  teacher: {
    id: "teacher",
    name: "Educator & Lesson Studio",
    tagline: "Primary curriculum, rubrics & diagnostics",
    description: "Assists teachers and home tutors in creating differentiated tasks and milestone rubrics.",
    badgeColor: "bg-rose-500/10 text-rose-400 border-rose-500/20",
    chips: [
      "Create a 3rd grade reading comprehension rubric",
      "Design a 30-min hands-on fraction activity with food",
      "Draft encouraging feedback for a struggling reader",
      "Phonics phoneme blend practice plan for early years"
    ],
  },
};

export const INITIAL_NOTEBOOKS: Notebook[] = [
  {
    id: "math-primary-3",
    name: "Primary Mathematics & Word Problems",
    subject: "Mathematics",
    mode: "socratic",
    createdAt: Date.now() - 3600000 * 24 * 2,
    messages: [
      {
        id: "msg-init-1",
        role: "model",
        content: "Welcome to your **Primary Mathematics** notebook! 🌟 I'm your Socratic math buddy. Whenever you get stuck on multiplication, fractions, or tricky word problems, ask me for a hint and we will solve it together step-by-step!",
        timestamp: Date.now() - 3600000 * 24 * 2,
      },
    ],
  },
  {
    id: "reading-phonics-2",
    name: "Reading, Phonics & Creative Writing",
    subject: "Reading & English",
    mode: "writing",
    createdAt: Date.now() - 3600000 * 24,
    messages: [
      {
        id: "msg-init-2",
        role: "model",
        content: "Welcome to **Reading & Creative Writing**! 📚 Send me your story ideas, book questions, or sentences you want to polish. Let's make your writing exciting and colorful!",
        timestamp: Date.now() - 3600000 * 24,
      },
    ],
  },
  {
    id: "stem-discovery",
    name: "Science & Nature Discovery",
    subject: "Science & STEM",
    mode: "stem",
    createdAt: Date.now() - 3600000 * 12,
    messages: [
      {
        id: "msg-init-3",
        role: "model",
        content: "Welcome to **Science & Nature Discovery**! 🚀 From the orbits of the planets in our solar system to the secrets of rainforest animals, ask anything about how our world works.",
        timestamp: Date.now() - 3600000 * 12,
      },
    ],
  },
  {
    id: "flashcards-primary",
    name: "Spelling & Math Sprint Drills",
    subject: "Practice & Drills",
    mode: "flashcards",
    createdAt: Date.now() - 3600000 * 4,
    messages: [
      {
        id: "msg-init-4",
        role: "model",
        content: "Ready for quick practice? 🎯 I'll generate high-yield sight words, times tables, and fun vocabulary cards to get you test-ready!",
        timestamp: Date.now() - 3600000 * 4,
      },
    ],
  },
  {
    id: "teach-planning",
    name: "Primary Curriculum & Rubrics",
    subject: "Educator Suite",
    mode: "teacher",
    createdAt: Date.now() - 3600000,
    messages: [
      {
        id: "msg-init-5",
        role: "model",
        content: "Welcome to the **Primary Educator & Lesson Studio**. I can help design differentiated 30-minute lesson plans, 4-tier milestone rubrics, and scaffolded homework exercises for diverse learners.",
        timestamp: Date.now() - 3600000,
      },
    ],
  },
];
