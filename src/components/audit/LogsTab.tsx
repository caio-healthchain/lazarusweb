import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Clock, DollarSign, User, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export interface AuditLog {
  id: number;
  createdAt: string;
  guiaId: string;
  guiaNumero?: string;
  procedimentoSequencial?: number;
  codigoProcedimento: string;
  descricaoProcedimento?: string;
  tipoApontamento: string;
  valorOriginal: number;
  valorContratado?: number;
  valorAprovado: number;
  economiaValor: number;
  quantidadeOriginal?: number;
  quantidadeMaxima?: number;
  quantidadeAprovada?: number;
  decisao: 'APROVADO' | 'REJEITADO' | 'PARCIALMENTE_APROVADO';
  auditorId?: string;
  auditorNome?: string;
  auditorObservacoes?: string;
  dataDecisao: string;
}

interface LogsTabProps {
  logs: AuditLog[];
  isLoading?: boolean;
}

export const LogsTab = ({ logs, isLoading }: LogsTabProps) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (logs.length === 0) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="text-center text-muted-foreground">
            <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium">Nenhum log de auditoria encontrado</p>
            <p className="text-sm mt-2">As ações de aprovação e rejeição aparecerão aqui</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
    } catch {
      return dateString;
    }
  };

  const getDecisaoBadge = (decisao: string) => {
    switch (decisao) {
      case 'APROVADO':
        return <Badge className="bg-green-500"><CheckCircle className="h-3 w-3 mr-1" /> Aprovado</Badge>;
      case 'REJEITADO':
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" /> Rejeitado</Badge>;
      case 'PARCIALMENTE_APROVADO':
        return <Badge className="bg-yellow-500"><Clock className="h-3 w-3 mr-1" /> Parcialmente Aprovado</Badge>;
      default:
        return <Badge variant="secondary">{decisao}</Badge>;
    }
  };

  const getTipoApontamentoBadge = (tipo: string) => {
    const tipos: Record<string, { label: string; color: string }> = {
      'VALOR_DIVERGENTE': { label: 'Valor Divergente', color: 'bg-orange-500' },
      'FORA_PACOTE': { label: 'Fora do Pacote', color: 'bg-red-500' },
      'PORTE_DIVERGENTE': { label: 'Porte Divergente', color: 'bg-purple-500' },
      'MATERIAL_INCLUSO': { label: 'Material Incluso', color: 'bg-blue-500' },
      'QUANTIDADE_EXCEDIDA': { label: 'Quantidade Excedida', color: 'bg-yellow-500' },
    };

    const tipoInfo = tipos[tipo] || { label: tipo, color: 'bg-gray-500' };
    return <Badge className={tipoInfo.color}>{tipoInfo.label}</Badge>;
  };

  const totalEconomia = logs.reduce((sum, log) => sum + log.economiaValor, 0);

  return (
    <div className="space-y-4">
      {/* Resumo de Economia */}
      <Card className="border-l-4 border-l-green-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-green-600" />
            Economia Total Gerada
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Total de Ações</p>
              <p className="text-2xl font-bold">{logs.length}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Aprovados</p>
              <p className="text-2xl font-bold text-green-600">
                {logs.filter(l => l.decisao === 'APROVADO').length}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Economia Gerada</p>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(totalEconomia)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Timeline de Logs */}
      <div className="space-y-3">
        {logs.map((log) => (
          <Card key={log.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {getDecisaoBadge(log.decisao)}
                    {getTipoApontamentoBadge(log.tipoApontamento)}
                  </div>
                  <h3 className="font-semibold text-lg">
                    {log.codigoProcedimento} - {log.descricaoProcedimento || 'Sem descrição'}
                  </h3>
                  {log.procedimentoSequencial && (
                    <p className="text-sm text-muted-foreground">
                      Item #{log.procedimentoSequencial}
                    </p>
                  )}
                </div>
                {log.economiaValor > 0 && (
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Economia</p>
                    <p className="text-xl font-bold text-green-600">
                      {formatCurrency(log.economiaValor)}
                    </p>
                  </div>
                )}
              </div>

              {/* Valores */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 p-4 bg-muted/50 rounded-lg">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Valor Original</p>
                  <p className="font-semibold">{formatCurrency(log.valorOriginal)}</p>
                  {log.quantidadeOriginal && (
                    <p className="text-xs text-muted-foreground">Qtd: {log.quantidadeOriginal}</p>
                  )}
                </div>
                {log.valorContratado && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Valor Contratado</p>
                    <p className="font-semibold text-blue-600">{formatCurrency(log.valorContratado)}</p>
                    {log.quantidadeMaxima && (
                      <p className="text-xs text-muted-foreground">Qtd Máx: {log.quantidadeMaxima}</p>
                    )}
                  </div>
                )}
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Valor Aprovado</p>
                  <p className="font-semibold text-green-600">{formatCurrency(log.valorAprovado)}</p>
                  {log.quantidadeAprovada && (
                    <p className="text-xs text-muted-foreground">Qtd: {log.quantidadeAprovada}</p>
                  )}
                </div>
              </div>

              {/* Auditor e Data */}
              <div className="flex items-center justify-between text-sm text-muted-foreground border-t pt-3">
                <div className="flex items-center gap-4">
                  {log.auditorNome && (
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      <span>{log.auditorNome}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(log.dataDecisao)}</span>
                  </div>
                </div>
              </div>

              {/* Observações */}
              {log.auditorObservacoes && (
                <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-950 rounded-md border-l-4 border-l-blue-500">
                  <p className="text-sm font-medium mb-1">Observações do Auditor:</p>
                  <p className="text-sm text-muted-foreground">{log.auditorObservacoes}</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
