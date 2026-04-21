import { useState, useMemo, useCallback } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
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

function useDefaultRestaurant(enabled: boolean) {
  return useQuery({
    queryKey: ["default-restaurant"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("restaurants").select("*").eq("status", "active").limit(1).single();
      if (error) throw error;
      return data;
    },
    enabled,
  });
}

function useRestaurantById(id: string | null) {
  return useQuery({
    queryKey: ["restaurant", id],
    queryFn: async () => {
      const { data, error } = await supabase.from("restaurants").select("*").eq("id", id!).single();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });
}

const Menu = () => {
  const [category, setCategory] = useState("all");
  const [cartOpen, setCartOpen] = useState(false);
  const [personalizedMode, setPersonalizedMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { items, clearCart } = useCart();
  const { allergenKeys, allergens } = useUserPreferences();
  const { session, tableNumber } = useTableSession();

  const sessionId = searchParams.get("session");
  const urlRestaurantId = searchParams.get("restaurant");

  const { data: byId, isLoading: byIdLoading } = useRestaurantById(urlRestaurantId);
  const { data: fallback, isLoading: fallbackLoading } = useDefaultRestaurant(!urlRestaurantId);
  const restaurant = byId ?? fallback;
  const restLoading = urlRestaurantId ? byIdLoading : fallbackLoading;
  const restaurantId = restaurant?.id;

  const { data: categories = [], isLoading: catsLoading } = useMenuCategories(restaurantId);
  const { data: dishes = [], isLoading: dishesLoading } = useMenuDishes(restaurantId);

  const isLoading = restLoading || catsLoading || dishesLoading;

  const isCompatible = (dish: DishWithDetails) => {
    const dishAllergenNames = dish.allergens?.map((a) => a.allergen?.name?.toLowerCase()) ?? [];
    return !dishAllergenNames.some((name) => allergenKeys.some((k) => k === name));
  };

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

  const baseFiltered = useMemo(() => {
    if (searchFiltered) return searchFiltered;
    if (category === "all") return dishes;
    return dishes.filter((d) => d.category_id === category);
  }, [searchFiltered, category, dishes]);

  const filtered = personalizedMode ? baseFiltered.filter(isCompatible) : baseFiltered;

  // Group by category for editorial sections
  const groupedByCategory = useMemo(() => {
    if (searchFiltered || category !== "all") return null;
    return categories
      .map((cat) => ({
        ...cat,
        dishes: filtered.filter((d) => d.category_id === cat.id),
      }))
      .filter((c) => c.dishes.length > 0);
  }, [categories, filtered, searchFiltered, category]);

  const handleCheckout = useCallback(async () => {
    if (!sessionId || !urlRestaurantId) {
      toast.error("No active table session. Please scan a QR code to start.");
      return;
    }
    if (items.length === 0) return;

    setSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { data: order, error: orderErr } = await supabase
        .from("orders")
        .insert({
          restaurant_id: urlRestaurantId,
          session_id: sessionId,
          user_id: user?.id ?? null,
          status: "submitted",
          submitted_at: new Date().toISOString(),
        })
        .select("id")
        .single();
      if (orderErr || !order) throw orderErr ?? new Error("Failed to create order");

      const orderItems = items.map((item) => ({
        order_id: order.id,
        session_id: sessionId,
        dish_id: item.id,
        quantity: item.quantity,
        unit_price: item.price,
      }));
      const { error: itemsErr } = await supabase.from("order_items").insert(orderItems);
      if (itemsErr) throw itemsErr;

      setCartOpen(false);
      const orderTotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
      navigate("/order-confirmation", {
        state: {
          orderId: order.id,
          itemCount: items.reduce((s, i) => s + i.quantity, 0),
          total: orderTotal,
          sessionId,
          restaurantId: urlRestaurantId,
        },
      });
      clearCart();
    } catch (err: any) {
      console.error("Order submission failed:", err);
      toast.error(err?.message || "Failed to submit order. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }, [sessionId, urlRestaurantId, items, navigate, clearCart]);

  const handleSearch = (q: string) => {
    setSearchQuery(q);
    if (q.trim()) analyticsService.track("search_performed", { query: q });
  };

  const categoryItems = categories.map((c) => ({ id: c.id, name: c.name }));

  return (
    <div className="min-h-screen bg-background pb-32 paper-grain">
      {/* Editorial top app bar — glass */}
      <header className="fixed top-0 left-0 right-0 z-50 glass-strong">
        <div className="flex justify-between items-center w-full px-6 h-16">
          <Link
            to={session ? "/table" : "/"}
            className="text-primary hover:opacity-80 transition-opacity active:scale-95"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </Link>
          <h1 className="font-display italic font-bold text-primary text-2xl tracking-tight">bite.</h1>
          <Link to="/profile" className="text-primary hover:opacity-80 transition-opacity active:scale-95">
            <span className="material-symbols-outlined">account_circle</span>
          </Link>
        </div>
      </header>

      <main className="pt-24 px-6 max-w-2xl mx-auto">
        {/* Restaurant masthead */}
        <section className="mb-10">
          <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-body font-semibold mb-3">
            {session && tableNumber ? `Table ${tableNumber} · ` : ""}
            {session ? `${session.users.length} guest${session.users.length > 1 ? "s" : ""}` : "Spring Menu"}
          </p>
          <h2 className="font-display text-5xl text-foreground leading-[1.05]">
            {restaurant?.name ?? "Seasonal"}
            <br />
            <span className="italic text-primary">Curations</span>
          </h2>
          {restaurant?.description && (
            <p className="text-sm text-muted-foreground font-body font-light leading-relaxed mt-4 max-w-md">
              {restaurant.description}
            </p>
          )}
        </section>

        {/* Search — bottom-only ghost border */}
        <div className="relative mb-8">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/60">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search the menu..."
            className="w-full bg-surface-low border-none rounded-2xl py-4 pl-12 pr-4 font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary-fixed-dim placeholder:text-muted-foreground/50 transition-all"
          />
        </div>

        {/* Personalised toggle */}
        <div className="flex items-center justify-between mb-6 bg-surface-low rounded-2xl px-5 py-4">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-primary text-[22px]">verified</span>
            <div>
              <p className="text-sm font-body font-semibold">Safe for me</p>
              <p className="text-[11px] text-muted-foreground font-body font-light">Hide dishes with your allergens</p>
            </div>
          </div>
          <Switch checked={personalizedMode} onCheckedChange={setPersonalizedMode} />
        </div>

        <AnimatePresence>
          {personalizedMode && allergens.length > 0 && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mb-6"
            >
              <div className="flex flex-wrap gap-1.5">
                {allergens.map((a) => (
                  <span key={a} className="px-3 py-1 text-[10px] font-body font-semibold uppercase tracking-wider rounded-full bg-destructive/10 text-destructive">
                    No {a}
                  </span>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Category chips */}
        {!searchQuery && (
          <div className="mb-10 sticky top-16 z-30 bg-background/90 backdrop-blur-md py-3 -mx-6 px-6">
            <CategoryNav active={category} onChange={setCategory} categories={categoryItems} />
          </div>
        )}

        {searchQuery && (
          <p className="text-xs uppercase tracking-widest text-muted-foreground font-body font-semibold mb-6">
            {filtered.length} result{filtered.length !== 1 ? "s" : ""} for "{searchQuery}"
          </p>
        )}

        {/* Loading */}
        {isLoading && (
          <div className="space-y-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <MenuCardSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Editorial grouped sections */}
        {!isLoading && groupedByCategory && groupedByCategory.length > 0 && (
          <>
            {groupedByCategory.map((cat, idx) => (
              <section key={cat.id} className="mb-12">
                <div className="flex justify-between items-end mb-6">
                  <h3 className="font-display italic text-3xl text-foreground">{cat.name}</h3>
                  <span className="font-body text-[10px] tracking-[0.2em] uppercase text-muted-foreground/70">
                    {String(idx * 10 + 1).padStart(2, "0")} — {String(idx * 10 + cat.dishes.length).padStart(2, "0")}
                  </span>
                </div>
                <div className="space-y-6">
                  {cat.dishes.map((dish) => (
                    <SupabaseMenuCard key={dish.id} dish={dish} />
                  ))}
                </div>
              </section>
            ))}
          </>
        )}

        {/* Filtered (search/category) */}
        {!isLoading && (!groupedByCategory || groupedByCategory.length === 0) && filtered.length > 0 && (
          <motion.div layout className="space-y-6">
            <AnimatePresence mode="popLayout">
              {filtered.map((dish) => (
                <motion.div
                  key={dish.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                >
                  <SupabaseMenuCard dish={dish} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Empty */}
        {!isLoading && filtered.length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-sm font-body italic">
              {searchQuery
                ? `No dishes found for "${searchQuery}"`
                : dishes.length === 0
                ? "No dishes available yet. Check back soon."
                : "No dishes match your filters in this category."}
            </p>
          </div>
        )}
      </main>

      <FloatingCart onClick={() => setCartOpen(true)} />
      <CartSheet open={cartOpen} onClose={() => setCartOpen(false)} onCheckout={handleCheckout} submitting={submitting} />
    </div>
  );
};

export default Menu;
