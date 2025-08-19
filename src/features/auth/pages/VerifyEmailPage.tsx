import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { ActionButton, ErrorMessage } from '../../../components/ui';

/**
 * A page shown to users after registration, prompting them to verify their email address.
 * It provides an option to resend the verification email.
 */
const VerifyEmailPage: React.FC = () => {
  const { user, resendVerificationEmail, loading, error: apiError } = useAuth();
  const [resent, setResent] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const navigate = useNavigate();

  // If the user object becomes available (e.g., they verify in another tab and the session updates),
  // it means they are logged in, so we redirect them.
  useEffect(() => {
    if (user) {
      navigate('/class-sessions');
    }
  }, [user, navigate]);

  /**
   * Handles the action to resend the verification email.
   * It retrieves the email from the (unverified) user object in the auth context.
   */
  const handleResend = async () => {
    // NOTE: Supabase `signUp` can return a user object even if the email is not yet verified.
    // We use this email to resend the verification.
    const emailToVerify = localStorage.getItem('emailForVerification'); // A more robust way would be to get it from a non-sensitive source

    if (!emailToVerify) {
      setLocalError('Could not find an email address to verify. Please try logging in again.');
      return;
    }

    try {
      await resendVerificationEmail(emailToVerify);
      setResent(true);
      setLocalError(null);
    } catch {
      // Errors are already set in the auth context, but we can catch them here for local state if needed.
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md text-center">
      <h2 className="text-2xl font-bold mb-4">Verify Your Email</h2>
      <p className="mb-6">
        A verification link has been sent to your email address. Please check your inbox and click
        the link to activate your account.
      </p>
      <ActionButton onClick={handleResend} disabled={loading || resent} className="w-full">
        {resent ? 'Verification Email Sent!' : 'Resend Verification Email'}
      </ActionButton>
      {(apiError || localError) && (
        <ErrorMessage message={apiError || localError!} className="mt-4" />
      )}
    </div>
  );
};

export default VerifyEmailPage;
