import { Link } from "react-router-dom";
import { DollarSign, ShoppingBag, Users, TrendingUp, ArrowRight, Clock, QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import { mockOrders, mockTables, mockSessions } from "@/services/mockData";
import { useRestaurantConfig } from "@/contexts/RestaurantConfigContext";

const stats = [
  { label: "Today's Revenue", value: "$2,847", icon: DollarSign, change: "+12%" },
  { label: "Active Orders", value: String(mockOrders.filter((o) => !["paid", "cancelled"].includes(o.status)).length), icon: ShoppingBag, change: "+8%" },
  { label: "Tables Occupied", value: `${mockTables.filter((t) => t.status === "occupied").length}/${mockTables.length}`, icon: Users, change: "" },
  { label: "Avg Ticket", value: "$44.50", icon: TrendingUp, change: "+3%" },
];

const recentOrders = mockOrders.slice(0, 4);

const statusColors: Record<string, string> = {
  pending: "bg-amber-500/20 text-amber-400",
  confirmed: "bg-sky-500/20 text-sky-400",
  preparing: "bg-amber-500/20 text-amber-400",
  ready: "bg-emerald-500/20 text-emerald-400",
  served: "bg-emerald-500/20 text-emerald-400",
  paid: "bg-secondary text-muted-foreground",
};

const DashboardHome = () => (
  <div className="p-6 space-y-6">
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-display font-bold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">The Grand Kitchen · Today</p>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span className="text-xs text-muted-foreground">Live</span>
      </div>
    </div>

    {/* Stats */}
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((s, i) => (
        <div key={i} className="bg-card border border-border rounded-2xl p-4 hover:border-primary/20 transition-colors animate-fade-up" style={{ animationDelay: `${i * 0.05}s` }}>
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <s.icon className="w-5 h-5 text-primary" />
            </div>
            {s.change && <span className="text-xs font-semibold text-emerald-400">{s.change}</span>}
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
        <div className="space-y-3">
          {recentOrders.map((order) => (
            <div key={order.id} className="flex items-center justify-between py-2">
              <div className="flex items-center gap-3">
                <div>
                  <p className="font-display font-bold text-sm">{order.id}</p>
                  <p className="text-xs text-muted-foreground">Table {order.tableId.split("-")[1]} · {order.items.length} items</p>
                </div>
              </div>
              <div className="text-right">
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${statusColors[order.status]}`}>
                  {order.status}
                </span>
                <p className="text-xs font-display font-bold text-primary mt-1">${order.total.toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Active Tables */}
      <div className="bg-card border border-border rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-bold">Tables</h2>
          <Link to="/restaurant/tables" className="text-xs text-primary font-semibold flex items-center gap-1">
            Manage <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {mockTables.map((table) => {
            const colorMap: Record<string, string> = {
              available: "border-border bg-secondary",
              occupied: "border-primary/30 bg-primary/10",
              reserved: "border-amber-500/30 bg-amber-500/10",
              cleaning: "border-border bg-secondary opacity-50",
            };
            return (
              <div key={table.id} className={`p-3 rounded-xl border text-center ${colorMap[table.status]}`}>
                <p className="font-display font-bold text-sm">{table.number}</p>
                <p className="text-[9px] text-muted-foreground capitalize">{table.status}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  </div>
);

export default DashboardHome;
