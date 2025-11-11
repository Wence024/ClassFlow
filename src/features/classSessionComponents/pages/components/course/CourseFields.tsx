import { type Control, type FieldErrors, Controller, useWatch } from 'react-hook-form';
import type z from 'zod';
import { ColorPicker, FormField } from '../../../../../components/ui';
import type { componentSchemas } from '../../../types/validation';

// Define the precise form data types from our Zod schemas
type CourseFormData = z.infer<typeof componentSchemas.course>;

/**
 * Renders the specific form fields required for a Course.
 *
 * @param cf The component's props.
 * @param cf.control The control object from react-hook-form.
 * @param cf.errors The errors object from react-hook-form.
 * @returns The rendered form fields for a course.
 */
export const CourseFields: React.FC<{
  control: Control<CourseFormData>;
  errors: FieldErrors<CourseFormData>;
}> = ({ control, errors }) => {
  const lectureHours = useWatch({ control, name: 'lecture_hours' });
  const labHours = useWatch({ control, name: 'lab_hours' });

  return (
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

      <div className="grid grid-cols-2 gap-4">
        <Controller
          name="lecture_hours"
          control={control}
          render={({ field }) => (
            <FormField
              {...field}
              value={field.value?.toString() ?? ''}
              onChange={(value) => {
                const num = value === '' ? null : parseFloat(value);
                field.onChange(num);
              }}
              id="lecture_hours"
              label="Lecture Hours"
              type="number"
              error={errors.lecture_hours?.message}
            />
          )}
        />
        <Controller
          name="lab_hours"
          control={control}
          render={({ field }) => (
            <FormField
              {...field}
              value={field.value?.toString() ?? ''}
              onChange={(value) => {
                const num = value === '' ? null : parseFloat(value);
                field.onChange(num);
              }}
              id="lab_hours"
              label="Lab Hours"
              type="number"
              error={errors.lab_hours?.message}
            />
          )}
        />
      </div>

      <Controller
        name="units"
        control={control}
        render={({ field }) => (
          <div>
            <FormField
              {...field}
              value={field.value?.toString() ?? ''}
              onChange={(value) => {
                const num = value === '' ? null : parseFloat(value);
                field.onChange(num);
              }}
              id="units"
              label="Units"
              type="number"
              error={errors.units?.message}
            />
            {(lectureHours || labHours) && (
              <p className="text-sm text-muted-foreground -mt-2 mb-2">
                Auto-calculated: {((lectureHours || 0) + (labHours || 0)).toFixed(1)} (customizable)
              </p>
            )}
          </div>
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
    </>
  );
};
