import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../store/useGameStore';
import { soundManager } from './SoundManager';
import { Volume2, VolumeX, Settings, Play, ArrowRight, Shield } from 'lucide-react';

interface StartMenuProps {
  onStartGame: () => void;
  onOpenSettings: () => void;
}

export const StartMenu: React.FC<StartMenuProps> = ({ onStartGame, onOpenSettings }) => {
  const player = useGameStore((state) => state.player);
  const settings = useGameStore((state) => state.settings);
  const toggleMute = useGameStore((state) => state.toggleMute);
  const toggleBgm = useGameStore((state) => state.toggleBgm);
  const setScreen = useGameStore((state) => state.setScreen);

  const [bgmActive, setBgmActive] = useState(false);

  useEffect(() => {
    setBgmActive(settings.bgmActive);
  }, [settings.bgmActive]);

  const handleNewAdventure = () => {
    soundManager.playClick();
    if (player) {
      if (confirm('⚠️ Start a new adventure? This will delete your current level & inventory data.')) {
        useGameStore.getState().clearSave();
        setScreen('character_creator');
      }
    } else {
      setScreen('character_creator');
    }
  };

  const handleContinueJourney = () => {
    if (!player) return;
    soundManager.playLevelUp();
    setScreen('world_map');
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen w-full bg-[#0a0a10] overflow-hidden select-none px-4">
      {/* Interactive CRT Scanline overlay */}
      <div className="absolute inset-0 pointer-events-none z-20 crt-overlay crt-flicker"></div>

      {/* Floating Retro Stars */}
      <div className="absolute inset-0 z-0 opacity-25">
        <div className="absolute top-10 left-10 text-white font-retro animate-ping">★</div>
        <div className="absolute top-24 right-32 text-white font-retro animate-pulse">★</div>
        <div className="absolute bottom-32 left-1/4 text-white font-retro animate-bounce">★</div>
        <div className="absolute bottom-16 right-16 text-white font-retro animate-pulse">★</div>
      </div>

      {/* Floating Retro Clouds */}
      <div className="absolute inset-x-0 top-1/4 h-24 overflow-hidden pointer-events-none opacity-10 z-0">
        <div className="absolute animate-[pulse_5s_infinite] flex gap-20 text-5xl text-indigo-500 font-retro">
          <span>☁️ ☁️</span>
          <span className="ml-96">☁️</span>
          <span className="ml-96">☁️ ☁️</span>
        </div>
      </div>

      {/* Main Container */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="z-10 flex flex-col items-center max-w-md w-full text-center"
      >
        {/* RPG Shield Pulsing Logo */}
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
          className="w-24 h-24 bg-indigo-950 border-4 border-black rounded-lg flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(79,70,229,0.3)]"
        >
          <span className="text-4xl text-yellow-400 font-retro">🗺️</span>
        </motion.div>

        <h1 className="text-4xl md:text-5xl font-retro tracking-widest text-indigo-400 drop-shadow-[4px_4px_0px_#000] mb-2 leading-none uppercase">
          JourneyOS
        </h1>
        <p className="font-pixel text-2xl text-yellow-400 tracking-wider mb-10 drop-shadow-[1.5px_1.5px_0px_#000] max-w-sm">
          Your next adventure begins before you leave home.
        </p>

        {/* Buttons List */}
        <div className="flex flex-col gap-4 w-full max-w-xs">
          
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleNewAdventure}
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-black font-retro text-xs py-4 px-6 border-4 border-black shadow-[4px_4px_0px_#000] font-bold cursor-pointer rounded uppercase"
          >
            🕹️ NEW ADVENTURE
          </motion.button>

          <motion.button
            whileHover={player ? { scale: 1.03 } : {}}
            whileTap={player ? { scale: 0.97 } : {}}
            onClick={handleContinueJourney}
            disabled={!player}
            className={`w-full font-retro text-xs py-4 px-6 border-4 border-black rounded shadow-[4px_4px_0px_#000] font-bold uppercase transition-all ${
              player
                ? 'bg-yellow-500 hover:bg-yellow-600 text-black cursor-pointer'
                : 'bg-zinc-800 border-zinc-700 text-zinc-500 shadow-none cursor-not-allowed opacity-50'
            }`}
          >
            {player ? `🛡️ CONTINUE (Lvl ${player.level})` : '🔒 CONTINUE JOURNEY'}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => {
              soundManager.playClick();
              onOpenSettings();
            }}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-retro text-xs py-4 px-6 border-4 border-black shadow-[4px_4px_0px_#000] font-bold cursor-pointer rounded flex items-center justify-center gap-2 uppercase"
          >
            <Settings size={14} /> SETTINGS & UTILITIES
          </motion.button>
        </div>

        {/* Footer controls */}
        <div className="mt-12 flex gap-4 text-xs font-retro text-zinc-500">
          <button
            onClick={() => {
              soundManager.playClick();
              toggleMute();
            }}
            className="flex items-center gap-1 hover:text-white transition-colors"
          >
            {settings.muted ? <VolumeX size={14} /> : <Volume2 size={14} />}
            {settings.muted ? 'UNMUTE SFX' : 'MUTE SFX'}
          </button>
          
          <span className="text-zinc-700">|</span>

          <button
            onClick={() => {
              soundManager.playClick();
              toggleBgm();
            }}
            className="flex items-center gap-1 hover:text-white transition-colors"
          >
            <Play size={14} className={bgmActive ? 'text-emerald-400' : ''} />
            {bgmActive ? 'STOP BGM' : 'PLAY 8-BIT BGM'}
          </button>
        </div>

        <div className="mt-8 text-[8px] font-retro text-zinc-600">
          v1.1.0 © 2026 CYBER TRAVEL GUILD
        </div>
      </motion.div>
    </div>
  );
};
