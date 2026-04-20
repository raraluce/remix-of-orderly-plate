import { DollarSign, CreditCard, CheckCircle2, Clock, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useRestaurantConfig } from "@/contexts/RestaurantConfigContext";

const PaymentsView = () => {
  const { restaurantId } = useRestaurantConfig();

  const { data: payments = [], isLoading } = useQuery({
    queryKey: ["restaurant-payments", restaurantId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("payments")
        .select("*")
        .eq("restaurant_id", restaurantId!)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!restaurantId,
  });

  const completed = payments.filter((p: any) => p.status === "completed");
  const pending = payments.filter((p: any) => p.status === "pending" || p.status === "processing");
  const totalRevenue = completed.reduce((s: number, p: any) => s + Number(p.amount) + Number(p.tip_amount ?? 0), 0);
  const totalPending = pending.reduce((s: number, p: any) => s + Number(p.amount), 0);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-display font-bold">Payments</h1>

      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-2xl p-4">
          <DollarSign className="w-5 h-5 text-primary mb-2" />
          <p className="text-2xl font-display font-bold">€{totalRevenue.toFixed(2)}</p>
          <p className="text-xs text-muted-foreground">Total Collected</p>
        </div>
        <div className="bg-card border border-border rounded-2xl p-4">
          <Clock className="w-5 h-5 text-amber-400 mb-2" />
          <p className="text-2xl font-display font-bold">€{totalPending.toFixed(2)}</p>
          <p className="text-xs text-muted-foreground">Pending</p>
        </div>
        <div className="bg-card border border-border rounded-2xl p-4">
          <CreditCard className="w-5 h-5 text-emerald-400 mb-2" />
          <p className="text-2xl font-display font-bold">{payments.length}</p>
          <p className="text-xs text-muted-foreground">Transactions</p>
        </div>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-16 text-muted-foreground">
          <Loader2 className="w-5 h-5 animate-spin mr-2" /> Loading payments…
        </div>
      )}

      {/* Payment History */}
      {!isLoading && (
        <div className="bg-card border border-border rounded-2xl p-5">
          <h2 className="font-display font-bold mb-4">Recent Payments</h2>
          <div className="space-y-3">
            {payments.map((payment: any) => (
              <div key={payment.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    payment.status === "completed" ? "bg-emerald-500/20" : "bg-amber-500/20"
                  }`}>
                    {payment.status === "completed" ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Clock className="w-4 h-4 text-amber-400" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">#{payment.id.slice(0, 8).toUpperCase()}</p>
                    <p className="text-[11px] text-muted-foreground capitalize">
                      {(payment.split_mode ?? "full")} · {payment.provider ?? "card"}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-display font-bold text-sm text-primary">€{Number(payment.amount).toFixed(2)}</p>
                  <p className="text-[10px] text-muted-foreground">
                    {new Date(payment.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </div>
            ))}
            {payments.length === 0 && (
              <p className="text-center text-muted-foreground py-6 text-sm">No payments yet</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentsView;
