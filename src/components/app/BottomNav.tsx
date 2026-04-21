import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

type Tab = {
  id: string;
  label: string;
  icon: string;
  iconFilled: string;
  path: string;
};

const tabs: Tab[] = [
  { id: "explore", label: "Explore", icon: "explore", iconFilled: "explore", path: "/explore" },
  { id: "map", label: "Map", icon: "location_on", iconFilled: "location_on", path: "/map" },
  { id: "scan", label: "Scan", icon: "qr_code_scanner", iconFilled: "qr_code_scanner", path: "/qr" },
];

const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const activeTab = tabs.find((t) => location.pathname.startsWith(t.path))?.id ?? "explore";

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass-strong rounded-t-3xl border-t border-foreground/5 shadow-[0_-4px_32px_rgba(28,28,25,0.06)] safe-bottom">
      <div className="flex justify-around items-center px-6 pt-3 pb-3 max-w-lg mx-auto">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => navigate(tab.path)}
              className="relative flex flex-col items-center justify-center px-5 py-2 active:scale-90 duration-300 ease-out transition-all"
            >
              {isActive && (
                <motion.div
                  layoutId="bottomnav-pill"
                  className="absolute inset-0 rounded-full bg-primary/10"
                  transition={{ type: "spring", stiffness: 500, damping: 35 }}
                />
              )}
              <span
                className={`material-symbols-outlined relative z-10 text-[24px] transition-colors ${
                  isActive ? "text-primary filled" : "text-foreground/45"
                }`}
                style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
              >
                {isActive ? tab.iconFilled : tab.icon}
              </span>
              <span
                className={`relative z-10 font-body text-[10px] uppercase tracking-[0.15em] font-medium mt-1 transition-colors ${
                  isActive ? "text-primary" : "text-foreground/45"
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
