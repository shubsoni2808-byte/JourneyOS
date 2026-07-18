import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { PlayerStats, Inventory, InventoryItem, Region, Quest, Achievement, GameNotification, GameSettings } from '../types/game';
import { DEFAULT_REGIONS, INITIAL_QUESTS, BAZAAR_ITEMS, ACHIEVEMENTS_LIST } from '../services/gameData';
import { soundManager } from '../components/SoundManager';

interface GameState {
  screen: 'menu' | 'character_creator' | 'guild_hall' | 'world_map' | 'kingdom_dashboard';
  dashboardTab: 'quests' | 'wallet' | 'inventory' | 'passport' | 'marketplace';
  player: PlayerStats | null;
  inventory: Inventory;
  purchasedItems: string[];
  regions: Region[];
  quests: Record<string, Quest[]>;
  activeRegionId: string | null;
  achievements: Achievement[];
  notifications: GameNotification[];
  settings: GameSettings;
  celebrationOpen: boolean;
  celebrationType: 'level_up' | 'quest_complete' | null;
  celebratedLevel: number;
  celebratedQuestTitle: string;

  // Actions
  setScreen: (screen: 'menu' | 'character_creator' | 'guild_hall' | 'world_map' | 'kingdom_dashboard') => void;
  setDashboardTab: (tab: 'quests' | 'wallet' | 'inventory' | 'passport' | 'marketplace') => void;
  createCharacter: (name: string, classType: string) => void;
  travelToRegion: (regionId: string) => void;
  toggleObjective: (questId: string, objectiveId: string) => void;
  claimQuestReward: (questId: string) => void;
  buyBazaarItem: (itemId: string) => void;
  equipPet: (petId: string) => void;
  equipBackpack: (backpackId: string) => void;
  addNotification: (message: string, type: GameNotification['type']) => void;
  dismissNotification: (id: string) => void;
  toggleMute: () => void;
  toggleBgm: (active?: boolean) => void;
  updateSettings: (update: Partial<GameSettings>) => void;
  clearSave: () => void;
  closeCelebration: () => void;
}

const XP_THRESHOLDS = [100, 250, 500, 900, 1500, 999999];

