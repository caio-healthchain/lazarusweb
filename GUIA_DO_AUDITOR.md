# Guia do Auditor - Plataforma Lazarus

## Introdução

Este guia foi desenvolvido para orientar auditores médicos e administrativos no uso da Plataforma Lazarus para auditoria de guias TISS. O objetivo é garantir que você consiga identificar, analisar e tomar decisões sobre pendências de forma eficiente e padronizada.

---

## 📋 Visão Geral do Processo de Auditoria

O processo de auditoria na Plataforma Lazarus segue um fluxo estruturado:

1. **Importação** → Guias TISS são importadas via XML
2. **Validação Automática** → Sistema identifica pendências automaticamente
3. **Análise do Auditor** → Você revisa cada pendência e toma decisões
4. **Aprovação/Rejeição** → Procedimentos são aprovados, rejeitados ou ajustados
5. **Finalização** → Guia é finalizada e removida da lista de pendências
6. **Exportação** → XML corrigido é exportado para faturamento

---

## 🎯 Entendendo as Pendências

### O que são Pendências?

Pendências são **não-conformidades** identificadas automaticamente pelo sistema ao comparar os dados da guia com:
- Contratos com operadoras
- Tabela TUSS
- Diretrizes de Utilização (DUT)
- Pacotes contratuais
- Histórico de procedimentos

### Tipos de Pendências

A Plataforma Lazarus identifica **5 tipos** de pendências:

| Tipo | Ícone | Descrição | Gravidade |
|------|-------|-----------|-----------|
| **Portes Divergentes** | 🔶 | Porte cirúrgico diferente do esperado | Média |
| **DUT Não Conformes** | 📋 | Não atende critérios da Diretriz de Utilização | Alta |
| **Fora do Pacote** | 📦 | Procedimento não incluído no pacote contratual | Alta |
| **Valores Divergentes** | 💰 | Valor cobrado diferente do contratado | Média |
| **Duplicados** | 📑 | Procedimento pode estar duplicado na guia | Alta |

### Um Procedimento Pode Ter Múltiplas Pendências?

**Sim!** E isso é **esperado e correto**. Um único procedimento pode ter vários problemas simultaneamente.

**Exemplo Real:**

**Procedimento:** "Em Pronto Socorro" (TUSS 10101039)  
**Valor Cobrado:** R$ 133,06

**Pendências Identificadas:**
1. ❌ **Fora do Pacote** - Procedimento não está no contrato
2. ❌ **Valor Divergente** - Valor contratual é R$ 145,04 (cobrou R$ 11,98 a menos)

Neste caso, você tem **2 pendências** para o mesmo procedimento, e cada uma requer uma análise específica.

---

## 🔍 Navegando pela Interface

### Tela Principal - Lista de Guias

Ao acessar o módulo de Auditorias, você verá:

**Abas Disponíveis:**
- **Todas** - Todas as guias não finalizadas
- **Contas Parciais** - Guias em aberto (tipo SP-SADT)
- **Contas Fechadas** - Guias finalizadas (tipo Resumo de Internação)

**Informações por Guia:**
- Número da guia
- Beneficiário
- Valor total
- Quantidade de procedimentos
- Status (Pendente/Aprovado/Rejeitado)

### Tela de Detalhes da Guia

Ao clicar em uma guia, você acessa a tela de detalhes com:

**Header (Topo):**
- Número da guia
- Tipo de sessão (Conta Parcial/Fechada)
- Total de procedimentos
- Botão "Exportar XML"
- Botão "Aprovar Guia Inteira"

**Cards de Resumo:**
- Total de Procedimentos
- Valor Total
- Pendentes (quantidade)
- Pendências (quantidade de não-conformidades)

**Abas de Navegação:**
- **Pendências** - Visão consolidada por tipo
- **Todos** - Lista completa de procedimentos
- **Pendentes** - Apenas procedimentos pendentes
- **Aprovados** - Procedimentos já aprovados
- **Rejeitados** - Procedimentos rejeitados
- **Logs** - Histórico de ações de auditoria

---

## 🎬 Cenários Práticos de Auditoria

### Cenário 1: Procedimento com Valor Divergente

