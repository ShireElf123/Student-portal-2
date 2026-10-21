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
import { PICTURE_BOOKS, pictureBookIsOnNamedStoriesShelf } from "../data/pictureBooksData";
import { speakText, stopSpeaking, speechCoordinator, spokenPageText } from "../utils/speechUtils";
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
import { ToddlerPlayhouse } from "./ToddlerPlayhouse";
import { ToddlerPhonicsBoard } from "./ToddlerPhonicsBoard";
import { ToddlerCountingBoard } from "./ToddlerCountingBoard";
import { ToddlerFocusBoard } from "./ToddlerFocusBoard";
import { ToddlerWorldsNavigator } from "./ToddlerWorldsNavigator";
import { ToddlerDailyMissionsModal } from "./ToddlerDailyMissionsModal";
import { ToddlerStickerAlbumModal } from "./ToddlerStickerAlbumModal";
import { BuddyCompanionBadge } from "./BuddyCompanionBadge";
import { BuddyAvatarStudio } from "./BuddyAvatarStudio";
import { getGamificationState, setWonderlandTheme, subscribeGamification, awardStars, DEFAULT_BUDDY } from "../utils/gamification";
import {
  getExplorerRank,
  getTodayAdventure,
  getCompletedDailyMissionIds,
  completeActiveMissionIfMatches,
  recordPhonicsLetterTapped,
  recordCountingCardTapped,
  TODDLER_STICKERS,
} from "../data/toddler/toddlerDailyAdventure";
import type { GameBlueprint } from "../contentEngine/types";
import {
  createGameResponseSessionId,
  recordBlueprintSessionCompletion,
  recordStorybookComprehensionResponse,
} from "../contentEngine/gameAdapters";
import { adaptStorybookBlueprintToPictureBook, findStaticPictureBookForSkill } from "../contentEngine/storybookAdapter";
import { markGameBlueprintCompleted } from "../services/gameContentService";
import {
  RollingHillsDivider,
  FloatingCloudDecoration,
  CharacterAnchor,
  TactileAgencyButton,
} from "./landscape/LandscapeDecorations";

interface ToddlerWorldViewProps {
  initialActivityId?: string;
  initialLaunchNonce?: number;
  initialSkillId?: string;
  initialBlueprint?: GameBlueprint;
  initialBlueprintLearnerId?: string;
  onStartAssessment?: (assessmentId: string) => void;
  onSwitchToPrimary?: () => void;
  onSwitchToEducator?: () => void;
  onRequestExit?: () => void;
}

const FEATURED_BOOK_IDS = [
  "stoop-watermelon",
  "pancake-saturday",
  "how-a-ferry-floats",
  "cat-on-mat",
  "paper-gutter-boat",
  "little-red-fire-truck",
  "how-mail-travels",
  "quilt-square-moon",
] as const;

const BOOK_SHELVES = [
  { id: "all", label: "Library", emoji: "📚" },
  { id: "teddy-nana", label: "Teddy & Nana", emoji: "🧸" },
  { id: "street", label: "Street", emoji: "🚕" },
  { id: "first-words", label: "First words", emoji: "🔤" },
  { id: "look-learn", label: "Look & learn", emoji: "🔍" },
  { id: "bedtime", label: "Bedtime", emoji: "🌙" },
  { id: "more", label: "More stories", emoji: "📖" },
  { id: "long", label: "Long tales", emoji: "✨" },
] as const;

type BookShelfId = (typeof BOOK_SHELVES)[number]["id"];

function bookMatchesShelf(book: PictureBook, shelf: BookShelfId): boolean {
  if (shelf === "all") return true;
  if (shelf === "long") return book.pages.length >= 8;
  if (shelf === "teddy-nana") return book.series === "teddy-nana";
  if (shelf === "street") return book.series === "street";
  if (shelf === "first-words") return book.series === "first-words";
  if (shelf === "look-learn") return book.series === "look-learn";
  if (shelf === "bedtime") return book.category === "bedtime" || book.id === "big-hug-bed";
  if (shelf === "more") return !pictureBookIsOnNamedStoriesShelf(book);
  return true;
}

function booksForRow(id: "featured" | "teddy-nana" | "street" | "first-words" | "look-learn" | "bedtime" | "more"): PictureBook[] {
  if (id === "featured") {
    return FEATURED_BOOK_IDS.map((bookId) => PICTURE_BOOKS.find((book) => book.id === bookId)).filter(
      (book): book is PictureBook => Boolean(book),
    );
  }
  return PICTURE_BOOKS.filter((book) => bookMatchesShelf(book, id));
}

