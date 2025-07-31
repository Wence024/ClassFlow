import React, { useState, useEffect } from 'react';
import { z } from 'zod';
import { resetPasswordSchema } from '../types/validation';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../../../lib/supabase';

// Helper to parse tokens and errors from hash
function parseHash(hash: string) {
  const params = new URLSearchParams(hash.replace(/^#/, ''));
  return {
    accessToken: params.get('access_token'),
    refreshToken: params.get('refresh_token'),
    error: params.get('error'),
    errorDescription: params.get('error_description'),
  };
}

const ResetPasswordPage: React.FC = () => {
  const [formData, setFormData] = useState({ password: '', confirmPassword: '' });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Store tokens and errors from hash or query
  const [tokens, setTokens] = useState<{
    accessToken: string | null;
    refreshToken: string | null;
    error: string | null;
    errorDescription: string | null;
  }>({ accessToken: null, refreshToken: null, error: null, errorDescription: null });

  useEffect(() => {
    // Parse tokens/errors from hash and query string
    const hash = window.location.hash;
    const hashTokens = parseHash(hash);
    const accessToken = hashTokens.accessToken || searchParams.get('access_token');
    const refreshToken = hashTokens.refreshToken || searchParams.get('refresh_token');
    const error = hashTokens.error;
    const errorDescription = hashTokens.errorDescription;
    setTokens({ accessToken, refreshToken, error, errorDescription });

    // Show error if present in hash
    if (errorDescription) {
      setApiError(decodeURIComponent(errorDescription));
    } else if (!accessToken || !refreshToken) {
      setApiError(
        'Invalid or missing reset link parameters. Please request a new password reset link.'
      );
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors({});
    setApiError(null);

    try {
      resetPasswordSchema.parse(formData);
    } catch (err) {
      if (err instanceof z.ZodError) {
        const errors: Record<string, string> = {};
        err.issues.forEach((e) => {
          const key = e.path[0];
          if (typeof key === 'string') errors[key] = e.message;
        });
        setFormErrors(errors);
      }
      return;
    }

    setLoading(true);

    try {
      const { accessToken, refreshToken } = tokens;
      if (!accessToken || !refreshToken) {
        throw new Error('Invalid reset link');
      }

      // Set the session with the tokens from the reset link
      const { error: sessionError } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      });

      if (sessionError) {
        throw new Error('Invalid or expired reset link');
      }

      // Update the password
      const { error: updateError } = await supabase.auth.updateUser({
        password: formData.password,
      });

      if (updateError) {
        throw new Error(updateError.message);
      }

      setSuccess(true);
      // Redirect to login after a short delay
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to reset password';
      setApiError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  if (success) {
    return (
      <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md text-center">
        <h2 className="text-2xl font-bold mb-6">Password Reset Successful</h2>
        <p className="mb-4">
          Your password has been successfully reset. You are now logged in.
          <br />
          You can continue to your dashboard.
        </p>
        <button
          onClick={() => navigate('/class-sessions')}
          className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors mt-2"
        >
          Go to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Reset Password</h2>
      <form onSubmit={handleSubmit} noValidate role="form" aria-label="Reset password form">
        <div className="mb-4">
          <label htmlFor="password">New Password:</label>
          <input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
            autoComplete="new-password"
            aria-label="New password"
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {formErrors.password && (
            <p className="text-red-600 text-sm mt-1">{formErrors.password}</p>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="confirmPassword">Confirm New Password:</label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            autoComplete="new-password"
            aria-label="Confirm new password"
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {formErrors.confirmPassword && (
            <p className="text-red-600 text-sm mt-1">{formErrors.confirmPassword}</p>
          )}
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-60"
        >
          {loading ? 'Resetting...' : 'Reset Password'}
        </button>
        {apiError && (
          <div className="text-red-600 mt-3 text-center" role="alert" aria-live="assertive">
            {apiError}
          </div>
        )}
      </form>
      <div className="mt-6 text-center">
        <button
          onClick={() => navigate('/login')}
          className="bg-transparent border-none text-blue-600 hover:underline cursor-pointer"
        >
          Back to Login
        </button>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
