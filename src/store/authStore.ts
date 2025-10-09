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
      id: 'test-admin-123',
      name: 'Dr. João Silva',
      email: 'admin@lazarus.com',
      roles: ['admin', 'auditor'],
      avatar: undefined,
    };
    
    // Token JWT real fornecido pelo usuário para testes
    const demoToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ0ZXN0LWFkbWluLTEyMyIsImVtYWlsIjoiYWRtaW5AbGF6YXJ1cy5jb20iLCJyb2xlIjoiYWRtaW4iLCJwZXJtaXNzaW9ucyI6WyJjcmVhdGU6cGF0aWVudCIsInJlYWQ6cGF0aWVudCIsInVwZGF0ZTpwYXRpZW50IiwiZGVsZXRlOnBhdGllbnQiLCJtYW5hZ2U6cGF0aWVudHMiXSwiaWF0IjoxNzU5OTcwOTY1LCJleHAiOjE3NjAwNTczNjV9.PQLTH4QszyCvt3uLb44rSdkZKNbbyFit6KT4Xl98O7g';
    
    set({ 
      isAuthenticated: true,
      user: demoUser,
      accessToken: demoToken,
      isLoading: false,
    });
  },
}));
