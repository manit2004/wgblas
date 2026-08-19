import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    ignores: ["docs/**"],
  },
  {
    files: ["**/*.{js,mjs,cjs}"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
  },
  {
    // CodeMirror is loaded at runtime from a CDN <script> tag (see
    // loadCodeMirror()), not imported — declare it so ESLint doesn't flag
    // the global as undefined.
    files: ["assets/docs/runner.js"],
    languageOptions: { globals: { CodeMirror: "readonly" } },
  },
]);
