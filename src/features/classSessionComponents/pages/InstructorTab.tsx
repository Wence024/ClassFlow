import React, { useState } from 'react';
import { useInstructors } from '../hooks';
import { useClassSessions } from '../../classSessions/hooks/useClassSessions';
import { ComponentList, ComponentForm } from './components';
import { LoadingSpinner, ErrorMessage, ConfirmModal } from '../../../components/ui';
import { showNotification } from '../../../lib/notificationsService';
import type { Instructor, InstructorInsert, InstructorUpdate } from '../types/instructor';

/**
 * A component that provides the UI for managing Instructors.
 *
 * This component uses a two-column layout on desktop and a single-column on mobile.
 * This component handles all CRUD operations for instructors, including a confirmation
 * step for deletion.
 */
const InstructorManagement: React.FC = () => {
  const {
    instructors,
    addInstructor,
    updateInstructor,
    removeInstructor,
    isLoading,
    isSubmitting,
    isRemoving,
    error,
  } = useInstructors();
  const { classSessions } = useClassSessions();
  const [editingInstructor, setEditingInstructor] = useState<Instructor | null>(null);
  const [instructorToDelete, setInstructorToDelete] = useState<Instructor | null>(null);

  /** Handles adding a new instructor. */
  const handleAdd = async (data: InstructorInsert | InstructorUpdate) => {
    await addInstructor(data as InstructorInsert);
    showNotification('Instructor added successfully!');
  };

  /** Sets an instructor into the form for editing. */
  const handleEdit = (instructor: Instructor) => setEditingInstructor(instructor);

  /** Handles saving changes to an existing instructor. */
  const handleSave = async (data: InstructorInsert | InstructorUpdate) => {
    if (!editingInstructor) return;
    await updateInstructor(editingInstructor.id, data as InstructorUpdate);
    setEditingInstructor(null);
    showNotification('Instructor updated successfully!');
  };

  /** Opens the delete confirmation modal for the selected instructor. */
  const handleDeleteRequest = (id: string) => {
    const instructor = instructors.find((i) => i.id === id);
    if (instructor) {
      setInstructorToDelete(instructor);
    }
  };

  /** Executes the deletion after confirmation. */
  const handleConfirmDelete = async () => {
    if (!instructorToDelete) return;

    const isUsed = classSessions.some(
      (session) => session.instructor?.id === instructorToDelete.id
    );
    if (isUsed) {
      showNotification(
        `Cannot delete "${instructorToDelete.name}". He/she is currently assigned to one or more classes.`
      );
      setInstructorToDelete(null);
      return;
    }

    await removeInstructor(instructorToDelete.id);
    showNotification('Instructor removed successfully.');
    setInstructorToDelete(null);
    if (editingInstructor?.id === instructorToDelete.id) {
      setEditingInstructor(null);
    }
  };

  /** Clears the form and cancels editing. */
  const handleCancel = () => setEditingInstructor(null);

  return (
    <>
      <div className="flex flex-col md:flex-row-reverse gap-8">
        <div className="w-full md:w-96">
          <ComponentForm
            type="instructor"
            editingItem={editingInstructor}
            onCancel={editingInstructor ? handleCancel : undefined}
            onSubmit={editingInstructor ? handleSave : handleAdd}
            loading={isSubmitting}
          />
        </div>

        <div className="flex-1 min-w-0">
          <h2 className="text-xl font-semibold mb-4">Instructors</h2>
          {isLoading && <LoadingSpinner text="Loading instructors..." />}
          {error && <ErrorMessage message={error} />}
          {!isLoading && !error && (
            <ComponentList<Instructor>
              items={instructors}
              onEdit={handleEdit}
              onDelete={handleDeleteRequest}
              emptyMessage="No instructors created yet."
            />
          )}
        </div>
      </div>

      <ConfirmModal
        isOpen={!!instructorToDelete}
        title="Confirm Deletion"
        onClose={() => setInstructorToDelete(null)}
        onConfirm={handleConfirmDelete}
        isLoading={isRemoving}
        confirmText="Delete"
      >
        Are you sure you want to delete the instructor "{instructorToDelete?.name}"? This action
        cannot be undone.
      </ConfirmModal>
    </>
  );
};

export default InstructorManagement;
