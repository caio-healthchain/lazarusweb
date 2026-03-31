import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, CheckCircle2, AlertTriangle, ArrowRight, ArrowLeft, FileText, Brain } from 'lucide-react';

export type WizardAction = 'avancar' | 'devolver' | 'contestar' | 'aceitar' | 'gerar-laudo' | 'aprovar' | 'rejeitar';

interface ActionWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: WizardResult) => void;
  action: WizardAction;
  accountId?: string;
  accountName?: string;
}

export interface WizardResult {
  action: WizardAction;
  reason: string;
  comment: string;
  confirmed: boolean;
}

const ACTION_CONFIG: Record<WizardAction, {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  reasons: string[];
  aiSuggestion: string;
}> = {
  avancar: {
    title: 'Avançar Conta',
    description: 'Enviar esta conta para a próxima etapa do workflow',
    icon: ArrowRight,
    color: 'text-emerald-600',
    reasons: [
      'Documentação completa e validada',
      'Todos os procedimentos conferidos',
      'Autorização prévia confirmada',
      'Valores conferidos com contrato',
    ],
    aiSuggestion: 'Todos os documentos obrigatórios estão presentes. A conta está pronta para avançar.',
  },
  devolver: {
    title: 'Devolver Conta',
    description: 'Retornar esta conta para a etapa anterior com justificativa',
    icon: ArrowLeft,
    color: 'text-amber-600',
    reasons: [
      'Documentação incompleta',
      'Divergência de valores',
      'Falta autorização prévia',
      'Procedimento não coberto pelo contrato',
      'Erro no preenchimento da guia',
      'Falta evolução clínica',
    ],
    aiSuggestion: 'Verifique se a justificativa está clara para que a equipe anterior saiba exatamente o que corrigir.',
  },
  contestar: {
    title: 'Contestar Glosa',
    description: 'Gerar recurso formal contra a glosa da operadora',
    icon: FileText,
    color: 'text-red-600',
    reasons: [
      'Procedimento coberto pelo contrato',
      'Autorização prévia existente',
      'Divergência de interpretação contratual',
      'Erro da operadora na análise',
      'Documentação comprobatória disponível',
    ],
    aiSuggestion: 'Com base no histórico, glosas deste tipo têm 72% de chance de reversão quando contestadas com documentação completa.',
  },
  aceitar: {
    title: 'Aceitar Glosa',
    description: 'Aceitar a glosa da operadora (total ou parcialmente)',
    icon: CheckCircle2,
    color: 'text-gray-600',
    reasons: [
      'Glosa procedente - erro do hospital',
      'Custo do recurso não compensa',
      'Acordo comercial com operadora',
      'Documentação insuficiente para recurso',
    ],
    aiSuggestion: 'Antes de aceitar, considere que o valor acumulado de glosas aceitas neste mês já soma R$ 12.400,00.',
  },
  'gerar-laudo': {
    title: 'Gerar Laudo',
    description: 'Gerar laudo técnico para fundamentar o recurso',
    icon: FileText,
    color: 'text-purple-600',
    reasons: [
      'Laudo médico para justificativa clínica',
      'Laudo comparativo de valores',
      'Laudo de necessidade do procedimento',
      'Laudo de conformidade contratual',
    ],
    aiSuggestion: 'A IA pode gerar um rascunho do laudo com base nos dados da conta. Deseja que eu prepare?',
  },
  aprovar: {
    title: 'Aprovar Procedimento',
    description: 'Aprovar o procedimento após auditoria',
    icon: CheckCircle2,
    color: 'text-emerald-600',
    reasons: [
      'Procedimento conforme contrato',
      'Valores dentro da tabela',
      'Documentação completa',
    ],
    aiSuggestion: 'Os valores estão de acordo com a tabela contratual vigente.',
  },
  rejeitar: {
    title: 'Rejeitar Procedimento',
    description: 'Rejeitar o procedimento com justificativa',
    icon: AlertTriangle,
    color: 'text-red-600',
    reasons: [
      'Valor acima do contratual',
      'Procedimento não autorizado',
      'Documentação insuficiente',
      'Duplicidade de cobrança',
    ],
    aiSuggestion: 'Certifique-se de que a justificativa está documentada para evitar problemas em auditorias futuras.',
  },
};

