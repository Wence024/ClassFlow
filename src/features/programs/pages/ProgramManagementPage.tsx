import { useMemo, useState, useEffect } from 'react';
import { usePrograms } from '../hooks/usePrograms';
import { useAuth } from '../../auth/hooks/useAuth';
import {
  Button,
  Card,
  ConfirmModal,
  ErrorMessage,
  LoadingSpinner,
  Alert,
} from '@/components/ui';
import type { Program } from '../types/program';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { programSchema, type ProgramFormData } from '../types/validation';
import { ProgramFields, ProgramCard } from './components/program';
import FormField from '@/components/ui/custom/form-field';

/**
 * A page for administrators to create, read, update, and delete programs.
 * It provides a form for creating/editing and a searchable list of existing programs.
 *
 * @returns The program management page component.
 */
export default function ProgramManagementPage() {
  const { isAdmin } = useAuth();
  const { listQuery, createMutation, updateMutation, deleteMutation } = usePrograms();
  const [searchTerm, setSearchTerm] = useState('');
  const [editing, setEditing] = useState<Program | null>(null);
  const [toDelete, setToDelete] = useState<Program | null>(null);

  const formMethods = useForm<ProgramFormData>({
    resolver: zodResolver(programSchema),
    defaultValues: { name: '', short_code: '' },
  });

  useEffect(() => {
    if (editing) {
      formMethods.reset({ name: editing.name, short_code: editing.short_code });
    } else {
      formMethods.reset({ name: '', short_code: '' });
    }
  }, [editing, formMethods]);

  const filtered = useMemo(() => {
    const list = listQuery.data || [];
    if (!searchTerm) return list;
    const q = searchTerm.toLowerCase();
    return list.filter((p) => p.name.toLowerCase().includes(q) || p.short_code.toLowerCase().includes(q));
  }, [listQuery.data, searchTerm]);

  const onCreate = async (data: ProgramFormData) => {
    await createMutation.mutateAsync({ name: data.name, short_code: data.short_code });
    formMethods.reset();
  };

  const onSaveEdit = async () => {
    if (!editing) return;
    const values = formMethods.getValues();
    await updateMutation.mutateAsync({ id: editing.id, update: { name: values.name, short_code: values.short_code } });
    setEditing(null);
  };

  if (!isAdmin()) {
    return <Alert variant="destructive">You do not have access to this page.</Alert>;
  }

  if (listQuery.isLoading) return <LoadingSpinner text="Loading programs..." />;
  if (listQuery.error) return <ErrorMessage message="Failed to load programs." />;

  return (
    <>
      <div className="max-w-6xl mx-auto p-4 flex flex-col md:flex-row-reverse gap-8">
        <div className="w-full md:w-96">
          <Card className="p-4 space-y-3">
            <div className="font-semibold text-center">{editing ? 'Edit Program' : 'Create Program'}</div>
            <FormProvider {...formMethods}>
              <form onSubmit={formMethods.handleSubmit(editing ? onSaveEdit : onCreate)}>
                <fieldset className="space-y-2">
                  <ProgramFields control={formMethods.control} errors={formMethods.formState.errors} />
                  <div className="flex gap-2 pt-2">
                    <Button type="submit" loading={createMutation.isPending || updateMutation.isPending}>
                      {editing ? 'Save Changes' : 'Create'}
                    </Button>
                    {editing && (
                      <Button type="button" variant="secondary" onClick={() => setEditing(null)}>
                        Cancel
                      </Button>
                    )}
                  </div>
                </fieldset>
              </form>
            </FormProvider>
            {(createMutation.error || updateMutation.error) && (
              <Alert variant="destructive">{editing ? 'Failed to update program.' : 'Failed to create program.'}</Alert>
            )}
          </Card>
        </div>

        <div className="flex-1 min-w-0">
          <div className="p-4 space-y-3">
          <h1 className="text-3xl font-bold mb-6">Programs</h1>
            <div className="mb-2">
              <FormField
                id="search-programs"
                placeholder="Search by name or code..."
                label="Search Programs"
                value={searchTerm}
                onChange={setSearchTerm}
              />
            </div>
            <div className="space-y-2">
              {filtered.length === 0 ? (
                <div className="text-gray-500">No programs found.</div>
              ) : (
                filtered.map((p) => (
                  <ProgramCard key={p.id} program={p} onEdit={setEditing} onDelete={(id) => setToDelete(filtered.find((x) => x.id === id) || null)} />
                ))
              )}
            </div>
            {deleteMutation.error && (
              <Alert variant="destructive">Delete failed.</Alert>
            )}
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={!!toDelete}
        title="Confirm Deletion"
        onClose={() => setToDelete(null)}
        onConfirm={async () => {
          if (!toDelete) return;
          await deleteMutation.mutateAsync(toDelete.id);
          setToDelete(null);
          if (editing?.id === toDelete.id) setEditing(null);
        }}
        isLoading={deleteMutation.isPending}
        confirmText="Delete"
      >
        Are you sure you want to delete the program "{toDelete?.name}"?
      </ConfirmModal>
    </>
  );
}
