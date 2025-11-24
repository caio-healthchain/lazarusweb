import axios from 'axios';
import { API_CONFIG } from '@/config/auth';

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

// Cliente HTTP
const apiClient = axios.create({
  baseURL: API_CONFIG.baseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token de autenticação
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Serviço de contratos
export const contractsService = {
  /**
   * Lista todos os contratos
   */
  getAll: async (): Promise<Contract[]> => {
    const response = await apiClient.get(API_CONFIG.endpoints.contracts);
    
    let contracts: any[] = [];
    
    // A API pode retornar um array direto ou um objeto paginado
    if (Array.isArray(response.data)) {
      contracts = response.data;
    } else if (response.data && Array.isArray(response.data.data)) {
      contracts = response.data.data;
    } else {
      console.error('Resposta inesperada da API:', response.data);
      return [];
    }
    
    // Mapear resposta da API para interface Contract do frontend
    return contracts.map((c: any) => ({
      id: c.id,
      operadoraId: c.operadoraId,
      numeroContrato: c.numero || c.numeroContrato, // API retorna 'numero'
      dataInicio: c.dataInicio,
      dataFim: c.dataFim,
      tipoContrato: c.operadora?.nomeFantasia || c.tipoContrato || 'N/A', // Usar nome da operadora
      status: c.status,
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
    }));
  },

  /**
   * Busca um contrato por ID
   */
  getById: async (id: string): Promise<Contract> => {
    const response = await apiClient.get<Contract>(`${API_CONFIG.endpoints.contracts}/${id}`);
    return response.data;
  },

  /**
   * Lista todos os itens de um contrato
   */
  getItems: async (id: string): Promise<ContractItem[]> => {
    const response = await apiClient.get(`${API_CONFIG.endpoints.contracts}/${id}/items`);
    // A API pode retornar um array direto ou um objeto paginado
    if (Array.isArray(response.data)) {
      return response.data;
    }
    if (response.data && Array.isArray(response.data.data)) {
      return response.data.data;
    }
    console.error('Resposta inesperada da API (items):', response.data);
    return [];
  },

  /**
   * Busca um item específico do contrato por código TUSS
   */
  getItemByTUSS: async (id: string, codigoTUSS: string): Promise<ContractItem> => {
    const response = await apiClient.get<ContractItem>(
      `${API_CONFIG.endpoints.contracts}/${id}/items/${codigoTUSS}`
    );
    return response.data;
  },

  /**
   * Valida um procedimento contra o contrato
   */
  validateProcedimento: async (data: ValidationRequest): Promise<ValidationResult> => {
    const response = await apiClient.post<ValidationResult>(
      `${API_CONFIG.endpoints.contracts}/validations/procedimento`,
      data
    );
    return response.data;
  },

  /**
   * Valida apenas o valor de um procedimento
   */
  validateValor: async (data: {
    operadoraId: string;
    codigoTUSS: string;
    valorCobrado: number;
  }): Promise<ValidationResult> => {
    const response = await apiClient.post<ValidationResult>(
      `${API_CONFIG.endpoints.contracts}/validations/valor`,
      data
    );
    return response.data;
  },

  /**
   * Valida se um procedimento está incluído em um pacote
   */
  validatePacote: async (data: {
    operadoraId: string;
    codigoPacote: string;
    codigosProcedimentos: string[];
  }): Promise<ValidationResult> => {
    const response = await apiClient.post<ValidationResult>(
      `${API_CONFIG.endpoints.contracts}/validations/pacote`,
      data
    );
    return response.data;
  },

  /**
   * Valida materiais cobrados
   */
  validateMateriais: async (data: {
    operadoraId: string;
    codigoTUSS: string;
    materiais: Material[];
  }): Promise<ValidationResult> => {
    const response = await apiClient.post<ValidationResult>(
      `${API_CONFIG.endpoints.contracts}/validations/materiais`,
      data
    );
    return response.data;
  },

  /**
   * Valida uma guia completa com todos os procedimentos
   */
  validateGuia: async (data: {
    operadoraId: string;
    numeroGuia: string;
    procedimentos: ValidationRequest[];
  }): Promise<{
    conformeGeral: boolean;
    totalDivergencias: number;
    resultados: ValidationResult[];
  }> => {
    const response = await apiClient.post(
      `${API_CONFIG.endpoints.contracts}/validations/guia`,
      data
    );
    return response.data;
  },
};

// Utilitários
export const contractsUtils = {
  /**
   * Formata valor monetário
   */
  formatCurrency: (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  },

  /**
   * Retorna cor baseada na severidade
   */
  getSeverityColor: (severidade: Divergencia['severidade']): string => {
    switch (severidade) {
      case 'BAIXA':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'MEDIA':
        return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'ALTA':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  },

  /**
   * Retorna ícone baseado no tipo de divergência
   */
  getDivergenciaIcon: (tipo: Divergencia['tipo']): string => {
    switch (tipo) {
      case 'VALOR_EXCEDIDO':
        return '💰';
      case 'NAO_CONTRATADO':
        return '❌';
      case 'PACOTE_INVALIDO':
        return '📦';
      case 'MATERIAL_NAO_COBERTO':
        return '🔧';
      case 'QUANTIDADE_EXCEDIDA':
        return '📊';
      default:
        return '⚠️';
    }
  },

  /**
   * Verifica se o contrato está ativo
   */
  isContractActive: (contract: Contract): boolean => {
    const now = new Date();
    const inicio = new Date(contract.dataInicio);
    const fim = new Date(contract.dataFim);
    return now >= inicio && now <= fim && contract.status === 'ATIVO';
  },
};
