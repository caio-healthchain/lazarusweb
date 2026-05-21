import { ReactNode, useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthHospital, AuthProfile, HospitalAccess, useAuthStore } from '@/store/authStore';
import { useRBACStore, UserProfile } from '@/store/rbacStore';
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
  Activity,
} from 'lucide-react';
import { toast } from 'sonner';

interface HospitalWithProfiles extends AuthHospital {
  profiles: AuthProfile[];
}

const SUPPORTED_PROFILES: UserProfile[] = ['diretor', 'medico', 'enfermeiro', 'analista', 'auditor', 'gerencial', 'admin'];

const toRbacProfile = (profiles: AuthProfile[]): UserProfile => {
  const codes = profiles.map((profile) => profile.code?.toLowerCase()).filter(Boolean);
  const supported = codes.find((code): code is UserProfile => SUPPORTED_PROFILES.includes(code as UserProfile));
  return supported || 'auditor';
};

const groupHospitals = (entries: HospitalAccess[]): HospitalWithProfiles[] => {
  const grouped = new Map<string, HospitalWithProfiles>();

  entries.forEach((entry) => {
    if (!entry?.hospital?.id) return;

    const current = grouped.get(entry.hospital.id) || { ...entry.hospital, profiles: [] };
    const alreadyIncluded = current.profiles.some((profile) => profile.id === entry.profile?.id);

    if (entry.profile && !alreadyIncluded) {
      current.profiles.push(entry.profile);
    }

    grouped.set(entry.hospital.id, current);
  });

  return Array.from(grouped.values());
};

const HospitalSelection = () => {
  const navigate = useNavigate();
  const {
    user,
    hospitals: hospitalAccesses,
    loadAuthenticatedUser,
    selectHospital,
    logout,
  } = useAuthStore();
  const { setProfile, getDefaultRoute } = useRBACStore();
  const [loading, setLoading] = useState(true);
  const [selecting, setSelecting] = useState<string | null>(null);

  useEffect(() => {
    const loadHospitals = async () => {
      try {
        setLoading(true);
        await loadAuthenticatedUser();
      } catch (error: any) {
        console.error('Erro ao carregar hospitais:', error);
        toast.error(error?.response?.data?.message || 'Não foi possível carregar seus hospitais. Faça login novamente.');
        await logout({ remote: false });
        navigate('/login', { replace: true });
      } finally {
        setLoading(false);
      }
    };

    loadHospitals();
  }, [loadAuthenticatedUser, logout, navigate]);

  const hospitals = useMemo(() => groupHospitals(hospitalAccesses), [hospitalAccesses]);

  const getHospitalIcon = (code: string) => {
    const icons: Record<string, { icon: ReactNode; color: string }> = {
      h9j: {
        icon: <Activity className="h-8 w-8 text-white" />,
        color: '#3B82F6',
      },
      hsl: {
        icon: <Hospital className="h-8 w-8 text-white" />,
        color: '#10B981',
      },
      hsf: {
        icon: <Hospital className="h-8 w-8 text-white" />,
        color: '#10B981',
      },
    };

    return icons[code] || { icon: <Hospital className="h-8 w-8 text-white" />, color: '#3B82F6' };
  };

  const handleSelectHospital = async (hospital: HospitalWithProfiles) => {
    try {
      setSelecting(hospital.id);

      const response = await selectHospital(hospital.id);
      const selectedProfiles = response.profiles?.length ? response.profiles : hospital.profiles;
      const rbacProfile = toRbacProfile(selectedProfiles);

      setProfile(rbacProfile);
      toast.success(`Acessando ${response.hospital?.name || hospital.name}...`);
      navigate(getDefaultRoute(), { replace: true });
    } catch (error: any) {
      console.error('Erro ao selecionar hospital:', error);
      toast.error(error?.response?.data?.message || 'Você não possui acesso ativo a este hospital.');
    } finally {
      setSelecting(null);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
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
              Você não possui acesso ativo a nenhum hospital no momento.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-blue-200 text-sm text-center mb-6">
              Entre em contato com o administrador do sistema para solicitar vínculo a um hospital e perfil funcional.
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
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Selecione um Hospital</h1>
            <p className="text-blue-200">
              {user?.name ? `${user.name}, escolha o hospital para acessar a plataforma` : 'Escolha o hospital para acessar a plataforma'}
            </p>
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
                    style={{ backgroundColor: `${color}20`, borderColor: color, borderWidth: '2px' }}
                  >
                    {icon}
                  </div>
                  <CardTitle className="text-xl text-white">{hospital.name}</CardTitle>
                  <CardDescription className="text-blue-200">
                    {hospital.profiles.length} módulo{hospital.profiles.length === 1 ? '' : 's'} disponível{hospital.profiles.length === 1 ? '' : 'is'}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
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
