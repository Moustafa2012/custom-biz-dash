import { QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { AppConfigProvider } from "@/components/erp/app-config";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { useAuthStore } from "@/stores/auth-store";
import { useEffect } from "react";
import { queryClient } from "@/lib/api/queryClient";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import TwoFactorPage from "./pages/TwoFactorPage";
import ErpAppPage from "./pages/ErpAppPage";
import NotFound from "./pages/NotFound.tsx";

const App = () => {
  return (
    <ErrorBoundary>
      <AppConfigProvider>
        <AppContent />
      </AppConfigProvider>
    </ErrorBoundary>
  );
};

const AuthInitializer = () => {
  const initializeAuth = useAuthStore((s) => s.initializeAuth);
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);
  return null;
};

const AppContent = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthInitializer />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/2fa" element={<TwoFactorPage />} />

            {/* Module routes — each guarded by its `<module>.view` permission. */}
            <Route
              path="/sales"
              element={
                <ProtectedRoute requiredPermission="sales.view">
                  <ErpAppPage appId="sales" defaultPage="dashboard" />
                </ProtectedRoute>
              }
            />
            <Route
              path="/finance"
              element={
                <ProtectedRoute requiredPermission="finance.view">
                  <ErpAppPage appId="finance" defaultPage="dashboard" />
                </ProtectedRoute>
              }
            />
            <Route
              path="/inventory"
              element={
                <ProtectedRoute requiredPermission="inventory.view">
                  <ErpAppPage appId="inventory" defaultPage="dashboard" />
                </ProtectedRoute>
              }
            />
            <Route
              path="/banking"
              element={
                <ProtectedRoute requiredPermission="banking.view">
                  <ErpAppPage appId="banking" defaultPage="dashboard" />
                </ProtectedRoute>
              }
            />
            <Route
              path="/warehouse"
              element={
                <ProtectedRoute requiredPermission="warehouse.view">
                  <ErpAppPage appId="warehouse" defaultPage="dashboard" />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
