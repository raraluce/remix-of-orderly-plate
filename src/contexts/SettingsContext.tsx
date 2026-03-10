import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";

/* ── Types ── */
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

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, resetSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used within SettingsProvider");
  return ctx;
};
