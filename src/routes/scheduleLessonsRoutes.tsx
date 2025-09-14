import { Route } from 'react-router-dom';
import PrivateRoute from '../features/auth/components/PrivateRoute';
import AppLayout from '../components/layout/AppLayout'; // 1. Import the new layout
import ClassSessions from '../features/classSessions/pages/ClassSessionsPage';
import TimetablePage from '../features/timetabling/pages/TimetablePage';
import ComponentManagement from '../features/classSessionComponents/pages';
import { ErrorBoundary } from '../components/ui';
import ScheduleConfigPage from '../features/scheduleConfig/pages/ScheduleConfigPage';

/**
 * Defines all the routes for the main, authenticated part of the application.
 *
 * This route group is wrapped in an `ErrorBoundary`, a `PrivateRoute` guard to ensure
 * the user is logged in, and the main `AppLayout` to provide a consistent UI shell.
 */
export const ScheduleLessonsRoutes = (
  <Route
    element={
      <ErrorBoundary fallbackMessage="A problem occurred in the scheduleLessons page.">
        {/* 2. Use PrivateRoute and AppLayout as the parent wrapper */}
        <PrivateRoute>
          <AppLayout />
        </PrivateRoute>
      </ErrorBoundary>
    }
  >
    {/* 3. The pages are now children of the layout, rendered via <Outlet /> */}
    <Route path="/class-sessions" element={<ClassSessions />} />
    <Route path="/scheduler" element={<TimetablePage />} />
    <Route path="/component-management" element={<ComponentManagement />} />
    <Route path="/schedule-configuration" element={<ScheduleConfigPage />} />
  </Route>
);
