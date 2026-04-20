import { useState } from "react";
import { Clock, ChefHat, CheckCircle2, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useRestaurantConfig } from "@/contexts/RestaurantConfigContext";
import { orderService } from "@/services/orderService";
import { toast } from "sonner";
import type { Database } from "@/integrations/supabase/types";
import { useEffect } from "react";

type OrderStatusDb = Database["public"]["Enums"]["order_status"];

const statusConfig: Record<OrderStatusDb, { label: string; icon: typeof Clock; className: string; next?: OrderStatusDb; nextLabel?: string }> = {
  draft: { label: "Draft", icon: Clock, className: "bg-secondary text-muted-foreground" },
  submitted: { label: "Submitted", icon: Clock, className: "bg-amber-500/20 text-amber-400", next: "acknowledged", nextLabel: "Acknowledge" },
  acknowledged: { label: "Acknowledged", icon: CheckCircle2, className: "bg-sky-500/20 text-sky-400", next: "preparing", nextLabel: "Start Preparing" },
  preparing: { label: "Preparing", icon: ChefHat, className: "bg-amber-500/20 text-amber-400", next: "ready", nextLabel: "Mark Ready" },
  ready: { label: "Ready", icon: CheckCircle2, className: "bg-emerald-500/20 text-emerald-400", next: "delivered", nextLabel: "Mark Delivered" },
  delivered: { label: "Delivered", icon: CheckCircle2, className: "bg-emerald-500/20 text-emerald-400" },
  cancelled: { label: "Cancelled", icon: Clock, className: "bg-destructive/20 text-destructive" },
};

const filterOptions = [
  { label: "All", value: "all" },
  { label: "Active", value: "active" },
  { label: "Submitted", value: "submitted" },
  { label: "Preparing", value: "preparing" },
  { label: "Ready", value: "ready" },
  { label: "Completed", value: "completed" },
];

const OrdersManagement = () => {
  const { restaurantId } = useRestaurantConfig();
  const [filter, setFilter] = useState("all");
  const queryClient = useQueryClient();

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["restaurant-orders", restaurantId],
    queryFn: () => orderService.getRestaurantOrders(restaurantId!),
    enabled: !!restaurantId,
  });

  // Realtime: any change to this restaurant's orders refetches
  useEffect(() => {
    if (!restaurantId) return;
    const ch = supabase
      .channel(`mgr-orders-${restaurantId}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "orders", filter: `restaurant_id=eq.${restaurantId}` }, () => {
        queryClient.invalidateQueries({ queryKey: ["restaurant-orders", restaurantId] });
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "order_items" }, () => {
        queryClient.invalidateQueries({ queryKey: ["restaurant-orders", restaurantId] });
      })
      .subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, [restaurantId, queryClient]);

  const advanceOrder = async (id: string, current: OrderStatusDb) => {
    const next = statusConfig[current]?.next;
    if (!next) return;
    try {
      await orderService.updateOrderStatus(id, next);
      toast.success(`Order moved to ${statusConfig[next].label}`);
      queryClient.invalidateQueries({ queryKey: ["restaurant-orders", restaurantId] });
    } catch (err: any) {
      toast.error(err?.message || "Failed to update order");
    }
  };

  const filtered = orders.filter((o: any) => {
    if (filter === "all") return true;
    if (filter === "active") return !["delivered", "cancelled"].includes(o.status);
    if (filter === "completed") return ["delivered"].includes(o.status);
    return o.status === filter;
  });

  const orderTotal = (o: any): number =>
    (o.order_items ?? []).reduce((s: number, it: any) => s + Number(it.unit_price) * it.quantity, 0);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold">Orders</h1>
          <p className="text-sm text-muted-foreground">{orders.length} total orders</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar">
        {filterOptions.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setFilter(opt.value)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              filter === opt.value
                ? "bg-primary/10 text-primary border border-primary/30"
                : "bg-secondary text-muted-foreground hover:text-foreground"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-16 text-muted-foreground">
          <Loader2 className="w-5 h-5 animate-spin mr-2" /> Loading orders…
        </div>
      )}

      {/* Orders list */}
      {!isLoading && (
        <div className="space-y-3">
          {filtered.map((order: any) => {
            const sc = statusConfig[order.status as OrderStatusDb];
            const total = orderTotal(order);
            const shortId = order.id.slice(0, 8).toUpperCase();
            return (
              <div key={order.id} className="bg-card border border-border rounded-2xl p-4 hover:border-primary/20 transition-all">
                <div className="flex items-center justify-between gap-4 mb-3">
                  <div>
                    <p className="font-display font-bold text-sm">#{shortId}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(order.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-display font-bold text-sm text-primary">€{total.toFixed(2)}</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${sc.className}`}>
                      {sc.label}
                    </span>
                  </div>
                </div>

                {/* Items */}
                <div className="bg-secondary/50 rounded-xl p-3 mb-3">
                  {(order.order_items ?? []).map((item: any) => (
                    <div key={item.id} className="flex justify-between text-xs py-1">
                      <span>{item.quantity}× {item.dishes?.name ?? "Item"}</span>
                      <span className="text-muted-foreground">€{(Number(item.unit_price) * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                {sc.next && (
                  <Button
                    size="sm"
                    className="w-full sm:w-auto rounded-full text-xs font-semibold bg-secondary text-foreground hover:bg-surface-hover"
                    onClick={() => advanceOrder(order.id, order.status)}
                  >
                    <ArrowRight className="w-3.5 h-3.5 mr-1" /> {sc.nextLabel}
                  </Button>
                )}
              </div>
            );
          })}
          {filtered.length === 0 && (
            <p className="text-center text-muted-foreground py-8 text-sm">No orders match this filter</p>
          )}
        </div>
      )}
    </div>
  );
};

export default OrdersManagement;
