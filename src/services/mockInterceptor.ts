// Mock Interceptor - Simula todas as respostas de API
import { AxiosInstance, AxiosResponse } from 'axios';
import {
  MOCK_GUIDES,
  MOCK_PROCEDURES,
  MOCK_PATIENTS,
  MOCK_VALIDATIONS,
  MOCK_AUDIT_LOGS,
  MOCK_DASHBOARD_METRICS,
  MOCK_HOSPITAL,
  MOCK_HOSPITALS,
} from './mockData';

const MOCK_MODE = true; // Ativar/desativar modo mock

export const setupMockInterceptor = (client: AxiosInstance) => {
  if (!MOCK_MODE) return;

  client.interceptors.response.use(
    (response) => response,
    (error) => {
      const config = error.config;
      
      // Se a requisição falhou e estamos em modo mock, retornar dados mockados
      if (MOCK_MODE && error.response?.status >= 500) {
        console.log('🎭 Mock Mode: Retornando dados mockados para', config.url);
        return handleMockRequest(config);
      }

      return Promise.reject(error);
    }
  );

  // Interceptor de request para logar e potencialmente mockar
  client.interceptors.request.use((config) => {
    // Se a URL contiver /api/, podemos mockar
    if (MOCK_MODE && config.url?.includes('/api/')) {
      console.log('🎭 Mock Mode interceptado:', config.method?.toUpperCase(), config.url);
    }
    return config;
  });
};

const handleMockRequest = (config: any): Promise<AxiosResponse<any>> => {
  const url = config.url || '';
  const method = config.method?.toUpperCase() || 'GET';

  // Guias
  if (url.includes('/guias') && method === 'GET') {
    if (url.includes('/procedures')) {
      const numeroGuia = url.split('/').slice(-2, -1)[0];
      const procedures = MOCK_PROCEDURES.filter(p => p.guiaId === numeroGuia);
      return Promise.resolve({
        status: 200,
        data: { data: procedures, success: true },
        statusText: 'OK',
        headers: {},
        config,
      });
    }
    return Promise.resolve({
      status: 200,
      data: {
        data: MOCK_GUIDES,
        total: MOCK_GUIDES.length,
        page: 1,
        limit: 10,
        hasNext: false,
        hasPrev: false,
      },
      statusText: 'OK',
      headers: {},
      config,
    });
  }

  // Pacientes
  if (url.includes('/patients') && method === 'GET') {
    return Promise.resolve({
      status: 200,
      data: {
        data: MOCK_PATIENTS,
        total: MOCK_PATIENTS.length,
        page: 1,
        limit: 10,
        hasNext: false,
        hasPrev: false,
      },
      statusText: 'OK',
      headers: {},
      config,
    });
  }

  // Validações
  if (url.includes('/validations') && method === 'GET') {
    return Promise.resolve({
      status: 200,
      data: {
        data: MOCK_VALIDATIONS,
        total: MOCK_VALIDATIONS.length,
        page: 1,
        limit: 10,
        hasNext: false,
        hasPrev: false,
      },
      statusText: 'OK',
      headers: {},
      config,
    });
  }

  // Audit Logs
  if (url.includes('/audit') && method === 'GET') {
    return Promise.resolve({
      status: 200,
      data: {
        data: MOCK_AUDIT_LOGS,
        total: MOCK_AUDIT_LOGS.length,
        page: 1,
        limit: 10,
        hasNext: false,
        hasPrev: false,
      },
      statusText: 'OK',
      headers: {},
      config,
    });
  }

  // Aprovar/Rejeitar procedimentos
  if ((url.includes('/approve') || url.includes('/reject')) && (method === 'POST' || method === 'PUT')) {
    return Promise.resolve({
      status: 200,
      data: { success: true, message: 'Operação realizada com sucesso' },
      statusText: 'OK',
      headers: {},
      config,
    });
  }

  // Hospitais
  if (url.includes('/hospitals') && method === 'GET') {
    return Promise.resolve({
      status: 200,
      data: MOCK_HOSPITALS,
      statusText: 'OK',
      headers: {},
      config,
    });
  }

  // Select hospital
  if (url.includes('/select-hospital') && method === 'POST') {
    return Promise.resolve({
      status: 200,
      data: { success: true, message: 'Hospital selecionado com sucesso' },
      statusText: 'OK',
      headers: {},
      config,
    });
  }

  // Health check
  if (url.includes('/health')) {
    return Promise.resolve({
      status: 200,
      data: { status: 'online', timestamp: new Date().toISOString() },
      statusText: 'OK',
      headers: {},
      config,
    });
  }

  // Default: retornar sucesso genérico
  return Promise.resolve({
    status: 200,
    data: { success: true, data: [] },
    statusText: 'OK',
    headers: {},
    config,
  });
};

export { MOCK_MODE };
