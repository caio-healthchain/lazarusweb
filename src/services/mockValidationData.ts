import { ValidationResult } from '@/components/audit/ValidationBadges';
import { DUTData } from '@/components/audit/DUTModal';

// Mock de dados de DUT
export const mockDUTDatabase: Record<string, DUTData> = {
  '10102019': {
    codigoTUSS: '10102019',
    descricaoProcedimento: 'Visita hospitalar (paciente internado)',
    temDUT: false,
  },
  '40302318': {
    codigoTUSS: '40302318',
    descricaoProcedimento: 'Potássio - pesquisa e/ou dosagem',
    temDUT: false,
  },
  '40302580': {
    codigoTUSS: '40302580',
    descricaoProcedimento: 'Ureia - pesquisa e/ou dosagem',
    temDUT: false,
  },
  '31301010': {
    codigoTUSS: '31301010',
    descricaoProcedimento: 'Artroplastia total de joelho',
    temDUT: true,
    descricaoDUT: 'A artroplastia total de joelho está indicada para pacientes com artrose avançada do joelho que não responderam ao tratamento conservador.',
    criteriosUtilizacao: `1. Dor incapacitante persistente
2. Limitação funcional significativa
3. Falha do tratamento conservador por no mínimo 6 meses
4. Alterações radiográficas compatíveis com artrose grau III ou IV`,
    indicacoes: `- Osteoartrose primária ou secundária
- Artrite reumatoide
- Necrose avascular
- Sequela de fratura`,
    contraindicacoes: `- Infecção ativa
- Instabilidade ligamentar grave
- Déficit neurológico progressivo
- Doença vascular periférica grave`,
    observacoes: 'Procedimento de alta complexidade. Requer avaliação pré-operatória completa e equipe multidisciplinar.'
  },
  '31302017': {
    codigoTUSS: '31302017',
    descricaoProcedimento: 'Artroplastia total de quadril',
    temDUT: true,
    descricaoDUT: 'A artroplastia total de quadril está indicada para pacientes com artrose avançada do quadril que apresentam dor e limitação funcional.',
    criteriosUtilizacao: `1. Dor persistente e incapacitante
2. Limitação importante das atividades diárias
3. Falha do tratamento conservador
4. Alterações radiográficas significativas`,
    indicacoes: `- Osteoartrose
- Necrose avascular da cabeça femoral
- Artrite reumatoide
- Displasia do quadril`,
    contraindicacoes: `- Infecção ativa
- Insuficiência vascular grave
- Neuropatia de Charcot
- Doença psiquiátrica grave não controlada`,
    observacoes: 'Requer planejamento pré-operatório detalhado com exames de imagem adequados.'
  },
  '30701011': {
    codigoTUSS: '30701011',
    descricaoProcedimento: 'Angioplastia coronariana',
    temDUT: true,
    descricaoDUT: 'A angioplastia coronariana está indicada para pacientes com doença arterial coronariana obstrutiva sintomática ou com isquemia documentada.',
    criteriosUtilizacao: `1. Angina refratária ao tratamento clínico
2. Isquemia miocárdica documentada
3. Lesão coronariana significativa (>70% de obstrução)
4. Anatomia favorável`,
    indicacoes: `- Angina estável refratária
- Síndrome coronariana aguda
- Isquemia silenciosa com grande área em risco
- Pós-infarto com isquemia residual`,
    contraindicacoes: `- Doença trivascular complexa (indicação cirúrgica)
- Lesão de tronco da coronária esquerda não protegida
- Função ventricular muito comprometida
- Expectativa de vida < 1 ano`,
    observacoes: 'Procedimento hemodinâmico que requer equipe especializada e infraestrutura adequada.'
  },
  '41001230': {
    codigoTUSS: '41001230',
    descricaoProcedimento: 'TC - Angiotomografia coronariana',
    temDUT: true,
    descricaoDUT: 'Cobertura obrigatória para avaliação inicial de pacientes sintomáticos com probabilidade pré-teste de 10 a 70%.',
    criteriosUtilizacao: `1. Avaliação inicial de pacientes sintomáticos com probabilidade pré-teste de 10 a 70% calculada segundo os critérios de Diamond Forrester revisado
2. Realização apenas em aparelhos multislice com 64 colunas de detectores ou mais
3. Paciente com ritmo cardíaco regular e frequência < 65 bpm`,
    indicacoes: `- Dor torácica atípica em paciente de risco intermediário
- Avaliação de anatomia coronariana pré-cirurgia valvar
- Avaliação de enxertos coronarianos (> 3mm)
- Investigação de anomalias coronarianas`,
    contraindicacoes: `- Arritmia cardíaca não controlada
- Insuficiência renal grave (clearance < 30ml/min)
- Alergia grave a contraste iodado
- Impossibilidade de controlar frequência cardíaca`,
    observacoes: 'Exame não invasivo que requer preparo adequado do paciente e controle de frequência cardíaca.'
  }
};

// Mock de portes cirúrgicos (baseado na tabela tbdomPorte)
export const mockPorteDatabase: Record<string, string> = {
  // Procedimentos cirúrgicos (30xxx)
  '30701011': '4B',
  '31301010': '4C',
  '31302017': '4C',
  '30208017': '3A',
  '30715598': '4A',
  '30717027': '4B',
  '30906113': '3B', // ANGIOPLASTIA TRANSLUMINAL TRANSOPERATORIA - POR ARTERIA
  '30913101': '2C', // IMPLANTE CIRURGICO DE CATETER DE LONGA PERMANENCIA PARA NPP
  // Procedimentos não cirúrgicos não têm porte
};

