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
      <h2>Verify Your Email</h2>
      <p>
        A verification link has been sent to <b>{user?.email}</b>.<br />
        Please check your inbox and click the link to activate your account.
      </p>
      <button
        onClick={handleResend}
        disabled={loading || resent}
        style={{ width: '100%', padding: 10 }}
      >
        {resent
          ? 'Verification Email Sent!'
          : loading
            ? 'Resending...'
            : 'Resend Verification Email'}
      </button>
      {(error || localError) && (
        <div style={{ color: 'red', marginTop: 10 }}>{error || localError}</div>
      )}
    </div>
  );
};

export default VerifyEmailPage;
