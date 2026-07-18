import React, { useEffect, useState } from 'react';
import soundManager from './SoundManager';
import { Volume2, VolumeX, Settings, Play, ShieldAlert } from 'lucide-react';

interface StartMenuProps {
  onStartGame: () => void;
  onOpenSettings: () => void;
}

export const StartMenu: React.FC<StartMenuProps> = ({ onStartGame, onOpenSettings }) => {
  const [bgmActive, setBgmActive] = useState(false);
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    // Check initial mute state
    setMuted(soundManager.isMuted());
  }, []);

  const handleStart = () => {
    soundManager.playClick();
    onStartGame();
  };

  const handleToggleBgm = () => {
    if (bgmActive) {
      soundManager.stopBgm();
      setBgmActive(false);
    } else {
      soundManager.startBgm();
      setBgmActive(true);
    }
  };

  const handleToggleMute = () => {
    const isMuted = soundManager.toggleMute();
    setMuted(isMuted);
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen w-full bg-[#0a0a10] overflow-hidden select-none">
      {/* Floating Pixel Stars Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-10 left-10 text-white opacity-20 text-xs font-retro animate-bounce">★</div>
        <div className="absolute top-24 right-32 text-white opacity-40 text-sm font-retro animate-pulse">★</div>
        <div className="absolute bottom-32 left-1/4 text-white opacity-30 text-xs font-retro animate-pulse">★</div>
        <div className="absolute bottom-16 right-16 text-white opacity-20 text-xs font-retro animate-bounce">★</div>
      </div>

      {/* Floating Retro Clouds */}
      <div className="absolute inset-x-0 top-1/4 h-24 overflow-hidden pointer-events-none opacity-20 z-0">
        <div className="absolute animate-infinite-scroll flex gap-20 text-4xl text-white font-retro">
          <span>☁️ ☁️</span>
          <span className="ml-96">☁️</span>
          <span className="ml-96">☁️ ☁️</span>
        </div>
      </div>

      {/* Main Title Window */}
      <div className="z-10 flex flex-col items-center max-w-md w-full px-6 text-center">
        {/* RPG Shield Logo / Banner */}
        <div className="w-24 h-24 bg-indigo-900 border-4 border-black rounded-lg flex items-center justify-center mb-6 shadow-[4px_4px_0px_#000] animate-bounce">
          <span className="text-4xl text-yellow-400 font-retro">🗺️</span>
        </div>

        <h1 className="text-4xl md:text-5xl font-retro tracking-widest text-indigo-400 drop-shadow-[4px_4px_0px_#000] mb-2 leading-none uppercase">
          JourneyOS
        </h1>
        <p className="font-pixel text-2xl text-yellow-400 tracking-wider mb-10 drop-shadow-[1px_1px_0px_#000]">
          Your next adventure begins before you leave home.
        </p>

        {/* Buttons List */}
        <div className="flex flex-col gap-4 w-full max-w-xs">
          <button
            onClick={handleStart}
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-black font-retro text-sm py-4 px-6 border-4 border-black shadow-[4px_4px_0px_#000] hover:shadow-[2px_2px_0px_#000] active:translate-x-1 active:translate-y-1 transition-all rounded"
          >
            🕹️ NEW ADVENTURE
          </button>

          <button
            className="w-full bg-zinc-700 text-zinc-500 font-retro text-sm py-4 px-6 border-4 border-zinc-800 shadow-[4px_4px_0px_rgba(0,0,0,0.5)] cursor-not-allowed rounded"
            disabled
          >
            🔒 CONTINUE JOURNEY
          </button>

          <button
            onClick={() => {
              soundManager.playClick();
              onOpenSettings();
            }}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-retro text-sm py-4 px-6 border-4 border-black shadow-[4px_4px_0px_#000] hover:shadow-[2px_2px_0px_#000] active:translate-x-1 active:translate-y-1 transition-all rounded flex items-center justify-center gap-2"
          >
            <Settings size={16} /> SETTINGS & CREDENTIALS
          </button>
        </div>

        {/* Footer controls */}
        <div className="mt-12 flex gap-4 text-xs font-retro text-zinc-500">
          <button
            onClick={handleToggleMute}
            className="flex items-center gap-1 hover:text-white transition-colors"
          >
            {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
            {muted ? 'UNMUTE SFX' : 'MUTE SFX'}
          </button>
          
          <span className="text-zinc-600">|</span>

          <button
            onClick={handleToggleBgm}
            className="flex items-center gap-1 hover:text-white transition-colors"
          >
            <Play size={16} className={bgmActive ? 'text-emerald-400' : ''} />
            {bgmActive ? 'STOP MUSIC' : 'PLAY 8-BIT MUSIC'}
          </button>
        </div>

        <div className="mt-8 text-[10px] font-retro text-zinc-600">
          v1.0.0 © 2026 AI TRAVEL GUILD
        </div>
      </div>

      {/* Retro scanlines effect */}
      <div className="crt-overlay crt-flicker"></div>
    </div>
  );
};
