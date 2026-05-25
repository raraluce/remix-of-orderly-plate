import { useQuery } from "@tanstack/react-query";
import { menuService, type DishWithDetails } from "@/services/menuService";
import { supabase } from "@/integrations/supabase/client";

export interface MenuCategory {
  id: string;
  name: string;
  description: string | null;
  sort_order: number;
  image_url: string | null;
}

export function useMenuCategories(restaurantId: string | undefined) {
  return useQuery({
    queryKey: ["menu-categories", restaurantId],
    queryFn: () => menuService.getCategories(restaurantId!),
    enabled: !!restaurantId,
  });
}

export function useMenuDishes(restaurantId: string | undefined) {
  return useQuery({
    queryKey: ["menu-dishes", restaurantId],
    queryFn: () => menuService.getDishes(restaurantId!),
    enabled: !!restaurantId,
  });
}

export function useAllergens() {
  return useQuery({
    queryKey: ["allergens"],
    queryFn: () => menuService.getAllergens(),
  });
}

export function useDefaultRestaurant(enabled: boolean) {
  return useQuery({
    queryKey: ["default-restaurant"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("restaurants").select("*").eq("status", "active").limit(1).single();
      if (error) throw error;
      return data;
    },
    enabled,
  });
}

export function useRestaurantById(id: string | null) {
  return useQuery({
    queryKey: ["restaurant", id],
    queryFn: async () => {
      const { data, error } = await supabase.from("restaurants").select("*").eq("id", id!).single();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });
}

export { type DishWithDetails };
