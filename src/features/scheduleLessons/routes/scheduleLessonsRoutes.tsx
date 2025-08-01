import { Outlet, Route } from 'react-router-dom';
import PrivateRoute from '../../auth/components/PrivateRoute';

// Import Pages
import ClassSessions from '../pages/ClassSessions';
import Scheduler from '../pages/Scheduler';
import ComponentManagement from '../pages/classSessionComponents';
import ErrorBoundary from '../../../components/ui/ErrorBoundary';
import ScheduleConfigPage from '../pages/ScheduleConfigPage';

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
