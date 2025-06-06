
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { StrictMode, useState, useEffect } from "react";

import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";

// Public pages
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";

// Admin pages and layout
import { AppLayout } from "./components/Layout/AppLayout";
import AdminDocuments from "./pages/admin/Documents";
import Index from "./pages/Index";
import Properties from "./pages/Properties";
import Inspections from "./pages/Inspections";
import Warranty from "./pages/Warranty";
import Calendar from "./pages/Calendar";
import Users from "./pages/Users";
import ClientArea from "./pages/ClientArea";
import Checklist from "./pages/Checklist";
import Settings from "./pages/Settings";

// Client pages and layout
import ClientLayout from "./components/Layout/ClientLayout";
import ClientDashboard from "./pages/client/Dashboard";
import ClientDocuments from "./pages/client/Documents";
import ClientInspections from "./pages/client/Inspections";
import ClientWarranty from "./pages/client/Warranty";
import ClientProperties from "./pages/client/Properties";

const App = () => {
  console.log('App: Inicializando componente App...');

  // Move the QueryClient initialization inside the component
  const [queryClient] = useState(() => {
    console.log('App: Criando QueryClient...');
    return new QueryClient({
      defaultOptions: {
        queries: {
          refetchOnWindowFocus: false,
          retry: 1,
        },
      },
    });
  });

  useEffect(() => {
    console.log('App: Componente App montado');
    console.log('App: Ambiente:', import.meta.env.MODE);
    console.log('App: VITE_API_URL:', import.meta.env.VITE_API_URL || 'não configurado');
  }, []);

  console.log('App: Renderizando componente App...');

  return (
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AuthProvider>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                
                {/* Unified Login Route */}
                <Route path="/login" element={<Login />} />
                
                {/* Legacy login routes that redirect to unified login */}
                <Route path="/admin/login" element={<Navigate to="/login" replace />} />
                <Route path="/client/login" element={<Navigate to="/login" replace />} />
                
                {/* Protected Admin Routes */}
                <Route path="/admin" element={
                  <ProtectedRoute requiredRole="admin">
                    <AppLayout><Index /></AppLayout>
                  </ProtectedRoute>
                } />
                <Route path="/admin/properties" element={
                  <ProtectedRoute requiredRole="admin">
                    <AppLayout><Properties /></AppLayout>
                  </ProtectedRoute>
                } />
                <Route path="/admin/inspections" element={
                  <ProtectedRoute requiredRole="admin">
                    <AppLayout><Inspections /></AppLayout>
                  </ProtectedRoute>
                } />
                <Route path="/admin/warranty" element={
                  <ProtectedRoute requiredRole="admin">
                    <AppLayout><Warranty /></AppLayout>
                  </ProtectedRoute>
                } />
                <Route path="/admin/documents" element={
                  <ProtectedRoute requiredRole="admin">
                    <AppLayout><AdminDocuments /></AppLayout>
                  </ProtectedRoute>
                } />
                <Route path="/admin/calendar" element={
                  <ProtectedRoute requiredRole="admin">
                    <AppLayout><Calendar /></AppLayout>
                  </ProtectedRoute>
                } />
                <Route path="/admin/users" element={
                  <ProtectedRoute requiredRole="admin">
                    <AppLayout><Users /></AppLayout>
                  </ProtectedRoute>
                } />
                <Route path="/admin/client-area" element={
                  <ProtectedRoute requiredRole="admin">
                    <AppLayout><ClientArea /></AppLayout>
                  </ProtectedRoute>
                } />
                <Route path="/admin/checklist" element={
                  <ProtectedRoute requiredRole="admin">
                    <AppLayout><Checklist /></AppLayout>
                  </ProtectedRoute>
                } />
                <Route path="/admin/settings" element={
                  <ProtectedRoute requiredRole="admin">
                    <AppLayout><Settings /></AppLayout>
                  </ProtectedRoute>
                } />

                {/* Protected Client Routes */}
                <Route path="/client" element={
                  <ProtectedRoute requiredRole="client">
                    <ClientLayout />
                  </ProtectedRoute>
                }>
                  <Route index element={<ClientDashboard />} />
                  <Route path="documents" element={<ClientDocuments />} />
                  <Route path="inspections" element={<ClientInspections />} />
                  <Route path="warranty" element={<ClientWarranty />} />
                  <Route path="properties" element={<ClientProperties />} />
                </Route>

                {/* Legacy redirects for backward compatibility */}
                <Route path="/properties" element={
                  <ProtectedRoute requiredRole="admin" redirectTo="/login">
                    <AppLayout><Properties /></AppLayout>
                  </ProtectedRoute>
                } />
                <Route path="/inspections" element={
                  <ProtectedRoute requiredRole="admin" redirectTo="/login">
                    <AppLayout><Inspections /></AppLayout>
                  </ProtectedRoute>
                } />
                <Route path="/warranty" element={
                  <ProtectedRoute requiredRole="admin" redirectTo="/login">
                    <AppLayout><Warranty /></AppLayout>
                  </ProtectedRoute>
                } />
                <Route path="/calendar" element={
                  <ProtectedRoute requiredRole="admin" redirectTo="/login">
                    <AppLayout><Calendar /></AppLayout>
                  </ProtectedRoute>
                } />
                <Route path="/users" element={
                  <ProtectedRoute requiredRole="admin" redirectTo="/login">
                    <AppLayout><Users /></AppLayout>
                  </ProtectedRoute>
                } />
                <Route path="/client-area" element={
                  <ProtectedRoute requiredRole="admin" redirectTo="/login">
                    <AppLayout><ClientArea /></AppLayout>
                  </ProtectedRoute>
                } />
                <Route path="/checklist" element={
                  <ProtectedRoute requiredRole="admin" redirectTo="/login">
                    <AppLayout><Checklist /></AppLayout>
                  </ProtectedRoute>
                } />
                <Route path="/settings" element={
                  <ProtectedRoute requiredRole="admin" redirectTo="/login">
                    <AppLayout><Settings /></AppLayout>
                  </ProtectedRoute>
                } />

                {/* Catch-all route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AuthProvider>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </StrictMode>
  );
};

export default App;
