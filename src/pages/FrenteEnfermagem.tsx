import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  ArrowLeft, Search, Package, Pill, Clock, AlertTriangle, Heart
} from 'lucide-react';
import AccountCard from '@/components/workflow/AccountCard';
import { mockAccounts } from '@/data/workflowMockData';

const FrenteEnfermagem = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pendente' | 'em_analise'>('all');

  const contas = useMemo(() => {
    return mockAccounts.filter(a => a.status.startsWith('enfermagem'));
  }, []);

  const filteredContas = useMemo(() => {
    let filtered = contas;
    if (statusFilter === 'pendente') filtered = filtered.filter(a => a.status === 'enfermagem_pendente');
    if (statusFilter === 'em_analise') filtered = filtered.filter(a => a.status === 'enfermagem_em_analise');
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

  const pendentes = contas.filter(a => a.status === 'enfermagem_pendente').length;
  const emAnalise = contas.filter(a => a.status === 'enfermagem_em_analise').length;
  const materiaisPendentes = contas.reduce((acc, a) => acc + a.materiais.filter(m => !m.validado).length, 0);
  const medPendentes = contas.reduce((acc, a) => acc + a.medicamentos.filter(m => !m.validado).length, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate('/modules')}>
              <ArrowLeft className="h-4 w-4 mr-1" /> Módulos
            </Button>
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-lg">
                <Heart className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Frente de Enfermagem</h1>
                <p className="text-sm text-gray-500">Validação de materiais, medicamentos e complemento da conta</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total de Contas</p>
                  <p className="text-2xl font-bold">{contas.length}</p>
                </div>
                <Heart className="h-8 w-8 text-blue-300" />
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
          <Card className="border-l-4 border-l-orange-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Materiais Pendentes</p>
                  <p className="text-2xl font-bold text-orange-600">{materiaisPendentes}</p>
                </div>
                <Package className="h-8 w-8 text-orange-300" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-emerald-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Medicamentos Pendentes</p>
                  <p className="text-2xl font-bold text-emerald-600">{medPendentes}</p>
                </div>
                <Pill className="h-8 w-8 text-emerald-300" />
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
            <Button variant={statusFilter === 'pendente' ? 'default' : 'outline'} size="sm" onClick={() => setStatusFilter('pendente')}>
              Pendentes ({pendentes})
            </Button>
            <Button variant={statusFilter === 'em_analise' ? 'default' : 'outline'} size="sm" onClick={() => setStatusFilter('em_analise')}>
              Em Análise ({emAnalise})
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          {filteredContas.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-gray-500">Nenhuma conta encontrada nesta frente.</p>
            </Card>
          ) : (
            filteredContas.map(account => (
              <AccountCard key={account.id} account={account} basePath="/frente-enfermagem" />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default FrenteEnfermagem;
