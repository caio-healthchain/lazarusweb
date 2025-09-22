import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useMsal } from '@azure/msal-react';
import { loginRequest } from '@/config/auth';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Shield, Hospital, Info } from 'lucide-react';
import { toast } from 'sonner';

const Login = () => {
  const { instance } = useMsal();
  const { isAuthenticated, isLoading, setLoading, setAuthenticated, setUser, setAccessToken, loginDemo } = useAuthStore();
  const [error, setError] = useState<string | null>(null);

  // Redirecionar se já autenticado
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleAzureLogin = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await instance.loginPopup(loginRequest);
      
      if (response.account) {
        // Extrair informações do usuário
        const user = {
          id: response.account.homeAccountId,
          name: response.account.name || 'Usuário',
          email: response.account.username,
          roles: ['auditor'], // Roles viriam do token ou API
          avatar: undefined,
        };

        setUser(user);
        setAccessToken(response.accessToken);
        setAuthenticated(true);
        
        toast.success(`Bem-vindo, ${user.name}!`);
      }
    } catch (error: any) {
      console.error('Erro no login Azure AD:', error);
      setError('Erro ao fazer login com Azure AD. Tente novamente.');
      toast.error('Erro no login Azure AD');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = () => {
    setLoading(true);
    
    // Simular delay de autenticação
    setTimeout(() => {
      loginDemo();
      toast.success('Login demo realizado com sucesso!');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo e Título */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
            <Hospital className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Sistema de Auditoria
          </h1>
          <p className="text-gray-600">
            Enquadramento de Porte Cirúrgico
          </p>
        </div>

        {/* Card de Login */}
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <Shield className="h-5 w-5" />
              Fazer Login
            </CardTitle>
            <CardDescription>
              Acesse sua conta para continuar
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Login Azure AD */}
            <Button
              onClick={handleAzureLogin}
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700"
              size="lg"
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Shield className="mr-2 h-4 w-4" />
              )}
              Entrar com Azure AD
            </Button>

            {/* Divisor */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">ou</span>
              </div>
            </div>

            {/* Login Demo */}
            <Button
              onClick={handleDemoLogin}
              disabled={isLoading}
              variant="outline"
              className="w-full"
              size="lg"
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Info className="mr-2 h-4 w-4" />
              )}
              Acesso Demo (Desenvolvimento)
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              Use o modo demo para testar a aplicação sem Azure AD
            </p>
          </CardContent>
        </Card>

        {/* Informações de Configuração */}
        <Card className="mt-6 bg-blue-50 border-blue-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-blue-800">
              Configuração Azure AD
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 space-y-2 text-xs text-blue-700">
            <div>
              <strong>Client ID:</strong> {import.meta.env.VITE_AZURE_CLIENT_ID || 'Não configurado'}
            </div>
            <div>
              <strong>Tenant:</strong> {import.meta.env.VITE_AZURE_AUTHORITY ? 'Configurado' : 'Não configurado'}
            </div>
            <div>
              <strong>API Base:</strong> {import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api/v1'}
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500">
          © 2024 Sistema de Auditoria Hospitalar
          <br />
          Integração com Microsserviços
        </div>
      </div>
    </div>
  );
};

export default Login;
