import { ShoppingBag } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

interface Props {
  onClick: () => void;
}

const FloatingCart = ({ onClick }: Props) => {
  const { itemCount, total } = useCart();

  if (itemCount === 0) return null;

  return (
    <button
      onClick={onClick}
      className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 gradient-accent text-primary-foreground rounded-full px-6 py-3 flex items-center gap-3 shadow-2xl glow-accent animate-slide-up hover:scale-105 transition-transform"
    >
      <div className="relative">
        <ShoppingBag className="w-5 h-5" />
        <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-background text-foreground text-[10px] font-bold flex items-center justify-center">
          {itemCount}
        </span>
      </div>
      <span className="font-semibold">View Order</span>
      <span className="font-display font-bold">${total.toFixed(2)}</span>
    </button>
  );
};

export default FloatingCart;
