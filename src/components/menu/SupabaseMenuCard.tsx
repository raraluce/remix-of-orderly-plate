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
      className="group w-full text-left flex gap-4 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 rounded-2xl"
    >
      {/* Image — soft 16px rounded thumbnail (Stitch list pattern) */}
      <div className="w-24 h-24 flex-shrink-0 rounded-2xl overflow-hidden bg-surface-high">
        {dish.image_url ? (
          <img
            src={dish.image_url}
            alt={dish.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-1 p-2 bg-surface-high">
            <span className="material-symbols-outlined text-muted-foreground/60 text-[24px]">restaurant</span>
            <span className="text-[9px] text-muted-foreground/70 font-body text-center line-clamp-2 leading-tight">
              {dish.name}
            </span>
          </div>
        )}
      </div>

      {/* Editorial info */}
      <div className="flex-grow flex flex-col justify-center">
        <div className="flex justify-between items-start mb-1 gap-3">
          <h4 className="font-display text-lg leading-snug text-foreground">{dish.name}</h4>
          <span className="font-body font-semibold text-sm text-primary tabular-nums shrink-0">
            €{Number(dish.price).toFixed(2)}
          </span>
        </div>
        {dish.description && (
          <p className="text-muted-foreground text-sm font-body font-light leading-relaxed line-clamp-2 mb-2">
            {dish.description}
          </p>
        )}
        <div className="flex items-center gap-2 flex-wrap">
          {dish.is_featured && (
            <span className="text-[9px] font-body font-bold uppercase tracking-[0.15em] text-primary">
              · Chef's pick
            </span>
          )}
          {dietTags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="text-[9px] font-body font-medium uppercase tracking-wider text-muted-foreground bg-surface-low px-2 py-0.5 rounded"
            >
              {tag}
            </span>
          ))}
          {allergenNames.length > 0 && (
            <span className="text-[9px] font-body font-medium uppercase tracking-wider text-muted-foreground/70">
              · contains {allergenNames.slice(0, 2).join(", ")}
            </span>
          )}
          {dish.prep_time_mins && (
            <span className="text-[9px] font-body font-medium uppercase tracking-wider text-muted-foreground/70">
              · {dish.prep_time_mins}m
            </span>
          )}
        </div>
      </div>
    </button>
  );
};

export default SupabaseMenuCard;
