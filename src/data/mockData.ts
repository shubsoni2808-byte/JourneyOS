export interface Quest {
  id: string;
  text: string;
  completed: boolean;
  xpReward: number;
  goldReward: number;
  category: 'accommodation' | 'food' | 'sightseeing' | 'transport';
}

export interface DayItinerary {
  dayNumber: number;
  title: string;
  theme: string;
  quests: Quest[];
  rewardClaimed: boolean;
}

export interface TravelDestination {
  id: string;
  name: string;
  kingdom: string;
  themeColor: string;
  emoji: string;
  mapX: number; // coordinate on the 2D pixel map
  mapY: number;
  description: string;
  currency: string;
  goldRate: number; // Gold per USD
  weather: 'Sunny' | 'Rainy' | 'Snowy' | 'Windy' | 'Hot';
  packingList: { name: string; icon: string; category: string; description: string }[];
  itinerary: DayItinerary[];
  foodSuggestions: { name: string; description: string; cost: number }[];
  hotelSuggestions: { name: string; rating: string; costPerNight: number; description: string }[];
  flightSuggestions: { code: string; airline: string; price: number; duration: string }[];
  npcDialogues: {
    guide: string;
    chef: string;
    innkeeper: string;
    driver: string;
  };
}

export const DESTINATIONS: Record<string, TravelDestination> = {
  tokyo: {
    id: 'tokyo',
    name: 'Tokyo, Japan',
    kingdom: 'Sakura Kingdom 🌸',
    themeColor: 'from-pink-400 to-rose-600',
    emoji: '🌸',
    mapX: 420,
    mapY: 150,
    description: 'A neon-lit realm where ancient shrines stand tall amidst cloud-piercing towers of technology.',
    currency: 'JPY (¥)',
    goldRate: 150,
    weather: 'Sunny',
    packingList: [
      { name: 'Passport', icon: '🎒', category: 'Essential', description: 'Your key to cross-border teleportation portals.' },
      { name: 'Comfortable Sneakers', icon: '👟', category: 'Footwear', description: 'Essential for traversing the endless neon walkways.' },
      { name: 'Pocket Wi-Fi', icon: '⚡', category: 'Gear', description: 'Restores connection and navigational spellboards.' },
      { name: 'Pasmo/Suica Card', icon: '💳', category: 'Currency', description: 'Speeds up transit via subways and high-speed portals.' },
      { name: 'Power Bank', icon: '🔋', category: 'Gear', description: 'Keeps your digital spellbooks fully charged.' },
      { name: 'Light Jacket', icon: '🧥', category: 'Clothing', description: 'Protection against evening breezes in Shinjuku.' }
    ],
    itinerary: [
      {
        dayNumber: 1,
        title: 'Dawn of the Neon Shogunate',
        theme: 'Senso-ji & Akihabara',
        rewardClaimed: false,
        quests: [
          { id: 't1_q1', text: 'Pass through the Kaminarimon gate at Senso-ji Temple', completed: false, xpReward: 50, goldReward: 20, category: 'sightseeing' },
          { id: 't1_q2', text: 'Obtain an Omikuji fortune paper from the shrine wardens', completed: false, xpReward: 30, goldReward: 10, category: 'sightseeing' },
          { id: 't1_q3', text: 'Infiltrate Akihabara Electric Town and hunt for retro cartridges', completed: false, xpReward: 60, goldReward: 30, category: 'sightseeing' },
          { id: 't1_q4', text: 'Feast on Tonkatsu Ramen at a hidden underground tavern', completed: false, xpReward: 40, goldReward: 15, category: 'food' }
        ]
      },
      {
        dayNumber: 2,
        title: 'The Sky-High Boss Raid',
        theme: 'Harajuku & Shibuya',
        rewardClaimed: false,
        quests: [
          { id: 't2_q1', text: 'Navigate the labyrinth of Shibuya Crossing safely', completed: false, xpReward: 50, goldReward: 25, category: 'transport' },
          { id: 't2_q2', text: 'Purchase extreme street-wear from Harajuku Takeshita Street', completed: false, xpReward: 40, goldReward: 30, category: 'sightseeing' },
          { id: 't2_q3', text: 'Scale the Shibuya Sky Lookout and defeat the wind boss (take a photo)', completed: false, xpReward: 100, goldReward: 50, category: 'sightseeing' },
          { id: 't2_q4', text: 'Dine with robotic waiters at a cyberpunk sushi bar', completed: false, xpReward: 50, goldReward: 20, category: 'food' }
        ]
      },
      {
        dayNumber: 3,
        title: 'Legacy of the Emperors',
        theme: 'Meiji Jingu & Shinjuku Gyoen',
        rewardClaimed: false,
        quests: [
          { id: 't3_q1', text: 'Walk the silent forest path to Meiji Jingu Shrine', completed: false, xpReward: 50, goldReward: 15, category: 'sightseeing' },
          { id: 't3_q2', text: 'Rest at the traditional teahouse in Shinjuku Gyoen Garden', completed: false, xpReward: 40, goldReward: 20, category: 'food' },
          { id: 't3_q3', text: 'Explore the narrow alleyways of Omoide Yokocho', completed: false, xpReward: 60, goldReward: 25, category: 'sightseeing' },
          { id: 't3_q4', text: 'Book your capsule pod at the Neon Capsule Inn', completed: false, xpReward: 80, goldReward: 40, category: 'accommodation' }
        ]
      }
    ],
    foodSuggestions: [
      { name: 'Ichiran Tonkatsu Ramen', description: 'Rich pork broth with thin noodles served in private solo-booths.', cost: 12 },
      { name: 'Gyukatsu Motomura', description: 'Deep-fried beef cutlet that you sear yourself on a hot stone plate.', cost: 18 },
      { name: 'Harajuku Crepes', description: 'Sweet, rolled crepes filled with fresh fruit, ice cream, and brownies.', cost: 6 }
    ],
    hotelSuggestions: [
      { name: 'Shinjuku Prince Hotel', rating: '⭐⭐⭐⭐', costPerNight: 120, description: 'Located right next to Shinjuku Station, offering high-altitude views.' },
      { name: 'Nine Hours Capsule Inn', rating: '⭐⭐⭐', costPerNight: 45, description: 'Sleek, futuristic pods perfect for budget solo adventurers.' },
      { name: 'Hoshinoya Tokyo Ryokan', rating: '⭐⭐⭐⭐⭐', costPerNight: 450, description: 'Ultra-luxury traditional ryokan with rooftop thermal spring baths.' }
    ],
    flightSuggestions: [
      { code: 'JL-006', airline: 'Japan Airlines', price: 820, duration: '11h 30m' },
      { code: 'NH-110', airline: 'All Nippon Airways', price: 950, duration: '11h 15m' },
      { code: 'ZIP-022', airline: 'ZIPAIR (Budget)', price: 480, duration: '12h 00m' }
    ],
    npcDialogues: {
      guide: 'Greetings traveler! I am Ryu, your Sakura Guild guide. Watch out for the Shibuya wind boss; hold onto your hat!',
      chef: 'Welcome! Try my legendary ramen. It heals 50 HP and boosts your stamina for long strolls!',
      innkeeper: 'Rest your weary bones in our capsule pods, traveler. Our quiet zones are highly guarded.',
      driver: 'Step into my green-painted chariot! Fast travel via subways is the swiftest way around.'
    }
  },
  paris: {
    id: 'paris',
    name: 'Paris, France',
    kingdom: 'Royal Kingdom 👑',
    themeColor: 'from-blue-400 to-indigo-600',
    emoji: '👑',
    mapX: 200,
    mapY: 100,
    description: 'A romantic realm of cobblestone lanes, gilded palaces, and towering iron monuments.',
    currency: 'EUR (€)',
    goldRate: 0.92,
    weather: 'Windy',
    packingList: [
      { name: 'Passport', icon: '🎒', category: 'Essential', description: 'Essential teleportation papers.' },
      { name: 'Stylish Trenchcoat', icon: '🧥', category: 'Clothing', description: 'Grants +10 Charisma and wind resistance.' },
      { name: 'Eiffel Entry Tickets', icon: '🎟️', category: 'Gear', description: 'Allows bypass of the massive tower dungeon queues.' },
      { name: 'Umbrella', icon: '☔', category: 'Essential', description: 'Blocks water-elemental attacks from the skies.' },
      { name: 'Camera', icon: '📷', category: 'Gear', description: 'Captures memories to add to your adventure journal.' }
    ],
    itinerary: [
      {
        dayNumber: 1,
        title: 'The Gilded Iron Spire',
        theme: 'Eiffel & Seine',
        rewardClaimed: false,
        quests: [
          { id: 'p1_q1', text: 'Climb the Eiffel Tower Boss Spire (2nd Floor or Summit)', completed: false, xpReward: 100, goldReward: 40, category: 'sightseeing' },
          { id: 'p1_q2', text: 'Take a boat cruise down the Seine River Portal', completed: false, xpReward: 50, goldReward: 20, category: 'transport' },
          { id: 'p1_q3', text: 'Savor butter croissants at a street-side cafe', completed: false, xpReward: 30, goldReward: 10, category: 'food' }
        ]
      },
      {
        dayNumber: 2,
        title: 'Labyrinth of Masterpieces',
        theme: 'Louvre & Notre Dame',
        rewardClaimed: false,
        quests: [
          { id: 'p2_q1', text: 'Navigate the Louvre Dungeon to locate the Mona Lisa painting', completed: false, xpReward: 80, goldReward: 30, category: 'sightseeing' },
          { id: 'p2_q2', text: 'Marvel at the ancient architecture of Notre Dame Cathedral', completed: false, xpReward: 40, goldReward: 15, category: 'sightseeing' },
          { id: 'p2_q3', text: 'Eat French Onion Soup at a historic bistro', completed: false, xpReward: 40, goldReward: 20, category: 'food' }
        ]
      }
    ],
    foodSuggestions: [
      { name: 'Croissant & Cafe au Lait', description: 'Fresh, flaky butter pastry served with rich espresso milk.', cost: 5 },
      { name: 'Duck Confit', description: 'Slow-cooked duck leg served with crispy garlic potatoes.', cost: 25 },
      { name: 'Macarons from Laduree', description: 'Sweet, colorful almond meringue cookies in assorted flavors.', cost: 12 }
    ],
    hotelSuggestions: [
      { name: 'Hotel Regina Louvre', rating: '⭐⭐⭐⭐⭐', costPerNight: 280, description: 'Classic Parisian luxury overlooking the Tuileries Gardens.' },
      { name: 'Generator Hostel Paris', rating: '⭐⭐⭐', costPerNight: 40, description: 'Hip, modern social space with a rooftop bar viewing Montmartre.' },
      { name: 'Hotel Caron de Beaumarchais', rating: '⭐⭐⭐⭐', costPerNight: 160, description: 'Charming 18th-century themed hotel in the heart of Le Marais.' }
    ],
    flightSuggestions: [
      { code: 'AF-015', airline: 'Air France', price: 780, duration: '8h 45m' },
      { code: 'UA-912', airline: 'United Airlines', price: 690, duration: '9h 10m' }
    ],
    npcDialogues: {
      guide: 'Bonjour! I am Jean, a Parisian scholar. Beware of pickpocket goblins in the subway dungeons!',
      chef: 'Ah, my duck confit is cooked for hours. It increases your elegance stat by 15 points!',
      innkeeper: 'Welcome to Marais. Sleep soundly, our lavender sheets ward off night phantoms.',
      driver: 'Hold on tight! My taxi navigates the roundabouts like a racing kart.'
    }
  },
  goa: {
    id: 'goa',
    name: 'Goa, India',
    kingdom: 'Beach Kingdom 🏖️',
    themeColor: 'from-amber-300 to-orange-500',
    emoji: '🏖️',
    mapX: 300,
    mapY: 280,
    description: 'A sun-drenched coastal realm of swaying palms, pristine beaches, and ancient forts.',
    currency: 'INR (₹)',
    goldRate: 83.5,
    weather: 'Hot',
    packingList: [
      { name: 'Passport/Visa', icon: '🎒', category: 'Essential', description: 'Critical entry credentials.' },
      { name: 'Swimwear', icon: '🩳', category: 'Clothing', description: 'Allows swimming in the vast Ocean grids.' },
      { name: 'Sunscreen SPF 50', icon: '🧴', category: 'Essential', description: 'Protects against solar burn attacks (-10 fire dmg).' },
      { name: 'Sunglasses', icon: '🕶️', category: 'Clothing', description: 'Grants +5 coolness and reduces glare.' },
      { name: 'Flip Flops', icon: '🩴', category: 'Footwear', description: 'Saves sneakers from the sand-trap status effect.' }
    ],
    itinerary: [
      {
        dayNumber: 1,
        title: 'Sun and Shacks',
        theme: 'Anjuna & Calangute',
        rewardClaimed: false,
        quests: [
          { id: 'g1_q1', text: 'Set up base camp at Anjuna Beach', completed: false, xpReward: 40, goldReward: 15, category: 'sightseeing' },
          { id: 'g1_q2', text: 'Order Spicy Fish Recheado at a beachside shack', completed: false, xpReward: 50, goldReward: 20, category: 'food' },
          { id: 'g1_q3', text: 'Witness the crimson sunset at Curlies Tavern', completed: false, xpReward: 60, goldReward: 25, category: 'sightseeing' }
        ]
      },
      {
        dayNumber: 2,
        title: 'Bastion of the Coast',
        theme: 'Fort Aguada & Panaji',
        rewardClaimed: false,
        quests: [
          { id: 'g2_q1', text: 'Infiltrate Fort Aguada and climb the historic lighthouse', completed: false, xpReward: 70, goldReward: 30, category: 'sightseeing' },
          { id: 'g2_q2', text: 'Explore the colorful Portuguese quarters of Fontainhas', completed: false, xpReward: 50, goldReward: 20, category: 'sightseeing' },
          { id: 'g2_q3', text: 'Rent a motor scooter (fast mount) to cruise Panaji lanes', completed: false, xpReward: 40, goldReward: 15, category: 'transport' }
        ]
      }
    ],
    foodSuggestions: [
      { name: 'Pork Vindaloo', description: 'Extremely spicy, tangy curry flavored with vinegar and garlic.', cost: 8 },
      { name: 'Bebinca', description: 'A multi-layered traditional Goan dessert made of coconut milk and egg.', cost: 4 },
      { name: 'Goan Fish Curry Rice', description: 'Spicy coconut curry served with warm steamed basmati rice.', cost: 6 }
    ],
    hotelSuggestions: [
      { name: 'Taj Holiday Village Resort', rating: '⭐⭐⭐⭐⭐', costPerNight: 200, description: 'Stunning luxury cottages situated right on Sinquerim beach.' },
      { name: 'W Goa Vagator', rating: '⭐⭐⭐⭐⭐', costPerNight: 240, description: 'Hip, artistic villas looking down at Vagator beach.' },
      { name: 'The Hosteller Anjuna', rating: '⭐⭐⭐', costPerNight: 12, description: 'Cozy backpacker bunks with a shared pool and live music.' }
    ],
    flightSuggestions: [
      { code: 'AI-156', airline: 'Air India', price: 350, duration: '14h 20m' },
      { code: '6E-201', airline: 'IndiGo (Budget)', price: 290, duration: '15h 10m' }
    ],
    npcDialogues: {
      guide: 'Hey buddy! I am Sunil, your beach guide. Rent a scooter to explore hidden sandy paths!',
      chef: 'Fresh catch of the day! Cooked with red chilis and fresh coconut. It boosts fire resist!',
      innkeeper: 'Grab a hammock, crack open a coconut. Our hostel is safe from the monsoon rain.',
      driver: 'Hop on my scooter mount! Helmets are mandatory in these parts!'
    }
  },
  dubai: {
    id: 'dubai',
    name: 'Dubai, UAE',
    kingdom: 'Golden Desert 🏜️',
    themeColor: 'from-amber-400 to-yellow-600',
    emoji: '🏜️',
    mapX: 250,
    mapY: 220,
    description: 'A towering oasis of glass and gold surrounded by endless sand dunes.',
    currency: 'AED',
    goldRate: 3.67,
    weather: 'Hot',
    packingList: [
      { name: 'Passport', icon: '🎒', category: 'Essential', description: 'Official entry document.' },
      { name: 'Sunscreens & Shield', icon: '🧴', category: 'Essential', description: 'Essential blocks against solar rays.' },
      { name: 'Sand Shawl', icon: '🧣', category: 'Clothing', description: 'Protects face from harsh sandstorms.' },
      { name: 'Water Flask', icon: '🧪', category: 'Gear', description: 'Replenishes Hydration points.' }
    ],
    itinerary: [
      {
        dayNumber: 1,
        title: 'Assault on the Iron Giant',
        theme: 'Burj Khalifa & Mall',
        rewardClaimed: false,
        quests: [
          { id: 'd1_q1', text: 'Ascend to the 148th floor of the Burj Khalifa Spire', completed: false, xpReward: 120, goldReward: 50, category: 'sightseeing' },
          { id: 'd1_q2', text: 'Watch the fountain dance show from the lake platform', completed: false, xpReward: 40, goldReward: 15, category: 'sightseeing' },
          { id: 'd1_q3', text: 'Purchase artifacts in the Dubai Mall Bazaar', completed: false, xpReward: 40, goldReward: 20, category: 'sightseeing' }
        ]
      },
      {
        dayNumber: 2,
        title: 'Desert Dune Raid',
        theme: 'Dune Bashing & Camp',
        rewardClaimed: false,
        quests: [
          { id: 'd2_q1', text: 'Ride a 4x4 sand cruiser across the red dunes', completed: false, xpReward: 80, goldReward: 35, category: 'transport' },
          { id: 'd2_q2', text: 'Ride a camel mount at the desert camp', completed: false, xpReward: 50, goldReward: 20, category: 'sightseeing' },
          { id: 'd2_q3', text: 'Feast on Arabian barbecue under the night sky stars', completed: false, xpReward: 50, goldReward: 25, category: 'food' }
        ]
      }
    ],
    foodSuggestions: [
      { name: 'Shawarma Wrap', description: 'Spiced roasted meat wrapped in soft flatbread with garlic sauce.', cost: 4 },
      { name: 'Luqaimat', description: 'Sweet, crunchy deep-fried dumpling balls drizzled with date syrup.', cost: 5 },
      { name: 'Camel Milk Ice Cream', description: 'Creamy, unique retro dessert made of locally sourced camel milk.', cost: 8 }
    ],
    hotelSuggestions: [
      { name: 'Burj Al Arab', rating: '⭐⭐⭐⭐⭐', costPerNight: 990, description: 'The only 7-star sail-shaped hotel. Ultimate golden luxury.' },
      { name: 'Rove Downtown Dubai', rating: '⭐⭐⭐', costPerNight: 75, description: 'Trendy, young and colorful, located right in the center.' },
      { name: 'Atlantis The Palm', rating: '⭐⭐⭐⭐⭐', costPerNight: 350, description: 'Gigantic resort on the artificial palm island with waterparks.' }
    ],
    flightSuggestions: [
      { code: 'EK-201', airline: 'Emirates', price: 920, duration: '14h 00m' },
      { code: 'FZ-712', airline: 'FlyDubai (Budget)', price: 540, duration: '14h 45m' }
    ],
    npcDialogues: {
      guide: 'Salam! I am Omar, a desert ranger. Keep hydrated, the sun boss hits hard here!',
      chef: 'Welcome! Savor my charcoal roasted kababs. They restore full health points!',
      innkeeper: 'Enjoy the climate control in our towers. Outside is a furnace, inside is winter.',
      driver: 'Hold tight! We will slide down the dune walls like a roller coaster.'
    }
  }
};

