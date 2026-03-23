import { useState, useMemo, useCallback } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, MapPin, Star, Clock, Sparkles, User, ShieldCheck, Search, X, Users } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import SupabaseMenuCard from "@/components/menu/SupabaseMenuCard";
import MenuCardSkeleton from "@/components/menu/MenuCardSkeleton";
import CategoryNav from "@/components/menu/CategoryNav";
import FloatingCart from "@/components/menu/FloatingCart";
import CartSheet from "@/components/menu/CartSheet";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";
import { useUserPreferences } from "@/contexts/UserPreferencesContext";
import { useTableSession } from "@/contexts/TableSessionContext";
import { Switch } from "@/components/ui/switch";
import { analyticsService } from "@/services/analyticsService";
import { useRestaurantConfig } from "@/contexts/RestaurantConfigContext";
import { useMenuCategories, useMenuDishes, type DishWithDetails } from "@/hooks/useMenu";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import heroFood from "@/assets/hero-food.jpg";

/** Fetch the first active restaurant as a fallback */
function useDefaultRestaurant() {
  return useQuery({
    queryKey: ["default-restaurant"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("restaurants")
        .select("*")
        .eq("status", "active")
        .limit(1)
        .single();
      if (error) throw error;
      return data;
    },
  });
}

const Menu = () => {
  const [category, setCategory] = useState("all");
  const [cartOpen, setCartOpen] = useState(false);
  const [personalizedMode, setPersonalizedMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const { allergenKeys, allergens } = useUserPreferences();
  const { session, tableNumber } = useTableSession();
  const { config } = useRestaurantConfig();

  // Get restaurant
  const { data: restaurant, isLoading: restLoading } = useDefaultRestaurant();
  const restaurantId = restaurant?.id;

  // Fetch categories & dishes from Supabase
  const { data: categories = [], isLoading: catsLoading } = useMenuCategories(restaurantId);
  const { data: dishes = [], isLoading: dishesLoading } = useMenuDishes(restaurantId);

  const isLoading = restLoading || catsLoading || dishesLoading;

  const isCompatible = (dish: DishWithDetails) => {
    const dishAllergenNames = dish.allergens?.map((a) => a.allergen?.name?.toLowerCase()) ?? [];
    return !dishAllergenNames.some((name) => allergenKeys.some((k) => k === name));
  };

  // Search filter
  const searchFiltered = useMemo(() => {
    if (!searchQuery.trim()) return null;
    const q = searchQuery.toLowerCase();
    return dishes.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        (d.description?.toLowerCase().includes(q)) ||
        d.diet_tags?.some((t) => t.diet_type.toLowerCase().includes(q))
    );
  }, [dishes, searchQuery]);

  // Category filter
  const baseFiltered = useMemo(() => {
    if (searchFiltered) return searchFiltered;
    if (category === "all") return dishes;
    return dishes.filter((d) => d.category_id === category);
  }, [searchFiltered, category, dishes]);

  const filtered = personalizedMode ? baseFiltered.filter(isCompatible) : baseFiltered;

  const handleCheckout = () => {
    setCartOpen(false);
    if (config.paymentModel === "pay-later") {
      navigate("/order-confirmation");
    } else {
      navigate("/payment");
    }
  };

  const handleSearch = (q: string) => {
    setSearchQuery(q);
    if (q.trim()) {
      analyticsService.track("search_performed", { query: q });
    }
  };

  // Featured recommendations
  const recommended = useMemo(
    () =>
      dishes
        .filter((d) => d.is_featured)
        .filter((d) => !personalizedMode || isCompatible(d))
        .slice(0, 3),
    [dishes, personalizedMode, allergenKeys]
  );

  const categoryItems = categories.map((c) => ({ id: c.id, name: c.name }));

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Restaurant Header */}
      <div className="relative h-48 overflow-hidden">
        <img src={restaurant?.cover_url || heroFood} alt="Restaurant" className="w-full h-full object-cover" />
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
              <h1 className="text-2xl font-display font-bold mb-1">{restaurant?.name ?? "Menu"}</h1>
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
          {restaurant && (
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              {restaurant.address && <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {restaurant.address}</span>}
              {restaurant.phone && <span className="flex items-center gap-1">{restaurant.phone}</span>}
            </div>
          )}
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
                  <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2">
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
            <CategoryNav active={category} onChange={setCategory} categories={categoryItems} />
          </div>
        )}

        {searchQuery && (
          <p className="text-xs text-muted-foreground mb-4">
            {filtered.length} result{filtered.length !== 1 ? "s" : ""} for "{searchQuery}"
          </p>
        )}

        {/* Featured recommendations */}
        {!searchQuery && category === "all" && recommended.length > 0 && !isLoading && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-primary" />
              <h2 className="font-display font-semibold text-sm">Recommended for You</h2>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
              {recommended.map((dish) => (
                <div key={`rec-${dish.id}`} className="w-[200px] flex-shrink-0 bg-card border border-primary/20 rounded-2xl overflow-hidden hover-lift">
                  <div className="h-28 w-full overflow-hidden">
                    {dish.image_url ? (
                      <img src={dish.image_url} alt={dish.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-muted" />
                    )}
                  </div>
                  <div className="p-3">
                    <h4 className="font-semibold text-xs truncate">{dish.name}</h4>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-primary font-display font-bold text-xs">€{Number(dish.price).toFixed(2)}</span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded-full gradient-accent text-primary-foreground font-bold uppercase">
                        Featured
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Loading skeletons */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <MenuCardSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Menu items */}
        {!isLoading && (
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence mode="popLayout">
              {filtered.map((dish) => (
                <motion.div
                  key={dish.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.25 }}
                >
                  <SupabaseMenuCard dish={dish} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Empty state */}
        {!isLoading && filtered.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
            <p className="text-muted-foreground text-sm">
              {searchQuery
                ? `No dishes found for "${searchQuery}"`
                : dishes.length === 0
                ? "No dishes available yet. Check back soon!"
                : "No dishes match your filters in this category."}
            </p>
          </motion.div>
        )}
      </div>

      <FloatingCart onClick={() => setCartOpen(true)} />
      <CartSheet open={cartOpen} onClose={() => setCartOpen(false)} onCheckout={handleCheckout} />
    </div>
  );
};

export default Menu;
