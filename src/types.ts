export type AcademicMode = 
  | "socratic"
  | "stem"
  | "writing"
  | "flashcards"
  | "teacher";

export type FriendlyTutorMode =
  | "learn"
  | "practise"
  | "write"
  | "solve"
  | "prepare";

export type NavigationTab =
  | "home"
  | "toddler"
  | "homework"
  | "assessment"
  | "tutor"
  | "subjects"
  | "study-plan"
  | "notebooks"
  | "practice"
  | "progress"
  | "teacher"
  | "parent"
  | "tutor-hub"
  | "odyssey"
  | "primary-lab"
  | "avatar-studio";

export type BuddyArchetype = "monster" | "alien" | "robot" | "forest-bunny";
export type BuddyColor = "pink" | "blue" | "lime" | "amber" | "purple" | "coral";
export type BuddyEyeStyle = "happy" | "cyclops" | "starry" | "wink" | "goggles";
export type BuddyHat = "none" | "explorer" | "party" | "wizard" | "astronaut" | "crown";
export type BuddyAccessory = "none" | "bowtie" | "cape" | "medal" | "balloon";

export interface BuddyCompanionConfig {
  id: string;
  name: string;
  archetype: BuddyArchetype;
  color: BuddyColor;
  eyeStyle: BuddyEyeStyle;
  hat: BuddyHat;
  accessory: BuddyAccessory;
  catchphrase: string;
}

export interface GamificationState {
  xp: number;
  level: number;
  streakDays: number;
  lastActiveDate: string;
  starsCount: number;
  gemsCount: number;
  completedNodes: string[];
  buddy?: BuddyCompanionConfig;
  wonderlandTheme?: "sunny-meadow" | "night-starlight";
}

export type UserRole = "student" | "parent" | "teacher" | "tutor";

export type SubscriptionTier = "free_trial" | "student_pro" | "family_basic" | "educator_plus";

export type SubscriptionStatus = "trialing" | "active" | "expired";

export interface LinkedStudent {
  id: string;
  name: string;
  email?: string;
  gradeLevel?: string;
  avatarUrl?: string;
  lastActive?: number;
  subjects?: string[];
}

export interface AIUsageStats {
  usedToday: number;
  dailyLimit: number;
  remaining: number;
  tier: SubscriptionTier;
  status: SubscriptionStatus;
  trialDaysRemaining: number;
  resetDate: string;
}

export interface ParentLinkCodeEntry {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail?: string;
  linkCode: string;
  createdAt: number;
}

export interface UserProfileData {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  role: UserRole;
  linkedStudentIds?: string[];
  subscriptionTier?: SubscriptionTier;
  subscriptionStatus?: SubscriptionStatus;
  trialEndsAt?: number;
  aiUsageToday?: number;
  aiUsageResetDate?: string;
  createdAt: number;
}

export type TopicStatus = "not_started" | "needs_revisiting" | "on_track";

export interface Attachment {
  name: string;
  mimeType: string;
  data: string; // base64 without prefix
  previewUrl: string; // data:image/...
}

export interface Message {
  id: string;
  role: "user" | "model";
  content: string;
  interactionId?: string;
  timestamp?: number;
  isStreaming?: boolean;
  attachment?: {
    previewUrl: string;
    name: string;
  };
}

export interface Notebook {
  id: string;
  name: string;
  subject: string;
  mode: AcademicMode;
  messages: Message[];
  lastInteractionId?: string;
  createdAt: number;
}

export interface StudyPlanItem {
  id: string;
  title: string;
  subject: string;
  durationMinutes: number;
  priority: "high" | "medium" | "low";
  reason?: string;
  completed: boolean;
  type: "ai_recommendation" | "student_task";
  date: string; // YYYY-MM-DD from todayISO()
}

export interface PracticeQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  hint?: string;
}

export interface PracticeSession {
  id: string;
  subject: string;
  topic: string;
  difficulty: "easy" | "medium" | "hard";
  totalQuestions: number;
  correctAnswers: number;
  timestamp: number;
}

export interface TeacherMessage {
  id: string;
  sender: "student" | "teacher";
  text: string;
  timestamp: number;
  read: boolean;
  attachedNotebookContext?: {
    notebookId: string;
    subject: string;
    notebookName: string;
    lastAIResponse: string;
  };
}

export interface Assignment {
  id: string;
  subject: string;
  title: string;
  description: string;
  dueDate: string;
  status: "not_started" | "submitted" | "reviewed";
  studentSubmission?: string;
  studentNote?: string;
  teacherFeedback?: string;
  grade?: string;
  submittedAt?: number;
}

