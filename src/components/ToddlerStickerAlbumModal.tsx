import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Award, Star, Sparkles, Lock, CheckCircle2 } from "lucide-react";
import { TODDLER_STICKERS, getExplorerRank, CollectibleSticker } from "../data/toddler/toddlerDailyAdventure";
import { soundEffects } from "../utils/soundEffects";
import { speakText } from "../utils/speechUtils";

interface ToddlerStickerAlbumModalProps {
  isOpen: boolean;
  onClose: () => void;
  starsCount: number;
}

export function ToddlerStickerAlbumModal({
  isOpen,
  onClose,
  starsCount,
}: ToddlerStickerAlbumModalProps) {
  if (!isOpen) return null;

  const currentRank = getExplorerRank(starsCount);
  const unlockedCount = TODDLER_STICKERS.filter((s) => starsCount >= s.requiredStars).length;

  const handleSelectSticker = (sticker: CollectibleSticker, isUnlocked: boolean) => {
    soundEffects.playPop();
    if (isUnlocked) {
      soundEffects.playStarSparkle();
      speakText(`${sticker.name}! ${sticker.description}`, { pitch: 1.15 });
    } else {
      speakText(`Locked sticker: ${sticker.name}. Earn ${sticker.requiredStars} stars to unlock this sticker! You have ${starsCount} stars.`, { pitch: 1.1 });
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative w-full max-w-3xl max-h-[90vh] flex flex-col rounded-3xl bg-gradient-to-b from-[#1b1933] via-[#121324] to-[#0c0d18] border-2 border-amber-400/40 shadow-2xl shadow-purple-900/50 overflow-hidden text-white"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 sm:p-6 border-b border-white/10 bg-white/[0.02]">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center text-2xl shadow-lg shadow-amber-500/30">
                ⭐
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                  <span>Explorer Sticker Album</span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30">
                    {unlockedCount} / {TODDLER_STICKERS.length}
                  </span>
                </h2>
                <p className="text-white/60 text-xs sm:text-sm">
                  Rank: <span className="font-bold text-amber-300">{currentRank.title}</span> {currentRank.emoji} • Total Stars: <span className="text-yellow-300 font-bold">{starsCount} ⭐</span>
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                soundEffects.playPop();
                onClose();
              }}
              className="p-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>

          {/* Sticker Grid */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
              {TODDLER_STICKERS.map((sticker) => {
                const isUnlocked = starsCount >= sticker.requiredStars;
                return (
                  <motion.button
                    key={sticker.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleSelectSticker(sticker, isUnlocked)}
                    className={`relative p-3 rounded-2xl border flex flex-col items-center justify-center text-center transition-all cursor-pointer ${
                      isUnlocked
                        ? "bg-gradient-to-b from-white/10 to-white/5 border-amber-400/50 shadow-md shadow-amber-500/10 hover:border-amber-300"
                        : "bg-white/[0.02] border-white/10 opacity-50 hover:opacity-75"
                    }`}
                  >
                    <div className="relative w-16 h-16 rounded-2xl flex items-center justify-center text-4xl mb-2">
                      {isUnlocked ? (
                        <span className="filter drop-shadow">{sticker.emoji}</span>
                      ) : (
                        <div className="relative">
                          <span className="filter grayscale blur-[1px] opacity-40">{sticker.emoji}</span>
                          <Lock size={18} className="absolute inset-0 m-auto text-amber-300" />
                        </div>
                      )}
                      {isUnlocked && (
                        <span className="absolute -top-1 -right-1 text-xs">✨</span>
                      )}
                    </div>

                    <div className="font-black text-xs text-white leading-tight line-clamp-1">
                      {sticker.name}
                    </div>

                    <div className="mt-1 text-[10px] font-bold">
                      {isUnlocked ? (
                        <span className="text-emerald-400 flex items-center gap-0.5 justify-center">
                          <CheckCircle2 size={10} /> Unlocked
                        </span>
                      ) : (
                        <span className="text-amber-300 flex items-center gap-0.5 justify-center">
                          <Star size={10} fill="currentColor" /> {sticker.requiredStars}
                        </span>
                      )}
                    </div>
                  </motion.button>
                );
              })}
            </div>

            {/* Encouraging Footer */}
            <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Sparkles size={20} className="text-amber-400" />
                <p className="text-xs text-white/70">
                  Tip: Complete <span className="text-white font-bold">Daily Missions</span> and play games in Toddler World to earn stars and unlock all badges!
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
