# Coding Guidelines & Development Phases

This document outlines the phased approach to development for ClassFlow, ensuring a balance between rapid delivery and long-term maintainability. It serves as the official standard for structuring features and prioritizing work.

---

## 🟢 Phase 1: MVP (Core Functionality)

The focus of the MVP phase is to deliver a functional, stable, and secure application with a solid architectural foundation.

### **Feature Implementation**

- **Backend Integration**: All data operations must go through the service layer that communicates with Supabase.
- **Forms**: All user input is handled via standardized forms with clear validation.
- **Loading & Error States**: Every asynchronous operation must have corresponding loading and error states in the UI to provide clear user feedback.

### **Code Quality**

- **State Management**: Server state is managed exclusively by TanStack Query. Client state is managed by React's built-in hooks (`useState`, `useContext`).
- **Type Safety**: The entire codebase is strictly typed with TypeScript. Avoid `any` and non-null assertions (`!`).
- **Documentation**: All exported hooks, services, and components must have JSDoc comments, which are enforced by ESLint.
- **Folder Structure**: Adhere to the established feature-sliced architecture.
- **Styling**: Use Tailwind CSS utility classes and shadcn/ui components for all styling to maintain consistency.

### **User Experience**

- **Input Validation**: All forms must use Zod schemas for client-side validation.
- **Accessibility**: All interactive elements must be accessible via keyboard and have appropriate labels and focus states.

### **DevOps & Environment**

- **Version Control**: Adhere to the feature-branching workflow, with all new code submitted via Pull Requests.
- **Environment Variables**: All secret keys and environment-specific URLs must be stored in `.env` files and never committed to version control.
- **Security**: Implement basic security practices, including data validation and relying on Supabase's RLS policies for data access.

---

## 🟡 Phase 2: Post-MVP (Short-Term Iterations)

Once the core product is stable, focus shifts to enhancing robustness, developer experience, and observability.

### **Testing**

- Begin writing unit tests for all new business logic (e.g., in `utils`).
- Write integration tests for critical user flows, such as authentication and core hook functionality.

### **Maintainability**

- **Centralized Logging**: Integrate a client-side logging service (e.g., Sentry, LogRocket) to capture and analyze errors.
- **Centralized Error Handling**: Develop a shared error handling strategy to standardize how API errors are processed and displayed.

### **Performance**

- **Lazy Loading**: Implement route-based code splitting using `React.lazy()`.
- **Resource Caching**: Leverage TanStack Query's caching capabilities to minimize unnecessary network requests.

### **Documentation**

- Document all public API services and hooks.
- Maintain a `CHANGELOG.md` to track user-facing changes.

---

## 🔵 Phase 3: Post-MVP (Long-Term Scaling)

For long-term growth, the focus is on advanced features, enterprise-grade reliability, and a polished design system.

### **Internationalization (i18n)**

- Externalize all user-facing strings into resource files to prepare for multi-language support.

### **Advanced CI/CD**

- Configure preview deployments for every pull request.
- Implement automated testing and linting checks in the CI pipeline.

### **Security Enhancements**

- Implement fine-grained permissions with Role-Based Access Control (RBAC).
- Conduct regular audits of Supabase RLS policies.

### **Design & UI Systems**

- Develop a more advanced design system with custom theming and a shared component library (e.g., using Storybook).

### **System Architecture**

- Maintain detailed architecture diagrams using tools like Mermaid.js.
- Create comprehensive deployment and CI/CD documentation.

---

## Development Standards

### **Component Development**

In every code creation, remember:

- **Loading/Error States**: Make sure to include loading states and error-handling states for all components.
- **Shadcn/ui Usage**: In every rendered component, make sure to use shadcn/ui components as much as possible.
- **JSDoc Documentation**: All exported functions and classes must have proper JSDoc comments.

### **JSDoc and Readability Rules**

- 🔕 **Disable conflicting unused-var rules**
  - `sonarjs/no-unused-vars`: off
  - `@typescript-eslint/no-unused-vars`: off

- 🧠 **Enforce cognitive complexity ≤ 10**
  - `sonarjs/cognitive-complexity`: error

- 📖 **Require JSDoc for exported functions/classes**
  - Applies to: function declarations, methods, classes, arrow functions, expressions
  - `jsdoc/require-jsdoc`: warn (public only)

- 🚫 **No type annotations in JSDoc** (`jsdoc/no-types`: error)

- ✍️ **JSDoc formatting standards**
  - Tag lines: always 1 line before, none after
  - Multiline blocks: warn
  - Require descriptions for functions, params, returns
  - No multiple asterisks
  - Descriptions must be full sentences
  - "root0" as in the linter's destructured object suggestion should be replaced instead by the capital letters of the component (e.g., "rl." for RootLayout, "sc." for SessionCell)
