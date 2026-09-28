import { AIProvider } from "./types";
import { GeminiProvider } from "./providers/gemini";

class AIService {
  private activeProvider: AIProvider;

  constructor() {
    this.activeProvider = new GeminiProvider();
  }

  getProvider(): AIProvider {
    return this.activeProvider;
  }

  async chat(options: Parameters<AIProvider["chat"]>[0]) {
    return this.activeProvider.chat(options);
  }

  async chatStream(
    options: Parameters<AIProvider["chatStream"]>[0],
    onChunk: Parameters<AIProvider["chatStream"]>[1]
  ) {
    return this.activeProvider.chatStream(options, onChunk);
  }

  async generateJSON<T>(prompt: string, systemInstruction?: string) {
    return this.activeProvider.generateJSON<T>(prompt, systemInstruction);
  }
}

export const aiService = new AIService();
