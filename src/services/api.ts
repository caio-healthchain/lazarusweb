import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { API_CONFIG } from '@/config/auth';
import { useAuthStore } from '@/store/authStore';

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
  status?: 'PENDING' | 'APPROVED' | 'REJECTED' | string;
  createdAt?: string;
  updatedAt?: string;
}

// Configuração do Axios
const createApiClient = (): AxiosInstance => {
  const client = axios.create({
    baseURL: API_CONFIG.baseUrl,
    timeout: 30000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Interceptor para adicionar token de autenticação ou API Key
  client.interceptors.request.use(
    (config) => {
      // Prioridade: API Key (para desenvolvimento/produção) ou Bearer Token (Azure AD)
      const apiKey = import.meta.env.VITE_API_KEY || "a7f3c8e9d2b1f4a6c5e8d9f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2";
      
      if (apiKey) {
        // Usa API Key se configurada
        config.headers['X-API-Key'] = apiKey;
      } else {
        // Fallback para Bearer token do Azure AD
        const { accessToken } = useAuthStore.getState();
        if (accessToken) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }
      }

      // Para uploads de arquivo, o navegador deve definir o Content-Type automaticamente.
      if (config.data instanceof FormData) {
        delete config.headers['Content-Type'];
      }

      return config;
    },
    (error) => Promise.reject(error)
  );

  // Interceptor para tratar respostas
  client.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        const { user } = useAuthStore.getState();

        // Se for usuário demo, não fazer logout automático
        // Apenas logar o erro e deixar o componente tratar com fallback
        if (user?.id === 'test-admin-123') {
          console.warn('⚠️ API retornou 401 - Usando dados de demonstração');
          return Promise.reject(error);
        }

        // Para usuários reais, fazer logout
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

// Serviços específicos
export const patientsService = {
  getAll: (params?: { search?: string; page?: number; limit?: number }) =>
    apiClient.get<PaginatedResponse<Patient>>(API_CONFIG.endpoints.patients, { params }),

  getById: (id: string) =>
    apiClient.get<ApiResponse<Patient>>(`${API_CONFIG.endpoints.patients}/${id}`),

  create: (data: Omit<Patient, 'id' | 'createdAt' | 'updatedAt'>) =>
    apiClient.post<ApiResponse<Patient>>(API_CONFIG.endpoints.patients, data),

  update: (id: string, data: Partial<Patient>) =>
    apiClient.put<ApiResponse<Patient>>(`${API_CONFIG.endpoints.patients}/${id}`, data),

  delete: (id: string) =>
    apiClient.delete<ApiResponse<void>>(`${API_CONFIG.endpoints.patients}/${id}`),
};

export const proceduresService = {
  getAll: (params?: { patientId?: string; page?: number; limit?: number }) =>
    apiClient.get<PaginatedResponse<Procedure>>(API_CONFIG.endpoints.procedures, { params }),

  getById: (id: string) =>
    apiClient.get<ApiResponse<Procedure>>(`${API_CONFIG.endpoints.procedures}/${id}`),

  create: (data: Omit<Procedure, 'id' | 'createdAt' | 'updatedAt'>) =>
    apiClient.post<ApiResponse<Procedure>>(API_CONFIG.endpoints.procedures, data),

  update: (id: string, data: Partial<Procedure>) =>
    apiClient.put<ApiResponse<Procedure>>(`${API_CONFIG.endpoints.procedures}/${id}`, data),

  delete: (id: string) =>
    apiClient.delete<ApiResponse<void>>(`${API_CONFIG.endpoints.procedures}/${id}`),
};

export const validationsService = {
  getByPatient: (patientId: string) =>
    apiClient.get<ApiResponse<Validation[]>>(`${API_CONFIG.endpoints.validations}/patient/${patientId}`),

  approve: (id: string) =>
    apiClient.post<ApiResponse<Validation>>(`${API_CONFIG.endpoints.validations}/${id}/approve`),

  reject: (id: string, reason?: string) =>
    apiClient.post<ApiResponse<Validation>>(`${API_CONFIG.endpoints.validations}/${id}/reject`, { reason }),
};

export const materialsService = {
  getAll: (params?: { search?: string; covered?: boolean }) =>
    apiClient.get<PaginatedResponse<Material>>(API_CONFIG.endpoints.materials, { params }),

  getById: (id: string) =>
    apiClient.get<ApiResponse<Material>>(`${API_CONFIG.endpoints.materials}/${id}`),

  create: (data: Omit<Material, 'id' | 'createdAt' | 'updatedAt'>) =>
    apiClient.post<ApiResponse<Material>>(API_CONFIG.endpoints.materials, data),

  update: (id: string, data: Partial<Material>) =>
    apiClient.put<ApiResponse<Material>>(`${API_CONFIG.endpoints.materials}/${id}`, data),
};

export const billingService = {
  getByPatient: (patientId: string) =>
    apiClient.get<ApiResponse<Billing[]>>(`${API_CONFIG.endpoints.billing}/patient/${patientId}`),

  create: (data: Omit<Billing, 'id' | 'createdAt' | 'updatedAt'>) =>
    apiClient.post<ApiResponse<Billing>>(API_CONFIG.endpoints.billing, data),

  update: (id: string, data: Partial<Billing>) =>
    apiClient.put<ApiResponse<Billing>>(`${API_CONFIG.endpoints.billing}/${id}`, data),
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
  getAll: (params?: { patientId?: string; status?: string }) =>
    apiClient.get<PaginatedResponse<AuditLog>>(API_CONFIG.endpoints.audit, { params }),

  createAuditLog: (data: AuditLog) =>
    apiClient.post<ApiResponse<AuditLog>>(API_CONFIG.endpoints.audit, data),

  uploadAuditFile: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient.post<ApiResponse<{ id: string }>>(`${API_CONFIG.endpoints.xmlImporter}`, formData);
  }
};

// Serviço para buscar guias (XMLs importados) e seus procedimentos
export const guideService = {
  getAll: (params?: { page?: number; limit?: number }) =>
    apiClient.get<PaginatedResponse<Guide>>(API_CONFIG.endpoints.guias, { params }),

  // Listar procedimentos de uma guia usando numeroGuiaPrestador
  // GET /api/v1/guides/:numeroGuiaPrestador/procedures
  getProcedures: (numeroGuiaPrestador: string) =>
    apiClient.get<ApiResponse<GuiaProcedure[]>>(`${API_CONFIG.endpoints.guias}/${numeroGuiaPrestador}/procedures`),

  // Detalhar um procedimento específico
  // GET /api/v1/guides/procedures/:procedureId
  getProcedureById: (procedureId: string) =>
    apiClient.get<ApiResponse<GuiaProcedure>>(`${API_CONFIG.endpoints.guiaProcedimentos}/${procedureId}`),

  updateProcedureStatus: async (procedimentoId: string, status: 'PENDING' | 'APPROVED' | 'REJECTED', guiaId?: number) => {
    // Usar o novo endpoint do ms-audit para aprovar/rejeitar
    const endpoint = status === 'APPROVED' 
      ? `${API_CONFIG.endpoints.procedureApproval}/${procedimentoId}/approve`
      : status === 'REJECTED'
      ? `${API_CONFIG.endpoints.procedureApproval}/${procedimentoId}/reject`
      : `${API_CONFIG.endpoints.guiaProcedimentos}/${procedimentoId}`;
    
    const method = status === 'PENDING' ? 'put' : 'post';
    const data = status === 'PENDING' 
      ? { status }
      : { 
          guiaId: guiaId,
          auditorId: 'demo-auditor', // TODO: pegar do contexto de autenticação
          observacoes: status === 'APPROVED' ? 'Aprovado pelo auditor' : 'Rejeitado pelo auditor'
        };
    
    console.log('updateProcedureStatus:', { endpoint, method, data, procedimentoId, status, guiaId });
    
    return method === 'put'
      ? apiClient.put<ApiResponse<any>>(endpoint, data)
      : apiClient.post<ApiResponse<any>>(endpoint, data);
  },
  
  // Validar procedimento
  validateProcedimento: (procedimentoId: number, guiaId: number, operadoraId: string) =>
    apiClient.post<ApiResponse<any>>(`${API_CONFIG.endpoints.procedureValidation}/${procedimentoId}`, {
      guiaId,
      operadoraId
    }),
  
  // Validar guia inteira
  validateGuia: (guiaId: number, operadoraId: string) =>
    apiClient.post<ApiResponse<any>>(`${API_CONFIG.endpoints.procedureValidation}-guia/${guiaId}`, {
      operadoraId
    }),
  
  // Aprovar guia inteira
  approveGuiaInteira: (guiaId: number, auditorId: string) =>
    apiClient.post<ApiResponse<any>>(`${API_CONFIG.endpoints.procedureApproval}/guia/${guiaId}/approve-all`, {
      auditorId
    }),
  
  // Obter status da guia
  getGuiaStatus: (guiaId: number) =>
    apiClient.get<ApiResponse<any>>(`${API_CONFIG.endpoints.procedureApproval}/guia/${guiaId}/status`),
  
  // Atualizar status da guia (PENDING, APPROVED, FINALIZED)
  updateGuideStatus: (numeroGuiaPrestador: string, status: 'PENDING' | 'APPROVED' | 'FINALIZED') =>
    apiClient.put<ApiResponse<any>>(`${API_CONFIG.endpoints.guias}/${numeroGuiaPrestador}/status`, { status }),
};

// Serviço de Upload
/*export const uploadService = {
  uploadTissXml: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient.post<ApiResponse<any>>(`http://48.223.187.209/xmlimporter/api/upload`, formData);
    //return apiClient.post<ApiResponse<any>>(`${API_CONFIG.endpoints.patients}/upload-tiss`, formData);
  }
};*/

export const uploadService = {

  uploadTissXml: async (file: File): Promise<ApiResponse<any> | null> => {

    console.info(`[uploadService] Iniciando upload do arquivo TISS: ${file.name}`);

    const formData = new FormData();
    formData.append('file', file);

    try {
      // Aguarda a resposta completa da API
      const response = await apiClient.post<ApiResponse<any>>(
        `https://lazarusapi.azure-api.net/xmlimporter/upload`,
        formData
      );

      // Trata o caso de 204 No Content
      if (response.status === 204) {
        console.info(`[uploadService] Upload bem-sucedido (204 No Content), arquivo: ${file.name}`);
        return null; // Retorna null para indicar sucesso sem conteúdo
      }

      // Trata outros casos de sucesso (ex: 200 OK, 201 Created)
      console.info(`[uploadService] Upload bem-sucedido (Status ${response.status}), arquivo: ${file.name}`);
      return response.data; // Retorna o corpo da resposta

    } catch (error) {
      // Loga o erro em caso de falha
      console.error(`[uploadService] Falha no upload do arquivo ${file.name}:`, error);
      throw error; // Propaga o erro para o chamador (ex: componente da UI)
    }
  }
};

// Health check para microsserviços
export const healthService = {
  checkMicroservices: async () => {
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
