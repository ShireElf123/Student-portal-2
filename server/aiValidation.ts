import type { ChatOptions, ChatResponse, PracticeGenerateRequest, StudyPlanTask } from "./types";

const CHAT_MODES = ["general", "socratic", "stem", "writing", "flashcards", "teacher"] as const;
const CHAT_ATTACHMENT_MIME_TYPES = ["image/png", "image/jpeg", "image/webp"] as const;
const MAX_CHAT_MESSAGE_LENGTH = 8_000;
const MAX_CHAT_ATTACHMENT_BASE64_LENGTH = 5_600_000;
const MAX_CHAT_RESPONSE_LENGTH = 60_000;
const DEFAULT_STUDY_SUBJECTS = ["Mathematics", "Computer Science", "Humanities", "Science"];

export type ChatRequestValidation =
  | { valid: true; request: ChatOptions }
  | { valid: false; error: string };

export type StudyPlanRequestValidation =
  | { valid: true; subjects: string[] }
  | { valid: false; error: string };

export interface StudyPlanTasksValidation {
  valid: boolean;
  tasks: StudyPlanTask[];
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function hasOnlyKeys(value: Record<string, unknown>, allowedKeys: readonly string[]): boolean {
  return Object.keys(value).every((key) => allowedKeys.includes(key));
}

function isBase64(value: string): boolean {
  return /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(value);
}

export function validateChatRequest(body: unknown): ChatRequestValidation {
  if (!isRecord(body) || !hasOnlyKeys(body, ["message", "mode", "previousInteractionId", "attachment"])) {
    return { valid: false, error: "Chat request must contain only supported fields." };
  }
  const message = typeof body.message === "string" ? body.message.trim() : "";
  if (message.length > MAX_CHAT_MESSAGE_LENGTH) {
    return { valid: false, error: `Message must be ${MAX_CHAT_MESSAGE_LENGTH} characters or fewer.` };
  }

  const mode = body.mode === undefined ? "general" : body.mode;
  if (typeof mode !== "string" || !(CHAT_MODES as readonly string[]).includes(mode)) {
    return { valid: false, error: "Chat mode is invalid." };
  }

  let previousInteractionId: string | undefined;
  if (body.previousInteractionId !== undefined && body.previousInteractionId !== null) {
    if (typeof body.previousInteractionId !== "string" || body.previousInteractionId.length > 256 ||
      /[\u0000-\u001f\u007f]/.test(body.previousInteractionId)) {
      return { valid: false, error: "The previous chat interaction is invalid." };
    }
    previousInteractionId = body.previousInteractionId.trim() || undefined;
  }

  let attachment: ChatOptions["attachment"];
  if (body.attachment !== undefined && body.attachment !== null) {
    if (!isRecord(body.attachment) || !hasOnlyKeys(body.attachment, ["data", "mimeType"])) {
      return { valid: false, error: "The image attachment is invalid." };
    }
    const data = body.attachment.data;
    const mimeType = body.attachment.mimeType;
    if (typeof data !== "string" || data.length === 0 || data.length > MAX_CHAT_ATTACHMENT_BASE64_LENGTH || !isBase64(data) ||
      typeof mimeType !== "string" || !(CHAT_ATTACHMENT_MIME_TYPES as readonly string[]).includes(mimeType)) {
      return { valid: false, error: "Attach a valid PNG, JPEG, or WebP image smaller than 4 MB." };
    }
    attachment = { data, mimeType };
  }

  if (!message && !attachment) {
    return { valid: false, error: "Please provide a question or attach a study image." };
  }

  return {
    valid: true,
    request: {
      message,
      mode,
      ...(previousInteractionId ? { previousInteractionId } : {}),
      ...(attachment ? { attachment } : {}),
    },
  };
}

export function validateStudyPlanRequest(body: unknown): StudyPlanRequestValidation {
  if (!isRecord(body) || !hasOnlyKeys(body, ["subjects"])) {
    return { valid: false, error: "Study-plan request must contain only a subject list." };
  }
  if (body.subjects === undefined) {
    return { valid: true, subjects: [...DEFAULT_STUDY_SUBJECTS] };
  }
  if (!Array.isArray(body.subjects) || body.subjects.length > 8 ||
    body.subjects.some((subject) => typeof subject !== "string" || subject.trim().length === 0 || subject.trim().length > 100)) {
    return { valid: false, error: "Provide no more than 8 subject names, each between 1 and 100 characters." };
  }
  const subjects = [...new Set(body.subjects.map((subject) => (subject as string).trim()))];
  return { valid: true, subjects: subjects.length > 0 ? subjects : [...DEFAULT_STUDY_SUBJECTS] };
}

export function validateStudyPlanTasks(generated: unknown): StudyPlanTasksValidation {
  if (!Array.isArray(generated) || generated.length < 3 || generated.length > 5) {
    return { valid: false, tasks: [] };
  }
  const tasks: StudyPlanTask[] = [];
  for (const candidate of generated) {
    if (!isRecord(candidate)) return { valid: false, tasks: [] };
    const title = typeof candidate.title === "string" ? candidate.title.trim() : "";
    const subject = typeof candidate.subject === "string" ? candidate.subject.trim() : "";
    const reason = typeof candidate.reason === "string" ? candidate.reason.trim() : "";
    const durationMinutes = candidate.durationMinutes;
    const priority = candidate.priority;
    if (!title || title.length > 160 || !subject || subject.length > 100 || !reason || reason.length > 500 ||
      typeof durationMinutes !== "number" || !Number.isInteger(durationMinutes) || durationMinutes < 5 || durationMinutes > 120 ||
      (priority !== "high" && priority !== "medium" && priority !== "low")) {
      return { valid: false, tasks: [] };
    }
    tasks.push({
      id: `study-plan-${tasks.length + 1}`,
      title,
      subject,
      durationMinutes,
      priority,
      reason,
    });
  }
  return { valid: true, tasks };
}

export function validateChatResponse(response: unknown): ChatResponse | null {
  if (!isRecord(response) || typeof response.text !== "string") return null;
  const text = response.text.trim();
  if (!text || text.length > MAX_CHAT_RESPONSE_LENGTH) return null;
  let interactionId: string | undefined;
  if (response.interactionId !== undefined) {
    if (typeof response.interactionId !== "string" || response.interactionId.length > 256 ||
      /[\u0000-\u001f\u007f]/.test(response.interactionId)) return null;
    interactionId = response.interactionId;
  }
  return { text, ...(interactionId ? { interactionId } : {}) };
}

export function validatePracticeAdmissionRequest(request: PracticeGenerateRequest): number {
  return Math.max(1, Math.ceil(request.count / 5));
}
