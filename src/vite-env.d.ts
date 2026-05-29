/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_TERMINOLOGY_API_BASE_URL?: string;
  readonly VITE_TERMINOLOGY_DEMO_MODE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
