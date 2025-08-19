import React, { useState } from 'react';
import { useCourses } from '../hooks';
import { useClassSessions } from '../../classSessions/hooks/useClassSessions';
import { ComponentList, ComponentForm } from './components';
import { LoadingSpinner, ErrorMessage, ConfirmModal } from '../../../components/ui';
import { showNotification } from '../../../lib/notificationsService';
import type { Course, CourseInsert, CourseUpdate } from '../types/course';

/**
 * A component that provides the UI for managing Courses.
 *
 * This component uses a two-column layout on desktop and a single-column on mobile.
 * It handles all CRUD operations for courses, including a confirmation step for deletion.
 */
const CourseManagement: React.FC = () => {
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
  /** State to manage the course targeted for deletion and control the confirmation modal. */
  const [courseToDelete, setCourseToDelete] = useState<Course | null>(null);

  /** Handles adding a new course. */
  const handleAdd = async (data: CourseInsert | CourseUpdate) => {
    await addCourse(data as CourseInsert);
    showNotification('Course created successfully!');
  };

  /** Sets a course into the form for editing. */
  const handleEdit = (course: Course) => setEditingCourse(course);

  /** Handles saving changes to an existing course. */
  const handleSave = async (data: CourseInsert | CourseUpdate) => {
    if (!editingCourse) return;
    await updateCourse(editingCourse.id, data as CourseUpdate);
    setEditingCourse(null);
    showNotification('Course updated successfully!');
  };

  /** Opens the delete confirmation modal for the selected course. */
  const handleDeleteRequest = (id: string) => {
    const course = courses.find((c) => c.id === id);
    if (course) {
      setCourseToDelete(course);
    }
  };

  /** Executes the deletion after confirmation. */
  const handleConfirmDelete = async () => {
    if (!courseToDelete) return;

    const isUsed = classSessions.some((session) => session.course?.id === courseToDelete.id);
    if (isUsed) {
      showNotification(
        `Cannot delete "${courseToDelete.name}". It is currently used in one or more classes.`
      );
      setCourseToDelete(null); // Close the modal
      return;
    }

    await removeCourse(courseToDelete.id);
    showNotification('Course removed successfully.');
    setCourseToDelete(null); // Close the modal
    if (editingCourse?.id === courseToDelete.id) {
      setEditingCourse(null); // Clear form if the deleted item was being edited.
    }
  };

  /** Clears the form and cancels editing. */
  const handleCancel = () => setEditingCourse(null);

  return (
    <>
      <div className="flex flex-col md:flex-row-reverse gap-8">
        {/* Form Section */}
        <div className="w-full md:w-96">
          <ComponentForm
            type="course"
            editingItem={editingCourse}
            onCancel={editingCourse ? handleCancel : undefined}
            onSubmit={editingCourse ? handleSave : handleAdd}
            loading={isSubmitting}
          />
        </div>

        {/* List Section */}
        <div className="flex-1 min-w-0">
          <h2 className="text-xl font-semibold mb-4">Courses</h2>
          {isLoading && <LoadingSpinner text="Loading courses..." />}
          {error && <ErrorMessage message={error} />}
          {!isLoading && !error && (
            <ComponentList<Course>
              items={courses}
              onEdit={handleEdit}
              onDelete={handleDeleteRequest}
              emptyMessage="No courses created yet."
            />
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={!!courseToDelete}
        title="Confirm Deletion"
        onClose={() => setCourseToDelete(null)}
        onConfirm={handleConfirmDelete}
        isLoading={isRemoving}
        confirmText="Delete"
      >
        Are you sure you want to delete the course "{courseToDelete?.name}"? This action cannot be
        undone.
      </ConfirmModal>
    </>
  );
};

export default CourseManagement;