export interface TeacherResource {
  id: string;
  subject: string;
  title: string;
  type: "note" | "link";
  content: string;
  url?: string;
  createdAt: number;
}

export interface StudentProfileSummary {
  displayName: string;
  email: string;
  enrolledAt: number;
}

export interface Classroom {
  id: string;
  name: string;
  subject: string;
  joinCode: string;
  teacherId: string;
  teacherName: string;
  teacherEmail?: string;
  studentIds: string[];
  studentProfiles?: Record<string, StudentProfileSummary>;
  createdAt: number;
}

export interface AssignmentSubmission {
  id: string; // studentId
  assignmentId: string;
  classId: string;
  studentId: string;
  studentName: string;
  studentEmail?: string;
  studentSubmission: string;
  studentNote?: string;
  submittedAt: number;
  status: "submitted" | "reviewed";
  grade?: string;
  teacherFeedback?: string;
  reviewedAt?: number;
}

export interface ClassAssignment {
  id: string;
  classId: string;
  teacherId: string;
  subject: string;
  title: string;
  description: string;
  dueDate: string;
  createdAt: number;
}

export interface ClassResource {
  id: string;
  classId: string;
  teacherId: string;
  subject: string;
  title: string;
  type: "note" | "link";
  content: string;
  url?: string;
  createdAt: number;
}

export interface ClassMessage {
  id: string;
  classId: string;
  studentId: string;
  studentName?: string;
  senderId: string;
  senderRole: "student" | "teacher";
  senderName: string;
  text: string;
  timestamp: number;
  read: boolean;
  attachedNotebookContext?: {
    notebookId: string;
    subject: string;
    notebookName: string;
    lastAIResponse: string;
  };
}

export type SyncStatusState = "synced" | "syncing" | "error" | "offline";

export interface SyncStatusInfo {
  state: SyncStatusState;
  message?: string;
  lastSyncedAt?: number;
}

// Age & Learning Stage Architecture
export type LearningStage = "toddler" | "primary" | "educator";

export interface PictureBookPage {
  pageNumber: number;
  title: string;
  text: string;
  illustration: string; // Emoji, SVG representation or visual scene
  bgGradient: string;
  narration: string;
  letterHighlight?: string;
  wordHighlights?: string[];
  interactivePrompt: string; // e.g. "Can you tap the red apple?"
  soundEffectText?: string;
}

export interface PictureBook {
  id: string;
  title: string;
  subtitle: string;
  ageRange: string; // "Ages 2-4" | "Ages 3-5"
  category: "phonics" | "numbers" | "animals" | "colors" | "bedtime" | "manners" | "nature" | "space" | "ocean" | "feelings";
  coverEmoji: string;
  coverGradient: string;
  pages: PictureBookPage[];
  author: string;
  readTimeMinutes: number;
}

export type AssessmentScore = "mastered" | "developing" | "needs_practice" | "not_assessed";

export interface AssessmentItem {
  id: string;
  prompt: string;
  category: string;
  demonstrationGuide: string; // Instructions for the parent or tutor
  options?: string[];
  correctAnswer?: string;
  score: AssessmentScore;
  parentNotes?: string;
  visualCue?: string;
}

export interface GuidedAssessment {
  id: string;
  title: string;
  targetStage: "toddler" | "primary";
  ageRange: string;
  category: "phonics" | "early_math" | "reading_fluency" | "homework_readiness" | "fine_motor" | "science_discovery";
  description: string;
  estimatedMinutes: number;
  items: AssessmentItem[];
}

export interface AssessmentResult {
  id: string;
  assessmentId: string;
  assessmentTitle: string;
  targetStage: "toddler" | "primary";
  studentName: string;
  administeredBy: "parent" | "tutor" | "self";
  date: string;
  timestamp: number;
  totalItems: number;
  masteredCount: number;
  developingCount: number;
  needsPracticeCount: number;
  starsAwarded: number;
  feedbackSummary: string;
  nextLearningStep: string;
  itemScores: Record<string, AssessmentScore>;
}

export interface HomeworkTask {
  id: string;
  subject: string;
  title: string;
  instructions: string;
  dueDate: string;
  completed: boolean;
  stage: "toddler" | "primary";
  estimatedMinutes: number;
  parentSigned: boolean;
  questions?: string[];
  classAssignmentId?: string;
  classId?: string;
  teacherName?: string;
  teacherFeedback?: string;
  grade?: string;
  submissionText?: string;
  status?: "not_started" | "submitted" | "reviewed";
  submittedAt?: number;
}

