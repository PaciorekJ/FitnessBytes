import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

declare const process: {
    env: Record<string, string | undefined>;
};

const serverTarget = "http://server:5301";
const allowedHosts = (
    process.env.__VITE_ADDITIONAL_SERVER_ALLOWED_HOSTS || ""
)
    .split(",")
    .map((host) => host.trim())
    .filter(Boolean);

export default defineConfig({
    plugins: [react()],
    server: {
        host: "0.0.0.0",
        port: 5173,
        strictPort: true,
        allowedHosts,
        proxy: {
            "/api": {
                target: serverTarget,
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api(?=\/|$)/, ""),
            },
            "/socket.io": {
                target: serverTarget,
                changeOrigin: true,
                ws: true,
            },
        },
    },
});
