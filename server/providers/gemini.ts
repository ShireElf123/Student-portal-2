import { GoogleGenAI } from "@google/genai";
import { AIProvider, ChatOptions, ChatResponse } from "../types";

export const SYSTEM_INSTRUCTIONS: Record<string, string> = {
  socratic:
    "You are the Socratic Academic Tutor in 'My Student Portal'. Do not simply hand over the complete final answer. Instead, ask guided questions, break complex problems into manageable sub-steps, point out underlying principles, and praise active student thinking. Guide the student so they arrive at the solution themselves.",
  stem:
    "You are the Lead STEM & Code Specialist in 'My Student Portal'. Provide rigorous, step-by-step mathematical proofs, clear equation derivations, and production-grade code. Explain time and space complexity, annotate code clearly, and provide sanity check test cases.",
  writing:
    "You are the Humanities & Essay Writing Coach in 'My Student Portal'. Focus on thesis clarity, logical paragraph transitions, rhetorical arguments, active voice, and academic tone. Offer specific edits, vocabulary upgrades, and formatting guidance (APA, MLA, Chicago).",
  flashcards:
    "You are the Active Recall & Exam Prep Coach in 'My Student Portal'. Turn topics into high-yield study flashcards, summary cheat-sheets, mnemonics, and practice quiz questions with clear answers and explanations.",
  teacher:
    "You are the Educator & Curriculum Specialist in 'My Student Portal'. Help teachers design 4-level scoring rubrics, differentiated lesson plans, classroom activities, and constructive student feedback aligned with standard educational benchmarks.",
  general:
    "You are the Senior Academic Advisor for 'My Student Portal'. Provide clear, authoritative, and structured guidance on any academic subject, research methodology, study scheduling, and learning strategies.",
};

export const RESILIENT_MODELS = [
  "gemini-3.6-flash",
  "gemini-3.7-flash",
  "gemini-3.8-flash",
  "gemini-flash-latest",
  "gemini-3.1-flash-lite",
];

export function extractAndParseJSON<T>(raw: string): T {
  if (!raw || !raw.trim()) {
    throw new Error("AI returned empty output; expected JSON response.");
  }

  let text = raw.trim();

  // Strip markdown code fences if present
  const fenceMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  if (fenceMatch && fenceMatch[1]) {
    text = fenceMatch[1].trim();
  }

  // Attempt direct JSON parse
  try {
    return JSON.parse(text) as T;
  } catch {
    // If direct parse fails, isolate outer JSON array or object
    const firstBrace = text.indexOf("{");
    const lastBrace = text.lastIndexOf("}");
    const firstBracket = text.indexOf("[");
    const lastBracket = text.lastIndexOf("]");

    let start = -1;
    let end = -1;

    if (firstBracket !== -1 && lastBracket !== -1 && (firstBrace === -1 || firstBracket < firstBrace)) {
      start = firstBracket;
      end = lastBracket;
    } else if (firstBrace !== -1 && lastBrace !== -1) {
      start = firstBrace;
      end = lastBrace;
    }

    if (start !== -1 && end !== -1 && end > start) {
      const extracted = text.substring(start, end + 1);
      try {
        return JSON.parse(extracted) as T;
      } catch (parseErr: any) {
        throw new Error(`Failed to parse extracted JSON from AI response: ${parseErr.message}. Preview: ${extracted.slice(0, 150)}`);
      }
    }

    throw new Error(`Malformed AI output: No valid JSON object or array found in response. Raw snippet: ${text.slice(0, 150)}`);
  }
}

export class GeminiProvider implements AIProvider {
  name = "gemini";
  private ai: GoogleGenAI | null = null;

  private getClient(): GoogleGenAI {
    if (!this.ai) {
      const apiKey = process.env.GEMINI_API_KEY || "";
      this.ai = new GoogleGenAI({ apiKey });
    }
    return this.ai;
  }

  private buildInputPayload(message: string, attachment?: { data: string; mimeType: string }) {
    const trimmed = (message || "").trim();
    if (attachment && attachment.data && attachment.mimeType) {
      return [
        {
          type: "image",
          data: attachment.data,
          mime_type: attachment.mimeType,
        },
        {
          type: "text",
          text: trimmed || "Please analyze this attached problem, diagram, or document in detail.",
        },
      ];
    }
    return trimmed;
  }

