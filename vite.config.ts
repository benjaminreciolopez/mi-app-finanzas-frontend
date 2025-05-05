import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        name: "Gestión360",
        short_name: "Gestión360",
        start_url: "/",
        display: "standalone",
        background_color: "#ffffff",
        theme_color: "#4f46e5",
        icons: [
          {
            src: "/icon_16x16.png",
            sizes: "16x16",
            type: "image/png",
          },
          {
            src: "/icon_32x32.png",
            sizes: "32x32",
            type: "image/png",
          },
          {
            src: "/icon_48x48.png",
            sizes: "48x48",
            type: "image/png",
          },
          {
            src: "/icon_64x64.png",
            sizes: "64x64",
            type: "image/png",
          },
          {
            src: "/icon_128x128.png",
            sizes: "128x128",
            type: "image/png",
          },
          {
            src: "/icon_256x256.png",
            sizes: "256x256",
            type: "image/png",
          },
          {
            src: "/icon_512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "/icon_1024x1024.png",
            sizes: "1024x1024",
            type: "image/png",
          },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
        runtimeCaching: [
          {
            urlPattern:
              /^https:\/\/mi-app-finanzas-backend\.onrender\.com\/.*$/,
            handler: "NetworkFirst",
            options: {
              cacheName: "api-cache",
              networkTimeoutSeconds: 3,
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60, // 1 hora
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
        ],
      },
    }),
  ],
});
