import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  FileCheck, 
  ArrowLeft, 
  Filter,
  Search,
  FileText,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Building2,
  Calendar,
  User
} from 'lucide-react';

// Dados mockados
const mockGuides = [
  {
    id: '21066378',
    paciente: 'João Silva Santos',
    operadora: 'Unimed',
    tipo: 'Cirúrgico',
    dataEmissao: '2025-11-18',
    valorTotal: 'R$ 12.450,00',
    status: 'pending',
    documentos: [
      { nome: 'Termo de Consentimento', obrigatorio: true, status: 'pending' },
      { nome: 'Relatório Médico', obrigatorio: true, status: 'pending' },
      { nome: 'Exames Pré-Operatórios', obrigatorio: true, status: 'pending' },
      { nome: 'Autorização da Operadora', obrigatorio: false, status: 'pending' }
    ]
  },
  {
    id: '21065955',
    paciente: 'Maria Oliveira Costa',
    operadora: 'Bradesco Saúde',
    tipo: 'Internação',
    dataEmissao: '2025-11-17',
    valorTotal: 'R$ 8.320,00',
    status: 'partial',
    documentos: [
      { nome: 'Termo de Internação', obrigatorio: true, status: 'complete' },
      { nome: 'Prescrição Médica', obrigatorio: true, status: 'complete' },
      { nome: 'Termo de Prorrogação', obrigatorio: true, status: 'pending' },
      { nome: 'Relatório de Evolução', obrigatorio: false, status: 'pending' }
    ]
  },
  {
    id: '21066176',
    paciente: 'Carlos Eduardo Mendes',
    operadora: 'SulAmérica',
    tipo: 'Exame',
    dataEmissao: '2025-11-16',
    valorTotal: 'R$ 1.850,00',
    status: 'complete',
    documentos: [
      { nome: 'Pedido Médico', obrigatorio: true, status: 'complete' },
      { nome: 'Autorização Prévia', obrigatorio: true, status: 'complete' },
      { nome: 'Termo de Consentimento', obrigatorio: false, status: 'complete' }
    ]
  },
  {
    id: '21065253',
    paciente: 'Ana Paula Rodrigues',
    operadora: 'Amil',
    tipo: 'Cirúrgico',
    dataEmissao: '2025-11-19',
    valorTotal: 'R$ 15.200,00',
    status: 'pending',
    documentos: [
      { nome: 'Termo de Consentimento', obrigatorio: true, status: 'pending' },
      { nome: 'Relatório Médico', obrigatorio: true, status: 'pending' },
      { nome: 'Exames Pré-Operatórios', obrigatorio: true, status: 'pending' },
      { nome: 'Laudo de Indicação Cirúrgica', obrigatorio: true, status: 'pending' }
    ]
  },
  {
    id: '21066348',
    paciente: 'Roberto Alves Lima',
    operadora: 'Unimed',
    tipo: 'Internação',
    dataEmissao: '2025-11-15',
    valorTotal: 'R$ 9.750,00',
    status: 'partial',
    documentos: [
      { nome: 'Termo de Internação', obrigatorio: true, status: 'complete' },
      { nome: 'Prescrição Médica', obrigatorio: true, status: 'complete' },
      { nome: 'Relatório de Evolução', obrigatorio: true, status: 'pending' }
    ]
  },
  {
    id: '21065848',
    paciente: 'Fernanda Costa Souza',
    operadora: 'Bradesco Saúde',
    tipo: 'Exame',
    dataEmissao: '2025-11-14',
    valorTotal: 'R$ 2.100,00',
    status: 'complete',
    documentos: [
      { nome: 'Pedido Médico', obrigatorio: true, status: 'complete' },
      { nome: 'Autorização Prévia', obrigatorio: true, status: 'complete' }
    ]
  }
];