**Situação:**  
Procedimento "Em Pronto Socorro" (TUSS 10101039)
- Valor da Guia: R$ 133,06
- Valor Contratual: R$ 145,04
- Diferença: R$ 11,98 (a menos)

**Análise:**

O hospital cobrou **menos** do que o contratado. Isso pode indicar:
- Erro de digitação no sistema do hospital
- Tabela de preços desatualizada
- Desconto aplicado indevidamente

**Ações Possíveis:**

**Opção A - Aprovar com Valor Correto (Recomendado)**
1. Clique no card "Valores Divergentes"
2. Visualize a comparação de valores
3. Clique em "Aprovar"
4. O sistema manterá o valor da guia (R$ 133,06)
5. **Resultado:** Hospital recebe menos do que poderia

**Opção B - Solicitar Correção**
1. Entre em contato com o setor de faturamento
2. Solicite correção do valor para R$ 145,04
3. Aguarde reimportação da guia corrigida

**Opção C - Rejeitar para Revisão**
1. Clique em "Rejeitar"
2. Guia volta para o faturamento
3. Equipe corrige e reenvia

**Recomendação:**  
Se a diferença for **a menos** (como neste caso), aprove. O hospital está cobrando menos do que tem direito, então não há risco de glosa. Se for **a mais**, rejeite para correção.

---

### Cenário 2: Procedimento Fora do Pacote

**Situação:**  
Procedimento "Em Pronto Socorro" (TUSS 10101039)
- Status: Fora do Pacote
- Risco: **Alta probabilidade de glosa**

**Análise:**

O procedimento não está incluído no pacote contratual com a operadora. Isso significa que:
- A operadora pode **não pagar** (glosar) este procedimento
- Pode ser necessário cobrar do paciente (se aplicável)
- Pode ser um erro de codificação

**Ações Possíveis:**

**Opção A - Verificar Contrato**
1. Acesse a aba "Contratos" (se disponível)
2. Confirme se realmente não está no pacote
3. Verifique se há cobertura em outro código TUSS

**Opção B - Rejeitar para Recodificação**
1. Clique em "Rejeitar"
2. Entre em contato com o médico/faturamento
3. Solicite verificação do código correto
4. Exemplo: "Atendimento em PS" pode ter outro código que está no pacote

**Opção C - Aprovar com Ressalva**
1. Se o procedimento foi realmente realizado
2. E não há código alternativo
3. Aprove, mas documente que há risco de glosa
4. Informe o setor financeiro para cobrança alternativa

**Opção D - Solicitar Autorização Retroativa**
1. Entre em contato com a operadora
2. Solicite autorização retroativa
3. Se aprovado, aprove o procedimento
4. Se negado, rejeite

**Recomendação:**  
**Sempre rejeite** procedimentos fora do pacote para revisão, a menos que tenha autorização expressa da operadora ou do gestor.

---

### Cenário 3: Múltiplas Pendências no Mesmo Procedimento

**Situação:**  
Procedimento "Em Pronto Socorro" (TUSS 10101039)
- ❌ Fora do Pacote
- ❌ Valor Divergente (R$ 11,98 a menos)

**Análise:**

Você tem **2 problemas** para resolver:
1. O procedimento não está no contrato (problema maior)
2. O valor está errado (problema menor)

**Estratégia de Decisão:**

Quando há múltiplas pendências, **priorize a mais grave**:

| Prioridade | Tipo de Pendência | Ação |
|------------|-------------------|------|
| 🔴 **Alta** | Fora do Pacote | Resolver primeiro |
| 🔴 **Alta** | DUT Não Conforme | Resolver primeiro |
| 🔴 **Alta** | Duplicado | Resolver primeiro |
| 🟡 **Média** | Valor Divergente | Resolver depois |
| 🟡 **Média** | Porte Divergente | Resolver depois |

**Ações Recomendadas:**

**Passo 1 - Resolver "Fora do Pacote"**
1. Verifique se há código alternativo
2. Entre em contato com faturamento
3. Solicite recodificação ou autorização

