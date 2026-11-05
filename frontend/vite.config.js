import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // Subpath hosting (GitHub Pages project site) sets PAGES_BASE_PATH,
  // e.g. "/creator-toolbox/". Default "/" keeps local dev, vite preview
  // and Cloudflare Pages on the root.
  base: process.env.PAGES_BASE_PATH || "/",
  build: { outDir: "dist", sourcemap: false, chunkSizeWarningLimit: 800 }
});
