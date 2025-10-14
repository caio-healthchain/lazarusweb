/**
 * Gerador de Token JWT para Autenticação Demo
 * Usa Web Crypto API para gerar assinatura HMAC-SHA256 compatível com o backend
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
 * Secret usado no serviço (mesmo do .env do backend)
 * IMPORTANTE: Em produção, isso deve vir de variável de ambiente
 */
const JWT_SECRET = 'your-super-secret-jwt-key-change-this-in-production';

/**
 * Converte ArrayBuffer para base64url (formato JWT)
 */
const arrayBufferToBase64Url = (buffer: ArrayBuffer): string => {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  const base64 = btoa(binary);
  return base64
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
};

/**
 * Converte string para base64url (formato JWT)
 */
const stringToBase64Url = (str: string): string => {
  const base64 = btoa(unescape(encodeURIComponent(str)));
  return base64
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
};

/**
 * Gera assinatura HMAC-SHA256 usando Web Crypto API
 */
const generateHmacSignature = async (data: string, secret: string): Promise<string> => {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);
  const messageData = encoder.encode(data);

  // Importar a chave
  const key = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  // Gerar assinatura
  const signature = await crypto.subtle.sign('HMAC', key, messageData);
  
  return arrayBufferToBase64Url(signature);
};

/**
 * Gera um token JWT válido para o usuário demo
 * Usa HMAC-SHA256 real, compatível com o backend
 * 
 * @param expiresInHours Tempo de expiração em horas (padrão: 24h)
 * @returns Promise com o token JWT assinado
 */
export const generateDemoToken = async (expiresInHours: number = 24): Promise<string> => {
  const now = Math.floor(Date.now() / 1000);
  
  const header = {
    alg: 'HS256',
    typ: 'JWT'
  };

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

  const encodedHeader = stringToBase64Url(JSON.stringify(header));
  const encodedPayload = stringToBase64Url(JSON.stringify(payload));
  const dataToSign = `${encodedHeader}.${encodedPayload}`;
  
  const signature = await generateHmacSignature(dataToSign, JWT_SECRET);
  const token = `${dataToSign}.${signature}`;
  
  console.log('🔐 Token JWT gerado (HMAC-SHA256):', {
    userId: payload.userId,
    email: payload.email,
    role: payload.role,
    expiresAt: new Date(payload.exp * 1000).toISOString(),
    validFor: `${expiresInHours} horas`,
  });

  return token;
};

/**
 * Versão síncrona - usa generateDemoToken internamente mas retorna string vazia temporariamente
 * O token real será gerado de forma assíncrona
 */
export const generateDemoTokenSync = (expiresInHours: number = 24): string => {
  console.warn('⚠️ generateDemoTokenSync está deprecated');
  console.warn('💡 Use await generateDemoToken() para token válido');
  
  // Gerar token assíncrono em background
  generateDemoToken(expiresInHours).then(token => {
    console.log('✅ Token gerado:', token);
  });
  
  // Retornar token temporário (será substituído pelo async)
  return 'generating...';
};

/**
 * Decodifica a parte base64url do JWT
 */
const base64urlDecode = (str: string): string => {
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

    const payload = JSON.parse(base64urlDecode(parts[1]));
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

