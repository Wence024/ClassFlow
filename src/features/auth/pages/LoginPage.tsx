import React, { useState, useEffect, useRef } from 'react';
import { z } from 'zod';
import { loginSchema } from '../types/validation';
import { useAuth } from '../hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';

const EyeIcon = ({ open }: { open: boolean }) =>
  open ? (
    // Eye open SVG
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 18"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    // Eye off SVG (fixed)
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 18"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" />
      <path d="M1 1l22 22" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );

const LoginPage: React.FC = () => {
  // Destructure the API error separately from form validation errors
  const { login, loading, error: apiError, user, clearError } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const clearErrorRef = useRef(clearError);

  useEffect(() => {
    clearErrorRef.current = clearError;
  }, [clearError]);
  useEffect(() => {
    if (user) navigate('/class-sessions');
  }, [user, navigate]);
  useEffect(() => {
    return () => {
      clearErrorRef.current();
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors({});
    clearError();

    try {
      const validatedData = loginSchema.parse(formData);
      await login(validatedData.email, validatedData.password);
    } catch (err) {
      if (err instanceof z.ZodError) {
        const errors: Record<string, string> = {};
        err.issues.forEach((e) => {
          const key = e.path[0];
          if (typeof key === 'string') errors[key] = e.message;
        });
        setFormErrors(errors);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
      <form onSubmit={handleSubmit} noValidate>
        <div className="mb-4">
          <label htmlFor="email" className="block font-semibold mb-1">
            Email:
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            autoComplete="username"
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {formErrors.email && <p className="text-red-600 text-sm mt-1">{formErrors.email}</p>}
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block font-semibold mb-1">
            Password:
          </label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange}
              required
              autoComplete="current-password"
              className="w-full p-2 pr-10 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-0"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              <EyeIcon open={showPassword} />
            </button>
          </div>
          {formErrors.password && (
            <p className="text-red-600 text-sm mt-1">{formErrors.password}</p>
          )}
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-60"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
        {apiError && <div className="text-red-600 mt-3 text-center">{apiError}</div>}
      </form>
      <div className="mt-6 text-center space-y-2">
        <Link to="/register" className="text-blue-600 hover:underline block">
          Don't have an account? Register
        </Link>
        <Link
          to={`/forgot-password${formData.email ? `?email=${encodeURIComponent(formData.email)}` : ''}`}
          className="text-blue-600 hover:underline block"
        >
          Forgot Password?
        </Link>
      </div>
    </div>
  );
};

export default LoginPage;
