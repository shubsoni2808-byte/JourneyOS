import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../store/useGameStore';
import { Quest, QuestRarity, QuestDifficulty } from '../types/game';
import { soundManager } from './SoundManager';
import { Award, CheckSquare, Square, CheckCircle2, AlertTriangle, Compass, ShieldAlert, Sparkles, BookOpen, Clock } from 'lucide-react';

export const QuestLog: React.FC = () => {
  const activeRegionId = useGameStore((state) => state.activeRegionId);
  const regions = useGameStore((state) => state.regions);
  const allQuests = useGameStore((state) => state.quests);
  const toggleObjective = useGameStore((state) => state.toggleObjective);
  const claimQuestReward = useGameStore((state) => state.claimQuestReward);
  const player = useGameStore((state) => state.player);
  const purchasedItems = useGameStore((state) => state.purchasedItems);

  const activeRegion = regions.find((r) => r.id === activeRegionId);
  const regionQuests = activeRegionId ? allQuests[activeRegionId] || [] : [];

  // Local selection of quest
  const [selectedQuestId, setSelectedQuestId] = useState<string | null>(
    regionQuests.length > 0 ? regionQuests[0].id : null
  );

  if (!activeRegion || !player) {
    return (
      <div className="bg-zinc-900 border-4 border-black p-8 rounded shadow-[6px_6px_0px_#000] text-center text-zinc-500">
        <ShieldAlert size={32} className="mx-auto mb-2" />
        <span className="font-retro text-xs">NO ACTIVE REGION SET</span>
      </div>
    );
  }

  const selectedQuest = regionQuests.find((q) => q.id === selectedQuestId) || regionQuests[0];

  const getRarityColor = (rarity: QuestRarity) => {
    switch (rarity) {
      case 'Legendary':
        return 'text-amber-400 border-amber-400 bg-amber-950/20';
      case 'Epic':
        return 'text-purple-400 border-purple-400 bg-purple-950/20';
      case 'Rare':
        return 'text-blue-400 border-blue-400 bg-blue-950/20';
      case 'Uncommon':
        return 'text-emerald-400 border-emerald-400 bg-emerald-950/20';
      default:
        return 'text-zinc-400 border-zinc-500 bg-zinc-900/30';
    }
  };

  const getDifficultyColor = (diff: QuestDifficulty) => {
    switch (diff) {
      case 'Legendary':
        return 'text-red-500 font-bold';
      case 'Hard':
        return 'text-orange-500';
      case 'Medium':
        return 'text-yellow-500';
      default:
        return 'text-emerald-400';
    }
  };

  const handleQuestSelect = (quest: Quest) => {
    soundManager.playClick();
    setSelectedQuestId(quest.id);
  };

  return (
    <div className="bg-zinc-900 border-4 border-black p-4 rounded shadow-[6px_6px_0px_#000] w-full flex flex-col md:flex-row gap-6">
      
      {/* LEFT: Quest Tree Directory */}
      <div className="flex-1 flex flex-col gap-3 min-h-[300px]">
        <div className="flex items-center gap-2 border-b-2 border-zinc-800 pb-2.5 mb-1">
          <BookOpen className="text-yellow-400 animate-pulse" size={14} />
          <span className="font-retro text-[9px] text-zinc-400">EXPEDITION QUEST BOARD</span>
        </div>

        <div className="flex flex-col gap-2 overflow-y-auto max-h-[400px] pr-1">
          {regionQuests.map((q) => {
            const isSelected = selectedQuest?.id === q.id;
            const isClaimReady = q.status === 'Claim Reward';
            const isCompleted = q.status === 'Completed';

            // Check if player has required items
            const missingItems = q.requiredItems.filter(item => !purchasedItems.includes(item));
            const isLocked = q.locked || missingItems.length > 0;

            return (
              <div
                key={q.id}
                onClick={() => !isLocked && handleQuestSelect(q)}
                className={`p-3 border-2 rounded transition-all shadow-[2px_2px_0px_#000] relative overflow-hidden ${
                  isLocked
                    ? 'border-zinc-800 bg-zinc-950/40 opacity-40 cursor-not-allowed'
                    : isSelected
                    ? 'border-yellow-400 bg-zinc-950'
                    : 'border-black bg-zinc-850 hover:bg-zinc-800 cursor-pointer'
                }`}
              >
                {/* Node connector line */}
                <div className="absolute top-0 bottom-0 left-1 w-1 bg-zinc-800"></div>

                <div className="flex justify-between items-start gap-2 pl-3">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-retro text-[9px] text-slate-100 uppercase tracking-wide">
                        {q.title}
                      </span>
                      <span className={`border text-[6px] font-retro px-1 py-0.5 rounded leading-none ${getRarityColor(q.rarity)}`}>
                        {q.rarity}
                      </span>
                    </div>

                    <div className="flex gap-3 mt-1.5 text-[7px] font-retro text-zinc-400">
                      <span>Category: {q.category}</span>
                      <span className={getDifficultyColor(q.difficulty)}>Diff: {q.difficulty.toUpperCase()}</span>
                    </div>
                  </div>

                  {/* Status Indicator Badges */}
                  <div className="shrink-0 flex items-center gap-1">
                    {isLocked ? (
                      <span className="font-retro text-[6px] text-zinc-500 bg-zinc-900 border border-zinc-800 px-1 py-0.5 rounded">
                        LOCKED
                      </span>
                    ) : isCompleted ? (
                      <CheckCircle2 size={14} className="text-emerald-500 animate-pulse" />
                    ) : isClaimReady ? (
                      <span className="font-retro text-[6px] text-yellow-400 bg-yellow-950/50 border border-yellow-500 px-1 py-0.5 rounded animate-pulse font-bold">
                        LOOT READY
                      </span>
                    ) : q.status === 'In Progress' ? (
                      <span className="font-retro text-[6px] text-sky-400 bg-sky-950/50 border border-sky-500 px-1 py-0.5 rounded animate-pulse">
                        RUNNING
                      </span>
                    ) : (
                      <span className="font-retro text-[6px] text-zinc-400 bg-zinc-900 border border-zinc-700 px-1 py-0.5 rounded">
                        TODO
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* RIGHT: Quest Inspector Drawer */}
      <div className="w-full md:w-96 bg-zinc-950 border-4 border-zinc-800 p-4 rounded flex flex-col justify-between shrink-0 min-h-[350px]">
        {selectedQuest ? (
          <div className="flex flex-col h-full justify-between gap-4">
            
            <div>
              {/* Quest Header */}
              <div className="border-b border-zinc-800 pb-3 mb-3">
                <div className="flex justify-between items-center gap-2 mb-1.5">
                  <span className={`font-retro text-[7px] border px-1.5 py-0.5 rounded ${getRarityColor(selectedQuest.rarity)}`}>
                    {selectedQuest.category.toUpperCase()} • {selectedQuest.rarity.toUpperCase()}
                  </span>
                  <span className="font-retro text-[7px] text-zinc-500 flex items-center gap-1">
                    <Clock size={10} /> {selectedQuest.estimatedDuration}
                  </span>
                </div>
                <h4 className="font-retro text-xs text-yellow-400 leading-tight">
                  {selectedQuest.title}
                </h4>
              </div>

              {/* Story lore box */}
              <div className="bg-zinc-900 border border-zinc-850 p-2.5 rounded mb-3 text-[12px] font-pixel text-zinc-400 italic">
                "{selectedQuest.story}"
              </div>

              <p className="text-zinc-300 font-sans text-xs mb-4">
                {selectedQuest.description}
              </p>

              {/* Objective Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between font-retro text-[7px] text-zinc-500 mb-1">
                  <span>QUEST PROGRESSION</span>
                  <span>{selectedQuest.completionPercent}%</span>
                </div>
                <div className="w-full bg-zinc-900 h-2 border border-black p-0.5 rounded overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${selectedQuest.completionPercent}%` }}
                    className="bg-indigo-500 h-full rounded-sm"
                    transition={{ type: 'spring', stiffness: 80 }}
                  />
                </div>
              </div>

              {/* Required Items Check */}
              {selectedQuest.requiredItems.length > 0 && (
                <div className="mb-4 p-2.5 bg-zinc-900 border border-zinc-850 rounded">
                  <span className="font-retro text-[7px] text-zinc-500 block mb-1">REQUIRED GEAR</span>
                  <div className="flex flex-wrap gap-2">
                    {selectedQuest.requiredItems.map((item) => {
                      const hasItem = purchasedItems.includes(item);
                      return (
                        <span
                          key={item}
                          className={`font-pixel text-xs px-2 py-0.5 border rounded flex items-center gap-1.5 ${
                            hasItem
                              ? 'bg-emerald-950/20 border-emerald-500 text-emerald-400'
                              : 'bg-red-950/20 border-red-800 text-red-400'
                          }`}
                        >
                          {hasItem ? '✓' : '⚠️'} {item.toUpperCase()}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Checklist Objectives */}
              <div>
                <span className="font-retro text-[7px] text-zinc-500 block mb-2">OBJECTIVES CHECKLIST</span>
                <div className="flex flex-col gap-2">
                  {selectedQuest.objectives.map((obj) => {
                    const isCompleted = selectedQuest.status === 'Completed';
                    return (
                      <div
                        key={obj.id}
                        onClick={() => selectedQuest.status !== 'Completed' && toggleObjective(selectedQuest.id, obj.id)}
                        className={`flex items-start gap-2.5 p-2 border-2 border-black rounded transition-colors shadow-[1px_1px_0px_#000] ${
                          isCompleted
                            ? 'bg-zinc-950/40 border-zinc-900 opacity-50 cursor-not-allowed'
                            : obj.completed
                            ? 'bg-zinc-900/60 border-zinc-800 cursor-pointer opacity-70'
                            : 'bg-zinc-850 border-zinc-750 cursor-pointer hover:bg-zinc-900'
                        }`}
                      >
                        <button className="text-yellow-400 shrink-0 mt-0.5">
                          {obj.completed || isCompleted ? <CheckSquare size={12} /> : <Square size={12} />}
                        </button>
                        <span className={`font-pixel text-base leading-tight ${
                          obj.completed || isCompleted ? 'line-through text-zinc-500' : 'text-slate-200'
                        }`}>
                          {obj.text}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Claim Rewards panel / button */}
            <div className="mt-4 pt-3 border-t border-zinc-900">
              {selectedQuest.status === 'Claim Reward' ? (
                <button
                  onClick={() => claimQuestReward(selectedQuest.id)}
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-black font-retro text-[9px] font-bold py-3 px-4 border-4 border-black rounded shadow-[4px_4px_0px_#000] hover:shadow-[2px_2px_0px_#000] active:translate-x-1 active:translate-y-1 transition-all cursor-pointer flex items-center justify-center gap-1.5 animate-pulse"
                >
                  <Sparkles size={14} className="animate-spin" /> CLAIM +{selectedQuest.xpReward} XP, +{selectedQuest.goldReward} GP 💎
                </button>
              ) : selectedQuest.status === 'Completed' ? (
                <div className="bg-zinc-900/50 border border-zinc-800 py-2.5 px-4 rounded text-center font-retro text-[8px] text-zinc-500">
                  REWARD CLAIMED ✓
                </div>
              ) : (
                <div className="bg-zinc-900 border border-zinc-850 p-2.5 rounded flex justify-between items-center text-[8px] font-retro text-zinc-400">
                  <span>POTENTIAL LOOT:</span>
                  <div className="flex gap-2">
                    <span className="text-indigo-400">✨ +{selectedQuest.xpReward} XP</span>
                    <span className="text-yellow-500">💰 +{selectedQuest.goldReward} GP</span>
                  </div>
                </div>
              )}
            </div>

          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-zinc-600 text-center py-12">
            <span className="text-4xl mb-2">📜</span>
            <span className="font-retro text-[8px]">SELECT QUEST SLOT FOR ANALYSIS</span>
          </div>
        )}
      </div>

    </div>
  );
};
