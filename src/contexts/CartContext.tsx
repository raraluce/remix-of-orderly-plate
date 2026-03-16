import React, { createContext, useContext, useState, ReactNode } from "react";
import type { PairingTag, FoodPreference } from "@/data/menuData";

export interface CartCustomisations {
  removedIngredients: string[];
  addedExtras: string[];
  cookingPoint: string | null;
  priceAdjustment: number;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  /** Metadata for analytics / recommendation engine */
  pairingTags?: PairingTag[];
  category?: string;
  type?: string;
  preference?: FoodPreference[];
  customisations?: CartCustomisations;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  updateCustomisations: (id: string, customisations: CartCustomisations) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = (item: Omit<CartItem, "quantity">) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
    // Fire analytics with pairing metadata for recommendation relations
    try {
      const { analyticsService } = require("@/services/analyticsService");
      analyticsService.track("dish_added_to_cart", {
        dishId: item.id,
        dishName: item.name,
        category: item.category,
        type: item.type,
        preference: item.preference,
        pairingTags: item.pairingTags,
      });
    } catch {}
  };

  const removeItem = (id: string) => setItems((prev) => prev.filter((i) => i.id !== id));

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) return removeItem(id);
    setItems((prev) => prev.map((i) => i.id === id ? { ...i, quantity } : i));
  };

  const updateCustomisations = (id: string, customisations: CartCustomisations) => {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, customisations } : i))
    );
  };

  const clearCart = () => setItems([]);

  const total = items.reduce(
    (sum, i) => sum + (i.price + (i.customisations?.priceAdjustment ?? 0)) * i.quantity,
    0
  );
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, total, itemCount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};
