import { useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CheckCircle2, Clock, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { useRestaurantConfig } from "@/contexts/RestaurantConfigContext";

const OrderConfirmation = () => {
  const { items, total, clearCart } = useCart();
  const { config } = useRestaurantConfig();
  const navigate = useNavigate();
  const orderNumber = useMemo(() => Math.floor(Math.random() * 9000) + 1000, []);
  const isPayLater = config.paymentModel === "pay-later";

  useEffect(() => {
    // Only auto-clear cart for pay-now (already paid)
    if (!isPayLater) {
      return () => { clearCart(); };
    }
  }, []);

  const handlePayNow = () => {
    navigate("/payment");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md text-center space-y-8 animate-fade-up">
        <div className="w-20 h-20 mx-auto rounded-full gradient-accent flex items-center justify-center glow-accent animate-pulse_glow">
          <CheckCircle2 className="w-10 h-10 text-primary-foreground" />
        </div>

        <div>
          <h1 className="text-3xl font-display font-bold mb-2">
            {isPayLater ? "Order Sent!" : "Order Confirmed!"}
          </h1>
          <p className="text-muted-foreground">
            {isPayLater
              ? "Your order has been sent to the kitchen. Pay whenever you're ready."
              : "Your order has been sent to the kitchen"}
          </p>
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
            <span className="text-muted-foreground">
              {isPayLater ? "Estimated total" : "Total paid"}
            </span>
            <span className="font-display font-bold text-gradient">
              ${(total * 1.05).toFixed(2)}
            </span>
          </div>
          <div className="border-t border-border pt-4 flex items-center justify-center gap-2 text-primary">
            <Clock className="w-4 h-4" />
            <span className="text-sm font-semibold">Estimated: 20-25 min</span>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {isPayLater ? (
            <>
              <Button
                className="w-full gradient-accent text-primary-foreground rounded-full font-semibold py-6 text-base glow-accent"
                onClick={handlePayNow}
              >
                <CreditCard className="w-5 h-5 mr-2" /> Pay Now — ${(total * 1.05).toFixed(2)}
              </Button>
              <Link to="/menu">
                <Button variant="outline" className="w-full rounded-full border-border text-foreground">
                  Order More
                </Button>
              </Link>
              <Link to="/feedback">
                <Button variant="ghost" className="w-full rounded-full text-muted-foreground text-sm">
                  Rate Your Experience
                </Button>
              </Link>
            </>
          ) : (
            <>
              <Link to="/feedback">
                <Button className="w-full gradient-accent text-primary-foreground rounded-full font-semibold">
                  Rate Your Experience
                </Button>
              </Link>
              <Link to="/menu">
                <Button variant="outline" className="w-full rounded-full border-border text-foreground">
                  Order More
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
