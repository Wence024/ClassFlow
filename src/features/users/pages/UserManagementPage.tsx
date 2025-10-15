import { useMemo, useState } from 'react';
import { useUsers } from '../hooks/useUsers';
import { usePrograms } from '../../programs/hooks/usePrograms';
import { useDepartments } from '../../departments/hooks/useDepartments';
import { useAuth } from '../../auth/hooks/useAuth';
import {
  Card,
  ErrorMessage,
  LoadingSpinner,
  Alert,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui';
import FormField from '@/components/ui/custom/form-field';
import type { UserProfile, Role } from '../types/user';
import { inviteUser } from '../services/usersService';
import { toast } from 'sonner';
import { UserPlus } from 'lucide-react';

/**
 * A page for administrators to manage user roles, programs, and departments.
 *
 * @returns The user management page component.
 */
export default function UserManagementPage() {
  const { isAdmin } = useAuth();
  const { listQuery: usersQuery, updateMutation } = useUsers();
  const { listQuery: programsQuery } = usePrograms();
  const { listQuery: departmentsQuery } = useDepartments();
  const [searchTerm, setSearchTerm] = useState('');
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [inviteLoading, setInviteLoading] = useState(false);
  const [inviteForm, setInviteForm] = useState({
    email: '',
    role: 'program_head' as Role,
    program_id: null as string | null,
    department_id: null as string | null,
  });

  const filtered = useMemo(() => {
    const list = usersQuery.data || [];
    if (!searchTerm) return list;
    const q = searchTerm.toLowerCase();
    return list.filter((u) => u.full_name?.toLowerCase().includes(q));
  }, [usersQuery.data, searchTerm]);

  const handleUpdate = async (userId: string, field: 'role' | 'program_id' | 'department_id', value: string | null) => {
    await updateMutation.mutateAsync({
      userId,
      updates: { [field]: value || null },
    });
  };

  const handleInviteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteForm.email || !inviteForm.role) {
      toast.error('Email and role are required');
      return;
    }

    setInviteLoading(true);
    try {
      await inviteUser(inviteForm);
      toast.success(`Invitation sent to ${inviteForm.email}`);
      setInviteDialogOpen(false);
      setInviteForm({
        email: '',
        role: 'program_head',
        program_id: null,
        department_id: null,
      });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to send invitation');
    } finally {
      setInviteLoading(false);
    }
  };

  if (!isAdmin()) {
    return <Alert variant="destructive">You do not have access to this page.</Alert>;
  }

  if (usersQuery.isLoading || programsQuery.isLoading || departmentsQuery.isLoading) {
    return <LoadingSpinner text="Loading users..." />;
  }

  if (usersQuery.error) return <ErrorMessage message="Failed to load users." />;
  if (programsQuery.error) return <ErrorMessage message="Failed to load programs." />;
  if (departmentsQuery.error) return <ErrorMessage message="Failed to load departments." />;

  const programs = programsQuery.data || [];
  const departments = departmentsQuery.data || [];

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">User Management</h1>
        
        <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              Invite User
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Invite New User</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleInviteSubmit} className="space-y-4">
              <FormField
                id="invite-email"
                label="Email"
                type="email"
                value={inviteForm.email}
                onChange={(val) => setInviteForm({ ...inviteForm, email: val })}
                required
              />
              
              <div>
                <label className="text-sm font-medium mb-2 block">Role</label>
                <Select
                  value={inviteForm.role}
                  onValueChange={(value) => setInviteForm({ ...inviteForm, role: value as Role })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="department_head">Department Head</SelectItem>
                    <SelectItem value="program_head">Program Head</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Program</label>
                <Select
                  value={inviteForm.program_id || 'none'}
                  onValueChange={(value) => setInviteForm({ ...inviteForm, program_id: value === 'none' ? null : value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select program" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {programs.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.short_code} - {p.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Department</label>
                <Select
                  value={inviteForm.department_id || 'none'}
                  onValueChange={(value) => setInviteForm({ ...inviteForm, department_id: value === 'none' ? null : value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {departments.map((d) => (
                      <SelectItem key={d.id} value={d.id}>
                        {d.code} - {d.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button type="submit" loading={inviteLoading} className="w-full">
                Send Invitation
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="mb-4">
        <FormField
          id="search-users"
          placeholder="Search by name..."
          label="Search Users"
          value={searchTerm}
          onChange={setSearchTerm}
        />
      </div>

      <div className="space-y-2">
        {filtered.length === 0 ? (
          <div className="text-gray-500">No users found.</div>
        ) : (
          filtered.map((user) => (
            <UserCard
              key={user.id}
              user={user}
              programs={programs}
              departments={departments}
              onUpdate={handleUpdate}
              isUpdating={updateMutation.isPending}
            />
          ))
        )}
      </div>

      {updateMutation.error && (
        <Alert variant="destructive" className="mt-4">Failed to update user.</Alert>
      )}
    </div>
  );
}

type UserCardProps = {
  user: UserProfile;
  programs: Array<{ id: string; name: string; short_code: string }>;
  departments: Array<{ id: string; name: string; code: string }>;
  onUpdate: (userId: string, field: 'role' | 'program_id' | 'department_id', value: string | null) => Promise<void>;
  isUpdating: boolean;
};

/**
 * Renders a card for managing a single user's profile.
 *
 * @param uc - The props for the component.
 * @param uc.user - The user profile data.
 * @param uc.programs - The list of available programs.
 * @param uc.departments - The list of available departments.
 * @param uc.onUpdate - The function to call when updating the user.
 * @param uc.isUpdating - A boolean indicating if the user is being updated.
 * @returns The rendered user card.
 */
const UserCard: React.FC<UserCardProps> = ({ user, programs, departments, onUpdate, isUpdating }) => {
  return (
    <Card className="p-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
        <div className="font-medium">{user.full_name || 'No name'}</div>
        
        <Select
          value={user.role}
          onValueChange={(value) => onUpdate(user.id, 'role', value)}
          disabled={isUpdating}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="department_head">Department Head</SelectItem>
            <SelectItem value="program_head">Program Head</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={user.program_id || 'none'}
          onValueChange={(value) => onUpdate(user.id, 'program_id', value === 'none' ? null : value)}
          disabled={isUpdating}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select program" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">None</SelectItem>
            {programs.map((p) => (
              <SelectItem key={p.id} value={p.id}>
                {p.short_code} - {p.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={user.department_id || 'none'}
          onValueChange={(value) => onUpdate(user.id, 'department_id', value === 'none' ? null : value)}
          disabled={isUpdating}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select department" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">None</SelectItem>
            {departments.map((d) => (
              <SelectItem key={d.id} value={d.id}>
                {d.code} - {d.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </Card>
  );
};
