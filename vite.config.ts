import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { load } from "js-yaml";
import type { Plugin } from "vite";
import path from "path";
import { visualizer } from "rollup-plugin-visualizer";

/** Import .yaml/.yml files as JS objects. */
const yamlPlugin = (): Plugin => ({
  name: "yaml-import",
  transform(code, id) {
    if (!/\.ya?ml$/.test(id)) return;
    return {
      code: `export default ${JSON.stringify(load(code))};`,
      map: null,
    };
  },
});

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), yamlPlugin(), visualizer()],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
    },
  },
  base: process.env.BASE,
});
