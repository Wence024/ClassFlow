import { Route } from 'react-router-dom';
import RoleGuardedPage from '@/components/layout/RoleGuardedPage';
import DepartmentHeadDashboard from '@/features/admin/manage-departments/pages/DepartmentHeadDashboard';

/**
 * Routes for department head features.
 * All routes are wrapped with requiresDeptHead role guard.
 */
export const DepartmentHeadRoutes = (
  <>
    <Route
      path="/department-head"
      element={
        <RoleGuardedPage requiresDeptHead>
          <DepartmentHeadDashboard />
        </RoleGuardedPage>
      }
    />
  </>
);
