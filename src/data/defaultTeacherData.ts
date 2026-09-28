import {
  Assignment,
  TeacherMessage,
  TeacherResource,
  Classroom,
  ClassAssignment,
  AssignmentSubmission,
  ClassMessage,
} from "../types";

export const INITIAL_CLASSROOMS: Classroom[] = [
  {
    id: "class-elem-math-3",
    name: "Grade 3 Math & STEM Explorers",
    subject: "Mathematics",
    joinCode: "MATH3",
    teacherId: "teacher-ms-henderson",
    teacherName: "Ms. Henderson",
    teacherEmail: "henderson.primary@portal.edu",
    studentIds: ["mock-student-id"],
    studentProfiles: {
      "mock-student-id": {
        displayName: "Student Scholar",
        email: "student@portal.edu",
        enrolledAt: Date.now() - 3600000 * 24 * 7,
      },
    },
    createdAt: Date.now() - 3600000 * 24 * 7,
  },
  {
    id: "class-elem-read-3",
    name: "Elementary Reading & Creative Writing",
    subject: "Reading & English",
    joinCode: "READ3",
    teacherId: "teacher-mr-davis",
    teacherName: "Mr. Davis",
    teacherEmail: "davis.primary@portal.edu",
    studentIds: ["mock-student-id"],
    studentProfiles: {
      "mock-student-id": {
        displayName: "Student Scholar",
        email: "student@portal.edu",
        enrolledAt: Date.now() - 3600000 * 24 * 5,
      },
    },
    createdAt: Date.now() - 3600000 * 24 * 5,
  },
];

export const INITIAL_CLASS_ASSIGNMENTS: Record<string, ClassAssignment[]> = {
  "class-elem-math-3": [
    {
      id: "asgn-math-1",
      classId: "class-elem-math-3",
      teacherId: "teacher-ms-henderson",
      subject: "Mathematics",
      title: "Multiplication Safari: 6s & 7s Word Problems",
      description: "Solve the 4 jungle word problems using equal groups or repeated addition. Draw an array for question 3!",
      dueDate: "2026-09-24",
      createdAt: Date.now() - 3600000 * 48,
    },
    {
      id: "asgn-math-2",
      classId: "class-elem-math-3",
      teacherId: "teacher-ms-henderson",
      subject: "Mathematics",
      title: "Fractions Pizza Party & Equal Sharing",
      description: "Color in halves, thirds, and quarters on the pizza diagrams. Which slice is bigger: 1/3 or 1/4?",
      dueDate: "2026-09-28",
      createdAt: Date.now() - 3600000 * 24,
    },
  ],
  "class-elem-read-3": [
    {
      id: "asgn-read-1",
      classId: "class-elem-read-3",
      teacherId: "teacher-mr-davis",
      subject: "Reading & English",
      title: "Rainforest Animal Adventure Story",
      description: "Write a 5-to-8 sentence adventure about an animal journeying through the Amazon rainforest. Use 3 descriptive adjectives!",
      dueDate: "2026-09-25",
      createdAt: Date.now() - 3600000 * 36,
    },
  ],
};

export const INITIAL_SUBMISSIONS: Record<string, AssignmentSubmission> = {
  "asgn-math-1": {
    id: "mock-student-id",
    assignmentId: "asgn-math-1",
    classId: "class-elem-math-3",
    studentId: "mock-student-id",
    studentName: "Alex Student",
    studentEmail: "student@portal.edu",
    studentSubmission: "Problem 1: 6 baskets with 7 apples = 6 x 7 = 42 apples. Problem 2: 7 safari jeeps with 4 explorers = 28 explorers. I drew 3 rows of 7 dots for question 3!",
    studentNote: "Asked the Socratic math tutor for a hint on grouping the rows.",
    submittedAt: Date.now() - 3600000 * 12,
    status: "reviewed",
    grade: "100% ⭐",
    teacherFeedback: "Super work! Your array drawing showed exactly how 6 groups of 7 work. Keep it up!",
    reviewedAt: Date.now() - 3600000 * 4,
  },
};

export const INITIAL_TEACHER_MESSAGES: TeacherMessage[] = [
  {
    id: "tmsg-1",
    sender: "teacher",
    text: "Welcome to Grade 3 class homework room! Feel free to ask any questions or send over your work when you'd like guidance.",
    timestamp: Date.now() - 3600000 * 24,
    read: true,
  },
  {
    id: "tmsg-2",
    sender: "student",
    text: "Hi Ms. Henderson! I used the Socratic buddy to double check whether 1/3 is bigger than 1/4. We drew a pizza slice diagram!",
    timestamp: Date.now() - 3600000 * 5,
    read: true,
    attachedNotebookContext: {
      notebookId: "math-primary-3",
      subject: "Mathematics",
      notebookName: "Primary Mathematics & Word Problems",
      lastAIResponse: "Imagine cutting a pizza into 3 big slices versus 4 smaller slices. The fewer pieces you divide it into, the larger each piece is!",
    },
  },
  {
    id: "tmsg-3",
    sender: "teacher",
    text: "That is the perfect visual way to remember it! Great job using your math notebook to visualize fractions.",
    timestamp: Date.now() - 3600000 * 2,
    read: false,
  },
];

export const INITIAL_ASSIGNMENTS: Assignment[] = [
  {
    id: "asgn-1",
    subject: "Mathematics",
    title: "Multiplication Safari: 6s & 7s Word Problems",
    description: "Solve the 4 jungle word problems using equal groups or repeated addition. Draw an array for question 3!",
    dueDate: "2026-09-24",
    status: "reviewed",
    studentSubmission: "Problem 1: 6 baskets with 7 apples = 42 apples. Problem 2: 7 safari jeeps with 4 explorers = 28 explorers.",
    submittedAt: Date.now() - 3600000 * 12,
    grade: "100% ⭐",
    teacherFeedback: "Super work! Your array drawing was fantastic!",
  },
  {
    id: "asgn-2",
    subject: "Mathematics",
    title: "Fractions Pizza Party & Equal Sharing",
    description: "Color in halves, thirds, and quarters on the pizza diagrams. Which slice is bigger: 1/3 or 1/4?",
    dueDate: "2026-09-28",
    status: "not_started",
  },
  {
    id: "asgn-3",
    subject: "Reading & English",
    title: "Rainforest Animal Adventure Story",
    description: "Write a 5-to-8 sentence adventure about an animal journeying through the Amazon rainforest. Use 3 descriptive adjectives!",
    dueDate: "2026-09-25",
    status: "not_started",
  },
];

export const INITIAL_TEACHER_RESOURCES: TeacherResource[] = [
  {
    id: "res-1",
    subject: "Mathematics",
    title: "Multiplication Times Table Chart (1 to 12)",
    type: "link",
    content: "Visual grid showing multiplication patterns, skip counting color codes, and square numbers.",
    url: "https://en.wikipedia.org/wiki/Multiplication_table",
    createdAt: Date.now() - 3600000 * 48,
  },
  {
    id: "res-2",
    subject: "Reading & English",
    title: "Descriptive Sensory Words Word-Bank",
    type: "note",
    content: "Word bank for young writers: Sight (glowing, shadowy), Sound (whispering, rustling), Touch (velvety, prickly). Use these in your stories!",
    createdAt: Date.now() - 3600000 * 24,
  },
  {
    id: "res-3",
    subject: "Science & STEM",
    title: "Interactive Solar System Planet Guide",
    type: "link",
    content: "NASA Solar System Exploration guide featuring sizes, distances, and moons for all eight planets.",
    url: "https://solarsystem.nasa.gov/",
    createdAt: Date.now() - 3600000 * 12,
  },
];
