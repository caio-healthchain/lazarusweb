// ============================================================
// DADOS MOCKADOS - WORKFLOW DE CONTAS HOSPITALARES
// Hospital Sagrada Família
// ============================================================

// ---- TIPOS ----
export type WorkflowStatus = 
  | 'administrativa_pendente'
  | 'administrativa_em_analise'
  | 'enfermagem_pendente'
  | 'enfermagem_em_analise'
  | 'medica_pendente'
  | 'medica_em_analise'
  | 'auditoria_final'
  | 'faturamento'
  | 'enviado_operadora'
  | 'glosa_recebida'
  | 'glosa_em_recurso'
  | 'laudo_gerado'
  | 'finalizado';

export type GlosaStatus = 'pendente' | 'aceita' | 'contestada' | 'revertida';

export interface WorkflowAccount {
  id: string;
  numeroConta: string;
  paciente: string;
  cpf: string;
  operadora: string;
  tipoAtendimento: string;
  procedimentoPrincipal: string;
  medicoResponsavel: string;
  crmMedico: string;
  dataInternacao: string;
  dataAlta: string | null;
  valorTotal: number;
  valorGlosado: number;
  valorAprovado: number;
  status: WorkflowStatus;
  owner: string;
  ownerRole: string;
  slaHoras: number;
  slaRestante: number;
  prioridade: 'baixa' | 'media' | 'alta' | 'critica';
  historico: WorkflowHistoryEntry[];
  procedimentos: AccountProcedure[];
  materiais: AccountMaterial[];
  medicamentos: AccountMedication[];
  documentos: AccountDocument[];
  glosas: AccountGlosa[];
  laudo: AccountLaudo | null;
  auditoriaConcorrente: AuditEntry[];
}

export interface WorkflowHistoryEntry {
  id: string;
  data: string;
  de: WorkflowStatus | 'criado';
  para: WorkflowStatus;
  usuario: string;
  role: string;
  observacao: string;
}

export interface AccountProcedure {
  id: string;
  codigo: string;
  descricao: string;
  porte: string;
  valorGuia: number;
  valorContratual: number;
  status: 'pendente' | 'aprovado' | 'glosado' | 'ajustado';
  justificativa: string;
}

export interface AccountMaterial {
  id: string;
  codigo: string;
  descricao: string;
  quantidade: number;
  valorUnitario: number;
  valorTotal: number;
  fornecedor: string;
  lote: string;
  validado: boolean;
}

export interface AccountMedication {
  id: string;
  codigo: string;
  descricao: string;
  quantidade: number;
  valorUnitario: number;
  valorTotal: number;
  farmacia: string;
  prescricaoMedica: boolean;
  validado: boolean;
}

export interface AccountDocument {
  id: string;
  nome: string;
  tipo: string;
  obrigatorio: boolean;
  status: 'pendente' | 'anexado' | 'validado' | 'rejeitado';
  dataUpload: string | null;
  responsavel: string | null;
}

export interface AccountGlosa {
  id: string;
  codigoGlosa: string;
  descricaoGlosa: string;
  itemGlosado: string;
  valorGlosado: number;
  motivo: string;
  status: GlosaStatus;
  dataGlosa: string;
  dataResposta: string | null;
  justificativaRecurso: string | null;
  responsavelRecurso: string | null;
}

export interface AccountLaudo {
  id: string;
  numeroConta: string;
  dataGeracao: string;
  geradoPor: string;
  status: 'rascunho' | 'revisao' | 'aprovado' | 'enviado';
  resumoClinico: string;
  justificativaTecnica: string;
  valorOriginal: number;
  valorGlosado: number;
  valorRecuperado: number;
  itensContestados: number;
  itensRevertidos: number;
}

export interface AuditEntry {
  id: string;
  data: string;
  tipo: 'medica' | 'enfermagem' | 'administrativa';
  auditor: string;
  role: string;
  item: string;
  observacao: string;
  acao: 'aprovado' | 'ajustado' | 'pendencia' | 'glosado';
}

export interface Supplier {
  id: string;
  nome: string;
  tipo: 'farmacia' | 'opme' | 'materiais' | 'equipamentos';
  cnpj: string;
  contato: string;
  telefone: string;
  email: string;
  cidade: string;
  estado: string;
  avaliacao: number;
  prazoEntrega: string;
  condicaoPagamento: string;
  itensContratados: number;
  valorMedioMensal: number;
  status: 'ativo' | 'inativo' | 'em_negociacao';
}

// ---- FORNECEDORES ----
export const mockSuppliers: Supplier[] = [
  {
    id: 'SUP001',
    nome: 'Farmácia Hospitalar Central',
    tipo: 'farmacia',
    cnpj: '12.345.678/0001-90',
    contato: 'Roberto Almeida',
    telefone: '(11) 3456-7890',
    email: 'roberto@farmcentral.com.br',
    cidade: 'São Paulo',
    estado: 'SP',
    avaliacao: 4.8,
    prazoEntrega: '24h',
    condicaoPagamento: '30/60 dias',
    itensContratados: 342,
    valorMedioMensal: 185000,
    status: 'ativo'
  },
  {
    id: 'SUP002',
    nome: 'MedOrtho OPME',
    tipo: 'opme',
    cnpj: '23.456.789/0001-01',
    contato: 'Patrícia Souza',
    telefone: '(11) 2345-6789',
    email: 'patricia@medortho.com.br',
    cidade: 'São Paulo',
    estado: 'SP',
    avaliacao: 4.5,
    prazoEntrega: '48h',
    condicaoPagamento: '30 dias',
    itensContratados: 87,
    valorMedioMensal: 320000,
    status: 'ativo'
  },
  {
    id: 'SUP003',
    nome: 'BioMed Materiais Cirúrgicos',
    tipo: 'materiais',
    cnpj: '34.567.890/0001-12',
    contato: 'Fernando Lima',
    telefone: '(11) 4567-8901',
    email: 'fernando@biomed.com.br',
    cidade: 'Campinas',
    estado: 'SP',
    avaliacao: 4.2,
    prazoEntrega: '72h',
    condicaoPagamento: '45 dias',
    itensContratados: 156,
    valorMedioMensal: 95000,
    status: 'ativo'
  },
  {
    id: 'SUP004',
    nome: 'TechLife Equipamentos',
    tipo: 'equipamentos',
    cnpj: '45.678.901/0001-23',
    contato: 'Marcos Pereira',
    telefone: '(11) 5678-9012',
    email: 'marcos@techlife.com.br',
    cidade: 'São Paulo',
    estado: 'SP',
    avaliacao: 4.0,
    prazoEntrega: '5 dias',
    condicaoPagamento: '60 dias',
    itensContratados: 28,
    valorMedioMensal: 45000,
    status: 'ativo'
  },
  {
    id: 'SUP005',
    nome: 'PharmaDistribuidora',
    tipo: 'farmacia',
    cnpj: '56.789.012/0001-34',
    contato: 'Luciana Costa',
    telefone: '(11) 6789-0123',
    email: 'luciana@pharmadist.com.br',
    cidade: 'Guarulhos',
    estado: 'SP',
    avaliacao: 3.8,
    prazoEntrega: '48h',
    condicaoPagamento: '30 dias',
    itensContratados: 210,
    valorMedioMensal: 120000,
    status: 'em_negociacao'
  }
];

