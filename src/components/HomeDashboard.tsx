import React, { useEffect, useState } from "react";
import {
  ArrowRight, BookOpen, Brain, CalendarCheck, CheckCircle2, ChevronRight,
  Circle, Clock3, Flame, GraduationCap, Layers3, Send, Sparkles, Target, Zap,
} from "lucide-react";
import { NavigationTab, Notebook, PracticeSession, StudyPlanItem } from "../types";
import { RecommendedAction } from "../utils/learnerBrain";
import { DailyLearningRoute, DailyRouteItem, getOrCreateDailyLearningRoute } from "../utils/dailyLearningRoute";
import { todayISO, formatDateLabel } from "../utils/dateUtils";
import { getNotebookTopicStatus } from "../utils/topicStatus";
import { getLearnerModel, subscribeLearnerModel, LearnerModel } from "../utils/pedagogicalEngine";

interface HomeDashboardProps {
  notebooks: Notebook[];
  studyPlan: StudyPlanItem[];
  practiceSessions: PracticeSession[];
  onNavigate: (tab: NavigationTab) => void;
  onSelectNotebook: (id: string) => void;
  onAskTutor: (query: string) => void;
  onToggleTask: (taskId: string) => void;
  onStartRecommendation?: (recommendation: RecommendedAction) => void;
  onStartRouteItem?: (item: DailyRouteItem) => void;
}

const dateKey = (timestamp: number) => new Date(timestamp).toLocaleDateString("en-CA");