**Passo 2 - Se Fora do Pacote for Resolvido**
- Se recodificado → Nova guia será importada
- Se autorizado → Aprove o procedimento
- Se rejeitado → Rejeite o procedimento

**Passo 3 - Resolver "Valor Divergente"**
- Se o procedimento for aprovado, o valor será ajustado automaticamente
- Se for rejeitado, o valor não importa

**Recomendação:**  
Neste caso específico, **rejeite o procedimento** devido ao "Fora do Pacote". O valor divergente se torna irrelevante se o procedimento não pode ser cobrado.

---

### Cenário 4: Procedimento com DUT Não Conforme

**Situação:**  
Procedimento "Angiotomografia Coronariana" (TUSS 41001230)
- Status: DUT Não Conforme
- Motivo: Falta documentação de critérios

**Análise:**

A Diretriz de Utilização (DUT) estabelece critérios específicos para cobertura. Para angiotomografia coronariana, os critérios incluem:
- Paciente sintomático
- Probabilidade pré-teste entre 10-70% (critérios de Diamond Forrester)
- Aparelho com 64+ colunas de detectores
- Frequência cardíaca < 65 bpm

**Ações Possíveis:**

**Opção A - Solicitar Documentação**
1. Clique no badge "DUT" para ver os critérios
2. Identifique qual critério não foi atendido
3. Entre em contato com o médico solicitante
4. Solicite documentação complementar (ex: cálculo de probabilidade pré-teste)

**Opção B - Rejeitar por Falta de Indicação**
1. Se não houver indicação clínica adequada
2. Rejeite o procedimento
3. Documente o motivo: "Não atende critérios da DUT"

**Opção C - Aprovar com Justificativa**
1. Se houver justificativa clínica robusta
2. Mesmo sem atender 100% dos critérios
3. Aprove e documente a justificativa
4. Exemplo: "Paciente com dor torácica atípica, mas com múltiplos fatores de risco"

**Recomendação:**  
DUT é uma área sensível. **Sempre solicite documentação** antes de aprovar ou rejeitar. Se houver dúvida, consulte o médico auditor sênior.

---

### Cenário 5: Procedimento Duplicado

**Situação:**  
Dois procedimentos idênticos na mesma guia:
- Item #1: "Hemograma Completo" (TUSS 40302083) - R$ 15,00
- Item #2: "Hemograma Completo" (TUSS 40302083) - R$ 15,00
- Mesma data e hora de execução

**Análise:**

Possíveis causas:
- Erro de digitação (lançado 2x por engano)
- Procedimento realmente realizado 2x (ex: antes e depois de transfusão)
- Erro de importação do sistema

**Ações Possíveis:**

**Opção A - Verificar Justificativa Clínica**
1. Consulte o prontuário eletrônico
2. Verifique se há justificativa para 2 hemogramas
3. Se justificado (ex: controle pós-transfusão), aprove ambos

**Opção B - Aprovar Apenas 1**
1. Se não houver justificativa
2. Aprove apenas o primeiro
3. Rejeite o segundo como "Duplicado"

**Opção C - Rejeitar Ambos para Revisão**
1. Se houver dúvida
2. Rejeite ambos
3. Solicite esclarecimento ao faturamento

**Recomendação:**  
Na dúvida, **aprove apenas 1** e rejeite o outro. É mais seguro do que aprovar duplicatas.

---

## 🛠️ Passo a Passo das Ações

### Como Aprovar um Procedimento

**Método 1 - Aprovação Individual**
1. Acesse a guia
2. Clique na aba "Pendentes" ou "Todos"
3. Localize o procedimento
4. Clique no botão verde "Aprovar"
5. Confirmação aparece no canto da tela

**Método 2 - Aprovação via Modal de Pendências**
1. Clique no card da pendência (ex: "Valores Divergentes")
2. Visualize a lista de procedimentos com aquela pendência
3. Clique em "Aprovar" no procedimento desejado
4. Modal fecha automaticamente

**Método 3 - Aprovação em Lote**
1. Acesse a aba "Pendentes"
2. Marque os checkboxes dos procedimentos desejados
3. Clique em "Aprovar Selecionados" (botão no topo)
4. Confirmação aparece

