import { Configuration, PopupRequest } from "@azure/msal-browser";

// Configuração do Azure AD
export const msalConfig: Configuration = {
  auth: {
    clientId: import.meta.env.VITE_AZURE_CLIENT_ID || "24453178-1a7a-4be3-b13a-09572d629164",
    authority: import.meta.env.VITE_AZURE_AUTHORITY || "https://login.microsoftonline.com/23aa4fc5-fa33-4035-a684-909874c0b395",
    redirectUri: import.meta.env.VITE_AZURE_REDIRECT_URI || "https://lazarus.healthchainsolutions.com.br/auth/callback",
  },
  cache: {
    cacheLocation: "sessionStorage",
    storeAuthStateInCookie: false,
  },
};

// Scopes para login
export const loginRequest: PopupRequest = {
  scopes: ["User.Read", "openid", "profile"],
};

// Configuração da API
export const API_CONFIG = {
  baseUrl: import.meta.env.VITE_API_BASE_URL || 'https://lazarusapi.azure-api.net',
  endpoints: {
    // Microsserviços
    patients: '/patients/patients',
    procedures: '/procedures/procedures', 
    billing: '/billings/billings',
    audit: '/audits/audits',
    aiAgents: '/aiagents/aiagents',
    dialogues: '/dialogues/dialogues',
    hospitals: '/hospitals/hospitals',
    rag: '/rags/rags',
    rules: '/rules/rules',
  // Guias (XML importados) - endpoints adicionados para exibir guias e seus procedimentos
  guias: '/guide/guides',
  guiaProcedimentos: '/guide/guides/procedures',
    xmlImporter: '/xmlimporter/upload',
    
    // Contratos - endpoints para validação contratual
    contracts: '/contracts/contracts',
    
    // Auditoria de Procedimentos - endpoints para validação e aprovação
    procedureValidation: '/audits/procedures/validate',
    procedureApproval: '/audits/procedures',
    
    // Endpoints específicos do sistema
    validations: '/validations',
    pendencies: '/pendencies',
    materials: '/materials',
    extraPackages: '/extra-packages',
    attachments: '/attachments',
  }
};

// Configuração de roles
export const USER_ROLES = {
  ADMIN: 'admin',
  AUDITOR: 'auditor',
  MEDICO: 'medico',
  ENFERMEIRO: 'enfermeiro',
} as const;

export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];
