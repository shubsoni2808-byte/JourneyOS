import React from 'react';
import { useGameStore } from '../store/useGameStore';
import { BAZAAR_ITEMS, PETS, BACKPACKS } from '../services/gameData';
import { soundManager } from './SoundManager';
import { ShoppingCart, Coins, BadgeCheck, Star } from 'lucide-react';

export const Marketplace: React.FC = () => {
  const player = useGameStore((state) => state.player);
  const purchasedItems = useGameStore((state) => state.purchasedItems);
  const buyBazaarItem = useGameStore((state) => state.buyBazaarItem);
  const equipPet = useGameStore((state) => state.equipPet);
  const equipBackpack = useGameStore((state) => state.equipBackpack);
  const addNotification = useGameStore((state) => state.addNotification);

  if (!player) return null;

  // Merchant class gets a 10% discount on GP purchases
  const isMerchant = player.classType === 'merchant';
  const discountMultiplier = isMerchant ? 0.9 : 1.0;

  const handleBuyPet = (pet: typeof PETS[0]) => {
    if (purchasedItems.includes(pet.id)) {
      equipPet(pet.id);
      return;
    }

    const finalCost = Math.round((pet.cost || 0) * discountMultiplier);

    if (player.gold < finalCost) {
      soundManager.playClick();
      addNotification('⚠️ Insufficient gold treasury!', 'error');
      return;
    }

    soundManager.playPurchase();
    
    useGameStore.setState((state) => {
      if (!state.player) return {};
      return {
        player: {
          ...state.player,
          gold: state.player.gold - finalCost,
          pet: pet.id
        },
        purchasedItems: [...state.purchasedItems, pet.id]
      };
    });

    addNotification(`Companion ${pet.name} purchased & equipped! 🟢`, 'success');
  };

  const handleBuyBackpack = (pack: typeof BACKPACKS[0]) => {
    const isOwned = purchasedItems.includes(pack.id) || pack.cost === 0;
    if (isOwned) {
      equipBackpack(pack.id);
      return;
    }

    const finalCost = Math.round(pack.cost * discountMultiplier);

    if (player.gold < finalCost) {
      soundManager.playClick();
      addNotification('⚠️ Insufficient gold treasury!', 'error');
      return;
    }

    soundManager.playPurchase();

    useGameStore.setState((state) => {
      if (!state.player) return {};
      return {
        player: {
          ...state.player,
          gold: state.player.gold - finalCost,
          backpack: pack.id
        },
        purchasedItems: [...state.purchasedItems, pack.id]
      };
    });

    addNotification(`Backpack slot ${pack.name} upgraded! 🎒`, 'success');
  };

  const handleBuyWeaponItem = (itemId: string, cost: number) => {
    const finalCost = Math.round(cost * discountMultiplier);
    if (player.gold < finalCost) {
      soundManager.playClick();
      addNotification('⚠️ Insufficient gold treasury!', 'error');
      return;
    }
    buyBazaarItem(itemId);
  };

  return (
    <div className="bg-zinc-900 border-4 border-black p-4 rounded shadow-[6px_6px_0px_#000] w-full flex flex-col gap-6 select-none">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b-2 border-zinc-800 pb-3">
        <div className="flex items-center gap-2">
          <ShoppingCart className="text-yellow-400" size={16} />
          <span className="font-retro text-xs text-zinc-300">GUILD BAZAAR (MARKETPLACE)</span>
        </div>
        <div className="flex items-center gap-1 font-retro text-xs text-yellow-400 bg-zinc-950 px-3 py-1.5 border-2 border-black rounded shadow-[2px_2px_0px_#000] select-none">
          <Coins size={14} className="mr-1" /> {player.gold} GP
        </div>
      </div>

      {isMerchant && (
        <div className="bg-yellow-950/20 border border-yellow-800 p-2.5 rounded text-yellow-400 text-xs font-pixel flex items-center gap-2">
          <Star size={12} className="animate-pulse" />
          <span>MERK PERK: You get a **10% discount** on all marketplace listings!</span>
        </div>
      )}

      {/* Grid segments */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* COMPANION PETS SECTION */}
        <div className="bg-zinc-950 p-4 border-2 border-zinc-850 rounded">
          <h3 className="font-retro text-[9px] text-yellow-400 mb-3.5">🐾 COMPANION PETS</h3>
          <div className="flex flex-col gap-3">
            {PETS.map((pet) => {
              const bought = purchasedItems.includes(pet.id);
              const equipped = player.pet === pet.id;
              const cost = Math.round((pet.cost || 0) * discountMultiplier);

              return (
                <div
                  key={pet.id}
                  className="bg-zinc-900 p-3 border-2 border-black rounded shadow-[2px_2px_0px_#000] flex justify-between items-center gap-3 hover:border-indigo-900 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-3xl animate-[float_2.5s_infinite]">{pet.emoji}</span>
                    <div>
                      <span className="font-retro text-[8px] text-zinc-300 block">{pet.name}</span>
                      <span className="font-pixel text-[11px] text-zinc-500 block leading-tight mt-0.5">
                        {pet.description}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5 shrink-0">
                    {!bought && <span className="font-retro text-[8px] text-yellow-400">{cost} GP</span>}
                    <button
                      onClick={() => handleBuyPet(pet)}
                      className={`font-retro text-[7px] py-1.5 px-3 border-2 border-black rounded shadow-[2px_2px_0px_#000] active:translate-y-0.5 cursor-pointer font-bold ${
                        equipped
                          ? 'bg-zinc-800 border-zinc-700 text-zinc-500 shadow-none active:translate-y-0'
                          : bought
                          ? 'bg-indigo-600 hover:bg-indigo-700 text-white border-indigo-400'
                          : 'bg-yellow-500 hover:bg-yellow-600 text-black border-yellow-300'
                      }`}
                    >
                      {equipped ? 'EQUIPPED' : bought ? 'EQUIP' : 'BUY'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* BACKPACK UPGRADES SECTION */}
        <div className="bg-zinc-950 p-4 border-2 border-zinc-850 rounded">
          <h3 className="font-retro text-[9px] text-yellow-400 mb-3.5">🎒 BACKPACK THEMES</h3>
          <div className="flex flex-col gap-3">
            {BACKPACKS.map((pack) => {
              const bought = purchasedItems.includes(pack.id) || pack.cost === 0;
              const equipped = player.backpack === pack.id;
              const cost = Math.round(pack.cost * discountMultiplier);

              return (
                <div
                  key={pack.id}
                  className="bg-zinc-900 p-3 border-2 border-black rounded shadow-[2px_2px_0px_#000] flex justify-between items-center gap-3 hover:border-indigo-900 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{pack.emoji}</span>
                    <div>
                      <span className="font-retro text-[8px] text-zinc-300 block">{pack.name}</span>
                      <span className="font-pixel text-[11px] text-zinc-500 block leading-tight mt-0.5">
                        Capacity: {pack.capacity}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5 shrink-0">
                    {!bought && <span className="font-retro text-[8px] text-yellow-400">{cost} GP</span>}
                    <button
                      onClick={() => handleBuyBackpack(pack)}
                      className={`font-retro text-[7px] py-1.5 px-3 border-2 border-black rounded shadow-[2px_2px_0px_#000] active:translate-y-0.5 cursor-pointer font-bold ${
                        equipped
                          ? 'bg-zinc-800 border-zinc-700 text-zinc-500 shadow-none active:translate-y-0'
                          : bought
                          ? 'bg-indigo-600 hover:bg-indigo-700 text-white border-indigo-400'
                          : 'bg-yellow-500 hover:bg-yellow-600 text-black border-yellow-300'
                      }`}
                    >
                      {equipped ? 'EQUIPPED' : bought ? 'EQUIP' : 'BUY'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* WEAPONS & GEAR SECTION */}
        <div className="bg-zinc-950 p-4 border-2 border-zinc-850 rounded">
          <h3 className="font-retro text-[9px] text-yellow-400 mb-3.5">⚔️ WEAPONS & GEAR</h3>
          <div className="flex flex-col gap-3">
            {BAZAAR_ITEMS.map((item) => {
              const bought = purchasedItems.includes(item.id);
              const cost = Math.round((item.cost || 0) * discountMultiplier);

              return (
                <div
                  key={item.id}
                  className="bg-zinc-900 p-3 border-2 border-black rounded shadow-[2px_2px_0px_#000] flex justify-between items-center gap-3 hover:border-indigo-900 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{item.emoji}</span>
                    <div>
                      <span className="font-retro text-[8px] text-zinc-300 block">{item.name}</span>
                      <span className="font-pixel text-[11px] text-zinc-500 block leading-tight mt-0.5">
                        {item.description}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5 shrink-0">
                    {!bought ? (
                      <>
                        <span className="font-retro text-[8px] text-yellow-400">{cost} GP</span>
                        <button
                          onClick={() => handleBuyWeaponItem(item.id, item.cost || 0)}
                          className="font-retro text-[7px] py-1.5 px-3 border-2 border-black rounded shadow-[2px_2px_0px_#000] active:translate-y-0.5 cursor-pointer font-bold bg-yellow-500 hover:bg-yellow-600 text-black border-yellow-300"
                        >
                          BUY
                        </button>
                      </>
                    ) : (
                      <span className="font-retro text-[7px] text-emerald-400 flex items-center gap-1 bg-emerald-950/20 border border-emerald-800 py-1.5 px-2.5 rounded leading-none">
                        <BadgeCheck size={10} /> OWNED
                      </span>
                    )}
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
