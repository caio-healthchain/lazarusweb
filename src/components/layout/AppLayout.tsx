import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import AppSidebar from './AppSidebar';
import AIFloatingChat from '../ai/AIFloatingChat';
import { useAuthStore } from '@/store/authStore';
import { useRBACStore, PROFILE_LABELS } from '@/store/rbacStore';
import { Badge } from '@/components/ui/badge';
import UserAvatar from '@/components/auth/UserAvatar';
import RoleBadge from '@/components/auth/RoleBadge';
import { Separator } from '@/components/ui/separator';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb';
import { useLocation } from 'react-router-dom';
import { Building2, Sparkles } from 'lucide-react';

interface AppLayoutProps {
  children: React.ReactNode;
}

const ROUTE_TITLES: Record<string, string> = {
  '/central-contas': 'Central de Contas',
  '/control-tower': 'Central de Contas',
  '/frente-administrativa': 'Frente Administrativa',
  '/frente-enfermagem': 'Frente Enfermagem',
  '/frente-medica': 'Frente Médica',
  '/glosas': 'Glosas e Recursos',
  '/backoffice': 'Backoffice',
  '/gerencial': 'Painel Gerencial',
  '/gerencial/chat': 'Assistente IA',
  '/audits': 'Auditor',
  '/analista': 'Analista',
  '/perfil': 'Meu Perfil',
  '/admin/papeis': 'Administração de Papéis',
};

const getPageTitle = (pathname: string): string => {
  // Verifica rotas exatas primeiro
  if (ROUTE_TITLES[pathname]) return ROUTE_TITLES[pathname];
  
  // Verifica rotas com parâmetros
  for (const [route, title] of Object.entries(ROUTE_TITLES)) {
    if (pathname.startsWith(route)) return title;
  }
  
  return 'Lazarus';
};

const AppLayout = ({ children }: AppLayoutProps) => {
  const location = useLocation();
  const { user, selectedHospital, tokenContext } = useAuthStore();
  const { currentProfile } = useRBACStore();
  const pageTitle = getPageTitle(location.pathname);
  const contextHospitalId = selectedHospital?.id || String(tokenContext?.hospitalId || tokenContext?.tenantId || '');
  const hospitalDisplayName = selectedHospital?.name || (contextHospitalId ? 'Hospital ativo' : 'Sem hospital ativo');
  const hospitalDisplayCode = selectedHospital?.code || contextHospitalId;

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        {/* Header compacto */}
        <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4 bg-white">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage className="font-medium">{pageTitle}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          
          <div className="ml-auto flex items-center gap-3">
            <Badge
              variant="outline"
              className="hidden max-w-[280px] items-center gap-1.5 truncate border-blue-200 bg-blue-50 text-xs text-blue-700 md:flex"
              title={hospitalDisplayCode ? `${hospitalDisplayName} (${hospitalDisplayCode})` : hospitalDisplayName}
            >
              <Building2 className="h-3 w-3 shrink-0" />
              <span className="truncate">{hospitalDisplayName}</span>
            </Badge>
            <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200 hidden sm:flex">
              <Sparkles className="h-3 w-3 mr-1" />
              IA Ativa
            </Badge>
            <div className="flex items-center gap-2">
              <UserAvatar name={user?.name} avatar={user?.avatar} className="h-7 w-7" />
              <div className="hidden sm:flex flex-col">
                <span className="text-xs font-medium leading-none">{user?.name}</span>
                <RoleBadge role={currentProfile} label={PROFILE_LABELS[currentProfile]} className="h-4 px-1.5 text-[10px] mt-0.5 w-fit" />
              </div>
            </div>
          </div>
        </header>
        
        {/* Conteúdo principal */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </SidebarInset>
      
      {/* Chat IA Flutuante - acessível de qualquer tela */}
      <AIFloatingChat />
    </SidebarProvider>
  );
};

export default AppLayout;
