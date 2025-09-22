import { Configuration, PopupRequest } from "@azure/msal-browser";

// Configuração do Azure AD
export const msalConfig: Configuration = {
  auth: {
    clientId: import.meta.env.VITE_AZURE_CLIENT_ID || "demo-client-id",
    authority: import.meta.env.VITE_AZURE_AUTHORITY || "https://login.microsoftonline.com/demo-tenant",
    redirectUri: import.meta.env.VITE_AZURE_REDIRECT_URI || "https://calm-meadow-0a9b85810.2.azurestaticapps.net/",
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
  baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://172.169.27.140/api/v1',
  endpoints: {
    // Microsserviços
    patients: '/patients',
    procedures: '/procedures', 
    billing: '/billings',
    audit: '/audits',
    aiAgents: '/aiagents',
    dialogues: '/dialogues',
    hospitals: '/hospitals',
    rag: '/rags',
    rules: '/rules',
    
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
