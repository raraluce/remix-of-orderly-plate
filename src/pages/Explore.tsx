import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, Star, Clock, MapPin, ChevronRight, Bookmark, Tag } from "lucide-react";
import { restaurants, newsItems, offerBanners, type RestaurantListing } from "@/data/restaurants";
import ReservationSheet from "@/components/app/ReservationSheet";
import BottomNav from "@/components/app/BottomNav";
import { useAppUser } from "@/contexts/AppUserContext";

const Explore = () => {
  const navigate = useNavigate();
  const { setAppUser } = useAppUser();
  const [searchQuery, setSearchQuery] = useState("");
  const [reserveTarget, setReserveTarget] = useState<RestaurantListing | null>(null);

  // Mark as app user when they access the Explore page
  useEffect(() => { setAppUser(true); }, [setAppUser]);

  const filteredRestaurants = searchQuery.trim()
    ? restaurants.filter(
        (r) =>
          r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.cuisine.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : restaurants;

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="px-4 pt-12 pb-4">
        <div className="flex items-center justify-between mb-1">
          <div>
            <p className="text-sm text-muted-foreground">Good evening 👋</p>
            <h1 className="text-2xl font-display font-bold">
              Discover with <span className="text-gradient">.bite</span>
            </h1>
          </div>
          <div className="w-10 h-10 rounded-full gradient-accent flex items-center justify-center text-primary-foreground text-xs font-bold">
            JD
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="px-4 mb-5">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search restaurants, cuisines…"
            className="w-full bg-card border border-border rounded-2xl pl-10 pr-4 py-3.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      {/* Offer banners */}
      {!searchQuery && (
        <div className="px-4 mb-6">
          <div className="flex gap-3 overflow-x-auto no-scrollbar">
            {offerBanners.map((offer, i) => (
              <motion.div
                key={offer.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`relative min-w-[280px] h-36 rounded-2xl overflow-hidden flex-shrink-0 bg-gradient-to-br ${offer.color}`}
              >
                <img
                  src={offer.image}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-30"
                />
                <div className="relative z-10 p-5 h-full flex flex-col justify-between">
                  <div>
                    <h3 className="text-primary-foreground font-display font-bold text-lg leading-tight">
                      {offer.title}
                    </h3>
                    <p className="text-primary-foreground/80 text-xs mt-1">{offer.description}</p>
                  </div>
                  {offer.code && (
                    <div className="flex items-center gap-2">
                      <span className="bg-primary-foreground/20 backdrop-blur-sm text-primary-foreground text-xs font-bold px-3 py-1 rounded-full">
                        {offer.code}
                      </span>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* News */}
      {!searchQuery && (
        <div className="px-4 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display font-bold text-base">What's new</h2>
            <button className="text-primary text-xs font-semibold flex items-center gap-0.5">
              See all <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          <div className="flex gap-3 overflow-x-auto no-scrollbar">
            {newsItems.map((news, i) => (
              <motion.div
                key={news.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.08 }}
                className="min-w-[220px] flex-shrink-0 bg-card border border-border rounded-2xl overflow-hidden hover-lift cursor-pointer"
              >
                <div className="relative h-28 overflow-hidden">
                  <img src={news.image} alt="" className="w-full h-full object-cover" />
                  <span className="absolute top-2 left-2 bg-primary text-primary-foreground text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {news.tag}
                  </span>
                </div>
                <div className="p-3">
                  <h4 className="text-xs font-semibold line-clamp-2 leading-snug">{news.title}</h4>
                  <p className="text-[10px] text-muted-foreground mt-1 line-clamp-1">{news.subtitle}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Restaurants */}
      <div className="px-4">
        <h2 className="font-display font-bold text-base mb-3">
          {searchQuery ? "Results" : "Near you"}
        </h2>
        <div className="space-y-4">
          {filteredRestaurants.map((r, i) => (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.08 }}
              className="bg-card border border-border rounded-2xl overflow-hidden hover-lift"
            >
              {/* Image */}
              <div className="relative h-40 overflow-hidden cursor-pointer" onClick={() => navigate(`/restaurant-view/${r.id}`)}>
                <img src={r.coverImage} alt={r.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent" />
                <button className="absolute top-3 right-3 w-8 h-8 rounded-full glass flex items-center justify-center">
                  <Bookmark className="w-4 h-4" />
                </button>
                {r.offers && r.offers.length > 0 && (
                  <div className="absolute bottom-3 left-3 flex gap-1.5">
                    {r.offers.map((o, j) => (
                      <span
                        key={j}
                        className="flex items-center gap-1 bg-primary/90 backdrop-blur-sm text-primary-foreground text-[10px] font-bold px-2 py-1 rounded-full"
                      >
                        <Tag className="w-3 h-3" />
                        {o.label}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-display font-bold text-base">{r.name}</h3>
                    <p className="text-xs text-muted-foreground">{r.cuisine} · {r.priceRange}</p>
                  </div>
                  <div className="flex items-center gap-1 bg-primary/10 text-primary text-xs font-bold px-2 py-1 rounded-lg">
                    <Star className="w-3 h-3 fill-primary" />
                    {r.rating}
                  </div>
                </div>
                <div className="flex items-center gap-3 text-[11px] text-muted-foreground mb-3">
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{r.distance}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{r.deliveryTime}</span>
                  <span className={`font-semibold ${r.isOpen ? "text-emerald-400" : "text-destructive"}`}>
                    {r.isOpen ? "Open" : "Closed"}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => navigate(`/restaurant-view/${r.id}`)}
                    className="flex-1 py-2.5 rounded-xl bg-secondary text-sm font-semibold text-center transition-colors hover:bg-secondary/80"
                  >
                    View Menu
                  </button>
                  <button
                    onClick={() => setReserveTarget(r)}
                    className="flex-1 py-2.5 rounded-xl gradient-accent text-primary-foreground text-sm font-bold text-center glow-accent-sm"
                  >
                    Reserve
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

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

export default Explore;
