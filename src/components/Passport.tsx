import React from 'react';
import { TravelDestination } from '../data/mockData';
import { Award, Compass, Eye, ShieldAlert } from 'lucide-react';

interface PassportProps {
  unlockedDestinations: string[]; // List of IDs e.g. ['tokyo']
  unlockedBadges: string[]; // List of badges e.g. ['Explorer', 'Food Hunter']
}

export const Passport: React.FC<PassportProps> = ({ unlockedDestinations, unlockedBadges }) => {
  const allKingdomStamps = [
    { id: 'tokyo', name: 'Sakura Kingdom', emoji: '🌸', stamp: '💮 TOKYO' },
    { id: 'paris', name: 'Royal Kingdom', emoji: '👑', stamp: '⚜️ PARIS' },
    { id: 'goa', name: 'Beach Kingdom', emoji: '🏖️', stamp: '🌴 GOA' },
    { id: 'dubai', name: 'Golden Desert', emoji: '🏜️', stamp: '🐫 DUBAI' }
  ];

  const achievements = [
    { id: 'Explorer', title: 'Explorer Badge', desc: 'Unmapped and conquered the first day itinerary.', icon: '🧭' },
    { id: 'Food Hunter', title: 'Food Hunter', desc: 'Sampled local cuisines and recipes at taverns.', icon: '🍜' },
    { id: 'Budget Master', title: 'Budget Master', desc: 'Acquired travel packages saving massive gold.', icon: '💰' },
    { id: 'Solo Hero', title: 'Solo Hero', desc: 'Conquered a kingdom travel plan in single-player style.', icon: '🛡️' }
  ];

  return (
    <div className="bg-zinc-900 border-4 border-black p-4 rounded shadow-[6px_6px_0px_#000] w-full flex flex-col md:flex-row gap-6 select-none">
      {/* LEFT: Passport Stamp Book */}
      <div className="flex-1 bg-amber-50 border-4 border-amber-950 p-4 text-amber-950 rounded relative">
        {/* Subtle grid pattern for vintage look */}
        <div className="absolute inset-0 bg-[radial-gradient(#78350f_1px,transparent_1px)] [background-size:12px_12px] opacity-10"></div>
        
        <div className="flex items-center gap-2 border-b border-amber-900/30 pb-2 mb-4 relative z-10">
          <span className="text-xl">🛃</span>
          <span className="font-retro text-[10px] text-amber-900">GUILD PASSPORT STAMPS</span>
        </div>

        <div className="grid grid-cols-2 gap-4 relative z-10">
          {allKingdomStamps.map((stamp) => {
            const unlocked = unlockedDestinations.includes(stamp.id);
            return (
              <div
                key={stamp.id}
                className={`h-28 border-2 border-dashed flex flex-col items-center justify-center rounded p-2 transition-all ${
                  unlocked
                    ? 'border-amber-800 bg-amber-100 rotate-[-4deg] shadow-md'
                    : 'border-amber-300 opacity-40'
                }`}
              >
                {unlocked ? (
                  <>
                    <span className="text-3xl animate-pulse mb-1">{stamp.emoji}</span>
                    <span className="font-retro text-[8px] text-red-700 tracking-wider text-center font-bold">
                      {stamp.stamp}
                    </span>
                    <span className="font-pixel text-[10px] text-amber-700 mt-1 uppercase">APPROVED</span>
                  </>
                ) : (
                  <>
                    <span className="text-3xl filter grayscale mb-1">❓</span>
                    <span className="font-retro text-[7px] text-amber-900/50 uppercase tracking-widest text-center">
                      LOCKED STAMP
                    </span>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* RIGHT: Achievements list */}
      <div className="w-full md:w-80 flex flex-col bg-zinc-950 border-4 border-zinc-800 p-4 rounded shrink-0">
        <div className="flex items-center gap-2 border-b border-zinc-800 pb-2 mb-4">
          <Award className="text-yellow-400" size={16} />
          <span className="font-retro text-xs text-zinc-300">GUILD ACHIEVEMENTS</span>
        </div>

        <div className="flex flex-col gap-3 max-h-[250px] overflow-y-auto pr-1">
          {achievements.map((ach) => {
            const unlocked = unlockedBadges.includes(ach.id);
            return (
              <div
                key={ach.id}
                className={`p-3 border-2 border-black rounded flex gap-3 items-center transition-opacity shadow-[2px_2px_0px_#000] ${
                  unlocked ? 'bg-indigo-950/40 border-indigo-700' : 'bg-zinc-900/30 border-zinc-850 opacity-40'
                }`}
              >
                <span className={`text-2xl ${unlocked ? 'animate-bounce' : 'filter grayscale'}`}>
                  {ach.icon}
                </span>
                <div>
                  <h4 className={`font-retro text-[9px] ${unlocked ? 'text-yellow-400' : 'text-zinc-500'}`}>
                    {ach.title}
                  </h4>
                  <p className="font-pixel text-[12px] text-zinc-400 mt-0.5 leading-tight">{ach.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
