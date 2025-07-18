import React, { useState } from 'react';
import { useClassrooms } from '../../hooks/useComponents';
import ComponentList from '../../components/componentManagement/ComponentList';
import ComponentForm from '../../components/componentManagement/ComponentForm';
import type { Classroom } from '../../types/scheduleLessons';

// Page for managing classrooms (list, add, edit, remove)
// TODO: Add search/filter, aggregation, and multi-user support.
const ClassroomManagement: React.FC = () => {
  const { classrooms, addClassroom, updateClassroom, removeClassroom } = useClassrooms();
  const [editingClassroom, setEditingClassroom] = useState<Classroom | null>(null);

  // Add new classroom
  const handleAdd = (data: Omit<Classroom, 'id'>) => {
    addClassroom(data);
    setEditingClassroom(null);
  };
  // Edit classroom
  const handleEdit = (classroom: Classroom) => setEditingClassroom(classroom);
  // Save changes
  const handleSave = (data: Omit<Classroom, 'id'>) => {
    if (!editingClassroom) return;
    updateClassroom(editingClassroom.id, data);
    setEditingClassroom(null);
  };
  // Remove classroom
  const handleRemove = (id: string) => {
    removeClassroom(id);
    setEditingClassroom(null);
  };
  // Cancel editing
  const handleCancel = () => setEditingClassroom(null);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Classrooms</h2>
      <ComponentList
        items={classrooms}
        onEdit={handleEdit}
        onDelete={handleRemove}
        emptyMessage="No classrooms created yet."
      />
      <ComponentForm
        type="classroom"
        editingItem={editingClassroom}
        onSubmit={editingClassroom ? handleSave : handleAdd}
        onCancel={editingClassroom ? handleCancel : undefined}
      />
    </div>
  );
};

export default ClassroomManagement;