**Método 4 - Aprovar Guia Inteira**
1. Revise todos os procedimentos
2. Clique no botão "Aprovar Guia Inteira" (header)
3. Sistema aprova todos os procedimentos pendentes de uma vez
4. Pergunta se deseja finalizar a guia

---

### Como Rejeitar um Procedimento

**Método 1 - Rejeição Individual**
1. Acesse a guia
2. Localize o procedimento
3. Clique no botão vermelho "Rejeitar"
4. Confirmação aparece no canto da tela

**Método 2 - Rejeição em Lote**
1. Acesse a aba "Pendentes"
2. Marque os checkboxes dos procedimentos desejados
3. Clique em "Rejeitar Selecionados" (botão no topo)
4. Confirmação aparece

**Importante:**  
Procedimentos rejeitados **não são incluídos** no XML de exportação. Eles precisam ser corrigidos e reimportados.

---

### Como Resetar o Status de um Procedimento

Se você aprovou ou rejeitou por engano:

1. Acesse a aba "Aprovados" ou "Rejeitados"
2. Localize o procedimento
3. Clique em "Resetar Status" (botão no rodapé do card)
4. Procedimento volta para status "Pendente"

---

### Como Finalizar uma Guia

Após aprovar todos os procedimentos desejados:

**Opção A - Finalização Automática**
1. Clique em "Aprovar Guia Inteira"
2. Sistema aprova todos os pendentes
3. Aparece pergunta: "Deseja finalizar a guia?"
4. Clique em "OK"
5. Guia é marcada como "FINALIZED"
6. Guia sai da lista de pendências

**Opção B - Finalização Manual**
1. Aprove procedimentos individualmente
2. Quando todos estiverem aprovados/rejeitados
3. Clique em "Aprovar Guia Inteira" (mesmo sem pendentes)
4. Confirme finalização

**O que acontece após finalizar?**
- Guia **desaparece** da lista principal
- Guia fica disponível no histórico (em desenvolvimento)
- XML pode ser exportado com procedimentos aprovados

---

### Como Exportar XML

Após aprovar procedimentos:

1. Clique no botão "Exportar XML" (header, ao lado de "Aprovar Guia Inteira")
2. Sistema gera XML TISS 4.01.00
3. XML contém **apenas procedimentos aprovados**
4. Valores são os valores **corrigidos** (se houver ajustes)
5. Arquivo é baixado automaticamente
6. Nome do arquivo: `guia_[numero]_[timestamp].xml`

**Importante:**  
- Botão só fica habilitado se houver **pelo menos 1 procedimento aprovado**
- XML exportado está pronto para envio à operadora
- Procedimentos rejeitados **não aparecem** no XML

---

## 📊 Interpretando a Comparação de Valores

Quando você clica em um procedimento com pendência de valor, vê:

### Seção "Comparação de Valores"

| Campo | Descrição | Cor |
|-------|-----------|-----|
| **Valor da Guia** | Valor que o hospital cobrou | Azul |
| **Valor Contratual** | Valor previsto no contrato | Verde |
| **Diferença** | Diferença entre os dois | Verde (a menos) / Vermelho (a mais) |

### Exemplos:

**Exemplo 1 - Cobrança a Menos**
- Valor da Guia: R$ 133,06
- Valor Contratual: R$ 145,04
- Diferença: R$ 11,98 **(a menos)** ✅
- **Interpretação:** Hospital está cobrando menos do que pode. Sem risco de glosa.
- **Ação:** Aprovar (hospital perde dinheiro, mas não há problema com operadora)

**Exemplo 2 - Cobrança a Mais**
- Valor da Guia: R$ 200,00
- Valor Contratual: R$ 150,00
- Diferença: R$ 50,00 **(a mais)** ❌
- **Interpretação:** Hospital está cobrando mais do que o contratado. **Alto risco de glosa**.
- **Ação:** Rejeitar para correção (operadora vai glosar R$ 50,00)

**Exemplo 3 - Valor Conforme**
- Valor da Guia: R$ 150,00
- Valor Contratual: R$ 150,00
- Diferença: R$ 0,00 ✅
- **Interpretação:** Valor correto.
- **Ação:** Aprovar

---

