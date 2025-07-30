import React, { useState } from 'react';
import { useClassrooms } from '../../hooks/';
import { useClassSessions } from '../../hooks/';
import ComponentList from '../../components/componentManagement/ComponentList';
import ComponentForm from '../../components/componentManagement/ComponentForm';
import LoadingSpinner from '../../../../components/ui/LoadingSpinner';
import ErrorMessage from '../../../../components/ui/ErrorMessage';
import { showNotification } from '../../../../components/ui/Notification';
import type { Classroom, ClassroomInsert, ClassroomUpdate } from '../../types/classroom';

// Page for managing classrooms (list, add, edit, remove)
// Now fully async and backed by Supabase.
const ClassroomManagement: React.FC = () => {
  const { classrooms, addClassroom, updateClassroom, removeClassroom, loading, error } =
    useClassrooms();
  const { classSessions } = useClassSessions();
  const [editingClassroom, setEditingClassroom] = useState<Classroom | null>(null);

  // Add new classroom
  const handleAdd = async (data: ClassroomInsert | ClassroomUpdate) => {
    await addClassroom(data as ClassroomInsert);
    setEditingClassroom(null);
  };
  // Edit classroom
  const handleEdit = (classroom: Classroom) => setEditingClassroom(classroom);
  // Save changes
  const handleSave = async (data: ClassroomInsert | ClassroomUpdate) => {
    if (!editingClassroom) return;
    await updateClassroom(editingClassroom.id, data as ClassroomUpdate);
    setEditingClassroom(null);
  };
  // Remove classroom
  const handleRemove = async (id: string) => {
    const isUsed = classSessions.some((session) => session.classroom?.id === id);
    if (isUsed) {
      const classroomName = classrooms.find((c) => c.id === id)?.name || 'the selected classroom';
      showNotification(
        `Cannot delete "${classroomName}". It is currently used in one or more class sessions.`
      );
      return;
    }
    await removeClassroom(id);
    setEditingClassroom(null);
  };
  // Cancel editing
  const handleCancel = () => setEditingClassroom(null);

  return (
    <div className="flex flex-col md:flex-row gap-8 mt-8">
      <div className="flex-1 min-w-0">
        <h2 className="text-xl font-semibold mb-4">Classrooms</h2>
        {loading && <LoadingSpinner text="Loading classrooms..." />}
        {error && <ErrorMessage message={error} />}
        {!loading && !error && (
          <ComponentList<Classroom>
            items={classrooms}
            onEdit={handleEdit}
            onDelete={handleRemove}
            emptyMessage="No classrooms created yet."
          />
        )}
      </div>
      <div className="w-full md:w-96">
        <ComponentForm
          type="classroom"
          editingItem={editingClassroom}
          onCancel={editingClassroom ? handleCancel : undefined}
          onSubmit={editingClassroom ? handleSave : handleAdd}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default ClassroomManagement;
