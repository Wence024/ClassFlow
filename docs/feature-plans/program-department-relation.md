# Program-Department Relationship Feature

## Overview
This feature establishes a formal database relationship where each Program belongs to a single Department. This is a foundational change for future features such as department-level reporting and resource management.

## Implementation Status
✅ **Completed** (2025-10-15)

## Database Schema Changes

### Migration: `add_department_id_to_programs`
- Added `department_id` foreign key column to the `programs` table
- References `departments(id)` with `ON DELETE SET NULL` constraint
- Created index `idx_programs_department_id` for optimized lookups

```sql
ALTER TABLE public.programs
ADD COLUMN department_id uuid REFERENCES public.departments(id) ON DELETE SET NULL;

CREATE INDEX idx_programs_department_id ON public.programs(department_id);
```

## Data Model Updates

### Program Type
The `Program` type now includes:
- `department_id: string | null` - Foreign key reference to the department

### Validation Schema
Updated `programSchema` in `src/features/programs/types/validation.ts`:
- `department_id` is **required** (UUID format)
- Ensures all new programs are associated with a department

## UI Changes

### Program Management Page
**Location:** `src/features/programs/pages/ProgramManagementPage.tsx`

**Changes:**
- Integrated `useDepartments` hook to fetch available departments
- Passes `departmentOptions` to `ProgramFields` component
- Updated create/edit mutations to handle `department_id`

### Program Fields Component
**Location:** `src/features/programs/pages/components/program.tsx`

**Changes:**
- Added department selection dropdown using shadcn `Select` component
- Required field with validation
- Displays department name and code in format: `"{name} ({code})"`

### Program Card Display
**Location:** `src/features/programs/pages/components/program.tsx`

**Changes:**
- Displays associated department name below program information
- Shows "Department: {departmentName}" for better context
- Handles null department gracefully with fallback text

## Service Layer
No changes required - existing CRUD operations in `programsService.ts` automatically handle the new `department_id` field through the updated types.

## Testing Updates

### Integration Tests Updated
1. **ProgramManagementPage.integration.test.tsx**
   - Mocked `useDepartments` hook to provide test departments
   - Updated create/update mutation expectations to include `department_id`
   - All mock program data now includes `department_id`

2. **usePrograms.integration.test.tsx**
   - Updated test data to include `short_code` and `department_id`
   - Verified create/update operations handle department relationships correctly

## Usage

### Creating a New Program
1. Navigate to Program Management (admin only)
2. Fill in program name and code
3. **Select a department** from the dropdown (required)
4. Click "Create" to save

### Editing an Existing Program
1. Click "Edit" on a program card
2. Modify fields including department assignment
3. Click "Save Changes"

### Viewing Programs
- Program cards now display the associated department name
- Provides clear context for program organization

## Future Enhancements
- Department-level reporting and analytics
- Resource allocation by department
- Department-based access controls
- Cross-department resource sharing workflows

## Related Documentation
- [Department Management](../user-guide.md#department-management)
- [Class Merging Feature](./class-merging.md)
- [Department-Based Resource Management](./department-based-resource-management.md)

## Database Constraints
- **Foreign Key:** `department_id` references `departments(id)`
- **On Delete:** `SET NULL` - Deleting a department does not delete associated programs
- **Nullable:** Programs can exist without a department (legacy support)
- **Validation:** New programs require a department via application-level validation

## Security Considerations
- Row Level Security (RLS) policies on `programs` table remain unchanged
- Only admins can create/update/delete programs
- Department assignments respect existing access controls
