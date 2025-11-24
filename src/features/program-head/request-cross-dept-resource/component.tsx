/**
 * Component for confirming cross-department resource requests.
 */

import { ConfirmModal } from '@/components/ui';
import type { CrossDeptRequestPayload } from './types';

type CrossDeptRequestModalProps = {
  isOpen: boolean;
  requestPayload: CrossDeptRequestPayload | null;
  departmentName: string;
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

/**
 * Modal for confirming a cross-department resource request.
 *
 * @param props - The component props.
 * @param props.isOpen - Whether the modal is open.
 * @param props.requestPayload - The payload containing the request information.
 * @param props.departmentName - The name of the department to request from.
 * @param props.isLoading - Whether the modal is in a loading state.
 * @param props.onConfirm - Function to call when the request is confirmed.
 * @param props.onCancel - Function to call when the request is cancelled.
 * @returns The CrossDeptRequestModal component.
 */
export function CrossDeptRequestModal({
  isOpen,
  requestPayload,
  departmentName,
  isLoading = false,
  onConfirm,
  onCancel,
}: CrossDeptRequestModalProps) {
  if (!requestPayload) return null;

  return (
    <ConfirmModal
      isOpen={isOpen}
      title="Cross-Department Request Required"
      onClose={onCancel}
      onConfirm={onConfirm}
      isLoading={isLoading}
      confirmText="Create Session & Go to Timetable"
    >
      <div className="space-y-2">
        <p>
          The selected {requestPayload.resourceType} (
          <strong>{requestPayload.resourceName}</strong>) belongs to a different department.
        </p>
        <p className="text-sm text-muted-foreground">
          You'll be redirected to the timetable where you can drag the session to a time slot.
          After placement, a request will be sent to the{' '}
          <strong>{departmentName}</strong> head for approval.
        </p>
      </div>
    </ConfirmModal>
  );
}
