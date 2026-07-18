import React, { useState } from 'react';
import soundManager from './SoundManager';
import { TravelDestination } from '../data/mockData';
import { ShieldCheck, Backpack, Check, Info } from 'lucide-react';

interface InventoryProps {
  destination: TravelDestination;
}

interface InventoryItem {
  name: string;
  icon: string;
  category: string;
  description: string;
  packed: boolean;
}

export const Inventory: React.FC<InventoryProps> = ({ destination }) => {
  const [items, setItems] = useState<InventoryItem[]>(
    destination.packingList.map((item) => ({ ...item, packed: false }))
  );
  const [selectedIdx, setSelectedIdx] = useState<number | null>(0);

  const handleTogglePack = (idx: number) => {
    soundManager.playCoin();
    setItems((prev) =>
      prev.map((item, i) => (i === idx ? { ...item, packed: !item.packed } : item))
    );
  };

  const selectedItem = selectedIdx !== null ? items[selectedIdx] : null;

  return (
    <div className="bg-zinc-900 border-4 border-black p-4 rounded shadow-[6px_6px_0px_#000] w-full flex flex-col md:flex-row gap-6 select-none">
      {/* LEFT: RPG Inventory Grid */}
      <div className="flex-1">
        <div className="flex items-center gap-2 border-b-2 border-zinc-800 pb-3 mb-4">
          <Backpack className="text-yellow-400" size={16} />
          <span className="font-retro text-xs text-zinc-300">BACKPACK INVENTORY</span>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
          {items.map((item, idx) => (
            <div
              key={idx}
              onClick={() => {
                soundManager.playClick();
                setSelectedIdx(idx);
              }}
              className={`aspect-square border-4 flex flex-col items-center justify-center p-2 rounded cursor-pointer relative shadow-[2px_2px_0px_#000] transition-all hover:scale-105 active:scale-95 ${
                selectedIdx === idx
                  ? 'border-yellow-400 bg-indigo-950/60'
                  : 'border-zinc-800 bg-zinc-950 hover:bg-zinc-900'
              }`}
            >
              {/* Packed indicator overlay */}
              {item.packed && (
                <div className="absolute top-1 right-1 bg-emerald-500 text-black border border-black p-0.5 rounded-sm flex items-center justify-center">
                  <Check size={8} className="stroke-[4px]" />
                </div>
              )}

              {/* Item Icon */}
              <span className="text-3xl mb-1 float-animation">{item.icon}</span>
              <span className="font-pixel text-[10px] text-zinc-400 leading-tight text-center truncate w-full">
                {item.name}
              </span>
            </div>
          ))}
          {/* Empty grid spaces for RPG feel */}
          {Array.from({ length: Math.max(0, 12 - items.length) }).map((_, idx) => (
            <div
              key={`empty-${idx}`}
              className="aspect-square border-4 border-zinc-900 bg-zinc-950/30 rounded flex items-center justify-center opacity-30 cursor-not-allowed"
            >
              <span className="font-retro text-[8px] text-zinc-800">EMPTY</span>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT: Selected Item Details Pane */}
      <div className="w-full md:w-64 bg-zinc-950 border-4 border-zinc-800 p-4 rounded flex flex-col justify-between shrink-0 min-h-[220px]">
        {selectedItem ? (
          <div className="flex flex-col h-full justify-between">
            <div>
              {/* Item Header */}
              <div className="flex items-center gap-3 border-b border-zinc-800 pb-2 mb-3">
                <span className="text-4xl">{selectedItem.icon}</span>
                <div>
                  <h4 className="font-retro text-[10px] text-yellow-400">{selectedItem.name}</h4>
                  <span className="bg-zinc-800 text-zinc-400 text-[8px] font-retro px-1.5 py-0.5 rounded inline-block mt-0.5 uppercase">
                    {selectedItem.category}
                  </span>
                </div>
              </div>

              {/* Item Description (AI context info) */}
              <div className="text-zinc-300 font-pixel text-base leading-snug mb-4">
                <div className="flex items-start gap-1 text-indigo-400 font-retro text-[8px] mb-1.5">
                  <Info size={10} /> GUILD MEMO:
                </div>
                {selectedItem.description}
              </div>
            </div>

            {/* Equip/Pack trigger button */}
            <button
              onClick={() => handleTogglePack(selectedIdx!)}
              className={`w-full font-retro text-[9px] py-3 px-4 border-2 border-black rounded shadow-[2px_2px_0px_#000] active:translate-y-0.5 cursor-pointer flex items-center justify-center gap-1.5 ${
                selectedItem.packed
                  ? 'bg-zinc-800 border-zinc-700 text-zinc-500 shadow-none active:translate-y-0'
                  : 'bg-emerald-500 hover:bg-emerald-600 text-black font-semibold'
              }`}
            >
              <ShieldCheck size={14} />
              {selectedItem.packed ? 'EQUIPPED / PACKED ✓' : 'EQUIP TO BACKPACK'}
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-zinc-600 text-center">
            <span className="text-4xl mb-2">🎒</span>
            <span className="font-retro text-[8px]">SELECT GEAR SLOT FOR ANALYSIS</span>
          </div>
        )}
      </div>
    </div>
  );
};
