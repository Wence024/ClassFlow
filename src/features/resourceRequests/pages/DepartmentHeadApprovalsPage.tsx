import { useAuth } from '../../auth/hooks/useAuth';
import { useDepartmentRequests } from '../hooks/useResourceRequests';
import { Alert, Button, Card, LoadingSpinner } from '../../../components/ui';

export default function DepartmentHeadApprovalsPage() {
  const { isDepartmentHead, isAdmin, departmentId } = useAuth();
  if (!isDepartmentHead() && !isAdmin()) {
    return <Alert variant="destructive">You do not have access to this page.</Alert>;
  }
  const { requests, isLoading, updateRequest } = useDepartmentRequests(departmentId || undefined);

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-4">
      <h1 className="text-3xl font-bold">Pending Resource Requests</h1>
      {isLoading && <LoadingSpinner text="Loading requests..." />}
      {!isLoading && (
        <div className="space-y-2">
          {requests.length === 0 ? (
            <div className="text-gray-500">No pending requests.</div>
          ) : (
            requests.map((r: any) => (
              <Card key={r.id} className="p-3 flex items-center justify-between">
                <div>
                  <div className="font-medium">{r.resource_type} request</div>
                  <div className="text-sm text-gray-600">Status: {r.status}</div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    onClick={() => updateRequest({ id: r.id, update: { status: 'approved' } })}
                  >
                    Approve
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => updateRequest({ id: r.id, update: { status: 'rejected' } })}
                  >
                    Reject
                  </Button>
                </div>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
}




