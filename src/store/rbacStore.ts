import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// Perfis de usuário do hospital
export type UserProfile = 
  | 'diretor'        // Vê tudo
  | 'medico'         // Frente Médica + Auditoria
  | 'enfermeiro'     // Frente Enfermagem + Auditoria
  | 'analista'       // Frente Administrativa + Glosas + Backoffice
  | 'auditor'        // Todas as frentes + Auditoria
  | 'admin';         // Tudo (equivalente a diretor)

// Módulos disponíveis
export type AppModule = 
  | 'central-contas'
  | 'frente-administrativa'
  | 'frente-enfermagem'
  | 'frente-medica'
  | 'glosas'
  | 'backoffice'
  | 'gerencial'
  | 'gerencial-chat'
  | 'auditor-legado'
  | 'analista-legado';

// Mapeamento de permissões por perfil
const PROFILE_PERMISSIONS: Record<UserProfile, AppModule[]> = {
  diretor: [
    'central-contas', 'frente-administrativa', 'frente-enfermagem', 
    'frente-medica', 'glosas', 'backoffice', 'gerencial', 'gerencial-chat',
    'auditor-legado', 'analista-legado'
  ],
  admin: [
    'central-contas', 'frente-administrativa', 'frente-enfermagem', 
    'frente-medica', 'glosas', 'backoffice', 'gerencial', 'gerencial-chat',
    'auditor-legado', 'analista-legado'
  ],
  medico: [
    'central-contas', 'frente-medica', 'glosas', 'gerencial'
  ],
  enfermeiro: [
    'central-contas', 'frente-enfermagem', 'glosas'
  ],
  analista: [
    'central-contas', 'frente-administrativa', 'glosas', 'backoffice', 
    'analista-legado'
  ],
  auditor: [
    'central-contas', 'frente-administrativa', 'frente-enfermagem', 
    'frente-medica', 'glosas', 'backoffice', 'gerencial', 'gerencial-chat',
    'auditor-legado', 'analista-legado'
  ],
};

// Rota padrão por perfil (onde cai ao logar)
const DEFAULT_ROUTES: Record<UserProfile, string> = {
  diretor: '/central-contas',
  admin: '/central-contas',
  medico: '/frente-medica',
  enfermeiro: '/frente-enfermagem',
  analista: '/frente-administrativa',
  auditor: '/central-contas',
};

// Labels amigáveis dos perfis
export const PROFILE_LABELS: Record<UserProfile, string> = {
  diretor: 'Diretor',
  admin: 'Administrador',
  medico: 'Médico Auditor',
  enfermeiro: 'Enfermeiro Auditor',
  analista: 'Analista de Contas',
  auditor: 'Auditor Geral',
};

interface RBACState {
  currentProfile: UserProfile;
  setProfile: (profile: UserProfile) => void;
  hasAccess: (module: AppModule) => boolean;
  getDefaultRoute: () => string;
  getAllowedModules: () => AppModule[];
}

export const useRBACStore = create<RBACState>()(
  persist(
    (set, get) => ({
      // Demo: perfil Diretor que vê tudo
      currentProfile: 'diretor',
      
      setProfile: (profile) => set({ currentProfile: profile }),
      
      hasAccess: (module) => {
        const profile = get().currentProfile;
        return PROFILE_PERMISSIONS[profile]?.includes(module) ?? false;
      },
      
      getDefaultRoute: () => {
        const profile = get().currentProfile;
        return DEFAULT_ROUTES[profile] || '/central-contas';
      },
      
      getAllowedModules: () => {
        const profile = get().currentProfile;
        return PROFILE_PERMISSIONS[profile] || [];
      },
    }),
    {
      name: 'lazarus-rbac-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
