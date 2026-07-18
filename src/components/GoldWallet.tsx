import React, { useState } from 'react';
import { useGameStore } from '../store/useGameStore';
import { soundManager } from './SoundManager';
import { Wallet, Coins, Compass, ShieldAlert, BadgeInfo } from 'lucide-react';

export const GoldWallet: React.FC = () => {
  const player = useGameStore((state) => state.player);
  const activeRegionId = useGameStore((state) => state.activeRegionId);
  const regions = useGameStore((state) => state.regions);

  const activeRegion = regions.find((r) => r.id === activeRegionId);

  const [spentCategories, setSpentCategories] = useState({
    transport: 0,
    accommodation: 0,
    food: 0,
    shopping: 0
  });

  const [bookedItems, setBookedItems] = useState<string[]>([]);

  if (!player || !activeRegion) return null;

  // Convert budget to GP points
  const usdToGp = (usd: number) => Math.round(usd * 1.5);

  const handleBookPortal = (code: string, price: number) => {
    if (bookedItems.includes(code)) return;
    const gpCost = usdToGp(price);

    if (player.gold < gpCost) {
      soundManager.playClick();
      useGameStore.getState().addNotification('⚠️ Not enough gold in the treasury!', 'error');
      return;
    }

    soundManager.playPurchase();
    setBookedItems((prev) => [...prev, code]);

    // Update Zustand store directly
    useGameStore.setState((state) => {
      if (!state.player) return {};
      return {
        player: {
          ...state.player,
          gold: state.player.gold - gpCost
        }
      };
    });

    setSpentCategories((prev) => ({
      ...prev,
      transport: prev.transport + gpCost
    }));

    useGameStore.getState().addNotification(`Portal route ${code} activated! 🌀`, 'success');
  };

  const handleBookInn = (name: string, price: number) => {
    if (bookedItems.includes(name)) return;
    const gpCost = usdToGp(price);

    if (player.gold < gpCost) {
      soundManager.playClick();
      useGameStore.getState().addNotification('⚠️ Not enough gold in the treasury!', 'error');
      return;
    }

    soundManager.playPurchase();
    setBookedItems((prev) => [...prev, name]);

    // Update Zustand store directly
    useGameStore.setState((state) => {
      if (!state.player) return {};
      return {
        player: {
          ...state.player,
          gold: state.player.gold - gpCost
        }
      };
    });

    setSpentCategories((prev) => ({
      ...prev,
      accommodation: prev.accommodation + gpCost
    }));

    useGameStore.getState().addNotification(`Inn lodging ${name} booked! 🏰`, 'success');
  };

  const totalSpent = Object.values(spentCategories).reduce((a, b) => a + b, 0);
  const remainingGold = player.gold;
  const totalBudgetGold = remainingGold + totalSpent;
  const spentPercent = totalBudgetGold > 0 ? (totalSpent / totalBudgetGold) * 100 : 0;

  // Static budget recommendations based on the region
  const flightSuggestions = [
    { code: 'PORTAL-A', airline: 'Hyperspeed Portal', price: 200, duration: '2h 15m' },
    { code: 'PORTAL-B', airline: 'Galactic Gateways', price: 350, duration: '5h 10m' }
  ];

  const hotelSuggestions = [
    { name: 'Tavern Safehouse', description: 'Cozy beds with anti-theft spells.', costPerNight: 50 },
    { name: 'Skyview Outpost', description: 'High tower rooms with full mana regenerators.', costPerNight: 120 }
  ];

  return (
    <div className="bg-zinc-900 border-4 border-black p-4 rounded shadow-[6px_6px_0px_#000] w-full flex flex-col gap-6 select-none">
      
      {/* Wallet Status Header */}
      <div className="flex items-center justify-between border-b-2 border-zinc-800 pb-3">
        <div className="flex items-center gap-2">
          <Wallet className="text-yellow-400" size={16} />
          <span className="font-retro text-xs text-zinc-300">GOLD TREASURY WALLET</span>
        </div>
        <div className="flex items-center gap-1.5 font-retro text-[10px] text-yellow-400 bg-zinc-950 px-3 py-1.5 border-2 border-black rounded shadow-[2px_2px_0px_#000] gold-pulse">
          <Coins size={12} className="animate-spin" /> {remainingGold} GP
        </div>
      </div>

      {/* Progress Bar Visualizer */}
      <div className="bg-zinc-950 p-4 border-4 border-black rounded">
        <div className="flex justify-between font-retro text-[7px] text-zinc-400 mb-2">
          <span>TREASURY SPENT ({Math.round(spentPercent)}%)</span>
          <span className="text-yellow-400">REMAINING Balance: {remainingGold} GP</span>
        </div>
        <div className="w-full bg-zinc-900 h-8 border-4 border-black p-0.5 rounded overflow-hidden flex">
          {/* Spent Progress */}
          <div
            style={{ width: `${spentPercent}%` }}
            className="bg-red-500 h-full transition-all duration-300"
          ></div>
          {/* Remaining Progress */}
          <div className="flex-1 bg-yellow-500 h-full transition-all duration-300"></div>
        </div>
        <div className="flex justify-between font-pixel text-base text-zinc-500 mt-2">
          <span>Total Budget: {totalBudgetGold} GP</span>
          <span>Spent: {totalSpent} GP</span>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Portals (Transit)', val: spentCategories.transport, color: 'border-purple-600 text-purple-400' },
          { label: 'Inns (Lodging)', val: spentCategories.accommodation, color: 'border-blue-600 text-blue-400' },
          { label: 'Taverns (Dining)', val: spentCategories.food, color: 'border-emerald-600 text-emerald-400' },
          { label: 'Gear (Shopping)', val: spentCategories.shopping, color: 'border-yellow-600 text-yellow-400' }
        ].map((cat, idx) => (
          <div key={idx} className={`bg-zinc-950 p-3 border-2 rounded ${cat.color} text-center shadow-[2px_2px_0px_#000]`}>
            <span className="font-pixel text-[11px] block uppercase leading-none text-zinc-500 mb-1.5">{cat.label}</span>
            <span className="font-retro text-[9px] block">{cat.val} GP</span>
          </div>
        ))}
      </div>

      {/* Portals & Inns Planner Marketplace */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t-2 border-zinc-800">
        
        {/* FAST TRAVEL PORTALS */}
        <div>
          <h4 className="font-retro text-[9px] text-purple-400 mb-3 flex items-center gap-1">
            🌀 FAST TRAVEL PORTALS (TRANSIT)
          </h4>
          <div className="flex flex-col gap-3">
            {flightSuggestions.map((flight) => {
              const booked = bookedItems.includes(flight.code);
              return (
                <div key={flight.code} className="bg-zinc-950 p-3 border-2 border-black rounded shadow-[2px_2px_0px_#000] flex justify-between items-center gap-3">
                  <div>
                    <span className="font-retro text-[8px] text-zinc-300 block">{flight.code} ({flight.airline})</span>
                    <span className="font-pixel text-xs text-zinc-500 block mt-0.5">Duration: {flight.duration}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-retro text-[8px] text-yellow-400 mr-1">{usdToGp(flight.price)} GP</span>
                    <button
                      onClick={() => handleBookPortal(flight.code, flight.price)}
                      disabled={booked}
                      className={`font-retro text-[7px] py-1.5 px-3 border-2 border-black rounded shadow-[2px_2px_0px_#000] active:translate-y-0.5 cursor-pointer ${
                        booked
                          ? 'bg-zinc-800 border-zinc-700 text-zinc-500 shadow-none active:translate-y-0'
                          : 'bg-purple-600 hover:bg-purple-700 text-white'
                      }`}
                    >
                      {booked ? 'ACTIVE' : 'BUY'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* KINGDOM INNS */}
        <div>
          <h4 className="font-retro text-[9px] text-blue-400 mb-3 flex items-center gap-1">
            🏰 KINGDOM ESTABLISHED INNS (LODGING)
          </h4>
          <div className="flex flex-col gap-3">
            {hotelSuggestions.map((hotel) => {
              const booked = bookedItems.includes(hotel.name);
              return (
                <div key={hotel.name} className="bg-zinc-950 p-3 border-2 border-black rounded shadow-[2px_2px_0px_#000] flex justify-between items-center gap-3">
                  <div className="flex-1">
                    <span className="font-retro text-[8px] text-zinc-300 block leading-tight">{hotel.name}</span>
                    <span className="font-pixel text-[11px] text-zinc-500 block leading-tight mt-1">{hotel.description}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <div className="text-right mr-1">
                      <span className="font-retro text-[8px] text-yellow-400 block">{usdToGp(hotel.costPerNight)} GP</span>
                      <span className="text-[6px] font-retro text-zinc-500">/cycle</span>
                    </div>
                    <button
                      onClick={() => handleBookInn(hotel.name, hotel.costPerNight)}
                      disabled={booked}
                      className={`font-retro text-[7px] py-1.5 px-3 border-2 border-black rounded shadow-[2px_2px_0px_#000] active:translate-y-0.5 cursor-pointer ${
                        booked
                          ? 'bg-zinc-800 border-zinc-700 text-zinc-500 shadow-none active:translate-y-0'
                          : 'bg-blue-600 hover:bg-blue-700 text-white'
                      }`}
                    >
                      {booked ? 'RESERVED' : 'RESERVE'}
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