// ---- CONTAS HOSPITALARES COM WORKFLOW ----
export const mockAccounts: WorkflowAccount[] = [
  // CONTA 1 - Na Frente Administrativa
  {
    id: 'CT-2026-001',
    numeroConta: '2026001234',
    paciente: 'Maria Aparecida Silva',
    cpf: '123.456.789-00',
    operadora: 'Unimed São Paulo',
    tipoAtendimento: 'Internação Cirúrgica',
    procedimentoPrincipal: 'Colecistectomia Videolaparoscópica',
    medicoResponsavel: 'Dr. Carlos Alberto Mendes',
    crmMedico: 'CRM/SP 123456',
    dataInternacao: '2026-03-25',
    dataAlta: '2026-03-28',
    valorTotal: 18500.00,
    valorGlosado: 0,
    valorAprovado: 0,
    status: 'administrativa_em_analise',
    owner: 'Ana Paula Ferreira',
    ownerRole: 'Analista Administrativo',
    slaHoras: 48,
    slaRestante: 32,
    prioridade: 'media',
    historico: [
      { id: 'H001', data: '2026-03-28T10:00:00', de: 'criado', para: 'administrativa_pendente', usuario: 'Sistema', role: 'Sistema', observacao: 'Conta criada automaticamente após alta do paciente' },
      { id: 'H002', data: '2026-03-28T14:30:00', de: 'administrativa_pendente', para: 'administrativa_em_analise', usuario: 'Ana Paula Ferreira', role: 'Analista Administrativo', observacao: 'Iniciada análise de documentação e elegibilidade' }
    ],
    procedimentos: [
      { id: 'P001', codigo: '31005497', descricao: 'Colecistectomia Videolaparoscópica', porte: '10A', valorGuia: 12000, valorContratual: 11500, status: 'pendente', justificativa: '' },
      { id: 'P002', codigo: '10101012', descricao: 'Consulta em Pronto-Socorro', porte: '1C', valorGuia: 250, valorContratual: 250, status: 'pendente', justificativa: '' }
    ],
    materiais: [
      { id: 'M001', codigo: 'MAT001', descricao: 'Kit Cirúrgico Laparoscópico', quantidade: 1, valorUnitario: 2800, valorTotal: 2800, fornecedor: 'BioMed Materiais Cirúrgicos', lote: 'LT2026-0345', validado: false },
      { id: 'M002', codigo: 'MAT002', descricao: 'Trocarte 10mm', quantidade: 3, valorUnitario: 180, valorTotal: 540, fornecedor: 'BioMed Materiais Cirúrgicos', lote: 'LT2026-0289', validado: false }
    ],
    medicamentos: [
      { id: 'MED001', codigo: 'MED001', descricao: 'Dipirona 500mg/mL IV', quantidade: 10, valorUnitario: 8.50, valorTotal: 85, farmacia: 'Farmácia Hospitalar Central', prescricaoMedica: true, validado: false },
      { id: 'MED002', codigo: 'MED002', descricao: 'Cefazolina 1g IV', quantidade: 6, valorUnitario: 22, valorTotal: 132, farmacia: 'Farmácia Hospitalar Central', prescricaoMedica: true, validado: false }
    ],
    documentos: [
      { id: 'D001', nome: 'Guia TISS', tipo: 'guia', obrigatorio: true, status: 'validado', dataUpload: '2026-03-25', responsavel: 'Recepção' },
      { id: 'D002', nome: 'Carteira do Convênio', tipo: 'elegibilidade', obrigatorio: true, status: 'validado', dataUpload: '2026-03-25', responsavel: 'Recepção' },
      { id: 'D003', nome: 'Autorização Prévia', tipo: 'autorizacao', obrigatorio: true, status: 'pendente', dataUpload: null, responsavel: null },
      { id: 'D004', nome: 'Termo de Consentimento', tipo: 'termo', obrigatorio: true, status: 'anexado', dataUpload: '2026-03-25', responsavel: 'Enfermagem' }
    ],
    glosas: [],
    laudo: null,
    auditoriaConcorrente: []
  },

  // CONTA 2 - Na Frente de Enfermagem
  {
    id: 'CT-2026-002',
    numeroConta: '2026001235',
    paciente: 'José Roberto Santos',
    cpf: '234.567.890-11',
    operadora: 'Bradesco Saúde',
    tipoAtendimento: 'Internação Clínica',
    procedimentoPrincipal: 'Tratamento de Pneumonia Grave',
    medicoResponsavel: 'Dra. Fernanda Oliveira',
    crmMedico: 'CRM/SP 234567',
    dataInternacao: '2026-03-20',
    dataAlta: '2026-03-29',
    valorTotal: 32400.00,
    valorGlosado: 0,
    valorAprovado: 0,
    status: 'enfermagem_em_analise',
    owner: 'Enfermeira Carla Dias',
    ownerRole: 'Enfermeira Auditora',
    slaHoras: 48,
    slaRestante: 18,
    prioridade: 'alta',
    historico: [
      { id: 'H003', data: '2026-03-29T08:00:00', de: 'criado', para: 'administrativa_pendente', usuario: 'Sistema', role: 'Sistema', observacao: 'Conta criada após alta' },
      { id: 'H004', data: '2026-03-29T10:00:00', de: 'administrativa_pendente', para: 'administrativa_em_analise', usuario: 'Ana Paula Ferreira', role: 'Analista Administrativo', observacao: 'Documentação validada' },
      { id: 'H005', data: '2026-03-29T16:00:00', de: 'administrativa_em_analise', para: 'enfermagem_pendente', usuario: 'Ana Paula Ferreira', role: 'Analista Administrativo', observacao: 'Aprovado pela frente administrativa' },
      { id: 'H006', data: '2026-03-30T08:30:00', de: 'enfermagem_pendente', para: 'enfermagem_em_analise', usuario: 'Enfermeira Carla Dias', role: 'Enfermeira Auditora', observacao: 'Iniciada checagem de materiais e medicamentos' }
    ],
    procedimentos: [
      { id: 'P003', codigo: '40301010', descricao: 'Internação em Enfermaria (9 diárias)', porte: '-', valorGuia: 9000, valorContratual: 8100, status: 'pendente', justificativa: '' },
      { id: 'P004', codigo: '20101015', descricao: 'Raio-X de Tórax', porte: '2B', valorGuia: 120, valorContratual: 120, status: 'aprovado', justificativa: '' },
      { id: 'P005', codigo: '40302016', descricao: 'Oxigenoterapia (9 dias)', porte: '-', valorGuia: 4500, valorContratual: 4050, status: 'pendente', justificativa: '' }
    ],
    materiais: [
      { id: 'M003', codigo: 'MAT003', descricao: 'Cateter Nasal O2', quantidade: 3, valorUnitario: 15, valorTotal: 45, fornecedor: 'BioMed Materiais Cirúrgicos', lote: 'LT2026-0401', validado: true },
      { id: 'M004', codigo: 'MAT004', descricao: 'Equipo Macrogotas', quantidade: 18, valorUnitario: 8, valorTotal: 144, fornecedor: 'BioMed Materiais Cirúrgicos', lote: 'LT2026-0399', validado: true },
      { id: 'M005', codigo: 'MAT005', descricao: 'Jelco 20G', quantidade: 6, valorUnitario: 5, valorTotal: 30, fornecedor: 'BioMed Materiais Cirúrgicos', lote: 'LT2026-0412', validado: false }
    ],
    medicamentos: [
      { id: 'MED003', codigo: 'MED003', descricao: 'Ceftriaxona 1g IV', quantidade: 18, valorUnitario: 35, valorTotal: 630, farmacia: 'Farmácia Hospitalar Central', prescricaoMedica: true, validado: true },
      { id: 'MED004', codigo: 'MED004', descricao: 'Azitromicina 500mg VO', quantidade: 5, valorUnitario: 18, valorTotal: 90, farmacia: 'Farmácia Hospitalar Central', prescricaoMedica: true, validado: true },
      { id: 'MED005', codigo: 'MED005', descricao: 'Paracetamol 750mg VO', quantidade: 27, valorUnitario: 3, valorTotal: 81, farmacia: 'Farmácia Hospitalar Central', prescricaoMedica: true, validado: false }
    ],
    documentos: [
      { id: 'D005', nome: 'Guia TISS', tipo: 'guia', obrigatorio: true, status: 'validado', dataUpload: '2026-03-20', responsavel: 'Recepção' },
      { id: 'D006', nome: 'Carteira do Convênio', tipo: 'elegibilidade', obrigatorio: true, status: 'validado', dataUpload: '2026-03-20', responsavel: 'Recepção' },
      { id: 'D007', nome: 'Autorização de Internação', tipo: 'autorizacao', obrigatorio: true, status: 'validado', dataUpload: '2026-03-20', responsavel: 'Ana Paula Ferreira' },
      { id: 'D008', nome: 'Prescrição Médica', tipo: 'prescricao', obrigatorio: true, status: 'validado', dataUpload: '2026-03-20', responsavel: 'Dra. Fernanda Oliveira' },
      { id: 'D009', nome: 'Evolução de Enfermagem', tipo: 'evolucao', obrigatorio: true, status: 'anexado', dataUpload: '2026-03-29', responsavel: 'Enfermeira Carla Dias' }
    ],
    glosas: [],
    laudo: null,
    auditoriaConcorrente: [
      { id: 'A001', data: '2026-03-22', tipo: 'enfermagem', auditor: 'Enfermeira Carla Dias', role: 'Enfermeira Auditora', item: 'Oxigenoterapia', observacao: 'Verificado uso contínuo de O2 por cateter nasal - conforme prescrição', acao: 'aprovado' },
      { id: 'A002', data: '2026-03-25', tipo: 'medica', auditor: 'Dra. Fernanda Oliveira', role: 'Médica Assistente', item: 'Antibioticoterapia', observacao: 'Escalonamento de Ceftriaxona para Meropenem - justificado por piora clínica', acao: 'ajustado' }
    ]
  },

  // CONTA 3 - Na Frente Médica
  {
    id: 'CT-2026-003',
    numeroConta: '2026001236',
    paciente: 'Antônio Carlos Pereira',
    cpf: '345.678.901-22',
    operadora: 'SulAmérica',
    tipoAtendimento: 'Internação Cirúrgica',
    procedimentoPrincipal: 'Artroplastia Total de Joelho',
    medicoResponsavel: 'Dr. Ricardo Monteiro',
    crmMedico: 'CRM/SP 345678',
    dataInternacao: '2026-03-18',
    dataAlta: '2026-03-23',
    valorTotal: 45800.00,
    valorGlosado: 0,
    valorAprovado: 0,
    status: 'medica_em_analise',
    owner: 'Dr. Ricardo Monteiro',
    ownerRole: 'Médico Auditor',
    slaHoras: 72,
    slaRestante: 48,
    prioridade: 'media',
    historico: [
      { id: 'H007', data: '2026-03-23T10:00:00', de: 'criado', para: 'administrativa_pendente', usuario: 'Sistema', role: 'Sistema', observacao: 'Conta criada após alta' },
      { id: 'H008', data: '2026-03-24T09:00:00', de: 'administrativa_pendente', para: 'administrativa_em_analise', usuario: 'Ana Paula Ferreira', role: 'Analista Administrativo', observacao: 'Documentação completa' },
      { id: 'H009', data: '2026-03-24T15:00:00', de: 'administrativa_em_analise', para: 'enfermagem_pendente', usuario: 'Ana Paula Ferreira', role: 'Analista Administrativo', observacao: 'Aprovado' },
      { id: 'H010', data: '2026-03-25T08:00:00', de: 'enfermagem_pendente', para: 'enfermagem_em_analise', usuario: 'Enfermeira Carla Dias', role: 'Enfermeira Auditora', observacao: 'Materiais e OPME validados' },
      { id: 'H011', data: '2026-03-26T14:00:00', de: 'enfermagem_em_analise', para: 'medica_pendente', usuario: 'Enfermeira Carla Dias', role: 'Enfermeira Auditora', observacao: 'Conta complementada - enviada para frente médica' },
      { id: 'H012', data: '2026-03-27T09:00:00', de: 'medica_pendente', para: 'medica_em_analise', usuario: 'Dr. Ricardo Monteiro', role: 'Médico Auditor', observacao: 'Iniciada revisão clínica e justificativa de OPME' }
    ],
    procedimentos: [
      { id: 'P006', codigo: '31301010', descricao: 'Artroplastia Total de Joelho', porte: '14C', valorGuia: 28000, valorContratual: 26500, status: 'pendente', justificativa: '' },
      { id: 'P007', codigo: '31301028', descricao: 'Prótese Total de Joelho (OPME)', porte: '-', valorGuia: 12000, valorContratual: 11000, status: 'pendente', justificativa: 'Prótese importada - necessário justificativa técnica' }
    ],
    materiais: [
      { id: 'M006', codigo: 'OPME001', descricao: 'Prótese Total de Joelho Zimmer NexGen', quantidade: 1, valorUnitario: 12000, valorTotal: 12000, fornecedor: 'MedOrtho OPME', lote: 'LT2026-OPME-089', validado: true },
      { id: 'M007', codigo: 'MAT006', descricao: 'Cimento Ósseo', quantidade: 2, valorUnitario: 350, valorTotal: 700, fornecedor: 'MedOrtho OPME', lote: 'LT2026-0456', validado: true }
    ],
    medicamentos: [
      { id: 'MED006', codigo: 'MED006', descricao: 'Morfina 10mg/mL IV', quantidade: 15, valorUnitario: 12, valorTotal: 180, farmacia: 'Farmácia Hospitalar Central', prescricaoMedica: true, validado: true },
      { id: 'MED007', codigo: 'MED007', descricao: 'Enoxaparina 40mg SC', quantidade: 10, valorUnitario: 45, valorTotal: 450, farmacia: 'Farmácia Hospitalar Central', prescricaoMedica: true, validado: true }
    ],
    documentos: [
      { id: 'D010', nome: 'Guia TISS', tipo: 'guia', obrigatorio: true, status: 'validado', dataUpload: '2026-03-18', responsavel: 'Recepção' },
      { id: 'D011', nome: 'Autorização Prévia OPME', tipo: 'autorizacao', obrigatorio: true, status: 'validado', dataUpload: '2026-03-15', responsavel: 'Ana Paula Ferreira' },
      { id: 'D012', nome: 'Laudo OPME', tipo: 'laudo_opme', obrigatorio: true, status: 'pendente', dataUpload: null, responsavel: null },
      { id: 'D013', nome: 'Relatório Cirúrgico', tipo: 'relatorio', obrigatorio: true, status: 'pendente', dataUpload: null, responsavel: null }
    ],
    glosas: [],
    laudo: null,
    auditoriaConcorrente: [
      { id: 'A003', data: '2026-03-18', tipo: 'enfermagem', auditor: 'Enfermeira Carla Dias', role: 'Enfermeira Auditora', item: 'OPME - Prótese de Joelho', observacao: 'Conferido lote, validade e nota fiscal da prótese Zimmer NexGen', acao: 'aprovado' },
      { id: 'A004', data: '2026-03-19', tipo: 'medica', auditor: 'Dr. Ricardo Monteiro', role: 'Médico Cirurgião', item: 'Procedimento Cirúrgico', observacao: 'Cirurgia realizada sem intercorrências. Tempo cirúrgico: 2h30', acao: 'aprovado' }
    ]
  },

  // CONTA 4 - Em Auditoria Final
  {
    id: 'CT-2026-004',
    numeroConta: '2026001237',
    paciente: 'Francisca Oliveira Lima',
    cpf: '456.789.012-33',
    operadora: 'Amil',
    tipoAtendimento: 'Internação Cirúrgica',
    procedimentoPrincipal: 'Apendicectomia Videolaparoscópica',
    medicoResponsavel: 'Dr. Paulo Henrique Costa',
    crmMedico: 'CRM/SP 456789',
    dataInternacao: '2026-03-15',
    dataAlta: '2026-03-17',
    valorTotal: 15200.00,
    valorGlosado: 0,
    valorAprovado: 15200,
    status: 'auditoria_final',
    owner: 'Marcos Vinícius Alves',
    ownerRole: 'Analista de Auditoria',
    slaHoras: 24,
    slaRestante: 8,
    prioridade: 'alta',
    historico: [
      { id: 'H013', data: '2026-03-17T10:00:00', de: 'criado', para: 'administrativa_pendente', usuario: 'Sistema', role: 'Sistema', observacao: 'Conta criada' },
      { id: 'H014', data: '2026-03-18T09:00:00', de: 'administrativa_pendente', para: 'enfermagem_pendente', usuario: 'Ana Paula Ferreira', role: 'Analista Administrativo', observacao: 'Documentação OK' },
      { id: 'H015', data: '2026-03-19T10:00:00', de: 'enfermagem_pendente', para: 'medica_pendente', usuario: 'Enfermeira Carla Dias', role: 'Enfermeira Auditora', observacao: 'Materiais conferidos' },
      { id: 'H016', data: '2026-03-20T14:00:00', de: 'medica_pendente', para: 'auditoria_final', usuario: 'Dr. Paulo Henrique Costa', role: 'Médico Auditor', observacao: 'Conta finalizada pela frente médica' }
    ],
    procedimentos: [
      { id: 'P008', codigo: '31003079', descricao: 'Apendicectomia Videolaparoscópica', porte: '10A', valorGuia: 8500, valorContratual: 8200, status: 'aprovado', justificativa: 'Procedimento de urgência - indicação clínica clara' }
    ],
    materiais: [
      { id: 'M008', codigo: 'MAT007', descricao: 'Kit Laparoscópico Descartável', quantidade: 1, valorUnitario: 1800, valorTotal: 1800, fornecedor: 'BioMed Materiais Cirúrgicos', lote: 'LT2026-0378', validado: true }
    ],
    medicamentos: [
      { id: 'MED008', codigo: 'MED008', descricao: 'Metronidazol 500mg IV', quantidade: 6, valorUnitario: 15, valorTotal: 90, farmacia: 'Farmácia Hospitalar Central', prescricaoMedica: true, validado: true }
    ],
    documentos: [
      { id: 'D014', nome: 'Guia TISS', tipo: 'guia', obrigatorio: true, status: 'validado', dataUpload: '2026-03-15', responsavel: 'Recepção' },
      { id: 'D015', nome: 'Relatório Cirúrgico', tipo: 'relatorio', obrigatorio: true, status: 'validado', dataUpload: '2026-03-17', responsavel: 'Dr. Paulo Henrique Costa' },
      { id: 'D016', nome: 'Termo de Consentimento', tipo: 'termo', obrigatorio: true, status: 'validado', dataUpload: '2026-03-15', responsavel: 'Enfermagem' }
    ],
    glosas: [],
    laudo: null,
    auditoriaConcorrente: []
  },

  // CONTA 5 - Enviada para Operadora (Faturamento)
  {
    id: 'CT-2026-005',
    numeroConta: '2026001238',
    paciente: 'Ricardo Mendes Barbosa',
    cpf: '567.890.123-44',
    operadora: 'SulAmérica',
    tipoAtendimento: 'Internação Clínica',
    procedimentoPrincipal: 'Tratamento de Infarto Agudo do Miocárdio',
    medicoResponsavel: 'Dr. André Luís Cardoso',
    crmMedico: 'CRM/SP 567890',
    dataInternacao: '2026-03-10',
    dataAlta: '2026-03-18',
    valorTotal: 68500.00,
    valorGlosado: 0,
    valorAprovado: 68500,
    status: 'enviado_operadora',
    owner: 'Sistema',
    ownerRole: 'Faturamento',
    slaHoras: 720,
    slaRestante: 480,
    prioridade: 'baixa',
    historico: [
      { id: 'H017', data: '2026-03-18T10:00:00', de: 'criado', para: 'administrativa_pendente', usuario: 'Sistema', role: 'Sistema', observacao: 'Conta criada' },
      { id: 'H018', data: '2026-03-19T09:00:00', de: 'administrativa_pendente', para: 'enfermagem_pendente', usuario: 'Ana Paula Ferreira', role: 'Analista Administrativo', observacao: 'OK' },
      { id: 'H019', data: '2026-03-20T10:00:00', de: 'enfermagem_pendente', para: 'medica_pendente', usuario: 'Enfermeira Carla Dias', role: 'Enfermeira Auditora', observacao: 'OK' },
      { id: 'H020', data: '2026-03-21T14:00:00', de: 'medica_pendente', para: 'auditoria_final', usuario: 'Dr. André Luís Cardoso', role: 'Médico Auditor', observacao: 'OK' },
      { id: 'H021', data: '2026-03-22T10:00:00', de: 'auditoria_final', para: 'faturamento', usuario: 'Marcos Vinícius Alves', role: 'Analista de Auditoria', observacao: 'Conta aprovada para faturamento' },
      { id: 'H022', data: '2026-03-23T09:00:00', de: 'faturamento', para: 'enviado_operadora', usuario: 'Sistema', role: 'Faturamento', observacao: 'Lote enviado à SulAmérica' }
    ],
    procedimentos: [
      { id: 'P009', codigo: '30601012', descricao: 'Cateterismo Cardíaco', porte: '12B', valorGuia: 15000, valorContratual: 14500, status: 'aprovado', justificativa: '' },
      { id: 'P010', codigo: '30602019', descricao: 'Angioplastia com Stent', porte: '14C', valorGuia: 28000, valorContratual: 27000, status: 'aprovado', justificativa: '' }
    ],
    materiais: [
      { id: 'M009', codigo: 'OPME002', descricao: 'Stent Farmacológico', quantidade: 2, valorUnitario: 8500, valorTotal: 17000, fornecedor: 'MedOrtho OPME', lote: 'LT2026-OPME-102', validado: true }
    ],
    medicamentos: [
      { id: 'MED009', codigo: 'MED009', descricao: 'Heparina 5000UI/mL IV', quantidade: 20, valorUnitario: 25, valorTotal: 500, farmacia: 'Farmácia Hospitalar Central', prescricaoMedica: true, validado: true }
    ],
    documentos: [
      { id: 'D017', nome: 'Guia TISS', tipo: 'guia', obrigatorio: true, status: 'validado', dataUpload: '2026-03-10', responsavel: 'Recepção' },
      { id: 'D018', nome: 'Relatório de Cateterismo', tipo: 'relatorio', obrigatorio: true, status: 'validado', dataUpload: '2026-03-12', responsavel: 'Dr. André Luís Cardoso' }
    ],
    glosas: [],
    laudo: null,
    auditoriaConcorrente: []
  },

  // CONTA 6 - Com Glosa Recebida (FLUXO DE GLOSAS)
  {
    id: 'CT-2026-006',
    numeroConta: '2026001239',
    paciente: 'Lúcia Helena Martins',
    cpf: '678.901.234-55',
    operadora: 'Bradesco Saúde',
    tipoAtendimento: 'Internação Cirúrgica',
    procedimentoPrincipal: 'Histerectomia Total Abdominal',
    medicoResponsavel: 'Dra. Márcia Cristina Souza',
    crmMedico: 'CRM/SP 678901',
    dataInternacao: '2026-03-01',
    dataAlta: '2026-03-05',
    valorTotal: 22800.00,
    valorGlosado: 4350.00,
    valorAprovado: 18450.00,
    status: 'glosa_recebida',
    owner: 'Marcos Vinícius Alves',
    ownerRole: 'Analista de Auditoria',
    slaHoras: 120,
    slaRestante: 72,
    prioridade: 'critica',
    historico: [
      { id: 'H023', data: '2026-03-05T10:00:00', de: 'criado', para: 'administrativa_pendente', usuario: 'Sistema', role: 'Sistema', observacao: 'Conta criada' },
      { id: 'H024', data: '2026-03-06T09:00:00', de: 'administrativa_pendente', para: 'enfermagem_pendente', usuario: 'Ana Paula Ferreira', role: 'Analista Administrativo', observacao: 'OK' },
      { id: 'H025', data: '2026-03-07T10:00:00', de: 'enfermagem_pendente', para: 'medica_pendente', usuario: 'Enfermeira Carla Dias', role: 'Enfermeira Auditora', observacao: 'OK' },
      { id: 'H026', data: '2026-03-08T14:00:00', de: 'medica_pendente', para: 'auditoria_final', usuario: 'Dra. Márcia Cristina Souza', role: 'Médica Auditora', observacao: 'OK' },
      { id: 'H027', data: '2026-03-09T10:00:00', de: 'auditoria_final', para: 'enviado_operadora', usuario: 'Marcos Vinícius Alves', role: 'Analista de Auditoria', observacao: 'Enviado' },
      { id: 'H028', data: '2026-03-28T16:00:00', de: 'enviado_operadora', para: 'glosa_recebida', usuario: 'Sistema', role: 'Sistema', observacao: 'Glosa recebida da Bradesco Saúde - 3 itens glosados totalizando R$ 4.350,00' }
    ],
    procedimentos: [
      { id: 'P011', codigo: '31401070', descricao: 'Histerectomia Total Abdominal', porte: '12B', valorGuia: 15000, valorContratual: 14200, status: 'aprovado', justificativa: '' },
      { id: 'P012', codigo: '31401089', descricao: 'Ooforectomia Bilateral', porte: '8A', valorGuia: 4500, valorContratual: 4200, status: 'glosado', justificativa: '' }
    ],
    materiais: [
      { id: 'M010', codigo: 'MAT008', descricao: 'Fio de Sutura Vicryl 2-0', quantidade: 6, valorUnitario: 85, valorTotal: 510, fornecedor: 'BioMed Materiais Cirúrgicos', lote: 'LT2026-0501', validado: true }
    ],
    medicamentos: [
      { id: 'MED010', codigo: 'MED010', descricao: 'Tramadol 100mg IV', quantidade: 12, valorUnitario: 18, valorTotal: 216, farmacia: 'Farmácia Hospitalar Central', prescricaoMedica: true, validado: true }
    ],
    documentos: [
      { id: 'D019', nome: 'Guia TISS', tipo: 'guia', obrigatorio: true, status: 'validado', dataUpload: '2026-03-01', responsavel: 'Recepção' },
      { id: 'D020', nome: 'Relatório Cirúrgico', tipo: 'relatorio', obrigatorio: true, status: 'validado', dataUpload: '2026-03-05', responsavel: 'Dra. Márcia Cristina Souza' }
    ],
    glosas: [
      {
        id: 'G001',
        codigoGlosa: 'M20',
        descricaoGlosa: 'Procedimento não autorizado previamente',
        itemGlosado: 'Ooforectomia Bilateral (31401089)',
        valorGlosado: 4200,
        motivo: 'Procedimento não constava na autorização prévia. Necessário justificativa médica para procedimento adicional.',
        status: 'pendente',
        dataGlosa: '2026-03-28',
        dataResposta: null,
        justificativaRecurso: null,
        responsavelRecurso: null
      },
      {
        id: 'G002',
        codigoGlosa: 'M05',
        descricaoGlosa: 'Quantidade acima do autorizado',
        itemGlosado: 'Tramadol 100mg IV (12 ampolas)',
        valorGlosado: 108,
        motivo: 'Protocolo permite até 6 ampolas para este procedimento. Glosadas 6 ampolas excedentes.',
        status: 'pendente',
        dataGlosa: '2026-03-28',
        dataResposta: null,
        justificativaRecurso: null,
        responsavelRecurso: null
      },
      {
        id: 'G003',
        codigoGlosa: 'M12',
        descricaoGlosa: 'Diária excedente',
        itemGlosado: 'Diária de Enfermaria (1 diária extra)',
        valorGlosado: 42,
        motivo: 'Tempo de internação para este procedimento: 3 dias. Paciente ficou 4 dias. Glosada 1 diária.',
        status: 'pendente',
        dataGlosa: '2026-03-28',
        dataResposta: null,
        justificativaRecurso: null,
        responsavelRecurso: null
      }
    ],
    laudo: null,
    auditoriaConcorrente: []
  },

  // CONTA 7 - Glosa em Recurso com Laudo Gerado
  {
    id: 'CT-2026-007',
    numeroConta: '2026001240',
    paciente: 'Pedro Augusto Vieira',
    cpf: '789.012.345-66',
    operadora: 'Unimed São Paulo',
    tipoAtendimento: 'Internação Cirúrgica',
    procedimentoPrincipal: 'Herniorrafia Inguinal Bilateral',
    medicoResponsavel: 'Dr. Gustavo Henrique Ramos',
    crmMedico: 'CRM/SP 789012',
    dataInternacao: '2026-02-20',
    dataAlta: '2026-02-22',
    valorTotal: 12600.00,
    valorGlosado: 2800.00,
    valorAprovado: 9800.00,
    status: 'glosa_em_recurso',
    owner: 'Marcos Vinícius Alves',
    ownerRole: 'Analista de Auditoria',
    slaHoras: 240,
    slaRestante: 120,
    prioridade: 'alta',
    historico: [
      { id: 'H029', data: '2026-02-22T10:00:00', de: 'criado', para: 'administrativa_pendente', usuario: 'Sistema', role: 'Sistema', observacao: 'Conta criada' },
      { id: 'H030', data: '2026-02-25T10:00:00', de: 'administrativa_pendente', para: 'enviado_operadora', usuario: 'Sistema', role: 'Sistema', observacao: 'Fluxo completo - enviado' },
      { id: 'H031', data: '2026-03-15T16:00:00', de: 'enviado_operadora', para: 'glosa_recebida', usuario: 'Sistema', role: 'Sistema', observacao: 'Glosa recebida - R$ 2.800,00' },
      { id: 'H032', data: '2026-03-20T10:00:00', de: 'glosa_recebida', para: 'glosa_em_recurso', usuario: 'Marcos Vinícius Alves', role: 'Analista de Auditoria', observacao: 'Recurso de glosa iniciado com laudo técnico' }
    ],
    procedimentos: [
      { id: 'P013', codigo: '31201016', descricao: 'Herniorrafia Inguinal Bilateral', porte: '8A', valorGuia: 8500, valorContratual: 8000, status: 'aprovado', justificativa: '' },
      { id: 'P014', codigo: '31201024', descricao: 'Colocação de Tela (OPME)', porte: '-', valorGuia: 2800, valorContratual: 2600, status: 'glosado', justificativa: 'Operadora alega que tela não estava na autorização prévia' }
    ],
    materiais: [
      { id: 'M011', codigo: 'OPME003', descricao: 'Tela de Polipropileno 15x15cm', quantidade: 2, valorUnitario: 1400, valorTotal: 2800, fornecedor: 'MedOrtho OPME', lote: 'LT2026-OPME-045', validado: true }
    ],
    medicamentos: [],
    documentos: [
      { id: 'D021', nome: 'Guia TISS', tipo: 'guia', obrigatorio: true, status: 'validado', dataUpload: '2026-02-20', responsavel: 'Recepção' },
      { id: 'D022', nome: 'Laudo de Recurso', tipo: 'laudo', obrigatorio: true, status: 'validado', dataUpload: '2026-03-20', responsavel: 'Marcos Vinícius Alves' }
    ],
    glosas: [
      {
        id: 'G004',
        codigoGlosa: 'M20',
        descricaoGlosa: 'Material não autorizado previamente',
        itemGlosado: 'Tela de Polipropileno 15x15cm (2 unidades)',
        valorGlosado: 2800,
        motivo: 'OPME não constava na autorização prévia emitida pela operadora.',
        status: 'contestada',
        dataGlosa: '2026-03-15',
        dataResposta: '2026-03-20',
        justificativaRecurso: 'A utilização de tela de polipropileno é padrão-ouro para herniorrafia inguinal bilateral conforme diretriz da Sociedade Brasileira de Hérnia (SBH). A não utilização da tela resultaria em taxa de recidiva de 30-50% vs 1-2% com tela. Procedimento realizado em caráter de urgência, impossibilitando autorização prévia adicional.',
        responsavelRecurso: 'Marcos Vinícius Alves'
      }
    ],
    laudo: {
      id: 'L001',
      numeroConta: '2026001240',
      dataGeracao: '2026-03-20',
      geradoPor: 'Marcos Vinícius Alves',
      status: 'enviado',
      resumoClinico: 'Paciente masculino, 58 anos, admitido com hérnia inguinal bilateral sintomática. Submetido a herniorrafia inguinal bilateral com colocação de tela de polipropileno bilateral. Procedimento sem intercorrências. Alta em 48h com boa evolução.',
      justificativaTecnica: 'A utilização de tela de polipropileno em herniorrafia inguinal é considerada padrão-ouro pela Sociedade Brasileira de Hérnia (SBH) e pela European Hernia Society (EHS). Estudos demonstram que a taxa de recidiva sem tela é de 30-50%, enquanto com tela é de apenas 1-2%. A não utilização da tela configuraria má prática médica. O procedimento foi realizado em caráter de urgência relativa, com indicação clínica inequívoca.',
      valorOriginal: 12600,
      valorGlosado: 2800,
      valorRecuperado: 2800,
      itensContestados: 1,
      itensRevertidos: 0
    },
    auditoriaConcorrente: []
  },

  // CONTA 8 - Laudo gerado e aprovado
  {
    id: 'CT-2026-008',
    numeroConta: '2026001241',
    paciente: 'Sandra Regina Campos',
    cpf: '890.123.456-77',
    operadora: 'Amil',
    tipoAtendimento: 'Internação Cirúrgica',
    procedimentoPrincipal: 'Cesariana',
    medicoResponsavel: 'Dra. Juliana Alves Pinto',
    crmMedico: 'CRM/SP 890123',
    dataInternacao: '2026-02-10',
    dataAlta: '2026-02-13',
    valorTotal: 9800.00,
    valorGlosado: 1200.00,
    valorAprovado: 9200.00,
    status: 'laudo_gerado',
    owner: 'Marcos Vinícius Alves',
    ownerRole: 'Analista de Auditoria',
    slaHoras: 48,
    slaRestante: 24,
    prioridade: 'media',
    historico: [
      { id: 'H033', data: '2026-02-13T10:00:00', de: 'criado', para: 'administrativa_pendente', usuario: 'Sistema', role: 'Sistema', observacao: 'Conta criada' },
      { id: 'H034', data: '2026-02-20T10:00:00', de: 'administrativa_pendente', para: 'enviado_operadora', usuario: 'Sistema', role: 'Sistema', observacao: 'Fluxo completo' },
      { id: 'H035', data: '2026-03-10T16:00:00', de: 'enviado_operadora', para: 'glosa_recebida', usuario: 'Sistema', role: 'Sistema', observacao: 'Glosa recebida - R$ 1.200,00' },
      { id: 'H036', data: '2026-03-15T10:00:00', de: 'glosa_recebida', para: 'glosa_em_recurso', usuario: 'Marcos Vinícius Alves', role: 'Analista de Auditoria', observacao: 'Recurso iniciado' },
      { id: 'H037', data: '2026-03-25T14:00:00', de: 'glosa_em_recurso', para: 'laudo_gerado', usuario: 'Sistema', role: 'Sistema', observacao: 'Operadora reverteu glosa parcialmente - R$ 600 recuperados' }
    ],
    procedimentos: [
      { id: 'P015', codigo: '31502010', descricao: 'Cesariana', porte: '10A', valorGuia: 6500, valorContratual: 6200, status: 'aprovado', justificativa: '' }
    ],
    materiais: [],
    medicamentos: [],
    documentos: [
      { id: 'D023', nome: 'Guia TISS', tipo: 'guia', obrigatorio: true, status: 'validado', dataUpload: '2026-02-10', responsavel: 'Recepção' },
      { id: 'D024', nome: 'Laudo de Recurso', tipo: 'laudo', obrigatorio: true, status: 'validado', dataUpload: '2026-03-15', responsavel: 'Marcos Vinícius Alves' }
    ],
    glosas: [
      {
        id: 'G005',
        codigoGlosa: 'M12',
        descricaoGlosa: 'Diária excedente',
        itemGlosado: 'Diária de Apartamento (1 diária)',
        valorGlosado: 600,
        motivo: 'Cesariana prevê 2 diárias. Paciente ficou 3.',
        status: 'revertida',
        dataGlosa: '2026-03-10',
        dataResposta: '2026-03-15',
        justificativaRecurso: 'Paciente apresentou pico hipertensivo pós-operatório necessitando monitorização adicional por 24h.',
        responsavelRecurso: 'Marcos Vinícius Alves'
      },
      {
        id: 'G006',
        codigoGlosa: 'M05',
        descricaoGlosa: 'Medicamento não padronizado',
        itemGlosado: 'Sulfato de Magnésio 50% IV',
        valorGlosado: 600,
        motivo: 'Medicamento fora do protocolo padrão de cesariana.',
        status: 'aceita',
        dataGlosa: '2026-03-10',
        dataResposta: '2026-03-15',
        justificativaRecurso: null,
        responsavelRecurso: 'Marcos Vinícius Alves'
      }
    ],
    laudo: {
      id: 'L002',
      numeroConta: '2026001241',
      dataGeracao: '2026-03-15',
      geradoPor: 'Marcos Vinícius Alves',
      status: 'aprovado',
      resumoClinico: 'Paciente feminina, 32 anos, submetida a cesariana eletiva. Evoluiu com pico hipertensivo no pós-operatório imediato, necessitando monitorização adicional por 24h. Alta em boas condições.',
      justificativaTecnica: 'A diária adicional foi necessária devido a complicação pós-operatória (pico hipertensivo) que demandou monitorização contínua. Quanto ao Sulfato de Magnésio, aceita-se a glosa pois o medicamento foi administrado como medida preventiva, não terapêutica.',
      valorOriginal: 9800,
      valorGlosado: 1200,
      valorRecuperado: 600,
      itensContestados: 2,
      itensRevertidos: 1
    },
    auditoriaConcorrente: []
  },

  // CONTA 9 - Finalizada
  {
    id: 'CT-2026-009',
    numeroConta: '2026001242',
    paciente: 'Marcos Eduardo Teixeira',
    cpf: '901.234.567-88',
    operadora: 'NotreDame Intermédica',
    tipoAtendimento: 'Internação Clínica',
    procedimentoPrincipal: 'Tratamento de Crise Asmática Grave',
    medicoResponsavel: 'Dra. Camila Santos',
    crmMedico: 'CRM/SP 901234',
    dataInternacao: '2026-02-01',
    dataAlta: '2026-02-04',
    valorTotal: 8200.00,
    valorGlosado: 0,
    valorAprovado: 8200.00,
    status: 'finalizado',
    owner: '-',
    ownerRole: '-',
    slaHoras: 0,
    slaRestante: 0,
    prioridade: 'baixa',
    historico: [
      { id: 'H038', data: '2026-02-04T10:00:00', de: 'criado', para: 'administrativa_pendente', usuario: 'Sistema', role: 'Sistema', observacao: 'Conta criada' },
      { id: 'H039', data: '2026-02-15T10:00:00', de: 'administrativa_pendente', para: 'enviado_operadora', usuario: 'Sistema', role: 'Sistema', observacao: 'Fluxo completo' },
      { id: 'H040', data: '2026-03-15T10:00:00', de: 'enviado_operadora', para: 'finalizado', usuario: 'Sistema', role: 'Sistema', observacao: 'Pagamento recebido integralmente' }
    ],
    procedimentos: [
      { id: 'P016', codigo: '40301010', descricao: 'Internação em Enfermaria (3 diárias)', porte: '-', valorGuia: 3000, valorContratual: 2700, status: 'aprovado', justificativa: '' }
    ],
    materiais: [],
    medicamentos: [],
    documentos: [
      { id: 'D025', nome: 'Guia TISS', tipo: 'guia', obrigatorio: true, status: 'validado', dataUpload: '2026-02-01', responsavel: 'Recepção' }
    ],
    glosas: [],
    laudo: null,
    auditoriaConcorrente: []
  },

  // CONTA 10 - Na Frente Administrativa (pendente)
  {
    id: 'CT-2026-010',
    numeroConta: '2026001243',
    paciente: 'Beatriz Fernanda Rocha',
    cpf: '012.345.678-99',
    operadora: 'Unimed São Paulo',
    tipoAtendimento: 'Internação Cirúrgica',
    procedimentoPrincipal: 'Cirurgia de Vesícula por Videolaparoscopia',
    medicoResponsavel: 'Dr. Carlos Alberto Mendes',
    crmMedico: 'CRM/SP 123456',
    dataInternacao: '2026-03-29',
    dataAlta: '2026-03-31',
    valorTotal: 14200.00,
    valorGlosado: 0,
    valorAprovado: 0,
    status: 'administrativa_pendente',
    owner: '-',
    ownerRole: 'Aguardando atribuição',
    slaHoras: 48,
    slaRestante: 48,
    prioridade: 'media',
    historico: [
      { id: 'H041', data: '2026-03-31T08:00:00', de: 'criado', para: 'administrativa_pendente', usuario: 'Sistema', role: 'Sistema', observacao: 'Conta criada automaticamente após alta do paciente' }
    ],
    procedimentos: [
      { id: 'P017', codigo: '31005497', descricao: 'Colecistectomia Videolaparoscópica', porte: '10A', valorGuia: 12000, valorContratual: 11500, status: 'pendente', justificativa: '' }
    ],
    materiais: [],
    medicamentos: [],
    documentos: [
      { id: 'D026', nome: 'Guia TISS', tipo: 'guia', obrigatorio: true, status: 'anexado', dataUpload: '2026-03-29', responsavel: 'Recepção' },
      { id: 'D027', nome: 'Autorização Prévia', tipo: 'autorizacao', obrigatorio: true, status: 'pendente', dataUpload: null, responsavel: null }
    ],
    glosas: [],
    laudo: null,
    auditoriaConcorrente: []
  }
];

