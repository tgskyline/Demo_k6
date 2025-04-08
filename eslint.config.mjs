import { defineConfig } from "eslint/config";
import globals from "globals";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";
const compat = new FlatCompat();


export default defineConfig([
  { files: ["**/*.{js,mjs,cjs}"] },
  { files: ["**/*.js"], languageOptions: { sourceType: "commonjs" } },
  { files: ["**/*.{js,mjs,cjs}"], languageOptions: { globals: globals.node } },
  { files: ["**/*.{js,mjs,cjs}"], plugins: { js }, extends: ["js/recommended"] },
  { files: ["**/*.{js,mjs,cjs}"], plugins: { js }, extends: ["js/recommended"] },
  {  
    parserOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
    },
  },
      ...compat.extends("eslint:recommended"),
    {
        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "module",
        },
    },
]);

