import React, { useState, useEffect } from "react";
import {
  Home,
  Bot,
  Target,
  BookOpen,
  CalendarCheck,
  BarChart3,
  GraduationCap,
  Users,
  Brain,
  Zap,
  LogIn,
  LogOut,
  ChevronDown,
  ChevronUp,
  User as UserIcon,
  Compass,
  MoreHorizontal,
  Flame,
  CheckCircle2,
} from "lucide-react";
import { NavigationTab, UserRole, AIUsageStats, LearningStage } from "../types";
import { User } from "firebase/auth";
import { SyncStatusBadge } from "./SyncStatusBadge";
import {
  getUsageStats,
  subscribeToAIUsage,
  TIER_LABELS,
} from "../services/aiUsageService";

interface NavigationSidebarProps {
  activeTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  userRole: UserRole;
  onSelectRole: (role: UserRole) => void;
  learningStage?: LearningStage;
  onSelectLearningStage?: (stage: LearningStage) => void;
  selectedChildId?: string;
  onSelectChild?: (childId: string) => void;
  onOpenStartupGateway?: () => void;
  onOpenSubscriptionModal: () => void;
  unreadTeacherMessagesCount?: number;
  openAssignmentsCount?: number;
  currentUser?: User | null;
  onSignIn?: () => void;
  onSignOut?: () => void;
  isSyncing?: boolean;
}

interface NavItemDef {
  id: NavigationTab;
  label: string;
  subtitle: string;
  icon: React.ReactNode;
  badge?: number;
}

