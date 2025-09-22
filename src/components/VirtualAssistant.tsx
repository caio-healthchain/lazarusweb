import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Bot, Send, X, MessageCircle, FileText, Shield, AlertTriangle } from "lucide-react";

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  type?: 'info' | 'warning' | 'success';
}

interface VirtualAssistantProps {
  className?: string;
}

export function VirtualAssistant({ className }: VirtualAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Olá! Sou o assistente virtual do sistema. Posso ajudar com informações sobre controle de materiais, validação de pacotes e processos de faturamento. Como posso ajudar?",
      isUser: false,
      timestamp: new Date(),
      type: 'info'
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);

    // Simular resposta do assistente baseada em palavras-chave
    setTimeout(() => {
      const response = generateAssistantResponse(inputMessage);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response.content,
        isUser: false,
        timestamp: new Date(),
        type: response.type
      };
      setMessages(prev => [...prev, assistantMessage]);
    }, 1000);

    setInputMessage("");
  };

  const generateAssistantResponse = (input: string): { content: string; type?: 'info' | 'warning' | 'success' } => {
    const lowerInput = input.toLowerCase();

    if (lowerInput.includes('material') || lowerInput.includes('validador')) {
      return {
        content: "O Validador de Materiais (Lazarus) confere automaticamente a compatibilidade dos itens solicitados com a base de cobertura da operadora. Ele atua de forma proativa, impedindo ou alertando sobre materiais sem cobertura, e é totalmente integrado ao ERP, farmácia e módulo de faturamento.",
        type: 'info'
      };
    }

    if (lowerInput.includes('pacote') || lowerInput.includes('extra-pacote')) {
      return {
        content: "O sistema de controle de solicitações extra-pacote valida em tempo real se as requisições médicas estão dentro do escopo do pacote hospitalar. Toda solicitação fora do pacote é sinalizada e requer justificativa clínica antes da liberação.",
        type: 'warning'
      };
    }

    if (lowerInput.includes('justificativa') || lowerInput.includes('clínica')) {
      return {
        content: "As justificativas clínicas são obrigatórias para materiais sem cobertura ou itens extra-pacote. Elas são registradas no prontuário, anexadas à fatura e enviadas junto à cobrança para aumentar as chances de aceitação pela operadora.",
        type: 'success'
      };
    }

    if (lowerInput.includes('faturamento') || lowerInput.includes('fatura')) {
      return {
        content: "O sistema identifica automaticamente materiais cobertos vs não cobertos na fatura, sinalizando itens que requerem justificativa. As faturas são enviadas via TISS com toda documentação clínica anexada.",
        type: 'info'
      };
    }

    if (lowerInput.includes('integração') || lowerInput.includes('erp')) {
      return {
        content: "A solução está totalmente integrada ao ERP hospitalar, conectando prescrição, farmácia, faturamento e base contratual. Isso garante controle em tempo real desde a solicitação até o envio da fatura.",
        type: 'success'
      };
    }

    if (lowerInput.includes('risco') || lowerInput.includes('glosa')) {
      return {
        content: "O Classificador de Risco Financeiro aponta o risco potencial de glosa ao usar materiais não autorizados. Isso permite ação preventiva e reduz perdas financeiras por negativas de pagamento.",
        type: 'warning'
      };
    }

    return {
      content: "Posso ajudar com informações sobre: Validador de Materiais (Lazarus), Controle de Pacotes, Justificativas Clínicas, Faturamento Integrado, Classificação de Risco e Integrações com ERP. Sobre qual tópico gostaria de saber mais?",
      type: 'info'
    };
  };

  const quickActions = [
    { label: "Validador de Materiais", icon: Shield, message: "Como funciona o validador de materiais?" },
    { label: "Controle de Pacotes", icon: FileText, message: "Explique o controle de solicitações extra-pacote" },
    { label: "Risco de Glosa", icon: AlertTriangle, message: "Como o sistema identifica risco de glosa?" }
  ];

  if (!isOpen) {
    return (
      <div className={`fixed bottom-6 right-6 z-50 ${className}`}>
        <Button
          onClick={() => setIsOpen(true)}
          size="lg"
          className="rounded-full w-16 h-16 shadow-lg hover:shadow-xl transition-shadow bg-primary hover:bg-primary/90"
        >
          <Bot className="h-8 w-8" />
        </Button>
      </div>
    );
  }

  return (
    <div className={`fixed bottom-6 right-6 z-50 ${className}`}>
      <Card className="w-96 h-[600px] shadow-xl">
        <CardHeader className="bg-primary text-primary-foreground rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback>
                  <Bot className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-lg">Assistente Virtual</CardTitle>
                <p className="text-sm text-primary-foreground/80">Sistema de Controle Hospitalar</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="text-primary-foreground hover:bg-primary-foreground/20"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-0 flex flex-col h-[calc(600px-80px)]">
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.isUser
                        ? 'bg-primary text-primary-foreground'
                        : message.type === 'warning'
                        ? 'bg-yellow-50 text-yellow-800 border border-yellow-200'
                        : message.type === 'success'
                        ? 'bg-green-50 text-green-800 border border-green-200'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString('pt-BR', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          <div className="p-4 border-t bg-muted/30">
            <div className="flex flex-wrap gap-2 mb-3">
              {quickActions.map((action) => (
                <Button
                  key={action.label}
                  variant="outline"
                  size="sm"
                  onClick={() => setInputMessage(action.message)}
                  className="text-xs"
                >
                  <action.icon className="h-3 w-3 mr-1" />
                  {action.label}
                </Button>
              ))}
            </div>
            
            <div className="flex space-x-2">
              <Input
                placeholder="Digite sua pergunta..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1"
              />
              <Button onClick={handleSendMessage} size="sm">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}