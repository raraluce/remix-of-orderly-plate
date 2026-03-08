// ═══════════════════════════════════════════════════════════════
// .bite — Analytics Event Tracking Service
// ═══════════════════════════════════════════════════════════════

import type { AnalyticsEvent, AnalyticsEventType } from "@/types";
import { mockAnalyticsEvents } from "./mockData";

const events: AnalyticsEvent[] = [...mockAnalyticsEvents];

export const analyticsService = {
  track(type: AnalyticsEventType, data: Record<string, any> = {}, context?: { sessionId?: string; tableId?: string; userId?: string }) {
    const event: AnalyticsEvent = {
      id: `evt-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      type,
      restaurantId: "rest-001",
      sessionId: context?.sessionId,
      tableId: context?.tableId,
      userId: context?.userId,
      data,
      timestamp: new Date().toISOString(),
    };
    events.push(event);
    console.debug("[.bite analytics]", type, data);
    return event;
  },

  getAll(): AnalyticsEvent[] {
    return [...events].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  },

  getByType(type: AnalyticsEventType): AnalyticsEvent[] {
    return events.filter((e) => e.type === type);
  },

  getMetrics() {
    const today = new Date().toDateString();
    const todayEvents = events.filter((e) => new Date(e.timestamp).toDateString() === today);

    return {
      totalEvents: events.length,
      todayEvents: todayEvents.length,
      qrScans: events.filter((e) => e.type === "qr_scanned").length,
      dishViews: events.filter((e) => e.type === "dish_viewed").length,
      cartAdds: events.filter((e) => e.type === "dish_added_to_cart").length,
      ordersPlaced: events.filter((e) => e.type === "order_placed").length,
      paymentsCompleted: events.filter((e) => e.type === "payment_completed").length,
      recommendationsAccepted: events.filter((e) => e.type === "recommendation_accepted").length,
      conversionRate: events.filter((e) => e.type === "order_placed").length /
        Math.max(1, events.filter((e) => e.type === "qr_scanned").length) * 100,
    };
  },
};
