import React, { createContext, useContext, useEffect, useMemo, useState, ReactNode, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { sessionService } from "@/services/sessionService";
import type { QRSession, SessionUser, OrderStatus } from "@/types";
import { analyticsService } from "@/services/analyticsService";

interface TableSessionContextType {
  session: QRSession | null;
  tableNumber: number | null;
  tableLabel: string | null;
  restaurantId: string | null;
  sessionId: string | null;
  isHost: boolean;
  users: SessionUser[];
  orderStatus: OrderStatus | null;
  /** Legacy demo helpers — kept so existing consumers keep working */
  startSession: (tableNumber: number) => void;
  joinSession: (sessionId: string, user: Omit<SessionUser, "joinedAt" | "isHost">) => void;
  endSession: () => void;
  setOrderStatus: (status: OrderStatus) => void;
  currentUserId: string | null;
}

const TableSessionContext = createContext<TableSessionContextType | undefined>(undefined);

const AVATAR_GRADIENTS = [
  "gradient-accent",
  "bg-gradient-to-br from-pink-500 to-rose-500",
  "bg-gradient-to-br from-sky-500 to-indigo-500",
  "bg-gradient-to-br from-emerald-500 to-teal-500",
  "bg-gradient-to-br from-amber-500 to-orange-500",
  "bg-gradient-to-br from-fuchsia-500 to-purple-500",
];

function initialsFromName(name: string | null | undefined): string {
  if (!name) return "G";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function pickAvatar(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) | 0;
  return AVATAR_GRADIENTS[Math.abs(hash) % AVATAR_GRADIENTS.length];
}

interface ParticipantRow {
  id: string;
  session_id: string;
  user_id: string | null;
  display_name: string | null;
  is_guest: boolean;
  joined_at: string;
}

export const TableSessionProvider = ({ children }: { children: ReactNode }) => {
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const sessionIdParam = searchParams.get("session");
  const restaurantIdParam = searchParams.get("restaurant");
  const tableLabelParam = searchParams.get("table");

  const [session, setSession] = useState<QRSession | null>(null);
  const [orderStatus, setOrderStatusState] = useState<OrderStatus | null>(null);
  const [tableLabel, setTableLabel] = useState<string | null>(tableLabelParam);

  // Hydrate session from Supabase whenever the URL session id changes
  useEffect(() => {
    if (!sessionIdParam) {
      setSession(null);
      setTableLabel(null);
      return;
    }

    let cancelled = false;

    const hydrate = async () => {
      try {
        // Load the session row + table label
        const { data: row, error } = await supabase
          .from("table_sessions")
          .select("id, table_id, restaurant_id, opened_at, status, tables(label)")
          .eq("id", sessionIdParam)
          .maybeSingle();

        if (error || !row || cancelled) return;

        const label = (row as any).tables?.label ?? tableLabelParam ?? "—";
        setTableLabel(label);

        const participants = await sessionService.getParticipants(sessionIdParam);
        if (cancelled) return;

        const users: SessionUser[] = (participants as ParticipantRow[]).map((p, i) => ({
          userId: p.user_id ?? p.id,
          name: p.display_name || (p.is_guest ? "Guest" : "Diner"),
          initials: initialsFromName(p.display_name),
          avatarColor: pickAvatar(p.user_id ?? p.id),
          joinedAt: p.joined_at,
          isHost: i === 0, // first participant is treated as host
        }));

        setSession({
          id: row.id,
          tableId: row.table_id,
          restaurantId: row.restaurant_id,
          startedAt: row.opened_at,
          status: row.status === "closed" ? "closed" : "active",
          users,
        });
      } catch (e) {
        console.error("Failed to hydrate table session", e);
      }
    };

    hydrate();
    return () => {
      cancelled = true;
    };
  }, [sessionIdParam, tableLabelParam]);

  // Realtime: keep participant list in sync
  useEffect(() => {
    if (!sessionIdParam) return;

    const channel = sessionService.subscribeToParticipants(sessionIdParam, (participants) => {
      setSession((prev) => {
        if (!prev) return prev;
        const users: SessionUser[] = (participants as ParticipantRow[]).map((p, i) => ({
          userId: p.user_id ?? p.id,
          name: p.display_name || (p.is_guest ? "Guest" : "Diner"),
          initials: initialsFromName(p.display_name),
          avatarColor: pickAvatar(p.user_id ?? p.id),
          joinedAt: p.joined_at,
          isHost: i === 0,
        }));
        return { ...prev, users };
      });
    });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [sessionIdParam]);

  // Derive a numeric table number from the label when possible (backwards compat)
  const tableNumber = useMemo(() => {
    if (!tableLabel) return null;
    const m = tableLabel.match(/\d+/);
    return m ? parseInt(m[0], 10) : null;
  }, [tableLabel]);

  const isHost = useMemo(() => {
    if (!session || !user) return false;
    return session.users[0]?.userId === user.id;
  }, [session, user]);

  // Legacy helpers (kept so older pages don't crash) ----------------------
  const startSession = useCallback((tableNum: number) => {
    // Demo fallback only — real sessions are created via /join/:slug/:tableId
    const newSession: QRSession = {
      id: `local-${Date.now()}`,
      tableId: `table-${tableNum}`,
      restaurantId: restaurantIdParam ?? "",
      startedAt: new Date().toISOString(),
      status: "active",
      users: [],
    };
    setSession(newSession);
    setTableLabel(String(tableNum));
    analyticsService.track("session_started", { tableNumber: tableNum }, { sessionId: newSession.id, tableId: newSession.tableId });
  }, [restaurantIdParam]);

  const joinSession = useCallback((_sessionId: string, _user: Omit<SessionUser, "joinedAt" | "isHost">) => {
    // No-op: real joining happens in /join/:slug/:tableId via sessionService
  }, []);

  const endSession = useCallback(() => {
    if (session) {
      analyticsService.track("session_ended", {}, { sessionId: session.id, tableId: session.tableId });
    }
    setSession(null);
    setOrderStatusState(null);
  }, [session]);

  const setOrderStatus = useCallback((status: OrderStatus) => {
    setOrderStatusState(status);
  }, []);

  return (
    <TableSessionContext.Provider value={{
      session,
      tableNumber,
      tableLabel,
      restaurantId: session?.restaurantId ?? restaurantIdParam ?? null,
      sessionId: session?.id ?? sessionIdParam,
      isHost,
      users: session?.users ?? [],
      orderStatus,
      startSession,
      joinSession,
      endSession,
      setOrderStatus,
      currentUserId: user?.id ?? null,
    }}>
      {children}
    </TableSessionContext.Provider>
  );
};

export const useTableSession = () => {
  const ctx = useContext(TableSessionContext);
  if (!ctx) throw new Error("useTableSession must be used within TableSessionProvider");
  return ctx;
};