// Função para obter porte de um procedimento
export function getPorteCirurgico(codigoTUSS: string): string | null {
  return mockPorteDatabase[codigoTUSS] || null;
}

// Função para verificar se procedimento é cirúrgico
export function isProcedimentoCirurgico(codigoTUSS: string): boolean {
  // Procedimentos cirúrgicos geralmente começam com 30xxx ou 31xxx
  return codigoTUSS.startsWith('30') || codigoTUSS.startsWith('31');
}

// Função para gerar validações mockadas baseadas no código TUSS
export function generateMockValidations(codigoTUSS: string, valorCobrado: number): ValidationResult[] {
  const validations: ValidationResult[] = [];
  
  // Hash baseado no código para consistência
  const hash = codigoTUSS.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  // 1. Validação de Porte Cirúrgico (apenas para procedimentos cirúrgicos)
  if (isProcedimentoCirurgico(codigoTUSS)) {
    const porte = getPorteCirurgico(codigoTUSS);
    if (porte) {
      validations.push({
        tipo: 'PORTE_CIRURGICO',
        status: 'CONFORME',
        mensagem: `Porte ${porte} identificado`,
        porteEsperado: porte,
        porteEncontrado: porte
      });
    } else {
      // Simular um porte esperado baseado no código
      const portesDisponiveis = ['1', '2A', '2B', '2C', '3A', '3B', '3C', '4A', '4B', '4C'];
      const porteEsperadoSimulado = portesDisponiveis[hash % portesDisponiveis.length];
      
      validations.push({
        tipo: 'PORTE_CIRURGICO',
        status: 'ALERTA',
        mensagem: `Porte cirúrgico não encontrado. Porte esperado: ${porteEsperadoSimulado}`,
        porteEsperado: porteEsperadoSimulado,
        porteEncontrado: 'Não encontrado'
      });
    }
  }
  
  // 2. Validação de DUT
  const temDUT = mockDUTDatabase[codigoTUSS]?.temDUT || false;
  if (temDUT) {
    const dutConforme = hash % 5 !== 0; // 80% conforme
    validations.push({
      tipo: 'DUT',
      status: dutConforme ? 'CONFORME' : 'ALERTA',
      mensagem: dutConforme 
        ? 'Procedimento em conformidade com DUT' 
        : 'Verificar critérios de utilização da DUT'
    });
  }
  
  // 3. Validação de Pacote Contratual
  const estaNoPacote = hash % 3 !== 0; // 66% está no pacote
  validations.push({
    tipo: 'PACOTE_CONTRATUAL',
    status: estaNoPacote ? 'CONFORME' : 'NAO_CONFORME',
    mensagem: estaNoPacote 
      ? 'Procedimento incluído no pacote contratual' 
      : 'Procedimento FORA do pacote contratual - Possível glosa'
  });
  
  // 4. Validação de Valor Contratual
  const valorContratado = valorCobrado * (0.9 + (hash % 20) / 100); // Variação de 90% a 110%
  const diferenca = valorCobrado - valorContratado;
  const percentualDiferenca = Math.abs((diferenca / valorContratado) * 100);
  
  if (percentualDiferenca > 5) {
    validations.push({
      tipo: 'VALOR_CONTRATUAL',
      status: diferenca > 0 ? 'ALERTA' : 'NAO_CONFORME',
      mensagem: diferenca > 0 
        ? `Valor cobrado ${percentualDiferenca.toFixed(1)}% acima do contratado`
        : `Valor cobrado ${percentualDiferenca.toFixed(1)}% abaixo do contratado`,
      valorEsperado: valorContratado,
      valorEncontrado: valorCobrado,
      diferenca: diferenca
    });
  } else {
    validations.push({
      tipo: 'VALOR_CONTRATUAL',
      status: 'CONFORME',
      mensagem: 'Valor conforme contrato',
      valorEsperado: valorContratado,
      valorEncontrado: valorCobrado,
      diferenca: diferenca
    });
  }
  
  return validations;
}

// Função para obter DUT mockada
export function getMockDUT(codigoTUSS: string): DUTData {
  return mockDUTDatabase[codigoTUSS] || {
    codigoTUSS,
    descricaoProcedimento: 'Procedimento sem descrição',
    temDUT: false
  };
}

// Função para calcular estatísticas de pendências
export interface PendenciasStats {
  total: number;
  portesDivergentes: number;
  dutNaoConformes: number;
  foraDoPacote: number;
  valoresDivergentes: number;
  duplicados: number;
}

export function calculatePendenciasStats(procedimentos: any[]): PendenciasStats {
  let stats: PendenciasStats = {
    total: 0,
    portesDivergentes: 0,
    dutNaoConformes: 0,
    foraDoPacote: 0,
    valoresDivergentes: 0,
    duplicados: 0
  };
  
  procedimentos.forEach(proc => {
    const validations = generateMockValidations(
      proc.codigoProcedimento || proc.codigoTUSS || '',
      Number(proc.valorTotal || proc.valorUnitario || 0)
    );
    
    validations.forEach(val => {
      if (val.status === 'NAO_CONFORME' || val.status === 'ALERTA') {
        stats.total++;
        
        switch (val.tipo) {
          case 'PORTE_CIRURGICO':
            stats.portesDivergentes++;
            break;
          case 'DUT':
            stats.dutNaoConformes++;
            break;
          case 'PACOTE_CONTRATUAL':
            stats.foraDoPacote++;
            break;
          case 'VALOR_CONTRATUAL':
            stats.valoresDivergentes++;
            break;
          case 'DUPLICIDADE':
            stats.duplicados++;
            break;
        }
      }
    });
  });
  
  return stats;
}
