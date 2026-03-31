import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import {
  ArrowLeft, FileText, Package, Pill, ClipboardCheck, History,
  CheckCircle, XCircle, AlertTriangle, Clock, User, Building2,
  Stethoscope, Calendar, DollarSign, Brain, Send, ArrowRight
} from 'lucide-react';
import {
  WorkflowAccount, mockAccounts, getStatusLabel, getStatusColor,
  getPrioridadeColor, getGlosaStatusColor, getGlosaStatusLabel
} from '@/data/workflowMockData';

interface AccountDetailsProps {
  frente: 'administrativa' | 'enfermagem' | 'medica';
  backPath: string;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
};

const AccountDetails = ({ frente, backPath }: AccountDetailsProps) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [account, setAccount] = useState<WorkflowAccount | undefined>(
    mockAccounts.find(a => a.id === id)
  );
  const [observacao, setObservacao] = useState('');

  if (!account) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-8 text-center">
          <h2 className="text-xl font-bold mb-2">Conta não encontrada</h2>
          <Button onClick={() => navigate(backPath)}>Voltar</Button>
        </Card>
      </div>
    );
  }

  const handleAvancar = () => {
    toast.success('Conta avançada para a próxima etapa do workflow!');
    navigate(backPath);
  };

  const handleDevolver = () => {
    toast.info('Conta devolvida para a etapa anterior com pendência.');
    navigate(backPath);
  };

  const frenteConfig = {
    administrativa: { color: 'purple', label: 'Frente Administrativa', icon: ClipboardCheck },
    enfermagem: { color: 'blue', label: 'Frente de Enfermagem', icon: Package },
    medica: { color: 'emerald', label: 'Frente Médica', icon: Stethoscope }
  };

  const config = frenteConfig[frente];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => navigate(backPath)}>
                <ArrowLeft className="h-4 w-4 mr-1" /> Voltar
              </Button>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold">{account.id}</h1>
                  <Badge className={getStatusColor(account.status)} variant="secondary">
                    {getStatusLabel(account.status)}
                  </Badge>
                  <Badge className={getPrioridadeColor(account.prioridade)} variant="secondary">
                    {account.prioridade.toUpperCase()}
                  </Badge>
                </div>
                <p className="text-sm text-gray-500">{account.paciente} - {account.procedimentoPrincipal}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleDevolver} className="text-orange-600 border-orange-300">
                <ArrowLeft className="h-4 w-4 mr-1" /> Devolver
              </Button>
              <Button size="sm" onClick={handleAvancar} className="bg-emerald-600 hover:bg-emerald-700">
                Avançar <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
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
              <Stethoscope className="h-3.5 w-3.5" /> Médico
            </div>
            <p className="font-semibold text-sm">{account.medicoResponsavel}</p>
          </Card>
          <Card className="p-3">
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
              <Calendar className="h-3.5 w-3.5" /> Internação
            </div>
            <p className="font-semibold text-sm">{new Date(account.dataInternacao).toLocaleDateString('pt-BR')}</p>
          </Card>
          <Card className="p-3">
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
              <Calendar className="h-3.5 w-3.5" /> Alta
            </div>
            <p className="font-semibold text-sm">{account.dataAlta ? new Date(account.dataAlta).toLocaleDateString('pt-BR') : 'Em internação'}</p>
          </Card>
          <Card className="p-3">
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
              <DollarSign className="h-3.5 w-3.5" /> Valor Total
            </div>
            <p className="font-bold text-sm text-emerald-700">{formatCurrency(account.valorTotal)}</p>
          </Card>
          <Card className="p-3">
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
              <Clock className="h-3.5 w-3.5" /> SLA
            </div>
            <p className={`font-bold text-sm ${account.slaRestante < 12 ? 'text-red-600' : 'text-gray-900'}`}>
              {account.slaRestante}h restantes
            </p>
          </Card>
        </div>

        {/* Copilot IA - Recomendações Contextuais */}
        <Card className="mb-6 border-purple-200 bg-gradient-to-r from-purple-50 to-white">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="flex items-center justify-center w-8 h-8 bg-purple-600 rounded-lg flex-shrink-0">
                <Brain className="h-4 w-4 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-purple-900 text-sm mb-1">Copilot - Recomendações</h4>
                {frente === 'administrativa' && (
                  <div className="text-sm text-purple-800 space-y-1">
                    <p>Verifique se a <strong>autorização prévia</strong> está dentro da validade. Para {account.operadora}, o prazo médio de aprovação é de 48h.</p>
                    <p>Documentos pendentes: {account.documentos.filter(d => d.status === 'pendente').length} item(ns). Priorize os obrigatórios.</p>
                  </div>
                )}
                {frente === 'enfermagem' && (
                  <div className="text-sm text-purple-800 space-y-1">
                    <p>Existem <strong>{account.materiais.filter(m => !m.validado).length} materiais</strong> e <strong>{account.medicamentos.filter(m => !m.validado).length} medicamentos</strong> pendentes de validação.</p>
                    <p>Confira lotes, validades e notas fiscais antes de avançar.</p>
                  </div>
                )}
                {frente === 'medica' && (
                  <div className="text-sm text-purple-800 space-y-1">
                    <p>Procedimento principal: <strong>{account.procedimentoPrincipal}</strong>. Verifique se há justificativa clínica para todos os procedimentos.</p>
                    <p>Para {account.operadora}, o contrato exige relatório cirúrgico detalhado.</p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="procedimentos" className="space-y-4">
          <TabsList className="bg-white border">
            <TabsTrigger value="procedimentos">Procedimentos</TabsTrigger>
            <TabsTrigger value="materiais">Materiais ({account.materiais.length})</TabsTrigger>
            <TabsTrigger value="medicamentos">Medicamentos ({account.medicamentos.length})</TabsTrigger>
            <TabsTrigger value="documentos">Documentos ({account.documentos.length})</TabsTrigger>
            <TabsTrigger value="auditoria">Auditoria ({account.auditoriaConcorrente.length})</TabsTrigger>
            <TabsTrigger value="historico">Histórico ({account.historico.length})</TabsTrigger>
          </TabsList>

          {/* Procedimentos */}
          <TabsContent value="procedimentos">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Procedimentos</CardTitle>
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
                        {proc.porte !== '-' && <p className="text-xs text-gray-500">Porte: {proc.porte}</p>}
                        {proc.justificativa && <p className="text-xs text-orange-600 mt-1">{proc.justificativa}</p>}
                      </div>
                      <div className="text-right space-y-1">
                        <div className="text-sm">
                          <span className="text-gray-500">Guia: </span>
                          <span className="font-medium">{formatCurrency(proc.valorGuia)}</span>
                        </div>
                        <div className="text-sm">
                          <span className="text-gray-500">Contratual: </span>
                          <span className="font-medium">{formatCurrency(proc.valorContratual)}</span>
                        </div>
                        {proc.valorGuia !== proc.valorContratual && (
                          <div className="text-xs text-red-600">
                            Dif: {formatCurrency(proc.valorGuia - proc.valorContratual)}
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Button size="sm" variant="outline" className="text-green-600 border-green-300 h-8">
                          <CheckCircle className="h-3.5 w-3.5" />
                        </Button>
                        <Button size="sm" variant="outline" className="text-red-600 border-red-300 h-8">
                          <XCircle className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Materiais */}
          <TabsContent value="materiais">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Package className="h-5 w-5 text-blue-500" /> Materiais e OPME
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-gray-50">
                        <th className="text-left p-3">Validado</th>
                        <th className="text-left p-3">Código</th>
                        <th className="text-left p-3">Descrição</th>
                        <th className="text-center p-3">Qtd</th>
                        <th className="text-right p-3">Valor Unit.</th>
                        <th className="text-right p-3">Valor Total</th>
                        <th className="text-left p-3">Fornecedor</th>
                        <th className="text-left p-3">Lote</th>
                      </tr>
                    </thead>
                    <tbody>
                      {account.materiais.map(mat => (
                        <tr key={mat.id} className="border-b hover:bg-gray-50">
                          <td className="p-3">
                            <Checkbox checked={mat.validado} onCheckedChange={() => {
                              setAccount(prev => {
                                if (!prev) return prev;
                                return {
                                  ...prev,
                                  materiais: prev.materiais.map(m => 
                                    m.id === mat.id ? { ...m, validado: !m.validado } : m
                                  )
                                };
                              });
                            }} />
                          </td>
                          <td className="p-3 font-mono text-xs">{mat.codigo}</td>
                          <td className="p-3 font-medium">{mat.descricao}</td>
                          <td className="p-3 text-center">{mat.quantidade}</td>
                          <td className="p-3 text-right">{formatCurrency(mat.valorUnitario)}</td>
                          <td className="p-3 text-right font-medium">{formatCurrency(mat.valorTotal)}</td>
                          <td className="p-3 text-xs">{mat.fornecedor}</td>
                          <td className="p-3 text-xs font-mono">{mat.lote}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="bg-gray-100 font-bold">
                        <td colSpan={5} className="p-3 text-right">Total:</td>
                        <td className="p-3 text-right">{formatCurrency(account.materiais.reduce((acc, m) => acc + m.valorTotal, 0))}</td>
                        <td colSpan={2}></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Medicamentos */}
          <TabsContent value="medicamentos">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Pill className="h-5 w-5 text-emerald-500" /> Medicamentos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-gray-50">
                        <th className="text-left p-3">Validado</th>
                        <th className="text-left p-3">Código</th>
                        <th className="text-left p-3">Descrição</th>
                        <th className="text-center p-3">Qtd</th>
                        <th className="text-right p-3">Valor Unit.</th>
                        <th className="text-right p-3">Valor Total</th>
                        <th className="text-left p-3">Farmácia</th>
                        <th className="text-center p-3">Prescrição</th>
                      </tr>
                    </thead>
                    <tbody>
                      {account.medicamentos.map(med => (
                        <tr key={med.id} className="border-b hover:bg-gray-50">
                          <td className="p-3">
                            <Checkbox checked={med.validado} onCheckedChange={() => {
                              setAccount(prev => {
                                if (!prev) return prev;
                                return {
                                  ...prev,
                                  medicamentos: prev.medicamentos.map(m => 
                                    m.id === med.id ? { ...m, validado: !m.validado } : m
                                  )
                                };
                              });
                            }} />
                          </td>
                          <td className="p-3 font-mono text-xs">{med.codigo}</td>
                          <td className="p-3 font-medium">{med.descricao}</td>
                          <td className="p-3 text-center">{med.quantidade}</td>
                          <td className="p-3 text-right">{formatCurrency(med.valorUnitario)}</td>
                          <td className="p-3 text-right font-medium">{formatCurrency(med.valorTotal)}</td>
                          <td className="p-3 text-xs">{med.farmacia}</td>
                          <td className="p-3 text-center">
                            {med.prescricaoMedica ? 
                              <CheckCircle className="h-4 w-4 text-green-500 mx-auto" /> : 
                              <AlertTriangle className="h-4 w-4 text-orange-500 mx-auto" />
                            }
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="bg-gray-100 font-bold">
                        <td colSpan={5} className="p-3 text-right">Total:</td>
                        <td className="p-3 text-right">{formatCurrency(account.medicamentos.reduce((acc, m) => acc + m.valorTotal, 0))}</td>
                        <td colSpan={2}></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Documentos */}
          <TabsContent value="documentos">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="h-5 w-5 text-purple-500" /> Checklist de Documentos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {account.documentos.map(doc => (
                    <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                      <div className="flex items-center gap-3">
                        <Checkbox 
                          checked={doc.status === 'validado'} 
                          onCheckedChange={() => {
                            setAccount(prev => {
                              if (!prev) return prev;
                              return {
                                ...prev,
                                documentos: prev.documentos.map(d => 
                                  d.id === doc.id ? { ...d, status: d.status === 'validado' ? 'pendente' : 'validado' } : d
                                )
                              };
                            });
                          }}
                        />
                        <div>
                          <p className="font-medium text-sm">{doc.nome}</p>
                          <p className="text-xs text-gray-500">
                            {doc.obrigatorio ? 'Obrigatório' : 'Opcional'} 
                            {doc.responsavel && ` • ${doc.responsavel}`}
                            {doc.dataUpload && ` • ${new Date(doc.dataUpload).toLocaleDateString('pt-BR')}`}
                          </p>
                        </div>
                      </div>
                      <Badge variant="secondary" className={
                        doc.status === 'validado' ? 'bg-green-100 text-green-800' :
                        doc.status === 'anexado' ? 'bg-blue-100 text-blue-800' :
                        doc.status === 'rejeitado' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }>
                        {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Auditoria Concorrente */}
          <TabsContent value="auditoria">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <ClipboardCheck className="h-5 w-5 text-amber-500" /> Auditoria Concorrente
                </CardTitle>
              </CardHeader>
              <CardContent>
                {account.auditoriaConcorrente.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-8">Nenhuma auditoria concorrente registrada.</p>
                ) : (
                  <div className="space-y-3">
                    {account.auditoriaConcorrente.map(audit => (
                      <div key={audit.id} className="p-4 bg-gray-50 rounded-lg border">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className={
                              audit.tipo === 'medica' ? 'bg-emerald-100 text-emerald-800' :
                              audit.tipo === 'enfermagem' ? 'bg-blue-100 text-blue-800' :
                              'bg-purple-100 text-purple-800'
                            }>
                              {audit.tipo.charAt(0).toUpperCase() + audit.tipo.slice(1)}
                            </Badge>
                            <span className="text-sm font-medium">{audit.auditor}</span>
                            <span className="text-xs text-gray-500">({audit.role})</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className={
                              audit.acao === 'aprovado' ? 'bg-green-100 text-green-800' :
                              audit.acao === 'ajustado' ? 'bg-blue-100 text-blue-800' :
                              audit.acao === 'pendencia' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }>
                              {audit.acao.charAt(0).toUpperCase() + audit.acao.slice(1)}
                            </Badge>
                            <span className="text-xs text-gray-500">{new Date(audit.data).toLocaleDateString('pt-BR')}</span>
                          </div>
                        </div>
                        <p className="text-sm"><strong>Item:</strong> {audit.item}</p>
                        <p className="text-sm text-gray-600">{audit.observacao}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Adicionar nova auditoria */}
                <div className="mt-4 p-4 border-2 border-dashed rounded-lg">
                  <h4 className="font-medium text-sm mb-2">Registrar Auditoria</h4>
                  <Textarea 
                    placeholder="Descreva a observação da auditoria..." 
                    value={observacao}
                    onChange={(e) => setObservacao(e.target.value)}
                    className="mb-2"
                  />
                  <Button size="sm" onClick={() => {
                    if (observacao.trim()) {
                      toast.success('Auditoria registrada com sucesso!');
                      setObservacao('');
                    }
                  }}>
                    <Send className="h-3.5 w-3.5 mr-1" /> Registrar
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Histórico do Workflow */}
          <TabsContent value="historico">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <History className="h-5 w-5 text-gray-500" /> Histórico do Workflow
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
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-sm">{entry.usuario}</span>
                              <span className="text-xs text-gray-500">({entry.role})</span>
                            </div>
                            <span className="text-xs text-gray-500">
                              {new Date(entry.data).toLocaleString('pt-BR')}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-gray-600 mb-1">
                            <Badge variant="outline" className="text-xs">{entry.de === 'criado' ? 'Novo' : getStatusLabel(entry.de as any)}</Badge>
                            <ArrowRight className="h-3 w-3" />
                            <Badge variant="outline" className="text-xs">{getStatusLabel(entry.para)}</Badge>
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

export default AccountDetails;
