import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
// @ts-ignore
import boundaries from "eslint-plugin-boundaries";

export default tseslint.config(
  { ignores: ["dist", "node_modules", ".temp", ".cache", "scripts/tests"] },
  {
    files: ["**/*.{ts,tsx}"],
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    languageOptions: {
      ecmaVersion: 2020,
      globals: {
        ...globals.browser,
        ...globals.es2020
      },
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      "boundaries": boundaries,
    },
    settings: {
      "boundaries/elements": [
        { "type": "domain",      "pattern": "src/domain/**/*" },
        { "type": "application", "pattern": "src/application/**/*" },
        { "type": "features",    "pattern": "src/features/*" },
        { "type": "components",  "pattern": "src/components/**/*" },
        { "type": "pages",       "pattern": "src/pages/**/*" }
      ]
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-explicit-any": "error",
      "no-console": ["warn", { "allow": ["error", "warn"] }],

      // ── Architectural Boundaries (eslint-plugin-boundaries v6) ──────────────
      // NOTE: The string-based selector syntax triggers an advisory deprecation
      // warning from the plugin warning us to migrate to object selectors.
      // However, the object-based form causes a performance hang in the current
      // v6.0.2 + ESLint 10 combination. The string form is functionally correct
      // and lint exits 0 — pinned here until a patch release resolves this.
      "boundaries/dependencies": [2, {
        "default": "disallow",
        "rules": [
          { "from": "domain",      "allow": ["domain"] },
          { "from": "application", "allow": ["domain", "application"] },
          { "from": "features",    "allow": ["domain", "application", "components"] },
          { "from": "pages",       "allow": ["domain", "application", "features", "components"] },
          { "from": "components",  "allow": ["components", "domain"] }
        ]
      }]
    },
  },
);
