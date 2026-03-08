import { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import {
  LayoutDashboard, UtensilsCrossed, ShoppingBag, QrCode,
  CreditCard, BarChart3, Settings, ChevronLeft, ChevronRight, Menu
} from "lucide-react";

const navItems = [
  { path: "/restaurant", label: "Dashboard", icon: LayoutDashboard },
  { path: "/restaurant/orders", label: "Orders", icon: ShoppingBag },
  { path: "/restaurant/menu", label: "Menu", icon: UtensilsCrossed },
  { path: "/restaurant/tables", label: "Tables & QR", icon: QrCode },
  { path: "/restaurant/payments", label: "Payments", icon: CreditCard },
  { path: "/restaurant/analytics", label: "Analytics", icon: BarChart3 },
  { path: "/restaurant/settings", label: "Settings", icon: Settings },
];

const RestaurantLayout = () => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === "/restaurant") return location.pathname === "/restaurant";
    return location.pathname.startsWith(path);
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-4 flex items-center justify-between border-b border-border">
        {!collapsed && (
          <Link to="/" className="font-display text-lg font-bold">
            <span className="text-gradient">.bite</span>
            <span className="text-[10px] text-muted-foreground ml-2 font-body">Admin</span>
          </Link>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:flex p-1.5 rounded-lg hover:bg-secondary transition-colors"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      <nav className="flex-1 p-2 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const active = isActive(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                active
                  ? "gradient-accent text-primary-foreground glow-accent-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              }`}
            >
              <item.icon className="w-4.5 h-4.5 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full gradient-accent flex items-center justify-center text-xs font-bold text-primary-foreground">
            OW
          </div>
          {!collapsed && (
            <div>
              <p className="text-xs font-semibold">The Grand Kitchen</p>
              <p className="text-[10px] text-muted-foreground">Owner</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop sidebar */}
      <aside className={`hidden lg:flex flex-col border-r border-border bg-card shrink-0 transition-all duration-300 ${collapsed ? "w-16" : "w-56"}`}>
        <SidebarContent />
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-background/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-56 bg-card border-r border-border animate-fade-in">
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="border-b border-border glass sticky top-0 z-40 lg:hidden">
          <div className="px-4 h-14 flex items-center gap-3">
            <button onClick={() => setMobileOpen(true)} className="p-2 rounded-lg hover:bg-secondary">
              <Menu className="w-5 h-5" />
            </button>
            <span className="font-display font-bold text-sm">
              <span className="text-gradient">.bite</span> Admin
            </span>
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
