import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@/*": path.resolve(import.meta.dirname, "src"),
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:4000",
        changeOrigin: true,
        secure: false,
      },
    },
  },
  css: {
    modules: {
      localsConvention: "camelCaseOnly",
    },
    preprocessorOptions: {
      sass: {
        additionalData: (src: string, filename: string) => {
          const normalized = filename.replace(/\\/g, "/");
          const shouldExclude = normalized.includes("/shared/styles");

          if (shouldExclude) return src;
          return `@use "@/shared/styles/mixins" as *;\n${src}`;
        },
      },
    },
  },
});
