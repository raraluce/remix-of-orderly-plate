import { useQuery } from "@tanstack/react-query";
import { menuService, type DishWithDetails } from "@/services/menuService";

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

export { type DishWithDetails };
