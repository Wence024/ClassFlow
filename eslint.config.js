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
      // Overrides to prevent conflicts between linting tools
      'sonarjs/no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'off',

      // Enforce a cognitive complexity detection of 11 and above.
      "sonarjs/cognitive-complexity": ["error", { "max": 11 }],

      // Enforce the presence of JSDoc comments
      'jsdoc/require-jsdoc': [
        'warn',
        {
          // Require JSDoc for all common function and class types
          require: {
            FunctionDeclaration: true,
            MethodDefinition: true,
            ClassDeclaration: true,
            ArrowFunctionExpression: true,
            FunctionExpression: true,
          },
          // Only enforce for exported items
          publicOnly: true,
        },
      ],

      // Forbid adding types to JSDoc in TypeScript files
      'jsdoc/no-types': 'error',

      // Ensure consistent spacing and formatting
      "jsdoc/tag-lines": ["warn", "always", {
        "startLines": 1, 
        "count": 0, 
      }],
      'jsdoc/multiline-blocks': 'warn',
      'jsdoc/require-description': 'warn',
      'jsdoc/require-param-description': 'warn',
      'jsdoc/require-returns-description': 'warn',
      'jsdoc/no-multi-asterisks': 'warn',
      'jsdoc/require-description-complete-sentence': 'warn'
    },
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
  },
])