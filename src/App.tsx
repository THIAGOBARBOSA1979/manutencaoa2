
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
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppLayout><Index /></AppLayout>} />
          <Route path="/properties" element={<AppLayout><Properties /></AppLayout>} />
          <Route path="/inspections" element={<AppLayout><Inspections /></AppLayout>} />
          <Route path="/warranty" element={<AppLayout><Warranty /></AppLayout>} />
          {/* Placeholder routes for future implementation */}
          <Route path="/calendar" element={<AppLayout><div className="p-8 text-center">Página de Calendário em desenvolvimento</div></AppLayout>} />
          <Route path="/users" element={<AppLayout><div className="p-8 text-center">Página de Usuários em desenvolvimento</div></AppLayout>} />
          <Route path="/settings" element={<AppLayout><div className="p-8 text-center">Página de Configurações em desenvolvimento</div></AppLayout>} />
          {/* Catch-all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
