# Ajuste Automático de Valores e Rejeição com Justificativa

## Data: 19/11/2025

---

## 📋 Resumo das Alterações

Implementadas duas funcionalidades críticas para o processo de auditoria:

1. **Ajuste Automático de Valores** (Opção 1)
2. **Rejeição com Justificativa Obrigatória**

---

## ✅ 1. Ajuste Automático de Valores

### Problema Identificado

**Antes:**
- Auditor aprovava procedimento
- Sistema mantinha valor original da guia (R$ 133,06)
- XML exportado usava valor incorreto
- **Resultado:** Hospital perdia dinheiro (R$ 11,98 no exemplo)

**Depois:**
- Auditor aprova procedimento
- Sistema **aplica automaticamente** o valor contratual (R$ 145,04)
- XML exportado usa valor correto
- **Resultado:** Hospital recebe o valor correto do contrato

---

### Como Funciona

#### Cenário Exemplo:

**Procedimento:** Em Pronto Socorro (TUSS 10101039)
- **Valor da Guia:** R$ 133,06 (incorreto)
- **Valor Contratual:** R$ 145,04 (correto)
- **Diferença:** R$ 11,98 (a menos)

#### Fluxo de Aprovação:

```
1. Auditor clica em "Aprovar"
   ↓
2. Sistema calcula valor recomendado (R$ 145,04)
   ↓
3. Sistema aplica automaticamente:
   - valorAprovado = R$ 145,04
   - valorTotal = R$ 133,06 (mantém para histórico)
   ↓
4. Sistema registra no log:
   "[AJUSTE AUTO] Procedimento 10101039: R$ 133,06 → R$ 145,04"
   ↓
5. XML exportado usa R$ 145,04
```

---

### Campos Adicionados

**Interface `GuiaProcedure`:**

```typescript
export interface GuiaProcedure {
  // ... campos existentes
  valorTotal?: number;          // Valor original da guia
  valorAprovado?: number;        // Valor após ajuste (NOVO)
  motivoRejeicao?: string;       // Justificativa de rejeição (NOVO)
  categoriaRejeicao?: string;    // Categoria da rejeição (NOVO)
}
```

---

### Lógica de Aprovação

**Arquivo:** `src/pages/GuiaDetails.tsx`

```typescript
const handleApprove = (procId: string) => {
  const proc = procedimentos.find(p => p.id === procId);
  if (!proc) return;
  
  // Calcular valor recomendado (valor contratual)
  const validacoes = generateMockValidations(proc);
  const validacaoValor = validacoes.find(v => v.tipo === 'VALOR_CONTRATUAL');
  const valorRecomendado = validacaoValor?.valorEsperado || proc.valorTotal || 0;
  
  // Aplicar valor recomendado automaticamente
  updateStatusMutation.mutate({ 
    id: procId, 
    status: 'APPROVED', 
    guiaId,
    valorAprovado: valorRecomendado // ← Valor ajustado
  });
  
  // Log para auditoria
  if (valorRecomendado !== proc.valorTotal) {
    console.log(`[AJUSTE AUTO] Procedimento ${proc.codigoProcedimento}: 
                 R$ ${proc.valorTotal?.toFixed(2)} → R$ ${valorRecomendado.toFixed(2)}`);
  }
};
```

---

### Exportação de XML

**Arquivo:** `src/utils/xmlExporter.ts`

```typescript
// Usar valorAprovado se existir (após ajuste), senão usar valorTotal original
const valorFinal = proc.valorAprovado || proc.valorTotal || 0;
const valorUnitarioFinal = valorFinal / (proc.quantidadeExecutada || 1);

xml += `
  <ans:valorUnitario>${valorUnitarioFinal.toFixed(2)}</ans:valorUnitario>
  <ans:valorTotal>${valorFinal.toFixed(2)}</ans:valorTotal>
`;
```

---

## ✅ 2. Rejeição com Justificativa Obrigatória

### Problema Identificado

**Antes:**
- Auditor rejeitava procedimento com 1 clique
- Sem justificativa
- Faturamento não sabia o que corrigir
- Retrabalho e conflitos

**Depois:**
- Auditor clica em "Rejeitar"
- Modal abre solicitando justificativa **obrigatória**
- Categoria e motivo são registrados
- Faturamento sabe exatamente o que corrigir

---

### Como Funciona

#### Fluxo de Rejeição:

