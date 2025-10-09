import { create } from 'zustand';
import { AccountInfo } from '@azure/msal-browser';
import { UserRole } from '@/config/auth';

interface User {
  id: string;
  name: string;
  email: string;
  roles: UserRole[];
  avatar?: string;
}

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  accessToken: string | null;
  
  // Actions
  setAuthenticated: (authenticated: boolean) => void;
  setLoading: (loading: boolean) => void;
  setUser: (user: User | null) => void;
  setAccessToken: (token: string | null) => void;
  logout: () => void;
  
  // Demo login
  loginDemo: () => void;
}

// Carregar estado inicial do localStorage
const loadInitialState = () => {
  try {
    const storedAuth = localStorage.getItem('lazarus_auth');
    if (storedAuth) {
      const parsed = JSON.parse(storedAuth);
      return {
        isAuthenticated: parsed.isAuthenticated || false,
        user: parsed.user || null,
        accessToken: parsed.accessToken || null,
        isLoading: false,
      };
    }
  } catch (error) {
    console.error('Erro ao carregar autenticação:', error);
  }
  return {
    isAuthenticated: false,
    isLoading: false,
    user: null,
    accessToken: null,
  };
};

export const useAuthStore = create<AuthState>((set) => ({
  ...loadInitialState(),

  setAuthenticated: (authenticated) => {
    set({ isAuthenticated: authenticated });
    const current = useAuthStore.getState();
    localStorage.setItem('lazarus_auth', JSON.stringify({
      isAuthenticated: authenticated,
      user: current.user,
      accessToken: current.accessToken,
    }));
  },
  
  setLoading: (loading) => set({ isLoading: loading }),
  
  setUser: (user) => {
    set({ user });
    const current = useAuthStore.getState();
    localStorage.setItem('lazarus_auth', JSON.stringify({
      isAuthenticated: current.isAuthenticated,
      user,
      accessToken: current.accessToken,
    }));
  },
  
  setAccessToken: (token) => {
    set({ accessToken: token });
    const current = useAuthStore.getState();
    localStorage.setItem('lazarus_auth', JSON.stringify({
      isAuthenticated: current.isAuthenticated,
      user: current.user,
      accessToken: token,
    }));
  },
  
  logout: () => {
    set({ 
      isAuthenticated: false, 
      user: null, 
      accessToken: null 
    });
    localStorage.removeItem('lazarus_auth');
  },

  loginDemo: () => {
    const demoUser: User = {
      id: 'test-admin-123',
      name: 'Dr. João Silva',
      email: 'admin@lazarus.com',
      roles: ['admin', 'auditor'],
      avatar: undefined,
    };
    
    // Gerar token JWT dinamicamente (versão síncrona)
    const { generateDemoTokenSync } = require('@/utils/jwtGenerator');
    const demoToken = generateDemoTokenSync(24); // Token válido por 24 horas
    
    const authState = {
      isAuthenticated: true,
      user: demoUser,
      accessToken: demoToken,
      isLoading: false,
    };
    
    set(authState);
    
    // Persistir no localStorage
    localStorage.setItem('lazarus_auth', JSON.stringify({
      isAuthenticated: true,
      user: demoUser,
      accessToken: demoToken,
    }));
    
    console.log('✅ Login demo realizado com sucesso');
    console.log('🔐 Token gerado e válido por 24 horas');
  },
}));
