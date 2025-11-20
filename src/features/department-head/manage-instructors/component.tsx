/**
 * UI component for managing instructors (Department Head/Admin).
 */

import React, { useState, useEffect, useMemo } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { useManageInstructors } from './hook';
import { useClassSessions } from '@/features/classSessions/hooks/useClassSessions';
import { InstructorCard } from '@/features/classSessionComponents/pages/components/instructor';
import { AdminInstructorFields } from '@/features/classSessionComponents/pages/components/instructor/AdminInstructorFields';
import {
  Button,
  ConfirmModal,
  ErrorMessage,
  FormField,
  LoadingSpinner,
} from '@/components/ui';
import { componentSchemas } from '@/types/validation/components';
import type { Instructor, InstructorInsert } from '@/types/instructor';
import type { InstructorFormData } from './types';
import { getRandomPresetColor } from '@/lib/colorUtils';

/**
 * Component for managing instructors with full CRUD operations.
 * Supports both admin (cross-department) and department head (scoped) views.
 *
 * @returns The ManageInstructorsView component.
 */
export const ManageInstructorsView: React.FC = () => {
  const {
    instructors,
    isLoading,
    isSubmitting,
    isRemoving,
    error,
    addInstructor,
    updateInstructor,
    removeInstructor,
    canDeleteInstructor,
    user,
    isAdmin,
    departmentId,
  } = useManageInstructors();

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

  // Reset form when editing instructor changes
  useEffect(() => {
    if (editingInstructor) {
      formMethods.reset({
        ...editingInstructor,
        last_name: editingInstructor.last_name ?? '',
        department_id: editingInstructor.department_id ?? undefined,
      });
    } else {
      formMethods.reset();
    }
  }, [editingInstructor, formMethods]);

  // Filter instructors by search term
  const filteredInstructors = useMemo(() => {
    if (!searchTerm) return instructors;
    return instructors.filter(
      (instructor) =>
        instructor.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        instructor.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        instructor.code?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [instructors, searchTerm]);

  /**
   * Handles adding a new instructor.
   *
   * @param data The instructor data to be added.
   * @returns A promise that resolves when the instructor is added.
   */
  const handleAdd = async (data: InstructorFormData) => {
    if (!user) return;

    // Validate department assignment for department heads
    if (!isAdmin && !departmentId) {
      toast.error(
        'You must be assigned to a department before creating instructors. Please contact an administrator.'
      );
      return;
    }

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
      department_id: !isAdmin && departmentId ? departmentId : data.department_id || null,
    };

    await addInstructor(instructorData);
    setRandomPresetColor(getRandomPresetColor());
  };

  /**
   * Handles updating an existing instructor.
   *
   * @param data The updated instructor data.
   * @returns A promise that resolves when the instructor is updated.
   */
  const handleSave = async (data: InstructorFormData) => {
    if (!editingInstructor) return;

    await updateInstructor(editingInstructor.id, data);
    setEditingInstructor(null);
    setRandomPresetColor(getRandomPresetColor());
  };

  /**
   * Cancels editing mode.
   *
   * @returns
   */
  const handleCancel = () => {
    setEditingInstructor(null);
    setRandomPresetColor(getRandomPresetColor());
  };

  /**
   * Initiates edit mode for an instructor.
   *
   * @param instructor The instructor to edit.
   * @returns
   */
  const handleEdit = (instructor: Instructor) => setEditingInstructor(instructor);

  /**
   * Initiates delete confirmation for an instructor.
   *
   * @param id
   */
  const handleDeleteRequest = (id: string) =>
    setInstructorToDelete(instructors.find((i) => i.id === id) || null);

  /**
   * Confirms and executes instructor deletion.
   */
  const handleConfirmDelete = async () => {
    if (!instructorToDelete) return;

    // Check if instructor is in use
    if (!canDeleteInstructor(instructorToDelete.id, classSessions)) {
      toast.error(
        `Cannot delete "${instructorToDelete.first_name} ${instructorToDelete.last_name}". They are assigned to one or more classes.`
      );
      setInstructorToDelete(null);
      return;
    }

    await removeInstructor(instructorToDelete.id);
    setInstructorToDelete(null);

    // Clear edit mode if deleting the currently edited instructor
    if (editingInstructor?.id === instructorToDelete.id) {
      setEditingInstructor(null);
    }
  };

  return (
    <>
      <div className="flex flex-col md:flex-row-reverse gap-8">
        {/* Form Section */}
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

        {/* List Section */}
        <div className="flex-1 min-w-0">
          <h2 className="text-xl font-semibold mb-4">
            Instructors {isAdmin && '(All Departments)'}
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
