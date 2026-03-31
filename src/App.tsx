import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { MsalProvider } from "@azure/msal-react";
import { PublicClientApplication } from "@azure/msal-browser";
import { msalConfig } from "@/config/auth";
import { useTokenRenewal } from "@/hooks/useTokenRenewal";

// Pages - Original
import Login from "./pages/Login";
import HospitalSelection from "./pages/HospitalSelection";
import ModuleSelection from "./pages/ModuleSelection";
import ManagerialDashboard from "./pages/ManagerialDashboard";
import ManagerialChat from "./pages/ManagerialChat";
import NewAudit from "./pages/NewAudit";
import Audits from "./pages/Audits";
import GuiaDetails from "./pages/GuiaDetails";
import { Contracts } from "./pages/Contracts";
import { ContractDetailsNew } from "./pages/ContractDetailsNew";
import TMIReport from "./pages/TMIReport";
import NotFound from "./pages/NotFound";
import Analista from "./pages/Analista";
import AnalistaDetails from "./pages/AnalistaDetails";

// Pages - Workflow (Novas)
import ControlTower from "./pages/ControlTower";
import FrenteAdministrativa from "./pages/FrenteAdministrativa";
import FrenteAdministrativaDetails from "./pages/FrenteAdministrativaDetails";
import FrenteEnfermagem from "./pages/FrenteEnfermagem";
import FrenteEnfermagemDetails from "./pages/FrenteEnfermagemDetails";
import FrenteMedica from "./pages/FrenteMedica";
import FrenteMedicaDetails from "./pages/FrenteMedicaDetails";
import Glosas from "./pages/Glosas";
import GlosaDetails from "./pages/GlosaDetails";
import Backoffice from "./pages/Backoffice";

// Components
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Header from "./components/layout/Header";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
    },
  },
});

const msalInstance = new PublicClientApplication(msalConfig);

const AppContent = () => {
  useTokenRenewal();
  
  return (
    <BrowserRouter>
          <Routes>
            {/* Rota p\u00fablica de login */}
            <Route path="/login" element={<Login />} />
            
            {/* Sele\u00e7\u00e3o de hospital */}
            <Route path="/select-hospital" element={
              <ProtectedRoute>
                <HospitalSelection />
              </ProtectedRoute>
            } />
            
            {/* Sele\u00e7\u00e3o de m\u00f3dulos */}
            <Route path="/modules" element={
              <ProtectedRoute>
                <ModuleSelection />
              </ProtectedRoute>
            } />

            {/* ==================== */}
            {/* WORKFLOW - Novas Rotas */}
            {/* ==================== */}

            {/* Control Tower - Kanban de Contas */}
            <Route path="/control-tower" element={
              <ProtectedRoute>
                <ControlTower />
              </ProtectedRoute>
            } />

            {/* Frente Administrativa */}
            <Route path="/frente-administrativa" element={
              <ProtectedRoute>
                <FrenteAdministrativa />
              </ProtectedRoute>
            } />
            <Route path="/frente-administrativa/:id" element={
              <ProtectedRoute>
                <FrenteAdministrativaDetails />
              </ProtectedRoute>
            } />

            {/* Frente de Enfermagem */}
            <Route path="/frente-enfermagem" element={
              <ProtectedRoute>
                <FrenteEnfermagem />
              </ProtectedRoute>
            } />
            <Route path="/frente-enfermagem/:id" element={
              <ProtectedRoute>
                <FrenteEnfermagemDetails />
              </ProtectedRoute>
            } />

            {/* Frente M\u00e9dica */}
            <Route path="/frente-medica" element={
              <ProtectedRoute>
                <FrenteMedica />
              </ProtectedRoute>
            } />
            <Route path="/frente-medica/:id" element={
              <ProtectedRoute>
                <FrenteMedicaDetails />
              </ProtectedRoute>
            } />

            {/* Glosas e Laudos */}
            <Route path="/glosas" element={
              <ProtectedRoute>
                <Glosas />
              </ProtectedRoute>
            } />
            <Route path="/glosas/:id" element={
              <ProtectedRoute>
                <GlosaDetails />
              </ProtectedRoute>
            } />

            {/* Backoffice */}
            <Route path="/backoffice" element={
              <ProtectedRoute>
                <Backoffice />
              </ProtectedRoute>
            } />

            {/* ==================== */}
            {/* M\u00f3dulos Originais */}
            {/* ==================== */}
            
            {/* M\u00f3dulo Gerencial */}
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
            
            {/* M\u00f3dulo Analista */}
            <Route path="/analista" element={
              <ProtectedRoute>
                <Analista />
              </ProtectedRoute>
            } />
            
            <Route path="/analista/:guideId" element={
              <ProtectedRoute>
                <AnalistaDetails />
              </ProtectedRoute>
            } />
            
            {/* Rota raiz */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            
            <Route path="/audit/new" element={
              <ProtectedRoute>
                <div className="min-h-screen bg-background">
                  <Header />
                  <NewAudit />
                </div>
              </ProtectedRoute>
            } />

            <Route path="/audits" element={
              <ProtectedRoute>
                <div className="min-h-screen bg-background">
                  <Header />
                  <Audits />
                </div>
              </ProtectedRoute>
            } />

            <Route path="/guia/:id" element={
              <ProtectedRoute>
                <div className="min-h-screen bg-background">
                  <Header />
                  <GuiaDetails />
                </div>
              </ProtectedRoute>
            } />

            <Route path="/contracts" element={
              <ProtectedRoute>
                <div className="min-h-screen bg-background">
                  <Header />
                  <Contracts />
                </div>
              </ProtectedRoute>
            } />

            <Route path="/tmi-report" element={
              <ProtectedRoute>
                <>
                  <Header />
                  <TMIReport />
                </>
              </ProtectedRoute>
            } />

            <Route path="/contracts/:id" element={
              <ProtectedRoute>
                <div className="min-h-screen bg-background">
                  <Header />
                  <ContractDetailsNew />
                </div>
              </ProtectedRoute>
            } />
            
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
                    <h2 className="text-2xl font-bold mb-4">Relat\u00f3rios</h2>
                    <p className="text-gray-600">M\u00f3dulo de relat\u00f3rios em desenvolvimento</p>
                  </div>
                </div>
              </ProtectedRoute>
            } />
            
            <Route path="/settings" element={
              <ProtectedRoute requiredRoles={['admin']}>
                <div className="min-h-screen bg-background">
                  <Header />
                  <div className="p-8 text-center">
                    <h2 className="text-2xl font-bold mb-4">Configura\u00e7\u00f5es</h2>
                    <p className="text-gray-600">Configura\u00e7\u00f5es do sistema em desenvolvimento</p>
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
                    <p className="text-gray-600">Perfil do usu\u00e1rio em desenvolvimento</p>
                  </div>
                </div>
              </ProtectedRoute>
            } />

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
