import { serwist } from "@serwist/vite";
import tailwindcss from "@tailwindcss/vite";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { defineConfig, type Plugin } from "vite";

const pwaPlugins = serwist({
  swSrc: "src/lib/pwa/sw.ts",
  swDest: "public/sw.js",
  swUrl: "/sw.js",
  globDirectory: ".output/public",
  globPatterns: ["**/*.{js,css,html,ico,png,svg,webmanifest,wasm}"],
  globIgnores: ["**/*.wasm", "sw.js", "public/**"],
  maximumFileSizeToCacheInBytes: 10 * 1024 * 1024,
  integration: {
    closeBundleOrder: "post",
  },
}).map(
  (plugin): Plugin => ({
    ...plugin,
    applyToEnvironment: (environment) =>
      environment.config.consumer === "client",
  }),
);

const config = defineConfig({
  resolve: { tsconfigPaths: true },
  plugins: [
    tanstackStart(),
    devtools(),
    tailwindcss(),
    viteReact(),
    ...pwaPlugins,
    nitro(),
  ],
  server: {
    host: true,
  },
  build: {
    outDir: ".output",
  },
  define: {
    "process.env.VERCEL_ENV": JSON.stringify(process.env.VERCEL_ENV),
  },
  envPrefix: ["VITE_", "DU_", "DEVUTILS_"],
});

export default config;
