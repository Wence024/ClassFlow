# Looking at the sidebar navigation (line 31 of Sidebar.tsx), program heads can access /component-management, which includes the Instructor Tab. But

❌ Program heads shouldn't be managing (create/edit/delete) instructors
✅ Program heads should only be browsing/selecting instructors for class sessions
❌ The UI shows them a management interface they can't use (due to RLS)
This creates confusion - they see the form but get permission errors.

Recommended Architecture

Role-Based Resource Access Model
Admin:

department_id: NULL (not needed)
Permissions: Manage everything
Department Head:

department_id: Explicitly assigned (required for RLS)
Permissions:
Manage instructors IN their department
Manage classrooms (if granted)
View all programs in their department
Program Head:

department_id: NULL (inferred via program)
program_id: Explicitly assigned (required)
Permissions:
Manage courses FOR their program
Manage class groups FOR their program
Manage class sessions FOR their program
Browse/SELECT instructors from ANY department
Cannot create/edit/delete instructors
