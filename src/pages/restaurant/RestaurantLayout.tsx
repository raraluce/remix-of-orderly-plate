import { useState } from "react";
import { Link, Outlet, useLocation, Navigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useRestaurantConfig } from "@/contexts/RestaurantConfigContext";

const navItems = [
  { path: "/restaurant", label: "Overview", icon: "dashboard" },
  { path: "/restaurant/orders", label: "Live Orders", icon: "restaurant" },
  { path: "/restaurant/tables", label: "Tables", icon: "table_restaurant" },
  { path: "/restaurant/menu", label: "Menu", icon: "menu_book" },
  { path: "/restaurant/payments", label: "Payments", icon: "payments" },
  { path: "/restaurant/analytics", label: "Analytics", icon: "analytics" },
  { path: "/restaurant/settings", label: "Settings", icon: "settings" },
];

const RestaurantLayout = () => {
  const location = useLocation();
  const { user, loading: authLoading } = useAuth();
  const { restaurant, loading: restaurantLoading, noRestaurant } = useRestaurantConfig();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (authLoading || restaurantLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-3">
          <Loader2 className="w-7 h-7 animate-spin text-primary mx-auto" />
          <p className="text-sm text-muted-foreground font-body tracking-wide">Loading dashboard…</p>
        </div>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  if (noRestaurant) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="max-w-md text-center space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-surface-low flex items-center justify-center mx-auto">
            <span className="material-symbols-outlined text-primary text-[32px]">storefront</span>
          </div>
          <h1 className="text-3xl font-display italic text-foreground">No restaurant linked</h1>
          <p className="text-muted-foreground text-sm font-body leading-relaxed">
            Your account isn't linked to a restaurant yet. Ask the owner to add you as a team member, or create a new one to begin.
          </p>
          <Link to="/" className="inline-block text-sm text-primary font-semibold hover:underline underline-offset-4">
            ← Back home
          </Link>
        </div>
      </div>
    );
  }

  const restaurantName = restaurant?.name ?? "Restaurant";

  const isActive = (path: string) => {
    if (path === "/restaurant") return location.pathname === "/restaurant";
    return location.pathname.startsWith(path);
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full py-8 px-4">
      <div className="mb-10 px-4">
        <Link to="/" className="block">
          <h1 className="font-display italic text-3xl text-primary tracking-tight leading-none">bite.</h1>
          <p className="font-body text-[10px] uppercase tracking-[0.18em] text-muted-foreground mt-1.5">Kitchen Management</p>
        </Link>
      </div>

      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const active = isActive(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all duration-200 ${
                active
                  ? "bg-surface-container text-primary font-bold border-r-2 border-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-surface-low font-medium"
              }`}
            >
              <span
                className="material-symbols-outlined text-[22px] shrink-0"
                style={active ? { fontVariationSettings: "'FILL' 1" } : undefined}
              >
                {item.icon}
              </span>
              <span className="font-body tracking-tight">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto pt-6 px-2 border-t border-border/40">
        <div className="flex items-center gap-3 py-2">
          <div className="w-10 h-10 rounded-full gradient-accent flex items-center justify-center text-primary-foreground">
            <span className="material-symbols-outlined text-[20px]">person</span>
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-body font-semibold truncate">{restaurantName}</p>
            <p className="text-[10px] text-muted-foreground capitalize uppercase tracking-wider">
              {restaurant?.status ?? "—"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop sidebar — editorial warm tone */}
      <aside className="hidden lg:flex flex-col w-64 shrink-0 bg-surface-low border-r border-border/30">
        <SidebarContent />
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-foreground/40 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-64 bg-surface-low animate-fade-in">
            <SidebarContent />
          </aside>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <header className="glass sticky top-0 z-40 lg:hidden">
          <div className="px-5 h-16 flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="p-2 rounded-full hover:bg-surface-low transition-colors text-primary"
            >
              <span className="material-symbols-outlined">menu</span>
            </button>
            <span className="font-display italic text-2xl text-primary">bite.</span>
          </div>
        </header>
        <main className="flex-1 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default RestaurantLayout;
