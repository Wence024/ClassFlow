import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Button, ErrorMessage } from '@/components/ui';
import FormField from '@/components/ui/custom/form-field';
import { toast } from 'sonner';
import { z } from 'zod';

const completeRegistrationSchema = z.object({
  fullName: z.string().min(1, 'Name is required').max(100),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

/**
 * A page for invited users to complete their registration by setting their password.
 * This page is accessed via the invitation link sent by an administrator.
 *
 * @returns A complete registration page component.
 */
export default function CompleteRegistrationPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    password: '',
    confirmPassword: '',
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if user has valid access token in URL hash
    const hash = window.location.hash;
    if (!hash.includes('access_token')) {
      toast.error('Invalid invitation link');
      navigate('/login');
    }
  }, [navigate]);

  /**
   * Handles the form submission to complete user registration.
   *
   * @param e - The form event.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors({});
    setError(null);

    // Validate form data
    const validationResult = completeRegistrationSchema.safeParse(formData);
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
    try {
      // Update user with new password and full name
      const { error: updateError } = await supabase.auth.updateUser({
        password: formData.password,
        data: { full_name: formData.fullName },
      });

      if (updateError) throw updateError;

      toast.success('Registration completed! Please log in.');
      navigate('/login');
    } catch (err) {
      console.error('Error completing registration:', err);
      setError(err instanceof Error ? err.message : 'Failed to complete registration');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Updates form field values.
   *
   * @param field - The name of the form field to update.
   * @param value - The new value.
   */
  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold mb-6 text-center">Complete Your Registration</h2>
        <p className="text-gray-600 mb-6 text-center">
          Set your password to complete your account setup.
        </p>
        
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <FormField
            id="fullName"
            label="Full Name"
            value={formData.fullName}
            onChange={(val) => handleChange('fullName', val)}
            error={formErrors.fullName}
            required
            disabled={loading}
          />
          
          <FormField
            id="password"
            label="Password"
            type="password"
            value={formData.password}
            onChange={(val) => handleChange('password', val)}
            error={formErrors.password}
            required
            disabled={loading}
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
            disabled={loading}
            autoComplete="new-password"
          />

          {error && <ErrorMessage message={error} />}

          <Button type="submit" loading={loading} className="w-full">
            Complete Registration
          </Button>
        </form>
      </div>
    </div>
  );
}
