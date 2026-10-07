import React, { useState, useRef, useEffect } from "react";
import { 
  Send, 
  Loader2, 
  RefreshCw, 
  Menu, 
  Image as ImageIcon, 
  X, 
  Sparkles, 
  Brain, 
  Bot,
  Download,
  CheckCircle2,
  ChevronDown,
  BookOpen,
  Target,
  PenTool,
  Code2,
  CalendarCheck,
  AlertCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Message, Notebook, AcademicMode, Attachment, FriendlyTutorMode } from "../types";
import { INITIAL_NOTEBOOKS, ACADEMIC_MODES } from "../data/defaultNotebooks";
import { Sidebar } from "./Sidebar";
import { MessageItem } from "./MessageItem";
import { canConsumeAI, recordAIConsumption, syncAIQuotaFromResponseHeaders } from "../services/aiUsageService";
import { getAiAuthorizationHeader } from "../services/aiAuth";
// Notebook persistence is owned by App (account-scoped v3 partition). This
// view keeps no separate copy: the legacy unscoped v2 mirror previously
// written here could resurface one account's notebooks inside another account.

export const FRIENDLY_TUTOR_MODES: {
  id: FriendlyTutorMode;
  label: string;
  mappedAcademicMode: AcademicMode;
  tagline: string;
  icon: React.ReactNode;
}[] = [
  {
    id: "learn",
    label: "Socratic Learn",
    mappedAcademicMode: "socratic",
    tagline: "Guides step-by-step with inquiry prompts",
    icon: <BookOpen size={14} />,
  },
  {
    id: "solve",
    label: "STEM & Math",
    mappedAcademicMode: "stem",
    tagline: "Methodical arithmetic, algebra & logic reasoning",
    icon: <Code2 size={14} />,
  },
  {
    id: "write",
    label: "Draft & Essay",
    mappedAcademicMode: "writing",
    tagline: "Grammar, structure & argumentation critique",
    icon: <PenTool size={14} />,
  },
  {
    id: "practise",
    label: "Active Recall",
    mappedAcademicMode: "flashcards",
    tagline: "Drills & memory retention exercises",
    icon: <Target size={14} />,
  },
  {
    id: "prepare",
    label: "Exam Review",
    mappedAcademicMode: "flashcards",
    tagline: "Comprehensive checklist & high-yield revision",
    icon: <CalendarCheck size={14} />,
  },
];

interface ChatInterfaceProps {
  notebooks?: Notebook[];
  setNotebooks?: React.Dispatch<React.SetStateAction<Notebook[]>>;
  activeNotebookId?: string;
  setActiveNotebookId?: (id: string) => void;
  pendingInitialQuery?: string;
  onClearInitialQuery?: () => void;
  onOpenSubscriptionModal?: () => void;
}