export function NavigationSidebar({
  activeTab,
  onSelectTab,
  userRole,
  onSelectRole,
  learningStage = "primary",
  onSelectLearningStage,
  onOpenStartupGateway,
  onOpenSubscriptionModal,
  unreadTeacherMessagesCount = 0,
  openAssignmentsCount = 0,
  currentUser = null,
  onSignIn,
  onSignOut,
  isSyncing = false,
}: NavigationSidebarProps) {
  const [usageStats, setUsageStats] = useState<AIUsageStats>(getUsageStats());
  const [showMoreSection, setShowMoreSection] = useState(false);

  useEffect(() => {
    return subscribeToAIUsage((stats) => {
      setUsageStats(stats);
    });
  }, []);

  // Configure maximum 5 primary items per role + secondary items under More
  const getNavConfiguration = (): {
    primary: NavItemDef[];
    secondary: NavItemDef[];
  } => {
    if (userRole === "parent") {
      return {
        primary: [
          {
            id: "parent",
            label: "Parent Dashboard",
            subtitle: "Family overview & learners",
            icon: <Users size={18} />,
          },
          {
            id: "homework",
            label: "Homework Desk",
            subtitle: "Assignments & due dates",
            icon: <span className="text-base" aria-hidden="true">🎒</span>,
          },
          {
            id: "assessment",
            label: "Diagnostic Checks",
            subtitle: "Phonics & math milestones",
            icon: <GraduationCap size={18} />,
          },
          {
            id: "progress",
            label: "Mastery Progress",
            subtitle: "Skill growth & time tracking",
            icon: <BarChart3 size={18} />,
          },
          {
            id: "teacher",
            label: "School Messages",
            subtitle: "Teacher notes & guidance",
            icon: <GraduationCap size={18} />,
            badge:
              unreadTeacherMessagesCount + openAssignmentsCount > 0
                ? unreadTeacherMessagesCount + openAssignmentsCount
                : undefined,
          },
        ],
        secondary: [
          {
            id: "odyssey",
            label: "Learning Odyssey",
            subtitle: "Curriculum quest roadmap",
            icon: <span className="text-base" aria-hidden="true">🗺️</span>,
          },
          {
            id: "primary-lab",
            label: "STEM Arcade",
            subtitle: "Interactive science & math",
            icon: <span className="text-base" aria-hidden="true">⚡</span>,
          },
        ],
      };
    }

    if (userRole === "tutor") {
      return {
        primary: [
          {
            id: "tutor-hub",
            label: "Homeschool Hub",
            subtitle: "Lesson planner & student roster",
            icon: <Brain size={18} />,
          },
          {
            id: "homework",
            label: "Homework Review",
            subtitle: "Verify student tasks & answers",
            icon: <span className="text-base" aria-hidden="true">🎒</span>,
          },
          {
            id: "assessment",
            label: "Diagnostic Lead",
            subtitle: "Structured milestone tests",
            icon: <GraduationCap size={18} />,
          },
          {
            id: "practice",
            label: "Practice Quizzes",
            subtitle: "Flashcard drills & questions",
            icon: <Target size={18} />,
          },
          {
            id: "tutor",
            label: "AI Co-Tutor",
            subtitle: "Socratic problem guidance",
            icon: <Bot size={18} />,
          },
        ],
        secondary: [
          {
            id: "progress",
            label: "Student Progress",
            subtitle: "Mastery metrics & analytics",
            icon: <BarChart3 size={18} />,
          },
        ],
      };
    }

    if (userRole === "teacher") {
      return {
        primary: [
          {
            id: "teacher",
            label: "Teacher Hub",
            subtitle: "Classes & assigned homework",
            icon: <GraduationCap size={18} />,
            badge:
              unreadTeacherMessagesCount + openAssignmentsCount > 0
                ? unreadTeacherMessagesCount + openAssignmentsCount
                : undefined,
          },
          {
            id: "homework",
            label: "Student Desk Preview",
            subtitle: "Inspect student assignments",
            icon: <span className="text-base" aria-hidden="true">🎒</span>,
          },
          {
            id: "practice",
            label: "Question Bank",
            subtitle: "Active recall & exercises",
            icon: <Target size={18} />,
          },
          {
            id: "assessment",
            label: "Diagnostic Bridge",
            subtitle: "Curriculum-aligned tests",
            icon: <GraduationCap size={18} />,
          },
          {
            id: "progress",
            label: "Cohort Progress",
            subtitle: "Classwide mastery analytics",
            icon: <BarChart3 size={18} />,
          },
        ],
        secondary: [],
      };
    }

    // Default: Primary Student Perspective (strict 5 primary items)
    return {
      primary: [
        {
          id: "homework",
          label: "Homework Desk",
          subtitle: "Daily tasks & assignments",
          icon: <span className="text-base" aria-hidden="true">🎒</span>,
        },
        {
          id: "tutor",
          label: "Socratic Tutor",
          subtitle: "Step-by-step AI guidance",
          icon: <Bot size={18} />,
        },
        {
          id: "practice",
          label: "Practice Quizzes",
          subtitle: "Flashcards & recall drills",
          icon: <Target size={18} />,
        },
        {
          id: "odyssey",
          label: "Learning Odyssey",
          subtitle: "Subject quests & roadmap",
          icon: <span className="text-base" aria-hidden="true">🗺️</span>,
        },
        {
          id: "primary-lab",
          label: "STEM Arcade",
          subtitle: "Interactive math & science",
          icon: <span className="text-base" aria-hidden="true">⚡</span>,
        },
      ],
      secondary: [
        {
          id: "notebooks",
          label: "Reference Notes",
          subtitle: "Subject notebooks & notes",
          icon: <BookOpen size={18} />,
        },
        {
          id: "assessment",
          label: "Guided Assessment",
          subtitle: "Milestone & skill checks",
          icon: <GraduationCap size={18} />,
        },
      ],
    };
  };

  const { primary, secondary } = getNavConfiguration();
  const isSecondaryActive = secondary.some((item) => item.id === activeTab);

  return (
    <aside
      className="hidden md:flex w-68 lg:w-72 bg-slate-950 border-r border-slate-800/90 text-slate-100 flex-col flex-shrink-0 z-20 select-none"
      aria-label="Primary Navigation Sidebar"
    >
      {/* Brand & Workspace Switcher Header */}
      <div className="p-4 sm:p-5 border-b border-slate-800/80 bg-slate-950/60 space-y-4">
        {/* App Title */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm flex-shrink-0">
            <GraduationCap size={20} />
          </div>
          <div className="min-w-0">
            <h1 className="font-bold text-white text-sm tracking-tight truncate leading-tight">
              My Student Portal
            </h1>
            <p className="text-[11px] text-slate-400 font-medium">Academic Workspace</p>
          </div>
        </div>

        {/* Clear Workspace Switcher: Primary Desk is Default */}
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>Workspace</span>
            {onOpenStartupGateway && (
              <button
                type="button"
                onClick={onOpenStartupGateway}
                className="text-[11px] text-blue-400 hover:text-blue-300 font-semibold focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none rounded cursor-pointer"
              >
                Switch
              </button>
            )}
          </div>

          {/* 3 Calm Workspace Segments */}
          <div className="grid grid-cols-3 gap-1 p-1 bg-slate-900 border border-slate-800 rounded-xl">
            <button
              type="button"
              onClick={() => {
                if (onSelectLearningStage) onSelectLearningStage("primary");
                onSelectTab("homework");
              }}
              className={`py-1.5 px-1 rounded-lg text-xs font-semibold transition-colors flex flex-col items-center justify-center cursor-pointer focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none ${
                learningStage === "primary"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
              }`}
              title="Primary Homework Desk (Ages 6-11) - Default"
            >
              <span className="text-xs leading-none">Primary</span>
              <span className="text-[10px] text-slate-300/80 leading-none mt-0.5">6–11y</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (onSelectLearningStage) onSelectLearningStage("toddler");
                onSelectTab("toddler");
              }}
              className={`py-1.5 px-1 rounded-lg text-xs font-semibold transition-colors flex flex-col items-center justify-center cursor-pointer focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none ${
                learningStage === "toddler"
                  ? "bg-amber-500 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
              }`}
              title="Toddler Sensory World (Ages 2-5)"
            >
              <span className="text-xs leading-none">Toddler</span>
              <span className="text-[10px] text-slate-300/80 leading-none mt-0.5">2–5y</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (onSelectLearningStage) onSelectLearningStage("educator");
                if (userRole === "student") onSelectRole("parent");
                onSelectTab("parent");
              }}
              className={`py-1.5 px-1 rounded-lg text-xs font-semibold transition-colors flex flex-col items-center justify-center cursor-pointer focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none ${
                learningStage === "educator"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
              }`}
              title="Parent & Home Tutor Hub"
            >
              <span className="text-xs leading-none">Tutor</span>
              <span className="text-[10px] text-slate-300/80 leading-none mt-0.5">Adult</span>
            </button>
          </div>
        </div>

        {/* Perspective Selector (Student / Parent / Tutor / Teacher) */}
        <div className="relative pt-1">
          <label htmlFor="sidebar-role-selector" className="sr-only">
            Active User Role Perspective
          </label>
          <div className="relative">
            <select
              id="sidebar-role-selector"
              value={userRole}
              onChange={(e) => onSelectRole(e.target.value as UserRole)}
              className="w-full appearance-none bg-slate-900 border border-slate-800 text-slate-200 text-xs font-medium rounded-xl py-2 pl-3 pr-8 cursor-pointer hover:border-slate-700 transition-colors focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none"
            >
              <option value="student">Student Perspective</option>
              <option value="parent">Parent Perspective</option>
              <option value="tutor">Homeschool / Tutor Perspective</option>
              <option value="teacher">Teacher Perspective</option>
            </select>
            <ChevronDown
              size={14}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
              aria-hidden="true"
            />
          </div>
        </div>
      </div>

      {/* Main Navigation Items (Max 5 Primary + Collapsible More) */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto" aria-label="Main Navigation">
        {primary.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none ${
                isActive
                  ? "bg-slate-900 text-white border border-slate-700/80 shadow-sm"
                  : "text-slate-300 hover:text-white hover:bg-slate-900/60 border border-transparent"
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className={isActive ? "text-blue-400" : "text-slate-400"}>
                  {item.icon}
                </span>
                <div className="min-w-0">
                  <div className="text-xs font-bold truncate leading-tight tracking-tight">
                    {item.label}
                  </div>
                  <div className="text-[11px] text-slate-400 truncate leading-snug">
                    {item.subtitle}
                  </div>
                </div>
              </div>
              {item.badge !== undefined && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        {/* Secondary Items Collapsible "More" */}
        {secondary.length > 0 && (
          <div className="pt-2 border-t border-slate-800/60 mt-2">
            <button
              type="button"
              onClick={() => setShowMoreSection((prev) => !prev)}
              className="w-full flex items-center justify-between px-2.5 py-1.5 text-xs font-semibold text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-900/40 transition-colors focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none cursor-pointer"
              aria-expanded={showMoreSection}
            >
              <span className="flex items-center gap-2">
                <MoreHorizontal size={14} />
                <span>More Tools</span>
                {isSecondaryActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400" aria-label="Active item in More" />
                )}
              </span>
              {showMoreSection ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>

            {showMoreSection && (
              <div className="mt-1 space-y-1 pl-2">
                {secondary.map((item) => {
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => onSelectTab(item.id)}
                      className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none ${
                        isActive
                          ? "bg-slate-900 text-white border border-slate-700/80 shadow-sm"
                          : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 border border-transparent"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className={isActive ? "text-blue-400" : "text-slate-400"}>
                          {item.icon}
                        </span>
                        <div className="min-w-0">
                          <div className="text-xs font-semibold truncate leading-tight">
                            {item.label}
                          </div>
                          <div className="text-[10px] text-slate-400 truncate leading-snug">
                            {item.subtitle}
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </nav>

      {/* AI Usage Monitor */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950/80">
        <button
          type="button"
          onClick={onOpenSubscriptionModal}
          className="w-full text-left p-2.5 rounded-xl bg-slate-900/70 hover:bg-slate-900 border border-slate-800 transition-colors space-y-1.5 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none cursor-pointer"
        >
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-300 flex items-center gap-1.5">
              <Zap size={13} className="text-blue-400" />
              <span>AI Study Quota</span>
            </span>
            <span className="text-[11px] text-slate-400 font-medium">
              {TIER_LABELS[usageStats.tier].split(" ")[0]}
            </span>
          </div>

          {/* Quiet Progress Bar */}
          <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                usageStats.remaining <= 2
                  ? "bg-rose-500"
                  : usageStats.remaining <= 5
                  ? "bg-amber-500"
                  : "bg-blue-500"
              }`}
              style={{
                width: `${Math.min(
                  100,
                  (usageStats.usedToday / Math.max(1, usageStats.dailyLimit)) * 100
                )}%`,
              }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>{usageStats.remaining} prompts left today</span>
            <span className="text-blue-400 font-medium">Details</span>
          </div>
        </button>
      </div>

      {/* User Account & Cloud Sync */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950 space-y-2">
        {currentUser ? (
          <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-2.5 space-y-2">
            <div className="flex items-center gap-2.5 min-w-0">
              {currentUser.photoURL ? (
                <img
                  src={currentUser.photoURL}
                  alt={currentUser.displayName || "User"}
                  className="w-7 h-7 rounded-full object-cover border border-slate-700"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-7 h-7 rounded-full bg-slate-800 text-slate-300 border border-slate-700 flex items-center justify-center text-xs font-semibold">
                  <UserIcon size={14} />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-white truncate leading-tight">
                  {currentUser.displayName || "Student Scholar"}
                </p>
                <p className="text-[10px] text-slate-400 truncate">
                  {currentUser.email || "Active Session"}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1.5 border-t border-slate-800/60">
              <SyncStatusBadge />
              <button
                type="button"
                onClick={onSignOut}
                className="text-[11px] text-slate-400 hover:text-white font-medium flex items-center gap-1 px-2 py-0.5 rounded hover:bg-slate-800 transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none"
                title="Sign Out"
              >
                <LogOut size={12} />
                <span>Exit</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-2.5 text-center space-y-2">
            <div className="text-[11px] text-slate-300 font-medium">Cloud Study Sync</div>
            <button
              type="button"
              onClick={onSignIn}
              className="w-full flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs py-1.5 px-2.5 rounded-lg transition-colors shadow-sm cursor-pointer focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none"
            >
              <LogIn size={13} />
              <span>Sign in with Google</span>
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
