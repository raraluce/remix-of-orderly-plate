import { useState } from "react";
import { Clock, ChefHat, CheckCircle2, ArrowRight, ShoppingBag, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { mockOrders } from "@/services/mockData";
import type { Order, OrderStatus } from "@/types";

const statusConfig: Record<OrderStatus, { label: string; icon: typeof Clock; className: string; next?: OrderStatus; nextLabel?: string }> = {
  pending: { label: "Pending", icon: Clock, className: "bg-amber-500/20 text-amber-400", next: "confirmed", nextLabel: "Confirm" },
  confirmed: { label: "Confirmed", icon: CheckCircle2, className: "bg-sky-500/20 text-sky-400", next: "preparing", nextLabel: "Start Preparing" },
  preparing: { label: "Preparing", icon: ChefHat, className: "bg-amber-500/20 text-amber-400", next: "ready", nextLabel: "Mark Ready" },
  ready: { label: "Ready", icon: CheckCircle2, className: "bg-emerald-500/20 text-emerald-400", next: "served", nextLabel: "Mark Served" },
  served: { label: "Served", icon: CheckCircle2, className: "bg-emerald-500/20 text-emerald-400" },
  paid: { label: "Paid", icon: CheckCircle2, className: "bg-secondary text-muted-foreground" },
  cancelled: { label: "Cancelled", icon: Clock, className: "bg-destructive/20 text-destructive" },
};

const filterOptions = [
  { label: "All", value: "all" },
  { label: "Active", value: "active" },
  { label: "Pending", value: "pending" },
  { label: "Preparing", value: "preparing" },
  { label: "Ready", value: "ready" },
  { label: "Completed", value: "completed" },
];

const OrdersManagement = () => {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [filter, setFilter] = useState("all");

  const advanceOrder = (id: string) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== id) return o;
        const next = statusConfig[o.status]?.next;
        return next ? { ...o, status: next, updatedAt: new Date().toISOString() } : o;
      })
    );
  };

  const filtered = filter === "all"
    ? orders
    : filter === "active"
    ? orders.filter((o) => !["paid", "cancelled", "served"].includes(o.status))
    : filter === "completed"
    ? orders.filter((o) => ["paid", "served"].includes(o.status))
    : orders.filter((o) => o.status === filter);

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

      {/* Orders list */}
      <div className="space-y-3">
        {filtered.map((order) => {
          const sc = statusConfig[order.status];
          return (
            <div key={order.id} className="bg-card border border-border rounded-2xl p-4 hover:border-primary/20 transition-all">
              <div className="flex items-center justify-between gap-4 mb-3">
                <div className="flex items-center gap-4">
                  <div>
                    <p className="font-display font-bold text-sm">{order.id}</p>
                    <p className="text-xs text-muted-foreground">
                      Table {order.tableId.split("-")[1]} · {new Date(order.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-display font-bold text-sm text-primary">${order.total.toFixed(2)}</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${sc.className}`}>
                    {sc.label}
                  </span>
                </div>
              </div>

              {/* Items */}
              <div className="bg-secondary/50 rounded-xl p-3 mb-3">
                {order.items.map((item) => (
                  <div key={item.id} className="flex justify-between text-xs py-1">
                    <span>{item.quantity}× {item.name}</span>
                    <span className="text-muted-foreground">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              {sc.next && (
                <Button
                  size="sm"
                  className="w-full sm:w-auto rounded-full text-xs font-semibold bg-secondary text-foreground hover:bg-surface-hover"
                  onClick={() => advanceOrder(order.id)}
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
    </div>
  );
};

export default OrdersManagement;
