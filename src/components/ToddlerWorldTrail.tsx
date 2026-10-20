import React, { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Lock } from "lucide-react";
import { CAST, UI_CHROME } from "../data/toddler/toddlerWorldArt";

export interface WorldTrailNode {
  id: string;
  emoji: string;
  title: string;
  subtitle?: string;
  done: boolean;
  locked: boolean;
  current: boolean;
  toy?: boolean;
}

interface ToddlerWorldTrailProps {
  label: string;
  nodes: WorldTrailNode[];
  onSelect: (id: string) => void;
  buddyEmoji?: string;
  buddySrc?: string;
  coverSrc?: string;
  sceneryEmojis?: string[];
}

export function ToddlerWorldTrail({
  label,
  nodes,
  onSelect,
  buddyEmoji = "🧒",
  buddySrc = CAST.pipCartoon,
  coverSrc,
  sceneryEmojis = [],
}: ToddlerWorldTrailProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const currentId = nodes.find((node) => node.current)?.id;

  useEffect(() => {
    const current = scrollerRef.current?.querySelector<HTMLElement>("[data-trail-current='true']");
    current?.scrollIntoView?.({ inline: "center", block: "nearest", behavior: reduceMotion ? "auto" : "smooth" });
  }, [currentId, reduceMotion]);

  return (
    <section className="space-y-2">
      <p className="px-1 text-sm font-black text-white/80">{label}</p>
      <div
        ref={scrollerRef}
        className="overflow-x-auto rounded-[2rem] border-[6px] border-amber-100 shadow-[0_16px_32px_rgba(40,20,0,0.22)]"
      >
        <div className="relative min-h-[236px] min-w-max overflow-hidden bg-gradient-to-b from-sky-300 via-sky-200 to-emerald-300">
          {coverSrc && (
            <img
              src={coverSrc}
              alt=""
              className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-50"
            />
          )}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-sky-200/35 via-transparent to-emerald-900/30" />
          <div className="pointer-events-none absolute inset-x-0 top-2 flex items-start justify-between px-8" aria-hidden>
            <img src={UI_CHROME.cloud} alt="" className="h-12 w-16 object-contain drop-shadow sm:h-14 sm:w-20" />
            <img src={UI_CHROME.sun} alt="" className="h-14 w-14 object-contain drop-shadow sm:h-16 sm:w-16" />
            <img src={UI_CHROME.cloud} alt="" className="h-10 w-14 object-contain opacity-90 drop-shadow" />
            {sceneryEmojis.slice(0, 2).map((emoji, index) => (
              <span key={`${emoji}-${index}`} className="pt-2 text-2xl opacity-80">
                {emoji}
              </span>
            ))}
          </div>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-lime-700/85 via-lime-600/40 to-transparent" />
          <div className="relative flex items-end gap-10 px-12 pb-8 pt-16">
            <div className="absolute left-16 right-16 bottom-[4.5rem] h-3 rounded-full bg-amber-800/80 shadow-inner" />
            <div className="absolute left-16 right-16 bottom-[4.65rem] h-1.5 rounded-full bg-amber-400/70" />
            {nodes.map((node) => (
              <div key={node.id} className="relative z-10 flex w-28 shrink-0 flex-col items-center">
                {node.current && (
                  <motion.span
                    animate={reduceMotion ? undefined : { y: [0, -6, 0] }}
                    transition={{ repeat: Infinity, duration: 1.6 }}
                    className="absolute -top-14 drop-shadow"
                    aria-hidden
                  >
                    {buddySrc ? (
                      <img
                        src={buddySrc}
                        alt=""
                        className="h-14 w-14 rounded-full bg-[#f6e7c1] object-contain ring-[3px] ring-white shadow-md"
                      />
                    ) : (
                      <span className="text-4xl">{buddyEmoji}</span>
                    )}
                  </motion.span>
                )}
                <motion.button
                  type="button"
                  data-trail-current={node.current ? "true" : "false"}
                  aria-disabled={node.locked}
                  whileTap={node.locked ? undefined : { scale: 0.95 }}
                  onClick={() => {
                    if (!node.locked) onSelect(node.id);
                  }}
                  className={`flex h-[92px] w-[92px] items-center justify-center rounded-full border-[8px] text-4xl shadow-lg ${
                    node.locked
                      ? "border-stone-400 bg-slate-400 cursor-not-allowed"
                      : node.current
                        ? "border-amber-700 bg-[#fff6e4] ring-4 ring-amber-300/80 cursor-pointer"
                        : node.toy
                          ? "border-sky-600 bg-[#fff6e4] cursor-pointer"
                          : node.done
                            ? "border-emerald-700 bg-[#fff6e4] cursor-pointer"
                            : "border-amber-800 bg-[#fff6e4] cursor-pointer"
                  }`}
                >
                  {node.locked ? <Lock size={28} className="text-white" /> : node.emoji}
                </motion.button>
                {node.toy && (
                  <p className="mt-1 rounded-full bg-sky-500 px-2 text-[10px] font-black uppercase tracking-wide text-white">
                    Play
                  </p>
                )}
                <p className="mt-1 max-w-[7.5rem] text-center text-sm font-black leading-tight text-slate-900">
                  {node.title}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
