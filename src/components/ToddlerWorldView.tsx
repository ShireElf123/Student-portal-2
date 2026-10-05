import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Volume2,
  VolumeX,
  Sparkles,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Star,
  RotateCcw,
  Heart,
  Music,
  CheckCircle2,
  Smile,
  GraduationCap,
  Play,
  Award,
  Trophy,
  Lock,
  Compass,
  MapPin,
  Calendar,
  Mic,
  MicOff,
  Trash2,
} from "lucide-react";
import { PictureBook, PictureBookPage } from "../types";
import { PICTURE_BOOKS } from "../data/pictureBooksData";
import { speakText, stopSpeaking, speechCoordinator } from "../utils/speechUtils";
import { recordLearningEvent, getActiveLearnerId } from "../utils/learnerBrain";
import { resolveSkillForActivity } from "../data/activitySkillRegistry";
import { soundEffects } from "../utils/soundEffects";
import {
  savePageAudio,
  getPageAudio,
  deletePageAudio,
  PageAudioRecord,
} from "../utils/parentAudioStorage";
import { ToddlerQuizzesAndGames } from "./ToddlerQuizzesAndGames";
import { ToddlerWorldsNavigator } from "./ToddlerWorldsNavigator";
import { ToddlerDailyMissionsModal } from "./ToddlerDailyMissionsModal";
import { ToddlerStickerAlbumModal } from "./ToddlerStickerAlbumModal";
import { BuddyCompanionBadge } from "./BuddyCompanionBadge";
import { BuddyAvatarStudio } from "./BuddyAvatarStudio";
import { getGamificationState, setWonderlandTheme, subscribeGamification, awardStars } from "../utils/gamification";
import {
  getExplorerRank,
  getTodayAdventure,
  getCompletedDailyMissionIds,
  completeActiveMissionIfMatches,
  recordPhonicsLetterTapped,
  recordCountingCardTapped,
  TODDLER_STICKERS,
} from "../data/toddler/toddlerDailyAdventure";
import {
  RollingHillsDivider,
  FloatingCloudDecoration,
  CharacterAnchor,
  TactileAgencyButton,
} from "./landscape/LandscapeDecorations";

interface ToddlerWorldViewProps {
  initialActivityId?: string;
  onStartAssessment?: (assessmentId: string) => void;
  onSwitchToPrimary?: () => void;
  onSwitchToEducator?: () => void;
  onRequestExit?: () => void;
}

const PHONICS_TILES = [
  { letter: "A", word: "Apple", emoji: "🍎", sound: "A says ah! Like delicious red Apple." },
  { letter: "B", word: "Bear", emoji: "🐻", sound: "B says buh! Like friendly brown Bear." },
  { letter: "C", word: "Cat", emoji: "🐱", sound: "C says kuh! Like playful kitten Cat." },
  { letter: "D", word: "Duck", emoji: "🦆", sound: "D says duh! Quack quack says the Duck." },
  { letter: "E", word: "Elephant", emoji: "🐘", sound: "E says eh! Huge friendly Elephant." },
  { letter: "F", word: "Fish", emoji: "🐠", sound: "F says fff! Swimming orange Fish." },
  { letter: "G", word: "Giraffe", emoji: "🦒", sound: "G says guh! Tall spotted Giraffe." },
  { letter: "H", word: "Heart", emoji: "💖", sound: "H says huh! Happy warm Heart." },
  { letter: "I", word: "Ice Cream", emoji: "🍦", sound: "I says ih! Sweet cool Ice cream." },
  { letter: "J", word: "Jellyfish", emoji: "🪼", sound: "J says juh! Bouncy purple Jellyfish." },
  { letter: "K", word: "Kangaroo", emoji: "🦘", sound: "K says kuh! Hop hop Kangaroo." },
  { letter: "L", word: "Lion", emoji: "🦁", sound: "L says lll! Brave golden Lion." },
  { letter: "M", word: "Monkey", emoji: "🐵", sound: "M says mmm! Cheerful cheeky Monkey." },
  { letter: "N", word: "Nest", emoji: "🪺", sound: "N says nnn! Cozy bird Nest." },
  { letter: "O", word: "Owl", emoji: "🦉", sound: "O says ah! Wise nighttime Owl." },
  { letter: "P", word: "Puppy", emoji: "🐶", sound: "P says puh! Waggy tail Puppy." },
  { letter: "Q", word: "Queen", emoji: "👑", sound: "Q says kwuh! Shiny golden Queen." },
  { letter: "R", word: "Rainbow", emoji: "🌈", sound: "R says rrr! Seven colorful Rainbow." },
  { letter: "S", word: "Star", emoji: "⭐", sound: "S says sss! Shiny twinkle Star." },
  { letter: "T", word: "Tiger", emoji: "🐯", sound: "T says tuh! Striped orange Tiger." },
  { letter: "U", word: "Umbrella", emoji: "☂️", sound: "U says uh! Rain protection Umbrella." },
  { letter: "V", word: "Violin", emoji: "🎻", sound: "V says vvv! Sweet music Violin." },
  { letter: "W", word: "Whale", emoji: "🐳", sound: "W says wuh! Giant blue Whale." },
  { letter: "X", word: "Xylophone", emoji: "🎵", sound: "X says ks! Ding dong Xylophone." },
  { letter: "Y", word: "Yacht", emoji: "⛵", sound: "Y says yuh! Sailing white Yacht." },
  { letter: "Z", word: "Zebra", emoji: "🦓", sound: "Z says zzz! Black and white Zebra." },
];

const COUNTING_CARDS = [
  { num: 1, word: "One", emojis: "☀️", item: "Smiling Sun", color: "from-amber-400 to-yellow-300" },
  { num: 2, word: "Two", emojis: "🎈 🎈", item: "Balloons", color: "from-sky-400 to-blue-300" },
  { num: 3, word: "Three", emojis: "🍓 🍓 🍓", item: "Strawberries", color: "from-rose-400 to-pink-300" },
  { num: 4, word: "Four", emojis: "🚗 🚗 🚗 🚗", item: "Toy Cars", color: "from-emerald-400 to-teal-300" },
  { num: 5, word: "Five", emojis: "⭐ ⭐ ⭐ ⭐ ⭐", item: "Shiny Stars", color: "from-purple-400 to-indigo-300" },
];

