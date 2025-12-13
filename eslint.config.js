import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import jsdoc from "eslint-plugin-jsdoc";
import sonarjs from "eslint-plugin-sonarjs";
import importPlugin from "eslint-plugin-import";

export default tseslint.config(
  { ignores: ["dist"] },
  {
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      importPlugin.flatConfigs.recommended,
      importPlugin.flatConfigs.typescript
    ],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        project: ["./tsconfig.app.json"],
      }
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      jsdoc,
      sonarjs,
    },
    settings: {
      "import/resolver": {
        node: {
          paths: ["src"],
          extensions: [".js", ".jsx", ".ts", ".tsx"],
        },
        typescript: {
          alwaysTryTypes: true,
          project: ["./tsconfig.json", "./tsconfig.app.json"],
        },
      },
      "import/parsers": {
        "@typescript-eslint/parser": [".ts", ".tsx"],
      },
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
      "@typescript-eslint/no-unused-vars": "off",

      // Import rules for scalable architecture
      "import/order": [
        "error",
        {
          "groups": [
            "builtin",
            "external",
            "internal",
            "parent",
            "sibling",
            "index"
          ],
          "newlines-between": "always",
          "alphabetize": {
            "order": "asc",
            "caseInsensitive": true
          },
          "pathGroups": [
            {
              "pattern": "react",
              "group": "external",
              "position": "before"
            },
            {
              "pattern": "@/integrations/**",
              "group": "external",
              "position": "after"
            },
            {
              "pattern": "@/hooks/**",
              "group": "internal",
              "position": "after"
            },
            {
              "pattern": "@/contexts/**",
              "group": "internal",
              "position": "after"
            },
            {
              "pattern": "@/components/**",
              "group": "internal",
              "position": "after"
            },
            {
              "pattern": "@/lib/**",
              "group": "internal",
              "position": "after"
            },
            {
              "pattern": "@/services/**",
              "group": "internal",
              "position": "after"
            },
            {
              "pattern": "@/utils/**",
              "group": "internal",
              "position": "after"
            },
            {
              "pattern": "@/types/**",
              "group": "internal",
              "position": "after"
            }
          ],
          "pathGroupsExcludedImportTypes": ["react"]
        }
      ],
      "import/no-cycle": "error",
      "import/no-self-import": "error",

      // SonarJS rules for readable and maintainable code
      "sonarjs/cognitive-complexity": ["warn", 15], // Functions should not be overly complex
      "sonarjs/no-duplicated-branches": "warn", // Avoid duplicated code branches
      "sonarjs/no-identical-functions": "warn", // Avoid identical functions
      "sonarjs/no-redundant-boolean": "warn", // Avoid redundant boolean literals
      "sonarjs/no-same-line-conditional": "warn", // Avoid same line conditionals that are hard to read
      "sonarjs/prefer-while": "warn", // Prefer while loops when more appropriate
      "sonarjs/no-small-switch": "warn", // Discourage small switch statements that could be if statements
      "sonarjs/prefer-immediate-return": "warn", // Prefer immediate returns instead of storing values
      "sonarjs/no-nested-switch": "warn", // Avoid nested switch statements
      "sonarjs/no-nested-template-literals": "warn", // Avoid nested template literals for readability
      "sonarjs/max-switch-cases": ["warn", 15], // Limit switch cases for readability
      "sonarjs/no-duplicate-string": "warn", // Avoid duplicate strings (magic strings)
      "sonarjs/no-collection-size-mischeck": "warn", // Prevent common collection size checks
      "sonarjs/no-redundant-jump": "warn", // Avoid redundant jumps
      "sonarjs/no-identical-conditions": "warn", // Avoid identical conditions in if/else chains

      // JSDoc rules for maintainable code
      "jsdoc/require-jsdoc": [
        "warn",
        {
          "publicOnly": true,
          "contexts": [
            "FunctionDeclaration",
            "ClassDeclaration",
            "MethodDefinition",
            "ArrowFunctionExpression",
            "FunctionExpression",
            "TSDeclareFunction"
          ]
        }
      ],
      "jsdoc/no-types": "warn",
      "jsdoc/check-param-names": "off", // Disable to allow custom parameter naming as per docs
      "jsdoc/check-tag-names": "warn",
      "jsdoc/check-values": "warn",
      "jsdoc/require-description": "warn",
      "jsdoc/require-param": "warn",
      "jsdoc/require-param-description": "warn",
      "jsdoc/require-param-name": "warn",
      "jsdoc/require-param-type": "off", // Allow not specifying types in JSDoc
      "jsdoc/require-returns": "warn",
      "jsdoc/require-returns-description": "warn",
      "jsdoc/require-returns-type": "off", // Allow not specifying types in JSDoc
      "jsdoc/require-description-complete-sentence": "warn",
      "jsdoc/multiline-blocks": "warn",
      "jsdoc/no-bad-blocks": "warn",
      "jsdoc/no-multi-asterisks": "warn",
      "jsdoc/tag-lines": ["warn", "never", { "startLines": 1 }],
    },
  },
);
