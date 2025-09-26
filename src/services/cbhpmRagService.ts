// CBHPM RAG Service - Integração com sistema RAG de procedimentos médicos
export interface CBHPMProcedure {
  codigo: string;
  procedimento: string;
  porte: string;
  valor_final: number;
  similarity_score?: number;
}

export interface CBHPMSearchResponse {
  query: string;
  method: string;
  total_results: number;
  results: CBHPMProcedure[];
  timestamp: string;
}

export interface CBHPMChatResponse {
  message: string;
  context: string;
  answer: string;
  relevant_procedures: CBHPMProcedure[];
  total_found: number;
  timestamp: string;
}

export interface CBHPMHealthResponse {
  service: string;
  status: string;
  timestamp: string;
  version: string;
}

class CBHPMRagService {
  private baseURL = 'https://healthchain-apim.azure-api.net/cbhpm';

  // Busca procedimentos por query
  async searchProcedures(
    query: string, 
    options: {
      method?: 'semantic' | 'exact_match' | 'hybrid';
      top_k?: number;
    } = {}
  ): Promise<CBHPMSearchResponse> {
    try {
      const response = await fetch(`${this.baseURL}/api/v1/procedures/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: query,
          method: options.method || 'hybrid',
          top_k: options.top_k || 5
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao buscar procedimentos CBHPM:', error);
      throw error;
    }
  }

  // Integração com chat para consultas em linguagem natural
  async chatQuery(message: string, context: string = 'medical_consultation'): Promise<CBHPMChatResponse> {
    try {
      const response = await fetch(`${this.baseURL}/api/v1/chat/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message,
          context: context
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erro no chat CBHPM:', error);
      throw error;
    }
  }

  // Health check do serviço
  async healthCheck(): Promise<CBHPMHealthResponse> {
    try {
      const response = await fetch(`${this.baseURL}/health`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erro no health check CBHPM:', error);
      throw error;
    }
  }

  // Busca por código específico
  async searchByCode(codigo: string): Promise<CBHPMSearchResponse> {
    return this.searchProcedures(codigo, { method: 'exact_match', top_k: 1 });
  }

  // Busca por porte
  async searchByPorte(porte: string): Promise<CBHPMSearchResponse> {
    return this.searchProcedures(`porte ${porte}`, { method: 'semantic', top_k: 10 });
  }

  // Estatísticas do sistema
  async getStatistics(): Promise<any> {
    try {
      const response = await fetch(`${this.baseURL}/api/v1/procedures/stats`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao obter estatísticas CBHPM:', error);
      throw error;
    }
  }
}

export default new CBHPMRagService();
