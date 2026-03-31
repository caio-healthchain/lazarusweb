import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Brain, X, Send, Sparkles, MessageSquare, TrendingUp, FileSearch, AlertTriangle } from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const WELCOME_MESSAGE: ChatMessage = {
  id: 'welcome',
  role: 'assistant',
  content: `Olá! Sou o assistente inteligente do Lazarus. Posso ajudá-lo com:

**Contas e Workflow**
- "Onde está a conta do paciente Maria?"
- "Quantas contas estão pendentes na frente administrativa?"

**Financeiro**
- "Qual o faturamento do mês?"
- "Quais operadoras têm mais glosas?"

**Procedimentos**
- "Qual o valor contratual da apendicectomia?"
- "Quais procedimentos estão com prejuízo?"

**Glosas**
- "Quantas glosas vencem esta semana?"
- "Qual a taxa de glosa da Unimed?"

Como posso ajudá-lo?`,
  timestamp: new Date(),
};

const QUICK_ACTIONS = [
  { label: 'Resumo do dia', icon: TrendingUp, query: 'Me dê um resumo do dia' },
  { label: 'Contas pendentes', icon: FileSearch, query: 'Quantas contas estão pendentes?' },
  { label: 'Glosas urgentes', icon: AlertTriangle, query: 'Quais glosas vencem esta semana?' },
];

const generateMockResponse = (message: string): string => {
  const lower = message.toLowerCase();
  
  if (lower.includes('resumo') || lower.includes('dia')) {
    return `**Resumo do Dia - Hospital Sagrada Família**

**Contas em Workflow:** 10 contas ativas
- Frente Administrativa: 2 pendentes
- Frente Enfermagem: 1 em complementação
- Frente Médica: 1 aguardando parecer
- Auditoria Final: 1 em revisão
- Enviadas à Operadora: 2

**Glosas:** 3 glosas ativas (R$ 8.350,00)
- 1 com prazo vencendo hoje (Amil)
- 1 em recurso (Bradesco)

**Faturamento:** R$ 248.000,00 total | R$ 129.350,00 aprovado

**Ação Recomendada:** Priorize a glosa da Amil (CT-2026-007) que vence hoje. Deseja que eu abra os detalhes?`;
  }
  
  if (lower.includes('pendente') || lower.includes('administrativa')) {
    return `**Contas Pendentes na Frente Administrativa:**

1. **CT-2026-001** - Maria Aparecida Silva
   - Colecistectomia Videolaparoscópica
   - Unimed São Paulo | R$ 18.500,00
   - Responsável: Ana Paula Ferreira
   - Tempo na fila: 32h
   - Pendência: Falta autorização prévia

2. **CT-2026-010** - Roberto Mendes Filho
   - Herniorrafia Inguinal
   - Amil | R$ 12.800,00
   - Responsável: Ana Paula Ferreira
   - Tempo na fila: 8h

**Sugestão IA:** A conta CT-2026-001 está há mais de 24h. Recomendo priorizar a validação para evitar atraso no faturamento.`;
  }
  
  if (lower.includes('glosa') || lower.includes('vence')) {
    return `**Glosas com Prazo Próximo:**

1. **CT-2026-007** - Carlos Eduardo Nunes (Amil)
   - Valor glosado: R$ 2.100,00
   - Prazo para recurso: **HOJE**
   - Motivo: Procedimento não autorizado previamente
   - **Recomendação IA:** Contestar com base no Art. 12 da RN 395/2016

2. **CT-2026-006** - Ana Beatriz Campos (Bradesco)
   - Valor glosado: R$ 3.750,00
   - Prazo: 5 dias
   - Motivo: Divergência de valores
   - **Recomendação IA:** Gerar laudo comparativo com tabela contratual

3. **CT-2026-008** - Pedro Henrique Souza (SulAmérica)
   - Valor glosado: R$ 2.500,00
   - Prazo: 12 dias
   - Status: Laudo já gerado

**Ação Urgente:** A glosa da Amil vence hoje! Deseja que eu prepare o recurso?`;
  }
  
  if (lower.includes('faturamento') || lower.includes('financeiro')) {
    return `**Indicadores Financeiros - Março 2026:**

| Indicador | Valor |
|-----------|-------|
| Faturamento Total | R$ 248.000,00 |
| Valor Aprovado | R$ 129.350,00 |
| Valor Glosado | R$ 8.350,00 |
| Taxa de Glosa | 30,0% |
| Tempo Médio de Ciclo | 4,2 dias |

**Top 3 Operadoras por Faturamento:**
1. SulAmérica: R$ 45.800,00
2. Bradesco: R$ 32.400,00
3. Unimed: R$ 18.500,00

**Alerta IA:** A taxa de glosa está acima da média do setor (18%). Recomendo revisar os processos de autorização prévia, especialmente com a Amil.`;
  }
  
  if (lower.includes('paciente') || lower.includes('maria') || lower.includes('conta')) {
    return `**Localização da Conta:**

Encontrei a conta **CT-2026-001** da paciente **Maria Aparecida Silva**:

- **Status atual:** Frente Administrativa
- **Procedimento:** Colecistectomia Videolaparoscópica
- **Operadora:** Unimed São Paulo
- **Valor:** R$ 18.500,00
- **Responsável:** Ana Paula Ferreira
- **Tempo na fase:** 32 horas

**Histórico do Workflow:**
1. ✅ Entrada da Guia (28/03)
2. ✅ Registro no Sistema (28/03)
3. 🔄 Frente Administrativa (em andamento)
4. ⏳ Frente Enfermagem
5. ⏳ Frente Médica
6. ⏳ Auditoria Final

**Pendência:** Documento de autorização prévia não anexado.`;
  }
  
  if (lower.includes('procedimento') || lower.includes('valor') || lower.includes('apendicectomia')) {
    return `**Consulta de Procedimento:**

**Apendicectomia Videolaparoscópica** (Código TUSS: 31003079)

| Operadora | Valor Contratual | Porte | Filme |
|-----------|-----------------|-------|-------|
| Unimed | R$ 1.800,00 | 10A | 3 |
| Bradesco | R$ 2.100,00 | 10A | 3 |
| SulAmérica | R$ 1.950,00 | 10A | 3 |
| Amil | R$ 1.750,00 | 10A | 3 |

**Recomendação IA:** Para este procedimento, a Bradesco oferece o melhor valor contratual (R$ 2.100,00). A diferença para a Amil é de R$ 350,00 por procedimento.`;
  }
  
  return `Entendi sua pergunta. Com base nos dados do Hospital Sagrada Família:

- **Total de contas ativas:** 10
- **Valor total em workflow:** R$ 248.000,00
- **Glosas pendentes:** 3 (R$ 8.350,00)
- **Taxa de aprovação:** 67%

Posso detalhar qualquer um desses indicadores. O que gostaria de saber mais?`;
};

const AIFloatingChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);
    
    // Simular delay de resposta
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1200));
    
    const response = generateMockResponse(input);
    const assistantMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: response,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, assistantMessage]);
    setIsTyping(false);
  };

  const handleQuickAction = (query: string) => {
    setInput(query);
    setTimeout(() => {
      const userMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'user',
        content: query,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, userMessage]);
      setIsTyping(true);
      
      setTimeout(() => {
        const response = generateMockResponse(query);
        const assistantMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: response,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, assistantMessage]);
        setIsTyping(false);
        setInput('');
      }, 800 + Math.random() * 1200);
    }, 100);
  };

  return (
    <>
      {/* Botão flutuante */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-lg hover:shadow-xl transition-all hover:scale-105 flex items-center justify-center group"
        >
          <Brain className="h-6 w-6 group-hover:scale-110 transition-transform" />
          <span className="absolute -top-1 -right-1 h-4 w-4 bg-green-500 rounded-full border-2 border-white animate-pulse" />
        </button>
      )}

      {/* Painel do chat */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[420px] h-[600px] bg-white rounded-2xl shadow-2xl border flex flex-col overflow-hidden">
          {/* Header do chat */}
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-600 to-pink-500 text-white">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-white/20 flex items-center justify-center">
                <Brain className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">Assistente Lazarus</h3>
                <p className="text-xs text-white/80">IA sempre disponível</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="h-8 w-8 rounded-full hover:bg-white/20 flex items-center justify-center transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Quick Actions */}
          {messages.length <= 1 && (
            <div className="flex gap-2 p-3 border-b overflow-x-auto">
              {QUICK_ACTIONS.map((action, i) => (
                <button
                  key={i}
                  onClick={() => handleQuickAction(action.query)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-50 text-purple-700 text-xs font-medium hover:bg-purple-100 transition-colors whitespace-nowrap flex-shrink-0"
                >
                  <action.icon className="h-3 w-3" />
                  {action.label}
                </button>
              ))}
            </div>
          )}

          {/* Mensagens */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map(msg => (
              <div
                key={msg.id}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${
                    msg.role === 'user'
                      ? 'bg-purple-600 text-white rounded-br-md'
                      : 'bg-gray-100 text-gray-800 rounded-bl-md'
                  }`}
                >
                  <div className="whitespace-pre-wrap leading-relaxed" style={{ fontSize: '13px' }}>
                    {msg.content.split('\n').map((line, i) => {
                      // Bold
                      const boldParsed = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
                      return (
                        <span key={i}>
                          <span dangerouslySetInnerHTML={{ __html: boldParsed }} />
                          {i < msg.content.split('\n').length - 1 && <br />}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-2xl rounded-bl-md px-4 py-3">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t bg-gray-50">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Pergunte qualquer coisa..."
                className="flex-1 px-4 py-2.5 rounded-full border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                disabled={isTyping}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                className="h-10 w-10 rounded-full bg-purple-600 text-white flex items-center justify-center hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
            <p className="text-xs text-center text-muted-foreground mt-2">
              <Sparkles className="h-3 w-3 inline mr-1" />
              Powered by Lazarus AI
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default AIFloatingChat;
