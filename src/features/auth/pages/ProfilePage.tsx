import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Card } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Alert } from '../../../components/ui/alert';

/**
 * Renders the user's profile page, allowing them to view and update their display name.
 *
 * @returns The profile page component.
 */
export default function ProfilePage() {
  const { user, updateMyProfile, loading, error } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [success, setSuccess] = useState<string | null>(null);

  if (!user)
    return <Alert variant="destructive">You must be logged in to manage your profile.</Alert>;

  const onSave = async () => {
    setSuccess(null);
    await updateMyProfile({ name });
    setSuccess('Profile updated successfully.');
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
        <div className="space-y-1">
          <div className="text-sm text-gray-600">Role</div>
          <div>{user.role}</div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="text-sm text-gray-600">Program</div>
            <div>{user.program_id || '—'}</div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Department</div>
            <div>{user.department_id || '—'}</div>
          </div>
        </div>
        <div className="flex gap-2 pt-2">
          <Button onClick={onSave} disabled={loading}>
            Save
          </Button>
        </div>
        {error && <Alert variant="destructive">{error}</Alert>}
        {success && <Alert>{success}</Alert>}
      </Card>
    </div>
  );
}
