import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, Eye, ShoppingBag, CreditCard, QrCode, Sparkles, MousePointerClick } from "lucide-react";
import { analyticsService } from "@/services/analyticsService";
import { menuItems } from "@/data/menuData";

const revenueData = [
  { day: "Mon", revenue: 1800 },
  { day: "Tue", revenue: 2200 },
  { day: "Wed", revenue: 1900 },
  { day: "Thu", revenue: 2600 },
  { day: "Fri", revenue: 3100 },
  { day: "Sat", revenue: 3800 },
  { day: "Sun", revenue: 2847 },
];

const popularItems = [
  { name: "Smash Burger Deluxe", orders: 28, revenue: 518 },
  { name: "Truffle Spaghetti", orders: 22, revenue: 528 },
  { name: "Dragon Roll Platter", orders: 19, revenue: 418 },
  { name: "Sunset Spritz", orders: 31, revenue: 403 },
  { name: "Miso Glazed Salmon", orders: 17, revenue: 459 },
];

const categoryData = [
  { name: "Mains", value: 42, color: "hsl(18, 100%, 55%)" },
  { name: "Starters", value: 25, color: "hsl(30, 100%, 60%)" },
  { name: "Drinks", value: 18, color: "hsl(200, 80%, 55%)" },
  { name: "Desserts", value: 10, color: "hsl(270, 70%, 55%)" },
  { name: "Sides", value: 5, color: "hsl(150, 60%, 50%)" },
];

const AnalyticsDashboard = () => {
  const metrics = analyticsService.getMetrics();

  const metricCards = [
    { label: "QR Scans", value: metrics.qrScans, icon: QrCode },
    { label: "Dish Views", value: metrics.dishViews, icon: Eye },
    { label: "Cart Adds", value: metrics.cartAdds, icon: ShoppingBag },
    { label: "Orders", value: metrics.ordersPlaced, icon: CreditCard },
    { label: "Recommendations Used", value: metrics.recommendationsAccepted, icon: Sparkles },
    { label: "Conversion", value: `${metrics.conversionRate.toFixed(0)}%`, icon: TrendingUp },
  ];

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-display font-bold">Analytics</h1>

      {/* Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {metricCards.map((m, i) => (
          <div key={i} className="bg-card border border-border rounded-2xl p-4 animate-fade-up" style={{ animationDelay: `${i * 0.05}s` }}>
            <m.icon className="w-5 h-5 text-primary mb-2" />
            <p className="text-2xl font-display font-bold">{m.value}</p>
            <p className="text-xs text-muted-foreground">{m.label}</p>
          </div>
        ))}
      </div>

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

        {/* Category Distribution */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <h3 className="font-display font-bold mb-4">Orders by Category</h3>
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={categoryData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, value }) => `${name} ${value}%`}>
                  {categoryData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Popular Items */}
      <div className="bg-card border border-border rounded-2xl p-6">
        <h3 className="font-display font-bold mb-4">Most Popular Items</h3>
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
              <span className="font-display font-bold text-sm text-primary">${item.revenue}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
