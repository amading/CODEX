import { BrowserRouter, Routes, Route } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/context/ThemeContext";
import { AppLayout } from "@/components/layout/AppLayout";
import { HomePage } from "@/pages/HomePage";
import { ProductsPage } from "@/pages/ProductsPage";
import { OrdersPage } from "@/pages/OrdersPage";
import { ReportsPage } from "@/pages/ReportsPage";
import { InventoryPage } from "@/pages/InventoryPage";
import { CustomersPage } from "@/pages/CustomersPage";
import { EmployeesPage } from "@/pages/EmployeesPage";
import { MobileQRPage } from "@/pages/MobileQRPage";
import { SettingsPage } from "@/pages/SettingsPage";

function App() {
  return (
    <ThemeProvider>
      <TooltipProvider delay={300}>
        <BrowserRouter>
          <Routes>
            <Route element={<AppLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/orders" element={<OrdersPage />} />
              <Route path="/reports" element={<ReportsPage />} />
              <Route path="/inventory" element={<InventoryPage />} />
              <Route path="/customers" element={<CustomersPage />} />
              <Route path="/employees" element={<EmployeesPage />} />
              <Route path="/mobile-qr" element={<MobileQRPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  );
}

export default App;
