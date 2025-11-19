import { useAuth } from '../../shared/auth/hooks/useAuth';
import { Alert, Card } from '../../../components/ui';
import AdminInstructorManagement from '../../classSessionComponents/pages/AdminInstructorManagement';

/**
 * Renders the main dashboard for Department Heads.
 * This page provides access to department-specific management tools,
 * primarily for managing instructors within their department.
 * Admins also use this view to manage instructors across all departments.
 *
 * @returns The Department Head Dashboard component.
 */
export default function DepartmentHeadDashboard() {
  const { isDepartmentHead, isAdmin } = useAuth();

  if (!isDepartmentHead() && !isAdmin()) {
    return <Alert variant="destructive">You do not have access to this page.</Alert>;
  }

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Department Head Dashboard</h1>
      </div>
      <Card className="p-4">
        <div className="text-sm text-gray-600 mb-2">
          {isAdmin()
            ? 'Manage instructors across all departments'
            : 'Manage instructors for your department'}
        </div>
        <AdminInstructorManagement />
      </Card>
    </div>
  );
}
