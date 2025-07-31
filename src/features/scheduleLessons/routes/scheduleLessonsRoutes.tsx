import { Route } from 'react-router-dom';
import PrivateRoute from '../../auth/components/PrivateRoute';
import ErrorBoundary from '../../../components/ui/ErrorBoundary';

// Import Pages
import ClassSessions from '../pages/ClassSessions';
import Scheduler from '../pages/Scheduler';
import ComponentManagement from '../pages/classSessionComponents';

// A component that renders all routes related to the schedule lessons feature
export function ScheduleLessonsRoutes() {
  return (
    <>
      <Route
        path="/class-sessions"
        element={
          <PrivateRoute>
            <ErrorBoundary fallbackMessage="Could not load the Class Sessions page.">
              <ClassSessions />
            </ErrorBoundary>
          </PrivateRoute>
        }
      />
      <Route
        path="/scheduler"
        element={
          <PrivateRoute>
            <ErrorBoundary fallbackMessage="Could not load the Scheduler.">
              <Scheduler />
            </ErrorBoundary>
          </PrivateRoute>
        }
      />
      <Route
        path="/component-management"
        element={
          <PrivateRoute>
            <ErrorBoundary fallbackMessage="Could not load the Component Management page.">
              <ComponentManagement />
            </ErrorBoundary>
          </PrivateRoute>
        }
      />
    </>
  );
}
