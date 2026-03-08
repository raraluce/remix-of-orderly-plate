import { Link } from "react-router-dom";
import { ArrowLeft, Heart, DollarSign, AlertTriangle, Leaf, Star, TrendingUp, Utensils } from "lucide-react";
import { useUserPreferences } from "@/contexts/UserPreferencesContext";
import foodPasta from "@/assets/food-pasta.jpg";
import foodSushi from "@/assets/food-sushi.jpg";
import foodPizza from "@/assets/food-pizza.jpg";
import foodDessert from "@/assets/food-dessert.jpg";

const allergenOptions = ["Gluten", "Dairy", "Nuts", "Shellfish", "Eggs", "Soy", "Fish", "Sesame"];
const dietaryOptions = ["Vegetarian", "Vegan", "Keto", "Halal", "Kosher", "Pescatarian", "Paleo"];

const favorites = [
  { id: "1", name: "Truffle Spaghetti", restaurant: "The Grand Kitchen", price: 24, image: foodPasta, rating: 4.9 },
  { id: "2", name: "Dragon Roll Platter", restaurant: "The Grand Kitchen", price: 22, image: foodSushi, rating: 4.8 },
  { id: "3", name: "Margherita DOP", restaurant: "The Grand Kitchen", price: 16, image: foodPizza, rating: 4.7 },
  { id: "4", name: "Molten Lava Cake", restaurant: "The Grand Kitchen", price: 14, image: foodDessert, rating: 5.0 },
];

const orderHistory = [
  { id: "#2041", date: "Today", items: 3, total: 62.0 },
  { id: "#2038", date: "Yesterday", items: 2, total: 38.5 },
  { id: "#2035", date: "Mar 5", items: 4, total: 87.0 },
];

const DinerProfile = () => {
  const { allergens: selectedAllergens, dietary: selectedDietary, toggleAllergen, toggleDietary } = useUserPreferences();

  return (
    <div className="min-h-screen bg-background pb-12">
      {/* Header */}
      <header className="border-b border-border glass sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center gap-4">
          <Link to="/menu" className="p-2 rounded-full hover:bg-secondary transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="font-display font-bold text-lg">My Profile</h1>
            <p className="text-xs text-muted-foreground">Manage your preferences</p>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 space-y-8 max-w-2xl">
        {/* User Avatar & Stats */}
        <div className="flex items-center gap-5 animate-fade-up">
          <div className="w-20 h-20 rounded-full gradient-accent flex items-center justify-center text-2xl font-display font-bold text-primary-foreground glow-accent">
            JD
          </div>
          <div>
            <h2 className="text-xl font-display font-bold">Jamie Doe</h2>
            <p className="text-sm text-muted-foreground">Foodie since 2024</p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3 animate-fade-up" style={{ animationDelay: "0.1s" }}>
          <div className="bg-card border border-border rounded-2xl p-4 text-center">
            <DollarSign className="w-5 h-5 mx-auto mb-2 text-primary" />
            <p className="font-display font-bold text-lg">$42</p>
            <p className="text-[11px] text-muted-foreground">Avg Ticket</p>
          </div>
          <div className="bg-card border border-border rounded-2xl p-4 text-center">
            <TrendingUp className="w-5 h-5 mx-auto mb-2 text-primary" />
            <p className="font-display font-bold text-lg">23</p>
            <p className="text-[11px] text-muted-foreground">Total Orders</p>
          </div>
          <div className="bg-card border border-border rounded-2xl p-4 text-center">
            <Utensils className="w-5 h-5 mx-auto mb-2 text-primary" />
            <p className="font-display font-bold text-lg">$965</p>
            <p className="text-[11px] text-muted-foreground">Total Spent</p>
          </div>
        </div>

        {/* Allergens */}
        <div className="animate-fade-up" style={{ animationDelay: "0.15s" }}>
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-4 h-4 text-destructive" />
            <h3 className="font-display font-semibold">Allergens</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {allergenOptions.map((a) => (
              <button
                key={a}
                onClick={() => toggleAllergen(a)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 ${
                  selectedAllergens.includes(a)
                    ? "bg-destructive/20 border-destructive/40 text-destructive"
                    : "bg-card border-border text-muted-foreground hover:border-border/80"
                }`}
              >
                {a}
              </button>
            ))}
          </div>
        </div>

        {/* Dietary */}
        <div className="animate-fade-up" style={{ animationDelay: "0.2s" }}>
          <div className="flex items-center gap-2 mb-3">
            <Leaf className="w-4 h-4 text-emerald-400" />
            <h3 className="font-display font-semibold">Dietary Preferences</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {dietaryOptions.map((d) => (
              <button
                key={d}
                onClick={() => toggleDietary(d)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 ${
                  selectedDietary.includes(d)
                    ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-400"
                    : "bg-card border-border text-muted-foreground hover:border-border/80"
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        {/* Favorites */}
        <div className="animate-fade-up" style={{ animationDelay: "0.25s" }}>
          <div className="flex items-center gap-2 mb-3">
            <Heart className="w-4 h-4 text-primary fill-primary" />
            <h3 className="font-display font-semibold">Favorites</h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {favorites.map((fav) => (
              <div key={fav.id} className="bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/30 transition-colors hover-lift">
                <div className="aspect-[3/2] overflow-hidden">
                  <img src={fav.image} alt={fav.name} className="w-full h-full object-cover" />
                </div>
                <div className="p-3">
                  <h4 className="font-semibold text-xs truncate">{fav.name}</h4>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-primary font-display font-bold text-xs">${fav.price}</span>
                    <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                      <Star className="w-3 h-3 text-primary fill-primary" /> {fav.rating}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="animate-fade-up" style={{ animationDelay: "0.3s" }}>
          <h3 className="font-display font-semibold mb-3">Recent Orders</h3>
          <div className="space-y-2">
            {orderHistory.map((order) => (
              <div key={order.id} className="bg-card border border-border rounded-xl p-4 flex items-center justify-between">
                <div>
                  <p className="font-display font-bold text-sm text-primary">{order.id}</p>
                  <p className="text-xs text-muted-foreground">{order.date} • {order.items} items</p>
                </div>
                <span className="font-display font-bold text-sm">${order.total.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DinerProfile;
