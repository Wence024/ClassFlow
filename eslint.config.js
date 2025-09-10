import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import sonarjs from 'eslint-plugin-sonarjs';
import jsdoc from 'eslint-plugin-jsdoc';

import { globalIgnores } from 'eslint/config'

export default tseslint.config([
  globalIgnores(['dist', 'src/lib/supabase.types.ts']),
  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      jsdoc,
    },
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
      sonarjs.configs.recommended,
      jsdoc.configs['flat/recommended-typescript'],

    ],
    rules: {
    // Disable sonarjs duplicate of no-unused-vars
    "sonarjs/no-unused-vars": "off",

    // Disable ts-eslint duplicate of no-unused-vars 
    "@typescript-eslint/no-unused-vars": "off",
  },
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
  },
])
