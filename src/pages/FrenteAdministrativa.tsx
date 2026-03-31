import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Search, FileCheck, Clock, AlertTriangle,
  ClipboardCheck, FileText, DollarSign, Filter
} from 'lucide-react';
import AICopilotTip from '@/components/ai/AICopilotTip';
import AccountCard from '@/components/workflow/AccountCard';
import { mockAccounts, WorkflowAccount } from '@/data/workflowMockData';

const FrenteAdministrativa = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pendente' | 'em_analise'>('all');

  const contas = useMemo(() => {
    return mockAccounts.filter(a => a.status.startsWith('administrativa'));
  }, []);

  const filteredContas = useMemo(() => {
    let filtered = contas;
    if (statusFilter === 'pendente') filtered = filtered.filter(a => a.status === 'administrativa_pendente');
    if (statusFilter === 'em_analise') filtered = filtered.filter(a => a.status === 'administrativa_em_analise');
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(a => 
        a.paciente.toLowerCase().includes(term) ||
        a.numeroConta.includes(term) ||
        a.operadora.toLowerCase().includes(term) ||
        a.id.toLowerCase().includes(term)
      );
    }
    return filtered;
  }, [contas, statusFilter, searchTerm]);

  const pendentes = contas.filter(a => a.status === 'administrativa_pendente').length;
  const emAnalise = contas.filter(a => a.status === 'administrativa_em_analise').length;
  const valorTotal = contas.reduce((acc, a) => acc + a.valorTotal, 0);
  const docsPendentes = contas.reduce((acc, a) => acc + a.documentos.filter(d => d.status === 'pendente' && d.obrigatorio).length, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 bg-purple-600 rounded-lg">
                  <ClipboardCheck className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Frente Administrativa</h1>
                  <p className="text-sm text-gray-500">Validação de documentação e elegibilidade</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* IA Copilot */}
        <div className="mb-4">
          <AICopilotTip
            variant="warning"
            title="{docsPendentes} documentos obrigatórios pendentes"
            message="Existem documentos obrigatórios faltando nas contas desta frente. Recomendo priorizar a conta CT-2026-001 que está há mais de 24h aguardando."
            action="Ver documentos pendentes"
            onAction={() => setStatusFilter('pendente')}
          />
        </div>

        {/* Métricas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card className="border-l-4 border-l-purple-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total de Contas</p>
                  <p className="text-2xl font-bold">{contas.length}</p>
                </div>
                <FileCheck className="h-8 w-8 text-purple-300" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-yellow-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Pendentes</p>
                  <p className="text-2xl font-bold text-yellow-600">{pendentes}</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-300" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Em Análise</p>
                  <p className="text-2xl font-bold text-blue-600">{emAnalise}</p>
                </div>
                <FileText className="h-8 w-8 text-blue-300" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-red-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Docs Pendentes</p>
                  <p className="text-2xl font-bold text-red-600">{docsPendentes}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-300" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filtros */}
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Buscar por paciente, conta, operadora..." 
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button variant={statusFilter === 'all' ? 'default' : 'outline'} size="sm" onClick={() => setStatusFilter('all')}>
              Todas ({contas.length})
            </Button>
            <Button variant={statusFilter === 'pendente' ? 'default' : 'outline'} size="sm" onClick={() => setStatusFilter('pendente')}>
              Pendentes ({pendentes})
            </Button>
            <Button variant={statusFilter === 'em_analise' ? 'default' : 'outline'} size="sm" onClick={() => setStatusFilter('em_analise')}>
              Em Análise ({emAnalise})
            </Button>
          </div>
        </div>

        {/* Lista de Contas */}
        <div className="space-y-4">
          {filteredContas.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-gray-500">Nenhuma conta encontrada nesta frente.</p>
            </Card>
          ) : (
            filteredContas.map(account => (
              <AccountCard key={account.id} account={account} basePath="/frente-administrativa" />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default FrenteAdministrativa;
