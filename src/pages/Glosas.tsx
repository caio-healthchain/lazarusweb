import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  ArrowLeft, Search, AlertTriangle, FileText, DollarSign, Clock, Scale
} from 'lucide-react';
import AccountCard from '@/components/workflow/AccountCard';
import { mockAccounts } from '@/data/workflowMockData';

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
};

const Glosas = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const contas = useMemo(() => {
    return mockAccounts.filter(a =>
      a.status.startsWith('glosa') || a.status === 'laudo_gerado'
    );
  }, []);

  const filteredContas = useMemo(() => {
    let filtered = contas;
    if (statusFilter !== 'all') filtered = filtered.filter(a => a.status === statusFilter);
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

  const glosaRecebida = contas.filter(a => a.status === 'glosa_recebida').length;
  const glosaEmRecurso = contas.filter(a => a.status === 'glosa_em_recurso').length;
  const laudoGerado = contas.filter(a => a.status === 'laudo_gerado').length;
  const valorGlosadoTotal = contas.reduce((acc, a) => acc + a.valorGlosado, 0);
  const valorRecuperavel = contas.reduce((acc, a) => {
    const glosasRecurso = a.glosas.filter(g => g.status === 'em_recurso' || g.status === 'aceita');
    return acc + glosasRecurso.reduce((sum, g) => sum + g.valorGlosado, 0);
  }, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate('/modules')}>
              <ArrowLeft className="h-4 w-4 mr-1" /> Módulos
            </Button>
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 bg-red-600 rounded-lg">
                <Scale className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Glosas e Laudos</h1>
                <p className="text-sm text-gray-500">Gestão de glosas, recursos e geração de laudos</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <Card className="border-l-4 border-l-red-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total</p>
                  <p className="text-2xl font-bold">{contas.length}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-300" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-orange-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Glosa Recebida</p>
                  <p className="text-2xl font-bold text-orange-600">{glosaRecebida}</p>
                </div>
                <FileText className="h-8 w-8 text-orange-300" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-yellow-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Em Recurso</p>
                  <p className="text-2xl font-bold text-yellow-600">{glosaEmRecurso}</p>
                </div>
                <Scale className="h-8 w-8 text-yellow-300" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-purple-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Laudo Gerado</p>
                  <p className="text-2xl font-bold text-purple-600">{laudoGerado}</p>
                </div>
                <FileText className="h-8 w-8 text-purple-300" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-emerald-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Valor Glosado</p>
                  <p className="text-xl font-bold text-red-600">{formatCurrency(valorGlosadoTotal)}</p>
                </div>
                <DollarSign className="h-8 w-8 text-red-300" />
              </div>
            </CardContent>
          </Card>
        </div>

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
            <Button variant={statusFilter === 'glosa_recebida' ? 'default' : 'outline'} size="sm" onClick={() => setStatusFilter('glosa_recebida')}>
              Recebidas ({glosaRecebida})
            </Button>
            <Button variant={statusFilter === 'glosa_em_recurso' ? 'default' : 'outline'} size="sm" onClick={() => setStatusFilter('glosa_em_recurso')}>
              Em Recurso ({glosaEmRecurso})
            </Button>
            <Button variant={statusFilter === 'laudo_gerado' ? 'default' : 'outline'} size="sm" onClick={() => setStatusFilter('laudo_gerado')}>
              Laudo Gerado ({laudoGerado})
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          {filteredContas.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-gray-500">Nenhuma conta com glosa encontrada.</p>
            </Card>
          ) : (
            filteredContas.map(account => (
              <AccountCard key={account.id} account={account} basePath="/glosas" />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Glosas;
