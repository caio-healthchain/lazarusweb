import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import {
  ArrowLeft, Search, Building2, FileText, Package, DollarSign,
  Calendar, Phone, Mail, MapPin, Star, TrendingUp, AlertTriangle,
  Settings, Truck
} from 'lucide-react';
import { mockSuppliers } from '@/data/workflowMockData';

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
};

const mockContratos = [
  {
    id: 'CTR-001',
    operadora: 'Unimed',
    tipo: 'Plano Empresarial',
    vigencia: { inicio: '2025-01-01', fim: '2026-12-31' },
    status: 'ativo',
    valorMensal: 450000,
    reajuste: '8.5%',
    carencia: '30 dias',
    procedimentosCobertos: 1250,
    taxaGlosa: 4.2,
    diasPagamento: 30,
    contato: 'Maria Santos',
    email: 'maria.santos@unimed.com.br',
    telefone: '(11) 3456-7890'
  },
  {
    id: 'CTR-002',
    operadora: 'Bradesco Saúde',
    tipo: 'Plano Individual',
    vigencia: { inicio: '2025-03-01', fim: '2026-02-28' },
    status: 'ativo',
    valorMensal: 320000,
    reajuste: '10.2%',
    carencia: '60 dias',
    procedimentosCobertos: 980,
    taxaGlosa: 6.8,
    diasPagamento: 45,
    contato: 'Carlos Oliveira',
    email: 'carlos.oliveira@bradescosaude.com.br',
    telefone: '(11) 2345-6789'
  },
  {
    id: 'CTR-003',
    operadora: 'SulAmérica',
    tipo: 'Plano Premium',
    vigencia: { inicio: '2024-06-01', fim: '2026-05-31' },
    status: 'ativo',
    valorMensal: 580000,
    reajuste: '7.3%',
    carencia: '15 dias',
    procedimentosCobertos: 1500,
    taxaGlosa: 3.1,
    diasPagamento: 30,
    contato: 'Ana Paula Lima',
    email: 'ana.lima@sulamerica.com.br',
    telefone: '(11) 4567-8901'
  },
  {
    id: 'CTR-004',
    operadora: 'Amil',
    tipo: 'Plano Corporativo',
    vigencia: { inicio: '2025-01-01', fim: '2025-12-31' },
    status: 'vencendo',
    valorMensal: 280000,
    reajuste: '12.0%',
    carencia: '45 dias',
    procedimentosCobertos: 850,
    taxaGlosa: 8.5,
    diasPagamento: 60,
    contato: 'Roberto Ferreira',
    email: 'roberto.ferreira@amil.com.br',
    telefone: '(11) 5678-9012'
  },
  {
    id: 'CTR-005',
    operadora: 'Hapvida',
    tipo: 'Plano Básico',
    vigencia: { inicio: '2024-01-01', fim: '2025-12-31' },
    status: 'ativo',
    valorMensal: 180000,
    reajuste: '9.8%',
    carencia: '90 dias',
    procedimentosCobertos: 620,
    taxaGlosa: 11.2,
    diasPagamento: 45,
    contato: 'Fernanda Costa',
    email: 'fernanda.costa@hapvida.com.br',
    telefone: '(11) 6789-0123'
  }
];

const mockRecomendacoes = [
  {
    procedimento: 'Artroplastia Total de Joelho',
    codigo: '31301010',
    melhorOperadora: 'SulAmérica',
    valorContratual: 12500,
    taxaAprovacao: 94,
    tempoMedioPagamento: '28 dias'
  },
  {
    procedimento: 'Apendicectomia Videolaparoscópica',
    codigo: '31101192',
    melhorOperadora: 'Unimed',
    valorContratual: 8200,
    taxaAprovacao: 97,
    tempoMedioPagamento: '25 dias'
  },
  {
    procedimento: 'Colecistectomia',
    codigo: '31201100',
    melhorOperadora: 'Bradesco Saúde',
    valorContratual: 6800,
    taxaAprovacao: 92,
    tempoMedioPagamento: '32 dias'
  },
  {
    procedimento: 'Histerectomia Total',
    codigo: '31401050',
    melhorOperadora: 'SulAmérica',
    valorContratual: 9500,
    taxaAprovacao: 91,
    tempoMedioPagamento: '30 dias'
  },
  {
    procedimento: 'Herniorrafia Inguinal',
    codigo: '31101012',
    melhorOperadora: 'Unimed',
    valorContratual: 4200,
    taxaAprovacao: 98,
    tempoMedioPagamento: '22 dias'
  }
];

