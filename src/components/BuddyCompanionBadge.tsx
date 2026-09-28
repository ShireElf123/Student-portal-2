import React from "react";
import { motion } from "motion/react";
import { BuddyCompanionConfig, BuddyColor } from "../types";

interface BuddyCompanionBadgeProps {
  buddy?: BuddyCompanionConfig;
  size?: "sm" | "md" | "lg" | "xl";
  animated?: boolean;
  className?: string;
  onClick?: () => void;
}

const COLOR_MAP: Record<BuddyColor, { body: string; dark: string; light: string; glow: string }> = {
  pink: { body: "#ec4899", dark: "#be185d", light: "#f472b6", glow: "rgba(236,72,153,0.35)" },
  blue: { body: "#0ea5e9", dark: "#0369a1", light: "#38bdf8", glow: "rgba(14,165,233,0.35)" },
  lime: { body: "#84cc16", dark: "#4d7c0f", light: "#a3e635", glow: "rgba(132,204,22,0.35)" },
  amber: { body: "#f59e0b", dark: "#b45309", light: "#fbbf24", glow: "rgba(245,158,11,0.35)" },
  purple: { body: "#a855f7", dark: "#7e22ce", light: "#c084fc", glow: "rgba(168,85,247,0.35)" },
  coral: { body: "#f97316", dark: "#c2410c", light: "#fb923c", glow: "rgba(249,115,22,0.35)" },
};

