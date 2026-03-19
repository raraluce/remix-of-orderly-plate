import { supabase } from "@/integrations/supabase/client";

export type SplitType = "full" | "equal" | "by-item";

export interface CreatePaymentInput {
  sessionId: string;
  restaurantId: string;
  userId?: string;
  participantId?: string;
  amount: number;
  tipAmount?: number;
}

export const paymentService = {
  /** Create a payment record */
  async createPayment(input: CreatePaymentInput) {
    const { data, error } = await supabase
      .from("payments")
      .insert({
        session_id: input.sessionId,
        restaurant_id: input.restaurantId,
        user_id: input.userId ?? null,
        participant_id: input.participantId ?? null,
        amount: input.amount,
        tip_amount: input.tipAmount ?? 0,
        status: "pending" as const,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /** Link order items to a payment (for split-by-item) */
  async linkPaymentItems(paymentId: string, items: { order_item_id: string; amount: number }[]) {
    const rows = items.map((item) => ({
      payment_id: paymentId,
      order_item_id: item.order_item_id,
      amount: item.amount,
    }));

    const { error } = await supabase.from("payment_items").insert(rows);
    if (error) throw error;
  },

  /** Calculate equal split amount */
  calculateEqualSplit(totalAmount: number, participantCount: number) {
    const perPerson = Math.ceil((totalAmount / participantCount) * 100) / 100;
    return perPerson;
  },

  /** Calculate by-item split: returns map of participantId → amount */
  calculateItemSplit(
    orderItems: { id: string; unit_price: number; quantity: number; order: { participant_id: string | null } }[]
  ): Record<string, number> {
    const splits: Record<string, number> = {};
    for (const item of orderItems) {
      const pid = item.order?.participant_id ?? "unknown";
      const itemTotal = item.unit_price * item.quantity;
      splits[pid] = (splits[pid] ?? 0) + itemTotal;
    }
    return splits;
  },

  /** Get payments for a session */
  async getSessionPayments(sessionId: string) {
    const { data, error } = await supabase
      .from("payments")
      .select("*, payment_items(order_item_id, amount)")
      .eq("session_id", sessionId)
      .order("created_at");

    if (error) throw error;
    return data ?? [];
  },

  /** Mark payment as completed (would normally be triggered by payment provider webhook) */
  async completePayment(paymentId: string, providerRef?: string) {
    // This is a read-only operation from client side since UPDATE isn't allowed
    // In production, this would be handled by an edge function after payment provider callback
    console.warn("Payment completion should be handled server-side via edge function");
    return { id: paymentId, status: "completed" };
  },

  /** Mark items as paid after payment completion */
  async markItemsPaid(orderItemIds: string[]) {
    // Same note: should be done server-side
    console.warn("Marking items as paid should be handled server-side");
  },
};