const Backoffice = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate('/modules')}>
              <ArrowLeft className="h-4 w-4 mr-1" /> Módulos
            </Button>
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 bg-gray-800 rounded-lg">
                <Settings className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Backoffice</h1>
                <p className="text-sm text-gray-500">Gestão de contratos, fornecedores e recomendações</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        <Tabs defaultValue="contratos" className="space-y-4">
          <TabsList className="bg-white border">
            <TabsTrigger value="contratos">Contratos ({mockContratos.length})</TabsTrigger>
            <TabsTrigger value="fornecedores">Fornecedores ({mockSuppliers.length})</TabsTrigger>
            <TabsTrigger value="recomendacoes">Recomendações de Operadora</TabsTrigger>
          </TabsList>

          {/* Contratos */}
          <TabsContent value="contratos">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <Card className="border-l-4 border-l-blue-500">
                <CardContent className="p-4">
                  <p className="text-sm text-gray-500">Total Contratos</p>
                  <p className="text-2xl font-bold">{mockContratos.length}</p>
                </CardContent>
              </Card>
              <Card className="border-l-4 border-l-emerald-500">
                <CardContent className="p-4">
                  <p className="text-sm text-gray-500">Receita Mensal</p>
                  <p className="text-2xl font-bold text-emerald-700">
                    {formatCurrency(mockContratos.reduce((acc, c) => acc + c.valorMensal, 0))}
                  </p>
                </CardContent>
              </Card>
              <Card className="border-l-4 border-l-orange-500">
                <CardContent className="p-4">
                  <p className="text-sm text-gray-500">A Vencer</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {mockContratos.filter(c => c.status === 'vencendo').length}
                  </p>
                </CardContent>
              </Card>
              <Card className="border-l-4 border-l-purple-500">
                <CardContent className="p-4">
                  <p className="text-sm text-gray-500">Proced. Cobertos</p>
                  <p className="text-2xl font-bold">
                    {mockContratos.reduce((acc, c) => acc + c.procedimentosCobertos, 0).toLocaleString()}
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              {mockContratos.map(contrato => (
                <Card key={contrato.id} className={`border-l-4 ${
                  contrato.status === 'vencendo' ? 'border-l-orange-500' : 'border-l-emerald-500'
                }`}>
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-sm text-gray-500">{contrato.id}</span>
                          <Badge variant="secondary" className={
                            contrato.status === 'ativo' ? 'bg-green-100 text-green-800' :
                            'bg-orange-100 text-orange-800'
                          }>
                            {contrato.status === 'ativo' ? 'Ativo' : 'Vencendo'}
                          </Badge>
                        </div>
                        <h3 className="text-lg font-semibold">{contrato.operadora}</h3>
                        <p className="text-sm text-gray-500">{contrato.tipo}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-emerald-700">{formatCurrency(contrato.valorMensal)}/mês</p>
                        <p className="text-xs text-gray-500">Reajuste: {contrato.reajuste}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <div>
                          <p className="text-xs text-gray-500">Vigência</p>
                          <p className="font-medium">
                            {new Date(contrato.vigencia.inicio).toLocaleDateString('pt-BR')} - {new Date(contrato.vigencia.fim).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-gray-400" />
                        <div>
                          <p className="text-xs text-gray-500">Procedimentos</p>
                          <p className="font-medium">{contrato.procedimentosCobertos.toLocaleString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-gray-400" />
                        <div>
                          <p className="text-xs text-gray-500">Taxa Glosa</p>
                          <p className={`font-medium ${contrato.taxaGlosa > 8 ? 'text-red-600' : 'text-gray-900'}`}>
                            {contrato.taxaGlosa}%
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-gray-400" />
                        <div>
                          <p className="text-xs text-gray-500">Prazo Pgto</p>
                          <p className="font-medium">{contrato.diasPagamento} dias</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <div>
                          <p className="text-xs text-gray-500">Contato</p>
                          <p className="font-medium">{contrato.contato}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Fornecedores */}
          <TabsContent value="fornecedores">
            <div className="space-y-4">
              {mockSuppliers.map(fornecedor => (
                <Card key={fornecedor.id}>
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="secondary" className={
                            fornecedor.tipo === 'farmacia' ? 'bg-green-100 text-green-800' :
                            fornecedor.tipo === 'opme' ? 'bg-blue-100 text-blue-800' :
                            fornecedor.tipo === 'materiais' ? 'bg-purple-100 text-purple-800' :
                            'bg-gray-100 text-gray-800'
                          }>
                            {fornecedor.tipo === 'farmacia' ? 'Farmácia' :
                             fornecedor.tipo === 'opme' ? 'OPME' :
                             fornecedor.tipo === 'materiais' ? 'Materiais' : 'Equipamentos'}
                          </Badge>
                          <Badge variant="secondary" className={
                            fornecedor.status === 'ativo' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }>
                            {fornecedor.status === 'ativo' ? 'Ativo' : 'Inativo'}
                          </Badge>
                        </div>
                        <h3 className="text-lg font-semibold">{fornecedor.nome}</h3>
                        <p className="text-sm text-gray-500">CNPJ: {fornecedor.cnpj}</p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 mb-1">
                          <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                          <span className="font-bold">{fornecedor.avaliacao}</span>
                        </div>
                        <p className="text-xs text-gray-500">Prazo: {fornecedor.prazoEntrega}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <span>{fornecedor.telefone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <span className="truncate">{fornecedor.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span>{fornecedor.cidade} - {fornecedor.estado}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-gray-400" />
                        <span>{fornecedor.itensContratados} itens</span>
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t flex items-center justify-between">
                      <div>
                        <p className="text-xs text-gray-500">Condição de Pagamento</p>
                        <p className="text-sm font-medium">{fornecedor.condicaoPagamento}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Valor Médio Mensal</p>
                        <p className="text-sm font-bold text-emerald-700">{formatCurrency(fornecedor.valorMedioMensal)}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Recomendações */}
          <TabsContent value="recomendacoes">
            <Card className="mb-4 border-purple-200 bg-gradient-to-r from-purple-50 to-white">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="flex items-center justify-center w-8 h-8 bg-purple-600 rounded-lg flex-shrink-0">
                    <TrendingUp className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-purple-900 text-sm mb-1">Recomendações por IA</h4>
                    <p className="text-sm text-purple-800">
                      Com base nos contratos vigentes, histórico de glosas e tempo de pagamento,
                      estas são as melhores operadoras para cada procedimento.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="overflow-x-auto">
              <table className="w-full text-sm bg-white rounded-lg border">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="text-left p-4">Procedimento</th>
                    <th className="text-left p-4">Código</th>
                    <th className="text-left p-4">Melhor Operadora</th>
                    <th className="text-right p-4">Valor Contratual</th>
                    <th className="text-center p-4">Taxa Aprovação</th>
                    <th className="text-center p-4">Tempo Pgto</th>
                  </tr>
                </thead>
                <tbody>
                  {mockRecomendacoes.map((rec, i) => (
                    <tr key={i} className="border-b hover:bg-gray-50">
                      <td className="p-4 font-medium">{rec.procedimento}</td>
                      <td className="p-4 font-mono text-xs text-gray-500">{rec.codigo}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-blue-500" />
                          <span className="font-medium">{rec.melhorOperadora}</span>
                        </div>
                      </td>
                      <td className="p-4 text-right font-bold text-emerald-700">{formatCurrency(rec.valorContratual)}</td>
                      <td className="p-4 text-center">
                        <Badge className={
                          rec.taxaAprovacao >= 95 ? 'bg-green-100 text-green-800' :
                          rec.taxaAprovacao >= 90 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        } variant="secondary">
                          {rec.taxaAprovacao}%
                        </Badge>
                      </td>
                      <td className="p-4 text-center text-gray-600">{rec.tempoMedioPagamento}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Backoffice;
