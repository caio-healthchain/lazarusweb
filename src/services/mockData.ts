// Mock Data para Demo - Hospital Sagrada Família
import { Guide, GuiaProcedure, Patient, Procedure, Validation, Material, Billing, AuditLog } from './api';

export const MOCK_HOSPITAL = {
  id: 'hospital-sagrada-familia',
  name: 'Hospital Sagrada Família',
  cnpj: '12.345.678/0001-90',
  operadora: 'Operadora XYZ',
};

export const MOCK_GUIDES: Guide[] = [
  {
    id: '1',
    numeroGuiaPrestador: 'GD20260331001',
    tipoGuia: 'INTERNACAO',
    numeroCarteira: 'CT123456789',
    valorTotalGeral: '15000.00',
    loteGuia: 'LOTE001',
    valorTotalProcedimentos: 15000,
    status: 'PENDING',
    diagnostico: 'Apendicite Aguda',
    dataInicioFaturamento: '2026-03-25',
    dataFinalFaturamento: '2026-03-31',
    auditStatus: 'PENDING',
    createdAt: '2026-03-31T10:00:00Z',
    updatedAt: '2026-03-31T10:00:00Z',
  },
  {
    id: '2',
    numeroGuiaPrestador: 'GD20260330002',
    tipoGuia: 'INTERNACAO',
    numeroCarteira: 'CT987654321',
    valorTotalGeral: '22500.00',
    loteGuia: 'LOTE001',
    valorTotalProcedimentos: 22500,
    status: 'PENDING',
    diagnostico: 'Fratura de Fêmur',
    dataInicioFaturamento: '2026-03-28',
    dataFinalFaturamento: '2026-03-30',
    auditStatus: 'PENDING',
    createdAt: '2026-03-30T14:30:00Z',
    updatedAt: '2026-03-30T14:30:00Z',
  },
  {
    id: '3',
    numeroGuiaPrestador: 'GD20260329003',
    tipoGuia: 'CONSULTA',
    numeroCarteira: 'CT555666777',
    valorTotalGeral: '500.00',
    loteGuia: 'LOTE002',
    valorTotalProcedimentos: 500,
    status: 'APPROVED',
    diagnostico: 'Consulta Cardiológica',
    dataInicioFaturamento: '2026-03-29',
    dataFinalFaturamento: '2026-03-29',
    auditStatus: 'COMPLETED',
    createdAt: '2026-03-29T09:00:00Z',
    updatedAt: '2026-03-29T16:00:00Z',
  },
];

export const MOCK_PROCEDURES: GuiaProcedure[] = [
  {
    id: '1',
    sequencialItem: '001',
    guiaId: '1',
    codigoProcedimento: '31101192',
    descricaoProcedimento: 'Apendicectomia',
    quantidadeExecutada: 1,
    valorUnitario: 8000,
    valorTotal: 8000,
    valorAprovado: 7500,
    status: 'PENDING',
    createdAt: '2026-03-31T10:00:00Z',
    updatedAt: '2026-03-31T10:00:00Z',
  },
  {
    id: '2',
    sequencialItem: '002',
    guiaId: '1',
    codigoProcedimento: '40010019',
    descricaoProcedimento: 'Internação em Enfermaria',
    quantidadeExecutada: 6,
    valorUnitario: 1000,
    valorTotal: 6000,
    valorAprovado: 6000,
    status: 'PENDING',
    createdAt: '2026-03-31T10:00:00Z',
    updatedAt: '2026-03-31T10:00:00Z',
  },
  {
    id: '3',
    sequencialItem: '001',
    guiaId: '2',
    codigoProcedimento: '31201401',
    descricaoProcedimento: 'Redução de Fratura de Fêmur',
    quantidadeExecutada: 1,
    valorUnitario: 12000,
    valorTotal: 12000,
    valorAprovado: 12000,
    status: 'APPROVED',
    createdAt: '2026-03-30T14:30:00Z',
    updatedAt: '2026-03-30T14:30:00Z',
  },
];

