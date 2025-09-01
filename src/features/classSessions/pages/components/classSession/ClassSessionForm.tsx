import React, { useMemo } from 'react'; // Import useMemo
import { Controller, type UseFormReturn } from 'react-hook-form';
import { z } from 'zod';
import { ActionButton, FormField } from '../../../../../components/ui';
import { classSessionSchema } from '../../../../classSessions/types/validation';
import type {
  Course,
  ClassGroup,
  Instructor,
  Classroom,
} from '../../../../classSessionComponents/types';
import { AlertTriangle } from 'lucide-react';
import { checkSoftConflicts } from '../../../../timetabling/utils/checkConflicts';

type ClassSessionFormData = z.infer<typeof classSessionSchema>;

interface ClassSessionFormProps {
  courses: Course[];
  classGroups: ClassGroup[];
  instructors: Instructor[];
  classrooms: Classroom[];
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
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isDirty },
  } = formMethods;

  // Watch all values that could affect soft conflicts
  const watchedValues = watch([
    'course_id',
    'instructor_id',
    'class_group_id',
    'classroom_id',
    'period_count',
  ]);

  // useMemo will re-calculate warning messages only when relevant fields change.
  const conflictWarnings = useMemo(() => {
    const [courseId, instructorId, groupId, classroomId, periodCount] = watchedValues;

    const selectedGroup = classGroups.find((g) => g.id === groupId);
    const selectedClassroom = classrooms.find((c) => c.id === classroomId);
    const selectedCourse = courses.find((c) => c.id === courseId);
    const selectedInstructor = instructors.find((i) => i.id === instructorId);

    // We need all parts to build a temporary session to check for conflicts.
    if (selectedGroup && selectedClassroom && selectedCourse && selectedInstructor) {
      // We can construct a temporary ClassSession object to pass to the checker.
      const tempSession = {
        id: 'temp-id', // A dummy ID is fine here
        group: selectedGroup,
        classroom: selectedClassroom,
        course: selectedCourse,
        instructor: selectedInstructor,
        period_count: periodCount || 1,
      };
      return checkSoftConflicts(tempSession);
    }

    return [];
  }, [watchedValues, classGroups, classrooms, courses, instructors]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
      <h3 className="text-lg font-bold mb-4 text-center">
        {isEditing ? 'Edit Class Session' : 'Create New Class Session'}
      </h3>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <fieldset disabled={loading}>
          <Controller
            name="course_id"
            control={control}
            render={({ field }) => (
              <FormField
                {...field}
                id="course_id"
                label="Course"
                type="select"
                error={errors.course_id?.message}
                options={courses.map((c) => ({ id: c.id, name: `${c.name} (${c.code})` }))}
                required
              />
            )}
          />
          <Controller
            name="instructor_id"
            control={control}
            render={({ field }) => (
              <FormField
                {...field}
                id="instructor_id"
                label="Instructor"
                type="select"
                error={errors.instructor_id?.message}
                options={instructors.map((i) => ({
                  id: i.id,
                  name: `${i.first_name} ${i.last_name}`,
                }))}
                required
              />
            )}
          />
          <Controller
            name="class_group_id"
            control={control}
            render={({ field }) => (
              <FormField
                {...field}
                id="class_group_id"
                label="Class Group"
                type="select"
                error={errors.class_group_id?.message}
                options={classGroups}
                required
              />
            )}
          />
          <Controller
            name="classroom_id"
            control={control}
            render={({ field }) => (
              <FormField
                {...field}
                id="classroom_id"
                label="Classroom"
                type="select"
                error={errors.classroom_id?.message}
                options={classrooms}
                required
              />
            )}
          />
          {conflictWarnings.length > 0 && (
            <div className="flex items-start gap-3 p-3 my-2 text-sm text-yellow-900 bg-yellow-50 border border-yellow-200 rounded-md">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-yellow-500" aria-hidden="true" />
              </div>
              <div>
                <h4 className="font-bold">Potential Conflicts</h4>
                <ul className="mt-1 list-disc list-inside space-y-1">
                  {conflictWarnings.map((warning, index) => (
                    <li key={index}>{warning}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          <Controller
            name="period_count"
            control={control}
            render={({ field }) => (
              <FormField
                {...field}
                value={String(field.value ?? '')}
                onChange={(val) => field.onChange(parseInt(val, 10))}
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
