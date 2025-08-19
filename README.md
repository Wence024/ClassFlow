# ClassFlow

ClassFlow is a modern, real-time class scheduling application designed for academic departments. It provides a drag-and-drop interface for timetabling, robust data management for courses and instructors, and a secure authentication system.

Built with a focus on maintainability and developer experience, the project uses a modular, feature-based architecture with **Vite, React, TypeScript, TanStack Query, Supabase, and Tailwind CSS**.

---

## Key Features

- 🔒 **Supabase Authentication**: Secure user registration, login, email verification, and password reset.
- 🧩 **Component Management**: Full CRUD functionality for Courses, Class Groups, Classrooms, and Instructors.
- 📅 **Class Session Creation**: Combine components to create schedulable class sessions.
- ↔️ **Drag-and-Drop Timetable**: An interactive grid for assigning and moving class sessions with real-time conflict detection.
- ⚡ **Real-time Collaboration**: Changes to the timetable are reflected across all connected clients instantly via Supabase subscriptions.
- 🛡️ **Type-Safe & Scalable**: Built entirely with TypeScript and a modular feature architecture designed for growth.
- 🎨 **Modern UI**: A responsive and accessible interface styled with Tailwind CSS.

---

## Getting Started

For a complete guide on setting up the development environment, configuring Supabase, and running the project, please see the **[Getting Started Guide](./docs/getting-started.md)**.

### Quick Start

1. **Clone the repository:**

    ```bash
    git clone https://github.com/your-username/uni-schedule-weave.git
    cd uni-schedule-weave
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

- `npm run dev`: Starts the Vite development server.
- `npm run build`: Bundles the application for production.
- `npm run lint`: Lints the codebase using ESLint.
- `npm run test`: Runs unit tests with Vitest.

---

## License

This project is licensed under the MIT License.
