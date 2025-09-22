import React, { useState, useEffect, useRef } from 'react';
import { registerSchema } from '../types/validation';
import { useAuth } from '../hooks/useAuth';
import { Link } from 'react-router-dom';
import { Button, FormField, ErrorMessage } from '../../../components/ui';

/**
 * A page component for new user registration.
 * It provides a form for name, email, and password, performs client-side validation,
 * and uses the `useAuth` hook to handle the registration process.
 *
 * @returns A register page component.
 */
const RegisterPage: React.FC = () => {
  const { register, loading, error: apiError, clearError } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const clearErrorRef = useRef(clearError);

  // Ensure the ref has the latest clearError function.
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
   * Handles the registration form submission.
   * Validates form data and calls the register function from the AuthContext.
   *
   * @param e - The form event.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors({});
    clearError();

    // 1. Validate form data using Zod schema.
    const validationResult = registerSchema.safeParse(formData);
    if (!validationResult.success) {
      const errors: Record<string, string> = {};
      validationResult.error.issues.forEach((issue) => {
        const key = issue.path[0];
        if (typeof key === 'string') errors[key] = issue.message;
      });
      setFormErrors(errors);
      return;
    }

    // 2. Call the register function from the auth context.
    const { name, email, password } = validationResult.data;
    await register(name, email, password);
  };

  /**
   * A generic handler to update form state.
   *
   * @param fieldName - The name of the form field to update.
   * @param value - The new value.
   */
  const handleChange = (
    fieldName: 'name' | 'email' | 'password' | 'confirmPassword',
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [fieldName]: value }));
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
      <form onSubmit={handleSubmit} noValidate>
        <fieldset disabled={loading} className="space-y-4">
          <FormField
            id="name"
            label="Name"
            value={formData.name}
            onChange={(val) => handleChange('name', val)}
            error={formErrors.name}
            required
            autoComplete="name"
          />
          <FormField
            id="email"
            label="Email"
            type="email"
            value={formData.email}
            onChange={(val) => handleChange('email', val)}
            error={formErrors.email}
            required
            autoComplete="email"
          />
          <FormField
            id="password"
            label="Password"
            type="password"
            value={formData.password}
            onChange={(val) => handleChange('password', val)}
            error={formErrors.password}
            required
            autoComplete="new-password"
          />
          <FormField
            id="confirmPassword"
            label="Confirm Password"
            type="password"
            value={formData.confirmPassword}
            onChange={(val) => handleChange('confirmPassword', val)}
            error={formErrors.confirmPassword}
            required
            autoComplete="new-password"
          />
          <Button type="submit" loading={loading} className="w-full">
            Register
          </Button>
        </fieldset>
        {apiError && <ErrorMessage message={apiError} onDismiss={clearError} className="mt-4" />}
      </form>
      <div className="mt-6 text-center">
        <Link to="/login" className="text-blue-600 hover:underline block">
          Already have an account? Login
        </Link>
      </div>
    </div>
  );
};

export default RegisterPage;