const Analista = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOperadora, setSelectedOperadora] = useState('all');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-red-50 border-red-200';
      case 'partial':
        return 'bg-yellow-50 border-yellow-200';
      case 'complete':
        return 'bg-green-50 border-green-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Pendente</Badge>;
      case 'partial':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Em Análise</Badge>;
      case 'complete':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Pronta</Badge>;
      default:
        return null;
    }
  };

  const calculateProgress = (documentos: any[]) => {
    const total = documentos.filter(d => d.obrigatorio).length;
    const complete = documentos.filter(d => d.obrigatorio && d.status === 'complete').length;
    return (complete / total) * 100;
  };

  const getPendingCount = (documentos: any[]) => {
    return documentos.filter(d => d.obrigatorio && d.status === 'pending').length;
  };

  const filteredGuides = mockGuides.filter(guide => {
    const matchesSearch = guide.id.includes(searchTerm) || 
                         guide.paciente.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesOperadora = selectedOperadora === 'all' || guide.operadora === selectedOperadora;
    return matchesSearch && matchesOperadora;
  });

  const groupedGuides = {
    pending: filteredGuides.filter(g => g.status === 'pending'),
    partial: filteredGuides.filter(g => g.status === 'partial'),
    complete: filteredGuides.filter(g => g.status === 'complete')
  };

  const operadoras = ['all', ...Array.from(new Set(mockGuides.map(g => g.operadora)))];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/modules')}
              className="hover:bg-gray-100"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
            <div className="h-6 w-px bg-gray-300" />
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-purple-600 rounded-lg">
                <FileCheck className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  Módulo Analista
                </h1>
                <p className="text-sm text-gray-500">
                  Checklist de Documentação
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Filtros e Busca */}
        <div className="mb-6 flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por número da guia ou paciente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <select
              value={selectedOperadora}
              onChange={(e) => setSelectedOperadora(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="all">Todas as Operadoras</option>
              {operadoras.filter(op => op !== 'all').map(op => (
                <option key={op} value={op}>{op}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Kanban Board */}
        <div className="grid grid-cols-3 gap-6">
          {/* Coluna: Pendentes */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full" />
                <h2 className="text-lg font-semibold text-gray-900">Pendentes</h2>
              </div>
              <Badge variant="secondary" className="bg-red-100 text-red-800">
                {groupedGuides.pending.length}
              </Badge>
            </div>
            
            <div className="space-y-3">
              {groupedGuides.pending.map(guide => (
                <Card 
                  key={guide.id}
                  className={`${getStatusColor(guide.status)} border-2 hover:shadow-lg transition-all cursor-pointer`}
                  onClick={() => navigate(`/analista/${guide.id}`)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-base font-bold text-gray-900">
                          Guia #{guide.id}
                        </CardTitle>
                        <CardDescription className="text-sm text-gray-600 mt-1">
                          {guide.paciente}
                        </CardDescription>
                      </div>
                      {getStatusBadge(guide.status)}
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Building2 className="h-4 w-4" />
                      <span>{guide.operadora}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <FileText className="h-4 w-4" />
                      <span>{guide.tipo}</span>
                    </div>
                    
                    <div className="pt-2 space-y-2">
                      <div className="flex items-center justify-between text-xs text-gray-600">
                        <span>Progresso</span>
                        <span className="font-medium">{Math.round(calculateProgress(guide.documentos))}%</span>
                      </div>
                      <Progress value={calculateProgress(guide.documentos)} className="h-2" />
                    </div>
                    
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center gap-1 text-red-600">
                        <AlertCircle className="h-4 w-4" />
                        <span className="text-sm font-medium">
                          {getPendingCount(guide.documentos)} pendente(s)
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">{guide.valorTotal}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Coluna: Em Análise */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                <h2 className="text-lg font-semibold text-gray-900">Em Análise</h2>
              </div>
              <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                {groupedGuides.partial.length}
              </Badge>
            </div>
            
            <div className="space-y-3">
              {groupedGuides.partial.map(guide => (
                <Card 
                  key={guide.id}
                  className={`${getStatusColor(guide.status)} border-2 hover:shadow-lg transition-all cursor-pointer`}
                  onClick={() => navigate(`/analista/${guide.id}`)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-base font-bold text-gray-900">
                          Guia #{guide.id}
                        </CardTitle>
                        <CardDescription className="text-sm text-gray-600 mt-1">
                          {guide.paciente}
                        </CardDescription>
                      </div>
                      {getStatusBadge(guide.status)}
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Building2 className="h-4 w-4" />
                      <span>{guide.operadora}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <FileText className="h-4 w-4" />
                      <span>{guide.tipo}</span>
                    </div>
                    
                    <div className="pt-2 space-y-2">
                      <div className="flex items-center justify-between text-xs text-gray-600">
                        <span>Progresso</span>
                        <span className="font-medium">{Math.round(calculateProgress(guide.documentos))}%</span>
                      </div>
                      <Progress value={calculateProgress(guide.documentos)} className="h-2" />
                    </div>
                    
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center gap-1 text-yellow-600">
                        <AlertCircle className="h-4 w-4" />
                        <span className="text-sm font-medium">
                          {getPendingCount(guide.documentos)} pendente(s)
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">{guide.valorTotal}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Coluna: Prontas para Envio */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full" />
                <h2 className="text-lg font-semibold text-gray-900">Prontas</h2>
              </div>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                {groupedGuides.complete.length}
              </Badge>
            </div>
            
            <div className="space-y-3">
              {groupedGuides.complete.map(guide => (
                <Card 
                  key={guide.id}
                  className={`${getStatusColor(guide.status)} border-2 hover:shadow-lg transition-all cursor-pointer`}
                  onClick={() => navigate(`/analista/${guide.id}`)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-base font-bold text-gray-900">
                          Guia #{guide.id}
                        </CardTitle>
                        <CardDescription className="text-sm text-gray-600 mt-1">
                          {guide.paciente}
                        </CardDescription>
                      </div>
                      {getStatusBadge(guide.status)}
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Building2 className="h-4 w-4" />
                      <span>{guide.operadora}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <FileText className="h-4 w-4" />
                      <span>{guide.tipo}</span>
                    </div>
                    
                    <div className="pt-2 space-y-2">
                      <div className="flex items-center justify-between text-xs text-gray-600">
                        <span>Progresso</span>
                        <span className="font-medium">{Math.round(calculateProgress(guide.documentos))}%</span>
                      </div>
                      <Progress value={calculateProgress(guide.documentos)} className="h-2" />
                    </div>
                    
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center gap-1 text-green-600">
                        <CheckCircle2 className="h-4 w-4" />
                        <span className="text-sm font-medium">
                          Completa
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">{guide.valorTotal}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analista;