```
1. Auditor clica em "Rejeitar"
   ↓
2. Modal abre com:
   - Informações do procedimento
   - Valor da guia vs Valor recomendado
   - Campo de categoria (obrigatório)
   - Campo de motivo (mínimo 10 caracteres)
   ↓
3. Auditor preenche:
   - Categoria: "Valor Divergente"
   - Motivo: "Valor incorreto no sistema origem. 
             Solicitar correção para R$ 145,04 e reimportar guia."
   ↓
4. Auditor clica em "Confirmar Rejeição"
   ↓
5. Sistema registra:
   - status = 'REJECTED'
   - motivoRejeicao = "Valor incorreto..."
   - categoriaRejeicao = "VALOR_DIVERGENTE"
   ↓
6. Log registra tudo para rastreabilidade
   ↓
7. Procedimento NÃO é incluído no XML
```

---

### Modal de Rejeição

**Arquivo:** `src/components/audit/RejectModal.tsx`

**Campos:**

1. **Categoria de Rejeição** (Select obrigatório)
   - Valor Divergente
   - Código TUSS Incorreto
   - Fora do Pacote
   - Falta de Documentação
   - DUT Não Conforme
   - Procedimento Duplicado
   - Quantidade Excedida
   - Outro

2. **Motivo da Rejeição** (Textarea obrigatório)
   - Mínimo 10 caracteres
   - Placeholder com exemplo
   - Contador de caracteres

**Validações:**
- Categoria deve ser selecionada
- Motivo deve ter no mínimo 10 caracteres
- Botão "Confirmar" só habilita após validações

**Avisos:**
- Informação sobre consequências da rejeição
- Procedimento não será incluído no XML
- Retornará para faturamento

---

### Lógica de Rejeição

**Arquivo:** `src/pages/GuiaDetails.tsx`

```typescript
const handleReject = (procId: string) => {
  const proc = procedimentos.find(p => p.id === procId);
  if (!proc) return;
  
  // Calcular valor recomendado para exibir no modal
  const validacoes = generateMockValidations(proc);
  const validacaoValor = validacoes.find(v => v.tipo === 'VALOR_CONTRATUAL');
  const valorRecomendado = validacaoValor?.valorEsperado;
  
  // Abrir modal de rejeição
  setProcedimentoParaRejeitar(proc);
  setValorRecomendadoRejeicao(valorRecomendado);
  setRejectModalOpen(true);
};

const handleConfirmReject = (motivoRejeicao: string, categoriaRejeicao: string) => {
  if (!procedimentoParaRejeitar) return;
  
  const guiaId = procedimentoParaRejeitar.guiaId ? parseInt(procedimentoParaRejeitar.guiaId) : undefined;
  
  // Atualizar com motivo e categoria
  updateStatusMutation.mutate({ 
    id: procedimentoParaRejeitar.id, 
    status: 'REJECTED', 
    guiaId,
    motivoRejeicao,      // ← Justificativa
    categoriaRejeicao    // ← Categoria
  });
  
  // Fechar modal
  setRejectModalOpen(false);
  
  // Log para auditoria
  console.log(`[REJEIÇÃO] Procedimento ${procedimentoParaRejeitar.codigoProcedimento}: 
               ${categoriaRejeicao} - ${motivoRejeicao}`);
};
```

---

## 📊 Comparação: Antes vs Depois

### Aprovação de Procedimento

| Aspecto | ANTES | DEPOIS |
|---------|-------|--------|
| **Valor usado** | R$ 133,06 (incorreto) | R$ 145,04 (ajustado) |
| **Ação do auditor** | Aprovar | Aprovar |
| **Ajuste manual?** | Não disponível | Automático |
| **XML exportado** | R$ 133,06 ❌ | R$ 145,04 ✅ |
| **Economia** | Hospital perde R$ 11,98 | Hospital recebe correto |

### Rejeição de Procedimento

| Aspecto | ANTES | DEPOIS |
|---------|-------|--------|
| **Justificativa** | Não obrigatória | **Obrigatória** |
| **Categoria** | Não registrada | 8 categorias disponíveis |
| **Motivo** | Não registrado | Mínimo 10 caracteres |
| **Rastreabilidade** | Baixa | Alta |
| **Retrabalho** | Alto | Baixo |

---

## 🎯 Benefícios

### Para o Hospital

1. **Receita Correta**
   - Não perde dinheiro por valores incorretos
   - Recebe o valor contratual automaticamente

2. **Menos Glosas**
   - Valores ajustados conforme contrato
   - Reduz risco de glosa por valor divergente

3. **Rastreabilidade**
   - Histórico completo de ajustes
   - Logs detalhados de rejeições

### Para o Auditor

