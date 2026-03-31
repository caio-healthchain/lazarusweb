import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { API_CONFIG } from '@/config/auth';
import { useAuthStore } from '@/store/authStore';
import {
  MOCK_GUIDES,
  MOCK_PROCEDURES,
  MOCK_PATIENTS,
  MOCK_VALIDATIONS,
  MOCK_AUDIT_LOGS,
  MOCK_DASHBOARD_METRICS,
  MOCK_HOSPITAL,
  MOCK_HOSPITALS,
  MOCK_CONTRACTS,
} from './mockData';

// ============================================================
// DEMO MODE: Todos os services retornam dados mockados
// ============================================================
const DEMO_MODE = true;

// Helper para simular delay de rede
const delay = (ms: number = 300) => new Promise(r => setTimeout(r, ms));

// Helper para criar AxiosResponse mockada
const mockAxiosResponse = <T>(data: T, config: any = {}): AxiosResponse<T> => ({
  data,
  status: 200,
  statusText: 'OK',
  headers: {},
  config: config,
} as AxiosResponse<T>);

// Tipos base
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// Tipos específicos do domínio
export interface Patient {
  id: string;
  fullName: string;
  cpf: string;
  email: string;
  phone: string;
  medicalRecordNumber: string;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  age?: number;
  gender?: 'M' | 'F';
  roomNumber?: string;
  admissionDate?: string;
  healthPlan?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Procedure {
  id: string;
  patientId: string;
  name: string;
  code: string;
  description: string;
  surgicalPort: number;
  suggestedPort?: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
  updatedAt: string;
}

export interface Validation {
  id: string;
  patientId: string;
  type: 'SURGICAL_PORT' | 'MATERIAL_COVERAGE' | 'EXTRA_PACKAGE' | 'BILLING';
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  title: string;
  description: string;
  currentValue: string;
  suggestedValue: string;
  identifiedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface Material {
  id: string;
  name: string;
  code: string;
  covered: boolean;
  justificationRequired: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Billing {
  id: string;
  patientId: string;
  procedureId: string;
  amount: number;
  suggestedAmount?: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
  updatedAt: string;
}

// Tipos para Guias (XML importados) e seus procedimentos
export interface Guide {
  id: string;
  numeroGuiaPrestador?: string;
  tipoGuia?: string;
  numeroCarteira?: string;
  valorTotalGeral?: string;
  loteGuia?: string;
  valorTotalProcedimentos?: number;
  status?: string;
  diagnostico?: string;
  dataInicioFaturamento?: string;
  dataFinalFaturamento?: string;
  auditStatus?: 'PENDING' | 'COMPLETED';
  createdAt?: string;
  updatedAt?: string;
}

export interface GuiaProcedure {
  id: string;
  sequencialItem?: string;
  guiaId: string;
  codigoProcedimento: string;
  descricaoProcedimento: string;
  quantidadeExecutada?: number;
  valorUnitario?: number;
  valorTotal?: number;
  valorAprovado?: number;
  status?: 'PENDING' | 'APPROVED' | 'REJECTED' | string;
  motivoRejeicao?: string;
  categoriaRejeicao?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Configuração do Axios (mantido para caso precise desativar DEMO_MODE)
const createApiClient = (): AxiosInstance => {
  const client = axios.create({
    baseURL: API_CONFIG.baseUrl,
    timeout: 30000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  client.interceptors.request.use(
    (config) => {
      const apiKey = import.meta.env.VITE_API_KEY || "a7f3c8e9d2b1f4a6c5e8d9f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2";
      if (apiKey) {
        config.headers['X-API-Key'] = apiKey;
      } else {
        const { accessToken } = useAuthStore.getState();
        if (accessToken) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }
      }
      if (config.data instanceof FormData) {
        delete config.headers['Content-Type'];
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  client.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        const { user } = useAuthStore.getState();
        if (user?.id === 'test-admin-123') {
          console.warn('Demo mode: ignorando 401');
          return Promise.reject(error);
        }
        const { logout } = useAuthStore.getState();
        logout();
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }
  );

  return client;
};

const apiClient = createApiClient();

// ============================================================
// MOCK BILLINGS
// ============================================================
const MOCK_BILLINGS: Billing[] = [
  {
    id: 'bill-001',
    patientId: 'pat-001',
    procedureId: 'proc-001',
    amount: 8000,
    suggestedAmount: 7500,
    status: 'PENDING',
    createdAt: '2026-03-31T10:00:00Z',
    updatedAt: '2026-03-31T10:00:00Z',
  },
  {
    id: 'bill-002',
    patientId: 'pat-002',
    procedureId: 'proc-002',
    amount: 12000,
    suggestedAmount: 12000,
    status: 'APPROVED',
    createdAt: '2026-03-30T14:30:00Z',
    updatedAt: '2026-03-30T14:30:00Z',
  },
];

const MOCK_PROCEDURES_GENERAL: Procedure[] = [
  {
    id: 'proc-001',
    patientId: 'pat-001',
    name: 'Apendicectomia',
    code: '31101192',
    description: 'Apendicectomia videolaparoscópica',
    surgicalPort: 10,
    suggestedPort: 8,
    status: 'PENDING',
    createdAt: '2026-03-31T10:00:00Z',
    updatedAt: '2026-03-31T10:00:00Z',
  },
  {
    id: 'proc-002',
    patientId: 'pat-002',
    name: 'Redução de Fratura de Fêmur',
    code: '31201401',
    description: 'Redução cirúrgica de fratura de fêmur com fixação interna',
    surgicalPort: 14,
    suggestedPort: 14,
    status: 'APPROVED',
    createdAt: '2026-03-30T14:30:00Z',
    updatedAt: '2026-03-30T14:30:00Z',
  },
];

// ============================================================
// SERVIÇOS COM MOCK DIRETO
// ============================================================

export const patientsService = {
  getAll: async (params?: { search?: string; page?: number; limit?: number }): Promise<AxiosResponse<PaginatedResponse<Patient>>> => {
    if (DEMO_MODE) {
      await delay();
      let filtered = [...MOCK_PATIENTS];
      if (params?.search) {
        const s = params.search.toLowerCase();
        filtered = filtered.filter(p => p.fullName.toLowerCase().includes(s) || p.cpf.includes(s));
      }
      return mockAxiosResponse({
        data: filtered,
        total: filtered.length,
        page: 1,
        limit: 10,
        hasNext: false,
        hasPrev: false,
      });
    }
    return apiClient.get<PaginatedResponse<Patient>>(API_CONFIG.endpoints.patients, { params });
  },

  getById: async (id: string): Promise<AxiosResponse<ApiResponse<Patient>>> => {
    if (DEMO_MODE) {
      await delay();
      const patient = MOCK_PATIENTS.find(p => p.id === id) || MOCK_PATIENTS[0];
      return mockAxiosResponse({ data: patient, success: true });
    }
    return apiClient.get<ApiResponse<Patient>>(`${API_CONFIG.endpoints.patients}/${id}`);
  },

  create: async (data: Omit<Patient, 'id' | 'createdAt' | 'updatedAt'>): Promise<AxiosResponse<ApiResponse<Patient>>> => {
    if (DEMO_MODE) {
      await delay();
      return mockAxiosResponse({ data: { ...data, id: 'new-pat', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() } as Patient, success: true });
    }
    return apiClient.post<ApiResponse<Patient>>(API_CONFIG.endpoints.patients, data);
  },

  update: async (id: string, data: Partial<Patient>): Promise<AxiosResponse<ApiResponse<Patient>>> => {
    if (DEMO_MODE) {
      await delay();
      const patient = MOCK_PATIENTS.find(p => p.id === id) || MOCK_PATIENTS[0];
      return mockAxiosResponse({ data: { ...patient, ...data } as Patient, success: true });
    }
    return apiClient.put<ApiResponse<Patient>>(`${API_CONFIG.endpoints.patients}/${id}`, data);
  },

  delete: async (id: string): Promise<AxiosResponse<ApiResponse<void>>> => {
    if (DEMO_MODE) {
      await delay();
      return mockAxiosResponse({ data: undefined as any, success: true });
    }
    return apiClient.delete<ApiResponse<void>>(`${API_CONFIG.endpoints.patients}/${id}`);
  },
};

export const proceduresService = {
  getAll: async (params?: { patientId?: string; page?: number; limit?: number }): Promise<AxiosResponse<PaginatedResponse<Procedure>>> => {
    if (DEMO_MODE) {
      await delay();
      let filtered = [...MOCK_PROCEDURES_GENERAL];
      if (params?.patientId) {
        filtered = filtered.filter(p => p.patientId === params.patientId);
      }
      return mockAxiosResponse({
        data: filtered,
        total: filtered.length,
        page: 1,
        limit: 10,
        hasNext: false,
        hasPrev: false,
      });
    }
    return apiClient.get<PaginatedResponse<Procedure>>(API_CONFIG.endpoints.procedures, { params });
  },

  getById: async (id: string): Promise<AxiosResponse<ApiResponse<Procedure>>> => {
    if (DEMO_MODE) {
      await delay();
      const proc = MOCK_PROCEDURES_GENERAL.find(p => p.id === id) || MOCK_PROCEDURES_GENERAL[0];
      return mockAxiosResponse({ data: proc, success: true });
    }
    return apiClient.get<ApiResponse<Procedure>>(`${API_CONFIG.endpoints.procedures}/${id}`);
  },

  create: async (data: any): Promise<AxiosResponse<ApiResponse<Procedure>>> => {
    if (DEMO_MODE) {
      await delay();
      return mockAxiosResponse({ data: { ...data, id: 'new-proc' } as Procedure, success: true });
    }
    return apiClient.post<ApiResponse<Procedure>>(API_CONFIG.endpoints.procedures, data);
  },

  update: async (id: string, data: any): Promise<AxiosResponse<ApiResponse<Procedure>>> => {
    if (DEMO_MODE) {
      await delay();
      return mockAxiosResponse({ data: { ...MOCK_PROCEDURES_GENERAL[0], ...data } as Procedure, success: true });
    }
    return apiClient.put<ApiResponse<Procedure>>(`${API_CONFIG.endpoints.procedures}/${id}`, data);
  },

  delete: async (id: string): Promise<AxiosResponse<ApiResponse<void>>> => {
    if (DEMO_MODE) {
      await delay();
      return mockAxiosResponse({ data: undefined as any, success: true });
    }
    return apiClient.delete<ApiResponse<void>>(`${API_CONFIG.endpoints.procedures}/${id}`);
  },
};

export const validationsService = {
  getByPatient: async (patientId: string): Promise<AxiosResponse<ApiResponse<Validation[]>>> => {
    if (DEMO_MODE) {
      await delay();
      const filtered = MOCK_VALIDATIONS.filter(v => v.patientId === patientId);
      return mockAxiosResponse({ data: filtered.length > 0 ? filtered : MOCK_VALIDATIONS, success: true });
    }
    return apiClient.get<ApiResponse<Validation[]>>(`${API_CONFIG.endpoints.validations}/patient/${patientId}`);
  },

  approve: async (id: string): Promise<AxiosResponse<ApiResponse<Validation>>> => {
    if (DEMO_MODE) {
      await delay();
      const val = MOCK_VALIDATIONS.find(v => v.id === id) || MOCK_VALIDATIONS[0];
      return mockAxiosResponse({ data: { ...val, status: 'APPROVED' } as Validation, success: true });
    }
    return apiClient.post<ApiResponse<Validation>>(`${API_CONFIG.endpoints.validations}/${id}/approve`);
  },

  reject: async (id: string, reason?: string): Promise<AxiosResponse<ApiResponse<Validation>>> => {
    if (DEMO_MODE) {
      await delay();
      const val = MOCK_VALIDATIONS.find(v => v.id === id) || MOCK_VALIDATIONS[0];
      return mockAxiosResponse({ data: { ...val, status: 'REJECTED' } as Validation, success: true });
    }
    return apiClient.post<ApiResponse<Validation>>(`${API_CONFIG.endpoints.validations}/${id}/reject`, { reason });
  },
};

export interface AuditoriaValidacao {
  id: string;
  guiaId: number;
  procedimentoId: number;
  tipoValidacao: string;
  status: string;
  mensagem?: string;
  valorEsperado?: number;
  valorEncontrado?: number;
  diferenca?: number;
  fonteValor?: string;
  metadata?: any;
}

export const auditoriaValidacoesService = {
  getByGuia: async (guiaId: number): Promise<AxiosResponse<ApiResponse<AuditoriaValidacao[]>>> => {
    if (DEMO_MODE) {
      await delay();
      return mockAxiosResponse({ data: [], success: true });
    }
    return apiClient.get<ApiResponse<AuditoriaValidacao[]>>(`${API_CONFIG.endpoints.auditoriaValidacoes}/guia/${guiaId}`);
  },

  getByProcedimento: async (procedimentoId: number): Promise<AxiosResponse<ApiResponse<AuditoriaValidacao[]>>> => {
    if (DEMO_MODE) {
      await delay();
      return mockAxiosResponse({ data: [], success: true });
    }
    return apiClient.get<ApiResponse<AuditoriaValidacao[]>>(`${API_CONFIG.endpoints.auditoriaValidacoes}/procedimento/${procedimentoId}`);
  },
};

export const materialsService = {
  getAll: async (params?: any): Promise<AxiosResponse<PaginatedResponse<Material>>> => {
    if (DEMO_MODE) {
      await delay();
      return mockAxiosResponse({
        data: [],
        total: 0,
        page: 1,
        limit: 10,
        hasNext: false,
        hasPrev: false,
      });
    }
    return apiClient.get<PaginatedResponse<Material>>(API_CONFIG.endpoints.materials, { params });
  },

  getById: async (id: string): Promise<AxiosResponse<ApiResponse<Material>>> => {
    if (DEMO_MODE) {
      await delay();
      return mockAxiosResponse({ data: {} as Material, success: true });
    }
    return apiClient.get<ApiResponse<Material>>(`${API_CONFIG.endpoints.materials}/${id}`);
  },

  create: async (data: any): Promise<AxiosResponse<ApiResponse<Material>>> => {
    if (DEMO_MODE) {
      await delay();
      return mockAxiosResponse({ data: data as Material, success: true });
    }
    return apiClient.post<ApiResponse<Material>>(API_CONFIG.endpoints.materials, data);
  },

  update: async (id: string, data: any): Promise<AxiosResponse<ApiResponse<Material>>> => {
    if (DEMO_MODE) {
      await delay();
      return mockAxiosResponse({ data: data as Material, success: true });
    }
    return apiClient.put<ApiResponse<Material>>(`${API_CONFIG.endpoints.materials}/${id}`, data);
  },
};

export const billingService = {
  getByPatient: async (patientId: string): Promise<AxiosResponse<ApiResponse<Billing[]>>> => {
    if (DEMO_MODE) {
      await delay();
      const filtered = MOCK_BILLINGS.filter(b => b.patientId === patientId);
      return mockAxiosResponse({ data: filtered.length > 0 ? filtered : MOCK_BILLINGS, success: true });
    }
    return apiClient.get<ApiResponse<Billing[]>>(`${API_CONFIG.endpoints.billing}/patient/${patientId}`);
  },

  create: async (data: any): Promise<AxiosResponse<ApiResponse<Billing>>> => {
    if (DEMO_MODE) {
      await delay();
      return mockAxiosResponse({ data: data as Billing, success: true });
    }
    return apiClient.post<ApiResponse<Billing>>(API_CONFIG.endpoints.billing, data);
  },

  update: async (id: string, data: any): Promise<AxiosResponse<ApiResponse<Billing>>> => {
    if (DEMO_MODE) {
      await delay();
      return mockAxiosResponse({ data: data as Billing, success: true });
    }
    return apiClient.put<ApiResponse<Billing>>(`${API_CONFIG.endpoints.billing}/${id}`, data);
  },
};

export interface AuditLog {
  id: string;
  patientId?: string;
  status: string;
  details?: string;
  createdAt: string;
  updatedAt: string;
}

export const auditService = {
  getAll: async (params?: any): Promise<AxiosResponse<PaginatedResponse<AuditLog>>> => {
    if (DEMO_MODE) {
      await delay();
      return mockAxiosResponse({
        data: MOCK_AUDIT_LOGS,
        total: MOCK_AUDIT_LOGS.length,
        page: 1,
        limit: 10,
        hasNext: false,
        hasPrev: false,
      });
    }
    return apiClient.get<PaginatedResponse<AuditLog>>(API_CONFIG.endpoints.audit, { params });
  },

  createAuditLog: async (data: AuditLog): Promise<AxiosResponse<ApiResponse<AuditLog>>> => {
    if (DEMO_MODE) {
      await delay();
      return mockAxiosResponse({ data, success: true });
    }
    return apiClient.post<ApiResponse<AuditLog>>(API_CONFIG.endpoints.audit, data);
  },

  uploadAuditFile: async (file: File): Promise<AxiosResponse<ApiResponse<{ id: string }>>> => {
    if (DEMO_MODE) {
      await delay(1500);
      return mockAxiosResponse({ data: { id: 'upload-demo-001' }, success: true, message: 'Arquivo processado com sucesso' });
    }
    const formData = new FormData();
    formData.append('file', file);
    return apiClient.post<ApiResponse<{ id: string }>>(`${API_CONFIG.endpoints.xmlImporter}`, formData);
  },
};

// Serviço para buscar guias (XMLs importados) e seus procedimentos
export const guideService = {
  getAll: async (params?: { page?: number; limit?: number }): Promise<AxiosResponse<PaginatedResponse<Guide>>> => {
    if (DEMO_MODE) {
      await delay();
      return mockAxiosResponse({
        data: MOCK_GUIDES,
        total: MOCK_GUIDES.length,
        page: 1,
        limit: 10,
        hasNext: false,
        hasPrev: false,
      });
    }
    return apiClient.get<PaginatedResponse<Guide>>(API_CONFIG.endpoints.guias, { params });
  },

  getProcedures: async (numeroGuiaPrestador: string): Promise<AxiosResponse<ApiResponse<GuiaProcedure[]>>> => {
    if (DEMO_MODE) {
      await delay();
      // Buscar por guiaId que corresponde ao numeroGuiaPrestador
      const guide = MOCK_GUIDES.find(g => g.numeroGuiaPrestador === numeroGuiaPrestador);
      const procs = guide ? MOCK_PROCEDURES.filter(p => p.guiaId === guide.id) : MOCK_PROCEDURES;
      return mockAxiosResponse({ data: procs, success: true });
    }
    return apiClient.get<ApiResponse<GuiaProcedure[]>>(`${API_CONFIG.endpoints.guias}/${numeroGuiaPrestador}/procedures`);
  },

  getProcedureById: async (procedureId: string): Promise<AxiosResponse<ApiResponse<GuiaProcedure>>> => {
    if (DEMO_MODE) {
      await delay();
      const proc = MOCK_PROCEDURES.find(p => p.id === procedureId) || MOCK_PROCEDURES[0];
      return mockAxiosResponse({ data: proc, success: true });
    }
    return apiClient.get<ApiResponse<GuiaProcedure>>(`${API_CONFIG.endpoints.guiaProcedimentos}/${procedureId}`);
  },

  updateProcedureStatus: async (procedimentoId: string, status: 'PENDING' | 'APPROVED' | 'REJECTED', guiaId?: number): Promise<AxiosResponse<ApiResponse<any>>> => {
    if (DEMO_MODE) {
      await delay();
      return mockAxiosResponse({ data: { id: procedimentoId, status }, success: true, message: `Procedimento ${status === 'APPROVED' ? 'aprovado' : status === 'REJECTED' ? 'rejeitado' : 'atualizado'} com sucesso` });
    }
    const endpoint = status === 'APPROVED'
      ? `${API_CONFIG.endpoints.procedureApproval}/${procedimentoId}/approve`
      : status === 'REJECTED'
      ? `${API_CONFIG.endpoints.procedureApproval}/${procedimentoId}/reject`
      : `${API_CONFIG.endpoints.guiaProcedimentos}/${procedimentoId}`;
    const method = status === 'PENDING' ? 'put' : 'post';
    const data = status === 'PENDING'
      ? { status }
      : { guiaId, auditorId: 'demo-auditor', observacoes: status === 'APPROVED' ? 'Aprovado pelo auditor' : 'Rejeitado pelo auditor' };
    return method === 'put'
      ? apiClient.put<ApiResponse<any>>(endpoint, data)
      : apiClient.post<ApiResponse<any>>(endpoint, data);
  },

  validateProcedimento: async (procedimentoId: number, guiaId: number, operadoraId: string): Promise<AxiosResponse<ApiResponse<any>>> => {
    if (DEMO_MODE) {
      await delay();
      return mockAxiosResponse({ data: { valid: true, procedimentoId }, success: true });
    }
    return apiClient.post<ApiResponse<any>>(`${API_CONFIG.endpoints.procedureValidation}/${procedimentoId}`, { guiaId, operadoraId });
  },

  validateGuia: async (guiaId: number, operadoraId: string): Promise<AxiosResponse<ApiResponse<any>>> => {
    if (DEMO_MODE) {
      await delay();
      return mockAxiosResponse({ data: { valid: true, guiaId }, success: true });
    }
    return apiClient.post<ApiResponse<any>>(`${API_CONFIG.endpoints.procedureValidation}-guia/${guiaId}`, { operadoraId });
  },

  approveGuiaInteira: async (guiaId: number, auditorId: string): Promise<AxiosResponse<ApiResponse<any>>> => {
    if (DEMO_MODE) {
      await delay();
      return mockAxiosResponse({ data: { approved: true, guiaId }, success: true, message: 'Guia aprovada com sucesso' });
    }
    return apiClient.post<ApiResponse<any>>(`${API_CONFIG.endpoints.procedureApproval}/guia/${guiaId}/approve-all`, { auditorId });
  },

  getGuiaStatus: async (guiaId: number): Promise<AxiosResponse<ApiResponse<any>>> => {
    if (DEMO_MODE) {
      await delay();
      return mockAxiosResponse({ data: { guiaId, status: 'PENDING', totalProcedimentos: 3, aprovados: 1, pendentes: 2 }, success: true });
    }
    return apiClient.get<ApiResponse<any>>(`${API_CONFIG.endpoints.procedureApproval}/guia/${guiaId}/status`);
  },

  updateGuideStatus: async (numeroGuiaPrestador: string, status: 'PENDING' | 'APPROVED' | 'FINALIZED'): Promise<AxiosResponse<ApiResponse<any>>> => {
    if (DEMO_MODE) {
      await delay();
      return mockAxiosResponse({ data: { numeroGuiaPrestador, status }, success: true, message: 'Status atualizado' });
    }
    return apiClient.put<ApiResponse<any>>(`${API_CONFIG.endpoints.guias}/${numeroGuiaPrestador}/status`, { status });
  },
};

// Serviço de Upload
export const uploadService = {
  uploadTissXml: async (file: File): Promise<ApiResponse<any> | null> => {
    if (DEMO_MODE) {
      console.info(`[uploadService] Demo mode: simulando upload de ${file.name}`);
      await delay(2000);
      return { data: { id: 'upload-demo', fileName: file.name }, success: true, message: 'Arquivo TISS processado com sucesso (demo)' };
    }
    console.info(`[uploadService] Iniciando upload do arquivo TISS: ${file.name}`);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const response = await apiClient.post<ApiResponse<any>>(
        `https://lazarusapi.azure-api.net/xmlimporter/upload`,
        formData
      );
      if (response.status === 204) {
        return null;
      }
      return response.data;
    } catch (error) {
      console.error(`[uploadService] Falha no upload do arquivo ${file.name}:`, error);
      throw error;
    }
  }
};

// Health check para microsserviços
export const healthService = {
  checkMicroservices: async () => {
    if (DEMO_MODE) {
      return [
        { name: 'MS Patients', status: 'online', responseTime: 45, url: '' },
        { name: 'MS Procedures', status: 'online', responseTime: 32, url: '' },
        { name: 'MS Billing', status: 'online', responseTime: 28, url: '' },
        { name: 'MS Audit', status: 'online', responseTime: 51, url: '' },
        { name: 'MS AI Agent', status: 'online', responseTime: 67, url: '' },
        { name: 'MS Rules', status: 'online', responseTime: 38, url: '' },
        { name: 'MS Dialogue', status: 'online', responseTime: 42, url: '' },
        { name: 'MS Hospital', status: 'online', responseTime: 35, url: '' },
      ];
    }
    const services = [
      { name: 'MS Patients', url: `${API_CONFIG.baseUrl.replace('/api/v1', '')}/health` },
      { name: 'MS Procedures', url: `${API_CONFIG.baseUrl.replace('/api/v1', '').replace('3001', '3002')}/health` },
      { name: 'MS Billing', url: `${API_CONFIG.baseUrl.replace('/api/v1', '').replace('3001', '3003')}/health` },
      { name: 'MS Audit', url: `${API_CONFIG.baseUrl.replace('/api/v1', '').replace('3001', '3004')}/health` },
      { name: 'MS AI Agent', url: `${API_CONFIG.baseUrl.replace('/api/v1', '').replace('3001', '3005')}/health` },
      { name: 'MS Rules', url: `${API_CONFIG.baseUrl.replace('/api/v1', '').replace('3001', '3006')}/health` },
      { name: 'MS Dialogue', url: `${API_CONFIG.baseUrl.replace('/api/v1', '').replace('3001', '3007')}/health` },
      { name: 'MS Hospital', url: `${API_CONFIG.baseUrl.replace('/api/v1', '').replace('3001', '3008')}/health` },
    ];
    const results = await Promise.allSettled(
      services.map(async (service) => {
        try {
          const start = Date.now();
          await axios.get(service.url, { timeout: 5000 });
          const responseTime = Date.now() - start;
          return { ...service, status: 'online', responseTime };
        } catch {
          return { ...service, status: 'offline', responseTime: 0 };
        }
      })
    );
    return results.map((result, index) =>
      result.status === 'fulfilled' ? result.value : { ...services[index], status: 'offline', responseTime: 0 }
    );
  },
};

export default apiClient;
