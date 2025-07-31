import React, { useState } from 'react';
import { useCourses } from '../../hooks/';
import { useClassSessions } from '../../hooks/useClassSessions';
import ComponentList from '../../components/componentManagement/ComponentList';
import ComponentForm from '../../components/componentManagement/ComponentForm';
import LoadingSpinner from '../../../../components/ui/LoadingSpinner';
import ErrorMessage from '../../../../components/ui/ErrorMessage';
import { showNotification } from '../../../../components/ui/Notification';
import type { Course, CourseInsert, CourseUpdate } from '../../types/course';

// Page for managing courses (list, add, edit, remove)
// TODO: Add search/filter, aggregation, and multi-user support.
const CourseManagement: React.FC = () => {
  const { courses, addCourse, updateCourse, removeCourse, loading, error } = useCourses();
  const { classSessions } = useClassSessions();
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);

  // Add new course
  const handleAdd = async (data: CourseInsert | CourseUpdate) => {
    await addCourse(data as CourseInsert);
    setEditingCourse(null);
  };
  // Edit course
  const handleEdit = (course: Course) => setEditingCourse(course);
  // Save changes
  const handleSave = async (data: CourseInsert | CourseUpdate) => {
    if (!editingCourse) return;
    await updateCourse(editingCourse.id, data as CourseUpdate);
    setEditingCourse(null);
  };
  // Remove course
  const handleRemove = async (id: string) => {
    const isUsed = classSessions.some((session) => session.course?.id === id);
    if (isUsed) {
      const courseName = courses.find((c) => c.id === id)?.name || 'the selected course';
      showNotification(
        `Cannot delete "${courseName}". It is currently used in one or more class sessions.`
      );
      return;
    }
    await removeCourse(id);
    setEditingCourse(null);
  };
  // Cancel editing
  const handleCancel = () => setEditingCourse(null);

  return (
    <div className="flex flex-col md:flex-row gap-8 mt-8">
      <div className="flex-1 min-w-0">
        <h2 className="text-xl font-semibold mb-4">Courses</h2>
        {loading && <LoadingSpinner text="Loading courses..." />}
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
      <div className="w-full md:w-96">
        <ComponentForm
          type="course"
          editingItem={editingCourse}
          onCancel={editingCourse ? handleCancel : undefined}
          onSubmit={editingCourse ? handleSave : handleAdd}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default CourseManagement;
