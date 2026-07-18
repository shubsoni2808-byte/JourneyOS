import { Region, InventoryItem, Achievement, Challenge } from '../types/game';

export const CHARACTER_CLASSES = [
  { id: 'explorer', name: 'Explorer', description: 'Bonus XP (+15%) on finding new locations.', emoji: '🤠', perk: '+15% XP Gain' },
  { id: 'scholar', name: 'Scholar', description: 'Deeper lore from NPC guides and travel history.', emoji: '🧙', perk: 'NPC Memory Unlock' },
  { id: 'merchant', name: 'Merchant', description: 'Discount (10%) at all inns and cosmetic stores.', emoji: '💼', perk: '10% Discount on Gold' },
  { id: 'bard', name: 'Bard', description: 'Unlocks rare chiptune tracks and extra journal stamps.', emoji: '🪕', perk: 'Bonus Cosmetics' }
];

export const PETS: InventoryItem[] = [
  { id: 'slime', name: 'Pixel Slime', emoji: '🟢', category: 'magic', description: 'A bouncy green slime. Bounces when you move.', cost: 100 },
  { id: 'cat', name: 'Nyan Cat', emoji: '🐱', category: 'magic', description: 'A pixel cat that trails stardust. Increases sound volume.', cost: 250 },
  { id: 'dragon', name: 'Mini Drake', emoji: '🐲', category: 'magic', description: 'A tiny dragon. Breathes cute fire sparks.', cost: 500 }
];

export const BACKPACKS = [
  { id: 'basic', name: 'Canvas Sack', emoji: '🎒', cost: 0, capacity: 'Basic' },
  { id: 'leather', name: 'Ranger Pack', emoji: '💼', cost: 150, capacity: 'Extra Gear Slots' },
  { id: 'golden', name: 'Guildmaster Vault', emoji: '👑', cost: 400, capacity: 'Max Style' }
];

export const BAZAAR_ITEMS: InventoryItem[] = [
  // Weapons
  { id: 'rustysword', name: 'Rusty Shortsword', emoji: '🗡️', category: 'weapons', description: 'A common sword with micro-notches. +5 attack rating.', cost: 50 },
  { id: 'laserstaff', name: 'Neon Laser Staff', emoji: '🔮', category: 'weapons', description: 'Harnesses raw digital energy. +15 magic attack rating.', cost: 200 },
  { id: 'sun_scepter', name: 'Sun Scepter', emoji: '🔱', category: 'weapons', description: 'An ancient relic that beams solar flares. Required for Desert King boss raid.', cost: 350 },
  
  // Keys / Quest items
  { id: 'desert_key', name: 'Temple Key', emoji: '🔑', category: 'keys', description: 'Unlocks the forgotten temple gate in the Golden Desert.', cost: 80 },
  { id: 'compass', name: 'Dune Compass', emoji: '🧭', category: 'maps', description: 'An advanced compass that resists magnetic anomalies. Required to find rare relics.', cost: 120 },
  
  // Food & Potions
  { id: 'ramen', name: 'Cyber Ramen', emoji: '🍜', category: 'food', description: 'Delicious hot noodles. Restores 50 HP and boosts stamina.', cost: 15 },
  { id: 'potion', name: 'XP Potion', emoji: '🧪', category: 'potions', description: 'Consuming this gives a quick boost of +100 XP.', cost: 75 },
  { id: 'elixir', name: 'Golden Elixir', emoji: '🍹', category: 'potions', description: 'Regenerates all visual particles. Gives +200 GP.', cost: 150 }
];

export const ACHIEVEMENTS_LIST: Achievement[] = [
  { id: 'Explorer', title: 'Overworld Explorer', description: 'Conquer your first challenge in any region.', icon: '🧭', unlocked: false },
  { id: 'Food Hunter', title: 'Gourmet Tavern Hunter', description: 'Purchase and eat a bowl of Cyber Ramen.', icon: '🍜', unlocked: false },
  { id: 'Desert King Defeated', title: 'Sand Shogun', description: 'Defeat the Desert King boss in the Golden Desert.', icon: '👑', unlocked: false },
  { id: 'Max Level', title: 'Legendary Hero', description: 'Reach Level 5 (1500 XP Threshold).', icon: '🌟', unlocked: false }
];

