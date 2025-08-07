import { Outlet, Route } from 'react-router-dom';
import { ErrorBoundary } from '../../../components/ui';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import ForgotPasswordPage from '../pages/ForgotPasswordPage';
import VerifyEmailPage from '../pages/VerifyEmailPage';
import ResetPasswordPage from '../pages/ResetPasswordPage';

/**
 *  A component that renders all routes related to the auth feature
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
    <Route path="/register" element={<RegisterPage />} />
    <Route path="/forgot-password" element={<ForgotPasswordPage />} />
    <Route path="/verify-email" element={<VerifyEmailPage />} />
    <Route path="/reset-password" element={<ResetPasswordPage />} />
  </Route>
);
