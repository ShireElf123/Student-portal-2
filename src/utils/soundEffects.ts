/**
 * Child-friendly synthesized audio effects using Web Audio API.
 * 100% browser-native, zero external audio assets required.
 */

class SoundEffectManager {
  private ctx: AudioContext | null = null;
  private muted = false;

  constructor() {
    if (typeof window === "undefined") return;
    try {
      this.muted = window.localStorage.getItem("app_sfx_muted") === "true";
    } catch {
      this.muted = false;
    }
  }

  isMuted() {
    return this.muted;
  }

  setMuted(muted: boolean) {
    this.muted = muted;
    try {
      window.localStorage.setItem("app_sfx_muted", String(muted));
    } catch {
      // ignore quota / private mode
    }
  }

  private getContext(): AudioContext | null {
    if (typeof window === "undefined") return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  /**
   * Pleasant bubble pop sound for tapping items or bursting bubbles
   */
  playPop() {
    if (this.muted) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      // Fast sweep from 400Hz to 850Hz creates a crisp bubble pop
      osc.frequency.setValueAtTime(400, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.08);

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.09);
    } catch {
      // AudioContext unavailable or restricted
    }
  }

  /**
   * Cheerful 3-tone chime for correct quiz answers or star earned
   */
  playSuccessChime() {
    if (this.muted) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6 arpeggio

      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const noteTime = now + idx * 0.09;

        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, noteTime);

        gain.gain.setValueAtTime(0, noteTime);
        gain.gain.linearRampToValueAtTime(0.25, noteTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.35);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(noteTime);
        osc.stop(noteTime + 0.36);
      });
    } catch {
      // ignore
    }
  }

  /**
   * Playful twinkle for collecting stars
   */
  playStarSparkle() {
    if (this.muted) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const notes = [880, 1174.66, 1318.51, 1760]; // A5, D6, E6, A6

      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const noteTime = now + idx * 0.06;

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, noteTime);

        gain.gain.setValueAtTime(0.2, noteTime);
        gain.gain.exponentialRampToValueAtTime(0.01, noteTime + 0.2);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(noteTime);
        osc.stop(noteTime + 0.22);
      });
    } catch {
      // ignore
    }
  }

  /**
   * Soft, gentle wobble for retry (non-punitive, warm)
   */
  playGentleBoing() {
    if (this.muted) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.linearRampToValueAtTime(260, now + 0.15);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.18);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.2);
    } catch {
      // ignore
    }
  }

  /**
   * Fanfare celebration sound for finishing a game or quiz
   */
  playFanfare() {
    if (this.muted) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const chord = [523.25, 659.25, 783.99, 1046.5]; // C major chord

      chord.forEach((freq) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.005, now + 0.7);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.72);
      });
    } catch {
      // ignore
    }
  }

  /** Call from a tap so the first xylophone note is not waiting on autoplay unlock. */
  unlock() {
    const ctx = this.getContext();
    if (ctx && ctx.state === "suspended") {
      void ctx.resume().catch(() => {});
    }
  }

  /** Soft, mallet-like tone with a short attack and inharmonic xylophone overtones. */
  playXylophoneKey(freq: number) {
    if (this.muted) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      if (ctx.state === "suspended") {
        void ctx.resume().then(() => this.strikeXylophone(freq)).catch(() => {});
        return;
      }
      this.strikeXylophone(freq);
    } catch {
      // AudioContext unavailable or blocked by browser policy.
    }
  }

  private strikeXylophone(freq: number) {
    const ctx = this.ctx;
    if (!ctx) return;
    try {
      const now = ctx.state === "running" ? ctx.currentTime : ctx.currentTime + 0.02;
      const partials = [
        { ratio: 1, level: 0.22, decay: 0.62 },
        { ratio: 2.76, level: 0.075, decay: 0.19 },
        { ratio: 5.4, level: 0.022, decay: 0.09 },
      ];
      partials.forEach(({ ratio, level, decay }) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq * ratio, now);
        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.linearRampToValueAtTime(level, now + 0.008);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + decay);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + decay + 0.01);
      });
    } catch {
      // AudioContext unavailable or blocked by browser policy.
    }
  }

  /**
   * Cheerful balloon popping sound
   */
  playBalloonPop() {
    if (this.muted) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.exponentialRampToValueAtTime(1100, now + 0.05);

      gain.gain.setValueAtTime(0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.06);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.07);
    } catch {
      // ignore
    }
  }

  /**
   * Short buzz when a slow-finger trail hits the hot edge. Not a song.
   */
  playBuzz() {
    if (this.muted) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "square";
      osc2.type = "square";
      osc.frequency.setValueAtTime(92, now);
      osc2.frequency.setValueAtTime(108, now);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.16);
      osc.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc2.start(now);
      osc.stop(now + 0.17);
      osc2.stop(now + 0.17);
    } catch {
      // ignore
    }
  }

  /**
   * Shimmering cosmic chime for planetary discovery
   */
  playCosmicChime() {
    if (this.muted) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const freqs = [659.25, 830.61, 987.77, 1318.51]; // E major cosmic chord

      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const t = now + idx * 0.08;

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, t);

        gain.gain.setValueAtTime(0.18, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.6);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(t);
        osc.stop(t + 0.62);
      });
    } catch {
      // ignore
    }
  }

  /**
   * Short cartoon animal calls when an MP3 is missing. Not a recording —
   * chat cannot take MP3s, so Safari still has a duck/cow/bird sound.
   * Returns false for unknown animals or when muted / AudioContext is blocked.
   */
  playAnimalCall(animalId: string): boolean {
    if (this.muted) return false;
    if (animalId === "duck") return this.playDuckQuack();
    if (animalId === "cow") return this.playCowMoo();
    if (animalId === "bird") return this.playBirdChirp();
    return false;
  }

  private playDuckQuack(): boolean {
    try {
      const ctx = this.getContext();
      if (!ctx) return false;
      const now = ctx.currentTime;
      [0, 0.16].forEach((offset) => {
        const t = now + offset;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "square";
        osc.frequency.setValueAtTime(380, t);
        osc.frequency.exponentialRampToValueAtTime(220, t + 0.11);
        gain.gain.setValueAtTime(0.0001, t);
        gain.gain.linearRampToValueAtTime(0.12, t + 0.012);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.12);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 0.13);
      });
      return true;
    } catch {
      return false;
    }
  }

  private playCowMoo(): boolean {
    try {
      const ctx = this.getContext();
      if (!ctx) return false;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sawtooth";
      osc2.type = "triangle";
      osc.frequency.setValueAtTime(174, now);
      osc.frequency.linearRampToValueAtTime(130, now + 0.42);
      osc2.frequency.setValueAtTime(87, now);
      osc2.frequency.linearRampToValueAtTime(65, now + 0.42);
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(0.1, now + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.48);
      osc.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc2.start(now);
      osc.stop(now + 0.5);
      osc2.stop(now + 0.5);
      return true;
    } catch {
      return false;
    }
  }

  private playBirdChirp(): boolean {
    try {
      const ctx = this.getContext();
      if (!ctx) return false;
      const now = ctx.currentTime;
      [
        { start: 0, from: 1800, to: 2400 },
        { start: 0.1, from: 1600, to: 2100 },
      ].forEach(({ start, from, to }) => {
        const t = now + start;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(from, t);
        osc.frequency.exponentialRampToValueAtTime(to, t + 0.07);
        gain.gain.setValueAtTime(0.0001, t);
        gain.gain.linearRampToValueAtTime(0.14, t + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.08);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 0.09);
      });
      return true;
    } catch {
      return false;
    }
  }
}

export const soundEffects = new SoundEffectManager();