export const CHARACTER_CLASSES = [
  { id: 'explorer', name: 'Explorer', description: 'Bonus XP (+15%) on finding new locations.', emoji: '🤠', perk: '+15% XP Gain' },
  { id: 'scholar', name: 'Scholar', description: 'Deeper lore from NPC guides and travel history.', emoji: '🧙', perk: 'NPC Memory Unlock' },
  { id: 'merchant', name: 'Merchant', description: 'Discount (10%) at all inns and cosmetic stores.', emoji: '💼', perk: '10% Discount on Gold' },
  { id: 'bard', name: 'Bard', description: 'Unlocks rare chiptune tracks and extra journal stamps.', emoji: '🪕', perk: 'Bonus Cosmetics' }
];

export const PETS = [
  { id: 'slime', name: 'Pixel Slime', emoji: '🟢', cost: 100, description: 'A bouncy green slime. Bounces when you move.' },
  { id: 'cat', name: 'Nyan Cat', emoji: '🐱', cost: 250, description: 'A pixel cat that trails stardust. Increases sound volume.' },
  { id: 'dragon', name: 'Mini Drake', emoji: '🐲', cost: 500, description: 'A tiny dragon. Breathes cute fire sparks.' }
];

export const BACKPACKS = [
  { id: 'basic', name: 'Canvas Sack', emoji: '🎒', cost: 0, capacity: 'Basic' },
  { id: 'leather', name: 'Ranger Pack', emoji: '💼', cost: 150, capacity: 'Extra Gear Slots' },
  { id: 'golden', name: 'Guildmaster Vault', emoji: '👑', cost: 400, capacity: 'Max Style' }
];

