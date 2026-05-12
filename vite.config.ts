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
    nitro(),
    tailwindcss(),
    viteReact(),
  ],
  server: {
    host: true,
  },
  build: {
    outDir: ".output",
  },
});

export default config;
