import { defineConfig, globalIgnores } from 'eslint/config';
import eslintPluginTs from '@typescript-eslint/eslint-plugin';
import eslintParserTs from '@typescript-eslint/parser';
import eslintPluginReactHooks from 'eslint-plugin-react-hooks';
import js from '@eslint/js';

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,mjs,cjs}'],
    extends: [js.configs.recommended],
  },
  // Base TypeScript rules for all TS/TSX files
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: eslintParserTs,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': eslintPluginTs,
    },
    rules: {
      ...eslintPluginTs.configs.recommended.rules,
    },
  },

  // Node.js globals for server/**
  {
    files: ['server/**/*.ts', 'server/**/*.tsx'],
    languageOptions: {
      globals: {
        // Node.js globals
        process: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        Buffer: 'readonly',
        global: 'readonly',
        module: 'readonly',
        require: 'readonly',
      },
    },
  },

  // Browser globals + React Hooks for client/**
  {
    files: ['client/**/*.ts', 'client/**/*.tsx'],
    languageOptions: {
      globals: {
        // Browser globals
        window: 'readonly',
        document: 'readonly',
        navigator: 'readonly',
        location: 'readonly',
        console: 'readonly',
        alert: 'readonly',
        fetch: 'readonly',
      },
    },
    plugins: {
      'react-hooks': eslintPluginReactHooks,
    },
    rules: {
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
    },
  },
]);
