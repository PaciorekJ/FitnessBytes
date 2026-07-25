import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const serverTarget = "http://server:5301";

export default defineConfig({
    plugins: [react()],
    server: {
        host: "0.0.0.0",
        port: 5173,
        strictPort: true,
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
