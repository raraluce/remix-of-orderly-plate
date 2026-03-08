import React, { createContext, useContext, useState, ReactNode, useCallback } from "react";
import type { QRSession, SessionUser, OrderStatus } from "@/types";
import { analyticsService } from "@/services/analyticsService";

interface TableSessionContextType {
  session: QRSession | null;
  tableNumber: number | null;
  restaurantId: string | null;
  isHost: boolean;
  users: SessionUser[];
  orderStatus: OrderStatus | null;
  startSession: (tableNumber: number) => void;
  joinSession: (sessionId: string, user: Omit<SessionUser, "joinedAt" | "isHost">) => void;
  endSession: () => void;
  setOrderStatus: (status: OrderStatus) => void;
  currentUserId: string;
}

const TableSessionContext = createContext<TableSessionContextType | undefined>(undefined);

const CURRENT_USER_ID = "user-1";

export const TableSessionProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<QRSession | null>(null);
  const [orderStatus, setOrderStatusState] = useState<OrderStatus | null>(null);

  const startSession = useCallback((tableNumber: number) => {
    const newSession: QRSession = {
      id: `session-${Date.now()}`,
      tableId: `table-${tableNumber}`,
      restaurantId: "rest-001",
      startedAt: new Date().toISOString(),
      status: "active",
      users: [{
        userId: CURRENT_USER_ID,
        name: "Jamie D.",
        initials: "JD",
        avatarColor: "gradient-accent",
        joinedAt: new Date().toISOString(),
        isHost: true,
      }],
    };
    setSession(newSession);
    analyticsService.track("qr_scanned", { tableNumber }, { tableId: `table-${tableNumber}` });
    analyticsService.track("session_started", { tableNumber }, { sessionId: newSession.id, tableId: `table-${tableNumber}` });
  }, []);

  const joinSession = useCallback((sessionId: string, user: Omit<SessionUser, "joinedAt" | "isHost">) => {
    setSession((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        users: [...prev.users, { ...user, joinedAt: new Date().toISOString(), isHost: false }],
      };
    });
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
    if (session) {
      setSession((prev) => prev ? { ...prev, status: status === "paid" ? "paid" : "ordering" } : prev);
    }
  }, [session]);

  const tableNumber = session ? parseInt(session.tableId.split("-")[1]) : null;
  const isHost = session?.users[0]?.userId === CURRENT_USER_ID;

  return (
    <TableSessionContext.Provider value={{
      session,
      tableNumber,
      restaurantId: session?.restaurantId ?? null,
      isHost,
      users: session?.users ?? [],
      orderStatus,
      startSession,
      joinSession,
      endSession,
      setOrderStatus,
      currentUserId: CURRENT_USER_ID,
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
