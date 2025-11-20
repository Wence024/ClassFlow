/**
 * UI component for managing classrooms (Admin only).
 */

import React, { useState, useEffect, useMemo } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { useManageClassrooms } from './hook';
import { useClassSessions } from '@/features/classSessions/hooks/useClassSessions';
import { useDepartments } from '@/features/departments/hooks/useDepartments';
import { ClassroomCard, ClassroomFields } from '@/features/classSessionComponents/pages/components/classroom';
import {
  Button,
  ConfirmModal,
  ErrorMessage,
  FormField,
  LoadingSpinner,
} from '@/components/ui';
import { componentSchemas } from '@/types/validation/components';
import type { Classroom, ClassroomInsert } from '@/types/classroom';
import type { ClassroomFormData, DepartmentOption } from './types';
import { getRandomPresetColor } from '@/lib/colorUtils';

/**
 * Component for managing classrooms with full CRUD operations.
 * Admin-only functionality.
 */
export const ManageClassroomsView: React.FC = () => {
  const {
    classrooms,
    isLoading,
    isSubmitting,
    isRemoving,
    error,
    addClassroom,
    updateClassroom,
    removeClassroom,
    canDeleteClassroom,
    getFirstOtherIndex,
    user,
  } = useManageClassrooms();

  const { classSessions } = useClassSessions();
  const { listQuery: departmentsQuery } = useDepartments();

  const [editingClassroom, setEditingClassroom] = useState<Classroom | null>(null);
  const [classroomToDelete, setClassroomToDelete] = useState<Classroom | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [presetColor, setRandomPresetColor] = useState(getRandomPresetColor());

  // Prepare department options with "None" option
  const departmentOptions = useMemo<DepartmentOption[]>(() => {
    const departments = departmentsQuery.data || [];
    const noneOption = { id: '__none__', name: '-- None --' };
    const mappedDepartments = departments.map((d) => ({
      id: d.id,
      name: `${d.name} (${d.code})`,
    }));
    return [noneOption, ...mappedDepartments];
  }, [departmentsQuery.data]);

  const formMethods = useForm<ClassroomFormData>({
    resolver: zodResolver(componentSchemas.classroom),
    defaultValues: { name: '', code: '', capacity: 0, color: presetColor },
  });

  // Reset form when editing classroom changes
  useEffect(() => {
    if (editingClassroom) {
      formMethods.reset({
        ...editingClassroom,
        capacity: editingClassroom.capacity ?? 0,
      });
    } else {
      formMethods.reset({ name: '', code: '', capacity: 0, color: presetColor });
    }
  }, [editingClassroom, formMethods, presetColor]);

  // Filter classrooms by search term
  const filteredClassrooms = useMemo(() => {
    if (!searchTerm) return classrooms;
    return classrooms.filter(
      (classroom) =>
        classroom.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        classroom.code?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [classrooms, searchTerm]);

  // Find separator index for visual distinction
  const firstOtherIndex = useMemo(() => {
    return getFirstOtherIndex(filteredClassrooms);
  }, [filteredClassrooms, getFirstOtherIndex]);

  /**
   * Handles adding a new classroom.
   *
   * @param data The classroom data to be added.
   */
  const handleAdd = async (data: ClassroomFormData) => {
    if (!user) return;
    await addClassroom(data as ClassroomInsert);
    formMethods.reset();
    setRandomPresetColor(getRandomPresetColor());
  };

  /**
   * Handles updating an existing classroom.
   *
   * @param data The updated classroom data.
   */
  const handleSave = async (data: ClassroomFormData) => {
    if (!editingClassroom) return;
    await updateClassroom(editingClassroom.id, data);
    setEditingClassroom(null);
    setRandomPresetColor(getRandomPresetColor());
  };

  /**
   * Cancels editing mode.
   */
  const handleCancel = () => {
    setEditingClassroom(null);
    setRandomPresetColor(getRandomPresetColor());
  };

  /**
   * Initiates edit mode for a classroom.
   *
   * @param classroom The classroom to edit.
   * @returns
   */
  const handleEdit = (classroom: Classroom) => setEditingClassroom(classroom);

  /**
   * Initiates delete confirmation for a classroom.
   *
   * @param id The ID of the classroom to delete.
   * @returns
   */
  const handleDeleteRequest = (id: string) =>
    setClassroomToDelete(classrooms.find((c) => c.id === id) || null);

  /**
   * Confirms and executes classroom deletion.
   */
  const handleConfirmDelete = async () => {
    if (!classroomToDelete) return;

    // Check if classroom is in use
    if (!canDeleteClassroom(classroomToDelete.id, classSessions)) {
      toast.error(`Cannot delete "${classroomToDelete.name}". It is used in one or more classes.`);
      setClassroomToDelete(null);
      return;
    }

    await removeClassroom(classroomToDelete.id);
    setClassroomToDelete(null);

    // Clear edit mode if deleting the currently edited classroom
    if (editingClassroom?.id === classroomToDelete.id) {
      setEditingClassroom(null);
    }
  };

  return (
    <>
      <div className="flex flex-col md:flex-row-reverse gap-8">
        {/* Form Section */}
        <div className="w-full md:w-96">
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <h2 className="text-xl font-semibold mb-4 text-center">
              {editingClassroom ? 'Edit Classroom' : 'Create Classroom'}
            </h2>
            <FormProvider {...formMethods}>
              <form
                onSubmit={formMethods.handleSubmit(editingClassroom ? handleSave : handleAdd)}
              >
                <fieldset
                  data-testid="classroom-form-fieldset"
                  disabled={isSubmitting}
                  className="space-y-1"
                >
                  <ClassroomFields
                    control={formMethods.control}
                    errors={formMethods.formState.errors}
                    departmentOptions={departmentOptions}
                  />
                  <div className="flex gap-2 pt-4">
                    <Button type="submit" loading={isSubmitting} className="flex-1">
                      {editingClassroom ? 'Save Changes' : 'Create'}
                    </Button>
                    {editingClassroom && (
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
          <h2 className="text-xl font-semibold mb-4">Classrooms</h2>

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
                  {filteredClassrooms.map((classroom, index) => (
                    <React.Fragment key={classroom.id}>
                      {/* Visual separator between preferred and other classrooms */}
                      {index === firstOtherIndex &&
                        user?.department_id &&
                        firstOtherIndex > 0 && (
                          <div className="py-2 my-2 text-center text-sm font-semibold text-gray-500 bg-gray-100 rounded-md border-t border-b border-gray-300">
                            Other Classrooms
                          </div>
                        )}
                      <ClassroomCard
                        classroom={classroom}
                        onEdit={handleEdit}
                        onDelete={handleDeleteRequest}
                        isOwner={true}
                      />
                    </React.Fragment>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
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
