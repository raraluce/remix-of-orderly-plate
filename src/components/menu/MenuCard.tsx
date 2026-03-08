import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/contexts/CartContext";
import type { MenuItem } from "@/data/menuData";
import { allergenLabels, dietaryTagLabels } from "@/data/menuData";

const MenuCard = ({ item }: { item: MenuItem }) => {
  const { addItem } = useCart();

  return (
    <div className="group bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/30 transition-all duration-300 hover-lift">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        {item.tags && item.tags.length > 0 && (
          <div className="absolute top-3 left-3 flex gap-2">
            {item.tags.map((tag) => (
              <span key={tag} className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full gradient-accent text-primary-foreground">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-display font-semibold text-base">{item.name}</h3>
          <span className="font-display font-bold text-primary shrink-0">${item.price.toFixed(2)}</span>
        </div>
        <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{item.description}</p>
        {item.dietaryTags && item.dietaryTags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-2">
            {item.dietaryTags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-[10px] px-2 py-0.5 bg-primary/10 text-primary border-primary/20">
                {dietaryTagLabels[tag]}
              </Badge>
            ))}
          </div>
        )}
        {item.allergens && item.allergens.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {item.allergens.map((a) => (
              <Badge key={a} variant="outline" className="text-[10px] px-2 py-0.5 text-muted-foreground border-border">
                {allergenLabels[a]}
              </Badge>
            ))}
          </div>
        )}
        {item.portionSize > 0 && (
          <p className="text-[10px] text-muted-foreground mb-2">
            Portion: {item.portionSize}{item.type === "drink" ? "ml" : "g"}
          </p>
        )}
        <Button
          size="sm"
          className="w-full gradient-accent text-primary-foreground rounded-full font-semibold text-xs"
          onClick={() => addItem({
            id: item.id, name: item.name, price: item.price, image: item.image,
            pairingTags: item.pairingTags, category: item.category, type: item.type, preference: item.preference,
          })}
        >
          <Plus className="w-4 h-4 mr-1" /> Add to Order
        </Button>
      </div>
    </div>
  );
};

export default MenuCard;
