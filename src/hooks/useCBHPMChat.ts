import { useState, useCallback } from 'react';
import { sendMessage, ChatResponse } from '../services/chatService';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: string;
  metadata?: ChatResponse;
}

export const useCBHPMChat = (conversationId: string) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addMessage = useCallback((text: string, sender: 'user' | 'bot', metadata?: ChatResponse) => {
    const newMessage: Message = {
      id: `${Date.now()}`,
      text,
      sender,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      metadata,
    };
    setMessages(prev => [...prev, newMessage]);
  }, []);

  const handleSendMessage = useCallback(async (messageText: string) => {
    if (!messageText.trim()) return;

    addMessage(messageText, 'user');
    setIsLoading(true);
    setError(null);

    try {
      const response = await sendMessage(messageText, conversationId);
      addMessage(response.answer, 'bot', response);
    } catch (err: any) {
      const errorMessage = err.message || 'Ocorreu um erro ao processar sua consulta.';
      setError(errorMessage);
      addMessage(`❌ Desculpe, ocorreu um erro. Tente novamente. (${errorMessage})`, 'bot');
    } finally {
      setIsLoading(false);
    }
  }, [addMessage, conversationId]);

  const clearChat = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  return { messages, isLoading, error, handleSendMessage, clearChat };
};
