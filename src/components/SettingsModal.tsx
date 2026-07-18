import React, { useState, useEffect } from 'react';
import { useGameStore } from '../store/useGameStore';
import { soundManager } from './SoundManager';
import { Volume2, VolumeX, ShieldAlert, Key, HelpCircle, Eye, EyeOff } from 'lucide-react';

interface SettingsModalProps {
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ onClose }) => {
  const settings = useGameStore((state) => state.settings);
  const toggleMute = useGameStore((state) => state.toggleMute);
  const updateSettings = useGameStore((state) => state.updateSettings);
  const clearSave = useGameStore((state) => state.clearSave);

  const [geminiKey, setGeminiKey] = useState(settings.geminiKey);
  const [openaiKey, setOpenaiKey] = useState(settings.openaiKey);
  const [useLiveAI, setUseLiveAI] = useState(settings.useLiveAI);
  const [showGemini, setShowGemini] = useState(false);
  const [showOpenai, setShowOpenai] = useState(false);

  const handleSave = () => {
    soundManager.playClick();
    updateSettings({
      geminiKey,
      openaiKey,
      useLiveAI
    });
    onClose();
  };

  const handleWipeData = () => {
    if (confirm('⚠️ WARNING: Are you sure you want to completely erase all character levels, gold, inventory, achievements, and settings data? This cannot be undone.')) {
      clearSave();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/85 flex items-center justify-center p-4 z-50 select-none">
      <div className="w-full max-w-md bg-zinc-900 border-4 border-black p-6 rounded shadow-[6px_6px_0px_#000] relative">
        {/* CRT Scanline */}
        <div className="absolute inset-0 pointer-events-none z-20 crt-overlay crt-flicker opacity-50"></div>

        {/* Header */}
        <div className="flex items-center gap-2 border-b-2 border-zinc-800 pb-3 mb-4">
          <Key className="text-yellow-400" size={16} />
          <span className="font-retro text-xs text-zinc-300">GUILD CONTROL PANEL</span>
        </div>

        {/* SFX / BGM Toggle */}
        <div className="mb-6">
          <label className="block font-retro text-[7px] text-zinc-500 mb-2">AUDIO PROTOCOLS</label>
          <button
            onClick={() => {
              soundManager.playClick();
              toggleMute();
            }}
            className={`w-full font-retro text-[8px] py-2.5 px-4 border-2 border-black rounded shadow-[2px_2px_0px_#000] active:translate-y-0.5 cursor-pointer flex items-center justify-center gap-2 font-bold ${
              settings.muted
                ? 'bg-zinc-850 border-zinc-700 text-zinc-400 shadow-none active:translate-y-0'
                : 'bg-indigo-600 text-white border-indigo-400'
            }`}
          >
            {settings.muted ? <VolumeX size={14} /> : <Volume2 size={14} />}
            {settings.muted ? 'SFX VOLUME: MUTED' : 'SFX VOLUME: ACTIVE'}
          </button>
        </div>

        {/* AI Portal Key Configuration */}
        <div className="mb-6 flex flex-col gap-4">
          <div>
            <label className="block font-retro text-[7px] text-zinc-500 mb-2">GENAI PORTAL CONFIGURATION</label>
            <div className="flex items-center gap-2.5">
              <input
                type="checkbox"
                id="live-ai-toggle"
                checked={useLiveAI}
                onChange={(e) => {
                  soundManager.playClick();
                  setUseLiveAI(e.target.checked);
                }}
                className="accent-yellow-400 cursor-pointer h-4.5 w-4.5 shrink-0"
              />
              <label htmlFor="live-ai-toggle" className="font-retro text-[8px] text-slate-300 cursor-pointer font-bold leading-none select-none">
                ENABLE HYPER-GEN REALM CHARTS
              </label>
            </div>
            <p className="font-pixel text-[13px] text-zinc-500 mt-2 pl-7 leading-tight">
              Allows the AI Guild Master to read live weather, hotel rates, and custom storyline quests using Gemini or OpenAI.
            </p>
          </div>

          {useLiveAI && (
            <div className="flex flex-col gap-3 bg-zinc-950 p-3 border-2 border-zinc-850 rounded">
              {/* Gemini Key */}
              <div>
                <label className="block font-retro text-[7px] text-zinc-400 mb-1.5 flex items-center justify-between">
                  <span>GEMINI API TOKEN</span>
                  <button type="button" onClick={() => setShowGemini(!showGemini)} className="text-zinc-500 hover:text-white">
                    {showGemini ? <EyeOff size={10} /> : <Eye size={10} />}
                  </button>
                </label>
                <input
                  type={showGemini ? 'text' : 'password'}
                  placeholder="AIzaSy..."
                  value={geminiKey}
                  onChange={(e) => setGeminiKey(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-700 text-slate-200 p-2 font-pixel text-sm rounded focus:outline-none"
                />
              </div>

              {/* OpenAI Key */}
              <div>
                <label className="block font-retro text-[7px] text-zinc-400 mb-1.5 flex items-center justify-between">
                  <span>OPENAI API TOKEN</span>
                  <button type="button" onClick={() => setShowOpenai(!showOpenai)} className="text-zinc-500 hover:text-white">
                    {showOpenai ? <EyeOff size={10} /> : <Eye size={10} />}
                  </button>
                </label>
                <input
                  type={showOpenai ? 'text' : 'password'}
                  placeholder="sk-..."
                  value={openaiKey}
                  onChange={(e) => setOpenaiKey(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-700 text-slate-200 p-2 font-pixel text-sm rounded focus:outline-none"
                />
              </div>
            </div>
          )}
        </div>

        {/* Clear Data Section */}
        <div className="mb-6 pt-4 border-t border-zinc-800">
          <label className="block font-retro text-[7px] text-zinc-500 mb-2">DANGER LOG UTILITIES</label>
          <button
            onClick={handleWipeData}
            className="w-full bg-red-950/20 hover:bg-red-900 hover:text-white text-red-400 font-retro text-[8px] py-2.5 px-4 border-2 border-red-800 rounded active:translate-y-0.5 cursor-pointer flex items-center justify-center gap-1.5 font-bold"
          >
            <ShieldAlert size={12} /> FORMAT DRIVE: ERASE CHARACTER SAVES
          </button>
        </div>

        {/* Footer actions */}
        <div className="flex gap-3 justify-end pt-3 border-t border-zinc-800">
          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="bg-zinc-850 hover:bg-zinc-800 border border-zinc-700 text-zinc-400 font-retro text-[7px] py-2 px-4 rounded cursor-pointer uppercase font-bold"
          >
            CANCEL
          </button>
          
          <button
            onClick={handleSave}
            className="bg-emerald-500 hover:bg-emerald-600 text-black border-2 border-emerald-300 font-retro text-[7px] font-bold py-2.5 px-6 rounded cursor-pointer shadow-[2px_2px_0px_#000] uppercase"
          >
            SAVE CHANGES
          </button>
        </div>
      </div>
    </div>
  );
};
