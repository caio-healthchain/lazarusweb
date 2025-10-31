import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Send, 
  Brain, 
  Sparkles, 
  FileText, 
  BarChart3, 
  Users, 
  DollarSign,
  Lightbulb,
  TrendingUp,
  AlertCircle,
  Clock,
  Bot,
  User,
  Heart,
  Bone,
  Microscope,
  Stethoscope,
  Syringe,
  ClipboardList,
  Search,
  RefreshCw,
  Copy,
  ExternalLink
} from 'lucide-react';
import { useCBHPMChat, ChatMessage } from '@/hooks/useCBHPMChat';
import { CBHPMProcedure } from '@/services/cbhpmRagService';

const ManagerialChat = () => {
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { 
    chatHistory, 
    isLoading, 
    error, 
    sendMessage, 
    searchByCode,
    clearHistory,
    getQuickSuggestions 
  } = useCBHPMChat();

  const quickSuggestions = getQuickSuggestions();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const message = inputMessage.trim();
    setInputMessage('');
    
    await sendMessage(message);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputMessage(suggestion);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error('Erro ao copiar:', err);
    }
  };

  const renderProcedureCard = (procedure: CBHPMProcedure, index: number) => (
    <Card key={index} className="mt-3 bg-blue-50 border-blue-200">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="outline" className="text-xs font-mono">
                {procedure.codigo}
              </Badge>
              {procedure.similarity_score && (
                <Badge variant="secondary" className="text-xs">
                  {(procedure.similarity_score * 100).toFixed(1)}% relevante
                </Badge>
              )}
            </div>
            <p className="text-sm font-medium text-gray-900 mb-2">
              {procedure.procedimento}
            </p>
            <div className="flex gap-4 text-xs text-gray-600">
              <span><strong>Porte:</strong> {procedure.porte}</span>
              <span><strong>Valor:</strong> R$ {procedure.valor_final?.toFixed(2) || 'N/A'}</span>
            </div>
          </div>
          <div className="flex gap-1 ml-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => copyToClipboard(procedure.codigo)}
              className="h-6 w-6 p-0"
            >
              <Copy className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderMessage = (message: ChatMessage) => {
    const isUser = message.sender === 'user';
    const isError = message.type === 'error';

    return (
      <div
        key={message.id}
        className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
      >
        <div className={`flex space-x-3 max-w-4xl ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
          {/* Avatar */}
          <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
            isUser 
              ? 'bg-blue-600' 
              : isError 
                ? 'bg-red-500'
                : 'bg-gradient-to-r from-purple-600 to-blue-600'
          }`}>
            {isUser ? (
              <User className="h-4 w-4 text-white" />
            ) : (
              <Bot className="h-4 w-4 text-white" />
            )}
          </div>

          {/* Message Content */}
          <div className={`rounded-lg px-4 py-3 ${
            isUser
              ? 'bg-blue-600 text-white'
              : isError
                ? 'bg-red-50 border border-red-200 text-red-800'
                : 'bg-white border border-gray-200 text-gray-900'
          }`}>
            <div className="whitespace-pre-wrap text-sm leading-relaxed">
              {message.content}
            </div>

            {/* Render procedures if available */}
            {message.procedures && message.procedures.length > 0 && (
              <div className="mt-3">
                {message.procedures.slice(0, 5).map((procedure, index) => 
                  renderProcedureCard(procedure, index)
                )}
                {message.procedures.length > 5 && (
                  <p className="text-xs text-gray-500 mt-2">
                    ... e mais {message.procedures.length - 5} procedimento(s)
                  </p>
                )}
              </div>
            )}

            {/* Metadata */}
            {message.metadata && message.metadata.total_found !== undefined && (
              <div className="mt-2 text-xs text-gray-500">
                {message.metadata.total_found > 0 && 
                  `${message.metadata.total_found} procedimento(s) encontrado(s)`
                }
              </div>
            )}

            <div className={`text-xs mt-2 ${
              isUser ? 'text-blue-100' : isError ? 'text-red-600' : 'text-gray-500'
            }`}>
              {message.timestamp.toLocaleTimeString('pt-BR', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex-shrink-0">
        <div className="flex items-center justify-between ">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                Assistente CBHPM RAG
              </h1>
              <p className="text-sm text-gray-500">
                Consultas inteligentes de procedimentos médicos e códigos TUSS/TISS
              </p>
            </div>
          </div>
          {/* Lado Direito (Badges e Ações) */}
            <div className="flex items-center space-x-3"> {/* Aumentado o espaço para space-x-3 */}
                <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 text-sm font-medium px-3 py-1"> {/* Ajustado o Badge */}
                    <Sparkles className="mr-1 h-3 w-3" />
                    RAG Ativo
                </Badge>
                <Button
                    size="sm"
                    variant="outline"
                    onClick={clearHistory}
                    className="h-8 border-gray-300 hover:bg-gray-50 text-gray-700" // Cor da borda mais clara e hover mais discreto
                >
                    <RefreshCw className="h-3 w-3 mr-1" />
                    Limpar
                </Button>
            </div>       
        </div>
      </div>

  <div className="flex-1 flex overflow-hidden min-h-0">
        {/* Sidebar with suggestions */}
        <div className="w-80 bg-white border-r border-gray-200 p-4 flex-shrink-0 overflow-y-auto">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
            <Lightbulb className="h-4 w-4 mr-2" />
            Consultas Rápidas
          </h3>
          <div className="space-y-2">
            {quickSuggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion.text)}
                className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors group"
                disabled={isLoading}
              >
                <div className="flex items-start space-x-3">
                  <span className="text-lg">{suggestion.icon}</span>
                  <div>
                    <p className="text-sm font-medium text-gray-900 group-hover:text-blue-900">
                      {suggestion.text}
                    </p>
                    <Badge variant="outline" className="mt-1 text-xs">
                      {suggestion.category}
                    </Badge>
                  </div>
                </div>
              </button>
            ))}
          </div>

          

          {/* Quick Actions */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <h4 className="font-medium text-gray-900 mb-3 text-sm">Ações Rápidas</h4>
            <div className="space-y-2">
              <Button
                size="sm"
                variant="outline"
                className="w-full justify-start text-xs"
                onClick={() => handleSuggestionClick('Buscar código 10101012')}
                disabled={isLoading}
              >
                <Search className="h-3 w-3 mr-2" />
                Buscar por Código
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="w-full justify-start text-xs"
                onClick={() => handleSuggestionClick('Procedimentos porte 4')}
                disabled={isLoading}
              >
                <BarChart3 className="h-3 w-3 mr-2" />
                Filtrar por Porte
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="w-full justify-start text-xs"
                onClick={() => handleSuggestionClick('Valores de consultas')}
                disabled={isLoading}
              >
                <DollarSign className="h-3 w-3 mr-2" />
                Consultar Valores
              </Button>
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col min-h-0">
          {/* Messages */}
          <ScrollArea className="flex-1 p-6 min-h-0">
            <div className="space-y-6 max-w-5xl mx-auto pb-24">
              {chatHistory.map(renderMessage)}

              {/* Typing Indicator */}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex space-x-3 max-w-3xl">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center">
                      <Bot className="h-4 w-4 text-white" />
                    </div>
                    <div className="bg-white border border-gray-200 rounded-lg px-4 py-3">
                      <div className="flex items-center space-x-2">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                        <span className="text-xs text-gray-500">Consultando base CBHPM...</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Input Area */}
          <div className="border-t border-gray-200 bg-white p-4">
            <div className="max-w-5xl mx-auto">
              {/* Error Display */}
              {error && (
                <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center text-red-800 text-sm">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    {error}
                  </div>
                </div>
              )}

              <div className="flex space-x-3">
                <div className="flex-1">
                  <Input
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Digite sua consulta sobre procedimentos CBHPM, códigos TUSS/TISS, portes ou valores..."
                    className="w-full"
                    disabled={isLoading}
                  />
                </div>
                <Button 
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isLoading}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isLoading ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
              
              <div className="flex items-center justify-between mt-2">
                <p className="text-xs text-gray-500">
                  🤖 IA especializada em CBHPM • 4.170+ procedimentos indexados • Busca semântica avançada
                </p>
                <div className="flex items-center text-xs text-gray-400">
                  <Clock className="h-3 w-3 mr-1" />
                  Resposta em tempo real
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerialChat;