## 📈 Acompanhando Logs de Auditoria

A aba "Logs" registra todas as ações de auditoria:

### Informações nos Logs:

- **Decisão:** Aprovado / Rejeitado / Parcialmente Aprovado
- **Tipo de Apontamento:** Qual pendência foi resolvida
- **Valores:** Original, Contratado, Aprovado
- **Economia Gerada:** Quanto foi economizado com a correção
- **Auditor:** Quem tomou a decisão
- **Data e Hora:** Quando a ação foi realizada
- **Observações:** Comentários do auditor

### Métricas Disponíveis:

- **Total de Ações:** Quantas decisões foram tomadas
- **Aprovados:** Quantidade de procedimentos aprovados
- **Economia Total:** Soma de todas as economias geradas

**Uso Prático:**

Os logs são úteis para:
- Rastrear decisões passadas
- Justificar ações em auditorias externas
- Calcular performance do auditor
- Gerar relatórios gerenciais

---

## ⚖️ Matriz de Decisão Rápida

Use esta tabela para decisões rápidas:

| Situação | Gravidade | Ação Recomendada |
|----------|-----------|------------------|
| Fora do Pacote | 🔴 Alta | Rejeitar para recodificação |
| DUT Não Conforme | 🔴 Alta | Solicitar documentação |
| Duplicado | 🔴 Alta | Aprovar 1, rejeitar outros |
| Valor a MAIS | 🟡 Média | Rejeitar para correção |
| Valor a MENOS | 🟢 Baixa | Aprovar |
| Porte Divergente | 🟡 Média | Verificar tabela TUSS |
| Valor Conforme | ✅ OK | Aprovar |
| Dentro do Pacote | ✅ OK | Aprovar |

---

## 🎓 Boas Práticas de Auditoria

### 1. Sempre Documente

- Use a seção de observações (quando disponível)
- Registre o motivo de decisões não óbvias
- Facilita auditorias futuras e treinamento

### 2. Priorize por Gravidade

Ordem de análise recomendada:
1. Fora do Pacote (maior risco de glosa)
2. DUT Não Conformes (risco regulatório)
3. Duplicados (erro evidente)
4. Valores Divergentes (impacto financeiro)
5. Portes Divergentes (menor impacto)

### 3. Comunique-se com a Equipe

- Médicos: Para esclarecimentos clínicos
- Faturamento: Para correções de código/valor
- Gestão: Para decisões estratégicas (ex: aceitar glosa vs. rejeitar)

### 4. Use Aprovação em Lote com Cautela

- Revise **todos** os procedimentos antes de aprovar em lote
- Não aprove "às cegas" para ganhar tempo
- Um erro pode custar milhares de reais em glosas

### 5. Finalize Guias Regularmente

- Não deixe guias aprovadas "penduradas"
- Finalize assim que concluir a análise
- Mantém a lista organizada e facilita acompanhamento

### 6. Exporte XML Imediatamente

- Após finalizar, exporte o XML
- Envie para o setor de faturamento
- Não espere acumular guias

### 7. Revise os Logs

- Ao final do dia, revise seus logs
- Verifique se há padrões de erro
- Identifique oportunidades de melhoria

---

## 🚨 Erros Comuns e Como Evitar

### Erro 1: Aprovar Procedimento Fora do Pacote

**Consequência:** Glosa total do procedimento  
**Como Evitar:** Sempre verifique o card "Fora do Pacote" antes de aprovar guia inteira

### Erro 2: Não Verificar Duplicatas

**Consequência:** Operadora paga 2x o mesmo procedimento, depois glosa na auditoria  
**Como Evitar:** Sempre revise o card "Duplicados"

### Erro 3: Aprovar Valor Acima do Contratado

**Consequência:** Glosa parcial (diferença)  
**Como Evitar:** Sempre olhe a seção "Comparação de Valores" antes de aprovar

### Erro 4: Rejeitar Sem Justificativa

**Consequência:** Retrabalho, conflito com equipe médica  
**Como Evitar:** Sempre documente o motivo da rejeição

### Erro 5: Não Finalizar Guias

