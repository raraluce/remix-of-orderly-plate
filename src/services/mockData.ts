// ═══════════════════════════════════════════════════════════════
// .bite — Mock Data Store (simulated backend)
// ═══════════════════════════════════════════════════════════════

import type {
  Restaurant, Table, QRSession, User, Order, Payment,
  AnalyticsEvent, Feedback, OrderStatus
} from "@/types";

// ── Restaurant ────────────────────────────────────────────────
export const mockRestaurant: Restaurant = {
  id: "rest-001",
  name: "The Grand Kitchen",
  slug: "the-grand-kitchen",
  description: "Modern gastronomy meets tradition. Wood-fired, locally sourced, unforgettable.",
  address: "42 Culinary Street, Foodville",
  phone: "+1 555 123 4567",
  hours: [
    { day: "Mon-Fri", open: "12:00", close: "23:00" },
    { day: "Sat-Sun", open: "11:00", close: "00:00" },
  ],
  currency: "USD",
  serviceFeePercent: 5,
  brandColor: "hsl(18, 100%, 55%)",
};

// ── Tables ────────────────────────────────────────────────────
export const mockTables: Table[] = Array.from({ length: 12 }, (_, i) => ({
  id: `table-${i + 1}`,
  restaurantId: "rest-001",
  number: i + 1,
  label: `Table ${i + 1}`,
  capacity: i < 4 ? 2 : i < 8 ? 4 : 6,
  status: (["available", "occupied", "occupied", "available", "reserved", "occupied",
    "available", "occupied", "cleaning", "available", "occupied", "available"] as Table["status"][])[i],
  qrCode: `https://bite.app/qr/rest-001/table-${i + 1}`,
  currentSessionId: [1, 2, 5, 7, 10].includes(i) ? `session-${i + 1}` : undefined,
}));

// ── Sessions ──────────────────────────────────────────────────
export const mockSessions: QRSession[] = [
  {
    id: "session-2",
    tableId: "table-2",
    restaurantId: "rest-001",
    startedAt: new Date(Date.now() - 45 * 60000).toISOString(),
    status: "ordering",
    users: [
      { userId: "user-1", name: "Jamie D.", initials: "JD", avatarColor: "gradient-accent", joinedAt: new Date(Date.now() - 45 * 60000).toISOString(), isHost: true },
      { userId: "user-2", name: "Alex R.", initials: "AR", avatarColor: "bg-emerald-600", joinedAt: new Date(Date.now() - 40 * 60000).toISOString(), isHost: false },
    ],
  },
  {
    id: "session-6",
    tableId: "table-6",
    restaurantId: "rest-001",
    startedAt: new Date(Date.now() - 20 * 60000).toISOString(),
    status: "active",
    users: [
      { userId: "user-3", name: "Sam K.", initials: "SK", avatarColor: "bg-violet-600", joinedAt: new Date(Date.now() - 20 * 60000).toISOString(), isHost: true },
    ],
  },
  {
    id: "session-8",
    tableId: "table-8",
    restaurantId: "rest-001",
    startedAt: new Date(Date.now() - 60 * 60000).toISOString(),
    status: "waiting",
    users: [
      { userId: "user-4", name: "Morgan L.", initials: "ML", avatarColor: "bg-amber-600", joinedAt: new Date(Date.now() - 60 * 60000).toISOString(), isHost: true },
      { userId: "user-5", name: "Casey T.", initials: "CT", avatarColor: "bg-sky-600", joinedAt: new Date(Date.now() - 55 * 60000).toISOString(), isHost: false },
      { userId: "user-6", name: "Riley P.", initials: "RP", avatarColor: "bg-rose-600", joinedAt: new Date(Date.now() - 50 * 60000).toISOString(), isHost: false },
    ],
  },
];

