import React from 'react';
import { Button } from '../button/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../dialog';

/**
 * Props for the ConfirmModal component.
 */
interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  children: React.ReactNode;
  isLoading?: boolean;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onClose: () => void;
}

/**
 * A reusable modal dialog for confirming user actions.
 *
 * @param cm The ConfirmModal props.
 * @param cm.isOpen A boolean that determines if the modal is open or not.
 * @param cm.title The title displayed at the top of the modal.
 * @param cm.children The content to display inside the modal.
 * @param cm.isLoading A flag to disable the buttons while loading (default is false).
 * @param cm.confirmText The text for the confirmation button (default is "Confirm").
 * @param cm.cancelText The text for the cancel button (default is "Cancel").
 * @param cm.onConfirm The callback function triggered when the confirm button is clicked.
 * @param cm.onClose The callback function triggered when the close button or cancel button is clicked.
 *
 * @returns A React component that renders a modal dialog with confirm and cancel actions.
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
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription asChild>
            <div>{children}</div>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button type="button" variant="secondary" onClick={onClose} disabled={isLoading}>
            {cancelText}
          </Button>
          <Button type="button" variant="destructive" onClick={onConfirm} disabled={isLoading}>
            {confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmModal;
