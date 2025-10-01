import { useMemo, useState, useEffect } from 'react';
import { useDepartments } from '../hooks/useDepartments';
import { useAuth } from '../../auth/hooks/useAuth';
import {
  Button,
  Card,
  ConfirmModal,
  ErrorMessage,
  LoadingSpinner,
  Alert,
} from '../../../components/ui';
import type { Department } from '../types/department';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { departmentSchema, type DepartmentFormData } from '../types/validation';
import { DepartmentFields, DepartmentCard } from './components/department';
import FormField from '@/components/ui/custom/form-field';

export default function DepartmentManagementPage() {
  const { isAdmin } = useAuth();
  const { listQuery, createMutation, updateMutation, deleteMutation } = useDepartments();
  const [searchTerm, setSearchTerm] = useState('');
  const [editing, setEditing] = useState<Department | null>(null);
  const [toDelete, setToDelete] = useState<Department | null>(null);

  const formMethods = useForm<DepartmentFormData>({
    resolver: zodResolver(departmentSchema),
    defaultValues: { name: '', code: '' },
  });

  useEffect(() => {
    if (editing) {
      formMethods.reset({ name: editing.name, code: editing.code });
    } else {
      formMethods.reset({ name: '', code: '' });
    }
  }, [editing, formMethods]);

  const filtered = useMemo(() => {
    const list = listQuery.data || [];
    if (!searchTerm) return list;
    const q = searchTerm.toLowerCase();
    return list.filter((d) => d.name.toLowerCase().includes(q) || d.code.toLowerCase().includes(q));
  }, [listQuery.data, searchTerm]);

  const onCreate = async (data: DepartmentFormData) => {
    await createMutation.mutateAsync({ name: data.name, code: data.code });
    formMethods.reset();
  };

  const onSaveEdit = async () => {
    if (!editing) return;
    const values = formMethods.getValues();
    await updateMutation.mutateAsync({ id: editing.id, update: { name: values.name, code: values.code } });
    setEditing(null);
  };

  if (!isAdmin()) {
    return <Alert variant="destructive">You do not have access to this page.</Alert>;
  }

  if (listQuery.isLoading) return <LoadingSpinner text="Loading departments..." />;
  if (listQuery.error) return <ErrorMessage message="Failed to load departments." />;

  return (
    <>
      <div className="max-w-6xl mx-auto p-4 flex flex-col md:flex-row-reverse gap-8">
        <div className="w-full md:w-96">
          <Card className="p-4 space-y-3">
            <div className="font-semibold text-center">{editing ? 'Edit Department' : 'Create Department'}</div>
            <FormProvider {...formMethods}>
              <form onSubmit={formMethods.handleSubmit(editing ? onSaveEdit : onCreate)}>
                <fieldset className="space-y-2">
                  <DepartmentFields control={formMethods.control} errors={formMethods.formState.errors} />
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
              <Alert variant="destructive">{editing ? 'Failed to update department.' : 'Failed to create department.'}</Alert>
            )}
          </Card>
        </div>

        <div className="flex-1 min-w-0">
          <div className="p-4 space-y-3">
          <h1 className="text-3xl font-bold mb-6">Departments</h1>
            <div className="mb-2">
              <FormField
                id="search-departments"
                placeholder="Search by name or code..."
                label="Search Departments"
                value={searchTerm}
                onChange={setSearchTerm}
              />
            </div>
            <div className="space-y-2">
              {filtered.length === 0 ? (
                <div className="text-gray-500">No departments found.</div>
              ) : (
                filtered.map((d) => (
                  <DepartmentCard key={d.id} department={d} onEdit={setEditing} onDelete={(id) => setToDelete(filtered.find((x) => x.id === id) || null)} />
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
        Are you sure you want to delete the department "{toDelete?.name}"?
      </ConfirmModal>
    </>
  );
}


