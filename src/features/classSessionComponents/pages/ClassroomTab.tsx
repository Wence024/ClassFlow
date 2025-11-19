import React, { useState, useEffect, useMemo } from 'react';
// No longer need UseFormReturn
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../../shared/auth/hooks/useAuth';
import { useClassroomsUnified } from '../hooks/useClassroomsUnified';
import { useClassSessions } from '../../classSessions/hooks/useClassSessions';
import { useDepartments } from '../../departments/hooks/useDepartments';
import { ClassroomFields, ClassroomCard } from './components/classroom';
import {
  Alert,
  Button,
  ConfirmModal,
  ErrorMessage,
  FormField,
  LoadingSpinner,
} from '../../../components/ui';
import { componentSchemas } from '../types/validation';
import type { Classroom } from '../types';
import type { ClassroomInsert } from '../types/classroom';
import { toast } from 'sonner';
import { getRandomPresetColor } from '../../../lib/colorUtils';

type ClassroomFormData = z.infer<typeof componentSchemas.classroom>;

/**
 * Renders the UI for managing Classrooms.
 * Orchestrates the `useClassrooms` hook with the `ClassroomFields` form and `ClassroomCard` list.
 *
 * @returns The ClassroomManagement component.
 */
const ClassroomManagement: React.FC = () => {
  const { user, isProgramHead } = useAuth();

  // Use unified hook that adapts based on role
  const {
    classrooms,
    addClassroom,
    updateClassroom,
    removeClassroom,
    isLoading,
    isSubmitting,
    isRemoving,
    error,
    canManage,
  } = useClassroomsUnified();

  const { classSessions } = useClassSessions();
  const { listQuery: departmentsQuery } = useDepartments();

  // Memoize department options with a "None" option using sentinel value
  const departmentOptions = useMemo(() => {
    const departments = departmentsQuery.data || [];
    const noneOption = { id: '__none__', name: '-- None --' };
    const mappedDepartments = departments.map((d) => ({ id: d.id, name: `${d.name} (${d.code})` }));
    return [noneOption, ...mappedDepartments];
  }, [departmentsQuery.data]);

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

  // Find the index where "other" classrooms begin (for separator)
  const firstOtherIndex = useMemo(() => {
    return filteredClassrooms.findIndex((c) => c.preferred_department_id !== user?.department_id);
  }, [filteredClassrooms, user?.department_id]);

  const handleAdd = async (data: ClassroomFormData) => {
    if (!user) return;
    await addClassroom({
      ...data,
      // created_by handled by DB; admin-only manage enforced by RLS
    } as ClassroomInsert);
    formMethods.reset();
    toast.success('Classroom created successfully!');
    setRandomPresetColor(getRandomPresetColor());
  };

  const handleSave = async (data: ClassroomFormData) => {
    if (!editingClassroom) return;
    await updateClassroom(editingClassroom.id, data);
    setEditingClassroom(null);
    toast.success('Classroom updated successfully!');
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
      toast.error(
        `Cannot delete "${classroomToDelete.name}". It is used in one or more classes.`
      );
      setClassroomToDelete(null);
      return;
    }
    await removeClassroom(classroomToDelete.id);
    toast.success('Classroom removed successfully.');
    setClassroomToDelete(null);
    if (editingClassroom?.id === classroomToDelete.id) {
      setEditingClassroom(null);
    }
  };

  return (
    <>
      <div className="flex flex-col md:flex-row-reverse gap-8">
        {/* Only show form for admins/dept heads */}
        {canManage && (
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
        )}
        <div className="flex-1 min-w-0">
          <h2 className="text-xl font-semibold mb-4">Classrooms</h2>

          {/* Informational alert for program heads */}
          {isProgramHead() && !canManage && (
            <Alert className="mb-4">
              <p className="text-sm">
                You are viewing all available classrooms. Only administrators and department heads
                can create or modify classrooms.
              </p>
            </Alert>
          )}

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
                  {filteredClassrooms.map((classroom, index) => (
                    <React.Fragment key={classroom.id}>
                      {/* Visual separator between preferred and other classrooms */}
                      {index === firstOtherIndex && user?.department_id && firstOtherIndex > 0 && (
                        <div className="py-2 my-2 text-center text-sm font-semibold text-gray-500 bg-gray-100 rounded-md border-t border-b border-gray-300">
                          Other Classrooms
                        </div>
                      )}
                      <ClassroomCard
                        classroom={classroom}
                        onEdit={handleEdit}
                        onDelete={handleDeleteRequest}
                        isOwner={canManage}
                      />
                    </React.Fragment>
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
