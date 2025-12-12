# Coding Principles

## ✅ 1. **Readable, Maintainable Code**

This isn’t just “clean code.” It’s “future you can still understand this code.”

**Examples:**

* Naming a button handler `handleCreateInvoice()` instead of `btn1()`.
* Splitting a long 300-line component into 3 smaller pieces.
* Avoiding magic values like `if (x === 7)` and using constants like `MAX_RETRY_ATTEMPTS`.

**What to check in every file:**

* Variable, function, and parameter names are descriptive
* Comments explain the "why" not just the "what"
* Functions are under 50 lines (split if longer)
* Classes/components have single responsibility
* Constants are defined at the top of files
* Complex logic is extracted to utility functions
* Magic numbers/strings are replaced with named constants
* Boolean parameters are replaced with object destructuring for readability

**Why it matters:**
When a bug appears at 1 AM, readable code is mercy.

---

## ✅ 2. **Scalable, Predictable Architecture**

Even small projects benefit from having a structure.

**Examples:**

* Separating UI components from business logic (e.g., `components/` vs `services/`).
* Sticking to a pattern: MVC, Feature-based folders, Clean Architecture, etc.
* Using state management properly (React Query, Zustand, Redux Toolkit, etc.).

**What to check in every file:**

* Files are in correct folder based on their purpose (components, services, hooks, types, lib)
* Business logic is separated from presentation logic
* Services handle external API calls independently
* Hooks encapsulate reusable logic
* Data fetching is centralized in services or react-query hooks
* Components are organized by feature or page
* State management follows consistent patterns across the app

**Why it matters:**
Projects grow. A messy foundation becomes expensive later.

---

## ✅ 3. **Consistent Error Handling**

Your code shouldn’t explode silently.

**Examples:**

* Using `try/catch` blocks where side effects occur.
* Having a global `ErrorBoundary` in React.
* Server returning structured error responses:
  `{ success: false, error: { code: "INVALID_INPUT", message: "Name is required" }}`

**What to check in every file:**

* All async operations have proper try/catch blocks
* Errors are properly propagated to higher levels
* Custom error types are used consistently (ApplicationError, ValidationError, etc.)
* Network errors are handled gracefully with appropriate user feedback
* Error boundaries are in place for React components
* Error logging includes context information (userId, sessionId, etc.)
* User-facing error messages are user-friendly and don't expose technical details
* Error states are handled in UI components with appropriate fallbacks

**Why it matters:**
Errors will happen. Your job is to make sure they're predictable and recoverable.

---

## ✅ 4. **Security Best Practices**

Security isn’t only for big companies — it's basic hygiene.

**Examples:**

* Escaping user input to prevent XSS.
* Using HTTPS.
* Storing env variables in `.env` and not in Git.
* Rate-limiting login attempts.

**What to check in every file:**

* Sensitive data is not hardcoded in source code
* Environment variables are used for API keys and secrets
* Input validation is performed on both client and server
* Sanitization is applied to user-generated content
* CSRF protections are in place
* SQL injection prevention (using parameterized queries)
* Proper authentication/authorization checks for protected resources
* Secure headers are set in middleware (already implemented)
* Password policies are enforced
* Session management is secure
* Rate limiting is implemented for sensitive endpoints

**Why it matters:**
People trust your software. Protect them.

---

## ✅ 5. **Performance Awareness**

Not premature optimization — just common-sense decisions.

**Examples:**

* Avoiding re-render storms with memoization (`useMemo`, `memo`, `useCallback`).
* Lazy-loading routes or components.
* Using pagination or infinite scrolling instead of loading 10k items at once.

**What to check in every file:**

* Components use React.memo appropriately for expensive re-renders
* useCallback is used for functions passed as props to prevent re-renders
* useMemo is used for expensive computations
* Images are properly optimized and include alt text
* Loading states are implemented for async operations
* Pagination is used for large datasets
* Debouncing is applied to search inputs and form fields
* Unnecessary API calls are minimized
* Proper key props are used in lists to optimize rendering
* Virtual scrolling is considered for large lists

