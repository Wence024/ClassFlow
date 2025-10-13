import { Bell } from 'lucide-react';
import { useAuth } from '../features/auth/hooks/useAuth';
import { useDepartmentRequests } from '../features/resourceRequests/hooks/useResourceRequests';
import { Popover, PopoverTrigger, PopoverContent, Button } from './ui';
import type { ResourceRequest } from '@/features/resourceRequests/types/resourceRequest';

/**
 * Notification dropdown for department heads and admins to review resource requests.
 * Shows a bell icon with badge count and dropdown list of pending requests.
 *
 * @returns The RequestNotifications component.
 */
export default function RequestNotifications() {
  const { isDepartmentHead, isAdmin, departmentId } = useAuth();
  const { requests, updateRequest } = useDepartmentRequests(departmentId || undefined);

  // Only show for department heads and admins
  if (!isDepartmentHead() && !isAdmin()) {
    return null;
  }

  const pendingRequests = requests.filter((r) => r.status === 'pending');
  const hasNotifications = pendingRequests.length > 0;

  const handleApprove = async (requestId: string) => {
    await updateRequest({ id: requestId, update: { status: 'approved' } });
  };

  const handleReject = async (requestId: string) => {
    await updateRequest({ id: requestId, update: { status: 'rejected' } });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors">
          <Bell className="w-5 h-5" />
          {hasNotifications && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {pendingRequests.length}
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        <div className="p-3 border-b">
          <h3 className="font-semibold">Resource Requests</h3>
          <p className="text-sm text-gray-600">
            {pendingRequests.length} pending request{pendingRequests.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="max-h-96 overflow-y-auto">
          {pendingRequests.length === 0 ? (
            <div className="p-4 text-center text-gray-500">No pending requests</div>
          ) : (
            pendingRequests.map((request: ResourceRequest) => (
              <div key={request.id} className="p-3 border-b last:border-b-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm capitalize">
                      {request.resource_type} Request
                    </div>
                    <div className="text-xs text-gray-600 truncate">
                      Resource ID: {request.resource_id}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(request.requested_at || '').toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <Button
                      size="sm"
                      variant="secondary"
                      className="text-xs px-2 py-1 h-6"
                      onClick={() => handleApprove(request.id)}
                    >
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      className="text-xs px-2 py-1 h-6"
                      onClick={() => handleReject(request.id)}
                    >
                      Reject
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}