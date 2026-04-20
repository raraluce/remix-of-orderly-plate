import { useState, useEffect } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, ChefHat, CheckCircle2, UtensilsCrossed, CreditCard, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTableSession } from "@/contexts/TableSessionContext";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type DbOrderStatus = Database["public"]["Enums"]["order_status"];

const steps: { key: DbOrderStatus; label: string; icon: typeof Clock; desc: string }[] = [
  { key: "submitted", label: "Order Received", icon: CheckCircle2, desc: "Your order has been received by the kitchen" },
  { key: "acknowledged", label: "Confirmed", icon: CheckCircle2, desc: "The kitchen has confirmed your order" },
  { key: "preparing", label: "Preparing", icon: ChefHat, desc: "The chef is working on your dishes" },
  { key: "ready", label: "Ready to Serve", icon: Bell, desc: "Your order is ready and coming to your table" },
  { key: "delivered", label: "Served", icon: UtensilsCrossed, desc: "Enjoy your meal!" },
];

const OrderStatus = () => {
  const { tableNumber, sessionId } = useTableSession();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const queryClient = useQueryClient();

  // Order id can come from navigate state or ?order= query param
  const stateOrderId = (location.state as { orderId?: string } | null)?.orderId;
  const orderId = stateOrderId ?? searchParams.get("order") ?? null;

  const { data: order } = useQuery({
    queryKey: ["order", orderId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("id, status, submitted_at, session_id")
        .eq("id", orderId!)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!orderId,
  });

  // Realtime subscription on this order
  useEffect(() => {
    if (!orderId) return;
    const ch = supabase
      .channel(`order-${orderId}`)
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "orders", filter: `id=eq.${orderId}` }, () => {
        queryClient.invalidateQueries({ queryKey: ["order", orderId] });
      })
      .subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, [orderId, queryClient]);

  const currentStatus = order?.status as DbOrderStatus | undefined;
  const currentStep = currentStatus ? Math.max(0, steps.findIndex((s) => s.key === currentStatus)) : 0;

  return (
    <div className="min-h-screen bg-background pb-8">
      <header className="border-b border-border glass sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center gap-4">
          <Link to="/table" className="p-2 rounded-full hover:bg-secondary transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="font-display font-bold text-lg">Order Status</h1>
            <p className="text-xs text-muted-foreground">
              {tableNumber ? `Table ${tableNumber}` : "Live order"}
              {orderId && ` · #${orderId.slice(0, 8).toUpperCase()}`}
            </p>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-md">
        {/* Live indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs text-muted-foreground">Live tracking</span>
        </div>

        {!orderId && (
          <p className="text-center text-sm text-muted-foreground mb-6">
            No active order. Place an order from the menu to track its status here.
          </p>
        )}

        {/* Status Steps */}
        <div className="space-y-0">
          {steps.map((step, i) => {
            const isActive = i <= currentStep && !!currentStatus;
            const isCurrent = i === currentStep && !!currentStatus;
            const Icon = step.icon;

            return (
              <div key={step.key} className="relative">
                {i > 0 && (
                  <div className={`absolute left-6 -top-4 w-0.5 h-4 transition-colors duration-500 ${isActive ? "bg-primary" : "bg-border"}`} />
                )}

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
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
                    {isCurrent && step.key === "preparing" && (
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
        {currentStatus === "delivered" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 space-y-3"
          >
            <Link to={sessionId ? `/payment?session=${sessionId}` : "/payment"}>
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
