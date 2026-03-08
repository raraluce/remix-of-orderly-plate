import heroFood from "@/assets/hero-food.jpg";
import foodPasta from "@/assets/food-pasta.jpg";
import foodSushi from "@/assets/food-sushi.jpg";
import foodPizza from "@/assets/food-pizza.jpg";
import foodSalad from "@/assets/food-salad.jpg";
import foodDessert from "@/assets/food-dessert.jpg";
import foodDrinks from "@/assets/food-drinks.jpg";

export type CuisineType = "european" | "japanese" | "italian" | "mexican" | "indian" | "american" | "thai" | "mediterranean";
export type VibeType = "romantic" | "casual" | "fine-dining" | "family" | "trendy" | "cozy";
export type OccasionType = "date" | "friends" | "business" | "solo" | "celebration" | "family";
export type BudgetType = "$" | "$$" | "$$$" | "$$$$";

export interface RestaurantListing {
  id: string;
  name: string;
  slug: string;
  description: string;
  cuisine: string;
  cuisineTypes: CuisineType[];
  vibes: VibeType[];
  occasions: OccasionType[];
  coverImage: string;
  rating: number;
  reviewCount: number;
  priceRange: BudgetType;
  address: string;
  distance: string;
  deliveryTime: string;
  tags: string[];
  coordinates: { lat: number; lng: number };
  isOpen: boolean;
  openHours: string;
  phone: string;
  offers?: { label: string; description: string }[];
}

export const restaurants: RestaurantListing[] = [
  {
    id: "rest-001",
    name: "The Grand Kitchen",
    slug: "the-grand-kitchen",
    description: "Modern gastronomy meets tradition. Wood-fired, locally sourced, unforgettable.",
    cuisine: "Modern European",
    cuisineTypes: ["european"],
    vibes: ["fine-dining", "romantic", "trendy"],
    occasions: ["date", "celebration", "business"],
    coverImage: heroFood,
    rating: 4.8,
    reviewCount: 342,
    priceRange: "$$$",
    address: "42 Culinary Street, Foodville",
    distance: "0.3 mi",
    deliveryTime: "20-30 min",
    tags: ["Wood-fired", "Organic", "Prix Fixe"],
    coordinates: { lat: 40.7128, lng: -74.006 },
    isOpen: true,
    openHours: "12:00 – 23:00",
    phone: "+1 555 123 4567",
    offers: [
      { label: "20% OFF", description: "Lunch special Mon-Fri until 3pm" },
    ],
  },
  {
    id: "rest-002",
    name: "Sakura Omakase",
    slug: "sakura-omakase",
    description: "Authentic Japanese omakase experience. Fresh fish flown in daily from Tsukiji market.",
    cuisine: "Japanese",
    cuisineTypes: ["japanese"],
    vibes: ["fine-dining", "romantic", "cozy"],
    occasions: ["date", "celebration", "solo"],
    coverImage: foodSushi,
    rating: 4.9,
    reviewCount: 187,
    priceRange: "$$$$",
    address: "15 Blossom Lane, Foodville",
    distance: "0.8 mi",
    deliveryTime: "25-40 min",
    tags: ["Omakase", "Sushi Bar", "Sake Pairing"],
    coordinates: { lat: 40.7148, lng: -74.003 },
    isOpen: true,
    openHours: "18:00 – 23:30",
    phone: "+1 555 987 6543",
    offers: [
      { label: "NEW", description: "Chef's tasting menu — 12 courses" },
      { label: "HAPPY HOUR", description: "Half-price sake 6–7pm" },
    ],
  },
  {
    id: "rest-003",
    name: "Nonna's Trattoria",
    slug: "nonnas-trattoria",
    description: "Homemade pasta, family recipes passed down three generations. Like eating at Nonna's house.",
    cuisine: "Italian",
    cuisineTypes: ["italian"],
    vibes: ["cozy", "family", "casual"],
    occasions: ["family", "friends", "date"],
    coverImage: foodPasta,
    rating: 4.6,
    reviewCount: 521,
    priceRange: "$$",
    address: "78 Via Roma, Foodville",
    distance: "0.5 mi",
    deliveryTime: "15-25 min",
    tags: ["Homemade Pasta", "Family-style", "Wine Bar"],
    coordinates: { lat: 40.7115, lng: -74.008 },
    isOpen: true,
    openHours: "11:30 – 22:30",
    phone: "+1 555 234 5678",
    offers: [
      { label: "FAMILY DEAL", description: "4 courses for 2 — $59" },
    ],
  },
  {
    id: "rest-004",
    name: "Fuego Cantina",
    slug: "fuego-cantina",
    description: "Bold Mexican flavours, craft margaritas, and live music every weekend.",
    cuisine: "Mexican",
    cuisineTypes: ["mexican"],
    vibes: ["casual", "trendy", "family"],
    occasions: ["friends", "celebration", "family"],
    coverImage: foodSalad,
    rating: 4.5,
    reviewCount: 289,
    priceRange: "$$",
    address: "22 Fiesta Blvd, Foodville",
    distance: "1.2 mi",
    deliveryTime: "20-35 min",
    tags: ["Tacos", "Margaritas", "Live Music"],
    coordinates: { lat: 40.7165, lng: -74.001 },
    isOpen: true,
    openHours: "12:00 – 01:00",
    phone: "+1 555 345 6789",
  },
  {
    id: "rest-005",
    name: "Spice Route",
    slug: "spice-route",
    description: "Modern Indian cuisine reimagined. Tandoori mastery meets contemporary plating.",
    cuisine: "Indian",
    cuisineTypes: ["indian"],
    vibes: ["trendy", "cozy", "romantic"],
    occasions: ["date", "friends", "solo"],
    coverImage: foodDessert,
    rating: 4.7,
    reviewCount: 198,
    priceRange: "$$$",
    address: "9 Saffron Street, Foodville",
    distance: "0.6 mi",
    deliveryTime: "25-35 min",
    tags: ["Tandoori", "Craft Cocktails", "Tasting Menu"],
    coordinates: { lat: 40.7135, lng: -74.005 },
    isOpen: true,
    openHours: "17:00 – 23:00",
    phone: "+1 555 456 7890",
    offers: [
      { label: "NEW", description: "Spice discovery tasting — 7 courses" },
    ],
  },
  {
    id: "rest-006",
    name: "The Burger Yard",
    slug: "the-burger-yard",
    description: "Smash burgers, loaded fries, craft beers. No frills, all flavour.",
    cuisine: "American",
    cuisineTypes: ["american"],
    vibes: ["casual", "family", "trendy"],
    occasions: ["friends", "solo", "family"],
    coverImage: heroFood,
    rating: 4.4,
    reviewCount: 612,
    priceRange: "$",
    address: "55 Grill Lane, Foodville",
    distance: "0.2 mi",
    deliveryTime: "10-20 min",
    tags: ["Burgers", "Craft Beer", "Late Night"],
    coordinates: { lat: 40.7122, lng: -74.007 },
    isOpen: true,
    openHours: "11:00 – 02:00",
    phone: "+1 555 567 8901",
  },
];

