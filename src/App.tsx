import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { MsalProvider } from "@azure/msal-react";
import { PublicClientApplication } from "@azure/msal-browser";
import { msalConfig } from "@/config/auth";
import { useTokenRenewal } from "@/hooks/useTokenRenewal";

// Pages
import Index from "./pages/Index";
import PatientList from "./pages/PatientList";
import PatientDetails from "./pages/PatientDetails";
import PatientForm from "./pages/PatientForm";
import Login from "./pages/Login";
import ModuleSelection from "./pages/ModuleSelection";
import ManagerialDashboard from "./pages/ManagerialDashboard";
import ManagerialChat from "./pages/ManagerialChat";
import NewAudit from "./pages/NewAudit";
import NotFound from "./pages/NotFound";

// Components
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Header from "./components/layout/Header";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutos
    },
  },
});

const msalInstance = new PublicClientApplication(msalConfig);

// Componente interno que usa o hook
const AppContent = () => {
  useTokenRenewal(); // Ativa renovação automática de token
  
  return (
    <BrowserRouter>
          <Routes>
            {/* Rota pública de login */}
            <Route path="/login" element={<Login />} />
            
            {/* Seleção de módulos */}
            <Route path="/modules" element={
              <ProtectedRoute>
                <ModuleSelection />
              </ProtectedRoute>
            } />
            
            {/* Módulo Gerencial */}
            <Route path="/gerencial" element={
              <ProtectedRoute>
                <div className="min-h-screen bg-background">
                  <Header />
                  <ManagerialDashboard />
                </div>
              </ProtectedRoute>
            } />
            
            <Route path="/gerencial/chat" element={
              <ProtectedRoute>
                <div className="min-h-screen bg-background">
                  <Header />
                  <ManagerialChat />
                </div>
              </ProtectedRoute>
            } />
            
            {/* Módulo Auditor - Rota principal */}
            <Route path="/" element={
              <ProtectedRoute>
                <div className="min-h-screen bg-background">
                  <Header />
                  <PatientList />
                </div>
              </ProtectedRoute>
            } />
            
            <Route path="/patient/new" element={
              <ProtectedRoute>
                <div className="min-h-screen bg-background">
                  <Header />
                  <PatientForm />
                </div>
              </ProtectedRoute>
            } />
            
            <Route path="/patient/:id" element={
              <ProtectedRoute>
                <div className="min-h-screen bg-background">
                  <Header />
                  <PatientDetails />
                </div>
              </ProtectedRoute>
            } />
            
            <Route path="/audit/new" element={
              <ProtectedRoute>
                <div className="min-h-screen bg-background">
                  <Header />
                  <NewAudit />
                </div>
              </ProtectedRoute>
            } />
            
            {/* Rotas futuras para outras funcionalidades */}
            <Route path="/dashboard" element={
              <ProtectedRoute requiredRoles={['admin', 'auditor']}>
                <div className="min-h-screen bg-background">
                  <Header />
                  <div className="p-8 text-center">
                    <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
                    <p className="text-gray-600">Dashboard administrativo em desenvolvimento</p>
                  </div>
                </div>
              </ProtectedRoute>
            } />
            
            <Route path="/reports" element={
              <ProtectedRoute requiredRoles={['admin', 'auditor']}>
                <div className="min-h-screen bg-background">
                  <Header />
                  <div className="p-8 text-center">
                    <h2 className="text-2xl font-bold mb-4">Relatórios</h2>
                    <p className="text-gray-600">Módulo de relatórios em desenvolvimento</p>
                  </div>
                </div>
              </ProtectedRoute>
            } />
            
            <Route path="/settings" element={
              <ProtectedRoute requiredRoles={['admin']}>
                <div className="min-h-screen bg-background">
                  <Header />
                  <div className="p-8 text-center">
                    <h2 className="text-2xl font-bold mb-4">Configurações</h2>
                    <p className="text-gray-600">Configurações do sistema em desenvolvimento</p>
                  </div>
                </div>
              </ProtectedRoute>
            } />
            
            <Route path="/profile" element={
              <ProtectedRoute>
                <div className="min-h-screen bg-background">
                  <Header />
                  <div className="p-8 text-center">
                    <h2 className="text-2xl font-bold mb-4">Perfil</h2>
                    <p className="text-gray-600">Perfil do usuário em desenvolvimento</p>
                  </div>
                </div>
              </ProtectedRoute>
            } />

            {/* Rota 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
    </BrowserRouter>
  );
};

const App = () => (
  <MsalProvider instance={msalInstance}>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AppContent />
      </TooltipProvider>
    </QueryClientProvider>
  </MsalProvider>
);

export default App;
