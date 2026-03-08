import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, DollarSign, ShoppingBag, Users, TrendingUp, Clock, CheckCircle2, ChefHat, BarChart3, UtensilsCrossed, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";

const stats = [
  { label: "Today's Revenue", value: "$2,847", icon: DollarSign, change: "+12%" },
  { label: "Orders", value: "64", icon: ShoppingBag, change: "+8%" },
  { label: "Guests", value: "142", icon: Users, change: "+15%" },
  { label: "Avg Order", value: "$44.50", icon: TrendingUp, change: "+3%" },
];

const revenueData = [
  { day: "Mon", revenue: 1800 },
  { day: "Tue", revenue: 2200 },
  { day: "Wed", revenue: 1900 },
  { day: "Thu", revenue: 2600 },
  { day: "Fri", revenue: 3100 },
  { day: "Sat", revenue: 3800 },
  { day: "Sun", revenue: 2847 },
];

type OrderStatus = "new" | "preparing" | "ready" | "completed";

interface Order {
  id: string;
  table: string;
  items: number;
  total: string;
  time: string;
  status: OrderStatus;
}

const initialOrders: Order[] = [
  { id: "#1847", table: "Table 3", items: 4, total: "$62.00", time: "2 min ago", status: "new" },
  { id: "#1846", table: "Table 7", items: 3, total: "$48.50", time: "8 min ago", status: "preparing" },
  { id: "#1845", table: "Table 1", items: 6, total: "$94.00", time: "15 min ago", status: "preparing" },
  { id: "#1844", table: "Table 5", items: 2, total: "$31.00", time: "22 min ago", status: "ready" },
  { id: "#1843", table: "Table 9", items: 5, total: "$78.50", time: "35 min ago", status: "completed" },
];

const statusConfig: Record<OrderStatus, { label: string; icon: typeof Clock; className: string; next?: OrderStatus; nextLabel?: string }> = {
  new: { label: "New", icon: Clock, className: "text-primary gradient-accent text-primary-foreground", next: "preparing", nextLabel: "Start Preparing" },
  preparing: { label: "Preparing", icon: ChefHat, className: "bg-amber-500/20 text-amber-400", next: "ready", nextLabel: "Mark Ready" },
  ready: { label: "Ready", icon: CheckCircle2, className: "bg-emerald-500/20 text-emerald-400", next: "completed", nextLabel: "Complete" },
  completed: { label: "Done", icon: CheckCircle2, className: "bg-secondary text-muted-foreground" },
};

const statusFilterOptions: { label: string; value: string }[] = [
  { label: "All", value: "all" },
  { label: "New", value: "new" },
  { label: "Preparing", value: "preparing" },
  { label: "Ready", value: "ready" },
  { label: "Done", value: "completed" },
];

const popularItems = [
  { name: "Smash Burger Deluxe", orders: 28, revenue: "$518" },
  { name: "Truffle Spaghetti", orders: 22, revenue: "$528" },
  { name: "Dragon Roll Platter", orders: 19, revenue: "$418" },
  { name: "Sunset Spritz", orders: 31, revenue: "$403" },
];

