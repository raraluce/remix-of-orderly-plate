import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Star, Clock, Navigation, X, ChevronUp } from "lucide-react";
import { restaurants, type RestaurantListing } from "@/data/restaurants";
import ReservationSheet from "@/components/app/ReservationSheet";
import BottomNav from "@/components/app/BottomNav";

const MapView = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<RestaurantListing | null>(null);
  const [reserveTarget, setReserveTarget] = useState<RestaurantListing | null>(null);

  // Fake map pin positions (percentage-based)
  const pinPositions = [
    { x: 35, y: 40 },
    { x: 62, y: 28 },
  ];

  return (
    <div className="h-screen bg-background flex flex-col">
      {/* Fake map area */}
      <div className="relative flex-1 bg-secondary overflow-hidden">
        {/* Grid pattern to simulate a map */}
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" className="text-muted-foreground" />
          </svg>
        </div>

        {/* Simulated streets */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-[30%] left-0 right-0 h-[2px] bg-foreground" />
          <div className="absolute top-[55%] left-0 right-0 h-[3px] bg-foreground" />
          <div className="absolute top-0 bottom-0 left-[25%] w-[2px] bg-foreground" />
          <div className="absolute top-0 bottom-0 left-[60%] w-[3px] bg-foreground" />
          <div className="absolute top-[15%] left-[10%] right-[30%] h-[1px] bg-foreground rotate-12" />
        </div>

        {/* User location */}
        <div className="absolute top-[50%] left-[45%] z-10">
          <div className="relative">
            <div className="w-4 h-4 rounded-full bg-primary border-2 border-primary-foreground shadow-lg" />
            <div className="absolute inset-0 w-4 h-4 rounded-full bg-primary/30 animate-ping" />
          </div>
        </div>

        {/* Restaurant pins */}
        {restaurants.map((r, i) => (
          <button
            key={r.id}
            onClick={() => setSelected(r)}
            className="absolute z-20 -translate-x-1/2 -translate-y-full"
            style={{ left: `${pinPositions[i].x}%`, top: `${pinPositions[i].y}%` }}
          >
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 + i * 0.15 }}
              className={`flex flex-col items-center ${
                selected?.id === r.id ? "scale-110" : ""
              } transition-transform`}
            >
              <div
                className={`px-3 py-1.5 rounded-xl shadow-lg font-bold text-xs whitespace-nowrap ${
                  selected?.id === r.id
                    ? "gradient-accent text-primary-foreground glow-accent"
                    : "bg-card text-foreground border border-border"
                }`}
              >
                {r.name}
              </div>
              <div
                className={`w-3 h-3 rotate-45 -mt-1.5 ${
                  selected?.id === r.id ? "bg-primary" : "bg-card border-b border-r border-border"
                }`}
              />
              <MapPin
                className={`w-6 h-6 mt-1 ${
                  selected?.id === r.id ? "text-primary" : "text-muted-foreground"
                }`}
                fill={selected?.id === r.id ? "currentColor" : "none"}
              />
            </motion.div>
          </button>
        ))}

        {/* Top bar */}
        <div className="absolute top-12 left-4 right-4 z-30">
          <div className="bg-card/80 backdrop-blur-xl border border-border rounded-2xl px-4 py-3 flex items-center gap-3">
            <Navigation className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold flex-1">Restaurants near you</span>
            <span className="text-xs text-muted-foreground">{restaurants.length} found</span>
          </div>
        </div>
      </div>

      {/* Bottom card */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ y: 200 }}
            animate={{ y: 0 }}
            exit={{ y: 200 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="absolute bottom-20 left-4 right-4 z-30 bg-card border border-border rounded-2xl p-4 shadow-2xl"
          >
            <button
              onClick={() => setSelected(null)}
              className="absolute top-3 right-3 w-7 h-7 rounded-full bg-secondary flex items-center justify-center"
            >
              <X className="w-3.5 h-3.5" />
            </button>
            <div className="flex gap-3 mb-3">
              <img
                src={selected.coverImage}
                alt={selected.name}
                className="w-20 h-20 rounded-xl object-cover flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-display font-bold text-base truncate">{selected.name}</h3>
                <p className="text-xs text-muted-foreground">{selected.cuisine} · {selected.priceRange}</p>
                <div className="flex items-center gap-2 mt-1.5 text-[11px] text-muted-foreground">
                  <span className="flex items-center gap-0.5">
                    <Star className="w-3 h-3 text-primary fill-primary" /> {selected.rating}
                  </span>
                  <span className="flex items-center gap-0.5">
                    <MapPin className="w-3 h-3" /> {selected.distance}
                  </span>
                  <span className="flex items-center gap-0.5">
                    <Clock className="w-3 h-3" /> {selected.openHours}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => navigate(`/restaurant-view/${selected.id}`)}
                className="flex-1 py-2.5 rounded-xl bg-secondary text-sm font-semibold text-center"
              >
                View Menu
              </button>
              <button
                onClick={() => setReserveTarget(selected)}
                className="flex-1 py-2.5 rounded-xl gradient-accent text-primary-foreground text-sm font-bold text-center glow-accent-sm"
              >
                Reserve
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {reserveTarget && (
        <ReservationSheet
          open={!!reserveTarget}
          onClose={() => setReserveTarget(null)}
          restaurant={reserveTarget}
        />
      )}

      <BottomNav />
    </div>
  );
};

export default MapView;