// Helper to generate dynamic itinerary using API or standard rule-based solver
export function generateItinerary(
  destination: string, 
  days: number, 
  budget: number, 
  style: string
): TravelDestination {
  const normalized = destination.toLowerCase().trim();
  let baseDest = DESTINATIONS[normalized];

  // Fallback if not matching preset: generate dynamic one!
  if (!baseDest) {
    const formattedDest = destination.charAt(0).toUpperCase() + destination.slice(1);
    baseDest = {
      id: normalized.replace(/\s+/g, '-'),
      name: formattedDest,
      kingdom: `${formattedDest} Kingdom 🗺️`,
      themeColor: 'from-emerald-400 to-teal-600',
      emoji: '🗺️',
      mapX: 200 + Math.random() * 200,
      mapY: 150 + Math.random() * 150,
      description: `A mysterious new land of ${style} adventure, unlocked by the Guild Master.`,
      currency: 'GOLD',
      goldRate: 1.0,
      weather: Math.random() > 0.5 ? 'Sunny' : 'Rainy',
      packingList: [
        { name: 'Passport', icon: '🎒', category: 'Essential', description: 'Essential portal token.' },
        { name: 'Travel Guide', icon: '📜', category: 'Gear', description: 'Helps navigate local kingdoms.' },
        { name: 'Water Canteen', icon: '🧪', category: 'Essential', description: 'Maintains stamina.' },
        { name: 'Gold Purse', icon: '👛', category: 'Currency', description: 'Holds your local tokens.' }
      ],
      itinerary: [],
      foodSuggestions: [
        { name: 'Local Specialty Platter', description: 'Assortment of traditional regional foods.', cost: 15 },
        { name: 'Tavern Drink', description: 'Brewed refreshment that increases speed.', cost: 5 }
      ],
      hotelSuggestions: [
        { name: 'Guild Tavern Inn', rating: '⭐⭐⭐', costPerNight: 50, description: 'Safe house for traveling guilds.' },
        { name: 'Grand Palace Lodge', rating: '⭐⭐⭐⭐⭐', costPerNight: 200, description: 'Luxury royal tower.' }
      ],
      flightSuggestions: [
        { code: 'PORTAL-1', airline: 'Portal Fast-Travel', price: 400, duration: '6h 00m' }
      ],
      npcDialogues: {
        guide: `Welcome to the newly mapped lands of ${formattedDest}! I will guide your adventure.`,
        chef: 'My stove is fired up! Ready to cook local dishes.',
        innkeeper: 'Beds are ready, traveler. Rest up to claim daily XP!',
        driver: 'Wherever your quest leads, my cart is ready.'
      }
    };

    // Synthesize days
    for (let d = 1; d <= days; d++) {
      baseDest.itinerary.push({
        dayNumber: d,
        title: `Quest of the ${style} Path`,
        theme: `Exploring Local Mysteries`,
        rewardClaimed: false,
        quests: [
          { id: `dyn_${d}_1`, text: `Establish base camp at ${formattedDest} center`, completed: false, xpReward: 50, goldReward: 20, category: 'sightseeing' },
          { id: `dyn_${d}_2`, text: `Sample local recipes at a tavern`, completed: false, xpReward: 40, goldReward: 15, category: 'food' },
          { id: `dyn_${d}_3`, text: `Complete day ${d} landmark exploration`, completed: false, xpReward: 60, goldReward: 25, category: 'sightseeing' }
        ]
      });
    }
  }

  // Adjust itinerary length if user requests specific days (up to bounds)
  const finalItinerary = baseDest.itinerary.slice(0, days);
  if (finalItinerary.length < days) {
    // add extra days
    for (let d = finalItinerary.length + 1; d <= days; d++) {
      finalItinerary.push({
        dayNumber: d,
        title: `Quest Day ${d}: Unexplored Frontiers`,
        theme: `Venture deep into the kingdom`,
        rewardClaimed: false,
        quests: [
          { id: `extra_${d}_1`, text: `Seek out the hidden landmark in ${baseDest.name}`, completed: false, xpReward: 50, goldReward: 20, category: 'sightseeing' },
          { id: `extra_${d}_2`, text: `Order regional snacks at a tavern`, completed: false, xpReward: 40, goldReward: 15, category: 'food' },
          { id: `extra_${d}_3`, text: `Check into local Inn and write in your journal`, completed: false, xpReward: 65, goldReward: 30, category: 'accommodation' }
        ]
      });
    }
  }

  return {
    ...baseDest,
    itinerary: finalItinerary
  };
}
