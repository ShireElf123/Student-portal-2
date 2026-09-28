/**
 * Speech synthesis utility for Toddler and Primary school learning.
 * Prioritizes high-clarity, advanced natural male voices ("Microsoft Guy", "Google Male", "Natural Male")
 * with warm human-frequency acoustic tuning (anti-robotic pitch normalization),
 * structured VoiceProfile management, SpeechProvider abstraction,
 * and seamless Android / Vivo / PC cross-device support.
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

export const DEFAULT_MALE_COACH_PROFILE: VoiceProfile = {
  id: "guy-natural-coach",
  label: "Friendly Guy Coach (Natural Male)",
  preferredLanguage: "en-US",
  preferredGender: "male",
  preferredFamily: "guy",
  fallbackOrder: [
    "guy",
    "microsoft guy",
    "natural male",
    "google us english male",
    "en-us-x-iom",
    "en-us-x-iol",
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

/**
 * Evaluates and scores voices to strictly prioritize advanced natural male voices ("Guy", "Natural Male")
 * and prevent robotic/tinny female synthetic fallbacks on Android and PC.
 */
export function scoreVoiceForMalePreference(voice: SpeechSynthesisVoice): number {
  let score = 0;
  const name = (voice.name || "").toLowerCase();
  const uri = (voice.voiceURI || "").toLowerCase();
  const lang = (voice.lang || "").toLowerCase();

  // Primary preference for English speech in the learning app
  if (!lang.startsWith("en")) {
    return -9999;
  }

  // 1. Direct match for "Guy" - the PC Microsoft Guy (Natural) voice the user specifically requested!
  if (name.includes("guy") || uri.includes("guy")) {
    score += 8000;
  }

  // 2. High-quality Neural / Natural male voices
  const isNatural = name.includes("natural") || name.includes("online") || name.includes("neural") || name.includes("wavenet");
  if (isNatural) {
    score += 1500;
  }

  // 3. Explicit Male indicators in voice name or URI (common in Android / Google Speech Services)
  if (
    name.includes("male") ||
    uri.includes("male") ||
    uri.includes("#male") ||
    uri.includes("-male") ||
    name.includes("(male)")
  ) {
    score += 3500;
  }

  // 4. Android Google TTS Male Voice IDs (e.g. on Vivo / Android devices)
  if (
    uri.includes("en-us-x-iom") ||
    uri.includes("en-us-x-iol") ||
    uri.includes("en-us-x-tpd") ||
    uri.includes("en-gb-x-rjs") ||
    uri.includes("en-au-x-afh")
  ) {
    score += 3000;
  }

  // 5. Popular high-quality English male voices
  const malePersonas = [
    "christopher",
    "ryan",
    "eric",
    "david",
    "daniel",
    "george",
    "oliver",
    "arthur",
    "james",
    "matthew",
    "brian",
    "alex",
    "aaron",
    "richard",
    "fred",
    "tom",
    "mark",
    "stephen",
  ];
  for (const persona of malePersonas) {
    if (name.includes(persona) || uri.includes(persona)) {
      score += 2000;
      break;
    }
  }

  // Dialect affinity (en-US slightly preferred for curricular consistency)
  if (lang.startsWith("en-us")) {
    score += 100;
  } else if (lang.startsWith("en-gb") || lang.startsWith("en-au")) {
    score += 60;
  }

  // 6. HEAVY PENALTIES FOR FEMALE / ROBOTIC IDENTIFIERS
  // Prevents Android from falling back to robotic/metallic female voices
  const femaleIndicators = [
    "female",
    "woman",
    "samantha",
    "victoria",
    "karen",
    "jenny",
    "zira",
    "hazel",
    "susan",
    "linda",
    "catherine",
    "helen",
    "fiona",
    "moira",
    "tessa",
    "alice",
    "aria",
    "ava",
    "emma",
    "en-us-x-sfg#female",
    "en-us-x-sfg",
    "#female",
  ];
  for (const fIndicator of femaleIndicators) {
    if (name.includes(fIndicator) || uri.includes(fIndicator)) {
      score -= 5000;
      break;
    }
  }

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
  private activeProfile: VoiceProfile = { ...DEFAULT_MALE_COACH_PROFILE };

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
   * Selects the highest-rated natural male voice ("Guy" or equivalent).
   */
  public getBestVoice(): SpeechSynthesisVoice | null {
    const voices = this.getAvailableVoices();
    if (!voices || voices.length === 0) return null;

    // 1. If user explicitly chose a preferred voice URI, use it
    if (this.preferredVoiceURI) {
      const explicit = voices.find((v) => v.voiceURI === this.preferredVoiceURI);
      if (explicit) return explicit;
    }

    // 2. Score and sort all English voices by male/natural preference
    const scored = voices
      .filter((v) => (v.lang || "").toLowerCase().startsWith("en"))
      .map((v) => ({ voice: v, score: scoreVoiceForMalePreference(v) }))
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
      voice.voiceURI.toLowerCase().includes("male") ||
      scoreVoiceForMalePreference(voice) >= 1500;

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
      } catch (err) {
        console.warn("Error cancelling speech synthesis:", err);
      }
    }

    this.activeUtterance = null;
    if (this.isCurrentlySpeaking) {
      this.notify(false);
    }
  }

  public speak(text: string, options?: SpeakOptions): boolean {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      console.warn("Speech synthesis not supported in this browser environment.");
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

        // Choose best voice (prioritizing Microsoft Guy / Natural Male)
        const selectedVoice = options?.voiceURI
          ? this.getAvailableVoices().find((v) => v.voiceURI === options.voiceURI) || this.getBestVoice()
          : this.getBestVoice();

        if (selectedVoice) {
          utterance.voice = selectedVoice;
          utterance.lang = selectedVoice.lang || "en-US";
        } else {
          utterance.lang = options?.lang ?? "en-US";
        }

        // ACOUSTIC NORMALIZATION (Anti-"Too AI" algorithm):
        // Natural human male speech sits at ~100-120 Hz. High pitches (1.2-1.4) sound like robotic screeching.
        // We set optimal warm baseline pitch at 0.98. If options.pitch is specified, we scale it gently
        // so enthusiastic game lines sound cheerful without distorting into an artificial robot.
        let naturalPitch = 0.98;
        if (typeof options?.pitch === "number") {
          // Scale requests (e.g. 1.25 -> 1.02, 1.1 -> 0.99)
          naturalPitch = Math.max(0.92, Math.min(1.04, 0.96 + (options.pitch - 1.0) * 0.22));
        }
        utterance.pitch = naturalPitch;

        // Conversational, articulate pacing
        let naturalRate = 0.94;
        if (typeof options?.rate === "number") {
          naturalRate = Math.max(0.85, Math.min(1.15, options.rate));
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

          if (e.error !== "canceled" && e.error !== "interrupted") {
            console.warn("Speech synthesis utterance error:", e);
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

