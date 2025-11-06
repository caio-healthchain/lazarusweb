import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  AlertTriangle, 
  FileText, 
  Package, 
  DollarSign, 
  Activity,
  Copy
} from 'lucide-react';
import { PendenciasStats } from '@/services/mockValidationData';

interface PendenciasTabProps {
  stats: PendenciasStats;
}

export function PendenciasTab({ stats }: PendenciasTabProps) {
  const pendencias = [
    {
      icon: Activity,
      label: 'Portes Divergentes',
      count: stats.portesDivergentes,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      description: 'Procedimentos com porte cirúrgico diferente do sugerido'
    },
    {
      icon: FileText,
      label: 'DUT Não Conformes',
      count: stats.dutNaoConformes,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      description: 'Procedimentos que não atendem critérios da DUT'
    },
    {
      icon: Package,
      label: 'Fora do Pacote',
      count: stats.foraDoPacote,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
      description: 'Procedimentos não incluídos no pacote contratual'
    },
    {
      icon: DollarSign,
      label: 'Valores Divergentes',
      count: stats.valoresDivergentes,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
      description: 'Procedimentos com valor diferente do contratado'
    },
    {
      icon: Copy,
      label: 'Duplicados',
      count: stats.duplicados,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      description: 'Procedimentos que podem estar duplicados'
    }
  ];

  const totalPendencias = stats.total;

  return (
    <div className="space-y-6">
      {/* Resumo de Pendências */}
      <Alert className={totalPendencias > 0 ? 'border-yellow-500 bg-yellow-50' : 'border-green-500 bg-green-50'}>
        <AlertTriangle className={`h-5 w-5 ${totalPendencias > 0 ? 'text-yellow-600' : 'text-green-600'}`} />
        <AlertDescription className={totalPendencias > 0 ? 'text-yellow-800' : 'text-green-800'}>
          {totalPendencias > 0 ? (
            <>
              <strong>{totalPendencias}</strong> pendência{totalPendencias !== 1 ? 's' : ''} encontrada{totalPendencias !== 1 ? 's' : ''} nesta guia. 
              Revise os procedimentos abaixo antes de aprovar.
            </>
          ) : (
            <>
              <strong>Nenhuma pendência encontrada!</strong> Todos os procedimentos estão em conformidade.
            </>
          )}
        </AlertDescription>
      </Alert>

      {/* Cards de Pendências */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {pendencias.map((pendencia, index) => {
          const Icon = pendencia.icon;
          return (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-gray-700">
                    {pendencia.label}
                  </CardTitle>
                  <div className={`p-2 rounded-lg ${pendencia.bgColor}`}>
                    <Icon className={`h-5 w-5 ${pendencia.color}`} />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline gap-2">
                  <span className={`text-3xl font-bold ${pendencia.color}`}>
                    {pendencia.count}
                  </span>
                  <span className="text-sm text-gray-500">
                    {pendencia.count === 1 ? 'ocorrência' : 'ocorrências'}
                  </span>
                </div>
                <p className="text-xs text-gray-600 mt-2">
                  {pendencia.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Legenda de Severidade */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Legenda de Severidade</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-3">
            <Badge className="bg-red-100 text-red-800">Não Conforme</Badge>
            <span className="text-sm text-gray-600">
              Requer atenção imediata - Possível glosa
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Badge className="bg-yellow-100 text-yellow-800">Alerta</Badge>
            <span className="text-sm text-gray-600">
              Requer revisão - Divergência identificada
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Badge className="bg-green-100 text-green-800">Conforme</Badge>
            <span className="text-sm text-gray-600">
              Em conformidade com regras contratuais
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
