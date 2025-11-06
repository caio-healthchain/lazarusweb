# Plano de Refatoração - Dashboard Gerencial

## Contexto
A área de negócio solicitou alterações no Dashboard Gerencial, indicando que as métricas atuais (Receita Total, Pacientes Atendidos, Taxa de Ocupação) já são conhecidas e não representam o diferencial necessário.

## Requisitos de Negócio

### Informações Prioritárias (Destaque)
1. **Contratos a Vencer** - Quais contratos estão para vencer?
2. **Operadoras Mais Lucrativas** - Quais operadoras estão dando mais lucro?
3. **Atrasos de Pagamento por Operadora** - Quais operadoras demoram mais para pagar?
4. **Maiores Ofensores em Atraso** - Quais foram os maiores ofensores na demora do pagamento?
5. **Procedimentos com Prejuízo** - Quais procedimentos dão mais prejuízos para o hospital?

### Informações Secundárias (Manter, mas em segundo plano)
- Receita Total
- Pacientes Atendidos
- Taxa de Ocupação
- Cirurgias Realizadas

## Arquitetura Proposta

### Estrutura de Layout
```
┌─────────────────────────────────────────────────────────────┐
│ Header (Dashboard Gerencial + Filtros)                      │
├─────────────────────────────────────────────────────────────┤
│ Seção 1: INSIGHTS CRÍTICOS (Grid 2x2 ou 3x2)               │
│ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐        │
│ │ Contratos a  │ │ Operadoras   │ │ Atrasos de   │        │
│ │ Vencer       │ │ + Lucrativas │ │ Pagamento    │        │
│ └──────────────┘ └──────────────┘ └──────────────┘        │
│ ┌──────────────┐ ┌──────────────┐                         │
│ │ Maiores      │ │ Procedimentos│                         │
│ │ Ofensores    │ │ c/ Prejuízo  │                         │
│ └──────────────┘ └──────────────┘                         │
├─────────────────────────────────────────────────────────────┤
│ Seção 2: MÉTRICAS OPERACIONAIS (Collapsible/Tabs)          │
│ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐                       │
│ │Receita│Pacient│Taxa Oc│Cirurg │                       │
│ └──────┘ └──────┘ └──────┘ └──────┘                       │
├─────────────────────────────────────────────────────────────┤
│ Seção 3: SIDEBAR (Alertas + Ações Rápidas)                 │
└─────────────────────────────────────────────────────────────┘
```

### Componentes a Criar

1. **ContractsExpiringCard.tsx**
   - Lista contratos com vencimento próximo (30, 60, 90 dias)
   - Badge de urgência (vermelho < 30d, amarelo < 60d)
   - Valor do contrato e operadora

2. **TopProfitableOperatorsCard.tsx**
   - Ranking das 5 operadoras mais lucrativas
   - Gráfico de barras horizontal
   - Valor total e % de participação

3. **PaymentDelaysCard.tsx**
   - Tempo médio de pagamento por operadora
   - Indicador visual de atraso (verde < 30d, amarelo < 60d, vermelho > 60d)
   - Comparativo com média do mercado

4. **TopDelayOffendersCard.tsx**
   - Top 5 operadoras com maiores atrasos
   - Valor em atraso
   - Quantidade de dias em atraso

5. **UnprofitableProceduresCard.tsx**
   - Lista de procedimentos com margem negativa
   - Valor do prejuízo
   - Frequência de realização
   - Sugestão de revisão de tabela

6. **OperationalMetricsCollapsible.tsx**
   - Seção colapsável com as métricas atuais
   - Formato compacto (4 cards em linha)

## Estrutura de Dados Mock

### Contratos a Vencer
```typescript
interface ExpiringContract {
  id: string;
  operatorName: string;
  contractValue: number;
  expirationDate: string;
  daysUntilExpiration: number;
  status: 'critical' | 'warning' | 'normal';
}
```

### Operadoras Lucrativas
```typescript
interface ProfitableOperator {
  id: string;
  name: string;
  totalRevenue: number;
  profitMargin: number;
  marketShare: number;
}
```

### Atrasos de Pagamento
```typescript
interface PaymentDelay {
  operatorId: string;
  operatorName: string;
  averagePaymentDays: number;
  pendingAmount: number;
  status: 'onTime' | 'delayed' | 'critical';
}
```

### Procedimentos com Prejuízo
```typescript
interface UnprofitableProcedure {
  id: string;
  code: string;
  name: string;
  cost: number;
  reimbursement: number;
  loss: number;
  frequency: number;
}
```

## Tecnologias Utilizadas
- React 18 + TypeScript
- Vite
- Tailwind CSS
- shadcn/ui (Card, Badge, Button, Tabs, Collapsible)
- Recharts (para gráficos)
- Lucide React (ícones)

## Passos de Implementação

1. ✅ Analisar estrutura atual
2. ⏳ Criar componentes de cards para insights críticos
3. ⏳ Implementar dados mock para desenvolvimento
4. ⏳ Refatorar ManagerialDashboard.tsx com novo layout
5. ⏳ Mover métricas operacionais para seção secundária
6. ⏳ Testar localmente
7. ⏳ Commit e push

## Observações
- Manter compatibilidade com API existente
- Usar dados mock até integração com backend
- Garantir responsividade mobile
- Manter padrão visual do sistema (cores, tipografia)
