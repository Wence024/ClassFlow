import React, { useState, useEffect, useMemo } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../../auth/hooks/useAuth';
import { useInstructors } from '../hooks';
import { useClassSessions } from '../../classSessions/hooks/useClassSessions';
import { InstructorCard } from './components/instructor';
import { AdminInstructorFields } from './components/instructor/AdminInstructorFields';
import {
  Button,
  ConfirmModal,
  ErrorMessage,
  FormField,
  LoadingSpinner,
} from '../../../components/ui';
import { componentSchemas } from '../types/validation';
import type { Instructor } from '../types';
import { toast } from 'sonner';
import { getRandomPresetColor } from '../../../lib/colorUtils';

type InstructorFormData = z.infer<typeof componentSchemas.instructor> & {
  department_id?: string;
};

/**
 * Enhanced instructor management for admins and department heads.
 * Allows admins to reassign instructors to different departments.
 *
 * @returns The AdminInstructorManagement component.
 */
const AdminInstructorManagement: React.FC = () => {
  const { user, isAdmin } = useAuth();
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
  const [searchTerm, setSearchTerm] = useState('');
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
    },
  });

  useEffect(() => {
    if (editingInstructor) {
      formMethods.reset({
        ...editingInstructor,
        last_name: editingInstructor.last_name ?? '',
        department_id: (editingInstructor as any).department_id,
      });
    } else {
      formMethods.reset();
    }
  }, [editingInstructor, formMethods]);


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
    await addInstructor({
      ...data,
    } as any);
    formMethods.reset();
    toast('Success', { description: 'Instructor added successfully!' });
    setRandomPresetColor(getRandomPresetColor());
  };

  const handleSave = async (data: InstructorFormData) => {
    if (!editingInstructor) return;
    
    // Check if department was changed (for admins)
    const currentDeptId = (editingInstructor as any).department_id;
    const newDeptId = data.department_id;
    const departmentChanged = isAdmin() && currentDeptId !== newDeptId;
    
    await updateInstructor(editingInstructor.id, data);
    setEditingInstructor(null);
    
    if (departmentChanged) {
      toast('Success', { 
        description: 'Instructor updated and reassigned to new department!' 
      });
    } else {
      toast('Success', { description: 'Instructor updated successfully!' });
    }
    
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
        <div className="w-full md:w-96">
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <h2 className="text-xl font-semibold mb-4 text-center">
              {editingInstructor ? 'Edit Instructor' : 'Create Instructor'}
            </h2>
            <FormProvider {...formMethods}>
              <form onSubmit={formMethods.handleSubmit(editingInstructor ? handleSave : handleAdd)}>
                <fieldset disabled={isSubmitting} className="space-y-1">
                  <AdminInstructorFields
                    control={formMethods.control}
                    errors={formMethods.formState.errors}
                    isEditing={!!editingInstructor}
                    currentDepartmentId={(editingInstructor as any)?.department_id}
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
        
        <div className="flex-1 min-w-0">
          <h2 className="text-xl font-semibold mb-4">
            Instructors {isAdmin() && '(All Departments)'}
          </h2>

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

      {/* Delete Confirmation Modal */}
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

export default AdminInstructorManagement;
