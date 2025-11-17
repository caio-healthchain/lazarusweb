import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { guideService, Guide } from '@/services/api';
import { calcularTMI, formatarTMI, classificarTMI, calcularTMIPorProcedimento } from '@/lib/tmiUtils';
import { Clock, TrendingUp, TrendingDown, Activity, AlertCircle, BarChart3 } from 'lucide-react';

const TMIReport = () => {
  const { data: guiasResponse, isLoading, error } = useQuery({
    queryKey: ['guias'],
    queryFn: () => guideService.getAll(),
    select: (res) => res.data,
    retry: 1,
  });

  const guias = (guiasResponse?.data ?? []) as Guide[];

  // Calcular TMI médio geral
  const tmiMedioGeral = useMemo(() => {
    const tmis = guias
      .map(g => calcularTMI(g.dataInicioFaturamento, g.dataFinalFaturamento))
      .filter((tmi): tmi is number => tmi !== null);
    
    if (tmis.length === 0) return null;
    return Math.round(tmis.reduce((acc, tmi) => acc + tmi, 0) / tmis.length);
  }, [guias]);

  // Calcular TMI por procedimento/CID
  const tmiPorProcedimento = useMemo(() => {
    return calcularTMIPorProcedimento(guias);
  }, [guias]);

  // Estatísticas de TMI
  const estatisticasTMI = useMemo(() => {
    const tmis = guias
      .map(g => calcularTMI(g.dataInicioFaturamento, g.dataFinalFaturamento))
      .filter((tmi): tmi is number => tmi !== null);

    if (tmis.length === 0) {
      return {
        minimo: null,
        maximo: null,
        curta: 0,
        media: 0,
        longa: 0,
        muitoLonga: 0,
      };
    }

    return {
      minimo: Math.min(...tmis),
      maximo: Math.max(...tmis),
      curta: tmis.filter(t => t <= 3).length,
      media: tmis.filter(t => t > 3 && t <= 7).length,
      longa: tmis.filter(t => t > 7 && t <= 15).length,
      muitoLonga: tmis.filter(t => t > 15).length,
    };
  }, [guias]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Relatório de TMI</h1>
          <p className="text-gray-600 mt-1">
            Tempo Médio de Internação por procedimento e diagnóstico
          </p>
        </div>

        {/* Error State */}
        {error && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 text-red-800">
                <AlertCircle className="h-5 w-5" />
                <div>
                  <p className="font-medium">Erro ao carregar dados</p>
                  <p className="text-sm text-red-700">
                    Verifique sua conexão ou tente novamente mais tarde.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-l-4 border-l-orange-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">TMI Médio Geral</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {isLoading ? (
                      <Skeleton className="h-10 w-20" />
                    ) : (
                      formatarTMI(tmiMedioGeral)
                    )}
                  </p>
                </div>
                <div className="p-3 bg-orange-100 rounded-full">
                  <Clock className="h-8 w-8 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">TMI Mínimo</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {isLoading ? (
                      <Skeleton className="h-10 w-20" />
                    ) : (
                      formatarTMI(estatisticasTMI.minimo)
                    )}
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <TrendingDown className="h-8 w-8 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-red-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">TMI Máximo</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {isLoading ? (
                      <Skeleton className="h-10 w-20" />
                    ) : (
                      formatarTMI(estatisticasTMI.maximo)
                    )}
                  </p>
                </div>
                <div className="p-3 bg-red-100 rounded-full">
                  <TrendingUp className="h-8 w-8 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Total de Guias</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {isLoading ? <Skeleton className="h-10 w-20" /> : guias.length}
                  </p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <BarChart3 className="h-8 w-8 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Distribuição por Faixa */}
        <Card>
          <CardHeader>
            <CardTitle>Distribuição por Faixa de TMI</CardTitle>
            <CardDescription>
              Classificação das internações por tempo de permanência
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="bg-green-50 border-green-200">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-green-700 font-medium">Curta (≤3 dias)</p>
                        <p className="text-2xl font-bold text-green-900">
                          {estatisticasTMI.curta}
                        </p>
                      </div>
                      <Activity className="h-8 w-8 text-green-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-yellow-50 border-yellow-200">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-yellow-700 font-medium">Média (4-7 dias)</p>
                        <p className="text-2xl font-bold text-yellow-900">
                          {estatisticasTMI.media}
                        </p>
                      </div>
                      <Activity className="h-8 w-8 text-yellow-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-orange-50 border-orange-200">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-orange-700 font-medium">Longa (8-15 dias)</p>
                        <p className="text-2xl font-bold text-orange-900">
                          {estatisticasTMI.longa}
                        </p>
                      </div>
                      <Activity className="h-8 w-8 text-orange-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-red-50 border-red-200">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-red-700 font-medium">Muito Longa (&gt;15 dias)</p>
                        <p className="text-2xl font-bold text-red-900">
                          {estatisticasTMI.muitoLonga}
                        </p>
                      </div>
                      <Activity className="h-8 w-8 text-red-600" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tabela de TMI por Procedimento */}
        <Card>
          <CardHeader>
            <CardTitle>TMI por Diagnóstico (CID)</CardTitle>
            <CardDescription>
              Tempo médio de internação agrupado por código de diagnóstico
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[...Array(10)].map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : tmiPorProcedimento.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Clock className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p>Nenhum dado de TMI disponível</p>
                <p className="text-sm mt-2">
                  Importe guias com datas de internação para visualizar o relatório
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Diagnóstico (CID)</TableHead>
                    <TableHead className="text-center">Quantidade</TableHead>
                    <TableHead className="text-center">TMI Médio</TableHead>
                    <TableHead className="text-center">Classificação</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tmiPorProcedimento.map((item, index) => {
                    const classificacao = classificarTMI(item.tmiMedio);
                    return (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{item.procedimento}</TableCell>
                        <TableCell className="text-center">{item.quantidade}</TableCell>
                        <TableCell className="text-center font-semibold">
                          {formatarTMI(item.tmiMedio)}
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge
                            variant="secondary"
                            className={`${classificacao.bgColor} ${classificacao.cor}`}
                          >
                            {classificacao.categoria}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TMIReport;
