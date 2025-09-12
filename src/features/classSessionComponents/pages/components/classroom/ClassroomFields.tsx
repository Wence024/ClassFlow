import { type Control, type FieldErrors, Controller } from 'react-hook-form';
import type z from 'zod';
import { ColorPicker, FormField } from '../../../../../components/ui';
import type { componentSchemas } from '../../../types/validation';

// Define the precise form data types from our Zod schemas
type ClassroomFormData = z.infer<typeof componentSchemas.classroom>;

/**
 * Renders the specific form fields required for a Classroom.
 *
 * @param props - The component's props.
 * @param props.control - The control object from react-hook-form.
 * @param props.errors - The errors object from react-hook-form.
 */
export const ClassroomFields: React.FC<{
  control: Control<ClassroomFormData>;
  errors: FieldErrors<ClassroomFormData>;
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
          label="Classroom Name"
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
          label="Short Code (e.g., A-101)"
          error={errors.code?.message}
        />
      )}
    />
    <Controller
      name="capacity"
      control={control}
      render={({ field }) => (
        <FormField
          {...field}
          value={String(field.value ?? '')}
          onChange={(val) => field.onChange(val === '' ? null : Number(val))}
          id="capacity"
          label="Capacity / Size"
          type="number"
          error={errors.capacity?.message}
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
