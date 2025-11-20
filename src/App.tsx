import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { Layout } from "./components/Layout";
import ProtectedAdminRoute from "./components/ProtectedAdminRoute";
import { SubscriptionNotifications } from "./components/SubscriptionNotifications";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Workouts from "./pages/Workouts";
import Progress from "./pages/Progress";
import FoodScanner from "./pages/FoodScanner";
import Community from "./pages/Community";
import Premium from "./pages/Premium";
import Admin from "./pages/Admin";
import AdminLogin from "./pages/AdminLogin";
import ClientLogin from "./pages/ClientLogin";
import Checkout from "./pages/Checkout";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";
import Challenges from "./pages/Challenges";

const queryClient = new QueryClient();

const ConditionalNotifications = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  
  if (isAdminRoute) {
    return null;
  }
  
  return <SubscriptionNotifications />;
};

const AppContent = () => {
  return (
    <>
      <ConditionalNotifications />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/client-login" element={<ClientLogin />} />
        <Route path="/checkout" element={<Checkout />} />
        {/* Admin fora do Layout para ser um painel separado */}
        <Route path="/admin" element={<ProtectedAdminRoute><Admin /></ProtectedAdminRoute>} />
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/treinos" element={<Workouts />} />
          <Route path="/progresso" element={<Progress />} />
          <Route path="/scanner" element={<FoodScanner />} />
          <Route path="/comunidade" element={<Community />} />
          <Route path="/desafios" element={<Challenges />} />
          <Route path="/perfil" element={<Profile />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
