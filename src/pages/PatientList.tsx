import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge"; 
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Search, Plus, User, Calendar, MapPin, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { VirtualAssistant } from "@/components/VirtualAssistant";
import { patientsService, Patient } from "@/services/api";
import { toast } from "sonner";

const PatientList = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  // Query para buscar pacientes dos microsserviços
  const { 
    data: patientsResponse, 
    isLoading, 
    error,
    refetch 
  } = useQuery({
    queryKey: ['patients', searchTerm],
    queryFn: () => patientsService.getAll({ search: searchTerm }),
    select: (response) => response.data,
    retry: 1,
  });

  // Fallback para dados mockados se a API não estiver disponível
  const mockPatients: Patient[] = [
    {
      id: "1",
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
    },
    {
      id: "2", 
      fullName: "João Carlos Oliveira",
      cpf: "987.654.321-01",
      email: "joao.carlos@email.com",
      phone: "(11) 88888-8888",
      medicalRecordNumber: "PRN-2024-0002",
      status: "ACTIVE",
      age: 62,
      gender: "M",
      roomNumber: "205-B",
      admissionDate: "2024-01-18",
      healthPlan: "Bradesco Saúde",
      createdAt: "2024-01-18T10:00:00Z",
      updatedAt: "2024-01-18T10:00:00Z",
    },
    {
      id: "3",
      fullName: "Ana Paula Costa",
      cpf: "456.789.123-01",
      email: "ana.paula@email.com",
      phone: "(11) 77777-7777",
      medicalRecordNumber: "PRN-2024-0003",
      status: "INACTIVE",
      age: 34,
      gender: "F", 
      roomNumber: "401-A",
      admissionDate: "2024-01-10",
      healthPlan: "SulAmérica",
      createdAt: "2024-01-10T10:00:00Z",
      updatedAt: "2024-01-10T10:00:00Z",
    },
    {
      id: "4",
      fullName: "Carlos Eduardo Lima",
      cpf: "789.123.456-01",
      email: "carlos.eduardo@email.com",
      phone: "(11) 66666-6666",
      medicalRecordNumber: "PRN-2024-0004",
      status: "ACTIVE",
      age: 58,
      gender: "M",
      roomNumber: "103-C", 
      admissionDate: "2024-01-20",
      healthPlan: "Amil",
      createdAt: "2024-01-20T10:00:00Z",
      updatedAt: "2024-01-20T10:00:00Z",
    }
  ];

  // Usar dados da API ou fallback para mock
  // Garantir que patients seja sempre um array
  // A API retorna: { success: true, data: { data: [...] } }
  const patients = Array.isArray(patientsResponse?.data) ? patientsResponse.data : 
                   Array.isArray(patientsResponse?.data) ? patientsResponse.data :
                   (patientsResponse ? [] : mockPatients);

  const filteredPatients = Array.isArray(patients) ? patients.filter(patient =>
    patient.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.medicalRecordNumber.includes(searchTerm) ||
    (patient.healthPlan && patient.healthPlan.toLowerCase().includes(searchTerm.toLowerCase()))
  ) : [];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800">Internado</Badge>;
      case 'INACTIVE':
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Alta</Badge>;
      case 'SUSPENDED':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Transferência</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handlePatientClick = (patientId: string) => {
    navigate(`/patient/${patientId}`);
  };

  const handleNewPatient = () => {
    navigate('/patient/new');
  };

  const handleSearch = () => {
    refetch();
  };

  // Mostrar toast se houver erro na API
  useEffect(() => {
    if (error) {
      toast.error('Erro ao conectar com o microsserviço. Usando dados de demonstração.');
    }
  }, [error]);

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Lista de Pacientes</h1>
            <p className="text-muted-foreground mt-2">Gerencie os pacientes internados no hospital</p>
            {error && (
              <Alert className="mt-2 max-w-md">
                <AlertDescription className="text-sm">
                  ⚠️ Microsserviço offline - Usando dados de demonstração
                </AlertDescription>
              </Alert>
            )}
          </div>
          <div className="flex space-x-2">
            <Button onClick={() => navigate('/audit/new')} variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Nova Auditoria
            </Button>
            <Button onClick={handleNewPatient}>
              <Plus className="h-4 w-4 mr-2" />
              Novo Paciente
            </Button>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Buscar por nome, prontuário ou convênio..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button onClick={handleSearch} variant="outline">
              Buscar
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin mr-2" />
            <span>Carregando pacientes...</span>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredPatients.map((patient) => (
              <Card 
                key={patient.id} 
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => handlePatientClick(patient.id)}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={undefined} />
                        <AvatarFallback>
                          <User className="h-6 w-6" />
                        </AvatarFallback>
                      </Avatar>
                      
                      <div>
                        <h3 className="font-semibold text-lg">{patient.fullName}</h3>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-1">
                          <span>{patient.age} anos • {patient.gender === 'M' ? 'Masculino' : 'Feminino'}</span>
                          {patient.roomNumber && (
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-1" />
                              Quarto {patient.roomNumber}
                            </div>
                          )}
                          {patient.admissionDate && (
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              {new Date(patient.admissionDate).toLocaleDateString('pt-BR')}
                            </div>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          Prontuário: {patient.medicalRecordNumber}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-sm font-medium">{patient.healthPlan || 'Não informado'}</p>
                        <p className="text-xs text-muted-foreground">Convênio</p>
                      </div>
                      {getStatusBadge(patient.status)}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {filteredPatients.length === 0 && !isLoading && (
          <Card>
            <CardContent className="text-center py-12">
              <User className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">
                {searchTerm ? 'Nenhum paciente encontrado' : 'Nenhum paciente cadastrado'}
              </h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm 
                  ? 'Não há pacientes que correspondam aos critérios de busca.' 
                  : 'A base de dados está vazia. Adicione um novo paciente para começar.'}
              </p>
              {!searchTerm && (
                <Button onClick={handleNewPatient}>
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Primeiro Paciente
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
      <VirtualAssistant />
    </div>
  );
};

export default PatientList;
