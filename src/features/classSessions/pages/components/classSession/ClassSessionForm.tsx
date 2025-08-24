import React from 'react';
// FIXED: Removed unused imports: useEffect, useForm, zodResolver
import { Controller, type UseFormReturn } from 'react-hook-form';
import { z } from 'zod';
import { ActionButton, FormField } from '../../../../../components/ui';
// We now need the validation schema to infer the form's data type
import { classSessionSchema } from '../../../../classSessions/types/validation';
import type {
  Course,
  ClassGroup,
  Instructor,
  Classroom,
} from '../../../../classSessionComponents/types';

// The form's data shape is now inferred directly and correctly from the Zod schema
type ClassSessionFormData = z.infer<typeof classSessionSchema>;

interface ClassSessionFormProps {
  courses: Course[];
  classGroups: ClassGroup[];
  instructors: Instructor[];
  classrooms: Classroom[];
  // The form is now controlled by the parent page via this prop
  formMethods: UseFormReturn<ClassSessionFormData>;
  onSubmit: (data: ClassSessionFormData) => Promise<void>;
  onCancel?: () => void;
  loading: boolean;
  isEditing: boolean;
}

/**
 * A presentation-only form for creating and editing Class Sessions.
 * This component is now fully controlled by its parent, which provides the
 * form state and submission logic via the `formMethods` and `onSubmit` props.
 */
const ClassSessionForm: React.FC<ClassSessionFormProps> = ({
  courses,
  classGroups,
  instructors,
  classrooms,
  formMethods,
  onSubmit,
  onCancel,
  loading,
  isEditing,
}) => {
  // Destructure the required methods and state from the passed-in form instance
  const {
    control,
    handleSubmit,
    formState: { errors, isDirty },
  } = formMethods;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
      <h3 className="text-lg font-bold mb-4 text-center">
        {isEditing ? 'Edit Class Session' : 'Create New Class Session'}
      </h3>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <fieldset disabled={loading}>
          {/* FIXED: All 'name' props now use snake_case to match the Zod schema */}
          <Controller
            name="courseId"
            control={control}
            render={({ field }) => (
              <FormField
                {...field}
                id="course_id"
                label="Course"
                type="select"
                error={errors.courseId?.message}
                options={courses.map((c) => ({ id: c.id, name: `${c.name} (${c.code})` }))}
                required
              />
            )}
          />
          <Controller
            name="instructorId"
            control={control}
            render={({ field }) => (
              <FormField
                {...field}
                id="instructor_id"
                label="Instructor"
                type="select"
                error={errors.instructorId?.message}
                options={instructors.map((i) => ({
                  id: i.id,
                  name: `${i.first_name} ${i.last_name}`,
                }))}
                required
              />
            )}
          />
          <Controller
            name="groupId"
            control={control}
            render={({ field }) => (
              <FormField
                {...field}
                id="class_group_id"
                label="Class Group"
                type="select"
                error={errors.groupId?.message}
                options={classGroups}
                required
              />
            )}
          />
          <Controller
            name="classroomId"
            control={control}
            render={({ field }) => (
              <FormField
                {...field}
                id="classroom_id"
                label="Classroom"
                type="select"
                error={errors.classroomId?.message}
                options={classrooms}
                required
              />
            )}
          />
          <Controller
            name="period_count"
            control={control}
            render={({ field }) => (
              <FormField
                {...field}
                value={String(field.value ?? '')}
                // The form field expects a string, so we convert back to number on change
                onChange={(val) => field.onChange(Number(val))}
                id="period_count"
                label="Duration (periods)"
                type="number"
                error={errors.period_count?.message}
                required
              />
            )}
          />
          <div className="flex gap-3 pt-2">
            <ActionButton type="submit" loading={loading} disabled={!isDirty && !isEditing}>
              {isEditing ? 'Save Changes' : 'Add Class Session'}
            </ActionButton>
            {onCancel && (
              <ActionButton type="button" variant="secondary" onClick={onCancel}>
                Cancel
              </ActionButton>
            )}
          </div>
        </fieldset>
      </form>
    </div>
  );
};

export default ClassSessionForm;
