/// <reference types="vite/client" />

export interface ImportMetaEnv {
  // Vite built-in variables
  readonly BASE_URL: string;
  readonly DEV: boolean;
  readonly MODE: string;
  readonly PROD: boolean;
  readonly SSR: boolean;

  // Custom environment variables
  readonly VITE_BASE_PATH: string;

  // Add more custom variables here following the VITE_ prefix convention
  // Example:
  // readonly VITE_API_URL: string;
  // readonly VITE_API_KEY: string;
}

declare global {
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}
