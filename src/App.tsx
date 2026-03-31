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
import AppLayout from "./components/layout/AppLayout";

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

// Wrapper para rotas com sidebar
const WithLayout = ({ children }: { children: React.ReactNode }) => (
  <ProtectedRoute>
    <AppLayout>{children}</AppLayout>
  </ProtectedRoute>
);

const AppContent = () => {
  useTokenRenewal();
  
  return (
    <BrowserRouter>
      <Routes>
        {/* Rotas públicas */}
        <Route path="/login" element={<Login />} />
        
        {/* Seleção de hospital (sem sidebar - tela de transição) */}
        <Route path="/select-hospital" element={
          <ProtectedRoute>
            <HospitalSelection />
          </ProtectedRoute>
        } />

        {/* ==================== */}
        {/* WORKFLOW DE CONTAS */}
        {/* ==================== */}

        {/* Central de Contas (Home após login) */}
        <Route path="/central-contas" element={
          <WithLayout><ControlTower /></WithLayout>
        } />
        {/* Manter rota antiga para compatibilidade */}
        <Route path="/control-tower" element={<Navigate to="/central-contas" replace />} />

        {/* Frente Administrativa */}
        <Route path="/frente-administrativa" element={
          <WithLayout><FrenteAdministrativa /></WithLayout>
        } />
        <Route path="/frente-administrativa/:id" element={
          <WithLayout><FrenteAdministrativaDetails /></WithLayout>
        } />

        {/* Frente de Enfermagem */}
        <Route path="/frente-enfermagem" element={
          <WithLayout><FrenteEnfermagem /></WithLayout>
        } />
        <Route path="/frente-enfermagem/:id" element={
          <WithLayout><FrenteEnfermagemDetails /></WithLayout>
        } />

        {/* Frente Médica */}
        <Route path="/frente-medica" element={
          <WithLayout><FrenteMedica /></WithLayout>
        } />
        <Route path="/frente-medica/:id" element={
          <WithLayout><FrenteMedicaDetails /></WithLayout>
        } />

        {/* Glosas e Recursos */}
        <Route path="/glosas" element={
          <WithLayout><Glosas /></WithLayout>
        } />
        <Route path="/glosas/:id" element={
          <WithLayout><GlosaDetails /></WithLayout>
        } />

        {/* ==================== */}
        {/* GESTÃO E INTELIGÊNCIA */}
        {/* ==================== */}

        {/* Backoffice */}
        <Route path="/backoffice" element={
          <WithLayout><Backoffice /></WithLayout>
        } />

        {/* Painel Gerencial */}
        <Route path="/gerencial" element={
          <WithLayout><ManagerialDashboard /></WithLayout>
        } />
        
        {/* Assistente IA */}
        <Route path="/gerencial/chat" element={
          <WithLayout><ManagerialChat /></WithLayout>
        } />

        {/* ==================== */}
        {/* AUDITORIA DETALHADA */}
        {/* ==================== */}

        {/* Auditor */}
        <Route path="/audits" element={
          <WithLayout><Audits /></WithLayout>
        } />
        <Route path="/audit/new" element={
          <WithLayout><NewAudit /></WithLayout>
        } />
        <Route path="/guia/:id" element={
          <WithLayout><GuiaDetails /></WithLayout>
        } />

        {/* Analista */}
        <Route path="/analista" element={
          <WithLayout><Analista /></WithLayout>
        } />
        <Route path="/analista/:guideId" element={
          <WithLayout><AnalistaDetails /></WithLayout>
        } />

        {/* Contratos */}
        <Route path="/contracts" element={
          <WithLayout><Contracts /></WithLayout>
        } />
        <Route path="/contracts/:id" element={
          <WithLayout><ContractDetailsNew /></WithLayout>
        } />

        {/* TMI Report */}
        <Route path="/tmi-report" element={
          <WithLayout><TMIReport /></WithLayout>
        } />

        {/* Rota raiz - redireciona para Central de Contas */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* Rota antiga de módulos - redireciona para Central de Contas */}
        <Route path="/modules" element={
          <ProtectedRoute>
            <Navigate to="/central-contas" replace />
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
