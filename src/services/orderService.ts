import { supabase } from "@/integrations/supabase/client";
import type { RealtimeChannel } from "@supabase/supabase-js";

export interface CreateOrderInput {
  restaurantId: string;
  sessionId: string;
  participantId?: string;
  userId?: string;
}

export interface AddOrderItemInput {
  orderId: string;
  sessionId: string;
  dishId: string;
  quantity: number;
  unitPrice: number;
  notes?: string;
}

export const orderService = {
  /** Create a draft order for a session */
  async createOrder(input: CreateOrderInput) {
    const { data, error } = await supabase
      .from("orders")
      .insert({
        restaurant_id: input.restaurantId,
        session_id: input.sessionId,
        participant_id: input.participantId ?? null,
        user_id: input.userId ?? null,
        status: "draft" as const,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /** Add item to an order */
  async addItem(input: AddOrderItemInput) {
    const { data, error } = await supabase
      .from("order_items")
      .insert({
        order_id: input.orderId,
        session_id: input.sessionId,
        dish_id: input.dishId,
        quantity: input.quantity,
        unit_price: input.unitPrice,
        notes: input.notes ?? null,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /** Update item quantity */
  async updateItemQuantity(itemId: string, quantity: number) {
    if (quantity <= 0) {
      return orderService.removeItem(itemId);
    }
    const { error } = await supabase
      .from("order_items")
      .update({ quantity })
      .eq("id", itemId);

    if (error) throw error;
  },

  /** Remove an item */
  async removeItem(itemId: string) {
    const { error } = await supabase
      .from("order_items")
      .update({ status: "cancelled" as const })
      .eq("id", itemId);

    if (error) throw error;
  },

  /** Submit an order (draft → submitted) */
  async submitOrder(orderId: string) {
    const { data, error } = await supabase
      .from("orders")
      .update({ status: "submitted" as const, submitted_at: new Date().toISOString() })
      .eq("id", orderId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /** Get all orders for a session with items */
  async getSessionOrders(sessionId: string) {
    const { data, error } = await supabase
      .from("orders")
      .select("*, order_items(*, dishes(name, image_url))")
      .eq("session_id", sessionId)
      .order("created_at");

    if (error) throw error;
    return data ?? [];
  },

  /** Get a single order with items */
  async getOrder(orderId: string) {
    const { data, error } = await supabase
      .from("orders")
      .select("*, order_items(*, dishes(name, image_url))")
      .eq("id", orderId)
      .single();

    if (error) throw error;
    return data;
  },

  /** Subscribe to order item changes for a session (realtime group ordering) */
  subscribeToSessionOrders(
    sessionId: string,
    onUpdate: () => void
  ): RealtimeChannel {
    return supabase
      .channel(`session-orders-${sessionId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "order_items",
          filter: `session_id=eq.${sessionId}`,
        },
        onUpdate
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "orders",
          filter: `session_id=eq.${sessionId}`,
        },
        onUpdate
      )
      .subscribe();
  },

  /** Get orders for restaurant staff */
  async getRestaurantOrders(restaurantId: string, status?: string) {
    let query = supabase
      .from("orders")
      .select("*, order_items(*, dishes(name, image_url)), session_participants(display_name)")
      .eq("restaurant_id", restaurantId)
      .order("created_at", { ascending: false });

    if (status) {
      query = query.eq("status", status as any);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data ?? [];
  },

  /** Update order status (for restaurant staff) */
  async updateOrderStatus(orderId: string, status: string) {
    const { error } = await supabase
      .from("orders")
      .update({ status: status as any })
      .eq("id", orderId);

    if (error) throw error;
  },
};
