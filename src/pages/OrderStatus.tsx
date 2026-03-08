import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Clock, ChefHat, CheckCircle2, UtensilsCrossed, CreditCard, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTableSession } from "@/contexts/TableSessionContext";

const steps = [
  { key: "confirmed", label: "Order Received", icon: CheckCircle2, desc: "Your order has been received by the kitchen" },
  { key: "preparing", label: "Preparing", icon: ChefHat, desc: "The chef is working on your dishes" },
  { key: "ready", label: "Ready to Serve", icon: Bell, desc: "Your order is ready and coming to your table" },
  { key: "served", label: "Served", icon: UtensilsCrossed, desc: "Enjoy your meal!" },
] as const;

const OrderStatus = () => {
  const { orderStatus, setOrderStatus, tableNumber } = useTableSession();
  const [currentStep, setCurrentStep] = useState(0);

  // Simulate order progression
  useEffect(() => {
    if (!orderStatus) {
      setOrderStatus("confirmed");
    }
  }, []);

  useEffect(() => {
    const idx = steps.findIndex((s) => s.key === orderStatus);
    if (idx >= 0) setCurrentStep(idx);
  }, [orderStatus]);

  // Auto-advance demo
  useEffect(() => {
    if (orderStatus === "confirmed") {
      const t = setTimeout(() => setOrderStatus("preparing"), 4000);
      return () => clearTimeout(t);
    }
    if (orderStatus === "preparing") {
      const t = setTimeout(() => setOrderStatus("ready"), 8000);
      return () => clearTimeout(t);
    }
    if (orderStatus === "ready") {
      const t = setTimeout(() => setOrderStatus("served"), 5000);
      return () => clearTimeout(t);
    }
  }, [orderStatus]);

  return (
    <div className="min-h-screen bg-background pb-8">
      <header className="border-b border-border glass sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center gap-4">
          <Link to="/table" className="p-2 rounded-full hover:bg-secondary transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="font-display font-bold text-lg">Order Status</h1>
            <p className="text-xs text-muted-foreground">Table {tableNumber || "3"}</p>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-md">
        {/* Live indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs text-muted-foreground">Live tracking</span>
        </div>

        {/* Status Steps */}
        <div className="space-y-0">
          {steps.map((step, i) => {
            const isActive = i <= currentStep;
            const isCurrent = i === currentStep;
            const Icon = step.icon;

            return (
              <div key={step.key} className="relative">
                {/* Connector line */}
                {i > 0 && (
                  <div className={`absolute left-6 -top-4 w-0.5 h-4 transition-colors duration-500 ${isActive ? "bg-primary" : "bg-border"}`} />
                )}

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.15 }}
                  className={`flex gap-4 p-4 rounded-2xl mb-2 transition-all duration-500 ${
                    isCurrent ? "bg-card border border-primary/30 glow-accent-sm" : isActive ? "bg-card/50" : "opacity-40"
                  }`}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-colors duration-500 ${
                    isCurrent ? "gradient-accent" : isActive ? "bg-primary/20" : "bg-secondary"
                  }`}>
                    <Icon className={`w-6 h-6 ${isCurrent ? "text-primary-foreground" : isActive ? "text-primary" : "text-muted-foreground"}`} />
                  </div>
                  <div>
                    <p className={`font-display font-bold text-sm ${isCurrent ? "text-foreground" : "text-muted-foreground"}`}>
                      {step.label}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">{step.desc}</p>
                    {isCurrent && orderStatus === "preparing" && (
                      <div className="flex items-center gap-1.5 mt-2">
                        <Clock className="w-3 h-3 text-primary" />
                        <span className="text-xs text-primary font-semibold">Est. 15-20 min</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              </div>
            );
          })}
        </div>

        {/* Actions */}
        {orderStatus === "served" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 space-y-3"
          >
            <Link to="/payment">
              <Button className="w-full gradient-accent text-primary-foreground rounded-2xl py-6 font-semibold glow-accent-sm">
                <CreditCard className="w-5 h-5 mr-2" /> Pay & Leave Feedback
              </Button>
            </Link>
            <Link to="/menu">
              <Button variant="outline" className="w-full rounded-2xl py-6 font-semibold border-border">
                Order More
              </Button>
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default OrderStatus;
