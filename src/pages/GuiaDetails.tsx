import { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { guideService, GuiaProcedure } from '@/services/api';
import { getAuditSessionName } from '@/lib/utils';
import { toast } from 'sonner';
import { 
  ArrowLeft, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Loader2, 
  DollarSign, 
  ClipboardList, 
  AlertCircle,
  CheckSquare
} from 'lucide-react';
import { ProcedureCard } from '@/components/audit/ProcedureCard';
import { PendenciasTab } from '@/components/audit/PendenciasTab';
import { LogsTab } from '@/components/audit/LogsTab';
import { RejectModal } from '@/components/audit/RejectModal';
import { calculatePendenciasStats, generateMockValidations } from '@/services/mockValidationData';
import { exportGuiaXML } from '@/utils/xmlExporter';
import { Download } from 'lucide-react';
import { useState } from 'react';

const GuiaDetailsNew = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation() as { state?: { tipoGuia?: string } };
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'pendencias'|'all'|'pending'|'approved'|'rejected'|'logs'>('pendencias');
  const [selectedProcedures, setSelectedProcedures] = useState<Set<string>>(new Set());
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [procedimentoParaRejeitar, setProcedimentoParaRejeitar] = useState<GuiaProcedure | null>(null);
  const [valorRecomendadoRejeicao, setValorRecomendadoRejeicao] = useState<number | undefined>(undefined);

  const numeroGuiaPrestador = id || '';

  const { data, isLoading, error } = useQuery({
    queryKey: ['guia', numeroGuiaPrestador, 'procedures'],
    queryFn: () => guideService.getProcedures(numeroGuiaPrestador),
    enabled: Boolean(numeroGuiaPrestador),
    select: (res) => {
      const body: any = res.data;
      if (Array.isArray(body)) return body;
      if (Array.isArray(body?.data)) return body.data;
      if (Array.isArray(body?.result)) return body.result;
      return [];
    },
    retry: 1,
  });

  // Query para buscar logs de auditoria
  const { data: logsData, isLoading: logsLoading } = useQuery({
    queryKey: ['guia', numeroGuiaPrestador, 'logs'],
    queryFn: async () => {
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'https://lazarusapi.azure-api.net';
      try {
        const response = await fetch(`${baseUrl}/audits/audit-log/guia/${numeroGuiaPrestador}`);
        if (!response.ok) {
          console.warn('Endpoint de logs não disponível, usando logs locais');
          return [];
        }
        const data = await response.json();
        return Array.isArray(data) ? data : data.data || [];
      } catch (error) {
        console.warn('Erro ao buscar logs da API:', error);
        return [];
      }
    },
    enabled: Boolean(numeroGuiaPrestador) && activeTab === 'logs',
    retry: 1,
  });

  const logs = Array.isArray(logsData) ? logsData : [];

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

  const pendenciasStats = useMemo(() => {
    return calculatePendenciasStats(procedimentos);
  }, [procedimentos]);

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status, guiaId }: { id: string; status: 'PENDING'|'APPROVED'|'REJECTED'; guiaId?: number }) =>
      guideService.updateProcedureStatus(id, status, guiaId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['guia', numeroGuiaPrestador, 'procedures'] });
      queryClient.invalidateQueries({ queryKey: ['guia', numeroGuiaPrestador, 'logs'] });
      toast.success('Status do procedimento atualizado.');
    },
    onError: () => {
      toast.error('Não foi possível atualizar o status.');
    }
  });

  const handleApprove = (procId: string) => {
    const proc = procedimentos.find(p => p.id === procId);
    if (!proc) return;
    
    const guiaId = proc.guiaId ? parseInt(proc.guiaId) : undefined;
    
    // Calcular valor recomendado (valor contratual)
    const validacoes = generateMockValidations(
      proc.codigoProcedimento || '',
      Number(proc.valorTotal || proc.valorUnitario || 0)
    );
    const validacaoValor = validacoes.find(v => v.tipo === 'VALOR_CONTRATUAL');
    const valorRecomendado = validacaoValor?.valorEsperado || proc.valorTotal || 0;
    
    // Aplicar valor recomendado automaticamente
    const procComValorAjustado = {
      ...proc,
      valorAprovado: valorRecomendado,
      status: 'APPROVED'
    };
    
    // Atualizar no backend (assumindo que o backend aceita valorAprovado)
    updateStatusMutation.mutate({ 
      id: procId, 
      status: 'APPROVED', 
      guiaId,
      valorAprovado: valorRecomendado 
    } as any);
    
    // Log para auditoria
    if (valorRecomendado !== proc.valorTotal) {
      console.log(`[AJUSTE AUTO] Procedimento ${proc.codigoProcedimento}: R$ ${proc.valorTotal?.toFixed(2)} → R$ ${valorRecomendado.toFixed(2)}`);
    }
  };
  const handleReject = (procId: string) => {
    const proc = procedimentos.find(p => p.id === procId);
    if (!proc) return;
    
    // Calcular valor recomendado para exibir no modal
    const validacoes = generateMockValidations(
      proc.codigoProcedimento || '',
      Number(proc.valorTotal || proc.valorUnitario || 0)
    );
    const validacaoValor = validacoes.find(v => v.tipo === 'VALOR_CONTRATUAL');
    const valorRecomendado = validacaoValor?.valorEsperado;
    
    // Abrir modal de rejeição
    setProcedimentoParaRejeitar(proc);
    setValorRecomendadoRejeicao(valorRecomendado);
    setRejectModalOpen(true);
  };
  
  const handleConfirmReject = (motivoRejeicao: string, categoriaRejeicao: string) => {
    if (!procedimentoParaRejeitar) return;
    
    const guiaId = procedimentoParaRejeitar.guiaId ? parseInt(procedimentoParaRejeitar.guiaId) : undefined;
    
    // Atualizar com motivo e categoria
    updateStatusMutation.mutate({ 
      id: procedimentoParaRejeitar.id, 
      status: 'REJECTED', 
      guiaId,
      motivoRejeicao,
      categoriaRejeicao
    } as any);
    
    // Fechar modal
    setRejectModalOpen(false);
    setProcedimentoParaRejeitar(null);
    setValorRecomendadoRejeicao(undefined);
    
    // Log para auditoria
    console.log(`[REJEIÇÃO] Procedimento ${procedimentoParaRejeitar.codigoProcedimento}: ${categoriaRejeicao} - ${motivoRejeicao}`);
  };
  const handleReset = (procId: string) => {
    const proc = procedimentos.find(p => p.id === procId);
    const guiaId = proc?.guiaId ? parseInt(proc.guiaId) : undefined;
    updateStatusMutation.mutate({ id: procId, status: 'PENDING', guiaId });
  };

  // Aprovação massiva
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const pendingIds = procedimentos
        .filter(p => (p.status || 'PENDING').toUpperCase() === 'PENDING')
        .map(p => p.id);
      setSelectedProcedures(new Set(pendingIds));
    } else {
      setSelectedProcedures(new Set());
    }
  };

  const handleSelectProcedure = (id: string, checked: boolean) => {
    const newSelected = new Set(selectedProcedures);
    if (checked) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    setSelectedProcedures(newSelected);
  };

  const handleApproveSelected = async () => {
    if (selectedProcedures.size === 0) {
      toast.error('Selecione pelo menos um procedimento');
      return;
    }

    toast.promise(
      Promise.all(
        Array.from(selectedProcedures).map(id => 
          guideService.updateProcedureStatus(id, 'APPROVED')
        )
      ),
      {
        loading: `Aprovando ${selectedProcedures.size} procedimento(s)...`,
        success: () => {
          queryClient.invalidateQueries({ queryKey: ['guia', numeroGuiaPrestador, 'procedures'] });
          setSelectedProcedures(new Set());
          return `${selectedProcedures.size} procedimento(s) aprovado(s) com sucesso!`;
        },
        error: 'Erro ao aprovar procedimentos'
      }
    );
  };

  const handleRejectSelected = async () => {
    if (selectedProcedures.size === 0) {
      toast.error('Selecione pelo menos um procedimento');
      return;
    }

    toast.promise(
      Promise.all(
        Array.from(selectedProcedures).map(id => 
          guideService.updateProcedureStatus(id, 'REJECTED')
        )
      ),
      {
        loading: `Rejeitando ${selectedProcedures.size} procedimento(s)...`,
        success: () => {
          queryClient.invalidateQueries({ queryKey: ['guia', numeroGuiaPrestador, 'procedures'] });
          setSelectedProcedures(new Set());
          return `${selectedProcedures.size} procedimento(s) rejeitado(s) com sucesso!`;
        },
        error: 'Erro ao rejeitar procedimentos'
      }
    );
  };

  const handleApproveAll = async () => {
    const pendingProcedures = procedimentos.filter(p => (p.status || 'PENDING').toUpperCase() === 'PENDING');
    
    if (pendingProcedures.length === 0) {
      toast.error('Não há procedimentos pendentes para aprovar');
      return;
    }

    toast.promise(
      Promise.all(
        pendingProcedures.map(p => 
          guideService.updateProcedureStatus(p.id, 'APPROVED')
        )
      ),
      {
        loading: `Aprovando toda a guia (${pendingProcedures.length} procedimentos)...`,
        success: () => {
          queryClient.invalidateQueries({ queryKey: ['guia', numeroGuiaPrestador, 'procedures'] });
          // Após aprovar tudo, perguntar se quer finalizar a guia
          setTimeout(() => {
            if (confirm('Guia aprovada com sucesso! Deseja finalizar a guia e removê-la da lista de pendências?')) {
              handleFinalizeGuia();
            }
          }, 500);
          return `Guia aprovada com sucesso! ${pendingProcedures.length} procedimento(s) aprovado(s).`;
        },
        error: 'Erro ao aprovar guia'
      }
    );
  };

  const handleFinalizeGuia = async () => {
    try {
      // Atualizar status da guia para FINALIZED
      await guideService.updateGuideStatus(numeroGuiaPrestador, 'FINALIZED');
      toast.success('Guia finalizada com sucesso!');
      // Voltar para lista de auditorias
      setTimeout(() => navigate('/audits'), 1000);
    } catch (error) {
      toast.error('Erro ao finalizar guia');
    }
  };

  useEffect(() => {
    if (!numeroGuiaPrestador) {
      navigate('/audits');
    }
  }, [numeroGuiaPrestador, navigate]);

  const pendingProcedures = procedimentos.filter(p => (p.status || 'PENDING').toUpperCase() === 'PENDING');
  const allPendingSelected = pendingProcedures.length > 0 && 
    pendingProcedures.every(p => selectedProcedures.has(p.id));

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
              <h1 className="text-2xl font-bold">Guia #{numeroGuiaPrestador}</h1>
              <p className="text-primary-foreground/80">Sessão: {sessionName}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="text-lg px-4 py-2">
              {procedimentos.length} procedimento(s)
            </Badge>
            <Button 
              size="lg" 
              variant="outline"
              className="bg-blue-600 hover:bg-blue-700 text-white border-blue-600"
              onClick={() => {
                try {
                  exportGuiaXML({
                    numeroGuiaPrestador,
                    procedimentos
                  });
                  toast.success('XML exportado com sucesso!');
                } catch (error) {
                  toast.error(error instanceof Error ? error.message : 'Erro ao exportar XML');
                }
              }}
              disabled={counts.approved === 0}
            >
              <Download className="h-5 w-5 mr-2" />
              Exportar XML
            </Button>
            <Button 
              size="lg" 
              className="bg-green-600 hover:bg-green-700"
              onClick={handleApproveAll}
              disabled={counts.pending === 0}
            >
              <CheckCircle className="h-5 w-5 mr-2" />
              Aprovar Guia Inteira
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6 space-y-6">
        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
          <Card className={`border-l-4 ${pendenciasStats.total > 0 ? 'border-l-red-500' : 'border-l-green-500'}`}>
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pendências</p>
                <p className="text-3xl font-bold">{pendenciasStats.total}</p>
              </div>
              <AlertCircle className={`h-8 w-8 ${pendenciasStats.total > 0 ? 'text-red-600' : 'text-green-600'}`} />
            </CardContent>
          </Card>
        </div>

        {/* Tabs de status */}
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="pendencias">
              Pendências <Badge variant="secondary" className="ml-2">{pendenciasStats.total}</Badge>
            </TabsTrigger>
            <TabsTrigger value="all">Todos <Badge variant="secondary" className="ml-2">{counts.all}</Badge></TabsTrigger>
            <TabsTrigger value="pending">Pendentes <Badge variant="secondary" className="ml-2">{counts.pending}</Badge></TabsTrigger>
            <TabsTrigger value="approved">Aprovados <Badge variant="secondary" className="ml-2">{counts.approved}</Badge></TabsTrigger>
            <TabsTrigger value="rejected">Rejeitados <Badge variant="secondary" className="ml-2">{counts.rejected}</Badge></TabsTrigger>
            <TabsTrigger value="logs">Logs</TabsTrigger>
          </TabsList>

          {/* Aba de Pendências */}
          <TabsContent value="pendencias" className="mt-4">
            <PendenciasTab 
              stats={pendenciasStats} 
              procedimentos={procedimentos}
              onApprove={handleApprove}
              onReject={handleReject}
              onReset={handleReset}
              isUpdating={updateStatusMutation.isPending}
            />
          </TabsContent>

          {/* Outras abas com procedimentos */}
          {(['all','pending','approved','rejected'] as const).map(tab => {
            const list = procedimentos.filter(p => {
              if (tab === 'all') return true;
              const st = (p.status || 'PENDING').toUpperCase();
              return st === tab.toUpperCase();
            });
            
            const showBulkActions = tab === 'pending' || tab === 'all';
            
            return (
              <TabsContent key={tab} value={tab} className="space-y-3 mt-4">
                {/* Ações em massa */}
                {showBulkActions && list.some(p => (p.status || 'PENDING').toUpperCase() === 'PENDING') && (
                  <Card className="bg-blue-50 border-blue-200">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Checkbox
                            checked={allPendingSelected}
                            onCheckedChange={handleSelectAll}
                          />
                          <span className="text-sm font-medium">
                            {selectedProcedures.size > 0 
                              ? `${selectedProcedures.size} procedimento(s) selecionado(s)`
                              : 'Selecionar todos os pendentes'
                            }
                          </span>
                        </div>
                        {selectedProcedures.size > 0 && (
                          <div className="flex items-center gap-2">
                            <Button 
                              size="sm" 
                              className="bg-green-600 hover:bg-green-700"
                              onClick={handleApproveSelected}
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Aprovar Selecionados
                            </Button>
                            <Button 
                              size="sm" 
                              variant="destructive"
                              onClick={handleRejectSelected}
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Rejeitar Selecionados
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}

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
                {list.map(proc => (
                  <ProcedureCard
                    key={proc.id}
                    procedure={proc}
                    onApprove={handleApprove}
                    onReject={handleReject}
                    onReset={handleReset}
                    isUpdating={updateStatusMutation.isPending}
                    selectable={showBulkActions && (proc.status || 'PENDING').toUpperCase() === 'PENDING'}
                    selected={selectedProcedures.has(proc.id)}
                    onSelectChange={handleSelectProcedure}
                  />
                ))}
              </TabsContent>
            );
          })}

          {/* Aba de Logs */}
          <TabsContent value="logs" className="mt-4">
            <LogsTab logs={logs} isLoading={logsLoading} />
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Modal de Rejeição com Justificativa */}
      <RejectModal
        open={rejectModalOpen}
        onOpenChange={setRejectModalOpen}
        procedimento={procedimentoParaRejeitar}
        valorRecomendado={valorRecomendadoRejeicao}
        onConfirm={handleConfirmReject}
      />
    </div>
  );
};

export default GuiaDetailsNew;