export function HomeDashboard({ notebooks, studyPlan, practiceSessions, onNavigate, onSelectNotebook, onAskTutor, onToggleTask, onStartRecommendation, onStartRouteItem }: HomeDashboardProps) {
  const [quickQuery, setQuickQuery] = useState("");
  const [learnerModel, setLearnerModel] = useState<LearnerModel>(getLearnerModel);
  const today = todayISO();
  const [dailyRoute, setDailyRoute] = useState(() => getOrCreateDailyLearningRoute(getLearnerModel(), today));
  useEffect(() => subscribeLearnerModel((model) => {
    setLearnerModel(model);
    setDailyRoute(getOrCreateDailyLearningRoute(model, todayISO()));
  }), []);
  useEffect(() => {
    setDailyRoute(getOrCreateDailyLearningRoute(learnerModel, today));
  }, [learnerModel.learnerId, learnerModel.totalLearningEventsCount, today]);
  useEffect(() => {
    const handleRouteUpdate = (event: Event) => {
      const route = (event as CustomEvent<DailyLearningRoute>).detail;
      if (route?.learnerId === learnerModel.learnerId && route.date === today) {
        setDailyRoute(route);
      }
    };
    window.addEventListener("daily_learning_route_updated", handleRouteUpdate);
    return () => window.removeEventListener("daily_learning_route_updated", handleRouteUpdate);
  }, [learnerModel.learnerId, today]);

  const now = new Date();
  const greeting = now.getHours() < 12 ? "Good morning" : now.getHours() < 18 ? "Good afternoon" : "Good evening";
  const tasks = studyPlan.filter((task) => task.date === today);
  const pending = tasks.find((task) => !task.completed);
  const completedCount = tasks.filter((task) => task.completed).length;
  const completion = tasks.length ? Math.round((completedCount / tasks.length) * 100) : 0;
  const weekStart = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const thisWeek = practiceSessions.filter((session) => session.timestamp >= weekStart);
  const attempted = thisWeek.reduce((sum, session) => sum + session.totalQuestions, 0);
  const correct = thisWeek.reduce((sum, session) => sum + session.correctAnswers, 0);
  const accuracy = attempted ? Math.round((correct / attempted) * 100) : 0;
  const practiceDays = new Set(thisWeek.map((session) => dateKey(session.timestamp))).size;
  const recentNotebooks = [...notebooks].sort((a, b) => (b.messages.at(-1)?.timestamp || b.createdAt) - (a.messages.at(-1)?.timestamp || a.createdAt));
  const nextRec = learnerModel.recommendedNext[0];

  const submitAsk = (event: React.FormEvent) => {
    event.preventDefault();
    const prompt = quickQuery.trim();
    if (!prompt) return;
    onAskTutor(prompt);
    setQuickQuery("");
  };

  const openNotebook = (id: string) => {
    onSelectNotebook(id);
    onNavigate("tutor");
  };

  return (
    <section aria-label="Student overview" className="flex-1 min-h-full overflow-y-auto bg-[#080d18] text-slate-100">
      <div className="mx-auto w-full max-w-[1440px] space-y-7 px-4 py-6 sm:px-7 sm:py-8 lg:px-10">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mb-2 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[.18em] text-sky-300"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_12px_#34d399]" /> Your learning space</p>
            <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">{greeting}, Scholar<span className="text-sky-300">.</span></h1>
            <p className="mt-2 text-sm text-slate-400">{formatDateLabel(today)} <span className="px-1 text-slate-600">/</span> A little progress today builds big confidence tomorrow.</p>
          </div>
          <button onClick={() => onNavigate("study-plan")} className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[.04] px-4 py-2.5 text-sm font-semibold text-slate-200 transition hover:border-sky-300/40 hover:bg-sky-300/10">
            <CalendarCheck size={16} className="text-sky-300" /> Study planner <ArrowRight size={14} />
          </button>
        </header>

        <section className="relative isolate overflow-hidden rounded-[28px] border border-sky-300/15 bg-gradient-to-br from-[#14243a] via-[#101b30] to-[#17142d] p-6 shadow-2xl shadow-black/20 sm:p-9">
          <div className="pointer-events-none absolute -right-10 -top-24 -z-10 h-80 w-80 rounded-full bg-sky-500/10 blur-3xl" />
          <div className="pointer-events-none absolute bottom-[-8rem] right-[22%] -z-10 h-64 w-64 rounded-full bg-violet-500/10 blur-3xl" />
          <div className="grid gap-8 lg:grid-cols-[1.35fr_.65fr] lg:items-center">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-sky-200/15 bg-sky-200/[.07] px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-sky-200"><Sparkles size={13} /> Today’s mission</div>
              <h2 className="max-w-2xl text-2xl font-black leading-tight tracking-tight text-white sm:text-4xl">{pending ? pending.title : tasks.length ? "You’ve cleared today’s mission." : "Ready to make your next breakthrough?"}</h2>
              <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300">{pending ? `${pending.subject} · about ${pending.durationMinutes} minutes. Take it one step at a time; your coach is here if you get stuck.` : tasks.length ? "Take a moment to celebrate, then choose what you’d like to explore next." : "Start with a personalized learning quest or ask your AI tutor to make a tricky idea click."}</p>
              <div className="mt-6 flex flex-wrap gap-3">
                {pending ? <button onClick={() => onToggleTask(pending.id)} className="inline-flex items-center gap-2 rounded-xl bg-sky-300 px-5 py-3 text-sm font-extrabold text-slate-950 shadow-lg shadow-sky-900/30 transition hover:-translate-y-0.5 hover:bg-sky-200"><CheckCircle2 size={17} /> Mark mission complete</button> : <button onClick={() => onNavigate("homework")} className="inline-flex items-center gap-2 rounded-xl bg-sky-300 px-5 py-3 text-sm font-extrabold text-slate-950 shadow-lg shadow-sky-900/30 transition hover:-translate-y-0.5 hover:bg-sky-200"><GraduationCap size={17} /> Open homework desk</button>}
                <button onClick={() => nextRec && onStartRecommendation ? onStartRecommendation(nextRec) : onNavigate(nextRec?.targetTab || "practice")} className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/[.06] px-5 py-3 text-sm font-bold text-white transition hover:bg-white/10"><Brain size={16} className="text-violet-300" /> {nextRec ? "Your next best step" : "Explore practice"}</button>
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-[#08111f]/65 p-5 backdrop-blur sm:p-6">
              <div className="flex items-center justify-between gap-3"><div><p className="text-xs font-semibold text-slate-400">Today’s momentum</p><p className="mt-1 text-3xl font-black text-white">{completion}<span className="text-lg text-slate-500">%</span></p></div><div className="grid h-12 w-12 place-items-center rounded-2xl bg-sky-300/10 text-sky-200"><Target size={23}/></div></div>
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-gradient-to-r from-sky-400 to-cyan-200 transition-all duration-700" style={{width:`${completion}%`}}/></div>
              <div className="mt-3 flex justify-between text-xs text-slate-400"><span>{completedCount} of {tasks.length} tasks complete</span><span>{tasks.length ? `${tasks.length - completedCount} to go` : "Your pace, your plan"}</span></div>
              {nextRec && <div className="mt-5 flex items-start gap-3 border-t border-white/10 pt-4"><span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-violet-400/10 text-violet-200"><Zap size={15}/></span><div className="min-w-0"><p className="text-[10px] font-extrabold uppercase tracking-wider text-violet-200">Adaptive coach · {nextRec.badge}</p><p className="mt-1 text-sm font-bold text-white">{nextRec.title}</p><p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-400">{nextRec.reason}</p></div></div>}
            </div>
          </div>
        </section>

        <section aria-label="Today’s learning route" className="rounded-2xl border border-emerald-300/15 bg-gradient-to-br from-[#10231f] to-[#111a27] p-5 shadow-xl sm:p-6">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[.18em] text-emerald-200"><CalendarCheck size={14} /> Personalized daily route</p>
              <h2 className="mt-1 text-lg font-extrabold text-white">Three focused steps, saved for today</h2>
              <p className="mt-1 text-xs text-slate-400">Your steps refresh as you practice and stay saved for today.</p>
            </div>
            <span className="rounded-full border border-emerald-200/15 bg-emerald-200/[.06] px-3 py-1.5 text-xs font-bold text-emerald-100">
              {dailyRoute.items.filter((item) => item.completed).length}/{dailyRoute.items.length} complete
            </span>
          </div>
          {dailyRoute.items.length ? (
            <ol className="grid gap-3 lg:grid-cols-3">
              {dailyRoute.items.map((item) => (
                <li key={item.id} className={`rounded-xl border p-4 ${item.completed ? "border-emerald-300/20 bg-emerald-300/[.05]" : "border-white/[.08] bg-black/15"}`}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-start gap-3">
                      <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg text-xs font-black ${item.completed ? "bg-emerald-300/15 text-emerald-200" : "bg-sky-300/10 text-sky-200"}`}>
                        {item.completed ? <CheckCircle2 size={17} /> : item.slot}
                      </span>
                      <div className="min-w-0">
                        <p className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-200">
                          {item.phase === "warm-up" ? "Warm-up" : item.phase === "focus" ? "Focus round" : item.phase === "growth" ? "New trail" : item.reason.replace(/-/g, " ")} · {item.delivery?.kind === "generated-content"
                            ? `generated ${item.delivery.gameType.replace(/-/g, " ")}`
                            : "registered activity"}
                        </p>
                        <h3 className="mt-1 line-clamp-2 text-sm font-bold text-white">{item.title}</h3>
                        <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-400">{item.description}</p>
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    disabled={item.completed || !onStartRouteItem}
                    onClick={() => onStartRouteItem?.(item)}
                    className="mt-4 w-full rounded-lg bg-white/[.08] px-3 py-2 text-xs font-bold text-white transition hover:bg-emerald-300/15 disabled:cursor-default disabled:opacity-60"
                  >
                    {item.completed ? "Completed" : `Start step ${item.slot}`}
                    {!item.completed && <ArrowRight size={13} className="ml-1 inline" />}
                  </button>
                </li>
              ))}
            </ol>
          ) : (
            <p className="rounded-xl border border-dashed border-white/15 p-4 text-sm text-slate-400">Your daily route will appear when a curriculum skill is available to practice.</p>
          )}
        </section>

        <section aria-label="Learning snapshot" className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {[
            { label: "Practice sessions", value: String(thisWeek.length), note: "this week", icon: <Layers3 size={18}/>, tone: "text-sky-200 bg-sky-300/10" },
            { label: "Questions explored", value: String(attempted), note: "last 7 days", icon: <BookOpen size={18}/>, tone: "text-violet-200 bg-violet-300/10" },
            { label: "Answer accuracy", value: attempted ? `${accuracy}%` : "—", note: attempted ? `${correct} correct answers` : "Start a practice round", icon: <Target size={18}/>, tone: "text-emerald-200 bg-emerald-300/10" },
            { label: "Learning days", value: String(practiceDays), note: "out of the last 7", icon: <Flame size={18}/>, tone: "text-amber-200 bg-amber-300/10" },
          ].map((metric) => <article key={metric.label} className="rounded-2xl border border-white/[.08] bg-[#101827] p-4 sm:p-5"><div className="flex items-center justify-between"><span className="text-xs font-semibold text-slate-400">{metric.label}</span><span className={`grid h-9 w-9 place-items-center rounded-xl ${metric.tone}`}>{metric.icon}</span></div><p className="mt-3 text-2xl font-black tracking-tight text-white">{metric.value}</p><p className="mt-1 text-[11px] text-slate-500">{metric.note}</p></article>)}
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.15fr_.85fr]">
          <div className="space-y-5">
            <div className="flex items-end justify-between"><div><p className="text-[10px] font-extrabold uppercase tracking-[.18em] text-slate-500">Pick up where you left off</p><h3 className="mt-1 text-lg font-extrabold text-white">Your learning library</h3></div><button onClick={() => onNavigate("notebooks")} className="inline-flex items-center gap-1 text-xs font-bold text-sky-300 hover:text-sky-200">All notebooks <ChevronRight size={14}/></button></div>
            {recentNotebooks.length ? <div className="grid gap-3 sm:grid-cols-2">{recentNotebooks.slice(0,4).map((notebook,index) => {
              const latest = notebook.messages.at(-1);
              const status = getNotebookTopicStatus(notebook, practiceSessions);
              const statusLabel = status === "on_track" ? "On track" : status === "needs_revisiting" ? "Worth revisiting" : "Ready to explore";
              const palette = ["from-sky-400/15 to-blue-500/5 border-sky-300/10", "from-violet-400/15 to-fuchsia-500/5 border-violet-300/10", "from-emerald-400/15 to-teal-500/5 border-emerald-300/10", "from-amber-400/15 to-orange-500/5 border-amber-300/10"][index];
              return <button key={notebook.id} onClick={() => openNotebook(notebook.id)} className={`group rounded-2xl border bg-gradient-to-br ${palette} p-5 text-left transition hover:-translate-y-0.5 hover:border-white/20 hover:shadow-xl hover:shadow-black/20`}><div className="flex items-start justify-between gap-3"><span className="rounded-lg bg-black/20 px-2.5 py-1 text-[10px] font-bold text-slate-300">{notebook.subject}</span><ArrowRight size={16} className="text-slate-500 transition group-hover:translate-x-1 group-hover:text-white"/></div><h4 className="mt-4 line-clamp-1 text-base font-extrabold text-white">{notebook.name}</h4><p className="mt-1 line-clamp-2 min-h-10 text-xs leading-5 text-slate-400">{latest?.content?.replace(/[*_#`]/g, "").slice(0,100) || "Your notes, questions and tutor explanations live here."}</p><div className="mt-4 flex items-center justify-between border-t border-white/[.08] pt-3 text-[10px]"><span className="text-slate-500">{notebook.messages.length} saved notes</span><span className={status === "needs_revisiting" ? "text-amber-300" : status === "on_track" ? "text-emerald-300" : "text-sky-200"}>{statusLabel}</span></div></button>;
            })}</div> : <div className="rounded-2xl border border-dashed border-white/15 bg-white/[.02] p-8 text-center"><BookOpen className="mx-auto text-slate-500"/><p className="mt-3 text-sm font-bold text-white">Your library is ready</p><p className="mt-1 text-xs text-slate-400">Create a subject notebook to save your learning journey.</p><button onClick={() => onNavigate("notebooks")} className="mt-4 rounded-xl bg-white/10 px-4 py-2 text-xs font-bold hover:bg-white/15">Browse notebooks</button></div>}

            <div className="rounded-2xl border border-white/[.08] bg-[#101827] p-5 sm:p-6">
              <div className="flex items-center justify-between"><div><p className="text-[10px] font-extrabold uppercase tracking-[.18em] text-slate-500">Your agenda</p><h3 className="mt-1 text-lg font-extrabold text-white">Today’s study plan</h3></div><button onClick={() => onNavigate("study-plan")} className="rounded-lg p-2 text-slate-400 transition hover:bg-white/5 hover:text-white" aria-label="Open full study plan"><ArrowRight size={17}/></button></div>
              {tasks.length ? <div className="mt-4 space-y-2">{tasks.slice(0,5).map((task) => <button key={task.id} onClick={() => onToggleTask(task.id)} className="flex w-full items-start gap-3 rounded-xl border border-transparent p-3 text-left transition hover:border-white/[.08] hover:bg-white/[.03]"><span className={`mt-0.5 ${task.completed ? "text-emerald-300" : "text-slate-500"}`}>{task.completed ? <CheckCircle2 size={18}/> : <Circle size={18}/>}</span><span className="min-w-0 flex-1"><span className={`block text-sm font-semibold ${task.completed ? "text-slate-500 line-through" : "text-slate-200"}`}>{task.title}</span><span className="mt-1 flex items-center gap-2 text-[11px] text-slate-500">{task.subject}<span>·</span><Clock3 size={12}/>{task.durationMinutes} min</span></span><span className={`rounded-md px-2 py-1 text-[9px] font-bold uppercase ${task.priority === "high" ? "bg-rose-400/10 text-rose-200" : task.priority === "medium" ? "bg-amber-300/10 text-amber-200" : "bg-slate-700/60 text-slate-400"}`}>{task.priority}</span></button>)}</div> : <div className="mt-4 rounded-xl bg-white/[.03] p-5 text-center"><p className="text-sm font-semibold text-slate-200">No tasks planned for today</p><p className="mt-1 text-xs text-slate-500">Build a realistic schedule that fits your day.</p><button onClick={() => onNavigate("study-plan")} className="mt-3 inline-flex items-center gap-2 rounded-lg bg-sky-300/10 px-3 py-2 text-xs font-bold text-sky-200 hover:bg-sky-300/15">Open planner <ArrowRight size={13}/></button></div>}
            </div>
          </div>

          <aside className="space-y-5">
            <div className="overflow-hidden rounded-2xl border border-violet-300/15 bg-gradient-to-br from-[#1b1832] to-[#111827] p-5 sm:p-6"><div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-violet-300/10 text-violet-200"><Brain size={20}/></span><div><p className="text-[10px] font-extrabold uppercase tracking-[.16em] text-violet-200">Socratic tutor</p><h3 className="text-base font-extrabold text-white">Make a hard idea click.</h3></div></div><p className="mt-3 text-xs leading-5 text-slate-400">Get a hint, break down a question, or explore a topic together—without giving away the answer.</p><form onSubmit={submitAsk} className="mt-4"><label htmlFor="home-quick-ask" className="sr-only">Ask your tutor</label><div className="relative"><input id="home-quick-ask" value={quickQuery} onChange={(event) => setQuickQuery(event.target.value)} placeholder="What are you working on?" className="w-full rounded-xl border border-white/10 bg-[#0a1020] py-3 pl-4 pr-12 text-sm text-white placeholder:text-slate-600 outline-none transition focus:border-violet-300/50 focus:ring-2 focus:ring-violet-300/10"/><button type="submit" disabled={!quickQuery.trim()} aria-label="Ask tutor" className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg bg-violet-400 p-2 text-slate-950 transition hover:bg-violet-300 disabled:opacity-30"><Send size={15}/></button></div></form><button onClick={() => onNavigate("tutor")} className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-violet-200 hover:text-white">Open tutor workspace <ArrowRight size={13}/></button></div>

            <div className="rounded-2xl border border-white/[.08] bg-[#101827] p-5"><div className="flex items-center justify-between"><div><p className="text-[10px] font-extrabold uppercase tracking-[.16em] text-slate-500">Quick launch</p><h3 className="mt-1 text-base font-extrabold text-white">Choose your next move</h3></div><Zap size={18} className="text-amber-200"/></div><div className="mt-4 space-y-2">
              {[
                { title: "Practice a skill", subtitle: "Build fluency with focused rounds", tab: "practice" as NavigationTab, icon: <Target size={17}/>, tone: "text-emerald-200 bg-emerald-300/10" },
                { title: "Explore subjects", subtitle: "Find a lesson or learning path", tab: "subjects" as NavigationTab, icon: <GraduationCap size={17}/>, tone: "text-sky-200 bg-sky-300/10" },
                { title: "Review your progress", subtitle: "See strengths and next steps", tab: "progress" as NavigationTab, icon: <Sparkles size={17}/>, tone: "text-violet-200 bg-violet-300/10" },
              ].map((item) => <button key={item.tab} onClick={() => onNavigate(item.tab)} className="group flex w-full items-center gap-3 rounded-xl border border-transparent p-3 text-left transition hover:border-white/[.08] hover:bg-white/[.03]"><span className={`grid h-9 w-9 place-items-center rounded-lg ${item.tone}`}>{item.icon}</span><span className="min-w-0 flex-1"><span className="block text-xs font-bold text-slate-200">{item.title}</span><span className="mt-0.5 block text-[10px] text-slate-500">{item.subtitle}</span></span><ChevronRight size={15} className="text-slate-600 transition group-hover:translate-x-0.5 group-hover:text-white"/></button>)}
            </div></div>
          </aside>
        </section>
        <footer className="flex flex-wrap items-center justify-between gap-2 border-t border-white/[.06] pt-4 text-[10px] text-slate-600"><span>Small steps count. Your learning journey is yours.</span><span>Learning data shown from your saved practice and tasks.</span></footer>
      </div>
    </section>
  );
}
