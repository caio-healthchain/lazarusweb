// Chat Service com Mock para Demo
import { MOCK_CHAT_RESPONSES, MOCK_DASHBOARD_METRICS } from './mockData';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface ChatResponse {
  answer: string;
  source: 'mcp' | 'rag' | 'knowledge';
  metadata?: {
    procedures?: any[];
    saving_total?: number;
    saving_details?: any;
    dataRetrieved?: {
      procedures?: any[];
      total_found?: number;
    };
    [key: string]: any;
  };
}

// Função para encontrar a melhor resposta mockada
const findMockResponse = (message: string): ChatResponse => {
  const lowerMessage = message.toLowerCase();

  // Procedimentos mais realizados (para dashboard)
  if (lowerMessage.includes('procedimentos mais realizados') || lowerMessage.includes('top procedimentos')) {
    return {
      answer: 'Os 5 procedimentos mais realizados este mês foram: Apendicectomia (12x), Consulta Cardiológica (28x), Hemograma Completo (45x), Raio-X Tórax (33x) e Eletrocardiograma (21x).',
      source: 'knowledge',
      metadata: {
        procedures: [
          { name: 'Hemograma Completo', count: 45 },
          { name: 'Raio-X Tórax', count: 33 },
          { name: 'Consulta Cardiológica', count: 28 },
          { name: 'Eletrocardiograma', count: 21 },
          { name: 'Apendicectomia', count: 12 },
        ],
        dataRetrieved: {
          procedures: [
            { codigo: '40304361', procedimento: 'Hemograma Completo', porte: '1A', valor_final: 15.65 },
            { codigo: '40801020', procedimento: 'Raio-X Tórax', porte: '2B', valor_final: 45.00 },
            { codigo: '10101012', procedimento: 'Consulta Cardiológica', porte: '3C', valor_final: 250.00 },
          ],
          total_found: 5,
        },
      },
    };
  }

  // Saving / economia
  if (lowerMessage.includes('saving') || lowerMessage.includes('economia') || lowerMessage.includes('correções')) {
    return {
      answer: 'Este mês o hospital teve um saving total de R$ 47.250,00 com correções de auditoria. As principais correções foram em portes cirúrgicos (R$ 28.500), materiais não cobertos (R$ 12.750) e cobranças duplicadas (R$ 6.000).',
      source: 'knowledge',
      metadata: {
        saving_total: 47250,
        saving_details: {
          portes_cirurgicos: 28500,
          materiais_nao_cobertos: 12750,
          cobrancas_duplicadas: 6000,
        },
        dataRetrieved: {
          procedures: [],
          total_found: 0,
        },
      },
    };
  }

  // Procedimentos de alto porte
  if (lowerMessage.includes('alto porte') || lowerMessage.includes('porte alto')) {
    return {
      answer: 'Encontrei 3 procedimentos de alto porte realizados este mês:\n\n1. **Artroplastia Total de Joelho** (31301010) - Porte 14C - R$ 2.437,52\n2. **Redução de Fratura de Fêmur** (31201401) - Porte 12B - R$ 12.000,00\n3. **Apendicectomia Videolaparoscópica** (31101192) - Porte 10A - R$ 8.000,00',
      source: 'rag',
      metadata: {
        dataRetrieved: {
          procedures: [
            { codigo: '31301010', procedimento: 'Artroplastia Total de Joelho', porte: '14C', valor_final: 2437.52 },
            { codigo: '31201401', procedimento: 'Redução de Fratura de Fêmur', porte: '12B', valor_final: 12000.00 },
            { codigo: '31101192', procedimento: 'Apendicectomia Videolaparoscópica', porte: '10A', valor_final: 8000.00 },
          ],
          total_found: 3,
        },
      },
    };
  }

  // Procedimentos mais caros
  if (lowerMessage.includes('mais caros') || lowerMessage.includes('maior valor')) {
    return {
      answer: 'Os procedimentos mais caros realizados este mês:\n\n1. **Redução de Fratura de Fêmur** - R$ 12.000,00\n2. **Apendicectomia** - R$ 8.000,00\n3. **Internação em Enfermaria** (6 diárias) - R$ 6.000,00',
      source: 'knowledge',
      metadata: {
        dataRetrieved: {
          procedures: [
            { codigo: '31201401', procedimento: 'Redução de Fratura de Fêmur', porte: '12B', valor_final: 12000.00 },
            { codigo: '31101192', procedimento: 'Apendicectomia', porte: '10A', valor_final: 8000.00 },
            { codigo: '40010019', procedimento: 'Internação em Enfermaria', porte: 'N/A', valor_final: 6000.00 },
          ],
          total_found: 3,
        },
      },
    };
  }

  // Procedimentos cirúrgicos
  if (lowerMessage.includes('cirúrgic') || lowerMessage.includes('cirurgic')) {
    return {
      answer: 'Procedimentos cirúrgicos realizados este mês:\n\n1. **Apendicectomia Videolaparoscópica** (31101192) - 12 realizações\n2. **Redução de Fratura de Fêmur** (31201401) - 3 realizações\n3. **Artroplastia Total de Joelho** (31301010) - 2 realizações',
      source: 'rag',
      metadata: {
        dataRetrieved: {
          procedures: [
            { codigo: '31101192', procedimento: 'Apendicectomia Videolaparoscópica', porte: '10A', valor_final: 8000.00 },
            { codigo: '31201401', procedimento: 'Redução de Fratura de Fêmur', porte: '12B', valor_final: 12000.00 },
            { codigo: '31301010', procedimento: 'Artroplastia Total de Joelho', porte: '14C', valor_final: 2437.52 },
          ],
          total_found: 3,
        },
      },
    };
  }

  // Consultas e avaliações
  if (lowerMessage.includes('consulta') || lowerMessage.includes('avaliação') || lowerMessage.includes('avaliacao')) {
    return {
      answer: 'Consultas e avaliações realizadas este mês:\n\n1. **Consulta Cardiológica** (10101012) - 28 realizações - R$ 250,00 cada\n2. **Consulta Ortopédica** (10101020) - 15 realizações - R$ 220,00 cada\n3. **Avaliação Pré-Anestésica** (10102019) - 18 realizações - R$ 180,00 cada',
      source: 'rag',
      metadata: {
        dataRetrieved: {
          procedures: [
            { codigo: '10101012', procedimento: 'Consulta Cardiológica', porte: '3C', valor_final: 250.00 },
            { codigo: '10101020', procedimento: 'Consulta Ortopédica', porte: '3B', valor_final: 220.00 },
            { codigo: '10102019', procedimento: 'Avaliação Pré-Anestésica', porte: '2A', valor_final: 180.00 },
          ],
          total_found: 3,
        },
      },
    };
  }

  // Exames
  if (lowerMessage.includes('exame') || lowerMessage.includes('complementar')) {
    return {
      answer: 'Exames complementares mais solicitados:\n\n1. **Hemograma Completo** (40304361) - 45 realizações - R$ 15,65\n2. **Raio-X Tórax** (40801020) - 33 realizações - R$ 45,00\n3. **Eletrocardiograma** (40401014) - 21 realizações - R$ 35,00',
      source: 'rag',
      metadata: {
        dataRetrieved: {
          procedures: [
            { codigo: '40304361', procedimento: 'Hemograma Completo', porte: '1A', valor_final: 15.65 },
            { codigo: '40801020', procedimento: 'Raio-X Tórax', porte: '2B', valor_final: 45.00 },
            { codigo: '40401014', procedimento: 'Eletrocardiograma', porte: '1B', valor_final: 35.00 },
          ],
          total_found: 3,
        },
      },
    };
  }

  // Buscar código
  if (lowerMessage.includes('código') || lowerMessage.includes('codigo') || lowerMessage.match(/\d{8}/)) {
    const codeMatch = lowerMessage.match(/\d{8}/);
    const code = codeMatch ? codeMatch[0] : '31101192';
    return {
      answer: `Encontrei o procedimento com código ${code}:\n\n**Apendicectomia Videolaparoscópica**\n- Código TUSS: ${code}\n- Porte: 10A\n- Valor CBHPM: R$ 1.218,76\n- Valor contratado: R$ 8.000,00`,
      source: 'rag',
      metadata: {
        dataRetrieved: {
          procedures: [
            { codigo: code, procedimento: 'Apendicectomia Videolaparoscópica', porte: '10A', valor_final: 1218.76 },
          ],
          total_found: 1,
        },
      },
    };
  }

  // Procurar por palavras-chave nos mock responses antigos
  for (const [key, response] of Object.entries(MOCK_CHAT_RESPONSES)) {
    if (key !== 'default' && lowerMessage.includes(key)) {
      return {
        answer: response,
        source: 'knowledge',
        metadata: {
          dataRetrieved: {
            procedures: [],
            total_found: 0,
          },
        },
      };
    }
  }

  // Default
  return {
    answer: MOCK_CHAT_RESPONSES.default,
    source: 'knowledge',
    metadata: {
      dataRetrieved: {
        procedures: [],
        total_found: 0,
      },
    },
  };
};

// Enviar mensagem e receber resposta
export const sendMessage = async (message: string, conversationId?: string): Promise<ChatResponse> => {
  console.log('Chat Mock - Mensagem:', message);

  // Simular delay de processamento
  await new Promise(resolve => setTimeout(resolve, 1000));

  const response = findMockResponse(message);
  console.log('Chat Mock - Resposta:', response.answer.substring(0, 80) + '...');

  return response;
};

// Obter histórico de conversas (mock)
export const getConversationHistory = async (): Promise<ChatMessage[]> => {
  return [
    {
      id: '1',
      role: 'assistant',
      content: MOCK_CHAT_RESPONSES.default,
      timestamp: new Date(Date.now() - 5 * 60000),
    },
  ];
};

// Obter informações do sistema para o chat
export const getSystemInfo = () => {
  return {
    hospital: 'Hospital Sagrada Família',
    metrics: MOCK_DASHBOARD_METRICS,
    timestamp: new Date().toISOString(),
  };
};

export const chatService = {
  sendMessage,
  getConversationHistory,
  getSystemInfo,
};

export default chatService;
