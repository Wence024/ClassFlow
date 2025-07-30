import { Route } from 'react-router-dom';
// Import your new ErrorBoundary component
import ErrorBoundary from '../../../components/ui/ErrorBoundary'; 

// Import Pages
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import ForgotPasswordPage from '../pages/ForgotPasswordPage';
import VerifyEmailPage from '../pages/VerifyEmailPage';
import ResetPasswordPage from '../pages/ResetPasswordPage';

// A component that renders all routes related to the auth feature
export function AuthRoutes() {
  return (
    // Wrap all auth routes in a single Error Boundary
    <ErrorBoundary fallbackMessage="A problem occurred in the authentication flow.">
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/verify-email" element={<VerifyEmailPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
    </ErrorBoundary>
  );
}