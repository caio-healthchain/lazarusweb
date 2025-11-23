import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useMsal } from '@azure/msal-react';
import { loginRequest } from '@/config/auth';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Loader2, 
  Shield, 
  Hospital, 
  Sparkles, 
  Brain,
  BarChart3,
  Users,
  Lock,
  Mail,
  Building,
  Phone,
  CheckCircle,
  ArrowRight,
  Send
} from 'lucide-react';
import { toast } from 'sonner';

const Login = () => {
  const { instance } = useMsal();
  const { isAuthenticated, isLoading, setLoading, setAuthenticated, setUser, setAccessToken, loginDemo } = useAuthStore();
  const [error, setError] = useState<string | null>(null);
  const [showAccessForm, setShowAccessForm] = useState(false);
  const [accessFormData, setAccessFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    role: '',
    reason: ''
  });
  const [accessFormSubmitted, setAccessFormSubmitted] = useState(false);

  // Redirecionar se já autenticado
  if (isAuthenticated) {
    return <Navigate to="/select-hospital" replace />;
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
        
        // Redirecionar para seleção de hospital
        window.location.href = '/select-hospital';
      }
    } catch (error: any) {
      console.error('Erro no login Azure AD:', error);
      setError('Erro ao fazer login com Azure AD. Tente novamente.');
      toast.error('Erro no login Azure AD');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    // Por enquanto, acesso direto (conforme solicitado)
    setLoading(true);
    
    try {
      await loginDemo();
      toast.success('Login demo realizado com sucesso!');
    } catch (error) {
      console.error('Erro ao gerar token:', error);
      toast.error('Erro ao fazer login demo');
    } finally {
      setLoading(false);
    }
  };

  const handleAccessFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simular envio do formulário
    setTimeout(() => {
      setAccessFormSubmitted(true);
      toast.success('Solicitação enviada com sucesso!');
      
      // Reset form after 3 seconds
      setTimeout(() => {
        setShowAccessForm(false);
        setAccessFormSubmitted(false);
        setAccessFormData({
          name: '',
          email: '',
          company: '',
          phone: '',
          role: '',
          reason: ''
        });
      }, 3000);
    }, 1000);
  };

  const features = [
    {
      icon: BarChart3,
      title: 'Dashboard Executivo',
      description: 'Métricas e KPIs em tempo real'
    },
    {
      icon: Brain,
      title: 'IA Especializada',
      description: 'Assistente inteligente para gestão'
    },
    {
      icon: Users,
      title: 'Gestão Integrada',
      description: 'Controle completo de operações'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 min-h-screen flex">
        {/* Left Side - Branding */}
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-center px-12">
          <div className="max-w-lg">
            {/* Logo */}
            <div className="flex items-center space-x-3 mb-8">
              <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-2xl">
                <Hospital className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">HealthChain</h1>
                <p className="text-blue-200">Solutions</p>
              </div>
            </div>

            {/* Headline */}
            <h2 className="text-4xl font-bold text-white mb-6 leading-tight">
              Plataforma Inteligente de
              <span className="bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent"> Gestão Hospitalar</span>
            </h2>

            <p className="text-xl text-blue-100 mb-12 leading-relaxed">
              Transforme a gestão do seu hospital com inteligência artificial, 
              analytics avançados e automação de processos.
            </p>

            {/* Features */}
            <div className="space-y-6">
              {features.map((feature, index) => {
                const IconComponent = feature.icon;
                return (
                  <div key={index} className="flex items-center space-x-4">
                    <div className="flex items-center justify-center w-12 h-12 bg-white/10 rounded-xl backdrop-blur-sm">
                      <IconComponent className="h-6 w-6 text-blue-300" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">{feature.title}</h3>
                      <p className="text-blue-200 text-sm">{feature.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            {/* Mobile Logo */}
            <div className="lg:hidden text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-2xl mb-4">
                <Hospital className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">HealthChain Solutions</h1>
              <p className="text-blue-200">Gestão Hospitalar Inteligente</p>
            </div>

            {/* Login Card */}
            <Card className="backdrop-blur-xl bg-white/10 border-white/20 shadow-2xl">
              <CardHeader className="text-center pb-6">
                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl mx-auto mb-4">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-white">
                  Acesso Seguro
                </CardTitle>
                <CardDescription className="text-blue-100">
                  Entre na plataforma para continuar
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {error && (
                  <Alert variant="destructive" className="bg-red-500/10 border-red-500/20">
                    <AlertDescription className="text-red-200">{error}</AlertDescription>
                  </Alert>
                )}

                {/* Azure AD Login */}
                <Button
                  onClick={handleAzureLogin}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white border-0 h-12 text-base font-medium"
                  size="lg"
                >
                  {isLoading ? (
                    <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                  ) : (
                    <Shield className="mr-3 h-5 w-5" />
                  )}
                  Entrar com Azure AD
                </Button>

                {/* Divider */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-white/20" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-transparent px-3 text-blue-200 font-medium">ou</span>
                  </div>
                </div>

                {/* Demo Access */}
                <Button
                  onClick={handleDemoLogin}
                  disabled={isLoading}
                  variant="outline"
                  className="w-full bg-white/5 border-white/20 text-white hover:bg-white/10 hover:border-white/30 h-12 text-base font-medium"
                  size="lg"
                >
                  {isLoading ? (
                    <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                  ) : (
                    <Sparkles className="mr-3 h-5 w-5" />
                  )}
                  Acesso Demo
                </Button>

                {/* Request Access (Disabled for now) */}
                <Dialog open={showAccessForm} onOpenChange={setShowAccessForm}>
                  <DialogTrigger asChild>
                    <Button
                      variant="ghost"
                      className="w-full text-blue-200 hover:text-white hover:bg-white/5 h-10 text-sm"
                      disabled // Desabilitado conforme solicitado
                    >
                      <Lock className="mr-2 h-4 w-4" />
                      Solicitar Acesso (Em breve)
                    </Button>
                  </DialogTrigger>
                  
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle className="flex items-center">
                        <Mail className="mr-2 h-5 w-5 text-blue-600" />
                        Solicitar Acesso Demo
                      </DialogTitle>
                      <DialogDescription>
                        Preencha os dados abaixo para solicitar acesso à plataforma
                      </DialogDescription>
                    </DialogHeader>

                    {!accessFormSubmitted ? (
                      <form onSubmit={handleAccessFormSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="name">Nome Completo</Label>
                            <Input
                              id="name"
                              value={accessFormData.name}
                              onChange={(e) => setAccessFormData(prev => ({ ...prev, name: e.target.value }))}
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="email">E-mail</Label>
                            <Input
                              id="email"
                              type="email"
                              value={accessFormData.email}
                              onChange={(e) => setAccessFormData(prev => ({ ...prev, email: e.target.value }))}
                              required
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="company">Hospital/Instituição</Label>
                            <Input
                              id="company"
                              value={accessFormData.company}
                              onChange={(e) => setAccessFormData(prev => ({ ...prev, company: e.target.value }))}
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="phone">Telefone</Label>
                            <Input
                              id="phone"
                              value={accessFormData.phone}
                              onChange={(e) => setAccessFormData(prev => ({ ...prev, phone: e.target.value }))}
                              required
                            />
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="role">Cargo/Função</Label>
                          <Input
                            id="role"
                            value={accessFormData.role}
                            onChange={(e) => setAccessFormData(prev => ({ ...prev, role: e.target.value }))}
                            placeholder="Ex: Diretor Médico, Gerente de TI..."
                            required
                          />
                        </div>

                        <div>
                          <Label htmlFor="reason">Motivo da solicitação</Label>
                          <Textarea
                            id="reason"
                            value={accessFormData.reason}
                            onChange={(e) => setAccessFormData(prev => ({ ...prev, reason: e.target.value }))}
                            placeholder="Descreva brevemente como pretende usar a plataforma..."
                            rows={3}
                            required
                          />
                        </div>

                        <Button type="submit" className="w-full">
                          <Send className="mr-2 h-4 w-4" />
                          Enviar Solicitação
                        </Button>
                      </form>
                    ) : (
                      <div className="text-center py-6">
                        <CheckCircle className="h-16 w-16 text-emerald-500 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          Solicitação Enviada!
                        </h3>
                        <p className="text-gray-600">
                          Entraremos em contato em até 24 horas úteis.
                        </p>
                      </div>
                    )}
                  </DialogContent>
                </Dialog>

                <p className="text-xs text-center text-blue-200/80 leading-relaxed">
                  Plataforma segura com criptografia de ponta a ponta
                  <br />
                  Dados protegidos conforme LGPD
                </p>
              </CardContent>
            </Card>

            {/* Footer */}
            <div className="text-center mt-8 text-sm text-blue-200/60">
              © 2024 HealthChain Solutions
              <br />
              Tecnologia • Inovação • Resultados
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
