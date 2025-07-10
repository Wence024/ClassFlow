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

// TODO: Clarify user error feedback such as merely "invalid login credentials" when entering a wrong email/password.
// TODO: Fix error message persisting login's "invalid login credentials" across register pages.
// TODO: When reloading but still in the verify-email page, redirect to home page (root of website for now)
// TODO: When logging out, redirect to login page instead of being stagnant at the home page (currently not protected nor existing).
// TODO: UX Feature. pass email from email field from login to the email field at the forgot-password page.
// TODO: Fix problem when clicking the gmail link to reset password, it redirects to the website homepage as if the reset password part was nonexistent.
