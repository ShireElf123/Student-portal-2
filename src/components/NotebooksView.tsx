import React, { useState } from "react";
import {
  BookOpen,
  Plus,
  Trash2,
  ArrowRight,
  Sparkles,
  HelpCircle,
  Brain,
  Target,
  Search,
  CheckCircle2,
  Calendar,
  X,
  FileText,
} from "lucide-react";
import { AcademicMode, NavigationTab, Notebook, PracticeSession } from "../types";
import { ACADEMIC_MODES } from "../data/defaultNotebooks";
import { getNotebookTopicStatus, getTopicStatusBadge } from "../utils/topicStatus";

interface NotebooksViewProps {
  notebooks: Notebook[];
  activeNotebookId: string;
  practiceSessions: PracticeSession[];
  onSelectNotebook: (id: string) => void;
  onCreateNotebook: (name: string, subject: string, mode: AcademicMode) => void;
  onDeleteNotebook: (id: string) => void;
  onNavigate: (tab: NavigationTab) => void;
  onSendTutorAction: (notebookId: string, prompt: string) => void;
  onStartPracticeForNotebook: (subject: string, topic: string) => void;
}

export function NotebooksView({
  notebooks,
  activeNotebookId,
  practiceSessions,
  onSelectNotebook,
  onCreateNotebook,
  onDeleteNotebook,
  onNavigate,
  onSendTutorAction,
  onStartPracticeForNotebook,
}: NotebooksViewProps) {
  const [searchFilter, setSearchFilter] = useState("");
  const [selectedSubject, setSelectedSubject] = useState<string>("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newName, setNewName] = useState("");
  const [newSubject, setNewSubject] = useState("");
  const [newMode, setNewMode] = useState<AcademicMode>("stem");

  const subjects = Array.from(new Set(notebooks.map((nb) => nb.subject)));

  const filteredNotebooks = notebooks.filter((nb) => {
    const matchesSearch =
      nb.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      nb.subject.toLowerCase().includes(searchFilter.toLowerCase());
    const matchesSubject =
      selectedSubject === "all" || nb.subject.toLowerCase() === selectedSubject.toLowerCase();
    return matchesSearch && matchesSubject;
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    onCreateNotebook(newName.trim(), newSubject.trim() || "General", newMode);
    setNewName("");
    setNewSubject("");
    setShowCreateModal(false);
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 space-y-6 sm:space-y-8 max-w-6xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight flex items-center gap-3">
            <BookOpen className="text-indigo-400" size={32} />
            Study Notebooks
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 font-medium">
            Manage your courses, notes, and direct AI study workflows ({notebooks.length} total)
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-5 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs sm:text-sm font-black flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition-all cursor-pointer active:scale-95"
        >
          <Plus size={18} />
          <span>New Notebook</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder="Search notebooks by name or subject..."
            className="w-full pl-11 pr-4 py-3 bg-slate-900/90 border border-slate-700/80 rounded-xl text-xs sm:text-sm text-white placeholder:text-slate-500 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/20 shadow-inner"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 custom-scrollbar">
          <button
            onClick={() => setSelectedSubject("all")}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-colors border cursor-pointer ${
              selectedSubject === "all"
                ? "bg-indigo-600 text-white border-indigo-400 shadow-sm"
                : "bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800 hover:text-white"
            }`}
          >
            All Subjects
          </button>
          {subjects.map((subj) => (
            <button
              key={subj}
              onClick={() => setSelectedSubject(subj)}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-colors border cursor-pointer ${
                selectedSubject === subj
                  ? "bg-indigo-600 text-white border-indigo-400 shadow-sm"
                  : "bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800 hover:text-white"
              }`}
            >
              {subj}
            </button>
          ))}
        </div>
      </div>

      {/* Notebook Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
        {filteredNotebooks.map((nb) => {
          const status = getNotebookTopicStatus(nb, practiceSessions);
          const badge = getTopicStatusBadge(status);
          const modeInfo = ACADEMIC_MODES[nb.mode] || ACADEMIC_MODES.stem;
          const isActive = nb.id === activeNotebookId;
          const lastMsg = nb.messages[nb.messages.length - 1];

          return (
            <div
              key={nb.id}
              className={`p-5 sm:p-6 rounded-3xl border transition-all flex flex-col justify-between space-y-4 shadow-md ${
                isActive
                  ? "bg-slate-900 border-2 border-indigo-500/80 shadow-indigo-950/40"
                  : "bg-slate-900/90 border border-slate-700/80 hover:border-slate-600"
              }`}
            >
              {/* Card Top */}
              <div>
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-black text-slate-400 uppercase tracking-wider">
                      {nb.subject}
                    </span>
                    <span className={`text-xs font-black px-2.5 py-0.5 rounded-full border ${badge.className}`}>
                      {badge.label}
                    </span>
                  </div>

                  {notebooks.length > 1 && (
                    <button
                      onClick={() => onDeleteNotebook(nb.id)}
                      className="text-slate-400 hover:text-rose-400 p-1.5 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                      title="Delete notebook"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>

                <h3 className="text-base sm:text-xl font-black text-white tracking-tight leading-snug">
                  {nb.name}
                </h3>

                <div className="flex items-center gap-3 mt-2 text-xs text-slate-400 font-semibold">
                  <span className={`px-2.5 py-0.5 rounded-md border font-bold ${modeInfo.badgeColor}`}>
                    {modeInfo.name}
                  </span>
                  <span>{nb.messages.length} notes</span>
                </div>

                {lastMsg && (
                  <div className="mt-3.5 p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs sm:text-sm text-slate-300 line-clamp-2 leading-relaxed font-medium">
                    {lastMsg.content.replace(/[*_#`]/g, "").slice(0, 140)}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5 pt-3 border-t border-slate-800">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    onClick={() => {
                      onSelectNotebook(nb.id);
                      onSendTutorAction(
                        nb.id,
                        `Please provide a comprehensive study review and breakdown of the key concepts in my "${nb.name}" notebook.`
                      );
                      onNavigate("tutor");
                    }}
                    className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-slate-700/60"
                    title="Review key concepts"
                  >
                    <BookOpen size={14} className="text-indigo-400" />
                    <span>Review</span>
                  </button>

                  <button
                    onClick={() => {
                      onSelectNotebook(nb.id);
                      onSendTutorAction(
                        nb.id,
                        `Could you explain the last concept again in simpler terms, with a fresh intuitive analogy and a clear concrete example?`
                      );
                      onNavigate("tutor");
                    }}
                    className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-slate-700/60"
                    title="Explain again in simple terms"
                  >
                    <HelpCircle size={14} className="text-emerald-400" />
                    <span>Explain</span>
                  </button>

                  <button
                    onClick={() => {
                      onSelectNotebook(nb.id);
                      onSendTutorAction(
                        nb.id,
                        `Please quiz me right now on the most important principle from "${nb.name}". Provide 1 challenging diagnostic question.`
                      );
                      onNavigate("tutor");
                    }}
                    className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-slate-700/60"
                    title="Quiz me"
                  >
                    <Brain size={14} className="text-amber-400" />
                    <span>Quiz Me</span>
                  </button>

                  <button
                    onClick={() => {
                      onStartPracticeForNotebook(nb.subject, nb.name);
                      onNavigate("practice");
                    }}
                    className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-slate-700/60"
                    title="Jump to Practice with this notebook's topic"
                  >
                    <Target size={14} className="text-purple-400" />
                    <span>Practice</span>
                  </button>
                </div>

                <button
                  onClick={() => {
                    onSelectNotebook(nb.id);
                    onNavigate("tutor");
                  }}
                  className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs sm:text-sm transition-all flex items-center justify-center gap-2 shadow-md shadow-indigo-600/30 cursor-pointer active:scale-98"
                >
                  <span>Open Full AI Chat Session</span>
                  <ArrowRight size={15} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Notebook Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-[#0f172a] border border-slate-700 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-lg font-black text-white flex items-center gap-2.5">
                <BookOpen size={20} className="text-indigo-400" />
                Create New Notebook
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="block text-xs sm:text-sm font-bold text-slate-300 mb-1.5">
                  Course or Topic Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Organic Chemistry, Macroeconomics"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-sm sm:text-base text-white placeholder:text-slate-500 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/20 shadow-inner"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-bold text-slate-300 mb-1.5">
                  Subject Area
                </label>
                <input
                  type="text"
                  placeholder="e.g. Science, Mathematics, Humanities"
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-sm sm:text-base text-white placeholder:text-slate-500 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/20 shadow-inner"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-bold text-slate-300 mb-1.5">
                  Pedagogical Mode
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {(Object.keys(ACADEMIC_MODES) as AcademicMode[]).map((modeKey) => {
                    const isSel = newMode === modeKey;
                    return (
                      <button
                        key={modeKey}
                        type="button"
                        onClick={() => setNewMode(modeKey)}
                        className={`p-3 rounded-xl text-left border-2 text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                          isSel
                            ? "bg-indigo-600 text-white border-indigo-400 shadow-md shadow-indigo-600/30"
                            : "bg-slate-900/90 text-slate-400 border-slate-800 hover:bg-slate-800 hover:text-white"
                        }`}
                      >
                        <p className="font-extrabold">{ACADEMIC_MODES[modeKey].name}</p>
                        <p className="text-xs opacity-75 truncate mt-0.5">{ACADEMIC_MODES[modeKey].tagline}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2.5 text-xs sm:text-sm font-bold text-slate-400 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newName.trim()}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-30 text-white rounded-xl text-xs sm:text-sm font-black shadow-md shadow-indigo-600/30 cursor-pointer"
                >
                  Create Notebook
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
