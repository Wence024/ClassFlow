import React, { useState, useEffect, useMemo } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../../shared/auth/hooks/useAuth';
import { useClassGroups } from '../hooks';
import { useClassSessions } from '../../classSessions/hooks/useClassSessions';
import { ClassGroupFields, ClassGroupCard } from './components/classGroup';
import {
  Button,
  ConfirmModal,
  ErrorMessage,
  FormField,
  LoadingSpinner,
} from '../../../components/ui';
import { componentSchemas } from '@/types/validation/components';
import type { ClassGroup } from '../types';
import { toast } from 'sonner';
import { getRandomPresetColor } from '../../../lib/colorUtils';

type ClassGroupFormData = z.infer<typeof componentSchemas.classGroup>;

/**
 * Renders the UI for managing Class Groups.
 * Orchestrates the `useClassGroups` hook with the `ClassGroupFields` form and `ClassGroupCard` list.
 *
 * @returns The ClassGroupManagement component.
 */
const ClassGroupManagement: React.FC = () => {
  const { user } = useAuth();
  const {
    classGroups,
    addClassGroup,
    updateClassGroup,
    removeClassGroup,
    isLoading,
    isSubmitting,
    isRemoving,
    error,
  } = useClassGroups();
  const { classSessions } = useClassSessions();
  const [editingGroup, setEditingGroup] = useState<ClassGroup | null>(null);
  const [groupToDelete, setGroupToDelete] = useState<ClassGroup | null>(null);
  const [searchTerm, setSearchTerm] = useState(''); // <-- NEW: State for the search term
  const [presetColor, setRandomPresetColor] = useState(getRandomPresetColor());

  // The hook can now correctly infer the type without extra help
  const formMethods = useForm<ClassGroupFormData>({
    resolver: zodResolver(componentSchemas.classGroup),
    defaultValues: { name: '', code: '', student_count: 0, color: presetColor },
  });

  useEffect(() => {
    if (editingGroup) {
      formMethods.reset({
        ...editingGroup,
        // Ensure the value passed to the form is a number, not null
        student_count: editingGroup.student_count ?? 0,
      });
    } else {
      formMethods.reset({ name: '', code: '', student_count: 0, color: presetColor });
    }
  }, [editingGroup, formMethods, presetColor]);

  // NEW: Memoize the filtered list to avoid re-calculating on every render
  const filteredClassGroups = useMemo(() => {
    if (!searchTerm) return classGroups;
    return classGroups.filter(
      (classGroup) =>
        classGroup.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        classGroup.code?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [classGroups, searchTerm]);

  const handleAdd = async (data: ClassGroupFormData) => {
    if (!user) return;
    await addClassGroup(data);
    formMethods.reset();
    toast.success('Class group created successfully!');
    setRandomPresetColor(getRandomPresetColor());
  };

  const handleSave = async (data: ClassGroupFormData) => {
    if (!editingGroup) return;
    await updateClassGroup(editingGroup.id, data);
    setEditingGroup(null);
    toast.success('Class group updated successfully!');
    setRandomPresetColor(getRandomPresetColor());
  };

  const handleCancel = () => {
    setEditingGroup(null);
    setRandomPresetColor(getRandomPresetColor());
  };
  const handleEdit = (group: ClassGroup) => setEditingGroup(group);
  const handleDeleteRequest = (id: string) =>
    setGroupToDelete(classGroups.find((g) => g.id === id) || null);

  const handleConfirmDelete = async () => {
    if (!groupToDelete) return;
    const isUsed = classSessions.some((session) => session.group?.id === groupToDelete.id);
    if (isUsed) {
      toast.error(`Cannot delete "${groupToDelete.name}". It is used in one or more classes.`);
      setGroupToDelete(null);
      return;
    }
    await removeClassGroup(groupToDelete.id);
    toast.success('Class group removed successfully.');
    setGroupToDelete(null);
    if (editingGroup?.id === groupToDelete.id) {
      setEditingGroup(null);
    }
  };

  return (
    <>
      <div className="flex flex-col md:flex-row-reverse gap-8">
        <div className="w-full md:w-96">
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <h2 className="text-xl font-semibold mb-4 text-center">
              {editingGroup ? 'Edit Class Group' : 'Create Class Group'}
            </h2>
            <FormProvider {...formMethods}>
              <form onSubmit={formMethods.handleSubmit(editingGroup ? handleSave : handleAdd)}>
                <fieldset disabled={isSubmitting} className="space-y-1">
                  <ClassGroupFields
                    control={formMethods.control}
                    errors={formMethods.formState.errors}
                  />
                  <div className="flex gap-2 pt-4">
                    <Button type="submit" loading={isSubmitting} className="flex-1">
                      {editingGroup ? 'Save Changes' : 'Create'}
                    </Button>
                    {editingGroup && (
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
          <h2 className="text-xl font-semibold mb-4">Class Groups</h2>

          {/* NEW: Search input */}
          <div className="mb-4">
            <FormField
              id="search-class-groups"
              label="Search Class Groups"
              placeholder="Search by name or code..."
              value={searchTerm}
              onChange={setSearchTerm}
            />
          </div>

          {isLoading && <LoadingSpinner text="Loading class groups..." />}
          {error && <ErrorMessage message={error} />}
          {!isLoading && !error && (
            <>
              {/* Use the filtered list for rendering */}
              {filteredClassGroups.length === 0 ? (
                <div className="text-center py-8 px-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-500">No class groups created yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredClassGroups.map((group) => (
                    <ClassGroupCard
                      key={group.id}
                      classGroup={group}
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
        isOpen={!!groupToDelete}
        title="Confirm Deletion"
        onClose={() => setGroupToDelete(null)}
        onConfirm={handleConfirmDelete}
        isLoading={isRemoving}
        confirmText="Delete"
      >
        Are you sure you want to delete the class group "{groupToDelete?.name}"?
      </ConfirmModal>
    </>
  );
};

export default ClassGroupManagement;
