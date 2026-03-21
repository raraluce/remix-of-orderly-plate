import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface UserPreferencesContextType {
  allergens: string[];
  dietary: string[];
  toggleAllergen: (a: string) => void;
  toggleDietary: (d: string) => void;
  /** Lowercase allergen names for matching against dish data */
  allergenKeys: string[];
  loading: boolean;
  saving: boolean;
}

const UserPreferencesContext = createContext<UserPreferencesContextType | undefined>(undefined);

export const UserPreferencesProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [allergens, setAllergens] = useState<string[]>([]);
  const [dietary, setDietary] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Load preferences from Supabase when user changes
  useEffect(() => {
    if (!user) {
      setAllergens([]);
      setDietary([]);
      return;
    }

    const load = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("user_dietary_preferences")
        .select("allergen_id, diet_type, allergens(name)")
        .eq("user_id", user.id);

      if (error) {
        console.error("Failed to load dietary preferences:", error);
        setLoading(false);
        return;
      }

      const loadedAllergens: string[] = [];
      const loadedDietary: string[] = [];

      (data ?? []).forEach((row: any) => {
        if (row.diet_type) {
          loadedDietary.push(row.diet_type);
        }
        if (row.allergens?.name) {
          loadedAllergens.push(row.allergens.name);
        }
      });

      setAllergens(loadedAllergens);
      setDietary(loadedDietary);
      setLoading(false);
    };

    load();
  }, [user]);

  // Persist a preference change to Supabase
  const persistPreferences = useCallback(
    async (newAllergens: string[], newDietary: string[]) => {
      if (!user) return;
      setSaving(true);

      // Delete existing preferences
      await supabase
        .from("user_dietary_preferences")
        .delete()
        .eq("user_id", user.id);

      const rows: any[] = [];

      // Look up allergen IDs for selected names
      if (newAllergens.length > 0) {
        const { data: allergenRows } = await supabase
          .from("allergens")
          .select("id, name")
          .in("name", newAllergens);

        (allergenRows ?? []).forEach((a) => {
          rows.push({
            user_id: user.id,
            allergen_id: a.id,
            diet_type: null,
            severity: "allergy" as const,
            consent_given: true,
          });
        });
      }

      newDietary.forEach((d) => {
        rows.push({
          user_id: user.id,
          allergen_id: null,
          diet_type: d,
          severity: "preference" as const,
          consent_given: true,
        });
      });

      if (rows.length > 0) {
        const { error } = await supabase
          .from("user_dietary_preferences")
          .insert(rows);
        if (error) console.error("Failed to save dietary preferences:", error);
      }

      setSaving(false);
    },
    [user]
  );

  const toggleAllergen = useCallback(
    (a: string) => {
      setAllergens((prev) => {
        const next = prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a];
        persistPreferences(next, dietary);
        return next;
      });
    },
    [dietary, persistPreferences]
  );

  const toggleDietary = useCallback(
    (d: string) => {
      setDietary((prev) => {
        const next = prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d];
        persistPreferences(allergens, next);
        return next;
      });
    },
    [allergens, persistPreferences]
  );

  const allergenKeys = allergens.map((a) => a.toLowerCase());

  return (
    <UserPreferencesContext.Provider
      value={{ allergens, dietary, toggleAllergen, toggleDietary, allergenKeys, loading, saving }}
    >
      {children}
    </UserPreferencesContext.Provider>
  );
};

export const useUserPreferences = () => {
  const ctx = useContext(UserPreferencesContext);
  if (!ctx) throw new Error("useUserPreferences must be used within UserPreferencesProvider");
  return ctx;
};
