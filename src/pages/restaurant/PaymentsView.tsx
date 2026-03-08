import { DollarSign, CreditCard, CheckCircle2, Clock } from "lucide-react";
import { mockOrders, mockPayments } from "@/services/mockData";

const PaymentsView = () => {
  const paidOrders = mockOrders.filter((o) => o.status === "paid" || o.paidAt);
  const pendingOrders = mockOrders.filter((o) => !o.paidAt && o.status !== "cancelled" && o.status !== "paid");
  const totalRevenue = paidOrders.reduce((sum, o) => sum + o.total, 0);
  const totalPending = pendingOrders.reduce((sum, o) => sum + o.total, 0);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-display font-bold">Payments</h1>

      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-2xl p-4">
          <DollarSign className="w-5 h-5 text-primary mb-2" />
          <p className="text-2xl font-display font-bold">${totalRevenue.toFixed(2)}</p>
          <p className="text-xs text-muted-foreground">Total Collected</p>
        </div>
        <div className="bg-card border border-border rounded-2xl p-4">
          <Clock className="w-5 h-5 text-amber-400 mb-2" />
          <p className="text-2xl font-display font-bold">${totalPending.toFixed(2)}</p>
          <p className="text-xs text-muted-foreground">Pending</p>
        </div>
        <div className="bg-card border border-border rounded-2xl p-4">
          <CreditCard className="w-5 h-5 text-emerald-400 mb-2" />
          <p className="text-2xl font-display font-bold">{mockPayments.length}</p>
          <p className="text-xs text-muted-foreground">Transactions</p>
        </div>
      </div>

      {/* Payment History */}
      <div className="bg-card border border-border rounded-2xl p-5">
        <h2 className="font-display font-bold mb-4">Recent Payments</h2>
        <div className="space-y-3">
          {mockPayments.map((payment) => (
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
                  <p className="text-sm font-semibold">{payment.orderId}</p>
                  <p className="text-[11px] text-muted-foreground capitalize">
                    {payment.splitType} split · {payment.method}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-display font-bold text-sm text-primary">${payment.amount.toFixed(2)}</p>
                <p className="text-[10px] text-muted-foreground">
                  {new Date(payment.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pending Orders */}
      {pendingOrders.length > 0 && (
        <div className="bg-card border border-border rounded-2xl p-5">
          <h2 className="font-display font-bold mb-4">Pending Payments</h2>
          <div className="space-y-3">
            {pendingOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between py-2">
                <div>
                  <p className="text-sm font-semibold">{order.id}</p>
                  <p className="text-xs text-muted-foreground">Table {order.tableId.split("-")[1]} · {order.items.length} items</p>
                </div>
                <span className="font-display font-bold text-sm text-amber-400">${order.total.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentsView;
