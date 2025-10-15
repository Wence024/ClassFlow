import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { usePrograms } from '../../programs/hooks/usePrograms';
import { useDepartments } from '../../departments/hooks/useDepartments';
import { Card } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Alert } from '../../../components/ui/alert';
import LoadingSpinner from '../../../components/ui/custom/loading-spinner';
import { toast } from 'sonner';

/**
 * A page for the authenticated user to view and update their profile information.
 *
 * @returns The user profile page component.
 */
export default function UserProfilePage() {
  const { user, updateMyProfile, loading, error } = useAuth();
  const { listQuery: programsQuery } = usePrograms();
  const { listQuery: departmentsQuery } = useDepartments();
  const [name, setName] = useState(user?.name || '');

  if (!user) return <Alert variant="destructive">You must be logged in to manage your profile.</Alert>;

  if (programsQuery.isLoading || departmentsQuery.isLoading) {
    return <LoadingSpinner text="Loading profile..." />;
  }

  const programs = programsQuery.data || [];
  const departments = departmentsQuery.data || [];
  
  const assignedProgram = programs.find(p => p.id === user.program_id);
  const assignedDepartment = departments.find(d => d.id === user.department_id);

  const onSave = async () => {
    try {
      await updateMyProfile({ name });
      toast('Success', { description: 'Profile updated successfully.' });
    } catch (e) {
      console.error('Failed to update profile:', e);
      toast('Error', { description: error || 'Failed to update profile.' });
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-4">
      <h1 className="text-3xl font-bold">My Profile</h1>

      <Card className="p-4 space-y-3">
        <div className="space-y-1">
          <label className="text-sm font-medium">Display Name</label>
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
        </div>
        <div className="space-y-1">
          <div className="text-sm text-gray-600">Email</div>
          <div>{user.email}</div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="text-sm text-gray-600">Role</div>
            <div className="capitalize">{user.role}</div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Program</div>
            <div>{assignedProgram ? `${assignedProgram.short_code} - ${assignedProgram.name}` : '—'}</div>
          </div>
        </div>
        <div>
          <div className="text-sm text-gray-600">Department</div>
          <div>{assignedDepartment ? `${assignedDepartment.code} - ${assignedDepartment.name}` : '—'}</div>
        </div>
        <div className="flex gap-2 pt-2">
          <Button onClick={onSave} disabled={loading}>Save</Button>
        </div>
      </Card>
    </div>
  );
}
