import React, { useState, useEffect, useMemo } from 'react';
// No longer need UseFormReturn
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../../auth/hooks/useAuth';
import { useClassrooms } from '../hooks';
import { useClassSessions } from '../../classSessions/hooks/useClassSessions';
import { ClassroomFields, ClassroomCard } from './components/classroom';
import {
  ActionButton,
  ConfirmModal,
  ErrorMessage,
  FormField,
  LoadingSpinner,
} from '../../../components/ui';
import { componentSchemas } from '../types/validation';
import type { Classroom } from '../types';
import { showNotification } from '../../../lib/notificationsService';
import { getRandomPresetColor } from '../../../lib/colorUtils';

type ClassroomFormData = z.infer<typeof componentSchemas.classroom>;

/**
 * Renders the UI for managing Classrooms.
 * Orchestrates the `useClassrooms` hook with the `ClassroomFields` form and `ClassroomCard` list.
 *
 * @returns The ClassroomManagement component.
 */
const ClassroomManagement: React.FC = () => {
  const { user } = useAuth();
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
  const [searchTerm, setSearchTerm] = useState(''); // <-- NEW: State for the search term
  const [presetColor, setRandomPresetColor] = useState(getRandomPresetColor());

  // The hook can now correctly infer the type without extra help
  const formMethods = useForm<ClassroomFormData>({
    resolver: zodResolver(componentSchemas.classroom),
    defaultValues: { name: '', code: '', capacity: 0, color: presetColor },
  });

  useEffect(() => {
    if (editingClassroom) {
      formMethods.reset({
        ...editingClassroom,
        // Ensure the value passed to the form is a number, not null
        capacity: editingClassroom.capacity ?? 0,
      });
    } else {
      formMethods.reset({ name: '', code: '', capacity: 0, color: presetColor });
    }
  }, [editingClassroom, formMethods, presetColor]);

  // Memoize the filtered list to avoid re-calculating on every render
  const filteredClassrooms = useMemo(() => {
    if (!searchTerm) return classrooms;
    return classrooms.filter(
      (classroom) =>
        classroom.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        classroom.code?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [classrooms, searchTerm]);

  const handleAdd = async (data: ClassroomFormData) => {
    if (!user) return;
    await addClassroom({ ...data, user_id: user.id });
    formMethods.reset();
    showNotification('Classroom created successfully!');
    setRandomPresetColor(getRandomPresetColor());
  };

  const handleSave = async (data: ClassroomFormData) => {
    if (!editingClassroom) return;
    await updateClassroom(editingClassroom.id, data);
    setEditingClassroom(null);
    showNotification('Classroom updated successfully!');
    setRandomPresetColor(getRandomPresetColor());
  };

  const handleCancel = () => {
    setEditingClassroom(null);
    setRandomPresetColor(getRandomPresetColor());
  };
  const handleEdit = (classroom: Classroom) => setEditingClassroom(classroom);
  const handleDeleteRequest = (id: string) =>
    setClassroomToDelete(classrooms.find((c) => c.id === id) || null);

  const handleConfirmDelete = async () => {
    if (!classroomToDelete) return;
    const isUsed = classSessions.some((session) => session.classroom?.id === classroomToDelete.id);
    if (isUsed) {
      showNotification(
        `Cannot delete "${classroomToDelete.name}". It is used in one or more classes.`
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

  return (
    <>
      <div className="flex flex-col md:flex-row-reverse gap-8">
        <div className="w-full md:w-96">
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <h2 className="text-xl font-semibold mb-4 text-center">
              {editingClassroom ? 'Edit Classroom' : 'Create Classroom'}
            </h2>
            <FormProvider {...formMethods}>
              <form onSubmit={formMethods.handleSubmit(editingClassroom ? handleSave : handleAdd)}>
                <fieldset disabled={isSubmitting} className="space-y-1">
                  <ClassroomFields
                    control={formMethods.control}
                    errors={formMethods.formState.errors}
                  />
                  <div className="flex gap-2 pt-4">
                    <ActionButton type="submit" loading={isSubmitting} className="flex-1">
                      {editingClassroom ? 'Save Changes' : 'Create'}
                    </ActionButton>
                    {editingClassroom && (
                      <ActionButton type="button" variant="secondary" onClick={handleCancel}>
                        Cancel
                      </ActionButton>
                    )}
                  </div>
                </fieldset>
              </form>
            </FormProvider>
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-xl font-semibold mb-4">Classrooms</h2>

          {/* NEW: Search input */}
          <div className="mb-4">
            <FormField
              id="search-classrooms"
              label="Search Classrooms"
              placeholder="Search by name or code..."
              value={searchTerm}
              onChange={setSearchTerm}
            />
          </div>

          {isLoading && <LoadingSpinner text="Loading classrooms..." />}
          {error && <ErrorMessage message={error} />}
          {!isLoading && !error && (
            <>
              {filteredClassrooms.length === 0 ? (
                <div className="text-center py-8 px-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-500">No classrooms created yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Use the filtered list for rendering */}
                  {filteredClassrooms.map((classroom) => (
                    <ClassroomCard
                      key={classroom.id}
                      classroom={classroom}
                      onEdit={handleEdit}
                      onDelete={handleDeleteRequest}
                    />
                  ))}
                </div>
              )}
            </>
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
        Are you sure you want to delete the classroom "{classroomToDelete?.name}"?
      </ConfirmModal>
    </>
  );
};

export default ClassroomManagement;
