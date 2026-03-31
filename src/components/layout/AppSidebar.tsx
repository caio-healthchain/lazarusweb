import { useNavigate, useLocation } from 'react-router-dom';
import { useRBACStore, PROFILE_LABELS, type AppModule } from '@/store/rbacStore';
import { useAuthStore } from '@/store/authStore';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarSeparator,
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  LayoutDashboard,
  ClipboardList,
  Stethoscope,
  HeartPulse,
  AlertTriangle,
  Building2,
  BarChart3,
  MessageSquare,
  Shield,
  FileSearch,
  Sparkles,
  LogOut,
  ChevronUp,
  Hospital,
  Brain,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface NavItem {
  title: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
  module: AppModule;
  badge?: string;
  badgeVariant?: 'default' | 'destructive' | 'secondary';
  aiHint?: string;
}

const WORKFLOW_ITEMS: NavItem[] = [
  {
    title: 'Central de Contas',
    url: '/central-contas',
    icon: LayoutDashboard,
    module: 'central-contas',
    badge: '10',
    aiHint: 'Visão completa do workflow de contas hospitalares',
  },
  {
    title: 'Frente Administrativa',
    url: '/frente-administrativa',
    icon: ClipboardList,
    module: 'frente-administrativa',
    badge: '2',
    badgeVariant: 'destructive',
    aiHint: 'Validação de informações e documentos',
  },
  {
    title: 'Frente Enfermagem',
    url: '/frente-enfermagem',
    icon: HeartPulse,
    module: 'frente-enfermagem',
    badge: '1',
    aiHint: 'Complementação de contas e materiais',
  },
  {
    title: 'Frente Médica',
    url: '/frente-medica',
    icon: Stethoscope,
    module: 'frente-medica',
    badge: '1',
    aiHint: 'Finalização e parecer médico',
  },
  {
    title: 'Glosas e Recursos',
    url: '/glosas',
    icon: AlertTriangle,
    module: 'glosas',
    badge: '3',
    badgeVariant: 'destructive',
    aiHint: 'Tratamento de glosas e geração de laudos',
  },
];

const GESTAO_ITEMS: NavItem[] = [
  {
    title: 'Backoffice',
    url: '/backoffice',
    icon: Building2,
    module: 'backoffice',
    aiHint: 'Contratos, fornecedores e recomendações',
  },
  {
    title: 'Painel Gerencial',
    url: '/gerencial',
    icon: BarChart3,
    module: 'gerencial',
    aiHint: 'Dashboard com indicadores financeiros',
  },
  {
    title: 'Assistente IA',
    url: '/gerencial/chat',
    icon: Brain,
    module: 'gerencial-chat',
    aiHint: 'Chat inteligente sobre dados do hospital',
  },
];

const LEGADO_ITEMS: NavItem[] = [
  {
    title: 'Auditor',
    url: '/audits',
    icon: Shield,
    module: 'auditor-legado',
    aiHint: 'Módulo de auditoria de guias',
  },
  {
    title: 'Analista',
    url: '/analista',
    icon: FileSearch,
    module: 'analista-legado',
    aiHint: 'Checklist de documentos por guia',
  },
];

const AppSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { hasAccess, currentProfile } = useRBACStore();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (url: string) => {
    if (url === '/central-contas') return location.pathname === '/central-contas' || location.pathname === '/control-tower';
    return location.pathname.startsWith(url);
  };

  const renderNavItems = (items: NavItem[]) => {
    return items
      .filter(item => hasAccess(item.module))
      .map(item => (
        <SidebarMenuItem key={item.url}>
          <SidebarMenuButton
            onClick={() => navigate(item.url)}
            isActive={isActive(item.url)}
            tooltip={item.aiHint}
            className="group relative"
          >
            <item.icon className="h-4 w-4" />
            <span className="flex-1">{item.title}</span>
            {item.badge && (
              <Badge
                variant={item.badgeVariant || 'secondary'}
                className="ml-auto text-xs h-5 min-w-[20px] flex items-center justify-center"
              >
                {item.badge}
              </Badge>
            )}
          </SidebarMenuButton>
        </SidebarMenuItem>
      ));
  };

  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  const workflowItems = renderNavItems(WORKFLOW_ITEMS);
  const gestaoItems = renderNavItems(GESTAO_ITEMS);
  const legadoItems = renderNavItems(LEGADO_ITEMS);

  return (
    <Sidebar collapsible="icon" className="border-r">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3 group-data-[collapsible=icon]:justify-center">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-purple-600 to-pink-500 text-white flex-shrink-0">
            <Sparkles className="h-5 w-5" />
          </div>
          <div className="flex flex-col group-data-[collapsible=icon]:hidden">
            <span className="text-sm font-bold text-foreground">Lazarus</span>
            <span className="text-xs text-muted-foreground">Auditoria Hospitalar</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarSeparator />

      {/* IA First: Ações Recomendadas */}
      <SidebarGroup>
        <SidebarGroupLabel className="text-purple-600 font-semibold flex items-center gap-1">
          <Brain className="h-3 w-3" />
          IA Recomenda
        </SidebarGroupLabel>
        <SidebarGroupContent>
          <div className="px-2 py-1 group-data-[collapsible=icon]:hidden">
            <div
              onClick={() => navigate('/glosas')}
              className="p-2 rounded-md bg-purple-50 border border-purple-200 cursor-pointer hover:bg-purple-100 transition-colors mb-1"
            >
              <p className="text-xs text-purple-800 font-medium">3 glosas com prazo vencendo</p>
              <p className="text-xs text-purple-600 mt-0.5">Clique para tratar agora</p>
            </div>
            <div
              onClick={() => navigate('/frente-administrativa')}
              className="p-2 rounded-md bg-amber-50 border border-amber-200 cursor-pointer hover:bg-amber-100 transition-colors"
            >
              <p className="text-xs text-amber-800 font-medium">2 contas aguardando validação</p>
              <p className="text-xs text-amber-600 mt-0.5">Frente Administrativa</p>
            </div>
          </div>
        </SidebarGroupContent>
      </SidebarGroup>

      <SidebarSeparator />

      <SidebarContent>
        {/* Workflow de Contas */}
        {workflowItems.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel>Workflow de Contas</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>{workflowItems}</SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* Gestão */}
        {gestaoItems.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel>Gestão e Inteligência</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>{gestaoItems}</SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* Módulos Legado */}
        {legadoItems.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel>Auditoria Detalhada</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>{legadoItems}</SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="h-auto py-2">
                  <Avatar className="h-7 w-7">
                    <AvatarImage src={user?.avatar} />
                    <AvatarFallback className="bg-gradient-to-r from-purple-600 to-pink-500 text-white text-xs">
                      {user?.name ? getUserInitials(user.name) : 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col items-start group-data-[collapsible=icon]:hidden">
                    <span className="text-sm font-medium truncate max-w-[140px]">{user?.name || 'Usuário'}</span>
                    <span className="text-xs text-muted-foreground">{PROFILE_LABELS[currentProfile]}</span>
                  </div>
                  <ChevronUp className="ml-auto h-4 w-4 group-data-[collapsible=icon]:hidden" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" align="start" className="w-56">
                <div className="px-2 py-1.5">
                  <p className="text-sm font-medium">{user?.name}</p>
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Badge variant="secondary" className="text-xs">
                      {PROFILE_LABELS[currentProfile]}
                    </Badge>
                    <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700">
                      <Sparkles className="h-2.5 w-2.5 mr-1" />
                      IA Ativa
                    </Badge>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/select-hospital')}>
                  <Hospital className="mr-2 h-4 w-4" />
                  Trocar Hospital
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
