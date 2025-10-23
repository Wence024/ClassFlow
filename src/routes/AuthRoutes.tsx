import { Outlet, Route } from 'react-router-dom';
import { ErrorBoundary } from '../components/ui';
import { PublicRoute } from '../features/auth/components/PublicRoute';
import LoginPage from '../features/auth/pages/LoginPage';
import ForgotPasswordPage from '../features/auth/pages/ForgotPasswordPage';
import ResetPasswordPage from '../features/auth/pages/ResetPasswordPage';
import CompleteRegistrationPage from '../features/auth/pages/CompleteRegistrationPage';

/**
 * Routes for authentication-related pages.
 * Login/signup pages use PublicRoute to redirect authenticated users.
 */
export const AuthRoutes = (
  <Route
    element={
      <ErrorBoundary fallbackMessage="A problem occurred in the authentication flow.">
        <Outlet />
      </ErrorBoundary>
    }
  >
    <Route
      path="/login"
      element={
        <PublicRoute>
          <LoginPage />
        </PublicRoute>
      }
    />
    <Route path="/forgot-password" element={<ForgotPasswordPage />} />
    <Route path="/reset-password" element={<ResetPasswordPage />} />
    <Route path="/complete-registration" element={<CompleteRegistrationPage />} />
  </Route>
);
