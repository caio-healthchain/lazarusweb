import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { AccountInfo } from '@azure/msal-browser';
import { UserRole } from '@/config/auth';
import { generateDemoTokenSync } from '@/utils/jwtGenerator';

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

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
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
        
        const demoToken = generateDemoTokenSync(24); // Token válido por 24 horas
        
        set({ 
          isAuthenticated: true,
          user: demoUser,
          accessToken: demoToken,
          isLoading: false,
        });
        
        console.log('✅ Login demo realizado com sucesso');
        console.log('🔐 Token gerado e válido por 24 horas');
      },
    }),
    {
      name: 'lazarus-auth-storage', // Nome único no localStorage
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        accessToken: state.accessToken,
        // Não persistir isLoading
      }),
    }
  )
);

