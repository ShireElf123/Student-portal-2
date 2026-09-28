import React from "react";
import { motion } from "motion/react";
import { soundEffects } from "../../utils/soundEffects";

/**
 * Organic Rolling Hills SVG Divider
 * Emulates the layered hills, grass mounds, and pine borders from top kids' web designs.
 */
interface RollingHillsDividerProps {
  variant?: "meadow" | "pine-forest" | "cloud-sky" | "night-starlight" | "warm-sun";
  direction?: "down" | "up";
  heightClass?: string;
  className?: string;
  showFlowers?: boolean;
}

export function RollingHillsDivider({
  variant = "meadow",
  direction = "down",
  heightClass = "h-14 sm:h-20 md:h-24",
  className = "",
  showFlowers = true,
}: RollingHillsDividerProps) {
  const isUp = direction === "up";

  if (variant === "pine-forest") {
    return (
      <div className={`relative w-full overflow-hidden leading-none ${className} ${isUp ? "rotate-180" : ""}`}>
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className={`w-full ${heightClass} fill-[#2d6a4f]`}
        >
          {/* Back darker forest row */}
          <path
            opacity="0.5"
            d="M0,70 L30,40 L60,70 L90,30 L120,70 L160,35 L200,75 L240,40 L280,80 L320,30 L360,70 L400,25 L440,75 L480,35 L520,75 L560,30 L600,70 L640,35 L680,75 L720,25 L760,70 L800,35 L840,75 L880,30 L920,70 L960,35 L1000,75 L1040,30 L1080,70 L1120,35 L1160,70 L1200,40 L1200,120 L0,120 Z"
            fill="#1b4332"
          />
          {/* Front lighter pine trees */}
          <path
            d="M0,80 L40,45 L80,85 L130,40 L180,90 L220,50 L260,85 L310,45 L350,85 L410,40 L460,90 L510,45 L550,85 L610,40 L660,90 L710,45 L760,85 L810,40 L860,90 L910,45 L950,85 L1010,40 L1060,90 L1110,45 L1150,85 L1200,50 L1200,120 L0,120 Z"
            fill="#2d6a4f"
          />
        </svg>
      </div>
    );
  }

  if (variant === "cloud-sky") {
    return (
      <div className={`relative w-full overflow-hidden leading-none ${className} ${isUp ? "rotate-180" : ""}`}>
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className={`w-full ${heightClass}`}
        >
          {/* Soft background blue puff */}
          <path
            d="M0,60 C150,90 350,20 500,60 C650,100 850,30 1000,70 C1100,90 1150,60 1200,65 L1200,120 L0,120 Z"
            fill="#e0f2fe"
            opacity="0.7"
          />
          {/* Pure white fluffy foreground cloud */}
          <path
            d="M0,80 C120,40 240,100 380,60 C520,20 660,90 800,50 C940,10 1080,70 1200,55 L1200,120 L0,120 Z"
            fill="#ffffff"
          />
        </svg>
      </div>
    );
  }

  if (variant === "night-starlight") {
    return (
      <div className={`relative w-full overflow-hidden leading-none ${className} ${isUp ? "rotate-180" : ""}`}>
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className={`w-full ${heightClass}`}
        >
          <path
            d="M0,45 C200,15 400,70 600,40 C800,10 1000,60 1200,35 L1200,120 L0,120 Z"
            fill="#1e1b4b"
            opacity="0.6"
          />
          <path
            d="M0,65 C180,45 360,95 550,60 C740,25 920,80 1200,50 L1200,120 L0,120 Z"
            fill="#0f172a"
          />
        </svg>
      </div>
    );
  }

  if (variant === "warm-sun") {
    return (
      <div className={`relative w-full overflow-hidden leading-none ${className} ${isUp ? "rotate-180" : ""}`}>
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className={`w-full ${heightClass}`}
        >
          <path
            d="M0,50 C220,15 420,80 640,45 C860,10 1060,70 1200,40 L1200,120 L0,120 Z"
            fill="#f59e0b"
            opacity="0.4"
          />
          <path
            d="M0,70 C190,40 380,95 580,65 C780,35 980,85 1200,55 L1200,120 L0,120 Z"
            fill="#d97706"
          />
        </svg>
      </div>
    );
  }

  // Default: Smeshariki-style Lush Green Rolling Meadow Hills
  return (
    <div className={`relative w-full overflow-hidden leading-none ${className} ${isUp ? "rotate-180" : ""}`}>
      <svg
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
        className={`w-full ${heightClass}`}
      >
        {/* Distant soft hill */}
        <path
          d="M0,35 C180,8 360,60 550,30 C740,0 950,50 1200,25 L1200,120 L0,120 Z"
          fill="#4ade80"
          opacity="0.4"
        />
        {/* Middle rolling hill */}
        <path
          d="M0,55 C220,20 440,75 660,40 C880,5 1060,65 1200,35 L1200,120 L0,120 Z"
          fill="#22c55e"
        />
        {/* Front lush green slope */}
        <path
          d="M0,80 C190,50 390,95 600,65 C810,35 1010,80 1200,55 L1200,120 L0,120 Z"
          fill="#16a34a"
        />
      </svg>

      {/* Scattered Daisy / Meadow Flowers across hill crest */}
      {showFlowers && !isUp && (
        <div className="absolute bottom-2 left-0 right-0 flex justify-around pointer-events-none px-6 opacity-80 text-xs sm:text-sm">
          <span className="animate-pulse">🌼</span>
          <span className="hidden sm:inline">🌸</span>
          <span>🌼</span>
          <span className="hidden md:inline">🌷</span>
          <span>🌼</span>
          <span className="hidden sm:inline">🌸</span>
        </div>
      )}
    </div>
  );
}

