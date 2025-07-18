import React, { useState } from 'react';
import { useClassGroups } from '../../hooks/useComponents';
import ComponentList from '../../components/componentManagement/ComponentList';
import ComponentForm from '../../components/componentManagement/ComponentForm';
import type { ClassGroup } from '../../types/scheduleLessons';

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
    <div>
      <h2 className="text-xl font-semibold mb-4">Class Groups</h2>
      <ComponentList
        items={classGroups}
        onEdit={handleEdit}
        onDelete={handleRemove}
        emptyMessage="No class groups created yet."
      />
      <ComponentForm
        type="classGroup"
        editingItem={editingGroup}
        onSubmit={editingGroup ? handleSave : handleAdd}
        onCancel={editingGroup ? handleCancel : undefined}
      />
    </div>
  );
};

export default ClassGroupManagement;
