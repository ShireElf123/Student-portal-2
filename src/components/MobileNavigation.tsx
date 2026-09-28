import React, { useState, useEffect } from "react";
import {
  Home,
  Bot,
  Target,
  BookOpen,
  MoreHorizontal,
  CalendarCheck,
  BarChart3,
  GraduationCap,
  X,
  LogIn,
  LogOut,
  Cloud,
  User as UserIcon,
  Users,
  Brain,
  Zap,
  Volume2,
} from "lucide-react";
import { NavigationTab, UserRole, AIUsageStats, LearningStage } from "../types";
import { User } from "firebase/auth";
import {
  getUsageStats,
  subscribeToAIUsage,
  TIER_LABELS,
} from "../services/aiUsageService";
import { getActiveVoiceInfo, subscribeVoiceChange } from "../utils/speechUtils";

interface MobileNavigationProps {
  activeTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  userRole: UserRole;
  onSelectRole: (role: UserRole) => void;
  learningStage?: LearningStage;
  onSelectLearningStage?: (stage: LearningStage) => void;
  onOpenStartupGateway?: () => void;
  onOpenSubscriptionModal: () => void;
  onOpenVoiceSettings?: () => void;
  unreadTeacherMessagesCount?: number;
  openAssignmentsCount?: number;
  currentUser?: User | null;
  onSignIn?: () => void;
  onSignOut?: () => void;
  isSyncing?: boolean;
}