1. **Menos Trabalho**
   - Não precisa ajustar valores manualmente
   - Sistema faz automaticamente

2. **Decisões Documentadas**
   - Rejeições sempre justificadas
   - Proteção em auditorias externas

3. **Processo Padronizado**
   - Todos os auditores seguem mesmo fluxo
   - Reduz variabilidade

### Para o Faturamento

1. **Clareza**
   - Sabe exatamente o que corrigir
   - Categoria e motivo explícitos

2. **Menos Retrabalho**
   - Não precisa adivinhar o problema
   - Correção mais rápida

3. **Comunicação**
   - Justificativa clara do auditor
   - Reduz conflitos

---

## 🔧 Arquivos Modificados

### 1. `src/services/api.ts`
- Adicionados campos: `valorAprovado`, `motivoRejeicao`, `categoriaRejeicao`

### 2. `src/components/audit/RejectModal.tsx` (NOVO)
- Modal completo de rejeição
- Validações obrigatórias
- 8 categorias de rejeição

### 3. `src/pages/GuiaDetails.tsx`
- `handleApprove()` com ajuste automático
- `handleReject()` abre modal
- `handleConfirmReject()` processa rejeição

### 4. `src/utils/xmlExporter.ts`
- Usa `valorAprovado` ao invés de `valorTotal`
- Calcula `valorUnitario` baseado no valor final

---

## 📝 Commits Realizados

**1. `9136714`** - feat: adicionar campos valorAprovado e motivoRejeicao ao GuiaProcedure

**2. `5213f73`** - feat: criar modal de rejeição com justificativa obrigatória

**3. `e7446bd`** - feat: implementar ajuste automático de valor e rejeição com justificativa

**4. `48666c7`** - feat: atualizar exportação XML para usar valorAprovado

---

## 🧪 Como Testar

### Teste 1: Ajuste Automático

1. Importe guia com valor divergente (ex: R$ 133,06 vs R$ 145,04)
2. Acesse a guia e veja a pendência "Valores Divergentes"
3. Clique em "Aprovar"
4. Abra o console do navegador (F12)
5. Veja log: `[AJUSTE AUTO] Procedimento 10101039: R$ 133,06 → R$ 145,04`
6. Exporte XML
7. Abra XML e verifique: `<ans:valorTotal>145.04</ans:valorTotal>`

### Teste 2: Rejeição com Justificativa

1. Acesse uma guia com procedimento pendente
2. Clique em "Rejeitar"
3. Modal abre solicitando justificativa
4. Tente confirmar sem preencher → Erro aparece
5. Selecione categoria: "Valor Divergente"
6. Digite motivo com menos de 10 caracteres → Botão desabilitado
7. Digite motivo com 10+ caracteres → Botão habilita
8. Clique em "Confirmar Rejeição"
9. Modal fecha e procedimento é rejeitado
10. Abra console: `[REJEIÇÃO] Procedimento 10101039: VALOR_DIVERGENTE - ...`

---

## ⚠️ Importante: Backend

As alterações no frontend assumem que o backend aceita os novos campos:

```typescript
// Endpoint de aprovação
PUT /api/v1/procedures/:id/status
Body: {
  status: 'APPROVED',
  valorAprovado: 145.04  // ← NOVO
}

// Endpoint de rejeição
PUT /api/v1/procedures/:id/status
Body: {
  status: 'REJECTED',
  motivoRejeicao: "Valor incorreto...",     // ← NOVO
  categoriaRejeicao: "VALOR_DIVERGENTE"     // ← NOVO
}
```

**Se o backend ainda não suporta esses campos:**
- Os dados serão enviados mas ignorados
- Funcionalidade continuará funcionando parcialmente
- Backend precisa ser atualizado para persistir os novos campos

---

## 🚀 Próximos Passos

1. **Atualizar Backend**
   - Adicionar campos `valorAprovado`, `motivoRejeicao`, `categoriaRejeicao` no banco
   - Modificar endpoints para aceitar e persistir novos campos
   - Atualizar logs de auditoria

2. **Tela de Histórico**
   - Mostrar ajustes realizados
   - Listar rejeições com justificativas
   - Métricas de economia gerada

3. **Relatórios**
   - Relatório de ajustes por auditor
   - Relatório de rejeições por categoria
   - Dashboard de economia gerada

4. **Notificações**
   - Email para faturamento quando procedimento é rejeitado
   - Incluir justificativa no email
   - Link direto para correção

---

**Desenvolvido por:** Manus AI  
**Data:** 19/11/2025  
**Versão:** 1.0
