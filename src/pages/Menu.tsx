import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, Star, Clock, Sparkles, User } from "lucide-react";
import MenuCard from "@/components/menu/MenuCard";
import CategoryNav from "@/components/menu/CategoryNav";
import FloatingCart from "@/components/menu/FloatingCart";
import CartSheet from "@/components/menu/CartSheet";
import { menuItems } from "@/data/menuData";
import { useCart } from "@/contexts/CartContext";
import heroFood from "@/assets/hero-food.jpg";

const Menu = () => {
  const [category, setCategory] = useState("popular");
  const [cartOpen, setCartOpen] = useState(false);
  const navigate = useNavigate();
  const { clearCart } = useCart();

  const filtered = category === "popular"
    ? menuItems.filter((i) => i.tags?.some((t) => ["Chef's Pick", "Popular", "New", "Must Try"].includes(t)))
    : menuItems.filter((i) => i.category === category);

  const handleCheckout = () => {
    setCartOpen(false);
    navigate("/payment");
  };

  // Recommended dishes based on popularity
  const recommended = menuItems.filter((i) => i.tags?.some((t) => ["Chef's Pick", "Must Try", "Popular"].includes(t))).slice(0, 3);

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Restaurant Header */}
      <div className="relative h-48 overflow-hidden">
        <img src={heroFood} alt="Restaurant" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        <Link to="/" className="absolute top-4 left-4 z-10 w-10 h-10 rounded-full glass flex items-center justify-center">
          <ArrowLeft className="w-5 h-5" />
        </Link>
      </div>

      <div className="container mx-auto px-4 -mt-12 relative z-10">
        <div className="mb-6">
          <h1 className="text-2xl font-display font-bold mb-1">The Grand Kitchen</h1>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1"><Star className="w-4 h-4 text-primary fill-primary" /> 4.8</span>
            <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> 20-30 min</span>
            <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> 0.3 mi</span>
          </div>
        </div>

        <div className="mb-6 sticky top-0 z-20 bg-background py-3">
          <CategoryNav active={category} onChange={setCategory} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((item) => (
            <MenuCard key={item.id} item={item} />
          ))}
        </div>
      </div>

      <FloatingCart onClick={() => setCartOpen(true)} />
      <CartSheet open={cartOpen} onClose={() => setCartOpen(false)} onCheckout={handleCheckout} />
    </div>
  );
};

export default Menu;
