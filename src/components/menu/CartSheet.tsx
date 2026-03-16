import { useState } from "react";
import { X, Minus, Plus, CreditCard, ChefHat, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import PairingSuggestions from "@/components/menu/PairingSuggestions";
import CustomiseSheet from "@/components/menu/CustomiseSheet";
import { dishCustomisations } from "@/data/dishCustomizations";
import { useRestaurantConfig } from "@/contexts/RestaurantConfigContext";

interface Props {
  open: boolean;
  onClose: () => void;
  onCheckout: () => void;
}

const CartSheet = ({ open, onClose, onCheckout }: Props) => {
  const { items, updateQuantity, removeItem, total } = useCart();
  const [customiseItemId, setCustomiseItemId] = useState<string | null>(null);

  if (!open) return null;

  const customiseItem = customiseItemId
    ? items.find((i) => i.id === customiseItemId) ?? null
    : null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-background/60 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute bottom-0 left-0 right-0 max-h-[85vh] bg-card border-t border-border rounded-t-3xl animate-slide-up overflow-hidden flex flex-col pb-20">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h2 className="font-display font-bold text-lg">Your Order</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-secondary transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {items.length === 0 ? (
            <p className="text-center text-muted-foreground py-12">Your cart is empty</p>
          ) : (
            items.map((item) => {
              const hasCustomisation = !!dishCustomisations[item.id];
              const cust = item.customisations;
              const unitPrice = item.price + (cust?.priceAdjustment ?? 0);

              return (
                <div key={item.id} className="space-y-2">
                  <div className="flex gap-3 items-center">
                    <img src={item.image} alt={item.name} className="w-16 h-16 rounded-xl object-cover" />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm truncate">{item.name}</h4>
                      <p className="text-sm text-primary font-display font-bold">
                        ${(unitPrice * item.quantity).toFixed(2)}
                        {(cust?.priceAdjustment ?? 0) > 0 && (
                          <span className="text-[11px] text-muted-foreground font-normal ml-1">
                            (${item.price.toFixed(2)} + ${cust!.priceAdjustment.toFixed(2)})
                          </span>
                        )}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center hover:bg-surface-hover transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-6 text-center text-sm font-semibold">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center hover:bg-surface-hover transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {/* Customisation summary & button */}
                  <div className="pl-[76px] flex flex-col gap-1">
                    {cust && (
                      <div className="text-[11px] text-muted-foreground space-y-0.5">
                        {cust.removedIngredients.length > 0 && (
                          <p>
                            <span className="text-destructive">−</span>{" "}
                            {cust.removedIngredients.join(", ")}
                          </p>
                        )}
                        {cust.addedExtras.length > 0 && (
                          <p>
                            <span className="text-primary">+</span>{" "}
                            {cust.addedExtras.join(", ")}
                          </p>
                        )}
                        {cust.cookingPoint && (
                          <p className="flex items-center gap-1">
                            <span className="text-amber-500">🔥</span> {cust.cookingPoint}
                          </p>
                        )}
                      </div>
                    )}
                    {hasCustomisation && (
                      <button
                        onClick={() => setCustomiseItemId(item.id)}
                        className="flex items-center gap-1 text-[11px] font-semibold text-primary hover:text-primary/80 transition-colors w-fit"
                      >
                        <ChefHat className="w-3 h-3" />
                        {cust ? "Edit" : "Customise"}
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}

          {/* Smart pairing suggestions */}
          {items.length > 0 && (
            <PairingSuggestions lastAddedDishId={items[items.length - 1]?.id ?? null} />
          )}
        </div>

        {items.length > 0 && (
          <div className="p-5 border-t border-border space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-semibold">${total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Service fee</span>
              <span className="font-semibold">${(total * 0.05).toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-display font-bold text-lg">
              <span>Total</span>
              <span className="text-gradient">${(total * 1.05).toFixed(2)}</span>
            </div>
            <Button
              className="w-full gradient-accent text-primary-foreground rounded-full py-6 text-base font-semibold glow-accent"
              onClick={onCheckout}
            >
              <CreditCard className="w-5 h-5 mr-2" /> Continue to Payment
            </Button>
          </div>
        )}
      </div>

      {/* Customisation overlay */}
      {customiseItem && (
        <CustomiseSheet
          item={customiseItem}
          onClose={() => setCustomiseItemId(null)}
        />
      )}
    </div>
  );
};

export default CartSheet;
