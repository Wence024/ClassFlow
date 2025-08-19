import React, { useState, useEffect } from 'react';
import { classSessionSchema } from '../../types/validation';
import { FormField, ActionButton } from '../../../../components/ui';
import { showNotification } from '../../../../lib/notificationsService';
import type {
  ClassSession,
  ClassSessionInsert,
  ClassSessionUpdate,
} from '../../types/classSession';
import type { Course } from '../../../classSessionComponents/types/course';
import type { ClassGroup } from '../../../classSessionComponents/types/classGroup';
import type { Instructor } from '../../../classSessionComponents/types/instructor';
import type { Classroom } from '../../../classSessionComponents/types/classroom';

/**
 * Props for the ClassSessionForm component.
 */
interface ClassSessionFormProps {
  /** Array of available courses to populate the select dropdown. */
  courses: Course[];
  /** Array of available class groups to populate the select dropdown. */
  classGroups: ClassGroup[];
  /** Array of available instructors to populate the select dropdown. */
  instructors: Instructor[];
  /** Array of available classrooms to populate the select dropdown. */
  classrooms: Classroom[];
  /** The session being edited, or null if creating a new one. */
  editingClassSession?: ClassSession | null;
  /** Callback function to handle form submission with the validated data. */
  onSubmit: (classSessionData: ClassSessionInsert | ClassSessionUpdate) => void;
  /** Optional callback to cancel the form. */
  onCancel?: () => void;
  /** A boolean to indicate if an operation is in progress. */
  loading?: boolean;
}

/** Represents the internal state of the form. */
interface FormData {
  courseId: string;
  groupId: string;
  instructorId: string;
  classroomId: string;
}

/**
 * A form for creating and editing Class Sessions.
 *
 * This component renders a set of dropdowns for selecting a course, group, instructor,
 * and classroom. It manages its own state, performs validation using Zod, and
 * calls the `onSubmit` prop with the structured data.
 *
 * @param {ClassSessionFormProps} props - The props for the component.
 */
const ClassSessionForm: React.FC<ClassSessionFormProps> = ({
  courses,
  classGroups,
  instructors,
  classrooms,
  editingClassSession,
  onSubmit,
  onCancel,
  loading = false,
}) => {
  const [formData, setFormData] = useState<FormData>({
    courseId: '',
    groupId: '',
    instructorId: '',
    classroomId: '',
  });

  const [errors, setErrors] = useState<Partial<FormData>>({});

  // Populate the form with existing data when an item is being edited.
  useEffect(() => {
    if (editingClassSession) {
      setFormData({
        courseId: editingClassSession.course?.id || '',
        groupId: editingClassSession.group?.id || '',
        instructorId: editingClassSession.instructor?.id || '',
        classroomId: editingClassSession.classroom?.id || '',
      });
    } else {
      // Reset the form when switching to "create" mode.
      setFormData({ courseId: '', groupId: '', instructorId: '', classroomId: '' });
    }
    setErrors({}); // Clear validation errors when the item changes.
  }, [editingClassSession]);

  /** Handles form submission, validation, and data transformation. */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const validationResult = classSessionSchema.safeParse(formData);

    if (validationResult.success) {
      setErrors({});
      // Transform the camelCase form data to the snake_case format expected by the database.
      onSubmit({
        course_id: validationResult.data.courseId,
        class_group_id: validationResult.data.groupId,
        instructor_id: validationResult.data.instructorId,
        classroom_id: validationResult.data.classroomId,
      });
    } else {
      const formattedErrors: Partial<FormData> = {};
      validationResult.error.issues.forEach((err) => {
        const key = err.path[0] as keyof FormData;
        if (key) formattedErrors[key] = err.message;
      });
      setErrors(formattedErrors);
      showNotification('Please fill out all required fields.');
    }
  };

  /** Resets form state and calls the parent's onCancel handler. */
  const handleReset = () => {
    setFormData({ courseId: '', groupId: '', instructorId: '', classroomId: '' });
    setErrors({});
    onCancel?.();
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow sticky top-4">
      <h2 className="text-xl font-semibold mb-4 text-center">
        {editingClassSession ? 'Edit Class Session' : 'Create Class Session'}
      </h2>
      <form onSubmit={handleSubmit} noValidate>
        <fieldset disabled={loading} className="space-y-4">
          <FormField
            id="courseId"
            label="Course"
            type="select"
            value={formData.courseId}
            onChange={(value) => setFormData((prev) => ({ ...prev, courseId: value }))}
            options={courses}
            required
            error={errors.courseId}
          />
          <FormField
            id="groupId"
            label="Class Group"
            type="select"
            value={formData.groupId}
            onChange={(value) => setFormData((prev) => ({ ...prev, groupId: value }))}
            options={classGroups}
            required
            error={errors.groupId}
          />
          <FormField
            id="instructorId"
            label="Instructor"
            type="select"
            value={formData.instructorId}
            onChange={(value) => setFormData((prev) => ({ ...prev, instructorId: value }))}
            options={instructors}
            required
            error={errors.instructorId}
          />
          <FormField
            id="classroomId"
            label="Classroom"
            type="select"
            value={formData.classroomId}
            onChange={(value) => setFormData((prev) => ({ ...prev, classroomId: value }))}
            options={classrooms}
            required
            error={errors.classroomId}
          />
          <div className="flex gap-2 mt-4">
            <ActionButton type="submit" variant="primary" loading={loading} className="flex-1">
              {editingClassSession ? 'Save Changes' : 'Create Class'}
            </ActionButton>
            {onCancel && (
              <ActionButton type="button" variant="secondary" onClick={handleReset}>
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
