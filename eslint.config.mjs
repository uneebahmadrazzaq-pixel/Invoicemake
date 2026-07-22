import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    ".vinext/**",
    ".wrangler/**",
    "out/**",
    "outputs/**",
    "build/**",
    "NETLIFY-UPLOAD-READY*/**",
    "next-env.d.ts",
    "public/vendor/**",
    "tmp/**",
    "work/**",
  ]),
]);

export default eslintConfig;
