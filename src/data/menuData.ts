import foodPasta from "@/assets/food-pasta.jpg";
import foodSushi from "@/assets/food-sushi.jpg";
import foodPizza from "@/assets/food-pizza.jpg";
import foodDessert from "@/assets/food-dessert.jpg";
import foodDrinks from "@/assets/food-drinks.jpg";
import foodSalad from "@/assets/food-salad.jpg";
import heroFood from "@/assets/hero-food.jpg";

export type Allergen = "gluten" | "dairy" | "nuts" | "eggs" | "soy" | "seafood" | "sesame";
export type DietaryTag = "vegan" | "vegetarian" | "gluten-free" | "nut-free";
export type FoodPreference = "meat" | "fish" | "vegetarian" | "vegan" | "surprise";
export type HungerLevel = "light" | "normal" | "hungry" | "sharing";

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  tags?: string[];
  allergens: Allergen[];
  dietaryTags: DietaryTag[];
  shareable: boolean;
  type: "starter" | "main" | "side" | "dessert" | "drink";
  preference: FoodPreference[];
}

export const categories = [
  { id: "popular", label: "🔥 Popular" },
  { id: "starters", label: "Starters" },
  { id: "mains", label: "Mains" },
  { id: "pizza", label: "Pizza" },
  { id: "desserts", label: "Desserts" },
  { id: "drinks", label: "Drinks" },
];

export const allergenLabels: Record<Allergen, string> = {
  gluten: "Gluten",
  dairy: "Dairy",
  nuts: "Nuts",
  eggs: "Eggs",
  soy: "Soy",
  seafood: "Seafood",
  sesame: "Sesame",
};

export const dietaryTagLabels: Record<DietaryTag, string> = {
  vegan: "Vegan",
  vegetarian: "Vegetarian",
  "gluten-free": "GF",
  "nut-free": "Nut Free",
};

