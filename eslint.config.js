import js from "@eslint/js";
import pluginVue from "eslint-plugin-vue";
import {
  defineConfigWithVueTs,
  vueTsConfigs,
} from "@vue/eslint-config-typescript";
import configPrettier from "eslint-config-prettier";
import globals from "globals";

export default defineConfigWithVueTs(
  { ignores: ["dist/**", "node_modules/**"] },
  js.configs.recommended,
  pluginVue.configs["flat/recommended"],
  vueTsConfigs.recommended,
  configPrettier,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.browser,
      },
    },
    rules: {
      // Pre-existing patterns in this codebase; kept as warnings for now.
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-empty-object-type": "warn",
      "@typescript-eslint/no-non-null-asserted-optional-chain": "warn",
      "vue/multi-word-component-names": "warn",
    },
  },
);
