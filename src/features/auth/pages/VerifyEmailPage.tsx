import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../../../lib/supabase';

const VerifyEmailPage: React.FC = () => {
  const { user } = useAuth();
  const [resent, setResent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleResend = async () => {
    setLoading(true);
    setError(null);
    if (!user) return;
    // Supabase does not have a direct resend verification API, but you can trigger it by updating the email
    const { error } = await supabase.auth.resend({ type: 'signup', email: user.email });
    if (error) setError(error.message);
    else setResent(true);
    setLoading(false);
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
      {error && <div style={{ color: 'red', marginTop: 10 }}>{error}</div>}
    </div>
  );
};

export default VerifyEmailPage;
