import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/useGameStore';
import confetti from 'canvas-confetti';
import { Sparkles, Trophy, Play, Star } from 'lucide-react';

export const ConfettiCelebration: React.FC = () => {
  const celebrationOpen = useGameStore((state) => state.celebrationOpen);
  const celebrationType = useGameStore((state) => state.celebrationType);
  const celebratedLevel = useGameStore((state) => state.celebratedLevel);
  const celebratedQuestTitle = useGameStore((state) => state.celebratedQuestTitle);
  const closeCelebration = useGameStore((state) => state.closeCelebration);
  const player = useGameStore((state) => state.player);

  useEffect(() => {
    if (celebrationOpen) {
      // Fire confetti bursts!
      const end = Date.now() + 2.5 * 1000;

      const frame = () => {
        confetti({
          particleCount: 5,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.8 },
          colors: ['#a855f7', '#ec4899', '#facc15', '#3b82f6']
        });
        confetti({
          particleCount: 5,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0.8 },
          colors: ['#a855f7', '#ec4899', '#facc15', '#3b82f6']
        });

        if (Date.now() < end && celebrationOpen) {
          requestAnimationFrame(frame);
        }
      };

      frame();
    }
  }, [celebrationOpen]);

  if (!celebrationOpen || !player) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 select-none overflow-hidden">
        {/* Animated matrix glow background */}
        <div className="absolute inset-0 bg-[radial-gradient(#8b5cf6_1px,transparent_1px)] [background-size:24px_24px] opacity-10 animate-pulse"></div>

        <motion.div
          initial={{ scale: 0.8, y: 50, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1, transition: { type: 'spring', damping: 15 } }}
          exit={{ scale: 0.9, y: -20, opacity: 0 }}
          className="relative max-w-md w-full bg-zinc-950 border-4 border-yellow-400 p-8 rounded shadow-[0_0_30px_rgba(234,179,8,0.4)] text-center border-double"
        >
          {/* CRT scanlines inside modal */}
          <div className="crt-overlay crt-flicker"></div>

          {celebrationType === 'level_up' ? (
            <div>
              {/* Level Up Celebration */}
              <div className="relative inline-block w-20 h-20 bg-yellow-500/10 border-4 border-yellow-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_15px_rgba(234,179,8,0.2)] animate-pulse">
                <Star className="text-yellow-400 fill-yellow-400 animate-spin" size={36} />
              </div>

              <h2 className="font-retro text-lg text-yellow-400 uppercase tracking-widest drop-shadow-[2px_2px_0px_#000] mb-2">
                LEVEL UP!
              </h2>
              
              <div className="font-pixel text-4xl text-slate-100 uppercase tracking-wide mb-6">
                LEVEL {celebratedLevel} REACHED
              </div>

              <div className="bg-zinc-900 border-2 border-zinc-800 p-4 rounded text-left mb-6 flex flex-col gap-2">
                <span className="font-retro text-[9px] text-zinc-500 block uppercase border-b border-zinc-800 pb-1.5 mb-1.5">
                  🔓 EXPEDITION UNLOCKS:
                </span>
                <div className="flex items-center gap-2 text-xs font-pixel text-slate-300">
                  <span className="text-yellow-400">✨</span> Increased energy & gold gains (+5%)
                </div>
                <div className="flex items-center gap-2 text-xs font-pixel text-slate-300">
                  <span className="text-yellow-400">🗺️</span> Unmapped regions matching Level {celebratedLevel}
                </div>
                <div className="flex items-center gap-2 text-xs font-pixel text-slate-300">
                  <span className="text-yellow-400">📜</span> Story boss battles unlocked in overworld map
                </div>
              </div>
            </div>
          ) : (
            <div>
              {/* Quest Complete Celebration */}
              <div className="relative inline-block w-20 h-20 bg-indigo-500/10 border-4 border-indigo-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_15px_rgba(99,102,241,0.2)] animate-pulse">
                <Trophy className="text-indigo-400 fill-indigo-400/20" size={36} />
              </div>

              <h2 className="font-retro text-lg text-indigo-400 uppercase tracking-widest drop-shadow-[2px_2px_0px_#000] mb-2">
                QUEST CONQUERED!
              </h2>
              
              <div className="font-pixel text-3xl text-slate-200 uppercase tracking-wide mb-6 leading-tight">
                {celebratedQuestTitle}
              </div>

              <p className="font-sans text-xs text-zinc-400 mb-6 max-w-sm mx-auto leading-relaxed">
                You completed the objectives, unlocked subsequent storyline quests, and deposited the loot in your backpack treasury.
              </p>
            </div>
          )}

          {/* Continue button */}
          <button
            onClick={closeCelebration}
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-black font-retro text-xs py-3 px-6 border-4 border-black shadow-[4px_4px_0px_#000] hover:shadow-[2px_2px_0px_#000] active:translate-x-1 active:translate-y-1 transition-all rounded font-bold cursor-pointer"
          >
            CONTINUE EXPEDITION
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
