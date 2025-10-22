import { useState } from 'react';
import { useAuth } from '../../auth/hooks/useAuth';
import { useDepartments } from '../../departments/hooks/useDepartments';
import { useInstructorsByDepartment } from '../../classSessionComponents/hooks/useInstructors';
import { useResourceRequests } from '../hooks/useResourceRequests';
import { Alert, Button, Card, FormField, LoadingSpinner } from '../../../components/ui';
import type { Department } from '@/features/departments/types/department';
import type { Instructor } from '@/features/classSessionComponents/types';
import type { ResourceRequestInsert } from '../types/resourceRequest';

/**
 * A page for Program Heads to request instructors from other departments.
 *
 * @returns The Program Head instructor request page component.
 */
export default function ProgramHeadRequestPage() {
  const { isProgramHead, user } = useAuth();
  const { listQuery: departmentsQuery } = useDepartments();
  const [targetDepartmentId, setTargetDepartmentId] = useState<string | undefined>(undefined);
  const [selectedInstructorId, setSelectedInstructorId] = useState<string | undefined>(undefined);
  const instructorsQuery = useInstructorsByDepartment(targetDepartmentId);
  const { createRequest } = useResourceRequests();

  if (!isProgramHead()) return <Alert variant="destructive">You do not have access to this page.</Alert>;

  const deptOptions = (departmentsQuery.data || []).map((d: Department) => ({ label: `${d.name} (${d.code})`, value: d.id }));
  const instructorOptions = (instructorsQuery.data || []).map((i: Instructor) => {
    const codeSuffix = i.code ? ` (${i.code})` : '';
    return {
      label: `${i.first_name} ${i.last_name}${codeSuffix}`,
      value: i.id,
    };
  });

  const onSubmit = async () => {
    if (!targetDepartmentId || !selectedInstructorId || !user?.program_id) return;
    const payload: ResourceRequestInsert = {
      requester_id: user.id,
      resource_type: 'instructor',
      resource_id: selectedInstructorId,
      requesting_program_id: user.program_id,
      target_department_id: targetDepartmentId,
      status: 'pending',
    } as any;
    await createRequest(payload);
  };

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-4">
      <h1 className="text-3xl font-bold">Request Instructor</h1>
      <Card className="p-4 space-y-3">
        <FormField
          id="req-department"
          label="Target Department"
          placeholder="Select department..."
          value={targetDepartmentId || ''}
          onChange={(v) => setTargetDepartmentId(v || undefined)}
          options={deptOptions}
        />
        {instructorsQuery.isLoading ? (
          <LoadingSpinner text="Loading instructors..." />
        ) : (
          <FormField
            id="req-instructor"
            label="Instructor"
            placeholder="Select instructor..."
            value={selectedInstructorId || ''}
            onChange={(v) => setSelectedInstructorId(v || undefined)}
            options={instructorOptions}
            disabled={!targetDepartmentId}
          />
        )}
        <div>
          <Button onClick={onSubmit} disabled={!targetDepartmentId || !selectedInstructorId}>Submit Request</Button>
        </div>
      </Card>
    </div>
  );
}