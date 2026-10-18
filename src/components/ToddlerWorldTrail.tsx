import React, { useEffect, useRef } from "react";
import { motion } from "motion/react";
import { Lock, Star } from "lucide-react";

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
  sceneryEmojis?: string[];
}

export function ToddlerWorldTrail({
  label,
  nodes,
  onSelect,
  buddyEmoji = "🧒",
  sceneryEmojis = [],
}: ToddlerWorldTrailProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const current = scrollerRef.current?.querySelector<HTMLElement>("[data-trail-current='true']");
    current?.scrollIntoView?.({ inline: "center", block: "nearest", behavior: "smooth" });
  }, [nodes]);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2 px-1">
        <p className="text-[11px] font-black uppercase tracking-wider text-amber-200/90">{label}</p>
        {sceneryEmojis.length > 0 && (
          <div className="flex gap-1 text-lg" aria-hidden>
            {sceneryEmojis.slice(0, 5).map((emoji, index) => (
              <span key={`${emoji}-${index}`}>{emoji}</span>
            ))}
          </div>
        )}
      </div>
      <div
        ref={scrollerRef}
        className="overflow-x-auto pb-2 rounded-[1.8rem] bg-gradient-to-b from-sky-300/20 via-emerald-400/10 to-amber-700/20 border border-white/10"
      >
        <div className="relative flex items-end min-w-max px-8 pt-10 pb-6 gap-1">
          <div className="absolute left-8 right-8 bottom-9 h-3 rounded-full bg-amber-800/90 shadow-inner" />
          <div className="absolute left-8 right-8 bottom-[2.35rem] h-0.5 rounded-full bg-amber-200/40 border-t border-dashed border-white/50" />
          {nodes.map((node, index) => (
            <div key={node.id} className="relative z-10 flex w-[7.2rem] shrink-0 flex-col items-center">
              {node.current && (
                <motion.span
                  initial={{ y: -6 }}
                  animate={{ y: [-4, 2, -4] }}
                  transition={{ repeat: Infinity, duration: 1.4 }}
                  className="text-3xl drop-shadow mb-1"
                  aria-hidden
                >
                  {buddyEmoji}
                </motion.span>
              )}
              {!node.current && <span className="h-8" />}
              <motion.button
                type="button"
                data-trail-current={node.current ? "true" : "false"}
                whileTap={node.locked ? undefined : { scale: 0.94 }}
                onClick={() => onSelect(node.id)}
                className={`w-[4.4rem] h-[4.4rem] rounded-full border-4 flex items-center justify-center text-3xl shadow-lg cursor-pointer ${
                  node.locked
                    ? "bg-slate-700/80 border-white/10 opacity-60 cursor-not-allowed"
                    : node.done
                      ? "bg-emerald-400 border-white"
                      : node.toy
                        ? "bg-gradient-to-br from-fuchsia-400 to-amber-300 border-white"
                        : "bg-gradient-to-br from-sky-300 to-amber-200 border-white"
                }`}
              >
                {node.locked ? <Lock size={22} className="text-white/80" /> : node.emoji}
              </motion.button>
              <p className="mt-2 text-[10px] font-black uppercase tracking-wide text-amber-100">
                {node.toy ? "Toy" : "Stop"} {index + 1}
              </p>
              <p className="px-1 text-center text-xs font-black text-white leading-tight line-clamp-2">{node.title}</p>
              {node.done && (
                <span className="mt-1 text-[9px] font-black text-emerald-300 flex items-center gap-0.5">
                  <Star size={9} fill="currentColor" /> Done
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
