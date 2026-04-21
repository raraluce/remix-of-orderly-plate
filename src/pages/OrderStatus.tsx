import { Link, useLocation, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { useTableSession } from "@/contexts/TableSessionContext";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type DbOrderStatus = Database["public"]["Enums"]["order_status"];

const steps: { key: DbOrderStatus; label: string; icon: string }[] = [
  { key: "submitted", label: "Confirmed", icon: "check" },
  { key: "preparing", label: "Preparing", icon: "skillet" },
  { key: "ready", label: "Ready", icon: "notifications" },
  { key: "delivered", label: "Served", icon: "home" },
];

const OrderStatus = () => {
  const { tableNumber, sessionId } = useTableSession();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const queryClient = useQueryClient();

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

  useEffect(() => {
    if (!orderId) return;
    const ch = supabase
      .channel(`order-${orderId}`)
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "orders", filter: `id=eq.${orderId}` }, () => {
        queryClient.invalidateQueries({ queryKey: ["order", orderId] });
      })
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [orderId, queryClient]);

  const currentStatus = order?.status as DbOrderStatus | undefined;
  // Map db status onto progress index
  const statusToStep: Record<string, number> = {
    submitted: 0, acknowledged: 0, preparing: 1, ready: 2, delivered: 3,
  };
  const currentStep = currentStatus ? statusToStep[currentStatus] ?? 0 : 0;
  const progressPct = currentStatus ? (currentStep / (steps.length - 1)) * 100 : 0;
  const shortId = orderId ? orderId.slice(0, 8).toUpperCase() : "—";

  return (
    <div className="min-h-screen bg-background pb-12 paper-grain">
      <header className="fixed top-0 left-0 right-0 z-50 glass-strong">
        <div className="flex items-center justify-between px-6 py-4 max-w-2xl mx-auto">
          <Link to="/table" className="text-primary active:scale-95 transition-transform">
            <span className="material-symbols-outlined">arrow_back</span>
          </Link>
          <h1 className="font-display italic text-xl">Order Status</h1>
          <span className="material-symbols-outlined text-primary">more_vert</span>
        </div>
      </header>

      <main className="pt-24 px-6 max-w-2xl mx-auto">
        {/* Hero confirmation */}
        <section className="flex flex-col items-center text-center space-y-6 mb-16">
          <div className="w-16 h-16 rounded-full bg-secondary-container/60 flex items-center justify-center text-primary">
            <span className="material-symbols-outlined text-[36px]">restaurant</span>
          </div>
          <div className="space-y-2">
            <h2 className="text-4xl md:text-5xl font-display italic font-medium leading-tight">
              {currentStatus === "delivered" ? "Bon appétit." : "Your order is in — thanks!"}
            </h2>
            <p className="text-muted-foreground font-body text-[10px] uppercase tracking-[0.2em] font-semibold">
              Order #{shortId}
              {tableNumber && ` · Table ${tableNumber}`}
            </p>
          </div>
        </section>

        {/* Progress tracker — Stitch horizontal stepper */}
        <section className="mb-16">
          <div className="relative flex justify-between items-start">
            <div className="absolute top-4 left-0 w-full h-[2px] bg-surface-highest z-0" />
            <motion.div
              className="absolute top-4 left-0 h-[2px] bg-primary z-0"
              initial={{ width: 0 }}
              animate={{ width: `${progressPct}%` }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            />

            {steps.map((step, i) => {
              const isComplete = i <= currentStep && !!currentStatus;
              const isCurrent = i === currentStep && !!currentStatus;
              return (
                <div key={step.key} className="relative z-10 flex flex-col items-center gap-3 flex-1">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ring-4 ring-surface transition-colors duration-500 ${
                      isComplete ? "bg-primary text-primary-foreground" : "bg-surface-highest text-muted-foreground"
                    }`}
                  >
                    <span
                      className={`material-symbols-outlined text-[16px] ${isCurrent ? "animate-pulse-soft" : ""}`}
                      style={isComplete ? { fontVariationSettings: "'FILL' 1" } : undefined}
                    >
                      {step.icon}
                    </span>
                  </div>
                  <span className={`text-[10px] uppercase tracking-widest font-body font-bold text-center ${isComplete ? "text-primary" : "text-muted-foreground"}`}>
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </section>

        {!orderId && (
          <p className="text-center text-sm text-muted-foreground italic font-body py-8">
            No active order. Place an order from the menu to track it here.
          </p>
        )}

        {/* Loyalty / next-step nudge */}
        {currentStatus === "delivered" && (
          <section className="relative bg-gradient-to-br from-primary to-primary-container rounded-2xl p-6 text-primary-foreground overflow-hidden editorial-shadow">
            <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px]" />
            <div className="relative z-10 flex flex-col gap-4">
              <div className="w-10 h-10 rounded-full bg-primary-foreground/15 flex items-center justify-center">
                <span className="material-symbols-outlined">auto_awesome</span>
              </div>
              <div>
                <h3 className="font-display italic text-2xl mb-1">Settle up?</h3>
                <p className="text-primary-foreground/90 text-sm font-body leading-relaxed max-w-[280px]">
                  Your meal is complete. Pay and earn loyalty points toward your next visit.
                </p>
              </div>
              <Link
                to={sessionId ? `/payment?session=${sessionId}` : "/payment"}
                className="mt-2 w-full py-3 bg-surface-lowest text-primary font-body font-bold rounded-full text-sm uppercase tracking-widest text-center hover:scale-[1.02] transition-transform"
              >
                Pay & leave feedback
              </Link>
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default OrderStatus;
