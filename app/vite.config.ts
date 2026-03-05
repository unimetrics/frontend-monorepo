import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      devOptions: {
        enabled: true,
      },
      includeAssets: ["pwa.svg"],
      manifest: {
        background_color: "#ffffff",
        description: "Unimetrics web app",
        display: "standalone",
        icons: [
          {
            purpose: "any",
            sizes: "any",
            src: "/pwa.svg",
            type: "image/svg+xml",
          },
        ],
        name: "Unimetrics App",
        short_name: "Unimetrics",
        start_url: "/",
        theme_color: "#0a0a0a",
      },
      registerType: "autoUpdate",
    }),
  ],
});
