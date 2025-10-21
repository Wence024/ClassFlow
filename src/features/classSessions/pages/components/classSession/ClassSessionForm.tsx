import React, { useMemo, useState } from 'react';
import { Controller, type UseFormReturn } from 'react-hook-form';
import { z } from 'zod';
import { Button, FormField } from '../../../../../components/ui';
import { classSessionSchema } from '../../../../classSessions/types/validation';
import type {
  Course,
  ClassGroup,
  Instructor,
  Classroom,
} from '../../../../classSessionComponents/types';
import { AlertTriangle } from 'lucide-react';
import { checkSoftConflicts } from '../../../../timetabling/utils/checkConflicts';
import { useAuth } from '../../../../auth/hooks/useAuth';
import type { Program } from '../../../../programs/types/program';
import { ResourceSelectorModal, type PrioritizedItem } from '../../../../../components/ui/custom/ResourceSelectorModal';
import { InstructorCard } from '../../../../classSessionComponents/pages/components/instructor/InstructorCard';
import { ClassroomCard } from '../../../../classSessionComponents/pages/components/classroom/ClassroomCard';
import { Card } from '../../../../../components/ui/card';

type ClassSessionFormData = z.infer<typeof classSessionSchema>;

interface ClassSessionFormProps {
  courses: Course[];
  classGroups: ClassGroup[];
  instructors: Instructor[];
  classrooms: Classroom[];
  programs: Program[];
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
 *
 * @param csf The props for the component.
 * @param csf.courses An array of available courses.
 * @param csf.classGroups An array of available class groups.
 * @param csf.instructors An array of available instructors.
 * @param csf.classrooms An array of available classrooms.
 * @param csf.programs An array of available programs (for admin users).
 * @param csf.formMethods The return object from `useForm` hook for form management.
 * @param csf.onSubmit Function to call when the form is submitted.
 * @param [csf.onCancel] Optional function to call when the form is cancelled.
 * @param csf.loading Boolean indicating if the form is currently loading or submitting.
 * @param csf.isEditing Boolean indicating if the form is in editing mode.
 * @returns The rendered class session form.
 */
const ClassSessionForm: React.FC<ClassSessionFormProps> = ({
  courses,
  classGroups,
  instructors,
  classrooms,
  programs,
  formMethods,
  onSubmit,
  onCancel,
  loading,
  isEditing,
}) => {
  const { isAdmin, user } = useAuth();
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isDirty },
  } = formMethods;

  // Modal state management
  const [isInstructorModalOpen, setIsInstructorModalOpen] = useState(false);
  const [isClassroomModalOpen, setIsClassroomModalOpen] = useState(false);

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
    if (
      selectedGroup &&
      selectedClassroom &&
      selectedCourse &&
      selectedInstructor &&
      selectedGroup.program_id
    ) {
      // We can construct a temporary ClassSession object to pass to the checker.
      const tempSession = {
        id: 'temp-id', // A dummy ID is fine here
        group: selectedGroup,
        classroom: selectedClassroom,
        course: selectedCourse,
        instructor: selectedInstructor,
        period_count: periodCount || 1,
        program_id: selectedGroup.program_id,
      };
      return checkSoftConflicts(tempSession);
    }

    return [];
  }, [watchedValues, classGroups, classrooms, courses, instructors]);

  // Transform instructors and classrooms into PrioritizedItem format
  const prioritizedInstructors: (Instructor & PrioritizedItem)[] = useMemo(() => {
    return instructors.map((instructor) => ({
      ...instructor,
      isPriority: instructor.department_id === user?.department_id,
      searchTerm: `${instructor.first_name} ${instructor.last_name} ${instructor.code || ''} ${instructor.email || ''}`,
    }));
  }, [instructors, user?.department_id]);

  const prioritizedClassrooms: (Classroom & PrioritizedItem)[] = useMemo(() => {
    return classrooms.map((classroom) => ({
      ...classroom,
      isPriority: classroom.preferred_department_id === user?.department_id,
      searchTerm: `${classroom.name} ${classroom.code || ''} ${classroom.location || ''}`,
    }));
  }, [classrooms, user?.department_id]);

  // Get selected resource names for display
  const selectedInstructor = instructors.find((i) => i.id === watch('instructor_id'));
  const selectedClassroom = classrooms.find((c) => c.id === watch('classroom_id'));

  const getInstructorDisplayName = () => {
    if (!selectedInstructor) return 'Select Instructor';
    return `${selectedInstructor.first_name} ${selectedInstructor.last_name}`;
  };

  const getClassroomDisplayName = () => {
    if (!selectedClassroom) return 'Select Classroom';
    return selectedClassroom.name;
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
      <h3 className="text-lg font-bold mb-4 text-center">
        {isEditing ? 'Edit Class Session' : 'Create New Class Session'}
      </h3>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <fieldset disabled={loading}>
          {isAdmin() && (
            <Controller
              name="program_id"
              control={control}
              render={({ field }) => (
                <FormField
                  {...field}
                  value={field.value || ''}
                  id="program_id"
                  label="Program"
                  type="select"
                  error={errors.program_id?.message}
                  options={programs.map((p) => ({ 
                    id: p.id, 
                    name: `${p.name} (${p.short_code})` 
                  }))}
                  required
                />
              )}
            />
          )}
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
          <div className="space-y-2">
            <label htmlFor="instructor-selector" className="text-sm font-medium">
              Instructor <span className="text-destructive">*</span>
            </label>
            <Button
              id="instructor-selector"
              type="button"
              variant="outline"
              className="w-full justify-start text-left font-normal"
              onClick={() => setIsInstructorModalOpen(true)}
            >
              {getInstructorDisplayName()}
            </Button>
            {errors.instructor_id && (
              <p className="text-sm text-destructive">{errors.instructor_id.message}</p>
            )}
          </div>
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
          <div className="space-y-2">
            <label htmlFor="classroom-selector" className="text-sm font-medium">
              Classroom <span className="text-destructive">*</span>
            </label>
            <Button
              id="classroom-selector"
              type="button"
              variant="outline"
              className="w-full justify-start text-left font-normal"
              onClick={() => setIsClassroomModalOpen(true)}
            >
              {getClassroomDisplayName()}
            </Button>
            {errors.classroom_id && (
              <p className="text-sm text-destructive">{errors.classroom_id.message}</p>
            )}
          </div>
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
            <Button type="submit" loading={loading} disabled={!isDirty && !isEditing}>
              {isEditing ? 'Save Changes' : 'Add Class Session'}
            </Button>
            {onCancel && (
              <Button type="button" variant="secondary" onClick={onCancel}>
                Cancel
              </Button>
            )}
          </div>
        </fieldset>
      </form>

      {/* Resource Selector Modals */}
      <ResourceSelectorModal
        isOpen={isInstructorModalOpen}
        onClose={() => setIsInstructorModalOpen(false)}
        onSelectItem={(instructor) => {
          formMethods.setValue('instructor_id', instructor.id, { shouldValidate: true });
        }}
        items={prioritizedInstructors}
        title="Select Instructor"
        renderItem={(instructor, onSelect) => (
          <Card 
            className="hover:bg-accent transition-colors"
            onClick={onSelect}
          >
            <InstructorCard
              instructor={instructor}
              onEdit={() => {}}
              onDelete={() => {}}
              isOwner={false}
            />
          </Card>
        )}
      />

      <ResourceSelectorModal
        isOpen={isClassroomModalOpen}
        onClose={() => setIsClassroomModalOpen(false)}
        onSelectItem={(classroom) => {
          formMethods.setValue('classroom_id', classroom.id, { shouldValidate: true });
        }}
        items={prioritizedClassrooms}
        title="Select Classroom"
        renderItem={(classroom, onSelect) => (
          <Card 
            className="hover:bg-accent transition-colors"
            onClick={onSelect}
          >
            <ClassroomCard
              classroom={classroom}
              onEdit={() => {}}
              onDelete={() => {}}
              isOwner={false}
            />
          </Card>
        )}
      />
    </div>
  );
};

export default ClassSessionForm;
