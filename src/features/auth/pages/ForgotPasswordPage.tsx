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
      <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md text-center">
        <p className="mb-4">
          A password reset link has been sent to <span className="font-semibold">{email}</span>.
        </p>
        <Link to="/login" className="text-blue-600 hover:underline">
          Back to Login
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Forgot Password</h2>
      <form onSubmit={handleSubmit} role="form" aria-label="Forgot password form">
        <div className="mb-4">
          <label htmlFor="forgot-email" className="block font-semibold mb-1">
            Email:
          </label>
          <input
            id="forgot-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            aria-label="Email address"
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-60"
        >
          {loading ? 'Sending...' : 'Send Reset Link'}
        </button>
        {error && (
          <div className="text-red-600 mt-3 text-center" role="alert" aria-live="assertive">
            {error}
          </div>
        )}
      </form>
      <div className="mt-6 text-center">
        <Link to="/login" className="text-blue-600 hover:underline">
          Back to Login
        </Link>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
