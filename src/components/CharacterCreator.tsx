import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../store/useGameStore';
import { CHARACTER_CLASSES } from '../services/gameData';
import { soundManager } from './SoundManager';
import { ChevronRight, ChevronLeft, Sparkles, User, Shield } from 'lucide-react';

interface CharacterCreatorProps {
  onBack: () => void;
}

export const CharacterCreator: React.FC<CharacterCreatorProps> = ({ onBack }) => {
  const createCharacter = useGameStore((state) => state.createCharacter);
  const setScreen = useGameStore((state) => state.setScreen);

  const [name, setName] = useState('Traveler');
  const [selectedClassIdx, setSelectedClassIdx] = useState(0);
  const [clothesColor, setClothesColor] = useState('red');
  const [selectedPet, setSelectedPet] = useState('none');
  const [difficulty, setDifficulty] = useState('Normal');
  const [travelStyle, setTravelStyle] = useState('Solo');

  const spriteColors = [
    { name: 'Red Hood', value: 'red', bg: 'bg-red-500' },
    { name: 'Blue Cloak', value: 'blue', bg: 'bg-blue-500' },
    { name: 'Mage Purple', value: 'purple', bg: 'bg-purple-500' },
    { name: 'Rogue Green', value: 'green', bg: 'bg-green-500' }
  ];

  const petsList = [
    { id: 'none', name: 'No Pet', emoji: '🚫' },
    { id: 'slime', name: 'Slime', emoji: '🟢' },
    { id: 'cat', name: 'Cat', emoji: '🐱' },
    { id: 'dragon', name: 'Dragon', emoji: '🐲' }
  ];

  const travelStyles = [
    { id: 'Solo', name: 'Solo Hero', desc: 'You travel alone, charting unknown corners.' },
    { id: 'Family', name: 'Family Guild', desc: 'A party of diverse level players needing comfort.' },
    { id: 'Friends', name: 'Co-op Party', desc: 'High energy sightseeing and group challenges.' }
  ];

  const handleNextClass = () => {
    soundManager.playClick();
    setSelectedClassIdx((prev) => (prev + 1) % CHARACTER_CLASSES.length);
  };

  const handlePrevClass = () => {
    soundManager.playClick();
    setSelectedClassIdx((prev) => (prev - 1 + CHARACTER_CLASSES.length) % CHARACTER_CLASSES.length);
  };

  const currentClass = CHARACTER_CLASSES[selectedClassIdx];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    soundManager.playLevelUp();
    
    // Call store action
    createCharacter(name, currentClass.id);

    // Apply specific customization updates directly to state
    useGameStore.setState((state) => {
      if (!state.player) return {};
      return {
        player: {
          ...state.player,
          clothesColor,
          pet: selectedPet,
          difficulty,
          travelStyle
        }
      };
    });
  };

  return (
    <div className="min-h-screen w-full bg-[#0a0a10] text-slate-100 flex items-center justify-center p-4 md:p-8 select-none relative">
      {/* CRT scanlines */}
      <div className="absolute inset-0 pointer-events-none z-20 crt-overlay crt-flicker"></div>

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', duration: 0.5 }}
        className="w-full max-w-4xl bg-zinc-900 border-4 border-black shadow-[8px_8px_0px_#000] p-6 rounded relative overflow-hidden"
      >
        
        {/* Title */}
        <h2 className="text-2xl md:text-3xl font-retro text-yellow-400 text-center mb-8 drop-shadow-[2px_2px_0px_#000]">
          ⚔️ CREATE YOUR ADVENTURER ⚔️
        </h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* LEFT PANEL: Customize character sprites & metrics */}
          <div className="flex flex-col gap-6 bg-zinc-950 p-4 border-4 border-zinc-850 rounded">
            
            {/* Sprite Preview Box */}
            <div className="flex flex-col items-center justify-center bg-zinc-900 border-4 border-black p-6 rounded shadow-inner min-h-[220px] relative">
              <span className="absolute top-2 left-2 text-[7px] font-retro text-zinc-500">HOLOGRAM HUD</span>
              
              {/* Retro Character Graphic */}
              <div className="relative w-24 h-24 flex items-center justify-center">
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ repeat: Infinity, duration: 1.8 }}
                  className={`w-16 h-16 rounded-xl border-4 border-black flex flex-col justify-between p-2 shadow-[3px_3px_0px_#000] ${
                    clothesColor === 'red' ? 'bg-red-500' :
                    clothesColor === 'blue' ? 'bg-blue-500' :
                    clothesColor === 'purple' ? 'bg-indigo-500' : 'bg-emerald-500'
                  }`}
                >
                  {/* Face */}
                  <div className="flex justify-around w-full mt-1">
                    <div className="w-2 h-2 bg-black rounded-sm"></div>
                    <div className="w-2 h-2 bg-black rounded-sm"></div>
                  </div>
                  {/* Body accessories */}
                  <div className="text-center font-retro text-xs text-white leading-none">
                    {currentClass.emoji}
                  </div>
                </motion.div>

                {/* Pet companion preview */}
                {selectedPet !== 'none' && (
                  <motion.div
                    animate={{ y: [0, -3, 0] }}
                    transition={{ repeat: Infinity, duration: 1.2 }}
                    className="absolute -bottom-2 -right-2 text-3xl"
                  >
                    {petsList.find(p => p.id === selectedPet)?.emoji}
                  </motion.div>
                )}
              </div>

              <div className="mt-4 font-retro text-[8px] text-zinc-400 text-center uppercase tracking-wide leading-relaxed">
                Level 1 {currentClass.name} <br/>
                <span className="text-emerald-400 font-bold text-xs">{name}</span>
              </div>
            </div>

            {/* Sprite Customizer (Clothes Color) */}
            <div>
              <label className="block font-retro text-[8px] text-zinc-500 mb-2">COSTUME ARMOR SKIN</label>
              <div className="flex gap-2">
                {spriteColors.map((color) => (
                  <button
                    key={color.value}
                    type="button"
                    onClick={() => {
                      soundManager.playClick();
                      setClothesColor(color.value);
                    }}
                    className={`w-10 h-10 border-4 border-black shadow-[2px_2px_0px_#000] cursor-pointer ${color.bg} ${
                      clothesColor === color.value ? 'ring-4 ring-yellow-400 ring-offset-2 ring-offset-zinc-950 scale-105' : 'opacity-70 hover:opacity-100'
                    }`}
                    title={color.name}
                  />
                ))}
              </div>
            </div>

            {/* Companion selection */}
            <div>
              <label className="block font-retro text-[8px] text-zinc-500 mb-2">CHOOSE STARTING COMPANION</label>
              <div className="grid grid-cols-4 gap-2">
                {petsList.map((pet) => (
                  <button
                    key={pet.id}
                    type="button"
                    onClick={() => {
                      soundManager.playClick();
                      setSelectedPet(pet.id);
                    }}
                    className={`p-2 border-2 border-black flex flex-col items-center justify-center bg-zinc-800 text-xs rounded hover:bg-zinc-750 cursor-pointer ${
                      selectedPet === pet.id ? 'bg-indigo-900 border-indigo-500 text-yellow-300' : 'text-zinc-400'
                    }`}
                  >
                    <span className="text-xl mb-1">{pet.emoji}</span>
                    <span className="font-pixel text-[10px] text-center leading-none font-bold uppercase">{pet.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT PANEL: Class Selection & Adventure Details */}
          <div className="flex flex-col gap-6">
            
            {/* Name Input */}
            <div>
              <label className="block font-retro text-[8px] text-yellow-400 mb-2 flex items-center gap-1">
                <User size={12} /> ENTER PROFILE LOG
              </label>
              <input
                type="text"
                maxLength={15}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-zinc-950 border-4 border-black text-slate-100 p-3 font-retro text-[9px] uppercase rounded focus:outline-none focus:border-yellow-400 shadow-[4px_4px_0px_#000]"
                required
              />
            </div>

            {/* Class Selector */}
            <div className="bg-zinc-950 p-4 border-4 border-zinc-850 rounded">
              <label className="block font-retro text-[8px] text-zinc-500 mb-2">GUILD CLASS SPEC</label>
              
              <div className="flex items-center justify-between gap-4 mb-2">
                <button
                  type="button"
                  onClick={handlePrevClass}
                  className="bg-zinc-850 hover:bg-zinc-850 border-2 border-black p-1 text-yellow-400 cursor-pointer"
                >
                  <ChevronLeft size={16} />
                </button>
                <div className="text-center">
                  <span className="font-retro text-[10px] text-yellow-300 block font-bold tracking-wide">
                    {currentClass.emoji} {currentClass.name.toUpperCase()}
                  </span>
                  <span className="inline-block bg-indigo-950 border border-indigo-500 text-indigo-300 text-[8px] font-retro px-2 py-0.5 mt-1.5 rounded">
                    Perk: {currentClass.perk}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleNextClass}
                  className="bg-zinc-850 hover:bg-zinc-850 border-2 border-black p-1 text-yellow-400 cursor-pointer"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
              <p className="text-xs font-sans text-zinc-400 text-center min-h-[40px] leading-relaxed pt-1">
                {currentClass.description}
              </p>
            </div>

            {/* Travel Style Selector */}
            <div>
              <label className="block font-retro text-[8px] text-zinc-500 mb-2">EXPEDITION STYLING</label>
              <div className="grid grid-cols-3 gap-2">
                {travelStyles.map((style) => (
                  <button
                    key={style.id}
                    type="button"
                    onClick={() => {
                      soundManager.playClick();
                      setTravelStyle(style.id);
                    }}
                    className={`p-2 border-2 border-black rounded text-center cursor-pointer transition-colors ${
                      travelStyle === style.id ? 'bg-yellow-500 text-black border-yellow-300 font-bold' : 'bg-zinc-800 hover:bg-zinc-755 text-zinc-300'
                    }`}
                  >
                    <span className="font-retro text-[8px] uppercase block">{style.id}</span>
                  </button>
                ))}
              </div>
              <p className="text-[11px] font-pixel text-zinc-500 mt-1.5 pl-1 leading-snug">
                {travelStyles.find((s) => s.id === travelStyle)?.desc}
              </p>
            </div>

            {/* Difficulty Selector */}
            <div>
              <label className="block font-retro text-[8px] text-zinc-500 mb-2 flex items-center gap-1">
                <Shield size={12} /> SIGHTSEEING CHALLENGE
              </label>
              <div className="flex gap-4">
                {['Sightseeing', 'Normal', 'Hardcore'].map((diff) => (
                  <label key={diff} className="flex items-center gap-2 cursor-pointer text-[8px] font-retro text-zinc-300 hover:text-white">
                    <input
                      type="radio"
                      name="difficulty"
                      checked={difficulty === diff}
                      onChange={() => {
                        soundManager.playClick();
                        setDifficulty(diff);
                      }}
                      className="accent-yellow-400 cursor-pointer"
                    />
                    <span>{diff.toUpperCase()}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </form>

        {/* Buttons footer */}
        <div className="mt-8 pt-6 border-t-4 border-zinc-800 flex items-center justify-between">
          <button
            type="button"
            onClick={() => {
              soundManager.playClick();
              onBack();
            }}
            className="bg-zinc-800 hover:bg-zinc-750 text-zinc-300 font-retro text-xs py-3 px-6 border-4 border-black shadow-[4px_4px_0px_#000] rounded active:translate-x-1 active:translate-y-1 transition-all cursor-pointer font-bold"
          >
            ⬅️ MENU
          </button>
          
          <button
            type="button"
            onClick={handleSubmit}
            className="bg-emerald-500 hover:bg-emerald-600 text-black font-retro text-xs py-3 px-6 border-4 border-black shadow-[4px_4px_0px_#000] rounded active:translate-x-1 active:translate-y-1 transition-all cursor-pointer flex items-center gap-1 font-bold"
          >
            <Sparkles size={14} className="animate-spin" /> SPAWN CHARACTER
          </button>
        </div>
      </motion.div>
    </div>
  );
};
