import React, { useState } from 'react';
import { useClassGroups } from '../hooks';
import { useClassSessions } from '../../classSessions/hooks/useClassSessions';
import { ComponentList, ComponentForm } from './components';
import { LoadingSpinner, ErrorMessage } from '../../../components/ui';
import { showNotification } from '../../../lib/notificationsService';
import type { ClassGroup, ClassGroupInsert, ClassGroupUpdate } from '../types/classGroup';

/**
 * A component that provides the UI for managing Class Groups.
 *
 * This component orchestrates the display, creation, updating, and deletion of class groups.
 * It uses a two-column layout on desktop (form on the right) and a single-column layout
 * on mobile (form on top) for an optimal user experience on all devices.
 */
const ClassGroupManagement: React.FC = () => {
  const { classGroups, addClassGroup, updateClassGroup, removeClassGroup, loading, error } =
    useClassGroups();
  const { classSessions } = useClassSessions();
  const [editingGroup, setEditingGroup] = useState<ClassGroup | null>(null);

  /** Handles adding a new group. */
  const handleAdd = async (data: ClassGroupInsert | ClassGroupUpdate) => {
    await addClassGroup(data as ClassGroupInsert);
    showNotification('Class group created successfully!');
  };

  /** Sets a group into the form for editing. */
  const handleEdit = (group: ClassGroup) => setEditingGroup(group);

  /** Handles saving changes to an existing group. */
  const handleSave = async (data: ClassGroupInsert | ClassGroupUpdate) => {
    if (!editingGroup) return;
    await updateClassGroup(editingGroup.id, data as ClassGroupUpdate);
    setEditingGroup(null);
    showNotification('Class group updated successfully!');
  };

  /** Handles removing a group, with a check to prevent deleting used items. */
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
    showNotification('Class group removed successfully.');
  };

  /** Clears the form and cancels editing. */
  const handleCancel = () => setEditingGroup(null);

  return (
    <div className="flex flex-col md:flex-row-reverse gap-8">
      {/* Form Section */}
      <div className="w-full md:w-96">
        <ComponentForm
          type="classGroup"
          editingItem={editingGroup}
          onSubmit={editingGroup ? handleSave : handleAdd}
          onCancel={editingGroup ? handleCancel : undefined}
          loading={loading}
        />
      </div>

      {/* List Section */}
      <div className="flex-1 min-w-0">
        <h2 className="text-xl font-semibold mb-4">Class Groups</h2>
        {loading && !classGroups.length && <LoadingSpinner text="Loading class groups..." />}
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
    </div>
  );
};

export default ClassGroupManagement;
