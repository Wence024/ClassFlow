import { Route, Navigate } from 'react-router-dom';
import { ManageClassSessionsPage } from '@/features/program-head/manage-class-sessions';
import { ManageComponentsPage } from '@/features/program-head/manage-components';
import TimetablePage from '@/features/program-head/schedule-class-session/pages/TimetablePage';

/**
 * Routes for program head features.
 * These routes are accessible to all authenticated users (program heads, dept heads, admins).
 */
export const ProgramHeadRoutes = (
  <>
    <Route path="/" element={<Navigate to="/class-sessions" replace />} />
    <Route path="/class-sessions" element={<ManageClassSessionsPage />} />
    <Route path="/scheduler" element={<TimetablePage />} />
    <Route path="/component-management" element={<ManageComponentsPage />} />
  </>
);
