import React, { useState } from 'react';
import { useInstructors } from '../../hooks/';
import { useClassSessions } from '../../hooks/useClassSessions';
import ComponentList from '../../components/componentManagement/ComponentList';
import ComponentForm from '../../components/componentManagement/ComponentForm';
import LoadingSpinner from '../../../../components/ui/LoadingSpinner';
import ErrorMessage from '../../../../components/ui/ErrorMessage';
import { showNotification } from '../../../../components/ui/Notification';
import type { Instructor, InstructorInsert, InstructorUpdate } from '../../types/instructor';

// Page for managing instructors (list, add, edit, remove)
// Now fully async and backed by Supabase.
const InstructorManagement: React.FC = () => {
  const { instructors, addInstructor, updateInstructor, removeInstructor, loading, error } =
    useInstructors();
  const { classSessions } = useClassSessions();
  const [editingInstructor, setEditingInstructor] = useState<Instructor | null>(null);

  // Add new instructor
  const handleAdd = async (data: InstructorInsert | InstructorUpdate) => {
    await addInstructor(data as InstructorInsert);
    setEditingInstructor(null);
  };
  // Edit instructor
  const handleEdit = (instructor: Instructor) => setEditingInstructor(instructor);
  // Save changes
  const handleSave = async (data: InstructorInsert | InstructorUpdate) => {
    if (!editingInstructor) return;
    await updateInstructor(editingInstructor.id, data as InstructorUpdate);
    setEditingInstructor(null);
  };
  // Remove instructor
  const handleRemove = async (id: string) => {
    const isUsed = classSessions.some((session) => session.instructor?.id === id);
    if (isUsed) {
      const instructorName =
        instructors.find((i) => i.id === id)?.name || 'the selected instructor';
      showNotification(
        `Cannot delete "${instructorName}". It is currently used in one or more class sessions.`
      );
      return;
    }
    await removeInstructor(id);
    setEditingInstructor(null);
  };
  // Cancel editing
  const handleCancel = () => setEditingInstructor(null);

  return (
    <div className="flex flex-col md:flex-row gap-8 mt-8">
      <div className="flex-1 min-w-0">
        <h2 className="text-xl font-semibold mb-4">Instructors</h2>
        {loading && <LoadingSpinner text="Loading instructors..." />}
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
      <div className="w-full md:w-96">
        <ComponentForm
          type="instructor"
          editingItem={editingInstructor}
          onCancel={editingInstructor ? handleCancel : undefined}
          onSubmit={editingInstructor ? handleSave : handleAdd}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default InstructorManagement;
