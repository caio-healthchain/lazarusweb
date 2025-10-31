import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { AccountInfo } from '@azure/msal-browser';
import { UserRole } from '@/config/auth';
import {
  generateDemoToken,
  decodeToken,
  isTokenExpired,
  shouldRenewToken,
} from '@/utils/jwtGenerator';

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
  
  // Demo login (async)
  loginDemo: () => Promise<void>;
  // Renew token if necessary (demo flow)
  renewToken: (expiresInHours?: number) => Promise<string | null>;
  // Returns a valid token, renewing it if needed. Returns null if not authenticated/expired.
  getValidAccessToken: () => Promise<string | null>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
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
        accessToken: null,
      }),

      loginDemo: async () => {
        const demoUser: User = {
          id: 'test-admin-123',
          name: 'Dr. João Silva',
          email: 'admin@lazarus.com',
          roles: ['admin', 'auditor'],
          avatar: undefined,
        };

        // Gerar token com HMAC-SHA256 real
        const demoToken = await generateDemoToken(24); // Token válido por 24 horas

        set({
          isAuthenticated: true,
          user: demoUser,
          accessToken: demoToken,
          isLoading: false,
        });

        console.log('✅ Login demo realizado com sucesso');
        console.log('🔐 Token JWT válido gerado com HMAC-SHA256');
      },

      // Renova o token demo se necessário (apenas fluxo demo)
      renewToken: async (expiresInHours: number = 24) => {
        const token = get().accessToken;
        if (!token) return null;

        // Se já expirou, fazer logout
        if (isTokenExpired(token)) {
          console.warn('Token expirado — realizando logout');
          get().logout();
          return null;
        }

        // Renovar apenas se estiver perto de expirar
        if (!shouldRenewToken(token)) {
          return token;
        }

        const newToken = await generateDemoToken(expiresInHours);
        set({ accessToken: newToken });
        console.log('🔁 Token renovado com sucesso');
        return newToken;
      },

      // Retorna um token válido: renova automaticamente se necessário.
      getValidAccessToken: async () => {
        const token = get().accessToken;
        if (!token) return null;

        if (isTokenExpired(token)) {
          console.warn('Token expirado — realizando logout');
          get().logout();
          return null;
        }

        if (shouldRenewToken(token)) {
          return await get().renewToken();
        }

        return token;
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

// --- Hydration / validação inicial do token persistido ---
// Ao carregar o app, verificar se o token armazenado ainda é válido. Se estiver expirado,
// limpa o storage para evitar estado inválido.
try {
  const raw = localStorage.getItem('lazarus-auth-storage');
  if (raw) {
    const parsed = JSON.parse(raw) as any;
    const token: string | undefined = parsed?.state?.accessToken ?? parsed?.accessToken;
    if (token) {
      if (isTokenExpired(token)) {
        console.warn('Token persistido expirado — limpando storage');
        localStorage.removeItem('lazarus-auth-storage');
      } else {
        // preenche dados mínimos do usuário a partir do payload se não existir
        const payload = decodeToken(token);
        if (payload) {
          const store = useAuthStore.getState();
          if (!store.user) {
            useAuthStore.setState({
              isAuthenticated: true,
              user: {
                id: payload.userId,
                name: payload.email.split('@')[0],
                email: payload.email,
                roles: [payload.role as UserRole],
              },
              accessToken: token,
            });
          }
        }
      }
    }
  }
} catch (e) {
  console.error('Erro ao validar token persistido:', e);
}