const Dashboard = () => {
  const [tab, setTab] = useState<"orders" | "analytics">("orders");
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [statusFilter, setStatusFilter] = useState("all");

  const advanceOrder = (id: string) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== id) return o;
        const next = statusConfig[o.status].next;
        return next ? { ...o, status: next } : o;
      })
    );
  };

  const filteredOrders = statusFilter === "all" ? orders : orders.filter((o) => o.status === statusFilter);
  const newCount = orders.filter((o) => o.status === "new").length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border glass sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="p-2 rounded-full hover:bg-secondary transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="font-display font-bold text-lg">The Grand Kitchen</h1>
              <p className="text-xs text-muted-foreground">Restaurant Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/menu-management" className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary text-xs font-semibold hover:bg-surface-hover transition-colors">
              <UtensilsCrossed className="w-3.5 h-3.5" /> Menu
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs text-muted-foreground">Live</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s, i) => (
            <div key={i} className="bg-card border border-border rounded-2xl p-4 hover:border-primary/20 transition-colors animate-fade-up" style={{ animationDelay: `${i * 0.05}s` }}>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <s.icon className="w-5 h-5 text-primary" />
                </div>
                <span className="text-xs font-semibold text-emerald-400">{s.change}</span>
              </div>
              <p className="text-2xl font-display font-bold">{s.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <Button
              variant={tab === "orders" ? "default" : "outline"}
              size="sm"
              className={`rounded-full ${tab === "orders" ? "gradient-accent text-primary-foreground" : "border-border text-muted-foreground"}`}
              onClick={() => setTab("orders")}
            >
              <ShoppingBag className="w-4 h-4 mr-2" /> Orders
              {newCount > 0 && (
                <span className="ml-1.5 w-5 h-5 rounded-full bg-primary-foreground/20 text-[10px] font-bold flex items-center justify-center">
                  {newCount}
                </span>
              )}
            </Button>
            <Button
              variant={tab === "analytics" ? "default" : "outline"}
              size="sm"
              className={`rounded-full ${tab === "analytics" ? "gradient-accent text-primary-foreground" : "border-border text-muted-foreground"}`}
              onClick={() => setTab("analytics")}
            >
              <BarChart3 className="w-4 h-4 mr-2" /> Analytics
            </Button>
          </div>
          <Link to="/menu-management" className="sm:hidden flex items-center gap-1 text-xs text-primary font-semibold">
            Menu <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {tab === "orders" && (
          <div className="space-y-4">
            {/* Status Filter */}
            <div className="flex gap-2 overflow-x-auto no-scrollbar">
              {statusFilterOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setStatusFilter(opt.value)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                    statusFilter === opt.value
                      ? "bg-primary/10 text-primary border border-primary/30"
                      : "bg-secondary text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {opt.label}
                  {opt.value !== "all" && (
                    <span className="ml-1 text-[10px] opacity-60">
                      {orders.filter((o) => o.status === opt.value).length}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Orders */}
            <div className="space-y-3">
              {filteredOrders.map((order) => {
                const sc = statusConfig[order.status];
                return (
                  <div key={order.id} className="bg-card border border-border rounded-2xl p-4 hover:border-primary/20 transition-all duration-200">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="hidden sm:block">
                          <p className="font-display font-bold text-sm">{order.id}</p>
                          <p className="text-xs text-muted-foreground">{order.time}</p>
                        </div>
                        <div>
                          <p className="font-semibold text-sm">{order.table}</p>
                          <p className="text-xs text-muted-foreground">{order.items} items • {order.total}</p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${sc.className}`}>
                        {sc.label}
                      </span>
                    </div>
                    {sc.next && (
                      <div className="mt-3 pt-3 border-t border-border">
                        <Button
                          size="sm"
                          className="w-full sm:w-auto rounded-full text-xs font-semibold bg-secondary text-foreground hover:bg-surface-hover"
                          onClick={() => advanceOrder(order.id)}
                        >
                          <ArrowRight className="w-3.5 h-3.5 mr-1" /> {sc.nextLabel}
                        </Button>
                      </div>
                    )}
                  </div>
                );
              })}
              {filteredOrders.length === 0 && (
                <p className="text-center text-muted-foreground py-8 text-sm">No orders with this status</p>
              )}
            </div>
          </div>
        )}

        {tab === "analytics" && (
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Revenue Chart */}
            <div className="bg-card border border-border rounded-2xl p-6">
              <h3 className="font-display font-bold mb-4">Weekly Revenue</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={revenueData}>
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: "hsl(0,0%,55%)", fontSize: 12 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: "hsl(0,0%,55%)", fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{ background: "hsl(0,0%,10%)", border: "1px solid hsl(0,0%,18%)", borderRadius: "12px", color: "hsl(0,0%,95%)" }}
                      formatter={(value: number) => [`$${value}`, "Revenue"]}
                    />
                    <Bar dataKey="revenue" fill="hsl(18,100%,55%)" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Popular Items */}
            <div className="bg-card border border-border rounded-2xl p-6">
              <h3 className="font-display font-bold mb-4">Popular Items</h3>
              <div className="space-y-4">
                {popularItems.map((item, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="w-7 h-7 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">
                        {i + 1}
                      </span>
                      <div>
                        <p className="text-sm font-semibold">{item.name}</p>
                        <p className="text-xs text-muted-foreground">{item.orders} orders</p>
                      </div>
                    </div>
                    <span className="font-display font-bold text-sm text-primary">{item.revenue}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
