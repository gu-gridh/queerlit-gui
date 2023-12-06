import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import ViteYaml from "@modyfi/vite-plugin-yaml";
import path from "path";
import { visualizer } from "rollup-plugin-visualizer";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), ViteYaml(), visualizer()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  base: process.env.BASE,
});
