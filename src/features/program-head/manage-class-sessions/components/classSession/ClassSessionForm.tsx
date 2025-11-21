import { useMemo, useState } from 'react';
import { Controller, type UseFormReturn } from 'react-hook-form';
import { z } from 'zod';
import { Button, Label } from '../../../../../components/ui';
import { classSessionSchema } from '@/types/validation/classSession';
import type {
  Course,
  ClassGroup,
  Instructor,
  Classroom,
} from '@/types';
import { AlertTriangle, ChevronDown } from 'lucide-react';
import { checkSoftConflicts } from '../../../schedule-class-session/utils/checkConflicts';
import { useAuth } from '@/features/shared/auth/hooks/useAuth';
import type { Program } from '@/types/program';
import {
  CourseSelector,
  InstructorSelector,
  ClassGroupSelector,
  ClassroomSelector,
  ProgramSelector,
} from './selectors';
import { useDepartmentId } from '@/features/shared/auth/hooks/useDepartmentId';

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
  const departmentId = useDepartmentId();
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isDirty },
  } = formMethods;

  // State to track which modal is open
  const [openModal, setOpenModal] = useState<
    'program' | 'course' | 'instructor' | 'classGroup' | 'classroom' | null
  >(null);

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

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
      <h3 className="text-lg font-bold mb-4 text-center">
        {isEditing ? 'Edit Class Session' : 'Create New Class Session'}
      </h3>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <fieldset disabled={loading}>
          {/* Program Selector (Admin Only) */}
          {isAdmin() && (
            <Controller
              name="program_id"
              control={control}
              render={({ field }) => {
                const selectedProgram = programs.find((p) => p.id === field.value);
                return (
                  <div className="space-y-2">
                    <Label htmlFor="program_id">
                      Program <span className="text-destructive">*</span>
                    </Label>
                    <button
                      type="button"
                      id="program_id"
                      onClick={() => setOpenModal('program')}
                      disabled={loading}
                      className={`w-full text-left border rounded-md px-3 py-2 flex items-center justify-between ${
                        errors.program_id ? 'border-destructive' : 'border-input'
                      } ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-accent'}`}
                    >
                      <span
                        className={selectedProgram ? 'text-foreground' : 'text-muted-foreground'}
                      >
                        {selectedProgram
                          ? `${selectedProgram.name} (${selectedProgram.short_code})`
                          : 'Select Program...'}
                      </span>
                      <ChevronDown className="h-4 w-4" />
                    </button>
                    {errors.program_id && (
                      <p className="text-sm text-destructive">{errors.program_id.message}</p>
                    )}
                    <ProgramSelector
                      isOpen={openModal === 'program'}
                      onClose={() => setOpenModal(null)}
                      onSelect={(program: Program) => field.onChange(program.id)}
                      programs={programs}
                      isLoading={loading}
                    />
                  </div>
                );
              }}
            />
          )}

          {/* Course Selector */}
          <Controller
            name="course_id"
            control={control}
            render={({ field }) => {
              const selectedCourse = courses.find((c) => c.id === field.value);
              return (
                <div className="space-y-2">
                  <Label htmlFor="course_id">
                    Course <span className="text-destructive">*</span>
                  </Label>
                  <button
                    type="button"
                    id="course_id"
                    onClick={() => setOpenModal('course')}
                    disabled={loading}
                    className={`w-full text-left border rounded-md px-3 py-2 flex items-center justify-between ${
                      errors.course_id ? 'border-destructive' : 'border-input'
                    } ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-accent'}`}
                  >
                    <span className={selectedCourse ? 'text-foreground' : 'text-muted-foreground'}>
                      {selectedCourse
                        ? `${selectedCourse.name} (${selectedCourse.code})`
                        : 'Select Course...'}
                    </span>
                    <ChevronDown className="h-4 w-4" />
                  </button>
                  {errors.course_id && (
                    <p className="text-sm text-destructive">{errors.course_id.message}</p>
                  )}
                  <CourseSelector
                    isOpen={openModal === 'course'}
                    onClose={() => setOpenModal(null)}
                    onSelect={(course) => field.onChange(course.id)}
                    courses={courses}
                    userProgramId={user?.program_id}
                    isLoading={loading}
                  />
                </div>
              );
            }}
          />

          {/* Instructor Selector */}
          <Controller
            name="instructor_id"
            control={control}
            render={({ field }) => {
              const selectedInstructor = instructors.find((i) => i.id === field.value);
              const instructorName = selectedInstructor
                ? `${selectedInstructor.first_name} ${selectedInstructor.last_name}`
                : null;
              return (
                <div className="space-y-2">
                  <Label htmlFor="instructor_id">
                    Instructor <span className="text-destructive">*</span>
                  </Label>
                  <button
                    type="button"
                    id="instructor_id"
                    onClick={() => setOpenModal('instructor')}
                    disabled={loading}
                    className={`w-full text-left border rounded-md px-3 py-2 flex items-center justify-between ${
                      errors.instructor_id ? 'border-destructive' : 'border-input'
                    } ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-accent'}`}
                  >
                    <span className={instructorName ? 'text-foreground' : 'text-muted-foreground'}>
                      {instructorName || 'Select Instructor...'}
                    </span>
                    <ChevronDown className="h-4 w-4" />
                  </button>
                  {errors.instructor_id && (
                    <p className="text-sm text-destructive">{errors.instructor_id.message}</p>
                  )}
                  <InstructorSelector
                    isOpen={openModal === 'instructor'}
                    onClose={() => setOpenModal(null)}
                    onSelect={(instructor) => field.onChange(instructor.id)}
                    instructors={instructors}
                    userDepartmentId={departmentId}
                    isLoading={loading}
                  />
                </div>
              );
            }}
          />

          {/* Class Group Selector */}
          <Controller
            name="class_group_id"
            control={control}
            render={({ field }) => {
              const selectedGroup = classGroups.find((g) => g.id === field.value);
              return (
                <div className="space-y-2">
                  <Label htmlFor="class_group_id">
                    Class Group <span className="text-destructive">*</span>
                  </Label>
                  <button
                    type="button"
                    id="class_group_id"
                    onClick={() => setOpenModal('classGroup')}
                    disabled={loading}
                    className={`w-full text-left border rounded-md px-3 py-2 flex items-center justify-between ${
                      errors.class_group_id ? 'border-destructive' : 'border-input'
                    } ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-accent'}`}
                  >
                    <span className={selectedGroup ? 'text-foreground' : 'text-muted-foreground'}>
                      {selectedGroup ? selectedGroup.name : 'Select Class Group...'}
                    </span>
                    <ChevronDown className="h-4 w-4" />
                  </button>
                  {errors.class_group_id && (
                    <p className="text-sm text-destructive">{errors.class_group_id.message}</p>
                  )}
                  <ClassGroupSelector
                    isOpen={openModal === 'classGroup'}
                    onClose={() => setOpenModal(null)}
                    onSelect={(group: ClassGroup) => field.onChange(group.id)}
                    classGroups={classGroups}
                    userProgramId={user?.program_id}
                    isLoading={loading}
                  />
                </div>
              );
            }}
          />

          {/* Classroom Selector */}
          <Controller
            name="classroom_id"
            control={control}
            render={({ field }) => {
              const selectedClassroom = classrooms.find((c) => c.id === field.value);
              return (
                <div className="space-y-2">
                  <Label htmlFor="classroom_id">
                    Classroom <span className="text-destructive">*</span>
                  </Label>
                  <button
                    type="button"
                    id="classroom_id"
                    onClick={() => setOpenModal('classroom')}
                    disabled={loading}
                    className={`w-full text-left border rounded-md px-3 py-2 flex items-center justify-between ${
                      errors.classroom_id ? 'border-destructive' : 'border-input'
                    } ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-accent'}`}
                  >
                    <span
                      className={selectedClassroom ? 'text-foreground' : 'text-muted-foreground'}
                    >
                      {selectedClassroom ? selectedClassroom.name : 'Select Classroom...'}
                    </span>
                    <ChevronDown className="h-4 w-4" />
                  </button>
                  {errors.classroom_id && (
                    <p className="text-sm text-destructive">{errors.classroom_id.message}</p>
                  )}
                  <ClassroomSelector
                    isOpen={openModal === 'classroom'}
                    onClose={() => setOpenModal(null)}
                    onSelect={(classroom) => field.onChange(classroom.id)}
                    classrooms={classrooms}
                    userDepartmentId={departmentId}
                    isLoading={loading}
                  />
                </div>
              );
            }}
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

          {/* Period Count Input */}
          <Controller
            name="period_count"
            control={control}
            render={({ field }) => (
              <div className="space-y-2">
                <Label htmlFor="period_count">
                  Duration (periods) <span className="text-destructive">*</span>
                </Label>
                <input
                  {...field}
                  id="period_count"
                  type="number"
                  min="1"
                  value={field.value ?? ''}
                  onChange={(e) => field.onChange(parseInt(e.target.value, 10) || 1)}
                  disabled={loading}
                  className={`w-full border rounded-md px-3 py-2 ${
                    errors.period_count ? 'border-destructive' : 'border-input'
                  } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                />
                {errors.period_count && (
                  <p className="text-sm text-destructive">{errors.period_count.message}</p>
                )}
              </div>
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
    </div>
  );
};

export default ClassSessionForm;
