import React, { useRef, useEffect, useState } from 'react';
import soundManager from './SoundManager';
import { TravelDestination } from '../data/mockData';
import { Move, Navigation, CloudRain, Sun, SunMoon, Milestone } from 'lucide-react';

interface WorldMapProps {
  character: any;
  activeItinerary: TravelDestination | null;
  onEnterKingdom: () => void;
}

export const WorldMap: React.FC<WorldMapProps> = ({ character, activeItinerary, onEnterKingdom }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [playerPos, setPlayerPos] = useState({ x: 120, y: 180 });
  const [timeOfDay, setTimeOfDay] = useState<'Day' | 'Sunset' | 'Night' | 'Sunrise'>('Day');
  const [weatherActive, setWeatherActive] = useState(true);
  const [portalUnlocked, setPortalUnlocked] = useState(false);
  const [reachedPortal, setReachedPortal] = useState(false);

  // Keyboard controls tracking
  const keysPressed = useRef<Record<string, boolean>>({});

  useEffect(() => {
    if (activeItinerary) {
      setPortalUnlocked(true);
    }
  }, [activeItinerary]);

  // Key event listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressed.current[e.key.toLowerCase()] = true;
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current[e.key.toLowerCase()] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Time loop (Simulate day/night cycle every 20s)
  useEffect(() => {
    const times: ('Day' | 'Sunset' | 'Night' | 'Sunrise')[] = ['Day', 'Sunset', 'Night', 'Sunrise'];
    let idx = 0;
    const interval = setInterval(() => {
      idx = (idx + 1) % times.length;
      setTimeOfDay(times[idx]);
    }, 15000); // 15 seconds per cycle state

    return () => clearInterval(interval);
  }, []);

  // Game/Draw loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let frame = 0;

    // Set map details
    const mapWidth = 600;
    const mapHeight = 350;

    // Particle weather systems
    const particles: { x: number; y: number; speedY: number; speedX: number; size: number }[] = [];
    const maxParticles = 60;

    for (let i = 0; i < maxParticles; i++) {
      particles.push({
        x: Math.random() * mapWidth,
        y: Math.random() * mapHeight,
        speedY: 2 + Math.random() * 3,
        speedX: -1 + Math.random() * 2,
        size: 1 + Math.random() * 2
      });
    }

    // Portal targets coordinates
    const startPoint = { x: 120, y: 180 };
    let targetPoint = { x: -100, y: -100 };
    if (activeItinerary) {
      targetPoint = { x: activeItinerary.mapX, y: activeItinerary.mapY };
    }

    let pX = playerPos.x;
    let pY = playerPos.y;

    const loop = () => {
      frame++;
      ctx.clearRect(0, 0, mapWidth, mapHeight);

      // 1. Draw Map Terrain background
      ctx.fillStyle = '#1c3d18'; // Grass color
      ctx.fillRect(0, 0, mapWidth, mapHeight);

      // Draw standard tiles procedurally (sand, water, road grids)
      // Ocean (bottom/left)
      ctx.fillStyle = '#0f2c59';
      ctx.fillRect(0, 240, 160, 110);

      // Desert area (top right)
      ctx.fillStyle = '#9c7c38';
      ctx.fillRect(450, 0, 150, 150);

      // Mountains area (middle top)
      ctx.fillStyle = '#3a3a42';
      ctx.beginPath();
      ctx.moveTo(250, 0);
      ctx.lineTo(300, 60);
      ctx.lineTo(350, 0);
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(290, 0);
      ctx.lineTo(340, 80);
      ctx.lineTo(390, 0);
      ctx.fill();

      // Paths connecting starting point to destinations
      ctx.strokeStyle = '#4e3f30';
      ctx.lineWidth = 12;
      ctx.beginPath();
      ctx.moveTo(startPoint.x, startPoint.y);
      // Path to Royal Kingdom (Paris)
      ctx.lineTo(200, 100);
      // Path to Sakura (Tokyo)
      ctx.moveTo(startPoint.x, startPoint.y);
      ctx.lineTo(420, 150);
      // Path to Beach (Goa)
      ctx.moveTo(startPoint.x, startPoint.y);
      ctx.lineTo(300, 280);
      // Path to Desert (Dubai)
      ctx.moveTo(startPoint.x, startPoint.y);
      ctx.lineTo(250, 220);
      ctx.stroke();

      // 2. Draw Kingdoms / Towers
      const drawKingdom = (x: number, y: number, color: string, emoji: string, name: string) => {
        // Shadow base
        ctx.fillStyle = 'rgba(0,0,0,0.3)';
        ctx.fillRect(x - 20, y + 10, 40, 10);

        // Tower body
        ctx.fillStyle = color;
        ctx.fillRect(x - 15, y - 20, 30, 30);
        // Roof
        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.moveTo(x - 20, y - 20);
        ctx.lineTo(x, y - 35);
        ctx.lineTo(x + 20, y - 20);
        ctx.fill();

        // Emoji overlay
        ctx.font = '16px serif';
        ctx.fillText(emoji, x - 8, y + 2);

        // Label
        ctx.fillStyle = '#fff';
        ctx.font = '8px "Press Start 2P", monospace';
        ctx.textAlign = 'center';
        ctx.fillText(name, x, y + 25);
      };

      drawKingdom(120, 180, '#4b5563', '🏡', 'START VIL.');
      drawKingdom(200, 100, '#3b82f6', '👑', 'ROYAL FR');
      drawKingdom(420, 150, '#ec4899', '🌸', 'SAKURA JP');
      drawKingdom(300, 280, '#f59e0b', '🏖️', 'BEACH IN');
      drawKingdom(250, 220, '#d97706', '🏜️', 'DESERT AE');

      // 3. Draw Unlocked Portal Glow
      if (portalUnlocked && activeItinerary) {
        ctx.strokeStyle = `rgba(139, 92, 246, ${0.4 + Math.sin(frame * 0.1) * 0.3})`;
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(targetPoint.x, targetPoint.y, 28 + Math.sin(frame * 0.05) * 4, 0, Math.PI * 2);
        ctx.stroke();

        // Pulsing core
        ctx.fillStyle = `rgba(236, 72, 153, ${0.2 + Math.sin(frame * 0.1) * 0.15})`;
        ctx.beginPath();
        ctx.arc(targetPoint.x, targetPoint.y, 22, 0, Math.PI * 2);
        ctx.fill();
      }

      // Fog of War: hide parts of the map if not planning anything
      if (!portalUnlocked) {
        ctx.fillStyle = 'rgba(10, 10, 15, 0.75)';
        // Draw fog cover on destinations (right side of canvas)
        ctx.fillRect(160, 0, 440, 350);
        
        ctx.fillStyle = '#fff';
        ctx.font = '8px "Press Start 2P", monospace';
        ctx.textAlign = 'center';
        ctx.fillText('⚔️ TALK TO GUILD MASTER TO UNLOCK PORTALS ⚔️', 300, 40);
      }

      // 4. Update and Draw Player Sprite
      const speed = 2.5;
      let dx = 0;
      let dy = 0;

      if (keysPressed.current['w'] || keysPressed.current['arrowup']) dy = -1;
      if (keysPressed.current['s'] || keysPressed.current['arrowdown']) dy = 1;
      if (keysPressed.current['a'] || keysPressed.current['arrowleft']) dx = -1;
      if (keysPressed.current['d'] || keysPressed.current['arrowright']) dx = 1;

      // Normalize speed if diagonal movement
      if (dx !== 0 && dy !== 0) {
        dx *= 0.707;
        dy *= 0.707;
      }

      const nextX = pX + dx * speed;
      const nextY = pY + dy * speed;

      // Canvas boundary clamp
      if (nextX > 15 && nextX < mapWidth - 15) pX = nextX;
      if (nextY > 15 && nextY < mapHeight - 15) pY = nextY;

      // Draw Player Sprite (cute bounce animation)
      const bounceOffset = Math.sin(frame * 0.15) * 3;
      
      // Shadow
      ctx.fillStyle = 'rgba(0,0,0,0.4)';
      ctx.beginPath();
      ctx.arc(pX, pY + 12, 10, 0, Math.PI * 2);
      ctx.fill();

      // Body (colored cloak)
      ctx.fillStyle = character.clothesColor === 'red' ? '#ef4444' :
                      character.clothesColor === 'blue' ? '#3b82f6' :
                      character.clothesColor === 'purple' ? '#6366f1' : '#10b981';
      ctx.fillRect(pX - 10, pY - 14 + bounceOffset, 20, 24);

      // Face / Eyes
      ctx.fillStyle = '#fde047'; // golden mask
      ctx.fillRect(pX - 8, pY - 8 + bounceOffset, 16, 10);
      ctx.fillStyle = '#000'; // eyes
      ctx.fillRect(pX - 5, pY - 5 + bounceOffset, 2, 2);
      ctx.fillRect(pX + 3, pY - 5 + bounceOffset, 2, 2);

      // Hair/Hood top
      ctx.fillStyle = '#000000';
      ctx.fillRect(pX - 11, pY - 18 + bounceOffset, 22, 6);

      // Name tag above player
      ctx.fillStyle = '#facc15';
      ctx.font = '6px "Press Start 2P", monospace';
      ctx.textAlign = 'center';
      ctx.fillText(character.name, pX, pY - 24 + bounceOffset);

      // 5. Draw Companion Pet
      if (character.pet && character.pet !== 'none') {
        const petEmoji = character.pet === 'slime' ? '🟢' : character.pet === 'cat' ? '🐱' : '🐲';
        const petLagX = pX - dx * 16 - 15;
        const petLagY = pY - dy * 16 + 2 + Math.sin(frame * 0.2) * 4;
        ctx.font = '12px serif';
        ctx.fillText(petEmoji, petLagX, petLagY);
      }

      // Check portal proximity
      if (portalUnlocked && activeItinerary) {
        const dist = Math.hypot(pX - targetPoint.x, pY - targetPoint.y);
        if (dist < 22) {
          if (!reachedPortal) {
            setReachedPortal(true);
            soundManager.playLevelUp();
          }
        } else {
          setReachedPortal(false);
        }
      }

      // 6. Draw Day/Night Overlay filter
      if (timeOfDay === 'Sunset') {
        ctx.fillStyle = 'rgba(234, 88, 12, 0.2)'; // warm amber sunset
        ctx.fillRect(0, 0, mapWidth, mapHeight);
      } else if (timeOfDay === 'Night') {
        ctx.fillStyle = 'rgba(12, 12, 56, 0.45)'; // deep dark blue night
        ctx.fillRect(0, 0, mapWidth, mapHeight);
        
        // Draw night stars blinking on screen
        ctx.fillStyle = '#fff';
        for (let s = 0; s < 5; s++) {
          if ((frame + s * 30) % 120 < 60) {
            const sx = (150 * s) % mapWidth;
            const sy = (70 * s) % 180;
            ctx.fillRect(sx, sy, 2, 2);
          }
        }
      } else if (timeOfDay === 'Sunrise') {
        ctx.fillStyle = 'rgba(139, 92, 246, 0.15)'; // light purple morning
        ctx.fillRect(0, 0, mapWidth, mapHeight);
      }

      // 7. Draw Weather Effects overlay
      if (weatherActive && activeItinerary) {
        ctx.fillStyle = '#3b82f6';
        particles.forEach((p) => {
          if (activeItinerary.weather === 'Rainy') {
            ctx.fillStyle = 'rgba(59, 130, 246, 0.7)';
            ctx.fillRect(p.x, p.y, p.size, p.size * 5);
            p.y += p.speedY;
            p.x += p.speedX;
            if (p.y > mapHeight) {
              p.y = 0;
              p.x = Math.random() * mapWidth;
            }
          } else if (activeItinerary.weather === 'Snowy') {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
            p.y += p.speedY * 0.4;
            p.x += p.speedX * 0.5;
            if (p.y > mapHeight) {
              p.y = 0;
              p.x = Math.random() * mapWidth;
            }
          } else if (activeItinerary.weather === 'Hot') {
            // Draw heat shimmer heat lines procedurally
            ctx.fillStyle = `rgba(234, 179, 8, ${0.08 + Math.sin(frame * 0.05 + p.x) * 0.04})`;
            ctx.fillRect(p.x, p.y, 4, 30);
            p.y -= 1;
            if (p.y < 0) p.y = mapHeight;
          }
        });
      }

      // Loop sync state
      setPlayerPos({ x: pX, y: pY });
      animId = requestAnimationFrame(loop);
    };

    loop();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [portalUnlocked, activeItinerary, weatherActive, timeOfDay]);

  // Click on map pathfinding movement
  const handleMapClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Instant teleport or gradual move. Let's do gradual move by setting player coordinate immediately
    soundManager.playClick();
    setPlayerPos({ x: Math.floor(x), y: Math.floor(y) });
  };

  const handlePortalEnter = () => {
    soundManager.playQuestComplete();
    onEnterKingdom();
  };

  return (
    <div className="flex flex-col items-center gap-4 bg-zinc-900 border-4 border-black p-4 rounded shadow-[6px_6px_0px_#000] w-full">
      {/* HUD Menu Header */}
      <div className="flex flex-wrap items-center justify-between w-full border-b-2 border-zinc-800 pb-3 gap-2">
        <div className="flex items-center gap-2">
          <Milestone size={16} className="text-yellow-400" />
          <span className="font-retro text-[10px] text-zinc-300">
            LOC: {activeItinerary ? `OUTSIDE ${activeItinerary.kingdom.toUpperCase()}` : 'OVERWORLD PLAINS'}
          </span>
        </div>
        <div className="flex items-center gap-4">
          {/* Controls indicators */}
          <div className="hidden sm:flex items-center gap-1 bg-zinc-950 border border-zinc-700 px-2 py-0.5 rounded text-[8px] font-retro text-zinc-500">
            <Move size={8} /> WASD / ARROWS TO WALK
          </div>
          {/* Weather status indicator */}
          {activeItinerary && (
            <button
              onClick={() => setWeatherActive(!weatherActive)}
              className={`flex items-center gap-1 font-retro text-[8px] px-2 py-0.5 border border-black rounded shadow-[2px_2px_0px_#000] active:translate-y-0.5 cursor-pointer ${
                weatherActive ? 'bg-indigo-900 text-indigo-300' : 'bg-zinc-800 text-zinc-500'
              }`}
            >
              <CloudRain size={8} /> WEATHER: {activeItinerary.weather.toUpperCase()}
            </button>
          )}
          {/* Day/Night status */}
          <div className="flex items-center gap-1 bg-indigo-950 border border-indigo-700 text-indigo-300 text-[8px] font-retro px-2 py-0.5 rounded">
            <SunMoon size={8} /> TIME: {timeOfDay.toUpperCase()}
          </div>
        </div>
      </div>

      {/* Map Screen container */}
      <div className="relative border-4 border-black bg-black rounded overflow-hidden">
        <canvas
          ref={canvasRef}
          width={600}
          height={350}
          onClick={handleMapClick}
          className="block max-w-full aspect-[600/350] cursor-crosshair active:scale-[0.99] transition-transform"
        />

        {/* Portal Unlock Prompt Overlay */}
        {reachedPortal && activeItinerary && (
          <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center p-6 text-center z-20">
            <span className="text-5xl animate-bounce mb-3">🌀</span>
            <h3 className="font-retro text-sm text-purple-400 mb-2">DIMENSIONAL PORTAL READY!</h3>
            <p className="font-pixel text-lg text-slate-300 max-w-sm mb-4">
              Step through the fast-travel gate to explore the travel quest lines of <strong className="text-white">{activeItinerary.name}</strong>.
            </p>
            <button
              onClick={handlePortalEnter}
              className="bg-purple-600 hover:bg-purple-700 text-white font-retro text-xs py-3 px-6 border-4 border-black shadow-[4px_4px_0px_#000] active:translate-y-0.5 transition-all rounded cursor-pointer animate-pulse"
            >
              🌌 ENTER KINGDOM 🌌
            </button>
          </div>
        )}
      </div>

      {/* Instructions bottom */}
      {!reachedPortal && activeItinerary && (
        <div className="text-center font-retro text-[9px] text-zinc-400 animate-pulse mt-1">
          🗺️ GO TO THE UNLOCKED PORTAL GLOW AT ({activeItinerary.mapX}, {activeItinerary.mapY}) TO ENTER THE REGION 🗺️
        </div>
      )}
    </div>
  );
};
