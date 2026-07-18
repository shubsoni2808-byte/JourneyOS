import React, { useState, useEffect } from 'react';
import soundManager from './SoundManager';
import { generateItinerary, TravelDestination } from '../data/mockData';
import { Compass, Calendar, DollarSign, Swords, MessageSquare, Sparkles } from 'lucide-react';

interface GuildHallProps {
  character: any;
  onItineraryGenerated: (itinerary: TravelDestination) => void;
}

export const GuildHall: React.FC<GuildHallProps> = ({ character, onItineraryGenerated }) => {
  const [step, setStep] = useState(0);
  const [destination, setDestination] = useState('');
  const [days, setDays] = useState(3);
  const [budget, setBudget] = useState(1000);
  const [style, setStyle] = useState('Adventure'); // Adventure, Luxury, Comfort
  
  const [displayedText, setDisplayedText] = useState('');
  const [fullDialogue, setFullDialogue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isCasting, setIsCasting] = useState(false);

  const dialogs = [
    `Welcome, ${character.name} the ${character.className}! I am the AI Guild Master. I chart the kingdoms of the world. Speak: Where shall your next grand expedition take place?`,
    `Ah! A grand choice indeed. How many days (sun cycles) will your party spend in this realm?`,
    `Understood. And what size is your treasury (total budget in USD) for this quest?`,
    `Marvelous. Shall this be a path of daring Adventure, grand Luxury, or serene Comfort?`,
    `Wait a moment... I am aligning the dimensional gears and casting the AI flight portals to chart your travel quest log!`
  ];

  // Letter-by-letter dialogue typer
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
        // Play dialog click sound on letters (not spaces, and throttled)
        if (fullDialogue.charAt(idx) !== ' ' && idx % 2 === 0) {
          soundManager.playDialogue();
        }
        idx++;
      } else {
        setIsTyping(false);
        clearInterval(interval);
      }
    }, 20); // typing speed

    return () => clearInterval(interval);
  }, [fullDialogue]);

  const handleNextStep = () => {
    if (isTyping) {
      // Skip typing animation
      setDisplayedText(fullDialogue);
      setIsTyping(false);
      return;
    }

    soundManager.playClick();
    
    // Validations
    if (step === 0 && !destination.trim()) return;
    if (step === 1 && (days < 1 || days > 14)) return;
    if (step === 2 && budget <= 0) return;

    if (step < 3) {
      setStep((prev) => prev + 1);
    } else {
      // Final casting step
      setStep(4);
      setIsCasting(true);
      
      // Simulate "AI Generation"
      setTimeout(() => {
        const itinerary = generateItinerary(destination, days, budget, style);
        soundManager.playQuestComplete();
        onItineraryGenerated(itinerary);
      }, 3000);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#07070a] text-slate-100 flex flex-col items-center justify-center p-4 md:p-8 select-none">
      {/* CRT scanline */}
      <div className="crt-overlay crt-flicker"></div>

      <div className="w-full max-w-3xl bg-zinc-900 border-4 border-black p-6 rounded shadow-[8px_8px_0px_#000] relative">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b-4 border-zinc-800 pb-4 mb-6">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🏰</span>
            <span className="font-retro text-xs text-zinc-400">TRAVEL GUILD HALL</span>
          </div>
          <div className="flex items-center gap-2 bg-zinc-950 border-2 border-black px-3 py-1 text-xs font-retro text-yellow-400 rounded">
            💰 {character.gold} GP
          </div>
        </div>

        {/* Guild Master Sprite Box */}
        <div className="flex flex-col items-center justify-center bg-zinc-950 border-4 border-black p-6 rounded mb-6 min-h-[160px] relative overflow-hidden">
          {/* Animated Background matrix particles */}
          <div className="absolute inset-0 bg-[radial-gradient(#1e1b4b_1px,transparent_1px)] [background-size:16px_16px] opacity-20"></div>
          
          <div className={`text-6xl mb-2 select-none relative z-10 transition-all duration-300 ${
            isCasting ? 'scale-110 rotate-12 blur-[0.5px] animate-pulse' : 'float-animation'
          }`}>
            🧙‍♂️
          </div>
          <span className="font-retro text-[10px] text-zinc-500 tracking-wider">GUILD MASTER ARCANUS</span>

          {isCasting && (
            <div className="absolute inset-x-0 bottom-4 text-center font-retro text-[10px] text-indigo-400 animate-pulse flex items-center justify-center gap-1">
              <Sparkles size={12} className="animate-spin" /> CASTING TRAVEL PLAN SPELL...
            </div>
          )}
        </div>

        {/* Speech Dialogue Box */}
        <div className="bg-zinc-950 border-4 border-black p-4 rounded min-h-[110px] mb-6 relative">
          <span className="absolute -top-3 left-4 bg-zinc-900 border-2 border-black px-2 py-0.5 text-[9px] font-retro text-indigo-400 flex items-center gap-1">
            <MessageSquare size={10} /> DIALOGUE
          </span>
          <p className="font-pixel text-xl leading-relaxed text-indigo-100 pr-4 mt-2">
            {displayedText}
            {isTyping && <span className="cursor-blink"></span>}
          </p>
        </div>

        {/* INPUT CONTROLS ACCORDING TO STEP */}
        {!isCasting && (
          <div className="bg-zinc-950 border-4 border-zinc-800 p-6 rounded mb-6">
            {step === 0 && (
              <div className="flex flex-col gap-2">
                <label className="font-retro text-xs text-yellow-400 flex items-center gap-1">
                  <Compass size={14} /> DESTINATION KINGDOM
                </label>
                <input
                  type="text"
                  placeholder="e.g., Tokyo, Paris, Goa, Dubai, Bali..."
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full bg-zinc-900 border-2 border-black text-slate-100 p-3 font-retro text-xs uppercase focus:outline-none focus:border-indigo-500 rounded"
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
                      className="bg-zinc-850 hover:bg-zinc-700 text-zinc-400 border border-zinc-700 px-3 py-1 font-retro text-[9px] rounded cursor-pointer"
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="flex flex-col gap-4">
                <label className="font-retro text-xs text-yellow-400 flex items-center gap-1">
                  <Calendar size={14} /> SUN CYCLES (DAYS)
                </label>
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      soundManager.playClick();
                      setDays(Math.max(1, days - 1));
                    }}
                    className="w-12 h-12 bg-zinc-800 border-2 border-black text-xl font-retro text-yellow-400 rounded flex items-center justify-center cursor-pointer hover:bg-zinc-700 active:translate-y-0.5"
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
                    className="w-12 h-12 bg-zinc-800 border-2 border-black text-xl font-retro text-yellow-400 rounded flex items-center justify-center cursor-pointer hover:bg-zinc-700 active:translate-y-0.5"
                  >
                    +
                  </button>
                </div>
                <span className="text-[10px] text-zinc-500 font-retro">Max capacity is 14 days for safety.</span>
              </div>
            )}

            {step === 2 && (
              <div className="flex flex-col gap-2">
                <label className="font-retro text-xs text-yellow-400 flex items-center gap-1">
                  <DollarSign size={14} /> GOLD TREASURY (BUDGET IN USD)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-3.5 text-zinc-500 font-retro text-xs">$</span>
                  <input
                    type="number"
                    min={100}
                    value={budget}
                    onChange={(e) => setBudget(Number(e.target.value))}
                    className="w-full bg-zinc-900 border-2 border-black text-slate-100 p-3 pl-8 font-retro text-xs focus:outline-none focus:border-indigo-500 rounded"
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
                      className="bg-zinc-850 hover:bg-zinc-700 text-zinc-400 border border-zinc-700 px-3 py-1 font-retro text-[9px] rounded cursor-pointer"
                    >
                      ${presetVal}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="flex flex-col gap-2">
                <label className="font-retro text-xs text-yellow-400 flex items-center gap-1">
                  <Swords size={14} /> PATH CONVICTION (TRAVEL STYLE)
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'Adventure', name: 'Adventure', icon: '⚔️', desc: 'Daring expeditions' },
                    { id: 'Luxury', name: 'Luxury', icon: '👑', desc: 'Golden VIP service' },
                    { id: 'Comfort', name: 'Comfort', icon: '🏰', desc: 'Serene resting zones' }
                  ].map((styleOpt) => (
                    <button
                      key={styleOpt.id}
                      type="button"
                      onClick={() => {
                        soundManager.playClick();
                        setStyle(styleOpt.id);
                      }}
                      className={`p-3 border-2 border-black rounded text-center cursor-pointer transition-colors ${
                        style === styleOpt.id ? 'bg-yellow-500 border-yellow-300 text-black font-semibold' : 'bg-zinc-900 hover:bg-zinc-850 text-zinc-400'
                      }`}
                    >
                      <span className="text-xl block">{styleOpt.icon}</span>
                      <span className="font-retro text-[9px] uppercase block mt-1">{styleOpt.name}</span>
                      <span className="font-pixel text-[10px] block opacity-70 mt-1 leading-none">{styleOpt.desc}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Footer Navigation */}
        {!isCasting && (
          <div className="flex justify-end">
            <button
              onClick={handleNextStep}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-retro text-xs py-3 px-6 border-4 border-black shadow-[4px_4px_0px_#000] active:translate-x-1 active:translate-y-1 transition-all rounded cursor-pointer"
            >
              {isTyping ? 'SKIP DIALOGUE ➔' : step === 3 ? 'CAST SPELL (GENERATE) ⚡' : 'CONTINUE ➔'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