export const DEFAULT_REGIONS: Region[] = [
  {
    id: 'golden_desert',
    name: 'Golden Desert',
    kingdom: 'Golden Desert Kingdom 🏜️',
    description: 'The forgotten kingdom buried beneath endless dunes. Recover relics, defeat sand guardians, unlock the ancient temple, and fight the Desert King.',
    emoji: '🏜️',
    themeColor: 'from-amber-400 to-yellow-600',
    mapX: 250,
    mapY: 220,
    weather: 'Hot',
    locked: false, // Starting region is always unlocked
    minLevel: 1,
    currentStoryStage: 0,
    story: [
      'Stage 1: A massive sandstorm has uncovered the entrance of a buried temple. You must establish a base camp.',
      'Stage 2: Sand scorpions guard the outer perimeter. Defeat them to discover the temple key.',
      'Stage 3: The entrance is sealed. Unlock the temple gates and solve the ancient rune puzzle.',
      'Stage 4: The Desert King has awakened! Defeat him to reclaim the golden relics!'
    ]
  },
  {
    id: 'frozen_peaks',
    name: 'Frozen Peaks',
    kingdom: 'Glacial Shogunate ❄️',
    description: 'Brave the freezing blizzards of the northern spires. Scale glaciers, avoid yeti patrols, and challenge the Frost Wyrm.',
    emoji: '❄️',
    themeColor: 'from-cyan-400 to-blue-600',
    mapX: 420,
    mapY: 120,
    weather: 'Snowy',
    locked: true,
    minLevel: 2,
    currentStoryStage: 0,
    story: [
      'Stage 1: Clamber up the base slopes of Mount Fuji. Watch out for yeti tracks.',
      'Stage 2: Traverse the shifting ice caverns. Secure a safe path using spiked boots.',
      'Stage 3: Reach the glacial peak temple where the Frost Wyrm sleeps.',
      'Stage 4: Battle the Frost Wyrm and claim the legendary ice relic!'
    ]
  },
  {
    id: 'dark_forest',
    name: 'Dark Forest',
    kingdom: 'Sylvan Sanctuary 🌳',
    description: 'Explore a dark, misty woodland filled with ancient ruins, fairy shrines, and nightshade golems.',
    emoji: '🌳',
    themeColor: 'from-emerald-700 to-green-900',
    mapX: 180,
    mapY: 90,
    weather: 'Windy',
    locked: true,
    minLevel: 3,
    currentStoryStage: 0,
    story: [
      'Stage 1: Enter the whispering thickets. Avoid the root traps.',
      'Stage 2: Restore power to the fairy shrines by offering glow-moss.',
      'Stage 3: Infiltrate the overgrown grove where the Nightshade Golem stands guard.',
      'Stage 4: Topple the Nightshade Golem to unlock the forest treasury!'
    ]
  },
  {
    id: 'volcanic_lands',
    name: 'Volcanic Lands',
    kingdom: 'Magma Citadel 🌋',
    description: 'Venture into a molten realm of active volcanoes and fire lakes. Surf on lava channels and fight the Fire Drake.',
    emoji: '🌋',
    themeColor: 'from-red-500 to-orange-700',
    mapX: 460,
    mapY: 280,
    weather: 'Hot',
    locked: true,
    minLevel: 4,
    currentStoryStage: 0,
    story: [
      'Stage 1: Walk the burning pathways. Drink cooling potions to resist heat.',
      'Stage 2: Repair the obsidian drawbridge leading to the Citadel.',
      'Stage 3: Cross the river of lava using the fire glider.',
      'Stage 4: Slay the Fire Drake inside the volcanic core!'
    ]
  },
  {
    id: 'sky_kingdom',
    name: 'Sky Kingdom',
    kingdom: 'Zephyr Outpost ☁️',
    description: 'Ascend to the floating islands in the clouds. Chart cloud tunnels and challenge the Storm Eagle.',
    emoji: '☁️',
    themeColor: 'from-sky-300 to-indigo-500',
    mapX: 110,
    mapY: 150,
    weather: 'Windy',
    locked: true,
    minLevel: 5,
    currentStoryStage: 0,
    story: [
      'Stage 1: Teleport to the lowest cloud platform. Anchor yourself against drafts.',
      'Stage 2: Repair the cloud wind vane to generate solid pathways.',
      'Stage 3: Fly through the sky portals into the Storm Eagle nest.',
      'Stage 4: Pluck the wind crown from the Storm Eagle!'
    ]
  },
  {
    id: 'ancient_ruins',
    name: 'Ancient Ruins',
    kingdom: 'Aegis Repository 🏛️',
    description: 'The final destination where ancient robotic sentinels guard the ultimate source code.',
    emoji: '🏛️',
    themeColor: 'from-zinc-500 to-slate-800',
    mapX: 300,
    mapY: 180,
    weather: 'Rainy',
    locked: true,
    minLevel: 6,
    currentStoryStage: 0,
    story: [
      'Stage 1: Solve the binary matrix puzzles on the outer gates.',
      'Stage 2: Disable the security forcefields of the inner sanctum.',
      'Stage 3: Awake the Titan Sentinel and face the ultimate test.',
      'Stage 4: Absorb the source code of Arcanus and complete your journey!'
    ]
  }
];

