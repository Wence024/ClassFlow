import React, { useState, useEffect } from 'react';
import { z } from 'zod'; // Import Zod
import { classSessionSchema } from '../../classSessionComponents/types/validation';
import { FormField, ActionButton } from '../../../components/ui';
import type { ClassSession, ClassSessionInsert, ClassSessionUpdate } from '../classSession';
import type { Course } from '../../classSessionComponents/types/course';
import type { ClassGroup } from '../../classSessionComponents/types/classGroup';
import type { Instructor } from '../../classSessionComponents/types/instructor';
import type { Classroom } from '../../classSessionComponents/types/classroom';

interface ClassSessionFormProps {
  courses: Course[];
  classGroups: ClassGroup[];
  instructors: Instructor[];
  classrooms: Classroom[];
  editingClassSession?: ClassSession | null;
  onSubmit: (classSessionData: ClassSessionInsert | ClassSessionUpdate) => void;
  onCancel?: () => void;
  loading?: boolean;
}

interface FormData {
  courseId: string;
  groupId: string;
  instructorId: string;
  classroomId: string;
}

const ClassSessionForm: React.FC<ClassSessionFormProps> = ({
  courses,
  classGroups,
  instructors,
  classrooms,
  editingClassSession: editingClassSession,
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

  // Populate form when editing
  useEffect(() => {
    if (editingClassSession) {
      setFormData({
        courseId: editingClassSession.course?.id || '',
        groupId: editingClassSession.group?.id || '',
        instructorId: editingClassSession.instructor?.id || '',
        classroomId: editingClassSession.classroom?.id || '',
      });
    } else {
      setFormData({
        courseId: '',
        groupId: '',
        instructorId: '',
        classroomId: '',
      });
    }
    setErrors({});
  }, [editingClassSession]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Use Zod to validate the form data
      classSessionSchema.parse(formData);
      setErrors({}); // Clear errors on success

      // The service expects snake_case keys, so we still map the validated data.
      onSubmit({
        course_id: formData.courseId,
        class_group_id: formData.groupId,
        instructor_id: formData.instructorId,
        classroom_id: formData.classroomId,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        const formattedErrors: Partial<FormData> = {};
        error.issues.forEach((err) => {
          if (err.path[0]) {
            formattedErrors[err.path[0] as keyof FormData] = err.message;
          }
        });
        setErrors(formattedErrors);
      }
    }
  };

  const handleReset = () => {
    setFormData({
      courseId: '',
      groupId: '',
      instructorId: '',
      classroomId: '',
    });
    setErrors({});
    onCancel?.();
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4 text-center">
        {editingClassSession ? 'Edit Class' : 'Create Class'}
      </h2>
      <form
        onSubmit={handleSubmit}
        noValidate
        role="form"
        aria-label={editingClassSession ? 'Edit Class Form' : 'Create Class Form'}
      >
        <fieldset disabled={loading}>
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
            id="classGroupId"
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
            id="classrromId"
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
