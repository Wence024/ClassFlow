# Refactoring Status: Role-Based Vertical Slicing

## ✅ Phase 1: Infrastructure Preparation (COMPLETED)

### 1.1 Directory Structure
- ✅ Created `src/features/program-head/`
- ✅ Created `src/features/department-head/`
- ✅ Created `src/features/admin/`
- ✅ Created `src/features/shared/`
- ✅ Created `src/lib/services/`
- ✅ Created `src/types/` (global types)

### 1.2 Consolidated Services Layer
All database operations have been consolidated into `lib/services/`:

- ✅ `classSessionService.ts` - Class session CRUD operations
- ✅ `resourceRequestService.ts` - Resource request operations
- ✅ `timetableService.ts` - Timetable assignment operations
- ✅ `instructorService.ts` - Instructor CRUD operations
- ✅ `classroomService.ts` - Classroom CRUD operations
- ✅ `courseService.ts` - Course CRUD operations
- ✅ `classGroupService.ts` - Class group CRUD operations
- ✅ `userService.ts` - User management operations
- ✅ `departmentService.ts` - Department CRUD operations
- ✅ `programService.ts` - Program CRUD operations
- ✅ `notificationService.ts` - Notification operations
- ✅ `authService.ts` - Authentication operations

### 1.3 Global Types
Extracted all domain types to `src/types/`:

- ✅ `classSession.ts`
- ✅ `classGroup.ts`
- ✅ `classroom.ts`
- ✅ `course.ts`
- ✅ `instructor.ts`
- ✅ `resourceRequest.ts`
- ✅ `timetable.ts`
- ✅ `user.ts`
- ✅ `department.ts`
- ✅ `program.ts`
- ✅ `index.ts` - Centralized export

## ✅ Phase 2: Program Head Feature Migration (COMPLETED)

### Use Cases to Migrate:
- ✅ 2.1 Create Class Session (PILOT COMPLETED)
  - Created vertical slice: `src/features/program-head/create-class-session/`
  - Files: component.tsx, hook.ts, service.ts, types.ts, index.ts
  - Follows vertical slice architecture pattern
  - Uses infrastructure services from `lib/services/`
  
- ✅ 2.2 Schedule Class Session (Timetable) (COMPLETED)
  - Created vertical slice: `src/features/program-head/schedule-class-session/`
  - Encapsulates timetabling workflow including:
    * Assignment, move, and remove operations
    * Conflict detection logic
    * Drag-and-drop state management
    * Multi-view mode support (class-group, classroom, instructor)
  - Demonstrates separation of complex business logic from presentation
  
- ✅ 2.3 Request Cross-Department Resource (COMPLETED)
  - Created vertical slice: `src/features/program-head/request-cross-dept-resource/`
  - Encapsulates cross-department resource request workflow including:
    * Resource eligibility checking via DB function
    * Request confirmation modal
    * Navigation to scheduler for assignment
  - Separates cross-dept request logic from class session creation
  
- ✅ 2.4 View Pending Requests (COMPLETED)
  - Created vertical slice: `src/features/program-head/view-pending-requests/`
  - Encapsulates viewing and managing outgoing resource requests including:
    * Fetching user's own requests
    * Dismissing reviewed requests
    * Cancelling pending/approved requests
    * Request status filtering and display
  
- ✅ 2.5 Manage Sessions (COMPLETED)
  - Created vertical slice: `src/features/program-head/manage-sessions/`
  - Encapsulates class session management including:
    * List view with filtering
    * Edit session details
    * Delete sessions with cascade handling
    * Search and filter capabilities

### Pilot Learnings:
- Vertical slice pattern successfully separates concerns
- Service layer acts as thin wrapper over infrastructure services
- Hook encapsulates all business logic and side effects
- Component remains pure presentation layer
- Types provide use-case specific contracts
- Pattern scales well even for complex features (timetabling with drag-and-drop)

## ✅ Phase 3: Department Head Feature Migration (COMPLETED)