export const INITIAL_CHALLENGES: Record<string, Challenge[]> = {
  golden_desert: [
    {
      id: 'gd_c1',
      title: 'Dawn in the Dunes',
      description: 'Set up your camp and establish communications.',
      difficulty: 'Easy',
      xpReward: 50,
      coinReward: 100,
      estimatedDuration: '5 mins',
      status: 'available',
      story: 'A massive sandstorm has uncovered the entrance of a buried temple. You must establish a base camp.',
      rarity: 'Common',
      category: 'Story',
      unlockRequirements: {
        requiredChallenges: [],
        minimumLevel: 1,
        minimumXP: 0,
        requiredItems: [],
        requiredRegion: 'golden_desert'
      },
      progress: { completedObjectives: 0, totalObjectives: 3 },
      objectives: [
        { id: 'gd_c1_o1', text: 'Pitch a heavy duty storm tent', completed: false },
        { id: 'gd_c1_o2', text: 'Calibrate the navigation scrollboard', completed: false },
        { id: 'gd_c1_o3', text: 'Gather dry brushwood for campfire', completed: false }
      ]
    },
    {
      id: 'gd_c2',
      title: 'Scarab Relic Hunt',
      description: 'Scour the surrounding tombs for glowing golden relics.',
      difficulty: 'Medium',
      xpReward: 100,
      coinReward: 150,
      estimatedDuration: '10 mins',
      status: 'locked',
      story: 'Search the tomb entrance and locate sand-covered relics.',
      rarity: 'Uncommon',
      category: 'Exploration',
      unlockRequirements: {
        requiredChallenges: ['gd_c1'],
        minimumLevel: 1,
        minimumXP: 50,
        requiredItems: ['compass'],
        requiredRegion: 'golden_desert'
      },
      progress: { completedObjectives: 0, totalObjectives: 3 },
      objectives: [
        { id: 'gd_c2_o1', text: 'Use Dune Compass to bypass mirages', completed: false },
        { id: 'gd_c2_o2', text: 'Solve the tomb entry dial lock', completed: false },
        { id: 'gd_c2_o3', text: 'Acquire 3 scarab tokens', completed: false }
      ]
    },
    {
      id: 'gd_c3',
      title: 'Scorpion Skirmish',
      description: 'Clear the guardian scorpion beasts blocking the inner sanctum.',
      difficulty: 'Hard',
      xpReward: 180,
      coinReward: 200,
      estimatedDuration: '15 mins',
      status: 'locked',
      story: 'Sand scorpions guard the outer perimeter. Defeat them to discover the temple key.',
      rarity: 'Rare',
      category: 'Combat',
      unlockRequirements: {
        requiredChallenges: ['gd_c2'],
        minimumLevel: 1,
        minimumXP: 150,
        requiredItems: ['rustysword'],
        requiredRegion: 'golden_desert'
      },
      progress: { completedObjectives: 0, totalObjectives: 2 },
      objectives: [
        { id: 'gd_c3_o1', text: 'Slay 3 sand scorpions', completed: false },
        { id: 'gd_c3_o2', text: 'Harvest scorpion poison venom', completed: false }
      ]
    },
    {
      id: 'gd_c4',
      title: 'The Desert King Boss Raid',
      description: 'Confront the Desert King and lock the desert vortex.',
      difficulty: 'Legendary',
      xpReward: 300,
      coinReward: 350,
      estimatedDuration: '30 mins',
      status: 'locked',
      story: 'The Desert King has awakened! Defeat him to reclaim the golden relics!',
      rarity: 'Legendary',
      category: 'Boss',
      unlockRequirements: {
        requiredChallenges: ['gd_c3'],
        minimumLevel: 1,
        minimumXP: 300,
        requiredItems: ['sun_scepter', 'desert_key'],
        requiredRegion: 'golden_desert'
      },
      progress: { completedObjectives: 0, totalObjectives: 3 },
      objectives: [
        { id: 'gd_c4_o1', text: 'Use Temple Key to unlock inner gate', completed: false },
        { id: 'gd_c4_o2', text: 'Channel solar beam using Sun Scepter', completed: false },
        { id: 'gd_c4_o3', text: 'Defeat the Desert King!', completed: false }
      ]
    }
  ],
  frozen_peaks: [
    {
      id: 'fp_c1',
      title: 'Mountaineer Trials',
      description: 'Ascend the base slopes of Mount Fuji and brave the cold.',
      difficulty: 'Easy',
      xpReward: 60,
      coinReward: 120,
      estimatedDuration: '8 mins',
      status: 'locked',
      story: 'Clamber up the base slopes of Mount Fuji. Watch out for yeti tracks.',
      rarity: 'Common',
      category: 'Story',
      unlockRequirements: {
        requiredChallenges: [],
        minimumLevel: 2,
        minimumXP: 100,
        requiredItems: [],
        requiredRegion: 'frozen_peaks'
      },
      progress: { completedObjectives: 0, totalObjectives: 2 },
      objectives: [
        { id: 'fp_c1_o1', text: 'Set up base camp at 1,000 meters elevation', completed: false },
        { id: 'fp_c1_o2', text: 'Ignite thermal heat beacons', completed: false }
      ]
    },
    {
      id: 'fp_c2',
      title: 'Glacial Cave Raid',
      description: 'Venture deep inside the frozen blue cavern.',
      difficulty: 'Medium',
      xpReward: 120,
      coinReward: 180,
      estimatedDuration: '12 mins',
      status: 'locked',
      story: 'Traverse the shifting ice caverns. Secure a safe path using spiked boots.',
      rarity: 'Uncommon',
      category: 'Adventure',
      unlockRequirements: {
        requiredChallenges: ['fp_c1'],
        minimumLevel: 2,
        minimumXP: 150,
        requiredItems: [],
        requiredRegion: 'frozen_peaks'
      },
      progress: { completedObjectives: 0, totalObjectives: 2 },
      objectives: [
        { id: 'fp_c2_o1', text: 'Clear ice blocks using pickaxe tool', completed: false },
        { id: 'fp_c2_o2', text: 'Gather glowing frost lilies', completed: false }
      ]
    },
    {
      id: 'fp_c3',
      title: 'The Frost Wyrm Raid',
      description: 'Slay the ice dragon ruling the peaks.',
      difficulty: 'Legendary',
      xpReward: 350,
      coinReward: 400,
      estimatedDuration: '30 mins',
      status: 'locked',
      story: 'Battle the Frost Wyrm and claim the legendary ice relic!',
      rarity: 'Legendary',
      category: 'Boss',
      unlockRequirements: {
        requiredChallenges: ['fp_c2'],
        minimumLevel: 2,
        minimumXP: 250,
        requiredItems: ['laserstaff'],
        requiredRegion: 'frozen_peaks'
      },
      progress: { completedObjectives: 0, totalObjectives: 2 },
      objectives: [
        { id: 'fp_c3_o1', text: 'Weaken dragon shields with laser staff', completed: false },
        { id: 'fp_c3_o2', text: 'Defeat the Frost Wyrm!', completed: false }
      ]
    }
  ],
  dark_forest: [
    {
      id: 'df_c1',
      title: 'Whispering Woodlands',
      description: 'Enter the whispering spore thickets. Avoid the root traps.',
      difficulty: 'Easy',
      xpReward: 80,
      coinReward: 150,
      estimatedDuration: '10 mins',
      status: 'locked',
      story: 'Enter the whispering thickets. Avoid the root traps.',
      rarity: 'Common',
      category: 'Story',
      unlockRequirements: {
        requiredChallenges: [],
        minimumLevel: 3,
        minimumXP: 250,
        requiredItems: [],
        requiredRegion: 'dark_forest'
      },
      progress: { completedObjectives: 0, totalObjectives: 2 },
      objectives: [
        { id: 'df_c1_o1', text: 'Decode forest entrance coordinates', completed: false },
        { id: 'df_c1_o2', text: 'Gather 5 poison spore dusts', completed: false }
      ]
    },
    {
      id: 'df_c2',
      title: 'Fairy Shrines Activation',
      description: 'Offer glow-moss to activate the shrines.',
      difficulty: 'Medium',
      xpReward: 140,
      coinReward: 220,
      estimatedDuration: '15 mins',
      status: 'locked',
      story: 'Restore power to the fairy shrines by offering glow-moss.',
      rarity: 'Rare',
      category: 'Treasure',
      unlockRequirements: {
        requiredChallenges: ['df_c1'],
        minimumLevel: 3,
        minimumXP: 350,
        requiredItems: [],
        requiredRegion: 'dark_forest'
      },
      progress: { completedObjectives: 0, totalObjectives: 2 },
      objectives: [
        { id: 'df_c2_o1', text: 'Collect fairy glow-moss', completed: false },
        { id: 'df_c2_o2', text: 'Solve shrine logic puzzle', completed: false }
      ]
    },
    {
      id: 'df_c3',
      title: 'Nightshade Golem Raid',
      description: 'Topple the Nightshade Golem in the overgrown grove.',
      difficulty: 'Legendary',
      xpReward: 400,
      coinReward: 500,
      estimatedDuration: '30 mins',
      status: 'locked',
      story: 'Topple the Nightshade Golem to unlock the forest treasury!',
      rarity: 'Legendary',
      category: 'Boss',
      unlockRequirements: {
        requiredChallenges: ['df_c2'],
        minimumLevel: 3,
        minimumXP: 500,
        requiredItems: ['laserstaff'],
        requiredRegion: 'dark_forest'
      },
      progress: { completedObjectives: 0, totalObjectives: 2 },
      objectives: [
        { id: 'df_c3_o1', text: 'Expose Golem weakness point', completed: false },
        { id: 'df_c3_o2', text: 'Shatter the golem core!', completed: false }
      ]
    }
  ],
  volcanic_lands: [
    {
      id: 'vl_c1',
      title: 'Magma Infiltration',
      description: 'Walk the burning pathways. Drink cooling potions to resist heat.',
      difficulty: 'Medium',
      xpReward: 100,
      coinReward: 200,
      estimatedDuration: '12 mins',
      status: 'locked',
      story: 'Walk the burning pathways. Drink cooling potions to resist heat.',
      rarity: 'Common',
      category: 'Story',
      unlockRequirements: {
        requiredChallenges: [],
        minimumLevel: 4,
        minimumXP: 500,
        requiredItems: [],
        requiredRegion: 'volcanic_lands'
      },
      progress: { completedObjectives: 0, totalObjectives: 2 },
      objectives: [
        { id: 'vl_c1_o1', text: 'Drink heat resistance potion', completed: false },
        { id: 'vl_c1_o2', text: 'Chart magma thermal heatwaves', completed: false }
      ]
    },
    {
      id: 'vl_c2',
      title: 'Citadel Drawbridge Fix',
      description: 'Repair the obsidian drawbridge pulleys.',
      difficulty: 'Hard',
      xpReward: 180,
      coinReward: 280,
      estimatedDuration: '18 mins',
      status: 'locked',
      story: 'Repair the obsidian drawbridge leading to the Citadel.',
      rarity: 'Rare',
      category: 'Combat',
      unlockRequirements: {
        requiredChallenges: ['vl_c1'],
        minimumLevel: 4,
        minimumXP: 650,
        requiredItems: [],
        requiredRegion: 'volcanic_lands'
      },
      progress: { completedObjectives: 0, totalObjectives: 2 },
      objectives: [
        { id: 'vl_c2_o1', text: 'Recover 3 obsidian slabs from fiery taverns', completed: false },
        { id: 'vl_c2_o2', text: 'Ignite drawbridge pulleys', completed: false }
      ]
    },
    {
      id: 'vl_c3',
      title: 'Fire Drake Core Battle',
      description: 'Slay the Lava Drake inside the volcanic core!',
      difficulty: 'Legendary',
      xpReward: 450,
      coinReward: 600,
      estimatedDuration: '30 mins',
      status: 'locked',
      story: 'Slay the Fire Drake inside the volcanic core!',
      rarity: 'Legendary',
      category: 'Boss',
      unlockRequirements: {
        requiredChallenges: ['vl_c2'],
        minimumLevel: 4,
        minimumXP: 800,
        requiredItems: ['laserstaff'],
        requiredRegion: 'volcanic_lands'
      },
      progress: { completedObjectives: 0, totalObjectives: 2 },
      objectives: [
        { id: 'vl_c3_o1', text: 'Survive lava tsunami breath', completed: false },
        { id: 'vl_c3_o2', text: 'Vanquish the Lava Drake!', completed: false }
      ]
    }
  ],
  sky_kingdom: [
    {
      id: 'sk_c1',
      title: 'Zephyr Turbines Alignment',
      description: 'Align the turbines and anchor yourself against drafts.',
      difficulty: 'Medium',
      xpReward: 120,
      coinReward: 250,
      estimatedDuration: '15 mins',
      status: 'locked',
      story: 'Teleport to the lowest cloud platform. Anchor yourself against drafts.',
      rarity: 'Common',
      category: 'Story',
      unlockRequirements: {
        requiredChallenges: [],
        minimumLevel: 5,
        minimumXP: 900,
        requiredItems: [],
        requiredRegion: 'sky_kingdom'
      },
      progress: { completedObjectives: 0, totalObjectives: 2 },
      objectives: [
        { id: 'sk_c1_o1', text: 'Align wind turbines in Zephyr Outpost', completed: false },
        { id: 'sk_c1_o2', text: 'Harvest 5 cloud crystal feathers', completed: false }
      ]
    },
    {
      id: 'sk_c2',
      title: 'Storm Eagle Wind Crown',
      description: 'Defeat the Storm Eagle and claim the Wind Crown.',
      difficulty: 'Legendary',
      xpReward: 500,
      coinReward: 700,
      estimatedDuration: '30 mins',
      status: 'locked',
      story: 'Pluck the wind crown from the Storm Eagle!',
      rarity: 'Legendary',
      category: 'Boss',
      unlockRequirements: {
        requiredChallenges: ['sk_c1'],
        minimumLevel: 5,
        minimumXP: 1100,
        requiredItems: [],
        requiredRegion: 'sky_kingdom'
      },
      progress: { completedObjectives: 0, totalObjectives: 3 },
      objectives: [
        { id: 'sk_c2_o1', text: 'Climb the lightning spire cloud', completed: false },
        { id: 'sk_c2_o2', text: 'Electrocute Storm Eagle shields', completed: false },
        { id: 'sk_c2_o3', text: 'Claim the Wind Crown!', completed: false }
      ]
    }
  ],
  ancient_ruins: [
    {
      id: 'ar_c1',
      title: 'Binary Gate Hacking',
      description: 'Hack the console and solve the binary matrix puzzles.',
      difficulty: 'Hard',
      xpReward: 200,
      coinReward: 300,
      estimatedDuration: '20 mins',
      status: 'locked',
      story: 'Solve the binary matrix puzzles on the outer gates.',
      rarity: 'Rare',
      category: 'Story',
      unlockRequirements: {
        requiredChallenges: [],
        minimumLevel: 6,
        minimumXP: 1500,
        requiredItems: [],
        requiredRegion: 'ancient_ruins'
      },
      progress: { completedObjectives: 0, totalObjectives: 2 },
      objectives: [
        { id: 'ar_c1_o1', text: 'Hack the ruins gateway console', completed: false },
        { id: 'ar_c1_o2', text: 'Unpack the source code key', completed: false }
      ]
    },
    {
      id: 'ar_c2',
      title: 'Sanctum Titan Sentinel',
      description: 'Awake the Titan Sentinel and face the final test.',
      difficulty: 'Legendary',
      xpReward: 600,
      coinReward: 1000,
      estimatedDuration: '40 mins',
      status: 'locked',
      story: 'Awake the Titan Sentinel and face the ultimate test.',
      rarity: 'Legendary',
      category: 'Boss',
      unlockRequirements: {
        requiredChallenges: ['ar_c1'],
        minimumLevel: 6,
        minimumXP: 2000,
        requiredItems: ['laserstaff', 'sun_scepter'],
        requiredRegion: 'ancient_ruins'
      },
      progress: { completedObjectives: 0, totalObjectives: 2 },
      objectives: [
        { id: 'ar_c2_o1', text: 'Expose the mainframe core terminal', completed: false },
        { id: 'ar_c2_o2', text: 'Shutdown the Aegis Titan!', completed: false }
      ]
    }
  ]
};
