import { Card, CardContent } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronUp, DollarSign, Users, Activity, BarChart3, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { useState } from 'react';

interface MetricData {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: any;
  color: string;
}

interface OperationalMetricsSectionProps {
  metrics: MetricData[];
}

const OperationalMetricsSection = ({ metrics }: OperationalMetricsSectionProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Card className="bg-gradient-to-r from-gray-50 to-gray-100">
        <CollapsibleTrigger className="w-full">
          <div className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-100 transition-colors rounded-lg">
            <div className="flex items-center space-x-3">
              <BarChart3 className="h-5 w-5 text-gray-600" />
              <div className="text-left">
                <h3 className="font-semibold text-gray-900">Métricas Operacionais</h3>
                <p className="text-sm text-gray-600">Indicadores gerais de performance</p>
              </div>
            </div>
            {isOpen ? (
              <ChevronUp className="h-5 w-5 text-gray-600" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-600" />
            )}
          </div>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <div className="px-4 pb-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {metrics.map((metric, index) => {
                const IconComponent = metric.icon;
                return (
                  <Card key={index} className="bg-white">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs font-medium text-gray-600">{metric.title}</p>
                          <p className="text-xl font-bold text-gray-900 mt-1">{metric.value}</p>
                          <div className="flex items-center mt-1">
                            {metric.trend === 'up' ? (
                              <ArrowUpRight className="h-3 w-3 text-emerald-500" />
                            ) : (
                              <ArrowDownRight className="h-3 w-3 text-red-500" />
                            )}
                            <span className={`text-xs font-medium ml-1 ${
                              metric.trend === 'up' ? 'text-emerald-600' : 'text-red-600'
                            }`}>
                              {metric.change}
                            </span>
                          </div>
                        </div>
                        <div className={`p-2 rounded-full bg-gray-100 ${metric.color}`}>
                          <IconComponent className="h-5 w-5" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
};

export default OperationalMetricsSection;
