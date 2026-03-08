import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { QrCode, Users, Utensils, ArrowRight, Wifi } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTableSession } from "@/contexts/TableSessionContext";
import { mockRestaurant } from "@/services/mockData";

const QREntry = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { startSession, session } = useTableSession();
  const [tableNum] = useState(() => parseInt(searchParams.get("table") || "3"));
  const [joining, setJoining] = useState(false);

  const handleEnterMenu = () => {
    startSession(tableNum);
    setJoining(true);
    setTimeout(() => navigate("/menu"), 800);
  };

  const handleJoinTable = () => {
    startSession(tableNum);
    setJoining(true);
    setTimeout(() => navigate("/menu"), 800);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 text-center">
      {/* Animated logo */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <div className="w-24 h-24 rounded-3xl gradient-accent flex items-center justify-center glow-accent mx-auto mb-6">
          <QrCode className="w-12 h-12 text-primary-foreground" />
        </div>
        <h1 className="text-3xl font-display font-bold">
          <span className="text-gradient">.bite</span>
        </h1>
      </motion.div>

      {/* Restaurant info */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="mb-8"
      >
        <h2 className="text-xl font-display font-bold mb-1">{mockRestaurant.name}</h2>
        <p className="text-muted-foreground text-sm">{mockRestaurant.address}</p>
      </motion.div>

      {/* Table card */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.35, duration: 0.4 }}
        className="w-full max-w-xs bg-card border border-border rounded-2xl p-6 mb-8"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Utensils className="w-6 h-6 text-primary" />
            </div>
            <div className="text-left">
              <p className="font-display font-bold text-lg">Table {tableNum}</p>
              <p className="text-xs text-muted-foreground">Seats available</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <Wifi className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-[10px] text-emerald-400 font-semibold">Live</span>
          </div>
        </div>

        {session && (
          <div className="bg-secondary rounded-xl p-3 mb-4">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">{session.users.length} at this table</span>
            </div>
            <div className="flex -space-x-2">
              {session.users.map((u, i) => (
                <div key={i} className={`w-7 h-7 rounded-full ${u.avatarColor} border-2 border-card flex items-center justify-center text-[9px] font-bold text-primary-foreground`}>
                  {u.initials}
                </div>
              ))}
            </div>
          </div>
        )}

        <p className="text-xs text-muted-foreground text-center">
          Scan detected · Table #{tableNum}
        </p>
      </motion.div>

      {/* Actions */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.4 }}
        className="w-full max-w-xs space-y-3"
      >
        {joining ? (
          <div className="flex items-center justify-center gap-3 py-4">
            <span className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
            <span className="text-sm text-muted-foreground">Joining table…</span>
          </div>
        ) : (
          <>
            <Button
              size="lg"
              className="w-full h-14 gradient-accent text-primary-foreground rounded-2xl font-display font-bold text-base glow-accent-sm"
              onClick={handleEnterMenu}
            >
              <Utensils className="w-5 h-5 mr-2" /> View Menu & Order
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="w-full h-14 rounded-2xl font-display font-semibold text-sm"
              onClick={handleJoinTable}
            >
              <Users className="w-5 h-5 mr-2" /> Join this Table
            </Button>
          </>
        )}
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="mt-8 text-[11px] text-muted-foreground"
      >
        Powered by <span className="text-gradient font-bold">.bite</span>
      </motion.p>
    </div>
  );
};

export default QREntry;
