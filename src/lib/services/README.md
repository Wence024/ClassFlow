# Infrastructure Services Layer

This directory contains ALL database operations for the application, consolidating what was previously scattered across feature directories.

## Services

- `classSessionService.ts` - All class session CRUD operations
- `resourceRequestService.ts` - All resource request operations (create, approve, reject, cancel)
- `timetableService.ts` - All timetable assignment operations
- `instructorService.ts` - All instructor CRUD operations
- `classroomService.ts` - All classroom CRUD operations
- `courseService.ts` - All course CRUD operations
- `classGroupService.ts` - All class group CRUD operations
- `userService.ts` - All user management operations
- `departmentService.ts` - All department CRUD operations
- `programService.ts` - All program CRUD operations
- `notificationService.ts` - All notification operations
- `authService.ts` - All authentication operations (to be added)

## Principles

1. **Single Responsibility**: Each service handles one entity/domain
2. **Complete Coverage**: All database operations for an entity are in one file
3. **No Business Logic**: Services only handle data operations, no UI logic
4. **Used by Use Cases**: Feature use cases call these services via thin wrapper functions
5. **Centralized**: Easy to find, maintain, and test

## Migration Status

✅ Phase 1 Complete - All services consolidated
⏳ Phase 2+ - Feature use cases to be refactored to use these services
