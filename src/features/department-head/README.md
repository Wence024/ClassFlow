# Department Head Features

This directory contains all use cases and workflows specific to the Department Head role.

## Structure

Each subdirectory represents a complete vertical slice (use case):
- `component.tsx` - UI components for the use case
- `hook.tsx` - Business logic and state management
- `service.ts` - Wrapper for calling lib/services
- `types.ts` - Use-case specific types

## Use Cases (To be migrated in Phase 3)

- `approve-cross-dept-request/` - Approve resource requests from other programs
- `reject-cross-dept-request/` - Reject resource requests with feedback
- `manage-instructors/` - Department-scoped instructor management
- `view-pending-requests/` - Review and track department requests

## Shared Code

- `shared/` - Code shared across department head use cases only
