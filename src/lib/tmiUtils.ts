/**
 * Utilitários para cálculo de TMI (Tempo Médio de Internação)
 */

export interface TMIData {
  dias: number;
  dataInicio: Date;
  dataFim: Date;
}

/**
 * Calcula o TMI (Tempo Médio de Internação) em dias
 * @param dataInicio Data de início do faturamento/internação
 * @param dataFim Data final do faturamento/alta
 * @returns Número de dias de internação
 */
export function calcularTMI(dataInicio?: string, dataFim?: string): number | null {
  if (!dataInicio || !dataFim) return null;

  try {
    const inicio = new Date(dataInicio);
    const fim = new Date(dataFim);

    // Validar datas
    if (isNaN(inicio.getTime()) || isNaN(fim.getTime())) {
      return null;
    }

    // Calcular diferença em milissegundos
    const diffMs = fim.getTime() - inicio.getTime();

    // Converter para dias (arredondar para cima, mínimo 1 dia)
    const dias = Math.max(1, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));

    return dias;
  } catch {
    return null;
  }
}

/**
 * Formata o TMI para exibição
 * @param dias Número de dias
 * @returns String formatada (ex: "5 dias", "1 dia")
 */
export function formatarTMI(dias: number | null): string {
  if (dias === null) return 'N/A';
  if (dias === 1) return '1 dia';
  return `${dias} dias`;
}

/**
 * Calcula TMI médio de um array de guias
 * @param guias Array de guias com datas
 * @returns TMI médio em dias
 */
export function calcularTMIMedio(guias: Array<{ dataInicioFaturamento?: string; dataFinalFaturamento?: string }>): number | null {
  const tmis = guias
    .map(g => calcularTMI(g.dataInicioFaturamento, g.dataFinalFaturamento))
    .filter((tmi): tmi is number => tmi !== null);

  if (tmis.length === 0) return null;

  const soma = tmis.reduce((acc, tmi) => acc + tmi, 0);
  return Math.round(soma / tmis.length);
}

/**
 * Agrupa guias por procedimento e calcula TMI médio
 */
export function calcularTMIPorProcedimento(
  guias: Array<{
    diagnostico?: string;
    dataInicioFaturamento?: string;
    dataFinalFaturamento?: string;
  }>
): Array<{ procedimento: string; tmiMedio: number; quantidade: number }> {
  const grupos = new Map<string, number[]>();

  guias.forEach(guia => {
    const procedimento = guia.diagnostico || 'Sem diagnóstico';
    const tmi = calcularTMI(guia.dataInicioFaturamento, guia.dataFinalFaturamento);

    if (tmi !== null) {
      if (!grupos.has(procedimento)) {
        grupos.set(procedimento, []);
      }
      grupos.get(procedimento)!.push(tmi);
    }
  });

  return Array.from(grupos.entries())
    .map(([procedimento, tmis]) => ({
      procedimento,
      tmiMedio: Math.round(tmis.reduce((a, b) => a + b, 0) / tmis.length),
      quantidade: tmis.length,
    }))
    .sort((a, b) => b.tmiMedio - a.tmiMedio);
}

/**
 * Classifica TMI por faixa
 */
export function classificarTMI(dias: number | null): {
  categoria: string;
  cor: string;
  bgColor: string;
} {
  if (dias === null) {
    return {
      categoria: 'Indefinido',
      cor: 'text-gray-600',
      bgColor: 'bg-gray-100',
    };
  }

  if (dias <= 3) {
    return {
      categoria: 'Curta',
      cor: 'text-green-600',
      bgColor: 'bg-green-100',
    };
  }

  if (dias <= 7) {
    return {
      categoria: 'Média',
      cor: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
    };
  }

  if (dias <= 15) {
    return {
      categoria: 'Longa',
      cor: 'text-orange-600',
      bgColor: 'bg-orange-100',
    };
  }

  return {
    categoria: 'Muito Longa',
    cor: 'text-red-600',
    bgColor: 'bg-red-100',
  };
}
