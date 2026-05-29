import { createContext, ReactNode, useContext, useEffect, useMemo } from 'react';
import { useAuthStore } from '@/store/authStore';
import { UserRole } from '@/config/auth';

interface AuthContextValue {
  usuario: ReturnType<typeof useAuthStore.getState>['user'];
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => ReturnType<ReturnType<typeof useAuthStore.getState>['login']>;
  logout: ReturnType<typeof useAuthStore.getState>['logout'];
  hasRole: (role: UserRole | UserRole[]) => boolean;
  hasPermission: (permission: string) => boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const {
    user,
    isAuthenticated,
    isLoading,
    accessToken,
    login,
    logout,
    loadAuthenticatedUser,
    hasRole,
    hasPermission,
  } = useAuthStore();

  useEffect(() => {
    if (!accessToken || !isAuthenticated) return;

    loadAuthenticatedUser().catch((error) => {
      console.warn('Não foi possível reidratar a sessão autenticada:', error);
    });
  }, [accessToken, isAuthenticated, loadAuthenticatedUser]);

  const value = useMemo<AuthContextValue>(() => ({
    usuario: user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    hasRole,
    hasPermission,
  }), [user, isAuthenticated, isLoading, login, logout, hasRole, hasPermission]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth deve ser utilizado dentro de AuthProvider.');
  }

  return context;
};