export const menuItems: MenuItem[] = [
  {
    id: "1", name: "Smash Burger Deluxe",
    description: "Double smashed patty, aged cheddar, house sauce, brioche bun",
    price: 18.50, image: heroFood, category: "popular", tags: ["Chef's Pick"],
    allergens: ["gluten", "dairy", "eggs", "sesame"], dietaryTags: [], shareable: false,
    type: "main", preference: ["meat"],
  },
  {
    id: "2", name: "Truffle Spaghetti",
    description: "Hand-rolled pasta, black truffle, parmesan cream, fresh basil",
    price: 24.00, image: foodPasta, category: "mains", tags: ["Popular"],
    allergens: ["gluten", "dairy", "eggs"], dietaryTags: ["vegetarian"], shareable: false,
    type: "main", preference: ["vegetarian"],
  },
  {
    id: "3", name: "Dragon Roll Platter",
    description: "8-piece signature roll with salmon, tuna & avocado, wasabi aioli",
    price: 22.00, image: foodSushi, category: "popular", tags: ["New"],
    allergens: ["seafood", "soy", "sesame"], dietaryTags: [], shareable: true,
    type: "main", preference: ["fish"],
  },
  {
    id: "4", name: "Margherita DOP",
    description: "San Marzano tomato, buffalo mozzarella, fresh basil, wood-fired",
    price: 16.00, image: foodPizza, category: "pizza",
    allergens: ["gluten", "dairy"], dietaryTags: ["vegetarian", "nut-free"], shareable: true,
    type: "main", preference: ["vegetarian"],
  },
  {
    id: "5", name: "Molten Lava Cake",
    description: "Dark chocolate fondant, gold leaf, berry coulis, vanilla gelato",
    price: 14.00, image: foodDessert, category: "desserts", tags: ["Must Try"],
    allergens: ["gluten", "dairy", "eggs"], dietaryTags: [], shareable: false,
    type: "dessert", preference: ["meat", "fish", "vegetarian"],
  },
  {
    id: "6", name: "Sunset Spritz",
    description: "Aperol, prosecco, blood orange, soda, served over crystal ice",
    price: 13.00, image: foodDrinks, category: "drinks",
    allergens: [], dietaryTags: ["vegan", "gluten-free", "nut-free"], shareable: false,
    type: "drink", preference: ["meat", "fish", "vegetarian", "vegan"],
  },
  {
    id: "7", name: "Caesar Royale",
    description: "Baby gem, grilled chicken, aged parmesan, sourdough croutons",
    price: 15.00, image: foodSalad, category: "starters",
    allergens: ["gluten", "dairy", "eggs"], dietaryTags: [], shareable: true,
    type: "starter", preference: ["meat"],
  },
  {
    id: "8", name: "Quattro Formaggi",
    description: "Gorgonzola, taleggio, fontina, parmesan, honey drizzle",
    price: 19.00, image: foodPizza, category: "pizza",
    allergens: ["gluten", "dairy"], dietaryTags: ["vegetarian", "nut-free"], shareable: true,
    type: "main", preference: ["vegetarian"],
  },
  {
    id: "9", name: "Tiramisu Classico",
    description: "Mascarpone cream, espresso-soaked savoiardi, cocoa dust",
    price: 12.00, image: foodDessert, category: "desserts",
    allergens: ["gluten", "dairy", "eggs"], dietaryTags: ["vegetarian"], shareable: false,
    type: "dessert", preference: ["meat", "fish", "vegetarian"],
  },
  {
    id: "10", name: "Smoky Old Fashioned",
    description: "Bourbon, demerara, angostura, smoked rosemary sprig",
    price: 15.00, image: foodDrinks, category: "drinks",
    allergens: [], dietaryTags: ["vegan", "gluten-free", "nut-free"], shareable: false,
    type: "drink", preference: ["meat", "fish", "vegetarian", "vegan"],
  },
  {
    id: "11", name: "Tuna Tartare",
    description: "Yellowfin tuna, avocado, sesame, crispy wonton chips",
    price: 17.00, image: foodSushi, category: "starters", tags: ["Popular"],
    allergens: ["seafood", "soy", "sesame", "gluten"], dietaryTags: [], shareable: true,
    type: "starter", preference: ["fish"],
  },
  {
    id: "12", name: "Wagyu Tagliatelle",
    description: "Slow-braised wagyu ragu, hand-cut pasta, pecorino",
    price: 28.00, image: foodPasta, category: "mains", tags: ["Premium"],
    allergens: ["gluten", "dairy"], dietaryTags: [], shareable: false,
    type: "main", preference: ["meat"],
  },
  // New items for better variety
  {
    id: "13", name: "Burrata Salad",
    description: "Creamy burrata, heirloom tomatoes, basil oil, aged balsamic",
    price: 16.00, image: foodSalad, category: "starters",
    allergens: ["dairy"], dietaryTags: ["vegetarian", "gluten-free", "nut-free"], shareable: true,
    type: "starter", preference: ["vegetarian"],
  },
  {
    id: "14", name: "Veggie Gyozas",
    description: "Shiitake, cabbage, ginger, ponzu dipping sauce",
    price: 13.00, image: foodSushi, category: "starters",
    allergens: ["gluten", "soy"], dietaryTags: ["vegan", "nut-free"], shareable: true,
    type: "starter", preference: ["vegan", "vegetarian"],
  },
  {
    id: "15", name: "Grilled Vegetables",
    description: "Seasonal vegetables, herb oil, smoked salt, balsamic glaze",
    price: 14.00, image: foodSalad, category: "mains",
    allergens: [], dietaryTags: ["vegan", "gluten-free", "nut-free"], shareable: true,
    type: "side", preference: ["vegan", "vegetarian"],
  },
  {
    id: "16", name: "Truffle Risotto",
    description: "Carnaroli rice, black truffle, aged parmesan, truffle oil",
    price: 26.00, image: foodPasta, category: "mains",
    allergens: ["dairy"], dietaryTags: ["vegetarian", "gluten-free", "nut-free"], shareable: false,
    type: "main", preference: ["vegetarian"],
  },
  {
    id: "17", name: "Edamame & Sea Salt",
    description: "Steamed edamame, Maldon sea salt, chili flakes",
    price: 8.00, image: foodSalad, category: "starters",
    allergens: ["soy"], dietaryTags: ["vegan", "gluten-free", "nut-free"], shareable: true,
    type: "starter", preference: ["vegan", "vegetarian", "fish", "meat"],
  },
  {
    id: "18", name: "Açaí Bowl",
    description: "Açaí blend, granola, fresh berries, coconut flakes, honey",
    price: 13.00, image: foodDessert, category: "desserts",
    allergens: ["nuts"], dietaryTags: ["vegetarian", "gluten-free"], shareable: false,
    type: "dessert", preference: ["vegetarian", "fish"],
  },
];
