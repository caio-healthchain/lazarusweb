import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Mapeia o tipo de guia para o nome da sessão de auditoria
// guiaSP-SADT => Conta Parcial (guias em aberto/atendimento)
// guiaResumoInternacao => Conta Fechada (guias finalizadas)
export function getAuditSessionName(tipoGuia?: string): string {
  if (!tipoGuia) return 'Auditoria';
  const t = tipoGuia.toLowerCase();
  if (t === 'guiasp-sadt') return 'ContaParcial';
  if (t === 'guiaresumointernacao') return 'ContaFechada';
  return 'Auditoria';
}
