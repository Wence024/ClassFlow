import { useState } from 'react';
import { useDepartments } from '../hooks/useDepartments';
import { useAuth } from '../../auth/hooks/useAuth';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Card } from '../../../components/ui/card';
import { Alert } from '../../../components/ui/alert';

export default function DepartmentManagementPage() {
  const { isAdmin } = useAuth();
  const { listQuery, createMutation, updateMutation, deleteMutation } = useDepartments();
  const [name, setName] = useState('');
  const [code, setCode] = useState('');

  if (!isAdmin()) {
    return <Alert variant="destructive">You do not have access to this page.</Alert>;
  }

  if (listQuery.isLoading) return <div>Loading departments...</div>;
  if (listQuery.error) return <Alert variant="destructive">Failed to load departments.</Alert>;

  const onCreate = async () => {
    if (!name || !code) return;
    await createMutation.mutateAsync({ name, code });
    setName('');
    setCode('');
  };

  return (
    <div className="p-4 space-y-4">
      <Card className="p-4 space-y-2">
        <div className="font-semibold">Create Department</div>
        <div className="flex gap-2">
          <Input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
          <Input placeholder="Code" value={code} onChange={(e) => setCode(e.target.value)} />
          <Button onClick={onCreate} disabled={createMutation.isPending}>Add</Button>
        </div>
        {createMutation.error && (
          <Alert variant="destructive">Failed to create department.</Alert>
        )}
      </Card>

      <Card className="p-4 space-y-3">
        <div className="font-semibold">Departments</div>
        <div className="space-y-2">
          {(listQuery.data || []).map((d) => (
            <div key={d.id} className="flex items-center gap-2">
              <div className="flex-1">{d.name} ({d.code})</div>
              <Button
                variant="secondary"
                onClick={() => updateMutation.mutate({ id: d.id, update: { name: d.name, code: d.code } })}
                disabled={updateMutation.isPending}
              >
                Save
              </Button>
              <Button
                variant="destructive"
                onClick={() => deleteMutation.mutate(d.id)}
                disabled={deleteMutation.isPending}
              >
                Delete
              </Button>
            </div>
          ))}
        </div>
        {(updateMutation.error || deleteMutation.error) && (
          <Alert variant="destructive">Update/Delete failed.</Alert>
        )}
      </Card>
    </div>
  );
}


