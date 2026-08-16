import { defineConfig } from "nitro";

export default defineConfig({
  // vercel: {
  //   // functionRules: {
  //   //   "/api/heavy-computation": {
  //   //     maxDuration: 800,
  //   //     memory: 4096,
  //   //   },
  //   //   "/api/regional": {
  //   //     regions: ["lhr1", "cdg1"],
  //   //   },
  //   //   "/api/queues/process-order": {
  //   //     experimentalTriggers: [{ type: "queue/v2beta", topic: "orders" }],
  //   //   },
  //   // },
  // },
  // preset: "vercel",
  routeRules: {
    // HTML files
    "/**/*.html": {
      headers: {
        "Cache-Control": "public, max-age=0, must-revalidate",
      },
    },

    // Service worker
    "/sw.js": {
      headers: {
        "Cache-Control": "public, max-age=0, must-revalidate",
      },
    },

    // Manifest
    "/app.webmanifest": {
      headers: {
        "Content-Type": "application/manifest+json",
      },
    },

    // Static assets
    "/assets/**": {
      headers: {
        "Cache-Control": "max-age=31536000, immutable",
      },
    },

    // Global security headers
    "/**": {
      headers: {
        "X-Content-Type-Options": "nosniff",
        "X-Frame-Options": "DENY",
        "X-XSS-Protection": "1; mode=block",
      },
    },

    "/api/chatgpt/**": {
      headers: {
        "Cache-Control": "no-store, must-revalidate",
      },
    },

    "/api/ai/**": {
      headers: {
        "Cache-Control": "no-store, must-revalidate",
      },
    },

    "/*.wasm": {
      static: true,
      headers: {
        "Content-Type": "application/wasm",
      },
    },
  },
});
