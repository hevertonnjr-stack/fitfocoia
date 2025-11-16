import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { Layout } from "./components/Layout";
import { useSetupAdmin } from "./hooks/useSetupAdmin";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Workouts from "./pages/Workouts";
import Progress from "./pages/Progress";
import Exercises from "./pages/Exercises";
import Community from "./pages/Community";
import Premium from "./pages/Premium";
import Admin from "./pages/Admin";
import AdminLogin from "./pages/AdminLogin";
import ClientLogin from "./pages/ClientLogin";
import Checkout from "./pages/Checkout";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppContent = () => {
  useSetupAdmin();
  
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/admin-login" element={<AdminLogin />} />
      <Route path="/client-login" element={<ClientLogin />} />
      <Route path="/checkout" element={<Checkout />} />
      {/* Admin fora do Layout para ser um painel separado */}
      <Route path="/admin" element={<Admin />} />
      <Route element={<Layout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/treinos" element={<Workouts />} />
        <Route path="/progresso" element={<Progress />} />
        <Route path="/exercicios" element={<Exercises />} />
        <Route path="/comunidade" element={<Community />} />
        <Route path="/premium" element={<Premium />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
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