**Why it matters:**
Slow apps feel broken even when they technically “work.”

---

## ✅ 6. **Version Control Discipline**

Git is your time machine.

**Examples:**

* Writing meaningful commit messages:
  “Fix incorrect time zone conversion in event scheduler.”
* Using feature branches.
* Reviewing your own diff before pushing.

**What to check in every file:**

* Commit messages follow conventional commits format (feat:, fix:, chore:, etc.)
* Branch names are descriptive and follow team conventions
* Large features are broken into atomic commits
* Sensitive data is not committed to the repository
* Large binary files are stored elsewhere (not in Git)
* .gitignore properly excludes build artifacts and temporary files
* Pull requests have clear descriptions and link to related issues

**Why it matters:**
This saves your life when something breaks out of nowhere.

---

## ✅ 7. **Dependency Responsibility**

Modern apps depend on many libraries — but each one is a liability.

**Examples:**

* Checking library maintenance status before installing.
* Preferring standard or built-in solutions when possible.
* Regularly updating dependencies (with caution).

**What to check in every file:**

* Dependencies are actively maintained (regular updates, open issues)
* Unused dependencies are removed regularly
* Transitive dependencies are audited for vulnerabilities
* Peer dependencies are compatible
* Smaller, focused libraries are preferred over monolithic ones
* Built-in browser APIs are used instead of external libraries when possible
* Lock files (package-lock.json, yarn.lock) are committed
* Dependencies have appropriate licenses

**Why it matters:**
Fewer dependencies = fewer future problems.

---

## ✅ 8. **Environment Parity (Dev = Staging = Prod)**

Your app should behave the same everywhere.

**Examples:**

* Docker for same environment across machines.
* `.env.development` and `.env.production` separation.
* CI pipeline that tests and builds on every push.

**What to check in every file:**

* Environment variables are consistently named across environments
* Configuration differences are minimal between environments
* Dockerfiles are present and build consistently
* Database schema migration scripts are version-controlled
* Third-party service configurations are environment-agnostic
* Local development mirrors production as closely as possible
* Build processes are identical across environments
* Testing environments are isolated and reproduceable

**Why it matters:**
“How come it works on your machine?” — unnecessary suffering.

---

## ✅ 9. **Automated Testing Strategy**

Not 100% coverage — just smart testing.

**Two-tier testing approach with Cypress:**

* **Component tests**: individual UI components in isolation (using Cypress component testing)
* **End-to-end tests**: complete user workflows and critical flows (using Cypress e2e)

**What to check in every file:**

* Component tests exist for all UI components (using cypress/component.tsx files)
* End-to-end tests cover critical user journeys and business flows
* Error paths are tested alongside success paths in both component and e2e tests
* Edge cases are covered (empty states, invalid inputs, etc.) in component tests
* Component interactions and state changes are verified in isolation
* Realistic test data is used in e2e tests
* Tests are fast and reliable (no flaky tests)
* Test coverage focuses on critical paths rather than 100% coverage
* Both happy path and error scenarios are covered in e2e tests
* Component tests validate proper rendering and user interactions

**Why it matters:**
Testing makes you faster long-term, not slower.

---

## ✅ 10. **Documentation for Humans**

You already mentioned documentation, but extend it to “explain the WHY.”

**Examples:**

* README with clear setup steps.
* ADRs (Architecture Decision Records):
  “We chose Supabase over Firebase for X reasons.”
* Onboarding guides for new contributors.

**What to check in every file:**

* JSDoc comments explain function parameters, return values, and side effects
* Complex algorithms are documented with inline comments
* Architectural decisions are recorded in ADRs (Architecture Decision Records)
* Public APIs have clear usage examples
* Configuration options are documented with defaults
* Error codes and meanings are documented
* Migration guides exist for major breaking changes
* README includes local setup, deployment, and troubleshooting sections
* Component usage is documented with examples
* API endpoints are documented with request/response schemas

**Why it matters:**
Future team members — including you — need breadcrumbs.

---

## ✅ 11. **Accessibility (You mentioned this — great!)**

Keyboard navigation, ARIA labels, semantic HTML, color contrast.

