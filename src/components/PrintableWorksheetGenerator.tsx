import React, { useState } from "react";
import {
  Printer,
  Sparkles,
  BookOpen,
  CheckCircle2,
  FileText,
  X,
  Download,
  RotateCcw,
} from "lucide-react";
import {
  CURRICULUM_SKILL_NODES,
  CURRICULUM_DOMAINS,
  CurriculumDomain,
  GradeLevelBand,
} from "../data/curriculumUniverse";

interface PrintableWorksheetGeneratorProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedDomain?: CurriculumDomain;
  preselectedGrade?: GradeLevelBand;
}

export function PrintableWorksheetGenerator({
  isOpen,
  onClose,
  preselectedDomain = "math",
  preselectedGrade = "2-3",
}: PrintableWorksheetGeneratorProps) {
  const [domain, setDomain] = useState<CurriculumDomain>(preselectedDomain);
  const [grade, setGrade] = useState<GradeLevelBand>(preselectedGrade);
  const [selectedNodeId, setSelectedNodeId] = useState<string>(() => {
    const match = CURRICULUM_SKILL_NODES.find(
      (n) => n.domain === preselectedDomain && n.gradeBand === preselectedGrade
    );
    return match ? match.id : CURRICULUM_SKILL_NODES[0].id;
  });
  const [showAnswerKey, setShowAnswerKey] = useState<boolean>(true);

  if (!isOpen) return null;

  const filteredNodes = CURRICULUM_SKILL_NODES.filter(
    (n) => n.domain === domain && n.gradeBand === grade
  );

  const activeNode =
    CURRICULUM_SKILL_NODES.find((n) => n.id === selectedNodeId) ||
    filteredNodes[0] ||
    CURRICULUM_SKILL_NODES[0];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md">
      <div className="w-full max-w-4xl bg-[#0f172a] border border-slate-700 rounded-3xl p-4 sm:p-6 shadow-2xl flex flex-col max-h-[95vh] overflow-hidden animate-in zoom-in-95">
        {/* Modal Controls Header (hidden during print) */}
        <div className="print:hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
              <Printer size={22} />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-white">
                1-Click Offline Worksheet Generator
              </h2>
              <p className="text-xs text-slate-400 font-medium">
                Pencil & paper standard-aligned activity sheets with detachable parent answer keys
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs sm:text-sm font-black flex items-center gap-2 shadow-lg shadow-emerald-600/30 transition-all cursor-pointer active:scale-95"
            >
              <Printer size={16} />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Configuration Filters (hidden during print) */}
        <div className="print:hidden py-3 border-b border-slate-800 shrink-0 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Curriculum Domain
            </label>
            <select
              value={domain}
              onChange={(e) => {
                const newDom = e.target.value as CurriculumDomain;
                setDomain(newDom);
                const first = CURRICULUM_SKILL_NODES.find(
                  (n) => n.domain === newDom && n.gradeBand === grade
                );
                if (first) setSelectedNodeId(first.id);
              }}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs font-bold text-white focus:outline-none focus:border-emerald-500"
            >
              {CURRICULUM_DOMAINS.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.emoji} {d.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Target Grade Band
            </label>
            <select
              value={grade}
              onChange={(e) => {
                const newGrade = e.target.value as GradeLevelBand;
                setGrade(newGrade);
                const first = CURRICULUM_SKILL_NODES.find(
                  (n) => n.domain === domain && n.gradeBand === newGrade
                );
                if (first) setSelectedNodeId(first.id);
              }}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs font-bold text-white focus:outline-none focus:border-emerald-500"
            >
              <option value="K-1">Grades K - 1 (Foundation)</option>
              <option value="2-3">Grades 2 - 3 (Intermediate)</option>
              <option value="4-5">Grades 4 - 5 (Mastery)</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Worksheet Topic
            </label>
            <select
              value={activeNode.id}
              onChange={(e) => setSelectedNodeId(e.target.value)}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs font-bold text-white focus:outline-none focus:border-emerald-500"
            >
              {filteredNodes.map((n) => (
                <option key={n.id} value={n.id}>
                  {n.iconEmoji} {n.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Printable Sheet Viewport */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-950/60 rounded-2xl border border-slate-800/80 my-3">
          {/* Real paper worksheet styling */}
          <div className="max-w-2xl mx-auto bg-white text-slate-900 p-6 sm:p-8 rounded-xl shadow-lg print:shadow-none print:p-0 print:m-0 space-y-6 print:space-y-4">
            {/* Sheet Header */}
            <div className="border-b-2 border-slate-800 pb-4 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
                    {activeNode.title}
                  </h1>
                  <p className="text-xs text-slate-600 font-medium">
                    Standard Code: <strong>{activeNode.standardCode}</strong> • Grade {activeNode.gradeBand}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-slate-500 uppercase">
                    My Student Portal • Homework Lab
                  </span>
                </div>
              </div>

              {/* Student Metadata Lines */}
              <div className="grid grid-cols-3 gap-4 pt-2 text-xs font-bold text-slate-700">
                <div className="border-b border-slate-400 pb-1">
                  Name: ______________________
                </div>
                <div className="border-b border-slate-400 pb-1">
                  Date: ______________________
                </div>
                <div className="border-b border-slate-400 pb-1 text-right">
                  Score: _______ / 100
                </div>
              </div>
            </div>

            {/* Objective Box */}
            <div className="p-3 bg-slate-100 rounded-lg border border-slate-300 text-xs text-slate-700 font-medium">
              <strong>Learning Objective:</strong> {activeNode.description}
            </div>

            {/* Questions Section */}
            <div className="space-y-6 print:space-y-4">
              <h2 className="text-xs font-black uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-1">
                Part 1: Concept Verification & Multiple Choice
              </h2>

              {activeNode.questions.map((q, idx) => (
                <div key={q.id} className="space-y-2 text-xs sm:text-sm">
                  <p className="font-bold text-slate-900">
                    {idx + 1}. {q.question}
                  </p>
                  <div className="grid grid-cols-2 gap-2 pl-4">
                    {q.options.map((opt, oIdx) => (
                      <div key={oIdx} className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full border border-slate-400 flex items-center justify-center text-[10px] font-bold">
                          {String.fromCharCode(65 + oIdx)}
                        </span>
                        <span className="text-slate-800">{opt}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              <h2 className="text-xs font-black uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-1 pt-2">
                Part 2: Real-World Hands-on Application
              </h2>

              <div className="p-4 border-2 border-dashed border-slate-300 rounded-lg space-y-2">
                <p className="text-xs sm:text-sm font-bold text-slate-900">
                  Mission: {activeNode.realWorldMission.title}
                </p>
                <p className="text-xs text-slate-700">
                  {activeNode.realWorldMission.description}
                </p>
                <div className="h-20 border border-slate-200 rounded p-2 text-[11px] text-slate-400 italic">
                  [Student notes, sketches, or parent observation checkmark]
                </div>
              </div>

              {/* Parent Signature Box */}
              <div className="pt-4 border-t border-slate-300 flex justify-between text-xs text-slate-600 font-bold">
                <div>Parent / Tutor Signature: __________________________________</div>
                <div>Completed [ ] Verified [ ]</div>
              </div>
            </div>

            {/* Answer Key Page / Section */}
            {showAnswerKey && (
              <div className="pt-8 border-t-2 border-dotted border-slate-400 space-y-3 print:pt-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">
                    ✂️ Parent & Teacher Answer Key & Rubric (Detachable)
                  </h3>
                  <span className="text-[10px] text-slate-500 font-mono">For Educator / Parent Guidance</span>
                </div>

                <div className="space-y-2 bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs">
                  {activeNode.questions.map((q, idx) => (
                    <div key={idx} className="space-y-0.5">
                      <p className="font-bold text-slate-900">
                        Q{idx + 1} Answer: Option {String.fromCharCode(65 + q.correctAnswerIndex)} ({q.options[q.correctAnswerIndex]})
                      </p>
                      <p className="text-slate-600 italic text-[11px]">
                        Pedagogical Tip: {q.hintLevel1}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="print:hidden pt-3 border-t border-slate-800 flex items-center justify-between shrink-0 text-xs text-slate-400">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showAnswerKey}
              onChange={(e) => setShowAnswerKey(e.target.checked)}
              className="rounded bg-slate-900 border-slate-700 text-emerald-500"
            />
            <span>Include Detachable Answer Key in Printout</span>
          </label>
          <button
            onClick={handlePrint}
            className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl flex items-center gap-2 cursor-pointer shadow-md"
          >
            <Printer size={15} />
            <span>Print Worksheet Now</span>
          </button>
        </div>
      </div>
    </div>
  );
}
