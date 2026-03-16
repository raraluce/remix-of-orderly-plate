import { useState, useMemo } from "react";
import { X, Minus, Plus, ChefHat, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useCart, type CartItem } from "@/contexts/CartContext";
import {
  dishCustomisations,
  type IngredientOption,
  type CookingPoint,
} from "@/data/dishCustomizations";

interface Props {
  item: CartItem;
  onClose: () => void;
}

const CustomiseSheet = ({ item, onClose }: Props) => {
  const { updateCustomisations } = useCart();
  const config = dishCustomisations[item.id];

  // Build initial state from item's existing customisations or defaults
  const defaultIngredients = config?.ingredients ?? [];
  const initialRemoved = item.customisations?.removedIngredients ?? [];
  const initialAdded = item.customisations?.addedExtras ?? [];
  const initialCooking = item.customisations?.cookingPoint ?? null;

  const [removedIngredients, setRemovedIngredients] = useState<string[]>(initialRemoved);
  const [addedExtras, setAddedExtras] = useState<string[]>(initialAdded);
  const [cookingPoint, setCookingPoint] = useState<string | null>(initialCooking);

  const toggleDefaultIngredient = (name: string) => {
    setRemovedIngredients((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
    );
  };

  const toggleExtra = (name: string) => {
    setAddedExtras((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
    );
  };

  const extrasCost = useMemo(() => {
    return defaultIngredients
      .filter((i) => !i.default && addedExtras.includes(i.name))
      .reduce((sum, i) => sum + i.extraCost, 0);
  }, [addedExtras, defaultIngredients]);

  const cookingDelta = useMemo(() => {
    if (!cookingPoint || !config?.cookingPoints) return 0;
    return config.cookingPoints.find((c) => c.label === cookingPoint)?.delta ?? 0;
  }, [cookingPoint, config]);

  const adjustedPrice = item.price + extrasCost + cookingDelta;

  const handleSave = () => {
    updateCustomisations(item.id, {
      removedIngredients,
      addedExtras,
      cookingPoint,
      priceAdjustment: extrasCost + cookingDelta,
    });
    onClose();
  };

  if (!config) return null;

  const defaults = defaultIngredients.filter((i) => i.default);
  const extras = defaultIngredients.filter((i) => !i.default);

  return (
    <div className="fixed inset-0 z-[60]">
      <div
        className="absolute inset-0 bg-background/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="absolute bottom-0 left-0 right-0 max-h-[90vh] bg-card border-t border-border rounded-t-3xl animate-slide-up overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border">
          <div className="flex items-center gap-2">
            <ChefHat className="w-5 h-5 text-primary" />
            <h2 className="font-display font-bold text-lg">Customise</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-secondary transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dish info */}
        <div className="px-5 pt-4 pb-2 flex items-center gap-3 border-b border-border">
          <img
            src={item.image}
            alt={item.name}
            className="w-14 h-14 rounded-xl object-cover"
          />
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm truncate">{item.name}</h3>
            <p className="text-xs text-muted-foreground">
              Base ${item.price.toFixed(2)}
              {extrasCost + cookingDelta > 0 && (
                <span className="text-primary font-semibold">
                  {" "}
                  + ${(extrasCost + cookingDelta).toFixed(2)}
                </span>
              )}
            </p>
          </div>
          <span className="text-lg font-display font-bold text-primary">
            ${adjustedPrice.toFixed(2)}
          </span>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* Included ingredients (can remove) */}
          {defaults.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Included Ingredients
              </h3>
              <p className="text-[11px] text-muted-foreground -mt-1">
                Uncheck to remove
              </p>
              <div className="space-y-2">
                {defaults.map((ing) => {
                  const isRemoved = removedIngredients.includes(ing.name);
                  return (
                    <label
                      key={ing.name}
                      className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all duration-200 ${
                        isRemoved
                          ? "bg-secondary/50 border-border opacity-60"
                          : "bg-secondary border-border"
                      }`}
                    >
                      <Checkbox
                        checked={!isRemoved}
                        onCheckedChange={() => toggleDefaultIngredient(ing.name)}
                      />
                      <span
                        className={`text-sm font-medium flex-1 ${
                          isRemoved ? "line-through text-muted-foreground" : ""
                        }`}
                      >
                        {ing.name}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          {/* Extras (add for cost) */}
          {extras.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Plus className="w-3.5 h-3.5" /> Add Extras
              </h3>
              <div className="space-y-2">
                {extras.map((ing) => {
                  const isAdded = addedExtras.includes(ing.name);
                  return (
                    <label
                      key={ing.name}
                      className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all duration-200 ${
                        isAdded
                          ? "bg-primary/10 border-primary/30"
                          : "bg-secondary border-border hover:border-border/80"
                      }`}
                    >
                      <Checkbox
                        checked={isAdded}
                        onCheckedChange={() => toggleExtra(ing.name)}
                      />
                      <span className="text-sm font-medium flex-1">
                        {ing.name}
                      </span>
                      <span className="text-xs font-display font-bold text-primary shrink-0">
                        +${ing.extraCost.toFixed(2)}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          {/* Cooking point */}
          {config.cookingPoints && config.cookingPoints.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5" /> Cooking Point
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {config.cookingPoints.map((cp) => (
                  <button
                    key={cp.label}
                    onClick={() => setCookingPoint(cp.label)}
                    className={`p-3 rounded-xl text-left transition-all duration-200 border ${
                      cookingPoint === cp.label
                        ? "gradient-accent text-primary-foreground border-transparent glow-accent-sm"
                        : "bg-secondary border-border text-foreground hover:border-border/80"
                    }`}
                  >
                    <p className="text-sm font-semibold">{cp.label}</p>
                    <p
                      className={`text-[11px] ${
                        cookingPoint === cp.label
                          ? "text-primary-foreground/70"
                          : "text-muted-foreground"
                      }`}
                    >
                      {cp.description}
                    </p>
                    {cp.delta > 0 && (
                      <p className="text-xs font-bold mt-0.5">
                        +${cp.delta.toFixed(2)}
                      </p>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Save */}
        <div className="p-5 border-t border-border">
          <Button
            onClick={handleSave}
            className="w-full gradient-accent text-primary-foreground rounded-full py-6 text-base font-semibold glow-accent"
          >
            Save Customisation — ${adjustedPrice.toFixed(2)}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CustomiseSheet;