export const MOCK_PATIENTS: Patient[] = [
  {
    id: 'pat-001',
    fullName: 'Maria Silva Santos',
    cpf: '123.456.789-10',
    email: 'maria.silva@email.com',
    phone: '(11) 98765-4321',
    medicalRecordNumber: 'MR-2026-001',
    status: 'ACTIVE',
    age: 45,
    gender: 'F',
    roomNumber: '301',
    admissionDate: '2026-03-25',
    healthPlan: 'Operadora XYZ',
    createdAt: '2026-03-25T08:00:00Z',
    updatedAt: '2026-03-31T10:00:00Z',
  },
  {
    id: 'pat-002',
    fullName: 'João Pedro Oliveira',
    cpf: '987.654.321-00',
    email: 'joao.pedro@email.com',
    phone: '(11) 99876-5432',
    medicalRecordNumber: 'MR-2026-002',
    status: 'ACTIVE',
    age: 72,
    gender: 'M',
    roomNumber: '205',
    admissionDate: '2026-03-28',
    healthPlan: 'Operadora XYZ',
    createdAt: '2026-03-28T10:30:00Z',
    updatedAt: '2026-03-30T14:30:00Z',
  },
];

export const MOCK_VALIDATIONS: Validation[] = [
  {
    id: 'val-001',
    patientId: 'pat-001',
    type: 'SURGICAL_PORT',
    priority: 'HIGH',
    status: 'PENDING',
    title: 'Ajuste de Porto Cirúrgico',
    description: 'Valor cobrado: R$ 8.000 | Valor permitido: R$ 7.500',
    currentValue: '8000',
    suggestedValue: '7500',
    identifiedAt: '2026-03-31T10:00:00Z',
    createdAt: '2026-03-31T10:00:00Z',
    updatedAt: '2026-03-31T10:00:00Z',
  },
  {
    id: 'val-002',
    patientId: 'pat-002',
    type: 'MATERIAL_COVERAGE',
    priority: 'MEDIUM',
    status: 'PENDING',
    title: 'Material Não Coberto',
    description: 'Prótese de fêmur - Necessária justificativa',
    currentValue: '5000',
    suggestedValue: '0',
    identifiedAt: '2026-03-30T15:00:00Z',
    createdAt: '2026-03-30T15:00:00Z',
    updatedAt: '2026-03-30T15:00:00Z',
  },
];

export const MOCK_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log-001',
    patientId: 'pat-001',
    status: 'PENDING_REVIEW',
    details: 'Guia GD20260331001 aguardando revisão do auditor',
    createdAt: '2026-03-31T10:00:00Z',
    updatedAt: '2026-03-31T10:00:00Z',
  },
  {
    id: 'log-002',
    patientId: 'pat-002',
    status: 'APPROVED',
    details: 'Guia GD20260330002 aprovada com ajustes',
    createdAt: '2026-03-30T16:00:00Z',
    updatedAt: '2026-03-30T16:00:00Z',
  },
];

export const MOCK_DASHBOARD_METRICS = {
  totalGuias: 3,
  guidasAuditadas: 1,
  guidasPendentes: 2,
  totalFaturamento: 38000,
  faturamentoAprovado: 25500,
  faturamentoAjustado: 12500,
  taxaAprovacao: 67,
  procedimentosAuditados: 3,
  procedimentosAprovados: 1,
  procedimentosPendentes: 2,
  validacoesPendentes: 2,
  hospitais: 1,
  pacientes: 2,
  operadoras: 1,
};

export const MOCK_CHAT_RESPONSES = {
  'quantas guias': `Olá! Temos **3 guias** em processamento no Hospital Sagrada Família:
- 2 guias pendentes de auditoria (R$ 37.500)
- 1 guia já aprovada (R$ 500)`,
  
  'faturamento': `O faturamento total é de **R$ 38.000**:
- Faturamento Aprovado: R$ 25.500
- Faturamento com Ajustes: R$ 12.500
- Taxa de Aprovação: 67%`,
  
  'procedimentos': `Temos **3 procedimentos** em auditoria:
- 1 Apendicectomia (R$ 8.000)
- 1 Internação (R$ 6.000)
- 1 Redução de Fratura (R$ 12.000)`,
  
  'pacientes': `Atualmente temos **2 pacientes** internados:
- Maria Silva Santos (45 anos) - Quarto 301
- João Pedro Oliveira (72 anos) - Quarto 205`,
  
  'validações': `Existem **2 validações** pendentes:
- 1 Ajuste de Porto Cirúrgico (ALTA PRIORIDADE)
- 1 Material Não Coberto (MÉDIA PRIORIDADE)`,
  
  'default': `Bem-vindo ao assistente do Lazarus! Posso ajudá-lo com informações sobre:
- Quantidade de guias e procedimentos
- Faturamento e aprovações
- Pacientes internados
- Validações pendentes
- Status de auditoria

Como posso ajudá-lo?`
};
