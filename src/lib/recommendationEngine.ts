import { menuItems, MenuItem, Allergen, FoodPreference, HungerLevel } from "@/data/menuData";

export interface UserPreferences {
  allergens: Allergen[];
  preference: FoodPreference;
  hungerLevel: HungerLevel;
}

export interface TableRecommendation {
  starters: MenuItem[];
  mains: MenuItem[];
  sides: MenuItem[];
  desserts: MenuItem[];
  drinks: MenuItem[];
  explanation: string;
}

function filterByAllergens(items: MenuItem[], allAllergens: Allergen[]): MenuItem[] {
  return items.filter((item) => !item.allergens.some((a) => allAllergens.includes(a)));
}

function scoreItem(item: MenuItem, users: UserPreferences[]): number {
  let score = 0;
  for (const user of users) {
    if (user.preference === "surprise") {
      score += 1;
    } else if (item.preference.includes(user.preference)) {
      score += 3;
    }
    if (item.shareable && users.length > 1) score += 2;
    if (item.tags?.some((t) => ["Chef's Pick", "Popular", "Must Try"].includes(t))) score += 1;
  }
  return score;
}

function getQuantityMultiplier(users: UserPreferences[]): { starters: number; mains: number; sides: number } {
  const n = users.length;
  const avgHunger = users.reduce((sum, u) => {
    const h = { light: 0.7, normal: 1, hungry: 1.4, sharing: 1.2 };
    return sum + h[u.hungerLevel];
  }, 0) / n;

  return {
    starters: Math.max(1, Math.round(n * 0.7 * avgHunger)),
    mains: Math.max(1, Math.round(n * avgHunger)),
    sides: Math.max(0, Math.round((n - 1) * 0.5 * avgHunger)),
  };
}

export function generateRecommendations(users: UserPreferences[]): TableRecommendation {
  const allAllergens = [...new Set(users.flatMap((u) => u.allergens))];
  const safe = filterByAllergens(menuItems, allAllergens);

  const scored = safe.map((item) => ({ item, score: scoreItem(item, users) }))
    .sort((a, b) => b.score - a.score);

  const qty = getQuantityMultiplier(users);

  const pick = (type: string, count: number) =>
    scored.filter((s) => s.item.type === type).slice(0, count).map((s) => s.item);

  const starters = pick("starter", qty.starters);
  const mains = pick("main", qty.mains);
  const sides = pick("side", qty.sides);
  const desserts = pick("dessert", 1);
  const drinks = pick("drink", Math.min(users.length, 2));

  const prefLabels = [...new Set(users.map((u) => u.preference))].filter((p) => p !== "surprise");
  const prefText = prefLabels.length > 0 ? prefLabels.join(" & ") + " preferences" : "varied tastes";
  const shareText = users.length > 1 ? ` and ${users.length} guests sharing the table` : "";

  return {
    starters,
    mains,
    sides,
    desserts,
    drinks,
    explanation: `Based on ${prefText}${shareText}. ${allAllergens.length > 0 ? `Excluded items containing ${allAllergens.join(", ")}.` : "No allergen restrictions applied."}`,
  };
}
