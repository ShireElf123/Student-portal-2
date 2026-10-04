/**
 * Speech synthesis utility for Toddler and Primary school learning.
 * Uses the best available English system voice with a user-selectable override.
 * Speech quality depends on voices installed by the browser/operating system.
 */

export interface VoiceProfile {
  id: string;
  label: string;
  preferredLanguage: string;
  preferredGender: "male" | "female" | "neutral";
  preferredFamily: "guy" | "natural-male" | "friendly-coach" | "system-default";
  fallbackOrder: string[];
  pitch: number;
  rate: number;
  volume: number;
}

export interface VoicePersona {
  id: string;
  name: string;
  description: string;
  emoji: string;
  pitch: number;
  rate: number;
}

export const VOICE_PERSONAS: VoicePersona[] = [
  {
    id: "storybook-grandparent",
    name: "Warm Storyteller",
    description: "Gentle, measured, and soothing for bedtime and picture books",
    emoji: "📖",
    pitch: 0.90,
    rate: 0.88,
  },
  {
    id: "playful-coach",
    name: "Energetic Playmate",
    description: "Upbeat, cheerful, and encouraging for math sprints and arcade games",
    emoji: "⚡",
    pitch: 1.12,
    rate: 1.02,
  },
  {
    id: "socratic-mentor",
    name: "Gentle Homework Mentor",
    description: "Clear, thoughtful, and patient for problem-solving",
    emoji: "🦉",
    pitch: 0.98,
    rate: 0.92,
  },
  {
    id: "cosmic-explorer",
    name: "Cosmic Science Guide",
    description: "Adventurous and vivid for space and science exploration",
    emoji: "🚀",
    pitch: 1.04,
    rate: 0.96,
  },
];

export function getActivePersona(): VoicePersona {
  try {
    const saved = localStorage.getItem("app_voice_persona_id");
    if (saved) {
      const found = VOICE_PERSONAS.find((p) => p.id === saved);
      if (found) return found;
    }
  } catch {}
  return VOICE_PERSONAS[0];
}

export function setActivePersona(personaId: string): void {
  try {
    localStorage.setItem("app_voice_persona_id", personaId);
  } catch {}
}

export const DEFAULT_VOICE_PROFILE: VoiceProfile = {
  id: "guy-natural-coach",
  label: "Friendly learning voice",
  preferredLanguage: "en-US",
  preferredGender: "neutral",
  preferredFamily: "system-default",
  fallbackOrder: [
    "natural",
    "neural",
    "en-us",
    "en-us",
    "en-gb",
  ],
  pitch: 0.98,
  rate: 0.94,
  volume: 1.0,
};

export interface SpeakOptions {
  rate?: number;
  pitch?: number;
  lang?: string;
  voiceURI?: string;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (err: unknown) => void;
  timeoutFallbackMs?: number;
  profile?: VoiceProfile;
  isRetry?: boolean;
}

export type SpeechListener = (isSpeaking: boolean) => void;

/**
 * SpeechProvider interface: allows swapping between Browser WebSpeech
 * and future Cloud TTS services seamlessly.
 */
export interface SpeechProvider {
  readonly id: string;
  readonly name: string;
  isAvailable(): boolean;
  speak(text: string, options?: SpeakOptions, profile?: VoiceProfile): boolean;
  stop(): void;
  isSpeaking(): boolean;
}

/** Scores language fit and signals of a higher-quality installed system voice. */
export function scoreVoiceForNaturalSpeech(voice: SpeechSynthesisVoice): number {
  const name = (voice.name || "").toLowerCase();
  const lang = (voice.lang || "").toLowerCase();
  if (!lang.startsWith("en")) return -9999;
  let score = 100;
  if (lang.startsWith("en-us")) score += 30;
  else if (lang.startsWith("en-gb") || lang.startsWith("en-au") || lang.startsWith("en-za")) score += 20;
  if (voice.default) score += 40;
  if (name.includes("natural") || name.includes("neural") || name.includes("online") || name.includes("wavenet")) score += 250;
  if (name.includes("compact") || name.includes("legacy")) score -= 50;
  return score;
}

