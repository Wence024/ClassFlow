import React, { useState } from 'react';
import { useClassrooms } from '../hooks';
import { useClassSessions } from '../../classSessions/hooks/useClassSessions';
import { ComponentList, ComponentForm } from './components';
import { LoadingSpinner, ErrorMessage } from '../../../components/ui';
import { showNotification } from '../../../lib/notificationsService';
import type { Classroom, ClassroomInsert, ClassroomUpdate } from '../types/classroom';

/**
 * A component that provides the UI for managing Classrooms.
 *
 * This component uses a two-column layout on desktop (form on the right) and a
 * single-column layout on mobile (form on top) for an optimal user experience.
 * It handles all CRUD operations for classrooms.
 */
const ClassroomManagement: React.FC = () => {
  const {
    classrooms,
    addClassroom,
    updateClassroom,
    removeClassroom,
    isLoading,
    isSubmitting,
    error,
  } = useClassrooms();
  const { classSessions } = useClassSessions();
  const [editingClassroom, setEditingClassroom] = useState<Classroom | null>(null);

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

  /** Handles removing a classroom, with a check to prevent deleting used items. */
  const handleRemove = async (id: string) => {
    const isUsed = classSessions.some((session) => session.classroom?.id === id);
    if (isUsed) {
      const classroomName = classrooms.find((c) => c.id === id)?.name || 'the selected classroom';
      showNotification(
        `Cannot delete "${classroomName}". It is currently used in one or more classes.`
      );
      return;
    }
    await removeClassroom(id);
    setEditingClassroom(null);
    showNotification('Classroom removed successfully.');
  };

  /** Clears the form and cancels editing. */
  const handleCancel = () => setEditingClassroom(null);

  return (
    <div className="flex flex-col md:flex-row-reverse gap-8">
      {/* Form Section */}
      <div className="w-full md:w-96">
        <ComponentForm
          type="classroom"
          editingItem={editingClassroom}
          onCancel={editingClassroom ? handleCancel : undefined}
          onSubmit={editingClassroom ? handleSave : handleAdd}
          loading={isSubmitting}
        />
      </div>

      {/* List Section */}
      <div className="flex-1 min-w-0">
        <h2 className="text-xl font-semibold mb-4">Classrooms</h2>
        {isLoading && <LoadingSpinner text="Loading classrooms..." />}
        {error && <ErrorMessage message={error} />}
        {!isLoading && !error && (
          <ComponentList<Classroom>
            items={classrooms}
            onEdit={handleEdit}
            onDelete={handleRemove}
            emptyMessage="No classrooms created yet."
          />
        )}
      </div>
    </div>
  );
};

export default ClassroomManagement;
