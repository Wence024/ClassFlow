import React, { useState, useEffect, useRef } from 'react';
import { loginSchema } from '../types/validation';
import { useAuth } from '../hooks/useAuth';
import { Link } from 'react-router-dom';
import { Button, FormField, ErrorMessage } from '../../../components/ui';

/**
 * A page component for user login.
 * 
 * This component handles form validation and submission only.
 * Post-login navigation is handled by AuthProvider's login() function,
 * which redirects users based on their role.
 *
 * @returns A login page component.
 */
const LoginPage: React.FC = () => {
  const { login, loading, error: apiError, clearError } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const clearErrorRef = useRef(clearError);

  // Ensure the ref always has the latest version of the clearError function.
  useEffect(() => {
    clearErrorRef.current = clearError;
  }, [clearError]);

  // Clear any existing API errors when the component unmounts.
  useEffect(() => {
    return () => {
      clearErrorRef.current();
    };
  }, []);

  /**
   * Handles the login form submission.
   * Validates the form data and calls the login function from the AuthContext.
   *
   * @param e - The form event.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors({});
    clearError();

    // 1. Validate form data using Zod schema.
    const validationResult = loginSchema.safeParse(formData);
    if (!validationResult.success) {
      const errors: Record<string, string> = {};
      validationResult.error.issues.forEach((issue) => {
        const key = issue.path[0];
        if (typeof key === 'string') errors[key] = issue.message;
      });
      setFormErrors(errors);
      return;
    }

    // 2. Call the login function from the auth context.
    await login(validationResult.data.email, validationResult.data.password);
  };

  /**
   * Updates the form state when an input value changes.
   *
   * @param fieldName - The name of the field being updated.
   * @param value - The new value of the field.
   */
  const handleChange = (fieldName: 'email' | 'password', value: string) => {
    setFormData((prev) => ({ ...prev, [fieldName]: value }));
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
      <form onSubmit={handleSubmit} noValidate>
        <fieldset disabled={loading} className="space-y-4">
          <FormField
            id="email"
            label="Email"
            type="email"
            value={formData.email}
            onChange={(val) => handleChange('email', val)}
            error={formErrors.email}
            required
            autoComplete="username"
          />
          <FormField
            id="password"
            label="Password"
            type="password"
            value={formData.password}
            onChange={(val) => handleChange('password', val)}
            error={formErrors.password}
            required
            autoComplete="current-password"
          />
          <Button type="submit" loading={loading} className="w-full">
            Login
          </Button>
        </fieldset>
        {apiError && <ErrorMessage message={apiError} onDismiss={clearError} className="mt-4" />}
      </form>
      <div className="mt-6 text-center">
        {(() => {
          const emailQuery = formData.email ? `?email=${encodeURIComponent(formData.email)}` : '';
          return (
            <Link
              to={`/forgot-password${emailQuery}`}
              className="text-blue-600 hover:underline block"
            >
              Forgot Password?
            </Link>
          );
        })()}
      </div>
    </div>
  );
};

export default LoginPage;
