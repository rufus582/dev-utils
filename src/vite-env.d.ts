/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/react" />
/// <reference types="vite-plugin-pwa/info" />
/// <reference lib="webworker" />

interface ViteTypeOptions {
  strictImportMetaEnv: unknown
}

interface ImportMetaEnv {
  readonly DEVUTILS_SW_REFRESH_INTERVAL_MS: string
  readonly DEVUTILS_SW_UPDATE_ON_LOAD_WINDOW_MS: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
