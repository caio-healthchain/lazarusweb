import axios, { AxiosInstance } from 'axios';
import { API_CONFIG } from '@/config/auth';
import { useAuthStore } from '@/store/authStore';
import { applyTenantHeaders } from '@/services/tenantContext';

export type RecordStatus = 'ACTIVE' | 'INACTIVE' | 'DRAFT' | 'RETIRED';
export type ItemCategory = 'PROCEDURE' | 'MATERIAL' | 'MEDICATION' | 'DAILY_RATE' | 'FEE' | 'PACKAGE' | 'OPME' | 'OTHER';
export type ItemGranularity = 'GROUP' | 'ITEM' | 'VARIANT' | 'PRESENTATION';
export type TerminologyKind = 'NATIONAL' | 'OPERATOR' | 'HOSPITAL' | 'INTERNAL' | 'COMMERCIAL';
export type CodeRelationshipType = 'PRIMARY' | 'EQUIVALENT' | 'NARROWER' | 'BROADER' | 'LEGACY' | 'BILLING';

export interface CodeSystem {
  id: string;
  tenantId?: string;
  hospitalId?: string;
  slug: string;
  name: string;
  version: string;
  kind: TerminologyKind;
  authority?: string;
  description?: string;
  status: RecordStatus;
  effectiveFrom?: string;
  effectiveTo?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface TerminologyCode {
  id: string;
  codeSystemId: string;
  code: string;
  display: string;
  normalizedDisplay?: string;
  category: ItemCategory;
  granularity: ItemGranularity;
  status: RecordStatus;
  effectiveFrom?: string;
  effectiveTo?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ItemCode {
  id: string;
  terminologyCodeId: string;
  code: string;
  display: string;
  codeSystemId: string;
  codeSystemSlug: string;
  relationshipType: CodeRelationshipType;
  priority?: number;
  confidence?: number;
  effectiveFrom?: string;
  effectiveTo?: string;
}

export interface ItemAlias {
  id: string;
  alias: string;
  normalizedAlias?: string;
  source?: string;
  status: RecordStatus;
  confidence?: number;
}

export interface CanonicalItem {
  id: string;
  tenantId?: string;
  hospitalId?: string;
  name: string;
  normalizedName?: string;
  category: ItemCategory;
  granularity: ItemGranularity;
  status: RecordStatus;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
  codes: ItemCode[];
  aliases: ItemAlias[];
}

export interface CreateCodeSystemRequest {
  slug: string;
  name: string;
  version: string;
  kind: TerminologyKind;
  authority?: string;
  description?: string;
  status?: RecordStatus;
  effectiveFrom?: string;
  effectiveTo?: string;
}

export interface CreateCanonicalItemRequest {
  name: string;
  category: ItemCategory;
  granularity: ItemGranularity;
  status?: RecordStatus;
  description?: string;
}

export interface AddItemAliasRequest {
  alias: string;
  source?: string;
  status?: RecordStatus;
  confidence?: number;
}

export interface TerminologyListParams {
  q?: string;
  status?: RecordStatus;
  category?: ItemCategory;
}

const TERMINOLOGY_DEMO_MODE = import.meta.env.VITE_TERMINOLOGY_DEMO_MODE !== 'false';
const TERMINOLOGY_BASE_URL = import.meta.env.VITE_TERMINOLOGY_API_BASE_URL || `${API_CONFIG.baseUrl}/terminology`;
const delay = (ms = 250) => new Promise(resolve => setTimeout(resolve, ms));

const createTerminologyClient = (): AxiosInstance => {
  const client = axios.create({
    baseURL: TERMINOLOGY_BASE_URL,
    timeout: 30000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  client.interceptors.request.use((config) => {
    const { accessToken } = useAuthStore.getState();
    const apiKey = import.meta.env.VITE_API_KEY;

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    applyTenantHeaders(config.headers);

    if (apiKey) {
      config.headers['X-API-Key'] = apiKey;
    }

    return config;
  });

  client.interceptors.response.use(
    response => response,
    error => {
      if (error.response?.status === 401) {
        const { logout } = useAuthStore.getState();
        logout({ remote: false });
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }
  );

  return client;
};

const terminologyClient = createTerminologyClient();

const MOCK_CODE_SYSTEMS: CodeSystem[] = [
  {
    id: 'cs-tuss-2025',
    slug: 'tuss-2025',
    name: 'TUSS Procedimentos',
    version: '2025.01',
    kind: 'NATIONAL',
    authority: 'ANS',
    description: 'Terminologia nacional para procedimentos e eventos em saúde usada como base de interoperabilidade.',
    status: 'ACTIVE',
    effectiveFrom: '2025-01-01',
  },
  {
    id: 'cs-cbhpm-2024',
    slug: 'cbhpm-2024',
    name: 'CBHPM',
    version: '2024',
    kind: 'COMMERCIAL',
    authority: 'AMB',
    description: 'Tabela de referência para porte, honorários e análise comparativa de procedimentos médicos.',
    status: 'ACTIVE',
    effectiveFrom: '2024-01-01',
  },
  {
    id: 'cs-hc-interno',
    slug: 'hc-procedimentos',
    name: 'Catálogo interno hospitalar',
    version: '1.0',
    kind: 'HOSPITAL',
    authority: 'Hospital ativo',
    description: 'Códigos internos usados para conciliar descrições operacionais do hospital com códigos oficiais.',
    status: 'DRAFT',
  },
];

const MOCK_CANONICAL_ITEMS: CanonicalItem[] = [
  {
    id: 'ci-apendicectomia-video',
    name: 'Apendicectomia videolaparoscópica',
    normalizedName: 'apendicectomia videolaparoscopica',
    category: 'PROCEDURE',
    granularity: 'ITEM',
    status: 'ACTIVE',
    description: 'Item canônico para conciliar solicitações, contas fechadas e contratos relacionados à apendicectomia por vídeo.',
    codes: [
      {
        id: 'ic-apend-tuss',
        terminologyCodeId: 'tc-31101192',
        code: '31101192',
        display: 'Apendicectomia videolaparoscópica',
        codeSystemId: 'cs-tuss-2025',
        codeSystemSlug: 'tuss-2025',
        relationshipType: 'PRIMARY',
        priority: 1,
        confidence: 0.98,
      },
    ],
    aliases: [
      { id: 'ia-apend-1', alias: 'Apendicectomia por vídeo', source: 'Guia XML', status: 'ACTIVE', confidence: 0.93 },
      { id: 'ia-apend-2', alias: 'Retirada de apêndice VL', source: 'Conta hospitalar', status: 'ACTIVE', confidence: 0.86 },
    ],
  },
  {
    id: 'ci-fratura-femur',
    name: 'Redução cirúrgica de fratura de fêmur',
    normalizedName: 'reducao cirurgica de fratura de femur',
    category: 'PROCEDURE',
    granularity: 'ITEM',
    status: 'ACTIVE',
    description: 'Item canônico usado na auditoria de compatibilidade entre procedimento, materiais e regras contratuais.',
    codes: [
      {
        id: 'ic-femur-tuss',
        terminologyCodeId: 'tc-31201401',
        code: '31201401',
        display: 'Tratamento cirúrgico de fratura do fêmur',
        codeSystemId: 'cs-tuss-2025',
        codeSystemSlug: 'tuss-2025',
        relationshipType: 'EQUIVALENT',
        priority: 1,
        confidence: 0.91,
      },
    ],
    aliases: [
      { id: 'ia-femur-1', alias: 'Fixação interna de fêmur', source: 'Centro cirúrgico', status: 'ACTIVE', confidence: 0.88 },
    ],
  },
  {
    id: 'ci-opme-placa-bloqueada',
    name: 'Placa bloqueada para osteossíntese',
    normalizedName: 'placa bloqueada para osteossintese',
    category: 'OPME',
    granularity: 'ITEM',
    status: 'DRAFT',
    description: 'Item em saneamento para padronizar variações de descrição de OPME em guias e notas.',
    codes: [],
    aliases: [
      { id: 'ia-opme-1', alias: 'Placa LCP', source: 'Nota fiscal', status: 'DRAFT', confidence: 0.72 },
    ],
  },
];

const filterByParams = <T extends { name: string; status: RecordStatus; category?: ItemCategory; slug?: string }>(items: T[], params?: TerminologyListParams): T[] => {
  return items.filter(item => {
    const matchesStatus = !params?.status || item.status === params.status;
    const matchesCategory = !params?.category || item.category === params.category;
    const term = params?.q?.trim().toLowerCase();
    const matchesTerm = !term || item.name.toLowerCase().includes(term) || item.slug?.toLowerCase().includes(term);
    return matchesStatus && matchesCategory && matchesTerm;
  });
};

export const terminologyService = {
  isDemoMode: () => TERMINOLOGY_DEMO_MODE,
  getBaseUrl: () => TERMINOLOGY_BASE_URL,

  async listCodeSystems(params?: Pick<TerminologyListParams, 'q' | 'status'>): Promise<CodeSystem[]> {
    if (TERMINOLOGY_DEMO_MODE) {
      await delay();
      return filterByParams(MOCK_CODE_SYSTEMS, params);
    }
    const response = await terminologyClient.get<CodeSystem[]>('/api/v1/code-systems', { params });
    return response.data;
  },

  async createCodeSystem(data: CreateCodeSystemRequest): Promise<CodeSystem> {
    if (TERMINOLOGY_DEMO_MODE) {
      await delay();
      return {
        id: `cs-${Date.now()}`,
        status: data.status || 'ACTIVE',
        ...data,
      };
    }
    const response = await terminologyClient.post<CodeSystem>('/api/v1/code-systems', data);
    return response.data;
  },

  async listCanonicalItems(params?: TerminologyListParams): Promise<CanonicalItem[]> {
    if (TERMINOLOGY_DEMO_MODE) {
      await delay();
      return filterByParams(MOCK_CANONICAL_ITEMS, params);
    }
    const response = await terminologyClient.get<CanonicalItem[]>('/api/v1/canonical-items', { params });
    return response.data;
  },

  async searchCanonicalItems(q: string): Promise<CanonicalItem[]> {
    if (TERMINOLOGY_DEMO_MODE) {
      await delay();
      const term = q.trim().toLowerCase();
      if (!term) return MOCK_CANONICAL_ITEMS;
      return MOCK_CANONICAL_ITEMS.filter(item => {
        return item.name.toLowerCase().includes(term)
          || item.description?.toLowerCase().includes(term)
          || item.codes.some(code => code.code.includes(term) || code.display.toLowerCase().includes(term))
          || item.aliases.some(alias => alias.alias.toLowerCase().includes(term));
      });
    }
    const response = await terminologyClient.get<CanonicalItem[]>('/api/v1/canonical-items/search', { params: { q } });
    return response.data;
  },

  async createCanonicalItem(data: CreateCanonicalItemRequest): Promise<CanonicalItem> {
    if (TERMINOLOGY_DEMO_MODE) {
      await delay();
      return {
        id: `ci-${Date.now()}`,
        normalizedName: data.name.toLowerCase(),
        status: data.status || 'ACTIVE',
        codes: [],
        aliases: [],
        ...data,
      };
    }
    const response = await terminologyClient.post<CanonicalItem>('/api/v1/canonical-items', data);
    return response.data;
  },

  async addAlias(canonicalItemId: string, data: AddItemAliasRequest): Promise<CanonicalItem> {
    if (TERMINOLOGY_DEMO_MODE) {
      await delay();
      const item = MOCK_CANONICAL_ITEMS.find(current => current.id === canonicalItemId) || MOCK_CANONICAL_ITEMS[0];
      return {
        ...item,
        aliases: [
          ...item.aliases,
          {
            id: `ia-${Date.now()}`,
            status: data.status || 'ACTIVE',
            confidence: data.confidence ?? 0.85,
            ...data,
          },
        ],
      };
    }
    const response = await terminologyClient.post<CanonicalItem>(`/api/v1/canonical-items/${canonicalItemId}/aliases`, data);
    return response.data;
  },
};

export const categoryLabels: Record<ItemCategory, string> = {
  PROCEDURE: 'Procedimento',
  MATERIAL: 'Material',
  MEDICATION: 'Medicamento',
  DAILY_RATE: 'Diária',
  FEE: 'Taxa',
  PACKAGE: 'Pacote',
  OPME: 'OPME',
  OTHER: 'Outro',
};

export const granularityLabels: Record<ItemGranularity, string> = {
  GROUP: 'Grupo',
  ITEM: 'Item',
  VARIANT: 'Variação',
  PRESENTATION: 'Apresentação',
};

export const statusLabels: Record<RecordStatus, string> = {
  ACTIVE: 'Ativo',
  INACTIVE: 'Inativo',
  DRAFT: 'Rascunho',
  RETIRED: 'Descontinuado',
};

export const terminologyKindLabels: Record<TerminologyKind, string> = {
  NATIONAL: 'Nacional',
  OPERATOR: 'Operadora',
  HOSPITAL: 'Hospital',
  INTERNAL: 'Interno',
  COMMERCIAL: 'Comercial',
};