const ActionWizard = ({ isOpen, onClose, onConfirm, action, accountId, accountName }: ActionWizardProps) => {
  const [step, setStep] = useState(1);
  const [selectedReason, setSelectedReason] = useState('');
  const [comment, setComment] = useState('');
  
  const config = ACTION_CONFIG[action];
  const Icon = config.icon;
  const totalSteps = 3;

  const handleConfirm = () => {
    onConfirm({
      action,
      reason: selectedReason,
      comment,
      confirmed: true,
    });
    handleClose();
  };

  const handleClose = () => {
    setStep(1);
    setSelectedReason('');
    setComment('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className={`h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center ${config.color}`}>
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle>{config.title}</DialogTitle>
              <DialogDescription>{config.description}</DialogDescription>
            </div>
          </div>
          {accountId && (
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="outline">{accountId}</Badge>
              {accountName && <span className="text-sm text-muted-foreground">{accountName}</span>}
            </div>
          )}
        </DialogHeader>

        {/* Progress */}
        <div className="flex items-center gap-2 my-2">
          {[1, 2, 3].map(s => (
            <div key={s} className="flex items-center gap-2 flex-1">
              <div className={`h-2 flex-1 rounded-full ${s <= step ? 'bg-purple-600' : 'bg-gray-200'}`} />
            </div>
          ))}
        </div>

        {/* Step 1: Motivo */}
        {step === 1 && (
          <div className="space-y-3">
            <p className="text-sm font-medium">Selecione o motivo:</p>
            <div className="space-y-2 max-h-[200px] overflow-y-auto">
              {config.reasons.map((reason, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedReason(reason)}
                  className={`w-full text-left px-3 py-2.5 rounded-lg border text-sm transition-colors ${
                    selectedReason === reason
                      ? 'border-purple-500 bg-purple-50 text-purple-800'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {reason}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Comentário */}
        {step === 2 && (
          <div className="space-y-3">
            <p className="text-sm font-medium">Adicione um comentário (opcional):</p>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Descreva detalhes adicionais..."
              className="w-full h-24 px-3 py-2 rounded-lg border text-sm resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            {/* IA Suggestion */}
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <Brain className="h-3.5 w-3.5 text-purple-600" />
                <span className="text-xs font-semibold text-purple-800">Sugestão da IA</span>
                <Sparkles className="h-3 w-3 text-purple-400" />
              </div>
              <p className="text-xs text-purple-700">{config.aiSuggestion}</p>
            </div>
          </div>
        )}

        {/* Step 3: Confirmação */}
        {step === 3 && (
          <div className="space-y-3">
            <p className="text-sm font-medium">Confirme a ação:</p>
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Ação:</span>
                <span className="font-medium">{config.title}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Motivo:</span>
                <span className="font-medium text-right max-w-[250px]">{selectedReason}</span>
              </div>
              {comment && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Comentário:</span>
                  <span className="font-medium text-right max-w-[250px]">{comment}</span>
                </div>
              )}
              {accountId && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Conta:</span>
                  <span className="font-medium">{accountId}</span>
                </div>
              )}
            </div>
            <p className="text-xs text-muted-foreground text-center">
              Esta ação será registrada no histórico da conta com seu nome e data/hora.
            </p>
          </div>
        )}

        <DialogFooter className="flex justify-between">
          <div className="flex gap-2">
            {step > 1 && (
              <Button variant="outline" size="sm" onClick={() => setStep(step - 1)}>
                Voltar
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleClose}>
              Cancelar
            </Button>
            {step < totalSteps ? (
              <Button
                size="sm"
                onClick={() => setStep(step + 1)}
                disabled={step === 1 && !selectedReason}
                className="bg-purple-600 hover:bg-purple-700"
              >
                Próximo
              </Button>
            ) : (
              <Button
                size="sm"
                onClick={handleConfirm}
                className="bg-purple-600 hover:bg-purple-700"
              >
                <CheckCircle2 className="h-4 w-4 mr-1" />
                Confirmar
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ActionWizard;
