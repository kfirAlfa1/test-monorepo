import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

const apiTarget = process.env.API_PROXY_TARGET ?? "http://localhost:8000";

// Base44 preview only: the dev server is reached through the sandbox hostname
// (3000-<id>.<sandbox host domain>, where <id> rotates), which Vite's dev-server
// host check would otherwise reject with "Blocked request". Vite 5.4 does not
// read the platform's __VITE_ADDITIONAL_SERVER_ALLOWED_HOSTS, so accept the
// sandbox host domain and all of its subdomains. Unset flag => no change.
const previewAllowedHosts =
  process.env.BASE44_PREVIEW_MODE === "1" && process.env.BASE44_SANDBOX_HOST_DOMAIN
    ? [`.${process.env.BASE44_SANDBOX_HOST_DOMAIN}`]
    : [];

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 5173,
    ...(previewAllowedHosts.length > 0 ? { allowedHosts: previewAllowedHosts } : {}),
    proxy: {
      "/api": { target: apiTarget, changeOrigin: true },
    },
  },
  plugins: [react()],
});