**Real example:**
A modal that *traps focus* properly so screen-reader users aren’t stranded.

**What to check in every file:**

* Semantic HTML elements are used appropriately (nav, main, article, etc.)
* Color contrast meets WCAG AA standards (4.5:1 for normal text)
* Keyboard navigation works for all interactive elements
* Focus indicators are visible and meaningful
* Alt text is provided for meaningful images
* ARIA attributes are used correctly to enhance semantic meaning
* Screen reader announcements are provided for dynamic updates
* Form inputs have associated labels
* Skip links are provided for main content
* Interactive elements have appropriate ARIA roles and states

**Why it matters:**
Software should be usable by everyone, regardless of abilities.

---

## ✅ 12. **Modern, Intuitive UI/UX Implementation**

Create consistent, accessible, and visually appealing user interfaces.

**Examples:**

* Using OKLCH color system for accessible, perceptually uniform colors with semantic naming (primary, secondary, destructive, etc.)
* Implementing dark/light mode support with system preference detection
* Standardizing components with consistent design patterns (shadcn/ui with New York styling)
* Applying responsive design with mobile-first approach
* Using class-variance-authority (CVA) for consistent component variants
* Ensuring proper focus states, hover states, and keyboard navigation for accessibility
* Following consistent spacing, typography, and border-radius systems

**What to check in every file:**

* Consistent use of design tokens (spacing, colors, fonts, etc.)
* Responsive breakpoints are applied consistently
* Component variants follow established patterns
* Loading states are provided for async operations
* Empty states are designed and implemented
* Validation feedback is clear and actionable
* Hover and active states are consistent across similar elements
* Animations are smooth and purposeful
* Touch targets meet minimum size requirements (44px)
* Form layouts adapt gracefully to different screen sizes

**Why it matters:**
Consistent UI/UX creates better user experience, reduces cognitive load, and maintains professional appearance across the application.

---

## ✅ 13. **Developer Experience (DX)**

A good dev workflow saves hours.

**Examples:**

* Prettier + ESLint auto-fix on save.
* Hot reload + fast build tools (Vite, Next.js TurboPack).
* Reusable CLI scripts:
  `"dev": "next dev", "lint": "eslint . --fix", "test": "jest"`

**What to check in every file:**

* Linting rules are properly configured and enforced
* Code formatting is automated via Prettier
* Development server provides hot reloading
* Build times are optimized
* Error messages are clear and actionable
* Development environment is easy to set up
* Debugging tools are accessible
* Console warnings and errors are addressed
* Development vs production builds are clearly separated
* Local development mirrors production behavior

**Why it matters:**
Happy developers create better software.

---

## ✅ 14. **Observability & Logging**

You need to see what your app is doing in the real world.

**Examples:**

* Using logs with context:
  `console.error("Payment failed", { userId, orderId })`
* Adding Sentry for error tracking.
* Adding audit logs for sensitive actions.

**What to check in every file:**

* Structured logging includes relevant context (user ID, session, request ID)
* Error logs include stack traces and relevant metadata
* Successful operations are logged appropriately for audit trail
* Sensitive information is not logged (PII, passwords, tokens)
* Performance metrics are collected for key operations
* User actions of significance are tracked for analytics
* Logs are categorized by severity (debug, info, warn, error)
* Log retention policies are considered
* Centralized logging system is used (not scattered console.logs)
* Monitoring alerts are set up for critical failures

**Why it matters:**
Debugging without logs is guessing in the dark.

---

## A Clean Summary List (for your notes)

Here's the compiled set:

1. Modern, intuitive UI/UX
2. Code quality (linting, formatting, testing)
3. Documentation + doc comments
4. Accessibility + keyboard support
5. Readability & maintainability
6. Scalable architecture
7. Consistent error handling
8. Security best practices
9. Performance awareness
10. Version control discipline
11. Dependency responsibility
12. Modern, intuitive UI/UX implementation
13. Environment parity (Dev = Staging = Prod)
14. Automated testing strategy
15. Developer experience (DX)
16. Observability & logging
