import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Hospital, 
  ArrowRight, 
  Shield,
  Building2,
  Loader2,
  LogOut,
  Activity
} from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';
import { API_CONFIG } from '@/config/auth';

interface Profile {
  id: string;
  code: string;
  name: string;
  description: string;
}

interface HospitalWithProfiles {
  id: string;
  code: string;
  name: string;
  subdomain: string;
  customDomain?: string;
  logoUrl?: string;
  primaryColor?: string;
  profiles: Profile[];
}

const HospitalSelection = () => {
  const navigate = useNavigate();
  const { user, accessToken, logout } = useAuthStore();
  const [hospitals, setHospitals] = useState<HospitalWithProfiles[]>([]);
  const [loading, setLoading] = useState(true);
  const [selecting, setSelecting] = useState<string | null>(null);

  useEffect(() => {
    loadHospitals();
  }, []);

  const loadHospitals = async () => {
    try {
      setLoading(true);

      const response = await axios.get(`${API_CONFIG.baseUrl}/users/users/me/hospitals`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      setHospitals(response.data);
    } catch (error: any) {
      console.error('Erro ao carregar hospitais:', error);
      toast.error('Erro ao carregar hospitais disponíveis');
      
      // Se erro de autenticação, fazer logout
      if (error.response?.status === 401) {
        logout();
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  // Função para obter ícone e cor baseado no código do hospital
  const getHospitalIcon = (code: string) => {
    const icons: Record<string, { icon: React.ReactNode; color: string }> = {
      h9j: {
        icon: <Activity className="h-8 w-8 text-white" />,
        color: '#3B82F6', // Azul
      },
      hsl: {
        icon: <Hospital className="h-8 w-8 text-white" />,
        color: '#10B981', // Verde
      },
      demo: {
        icon: <Shield className="h-8 w-8 text-white" />,
        color: '#8B5CF6', // Roxo
      },
    };

    return icons[code] || { icon: <Hospital className="h-8 w-8 text-white" />, color: '#3B82F6' };
  };

  const handleSelectHospital = async (hospital: HospitalWithProfiles) => {
    try {
      setSelecting(hospital.id);

      const response = await axios.post(
        `${API_CONFIG.baseUrl}/users/users/auth/select-hospital`,
        { hospitalId: hospital.id },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const { redirectUrl, accessToken: newToken } = response.data;

      // Atualizar token no store
      useAuthStore.getState().setAccessToken(newToken);

      toast.success(`Acessando ${hospital.name}...`);

      // Redirecionar para o subdomain do hospital
      if (hospital.customDomain) {
        window.location.href = redirectUrl;
      } else {
        // Se não tem domínio customizado, usar subdomain
        window.location.href = `https://${hospital.subdomain}.healthchainsolutions.com.br/modules`;
      }
    } catch (error: any) {
      console.error('Erro ao selecionar hospital:', error);
      toast.error('Erro ao acessar hospital');
      setSelecting(null);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    toast.success('Logout realizado com sucesso');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-white animate-spin mx-auto mb-4" />
          <p className="text-white text-lg">Carregando hospitais...</p>
        </div>
      </div>
    );
  }

  if (hospitals.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center p-6">
        <Card className="max-w-md w-full backdrop-blur-xl bg-white/10 border-white/20">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center w-16 h-16 bg-red-500/20 rounded-full mx-auto mb-4">
              <Building2 className="h-8 w-8 text-red-300" />
            </div>
            <CardTitle className="text-2xl text-white">Sem Acesso</CardTitle>
            <CardDescription className="text-blue-100">
              Você não possui acesso a nenhum hospital no momento.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-blue-200 text-sm text-center mb-6">
              Entre em contato com o administrador do sistema para solicitar acesso.
            </p>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="w-full bg-white/5 border-white/20 text-white hover:bg-white/10"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Fazer Logout
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <div className="bg-white/5 backdrop-blur-sm border-b border-white/10 px-6 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-lg">
                <Hospital className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-white">Lazarus</h1>
                <p className="text-xs text-blue-200">HealthChain Solutions</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-white">{user?.name}</p>
                <p className="text-xs text-blue-200">{user?.email}</p>
              </div>
              <Button
                onClick={handleLogout}
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/10"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="max-w-6xl w-full">
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-full mb-6">
                <Shield className="h-10 w-10 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-white mb-4">
                Selecione o Hospital
              </h1>
              <p className="text-xl text-blue-100 max-w-2xl mx-auto">
                Escolha o hospital que deseja acessar para continuar
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {hospitals.map((hospital) => (
                <Card
                  key={hospital.id}
                  className="backdrop-blur-xl bg-white/10 border-white/20 hover:bg-white/15 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl cursor-pointer"
                  onClick={() => !selecting && handleSelectHospital(hospital)}
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between mb-4">
                      <div
                        className="flex items-center justify-center w-16 h-16 rounded-xl"
                        style={{
                          backgroundColor: hospital.logoUrl 
                            ? (hospital.primaryColor || '#3B82F6')
                            : getHospitalIcon(hospital.code).color,
                          opacity: 0.9,
                        }}
                      >
                        {hospital.logoUrl ? (
                          <img
                            src={hospital.logoUrl}
                            alt={hospital.name}
                            className="w-12 h-12 object-contain"
                          />
                        ) : (
                          getHospitalIcon(hospital.code).icon
                        )}
                      </div>
                      <Badge className="bg-emerald-500/20 text-emerald-200 border-emerald-500/30">
                        Ativo
                      </Badge>
                    </div>

                    <CardTitle className="text-xl font-bold text-white mb-2">
                      {hospital.name}
                    </CardTitle>
                    <CardDescription className="text-blue-100">
                      {hospital.profiles.length} perfil(is) disponível(is)
                    </CardDescription>
                  </CardHeader>

                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex flex-wrap gap-2">
                        {hospital.profiles.map((profile) => (
                          <Badge
                            key={profile.id}
                            variant="outline"
                            className="bg-blue-500/10 text-blue-200 border-blue-500/30"
                          >
                            {profile.name}
                          </Badge>
                        ))}
                      </div>

                      <Button
                        disabled={selecting !== null}
                        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white border-0"
                      >
                        {selecting === hospital.id ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Acessando...
                          </>
                        ) : (
                          <>
                            Acessar
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-white/5 backdrop-blur-sm border-t border-white/10 px-6 py-4">
          <div className="max-w-7xl mx-auto text-center">
            <p className="text-sm text-blue-200">
              © 2024 HealthChain Solutions • Plataforma Segura com Azure AD SSO
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HospitalSelection;
