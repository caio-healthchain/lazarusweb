import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Activity, AlertTriangle, User, Clock } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface AuditLog {
  id: string;
  timestamp: Date;
  user: string;
  type: 'port_change' | 'material_approval' | 'extra_package' | 'billing_adjustment';
  description: string;
  status: 'approved' | 'rejected' | 'pending';
  details: {
    procedureId?: string;
    procedureName?: string;
    previousPort?: number;
    newPort?: number;
    itemName?: string;
    requestType?: string;
    value?: number;
  };
  justification: string;
}

interface AuditTabProps {
  auditLogs: AuditLog[];
  patient?: any;
}

export function AuditTab({ auditLogs: propAuditLogs, patient }: AuditTabProps) {
  // Mock data para demonstração
  const mockAuditLogs: AuditLog[] = [
    {
      id: '1',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 horas atrás
      user: 'Dr. Carlos Mendes',
      type: 'port_change',
      description: 'Alteração de porte cirúrgico',
      status: 'approved',
      details: {
        procedureId: 'PROC-001',
        procedureName: 'Apendicectomia Laparoscópica',
        previousPort: 3,
        newPort: 2
      },
      justification: 'Paciente com baixo risco cirúrgico, procedimento realizado sem complicações. Porte 2 adequado conforme técnica utilizada.'
    },
    {
      id: '2',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 horas atrás
      user: 'Dr. Ana Silva',
      type: 'material_approval',
      description: 'Solicitação de material especial',
      status: 'rejected',
      details: {
        itemName: 'Enxerto de pericárdio bovino',
        requestType: 'Material não coberto'
      },
      justification: 'Material não está na lista de cobertura do plano. Existem alternativas cobertas disponíveis que podem ser utilizadas para o mesmo resultado clínico.'
    },
    {
      id: '3',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 horas atrás
      user: 'Dr. Roberto Lima',
      type: 'extra_package',
      description: 'Solicitação extra-pacote',
      status: 'approved',
      details: {
        itemName: 'Monitorização cardíaca contínua',
        requestType: 'Procedimento adicional',
        value: 850.00
      },
      justification: 'Paciente de alto risco cardiovascular, monitorização justificada pelo quadro clínico apresentado. Aprovado conforme protocolo médico.'
    },
    {
      id: '4',
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 dia atrás
      user: 'Dr. Mariana Costa',
      type: 'port_change',
      description: 'Alteração de porte cirúrgico',
      status: 'rejected',
      details: {
        procedureId: 'PROC-002',
        procedureName: 'Colecistectomia Videolaparoscópica',
        previousPort: 2,
        newPort: 4
      },
      justification: 'Solicitação de aumento de porte não justificada. Procedimento realizado conforme técnica padrão, sem complicações que justifiquem porte maior.'
    },
    {
      id: '5',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 dias atrás
      user: 'Dr. Fernando Oliveira',
      type: 'billing_adjustment',
      description: 'Ajuste de faturamento',
      status: 'approved',
      details: {
        itemName: 'Taxa de sala cirúrgica',
        value: 1200.00
      },
      justification: 'Cirurgia com duração estendida devido à complexidade do caso. Tempo cirúrgico de 4h30min justifica cobrança adicional.'
    }
  ];

  const auditLogs = propAuditLogs.length > 0 ? propAuditLogs : mockAuditLogs;
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Activity className="h-5 w-5" />
              Estatísticas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total de alterações:</span>
                <span className="font-bold text-2xl text-primary">{auditLogs.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Últimas 24h:</span>
                <span className="font-medium">
                  {auditLogs.filter(log => 
                    new Date().getTime() - log.timestamp.getTime() < 24 * 60 * 60 * 1000
                  ).length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Usuários ativos:</span>
                <span className="font-medium">
                  {new Set(auditLogs.map(log => log.user)).size}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <AlertTriangle className="h-5 w-5" />
              Alertas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {auditLogs.length === 0 ? (
                <p className="text-muted-foreground text-sm">Nenhum alerta no momento</p>
              ) : (
                <>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="bg-warning/20 text-warning">
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      Alterações recentes
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {auditLogs.length} alteração(ões) de porte registrada(s)
                  </p>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <User className="h-5 w-5" />
              Usuário Atual
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Nome:</span>
                <span className="font-medium">Ana Costa</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Função:</span>
                <span className="font-medium">Analista de Faturamento</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Permissões:</span>
                <Badge variant="secondary" className="bg-success/20 text-success">
                  Porte Override
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Log de Auditoria
          </CardTitle>
        </CardHeader>
        <CardContent>
          {auditLogs.length === 0 ? (
            <div className="text-center py-8">
              <Activity className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Nenhuma alteração registrada</h3>
              <p className="text-muted-foreground">
                As alterações de porte cirúrgico aparecerão aqui quando realizadas.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data/Hora</TableHead>
                  <TableHead>Médico Auditor</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead>Justificativa</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {auditLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="font-mono text-sm">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        {format(log.timestamp, "dd/MM/yyyy HH:mm:ss", { locale: ptBR })}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        {log.user}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">
                        {log.type === 'port_change' && 'Porte Cirúrgico'}
                        {log.type === 'material_approval' && 'Material'}
                        {log.type === 'extra_package' && 'Extra-Pacote'}
                        {log.type === 'billing_adjustment' && 'Faturamento'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{log.description}</div>
                        <div className="text-sm text-muted-foreground">
                          {log.details.procedureName && `${log.details.procedureName} (${log.details.procedureId})`}
                          {log.details.itemName && log.details.itemName}
                          {log.details.value && ` - R$ ${log.details.value.toFixed(2)}`}
                        </div>
                        {log.details.previousPort && log.details.newPort && (
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20 text-xs">
                              Porte {log.details.previousPort}
                            </Badge>
                            <span className="text-xs text-muted-foreground">→</span>
                            <Badge variant="outline" className="bg-success/10 text-success border-success/20 text-xs">
                              Porte {log.details.newPort}
                            </Badge>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge 
                        variant="outline" 
                        className={
                          log.status === 'approved' 
                            ? "bg-success/10 text-success border-success/20" 
                            : log.status === 'rejected'
                            ? "bg-destructive/10 text-destructive border-destructive/20"
                            : "bg-warning/10 text-warning border-warning/20"
                        }
                      >
                        {log.status === 'approved' && 'Aprovado'}
                        {log.status === 'rejected' && 'Recusado'}
                        {log.status === 'pending' && 'Pendente'}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <div className="text-sm" title={log.justification}>
                        {log.justification}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}