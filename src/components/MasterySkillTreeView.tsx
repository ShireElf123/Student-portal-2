import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Compass,
  Trophy,
  Star,
  Lock,
  CheckCircle2,
  Sparkles,
  HelpCircle,
  Brain,
  Printer,
  XCircle,
  ArrowRight,
  Flame,
  Award,
  Zap,
  Play,
  RotateCcw,
  X,
  Target,
} from "lucide-react";
import {
  CURRICULUM_SKILL_NODES,
  CURRICULUM_DOMAINS,
  SkillNode,
  CurriculumDomain,
  GradeLevelBand,
} from "../data/curriculumUniverse";
import { soundEffects } from "../utils/soundEffects";
import {
  getGamificationState,
  awardXP,
  awardGems,
  triggerCelebrationConfetti,
} from "../utils/gamification";
import {
  recordMistake,
  getDueMistakesCount,
  recordLearningEvent,
  getLearnerModel,
  subscribeLearnerModel,
  RecommendedAction,
  LearnerModel,
} from "../utils/pedagogicalEngine";
import { getActiveLearnerId } from "../utils/learnerBrain";
import {
  CURRICULUM_PROFILES,
  formatStandardReference,
  getActiveCurriculumProfileId,
  setActiveCurriculumProfileId,
  subscribeCurriculumProfile,
} from "../data/curriculumProfiles";
import { MistakeReviewVaultModal } from "./MistakeReviewVaultModal";
import { DiagnosticPlacementModal } from "./DiagnosticPlacementModal";
import { PrintableWorksheetGenerator } from "./PrintableWorksheetGenerator";

/**
 * Mastery and unlocks derive exclusively from learner-model evidence tiers.
 * No seeded badges and no isolated localStorage flags: a node shows
 * "Mastered" only when the learner brain holds tier "master" for it, and a
 * node unlocks when every prerequisite has practitioner-level evidence.
 */
function getNodeTier(model: LearnerModel, nodeId: string): string {
  return model.skillMastery[nodeId]?.tier || "locked";
}

function isNodeMastered(model: LearnerModel, nodeId: string): boolean {
  return getNodeTier(model, nodeId) === "master";
}

function isNodeUnlocked(model: LearnerModel, node: SkillNode): boolean {
  if (node.prerequisites.length === 0) return true;
  return node.prerequisites.every((prereq) => {
    const tier = getNodeTier(model, prereq);
    return tier === "practitioner" || tier === "master";
  });
}

interface MasterySkillTreeViewProps {
  onNavigateTab: (tab: any) => void;
  recommendedNodeId?: string;
  onRecommendationConsumed?: () => void;
}

