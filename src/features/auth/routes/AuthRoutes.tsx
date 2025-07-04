import { Route } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import ForgotPasswordPage from '../pages/ForgotPasswordPage';

const authRoutes = [
  <Route path="/login" element={<LoginPage />} key="login" />,
  <Route path="/register" element={<RegisterPage />} key="register" />,
  <Route path="/forgot-password" element={<ForgotPasswordPage />} key="forgot-password" />,
];

export { authRoutes };
