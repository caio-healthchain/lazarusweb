import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import {
  ArrowLeft, AlertTriangle, CheckCircle, XCircle, FileText,
  Scale, DollarSign, Clock, Brain, Download, Send, History,
  ArrowRight, User, Building2, Stethoscope, Calendar
} from 'lucide-react';
import {
  mockAccounts, getStatusLabel, getStatusColor, getPrioridadeColor,
  getGlosaStatusColor, getGlosaStatusLabel, WorkflowAccount
} from '@/data/workflowMockData';

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
};

const GlosaDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [account, setAccount] = useState<WorkflowAccount | undefined>(
    mockAccounts.find(a => a.id === id)
  );
  const [justificativa, setJustificativa] = useState('');
  const [laudoGerado, setLaudoGerado] = useState(false);

  if (!account) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-8 text-center">
          <h2 className="text-xl font-bold mb-2">Conta n\u00e3o encontrada</h2>
          <Button onClick={() => navigate('/glosas')}>Voltar</Button>
        </Card>
      </div>
    );
  }

  const handleAceitarGlosa = (glosaId: string) => {
    setAccount(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        glosas: prev.glosas.map(g =>
          g.id === glosaId ? { ...g, status: 'aceita' as const } : g
        )
      };
    });
    toast.success('Glosa aceita com sucesso.');
  };

  const handleRecursarGlosa = (glosaId: string) => {
    setAccount(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        glosas: prev.glosas.map(g =>
          g.id === glosaId ? { ...g, status: 'em_recurso' as const } : g
        )
      };
    });
    toast.info('Recurso de glosa registrado. Preencha a justificativa.');
  };

  const handleGerarLaudo = () => {
    setLaudoGerado(true);
    toast.success('Laudo gerado com sucesso! Pronto para envio \u00e0 operadora.');
  };

  const valorGlosadoTotal = account.glosas.reduce((acc, g) => acc + g.valorGlosado, 0);
  const glosasPendentes = account.glosas.filter(g => g.status === 'pendente').length;
  const glosasAceitas = account.glosas.filter(g => g.status === 'aceita').length;
  const glosasEmRecurso = account.glosas.filter(g => g.status === 'em_recurso').length;
  const glosasRevertidas = account.glosas.filter(g => g.status === 'revertida').length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => navigate('/glosas')}>
                <ArrowLeft className="h-4 w-4 mr-1" /> Voltar
              </Button>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold">{account.id}</h1>
                  <Badge className={getStatusColor(account.status)} variant="secondary">
                    {getStatusLabel(account.status)}
                  </Badge>
                </div>
                <p className="text-sm text-gray-500">{account.paciente} - {account.procedimentoPrincipal}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {!laudoGerado && account.laudo === null && (
                <Button size="sm" onClick={handleGerarLaudo} className="bg-purple-600 hover:bg-purple-700">
                  <FileText className="h-4 w-4 mr-1" /> Gerar Laudo
                </Button>
              )}
              {(laudoGerado || account.laudo) && (
                <Button size="sm" variant="outline" className="text-purple-600 border-purple-300">
                  <Download className="h-4 w-4 mr-1" /> Baixar Laudo
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Resumo */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
          <Card className="p-3">
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
              <Building2 className="h-3.5 w-3.5" /> Operadora
            </div>
            <p className="font-semibold text-sm">{account.operadora}</p>
          </Card>
          <Card className="p-3">
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
              <DollarSign className="h-3.5 w-3.5" /> Valor Conta
            </div>
            <p className="font-bold text-sm text-emerald-700">{formatCurrency(account.valorTotal)}</p>
          </Card>
          <Card className="p-3">
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
              <AlertTriangle className="h-3.5 w-3.5" /> Valor Glosado
            </div>
            <p className="font-bold text-sm text-red-600">{formatCurrency(valorGlosadoTotal)}</p>
          </Card>
          <Card className="p-3">
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
              <Scale className="h-3.5 w-3.5" /> Taxa de Glosa
            </div>
            <p className="font-bold text-sm text-orange-600">
              {account.valorTotal > 0 ? ((valorGlosadoTotal / account.valorTotal) * 100).toFixed(1) : 0}%
            </p>
          </Card>
          <Card className="p-3">
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
              <Stethoscope className="h-3.5 w-3.5" /> M\u00e9dico
            </div>
            <p className="font-semibold text-sm">{account.medicoResponsavel}</p>
          </Card>
          <Card className="p-3">
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
              <FileText className="h-3.5 w-3.5" /> Laudo
            </div>
            <p className="font-semibold text-sm">
              {laudoGerado || account.laudo ? (
                <span className="text-purple-600">Gerado</span>
              ) : (
                <span className="text-gray-400">Pendente</span>
              )}
            </p>
          </Card>
        </div>

        {/* Copilot IA */}
        <Card className="mb-6 border-purple-200 bg-gradient-to-r from-purple-50 to-white">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="flex items-center justify-center w-8 h-8 bg-purple-600 rounded-lg flex-shrink-0">
                <Brain className="h-4 w-4 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-purple-900 text-sm mb-1">Copilot - An\u00e1lise de Glosas</h4>
                <div className="text-sm text-purple-800 space-y-1">
                  <p>Esta conta possui <strong>{account.glosas.length} glosa(s)</strong> totalizando <strong>{formatCurrency(valorGlosadoTotal)}</strong>.</p>
                  <p>Recomenda\u00e7\u00e3o: {glosasEmRecurso > 0 ?
                    `Existem ${glosasEmRecurso} glosa(s) em recurso. Gere o laudo com as justificativas cl\u00ednicas para envio \u00e0 operadora.` :
                    glosasPendentes > 0 ?
                    `Analise as ${glosasPendentes} glosa(s) pendentes. Para ${account.operadora}, o prazo de recurso \u00e9 de 30 dias.` :
                    'Todas as glosas foram tratadas. Gere o laudo final para fechamento.'
                  }</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Laudo Gerado */}
        {(laudoGerado || account.laudo) && (
          <Card className="mb-6 border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2 text-green-800">
                <CheckCircle className="h-5 w-5" /> Laudo da Conta
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-white p-4 rounded-lg border text-sm space-y-3">
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="font-bold text-lg">LAUDO DE CONTA HOSPITALAR</span>
                  <span className="text-gray-500">N\u00ba {account.id}-L001</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p><strong>Paciente:</strong> {account.paciente}</p>
                    <p><strong>Operadora:</strong> {account.operadora}</p>
                    <p><strong>Procedimento:</strong> {account.procedimentoPrincipal}</p>
                  </div>
                  <div>
                    <p><strong>Interna\u00e7\u00e3o:</strong> {new Date(account.dataInternacao).toLocaleDateString('pt-BR')}</p>
                    <p><strong>Alta:</strong> {account.dataAlta ? new Date(account.dataAlta).toLocaleDateString('pt-BR') : 'N/A'}</p>
                    <p><strong>M\u00e9dico:</strong> {account.medicoResponsavel}</p>
                  </div>
                </div>
                <div className="border-t pt-2">
                  <p><strong>Valor da Conta:</strong> {formatCurrency(account.valorTotal)}</p>
                  <p><strong>Valor Glosado:</strong> {formatCurrency(valorGlosadoTotal)}</p>
                  <p><strong>Valor L\u00edquido:</strong> {formatCurrency(account.valorTotal - valorGlosadoTotal)}</p>
                </div>
                <div className="border-t pt-2">
                  <p className="font-semibold mb-1">Resumo das Glosas:</p>
                  {account.glosas.map(g => (
                    <p key={g.id} className="text-gray-600">
                      - {g.descricao}: {formatCurrency(g.valorGlosado)} ({getGlosaStatusLabel(g.status)})
                    </p>
                  ))}
                </div>
                {account.laudo && (
                  <div className="border-t pt-2">
                    <p className="font-semibold mb-1">Parecer:</p>
                    <p className="text-gray-600">{account.laudo.parecer}</p>
                    <p className="text-gray-600 mt-1"><strong>Conclus\u00e3o:</strong> {account.laudo.conclusao}</p>
                  </div>
                )}
                <div className="border-t pt-2 text-right text-gray-500 text-xs">
                  Gerado em: {new Date().toLocaleString('pt-BR')} | Hospital Sagrada Fam\u00edlia
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tabs */}
        <Tabs defaultValue="glosas" className="space-y-4">
          <TabsList className="bg-white border">
            <TabsTrigger value="glosas">Glosas ({account.glosas.length})</TabsTrigger>
            <TabsTrigger value="procedimentos">Procedimentos ({account.procedimentos.length})</TabsTrigger>
            <TabsTrigger value="historico">Hist\u00f3rico ({account.historico.length})</TabsTrigger>
          </TabsList>

          {/* Glosas */}
          <TabsContent value="glosas">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-500" /> Detalhamento de Glosas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 gap-3 mb-4">
                  <div className="text-center p-2 bg-yellow-50 rounded-lg">
                    <p className="text-xs text-gray-500">Pendentes</p>
                    <p className="text-lg font-bold text-yellow-600">{glosasPendentes}</p>
                  </div>
                  <div className="text-center p-2 bg-orange-50 rounded-lg">
                    <p className="text-xs text-gray-500">Em Recurso</p>
                    <p className="text-lg font-bold text-orange-600">{glosasEmRecurso}</p>
                  </div>
                  <div className="text-center p-2 bg-red-50 rounded-lg">
                    <p className="text-xs text-gray-500">Aceitas</p>
                    <p className="text-lg font-bold text-red-600">{glosasAceitas}</p>
                  </div>
                  <div className="text-center p-2 bg-green-50 rounded-lg">
                    <p className="text-xs text-gray-500">Revertidas</p>
                    <p className="text-lg font-bold text-green-600">{glosasRevertidas}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {account.glosas.map(glosa => (
                    <div key={glosa.id} className="p-4 bg-gray-50 rounded-lg border">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-mono text-xs text-gray-500">{glosa.codigoProcedimento}</span>
                            <Badge className={getGlosaStatusColor(glosa.status)} variant="secondary">
                              {getGlosaStatusLabel(glosa.status)}
                            </Badge>
                            <Badge variant="secondary" className="text-xs">
                              {glosa.tipo === 'administrativa' ? 'Administrativa' :
                               glosa.tipo === 'tecnica' ? 'T\u00e9cnica' : 'Linear'}
                            </Badge>
                          </div>
                          <p className="font-medium">{glosa.descricao}</p>
                          <p className="text-sm text-gray-600 mt-1">{glosa.motivo}</p>
                          {glosa.justificativaRecurso && (
                            <div className="mt-2 p-2 bg-blue-50 rounded text-sm">
                              <strong>Justificativa do Recurso:</strong> {glosa.justificativaRecurso}
                            </div>
                          )}
                        </div>
                        <div className="text-right ml-4">
                          <p className="text-lg font-bold text-red-600">{formatCurrency(glosa.valorGlosado)}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(glosa.dataGlosa).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                      </div>

                      {glosa.status === 'pendente' && (
                        <div className="flex items-center gap-2 mt-3 pt-3 border-t">
                          <Button size="sm" variant="outline" className="text-red-600 border-red-300"
                            onClick={() => handleAceitarGlosa(glosa.id)}>
                            <XCircle className="h-3.5 w-3.5 mr-1" /> Aceitar Glosa
                          </Button>
                          <Button size="sm" className="bg-blue-600 hover:bg-blue-700"
                            onClick={() => handleRecursarGlosa(glosa.id)}>
                            <Scale className="h-3.5 w-3.5 mr-1" /> Recursar
                          </Button>
                        </div>
                      )}

                      {glosa.status === 'em_recurso' && !glosa.justificativaRecurso && (
                        <div className="mt-3 pt-3 border-t space-y-2">
                          <Textarea
                            placeholder="Justificativa cl\u00ednica para o recurso..."
                            value={justificativa}
                            onChange={(e) => setJustificativa(e.target.value)}
                          />
                          <Button size="sm" onClick={() => {
                            if (justificativa.trim()) {
                              setAccount(prev => {
                                if (!prev) return prev;
                                return {
                                  ...prev,
                                  glosas: prev.glosas.map(g =>
                                    g.id === glosa.id ? { ...g, justificativaRecurso: justificativa } : g
                                  )
                                };
                              });
                              setJustificativa('');
                              toast.success('Justificativa registrada!');
                            }
                          }}>
                            <Send className="h-3.5 w-3.5 mr-1" /> Enviar Justificativa
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Procedimentos */}
          <TabsContent value="procedimentos">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Procedimentos da Conta</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {account.procedimentos.map(proc => (
                    <div key={proc.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono text-xs text-gray-500">{proc.codigo}</span>
                          <Badge variant="secondary" className={
                            proc.status === 'aprovado' ? 'bg-green-100 text-green-800' :
                            proc.status === 'glosado' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }>
                            {proc.status.charAt(0).toUpperCase() + proc.status.slice(1)}
                          </Badge>
                        </div>
                        <p className="font-medium">{proc.descricao}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{formatCurrency(proc.valorGuia)}</p>
                        <p className="text-xs text-gray-500">Contratual: {formatCurrency(proc.valorContratual)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Hist\u00f3rico */}
          <TabsContent value="historico">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <History className="h-5 w-5 text-gray-500" /> Hist\u00f3rico do Workflow
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200" />
                  <div className="space-y-4">
                    {[...account.historico].reverse().map((entry, index) => (
                      <div key={entry.id} className="relative pl-10">
                        <div className={`absolute left-2.5 w-3 h-3 rounded-full border-2 border-white ${
                          index === 0 ? 'bg-blue-500' : 'bg-gray-300'
                        }`} />
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium text-sm">{entry.usuario}</span>
                            <span className="text-xs text-gray-500">
                              {new Date(entry.data).toLocaleString('pt-BR')}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">{entry.observacao}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default GlosaDetails;
