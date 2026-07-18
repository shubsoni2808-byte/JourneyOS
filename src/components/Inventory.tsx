import React, { useState } from 'react';
import { useGameStore } from '../store/useGameStore';
import { InventoryItem } from '../types/game';
import { soundManager } from './SoundManager';
import { Backpack, Sparkles, Shield, Heart, Info, Sword } from 'lucide-react';

type Tab = 'all' | 'weapons' | 'keys' | 'maps' | 'artifacts' | 'magic' | 'food' | 'potions';

export const Inventory: React.FC = () => {
  const inventory = useGameStore((state) => state.inventory);
  const player = useGameStore((state) => state.player);
  const purchasedItems = useGameStore((state) => state.purchasedItems);

  const [activeTab, setActiveTab] = useState<Tab>('all');
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);

  if (!player) return null;

  // Flatten items for rendering based on tab
  const getItemsForTab = (): InventoryItem[] => {
    if (activeTab === 'all') {
      return [
        ...inventory.weapons,
        ...inventory.keys,
        ...inventory.maps,
        ...inventory.artifacts,
        ...inventory.magic,
        ...inventory.food,
        ...inventory.potions
      ];
    }
    return inventory[activeTab] || [];
  };

  const itemsToDisplay = getItemsForTab();

  const handleItemSelect = (item: InventoryItem) => {
    soundManager.playClick();
    setSelectedItem(item);
  };

  const handleUseItem = (item: InventoryItem) => {
    soundManager.playLevelUp();
    useGameStore.getState().addNotification(`Activated item perk: ${item.name}! 🌟`, 'success');
    
    // Perform simple consumption logic
    if (item.id === 'potion') {
      // Add XP directly to state
      useGameStore.setState((state) => {
        if (!state.player) return {};
        let newXp = state.player.xp + 100;
        let newLevel = state.player.level;
        // check level thresholds
        const thresholds = [100, 250, 500, 900, 1500, 999999];
        const thresh = thresholds[newLevel - 1];
        if (newXp >= thresh) {
          newXp -= thresh;
          newLevel += 1;
          setTimeout(() => soundManager.playLevelUp(), 100);
        }
        return {
          player: { ...state.player, xp: newXp, level: newLevel },
          inventory: {
            ...state.inventory,
            potions: state.inventory.potions.filter(p => p.id !== item.id)
          }
        };
      });
      setSelectedItem(null);
    } else if (item.id === 'ramen') {
      useGameStore.setState((state) => {
        if (!state.player) return {};
        return {
          inventory: {
            ...state.inventory,
            food: state.inventory.food.filter(f => f.id !== item.id)
          }
        };
      });
      setSelectedItem(null);
    }
  };

  return (
    <div className="bg-zinc-900 border-4 border-black p-4 rounded shadow-[6px_6px_0px_#000] w-full flex flex-col lg:flex-row gap-6 select-none">
      
      {/* LEFT: RPG Grid and Filters */}
      <div className="flex-1">
        
        {/* Header */}
        <div className="flex items-center gap-2 border-b-2 border-zinc-800 pb-3 mb-4">
          <Backpack className="text-yellow-400" size={16} />
          <span className="font-retro text-xs text-zinc-300">ADVENTURER BACKPACK VAULT</span>
        </div>

        {/* Tab Filters */}
        <div className="flex flex-wrap gap-1.5 mb-4 border-b border-zinc-800 pb-2">
          {[
            { id: 'all', label: '🎒 ALL' },
            { id: 'weapons', label: '⚔️ WEAPONS' },
            { id: 'keys', label: '🔑 KEYS' },
            { id: 'maps', label: '🗺️ MAPS' },
            { id: 'artifacts', label: '🔮 ARTIFACTS' },
            { id: 'magic', label: '🟢 MAGIC' },
            { id: 'food', label: '🍜 FOOD' },
            { id: 'potions', label: '🧪 POTIONS' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                soundManager.playClick();
                setActiveTab(tab.id as Tab);
                setSelectedItem(null);
              }}
              className={`px-3 py-1.5 border border-black font-retro text-[7px] uppercase cursor-pointer rounded transition-transform ${
                activeTab === tab.id
                  ? 'bg-yellow-500 text-black border-yellow-300 font-bold'
                  : 'bg-zinc-950 text-zinc-400 hover:bg-zinc-850 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Grid display of items */}
        {itemsToDisplay.length > 0 ? (
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3 max-h-[300px] overflow-y-auto p-1">
            {itemsToDisplay.map((item, idx) => {
              const isSelected = selectedItem?.id === item.id;
              return (
                <div
                  key={`${item.id}-${idx}`}
                  onClick={() => handleItemSelect(item)}
                  className={`aspect-square border-4 flex flex-col items-center justify-center p-2 rounded cursor-pointer relative shadow-[2px_2px_0px_#000] transition-all hover:scale-105 active:scale-95 ${
                    isSelected
                      ? 'border-yellow-400 bg-indigo-950/60'
                      : 'border-zinc-800 bg-zinc-950 hover:bg-zinc-900'
                  }`}
                >
                  <span className="text-3xl mb-1 animate-[float_2s_infinite]">{item.emoji}</span>
                  <span className="font-pixel text-[9px] text-zinc-400 leading-tight text-center truncate w-full">
                    {item.name}
                  </span>
                </div>
              );
            })}
            
            {/* Pad layout with empty slots */}
            {Array.from({ length: Math.max(0, 16 - itemsToDisplay.length) }).map((_, idx) => (
              <div
                key={`empty-${idx}`}
                className="aspect-square border-4 border-zinc-900/30 bg-zinc-950/20 rounded flex items-center justify-center opacity-25 cursor-not-allowed"
              >
                <span className="font-retro text-[6px] text-zinc-800">EMPTY</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 bg-zinc-950 border border-zinc-850 rounded text-center text-zinc-600 gap-2">
            <Backpack size={24} />
            <span className="font-retro text-[8px] uppercase">No items found in category</span>
          </div>
        )}
      </div>

      {/* RIGHT: Selected Item Details Panel */}
      <div className="w-full lg:w-64 bg-zinc-950 border-4 border-zinc-800 p-4 rounded flex flex-col justify-between shrink-0 min-h-[250px]">
        {selectedItem ? (
          <div className="flex flex-col h-full justify-between gap-4">
            
            <div>
              {/* Item Header */}
              <div className="flex items-center gap-3 border-b border-zinc-800 pb-2 mb-3">
                <span className="text-4xl">{selectedItem.emoji}</span>
                <div>
                  <h4 className="font-retro text-[9px] text-yellow-400">{selectedItem.name}</h4>
                  <span className="bg-zinc-800 text-zinc-400 text-[7px] font-retro px-1.5 py-0.5 rounded inline-block mt-0.5 uppercase">
                    {selectedItem.category}
                  </span>
                </div>
              </div>

              {/* Stats/Lore details */}
              <div className="text-zinc-300 font-pixel text-base leading-snug mb-3">
                <div className="flex items-start gap-1 text-indigo-400 font-retro text-[7px] mb-1.5">
                  <Info size={9} /> GUILD DESCRIPTION:
                </div>
                {selectedItem.description}
              </div>

              {selectedItem.perk && (
                <div className="border border-indigo-900 bg-indigo-950/30 p-2 rounded text-indigo-300 font-pixel text-xs">
                  ⚡ Perk: {selectedItem.perk}
                </div>
              )}
            </div>

            {/* Consume/Trigger item action */}
            {(selectedItem.category === 'potions' || selectedItem.category === 'food') && (
              <button
                onClick={() => handleUseItem(selectedItem)}
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-black font-retro text-[9px] py-2.5 px-4 border-2 border-black rounded shadow-[2px_2px_0px_#000] active:translate-y-0.5 cursor-pointer font-bold uppercase"
              >
                USE ITEM
              </button>
            )}

          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-zinc-600 text-center">
            <span className="text-4xl mb-2">🎒</span>
            <span className="font-retro text-[7px]">SELECT ITEM FOR INSPECTION</span>
          </div>
        )}
      </div>

    </div>
  );
};
