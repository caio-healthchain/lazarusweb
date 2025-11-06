import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { 
  Activity, 
  FileText, 
  Package, 
  DollarSign, 
  Copy,
  X,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { GuiaProcedure } from '@/services/api';
import { ProcedureCard } from './ProcedureCard';
import { generateMockValidations } from '@/services/mockValidationData';

type PendenciaType = 'PORTE' | 'DUT' | 'PACOTE' | 'VALOR' | 'DUPLICADO';

interface PendenciaDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tipo: PendenciaType | null;
  procedimentos: GuiaProcedure[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onReset: (id: string) => void;
  isUpdating: boolean;
}

const pendenciaConfig = {
  PORTE: {
    icon: Activity,
    label: 'Portes Divergentes',
    color: 'text-orange-600',
    bgColor: 'bg-orange-100',
    borderColor: 'border-orange-500',
    description: 'Procedimentos com porte cirúrgico diferente do sugerido ou não encontrado',
    validationType: 'PORTE_CIRURGICO'
  },
  DUT: {
    icon: FileText,
    label: 'DUT Não Conformes',
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    borderColor: 'border-blue-500',
    description: 'Procedimentos que não atendem aos critérios da Diretriz de Utilização',
    validationType: 'DUT'
  },
  PACOTE: {
    icon: Package,
    label: 'Fora do Pacote',
    color: 'text-red-600',
    bgColor: 'bg-red-100',
    borderColor: 'border-red-500',
    description: 'Procedimentos não incluídos no pacote contratual - Possível glosa',
    validationType: 'PACOTE_CONTRATUAL'
  },
  VALOR: {
    icon: DollarSign,
    label: 'Valores Divergentes',
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100',
    borderColor: 'border-yellow-500',
    description: 'Procedimentos com valor diferente do contratado',
    validationType: 'VALOR_CONTRATUAL'
  },
  DUPLICADO: {
    icon: Copy,
    label: 'Duplicados',
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
    borderColor: 'border-purple-500',
    description: 'Procedimentos que podem estar duplicados na guia',
    validationType: 'DUPLICIDADE'
  }
};

export function PendenciaDetailsModal({
  open,
  onOpenChange,
  tipo,
  procedimentos,
  onApprove,
  onReject,
  onReset,
  isUpdating
}: PendenciaDetailsModalProps) {
  if (!tipo) return null;

  const config = pendenciaConfig[tipo];
  const Icon = config.icon;

  // Filtrar procedimentos que têm a pendência específica
  const procedimentosFiltrados = procedimentos.filter(proc => {
    const validations = generateMockValidations(
      proc.codigoProcedimento || '',
      Number(proc.valorTotal || proc.valorUnitario || 0)
    );
    
    return validations.some(val => 
      val.tipo === config.validationType && 
      (val.status === 'NAO_CONFORME' || val.status === 'ALERTA')
    );
  });

  const pendingCount = procedimentosFiltrados.filter(p => (p.status || 'PENDING').toUpperCase() === 'PENDING').length;
  const approvedCount = procedimentosFiltrados.filter(p => (p.status || '').toUpperCase() === 'APPROVED').length;
  const rejectedCount = procedimentosFiltrados.filter(p => (p.status || '').toUpperCase() === 'REJECTED').length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] p-0">
        {/* Header */}
        <DialogHeader className={`p-6 pb-4 border-b-4 ${config.borderColor}`}>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-lg ${config.bgColor}`}>
                <Icon className={`h-8 w-8 ${config.color}`} />
              </div>
              <div>
                <DialogTitle className="text-2xl font-bold">{config.label}</DialogTitle>
                <DialogDescription className="text-base mt-1">
                  {config.description}
                </DialogDescription>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => onOpenChange(false)}
              className="h-8 w-8"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Estatísticas */}
          <div className="flex items-center gap-4 mt-4">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-base px-3 py-1">
                {procedimentosFiltrados.length} procedimento(s)
              </Badge>
            </div>
            {pendingCount > 0 && (
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
                <span className="text-sm text-muted-foreground">{pendingCount} pendente(s)</span>
              </div>
            )}
            {approvedCount > 0 && (
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm text-muted-foreground">{approvedCount} aprovado(s)</span>
              </div>
            )}
            {rejectedCount > 0 && (
              <div className="flex items-center gap-2">
                <XCircle className="h-4 w-4 text-red-600" />
                <span className="text-sm text-muted-foreground">{rejectedCount} rejeitado(s)</span>
              </div>
            )}
          </div>
        </DialogHeader>

        {/* Conteúdo */}
        <ScrollArea className="h-[calc(90vh-200px)] p-6">
          {procedimentosFiltrados.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Icon className={`h-16 w-16 mx-auto mb-4 ${config.color} opacity-50`} />
              <p className="text-lg font-medium">Nenhum procedimento encontrado</p>
              <p className="text-sm mt-2">Não há procedimentos com esta pendência.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {procedimentosFiltrados.map(proc => (
                <ProcedureCard
                  key={proc.id}
                  procedure={proc}
                  onApprove={onApprove}
                  onReject={onReject}
                  onReset={onReset}
                  isUpdating={isUpdating}
                  selectable={false}
                />
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
