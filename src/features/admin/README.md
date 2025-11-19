# Admin Features

This directory contains all use cases and workflows specific to the Admin role.

## Structure

Each subdirectory represents a complete vertical slice (use case):
- `component.tsx` - UI components for the use case
- `hook.tsx` - Business logic and state management
- `service.ts` - Wrapper for calling lib/services
- `types.ts` - Use-case specific types

## Use Cases (To be migrated in Phase 4)

- `manage-users/` - User administration and role assignment
- `manage-departments/` - Department CRUD operations
- `manage-classrooms/` - Classroom management
- `system-configuration/` - Schedule and system settings

## Shared Code

- `shared/` - Code shared across admin use cases only
