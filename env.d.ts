/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_QLIT_BASE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