class SpeechCoordinator {
  private activeToken: number = 0;
  private isCurrentlySpeaking: boolean = false;
  private safetyTimer: NodeJS.Timeout | null = null;
  private activeUtterance: SpeechSynthesisUtterance | null = null;
  private listeners: Set<SpeechListener> = new Set();
  private voiceChangeListeners: Set<() => void> = new Set();
  private isVoiceMuted: boolean = false;
  private cachedVoices: SpeechSynthesisVoice[] = [];
  private preferredVoiceURI: string | null = null;
  private activeProfile: VoiceProfile = { ...DEFAULT_VOICE_PROFILE };

  constructor() {
    if (typeof window !== "undefined") {
      try {
        const savedMute = localStorage.getItem("app_voice_muted");
        if (savedMute === "true") {
          this.isVoiceMuted = true;
        }
        this.preferredVoiceURI = localStorage.getItem("app_preferred_voice_uri") || null;
      } catch {
        // ignore
      }

      this.initVoices();
    }
  }

  public getVoiceProfile(): VoiceProfile {
    return this.activeProfile;
  }

  public setVoiceProfile(profile: Partial<VoiceProfile>): void {
    this.activeProfile = {
      ...this.activeProfile,
      ...profile,
    };
    this.notifyVoiceChange();
  }

  private initVoices(): void {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    const updateVoices = () => {
      try {
        const voices = window.speechSynthesis.getVoices();
        if (voices && voices.length > 0) {
          this.cachedVoices = voices;
          this.notifyVoiceChange();
        }
      } catch {
        // ignore
      }
    };

    updateVoices();
    window.speechSynthesis.onvoiceschanged = updateVoices;

    // Mobile fallback poll (many Android browsers populate getVoices after a short delay)
    setTimeout(updateVoices, 300);
    setTimeout(updateVoices, 1000);
  }

  private notifyVoiceChange(): void {
    this.voiceChangeListeners.forEach((l) => {
      try {
        l();
      } catch {
        // ignore
      }
    });
  }

  public subscribeVoiceChange(listener: () => void): () => void {
    this.voiceChangeListeners.add(listener);
    return () => {
      this.voiceChangeListeners.delete(listener);
    };
  }

