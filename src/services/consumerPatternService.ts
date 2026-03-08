// ═══════════════════════════════════════════════════════════════
// .bite — Consumer Pattern Engine
// Learns pairing relations from completed orders (no manual metadata)
// ═══════════════════════════════════════════════════════════════

import { menuItems, type MenuItem } from "@/data/menuData";

/** A co-occurrence record: how often two items appear in the same order */
export interface PairingRelation {
  itemA: string; // dishId
  itemB: string; // dishId
  count: number;
}

/** Aggregated user preference profile built from order history */
export interface UserPatternProfile {
  userId: string;
  topCategories: { category: string; count: number }[];
  topTypes: { type: string; count: number }[];
  topPreferences: { preference: string; count: number }[];
  frequentPairings: { dishName: string; pairedWith: string; count: number }[];
  averageSpend: number;
  totalOrders: number;
}

/** Category-level pairing insight for analytics */
export interface CategoryPairing {
  fromCategory: string;
  toCategory: string;
  percentage: number;
  count: number;
}

// ── In-memory store (simulated backend) ──────────────────────

interface OrderRecord {
  orderId: string;
  userId: string;
  items: { dishId: string; name: string; category: string; type: string; preference: string[] }[];
  total: number;
  timestamp: string;
}

const orderHistory: OrderRecord[] = [
  // Seed with mock historical data
  {
    orderId: "hist-001", userId: "user-1",
    items: [
      { dishId: "1", name: "Smash Burger Deluxe", category: "popular", type: "main", preference: ["meat"] },
      { dishId: "32", name: "Truffle Fries", category: "starters", type: "side", preference: ["meat", "fish", "vegetarian"] },
      { dishId: "10", name: "Smoky Old Fashioned", category: "drinks", type: "drink", preference: ["meat", "fish", "vegetarian", "vegan"] },
    ],
    total: 43.50, timestamp: new Date(Date.now() - 7 * 86400000).toISOString(),
  },
  {
    orderId: "hist-002", userId: "user-1",
    items: [
      { dishId: "19", name: "Grilled Ribeye", category: "mains", type: "main", preference: ["meat"] },
      { dishId: "28", name: "Beef Carpaccio", category: "starters", type: "starter", preference: ["meat"] },
      { dishId: "10", name: "Smoky Old Fashioned", category: "drinks", type: "drink", preference: ["meat", "fish", "vegetarian", "vegan"] },
      { dishId: "5", name: "Molten Lava Cake", category: "desserts", type: "dessert", preference: ["meat", "fish", "vegetarian"] },
    ],
    total: 82.00, timestamp: new Date(Date.now() - 3 * 86400000).toISOString(),
  },
  {
    orderId: "hist-003", userId: "user-1",
    items: [
      { dishId: "12", name: "Wagyu Tagliatelle", category: "mains", type: "main", preference: ["meat"] },
      { dishId: "10", name: "Smoky Old Fashioned", category: "drinks", type: "drink", preference: ["meat", "fish", "vegetarian", "vegan"] },
    ],
    total: 43.00, timestamp: new Date(Date.now() - 1 * 86400000).toISOString(),
  },
  {
    orderId: "hist-004", userId: "user-2",
    items: [
      { dishId: "2", name: "Truffle Spaghetti", category: "mains", type: "main", preference: ["vegetarian"] },
      { dishId: "13", name: "Burrata Salad", category: "starters", type: "starter", preference: ["vegetarian"] },
      { dishId: "6", name: "Sunset Spritz", category: "drinks", type: "drink", preference: ["meat", "fish", "vegetarian", "vegan"] },
    ],
    total: 55.00, timestamp: new Date(Date.now() - 5 * 86400000).toISOString(),
  },
  {
    orderId: "hist-005", userId: "user-2",
    items: [
      { dishId: "16", name: "Truffle Risotto", category: "mains", type: "main", preference: ["vegetarian"] },
      { dishId: "6", name: "Sunset Spritz", category: "drinks", type: "drink", preference: ["meat", "fish", "vegetarian", "vegan"] },
      { dishId: "9", name: "Tiramisu Classico", category: "desserts", type: "dessert", preference: ["meat", "fish", "vegetarian"] },
    ],
    total: 51.00, timestamp: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    orderId: "hist-006", userId: "user-3",
    items: [
      { dishId: "3", name: "Dragon Roll Platter", category: "popular", type: "main", preference: ["fish"] },
      { dishId: "11", name: "Tuna Tartare", category: "starters", type: "starter", preference: ["fish"] },
      { dishId: "38", name: "Yuzu Lemonade", category: "drinks", type: "drink", preference: ["meat", "fish", "vegetarian", "vegan"] },
    ],
    total: 47.00, timestamp: new Date(Date.now() - 4 * 86400000).toISOString(),
  },
  {
    orderId: "hist-007", userId: "user-4",
    items: [
      { dishId: "19", name: "Grilled Ribeye", category: "mains", type: "main", preference: ["meat"] },
      { dishId: "32", name: "Truffle Fries", category: "starters", type: "side", preference: ["meat", "fish", "vegetarian"] },
      { dishId: "40", name: "Espresso Martini", category: "drinks", type: "drink", preference: ["meat", "fish", "vegetarian", "vegan"] },
      { dishId: "37", name: "Churros con Chocolate", category: "desserts", type: "dessert", preference: ["meat", "fish", "vegetarian"] },
    ],
    total: 101.00, timestamp: new Date(Date.now() - 6 * 86400000).toISOString(),
  },
  {
    orderId: "hist-008", userId: "user-4",
    items: [
      { dishId: "25", name: "Pepperoni Diavola", category: "pizza", type: "main", preference: ["meat"] },
      { dishId: "40", name: "Espresso Martini", category: "drinks", type: "drink", preference: ["meat", "fish", "vegetarian", "vegan"] },
    ],
    total: 32.00, timestamp: new Date(Date.now() - 1 * 86400000).toISOString(),
  },
];

