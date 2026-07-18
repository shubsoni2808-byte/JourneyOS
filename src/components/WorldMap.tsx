import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../store/useGameStore';
import { Region } from '../types/game';
import { soundManager } from './SoundManager';
import { ShieldAlert, Compass, CloudRain, Sun, Snowflake, Wind, Flame, Landmark, Lock, HelpCircle } from 'lucide-react';

export const WorldMap: React.FC = () => {
  const regions = useGameStore((state) => state.regions);
  const player = useGameStore((state) => state.player);
  const activeRegionId = useGameStore((state) => state.activeRegionId);
  const travelToRegion = useGameStore((state) => state.travelToRegion);
  const quests = useGameStore((state) => state.quests);

  // Local state for selecting region on map before entering
  const [selectedRegionId, setSelectedRegionId] = useState<string>(activeRegionId || 'golden_desert');

  if (!player) return null;

  const selectedRegion = regions.find((r) => r.id === selectedRegionId) || regions[0];

  const handleRegionClick = (r: Region) => {
    if (r.locked) {
      soundManager.playClick();
      useGameStore.getState().addNotification(`⚠️ Locked! Requires Level ${r.minLevel}`, 'warning');
      return;
    }
    soundManager.playClick();
    setSelectedRegionId(r.id);
  };

  const handleEnterRegion = () => {
    if (selectedRegion.locked) return;
    travelToRegion(selectedRegion.id);
  };

  const getWeatherIcon = (weather: string) => {
    switch (weather) {
      case 'Rainy':
        return <CloudRain size={12} className="text-blue-400" />;
      case 'Snowy':
        return <Snowflake size={12} className="text-cyan-200 animate-pulse" />;
      case 'Windy':
        return <Wind size={12} className="text-teal-300" />;
      case 'Hot':
        return <Flame size={12} className="text-orange-500 animate-bounce" />;
      default:
        return <Sun size={12} className="text-yellow-400" />;
    }
  };

  // Get completed quests ratio
  const getCompletedCount = (regionId: string) => {
    const rQuests = quests[regionId] || [];
    const completed = rQuests.filter((q) => q.status === 'Completed').length;
    return `${completed}/${rQuests.length}`;
  };

  // SVG dimensions for map coordinate grid
  const width = 600;
  const height = 350;

  return (
    <div className="bg-zinc-900 border-4 border-black p-4 rounded shadow-[6px_6px_0px_#000] w-full flex flex-col lg:flex-row gap-6 select-none relative">
      {/* Overworld CRT Overlay */}
      <div className="absolute inset-0 pointer-events-none z-10 crt-overlay crt-flicker opacity-40"></div>

      {/* LEFT: SVG Interactive Map */}
      <div className="flex-1 flex flex-col items-center bg-black border-4 border-black rounded p-3 overflow-hidden relative min-h-[300px]">
        {/* Hologram Grid */}
        <div className="absolute inset-0 bg-[radial-gradient(#1e1e2d_1px,transparent_1px)] [background-size:20px_20px] opacity-35"></div>

        <div className="w-full flex items-center justify-between border-b border-zinc-800 pb-2 mb-3 z-10">
          <div className="flex items-center gap-2">
            <Compass size={14} className="text-indigo-400 animate-spin" />
            <span className="font-retro text-[9px] text-zinc-400">OVERWORLD MATRIX NAVIGATION</span>
          </div>
          <div className="font-pixel text-lg text-yellow-400 uppercase tracking-widest">
            Level {player.level} {player.className}
          </div>
        </div>

        {/* SVG Overworld Canvas */}
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full max-w-full aspect-[600/350] relative z-10 select-none"
        >
          {/* Paths connecting nodes */}
          <g>
            {regions.map((region, idx) => {
              // Connect every region to next index in circle, plus connections to ruins (index 5)
              if (idx === 5) return null;
              const next = regions[(idx + 1) % 5];
              const ruins = regions[5];
              return (
                <g key={`path-${region.id}`}>
                  {/* Outer circle path */}
                  <line
                    x1={region.mapX}
                    y1={region.mapY}
                    x2={next.mapX}
                    y2={next.mapY}
                    stroke="#18181b"
                    strokeWidth={4}
                  />
                  <line
                    x1={region.mapX}
                    y1={region.mapY}
                    x2={next.mapX}
                    y2={next.mapY}
                    stroke={region.locked || next.locked ? '#3f3f46' : '#6366f1'}
                    strokeWidth={2}
                    strokeDasharray="4 4"
                    className="animate-[pulse_1.5s_infinite]"
                  />

                  {/* Inner path connection to ruins */}
                  <line
                    x1={region.mapX}
                    y1={region.mapY}
                    x2={ruins.mapX}
                    y2={ruins.mapY}
                    stroke="#18181b"
                    strokeWidth={4}
                  />
                  <line
                    x1={region.mapX}
                    y1={region.mapY}
                    x2={ruins.mapX}
                    y2={ruins.mapY}
                    stroke={region.locked || ruins.locked ? '#3f3f46' : '#ec4899'}
                    strokeWidth={2}
                    strokeDasharray="3 3"
                  />
                </g>
              );
            })}
          </g>

          {/* Region Nodes */}
          {regions.map((region) => {
            const isSelected = selectedRegionId === region.id;
            const isActive = activeRegionId === region.id;

            return (
              <g
                key={region.id}
                transform={`translate(${region.mapX}, ${region.mapY})`}
                onClick={() => handleRegionClick(region)}
                className="cursor-pointer group"
              >
                {/* Node outer pulsing circle */}
                <circle
                  r={isSelected ? 26 : 20}
                  fill="none"
                  stroke={region.locked ? '#52525b' : isSelected ? '#eab308' : '#3b82f6'}
                  strokeWidth={2}
                  className={`transition-all duration-300 ${
                    region.locked ? '' : 'animate-[ping_3s_infinite]'
                  }`}
                />

                {/* Node main circle */}
                <circle
                  r={18}
                  fill={region.locked ? '#27272a' : isSelected ? '#1e1b4b' : '#09090b'}
                  stroke={region.locked ? '#3f3f46' : isSelected ? '#facc15' : '#4f46e5'}
                  strokeWidth={3}
                  className="transition-colors duration-300"
                />

                {/* Emoji / Symbol */}
                <text
                  y={4}
                  textAnchor="middle"
                  className="text-lg select-none"
                  style={{
                    filter: region.locked ? 'grayscale(100%) opacity(40%)' : 'none'
                  }}
                >
                  {region.locked ? '🔒' : region.emoji}
                </text>

                {/* Text Label */}
                <text
                  y={30}
                  textAnchor="middle"
                  fill={region.locked ? '#52525b' : isSelected ? '#facc15' : '#cbd5e1'}
                  className="font-retro text-[7px] pointer-events-none uppercase font-bold"
                >
                  {region.name}
                </text>

                {/* Level required tag (if locked) */}
                {region.locked && (
                  <g transform="translate(0, -28)">
                    <rect
                      x="-14"
                      y="-5"
                      width="28"
                      height="10"
                      fill="#ef4444"
                      rx="2"
                    />
                    <text
                      y="2"
                      textAnchor="middle"
                      fill="#fff"
                      className="font-retro text-[5px] font-bold"
                    >
                      LV {region.minLevel}
                    </text>
                  </g>
                )}
              </g>
            );
          })}

          {/* Animated Player Token overlay */}
          {regions.map((region) => {
            if (region.id !== selectedRegionId) return null;

            return (
              <motion.g
                key="player-token"
                layoutId="playerMapToken"
                transform={`translate(${region.mapX}, ${region.mapY - 20})`}
                transition={{ type: 'spring', stiffness: 120, damping: 14 }}
              >
                {/* Float bounce wrapper */}
                <g className="animate-[float_2s_infinite]">
                  <polygon
                    points="0,0 -8,-14 8,-14"
                    fill="#10b981"
                    stroke="#000"
                    strokeWidth="2"
                  />
                  <rect
                    x="-10"
                    y="-28"
                    width="20"
                    height="14"
                    fill="#10b981"
                    stroke="#000"
                    strokeWidth="2"
                    rx="3"
                  />
                  <text
                    y="-18"
                    textAnchor="middle"
                    fill="#000"
                    className="font-retro text-[8px] font-bold"
                  >
                    {player.classEmoji}
                  </text>
                </g>
              </motion.g>
            );
          })}
        </svg>

        {/* Proximity guideline */}
        <div className="font-retro text-[7px] text-zinc-600 mt-2 tracking-wide uppercase">
          ⚔️ Nodes connected via portal lines. Select any unlocked region to inspect details. ⚔️
        </div>
      </div>

      {/* RIGHT: Region Details Inspector */}
      <div className="w-full lg:w-80 bg-zinc-950 border-4 border-zinc-800 p-5 rounded shrink-0 flex flex-col justify-between min-h-[350px]">
        <div>
          {/* Header */}
          <div className="border-b-2 border-zinc-800 pb-3 mb-4 flex items-center justify-between">
            <h3 className="font-retro text-xs text-yellow-400 uppercase leading-none">
              Realm Inspector
            </h3>
            {getWeatherIcon(selectedRegion.weather)}
          </div>

          {/* Region Core */}
          <div className="flex gap-3 items-start mb-4">
            <span className="text-4xl">{selectedRegion.emoji}</span>
            <div>
              <h4 className="font-retro text-[10px] text-slate-100 uppercase leading-tight">
                {selectedRegion.name}
              </h4>
              <span className="font-pixel text-md text-indigo-400 block mt-0.5">
                {selectedRegion.kingdom}
              </span>
            </div>
          </div>

          {/* Locked vs Unlocked Status Banner */}
          {selectedRegion.locked ? (
            <div className="bg-red-950/40 border border-red-800 p-2.5 rounded text-red-400 text-xs font-pixel flex items-center gap-2 mb-4">
              <Lock size={12} className="shrink-0" />
              <span>
                LOCKED: Portal coordinates unstable. Reach **Level {selectedRegion.minLevel}** to stabilize.
              </span>
            </div>
          ) : (
            <div className="bg-indigo-950/40 border border-indigo-800 p-2.5 rounded text-indigo-300 text-xs font-pixel flex items-center justify-between mb-4">
              <span className="flex items-center gap-1.5">
                <Compass size={12} /> Portal Active
              </span>
              <span className="text-yellow-400 font-retro text-[8px]">
                LOOT LOG: {getCompletedCount(selectedRegion.id)}
              </span>
            </div>
          )}

          {/* Description */}
          <p className="font-pixel text-lg text-zinc-400 leading-snug mb-4">
            {selectedRegion.description}
          </p>

          {/* Narrative story stage tracker */}
          <div className="bg-zinc-900 border border-zinc-850 p-3 rounded">
            <span className="font-retro text-[7px] text-zinc-500 uppercase block mb-1">
              CURRENT STORY STAGE ({selectedRegion.currentStoryStage + 1}/4)
            </span>
            <p className="font-pixel text-md text-slate-300 leading-snug italic">
              "{selectedRegion.story[selectedRegion.currentStoryStage]}"
            </p>
          </div>
        </div>

        {/* Enter Region button */}
        <div className="mt-6">
          <button
            onClick={handleEnterRegion}
            disabled={selectedRegion.locked}
            className={`w-full font-retro text-xs py-3 px-4 border-4 border-black rounded shadow-[4px_4px_0px_#000] active:translate-y-0.5 cursor-pointer text-center font-bold uppercase transition-all ${
              selectedRegion.locked
                ? 'bg-zinc-800 border-zinc-700 text-zinc-500 shadow-none active:translate-y-0 cursor-not-allowed'
                : selectedRegion.id === activeRegionId
                ? 'bg-yellow-500 hover:bg-yellow-600 text-black border-yellow-300'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white border-indigo-400'
            }`}
          >
            {selectedRegion.locked
              ? 'GATE LOCKED'
              : selectedRegion.id === activeRegionId
              ? 'CONTINUE QUESTS'
              : 'ACTIVATE TRAVEL GATE ➔'}
          </button>
        </div>
      </div>
    </div>
  );
};
