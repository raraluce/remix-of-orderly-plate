import { Plus, UtensilsCrossed } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/contexts/CartContext";
import type { DishWithDetails } from "@/hooks/useMenu";

const SupabaseMenuCard = ({ dish }: { dish: DishWithDetails }) => {
  const { addItem } = useCart();

  const allergenNames = dish.allergens?.map((a) => a.allergen?.name).filter(Boolean) ?? [];
  const dietTags = dish.diet_tags?.map((t) => t.diet_type) ?? [];

  const handleAdd = () =>
    addItem({
      id: dish.id,
      name: dish.name,
      price: Number(dish.price),
      image: dish.image_url || "/placeholder.svg",
    });

  return (
    <button
      type="button"
      onClick={handleAdd}
      className="group w-full text-left bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/30 transition-all duration-300 hover-lift focus:outline-none focus:ring-2 focus:ring-primary/40"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        {dish.image_url ? (
          <img src={dish.image_url} alt={dish.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full bg-muted flex flex-col items-center justify-center gap-2 p-4">
            <UtensilsCrossed className="w-8 h-8 text-muted-foreground/50" />
            <span className="text-xs text-muted-foreground/70 font-medium text-center line-clamp-2">{dish.name}</span>
          </div>
        )}
        {dish.is_featured && (
          <div className="absolute top-3 left-3">
            <span className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full gradient-accent text-primary-foreground">
              Featured
            </span>
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-display font-semibold text-base leading-tight">{dish.name}</h3>
          <span className="font-display font-bold text-primary shrink-0">€{Number(dish.price).toFixed(2)}</span>
        </div>
        {dish.description && (
          <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{dish.description}</p>
        )}
        {dietTags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-2">
            {dietTags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-[10px] px-2 py-0.5 bg-primary/10 text-primary border-primary/20">
                {tag}
              </Badge>
            ))}
          </div>
        )}
        {allergenNames.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {allergenNames.map((a) => (
              <Badge key={a} variant="outline" className="text-[10px] px-2 py-0.5 text-muted-foreground border-border">
                {a}
              </Badge>
            ))}
          </div>
        )}
        {dish.prep_time_mins && (
          <p className="text-[10px] text-muted-foreground mb-2">
            {dish.prep_time_mins} min{dish.calories ? ` · ${dish.calories} kcal` : ""}
          </p>
        )}
        <div
          role="presentation"
          className="w-full gradient-accent text-primary-foreground rounded-full font-semibold text-xs py-2 flex items-center justify-center pointer-events-none"
        >
          <Plus className="w-4 h-4 mr-1" /> Add to Order
        </div>
      </div>
    </button>
  );
};

export default SupabaseMenuCard;
