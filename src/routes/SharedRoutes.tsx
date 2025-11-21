import { Route } from 'react-router-dom';
import UserProfilePage from '@/features/shared/auth/pages/UserProfilePage';
import InstructorReportsPage from '@/features/shared/view-reports/pages/InstructorReportsPage';

/**
 * Routes shared across all roles.
 * These are accessible to all authenticated users.
 */
export const SharedRoutes = (
  <>
    <Route path="/reports/instructors" element={<InstructorReportsPage />} />
    <Route path="/profile" element={<UserProfilePage />} />
  </>
);
