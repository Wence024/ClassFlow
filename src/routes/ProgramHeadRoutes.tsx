import { Route, Navigate } from 'react-router-dom';
import ClassSessions from '@/features/classSessions/pages/ClassSessionsPage';
import TimetablePage from '@/features/timetabling/pages/TimetablePage';
import ComponentManagement from '@/features/classSessionComponents/pages';

/**
 * Routes for program head features.
 * These routes are accessible to all authenticated users (program heads, dept heads, admins).
 */
export const ProgramHeadRoutes = (
  <>
    <Route path="/" element={<Navigate to="/class-sessions" replace />} />
    <Route path="/class-sessions" element={<ClassSessions />} />
    <Route path="/scheduler" element={<TimetablePage />} />
    <Route path="/component-management" element={<ComponentManagement />} />
  </>
);
