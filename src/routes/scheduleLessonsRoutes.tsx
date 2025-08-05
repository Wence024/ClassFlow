import { Outlet, Route } from 'react-router-dom';
import PrivateRoute from '../features/auth/components/PrivateRoute';

// Import Pages
import ClassSessions from '../features/classes/ClassSessionsPage';
import Scheduler from '../features/timetabling/TimetablePage';
import ComponentManagement from '../features/classComponents/pages';
import { ErrorBoundary } from '../components/ui';
import ScheduleConfigPage from '../features/scheduleConfig/ScheduleConfigPage';

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
          <Scheduler />
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
