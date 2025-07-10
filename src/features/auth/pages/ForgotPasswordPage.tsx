import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { supabase } from '../../../lib/supabase';

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchParams] = useSearchParams();

  // Pre-fill email from URL parameters
  useEffect(() => {
    const emailParam = searchParams.get('email');
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    // Use Supabase to send password reset link
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + '/reset-password',
    });
    if (error) {
      setError(error.message);
      setSent(false);
    } else {
      setSent(true);
    }
    setLoading(false);
  };

  if (sent) {
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
        A password reset link has been sent to {email}.<br />
        <Link to="/login">Back to Login</Link>
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
      <h2>Forgot Password</h2>
      <form onSubmit={handleSubmit} role="form" aria-label="Forgot password form">
        <div style={{ marginBottom: 12 }}>
          <label htmlFor="forgot-email">Email:</label>
          <input
            id="forgot-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            aria-label="Email address"
            style={{ width: '100%', padding: 8, marginTop: 4 }}
          />
        </div>
        <button type="submit" disabled={loading} style={{ width: '100%', padding: 10 }}>
          {loading ? 'Sending...' : 'Send Reset Link'}
        </button>
        {error && (
          <div style={{ color: 'red', marginTop: 10 }} role="alert" aria-live="assertive">
            {error}
          </div>
        )}
      </form>
      <div style={{ marginTop: 16, textAlign: 'center' }}>
        <Link to="/login">Back to Login</Link>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