export function MobileNavigation({
  activeTab,
  onSelectTab,
  userRole,
  onSelectRole,
  learningStage = "primary",
  onSelectLearningStage,
  onOpenStartupGateway,
  onOpenSubscriptionModal,
  onOpenVoiceSettings,
  unreadTeacherMessagesCount = 0,
  openAssignmentsCount = 0,
  currentUser = null,
  onSignIn,
  onSignOut,
  isSyncing = false,
}: MobileNavigationProps) {
  const [showMore, setShowMore] = useState(false);
  const [usageStats, setUsageStats] = useState<AIUsageStats>(getUsageStats());
  const [voiceInfo, setVoiceInfo] = useState(getActiveVoiceInfo());

  useEffect(() => {
    const unsubUsage = subscribeToAIUsage((stats) => {
      setUsageStats(stats);
    });
    const unsubVoice = subscribeVoiceChange(() => {
      setVoiceInfo(getActiveVoiceInfo());
    });
    return () => {
      unsubUsage();
      unsubVoice();
    };
  }, []);

  if (learningStage === "toddler" || activeTab === "toddler") {
    return null;
  }

  const getMainTabs = (): { id: NavigationTab; label: string; icon: React.ReactNode }[] => {
    if (userRole === "parent") {
      return [
        { id: "parent", label: "Parent Hub", icon: <Users size={18} /> },
        { id: "homework", label: "Homework", icon: <BookOpen size={18} /> },
        { id: "progress", label: "Progress", icon: <BarChart3 size={18} /> },
        { id: "assessment", label: "Diagnostic", icon: <GraduationCap size={18} /> },
      ];
    }
    if (userRole === "tutor") {
      return [
        { id: "tutor-hub", label: "Homeschool", icon: <Brain size={18} /> },
        { id: "homework", label: "Homework", icon: <BookOpen size={18} /> },
        { id: "practice", label: "Drills", icon: <Target size={18} /> },
        { id: "assessment", label: "Assess", icon: <GraduationCap size={18} /> },
      ];
    }
    if (userRole === "teacher") {
      return [
        { id: "teacher", label: "Classroom", icon: <GraduationCap size={18} /> },
        { id: "homework", label: "Homework", icon: <BookOpen size={18} /> },
        { id: "progress", label: "Cohort", icon: <BarChart3 size={18} /> },
        { id: "assessment", label: "Assess", icon: <GraduationCap size={18} /> },
      ];
    }

    // Default: Primary Scholar Desk
    return [
      { id: "homework", label: "Homework Desk", icon: <BookOpen size={18} /> },
      { id: "tutor", label: "Socratic Tutor", icon: <Bot size={18} /> },
      { id: "practice", label: "Practice Quizzes", icon: <Target size={18} /> },
      { id: "notebooks", label: "Notes", icon: <BookOpen size={18} /> },
    ];
  };

  const getMoreTabs = (): {
    id: NavigationTab;
    label: string;
    sublabel: string;
    icon: React.ReactNode;
    badge?: number;
  }[] => {
    const list = [
      { id: "home" as NavigationTab, label: "Overview", sublabel: "Daily focus & announcements", icon: <Home size={18} /> },
      { id: "study-plan" as NavigationTab, label: "Daily Schedule", sublabel: "Task priorities & timer", icon: <CalendarCheck size={18} /> },
      { id: "primary-lab" as NavigationTab, label: "STEM Arcade", sublabel: "Interactive logic labs", icon: <Zap size={18} /> },
      { id: "assessment" as NavigationTab, label: "Diagnostic Check", sublabel: "Comprehension benchmarks", icon: <GraduationCap size={18} /> },
      { id: "progress" as NavigationTab, label: "Progress & Mastery", sublabel: "Accuracy & skills breakdown", icon: <BarChart3 size={18} /> },
      ...(userRole !== "student" ? [
        { id: "parent" as NavigationTab, label: "Parent Hub", sublabel: "Approvals & summaries", icon: <Users size={18} /> },
        { id: "tutor-hub" as NavigationTab, label: "Homeschool Hub", sublabel: "Curriculum pacing", icon: <Brain size={18} /> },
        {
          id: "teacher" as NavigationTab,
          label: "Teacher Class",
          sublabel: "Cohort assignments",
          icon: <GraduationCap size={18} />,
          badge:
            unreadTeacherMessagesCount + openAssignmentsCount > 0
              ? unreadTeacherMessagesCount + openAssignmentsCount
              : undefined,
        },
      ] : []),
    ];

    return list.filter((t) => !getMainTabs().some((m) => m.id === t.id));
  };

  const mainTabs = getMainTabs();
  const moreTabs = getMoreTabs();
  const isMoreActive = moreTabs.some((t) => t.id === activeTab);

  return (
    <>
      {/* More Modal Drawer */}
      {showMore && (
        <div className="fixed inset-0 z-50 md:hidden flex flex-col justify-end bg-slate-950/80 backdrop-blur-sm">
          <div className="flex-1" onClick={() => setShowMore(false)} />
          <div className="bg-slate-900 border-t border-slate-800 rounded-t-2xl p-5 space-y-4 shadow-2xl max-h-[85vh] overflow-y-auto text-slate-100">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-bold text-slate-300">
                Workspace & Navigation
              </span>
              <button
                type="button"
                onClick={() => setShowMore(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg cursor-pointer"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            {/* Audience Perspective Switcher */}
            <div className="space-y-1.5">
              <span className="block text-[11px] font-semibold text-slate-400">
                Audience Perspective
              </span>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { role: "student" as UserRole, label: "Primary Scholar" },
                  { role: "parent" as UserRole, label: "Parent" },
                  { role: "teacher" as UserRole, label: "Teacher" },
                  { role: "tutor" as UserRole, label: "Homeschool" },
                ].map((item) => (
                  <button
                    key={item.role}
                    type="button"
                    onClick={() => {
                      onSelectRole(item.role);
                      if (item.role === "parent") onSelectTab("parent");
                      if (item.role === "tutor") onSelectTab("tutor-hub");
                      if (item.role === "teacher") onSelectTab("teacher");
                      if (item.role === "student") onSelectTab("homework");
                      setShowMore(false);
                    }}
                    className={`flex items-center justify-center p-2.5 rounded-xl border text-xs font-semibold transition-colors cursor-pointer ${
                      userRole === item.role
                        ? "bg-blue-600 text-white border-blue-500 shadow-sm"
                        : "bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-800"
                    }`}
                  >
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* AI Quota Bar */}
            <div
              onClick={() => {
                onOpenSubscriptionModal();
                setShowMore(false);
              }}
              className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5 cursor-pointer hover:border-slate-700 transition-colors"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-white flex items-center gap-1.5">
                  <Zap size={13} className="text-blue-400" />
                  AI Daily Quota
                </span>
                <span className="text-[11px] text-blue-400 font-semibold">
                  {TIER_LABELS[usageStats.tier].split(" ")[0]} · Manage
                </span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-slate-900 overflow-hidden border border-slate-800">
                <div
                  className="h-full bg-blue-500"
                  style={{
                    width: `${Math.min(
                      100,
                      (usageStats.usedToday / Math.max(1, usageStats.dailyLimit)) * 100
                    )}%`,
                  }}
                />
              </div>
              <p className="text-[11px] text-slate-400">
                {usageStats.remaining} of {usageStats.dailyLimit} remaining today
              </p>
            </div>

            {/* Additional Tabs */}
            <div className="grid grid-cols-1 gap-1.5">
              {moreTabs.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      onSelectTab(item.id);
                      setShowMore(false);
                    }}
                    className={`flex items-center justify-between p-3 rounded-xl border text-left text-xs transition-colors cursor-pointer ${
                      isActive
                        ? "bg-blue-600 text-white border-blue-500"
                        : "bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-800 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className={isActive ? "text-white" : "text-slate-400"}>
                        {item.icon}
                      </span>
                      <div>
                        <div className="font-semibold">{item.label}</div>
                        <div className={`text-[11px] ${isActive ? "text-blue-100" : "text-slate-400"}`}>
                          {item.sublabel}
                        </div>
                      </div>
                    </div>
                    {item.badge !== undefined && (
                      <span className="text-[10px] bg-rose-500 text-white px-1.5 py-0.5 rounded font-bold">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* User Account / Sign In */}
            <div className="pt-2 border-t border-slate-800">
              {currentUser ? (
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 flex items-center justify-between">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-7 h-7 rounded-full bg-slate-800 text-blue-400 flex items-center justify-center font-bold text-xs">
                      <UserIcon size={14} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-white truncate">
                        {currentUser.displayName || "Scholar"}
                      </p>
                      <span className="flex items-center gap-1 text-[10px] text-emerald-400">
                        <Cloud size={10} className={isSyncing ? "animate-pulse" : ""} />
                        {isSyncing ? "Syncing..." : "Saved to Cloud"}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      onSignOut?.();
                      setShowMore(false);
                    }}
                    className="text-xs text-slate-400 hover:text-white flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 cursor-pointer"
                  >
                    <LogOut size={12} />
                    <span>Sign Out</span>
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    onSignIn?.();
                    setShowMore(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs py-2.5 px-4 rounded-xl transition-colors shadow-sm cursor-pointer"
                >
                  <LogIn size={14} />
                  <span>Sign in with Google</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Bottom Bar */}
      <nav
        aria-label="Mobile navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-md border-t border-slate-800 flex justify-around items-center px-2 py-1.5 safe-area-bottom"
      >
        {mainTabs.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectTab(item.id)}
              className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg text-[10px] font-semibold transition-colors cursor-pointer ${
                isActive ? "text-blue-400" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          );
        })}

        <button
          type="button"
          onClick={() => setShowMore(true)}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg text-[10px] font-semibold transition-colors relative cursor-pointer ${
            isMoreActive ? "text-blue-400" : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <MoreHorizontal size={18} />
          <span>More</span>
          {(unreadTeacherMessagesCount > 0 || openAssignmentsCount > 0) && (
            <span className="absolute top-0 right-2 w-1.5 h-1.5 rounded-full bg-blue-500" />
          )}
        </button>
      </nav>
    </>
  );
}
