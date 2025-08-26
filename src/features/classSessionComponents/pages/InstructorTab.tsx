import React, { useState, useEffect, useMemo } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../../auth/hooks/useAuth';
import { useInstructors } from '../hooks';
import { useClassSessions } from '../../classSessions/hooks/useClassSessions';
import { InstructorFields, InstructorCard } from './components/instructor';
import {
  ActionButton,
  ConfirmModal,
  ErrorMessage,
  FormField,
  LoadingSpinner,
} from '../../../components/ui';
import { componentSchemas } from '../types/validation';
import type { Instructor } from '../types';
import { showNotification } from '../../../lib/notificationsService';

type InstructorFormData = z.infer<typeof componentSchemas.instructor>;

/**
 * Renders the UI for managing Instructors.
 * Orchestrates the `useInstructors` hook with the `InstructorFields` form and `InstructorCard` list.
 */
const InstructorManagement: React.FC = () => {
  const { user } = useAuth();
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
  showNotification(error || '');
  const { classSessions } = useClassSessions();
  const [editingInstructor, setEditingInstructor] = useState<Instructor | null>(null);
  const [instructorToDelete, setInstructorToDelete] = useState<Instructor | null>(null);
  const [searchTerm, setSearchTerm] = useState(''); // <-- NEW: State for the search term

  const formMethods = useForm<InstructorFormData>({
    resolver: zodResolver(componentSchemas.instructor),
    defaultValues: {
      first_name: '',
      last_name: '',
      color: '#6B7280',
      prefix: '',
      suffix: '',
      code: '',
      contract_type: '',
      email: '',
      phone: '',
    },
  });

  useEffect(() => {
    if (editingInstructor) {
      formMethods.reset({
        ...editingInstructor,
        last_name: editingInstructor.last_name ?? '', // Ensure last_name is not null for the form
      });
    } else {
      formMethods.reset();
    }
  }, [editingInstructor, formMethods]);

  // NEW: Memoize the filtered list to avoid re-calculating on every render
  const filteredInstructors = useMemo(() => {
    if (!searchTerm) return instructors;
    return instructors.filter(
      (instructor) =>
        instructor.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        instructor.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        instructor.code?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [instructors, searchTerm]);

  const handleAdd = async (data: InstructorFormData) => {
    if (!user) return;
    await addInstructor({ ...data, user_id: user.id });
    formMethods.reset();
    showNotification('Instructor added successfully!');
  };

  const handleSave = async (data: InstructorFormData) => {
    if (!editingInstructor) return;
    await updateInstructor(editingInstructor.id, data);
    setEditingInstructor(null);
    showNotification('Instructor updated successfully!');
  };

  const handleCancel = () => setEditingInstructor(null);
  const handleEdit = (instructor: Instructor) => setEditingInstructor(instructor);
  const handleDeleteRequest = (id: string) =>
    setInstructorToDelete(instructors.find((i) => i.id === id) || null);

  const handleConfirmDelete = async () => {
    if (!instructorToDelete) return;
    const isUsed = classSessions.some(
      (session) => session.instructor?.id === instructorToDelete.id
    );
    if (isUsed) {
      showNotification(
        `Cannot delete "${instructorToDelete.first_name} ${instructorToDelete.last_name}". They are assigned to one or more classes.`
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

  return (
    <>
      <div className="flex flex-col md:flex-row-reverse gap-8">
        <div className="w-full md:w-96">
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <h2 className="text-xl font-semibold mb-4 text-center">
              {editingInstructor ? 'Edit Instructor' : 'Create Instructor'}
            </h2>
            <FormProvider {...formMethods}>
              <form onSubmit={formMethods.handleSubmit(editingInstructor ? handleSave : handleAdd)}>
                <fieldset disabled={isSubmitting} className="space-y-1">
                  <InstructorFields
                    control={formMethods.control}
                    errors={formMethods.formState.errors}
                  />
                  <div className="flex gap-2 pt-4">
                    <ActionButton type="submit" loading={isSubmitting} className="flex-1">
                      {editingInstructor ? 'Save Changes' : 'Create'}
                    </ActionButton>
                    {editingInstructor && (
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
          <h2 className="text-xl font-semibold mb-4">Instructors</h2>

          {/* NEW: Search input */}
          <div className="mb-4">
            <FormField
              id="search-instructors"
              label="Search Instructors"
              placeholder="Search by name or code..."
              value={searchTerm}
              onChange={setSearchTerm}
            />
          </div>

          {isLoading && <LoadingSpinner text="Loading instructors..." />}
          {error && <ErrorMessage message={error} />}
          {!isLoading && !error && (
            <>
              {/* Use the filtered list for rendering */}
              {filteredInstructors.length === 0 ? (
                <div className="text-center py-8 px-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-500">No instructors created yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredInstructors.map((instructor) => (
                    <InstructorCard
                      key={instructor.id}
                      instructor={instructor}
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
        isOpen={!!instructorToDelete}
        title="Confirm Deletion"
        onClose={() => setInstructorToDelete(null)}
        onConfirm={handleConfirmDelete}
        isLoading={isRemoving}
        confirmText="Delete"
      >
        Are you sure you want to delete the instructor "{instructorToDelete?.first_name}{' '}
        {instructorToDelete?.last_name}"?
      </ConfirmModal>
    </>
  );
};

export default InstructorManagement;