export function ChatInterface({
  notebooks: propNotebooks,
  setNotebooks: propSetNotebooks,
  activeNotebookId: propActiveNotebookId,
  setActiveNotebookId: propSetActiveNotebookId,
  pendingInitialQuery,
  onClearInitialQuery,
  onOpenSubscriptionModal,
}: ChatInterfaceProps) {
  // Standalone fallback only: App always supplies notebooks + persistence.
  const [internalNotebooks, setInternalNotebooks] = useState<Notebook[]>(() => [...INITIAL_NOTEBOOKS]);

  const [internalActiveNotebookId, setInternalActiveNotebookId] = useState<string>(() => {
    return internalNotebooks[0]?.id || INITIAL_NOTEBOOKS[0]?.id || "";
  });

  const notebooks = propNotebooks || internalNotebooks;
  const setNotebooks = propSetNotebooks || setInternalNotebooks;
  const activeNotebookId = propActiveNotebookId || internalActiveNotebookId;
  const setActiveNotebookId = propSetActiveNotebookId || setInternalActiveNotebookId;

  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [attachment, setAttachment] = useState<Attachment | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Intentionally no local persistence here: App persists the account-scoped
  // notebook partition (and syncs it to the cloud) on every change.

  const activeNotebook = notebooks.find((nb) => nb.id === activeNotebookId) || notebooks[0];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeNotebook?.messages, isLoading]);

  useEffect(() => {
    if (pendingInitialQuery && pendingInitialQuery.trim().length > 0) {
      setInput(pendingInitialQuery);
      if (onClearInitialQuery) {
        onClearInitialQuery();
      }
    }
  }, [pendingInitialQuery, onClearInitialQuery]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!["image/png", "image/jpeg", "image/webp"].includes(file.type)) {
      setError("Please select a PNG, JPEG, or WebP image of your homework problem or diagram.");
      return;
    }
    if (file.size > 4 * 1024 * 1024) {
      setError("Please choose an image smaller than 4 MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64Data = result.split(",")[1];
      setAttachment({
        name: file.name,
        mimeType: file.type,
        data: base64Data,
        previewUrl: result,
      });
      setError(null);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const removeAttachment = () => {
    setAttachment(null);
  };

  const handleSelectNotebook = (id: string) => {
    setActiveNotebookId(id);
    setError(null);
  };

  const handleCreateNotebook = (name: string, subject: string, mode: AcademicMode) => {
    const newNb: Notebook = {
      id: `nb-${Date.now()}`,
      name,
      subject,
      mode,
      createdAt: Date.now(),
      messages: [
        {
          id: `msg-${Date.now()}`,
          role: "model",
          content: `Welcome to your **${name}** notebook for ${subject}. I am ready to guide you step-by-step. What topic or problem would you like to explore?`,
          timestamp: Date.now(),
        },
      ],
    };
    setNotebooks((prev) => [newNb, ...prev]);
    setActiveNotebookId(newNb.id);
  };

  const handleDeleteNotebook = (id: string) => {
    if (notebooks.length <= 1) return;
    setNotebooks((prev) => {
      const filtered = prev.filter((nb) => nb.id !== id);
      if (activeNotebookId === id && filtered.length > 0) {
        setActiveNotebookId(filtered[0].id);
      }
      return filtered;
    });
  };

  const handleChangeMode = (mode: AcademicMode) => {
    setNotebooks((prev) =>
      prev.map((nb) => (nb.id === activeNotebookId ? { ...nb, mode } : nb))
    );
  };

  const clearChat = () => {
    setNotebooks((prev) =>
      prev.map((nb) =>
        nb.id === activeNotebookId
          ? {
              ...nb,
              messages: [],
              lastInteractionId: undefined,
            }
          : nb
      )
    );
    setError(null);
  };

  const handleExportNotebook = () => {
    if (!activeNotebook) return;
    const markdownContent = [
      `# ${activeNotebook.name}`,
      `**Subject:** ${activeNotebook.subject}`,
      `**Mode:** ${ACADEMIC_MODES[activeNotebook.mode]?.name}`,
      `**Exported:** ${new Date().toLocaleString()}`,
      `\n---\n`,
      ...activeNotebook.messages.map((m) => {
        const speaker = m.role === "user" ? "Student" : "Socratic Tutor";
        const time = m.timestamp ? new Date(m.timestamp).toLocaleTimeString() : "";
        return `### ${speaker} (${time})\n\n${m.content}\n\n`;
      }),
    ].join("\n");

    const blob = new Blob([markdownContent], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${activeNotebook.name.toLowerCase().replace(/\s+/g, "-")}-study-notes.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!input.trim() && !attachment) || isLoading) return;

    const aiCheck = canConsumeAI("chat");
    if (!aiCheck.allowed) {
      setError(aiCheck.reason || "You have reached your daily AI query limit. You can reset or upgrade your quota to continue studying.");
      return;
    }

    let authorization: string;
    try {
      authorization = await getAiAuthorizationHeader();
    } catch (authError) {
      setError(authError instanceof Error ? authError.message : "Sign in to use AI features.");
      return;
    }

    const currentInput = input.trim();
    const currentAttachment = attachment;
    setInput("");
    setAttachment(null);
    setError(null);

    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      role: "user",
      content: currentInput || (currentAttachment ? `[Uploaded image: ${currentAttachment.name}]` : ""),
      attachment: currentAttachment || undefined,
      timestamp: Date.now(),
    };

    const targetNotebookId = activeNotebook.id;

    const assistantMessageId = `msg-${Date.now() + 1}`;
    const assistantPlaceholder: Message = {
      id: assistantMessageId,
      role: "model",
      content: "",
      isStreaming: true,
      timestamp: Date.now(),
    };

    setNotebooks((prev) =>
      prev.map((nb) =>
        nb.id === targetNotebookId
          ? {
              ...nb,
              messages: [...nb.messages, userMessage, assistantPlaceholder],
            }
          : nb
      )
    );

    setIsLoading(true);

    try {
      const response = await fetch("/api/chat/stream", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: authorization },
        body: JSON.stringify({
          message: currentInput,
          mode: activeNotebook.mode,
          previousInteractionId: activeNotebook.lastInteractionId,
          attachment: currentAttachment
            ? {
                mimeType: currentAttachment.mimeType,
                data: currentAttachment.data,
              }
            : undefined,
        }),
      });
      syncAIQuotaFromResponseHeaders(response.headers);

      if (!response.ok) {
        const errorData: unknown = await response.json().catch(() => ({}));
        const errorMessage = errorData && typeof errorData === "object" && !Array.isArray(errorData) &&
          typeof (errorData as Record<string, unknown>).error === "string"
          ? (errorData as Record<string, unknown>).error as string
          : "The Socratic tutor engine is temporarily unavailable. Please try again in a moment.";
        throw new Error(errorMessage);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error("Unable to establish a streaming connection with the academic tutor.");
      }

      const decoder = new TextDecoder("utf-8");
      let accumulatedText = "";
      let finalInteractionId: string | undefined = undefined;
      let buffer = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed.startsWith("data:")) continue;

          const jsonString = trimmed.replace(/^data:\s*/, "");
          if (!jsonString) continue;

          let event: unknown;
          try {
            event = JSON.parse(jsonString) as unknown;
          } catch {
            continue;
          }
          if (!event || typeof event !== "object" || Array.isArray(event)) continue;
          const data = event as Record<string, unknown>;
          if (data.type === "chunk" && typeof data.text === "string") {
            if (accumulatedText.length + data.text.length > 60_000) {
              throw new Error("The AI response was too long to display safely.");
            }
            accumulatedText += data.text;
            setNotebooks((prev) =>
              prev.map((nb) =>
                nb.id === targetNotebookId
                  ? {
                      ...nb,
                      messages: nb.messages.map((m) =>
                        m.id === assistantMessageId
                          ? { ...m, content: accumulatedText, isStreaming: true }
                          : m
                      ),
                    }
                  : nb
              )
            );
          } else if (data.type === "done") {
            finalInteractionId = typeof data.interactionId === "string" ? data.interactionId : undefined;
          } else if (data.type === "error") {
            throw new Error(typeof data.error === "string" ? data.error : "A streaming error occurred while generating guidance.");
          }
        }
      }

      recordAIConsumption("chat");
      setNotebooks((prev) =>
        prev.map((nb) =>
          nb.id === targetNotebookId
            ? {
                ...nb,
                messages: nb.messages.map((m) =>
                  m.id === assistantMessageId
                    ? {
                        ...m,
                        content: accumulatedText || "Analysis completed.",
                        interactionId: finalInteractionId,
                        isStreaming: false,
                      }
                    : m
                ),
                lastInteractionId: finalInteractionId || nb.lastInteractionId,
              }
            : nb
        )
      );
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "We were unable to reach the AI Tutor. Please check your connection and retry.");
      setNotebooks((prev) =>
        prev.map((nb) =>
          nb.id === targetNotebookId
            ? {
                ...nb,
                messages: nb.messages
                  .map((m) => (m.id === assistantMessageId ? { ...m, isStreaming: false } : m))
                  .filter((m) => m.id !== assistantMessageId || m.content.trim().length > 0),
              }
            : nb
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const currentModeInfo = ACADEMIC_MODES[activeNotebook?.mode || "stem"];

  return (
    <div className="flex h-full w-full bg-slate-950 text-slate-100 overflow-hidden">
      {/* Notebook Sidebar Drawer */}
      <Sidebar
        notebooks={notebooks}
        activeNotebookId={activeNotebookId}
        onSelectNotebook={handleSelectNotebook}
        onCreateNotebook={handleCreateNotebook}
        onDeleteNotebook={handleDeleteNotebook}
        onChangeMode={handleChangeMode}
        onExportNotebook={handleExportNotebook}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-slate-950 relative">
        {/* Chat Header */}
        <header className="px-4 sm:px-6 py-3 border-b border-slate-800 bg-slate-900/90 flex items-center justify-between gap-3 sticky top-0 z-20">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none"
              title="Open Notebooks"
              aria-label="Open Notebooks drawer"
            >
              <Menu size={18} />
            </button>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-white text-sm sm:text-base tracking-tight truncate">
                  {activeNotebook?.name || "Socratic Tutor"}
                </h2>
                <span className="text-xs text-slate-400 font-medium hidden sm:inline">
                  · {activeNotebook?.subject}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 truncate">
                {currentModeInfo.tagline}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 flex-shrink-0">
            <button
              type="button"
              onClick={handleExportNotebook}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none cursor-pointer"
              title="Export Notes as Markdown"
              aria-label="Export notes"
            >
              <Download size={15} />
            </button>

            <button
              type="button"
              onClick={clearChat}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none cursor-pointer"
              title="Clear active conversation"
              aria-label="Clear chat"
            >
              <RefreshCw size={15} />
            </button>
          </div>
        </header>

        {/* Study Mode Selector Row */}
        <div className="px-4 sm:px-6 py-2 bg-slate-900/50 border-b border-slate-800 flex items-center gap-1.5 overflow-x-auto">
          <span className="text-xs font-semibold text-slate-400 mr-1 flex-shrink-0">
            Tutor Mode:
          </span>
          {FRIENDLY_TUTOR_MODES.map((fMode) => {
            const isSelected = activeNotebook?.mode === fMode.mappedAcademicMode;
            return (
              <button
                key={fMode.id}
                type="button"
                onClick={() => handleChangeMode(fMode.mappedAcademicMode)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none ${
                  isSelected
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800"
                }`}
                title={fMode.tagline}
              >
                <span>{fMode.icon}</span>
                <span>{fMode.label}</span>
              </button>
            );
          })}
        </div>

        {/* Message Stream */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 bg-slate-950">
          {activeNotebook?.messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto px-4 py-8 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-blue-400 shadow-sm">
                <Brain size={24} />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  Your desk is quiet
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 mt-1 leading-relaxed">
                  Ask for a hint on a tough problem, brainstorm an outline, or paste your homework question below. The Socratic Tutor guides you step-by-step without simply handing out answers.
                </p>
              </div>

              {/* Subject suggestion prompts */}
              <div className="w-full space-y-2 pt-2">
                {currentModeInfo.chips.slice(0, 3).map((chipText) => (
                  <button
                    key={chipText}
                    type="button"
                    onClick={() => setInput(chipText)}
                    className="w-full p-2.5 text-left rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs text-slate-300 hover:text-white transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none"
                  >
                    <span>{chipText}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4 max-w-3xl mx-auto w-full">
              {activeNotebook.messages.map((msg) => (
                <MessageItem key={msg.id} message={msg} />
              ))}
            </div>
          )}

          {/* Obvious "AI is thinking" state */}
          {isLoading && !activeNotebook?.messages.some((m) => m.isStreaming && m.content.length > 0) && (
            <div className="max-w-3xl mx-auto w-full flex items-start gap-3 pt-2">
              <div className="w-8 h-8 rounded-xl bg-slate-800 text-blue-400 border border-slate-700/80 flex items-center justify-center flex-shrink-0">
                <Bot size={16} />
              </div>
              <div className="bg-slate-900 border border-slate-800 px-4 py-3 rounded-2xl rounded-tl-none flex items-center gap-3 text-xs text-slate-300 shadow-sm">
                <div className="flex items-center gap-1" aria-hidden="true">
                  <span className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
                <span>Socratic Tutor is analyzing your problem and preparing step-by-step guidance...</span>
              </div>
            </div>
          )}

          {/* Specific Error State in app voice */}
          {error && (
            <div className="max-w-3xl mx-auto w-full p-3.5 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-300 text-xs flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <AlertCircle size={15} className="text-rose-400 flex-shrink-0" />
                <span>{error}</span>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                {onOpenSubscriptionModal && (
                  <button
                    type="button"
                    onClick={() => {
                      setError(null);
                      onOpenSubscriptionModal();
                    }}
                    className="text-[11px] font-semibold text-blue-400 hover:underline cursor-pointer"
                  >
                    View Quota
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setError(null)}
                  className="text-slate-400 hover:text-white px-2 py-0.5 text-xs font-semibold cursor-pointer"
                >
                  Dismiss
                </button>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </main>

        {/* Input Bar */}
        <footer className="p-3 sm:p-4 border-t border-slate-800 bg-slate-900">
          {attachment && (
            <div className="mb-2 max-w-3xl mx-auto flex items-center gap-2 p-2 bg-slate-950 border border-slate-800 rounded-xl">
              <img
                src={attachment.previewUrl}
                alt="Upload preview"
                className="w-10 h-10 object-cover rounded-lg border border-slate-800"
              />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-white truncate">{attachment.name}</p>
                <p className="text-[11px] text-blue-400">Attached diagram/photo</p>
              </div>
              <button
                type="button"
                onClick={removeAttachment}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 cursor-pointer"
                title="Remove attachment"
                aria-label="Remove attachment"
              >
                <X size={14} />
              </button>
            </div>
          )}

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
            aria-label="Upload homework problem image"
          />

          <form onSubmit={handleSubmit} className="max-w-3xl mx-auto flex items-center gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-2.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-slate-400 hover:text-white transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none"
              title="Attach photo of textbook or homework problem"
              aria-label="Attach problem photo"
            >
              <ImageIcon size={17} />
            </button>

            <div className="relative flex-1">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={`Ask ${activeNotebook?.name} (${currentModeInfo.name})...`}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 pr-11 text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || (!input.trim() && !attachment)}
                className="absolute right-1.5 top-1.5 bottom-1.5 px-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-30 text-white rounded-lg transition-colors flex items-center justify-center cursor-pointer focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none"
                aria-label="Send question"
              >
                {isLoading ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
              </button>
            </div>
          </form>
        </footer>
      </div>
    </div>
  );
}
