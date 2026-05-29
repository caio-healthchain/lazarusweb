import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { MsalProvider } from '@azure/msal-react';
import { PublicClientApplication } from '@azure/msal-browser';
import { msalConfig } from '@/config/auth';
import { useTokenRenewal } from '@/hooks/useTokenRenewal';
import { AuthProvider } from '@/contexts/AuthContext';
import { AppModule, UserProfile } from '@/store/rbacStore';

// Pages - Original
import Login from './pages/Login';
import HospitalSelection from './pages/HospitalSelection';
import ManagerialDashboard from './pages/ManagerialDashboard';
import ManagerialChat from './pages/ManagerialChat';
import NewAudit from './pages/NewAudit';
import Audits from './pages/Audits';
import GuiaDetails from './pages/GuiaDetails';
import { Contracts } from './pages/Contracts';
import { ContractDetailsNew } from './pages/ContractDetailsNew';
import TMIReport from './pages/TMIReport';
import NotFound from './pages/NotFound';
import Analista from './pages/Analista';
import AnalistaDetails from './pages/AnalistaDetails';
import Perfil from './pages/Perfil';
import PapeisAdmin from './pages/admin/PapeisAdmin';

// Pages - Workflow (Novas)
import ControlTower from './pages/ControlTower';
import FrenteAdministrativa from './pages/FrenteAdministrativa';
import FrenteAdministrativaDetails from './pages/FrenteAdministrativaDetails';
import FrenteEnfermagem from './pages/FrenteEnfermagem';
import FrenteEnfermagemDetails from './pages/FrenteEnfermagemDetails';
import FrenteMedica from './pages/FrenteMedica';
import FrenteMedicaDetails from './pages/FrenteMedicaDetails';
import Glosas from './pages/Glosas';
import GlosaDetails from './pages/GlosaDetails';
import Backoffice from './pages/Backoffice';
import Terminologies from './pages/Terminologies';

// Components
import ProtectedRoute from './components/auth/ProtectedRoute';
import RequireRole from './components/auth/RequireRole';
import AppLayout from './components/layout/AppLayout';

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

interface ProtectedPageProps {
  children: React.ReactNode;
  module?: AppModule;
  profiles?: UserProfile[];
}

const ProtectedPage = ({ children, module, profiles }: ProtectedPageProps) => (
  <ProtectedRoute>
    <RequireRole module={module} profiles={profiles}>
      <AppLayout>{children}</AppLayout>
    </RequireRole>
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
          <ProtectedPage module="central-contas"><ControlTower /></ProtectedPage>
        } />
        {/* Manter rota antiga para compatibilidade */}
        <Route path="/control-tower" element={<Navigate to="/central-contas" replace />} />

        {/* Frente Administrativa */}
        <Route path="/frente-administrativa" element={
          <ProtectedPage module="frente-administrativa"><FrenteAdministrativa /></ProtectedPage>
        } />
        <Route path="/frente-administrativa/:id" element={
          <ProtectedPage module="frente-administrativa"><FrenteAdministrativaDetails /></ProtectedPage>
        } />

        {/* Frente de Enfermagem */}
        <Route path="/frente-enfermagem" element={
          <ProtectedPage module="frente-enfermagem"><FrenteEnfermagem /></ProtectedPage>
        } />
        <Route path="/frente-enfermagem/:id" element={
          <ProtectedPage module="frente-enfermagem"><FrenteEnfermagemDetails /></ProtectedPage>
        } />

        {/* Frente Médica */}
        <Route path="/frente-medica" element={
          <ProtectedPage module="frente-medica"><FrenteMedica /></ProtectedPage>
        } />
        <Route path="/frente-medica/:id" element={
          <ProtectedPage module="frente-medica"><FrenteMedicaDetails /></ProtectedPage>
        } />

        {/* Glosas e Recursos */}
        <Route path="/glosas" element={
          <ProtectedPage module="glosas"><Glosas /></ProtectedPage>
        } />
        <Route path="/glosas/:id" element={
          <ProtectedPage module="glosas"><GlosaDetails /></ProtectedPage>
        } />

        {/* ==================== */}
        {/* GESTÃO E INTELIGÊNCIA */}
        {/* ==================== */}

        {/* Backoffice */}
        <Route path="/backoffice" element={
          <ProtectedPage module="backoffice"><Backoffice /></ProtectedPage>
        } />

        {/* Terminologias */}
        <Route path="/terminologias" element={
          <ProtectedPage module="terminologias"><Terminologies /></ProtectedPage>
        } />

        {/* Painel Gerencial */}
        <Route path="/gerencial" element={
          <ProtectedPage module="gerencial"><ManagerialDashboard /></ProtectedPage>
        } />

        {/* Assistente IA */}
        <Route path="/gerencial/chat" element={
          <ProtectedPage module="gerencial-chat"><ManagerialChat /></ProtectedPage>
        } />

        {/* ==================== */}
        {/* AUDITORIA DETALHADA */}
        {/* ==================== */}

        {/* Auditor */}
        <Route path="/audits" element={
          <ProtectedPage module="auditor-legado"><Audits /></ProtectedPage>
        } />
        <Route path="/audit/new" element={
          <ProtectedPage module="auditor-legado"><NewAudit /></ProtectedPage>
        } />
        <Route path="/guia/:id" element={
          <ProtectedPage module="auditor-legado"><GuiaDetails /></ProtectedPage>
        } />

        {/* Analista */}
        <Route path="/analista" element={
          <ProtectedPage module="analista-legado"><Analista /></ProtectedPage>
        } />
        <Route path="/analista/:guideId" element={
          <ProtectedPage module="analista-legado"><AnalistaDetails /></ProtectedPage>
        } />

        {/* Contratos */}
        <Route path="/contracts" element={
          <ProtectedPage module="backoffice"><Contracts /></ProtectedPage>
        } />
        <Route path="/contracts/:id" element={
          <ProtectedPage module="backoffice"><ContractDetailsNew /></ProtectedPage>
        } />

        {/* TMI Report */}
        <Route path="/tmi-report" element={
          <ProtectedPage module="gerencial"><TMIReport /></ProtectedPage>
        } />

        {/* Conta e administração IAM */}
        <Route path="/perfil" element={
          <ProtectedPage><Perfil /></ProtectedPage>
        } />
        <Route path="/admin/papeis" element={
          <ProtectedPage profiles={['admin', 'diretor']}><PapeisAdmin /></ProtectedPage>
        } />

        {/* Rota raiz - redireciona para login */}
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
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <AppContent />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  </MsalProvider>
);

export default App;
