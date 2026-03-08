import heroFood from "@/assets/hero-food.jpg";
import foodPasta from "@/assets/food-pasta.jpg";
import foodSushi from "@/assets/food-sushi.jpg";
import foodPizza from "@/assets/food-pizza.jpg";
import foodSalad from "@/assets/food-salad.jpg";
import foodDessert from "@/assets/food-dessert.jpg";
import foodDrinks from "@/assets/food-drinks.jpg";

export interface RestaurantListing {
  id: string;
  name: string;
  slug: string;
  description: string;
  cuisine: string;
  coverImage: string;
  rating: number;
  reviewCount: number;
  priceRange: "$" | "$$" | "$$$" | "$$$$";
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
