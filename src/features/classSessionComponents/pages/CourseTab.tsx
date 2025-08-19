import React, { useState } from 'react';
import { useCourses } from '../hooks';
import { useClassSessions } from '../../classSessions/hooks/useClassSessions';
import { ComponentList, ComponentForm } from './components';
import { LoadingSpinner, ErrorMessage } from '../../../components/ui';
import { showNotification } from '../../../lib/notificationsService';
import type { Course, CourseInsert, CourseUpdate } from '../types/course';

/**
 * A component that provides the UI for managing Courses.
 *
 * This component uses a two-column layout on desktop (form on the right) and a
 * single-column layout on mobile (form on top) for an optimal user experience.
 * It handles all CRUD operations for courses.
 */
const CourseManagement: React.FC = () => {
  const { courses, addCourse, updateCourse, removeCourse, loading, error } = useCourses();
  const { classSessions } = useClassSessions();
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);

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

  /** Handles removing a course, with a check to prevent deleting used items. */
  const handleRemove = async (id: string) => {
    const isUsed = classSessions.some((session) => session.course?.id === id);
    if (isUsed) {
      const courseName = courses.find((c) => c.id === id)?.name || 'the selected course';
      showNotification(
        `Cannot delete "${courseName}". It is currently used in one or more classes.`
      );
      return;
    }
    await removeCourse(id);
    setEditingCourse(null);
    showNotification('Course removed successfully.');
  };

  /** Clears the form and cancels editing. */
  const handleCancel = () => setEditingCourse(null);

  return (
    <div className="flex flex-col md:flex-row-reverse gap-8">
      {/* Form Section */}
      <div className="w-full md:w-96">
        <ComponentForm
          type="course"
          editingItem={editingCourse}
          onCancel={editingCourse ? handleCancel : undefined}
          onSubmit={editingCourse ? handleSave : handleAdd}
          loading={loading}
        />
      </div>

      {/* List Section */}
      <div className="flex-1 min-w-0">
        <h2 className="text-xl font-semibold mb-4">Courses</h2>
        {loading && !courses.length && <LoadingSpinner text="Loading courses..." />}
        {error && <ErrorMessage message={error} />}
        {!loading && !error && (
          <ComponentList<Course>
            items={courses}
            onEdit={handleEdit}
            onDelete={handleRemove}
            emptyMessage="No courses created yet."
          />
        )}
      </div>
    </div>
  );
};

export default CourseManagement;
