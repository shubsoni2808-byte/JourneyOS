import React, { useState, useEffect } from 'react';
import soundManager from './components/SoundManager';
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
import { TravelDestination } from './data/mockData';
import { Coins, Sparkles, Trophy, Settings, LogOut, ShieldAlert, Heart, Calendar } from 'lucide-react';

type Screen = 'menu' | 'character_creator' | 'guild_hall' | 'world_map' | 'kingdom_dashboard';
type Tab = 'quests' | 'wallet' | 'inventory' | 'passport' | 'marketplace';

export default function App() {
  const [screen, setScreen] = useState<Screen>('menu');
  const [character, setCharacter] = useState<any>(null);
  const [itinerary, setItinerary] = useState<TravelDestination | null>(null);
  const [unlockedDestinations, setUnlockedDestinations] = useState<string[]>([]);
  const [unlockedBadges, setUnlockedBadges] = useState<string[]>([]);
  const [purchasedItems, setPurchasedItems] = useState<string[]>(['basic']); // basic backpack is free
  const [showSettings, setShowSettings] = useState(false);
  const [dashboardTab, setDashboardTab] = useState<Tab>('quests');

  // Load saved state on mount
  useEffect(() => {
    const savedChar = localStorage.getItem('journeyos_character');
    const savedDest = localStorage.getItem('journeyos_unlocked_destinations');
    const savedBadges = localStorage.getItem('journeyos_unlocked_badges');
    const savedCosmetics = localStorage.getItem('journeyos_purchased_items');

    if (savedChar) {
      setCharacter(JSON.parse(savedChar));
      setScreen('world_map');
    }
    if (savedDest) setUnlockedDestinations(JSON.parse(savedDest));
    if (savedBadges) setUnlockedBadges(JSON.parse(savedBadges));
    if (savedCosmetics) setPurchasedItems(JSON.parse(savedCosmetics));
  }, []);

  // Save character state when it changes
  useEffect(() => {
    if (character) {
      localStorage.setItem('journeyos_character', JSON.stringify(character));
    }
  }, [character]);

  // Save unlocked lists
  useEffect(() => {
    localStorage.setItem('journeyos_unlocked_destinations', JSON.stringify(unlockedDestinations));
  }, [unlockedDestinations]);

  useEffect(() => {
    localStorage.setItem('journeyos_unlocked_badges', JSON.stringify(unlockedBadges));
  }, [unlockedBadges]);

  useEffect(() => {
    localStorage.setItem('journeyos_purchased_items', JSON.stringify(purchasedItems));
  }, [purchasedItems]);

  const handleStartGame = () => {
    if (character) {
      setScreen('world_map');
    } else {
      setScreen('character_creator');
    }
  };

  const handleSaveCharacter = (newChar: any) => {
    setCharacter(newChar);
    setScreen('guild_hall');
  };

  const handleItineraryGenerated = (generatedItinerary: TravelDestination) => {
    setItinerary(generatedItinerary);
    // Add to unlocked list if not there
    if (!unlockedDestinations.includes(generatedItinerary.id)) {
      setUnlockedDestinations((prev) => [...prev, generatedItinerary.id]);
    }
    setScreen('world_map');
  };

  const handleEnterKingdom = () => {
    setScreen('kingdom_dashboard');
    setDashboardTab('quests');
  };

  const handleUnlockBadge = (badge: string) => {
    if (!unlockedBadges.includes(badge)) {
      setUnlockedBadges((prev) => [...prev, badge]);
    }
  };

  const handleClearSave = () => {
    localStorage.removeItem('journeyos_character');
    localStorage.removeItem('journeyos_unlocked_destinations');
    localStorage.removeItem('journeyos_unlocked_badges');
    localStorage.removeItem('journeyos_purchased_items');
    setCharacter(null);
    setItinerary(null);
    setUnlockedDestinations([]);
    setUnlockedBadges([]);
    setPurchasedItems(['basic']);
    setShowSettings(false);
    setScreen('menu');
  };

  const currentLevelXpNeeded = character ? character.level * 100 : 100;
  const xpPercent = character ? (character.xp / currentLevelXpNeeded) * 100 : 0;

  return (
    <div className="min-h-screen bg-[#07070a] text-slate-100 flex flex-col font-sans select-none relative">
      {/* HUD HEADER (Only visible if character is set and not on menu/creator) */}
      {character && screen !== 'menu' && screen !== 'character_creator' && (
        <header className="z-10 bg-zinc-950/90 backdrop-blur border-b-4 border-black px-4 py-3 flex flex-wrap items-center justify-between gap-4 sticky top-0">
          {/* Character Stats Info */}
          <div className="flex items-center gap-3">
            {/* Sprite Avatar */}
            <div className={`w-10 h-10 border-2 border-black flex items-center justify-center rounded text-xl shadow-[2px_2px_0px_#000] ${
              character.clothesColor === 'red' ? 'bg-red-500' :
              character.clothesColor === 'blue' ? 'bg-blue-500' :
              character.clothesColor === 'purple' ? 'bg-indigo-500' : 'bg-emerald-500'
            }`}>
              {character.classEmoji}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-retro text-[10px] text-yellow-400 font-bold">{character.name}</span>
                <span className="bg-zinc-800 text-zinc-400 text-[8px] font-retro px-1.5 py-0.5 rounded uppercase border border-black shadow-[1px_1px_0px_#000]">
                  Lvl {character.level} {character.className}
                </span>
              </div>
              
              {/* XP Progress Bar */}
              <div className="flex items-center gap-2 mt-1">
                <span className="font-retro text-[7px] text-zinc-500">XP</span>
                <div className="w-24 bg-zinc-850 h-2 border border-black p-0.5 rounded overflow-hidden">
                  <div
                    style={{ width: `${xpPercent}%` }}
                    className="bg-indigo-500 h-full rounded-sm"
                  />
                </div>
                <span className="font-pixel text-xs text-zinc-400">
                  {character.xp}/{currentLevelXpNeeded}
                </span>
              </div>
            </div>
          </div>

          {/* Active Kingdom summary */}
          {itinerary && (
            <div className="hidden md:flex items-center gap-3 bg-zinc-900 border-2 border-black px-4 py-1.5 rounded shadow-[2px_2px_0px_#000]">
              <span className="text-xl">{itinerary.emoji}</span>
              <div>
                <span className="font-retro text-[8px] text-indigo-300 block uppercase leading-none">ACTIVE REALM</span>
                <span className="font-pixel text-sm text-slate-300 block">{itinerary.kingdom}</span>
              </div>
            </div>
          )}

          {/* Wallet and Quick Controls */}
          <div className="flex items-center gap-3 ml-auto md:ml-0">
            <div className="flex items-center gap-1 font-retro text-[10px] text-yellow-400 bg-zinc-900 px-3 py-1.5 border-2 border-black rounded shadow-[2px_2px_0px_#000] select-none">
              <Coins size={12} /> {character.gold} GP
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
                className="bg-red-600 hover:bg-red-700 border-2 border-black p-2 rounded shadow-[2px_2px_0px_#000] cursor-pointer text-white flex items-center gap-1 font-retro text-[8px]"
              >
                <LogOut size={10} /> LEAVE REALM
              </button>
            )}
          </div>
        </header>
      )}

      {/* MAIN VIEW CONTROLS */}
      <main className="flex-1 w-full flex flex-col justify-center">
        {screen === 'menu' && (
          <StartMenu
            onStartGame={handleStartGame}
            onOpenSettings={() => setShowSettings(true)}
          />
        )}

        {screen === 'character_creator' && (
          <CharacterCreator
            onSave={handleSaveCharacter}
            onBack={() => setScreen('menu')}
          />
        )}

        {screen === 'guild_hall' && (
          <GuildHall
            character={character}
            onItineraryGenerated={handleItineraryGenerated}
          />
        )}

        {screen === 'world_map' && (
          <div className="max-w-4xl w-full mx-auto p-4 md:p-8 flex flex-col gap-6 items-center">
            {/* World Map Component */}
            <WorldMap
              character={character}
              activeItinerary={itinerary}
              onEnterKingdom={handleEnterKingdom}
            />

            {/* Quick helper box when no itinerary is loaded */}
            {!itinerary && (
              <div className="bg-zinc-900 border-4 border-black p-6 rounded shadow-[4px_4px_0px_#000] text-center max-w-md w-full">
                <span className="text-4xl block mb-2 float-animation">🧙‍♂️</span>
                <h3 className="font-retro text-xs text-yellow-400 mb-2">GUILD HALL ASSIGNMENT</h3>
                <p className="font-pixel text-lg text-zinc-400 mb-4">
                  Speak to the Guild Master inside the town hall to chart a travel route and unlock your first portal.
                </p>
                <button
                  onClick={() => {
                    soundManager.playClick();
                    setScreen('guild_hall');
                  }}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-retro text-xs py-3 px-6 border-4 border-black shadow-[4px_4px_0px_#000] active:translate-y-0.5 transition-all rounded cursor-pointer"
                >
                  TALK TO GUILD MASTER
                </button>
              </div>
            )}
          </div>
        )}

        {screen === 'kingdom_dashboard' && itinerary && (
          <div className="max-w-5xl w-full mx-auto p-4 md:p-8 flex flex-col gap-6">
            {/* Kingdom Dashboard Banner */}
            <div className={`p-6 border-4 border-black rounded shadow-[6px_6px_0px_#000] bg-gradient-to-r ${itinerary.themeColor} text-black flex flex-col sm:flex-row items-center justify-between gap-4 relative overflow-hidden`}>
              {/* Overlay grid cells for pixel style */}
              <div className="absolute inset-0 bg-[radial-gradient(rgba(0,0,0,0.15)_1px,transparent_1px)] [background-size:12px_12px] pointer-events-none"></div>

              <div className="flex items-center gap-4 relative z-10">
                <span className="text-5xl animate-bounce">{itinerary.emoji}</span>
                <div>
                  <h2 className="font-retro text-sm uppercase tracking-wide text-black drop-shadow-[1px_1px_0px_rgba(255,255,255,0.4)]">
                    {itinerary.kingdom}
                  </h2>
                  <p className="font-pixel text-lg text-black/85 leading-tight mt-1 max-w-xl">
                    {itinerary.description}
                  </p>
                </div>
              </div>

              {/* Day count banner */}
              <div className="bg-black text-yellow-400 px-4 py-2 border-2 border-yellow-400 font-retro text-[9px] rounded flex items-center gap-1.5 shadow-[3px_3px_0px_rgba(0,0,0,0.45)] select-none shrink-0 relative z-10">
                <Calendar size={12} /> {itinerary.itinerary.length} SUN CYCLES
              </div>
            </div>

            {/* Dashboard Tabs Toolbar */}
            <div className="flex flex-wrap gap-2 border-b-4 border-black pb-1 select-none">
              {[
                { id: 'quests', label: 'Quest Log (Itinerary)', emoji: '📜' },
                { id: 'wallet', label: 'Gold Wallet (Budget)', emoji: '👛' },
                { id: 'inventory', label: 'Backpack (Checklist)', emoji: '🎒' },
                { id: 'passport', label: 'Passport (Stamps)', emoji: '🛃' },
                { id: 'marketplace', label: 'Guild Bazaar (Shop)', emoji: '🎪' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    soundManager.playClick();
                    setDashboardTab(tab.id as Tab);
                  }}
                  className={`p-3 border-2 border-black font-retro text-[9px] uppercase cursor-pointer rounded-t transition-transform flex items-center gap-1.5 ${
                    dashboardTab === tab.id
                      ? 'bg-zinc-900 border-b-transparent text-yellow-400 translate-y-[2px]'
                      : 'bg-zinc-950 hover:bg-zinc-900 text-zinc-400 border-zinc-800'
                  }`}
                >
                  <span>{tab.emoji}</span> {tab.label}
                </button>
              ))}
            </div>

            {/* Tab content panel */}
            <div className="z-10">
              {dashboardTab === 'quests' && (
                <QuestLog
                  itinerary={itinerary.itinerary}
                  playerStats={character}
                  setPlayerStats={setCharacter}
                  onUnlockBadge={handleUnlockBadge}
                />
              )}

              {dashboardTab === 'wallet' && (
                <GoldWallet
                  destination={itinerary}
                  playerStats={character}
                  setPlayerStats={setCharacter}
                />
              )}

              {dashboardTab === 'inventory' && (
                <Inventory
                  destination={itinerary}
                />
              )}

              {dashboardTab === 'passport' && (
                <Passport
                  unlockedDestinations={unlockedDestinations}
                  unlockedBadges={unlockedBadges}
                />
              )}

              {dashboardTab === 'marketplace' && (
                <Marketplace
                  playerStats={character}
                  setPlayerStats={setCharacter}
                  character={character}
                  setCharacter={setCharacter}
                  purchasedItems={purchasedItems}
                  setPurchasedItems={setPurchasedItems}
                />
              )}
            </div>
          </div>
        )}
      </main>

      {/* Settings Modal overlay */}
      {showSettings && (
        <SettingsModal
          onClose={() => setShowSettings(false)}
          onClearSave={handleClearSave}
        />
      )}

      {/* Scanline CRT layout */}
      <div className="crt-overlay crt-flicker"></div>
    </div>
  );
}
