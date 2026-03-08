import { useLocation, useNavigate } from "react-router-dom";
import { Home, Map, ScanLine } from "lucide-react";
import { motion } from "framer-motion";

const tabs = [
  { id: "explore", label: "Explore", icon: Home, path: "/explore" },
  { id: "map", label: "Map", icon: Map, path: "/map" },
  { id: "scan", label: "Scan QR", icon: ScanLine, path: "/qr" },
] as const;

const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const activeTab = tabs.find((t) => location.pathname.startsWith(t.path))?.id ?? "explore";

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/90 backdrop-blur-xl border-t border-border safe-bottom">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-4">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => navigate(tab.path)}
              className="relative flex flex-col items-center justify-center gap-0.5 flex-1 py-2"
            >
              {isActive && (
                <motion.div
                  layoutId="bottomnav-indicator"
                  className="absolute -top-px left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-primary"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <Icon
                className={`w-5 h-5 transition-colors ${
                  isActive ? "text-primary" : "text-muted-foreground"
                }`}
              />
              <span
                className={`text-[10px] font-semibold transition-colors ${
                  isActive ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
