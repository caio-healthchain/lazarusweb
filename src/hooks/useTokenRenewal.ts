/**
 * Hook para gerenciar renovação automática de token JWT
 */

import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { shouldRenewToken, getTokenExpirationInfo } from '@/utils/jwtGenerator';

/**
 * Hook que verifica periodicamente se o token precisa ser renovado
 * e o renova automaticamente quando necessário
 */
export const useTokenRenewal = () => {
  const { accessToken, setAccessToken, logout } = useAuthStore();

  useEffect(() => {
    // Verificar token a cada 5 minutos
    const interval = setInterval(() => {
      if (!accessToken) {
        return;
      }

      const expirationInfo = getTokenExpirationInfo(accessToken);

      // Se expirou, fazer logout
      if (expirationInfo.isExpired) {
        console.warn('⚠️ Token expirado, fazendo logout...');
        logout();
        return;
      }

      // Se falta menos de 1 hora, renovar
      if (shouldRenewToken(accessToken)) {
        console.log('🔄 Renovando token...');
        const { generateDemoTokenSync } = require('@/utils/jwtGenerator');
        const newToken = generateDemoTokenSync(24);
        setAccessToken(newToken);
        console.log('✅ Token renovado com sucesso');
      } else {
        console.log(`⏰ Token válido por mais ${expirationInfo.remainingHours}h ${expirationInfo.remainingMinutes}min`);
      }
    }, 5 * 60 * 1000); // 5 minutos

    // Verificação inicial
    if (accessToken) {
      const expirationInfo = getTokenExpirationInfo(accessToken);
      
      if (expirationInfo.isExpired) {
        console.warn('⚠️ Token expirado, fazendo logout...');
        logout();
      } else if (shouldRenewToken(accessToken)) {
        console.log('🔄 Token próximo da expiração, renovando...');
        const { generateDemoTokenSync } = require('@/utils/jwtGenerator');
        const newToken = generateDemoTokenSync(24);
        setAccessToken(newToken);
        console.log('✅ Token renovado com sucesso');
      }
    }

    return () => clearInterval(interval);
  }, [accessToken, setAccessToken, logout]);
};

