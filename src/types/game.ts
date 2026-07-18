export interface PlayerStats {
  name: string;
  classType: string;
  className: string;
  classEmoji: string;
  clothesColor: string;
  pet: string;
  backpack: string;
  difficulty: string;
  travelStyle: string;
  level: number;
  xp: number;
  gold: number;
}

export interface InventoryItem {
  id: string;
  name: string;
  emoji: string;
  category: 'weapons' | 'keys' | 'maps' | 'artifacts' | 'magic' | 'food' | 'potions';
  description: string;
  cost?: number;
  perk?: string;
}

export interface Inventory {
  weapons: InventoryItem[];
  keys: InventoryItem[];
  maps: InventoryItem[];
  artifacts: InventoryItem[];
  magic: InventoryItem[];
  food: InventoryItem[];
  potions: InventoryItem[];
}

export type QuestCategory = 'Story' | 'Adventure' | 'Combat' | 'Treasure' | 'Exploration' | 'Daily' | 'Weekly' | 'Boss';
export type QuestRarity = 'Common' | 'Uncommon' | 'Rare' | 'Epic' | 'Legendary';
export type QuestDifficulty = 'Easy' | 'Medium' | 'Hard' | 'Legendary';
export type QuestStatus = 'Not Started' | 'In Progress' | 'Claim Reward' | 'Completed' | 'Failed';

export interface QuestObjective {
  id: string;
  text: string;
  completed: boolean;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  difficulty: QuestDifficulty;
  xpReward: number;
  goldReward: number;
  estimatedDuration: string;
  requiredItems: string[];
  completionPercent: number; // calculated as (completed / total) * 100
  status: QuestStatus;
  locked: boolean;
  story: string;
  rarity: QuestRarity;
  category: QuestCategory;
  objectives: QuestObjective[];
}

export interface Region {
  id: string;
  name: string;
  kingdom: string;
  description: string;
  emoji: string;
  themeColor: string;
  mapX: number;
  mapY: number;
  weather: 'Sunny' | 'Rainy' | 'Snowy' | 'Windy' | 'Hot';
  locked: boolean;
  minLevel: number;
  story: string[]; // List of story stages
  currentStoryStage: number; // active story stage index
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
}

export interface GameNotification {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error' | 'level_up' | 'quest_complete' | 'achievement';
}

export interface GameSettings {
  muted: boolean;
  bgmActive: boolean;
  useLiveAI: boolean;
  geminiKey: string;
  openaiKey: string;
}