const dishLookup = new Map(menuItems.map((m) => [m.id, m]));

function getDish(id: string): MenuItem | undefined {
  return dishLookup.get(id);
}

export const consumerPatternService = {
  /** Record a completed order into the pattern engine */
  recordOrder(orderId: string, userId: string, items: { dishId: string; name: string }[], total: number) {
    const enriched = items.map((i) => {
      const dish = getDish(i.dishId);
      return {
        dishId: i.dishId,
        name: i.name,
        category: dish?.category ?? "unknown",
        type: dish?.type ?? "main",
        preference: dish?.preference ?? [],
      };
    });
    orderHistory.push({
      orderId, userId, items: enriched, total,
      timestamp: new Date().toISOString(),
    });
  },

  /** Get a user's learned preference profile */
  getUserProfile(userId: string): UserPatternProfile | null {
    const userOrders = orderHistory.filter((o) => o.userId === userId);
    if (userOrders.length === 0) return null;

    const catCounts: Record<string, number> = {};
    const typeCounts: Record<string, number> = {};
    const prefCounts: Record<string, number> = {};
    const pairMap: Record<string, number> = {};

    for (const order of userOrders) {
      for (const item of order.items) {
        catCounts[item.category] = (catCounts[item.category] || 0) + 1;
        typeCounts[item.type] = (typeCounts[item.type] || 0) + 1;
        for (const p of item.preference) {
          prefCounts[p] = (prefCounts[p] || 0) + 1;
        }
      }
      // Co-occurrence within same order
      for (let i = 0; i < order.items.length; i++) {
        for (let j = i + 1; j < order.items.length; j++) {
          const key = [order.items[i].name, order.items[j].name].sort().join(" ↔ ");
          pairMap[key] = (pairMap[key] || 0) + 1;
        }
      }
    }

    const toSorted = (obj: Record<string, number>) =>
      Object.entries(obj).sort((a, b) => b[1] - a[1]).map(([k, v]) => ({ [Object.keys({ category: k, type: k, preference: k })[0]]: k, count: v }));

    const topPairings = Object.entries(pairMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([key, count]) => {
        const [a, b] = key.split(" ↔ ");
        return { dishName: a, pairedWith: b, count };
      });

    return {
      userId,
      topCategories: Object.entries(catCounts).sort((a, b) => b[1] - a[1]).map(([category, count]) => ({ category, count })),
      topTypes: Object.entries(typeCounts).sort((a, b) => b[1] - a[1]).map(([type, count]) => ({ type, count })),
      topPreferences: Object.entries(prefCounts).sort((a, b) => b[1] - a[1]).map(([preference, count]) => ({ preference, count })),
      frequentPairings: topPairings,
      averageSpend: userOrders.reduce((s, o) => s + o.total, 0) / userOrders.length,
      totalOrders: userOrders.length,
    };
  },

  /** Get category-level pairing correlations across all users (for analytics) */
  getCategoryPairings(): CategoryPairing[] {
    const pairCounts: Record<string, number> = {};
    const fromCounts: Record<string, number> = {};

    for (const order of orderHistory) {
      const cats = [...new Set(order.items.map((i) => i.category))];
      for (let i = 0; i < cats.length; i++) {
        fromCounts[cats[i]] = (fromCounts[cats[i]] || 0) + 1;
        for (let j = 0; j < cats.length; j++) {
          if (i !== j) {
            const key = `${cats[i]}→${cats[j]}`;
            pairCounts[key] = (pairCounts[key] || 0) + 1;
          }
        }
      }
    }

    return Object.entries(pairCounts)
      .map(([key, count]) => {
        const [from, to] = key.split("→");
        return {
          fromCategory: from,
          toCategory: to,
          percentage: Math.round((count / (fromCounts[from] || 1)) * 100),
          count,
        };
      })
      .sort((a, b) => b.count - a.count);
  },

  /** Get smart suggestions for a dish based on co-occurrence patterns */
  getSuggestionsForDish(dishId: string, limit = 3): { dish: MenuItem; score: number }[] {
    const coOccurrence: Record<string, number> = {};

    for (const order of orderHistory) {
      const ids = order.items.map((i) => i.dishId);
      if (!ids.includes(dishId)) continue;
      for (const id of ids) {
        if (id !== dishId) {
          coOccurrence[id] = (coOccurrence[id] || 0) + 1;
        }
      }
    }

    return Object.entries(coOccurrence)
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([id, score]) => ({ dish: getDish(id)!, score }))
      .filter((s) => s.dish);
  },

  /** Get all order history (for analytics) */
  getAllOrders(): OrderRecord[] {
    return [...orderHistory];
  },
};
