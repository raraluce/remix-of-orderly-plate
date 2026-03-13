import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";

/* ── Types ── */
export interface PaymentMethod {
  id: string;
  type: "visa" | "mastercard" | "amex";
  last4: string;
  expiry: string;
  isDefault: boolean;
}

export interface UserSettings {
  // Account
  name: string;
  email: string;
  phone: string;

  // Notifications
  pushOrders: boolean;
  pushPromos: boolean;
  pushReservations: boolean;
  emailDigest: boolean;

  // Privacy
  locationSharing: boolean;
  orderHistory: boolean;
  personalizedAds: boolean;

  // Appearance
  darkMode: boolean;

  // Language
  language: string;

  // Payment
  paymentMethods: PaymentMethod[];
}

const DEFAULT_SETTINGS: UserSettings = {
  name: "Jamie Doe",
  email: "jamie@bite.app",
  phone: "+1 555 012 3456",
  pushOrders: true,
  pushPromos: true,
  pushReservations: true,
  emailDigest: false,
  locationSharing: true,
  orderHistory: true,
  personalizedAds: false,
  darkMode: true,
  language: "en",
  paymentMethods: [
    { id: "pm_1", type: "visa", last4: "4242", expiry: "08/27", isDefault: true },
    { id: "pm_2", type: "mastercard", last4: "8371", expiry: "03/26", isDefault: false },
  ],
};

const STORAGE_KEY = "bite-settings";

function loadSettings(): UserSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    // ignore
  }
  return DEFAULT_SETTINGS;
}

interface SettingsContextType {
  settings: UserSettings;
  updateSettings: (patch: Partial<UserSettings>) => void;
  resetSettings: () => void;
  addPaymentMethod: (method: Omit<PaymentMethod, "id">) => void;
  removePaymentMethod: (id: string) => void;
  setDefaultPaymentMethod: (id: string) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState<UserSettings>(loadSettings);

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  // Apply theme class
  useEffect(() => {
    const root = document.documentElement;
    if (settings.darkMode) {
      root.classList.remove("light");
    } else {
      root.classList.add("light");
    }
  }, [settings.darkMode]);

  const updateSettings = useCallback((patch: Partial<UserSettings>) => {
    setSettings((prev) => ({ ...prev, ...patch }));
  }, []);

  const resetSettings = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setSettings(DEFAULT_SETTINGS);
  }, []);

  const addPaymentMethod = useCallback((method: Omit<PaymentMethod, "id">) => {
    setSettings((prev) => {
      const newMethod: PaymentMethod = { ...method, id: `pm_${Date.now()}` };
      let methods = [...prev.paymentMethods, newMethod];
      if (newMethod.isDefault) {
        methods = methods.map((m) => ({ ...m, isDefault: m.id === newMethod.id }));
      }
      return { ...prev, paymentMethods: methods };
    });
  }, []);

  const removePaymentMethod = useCallback((id: string) => {
    setSettings((prev) => {
      const filtered = prev.paymentMethods.filter((m) => m.id !== id);
      // If we removed the default, make the first one default
      if (filtered.length > 0 && !filtered.some((m) => m.isDefault)) {
        filtered[0].isDefault = true;
      }
      return { ...prev, paymentMethods: filtered };
    });
  }, []);

  const setDefaultPaymentMethod = useCallback((id: string) => {
    setSettings((prev) => ({
      ...prev,
      paymentMethods: prev.paymentMethods.map((m) => ({ ...m, isDefault: m.id === id })),
    }));
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, resetSettings, addPaymentMethod, removePaymentMethod, setDefaultPaymentMethod }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used within SettingsProvider");
  return ctx;
};
