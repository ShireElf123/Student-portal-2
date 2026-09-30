import {
  Assignment,
  TeacherMessage,
  TeacherResource,
  Classroom,
  ClassAssignment,
  AssignmentSubmission,
  ClassMessage,
} from "../types";

// Teacher and classroom records are always user-created or cloud-loaded. Empty
// defaults prevent example identities, assignments, submissions, and messages
// from being presented as real learner history.
export const INITIAL_CLASSROOMS: Classroom[] = [];
export const INITIAL_CLASS_ASSIGNMENTS: Record<string, ClassAssignment[]> = {};
export const INITIAL_SUBMISSIONS: Record<string, AssignmentSubmission> = {};
export const INITIAL_TEACHER_MESSAGES: TeacherMessage[] = [];
export const INITIAL_ASSIGNMENTS: Assignment[] = [];
export const INITIAL_TEACHER_RESOURCES: TeacherResource[] = [];
export const INITIAL_CLASS_MESSAGES: ClassMessage[] = [];
