import { Link } from "react-router-dom";
import { DollarSign, ShoppingBag, Users, TrendingUp, ArrowRight, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useRestaurantConfig } from "@/contexts/RestaurantConfigContext";
import { orderService } from "@/services/orderService";
import { sessionService } from "@/services/sessionService";

const statusColors: Record<string, string> = {
  draft: "bg-secondary text-muted-foreground",
  submitted: "bg-amber-500/20 text-amber-400",
  acknowledged: "bg-sky-500/20 text-sky-400",
  preparing: "bg-amber-500/20 text-amber-400",
  ready: "bg-emerald-500/20 text-emerald-400",
  delivered: "bg-emerald-500/20 text-emerald-400",
  cancelled: "bg-destructive/20 text-destructive",
};

const tableColors: Record<string, string> = {
  open: "border-emerald-500/30 bg-emerald-500/10",
  occupied: "border-primary/30 bg-primary/10",
  settling: "border-amber-500/30 bg-amber-500/10",
  closed: "border-border bg-secondary opacity-60",
};

const DashboardHome = () => {
  const { restaurantId, restaurant } = useRestaurantConfig();

  const { data: orders = [], isLoading: ordersLoading } = useQuery({
    queryKey: ["restaurant-orders", restaurantId],
    queryFn: () => orderService.getRestaurantOrders(restaurantId!),
    enabled: !!restaurantId,
  });

  const { data: tables = [] } = useQuery({
    queryKey: ["restaurant-tables", restaurantId],
    queryFn: () => sessionService.getTablesByRestaurant(restaurantId!),
    enabled: !!restaurantId,
  });

  const { data: stats } = useQuery({
    queryKey: ["restaurant-stats", restaurantId],
    queryFn: async () => {
      const today = new Date().toISOString().slice(0, 10);
      const { data, error } = await supabase.rpc("get_restaurant_revenue_stats", {
        p_restaurant_id: restaurantId!,
        p_from_date: today,
        p_to_date: today,
      });
      if (error) throw error;
      return data?.[0] ?? null;
    },
    enabled: !!restaurantId,
  });

  const activeOrders = orders.filter((o: any) => !["delivered", "cancelled"].includes(o.status));
  const occupied = tables.filter((t: any) => t.status === "occupied").length;

  const cards = [
    {
      label: "Today's Revenue",
      value: `€${Number(stats?.total_revenue ?? 0).toFixed(2)}`,
      icon: DollarSign,
    },
    {
      label: "Active Orders",
      value: String(activeOrders.length),
      icon: ShoppingBag,
    },
    {
      label: "Tables Occupied",
      value: `${occupied}/${tables.length}`,
      icon: Users,
    },
    {
      label: "Avg Ticket",
      value: `€${Number(stats?.avg_order_value ?? 0).toFixed(2)}`,
      icon: TrendingUp,
    },
  ];

  const recent = orders.slice(0, 4);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold">Dashboard</h1>
          <p className="text-sm text-muted-foreground">{restaurant?.name ?? "Restaurant"} · Today</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs text-muted-foreground">Live</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((s, i) => (
          <div key={i} className="bg-card border border-border rounded-2xl p-4 hover:border-primary/20 transition-colors animate-fade-up" style={{ animationDelay: `${i * 0.05}s` }}>
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <s.icon className="w-5 h-5 text-primary" />
              </div>
            </div>
            <p className="text-2xl font-display font-bold">{s.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-bold">Recent Orders</h2>
            <Link to="/restaurant/orders" className="text-xs text-primary font-semibold flex items-center gap-1">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          {ordersLoading ? (
            <div className="flex items-center text-sm text-muted-foreground">
              <Loader2 className="w-4 h-4 animate-spin mr-2" /> Loading…
            </div>
          ) : (
            <div className="space-y-3">
              {recent.map((order: any) => {
                const total = (order.order_items ?? []).reduce(
                  (s: number, it: any) => s + Number(it.unit_price) * it.quantity,
                  0
                );
                return (
                  <div key={order.id} className="flex items-center justify-between py-2">
                    <div>
                      <p className="font-display font-bold text-sm">#{order.id.slice(0, 8).toUpperCase()}</p>
                      <p className="text-xs text-muted-foreground">{(order.order_items ?? []).length} items</p>
                    </div>
                    <div className="text-right">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${statusColors[order.status]}`}>
                        {order.status}
                      </span>
                      <p className="text-xs font-display font-bold text-primary mt-1">€{total.toFixed(2)}</p>
                    </div>
                  </div>
                );
              })}
              {recent.length === 0 && <p className="text-sm text-muted-foreground">No orders yet</p>}
            </div>
          )}
        </div>

        {/* Tables */}
        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-bold">Tables</h2>
            <Link to="/restaurant/tables" className="text-xs text-primary font-semibold flex items-center gap-1">
              Manage <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {tables.map((table: any) => (
              <div key={table.id} className={`p-3 rounded-xl border text-center ${tableColors[table.status] ?? tableColors.closed}`}>
                <p className="font-display font-bold text-sm">{table.label}</p>
                <p className="text-[9px] text-muted-foreground capitalize">{table.status}</p>
              </div>
            ))}
            {tables.length === 0 && <p className="col-span-4 text-xs text-muted-foreground text-center py-3">No tables yet</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
