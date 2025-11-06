import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FileText, AlertCircle, CheckCircle2, XCircle } from 'lucide-react';

export interface DUTData {
  codigoTUSS: string;
  descricaoProcedimento: string;
  temDUT: boolean;
  descricaoDUT?: string;
  criteriosUtilizacao?: string;
  indicacoes?: string;
  contraindicacoes?: string;
  observacoes?: string;
}

interface DUTModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dutData: DUTData | null;
}

export function DUTModal({ open, onOpenChange, dutData }: DUTModalProps) {
  if (!dutData) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[85vh]">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <DialogTitle className="text-xl">Diretriz de Utilização (DUT)</DialogTitle>
              <DialogDescription className="mt-1">
                {dutData.descricaoProcedimento}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Separator />

        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-6">
            {/* Código TUSS */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-600">Código TUSS:</span>
              <Badge variant="outline" className="font-mono">{dutData.codigoTUSS}</Badge>
            </div>

            {/* Status DUT */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-600">Status:</span>
              {dutData.temDUT ? (
                <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  Possui DUT
                </Badge>
              ) : (
                <Badge variant="secondary">
                  <XCircle className="h-3 w-3 mr-1" />
                  Sem DUT Específica
                </Badge>
              )}
            </div>

            {dutData.temDUT && (
              <>
                {/* Descrição da DUT */}
                {dutData.descricaoDUT && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                      <AlertCircle className="h-4 w-4" />
                      Descrição
                    </h3>
                    <p className="text-sm text-blue-800 leading-relaxed whitespace-pre-wrap">
                      {dutData.descricaoDUT}
                    </p>
                  </div>
                )}

                {/* Critérios de Utilização */}
                {dutData.criteriosUtilizacao && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      Critérios de Utilização
                    </h3>
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                        {dutData.criteriosUtilizacao}
                      </p>
                    </div>
                  </div>
                )}

                {/* Indicações */}
                {dutData.indicacoes && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      Indicações
                    </h3>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                        {dutData.indicacoes}
                      </p>
                    </div>
                  </div>
                )}

                {/* Contraindicações */}
                {dutData.contraindicacoes && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <XCircle className="h-4 w-4 text-red-600" />
                      Contraindicações
                    </h3>
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                        {dutData.contraindicacoes}
                      </p>
                    </div>
                  </div>
                )}

                {/* Observações */}
                {dutData.observacoes && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Observações</h3>
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                        {dutData.observacoes}
                      </p>
                    </div>
                  </div>
                )}
              </>
            )}

            {!dutData.temDUT && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
                <p className="text-sm text-gray-600">
                  Este procedimento não possui Diretriz de Utilização (DUT) específica cadastrada.
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  A cobertura segue as regras gerais do contrato e regulamentação da ANS.
                </p>
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
