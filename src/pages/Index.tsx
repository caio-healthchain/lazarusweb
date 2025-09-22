import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, CheckCircle, XCircle, AlertTriangle, Clock, Loader2 } from "lucide-react";
import { VirtualAssistant } from "@/components/VirtualAssistant";
import { 
  patientsService, 
  validationsService, 
  proceduresService,
  billingService,
  Patient, 
  Validation, 
  Procedure,
  Billing 
} from "@/services/api";
import { toast } from "sonner";

const Index = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("pendencias");

  // Query para buscar dados do paciente
  const { 
    data: patientResponse, 
    isLoading: patientLoading, 
    error: patientError 
  } = useQuery({
    queryKey: ['patient', id],
    queryFn: () => patientsService.getById(id!),
    select: (response) => response.data.data,
    enabled: !!id && id !== 'new',
    retry: 1,
  });

  // Query para buscar validações/pendências
  const { 
    data: validationsResponse, 
    isLoading: validationsLoading,
    error: validationsError 
  } = useQuery({
    queryKey: ['validations', id],
    queryFn: () => validationsService.getByPatient(id!),
    select: (response) => response.data.data,
    enabled: !!id && id !== 'new',
    retry: 1,
  });

  // Query para buscar procedimentos
  const { 
    data: proceduresResponse, 
    isLoading: proceduresLoading 
  } = useQuery({
    queryKey: ['procedures', id],
    queryFn: () => proceduresService.getAll({ patientId: id }),
    select: (response) => response.data.data,
    enabled: !!id && id !== 'new',
    retry: 1,
  });

  // Query para buscar faturamento
  const { 
    data: billingResponse, 
    isLoading: billingLoading 
  } = useQuery({
    queryKey: ['billing', id],
    queryFn: () => billingService.getByPatient(id!),
    select: (response) => response.data.data,
    enabled: !!id && id !== 'new',
    retry: 1,
  });

  // Mutations para aprovar/rejeitar validações
  const approveMutation = useMutation({
    mutationFn: (validationId: string) => validationsService.approve(validationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['validations', id] });
      toast.success('Validação aprovada com sucesso!');
    },
    onError: () => {
      toast.error('Erro ao aprovar validação');
    },
  });

  const rejectMutation = useMutation({
    mutationFn: ({ validationId, reason }: { validationId: string; reason?: string }) => 
      validationsService.reject(validationId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['validations', id] });
      toast.success('Validação rejeitada com sucesso!');
    },
    onError: () => {
      toast.error('Erro ao rejeitar validação');
    },
  });

  // Dados mockados como fallback
  const mockPatient: Patient = {
    id: id || "1",
    fullName: "Maria Silva Santos",
    cpf: "123.456.789-01",
    email: "maria.silva@email.com",
    phone: "(11) 99999-9999",
    medicalRecordNumber: "PRN-2024-0001",
    status: "ACTIVE",
    age: 45,
    gender: "F",
    roomNumber: "302-A",
    admissionDate: "2024-01-15",
    healthPlan: "Unimed",
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
  };

  const mockValidations: Validation[] = [
    {
      id: "1",
      patientId: id || "1",
      type: "SURGICAL_PORT",
      priority: "HIGH",
      status: "PENDING",
      title: "Divergência no Porte Cirúrgico",
      description: "Procedimento COLECISTECTOMIA LAPAROSCÓPICA identificado com porte 3, mas deveria ser porte 2",
      currentValue: "Porte 3",
      suggestedValue: "Porte 2",
      identifiedAt: "2024-01-15T10:30:00Z",
      createdAt: "2024-01-15T10:30:00Z",
      updatedAt: "2024-01-15T10:30:00Z",
    },
    {
      id: "2",
      patientId: id || "1",
      type: "MATERIAL_COVERAGE",
      priority: "MEDIUM",
      status: "PENDING",
      title: "Material sem Cobertura Contratual",
      description: "Grampeador Linear Cortante não está na base de materiais cobertos pela operadora",
      currentValue: "Não coberto",
      suggestedValue: "Justificativa necessária",
      identifiedAt: "2024-01-15T11:15:00Z",
      createdAt: "2024-01-15T11:15:00Z",
      updatedAt: "2024-01-15T11:15:00Z",
    },
    {
      id: "3",
      patientId: id || "1",
      type: "EXTRA_PACKAGE",
      priority: "MEDIUM",
      status: "PENDING",
      title: "Solicitação Extra-Pacote",
      description: "Exame de Tomografia solicitado fora do escopo do pacote contratado",
      currentValue: "Fora do pacote",
      suggestedValue: "Justificativa clínica",
      identifiedAt: "2024-01-15T14:20:00Z",
      createdAt: "2024-01-15T14:20:00Z",
      updatedAt: "2024-01-15T14:20:00Z",
    },
  ];

  // Usar dados da API ou fallback
  const patient = patientResponse || mockPatient;
  const validations = validationsResponse || mockValidations;
  const procedures = proceduresResponse || [];
  const billing = billingResponse || [];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH':
        return 'bg-red-100 text-red-800';
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-800';
      case 'LOW':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'HIGH':
        return 'Alta';
      case 'MEDIUM':
        return 'Média';
      case 'LOW':
        return 'Baixa';
      default:
        return priority;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'REJECTED':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'PENDING':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-600" />;
    }
  };

  const handleApprove = (validationId: string) => {
    approveMutation.mutate(validationId);
  };

  const handleReject = (validationId: string) => {
    rejectMutation.mutate({ validationId });
  };

  const pendingValidations = validations.filter(v => v.status === 'PENDING');

  // Mostrar toast se houver erro na API
  useEffect(() => {
    if (patientError || validationsError) {
      toast.error('Erro ao conectar com microsserviços. Usando dados de demonstração.');
    }
  }, [patientError, validationsError]);

  if (patientLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Carregando dados do paciente...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-primary text-primary-foreground p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate('/')}
                className="text-primary-foreground hover:bg-primary-foreground/10"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
              <div>
                <h1 className="text-2xl font-bold">Ficha do Paciente</h1>
                <p className="text-primary-foreground/80">Sistema de Enquadramento de Porte Cirúrgico</p>
              </div>
            </div>
            {(patientError || validationsError) && (
              <Alert className="max-w-sm bg-yellow-100 border-yellow-300">
                <AlertDescription className="text-yellow-800 text-sm">
                  ⚠️ Microsserviços offline - Dados de demonstração
                </AlertDescription>
              </Alert>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-8">
            <TabsTrigger value="pendencias" className="relative">
              Pendências
              {pendingValidations.length > 0 && (
                <Badge variant="destructive" className="ml-2 h-5 w-5 p-0 text-xs">
                  {pendingValidations.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="dados-gerais">Dados Gerais</TabsTrigger>
            <TabsTrigger value="cirurgia">Cirurgia</TabsTrigger>
            <TabsTrigger value="materiais">Materiais</TabsTrigger>
            <TabsTrigger value="extra-pacote">Extra-Pacote</TabsTrigger>
            <TabsTrigger value="faturamento">Faturamento</TabsTrigger>
            <TabsTrigger value="anexos">Anexos</TabsTrigger>
            <TabsTrigger value="auditoria">Auditoria</TabsTrigger>
          </TabsList>

          <TabsContent value="pendencias" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-600" />
                  <span>Pendências de Validação</span>
                  <Badge variant="destructive" className="ml-2">
                    {pendingValidations.length} pendente(s)
                  </Badge>
                </CardTitle>
                <p className="text-muted-foreground">
                  Divergências identificadas pelo motor de validação dos sistemas TAZY/MV
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                {validationsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin mr-2" />
                    <span>Carregando validações...</span>
                  </div>
                ) : (
                  validations.map((validation) => (
                    <Card key={validation.id} className="border-l-4 border-l-yellow-500">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              {getStatusIcon(validation.status)}
                              <h3 className="font-semibold">{validation.title}</h3>
                              <Badge className={getPriorityColor(validation.priority)}>
                                {getPriorityLabel(validation.priority)}
                              </Badge>
                              <Badge variant="outline">
                                {validation.status === 'PENDING' ? 'Pendente' : 
                                 validation.status === 'APPROVED' ? 'Aprovado' : 'Rejeitado'}
                              </Badge>
                            </div>
                            
                            <p className="text-muted-foreground mb-4">{validation.description}</p>
                            
                            <div className="grid grid-cols-2 gap-4 mb-4">
                              <div>
                                <p className="text-sm font-medium text-muted-foreground">Valor Atual:</p>
                                <p className="text-red-600 font-medium">{validation.currentValue}</p>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-muted-foreground">Valor Sugerido:</p>
                                <p className="text-green-600 font-medium">{validation.suggestedValue}</p>
                              </div>
                            </div>
                            
                            <p className="text-xs text-muted-foreground">
                              Identificado em: {new Date(validation.identifiedAt).toLocaleString('pt-BR')}
                            </p>
                          </div>
                          
                          {validation.status === 'PENDING' && (
                            <div className="flex space-x-2 ml-4">
                              <Button
                                size="sm"
                                onClick={() => handleApprove(validation.id)}
                                disabled={approveMutation.isPending}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                {approveMutation.isPending ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <>
                                    <CheckCircle className="h-4 w-4 mr-1" />
                                    Aprovar
                                  </>
                                )}
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleReject(validation.id)}
                                disabled={rejectMutation.isPending}
                              >
                                {rejectMutation.isPending ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <>
                                    <XCircle className="h-4 w-4 mr-1" />
                                    Rejeitar
                                  </>
                                )}
                              </Button>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="dados-gerais">
            <Card>
              <CardHeader>
                <CardTitle>Dados Gerais do Paciente</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Nome Completo</p>
                    <p className="font-medium">{patient.fullName}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">CPF</p>
                    <p className="font-medium">{patient.cpf}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Prontuário</p>
                    <p className="font-medium">{patient.medicalRecordNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Quarto</p>
                    <p className="font-medium">{patient.roomNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Convênio</p>
                    <p className="font-medium">{patient.healthPlan}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Data de Internação</p>
                    <p className="font-medium">
                      {patient.admissionDate ? new Date(patient.admissionDate).toLocaleDateString('pt-BR') : 'N/A'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="cirurgia">
            <Card>
              <CardHeader>
                <CardTitle>Informações Cirúrgicas</CardTitle>
              </CardHeader>
              <CardContent>
                {proceduresLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin mr-2" />
                    <span>Carregando procedimentos...</span>
                  </div>
                ) : procedures.length > 0 ? (
                  <div className="space-y-4">
                    {procedures.map((procedure: Procedure) => (
                      <div key={procedure.id} className="border rounded-lg p-4">
                        <h3 className="font-semibold">{procedure.name}</h3>
                        <p className="text-muted-foreground">{procedure.description}</p>
                        <div className="mt-2 flex space-x-4">
                          <span className="text-sm">Código: {procedure.code}</span>
                          <span className="text-sm">Porte: {procedure.surgicalPort}</span>
                          {procedure.suggestedPort && (
                            <span className="text-sm text-green-600">
                              Porte Sugerido: {procedure.suggestedPort}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-8">
                    Nenhum procedimento encontrado para este paciente.
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="materiais">
            <Card>
              <CardHeader>
                <CardTitle>Materiais Utilizados</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center text-muted-foreground py-8">
                  Módulo de materiais em desenvolvimento.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="extra-pacote">
            <Card>
              <CardHeader>
                <CardTitle>Solicitações Extra-Pacote</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center text-muted-foreground py-8">
                  Módulo de extra-pacote em desenvolvimento.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="faturamento">
            <Card>
              <CardHeader>
                <CardTitle>Informações de Faturamento</CardTitle>
              </CardHeader>
              <CardContent>
                {billingLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin mr-2" />
                    <span>Carregando faturamento...</span>
                  </div>
                ) : billing.length > 0 ? (
                  <div className="space-y-4">
                    {billing.map((bill: Billing) => (
                      <div key={bill.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-semibold">Valor: R$ {bill.amount.toFixed(2)}</p>
                            {bill.suggestedAmount && (
                              <p className="text-green-600">
                                Valor Sugerido: R$ {bill.suggestedAmount.toFixed(2)}
                              </p>
                            )}
                          </div>
                          <Badge variant={bill.status === 'APPROVED' ? 'default' : 'secondary'}>
                            {bill.status === 'APPROVED' ? 'Aprovado' : 
                             bill.status === 'REJECTED' ? 'Rejeitado' : 'Pendente'}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-8">
                    Nenhuma informação de faturamento encontrada.
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="anexos">
            <Card>
              <CardHeader>
                <CardTitle>Anexos e Documentos</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center text-muted-foreground py-8">
                  Módulo de anexos em desenvolvimento.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="auditoria">
            <Card>
              <CardHeader>
                <CardTitle>Log de Auditoria</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center text-muted-foreground py-8">
                  Módulo de auditoria em desenvolvimento.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      <VirtualAssistant />
    </div>
  );
};

export default Index;
