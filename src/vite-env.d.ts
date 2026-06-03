/// <reference types="vite/client" />
/// <reference types="virtual:serwist" />
/// <reference lib="webworker" />

// biome-ignore lint/correctness/noUnusedVariables: needed for ENV type safety
interface ImportMetaEnv {
  readonly DEVUTILS_SW_REFRESH_INTERVAL_MS: string;
  readonly DEVUTILS_SW_UPDATE_ON_LOAD_WINDOW_MS: string;
}
