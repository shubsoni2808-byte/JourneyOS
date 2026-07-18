import React, { useState } from 'react';
import soundManager from './SoundManager';
import { CHARACTER_CLASSES, CHARACTER_CLASSES as CLASSES } from '../data/mockData';
import { ChevronRight, ChevronLeft, Sparkles, User, Shield } from 'lucide-react';

interface CharacterCreatorProps {
  onSave: (character: any) => void;
  onBack: () => void;
}

export const CharacterCreator: React.FC<CharacterCreatorProps> = ({ onSave, onBack }) => {
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
    setSelectedClassIdx((prev) => (prev + 1) % CLASSES.length);
  };

  const handlePrevClass = () => {
    soundManager.playClick();
    setSelectedClassIdx((prev) => (prev - 1 + CLASSES.length) % CLASSES.length);
  };

  const currentClass = CLASSES[selectedClassIdx];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    soundManager.playLevelUp();
    onSave({
      name,
      classType: currentClass.id,
      className: currentClass.name,
      classEmoji: currentClass.emoji,
      clothesColor,
      pet: selectedPet,
      difficulty,
      travelStyle,
      level: 1,
      xp: 0,
      gold: 500 // starting gold
    });
  };

  return (
    <div className="min-h-screen w-full bg-[#0a0a10] text-slate-100 flex items-center justify-center p-4 md:p-8 select-none">
      <div className="w-full max-w-4xl bg-zinc-900 border-4 border-black shadow-[8px_8px_0px_#000] p-6 rounded relative overflow-hidden">
        {/* CRT Scanline */}
        <div className="crt-overlay crt-flicker"></div>
        
        {/* Title */}
        <h2 className="text-2xl md:text-3xl font-retro text-yellow-400 text-center mb-8 drop-shadow-[2px_2px_0px_#000]">
          ⚔️ CREATE YOUR ADVENTURER ⚔️
        </h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* LEFT PANEL: Customize character sprites & metrics */}
          <div className="flex flex-col gap-6 bg-zinc-950 p-4 border-4 border-zinc-800 rounded">
            {/* Sprite Preview Box */}
            <div className="flex flex-col items-center justify-center bg-zinc-900 border-4 border-black p-6 rounded shadow-inner min-h-[220px] relative">
              <span className="absolute top-2 left-2 text-[10px] font-retro text-zinc-500">PREVIEW</span>
              
              {/* Retro Character Graphic */}
              <div className="relative w-24 h-24 flex items-center justify-center animate-bounce">
                {/* Simulated Character Sprite */}
                <div className={`w-16 h-16 rounded-xl border-4 border-black flex flex-col justify-between p-2 shadow-[2px_2px_0px_#000] ${
                  clothesColor === 'red' ? 'bg-red-500' :
                  clothesColor === 'blue' ? 'bg-blue-500' :
                  clothesColor === 'purple' ? 'bg-indigo-500' : 'bg-emerald-500'
                }`}>
                  {/* Face */}
                  <div className="flex justify-around w-full mt-1">
                    <div className="w-2 h-2 bg-black rounded-sm"></div>
                    <div className="w-2 h-2 bg-black rounded-sm"></div>
                  </div>
                  {/* Body accessories */}
                  <div className="text-center font-retro text-xs text-white leading-none">
                    {currentClass.emoji}
                  </div>
                </div>

                {/* Pet companion preview */}
                {selectedPet !== 'none' && (
                  <div className="absolute -bottom-2 -right-2 text-3xl float-animation">
                    {petsList.find(p => p.id === selectedPet)?.emoji}
                  </div>
                )}
              </div>

              <div className="mt-4 font-retro text-xs text-zinc-400 text-center">
                Level 1 {currentClass.name} <br/>
                <span className="text-emerald-400">{name}</span>
              </div>
            </div>

            {/* Sprite Customizer (Clothes Color) */}
            <div>
              <label className="block font-retro text-xs text-zinc-400 mb-2">CLOTHES SKIN</label>
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
              <label className="block font-retro text-xs text-zinc-400 mb-2">SELECT COMPANION PET</label>
              <div className="grid grid-cols-4 gap-2">
                {petsList.map((pet) => (
                  <button
                    key={pet.id}
                    type="button"
                    onClick={() => {
                      soundManager.playClick();
                      setSelectedPet(pet.id);
                    }}
                    className={`p-2 border-2 border-black flex flex-col items-center justify-center bg-zinc-800 text-xs rounded hover:bg-zinc-700 cursor-pointer ${
                      selectedPet === pet.id ? 'bg-indigo-900 border-indigo-400 text-yellow-300' : 'text-zinc-400'
                    }`}
                  >
                    <span className="text-xl mb-1">{pet.emoji}</span>
                    <span className="font-pixel text-[10px] text-center leading-none">{pet.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT PANEL: Class Selection & Adventure Details */}
          <div className="flex flex-col gap-6">
            {/* Name Input */}
            <div>
              <label className="block font-retro text-xs text-yellow-400 mb-2 flex items-center gap-1">
                <User size={12} /> ENTER NAME
              </label>
              <input
                type="text"
                maxLength={15}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-zinc-950 border-4 border-black text-slate-100 p-3 font-retro text-sm uppercase rounded focus:outline-none focus:border-yellow-400 shadow-[4px_4px_0px_#000]"
                required
              />
            </div>

            {/* Class Selector */}
            <div className="bg-zinc-950 p-4 border-4 border-zinc-850 rounded">
              <label className="block font-retro text-xs text-zinc-400 mb-2">GUILD CLASS</label>
              
              <div className="flex items-center justify-between gap-4 mb-2">
                <button
                  type="button"
                  onClick={handlePrevClass}
                  className="bg-zinc-800 hover:bg-zinc-700 border-2 border-black p-1 text-yellow-400 cursor-pointer"
                >
                  <ChevronLeft size={20} />
                </button>
                <div className="text-center">
                  <span className="font-retro text-sm text-yellow-300 block">
                    {currentClass.emoji} {currentClass.name.toUpperCase()}
                  </span>
                  <span className="inline-block bg-indigo-950 border border-indigo-500 text-indigo-300 text-[10px] font-retro px-2 py-0.5 mt-1 rounded">
                    Perk: {currentClass.perk}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleNextClass}
                  className="bg-zinc-800 hover:bg-zinc-700 border-2 border-black p-1 text-yellow-400 cursor-pointer"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
              <p className="text-xs font-sans text-zinc-400 text-center min-h-[40px]">
                {currentClass.description}
              </p>
            </div>

            {/* Travel Style Selector */}
            <div>
              <label className="block font-retro text-xs text-zinc-400 mb-2">TRAVEL STYLE</label>
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
                      travelStyle === style.id ? 'bg-yellow-500 text-black border-yellow-300 font-semibold' : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300'
                    }`}
                  >
                    <span className="font-retro text-[10px] uppercase block mb-1">{style.id}</span>
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-zinc-500 mt-1 pl-1">
                {travelStyles.find((s) => s.id === travelStyle)?.desc}
              </p>
            </div>

            {/* Difficulty Selector */}
            <div>
              <label className="block font-retro text-xs text-zinc-400 mb-2 flex items-center gap-1">
                <Shield size={12} /> CAMPAIGN DIFFICULTY
              </label>
              <div className="flex gap-4">
                {['Sightseeing', 'Normal', 'Hardcore'].map((diff) => (
                  <label key={diff} className="flex items-center gap-2 cursor-pointer text-xs font-retro text-zinc-300 hover:text-white">
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
            className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-retro text-xs py-3 px-6 border-4 border-black shadow-[4px_4px_0px_#000] rounded active:translate-x-1 active:translate-y-1 transition-all cursor-pointer"
          >
            ⬅️ BACK
          </button>
          
          <button
            type="button"
            onClick={handleSubmit}
            className="bg-emerald-500 hover:bg-emerald-600 text-black font-retro text-xs py-3 px-6 border-4 border-black shadow-[4px_4px_0px_#000] rounded active:translate-x-1 active:translate-y-1 transition-all cursor-pointer flex items-center gap-1"
          >
            <Sparkles size={14} /> SPAWN CHARACTER ➔
          </button>
        </div>
      </div>
    </div>
  );
};