const initialInventory: Inventory = {
  weapons: [],
  keys: [],
  maps: [],
  artifacts: [],
  magic: [],
  food: [],
  potions: []
};

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      screen: 'menu',
      dashboardTab: 'quests',
      player: null,
      inventory: initialInventory,
      purchasedItems: ['basic'], // basic backpack is free
      regions: DEFAULT_REGIONS,
      quests: INITIAL_QUESTS,
      activeRegionId: null,
      achievements: ACHIEVEMENTS_LIST,
      notifications: [],
      settings: {
        muted: false,
        bgmActive: false,
        useLiveAI: false,
        geminiKey: '',
        openaiKey: ''
      },
      celebrationOpen: false,
      celebrationType: null,
      celebratedLevel: 1,
      celebratedQuestTitle: '',

      setScreen: (screen) => {
        soundManager.playClick();
        set({ screen });
      },

      setDashboardTab: (tab) => {
        soundManager.playClick();
        set({ dashboardTab: tab });
      },

      createCharacter: (name, classType) => {
        const cls = CHARACTER_CLASSES.find((c) => c.id === classType) || CHARACTER_CLASSES[0];
        
        // Starting details
        const player: PlayerStats = {
          name,
          classType,
          className: cls.name,
          classEmoji: cls.emoji,
          clothesColor: 'red',
          pet: 'none',
          backpack: 'basic',
          difficulty: 'Normal',
          travelStyle: 'Solo',
          level: 1,
          xp: 0,
          gold: 500
        };

        set({
          player,
          inventory: initialInventory,
          purchasedItems: ['basic'],
          regions: DEFAULT_REGIONS.map(r => r.id === 'golden_desert' ? { ...r, locked: false } : r),
          quests: INITIAL_QUESTS,
          activeRegionId: null,
          screen: 'world_map'
        });

        get().addNotification(`Character ${name} spawned! 🕹️`, 'success');
      },

      travelToRegion: (regionId) => {
        const region = get().regions.find((r) => r.id === regionId);
        if (!region || region.locked) {
          get().addNotification('⚠️ Region is locked!', 'error');
          return;
        }

        soundManager.playQuestComplete(); // Map travel sound effect
        set({
          activeRegionId: regionId,
          screen: 'kingdom_dashboard',
          dashboardTab: 'quests'
        });

        get().addNotification(`Entered ${region.name}! 🗺️`, 'info');
      },

      toggleObjective: (questId, objectiveId) => {
        const activeRegionId = get().activeRegionId;
        if (!activeRegionId) return;

        const regionQuests = get().quests[activeRegionId] || [];
        
        let targetQuest: Quest | null = null;
        const updatedQuests = regionQuests.map((q) => {
          if (q.id === questId) {
            const updatedObjs = q.objectives.map((o) => {
              if (o.id === objectiveId) {
                const newCompleted = !o.completed;
                if (newCompleted) {
                  soundManager.playCoin();
                } else {
                  soundManager.playClick();
                }
                return { ...o, completed: newCompleted };
              }
              return o;
            });

            // Calculate new progress percent
            const completedCount = updatedObjs.filter((o) => o.completed).length;
            const completionPercent = Math.round((completedCount / updatedObjs.length) * 100);
            
            // Check status transition
            let status: Quest['status'] = 'Not Started';
            if (completedCount === updatedObjs.length) {
              status = 'Claim Reward';
            } else if (completedCount > 0) {
              status = 'In Progress';
            }

            const updatedQuest = { ...q, objectives: updatedObjs, completionPercent, status };
            targetQuest = updatedQuest;
            return updatedQuest;
          }
          return q;
        });

        // Save back
        set((state) => ({
          quests: {
            ...state.quests,
            [activeRegionId]: updatedQuests
          }
        }));

        if (targetQuest && (targetQuest as Quest).status === 'Claim Reward') {
          get().addNotification(`Quest objectives complete: "${(targetQuest as Quest).title}"! 🎁`, 'success');
        }
      },

      claimQuestReward: (questId) => {
        const activeRegionId = get().activeRegionId;
        const player = get().player;
        if (!activeRegionId || !player) return;

        const regionQuests = get().quests[activeRegionId] || [];
        const quest = regionQuests.find((q) => q.id === questId);
        if (!quest || quest.status !== 'Claim Reward') return;

        soundManager.playQuestComplete();

        // Mark quest as completed
        const updatedQuests = regionQuests.map((q) => {
          if (q.id === questId) {
            return { ...q, status: 'Completed' as const };
          }
          return q;
        });

        // Sequentially unlock next quest in the region
        const questIdx = regionQuests.findIndex((q) => q.id === questId);
        if (questIdx !== -1 && questIdx + 1 < regionQuests.length) {
          updatedQuests[questIdx + 1] = {
            ...updatedQuests[questIdx + 1],
            locked: false
          };
          get().addNotification(`New Quest Unlocked: "${updatedQuests[questIdx + 1].title}"! 📜`, 'info');
        }

        // Apply XP and Gold rewards
        let newXp = player.xp + quest.xpReward;
        let newGold = player.gold + quest.goldReward;
        let newLevel = player.level;
        let leveledUp = false;

        const currentThreshold = XP_THRESHOLDS[newLevel - 1];
        if (newXp >= currentThreshold) {
          newXp -= currentThreshold;
          newLevel += 1;
          leveledUp = true;
        }

        // Add item to inventory based on quest configuration
        const updatedInventory = { ...get().inventory };
        let awardedItemName = '';
        
        // Dynamic reward item generation
        if (quest.id === 'gd_q1') {
          const item: InventoryItem = { id: 'dune_flask', name: 'Desert Water Canteen', emoji: '🧪', category: 'food', description: 'Keeps you hydrated in hot sands. Earned from camp setup.' };
          updatedInventory.food.push(item);
          awardedItemName = 'Desert Water Canteen';
        } else if (quest.id === 'gd_gd3' || quest.id === 'gd_q3') {
          const item: InventoryItem = { id: 'desert_key', name: 'Temple Key', emoji: '🔑', category: 'keys', description: 'Unlocks the forgotten temple gates. Awarded from defeating scorpions.' };
          updatedInventory.keys.push(item);
          awardedItemName = 'Temple Key';
        }

        // Unlock achievements
        const updatedAchievements = get().achievements.map((ach) => {
          if (ach.id === 'Explorer' && !ach.unlocked) {
            return { ...ach, unlocked: true };
          }
          if (quest.id === 'gd_q4' && ach.id === 'Desert King Defeated' && !ach.unlocked) {
            return { ...ach, unlocked: true };
          }
          return ach;
        });

        // Progress Region story stage
        const completedQuestsCount = updatedQuests.filter((q) => q.status === 'Completed').length;
        const updatedRegions = get().regions.map((r) => {
          if (r.id === activeRegionId) {
            return {
              ...r,
              currentStoryStage: Math.min(completedQuestsCount, r.story.length - 1)
            };
          }
          return r;
        });

        // Trigger regional level unlocks
        let updatedRegionsList = updatedRegions;
        if (leveledUp) {
          updatedRegionsList = updatedRegions.map((r) => {
            if (r.locked && newLevel >= r.minLevel) {
              get().addNotification(`New Realm Unlocked: ${r.name}! 🗺️`, 'success');
              return { ...r, locked: false };
            }
            return r;
          });

          // Check max level achievement
          if (newLevel >= 5) {
            const maxLvlAchIdx = updatedAchievements.findIndex(a => a.id === 'Max Level');
            if (maxLvlAchIdx !== -1) {
              updatedAchievements[maxLvlAchIdx].unlocked = true;
            }
          }

          setTimeout(() => {
            soundManager.playLevelUp();
          }, 400);
        }

        set({
          player: {
            ...player,
            xp: newXp,
            gold: newGold,
            level: newLevel
          },
          quests: {
            ...get().quests,
            [activeRegionId]: updatedQuests
          },
          inventory: updatedInventory,
          achievements: updatedAchievements,
          regions: updatedRegionsList,
          celebrationOpen: true,
          celebrationType: leveledUp ? 'level_up' : 'quest_complete',
          celebratedLevel: newLevel,
          celebratedQuestTitle: quest.title
        });

        get().addNotification(`Reward Claimed: +${quest.xpReward} XP, +${quest.goldReward} GP! 💰`, 'success');
        if (awardedItemName) {
          get().addNotification(`Inventory Updated: Added ${awardedItemName}! 🎒`, 'info');
        }
      },

      buyBazaarItem: (itemId) => {
        const item = BAZAAR_ITEMS.find((i) => i.id === itemId);
        const player = get().player;
        if (!item || !player) return;

        // Apply merchant class discount
        const discount = player.classType === 'merchant' ? 0.9 : 1.0;
        const finalCost = Math.round((item.cost || 0) * discount);

        if (player.gold < finalCost) {
          soundManager.playClick();
          get().addNotification('⚠️ Insufficient gold treasury!', 'error');
          return;
        }

        soundManager.playPurchase();
        
        // Deduct gold
        const updatedPlayer = {
          ...player,
          gold: player.gold - finalCost
        };

        // Add to inventory
        const updatedInventory = { ...get().inventory };
        updatedInventory[item.category] = [...updatedInventory[item.category], item];

        // Add to purchased lists
        const updatedPurchased = [...get().purchasedItems, itemId];

        // Unlock achievements
        const updatedAchievements = get().achievements.map((ach) => {
          if (item.id === 'ramen' && ach.id === 'Food Hunter' && !ach.unlocked) {
            return { ...ach, unlocked: true };
          }
          return ach;
        });

        // Auto unlock quests that require this item
        const activeRegionId = get().activeRegionId;
        let updatedQuests = get().quests;
        if (activeRegionId) {
          const regionQuests = get().quests[activeRegionId] || [];
          const unlockedByItemQuests = regionQuests.map((q) => {
            if (q.locked && q.requiredItems.includes(item.id)) {
              // check if other required items are present or purchased
              const hasAllReq = q.requiredItems.every((req) => updatedPurchased.includes(req));
              if (hasAllReq) {
                get().addNotification(`Unlocked by item: "${q.title}"! 📜`, 'info');
                return { ...q, locked: false };
              }
            }
            return q;
          });
          updatedQuests = {
            ...get().quests,
            [activeRegionId]: unlockedByItemQuests
          };
        }

        set({
          player: updatedPlayer,
          inventory: updatedInventory,
          purchasedItems: updatedPurchased,
          achievements: updatedAchievements,
          quests: updatedQuests
        });

        get().addNotification(`Purchased ${item.name} for ${finalCost} GP! 🎒`, 'success');
      },

      equipPet: (petId) => {
        const player = get().player;
        if (!player) return;
        soundManager.playClick();
        set({
          player: {
            ...player,
            pet: petId
          }
        });
        get().addNotification(`Equipped companion: ${petId.toUpperCase()}! 🟢`, 'info');
      },

      equipBackpack: (backpackId) => {
        const player = get().player;
        if (!player) return;
        soundManager.playClick();
        set({
          player: {
            ...player,
            backpack: backpackId
          }
        });
        get().addNotification(`Equipped backpack slot: ${backpackId.toUpperCase()}! 🎒`, 'info');
      },

      addNotification: (message, type) => {
        const id = Math.random().toString(36).substring(2, 9);
        const newNotif: GameNotification = { id, message, type };
        set((state) => ({
          notifications: [...state.notifications, newNotif]
        }));

        // Dismiss automatically after 4s
        setTimeout(() => {
          get().dismissNotification(id);
        }, 4000);
      },

      dismissNotification: (id) => {
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id)
        }));
      },

      toggleMute: () => {
        const newMuted = !get().settings.muted;
        soundManager.setMute(newMuted);
        set((state) => ({
          settings: {
            ...state.settings,
            muted: newMuted
          }
        }));
        get().addNotification(newMuted ? 'Volume Muted 🔇' : 'Sound Restored 🔊', 'info');
      },

      toggleBgm: (active) => {
        const currentBgm = get().settings.bgmActive;
        const newBgm = active !== undefined ? active : !currentBgm;
        
        if (newBgm) {
          soundManager.startBgm();
        } else {
          soundManager.stopBgm();
        }

        set((state) => ({
          settings: {
            ...state.settings,
            bgmActive: newBgm
          }
        }));
      },

      updateSettings: (update) => {
        set((state) => ({
          settings: {
            ...state.settings,
            ...update
          }
        }));
      },

      clearSave: () => {
        soundManager.playLevelUp();
        set({
          screen: 'menu',
          player: null,
          inventory: initialInventory,
          purchasedItems: ['basic'],
          regions: DEFAULT_REGIONS,
          quests: INITIAL_QUESTS,
          activeRegionId: null,
          achievements: ACHIEVEMENTS_LIST,
          notifications: [],
          celebrationOpen: false,
          celebrationType: null
        });
        get().addNotification('Saves cleared! Start your adventure.', 'warning');
      },

      closeCelebration: () => {
        set({ celebrationOpen: false, celebrationType: null });
      }
    }),
    {
      name: 'journeyos_save_store',
      partialize: (state) => ({
        player: state.player,
        inventory: state.inventory,
        purchasedItems: state.purchasedItems,
        regions: state.regions,
        quests: state.quests,
        achievements: state.achievements,
        settings: state.settings
      })
    }
  )
);

export const CHARACTER_CLASSES = [
  { id: 'explorer', name: 'Explorer', description: 'Bonus XP (+15%) on finding new locations.', emoji: '🤠', perk: '+15% XP Gain' },
  { id: 'scholar', name: 'Scholar', description: 'Deeper lore from NPC guides and travel history.', emoji: '🧙', perk: 'NPC Memory Unlock' },
  { id: 'merchant', name: 'Merchant', description: 'Discount (10%) at all inns and cosmetic stores.', emoji: '💼', perk: '10% Discount on Gold' },
  { id: 'bard', name: 'Bard', description: 'Unlocks rare chiptune tracks and extra journal stamps.', emoji: '🪕', perk: 'Bonus Cosmetics' }
];
