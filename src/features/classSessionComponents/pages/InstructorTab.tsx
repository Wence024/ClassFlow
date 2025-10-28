import React, { useState, useEffect, useMemo } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../../auth/hooks/useAuth';
import { useDepartmentId } from '../../auth/hooks/useDepartmentId';
import { useInstructorsUnified } from '../hooks/useInstructorsUnified';
import { useClassSessions } from '../../classSessions/hooks/useClassSessions';
import { AdminInstructorFields, InstructorCard } from './components/instructor';
import {
  Button,
  ConfirmModal,
  ErrorMessage,
  FormField,
  LoadingSpinner,
} from '../../../components/ui';
import { componentSchemas } from '../types/validation';
import type { Instructor } from '../types';
import type { InstructorInsert } from '../types/instructor';
import { toast } from 'sonner';
import { getRandomPresetColor } from '../../../lib/colorUtils';
import { Alert } from '../../../components/ui/alert';

type InstructorFormData = z.infer<typeof componentSchemas.instructor>;

/**
 * Renders the UI for managing Instructors.
 * Orchestrates the `useInstructors` hook with the `InstructorFields` form and `InstructorCard` list.
 *
 * @returns The InstructorManagement component.
 */
const InstructorManagement: React.FC = () => {
  const { user, isProgramHead } = useAuth();
  const departmentId = useDepartmentId();
  
  // Use unified hook that adapts based on role
  const {
    instructors,
    isLoading,
    error,
    addInstructor,
    updateInstructor,
    removeInstructor,
    isSubmitting,
    isRemoving,
    canManage,
  } = useInstructorsUnified();
  
  const { classSessions } = useClassSessions();
  const [editingInstructor, setEditingInstructor] = useState<Instructor | null>(null);
  const [instructorToDelete, setInstructorToDelete] = useState<Instructor | null>(null);
  const [searchTerm, setSearchTerm] = useState(''); // <-- NEW: State for the search term
  const [presetColor, setRandomPresetColor] = useState(getRandomPresetColor());

  const formMethods = useForm<InstructorFormData>({
    resolver: zodResolver(componentSchemas.instructor),
    defaultValues: {
      first_name: '',
      last_name: '',
      color: presetColor,
      prefix: '',
      suffix: '',
      code: '',
      contract_type: '',
      email: '',
      phone: '',
      // For department heads, pre-fill their department_id if available
      department_id: user?.role === 'department_head' ? (departmentId ?? null) : undefined,
    },
  });

  useEffect(() => {
    if (editingInstructor) {
      formMethods.reset({
        ...editingInstructor,
        last_name: editingInstructor.last_name ?? '', // Ensure last_name is not null for the form
        department_id: editingInstructor.department_id ?? '', // Ensure department_id is not null for the form
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
    
    // For department heads, validate they have a department assigned
    if (user.role === 'department_head' && !departmentId) {
      toast.error('You must be assigned to a department before creating instructors. Please contact an administrator.');
      return;
    }
    
    // Explicitly construct instructor data with department_id
    const instructorData: InstructorInsert = {
      first_name: data.first_name,
      last_name: data.last_name,
      prefix: data.prefix || null,
      suffix: data.suffix || null,
      code: data.code || null,
      contract_type: data.contract_type || null,
      email: data.email || null,
      phone: data.phone || null,
      color: data.color || null,
      // For department heads: use their department_id
      // For admins: use the department_id from the form
      department_id: user.role === 'department_head' 
        ? departmentId
        : (data.department_id || null),
    };
    
    await addInstructor(instructorData);
    formMethods.reset();
    toast.success('Instructor added successfully!');
    setRandomPresetColor(getRandomPresetColor());
  };

  const handleSave = async (data: InstructorFormData) => {
    if (!editingInstructor) return;
    await updateInstructor(editingInstructor.id, data);
    setEditingInstructor(null);
    toast('Success', { description: 'Instructor updated successfully!' });
    setRandomPresetColor(getRandomPresetColor());
  };

  const handleCancel = () => {
    setEditingInstructor(null);
    setRandomPresetColor(getRandomPresetColor());
  };
  const handleEdit = (instructor: Instructor) => setEditingInstructor(instructor);
  const handleDeleteRequest = (id: string) =>
    setInstructorToDelete(instructors.find((i) => i.id === id) || null);

  const handleConfirmDelete = async () => {
    if (!instructorToDelete) return;
    const isUsed = classSessions.some(
      (session) => session.instructor?.id === instructorToDelete.id
    );
    if (isUsed) {
      toast('Error', {
        description: `Cannot delete "${instructorToDelete.first_name} ${instructorToDelete.last_name}". They are assigned to one or more classes.`,
      });
      setInstructorToDelete(null);
      return;
    }
    await removeInstructor(instructorToDelete.id);
    toast('Success', { description: 'Instructor removed successfully.' });
    setInstructorToDelete(null);
    if (editingInstructor?.id === instructorToDelete.id) {
      setEditingInstructor(null);
    }
  };

  return (
    <>
      <div className="flex flex-col md:flex-row-reverse gap-8">
        {canManage && (
          <div className="w-full md:w-96">
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <h2 className="text-xl font-semibold mb-4 text-center">
                {editingInstructor ? 'Edit Instructor' : 'Create Instructor'}
              </h2>
            <FormProvider {...formMethods}>
              <form onSubmit={formMethods.handleSubmit(editingInstructor ? handleSave : handleAdd)}>
                <fieldset disabled={isSubmitting || !canManage} className="space-y-1">
                  <AdminInstructorFields
                    control={formMethods.control}
                    errors={formMethods.formState.errors}
                    isEditing={!!editingInstructor}
                    currentDepartmentId={editingInstructor?.department_id ?? undefined}
                  />
                  <div className="flex gap-2 pt-4">
                    <Button type="submit" loading={isSubmitting} className="flex-1">
                      {editingInstructor ? 'Save Changes' : 'Create'}
                    </Button>
                    {editingInstructor && (
                      <Button type="button" variant="secondary" onClick={handleCancel}>
                        Cancel
                      </Button>
                    )}
                  </div>
                </fieldset>
              </form>
            </FormProvider>
          </div>
        </div>
        )}
        <div className="flex-1 min-w-0">
          <h2 className="text-xl font-semibold mb-4">
            {canManage ? 'Instructors' : 'Browse Instructors'}
          </h2>
          
          {isProgramHead() && !canManage && (
            <Alert className="mb-4">
              <p className="text-sm">
                You can browse instructors from all departments to assign them to your class sessions.
                Only department heads can create or modify instructor records.
              </p>
            </Alert>
          )}

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
                      isOwner={canManage}
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