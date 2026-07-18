import React, { useState, useEffect } from 'react';
import soundManager from './SoundManager';
import { TravelDestination } from '../data/mockData';
import { Wallet, Coins, Landmark, Sparkles, AlertCircle } from 'lucide-react';

interface GoldWalletProps {
  destination: TravelDestination;
  playerStats: any;
  setPlayerStats: React.Dispatch<React.SetStateAction<any>>;
}

export const GoldWallet: React.FC<GoldWalletProps> = ({
  destination,
  playerStats,
  setPlayerStats
}) => {
  const [spentCategories, setSpentCategories] = useState({
    transport: 0,
    accommodation: 0,
    food: 0,
    shopping: 0
  });

  const [bookedItems, setBookedItems] = useState<string[]>([]);
  const [startingGold, setStartingGold] = useState(playerStats.gold);

  // We can convert USD values to GP
  const usdToGp = (usd: number) => Math.round(usd * 1.5);

  const handleBookPortal = (code: string, usdCost: number) => {
    if (bookedItems.includes(code)) return;
    const gpCost = usdToGp(usdCost);

    if (playerStats.gold < gpCost) {
      soundManager.playClick();
      alert("⚠️ NOT ENOUGH GOLD IN THE TREASURY!");
      return;
    }

    soundManager.playPurchase();
    setBookedItems((prev) => [...prev, code]);
    
    // Deduct gold & update spent category
    setPlayerStats((prev: any) => ({
      ...prev,
      gold: prev.gold - gpCost
    }));

    setSpentCategories((prev) => ({
      ...prev,
      transport: prev.transport + gpCost
    }));
  };

  const handleBookInn = (name: string, usdCost: number) => {
    if (bookedItems.includes(name)) return;
    const gpCost = usdToGp(usdCost);

    if (playerStats.gold < gpCost) {
      soundManager.playClick();
      alert("⚠️ NOT ENOUGH GOLD IN THE TREASURY!");
      return;
    }

    soundManager.playPurchase();
    setBookedItems((prev) => [...prev, name]);

    // Deduct gold & update spent category
    setPlayerStats((prev: any) => ({
      ...prev,
      gold: prev.gold - gpCost
    }));

    setSpentCategories((prev) => ({
      ...prev,
      accommodation: prev.accommodation + gpCost
    }));
  };

  const totalSpent = Object.values(spentCategories).reduce((a, b) => a + b, 0);
  const remainingGold = playerStats.gold;
  const totalBudgetGold = remainingGold + totalSpent;
  const spentPercent = totalBudgetGold > 0 ? (totalSpent / totalBudgetGold) * 100 : 0;

  return (
    <div className="bg-zinc-900 border-4 border-black p-4 rounded shadow-[6px_6px_0px_#000] w-full flex flex-col gap-6">
      {/* Wallet Status Header */}
      <div className="flex items-center justify-between border-b-2 border-zinc-800 pb-3">
        <div className="flex items-center gap-2">
          <Wallet className="text-yellow-400" size={16} />
          <span className="font-retro text-xs text-zinc-300">GOLD TREASURY WALLET</span>
        </div>
        <div className="flex items-center gap-1 font-retro text-xs text-yellow-400 bg-zinc-950 px-3 py-1 border-2 border-black rounded shadow-[2px_2px_0px_#000] gold-pulse select-none">
          <Coins size={14} className="animate-spin" /> {remainingGold} GP
        </div>
      </div>

      {/* Progress Bar Visualizer */}
      <div className="bg-zinc-950 p-4 border-4 border-zinc-800 rounded">
        <div className="flex justify-between font-retro text-[9px] text-zinc-400 mb-2">
          <span>TREASURY SPENT ({Math.round(spentPercent)}%)</span>
          <span className="text-yellow-400">REMAINING: {remainingGold} GP</span>
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
        <div className="flex justify-between font-pixel text-sm text-zinc-500 mt-2">
          <span>Starting: {totalBudgetGold} GP</span>
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
            <span className="font-pixel text-[11px] block uppercase leading-none text-zinc-500 mb-1">{cat.label}</span>
            <span className="font-retro text-xs block">{cat.val} GP</span>
          </div>
        ))}
      </div>

      {/* Portals & Inns Planner Marketplace */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t-2 border-zinc-800">
        {/* FAST TRAVEL PORTALS */}
        <div>
          <h4 className="font-retro text-[10px] text-purple-400 mb-3 flex items-center gap-1">
            🌀 FAST TRAVEL PORTALS (FLIGHTS)
          </h4>
          <div className="flex flex-col gap-3">
            {destination.flightSuggestions.map((flight) => {
              const booked = bookedItems.includes(flight.code);
              return (
                <div key={flight.code} className="bg-zinc-950 p-3 border-2 border-black rounded shadow-[2px_2px_0px_#000] flex justify-between items-center gap-3">
                  <div>
                    <span className="font-retro text-[9px] text-zinc-300 block">{flight.code} ({flight.airline})</span>
                    <span className="font-pixel text-xs text-zinc-500 block">Duration: {flight.duration}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-retro text-[9px] text-yellow-400">{usdToGp(flight.price)} GP</span>
                    <button
                      onClick={() => handleBookPortal(flight.code, flight.price)}
                      disabled={booked}
                      className={`font-retro text-[8px] py-1.5 px-3 border-2 border-black rounded shadow-[2px_2px_0px_#000] active:translate-y-0.5 cursor-pointer ${
                        booked
                          ? 'bg-zinc-800 border-zinc-700 text-zinc-500 shadow-none active:translate-y-0'
                          : 'bg-purple-600 hover:bg-purple-700 text-white'
                      }`}
                    >
                      {booked ? 'BOOKED ✓' : 'ACTIVATE'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* KINGDOM INNS */}
        <div>
          <h4 className="font-retro text-[10px] text-blue-400 mb-3 flex items-center gap-1">
            🏰 ESTABLISHED INNS (HOTELS)
          </h4>
          <div className="flex flex-col gap-3">
            {destination.hotelSuggestions.map((hotel) => {
              const booked = bookedItems.includes(hotel.name);
              return (
                <div key={hotel.name} className="bg-zinc-950 p-3 border-2 border-black rounded shadow-[2px_2px_0px_#000] flex justify-between items-center gap-3">
                  <div className="flex-1">
                    <span className="font-retro text-[9px] text-zinc-300 block leading-tight">{hotel.name}</span>
                    <span className="font-pixel text-[11px] text-zinc-500 block leading-tight mt-1">{hotel.description}</span>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right">
                      <span className="font-retro text-[9px] text-yellow-400 block">{usdToGp(hotel.costPerNight)} GP</span>
                      <span className="text-[7px] font-retro text-zinc-500">/sun cycle</span>
                    </div>
                    <button
                      onClick={() => handleBookInn(hotel.name, hotel.costPerNight)}
                      disabled={booked}
                      className={`font-retro text-[8px] py-1.5 px-3 border-2 border-black rounded shadow-[2px_2px_0px_#000] active:translate-y-0.5 cursor-pointer ${
                        booked
                          ? 'bg-zinc-800 border-zinc-700 text-zinc-500 shadow-none active:translate-y-0'
                          : 'bg-blue-600 hover:bg-blue-700 text-white'
                      }`}
                    >
                      {booked ? 'RESERVED ✓' : 'RESERVE'}
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
