import React, { useState } from 'react';
import { contractsService, ValidationResult, contractsUtils } from '@/services/contractsService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CheckCircle, AlertTriangle, XCircle, RefreshCw } from 'lucide-react';

interface ContractValidationProps {
  procedimento: {
    id: string;
    codigoTUSS: string;
    descricao: string;
    valorTotal: number;
    quantidade?: number;
  };
  operadoraId: string;
}

export function ContractValidation({ procedimento, operadoraId }: ContractValidationProps) {
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleValidate() {
    setLoading(true);
    setError(null);
    
    try {
      const result = await contractsService.validateProcedimento({
        operadoraId,
        codigoTUSS: procedimento.codigoTUSS,
        valorCobrado: procedimento.valorTotal,
        quantidade: procedimento.quantidade || 1,
      });
      
      setValidationResult(result);
    } catch (err) {
      console.error('Erro ao validar procedimento:', err);
      setError('Erro ao validar procedimento. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      {/* Botão de Validação */}
      <Button
        onClick={handleValidate}
        disabled={loading}
        variant="outline"
        className="w-full"
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Validando...
          </>
        ) : (
          <>
            <RefreshCw className="mr-2 h-4 w-4" />
            Validar Contrato
          </>
        )}
      </Button>

      {/* Erro */}
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Resultado da Validação */}
      {validationResult && (
        <Card className={`border-2 ${validationResult.conforme ? 'border-green-500' : 'border-red-500'}`}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {validationResult.conforme ? (
                <>
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="text-green-600">Conforme ao Contrato</span>
                </>
              ) : (
                <>
                  <XCircle className="h-5 w-5 text-red-600" />
                  <span className="text-red-600">Divergências Encontradas</span>
                </>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Valores */}
            <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm text-gray-600 mb-1">Valor Cobrado</p>
                <p className="text-lg font-bold text-gray-900">
                  {contractsUtils.formatCurrency(validationResult.valorCobrado)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Valor Contrato</p>
                <p className="text-lg font-bold text-gray-900">
                  {validationResult.valorContrato
                    ? contractsUtils.formatCurrency(validationResult.valorContrato)
                    : 'Não contratado'}
                </p>
              </div>
              {validationResult.diferenca !== 0 && (
                <div className="col-span-2">
                  <p className="text-sm text-gray-600 mb-1">Diferença</p>
                  <p className={`text-lg font-bold ${validationResult.diferenca > 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {validationResult.diferenca > 0 ? '+' : ''}
                    {contractsUtils.formatCurrency(validationResult.diferenca)}
                  </p>
                </div>
              )}
            </div>

            {/* Divergências */}
            {validationResult.divergencias.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-semibold text-gray-900">Divergências:</h4>
                {validationResult.divergencias.map((div, idx) => (
                  <Alert
                    key={idx}
                    variant="destructive"
                    className={contractsUtils.getSeverityColor(div.severidade)}
                  >
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <p className="font-medium mb-1">
                            {contractsUtils.getDivergenciaIcon(div.tipo)} {div.tipo.replace(/_/g, ' ')}
                          </p>
                          <p className="text-sm">{div.mensagem}</p>
                        </div>
                        <Badge variant="outline" className="shrink-0">
                          {div.severidade}
                        </Badge>
                      </div>
                    </AlertDescription>
                  </Alert>
                ))}
              </div>
            )}

            {/* Mensagem Geral */}
            {validationResult.mensagem && (
              <Alert>
                <AlertDescription>{validationResult.mensagem}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
