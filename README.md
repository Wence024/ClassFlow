# ClassFlow

ClassFlow is a modern, real-time class scheduling application designed for academic departments. It provides a drag-and-drop interface for timetabling, robust data management for courses and instructors, and a secure authentication system with role-based access control.

Built with a focus on maintainability and developer experience, the project uses a modular, feature-based architecture with **Vite, React, TypeScript, TanStack Query, Supabase, and Tailwind CSS**.

---

## Key Features

- 🔒 **Secure Authentication**: Role-based access control with Admin, Department Head, and Program Head roles
- 🧩 **Comprehensive Component Management**: Full CRUD functionality for Courses, Class Groups, Classrooms, and Instructors with detailed attributes
- 🎨 **Visual Organization**: Components automatically assigned unique colors for easy identification
- 🔍 **Advanced Search & Filtering**: Client-side search functionality across all management pages
- 📅 **Class Session Management**: Create and manage schedulable class sessions with conflict detection
- ↔️ **Interactive Timetabling**: Drag-and-drop grid interface with real-time validation
- ✅ **Conflict Detection**: Instant visual feedback prevents scheduling conflicts during drag operations
- 🎛️ **Collapsible Sidebar**: Modern navigation with toggle functionality and tooltips
- 📊 **Instructor Reports**: Generate detailed schedule reports with teaching load calculations, exportable to PDF and Excel
- ⚙️ **Flexible Schedule Configuration**: Upsert-based configuration system for easy initial setup and updates
- ⚡ **Real-time Collaboration**: Live updates across all connected clients via Supabase subscriptions
- 🛡️ **Type-Safe & Scalable**: Built with TypeScript and modular feature architecture
- 🧪 **Comprehensive Testing:** All critical workflows and roles are covered by fast, layered unit, integration, workflow, real-time, and permission/security (RLS) tests. Continuous improvement rooted in engineering best practices.

---

## Getting Started

For a complete guide on setting up the development environment, configuring Supabase, and running the project, please see the **[Getting Started Guide](./docs/getting-started.md)**.

### Quick Start

1. **Clone the repository:**

    ```bash
    git clone https://github.com/your-username/ClassFlow-nomad.git
    cd ClassFlow-nomad
    ```

2. **Install dependencies:**

    ```bash
    npm install
    ```

3. **Set up environment variables:**
    - Copy `.env.example` to a new file named `.env`.
    - Fill in your Supabase Project URL and Anon Key.

4. **Run the development server:**

    ```bash
    npm run dev
    ```

---

## Documentation

This project includes comprehensive documentation to help developers understand its architecture, conventions, and future plans.

For the full breakdown of testing, coding standards, system architecture, and plans, see the `/docs` directory. Core docs:
- [Getting Started](./docs/getting-started.md)
- [Architecture](./docs/architecture.md)
- [Coding Guidelines](./docs/coding-guidelines.md)
- [Testing](./docs/testing.md)

Key authentication is now managed via secure, admin-only invitation; public registration has been removed for security best practices. Department, program, and role management now align with the latest database and policy improvements.

---

## Available Scripts

### Updated Scripts

- `npm run dev` — Start the Vite dev server
- `npm run build` — Production build
- `npm run lint:fix` — ESLint (fix)
- `npm run lint` — ESLint (check only)
- `npm run type-check` — TypeScript type checking
- `npm run test` — All tests (175 tested)
- `npm run test:unit` — Unit tests
- `npm run test:integration` — Integration tests
- `npm run premerge` — Lint, type-check, test, format (for pull requests)

---

## License

This project is licensed under the MIT License.
