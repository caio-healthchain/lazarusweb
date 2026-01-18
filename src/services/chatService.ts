import axios from 'axios';

const ORCHESTRATOR_URL = import.meta.env.VITE_ORCHESTRATOR_URL || 'https://lazarusapi.azure-api.net/chatai';

export interface ChatResponse {
  answer: string;
  source: 'mcp' | 'rag' | 'hybrid';
  confidence: number;
  metadata?: {
    toolsUsed?: string[];
    dataRetrieved?: any;
  };
}

export const sendMessage = async (message: string, conversationId: string): Promise<ChatResponse> => {
  try {
    console.log(`[ChatService] Enviando mensagem para orquestrador: "${message}"`);

    const response = await axios.post(
      `${ORCHESTRATOR_URL}/api/v1/chat`,
      {
        question: message,
        conversationId,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('[ChatService] Resposta do orquestrador:', response.data);

    if (response.data.success && response.data.data) {
      return response.data.data;
    } else {
      throw new Error(response.data.error || 'Erro desconhecido no orquestrador');
    }

  } catch (error: any) {
    console.error('[ChatService] Erro ao enviar mensagem:', error);
    
    // Tratamento de erro melhorado
    if (error.response?.data?.error) {
      throw new Error(error.response.data.error);
    } else if (error.response?.status === 400) {
      throw new Error('Requisição inválida. Verifique o formato da pergunta.');
    } else if (error.response?.status === 500) {
      throw new Error('Erro no servidor do orquestrador. Tente novamente.');
    } else {
      throw new Error(error.message || 'Erro ao conectar com o orquestrador');
    }
  }
};
