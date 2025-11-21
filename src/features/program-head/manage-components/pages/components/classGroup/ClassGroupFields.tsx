import { type Control, type FieldErrors, Controller } from 'react-hook-form';
import type z from 'zod';
import { ColorPicker, FormField } from '../../../../../../components/ui';
import type { componentSchemas } from '@/types/validation/components';

// Define the precise form data types from our Zod schemas
type ClassGroupFormData = z.infer<typeof componentSchemas.classGroup>;

/**
 * Renders the specific form fields required for a Class Group.
 *
 * @param cgf - The component's props.
 * @param cgf.control - The control object from react-hook-form.
 * @param cgf.errors - The errors object from react-hook-form.
 * @returns The ClassGroupFields component.
 */
export const ClassGroupFields: React.FC<{
  control: Control<ClassGroupFormData>;
  errors: FieldErrors<ClassGroupFormData>;
}> = ({ control, errors }) => (
  <>
    <Controller
      name="name"
      control={control}
      render={({ field }) => (
        <FormField
          {...field}
          value={field.value ?? ''}
          id="name"
          label="Group Name"
          error={errors.name?.message}
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
          id="code"
          label="Short Code"
          error={errors.code?.message}
        />
      )}
    />
    <Controller
      name="student_count"
      control={control}
      render={({ field }) => (
        <FormField
          {...field}
          value={String(field.value ?? '')}
          onChange={(val) => field.onChange(val === '' ? null : Number(val))}
          id="student_count"
          label="Number of Students"
          type="number"
          error={errors.student_count?.message}
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
  </>
);
