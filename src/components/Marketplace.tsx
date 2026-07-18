import React from 'react';
import soundManager from './SoundManager';
import { PETS, BACKPACKS } from '../data/mockData';
import { ShoppingCart, Coins, BadgeCheck } from 'lucide-react';

interface MarketplaceProps {
  playerStats: any;
  setPlayerStats: React.Dispatch<React.SetStateAction<any>>;
  character: any;
  setCharacter: React.Dispatch<React.SetStateAction<any>>;
  purchasedItems: string[];
  setPurchasedItems: React.Dispatch<React.SetStateAction<string[]>>;
}

export const Marketplace: React.FC<MarketplaceProps> = ({
  playerStats,
  setPlayerStats,
  character,
  setCharacter,
  purchasedItems,
  setPurchasedItems
}) => {
  const handleBuyPet = (petId: string, cost: number) => {
    if (purchasedItems.includes(petId)) {
      // Equipping instead
      soundManager.playClick();
      setCharacter((prev: any) => ({ ...prev, pet: petId }));
      return;
    }

    if (playerStats.gold < cost) {
      soundManager.playClick();
      alert("⚠️ NOT ENOUGH GOLD IN THE TREASURY!");
      return;
    }

    soundManager.playPurchase();
    setPurchasedItems((prev) => [...prev, petId]);
    setPlayerStats((prev: any) => ({ ...prev, gold: prev.gold - cost }));
    setCharacter((prev: any) => ({ ...prev, pet: petId }));
  };

  const handleBuyBackpack = (packId: string, cost: number) => {
    if (purchasedItems.includes(packId) || cost === 0) {
      soundManager.playClick();
      // Equip backpack
      setCharacter((prev: any) => ({ ...prev, backpack: packId }));
      return;
    }

    if (playerStats.gold < cost) {
      soundManager.playClick();
      alert("⚠️ NOT ENOUGH GOLD IN THE TREASURY!");
      return;
    }

    soundManager.playPurchase();
    setPurchasedItems((prev) => [...prev, packId]);
    setPlayerStats((prev: any) => ({ ...prev, gold: prev.gold - cost }));
    setCharacter((prev: any) => ({ ...prev, backpack: packId }));
  };

  return (
    <div className="bg-zinc-900 border-4 border-black p-4 rounded shadow-[6px_6px_0px_#000] w-full flex flex-col gap-6 select-none">
      {/* Header */}
      <div className="flex items-center justify-between border-b-2 border-zinc-800 pb-3">
        <div className="flex items-center gap-2">
          <ShoppingCart className="text-yellow-400" size={16} />
          <span className="font-retro text-xs text-zinc-300">GUILD BAZAAR (COSMETICS)</span>
        </div>
        <div className="flex items-center gap-1 font-retro text-xs text-yellow-400 bg-zinc-950 px-3 py-1 border-2 border-black rounded shadow-[2px_2px_0px_#000] select-none">
          <Coins size={14} /> {playerStats.gold} GP
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* COMPANION PETS SECTION */}
        <div>
          <h3 className="font-retro text-[10px] text-yellow-400 mb-3">🐾 COMPANION PETS</h3>
          <div className="flex flex-col gap-3">
            {PETS.map((pet) => {
              const bought = purchasedItems.includes(pet.id);
              const equipped = character.pet === pet.id;
              return (
                <div
                  key={pet.id}
                  className="bg-zinc-950 p-3 border-2 border-black rounded shadow-[2px_2px_0px_#000] flex justify-between items-center gap-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-3xl float-animation">{pet.emoji}</span>
                    <div>
                      <span className="font-retro text-[9px] text-zinc-300 block">{pet.name}</span>
                      <span className="font-pixel text-[11px] text-zinc-500 block leading-tight mt-0.5">
                        {pet.description}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    {!bought && <span className="font-retro text-[9px] text-yellow-400">{pet.cost} GP</span>}
                    <button
                      onClick={() => handleBuyPet(pet.id, pet.cost)}
                      className={`font-retro text-[8px] py-1.5 px-3 border-2 border-black rounded shadow-[2px_2px_0px_#000] active:translate-y-0.5 cursor-pointer ${
                        equipped
                          ? 'bg-zinc-800 border-zinc-700 text-zinc-500 shadow-none active:translate-y-0'
                          : bought
                          ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                          : 'bg-yellow-500 hover:bg-yellow-600 text-black font-semibold'
                      }`}
                    >
                      {equipped ? 'EQUIPPED ✓' : bought ? 'EQUIP' : 'BUY'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* BACKPACK THEMES SECTION */}
        <div>
          <h3 className="font-retro text-[10px] text-yellow-400 mb-3">🎒 UPGRADED BACKPACKS</h3>
          <div className="flex flex-col gap-3">
            {BACKPACKS.map((pack) => {
              const bought = purchasedItems.includes(pack.id) || pack.cost === 0;
              const equipped = character.backpack === pack.id || (pack.id === 'basic' && !character.backpack);
              return (
                <div
                  key={pack.id}
                  className="bg-zinc-950 p-3 border-2 border-black rounded shadow-[2px_2px_0px_#000] flex justify-between items-center gap-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{pack.emoji}</span>
                    <div>
                      <span className="font-retro text-[9px] text-zinc-300 block">{pack.name}</span>
                      <span className="font-pixel text-[11px] text-zinc-500 block leading-none mt-1">
                        Capacity: {pack.capacity}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    {!bought && <span className="font-retro text-[9px] text-yellow-400">{pack.cost} GP</span>}
                    <button
                      onClick={() => handleBuyBackpack(pack.id, pack.cost)}
                      className={`font-retro text-[8px] py-1.5 px-3 border-2 border-black rounded shadow-[2px_2px_0px_#000] active:translate-y-0.5 cursor-pointer ${
                        equipped
                          ? 'bg-zinc-800 border-zinc-700 text-zinc-500 shadow-none active:translate-y-0'
                          : bought
                          ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                          : 'bg-yellow-500 hover:bg-yellow-600 text-black font-semibold'
                      }`}
                    >
                      {equipped ? 'EQUIPPED ✓' : bought ? 'EQUIP' : 'BUY'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
