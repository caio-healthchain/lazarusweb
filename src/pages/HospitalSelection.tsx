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

// DADOS MOCKADOS PARA DEMO
const MOCK_HOSPITALS: HospitalWithProfiles[] = [
  {
    id: 'hospital-sagrada-familia',
    code: 'hsf',
    name: 'Hospital Sagrada Familia',
    subdomain: 'sagrada-familia',
    customDomain: 'lazarus.healthchainsolutions.com.br',
    logoUrl: 'https://via.placeholder.com/200x100?text=Sagrada+Familia',
    primaryColor: '#10B981',
    profiles: [
      { id: 'profile-auditor', code: 'auditor', name: 'Auditor', description: 'Auditoria de guias' },
      { id: 'profile-analista', code: 'analista', name: 'Analista', description: 'Analise de documentacao' },
      { id: 'profile-gerencial', code: 'gerencial', name: 'Gerencial', description: 'Dashboard executivo' },
    ],
  },
];

const HospitalSelection = () => {
  const navigate = useNavigate();
  const { user, accessToken, logout } = useAuthStore();
  const [hospitals, setHospitals] = useState<HospitalWithProfiles[]>(MOCK_HOSPITALS);
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
      
      // FALLBACK PARA DEMO: Se falhar, usar dados mockados
      console.log('Demo Mode: Usando dados mockados de hospitais');
      setHospitals(MOCK_HOSPITALS);
      
      // Se erro de autenticacao, fazer logout
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
      hsf: {
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

      // Temporariamente, redirecionar todos para a mesma URL
      // TODO: Implementar subdomínios quando os hospitais estiverem configurados
      window.location.href = '/central-contas';
    } catch (error: any) {
      console.error('Erro ao selecionar hospital:', error);
      
      // FALLBACK PARA DEMO: Se falhar, redirecionar mesmo assim
      console.log('Demo Mode: Redirecionando mesmo com erro');
      toast.success(`Acessando ${hospital.name}...`);
      setTimeout(() => {
        window.location.href = '/central-contas';
      }, 1000);
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Selecione um Hospital</h1>
            <p className="text-blue-200">Escolha o hospital para acessar a plataforma</p>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="bg-white/5 border-white/20 text-white hover:bg-white/10"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>

        {/* Hospitals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hospitals.map((hospital) => {
            const { icon, color } = getHospitalIcon(hospital.code);
            return (
              <Card
                key={hospital.id}
                className="backdrop-blur-xl bg-white/10 border-white/20 hover:border-white/40 transition-all cursor-pointer overflow-hidden group"
              >
                <CardHeader>
                  <div
                    className="w-16 h-16 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"
                    style={{ backgroundColor: color + '20', borderColor: color, borderWidth: '2px' }}
                  >
                    {icon}
                  </div>
                  <CardTitle className="text-xl text-white">{hospital.name}</CardTitle>
                  <CardDescription className="text-blue-200">
                    {hospital.profiles.length} módulos disponíveis
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Perfis */}
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-blue-300 uppercase">Módulos</p>
                    <div className="flex flex-wrap gap-2">
                      {hospital.profiles.map((profile) => (
                        <Badge
                          key={profile.id}
                          variant="outline"
                          className="bg-white/10 border-white/20 text-blue-200 hover:bg-white/20"
                        >
                          {profile.name}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Botão de Acesso */}
                  <Button
                    onClick={() => handleSelectHospital(hospital)}
                    disabled={selecting === hospital.id}
                    className="w-full bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white mt-4"
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
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default HospitalSelection;
