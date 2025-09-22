import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, CheckCircle, Clock, FileText } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface Pendency {
  id: string;
  type: 'surgery' | 'material' | 'extra-package' | 'billing';
  title: string;
  description: string;
  currentValue: string;
  suggestedValue: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
}

interface PendenciesTabProps {
  patient?: any;
}

export function PendenciesTab({ patient }: PendenciesTabProps) {
  const [pendencies, setPendencies] = useState<Pendency[]>([
    {
      id: '1',
      type: 'surgery',
      title: 'Divergência no Porte Cirúrgico',
      description: 'Procedimento COLECISTECTOMIA LAPAROSCÓPICA identificado com porte 3, mas deveria ser porte 2',
      currentValue: 'Porte 3',
      suggestedValue: 'Porte 2',
      priority: 'high',
      status: 'pending',
      createdAt: new Date('2024-01-15T10:30:00')
    },
    {
      id: '2',
      type: 'material',
      title: 'Material sem Cobertura Contratual',
      description: 'Grampeador Linear Cortante não está na base de materiais cobertos pela operadora',
      currentValue: 'Não coberto',
      suggestedValue: 'Justificativa necessária',
      priority: 'medium',
      status: 'pending',
      createdAt: new Date('2024-01-15T11:15:00')
    },
    {
      id: '3',
      type: 'extra-package',
      title: 'Solicitação Extra-Pacote',
      description: 'Exame de Tomografia solicitado fora do escopo do pacote contratado',
      currentValue: 'Fora do pacote',
      suggestedValue: 'Justificativa clínica',
      priority: 'medium',
      status: 'pending',
      createdAt: new Date('2024-01-15T14:20:00')
    },
    {
      id: '4',
      type: 'billing',
      title: 'Divergência no Faturamento',
      description: 'Valor do procedimento não confere com tabela contratual',
      currentValue: 'R$ 3.500,00',
      suggestedValue: 'R$ 3.200,00',
      priority: 'low',
      status: 'approved',
      createdAt: new Date('2024-01-15T09:45:00')
    }
  ]);

  const handleAction = (id: string, action: 'approve' | 'reject') => {
    setPendencies(prev => prev.map(pendency => 
      pendency.id === id 
        ? { ...pendency, status: action === 'approve' ? 'approved' : 'rejected' }
        : pendency
    ));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'warning';
      case 'low': return 'secondary';
      default: return 'secondary';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'approved': return 'success';
      case 'rejected': return 'destructive';
      default: return 'secondary';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'surgery': return <FileText className="h-4 w-4" />;
      case 'material': return <AlertTriangle className="h-4 w-4" />;
      case 'extra-package': return <Clock className="h-4 w-4" />;
      case 'billing': return <CheckCircle className="h-4 w-4" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const pendingCount = pendencies.filter(p => p.status === 'pending').length;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-warning" />
                Pendências de Validação
              </CardTitle>
              <CardDescription>
                Divergências identificadas pelo motor de validação dos sistemas TAZY/MV
              </CardDescription>
            </div>
            <Badge variant={pendingCount > 0 ? "destructive" : "success"}>
              {pendingCount} pendente(s)
            </Badge>
          </div>
        </CardHeader>
      </Card>

      <div className="space-y-4">
        {pendencies.map((pendency) => (
          <Card key={pendency.id} className="border-l-4 border-l-primary">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-3">
                    {getTypeIcon(pendency.type)}
                    <h3 className="font-semibold text-card-foreground">{pendency.title}</h3>
                    <Badge variant={getPriorityColor(pendency.priority) as any}>
                      {pendency.priority === 'high' ? 'Alta' : 
                       pendency.priority === 'medium' ? 'Média' : 'Baixa'}
                    </Badge>
                    <Badge variant={getStatusColor(pendency.status) as any}>
                      {pendency.status === 'pending' ? 'Pendente' :
                       pendency.status === 'approved' ? 'Aprovado' : 'Rejeitado'}
                    </Badge>
                  </div>
                  
                  <p className="text-muted-foreground">{pendency.description}</p>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-muted-foreground">Valor Atual:</span>
                      <p className="font-semibold text-destructive">{pendency.currentValue}</p>
                    </div>
                    <div>
                      <span className="font-medium text-muted-foreground">Valor Sugerido:</span>
                      <p className="font-semibold text-success">{pendency.suggestedValue}</p>
                    </div>
                  </div>
                  
                  <div className="text-xs text-muted-foreground">
                    Identificado em: {pendency.createdAt.toLocaleString('pt-BR')}
                  </div>
                </div>
                
                {pendency.status === 'pending' && (
                  <div className="flex gap-2 ml-4">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleAction(pendency.id, 'approve')}
                      className="text-success border-success hover:bg-success hover:text-success-foreground"
                    >
                      Aprovar
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleAction(pendency.id, 'reject')}
                      className="text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
                    >
                      Rejeitar
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}