export interface NewsItem {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  restaurantId: string;
  tag: string;
}

export const newsItems: NewsItem[] = [
  {
    id: "news-1",
    title: "Grand Kitchen launches new spring menu",
    subtitle: "Seasonal ingredients, bold flavours — available now",
    image: foodPasta,
    restaurantId: "rest-001",
    tag: "New Menu",
  },
  {
    id: "news-2",
    title: "Sakura Omakase: 12-course tasting experience",
    subtitle: "A journey through Japan's finest flavours",
    image: foodSushi,
    restaurantId: "rest-002",
    tag: "Limited",
  },
  {
    id: "news-3",
    title: "Weekend brunch is back at The Grand Kitchen",
    subtitle: "Every Saturday & Sunday from 11am",
    image: foodDessert,
    restaurantId: "rest-001",
    tag: "Brunch",
  },
];

export interface OfferBanner {
  id: string;
  title: string;
  description: string;
  code?: string;
  image: string;
  color: string; // tailwind bg class or gradient
  restaurantId: string;
}

export const offerBanners: OfferBanner[] = [
  {
    id: "offer-1",
    title: "20% off your first order",
    description: "Use code BITE20 at checkout",
    code: "BITE20",
    image: foodPizza,
    color: "from-primary to-orange-400",
    restaurantId: "rest-001",
  },
  {
    id: "offer-2",
    title: "Free sake with omakase",
    description: "Book the 12-course tasting tonight",
    image: foodDrinks,
    color: "from-violet-600 to-indigo-500",
    restaurantId: "rest-002",
  },
];