export function MasterySkillTreeView({ onNavigateTab, recommendedNodeId, onRecommendationConsumed }: MasterySkillTreeViewProps) {
  const [selectedDomain, setSelectedDomain] = useState<CurriculumDomain | "all">("all");
  const [selectedGrade, setSelectedGrade] = useState<GradeLevelBand | "all">("all");

  const [activeModalNode, setActiveModalNode] = useState<SkillNode | null>(null);
  const [isPracticingNode, setIsPracticingNode] = useState(false);
  const [questionIdx, setQuestionIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [hintLevel, setHintLevel] = useState<number>(0);
  const [correctCount, setCorrectCount] = useState(0);

  // Modal helpers
  const [isMistakeModalOpen, setIsMistakeModalOpen] = useState(false);
  const [isDiagnosticModalOpen, setIsDiagnosticModalOpen] = useState(false);
  const [isWorksheetModalOpen, setIsWorksheetModalOpen] = useState(false);
  const [dueMistakes, setDueMistakes] = useState(getDueMistakesCount());
  const [learnerModel, setLearnerModel] = useState(getLearnerModel);
  const [curriculumProfileId, setCurriculumProfileId] = useState(getActiveCurriculumProfileId);

  useEffect(() => {
    return subscribeLearnerModel(setLearnerModel);
  }, []);

  useEffect(() => {
    return subscribeCurriculumProfile(setCurriculumProfileId);
  }, []);

  useEffect(() => {
    const handleUpdate = () => setDueMistakes(getDueMistakesCount());
    window.addEventListener("mistake_vault_updated", handleUpdate);
    return () => window.removeEventListener("mistake_vault_updated", handleUpdate);
  }, []);

  const handleOpenNode = (node: SkillNode) => {
    // Prerequisite gating follows learner-model evidence, not local flags.
    if (!isNodeUnlocked(learnerModel, node)) {
      soundEffects.playGentleBoing();
      return;
    }

    soundEffects.playPop();
    setActiveModalNode(node);
    setIsPracticingNode(false);
    setQuestionIdx(0);
    setSelectedAnswer(null);
    setHintLevel(0);
    setCorrectCount(0);
  };

  useEffect(() => {
    if (!recommendedNodeId) return;
    const recommendedNode = CURRICULUM_SKILL_NODES.find((node) => node.id === recommendedNodeId);
    if (!recommendedNode) {
      onRecommendationConsumed?.();
      return;
    }
    setSelectedDomain(recommendedNode.domain);
    // If the recommended level is gated, start at the nearest unmet prerequisite
    // instead of dropping the learner onto a locked activity.
    let launchNode = recommendedNode;
    let guard = 0;
    const refreshedModel = getLearnerModel();
    while (!isNodeUnlocked(refreshedModel, launchNode) && guard < 8) {
      const prerequisite = CURRICULUM_SKILL_NODES.find((node) => node.id === launchNode.prerequisites[0]);
      if (!prerequisite) break;
      launchNode = prerequisite;
      guard += 1;
    }
    setSelectedGrade(launchNode.gradeBand);
    handleOpenNode(launchNode);
    onRecommendationConsumed?.();
    // This is an intentional one-time response to a new route recommendation.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recommendedNodeId]);

  const handleStartPractice = () => {
    setIsPracticingNode(true);
    setQuestionIdx(0);
    setSelectedAnswer(null);
    setHintLevel(0);
    setCorrectCount(0);
    soundEffects.playSuccessChime();
  };

  const handleSelectAnswer = (optIdx: number) => {
    if (!activeModalNode || selectedAnswer !== null) return;
    setSelectedAnswer(optIdx);

    const currentQ = activeModalNode.questions[questionIdx];
    const isCorrect = optIdx === currentQ.correctAnswerIndex;

    if (isCorrect) {
      soundEffects.playPop();
      setCorrectCount((prev) => prev + 1);
    } else {
      soundEffects.playGentleBoing();
      // Record mistake to spaced repetition engine!
      recordMistake({
        questionId: currentQ.id,
        skillId: activeModalNode.id,
        domain: activeModalNode.domain,
        topic: activeModalNode.title,
        question: currentQ.question,
        options: currentQ.options,
        correctAnswerIndex: currentQ.correctAnswerIndex,
        selectedAnswerIndex: optIdx,
        explanation: currentQ.explanation,
        hintLevel1: currentQ.hintLevel1,
        hintLevel2: currentQ.hintLevel2,
        hintLevel3: currentQ.hintLevel3,
      });
      setDueMistakes(getDueMistakesCount());
      // Step up hint ladder automatically
      setHintLevel((prev) => Math.min(3, prev + 1));
    }

    const tierBeforeResponse = getNodeTier(getLearnerModel(), activeModalNode.id);
    try {
      recordLearningEvent({
        learnerId: getActiveLearnerId(),
        activityId: "curriculum-skill-practice",
        experienceId: "curriculum-skill-tree",
        contentId: `${activeModalNode.id}:${currentQ.id}`,
        eventType: "question_answered",
        activityType: "curriculum-quiz",
        activityTitle: `${activeModalNode.title}: Question ${questionIdx + 1}`,
        skillId: activeModalNode.id,
        domain: activeModalNode.domain,
        gradeBand: activeModalNode.gradeBand,
        result: isCorrect ? "success" : "struggle",
        score: isCorrect ? 100 : 0,
        difficulty: "medium",
        attempts: 1,
        hintsUsed: hintLevel,
      });
      const tierAfterResponse = getNodeTier(getLearnerModel(), activeModalNode.id);
      if (tierBeforeResponse !== "master" && tierAfterResponse === "master") {
        awardGems(activeModalNode.starsReward);
        triggerCelebrationConfetti();
        soundEffects.playFanfare();
      }
    } catch (error) {
      console.error("Failed to record curriculum question evidence:", error);
    }
  };

  const handleNextQuestion = () => {
    if (!activeModalNode) return;

    if (questionIdx < activeModalNode.questions.length - 1) {
      setQuestionIdx((prev) => prev + 1);
      setSelectedAnswer(null);
      setHintLevel(0);
    } else {
      // Completed node! Practice always earns score-scaled XP; the crown,
      // gems and fanfare arrive only when learner-model evidence actually
      // flips the skill tier to master.
      const total = activeModalNode.questions.length;
      const finalCorrect = correctCount + (selectedAnswer === activeModalNode.questions[questionIdx].correctAnswerIndex ? 1 : 0);
      const accuracy = total > 0 ? finalCorrect / total : 0;
      try {
        recordLearningEvent({
          learnerId: getActiveLearnerId(),
          activityId: "curriculum-skill-practice",
          experienceId: "curriculum-skill-tree",
          contentId: `completed-session:${activeModalNode.id}:${Date.now()}`,
          eventType: "session_summary",
          activityType: "curriculum-quiz",
          activityTitle: `${activeModalNode.title} Mastery Quest Completed`,
          skillId: activeModalNode.id,
          domain: activeModalNode.domain,
          gradeBand: activeModalNode.gradeBand,
          result: "explored",
          score: Math.round(accuracy * 100),
          difficulty: "medium",
          attempts: total,
          hintsUsed: 0,
        });
      } catch (error) {
        console.error("Failed to record curriculum session summary:", error);
      }

      awardXP(Math.max(10, Math.round(activeModalNode.xpReward * accuracy)), `${activeModalNode.title} Quest`);
      if (accuracy >= 0.8) {
        soundEffects.playSuccessChime();
      } else {
        soundEffects.playGentleBoing();
      }

      setIsPracticingNode(false);
      setActiveModalNode(null);
    }
  };

  // Filter nodes
  const filteredNodes = CURRICULUM_SKILL_NODES.filter((n) => {
    if (selectedDomain !== "all" && n.domain !== selectedDomain) return false;
    if (selectedGrade !== "all" && n.gradeBand !== selectedGrade) return false;
    return true;
  });

  const masteredCount = CURRICULUM_SKILL_NODES.filter((n) =>
    isNodeMastered(learnerModel, n.id)
  ).length;
  const overallMasteryPct = Math.round(
    (masteredCount / CURRICULUM_SKILL_NODES.length) * 100
  );
  const activeProfileRef = formatStandardReference(
    CURRICULUM_SKILL_NODES[0],
    curriculumProfileId
  ).profile;

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 space-y-6 max-w-7xl mx-auto w-full">
      {/* Top Banner & Quick Toolbars */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-wider mb-1">
            <Compass size={16} />
            <span>K-5 Curriculum Constellation</span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight">
            Primary Mastery Skill Tree
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 font-medium max-w-xl">
            Complete sequential learning paths, earn gold mastery crowns, and conquer past errors in your spaced-repetition review bag.
          </p>
        </div>

        {/* Global Action Tools */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Review Bag Button */}
          <button
            onClick={() => setIsMistakeModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer relative shadow-sm"
          >
            <Brain size={16} />
            <span>Review Bag</span>
            {dueMistakes > 0 && (
              <span className="w-5 h-5 rounded-full bg-rose-500 text-white text-[11px] font-black flex items-center justify-center animate-pulse">
                {dueMistakes}
              </span>
            )}
          </button>

          {/* Diagnostic Quest Button */}
          <button
            onClick={() => setIsDiagnosticModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer shadow-sm"
          >
            <Target size={16} />
            <span>Diagnostic Quest</span>
          </button>

          {/* Printable Worksheet Button */}
          <button
            onClick={() => setIsWorksheetModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer shadow-sm"
          >
            <Printer size={16} />
            <span>Print Worksheet</span>
          </button>
        </div>
      </div>

      {/* Mastery Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-md">
        <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
          <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider block">
            Overall Mastery
          </span>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xl sm:text-2xl font-black text-emerald-400">
              {overallMasteryPct}%
            </span>
            <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${overallMasteryPct}%` }}
              />
            </div>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
          <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider block">
            Mastered Nodes
          </span>
          <p className="text-xl sm:text-2xl font-black text-amber-400 mt-1 flex items-center gap-1.5">
            <Trophy size={18} />
            {masteredCount} / {CURRICULUM_SKILL_NODES.length}
          </p>
        </div>

        <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
          <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider block">
            Curriculum Domains
          </span>
          <p className="text-xl sm:text-2xl font-black text-blue-400 mt-1">
            4 Focus Tracks
          </p>
        </div>

        <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
          <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider block">
            Curriculum Lens
          </span>
          <p className="text-base sm:text-lg font-black text-purple-400 mt-1 leading-tight" title={activeProfileRef.description}>
            {activeProfileRef.label}
          </p>
          <label className="mt-2 block">
            <span className="sr-only">Choose a curriculum profile</span>
            <select
              value={curriculumProfileId}
              onChange={(event) => setActiveCurriculumProfileId(event.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-900 px-2 py-1.5 text-xs font-bold text-white focus:outline-none focus:border-purple-400"
            >
              {CURRICULUM_PROFILES.map((profile) => (
                <option key={profile.id} value={profile.id}>
                  {profile.label}{profile.verifiedMapping ? "" : " (mapping unverified)"}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {/* Learner Brain Recommended Next Action */}
      {learnerModel.recommendedNext.length > 0 && (
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-indigo-950/70 via-purple-950/70 to-slate-900 border border-indigo-500/40 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shrink-0 shadow-md">
              <Brain size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {learnerModel.recommendedNext[0].badge}
                </span>
                <span className="text-xs text-slate-400 font-bold">• Unified Learning Brain Suggestion</span>
              </div>
              <h3 className="text-sm sm:text-base font-black text-white mt-0.5">
                {learnerModel.recommendedNext[0].title}
              </h3>
              <p className="text-xs text-slate-300 mt-0.5 font-medium">
                {learnerModel.recommendedNext[0].reason}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              const rec = learnerModel.recommendedNext[0];
              if (rec.nodeId) {
                const node = CURRICULUM_SKILL_NODES.find((n) => n.id === rec.nodeId);
                if (node) {
                  handleOpenNode(node);
                  return;
                }
              }
              onNavigateTab(rec.targetTab);
            }}
            className="shrink-0 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-black text-xs transition-all cursor-pointer shadow-md inline-flex items-center gap-2"
          >
            <span>Start Recommended Step</span>
            <ArrowRight size={14} />
          </button>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="space-y-3">
        {/* Domain Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setSelectedDomain("all")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black shrink-0 transition-all cursor-pointer ${
              selectedDomain === "all"
                ? "bg-white text-slate-950 shadow-sm"
                : "bg-slate-800/80 text-slate-400 hover:text-white"
            }`}
          >
            All Tracks ({CURRICULUM_SKILL_NODES.length})
          </button>
          {CURRICULUM_DOMAINS.map((dom) => (
            <button
              key={dom.id}
              onClick={() => setSelectedDomain(dom.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold shrink-0 flex items-center gap-1.5 transition-all cursor-pointer ${
                selectedDomain === dom.id
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "bg-slate-800/80 text-slate-400 hover:text-white"
              }`}
            >
              <span>{dom.emoji}</span>
              <span>{dom.label}</span>
            </button>
          ))}
        </div>

        {/* Grade Filter Pills */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500 font-bold uppercase text-[11px]">Grade Band:</span>
          {(["all", "K-1", "2-3", "4-5"] as const).map((gb) => (
            <button
              key={gb}
              onClick={() => setSelectedGrade(gb)}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                selectedGrade === gb
                  ? "bg-slate-700 text-white"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {gb === "all" ? "All Grades" : `Grades ${gb}`}
            </button>
          ))}
        </div>
      </div>

      {/* Skill Constellation Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
        {filteredNodes.map((node, idx) => {
          const isMastered = isNodeMastered(learnerModel, node.id);
          const isUnlocked = isNodeUnlocked(learnerModel, node);
          const standardRef = formatStandardReference(node, curriculumProfileId);

          return (
            <motion.div
              key={node.id}
              whileHover={isUnlocked ? { scale: 1.02 } : {}}
              onClick={() => handleOpenNode(node)}
              className={`p-5 rounded-3xl border-2 transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between shadow-md ${
                isMastered
                  ? "bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950/30 border-amber-400/80 hover:border-amber-400"
                  : isUnlocked
                  ? "bg-slate-900/90 border-slate-700 hover:border-indigo-400"
                  : "bg-slate-950/60 border-slate-800/80 opacity-60 cursor-not-allowed"
              }`}
            >
              {/* Header inside Card */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl p-2 rounded-2xl bg-slate-800/80 border border-slate-700">
                      {node.iconEmoji}
                    </span>
                    <div>
                      {standardRef.code ? (
                        <span className="text-[10px] font-mono font-bold text-slate-400 uppercase block">
                          {standardRef.code}
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-slate-400 block" title={standardRef.profile.description}>
                          {standardRef.verified ? "Global learning goal" : `${standardRef.profile.authority} · mapping unverified`}
                        </span>
                      )}
                      <span className="text-xs font-bold text-indigo-300">
                        Grades {node.gradeBand}
                      </span>
                    </div>
                  </div>

                  {isMastered ? (
                    <div className="px-2.5 py-1 rounded-full bg-amber-500/20 border border-amber-400/50 text-amber-300 text-xs font-black flex items-center gap-1 shadow-sm">
                      <Trophy size={13} />
                      <span>Mastered</span>
                    </div>
                  ) : isUnlocked ? (
                    <div className="px-2.5 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/40 text-indigo-300 text-xs font-bold flex items-center gap-1">
                      <Play size={11} />
                      <span>Ready</span>
                    </div>
                  ) : (
                    <div className="px-2.5 py-1 rounded-full bg-slate-800 text-slate-500 text-xs font-bold flex items-center gap-1">
                      <Lock size={12} />
                      <span>Locked</span>
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="text-base font-black text-white leading-snug">
                    {node.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {node.description}
                  </p>
                </div>
              </div>

              {/* Card Footer */}
              <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-slate-400 font-medium flex items-center gap-1">
                  <Sparkles size={14} className="text-amber-400" /> +{node.xpReward} XP
                </span>
                <span className="text-slate-400 font-medium flex items-center gap-1">
                  ⭐ +{node.starsReward} Stars
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Interactive Node Quest Modal */}
      {activeModalNode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md">
          <div className="w-full max-w-2xl bg-[#0f172a] border border-slate-700 rounded-3xl p-5 sm:p-8 shadow-2xl flex flex-col max-h-[92vh] overflow-hidden animate-in zoom-in-95">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 shrink-0">
              <div className="flex items-center gap-3">
                <span className="text-3xl p-2.5 rounded-2xl bg-slate-800 border border-slate-700">
                  {activeModalNode.iconEmoji}
                </span>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    {(() => {
                      const modalRef = formatStandardReference(activeModalNode, curriculumProfileId);
                      return modalRef.code ? (
                        <span className="text-xs font-mono font-bold text-indigo-400 uppercase">
                          {modalRef.code}
                        </span>
                      ) : (
                        <span className="text-xs font-bold text-indigo-300" title={modalRef.profile.description}>
                          {modalRef.verified ? "Global learning goal" : `${modalRef.profile.authority} · mapping unverified`}
                        </span>
                      );
                    })()}
                    <span className="text-xs text-slate-400 font-bold">
                      • Grade {activeModalNode.gradeBand}
                    </span>
                  </div>
                  <h2 className="text-base sm:text-xl font-black text-white">
                    {activeModalNode.title}
                  </h2>
                </div>
              </div>
              <button
                onClick={() => setActiveModalNode(null)}
                className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto py-5 space-y-5">
              {!isPracticingNode ? (
                /* Node Overview Screen */
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                    <span className="text-xs font-black uppercase text-indigo-400 tracking-wider">
                      Learning Objective
                    </span>
                    <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
                      {activeModalNode.description}
                    </p>
                  </div>

                  {/* Real World Mission Card */}
                  <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black uppercase text-emerald-400 tracking-wider flex items-center gap-1.5">
                        <Sparkles size={14} /> Screen-Free Real-World Mission
                      </span>
                      {activeModalNode.realWorldMission.materialNeeded && (
                        <span className="text-[11px] text-emerald-300 font-bold">
                          Needs: {activeModalNode.realWorldMission.materialNeeded}
                        </span>
                      )}
                    </div>
                    <p className="text-xs sm:text-sm font-bold text-white">
                      {activeModalNode.realWorldMission.title}
                    </p>
                    <p className="text-xs text-slate-300">
                      {activeModalNode.realWorldMission.description}
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs text-slate-400 font-bold">
                    <span>Target Challenges: {activeModalNode.questions.length} questions</span>
                    <span>Reward: up to +{activeModalNode.xpReward} XP · 👑 crown when mastery evidence is earned</span>
                  </div>
                </div>
              ) : (
                /* Interactive In-Node Quiz with 3-Step Hint Ladder */
                <div className="space-y-4">
                  {/* Progress Header */}
                  <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
                    <span>
                      Challenge {questionIdx + 1} of {activeModalNode.questions.length}
                    </span>
                    <span className="text-emerald-400 font-bold">
                      Correct: {correctCount}
                    </span>
                  </div>

                  {/* Question Box */}
                  <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                    <p className="text-base sm:text-lg font-bold text-white leading-relaxed">
                      {activeModalNode.questions[questionIdx].question}
                    </p>
                  </div>

                  {/* 3-Step Hint Ladder */}
                  <div className="p-3.5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black uppercase text-indigo-300 tracking-wider flex items-center gap-1.5">
                        <HelpCircle size={14} /> 3-Step Hint Ladder (Step {hintLevel} of 3)
                      </span>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3].map((lvl) => (
                          <button
                            key={lvl}
                            onClick={() => setHintLevel(lvl)}
                            className={`w-6 h-6 rounded-lg text-xs font-black transition-all ${
                              hintLevel >= lvl
                                ? "bg-indigo-600 text-white"
                                : "bg-slate-800 text-slate-400 hover:text-white"
                            }`}
                          >
                            {lvl}
                          </button>
                        ))}
                      </div>
                    </div>

                    {hintLevel === 0 && (
                      <p className="text-xs text-slate-400">
                        Try reasoning first! Tap <strong>Step 1</strong> if you want a subtle nudge.
                      </p>
                    )}
                    {hintLevel === 1 && (
                      <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200">
                        <strong>💡 Step 1 (Nudge): </strong>
                        {activeModalNode.questions[questionIdx].hintLevel1}
                      </div>
                    )}
                    {hintLevel === 2 && (
                      <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/30 text-xs text-blue-200 space-y-1">
                        <strong>🔍 Step 2 (Visual Scaffold): </strong>
                        <p>{activeModalNode.questions[questionIdx].hintLevel2}</p>
                        <p className="text-[11px] text-blue-300 italic">Distractor options crossed out below.</p>
                      </div>
                    )}
                    {hintLevel === 3 && (
                      <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-200">
                        <strong>📘 Step 3 (Worked Model): </strong>
                        {activeModalNode.questions[questionIdx].hintLevel3}
                      </div>
                    )}
                  </div>

                  {/* Options */}
                  <div className="space-y-2.5">
                    {activeModalNode.questions[questionIdx].options.map((opt, oIdx) => {
                      const isSelected = selectedAnswer === oIdx;
                      const isCorrect =
                        oIdx === activeModalNode.questions[questionIdx].correctAnswerIndex;
                      const isEliminated =
                        hintLevel >= 2 &&
                        activeModalNode.questions[questionIdx].eliminatedOptionIndices?.includes(oIdx);

                      let style = "bg-slate-900 border-slate-700/80 text-white hover:border-slate-500";
                      if (selectedAnswer !== null) {
                        if (isCorrect) {
                          style = "bg-emerald-500/20 border-emerald-500 text-emerald-200";
                        } else if (isSelected) {
                          style = "bg-rose-500/20 border-rose-500 text-rose-200";
                        } else {
                          style = "bg-slate-900/40 border-slate-800 text-slate-600";
                        }
                      } else if (isEliminated) {
                        style = "bg-slate-950/40 border-slate-900 text-slate-600 opacity-40 line-through";
                      }

                      return (
                        <button
                          key={oIdx}
                          disabled={selectedAnswer !== null}
                          onClick={() => handleSelectAnswer(oIdx)}
                          className={`w-full p-4 rounded-xl border text-left text-xs sm:text-sm font-bold flex items-center justify-between gap-3 transition-all cursor-pointer ${style}`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="w-7 h-7 rounded-lg bg-slate-800 text-slate-300 border border-slate-700 flex items-center justify-center text-xs font-black">
                              {String.fromCharCode(65 + oIdx)}
                            </span>
                            <span>{opt}</span>
                          </div>
                          {selectedAnswer !== null && isCorrect && (
                            <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
                          )}
                          {selectedAnswer !== null && isSelected && !isCorrect && (
                            <XCircle size={18} className="text-rose-400 shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Explanation */}
                  {selectedAnswer !== null && (
                    <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-700 text-xs sm:text-sm text-slate-200 space-y-1 animate-in fade-in">
                      <span className="font-bold text-emerald-400 block uppercase tracking-wider text-xs">
                        Pedagogical Breakdown
                      </span>
                      <p>{activeModalNode.questions[questionIdx].explanation}</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer Buttons */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between shrink-0">
              {!isPracticingNode ? (
                <>
                  <button
                    onClick={() => setIsWorksheetModalOpen(true)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white flex items-center gap-2 cursor-pointer"
                  >
                    <Printer size={15} />
                    <span>Print Worksheet</span>
                  </button>

                  <button
                    onClick={handleStartPractice}
                    className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition-all cursor-pointer active:scale-95"
                  >
                    <span>Start Skill Quest</span>
                    <ArrowRight size={16} />
                  </button>
                </>
              ) : (
                <div className="w-full flex justify-end">
                  {selectedAnswer !== null && (
                    <button
                      onClick={handleNextQuestion}
                      className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition-all cursor-pointer active:scale-95"
                    >
                      <span>
                        {questionIdx < activeModalNode.questions.length - 1
                          ? "Next Question"
                          : "Finish Skill Quest"}
                      </span>
                      <ArrowRight size={16} />
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Review Bag Modal */}
      <MistakeReviewVaultModal
        isOpen={isMistakeModalOpen}
        onClose={() => setIsMistakeModalOpen(false)}
      />

      {/* Diagnostic Placement Quest Modal */}
      <DiagnosticPlacementModal
        isOpen={isDiagnosticModalOpen}
        onClose={() => setIsDiagnosticModalOpen(false)}
        onApplyRecommendation={(nodeId) => {
          const match = CURRICULUM_SKILL_NODES.find((node) => node.id === nodeId);
          if (!match) return;
          let launchNode = match;
          let guard = 0;
          const refreshedModel = getLearnerModel();
          while (!isNodeUnlocked(refreshedModel, launchNode) && guard < 8) {
            const prerequisite = CURRICULUM_SKILL_NODES.find((node) => node.id === launchNode.prerequisites[0]);
            if (!prerequisite) break;
            launchNode = prerequisite;
            guard += 1;
          }
          setSelectedDomain(launchNode.domain);
          setSelectedGrade(launchNode.gradeBand);
          handleOpenNode(launchNode);
        }}
      />

      {/* Printable Worksheet Modal */}
      <PrintableWorksheetGenerator
        isOpen={isWorksheetModalOpen}
        onClose={() => setIsWorksheetModalOpen(false)}
        preselectedDomain={selectedDomain === "all" ? "math" : selectedDomain}
        preselectedGrade={selectedGrade === "all" ? "2-3" : selectedGrade}
      />
    </div>
  );
}
