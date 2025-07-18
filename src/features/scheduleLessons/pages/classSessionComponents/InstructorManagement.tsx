import React, { useState } from 'react';
import { useInstructors } from '../../hooks/useComponents';
import ComponentList from '../../components/componentManagement/ComponentList';
import ComponentForm from '../../components/componentManagement/ComponentForm';
import type { Instructor } from '../../types/scheduleLessons';

// Page for managing instructors (list, add, edit, remove)
// TODO: Add search/filter, aggregation, and multi-user support.
const InstructorManagement: React.FC = () => {
  const { instructors, addInstructor, updateInstructor, removeInstructor } = useInstructors();
  const [editingInstructor, setEditingInstructor] = useState<Instructor | null>(null);

  // Add new instructor
  const handleAdd = (data: Omit<Instructor, 'id'>) => {
    addInstructor(data);
    setEditingInstructor(null);
  };
  // Edit instructor
  const handleEdit = (instructor: Instructor) => setEditingInstructor(instructor);
  // Save changes
  const handleSave = (data: Omit<Instructor, 'id'>) => {
    if (!editingInstructor) return;
    updateInstructor(editingInstructor.id, data);
    setEditingInstructor(null);
  };
  // Remove instructor
  const handleRemove = (id: string) => {
    removeInstructor(id);
    setEditingInstructor(null);
  };
  // Cancel editing
  const handleCancel = () => setEditingInstructor(null);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Instructors</h2>
      <ComponentList
        items={instructors}
        onEdit={handleEdit}
        onDelete={handleRemove}
        emptyMessage="No instructors created yet."
      />
      <ComponentForm
        type="instructor"
        editingItem={editingInstructor}
        onSubmit={editingInstructor ? handleSave : handleAdd}
        onCancel={editingInstructor ? handleCancel : undefined}
      />
    </div>
  );
};

export default InstructorManagement;
