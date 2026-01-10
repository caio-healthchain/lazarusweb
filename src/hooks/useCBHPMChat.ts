import { useState, useCallback } from 'react';
import { sendMessage, ChatResponse } from '../services/chatService';
import { CBHPMProcedure } from '../services/cbhpmRagService';

export interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  type?: 'message' | 'error';
  procedures?: CBHPMProcedure[];
  metadata?: {
    total_found?: number;
    [key: string]: any;
  };
  source?: 'mcp' | 'rag' | 'knowledge';
}

interface QuickSuggestion {
  text: string;
  icon: string;
  category: string;
}

export const useCBHPMChat = (conversationId?: string) => {
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addMessage = useCallback((
    content: string,
    sender: 'user' | 'bot',
    type: 'message' | 'error' = 'message',
    procedures?: CBHPMProcedure[],
    metadata?: ChatMessage['metadata'],
    source?: 'mcp' | 'rag' | 'knowledge'
  ) => {
    const newMessage: ChatMessage = {
      id: `${Date.now()}-${Math.random()}`,
      content,
      sender,
      timestamp: new Date(),
      type,
      procedures,
      metadata,
      source,
    };
    setChatHistory(prev => [...prev, newMessage]);
  }, []);

  const sendMessage_internal = useCallback(async (messageText: string) => {
    if (!messageText.trim()) return;

    addMessage(messageText, 'user');
    setIsLoading(true);
    setError(null);

    try {
      const response = await sendMessage(messageText, conversationId || '');
      
      addMessage(
        response.answer,
        'bot',
        'message',
        response.metadata?.dataRetrieved?.procedures || [],
        {
          total_found: response.metadata?.dataRetrieved?.total_found || 0,
        },
        response.source as 'mcp' | 'rag' | 'knowledge'
      );
    } catch (err: any) {
      const errorMessage = err.message || 'Ocorreu um erro ao processar sua consulta.';
      setError(errorMessage);
      addMessage(
        `❌ Desculpe, ocorreu um erro. Tente novamente. (${errorMessage})`,
        'bot',
        'error'
      );
    } finally {
      setIsLoading(false);
    }
  }, [addMessage, conversationId]);

  const clearHistory = useCallback(() => {
    setChatHistory([]);
    setError(null);
  }, []);

  const searchByCode = useCallback(async (codigo: string) => {
    const query = `Buscar código ${codigo}`;
    await sendMessage_internal(query);
  }, [sendMessage_internal]);

  const getQuickSuggestions = useCallback((): QuickSuggestion[] => {
    return [
      {
        text: 'Procedimentos de alto porte',
        icon: '🏥',
        category: 'Porte',
      },
      {
        text: 'Procedimentos mais caros',
        icon: '💰',
        category: 'Valor',
      },
      {
        text: 'Procedimentos cirúrgicos',
        icon: '🔬',
        category: 'Tipo',
      },
      {
        text: 'Consultas e avaliações',
        icon: '👨‍⚕️',
        category: 'Tipo',
      },
      {
        text: 'Exames complementares',
        icon: '🩺',
        category: 'Tipo',
      },
    ];
  }, []);

  return {
    chatHistory,
    isLoading,
    error,
    sendMessage: sendMessage_internal,
    searchByCode,
    clearHistory,
    getQuickSuggestions,
  };
};
