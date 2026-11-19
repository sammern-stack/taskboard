import { defineConfig, globalIgnores } from 'eslint/config';
import tseslint from 'typescript-eslint';
import eslintPluginReactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';
import js from '@eslint/js';

export default defineConfig([
  globalIgnores(['**/dist']),
  {
    files: ['**/*.{js,mjs,cjs,ts,tsx}'],
    extends: [js.configs.recommended],
  },
  // Base TypeScript rules for all TS/TSX files
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parserOptions: {
        tsconfigRootDir: import.meta.dirname,
      },
    },
    extends: [tseslint.configs.recommended],
  },

  // Node.js globals for server/**
  {
    files: ['server/**/*.ts'],
    languageOptions: {
      globals: globals.node,
    },
  },

  // Browser globals + React Hooks for client/**
  {
    files: ['client/**/*.ts', 'client/**/*.tsx'],
    extends: [eslintPluginReactHooks.configs.flat.recommended],
    languageOptions: {
      globals: globals.browser,
    },
  },
]);
