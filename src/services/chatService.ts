import axios from 'axios';

const ORCHESTRATOR_URL = import.meta.env.VITE_ORCHESTRATOR_URL || 'http://localhost:3005';

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
    console.log(`[ChatService] Sending message to orchestrator: "${message}"`);

    const response = await axios.post(
      `${ORCHESTRATOR_URL}/api/v1/chat`,
      {
        question: message, // O orquestrador espera 'question'
        conversationId,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('[ChatService] Response from orchestrator:', response.data);

    if (response.data.success) {
      return response.data.data;
    } else {
      throw new Error(response.data.error || 'Erro desconhecido no orquestrador');
    }

  } catch (error: any) {
    console.error('[ChatService] Error sending message:', error);
    throw new Error(error.response?.data?.error || error.message || 'Erro ao conectar com o orquestrador');
  }
};
