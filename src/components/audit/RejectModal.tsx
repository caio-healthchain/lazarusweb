import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { GuiaProcedure } from '@/services/api';

interface RejectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  procedimento: GuiaProcedure | null;
  valorRecomendado?: number;
  onConfirm: (motivoRejeicao: string, categoriaRejeicao: string) => void;
}

const CATEGORIAS_REJEICAO = [
  { value: 'VALOR_DIVERGENTE', label: 'Valor Divergente' },
  { value: 'CODIGO_INCORRETO', label: 'Código TUSS Incorreto' },
  { value: 'FORA_PACOTE', label: 'Fora do Pacote' },
  { value: 'FALTA_DOCUMENTACAO', label: 'Falta de Documentação' },
  { value: 'DUT_NAO_CONFORME', label: 'DUT Não Conforme' },
  { value: 'DUPLICADO', label: 'Procedimento Duplicado' },
  { value: 'QUANTIDADE_EXCEDIDA', label: 'Quantidade Excedida' },
  { value: 'OUTRO', label: 'Outro' },
];

export const RejectModal = ({ open, onOpenChange, procedimento, valorRecomendado, onConfirm }: RejectModalProps) => {
  const [motivoRejeicao, setMotivoRejeicao] = useState('');
  const [categoriaRejeicao, setCategoriaRejeicao] = useState('');
  const [erro, setErro] = useState('');

  const handleConfirm = () => {
    // Validações
    if (!categoriaRejeicao) {
      setErro('Por favor, selecione uma categoria de rejeição.');
      return;
    }

    if (!motivoRejeicao || motivoRejeicao.trim().length < 10) {
      setErro('O motivo da rejeição deve ter no mínimo 10 caracteres.');
      return;
    }

    // Limpar e confirmar
    setErro('');
    onConfirm(motivoRejeicao.trim(), categoriaRejeicao);
    
    // Resetar campos
    setMotivoRejeicao('');
    setCategoriaRejeicao('');
  };

  const handleCancel = () => {
    setMotivoRejeicao('');
    setCategoriaRejeicao('');
    setErro('');
    onOpenChange(false);
  };

  if (!procedimento) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertCircle className="h-5 w-5" />
            Rejeitar Procedimento
          </DialogTitle>
          <DialogDescription>
            Informe o motivo da rejeição. Esta informação será registrada no log de auditoria e enviada para a equipe de faturamento.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Informações do Procedimento */}
          <div className="p-4 bg-muted rounded-lg space-y-2">
            <div>
              <span className="text-sm font-medium">Procedimento:</span>
              <p className="text-sm">{procedimento.codigoProcedimento} - {procedimento.descricaoProcedimento}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-sm font-medium">Valor da Guia:</span>
                <p className="text-sm text-blue-600 font-semibold">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(procedimento.valorTotal || 0)}
                </p>
              </div>
              {valorRecomendado && (
                <div>
                  <span className="text-sm font-medium">Valor Recomendado:</span>
                  <p className="text-sm text-green-600 font-semibold">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valorRecomendado)}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Categoria de Rejeição */}
          <div className="space-y-2">
            <Label htmlFor="categoria">
              Categoria de Rejeição <span className="text-red-500">*</span>
            </Label>
            <Select value={categoriaRejeicao || undefined} onValueChange={setCategoriaRejeicao}>
              <SelectTrigger id="categoria">
                <SelectValue placeholder="Selecione a categoria" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIAS_REJEICAO.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Motivo da Rejeição */}
          <div className="space-y-2">
            <Label htmlFor="motivo">
              Motivo da Rejeição <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="motivo"
              placeholder="Ex: Valor incorreto no sistema origem. Solicitar correção para o valor contratual e reimportar guia."
              value={motivoRejeicao}
              onChange={(e) => setMotivoRejeicao(e.target.value)}
              rows={4}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground">
              Mínimo de 10 caracteres. {motivoRejeicao.length}/10
            </p>
          </div>

          {/* Mensagem de Erro */}
          {erro && (
            <div className="p-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-md">
              <p className="text-sm text-red-600 dark:text-red-400">{erro}</p>
            </div>
          )}

          {/* Aviso */}
          <div className="p-3 bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-md">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              <strong>Atenção:</strong> Ao rejeitar, o procedimento não será incluído no XML de exportação e retornará para o faturamento para correção.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancelar
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleConfirm}
            disabled={!categoriaRejeicao || motivoRejeicao.trim().length < 10}
          >
            Confirmar Rejeição
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
