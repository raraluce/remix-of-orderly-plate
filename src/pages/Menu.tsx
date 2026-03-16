import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, Star, Clock, Sparkles, User, ShieldCheck, Search, X, Users } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import MenuCard from "@/components/menu/MenuCard";
import CategoryNav from "@/components/menu/CategoryNav";
import FloatingCart from "@/components/menu/FloatingCart";
import CartSheet from "@/components/menu/CartSheet";
import { menuItems } from "@/data/menuData";
import { useCart } from "@/contexts/CartContext";
import { useUserPreferences } from "@/contexts/UserPreferencesContext";
import { useTableSession } from "@/contexts/TableSessionContext";
import { Switch } from "@/components/ui/switch";
import { analyticsService } from "@/services/analyticsService";
import { useRestaurantConfig } from "@/contexts/RestaurantConfigContext";
import heroFood from "@/assets/hero-food.jpg";

const Menu = () => {
  const [category, setCategory] = useState("popular");
  const [cartOpen, setCartOpen] = useState(false);
  const [personalizedMode, setPersonalizedMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const { allergenKeys, allergens } = useUserPreferences();
  const { session, tableNumber } = useTableSession();

  const isCompatible = (item: typeof menuItems[0]) => {
    return !item.allergens.some((a) => allergenKeys.includes(a));
  };

  // Search filter
  const searchFiltered = searchQuery.trim()
    ? menuItems.filter((i) =>
        i.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        i.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        i.dietaryTags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : null;

  const baseFiltered = searchFiltered
    ? searchFiltered
    : category === "popular"
    ? menuItems.filter((i) => i.tags?.some((t) => ["Chef's Pick", "Popular", "New", "Must Try"].includes(t)))
    : menuItems.filter((i) => i.category === category);

  const filtered = personalizedMode ? baseFiltered.filter(isCompatible) : baseFiltered;

  const handleCheckout = () => {
    setCartOpen(false);
    navigate("/payment");
  };

  const handleSearch = (q: string) => {
    setSearchQuery(q);
    if (q.trim()) {
      analyticsService.track("search_performed", { query: q });
    }
  };

  const recommended = menuItems
    .filter((i) => i.tags?.some((t) => ["Chef's Pick", "Must Try", "Popular"].includes(t)))
    .filter((i) => !personalizedMode || isCompatible(i))
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Restaurant Header */}
      <div className="relative h-48 overflow-hidden">
        <img src={heroFood} alt="Restaurant" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        <Link to={session ? "/table" : "/"} className="absolute top-4 left-4 z-10 w-10 h-10 rounded-full glass flex items-center justify-center">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="absolute top-4 right-4 z-10 flex gap-2">
          <button
            onClick={() => setShowSearch(!showSearch)}
            className="w-10 h-10 rounded-full glass flex items-center justify-center"
          >
            <Search className="w-5 h-5" />
          </button>
          <Link to="/profile" className="w-10 h-10 rounded-full glass flex items-center justify-center">
            <User className="w-5 h-5" />
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-12 relative z-10">
        <div className="mb-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-display font-bold mb-1">The Grand Kitchen</h1>
              {session && (
                <div className="flex items-center gap-1.5 mb-1">
                  <Users className="w-3.5 h-3.5 text-primary" />
                  <span className="text-xs text-primary font-semibold">Table {tableNumber} · {session.users.length} guest{session.users.length > 1 ? "s" : ""}</span>
                </div>
              )}
            </div>
            <Link to="/smart-menu" className="flex items-center gap-1.5 px-3 py-1.5 rounded-full gradient-accent text-primary-foreground text-xs font-bold shadow-lg animate-pulse hover:animate-none transition-all">
              <Sparkles className="w-3.5 h-3.5" />
              Smart Menu
            </Link>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1"><Star className="w-4 h-4 text-primary fill-primary" /> 4.8</span>
            <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> 20-30 min</span>
            <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> 0.3 mi</span>
          </div>
        </div>

        {/* Search Bar */}
        <AnimatePresence>
          {showSearch && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden mb-4"
            >
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder="Search dishes, ingredients…"
                  className="w-full bg-card border border-border rounded-xl pl-10 pr-10 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  autoFocus
                />
                {searchQuery && (
                  <button
                    onClick={() => { setSearchQuery(""); }}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    <X className="w-4 h-4 text-muted-foreground" />
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Personalized toggle */}
        <div className="flex items-center justify-between mb-4 bg-card border border-border rounded-xl px-4 py-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-primary" />
            <div>
              <p className="text-sm font-semibold">Safe for me</p>
              <p className="text-[11px] text-muted-foreground">Hide dishes with your allergens</p>
            </div>
          </div>
          <Switch checked={personalizedMode} onCheckedChange={setPersonalizedMode} />
        </div>

        <AnimatePresence>
          {personalizedMode && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden mb-4"
            >
              <div className="flex flex-wrap gap-1.5">
                {allergens.map((a) => (
                  <span key={a} className="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-destructive/15 text-destructive border border-destructive/20">
                    No {a}
                  </span>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {!searchQuery && (
          <div className="mb-6 sticky top-0 z-20 bg-background py-3">
            <CategoryNav active={category} onChange={setCategory} />
          </div>
        )}

        {searchQuery && (
          <p className="text-xs text-muted-foreground mb-4">
            {filtered.length} result{filtered.length !== 1 ? "s" : ""} for "{searchQuery}"
          </p>
        )}

        {/* Recommendations */}
        {!searchQuery && category === "popular" && recommended.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-primary" />
              <h2 className="font-display font-semibold text-sm">Recommended for You</h2>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
              {recommended.map((item) => (
                <div key={`rec-${item.id}`} className="w-[200px] flex-shrink-0 bg-card border border-primary/20 rounded-2xl overflow-hidden hover-lift">
                  <div className="h-28 w-full overflow-hidden">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-3">
                    <h4 className="font-semibold text-xs truncate">{item.name}</h4>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-primary font-display font-bold text-xs">${item.price.toFixed(2)}</span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded-full gradient-accent text-primary-foreground font-bold uppercase truncate max-w-[80px]">
                        {item.tags?.[0]}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence mode="popLayout">
            {filtered.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.25 }}
              >
                <MenuCard item={item} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        <AnimatePresence>
          {filtered.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-16"
            >
              <p className="text-muted-foreground text-sm">
                {searchQuery ? `No dishes found for "${searchQuery}"` : "No dishes match your filters in this category."}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <FloatingCart onClick={() => setCartOpen(true)} />
      <CartSheet open={cartOpen} onClose={() => setCartOpen(false)} onCheckout={handleCheckout} />
    </div>
  );
};

export default Menu;
