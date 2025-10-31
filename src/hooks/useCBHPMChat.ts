import { useState, useCallback } from 'react';
import CBHPMRagService, { CBHPMProcedure, CBHPMChatResponse } from '../services/cbhpmRagService';

export interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  type: 'text' | 'procedures' | 'error';
  procedures?: CBHPMProcedure[];
  metadata?: {
    total_found?: number;
    context?: string;
    query_type?: string;
  };
}

export const useCBHPMChat = () => {
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    {
      id: '1',
      content: '🏥 Olá! Sou seu assistente especializado em procedimentos médicos CBHPM. Posso ajudá-lo com:\n\n• 📋 Consulta de códigos e procedimentos\n• 💰 Valores e portes de cirurgias\n• 🔍 Busca por especialidades\n• ⚕️ Informações sobre cobertura\n• 📊 Análise de contratos médicos\n\nComo posso ajudá-lo hoje?',
      sender: 'ai',
      timestamp: new Date(),
      type: 'text'
    }
  ]);
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(async (message: string): Promise<CBHPMChatResponse | null> => {
    if (!message.trim()) return null;

    setIsLoading(true);
    setError(null);

    try {
      // Adicionar mensagem do usuário
      const userMessage: ChatMessage = {
        id: Date.now().toString(),
        content: message,
        sender: 'user',
        timestamp: new Date(),
        type: 'text'
      };

      setChatHistory(prev => [...prev, userMessage]);

      // Enviar para o RAG CBHPM
      const response = await CBHPMRagService.chatQuery(message);

      // Determinar tipo de resposta baseado no conteúdo
      const hasRelevantProcedures = response.relevant_procedures && response.relevant_procedures.length > 0;
      const messageType = hasRelevantProcedures ? 'procedures' : 'text';

      // Criar resposta do sistema
      let aiContent = response.answer;
      
      // Se há procedimentos relevantes, adicionar informações estruturadas
      if (hasRelevantProcedures) {
        aiContent += '\n\n📋 **Procedimentos Relacionados:**\n';
        response.relevant_procedures.slice(0, 3).forEach((proc, index) => {
          aiContent += `\n${index + 1}. **${proc.codigo}** - ${proc.procedimento}\n`;
          aiContent += `   • Porte: ${proc.porte}\n`;
          aiContent += `   • Valor: R$ ${proc.valor_final?.toFixed(2) || 'N/A'}\n`;
          if (proc.similarity_score) {
            aiContent += `   • Relevância: ${(proc.similarity_score * 100).toFixed(1)}%\n`;
          }
        });

        if (response.relevant_procedures.length > 3) {
          aiContent += `\n... e mais ${response.relevant_procedures.length - 3} procedimento(s) relacionado(s)`;
        }
      }

      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: aiContent,
        sender: 'ai',
        timestamp: new Date(),
        type: messageType,
        procedures: response.relevant_procedures,
        metadata: {
          total_found: response.total_found,
          context: response.context,
          query_type: hasRelevantProcedures ? 'procedure_search' : 'general_query'
        }
      };

      setChatHistory(prev => [...prev, aiMessage]);
      return response;

    } catch (err: any) {
      setError(err.message);
      
      // Adicionar mensagem de erro
      const errorMessage: ChatMessage = {
        id: (Date.now() + 2).toString(),
        content: '❌ Desculpe, ocorreu um erro ao processar sua consulta. Verifique sua conexão e tente novamente.\n\nSe o problema persistir, entre em contato com o suporte técnico.',
        sender: 'ai',
        timestamp: new Date(),
        type: 'error'
      };

      setChatHistory(prev => [...prev, errorMessage]);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const searchProcedures = useCallback(async (
    query: string, 
    options?: { method?: 'semantic' | 'exact_match' | 'hybrid'; top_k?: number }
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await CBHPMRagService.searchProcedures(query, options);
      return response;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const searchByCode = useCallback(async (codigo: string) => {
    return searchProcedures(codigo, { method: 'exact_match', top_k: 1 });
  }, [searchProcedures]);

  const clearHistory = useCallback(() => {
    setChatHistory([
      {
        id: '1',
        content: '🏥 Olá! Sou seu assistente especializado em procedimentos médicos CBHPM. Como posso ajudá-lo hoje?',
        sender: 'ai',
        timestamp: new Date(),
        type: 'text'
      }
    ]);
    setError(null);
  }, []);

  const getQuickSuggestions = useCallback(() => {
    return [
      {
        text: 'Consulta cardiológica',
        category: 'Consultas',
        icon: '🫀'
      },
      {
        text: 'Cirurgia ortopédica',
        category: 'Cirurgias',
        icon: '🦴'
      },
      {
        text: 'Exames de imagem',
        category: 'Exames',
        icon: '🔬'
      },
      {
        text: 'Procedimentos porte 3A',
        category: 'Portes',
        icon: '⚕️'
      },
      {
        text: 'Valores de anestesia',
        category: 'Anestesia',
        icon: '💉'
      },
      {
        text: 'Códigos TUSS mais utilizados',
        category: 'TUSS',
        icon: '📋'
      }
    ];
  }, []);

  return {
    chatHistory,
    isLoading,
    error,
    sendMessage,
    searchProcedures,
    searchByCode,
    clearHistory,
    getQuickSuggestions
  };
};
