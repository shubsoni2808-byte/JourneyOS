import React, { useState } from 'react';
import soundManager from './SoundManager';
import { DayItinerary, Quest } from '../data/mockData';
import { Award, CheckSquare, Square, CheckCircle2, ChevronRight, HelpCircle } from 'lucide-react';

interface QuestLogProps {
  itinerary: DayItinerary[];
  playerStats: any;
  setPlayerStats: React.Dispatch<React.SetStateAction<any>>;
  onUnlockBadge: (badge: string) => void;
}

export const QuestLog: React.FC<QuestLogProps> = ({
  itinerary,
  playerStats,
  setPlayerStats,
  onUnlockBadge
}) => {
  const [activeDayIdx, setActiveDayIdx] = useState(0);
  const [daysState, setDaysState] = useState<DayItinerary[]>(itinerary);

  const activeDay = daysState[activeDayIdx];

  const handleToggleQuest = (questId: string) => {
    // Update local state
    let questRewardXP = 0;
    let questRewardGold = 0;
    let becameCompleted = false;

    const updatedDays = daysState.map((day) => {
      const updatedQuests = day.quests.map((q) => {
        if (q.id === questId) {
          becameCompleted = !q.completed;
          questRewardXP = becameCompleted ? q.xpReward : -q.xpReward;
          questRewardGold = becameCompleted ? q.goldReward : -q.goldReward;
          return { ...q, completed: becameCompleted };
        }
        return q;
      });
      return { ...day, quests: updatedQuests };
    });

    setDaysState(updatedDays);

    if (becameCompleted) {
      soundManager.playCoin();
    } else {
      soundManager.playClick();
    }

    // Apply XP and Gold changes
    setPlayerStats((prev: any) => {
      let newXp = prev.xp + questRewardXP;
      let newGold = prev.gold + questRewardGold;
      let newLevel = prev.level;

      // Handle Level Up (e.g. 100 XP per level)
      if (newXp >= 100 * newLevel) {
        newXp -= 100 * newLevel;
        newLevel += 1;
        // Trigger sound inside timeout to avoid overlapping
        setTimeout(() => soundManager.playLevelUp(), 100);
      } else if (newXp < 0 && newLevel > 1) {
        // level down
        newLevel -= 1;
        newXp = 100 * newLevel + newXp;
      } else if (newXp < 0) {
        newXp = 0;
      }

      return {
        ...prev,
        xp: newXp,
        gold: newGold,
        level: newLevel
      };
    });
  };

  const handleClaimDayReward = (dayIdx: number) => {
    const day = daysState[dayIdx];
    if (day.rewardClaimed) return;

    soundManager.playQuestComplete();

    // Unlock special badges
    if (dayIdx === 0) onUnlockBadge('Explorer');
    if (dayIdx === 1) onUnlockBadge('Food Hunter');

    // Mark claimed
    const updatedDays = [...daysState];
    updatedDays[dayIdx] = { ...day, rewardClaimed: true };
    setDaysState(updatedDays);

    // Reward player with gold and XP
    setPlayerStats((prev: any) => {
      let newXp = prev.xp + 150;
      let newGold = prev.gold + 50;
      let newLevel = prev.level;

      if (newXp >= 100 * newLevel) {
        newXp -= 100 * newLevel;
        newLevel += 1;
        setTimeout(() => soundManager.playLevelUp(), 100);
      }

      return {
        ...prev,
        xp: newXp,
        gold: newGold,
        level: newLevel
      };
    });
  };

  return (
    <div className="bg-zinc-900 border-4 border-black p-4 rounded shadow-[6px_6px_0px_#000] w-full flex flex-col md:flex-row gap-6">
      {/* LEFT: Sun Cycles (Tabs list) */}
      <div className="flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-visible pb-2 md:pb-0 md:w-44 shrink-0">
        {daysState.map((day, idx) => {
          const allDone = day.quests.every((q) => q.completed);
          return (
            <button
              key={day.dayNumber}
              onClick={() => {
                soundManager.playClick();
                setActiveDayIdx(idx);
              }}
              className={`p-3 border-2 border-black font-retro text-[9px] text-left uppercase cursor-pointer rounded flex items-center justify-between shrink-0 ${
                activeDayIdx === idx
                  ? 'bg-yellow-500 text-black border-yellow-300'
                  : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300'
              }`}
            >
              <span>🌅 CYCLE {day.dayNumber}</span>
              {allDone && <CheckCircle2 size={12} className="text-emerald-500 shrink-0 ml-1" />}
            </button>
          );
        })}
      </div>

      {/* RIGHT: Quest logs list */}
      <div className="flex-1 bg-zinc-950 p-4 border-4 border-zinc-800 rounded relative">
        {activeDay ? (
          <div>
            {/* Header info */}
            <div className="border-b-2 border-zinc-800 pb-3 mb-4 flex items-center justify-between">
              <div>
                <h3 className="font-retro text-xs text-yellow-400 uppercase leading-none">
                  {activeDay.title}
                </h3>
                <span className="font-pixel text-lg text-indigo-300 mt-1 block">
                  Region focus: {activeDay.theme}
                </span>
              </div>
              <span className="font-retro text-[9px] text-zinc-500">
                {activeDay.quests.filter((q) => q.completed).length}/{activeDay.quests.length} COMPLETE
              </span>
            </div>

            {/* Quests Checklist */}
            <div className="flex flex-col gap-3 mb-6">
              {activeDay.quests.map((q) => (
                <div
                  key={q.id}
                  onClick={() => handleToggleQuest(q.id)}
                  className={`flex items-start gap-3 p-3 border-2 border-black rounded cursor-pointer transition-colors shadow-[2px_2px_0px_#000] hover:bg-zinc-900 ${
                    q.completed ? 'bg-zinc-900/60 border-zinc-800 opacity-60' : 'bg-zinc-850 border-zinc-750'
                  }`}
                >
                  <button className="text-yellow-400 mt-0.5">
                    {q.completed ? <CheckSquare size={16} /> : <Square size={16} />}
                  </button>
                  <div className="flex-1">
                    <p className={`font-sans text-xs ${q.completed ? 'line-through text-zinc-500' : 'text-slate-200'}`}>
                      {q.text}
                    </p>
                    <div className="flex gap-3 mt-1.5 text-[8px] font-retro text-zinc-400">
                      <span className="text-indigo-400">✨ +{q.xpReward} XP</span>
                      <span className="text-yellow-500">💰 +{q.goldReward} GP</span>
                      <span className="uppercase text-zinc-500">[{q.category}]</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Claim Reward Button */}
            {activeDay.quests.every((q) => q.completed) && (
              <div className="bg-indigo-950/40 border-2 border-indigo-700 p-4 rounded flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl animate-bounce">🎁</span>
                  <div>
                    <h4 className="font-retro text-[10px] text-indigo-300">SUN CYCLE ACCOMPLISHED!</h4>
                    <p className="font-pixel text-sm text-zinc-400">Claim your chest of travel items and badge rewards.</p>
                  </div>
                </div>
                <button
                  onClick={() => handleClaimDayReward(activeDayIdx)}
                  disabled={activeDay.rewardClaimed}
                  className={`font-retro text-[9px] py-2 px-4 border-2 border-black rounded shadow-[2px_2px_0px_#000] active:translate-y-0.5 cursor-pointer ${
                    activeDay.rewardClaimed
                      ? 'bg-zinc-800 border-zinc-700 text-zinc-500 shadow-none active:translate-y-0'
                      : 'bg-emerald-500 hover:bg-emerald-600 text-black border-emerald-300 font-semibold animate-pulse'
                  }`}
                >
                  {activeDay.rewardClaimed ? 'CLAIMED ✓' : 'CLAIM +150 XP, +50 GP 💎'}
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-zinc-500">
            <HelpCircle size={32} className="mb-2" />
            <span className="font-retro text-xs">NO ACTIVE QUEST LOG FOUND</span>
          </div>
        )}
      </div>
    </div>
  );
};