### Use Cases to Migrate:
- ✅ 3.1 Approve Cross-Department Request (COMPLETED)
  - Created vertical slice: `src/features/department-head/approve-request/`
  - Encapsulates approval workflow using DB function
  - Hook handles loading states and toast notifications
  
- ✅ 3.2 Reject Cross-Department Request (COMPLETED)
  - Created vertical slice: `src/features/department-head/reject-request/`
  - Includes rejection message validation
  - Uses DB function for atomic rejection and restoration
  
- ✅ 3.3 Manage Instructors (COMPLETED)
  - Created vertical slice: `src/features/department-head/manage-instructors/`
  - Encapsulates instructor CRUD operations with department scoping
  - Migrated from AdminInstructorManagement.tsx
  - Supports both admin (cross-department) and department head views
- ✅ 3.4 View Department Requests (COMPLETED)
  - Created vertical slice: `src/features/department-head/view-department-requests/`
  - Fetches requests for department with filtering
  - Supports status and resource type filters

## ✅ Phase 4: Admin Feature Migration (COMPLETED)

### Use Cases Migrated:
- ✅ 4.1 Manage Users (COMPLETED)
  - Created vertical slice: `src/features/admin/manage-users/`
  - Encapsulates user CRUD operations with filtering
  - Uses infrastructure services for user management
  
- ✅ 4.2 Manage Departments (COMPLETED)
  - Created vertical slice: `src/features/admin/manage-departments/`
  - Full CRUD operations for departments
  - Integrates with department service layer

- ✅ 4.4 Manage Classrooms (COMPLETED)
  - Created vertical slice: `src/features/admin/manage-classrooms/`
  - Encapsulates classroom CRUD operations for admins
  - Migrated from ClassroomTab.tsx
  - Includes department preference prioritization
  
- ⏳ 4.3 System Configuration (DEFERRED)
  - To be addressed when specific configuration requirements are defined

## ✅ Phase 5: Shared Features Migration (COMPLETED)

- ✅ 5.1 Authentication Restructure (COMPLETED)
  - Moved authentication from `src/features/auth/` to `src/features/shared/auth/`
  - Updated all imports throughout the codebase
  - Fixed ES module compatibility in build verification script
  - Centralized shared authentication functionality
  
- ✅ 5.2 Global State Optimization (COMPLETED)
  - Fixed import paths in timetabling hooks to use shared auth

## ✅ Phase 6: Routes Reorganization (COMPLETED)

- ✅ 6.1 Role-based Route Configuration (COMPLETED)
  - Created `src/routes/AdminRoutes.tsx` - Admin-only routes
  - Created `src/routes/DepartmentHeadRoutes.tsx` - Department head routes
  - Created `src/routes/ProgramHeadRoutes.tsx` - Program head routes
  - Created `src/routes/SharedRoutes.tsx` - Routes for all authenticated users
  - Created `src/routes/index.tsx` - Centralized route exports
  
- ✅ 6.2 Route Guards Update (COMPLETED)
  - Maintained RoleGuardedPage wrapper for role-based access control
  - Routes organized by role in App.tsx for better clarity
  - All routes properly guarded with appropriate role requirements

## ⏳ Phase 7: Testing Migration (PENDING)

- ⏳ 7.1 Reorganize Tests by Use Case

## ⏳ Phase 8: Cleanup (PENDING)

- ⏳ 8.1 Remove Old Feature Directories
- ⏳ 8.2 Update Documentation

---

## Key Benefits Already Achieved

1. **Centralized Data Layer**: All database operations now in one place (`lib/services/`)
2. **Type Safety**: Global types ensure consistency across the codebase
3. **Clear Foundation**: Directory structure ready for feature migration
4. **Better Navigation**: Easy to find any database operation
5. **Role-Based Routes**: Clear separation of routes by user role
6. **Consistent Architecture**: Vertical slice pattern applied across all features

## Next Steps

1. Phase 7: Testing Migration - Reorganize tests to match vertical slice structure
2. Phase 8: Cleanup - Remove deprecated code and update documentation

