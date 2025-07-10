import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Link } from 'react-router-dom';

const RegisterPage: React.FC = () => {
  const { register, loading, error, clearError } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const clearErrorRef = useRef(clearError);

  // Update ref when clearError changes
  useEffect(() => {
    clearErrorRef.current = clearError;
  }, [clearError]);

  // Clear error when component unmounts
  useEffect(() => {
    return () => {
      clearErrorRef.current();
    };
  }, []);

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!name) errors.name = 'Name is required';
    if (!email) errors.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(email)) errors.email = 'Email is invalid';
    if (!password) errors.password = 'Password is required';
    if (password !== confirmPassword) errors.confirmPassword = 'Passwords do not match';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      await register(name, email, password);
    } catch {
      // Error handling is done in the AuthContext
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
      <form onSubmit={handleSubmit} role="form" aria-label="Register form">
        <div className="mb-4">
          <label htmlFor="register-name" className="block font-semibold mb-1">
            Name:
          </label>
          <input
            id="register-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoComplete="name"
            aria-label="Name"
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {formErrors.name && (
            <div className="text-red-600 text-sm mt-1" role="alert" aria-live="assertive">
              {formErrors.name}
            </div>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="register-email" className="block font-semibold mb-1">
            Email:
          </label>
          <input
            id="register-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            aria-label="Email address"
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {formErrors.email && (
            <div className="text-red-600 text-sm mt-1" role="alert" aria-live="assertive">
              {formErrors.email}
            </div>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="register-password" className="block font-semibold mb-1">
            Password:
          </label>
          <input
            id="register-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="new-password"
            aria-label="Password"
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {formErrors.password && (
            <div className="text-red-600 text-sm mt-1" role="alert" aria-live="assertive">
              {formErrors.password}
            </div>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="register-confirm-password" className="block font-semibold mb-1">
            Confirm Password:
          </label>
          <input
            id="register-confirm-password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            autoComplete="new-password"
            aria-label="Confirm password"
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {formErrors.confirmPassword && (
            <div className="text-red-600 text-sm mt-1" role="alert" aria-live="assertive">
              {formErrors.confirmPassword}
            </div>
          )}
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-60"
        >
          {loading ? 'Registering...' : 'Register'}
        </button>
        {error && (
          <div className="text-red-600 mt-3 text-center" role="alert" aria-live="assertive">
            {error}
          </div>
        )}
      </form>
      <div className="mt-6 text-center">
        <Link to="/login" className="text-blue-600 hover:underline block">
          Already have an account? Login
        </Link>
      </div>
    </div>
  );
};

export default RegisterPage;
