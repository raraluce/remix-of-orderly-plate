import { Link } from "react-router-dom";
import { ArrowLeft, Users, ShoppingBag, CreditCard, Clock, Plus, Utensils } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTableSession } from "@/contexts/TableSessionContext";
import { useCart } from "@/contexts/CartContext";

const statusLabels: Record<string, { label: string; color: string }> = {
  pending: { label: "Pending", color: "bg-amber-500/20 text-amber-400" },
  confirmed: { label: "Confirmed", color: "bg-sky-500/20 text-sky-400" },
  preparing: { label: "Preparing", color: "bg-amber-500/20 text-amber-400" },
  ready: { label: "Ready to Serve", color: "bg-emerald-500/20 text-emerald-400" },
  served: { label: "Served", color: "bg-emerald-500/20 text-emerald-400" },
  paid: { label: "Paid", color: "bg-secondary text-muted-foreground" },
};

const TableView = () => {
  const { session, tableNumber, users, orderStatus, endSession } = useTableSession();
  const { items, total } = useCart();

  if (!session) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">No active table session</p>
          <Link to="/qr?table=3">
            <Button className="gradient-accent text-primary-foreground rounded-full">Scan QR Code</Button>
          </Link>
        </div>
      </div>
    );
  }

  const st = orderStatus ? statusLabels[orderStatus] : null;

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="border-b border-border glass sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center gap-4">
          <Link to="/menu" className="p-2 rounded-full hover:bg-secondary transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex-1">
            <h1 className="font-display font-bold text-lg">Table {tableNumber}</h1>
            <p className="text-xs text-muted-foreground">Active session</p>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs text-muted-foreground">Live</span>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 space-y-6 max-w-md">
        {/* Connected Users */}
        <div className="bg-card border border-border rounded-2xl p-5 animate-fade-up">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-4 h-4 text-primary" />
            <h2 className="font-display font-semibold text-sm">People at this table</h2>
            <span className="ml-auto text-xs text-muted-foreground">{users.length} guest{users.length > 1 ? "s" : ""}</span>
          </div>
          <div className="space-y-3">
            {users.map((u, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full ${u.avatarColor} flex items-center justify-center text-sm font-bold text-primary-foreground`}>
                  {u.initials}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold">{u.name}</p>
                  <p className="text-[11px] text-muted-foreground">
                    Joined {new Date(u.joinedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
                {u.isHost && (
                  <span className="px-2 py-0.5 rounded-full bg-primary/20 text-primary text-[10px] font-bold">Host</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Order Status */}
        {orderStatus && st && (
          <div className="bg-card border border-border rounded-2xl p-5 animate-fade-up" style={{ animationDelay: "0.05s" }}>
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-4 h-4 text-primary" />
              <h2 className="font-display font-semibold text-sm">Order Status</h2>
            </div>
            <div className="flex items-center gap-3">
              <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${st.color}`}>{st.label}</span>
              {orderStatus === "preparing" && (
                <span className="text-xs text-muted-foreground">Est. 15-20 min</span>
              )}
            </div>

            {/* Progress steps */}
            <div className="mt-4 flex gap-1">
              {["confirmed", "preparing", "ready", "served"].map((step, i) => {
                const steps = ["confirmed", "preparing", "ready", "served"];
                const currentIdx = steps.indexOf(orderStatus);
                const isActive = i <= currentIdx;
                return (
                  <div key={step} className={`flex-1 h-1.5 rounded-full transition-colors ${isActive ? "gradient-accent" : "bg-secondary"}`} />
                );
              })}
            </div>
          </div>
        )}

        {/* Table Total */}
        <div className="bg-card border border-border rounded-2xl p-5 animate-fade-up" style={{ animationDelay: "0.1s" }}>
          <div className="flex items-center gap-2 mb-3">
            <ShoppingBag className="w-4 h-4 text-primary" />
            <h2 className="font-display font-semibold text-sm">Table Summary</h2>
          </div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted-foreground">{items.length} items ordered</span>
            <span className="font-display font-bold text-primary">${total.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Service fee (5%)</span>
            <span className="font-semibold">${(total * 0.05).toFixed(2)}</span>
          </div>
          <div className="border-t border-border mt-3 pt-3 flex justify-between font-display font-bold">
            <span>Total</span>
            <span className="text-gradient">${(total * 1.05).toFixed(2)}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <Link to="/menu">
            <Button className="w-full gradient-accent text-primary-foreground rounded-2xl py-6 font-semibold glow-accent-sm">
              <Plus className="w-5 h-5 mr-2" /> Add More Items
            </Button>
          </Link>
          {items.length > 0 && (
            <Link to="/payment">
              <Button variant="outline" className="w-full rounded-2xl py-6 font-semibold border-border">
                <CreditCard className="w-5 h-5 mr-2" /> Pay & Split Bill
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default TableView;
