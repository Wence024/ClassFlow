import React, { useState, useEffect, useMemo } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../../auth/hooks/useAuth';
import { useInstructors } from '../hooks';
import { useClassSessions } from '../../classSessions/hooks/useClassSessions';
import { useDepartments } from '../../departments/hooks/useDepartments';
import { InstructorFields, InstructorCard } from './components/instructor';
import {
  Button,
  ConfirmModal,
  ErrorMessage,
  FormField,
  LoadingSpinner,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../../components/ui';
import { componentSchemas } from '../types/validation';
import type { Instructor } from '../types';
import { toast } from 'sonner';
import { getRandomPresetColor } from '../../../lib/colorUtils';

type InstructorFormData = z.infer<typeof componentSchemas.instructor>;

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
  const { listQuery: departmentsQuery } = useDepartments();
  
  const [editingInstructor, setEditingInstructor] = useState<Instructor | null>(null);
  const [instructorToDelete, setInstructorToDelete] = useState<Instructor | null>(null);
  const [instructorToReassign, setInstructorToReassign] = useState<Instructor | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [presetColor, setRandomPresetColor] = useState(getRandomPresetColor());
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<string>('');

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
      });
    } else {
      formMethods.reset();
    }
  }, [editingInstructor, formMethods]);

  const departments = departmentsQuery.data || [];
  const departmentOptions = departments.map((d: any) => ({
    label: `${d.name} (${d.code})`,
    value: d.id,
  }));

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
    await updateInstructor(editingInstructor.id, data);
    setEditingInstructor(null);
    toast('Success', { description: 'Instructor updated successfully!' });
    setRandomPresetColor(getRandomPresetColor());
  };

  const handleReassign = async () => {
    if (!instructorToReassign || !selectedDepartmentId) return;
    
    try {
      await updateInstructor(instructorToReassign.id, {
        department_id: selectedDepartmentId,
      } as any);
      toast('Success', { 
        description: `Instructor reassigned to new department successfully!` 
      });
      setInstructorToReassign(null);
      setSelectedDepartmentId('');
    } catch (error) {
      toast('Error', { 
        description: 'Failed to reassign instructor. Please try again.' 
      });
    }
  };

  const handleCancel = () => {
    setEditingInstructor(null);
    setRandomPresetColor(getRandomPresetColor());
  };

  const handleEdit = (instructor: Instructor) => setEditingInstructor(instructor);
  
  const handleDeleteRequest = (id: string) =>
    setInstructorToDelete(instructors.find((i) => i.id === id) || null);

  const handleReassignRequest = (instructor: Instructor) => {
    setInstructorToReassign(instructor);
    setSelectedDepartmentId('');
  };

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
                  <InstructorFields
                    control={formMethods.control}
                    errors={formMethods.formState.errors}
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
                    <div key={instructor.id} className="relative">
                      <InstructorCard
                        instructor={instructor}
                        onEdit={handleEdit}
                        onDelete={handleDeleteRequest}
                      />
                      {isAdmin() && (
                        <div className="absolute top-2 right-2">
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => handleReassignRequest(instructor)}
                            className="text-xs"
                          >
                            Reassign Dept
                          </Button>
                        </div>
                      )}
                    </div>
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

      {/* Reassign Department Modal */}
      <Dialog open={!!instructorToReassign} onOpenChange={(open) => !open && setInstructorToReassign(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reassign Instructor to Department</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <strong>Instructor:</strong> {instructorToReassign?.first_name} {instructorToReassign?.last_name}
            </div>
            <FormField
              id="reassign-department"
              label="New Department"
              placeholder="Select department..."
              value={selectedDepartmentId}
              onChange={setSelectedDepartmentId}
              options={departmentOptions}
            />
            <div className="flex gap-2 justify-end">
              <Button variant="secondary" onClick={() => setInstructorToReassign(null)}>
                Cancel
              </Button>
              <Button 
                onClick={handleReassign}
                disabled={!selectedDepartmentId}
              >
                Reassign
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AdminInstructorManagement;
