import { useState } from 'react';
import { Wrench, X } from 'lucide-react';
import { usePrograms } from '../../features/programs/hooks/usePrograms';
import { useDepartments } from '../../features/departments/hooks/useDepartments';
import {
  Card,
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui';

function RoleSwitcher() {
  const { listQuery: programsQuery } = usePrograms();
  const { listQuery: departmentsQuery } = useDepartments();
  
  const [isExpanded, setIsExpanded] = useState(false);
  const [role, setRole] = useState<string>('admin');
  const [programId, setProgramId] = useState<string>('none');
  const [departmentId, setDepartmentId] = useState<string>('none');

  const programs = programsQuery.data || [];
  const departments = departmentsQuery.data || [];

  const applyOverride = () => {
    const override = {
      role,
      program_id: programId === 'none' ? null : programId,
      department_id: departmentId === 'none' ? null : departmentId,
    };
    localStorage.setItem('dev_override', JSON.stringify(override));
    window.location.reload();
  };

  const clearOverride = () => {
    localStorage.removeItem('dev_override');
    window.location.reload();
  };

  const hasOverride = localStorage.getItem('dev_override');

  // Collapsed state - just show icon
  if (!isExpanded) {
    return (
      <Button
        size="icon"
        onClick={() => setIsExpanded(true)}
        className="fixed bottom-4 right-4 shadow-lg z-50 bg-yellow-400 hover:bg-yellow-500 text-yellow-900"
        title="Dev Role Switcher"
      >
        <Wrench className="h-5 w-5" />
      </Button>
    );
  }

  // Expanded state - show full form
  return (
    <Card className="fixed bottom-4 right-4 p-4 shadow-lg z-50 w-80 bg-yellow-50 border-2 border-yellow-400">
      <div className="flex items-center justify-between mb-2">
        <div className="text-xs font-bold text-yellow-800">🔧 DEV ROLE SWITCHER</div>
        <Button
          size="icon"
          variant="ghost"
          onClick={() => setIsExpanded(false)}
          className="h-6 w-6 text-yellow-800 hover:bg-yellow-200"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      {hasOverride && (
        <div className="text-xs text-yellow-700 mb-2 p-2 bg-yellow-100 rounded">
          ⚠️ Override Active
        </div>
      )}

      <div className="space-y-2">
        <div>
          <label className="text-xs font-medium">Role</label>
          <Select value={role} onValueChange={setRole}>
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
          <label className="text-xs font-medium">Program</label>
          <Select value={programId} onValueChange={setProgramId}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              {programs.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.short_code}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-xs font-medium">Department</label>
          <Select value={departmentId} onValueChange={setDepartmentId}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              {departments.map((d) => (
                <SelectItem key={d.id} value={d.id}>
                  {d.code}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2 pt-2">
          <Button size="sm" onClick={applyOverride} className="flex-1">
            Apply
          </Button>
          {hasOverride && (
            <Button size="sm" variant="secondary" onClick={clearOverride}>
              Clear
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}

/**
 * Developer-only role switcher for testing different user personas.
 * Only renders in development mode.
 *
 * @returns The dev role switcher component or null in production.
 */
export default function DevRoleSwitcher() {
  if (import.meta.env.PROD) return null;

  return <RoleSwitcher />;
}
