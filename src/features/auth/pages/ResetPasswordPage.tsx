import React, { useState, useEffect } from 'react';
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
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
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
      setError(decodeURIComponent(errorDescription));
    } else if (!accessToken || !refreshToken) {
      setError(
        'Invalid or missing reset link parameters. Please request a new password reset link.'
      );
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    setError(null);

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
        password: password,
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
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
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
      <form onSubmit={handleSubmit} role="form" aria-label="Reset password form">
        <div className="mb-4">
          <label htmlFor="reset-password" className="block font-semibold mb-1">
            New Password:
          </label>
          <input
            id="reset-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="new-password"
            aria-label="New password"
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="reset-confirm-password" className="block font-semibold mb-1">
            Confirm New Password:
          </label>
          <input
            id="reset-confirm-password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            autoComplete="new-password"
            aria-label="Confirm new password"
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <button
          type="submit"
          disabled={loading || !!tokens.error}
          className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-60"
        >
          {loading ? 'Resetting...' : 'Reset Password'}
        </button>
        {error && (
          <div className="text-red-600 mt-3 text-center" role="alert" aria-live="assertive">
            {error}
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
