import React, { createContext, useContext, useState, ReactNode } from "react";

interface AppUser {
  id: string;
  name: string;
  initials: string;
  isAppUser: boolean; // true = downloaded app; false = QR-only guest
}

interface AppUserContextType {
  user: AppUser;
  isAppUser: boolean;
  setAppUser: (isApp: boolean) => void;
}

const AppUserContext = createContext<AppUserContextType | undefined>(undefined);

export const AppUserProvider = ({ children }: { children: ReactNode }) => {
  const [isApp, setIsApp] = useState(false);

  const user: AppUser = {
    id: "user-1",
    name: "Jamie D.",
    initials: "JD",
    isAppUser: isApp,
  };

  return (
    <AppUserContext.Provider value={{ user, isAppUser: isApp, setAppUser: setIsApp }}>
      {children}
    </AppUserContext.Provider>
  );
};

export const useAppUser = () => {
  const ctx = useContext(AppUserContext);
  if (!ctx) throw new Error("useAppUser must be used within AppUserProvider");
  return ctx;
};
