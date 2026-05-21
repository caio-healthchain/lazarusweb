import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';

export const useTokenRenewal = () => {
  const { accessToken, refreshSession, getValidAccessToken, logout } = useAuthStore();

  useEffect(() => {
    if (!accessToken) return;

    let mounted = true;

    const validateSession = async () => {
      try {
        const validToken = await getValidAccessToken();
        if (mounted && !validToken) {
          await logout({ remote: false });
        }
      } catch (error) {
        console.warn('Falha ao validar sessão:', error);
        if (mounted) await logout({ remote: false });
      }
    };

    validateSession();

    const interval = setInterval(async () => {
      try {
        await refreshSession();
      } catch (error) {
        console.warn('Falha ao renovar token:', error);
        await logout({ remote: false });
      }
    }, 5 * 60 * 1000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [accessToken, refreshSession, getValidAccessToken, logout]);
};
