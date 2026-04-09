import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import TwoFactorPage from "./pages/TwoFactorPage";
import ErpAppPage from "./pages/ErpAppPage";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/2fa" element={<TwoFactorPage />} />
          <Route path="/sales" element={<ProtectedRoute><ErpAppPage appId="sales" defaultPage="dashboard" /></ProtectedRoute>} />
          <Route path="/finance" element={<ProtectedRoute><ErpAppPage appId="finance" defaultPage="dashboard" /></ProtectedRoute>} />
          <Route path="/inventory" element={<ProtectedRoute><ErpAppPage appId="inventory" defaultPage="dashboard" /></ProtectedRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