/**
 * Tactical Agency 3D Chunky Button
 * Features 4px-6px bottom rim, click compression, sound effect, and agency kid-game feel.
 */
interface TactileAgencyButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  colorScheme?: "amber" | "emerald" | "rose" | "indigo" | "sky" | "white";
  size?: "sm" | "md" | "lg";
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export function TactileAgencyButton({
  colorScheme = "amber",
  size = "md",
  icon,
  children,
  className = "",
  onClick,
  ...rest
}: TactileAgencyButtonProps) {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    soundEffects.playPop();
    onClick?.(e);
  };

  const colorStyles = {
    amber: "bg-gradient-to-b from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-amber-950 border-amber-600 active:border-b-0",
    emerald: "bg-gradient-to-b from-emerald-400 to-emerald-500 hover:from-emerald-300 hover:to-emerald-400 text-emerald-950 border-emerald-700 active:border-b-0",
    rose: "bg-gradient-to-b from-rose-400 to-pink-500 hover:from-rose-300 hover:to-pink-400 text-white border-rose-700 active:border-b-0",
    indigo: "bg-gradient-to-b from-indigo-400 to-indigo-600 hover:from-indigo-300 hover:to-indigo-500 text-white border-indigo-800 active:border-b-0",
    sky: "bg-gradient-to-b from-sky-400 to-blue-500 hover:from-sky-300 hover:to-blue-400 text-sky-950 border-blue-700 active:border-b-0",
    white: "bg-white hover:bg-slate-50 text-slate-800 border-slate-300 active:border-b-0",
  }[colorScheme];

  const sizeStyles = {
    sm: "px-3.5 py-1.5 text-xs font-black rounded-xl border-b-3",
    md: "px-5 py-2.5 text-sm font-black rounded-2xl border-b-4",
    lg: "px-7 py-3.5 text-base font-black rounded-full border-b-[5px]",
  }[size];

  return (
    <button
      onClick={handleClick}
      className={`inline-flex items-center justify-center gap-2 cursor-pointer shadow-md select-none transition-all active:translate-y-1 ${colorStyles} ${sizeStyles} ${className}`}
      {...rest}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span className="truncate">{children}</span>
    </button>
  );
}

/**
 * Puffy Cloud Floating Decal
 */
export function FloatingCloudDecoration({
  className = "",
  size = "md",
}: {
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const wClass = size === "sm" ? "w-24 h-12" : size === "md" ? "w-36 h-18" : "w-48 h-24";

  return (
    <div className={`pointer-events-none select-none opacity-80 ${wClass} ${className} animate-float-gentle`}>
      <svg viewBox="0 0 200 100" className="w-full h-full fill-white drop-shadow-md">
        <path d="M50 70 A30 30 0 0 1 70 30 A35 35 0 0 1 120 25 A35 35 0 0 1 155 45 A25 25 0 0 1 160 70 Z" />
      </svg>
    </div>
  );
}

/**
 * Character Anchor Badge (breaks outside container borders like in Smeshariki / KidCamp)
 */
interface CharacterAnchorProps {
  emoji: string;
  title: string;
  subtitle?: string;
  badge?: string;
  position?: "top-left" | "top-right" | "bottom-right";
  onClick?: () => void;
}

export function CharacterAnchor({
  emoji,
  title,
  subtitle,
  badge,
  position = "top-right",
  onClick,
}: CharacterAnchorProps) {
  const posClasses = {
    "top-left": "-top-7 -left-3 sm:-top-9 sm:-left-5",
    "top-right": "-top-7 -right-3 sm:-top-9 sm:-right-5",
    "bottom-right": "-bottom-7 -right-3 sm:-bottom-9 sm:-right-5",
  }[position];

  return (
    <motion.div
      whileHover={{ scale: 1.08, rotate: [0, -4, 4, 0] }}
      whileTap={{ scale: 0.94 }}
      onClick={onClick}
      className={`absolute ${posClasses} z-20 flex items-center gap-2 bg-gradient-to-tr from-white to-amber-50 rounded-2xl p-2 sm:p-2.5 shadow-xl border-2 border-amber-300 select-none cursor-pointer`}
    >
      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-amber-400/20 flex items-center justify-center text-2xl sm:text-3xl shadow-inner animate-bounce">
        {emoji}
      </div>
      <div className="pr-2 text-left">
        {badge && (
          <span className="inline-block px-1.5 py-0.2 rounded-md bg-amber-400 text-amber-950 text-[9px] font-black uppercase tracking-wider">
            {badge}
          </span>
        )}
        <div className="text-xs sm:text-sm font-black text-slate-800 leading-tight">{title}</div>
        {subtitle && <div className="text-[10px] text-slate-500 font-semibold">{subtitle}</div>}
      </div>
    </motion.div>
  );
}
