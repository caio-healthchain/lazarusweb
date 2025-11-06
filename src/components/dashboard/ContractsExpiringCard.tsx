import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, AlertTriangle, Clock } from 'lucide-react';
import { ExpiringContract } from '@/types/managerial';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ContractsExpiringCardProps {
  contracts: ExpiringContract[];
}

const ContractsExpiringCard = ({ contracts }: ContractsExpiringCardProps) => {
  const getStatusBadge = (status: ExpiringContract['status']) => {
    const variants = {
      critical: 'destructive',
      warning: 'default',
      normal: 'secondary'
    };
    
    const labels = {
      critical: 'Crítico',
      warning: 'Atenção',
      normal: 'Normal'
    };
    
    return (
      <Badge variant={variants[status] as any} className="ml-2">
        {labels[status]}
      </Badge>
    );
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const criticalCount = contracts.filter(c => c.status === 'critical').length;
  const warningCount = contracts.filter(c => c.status === 'warning').length;

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-blue-600" />
            <CardTitle className="text-lg">Contratos a Vencer</CardTitle>
          </div>
          {criticalCount > 0 && (
            <AlertTriangle className="h-5 w-5 text-red-500 animate-pulse" />
          )}
        </div>
        <CardDescription>
          {criticalCount > 0 && <span className="text-red-600 font-medium">{criticalCount} crítico(s)</span>}
          {criticalCount > 0 && warningCount > 0 && <span className="mx-1">•</span>}
          {warningCount > 0 && <span className="text-orange-600 font-medium">{warningCount} em atenção</span>}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {contracts.slice(0, 4).map((contract) => (
            <div 
              key={contract.id} 
              className={`p-3 rounded-lg border-l-4 ${
                contract.status === 'critical' 
                  ? 'bg-red-50 border-red-500' 
                  : contract.status === 'warning'
                  ? 'bg-orange-50 border-orange-500'
                  : 'bg-gray-50 border-gray-300'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center">
                    <p className="font-semibold text-gray-900">{contract.operatorName}</p>
                    {getStatusBadge(contract.status)}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    Valor: {formatCurrency(contract.contractValue)}
                  </p>
                  <div className="flex items-center mt-2 text-xs text-gray-500">
                    <Clock className="h-3 w-3 mr-1" />
                    <span>Vence em {contract.daysUntilExpiration} dias</span>
                    <span className="mx-2">•</span>
                    <span>{format(new Date(contract.expirationDate), "dd/MM/yyyy", { locale: ptBR })}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        {contracts.length > 4 && (
          <p className="text-sm text-gray-500 mt-3 text-center">
            +{contracts.length - 4} contratos adicionais
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default ContractsExpiringCard;
