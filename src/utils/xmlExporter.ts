import { GuiaProcedure } from '@/services/api';

export interface ExportXMLOptions {
  numeroGuiaPrestador: string;
  procedimentos: GuiaProcedure[];
  registroANS?: string;
  numeroLote?: string;
}

/**
 * Gera XML TISS com procedimentos aprovados e valores corrigidos
 */
export function generateTISSXML(options: ExportXMLOptions): string {
  const { numeroGuiaPrestador, procedimentos, registroANS = '309222', numeroLote = '999999' } = options;
  
  // Filtrar apenas procedimentos aprovados
  const aprovados = procedimentos.filter(p => (p.status || '').toUpperCase() === 'APPROVED');
  
  if (aprovados.length === 0) {
    throw new Error('Nenhum procedimento aprovado para exportar');
  }
  
  // Calcular valor total
  const valorTotal = aprovados.reduce((acc, p) => acc + (Number(p.valorTotal) || 0), 0);
  
  // Data e hora atual
  const now = new Date();
  const dataAtual = now.toISOString().split('T')[0]; // YYYY-MM-DD
  const horaAtual = now.toTimeString().split(' ')[0]; // HH:MM:SS
  
  // Gerar XML
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<ans:mensagemTISS xmlns:ans="http://www.ans.gov.br/padroes/tiss/schemas" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.ans.gov.br/padroes/tiss/schemas http://www.ans.gov.br/padroes/tiss/schemas/tissV4_01_00.xsd">
  <ans:cabecalho>
    <ans:identificacaoTransacao>
      <ans:tipoTransacao>ENVIO_LOTE_GUIAS</ans:tipoTransacao>
      <ans:sequencialTransacao>${numeroLote}</ans:sequencialTransacao>
      <ans:dataRegistroTransacao>${dataAtual}</ans:dataRegistroTransacao>
      <ans:horaRegistroTransacao>${horaAtual}</ans:horaRegistroTransacao>
    </ans:identificacaoTransacao>
    <ans:Padrao>4.01.00</ans:Padrao>
  </ans:cabecalho>
  <ans:prestadorParaOperadora>
    <ans:loteGuias>
      <ans:numeroLote>${numeroLote}</ans:numeroLote>
      <ans:guiasTISS>
        <ans:guiaSP-SADT>
          <ans:cabecalhoGuia>
            <ans:registroANS>${registroANS}</ans:registroANS>
            <ans:numeroGuiaPrestador>${numeroGuiaPrestador}</ans:numeroGuiaPrestador>
          </ans:cabecalhoGuia>
          <ans:procedimentosExecutados>
`;

  // Adicionar procedimentos aprovados
  aprovados.forEach((proc, index) => {
    xml += `            <ans:procedimentoExecutado>
              <ans:sequencialItem>${proc.sequencialItem || (index + 1)}</ans:sequencialItem>
              <ans:procedimento>
                <ans:codigoTabela>22</ans:codigoTabela>
                <ans:codigoProcedimento>${proc.codigoProcedimento}</ans:codigoProcedimento>
                <ans:descricaoProcedimento>${escapeXML(proc.descricaoProcedimento || '')}</ans:descricaoProcedimento>
              </ans:procedimento>
              <ans:quantidadeExecutada>${proc.quantidadeExecutada || 1}</ans:quantidadeExecutada>
              <ans:valorUnitario>${(proc.valorUnitario || 0).toFixed(2)}</ans:valorUnitario>
              <ans:valorTotal>${(proc.valorTotal || 0).toFixed(2)}</ans:valorTotal>
            </ans:procedimentoExecutado>
`;
  });

  xml += `          </ans:procedimentosExecutados>
          <ans:valorTotal>
            <ans:valorProcedimentos>${valorTotal.toFixed(2)}</ans:valorProcedimentos>
            <ans:valorTotalGeral>${valorTotal.toFixed(2)}</ans:valorTotalGeral>
          </ans:valorTotal>
        </ans:guiaSP-SADT>
      </ans:guiasTISS>
    </ans:loteGuias>
  </ans:prestadorParaOperadora>
</ans:mensagemTISS>`;

  return xml;
}

/**
 * Escapa caracteres especiais para XML
 */
function escapeXML(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Faz download do XML gerado
 */
export function downloadXML(xml: string, filename: string): void {
  // Criar blob com encoding ISO-8859-1 (padrão TISS)
  const blob = new Blob([xml], { type: 'application/xml;charset=ISO-8859-1' });
  const url = URL.createObjectURL(blob);
  
  // Criar link temporário e fazer download
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  
  // Limpar
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Função principal para exportar XML da guia
 */
export function exportGuiaXML(options: ExportXMLOptions): void {
  try {
    const xml = generateTISSXML(options);
    const filename = `guia_${options.numeroGuiaPrestador}_${new Date().getTime()}.xml`;
    downloadXML(xml, filename);
  } catch (error) {
    throw error;
  }
}