**Consequência:** Lista fica poluída, dificulta acompanhamento  
**Como Evitar:** Finalize assim que concluir a análise

---

## 📞 Quando Escalar para o Gestor

Algumas situações requerem decisão gerencial:

1. **Valor Alto Fora do Pacote** (ex: > R$ 10.000)
2. **Conflito com Médico** sobre DUT
3. **Dúvida sobre Interpretação de Contrato**
4. **Procedimento Experimental** não previsto em tabela
5. **Glosa Recorrente** do mesmo tipo

Não hesite em escalar. É melhor perguntar do que errar.

---

## 🔄 Fluxo Completo de Auditoria

### Resumo do Processo:

```
1. Importar Guia (XML)
   ↓
2. Sistema Valida Automaticamente
   ↓
3. Auditor Acessa Lista de Guias
   ↓
4. Auditor Abre Guia com Pendências
   ↓
5. Auditor Revisa Aba "Pendências"
   ↓
6. Auditor Clica em Cada Tipo de Pendência
   ↓
7. Auditor Analisa Comparação de Valores
   ↓
8. Auditor Decide: Aprovar / Rejeitar / Solicitar Docs
   ↓
9. Auditor Aprova/Rejeita Procedimentos
   ↓
10. Auditor Clica "Aprovar Guia Inteira"
    ↓
11. Sistema Pergunta: "Finalizar?"
    ↓
12. Auditor Confirma Finalização
    ↓
13. Guia Sai da Lista
    ↓
14. Auditor Clica "Exportar XML"
    ↓
15. XML é Baixado
    ↓
16. Auditor Envia XML para Faturamento
    ↓
17. Faturamento Envia para Operadora
```

---

## 📚 Glossário de Termos

| Termo | Significado |
|-------|-------------|
| **Glosa** | Recusa de pagamento pela operadora |
| **DUT** | Diretriz de Utilização - critérios de cobertura |
| **TUSS** | Terminologia Unificada da Saúde Suplementar |
| **Pacote** | Conjunto de procedimentos contratados |
| **Conta Parcial** | Guia em aberto (SP-SADT) |
| **Conta Fechada** | Guia finalizada (Resumo de Internação) |
| **Porte Cirúrgico** | Classificação de complexidade cirúrgica |
| **Pendência** | Não-conformidade identificada |
| **Validação** | Verificação automática de conformidade |

---

## 💡 Dicas de Produtividade

1. **Use Atalhos de Teclado** (quando disponíveis)
   - Enter: Aprovar
   - Delete: Rejeitar
   - Esc: Fechar modal

2. **Filtre por Tipo de Pendência**
   - Resolva todas de um tipo de cada vez
   - Mais eficiente do que guia por guia

3. **Crie Checklist Mental**
   - Fora do Pacote? ✓
   - Valor OK? ✓
   - DUT OK? ✓
   - Duplicado? ✓

4. **Estabeleça Metas Diárias**
   - Ex: 20 guias por dia
   - Acompanhe seu progresso

5. **Revise em Horários Específicos**
   - Manhã: Guias complexas (mais atenção)
   - Tarde: Guias simples (mais rápido)

---

## 📞 Suporte e Contato

**Dúvidas sobre a Plataforma:**  
Entre em contato com o suporte técnico através de [help.manus.im](https://help.manus.im)

**Dúvidas Clínicas:**  
Consulte o médico auditor sênior da sua equipe

**Dúvidas Contratuais:**  
Entre em contato com o setor de contratos/gestão

---

## 📄 Conclusão

A Plataforma Lazarus foi desenvolvida para **facilitar e acelerar** o processo de auditoria, mas a **decisão final sempre é sua**. Use o sistema como ferramenta de apoio, mas mantenha seu julgamento clínico e administrativo.

Lembre-se:
- ✅ Cada decisão impacta o faturamento do hospital
- ✅ Cada rejeição gera retrabalho para a equipe
- ✅ Cada aprovação incorreta pode gerar glosa

**Audite com responsabilidade, mas com confiança. O sistema está aqui para te ajudar!**

---

**Versão:** 1.0  
**Data:** 19/11/2025  
**Autor:** Manus AI  
**Revisão:** HealthChain Solutions
