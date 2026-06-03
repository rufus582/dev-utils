import { serwist } from "@serwist/vite";
import tailwindcss from "@tailwindcss/vite";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { defineConfig } from "vite";

const config = defineConfig({
  resolve: { tsconfigPaths: true },
  plugins: [
    tanstackStart(),
    devtools(),
    tailwindcss(),
    viteReact(),
    nitro(),
    serwist({
      swSrc: "src/lib/pwa/sw.ts",
      swDest: "sw.js",
      swUrl: "/sw.js",
      globDirectory: ".output/public",
      globPatterns: ["**/*.{js,css,html,ico,png,svg,webmanifest,wasm}"],
      globIgnores: ["**/*.wasm", "sw.js"],
      maximumFileSizeToCacheInBytes: 10 * 1024 * 1024,
      integration: {
        closeBundleOrder: "post",
      },
    }),
  ],
  server: {
    host: true,
  },
  build: {
    outDir: ".output",
  },
  define: {
    "process.env.VERCEL_ENV": JSON.stringify(process.env.VERCEL_ENV),
    "process.env.APP_PWA": JSON.stringify(process.env.APP_PWA),
  },
  envPrefix: ["VITE_", "DU_", "DEVUTILS_"],
});

export default config;
