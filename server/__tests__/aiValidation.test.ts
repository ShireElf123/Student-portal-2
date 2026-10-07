import { describe, expect, it } from "vitest";
import {
  validateChatRequest,
  validateChatResponse,
  validatePracticeAdmissionRequest,
  validateStudyPlanRequest,
  validateStudyPlanTasks,
} from "../aiValidation";

const VALID_TASKS = [
  { title: "Review notes", subject: "Mathematics", durationMinutes: 20, priority: "high", reason: "Brief review supports retrieval." },
  { title: "Practise examples", subject: "Science", durationMinutes: 30, priority: "medium", reason: "Examples build confidence in the method." },
  { title: "Summarise the chapter", subject: "Humanities", durationMinutes: 25, priority: "low", reason: "A summary helps link the main ideas." },
];

describe("AI request and candidate validation", () => {
  it("accepts bounded chat text and supported image attachments", () => {
    expect(validateChatRequest({ message: "  Help me study.  ", mode: "socratic" })).toMatchObject({
      valid: true,
      request: { message: "Help me study.", mode: "socratic" },
    });
    expect(validateChatRequest({ message: "", attachment: { data: "aGVsbG8=", mimeType: "image/png" } }).valid).toBe(true);
  });

  it("rejects oversized, malformed, unsupported, and claim-bearing chat requests", () => {
    expect(validateChatRequest({ message: "x".repeat(8_001) }).valid).toBe(false);
    expect(validateChatRequest({ message: "help", attachment: { data: "not-base64", mimeType: "image/png" } }).valid).toBe(false);
    expect(validateChatRequest({ message: "help", attachment: { data: "aGVsbG8=", mimeType: "image/svg+xml" } }).valid).toBe(false);
    expect(validateChatRequest({ message: "help", organizationId: "org-from-client" }).valid).toBe(false);
    expect(validateChatRequest({ message: "help", mode: "administrator" }).valid).toBe(false);
    expect(validateChatRequest({ message: "   " }).valid).toBe(false);
  });

  it("limits study-plan subjects and supplies defaults only when omitted or empty", () => {
    expect(validateStudyPlanRequest({}).valid).toBe(true);
    expect(validateStudyPlanRequest({ subjects: [] })).toMatchObject({ valid: true, subjects: ["Mathematics", "Computer Science", "Humanities", "Science"] });
    expect(validateStudyPlanRequest({ subjects: ["Math", "Math", "Science"] })).toMatchObject({
      valid: true,
      subjects: ["Math", "Science"],
    });
    expect(validateStudyPlanRequest({ subjects: ["x".repeat(101)] }).valid).toBe(false);
    expect(validateStudyPlanRequest({ subjects: Array.from({ length: 9 }, () => "Math") }).valid).toBe(false);
    expect(validateStudyPlanRequest({ subjects: ["Math"], subscriptionTier: "educator_plus" }).valid).toBe(false);
  });

  it("approves only complete bounded study-plan task sets and removes provider-supplied identifiers", () => {
    const valid = validateStudyPlanTasks(VALID_TASKS);
    expect(valid.valid).toBe(true);
    expect(valid.tasks).toHaveLength(3);
    expect(valid.tasks[0].id).toBe("study-plan-1");
    expect(validateStudyPlanTasks(VALID_TASKS.slice(0, 2)).valid).toBe(false);
    expect(validateStudyPlanTasks([
      ...VALID_TASKS.slice(0, 2),
      { ...VALID_TASKS[2], durationMinutes: 500 },
    ]).valid).toBe(false);
    expect(validateStudyPlanTasks([
      ...VALID_TASKS.slice(0, 2),
      { ...VALID_TASKS[2], priority: "urgent" },
    ]).valid).toBe(false);
  });

  it("validates chat responses and assigns practice cost units by bounded question count", () => {
    expect(validateChatResponse({ text: " Answer ", interactionId: "interaction-1" })).toEqual({
      text: "Answer",
      interactionId: "interaction-1",
    });
    expect(validateChatResponse({ text: "" })).toBeNull();
    expect(validateChatResponse({ text: "Answer", interactionId: "x".repeat(257) })).toBeNull();
    expect(validatePracticeAdmissionRequest({ subject: "Math", topic: "Fractions", difficulty: "easy", count: 5 })).toBe(1);
    expect(validatePracticeAdmissionRequest({ subject: "Math", topic: "Fractions", difficulty: "hard", count: 6 })).toBe(2);
  });
});
