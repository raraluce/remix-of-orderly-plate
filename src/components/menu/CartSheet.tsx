import { X, Minus, Plus, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";

interface Props {
  open: boolean;
  onClose: () => void;
  onCheckout: () => void;
}

const CartSheet = ({ open, onClose, onCheckout }: Props) => {
  const { items, updateQuantity, removeItem, total } = useCart();

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-background/60 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute bottom-0 left-0 right-0 max-h-[85vh] bg-card border-t border-border rounded-t-3xl animate-slide-up overflow-hidden flex flex-col">
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
            items.map((item) => (
              <div key={item.id} className="flex gap-3 items-center">
                <img src={item.image} alt={item.name} className="w-16 h-16 rounded-xl object-cover" />
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-sm truncate">{item.name}</h4>
                  <p className="text-sm text-primary font-display font-bold">${(item.price * item.quantity).toFixed(2)}</p>
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
            ))
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
              <CreditCard className="w-5 h-5 mr-2" /> Pay Now
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartSheet;