## Important Notes

- ⚠️ **Old code still works**: Existing features still import from original locations where not migrated
- ⚠️ **No breaking changes yet**: This is a foundation phase only
- ✅ **Routes reorganized**: All routes now organized by role for better maintainability

## Archived Plan of file structure (may be outdated)

src/
     2 ├── features/                                    # Role-focused vertical slices
     3 │   ├── program-head/                           # Program Head workflows
     4 │   │   ├── create-class-session/              # Complete use case: Create session
     5 │   │   │   ├── component.tsx                  # Form UI
     6 │   │   │   ├── hook.tsx                      # Business logic
     7 │   │   │   ├── service.ts                     # Database operations (calls lib/services)
     8 │   │   │   └── types.ts                      # Use-case specific types
     9 │   │   ├── schedule-class-session/            # Complete use case: Schedule with DnD
    10 │   │   │   ├── component.tsx                  # Timetable UI
    11 │   │   │   ├── hook.tsx                      # Scheduling & resource update logic
    12 │   │   │   ├── service.ts                     # Calls lib/services
    13 │   │   │   ├── types.ts                      # Scheduling specific types
    14 │   │   │   └── utils.ts                      # Scheduling utilities
    15 │   │   ├── request-cross-dept-resource/       # Complete use case: Request approval
    16 │   │   │   ├── component.tsx                  # Request form/modal
    17 │   │   │   ├── hook.tsx                      # Cross-department detection logic
    18 │   │   │   ├── service.ts                     # Calls lib/services
    19 │   │   │   └── types.ts
    20 │   │   ├── view-pending-requests/             # Complete use case: Track requests
    21 │   │   │   ├── component.tsx                  # Notification panel
    22 │   │   │   ├── hook.tsx                      # Fetch pending requests
    23 │   │   │   └── types.ts
    24 │   │   ├── manage-sessions/                  # Complete use case: Edit/delete
    25 │   │   │   ├── component.tsx
    26 │   │   │   ├── hook.tsx
    27 │   │   │   └── types.ts
    28 │   │   └── shared/                           # Truly shared within role
    29 │   │       └── permissions.ts                # Program Head specific permissions
    30 │   │
    31 │   ├── department-head/                       # Department Head workflows
    32 │   │   ├── approve-cross-dept-request/        # Complete use case: Approve requests
    33 │   │   │   ├── component.tsx                  # Approval UI in notifications
    34 │   │   │   ├── hook.tsx                      # Approval business logic
    35 │   │   │   ├── service.ts                     # Calls lib/services
    36 │   │   │   └── types.ts
    37 │   │   ├── reject-cross-dept-request/         # Complete use case: Reject requests
    38 │   │   │   ├── component.tsx                  # Rejection dialog
    39 │   │   │   ├── hook.tsx                      # Rejection logic
    40 │   │   │   └── types.ts
    41 │   │   ├── manage-instructors/               # Complete use case: Department instructors
    42 │   │   │   ├── component.tsx
    43 │   │   │   ├── hook.tsx
    44 │   │   │   └── types.ts
    45 │   │   ├── view-pending-requests/            # Complete use case: Review requests
    46 │   │   │   ├── component.tsx                  # Request notifications
    47 │   │   │   ├── hook.tsx                      # Fetch department requests
    48 │   │   │   └── types.ts
    49 │   │   └── shared/                           # Department Head specific
    50 │   │       └── permissions.ts                # Department Head permissions
    51 │   │
    52 │   ├── admin/                                # Admin workflows
    53 │   │   ├── manage-users/                     # Complete use case: User management
    54 │   │   │   ├── component.tsx
    55 │   │   │   ├── hook.tsx
    56 │   │   │   └── types.ts
    57 │   │   ├── manage-departments/               # Complete use case: Department management
    58 │   │   │   ├── component.tsx
    59 │   │   │   ├── hook.tsx
    60 │   │   │   └── types.ts
    61 │   │   ├── system-configuration/             # Complete use case: Config management
    62 │   │   │   ├── component.tsx
    63 │   │   │   ├── hook.tsx
    64 │   │   │   └── types.ts
    65 │   │   └── shared/
    66 │   │       └── permissions.ts                # Admin permissions
    67 │   │
    68 │   └── shared/                               # Truly shared across all roles
    69 │       ├── auth/                            # Authentication logic
    70 │       │   ├── login/
    71 │       │   │   ├── component.tsx
    72 │       │   │   ├── hook.tsx
    73 │       │   │   └── types.ts
    74 │       │   ├── profile/
    75 │       │   │   ├── component.tsx
    76 │       │   │   └── hook.tsx
    77 │       │   └── shared/
    78 │       │       └── types.ts
    79 │       └── general/                         # Truly universal components
    80 │           ├── notifications/               # Notification infrastructure
    81 │           └── shared/
    82 │               ├── types.ts                # Global types
    83 │               └── constants.ts            # Global constants
    84 │
    85 ├── lib/                                       # Infrastructure layer (horizontal)
    86 │   ├── services/                            # ALL database operations (consolidated)
    87 │   │   ├── resourceRequestService.ts        # ALL resource request operations
    88 │   │   ├── classSessionService.ts           # ALL class session operations
    89 │   │   ├── timetableService.ts              # ALL timetable operations
    90 │   │   ├── userService.ts                   # ALL user operations
    91 │   │   ├── notificationService.ts           # ALL notification operations
    92 │   │   └── authService.ts                   # ALL auth operations
    93 │   ├── database/                            # Database utilities
    94 │   │   └── supabaseClient.ts                # Client configuration
    95 │   ├── hooks/                               # Cross-cutting React hooks
    96 │   │   └── useRealtime.ts                   # Global realtime hook (replaces contexts)
    97 │   └── utils/                               # Shared utilities
    98 │       ├── validation.ts                    # Validation utilities
    99 │       ├── formatting.ts                    # Formatting utilities
   100 │       └── errorHandling.ts                 # Error handling utilities
   101 │
   102 ├── components/                              # Reusable UI components (horizontal)
   103 │   ├── ui/                                 # UI primitives
   104 │   │   ├── Button.tsx                       # Reusable button
   105 │   │   ├── Dialog.tsx                       # Reusable dialog
   106 │   │   ├── Input.tsx                        # Reusable input
   107 │   │   └── ...                             # Other primitives
   108 │   └── common/                             # Higher-level reusable components
   109 │       ├── Sidebar.tsx                      # Navigation sidebar
   110 │       ├── Header.tsx                       # Page header
   111 │       └── Layout.tsx                       # Page layout
   112 │
   113 ├── contexts/                                # Global React state (minimal use)
   114 │   └── GlobalStateProvider.tsx              # Only truly global state
   115 │
   116 ├── routes/                                  # Route configuration (horizontal)
   117 │   ├── AppRoutes.tsx                        # Main route configuration
   118 │   ├── PrivateRoute.tsx                     # Route protection
   119 │   └── RouteGuards.tsx                      # Role-based route access
   120 │
   121 ├── types/                                   # Global type definitions
   122 │   ├── global.ts                            # Global types
   123 │   └── supabase.types.ts                    # Database types (auto-generated)
   124 │
   125 ├── constants/                               # Global constants
   126 │   ├── roles.ts                             # User roles
   127 │   ├── permissions.ts                       # Permission definitions
   128 │   └── routes.ts                           # Route definitions
   129 │
   130 ├── config/                                  # Configuration files
   131 │   ├── appConfig.ts                         # Application configuration
   132 │   └── apiConfig.ts                         # API configuration
   133 │
   134 ├── tests/                                   # Test utilities and shared test logic
   135 │   ├── setup/                              # Test setup
   136 │   ├── fixtures/                           # Test data
   137 │   └── utils/                              # Test utilities
   138 │
   139 ├── hooks/                                   # Custom hooks (horizontal)
   140 │   └── index.ts                            # Export all custom hooks
   141 │
   142 └── App.tsx                                  # Main application component