// ── Users ─────────────────────────────────────────────────────
export const mockUsers: User[] = [
  { id: "user-1", name: "Jamie Doe", initials: "JD", role: "registered", email: "jamie@example.com", avatarColor: "gradient-accent" },
  { id: "user-2", name: "Alex Rivera", initials: "AR", role: "registered", avatarColor: "bg-emerald-600" },
  { id: "user-3", name: "Sam Kim", initials: "SK", role: "guest", avatarColor: "bg-violet-600" },
  { id: "user-4", name: "Morgan Lee", initials: "ML", role: "registered", avatarColor: "bg-amber-600" },
  { id: "user-5", name: "Casey Torres", initials: "CT", role: "guest", avatarColor: "bg-sky-600" },
  { id: "user-6", name: "Riley Park", initials: "RP", role: "guest", avatarColor: "bg-rose-600" },
  { id: "staff-1", name: "Chef Marco", initials: "CM", role: "staff", avatarColor: "bg-card" },
  { id: "admin-1", name: "Owner", initials: "OW", role: "admin", email: "owner@grandkitchen.com", avatarColor: "bg-card" },
];

// ── Orders ────────────────────────────────────────────────────
export const mockOrders: Order[] = [
  {
    id: "ord-1847", sessionId: "session-2", tableId: "table-2", restaurantId: "rest-001",
    status: "confirmed",
    items: [
      { id: "oi-1", dishId: "1", name: "Smash Burger Deluxe", price: 18.50, quantity: 2, addedBy: "user-1", image: "" },
      { id: "oi-2", dishId: "2", name: "Truffle Spaghetti", price: 24.00, quantity: 1, addedBy: "user-2", image: "" },
      { id: "oi-3", dishId: "6", name: "Sunset Spritz", price: 13.00, quantity: 2, addedBy: "user-1", image: "" },
    ],
    subtotal: 87.00, serviceFee: 4.35, tip: 0, total: 91.35,
    createdAt: new Date(Date.now() - 30 * 60000).toISOString(),
    updatedAt: new Date(Date.now() - 25 * 60000).toISOString(),
  },
  {
    id: "ord-1846", sessionId: "session-8", tableId: "table-8", restaurantId: "rest-001",
    status: "preparing",
    items: [
      { id: "oi-4", dishId: "3", name: "Dragon Roll Platter", price: 22.00, quantity: 1, addedBy: "user-4", image: "" },
      { id: "oi-5", dishId: "19", name: "Grilled Ribeye", price: 36.00, quantity: 2, addedBy: "user-5", image: "" },
      { id: "oi-6", dishId: "5", name: "Molten Lava Cake", price: 14.00, quantity: 1, addedBy: "user-6", image: "" },
    ],
    subtotal: 108.00, serviceFee: 5.40, tip: 0, total: 113.40,
    createdAt: new Date(Date.now() - 50 * 60000).toISOString(),
    updatedAt: new Date(Date.now() - 40 * 60000).toISOString(),
  },
  {
    id: "ord-1845", sessionId: "session-6", tableId: "table-6", restaurantId: "rest-001",
    status: "pending",
    items: [
      { id: "oi-7", dishId: "20", name: "Miso Glazed Salmon", price: 27.00, quantity: 1, addedBy: "user-3", image: "" },
      { id: "oi-8", dishId: "32", name: "Truffle Fries", price: 10.00, quantity: 1, addedBy: "user-3", image: "" },
    ],
    subtotal: 37.00, serviceFee: 1.85, tip: 0, total: 38.85,
    createdAt: new Date(Date.now() - 5 * 60000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 60000).toISOString(),
  },
  {
    id: "ord-1844", sessionId: "session-2", tableId: "table-2", restaurantId: "rest-001",
    status: "served",
    items: [
      { id: "oi-9", dishId: "7", name: "Caesar Royale", price: 15.00, quantity: 1, addedBy: "user-1", image: "" },
      { id: "oi-10", dishId: "17", name: "Edamame & Sea Salt", price: 8.00, quantity: 1, addedBy: "user-2", image: "" },
    ],
    subtotal: 23.00, serviceFee: 1.15, tip: 3.50, total: 27.65,
    createdAt: new Date(Date.now() - 70 * 60000).toISOString(),
    updatedAt: new Date(Date.now() - 45 * 60000).toISOString(),
    paidAt: new Date(Date.now() - 10 * 60000).toISOString(),
  },
  {
    id: "ord-1843", sessionId: "session-old", tableId: "table-3", restaurantId: "rest-001",
    status: "paid",
    items: [
      { id: "oi-11", dishId: "4", name: "Margherita DOP", price: 16.00, quantity: 2, addedBy: "user-4", image: "" },
      { id: "oi-12", dishId: "10", name: "Smoky Old Fashioned", price: 15.00, quantity: 2, addedBy: "user-5", image: "" },
    ],
    subtotal: 62.00, serviceFee: 3.10, tip: 9.30, total: 74.40,
    createdAt: new Date(Date.now() - 120 * 60000).toISOString(),
    updatedAt: new Date(Date.now() - 90 * 60000).toISOString(),
    paidAt: new Date(Date.now() - 85 * 60000).toISOString(),
  },
];

