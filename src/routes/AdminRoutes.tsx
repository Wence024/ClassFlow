import { Route } from 'react-router-dom';
import RoleGuardedPage from '@/components/layout/RoleGuardedPage';
import ScheduleConfigPage from '@/features/scheduleConfig/pages/ScheduleConfigPage';
import DepartmentManagementPage from '@/features/departments/pages/DepartmentManagementPage';
import ProgramManagementPage from '@/features/programs/pages/ProgramManagementPage';
import UserManagementPage from '@/features/users/pages/UserManagementPage';

/**
 * Routes for admin-only features.
 * All routes are wrapped with requiresAdmin role guard.
 */
export const AdminRoutes = (
  <>
    <Route
      path="/schedule-configuration"
      element={
        <RoleGuardedPage requiresAdmin>
          <ScheduleConfigPage />
        </RoleGuardedPage>
      }
    />
    <Route
      path="/departments"
      element={
        <RoleGuardedPage requiresAdmin>
          <DepartmentManagementPage />
        </RoleGuardedPage>
      }
    />
    <Route
      path="/programs"
      element={
        <RoleGuardedPage requiresAdmin>
          <ProgramManagementPage />
        </RoleGuardedPage>
      }
    />
    <Route
      path="/user-management"
      element={
        <RoleGuardedPage requiresAdmin>
          <UserManagementPage />
        </RoleGuardedPage>
      }
    />
  </>
);
