import React, { useState, useEffect } from "react";
import {
  Volume2,
  VolumeX,
  Sparkles,
  Check,
  Smartphone,
  Monitor,
  RefreshCw,
  Play,
  Square,
  X,
  Info,
} from "lucide-react";
import {
  getActiveVoiceInfo,
  getAvailableVoices,
  getPreferredVoiceURI,
  setPreferredVoiceURI,
  testVoice,
  stopSpeaking,
  isSpeaking,
  isVoiceMuted,
  setVoiceMuted,
  subscribeVoiceChange,
  speechCoordinator,
} from "../utils/speechUtils";

interface VoiceSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function VoiceSettingsModal({ isOpen, onClose }: VoiceSettingsModalProps) {
  const [voiceInfo, setVoiceInfo] = useState(getActiveVoiceInfo());
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>(getAvailableVoices());
  const [preferredURI, setPreferredURI] = useState<string | null>(getPreferredVoiceURI());
  const [speaking, setSpeaking] = useState<boolean>(isSpeaking());
  const [muted, setMuted] = useState<boolean>(isVoiceMuted());
  const [testPhrase, setTestPhrase] = useState<string>(
    "Hello there! I'm your AI learning coach. Today we are exploring math, science, and reading together!"
  );

  useEffect(() => {
    const unsubSpeech = speechCoordinator.subscribe((spk) => {
      setSpeaking(spk);
    });

    const unsubVoices = subscribeVoiceChange(() => {
      setVoiceInfo(getActiveVoiceInfo());
      setVoices(getAvailableVoices());
      setPreferredURI(getPreferredVoiceURI());
    });

    return () => {
      unsubSpeech();
      unsubVoices();
    };
  }, []);

  if (!isOpen) return null;

  const englishVoices = voices.filter((v) => (v.lang || "").toLowerCase().startsWith("en"));
  const otherVoices = voices.filter((v) => !(v.lang || "").toLowerCase().startsWith("en"));

  const handleSelectVoice = (uri: string) => {
    if (uri === "auto") {
      setPreferredVoiceURI(null);
      setPreferredURI(null);
    } else {
      setPreferredVoiceURI(uri);
      setPreferredURI(uri);
    }
    setVoiceInfo(getActiveVoiceInfo());
  };

  const handleToggleMute = () => {
    const next = !muted;
    setMuted(next);
    setVoiceMuted(next);
  };

