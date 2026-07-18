import React from 'react';
import { useGameStore } from '../store/useGameStore';
import { Award, Check, Lock } from 'lucide-react';

export const Passport: React.FC = () => {
  const regions = useGameStore((state) => state.regions);
  const achievements = useGameStore((state) => state.achievements);
  const quests = useGameStore((state) => state.quests);

  // Check if region has any completed quests to award stamp
  const isRegionStamped = (regionId: string) => {
    const regionQuests = quests[regionId] || [];
    return regionQuests.some((q) => q.status === 'Completed');
  };

  return (
    <div className="bg-zinc-900 border-4 border-black p-4 rounded shadow-[6px_6px_0px_#000] w-full flex flex-col md:flex-row gap-6 select-none">
      
      {/* LEFT: Passport Stamp Book */}
      <div className="flex-1 bg-amber-50 border-4 border-amber-950 p-4 text-amber-950 rounded relative min-h-[300px]">
        {/* Subtle grid pattern for vintage look */}
        <div className="absolute inset-0 bg-[radial-gradient(#78350f_1px,transparent_1px)] [background-size:12px_12px] opacity-10"></div>
        
        <div className="flex items-center gap-2 border-b border-amber-900/30 pb-2.5 mb-4 relative z-10">
          <span className="text-xl">🛃</span>
          <span className="font-retro text-[9px] text-amber-900 font-bold uppercase">GUILD PORTAL PASSPORT STAMPS</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 relative z-10">
          {regions.map((region) => {
            const stamped = isRegionStamped(region.id);
            const unlocked = !region.locked;
            
            return (
              <div
                key={region.id}
                className={`h-28 border-2 border-dashed flex flex-col items-center justify-center rounded p-2 transition-all duration-300 ${
                  stamped
                    ? 'border-amber-800 bg-amber-100/90 rotate-[-5deg] shadow-md scale-102'
                    : unlocked
                    ? 'border-amber-500 bg-amber-50/20'
                    : 'border-amber-200/40 opacity-30'
                }`}
              >
                {stamped ? (
                  <>
                    <span className="text-4xl animate-pulse mb-1">{region.emoji}</span>
                    <span className="font-retro text-[8px] text-red-700 tracking-wider text-center font-bold uppercase">
                      💮 {region.name}
                    </span>
                    <span className="font-pixel text-[11px] text-amber-700 mt-1 uppercase font-bold tracking-widest">
                      APPROVED
                    </span>
                  </>
                ) : unlocked ? (
                  <>
                    <span className="text-3xl mb-1 filter opacity-60">🎫</span>
                    <span className="font-retro text-[6px] text-amber-900/50 uppercase tracking-wider text-center font-semibold">
                      {region.name}
                    </span>
                    <span className="font-pixel text-[10px] text-amber-700 mt-1 text-center font-medium">
                      QUEST NEEDED
                    </span>
                  </>
                ) : (
                  <>
                    <Lock size={16} className="text-amber-950/40 mb-1" />
                    <span className="font-retro text-[6px] text-amber-900/30 uppercase tracking-widest text-center">
                      LOCKED
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
        <div className="flex items-center gap-2 border-b border-zinc-800 pb-2.5 mb-4">
          <Award className="text-yellow-400" size={16} />
          <span className="font-retro text-xs text-zinc-300">GUILD ACHIEVEMENTS</span>
        </div>

        <div className="flex flex-col gap-3 max-h-[300px] overflow-y-auto pr-1">
          {achievements.map((ach) => {
            const unlocked = ach.unlocked;
            return (
              <div
                key={ach.id}
                className={`p-3 border-2 border-black rounded flex gap-3 items-center transition-all shadow-[2px_2px_0px_#000] ${
                  unlocked
                    ? 'bg-indigo-950/40 border-indigo-700 shadow-[0_0_8px_rgba(99,102,241,0.2)]'
                    : 'bg-zinc-900/30 border-zinc-850 opacity-40'
                }`}
              >
                <span className={`text-2xl ${unlocked ? 'animate-bounce' : 'filter grayscale'}`}>
                  {unlocked ? ach.icon : '🔒'}
                </span>
                <div>
                  <h4 className={`font-retro text-[8px] ${unlocked ? 'text-yellow-400' : 'text-zinc-500'} font-bold`}>
                    {ach.title}
                  </h4>
                  <p className="font-pixel text-base text-zinc-400 mt-0.5 leading-tight">{ach.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
