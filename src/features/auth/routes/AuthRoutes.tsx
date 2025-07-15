import { Route } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import ForgotPasswordPage from '../pages/ForgotPasswordPage';
import VerifyEmailPage from '../pages/VerifyEmailPage';
import ResetPasswordPage from '../pages/ResetPasswordPage';

const authRoutes = [
  <Route path="/login" element={<LoginPage />} key="login" />,
  <Route path="/register" element={<RegisterPage />} key="register" />,
  <Route path="/forgot-password" element={<ForgotPasswordPage />} key="forgot-password" />,
  <Route path="/verify-email" element={<VerifyEmailPage />} key="verify-email" />,
  <Route path="/reset-password" element={<ResetPasswordPage />} key="reset-password" />,
];

export { authRoutes };

// TODO: Centralize api access to the AuthContext, service and apis instead of direct call. Involves resetPassword and verifyEmail components. Apply to loading setStates as well.
// TODO: Do major refactoring between auth service, context and apis for separation of concerns. See saved reference in Deepseek