// ── Payments ──────────────────────────────────────────────────
export const mockPayments: Payment[] = [
  { id: "pay-1", orderId: "ord-1844", userId: "user-1", amount: 13.83, method: "card", status: "completed", splitType: "equal", createdAt: new Date(Date.now() - 10 * 60000).toISOString() },
  { id: "pay-2", orderId: "ord-1844", userId: "user-2", amount: 13.82, method: "card", status: "completed", splitType: "equal", createdAt: new Date(Date.now() - 10 * 60000).toISOString() },
  { id: "pay-3", orderId: "ord-1843", userId: "user-4", amount: 37.20, method: "card", status: "completed", splitType: "equal", createdAt: new Date(Date.now() - 85 * 60000).toISOString() },
  { id: "pay-4", orderId: "ord-1843", userId: "user-5", amount: 37.20, method: "card", status: "completed", splitType: "equal", createdAt: new Date(Date.now() - 85 * 60000).toISOString() },
];

// ── Analytics Events ──────────────────────────────────────────
export const mockAnalyticsEvents: AnalyticsEvent[] = [
  { id: "evt-1", type: "qr_scanned", restaurantId: "rest-001", tableId: "table-2", timestamp: new Date(Date.now() - 45 * 60000).toISOString(), data: {} },
  { id: "evt-2", type: "dish_viewed", restaurantId: "rest-001", sessionId: "session-2", data: { dishId: "1", dishName: "Smash Burger Deluxe" }, timestamp: new Date(Date.now() - 43 * 60000).toISOString() },
  { id: "evt-3", type: "dish_added_to_cart", restaurantId: "rest-001", sessionId: "session-2", data: { dishId: "1" }, timestamp: new Date(Date.now() - 42 * 60000).toISOString() },
  { id: "evt-4", type: "order_placed", restaurantId: "rest-001", sessionId: "session-2", data: { orderId: "ord-1847", total: 91.35 }, timestamp: new Date(Date.now() - 30 * 60000).toISOString() },
  { id: "evt-5", type: "recommendation_accepted", restaurantId: "rest-001", sessionId: "session-6", data: { dishId: "20" }, timestamp: new Date(Date.now() - 18 * 60000).toISOString() },
  { id: "evt-6", type: "payment_completed", restaurantId: "rest-001", sessionId: "session-old", data: { orderId: "ord-1843", amount: 74.40 }, timestamp: new Date(Date.now() - 85 * 60000).toISOString() },
];

// ── Feedback ──────────────────────────────────────────────────
export const mockFeedback: Feedback[] = [
  { id: "fb-1", sessionId: "session-old", userId: "user-4", restaurantId: "rest-001", overallRating: 5, foodRating: 5, serviceRating: 4, comment: "Incredible food, will definitely come back!", wouldReturn: true, createdAt: new Date(Date.now() - 80 * 60000).toISOString() },
];
