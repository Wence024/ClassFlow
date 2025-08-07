import React, { useState } from 'react';
import { useClassGroups } from '../hooks';
import { useClassSessions } from '../../classes/useClassSessions';
import { ComponentList, ComponentForm } from '../components/';
import { LoadingSpinner, ErrorMessage } from '../../../components/ui';
import { showNotification } from '../../../lib/notificationsService';
import type { ClassGroup, ClassGroupInsert, ClassGroupUpdate } from '../types/classGroup';

// Page for managing class groups (list, add, edit, remove)
// Now fully async and backed by Supabase.
const ClassGroupManagement: React.FC = () => {
  const { classGroups, addClassGroup, updateClassGroup, removeClassGroup, loading, error } =
    useClassGroups();
  const { classSessions } = useClassSessions();
  const [editingGroup, setEditingGroup] = useState<ClassGroup | null>(null);

  // Add new group
  const handleAdd = async (data: ClassGroupInsert | ClassGroupUpdate) => {
    await addClassGroup(data as ClassGroupInsert);
    setEditingGroup(null);
  };
  // Edit group
  const handleEdit = (group: ClassGroup) => setEditingGroup(group);
  // Save changes
  const handleSave = async (data: ClassGroupInsert | ClassGroupUpdate) => {
    if (!editingGroup) return;
    await updateClassGroup(editingGroup.id, data as ClassGroupUpdate);
    setEditingGroup(null);
  };
  // Remove group
  const handleRemove = async (id: string) => {
    const isUsed = classSessions.some((session) => session.group?.id === id);
    if (isUsed) {
      const groupName = classGroups.find((g) => g.id === id)?.name || 'the selected group';
      showNotification(
        `Cannot delete "${groupName}". It is currently used in one or more classes.`
      );
      return;
    }
    await removeClassGroup(id);
    setEditingGroup(null);
  };
  // Cancel editing
  const handleCancel = () => setEditingGroup(null);

  return (
    <div className="flex flex-col md:flex-row gap-8 mt-8">
      <div className="flex-1 min-w-0">
        <h2 className="text-xl font-semibold mb-4">Class Groups</h2>
        {loading && <LoadingSpinner text="Loading class groups..." />}
        {error && <ErrorMessage message={error} />}
        {!loading && !error && (
          <ComponentList<ClassGroup>
            items={classGroups}
            onEdit={handleEdit}
            onDelete={handleRemove}
            emptyMessage="No class groups created yet."
          />
        )}
      </div>
      <div className="w-full md:w-96">
        <ComponentForm
          type="classGroup"
          editingItem={editingGroup}
          onSubmit={editingGroup ? handleSave : handleAdd}
          onCancel={editingGroup ? handleCancel : undefined}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default ClassGroupManagement;
