import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../store/useGameStore';
import { soundManager } from './SoundManager';
import { Region, Quest } from '../types/game';
import { Compass, Calendar, DollarSign, Swords, MessageSquare, Sparkles } from 'lucide-react';

export const GuildHall: React.FC = () => {
  const player = useGameStore((state) => state.player);
  const setScreen = useGameStore((state) => state.setScreen);
  const addNotification = useGameStore((state) => state.addNotification);

  const [step, setStep] = useState(0);
  const [destination, setDestination] = useState('');
  const [days, setDays] = useState(3);
  const [budget, setBudget] = useState(1000);
  const [style, setStyle] = useState('Adventure'); // Adventure, Luxury, Comfort
  
  const [displayedText, setDisplayedText] = useState('');
  const [fullDialogue, setFullDialogue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isCasting, setIsCasting] = useState(false);

  if (!player) return null;

  const dialogs = [
    `Welcome, ${player.name} the ${player.className}! I am Arcanus, the AI Guild Master. I chart custom real-world destinations into magical realms. Tell me, where shall your next expedition lead?`,
    `A fascinating choosing. How many days (sun cycles) will your party occupy this new territory?`,
    `Very well. What size treasury budget (in USD) will you allot for flights, lodgings, and sustenance?`,
    `Excellent. Shall this path follow high-danger Adventure, royal Luxury, or peaceful Comfort?`,
    `Commencing ritual... Aligning dimensional gears and mapping custom questlines into your overworld database!`
  ];

  // Typer effect
  useEffect(() => {
    setFullDialogue(dialogs[step]);
    setDisplayedText('');
    setIsTyping(true);
  }, [step]);

  useEffect(() => {
    if (!fullDialogue) return;
    let idx = 0;
    const interval = setInterval(() => {
      if (idx < fullDialogue.length) {
        setDisplayedText((prev) => prev + fullDialogue.charAt(idx));
        if (fullDialogue.charAt(idx) !== ' ' && idx % 2 === 0) {
          soundManager.playDialogue();
        }
        idx++;
      } else {
        setIsTyping(false);
        clearInterval(interval);
      }
    }, 15);

    return () => clearInterval(interval);
  }, [fullDialogue]);

  const handleNextStep = () => {
    if (isTyping) {
      setDisplayedText(fullDialogue);
      setIsTyping(false);
      return;
    }

    soundManager.playClick();
    
    // Validate inputs
    if (step === 0 && !destination.trim()) return;
    if (step === 1 && (days < 1 || days > 14)) return;
    if (step === 2 && budget <= 0) return;

    if (step < 3) {
      setStep((prev) => prev + 1);
    } else {
      setStep(4);
      setIsCasting(true);

      // Generate custom region and add to Zustand store
      setTimeout(() => {
        const formattedDest = destination.charAt(0).toUpperCase() + destination.slice(1);
        const regionId = `custom_${destination.toLowerCase().trim().replace(/\s+/g, '_')}`;

        // Create custom region
        const customRegion: Region = {
          id: regionId,
          name: formattedDest,
          kingdom: `${formattedDest} Realm 🗺️`,
          description: `A custom destination of ${style} travel quests generated dynamically by Guild Master Arcanus.`,
          emoji: '🗺️',
          themeColor: 'from-purple-500 to-indigo-700',
          mapX: 150 + Math.random() * 200,
          mapY: 100 + Math.random() * 150,
          weather: Math.random() > 0.5 ? 'Rainy' : 'Sunny',
          locked: false,
          minLevel: 1,
          currentStoryStage: 0,
          story: [
            `Stage 1: Arrived in the new lands of ${formattedDest}. Establish camp coordinates.`,
            `Stage 2: Locate local portal keys and chart surrounding sights.`,
            `Stage 3: Conquer local budget benchmarks and draft safety maps.`
          ]
        };

        // Create custom quests
        const customQuests: Quest[] = [];
        for (let d = 1; d <= days; d++) {
          customQuests.push({
            id: `${regionId}_q_${d}`,
            title: `Quest Cycle ${d}: Explore ${formattedDest}`,
            description: `Draft itinerary, sample local taverns, and explore coordinates.`,
            difficulty: d % 3 === 0 ? 'Hard' : d % 2 === 0 ? 'Medium' : 'Easy',
            xpReward: 60,
            goldReward: 25,
            estimatedDuration: `${d * 3} hours`,
            requiredItems: [],
            completionPercent: 0,
            status: 'Not Started',
            locked: d > 1, // lock subsequent days
            story: `Execute custom plans for day ${d} travel in ${formattedDest}.`,
            rarity: d % 3 === 0 ? 'Rare' : 'Common',
            category: 'Exploration',
            objectives: [
              { id: `${regionId}_q_${d}_o1`, text: `Check into local Inn safehouse`, completed: false },
              { id: `${regionId}_q_${d}_o2`, text: `Eat traditional meals at a tavern`, completed: false },
              { id: `${regionId}_q_${d}_o3`, text: `Explore top landmarks in ${formattedDest}`, completed: false }
            ]
          });
        }

        // Add custom region to game state
        useGameStore.setState((state) => {
          // Prevent duplicates
          const exists = state.regions.some((r) => r.id === regionId);
          const updatedRegions = exists
            ? state.regions.map((r) => (r.id === regionId ? customRegion : r))
            : [...state.regions, customRegion];

          return {
            regions: updatedRegions,
            quests: {
              ...state.quests,
              [regionId]: customQuests
            },
            activeRegionId: regionId,
            screen: 'kingdom_dashboard',
            dashboardTab: 'quests'
          };
        });

        soundManager.playQuestComplete();
        addNotification(`Chartered custom portal to ${formattedDest}! 🌌`, 'success');
      }, 2500);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#07070a] text-slate-100 flex flex-col items-center justify-center p-4 md:p-8 select-none relative">
      {/* CRT scanline */}
      <div className="absolute inset-0 pointer-events-none z-20 crt-overlay crt-flicker opacity-40"></div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full max-w-3xl bg-zinc-900 border-4 border-black p-6 rounded shadow-[8px_8px_0px_#000] relative"
      >
        {/* Top Header */}
        <div className="flex items-center justify-between border-b-4 border-zinc-800 pb-4 mb-6">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🏰</span>
            <span className="font-retro text-[9px] text-zinc-400">GUILD EXPEDITION HALL</span>
          </div>
          <div className="flex items-center gap-2 bg-zinc-950 border-2 border-black px-3 py-1.5 text-xs font-retro text-yellow-400 rounded">
            💰 {player.gold} GP
          </div>
        </div>

        {/* Guild Master Sprite Box */}
        <div className="flex flex-col items-center justify-center bg-zinc-950 border-4 border-black p-6 rounded mb-6 min-h-[160px] relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(#1e1b4b_1px,transparent_1px)] [background-size:16px_16px] opacity-25"></div>
          
          <div className={`text-6xl mb-2 select-none relative z-10 transition-all duration-300 ${
            isCasting ? 'scale-110 rotate-12 blur-[0.5px] animate-pulse' : 'animate-[float_2s_infinite]'
          }`}>
            🧙‍♂️
          </div>
          <span className="font-retro text-[9px] text-zinc-500 tracking-wider">GUILD MASTER ARCANUS</span>

          {isCasting && (
            <div className="absolute inset-x-0 bottom-4 text-center font-retro text-[9px] text-indigo-400 animate-pulse flex items-center justify-center gap-1">
              <Sparkles size={12} className="animate-spin" /> CASTING REALM CONJURATION SPELL...
            </div>
          )}
        </div>

        {/* Speech Dialogue Box */}
        <div className="bg-zinc-950 border-4 border-black p-4 rounded min-h-[110px] mb-6 relative">
          <span className="absolute -top-3 left-4 bg-zinc-900 border-2 border-black px-2 py-0.5 text-[9px] font-retro text-indigo-400">
            DIALOGUE
          </span>
          <p className="font-pixel text-xl leading-relaxed text-indigo-100 pr-4 mt-2">
            {displayedText}
            {isTyping && <span className="cursor-blink"></span>}
          </p>
        </div>

        {/* INPUT CONTROLS ACCORDING TO STEP */}
        {!isCasting && (
          <div className="bg-zinc-950 border-4 border-zinc-850 p-6 rounded mb-6">
            {step === 0 && (
              <div className="flex flex-col gap-2">
                <label className="font-retro text-[8px] text-yellow-400 uppercase">
                  Destination Coordinates
                </label>
                <input
                  type="text"
                  placeholder="e.g., Tokyo, Paris, Goa, Dubai, Bali..."
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full bg-zinc-900 border-2 border-black text-slate-100 p-3 font-retro text-[9px] uppercase focus:outline-none focus:border-indigo-500 rounded"
                  autoFocus
                />
                <div className="flex flex-wrap gap-2 mt-2">
                  {['Tokyo', 'Paris', 'Goa', 'Dubai'].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => {
                        soundManager.playClick();
                        setDestination(preset);
                      }}
                      className="bg-zinc-850 hover:bg-zinc-700 text-zinc-400 border border-zinc-700 px-3 py-1.5 font-retro text-[7px] rounded cursor-pointer"
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="flex flex-col gap-4">
                <label className="font-retro text-[8px] text-yellow-400 uppercase">
                  Sun Cycles (Length in Days)
                </label>
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      soundManager.playClick();
                      setDays(Math.max(1, days - 1));
                    }}
                    className="w-12 h-12 bg-zinc-800 border-2 border-black text-xl font-retro text-yellow-400 rounded flex items-center justify-center cursor-pointer hover:bg-zinc-750 active:translate-y-0.5 font-bold"
                  >
                    -
                  </button>
                  <span className="font-retro text-xl w-12 text-center text-indigo-300">{days}</span>
                  <button
                    type="button"
                    onClick={() => {
                      soundManager.playClick();
                      setDays(Math.min(14, days + 1));
                    }}
                    className="w-12 h-12 bg-zinc-800 border-2 border-black text-xl font-retro text-yellow-400 rounded flex items-center justify-center cursor-pointer hover:bg-zinc-750 active:translate-y-0.5 font-bold"
                  >
                    +
                  </button>
                </div>
                <span className="text-[10px] text-zinc-500 font-pixel">Portal support bounds travel safety limit of 14 cycles.</span>
              </div>
            )}

            {step === 2 && (
              <div className="flex flex-col gap-2">
                <label className="font-retro text-[8px] text-yellow-400 uppercase">
                  Allotted Treasury Budget (USD)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-3.5 text-zinc-500 font-retro text-[8px]">$</span>
                  <input
                    type="number"
                    min={100}
                    value={budget}
                    onChange={(e) => setBudget(Number(e.target.value))}
                    className="w-full bg-zinc-900 border-2 border-black text-slate-100 p-3 pl-8 font-retro text-[9px] focus:outline-none focus:border-indigo-500 rounded"
                  />
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {[500, 1000, 2500, 5000].map((presetVal) => (
                    <button
                      key={presetVal}
                      type="button"
                      onClick={() => {
                        soundManager.playClick();
                        setBudget(presetVal);
                      }}
                      className="bg-zinc-850 hover:bg-zinc-700 text-zinc-400 border border-zinc-700 px-3 py-1.5 font-retro text-[7px] rounded cursor-pointer"
                    >
                      ${presetVal}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="flex flex-col gap-2">
                <label className="font-retro text-[8px] text-yellow-400 uppercase">
                  Choose Path Discipline
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'Adventure', name: 'Adventure', icon: '⚔️', desc: 'Daring expeditions' },
                    { id: 'Luxury', name: 'Luxury', icon: '👑', desc: 'VIP accommodation' },
                    { id: 'Comfort', name: 'Comfort', icon: '🏰', desc: 'Serene lodgings' }
                  ].map((styleOpt) => (
                    <button
                      key={styleOpt.id}
                      type="button"
                      onClick={() => {
                        soundManager.playClick();
                        setStyle(styleOpt.id);
                      }}
                      className={`p-3 border-2 border-black rounded text-center cursor-pointer transition-all ${
                        style === styleOpt.id ? 'bg-yellow-500 border-yellow-300 text-black font-bold' : 'bg-zinc-900 hover:bg-zinc-850 text-zinc-400'
                      }`}
                    >
                      <span className="text-xl block animate-pulse">{styleOpt.icon}</span>
                      <span className="font-retro text-[8px] uppercase block mt-1">{styleOpt.name}</span>
                      <span className="font-pixel text-[11px] block opacity-70 mt-1 leading-none">{styleOpt.desc}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Navigation Footer */}
        {!isCasting && (
          <div className="flex justify-between">
            <button
              onClick={() => {
                soundManager.playClick();
                setScreen('world_map');
              }}
              className="bg-zinc-800 hover:bg-zinc-700 text-zinc-400 font-retro text-xs py-3 px-6 border-4 border-black shadow-[4px_4px_0px_#000] active:translate-y-0.5 rounded cursor-pointer font-bold"
            >
              ⬅️ ABORT
            </button>
            <button
              onClick={handleNextStep}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-retro text-xs py-3 px-6 border-4 border-black shadow-[4px_4px_0px_#000] active:translate-y-0.5 rounded cursor-pointer font-bold"
            >
              {isTyping ? 'SKIP' : step === 3 ? 'CAST CONJURATION Spell ⚡' : 'CONTINUE ➔'}
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};
