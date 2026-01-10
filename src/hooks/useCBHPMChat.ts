import { useState, useCallback } from 'react';
import ChatService, { ChatResponse, ChatRequest } from '../services/chatService';

export interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  type: 'text' | 'procedures' | 'error';
  source?: 'mcp' | 'rag';
  metadata?: Record<string, any>;
}

export const useCBHPMChat = () => {
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    {
      id: '1',
      content: '🏥 Olá! Sou seu assistente especializado em análise hospitalar. Posso ajudá-lo com:\n\n• 📊 Análise de procedimentos\n• 💰 Economia com correções\n• 📋 Guias finalizadas\n• 🔍 Métricas de auditoria\n\nComo posso ajudá-lo hoje?',
      sender: 'ai',
      timestamp: new Date(),
      type: 'text',
      source: 'mcp'
    }
  ]);
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(async (message: string, userId?: string): Promise<ChatResponse | null> => {
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

      // Enviar para o orquestrador
      const chatRequest: ChatRequest = {
        message: message,
        userId: userId,
        conversationId: `conv_${Date.now()}`
      };

      const response = await ChatService.sendMessage(chatRequest);

      // Criar resposta do sistema
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: response.answer,
        sender: 'ai',
        timestamp: new Date(),
        type: 'text',
        source: response.source,
        metadata: response.metadata
      };

      setChatHistory(prev => [...prev, aiMessage]);
      return response;

    } catch (err: any) {
      setError(err.message);
      
      // Adicionar mensagem de erro
      const errorMessage: ChatMessage = {
        id: (Date.now() + 2).toString(),
        content: '❌ Desculpe, ocorreu um erro ao processar sua consulta. Verifique sua conexão e tente novamente.',
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

  const clearHistory = useCallback(() => {
    setChatHistory([
      {
        id: '1',
        content: '🏥 Olá! Sou seu assistente especializado em análise hospitalar. Como posso ajudá-lo hoje?',
        sender: 'ai',
        timestamp: new Date(),
        type: 'text',
        source: 'mcp'
      }
    ]);
    setError(null);
  }, []);

  const getQuickSuggestions = useCallback(() => {
    return [
      {
        text: 'Quais foram os procedimentos mais realizados?',
        category: 'Procedimentos',
        icon: '📊'
      },
      {
        text: 'Quanto eu tive de saving com correções?',
        category: 'Auditoria',
        icon: '💰'
      },
      {
        text: 'Quantas guias foram finalizadas hoje?',
        category: 'Guias',
        icon: '📋'
      },
      {
        text: 'Qual a taxa de aprovação das auditorias?',
        category: 'Métricas',
        icon: '✅'
      },
      {
        text: 'Qual a utilização média da sala cirúrgica?',
        category: 'Eficiência',
        icon: '⚕️'
      },
      {
        text: 'Quais os tipos de correções mais comuns?',
        category: 'Análise',
        icon: '🔍'
      }
    ];
  }, []);

  return {
    chatHistory,
    isLoading,
    error,
    sendMessage,
    clearHistory,
    getQuickSuggestions
  };
};
