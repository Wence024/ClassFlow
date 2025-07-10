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
      <div
        style={{
          maxWidth: 400,
          margin: '40px auto',
          padding: 24,
          background: '#fff',
          borderRadius: 8,
          boxShadow: '0 2px 8px #0001',
        }}
      >
        <h2>Password Reset Successful</h2>
        <p>
          Your password has been successfully reset. You are now logged in.
          <br />
          You can continue to your dashboard.
        </p>
        <button
          onClick={() => navigate('/class-sessions')}
          style={{ width: '100%', padding: 10, marginTop: 16 }}
        >
          Go to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div
      style={{
        maxWidth: 400,
        margin: '40px auto',
        padding: 24,
        background: '#fff',
        borderRadius: 8,
        boxShadow: '0 2px 8px #0001',
      }}
    >
      <h2>Reset Password</h2>
      <form onSubmit={handleSubmit} role="form" aria-label="Reset password form">
        <div style={{ marginBottom: 12 }}>
          <label htmlFor="reset-password">New Password:</label>
          <input
            id="reset-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="new-password"
            aria-label="New password"
            style={{ width: '100%', padding: 8, marginTop: 4 }}
          />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label htmlFor="reset-confirm-password">Confirm New Password:</label>
          <input
            id="reset-confirm-password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            autoComplete="new-password"
            aria-label="Confirm new password"
            style={{ width: '100%', padding: 8, marginTop: 4 }}
          />
        </div>
        <button
          type="submit"
          disabled={loading || !!tokens.error}
          style={{ width: '100%', padding: 10 }}
        >
          {loading ? 'Resetting...' : 'Reset Password'}
        </button>
        {error && (
          <div style={{ color: 'red', marginTop: 10 }} role="alert" aria-live="assertive">
            {error}
          </div>
        )}
      </form>
      <div style={{ marginTop: 16, textAlign: 'center' }}>
        <button
          onClick={() => navigate('/login')}
          style={{ background: 'none', border: 'none', color: '#007bff', cursor: 'pointer' }}
        >
          Back to Login
        </button>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