  const handleTest = () => {
    if (speaking) {
      stopSpeaking();
    } else {
      testVoice(testPhrase);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border-2 border-indigo-500/40 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-900 border-b border-indigo-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-indigo-600/30 border border-indigo-400/40 flex items-center justify-center text-indigo-300 shadow-inner">
              <Volume2 className="w-6 h-6 text-indigo-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-white">AI Voice Engine</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Natural Male Priority
                </span>
              </div>
              <p className="text-xs text-slate-300 font-medium mt-0.5">
                Powered by Microsoft Guy &amp; Natural Male synthesis
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-5 overflow-y-auto flex-1">
          {/* Active Voice Spotlight Card */}
          <div className="p-4 rounded-2xl bg-indigo-950/40 border-2 border-indigo-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black uppercase tracking-wider text-indigo-300 flex items-center gap-1.5">
                <Sparkles size={14} className="text-amber-400" /> Active System Voice
              </span>
              <span
                className={`text-[11px] font-black px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                  voiceInfo.isGuy
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                    : voiceInfo.isMale
                    ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                    : "bg-slate-800 text-slate-300"
                }`}
              >
                {voiceInfo.isGuy
                  ? "🌟 Microsoft Guy (Natural Male)"
                  : voiceInfo.isMale
                  ? "🎙️ Natural Male Voice"
                  : "Device Voice"}
              </span>
            </div>

            <div>
              <div className="text-sm font-bold text-white truncate">
                {voiceInfo.name || "Default Device Voice"}
              </div>
              <div className="text-xs text-slate-400 mt-0.5 flex items-center gap-2">
                <span>Language: {voiceInfo.lang}</span>
                <span>•</span>
                <span>Pitch: 0.98x (Anti-Robotic Normalization)</span>
              </div>
            </div>

            {/* Test Voice Control */}
            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={handleTest}
                className={`flex-1 py-2.5 px-4 rounded-xl font-black text-xs transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg ${
                  speaking
                    ? "bg-amber-600 hover:bg-amber-500 text-white animate-pulse"
                    : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30 border-b-2 border-indigo-800 active:translate-y-0.5"
                }`}
              >
                {speaking ? (
                  <>
                    <Square size={14} className="fill-white" />
                    <span>Speaking Now... Tap to Stop</span>
                  </>
                ) : (
                  <>
                    <Play size={14} className="fill-white" />
                    <span>Test Voice Live (Hear Sample)</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleToggleMute}
                className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                  muted
                    ? "bg-red-500/20 border-red-500/40 text-red-300 hover:bg-red-500/30"
                    : "bg-slate-800 border-slate-700 text-slate-300 hover:text-white"
                }`}
                title={muted ? "Voice is Muted" : "Voice is Active"}
              >
                {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
              </button>
            </div>
          </div>

          {/* Voice Selection Dropdown */}
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-wider text-slate-300 flex items-center justify-between">
              <span>Voice Selection Mode</span>
              <span className="text-[11px] text-indigo-400 font-semibold lowercase">
                {voices.length} voices found on device
              </span>
            </label>

            <select
              value={preferredURI || "auto"}
              onChange={(e) => handleSelectVoice(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 transition-colors"
            >
              <option value="auto">
                ⭐ Automatic: Microsoft Guy &amp; Natural Male Priority (Recommended)
              </option>
              {englishVoices.length > 0 && (
                <optgroup label="English Voices (Installed on this device)">
                  {englishVoices.map((v) => {
                    const isGuy = v.name.toLowerCase().includes("guy");
                    const isMale =
                      isGuy ||
                      v.name.toLowerCase().includes("male") ||
                      v.voiceURI.toLowerCase().includes("male");
                    return (
                      <option key={v.voiceURI} value={v.voiceURI}>
                        {isGuy ? "🌟 " : isMale ? "🎙️ " : ""}
                        {v.name} ({v.lang})
                      </option>
                    );
                  })}
                </optgroup>
              )}
              {otherVoices.length > 0 && (
                <optgroup label="Other Installed Voices">
                  {otherVoices.map((v) => (
                    <option key={v.voiceURI} value={v.voiceURI}>
                      {v.name} ({v.lang})
                    </option>
                  ))}
                </optgroup>
              )}
            </select>
          </div>

          {/* Vivo X50 Pro & Mobile Tuning Guide */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-cyan-400">
              <Smartphone size={15} />
              <span>Vivo X50 Pro &amp; Mobile Phone Optimization</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-medium">
              On PC, browsers include the advanced <strong>Microsoft Guy Online (Natural)</strong> neural voice by default. On Android devices like your <strong>Vivo X50 Pro</strong>, the system default was falling back to a female synthesizer with high pitch, causing it to sound robotic.
            </p>
            <div className="bg-slate-900/90 rounded-xl p-3 border border-slate-800 text-[11px] text-slate-300 space-y-1.5">
              <div className="font-bold text-white flex items-center gap-1.5">
                <Check size={14} className="text-emerald-400" /> What we updated for your phone:
              </div>
              <ul className="list-disc pl-4 space-y-1 text-slate-400">
                <li>Locked voice selection to <strong>Microsoft Guy</strong> and Google Male neural voices.</li>
                <li>Banned high-pitched artificial female synthetic fallbacks.</li>
                <li>Tuned acoustic frequency to <strong>0.98x pitch</strong> (warm, deep, natural male resonance) so it never sounds like a screechy robotic toy.</li>
                <li>Fixed Android WebSpeech audio-pause stalling on Chrome and Vivo browser.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <div className="text-[11px] text-slate-400 font-medium">
            Settings persist automatically in your browser.
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs shadow-md shadow-indigo-600/30 cursor-pointer transition-all"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
