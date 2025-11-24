import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  // Proxy para evitar CORS durante desenvolvimento: encaminha requisições /api/* para o backend local
  // Assim não é preciso alterar o backend para desenvolvimento local.
  server: {
    host: "::",
    port: 8080,
    strictPort: false,
    allowedHosts: ['all'],
    hmr: {
      clientPort: 8080,
    },
    proxy: {
      '/api': {
        target: 'http://localhost:8085',
        changeOrigin: true,
        secure: false,
      },
      '/api/upload': {
        target: 'http://localhost:3007',
        changeOrigin: true,
        secure: false,
      },
      '/api/v1/guides': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
      }
    },
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
