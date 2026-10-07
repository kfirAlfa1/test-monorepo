import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

const apiTarget = process.env.API_PROXY_TARGET ?? "http://localhost:8000";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 5173,
    proxy: {
      "/api": { target: apiTarget, changeOrigin: true },
    },
  },
  plugins: [react()],
});
