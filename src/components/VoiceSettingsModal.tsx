import React, { useState, useEffect } from "react";
import {
  Volume2,
  VolumeX,
  Sparkles,
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
  VOICE_PERSONAS,
  getActivePersona,
  setActivePersona,
  VoicePersona,
} from "../utils/speechUtils";

interface VoiceSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function VoiceSettingsModal({ isOpen, onClose }: VoiceSettingsModalProps) {
  const [voiceInfo, setVoiceInfo] = useState(getActiveVoiceInfo());
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>(getAvailableVoices());
  const [preferredURI, setPreferredURI] = useState<string | null>(getPreferredVoiceURI());
  const [selectedPersona, setSelectedPersona] = useState<VoicePersona>(() => getActivePersona());
  const [speaking, setSpeaking] = useState<boolean>(isSpeaking());
  const [muted, setMuted] = useState<boolean>(isVoiceMuted());
  const [testPhrase, setTestPhrase] = useState<string>(
    "Hello there! I'm your learning companion. Let's explore wonder, stories, and science together!"
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
                <h2 className="text-base sm:text-lg font-black text-white">Voice &amp; Speech</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-sky-500/20 text-sky-200 border border-sky-500/30">
                  System voice
                </span>
              </div>
              <p className="text-xs text-slate-300 font-medium mt-0.5">
                Voice quality depends on the voices installed in this browser or device.
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
              <span className="text-[11px] font-black px-2.5 py-0.5 rounded-full flex items-center gap-1 bg-slate-800 text-slate-300">
                {preferredURI ? "Selected voice" : "Automatic voice"}
              </span>
            </div>

            <div>
              <div className="text-sm font-bold text-white truncate">
                {voiceInfo.name || "Default Device Voice"}
              </div>
              <div className="text-xs text-slate-400 mt-0.5 flex items-center gap-2">
                <span>Language: {voiceInfo.lang}</span>
                <span>•</span>
                <span>Voice provided by your browser or device</span>
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

          {/* Voice Persona & Learning Tone Cards */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Sparkles size={14} className="text-amber-400" />
                <span>Storyteller &amp; Coach Persona</span>
              </label>
              <span className="text-[10px] text-indigo-400 font-bold">
                Controls pacing &amp; warmth
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {VOICE_PERSONAS.map((persona) => {
                const isSelected = selectedPersona.id === persona.id;
                return (
                  <button
                    key={persona.id}
                    type="button"
                    onClick={() => {
                      setSelectedPersona(persona);
                      setActivePersona(persona.id);
                      testVoice(`I am your ${persona.name}. Ready to learn?`);
                    }}
                    className={`p-3 rounded-2xl text-left border-2 transition-all cursor-pointer flex items-start gap-2.5 ${
                      isSelected
                        ? "bg-indigo-600/30 border-indigo-400 text-white shadow-md ring-2 ring-indigo-400/30"
                        : "bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-300"
                    }`}
                  >
                    <span className="text-2xl p-1.5 rounded-xl bg-slate-900 border border-slate-700 flex-shrink-0">
                      {persona.emoji}
                    </span>
                    <div className="min-w-0">
                      <div className="text-xs font-black text-white flex items-center gap-1.5">
                        <span className="truncate">{persona.name}</span>
                        {isSelected && (
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-[10px] text-slate-400 leading-tight mt-0.5 line-clamp-2">
                        {persona.description}
                      </p>
                    </div>
                  </button>
                );
              })}
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
                Automatic: best available English voice on this device
              </option>
              {englishVoices.length > 0 && (
                <optgroup label="English Voices (Installed on this device)">
                  {englishVoices.map((v) => {
                    return (
                      <option key={v.voiceURI} value={v.voiceURI}>
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

          <div className="rounded-2xl border border-slate-700 bg-slate-950 p-4 text-xs leading-relaxed text-slate-300">
            Speech uses the voices installed by this browser and device. Voice sound and availability vary between devices; this app cannot guarantee a particular studio or singing voice. Choose a voice above and use the preview to compare. Your selection is saved in this browser.
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
