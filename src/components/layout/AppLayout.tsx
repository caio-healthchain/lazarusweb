import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import AppSidebar from './AppSidebar';
import AIFloatingChat from '../ai/AIFloatingChat';
import { useAuthStore } from '@/store/authStore';
import { useRBACStore, PROFILE_LABELS } from '@/store/rbacStore';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb';
import { useLocation } from 'react-router-dom';
import { Sparkles } from 'lucide-react';

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
  const { user } = useAuthStore();
  const { currentProfile } = useRBACStore();
  const pageTitle = getPageTitle(location.pathname);

  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

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
            <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200 hidden sm:flex">
              <Sparkles className="h-3 w-3 mr-1" />
              IA Ativa
            </Badge>
            <div className="flex items-center gap-2">
              <Avatar className="h-7 w-7">
                <AvatarImage src={user?.avatar} />
                <AvatarFallback className="bg-gradient-to-r from-purple-600 to-pink-500 text-white text-xs">
                  {user?.name ? getUserInitials(user.name) : 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="hidden sm:flex flex-col">
                <span className="text-xs font-medium leading-none">{user?.name}</span>
                <span className="text-xs text-muted-foreground leading-none mt-0.5">{PROFILE_LABELS[currentProfile]}</span>
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
