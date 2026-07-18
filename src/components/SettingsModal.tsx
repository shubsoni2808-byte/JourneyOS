import React, { useState, useEffect } from 'react';
import soundManager from './SoundManager';
import { Volume2, VolumeX, ShieldAlert, Key, HelpCircle, Eye, EyeOff } from 'lucide-react';

interface SettingsModalProps {
  onClose: () => void;
  onClearSave: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ onClose, onClearSave }) => {
  const [geminiKey, setGeminiKey] = useState('');
  const [openaiKey, setOpenaiKey] = useState('');
  const [useLiveAI, setUseLiveAI] = useState(false);
  const [showGemini, setShowGemini] = useState(false);
  const [showOpenai, setShowOpenai] = useState(false);
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    setMuted(soundManager.isMuted());
    const gKey = localStorage.getItem('journeyos_gemini_key') || '';
    const oKey = localStorage.getItem('journeyos_openai_key') || '';
    const live = localStorage.getItem('journeyos_use_live_ai') === 'true';

    setGeminiKey(gKey);
    setOpenaiKey(oKey);
    setUseLiveAI(live);
  }, []);

  const handleSave = () => {
    soundManager.playClick();
    localStorage.setItem('journeyos_gemini_key', geminiKey);
    localStorage.setItem('journeyos_openai_key', openaiKey);
    localStorage.setItem('journeyos_use_live_ai', String(useLiveAI));
    onClose();
  };

  const handleToggleMute = () => {
    const isMuted = soundManager.toggleMute();
    setMuted(isMuted);
  };

  const handleClear = () => {
    if (confirm("⚠️ ARE YOU SURE YOU WANT TO CLEAR ALL SAVE FILE AND RE-START?")) {
      soundManager.playLevelUp();
      onClearSave();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 select-none">
      <div className="w-full max-w-md bg-zinc-900 border-4 border-black p-6 rounded shadow-[6px_6px_0px_#000] relative">
        {/* CRT filter */}
        <div className="crt-overlay crt-flicker"></div>

        {/* Header */}
        <div className="flex items-center gap-2 border-b-2 border-zinc-800 pb-3 mb-4">
          <Key className="text-yellow-400" size={16} />
          <span className="font-retro text-xs text-zinc-300">GUILD SETTINGS</span>
        </div>

        {/* SFX / BGM Toggle */}
        <div className="mb-6">
          <label className="block font-retro text-[9px] text-zinc-500 mb-2">AUDIO SETUP</label>
          <button
            onClick={handleToggleMute}
            className={`w-full font-retro text-[9px] py-2.5 px-4 border-2 border-black rounded shadow-[2px_2px_0px_#000] active:translate-y-0.5 cursor-pointer flex items-center justify-center gap-2 ${
              muted ? 'bg-zinc-800 border-zinc-700 text-zinc-400 shadow-none active:translate-y-0' : 'bg-indigo-600 text-white hover:bg-indigo-700'
            }`}
          >
            {muted ? <VolumeX size={14} /> : <Volume2 size={14} />}
            {muted ? 'SFX: MUTED' : 'SFX: ACTIVE'}
          </button>
        </div>

        {/* AI Portal Key Configuration */}
        <div className="mb-6 flex flex-col gap-4">
          <div>
            <label className="block font-retro text-[9px] text-zinc-500 mb-2">LIVE AI GENERATIVE PLANNING</label>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="live-ai-toggle"
                checked={useLiveAI}
                onChange={(e) => {
                  soundManager.playClick();
                  setUseLiveAI(e.target.checked);
                }}
                className="accent-yellow-400 cursor-pointer h-4 w-4"
              />
              <label htmlFor="live-ai-toggle" className="font-retro text-[9px] text-slate-300 cursor-pointer">
                ENABLE LIVE GOOGLE GEMINI / OPENAI
              </label>
            </div>
            <p className="font-pixel text-xs text-zinc-500 mt-1 pl-6 leading-tight">
              Enables the Guild Master to read live weather, hotels, and custom travel quests from LLM models.
            </p>
          </div>

          {useLiveAI && (
            <div className="flex flex-col gap-3 bg-zinc-950 p-3 border-2 border-zinc-800 rounded">
              {/* Gemini Key */}
              <div>
                <label className="block font-retro text-[8px] text-zinc-400 mb-1.5 flex items-center justify-between">
                  <span>GEMINI API KEY</span>
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
                <label className="block font-retro text-[8px] text-zinc-400 mb-1.5 flex items-center justify-between">
                  <span>OPENAI API KEY</span>
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
          <label className="block font-retro text-[9px] text-zinc-500 mb-2">SYSTEM UTILITIES</label>
          <button
            onClick={handleClear}
            className="w-full bg-red-900 hover:bg-red-850 text-red-100 font-retro text-[8px] py-2 px-4 border-2 border-black rounded shadow-[2px_2px_0px_#000] active:translate-y-0.5 cursor-pointer flex items-center justify-center gap-1"
          >
            <ShieldAlert size={12} /> DANGER: ERASE ADVENTURE SAVES
          </button>
        </div>

        {/* Footer actions */}
        <div className="flex gap-3 justify-end pt-3 border-t border-zinc-800">
          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="bg-zinc-850 hover:bg-zinc-800 border border-zinc-700 text-zinc-400 font-retro text-[8px] py-2.5 px-4 rounded cursor-pointer"
          >
            CANCEL
          </button>
          
          <button
            onClick={handleSave}
            className="bg-emerald-500 hover:bg-emerald-600 text-black border-2 border-emerald-300 font-retro text-[8px] font-bold py-2.5 px-6 rounded cursor-pointer shadow-[2px_2px_0px_#000]"
          >
            SAVE CHANGES
          </button>
        </div>
      </div>
    </div>
  );
};
