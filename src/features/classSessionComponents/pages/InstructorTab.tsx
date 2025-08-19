import React, { useState } from 'react';
import { useInstructors } from '../hooks';
import { useClassSessions } from '../../classSessions/hooks/useClassSessions';
import { ComponentList, ComponentForm } from './components';
import { LoadingSpinner, ErrorMessage } from '../../../components/ui';
import { showNotification } from '../../../lib/notificationsService';
import type { Instructor, InstructorInsert, InstructorUpdate } from '../types/instructor';

/**
 * A component that provides the UI for managing Instructors.
 *
 * This component uses a two-column layout on desktop (form on the right) and a
 * single-column layout on mobile (form on top) for an optimal user experience.
 * It handles all CRUD operations for instructors.
 */
const InstructorManagement: React.FC = () => {
  const { instructors, addInstructor, updateInstructor, removeInstructor, loading, error } =
    useInstructors();
  const { classSessions } = useClassSessions();
  const [editingInstructor, setEditingInstructor] = useState<Instructor | null>(null);

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

  /** Handles removing an instructor, with a check to prevent deleting used items. */
  const handleRemove = async (id: string) => {
    const isUsed = classSessions.some((session) => session.instructor?.id === id);
    if (isUsed) {
      const instructorName =
        instructors.find((i) => i.id === id)?.name || 'the selected instructor';
      showNotification(
        `Cannot delete "${instructorName}". It is currently used in one or more classes.`
      );
      return;
    }
    await removeInstructor(id);
    setEditingInstructor(null);
    showNotification('Instructor removed successfully.');
  };

  /** Clears the form and cancels editing. */
  const handleCancel = () => setEditingInstructor(null);

  return (
    <div className="flex flex-col md:flex-row-reverse gap-8">
      {/* Form Section */}
      <div className="w-full md:w-96">
        <ComponentForm
          type="instructor"
          editingItem={editingInstructor}
          onCancel={editingInstructor ? handleCancel : undefined}
          onSubmit={editingInstructor ? handleSave : handleAdd}
          loading={loading}
        />
      </div>

      {/* List Section */}
      <div className="flex-1 min-w-0">
        <h2 className="text-xl font-semibold mb-4">Instructors</h2>
        {loading && !instructors.length && <LoadingSpinner text="Loading instructors..." />}
        {error && <ErrorMessage message={error} />}
        {!loading && !error && (
          <ComponentList<Instructor>
            items={instructors}
            onEdit={handleEdit}
            onDelete={handleRemove}
            emptyMessage="No instructors created yet."
          />
        )}
      </div>
    </div>
  );
};

export default InstructorManagement;
