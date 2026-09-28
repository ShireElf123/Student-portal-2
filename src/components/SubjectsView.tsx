import React from "react";
import { Layers, BookOpen, Target, ArrowRight } from "lucide-react";
import { NavigationTab, Notebook, PracticeSession } from "../types";
import { getSubjectTopicStatus, getTopicStatusBadge } from "../utils/topicStatus";

interface SubjectsViewProps {
  notebooks: Notebook[];
  practiceSessions: PracticeSession[];
  onNavigate: (tab: NavigationTab) => void;
  onSelectNotebook: (id: string) => void;
  onStartPracticeForNotebook: (subject: string, topic: string) => void;
}

export function SubjectsView({
  notebooks,
  practiceSessions,
  onNavigate,
  onSelectNotebook,
  onStartPracticeForNotebook,
}: SubjectsViewProps) {
  // Extract unique subjects derived purely from notebooks
  const subjectMap = new Map<string, Notebook[]>();
  notebooks.forEach((nb) => {
    const s = nb.subject.trim() || "General Studies";
    if (!subjectMap.has(s)) {
      subjectMap.set(s, []);
    }
    subjectMap.get(s)!.push(nb);
  });

  const subjects = Array.from(subjectMap.entries());

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 space-y-6 max-w-6xl mx-auto w-full">
      {/* Header */}
      <div className="pb-2 border-b border-white/10">
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
          <Layers className="text-indigo-400" />
          Academic Subjects
        </h1>
        <p className="text-xs sm:text-sm text-white/50 mt-1">
          Disciplines derived directly from your active notebooks ({subjects.length} active fields)
        </p>
      </div>

      {subjects.length === 0 ? (
        <div className="text-center py-16 bg-white/[0.02] border border-white/10 rounded-2xl space-y-3">
          <p className="text-sm text-white/60">No course subjects registered yet.</p>
          <button
            onClick={() => onNavigate("notebooks")}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold"
          >
            Create Your First Notebook
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {subjects.map(([subjectName, subjectNotebooks]) => {
            const status = getSubjectTopicStatus(subjectName, notebooks, practiceSessions);
            const badge = getTopicStatusBadge(status);
            const totalMessages = subjectNotebooks.reduce((acc, nb) => acc + nb.messages.length, 0);

            return (
              <div
                key={subjectName}
                className="p-5 sm:p-6 rounded-2xl bg-[#0c0c10] border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[11px] font-bold text-white/40 uppercase tracking-wider">
                      Discipline Area
                    </span>
                    <span className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full border ${badge.className}`}>
                      {badge.label}
                    </span>
                  </div>

                  <h2 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
                    {subjectName}
                  </h2>

                  <div className="flex items-center gap-3 mt-1.5 text-xs text-white/40">
                    <span>{subjectNotebooks.length} Course Notebooks</span>
                    <span>•</span>
                    <span>{totalMessages} Total Notes</span>
                  </div>

                  {/* Course List within Subject */}
                  <div className="mt-4 space-y-2">
                    <span className="text-[10px] font-bold text-white/40 uppercase tracking-wider">
                      Included Courses
                    </span>
                    <div className="space-y-1.5">
                      {subjectNotebooks.map((nb) => (
                        <div
                          key={nb.id}
                          onClick={() => {
                            onSelectNotebook(nb.id);
                            onNavigate("tutor");
                          }}
                          className="p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/5 hover:border-indigo-500/30 transition-all cursor-pointer flex items-center justify-between text-xs group"
                        >
                          <div className="min-w-0 flex items-center gap-2">
                            <BookOpen size={14} className="text-indigo-400 flex-shrink-0" />
                            <span className="font-semibold text-white/90 group-hover:text-white truncate">
                              {nb.name}
                            </span>
                          </div>
                          <span className="text-[11px] text-white/40 group-hover:text-indigo-400 flex items-center gap-1">
                            Resume
                            <ArrowRight size={11} />
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-white/5 flex gap-2">
                  <button
                    onClick={() => {
                      onStartPracticeForNotebook(subjectName, subjectNotebooks[0]?.name || subjectName);
                      onNavigate("practice");
                    }}
                    className="flex-1 py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Target size={13} className="text-emerald-400" />
                    <span>Practice Questions</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
