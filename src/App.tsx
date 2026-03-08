import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
import { UserPreferencesProvider } from "@/contexts/UserPreferencesContext";
import { TableSessionProvider } from "@/contexts/TableSessionContext";
import { AppUserProvider } from "@/contexts/AppUserContext";
import Index from "./pages/Index";
import Menu from "./pages/Menu";
import QREntry from "./pages/QREntry";
import TableView from "./pages/TableView";
import OrderStatus from "./pages/OrderStatus";
import Payment from "./pages/Payment";
import OrderConfirmation from "./pages/OrderConfirmation";
import Feedback from "./pages/Feedback";
import DinerProfile from "./pages/DinerProfile";
import SmartMenu from "./pages/SmartMenu";
import Explore from "./pages/Explore";
import MapView from "./pages/MapView";
import RestaurantView from "./pages/RestaurantView";
import SmartExplore from "./pages/SmartExplore";
import Register from "./pages/Register";
import Login from "./pages/Login";
import RestaurantLayout from "./pages/restaurant/RestaurantLayout";
import DashboardHome from "./pages/restaurant/DashboardHome";
import OrdersManagement from "./pages/restaurant/OrdersManagement";
import MenuManagement from "./pages/MenuManagement";
import TablesQR from "./pages/restaurant/TablesQR";
import PaymentsView from "./pages/restaurant/PaymentsView";
import AnalyticsDashboard from "./pages/restaurant/AnalyticsDashboard";
import RestaurantSettings from "./pages/restaurant/RestaurantSettings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AppUserProvider>
        <UserPreferencesProvider>
          <TableSessionProvider>
            <CartProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Routes>
                  {/* Landing */}
                  <Route path="/" element={<Index />} />

                  {/* Registration */}
                  <Route path="/register" element={<Register />} />

                  {/* App User Flow (registered/downloaded app) */}
                  <Route path="/explore" element={<Explore />} />
                  <Route path="/smart-explore" element={<SmartExplore />} />
                  <Route path="/map" element={<MapView />} />
                  <Route path="/restaurant-view/:id" element={<RestaurantView />} />

                  {/* Customer Flow (QR-only or app) */}
                  <Route path="/qr" element={<QREntry />} />
                  <Route path="/menu" element={<Menu />} />
                  <Route path="/smart-menu" element={<SmartMenu />} />
                  <Route path="/table" element={<TableView />} />
                  <Route path="/order-status" element={<OrderStatus />} />
                  <Route path="/payment" element={<Payment />} />
                  <Route path="/order-confirmation" element={<OrderConfirmation />} />
                  <Route path="/feedback" element={<Feedback />} />
                  <Route path="/profile" element={<DinerProfile />} />

                  {/* Restaurant Dashboard */}
                  <Route path="/restaurant" element={<RestaurantLayout />}>
                    <Route index element={<DashboardHome />} />
                    <Route path="orders" element={<OrdersManagement />} />
                    <Route path="menu" element={<MenuManagement />} />
                    <Route path="tables" element={<TablesQR />} />
                    <Route path="payments" element={<PaymentsView />} />
                    <Route path="analytics" element={<AnalyticsDashboard />} />
                    <Route path="settings" element={<RestaurantSettings />} />
                  </Route>

                  {/* Legacy redirect */}
                  <Route path="/dashboard" element={<RestaurantLayout />}>
                    <Route index element={<DashboardHome />} />
                  </Route>

                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </CartProvider>
          </TableSessionProvider>
        </UserPreferencesProvider>
      </AppUserProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
