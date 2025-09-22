import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Phone, Mail, IdCard, CreditCard, Building, AlertCircle } from "lucide-react";

interface GeneralDataProps {
  patient?: {
    id: string;
    fullName: string;
    cpf: string;
    email: string;
    phone: string;
    medicalRecordNumber: string;
    status: string;
    age?: number;
    gender?: string;
    roomNumber?: string;
    admissionDate?: string;
    healthPlan?: string;
    createdAt: string;
    updatedAt: string;
  };
}

export function GeneralData({ patient }: GeneralDataProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IdCard className="h-5 w-5" />
              Identificação
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome Completo</Label>
                <Input id="nome" value={patient?.fullName || "Maria Silva Santos"} readOnly />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cpf">CPF</Label>
                <Input id="cpf" value={patient?.cpf || "123.456.789-00"} readOnly />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="rg">RG</Label>
                <Input id="rg" value="12.345.678-9" readOnly />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nascimento">Data de Nascimento</Label>
                <Input id="nascimento" value="15/03/1980" readOnly />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5" />
              Contato
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="telefone">Telefone</Label>
              <Input id="telefone" value={patient?.phone || "(11) 98765-4321"} readOnly />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input id="email" value={patient?.email || "maria.santos@email.com"} readOnly />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endereco">Endereço</Label>
              <Input id="endereco" value="Rua das Flores, 123 - São Paulo/SP" readOnly />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Informações do Atendimento
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Número do Prontuário</Label>
              <Input value={patient?.medicalRecordNumber || "PAC-2024-001234"} readOnly />
            </div>
            <div className="space-y-2">
              <Label>Data de Internação</Label>
              <Input value={patient?.admissionDate ? new Date(patient.admissionDate).toLocaleDateString('pt-BR') : "20/12/2024"} readOnly />
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <div>
                <Badge variant="secondary" className={patient?.status === 'ACTIVE' ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                  {patient?.status === 'ACTIVE' ? 'Internado' : patient?.status === 'INACTIVE' ? 'Alta' : 'Transferência'}
                </Badge>
              </div>
            </div>
          </div>
          
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Médico Responsável</Label>
              <Input value="Dr. João Carlos Pereira" readOnly />
            </div>
            <div className="space-y-2">
              <Label>Convênio</Label>
              <Input value={patient?.healthPlan || "Unimed Nacional"} readOnly />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Informações do Plano de Saúde
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Nome do Plano</Label>
                <Input value="Unimed Nacional - Executivo Plus" readOnly />
              </div>
              <div className="space-y-2">
                <Label>Número da Carteirinha</Label>
                <Input value="123456789012345" readOnly />
              </div>
              <div className="space-y-2">
                <Label>Validade</Label>
                <Input value="12/2025" readOnly />
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Direito de Acomodação pelo Plano</Label>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-primary text-primary-foreground">
                    <Building className="h-3 w-3 mr-1" />
                    Apartamento
                  </Badge>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Acomodação Atual</Label>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-primary text-primary-foreground">
                    <Building className="h-3 w-3 mr-1" />
                    Apartamento
                  </Badge>
                  <Badge variant="secondary" className="bg-success text-success-foreground">
                    Correto
                  </Badge>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Observações</Label>
                <div className="p-3 bg-muted rounded-md text-sm text-muted-foreground">
                  Paciente com direito a apartamento individual conforme contrato do plano.
                </div>
              </div>
            </div>
          </div>
          
          {/* Exemplo de alerta quando há divergência */}
          {/* <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
            <div className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-4 w-4" />
              <span className="font-medium">Atenção: Divergência na Acomodação</span>
            </div>
            <p className="text-sm text-destructive/80 mt-1">
              Paciente está em apartamento mas o plano só cobre enfermaria. Verificar com setor de convênios.
            </p>
          </div> */}
        </CardContent>
      </Card>
    </div>
  );
}