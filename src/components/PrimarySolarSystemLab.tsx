import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Globe, Compass, Rocket, Award, Info, Scale, CheckCircle2, ChevronRight, Star } from "lucide-react";
import { soundEffects } from "../utils/soundEffects";
import { speakText } from "../utils/speechUtils";
import { awardXP, awardStars, triggerCelebrationConfetti } from "../utils/gamification";
import { recordLearningEvent, getActiveLearnerId } from "../utils/learnerBrain";

interface Planet {
  id: string;
  name: string;
  tag: string;
  distanceMillionKm: number;
  diameterKm: number;
  orbitDays: number;
  moons: number;
  gravityFactor: number; // relative to Earth 1.0
  tempC: string;
  colorGradient: string;
  borderColor: string;
  funFact: string;
  hasRings?: boolean;
}

const PLANETS: Planet[] = [
  {
    id: "mercury",
    name: "Mercury",
    tag: "The Swift Messenger",
    distanceMillionKm: 58,
    diameterKm: 4879,
    orbitDays: 88,
    moons: 0,
    gravityFactor: 0.38,
    tempC: "-180°C to 430°C",
    colorGradient: "from-stone-300 via-stone-500 to-slate-700",
    borderColor: "#78716c",
    funFact: "Mercury is the smallest planet and zips around the Sun faster than any other planet—one year is just 88 days!",
  },
  {
    id: "venus",
    name: "Venus",
    tag: "The Morning Star",
    distanceMillionKm: 108,
    diameterKm: 12104,
    orbitDays: 225,
    moons: 0,
    gravityFactor: 0.91,
    tempC: "465°C (Hottest)",
    colorGradient: "from-amber-200 via-orange-400 to-amber-700",
    borderColor: "#d97706",
    funFact: "Venus is covered in thick yellow toxic clouds that trap heat, making it even hotter than Mercury!",
  },
  {
    id: "earth",
    name: "Earth",
    tag: "The Blue Oasis",
    distanceMillionKm: 150,
    diameterKm: 12742,
    orbitDays: 365.25,
    moons: 1,
    gravityFactor: 1.0,
    tempC: "15°C Average",
    colorGradient: "from-sky-400 via-blue-500 to-emerald-500",
    borderColor: "#0284c7",
    funFact: "Earth is our home planet and the only world in the solar system with liquid oceans, breathable air, and life!",
  },
  {
    id: "mars",
    name: "Mars",
    tag: "The Red Planet",
    distanceMillionKm: 228,
    diameterKm: 6779,
    orbitDays: 687,
    moons: 2,
    gravityFactor: 0.38,
    tempC: "-63°C Average",
    colorGradient: "from-orange-400 via-red-500 to-amber-800",
    borderColor: "#b91c1c",
    funFact: "Mars has Olympus Mons, the largest volcano in the entire solar system—three times taller than Mount Everest!",
  },
  {
    id: "jupiter",
    name: "Jupiter",
    tag: "King of the Gas Giants",
    distanceMillionKm: 778,
    diameterKm: 139820,
    orbitDays: 4333,
    moons: 95,
    gravityFactor: 2.53,
    tempC: "-110°C",
    colorGradient: "from-amber-200 via-amber-600 to-orange-800",
    borderColor: "#b45309",
    funFact: "Jupiter is so massive that over 1,300 Earths could fit inside it! Its Great Red Spot is a storm that has lasted centuries.",
  },
  {
    id: "saturn",
    name: "Saturn",
    tag: "The Ringed Wonder",
    distanceMillionKm: 1434,
    diameterKm: 116460,
    orbitDays: 10759,
    moons: 146,
    gravityFactor: 1.06,
    tempC: "-140°C",
    colorGradient: "from-yellow-200 via-amber-400 to-stone-500",
    borderColor: "#ca8a04",
    funFact: "Saturn's dazzling rings are made of billions of chunks of ice, rock, and dust tumbling through space!",
    hasRings: true,
  },
  {
    id: "uranus",
    name: "Uranus",
    tag: "The Sideways Ice Giant",
    distanceMillionKm: 2871,
    diameterKm: 50724,
    orbitDays: 30687,
    moons: 28,
    gravityFactor: 0.89,
    tempC: "-195°C",
    colorGradient: "from-teal-200 via-cyan-400 to-blue-600",
    borderColor: "#0891b2",
    funFact: "Uranus rotates completely on its side like a rolling bowling ball, making its seasons last 21 Earth years each!",
  },
  {
    id: "neptune",
    name: "Neptune",
    tag: "The Windswept Giant",
    distanceMillionKm: 4495,
    diameterKm: 49244,
    orbitDays: 60190,
    moons: 16,
    gravityFactor: 1.14,
    tempC: "-200°C",
    colorGradient: "from-blue-400 via-indigo-600 to-blue-900",
    borderColor: "#2563eb",
    funFact: "Neptune experiences supersonic winds blowing faster than 2,000 km/h—the fiercest storms in the solar system!",
  },
];

