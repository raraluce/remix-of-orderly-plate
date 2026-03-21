import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export type PaymentModel = "pay-now" | "pay-later";

export interface RestaurantConfig {
  paymentModel: PaymentModel;
}

export interface RestaurantInfo {
  id: string;
  name: string;
  slug: string;
  currency: string;
  logo_url: string | null;
  cover_url: string | null;
  status: string;
}

const DEFAULT_CONFIG: RestaurantConfig = {
  paymentModel: "pay-now",
};

const STORAGE_KEY = "bite-restaurant-config";

function loadConfig(): RestaurantConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...DEFAULT_CONFIG, ...JSON.parse(raw) };
  } catch {}
  return DEFAULT_CONFIG;
}

interface RestaurantConfigContextType {
  config: RestaurantConfig;
  updateConfig: (patch: Partial<RestaurantConfig>) => void;
  restaurant: RestaurantInfo | null;
  restaurantId: string | null;
  memberRole: string | null;
  loading: boolean;
  noRestaurant: boolean;
}

const RestaurantConfigContext = createContext<RestaurantConfigContextType | undefined>(undefined);

export const RestaurantConfigProvider = ({ children }: { children: ReactNode }) => {
  const { user, loading: authLoading } = useAuth();
  const [config, setConfig] = useState<RestaurantConfig>(loadConfig);
  const [restaurant, setRestaurant] = useState<RestaurantInfo | null>(null);
  const [memberRole, setMemberRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [noRestaurant, setNoRestaurant] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  }, [config]);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      setRestaurant(null);
      setMemberRole(null);
      setNoRestaurant(false);
      setLoading(false);
      return;
    }

    const fetchRestaurant = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("restaurant_members")
        .select("role, restaurant_id, restaurants(id, name, slug, currency, logo_url, cover_url, status)")
        .eq("user_id", user.id)
        .limit(1)
        .maybeSingle();

      if (error || !data) {
        setRestaurant(null);
        setMemberRole(null);
        setNoRestaurant(!error);
        setLoading(false);
        return;
      }

      const r = data.restaurants as unknown as RestaurantInfo;
      setRestaurant(r);
      setMemberRole(data.role);
      setNoRestaurant(false);
      setLoading(false);
    };

    fetchRestaurant();
  }, [user, authLoading]);

  const updateConfig = useCallback((patch: Partial<RestaurantConfig>) => {
    setConfig((prev) => ({ ...prev, ...patch }));
  }, []);

  return (
    <RestaurantConfigContext.Provider value={{ config, updateConfig, restaurant, restaurantId: restaurant?.id ?? null, memberRole, loading, noRestaurant }}>
      {children}
    </RestaurantConfigContext.Provider>
  );
};

export const useRestaurantConfig = () => {
  const ctx = useContext(RestaurantConfigContext);
  if (!ctx) throw new Error("useRestaurantConfig must be used within RestaurantConfigProvider");
  return ctx;
};
