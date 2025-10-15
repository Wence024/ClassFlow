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
- ⚡ **Real-time Collaboration**: Live updates across all connected clients via Supabase subscriptions
- 🛡️ **Type-Safe & Scalable**: Built with TypeScript and modular feature architecture
- 🧪 **Comprehensive Testing**: 171 passing tests covering unit, integration, and component testing

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

- **[Getting Started](./docs/getting-started.md)**: The primary guide for new developers.
- **[Architecture Overview](./docs/architecture.md)**: A deep dive into the system design, data flow, and folder structure.
- **[Coding Guidelines](./docs/coding-guidelines.md)**: The project's development roadmap and coding standards.
- **[Testing Strategy](./docs/testing.md)**: An overview of the testing approach and future plans.

---

## Available Scripts

- `npm run dev`: Starts the Vite development server
- `npm run build`: Bundles the application for production
- `npm run lint`: Lints the codebase using ESLint
- `npm run lint:fix`: Automatically fixes ESLint errors
- `npm run type-check`: Runs TypeScript type checking
- `npm run test`: Runs the complete test suite (171 tests)
- `npm run test:unit`: Runs unit tests only
- `npm run test:integration`: Runs integration tests only
- `npm run premerge`: Runs all quality checks (lint, type-check, test, format)

---

## License

This project is licensed under the MIT License.
