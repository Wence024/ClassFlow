/**
 * Component for viewing pending resource requests.
 */

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { X, CheckCircle, XCircle, Clock } from 'lucide-react';
import type { ResourceRequest } from '@/types/resourceRequest';

type RequestCardProps = {
  request: ResourceRequest;
  onDismiss: (requestId: string) => void;
  onCancel: (request: ResourceRequest) => void;
  isDismissing: boolean;
  isCancelling: boolean;
};

/**
 * Card displaying a single resource request with actions.
 *
 * @param root0
 * @param root0.request
 * @param root0.onDismiss
 * @param root0.onCancel
 * @param root0.isDismissing
 * @param root0.isCancelling
 */
export function RequestCard({
  request,
  onDismiss,
  onCancel,
  isDismissing,
  isCancelling,
}: RequestCardProps) {
  const getStatusBadge = () => {
    switch (request.status) {
      case 'pending':
        return (
          <Badge variant="outline" className="gap-1">
            <Clock className="h-3 w-3" />
            Pending
          </Badge>
        );
      case 'approved':
        return (
          <Badge variant="default" className="gap-1 bg-green-600">
            <CheckCircle className="h-3 w-3" />
            Approved
          </Badge>
        );
      case 'rejected':
        return (
          <Badge variant="destructive" className="gap-1">
            <XCircle className="h-3 w-3" />
            Rejected
          </Badge>
        );
      default:
        return null;
    }
  };

  const canCancel = request.status === 'pending' || request.status === 'approved';
  const canDismiss = (request.status === 'approved' || request.status === 'rejected') && !request.dismissed;

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-base capitalize">
              {request.resource_type} Request
            </CardTitle>
            <CardDescription>
              Requested on {new Date(request.requested_at || '').toLocaleDateString()}
            </CardDescription>
          </div>
          {getStatusBadge()}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {request.notes && (
          <div className="text-sm text-muted-foreground">
            <span className="font-medium">Notes:</span> {request.notes}
          </div>
        )}
        
        {request.status === 'rejected' && request.rejection_message && (
          <div className="rounded-md bg-destructive/10 p-3 text-sm">
            <span className="font-medium text-destructive">Rejection Reason:</span>
            <p className="mt-1 text-muted-foreground">{request.rejection_message}</p>
          </div>
        )}

        {request.reviewed_at && (
          <div className="text-xs text-muted-foreground">
            Reviewed on {new Date(request.reviewed_at).toLocaleDateString()}
          </div>
        )}

        <div className="flex gap-2 pt-2">
          {canCancel && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onCancel(request)}
              disabled={isCancelling}
            >
              <X className="h-4 w-4 mr-1" />
              Cancel Request
            </Button>
          )}
          {canDismiss && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDismiss(request.id)}
              disabled={isDismissing}
            >
              Dismiss
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

type RequestsListProps = {
  requests: ResourceRequest[];
  onDismiss: (requestId: string) => void;
  onCancel: (request: ResourceRequest) => void;
  isDismissing: boolean;
  isCancelling: boolean;
};

/**
 * List of resource request cards.
 *
 * @param root0
 * @param root0.requests
 * @param root0.onDismiss
 * @param root0.onCancel
 * @param root0.isDismissing
 * @param root0.isCancelling
 */
export function RequestsList({
  requests,
  onDismiss,
  onCancel,
  isDismissing,
  isCancelling,
}: RequestsListProps) {
  const activeRequests = requests.filter(r => !r.dismissed);

  if (activeRequests.length === 0) {
    return (
      <div className="text-center py-8 px-4 bg-muted/50 rounded-lg">
        <p className="text-muted-foreground">No resource requests found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {activeRequests.map((request) => (
        <RequestCard
          key={request.id}
          request={request}
          onDismiss={onDismiss}
          onCancel={onCancel}
          isDismissing={isDismissing}
          isCancelling={isCancelling}
        />
      ))}
    </div>
  );
}