  async chat(options: ChatOptions): Promise<ChatResponse> {
    const ai = this.getClient();
    const inputPayload = this.buildInputPayload(options.message, options.attachment);
    const systemInstruction = SYSTEM_INSTRUCTIONS[options.mode || "general"] || SYSTEM_INSTRUCTIONS.general;

    let lastError: any = null;
    for (const modelName of RESILIENT_MODELS) {
      try {
        const interaction = await ai.interactions.create({
          model: modelName,
          input: inputPayload as any,
          system_instruction: systemInstruction,
          previous_interaction_id: options.previousInteractionId || undefined,
          store: true,
        });

        let fullOutput = "";
        if (Array.isArray(interaction.steps)) {
          for (const step of interaction.steps) {
            if (step.type === "model_output") {
              const textContent = step.content?.find((c: any) => c && (c as any).type === "text") as any;
              if (textContent && typeof textContent.text === "string") {
                fullOutput += textContent.text;
              }
            }
          }
        }

        const responseText = fullOutput || interaction.output_text || "Analysis completed.";
        return {
          text: responseText,
          interactionId: interaction.id,
        };
      } catch (error: any) {
        lastError = error;
        const isModelError =
          error.message?.includes("404") ||
          error.message?.includes("not found") ||
          error.message?.includes("quota") ||
          error.message?.includes("RESOURCE_EXHAUSTED") ||
          error.message?.includes("unsupported");
        if (isModelError) {
          console.warn(`Model ${modelName} unavailable for chat, trying fallback...`);
          continue;
        }
        throw error;
      }
    }
    throw lastError || new Error("Failed to execute chat with available Gemini models.");
  }

  async chatStream(
    options: ChatOptions,
    onChunk: (text: string) => void
  ): Promise<{ interactionId?: string }> {
    const ai = this.getClient();
    const inputPayload = this.buildInputPayload(options.message, options.attachment);
    const systemInstruction = SYSTEM_INSTRUCTIONS[options.mode || "general"] || SYSTEM_INSTRUCTIONS.general;

    let lastError: any = null;
    let streamedTokens = false;

    for (const modelName of RESILIENT_MODELS) {
      try {
        const stream = await ai.interactions.create({
          model: modelName,
          input: inputPayload as any,
          system_instruction: systemInstruction,
          previous_interaction_id: options.previousInteractionId || undefined,
          store: true,
          stream: true,
        });

        let interactionId: string | undefined = undefined;

        for await (const event of stream) {
          if (event.event_type === "interaction.created" && event.interaction?.id) {
            interactionId = event.interaction.id;
          }
          if (event.event_type === "interaction.status_update" && (event as any).interaction_id) {
            interactionId = (event as any).interaction_id;
          }
          if (event.event_type === "step.delta" && event.delta?.type === "text" && event.delta?.text) {
            streamedTokens = true;
            onChunk(event.delta.text);
          }
          if (event.event_type === "interaction.completed" && (event as any).interaction?.id) {
            interactionId = (event as any).interaction.id;
          }
          if (event.event_type === "error") {
            throw new Error((event as any).error?.message || "Model error in stream");
          }
        }

        return { interactionId };
      } catch (err: any) {
        lastError = err;
        console.warn(`Streaming failed on ${modelName}:`, err.message || err);
        if (streamedTokens) {
          throw err;
        }
      }
    }
    throw lastError || new Error("Failed to stream response from available Gemini models.");
  }

  async generateJSON<T>(prompt: string, systemInstruction?: string): Promise<T> {
    const ai = this.getClient();
    let lastError: any = null;

    const fullInstruction = `${systemInstruction ? systemInstruction + "\n" : ""}CRITICAL: You must return ONLY raw valid JSON adhering to the requested schema. Do not enclose in conversational text, preface, or outro.`;

    for (const modelName of RESILIENT_MODELS) {
      try {
        const interaction = await ai.interactions.create({
          model: modelName,
          input: prompt,
          system_instruction: fullInstruction,
          store: false,
        });

        let fullOutput = "";
        if (Array.isArray(interaction.steps)) {
          for (const step of interaction.steps) {
            if (step.type === "model_output") {
              const textContent = step.content?.find((c: any) => c && (c as any).type === "text") as any;
              if (textContent && typeof textContent.text === "string") {
                fullOutput += textContent.text;
              }
            }
          }
        }

        const raw = fullOutput || interaction.output_text || "";
        return extractAndParseJSON<T>(raw);
      } catch (error: any) {
        lastError = error;
        const isModelError =
          error.message?.includes("404") ||
          error.message?.includes("not found") ||
          error.message?.includes("quota") ||
          error.message?.includes("RESOURCE_EXHAUSTED") ||
          error.message?.includes("unsupported");
        if (isModelError) {
          console.warn(`Model ${modelName} unavailable for generateJSON, trying fallback...`);
          continue;
        }
        throw error;
      }
    }
    throw lastError || new Error("Failed to generate JSON with available Gemini models.");
  }
}
