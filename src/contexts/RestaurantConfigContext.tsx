import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";

export type PaymentModel = "pay-now" | "pay-later";

export interface RestaurantConfig {
  paymentModel: PaymentModel;
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
}

const RestaurantConfigContext = createContext<RestaurantConfigContextType | undefined>(undefined);

export const RestaurantConfigProvider = ({ children }: { children: ReactNode }) => {
  const [config, setConfig] = useState<RestaurantConfig>(loadConfig);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  }, [config]);

  const updateConfig = useCallback((patch: Partial<RestaurantConfig>) => {
    setConfig((prev) => ({ ...prev, ...patch }));
  }, []);

  return (
    <RestaurantConfigContext.Provider value={{ config, updateConfig }}>
      {children}
    </RestaurantConfigContext.Provider>
  );
};

export const useRestaurantConfig = () => {
  const ctx = useContext(RestaurantConfigContext);
  if (!ctx) throw new Error("useRestaurantConfig must be used within RestaurantConfigProvider");
  return ctx;
};
