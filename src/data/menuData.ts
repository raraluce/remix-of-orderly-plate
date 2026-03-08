import foodPasta from "@/assets/food-pasta.jpg";
import foodSushi from "@/assets/food-sushi.jpg";
import foodPizza from "@/assets/food-pizza.jpg";
import foodDessert from "@/assets/food-dessert.jpg";
import foodDrinks from "@/assets/food-drinks.jpg";
import foodSalad from "@/assets/food-salad.jpg";
import heroFood from "@/assets/hero-food.jpg";

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  tags?: string[];
}

export const categories = [
  { id: "popular", label: "🔥 Popular" },
  { id: "starters", label: "Starters" },
  { id: "mains", label: "Mains" },
  { id: "pizza", label: "Pizza" },
  { id: "desserts", label: "Desserts" },
  { id: "drinks", label: "Drinks" },
];

export const menuItems: MenuItem[] = [
  { id: "1", name: "Smash Burger Deluxe", description: "Double smashed patty, aged cheddar, house sauce, brioche bun", price: 18.50, image: heroFood, category: "popular", tags: ["Chef's Pick"] },
  { id: "2", name: "Truffle Spaghetti", description: "Hand-rolled pasta, black truffle, parmesan cream, fresh basil", price: 24.00, image: foodPasta, category: "mains", tags: ["Popular"] },
  { id: "3", name: "Dragon Roll Platter", description: "8-piece signature roll with salmon, tuna & avocado, wasabi aioli", price: 22.00, image: foodSushi, category: "popular", tags: ["New"] },
  { id: "4", name: "Margherita DOP", description: "San Marzano tomato, buffalo mozzarella, fresh basil, wood-fired", price: 16.00, image: foodPizza, category: "pizza" },
  { id: "5", name: "Molten Lava Cake", description: "Dark chocolate fondant, gold leaf, berry coulis, vanilla gelato", price: 14.00, image: foodDessert, category: "desserts", tags: ["Must Try"] },
  { id: "6", name: "Sunset Spritz", description: "Aperol, prosecco, blood orange, soda, served over crystal ice", price: 13.00, image: foodDrinks, category: "drinks" },
  { id: "7", name: "Caesar Royale", description: "Baby gem, grilled chicken, aged parmesan, sourdough croutons", price: 15.00, image: foodSalad, category: "starters" },
  { id: "8", name: "Quattro Formaggi", description: "Gorgonzola, taleggio, fontina, parmesan, honey drizzle", price: 19.00, image: foodPizza, category: "pizza" },
  { id: "9", name: "Tiramisu Classico", description: "Mascarpone cream, espresso-soaked savoiardi, cocoa dust", price: 12.00, image: foodDessert, category: "desserts" },
  { id: "10", name: "Smoky Old Fashioned", description: "Bourbon, demerara, angostura, smoked rosemary sprig", price: 15.00, image: foodDrinks, category: "drinks" },
  { id: "11", name: "Tuna Tartare", description: "Yellowfin tuna, avocado, sesame, crispy wonton chips", price: 17.00, image: foodSushi, category: "starters", tags: ["Popular"] },
  { id: "12", name: "Wagyu Tagliatelle", description: "Slow-braised wagyu ragu, hand-cut pasta, pecorino", price: 28.00, image: foodPasta, category: "mains", tags: ["Premium"] },
];
