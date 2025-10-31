import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Mapeia o tipo de guia para o nome da sessão de auditoria
// guiaSP-SADT => InLoco
// guiaResumoInternacao => Retrospectiva
export function getAuditSessionName(tipoGuia?: string): string {
  if (!tipoGuia) return 'Auditoria';
  const t = tipoGuia.toLowerCase();
  if (t === 'guiasp-sadt') return 'InLoco';
  if (t === 'guiaresumointernacao') return 'Retrospectiva';
  return 'Auditoria';
}
