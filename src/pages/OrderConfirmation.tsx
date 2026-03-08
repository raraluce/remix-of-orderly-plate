import { useEffect } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2, Clock, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";

const OrderConfirmation = () => {
  const { items, total, clearCart } = useCart();
  const orderNumber = Math.floor(Math.random() * 9000) + 1000;

  useEffect(() => {
    return () => { clearCart(); };
  }, []);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md text-center space-y-8 animate-fade-up">
        <div className="w-20 h-20 mx-auto rounded-full gradient-accent flex items-center justify-center glow-accent animate-pulse_glow">
          <CheckCircle2 className="w-10 h-10 text-primary-foreground" />
        </div>

        <div>
          <h1 className="text-3xl font-display font-bold mb-2">Order Confirmed!</h1>
          <p className="text-muted-foreground">Your order has been sent to the kitchen</p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Order #</span>
            <span className="font-display font-bold text-primary">#{orderNumber}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Items</span>
            <span className="font-semibold">{items.length} items</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Total paid</span>
            <span className="font-display font-bold text-gradient">${(total * 1.05).toFixed(2)}</span>
          </div>
          <div className="border-t border-border pt-4 flex items-center justify-center gap-2 text-primary">
            <Clock className="w-4 h-4" />
            <span className="text-sm font-semibold">Estimated: 20-25 min</span>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <Link to="/menu">
            <Button className="w-full gradient-accent text-primary-foreground rounded-full font-semibold">
              Order More
            </Button>
          </Link>
          <Link to="/">
            <Button variant="outline" className="w-full rounded-full border-border text-foreground">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
