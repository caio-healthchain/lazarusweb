import axios from 'axios';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { API_CONFIG, UserRole } from '@/config/auth';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  roles: UserRole[];
  avatar?: string;
}

export interface AuthProfile {
  id: string;
  code: string;
  name: string;
  description?: string | null;
  allowedModules?: string[];
  permissions?: string[] | Record<string, unknown>;
}

export interface AuthHospital {
  id: string;
  code: string;
  name: string;
  subdomain?: string | null;
  customDomain?: string | null;
  logoUrl?: string | null;
  primaryColor?: string | null;
}

export interface HospitalAccess {
  hospital: AuthHospital;
  profile: AuthProfile;
}

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn?: number;
  user: Omit<AuthUser, 'roles'> & { roles?: UserRole[] };
  hospitals: HospitalAccess[];
}

interface SelectHospitalResponse {
  redirectUrl?: string;
  hospital: AuthHospital;
  profiles: AuthProfile[];
  contextToken?: string;
  accessToken?: string;
}

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  hospitals: HospitalAccess[];
  selectedHospital: AuthHospital | null;
  selectedProfiles: AuthProfile[];
  tokenContext: Record<string, unknown> | null;

  setAuthenticated: (authenticated: boolean) => void;
  setLoading: (loading: boolean) => void;
  setUser: (user: AuthUser | null) => void;
  setAccessToken: (token: string | null) => void;
  setRefreshToken: (token: string | null) => void;
  setHospitals: (hospitals: HospitalAccess[]) => void;
  setSelectedHospital: (hospital: AuthHospital | null, profiles?: AuthProfile[]) => void;
  login: (email: string, password: string) => Promise<LoginResponse>;
  loadAuthenticatedUser: () => Promise<void>;
  selectHospital: (hospitalId: string) => Promise<SelectHospitalResponse>;
  refreshSession: () => Promise<string | null>;
  logout: (options?: { remote?: boolean }) => Promise<void> | void;
  getValidAccessToken: () => Promise<string | null>;
  hasRole: (role: UserRole | UserRole[]) => boolean;
  hasPermission: (permission: string) => boolean;
}

const authEndpoint = (path: string) => `${API_CONFIG.authBaseUrl}${path}`;

const decodeJwtPayload = (token: string | null): any | null => {
  if (!token) return null;

  try {
    const payload = token.split('.')[1];
    if (!payload) return null;

    const normalizedPayload = payload.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(normalizedPayload)
        .split('')
        .map((char) => `%${(`00${char.charCodeAt(0).toString(16)}`).slice(-2)}`)
        .join('')
    );

    return JSON.parse(jsonPayload);
  } catch (error) {
    console.warn('Não foi possível decodificar o JWT persistido:', error);
    return null;
  }
};

const isTokenExpired = (token: string | null, leewaySeconds = 30) => {
  const payload = decodeJwtPayload(token);
  if (!payload?.exp) return false;
  return Date.now() >= (payload.exp - leewaySeconds) * 1000;
};

const shouldRefreshToken = (token: string | null, thresholdSeconds = 60 * 60) => {
  const payload = decodeJwtPayload(token);
  if (!payload?.exp) return false;
  return Date.now() >= (payload.exp - thresholdSeconds) * 1000;
};

const BACKEND_ROLE_MAP: Record<string, UserRole> = {
  ADMIN: 'admin',
  TENANT_ADMIN: 'admin',
  DIRETOR: 'diretor',
  MEDICO: 'medico',
  MÉDICO: 'medico',
  ENFERMEIRO: 'enfermeiro',
  ANALISTA: 'analista',
  AUDITOR: 'auditor',
  GERENCIAL: 'gerencial',
};

export const toUserRole = (code?: string | null): UserRole | null => {
  if (!code) return null;

  const normalized = code.trim().toUpperCase();
  return BACKEND_ROLE_MAP[normalized] || (code.trim().toLowerCase() as UserRole);
};

const normalizeRolesFromHospitals = (hospitals: HospitalAccess[] = []): UserRole[] => {
  const roleSet = new Set<UserRole>();

  hospitals.forEach((entry) => {
    const profileCode = toUserRole(entry?.profile?.code);
    if (profileCode) roleSet.add(profileCode);
  });

  if (roleSet.size === 0) roleSet.add('auditor');
  return Array.from(roleSet);
};

