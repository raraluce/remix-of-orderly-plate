import { supabase } from "@/integrations/supabase/client";

export interface DishWithDetails {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  calories: number | null;
  prep_time_mins: number | null;
  is_featured: boolean;
  is_shareable: boolean;
  category_id: string | null;
  sort_order: number;
  allergens: { allergen_id: string; type: string; allergen: { id: string; name: string; icon: string | null } }[];
  diet_tags: { diet_type: string }[];
}

export const menuService = {
  /** Get all menu categories for a restaurant */
  async getCategories(restaurantId: string) {
    const { data, error } = await supabase
      .from("menu_categories")
      .select("*")
      .eq("restaurant_id", restaurantId)
      .eq("is_active", true)
      .order("sort_order");

    if (error) throw error;
    return data ?? [];
  },

  /** Get dishes for a restaurant with allergen and diet info */
  async getDishes(restaurantId: string) {
    const { data, error } = await supabase
      .from("dishes")
      .select(`
        *,
        dish_allergens(allergen_id, type, allergens(id, name, icon)),
        dish_diet_tags(diet_type)
      `)
      .eq("restaurant_id", restaurantId)
      .eq("is_available", true)
      .order("sort_order");

    if (error) throw error;
    return (data ?? []) as unknown as DishWithDetails[];
  },

  /** Get all allergens */
  async getAllergens() {
    const { data, error } = await supabase
      .from("allergens")
      .select("*")
      .order("sort_order");

    if (error) throw error;
    return data ?? [];
  },

  /** Get user's dietary preferences */
  async getUserDietaryPreferences(userId: string) {
    const { data, error } = await supabase
      .from("user_dietary_preferences")
      .select("*, allergens(id, name, icon)")
      .eq("user_id", userId);

    if (error) throw error;
    return data ?? [];
  },

  /** Save user dietary preferences (upsert) */
  async saveUserDietaryPreferences(
    userId: string,
    allergenIds: string[],
    dietTypes: string[],
    severity: "preference" | "intolerance" | "allergy" = "allergy"
  ) {
    // Delete existing
    await supabase
      .from("user_dietary_preferences")
      .delete()
      .eq("user_id", userId);

    const rows = [
      ...allergenIds.map((aid) => ({
        user_id: userId,
        allergen_id: aid,
        severity,
        consent_given: true,
      })),
      ...dietTypes.map((dt) => ({
        user_id: userId,
        diet_type: dt,
        severity,
        consent_given: true,
      })),
    ];

    if (rows.length > 0) {
      const { error } = await supabase
        .from("user_dietary_preferences")
        .insert(rows);
      if (error) throw error;
    }
  },

  /** Filter dishes by user allergen exclusions */
  filterByAllergens(dishes: DishWithDetails[], excludeAllergenIds: string[]) {
    if (excludeAllergenIds.length === 0) return dishes;
    return dishes.filter(
      (dish) =>
        !dish.allergens.some((da) => excludeAllergenIds.includes(da.allergen_id))
    );
  },

  /** Get restaurant details */
  async getRestaurant(restaurantId: string) {
    const { data, error } = await supabase
      .from("restaurants")
      .select("*")
      .eq("id", restaurantId)
      .single();

    if (error) throw error;
    return data;
  },

  /** Get restaurant by slug */
  async getRestaurantBySlug(slug: string) {
    const { data, error } = await supabase
      .from("restaurants")
      .select("*")
      .eq("slug", slug)
      .single();

    if (error) throw error;
    return data;
  },
};
