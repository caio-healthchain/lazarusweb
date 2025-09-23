import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useMsal } from '@azure/msal-react';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { 
  Hospital, 
  LogOut, 
  Settings, 
  User, 
  Shield,
  BarChart3,
  ClipboardCheck,
  MessageSquare,
  Home,
  Brain,
  Sparkles,
  ChevronDown,
  Grid3X3
} from 'lucide-react';
import { toast } from 'sonner';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { instance } = useMsal();
  const { user, logout, accessToken } = useAuthStore();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      
      // Se não for demo, fazer logout do Azure AD
      if (accessToken !== 'demo-token-123') {
        await instance.logoutPopup();
      }
      
      // Limpar estado local
      logout();
      
      toast.success('Logout realizado com sucesso!');
      navigate('/login');
    } catch (error) {
      console.error('Erro no logout:', error);
      toast.error('Erro ao fazer logout');
    } finally {
      setIsLoggingOut(false);
    }
  };

  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin':
        return 'destructive';
      case 'auditor':
        return 'default';
      case 'medico':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Administrador';
      case 'auditor':
        return 'Auditor';
      case 'medico':
        return 'Médico';
      case 'enfermeiro':
        return 'Enfermeiro';
      default:
        return role;
    }
  };

  const getCurrentModuleInfo = () => {
    const path = location.pathname;
    
    if (path.startsWith('/gerencial')) {
      return {
        name: 'Módulo Gerencial',
        icon: BarChart3,
        color: 'text-emerald-600',
        bgColor: 'bg-emerald-100'
      };
    } else if (path === '/modules') {
      return {
        name: 'Seleção de Módulos',
        icon: Grid3X3,
        color: 'text-blue-600',
        bgColor: 'bg-blue-100'
      };
    } else {
      return {
        name: 'Módulo Auditor',
        icon: ClipboardCheck,
        color: 'text-blue-600',
        bgColor: 'bg-blue-100'
      };
    }
  };

  const moduleInfo = getCurrentModuleInfo();
  const ModuleIcon = moduleInfo.icon;

  if (!user) return null;

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
      <div className="flex items-center justify-between">
        {/* Logo e Módulo Atual */}
        <div className="flex items-center space-x-4">
          {/* Logo */}
          <button 
            onClick={() => navigate('/modules')}
            className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
          >
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-xl">
              <Hospital className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
                HealthChain
              </h1>
              <p className="text-xs text-gray-500 -mt-1">
                Solutions
              </p>
            </div>
          </button>

          {/* Separador */}
          <div className="h-8 w-px bg-gray-300"></div>

          {/* Módulo Atual */}
          <div className="flex items-center space-x-3">
            <div className={`flex items-center justify-center w-8 h-8 ${moduleInfo.bgColor} rounded-lg`}>
              <ModuleIcon className={`h-4 w-4 ${moduleInfo.color}`} />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-gray-900">
                {moduleInfo.name}
              </h2>
              <p className="text-xs text-gray-500">
                {location.pathname.includes('/chat') ? 'Chat com IA' : 
                 location.pathname.includes('/dashboard') ? 'Dashboard' : 
                 'Sistema Ativo'}
              </p>
            </div>
          </div>
        </div>

        {/* Navegação e Menu do Usuário */}
        <div className="flex items-center space-x-4">
          {/* Navegação Rápida */}
          {!location.pathname.includes('/modules') && (
            <div className="hidden md:flex items-center space-x-2">
              {location.pathname.startsWith('/gerencial') ? (
                <>
                  <Button
                    variant={location.pathname === '/gerencial' ? "default" : "ghost"}
                    size="sm"
                    onClick={() => navigate('/gerencial')}
                    className="text-xs"
                  >
                    <BarChart3 className="mr-2 h-3 w-3" />
                    Dashboard
                  </Button>
                  <Button
                    variant={location.pathname === '/gerencial/chat' ? "default" : "ghost"}
                    size="sm"
                    onClick={() => navigate('/gerencial/chat')}
                    className="text-xs"
                  >
                    <Brain className="mr-2 h-3 w-3" />
                    Chat IA
                  </Button>
                </>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/')}
                  className="text-xs"
                >
                  <ClipboardCheck className="mr-2 h-3 w-3" />
                  Auditoria
                </Button>
              )}
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/modules')}
                className="text-xs"
              >
                <Grid3X3 className="mr-2 h-3 w-3" />
                Módulos
              </Button>
            </div>
          )}

          {/* Status Badge */}
          <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 hidden sm:flex">
            <Sparkles className="mr-1 h-3 w-3" />
            {accessToken === 'demo-token-123' ? 'Demo' : 'Azure AD'}
          </Badge>

          {/* Menu do Usuário */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 px-3 rounded-full hover:bg-gray-100">
                <div className="flex items-center space-x-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="bg-gradient-to-r from-blue-600 to-emerald-600 text-white text-xs">
                      {getUserInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                </div>
              </Button>
            </DropdownMenuTrigger>
            
            <DropdownMenuContent className="w-80" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-3">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback className="bg-gradient-to-r from-blue-600 to-emerald-600 text-white text-sm">
                        {getUserInitials(user.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <p className="text-sm font-medium leading-none">{user.name}</p>
                      <p className="text-xs leading-none text-muted-foreground mt-1">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  
                  {/* Roles */}
                  <div className="flex flex-wrap gap-1">
                    {user.roles.map((role) => (
                      <Badge 
                        key={role} 
                        variant={getRoleBadgeVariant(role)}
                        className="text-xs"
                      >
                        {getRoleLabel(role)}
                      </Badge>
                    ))}
                  </div>
                  
                  {/* Tipo de Login */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                      <Shield className="h-3 w-3" />
                      <span>
                        {accessToken === 'demo-token-123' ? 'Modo Demo' : 'Azure AD'}
                      </span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {moduleInfo.name}
                    </Badge>
                  </div>
                </div>
              </DropdownMenuLabel>
              
              <DropdownMenuSeparator />
              
              <DropdownMenuItem onClick={() => navigate('/modules')} className="cursor-pointer">
                <Grid3X3 className="mr-2 h-4 w-4" />
                <span>Trocar Módulo</span>
              </DropdownMenuItem>
              
              <DropdownMenuItem onClick={() => navigate('/profile')} className="cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                <span>Perfil</span>
              </DropdownMenuItem>
              
              <DropdownMenuItem onClick={() => navigate('/settings')} className="cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                <span>Configurações</span>
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              
              <DropdownMenuItem 
                onClick={handleLogout} 
                className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
                disabled={isLoggingOut}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>{isLoggingOut ? 'Saindo...' : 'Sair'}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;
