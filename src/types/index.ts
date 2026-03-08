// ═══════════════════════════════════════════════════════════════
// .bite — Core Type Definitions
// ═══════════════════════════════════════════════════════════════

export type UserRole = "guest" | "registered" | "staff" | "manager" | "admin";

export interface User {
  id: string;
  name: string;
  initials: string;
  role: UserRole;
  email?: string;
  avatarColor: string;
  dietaryProfileId?: string;
}

export interface Restaurant {
  id: string;
  name: string;
  slug: string;
  description: string;
  logo?: string;
  coverImage?: string;
  address: string;
  phone: string;
  hours: { day: string; open: string; close: string }[];
  currency: string;
  serviceFeePercent: number;
  brandColor: string;
}

export interface Table {
  id: string;
  restaurantId: string;
  number: number;
  label: string;
  capacity: number;
  status: "available" | "occupied" | "reserved" | "cleaning";
  qrCode: string;
  currentSessionId?: string;
}

export interface QRSession {
  id: string;
  tableId: string;
  restaurantId: string;
  startedAt: string;
  endedAt?: string;
  status: "active" | "ordering" | "waiting" | "paid" | "closed";
  users: SessionUser[];
}

export interface SessionUser {
  userId: string;
  name: string;
  initials: string;
  avatarColor: string;
  joinedAt: string;
  isHost: boolean;
}

export interface DietaryProfile {
  id: string;
  userId: string;
  allergens: string[];
  dietary: string[];
  spicePreference?: "mild" | "medium" | "hot" | "extra-hot";
  budgetRange?: "low" | "medium" | "high";
  savedAt?: string;
}

export type OrderStatus = "pending" | "confirmed" | "preparing" | "ready" | "served" | "paid" | "cancelled";

export interface Order {
  id: string;
  sessionId: string;
  tableId: string;
  restaurantId: string;
  status: OrderStatus;
  items: OrderItem[];
  subtotal: number;
  serviceFee: number;
  tip: number;
  total: number;
  createdAt: string;
  updatedAt: string;
  paidAt?: string;
  paidBy?: string[];
}

export interface OrderItem {
  id: string;
  dishId: string;
  name: string;
  price: number;
  quantity: number;
  notes?: string;
  addedBy: string;
  image: string;
}

export interface Payment {
  id: string;
  orderId: string;
  userId: string;
  amount: number;
  method: "card" | "cash" | "wallet";
  status: "pending" | "completed" | "failed";
  splitType: "full" | "equal" | "by-dish";
  createdAt: string;
}

export type AnalyticsEventType =
  | "qr_scanned"
  | "dish_viewed"
  | "filter_used"
  | "dish_added_to_cart"
  | "dish_removed_from_cart"
  | "order_placed"
  | "payment_completed"
  | "recommendation_viewed"
  | "recommendation_accepted"
  | "session_started"
  | "session_ended"
  | "search_performed"
  | "feedback_submitted";

export interface AnalyticsEvent {
  id: string;
  type: AnalyticsEventType;
  restaurantId: string;
  sessionId?: string;
  tableId?: string;
  userId?: string;
  data: Record<string, any>;
  timestamp: string;
}

export interface Feedback {
  id: string;
  sessionId: string;
  userId: string;
  restaurantId: string;
  overallRating: number;
  foodRating?: number;
  serviceRating?: number;
  comment?: string;
  wouldReturn: boolean;
  createdAt: string;
}
