import { ReactNode } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { UserRole } from '@/config/auth';
import { useAuthStore } from '@/store/authStore';
import { AppModule, PROFILE_LABELS, UserProfile, useRBACStore } from '@/store/rbacStore';

interface RequireRoleProps {
  children: ReactNode;
  roles?: UserRole[];
  profiles?: UserProfile[];
  module?: AppModule;
}

const formatList = (values: string[]) => values.map((value) => value.replace(/-/g, ' ')).join(', ');

const RequireRole = ({ children, roles = [], profiles = [], module }: RequireRoleProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, hasRole } = useAuthStore();
  const { currentProfile, hasAccess, getDefaultRoute } = useRBACStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const roleAllowed = roles.length === 0 || hasRole(roles);
  const profileAllowed = profiles.length === 0 || profiles.includes(currentProfile);
  const moduleAllowed = !module || hasAccess(module);
  const authorized = roleAllowed && profileAllowed && moduleAllowed;

  if (authorized) {
    return <>{children}</>;
  }

  const expected = [
    roles.length ? `Papéis IAM: ${formatList(roles)}` : null,
    profiles.length ? `Perfis funcionais: ${profiles.map((profile) => PROFILE_LABELS[profile]).join(', ')}` : null,
    module ? `Módulo: ${module.replace(/-/g, ' ')}` : null,
  ].filter(Boolean) as string[];

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-slate-50 flex items-center justify-center p-6">
      <Card className="max-w-xl w-full border-amber-200 shadow-sm">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 h-14 w-14 rounded-full bg-amber-100 flex items-center justify-center">
            <ShieldAlert className="h-7 w-7 text-amber-700" />
          </div>
          <CardTitle className="text-2xl text-slate-900">Acesso não autorizado</CardTitle>
          <CardDescription>
            Sua sessão está ativa, mas o perfil selecionado não possui permissão para acessar esta área.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="rounded-lg bg-slate-100 p-4 space-y-2 text-sm">
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">Usuário: {user?.name || 'Sessão ativa'}</Badge>
              <Badge variant="outline">Perfil atual: {PROFILE_LABELS[currentProfile]}</Badge>
            </div>
            {expected.length > 0 && (
              <p className="text-slate-600">
                Permissões esperadas: <strong>{expected.join(' · ')}</strong>.
              </p>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button variant="outline" onClick={() => navigate(-1)}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Button>
            <Button onClick={() => navigate(getDefaultRoute(), { replace: true })}>
              <Home className="mr-2 h-4 w-4" />
              Ir para minha área
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RequireRole;
