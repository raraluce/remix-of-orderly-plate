import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft, Heart, DollarSign, AlertTriangle, Leaf, Star,
  TrendingUp, Utensils, CalendarDays, Clock, MapPin, Settings, ChevronRight,
} from "lucide-react";
import { useUserPreferences } from "@/contexts/UserPreferencesContext";
import { useAppUser } from "@/contexts/AppUserContext";
import BottomNav from "@/components/app/BottomNav";
import foodPasta from "@/assets/food-pasta.jpg";
import foodSushi from "@/assets/food-sushi.jpg";
import foodPizza from "@/assets/food-pizza.jpg";
import foodDessert from "@/assets/food-dessert.jpg";

const allergenOptions = ["Gluten", "Dairy", "Nuts", "Shellfish", "Eggs", "Soy", "Fish", "Sesame"];
const dietaryOptions = ["Vegetarian", "Vegan", "Keto", "Halal", "Kosher", "Pescatarian", "Paleo"];

const favorites = [
  { id: "1", name: "Truffle Spaghetti", restaurant: "The Grand Kitchen", price: 24, image: foodPasta, rating: 4.9 },
  { id: "2", name: "Dragon Roll Platter", restaurant: "Sakura Omakase", price: 22, image: foodSushi, rating: 4.8 },
  { id: "3", name: "Margherita DOP", restaurant: "The Grand Kitchen", price: 16, image: foodPizza, rating: 4.7 },
  { id: "4", name: "Molten Lava Cake", restaurant: "The Grand Kitchen", price: 14, image: foodDessert, rating: 5.0 },
];

const orderHistory = [
  { id: "#2041", date: "Today", restaurant: "The Grand Kitchen", items: 3, total: 62.0, status: "Delivered" },
  { id: "#2038", date: "Yesterday", restaurant: "Sakura Omakase", items: 2, total: 38.5, status: "Delivered" },
  { id: "#2035", date: "Mar 5", restaurant: "The Grand Kitchen", items: 4, total: 87.0, status: "Delivered" },
  { id: "#2031", date: "Mar 2", restaurant: "Sakura Omakase", items: 5, total: 124.0, status: "Delivered" },
];

const savedReservations = [
  {
    id: "res-1",
    restaurant: "The Grand Kitchen",
    date: "Mar 12, 2026",
    time: "20:00",
    guests: 4,
    status: "upcoming" as const,
    image: foodPasta,
  },
  {
    id: "res-2",
    restaurant: "Sakura Omakase",
    date: "Mar 15, 2026",
    time: "19:30",
    guests: 2,
    status: "upcoming" as const,
    image: foodSushi,
  },
  {
    id: "res-3",
    restaurant: "The Grand Kitchen",
    date: "Feb 28, 2026",
    time: "21:00",
    guests: 3,
    status: "past" as const,
    image: foodPizza,
  },
];

const DinerProfile = () => {
  const navigate = useNavigate();
  const { allergens: selectedAllergens, dietary: selectedDietary, toggleAllergen, toggleDietary } = useUserPreferences();
  const { isAppUser } = useAppUser();

  const upcomingReservations = savedReservations.filter((r) => r.status === "upcoming");
  const pastReservations = savedReservations.filter((r) => r.status === "past");

  return (
    <div className={`min-h-screen bg-background ${isAppUser ? "pb-24" : "pb-12"}`}>
      {/* Header */}
      <header className="border-b border-border glass sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-secondary transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="font-display font-bold text-lg">My Profile</h1>
              <p className="text-xs text-muted-foreground">Preferences & history</p>
            </div>
          </div>
          <button onClick={() => navigate("/settings")} className="p-2 rounded-full hover:bg-secondary transition-colors">
            <Settings className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 space-y-8 max-w-2xl">
        {/* User Avatar & Stats */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-5"
        >
          <div className="w-20 h-20 rounded-full gradient-accent flex items-center justify-center text-2xl font-display font-bold text-primary-foreground glow-accent">
            JD
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-display font-bold">Jamie Doe</h2>
            <p className="text-sm text-muted-foreground">Foodie since 2024</p>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="grid grid-cols-3 gap-3"
        >
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
        </motion.div>

        {/* Upcoming Reservations */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-primary" />
              <h3 className="font-display font-semibold">Upcoming Reservations</h3>
            </div>
            <span className="text-[10px] text-muted-foreground font-semibold bg-secondary px-2 py-0.5 rounded-full">
              {upcomingReservations.length}
            </span>
          </div>
          {upcomingReservations.length === 0 ? (
            <div className="bg-card border border-border rounded-2xl p-6 text-center">
              <p className="text-sm text-muted-foreground">No upcoming reservations</p>
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingReservations.map((res) => (
                <div
                  key={res.id}
                  className="bg-card border border-primary/20 rounded-2xl p-4 flex gap-3"
                >
                  <img
                    src={res.image}
                    alt={res.restaurant}
                    className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-display font-bold text-sm truncate">{res.restaurant}</h4>
                    <div className="flex items-center gap-3 mt-1 text-[11px] text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <CalendarDays className="w-3 h-3" /> {res.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {res.time}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-[10px] font-semibold text-muted-foreground">
                        {res.guests} guest{res.guests > 1 ? "s" : ""}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/15 text-primary">
                        Confirmed
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Past Reservations */}
        {pastReservations.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.13 }}
          >
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <h3 className="font-display font-semibold text-muted-foreground">Past Reservations</h3>
            </div>
            <div className="space-y-2">
              {pastReservations.map((res) => (
                <div
                  key={res.id}
                  className="bg-card border border-border rounded-xl p-3 flex items-center gap-3 opacity-70"
                >
                  <img
                    src={res.image}
                    alt={res.restaurant}
                    className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold truncate">{res.restaurant}</p>
                    <p className="text-[10px] text-muted-foreground">{res.date} · {res.time} · {res.guests} guests</p>
                  </div>
                  <span className="text-[10px] text-muted-foreground font-medium">Completed</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Allergens */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.16 }}
        >
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
        </motion.div>

        {/* Dietary */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.19 }}
        >
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
        </motion.div>

        {/* Favorites */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.22 }}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-primary fill-primary" />
              <h3 className="font-display font-semibold">Favorites</h3>
            </div>
            <button className="text-primary text-xs font-semibold flex items-center gap-0.5">
              See all <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {favorites.map((fav) => (
              <div key={fav.id} className="bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/30 transition-colors hover-lift">
                <div className="aspect-[3/2] overflow-hidden">
                  <img src={fav.image} alt={fav.name} className="w-full h-full object-cover" />
                </div>
                <div className="p-3">
                  <h4 className="font-semibold text-xs truncate">{fav.name}</h4>
                  <p className="text-[10px] text-muted-foreground truncate">{fav.restaurant}</p>
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
        </motion.div>

        {/* Order History */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-display font-semibold">Order History</h3>
            <button className="text-primary text-xs font-semibold flex items-center gap-0.5">
              See all <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-2">
            {orderHistory.map((order) => (
              <div key={order.id} className="bg-card border border-border rounded-xl p-4 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-display font-bold text-sm text-primary">{order.id}</p>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-secondary text-muted-foreground font-medium">
                      {order.status}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{order.restaurant} · {order.date} · {order.items} items</p>
                </div>
                <span className="font-display font-bold text-sm">${order.total.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {isAppUser && <BottomNav />}
    </div>
  );
};

export default DinerProfile;
