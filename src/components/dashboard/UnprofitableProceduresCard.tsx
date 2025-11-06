import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingDown, AlertTriangle, FileText } from 'lucide-react';
import { UnprofitableProcedure } from '@/types/managerial';

interface UnprofitableProceduresCardProps {
  procedures: UnprofitableProcedure[];
}

const UnprofitableProceduresCard = ({ procedures }: UnprofitableProceduresCardProps) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const totalLoss = procedures.reduce((sum, proc) => sum + proc.totalLoss, 0);
  const totalFrequency = procedures.reduce((sum, proc) => sum + proc.frequency, 0);

  const getLossSeverity = (lossPercentage: number) => {
    if (lossPercentage >= 25) return { label: 'Crítico', variant: 'destructive' as const };
    if (lossPercentage >= 15) return { label: 'Alto', variant: 'default' as const };
    return { label: 'Moderado', variant: 'secondary' as const };
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <TrendingDown className="h-5 w-5 text-red-600" />
            <CardTitle className="text-lg">Procedimentos com Prejuízo</CardTitle>
          </div>
          <AlertTriangle className="h-5 w-5 text-red-500" />
        </div>
        <CardDescription>
          Prejuízo total: {formatCurrency(totalLoss)} • {totalFrequency} procedimentos realizados
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {procedures.map((procedure, index) => {
            const severity = getLossSeverity(procedure.lossPercentage);
            
            return (
              <div 
                key={procedure.id}
                className="p-3 rounded-lg border-l-4 border-red-500 bg-red-50"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-bold text-gray-500">#{index + 1}</span>
                      <p className="font-semibold text-gray-900 text-sm">{procedure.name}</p>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">
                      Código: {procedure.code}
                    </p>
                  </div>
                  <Badge variant={severity.variant}>
                    {severity.label}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-3">
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600">Custo:</span>
                      <span className="font-medium text-gray-900">{formatCurrency(procedure.cost)}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600">Reembolso:</span>
                      <span className="font-medium text-gray-900">{formatCurrency(procedure.reimbursement)}</span>
                    </div>
                    <div className="flex justify-between text-xs border-t pt-1">
                      <span className="text-gray-600 font-semibold">Prejuízo/un:</span>
                      <span className="font-bold text-red-600">{formatCurrency(procedure.loss)}</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600">Frequência:</span>
                      <span className="font-medium text-gray-900">{procedure.frequency}x</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600">% Prejuízo:</span>
                      <span className="font-medium text-red-600">{procedure.lossPercentage.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between text-xs border-t pt-1">
                      <span className="text-gray-600 font-semibold">Total:</span>
                      <span className="font-bold text-red-600">{formatCurrency(procedure.totalLoss)}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start space-x-2">
          <FileText className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-amber-800">
            <strong>Recomendação:</strong> Revisar tabela de preços com operadoras ou considerar redução de custos operacionais para estes procedimentos.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default UnprofitableProceduresCard;
