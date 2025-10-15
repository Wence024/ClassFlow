import { Outlet, Route } from 'react-router-dom';
import { ErrorBoundary } from '../components/ui';
import LoginPage from '../features/auth/pages/LoginPage';
import ForgotPasswordPage from '../features/auth/pages/ForgotPasswordPage';
import VerifyEmailPage from '../features/auth/pages/VerifyEmailPage';
import ResetPasswordPage from '../features/auth/pages/ResetPasswordPage';
import CompleteRegistrationPage from '../features/auth/pages/CompleteRegistrationPage';

/**
 *  A component that renders all routes related to the auth feature.
 */
export const AuthRoutes = (
  <Route
    element={
      <ErrorBoundary fallbackMessage="A problem occurred in the authentication flow.">
        <Outlet />
      </ErrorBoundary>
    }
  >
    <Route path="/login" element={<LoginPage />} />
    <Route path="/forgot-password" element={<ForgotPasswordPage />} />
    <Route path="/verify-email" element={<VerifyEmailPage />} />
    <Route path="/reset-password" element={<ResetPasswordPage />} />
    <Route path="/complete-registration" element={<CompleteRegistrationPage />} />
  </Route>
);
