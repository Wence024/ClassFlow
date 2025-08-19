import React, { useState } from 'react';
import { useClassrooms } from '../hooks';
import { useClassSessions } from '../../classSessions/hooks/useClassSessions';
import { ComponentList, ComponentForm } from './components';
import { LoadingSpinner, ErrorMessage, ConfirmModal } from '../../../components/ui';
import { showNotification } from '../../../lib/notificationsService';
import type { Classroom, ClassroomInsert, ClassroomUpdate } from '../types/classroom';

/**
 * A component that provides the UI for managing Classrooms.
 *
 * This component uses a two-column layout on desktop and a single-column on mobile.
 *
 * This component handles all CRUD operations for classrooms, including a confirmation
 * step for deletion.
 */
const ClassroomManagement: React.FC = () => {
  const {
    classrooms,
    addClassroom,
    updateClassroom,
    removeClassroom,
    isLoading,
    isSubmitting,
    isRemoving,
    error,
  } = useClassrooms();
  const { classSessions } = useClassSessions();
  const [editingClassroom, setEditingClassroom] = useState<Classroom | null>(null);
  const [classroomToDelete, setClassroomToDelete] = useState<Classroom | null>(null);

  /** Handles adding a new classroom. */
  const handleAdd = async (data: ClassroomInsert | ClassroomUpdate) => {
    await addClassroom(data as ClassroomInsert);
    showNotification('Classroom created successfully!');
  };

  /** Sets a classroom into the form for editing. */
  const handleEdit = (classroom: Classroom) => setEditingClassroom(classroom);

  /** Handles saving changes to an existing classroom. */
  const handleSave = async (data: ClassroomInsert | ClassroomUpdate) => {
    if (!editingClassroom) return;
    await updateClassroom(editingClassroom.id, data as ClassroomUpdate);
    setEditingClassroom(null);
    showNotification('Classroom updated successfully!');
  };

  /** Opens the delete confirmation modal for the selected classroom. */
  const handleDeleteRequest = (id: string) => {
    const classroom = classrooms.find((c) => c.id === id);
    if (classroom) {
      setClassroomToDelete(classroom);
    }
  };

  /** Executes the deletion after confirmation. */
  const handleConfirmDelete = async () => {
    if (!classroomToDelete) return;

    const isUsed = classSessions.some((session) => session.classroom?.id === classroomToDelete.id);
    if (isUsed) {
      showNotification(
        `Cannot delete "${classroomToDelete.name}". It is currently used in one or more classes.`
      );
      setClassroomToDelete(null);
      return;
    }

    await removeClassroom(classroomToDelete.id);
    showNotification('Classroom removed successfully.');
    setClassroomToDelete(null);
    if (editingClassroom?.id === classroomToDelete.id) {
      setEditingClassroom(null);
    }
  };

  /** Clears the form and cancels editing. */
  const handleCancel = () => setEditingClassroom(null);

  return (
    <>
      <div className="flex flex-col md:flex-row-reverse gap-8">
        <div className="w-full md:w-96">
          <ComponentForm
            type="classroom"
            editingItem={editingClassroom}
            onCancel={editingClassroom ? handleCancel : undefined}
            onSubmit={editingClassroom ? handleSave : handleAdd}
            loading={isSubmitting}
          />
        </div>

        <div className="flex-1 min-w-0">
          <h2 className="text-xl font-semibold mb-4">Classrooms</h2>
          {isLoading && <LoadingSpinner text="Loading classrooms..." />}
          {error && <ErrorMessage message={error} />}
          {!isLoading && !error && (
            <ComponentList<Classroom>
              items={classrooms}
              onEdit={handleEdit}
              onDelete={handleDeleteRequest}
              emptyMessage="No classrooms created yet."
            />
          )}
        </div>
      </div>

      <ConfirmModal
        isOpen={!!classroomToDelete}
        title="Confirm Deletion"
        onClose={() => setClassroomToDelete(null)}
        onConfirm={handleConfirmDelete}
        isLoading={isRemoving}
        confirmText="Delete"
      >
        Are you sure you want to delete the classroom "{classroomToDelete?.name}"? This action
        cannot be undone.
      </ConfirmModal>
    </>
  );
};

export default ClassroomManagement;
