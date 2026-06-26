import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// SPA estático: sem backend, cada acesso roda isolado no navegador do fiel.
// Escala horizontalmente em qualquer CDN/Nginx — ver README e deploy/nginx.conf.
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["robots.txt", "icons/icon.svg"],
      manifest: {
        name: "Exame de Consciência",
        short_name: "Exame",
        description:
          "Exame de Consciência para uma boa confissão — Santuário Basílica Sagrada Família",
        lang: "pt-BR",
        dir: "ltr",
        display: "standalone",
        orientation: "portrait",
        background_color: "#f4ecd8",
        theme_color: "#25304f",
        categories: ["lifestyle", "education"],
        icons: [
          {
            src: "icons/icon.svg",
            sizes: "any",
            type: "image/svg+xml",
            purpose: "any",
          },
          {
            src: "icons/maskable.svg",
            sizes: "any",
            type: "image/svg+xml",
            purpose: "maskable",
          },
        ],
      },
      workbox: {
        // Precache de todo o app + fontes => funciona 100% offline.
        // Nenhum dado do usuário trafega na rede (tudo é local ao navegador).
        globPatterns: ["**/*.{js,css,html,svg,woff2}"],
        cleanupOutdatedCaches: true,
        clientsClaim: true,
      },
    }),
  ],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    css: true,
  },
});
