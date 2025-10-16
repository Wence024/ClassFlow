import React, { useEffect, useState } from 'react';
import { Controller, useFormContext, type Control, type FieldErrors } from 'react-hook-form';
import { z } from 'zod';
import { ColorPicker, FormField } from '../../../../../components/ui';
import { componentSchemas } from '../../../types/validation';
import { useAuth } from '../../../../auth/hooks/useAuth';
import { useDepartments } from '../../../../departments/hooks/useDepartments';
import type { Department } from '../../../../departments/types/department';

type InstructorFormData = z.infer<typeof componentSchemas.instructor> & {
  department_id?: string;
};

/**
 * Enhanced instructor form fields for admins and department heads.
 * Includes department selection for admins when editing instructors.
 *
 * @param props The component's props.
 * @param props.control The control object from react-hook-form.
 * @param props.errors The errors object from react-hook-form.
 * @param props.isEditing Whether the form is in edit mode.
 * @param props.currentDepartmentId The current department ID of the instructor being edited.
 * @returns The rendered form fields for an instructor.
 */
export const AdminInstructorFields: React.FC<{
  control: Control<InstructorFormData>;
  errors: FieldErrors<InstructorFormData>;
  isEditing?: boolean;
  currentDepartmentId?: string;
}> = ({ control, errors, isEditing = false, currentDepartmentId }) => {
  const { watch, setValue } = useFormContext<InstructorFormData>();
  const { isAdmin } = useAuth();
  const { listQuery: departmentsQuery } = useDepartments();
  const [firstName, lastName] = watch(['first_name', 'last_name']);
  const [isCodeManuallyEdited, setIsCodeManuallyEdited] = useState(false);

  const departments = departmentsQuery.data || [];
  const departmentOptions = departments.map((d: Department) => ({
    label: `${d.name} (${d.code})`,
    value: d.id,
  }));

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

  // Set default department when editing
  useEffect(() => {
    const currentDeptIdValue = watch('department_id');
    if (isEditing && currentDepartmentId && !currentDeptIdValue) {
      setValue('department_id', currentDepartmentId);
    }
  }, [isEditing, currentDepartmentId, setValue, watch]);

  return (
    <div className="space-y-4">
      {/* Department Selection for Admins */}
      {isAdmin() && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
          <Controller
            name="department_id"
            control={control}
            render={({ field }) => (
              <FormField
                {...field}
                value={field.value ?? currentDepartmentId ?? ''}
                id="department_id"
                label="Department"
                type="select"
                placeholder="Select department..."
                options={departmentOptions.map((d) => ({ id: d.value, name: d.label }))}
                error={errors.department_id?.message}
                required
              />
            )}
          />
          <p className="text-xs text-blue-600 mt-1">
            {isEditing ? 'Admins can reassign instructors to different departments' : 'Select the department this instructor belongs to'}
          </p>
        </div>
      )}

      {/* --- Main Two-Column Grid --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
        {/* --- Column 1 --- */}
        <div>
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
              value={field.value ?? '#FFFFFF'}
              onChange={field.onChange}
              error={errors.color?.message}
            />
          )}
        />
      </div>
    </div>
  );
};
