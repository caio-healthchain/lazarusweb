import { Building2, CheckCircle2, Mail, Shield, UserRound } from 'lucide-react';
import UserAvatar from '@/components/auth/UserAvatar';
import RoleBadge from '@/components/auth/RoleBadge';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useAuthStore } from '@/store/authStore';
import { PROFILE_LABELS, useRBACStore } from '@/store/rbacStore';

const Perfil = () => {
  const { user, selectedHospital, selectedProfiles, hospitals, tokenContext } = useAuthStore();
  const { currentProfile, getAllowedModules } = useRBACStore();

  const profiles = selectedProfiles.length ? selectedProfiles : hospitals.map((entry) => entry.profile).filter(Boolean);
  const allowedModules = getAllowedModules();

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col gap-4 rounded-2xl bg-gradient-to-r from-slate-950 via-purple-950 to-indigo-950 p-8 text-white shadow-sm md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <UserAvatar name={user?.name} avatar={user?.avatar} className="h-16 w-16" />
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-purple-200">Perfil do usuário</p>
              <h1 className="text-3xl font-bold">{user?.name || 'Usuário autenticado'}</h1>
              <p className="mt-1 text-purple-100">Sessão IAM ativa no Lazarus</p>
            </div>
          </div>
          <RoleBadge role={currentProfile} label={PROFILE_LABELS[currentProfile]} className="w-fit bg-white/10 text-white border-white/20" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserRound className="h-5 w-5 text-purple-700" />
                Dados da sessão
              </CardTitle>
              <CardDescription>Informações reidratadas do `ms-users` e do contexto hospitalar selecionado.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-lg border p-4 bg-white">
                  <p className="text-xs uppercase text-muted-foreground mb-1">Nome</p>
                  <p className="font-medium text-slate-900">{user?.name || 'Não informado'}</p>
                </div>
                <div className="rounded-lg border p-4 bg-white">
                  <p className="text-xs uppercase text-muted-foreground mb-1">E-mail</p>
                  <p className="font-medium text-slate-900 flex items-center gap-2">
                    <Mail className="h-4 w-4 text-slate-500" />
                    {user?.email || 'Não informado'}
                  </p>
                </div>
                <div className="rounded-lg border p-4 bg-white md:col-span-2">
                  <p className="text-xs uppercase text-muted-foreground mb-1">Hospital ativo</p>
                  <p className="font-medium text-slate-900 flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-slate-500" />
                    {selectedHospital?.name || 'Hospital ainda não selecionado'}
                  </p>
                  {selectedHospital?.code && <p className="text-sm text-muted-foreground mt-1">Código: {selectedHospital.code}</p>}
                </div>
              </div>

              <Separator />

              <div>
                <h2 className="text-sm font-semibold text-slate-900 mb-3">Papéis e perfis vinculados</h2>
                <div className="flex flex-wrap gap-2">
                  {profiles.length ? profiles.map((profile) => (
                    <RoleBadge key={profile.id || profile.code} role={profile.code} label={profile.name || profile.code} />
                  )) : (
                    <Badge variant="outline">Nenhum papel retornado</Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-purple-700" />
                Acessos autorizados
              </CardTitle>
              <CardDescription>Módulos liberados pelo perfil funcional selecionado.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {allowedModules.map((module) => (
                  <div key={module} className="flex items-center gap-3 rounded-lg border bg-white p-3">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    <span className="text-sm font-medium capitalize">{module.replace(/-/g, ' ')}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Contexto técnico do token</CardTitle>
            <CardDescription>Resumo não sensível do contexto usado para autorização no frontend.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="rounded-lg border bg-white p-4">
                <p className="text-xs uppercase text-muted-foreground">Usuário</p>
                <p className="mt-1 font-mono text-xs break-all">{user?.id || String(tokenContext?.sub || 'n/a')}</p>
              </div>
              <div className="rounded-lg border bg-white p-4">
                <p className="text-xs uppercase text-muted-foreground">Hospital</p>
                <p className="mt-1 font-mono text-xs break-all">{selectedHospital?.id || String(tokenContext?.hospitalId || 'n/a')}</p>
              </div>
              <div className="rounded-lg border bg-white p-4">
                <p className="text-xs uppercase text-muted-foreground">Perfil funcional</p>
                <p className="mt-1 font-mono text-xs">{currentProfile}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Perfil;
