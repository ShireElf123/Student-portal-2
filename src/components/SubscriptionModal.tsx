import React, { useState, useEffect } from "react";
import {
  X,
  Sparkles,
  Check,
  Shield,
  Zap,
  Users,
  GraduationCap,
  Clock,
  ArrowRight,
  RotateCcw,
} from "lucide-react";
import { AIUsageStats, SubscriptionTier } from "../types";
import {
  getUsageStats,
  setSubscriptionTier,
  resetDailyUsage,
  subscribeToAIUsage,
  TIER_LABELS,
  TIER_LIMITS,
} from "../services/aiUsageService";

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser?: any;
  onSelectRole?: (role: "student" | "parent" | "teacher" | "tutor") => void;
}

export function SubscriptionModal({
  isOpen,
  onClose,
  currentUser,
  onSelectRole,
}: SubscriptionModalProps) {
  const [stats, setStats] = useState<AIUsageStats>(getUsageStats());
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    return subscribeToAIUsage((newStats) => {
      setStats(newStats);
    });
  }, []);

  if (!isOpen) return null;

  const usagePercent = Math.min(
    100,
    Math.round((stats.usedToday / Math.max(1, stats.dailyLimit)) * 100)
  );

  const handleSelectTier = (tier: SubscriptionTier) => {
    setSubscriptionTier(tier);
    setSuccessMessage(`Switched to ${TIER_LABELS[tier]}! Daily quota updated.`);
    setTimeout(() => {
      setSuccessMessage(null);
    }, 3000);
  };

  const handleResetUsage = () => {
    resetDailyUsage();
    setSuccessMessage("AI operations counter has been reset to 0!");
    setTimeout(() => {
      setSuccessMessage(null);
    }, 3500);
  };

  const PLANS = [
    {
      id: "free_trial" as SubscriptionTier,
      name: "Academic Trial",
      price: "Free",
      period: "14 days",
      dailyLimit: TIER_LIMITS.free_trial,
      description: "Introductory access for personal academic exploration.",
      icon: <Clock className="w-5 h-5 text-indigo-400" />,
      features: [
        "20 AI tutor queries / day",
        "Socratic & Writing tutor modes",
        "Personal study plan generator",
        "Single student workspace",
      ],
      recommendedFor: "student",
    },
    {
      id: "student_pro" as SubscriptionTier,
      name: "Student Pro",
      price: "$9.99",
      period: "/ month",
      dailyLimit: TIER_LIMITS.student_pro,
      description: "High-yield power workspace for ambitious scholars.",
      icon: <Zap className="w-5 h-5 text-amber-400" />,
      badge: "Popular",
      features: [
        "150 AI tutor queries / day",
        "All 5 Academic Modes (STEM, Solve)",
        "Priority SSE streaming responses",
        "Unlimited practice sessions & flashcards",
        "Exportable markdown study guides",
      ],
      recommendedFor: "student",
    },
    {
      id: "family_basic" as SubscriptionTier,
      name: "Family & Homeschool",
      price: "$19.99",
      period: "/ month",
      dailyLimit: TIER_LIMITS.family_basic,
      description: "Supportive oversight and AI insights for parents and homeschoolers.",
      icon: <Users className="w-5 h-5 text-emerald-400" />,
      features: [
        "200 AI operations / day",
        "Multi-child account linking & switching",
        "Parent AI Discussion Starters",
        "Subject Mastery & Progress Matrix",
        "Homework & assignment tracking",
      ],
      recommendedFor: "parent",
    },
    {
      id: "educator_plus" as SubscriptionTier,
      name: "Educator Plus",
      price: "$29.99",
      period: "/ month",
      dailyLimit: TIER_LIMITS.educator_plus,
      description: "Full classroom management suite for instructors and schools.",
      icon: <GraduationCap className="w-5 h-5 text-purple-400" />,
      features: [
        "300 AI queries / day",
        "Unlimited classrooms & join codes",
        "Bulk assignment distribution & auto-rubric",
        "Student submission grading & feedback",
        "Integrated office hours direct messaging",
      ],
      recommendedFor: "teacher",
    },
  ];

  return (
    <div
      id="subscription-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto"
    >
      <div
        id="subscription-modal-card"
        className="relative w-full max-w-4xl bg-[#12131a] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl my-8 max-h-[90vh] overflow-y-auto"
      >
        {/* Close button */}
        <button
          id="close-subscription-modal-btn"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-white/50 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className="space-y-2 mb-6">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 text-xs font-semibold rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center gap-1.5">
              <Sparkles size={12} />
              AI Usage & Subscription Architecture
            </span>
            {stats.status === "trialing" && (
              <span className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                {stats.trialDaysRemaining} days left in trial
              </span>
            )}
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Plans & Quota Management
          </h2>
          <p className="text-sm text-white/60">
            Control your AI daily allowance, explore role capabilities, and test different subscription tiers in real time.
          </p>
        </div>

        {/* Daily Usage Monitor Bar */}
        <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 mb-8 space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm font-medium">
            <span className="text-white/80">
              Today's AI Operations:{" "}
              <strong className="text-white">{stats.usedToday}</strong> of{" "}
              <strong className="text-indigo-400">{stats.dailyLimit}</strong> used
            </span>
            <div className="flex items-center gap-3">
              <span className="text-white/50 text-xs">
                {stats.remaining} remaining today • Resets at midnight
              </span>
              <button
                onClick={handleResetUsage}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-indigo-300 hover:text-white bg-indigo-500/10 hover:bg-indigo-500/25 border border-indigo-500/30 rounded-lg transition-colors cursor-pointer"
                title="Reset daily usage counter back to 0"
              >
                <RotateCcw size={12} />
                <span>Reset Tokens</span>
              </button>
            </div>
          </div>
          <div className="w-full h-2.5 rounded-full bg-white/10 overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                usagePercent > 90
                  ? "bg-rose-500"
                  : usagePercent > 70
                  ? "bg-amber-500"
                  : "bg-indigo-500"
              }`}
              style={{ width: `${usagePercent}%` }}
            />
          </div>
          {successMessage && (
            <p className="text-xs text-emerald-400 font-medium pt-1 animate-pulse">
              ✓ {successMessage}
            </p>
          )}
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {PLANS.map((plan) => {
            const isCurrent = stats.tier === plan.id;
            return (
              <div
                key={plan.id}
                className={`relative flex flex-col justify-between p-5 rounded-xl border transition-all ${
                  isCurrent
                    ? "bg-indigo-950/20 border-indigo-500/60 shadow-lg shadow-indigo-950/40 ring-1 ring-indigo-500/30"
                    : "bg-white/[0.02] border-white/10 hover:border-white/20"
                }`}
              >
                {plan.badge && (
                  <span className="absolute -top-2.5 right-3 px-2 py-0.5 text-[10px] font-bold rounded-full bg-indigo-500 text-white uppercase tracking-wider shadow">
                    {plan.badge}
                  </span>
                )}

                <div>
                  <div className="p-2 w-fit rounded-lg bg-white/5 mb-3">
                    {plan.icon}
                  </div>
                  <h3 className="text-base font-bold text-white mb-1">
                    {plan.name}
                  </h3>
                  <div className="flex items-baseline gap-1 mb-2">
                    <span className="text-2xl font-black text-white">
                      {plan.price}
                    </span>
                    <span className="text-xs text-white/40">{plan.period}</span>
                  </div>
                  <p className="text-xs text-white/60 mb-4 min-h-[32px]">
                    {plan.description}
                  </p>

                  <div className="border-t border-white/5 pt-3 mb-4 space-y-2">
                    {plan.features.map((feat, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-2 text-xs text-white/70"
                      >
                        <Check size={13} className="text-emerald-400 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-2">
                  {isCurrent ? (
                    <div className="w-full py-2 px-3 text-center text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                      Active Plan
                    </div>
                  ) : (
                    <button
                      id={`select-plan-${plan.id}`}
                      onClick={() => handleSelectTier(plan.id)}
                      className="w-full py-2 px-3 text-center text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors flex items-center justify-center gap-1"
                    >
                      Switch to Plan
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Role Quick Links Banner */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-950/40 via-purple-950/20 to-transparent border border-indigo-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-indigo-400 shrink-0" />
            <div>
              <p className="text-xs sm:text-sm font-semibold text-white">
                Multi-Role Experience Enabled
              </p>
              <p className="text-[11px] sm:text-xs text-white/60">
                You can switch between Student, Parent, Teacher, or Homeschool perspectives anytime in the app bar.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="shrink-0 px-4 py-2 text-xs font-medium text-white/80 hover:text-white bg-white/10 hover:bg-white/15 rounded-lg transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
