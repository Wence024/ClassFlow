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
 * @param root0
 * @param root0.isOpen
 * @param root0.requestPayload
 * @param root0.departmentName
 * @param root0.isLoading
 * @param root0.onConfirm
 * @param root0.onCancel
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
