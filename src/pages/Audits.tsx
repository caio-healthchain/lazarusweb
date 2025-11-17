import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { guideService, Guide } from '@/services/api';
import { getAuditSessionName } from '@/lib/utils';
import { calcularTMI, formatarTMI, classificarTMI } from '@/lib/tmiUtils';
import { 
  Activity, 
  FileText, 
  Search, 
  ChevronRight, 
  Calendar, 
  User, 
  DollarSign,
  ClipboardList,
  Loader2,
  AlertCircle,
  Clock
} from 'lucide-react';

const Audits = () => {
  const navigate = useNavigate();

  const { data: guiasResponse, isLoading, error } = useQuery({
    queryKey: ['guias'],
    queryFn: () => guideService.getAll(),
    select: (res) => res.data,
    retry: 1,
  });

  // resposta esperada: PaginatedResponse<Guide>
  const guias = (guiasResponse?.data ?? []) as Guide[];
  const totalGuias = guiasResponse?.total ?? guias.length;
  const totalProcedimentos = useMemo(() => {
    return guias.reduce((acc, g) => acc + (g.valorTotalProcedimentos ? Number(g.valorTotalProcedimentos) : 0), 0);
  }, [guias]);

  // UX: estado local para filtro rápido por status e ordenação
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'value'>('date');

  const sessionCounts = useMemo(() => {
    const sessions = guias.map((g) => getAuditSessionName(g.tipoGuia).toLowerCase());
    return {
      inloco: sessions.filter((s) => s === 'inloco').length,
      retrospectiva: sessions.filter((s) => s === 'retrospectiva').length,
      all: guias.length,
    };
  }, [guias]);

  const formatCurrency = (value: number | string | undefined) => {
    if (!value) return 'R$ 0,00';
    const num = typeof value === 'string' ? parseFloat(value) : value;
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(num);
  };

  const getStatusColor = (status?: string) => {
    switch (status?.toLowerCase()) {
      case 'aprovado':
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'pendente':
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejeitado':
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Painel de Auditorias</h1>
            <p className="text-gray-600 mt-1">Gerencie e acompanhe as guias importadas</p>
          </div>
          <Button onClick={() => navigate('/audit/new')} size="lg" className="shadow-md">
            <FileText className="mr-2 h-5 w-5" /> 
            Nova Auditoria
          </Button>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-l-4 border-l-blue-500 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Total de Guias</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {isLoading ? <Loader2 className="h-8 w-8 animate-spin" /> : totalGuias}
                  </p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <ClipboardList className="h-8 w-8 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Valor Total</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {isLoading ? <Loader2 className="h-8 w-8 animate-spin" /> : formatCurrency(totalProcedimentos)}
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <DollarSign className="h-8 w-8 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-orange-500 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">TMI Médio</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {isLoading ? <Loader2 className="h-8 w-8 animate-spin" /> : formatarTMI(useMemo(() => {
                      const tmis = guias
                        .map(g => calcularTMI(g.dataInicioFaturamento, g.dataFinalFaturamento))
                        .filter((tmi): tmi is number => tmi !== null);
                      if (tmis.length === 0) return null;
                      return Math.round(tmis.reduce((acc, tmi) => acc + tmi, 0) / tmis.length);
                    }, [guias]))}
                  </p>
                </div>
                <div className="p-3 bg-orange-100 rounded-full">
                  <Clock className="h-8 w-8 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Status</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : 'Sincronizado'}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Última atualização: agora</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <Activity className="h-8 w-8 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="shadow-sm">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  placeholder="Buscar por número da guia, beneficiário ou carteira..."
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2 items-center">
                <span className="text-sm text-gray-600">Ordenar por</span>
                <Button variant={sortBy === 'date' ? 'default' : 'outline'} size="sm" onClick={() => setSortBy('date')}>Data</Button>
                <Button variant={sortBy === 'value' ? 'default' : 'outline'} size="sm" onClick={() => setSortBy('value')}>Valor</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Error State */}
        {error && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 text-red-800">
                <AlertCircle className="h-5 w-5" />
                <div>
                  <p className="font-medium">Erro ao carregar guias</p>
                  <p className="text-sm text-red-700">Verifique sua conexão ou tente novamente mais tarde.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 gap-4">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="shadow-sm">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <Skeleton className="h-5 w-48" />
                      <Skeleton className="h-3 w-32" />
                    </div>
                    <Skeleton className="h-6 w-6 rounded-full" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Guias agrupadas por sessão */}
        {!isLoading && !error && (
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">Todas <Badge variant="secondary" className="ml-2">{sessionCounts.all}</Badge></TabsTrigger>
              <TabsTrigger value="inloco">Contas Parciais <Badge variant="secondary" className="ml-2">{sessionCounts.inloco}</Badge></TabsTrigger>
              <TabsTrigger value="retrospectiva">Contas Fechadas <Badge variant="secondary" className="ml-2">{sessionCounts.retrospectiva}</Badge></TabsTrigger>
            </TabsList>

            {['all','inloco','retrospectiva'].map((view) => {
              const filteredBase = guias.filter((g) => {
                const session = getAuditSessionName(g.tipoGuia).toLowerCase();
                if (view === 'all') return true;
                if (view === 'inloco') return session === 'inloco';
                return session === 'retrospectiva';
              });

              const filtered = filteredBase
                .filter((g) => {
                  if (statusFilter === 'all') return true;
                  const st = (g.status || '').toLowerCase();
                  return st.includes(statusFilter);
                })
                .sort((a, b) => {
                  if (sortBy === 'date') {
                    const da = a.createdAt ? new Date(a.createdAt).getTime() : 0;
                    const db = b.createdAt ? new Date(b.createdAt).getTime() : 0;
                    return db - da; // desc
                  }
                  const va = a.valorTotalProcedimentos ? Number(a.valorTotalProcedimentos) : 0;
                  const vb = b.valorTotalProcedimentos ? Number(b.valorTotalProcedimentos) : 0;
                  return vb - va; // desc
                });

              return (
                <TabsContent value={view} key={view} className="mt-4">
                  <div className="grid grid-cols-1 gap-4">
                    {filtered.length === 0 ? (
                      <Card className="shadow-sm">
                        <CardContent className="p-12 text-center">
                          <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                          <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma guia encontrada</h3>
                          <p className="text-gray-600 mb-6">Importe um arquivo XML para começar a auditar guias.</p>
                          <Button onClick={() => navigate('/audit/new')}>
                            <FileText className="mr-2 h-4 w-4" />
                            Importar Primeira Guia
                          </Button>
                        </CardContent>
                      </Card>
                    ) : (
                      filtered.map((guia) => (
                        <Card 
                          key={guia.id} 
                          className="shadow-sm hover:shadow-md transition-all cursor-pointer border-l-4 border-l-blue-400"
                          onClick={() => navigate(`/guia/${guia.numeroGuiaPrestador}`, { state: { tipoGuia: guia.tipoGuia } })}
                        >
                          <CardContent className="p-6">
                            <div className="flex items-start justify-between">
                              <div className="flex-1 space-y-3">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-1">
                                      Guia #{guia.numeroGuiaPrestador}
                                    </h3>
                                    <p className="text-xs text-gray-500">Sessão: {getAuditSessionName(guia.tipoGuia)}</p>
                                    {guia.status && (
                                      <Badge className={getStatusColor(guia.status)}>
                                        {guia.status}
                                      </Badge>
                                    )}
                                  </div>
                                  <ChevronRight className="h-6 w-6 text-gray-400" />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
                                  <div className="flex items-center gap-2 text-sm">
                                    <User className="h-4 w-4 text-gray-500" />
                                    <div>
                                      <p className="text-gray-500">Beneficiário</p>
                                      <p className="font-medium text-gray-900">{guia.numeroCarteira || 'Não informado'}</p>
                                    </div>
                                  </div>

                                   <div className="flex items-center gap-2 text-sm">
                                    <div>
                                      <p className="text-gray-500">Diagnóstico</p>
                                      <p className="font-medium text-gray-900">
                                        {guia.diagnostico}
                                      </p>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-2 text-sm">
                                    <DollarSign className="h-4 w-4 text-gray-500" />
                                    <div>
                                      <p className="text-gray-500">Valor Total</p>
                                      <p className="font-medium text-gray-900">
                                        {formatCurrency(guia.valorTotalProcedimentos)}
                                      </p>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-2 text-sm">
                                    <Clock className="h-4 w-4 text-gray-500" />
                                    <div>
                                      <p className="text-gray-500">TMI</p>
                                      <p className="font-medium text-gray-900">
                                        {formatarTMI(calcularTMI(guia.dataInicioFaturamento, guia.dataFinalFaturamento))}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </div>
                </TabsContent>
              );
            })}
          </Tabs>
        )}
      </div>
    </div>
  );
};

export default Audits;
