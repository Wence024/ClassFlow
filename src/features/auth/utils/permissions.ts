/**
 * Client-side permission helpers. These gate UI/UX only and must mirror server-side RLS.
 * Source of truth remains in the database policies.
 */

export type RoleString = 'admin' | 'department_head' | 'program_head' | string;

/** Returns true if the role is admin. */
export function isAdmin(role: RoleString | null | undefined): boolean {
  return role === 'admin';
}

/** Returns true if the role is department_head. */
export function isDepartmentHead(role: RoleString | null | undefined): boolean {
  return role === 'department_head';
}

/** Returns true if the role is program_head. */
export function isProgramHead(role: RoleString | null | undefined): boolean {
  return role === 'program_head';
}

/** Admin or Department Head can manage instructors. */
export function canManageInstructors(role: RoleString | null | undefined): boolean {
  return role === 'admin' || role === 'department_head';
}

/** Only Admin can manage classrooms. */
export function canManageClassrooms(role: RoleString | null | undefined): boolean {
  return role === 'admin';
}

/** Admin or the Department Head of the department can review requests. */
export function canReviewRequestsForDepartment(
  role: RoleString | null | undefined,
  userDepartmentId: string | null | undefined,
  targetDepartmentId: string
): boolean {
  if (role === 'admin') return true;
  return role === 'department_head' && !!userDepartmentId && userDepartmentId === targetDepartmentId;
}

/** Admin or Department Head of the same department can manage a specific instructor row. */
export function canManageInstructorRow(
  role: RoleString | null | undefined,
  userDepartmentId: string | null | undefined,
  instructorDepartmentId: string
): boolean {
  if (role === 'admin') return true;
  return role === 'department_head' && !!userDepartmentId && userDepartmentId === instructorDepartmentId;
}

/** Program Head can manage assignments for their own program (optionally allow admin). */
export function canManageAssignmentsForProgram(
  role: RoleString | null | undefined,
  userProgramId: string | null | undefined,
  targetProgramId: string
): boolean {
  if (role === 'admin') return true;
  return role === 'program_head' && !!userProgramId && userProgramId === targetProgramId;
}


