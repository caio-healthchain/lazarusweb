import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  ArrowLeft, 
  FileText,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Building2,
  Calendar,
  User,
  DollarSign,
  FileCheck,
  Download,
  Send
} from 'lucide-react';

// Dados mockados (mesmo do Analista.tsx)
const mockGuides: any = {
  '21066378': {
    id: '21066378',
    paciente: 'João Silva Santos',
    cpf: '123.456.789-00',
    operadora: 'Unimed',
    tipo: 'Cirúrgico',
    dataEmissao: '2025-11-18',
    valorTotal: 'R$ 12.450,00',
    status: 'pending',
    procedimento: 'Cirurgia de Vesícula por Videolaparoscopia',
    medico: 'Dr. Carlos Alberto Mendes',
    crm: 'CRM/SP 123456',
    documentos: [
      { 
        nome: 'Termo de Consentimento', 
        obrigatorio: true, 
        status: 'pending',
        descricao: 'Termo de consentimento informado assinado pelo paciente'
      },
      { 
        nome: 'Relatório Médico', 
        obrigatorio: true, 
        status: 'pending',
        descricao: 'Relatório médico detalhando indicação cirúrgica'
      },
      { 
        nome: 'Exames Pré-Operatórios', 
        obrigatorio: true, 
        status: 'pending',
        descricao: 'Exames laboratoriais e de imagem pré-operatórios'
      },
      { 
        nome: 'Autorização da Operadora', 
        obrigatorio: false, 
        status: 'pending',
        descricao: 'Autorização prévia da operadora (se aplicável)'
      }
    ]
  },
  '21065955': {
    id: '21065955',
    paciente: 'Maria Oliveira Costa',
    cpf: '987.654.321-00',
    operadora: 'Bradesco Saúde',
    tipo: 'Internação',
    dataEmissao: '2025-11-17',
    valorTotal: 'R$ 8.320,00',
    status: 'partial',
    procedimento: 'Internação Clínica - Pneumonia',
    medico: 'Dra. Ana Paula Rodrigues',
    crm: 'CRM/RJ 654321',
    documentos: [
      { 
        nome: 'Termo de Internação', 
        obrigatorio: true, 
        status: 'complete',
        descricao: 'Termo de internação hospitalar assinado'
      },
      { 
        nome: 'Prescrição Médica', 
        obrigatorio: true, 
        status: 'complete',
        descricao: 'Prescrição médica completa com medicamentos e procedimentos'
      },
      { 
        nome: 'Termo de Prorrogação', 
        obrigatorio: true, 
        status: 'pending',
        descricao: 'Termo de prorrogação de internação (se aplicável)'
      },
      { 
        nome: 'Relatório de Evolução', 
        obrigatorio: false, 
        status: 'pending',
        descricao: 'Relatório diário de evolução do paciente'
      }
    ]
  }
};

const AnalistaDetails = () => {
  const navigate = useNavigate();
  const { guideId } = useParams();
  const guide = mockGuides[guideId || ''];
  
  const [documentStatus, setDocumentStatus] = useState(
    guide?.documentos.reduce((acc: any, doc: any) => {
      acc[doc.nome] = doc.status === 'complete';
      return acc;
    }, {}) || {}
  );

  if (!guide) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
        <Card className="w-96">
          <CardHeader>
            <CardTitle>Guia não encontrada</CardTitle>
            <CardDescription>A guia solicitada não foi encontrada.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/analista')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const toggleDocument = (docName: string) => {
    setDocumentStatus((prev: any) => ({
      ...prev,
      [docName]: !prev[docName]
    }));
  };

  const calculateProgress = () => {
    const obrigatorios = guide.documentos.filter((d: any) => d.obrigatorio);
    const completos = obrigatorios.filter((d: any) => documentStatus[d.nome]);
    return (completos.length / obrigatorios.length) * 100;
  };

  const getPendingCount = () => {
    return guide.documentos.filter((d: any) => d.obrigatorio && !documentStatus[d.nome]).length;
  };

  const allComplete = getPendingCount() === 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/analista')}
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
                  Checklist de Documentação
                </h1>
                <p className="text-sm text-gray-500">
                  Guia #{guide.id}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Baixar XML
            </Button>
            <Button 
              className="bg-purple-600 hover:bg-purple-700 gap-2"
              disabled={!allComplete}
            >
              <Send className="h-4 w-4" />
              Enviar para Operadora
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-3 gap-6">
          {/* Coluna Esquerda: Informações da Guia */}
          <div className="col-span-1 space-y-6">
            {/* Card de Progresso */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Status Geral</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center py-4">
                  <div className="text-5xl font-bold text-purple-600 mb-2">
                    {Math.round(calculateProgress())}%
                  </div>
                  <p className="text-sm text-gray-600">Documentação Completa</p>
                </div>

                {allComplete ? (
                  <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    <span className="text-sm font-medium text-green-800">
                      Pronta para envio
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <AlertCircle className="h-5 w-5 text-red-600" />
                    <span className="text-sm font-medium text-red-800">
                      {getPendingCount()} documento(s) pendente(s)
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Card de Informações do Paciente */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Informações da Guia</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3">
                  <User className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{guide.paciente}</p>
                    <p className="text-xs text-gray-500">{guide.cpf}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Building2 className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{guide.operadora}</p>
                    <p className="text-xs text-gray-500">Operadora</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <FileText className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{guide.procedimento}</p>
                    <p className="text-xs text-gray-500">{guide.tipo}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <User className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{guide.medico}</p>
                    <p className="text-xs text-gray-500">{guide.crm}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {new Date(guide.dataEmissao).toLocaleDateString('pt-BR')}
                    </p>
                    <p className="text-xs text-gray-500">Data de Emissão</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <DollarSign className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{guide.valorTotal}</p>
                    <p className="text-xs text-gray-500">Valor Total</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Coluna Direita: Checklist de Documentos */}
          <div className="col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Checklist de Documentos</CardTitle>
                <CardDescription>
                  Marque os documentos conforme forem verificados e anexados
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {guide.documentos.map((doc: any, index: number) => (
                  <div
                    key={index}
                    className={`p-4 border-2 rounded-lg transition-all ${
                      documentStatus[doc.nome]
                        ? 'bg-green-50 border-green-200'
                        : doc.obrigatorio
                        ? 'bg-red-50 border-red-200'
                        : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <Checkbox
                        id={`doc-${index}`}
                        checked={documentStatus[doc.nome]}
                        onCheckedChange={() => toggleDocument(doc.nome)}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <label
                            htmlFor={`doc-${index}`}
                            className="text-sm font-medium text-gray-900 cursor-pointer"
                          >
                            {doc.nome}
                          </label>
                          {doc.obrigatorio && (
                            <Badge variant="destructive" className="text-xs">
                              Obrigatório
                            </Badge>
                          )}
                          {!doc.obrigatorio && (
                            <Badge variant="secondary" className="text-xs">
                              Opcional
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-gray-600">{doc.descricao}</p>
                      </div>
                      {documentStatus[doc.nome] ? (
                        <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                      ) : (
                        <XCircle className="h-5 w-5 text-gray-300 flex-shrink-0" />
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Card de Observações */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg">Observações</CardTitle>
              </CardHeader>
              <CardContent>
                <textarea
                  className="w-full h-24 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  placeholder="Adicione observações sobre a documentação..."
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalistaDetails;
