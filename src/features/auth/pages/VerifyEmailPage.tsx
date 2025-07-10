import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const VerifyEmailPage: React.FC = () => {
  const { user, resendVerificationEmail, loading, error } = useAuth();
  const [resent, setResent] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Redirect if user is already verified (has a valid session)
  useEffect(() => {
    if (user) {
      // If user exists, they are likely already verified
      // Redirect to the main application
      navigate('/class-sessions');
    }
  }, [user, navigate]);

  const handleResend = async () => {
    if (!user) return;

    try {
      await resendVerificationEmail(user.email);
      setResent(true);
      setLocalError(null);
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : 'Failed to resend verification email');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Verify Your Email</h2>
      <p className="mb-4 text-center">
        A verification link has been sent to <b>{user?.email}</b>.<br />
        Please check your inbox and click the link to activate your account.
      </p>
      <button
        onClick={handleResend}
        disabled={loading || resent}
        className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-60"
      >
        {resent
          ? 'Verification Email Sent!'
          : loading
            ? 'Resending...'
            : 'Resend Verification Email'}
      </button>
      {(error || localError) && (
        <div className="text-red-600 mt-3 text-center">{error || localError}</div>
      )}
    </div>
  );
};

export default VerifyEmailPage;
