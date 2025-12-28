import js from "@eslint/js";
import prettier from "eslint-plugin-prettier";
import prettierConfig from "eslint-config-prettier";
import globals from "globals";

export default [
  // Base recommended config for all files
  js.configs.recommended,
  prettierConfig,
  
  // Node.js environment (for webpack configs and other root-level JS files)
  // Put this BEFORE src/ to avoid conflicts
  {
    files: ["*.js", "*.cjs"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "commonjs",
      globals: {
        ...globals.node,
      },
    },
    plugins: {
      prettier,
    },
    rules: {
      "prettier/prettier": "error",
    },
  },
  
  // ES Modules environment (for .mjs files like eslint.config.mjs)
  {
    files: ["*.mjs"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.node,
      },
    },
    plugins: {
      prettier,
    },
    rules: {
      "prettier/prettier": "error",
    },
  },
  
  // Jest test files (more specific, should come before general src/ rule)
  {
    files: ["**/*.test.js", "**/*.spec.js", "**/__tests__/**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.jest,  // Includes describe, test, expect, etc.
      },
    },
    plugins: {
      prettier,
    },
    rules: {
      "prettier/prettier": "error",
    },
  },
  
  // Browser environment (for src/ files)
  // This should come AFTER test files so test files don't get browser globals
  {
    files: ["src/**/*.js"],
    ignores: ["**/*.test.js", "**/*.spec.js", "**/__tests__/**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
      },
    },
    plugins: {
      prettier,
    },
    rules: {
      "prettier/prettier": "error",
    },
  },
  
  // Files to ignore
  {
    ignores: [
      "dist/",
      "build/",
      "public/",
      "node_modules/",
      "coverage/",
      "src/assets/img/**",
      "src/assets/font/**",
      "src/assets/video/**",
      "*.min.js",
      "*.min.css",
      "*.bundle.js",
      "*.bundle.js.map",
      "*.js.map",
      "eslint.config.mjs",
    ],
  },
];
