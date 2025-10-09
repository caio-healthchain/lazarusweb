/**
 * Gerador de Token JWT para Autenticação Demo
 * Abordagem simplificada e pragmática para ambiente de desenvolvimento
 */

interface TokenPayload {
  userId: string;
  email: string;
  role: string;
  permissions: string[];
  iat: number;
  exp: number;
}

/**
 * Gera um token JWT válido para o usuário demo
 * Usa o mesmo formato do script gerar-token-jwt.js do backend
 * 
 * NOTA: Para produção, este token deve ser gerado pelo backend após autenticação real
 */
export const generateDemoTokenSync = (expiresInHours: number = 24): string => {
  const now = Math.floor(Date.now() / 1000);
  
  const payload: TokenPayload = {
    userId: 'test-admin-123',
    email: 'admin@lazarus.com',
    role: 'admin',
    permissions: [
      'create:patient',
      'read:patient',
      'update:patient',
      'delete:patient',
      'manage:patients',
    ],
    iat: now,
    exp: now + (expiresInHours * 60 * 60),
  };

  // Criar token no formato JWT: header.payload.signature
  const header = { alg: 'HS256', typ: 'JWT' };
  
  // Base64URL encode
  const base64UrlEncode = (obj: any) => {
    const json = JSON.stringify(obj);
    const base64 = btoa(unescape(encodeURIComponent(json)));
    return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
  };

  const encodedHeader = base64UrlEncode(header);
  const encodedPayload = base64UrlEncode(payload);
  
  // Para demo, criar uma assinatura simples
  // Em produção, o backend gera isso com HMAC-SHA256 usando o secret
  const secret = 'your-super-secret-jwt-key-change-this-in-production';
  const dataToSign = `${encodedHeader}.${encodedPayload}`;
  
  // Simular assinatura (não é criptograficamente segura, apenas para demo)
  let hash = 0;
  for (let i = 0; i < dataToSign.length + secret.length; i++) {
    const char = (dataToSign + secret).charCodeAt(i % (dataToSign + secret).length);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  
  const signature = base64UrlEncode({ hash: Math.abs(hash).toString(36) });
  
  const token = `${encodedHeader}.${encodedPayload}.${signature}`;
  
  console.log('🔐 Token JWT gerado:', {
    userId: payload.userId,
    email: payload.email,
    role: payload.role,
    expiresAt: new Date(payload.exp * 1000).toISOString(),
    remainingHours: expiresInHours,
  });

  return token;
};

/**
 * Decodifica um token JWT
 */
const decodeBase64Url = (str: string): string => {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  try {
    return decodeURIComponent(escape(atob(base64)));
  } catch (e) {
    return atob(base64);
  }
};

/**
 * Decodifica um token JWT sem verificar a assinatura
 */
export const decodeToken = (token: string): TokenPayload | null => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }

    const payload = JSON.parse(decodeBase64Url(parts[1]));
    return payload as TokenPayload;
  } catch (error) {
    console.error('Erro ao decodificar token:', error);
    return null;
  }
};

/**
 * Verifica se um token JWT está expirado
 */
export const isTokenExpired = (token: string): boolean => {
  try {
    const payload = decodeToken(token);
    if (!payload || !payload.exp) {
      return true;
    }
    
    const now = Math.floor(Date.now() / 1000);
    return payload.exp < now;
  } catch (error) {
    console.error('Erro ao verificar token:', error);
    return true;
  }
};

/**
 * Verifica se um token precisa ser renovado (faltam menos de 1 hora para expirar)
 */
export const shouldRenewToken = (token: string): boolean => {
  try {
    const payload = decodeToken(token);
    if (!payload || !payload.exp) {
      return true;
    }
    
    const now = Math.floor(Date.now() / 1000);
    const oneHourInSeconds = 60 * 60;
    
    // Renovar se falta menos de 1 hora para expirar
    return (payload.exp - now) < oneHourInSeconds;
  } catch (error) {
    console.error('Erro ao verificar renovação de token:', error);
    return true;
  }
};

/**
 * Obtém informações sobre o tempo restante do token
 */
export const getTokenExpirationInfo = (token: string) => {
  try {
    const payload = decodeToken(token);
    if (!payload || !payload.exp) {
      return {
        isExpired: true,
        expiresAt: null,
        remainingHours: 0,
        remainingMinutes: 0,
      };
    }
    
    const now = Math.floor(Date.now() / 1000);
    const remainingSeconds = payload.exp - now;
    
    return {
      isExpired: remainingSeconds <= 0,
      expiresAt: new Date(payload.exp * 1000),
      remainingHours: Math.floor(remainingSeconds / 3600),
      remainingMinutes: Math.floor((remainingSeconds % 3600) / 60),
    };
  } catch (error) {
    console.error('Erro ao obter informações de expiração:', error);
    return {
      isExpired: true,
      expiresAt: null,
      remainingHours: 0,
      remainingMinutes: 0,
    };
  }
};

