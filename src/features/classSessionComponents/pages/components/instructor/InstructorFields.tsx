import { useState, useEffect } from 'react';
import { type Control, type FieldErrors, Controller, useFormContext } from 'react-hook-form';
import type z from 'zod';
import { FormField } from '../../../../../components/ui';
import type { componentSchemas } from '../../../types/validation';

// Define the precise form data types from our Zod schemas
type InstructorFormData = z.infer<typeof componentSchemas.instructor>;

/**
 * Renders the specific form fields required for an Instructor.
 * Includes logic to auto-generate a short code from the first and last name.
 * @param {object} props - The component's props.
 * @param {Control<InstructorFormData>} props.control - The control object from react-hook-form.
 * @param {FieldErrors<InstructorFormData>} props.errors - The errors object from react-hook-form.
 */
export const InstructorFields: React.FC<{
  control: Control<InstructorFormData>;
  errors: FieldErrors<InstructorFormData>;
}> = ({ control, errors }) => {
  // useFormContext is required to access `watch` and `setValue` from the parent form
  const { watch, setValue } = useFormContext<InstructorFormData>();
  const [firstName, lastName] = watch(['first_name', 'last_name']);
  const [isCodeManuallyEdited, setIsCodeManuallyEdited] = useState(false);

  useEffect(() => {
    const generateInstructorCode = (fName?: string | null, lName?: string | null): string => {
      const firstInitial = fName?.[0]?.toUpperCase() || '';
      const lastInitials = (lName || '').substring(0, 2).toUpperCase();
      return `${firstInitial}${lastInitials}`;
    };

    if (!isCodeManuallyEdited && (firstName || lastName)) {
      setValue('code', generateInstructorCode(firstName, lastName));
    }
  }, [firstName, lastName, isCodeManuallyEdited, setValue]);

  return (
    <>
      <Controller
        name="prefix"
        control={control}
        render={({ field }) => (
          <FormField
            {...field}
            value={field.value ?? ''}
            id="prefix"
            label="Prefix (e.g., Mr.)"
            error={errors.prefix?.message}
          />
        )}
      />
      <Controller
        name="title"
        control={control}
        render={({ field }) => (
          <FormField
            {...field}
            value={field.value ?? ''}
            id="title"
            label="Title (e.g., Dr.)"
            error={errors.title?.message}
          />
        )}
      />
      <Controller
        name="first_name"
        control={control}
        render={({ field }) => (
          <FormField
            {...field}
            value={field.value ?? ''}
            id="first_name"
            label="First Name"
            error={errors.first_name?.message}
            required
          />
        )}
      />
      <Controller
        name="last_name"
        control={control}
        render={({ field }) => (
          <FormField
            {...field}
            value={field.value ?? ''}
            id="last_name"
            label="Last Name"
            error={errors.last_name?.message}
            required
          />
        )}
      />
      <Controller
        name="suffix"
        control={control}
        render={({ field }) => (
          <FormField
            {...field}
            value={field.value ?? ''}
            id="suffix"
            label="Suffix (e.g., PhD)"
            error={errors.suffix?.message}
          />
        )}
      />
      <Controller
        name="code"
        control={control}
        render={({ field }) => (
          <FormField
            {...field}
            value={field.value ?? ''}
            onChange={(val) => {
              setIsCodeManuallyEdited(true);
              field.onChange(val);
            }}
            id="code"
            label="Short Code"
            error={errors.code?.message}
          />
        )}
      />
      <Controller
        name="contract_type"
        control={control}
        render={({ field }) => (
          <FormField
            {...field}
            value={field.value ?? ''}
            id="contract_type"
            label="Contract Type"
            error={errors.contract_type?.message}
          />
        )}
      />
      <Controller
        name="email"
        control={control}
        render={({ field }) => (
          <FormField
            {...field}
            value={field.value ?? ''}
            id="email"
            label="Email"
            type="email"
            error={errors.email?.message}
          />
        )}
      />
      <Controller
        name="phone"
        control={control}
        render={({ field }) => (
          <FormField
            {...field}
            value={field.value ?? ''}
            id="phone"
            label="Phone"
            error={errors.phone?.message}
          />
        )}
      />
      <Controller
        name="color"
        control={control}
        render={({ field }) => (
          <FormField
            {...field}
            value={field.value ?? ''}
            id="color"
            label="Color"
            type="color"
            error={errors.color?.message}
          />
        )}
      />
    </>
  );
};