function StoryReadAloudText({
  text,
  highlights,
  activeWordIndex,
  onSpeakWord,
}: {
  text: string;
  highlights?: string[];
  activeWordIndex?: number | null;
  onSpeakWord: (word: string) => void;
}) {
  const wanted = new Set((highlights ?? []).map((word) => word.toLowerCase()));
  const parts = text.split(/(\s+)/);
  let wordNumber = -1;
  return (
    <p className="text-lg sm:text-2xl font-black text-slate-800 leading-relaxed">
      {parts.map((part, index) => {
        const clean = part.replace(/[^A-Za-z0-9']/g, "");
        if (!clean) return <span key={`${part}-${index}`}>{part}</span>;
        wordNumber += 1;
        const gold = wanted.has(clean.toLowerCase());
        const reading = activeWordIndex === wordNumber;
        return (
          <button
            key={`${clean}-${index}`}
            type="button"
            className={`inline min-h-12 rounded-md px-1 transition-colors ${
              reading
                ? "bg-amber-400 text-amber-950 ring-2 ring-amber-600"
                : gold
                ? "bg-amber-200 text-amber-950 underline decoration-amber-500 decoration-2 underline-offset-4"
                : "hover:bg-amber-100"
            }`}
            onClick={() => onSpeakWord(clean)}
          >
            {part}
          </button>
        );
      })}
    </p>
  );
}

function StoryCoverCard({
  book,
  onOpen,
  large,
  eager,
}: {
  book: PictureBook;
  onOpen: (book: PictureBook) => void;
  large?: boolean;
  eager?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={() => onOpen(book)}
      className={`snap-start shrink-0 text-left ${large ? "w-[11.5rem] sm:w-56" : "w-40 sm:w-48"}`}
    >
      <div
        className={`relative overflow-hidden rounded-[1.75rem] border-4 border-white/70 shadow-xl bg-gradient-to-br ${book.coverGradient} ${
          large ? "aspect-[3/4]" : "aspect-[4/5]"
        }`}
      >
        {book.coverImage ? (
          <img
            src={book.coverImage}
            alt=""
            width={640}
            height={640}
            loading={eager ? "eager" : "lazy"}
            decoding="async"
            fetchPriority={eager ? "high" : "low"}
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <span className="absolute inset-0 flex items-center justify-center text-7xl drop-shadow">{book.coverEmoji}</span>
        )}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3 pt-10">
          <p className="text-[11px] font-black uppercase tracking-wide text-white/90">
            {book.pages.length} pages · {book.readTimeMinutes} min
          </p>
          <h3 className="text-base sm:text-lg font-black leading-tight text-white line-clamp-2">{book.title}</h3>
        </div>
      </div>
    </button>
  );
}

export function ToddlerWorldView({
  initialActivityId,
  initialLaunchNonce,
  initialSkillId,
  initialBlueprint,
  initialBlueprintLearnerId,
  onStartAssessment,
  onSwitchToPrimary,
  onSwitchToEducator,
  onRequestExit,
}: ToddlerWorldViewProps) {
  const [activeTab, setActiveTab] = useState<"worlds" | "books" | "playhouse" | "phonics" | "counting" | "focus" | "games" | "avatar-studio">("worlds");
  const [gameState, setGameState] = useState(() => getGamificationState());
  const activeBuddy = gameState.buddy ?? DEFAULT_BUDDY;
  const [selectedBook, setSelectedBook] = useState<PictureBook | null>(null);
  const [bookShelf, setBookShelf] = useState<BookShelfId>("all");
  const [readMode, setReadMode] = useState<"to-me" | "myself">("to-me");
  const readModeRef = useRef<"to-me" | "myself">("to-me");
  readModeRef.current = readMode;
  const [currentPageIndex, setCurrentPageIndex] = useState<number>(0);
  const [bookInteractionAnswers, setBookInteractionAnswers] = useState<Record<string, number>>({});
  const [bookInteractionHints, setBookInteractionHints] = useState<Record<string, boolean>>({});
  const storybookSessionIdRef = useRef<string | null>(null);
  const activePage: PictureBookPage | null = selectedBook ? selectedBook.pages[currentPageIndex] || null : null;
  const activeGeneratedStoryBlueprint = initialBlueprint?.gameType === "storybook-comprehension" &&
    selectedBook?.id === `generated-${initialBlueprint.id}` ? initialBlueprint : null;
  const [isBookCompleted, setIsBookCompleted] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [readAlongWordIndex, setReadAlongWordIndex] = useState<number | null>(null);
  const [isMuted, setIsMuted] = useState<boolean>(() => speechCoordinator.isMuted());
  const [starsCount, setStarsCount] = useState<number>(() => {
    return getGamificationState().starsCount;
  });

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
  }, [initialActivityId, initialLaunchNonce]);

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
    eventType: "experience_opened" | "content_explored",
    learnerId?: string
  ) => {
    const page = book.pages[pageIndex];
    const generatedStory = initialBlueprint?.gameType === "storybook-comprehension" && book.id === `generated-${initialBlueprint.id}`
      ? initialBlueprint
      : null;
    try {
      recordLearningEvent({
        learnerId: learnerId ?? (generatedStory ? initialBlueprintLearnerId ?? getActiveLearnerId() : getActiveLearnerId()),
        activityId: "picture-book-interaction",
        experienceId: "picture-book-reader",
        contentId: eventType === "experience_opened" ? book.id : `${book.id}:page-${page?.pageNumber ?? pageIndex + 1}`,
        eventType,
        activityType: "storybook-interaction",
        activityTitle: eventType === "experience_opened" ? `Opened ${book.title}` : `Viewed ${book.title}, page ${page?.pageNumber ?? pageIndex + 1}`,
        domain: "general",
        gradeBand: generatedStory?.gradeBand ?? "toddler",
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
    const isCorrect = optionIndex === interaction.correctOptionIndex;
    try {
      if (activeGeneratedStoryBlueprint) {
        const sessionId = storybookSessionIdRef.current ?? createGameResponseSessionId();
        storybookSessionIdRef.current = sessionId;
        recordStorybookComprehensionResponse(
          activeGeneratedStoryBlueprint,
          currentPageIndex,
          optionIndex,
          initialBlueprintLearnerId ?? getActiveLearnerId(),
          bookInteractionHints[key] ? 1 : 0,
          `${sessionId}:${interaction.id}`
        );
      } else {
        const resolved = resolveSkillForActivity(interaction.skillId);
        if (!resolved.skillId) {
          console.error(`Picture-book interaction ${interaction.id} has no valid curriculum skill mapping`);
          return;
        }
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
      }
      setBookInteractionAnswers((answers) => ({ ...answers, [key]: optionIndex }));
    } catch (error) {
      console.error("Failed to record picture-book response evidence:", error);
    }
  };

  const speakPrintedPage = (page: PictureBookPage) => {
    const line = spokenPageText(page);
    setReadAlongWordIndex(0);
    speakText(line, {
      onBoundary: ({ wordIndex }) => setReadAlongWordIndex(wordIndex),
      onEnd: () => setReadAlongWordIndex(null),
    });
  };

  const handleOpenBook = (book: PictureBook, pageIndex = 0, learnerId?: string) => {
    const startingPage = book.pages[pageIndex];
    if (!startingPage) return;
    setSelectedBook(book);
    setCurrentPageIndex(pageIndex);
    setBookInteractionAnswers({});
    setBookInteractionHints({});
    visitedBookPagesRef.current.clear();
    visitedBookPagesRef.current.add(pageIndex);
    setIsBookCompleted(false);
    recordBookEngagement(book, pageIndex, "experience_opened", learnerId);
    stopSpeaking();
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
      audioPlayerRef.current = null;
      setIsPlayingParentAudio(false);
    }
    // Check if this page has parent recording, else auto narrate.
    getPageAudio(book.id, startingPage.pageNumber).then((rec) => {
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
          speakPrintedPage(startingPage);
        });
      } else if (readModeRef.current === "to-me") {
        speakPrintedPage(startingPage);
      }
    });
  };

  useEffect(() => {
    if (initialActivityId !== "books") return;
    if (initialBlueprint?.gameType === "storybook-comprehension") {
      storybookSessionIdRef.current = createGameResponseSessionId();
      handleOpenBook(
        adaptStorybookBlueprintToPictureBook(initialBlueprint),
        0,
        initialBlueprintLearnerId
      );
      return;
    }
    storybookSessionIdRef.current = null;
    setSelectedBook(null);
    const fallback = initialSkillId ? findStaticPictureBookForSkill(initialSkillId) : null;
    if (fallback) handleOpenBook(fallback.book, fallback.pageIndex);
  }, [initialActivityId, initialLaunchNonce, initialSkillId, initialBlueprint?.id, initialBlueprintLearnerId]);

  const handleCloseBook = () => {
    stopSpeaking();
    setReadAlongWordIndex(null);
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
    setBookInteractionHints({});
    storybookSessionIdRef.current = null;
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
            speakPrintedPage(selectedBook.pages[nextIdx]);
          });
        } else if (readModeRef.current === "to-me") {
          speakPrintedPage(selectedBook.pages[nextIdx]);
        }
      });
      if (!visitedBookPagesRef.current.has(nextIdx)) {
        visitedBookPagesRef.current.add(nextIdx);
        addStar(1);
        recordBookEngagement(selectedBook, nextIdx, "content_explored");
      }
    } else {
      // Completing a generated book records exploration for content-pool freshness, never mastery.
      if (activeGeneratedStoryBlueprint) {
        const learnerId = initialBlueprintLearnerId ?? getActiveLearnerId();
        const sessionId = storybookSessionIdRef.current ?? createGameResponseSessionId();
        storybookSessionIdRef.current = sessionId;
        recordBlueprintSessionCompletion(activeGeneratedStoryBlueprint, learnerId, sessionId);
        void markGameBlueprintCompleted(activeGeneratedStoryBlueprint, learnerId).catch(() => {});
      }
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
          if (readModeRef.current === "to-me") speakPrintedPage(selectedBook.pages[prevIdx]);
        });
      } else if (readModeRef.current === "to-me") {
        speakPrintedPage(selectedBook.pages[prevIdx]);
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
      setReadAlongWordIndex(null);
      return;
    }

    // Play parent recording if available
    if (parentAudioRecord?.audioBlob) {
      stopSpeaking();
      setReadAlongWordIndex(null);
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
        if (activePage) speakPrintedPage(activePage);
        else speakText(text);
      };
      aud.play().catch(() => {
        setIsPlayingParentAudio(false);
        if (activePage) speakPrintedPage(activePage);
        else speakText(text);
      });
      return;
    }

    if (activePage) speakPrintedPage(activePage);
    else speakText(text);
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

        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 relative z-10">
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
                <Sparkles size={13} className="text-amber-500" /> Ages 2–5
              </div>
              <h1 className={`text-3xl sm:text-5xl font-black tracking-tight ${
                isMeadow ? "text-slate-900 drop-shadow-sm font-display" : "text-white"
              }`}>
                Toddler Wonderland
              </h1>
              <p className={`text-sm sm:text-base font-bold ${
                isMeadow ? "text-slate-800 max-w-xl" : "text-white/90 max-w-xl"
              }`}>
                Pick a land. Play inside.
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
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-sm font-black min-h-12 transition-all cursor-pointer shadow-md active:translate-y-1 ${
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
              className="flex items-center gap-1.5 px-3 py-2 rounded-2xl text-sm font-black min-h-12 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 text-white border-b-4 border-indigo-800 shadow-md transition-all active:translate-y-1 cursor-pointer"
              title="Today's 3 Adventure Missions"
            >
              <Calendar size={14} />
              <span>Quests</span>
              <span className="px-1.5 py-0.5 rounded-full bg-white/20 text-xs">
                {completedMissions.length}/3
              </span>
            </button>

            {/* Sticker Album Button */}
            <button
              onClick={() => {
                soundEffects.playPop();
                setIsStickerAlbumOpen(true);
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-2xl text-sm font-black min-h-12 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 text-amber-950 border-b-4 border-amber-700 shadow-md transition-all active:translate-y-1 cursor-pointer"
              title="Explorer Sticker Album"
            >
              <Trophy size={14} />
              <span>Stickers</span>
              <span className="px-1.5 py-0.5 rounded-full bg-amber-950/20 text-xs font-black">
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
              <BuddyCompanionBadge buddy={activeBuddy} size="sm" animated />
              <div className="text-left hidden sm:block">
                <div className="text-xs uppercase font-black text-pink-600">Buddy</div>
                <div className="text-sm font-black text-slate-900">{activeBuddy.name}</div>
              </div>
            </button>

            {/* Audio Voice Toggle */}
            <button
              onClick={toggleMute}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-2xl text-sm font-black min-h-12 transition-all cursor-pointer border-b-4 shadow-md active:translate-y-1 ${
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
                <div className="text-xs uppercase font-black tracking-wider leading-none">
                  {currentRank.emoji} {currentRank.title}
                </div>
                <div className="text-base font-black leading-tight">
                  {starsCount} <span className="text-sm font-bold">Stars</span>
                </div>
              </div>
            </div>

            {onStartAssessment && (
              <button
                onClick={() => onStartAssessment("toddler-phonics-basics")}
                className="flex items-center gap-1.5 bg-gradient-to-b from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-black text-sm min-h-12 px-4 py-2.5 rounded-2xl border-b-4 border-emerald-800 shadow-md transition-all active:translate-y-1 cursor-pointer"
              >
                <GraduationCap size={16} />
                <span className="hidden sm:inline">Milestone Check</span>
                <span className="sm:hidden">Check</span>
              </button>
            )}

            {onRequestExit && (
              <button
                onClick={onRequestExit}
                className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-white font-black text-sm min-h-12 px-4 py-2.5 rounded-2xl border-b-4 border-slate-950 transition-all cursor-pointer shadow-md active:translate-y-1"
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

      {/* Main Mode Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 pt-2 pb-2">
        <div className={`grid grid-cols-4 sm:grid-cols-4 lg:grid-cols-8 gap-2 sm:gap-3 p-2 sm:p-3 rounded-3xl max-w-6xl mx-auto mb-8 shadow-xl ${
          isMeadow
            ? "bg-white/95 backdrop-blur-md border-4 border-emerald-300 ring-4 ring-emerald-500/20"
            : "bg-white/[0.08] border border-white/15"
        }`}>
          <button
            onClick={() => setActiveTab("worlds")}
            className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2 py-3 sm:py-4 px-2 sm:px-3 rounded-2xl font-black text-sm sm:text-base md:text-lg transition-all cursor-pointer select-none ${
              activeTab === "worlds"
                ? "bg-gradient-to-b from-amber-400 to-orange-500 text-white border-b-4 border-orange-700 shadow-lg scale-102"
                : isMeadow
                ? "text-slate-700 hover:text-slate-900 hover:bg-amber-100/60 border-b-4 border-transparent"
                : "text-white hover:bg-white/15 border-b-4 border-transparent"
            }`}
          >
            <span className="text-2xl sm:text-3xl">🗺️</span>
            <span>Worlds</span>
          </button>

          <button
            onClick={() => setActiveTab("books")}
            className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2 py-3 sm:py-4 px-2 sm:px-3 rounded-2xl font-black text-sm sm:text-base md:text-lg transition-all cursor-pointer select-none ${
              activeTab === "books"
                ? "bg-gradient-to-b from-amber-400 to-amber-500 text-amber-950 border-b-4 border-amber-700 shadow-lg scale-102"
                : isMeadow
                ? "text-slate-700 hover:text-slate-900 hover:bg-amber-100/60 border-b-4 border-transparent"
                : "text-white hover:bg-white/15 border-b-4 border-transparent"
            }`}
          >
            <span className="text-2xl sm:text-3xl">📚</span>
            <span>Stories</span>
          </button>

          <button
            onClick={() => setActiveTab("playhouse")}
            className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2 py-3 sm:py-4 px-2 sm:px-3 rounded-2xl font-black text-sm sm:text-base md:text-lg transition-all cursor-pointer select-none ${
              activeTab === "playhouse"
                ? "bg-gradient-to-b from-violet-400 to-fuchsia-500 text-white border-b-4 border-fuchsia-800 shadow-lg scale-102"
                : isMeadow
                ? "text-slate-700 hover:text-slate-900 hover:bg-violet-100/60 border-b-4 border-transparent"
                : "text-white hover:bg-white/15 border-b-4 border-transparent"
            }`}
          >
            <span className="text-2xl sm:text-3xl">🎭</span>
            <span>Playhouse</span>
          </button>

          <button
            onClick={() => setActiveTab("phonics")}
            className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2 py-3 sm:py-4 px-2 sm:px-3 rounded-2xl font-black text-sm sm:text-base md:text-lg transition-all cursor-pointer select-none ${
              activeTab === "phonics"
                ? "bg-gradient-to-b from-rose-400 to-pink-500 text-white border-b-4 border-pink-700 shadow-lg scale-102"
                : isMeadow
                ? "text-slate-700 hover:text-slate-900 hover:bg-pink-100/60 border-b-4 border-transparent"
                : "text-white hover:bg-white/15 border-b-4 border-transparent"
            }`}
          >
            <span className="text-2xl sm:text-3xl">🔤</span>
            <span>Phonics</span>
          </button>

          <button
            onClick={() => setActiveTab("counting")}
            className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2 py-3 sm:py-4 px-2 sm:px-3 rounded-2xl font-black text-sm sm:text-base md:text-lg transition-all cursor-pointer select-none ${
              activeTab === "counting"
                ? "bg-gradient-to-b from-indigo-400 to-indigo-600 text-white border-b-4 border-indigo-800 shadow-lg scale-102"
                : isMeadow
                ? "text-slate-700 hover:text-slate-900 hover:bg-indigo-100/60 border-b-4 border-transparent"
                : "text-white hover:bg-white/15 border-b-4 border-transparent"
            }`}
          >
            <span className="text-2xl sm:text-3xl">🔢</span>
            <span>Counting</span>
          </button>

          <button
            onClick={() => setActiveTab("focus")}
            className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2 py-3 sm:py-4 px-2 sm:px-3 rounded-2xl font-black text-sm sm:text-base md:text-lg transition-all cursor-pointer select-none ${
              activeTab === "focus"
                ? "bg-gradient-to-b from-teal-400 to-cyan-600 text-white border-b-4 border-teal-800 shadow-lg scale-102"
                : isMeadow
                ? "text-slate-700 hover:text-slate-900 hover:bg-teal-100/60 border-b-4 border-transparent"
                : "text-white hover:bg-white/15 border-b-4 border-transparent"
            }`}
          >
            <span className="text-2xl sm:text-3xl">🫀</span>
            <span>Focus</span>
          </button>

          <button
            onClick={() => setActiveTab("games")}
            className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2 py-3 sm:py-4 px-2 sm:px-3 rounded-2xl font-black text-sm sm:text-base md:text-lg transition-all cursor-pointer select-none ${
              activeTab === "games"
                ? "bg-gradient-to-b from-emerald-400 to-teal-500 text-white border-b-4 border-emerald-800 shadow-lg scale-102"
                : isMeadow
                ? "text-slate-700 hover:text-slate-900 hover:bg-emerald-100/60 border-b-4 border-transparent"
                : "text-white hover:bg-white/15 border-b-4 border-transparent"
            }`}
          >
            <span className="text-2xl sm:text-3xl">🎮</span>
            <span>Games</span>
          </button>

          <button
            onClick={() => setActiveTab("avatar-studio")}
            className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2 py-3 sm:py-4 px-2 sm:px-3 rounded-2xl font-black text-sm sm:text-base md:text-lg transition-all cursor-pointer select-none ${
              activeTab === "avatar-studio"
                ? "bg-gradient-to-b from-pink-400 to-purple-500 text-white border-b-4 border-purple-800 shadow-lg scale-102"
                : isMeadow
                ? "text-slate-700 hover:text-slate-900 hover:bg-purple-100/60 border-b-4 border-transparent"
                : "text-white hover:bg-white/15 border-b-4 border-transparent"
            }`}
          >
            <span className="text-2xl sm:text-3xl">🐾</span>
            <span>My Buddy</span>
          </button>
        </div>

        {/* Worlds is the front page: full width like the phone. Other tabs keep the desktop sidebar. */}
        <div className={`grid grid-cols-1 gap-6 items-start ${activeTab === "worlds" ? "" : "lg:grid-cols-12"}`}>
          {/* Desktop Left Sidebar: Buddy Mascot, Explorer Rank, Today's Quests */}
          <div className={`hidden flex-col gap-4 lg:col-span-3 ${activeTab === "worlds" ? "" : "lg:flex"}`}>
            {/* Buddy Companion Mascot Card */}
            <div className={`p-5 rounded-3xl border shadow-lg ${
              isMeadow
                ? "bg-white/95 border-pink-200 text-slate-800"
                : "bg-white/[0.04] border-white/10 text-white"
            }`}>
              <div className="flex items-center gap-3 mb-3">
                <BuddyCompanionBadge buddy={activeBuddy} size="md" animated />
                <div>
                  <div className="text-xs font-black uppercase text-pink-500">Learning Coach</div>
                  <h3 className="text-lg font-black">{activeBuddy.name}</h3>
                  <div className="text-sm text-amber-500 font-bold">Level {gameState.level} Explorer</div>
                </div>
              </div>
              <p className="text-sm italic bg-pink-500/10 p-2.5 rounded-2xl border border-pink-400/20 mb-3">
                "{activeBuddy.catchphrase || "Ready for another magical adventure!"}"
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    soundEffects.playPop();
                    speakText(`Hello little explorer! I am ${activeBuddy.name}! You are doing fantastic! Let's explore together!`, { pitch: 1.2 });
                  }}
                  className="flex-1 min-h-12 py-2.5 px-3 rounded-xl bg-pink-500 hover:bg-pink-400 text-white font-black text-sm text-center cursor-pointer shadow-sm transition-all"
                >
                  Say Hello 💬
                </button>
                <button
                  onClick={() => {
                    soundEffects.playPop();
                    setActiveTab("avatar-studio");
                  }}
                  className="min-h-12 py-2.5 px-3 rounded-xl bg-white/15 hover:bg-white/25 font-black text-sm text-center cursor-pointer transition-all"
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
                <span className="text-sm font-black uppercase tracking-wider text-amber-500">Explorer Rank</span>
                <span className="text-2xl">{currentRank.emoji}</span>
              </div>
              <h4 className="text-base font-black mb-1">{currentRank.title}</h4>
              <p className="text-sm text-slate-700 dark:text-white/90 mb-3">{currentRank.description}</p>
              <div className="space-y-1.5 text-sm font-bold">
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
                className="w-full mt-3 min-h-12 py-2.5 rounded-xl bg-amber-400/20 hover:bg-amber-400/30 text-amber-600 dark:text-amber-300 border border-amber-400/30 font-black text-sm cursor-pointer transition-all text-center"
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
                <span className="text-sm font-black uppercase tracking-wider text-indigo-500">Today's Missions</span>
                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-400">
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
                      className={`p-3 rounded-xl text-sm flex items-center justify-between cursor-pointer transition-all ${
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
                className="w-full min-h-12 py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white font-black text-sm cursor-pointer shadow-md transition-all text-center"
              >
                Launch Today's Quests 🎯
              </button>
            </div>
          </div>

          {/* Main Content Area */}
          <div className={`${activeTab === "worlds" ? "" : "lg:col-span-9"} space-y-6`}>
            {/* SECTION 0: 6 WORLDS GATEWAYS NAVIGATOR */}
            {activeTab === "worlds" && (
              <ToddlerWorldsNavigator
                onAddStar={addStar}
                starsCount={starsCount}
                initialWorldId={initialWorldTarget}
                onOpenPictureBooks={() => setActiveTab("books")}
                onOpenGames={() => setActiveTab("games")}
                onOpenFocus={() => setActiveTab("focus")}
              />
            )}

        {/* SECTION 1: PICTURE BOOKS SHELF */}
        {activeTab === "books" && (
          <div className="relative">
            {/* Mascot peeking over story shelf */}
            <div className="hidden sm:block">
              <CharacterAnchor emoji="🧸" title="Story Bear" subtitle="Choose a tale!" position="top-right" />
            </div>

            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className={`text-xl sm:text-2xl font-black flex items-center gap-2 ${
                  isMeadow ? "text-slate-900" : "text-white"
                }`}>
                  <span>📖</span> Story Library
                </h2>
                <p className={`text-sm sm:text-base font-semibold ${
                  isMeadow ? "text-slate-800" : "text-white/85"
                }`}>
                  A real library: series rows, long tales, first words, look-and-learn. Tap a cover. Tap any word.
                </p>
              </div>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-3 mb-4 snap-x">
              {BOOK_SHELVES.map((shelf) => {
                const on = bookShelf === shelf.id;
                return (
                  <button
                    key={shelf.id}
                    type="button"
                    onClick={() => setBookShelf(shelf.id)}
                    className={`snap-start shrink-0 min-h-12 px-4 rounded-2xl font-black text-sm border-b-4 shadow-md ${
                      on
                        ? "bg-amber-400 text-amber-950 border-amber-700"
                        : isMeadow
                          ? "bg-white text-slate-800 border-amber-200"
                          : "bg-white/10 text-white border-white/20"
                    }`}
                  >
                    {shelf.emoji} {shelf.label}
                  </button>
                );
              })}
            </div>

            {bookShelf === "all" ? (
              <div className="space-y-8">
                {(
                  [
                    { id: "featured", label: "Open tonight", emoji: "✨" },
                    { id: "teddy-nana", label: "Teddy & Nana", emoji: "🧸" },
                    { id: "street", label: "Out on the street", emoji: "🚕" },
                    { id: "first-words", label: "First words", emoji: "🔤" },
                    { id: "look-learn", label: "Look & learn", emoji: "🔍" },
                    { id: "bedtime", label: "Bedtime", emoji: "🌙" },
                    { id: "more", label: "More stories", emoji: "📖" },
                  ] as const
                ).map((row) => {
                  const rowBooks = booksForRow(row.id);
                  if (rowBooks.length === 0) return null;
                  return (
                    <section key={row.id}>
                      <h3 className={`text-lg sm:text-xl font-black mb-3 ${isMeadow ? "text-slate-900" : "text-white"}`}>
                        {row.emoji} {row.label}
                      </h3>
                      <div className="flex gap-4 overflow-x-auto pb-3 snap-x">
                        {rowBooks.map((book, index) => (
                          <StoryCoverCard
                            key={`${row.id}-${book.id}`}
                            book={book}
                            large
                            eager={row.id === "featured" && index < 3}
                            onOpen={handleOpenBook}
                          />
                        ))}
                      </div>
                    </section>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-wrap gap-4">
                {PICTURE_BOOKS.filter((book) => bookMatchesShelf(book, bookShelf)).map((book) => (
                  <StoryCoverCard key={book.id} book={book} large onOpen={handleOpenBook} />
                ))}
              </div>
            )}

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
                  <p className={`text-sm sm:text-base font-semibold max-w-xl ${
                    isMeadow ? "text-slate-700" : "text-white/90"
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

        {activeTab === "playhouse" && (
          <ToddlerPlayhouse isMeadow={isMeadow} onAddStar={addStar} />
        )}

        {activeTab === "phonics" && (
          <ToddlerPhonicsBoard isMeadow={isMeadow} onAddStar={addStar} />
        )}

        {activeTab === "counting" && (
          <ToddlerCountingBoard isMeadow={isMeadow} onAddStar={addStar} onStartAssessment={onStartAssessment} />
        )}

        {activeTab === "focus" && (
          <ToddlerFocusBoard isMeadow={isMeadow} onAddStar={addStar} onReadyLearn={() => setActiveTab("phonics")} />
        )}

        {/* SECTION 4: INTERACTIVE GAMES & PICTURE QUIZZES */}
        {activeTab === "games" && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                  <span>🎮</span> Toddler Interactive Quizzes & Play Games
                </h2>
                <p className="text-white/90 text-sm sm:text-base">
                  Tactile, touch-friendly games designed for little hands: tap animal sounds, pop rainbow bubbles, and count yummy carrots!
                </p>
              </div>
            </div>

            <ToddlerQuizzesAndGames
              starsCount={starsCount}
              onAddStar={addStar}
              onBackToBooks={() => setActiveTab("books")}
              targetActivity={initialGameTarget ?? undefined}
              initialBlueprint={initialBlueprint?.gameType === "bubble-pop-phonics" ? initialBlueprint : undefined}
              initialBlueprintLearnerId={initialBlueprint?.gameType === "bubble-pop-phonics" ? initialBlueprintLearnerId : undefined}
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
              className={`relative w-full my-auto rounded-[2.5rem] bg-[#fffbeb] text-slate-900 border-8 border-amber-300 shadow-2xl overflow-hidden flex flex-col max-h-[94vh] ${
                activePage.illustrationImage ? "max-w-4xl" : "max-w-3xl"
              }`}
            >
              {/* Book Header */}
              <div className="flex items-center justify-between p-3.5 sm:p-4 bg-amber-100/90 border-b-2 border-amber-200">
                <div className="flex items-center gap-2.5 min-w-0">
                  {selectedBook.coverImage ? (
                    <img src={selectedBook.coverImage} alt="" width={48} height={48} decoding="async" className="h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0 rounded-2xl object-cover border border-amber-200 shadow-sm" />
                  ) : (
                  <span className="text-2xl sm:text-3xl flex-shrink-0 p-1.5 bg-white rounded-2xl border border-amber-200 shadow-sm">{selectedBook.coverEmoji}</span>
                  )}
                  <div className="min-w-0">
                    <h3 className="text-base sm:text-lg font-black text-slate-900 truncate">{selectedBook.title}</h3>
                    <p className="text-xs sm:text-sm font-bold text-amber-800">
                      Page {activePage.pageNumber} of {selectedBook.pages.length}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
                  <div className="hidden sm:flex rounded-2xl border-2 border-amber-300 bg-white p-0.5">
                    <button
                      type="button"
                      onClick={() => setReadMode("to-me")}
                      className={`min-h-10 px-3 rounded-xl text-xs font-black ${readMode === "to-me" ? "bg-amber-400 text-amber-950" : "text-slate-600"}`}
                    >
                      Read to me
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setReadMode("myself");
                        stopSpeaking();
                        setReadAlongWordIndex(null);
                      }}
                      className={`min-h-10 px-3 rounded-xl text-xs font-black ${readMode === "myself" ? "bg-amber-400 text-amber-950" : "text-slate-600"}`}
                    >
                      I read
                    </button>
                  </div>
                  {/* Read to Me / Parent Voice Button */}
                  <button
                    onClick={() => handleReadAloud(spokenPageText(activePage))}
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
                  <div className={`flex-1 overflow-y-auto ${activePage.illustrationImage ? "" : "p-4 sm:p-8 grid md:grid-cols-5 gap-4 sm:gap-6 items-center"}`}>
                    {activePage.illustrationImage ? (
                      <motion.div
                        key={`page-spread-${activePage.pageNumber}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="relative min-h-64 sm:min-h-[22rem] w-full overflow-hidden bg-amber-100"
                      >
                        <img
                          src={activePage.illustrationImage}
                          alt=""
                          decoding="async"
                          fetchPriority="high"
                          className="absolute inset-0 h-full w-full object-cover"
                        />
                        {activePage.soundEffectText && (
                          <span className="absolute top-3 left-3 px-3.5 py-1 text-sm font-black uppercase rounded-full bg-amber-400 text-amber-950 shadow-md border-b-2 border-amber-600">
                            {activePage.soundEffectText}
                          </span>
                        )}
                      </motion.div>
                    ) : (
                    <motion.div
                      key={`page-illus-${activePage.pageNumber}`}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className={`md:col-span-3 w-full min-h-64 sm:min-h-80 py-10 sm:py-16 px-4 sm:px-6 rounded-[2rem] bg-gradient-to-br ${activePage.bgGradient} border-4 border-amber-200 flex flex-col items-center justify-center shadow-lg relative overflow-hidden`}
                    >
                      <div className="text-8xl sm:text-[9rem] mb-2 sm:mb-3 filter drop-shadow-md">
                        {activePage.illustration}
                      </div>
                      {activePage.soundEffectText && (
                        <span className="px-3.5 py-1 text-sm font-black uppercase rounded-full bg-amber-400 text-amber-950 shadow-md border-b-2 border-amber-600">
                          {activePage.soundEffectText}
                        </span>
                      )}
                    </motion.div>
                    )}

                    {/* Page Heading & Story Text */}
                    <div className={`max-w-xl space-y-2 sm:space-y-3 text-center md:text-left mx-auto md:mx-0 ${
                      activePage.illustrationImage ? "p-4 sm:p-6 w-full max-w-none" : "md:col-span-2"
                    }`}>
                      <h4 className="text-lg sm:text-2xl font-black text-amber-900 font-display">
                        {activePage.title}
                      </h4>
                      <StoryReadAloudText
                        text={activePage.text}
                        highlights={activePage.wordHighlights}
                        activeWordIndex={readAlongWordIndex}
                        onSpeakWord={(word) => speakText(word, { pitch: 1.18 })}
                      />

                      {/* Interactive Prompt Box for Parent / Child */}
                      <div className="p-3 sm:p-4 rounded-2xl bg-amber-200/70 border-2 border-amber-300 text-amber-950 text-xs sm:text-sm font-black flex items-center justify-center gap-2 shadow-sm">
                        <span>👉</span>
                        <span>{activePage.interactivePrompt}</span>
                      </div>

                      {activePage.learningInteraction && (() => {
                        const interaction = activePage.learningInteraction;
                        const answerKey = `${selectedBook.id}:${activePage.pageNumber}:${interaction.id}`;
                        const selectedAnswer = bookInteractionAnswers[answerKey];
                        const hintVisible = bookInteractionHints[answerKey] === true;
                        return (
                          <div className="rounded-2xl border-2 border-indigo-200 bg-indigo-50 p-4 text-left shadow-sm" aria-label="Picture book learning question">
                            <p className="mb-3 text-sm font-black text-indigo-950">{interaction.prompt}</p>
                            {interaction.hint && selectedAnswer === undefined && (
                              <div className="mb-3">
                                <button
                                  type="button"
                                  aria-expanded={hintVisible}
                                  onClick={() => setBookInteractionHints((hints) => ({ ...hints, [answerKey]: true }))}
                                  className="rounded-lg border border-indigo-200 bg-white px-3 py-1.5 text-xs font-bold text-indigo-800 hover:bg-indigo-100"
                                >
                                  {hintVisible ? "Clue" : "Need a clue?"}
                                </button>
                                {hintVisible && <p className="mt-2 text-sm font-semibold text-indigo-800" role="note">{interaction.hint}</p>}
                              </div>
                            )}
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
                              <div className={`mt-3 text-sm font-bold ${selectedAnswer === interaction.correctOptionIndex ? "text-emerald-800" : "text-rose-800"}`} role="status">
                                <p>{selectedAnswer === interaction.correctOptionIndex
                                  ? activeGeneratedStoryBlueprint?.feedback.correct ?? "That’s right! Great thinking!"
                                  : `${activeGeneratedStoryBlueprint?.feedback.incorrect ?? "Good try!"} The answer is ${interaction.options[interaction.correctOptionIndex]}.`}</p>
                                {interaction.explanation && <p className="mt-1 font-semibold">{interaction.explanation}</p>}
                              </div>
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
                      className="flex items-center gap-1 sm:gap-1.5 min-h-16 px-4 sm:px-5 py-2 sm:py-2.5 rounded-2xl bg-white border-b-4 border-slate-300 hover:bg-slate-50 disabled:opacity-30 disabled:pointer-events-none font-black text-sm text-slate-800 transition-all cursor-pointer shadow-md active:translate-y-1"
                    >
                      <ChevronLeft size={16} /> <span className="hidden sm:inline">Back</span>
                    </button>

                    <p className="font-black text-amber-900 text-sm sm:text-base">
                      {currentPageIndex + 1} / {selectedBook.pages.length}
                    </p>

                    <button
                      onClick={handleNextPage}
                      className="flex items-center gap-1 sm:gap-1.5 min-h-16 px-5 sm:px-7 py-2 sm:py-2.5 rounded-2xl bg-gradient-to-b from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 font-black text-sm text-amber-950 border-b-4 border-orange-700 shadow-lg transition-all active:translate-y-1 cursor-pointer"
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
                          speakPrintedPage(selectedBook.pages[0]);
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
