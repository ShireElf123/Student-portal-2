import React, { useState } from "react";
import { 
  BookOpen, 
  Plus, 
  Download, 
  Trash2, 
  X, 
  Brain, 
  Code2, 
  PenTool, 
  GraduationCap, 
  Check,
  FolderPlus
} from "lucide-react";
import { Notebook, AcademicMode } from "../types";
import { ACADEMIC_MODES } from "../data/defaultNotebooks";

interface SidebarProps {
  notebooks: Notebook[];
  activeNotebookId: string;
  onSelectNotebook: (id: string) => void;
  onCreateNotebook: (name: string, subject: string, mode: AcademicMode) => void;
  onDeleteNotebook: (id: string) => void;
  onChangeMode: (mode: AcademicMode) => void;
  onExportNotebook: () => void;
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({
  notebooks,
  activeNotebookId,
  onSelectNotebook,
  onCreateNotebook,
  onDeleteNotebook,
  onChangeMode,
  onExportNotebook,
  isOpen,
  onClose,
}: SidebarProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newSubject, setNewSubject] = useState("");
  const [newMode, setNewMode] = useState<AcademicMode>("stem");

  const activeNotebook = notebooks.find((nb) => nb.id === activeNotebookId) || notebooks[0];

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    onCreateNotebook(newTitle.trim(), newSubject.trim() || "General Studies", newMode);
    setNewTitle("");
    setNewSubject("");
    setIsCreating(false);
  };

  const getModeIcon = (mode: AcademicMode) => {
    switch (mode) {
      case "socratic":
        return <Brain size={14} className="text-emerald-400" />;
      case "stem":
        return <Code2 size={14} className="text-blue-400" />;
      case "writing":
        return <PenTool size={14} className="text-purple-400" />;
      case "flashcards":
        return <BookOpen size={14} className="text-amber-400" />;
      case "teacher":
        return <GraduationCap size={14} className="text-rose-400" />;
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 md:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 w-72 sm:w-80 md:w-72 bg-slate-900 border-r border-slate-800 flex flex-col transition-transform duration-200 ease-in-out text-slate-100 ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900">
          <div className="flex items-center gap-2">
            <BookOpen size={16} className="text-blue-400" />
            <div>
              <h2 className="font-bold text-white text-sm tracking-tight">Study Notebooks</h2>
              <p className="text-[11px] text-slate-400">
                {notebooks.length} Active Channels
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="md:hidden p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            aria-label="Close notebooks drawer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Notebooks List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
          <div className="px-2 py-1 flex justify-between items-center text-xs font-semibold text-slate-400">
            <span>Course Channels</span>
            <button
              type="button"
              onClick={() => setIsCreating(true)}
              className="text-blue-400 hover:text-blue-300 flex items-center gap-1 font-semibold cursor-pointer focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none rounded"
            >
              <Plus size={13} />
              <span>New</span>
            </button>
          </div>

          {notebooks.map((nb) => {
            const isActive = nb.id === activeNotebookId;
            return (
              <div
                key={nb.id}
                onClick={() => {
                  onSelectNotebook(nb.id);
                  if (window.innerWidth < 768) onClose();
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onSelectNotebook(nb.id);
                    if (window.innerWidth < 768) onClose();
                  }
                }}
                tabIndex={0}
                role="button"
                className={`group px-3 py-2.5 rounded-xl cursor-pointer transition-colors flex items-center justify-between border focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none ${
                  isActive
                    ? "bg-slate-950 border-slate-700 text-white shadow-sm"
                    : "bg-transparent border-transparent text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="p-1 rounded-md bg-slate-800/80 flex-shrink-0">
                    {getModeIcon(nb.mode)}
                  </div>
                  <div className="min-w-0">
                    <p className={`text-xs font-semibold truncate ${isActive ? "text-white" : "text-slate-300"}`}>
                      {nb.name}
                    </p>
                    <p className="text-[11px] text-slate-500 truncate">
                      {nb.subject} · {nb.messages.length} notes
                    </p>
                  </div>
                </div>

                {notebooks.length > 1 && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteNotebook(nb.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-rose-400 rounded transition-opacity"
                    title="Delete Notebook"
                    aria-label={`Delete ${nb.name}`}
                  >
                    <Trash2 size={13} />
                  </button>
                )}
              </div>
            );
          })}

          {/* Inline Create Form */}
          {isCreating && (
            <form
              onSubmit={handleCreateSubmit}
              className="mt-2 p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2.5"
            >
              <div className="flex items-center justify-between text-xs font-semibold text-white">
                <span className="flex items-center gap-1.5">
                  <FolderPlus size={13} className="text-blue-400" />
                  New Notebook
                </span>
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="text-slate-400 hover:text-white"
                  aria-label="Cancel"
                >
                  <X size={14} />
                </button>
              </div>
              <input
                type="text"
                placeholder="Course title (e.g. Physics 101)"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white placeholder:text-slate-500 outline-none focus:border-blue-500"
                autoFocus
              />
              <input
                type="text"
                placeholder="Subject (e.g. Science, Math)"
                value={newSubject}
                onChange={(e) => setNewSubject(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white placeholder:text-slate-500 outline-none focus:border-blue-500"
              />
              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="px-2.5 py-1 text-xs text-slate-400 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newTitle.trim()}
                  className="px-3 py-1 bg-blue-600 hover:bg-blue-500 disabled:opacity-30 text-white rounded-lg text-xs font-semibold cursor-pointer"
                >
                  Create
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Sidebar Footer: Export Utility */}
        <div className="p-3 border-t border-slate-800 bg-slate-900 space-y-2">
          <button
            type="button"
            onClick={onExportNotebook}
            className="w-full py-2 px-3 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs font-semibold text-slate-300 hover:text-white flex items-center justify-center gap-1.5 transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none"
            title="Export all messages as a Markdown Study Sheet"
          >
            <Download size={13} />
            <span>Export Notes (.md)</span>
          </button>
          <div className="flex justify-between items-center text-[10px] text-slate-500 px-1">
            <span>Saved to Local Desk</span>
            <span className="text-emerald-400 font-medium">Private</span>
          </div>
        </div>
      </aside>
    </>
  );
}
