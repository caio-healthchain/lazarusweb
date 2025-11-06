import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { ProfitableOperator } from '@/types/managerial';

interface TopProfitableOperatorsCardProps {
  operators: ProfitableOperator[];
}

const TopProfitableOperatorsCard = ({ operators }: TopProfitableOperatorsCardProps) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const getTrendIcon = (trend: ProfitableOperator['trend']) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-emerald-500" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  const maxRevenue = Math.max(...operators.map(op => op.totalRevenue));

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-center space-x-2">
          <TrendingUp className="h-5 w-5 text-emerald-600" />
          <CardTitle className="text-lg">Operadoras Mais Lucrativas</CardTitle>
        </div>
        <CardDescription>
          Ranking por receita e margem de lucro
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {operators.map((operator, index) => {
            const barWidth = (operator.totalRevenue / maxRevenue) * 100;
            
            return (
              <div key={operator.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 flex-1">
                    <span className="text-lg font-bold text-gray-400 w-6">
                      {index + 1}º
                    </span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-semibold text-gray-900">{operator.name}</p>
                        {getTrendIcon(operator.trend)}
                      </div>
                      <div className="flex items-center space-x-3 text-xs text-gray-600 mt-1">
                        <span>{formatCurrency(operator.totalRevenue)}</span>
                        <span>•</span>
                        <span className="text-emerald-600 font-medium">
                          {operator.profitMargin.toFixed(1)}% margem
                        </span>
                        <span>•</span>
                        <span>{operator.marketShare.toFixed(1)}% do mercado</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${barWidth}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default TopProfitableOperatorsCard;
