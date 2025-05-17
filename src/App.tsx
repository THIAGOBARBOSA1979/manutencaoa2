
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { AppLayout } from "./components/Layout/AppLayout";
import Index from "./pages/Index";
import Properties from "./pages/Properties";
import Inspections from "./pages/Inspections";
import Warranty from "./pages/Warranty";
import Calendar from "./pages/Calendar";
import Users from "./pages/Users";
import ClientArea from "./pages/ClientArea";
import ClientLayout from "./components/Layout/ClientLayout";
import ClientDashboard from "./pages/client/Dashboard";
import ClientInspections from "./pages/client/Inspections";
import ClientWarranty from "./pages/client/Warranty";
import ClientProperties from "./pages/client/Properties";
import NotFound from "./pages/NotFound";
import Settings from "./pages/Settings";

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Admin Routes */}
          <Route path="/" element={<AppLayout><Index /></AppLayout>} />
          <Route path="/properties" element={<AppLayout><Properties /></AppLayout>} />
          <Route path="/inspections" element={<AppLayout><Inspections /></AppLayout>} />
          <Route path="/warranty" element={<AppLayout><Warranty /></AppLayout>} />
          <Route path="/calendar" element={<AppLayout><Calendar /></AppLayout>} />
          <Route path="/users" element={<AppLayout><Users /></AppLayout>} />
          <Route path="/client-area" element={<AppLayout><ClientArea /></AppLayout>} />
          <Route path="/settings" element={<AppLayout><div className="p-8 text-center">Página de Configurações em desenvolvimento</div></AppLayout>} />
          
          {/* Client Area Routes */}
          <Route path="/client" element={<ClientLayout />}>
            <Route index element={<ClientDashboard />} />
            <Route path="inspections" element={<ClientInspections />} />
            <Route path="warranty" element={<ClientWarranty />} />
            <Route path="properties" element={<ClientProperties />} />
          </Route>
          
          {/* Catch-all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