export function BuddyCompanionBadge({
  buddy,
  size = "md",
  animated = true,
  className = "",
  onClick,
}: BuddyCompanionBadgeProps) {
  const current = buddy || {
    id: "default",
    name: "Pip",
    archetype: "monster",
    color: "pink",
    eyeStyle: "cyclops",
    hat: "explorer",
    accessory: "bowtie",
    catchphrase: "Ready for adventure!",
  };

  const colors = COLOR_MAP[current.color] || COLOR_MAP.pink;

  const sizePx = {
    sm: 40,
    md: 64,
    lg: 120,
    xl: 200,
  }[size];

  return (
    <motion.div
      whileHover={onClick ? { scale: 1.08, rotate: [0, -3, 3, 0] } : undefined}
      whileTap={onClick ? { scale: 0.95 } : undefined}
      onClick={onClick}
      className={`relative select-none flex items-center justify-center ${
        onClick ? "cursor-pointer" : ""
      } ${className}`}
      style={{ width: sizePx, height: sizePx }}
    >
      <motion.svg
        viewBox="0 0 100 100"
        className="w-full h-full drop-shadow-md overflow-visible"
        animate={
          animated
            ? {
                y: [0, -3, 0],
                rotate: [0, 1, -1, 0],
              }
            : undefined
        }
        transition={{
          repeat: Infinity,
          duration: 3.2,
          ease: "easeInOut",
        }}
      >
        <defs>
          <linearGradient id={`grad-${current.color}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={colors.light} />
            <stop offset="100%" stopColor={colors.body} />
          </linearGradient>
          <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="4" stdDeviation="3" floodColor={colors.dark} floodOpacity="0.3" />
          </filter>
        </defs>

        {/* ACCESSORY: CAPE (BEHIND) */}
        {current.accessory === "cape" && (
          <path
            d="M 30 55 C 20 85, 20 95, 28 98 C 45 92, 55 92, 72 98 C 80 95, 80 85, 70 55 Z"
            fill="#e11d48"
            stroke="#9f1239"
            strokeWidth="2"
          />
        )}

        {/* BODY SHAPES PER ARCHETYPE */}
        {current.archetype === "monster" && (
          <g filter="url(#softGlow)">
            {/* Monster Horns / Ear Tufts */}
            <path d="M 22 30 Q 15 15 28 22 Z" fill={colors.dark} />
            <path d="M 78 30 Q 85 15 72 22 Z" fill={colors.dark} />
            {/* Main Rounded Pear Body */}
            <ellipse cx="50" cy="58" rx="36" ry="34" fill={`url(#grad-${current.color})`} />
            {/* Belly highlight */}
            <ellipse cx="50" cy="65" rx="20" ry="17" fill="white" opacity="0.25" />
            {/* Cute Little Feet */}
            <ellipse cx="36" cy="90" rx="9" ry="6" fill={colors.dark} />
            <ellipse cx="64" cy="90" rx="9" ry="6" fill={colors.dark} />
            {/* Little Hands */}
            <ellipse cx="15" cy="62" rx="6" ry="8" fill={colors.dark} transform="rotate(15 15 62)" />
            <ellipse cx="85" cy="62" rx="6" ry="8" fill={colors.dark} transform="rotate(-15 85 62)" />
          </g>
        )}

        {current.archetype === "alien" && (
          <g filter="url(#softGlow)">
            {/* Antenna with glowing orb */}
            <path d="M 50 28 L 50 12" stroke={colors.dark} strokeWidth="3" strokeLinecap="round" />
            <circle cx="50" cy="10" r="5" fill="#38bdf8" stroke="white" strokeWidth="1.5" />
            {/* Tear-drop Alien Head */}
            <ellipse cx="50" cy="55" rx="35" ry="32" fill={`url(#grad-${current.color})`} />
            <path d="M 30 75 Q 50 88 70 75 Q 50 92 30 75" fill={colors.dark} opacity="0.4" />
            {/* Floating saucer rim or little feet */}
            <ellipse cx="50" cy="85" rx="26" ry="6" fill="#0284c7" opacity="0.8" />
          </g>
        )}

        {current.archetype === "robot" && (
          <g filter="url(#softGlow)">
            {/* Antenna & Ear bolts */}
            <rect x="47" y="14" width="6" height="12" fill="#64748b" />
            <circle cx="50" cy="12" r="4" fill="#ef4444" />
            <rect x="12" y="44" width="6" height="12" rx="2" fill="#94a3b8" />
            <rect x="82" y="44" width="6" height="12" rx="2" fill="#94a3b8" />
            {/* Squircle Robotic Head */}
            <rect x="18" y="26" width="64" height="58" rx="16" fill={`url(#grad-${current.color})`} stroke={colors.dark} strokeWidth="2" />
            {/* Screen border */}
            <rect x="25" y="34" width="50" height="42" rx="10" fill="#0f172a" />
          </g>
        )}

        {current.archetype === "forest-bunny" && (
          <g filter="url(#softGlow)">
            {/* Long Floppy Bunny Ears */}
            <ellipse cx="32" cy="22" rx="8" ry="18" fill={`url(#grad-${current.color})`} transform="rotate(-12 32 22)" />
            <ellipse cx="32" cy="23" rx="4" ry="12" fill="#fbcfe8" transform="rotate(-12 32 23)" />
            <ellipse cx="68" cy="22" rx="8" ry="18" fill={`url(#grad-${current.color})`} transform="rotate(12 68 22)" />
            <ellipse cx="68" cy="23" rx="4" ry="12" fill="#fbcfe8" transform="rotate(12 68 23)" />
            {/* Round Chubby Bunny Face */}
            <ellipse cx="50" cy="60" rx="35" ry="30" fill={`url(#grad-${current.color})`} />
            {/* Rosy Cheeks */}
            <circle cx="28" cy="68" r="6" fill="#f43f5e" opacity="0.4" />
            <circle cx="72" cy="68" r="6" fill="#f43f5e" opacity="0.4" />
            {/* Whiskers */}
            <line x1="22" y1="67" x2="8" y2="65" stroke={colors.dark} strokeWidth="1.5" strokeLinecap="round" />
            <line x1="22" y1="71" x2="8" y2="73" stroke={colors.dark} strokeWidth="1.5" strokeLinecap="round" />
            <line x1="78" y1="67" x2="92" y2="65" stroke={colors.dark} strokeWidth="1.5" strokeLinecap="round" />
            <line x1="78" y1="71" x2="92" y2="73" stroke={colors.dark} strokeWidth="1.5" strokeLinecap="round" />
          </g>
        )}

        {/* EYES STYLES */}
        {current.eyeStyle === "cyclops" && (
          <g>
            <circle cx="50" cy="52" r="14" fill="white" stroke="#1e293b" strokeWidth="2.5" />
            <circle cx="51" cy="52" r="7" fill="#0284c7" />
            <circle cx="52" cy="51" r="3.5" fill="#0f172a" />
            <circle cx="54" cy="49" r="2.5" fill="white" />
          </g>
        )}

        {current.eyeStyle === "happy" && (
          <g>
            <circle cx="38" cy="52" r="8" fill="white" stroke="#1e293b" strokeWidth="2" />
            <circle cx="39" cy="52" r="4.5" fill="#1e293b" />
            <circle cx="41" cy="50" r="2" fill="white" />

            <circle cx="62" cy="52" r="8" fill="white" stroke="#1e293b" strokeWidth="2" />
            <circle cx="63" cy="52" r="4.5" fill="#1e293b" />
            <circle cx="65" cy="50" r="2" fill="white" />
          </g>
        )}

        {current.eyeStyle === "starry" && (
          <g>
            <circle cx="38" cy="52" r="9" fill="white" stroke="#1e293b" strokeWidth="2" />
            <text x="38" y="56" textAnchor="middle" fontSize="10" fill="#f59e0b">⭐</text>
            <circle cx="62" cy="52" r="9" fill="white" stroke="#1e293b" strokeWidth="2" />
            <text x="62" y="56" textAnchor="middle" fontSize="10" fill="#f59e0b">⭐</text>
          </g>
        )}

        {current.eyeStyle === "wink" && (
          <g>
            {/* Open Starry Eye */}
            <circle cx="38" cy="52" r="8.5" fill="white" stroke="#1e293b" strokeWidth="2" />
            <circle cx="39" cy="52" r="5" fill="#0284c7" />
            <circle cx="41" cy="50" r="2" fill="white" />
            {/* Playful Wink Arch */}
            <path d="M 55 53 Q 63 46 71 53" stroke="#1e293b" strokeWidth="3" fill="none" strokeLinecap="round" />
          </g>
        )}

        {current.eyeStyle === "goggles" && (
          <g>
            {/* Golden Steampunk / Explorer Goggles */}
            <rect x="25" y="44" width="22" height="18" rx="8" fill="#38bdf8" opacity="0.8" stroke="#ca8a04" strokeWidth="3" />
            <rect x="53" y="44" width="22" height="18" rx="8" fill="#38bdf8" opacity="0.8" stroke="#ca8a04" strokeWidth="3" />
            <line x1="47" y1="53" x2="53" y2="53" stroke="#ca8a04" strokeWidth="3" />
            <line x1="14" y1="53" x2="25" y2="53" stroke="#854d0e" strokeWidth="2.5" />
            <line x1="75" y1="53" x2="86" y2="53" stroke="#854d0e" strokeWidth="2.5" />
          </g>
        )}

        {/* SMILE / MOUTH */}
        <path
          d="M 43 68 Q 50 75 57 68"
          stroke="#1e293b"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />

        {/* HATS & HEADWEAR */}
        {current.hat === "explorer" && (
          <g>
            {/* Summer Camp Explorer Hat (Inspired by KidCamp) */}
            <ellipse cx="50" cy="27" rx="30" ry="7" fill="#65a30d" stroke="#365314" strokeWidth="2" />
            <path d="M 32 27 Q 35 10 50 9 Q 65 10 68 27 Z" fill="#84cc16" stroke="#365314" strokeWidth="2" />
            <rect x="33" y="22" width="34" height="4" fill="#b45309" />
            <circle cx="50" cy="24" r="2.5" fill="#facc15" />
          </g>
        )}

        {current.hat === "party" && (
          <g>
            <path d="M 38 27 L 50 3 L 62 27 Z" fill="#f43f5e" stroke="#881337" strokeWidth="1.5" />
            <circle cx="50" cy="3" r="4" fill="#facc15" />
            <line x1="42" y1="20" x2="58" y2="20" stroke="#facc15" strokeWidth="2" />
            <line x1="44" y1="12" x2="56" y2="12" stroke="#38bdf8" strokeWidth="2" />
          </g>
        )}

        {current.hat === "wizard" && (
          <g>
            <ellipse cx="50" cy="28" rx="28" ry="6" fill="#4338ca" stroke="#312e81" strokeWidth="1.5" />
            <path d="M 34 27 Q 45 6 62 4 Q 52 14 66 27 Z" fill="#6366f1" stroke="#312e81" strokeWidth="1.5" />
            <text x="46" y="20" fontSize="8" fill="#fde047">✨</text>
          </g>
        )}

        {current.hat === "astronaut" && (
          <g>
            <circle cx="50" cy="50" r="38" fill="none" stroke="#e2e8f0" strokeWidth="4" opacity="0.6" />
            <ellipse cx="38" cy="30" rx="6" ry="2" fill="white" opacity="0.8" transform="rotate(-25 38 30)" />
          </g>
        )}

        {current.hat === "crown" && (
          <g>
            <path d="M 32 25 L 36 12 L 44 20 L 50 8 L 56 20 L 64 12 L 68 25 Z" fill="#facc15" stroke="#a16207" strokeWidth="1.5" />
            <circle cx="36" cy="12" r="2" fill="#ef4444" />
            <circle cx="50" cy="8" r="2.5" fill="#3b82f6" />
            <circle cx="64" cy="12" r="2" fill="#10b981" />
          </g>
        )}

        {/* ACCESSORY: FRONT */}
        {current.accessory === "bowtie" && (
          <g>
            <polygon points="42,80 50,83 42,86" fill="#ef4444" stroke="#991b1b" strokeWidth="1" />
            <polygon points="58,80 50,83 58,86" fill="#ef4444" stroke="#991b1b" strokeWidth="1" />
            <circle cx="50" cy="83" r="2.5" fill="#fbbf24" />
          </g>
        )}

        {current.accessory === "medal" && (
          <g>
            <path d="M 44 80 L 48 87 L 50 85" stroke="#3b82f6" strokeWidth="2" fill="none" />
            <path d="M 56 80 L 52 87 L 50 85" stroke="#ef4444" strokeWidth="2" fill="none" />
            <circle cx="50" cy="88" r="4.5" fill="#f59e0b" stroke="#78350f" strokeWidth="1" />
            <text x="50" y="90" fontSize="5" textAnchor="middle" fill="#78350f">★</text>
          </g>
        )}

        {current.accessory === "balloon" && (
          <g>
            <path d="M 78 70 Q 82 50 78 35" stroke="#94a3b8" strokeWidth="1" fill="none" strokeDasharray="2,2" />
            <ellipse cx="78" cy="28" rx="8" ry="11" fill="#ec4899" />
            <polygon points="77,39 79,39 78,41" fill="#be185d" />
          </g>
        )}
      </motion.svg>
    </motion.div>
  );
}
