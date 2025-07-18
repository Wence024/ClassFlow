import React, { useState } from 'react';
import { useCourses } from '../../hooks/useComponents';
import ComponentList from '../../components/componentManagement/ComponentList';
import ComponentForm from '../../components/componentManagement/ComponentForm';
import type { Course } from '../../types/scheduleLessons';

// Page for managing courses (list, add, edit, remove)
// TODO: Add search/filter, aggregation, and multi-user support.
const CourseManagement: React.FC = () => {
  const { courses, addCourse, updateCourse, removeCourse } = useCourses();
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);

  // Add new course
  const handleAdd = (data: Omit<Course, 'id'>) => {
    addCourse(data);
    setEditingCourse(null);
  };
  // Edit course
  const handleEdit = (course: Course) => setEditingCourse(course);
  // Save changes
  const handleSave = (data: Omit<Course, 'id'>) => {
    if (!editingCourse) return;
    updateCourse(editingCourse.id, data);
    setEditingCourse(null);
  };
  // Remove course
  const handleRemove = (id: string) => {
    removeCourse(id);
    setEditingCourse(null);
  };
  // Cancel editing
  const handleCancel = () => setEditingCourse(null);

  return (
    <div className="flex flex-col md:flex-row gap-8 mt-8">
      {/* List (left) */}
      <div className="flex-1 min-w-0">
        <h2 className="text-xl font-semibold mb-4">Courses</h2>
        <ComponentList<Course>
          items={courses}
          onEdit={handleEdit}
          onDelete={handleRemove}
          emptyMessage="No courses created yet."
        />
      </div>
      {/* Form (right) */}
      <div className="w-full md:w-96">
        <ComponentForm
          type="course"
          editingItem={editingCourse}
          onSubmit={editingCourse ? handleSave : handleAdd}
          onCancel={editingCourse ? handleCancel : undefined}
        />
      </div>
    </div>
  );
};

export default CourseManagement;
