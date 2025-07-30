# System Architecture Overview

Welcome to ClassFlow! This document provides a high-level overview of the system for new developers and maintainers.

## Philosophy

- **MVP First:** Build for clarity and maintainability, then scale. See `Remember_when_Coding.md` for the full roadmap.
- **Feature Modularity:** Each major feature (auth, scheduling, components) is isolated for testability and future backend migration.
- **Type Safety:** TypeScript is enforced everywhere.

## Main Flows

```mermaid
graph TD;
  User["User"] -->|Interacts| UI["React UI Components"]
  UI -->|Uses| Contexts["React Contexts"]
  Contexts -->|Calls| Services["Service Layer"]
  Services -->|Reads/Writes| Storage["Supabase Backend"]
  UI -->|Shows| Notification["Notification System"]
```

- **UI Components:** Present data, handle user input, and show notifications.
- **Contexts:** Provide state and CRUD methods for features (auth, sessions, timetable, etc.).
- **Hooks:** Custom hooks (e.g., `useClassSessions`) access context and encapsulate logic.
- **Services:** Abstract data access by communicating directly with the Supabase backend.
- **Notification:** All user-facing errors and important events use the notification system.

## Folder Structure

```txt
src/
  features/
    auth/                # Authentication (API, context, pages, routes)
    scheduleLessons/     # Class/session/timetable management
      contexts/          # Context providers for state
      hooks/             # Custom hooks
      pages/             # Page-level components
      components/        # UI and feature components
      services/          # Data access (communicates with Supabase)
      types/             # TypeScript types
      utils/             # Pure business logic (e.g., timetableLogic)
```

## Data Flow Example

1. **User** interacts with a form (e.g., create class session).
2. **Component** calls a context method (e.g., `addClassSession`).
3. **Context** delegates to a service (e.g., `classSessionsService`).
4. **Service** sends a request to update the Supabase database.
5. **Context** updates state (via React Query invalidation), and the UI re-renders.
6. **Errors** are shown via the notification system.

## Extending & Scaling

- To add a new feature, create a new folder in `features/` and follow the modular pattern.
- The service layer is designed to abstract all data-fetching logic, making it easy to manage and test API interactions.
- For more, see `Remember_when_Coding.md`.
