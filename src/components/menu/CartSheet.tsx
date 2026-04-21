import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import PairingSuggestions from "@/components/menu/PairingSuggestions";
import CustomiseSheet from "@/components/menu/CustomiseSheet";
import { dishCustomisations } from "@/data/dishCustomizations";
import { useRestaurantConfig } from "@/contexts/RestaurantConfigContext";

interface Props {
  open: boolean;
  onClose: () => void;
  onCheckout: () => void;
  submitting?: boolean;
}

const CartSheet = ({ open, onClose, onCheckout, submitting = false }: Props) => {
  const { items, updateQuantity, removeItem, total } = useCart();
  const { config } = useRestaurantConfig();
  const [customiseItemId, setCustomiseItemId] = useState<string | null>(null);
  const isPayLater = config.paymentModel === "pay-later";

  if (!open) return null;

  const customiseItem = customiseItemId ? items.find((i) => i.id === customiseItemId) ?? null : null;
  const serviceFee = total * 0.05;
  const grandTotal = total + serviceFee;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-foreground/40 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      <div className="absolute bottom-0 left-0 right-0 max-h-[88vh] bg-surface rounded-t-3xl animate-slide-up overflow-hidden flex flex-col safe-bottom editorial-shadow">
        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-6 pb-4">
          <div>
            <p className="text-[10px] font-body font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-1">
              Your selection
            </p>
            <h2 className="font-display italic text-3xl text-foreground">Review your table</h2>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-surface-low flex items-center justify-center hover:bg-surface-high transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 pb-4 space-y-6">
          {items.length === 0 ? (
            <p className="text-center text-muted-foreground py-12 font-body italic">
              Your selection is empty
            </p>
          ) : (
            items.map((item) => {
              const hasCustomisation = !!dishCustomisations[item.id];
              const cust = item.customisations;
              const unitPrice = item.price + (cust?.priceAdjustment ?? 0);

              return (
                <div key={item.id} className="flex items-start gap-4 group">
                  <div className="w-20 h-20 rounded-2xl overflow-hidden bg-surface-high flex-shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-grow">
                    <div className="flex justify-between items-start mb-1 gap-3">
                      <h3 className="font-display text-xl text-foreground leading-tight">{item.name}</h3>
                      <span className="font-body font-semibold text-sm text-foreground tabular-nums shrink-0">
                        €{(unitPrice * item.quantity).toFixed(2)}
                      </span>
                    </div>

                    {cust && (
                      <div className="text-[11px] text-muted-foreground space-y-0.5 italic font-body mb-2">
                        {cust.removedIngredients.length > 0 && (
                          <p><span className="text-destructive not-italic">−</span> no {cust.removedIngredients.join(", ")}</p>
                        )}
                        {cust.addedExtras.length > 0 && (
                          <p><span className="text-primary not-italic">+</span> {cust.addedExtras.join(", ")}</p>
                        )}
                        {cust.cookingPoint && <p>· {cust.cookingPoint}</p>}
                      </div>
                    )}

                    <div className="flex items-center gap-3 mt-2">
                      <div className="flex items-center bg-surface-low rounded-full px-2 py-1">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-7 h-7 flex items-center justify-center text-primary"
                        >
                          <span className="material-symbols-outlined text-[18px]">remove</span>
                        </button>
                        <span className="px-2 font-body text-xs font-semibold tabular-nums">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-7 h-7 flex items-center justify-center text-primary"
                        >
                          <span className="material-symbols-outlined text-[18px]">add</span>
                        </button>
                      </div>
                      {hasCustomisation && (
                        <button
                          onClick={() => setCustomiseItemId(item.id)}
                          className="text-[10px] uppercase tracking-widest text-primary font-body font-semibold hover:underline underline-offset-4"
                        >
                          {cust ? "Edit" : "Customise"}
                        </button>
                      )}
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-[10px] uppercase tracking-widest text-muted-foreground/60 font-body font-medium hover:text-destructive transition-colors ml-auto"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}

          {items.length > 0 && (
            <PairingSuggestions lastAddedDishId={items[items.length - 1]?.id ?? null} />
          )}
        </div>

        {/* Totals + CTA */}
        {items.length > 0 && (
          <div className="px-6 pt-4 pb-6 bg-surface border-t border-border/30">
            <div className="space-y-2 mb-5">
              <div className="flex justify-between text-sm font-body text-muted-foreground">
                <span>Subtotal</span>
                <span className="tabular-nums">€{total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm font-body text-muted-foreground">
                <span>Service fee</span>
                <span className="tabular-nums">€{serviceFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-baseline pt-3">
                <span className="font-display italic text-2xl">Total</span>
                <span className="font-display text-2xl text-primary tabular-nums">€{grandTotal.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={onCheckout}
              disabled={submitting}
              className="w-full py-4 rounded-full gradient-accent text-primary-foreground font-body font-semibold text-sm uppercase tracking-[0.15em] glow-accent-sm editorial-shadow active:scale-[0.98] transition-all disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Placing order…
                </>
              ) : isPayLater ? (
                <>Send to kitchen <span className="material-symbols-outlined text-[18px]">arrow_forward</span></>
              ) : (
                <>Continue to payment <span className="material-symbols-outlined text-[18px]">arrow_forward</span></>
              )}
            </button>
            {isPayLater && (
              <p className="text-[10px] text-center text-muted-foreground mt-3 font-body uppercase tracking-widest">
                Settle the bill at the end of your meal
              </p>
            )}
          </div>
        )}
      </div>

      {customiseItem && (
        <CustomiseSheet item={customiseItem} onClose={() => setCustomiseItemId(null)} />
      )}
    </div>
  );
};

export default CartSheet;
