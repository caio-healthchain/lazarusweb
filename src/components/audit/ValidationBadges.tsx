import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  FileText, 
  AlertTriangle, 
  DollarSign, 
  Package, 
  Activity,
  CheckCircle2,
  XCircle
} from 'lucide-react';

export interface ValidationResult {
  tipo: 'PORTE_CIRURGICO' | 'DUT' | 'PACOTE_CONTRATUAL' | 'VALOR_CONTRATUAL' | 'DUPLICIDADE';
  status: 'CONFORME' | 'NAO_CONFORME' | 'ALERTA' | 'PENDENTE';
  mensagem?: string;
  valorEsperado?: number;
  valorEncontrado?: number;
  diferenca?: number;
  porteEsperado?: string;
  porteEncontrado?: string;
}

interface ValidationBadgesProps {
  validations: ValidationResult[];
  onDUTClick?: () => void;
}

export function ValidationBadges({ validations, onDUTClick }: ValidationBadgesProps) {
  const getIcon = (tipo: ValidationResult['tipo']) => {
    switch (tipo) {
      case 'PORTE_CIRURGICO':
        return <Activity className="h-3 w-3" />;
      case 'DUT':
        return <FileText className="h-3 w-3" />;
      case 'PACOTE_CONTRATUAL':
        return <Package className="h-3 w-3" />;
      case 'VALOR_CONTRATUAL':
        return <DollarSign className="h-3 w-3" />;
      case 'DUPLICIDADE':
        return <AlertTriangle className="h-3 w-3" />;
      default:
        return null;
    }
  };

  const getLabel = (tipo: ValidationResult['tipo']) => {
    switch (tipo) {
      case 'PORTE_CIRURGICO':
        return 'Porte';
      case 'DUT':
        return 'DUT';
      case 'PACOTE_CONTRATUAL':
        return 'Pacote';
      case 'VALOR_CONTRATUAL':
        return 'Valor';
      case 'DUPLICIDADE':
        return 'Duplicado';
      default:
        return tipo;
    }
  };

  const getBadgeVariant = (status: ValidationResult['status']) => {
    switch (status) {
      case 'CONFORME':
        return 'default';
      case 'NAO_CONFORME':
        return 'destructive';
      case 'ALERTA':
        return 'secondary';
      case 'PENDENTE':
        return 'outline';
      default:
        return 'outline';
    }
  };

  const getBadgeColor = (status: ValidationResult['status']) => {
    switch (status) {
      case 'CONFORME':
        return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'NAO_CONFORME':
        return 'bg-red-100 text-red-800 hover:bg-red-200';
      case 'ALERTA':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
      case 'PENDENTE':
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
      default:
        return '';
    }
  };

  const getStatusIcon = (status: ValidationResult['status']) => {
    switch (status) {
      case 'CONFORME':
        return <CheckCircle2 className="h-3 w-3" />;
      case 'NAO_CONFORME':
      case 'ALERTA':
        return <AlertTriangle className="h-3 w-3" />;
      default:
        return null;
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: 'BRL' 
    }).format(value);
  };

  const getTooltipContent = (validation: ValidationResult) => {
    let content = validation.mensagem || '';
    
    if (validation.tipo === 'VALOR_CONTRATUAL' && validation.valorEsperado && validation.valorEncontrado) {
      content = `Valor Esperado (Contratado): ${formatCurrency(validation.valorEsperado)}
Valor Recebido (Cobrado): ${formatCurrency(validation.valorEncontrado)}
Diferença: ${formatCurrency(Math.abs(validation.diferenca || 0))}`;
    }
    
    if (validation.tipo === 'PORTE_CIRURGICO' && validation.porteEsperado) {
      if (validation.status === 'ALERTA' || validation.status === 'NAO_CONFORME') {
        content = `Porte Esperado: ${validation.porteEsperado}
Porte Encontrado: ${validation.porteEncontrado || 'Não encontrado'}`;
      }
    }
    
    if (validation.tipo === 'PACOTE_CONTRATUAL' && (validation.status === 'NAO_CONFORME' || validation.status === 'ALERTA')) {
      content = 'Procedimento NÃO incluído no pacote contratual\nPossível glosa - Requer atenção';
    }
    
    return content;
  };

  if (validations.length === 0) {
    return null;
  }

  return (
    <TooltipProvider>
      <div className="flex flex-wrap gap-2">
        {validations.map((validation, index) => {
          const isDUT = validation.tipo === 'DUT';
          const BadgeContent = (
            <Badge
              key={index}
              variant={getBadgeVariant(validation.status)}
              className={`${getBadgeColor(validation.status)} cursor-pointer transition-all hover:scale-105`}
              onClick={isDUT && onDUTClick ? onDUTClick : undefined}
            >
              <span className="flex items-center gap-1">
                {getIcon(validation.tipo)}
                {getLabel(validation.tipo)}
                {getStatusIcon(validation.status)}
              </span>
            </Badge>
          );

          if (validation.mensagem || 
              (validation.tipo === 'VALOR_CONTRATUAL' && validation.valorEsperado) ||
              (validation.tipo === 'PORTE_CIRURGICO' && validation.porteEsperado) ||
              (validation.tipo === 'PACOTE_CONTRATUAL' && (validation.status === 'NAO_CONFORME' || validation.status === 'ALERTA'))) {
            return (
              <Tooltip key={index}>
                <TooltipTrigger asChild>
                  {BadgeContent}
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p className="text-sm whitespace-pre-line">{getTooltipContent(validation)}</p>
                </TooltipContent>
              </Tooltip>
            );
          }

          return BadgeContent;
        })}
      </div>
    </TooltipProvider>
  );
}