  public getAvailableVoices(): SpeechSynthesisVoice[] {
    if (this.cachedVoices.length > 0) return this.cachedVoices;
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      this.cachedVoices = window.speechSynthesis.getVoices() || [];
    }
    return this.cachedVoices;
  }

  public getPreferredVoiceURI(): string | null {
    return this.preferredVoiceURI;
  }

  public setPreferredVoiceURI(uri: string | null): void {
    this.preferredVoiceURI = uri;
    try {
      if (uri) {
        localStorage.setItem("app_preferred_voice_uri", uri);
      } else {
        localStorage.removeItem("app_preferred_voice_uri");
      }
    } catch {
      // ignore
    }
    this.notifyVoiceChange();
  }

  /**
   * Selects a high-quality installed English voice unless the user chose one.
   */
  public getBestVoice(): SpeechSynthesisVoice | null {
    const voices = this.getAvailableVoices();
    if (!voices || voices.length === 0) return null;

    // 1. If user explicitly chose a preferred voice URI, use it
    if (this.preferredVoiceURI) {
      const explicit = voices.find((v) => v.voiceURI === this.preferredVoiceURI);
      if (explicit) return explicit;
    }

    // 2. Score available English voices by language fit and natural-speech hints
    const scored = voices
      .filter((v) => (v.lang || "").toLowerCase().startsWith("en"))
      .map((v) => ({ voice: v, score: scoreVoiceForNaturalSpeech(v) }))
      .sort((a, b) => b.score - a.score);

    if (scored.length > 0 && scored[0].score > -1000) {
      return scored[0].voice;
    }

    // 3. Fallback to any voice with score > -1000 or first English voice
    const fallback = voices.find((v) => (v.lang || "").toLowerCase().startsWith("en")) || voices[0];
    return fallback || null;
  }

  public getActiveVoiceInfo(): {
    name: string;
    lang: string;
    isGuy: boolean;
    isMale: boolean;
    voiceURI: string;
  } {
    const voice = this.getBestVoice();
    if (!voice) {
      return {
        name: "Standard Voice Engine",
        lang: "en-US",
        isGuy: false,
        isMale: true,
        voiceURI: "",
      };
    }

    const nameLower = voice.name.toLowerCase();
    const isGuy = nameLower.includes("guy");
    const isMale =
      isGuy ||
      nameLower.includes("male") ||
      voice.voiceURI.toLowerCase().includes("male");

    return {
      name: voice.name,
      lang: voice.lang,
      isGuy,
      isMale,
      voiceURI: voice.voiceURI,
    };
  }

  public isMuted(): boolean {
    return this.isVoiceMuted;
  }

  public setMuted(muted: boolean): void {
    this.isVoiceMuted = muted;
    try {
      localStorage.setItem("app_voice_muted", String(muted));
    } catch {
      // ignore
    }
    if (muted) {
      this.stop();
    }
  }

  public isSpeaking(): boolean {
    return this.isCurrentlySpeaking;
  }

  public subscribe(listener: SpeechListener): () => void {
    this.listeners.add(listener);
    listener(this.isCurrentlySpeaking);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify(speaking: boolean) {
    this.isCurrentlySpeaking = speaking;
    this.listeners.forEach((l) => {
      try {
        l(speaking);
      } catch {
        // ignore
      }
    });
  }

  public stop(): void {
    this.activeToken++;
    if (this.safetyTimer) {
      clearTimeout(this.safetyTimer);
      this.safetyTimer = null;
    }

    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {
        // Safely ignore cancel failures in restricted browser iframes
      }
    }

    this.activeUtterance = null;
    if (this.isCurrentlySpeaking) {
      this.notify(false);
    }
  }

  public speak(text: string, options?: SpeakOptions): boolean {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      // Headless test or SSR environments - finish silently
      options?.onEnd?.();
      return false;
    }

    if (this.isVoiceMuted) {
      options?.onEnd?.();
      return false;
    }

    const cleanText = (text || "").trim();
    if (!cleanText) {
      options?.onEnd?.();
      return false;
    }

    // Cancel any current utterance and increment token so stale callbacks don't fire
    this.stop();

    // Android Chromium fix: unpause if paused
    try {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }
    } catch {
      // ignore
    }

    const token = ++this.activeToken;

    // Generous spacing (100ms) before triggering speech prevents WebKit / Chromium audio collisions
    setTimeout(() => {
      if (token !== this.activeToken) {
        return;
      }

      try {
        if (window.speechSynthesis.paused) {
          window.speechSynthesis.resume();
        }

        const utterance = new SpeechSynthesisUtterance(cleanText);
        this.activeUtterance = utterance;

        // Respect an explicit user choice; otherwise use the best installed English voice
        const selectedVoice = options?.voiceURI
          ? this.getAvailableVoices().find((v) => v.voiceURI === options.voiceURI) || this.getBestVoice()
          : this.getBestVoice();

        if (selectedVoice) {
          utterance.voice = selectedVoice;
          utterance.lang = selectedVoice.lang || "en-US";
        } else {
          utterance.lang = options?.lang ?? "en-US";
        }

        const persona = getActivePersona();
        // Keep pitch within a comfortable range; browser voices vary considerably by device.
        let naturalPitch = persona.pitch;
        if (typeof options?.pitch === "number") {
          naturalPitch = Math.max(0.80, Math.min(1.20, options.pitch));
        }
        utterance.pitch = naturalPitch;

        // Pacing based on selected persona; callers may request a custom rate.
        let naturalRate = persona.rate;
        if (typeof options?.rate === "number") {
          naturalRate = Math.max(0.80, Math.min(1.20, options.rate));
        }
        utterance.rate = naturalRate;

        let hasFinished = false;

        const handleFinish = () => {
          if (hasFinished) return;
          hasFinished = true;

          if (this.safetyTimer) {
            clearTimeout(this.safetyTimer);
            this.safetyTimer = null;
          }

          if (token === this.activeToken) {
            this.activeUtterance = null;
            this.notify(false);
            try {
              options?.onEnd?.();
            } catch (cbErr) {
              console.warn("Speech onEnd callback error:", cbErr);
            }
          }
        };

        utterance.onstart = () => {
          if (token === this.activeToken) {
            this.notify(true);
            try {
              options?.onStart?.();
            } catch {
              // ignore
            }
          }
        };

        utterance.onend = () => {
          handleFinish();
        };

        utterance.onerror = (e) => {
          // If active utterance was interrupted or canceled by browser audio pipeline reset, retry once smoothly
          if (
            token === this.activeToken &&
            (e.error === "canceled" || e.error === "interrupted") &&
            !hasFinished &&
            !options?.isRetry
          ) {
            hasFinished = true;
            if (this.safetyTimer) {
              clearTimeout(this.safetyTimer);
              this.safetyTimer = null;
            }
            setTimeout(() => {
              if (token === this.activeToken) {
                this.speak(cleanText, { ...options, isRetry: true });
              }
            }, 140);
            return;
          }

          // Browser autoplay / sandbox restriction or normal interruption
          if (e.error !== "canceled" && e.error !== "interrupted" && e.error !== "not-allowed") {
            // Only report truly abnormal speech synthesis errors
            options?.onError?.(e);
          } else {
            options?.onError?.(e);
          }
          handleFinish();
        };

        // Safety fallback timer: calculate based on text length (avg 12 chars per second at rate 0.94)
        const calculatedMs = Math.max(2500, Math.ceil((cleanText.length / 10) * 1000) + 1400);
        const timeoutDuration = options?.timeoutFallbackMs ?? calculatedMs;

        this.safetyTimer = setTimeout(() => {
          if (token === this.activeToken && !hasFinished) {
            handleFinish();
          }
        }, timeoutDuration);

        // Keep a reference on window to prevent Chrome garbage-collecting active utterance prematurely
        (window as unknown as { __activeSpeechUtterance?: SpeechSynthesisUtterance }).__activeSpeechUtterance = utterance;

        window.speechSynthesis.speak(utterance);
      } catch (err) {
        console.warn("Failed to speak text:", err);
        this.notify(false);
        options?.onError?.(err);
        options?.onEnd?.();
      }
    }, 100);

    return true;
  }
}

