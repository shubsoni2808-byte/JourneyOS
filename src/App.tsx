import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useGameStore } from './store/useGameStore';
import { soundManager } from './components/SoundManager';
import { StartMenu } from './components/StartMenu';
import { CharacterCreator } from './components/CharacterCreator';
import { GuildHall } from './components/GuildHall';
import { WorldMap } from './components/WorldMap';
import { QuestLog } from './components/QuestLog';
import { GoldWallet } from './components/GoldWallet';
import { Inventory } from './components/Inventory';
import { Passport } from './components/Passport';
import { Marketplace } from './components/Marketplace';
import { SettingsModal } from './components/SettingsModal';
import { NotificationManager } from './components/NotificationManager';
import { ConfettiCelebration } from './components/ConfettiCelebration';
import { Coins, Settings, LogOut, Calendar, Home } from 'lucide-react';

const XP_THRESHOLDS = [100, 250, 500, 900, 1500, 999999];

export default function App() {
  const screen = useGameStore((state) => state.screen);
  const player = useGameStore((state) => state.player);
  const activeRegionId = useGameStore((state) => state.activeRegionId);
  const regions = useGameStore((state) => state.regions);
  const dashboardTab = useGameStore((state) => state.dashboardTab);
  const setDashboardTab = useGameStore((state) => state.setDashboardTab);
  const setScreen = useGameStore((state) => state.setScreen);
  const quests = useGameStore((state) => state.quests);

  const [showSettings, setShowSettings] = useState(false);

  const activeRegion = regions.find((r) => r.id === activeRegionId);
  const currentLevelXpNeeded = player ? XP_THRESHOLDS[player.level - 1] : 100;
  const xpPercent = player ? Math.min((player.xp / currentLevelXpNeeded) * 100, 100) : 0;

  // Auto-init BGM if active
  useEffect(() => {
    const isBgmActive = useGameStore.getState().settings.bgmActive;
    if (isBgmActive && player && screen !== 'menu') {
      soundManager.startBgm();
    }
  }, [player, screen]);

  return (
    <div className="min-h-screen bg-[#07070a] text-slate-100 flex flex-col font-sans select-none relative overflow-x-hidden">
      {/* Visual CRT Overlay filter */}
      <div className="absolute inset-0 pointer-events-none z-40 crt-overlay crt-flicker opacity-25"></div>

      {/* Global Toast Stack and Celebrations */}
      <NotificationManager />
      <ConfettiCelebration />

      {/* HUD HEADER (Visible if character is configured and not on menu/creator) */}
      {player && screen !== 'menu' && screen !== 'character_creator' && (
        <header className="z-30 bg-zinc-950/95 backdrop-blur-md border-b-4 border-black px-4 py-3 flex flex-wrap items-center justify-between gap-4 sticky top-0">
          {/* Character Stats info */}
          <div className="flex items-center gap-3">
            {/* Sprite Avatar */}
            <div
              className={`w-10 h-10 border-2 border-black flex items-center justify-center rounded text-xl shadow-[2px_2px_0px_#000] ${
                player.clothesColor === 'red' ? 'bg-red-500' :
                player.clothesColor === 'blue' ? 'bg-blue-500' :
                player.clothesColor === 'purple' ? 'bg-indigo-500' : 'bg-emerald-500'
              }`}
            >
              {player.classEmoji}
            </div>
            
            <div>
              <div className="flex items-center gap-2">
                <span className="font-retro text-[9px] text-yellow-400 font-bold uppercase">{player.name}</span>
                <span className="bg-zinc-800 text-zinc-400 text-[7px] font-retro px-1.5 py-0.5 rounded uppercase border border-black shadow-[1px_1px_0px_#000]">
                  Lvl {player.level} {player.className}
                </span>
              </div>
              
              {/* XP progress bar */}
              <div className="flex items-center gap-2 mt-1">
                <span className="font-retro text-[6px] text-zinc-500">XP</span>
                <div className="w-24 bg-zinc-900 h-2 border border-black p-0.5 rounded overflow-hidden">
                  <div
                    style={{ width: `${xpPercent}%` }}
                    className="bg-indigo-500 h-full rounded-sm transition-all duration-300"
                  />
                </div>
                <span className="font-pixel text-xs text-zinc-400">
                  {player.xp}/{currentLevelXpNeeded}
                </span>
              </div>
            </div>
          </div>

          {/* Active Kingdom details */}
          {activeRegion && screen === 'kingdom_dashboard' && (
            <div className="hidden md:flex items-center gap-3 bg-zinc-900 border-2 border-black px-4 py-1.5 rounded shadow-[2px_2px_0px_#000]">
              <span className="text-xl animate-pulse">{activeRegion.emoji}</span>
              <div>
                <span className="font-retro text-[6px] text-indigo-300 block uppercase leading-none">ACTIVE REALM</span>
                <span className="font-pixel text-sm text-slate-300 block font-bold mt-0.5">{activeRegion.kingdom}</span>
              </div>
            </div>
          )}

          {/* Gold wallet treasury and quick controls */}
          <div className="flex items-center gap-3 ml-auto md:ml-0">
            <div className="flex items-center gap-1 font-retro text-[9px] text-yellow-400 bg-zinc-900 px-3 py-1.5 border-2 border-black rounded shadow-[2px_2px_0px_#000] gold-pulse select-none">
              <Coins size={12} className="mr-0.5" /> {player.gold} GP
            </div>
            
            <button
              onClick={() => {
                soundManager.playClick();
                setShowSettings(true);
              }}
              className="bg-zinc-800 hover:bg-zinc-700 border-2 border-black p-2 rounded shadow-[2px_2px_0px_#000] cursor-pointer text-zinc-400 hover:text-white"
              title="Settings"
            >
              <Settings size={14} />
            </button>

            {screen === 'kingdom_dashboard' && (
              <button
                onClick={() => {
                  soundManager.playClick();
                  setScreen('world_map');
                }}
                className="bg-indigo-600 hover:bg-indigo-700 border-2 border-black p-2 rounded shadow-[2px_2px_0px_#000] cursor-pointer text-white flex items-center gap-1 font-retro text-[7px] font-bold"
              >
                <Home size={11} /> OVERWORLD
              </button>
            )}
          </div>
        </header>
      )}

      {/* Screen Router */}
      <main className="flex-1 w-full flex flex-col justify-center">
        <AnimatePresence mode="wait">
          {screen === 'menu' && (
            <motion.div
              key="menu"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <StartMenu
                onStartGame={() => {}}
                onOpenSettings={() => setShowSettings(true)}
              />
            </motion.div>
          )}

          {screen === 'character_creator' && (
            <motion.div
              key="creator"
              initial={{ opacity: 0, x: 200 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -200 }}
            >
              <CharacterCreator onBack={() => setScreen('menu')} />
            </motion.div>
          )}

          {screen === 'guild_hall' && (
            <motion.div
              key="guildhall"
              initial={{ opacity: 0, y: 200 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -200 }}
            >
              <GuildHall />
            </motion.div>
          )}

          {screen === 'world_map' && (
            <motion.div
              key="worldmap"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-4xl w-full mx-auto p-4 md:p-8 flex flex-col gap-6 items-center justify-center flex-1"
            >
              {/* World Map Render */}
              <WorldMap />

              {/* Talk to Guild Master quick navigation portal */}
              <div className="bg-zinc-900 border-4 border-black p-6 rounded shadow-[4px_4px_0px_#000] text-center max-w-md w-full relative">
                <span className="text-4xl block mb-2 animate-[float_2s_infinite]">🧙‍♂️</span>
                <h3 className="font-retro text-[8px] text-yellow-400 mb-2 uppercase">GENERATE REALM CHARTS</h3>
                <p className="font-pixel text-lg text-zinc-400 mb-4">
                  Speak to Guild Master Arcanus in the Expedition Hall to map custom real-world destinations.
                </p>
                <button
                  onClick={() => {
                    soundManager.playClick();
                    setScreen('guild_hall');
                  }}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-retro text-[9px] py-3 px-6 border-4 border-black shadow-[4px_4px_0px_#000] active:translate-y-0.5 transition-all rounded cursor-pointer font-bold"
                >
                  TALK TO ARCANUS
                </button>
              </div>
            </motion.div>
          )}

          {screen === 'kingdom_dashboard' && activeRegion && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, x: -200 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 200 }}
              className="max-w-5xl w-full mx-auto p-4 md:p-8 flex flex-col gap-6 flex-1"
            >
              {/* Kingdom Dashboard Banner */}
              <div className={`p-6 border-4 border-black rounded shadow-[6px_6px_0px_#000] bg-gradient-to-r ${activeRegion.themeColor} text-black flex flex-col sm:flex-row items-center justify-between gap-4 relative overflow-hidden`}>
                {/* Pixel Grid overlays */}
                <div className="absolute inset-0 bg-[radial-gradient(rgba(0,0,0,0.15)_1px,transparent_1px)] [background-size:12px_12px] pointer-events-none"></div>

                <div className="flex items-center gap-4 relative z-10">
                  <span className="text-5xl animate-bounce">{activeRegion.emoji}</span>
                  <div>
                    <h2 className="font-retro text-xs uppercase tracking-wide text-black drop-shadow-[1px_1px_0px_rgba(255,255,255,0.45)]">
                      {activeRegion.kingdom}
                    </h2>
                    <p className="font-pixel text-lg text-black/85 leading-tight mt-1 max-w-xl">
                      {activeRegion.description}
                    </p>
                  </div>
                </div>

                {/* Day cycle banner */}
                <div className="bg-black text-yellow-400 px-4 py-2 border-2 border-yellow-400 font-retro text-[7px] rounded flex items-center gap-1.5 shadow-[3px_3px_0px_rgba(0,0,0,0.45)] select-none shrink-0 relative z-10 uppercase">
                  <Calendar size={12} /> {(quests[activeRegion.id] || []).length} STORY CYCLES
                </div>
              </div>

              {/* Dashboard Tabs toolbar */}
              <div className="flex flex-wrap gap-2 border-b-4 border-black pb-1 select-none">
                {[
                  { id: 'quests', label: 'Quest Log', emoji: '📜' },
                  { id: 'wallet', label: 'Gold Wallet', emoji: '👛' },
                  { id: 'inventory', label: 'Backpack', emoji: '🎒' },
                  { id: 'passport', label: 'Passport Stamps', emoji: '🛃' },
                  { id: 'marketplace', label: 'Bazaar Shop', emoji: '🎪' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setDashboardTab(tab.id as any)}
                    className={`p-3 border-2 border-black font-retro text-[8px] uppercase cursor-pointer rounded-t transition-transform flex items-center gap-1.5 ${
                      dashboardTab === tab.id
                        ? 'bg-zinc-900 border-b-transparent text-yellow-400 translate-y-[2px]'
                        : 'bg-zinc-950 hover:bg-zinc-900 text-zinc-400 border-zinc-800'
                    }`}
                  >
                    <span>{tab.emoji}</span> {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab component loader */}
              <div className="z-10 flex-1">
                {dashboardTab === 'quests' && <QuestLog />}
                {dashboardTab === 'wallet' && <GoldWallet />}
                {dashboardTab === 'inventory' && <Inventory />}
                {dashboardTab === 'passport' && <Passport />}
                {dashboardTab === 'marketplace' && <Marketplace />}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Settings modal */}
      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
    </div>
  );
}
