import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { CheckCircle, XCircle, Loader2, AlertCircle } from 'lucide-react';
import { ValidationBadges } from './ValidationBadges';
import { DUTModal, DUTData } from './DUTModal';
import { generateMockValidations, getMockDUT, getPorteCirurgico, isProcedimentoCirurgico } from '@/services/mockValidationData';
import { GuiaProcedure } from '@/services/api';

interface ProcedureCardProps {
  procedure: GuiaProcedure;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onReset: (id: string) => void;
  isUpdating: boolean;
  selectable?: boolean;
  selected?: boolean;
  onSelectChange?: (id: string, selected: boolean) => void;
}

export function ProcedureCard({
  procedure,
  onApprove,
  onReject,
  onReset,
  isUpdating,
  selectable = false,
  selected = false,
  onSelectChange
}: ProcedureCardProps) {
  const [dutModalOpen, setDutModalOpen] = useState(false);
  const [dutData, setDutData] = useState<DUTData | null>(null);

  const st = (procedure.status || 'PENDING').toUpperCase();
  const statusBadge = st === 'APPROVED' ? 'bg-green-100 text-green-800' : 
                      st === 'REJECTED' ? 'bg-red-100 text-red-800' : 
                      'bg-yellow-100 text-yellow-800';

  // Gerar validações mockadas
  const validations = generateMockValidations(
    procedure.codigoProcedimento || '',
    Number(procedure.valorTotal || procedure.valorUnitario || 0)
  );

  // Verificar se é cirúrgico e obter porte
  const isCirurgico = isProcedimentoCirurgico(procedure.codigoProcedimento || '');
  const porte = isCirurgico ? getPorteCirurgico(procedure.codigoProcedimento || '') : null;

  // Verificar se tem alguma não conformidade
  const hasIssues = validations.some(v => v.status === 'NAO_CONFORME' || v.status === 'ALERTA');

  const handleDUTClick = () => {
    const dut = getMockDUT(procedure.codigoProcedimento || '');
    setDutData(dut);
    setDutModalOpen(true);
  };

  const formatCurrency = (value: number | string | undefined) => {
    if (!value) return 'R$ 0,00';
    const num = typeof value === 'string' ? parseFloat(value) : value;
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(num);
  };

  return (
    <>
      <Card className={`border-l-4 ${hasIssues ? 'border-l-yellow-500' : 'border-l-gray-300'} transition-all hover:shadow-md`}>
        <CardContent className="p-6 space-y-4">
          {/* Header do Card */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3 flex-1 min-w-0">
              {selectable && (
                <Checkbox
                  checked={selected}
                  onCheckedChange={(checked) => onSelectChange?.(procedure.id, checked as boolean)}
                  className="mt-1"
                />
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  {hasIssues && <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0" />}
                  <h3 className="font-semibold text-lg truncate">
                    {procedure.descricaoProcedimento || procedure.codigoProcedimento}
                  </h3>
                </div>
                <div className="flex items-center gap-2 flex-wrap mb-3">
                  <Badge className={statusBadge}>
                    {st === 'PENDING' ? 'Pendente' : st === 'APPROVED' ? 'Aprovado' : 'Rejeitado'}
                  </Badge>
                  {isCirurgico && porte && (
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300">
                      Porte {porte}
                    </Badge>
                  )}
                  <ValidationBadges validations={validations} onDUTClick={handleDUTClick} />
                </div>
              </div>
            </div>
            
            {/* Botões de Ação */}
            {st === 'PENDING' && (
              <div className="flex items-center gap-2 flex-shrink-0">
                <Button 
                  size="sm" 
                  className="bg-green-600 hover:bg-green-700" 
                  onClick={() => onApprove(procedure.id)} 
                  disabled={isUpdating}
                >
                  {isUpdating ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 mr-1" /> Aprovar
                    </>
                  )}
                </Button>
                <Button 
                  size="sm" 
                  variant="destructive" 
                  onClick={() => onReject(procedure.id)} 
                  disabled={isUpdating}
                >
                  {isUpdating ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <XCircle className="h-4 w-4 mr-1" /> Rejeitar
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>

          {/* Informações do Procedimento */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground mb-1">Código TUSS</p>
              <p className="font-medium font-mono">{procedure.codigoProcedimento}</p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">Quantidade</p>
              <p className="font-medium">{procedure.quantidadeExecutada ?? '-'}</p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">Valor Total</p>
              <p className="font-medium text-emerald-700">
                {formatCurrency(procedure.valorTotal)}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">Sequencial</p>
              <p className="font-medium">{procedure.sequencialItem ?? '-'}</p>
            </div>
          </div>

          {/* Detalhes de Validações com Valores */}
          {validations.some(v => v.valorEsperado !== undefined) && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Comparação de Valores</h4>
              {validations.filter(v => v.valorEsperado !== undefined).map((val, idx) => (
                <div key={idx} className="grid grid-cols-3 gap-4 text-sm mb-2">
                  <div>
                    <p className="text-muted-foreground mb-1">Valor da Guia</p>
                    <p className="font-medium text-blue-700">
                      {formatCurrency(val.valorEncontrado)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-1">Valor Contratual</p>
                    <p className="font-medium text-green-700">
                      {formatCurrency(val.valorEsperado)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-1">Diferença</p>
                    <p className={`font-medium ${val.diferenca && val.diferenca > 0 ? 'text-red-600' : 'text-green-600'}`}>
                      {val.diferenca ? formatCurrency(Math.abs(val.diferenca)) : '-'}
                      {val.diferenca && val.diferenca > 0 ? ' (a mais)' : val.diferenca && val.diferenca < 0 ? ' (a menos)' : ''}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Botão de Reset (se não estiver pendente) */}
          {st !== 'PENDING' && (
            <div className="flex justify-end pt-2 border-t">
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => onReset(procedure.id)} 
                disabled={isUpdating}
              >
                Resetar Status
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal de DUT */}
      <DUTModal 
        open={dutModalOpen} 
        onOpenChange={setDutModalOpen} 
        dutData={dutData} 
      />
    </>
  );
}