const normalizeUser = (user: LoginResponse['user'], hospitals: HospitalAccess[]): AuthUser => ({
  id: user.id,
  name: user.name,
  email: user.email,
  avatar: user.avatar,
  roles: user.roles?.length ? user.roles.map((role) => toUserRole(role)).filter(Boolean) as UserRole[] : normalizeRolesFromHospitals(hospitals),
});

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      isLoading: false,
      user: null,
      accessToken: null,
      refreshToken: null,
      hospitals: [],
      selectedHospital: null,
      selectedProfiles: [],
      tokenContext: null,

      setAuthenticated: (authenticated) => set({ isAuthenticated: authenticated }),
      setLoading: (loading) => set({ isLoading: loading }),
      setUser: (user) => set({ user }),
      setAccessToken: (token) => set({ accessToken: token, tokenContext: decodeJwtPayload(token) }),
      setRefreshToken: (token) => set({ refreshToken: token }),
      setHospitals: (hospitals) => set({ hospitals }),
      setSelectedHospital: (hospital, profiles = []) => set({ selectedHospital: hospital, selectedProfiles: profiles }),

      login: async (email, password) => {
        set({ isLoading: true });

        try {
          const response = await axios.post<LoginResponse>(authEndpoint(API_CONFIG.endpoints.auth.login), {
            email: email.trim().toLowerCase(),
            password,
          });

          const { accessToken, refreshToken, user, hospitals } = response.data;

          set({
            isAuthenticated: true,
            user: normalizeUser(user, hospitals),
            accessToken,
            refreshToken,
            hospitals,
            selectedHospital: null,
            selectedProfiles: [],
            tokenContext: decodeJwtPayload(accessToken),
            isLoading: false,
          });

          return response.data;
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      loadAuthenticatedUser: async () => {
        const token = await get().getValidAccessToken();
        if (!token) return;


        const response = await axios.get(authEndpoint(API_CONFIG.endpoints.auth.me), {
          headers: { Authorization: `Bearer ${token}` },
        });

        const hospitals = response.data?.hospitals || [];
        const currentUser = response.data?.user;
        const tokenContext = response.data?.tokenContext || decodeJwtPayload(token);

        set({
          user: currentUser ? normalizeUser(currentUser, hospitals) : get().user,
          hospitals,
          tokenContext,
          isAuthenticated: true,
        });
      },

      selectHospital: async (hospitalId) => {
        const token = await get().getValidAccessToken();
        if (!token) throw new Error('Sessão expirada. Faça login novamente.');


        const response = await axios.post<SelectHospitalResponse>(
          authEndpoint(API_CONFIG.endpoints.auth.selectHospital),
          { hospitalId },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const { hospital, profiles, contextToken, accessToken } = response.data;
        const tokenToPersist = contextToken || accessToken || token;

        set({
          accessToken: tokenToPersist,
          selectedHospital: hospital,
          selectedProfiles: profiles || [],
          tokenContext: decodeJwtPayload(tokenToPersist),
          isAuthenticated: true,
        });

        return response.data;
      },

      refreshSession: async () => {
        const refreshToken = get().refreshToken;
        if (!refreshToken || isTokenExpired(refreshToken, 0)) {
          get().logout({ remote: false });
          return null;
        }


        try {
          const response = await axios.post(authEndpoint(API_CONFIG.endpoints.auth.refresh), { refreshToken });
          const newAccessToken = response.data?.accessToken;
          const newRefreshToken = response.data?.refreshToken || refreshToken;

          if (!newAccessToken) throw new Error('Refresh sem accessToken');

          set({
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
            tokenContext: decodeJwtPayload(newAccessToken),
            isAuthenticated: true,
          });

          return newAccessToken;
        } catch (error) {
          console.warn('Falha ao renovar sessão:', error);
          get().logout({ remote: false });
          return null;
        }
      },

      logout: async (options = { remote: true }) => {
        const token = get().accessToken;

        if (options.remote && token && !isTokenExpired(token, 0)) {
          try {
            await axios.post(
              authEndpoint(API_CONFIG.endpoints.auth.logout),
              {},
              { headers: { Authorization: `Bearer ${token}` } }
            );
          } catch (error) {
            console.warn('Logout remoto não confirmado; limpando sessão local:', error);
          }
        }

        set({
          isAuthenticated: false,
          user: null,
          accessToken: null,
          refreshToken: null,
          hospitals: [],
          selectedHospital: null,
          selectedProfiles: [],
          tokenContext: null,
          isLoading: false,
        });
      },

      getValidAccessToken: async () => {
        const token = get().accessToken;

        if (!token) return null;

        if (isTokenExpired(token)) {
          return get().refreshSession();
        }

        if (shouldRefreshToken(token)) {
          return get().refreshSession();
        }

        return token;
      },

      hasRole: (role) => {
        const requiredRoles = Array.isArray(role) ? role : [role];
        const userRoles = get().user?.roles || [];
        return requiredRoles.some((requiredRole) => userRoles.includes(requiredRole));
      },

      hasPermission: (permission) => {
        const profiles = get().selectedProfiles.length
          ? get().selectedProfiles
          : get().hospitals.map((entry) => entry.profile).filter(Boolean);

        return profiles.some((profile) => {
          const permissions = profile.permissions;

          if (Array.isArray(permissions)) {
            return permissions.includes(permission);
          }

          if (permissions && typeof permissions === 'object') {
            return Boolean((permissions as Record<string, unknown>)[permission]);
          }

          return false;
        });
      },
    }),
    {
      name: 'lazarus-auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        hospitals: state.hospitals,
        selectedHospital: state.selectedHospital,
        selectedProfiles: state.selectedProfiles,
        tokenContext: state.tokenContext,
      }),
    }
  )
);

try {
  const raw = localStorage.getItem('lazarus-auth-storage');
  if (raw) {
    const parsed = JSON.parse(raw) as any;
    const token: string | undefined = parsed?.state?.accessToken;
    const refreshToken: string | undefined = parsed?.state?.refreshToken;

    if ((token && isTokenExpired(token, 0)) && (!refreshToken || isTokenExpired(refreshToken, 0))) {
      localStorage.removeItem('lazarus-auth-storage');
    }
  }
} catch (error) {
  console.error('Erro ao validar sessão persistida:', error);
}
