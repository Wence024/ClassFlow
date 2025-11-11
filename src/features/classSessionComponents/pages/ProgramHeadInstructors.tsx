import { useState, useMemo } from 'react';
import { useAuth } from '../../auth/hooks/useAuth';
import { useDepartments } from '../../departments/hooks/useDepartments';
import { useAllInstructors } from '../hooks/useAllInstructors';
import { Alert, Card, FormField, LoadingSpinner } from '../../../components/ui';
import { InstructorCard } from './components/instructor';
import type { Department } from '@/features/departments/types/department';
import type { Instructor } from '../types';

/**
 * A page for Program Heads to browse and search for instructors by department.
 *
 * @returns The ProgramHeadInstructors page component.
 */
export default function ProgramHeadInstructors() {
  const { isProgramHead } = useAuth();
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<string | undefined>(undefined);
  const { listQuery: departmentsQuery } = useDepartments();
  const { instructors: allInstructors, isLoading } = useAllInstructors();
  const [search, setSearch] = useState('');

  // Hooks must be called unconditionally at the top level.
  const deptOptions = useMemo(() => departmentsQuery.data || [], [departmentsQuery.data]);

  // Filter instructors by selected department and search term
  const filtered = useMemo(() => {
    let list = allInstructors || [];

    // Filter by department if one is selected
    if (selectedDepartmentId) {
      list = list.filter((i) => i.department_id === selectedDepartmentId);
    }

    // Filter by search term
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (i) =>
          i.first_name.toLowerCase().includes(q) ||
          i.last_name.toLowerCase().includes(q) ||
          i.code?.toLowerCase().includes(q) ||
          i.department_name?.toLowerCase().includes(q)
      );
    }

    return list;
  }, [allInstructors, selectedDepartmentId, search]);

  // The permission check now happens before rendering.
  if (!isProgramHead()) {
    return <Alert variant="destructive">You do not have access to this page.</Alert>;
  }

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-4">
      <h1 className="text-3xl font-bold">Browse Instructors by Department</h1>

      <Card className="p-4 space-y-3">
        <FormField
          id="department-select"
          label="Department"
          type="select"
          placeholder="Select department..."
          value={selectedDepartmentId || ''}
          onChange={(v) => setSelectedDepartmentId(v || undefined)}
          options={deptOptions.map((d: Department) => ({
            label: `${d.name} (${d.code})`,
            value: d.id,
          }))}
        />
        <FormField
          id="search-instructors"
          label="Search Instructors"
          placeholder="Search by name or code..."
          value={search}
          onChange={setSearch}
        />
      </Card>

      {isLoading && <LoadingSpinner text="Loading instructors..." />}
      {!isLoading && (
        <div className="space-y-2">
          {filtered.length === 0 ? (
            <div className="text-gray-500">No instructors found.</div>
          ) : (
            filtered.map((i: Instructor) => (
              <InstructorCard key={i.id} instructor={i} onEdit={() => {}} onDelete={() => {}} />
            ))
          )}
        </div>
      )}
    </div>
  );
}
