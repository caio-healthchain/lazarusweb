import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Search, Eye, DollarSign, Clock, AlertTriangle,
  CheckCircle, ArrowRight, User, Building2, Layers
} from 'lucide-react';
import AICopilotTip from '@/components/ai/AICopilotTip';
import {
  mockAccounts, getAccountsByPhase, getWorkflowMetrics,
  getStatusColor, getStatusLabel, getPrioridadeColor, WorkflowAccount
} from '@/data/workflowMockData';

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
};

interface KanbanColumnProps {
  title: string;
  color: string;
  icon: React.ReactNode;
  accounts: WorkflowAccount[];
  onClickAccount: (id: string) => void;
}

const KanbanColumn = ({ title, color, icon, accounts, onClickAccount }: KanbanColumnProps) => (
  <div className="flex-shrink-0 w-72">
    <div className={`rounded-t-lg p-3 ${color} text-white`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {icon}
          <span className="font-semibold text-sm">{title}</span>
        </div>
        <Badge className="bg-white/20 text-white border-0">{accounts.length}</Badge>
      </div>
    </div>
    <div className="bg-gray-100 rounded-b-lg p-2 space-y-2 min-h-[200px] max-h-[calc(100vh-380px)] overflow-y-auto">
      {accounts.length === 0 ? (
        <div className="text-center py-8 text-gray-400 text-sm">Nenhuma conta</div>
      ) : (
        accounts.map(account => (
          <Card
            key={account.id}
            className="cursor-pointer hover:shadow-md transition-all border-l-4"
            style={{
              borderLeftColor: account.prioridade === 'critica' ? '#ef4444' :
                account.prioridade === 'alta' ? '#f97316' :
                account.prioridade === 'media' ? '#eab308' : '#9ca3af'
            }}
            onClick={() => onClickAccount(account.id)}
          >
            <CardContent className="p-3">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-xs text-gray-700">{account.id}</span>
                <Badge className={getPrioridadeColor(account.prioridade)} variant="secondary">
                  {account.prioridade.charAt(0).toUpperCase() + account.prioridade.slice(1)}
                </Badge>
              </div>
              <p className="font-medium text-sm text-gray-900 mb-1 truncate">{account.paciente}</p>
              <p className="text-xs text-gray-500 truncate mb-2">{account.procedimentoPrincipal}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Building2 className="h-3 w-3" />
                  <span className="truncate max-w-[80px]">{account.operadora}</span>
                </div>
                <span className="text-xs font-bold text-gray-700">{formatCurrency(account.valorTotal)}</span>
              </div>
              <div className="flex items-center justify-between mt-2 pt-2 border-t">
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <User className="h-3 w-3" />
                  <span className="truncate max-w-[100px]">{account.owner}</span>
                </div>
                {account.slaRestante > 0 && (
                  <div className={`flex items-center gap-1 text-xs ${
                    account.slaRestante < 12 ? 'text-red-600 font-bold' :
                    account.slaRestante < 24 ? 'text-orange-600' : 'text-gray-500'
                  }`}>
                    <Clock className="h-3 w-3" />
                    <span>{account.slaRestante}h</span>
                  </div>
                )}
              </div>
              {account.valorGlosado > 0 && (
                <div className="mt-2 pt-2 border-t">
                  <div className="flex items-center gap-1 text-xs text-red-600">
                    <AlertTriangle className="h-3 w-3" />
                    <span>Glosa: {formatCurrency(account.valorGlosado)}</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))
      )}
    </div>
  </div>
);

const ControlTower = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const phases = useMemo(() => getAccountsByPhase(), []);
  const metrics = useMemo(() => getWorkflowMetrics(), []);

  const handleClickAccount = (id: string) => {
    const account = mockAccounts.find(a => a.id === id);
    if (!account) return;
    if (account.status.startsWith('administrativa')) navigate(`/frente-administrativa/${id}`);
    else if (account.status.startsWith('enfermagem')) navigate(`/frente-enfermagem/${id}`);
    else if (account.status.startsWith('medica')) navigate(`/frente-medica/${id}`);
    else if (account.status.startsWith('glosa') || account.status === 'laudo_gerado') navigate(`/glosas/${id}`);
    else navigate(`/frente-administrativa/${id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b px-6 py-4">
        <div className="max-w-full mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg">
                  <Layers className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Central de Contas</h1>
                  <p className="text-sm text-gray-500">Visão completa do workflow de contas hospitalares</p>
                </div>
              </div>
            </div>
            <div className="relative max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar conta..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-4">
        {/* IA Copilot Tip */}
        <div className="mb-4">
          <AICopilotTip
            variant="insight"
            title="Atenção: 2 contas com SLA crítico"
            message="As contas CT-2026-002 (Enfermagem) e CT-2026-004 (Auditoria Final) estão com SLA abaixo de 24h. Recomendo priorizar para evitar atraso no faturamento."
            action="Ver contas urgentes"
            onAction={() => {}}
          />
        </div>

        {/* Métricas Resumo */}
        <div className="grid grid-cols-2 md:grid-cols-7 gap-3 mb-6">
          <Card className="p-3">
            <p className="text-xs text-gray-500">Total Contas</p>
            <p className="text-xl font-bold">{metrics.totalContas}</p>
          </Card>
          <Card className="p-3">
            <p className="text-xs text-gray-500">Valor Total</p>
            <p className="text-xl font-bold text-emerald-700">{formatCurrency(metrics.valorTotal)}</p>
          </Card>
          <Card className="p-3">
            <p className="text-xs text-gray-500">Valor Glosado</p>
            <p className="text-xl font-bold text-red-600">{formatCurrency(metrics.valorGlosado)}</p>
          </Card>
          <Card className="p-3">
            <p className="text-xs text-gray-500">Taxa de Glosa</p>
            <p className="text-xl font-bold text-orange-600">{metrics.taxaGlosa}%</p>
          </Card>
          <Card className="p-3">
            <p className="text-xs text-gray-500">Contas Críticas</p>
            <p className="text-xl font-bold text-red-600">{metrics.contasCriticas}</p>
          </Card>
          <Card className="p-3">
            <p className="text-xs text-gray-500">Tempo Médio</p>
            <p className="text-xl font-bold">{metrics.tempoMedioProcessamento}</p>
          </Card>
          <Card className="p-3">
            <p className="text-xs text-gray-500">Valor Aprovado</p>
            <p className="text-xl font-bold text-blue-700">{formatCurrency(metrics.valorAprovado)}</p>
          </Card>
        </div>

        {/* Kanban Board */}
        <div className="overflow-x-auto pb-4">
          <div className="flex gap-4 min-w-max">
            <KanbanColumn
              title="Administrativa"
              color="bg-purple-600"
              icon={<Eye className="h-4 w-4" />}
              accounts={phases.administrativa}
              onClickAccount={handleClickAccount}
            />
            <KanbanColumn
              title="Enfermagem"
              color="bg-blue-600"
              icon={<Eye className="h-4 w-4" />}
              accounts={phases.enfermagem}
              onClickAccount={handleClickAccount}
            />
            <KanbanColumn
              title="Médica"
              color="bg-emerald-600"
              icon={<Eye className="h-4 w-4" />}
              accounts={phases.medica}
              onClickAccount={handleClickAccount}
            />
            <KanbanColumn
              title="Auditoria Final"
              color="bg-amber-600"
              icon={<CheckCircle className="h-4 w-4" />}
              accounts={phases.auditoria}
              onClickAccount={handleClickAccount}
            />
            <KanbanColumn
              title="Faturamento"
              color="bg-cyan-600"
              icon={<DollarSign className="h-4 w-4" />}
              accounts={phases.faturamento}
              onClickAccount={handleClickAccount}
            />
            <KanbanColumn
              title="Glosas / Laudos"
              color="bg-red-600"
              icon={<AlertTriangle className="h-4 w-4" />}
              accounts={phases.glosas}
              onClickAccount={handleClickAccount}
            />
            <KanbanColumn
              title="Finalizado"
              color="bg-gray-600"
              icon={<CheckCircle className="h-4 w-4" />}
              accounts={phases.finalizado}
              onClickAccount={handleClickAccount}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ControlTower;
