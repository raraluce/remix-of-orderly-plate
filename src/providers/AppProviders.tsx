import { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import { UserPreferencesProvider } from "@/contexts/UserPreferencesContext";
import { TableSessionProvider } from "@/contexts/TableSessionContext";
import { SettingsProvider } from "@/contexts/SettingsContext";
import { RestaurantConfigProvider } from "@/contexts/RestaurantConfigContext";

const queryClient = new QueryClient();

interface AppProvidersProps {
  children: ReactNode;
}

const AppProviders = ({ children }: AppProvidersProps) => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <AuthProvider>
          <RestaurantConfigProvider>
            <SettingsProvider>
              <UserPreferencesProvider>
                <TableSessionProvider>
                  <CartProvider>
                    {children}
                  </CartProvider>
                </TableSessionProvider>
              </UserPreferencesProvider>
            </SettingsProvider>
          </RestaurantConfigProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default AppProviders;
