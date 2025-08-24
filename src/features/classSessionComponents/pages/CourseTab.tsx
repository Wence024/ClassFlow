import React, { useState, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../../auth/hooks/useAuth';
import { useCourses } from '../hooks';
import { useClassSessions } from '../../classSessions/hooks/useClassSessions';
import { CourseFields, CourseCard } from './components/course';
import { ActionButton, ConfirmModal, ErrorMessage, LoadingSpinner } from '../../../components/ui';
import { componentSchemas } from '../types/validation';
import type { Course } from '../types';
import { showNotification } from '../../../lib/notificationsService';

type CourseFormData = z.infer<typeof componentSchemas.course>;

/**
 * Renders the UI for managing Courses.
 * This component handles fetching, displaying, creating, editing, and deleting courses
 * by orchestrating the `useCourses` hook with the `CourseFields` form and `CourseCard` list.
 */
const CourseManagement: React.FC = () => {
  const { user } = useAuth();
  const {
    courses,
    addCourse,
    updateCourse,
    removeCourse,
    isLoading,
    isSubmitting,
    isRemoving,
    error,
  } = useCourses();
  const { classSessions } = useClassSessions();
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [courseToDelete, setCourseToDelete] = useState<Course | null>(null);

  const formMethods = useForm<CourseFormData>({
    resolver: zodResolver(componentSchemas.course),
    defaultValues: { name: '', code: '', color: '#6B7280' },
  });

  useEffect(() => {
    if (editingCourse) {
      formMethods.reset(editingCourse);
    } else {
      formMethods.reset({ name: '', code: '', color: '#6B7280' });
    }
  }, [editingCourse, formMethods]);

  const handleAdd = async (data: CourseFormData) => {
    if (!user) return;
    await addCourse({ ...data, user_id: user.id });
    formMethods.reset();
    showNotification('Course created successfully!');
  };

  const handleSave = async (data: CourseFormData) => {
    if (!editingCourse) return;
    await updateCourse(editingCourse.id, data);
    setEditingCourse(null);
    showNotification('Course updated successfully!');
  };

  const handleCancel = () => setEditingCourse(null);
  const handleEdit = (course: Course) => setEditingCourse(course);
  const handleDeleteRequest = (id: string) =>
    setCourseToDelete(courses.find((c) => c.id === id) || null);

  const handleConfirmDelete = async () => {
    if (!courseToDelete) return;
    const isUsed = classSessions.some((session) => session.course?.id === courseToDelete.id);
    if (isUsed) {
      showNotification(
        `Cannot delete "${courseToDelete.name}". It is used in one or more classes.`
      );
      setCourseToDelete(null);
      return;
    }
    await removeCourse(courseToDelete.id);
    showNotification('Course removed successfully.');
    setCourseToDelete(null);
    if (editingCourse?.id === courseToDelete.id) {
      setEditingCourse(null);
    }
  };

  return (
    <>
      <div className="flex flex-col md:flex-row-reverse gap-8">
        <div className="w-full md:w-96">
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <h2 className="text-xl font-semibold mb-4 text-center">
              {editingCourse ? 'Edit Course' : 'Create Course'}
            </h2>
            <FormProvider {...formMethods}>
              <form onSubmit={formMethods.handleSubmit(editingCourse ? handleSave : handleAdd)}>
                <fieldset disabled={isSubmitting} className="space-y-1">
                  <CourseFields
                    control={formMethods.control}
                    errors={formMethods.formState.errors}
                  />
                  <div className="flex gap-2 pt-4">
                    <ActionButton type="submit" loading={isSubmitting} className="flex-1">
                      {editingCourse ? 'Save Changes' : 'Create'}
                    </ActionButton>
                    {editingCourse && (
                      <ActionButton type="button" variant="secondary" onClick={handleCancel}>
                        Cancel
                      </ActionButton>
                    )}
                  </div>
                </fieldset>
              </form>
            </FormProvider>
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-xl font-semibold mb-4">Courses</h2>
          {isLoading && <LoadingSpinner text="Loading courses..." />}
          {error && <ErrorMessage message={error} />}
          {!isLoading && !error && (
            <>
              {courses.length === 0 ? (
                <div className="text-center py-8 px-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-500">No courses created yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {courses.map((course) => (
                    <CourseCard
                      key={course.id}
                      course={course}
                      onEdit={handleEdit}
                      onDelete={handleDeleteRequest}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <ConfirmModal
        isOpen={!!courseToDelete}
        title="Confirm Deletion"
        onClose={() => setCourseToDelete(null)}
        onConfirm={handleConfirmDelete}
        isLoading={isRemoving}
        confirmText="Delete"
      >
        Are you sure you want to delete the course "{courseToDelete?.name}"?
      </ConfirmModal>
    </>
  );
};

export default CourseManagement;
