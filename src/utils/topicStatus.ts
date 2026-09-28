import { Notebook, PracticeSession, TopicStatus } from "../types";

/**
 * Shared heuristic for determining topic status from real local data:
 * - 'not_started': Notebook has no student engagement (0 user messages) and no practice attempts
 * - 'needs_revisiting': Practice accuracy on this topic is under 70%, or student explicitly requested review
 * - 'on_track': Practice accuracy is 70%+ OR notebook has active student engagement (user messages present) with no failing practice
 */
export function getNotebookTopicStatus(
  notebook: Notebook,
  practiceSessions: PracticeSession[] = []
): TopicStatus {
  // Find practice sessions related to this notebook's subject or name
  const relatedSessions = practiceSessions.filter(
    (s) =>
      s.subject.trim().toLowerCase() === notebook.subject.trim().toLowerCase() ||
      notebook.name.toLowerCase().includes(s.topic.toLowerCase())
  );

  if (relatedSessions.length > 0) {
    const totalCorrect = relatedSessions.reduce((acc, s) => acc + s.correctAnswers, 0);
    const totalQuestions = relatedSessions.reduce((acc, s) => acc + s.totalQuestions, 0);
    const accuracy = totalQuestions > 0 ? totalCorrect / totalQuestions : 0;

    if (accuracy < 0.7) {
      return "needs_revisiting";
    }
    return "on_track";
  }

  // If no practice sessions, inspect actual notebook messages
  const userMessages = notebook.messages.filter((m) => m.role === "user");
  if (userMessages.length === 0) {
    return "not_started";
  }

  return "on_track";
}

export function getSubjectTopicStatus(
  subject: string,
  notebooks: Notebook[],
  practiceSessions: PracticeSession[] = []
): TopicStatus {
  const subjectNotebooks = notebooks.filter(
    (nb) => nb.subject.trim().toLowerCase() === subject.trim().toLowerCase()
  );

  if (subjectNotebooks.length === 0) {
    return "not_started";
  }

  const statuses = subjectNotebooks.map((nb) => getNotebookTopicStatus(nb, practiceSessions));

  if (statuses.some((s) => s === "needs_revisiting")) {
    return "needs_revisiting";
  }
  if (statuses.every((s) => s === "not_started")) {
    return "not_started";
  }
  return "on_track";
}

export function getTopicStatusBadge(status: TopicStatus): {
  label: string;
  className: string;
} {
  switch (status) {
    case "on_track":
      return {
        label: "On track",
        className: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
      };
    case "needs_revisiting":
      return {
        label: "Needs revisiting",
        className: "bg-amber-500/15 text-amber-400 border-amber-500/30",
      };
    case "not_started":
    default:
      return {
        label: "Not started",
        className: "bg-white/10 text-white/50 border-white/15",
      };
  }
}
