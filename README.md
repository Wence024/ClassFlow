# ClassFlow

A modern class scheduling and authentication web app built with **Vite**, **React**, **TypeScript**, **Supabase**, and **Tailwind CSS v3**.

---

## Features

- 🔒 **Authentication**: Register, login, email verification, password reset (Supabase Auth)
- 📅 **Class Session Management**: Create, edit, and remove class sessions
- 🗂️ **Component Management**: Manage courses, groups, classrooms, instructors
- 🗓️ **Timetable Scheduler**: Drag-and-drop timetable for class sessions
- 🎨 **Modern UI**: Fully styled with Tailwind CSS and accessible forms
- 🛡️ **Protected Routes**: PrivateRoute and smart redirects based on auth status
- 💾 **Local Storage**: Persists schedule and component data locally

---

## Developer Onboarding

Welcome! This project follows a clear roadmap for maintainability and scaling. Please review these onboarding tips:

- **Phases:** Code is structured for MVP, with clear separation for post-MVP and scaling features. See `Remember_when_Coding.md` for philosophy.
- **Folder Structure:** Features are modular (see Project Structure below). Contexts, hooks, and services are separated for clarity.
- **Type Safety:** TypeScript is enforced throughout. Avoid non-null assertions (`!`); use defensive checks.
- **Error Handling:** All user-facing errors use the notification system (`showNotification`).
- **Testing:** Core business logic is covered by unit tests (see `/src/features/scheduleLessons/utils/timetableLogic.test.ts`).
- **Docs:** See `/docs/architecture.md` for system overview, `/docs/testing.md` for test strategy, and `/docs/user-guide.md` for user-facing help.
- **.env:** Copy `.env.example` to `.env` and fill in Supabase credentials.

For more, see the [Documentation](#documentation) section below.

---

## Getting Started

### 1. Clone & Install

```bash
git clone <your-repo-url>
cd ClassFlow
npm install
```

### 2. Environment Variables

Copy `.env.example` to `.env` and fill in your [Supabase](https://supabase.com/) project credentials:

```txt
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Run the App

```bash
npm run dev
```

The app will be available at [http://localhost:5173](http://localhost:5173) (or as shown in your terminal).

---

## Scripts

- `npm run dev` — Start development server
- `npm run build` — Build for production
- `npm run preview` — Preview production build
- `npm run lint` — Lint code with ESLint
- `npm run lint:fix` — Auto-fix lint issues
- `npm run format` — Format code with Prettier
- `npm run format:check` — Check formatting

---

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS v3, dark mode, global input styles
- **Auth**: Supabase Auth (email/password, email verification, password reset)
- **State**: React Context, localStorage for schedule/component data
- **Routing**: React Router v7, protected routes

---

## Tailwind CSS Usage

- All UI is styled with Tailwind utility classes for consistency and maintainability.
- Global input, select, and textarea fields use white text on a dark background (see `src/index.css`).
- You can add or customize Tailwind classes in your components as needed.
- Tailwind config: see `tailwind.config.cjs` and `postcss.config.cjs`.

---

## Accessibility & Best Practices

- All forms and buttons are accessible and keyboard-friendly.
- Loading and error states are clearly indicated.
- Responsive layout for desktop and mobile.
- Code is organized by feature (`features/auth`, `features/scheduleLessons`).
- **Contexts and hooks are now modularized for maintainability and scalability.**

---

## Project Structure

```txt
ClassFlow/
  src/
    features/
      auth/                # Authentication (API, context, pages, routes)
      scheduleLessons/     # Class/session/timetable management
        contexts/
          classSessions/   # ClassSessionsProvider
          components/      # ComponentsProvider
          timetable/       # TimetableProvider
          index.ts         # Barrel export for all contexts
        hooks/             # Custom hooks (useClassSessions, useComponents, useTimetable)
        pages/             # Page components (UI orchestration only)
        components/        # UI and feature components
    App.tsx                # App shell, routing, layout
    index.css              # Tailwind and global styles
    main.tsx               # App entry point
  tailwind.config.cjs      # Tailwind config
  postcss.config.cjs       # PostCSS config
  package.json             # Scripts and dependencies
```

---

## Deployment

Build for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

---

## License

MIT

---

## Documentation

- [System Architecture](docs/architecture.md)
- [Testing & QA](docs/testing.md)
- [User Guide / FAQ](docs/user-guide.md)
- [Development Roadmap](Remember_when_Coding.md)
