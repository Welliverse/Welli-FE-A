import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    // 백엔드가 localhost:3000만 CORS 허용 목록에 등록해둠 (다른 포트 쓰려면 백엔드 팀에 요청 필요)
    port: 3000,
  },
});
