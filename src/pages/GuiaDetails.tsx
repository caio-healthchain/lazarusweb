import { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { guideService, GuiaProcedure } from '@/services/api';
import { getAuditSessionName } from '@/lib/utils';
import { toast } from 'sonner';
import { ArrowLeft, CheckCircle, XCircle, Clock, Loader2, DollarSign, ClipboardList } from 'lucide-react';

const GuiaDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation() as { state?: { tipoGuia?: string } };
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'all'|'pending'|'approved'|'rejected'>('all');

  const numeroGuiaPrestador = id || '';

  const { data, isLoading, error } = useQuery({
    queryKey: ['guia', numeroGuiaPrestador, 'procedures'],
    queryFn: () => guideService.getProcedures(numeroGuiaPrestador),
    enabled: Boolean(numeroGuiaPrestador),
    // Mapeia formas comuns de resposta: array direto, { data: [] } ou { result: [] }
    select: (res) => {
      const body: any = res.data;
      if (Array.isArray(body)) return body;
      if (Array.isArray(body?.data)) return body.data;
      if (Array.isArray(body?.result)) return body.result;
      return [];
    },
    retry: 1,
  });

  const procedimentos = Array.isArray(data) ? (data as GuiaProcedure[]) : [];
  const sessionName = getAuditSessionName(location.state?.tipoGuia);

  const totals = useMemo(() => {
    const sum = procedimentos.reduce((acc, p) => acc + (p.valorTotal ? Number(p.valorTotal) : 0), 0);
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(sum);
  }, [procedimentos]);

  const counts = useMemo(() => ({
    all: procedimentos.length,
    pending: procedimentos.filter(p => (p.status || 'PENDING').toUpperCase() === 'PENDING').length,
    approved: procedimentos.filter(p => (p.status || '').toUpperCase() === 'APPROVED').length,
    rejected: procedimentos.filter(p => (p.status || '').toUpperCase() === 'REJECTED').length,
  }), [procedimentos]);

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: 'PENDING'|'APPROVED'|'REJECTED' }) =>
      guideService.updateProcedureStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['guia', numeroGuiaPrestador, 'procedures'] });
      toast.success('Status do procedimento atualizado.');
    },
    onError: () => {
      toast.error('Não foi possível atualizar o status.');
    }
  });

  const handleApprove = (procId: string) => updateStatusMutation.mutate({ id: procId, status: 'APPROVED' });
  const handleReject = (procId: string) => updateStatusMutation.mutate({ id: procId, status: 'REJECTED' });
  const handleReset = (procId: string) => updateStatusMutation.mutate({ id: procId, status: 'PENDING' });

  useEffect(() => {
    if (!numeroGuiaPrestador) {
      navigate('/audits');
    }
  }, [numeroGuiaPrestador, navigate]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-primary-foreground p-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate('/audits')} className="text-primary-foreground hover:bg-primary-foreground/10">
              <ArrowLeft className="h-4 w-4 mr-2" /> Voltar
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Guia - Procedimentos</h1>
              <p className="text-primary-foreground/80">Sessão: {sessionName}</p>
            </div>
          </div>
          <Badge variant="secondary">{procedimentos.length} procedimento(s)</Badge>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6 space-y-6">
        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total de Procedimentos</p>
                <p className="text-3xl font-bold">{procedimentos.length}</p>
              </div>
              <ClipboardList className="h-8 w-8 text-blue-600" />
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-emerald-500">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Valor Total</p>
                <p className="text-3xl font-bold">{totals}</p>
              </div>
              <DollarSign className="h-8 w-8 text-emerald-600" />
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-yellow-500">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pendentes</p>
                <p className="text-3xl font-bold">{counts.pending}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </CardContent>
          </Card>
        </div>

        {/* Tabs de status */}
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full">
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="all">Todos <Badge variant="secondary" className="ml-2">{counts.all}</Badge></TabsTrigger>
            <TabsTrigger value="pending">Pendentes <Badge variant="secondary" className="ml-2">{counts.pending}</Badge></TabsTrigger>
            <TabsTrigger value="approved">Aprovados <Badge variant="secondary" className="ml-2">{counts.approved}</Badge></TabsTrigger>
            <TabsTrigger value="rejected">Rejeitados <Badge variant="secondary" className="ml-2">{counts.rejected}</Badge></TabsTrigger>
          </TabsList>

          {(['all','pending','approved','rejected'] as const).map(tab => {
            const list = procedimentos.filter(p => {
              if (tab === 'all') return true;
              const st = (p.status || 'PENDING').toUpperCase();
              return st === tab.toUpperCase();
            });
            return (
              <TabsContent key={tab} value={tab} className="space-y-3 mt-4">
                {isLoading && (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin mr-2" />
                    <span>Carregando procedimentos...</span>
                  </div>
                )}
                {error && <div className="text-red-600">Erro ao carregar procedimentos</div>}
                {!isLoading && list.length === 0 && (
                  <Card><CardContent className="p-6 text-muted-foreground">Nenhum procedimento neste filtro.</CardContent></Card>
                )}
                {list.map(proc => {
                  const st = (proc.status || 'PENDING').toUpperCase();
                  const statusBadge = st === 'APPROVED' ? 'bg-green-100 text-green-800' : st === 'REJECTED' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800';
                  return (
                    <Card key={proc.id} className="border-l-4 border-l-gray-300">
                      <CardContent className="p-4 flex items-center justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold truncate">{proc.descricaoProcedimento || proc.codigoProcedimento}</h3>
                            <Badge className={statusBadge}>{st === 'PENDING' ? 'Pendente' : st === 'APPROVED' ? 'Aprovado' : 'Rejeitado'}</Badge>
                          </div>
                          <div className="text-xs text-muted-foreground">Código: {proc.codigoProcedimento}</div>
                        </div>
                        <div className="text-right whitespace-nowrap">
                          <div className="text-sm">Qtd: {proc.quantidadeExecutada ?? '-'}</div>
                          <div className="text-xs text-muted-foreground">Valor: {proc.valorTotal ?? '-'}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => handleApprove(proc.id)} disabled={updateStatusMutation.isPending}>
                            {updateStatusMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : (<><CheckCircle className="h-4 w-4 mr-1" /> Aprovar</>)}
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => handleReject(proc.id)} disabled={updateStatusMutation.isPending}>
                            {updateStatusMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : (<><XCircle className="h-4 w-4 mr-1" /> Rejeitar</>)}
                          </Button>
                          {st !== 'PENDING' && (
                            <Button size="sm" variant="outline" onClick={() => handleReset(proc.id)} disabled={updateStatusMutation.isPending}>
                              Resetar
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </TabsContent>
            );
          })}
        </Tabs>
      </div>
    </div>
  );
};

export default GuiaDetails;
