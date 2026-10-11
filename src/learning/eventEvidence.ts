/**
 * Event types that may carry scored learner evidence. A completion, mission,
 * page-view, or content-open event is never mastery evidence by itself.
 */
const SCORED_EVIDENCE_EVENT_TYPES = new Set([
  "question_answered",
  "learner_response",
  "assessment_response",
  "practice_response",
  "session_summary",
]);

export function isMasteryEvidenceEventType(eventType: string): boolean {
  return SCORED_EVIDENCE_EVENT_TYPES.has(eventType);
}
