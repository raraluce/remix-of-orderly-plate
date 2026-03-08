import foodPasta from "@/assets/food-pasta.jpg";
import foodSushi from "@/assets/food-sushi.jpg";
import foodPizza from "@/assets/food-pizza.jpg";
import foodDessert from "@/assets/food-dessert.jpg";
import foodDrinks from "@/assets/food-drinks.jpg";
import foodSalad from "@/assets/food-salad.jpg";
import heroFood from "@/assets/hero-food.jpg";

export type Allergen = "gluten" | "crustaceans" | "eggs" | "fish" | "peanuts" | "soy" | "dairy" | "nuts" | "celery" | "mustard" | "sesame" | "sulphites" | "molluscs" | "lupin";
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
  crustaceans: "Crustaceans",
  eggs: "Eggs",
  fish: "Fish",
  peanuts: "Peanuts",
  soy: "Soy",
  dairy: "Dairy",
  nuts: "Tree Nuts",
  celery: "Celery",
  mustard: "Mustard",
  sesame: "Sesame",
  sulphites: "Sulphites",
  molluscs: "Molluscs",
  lupin: "Lupin",
};

export const dietaryTagLabels: Record<DietaryTag, string> = {
  vegan: "Vegan",
  vegetarian: "Vegetarian",
  "gluten-free": "GF",
  "nut-free": "Nut Free",
};