export const speechCoordinator = new SpeechCoordinator();

export function speakText(text: string, options?: SpeakOptions): boolean {
  return speechCoordinator.speak(text, options);
}

export function stopSpeaking(): void {
  speechCoordinator.stop();
}

export function isSpeaking(): boolean {
  return speechCoordinator.isSpeaking();
}

export function isVoiceMuted(): boolean {
  return speechCoordinator.isMuted();
}

export function setVoiceMuted(muted: boolean): void {
  speechCoordinator.setMuted(muted);
}

export function getAvailableVoices(): SpeechSynthesisVoice[] {
  return speechCoordinator.getAvailableVoices();
}

export function getActiveVoiceInfo() {
  return speechCoordinator.getActiveVoiceInfo();
}

export function setPreferredVoiceURI(uri: string | null): void {
  speechCoordinator.setPreferredVoiceURI(uri);
}

export function getPreferredVoiceURI(): string | null {
  return speechCoordinator.getPreferredVoiceURI();
}

export function subscribeVoiceChange(listener: () => void): () => void {
  return speechCoordinator.subscribeVoiceChange(listener);
}

export function testVoice(sampleText?: string): void {
  const info = getActiveVoiceInfo();
  const text =
    sampleText ||
    `Hello there! I am your AI learning coach. Ready to explore and learn together today?`;
  speakText(text);
}

export function getVoiceProfile(): VoiceProfile {
  return speechCoordinator.getVoiceProfile();
}

export function setVoiceProfile(profile: Partial<VoiceProfile>): void {
  speechCoordinator.setVoiceProfile(profile);
}

export class BrowserSpeechProvider implements SpeechProvider {
  readonly id = "browser-webspeech";
  readonly name = "Browser WebSpeech Engine";

  isAvailable(): boolean {
    return typeof window !== "undefined" && "speechSynthesis" in window;
  }

  speak(text: string, options?: SpeakOptions, profile?: VoiceProfile): boolean {
    return speechCoordinator.speak(text, { ...options, profile });
  }

  stop(): void {
    speechCoordinator.stop();
  }

  isSpeaking(): boolean {
    return speechCoordinator.isSpeaking();
  }
}

export class FutureCloudSpeechProvider implements SpeechProvider {
  readonly id = "cloud-tts-future";
  readonly name = "Central Cloud Neural Voice (Readiness Seam)";

  isAvailable(): boolean {
    // Cloud provider seam ready for server-side neural TTS when configured
    return false;
  }

  speak(_text: string, _options?: SpeakOptions, _profile?: VoiceProfile): boolean {
    console.info(
      "FutureCloudSpeechProvider: Cloud TTS server not provisioned, using BrowserSpeechProvider."
    );
    return false;
  }

  stop(): void {}

  isSpeaking(): boolean {
    return false;
  }
}

export const activeSpeechProvider: SpeechProvider = new BrowserSpeechProvider();

