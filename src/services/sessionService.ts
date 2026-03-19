import { supabase } from "@/integrations/supabase/client";
import type { RealtimeChannel } from "@supabase/supabase-js";

export const sessionService = {
  /** Create a new table session and join as first participant */
  async createSession(tableId: string, restaurantId: string) {
    // Mark table as occupied
    // Note: this requires the user to be a restaurant member or have appropriate RLS
    // For guests, the session creation itself is public

    const { data: session, error } = await supabase
      .from("table_sessions")
      .insert({ table_id: tableId, restaurant_id: restaurantId })
      .select()
      .single();

    if (error) throw error;
    return session;
  },

  /** Find active session for a given table */
  async findActiveSession(tableId: string) {
    const { data, error } = await supabase
      .from("table_sessions")
      .select("*, session_participants(*)")
      .eq("table_id", tableId)
      .eq("status", "active")
      .order("opened_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  /** Join a session as a participant */
  async joinSession(sessionId: string, displayName: string, userId?: string) {
    const { data, error } = await supabase
      .from("session_participants")
      .insert({
        session_id: sessionId,
        display_name: displayName,
        user_id: userId ?? null,
        is_guest: !userId,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /** Get participants of a session */
  async getParticipants(sessionId: string) {
    const { data, error } = await supabase
      .from("session_participants")
      .select("*")
      .eq("session_id", sessionId)
      .order("joined_at");

    if (error) throw error;
    return data ?? [];
  },

  /** Subscribe to session participant changes */
  subscribeToParticipants(
    sessionId: string,
    onUpdate: (participants: any[]) => void
  ): RealtimeChannel {
    return supabase
      .channel(`session-participants-${sessionId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "session_participants",
          filter: `session_id=eq.${sessionId}`,
        },
        async () => {
          // Refetch all participants on any change
          const participants = await sessionService.getParticipants(sessionId);
          onUpdate(participants);
        }
      )
      .subscribe();
  },

  /** Close a session */
  async closeSession(sessionId: string) {
    const { error } = await supabase
      .from("table_sessions")
      .update({ status: "closed" as const, closed_at: new Date().toISOString() })
      .eq("id", sessionId);

    if (error) throw error;
  },

  /** Look up a table by its ID or label */
  async getTable(tableId: string) {
    const { data, error } = await supabase
      .from("tables")
      .select("*")
      .eq("id", tableId)
      .single();

    if (error) throw error;
    return data;
  },

  /** Look up tables by restaurant */
  async getTablesByRestaurant(restaurantId: string) {
    const { data, error } = await supabase
      .from("tables")
      .select("*")
      .eq("restaurant_id", restaurantId)
      .order("sort_order");

    if (error) throw error;
    return data ?? [];
  },
};
