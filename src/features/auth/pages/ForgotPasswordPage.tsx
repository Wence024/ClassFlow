import React, { useState, useEffect } from 'react';
import { forgotPasswordSchema } from '../types/validation';
import { Link, useSearchParams } from 'react-router-dom';
import { supabase } from '../../../lib/supabase';
import { FormField, Button, ErrorMessage } from '../../../components/ui';

/**
 * A page component that allows users to request a password reset link.
 * Users enter their email address, and upon submission, a reset link is sent
 * via the authentication provider (Supabase).
 *
 * @returns A page component for forgot password.
 */
const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [searchParams] = useSearchParams();

  // Pre-fill the email field if an 'email' query parameter is present in the URL.
  useEffect(() => {
    const emailParam = searchParams.get('email');
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [searchParams]);

  /**
   * Handles the form submission for requesting a password reset.
   * It performs client-side validation before sending the request to Supabase.
   *
   * @param e - The form event.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setApiError(null);

    // 1. Validate form data using Zod schema.
    const validationResult = forgotPasswordSchema.safeParse({ email });
    if (!validationResult.success) {
      setFormError(validationResult.error.issues[0].message);
      return;
    }

    // 2. Send the password reset request to the auth service.
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      setApiError(error.message);
    } else {
      // 3. On success, update the state to show a confirmation message.
      setSent(true);
    }
    setLoading(false);
  };

  // If the email has been sent, display a success message.
  if (sent) {
    return (
      <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md text-center">
        <h2 className="text-2xl font-bold mb-4">Check your inbox</h2>
        <p className="mb-4">
          A password reset link has been sent to <span className="font-semibold">{email}</span>.
        </p>
        <Link to="/login" className="text-blue-600 hover:underline">
          Back to Login
        </Link>
      </div>
    );
  }

  // Otherwise, display the password reset request form.
  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Forgot Password</h2>
      <form onSubmit={handleSubmit} noValidate>
        <FormField
          id="email"
          label="Email"
          type="email"
          value={email}
          onChange={setEmail}
          error={formError ?? undefined}
          required
          autoComplete="email"
        />
        <Button type="submit" loading={loading} className="w-full">
          Send Reset Link
        </Button>
        {apiError && (
          <ErrorMessage message={apiError} onDismiss={() => setApiError(null)} className="mt-4" />
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