// ---- HELPERS ----
export const getStatusLabel = (status: WorkflowStatus): string => {
  const labels: Record<WorkflowStatus, string> = {
    administrativa_pendente: 'Administrativa - Pendente',
    administrativa_em_analise: 'Administrativa - Em Análise',
    enfermagem_pendente: 'Enfermagem - Pendente',
    enfermagem_em_analise: 'Enfermagem - Em Análise',
    medica_pendente: 'Médica - Pendente',
    medica_em_analise: 'Médica - Em Análise',
    auditoria_final: 'Auditoria Final',
    faturamento: 'Faturamento',
    enviado_operadora: 'Enviado à Operadora',
    glosa_recebida: 'Glosa Recebida',
    glosa_em_recurso: 'Glosa em Recurso',
    laudo_gerado: 'Laudo Gerado',
    finalizado: 'Finalizado'
  };
  return labels[status] || status;
};

export const getStatusColor = (status: WorkflowStatus): string => {
  const colors: Record<WorkflowStatus, string> = {
    administrativa_pendente: 'bg-purple-100 text-purple-800',
    administrativa_em_analise: 'bg-purple-200 text-purple-900',
    enfermagem_pendente: 'bg-blue-100 text-blue-800',
    enfermagem_em_analise: 'bg-blue-200 text-blue-900',
    medica_pendente: 'bg-emerald-100 text-emerald-800',
    medica_em_analise: 'bg-emerald-200 text-emerald-900',
    auditoria_final: 'bg-amber-100 text-amber-800',
    faturamento: 'bg-cyan-100 text-cyan-800',
    enviado_operadora: 'bg-indigo-100 text-indigo-800',
    glosa_recebida: 'bg-red-100 text-red-800',
    glosa_em_recurso: 'bg-orange-100 text-orange-800',
    laudo_gerado: 'bg-teal-100 text-teal-800',
    finalizado: 'bg-gray-100 text-gray-800'
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
};

export const getPrioridadeColor = (prioridade: string): string => {
  const colors: Record<string, string> = {
    baixa: 'bg-gray-100 text-gray-700',
    media: 'bg-yellow-100 text-yellow-800',
    alta: 'bg-orange-100 text-orange-800',
    critica: 'bg-red-100 text-red-800'
  };
  return colors[prioridade] || 'bg-gray-100 text-gray-700';
};

export const getGlosaStatusColor = (status: GlosaStatus): string => {
  const colors: Record<GlosaStatus, string> = {
    pendente: 'bg-yellow-100 text-yellow-800',
    aceita: 'bg-red-100 text-red-800',
    contestada: 'bg-orange-100 text-orange-800',
    revertida: 'bg-green-100 text-green-800'
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
};

export const getGlosaStatusLabel = (status: GlosaStatus): string => {
  const labels: Record<GlosaStatus, string> = {
    pendente: 'Pendente',
    aceita: 'Aceita (Perda)',
    contestada: 'Contestada',
    revertida: 'Revertida (Recuperada)'
  };
  return labels[status] || status;
};

// Contas agrupadas por fase do workflow (para o Kanban)
export const getAccountsByPhase = () => {
  return {
    administrativa: mockAccounts.filter(a => a.status.startsWith('administrativa')),
    enfermagem: mockAccounts.filter(a => a.status.startsWith('enfermagem')),
    medica: mockAccounts.filter(a => a.status.startsWith('medica')),
    auditoria: mockAccounts.filter(a => a.status === 'auditoria_final'),
    faturamento: mockAccounts.filter(a => a.status === 'faturamento' || a.status === 'enviado_operadora'),
    glosas: mockAccounts.filter(a => a.status.startsWith('glosa') || a.status === 'laudo_gerado'),
    finalizado: mockAccounts.filter(a => a.status === 'finalizado')
  };
};

// Métricas resumidas
export const getWorkflowMetrics = () => {
  const total = mockAccounts.length;
  const valorTotal = mockAccounts.reduce((acc, a) => acc + a.valorTotal, 0);
  const valorGlosado = mockAccounts.reduce((acc, a) => acc + a.valorGlosado, 0);
  const valorAprovado = mockAccounts.reduce((acc, a) => acc + a.valorAprovado, 0);
  const contasComGlosa = mockAccounts.filter(a => a.glosas.length > 0).length;
  const contasCriticas = mockAccounts.filter(a => a.prioridade === 'critica' || a.prioridade === 'alta').length;
  
  return {
    totalContas: total,
    valorTotal,
    valorGlosado,
    valorAprovado,
    taxaGlosa: total > 0 ? ((contasComGlosa / total) * 100).toFixed(1) : '0',
    contasCriticas,
    tempoMedioProcessamento: '4.2 dias'
  };
};
