import { type Control, type FieldErrors, Controller } from 'react-hook-form';
import type z from 'zod';
import { ColorPicker, FormField } from '../../../../../components/ui';
import type { componentSchemas } from '../../../types/validation';

// Define the precise form data types from our Zod schemas
type CourseFormData = z.infer<typeof componentSchemas.course>;

/**
 * Renders the specific form fields required for a Course.
 * @param {object} props - The component's props.
 * @param {Control<CourseFormData>} props.control - The control object from react-hook-form.
 * @param {FieldErrors<CourseFormData>} props.errors - The errors object from react-hook-form.
 */
export const CourseFields: React.FC<{
  control: Control<CourseFormData>;
  errors: FieldErrors<CourseFormData>;
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
          label="Course Name"
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
          label="Course Code"
          error={errors.code?.message}
          required
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