export function PrimarySolarSystemLab() {
  const [selectedPlanet, setSelectedPlanet] = useState<Planet>(PLANETS[2]); // Earth default
  const [earthWeightInput, setEarthWeightInput] = useState<number>(35);
  const [activeTab, setActiveTab] = useState<"explorer" | "gravity-lab" | "cosmic-quiz">("explorer");

  // Welcome voice greeting on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      speakText(
        "Welcome to the Solar System Astronomy Lab! Tap any planet to explore its orbit, mass, atmosphere, and cosmic secrets!",
        { pitch: 1.05, rate: 0.94 }
      );
    }, 250);
    return () => clearTimeout(timer);
  }, []);

  // Quiz state
  const [quizQuestionIdx, setQuizQuestionIdx] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [quizAnswered, setQuizAnswered] = useState<number | null>(null);

  const QUIZ_QUESTIONS = [
    {
      question: "Which planet is famous for its giant system of bright icy rings?",
      options: ["Mars", "Saturn", "Mercury", "Earth"],
      correct: 1,
      explanation: "Saturn has seven main rings made of billions of glistening chunks of ice and rock!",
    },
    {
      question: "Which is the largest planet in our entire Solar System?",
      options: ["Jupiter", "Neptune", "Venus", "Earth"],
      correct: 0,
      explanation: "Jupiter is the biggest gas giant! Over 1,300 Earths could fit inside it.",
    },
    {
      question: "Which planet is nicknamed 'The Red Planet' because of its iron-rich rusty soil?",
      options: ["Venus", "Mars", "Uranus", "Mercury"],
      correct: 1,
      explanation: "Mars gets its reddish color from iron oxide (rust) covering its surface!",
    },
    {
      question: "Which planet is the hottest in our Solar System due to runaway greenhouse gases?",
      options: ["Mercury", "Mars", "Venus", "Jupiter"],
      correct: 2,
      explanation: "Venus is the hottest planet at 465°C because its dense carbon dioxide atmosphere traps intense solar heat!",
    },
    {
      question: "Which planet is closest to the Sun and completes an orbit in just 88 Earth days?",
      options: ["Mercury", "Venus", "Mars", "Neptune"],
      correct: 0,
      explanation: "Mercury zips around the Sun at 47 kilometers per second, making its year just 88 Earth days long!",
    },
    {
      question: "Which planet rolls on its side with a dramatic 98-degree axial tilt?",
      options: ["Saturn", "Uranus", "Earth", "Jupiter"],
      correct: 1,
      explanation: "Uranus rotates almost completely on its side, likely caused by an ancient collision with an Earth-sized object!",
    },
    {
      question: "Which far ice giant has the fastest recorded winds in the solar system, exceeding 2,000 km/h?",
      options: ["Neptune", "Mars", "Mercury", "Venus"],
      correct: 0,
      explanation: "Neptune has supersonic storms and howling winds reaching up to 2,100 kilometers per hour!",
    },
    {
      question: "Which is the only planet currently known to harbor vast oceans of liquid water and life?",
      options: ["Venus", "Mars", "Earth", "Titan"],
      correct: 2,
      explanation: "Earth sits in the habitable Goldilocks Zone, where temperatures allow stable liquid water oceans and thriving life!",
    },
  ];

  const handleSelectPlanet = (planet: Planet) => {
    soundEffects.playCosmicChime();
    setSelectedPlanet(planet);
    speakText(`${planet.name}! ${planet.tag}. ${planet.funFact}`, { pitch: 1.1, rate: 0.95 });
    try {
      recordLearningEvent({
        learnerId: getActiveLearnerId(),
        activityId: `solar-planet-${planet.id}`,
        activityType: "solar-system-explore",
        activityTitle: `Planet Exploration: ${planet.name}`,
        skillId: "sci-23-solarsystem",
        domain: "science",
        gradeBand: "2-3",
        result: "explored",
        score: 50,
        difficulty: "easy",
        attempts: 1,
        hintsUsed: 0,
      });
    } catch {
      // ignore
    }
  };

  const handleQuizChoice = (idx: number) => {
    if (quizAnswered !== null) return;
    setQuizAnswered(idx);

    const q = QUIZ_QUESTIONS[quizQuestionIdx];
    const isCorrect = idx === q.correct;
    if (isCorrect) {
      soundEffects.playSuccessChime();
      awardStars(2);
      awardXP(30, "Correct Astronomy Answer");
      setQuizScore((s) => s + 1);
      speakText(`Excellent! That is correct! ${q.explanation}`, { pitch: 1.15, rate: 0.95 });
    } else {
      soundEffects.playGentleBoing();
      speakText(`Good try! The correct answer is ${q.options[q.correct]}. ${q.explanation}`, {
        pitch: 1.05,
        rate: 0.95,
      });
    }

    try {
      recordLearningEvent({
        learnerId: getActiveLearnerId(),
        activityId: `solar-quiz-q-${quizQuestionIdx}`,
        activityType: "solar-system-quiz",
        activityTitle: `Cosmic Astronomy: ${q.question.substring(0, 36)}...`,
        skillId: "sci-23-solarsystem",
        domain: "science",
        gradeBand: "2-3",
        result: isCorrect ? "success" : "struggle",
        score: isCorrect ? 100 : 0,
        difficulty: "medium",
        attempts: 1,
        hintsUsed: 0,
      });
    } catch {
      // ignore
    }
  };

  const handleNextQuestion = () => {
    if (quizQuestionIdx + 1 < QUIZ_QUESTIONS.length) {
      setQuizQuestionIdx(quizQuestionIdx + 1);
      setQuizAnswered(null);
    } else {
      soundEffects.playFanfare();
      triggerCelebrationConfetti();
      awardXP(50, "Completed Solar System Quiz");
      speakText(`Congratulations! You completed the Cosmic Astronomy Challenge!`, {
        pitch: 1.2,
        rate: 0.95,
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card: Crisp High-Density Cosmic Banner */}
      <div className="p-6 sm:p-8 rounded-[2.5rem] bg-white/95 backdrop-blur-md border-4 border-indigo-200 shadow-2xl text-center space-y-4 relative overflow-hidden">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-100 border-2 border-cyan-200 text-cyan-900 text-xs font-black uppercase tracking-wider shadow-sm">
          <Rocket size={14} className="text-cyan-600 animate-bounce" />
          <span>Space &amp; Astrophysics Lab • Grades 1–5</span>
        </div>

        <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Solar System &amp; Planetary Gravity Explorer
        </h2>
        <p className="text-slate-600 text-xs sm:text-sm font-semibold max-w-xl mx-auto">
          Explore all 8 planetary worlds from scorched Mercury to frigid Neptune. Compare gravity, calculate your cosmic weight, and test your astronomy skills!
        </p>

        {/* View Mode Switcher: Chunky Tactile Arcade Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
          <button
            onClick={() => {
              soundEffects.playPop();
              setActiveTab("explorer");
            }}
            className={`px-5 py-2.5 rounded-2xl font-black text-xs sm:text-sm transition-all cursor-pointer border-b-4 active:translate-y-1 ${
              activeTab === "explorer"
                ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white border-cyan-700 shadow-lg shadow-cyan-500/30 scale-105"
                : "bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300"
            }`}
          >
            🪐 Orbit &amp; Planet Inspector
          </button>
          <button
            onClick={() => {
              soundEffects.playPop();
              setActiveTab("gravity-lab");
            }}
            className={`px-5 py-2.5 rounded-2xl font-black text-xs sm:text-sm transition-all cursor-pointer border-b-4 active:translate-y-1 ${
              activeTab === "gravity-lab"
                ? "bg-gradient-to-r from-purple-500 to-indigo-500 text-white border-purple-700 shadow-lg shadow-purple-500/30 scale-105"
                : "bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300"
            }`}
          >
            ⚖️ Cosmic Gravity Scale
          </button>
          <button
            onClick={() => {
              soundEffects.playPop();
              setActiveTab("cosmic-quiz");
            }}
            className={`px-5 py-2.5 rounded-2xl font-black text-xs sm:text-sm transition-all cursor-pointer border-b-4 active:translate-y-1 ${
              activeTab === "cosmic-quiz"
                ? "bg-gradient-to-r from-amber-400 to-yellow-400 text-amber-950 border-amber-600 shadow-lg shadow-amber-500/30 scale-105"
                : "bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300"
            }`}
          >
            ⭐ Astro Challenge Quiz
          </button>
        </div>
      </div>

      {/* VIEW 1: ORBIT & PLANET INSPECTOR */}
      {activeTab === "explorer" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Planetary Selector Dock */}
          <div className="lg:col-span-12 p-4 sm:p-5 rounded-[2rem] bg-white/95 backdrop-blur-md border-4 border-indigo-200 shadow-xl">
            <div className="text-xs font-black text-slate-600 mb-3 px-1 flex items-center gap-1.5">
              <span>🚀 Tap Any Planet to Launch Scientific Telemetry:</span>
            </div>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2.5">
              {PLANETS.map((planet) => {
                const isSelected = selectedPlanet.id === planet.id;
                return (
                  <button
                    key={planet.id}
                    onClick={() => handleSelectPlanet(planet)}
                    className={`p-3 rounded-2xl border-3 transition-all cursor-pointer flex flex-col items-center gap-2 ${
                      isSelected
                        ? "bg-indigo-50 border-indigo-500 shadow-md scale-105"
                        : "bg-slate-50 border-slate-200 hover:border-indigo-300 hover:bg-white"
                    }`}
                  >
                    {/* Planet Miniature Sphere */}
                    <div
                      className={`w-11 h-11 rounded-full bg-gradient-to-tr ${planet.colorGradient} shadow-md relative flex items-center justify-center`}
                    >
                      {planet.hasRings && (
                        <div className="absolute w-16 h-3.5 rounded-[100%] border-2 border-amber-300 -rotate-15" />
                      )}
                    </div>
                    <span className="text-xs font-black text-slate-900">{planet.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* MAIN SELECTED PLANET 3D STAGE */}
          <div className="lg:col-span-7 p-6 sm:p-8 rounded-[2.5rem] bg-white/95 backdrop-blur-md border-4 border-indigo-200 shadow-2xl space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-cyan-100 text-cyan-800 border border-cyan-200">
                  Planet #{PLANETS.findIndex((p) => p.id === selectedPlanet.id) + 1} from Sun
                </span>
                <h3 className="text-3xl sm:text-4xl font-black text-slate-900 mt-1">
                  {selectedPlanet.name}
                </h3>
                <p className="text-xs sm:text-sm font-bold text-indigo-600 italic mt-0.5">{selectedPlanet.tag}</p>
              </div>

              <div className="text-right bg-amber-50 border border-amber-200 px-3.5 py-2 rounded-2xl">
                <div className="text-[10px] font-bold text-amber-800 uppercase">Surface Temp</div>
                <div className="text-sm font-black text-amber-900">{selectedPlanet.tempC}</div>
              </div>
            </div>

            {/* Planet Graphic Viewport with Gloss & Shadow */}
            <div className="h-56 flex items-center justify-center relative bg-gradient-to-b from-indigo-900/10 via-slate-900/5 to-transparent rounded-3xl overflow-hidden border-2 border-slate-100">
              <motion.div
                key={selectedPlanet.id}
                initial={{ scale: 0.8, opacity: 0, rotate: -20 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                transition={{ duration: 0.5 }}
                className={`w-36 h-36 sm:w-44 sm:h-44 rounded-full bg-gradient-to-tr ${selectedPlanet.colorGradient} shadow-2xl relative flex items-center justify-center`}
              >
                {selectedPlanet.hasRings && (
                  <div className="absolute w-64 h-12 rounded-[100%] border-4 border-amber-300/90 -rotate-15 shadow-xl pointer-events-none" />
                )}
                {/* Surface shadow curvature */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-transparent to-black/50" />
              </motion.div>
            </div>

            {/* Scientific Fun Fact */}
            <div className="p-4 sm:p-5 rounded-2xl bg-indigo-50 border-2 border-indigo-200 flex items-start gap-3.5">
              <Info size={22} className="text-indigo-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs sm:text-sm text-indigo-950 font-bold leading-relaxed">
                {selectedPlanet.funFact}
              </p>
            </div>
          </div>

          {/* RIGHT COLUMN: TELEMETRY DATA METRICS */}
          <div className="lg:col-span-5 space-y-5">
            <div className="p-6 rounded-[2.5rem] bg-white/95 backdrop-blur-md border-4 border-indigo-200 shadow-2xl space-y-4">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-500">
                Planetary Telemetry Data
              </h4>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-2xl bg-cyan-50 border border-cyan-200">
                  <div className="text-[10px] font-bold text-cyan-800 uppercase">Distance from Sun</div>
                  <div className="text-base font-black text-cyan-900 mt-0.5">
                    {selectedPlanet.distanceMillionKm} <span className="text-xs font-normal">M km</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200">
                  <div className="text-[10px] font-bold text-amber-800 uppercase">Diameter</div>
                  <div className="text-base font-black text-amber-900 mt-0.5">
                    {selectedPlanet.diameterKm.toLocaleString()} <span className="text-xs font-normal">km</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-purple-50 border border-purple-200">
                  <div className="text-[10px] font-bold text-purple-800 uppercase">Orbit Period</div>
                  <div className="text-base font-black text-purple-900 mt-0.5">
                    {selectedPlanet.orbitDays} <span className="text-xs font-normal">Days</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200">
                  <div className="text-[10px] font-bold text-emerald-800 uppercase">Moons</div>
                  <div className="text-base font-black text-emerald-900 mt-0.5">
                    {selectedPlanet.moons} <span className="text-xs font-normal">Moons</span>
                  </div>
                </div>
              </div>

              {/* Gravity comparison relative to Earth */}
              <div className="p-4 rounded-2xl bg-indigo-50 border-2 border-indigo-200 space-y-2">
                <div className="flex justify-between text-xs font-black">
                  <span className="text-slate-700">Surface Gravity vs Earth:</span>
                  <span className="text-indigo-700">{selectedPlanet.gravityFactor}x</span>
                </div>
                <div className="w-full h-3 rounded-full bg-slate-200 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 to-indigo-600 rounded-full"
                    style={{ width: `${Math.min(100, selectedPlanet.gravityFactor * 40)}%` }}
                  />
                </div>
                <div className="text-[11px] font-bold text-indigo-900">
                  {selectedPlanet.gravityFactor < 1
                    ? `You would feel lighter and jump higher on ${selectedPlanet.name}!`
                    : selectedPlanet.gravityFactor > 1
                    ? `You would feel much heavier and grounded on ${selectedPlanet.name}!`
                    : `Normal standard Earth gravity (1.0x).`}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: COSMIC WEIGHT & GRAVITY CALCULATOR */}
      {activeTab === "gravity-lab" && (
        <div className="p-6 sm:p-8 rounded-[2.5rem] bg-white/95 backdrop-blur-md border-4 border-indigo-200 shadow-2xl space-y-6">
          <div className="text-center max-w-lg mx-auto space-y-2">
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 flex items-center justify-center gap-2">
              <Scale className="text-purple-600" />
              <span>Cosmic Weight Calculator</span>
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm font-semibold">
              Your weight changes across planets depending on their gravity! Enter your Earth weight to see the calculation on each world.
            </p>

            <div className="flex items-center justify-center gap-3 pt-3">
              <span className="text-sm font-black text-slate-800">Your Weight on Earth:</span>
              <input
                type="number"
                value={earthWeightInput}
                onChange={(e) => setEarthWeightInput(Math.max(1, Number(e.target.value)))}
                className="w-24 px-3 py-2 rounded-xl bg-indigo-50 border-2 border-indigo-200 text-center font-black text-slate-900 text-lg focus:outline-none focus:border-indigo-500 shadow-inner"
              />
              <span className="text-sm font-black text-slate-800">kg</span>
            </div>
          </div>

          {/* Planet Comparison Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            {PLANETS.map((planet) => {
              const weight = Math.round(earthWeightInput * planet.gravityFactor * 10) / 10;
              const isSelected = selectedPlanet.id === planet.id;
              return (
                <div
                  key={planet.id}
                  onClick={() => {
                    soundEffects.playPop();
                    setSelectedPlanet(planet);
                  }}
                  className={`p-4 rounded-2xl border-3 transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? "bg-indigo-50 border-indigo-500 shadow-md scale-102"
                      : "bg-slate-50 border-slate-200 hover:border-indigo-300 hover:bg-white"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-slate-900">{planet.name}</span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-white border border-slate-200 text-slate-600">
                      {planet.gravityFactor}x
                    </span>
                  </div>
                  <div className="py-2">
                    <div className="text-2xl font-black text-indigo-700">
                      {weight} <span className="text-xs text-slate-500 font-bold">kg</span>
                    </div>
                  </div>
                  <div className="text-[10px] font-bold text-slate-500">
                    {weight < earthWeightInput
                      ? `Lighter (-${Math.round(earthWeightInput - weight)} kg)`
                      : weight > earthWeightInput
                      ? `Heavier (+${Math.round(weight - earthWeightInput)} kg)`
                      : "Base Earth Weight"}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW 3: ASTRONOMY CHALLENGE QUIZ */}
      {activeTab === "cosmic-quiz" && (
        <div className="p-6 sm:p-8 rounded-[2.5rem] bg-white/95 backdrop-blur-md border-4 border-indigo-200 shadow-2xl space-y-6">
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs font-black uppercase">
              ⭐ Question {quizQuestionIdx + 1} of {QUIZ_QUESTIONS.length}
            </div>
            <div className="text-xs font-black text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
              Score: {quizScore} / {QUIZ_QUESTIONS.length} Correct
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl sm:text-2xl font-black text-slate-900">
              {QUIZ_QUESTIONS[quizQuestionIdx].question}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {QUIZ_QUESTIONS[quizQuestionIdx].options.map((opt, idx) => {
                const isCorrect = idx === QUIZ_QUESTIONS[quizQuestionIdx].correct;
                const isSelected = quizAnswered === idx;

                let btnClass = "bg-slate-50 border-slate-200 hover:bg-indigo-50 hover:border-indigo-300 text-slate-800";
                if (quizAnswered !== null) {
                  if (isCorrect) {
                    btnClass = "bg-emerald-100 border-emerald-500 text-emerald-900 ring-2 ring-emerald-400";
                  } else if (isSelected) {
                    btnClass = "bg-rose-100 border-rose-400 text-rose-900";
                  }
                }

                return (
                  <button
                    key={idx}
                    disabled={quizAnswered !== null}
                    onClick={() => handleQuizChoice(idx)}
                    className={`p-4 rounded-2xl border-3 font-black text-sm text-left transition-all cursor-pointer flex items-center justify-between ${btnClass}`}
                  >
                    <span>{opt}</span>
                    {quizAnswered !== null && isCorrect && <CheckCircle2 size={20} className="text-emerald-600" />}
                  </button>
                );
              })}
            </div>

            {quizAnswered !== null && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-5 rounded-2xl bg-indigo-50 border-2 border-indigo-200 flex flex-col sm:flex-row items-center justify-between gap-3.5 shadow-sm"
              >
                <p className="text-xs sm:text-sm text-indigo-950 font-bold leading-relaxed">
                  {QUIZ_QUESTIONS[quizQuestionIdx].explanation}
                </p>
                <button
                  onClick={handleNextQuestion}
                  className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-amber-950 font-black text-xs cursor-pointer flex items-center gap-1.5 flex-shrink-0 shadow-md border-b-2 border-amber-600 active:translate-y-0.5"
                >
                  <span>{quizQuestionIdx + 1 < QUIZ_QUESTIONS.length ? "Next Question" : "Complete Challenge"}</span>
                  <ChevronRight size={16} />
                </button>
              </motion.div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
