import React from 'react';
import { Button } from '../button';
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
 * @param cm
 * @param cm.isOpen
 * @param cm.title
 * @param cm.children
 * @param cm.isLoading
 * @param cm.confirmText
 * @param cm.cancelText
 * @param cm.onConfirm
 * @param cm.onClose
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
