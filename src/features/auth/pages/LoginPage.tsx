import React, { useState, useEffect, useRef } from 'react';
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
  const { login, loading, error, user, clearError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const clearErrorRef = useRef(clearError);

  // Update ref when clearError changes
  useEffect(() => {
    clearErrorRef.current = clearError;
  }, [clearError]);

  useEffect(() => {
    if (user) {
      navigate('/class-sessions');
    }
  }, [user, navigate]);

  // Clear error when component unmounts
  useEffect(() => {
    return () => {
      clearErrorRef.current();
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, password);
    // No redirect or success state here; handled by useEffect when user is set
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
      <form onSubmit={handleSubmit} role="form" aria-label="Login form">
        <div className="mb-4">
          <label htmlFor="login-email" className="block font-semibold mb-1">
            Email:
          </label>
          <input
            id="login-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="username"
            aria-label="Email address"
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="login-password" className="block font-semibold mb-1">
            Password:
          </label>
          <div className="relative">
            <input
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              aria-label="Password"
              className="w-full p-2 pr-10 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer p-0 text-lg"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              tabIndex={0}
            >
              <EyeIcon open={showPassword} />
            </button>
          </div>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-60"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
        {error && (
          <div className="text-red-600 mt-3 text-center" role="alert" aria-live="assertive">
            {error}
          </div>
        )}
      </form>
      <div className="mt-6 text-center space-y-2">
        <Link to="/register" className="text-blue-600 hover:underline block">
          Don't have an account? Register
        </Link>
        <Link
          to={`/forgot-password${email ? `?email=${encodeURIComponent(email)}` : ''}`}
          className="text-blue-600 hover:underline block"
        >
          Forgot Password?
        </Link>
      </div>
    </div>
  );
};

export default LoginPage;
