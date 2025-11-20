/**
 * Centralized route exports for role-based routing.
 * 
 * Route Organization:
 * - AuthRoutes: Public authentication routes (login, forgot password, etc.)
 * - AdminRoutes: Admin-only routes (departments, programs, users, config)
 * - DepartmentHeadRoutes: Department head routes (department dashboard)
 * - ProgramHeadRoutes: Program head routes (class sessions, scheduler, components)
 * - SharedRoutes: Routes accessible to all authenticated users (reports, profile)
 */

export { AuthRoutes } from './AuthRoutes';
export { AdminRoutes } from './AdminRoutes';
export { DepartmentHeadRoutes } from './DepartmentHeadRoutes';
export { ProgramHeadRoutes } from './ProgramHeadRoutes';
export { SharedRoutes } from './SharedRoutes';
