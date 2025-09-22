import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Stethoscope, Edit, CheckCircle, AlertCircle, Clock } from "lucide-react";
import { PortOverrideModal } from "../PortOverrideModal";
import { useToast } from "@/hooks/use-toast";

interface Procedure {
  id: string;
  code: string;
  name: string;
  suggestedPort: number;
  currentPort: number;
  status: 'pending' | 'confirmed' | 'overridden';
  isEdited: boolean;
}

interface SurgeryTabProps {
  onAuditLog: (log: any) => void;
  patient?: any;
  procedures?: any[];
}

export function SurgeryTab({ onAuditLog, patient, procedures: proceduresFromProps }: SurgeryTabProps) {
  const { toast } = useToast();
  const [procedures, setProcedures] = useState<Procedure[]>([
    {
      id: "1",
      code: "31.602.31-5",
      name: "Colecistectomia laparoscópica",
      suggestedPort: 4,
      currentPort: 4,
      status: 'pending',
      isEdited: false
    },
    {
      id: "2", 
      code: "33.405.70-2",
      name: "Apendicectomia laparoscópica",
      suggestedPort: 3,
      currentPort: 3,
      status: 'pending',
      isEdited: false
    },
    {
      id: "3",
      code: "40.302.16-0", 
      name: "Ressecção de tumor de cólon",
      suggestedPort: 6,
      currentPort: 6,
      status: 'pending',
      isEdited: false
    }
  ]);

  const [selectedProcedure, setSelectedProcedure] = useState<Procedure | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleEditPort = (procedure: Procedure) => {
    setSelectedProcedure(procedure);
    setIsModalOpen(true);
  };

  const handleConfirmPort = (procedureId: string) => {
    setProcedures(prev => prev.map(p => 
      p.id === procedureId 
        ? { ...p, status: 'confirmed' as const }
        : p
    ));
    
    toast({
      title: "Porte confirmado",
      description: "O porte cirúrgico foi confirmado com sucesso.",
      variant: "default",
    });
  };

  const handlePortOverride = (newPort: number, justification: string) => {
    if (!selectedProcedure) return;

    const previousPort = selectedProcedure.currentPort;
    
    // Atualizar o procedimento
    setProcedures(prev => prev.map(p => 
      p.id === selectedProcedure.id 
        ? { 
            ...p, 
            currentPort: newPort, 
            status: 'overridden' as const,
            isEdited: true 
          }
        : p
    ));

    // Adicionar log de auditoria
    onAuditLog({
      user: "Ana Costa (Analista)",
      procedureId: selectedProcedure.id,
      procedureName: selectedProcedure.name,
      previousPort: previousPort,
      newPort: newPort,
      justification: justification
    });

    toast({
      title: "Porte alterado",
      description: `Porte alterado de ${previousPort} para ${newPort} com justificativa registrada.`,
      variant: "default",
    });

    setIsModalOpen(false);
    setSelectedProcedure(null);
  };

  const getStatusBadge = (status: string, isEdited: boolean) => {
    switch (status) {
      case 'confirmed':
        return <Badge variant="secondary" className="bg-success text-success-foreground"><CheckCircle className="h-3 w-3 mr-1" />Confirmado</Badge>;
      case 'overridden':
        return <Badge variant="secondary" className="bg-warning text-warning-foreground"><Edit className="h-3 w-3 mr-1" />Alterado</Badge>;
      default:
        return <Badge variant="outline"><Clock className="h-3 w-3 mr-1" />Pendente</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Stethoscope className="h-5 w-5" />
            Procedimentos Cirúrgicos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>Procedimento</TableHead>
                <TableHead className="text-center">Porte Sugerido</TableHead>
                <TableHead className="text-center">Porte Atual</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-center">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {procedures.map((procedure) => (
                <TableRow key={procedure.id}>
                  <TableCell className="font-mono text-sm">{procedure.code}</TableCell>
                  <TableCell>{procedure.name}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                      {procedure.suggestedPort}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge 
                      variant={procedure.isEdited ? "secondary" : "outline"}
                      className={procedure.isEdited ? "bg-warning/20 text-warning border-warning/30" : ""}
                    >
                      {procedure.currentPort}
                      {procedure.isEdited && <AlertCircle className="h-3 w-3 ml-1" />}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    {getStatusBadge(procedure.status, procedure.isEdited)}
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex gap-2 justify-center">
                      {procedure.status === 'pending' && (
                        <Button 
                          size="sm" 
                          variant="default"
                          onClick={() => handleConfirmPort(procedure.id)}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Confirmar
                        </Button>
                      )}
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleEditPort(procedure)}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Editar
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <PortOverrideModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        procedure={selectedProcedure}
        onConfirm={handlePortOverride}
      />
    </div>
  );
}