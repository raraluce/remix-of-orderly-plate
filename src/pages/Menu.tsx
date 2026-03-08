import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, Star, Clock, Sparkles, User, ShieldCheck } from "lucide-react";
import MenuCard from "@/components/menu/MenuCard";
import CategoryNav from "@/components/menu/CategoryNav";
import FloatingCart from "@/components/menu/FloatingCart";
import CartSheet from "@/components/menu/CartSheet";
import { menuItems, type Allergen, type DietaryTag } from "@/data/menuData";
import { useCart } from "@/contexts/CartContext";
import { Switch } from "@/components/ui/switch";
import heroFood from "@/assets/hero-food.jpg";

// Simulated user preferences (would come from profile/context in production)
const userAllergens: Allergen[] = ["nuts", "seafood"];
const userDietaryPrefs: DietaryTag[] = [];

const isCompatible = (item: typeof menuItems[0]) => {
  const hasAllergen = item.allergens.some((a) => userAllergens.includes(a));
  return !hasAllergen;
};

const Menu = () => {
  const [category, setCategory] = useState("popular");
  const [cartOpen, setCartOpen] = useState(false);
  const [personalizedMode, setPersonalizedMode] = useState(false);
  const navigate = useNavigate();
  const { clearCart } = useCart();

  const baseFiltered = category === "popular"
    ? menuItems.filter((i) => i.tags?.some((t) => ["Chef's Pick", "Popular", "New", "Must Try"].includes(t)))
    : menuItems.filter((i) => i.category === category);

  const filtered = personalizedMode ? baseFiltered.filter(isCompatible) : baseFiltered;

  const handleCheckout = () => {
    setCartOpen(false);
    navigate("/payment");
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
        <Link to="/" className="absolute top-4 left-4 z-10 w-10 h-10 rounded-full glass flex items-center justify-center">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <Link to="/profile" className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full glass flex items-center justify-center">
          <User className="w-5 h-5" />
        </Link>
      </div>

      <div className="container mx-auto px-4 -mt-12 relative z-10">
        <div className="mb-4">
          <h1 className="text-2xl font-display font-bold mb-1">The Grand Kitchen</h1>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1"><Star className="w-4 h-4 text-primary fill-primary" /> 4.8</span>
            <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> 20-30 min</span>
            <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> 0.3 mi</span>
          </div>
        </div>

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

        {personalizedMode && (
          <div className="mb-4 flex flex-wrap gap-1.5">
            {userAllergens.map((a) => (
              <span key={a} className="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-destructive/15 text-destructive border border-destructive/20 capitalize">
                No {a}
              </span>
            ))}
          </div>
        )}

        <div className="mb-6 sticky top-0 z-20 bg-background py-3">
          <CategoryNav active={category} onChange={setCategory} />
        </div>

        {/* Recommendations */}
        {category === "popular" && recommended.length > 0 && (
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((item) => (
            <MenuCard key={item.id} item={item} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-sm">No dishes match your filters in this category.</p>
          </div>
        )}
      </div>

      <FloatingCart onClick={() => setCartOpen(true)} />
      <CartSheet open={cartOpen} onClose={() => setCartOpen(false)} onCheckout={handleCheckout} />
    </div>
  );
};

export default Menu;
