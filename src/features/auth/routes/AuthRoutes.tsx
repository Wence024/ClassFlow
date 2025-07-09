import { Route } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import ForgotPasswordPage from '../pages/ForgotPasswordPage';
import VerifyEmailPage from '../pages/VerifyEmailPage';

const authRoutes = [
  <Route path="/login" element={<LoginPage />} key="login" />,
  <Route path="/register" element={<RegisterPage />} key="register" />,
  <Route path="/forgot-password" element={<ForgotPasswordPage />} key="forgot-password" />,
  <Route path="/verify-email" element={<VerifyEmailPage />} key="verify-email" />,
];

export { authRoutes };

// TODO: Assess incorrect feedback when registering.
