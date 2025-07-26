import React, { useState } from 'react';
import { useClassGroups } from '../../hooks/useComponents';
import ComponentList from '../../components/componentManagement/ComponentList';
import ComponentForm from '../../components/componentManagement/ComponentForm';
import type { ClassGroup } from '../../types/classGroup';

// Page for managing class groups (list, add, edit, remove)
// TODO: Add search/filter, aggregation, and multi-user support.
const ClassGroupManagement: React.FC = () => {
  const { classGroups, addClassGroup, updateClassGroup, removeClassGroup } = useClassGroups();
  const [editingGroup, setEditingGroup] = useState<ClassGroup | null>(null);

  // Add new group
  const handleAdd = (data: Omit<ClassGroup, 'id'>) => {
    addClassGroup(data);
    setEditingGroup(null);
  };
  // Edit group
  const handleEdit = (group: ClassGroup) => setEditingGroup(group);
  // Save changes
  const handleSave = (data: Omit<ClassGroup, 'id'>) => {
    if (!editingGroup) return;
    updateClassGroup(editingGroup.id, data);
    setEditingGroup(null);
  };
  // Remove group
  const handleRemove = (id: string) => {
    removeClassGroup(id);
    setEditingGroup(null);
  };
  // Cancel editing
  const handleCancel = () => setEditingGroup(null);

  return (
    <div className="flex flex-col md:flex-row gap-8 mt-8">
      {/* List (left) */}
      <div className="flex-1 min-w-0">
        <h2 className="text-xl font-semibold mb-4">Class Groups</h2>
        <ComponentList<ClassGroup>
          items={classGroups}
          onEdit={handleEdit}
          onDelete={handleRemove}
          emptyMessage="No class groups created yet."
        />
      </div>
      {/* Form (right) */}
      <div className="w-full md:w-96">
        <ComponentForm
          type="classGroup"
          editingItem={editingGroup}
          onSubmit={editingGroup ? handleSave : handleAdd}
          onCancel={editingGroup ? handleCancel : undefined}
        />
      </div>
    </div>
  );
};

export default ClassGroupManagement;
