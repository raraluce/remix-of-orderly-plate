import { Link, useLocation } from "react-router-dom";
import { CheckCircle2, Clock, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRestaurantConfig } from "@/contexts/RestaurantConfigContext";

interface OrderState {
  orderId: string;
  itemCount: number;
  total: number;
}

const OrderConfirmation = () => {
  const location = useLocation();
  const state = (location.state as OrderState) ?? null;
  const { config } = useRestaurantConfig();
  const isPayLater = config.paymentModel === "pay-later";

  const orderId = state?.orderId ?? "—";
  const shortId = orderId.length > 8 ? orderId.slice(0, 8).toUpperCase() : orderId;
  const itemCount = state?.itemCount ?? 0;
  const total = state?.total ?? 0;
  const totalWithFee = total * 1.05;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md text-center space-y-8 animate-fade-up">
        <div className="w-20 h-20 mx-auto rounded-full gradient-accent flex items-center justify-center glow-accent animate-pulse_glow">
          <CheckCircle2 className="w-10 h-10 text-primary-foreground" />
        </div>

        <div>
          <h1 className="text-3xl font-display font-bold mb-2">Order Sent!</h1>
          <p className="text-muted-foreground">
            Your order has been sent to the kitchen.
            {isPayLater ? " Pay whenever you're ready." : ""}
          </p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Order</span>
            <span className="font-display font-bold text-primary">#{shortId}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Items</span>
            <span className="font-semibold">{itemCount} item{itemCount !== 1 ? "s" : ""}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Total</span>
            <span className="font-display font-bold text-gradient">
              €{totalWithFee.toFixed(2)}
            </span>
          </div>
          <div className="border-t border-border pt-4 flex items-center justify-center gap-2 text-primary">
            <Clock className="w-4 h-4" />
            <span className="text-sm font-semibold">Being prepared now</span>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {isPayLater && (
            <Link to="/payment">
              <Button className="w-full gradient-accent text-primary-foreground rounded-full font-semibold py-6 text-base glow-accent">
                <CreditCard className="w-5 h-5 mr-2" /> Pay Now — €{totalWithFee.toFixed(2)}
              </Button>
            </Link>
          )}
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
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
