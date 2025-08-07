import { Outlet, Route } from 'react-router-dom';
import PrivateRoute from '../features/auth/components/PrivateRoute';

// Import Pages
import ClassSessions from '../features/classSessions/pages/ClassSessionsPage';
import TimetablePage from '../features/timetabling/pages/TimetablePage';
import ComponentManagement from '../features/classSessionComponents/pages';
import { ErrorBoundary } from '../components/ui';
import ScheduleConfigPage from '../features/scheduleConfig/pages/ScheduleConfigPage';

// A component that renders all routes related to the schedule lessons feature
export const ScheduleLessonsRoutes = (
  <Route
    element={
      <ErrorBoundary fallbackMessage="A problem occurred in the scheduleLessons page.">
        <Outlet />
      </ErrorBoundary>
    }
  >
    <Route
      path="/class-sessions"
      element={
        <PrivateRoute>
          <ClassSessions />
        </PrivateRoute>
      }
    />

    <Route
      path="/scheduler"
      element={
        <PrivateRoute>
          <TimetablePage />
        </PrivateRoute>
      }
    />

    <Route
      path="/component-management"
      element={
        <PrivateRoute>
          <ComponentManagement />
        </PrivateRoute>
      }
    />

    <Route
      path="schedule-configuration"
      element={
        <PrivateRoute>
          <ScheduleConfigPage />
        </PrivateRoute>
      }
    />
  </Route>
);
