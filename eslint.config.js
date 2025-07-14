import js from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';
import react from 'eslint-plugin-react';

export default [
  js.configs.recommended,
  {
    languageOptions: {
      parser: tsparser,
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    plugins: {
      '@typescript-eslint': tseslint,
      react: react,
    },
    rules: {
      'react/react-in-jsx-scope': 'off', // Fix React 19 JSX transform
    },
    settings: {
      react: {
        version: '19.0.0',
      },
    },
  },
];
