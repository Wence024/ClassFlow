import React, { useState, useEffect, useMemo } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../../auth/hooks/useAuth';
import { useCourses } from '../hooks';
import { useClassSessions } from '../../classSessions/hooks/useClassSessions';
import { CourseFields, CourseCard } from './components/course';
import {
  ActionButton,
  ConfirmModal,
  ErrorMessage,
  FormField,
  LoadingSpinner,
} from '../../../components/ui';
import { componentSchemas } from '../types/validation';
import type { Course } from '../types';
import { showNotification } from '../../../lib/notificationsService';
import { getRandomPresetColor } from '../../../lib/colorUtils';

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
  const [searchTerm, setSearchTerm] = useState(''); // <-- NEW: State for the search term
  const [presetColor, setRandomPresetColor] = useState(getRandomPresetColor());

  const formMethods = useForm<CourseFormData>({
    resolver: zodResolver(componentSchemas.course),
    defaultValues: { name: '', code: '', color: presetColor },
  });

  useEffect(() => {
    if (editingCourse) {
      formMethods.reset(editingCourse);
    } else {
      formMethods.reset({ name: '', code: '', color: presetColor });
    }
  }, [editingCourse, formMethods, presetColor]);

  // NEW: Memoize the filtered list to avoid re-calculating on every render
  const filteredCourses = useMemo(() => {
    if (!searchTerm) return courses;
    return courses.filter(
      (course) =>
        course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.code.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [courses, searchTerm]);

  const handleAdd = async (data: CourseFormData) => {
    if (!user) return;
    await addCourse({ ...data, user_id: user.id });
    formMethods.reset();
    showNotification('Course created successfully!');
    setRandomPresetColor(getRandomPresetColor());
  };

  const handleSave = async (data: CourseFormData) => {
    if (!editingCourse) return;
    await updateCourse(editingCourse.id, data);
    setEditingCourse(null);
    showNotification('Course updated successfully!');
    setRandomPresetColor(getRandomPresetColor());
  };

  const handleCancel = () => {
    setEditingCourse(null);
    setRandomPresetColor(getRandomPresetColor());
  };
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

          {/* NEW: Search input */}
          <div className="mb-4">
            <FormField
              id="search-courses"
              label="Search Courses"
              placeholder="Search by name or code..."
              value={searchTerm}
              onChange={setSearchTerm}
            />
          </div>

          {isLoading && <LoadingSpinner text="Loading courses..." />}
          {error && <ErrorMessage message={error} />}
          {!isLoading && !error && (
            <>
              {/* Use the filtered list for rendering */}
              {filteredCourses.length === 0 ? (
                <div className="text-center py-8 px-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-500">
                    {searchTerm ? 'No courses match your search.' : 'No courses created yet.'}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredCourses.map((course) => (
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
