import React, { useState, useEffect } from 'react';
import FormField from '../common/FormField';
import ActionButton from '../common/ActionButton';
import type { ClassSession, Course, ClassGroup, Instructor, Classroom } from '../../types/scheduleLessons';

interface ClassSessionFormProps {
  courses: Course[];
  classGroups: ClassGroup[];
  instructors: Instructor[];
  classrooms: Classroom[];
  editingSession?: ClassSession | null;
  onSubmit: (sessionData: Omit<ClassSession, 'id'>) => void;
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
  editingSession,
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
    if (editingSession) {
      setFormData({
        courseId: editingSession.course.id,
        groupId: editingSession.group.id,
        instructorId: editingSession.instructor.id,
        classroomId: editingSession.classroom.id,
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
  }, [editingSession]);

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.courseId) newErrors.courseId = 'Course is required';
    if (!formData.groupId) newErrors.groupId = 'Class group is required';
    if (!formData.instructorId) newErrors.instructorId = 'Instructor is required';
    if (!formData.classroomId) newErrors.classroomId = 'Classroom is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const course = courses.find(c => c.id === formData.courseId)!;
    const group = classGroups.find(g => g.id === formData.groupId)!;
    const instructor = instructors.find(i => i.id === formData.instructorId)!;
    const classroom = classrooms.find(c => c.id === formData.classroomId)!;

    onSubmit({
      course,
      group,
      instructor,
      classroom,
    });
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
        {editingSession ? 'Edit Class Session' : 'Create Class Session'}
      </h2>
      
      <form onSubmit={handleSubmit}>
        <FormField
          label="Course"
          type="select"
          value={formData.courseId}
          onChange={(value) => setFormData(prev => ({ ...prev, courseId: value }))}
          options={courses}
          required
          error={errors.courseId}
        />

        <FormField
          label="Class Group"
          type="select"
          value={formData.groupId}
          onChange={(value) => setFormData(prev => ({ ...prev, groupId: value }))}
          options={classGroups}
          required
          error={errors.groupId}
        />

        <FormField
          label="Instructor"
          type="select"
          value={formData.instructorId}
          onChange={(value) => setFormData(prev => ({ ...prev, instructorId: value }))}
          options={instructors}
          required
          error={errors.instructorId}
        />

        <FormField
          label="Classroom"
          type="select"
          value={formData.classroomId}
          onChange={(value) => setFormData(prev => ({ ...prev, classroomId: value }))}
          options={classrooms}
          required
          error={errors.classroomId}
        />

        <div className="flex gap-2">
          <ActionButton
            type="submit"
            variant="primary"
            loading={loading}
            className="flex-1"
          >
            {editingSession ? 'Save Changes' : 'Create Class Session'}
          </ActionButton>
          
          {(editingSession || onCancel) && (
            <ActionButton
              type="button"
              variant="secondary"
              onClick={handleReset}
            >
              Cancel
            </ActionButton>
          )}
        </div>
      </form>
    </div>
  );
};

export default ClassSessionForm;
