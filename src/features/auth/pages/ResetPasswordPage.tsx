import React, { useState, useEffect } from 'react';
import { resetPasswordSchema } from '../types/validation';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../../lib/supabase';
import { ActionButton, FormField, ErrorMessage } from '../../../components/ui';

/**
 * A page component for users to set a new password.
 * This page is accessed via the link sent to the user's email. It extracts
 * authentication tokens from the URL, sets the user's session, and allows them
 * to submit a new password.
 * @returns A reset password page component.
 */
const ResetPasswordPage: React.FC = () => {
  const [formData, setFormData] = useState({ password: '', confirmPassword: '' });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  // This effect runs once on mount to parse the access token from the URL fragment.
  // Supabase puts the auth tokens in the URL hash after a password reset redirect.
  useEffect(() => {
    const hash = window.location.hash;
    const params = new URLSearchParams(hash.substring(1)); // Remove the '#'
    const accessToken = params.get('access_token');
    const refreshToken = params.get('refresh_token');
    const errorDescription = params.get('error_description');

    if (errorDescription) {
      setApiError(decodeURIComponent(errorDescription));
    } else if (!accessToken || !refreshToken) {
      setApiError(
        'Invalid or missing reset link parameters. Please request a new password reset link.'
      );
    } else {
      // If tokens are present, set the session. This authenticates the user for the password update.
      supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      });
    }
  }, []);

  /**
   * Handles the form submission for resetting the password.
   * Validates the new password and updates it using the Supabase client.
   *
   * @param e - The form event.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors({});
    setApiError(null);

    // 1. Client-side validation.
    const validationResult = resetPasswordSchema.safeParse(formData);
    if (!validationResult.success) {
      const errors: Record<string, string> = {};
      validationResult.error.issues.forEach((issue) => {
        const key = issue.path[0];
        if (typeof key === 'string') errors[key] = issue.message;
      });
      setFormErrors(errors);
      return;
    }

    setLoading(true);
    // 2. Update the user's password. The session should already be set from the useEffect hook.
    const { error } = await supabase.auth.updateUser({
      password: formData.password,
    });

    if (error) {
      setApiError(error.message);
    } else {
      setSuccess(true);
      setTimeout(() => navigate('/login'), 3000); // Redirect to login after 3 seconds.
    }
    setLoading(false);
  };

  const handleChange = (fieldName: 'password' | 'confirmPassword', value: string) => {
    setFormData((prev) => ({ ...prev, [fieldName]: value }));
  };

  // Display a success message after the password has been reset.
  if (success) {
    return (
      <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md text-center">
        <h2 className="text-2xl font-bold mb-4">Password Reset Successful</h2>
        <p>Your password has been updated. Redirecting you to the login page...</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Reset Password</h2>
      <form onSubmit={handleSubmit} noValidate>
        <fieldset disabled={loading} className="space-y-4">
          <FormField
            id="password"
            label="New Password"
            type="password"
            value={formData.password}
            onChange={(val) => handleChange('password', val)}
            error={formErrors.password}
            required
            autoComplete="new-password"
          />
          <FormField
            id="confirmPassword"
            label="Confirm New Password"
            type="password"
            value={formData.confirmPassword}
            onChange={(val) => handleChange('confirmPassword', val)}
            error={formErrors.confirmPassword}
            required
            autoComplete="new-password"
          />
          <ActionButton type="submit" loading={loading} className="w-full">
            Reset Password
          </ActionButton>
        </fieldset>
        {apiError && (
          <ErrorMessage message={apiError} onDismiss={() => setApiError(null)} className="mt-4" />
        )}
      </form>
    </div>
  );
};

export default ResetPasswordPage;
