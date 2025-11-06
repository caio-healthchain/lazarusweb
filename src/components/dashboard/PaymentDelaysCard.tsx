import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, AlertCircle } from 'lucide-react';
import { PaymentDelay } from '@/types/managerial';

interface PaymentDelaysCardProps {
  delays: PaymentDelay[];
}

const PaymentDelaysCard = ({ delays }: PaymentDelaysCardProps) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const getStatusInfo = (status: PaymentDelay['status']) => {
    const statusMap = {
      onTime: {
        label: 'Em dia',
        color: 'bg-emerald-100 text-emerald-800 border-emerald-300',
        variant: 'secondary' as const
      },
      delayed: {
        label: 'Atrasado',
        color: 'bg-orange-100 text-orange-800 border-orange-300',
        variant: 'default' as const
      },
      critical: {
        label: 'Crítico',
        color: 'bg-red-100 text-red-800 border-red-300',
        variant: 'destructive' as const
      }
    };
    return statusMap[status];
  };

  const totalPending = delays.reduce((sum, delay) => sum + delay.pendingAmount, 0);
  const criticalCount = delays.filter(d => d.status === 'critical').length;

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-orange-600" />
            <CardTitle className="text-lg">Atrasos de Pagamento</CardTitle>
          </div>
          {criticalCount > 0 && (
            <Badge variant="destructive" className="animate-pulse">
              {criticalCount} crítico(s)
            </Badge>
          )}
        </div>
        <CardDescription>
          Total pendente: {formatCurrency(totalPending)}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {delays.map((delay) => {
            const statusInfo = getStatusInfo(delay.status);
            
            return (
              <div 
                key={delay.operatorId}
                className={`p-3 rounded-lg border ${statusInfo.color}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-gray-900">{delay.operatorName}</p>
                      <Badge variant={statusInfo.variant}>
                        {statusInfo.label}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-2 mt-3">
                      <div>
                        <p className="text-xs text-gray-600">Prazo Médio</p>
                        <p className="text-sm font-bold text-gray-900">
                          {delay.averagePaymentDays} dias
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Pendente</p>
                        <p className="text-sm font-bold text-gray-900">
                          {formatCurrency(delay.pendingAmount)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Qtd. Atrasos</p>
                        <p className="text-sm font-bold text-gray-900">
                          {delay.overdueCount}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        {delays.some(d => d.status === 'critical') && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-2">
            <AlertCircle className="h-4 w-4 text-red-600 mt-0.5" />
            <p className="text-xs text-red-800">
              Operadoras com atraso crítico requerem ação imediata da equipe financeira
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PaymentDelaysCard;
