import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Star, Clock, MapPin, Phone, Bookmark, CalendarDays } from "lucide-react";
import { restaurants } from "@/data/restaurants";
import { menuItems } from "@/data/menuData";
import MenuCard from "@/components/menu/MenuCard";
import CategoryNav from "@/components/menu/CategoryNav";
import FloatingCart from "@/components/menu/FloatingCart";
import CartSheet from "@/components/menu/CartSheet";
import ReservationSheet from "@/components/app/ReservationSheet";
import BottomNav from "@/components/app/BottomNav";
import { useAppUser } from "@/contexts/AppUserContext";

const RestaurantView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAppUser } = useAppUser();
  const restaurant = restaurants.find((r) => r.id === id);
  const [category, setCategory] = useState("popular");
  const [cartOpen, setCartOpen] = useState(false);
  const [reserveOpen, setReserveOpen] = useState(false);

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Restaurant not found</p>
      </div>
    );
  }

  // For now both restaurants share the same menu — future: separate menus
  const baseFiltered =
    category === "popular"
      ? menuItems.filter((i) => i.tags?.some((t) => ["Chef's Pick", "Popular", "New", "Must Try"].includes(t)))
      : menuItems.filter((i) => i.category === category);

  return (
    <div className={`min-h-screen bg-background ${isAppUser ? "pb-24" : "pb-20"}`}>
      {/* Hero */}
      <div className="relative h-56 overflow-hidden">
        <img src={restaurant.coverImage} alt={restaurant.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 z-10 w-10 h-10 rounded-full glass flex items-center justify-center"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="absolute top-4 right-4 z-10 flex gap-2">
          <button className="w-10 h-10 rounded-full glass flex items-center justify-center">
            <Bookmark className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-10 relative z-10">
        {/* Info */}
        <div className="mb-4">
          <h1 className="text-2xl font-display font-bold mb-1">{restaurant.name}</h1>
          <p className="text-sm text-muted-foreground mb-2">{restaurant.description}</p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
            <span className="flex items-center gap-1">
              <Star className="w-4 h-4 text-primary fill-primary" /> {restaurant.rating}
              <span className="text-[10px]">({restaurant.reviewCount})</span>
            </span>
            <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {restaurant.openHours}</span>
            <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {restaurant.distance}</span>
          </div>
          <div className="flex flex-wrap gap-1.5 mb-4">
            {restaurant.tags.map((tag) => (
              <span key={tag} className="px-2.5 py-1 text-[10px] font-semibold rounded-full bg-secondary text-secondary-foreground">
                {tag}
              </span>
            ))}
          </div>

          {/* Reserve button */}
          <button
            onClick={() => setReserveOpen(true)}
            className="w-full py-3.5 rounded-2xl gradient-accent text-primary-foreground font-display font-bold text-sm glow-accent-sm flex items-center justify-center gap-2 mb-4"
          >
            <CalendarDays className="w-4 h-4" /> Reserve a Table
          </button>
        </div>

        {/* Categories */}
        <div className="mb-6 sticky top-0 z-20 bg-background py-3">
          <CategoryNav active={category} onChange={setCategory} />
        </div>

        {/* Menu items */}
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {baseFiltered.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.25 }}
            >
              <MenuCard item={item} />
            </motion.div>
          ))}
        </motion.div>

        {baseFiltered.length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-sm">No dishes in this category.</p>
          </div>
        )}
      </div>

      <FloatingCart onClick={() => setCartOpen(true)} />
      <CartSheet
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        onCheckout={() => { setCartOpen(false); navigate("/payment"); }}
      />
      <ReservationSheet
        open={reserveOpen}
        onClose={() => setReserveOpen(false)}
        restaurant={restaurant}
      />
      {isAppUser && <BottomNav />}
    </div>
  );
};

export default RestaurantView;
