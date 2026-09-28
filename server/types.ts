export interface ChatOptions {
  message: string;
  previousInteractionId?: string;
  mode?: string;
  attachment?: {
    data: string;
    mimeType: string;
  };
}

export interface ChatResponse {
  text: string;
  interactionId?: string;
}

export interface PracticeQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  hint?: string;
}

export interface PracticeGenerateRequest {
  subject: string;
  topic: string;
  difficulty: "easy" | "medium" | "hard";
  count: number;
}

export interface StudyPlanTask {
  id: string;
  title: string;
  subject: string;
  durationMinutes: number;
  priority: "high" | "medium" | "low";
  reason: string;
}

export interface AIProvider {
  name: string;
  chat(options: ChatOptions): Promise<ChatResponse>;
  chatStream(
    options: ChatOptions,
    onChunk: (text: string) => void
  ): Promise<{ interactionId?: string }>;
  generateJSON<T>(prompt: string, systemInstruction?: string): Promise<T>;
}