export const menuItems: MenuItem[] = [
  // ── POPULAR / MAINS ─────────────────────────────────────────
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
    allergens: ["fish", "soy", "sesame"], dietaryTags: [], shareable: true,
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
    id: "8", name: "Quattro Formaggi",
    description: "Gorgonzola, taleggio, fontina, parmesan, honey drizzle",
    price: 19.00, image: foodPizza, category: "pizza",
    allergens: ["gluten", "dairy"], dietaryTags: ["vegetarian", "nut-free"], shareable: true,
    type: "main", preference: ["vegetarian"],
  },
  {
    id: "12", name: "Wagyu Tagliatelle",
    description: "Slow-braised wagyu ragu, hand-cut pasta, pecorino",
    price: 28.00, image: foodPasta, category: "mains", tags: ["Premium"],
    allergens: ["gluten", "dairy"], dietaryTags: [], shareable: false,
    type: "main", preference: ["meat"],
  },
  {
    id: "16", name: "Truffle Risotto",
    description: "Carnaroli rice, black truffle, aged parmesan, truffle oil",
    price: 26.00, image: foodPasta, category: "mains",
    allergens: ["dairy"], dietaryTags: ["vegetarian", "gluten-free", "nut-free"], shareable: false,
    type: "main", preference: ["vegetarian"],
  },
  {
    id: "19", name: "Grilled Ribeye",
    description: "12oz prime ribeye, chimichurri, roasted garlic butter, charred lemon",
    price: 36.00, image: heroFood, category: "mains", tags: ["Popular"],
    allergens: ["dairy"], dietaryTags: ["gluten-free", "nut-free"], shareable: false,
    type: "main", preference: ["meat"],
  },
  {
    id: "20", name: "Miso Glazed Salmon",
    description: "Atlantic salmon, white miso glaze, bok choy, sesame rice",
    price: 27.00, image: foodSushi, category: "mains", tags: ["Chef's Pick"],
    allergens: ["fish", "soy", "sesame"], dietaryTags: ["nut-free"], shareable: false,
    type: "main", preference: ["fish"],
  },
  {
    id: "21", name: "Lamb Kofta Bowl",
    description: "Spiced lamb kofta, saffron rice, tzatziki, pickled red onion",
    price: 23.00, image: heroFood, category: "mains",
    allergens: ["dairy"], dietaryTags: ["gluten-free", "nut-free"], shareable: false,
    type: "main", preference: ["meat"],
  },
  {
    id: "22", name: "Prawn Linguine",
    description: "Tiger prawns, cherry tomato, chilli, garlic, white wine sauce",
    price: 25.00, image: foodPasta, category: "mains",
    allergens: ["gluten", "crustaceans"], dietaryTags: ["nut-free"], shareable: false,
    type: "main", preference: ["fish"],
  },
  {
    id: "23", name: "Mushroom & Walnut Bolognese",
    description: "Porcini & walnut ragu, pappardelle, nutritional yeast",
    price: 19.00, image: foodPasta, category: "mains",
    allergens: ["gluten", "nuts"], dietaryTags: ["vegan"], shareable: false,
    type: "main", preference: ["vegan"],
  },
  {
    id: "24", name: "BBQ Jackfruit Tacos",
    description: "Pulled jackfruit, smoky BBQ, avocado crema, corn tortillas",
    price: 15.00, image: foodSalad, category: "mains", tags: ["New"],
    allergens: [], dietaryTags: ["vegan", "gluten-free", "nut-free"], shareable: true,
    type: "main", preference: ["vegan"],
  },
  {
    id: "25", name: "Pepperoni Diavola",
    description: "Spicy salami, fresh chilli, mozzarella, roasted garlic oil",
    price: 18.00, image: foodPizza, category: "pizza",
    allergens: ["gluten", "dairy"], dietaryTags: ["nut-free"], shareable: true,
    type: "main", preference: ["meat"],
  },
  {
    id: "26", name: "Sea Bass Ceviche Bowl",
    description: "Fresh sea bass, tiger's milk, sweet potato, corn, avocado",
    price: 21.00, image: foodSushi, category: "mains",
    allergens: ["fish"], dietaryTags: ["gluten-free", "nut-free"], shareable: false,
    type: "main", preference: ["fish"],
  },

  // ── STARTERS ─────────────────────────────────────────────────
  {
    id: "7", name: "Caesar Royale",
    description: "Baby gem, grilled chicken, aged parmesan, sourdough croutons",
    price: 15.00, image: foodSalad, category: "starters",
    allergens: ["gluten", "dairy", "eggs"], dietaryTags: [], shareable: true,
    type: "starter", preference: ["meat"],
  },
  {
    id: "11", name: "Tuna Tartare",
    description: "Yellowfin tuna, avocado, sesame, crispy wonton chips",
    price: 17.00, image: foodSushi, category: "starters", tags: ["Popular"],
    allergens: ["fish", "soy", "sesame", "gluten"], dietaryTags: [], shareable: true,
    type: "starter", preference: ["fish"],
  },
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
    id: "17", name: "Edamame & Sea Salt",
    description: "Steamed edamame, Maldon sea salt, chili flakes",
    price: 8.00, image: foodSalad, category: "starters",
    allergens: ["soy"], dietaryTags: ["vegan", "gluten-free", "nut-free"], shareable: true,
    type: "starter", preference: ["vegan", "vegetarian", "fish", "meat"],
  },
  {
    id: "27", name: "Crispy Calamari",
    description: "Lightly battered squid, lemon aioli, rocket salad",
    price: 14.00, image: foodSushi, category: "starters", tags: ["Popular"],
    allergens: ["gluten", "seafood", "eggs"], dietaryTags: [], shareable: true,
    type: "starter", preference: ["fish"],
  },
  {
    id: "28", name: "Beef Carpaccio",
    description: "Thinly sliced raw beef, capers, rocket, parmesan shavings",
    price: 17.00, image: heroFood, category: "starters",
    allergens: ["dairy"], dietaryTags: ["gluten-free", "nut-free"], shareable: true,
    type: "starter", preference: ["meat"],
  },
  {
    id: "29", name: "Roasted Beetroot Hummus",
    description: "Beetroot hummus, toasted seeds, warm flatbread, olive oil",
    price: 11.00, image: foodSalad, category: "starters",
    allergens: ["gluten", "sesame"], dietaryTags: ["vegan"], shareable: true,
    type: "starter", preference: ["vegan", "vegetarian"],
  },
  {
    id: "30", name: "Prawn Cocktail",
    description: "Atlantic prawns, Marie Rose sauce, baby gem, lemon wedge",
    price: 15.00, image: foodSushi, category: "starters",
    allergens: ["seafood", "eggs"], dietaryTags: ["gluten-free", "nut-free"], shareable: false,
    type: "starter", preference: ["fish"],
  },
  {
    id: "31", name: "Padron Peppers",
    description: "Blistered padron peppers, flaky sea salt, smoked paprika",
    price: 9.00, image: foodSalad, category: "starters", tags: ["Must Try"],
    allergens: [], dietaryTags: ["vegan", "gluten-free", "nut-free"], shareable: true,
    type: "starter", preference: ["vegan", "vegetarian", "fish", "meat"],
  },

  // ── SIDES ────────────────────────────────────────────────────
  {
    id: "15", name: "Grilled Vegetables",
    description: "Seasonal vegetables, herb oil, smoked salt, balsamic glaze",
    price: 14.00, image: foodSalad, category: "mains",
    allergens: [], dietaryTags: ["vegan", "gluten-free", "nut-free"], shareable: true,
    type: "side", preference: ["vegan", "vegetarian"],
  },
  {
    id: "32", name: "Truffle Fries",
    description: "Hand-cut fries, truffle oil, parmesan, rosemary salt",
    price: 10.00, image: foodPizza, category: "starters", tags: ["Popular"],
    allergens: ["dairy"], dietaryTags: ["vegetarian", "gluten-free", "nut-free"], shareable: true,
    type: "side", preference: ["meat", "fish", "vegetarian"],
  },
  {
    id: "33", name: "Sweet Potato Wedges",
    description: "Crispy wedges, chipotle mayo, fresh coriander",
    price: 9.00, image: foodSalad, category: "starters",
    allergens: ["eggs"], dietaryTags: ["vegetarian", "gluten-free", "nut-free"], shareable: true,
    type: "side", preference: ["meat", "fish", "vegetarian", "vegan"],
  },
  {
    id: "34", name: "Miso Slaw",
    description: "Shredded cabbage, carrot, white miso dressing, toasted sesame",
    price: 7.00, image: foodSalad, category: "starters",
    allergens: ["soy", "sesame"], dietaryTags: ["vegan", "gluten-free", "nut-free"], shareable: true,
    type: "side", preference: ["vegan", "vegetarian", "fish", "meat"],
  },

  // ── DESSERTS ─────────────────────────────────────────────────
  {
    id: "5", name: "Molten Lava Cake",
    description: "Dark chocolate fondant, gold leaf, berry coulis, vanilla gelato",
    price: 14.00, image: foodDessert, category: "desserts", tags: ["Must Try"],
    allergens: ["gluten", "dairy", "eggs"], dietaryTags: [], shareable: false,
    type: "dessert", preference: ["meat", "fish", "vegetarian"],
  },
  {
    id: "9", name: "Tiramisu Classico",
    description: "Mascarpone cream, espresso-soaked savoiardi, cocoa dust",
    price: 12.00, image: foodDessert, category: "desserts",
    allergens: ["gluten", "dairy", "eggs"], dietaryTags: ["vegetarian"], shareable: false,
    type: "dessert", preference: ["meat", "fish", "vegetarian"],
  },
  {
    id: "18", name: "Açaí Bowl",
    description: "Açaí blend, granola, fresh berries, coconut flakes, honey",
    price: 13.00, image: foodDessert, category: "desserts",
    allergens: ["nuts"], dietaryTags: ["vegetarian", "gluten-free"], shareable: false,
    type: "dessert", preference: ["vegetarian", "fish"],
  },
  {
    id: "35", name: "Panna Cotta",
    description: "Vanilla bean panna cotta, passion fruit coulis, shortbread crumble",
    price: 11.00, image: foodDessert, category: "desserts",
    allergens: ["dairy", "gluten"], dietaryTags: ["vegetarian", "nut-free"], shareable: false,
    type: "dessert", preference: ["meat", "fish", "vegetarian"],
  },
  {
    id: "36", name: "Coconut Sorbet Trio",
    description: "Mango, raspberry & coconut sorbets, fresh mint",
    price: 10.00, image: foodDessert, category: "desserts",
    allergens: [], dietaryTags: ["vegan", "gluten-free", "nut-free"], shareable: true,
    type: "dessert", preference: ["vegan", "vegetarian", "fish", "meat"],
  },
  {
    id: "37", name: "Churros con Chocolate",
    description: "Cinnamon sugar churros, dark chocolate dipping sauce",
    price: 11.00, image: foodDessert, category: "desserts", tags: ["New"],
    allergens: ["gluten", "dairy", "eggs"], dietaryTags: ["vegetarian", "nut-free"], shareable: true,
    type: "dessert", preference: ["meat", "fish", "vegetarian"],
  },

  // ── DRINKS ───────────────────────────────────────────────────
  {
    id: "6", name: "Sunset Spritz",
    description: "Aperol, prosecco, blood orange, soda, served over crystal ice",
    price: 13.00, image: foodDrinks, category: "drinks",
    allergens: [], dietaryTags: ["vegan", "gluten-free", "nut-free"], shareable: false,
    type: "drink", preference: ["meat", "fish", "vegetarian", "vegan"],
  },
  {
    id: "10", name: "Smoky Old Fashioned",
    description: "Bourbon, demerara, angostura, smoked rosemary sprig",
    price: 15.00, image: foodDrinks, category: "drinks",
    allergens: [], dietaryTags: ["vegan", "gluten-free", "nut-free"], shareable: false,
    type: "drink", preference: ["meat", "fish", "vegetarian", "vegan"],
  },
  {
    id: "38", name: "Yuzu Lemonade",
    description: "Fresh yuzu juice, sparkling water, agave, shiso leaf",
    price: 8.00, image: foodDrinks, category: "drinks",
    allergens: [], dietaryTags: ["vegan", "gluten-free", "nut-free"], shareable: false,
    type: "drink", preference: ["meat", "fish", "vegetarian", "vegan"],
  },
  {
    id: "39", name: "Matcha Latte",
    description: "Ceremonial grade matcha, oat milk, vanilla, served hot or iced",
    price: 7.00, image: foodDrinks, category: "drinks",
    allergens: [], dietaryTags: ["vegan", "gluten-free", "nut-free"], shareable: false,
    type: "drink", preference: ["meat", "fish", "vegetarian", "vegan"],
  },
  {
    id: "40", name: "Espresso Martini",
    description: "Vodka, fresh espresso, coffee liqueur, vanilla foam",
    price: 14.00, image: foodDrinks, category: "drinks", tags: ["Popular"],
    allergens: [], dietaryTags: ["vegan", "gluten-free", "nut-free"], shareable: false,
    type: "drink", preference: ["meat", "fish", "vegetarian", "vegan"],
  },
  {
    id: "41", name: "Kombucha Flight",
    description: "Three house-brewed kombuchas: ginger, hibiscus, passionfruit",
    price: 12.00, image: foodDrinks, category: "drinks",
    allergens: [], dietaryTags: ["vegan", "gluten-free", "nut-free"], shareable: true,
    type: "drink", preference: ["meat", "fish", "vegetarian", "vegan"],
  },
];