export function ToddlerWorldView({
  initialActivityId,
  onStartAssessment,
  onSwitchToPrimary,
  onSwitchToEducator,
  onRequestExit,
}: ToddlerWorldViewProps) {
  const [activeTab, setActiveTab] = useState<"worlds" | "books" | "phonics" | "counting" | "games" | "avatar-studio">("worlds");
  const [gameState, setGameState] = useState(() => getGamificationState());
  const [selectedBook, setSelectedBook] = useState<PictureBook | null>(null);
  const [currentPageIndex, setCurrentPageIndex] = useState<number>(0);
  const [bookInteractionAnswers, setBookInteractionAnswers] = useState<Record<string, number>>({});
  const activePage: PictureBookPage | null = selectedBook ? selectedBook.pages[currentPageIndex] || null : null;
  const [isBookCompleted, setIsBookCompleted] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(() => speechCoordinator.isMuted());
  const [starsCount, setStarsCount] = useState<number>(() => {
    return getGamificationState().starsCount;
  });
  const [activePhonicsLetter, setActivePhonicsLetter] = useState<string | null>(null);

  // Daily Quests and Sticker Album modals
  const [isDailyMissionsOpen, setIsDailyMissionsOpen] = useState<boolean>(false);
  const [isStickerAlbumOpen, setIsStickerAlbumOpen] = useState<boolean>(false);
  const [initialWorldTarget, setInitialWorldTarget] = useState<string | null>(null);
  const [initialGameTarget, setInitialGameTarget] = useState<string | null>(null);

  // Launch registry-selected toddler experiences into their exact existing surface.
  useEffect(() => {
    if (!initialActivityId) return;
    stopSpeaking();
    setSelectedBook(null);
    if (initialActivityId === "books") {
      setActiveTab("books");
      setInitialGameTarget(null);
      setInitialWorldTarget(null);
    } else if (initialActivityId.startsWith("game:")) {
      setActiveTab("games");
      setInitialGameTarget(initialActivityId.slice("game:".length));
      setInitialWorldTarget(null);
    } else if (initialActivityId.startsWith("world:")) {
      setActiveTab("worlds");
      setInitialWorldTarget(initialActivityId);
      setInitialGameTarget(null);
    } else if (initialActivityId === "worlds") {
      setActiveTab("worlds");
      setInitialWorldTarget(null);
      setInitialGameTarget(null);
    }
  }, [initialActivityId]);

  // Pages already visited in the current book session. Page-turn stars are
  // paid once per page so flipping back and forth cannot farm stars.
  const visitedBookPagesRef = useRef<Set<number>>(new Set());

  const currentRank = getExplorerRank(starsCount);
  const todayAdventure = getTodayAdventure();
  const completedMissions = getCompletedDailyMissionIds();
  const unlockedStickersCount = TODDLER_STICKERS.filter((s) => starsCount >= s.requiredStars).length;

  // Sync gamification state (Buddy, Theme & Stars)
  useEffect(() => {
    return subscribeGamification((state) => {
      setGameState(state);
      setStarsCount(state.starsCount);
    });
  }, []);

  const toggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    speechCoordinator.setMuted(next);
  };

  // Sync speech state
  useEffect(() => {
    const unsub = speechCoordinator.subscribe((speaking) => {
      setIsSpeaking(speaking);
    });
    return unsub;
  }, []);

  // Custom Parent Storyteller Voice Recording State
  const [parentAudioRecord, setParentAudioRecord] = useState<PageAudioRecord | null>(null);
  const [isRecordingParentVoice, setIsRecordingParentVoice] = useState(false);
  const [isPlayingParentAudio, setIsPlayingParentAudio] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

  // Stop any active speech whenever active tab changes or component unmounts
  useEffect(() => {
    stopSpeaking();
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
      audioPlayerRef.current = null;
      setIsPlayingParentAudio(false);
    }
    return () => {
      stopSpeaking();
      if (audioPlayerRef.current) {
        audioPlayerRef.current.pause();
        audioPlayerRef.current = null;
      }
    };
  }, [activeTab]);

  // Load custom parent audio recording for current book page if one exists
  useEffect(() => {
    if (!selectedBook || !activePage) {
      setParentAudioRecord(null);
      return;
    }
    let isCancelled = false;
    getPageAudio(selectedBook.id, activePage.pageNumber).then((rec) => {
      if (!isCancelled) {
        setParentAudioRecord(rec);
      }
    });
    return () => {
      isCancelled = true;
      if (audioPlayerRef.current) {
        audioPlayerRef.current.pause();
        audioPlayerRef.current = null;
      }
      setIsPlayingParentAudio(false);
    };
  }, [selectedBook?.id, activePage?.pageNumber]);

  const addStar = (amount = 1) => {
    awardStars(amount);
  };

  const recordBookEngagement = (
    book: PictureBook,
    pageIndex: number,
    eventType: "experience_opened" | "content_explored"
  ) => {
    const page = book.pages[pageIndex];
    try {
      recordLearningEvent({
        learnerId: getActiveLearnerId(),
        activityId: "picture-book-interaction",
        experienceId: "picture-book-reader",
        contentId: eventType === "experience_opened" ? book.id : `${book.id}:page-${page?.pageNumber ?? pageIndex + 1}`,
        eventType,
        activityType: "storybook-interaction",
        activityTitle: eventType === "experience_opened" ? `Opened ${book.title}` : `Viewed ${book.title}, page ${page?.pageNumber ?? pageIndex + 1}`,
        domain: "general",
        gradeBand: "toddler",
        result: "explored",
        difficulty: "easy",
        attempts: 1,
        hintsUsed: 0,
      });
    } catch (error) {
      console.error("Failed to record picture-book engagement:", error);
    }
  };

  const handleBookInteractionAnswer = (optionIndex: number) => {
    if (!selectedBook || !activePage?.learningInteraction) return;
    const interaction = activePage.learningInteraction;
    const key = `${selectedBook.id}:${activePage.pageNumber}:${interaction.id}`;
    if (bookInteractionAnswers[key] !== undefined) return;
    const resolved = resolveSkillForActivity(interaction.skillId);
    if (!resolved.skillId) {
      console.error(`Picture-book interaction ${interaction.id} has no valid curriculum skill mapping`);
      return;
    }
    const isCorrect = optionIndex === interaction.correctOptionIndex;
    try {
      recordLearningEvent({
        learnerId: getActiveLearnerId(),
        activityId: "picture-book-interaction",
        experienceId: "picture-book-reader",
        contentId: `${selectedBook.id}:page-${activePage.pageNumber}:${interaction.id}:option-${optionIndex}`,
        eventType: "question_answered",
        activityType: "storybook-interaction",
        activityTitle: `${selectedBook.title}: ${interaction.prompt}`,
        skillId: resolved.skillId,
        domain: resolved.domain,
        gradeBand: "toddler",
        result: isCorrect ? "success" : "struggle",
        score: isCorrect ? 100 : 0,
        difficulty: "easy",
        attempts: 1,
        hintsUsed: 0,
        metadata: {
          interactionId: interaction.id,
          selectedAnswer: interaction.options[optionIndex],
          correctAnswer: interaction.options[interaction.correctOptionIndex],
        },
      });
      setBookInteractionAnswers((answers) => ({ ...answers, [key]: optionIndex }));
    } catch (error) {
      console.error("Failed to record picture-book response evidence:", error);
    }
  };

  const handleOpenBook = (book: PictureBook) => {
    setSelectedBook(book);
    setCurrentPageIndex(0);
    setBookInteractionAnswers({});
    visitedBookPagesRef.current.clear();
    visitedBookPagesRef.current.add(0);
    setIsBookCompleted(false);
    recordBookEngagement(book, 0, "experience_opened");
    stopSpeaking();
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
      audioPlayerRef.current = null;
      setIsPlayingParentAudio(false);
    }
    // Check if first page has parent recording, else auto narrate
    getPageAudio(book.id, 1).then((rec) => {
      setParentAudioRecord(rec);
      if (rec?.audioBlob) {
        const url = URL.createObjectURL(rec.audioBlob);
        const aud = new Audio(url);
        audioPlayerRef.current = aud;
        setIsPlayingParentAudio(true);
        aud.onended = () => {
          setIsPlayingParentAudio(false);
          audioPlayerRef.current = null;
        };
        aud.play().catch(() => {
          setIsPlayingParentAudio(false);
          if (book.pages[0]) speakText(book.pages[0].narration);
        });
      } else if (book.pages[0]) {
        speakText(book.pages[0].narration);
      }
    });
  };

  const handleCloseBook = () => {
    stopSpeaking();
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
      audioPlayerRef.current = null;
      setIsPlayingParentAudio(false);
    }
    if (mediaRecorderRef.current && isRecordingParentVoice) {
      try {
        mediaRecorderRef.current.stop();
      } catch {}
      setIsRecordingParentVoice(false);
    }
    setSelectedBook(null);
    setIsBookCompleted(false);
  };

  const handleNextPage = () => {
    if (!selectedBook) return;
    stopSpeaking();
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
      audioPlayerRef.current = null;
      setIsPlayingParentAudio(false);
    }
    if (currentPageIndex < selectedBook.pages.length - 1) {
      const nextIdx = currentPageIndex + 1;
      setCurrentPageIndex(nextIdx);
      const nextPageNum = nextIdx + 1;
      getPageAudio(selectedBook.id, nextPageNum).then((rec) => {
        setParentAudioRecord(rec);
        if (rec?.audioBlob) {
          const url = URL.createObjectURL(rec.audioBlob);
          const aud = new Audio(url);
          audioPlayerRef.current = aud;
          setIsPlayingParentAudio(true);
          aud.onended = () => {
            setIsPlayingParentAudio(false);
            audioPlayerRef.current = null;
          };
          aud.play().catch(() => {
            setIsPlayingParentAudio(false);
            speakText(selectedBook.pages[nextIdx].narration);
          });
        } else {
          speakText(selectedBook.pages[nextIdx].narration);
        }
      });
      if (!visitedBookPagesRef.current.has(nextIdx)) {
        visitedBookPagesRef.current.add(nextIdx);
        addStar(1);
        recordBookEngagement(selectedBook, nextIdx, "content_explored");
      }
    } else {
      // Completed book!
      setIsBookCompleted(true);
      soundEffects.playFanfare();
      soundEffects.playStarSparkle();
      addStar(3);
      speakText(`Hooray! You finished reading ${selectedBook.title}! You earned three golden stars!`, {
        pitch: 1.25,
        rate: 0.9,
      });
      try {
        completeActiveMissionIfMatches("books");
      } catch {
        // ignore
      }
    }
  };

  const handlePrevPage = () => {
    if (!selectedBook || currentPageIndex === 0) return;
    stopSpeaking();
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
      audioPlayerRef.current = null;
      setIsPlayingParentAudio(false);
    }
    const prevIdx = currentPageIndex - 1;
    setCurrentPageIndex(prevIdx);
    if (!visitedBookPagesRef.current.has(prevIdx)) {
      visitedBookPagesRef.current.add(prevIdx);
      recordBookEngagement(selectedBook, prevIdx, "content_explored");
    }
    const prevPageNum = prevIdx + 1;
    getPageAudio(selectedBook.id, prevPageNum).then((rec) => {
      setParentAudioRecord(rec);
      if (rec?.audioBlob) {
        const url = URL.createObjectURL(rec.audioBlob);
        const aud = new Audio(url);
        audioPlayerRef.current = aud;
        setIsPlayingParentAudio(true);
        aud.onended = () => {
          setIsPlayingParentAudio(false);
          audioPlayerRef.current = null;
        };
        aud.play().catch(() => {
          setIsPlayingParentAudio(false);
          speakText(selectedBook.pages[prevIdx].narration);
        });
      } else {
        speakText(selectedBook.pages[prevIdx].narration);
      }
    });
  };

  const handleReadAloud = (text: string) => {
    if (audioPlayerRef.current && isPlayingParentAudio) {
      audioPlayerRef.current.pause();
      audioPlayerRef.current = null;
      setIsPlayingParentAudio(false);
      return;
    }

    if (isSpeaking) {
      stopSpeaking();
      return;
    }

    // Play parent recording if available
    if (parentAudioRecord?.audioBlob) {
      stopSpeaking();
      const url = URL.createObjectURL(parentAudioRecord.audioBlob);
      const aud = new Audio(url);
      audioPlayerRef.current = aud;
      setIsPlayingParentAudio(true);
      aud.onended = () => {
        setIsPlayingParentAudio(false);
        audioPlayerRef.current = null;
      };
      aud.onerror = () => {
        setIsPlayingParentAudio(false);
        audioPlayerRef.current = null;
        speakText(text);
      };
      aud.play().catch(() => {
        setIsPlayingParentAudio(false);
        speakText(text);
      });
      return;
    }

    speakText(text);
  };

  const handleStartParentRecording = async () => {
    try {
      if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) {
        alert("Audio recording requires microphone access supported in your browser.");
        return;
      }
      stopSpeaking();
      if (audioPlayerRef.current) {
        audioPlayerRef.current.pause();
        setIsPlayingParentAudio(false);
      }
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      const chunks: BlobPart[] = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };
      recorder.onstop = async () => {
        const blob = new Blob(chunks, { type: recorder.mimeType || "audio/webm" });
        stream.getTracks().forEach((t) => t.stop());
        if (selectedBook && activePage) {
          await savePageAudio(selectedBook.id, activePage.pageNumber, blob);
          const rec = await getPageAudio(selectedBook.id, activePage.pageNumber);
          setParentAudioRecord(rec);
          soundEffects.playSuccessChime();
        }
        setIsRecordingParentVoice(false);
      };
      recorder.start();
      setIsRecordingParentVoice(true);
      soundEffects.playPop();
    } catch (err) {
      console.warn("Could not start recording:", err);
      setIsRecordingParentVoice(false);
    }
  };

  const handleStopParentRecording = () => {
    if (mediaRecorderRef.current && isRecordingParentVoice) {
      try {
        mediaRecorderRef.current.stop();
      } catch {}
    }
  };

  const handleDeleteParentRecording = async () => {
    if (selectedBook && activePage) {
      await deletePageAudio(selectedBook.id, activePage.pageNumber);
      setParentAudioRecord(null);
      soundEffects.playGentleBoing();
    }
  };

  // Stars for the soundboard and counting cards reward fresh discovery: each
  // distinct tile earns one star per day, repeats are free play without pay.
  const handlePhonicsClick = (tile: typeof PHONICS_TILES[0]) => {
    setActivePhonicsLetter(tile.letter);
    speakText(tile.sound, {
      pitch: 1.2,
      rate: 0.85,
      onEnd: () => {
        // slight pause
      },
    });
    recordPhonicsLetterTapped(tile.letter);
  };

  const handleCountingClick = (card: typeof COUNTING_CARDS[0]) => {
    speakText(`${card.word}! Number ${card.num}! Let's count: ${Array.from({ length: card.num }, (_, i) => i + 1).join(", ")}! ${card.item}!`, {
      pitch: 1.2,
      rate: 0.85,
    });
    recordCountingCardTapped(card.num);
  };

  const isMeadow = gameState.wonderlandTheme === "sunny-meadow";

  return (
    <div className={`min-h-full pb-20 transition-colors duration-500 ${
      isMeadow
        ? "bg-gradient-to-b from-[#86efac] via-[#4ade80] to-[#16a34a] text-slate-900"
        : "bg-[#0c0d14] text-white"
    }`}>
      {/* Top Playful Banner with Organic Sky & Clouds */}
      <div className={`relative overflow-hidden px-4 pt-6 pb-2 transition-all duration-500 ${
        isMeadow
          ? "bg-gradient-to-b from-[#38bdf8] via-[#7dd3fc] to-[#bae6fd] text-slate-900"
          : "bg-gradient-to-b from-indigo-950 via-slate-900 to-[#0c0d14] text-white"
      }`}>
        {/* Floating Clouds (Daytime Meadow) */}
        {isMeadow && (
          <>
            <FloatingCloudDecoration className="absolute -top-2 left-6 hidden md:block" size="md" />
            <FloatingCloudDecoration className="absolute top-4 right-52 hidden lg:block" size="sm" />
            <FloatingCloudDecoration className="absolute -top-3 right-10 hidden sm:block" size="sm" />
            {/* Friendly Sun Badge */}
            <div className="absolute top-2 right-4 text-4xl sm:text-5xl animate-spin-slow pointer-events-none select-none opacity-90 hidden sm:block" style={{ animationDuration: "25s" }}>
              ☀️
            </div>
            {/* Playful Flying Butterflies */}
            <div className="absolute bottom-2 left-1/4 text-xl animate-bounce pointer-events-none select-none hidden md:block">
              🦋
            </div>
            <div className="absolute top-8 right-1/3 text-lg animate-pulse pointer-events-none select-none hidden lg:block">
              🐝
            </div>
          </>
        )}

        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-3.5 text-center md:text-left">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-tr from-amber-400 via-orange-400 to-pink-500 flex items-center justify-center text-3xl sm:text-4xl shadow-2xl shadow-orange-500/40 ring-4 ring-white border-2 border-amber-300 animate-bounce flex-shrink-0">
              🧸
            </div>
            <div>
              <div className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider mb-1 shadow-md ${
                isMeadow
                  ? "bg-white text-amber-900 border-2 border-amber-300"
                  : "bg-amber-400/20 text-amber-300 border border-amber-400/30"
              }`}>
                <Sparkles size={13} className="text-amber-500" /> Toddlers &amp; Little Explorers (Ages 2–5)
              </div>
              <h1 className={`text-2xl sm:text-4xl font-black tracking-tight ${
                isMeadow ? "text-slate-900 drop-shadow-sm font-display" : "text-white"
              }`}>
                Picture Book &amp; Phonics Wonderland
              </h1>
              <p className={`text-xs sm:text-sm font-bold ${
                isMeadow ? "text-slate-700 max-w-xl" : "text-white/70 max-w-xl"
              }`}>
                Interactive read-aloud picture books, spoken phonics sounds, animal safari detective, and counting games!
              </p>
            </div>
          </div>

          {/* Stars Rewards Jar, Buddy Companion & Quick Actions */}
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            {/* Wonderland Theme Toggle (Tactile 3D) */}
            <button
              onClick={() => {
                const nextTheme = isMeadow ? "night-starlight" : "sunny-meadow";
                setWonderlandTheme(nextTheme);
                soundEffects.playPop();
              }}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-black transition-all cursor-pointer shadow-md active:translate-y-1 ${
                isMeadow
                  ? "bg-white text-slate-800 border-b-4 border-slate-300 hover:bg-slate-50"
                  : "bg-white/10 text-white border-b-4 border-white/20 hover:bg-white/20"
              }`}
              title="Switch between Sunny Meadow & Cosmic Starlight themes"
            >
              <span>{isMeadow ? "☀️ Meadow" : "🌙 Galaxy"}</span>
            </button>

            {/* Today's Daily Quests Button */}
            <button
              onClick={() => {
                soundEffects.playPop();
                setIsDailyMissionsOpen(true);
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-2xl text-xs font-black bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 text-white border-b-4 border-indigo-800 shadow-md transition-all active:translate-y-1 cursor-pointer"
              title="Today's 3 Adventure Missions"
            >
              <Calendar size={14} />
              <span>Quests</span>
              <span className="px-1.5 py-0.2 rounded-full bg-white/20 text-[10px]">
                {completedMissions.length}/3
              </span>
            </button>

            {/* Sticker Album Button */}
            <button
              onClick={() => {
                soundEffects.playPop();
                setIsStickerAlbumOpen(true);
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-2xl text-xs font-black bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 text-amber-950 border-b-4 border-amber-700 shadow-md transition-all active:translate-y-1 cursor-pointer"
              title="Explorer Sticker Album"
            >
              <Trophy size={14} />
              <span>Stickers</span>
              <span className="px-1.5 py-0.2 rounded-full bg-amber-950/20 text-[10px] font-black">
                {unlockedStickersCount}/{TODDLER_STICKERS.length}
              </span>
            </button>

            {/* Buddy Companion Mascot Button (Tactile 3D) */}
            <button
              onClick={() => {
                setActiveTab("avatar-studio");
                soundEffects.playPop();
              }}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-2xl border-b-4 transition-all cursor-pointer shadow-md active:translate-y-1 ${
                isMeadow
                  ? "bg-white text-slate-800 border-pink-400 hover:bg-pink-50"
                  : "bg-pink-500/20 text-pink-200 border-pink-600 hover:bg-pink-500/30"
              }`}
              title="Customize your Learning Buddy!"
            >
              <BuddyCompanionBadge buddy={gameState.buddy} size="sm" animated />
              <div className="text-left hidden sm:block">
                <div className="text-[9px] uppercase font-black text-pink-600">Buddy</div>
                <div className="text-xs font-black text-slate-900">{gameState.buddy.name}</div>
              </div>
            </button>

            {/* Audio Voice Toggle */}
            <button
              onClick={toggleMute}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-2xl text-xs font-black transition-all cursor-pointer border-b-4 shadow-md active:translate-y-1 ${
                isMuted
                  ? "bg-rose-500 text-white border-rose-700"
                  : isMeadow
                  ? "bg-white text-slate-800 border-slate-300 hover:bg-slate-50"
                  : "bg-white/10 text-white border-white/20 hover:bg-white/20"
              }`}
              title={isMuted ? "Sound is Muted - Click to Unmute" : "Sound is Active - Click to Mute"}
            >
              {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
              <span className="hidden sm:inline">{isMuted ? "Muted" : "Voice On"}</span>
            </button>

            {/* Star Jar & Explorer Rank */}
            <div className="flex items-center gap-2 bg-gradient-to-b from-amber-400 to-amber-500 border-b-4 border-amber-600 rounded-2xl px-3.5 py-1.5 text-amber-950 shadow-md">
              <Star className="w-5 h-5 fill-amber-300 text-amber-950 animate-pulse" />
              <div>
                <div className="text-[9px] uppercase font-black tracking-wider leading-none">
                  {currentRank.emoji} {currentRank.title}
                </div>
                <div className="text-base font-black leading-tight">
                  {starsCount} <span className="text-[10px] font-bold">Stars</span>
                </div>
              </div>
            </div>

            {onStartAssessment && (
              <button
                onClick={() => onStartAssessment("toddler-phonics-basics")}
                className="flex items-center gap-1.5 bg-gradient-to-b from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-black text-xs px-3.5 py-2 rounded-2xl border-b-4 border-emerald-800 shadow-md transition-all active:translate-y-1 cursor-pointer"
              >
                <GraduationCap size={16} />
                <span className="hidden sm:inline">Milestone Check</span>
                <span className="sm:hidden">Check</span>
              </button>
            )}

            {onRequestExit && (
              <button
                onClick={onRequestExit}
                className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-white font-black text-xs px-3 py-2 rounded-2xl border-b-4 border-slate-950 transition-all cursor-pointer shadow-md active:translate-y-1"
                title="Grown-Up Gate: Exit Toddler Space or Switch Profile"
              >
                <Lock size={14} className="text-amber-400" />
                <span>Exit 🔒</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Organic Rolling Hills Landscape Divider (Separating Sky from Meadow) */}
      <RollingHillsDivider
        variant={isMeadow ? "meadow" : "night-starlight"}
        heightClass="h-10 sm:h-14 md:h-16"
        showFlowers={isMeadow}
        className="-mt-1 mb-4"
      />

      {/* Main Mode Navigation Tabs (Chunky, Tactile 3D Buttons - 6 Agency Tabs) */}
      <div className="max-w-6xl mx-auto px-4 pt-2 pb-2">
        <div className={`grid grid-cols-2 sm:grid-cols-6 gap-2 p-2 rounded-3xl max-w-4xl mx-auto mb-8 shadow-xl ${
          isMeadow
            ? "bg-white/95 backdrop-blur-md border-4 border-emerald-300 ring-4 ring-emerald-500/20"
            : "bg-white/[0.06] border border-white/10"
        }`}>
          <button
            onClick={() => setActiveTab("worlds")}
            className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2 py-3 px-2 rounded-2xl font-black text-xs sm:text-sm transition-all cursor-pointer select-none ${
              activeTab === "worlds"
                ? "bg-gradient-to-b from-amber-400 to-orange-500 text-white border-b-4 border-orange-700 shadow-lg scale-102"
                : isMeadow
                ? "text-slate-700 hover:text-slate-900 hover:bg-amber-100/60 border-b-4 border-transparent"
                : "text-white/70 hover:text-white hover:bg-white/10 border-b-4 border-transparent"
            }`}
          >
            <span className="text-xl">🗺️</span>
            <span>Worlds</span>
          </button>

          <button
            onClick={() => setActiveTab("books")}
            className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2 py-3 px-2 rounded-2xl font-black text-xs sm:text-sm transition-all cursor-pointer select-none ${
              activeTab === "books"
                ? "bg-gradient-to-b from-amber-400 to-amber-500 text-amber-950 border-b-4 border-amber-700 shadow-lg scale-102"
                : isMeadow
                ? "text-slate-700 hover:text-slate-900 hover:bg-amber-100/60 border-b-4 border-transparent"
                : "text-white/70 hover:text-white hover:bg-white/10 border-b-4 border-transparent"
            }`}
          >
            <span className="text-xl">📚</span>
            <span>Stories</span>
          </button>

          <button
            onClick={() => setActiveTab("phonics")}
            className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2 py-3 px-2 rounded-2xl font-black text-xs sm:text-sm transition-all cursor-pointer select-none ${
              activeTab === "phonics"
                ? "bg-gradient-to-b from-rose-400 to-pink-500 text-white border-b-4 border-pink-700 shadow-lg scale-102"
                : isMeadow
                ? "text-slate-700 hover:text-slate-900 hover:bg-pink-100/60 border-b-4 border-transparent"
                : "text-white/70 hover:text-white hover:bg-white/10 border-b-4 border-transparent"
            }`}
          >
            <span className="text-xl">🔤</span>
            <span>Phonics</span>
          </button>

          <button
            onClick={() => setActiveTab("counting")}
            className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2 py-3 px-2 rounded-2xl font-black text-xs sm:text-sm transition-all cursor-pointer select-none ${
              activeTab === "counting"
                ? "bg-gradient-to-b from-indigo-400 to-indigo-600 text-white border-b-4 border-indigo-800 shadow-lg scale-102"
                : isMeadow
                ? "text-slate-700 hover:text-slate-900 hover:bg-indigo-100/60 border-b-4 border-transparent"
                : "text-white/70 hover:text-white hover:bg-white/10 border-b-4 border-transparent"
            }`}
          >
            <span className="text-xl">🔢</span>
            <span>Counting</span>
          </button>

          <button
            onClick={() => setActiveTab("games")}
            className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2 py-3 px-2 rounded-2xl font-black text-xs sm:text-sm transition-all cursor-pointer select-none ${
              activeTab === "games"
                ? "bg-gradient-to-b from-emerald-400 to-teal-500 text-white border-b-4 border-emerald-800 shadow-lg scale-102"
                : isMeadow
                ? "text-slate-700 hover:text-slate-900 hover:bg-emerald-100/60 border-b-4 border-transparent"
                : "text-white/70 hover:text-white hover:bg-white/10 border-b-4 border-transparent"
            }`}
          >
            <span className="text-xl">🎮</span>
            <span>Games</span>
          </button>

          <button
            onClick={() => setActiveTab("avatar-studio")}
            className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2 py-3 px-2 rounded-2xl font-black text-xs sm:text-sm transition-all cursor-pointer select-none ${
              activeTab === "avatar-studio"
                ? "bg-gradient-to-b from-pink-400 to-purple-500 text-white border-b-4 border-purple-800 shadow-lg scale-102"
                : isMeadow
                ? "text-slate-700 hover:text-slate-900 hover:bg-purple-100/60 border-b-4 border-transparent"
                : "text-white/70 hover:text-white hover:bg-white/10 border-b-4 border-transparent"
            }`}
          >
            <span className="text-xl">🐾</span>
            <span>My Buddy</span>
          </button>
        </div>

        {/* Responsive Layout: Sidebar on Desktop (lg:col-span-3), Main Content (lg:col-span-9) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Desktop Left Sidebar: Buddy Mascot, Explorer Rank, Today's Quests */}
          <div className="hidden lg:flex flex-col gap-4 lg:col-span-3">
            {/* Buddy Companion Mascot Card */}
            <div className={`p-5 rounded-3xl border shadow-lg ${
              isMeadow
                ? "bg-white/95 border-pink-200 text-slate-800"
                : "bg-white/[0.04] border-white/10 text-white"
            }`}>
              <div className="flex items-center gap-3 mb-3">
                <BuddyCompanionBadge buddy={gameState.buddy} size="md" animated />
                <div>
                  <div className="text-[10px] font-black uppercase text-pink-500">Learning Coach</div>
                  <h3 className="text-base font-black">{gameState.buddy.name}</h3>
                  <div className="text-xs text-amber-500 font-bold">Level {gameState.level} Explorer</div>
                </div>
              </div>
              <p className="text-xs italic bg-pink-500/10 p-2.5 rounded-2xl border border-pink-400/20 mb-3">
                "{gameState.buddy.catchphrase || "Ready for another magical adventure!"}"
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    soundEffects.playPop();
                    speakText(`Hello little explorer! I am ${gameState.buddy.name}! You are doing fantastic! Let's explore together!`, { pitch: 1.2 });
                  }}
                  className="flex-1 py-2 px-3 rounded-xl bg-pink-500 hover:bg-pink-400 text-white font-black text-xs text-center cursor-pointer shadow-sm transition-all"
                >
                  Say Hello 💬
                </button>
                <button
                  onClick={() => {
                    soundEffects.playPop();
                    setActiveTab("avatar-studio");
                  }}
                  className="py-2 px-3 rounded-xl bg-white/10 hover:bg-white/20 font-black text-xs text-center cursor-pointer transition-all"
                  title="Customize Buddy"
                >
                  Wardrobe 🎨
                </button>
              </div>
            </div>

            {/* Explorer Rank Card */}
            <div className={`p-5 rounded-3xl border shadow-lg ${
              isMeadow
                ? "bg-white/95 border-amber-200 text-slate-800"
                : "bg-white/[0.04] border-white/10 text-white"
            }`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-black uppercase tracking-wider text-amber-500">Explorer Rank</span>
                <span className="text-2xl">{currentRank.emoji}</span>
              </div>
              <h4 className="text-base font-black mb-1">{currentRank.title}</h4>
              <p className="text-xs text-slate-500 dark:text-white/60 mb-3">{currentRank.description}</p>
              <div className="space-y-1.5 text-xs font-bold">
                <div className="flex justify-between">
                  <span>Star Jar Balance:</span>
                  <span className="text-amber-500 font-black">{starsCount} ⭐</span>
                </div>
                <div className="flex justify-between">
                  <span>Unlocked Stickers:</span>
                  <span className="text-emerald-500 font-black">{unlockedStickersCount} / {TODDLER_STICKERS.length}</span>
                </div>
              </div>
              <button
                onClick={() => {
                  soundEffects.playPop();
                  setIsStickerAlbumOpen(true);
                }}
                className="w-full mt-3 py-2 rounded-xl bg-amber-400/20 hover:bg-amber-400/30 text-amber-600 dark:text-amber-300 border border-amber-400/30 font-black text-xs cursor-pointer transition-all text-center"
              >
                View Sticker Album 🏆
              </button>
            </div>

            {/* Today's Quests Card */}
            <div className={`p-5 rounded-3xl border shadow-lg ${
              isMeadow
                ? "bg-white/95 border-indigo-200 text-slate-800"
                : "bg-white/[0.04] border-white/10 text-white"
            }`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-black uppercase tracking-wider text-indigo-500">Today's Missions</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-400">
                  {completedMissions.length}/3 Done
                </span>
              </div>
              <div className="space-y-2 mb-3">
                {todayAdventure.missions.map((m) => {
                  const done = completedMissions.includes(m.id);
                  return (
                    <div
                      key={m.id}
                      onClick={() => {
                        soundEffects.playPop();
                        setIsDailyMissionsOpen(true);
                      }}
                      className={`p-2 rounded-xl text-xs flex items-center justify-between cursor-pointer transition-all ${
                        done
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                          : "bg-white/5 hover:bg-white/10"
                      }`}
                    >
                      <span className="truncate flex items-center gap-1.5">
                        <span>{m.emoji}</span>
                        <span className="font-bold">{m.title}</span>
                      </span>
                      <span>{done ? "✓" : `+${m.starsReward}⭐`}</span>
                    </div>
                  );
                })}
              </div>
              <button
                onClick={() => {
                  soundEffects.playPop();
                  setIsDailyMissionsOpen(true);
                }}
                className="w-full py-2 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white font-black text-xs cursor-pointer shadow-md transition-all text-center"
              >
                Launch Today's Quests 🎯
              </button>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-9 space-y-6">
            {/* SECTION 0: 6 WORLDS GATEWAYS NAVIGATOR */}
            {activeTab === "worlds" && (
              <ToddlerWorldsNavigator
                onAddStar={addStar}
                starsCount={starsCount}
                initialWorldId={initialWorldTarget}
                onOpenPictureBooks={() => setActiveTab("books")}
                onOpenGames={() => setActiveTab("games")}
              />
            )}

        {/* SECTION 1: PICTURE BOOKS SHELF */}
        {activeTab === "books" && (
          <div className="relative">
            {/* Mascot peeking over story shelf */}
            <div className="hidden sm:block">
              <CharacterAnchor emoji="🐰" title="Story Bunny" subtitle="Choose a tale!" position="top-right" />
            </div>

            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className={`text-xl sm:text-2xl font-black flex items-center gap-2 ${
                  isMeadow ? "text-slate-900" : "text-white"
                }`}>
                  <span>📖</span> Illustrated Story &amp; Picture Books
                </h2>
                <p className={`text-xs sm:text-sm font-semibold ${
                  isMeadow ? "text-slate-700" : "text-white/60"
                }`}>
                  Click any book to start reading aloud with voice narration, bright artwork, and interactive tap prompts!
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {PICTURE_BOOKS.map((book) => (
                <motion.div
                  key={book.id}
                  whileHover={{ y: -6, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleOpenBook(book)}
                  className={`group relative flex flex-col justify-between p-5 rounded-[2.25rem] transition-all cursor-pointer overflow-hidden ${
                    isMeadow
                      ? "bg-white text-slate-800 border-4 border-amber-200 hover:border-amber-400 shadow-[0_14px_30px_-6px_rgba(20,83,45,0.18)] hover:shadow-[0_20px_40px_-6px_rgba(20,83,45,0.25)]"
                      : "bg-white/[0.03] border-2 border-white/10 hover:border-amber-400/50 hover:bg-white/[0.06] text-white shadow-xl"
                  }`}
                >
                  <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${book.coverGradient} opacity-20 rounded-full blur-2xl group-hover:opacity-40 transition-opacity`} />
                  
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className={`text-4xl p-3 rounded-2xl border transition-transform group-hover:scale-110 shadow-sm ${
                        isMeadow ? "bg-amber-100 border-amber-200" : "bg-white/10 border-white/10"
                      }`}>
                        {book.coverEmoji}
                      </span>
                      <span className={`px-2.5 py-1 text-[11px] font-black uppercase rounded-full ${
                        isMeadow ? "bg-amber-200 text-amber-950" : "bg-white/10 text-white/80"
                      }`}>
                        {book.ageRange}
                      </span>
                    </div>

                    <h3 className={`text-lg font-black leading-snug mb-1 transition-colors ${
                      isMeadow
                        ? "text-slate-900 group-hover:text-amber-600"
                        : "text-white group-hover:text-amber-300"
                    }`}>
                      {book.title}
                    </h3>
                    <p className={`text-xs line-clamp-2 mb-3 ${
                      isMeadow ? "text-slate-600 font-medium" : "text-white/60"
                    }`}>
                      {book.subtitle}
                    </p>
                  </div>

                  <div className={`pt-3 border-t flex items-center justify-between text-xs ${
                    isMeadow ? "border-slate-100" : "border-white/5"
                  }`}>
                    <span className={`flex items-center gap-1 font-black ${
                      isMeadow ? "text-amber-700" : "text-amber-300"
                    }`}>
                      <Play size={13} className={isMeadow ? "fill-amber-700" : "fill-amber-300"} /> Read Now ({book.pages.length}p)
                    </span>
                    <span className={`text-[11px] font-black px-2.5 py-0.5 rounded-lg border shadow-sm ${
                      isMeadow
                        ? "bg-amber-100 border-amber-300 text-amber-900"
                        : "bg-amber-500/20 border-amber-400/30 text-amber-300"
                    }`}>
                      +3 ⭐
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Parent & Tutor Reading Tips Card (Tactile Cloud Card) */}
            <div className={`mt-8 p-5 sm:p-6 rounded-[2.25rem] flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl ${
              isMeadow
                ? "bg-white/95 backdrop-blur-md border-4 border-emerald-300 text-slate-800"
                : "bg-gradient-to-r from-indigo-950/40 to-purple-950/40 border border-indigo-500/20 text-white"
            }`}>
              <div className="flex items-start gap-3">
                <span className="text-3xl p-2.5 bg-emerald-100 border-2 border-emerald-300 rounded-2xl flex-shrink-0">💡</span>
                <div>
                  <h4 className={`text-sm sm:text-base font-black mb-0.5 ${
                    isMeadow ? "text-slate-900" : "text-white"
                  }`}>Parent &amp; Tutor Reading Co-Pilot</h4>
                  <p className={`text-xs sm:text-sm font-semibold max-w-xl ${
                    isMeadow ? "text-slate-600" : "text-white/60"
                  }`}>
                    Follow the interactive prompts on each page: encourage your child to touch the screen, imitate animal sounds, or find colors to nurture vocabulary!
                  </p>
                </div>
              </div>

              {onStartAssessment && (
                <button
                  onClick={() => onStartAssessment("toddler-phonics-basics")}
                  className="px-4 py-2.5 bg-gradient-to-b from-indigo-500 to-indigo-600 hover:from-indigo-400 hover:to-indigo-500 text-white font-black text-xs sm:text-sm rounded-2xl border-b-4 border-indigo-800 shadow-md transition-all active:translate-y-1 whitespace-nowrap cursor-pointer"
                >
                  Run 3-Min Assessment →
                </button>
              )}
            </div>
          </div>
        )}

        {/* SECTION 2: ABC PHONICS SOUNDBOARD */}
        {activeTab === "phonics" && (
          <div className="relative">
            {/* Mascot peeking over phonics board */}
            <div className="hidden sm:block">
              <CharacterAnchor emoji="🦜" title="Phonics Polly" subtitle="Tap any letter!" position="top-right" />
            </div>

            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className={`text-xl sm:text-2xl font-black flex items-center gap-2 ${
                  isMeadow ? "text-slate-900" : "text-white"
                }`}>
                  <span>🔤</span> ABC Phonics Soundboard
                </h2>
                <p className={`text-xs sm:text-sm font-semibold ${
                  isMeadow ? "text-slate-700" : "text-white/60"
                }`}>
                  Tap any letter tile to hear letter names, phonics sounds, and example words spoken aloud!
                </p>
              </div>
              <button
                onClick={() => speakText("Let's learn our ABCs! Tap any letter to hear its sound!", { pitch: 1.2 })}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2xl font-black text-xs border-b-4 shadow-md transition-all active:translate-y-1 cursor-pointer ${
                  isMeadow
                    ? "bg-white text-pink-700 border-pink-300 hover:bg-pink-50"
                    : "bg-rose-500/20 text-rose-300 border-rose-600 hover:bg-rose-500/30"
                }`}
              >
                <Volume2 size={15} /> Listen to Intro
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-7 gap-3">
              {PHONICS_TILES.map((tile) => {
                const isActive = activePhonicsLetter === tile.letter;
                return (
                  <motion.button
                    key={tile.letter}
                    whileHover={{ scale: 1.06, y: -4 }}
                    whileTap={{ scale: 0.92 }}
                    onClick={() => handlePhonicsClick(tile)}
                    className={`relative p-4 rounded-3xl flex flex-col items-center justify-center transition-all cursor-pointer select-none ${
                      isMeadow
                        ? isActive
                          ? "bg-pink-100 border-b-4 border-pink-600 ring-4 ring-pink-400/40 shadow-xl scale-105"
                          : "bg-white text-slate-900 border-b-4 border-pink-200 hover:border-pink-400 shadow-md active:translate-y-1"
                        : isActive
                        ? "bg-rose-500/30 border-2 border-rose-400 ring-4 ring-rose-400/30 text-white scale-105 shadow-lg"
                        : "bg-white/[0.03] border-2 border-white/10 hover:border-pink-400/50 hover:bg-white/[0.07] text-white shadow-lg"
                    }`}
                  >
                    <span className={`text-3xl sm:text-4xl font-black ${
                      isMeadow
                        ? "text-pink-600"
                        : "text-transparent bg-clip-text bg-gradient-to-b from-white to-pink-200"
                    }`}>
                      {tile.letter}
                    </span>
                    <span className="text-2xl my-1">{tile.emoji}</span>
                    <span className={`text-xs font-black ${
                      isMeadow ? "text-slate-800" : "text-white/80"
                    }`}>{tile.word}</span>
                    <div className={`mt-1 flex items-center gap-1 text-[10px] font-bold ${
                      isMeadow ? "text-pink-700" : "text-pink-300"
                    }`}>
                      <Volume2 size={11} /> Tap Sound
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>
        )}

        {/* SECTION 3: 1-2-3 COUNTING SAFARI */}
        {activeTab === "counting" && (
          <div className="relative">
            {/* Mascot peeking over counting safari */}
            <div className="hidden sm:block">
              <CharacterAnchor emoji="🦁" title="Safari Buddy" subtitle="Count with me!" position="top-right" />
            </div>

            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className={`text-xl sm:text-2xl font-black flex items-center gap-2 ${
                  isMeadow ? "text-slate-900" : "text-white"
                }`}>
                  <span>🔢</span> 1-2-3 Counting Safari
                </h2>
                <p className={`text-xs sm:text-sm font-semibold ${
                  isMeadow ? "text-slate-700" : "text-white/60"
                }`}>
                  Count the fun objects with your finger! Tap any card to hear numbers spoken aloud!
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {COUNTING_CARDS.map((card) => (
                <motion.div
                  key={card.num}
                  whileHover={{ scale: 1.03, y: -4 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleCountingClick(card)}
                  className={`p-6 rounded-[2.25rem] transition-all cursor-pointer flex flex-col justify-between shadow-xl ${
                    isMeadow
                      ? "bg-white text-slate-800 border-4 border-indigo-200 hover:border-indigo-400 shadow-[0_14px_30px_-6px_rgba(20,83,45,0.18)]"
                      : "bg-white/[0.03] border-2 border-white/10 hover:border-purple-400/50 hover:bg-white/[0.06] text-white"
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-b from-purple-500 to-indigo-600 flex items-center justify-center text-3xl font-black text-white shadow-md border-b-4 border-indigo-800">
                      {card.num}
                    </div>
                    <span className={`text-xl font-black uppercase tracking-wider ${
                      isMeadow ? "text-indigo-800" : "text-purple-300"
                    }`}>
                      {card.word}
                    </span>
                  </div>

                  <div className={`py-6 my-2 rounded-2xl border flex items-center justify-center text-4xl sm:text-5xl tracking-widest ${
                    isMeadow
                      ? "bg-indigo-50/80 border-indigo-100"
                      : "bg-black/30 border-white/5"
                  }`}>
                    {card.emojis}
                  </div>

                  <div className={`flex items-center justify-between pt-3 border-t text-xs ${
                    isMeadow ? "border-slate-100" : "border-white/5"
                  }`}>
                    <span className={`font-black ${
                      isMeadow ? "text-slate-900" : "text-white/90"
                    }`}>{card.item}</span>
                    <span className={`flex items-center gap-1 font-bold ${
                      isMeadow ? "text-indigo-700" : "text-purple-300"
                    }`}>
                      <Volume2 size={13} /> Count Aloud
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Toddler Math Assessment Prompt */}
            {onStartAssessment && (
              <div className={`mt-8 p-6 rounded-[2.25rem] flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left shadow-xl ${
                isMeadow
                  ? "bg-white/95 backdrop-blur-md border-4 border-emerald-300 text-slate-800"
                  : "bg-gradient-to-r from-emerald-950/40 to-teal-950/40 border border-emerald-500/30 text-white"
              }`}>
                <div>
                  <h4 className={`text-base font-black mb-1 ${
                    isMeadow ? "text-slate-900" : "text-white"
                  }`}>Lead a 5-Minute Toddler Math Milestone Check</h4>
                  <p className={`text-xs font-semibold ${
                    isMeadow ? "text-slate-600" : "text-white/60"
                  }`}>
                    Observe whether the child can count 3 physical items, distinguish a circle from a square, and identify 'more'.
                  </p>
                </div>
                <button
                  onClick={() => onStartAssessment("toddler-counting-shapes")}
                  className="px-5 py-3 rounded-2xl bg-gradient-to-b from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-black text-xs sm:text-sm border-b-4 border-emerald-800 shadow-md transition-all active:translate-y-1 cursor-pointer whitespace-nowrap"
                >
                  Start Toddler Math Check →
                </button>
              </div>
            )}
          </div>
        )}

        {/* SECTION 4: INTERACTIVE GAMES & PICTURE QUIZZES */}
        {activeTab === "games" && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                  <span>🎮</span> Toddler Interactive Quizzes & Play Games
                </h2>
                <p className="text-white/60 text-xs sm:text-sm">
                  Tactile, touch-friendly games designed for little hands: tap animal sounds, pop rainbow bubbles, and count yummy carrots!
                </p>
              </div>
            </div>

            <ToddlerQuizzesAndGames
              starsCount={starsCount}
              onAddStar={addStar}
              onBackToBooks={() => setActiveTab("books")}
              targetActivity={initialGameTarget}
            />
          </div>
        )}

        {/* SECTION 5: LEARNING BUDDY AVATAR STUDIO */}
        {activeTab === "avatar-studio" && (
          <BuddyAvatarStudio onBack={() => setActiveTab("books")} />
        )}
          </div>
        </div>
      </div>

      {/* Daily Missions Modal */}
      <ToddlerDailyMissionsModal
        isOpen={isDailyMissionsOpen}
        onClose={() => setIsDailyMissionsOpen(false)}
        onSelectMissionTab={(tab, subactivity) => {
          setActiveTab(tab);
          if (subactivity && tab === "worlds") {
            setInitialWorldTarget(subactivity);
          }
          if (subactivity && tab === "games") {
            setInitialGameTarget(subactivity);
          }
        }}
        onAddStar={addStar}
      />

      {/* Explorer Sticker Album Modal */}
      <ToddlerStickerAlbumModal
        isOpen={isStickerAlbumOpen}
        onClose={() => setIsStickerAlbumOpen(false)}
        starsCount={starsCount}
      />

      {/* FULL-SCREEN INTERACTIVE PICTURE BOOK READER MODAL */}
      <AnimatePresence>
        {selectedBook && activePage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col items-center p-2.5 sm:p-6 bg-black/90 backdrop-blur-md overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="relative w-full max-w-3xl my-auto rounded-[2.5rem] bg-[#fffbeb] text-slate-900 border-8 border-amber-300 shadow-2xl overflow-hidden flex flex-col max-h-[94vh]"
            >
              {/* Book Header */}
              <div className="flex items-center justify-between p-3.5 sm:p-4 bg-amber-100/90 border-b-2 border-amber-200">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="text-2xl sm:text-3xl flex-shrink-0 p-1.5 bg-white rounded-2xl border border-amber-200 shadow-sm">{selectedBook.coverEmoji}</span>
                  <div className="min-w-0">
                    <h3 className="text-sm sm:text-base font-black text-slate-900 truncate">{selectedBook.title}</h3>
                    <p className="text-[10px] sm:text-xs font-bold text-amber-800">
                      Page {activePage.pageNumber} of {selectedBook.pages.length}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
                  {/* Read to Me / Parent Voice Button */}
                  <button
                    onClick={() => handleReadAloud(activePage.narration)}
                    className={`flex items-center gap-1 sm:gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-2xl font-black text-xs transition-all cursor-pointer border-b-4 shadow-md active:translate-y-1 ${
                      isPlayingParentAudio
                        ? "bg-rose-500 text-white border-rose-700 animate-pulse"
                        : isSpeaking
                        ? "bg-amber-500 text-white border-amber-700 animate-pulse"
                        : parentAudioRecord
                        ? "bg-rose-100 hover:bg-rose-200 text-rose-900 border-rose-300"
                        : "bg-white text-slate-800 border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    {isPlayingParentAudio ? (
                      <VolumeX size={15} />
                    ) : isSpeaking ? (
                      <VolumeX size={15} />
                    ) : parentAudioRecord ? (
                      <Heart size={15} className="fill-rose-500 text-rose-500" />
                    ) : (
                      <Volume2 size={15} />
                    )}
                    <span className="hidden sm:inline">
                      {isPlayingParentAudio
                        ? "Playing Mom/Dad Voice"
                        : isSpeaking
                        ? "Pause Narration"
                        : parentAudioRecord
                        ? "Read by Mom/Dad ❤️"
                        : "Read to Me"}
                    </span>
                    <span className="sm:hidden">
                      {isPlayingParentAudio ? "Playing" : isSpeaking ? "Pause" : parentAudioRecord ? "Parent ❤️" : "Read"}
                    </span>
                  </button>

                  {/* Parent Voice Recorder Studio Button */}
                  {isRecordingParentVoice ? (
                    <button
                      onClick={handleStopParentRecording}
                      className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-2xl font-black text-xs bg-red-600 text-white border-b-4 border-red-800 animate-pulse shadow-md cursor-pointer"
                    >
                      <MicOff size={14} />
                      <span>Stop (Done)</span>
                    </button>
                  ) : (
                    <button
                      onClick={handleStartParentRecording}
                      className="hidden md:flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-2xl font-black text-xs bg-white hover:bg-rose-50 text-slate-700 hover:text-rose-700 border-b-3 border-slate-300 shadow-sm transition-colors cursor-pointer"
                      title="Record parent voice narration for this page"
                    >
                      <Mic size={14} className="text-rose-500" />
                      <span>{parentAudioRecord ? "Re-Record Voice" : "Record Voice"}</span>
                    </button>
                  )}

                  {parentAudioRecord && !isRecordingParentVoice && (
                    <button
                      onClick={handleDeleteParentRecording}
                      className="hidden lg:flex p-1.5 rounded-2xl bg-white hover:bg-red-50 text-slate-400 hover:text-red-500 border-b-2 border-slate-200 shadow-sm transition-colors cursor-pointer"
                      title="Remove custom recording"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}

                  <button
                    onClick={handleCloseBook}
                    className="p-1.5 sm:p-2 rounded-2xl bg-white hover:bg-rose-50 text-slate-700 hover:text-rose-600 border-b-3 border-slate-300 transition-colors cursor-pointer text-xs font-black shadow-sm"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Book Canvas / Page Surface */}
              {!isBookCompleted ? (
                <>
                  <div className="p-4 sm:p-8 flex-1 overflow-y-auto flex flex-col items-center text-center justify-center space-y-4 sm:space-y-6">
                    {/* Visual Scene Box (Pop-up Art Card) */}
                    <motion.div
                      key={`page-illus-${activePage.pageNumber}`}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="w-full max-w-lg py-6 sm:py-10 px-4 sm:px-6 rounded-[2rem] bg-white border-4 border-amber-200 flex flex-col items-center justify-center shadow-lg relative overflow-hidden"
                    >
                      <div className="text-6xl sm:text-8xl mb-2 sm:mb-3 filter drop-shadow-md animate-bounce">
                        {activePage.illustration}
                      </div>
                      {activePage.soundEffectText && (
                        <span className="px-3.5 py-1 text-xs sm:text-sm font-black uppercase rounded-full bg-amber-400 text-amber-950 shadow-md border-b-2 border-amber-600">
                          {activePage.soundEffectText}
                        </span>
                      )}
                    </motion.div>

                    {/* Page Heading & Story Text */}
                    <div className="max-w-xl space-y-2 sm:space-y-3">
                      <h4 className="text-lg sm:text-2xl font-black text-amber-900 font-display">
                        {activePage.title}
                      </h4>
                      <p className="text-base sm:text-2xl font-black text-slate-800 leading-relaxed font-body">
                        {activePage.text}
                      </p>

                      {/* Interactive Prompt Box for Parent / Child */}
                      <div className="p-3 sm:p-4 rounded-2xl bg-amber-200/70 border-2 border-amber-300 text-amber-950 text-xs sm:text-sm font-black flex items-center justify-center gap-2 shadow-sm">
                        <span>👉</span>
                        <span>{activePage.interactivePrompt}</span>
                      </div>

                      {activePage.learningInteraction && (() => {
                        const interaction = activePage.learningInteraction;
                        const answerKey = `${selectedBook.id}:${activePage.pageNumber}:${interaction.id}`;
                        const selectedAnswer = bookInteractionAnswers[answerKey];
                        return (
                          <div className="rounded-2xl border-2 border-indigo-200 bg-indigo-50 p-4 text-left shadow-sm" aria-label="Picture book learning question">
                            <p className="mb-3 text-sm font-black text-indigo-950">{interaction.prompt}</p>
                            <div className="grid gap-2 sm:grid-cols-3">
                              {interaction.options.map((option, optionIndex) => {
                                const isSelected = selectedAnswer === optionIndex;
                                const isCorrect = optionIndex === interaction.correctOptionIndex;
                                const answered = selectedAnswer !== undefined;
                                return (
                                  <button
                                    key={`${interaction.id}-${optionIndex}`}
                                    type="button"
                                    disabled={answered}
                                    onClick={() => handleBookInteractionAnswer(optionIndex)}
                                    className={`rounded-xl border-2 px-3 py-2.5 text-sm font-bold transition ${
                                      answered && isCorrect
                                        ? "border-emerald-500 bg-emerald-100 text-emerald-950"
                                        : isSelected
                                          ? "border-rose-400 bg-rose-100 text-rose-950"
                                          : "border-indigo-200 bg-white text-indigo-950 hover:border-indigo-400 hover:bg-indigo-100 disabled:cursor-default"
                                    }`}
                                  >
                                    {option}
                                  </button>
                                );
                              })}
                            </div>
                            {selectedAnswer !== undefined && (
                              <p className={`mt-3 text-sm font-bold ${selectedAnswer === interaction.correctOptionIndex ? "text-emerald-800" : "text-rose-800"}`} role="status">
                                {selectedAnswer === interaction.correctOptionIndex
                                  ? "That’s right! Great thinking!"
                                  : `Good try! The answer is ${interaction.options[interaction.correctOptionIndex]}.`}
                              </p>
                            )}
                          </div>
                        );
                      })()}
                    </div>
                  </div>

                  {/* Book Navigation Bar */}
                  <div className="p-3.5 sm:p-4 bg-amber-100/90 border-t-2 border-amber-200 flex items-center justify-between">
                    <button
                      onClick={handlePrevPage}
                      disabled={currentPageIndex === 0}
                      className="flex items-center gap-1 sm:gap-1.5 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-2xl bg-white border-b-4 border-slate-300 hover:bg-slate-50 disabled:opacity-30 disabled:pointer-events-none font-black text-xs sm:text-sm text-slate-800 transition-all cursor-pointer shadow-md active:translate-y-1"
                    >
                      <ChevronLeft size={16} /> <span className="hidden sm:inline">Back</span>
                    </button>

                    {/* Dots indicator */}
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      {selectedBook.pages.map((_, idx) => (
                        <div
                          key={idx}
                          className={`h-2.5 sm:h-3 rounded-full transition-all ${
                            idx === currentPageIndex
                              ? "w-6 sm:w-8 bg-amber-500 border border-amber-600"
                              : "w-2.5 sm:w-3 bg-amber-300"
                          }`}
                        />
                      ))}
                    </div>

                    <button
                      onClick={handleNextPage}
                      className="flex items-center gap-1 sm:gap-1.5 px-5 sm:px-7 py-2 sm:py-2.5 rounded-2xl bg-gradient-to-b from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 font-black text-xs sm:text-sm text-amber-950 border-b-4 border-orange-700 shadow-lg transition-all active:translate-y-1 cursor-pointer"
                    >
                      <span>{currentPageIndex === selectedBook.pages.length - 1 ? "Finish ⭐" : "Next"}</span>
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </>
              ) : (
                /* Celebration Completion Screen */
                <div className="p-8 sm:p-12 flex-1 flex flex-col items-center justify-center text-center space-y-6">
                  <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-5xl shadow-xl shadow-orange-500/40 border-4 border-white animate-bounce">
                    🏆
                  </div>
                  <div>
                    <h3 className="text-2xl sm:text-3xl font-black text-slate-900 font-display">
                      Story Completed!
                    </h3>
                    <p className="text-slate-700 text-sm sm:text-base mt-2 max-w-md font-bold">
                      You finished reading <strong className="text-amber-900">{selectedBook.title}</strong>! You earned{" "}
                      <span className="font-black text-amber-800">+3 Golden Stars ⭐</span>!
                    </p>
                  </div>

                  <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-amber-200 border-2 border-amber-400 text-amber-950 font-black text-base shadow-sm">
                    <Star className="w-6 h-6 fill-amber-400 text-amber-950 animate-pulse" />
                    <span>Your Star Jar: {starsCount} Stars</span>
                  </div>

                  <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
                    <button
                      onClick={() => {
                        setCurrentPageIndex(0);
                        setIsBookCompleted(false);
                        if (selectedBook.pages[0]) {
                          speakText(selectedBook.pages[0].narration);
                        }
                      }}
                      className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-b from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-amber-950 font-black text-sm border-b-4 border-orange-700 shadow-lg transition-all active:translate-y-1 cursor-pointer"
                    >
                      <RotateCcw size={16} />
                      <span>Read Story Again</span>
                    </button>

                    <button
                      onClick={handleCloseBook}
                      className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 font-black text-sm border-b-4 border-slate-300 shadow-md transition-all active:translate-y-1 cursor-pointer"
                    >
                      <span>Choose Another Book 📚</span>
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
