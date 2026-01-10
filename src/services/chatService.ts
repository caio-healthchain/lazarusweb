import axios from 'axios';

export interface ChatResponse {
  answer: string;
  source: 'mcp' | 'rag';
  tool_used?: string;
  confidence: number;
  metadata?: Record<string, any>;
  timestamp: string;
}

export interface ChatRequest {
  message: string; // Campo obrigatório conforme esperado pelo ms-chat-ai
  userId?: string;
  conversationId?: string;
  context?: Record<string, any>;
}

class ChatService {
  private baseURL: string;
  private chatEndpoint: string;

  constructor() {
    // URL do APIM em produção
    this.baseURL = import.meta.env.VITE_ORCHESTRATOR_URL || 'https://lazarusapi.azure-api.net';
    // Endpoint específico para o chat
    this.chatEndpoint = '/chatai/ask';
  }

  async sendMessage(request: ChatRequest): Promise<ChatResponse> {
    try {
      const endpoint = `${this.baseURL}${this.chatEndpoint}`;
      console.log('📤 Enviando pergunta para:', endpoint);
      console.log('📋 Payload:', request);
      
      const response = await axios.post(endpoint, request, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 30000,
      });
      
      console.log('✅ Resposta recebida:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao enviar mensagem:', error);
      console.error('URL tentada:', `${this.baseURL}${this.chatEndpoint}`);
      console.error('Status:', error.response?.status);
      console.error('Dados do erro:', error.response?.data);
      throw new Error(error.response?.data?.message || error.response?.data?.error || 'Erro ao processar pergunta');
    }
  }

  async getAnalytics(analyticsType: string, params?: Record<string, any>): Promise<any> {
    try {
      const response = await axios.get(
        `${this.baseURL}/api/v1/analytics/${analyticsType}`,
        { params }
      );
      return response.data;
    } catch (error: any) {
      console.error(`Erro ao obter ${analyticsType}:`, error);
      throw error;
    }
  }

  async healthCheck(): Promise<boolean> {
    try {
      const response = await axios.get(`${this.baseURL}/health`);
      return response.status === 200;
    } catch {
      return false;
    }
  }
}

export default new ChatService();
