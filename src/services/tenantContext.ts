import { useAuthStore } from '@/store/authStore';

export interface ActiveTenantContext {
  hospitalId?: string;
  hospitalCode?: string;
  hospitalName?: string;
  tenantId?: string;
}

const stringFromContext = (value: unknown): string | undefined => {
  if (typeof value !== 'string') return undefined;
  const trimmed = value.trim();
  return trimmed.length ? trimmed : undefined;
};

export const getActiveTenantContext = (): ActiveTenantContext => {
  const { selectedHospital, tokenContext } = useAuthStore.getState();
  const context = (tokenContext || {}) as Record<string, unknown>;

  const hospitalId = selectedHospital?.id
    || stringFromContext(context.hospitalId)
    || stringFromContext(context.hospital_id)
    || stringFromContext(context.activeHospitalId)
    || stringFromContext(context.active_hospital_id);

  const tenantId = stringFromContext(context.tenantId)
    || stringFromContext(context.tenant_id)
    || hospitalId;

  return {
    hospitalId,
    hospitalCode: selectedHospital?.code || stringFromContext(context.hospitalCode) || stringFromContext(context.hospital_code),
    hospitalName: selectedHospital?.name || stringFromContext(context.hospitalName) || stringFromContext(context.hospital_name),
    tenantId,
  };
};

export const getTenantHeaders = (): Record<string, string> => {
  const context = getActiveTenantContext();
  const headers: Record<string, string> = {};

  if (context.hospitalId) {
    headers['X-Hospital-Id'] = context.hospitalId;
    headers['X-Active-Hospital-Id'] = context.hospitalId;
  }

  if (context.tenantId) {
    headers['X-Tenant-Id'] = context.tenantId;
  }

  if (context.hospitalCode) {
    headers['X-Hospital-Code'] = context.hospitalCode;
  }

  return headers;
};

export const applyTenantHeaders = <THeaders extends Record<string, unknown> | undefined | null>(headers: THeaders): THeaders => {
  if (!headers) return headers;

  const tenantHeaders = getTenantHeaders();
  Object.entries(tenantHeaders).forEach(([key, value]) => {
    (headers as Record<string, unknown>)[key] = value;
  });

  return headers;
};

export const withTenantHeaders = (headers?: HeadersInit): Headers => {
  const nextHeaders = new Headers(headers);
  const tenantHeaders = getTenantHeaders();

  Object.entries(tenantHeaders).forEach(([key, value]) => {
    nextHeaders.set(key, value);
  });

  return nextHeaders;
};

export const withTenantContext = (init: RequestInit = {}): RequestInit => ({
  ...init,
  headers: withTenantHeaders(init.headers),
});
