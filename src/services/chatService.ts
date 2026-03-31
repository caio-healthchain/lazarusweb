// Chat Service com Mock
import axios from 'axios';
import { MOCK_CHAT_RESPONSES, MOCK_DASHBOARD_METRICS } from './mockData';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

// Função para encontrar a melhor resposta mockada
const findMockResponse = (message: string): string => {
  const lowerMessage = message.toLowerCase();
  
  // Procurar por palavras-chave
  for (const [key, response] of Object.entries(MOCK_CHAT_RESPONSES)) {
    if (key !== 'default' && lowerMessage.includes(key)) {
      return response;
    }
  }
  
  // Se não encontrar, retornar resposta padrão
  return MOCK_CHAT_RESPONSES.default;
};

// Enviar mensagem e receber resposta
export const sendMessage = async (message: string, conversationId?: string): Promise<string> => {
  console.log('💬 Chat Mock - Mensagem do usuário:', message);
  
  // Simular delay de processamento
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const response = findMockResponse(message);
  console.log('💬 Chat Mock - Resposta:', response);
  
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
