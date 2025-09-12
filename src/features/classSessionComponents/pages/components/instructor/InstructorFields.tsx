import React, { useEffect, useState } from 'react';
import { Controller, useFormContext, type Control, type FieldErrors } from 'react-hook-form';
import { z } from 'zod';
import { ColorPicker, FormField } from '../../../../../components/ui';
import { componentSchemas } from '../../../types/validation';

type InstructorFormData = z.infer<typeof componentSchemas.instructor>;

/**
 * Renders the specific form fields required for an Instructor in a two-column layout.
 * Includes logic to auto-generate a short code from the first and last name.
 *
 * @param props - The component's props.
 * @param props.control - The control object from react-hook-form.
 * @param props.errors - The errors object from react-hook-form.
 */
export const InstructorFields: React.FC<{
  control: Control<InstructorFormData>;
  errors: FieldErrors<InstructorFormData>;
}> = ({ control, errors }) => {
  const { watch, setValue } = useFormContext<InstructorFormData>();
  const [firstName, lastName] = watch(['first_name', 'last_name']);
  const [isCodeManuallyEdited, setIsCodeManuallyEdited] = useState(false);

  useEffect(() => {
    /**
     * Generates an instructor short code from the first initial of the first and last names.
     *
     * @param fName - The first name.
     * @param lName - The last name.
     * @returns The generated short code (e.g., "JS" for "John Smith").
     */
    const generateInstructorCode = (fName?: string | null, lName?: string | null): string => {
      const firstInitial = fName?.[0]?.toUpperCase() || '';
      const lastInitial = lName?.[0]?.toUpperCase() || '';
      return `${firstInitial}${lastInitial}`;
    };

    if (!isCodeManuallyEdited && (firstName || lastName)) {
      setValue('code', generateInstructorCode(firstName, lastName));
    }
  }, [firstName, lastName, isCodeManuallyEdited, setValue]);

  return (
    <div className="space-y-4">
      {/* --- Main Two-Column Grid --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
        {/* --- Column 1 --- */}
        <div>
          {/* First Name and Last Name side-by-side */}

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
        </div>

        {/* --- Column 2 --- */}
        <div className="space-y-4">
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
                label="Phone Number"
                error={errors.phone?.message}
              />
            )}
          />

          {/* Prefix and Suffix side-by-side */}
          <div className="grid grid-cols-2 gap-x-4">
            <Controller
              name="prefix"
              control={control}
              render={({ field }) => (
                <FormField
                  {...field}
                  value={field.value ?? ''}
                  id="prefix"
                  label="Prefix"
                  error={errors.prefix?.message}
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
                  label="Suffix"
                  error={errors.suffix?.message}
                />
              )}
            />
          </div>
        </div>
      </div>

      {/* --- Fields Below Columns --- */}
      <div>
        <Controller
          name="contract_type"
          control={control}
          render={({ field }) => (
            <FormField
              {...field}
              value={field.value ?? ''}
              id="contract_type"
              label="Teacher's Contract"
              error={errors.contract_type?.message}
            />
          )}
        />
        <Controller
          name="color"
          control={control}
          render={({ field }) => (
            <ColorPicker
              id="color"
              label="Color"
              value={field.value ?? '#FFFFFF'} // Provide a fallback for the value
              onChange={field.onChange}
              error={errors.color?.message}
            />
          )}
        />
      </div>
    </div>
  );
};
