import React, { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Lock } from "lucide-react";

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
  buddySrc,
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
        className="overflow-x-auto rounded-[2rem] border border-white/20 shadow-xl"
      >
        <div className="relative min-h-[220px] min-w-max overflow-hidden bg-gradient-to-b from-sky-300 via-sky-200 to-emerald-300">
          {coverSrc && (
            <img
              src={coverSrc}
              alt=""
              decoding="async"
              className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-55"
            />
          )}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-sky-200/40 via-transparent to-emerald-900/25" />
          <div className="pointer-events-none absolute inset-x-0 top-3 flex justify-between px-10 text-3xl opacity-70" aria-hidden>
            <span>☁️</span>
            <span>☀️</span>
            <span>☁️</span>
            {sceneryEmojis.slice(0, 2).map((emoji, index) => (
              <span key={`${emoji}-${index}`}>{emoji}</span>
            ))}
          </div>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-lime-600/80 to-transparent" />
          <div className="relative flex items-end gap-10 px-12 pb-8 pt-16">
            <div className="absolute left-16 right-16 bottom-[4.35rem] h-2 rounded-full bg-amber-700/70" />
            {nodes.map((node) => (
              <div key={node.id} className="relative z-10 flex w-28 shrink-0 flex-col items-center">
                {node.current && (
                  <motion.span
                    animate={reduceMotion ? undefined : { y: [0, -6, 0] }}
                    transition={{ repeat: Infinity, duration: 1.6 }}
                    className="absolute -top-12 drop-shadow"
                    aria-hidden
                  >
                    {buddySrc ? (
                      <img
                        src={buddySrc}
                        alt=""
                        width={48}
                        height={48}
                        decoding="async"
                        className="h-12 w-12 rounded-full object-cover object-top ring-2 ring-white shadow-md"
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
                  className={`flex h-[88px] w-[88px] sm:h-[104px] sm:w-[104px] items-center justify-center rounded-full border-[6px] text-4xl sm:text-5xl shadow-lg ${
                    node.locked
                      ? "border-white/40 bg-slate-400 cursor-not-allowed"
                      : node.current
                        ? "border-amber-300 bg-white ring-4 ring-amber-300/70 cursor-pointer"
                        : node.toy
                          ? "border-sky-400 bg-white cursor-pointer"
                          : node.done
                            ? "border-emerald-400 bg-white cursor-pointer"
                            : "border-white bg-white cursor-pointer"
                  }`}
                >
                  {node.locked ? <Lock size={28} className="text-white" /> : node.emoji}
                </motion.button>
                {node.toy && (
                  <p className="mt-1 rounded-full bg-sky-500 px-2 text-[10px] font-black uppercase tracking-wide text-white">
                    Play
                  </p>
                )}
                <p className="mt-1 max-w-[8.5rem] text-center text-sm sm:text-base font-black leading-tight text-slate-900">
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
