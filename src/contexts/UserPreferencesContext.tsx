import React, { createContext, useContext, useState, ReactNode } from "react";
import type { Allergen } from "@/data/menuData";

interface UserPreferencesContextType {
  allergens: string[];
  dietary: string[];
  toggleAllergen: (a: string) => void;
  toggleDietary: (d: string) => void;
  /** Returns the Allergen[] mapped from user-friendly labels to data keys */
  allergenKeys: Allergen[];
}

const allergenLabelToKey: Record<string, Allergen> = {
  Gluten: "gluten",
  Dairy: "dairy",
  Nuts: "nuts",
  Shellfish: "seafood",
  Eggs: "eggs",
  Soy: "soy",
  Fish: "seafood",
  Sesame: "sesame",
};

const UserPreferencesContext = createContext<UserPreferencesContextType | undefined>(undefined);

export const UserPreferencesProvider = ({ children }: { children: ReactNode }) => {
  const [allergens, setAllergens] = useState<string[]>(["Nuts", "Shellfish"]);
  const [dietary, setDietary] = useState<string[]>(["Pescatarian"]);

  const toggleAllergen = (a: string) =>
    setAllergens((prev) => (prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]));

  const toggleDietary = (d: string) =>
    setDietary((prev) => (prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]));

  const allergenKeys: Allergen[] = [...new Set(allergens.map((a) => allergenLabelToKey[a]).filter(Boolean))];

  return (
    <UserPreferencesContext.Provider value={{ allergens, dietary, toggleAllergen, toggleDietary, allergenKeys }}>
      {children}
    </UserPreferencesContext.Provider>
  );
};

export const useUserPreferences = () => {
  const ctx = useContext(UserPreferencesContext);
  if (!ctx) throw new Error("useUserPreferences must be used within UserPreferencesProvider");
  return ctx;
};
