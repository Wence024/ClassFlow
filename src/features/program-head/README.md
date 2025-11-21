# Program Head Features

This directory contains all use cases and workflows specific to the Program Head role.

## Structure

Each subdirectory represents a complete vertical slice (use case):
- `component.tsx` - UI components for the use case
- `hook.tsx` - Business logic and state management
- `service.ts` - Wrapper for calling lib/services
- `types.ts` - Use-case specific types

## Use Cases (To be migrated in Phase 2)

- `create-class-session/` - Complete workflow for creating class sessions
- `schedule-class-session/` - Timetable management and drag-and-drop scheduling
- `request-cross-dept-resource/` - Request approval for cross-department resources
- `view-pending-requests/` - Track and manage pending approval requests
- `manage-sessions/` - Edit and delete class sessions

## Shared Code

- `shared/` - Code shared across program head use cases only
