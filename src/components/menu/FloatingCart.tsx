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
      className="fixed bottom-24 right-6 z-40 flex items-center gap-3 gradient-accent text-primary-foreground rounded-full pl-5 pr-6 py-4 editorial-shadow glow-accent-sm animate-slide-up active:scale-95 transition-transform"
    >
      <div className="relative">
        <span className="material-symbols-outlined text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>
          shopping_bag
        </span>
        <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-foreground text-background text-[10px] font-bold flex items-center justify-center">
          {itemCount}
        </span>
      </div>
      <span className="font-body font-medium text-sm tracking-wide">View order</span>
      <span className="font-display italic text-lg tabular-nums">€{total.toFixed(2)}</span>
    </button>
  );
};

export default FloatingCart;
