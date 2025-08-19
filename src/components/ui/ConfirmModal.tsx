import React from 'react';
import { ActionButton } from './';

/**
 * Props for the ConfirmationModal component.
 */
interface ConfirmModalProps {
  /** A boolean to control the visibility of the modal. */
  isOpen: boolean;
  /** The title text displayed at the top of the modal. */
  title: string;
  /** The main content or question of the modal. Can be a string or any React node. */
  children: React.ReactNode;
  /** A boolean to show a loading state on the confirm button. */
  isLoading?: boolean;
  /** The text to display on the confirmation button. @default 'Confirm' */
  confirmText?: string;
  /** The text to display on the cancel button. @default 'Cancel' */
  cancelText?: string;
  /** A callback function executed when the confirmation button is clicked. */
  onConfirm: () => void;
  /** A callback function executed when the modal is closed (via cancel button or overlay click). */
  onClose: () => void;
}

/**
 * A reusable modal dialog for confirming user actions.
 *
 * It provides a standardized UI for asking the user to confirm a potentially
 * destructive action, such as deletion.
 *
 * @example
 * <ConfirmationModal
 *   isOpen={isModalOpen}
 *   title="Confirm Deletion"
 *   onConfirm={handleDelete}
 *   onClose={() => setIsModalOpen(false)}
 * >
 *   Are you sure you want to delete this item?
 * </ConfirmationModal>
 */
const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  children,
  isLoading = false,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onClose,
}) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={onClose} // Close modal on overlay click
    >
      <div
        className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
      >
        <h2 id="modal-title" className="text-xl font-bold text-gray-800">
          {title}
        </h2>
        <div className="mt-4 text-gray-600">{children}</div>
        <div className="mt-6 flex justify-end gap-3">
          <ActionButton type="button" variant="secondary" onClick={onClose} disabled={isLoading}>
            {cancelText}
          </ActionButton>
          <ActionButton type="button" variant="danger" onClick={onConfirm} loading={isLoading}>
            {confirmText}
          </ActionButton>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
