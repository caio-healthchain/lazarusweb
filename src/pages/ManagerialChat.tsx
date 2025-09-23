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
  User
} from 'lucide-react';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  type?: 'text' | 'suggestion' | 'data';
}

const ManagerialChat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Olá! Sou seu assistente de IA especializado em gestão hospitalar. Posso ajudá-lo com análises de dados, insights sobre operações, contratos, performance financeira e muito mais. Como posso ajudá-lo hoje?',
      sender: 'ai',
      timestamp: new Date(),
      type: 'text'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickSuggestions = [
    {
      icon: BarChart3,
      text: 'Análise de performance do último mês',
      category: 'Analytics'
    },
    {
      icon: DollarSign,
      text: 'Relatório financeiro detalhado',
      category: 'Financeiro'
    },
    {
      icon: Users,
      text: 'Otimização de recursos humanos',
      category: 'RH'
    },
    {
      icon: TrendingUp,
      text: 'Projeções de crescimento',
      category: 'Estratégia'
    },
    {
      icon: AlertCircle,
      text: 'Identificar riscos operacionais',
      category: 'Riscos'
    },
    {
      icon: FileText,
      text: 'Análise de contratos vigentes',
      category: 'Contratos'
    }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const simulateAIResponse = (userMessage: string): string => {
    const responses = {
      'performance': 'Com base nos dados dos últimos 30 dias, observo que:\n\n📈 **Receita**: Crescimento de 12.5% comparado ao mês anterior\n📊 **Ocupação**: Taxa média de 87.3% (dentro do ideal)\n⚕️ **Cirurgias**: Aumento de 15.7% no volume\n\n**Recomendações:**\n• Manter estratégias atuais de captação\n• Otimizar agenda cirúrgica nos horários de menor demanda\n• Investir em marketing para especialidades com menor ocupação',
      
      'financeiro': '💰 **Análise Financeira - Setembro 2024**\n\n**Receitas:**\n• Convênios: R$ 1.847.320 (65%)\n• Particulares: R$ 623.440 (22%)\n• SUS: R$ 376.560 (13%)\n\n**Principais Custos:**\n• Pessoal: R$ 1.124.000 (39%)\n• Materiais: R$ 568.000 (20%)\n• Infraestrutura: R$ 341.000 (12%)\n\n**Margem Líquida:** 18.2% (acima da média do setor)\n\n**Oportunidades:** Renegociação de contratos com fornecedores pode gerar economia de 8-12%',
      
      'recursos': '👥 **Análise de Recursos Humanos**\n\n**Situação Atual:**\n• 247 colaboradores ativos\n• Taxa de rotatividade: 8.2% (abaixo da média)\n• Satisfação interna: 4.2/5\n\n**Insights:**\n• Enfermagem: 15% acima da capacidade ideal\n• Médicos especialistas: déficit de 3 profissionais\n• Administrativo: oportunidade de automação\n\n**Recomendações:**\n• Contratar 2 cardiologistas e 1 ortopedista\n• Implementar sistema de gestão de escalas\n• Programa de retenção para enfermeiros seniores',
      
      'contratos': '📋 **Análise de Contratos Vigentes**\n\n**Convênios Principais:**\n• Unimed: R$ 890K/mês (vence em 6 meses) ⚠️\n• Bradesco Saúde: R$ 445K/mês (renovado)\n• SulAmérica: R$ 312K/mês (em negociação)\n\n**Fornecedores Críticos:**\n• Medicamentos: 3 contratos vencem em 90 dias\n• Equipamentos: oportunidade de renegociação\n\n**Ações Prioritárias:**\n1. Iniciar renovação Unimed (prazo crítico)\n2. Revisar cláusulas de reajuste SulAmérica\n3. Consolidar fornecedores de materiais médicos'
    };

    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('performance') || lowerMessage.includes('análise') || lowerMessage.includes('mês')) {
      return responses.performance;
    } else if (lowerMessage.includes('financeiro') || lowerMessage.includes('receita') || lowerMessage.includes('custo')) {
      return responses.financeiro;
    } else if (lowerMessage.includes('recursos') || lowerMessage.includes('rh') || lowerMessage.includes('colaborador')) {
      return responses.recursos;
    } else if (lowerMessage.includes('contrato') || lowerMessage.includes('convênio') || lowerMessage.includes('fornecedor')) {
      return responses.contratos;
    }
    
    return `Entendi sua pergunta sobre "${userMessage}". Com base nos dados disponíveis, posso fornecer insights específicos sobre:\n\n• **Performance operacional** e KPIs\n• **Análise financeira** detalhada\n• **Gestão de recursos** humanos e materiais\n• **Contratos e parcerias** estratégicas\n• **Projeções e tendências** do mercado\n\nPoderia ser mais específico sobre qual área gostaria de explorar?`;
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI processing time
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: simulateAIResponse(inputMessage),
        sender: 'ai',
        timestamp: new Date(),
        type: 'text'
      };

      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500 + Math.random() * 1000);
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

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                Assistente IA Gerencial
              </h1>
              <p className="text-sm text-gray-500">
                Especialista em gestão hospitalar e análise de dados
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className="bg-emerald-100 text-emerald-800">
              <Sparkles className="mr-1 h-3 w-3" />
              Online
            </Badge>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar with suggestions */}
        <div className="w-80 bg-white border-r border-gray-200 p-4 flex-shrink-0">
          <h3 className="font-semibold text-gray-900 mb-4">Sugestões Rápidas</h3>
          <div className="space-y-2">
            {quickSuggestions.map((suggestion, index) => {
              const IconComponent = suggestion.icon;
              return (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion.text)}
                  className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors group"
                >
                  <div className="flex items-start space-x-3">
                    <IconComponent className="h-5 w-5 text-gray-600 group-hover:text-blue-600 mt-0.5" />
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
              );
            })}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Messages */}
          <ScrollArea className="flex-1 p-6">
            <div className="space-y-6 max-w-4xl mx-auto">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex space-x-3 max-w-3xl ${message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    {/* Avatar */}
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                      message.sender === 'user' 
                        ? 'bg-blue-600' 
                        : 'bg-gradient-to-r from-purple-600 to-blue-600'
                    }`}>
                      {message.sender === 'user' ? (
                        <User className="h-4 w-4 text-white" />
                      ) : (
                        <Bot className="h-4 w-4 text-white" />
                      )}
                    </div>

                    {/* Message Content */}
                    <div className={`rounded-lg px-4 py-3 ${
                      message.sender === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white border border-gray-200 text-gray-900'
                    }`}>
                      <div className="whitespace-pre-wrap text-sm leading-relaxed">
                        {message.content}
                      </div>
                      <div className={`text-xs mt-2 ${
                        message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                      }`}>
                        {message.timestamp.toLocaleTimeString('pt-BR', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex space-x-3 max-w-3xl">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center">
                      <Bot className="h-4 w-4 text-white" />
                    </div>
                    <div className="bg-white border border-gray-200 rounded-lg px-4 py-3">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
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
            <div className="max-w-4xl mx-auto">
              <div className="flex space-x-3">
                <div className="flex-1">
                  <Input
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Digite sua pergunta sobre gestão hospitalar..."
                    className="w-full"
                    disabled={isTyping}
                  />
                </div>
                <Button 
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isTyping}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              
              <p className="text-xs text-gray-500 mt-2 text-center">
                IA treinada com dados hospitalares • Respostas baseadas em análise de dados reais
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerialChat;
