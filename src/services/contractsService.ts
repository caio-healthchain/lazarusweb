import axios from 'axios';
import { API_CONFIG } from '@/config/auth';

const DEMO_MODE = true;
const delay = (ms: number = 300) => new Promise(r => setTimeout(r, ms));

// Tipos
export interface Contract {
  id: string;
  operadoraId: string;
  numeroContrato: string;
  dataInicio: string;
  dataFim: string;
  tipoContrato: string;
  status: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ContractItem {
  id: string;
  contratoId: string;
  codigoTUSS: string;
  descricao: string | null;
  valorContratado: number;
  valorMaximo: number | null;
  quantidadeMaxima: number | null;
  tipoItem: string;
  tipoAnestesia?: string | null;
  tempoSalaCirurgica?: string | null;
  tempoPermanencia?: string | null;
  pacoteId?: string | null;
  materiaisInclusos?: MaterialIncluso[];
  createdAt?: string;
  updatedAt?: string;
}

export interface MaterialIncluso {
  id: string;
  contratoItemId: string;
  descricaoMaterial: string;
  quantidade: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ValidationRequest {
  operadoraId: string;
  codigoTUSS: string;
  valorCobrado: number;
  quantidade?: number;
  materiais?: Material[];
  pacote?: Pacote | null;
}

export interface Material {
  codigo: string;
  descricao: string;
  quantidade: number;
  valorUnitario: number;
}

export interface Pacote {
  codigo: string;
  descricao: string;
}

export interface ValidationResult {
  conforme: boolean;
  divergencias: Divergencia[];
  valorContrato: number | null;
  valorCobrado: number;
  diferenca: number;
  mensagem: string;
}

export interface Divergencia {
  tipo: 'VALOR_EXCEDIDO' | 'NAO_CONTRATADO' | 'PACOTE_INVALIDO' | 'MATERIAL_NAO_COBERTO' | 'QUANTIDADE_EXCEDIDA';
  mensagem: string;
  severidade: 'BAIXA' | 'MEDIA' | 'ALTA';
  valorEsperado?: number;
  valorEncontrado?: number;
}

// Mock Data
const MOCK_CONTRACTS: Contract[] = [
  {
    id: 'contract-001',
    operadoraId: 'op-001',
    numeroContrato: 'CTR-2026-001',
    dataInicio: '2026-01-01',
    dataFim: '2026-12-31',
    tipoContrato: 'Unimed São Paulo',
    status: 'ATIVO',
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-03-31T00:00:00Z',
  },
  {
    id: 'contract-002',
    operadoraId: 'op-002',
    numeroContrato: 'CTR-2026-002',
    dataInicio: '2026-02-01',
    dataFim: '2026-12-31',
    tipoContrato: 'Bradesco Saúde',
    status: 'ATIVO',
    createdAt: '2026-02-01T00:00:00Z',
    updatedAt: '2026-03-31T00:00:00Z',
  },
  {
    id: 'contract-003',
    operadoraId: 'op-003',
    numeroContrato: 'CTR-2025-015',
    dataInicio: '2025-06-01',
    dataFim: '2026-05-31',
    tipoContrato: 'SulAmérica',
    status: 'ATIVO',
    createdAt: '2025-06-01T00:00:00Z',
    updatedAt: '2026-03-31T00:00:00Z',
  },
];

const MOCK_CONTRACT_ITEMS: ContractItem[] = [
  {
    id: 'item-001',
    contratoId: 'contract-001',
    codigoTUSS: '31101192',
    descricao: 'Apendicectomia Videolaparoscópica',
    valorContratado: 7500,
    valorMaximo: 8500,
    quantidadeMaxima: null,
    tipoItem: 'PROCEDIMENTO',
    createdAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'item-002',
    contratoId: 'contract-001',
    codigoTUSS: '40010019',
    descricao: 'Internação em Enfermaria',
    valorContratado: 950,
    valorMaximo: 1200,
    quantidadeMaxima: 10,
    tipoItem: 'DIARIA',
    createdAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'item-003',
    contratoId: 'contract-001',
    codigoTUSS: '31201401',
    descricao: 'Redução de Fratura de Fêmur',
    valorContratado: 12000,
    valorMaximo: 15000,
    quantidadeMaxima: null,
    tipoItem: 'PROCEDIMENTO',
    createdAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'item-004',
    contratoId: 'contract-002',
    codigoTUSS: '10101012',
    descricao: 'Consulta Cardiológica',
    valorContratado: 250,
    valorMaximo: 300,
    quantidadeMaxima: null,
    tipoItem: 'CONSULTA',
    createdAt: '2026-02-01T00:00:00Z',
  },
  {
    id: 'item-005',
    contratoId: 'contract-002',
    codigoTUSS: '40304361',
    descricao: 'Hemograma Completo',
    valorContratado: 15.65,
    valorMaximo: 20,
    quantidadeMaxima: null,
    tipoItem: 'EXAME',
    createdAt: '2026-02-01T00:00:00Z',
  },
];

// Cliente HTTP
const apiClient = axios.create({
  baseURL: API_CONFIG.baseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Serviço de contratos
export const contractsService = {
  getAll: async (): Promise<Contract[]> => {
    if (DEMO_MODE) {
      await delay();
      return MOCK_CONTRACTS;
    }
    const response = await apiClient.get(API_CONFIG.endpoints.contracts);
    const contracts = Array.isArray(response.data) ? response.data : (response.data?.data || []);
    return contracts.map((c: any) => ({
      id: c.id,
      operadoraId: c.operadoraId,
      numeroContrato: c.numero || c.numeroContrato,
      dataInicio: c.dataInicio,
      dataFim: c.dataFim,
      tipoContrato: c.operadora?.nomeFantasia || c.tipoContrato || 'N/A',
      status: c.status,
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
    }));
  },

  getById: async (id: string): Promise<Contract> => {
    if (DEMO_MODE) {
      await delay();
      return MOCK_CONTRACTS.find(c => c.id === id) || MOCK_CONTRACTS[0];
    }
    const response = await apiClient.get<Contract>(`${API_CONFIG.endpoints.contracts}/${id}`);
    return response.data;
  },

  getItems: async (id: string): Promise<ContractItem[]> => {
    if (DEMO_MODE) {
      await delay();
      return MOCK_CONTRACT_ITEMS.filter(i => i.contratoId === id);
    }
    const response = await apiClient.get(`${API_CONFIG.endpoints.contracts}/${id}/items`);
    if (Array.isArray(response.data)) return response.data;
    if (response.data && Array.isArray(response.data.data)) return response.data.data;
    return [];
  },

  getItemByTUSS: async (id: string, codigoTUSS: string): Promise<ContractItem> => {
    if (DEMO_MODE) {
      await delay();
      return MOCK_CONTRACT_ITEMS.find(i => i.contratoId === id && i.codigoTUSS === codigoTUSS) || MOCK_CONTRACT_ITEMS[0];
    }
    const response = await apiClient.get<ContractItem>(
      `${API_CONFIG.endpoints.contracts}/${id}/items/${codigoTUSS}`
    );
    return response.data;
  },

  validateProcedimento: async (data: ValidationRequest): Promise<ValidationResult> => {
    if (DEMO_MODE) {
      await delay();
      return {
        conforme: true,
        divergencias: [],
        valorContrato: 7500,
        valorCobrado: data.valorCobrado,
        diferenca: data.valorCobrado - 7500,
        mensagem: 'Procedimento conforme o contrato',
      };
    }
    const response = await apiClient.post<ValidationResult>(
      `${API_CONFIG.endpoints.contracts}/validations/procedimento`,
      data
    );
    return response.data;
  },

  validateValor: async (data: { operadoraId: string; codigoTUSS: string; valorCobrado: number }): Promise<ValidationResult> => {
    if (DEMO_MODE) {
      await delay();
      return {
        conforme: true,
        divergencias: [],
        valorContrato: 7500,
        valorCobrado: data.valorCobrado,
        diferenca: 0,
        mensagem: 'Valor conforme',
      };
    }
    const response = await apiClient.post<ValidationResult>(
      `${API_CONFIG.endpoints.contracts}/validations/valor`,
      data
    );
    return response.data;
  },

  validatePacote: async (data: any): Promise<ValidationResult> => {
    if (DEMO_MODE) {
      await delay();
      return {
        conforme: true,
        divergencias: [],
        valorContrato: null,
        valorCobrado: 0,
        diferenca: 0,
        mensagem: 'Pacote válido',
      };
    }
    const response = await apiClient.post<ValidationResult>(
      `${API_CONFIG.endpoints.contracts}/validations/pacote`,
      data
    );
    return response.data;
  },

  validateMateriais: async (data: any): Promise<ValidationResult> => {
    if (DEMO_MODE) {
      await delay();
      return {
        conforme: true,
        divergencias: [],
        valorContrato: null,
        valorCobrado: 0,
        diferenca: 0,
        mensagem: 'Materiais conformes',
      };
    }
    const response = await apiClient.post<ValidationResult>(
      `${API_CONFIG.endpoints.contracts}/validations/materiais`,
      data
    );
    return response.data;
  },

  validateGuia: async (data: any): Promise<any> => {
    if (DEMO_MODE) {
      await delay();
      return {
        conformeGeral: true,
        totalDivergencias: 0,
        resultados: [],
      };
    }
    const response = await apiClient.post(
      `${API_CONFIG.endpoints.contracts}/validations/guia`,
      data
    );
    return response.data;
  },
};

// Utilitários
export const contractsUtils = {
  formatCurrency: (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  },

  getSeverityColor: (severidade: Divergencia['severidade']): string => {
    switch (severidade) {
      case 'BAIXA': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'MEDIA': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'ALTA': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  },

  getDivergenciaIcon: (tipo: Divergencia['tipo']): string => {
    switch (tipo) {
      case 'VALOR_EXCEDIDO': return '💰';
      case 'NAO_CONTRATADO': return '❌';
      case 'PACOTE_INVALIDO': return '📦';
      case 'MATERIAL_NAO_COBERTO': return '🔧';
      case 'QUANTIDADE_EXCEDIDA': return '📊';
      default: return '⚠️';
    }
  },

  isContractActive: (contract: Contract): boolean => {
    const now = new Date();
    const inicio = new Date(contract.dataInicio);
    const fim = new Date(contract.dataFim);
    return now >= inicio && now <= fim && contract.status === 'ATIVO';
  },
};
