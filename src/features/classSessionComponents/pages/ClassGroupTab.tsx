import React, { useState } from 'react';
import { useClassGroups } from '../hooks';
import { useClassSessions } from '../../classSessions/hooks/useClassSessions';
import { ComponentList, ComponentForm } from './components';
import { LoadingSpinner, ErrorMessage, ConfirmModal } from '../../../components/ui';
import { showNotification } from '../../../lib/notificationsService';
import type { ClassGroup, ClassGroupInsert, ClassGroupUpdate } from '../types/classGroup';

/**
 * A component that provides the UI for managing Class Groups.
 *
 * This component orchestrates the display, creation, updating, and deletion of class groups.
 *
 * It uses a two-column layout on desktop and a single-column on mobile.
 * It handles all CRUD operations for courses, including a confirmation step for deletion.
 */
const ClassGroupManagement: React.FC = () => {
  const {
    classGroups,
    addClassGroup,
    updateClassGroup,
    removeClassGroup,
    isLoading,
    isSubmitting,
    isRemoving,
    error,
  } = useClassGroups();
  const { classSessions } = useClassSessions();
  const [editingGroup, setEditingGroup] = useState<ClassGroup | null>(null);
  const [groupToDelete, setGroupToDelete] = useState<ClassGroup | null>(null);

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

  /** Opens the delete confirmation modal for the selected group. */
  const handleDeleteRequest = (id: string) => {
    const group = classGroups.find((g) => g.id === id);
    if (group) {
      setGroupToDelete(group);
    }
  };

  /** Executes the deletion after confirmation. */
  const handleConfirmDelete = async () => {
    if (!groupToDelete) return;

    const isUsed = classSessions.some((session) => session.group?.id === groupToDelete.id);
    if (isUsed) {
      showNotification(
        `Cannot delete "${groupToDelete.name}". It is currently used in one or more classes.`
      );
      setGroupToDelete(null);
      return;
    }

    await removeClassGroup(groupToDelete.id);
    showNotification('Class group removed successfully.');
    setGroupToDelete(null);
    if (editingGroup?.id === groupToDelete.id) {
      setEditingGroup(null);
    }
  };

  /** Clears the form and cancels editing. */
  const handleCancel = () => setEditingGroup(null);

  return (
    <>
      <div className="flex flex-col md:flex-row-reverse gap-8">
        <div className="w-full md:w-96">
          <ComponentForm
            type="classGroup"
            editingItem={editingGroup}
            onSubmit={editingGroup ? handleSave : handleAdd}
            onCancel={editingGroup ? handleCancel : undefined}
            loading={isSubmitting}
          />
        </div>

        <div className="flex-1 min-w-0">
          <h2 className="text-xl font-semibold mb-4">Class Groups</h2>
          {isLoading && <LoadingSpinner text="Loading class groups..." />}
          {error && <ErrorMessage message={error} />}
          {!isLoading && !error && (
            <ComponentList<ClassGroup>
              items={classGroups}
              onEdit={handleEdit}
              onDelete={handleDeleteRequest}
              emptyMessage="No class groups created yet."
            />
          )}
        </div>
      </div>

      <ConfirmModal
        isOpen={!!groupToDelete}
        title="Confirm Deletion"
        onClose={() => setGroupToDelete(null)}
        onConfirm={handleConfirmDelete}
        isLoading={isRemoving}
        confirmText="Delete"
      >
        Are you sure you want to delete the class group "{groupToDelete?.name}"? This action cannot
        be undone.
      </ConfirmModal>
    </>
  );
};

export default ClassGroupManagement;
