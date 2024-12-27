import { FlatCompat } from '@eslint/eslintrc';
import path from 'path';
import { fileURLToPath } from 'url';
import eslintPluginSvelte from 'eslint-plugin-svelte';
import svelteParser from 'svelte-eslint-parser';
import typescript from '@typescript-eslint/eslint-plugin';
import prettier from 'eslint-plugin-prettier';
import js from '@eslint/js'; // Importing the ESLint's built-in JS config
import svelteConfig from './svelte.config.js'; // Import your Svelte config

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended, // Provide the recommended config
});

export default [
  // Global ignores for auto-generated files and node_modules
  {
    ignores: ['node_modules/**', '.svelte-kit/**', 'dist/**'],
  },

  // TypeScript and JavaScript specific configuration
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json',
      },
    },
    plugins: {
      '@typescript-eslint': typescript,
      prettier: prettier,
    },
    rules: {
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      'prettier/prettier': 'warn',
    },
  },

  // Config files specific configuration (without using excludedFiles)
  {
    files: [
      '*.config.js',
      '*.config.ts',
      'vite.config.ts',
      'tailwind.config.ts',
      'eslint.config.js',
      'postcss.config.js',
    ],
    languageOptions: {
      parserOptions: {
        sourceType: 'module',
      },
    },
    rules: {
      // Define any specific rules for config files here if necessary
    },
  },

  // Svelte specific configuration
  {
    files: ['*.svelte'],
    languageOptions: {
      parser: svelteParser,
      parserOptions: {
        extraFileExtensions: ['.svelte'],
        ecmaVersion: 2020, // or latest
        sourceType: 'module',
        svelteConfig,
      },
    },
    plugins: {
      svelte: eslintPluginSvelte,
      prettier: prettier,
    },
    rules: {
      'prettier/prettier': 'warn',
      'svelte/valid-compile': 'error',
    },
  },

  // Using FlatCompat to translate the old extends syntax
  ...compat.extends('eslint:recommended'),
  ...compat.extends('plugin:@typescript-eslint/recommended'),
];
