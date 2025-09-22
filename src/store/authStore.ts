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

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  isLoading: false,
  user: null,
  accessToken: null,

  setAuthenticated: (authenticated) => set({ isAuthenticated: authenticated }),
  
  setLoading: (loading) => set({ isLoading: loading }),
  
  setUser: (user) => set({ user }),
  
  setAccessToken: (token) => set({ accessToken: token }),
  
  logout: () => set({ 
    isAuthenticated: false, 
    user: null, 
    accessToken: null 
  }),

  loginDemo: () => {
    const demoUser: User = {
      id: 'demo-user-123',
      name: 'Dr. João Silva',
      email: 'joao.silva@hospital.com.br',
      roles: ['admin', 'auditor'],
      avatar: undefined,
    };
    
    set({ 
      isAuthenticated: true,
      user: demoUser,
      accessToken: 'demo-token-123',
      isLoading: false,
    });
  },
}));
