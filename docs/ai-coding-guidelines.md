# AI Coding Guidelines

In every code creation, remember:

- Loading/error states
- [JsDoc comment convention](#jsdoc-and-readability-rules-reminder)
- Shadcn/ui usage

## Loading/error States

- Make sure to include loading states and error-handling states for all components.

## Shadcn/ui usage

- In every rendered component, make sure to use shadcn/ui components as much as possible.

## JSDoc and Readability Rules Reminder

- 🔕 Disable conflicting unused-var rules
  - `sonarjs/no-unused-vars`: off
  - `@typescript-eslint/no-unused-vars`: off

- 🧠 Enforce cognitive complexity ≤ **10**
  - `sonarjs/cognitive-complexity`: error

- 📖 Require **JSDoc** for exported functions/classes
  - Applies to: function declarations, methods, classes, arrow functions, expressions
  - `jsdoc/require-jsdoc`: warn (public only)

- 🚫 No type annotations in JSDoc (`jsdoc/no-types`: error)

- ✍️ JSDoc formatting standards
  - Tag lines: always 1 line before, none after
  - Multiline blocks: warn
  - Require descriptions for functions, params, returns
  - No multiple asterisks
  - Descriptions must be full sentences
  - "root0" as in the linter's destructured object suggestion should be replaced instead by the capital letters of the component (e.g., "rl." for RootLayout, "sc." for SessionCell)