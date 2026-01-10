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
  question: string;
  userId?: string;
  conversationId?: string;
  context?: Record<string, any>;
}

class ChatService {
  private baseURL: string;

  constructor() {
    this.baseURL = import.meta.env.VITE_ORCHESTRATOR_URL || 'http://localhost:3005';
  }

  async sendMessage(request: ChatRequest): Promise<ChatResponse> {
    try {
      const response = await axios.post(`${this.baseURL}/api/v1/chat`, request, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error: any) {
      console.error('Erro ao enviar mensagem:', error);
      throw new Error(error.response?.data?.message || 'Erro ao processar pergunta');
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
