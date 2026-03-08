import { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { consumerPatternService } from "@/services/consumerPatternService";
import type { MenuItem } from "@/data/menuData";

interface PairingSuggestionsProps {
  lastAddedDishId: string | null;
}

const PairingSuggestions = ({ lastAddedDishId }: PairingSuggestionsProps) => {
  const { addItem, items } = useCart();

  const suggestions = useMemo(() => {
    if (!lastAddedDishId) return [];
    const results = consumerPatternService.getSuggestionsForDish(lastAddedDishId, 3);
    // Filter out items already in cart
    const cartIds = new Set(items.map((i) => i.id));
    return results.filter((s) => !cartIds.has(s.dish.id));
  }, [lastAddedDishId, items]);

  if (suggestions.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="space-y-2"
      >
        <div className="flex items-center gap-1.5 px-1">
          <Sparkles className="w-3.5 h-3.5 text-primary" />
          <p className="text-xs font-semibold text-muted-foreground">Others also ordered</p>
        </div>
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {suggestions.map(({ dish, score }) => (
            <motion.div
              key={dish.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-2 px-3 py-2 bg-secondary rounded-xl min-w-fit shrink-0"
            >
              <img src={dish.image} alt={dish.name} className="w-8 h-8 rounded-lg object-cover" />
              <div className="min-w-0">
                <p className="text-xs font-semibold truncate max-w-[120px]">{dish.name}</p>
                <p className="text-[10px] text-muted-foreground">${dish.price.toFixed(2)}</p>
              </div>
              <Button
                size="sm"
                variant="ghost"
                className="h-7 w-7 p-0 rounded-full hover:bg-primary/10"
                onClick={() => addItem({
                  id: dish.id, name: dish.name, price: dish.price, image: dish.image,
                  category: dish.category, type: dish.type, preference: dish.preference,
                })}
              >
                <Plus className="w-3.5 h-3.5 text-primary" />
              </Button>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PairingSuggestions;
