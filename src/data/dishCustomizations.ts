/**
 * Per-dish customisation options: removable ingredients, paid extras, and cooking points.
 * Keyed by MenuItem.id.
 */

export interface IngredientOption {
  name: string;
  /** true = included by default and can be removed */
  default: boolean;
  /** Extra cost when added (0 for default ingredients) */
  extraCost: number;
}

export interface CookingPoint {
  label: string;
  description: string;
  /** Price delta vs. base (usually 0) */
  delta: number;
}

export interface DishCustomisation {
  ingredients: IngredientOption[];
  cookingPoints?: CookingPoint[];
}

export const dishCustomisations: Record<string, DishCustomisation> = {
  // Smash Burger Deluxe
  "1": {
    ingredients: [
      { name: "Aged Cheddar", default: true, extraCost: 0 },
      { name: "House Sauce", default: true, extraCost: 0 },
      { name: "Brioche Bun", default: true, extraCost: 0 },
      { name: "Lettuce", default: true, extraCost: 0 },
      { name: "Tomato", default: true, extraCost: 0 },
      { name: "Pickles", default: true, extraCost: 0 },
      { name: "Extra Patty", default: false, extraCost: 4.00 },
      { name: "Bacon", default: false, extraCost: 2.50 },
      { name: "Jalapeños", default: false, extraCost: 1.00 },
      { name: "Avocado", default: false, extraCost: 2.00 },
    ],
    cookingPoints: [
      { label: "Rare", description: "Cool red centre", delta: 0 },
      { label: "Medium Rare", description: "Warm red centre", delta: 0 },
      { label: "Medium", description: "Hot pink centre", delta: 0 },
      { label: "Well Done", description: "Cooked through", delta: 0 },
    ],
  },
  // Truffle Spaghetti
  "2": {
    ingredients: [
      { name: "Black Truffle", default: true, extraCost: 0 },
      { name: "Parmesan Cream", default: true, extraCost: 0 },
      { name: "Fresh Basil", default: true, extraCost: 0 },
      { name: "Extra Truffle", default: false, extraCost: 5.00 },
      { name: "Grilled Chicken", default: false, extraCost: 3.50 },
      { name: "Chilli Flakes", default: false, extraCost: 0.50 },
    ],
  },
  // Dragon Roll Platter
  "3": {
    ingredients: [
      { name: "Salmon", default: true, extraCost: 0 },
      { name: "Tuna", default: true, extraCost: 0 },
      { name: "Avocado", default: true, extraCost: 0 },
      { name: "Wasabi Aioli", default: true, extraCost: 0 },
      { name: "Extra Salmon", default: false, extraCost: 3.00 },
      { name: "Spicy Mayo", default: false, extraCost: 0.50 },
    ],
  },
  // Margherita DOP
  "4": {
    ingredients: [
      { name: "Buffalo Mozzarella", default: true, extraCost: 0 },
      { name: "San Marzano Tomato", default: true, extraCost: 0 },
      { name: "Fresh Basil", default: true, extraCost: 0 },
      { name: "Extra Mozzarella", default: false, extraCost: 2.00 },
      { name: "Prosciutto", default: false, extraCost: 3.00 },
      { name: "Rocket", default: false, extraCost: 1.00 },
      { name: "Chilli Oil", default: false, extraCost: 0.50 },
    ],
  },
  // Grilled Ribeye
  "19": {
    ingredients: [
      { name: "Chimichurri", default: true, extraCost: 0 },
      { name: "Garlic Butter", default: true, extraCost: 0 },
      { name: "Charred Lemon", default: true, extraCost: 0 },
      { name: "Truffle Butter", default: false, extraCost: 3.00 },
      { name: "Peppercorn Sauce", default: false, extraCost: 2.50 },
      { name: "Grilled Onions", default: false, extraCost: 1.50 },
    ],
    cookingPoints: [
      { label: "Blue", description: "Seared outside, raw inside", delta: 0 },
      { label: "Rare", description: "Cool red centre", delta: 0 },
      { label: "Medium Rare", description: "Warm red centre", delta: 0 },
      { label: "Medium", description: "Hot pink centre", delta: 0 },
      { label: "Medium Well", description: "Slightly pink", delta: 0 },
      { label: "Well Done", description: "Cooked through", delta: 0 },
    ],
  },
  // Miso Glazed Salmon
  "20": {
    ingredients: [
      { name: "White Miso Glaze", default: true, extraCost: 0 },
      { name: "Bok Choy", default: true, extraCost: 0 },
      { name: "Sesame Rice", default: true, extraCost: 0 },
      { name: "Extra Glaze", default: false, extraCost: 1.00 },
      { name: "Edamame", default: false, extraCost: 2.00 },
    ],
  },
  // Caesar Royale
  "7": {
    ingredients: [
      { name: "Grilled Chicken", default: true, extraCost: 0 },
      { name: "Aged Parmesan", default: true, extraCost: 0 },
      { name: "Sourdough Croutons", default: true, extraCost: 0 },
      { name: "Baby Gem", default: true, extraCost: 0 },
      { name: "Anchovies", default: false, extraCost: 1.50 },
      { name: "Extra Chicken", default: false, extraCost: 3.00 },
      { name: "Bacon Bits", default: false, extraCost: 2.00 },
    ],
  },
  // Quattro Formaggi
  "8": {
    ingredients: [
      { name: "Gorgonzola", default: true, extraCost: 0 },
      { name: "Taleggio", default: true, extraCost: 0 },
      { name: "Fontina", default: true, extraCost: 0 },
      { name: "Parmesan", default: true, extraCost: 0 },
      { name: "Honey Drizzle", default: true, extraCost: 0 },
      { name: "Truffle Oil", default: false, extraCost: 2.00 },
      { name: "Walnuts", default: false, extraCost: 1.50 },
    ],
  },
  // Pepperoni Diavola
  "25": {
    ingredients: [
      { name: "Spicy Salami", default: true, extraCost: 0 },
      { name: "Fresh Chilli", default: true, extraCost: 0 },
      { name: "Mozzarella", default: true, extraCost: 0 },
      { name: "Garlic Oil", default: true, extraCost: 0 },
      { name: "Extra Pepperoni", default: false, extraCost: 2.50 },
      { name: "Olives", default: false, extraCost: 1.00 },
      { name: "Rocket", default: false, extraCost: 1.00 },
    ],
  },
  // Wagyu Tagliatelle
  "12": {
    ingredients: [
      { name: "Wagyu Ragu", default: true, extraCost: 0 },
      { name: "Hand-cut Pasta", default: true, extraCost: 0 },
      { name: "Pecorino", default: true, extraCost: 0 },
      { name: "Extra Ragu", default: false, extraCost: 4.00 },
      { name: "Truffle Shavings", default: false, extraCost: 5.00 },
    ],
  },
  // Molten Lava Cake
  "5": {
    ingredients: [
      { name: "Gold Leaf", default: true, extraCost: 0 },
      { name: "Berry Coulis", default: true, extraCost: 0 },
      { name: "Vanilla Gelato", default: true, extraCost: 0 },
      { name: "Extra Gelato Scoop", default: false, extraCost: 2.00 },
      { name: "Whipped Cream", default: false, extraCost: 1.00 },
    ],
  },
};
